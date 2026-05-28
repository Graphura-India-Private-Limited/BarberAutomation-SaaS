import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Scissors, Calendar, Clock, Star, TrendingUp, User,
  CheckCircle, PlayCircle, LogOut, Bell, Phone,
  Award, Coffee, AlertCircle, Activity, IndianRupee,
  Users, ChevronRight, Timer, Settings, MapPin,
  BarChart2, Layers, Shield, Heart, ChevronDown,
  MoreVertical, Sparkles, Menu, X, ChevronUp,
  CreditCard, Zap, Hash, UserCheck, PauseCircle,
  WifiOff, ArrowUp, ArrowDown, Check, XCircle
} from "lucide-react";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const getToken = () => localStorage.getItem("token");

/* ── NAV ITEMS ── */
const NAV = [
  { id: "dashboard",   label: "Dashboard",       icon: BarChart2 },
  { id: "queue",       label: "My Queue",         icon: Users },
  { id: "bookings",    label: "Bookings",         icon: Calendar },
  { id: "earnings",    label: "Earnings",         icon: IndianRupee },
  { id: "reviews",     label: "Reviews",          icon: Star },
  { id: "breaks",      label: "Break Requests",   icon: Coffee,    badge: 1 },
  { id: "noshow",      label: "No-Show / Late",   icon: AlertCircle },
  { id: "services",    label: "Services",         icon: Scissors },
  { id: "profile",     label: "My Profile",       icon: User },
  { id: "settings",    label: "Settings",         icon: Settings },
];

const STATUS_CFG = {
  available: { dot: "bg-emerald-400", text: "text-emerald-400", label: "Available",   ring: "ring-emerald-400/30" },
  busy:      { dot: "bg-amber-400",   text: "text-amber-400",   label: "Busy",        ring: "ring-amber-400/30" },
  break:     { dot: "bg-sky-400",     text: "text-sky-400",     label: "On Break",    ring: "ring-sky-400/30" },
  offline:   { dot: "bg-zinc-500",    text: "text-zinc-400",    label: "Offline",     ring: "ring-zinc-500/30" },
};

/* Weekly bar data */
const WEEK_DATA = [
  { day: "Mon", val: 3200 },
  { day: "Tue", val: 4100 },
  { day: "Wed", val: 3750 },
  { day: "Thu", val: 5200 },
  { day: "Fri", val: 6800 },
  { day: "Sat", val: 9100 },
  { day: "Sun", val: 5600, current: true },
];

