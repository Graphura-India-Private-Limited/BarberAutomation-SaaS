import React, { useState } from "react";
import { 
  Calendar, Clock, CheckCircle2, AlertCircle, XCircle, 
  Search, SlidersHorizontal, User, Sparkles, Scissors, Landmark, Menu, Bell 
} from "lucide-react";

// Mock operational dataset
const INITIAL_BOOKINGS = [
  { id: "BK-2026-01", customer: "Mayur K.", service: "Classic Haircut", time: "10:30 AM", date: "Today", price: 299, status: "confirmed", notes: "Prefers low fade drop" },
  { id: "BK-2026-02", customer: "Rahul Verma", service: "Beard Trim & Shape", time: "11:45 AM", date: "Today", price: 199, status: "in-service", notes: "Lineup with straight razor" },
];

const STATUS_CONFIG = {
  "pending": { label: "Awaiting Check-in", css: "bg-amber-50 text-amber-700 border-amber-200/60" },
  "confirmed": { label: "Confirmed Slot", css: "bg-stone-100 text-stone-800 border-stone-300/50" },
  "in-service": { label: "Live In Service", css: "bg-emerald-50 text-emerald-700 border-emerald-200/60 animate-pulse" },
  "cancelled": { label: "Cancelled Log", css: "bg-rose-50 text-rose-700 border-rose-200/40" }
};

