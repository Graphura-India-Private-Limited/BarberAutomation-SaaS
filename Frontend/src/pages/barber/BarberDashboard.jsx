import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQueue } from "../../contexts/AppContext";
import { motion, AnimatePresence } from "framer-motion";
import { BarChart, Bar, ResponsiveContainer, XAxis, Cell } from "recharts";
import {
  Scissors, Calendar, Clock, Star, TrendingUp, User,
  CheckCircle, PlayCircle, LogOut, Bell, Phone,
  Award, Coffee, AlertCircle, Activity, IndianRupee,
  Users, ChevronRight, ChevronLeft, Timer, Settings, MapPin,
  BarChart2, Layers, Shield, Heart, ChevronDown,
  MoreVertical, Sparkles, Menu, X, ChevronUp,
  CreditCard, Zap, Hash, UserCheck, PauseCircle,
  WifiOff, ArrowUp, ArrowDown, Check, XCircle
} from "lucide-react";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const getToken = () => localStorage.getItem("token");

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

/* Stable custom bar label — prevents re-render blinking */
const CustomBarLabel = ({ x, y, width, value }) => {
  const label = `₹${(value / 1000).toFixed(1)}k`;
  return (
    <text
      x={x + width / 2}
      y={y - 6}
      textAnchor="middle"
      fontSize={12}
      fontWeight={700}
      fill="#4A3E3D"
      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", userSelect: 'none' }}
    >
      {label}
    </text>
  );
};

