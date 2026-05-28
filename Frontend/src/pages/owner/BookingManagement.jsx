import React, { useState } from "react";
import {
  Check,
  X,
  Edit,
  Calendar,
  Clock3,
  Crown,
  Search,
  Bell,
  IndianRupee,
  Users,
  Plus,
} from "lucide-react";

export default function BookingManagement() {
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBooking, setEditingBooking] = useState(null);

  // Form State for Add/Edit
  const [formData, setFormData] = useState({
    name: "",
    type: "Queue",
    slot: "10:00 AM",
  });

  const [bookings, setBookings] = useState([
    {
      id: 1,
      name: "Rahul Sharma",
      type: "Queue",
      slot: "10:00 AM",
      status: "Pending",
    },
    {
      id: 2,
      name: "Amit Patil",
      type: "Slot",
      slot: "11:00 AM",
      status: "Approved",
    },
    {
      id: 3,
      name: "Priya Deshmukh",
      type: "Priority",
      slot: "12:00 PM",
      status: "Pending",
    },
  ]);

  const approveBooking = (id) => {
    setBookings(
      bookings.map((b) =>
        b.id === id ? { ...b, status: "Approved" } : b
      )
    );
  };

  const rejectBooking = (id) => {
    setBookings(
      bookings.map((b) =>
        b.id === id ? { ...b, status: "Rejected" } : b
      )
    );
  };

  // Open modal for creating new booking
  const handleNewBookingClick = () => {
    setEditingBooking(null);
    setFormData({ name: "", type: "Queue", slot: "10:00 AM" });
    setIsModalOpen(true);
  };

  // Open modal for editing existing booking
  const handleEditClick = (booking) => {
    setEditingBooking(booking);
    setFormData({
      name: booking.name,
      type: booking.type,
      slot: booking.slot,
    });
    setIsModalOpen(true);
  };

  // Handle Form Submit (Both Add and Edit)
  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    if (editingBooking) {
      // Edit Logic
      setBookings(
        bookings.map((b) =>
          b.id === editingBooking.id
            ? { ...b, name: formData.name, type: formData.type, slot: formData.slot }
            : b
        )
      );
    } else {
      // Add New Logic
      const newBooking = {
        id: Date.now(),
        name: formData.name,
        type: formData.type,
        slot: formData.slot,
        status: "Pending",
      };
      setBookings([newBooking, ...bookings]);
    }

    setIsModalOpen(false);
  };

  const filteredBookings = bookings.filter((booking) =>
    booking.name.toLowerCase().includes(search.toLowerCase())
  );

  const getStatusStyle = (status) => {
    if (status === "Approved") return "bg-green-50 border border-green-200/60 text-green-700 font-bold";
    if (status === "Rejected") return "bg-red-50 border border-red-200/60 text-red-700 font-bold";
    return "bg-amber-50 border border-amber-200/60 text-amber-700 font-bold";
  };

  return (
    <div className="min-h-screen p-4 sm:p-8 font-sans text-zinc-800" style={{ background: "var(--bg)" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap');
        :root { 
          --gold: #D97706; 
          --gold2: #B45309; 
          --bg: #FAF6F0; 
          --bg2: #FFFFFF; 
          --bg3: #FDFBF7; 
          --border: #EADBCE; 
          --text: #1C1917; 
          --muted: #78716C; 
        }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body, .font-sans {
          font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important;
        }
        .font-serif {
          font-family: 'Playfair Display', Georgia, Cambria, "Times New Roman", Times, serif !important;
        }
        .card { 
          background: var(--bg2); 
          border: 1px solid var(--border); 
          border-radius: 24px; 
          box-shadow: 0 4px 20px -2px rgba(28, 25, 23, 0.04), 0 2px 8px -1px rgba(28, 25, 23, 0.02);
          transition: all 0.2s ease;
        }
        .card:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px -4px rgba(28, 25, 23, 0.06), 0 4px 12px -2px rgba(28, 25, 23, 0.03);
          border-color: #D6C4AE;
        }
      `}</style>

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
        <div>
          <p className="text-amber-700 font-sans normal-case font-bold tracking-[2px] text-xs sm:text-sm">
            Elite Grooming Management
          </p>
          <h1 className="text-3xl sm:text-5xl font-bold mt-2 font-serif tracking-normal text-zinc-900">Booking Dashboard</h1>
        </div>

        <div className="flex gap-3 w-full sm:w-auto">
          <button
            onClick={handleNewBookingClick}
            className="flex-1 sm:flex-initial bg-amber-600 text-white hover:bg-amber-700 px-5 py-3 rounded-xl font-bold flex items-center justify-center gap-2 shadow-md transition-all duration-200"
          >
            <Plus size={18} />
            New Booking
          </button>
          <button className="bg-white p-3 rounded-xl border border-zinc-200 text-zinc-600 hover:bg-zinc-50 shadow-sm hover:text-zinc-800 transition">
            <Bell size={20} />
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {[
          { title: "Today's Bookings", value: "128", icon: Calendar },
          { title: "Customers", value: "54", icon: Users },
          { title: "Revenue", value: "₹12k", icon: IndianRupee },
          { title: "Available Slots", value: "6", icon: Clock3 },
        ].map((item) => (
          <div key={item.title} className="card p-6">
            <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200/55 flex items-center justify-center mb-4">
              <item.icon className="text-amber-700 w-6 h-6" strokeWidth={2} />
            </div>
            <h3 className="text-xs font-bold text-zinc-500 font-sans normal-case mb-1">{item.title}</h3>
            <p className="text-2xl sm:text-3xl font-bold mt-1 font-serif tracking-normal text-zinc-900">{item.value}</p>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="card p-4 mb-8 flex items-center gap-3 bg-white">
        <Search className="text-amber-600 shrink-0" size={20} />
        <input
          type="text"
          placeholder="Search customer..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-transparent outline-none w-full text-zinc-800 placeholder-zinc-400 font-sans"
        />
      </div>

      {/* Booking Types */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {[
          { title: "Queue Booking", icon: Clock3 },
          { title: "Slot Booking", icon: Calendar },
          { title: "Priority Booking", icon: Crown },
        ].map((item) => (
          <div key={item.title} className="card p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200/55 flex items-center justify-center">
              <item.icon className="text-amber-700 w-6 h-6" />
            </div>
            <h2 className="text-lg font-bold font-serif text-zinc-900">{item.title}</h2>
          </div>
        ))}
      </div>

      {/* Table Section */}
      <div className="card p-4 sm:p-6 mb-10">
        <h2 className="text-xl sm:text-2xl mb-6 font-serif font-bold text-zinc-900">Live Bookings</h2>
        
        {/* Table Wrapper for Horizontal Scrolling on Mobile */}
        <div className="overflow-x-auto w-full">
          <table className="w-full min-w-[600px] text-sm sm:text-base">
            <thead>
              <tr className="border-b border-zinc-200">
                <th className="text-left text-zinc-500 font-bold text-xs uppercase tracking-wider py-4 pr-4">Customer</th>
                <th className="text-left text-zinc-500 font-bold text-xs uppercase tracking-wider pr-4">Type</th>
                <th className="text-left text-zinc-500 font-bold text-xs uppercase tracking-wider pr-4">Slot</th>
                <th className="text-left text-zinc-500 font-bold text-xs uppercase tracking-wider pr-4">Status</th>
                <th className="text-left text-zinc-500 font-bold text-xs uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredBookings.map((booking) => (
                <tr key={booking.id} className="border-b border-zinc-100 hover:bg-zinc-50/80 transition-colors">
                  <td className="py-5 pr-4 whitespace-nowrap font-medium text-zinc-900">{booking.name}</td>
                  <td className="pr-4 whitespace-nowrap text-zinc-600">{booking.type}</td>
                  <td className="pr-4 whitespace-nowrap text-zinc-600">{booking.slot}</td>
                  <td className="pr-4 whitespace-nowrap">
                    <span className={`px-4 py-1.5 rounded-full text-xs sm:text-sm ${getStatusStyle(booking.status)}`}>
                      {booking.status}
                    </span>
                  </td>
                  <td>
                    <div className="flex gap-2 sm:gap-3">
                      <button
                        onClick={() => approveBooking(booking.id)}
                        className="bg-green-50 text-green-700 border border-green-200/60 hover:bg-green-100 p-2 rounded-lg transition shrink-0"
                      >
                        <Check size={16} />
                      </button>
                      <button
                        onClick={() => rejectBooking(booking.id)}
                        className="bg-red-50 text-red-700 border border-red-200/60 hover:bg-red-100 p-2 rounded-lg transition shrink-0"
                      >
                        <X size={16} />
                      </button>
                      <button
                        onClick={() => handleEditClick(booking)}
                        className="bg-zinc-100 text-zinc-700 border border-zinc-200 hover:bg-zinc-200 p-2 rounded-lg transition shrink-0"
                      >
                        <Edit size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Activity Feed */}
      <div className="card p-6">
        <h2 className="text-xl sm:text-2xl font-serif font-bold text-zinc-900 mb-5">Live Activity</h2>
        <div className="space-y-4 text-sm sm:text-base text-zinc-600">
          <p className="flex items-center gap-3 border-l-2 border-amber-500 pl-3 py-0.5">
            <span>Rahul booked haircut • <span className="text-zinc-400 text-xs">2 sec ago</span></span>
          </p>
          <p className="flex items-center gap-3 border-l-2 border-amber-500 pl-3 py-0.5">
            <span>Priya upgraded to premium • <span className="text-zinc-400 text-xs">1 min ago</span></span>
          </p>
          <p className="flex items-center gap-3 border-l-2 border-amber-500 pl-3 py-0.5">
            <span>Amit cancelled appointment • <span className="text-zinc-400 text-xs">3 min ago</span></span>
          </p>
        </div>
      </div>

      {/* DYNAMIC FORM MODAL (Add / Edit Booking) */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-zinc-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white border border-zinc-200 rounded-3xl p-6 w-full max-w-md shadow-2xl relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 p-1.5 rounded-lg transition"
            >
              <X size={20} />
            </button>

            <h2 className="text-xl sm:text-2xl font-bold mb-6 font-serif text-zinc-900">
              {editingBooking ? "Edit Booking Details" : "Create New Booking"}
            </h2>

            <form onSubmit={handleFormSubmit} className="space-y-5">
              <div>
                <label className="block text-zinc-600 font-bold mb-2 text-xs sm:text-sm">Customer Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter full name"
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl p-3 outline-none text-zinc-800 focus:border-amber-600 focus:bg-white transition text-sm sm:text-base font-medium"
                />
              </div>

              <div>
                <label className="block text-zinc-600 font-bold mb-2 text-xs sm:text-sm">Booking Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl p-3 outline-none text-zinc-800 focus:border-amber-600 focus:bg-white transition text-sm sm:text-base font-medium"
                >
                  <option value="Queue">Queue Booking</option>
                  <option value="Slot">Slot Booking</option>
                  <option value="Priority">Priority Booking</option>
                </select>
              </div>

              <div>
                <label className="block text-zinc-600 font-bold mb-2 text-xs sm:text-sm">Preferred Time Slot</label>
                <select
                  value={formData.slot}
                  onChange={(e) => setFormData({ ...formData, slot: e.target.value })}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl p-3 outline-none text-zinc-800 focus:border-amber-600 focus:bg-white transition text-sm sm:text-base font-medium"
                >
                  <option value="10:00 AM">10:00 AM</option>
                  <option value="11:00 AM">11:00 AM</option>
                  <option value="12:00 PM">12:00 PM</option>
                  <option value="01:00 PM">01:00 PM</option>
                  <option value="02:00 PM">02:00 PM</option>
                  <option value="03:00 PM">03:00 PM</option>
                </select>
              </div>

              <div className="flex gap-3 pt-2 text-sm sm:text-base">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="w-full bg-zinc-100 hover:bg-zinc-200 text-zinc-700 transition py-3 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-full bg-amber-600 hover:bg-amber-700 text-white transition py-3 rounded-xl font-bold shadow-md"
                >
                  {editingBooking ? "Save Changes" : "Confirm Booking"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}