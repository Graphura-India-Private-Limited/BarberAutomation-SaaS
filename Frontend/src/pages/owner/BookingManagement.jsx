import React, { useState, useEffect, useMemo } from "react";
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
import { useNavigate } from "react-router-dom";

export default function BookingManagement() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [selectedTypeFilter, setSelectedTypeFilter] = useState("ALL"); // ALL, Queue, Slot, Priority
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
    { id: 4, name: "Priya Deshmukh", type: "Priority", slot: "12:00 PM", status: "Pending" },
  ]);

  const [activities] = useState([
    { id: 1, text: "Rahul booked haircut", time: "2 sec ago" },
    { id: 2, text: "Priya upgraded to premium", time: "1 min ago" },
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
    navigate("/login");
  };

  // Dynamic Compound Filter Engine (Combines text searching and segment button states)
  const filteredBookings = useMemo(() => {
    return bookings.filter((b) => {
      const matchesSearch = b.name.toLowerCase().includes(search.toLowerCase());
      const matchesType = selectedTypeFilter === "ALL" || b.type.toLowerCase() === selectedTypeFilter.toLowerCase();
      return matchesSearch && matchesType;
    });
  }, [bookings, search, selectedTypeFilter]);

  // Compute live contextual counts for the metrics cards
  const stats = useMemo(() => {
    return {
      today: bookings.length * 32, // Mock scalar scaling factor aligned with your original layout UI state
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
    <div className="min-h-screen font-sans text-stone-800 selection:bg-amber-100" style={{ background: "#FAF6F0" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap');
        body { background-color: #FAF6F0; }
        .font-sans { font-family: 'Plus Jakarta Sans', sans-serif !important; }
        .font-serif { font-family: 'Playfair Display', serif !important; }
        
        .card { 
          background: #FFFFFF; 
          border: 1px solid #EADBCE; 
          border-radius: 24px; 
          box-shadow: 0 4px 20px -2px rgba(28, 25, 23, 0.04), 0 2px 8px -1px rgba(28, 25, 23, 0.02);
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .card-active {
          border-color: #D97706 !with-shadow !important;
          box-shadow: 0 0 0 2px #D97706, 0 10px 25px -4px rgba(217, 119, 6, 0.15) !important;
        }
      `}</style>

      {/* ── STICKY TOP PLATFORM HEADER ── */}
      <header className="w-full border-b border-[#EADBCE] bg-white/90 backdrop-blur-md sticky top-0 z-40 px-6 py-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#D97706] to-[#F59E0B] flex items-center justify-center shadow-md">
            <Scissors size={20} className="text-white" strokeWidth={2.5} />
          </div>
          <div>
            <h4 className="text-stone-900 font-extrabold tracking-[0.2em] text-xs uppercase">Barber Pro</h4>
            <p className="text-[#B45309] text-[9px] font-black tracking-[0.3em] uppercase mt-0.5">Owner Console</p>
          </div>
        </div>
        
        <div className="flex items-center gap-6 relative">
          <div className="hidden sm:flex flex-col text-right">
            <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wider">System Clock</span>
            <span className="text-xs font-extrabold text-stone-800 mt-0.5">{time} IST</span>
          </div>

          {/* Bell Icon Trigger Wrapper */}
          <div className="relative">
            <button 
              onClick={() => setIsNotifOpen(!isNotifOpen)}
              className={`p-3 rounded-xl border text-stone-600 transition relative cursor-pointer shadow-sm ${isNotifOpen ? 'bg-amber-50 border-amber-500 text-[#D97706]' : 'bg-white border-stone-200 hover:bg-stone-50'}`}
            >
              <Bell size={18} />
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
            </button>
            
            {/* Animated Micro Activity Dropdown Menu */}
            {isNotifOpen && (
              <div className="absolute right-0 mt-3 w-80 rounded-2xl border border-[#EADBCE] bg-white p-4 shadow-xl z-50 animate-fade-in">
                <div className="flex items-center justify-between mb-3 pb-2 border-b border-stone-100">
                  <h4 className="text-xs font-black uppercase tracking-wider text-stone-500">Live Activity Feed</h4>
                  <button onClick={() => setIsNotifOpen(false)} className="text-[10px] font-bold text-amber-700 hover:underline">Dismiss</button>
                </div>
                <div className="space-y-3">
                  {activities.map((act) => (
                    <div key={act.id} className="text-xs border-l-2 border-[#D97706] pl-2.5 py-0.5">
                      <p className="text-stone-800 font-medium">{act.text}</p>
                      <span className="text-[10px] text-stone-400 font-sans">{act.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <button onClick={handleLogout} className="flex items-center gap-2 border border-stone-200 hover:border-stone-400 hover:bg-stone-50 px-4 py-2.5 rounded-xl text-stone-600 text-xs font-bold uppercase tracking-widest transition-all duration-200 cursor-pointer">
            <LogOut size={14} /> Exit
          </button>
        </div>
      </header>

      {/* ── MAIN WORKSPACE CONTENT GRID ── */}
      <main className="mx-auto max-w-7xl px-4 py-8 md:px-8">
        
        {/* ── CONTEXT HEADER TITLE CARD ── */}
        <div className="relative rounded-3xl p-8 mb-6 overflow-hidden card bg-white">
          <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <p className="text-amber-700 font-bold tracking-[0.2em] text-xs uppercase mb-1">
                Elite Grooming Management
              </p>
              <h1 className="text-3xl lg:text-4xl font-black font-serif tracking-tight text-stone-900 leading-none">Booking Dashboard</h1>
              <p className="text-stone-500 mt-2 text-sm">Monitor floor allocation flow, approve queue intents, and confirm appointment configurations.</p>
            </div>
            <button
              onClick={handleNewBookingClick}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-amber-600 hover:bg-amber-700 px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-white shadow-md active:scale-[0.98] transition-all duration-200 cursor-pointer self-start sm:self-center"
            >
              <Plus size={16} /> New Booking
            </button>
          </div>
        </div>

        {/* ── SYSTEM MATRIX SUMMARY NUMBERS ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { title: "Today's Bookings", value: stats.today, icon: Calendar, color: "bg-orange-50 text-orange-700 border-orange-100" },
            { title: "Customers", value: stats.customers, icon: Users, color: "bg-amber-50 text-amber-700 border-amber-100" },
            { title: "Revenue Index", value: "12k", icon: IndianRupee, color: "bg-emerald-50 text-emerald-700 border-emerald-100" },
            { title: "Pending Reviews", value: stats.pendingCount, icon: Clock3, color: "bg-sky-50 text-sky-700 border-sky-100" },
          ].map((item) => (
            <div key={item.title} className="card p-5 bg-white flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl border flex items-center justify-center flex-shrink-0 ${item.color}`}>
                <item.icon size={22} />
              </div>
              <div>
                <h3 className="text-[10px] font-black text-stone-400 uppercase tracking-wider mb-1">{item.title}</h3>
                <p className="text-2xl font-black font-serif tracking-normal text-stone-900 leading-none">{item.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ── SEARCH INDEX CONSOLE ── */}
        <div className="card p-4 mb-6 flex items-center gap-3 bg-white">
          <Search className="text-amber-600 shrink-0" size={18} />
          <input
            type="text"
            placeholder="Search active guest by name identifier..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent outline-none w-full text-stone-800 placeholder-stone-400 text-sm font-medium"
          />
          {selectedTypeFilter !== "ALL" && (
            <button 
              onClick={() => setSelectedTypeFilter("ALL")}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-black bg-stone-100 text-stone-500 uppercase tracking-wider hover:bg-stone-200 transition"
            >
              <SlidersHorizontal size={12} /> Clear Filter
            </button>
          )}
        </div>

        {/* ── INTERACTIVE FILTER SEGMENTS (Now updates the table state instantly) ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {[
            { filterKey: "Queue", title: "Queue Bookings", icon: Clock3, desc: "On-demand routing slot entries" },
            { filterKey: "Slot", title: "Slot Bookings", icon: Calendar, desc: "Pre-arranged appointment times" },
            { filterKey: "Priority", title: "Priority Bookings", icon: Crown, desc: "VIP fast-track checkout nodes" },
          ].map((item) => {
            const isTargetActive = selectedTypeFilter === item.filterKey;
            return (
              <div 
                key={item.filterKey} 
                onClick={() => setSelectedTypeFilter(isTargetActive ? "ALL" : item.filterKey)}
                className={`card p-5 flex items-center gap-4 cursor-pointer select-none bg-white ${isTargetActive ? 'card-active ring-2 ring-[#D97706] border-[#D97706]' : 'hover:border-[#D6C4AE]'}`}
              >
                <div className={`w-12 h-12 rounded-xl border flex items-center justify-center transition-all ${isTargetActive ? 'bg-amber-600 border-amber-700 text-white' : 'bg-amber-50/60 border-amber-100 text-amber-700'}`}>
                  <item.icon size={22} />
                </div>
                <div>
                  <h2 className="text-base font-black font-serif text-stone-900 leading-tight">{item.title}</h2>
                  <p className="text-[11px] font-medium text-stone-400 mt-0.5">{item.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── LEDGER TABLE CONTENT CONTAINER ── */}
        <div className="card p-6 bg-white overflow-hidden mb-8">
          <div className="flex items-center justify-between mb-6 border-b border-stone-100 pb-4">
            <h2 className="text-xl font-black font-serif text-stone-900 tracking-tight">
              Live Operations Queue {selectedTypeFilter !== "ALL" && <span className="text-sm font-sans font-bold text-[#D97706] lowercase">({selectedTypeFilter} only)</span>}
            </h2>
            <span className="text-[10px] font-black uppercase tracking-widest bg-stone-100 px-2.5 py-1 rounded-md text-stone-500">
              {filteredBookings.length} Active Rows
            </span>
          </div>
          
          <div className="overflow-x-auto w-full custom-scrollbar">
            <table className="w-full min-w-[640px] text-sm">
              <thead>
                <tr className="border-b border-stone-100 text-stone-400 text-[11px] font-black uppercase tracking-[0.15em]">
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
                    <td colSpan={5} className="text-center py-12 text-stone-400 italic font-medium">
                      No matching transaction entries discovered in this viewport segment.
                    </td>
                  </tr>
                ) : (
                  filteredBookings.map((booking) => (
                    <tr key={booking.id} className="hover:bg-stone-50/60 transition-colors group">
                      <td className="py-4.5 pr-4 whitespace-nowrap font-bold text-stone-900 text-sm">{booking.name}</td>
                      <td className="pr-4 whitespace-nowrap">
                        <span className={`text-xs font-bold px-2 py-0.5 rounded ${booking.type === 'Priority' ? 'bg-purple-50 text-purple-700' : booking.type === 'Slot' ? 'bg-blue-50 text-blue-700' : 'bg-stone-100 text-stone-700'}`}>
                          {booking.type}
                        </span>
                      </td>
                      <td className="pr-4 whitespace-nowrap text-stone-500 font-medium font-mono">{booking.slot}</td>
                      <td className="pr-4 whitespace-nowrap">
                        <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${getStatusStyle(booking.status)}`}>
                          {booking.status}
                        </span>
                      </td>
                      <td>
                        <div className="flex gap-2 justify-end">
                          <button
                            onClick={() => approveBooking(booking.id)}
                            disabled={booking.status === "Approved"}
                            className="bg-emerald-50 text-emerald-700 border border-emerald-200/60 hover:bg-emerald-100 p-2 rounded-xl transition shrink-0 disabled:opacity-20 disabled:cursor-not-allowed cursor-pointer"
                            title="Approve Slot"
                          >
                            <Check size={14} strokeWidth={3} />
                          </button>
                          <button
                            onClick={() => rejectBooking(booking.id)}
                            disabled={booking.status === "Rejected"}
                            className="bg-rose-50 text-rose-700 border border-rose-200/60 hover:bg-rose-100 p-2 rounded-xl transition shrink-0 disabled:opacity-20 disabled:cursor-not-allowed cursor-pointer"
                            title="Reject Slot"
                          >
                            <X size={14} strokeWidth={3} />
                          </button>
                          <button
                            onClick={() => handleEditClick(booking)}
                            className="bg-stone-50 text-stone-600 border border-stone-200 hover:bg-stone-100 p-2 rounded-xl transition shrink-0 cursor-pointer"
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
      </main>

      {/* ── MODAL ADD/EDIT APPOINTMENT FORM DIALOGUE ── */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-stone-950/40 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white border border-[#EADBCE] rounded-[2rem] p-8 w-full max-w-md shadow-2xl relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 text-stone-400 hover:text-stone-600 hover:bg-stone-100 p-1.5 rounded-xl transition cursor-pointer"
            >
              <X size={16} />
            </button>

            <h2 className="text-2xl font-black mb-6 font-serif text-stone-900 tracking-tight">
              {editingBooking ? "Modify Booking Parameters" : "Generate Internal Slot"}
            </h2>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-wider text-stone-400 mb-2">Customer Identifier Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="E.g., Nitin Kumar"
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl p-3.5 outline-none text-stone-800 focus:border-amber-500 focus:bg-white transition text-sm font-bold placeholder-stone-400"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-wider text-stone-400 mb-2">Target Workflow Pipeline</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl p-3.5 outline-none text-stone-800 focus:border-amber-500 focus:bg-white transition text-sm font-bold cursor-pointer"
                >
                  <option value="Queue">Queue Booking</option>
                  <option value="Slot">Slot Booking</option>
                  <option value="Priority">Priority Booking</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-wider text-stone-400 mb-2">Preferred Allocation Time</label>
                <select
                  value={formData.slot}
                  onChange={(e) => setFormData({ ...formData, slot: e.target.value })}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl p-3.5 outline-none text-stone-800 focus:border-amber-500 focus:bg-white transition text-sm font-bold cursor-pointer"
                >
                  <option value="10:00 AM">10:00 AM</option>
                  <option value="11:00 AM">11:00 AM</option>
                  <option value="12:00 PM">12:00 PM</option>
                  <option value="01:00 PM">01:00 PM</option>
                  <option value="02:00 PM">02:00 PM</option>
                  <option value="03:00 PM">03:00 PM</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="w-full bg-stone-100 hover:bg-stone-200 text-stone-600 transition py-3.5 rounded-xl font-bold text-xs uppercase tracking-widest cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-amber-600 to-amber-500 text-white transition py-3.5 rounded-xl font-extrabold text-xs uppercase tracking-widest shadow-md hover:from-amber-700 cursor-pointer"
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