export default function BarberDashboard() {
  const navigate = useNavigate();
  const [active,      setActive]      = useState("dashboard");
  const [sideOpen,    setSideOpen]    = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [loading,     setLoading]     = useState(true);
  const [toast,       setToast]       = useState(null);
  const [currentSvc,  setCurrentSvc]  = useState(null);
  const [salonOpen,   setSalonOpen]   = useState(true);
  const [showNextClient, setShowNextClient] = useState(false);
  const [dbQueue, setDbQueue] = useState([]);
  const [dbStats, setDbStats] = useState(null);

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

  const { queue: globalQueue, setQueue: setGlobalQueue, servedCount, setServedCount } = useQueue();

  const SERVICES_LIST = [
    { id: 'haircut', label: 'Haircut',         mins: 20, price: 15 },
    { id: 'shave',   label: 'Shave',           mins: 15, price: 10 },
    { id: 'beard',   label: 'Beard Trim',      mins: 10, price: 8  },
    { id: 'combo',   label: 'Haircut + Shave', mins: 35, price: 22 },
    { id: 'color',   label: 'Hair Color',      mins: 60, price: 45 },
    { id: 'kids',    label: "Kids' Cut",       mins: 15, price: 10 },
  ];

  const fmtWaitLocal = (pos, serviceId) => {
    const svc = SERVICES_LIST.find(s => s.id === serviceId);
    const mins = (pos - 1) * 20 + (svc?.mins ?? 20);
    if (mins < 60) return `${mins} min`;
    return `${Math.floor(mins/60)}h ${mins%60}m`;
  };

  const loggedInBarberName = localStorage.getItem("barberName") || localStorage.getItem("name") || "";
  const currentBarberId = loggedInBarberName ? loggedInBarberName.split(" ")[0].toLowerCase() : "ali";

  const barberId = localStorage.getItem("barberId");
  const useDbData = !!barberId;

  const myQueue = globalQueue.filter(e => {
    if (e.status === "done" || e.status === "Completed") return false;
    return e.barber === currentBarberId;
  });

  const rawQueue = useDbData ? dbQueue : myQueue;

  // Filter out any active in-progress item from the waiting queue list
  const waitingQueue = rawQueue.filter(item => item.status !== "in-progress");

  const queue = waitingQueue.map((item, index) => {
    const isDb = item._id && !item._id.toString().startsWith("mock-");
    if (isDb) {
      return {
        ...item,
        id: item._id,
        customer: item.customer_id?.name || "Customer",
        mobile: item.customer_id?.mobile || "—",
        service: item.booking_id?.services?.[0]?.service_name || "Service",
        amount: item.booking_id?.total_amount || 0,
        time: item.booking_id?.slot_time ? new Date(item.booking_id.slot_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : new Date(item.joined_at || item.created_at || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        wait: `${index * 20 + 20} min`,
        position: item.position || (index + 1)
      };
    } else {
      const svcObj = SERVICES_LIST.find(s => s.id === item.service);
      const amount = item.amount || (svcObj ? svcObj.price * 80 : 499);
      const serviceLabel = item.serviceLabel || (svcObj ? svcObj.label : item.service);
      const waitTime = item.wait || fmtWaitLocal(index + 1, item.service);
      
      return {
        ...item,
        customer: item.customer || item.name,
        mobile: item.mobile || item.phone,
        service: serviceLabel,
        amount,
        time: item.time || (item.slot || new Date(item.joinedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })),
        wait: waitTime,
        position: index + 1
      };
    }
  });

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

  const fetchData = async () => {
    const barberId = localStorage.getItem("barberId");
    if (!barberId) {
      setLoading(false);
      return;
    }
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API}/barber/${barberId}/dashboard`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });
      const data = await res.json();
      if (data.success) {
        setDbQueue(data.todayQueue || []);
        if (data.stats) {
          setDbStats(data.stats);
        }
        
        // Find active service — preserve startedAt to avoid elapsed timer resetting on each poll
        const activeInChair = (data.todayQueue || []).find(q => q.status === "in-progress");
        if (activeInChair) {
          setCurrentSvc(prev => {
            // Same customer still in chair — keep existing startedAt so elapsed timer continues correctly
            if (prev && prev.id === (activeInChair._id || activeInChair.id)) {
              return {
                ...prev,
                customer: activeInChair.customer_id?.name || prev.customer,
                mobile: activeInChair.customer_id?.mobile || prev.mobile,
                service: activeInChair.booking_id?.services?.[0]?.service_name || prev.service,
                amount: activeInChair.booking_id?.total_amount || prev.amount,
              };
            }
            // New customer — use server timestamp if available, else record now
            const serverStart = activeInChair.served_at || activeInChair.started_at;
            return {
              id: activeInChair._id,
              customer: activeInChair.customer_id?.name || "Customer",
              mobile: activeInChair.customer_id?.mobile || "—",
              service: activeInChair.booking_id?.services?.[0]?.service_name || "Service",
              amount: activeInChair.booking_id?.total_amount || 0,
              startedAt: serverStart ? new Date(serverStart) : new Date(),
            };
          });
        } else {
          setCurrentSvc(null);
        }
      }
    } catch (err) {
      console.error("Error fetching barber dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleStartService = async (nextUp) => {
    const barberId = localStorage.getItem("barberId");
    if (!barberId) {
      setCurrentSvc({
        id: nextUp.id,
        customer: nextUp.customer,
        service: nextUp.service,
        amount: nextUp.amount,
        startedAt: new Date(),
        mobile: nextUp.mobile
      });
      setGlobalQueue(prev => prev.filter(e => e.id !== nextUp.id));
      setShowNextClient(false);
      showToast(`Started service for ${nextUp.customer}`, "success");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API}/barber/${barberId}/queue/${nextUp.id}/start`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });
      const data = await res.json();
      if (data.success) {
        showToast(`Started service for ${nextUp.customer}`, "success");
        setCurrentSvc({
          id: nextUp.id,
          customer: nextUp.customer,
          service: nextUp.service,
          amount: nextUp.amount,
          startedAt: new Date(),
          mobile: nextUp.mobile
        });
        fetchData();
        setShowNextClient(false);
      } else {
        showToast(data.message || "Failed to start service", "error");
      }
    } catch (err) {
      console.error(err);
      showToast("Network error starting service", "error");
    }
  };

  const handleCompleteService = async () => {
    const barberId = localStorage.getItem("barberId");
    if (!barberId || !currentSvc) {
      setCurrentSvc(null);
      setServedCount(n => n + 1);
      showToast(`Completed — ${currentSvc?.customer || "client"}`);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API}/barber/${barberId}/queue/${currentSvc.id}/complete`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });
      const data = await res.json();
      if (data.success) {
        showToast(`Completed — ${currentSvc.customer}`, "success");
        setCurrentSvc(null);
        fetchData();
      } else {
        showToast(data.message || "Failed to complete service", "error");
      }
    } catch (err) {
      console.error(err);
      showToast("Network error completing service", "error");
    }
  };

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
      <div className="flex-1 flex flex-col">

        {/* Page Content */}
        <main className="flex-1 px-4 md:px-6 pt-6 pb-6 space-y-5 bg-[#FDFBF7] text-[#4A3E3D]">

  {/* ── STAT CARDS ── */}
  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mx-auto w-full">
    {[
      { label: "Today's Revenue",  value: `₹${(dbStats?.todayRevenue || stats.todayRevenue).toLocaleString()}`, sub: "+17% vs yesterday", icon: IndianRupee, up: true,  color: "#8B5A2B" },
      { label: "Live Queue",        value: useDbData ? queue.length : stats.liveQueue,                         sub: currentSvc ? "1 in service" : "0 in service",     icon: Users,       up: null,  color: "#4A3E3D" },
      { label: "Active Barbers",    value: stats.activeBarbers,                      sub: "1 on break",       icon: UserCheck,   up: null,  color: "#8B5A2B" },
      { label: "Avg Wait Time",     value: useDbData ? `${queue.length * 20} min` : `${stats.avgWait} min`,                    sub: "Peak: 28 min at 2PM", icon: Timer,    up: false, color: "#4A3E3D" },
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
            onClick={handleCompleteService}
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
          label={<CustomBarLabel />}
          isAnimationActive={false}
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
      { label: "Request Break",   icon: Coffee,      color: "#8B5A2B", route: "/barber/breaks" },
      { label: "View Profile",    icon: User,        color: "#4A3E3D", route: "/barber/profile" },
      { label: "Live Console",    icon: PlayCircle,  color: "#8B5A2B", route: "/barber/service-console" },
      { label: "Barber Services", icon: Scissors,    color: "#D9534F", route: "/barber/services" },
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

      {/* ── Collapsible Right Arrow Tab for Next Client ── */}
      <div className="fixed right-0 top-1/2 -translate-y-1/2 z-40 animate-in fade-in duration-300">
        <button
          onClick={() => setShowNextClient(true)}
          className="bg-[#3E362E] hover:bg-[#2D2620] text-[#C5A059] border border-[#C5A059]/40 border-r-0 hover:border-[#C5A059] p-3 rounded-l-2xl shadow-lg cursor-pointer transition-all flex flex-col items-center gap-1.5 hover:pr-4"
          title="View Next Client"
        >
          <ChevronLeft className="w-5 h-5 animate-pulse" />
          <span className="text-[9px] font-black tracking-widest writing-mode-vertical uppercase [writing-mode:vertical-lr] rotate-180 font-sans">
            Next Client
          </span>
        </button>
      </div>

      {/* ── Slide-Over Sidebar / Popup for Next Client ── */}
      <AnimatePresence>
        {showNextClient && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowNextClient(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50"
            />
            {/* Drawer */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 w-[340px] bg-[#FAF6F0] border-l border-[#E6D5C3] shadow-2xl z-50 p-6 flex flex-col justify-between text-left"
              onClick={e => e.stopPropagation()}
            >
              <div>
                {/* Header */}
                <div className="flex justify-between items-center border-b border-[#E6D5C3]/60 pb-4 mb-6">
                  <div>
                    <h3 className="font-serif font-black text-[#4A3E3D] text-lg uppercase">Next Queue Target</h3>
                    <p className="text-[9px] font-black uppercase tracking-widest text-[#A37B58] mt-0.5">Next Client up for service</p>
                  </div>
                  <button
                    onClick={() => setShowNextClient(false)}
                    className="w-8 h-8 rounded-xl border border-stone-200 bg-white text-stone-400 hover:text-stone-800 flex items-center justify-center cursor-pointer transition-all shadow-3xs"
                  >
                    <X size={15} />
                  </button>
                </div>

                {/* Body */}
                {queue.length > 0 ? (
                  <div className="space-y-6">
                    {/* Customer Info Card */}
                    <div className="bg-white border border-[#E6D5C3]/80 rounded-2xl p-5 shadow-3xs">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#A06D3B] to-[#8B5A2B] text-white flex items-center justify-center font-serif text-lg font-black shrink-0">
                          {queue[0].customer[0]}
                        </div>
                        <div>
                          <span className="text-[9px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full text-[#8B5A2B] bg-[#8B5A2B]/10 border border-[#8B5A2B]/20">
                            NEXT UP
                          </span>
                          <h4 className="font-serif font-black text-stone-900 text-base mt-1">{queue[0].customer}</h4>
                        </div>
                      </div>

                      <div className="space-y-3 pt-3 border-t border-stone-50 text-xs">
                        <div className="flex justify-between">
                          <span className="text-stone-400 font-bold uppercase tracking-wider text-[10px]">Service</span>
                          <span className="font-extrabold text-stone-800">{queue[0].service}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-stone-400 font-bold uppercase tracking-wider text-[10px]">Est. Wait Time</span>
                          <span className="font-extrabold text-[#8B5A2B]">{queue[0].wait}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-stone-400 font-bold uppercase tracking-wider text-[10px]">Time Slot</span>
                          <span className="font-extrabold text-stone-800">{queue[0].time}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-stone-400 font-bold uppercase tracking-wider text-[10px]">Phone Number</span>
                          <span className="font-extrabold text-stone-800">{queue[0].mobile}</span>
                        </div>
                      </div>
                    </div>

                    {/* Alert banner */}
                    <div className="flex gap-2.5 bg-[#FFFBF4] border border-[#C5A059]/30 rounded-xl p-4 text-[11px] text-stone-600 font-medium leading-relaxed">
                      <Clock size={16} className="text-[#C5A059] shrink-0 mt-0.5" />
                      <div>
                        Please prepare the barber chair and set tools ready. Click <strong>Start Service</strong> below to pull the client into your active slot.
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-16 text-stone-400 text-xs font-black uppercase tracking-widest border border-dashed border-[#E6D5C3] rounded-2xl bg-white/40">
                    📭 Queue is currently empty.
                  </div>
                )}
              </div>

              {/* Footer CTA */}
              {queue.length > 0 && (
                <button
                  onClick={() => {
                    const nextUp = queue[0];
                    if (currentSvc) {
                      showToast("Please complete your current service first!", "error");
                      return;
                    }
                    handleStartService(nextUp);
                  }}
                  className="w-full bg-[#3E362E] hover:bg-[#2D2620] text-white py-4 rounded-xl font-black text-xs uppercase tracking-widest transition-all cursor-pointer border-none shadow-md font-sans"
                >
                  Start Service Now
                </button>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}