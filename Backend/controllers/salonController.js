const Salon = require("../models/Salon");

// @desc    Register a new salon
// @route   POST /api/salon/register
// @access  Public
exports.registerSalon = async (req, res) => {
  try {
    const { mobile, support_number } = req.body;
    if (mobile) {
      const exists = await Salon.findOne({
        $or: [
          { mobile },
          { support_number: mobile }
        ]
      });
      if (exists) {
        return res.status(400).json({
          success: false,
          message: "A salon with this mobile number is already registered. Please use a unique mobile number."
        });
      }
    }
    if (support_number && support_number.trim() !== "") {
      const exists = await Salon.findOne({
        $or: [
          { mobile: support_number },
          { support_number }
        ]
      });
      if (exists) {
        return res.status(400).json({
          success: false,
          message: "A salon with this customer support number is already registered. Please use a unique support number."
        });
      }
    }

    const salon = await Salon.create({
      ...req.body,
      status: req.body.status || "pending",
      rejection_reason: "",
      submitted_at: new Date()
    });

    res.status(201).json({
      success: true,
      salon,
      message: "Salon submitted for approval"
    });
  } catch (err) {
    if (err.code === 11000) {
      const field = Object.keys(err.keyPattern || {})[0] || 'mobile';
      if (field === 'mobile') {
        return res.status(400).json({
          success: false,
          message: "A salon with this mobile number is already registered. Please use a unique mobile number."
        });
      }
      return res.status(400).json({
        success: false,
        message: `A salon with this ${field} is already registered.`
      });
    }
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Get all approved salons
// @route   GET /api/salon
// @access  Public
exports.getApprovedSalons = async (req, res) => {
  try {
    const salons = await Salon.find({ status: "approved" })
      .select("-password_hash -images -shop_establishment_certificate -trade_license -gst_certificate -aadhaar_card -photo -document");

    const cleanedSalons = salons.map((salon, index) => {
      const s = salon.toObject();
      const defaultImages = [
        "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=500",
        "https://images.unsplash.com/photo-1562322140-8baeececf3df?w=500",
        "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=500",
        "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=500"
      ];
      s.images = [defaultImages[index % defaultImages.length]];
      return s;
    });

    res.json({ success: true, salons: cleanedSalons });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Get nearby approved salons
// @route   GET /api/salon/nearby
// @access  Public
exports.getNearbySalons = async (req, res) => {
  try {
    const salons = await Salon.find({ status: "approved" })
      .select("-password_hash -images -shop_establishment_certificate -trade_license -gst_certificate -aadhaar_card -photo -document");

    const cleanedSalons = salons.map((salon, index) => {
      const s = salon.toObject();
      const defaultImages = [
        "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=500",
        "https://images.unsplash.com/photo-1562322140-8baeececf3df?w=500",
        "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=500",
        "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=500"
      ];
      s.images = [defaultImages[index % defaultImages.length]];
      return s;
    });

    res.json({ success: true, salons: cleanedSalons });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Get a single approved salon by ID
// @route   GET /api/salon/:id
// @access  Public
exports.getSalonById = async (req, res) => {
  try {
    const salon = await Salon.findOne({
      _id: req.params.id,
      status: "approved"
    }).select("-password_hash -shop_establishment_certificate -trade_license -gst_certificate -aadhaar_card -photo -document");

    if (!salon) {
      return res.status(404).json({ success: false, message: "Salon is not live" });
    }

    const s = salon.toObject();
    if (s.images && s.images.length > 0) {
      s.images = s.images.map(img => img && img.startsWith("data:") ? "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=500" : img);
    } else {
      s.images = ["https://images.unsplash.com/photo-1560066984-138dadb4c035?w=500"];
    }

    res.json({ success: true, salon: s });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
