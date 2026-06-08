import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { 
  Scissors, User, Coffee, AlertCircle, LogOut, Check, 
  ChevronDown, Menu, X, Clock, Settings, Users, 
  Calendar, IndianRupee, Star, Scissors as ServicesIcon, Play,
  UserCheck, Bell, Layers
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
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  const mockNotifications = [
    { id: 1, text: "New Booking: Mayur K. booked Classic Haircut at 10:30 AM", time: "5m ago" },
    { id: 2, text: "Break Request: Your break request for 2:00 PM was approved by Owner", time: "1h ago" },
    { id: 3, text: "System Alert: Salon hours extended by 30 mins today for festive demand", time: "2h ago" },
  ];

  const sc = STATUS_CFG[status] || STATUS_CFG.available;

  // ═══ स्क्रीनशॉटनुसार सर्व पेजेसची अचूक लिस्ट ═══
  const NAV = [
    { id: "overview", label: "Overview", icon: Layers, route: "/barber/overview" },
    { id: "dashboard", label: "Dashboard", icon: Clock, route: "/barber/dashboard" },
    { id: "queue", label: "My Queue", icon: Users, route: "/barber/queue" },
    { id: "interactions", label: "Interactions", icon: UserCheck, route: "/barber/interactions" },
    { id: "bookings", label: "Bookings", icon: Calendar, route: "/barber/bookings" },
    { id: "earnings", label: "Earnings", icon: IndianRupee, route: "/barber/earnings" },
    { id: "reviews", label: "Reviews", icon: Star, route: "/barber/reviews" },
    { id: "breaks", label: "Break Requests", icon: Coffee, route: "/barber/breaks", badge: 1 }, 
    { id: "noshow", label: "No-Show / Late", icon: AlertCircle, route: "/barber/noshow-delay" },
    { id: "services", label: "Services", icon: ServicesIcon, route: "/barber/services" },
    {id: "console", label: "Live Console", icon: Play, route: "/barber/service-console" },
    { id: "profile", label: "My Profile", icon: User, route: "/barber/profile" },
    { id: "settings", label: "Settings", icon: Settings, route: "/barber/settings" },
  ];

  const getInitials = (name) => {
    if (!name) return "AM";
    const clean = name.replace(/\(.*?\)/g, "").trim();
    const words = clean.split(/\s+/).filter(Boolean);
    if (words.length >= 2) return (words[0][0] + words[1][0]).toUpperCase();
    return words[0] ? words[0].slice(0, 2).toUpperCase() : "AM";
  };

  const barberName = localStorage.getItem("barberName") || localStorage.getItem("name") || profile?.name || "Ali (Master Stylist)";
  const initials = getInitials(barberName);
  const salonName = localStorage.getItem("salonName") || profile?.salonName || "The Royal Cuts";
  const specialization = profile?.specialization || "Haircut & Beard Expert";

  const getPageTitle = (pathname) => {
    const matched = NAV.find(n => n.route === pathname);
    if (matched) return matched.label;
    
    // Fallbacks
    if (pathname.includes("live-session") || pathname.includes("service-console")) return "Live Console";
    if (pathname.includes("service-handler")) return "Service Handler";
    if (pathname.includes("noshow-delay")) return "No-Show Delay";
    if (pathname.includes("noshow-handle")) return "No-Show / Late";
    if (pathname.includes("breaks")) return "Break Requests";
    
    return "Barber Console";
  };
  
  const pageTitle = getPageTitle(location.pathname);

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
            <p className="font-serif font-black text-sm leading-none truncate w-40">{salonName}</p>
            <p className="text-[10px] mt-1 font-bold uppercase tracking-widest text-[#8B5A2B]">Barber Panel</p>
          </div>
        </div>

        {/* Profile Details */}
        <div className="mx-4 my-4 rounded-xl p-4 bg-[#8B5A2B]/5 border border-[#8B5A2B]/15">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full flex items-center justify-center font-black text-sm text-white bg-gradient-to-br from-[#8B5A2B] to-[#4A3E3D] shrink-0">
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-serif font-black text-sm truncate">{barberName}</p>
              <p className="text-[10px] text-stone-500 font-medium truncate">{specialization}</p>
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
            const isActive = location.pathname === n.route || 
                             (n.id === "noshow" && (location.pathname === "/barber/noshow-delay" || location.pathname === "/barber/noshow-handle"));
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
        
        {/* Unified Top Navbar Header */}
        <header className="sticky top-0 z-50 w-full px-4 md:px-8 py-4 bg-[#1A1A1A] border-b border-[#D4AF37]/20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => setSideOpen(!sideOpen)} className="md:hidden p-2 text-zinc-400 hover:text-white transition-colors cursor-pointer">
              {sideOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <div className="text-left">
              <h1 className="text-white font-bold text-xl font-serif">{pageTitle}</h1>
              <p className="text-[10px] text-zinc-500 uppercase tracking-widest">{salonName}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            
            {/* Bell button */}
            <div className="relative">
              <button 
                onClick={() => { setShowNotifications(!showNotifications); setShowProfileDropdown(false); }}
                className="p-2 text-zinc-400 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 hover:text-white transition-colors cursor-pointer relative"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
              </button>

              {showNotifications && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)} />
                  <div className="absolute right-0 mt-2.5 w-80 bg-white border border-[#E6D5C3] rounded-2xl p-4 shadow-xl z-50 text-left text-sm text-[#4A3E3D] animate-in fade-in slide-in-from-top-1 duration-200">
                    <div className="border-b border-[#E6D5C3]/40 pb-2 mb-2 flex justify-between items-center">
                      <span className="font-serif font-black text-[#8B5A2B] uppercase tracking-wider text-xs">Notifications</span>
                      <span className="text-[9px] font-bold bg-[#8B5A2B]/10 text-[#8B5A2B] px-2 py-0.5 rounded-full">3 New</span>
                    </div>
                    <div className="space-y-3">
                      {mockNotifications.map(n => (
                        <div key={n.id} className="border-b border-stone-50 pb-2 last:border-0 last:pb-0">
                          <p className="text-xs font-semibold leading-normal">{n.text}</p>
                          <p className="text-[9px] text-stone-400 mt-1 font-mono">{n.time}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Profile Initials button */}
            <div className="relative">
              <button 
                onClick={() => { setShowProfileDropdown(!showProfileDropdown); setShowNotifications(false); }}
                className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#F5C842] to-[#E8A020] flex items-center justify-center text-xs font-bold text-black cursor-pointer hover:scale-105 active:scale-95 transition-transform"
              >
                {initials}
              </button>

              {showProfileDropdown && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowProfileDropdown(false)} />
                  <div className="absolute right-0 mt-2.5 w-48 bg-white border border-[#E6D5C3] rounded-2xl p-3 shadow-xl z-50 text-left text-xs font-bold uppercase tracking-wider text-[#4A3E3D] animate-in fade-in slide-in-from-top-1 duration-200">
                    <div className="border-b border-[#E6D5C3]/40 pb-2.5 mb-2.5 px-2 text-left">
                      <p className="font-serif font-black text-[#2C211A] text-sm tracking-normal capitalize">{barberName.split(" ")[0]}</p>
                      <p className="text-[9px] text-[#C5A059] font-black tracking-widest mt-0.5">{specialization}</p>
                    </div>
                    
                    <div className="space-y-0.5">
                      <button 
                        onClick={() => { navigate("/barber/profile"); setShowProfileDropdown(false); }} 
                        className="w-full flex items-center gap-2 px-2.5 py-2 hover:bg-[#8B5A2B]/5 hover:text-[#8B5A2B] rounded-xl transition-colors cursor-pointer text-left uppercase tracking-wider text-[10px]"
                      >
                        My Profile
                      </button>
                      <button 
                        onClick={() => { navigate("/barber/service-console"); setShowProfileDropdown(false); }} 
                        className="w-full flex items-center gap-2 px-2.5 py-2 hover:bg-[#8B5A2B]/5 hover:text-[#8B5A2B] rounded-xl transition-colors cursor-pointer text-left uppercase tracking-wider text-[10px]"
                      >
                        Live Console
                      </button>
                      <button 
                        onClick={() => { navigate("/barber/settings"); setShowProfileDropdown(false); }} 
                        className="w-full flex items-center gap-2 px-2.5 py-2 hover:bg-[#8B5A2B]/5 hover:text-[#8B5A2B] rounded-xl transition-colors cursor-pointer text-left uppercase tracking-wider text-[10px]"
                      >
                        Settings
                      </button>
                    </div>

                    <div className="border-t border-[#E6D5C3]/40 pt-2 mt-2">
                      <button 
                        onClick={() => { localStorage.clear(); navigate("/barber/login"); }} 
                        className="w-full flex items-center gap-2 px-2.5 py-2 text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer text-left uppercase tracking-wider text-[10px]"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>

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