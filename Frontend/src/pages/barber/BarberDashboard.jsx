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
import NotificationCenter from "../../Components/notifications/NotificationCenter";
import { useNotification } from "../../context/NotificationContext";

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
  const { addNotification } = useNotification();

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
    <div style={{ background: "#0F1117" }} className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-amber-500/20 flex items-center justify-center animate-pulse">
          <Scissors className="w-6 h-6 text-amber-400" />
        </div>
        <p className="text-zinc-400 text-sm font-medium tracking-widest uppercase">Loading console...</p>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen" style={{ background: "#0F1117", fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700;800;900&family=Syne:wght@700;800&display=swap');
        :root { --gold: #F5C842; --gold2: #E8A020; --bg: #0F1117; --bg2: #161821; --bg3: #1E2030; --border: rgba(255,255,255,0.07); --text: #E8EAF0; --muted: #6B7280; }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 4px; } ::-webkit-scrollbar-track { background: transparent; } ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 2px; }
        .syne { font-family: 'Syne', sans-serif; }
        .bar-hover:hover { opacity: 1 !important; filter: brightness(1.2); }
        .nav-item { transition: all 0.2s ease; }
        .nav-item:hover { background: rgba(255,255,255,0.05); }
        .nav-item.active { background: rgba(245,200,66,0.12); }
        .card { background: var(--bg2); border: 1px solid var(--border); border-radius: 16px; }
        .card-inner { background: var(--bg3); border: 1px solid var(--border); border-radius: 12px; }
        .pulse-dot { animation: pulseDot 2s ease-in-out infinite; }
        @keyframes pulseDot { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.6;transform:scale(0.85)} }
        .slide-in { animation: slideIn 0.3s ease; }
        @keyframes slideIn { from{opacity:0;transform:translateX(-8px)} to{opacity:1;transform:translateX(0)} }
      `}</style>

      {/* ═══ SIDEBAR ═══ */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex flex-col transition-all duration-300 ${sideOpen ? "w-64" : "w-0 md:w-64"}`}
        style={{ background: "#0D0F14", borderRight: "1px solid rgba(255,255,255,0.06)" }}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-6 py-5" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "linear-gradient(135deg,#F5C842,#E8A020)" }}>
            <Scissors className="w-4.5 h-4.5 text-black" style={{ width: 18, height: 18 }} />
          </div>
          <div className="overflow-hidden">
            <p className="syne text-white font-bold text-sm leading-none">{profile.salonName}</p>
            <p className="text-[10px] mt-0.5 font-semibold uppercase tracking-widest" style={{ color: "#F5C842" }}>Barber Panel</p>
          </div>
        </div>

        {/* Barber Profile Card */}
        <div className="mx-4 my-4 rounded-xl p-4" style={{ background: "rgba(245,200,66,0.06)", border: "1px solid rgba(245,200,66,0.15)" }}>
          <div className="flex items-center gap-3">
            <div className="relative flex-shrink-0">
              <div className="w-11 h-11 rounded-full flex items-center justify-center font-bold text-sm text-black syne" style={{ background: "linear-gradient(135deg,#F5C842,#E8A020)" }}>
                {profile.initials}
              </div>
              <span className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 pulse-dot ${sc.dot}`} style={{ borderColor: "#0D0F14" }} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-bold text-sm truncate">{profile.name}</p>
              <p className="text-[10px] truncate" style={{ color: "#9CA3AF" }}>{profile.specialization}</p>
            </div>
          </div>

          {/* Status selector */}
          <div className="mt-3 relative">
            <button
              onClick={() => setStatusOpen(!statusOpen)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold ring-1 ${sc.ring}`}
              style={{ background: "rgba(255,255,255,0.04)" }}
            >
              <span className="flex items-center gap-2">
                <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
                <span className={sc.text}>{sc.label}</span>
              </span>
              <ChevronDown className={`w-3.5 h-3.5 text-zinc-500 transition-transform ${statusOpen ? "rotate-180" : ""}`} />
            </button>
            {statusOpen && (
              <div className="absolute top-full left-0 right-0 mt-1 rounded-xl overflow-hidden z-50 shadow-2xl" style={{ background: "#1A1C27", border: "1px solid rgba(255,255,255,0.1)" }}>
                {Object.entries(STATUS_CFG).map(([key, cfg]) => (
                  <button
                    key={key}
                    onClick={() => { setStatus(key); setStatusOpen(false); showToast(`Status → ${cfg.label}`); }}
                    className="w-full flex items-center gap-2.5 px-3 py-2.5 text-xs hover:bg-white/5 transition"
                  >
                    <span className={`w-2 h-2 rounded-full ${cfg.dot}`} />
                    <span className={`font-semibold ${status === key ? cfg.text : "text-zinc-300"}`}>{cfg.label}</span>
                    {status === key && <Check className="w-3 h-3 ml-auto text-zinc-500" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-3 pb-4 space-y-0.5">
          {NAV.map(({ id, label, icon: Icon, badge }) => (
            <button
              key={id}
              onClick={() => { setActive(id); setSideOpen(false); if (id === "profile") navigate("/barber/profile"); if (id === "settings") navigate("/barber/settings"); }}
              className={`nav-item w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left ${active === id ? "active" : ""}`}
            >
              <Icon className={`w-4 h-4 flex-shrink-0 ${active === id ? "text-amber-400" : "text-zinc-500"}`} style={active === id ? { color: "#F5C842" } : {}} />
              <span className={`text-sm font-medium flex-1 ${active === id ? "text-white font-semibold" : "text-zinc-400"}`}>{label}</span>
              {badge && (
                <span className="w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center text-black" style={{ background: "#F5C842" }}>{badge}</span>
              )}
              {active === id && <div className="w-1 h-4 rounded-full ml-auto" style={{ background: "#F5C842" }} />}
            </button>
          ))}
        </nav>

        {/* Logout */}
        <div className="px-3 pb-4" style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 12 }}>
          <button
            onClick={() => { localStorage.clear(); navigate("/barber/login"); }}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-400 hover:bg-red-500/10 transition text-sm font-medium"
          >
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {sideOpen && <div className="fixed inset-0 bg-black/60 z-40 md:hidden" onClick={() => setSideOpen(false)} />}

      {/* ═══ MAIN CONTENT ═══ */}
      <div className="flex-1 md:ml-64 flex flex-col min-h-screen">

        {/* Top Bar */}
        <header className="sticky top-0 z-30 flex items-center justify-between px-4 md:px-6 py-4"
          style={{ background: "rgba(15,17,23,0.95)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>

          <div className="flex items-center gap-3">
            <button className="md:hidden p-2 rounded-lg text-zinc-400 hover:text-white" onClick={() => setSideOpen(!sideOpen)}>
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-white font-bold text-lg syne leading-none">Dashboard</h1>
              <p className="text-[11px] mt-0.5" style={{ color: "#6B7280" }}>
                {profile.salonName} · {currentTime.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-3">
            {/* Salon open badge */}
            <button
              onClick={() => setSalonOpen(!salonOpen)}
              className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold transition"
              style={{ background: salonOpen ? "rgba(16,185,129,0.12)" : "rgba(239,68,68,0.1)", border: `1px solid ${salonOpen ? "rgba(16,185,129,0.3)" : "rgba(239,68,68,0.3)"}`, color: salonOpen ? "#34D399" : "#F87171" }}
            >
              <span className={`w-1.5 h-1.5 rounded-full pulse-dot ${salonOpen ? "bg-emerald-400" : "bg-red-400"}`} />
              SALON {salonOpen ? "OPEN" : "CLOSED"}
            </button>

            {/* Notifications */}
            <NotificationCenter 
              triggerClassName="relative p-2 rounded-xl text-zinc-400 hover:text-white transition bg-white/5" 
              iconClassName="w-5 h-5" 
            />

            {/* Profile */}
            <button onClick={() => navigate("/barber/profile")}
              className="flex items-center gap-2 px-2 py-1.5 rounded-xl transition"
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
              <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-black syne" style={{ background: "linear-gradient(135deg,#F5C842,#E8A020)" }}>
                {profile.initials}
              </div>
              <div className="hidden md:block text-left">
                <p className="text-white text-xs font-semibold leading-none">{profile.name.split(" ")[0]}</p>
                <p className="text-[10px] mt-0.5" style={{ color: "#F5C842" }}>Barber</p>
              </div>
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 md:p-6 space-y-5">

          {/* ── STAT CARDS ── */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
            {[
              { label: "Today's Revenue",  value: `₹${stats.todayRevenue.toLocaleString()}`, sub: "+17% vs yesterday", icon: IndianRupee, up: true,  color: "#F5C842" },
              { label: "Live Queue",        value: stats.liveQueue,                           sub: "1 in service",     icon: Users,       up: null,  color: "#60A5FA" },
              { label: "Active Barbers",    value: stats.activeBarbers,                       sub: "1 on break",       icon: UserCheck,   up: null,  color: "#34D399" },
              { label: "Avg Wait Time",     value: `${stats.avgWait} min`,                    sub: "Peak: 28 min at 2PM", icon: Timer,    up: false, color: "#A78BFA" },
            ].map((s, i) => (
              <div key={i} className="card p-4 md:p-5 hover:border-white/10 transition-all">
                <div className="flex items-start justify-between mb-3">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${s.color}15` }}>
                    <s.icon className="w-4.5 h-4.5" style={{ width: 18, height: 18, color: s.color }} />
                  </div>
                  {s.up !== null && (
                    <span className={`flex items-center gap-0.5 text-[10px] font-bold px-2 py-1 rounded-full ${s.up ? "text-emerald-400 bg-emerald-400/10" : "text-red-400 bg-red-400/10"}`}>
                      {s.up ? <ArrowUp className="w-2.5 h-2.5" /> : <ArrowDown className="w-2.5 h-2.5" />} {s.sub.split(" ")[0]}
                    </span>
                  )}
                </div>
                <p className="syne font-bold text-2xl text-white leading-none">{s.value}</p>
                <p className="text-[11px] mt-1.5 font-medium" style={{ color: "#6B7280" }}>{s.sub}</p>
                <p className="text-[10px] mt-0.5 uppercase tracking-widest font-semibold" style={{ color: "#4B5563" }}>{s.label}</p>
              </div>
            ))}
          </div>

          {/* ── CURRENT SERVICE (active) ── */}
          {currentSvc && (
            <div className="rounded-2xl p-5 md:p-6 relative overflow-hidden slide-in"
              style={{ background: "linear-gradient(135deg,#1A1400 0%,#2A1F00 40%,#1A1400 100%)", border: "1px solid rgba(245,200,66,0.25)" }}>
              <div className="absolute -right-6 -top-6 w-32 h-32 rounded-full opacity-10" style={{ background: "#F5C842", filter: "blur(30px)" }} />
              <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center gap-4">
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-lg text-black syne flex-shrink-0" style={{ background: "linear-gradient(135deg,#F5C842,#E8A020)" }}>
                    {currentSvc.customer[0]}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full text-black" style={{ background: "#F5C842" }}>● IN SERVICE</span>
                    </div>
                    <p className="text-white font-bold text-lg syne">{currentSvc.customer}</p>
                    <p className="text-[12px] mt-0.5" style={{ color: "#9CA3AF" }}>{currentSvc.service} · ₹{currentSvc.amount}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 md:gap-6">
                  <div className="text-center">
                    <p className="text-[9px] uppercase tracking-widest font-bold mb-1" style={{ color: "#6B7280" }}>Elapsed</p>
                    <p className="syne font-bold text-2xl" style={{ color: "#F5C842", fontVariantNumeric: "tabular-nums" }}>{getElapsed()}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-[9px] uppercase tracking-widest font-bold mb-1" style={{ color: "#6B7280" }}>Amount</p>
                    <p className="syne font-bold text-2xl text-white">₹{currentSvc.amount}</p>
                  </div>
                  <button
                    onClick={() => { 
                      setCurrentSvc(null); 
                      showToast(`Completed — ${currentSvc.customer}`); 
                      addNotification({
                        type: "success",
                        title: "Service Completed",
                        message: `Service for ${currentSvc.customer} has been marked as completed.`
                      });
                    }}
                    className="px-5 py-3 rounded-xl text-black font-bold text-sm flex items-center gap-2 transition hover:opacity-90"
                    style={{ background: "linear-gradient(135deg,#F5C842,#E8A020)" }}
                  >
                    <CheckCircle className="w-4 h-4" /> Complete
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ── MID ROW: Weekly Revenue + Break Requests ── */}
          <div className="grid lg:grid-cols-5 gap-4">

            {/* Weekly Revenue Chart */}
            <div className="card p-5 md:p-6 lg:col-span-3">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h3 className="syne font-bold text-white text-base">Weekly Revenue</h3>
                  <p className="text-[11px] mt-0.5" style={{ color: "#6B7280" }}>Mon — Sun</p>
                </div>
                <div className="px-3 py-1.5 rounded-full text-xs font-bold" style={{ background: "rgba(245,200,66,0.12)", color: "#F5C842", border: "1px solid rgba(245,200,66,0.2)" }}>
                  This Week ₹{stats.weekRevenue.toLocaleString()}
                </div>
              </div>

              {/* Bars */}
              <div className="flex items-end justify-between gap-2 h-28">
                {WEEK_DATA.map((d, i) => {
                  const pct = (d.val / maxVal) * 100;
                  return (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
                      <p className="text-[10px] font-bold" style={{ color: d.current ? "#F5C842" : "#4B5563" }}>
                        ₹{(d.val / 1000).toFixed(1)}k
                      </p>
                      <div
                        className="w-full rounded-t-lg bar-hover transition-all cursor-pointer"
                        style={{
                          height: `${pct * 0.65}px`,
                          background: d.current
                            ? "linear-gradient(180deg,#F5C842,#E8A020)"
                            : "rgba(245,200,66,0.2)",
                          opacity: d.current ? 1 : 0.6,
                          minHeight: 8,
                          maxHeight: 72,
                        }}
                        title={`${d.day}: ₹${d.val.toLocaleString()}`}
                      />
                      <p className="text-[10px] font-medium" style={{ color: d.current ? "#F5C842" : "#6B7280" }}>{d.day}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Break Requests */}
            <div className="card p-5 lg:col-span-2">
              <div className="flex items-center justify-between mb-4">
                <h3 className="syne font-bold text-white text-sm">Break Requests</h3>
                <span className="w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center text-black" style={{ background: "#F5C842" }}>
                  {breakRequests.filter(r => r.status === "pending").length}
                </span>
              </div>
              <div className="space-y-3">
                {breakRequests.map(r => (
                  <div key={r.id} className="card-inner p-3">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <p className="text-white font-bold text-sm">{r.name}</p>
                      <span className={`text-[9px] font-bold px-2 py-1 rounded-full uppercase tracking-wide ${
                        r.status === "pending"
                          ? "text-amber-400 bg-amber-400/10 border border-amber-400/20"
                          : "text-emerald-400 bg-emerald-400/10 border border-emerald-400/20"
                      }`}>{r.status}</span>
                    </div>
                    <p className="text-[11px] mb-0.5" style={{ color: "#6B7280" }}>
                      <Coffee className="w-3 h-3 inline mr-1" />{r.type} · {r.time} ({r.duration})
                    </p>
                    {r.status === "pending" && (
                      <div className="flex gap-2 mt-2.5">
                        <button className="flex-1 py-1.5 rounded-lg text-[10px] font-bold text-black transition hover:opacity-90 flex items-center justify-center gap-1" style={{ background: "#34D399" }}>
                          <Check className="w-3 h-3" /> Approve
                        </button>
                        <button className="flex-1 py-1.5 rounded-lg text-[10px] font-bold transition hover:opacity-80 flex items-center justify-center gap-1" style={{ background: "rgba(239,68,68,0.15)", color: "#F87171", border: "1px solid rgba(239,68,68,0.2)" }}>
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
            <div className="card p-5 md:p-6 lg:col-span-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="syne font-bold text-white text-base flex items-center gap-2">
                  My Queue
                  <span className="text-sm font-normal" style={{ color: "#F5C842" }}>({queue.length})</span>
                </h3>
                <button onClick={() => navigate("/barber/queue")}
                  className="text-[10px] font-bold uppercase tracking-widest flex items-center gap-1 hover:opacity-80 transition"
                  style={{ color: "#F5C842" }}>
                  View All <ChevronRight className="w-3 h-3" />
                </button>
              </div>
              <div className="space-y-2.5">
                {queue.map((q, i) => (
                  <div key={q.id} className="card-inner p-3.5 flex items-center gap-3 group hover:border-white/10 transition-all">
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs flex-shrink-0"
                      style={{ background: i === 0 ? "rgba(245,200,66,0.15)" : "rgba(255,255,255,0.05)", color: i === 0 ? "#F5C842" : "#6B7280", border: i === 0 ? "1px solid rgba(245,200,66,0.3)" : "1px solid rgba(255,255,255,0.06)" }}>
                      #{q.position}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-semibold text-sm truncate">{q.customer}</p>
                      <p className="text-[11px] truncate" style={{ color: "#6B7280" }}>{q.service} · ₹{q.amount}</p>
                    </div>
                    <div className="text-right flex-shrink-0 hidden sm:block">
                      <p className="text-[10px] font-medium" style={{ color: "#4B5563" }}>{q.wait} wait</p>
                      <p className="text-[10px]" style={{ color: "#374151" }}>{q.time}</p>
                    </div>
                    {i === 0 && (
                      <button
                        onClick={() => showToast(`Started service for ${q.customer}`)}
                        className="px-3 py-2 rounded-lg text-[10px] font-bold text-black flex items-center gap-1.5 flex-shrink-0 transition hover:opacity-90"
                        style={{ background: "linear-gradient(135deg,#F5C842,#E8A020)" }}
                      >
                        <PlayCircle className="w-3.5 h-3.5" /> Start
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Reviews */}
            <div className="card p-5 lg:col-span-2">
              <div className="flex items-center justify-between mb-4">
                <h3 className="syne font-bold text-white text-sm flex items-center gap-2">
                  <Star className="w-4 h-4" style={{ color: "#F5C842", fill: "#F5C842" }} /> Reviews
                </h3>
                <span className="text-[11px] font-bold" style={{ color: "#F5C842" }}>★ {profile.rating}</span>
              </div>
              <div className="space-y-3">
                {reviews.map(r => (
                  <div key={r.id} className="card-inner p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-black flex-shrink-0"
                        style={{ background: "linear-gradient(135deg,#F5C842,#E8A020)" }}>
                        {r.name[0]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-semibold text-xs truncate">{r.name}</p>
                        <p className="text-[9px]" style={{ color: "#4B5563" }}>{r.time}</p>
                      </div>
                      <div className="flex gap-0.5 flex-shrink-0">
                        {[...Array(r.rating)].map((_,i) => (
                          <Star key={i} className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                    </div>
                    <p className="text-[11px] italic leading-relaxed" style={{ color: "#9CA3AF" }}>"{r.text}"</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── QUICK ACTIONS STRIP ── */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: "Request Break",   icon: Coffee,    color: "#60A5FA", route: null },
              { label: "View Profile",    icon: User,      color: "#F5C842", route: "/barber/profile" },
              { label: "Manage Services", icon: Scissors,  color: "#34D399", route: "/live-session" },
              { label: "Full Analytics",  icon: BarChart2, color: "#A78BFA", route: null },
            ].map((a, i) => (
              <button key={i}
                onClick={() => { if (a.route) navigate(a.route); else showToast(`${a.label} — coming soon`); }}
                className="card flex items-center gap-3 px-4 py-3.5 hover:border-white/10 transition-all group text-left">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110" style={{ background: `${a.color}15` }}>
                  <a.icon className="w-4 h-4" style={{ color: a.color }} />
                </div>
                <span className="text-sm font-semibold text-zinc-300 group-hover:text-white transition">{a.label}</span>
                <ChevronRight className="w-3.5 h-3.5 ml-auto text-zinc-600 group-hover:text-zinc-400 transition" />
              </button>
            ))}
          </div>

        </main>
      </div>

      {/* Toast */}
      {toast && (
        <div className={`fixed bottom-6 right-6 px-5 py-3 rounded-xl text-white font-semibold text-sm shadow-2xl z-50 transition-all slide-in flex items-center gap-2`}
          style={{ background: toast.type === "error" ? "#DC2626" : "#16A34A" }}>
          {toast.type === "error" ? <XCircle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
          {toast.msg}
        </div>
      )}
    </div>
  );
}