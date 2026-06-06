import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import {
  Check, X, Edit, Calendar, Clock3, Crown, Search, 
  Bell, IndianRupee, Users, Plus, Scissors, SlidersHorizontal
} from "lucide-react";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const CHARCOAL = "#3E362E";
const GOLD = "#C5A059";

export default function BookingManagement() {
  const navigate = useNavigate();
  const { salon, token } = useOutletContext();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedTypeFilter, setSelectedTypeFilter] = useState("ALL"); // ALL, queue, slot, priority
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const [time, setTime] = useState(new Date().toLocaleTimeString("en-IN", { hour: '2-digit', minute: '2-digit' }));

  useEffect(() => {
    if (salon?._id) {
      fetchBookings();
    }
    const timer = setInterval(() => {
      setTime(new Date().toLocaleTimeString("en-IN", { hour: '2-digit', minute: '2-digit' }));
    }, 60000);
    return () => clearInterval(timer);
  }, [salon?._id]);

  const fetchBookings = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API}/booking/salon/${salon._id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message || "Failed to load bookings");
      setBookings(data.bookings || []);
    } catch (err) {
      setError(err.message || "Error fetching bookings");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id, nextStatus) => {
    setError("");
    setMessage("");
    try {
      const res = await fetch(`${API}/booking/${id}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status: nextStatus })
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message || "Update failed");
      
      setBookings(prev => prev.map(b => b._id === id ? { ...b, status: nextStatus } : b));
      setMessage(`Booking status set to ${nextStatus}.`);
    } catch (err) {
      setError(err.message || "Could not update booking status");
    }
  };

  const handleCancelBooking = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) return;
    setError("");
    setMessage("");
    try {
      const res = await fetch(`${API}/booking/${id}/cancel`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message || "Cancellation failed");
      
      setBookings(prev => prev.map(b => b._id === id ? { ...b, status: "cancelled" } : b));
      setMessage("Booking cancelled.");
    } catch (err) {
      setError(err.message || "Could not cancel booking");
    }
  };

  const filteredBookings = useMemo(() => {
    return bookings.filter((b) => {
      const name = b.customer_id?.name || "Walk-in Guest";
      const matchesSearch = name.toLowerCase().includes(search.toLowerCase());
      const matchesType = selectedTypeFilter === "ALL" || b.booking_type.toLowerCase() === selectedTypeFilter.toLowerCase();
      return matchesSearch && matchesType;
    });
  }, [bookings, search, selectedTypeFilter]);

  const stats = useMemo(() => {
    const totalToday = bookings.length;
    const uniqueCustomers = new Set(bookings.map(b => b.customer_id?._id)).size;
    const totalRevenue = bookings
      .filter(b => b.status === "completed")
      .reduce((sum, b) => sum + (b.total_amount || 0), 0);
    const pendingCount = bookings.filter(b => b.status === "pending").length;

    return {
      today: totalToday,
      customers: uniqueCustomers || 0,
      revenue: totalRevenue || 0,
      pendingCount
    };
  }, [bookings]);

  const getStatusStyle = (status) => {
    switch (status) {
      case "approved":
      case "completed":
        return "bg-emerald-50 border border-emerald-200 text-emerald-700 font-bold";
      case "rejected":
      case "cancelled":
        return "bg-rose-50 border border-rose-200 text-rose-700 font-bold";
      default:
        return "bg-amber-50 border border-amber-200 text-amber-700 font-bold";
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 font-sans">
        <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center animate-pulse mb-3">
          <Calendar className="w-5 h-5 text-[#C5A059] animate-pulse" />
        </div>
        <p className="text-stone-500 text-xs uppercase font-extrabold tracking-widest animate-pulse">Syncing Floor Allocations...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto text-left font-sans animate-fade-in">
      <style>{`
        .card { 
          background: #FFFFFF; 
          border: 1px solid #EADBCE; 
          border-radius: 24px; 
          box-shadow: 0 4px 20px -2px rgba(28, 25, 23, 0.03);
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .card:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 24px -4px rgba(28, 25, 23, 0.06);
          border-color: #C5A059;
        }
        .card-active {
          border-color: #C5A059 !important;
          box-shadow: 0 0 0 2px #C5A059, 0 12px 24px -4px rgba(197, 160, 89, 0.15) !important;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
          height: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #EADBCE;
          border-radius: 10px;
        }
      `}</style>

      {/* ── CONTEXT HEADER TITLE CARD ── */}
      <div className="relative rounded-3xl p-6 md:p-8 mb-6 overflow-hidden card bg-white text-left">
        <div className="relative z-10">
          <p className="font-extrabold uppercase tracking-widest text-[10px] text-[#C5A059] mb-1.5 font-sans">
            Elite Grooming Management
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl tracking-normal text-stone-900 flex items-center justify-start gap-2 whitespace-nowrap">
            <span className="font-bold uppercase">Booking</span>
            <span className="italic text-[#C5A059] normal-case font-medium">Dashboard</span>
          </h2>
          <p className="text-stone-600 text-sm font-normal leading-relaxed font-sans mt-2">Monitor floor allocation flow, approve queue intents, and confirm appointment configurations.</p>
        </div>
      </div>

      {error && <p className="mb-6 rounded-xl bg-red-50 border border-red-200 p-4 text-center text-xs font-bold text-red-600 font-sans">{error}</p>}
      {message && <p className="mb-6 rounded-xl bg-green-50 border border-green-200 p-4 text-center text-xs font-bold text-green-700 font-sans">{message}</p>}

      {/* ── SYSTEM MATRIX SUMMARY NUMBERS ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 text-left">
        {[
          { title: "Today's Bookings", value: stats.today, icon: Calendar, color: "bg-orange-50 text-orange-700 border-orange-100" },
          { title: "Customers Total", value: stats.customers, icon: Users, color: "bg-amber-50 text-amber-700 border-amber-100" },
          { title: "Revenue Index", value: `₹${stats.revenue}`, icon: IndianRupee, color: "bg-emerald-50 text-emerald-700 border-emerald-100" },
          { title: "Pending Reviews", value: stats.pendingCount, icon: Clock3, color: "bg-sky-50 text-sky-700 border-sky-100" },
        ].map((item) => (
          <div key={item.title} className="card p-5 bg-white flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl border flex items-center justify-center flex-shrink-0 ${item.color}`}>
              <item.icon size={20} />
            </div>
            <div>
              <h3 className="text-[10px] font-extrabold uppercase tracking-widest text-[#C5A059] font-sans mb-0.5">{item.title}</h3>
              <p className="text-xl font-black font-serif tracking-normal text-stone-900 leading-none">{item.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── SEARCH INDEX CONSOLE ── */}
      <div className="card p-4 mb-6 flex items-center gap-3 bg-white text-left font-sans">
        <Search className="text-[#C5A059] shrink-0" size={18} />
        <input
          type="text"
          placeholder="Search active guest by name identifier..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-transparent outline-none w-full text-stone-800 placeholder-stone-400 text-sm font-medium font-sans border-none"
        />
        {selectedTypeFilter !== "ALL" && (
          <button 
            onClick={() => setSelectedTypeFilter("ALL")}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-extrabold uppercase tracking-wider bg-stone-100 text-stone-500 hover:bg-stone-200 transition cursor-pointer font-sans border-none outline-none"
          >
            <SlidersHorizontal size={12} /> Clear Filter
          </button>
        )}
      </div>

      {/* ── INTERACTIVE FILTER SEGMENTS ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 text-left">
        {[
          { filterKey: "queue", title: "Queue Bookings", icon: Clock3, desc: "On-demand routing slot entries" },
          { filterKey: "slot", title: "Slot Bookings", icon: Calendar, desc: "Pre-arranged appointment times" },
          { filterKey: "priority", title: "Priority Bookings", icon: Crown, desc: "VIP fast-track checkout nodes" },
        ].map((item) => {
          const isTargetActive = selectedTypeFilter === item.filterKey;
          return (
            <div 
              key={item.filterKey} 
              onClick={() => setSelectedTypeFilter(isTargetActive ? "ALL" : item.filterKey)}
              className={`card p-5 flex items-center gap-4 cursor-pointer select-none bg-white ${isTargetActive ? 'card-active' : 'hover:border-[#C5A059]'}`}
            >
              <div className={`w-12 h-12 rounded-xl border flex items-center justify-center transition-all ${isTargetActive ? 'text-white' : 'bg-amber-50/60 border-amber-100 text-[#C5A059]'}`} style={{ backgroundColor: isTargetActive ? CHARCOAL : '' }}>
                <item.icon size={20} />
              </div>
              <div>
                <h2 className="text-base font-black font-serif text-stone-900 leading-tight">{item.title}</h2>
                <p className="text-stone-600 text-[10px] font-normal leading-relaxed font-sans mt-0.5">{item.desc}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── LEDGER TABLE CONTENT CONTAINER ── */}
      <div className="card p-6 bg-white overflow-hidden mb-8 text-left">
        <div className="flex items-center justify-between mb-6 border-b border-stone-100 pb-4">
          <h2 className="font-serif text-xl sm:text-2xl tracking-normal text-stone-900 flex items-center justify-start gap-2 whitespace-nowrap">
            <span className="font-bold uppercase">Live Operations</span>
            <span className="italic text-[#C5A059] normal-case font-medium">Queue</span>
            {selectedTypeFilter !== "ALL" && <span className="text-xs font-sans font-bold text-[#C5A059] lowercase">({selectedTypeFilter} only)</span>}
          </h2>
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#C5A059] bg-stone-50 px-2.5 py-1 rounded-md font-sans">
            {filteredBookings.length} Active Rows
          </span>
        </div>
        
        <div className="overflow-x-auto w-full custom-scrollbar font-sans">
          <table className="w-full min-w-[640px] text-sm border-collapse">
            <thead>
              <tr className="border-b border-stone-100 text-stone-400 text-[10px] font-extrabold uppercase tracking-widest font-sans">
                <th className="text-left py-4 pr-4">Booking Date</th>
                <th className="text-left pr-4">Customer Entity</th>
                <th className="text-left pr-4">Pipeline Type</th>
                <th className="text-left pr-4">Assigned Stylist</th>
                <th className="text-left pr-4">Services Booked</th>
                <th className="text-left pr-4">Target Window</th>
                <th className="text-left pr-4">Price Yield</th>
                <th className="text-left pr-4">State</th>
                <th className="text-right">Operations</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-50">
              {filteredBookings.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center py-12 text-stone-400 italic font-medium font-sans">
                    No matching transaction entries discovered in this viewport segment.
                  </td>
                </tr>
              ) : (
                filteredBookings.map((booking) => (
                  <tr key={booking._id} className="hover:bg-stone-50/60 transition-colors group">
                    <td className="py-4.5 pr-4 whitespace-nowrap text-stone-500 font-medium font-mono">
                      {new Date(booking.created_at).toLocaleDateString("en-IN", { day: '2-digit', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="pr-4 whitespace-nowrap">
                      <p className="font-bold text-stone-900 text-sm">{booking.customer_id?.name || "Walk-in Guest"}</p>
                      <p className="text-[10px] text-stone-400 mt-1 font-mono">{booking.customer_id?.mobile || "N/A"}</p>
                    </td>
                    <td className="pr-4 whitespace-nowrap">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${booking.booking_type === 'priority' ? 'bg-purple-50 text-purple-700' : booking.booking_type === 'slot' ? 'bg-blue-50 text-blue-700' : 'bg-stone-100 text-stone-700'}`}>
                        {booking.booking_type}
                      </span>
                    </td>
                    <td className="pr-4 whitespace-nowrap font-medium text-stone-700 text-sm">
                      {booking.barber_id?.name || <span className="text-stone-400 italic text-xs">Unassigned</span>}
                    </td>
                    <td className="pr-4 max-w-[200px] truncate" title={booking.services?.map(s => s.service_name).join(", ")}>
                      <span className="font-medium text-stone-800 text-sm">
                        {booking.services?.map(s => s.service_name).join(", ") || "None"}
                      </span>
                    </td>
                    <td className="pr-4 whitespace-nowrap text-stone-500 font-medium font-mono">
                      {booking.slot_time || "Walk-in"}
                    </td>
                    <td className="pr-4 whitespace-nowrap font-mono font-bold text-amber-700 text-sm">
                      ₹{booking.total_amount || 0}
                    </td>
                    <td className="pr-4 whitespace-nowrap">
                      <span className={`px-2.5 py-0.5 rounded border text-[9px] font-black uppercase tracking-wider ${getStatusStyle(booking.status)}`}>
                        {booking.status}
                      </span>
                    </td>
                    <td>
                      <div className="flex gap-2 justify-end font-sans">
                        {booking.status === "pending" && (
                          <>
                            <button
                              onClick={() => handleUpdateStatus(booking._id, "approved")}
                              className="bg-emerald-50 text-emerald-700 border border-emerald-200/60 hover:bg-emerald-100 p-2 rounded-xl transition shrink-0 cursor-pointer outline-none"
                              title="Approve Slot"
                            >
                              <Check size={14} strokeWidth={3} />
                            </button>
                            <button
                              onClick={() => handleUpdateStatus(booking._id, "rejected")}
                              className="bg-rose-50 text-rose-700 border border-rose-200/60 hover:bg-rose-100 p-2 rounded-xl transition shrink-0 cursor-pointer outline-none"
                              title="Reject Slot"
                            >
                              <X size={14} strokeWidth={3} />
                            </button>
                          </>
                        )}
                        {booking.status !== "completed" && booking.status !== "cancelled" && booking.status !== "rejected" && (
                          <button
                            onClick={() => handleCancelBooking(booking._id)}
                            className="bg-stone-50 text-stone-600 border border-stone-200 hover:bg-stone-100 p-2 rounded-xl transition shrink-0 cursor-pointer outline-none"
                            title="Cancel Booking"
                          >
                            <X size={14} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}