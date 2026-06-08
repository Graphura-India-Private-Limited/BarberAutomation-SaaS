import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { BarChart, Bar, ResponsiveContainer, XAxis, Cell } from "recharts";
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
  {id: "console", label: "Live Console",    icon: PlayCircle },
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

  const getInitials = (name) => {
    if (!name) return "AM";
    const clean = name.replace(/\(.*?\)/g, "").trim();
    const words = clean.split(/\s+/).filter(Boolean);
    if (words.length >= 2) return (words[0][0] + words[1][0]).toUpperCase();
    return words[0] ? words[0].slice(0, 2).toUpperCase() : "AM";
  };

  const barberName = localStorage.getItem("barberName") || "Ali (Master Stylist)";
  const salonName = localStorage.getItem("salonName") || "The Royal Cuts";

  const [profile] = useState({
    name: barberName,
    initials: getInitials(barberName),
    specialization: "Haircut & Beard Expert",
    salonName: salonName,
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

    const statsData = [
  {
    label: "Today's Revenue",
    value: `₹${stats.todayRevenue.toLocaleString()}`,
    sub: "+17% vs yesterday",
    icon: IndianRupee,
    up: true,
    color: "#8B5A2B"
  },
  {
    label: "Live Queue",
    value: stats.liveQueue,
    sub: "1 in service",
    icon: Users,
    up: null,
    color: "#4A3E3D"
  },
  {
    label: "Active Barbers",
    value: stats.activeBarbers,
    sub: "1 on break",
    icon: UserCheck,
    up: null,
    color: "#8B5A2B"
  },
  {
    label: "Avg Wait Time",
    value: `${stats.avgWait} min`,
    sub: "Peak: 28 min at 2PM",
    icon: Timer,
    up: false,
    color: "#4A3E3D"
  },
];

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

      {/* Mobile overlay */}
      {sideOpen && <div className="fixed inset-0 bg-black/60 z-40 md:hidden" onClick={() => setSideOpen(false)} />}

      {/* ═══ MAIN CONTENT ═══ */}
      <div className="flex-1 flex flex-col min-h-screen">

        {/* Top Bar */}
        <header className="sticky top-0 z-30 flex items-center justify-between px-4 md:px-8 py-4 bg-[#FAF6F0] border-b border-[#E6D5C3] relative">
          <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#A1804E] opacity-90" />

          <div className="flex items-center gap-3">
            <button className="md:hidden p-2 rounded-lg text-[#4A3E3D] hover:bg-[#FAF6F0] transition" onClick={() => setSideOpen(!sideOpen)}>
              <Menu className="w-5 h-5" />
            </button>
            <div className="text-left">
              <h1 className="text-[#4A3E3D] font-bold text-2xl font-serif tracking-normal leading-none">Dashboard</h1>
              <p className="text-[13px] mt-1 font-sans normal-case text-stone-500">
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
                color: salonOpen ? "#047857" : "#b91c1c"
              }}
            >
              <span className={`w-1.5 h-1.5 rounded-full pulse-dot ${salonOpen ? "bg-[#10B981]" : "bg-red-400"}`} />
              Salon {salonOpen ? "Open" : "Closed"}
            </button>

            {/* Notifications */}
            <button className="relative p-2 rounded-xl text-[#4A3E3D] hover:bg-stone-50 transition border border-[#E6D5C3] bg-white">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 pulse-dot" />
            </button>

            {/* Profile */}
            <button onClick={() => navigate("/barber/profile")}
              className="flex items-center gap-2 px-2 py-1.5 rounded-xl transition border border-[#E6D5C3] bg-white hover:bg-stone-50">
              <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white font-serif tracking-normal bg-gradient-to-br from-[#8B5A2B] to-[#4A3E3D]">
                {profile.initials}
              </div>
              <div className="hidden md:block text-left">
                <p className="text-[#4A3E3D] text-xs font-semibold leading-none font-serif tracking-normal">{profile.name.split(" ")[0]}</p>
                <p className="text-[10px] mt-0.5 font-sans normal-case text-[#8B5A2B]">Barber</p>
              </div>
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 px-4 md:px-6 pt-2 pb-6 space-y-5 bg-[#FDFBF7] text-[#4A3E3D]">

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
        <p className="text-[10px] mt-0.5 font-sans font-bold uppercase tracking-wider text-[#8B5A2B]">{s.label}</p>
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

<motion.div 
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  className="bg-white/50 p-6 rounded-3xl border border-[#E6D5C3]"
>
  {/* Header Section */}
  <div className="flex justify-between items-start mb-8">
    <div>
      <h3 className="font-serif text-[#4A3E3D] text-lg font-black">WEEKLY REVENUE</h3>
      <p className="text-[11px] font-bold text-stone-400 uppercase tracking-widest mt-0.5">Mon — Sun</p>
    </div>
    <div className="px-4 py-2 rounded-full border border-[#E6D5C3] text-[11px] font-bold text-[#4A3E3D]">
      THIS WEEK ₹52,300
    </div>
  </div>

  {/* Chart Section */}
  <div className="h-48 w-full">
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={WEEK_DATA} barGap={8}>
        <XAxis 
          dataKey="day" 
          axisLine={false} 
          tickLine={false} 
          tick={{ fontSize: 10, fontWeight: 700, fill: '#A39796' }} 
          dy={10}
        />
        <Bar 
          dataKey="val" 
          radius={[8, 8, 8, 8]}
          label={{ 
            position: 'top', 
            fontSize: 10, 
            fontWeight: 700, 
            fill: '#4A3E3D',
            formatter: (val) => `₹${(val/1000).toFixed(1)}k` 
          }}
        >
          {WEEK_DATA.map((entry, index) => (
            <Cell 
              key={`cell-${index}`} 
              fill={entry.current ? "#8B5A2B" : "#F5EFE9"} 
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  </div>
</motion.div>

  {/* Target Progress Section */}
<div className="bg-white/50 p-4 rounded-2xl border border-[#E6D5C3] mt-2">
  <div className="flex justify-between text-[10px] font-black uppercase mb-1">
    <span className="text-[#8B5A2B]">Daily Target</span>
    <span className="text-stone-500">{(stats.todayRevenue / 15000 * 100).toFixed(0)}%</span>
  </div>
  <div className="h-1.5 w-full bg-[#E6D5C3] rounded-full overflow-hidden">
    <div className="h-full bg-[#8B5A2B]" style={{ width: `${(stats.todayRevenue / 15000 * 100)}%` }} />
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