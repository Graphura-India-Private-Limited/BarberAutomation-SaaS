import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
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
  Scissors,
  LogOut,
  SlidersHorizontal
} from "lucide-react";

// ── ✅ SYSTEM THEME STRUCTURED GLOBAL CONSUMER WRAPPERS ──
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";

const CHARCOAL = "#3E362E";
const GOLD = "#C5A059";

export default function BookingManagement() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [selectedTypeFilter, setSelectedTypeFilter] = useState("ALL"); // ALL, Queue, Slot
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [editingBooking, setEditingBooking] = useState(null);
  const [time, setTime] = useState(new Date().toLocaleTimeString("en-IN", { hour: '2-digit', minute: '2-digit' }));

  // Form State for Add/Edit
  const [formData, setFormData] = useState({
    name: "",
    type: "Queue",
    slot: "10:00 AM",
  });

  const [bookings, setBookings] = useState([
    { id: 1, name: "wdwdw", type: "Queue", slot: "10:00 AM", status: "Approved" },
    { id: 2, name: "Rahul Sharma", type: "Queue", slot: "10:00 AM", status: "Rejected" },
    { id: 3, name: "Amit Patil", type: "Slot", slot: "11:00 AM", status: "Approved" },
    { id: 4, name: "Priya Deshmukh", type: "Queue", slot: "12:00 PM", status: "Pending" },
  ]);

  const [activities] = useState([
    { id: 1, text: "Rahul booked haircut", time: "2 sec ago" },
    { id: 2, text: "Priya completed checkout", time: "1 min ago" },
    { id: 3, text: "Amit cancelled appointment", time: "3 min ago" },
  ]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date().toLocaleTimeString("en-IN", { hour: '2-digit', minute: '2-digit' }));
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  const approveBooking = (id) => {
    setBookings(prev => prev.map((b) => b.id === id ? { ...b, status: "Approved" } : b));
  };

  const rejectBooking = (id) => {
    setBookings(prev => prev.map((b) => b.id === id ? { ...b, status: "Rejected" } : b));
  };

  const handleNewBookingClick = () => {
    setEditingBooking(null);
    setFormData({ name: "", type: "Queue", slot: "10:00 AM" });
    setIsModalOpen(true);
  };

  const handleEditClick = (booking) => {
    setEditingBooking(booking);
    setFormData({ name: booking.name, type: booking.type, slot: booking.slot });
    setIsModalOpen(true);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    if (editingBooking) {
      setBookings(prev => prev.map((b) => b.id === editingBooking.id ? { ...b, name: formData.name, type: formData.type, slot: formData.slot } : b));
    } else {
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

  const handleLogout = () => {
    localStorage.clear();
    navigate("/owner/login");
  };

  const filteredBookings = useMemo(() => {
    return bookings.filter((b) => {
      const matchesSearch = b.name.toLowerCase().includes(search.toLowerCase());
      const matchesType = selectedTypeFilter === "ALL" || b.type.toLowerCase() === selectedTypeFilter.toLowerCase();
      return matchesSearch && matchesType;
    });
  }, [bookings, search, selectedTypeFilter]);

  const stats = useMemo(() => {
    return {
      today: bookings.length * 32, 
      customers: new Set(bookings.map(b => b.name)).size,
      pendingCount: bookings.filter(b => b.status === "Pending").length
    };
  }, [bookings]);

  const getStatusStyle = (status) => {
    if (status === "Approved") return "bg-emerald-50 border border-emerald-200/60 text-emerald-700 font-bold";
    if (status === "Rejected") return "bg-rose-50 border border-rose-200/60 text-rose-700 font-bold";
    return "bg-amber-50 border border-amber-200/60 text-amber-700 font-bold";
  };

  return (
    <div className="p-6 md:p-10 font-sans text-stone-800 selection:bg-amber-100 min-h-screen" style={{ background: "#FAF6F0" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap');
        body, .font-sans { font-family: 'Plus Jakarta Sans', sans-serif !important; }
        .font-serif { font-family: 'Playfair Display', serif !important; }
        
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

      {/* ── MAIN WORKSPACE CONTENT GRID ── */}
      <div className="mx-auto max-w-7xl">
        
        {/* ── CONTEXT HEADER TITLE CARD (Rule 1 & Rule 2 Standard Set) ── */}
        <div className="relative rounded-3xl p-6 md:p-8 mb-6 overflow-hidden card bg-white text-left">
          <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              {/* Rule 2: Minor Heading kicker badge styling */}
              <p className="font-extrabold uppercase tracking-widest text-[11px] text-[#C5A059] mb-1.5 font-sans">
                Elite Grooming Management
              </p>
              {/* Rule 1: Single-Line Master Header Layout Setup */}
              <h2 className="font-serif text-3xl sm:text-4xl tracking-normal text-stone-900 flex items-center justify-start gap-2 whitespace-nowrap">
                <span className="font-bold uppercase">Booking</span>
                <span className="italic text-[#C5A059] normal-case font-medium">Dashboard</span>
              </h2>
              {/* Rule 3: Muted Description Styling */}
              <p className="text-stone-600 text-sm font-normal leading-relaxed font-sans mt-2">Monitor floor allocation flow, approve queue intents, and confirm appointment configurations.</p>
            </div>
            {/* Rule 4: Primary UI Action Link Button */}
            <button
              onClick={handleNewBookingClick}
              className="inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3.5 text-xs font-extrabold tracking-wider uppercase text-white shadow-md active:scale-[0.98] transition-all duration-200 cursor-pointer self-start sm:self-center font-sans border-none outline-none"
              style={{ background: CHARCOAL }}
            >
              <Plus size={16} color={GOLD} /> New Booking
            </button>
          </div>
        </div>

        {/* ── SYSTEM MATRIX SUMMARY NUMBERS ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 text-left">
          {[
            { title: "Today's Bookings", value: stats.today, icon: Calendar, color: "bg-orange-50 text-orange-700 border-orange-100" },
            { title: "Customers Total", value: stats.customers, icon: Users, color: "bg-amber-50 text-amber-700 border-amber-100" },
            { title: "Revenue Index", value: "12k", icon: IndianRupee, color: "bg-emerald-50 text-emerald-700 border-emerald-100" },
            { title: "Pending Reviews", value: stats.pendingCount, icon: Clock3, color: "bg-sky-50 text-sky-700 border-sky-100" },
          ].map((item) => (
            <div key={item.title} className="card p-5 bg-white flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl border flex items-center justify-center flex-shrink-0 ${item.color}`}>
                <item.icon size={22} />
              </div>
              <div>
                {/* Rule 2: Minor Heading kicker tag structure */}
                <h3 className="text-[11px] font-extrabold uppercase tracking-widest text-[#C5A059] font-sans mb-0.5">{item.title}</h3>
                <p className="text-2xl font-black font-serif tracking-normal text-stone-900 leading-none">{item.value}</p>
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
            className="bg-transparent outline-none w-full text-stone-800 placeholder-stone-400 text-sm font-medium font-sans"
          />
          {selectedTypeFilter !== "ALL" && (
            /* Rule 4: Standardized Link/Badge Action button */
            <button 
              onClick={() => setSelectedTypeFilter("ALL")}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-extrabold uppercase tracking-wider bg-stone-100 text-stone-500 hover:bg-stone-200 transition cursor-pointer font-sans border-none outline-none"
            >
              <SlidersHorizontal size={12} /> Clear Filter
            </button>
          )}
        </div>

        {/* ── INTERACTIVE FILTER SEGMENTS ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8 text-left">
          {[
            { filterKey: "Queue", title: "Queue Bookings", icon: Clock3, desc: "On-demand routing slot entries" },
            { filterKey: "Slot", title: "Slot Bookings", icon: Calendar, desc: "Pre-arranged appointment times" },
          ].map((item) => {
            const isTargetActive = selectedTypeFilter === item.filterKey;
            return (
              <div 
                key={item.filterKey} 
                onClick={() => setSelectedTypeFilter(isTargetActive ? "ALL" : item.filterKey)}
                className={`card p-5 flex items-center gap-4 cursor-pointer select-none bg-white ${isTargetActive ? 'card-active' : 'hover:border-[#C5A059]'}`}
              >
                <div className={`w-12 h-12 rounded-xl border flex items-center justify-center transition-all ${isTargetActive ? 'text-white' : 'bg-amber-50/60 border-amber-100 text-[#C5A059]'}`} style={{ backgroundColor: isTargetActive ? CHARCOAL : '' }}>
                  <item.icon size={22} />
                </div>
                <div>
                  <h2 className="text-base font-black font-serif text-stone-900 leading-tight">{item.title}</h2>
                  {/* Rule 3: Balanced small description string */}
                  <p className="text-stone-600 text-[11px] font-normal leading-relaxed font-sans mt-0.5">{item.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── LEDGER TABLE CONTENT CONTAINER ── */}
        <div className="card p-6 bg-white overflow-hidden mb-8 text-left">
          <div className="flex items-center justify-between mb-6 border-b border-stone-100 pb-4">
            {/* Rule 1: Master Section Sub-Header Title Layout */}
            <h2 className="font-serif text-xl sm:text-2xl tracking-normal text-stone-900 flex items-center justify-start gap-2 whitespace-nowrap">
              <span className="font-bold uppercase">Live Operations</span>
              <span className="italic text-[#C5A059] normal-case font-medium">Queue</span>
              {selectedTypeFilter !== "ALL" && <span className="text-xs font-sans font-bold text-[#C5A059] lowercase">({selectedTypeFilter} only)</span>}
            </h2>
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#C5A059] bg-stone-50 px-2.5 py-1 rounded-md font-sans">
              {filteredBookings.length} Active Rows
            </span>
          </div>
          
          <div className="overflow-x-auto w-full custom-scrollbar font-sans">
            <table className="w-full min-w-[640px] text-sm border-collapse">
              <thead>
                <tr className="border-b border-stone-100 text-stone-400 text-[11px] font-extrabold uppercase tracking-widest font-sans">
                  <th className="text-left py-4 pr-4">Customer Entity</th>
                  <th className="text-left pr-4">Pipeline Type</th>
                  <th className="text-left pr-4">Target Window</th>
                  <th className="text-left pr-4">State</th>
                  <th className="text-right">Operations</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-50">
                {filteredBookings.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-12 text-stone-400 italic font-medium font-sans">
                      No matching transaction entries discovered in this viewport segment.
                    </td>
                  </tr>
                ) : (
                  filteredBookings.map((booking) => (
                    <tr key={booking.id} className="hover:bg-stone-50/60 transition-colors group">
                      <td className="py-4.5 pr-4 whitespace-nowrap font-bold text-stone-900 text-sm">{booking.name}</td>
                      <td className="pr-4 whitespace-nowrap">
                        <span className={`text-xs font-bold px-2 py-0.5 rounded ${booking.type === 'Slot' ? 'bg-blue-50 text-blue-700' : 'bg-stone-100 text-stone-700'}`}>
                          {booking.type}
                        </span>
                      </td>
                      <td className="pr-4 whitespace-nowrap text-stone-500 font-medium font-mono">{booking.slot}</td>
                      <td className="pr-4 whitespace-nowrap">
                        <span className={`px-2.5 py-0.5 rounded border text-[10px] font-black uppercase tracking-wider ${getStatusStyle(booking.status)}`}>
                          {booking.status}
                        </span>
                      </td>
                      <td>
                        <div className="flex gap-2 justify-end font-sans">
                          <button
                            onClick={() => approveBooking(booking.id)}
                            disabled={booking.status === "Approved"}
                            className="bg-emerald-50 text-emerald-700 border border-emerald-200/60 hover:bg-emerald-100 p-2 rounded-xl transition shrink-0 disabled:opacity-20 disabled:cursor-not-allowed cursor-pointer outline-none"
                            title="Approve Slot"
                          >
                            <Check size={14} strokeWidth={3} />
                          </button>
                          <button
                            onClick={() => rejectBooking(booking.id)}
                            disabled={booking.status === "Rejected"}
                            className="bg-rose-50 text-rose-700 border border-rose-200/60 hover:bg-rose-100 p-2 rounded-xl transition shrink-0 disabled:opacity-20 disabled:cursor-not-allowed cursor-pointer outline-none"
                            title="Reject Slot"
                          >
                            <X size={14} strokeWidth={3} />
                          </button>
                          <button
                            onClick={() => handleEditClick(booking)}
                            className="bg-stone-50 text-stone-600 border border-stone-200 hover:bg-stone-100 p-2 rounded-xl transition shrink-0 cursor-pointer outline-none"
                            title="Edit Allocation"
                          >
                            <Edit size={14} />
                          </button>
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

      {/* ── MODAL ADD/EDIT APPOINTMENT FORM DIALOGUE ── */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-stone-950/40 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white border border-[#EADBCE] rounded-[2rem] p-8 w-full max-w-md shadow-2xl relative text-left">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 text-stone-400 hover:text-stone-600 hover:bg-stone-100 p-1.5 rounded-xl transition cursor-pointer border-none outline-none bg-transparent"
            >
              <X size={16} />
            </button>

            {/* Rule 1: Modal Inner Subsection Headline Composition */}
            <h2 className="font-serif text-xl sm:text-2xl tracking-normal text-stone-900 flex items-center justify-start gap-2 whitespace-nowrap mb-6">
              <span className="font-bold uppercase">{editingBooking ? "Modify Booking" : "Generate Internal"}</span>
              <span className="italic text-[#C5A059] normal-case font-medium">{editingBooking ? "Parameters" : "Slot"}</span>
            </h2>

            <form onSubmit={handleFormSubmit} className="space-y-4 font-sans">
              <div>
                {/* Rule 2: Form Input structural label metadata header formatting */}
                <label className="block text-[11px] font-extrabold uppercase tracking-widest text-[#C5A059] mb-2 font-sans">Customer Identifier Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="E.g., Nitin Kumar"
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl p-3.5 outline-none text-stone-800 focus:border-amber-500 focus:bg-white transition text-sm font-medium placeholder-stone-400 font-sans"
                />
              </div>

              <div>
                <label className="block text-[11px] font-extrabold uppercase tracking-widest text-[#C5A059] mb-2 font-sans">Target Workflow Pipeline</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl p-3.5 outline-none text-stone-800 focus:border-amber-500 focus:bg-white transition text-sm font-medium cursor-pointer font-sans"
                >
                  <option value="Queue">Queue Booking</option>
                  <option value="Slot">Slot Booking</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-extrabold uppercase tracking-widest text-[#C5A059] mb-2 font-sans">Preferred Allocation Time</label>
                <select
                  value={formData.slot}
                  onChange={(e) => setFormData({ ...formData, slot: e.target.value })}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl p-3.5 outline-none text-stone-800 focus:border-amber-500 focus:bg-white transition text-sm font-medium cursor-pointer font-sans"
                >
                  <option value="10:00 AM">10:00 AM</option>
                  <option value="11:00 AM">11:00 AM</option>
                  <option value="12:00 PM">12:00 PM</option>
                  <option value="01:00 PM">01:00 PM</option>
                  <option value="02:00 PM">02:00 PM</option>
                  <option value="03:00 PM">03:00 PM</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4 font-sans">
                {/* Rule 4: Action Form navigation item elements buttons templates */}
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="w-full bg-stone-100 hover:bg-stone-200 text-stone-600 transition py-3.5 rounded-xl font-extrabold text-xs uppercase tracking-wider cursor-pointer font-sans border-none outline-none"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-full text-white transition py-3.5 rounded-xl font-extrabold text-xs uppercase tracking-wider shadow-md cursor-pointer font-sans border-none outline-none hover:opacity-95"
                  style={{ background: CHARCOAL }}
                >
                  {editingBooking ? "Save Rules" : "Confirm Slot"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}