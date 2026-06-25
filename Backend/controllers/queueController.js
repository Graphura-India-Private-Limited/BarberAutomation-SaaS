const Queue = require("../models/Queue");
const Notification = require("../models/Notification");
const mongoose = require("mongoose");
const Booking = require("../models/Booking");
const Barber = require("../models/Barber");
const Customer = require("../models/Customer");

// @desc    Get active queue entries for a specific salon
// @route   GET /api/queue/:salon_id
// @access  Private (Authenticated users)
exports.getSalonQueue = async (req, res, next) => {
  try {
    const { salon_id } = req.params;

    // ✅ Defensive check: If the passed ID isn't a valid ObjectId format, safely exit instead of crashing
    if (!mongoose.Types.ObjectId.isValid(salon_id)) {
      return res.status(200).json({ success: true, queue: [] });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Clean up stale active queue entries from previous days
    await Queue.deleteMany({
      salon_id: salon_id,
      status: { $in: ["waiting", "in-progress", "paused", "delayed"] },
      joined_at: { $lt: today }
    });

    let queue = await Queue.find({
      salon_id: salon_id,
      status: { $in: ["waiting", "in-progress", "paused"] }
    })
      .populate("customer_id")
      .populate("barber_id")
      .populate("booking_id");

    // If active queue is empty, auto-seed default mock entries if total active count is 0
    if (queue.length === 0) {
      const activeCount = await Queue.countDocuments({
        salon_id,
        status: { $in: ["waiting", "in-progress", "paused", "delayed"] }
      });
      if (activeCount === 0) {
        // Fetch active barbers of this salon to map them
        const barbers = await Barber.find({ salon_id, is_active: true });
        
        // Find specific barbers by name if possible, or use first few
        const aliBarber = barbers.find(b => b.name.toLowerCase().includes("ali")) || barbers[0];
        const raviBarber = barbers.find(b => b.name.toLowerCase().includes("ravi")) || barbers[1] || barbers[0];

        // Create the 4 mock customers
        const customerData = [
          { name: "Aarav Mehta", mobile: "9876543210" },
          { name: "Kabir Dev", mobile: "9876543211" },
          { name: "Rohan Das", mobile: "9876543212" },
          { name: "Vikram Sen", mobile: "9876543213" }
        ];

        const createdCustomers = [];
        for (const c of customerData) {
          let customer = await Customer.findOne({ mobile: c.mobile });
          if (!customer) {
            customer = await Customer.create({
              name: c.name,
              mobile: c.mobile
            });
          } else if (customer.name !== c.name) {
            customer.name = c.name;
            await customer.save();
          }
          createdCustomers.push(customer);
        }

        // Clean up old completed/cancelled/no-show queue entries and bookings for these mock customers in this salon
        const mockCustomerIds = createdCustomers.map(c => c._id);
        await Queue.deleteMany({ salon_id, customer_id: { $in: mockCustomerIds } });
        await Booking.deleteMany({ salon_id, customer_id: { $in: mockCustomerIds } });

        // Create the mock bookings and queue entries
        // 1. Aarav Mehta (Premium Haircut & Beard Grooming, position 1, unassigned, waiting)
        const booking1 = await Booking.create({
          customer_id: createdCustomers[0]._id,
          salon_id,
          barber_id: null,
          booking_type: "queue",
          services: [{ service_name: "Premium Haircut & Beard Grooming", price: 450 }],
          total_amount: 450,
          status: "confirmed"
        });
        await Queue.create({
          salon_id,
          barber_id: null,
          booking_id: booking1._id,
          customer_id: createdCustomers[0]._id,
          position: 1,
          status: "waiting",
          estimated_wait: 20
        });

        // 2. Kabir Dev (Royal Oil Head Massage, position 2, assigned to Ali, waiting)
        const booking2 = await Booking.create({
          customer_id: createdCustomers[1]._id,
          salon_id,
          barber_id: aliBarber ? aliBarber._id : null,
          booking_type: "queue",
          services: [{ service_name: "Royal Oil Head Massage", price: 250 }],
          total_amount: 250,
          status: "confirmed"
        });
        await Queue.create({
          salon_id,
          barber_id: aliBarber ? aliBarber._id : null,
          booking_id: booking2._id,
          customer_id: createdCustomers[1]._id,
          position: 2,
          status: "waiting",
          estimated_wait: 40
        });

        // 3. Rohan Das (Charcoal Face Scrub & Cleanse, position 3, assigned to Ravi, in-progress)
        const booking3 = await Booking.create({
          customer_id: createdCustomers[2]._id,
          salon_id,
          barber_id: raviBarber ? raviBarber._id : null,
          booking_type: "queue",
          services: [{ service_name: "Charcoal Face Scrub & Cleanse", price: 350 }],
          total_amount: 350,
          status: "in-progress"
        });
        await Queue.create({
          salon_id,
          barber_id: raviBarber ? raviBarber._id : null,
          booking_id: booking3._id,
          customer_id: createdCustomers[2]._id,
          position: 3,
          status: "in-progress",
          estimated_wait: 0,
          served_at: new Date()
        });
        if (raviBarber) {
          await Barber.findByIdAndUpdate(raviBarber._id, { status: "busy" });
        }

        // 4. Vikram Sen (Classic Hair Wash & Conditioning, position 4, unassigned, waiting)
        const booking4 = await Booking.create({
          customer_id: createdCustomers[3]._id,
          salon_id,
          barber_id: null,
          booking_type: "queue",
          services: [{ service_name: "Classic Hair Wash & Conditioning", price: 200 }],
          total_amount: 200,
          status: "confirmed"
        });
        await Queue.create({
          salon_id,
          barber_id: null,
          booking_id: booking4._id,
          customer_id: createdCustomers[3]._id,
          position: 4,
          status: "waiting",
          estimated_wait: 60
        });

        // Query again to return populated seeded data
        queue = await Queue.find({
          salon_id: salon_id,
          status: { $in: ["waiting", "in-progress", "paused"] }
        })
          .populate("customer_id")
          .populate("barber_id")
          .populate("booking_id");
      }
    }

    res.status(200).json({ success: true, queue });
  } catch (error) {
    next(error); // Passes execution down safely to server error boundary middleware
  }
};

// @desc    Helper to seed one mock unassigned queue entry
const seedOneMockUnassigned = async (salon_id) => {
  try {
    const mockNames = ["Rohit Sharma", "Kabir Dev", "Rohan Das", "Vikram Sen", "Aarav Mehta", "Priya Patil", "Amit Joshi", "Sneha Kulkarni"];
    const randomName = mockNames[Math.floor(Math.random() * mockNames.length)];
    const randomMobile = "9" + Math.floor(100000000 + Math.random() * 900000000);

    let customer = await Customer.findOne({ mobile: randomMobile });
    if (!customer) {
      customer = await Customer.create({
        name: randomName,
        mobile: randomMobile
      });
    }

    const servicesList = [
      { name: "Classic Haircut", price: 300 },
      { name: "Taper Fade & Trim", price: 350 },
      { name: "Beard Sculpting & Oil", price: 200 },
      { name: "Royal Head Massage", price: 250 },
      { name: "Charcoal Face Mask", price: 300 }
    ];
    const randomService = servicesList[Math.floor(Math.random() * servicesList.length)];

    const booking = await Booking.create({
      customer_id: customer._id,
      salon_id,
      barber_id: null,
      booking_type: "queue",
      services: [{ service_id: new mongoose.Types.ObjectId(), service_name: randomService.name, price: randomService.price }],
      total_amount: randomService.price,
      status: "confirmed"
    });

    const position = await Queue.countDocuments({
      salon_id,
      status: { $in: ["waiting", "in-progress"] }
    }) + 1;

    await Queue.create({
      salon_id,
      barber_id: null,
      booking_id: booking._id,
      customer_id: customer._id,
      position,
      status: "waiting",
      estimated_wait: position * 20
    });
    console.log(`Auto-seeded one mock unassigned customer: ${randomName}`);
  } catch (err) {
    console.error("Error seeding mock unassigned:", err);
  }
};

// @desc    Helper to seed mock unassigned entries if count is less than 3
const seedMockUnassignedIfNeeded = async (salon_id) => {
  try {
    const unassignedCount = await Queue.countDocuments({
      salon_id,
      barber_id: null,
      status: "waiting"
    });
    const needed = Math.max(0, 3 - unassignedCount);
    for (let i = 0; i < needed; i++) {
      await seedOneMockUnassigned(salon_id);
    }
  } catch (err) {
    console.error("Error ensuring mock unassigned count:", err);
  }
};

// @desc    Update a queue entry status
// @route   PUT /api/queue/:queue_id/status
// @access  Private
exports.updateQueueStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const entry = await Queue.findById(req.params.queue_id);
    if (!entry) {
      return res.status(404).json({ success: false, message: "Queue entry not found" });
    }

    entry.status = status;
    if (status === "in-progress") {
      entry.served_at = new Date();
    }
    await entry.save();

    // Update Booking status
    if (entry.booking_id) {
      await Booking.findByIdAndUpdate(entry.booking_id, { status: status === "noshow" ? "noshow" : status });
    }

    // Update Barber status
    if (entry.barber_id) {
      if (status === "in-progress" || status === "busy") {
        await Barber.findByIdAndUpdate(entry.barber_id, { status: "busy" });
      } else if (status === "completed" || status === "noshow") {
        await Barber.findByIdAndUpdate(entry.barber_id, { status: "available" });

        // Update positions of other waiting customers for this barber
        await Queue.updateMany(
          { barber_id: entry.barber_id, status: "waiting", position: { $gt: entry.position } },
          { $inc: { position: -1 } }
        );
      }
    }

    // If completed or noshow, auto-seed mock unassigned entries so owner dashboard remains populated
    if (status === "completed" || status === "noshow") {
      await seedMockUnassignedIfNeeded(entry.salon_id);
    }

    res.json({ success: true, entry });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Get active queue entry for the logged-in customer
// @route   GET /api/queue/customer/active
// @access  Private (Customer)
exports.getActiveCustomerQueue = async (req, res, next) => {
  try {
    const entry = await Queue.findOne({
      customer_id: req.user.id,
      status: { $in: ["waiting", "in-progress", "paused", "delayed"] }
    })
    .populate("salon_id", "salon_name address")
    .populate("barber_id", "name")
    .populate("booking_id");

    if (!entry) {
      return res.status(200).json({ success: true, active: false });
    }

    let services = [];
    if (entry.booking_id && entry.booking_id.services) {
      services = entry.booking_id.services;
    }

    const peopleAhead = Math.max(0, entry.position - 1);
    const currentEstWait = entry.status === "in-progress" ? 0 : Math.max(20, entry.estimated_wait);

    res.status(200).json({
      success: true,
      active: true,
      queue: {
        id: entry._id,
        position: entry.position,
        peopleAhead,
        status: entry.status,
        estimated_wait: currentEstWait,
        joined_at: entry.joined_at,
        salon: entry.salon_id,
        barber: entry.barber_id,
        services,
        booking: entry.booking_id
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Notify a customer about their queue status
// @route   POST /api/queue/notify
// @access  Private (Owner, Admin, Barber)
exports.notifyCustomer = async (req, res, next) => {
  try {
    const { queue_id } = req.body;

    const queueEntry = await Queue.findById(queue_id);
    if (!queueEntry) {
      return res.status(404).json({ success: false, message: "Queue entry not found" });
    }

    // Create an in-app system notification document for the specific client
    const notification = await Notification.create({
      user_id: queueEntry.customer_id,
      title: "Your Turn is Approaching! 🎯",
      message: `Please head over to the station. You are currently next in line!`,
      type: "queue_update",
      is_read: false
    });

    res.status(200).json({
      success: true,
      message: "Customer notified successfully!",
      notification
    });
  } catch (error) {
    next(error);
  }
};
