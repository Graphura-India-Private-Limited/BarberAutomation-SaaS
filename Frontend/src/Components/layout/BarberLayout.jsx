import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { 
  Scissors, User, Coffee, AlertCircle, LogOut, Check, 
  ChevronDown, Menu, X, Clock, Settings, Users, 
  Calendar, IndianRupee, Star, Scissors as ServicesIcon, Play // <--- Added Play here
} from "lucide-react";

const STATUS_CFG = {
  available: { label: "Available", dot: "bg-emerald-500", text: "text-emerald-700" },
  busy: { label: "Busy", dot: "bg-amber-500", text: "text-amber-700" },
  break: { label: "On Break", dot: "bg-rose-500", text: "text-rose-700" }
};

export default function BarberLayout({ children, profile, status, setStatus, toast }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [sideOpen, setSideOpen] = useState(false);
  const [statusOpen, setStatusOpen] = useState(false);

  const sc = STATUS_CFG[status] || STATUS_CFG.available;

  // ═══ स्क्रीनशॉटनुसार सर्व पेजेसची अचूक लिस्ट ═══
  const NAV = [
    { id: "dashboard", label: "Dashboard", icon: Clock, route: "/barber/dashboard" },
    { id: "queue", label: "My Queue", icon: Users, route: "/barber/queue" },
    { id: "bookings", label: "Bookings", icon: Calendar, route: "/barber/bookings" },
    { id: "earnings", label: "Earnings", icon: IndianRupee, route: "/barber/earnings" },
    { id: "reviews", label: "Reviews", icon: Star, route: "/barber/reviews" },
    { id: "breaks", label: "Break Requests", icon: Coffee, route: "/barber/breaks", badge: 1 }, 
    { id: "noshow", label: "No-Show / Late", icon: AlertCircle, route: "/barber/noshow-handle" },
    { id: "services", label: "Services", icon: ServicesIcon, route: "/barber/services" },
    {id: "console", label: "Live Console", icon: Play, route: "/barber/service-console" },
    { id: "profile", label: "My Profile", icon: User, route: "/barber/profile" },
    { id: "settings", label: "Settings", icon: Settings, route: "/barber/settings" },
  ];

  return (
    <div className="flex min-h-screen text-[#4A3E3D] relative overflow-x-hidden" style={{ background: "#FDFBF7", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      
      {/* 📱 Mobile Backdrop Overlay */}
      {sideOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-xs z-40 md:hidden transition-opacity duration-300"
          onClick={() => setSideOpen(false)}
        />
      )}

      {/* ── ═══ LUXURY SIDEBAR ═══ ── */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 flex flex-col transition-all duration-300 bg-[#FDFBF7]/95 border-r border-[#E6D5C3] backdrop-blur-md 
          ${sideOpen ? "w-64 translate-x-0" : "-translate-x-full w-64 md:translate-x-0 md:w-64"}`}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-6 py-5 border-b border-[#E6D5C3]">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-gradient-to-br from-[#A06D3B] to-[#8B5A2B] shrink-0">
            <Scissors className="w-4.5 h-4.5 text-white" size={18} />
          </div>
          <div className="overflow-hidden">
            <p className="font-serif font-black text-sm leading-none truncate w-40">{profile?.salonName || "The Royal Cuts"}</p>
            <p className="text-[10px] mt-1 font-bold uppercase tracking-widest text-[#8B5A2B]">Barber Panel</p>
          </div>
        </div>

        {/* Profile Details */}
        <div className="mx-4 my-4 rounded-xl p-4 bg-[#8B5A2B]/5 border border-[#8B5A2B]/15">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full flex items-center justify-center font-black text-sm text-white bg-gradient-to-br from-[#8B5A2B] to-[#4A3E3D] shrink-0">
              {profile?.initials || "SK"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-serif font-black text-sm truncate">{profile?.name || "Sameer Khan"}</p>
              <p className="text-[10px] text-stone-500 font-medium truncate">{profile?.specialization || "Haircut & Beard Expert"}</p>
            </div>
          </div>

          {/* Status selector */}
          <div className="mt-3 relative">
            <button 
              onClick={() => setStatusOpen(!statusOpen)} 
              className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-black uppercase tracking-wider bg-white border border-[#E6D5C3] text-stone-700 cursor-pointer h-9"
            >
              <span className="flex items-center gap-2">
                <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
                <span>{sc.label}</span>
              </span>
              <ChevronDown className={`w-3.5 h-3.5 text-stone-500 transition-transform ${statusOpen ? "rotate-180" : ""}`} />
            </button>
            
            {statusOpen && (
              <div className="absolute top-full left-0 right-0 mt-1 rounded-xl overflow-hidden z-50 bg-white border border-[#E6D5C3] shadow-lg">
                {Object.entries(STATUS_CFG).map(([key, cfg]) => (
                  <button 
                    key={key} 
                    onClick={() => { setStatus(key); setStatusOpen(false); }} 
                    className="w-full flex items-center gap-2.5 px-3 py-2.5 text-xs border-b border-[#E6D5C3]/20 last:border-0 hover:bg-[#FDFBF7] transition-colors text-left cursor-pointer font-bold"
                  >
                    <span className={`w-2 h-2 rounded-full ${cfg.dot}`} />
                    <span className="font-sans uppercase tracking-wider">{cfg.label}</span>
                    {status === key && <Check className="w-3 h-3 ml-auto text-[#8B5A2B]" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 px-3 space-y-0.5 overflow-y-auto pb-4">
          {NAV.map((n) => {
            const isActive = location.pathname === n.route;
            return (
              <button 
                key={n.id} 
                onClick={() => { navigate(n.route); setSideOpen(false); }} 
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all text-left cursor-pointer group relative ${
                  isActive 
                    ? "bg-[#8B5A2B]/10 font-black text-[#4A3E3D]" 
                    : "text-stone-500 hover:bg-[#8B5A2B]/5 hover:text-stone-900 font-extrabold"
                }`}
              >
                <n.icon className="w-4 h-4 shrink-0 transition-colors" style={{ color: isActive ? "#8B5A2B" : "#A39796" }} />
                <span className="text-xs uppercase tracking-wider font-sans">{n.label}</span>
                
                {n.badge && (
                  <span className="ml-auto w-5 h-5 rounded-full bg-[#8B5A2B] text-white flex items-center justify-center text-[10px] font-black font-sans">
                    {n.badge}
                  </span>
                )}

                {/* एक्टिव्ह टॅबसाठी राइट साईडचा इंडिकेटर बार */}
                {isActive && !n.badge && (
                  <div className="w-1.5 h-4 rounded-full bg-[#8B5A2B] ml-auto" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="px-3 pb-4 pt-3 border-t border-[#E6D5C3]">
          <button 
            onClick={() => { localStorage.clear(); navigate("/barber/login"); }} 
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-red-700 hover:bg-red-50/60 text-xs font-black uppercase tracking-wider transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4 text-red-600" /> Logout
          </button>
        </div>
      </aside>

      {/* ── ═══ MAIN CONTENT AREA ═══ ── */}
      <div className="flex-1 min-w-0 md:ml-64 flex flex-col">
        
        {/* Mobile Top Navbar Header */}
        <header className="md:hidden flex items-center justify-between px-4 py-4 bg-white border-b border-[#E6D5C3] sticky top-0 z-30">
          <button onClick={() => setSideOpen(!sideOpen)} className="p-1 text-[#4A3E3D] cursor-pointer">
            {sideOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
          <p className="font-serif font-black text-sm truncate max-w-[180px]">{profile?.salonName || "The Royal Cuts"}</p>
          <div className="w-8 h-8 rounded-full bg-[#8B5A2B] text-white flex items-center justify-center font-bold text-xs shrink-0">
            {profile?.initials || "SK"}
          </div>
        </header>

        {/* Dynamic Inner Page Content Area */}
        <main className="flex-1">
          {children}
        </main>
      </div>

    </div>
  );
}