export default function BarberDashboard() {
  const navigate = useNavigate();
  const [active,      setActive]      = useState("dashboard");
  const [sideOpen,    setSideOpen]    = useState(false);
  const [status,      setStatus]      = useState("available");
  const [statusOpen,  setStatusOpen]  = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [loading,     setLoading]     = useState(true);
  const [toast,       setToast]       = useState(null);
  const [currentSvc,  setCurrentSvc]  = useState(null);
  const [salonOpen,   setSalonOpen]   = useState(true);

  const [profile] = useState({
    name: localStorage.getItem("barberName") || "Sameer Khan",
    initials: "SK",
    specialization: "Haircut & Beard Expert",
    salonName: "The Royal Cuts",
    experience: 7,
    rating: 4.8,
    totalReviews: 234,
    phone: "+91 98765 43210",
    joinedDate: "Jan 2021",
    photo: null,
  });

  const [stats] = useState({
    todayRevenue: 8450,
    liveQueue: 4,
    activeBarbers: "3/4",
    avgWait: 18,
    todayCustomers: 12,
    weekRevenue: 52300,
    completedToday: 8,
    rating: 4.8,
  });

  const [queue] = useState([
    { id:1, customer:"Rahul Sharma",  service:"Premium Haircut",    amount:499, time:"10:30 AM", position:1, mobile:"98765 43210", wait:"5 min" },
    { id:2, customer:"Aryan Patel",   service:"Beard Styling",      amount:299, time:"11:00 AM", position:2, mobile:"99887 66554", wait:"25 min" },
    { id:3, customer:"Snehal Reddy",  service:"Hair Spa",           amount:799, time:"12:30 PM", position:3, mobile:"91234 56789", wait:"45 min" },
    { id:4, customer:"Karan Mehta",   service:"Haircut + Beard",    amount:699, time:"01:00 PM", position:4, mobile:"90012 34567", wait:"65 min" },
  ]);

  const [breakRequests] = useState([
    { id:1, name:"Arjun Singh",  type:"Lunch",      time:"14:00–14:30", duration:"30min", status:"pending" },
    { id:2, name:"Deepak Kumar", type:"Long Break",  time:"15:00–16:00", duration:"60min", status:"approved" },
  ]);

  const [reviews] = useState([
    { id:1, name:"Rohit Mehta",   rating:5, text:"Best fade I've ever had!", time:"2 hours ago" },
    { id:2, name:"Priya Kumar",   rating:5, text:"Very professional and clean.",  time:"5 hours ago" },
    { id:3, name:"Amit Joshi",    rating:4, text:"Great cut, slight wait time.", time:"1 day ago" },
  ]);

  /* Clock */
  useEffect(() => {
    const t = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setCurrentSvc({
        id: "active-1",
        customer: "Vikram Singh",
        service: "Haircut + Beard Trim",
        amount: 599,
        startedAt: new Date(Date.now() - 12 * 60 * 1000),
        mobile: "98765 12345",
      });
      setLoading(false);
    }, 600);
  }, []);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2500);
  };

  const getElapsed = () => {
    if (!currentSvc?.startedAt) return "0:00";
    const e = Math.floor((currentTime - new Date(currentSvc.startedAt)) / 1000);
    return `${Math.floor(e / 60)}:${String(e % 60).padStart(2, "0")}`;
  };

  const maxVal = Math.max(...WEEK_DATA.map(d => d.val));
  const sc = STATUS_CFG[status];

 if (loading) return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');
        .font-sans-loading {
          font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important;
        }
      `}</style>
      {/* Luxury Loading Screen */}
      <div style={{ background: "#FDFBF7", fontFamily: "'Plus Jakarta Sans', sans-serif" }} className="min-h-screen flex items-center justify-center font-sans-loading">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#8B5A2B]/10 flex items-center justify-center animate-pulse">
            <Scissors className="w-6 h-6 text-[#8B5A2B]" />
          </div>
          <p className="text-[#4A3E3D] text-xs font-black uppercase tracking-wider font-sans-loading">Loading Barber Console...</p>
        </div>
      </div>
    </>
  );

  return (
    
    <div className="flex min-h-screen" style={{ background: "var(--bg)", color: "var(--text)", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      {/* Dynamic Background Blur Accents aligned with Theme */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-[-120px] left-[-120px] w-[320px] h-[320px] rounded-full bg-[#8B5A2B]/5 blur-3xl" />
        <div className="absolute bottom-[-120px] right-[-120px] w-[320px] h-[320px] rounded-full bg-[#4A3E3D]/5 blur-3xl" />
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap');
        
        :root { 
          --gold: #8B5A2B;         /* Warm Brown Gold Accent */
          --gold2: #734A22;
          --bg: #FDFBF7;           /* Premium Cream Skin tone */
          --bg2: rgba(255,253,251,0.85);
          --bg3: #FFFFFF;
          --border: #E6D5C3;       /* Soft Choco-Beige Border */
          --text: #4A3E3D;         /* Deep Rich Espresso Brown */
          --muted: #A39796;
        }

        * {
          scroll-behavior: smooth;
          box-sizing: border-box; 
          margin: 0; 
          padding: 0;
        }

        .card, button, .nav-item {
          transition: transform .3s ease, background .3s ease, border .3s ease, box-shadow .3s ease;
        }
        
        ::-webkit-scrollbar { width: 4px; } 
        ::-webkit-scrollbar-track { background: transparent; } 
        ::-webkit-scrollbar-thumb { background: rgba(74,62,61,0.1); border-radius: 2px; }
        
        body, .font-sans {
          font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important;
        }
        .font-serif {
          font-family: 'Playfair Display', Georgia, Cambria, "Times New Roman", Times, serif !important;
        }
        .bar-hover:hover { opacity: 1 !important; filter: brightness(1.1); }
        
        .nav-item { transition: all 0.2s ease; }
        .nav-item:hover { background: rgba(139,90,43,0.04); }
        .nav-item.active { background: rgba(139,90,43,0.08); }
        
        /* Updated Card Utility for Premium Light Look */
        .card {
          background: rgba(255, 255, 255, 0.8);
          border: 1px solid var(--border);
          border-radius: 24px;
          backdrop-filter: blur(18px);
          box-shadow: 0 10px 30px rgba(74,62,61,0.02), 0 0 0 1px rgba(255,255,255,0.5);
          transition: all .35s ease;
        }
        .card:hover {
          transform: translateY(-4px) scale(1.01);
          border-color: var(--gold);
          box-shadow: 0 20px 45px rgba(74,62,61,0.05);
        }

        .card-inner { background: var(--bg3); border: 1px solid var(--border); border-radius: 12px; }
        .pulse-dot { animation: pulseDot 2s ease-in-out infinite; }
        @keyframes pulseDot { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.6;transform:scale(0.85)} }
        .slide-in { animation: slideIn 0.3s ease; }
        @keyframes slideIn { from{opacity:0;transform:translateX(-8px)} to{opacity:1;transform:translateX(0)} }
      `}</style>


      {/* ═══ LUXURY SIDEBAR ═══ */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex flex-col transition-all duration-300 ${sideOpen ? "w-64" : "w-0 md:w-64"}`}
        style={{
          background: "rgba(253, 251, 247, 0.95)", /* Light Cream Base */
          borderRight: "1px solid var(--border)",
          backdropFilter: "blur(12px)"
        }}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-6 py-5" style={{ borderBottom: "1px solid var(--border)" }}>
          <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "linear-gradient(135deg, #A06D3B, #8B5A2B)" }}>
            <Scissors className="w-4.5 h-4.5 text-white" style={{ width: 18, height: 18 }} />
          </div>
          <div className="overflow-hidden">
            <p className="font-serif tracking-normal text-[#4A3E3D] font-black text-sm leading-none truncate">{profile.salonName}</p>
            <p className="text-[10px] mt-1 font-bold uppercase tracking-widest text-[#8B5A2B]">Barber Panel</p>
          </div>
        </div>

        {/* Barber Profile Card */}
        <div className="mx-4 my-4 rounded-xl p-4" style={{ background: "rgba(139,90,43,0.05)", border: "1px solid rgba(139,90,43,0.15)" }}>
          <div className="flex items-center gap-3">
            <div className="relative flex-shrink-0">
              <div className="w-11 h-11 rounded-full flex items-center justify-center font-black text-sm text-white font-serif tracking-normal" style={{ background: "linear-gradient(135deg, #8B5A2B, #4A3E3D)" }}>
                {profile.initials}
              </div>
              <span className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 pulse-dot ${sc.dot}`} style={{ borderColor: "var(--bg)" }} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[#4A3E3D] font-black text-sm truncate font-serif tracking-normal">{profile.name}</p>
              <p className="text-[10px] truncate font-sans normal-case text-stone-500 font-medium">{profile.specialization}</p>
            </div>
          </div>

          {/* Status selector */}
          <div className="mt-3 relative">
            <button
              onClick={() => setStatusOpen(!statusOpen)}
              className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-bold font-sans uppercase tracking-wider transition-colors duration-200"
              style={{ background: "var(--bg3)", border: "1px solid var(--border)", color: "var(--text)" }}
            >
              <span className="flex items-center gap-2">
                <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
                <span className="font-bold">{sc.label}</span>
              </span>
              <ChevronDown className={`w-3.5 h-3.5 text-stone-500 transition-transform ${statusOpen ? "rotate-180" : ""}`} />
            </button>
            
            {statusOpen && (
              <div className="absolute top-full left-0 right-0 mt-1 rounded-xl overflow-hidden z-50 shadow-[0_10px_30px_rgba(74,62,61,0.1)] animate-slide-in" style={{ background: "var(--bg3)", border: "1px solid var(--border)" }}>
                {Object.entries(STATUS_CFG).map(([key, cfg]) => (
                  <button
                    key={key}
                    onClick={() => { setStatus(key); setStatusOpen(false); showToast(`Status → ${cfg.label}`); }}
                    className="w-full flex items-center gap-2.5 px-3 py-2.5 text-xs transition border-b border-[#E6D5C3]/20 last:border-0 hover:bg-[#FDFBF7]"
                  >
                    <span className={`w-2 h-2 rounded-full ${cfg.dot}`} />
                    <span className={`font-sans uppercase tracking-wider font-bold ${status === key ? "text-[#8B5A2B]" : "text-stone-500"}`}>{cfg.label}</span>
                    {status === key && <Check className="w-3 h-3 ml-auto text-[#8B5A2B]" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 overflow-y-auto px-3 pb-4 space-y-1">
          {NAV.map(({ id, label, icon: Icon, badge }) => (
            <button
              key={id}
              onClick={() => {
                setActive(id);
                setSideOpen(false);
                const routes = {
                  profile:  "/barber/profile",
                  settings: "/barber/settings",
                  noshow:   "/barber/noshow-handle",
                  breaks:   "/barber/breaks",
                  queue:    "/barber/queue",
                };
                if (routes[id]) navigate(routes[id]);
              }}
              className={`nav-item w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left ${active === id ? "active" : ""}`}
            >
              <Icon className="w-4 h-4 flex-shrink-0 transition-colors" style={{ color: active === id ? "var(--gold)" : "var(--muted)" }} />
              <span className={`text-xs font-black uppercase tracking-wider flex-1 font-sans ${active === id ? "text-[#4A3E3D]" : "text-stone-500 group-hover:text-[#4A3E3D]"}`}>{label}</span>
              {badge && (
                <span className="w-5 h-5 rounded-full text-[10px] font-black flex items-center justify-center text-white font-sans" style={{ background: "var(--gold)" }}>{badge}</span>
              )}
              {active === id && <div className="w-1.5 h-4 rounded-full ml-auto" style={{ background: "var(--gold)" }} />}
            </button>
          ))}
        </nav>

        {/* Logout */}
        <div className="px-3 pb-4" style={{ borderTop: "1px solid var(--border)", paddingTop: 12 }}>
          <button
            onClick={() => { localStorage.clear(); navigate("/barber/login"); }}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-700 hover:bg-red-50/60 transition text-xs font-black uppercase tracking-wider font-sans"
          >
            <LogOut className="w-4 h-4 text-red-600" /> Logout
          </button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {sideOpen && <div className="fixed inset-0 bg-black/60 z-40 md:hidden" onClick={() => setSideOpen(false)} />}

      {/* ═══ MAIN CONTENT ═══ */}
      <div className="flex-1 flex flex-col min-h-screen">

        {/* Top Bar */}
<header className="sticky top-0 z-30 flex items-center justify-between px-4 md:px-6 py-4 md:-ml-64 md:pl-[calc(1.5rem+256px)]"
 style={{
    background: "rgba(15, 15, 15, 0.85)",
    backdropFilter: "blur(20px)",
    borderBottom: "1px solid rgba(212, 175, 55, 0.15)"
  }}>

 <div className="flex items-center gap-3">
    <button className="md:hidden p-2 rounded-lg text-zinc-400 hover:text-white transition" onClick={() => setSideOpen(!sideOpen)}>
      <Menu className="w-5 h-5" />
    </button>
   <div className="text-left">
      <h1 className="text-zinc-100 font-bold text-2xl font-serif tracking-normal leading-none">Dashboard</h1>
      <p className="text-[13px] mt-1 font-sans normal-case text-zinc-400">
        {profile.salonName} · {currentTime.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
      </p>
    </div>
  </div>

  <div className="flex items-center gap-2 md:gap-3">
    {/* Salon open badge */}
    <button
      onClick={() => setSalonOpen(!salonOpen)}
      className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold transition font-sans normal-case"
      style={{ 
        background: salonOpen ? "rgba(16, 185, 129, 0.1)" : "rgba(239, 68, 68, 0.1)", 
        border: `1px solid ${salonOpen ? "rgba(16, 185, 129, 0.3)" : "rgba(239, 68, 68, 0.3)"}`, 
        color: salonOpen ? "#34d399" : "#f87171" // Brighter tones for dark mode readability
      }}
    >
      <span className={`w-1.5 h-1.5 rounded-full pulse-dot ${salonOpen ? "bg-emerald-400" : "bg-red-400"}`} />
      Salon {salonOpen ? "Open" : "Closed"}
    </button>

    {/* Notifications */}
    <button className="relative p-2 rounded-xl text-zinc-400 hover:text-white transition" 
      style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}>
      <Bell className="w-5 h-5" />
      <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 pulse-dot" />
    </button>

    {/* Profile */}
    <button onClick={() => navigate("/barber/profile")}
      className="flex items-center gap-2 px-2 py-1.5 rounded-xl transition"
      style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}>
      <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-zinc-950 font-serif tracking-normal" 
        style={{ background: "linear-gradient(135deg, #F5C842, #E8A020)" }}>
        {profile.initials}
      </div>
      <div className="hidden md:block text-left">
        <p className="text-zinc-200 text-xs font-semibold leading-none font-serif tracking-normal">{profile.name.split(" ")[0]}</p>
        <p className="text-[10px] mt-0.5 font-sans normal-case" style={{ color: "#F5C842" }}>Barber</p>
      </div>
    </button>
  </div>
</header>

        {/* Page Content */}
<main className="flex-1 px-4 md:px-6 pt-2 pb-6 space-y-5 bg-[#FDFBF7] text-[#4A3E3D] md:-ml-0">

  {/* ── STAT CARDS ── */}
<div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mx-auto w-full">
    {[
      { label: "Today's Revenue",  value: `₹${stats.todayRevenue.toLocaleString()}`, sub: "+17% vs yesterday", icon: IndianRupee, up: true,  color: "#8B5A2B" },
      { label: "Live Queue",        value: stats.liveQueue,                         sub: "1 in service",     icon: Users,       up: null,  color: "#4A3E3D" },
      { label: "Active Barbers",    value: stats.activeBarbers,                      sub: "1 on break",       icon: UserCheck,   up: null,  color: "#8B5A2B" },
      { label: "Avg Wait Time",     value: `${stats.avgWait} min`,                    sub: "Peak: 28 min at 2PM", icon: Timer,    up: false, color: "#4A3E3D" },
    ].map((s, i) => (
      <div key={i} className="bg-white/80 backdrop-blur-md p-4 md:p-5 rounded-2xl border border-[#E6D5C3] transition-all duration-300 hover:bg-white shadow-[0_4px_20px_rgba(74,62,61,0.02)]">
        <div className="flex items-start justify-between mb-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${s.color}15` }}>
            <s.icon className="w-4.5 h-4.5" style={{ width: 18, height: 18, color: s.color }} />
          </div>
          {s.up !== null && (
            <span className={`flex items-center gap-0.5 text-[10px] font-bold px-2 py-1 rounded-full border ${s.up ? "text-emerald-800 bg-emerald-50 border-emerald-200/50" : "text-red-800 bg-red-50 border-red-200/50"}`}>
              {s.up ? <ArrowUp className="w-2.5 h-2.5" /> : <ArrowDown className="w-2.5 h-2.5" />} {s.sub.split(" ")[0]}
            </span>
          )}
        </div>
        <p className="font-serif tracking-normal font-black text-2xl text-[#4A3E3D] leading-none">{s.value}</p>
        <p className="text-[11px] mt-1.5 font-medium font-sans normal-case text-stone-400">{s.sub}</p>
        <p className="text-[10px] mt-0.5 font-sans normal-case font-bold uppercase tracking-wider text-[#8B5A2B]">{s.label}</p>
      </div>
    ))}
  </div>

  {/* ── CURRENT SERVICE (active) ── */}
  {currentSvc && (
    <div className="rounded-[22px] p-5 md:p-6 relative overflow-hidden shadow-[0_15px_40px_rgba(74,62,61,0.03)] border border-[#E6D5C3] transition-all duration-500"
    style={{ background: "linear-gradient(135deg, #FFFDFB 0%, #FBF6EE 60%, #FFFDFB 100%)" }}>
      <div className="absolute -right-6 -top-6 w-32 h-32 rounded-full opacity-10 bg-[#8B5A2B] filter blur-3xl pointer-events-none" />
      <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center gap-4">
        <div className="flex items-center gap-4 flex-1">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg text-white font-serif tracking-normal flex-shrink-0 shadow-sm" style={{ background: "linear-gradient(135deg, #A06D3B, #8B5A2B)" }}>
            {currentSvc.customer[0]}
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[9px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full text-white font-sans bg-[#8B5A2B]">● In Service</span>
            </div>
            <p className="text-[#4A3E3D] font-black text-lg font-serif tracking-normal">{currentSvc.customer}</p>
            <p className="text-[12px] mt-0.5 font-sans normal-case text-stone-500 font-medium">{currentSvc.service} · ₹{currentSvc.amount}</p>
          </div>
        </div>
        <div className="flex items-center gap-4 md:gap-6 w-full md:w-auto justify-between md:justify-end border-t border-[#E6D5C3]/40 md:border-t-0 pt-3 md:pt-0">
          <div className="text-center">
            <p className="text-[10px] font-bold mb-1 font-sans uppercase tracking-wider text-stone-400">Elapsed</p>
            <p className="font-serif tracking-normal font-black text-2xl text-[#4A3E3D]" style={{ fontVariantNumeric: "tabular-nums" }}>{getElapsed()}</p>
          </div>
          <div className="text-center mx-4 md:mx-0">
            <p className="text-[10px] font-bold mb-1 font-sans uppercase tracking-wider text-stone-400">Amount</p>
            <p className="font-serif tracking-normal font-black text-2xl text-[#4A3E3D]">₹{currentSvc.amount}</p>
          </div>
          <button
            onClick={() => { setCurrentSvc(null); showToast(`Completed — ${currentSvc.customer}`); }}
            className="px-5 py-3 rounded-xl text-white hover:text-[#FDFBF7] font-black text-xs flex items-center gap-2 transition duration-300 shadow-md hover:shadow-lg cursor-pointer font-sans uppercase tracking-wider"
            style={{ background: "linear-gradient(135deg, #5C4D4C, #4A3E3D)" }}
          >
            <CheckCircle className="w-4 h-4 text-[#E6D5C3]" /> Complete
          </button>
        </div>
      </div>
    </div>
  )}

  {/* ── MID ROW: Weekly Revenue + Break Requests ── */}
<div className="grid lg:grid-cols-5 gap-4 ">

    {/* Weekly Revenue Chart */}
    <div className="bg-white/80 backdrop-blur-md p-6 lg:col-span-3 rounded-[22px] border border-[#E6D5C3] shadow-[0_4px_20px_rgba(74,62,61,0.02)]">
    
    <div className="flex items-center justify-between mb-6"> {/* mb-5 ऐवजी mb-6 करा */}
      <div>
        <h3 className="font-serif tracking-normal font-black text-[#4A3E3D] text-base uppercase">Weekly Revenue</h3>
        <p className="text-[11px] mt-0.5 font-sans text-stone-400 font-medium">Mon — Sun</p>
      </div>
      
      <div className="px-4 py-1.5 rounded-full text-[10px] font-black font-sans uppercase tracking-wider bg-[#FDFBF7] text-[#8B5A2B] border border-[#E6D5C3]">
        This Week ₹{stats.weekRevenue.toLocaleString()}
      </div>
    </div>

      {/* Bars */}
      <div className="flex items-end justify-between gap-2 h-28">
        {WEEK_DATA.map((d, i) => {
          const pct = (d.val / maxVal) * 100;
          return (
            <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
              <p className="text-[10px] font-black font-sans normal-case text-[#4A3E3D]">
                ₹{(d.val / 1000).toFixed(1)}k
              </p>
              <div
                className="w-full rounded-t-lg transition-all duration-300 cursor-pointer hover:opacity-100"
                style={{
                  height: `${pct * 0.65}px`,
                  background: d.current
                    ? "linear-gradient(180deg, #A06D3B, #8B5A2B)"
                    : "rgba(230, 213, 195, 0.5)",
                  opacity: d.current ? 1 : 0.7,
                  minHeight: 8,
                  maxHeight: 72,
                }}
                title={`${d.day}: ₹${d.val.toLocaleString()}`}
              />
              <p className="text-[10px] font-bold font-sans uppercase tracking-wider" style={{ color: d.current ? "#8B5A2B" : "#A39796" }}>{d.day}</p>
            </div>
          );
        })}
      </div>
    </div>

    {/* Break Requests */}
    <div className="bg-white/80 backdrop-blur-md p-5 lg:col-span-2 rounded-[22px] border border-[#E6D5C3] shadow-[0_4px_20px_rgba(74,62,61,0.02)]">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-serif tracking-normal font-black text-[#4A3E3D] text-sm uppercase">Break Requests</h3>
        <span className="w-5 h-5 rounded-full text-[10px] font-black flex items-center justify-center text-white font-sans bg-[#8B5A2B]">
          {breakRequests.filter(r => r.status === "pending").length}
        </span>
      </div>
      <div className="space-y-3">
        {breakRequests.map(r => (
          <div key={r.id} className="bg-[#FDFBF7]/60 p-3 rounded-xl border border-[#E6D5C3]/50">
            <div className="flex items-start justify-between gap-2 mb-2">
              <p className="text-[#4A3E3D] font-black text-sm font-serif tracking-normal">{r.name}</p>
              <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-1 rounded-full font-sans border ${
                r.status === "pending"
                  ? "text-amber-800 bg-amber-50 border-amber-200/50"
                  : "text-emerald-800 bg-emerald-50 border-emerald-200/50"
              }`}>{r.status}</span>
            </div>
            <p className="text-[11px] mb-0.5 font-sans normal-case text-stone-500 font-medium flex items-center gap-1">
              <Coffee className="w-3 h-3 text-[#8B5A2B]" /> {r.type} · {r.time} ({r.duration})
            </p>
            {r.status === "pending" && (
              <div className="flex gap-2 mt-2.5">
                <button className="flex-1 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider text-white transition hover:opacity-90 flex items-center justify-center gap-1 font-sans cursor-pointer bg-emerald-700 shadow-sm">
                  <Check className="w-3 h-3" /> Approve
                </button>
                <button className="flex-1 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition duration-300 flex items-center justify-center gap-1 font-sans cursor-pointer bg-red-50 text-red-700 border border-red-200/40 hover:bg-red-100/50">
                  <X className="w-3 h-3" /> Reject
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  </div>

  {/* ── BOTTOM ROW: Queue + Reviews ── */}
  <div className="grid lg:grid-cols-5 gap-4">

    {/* My Queue */}
    <div className="bg-white/80 backdrop-blur-md p-5 md:p-6 lg:col-span-3 rounded-[22px] border border-[#E6D5C3] shadow-[0_4px_20px_rgba(74,62,61,0.02)]">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-serif tracking-normal font-black text-[#4A3E3D] text-base flex items-center gap-2 uppercase">
          My Queue
          <span className="text-sm font-bold font-sans normal-case text-[#8B5A2B]">({queue.length})</span>
        </h3>
        <button onClick={() => navigate("/barber/queue")}
          className="text-xs font-black font-sans uppercase tracking-wider flex items-center gap-1 text-[#8B5A2B] hover:opacity-80 transition cursor-pointer">
          View All <ChevronRight className="w-3 h-3" />
        </button>
      </div>
      <div className="space-y-2.5">
        {queue.map((q, i) => (
          <div key={q.id} className="bg-[#FDFBF7]/60 p-3.5 flex items-center gap-3 rounded-xl border border-[#E6D5C3]/40 hover:border-[#8B5A2B]/40 hover:bg-white transition-all duration-300">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center font-black text-xs flex-shrink-0"
              style={{ 
                background: i === 0 ? "rgba(139,90,43,0.08)" : "#FDFBF7", 
                color: i === 0 ? "#8B5A2B" : "#A39796", 
                border: i === 0 ? "1px solid rgba(139,90,43,0.3)" : "1px solid #E6D5C3" 
              }}>
              #{q.position}
            </div>
            <div className="flex-1 min-w-0 text-left">
              <p className="text-[#4A3E3D] font-black text-sm truncate font-serif tracking-normal">{q.customer}</p>
              <p className="text-[11px] truncate font-sans normal-case text-stone-500 font-medium">{q.service} · ₹{q.amount}</p>
            </div>
            <div className="text-right flex-shrink-0 hidden sm:block">
              <p className="text-[10px] font-bold font-sans uppercase tracking-wider text-[#8B5A2B]">{q.wait} wait</p>
              <p className="text-[10px] font-sans normal-case text-stone-400 font-medium">{q.time}</p>
            </div>
            {i === 0 && (
              <button
                onClick={() => showToast(`Started service for ${q.customer}`)}
                className="px-3 py-2 rounded-lg text-[10px] font-black uppercase tracking-wider text-white flex items-center gap-1.5 flex-shrink-0 transition duration-300 hover:opacity-90 shadow-sm cursor-pointer"
                style={{ background: "linear-gradient(135deg, #8B5A2B, #734A22)" }}
              >
                <PlayCircle className="w-3.5 h-3.5 text-[#E6D5C3]" /> Start
              </button>
            )}
          </div>
        ))}
      </div>
    </div>

    {/* Recent Reviews */}
    <div className="bg-white/80 backdrop-blur-md p-5 lg:col-span-2 rounded-[22px] border border-[#E6D5C3] shadow-[0_4px_20px_rgba(74,62,61,0.02)]">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-serif tracking-normal font-black text-[#4A3E3D] text-sm flex items-center gap-2 uppercase">
          <Star className="w-4 h-4 fill-[#8B5A2B] text-[#8B5A2B]" /> Reviews
        </h3>
        <span className="text-[11px] font-black font-sans uppercase tracking-wider text-[#8B5A2B]">★ {profile.rating}</span>
      </div>
      <div className="space-y-3">
        {reviews.map(r => (
          <div key={r.id} className="bg-[#FDFBF7]/60 p-3 rounded-xl border border-[#E6D5C3]/40">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-black text-white flex-shrink-0 font-serif tracking-normal shadow-xs"
                style={{ background: "linear-gradient(135deg, #8B5A2B, #4A3E3D)" }}>
                {r.name[0]}
              </div>
              <div className="flex-1 min-w-0 text-left">
                <p className="text-[#4A3E3D] font-black text-xs truncate font-serif tracking-normal">{r.name}</p>
                <p className="text-[9px] font-sans normal-case text-stone-400 font-medium">{r.time}</p>
              </div>
              <div className="flex gap-0.5 flex-shrink-0">
                {[...Array(r.rating)].map((_,i) => (
                  <Star key={i} className="w-2.5 h-2.5 fill-[#8B5A2B] text-[#8B5A2B]" />
                ))}
              </div>
            </div>
            <p className="text-[11px] italic leading-relaxed font-sans normal-case text-stone-600 text-left">"{r.text}"</p>
          </div>
        ))}
      </div>
    </div>
  </div>

 {/* ── QUICK ACTIONS STRIP ── */}
  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
    {[
      { label: "Request Break",   icon: Coffee,      color: "#8B5A2B", route: null },
      { label: "View Profile",    icon: User,        color: "#4A3E3D", route: "/barber/profile" },
      { label: "Manage Services", icon: Scissors,    color: "#8B5A2B", route: "/barber/live-session" },
      { label: "Handle No-Show",  icon: AlertCircle, color: "#D9534F", route: "/barber/noshow-handle" },
    ].map((a, i) => (
      <button key={i}
        onClick={() => { if (a.route) navigate(a.route); else showToast(`${a.label} — coming soon`); }}
        className="bg-white/80 backdrop-blur-md flex items-center gap-3 px-4 py-3.5 rounded-xl border border-[#E6D5C3] transition-all duration-300 group text-left cursor-pointer hover:bg-white hover:border-[#8B5A2B]/50 shadow-[0_4px_20px_rgba(74,62,61,0.015)]">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-110" style={{ background: `${a.color}15` }}>
          <a.icon className="w-4 h-4" style={{ color: a.color }} />
        </div>
        <span className="text-xs font-black uppercase tracking-wider text-stone-600 group-hover:text-[#4A3E3D] transition font-sans">{a.label}</span>
        <ChevronRight className="w-3.5 h-3.5 ml-auto text-stone-400 group-hover:text-[#8B5A2B] transition-transform duration-300 group-hover:translate-x-0.5" />
      </button>
    ))}
  </div>

</main>
      </div>

      {/* Luxury Theme Aligned Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 px-5 py-3.5 rounded-xl text-white font-black text-xs uppercase tracking-wider shadow-[0_20px_50px_rgba(74,62,61,0.2)] z-50 transition-all duration-300 backdrop-blur-md flex items-center gap-2.5 border"
          style={{ 
            background: toast.type === "error" ? "linear-gradient(135deg, #A73A3A, #8B2E2E)" : "linear-gradient(135deg, #5C4D4C, #4A3E3D)",
            borderColor: toast.type === "error" ? "#C94A4A/30" : "#E6D5C3/30"
          }}>
          {toast.type === "error" ? (
            <XCircle className="w-4 h-4 text-[#F2DEDE]" />
          ) : (
            <CheckCircle className="w-4 h-4 text-[#E6D5C3]" />
          )}
          <span>{toast.msg}</span>
        </div>
      )}
    </div>
  );
}