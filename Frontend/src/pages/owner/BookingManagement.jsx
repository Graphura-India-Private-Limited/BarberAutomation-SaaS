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
    if (status === "Approved") return "bg-green-500/20 text-green-400";
    if (status === "Rejected") return "bg-red-500/20 text-red-400";
    return "bg-yellow-500/20 text-yellow-400";
  };

  return (
    <div className="min-h-screen bg-[#0B0B0B] text-[#F5F1E8] p-4 sm:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
        <div>
          <p className="text-[#C8A96A] uppercase tracking-[4px] text-xs sm:text-sm">
            Elite Grooming Management
          </p>
          <h1 className="text-3xl sm:text-5xl font-bold mt-2">Booking Dashboard</h1>
        </div>

        <div className="flex gap-3 w-full sm:w-auto">
          <button
            onClick={handleNewBookingClick}
            className="flex-1 sm:flex-initial bg-[#C8A96A] text-black px-5 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-[#bfa163] transition"
          >
            <Plus size={18} />
            New Booking
          </button>
          <button className="bg-[#161616] p-3 rounded-xl hover:bg-[#222] transition">
            <Bell />
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
          <div
            key={item.title}
            className="bg-[#161616] border border-[#2A2A2A] rounded-2xl p-6 hover:border-[#C8A96A] transition"
          >
            <item.icon className="text-[#C8A96A]" />
            <h3 className="mt-4 text-gray-400 text-sm sm:text-base">{item.title}</h3>
            <p className="text-2xl sm:text-3xl font-bold mt-2">{item.value}</p>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="bg-[#161616] border border-[#2A2A2A] rounded-2xl p-4 mb-8 flex items-center gap-3">
        <Search className="text-[#C8A96A] shrink-0" />
        <input
          type="text"
          placeholder="Search customer..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-transparent outline-none w-full text-[#F5F1E8]"
        />
      </div>

      {/* Booking Types */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {[
          { title: "Queue Booking", icon: Clock3 },
          { title: "Slot Booking", icon: Calendar },
          { title: "Priority Booking", icon: Crown },
        ].map((item) => (
          <div key={item.title} className="bg-[#161616] border border-[#2A2A2A] rounded-2xl p-6">
            <item.icon className="text-[#C8A96A]" />
            <h2 className="text-lg sm:text-xl mt-4">{item.title}</h2>
          </div>
        ))}
      </div>

      {/* Table Section */}
      <div className="bg-[#161616] border border-[#2A2A2A] rounded-2xl p-4 sm:p-6 mb-10">
        <h2 className="text-xl sm:text-2xl mb-6 text-[#C8A96A]">Live Bookings</h2>
        
        {/* Table Wrapper for Horizontal Scrolling on Mobile */}
        <div className="overflow-x-auto w-full">
          <table className="w-full min-w-[600px] text-sm sm:text-base">
            <thead>
              <tr className="border-b border-[#2A2A2A]">
                <th className="text-left py-4 pr-4">Customer</th>
                <th className="text-left pr-4">Type</th>
                <th className="text-left pr-4">Slot</th>
                <th className="text-left pr-4">Status</th>
                <th className="text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredBookings.map((booking) => (
                <tr key={booking.id} className="border-b border-[#2A2A2A] hover:bg-[#1A1A1A]">
                  <td className="py-5 pr-4 whitespace-nowrap">{booking.name}</td>
                  <td className="pr-4 whitespace-nowrap">{booking.type}</td>
                  <td className="pr-4 whitespace-nowrap">{booking.slot}</td>
                  <td className="pr-4 whitespace-nowrap">
                    <span className={`px-4 py-1.5 rounded-full text-xs sm:text-sm ${getStatusStyle(booking.status)}`}>
                      {booking.status}
                    </span>
                  </td>
                  <td>
                    <div className="flex gap-2 sm:gap-3">
                      <button
                        onClick={() => approveBooking(booking.id)}
                        className="bg-[#C8A96A] text-black p-2 rounded-lg hover:bg-[#bfa163] transition shrink-0"
                      >
                        <Check size={16} />
                      </button>
                      <button
                        onClick={() => rejectBooking(booking.id)}
                        className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition shrink-0"
                      >
                        <X size={16} />
                      </button>
                      <button
                        onClick={() => handleEditClick(booking)}
                        className="bg-[#2A2A2A] text-white p-2 rounded-lg hover:bg-[#3A3A3A] transition shrink-0"
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
      <div className="bg-[#161616] border border-[#2A2A2A] rounded-2xl p-6">
        <h2 className="text-xl sm:text-2xl text-[#C8A96A] mb-5">Live Activity</h2>
        <div className="space-y-4 text-sm sm:text-base text-gray-300">
          <p>Rahul booked haircut • 2 sec ago</p>
          <p>Priya upgraded to premium • 1 min ago</p>
          <p>Amit cancelled appointment • 3 min ago</p>
        </div>
      </div>

      {/* DYNAMIC FORM MODAL (Add / Edit Booking) */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-[#161616] border border-[#2A2A2A] rounded-2xl p-6 w-full max-w-md shadow-2xl relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <X size={20} />
            </button>

            <h2 className="text-xl sm:text-2xl font-bold mb-6 text-[#C8A96A]">
              {editingBooking ? "Edit Booking Details" : "Create New Booking"}
            </h2>

            <form onSubmit={handleFormSubmit} className="space-y-5">
              <div>
                <label className="block text-gray-400 mb-2 text-xs sm:text-sm">Customer Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter full name"
                  className="w-full bg-[#0B0B0B] border border-[#2A2A2A] rounded-xl p-3 outline-none text-[#F5F1E8] focus:border-[#C8A96A] transition text-sm sm:text-base"
                />
              </div>

              <div>
                <label className="block text-gray-400 mb-2 text-xs sm:text-sm">Booking Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full bg-[#0B0B0B] border border-[#2A2A2A] rounded-xl p-3 outline-none text-[#F5F1E8] focus:border-[#C8A96A] transition text-sm sm:text-base"
                >
                  <option value="Queue">Queue Booking</option>
                  <option value="Slot">Slot Booking</option>
                  <option value="Priority">Priority Booking</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-400 mb-2 text-xs sm:text-sm">Preferred Time Slot</label>
                <select
                  value={formData.slot}
                  onChange={(e) => setFormData({ ...formData, slot: e.target.value })}
                  className="w-full bg-[#0B0B0B] border border-[#2A2A2A] rounded-xl p-3 outline-none text-[#F5F1E8] focus:border-[#C8A96A] transition text-sm sm:text-base"
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
                  className="w-full bg-[#2A2A2A] hover:bg-[#3A3A3A] transition py-3 rounded-xl font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-full bg-[#C8A96A] hover:bg-[#bfa163] text-black transition py-3 rounded-xl font-bold"
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