export default function BarberBookings() {
  const [bookings, setBookings] = useState(INITIAL_BOOKINGS);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  
  // परिभाषित स्टेट्स
  const [sideOpen, setSideOpen] = useState(false);
  const profile = { salonName: "Master Barber Lounge", initials: "MB" };

  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = booking.customer.toLowerCase().includes(search.toLowerCase()) || 
                          booking.service.toLowerCase().includes(search.toLowerCase());
    if (!matchesSearch) return false;
    if (filter === "today") return booking.date === "Today";
    if (filter === "pending") return booking.status === "pending";
    if (filter === "in-service") return booking.status === "in-service";
    return true;
  });

  const updateBookingStatus = (id, nextStatus) => {
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status: nextStatus } : b));
  };

  return (
   <div className="min-h-screen bg-[#FAF6F0] text-stone-800 font-sans antialiased flex flex-col">
      {/* Header */}
     <header className="sticky top-0 z-50 w-full px-4 md:px-8 py-4 bg-[#1A1A1A] border-b border-[#D4AF37]/20 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button className="md:hidden p-2 text-zinc-400" onClick={() => setSideOpen(!sideOpen)}>
            <Menu className="w-5 h-5" />
          </button>
          <div className="text-left">
            <h1 className="text-white font-bold text-xl font-serif">Bookings</h1>
            <p className="text-[10px] text-zinc-500 uppercase tracking-widest">{profile.salonName}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="p-2 text-zinc-400 bg-white/5 rounded-lg border border-white/10"><Bell className="w-4 h-4" /></button>
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#F5C842] to-[#E8A020] flex items-center justify-center text-xs font-bold text-black">
            {profile.initials}
          </div>
        </div>
      </header>
        

        {/* ── WORKSPACE DASHBOARD CONTENT CANVAS ── */}
       <main className="flex-grow max-w-6xl mx-auto w-full px-5 py-6 text-left">
          
          {/* Main Module Headline Context */}
         <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4 border-b border-stone-200/60 pb-6">
          
            <div>
              <h1 className="text-3xl font-black tracking-tight text-stone-900 uppercase font-serif">
                Reservation <span className="text-[#C5A059]">Ledger</span>
              </h1>
              <p className="text-[10px] font-black uppercase tracking-widest text-[#A37B58] mt-1.5">
                Live Studio Client Appointment Log Framework
              </p>
            </div>
            
            {/* Quick volume capacity parameters text label */}
            <div className="flex items-center gap-2 bg-white px-3.5 py-2 rounded-xl border border-stone-200/80 shadow-3xs w-fit">
              <Calendar size={13} className="text-[#C5A059]" />
              <span className="text-[10px] font-black uppercase tracking-wider text-stone-500 font-mono">
                {bookings.filter(b => b.date === "Today" && b.status !== "cancelled").length} Active Slots Today
              </span>
            </div>
          </div>

          {/* ── FILTER UTILITIES CONSOLE MATRIX PANEL ── */}
          <div className="bg-white border border-stone-200/80 rounded-2xl p-5 mb-6 shadow-3xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Search Input atom line component */}
            <div className="relative flex items-center flex-1 max-w-md">
              <Search size={15} className="absolute left-3.5 text-stone-400" />
              <input 
                type="text"
                placeholder="Search customer signature or requested service..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full bg-[#FAF6F0]/40 border border-stone-200 rounded-xl pl-10 pr-4 py-3 text-xs font-bold text-stone-800 placeholder-stone-400 focus:outline-none focus:border-[#C5A059] transition-all"
              />
            </div>

            {/* Filter segments row control options list */}
            <div className="flex flex-wrap items-center gap-2">
              {[
                { id: "all", label: "All Logs" },
                { id: "today", label: "Today's Grid" },
                { id: "pending", label: "Awaiting Actions" },
                { id: "in-service", label: "Live Chairs" }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setFilter(tab.id)}
                  className={`px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                    filter === tab.id 
                      ? "bg-[#3E362E] text-white shadow-xs" 
                      : "bg-stone-50 text-stone-500 border border-stone-200/60 hover:border-stone-400 hover:text-stone-800"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* ── CLIENT BOOKING CARDS COLLECTION LOOP LIST ── */}
          <div className="space-y-4">
            {filteredBookings.length === 0 ? (
              <div className="text-center py-20 bg-white border border-stone-200/50 rounded-2xl shadow-3xs text-stone-400 text-xs font-black uppercase tracking-widest">
                📭 No operational bookings matched your current filter parameter loops.
              </div>
            ) : (
              filteredBookings.map(item => {
                const conf = STATUS_CONFIG[item.status] || STATUS_CONFIG.pending;
                return (
                  <div 
                    key={item.id} 
                    className="bg-white border border-stone-200/60 rounded-2xl p-5 md:p-6 flex flex-col md:flex-row md:items-center md:justify-between shadow-3xs hover:shadow-md transition-all gap-5"
                  >
                    {/* Left core credentials layout segment split block */}
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-stone-50 border border-stone-200 flex items-center justify-center text-[#C5A059] shrink-0 shadow-3xs">
                        <User size={20} strokeWidth={1.5} />
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-extrabold text-stone-900 text-lg tracking-tight leading-none">{item.customer}</span>
                          <span className="text-[9px] font-mono font-bold text-stone-400 bg-stone-50 px-2 py-0.5 rounded border border-stone-200/40">{item.id}</span>
                        </div>
                        <p className="text-xs font-bold text-[#A37B58] uppercase tracking-wider flex items-center gap-1">
                          <Scissors size={12} /> {item.service} <span className="text-stone-300 mx-1">·</span> <Clock size={12} /> {item.date}, {item.time}
                        </p>
                        {item.notes && (
                          <p className="text-[11px] font-medium text-stone-500 bg-[#FAF6F0]/60 px-2.5 py-1 rounded-md border border-stone-100 mt-2 inline-block">
                            💡 Instruction: {item.notes}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Right side tracking parameters and transactional check lines context */}
                    <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center border-t md:border-t-0 pt-4 md:pt-0 border-stone-100 shrink-0 gap-3">
                      <div className="text-left md:text-right">
                        <span className="text-xs font-bold text-stone-400 uppercase tracking-widest block">Settlement due</span>
                        <span className="font-mono text-base font-black text-stone-900">₹{item.price}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg border shadow-3xs ${conf.css}`}>
                          {conf.label}
                        </span>

                        {/* Inline transactional state modifier controller dropdown split toggle list */}
                        {item.status !== "cancelled" && (
                          <div className="flex gap-1.5">
                            {item.status === "pending" && (
                              <button 
                                onClick={() => updateBookingStatus(item.id, "confirmed")}
                                className="p-1.5 rounded-lg bg-stone-50 hover:bg-stone-900 text-stone-600 hover:text-white border border-stone-200 transition-colors cursor-pointer"
                                title="Confirm check-in slot lock"
                              >
                                <CheckCircle2 size={14} />
                              </button>
                            )}
                            {item.status === "confirmed" && (
                              <button 
                                onClick={() => updateBookingStatus(item.id, "in-service")}
                                className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[9px] font-black uppercase tracking-widest transition-all cursor-pointer shadow-xs"
                              >
                                Start Service
                              </button>
                            )}
                            {item.status === "in-service" && (
                              <button 
                                onClick={() => updateBookingStatus(item.id, "confirmed")}
                                className="px-3 py-1.5 rounded-lg bg-stone-900 hover:bg-stone-800 text-[#C5A059] text-[9px] font-black uppercase tracking-widest transition-all cursor-pointer shadow-xs"
                              >
                                Complete 🏁
                              </button>
                            )}
                            {item.status !== "in-service" && (
                              <button 
                                onClick={() => updateBookingStatus(item.id, "cancelled")}
                                className="p-1.5 rounded-lg bg-rose-50/40 hover:bg-rose-600 text-rose-600 hover:text-white border border-rose-200/60 transition-colors cursor-pointer"
                                title="Strike cancel log ticket slot"
                              >
                                <XCircle size={14} />
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                  </div>
                );
              })
            )}
          </div>

        </main>
      </div>
  );
}