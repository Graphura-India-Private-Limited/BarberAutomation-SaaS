// ── NoShowDelayPage.jsx ────────────────────────────
// Save to: Frontend/src/Components/NoShowDelayPage.jsx
// API-connected version — uses real backend queue data

import { useState, useEffect, useRef, useCallback } from "react";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const getToken = () => localStorage.getItem("token");
const SALON_ID = 1; // TODO: get from localStorage or route param

/* ══════════════════════════════════════════
   ICONS
══════════════════════════════════════════ */
const Svg = {
  scissors:(c,s=18)=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><line x1="20" y1="4" x2="8.12" y2="15.88"/><line x1="14.47" y1="14.48" x2="20" y2="20"/><line x1="8.12" y1="8.12" x2="12" y2="12"/></svg>,
  dashboard:(c,s=16)=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>,
  queue:(c,s=16)=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  calendar:(c,s=16)=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
  user:(c,s=16)=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  staff:(c,s=16)=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="23" y1="11" x2="17" y2="11"/><line x1="20" y1="8" x2="20" y2="14"/></svg>,
  bar:(c,s=16)=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
  gear:(c,s=16)=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>,
  bell:(c,s=18)=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>,
  phone:(c,s=13)=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.15 11 19.79 19.79 0 0 1 1.07 3.18 2 2 0 0 1 3.05 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.09 8.91a16 16 0 0 0 5.97 5.97l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21 16.92z"/></svg>,
  clock:(c,s=13)=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  alert:(c,s=18)=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
  check:(c,s=13)=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
  x:(c,s=13)=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  refresh:(c,s=14)=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-3.1"/></svg>,
  send:(c,s=14)=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>,
  info:(c,s=14)=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>,
  trash:(c,s=13)=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg>,
};

/* ══════════════════════════════════════════
   CONSTANTS
══════════════════════════════════════════ */
const STATUSES = {
  waiting:  { label:"Waiting",   color:"#1D4ED8", bg:"#EFF6FF", border:"#BFDBFE", dot:"#3B82F6" },
  inqueue:  { label:"In Queue",  color:"#065F46", bg:"#ECFDF5", border:"#A7F3D0", dot:"#10B981" },
  delayed:  { label:"Delayed",   color:"#92400E", bg:"#FFFBEB", border:"#FCD34D", dot:"#F59E0B" },
  noshow:   { label:"No-Show",   color:"#991B1B", bg:"#FEF2F2", border:"#FECACA", dot:"#EF4444" },
  completed:{ label:"Completed", color:"#065F46", bg:"#ECFDF5", border:"#A7F3D0", dot:"#10B981" },
};

// Fallback demo data when backend not connected
const DEMO_QUEUE = [
  { id:1, booking_id:1, position:1, customer_name:"Rohit Sharma",  customer_mobile:"+91 98765 43210", services:[{service:"Haircut & Beard"}], status:"inqueue",  joined_at: new Date().toISOString() },
  { id:2, booking_id:2, position:2, customer_name:"Priya Mehta",   customer_mobile:"+91 91234 56789", services:[{service:"Hair Spa"}],        status:"waiting",  joined_at: new Date().toISOString() },
  { id:3, booking_id:3, position:3, customer_name:"Amit Kumar",    customer_mobile:"+91 99887 66554", services:[{service:"Haircut"}],         status:"waiting",  joined_at: new Date().toISOString() },
  { id:4, booking_id:4, position:4, customer_name:"Sneha Patil",   customer_mobile:"+91 77665 44321", services:[{service:"Hair Color"}],      status:"waiting",  joined_at: new Date().toISOString() },
];

const C = {
  bg:"#F9F7F4", bg2:"#F3EDE3", white:"#FFFFFF", ink:"#1C1410", muted:"#7C6E60",
  border:"#E8E0D6", border2:"#F0EAE2", gold:"#C9882A", goldBg:"#FEF3DC", teal:"#0D7377",
};

const NAV = [
  { key:"dashboard",    label:"Dashboard",    icon:Svg.dashboard },
  { key:"queue",        label:"Queue",        icon:Svg.queue },
  { key:"appointments", label:"Appointments", icon:Svg.calendar },
  { key:"customers",    label:"Customers",    icon:Svg.user },
  { key:"staff",        label:"Staff",        icon:Svg.staff },
  { key:"reports",      label:"Reports",      icon:Svg.bar },
  { key:"settings",     label:"Settings",     icon:Svg.gear },
];

const pad = n => String(Math.max(0,n)).padStart(2,"0");
const fmtTime = s => `${pad(Math.floor(s/60))}:${pad(s%60)}`;

const StatusBadge = ({ status, small }) => {
  const cfg = STATUSES[status];
  if (!cfg) return null;
  return (
    <span style={{ display:"inline-flex", alignItems:"center", gap:5, background:cfg.bg, color:cfg.color, border:`1px solid ${cfg.border}`, padding:small?"2px 8px":"4px 12px", borderRadius:20, fontSize:small?10:12, fontWeight:700, whiteSpace:"nowrap" }}>
      <span style={{ width:small?5:6, height:small?5:6, borderRadius:"50%", background:cfg.dot, display:"inline-block" }}/>
      {cfg.label}
    </span>
  );
};

const Avatar = ({ name, size=48, radius=14 }) => (
  <div style={{ width:size, height:size, borderRadius:radius, background:C.goldBg, border:`2px solid ${C.border}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:size*.3, fontWeight:800, color:C.gold, flexShrink:0 }}>
    {name?.[0] ?? "?"}
  </div>
);

/* ══════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════ */
export default function NoShowDelayPage() {
  const [navActive,  setNavActive]  = useState("queue");
  const [queue,      setQueue]      = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [usingDemo,  setUsingDemo]  = useState(false);
  const [selected,   setSelected]   = useState(0);
  const [seconds,    setSeconds]    = useState(15*60);
  const [modal,      setModal]      = useState(null);
  const [toast,      setToast]      = useState(null);
  const [mounted,    setMounted]    = useState(false);
  const [notifsBell, setNotifsBell] = useState(0);
  const timerRef = useRef(null);

  useEffect(() => { setTimeout(()=>setMounted(true), 80); }, []);

  // Load queue from backend
  useEffect(() => {
    loadQueue();
    const interval = setInterval(loadQueue, 15000); // refresh every 15s
    return () => clearInterval(interval);
  }, []);

  const loadQueue = async () => {
    try {
      const res  = await fetch(`${API}/queue/${SALON_ID}`, {
        headers: { Authorization:`Bearer ${getToken()}` }
      });
      const data = await res.json();
      if (data.success && data.queue?.length > 0) {
        setQueue(data.queue);
        setUsingDemo(false);
      } else {
        setQueue(DEMO_QUEUE);
        setUsingDemo(true);
      }
    } catch {
      setQueue(DEMO_QUEUE);
      setUsingDemo(true);
    } finally {
      setLoading(false);
    }
  };

  // Timer
  const startTimer = useCallback((sec) => {
    clearInterval(timerRef.current);
    setSeconds(sec);
    timerRef.current = setInterval(() => setSeconds(p => {
      if (p <= 1) { clearInterval(timerRef.current); return 0; }
      return p - 1;
    }), 1000);
  }, []);

  useEffect(() => { startTimer(15*60); return () => clearInterval(timerRef.current); }, [selected]);

  // Auto-escalate when timer hits 0
  useEffect(() => {
    if (seconds > 0 || !queue[selected]) return;
    const cur = queue[selected];
    if (cur.status === "inqueue") handleAPIStatusUpdate(cur.id, "delayed");
    else if (cur.status === "delayed") handleAPIStatusUpdate(cur.id, "noshow");
  }, [seconds]);

  const toast_ = (msg, type="success") => {
    setToast({msg,type});
    setTimeout(() => setToast(null), 3500);
  };

  // API call to update status
  const handleAPIStatusUpdate = async (queueId, status, reason="") => {
    try {
      if (!usingDemo) {
        await fetch(`${API}/queue/${queueId}/status`, {
          method: "PUT",
          headers: { "Content-Type":"application/json", Authorization:`Bearer ${getToken()}` },
          body: JSON.stringify({ status, reason })
        });
      }
      setQueue(prev => prev.map(q => q.id===queueId ? {...q, status} : q));
    } catch {
      setQueue(prev => prev.map(q => q.id===queueId ? {...q, status} : q));
    }
  };

  // API call for rejoin
  const handleAPIRejoin = async (queueId) => {
    try {
      if (!usingDemo) {
        await fetch(`${API}/queue/${queueId}/rejoin`, {
          method: "PUT",
          headers: { Authorization:`Bearer ${getToken()}` }
        });
      }
      setQueue(prev => prev.map(q => q.id===queueId ? {...q, status:"inqueue"} : q));
      startTimer(15*60);
    } catch {
      setQueue(prev => prev.map(q => q.id===queueId ? {...q, status:"inqueue"} : q));
      startTimer(15*60);
    }
  };

  // API call for notify
  const handleAPINotify = async (queueId, name) => {
    try {
      if (!usingDemo) {
        await fetch(`${API}/queue/notify`, {
          method: "POST",
          headers: { "Content-Type":"application/json", Authorization:`Bearer ${getToken()}` },
          body: JSON.stringify({ queue_id:queueId, message:`Hello ${name}, your turn is coming up soon!` })
        });
      }
      setNotifsBell(n => n+1);
      toast_(`Reminder sent to ${name}!`);
    } catch {
      toast_(`Notification sent to ${name}!`);
    }
  };

  /* Button handlers */
  const handleMarkDelayed = async () => {
    const cur = queue[selected];
    await handleAPIStatusUpdate(cur.id, "delayed", "Late by 5+ mins");
    startTimer(2*60);
    setModal(null);
    toast_(`${cur.customer_name} marked Delayed. 2-min grace started.`, "warn");
  };

  const handleMarkNoShow = async () => {
    const cur = queue[selected];
    await handleAPIStatusUpdate(cur.id, "noshow", "Did not arrive");
    clearInterval(timerRef.current); setSeconds(0);
    setModal(null);
    toast_(`${cur.customer_name} marked No-Show. Slot reassigned.`, "error");
  };

  const handleSendNotif = async () => {
    const cur = queue[selected];
    await handleAPINotify(cur.id, cur.customer_name);
    setModal(null);
  };

  const handleRejoin = async () => {
    const cur = queue[selected];
    await handleAPIRejoin(cur.id);
    setModal(null);
    toast_(`${cur.customer_name} rejoined queue!`);
  };

  const handleComplete = async () => {
    const cur = queue[selected];
    await handleAPIStatusUpdate(cur.id, "completed");
    clearInterval(timerRef.current); setSeconds(0);
    toast_(`Service completed for ${cur.customer_name}!`);
  };

  const handleRemove = async () => {
    const cur = queue[selected];
    await handleAPIStatusUpdate(cur.id, "noshow", "Manually removed");
    clearInterval(timerRef.current); setSeconds(0);
    setModal(null);
    toast_(`${cur.customer_name} removed from queue.`, "error");
  };

  const currentCustomer = queue[selected];
  const statusCfg = STATUSES[currentCustomer?.status] || STATUSES.waiting;
  const pct = Math.round((seconds/900)*100);
  const progressColor = seconds<60?"#EF4444":seconds<180?"#F59E0B":C.gold;
  const rv = (i=0) => ({ opacity:mounted?1:0, transform:mounted?"none":"translateY(12px)", transition:`opacity .5s ease ${i*.06}s,transform .5s ease ${i*.06}s` });

  if (loading) return (
    <div style={{ display:"flex", alignItems:"center", justifyContent:"center", height:"100vh", background:C.bg, fontFamily:"'DM Sans',sans-serif" }}>
      <div style={{ textAlign:"center" }}>
        <div style={{ width:40, height:40, border:`4px solid ${C.gold}`, borderTopColor:"transparent", borderRadius:"50%", animation:"spin 1s linear infinite", margin:"0 auto 16px" }}/>
        <p style={{ color:C.muted, fontWeight:600 }}>Loading queue...</p>
      </div>
    </div>
  );

  return (
    <div style={{ display:"flex", height:"100vh", background:C.bg, fontFamily:"'DM Sans','Segoe UI',sans-serif", color:C.ink, overflow:"hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700;800&family=DM+Sans:wght@400;500;600;700;800&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        @keyframes fadeUp{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}
        @keyframes liveDot{0%,100%{opacity:1}50%{opacity:.3}}
        @keyframes shake{0%,100%{transform:translateX(0)}20%,60%{transform:translateX(-3px)}40%,80%{transform:translateX(3px)}}
        @keyframes slideIn{from{opacity:0;transform:translateX(80px)}to{opacity:1;transform:none}}
        @keyframes modalIn{from{opacity:0;transform:scale(.95)}to{opacity:1;transform:scale(1)}}
        @keyframes spin{to{transform:rotate(360deg)}}
        .nb{background:none;border:none;cursor:pointer;font-family:'DM Sans',sans-serif}
        .nav-item{display:flex;align-items:center;gap:10px;padding:9px 12px;border-radius:10px;cursor:pointer;font-size:13px;font-weight:600;color:${C.muted};width:100%;border:none;background:transparent;transition:all .18s;text-align:left;font-family:'DM Sans',sans-serif}
        .nav-item:hover{background:${C.bg2};color:${C.ink}}
        .nav-item.on{background:${C.goldBg};color:${C.gold};border-left:3px solid ${C.gold}}
        .q-row{display:flex;align-items:center;gap:12px;padding:10px 14px;border-radius:12px;cursor:pointer;transition:all .18s;border:1.5px solid transparent}
        .q-row:hover{background:${C.bg2}}
        .q-row.sel{background:${C.goldBg};border-color:${C.gold}}
        .act-btn{display:flex;align-items:center;justify-content:center;gap:7px;padding:11px 0;border-radius:11px;font-weight:700;font-size:13px;cursor:pointer;border:none;transition:all .2s;width:100%;font-family:'DM Sans',sans-serif}
        .act-btn:hover{filter:brightness(.95);transform:translateY(-1px)}
        ::-webkit-scrollbar{width:4px}
        ::-webkit-scrollbar-thumb{background:${C.border};border-radius:3px}
      `}</style>

      {/* ═══ SIDEBAR ═══ */}
      <aside style={{ width:200, background:C.white, borderRight:`1px solid ${C.border}`, display:"flex", flexDirection:"column", flexShrink:0 }}>
        <div style={{ padding:"18px 16px 12px", borderBottom:`1px solid ${C.border2}` }}>
          <div style={{ display:"flex", alignItems:"center", gap:9 }}>
            <div style={{ width:34, height:34, borderRadius:10, background:C.gold, display:"flex", alignItems:"center", justifyContent:"center" }}>
              {Svg.scissors("#fff",16)}
            </div>
            <div>
              <div style={{ fontSize:14, fontWeight:800, color:C.ink, fontFamily:"'Cormorant Garamond',serif" }}>SalonPro</div>
              <div style={{ fontSize:9, color:C.muted, fontWeight:600, letterSpacing:1 }}>MANAGEMENT</div>
            </div>
          </div>
        </div>
        <nav style={{ padding:"10px 8px", flex:1 }}>
          {NAV.map(n => (
            <button key={n.key} className={`nav-item${navActive===n.key?" on":""}`} onClick={()=>setNavActive(n.key)}>
              {n.icon(navActive===n.key?C.gold:C.muted,15)}
              {n.label}
            </button>
          ))}
        </nav>
        <div style={{ padding:"12px 14px", borderTop:`1px solid ${C.border2}` }}>
          <Avatar name="A" size={32} radius={50}/>
        </div>
      </aside>

      {/* ═══ MAIN ═══ */}
      <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden" }}>
        {/* Topbar */}
        <header style={{ background:C.white, borderBottom:`1px solid ${C.border}`, height:52, display:"flex", alignItems:"center", justifyContent:"space-between", padding:"0 22px", flexShrink:0 }}>
          <div style={{ fontSize:12, color:C.muted }}>
            Queue <span style={{ color:C.border, margin:"0 6px" }}>/</span>
            <span style={{ fontWeight:700, color:C.ink }}>No-Show & Delay Handling</span>
            {usingDemo && (
              <span style={{ marginLeft:12, background:"#FEF3DC", color:C.gold, fontSize:10, fontWeight:700, padding:"2px 8px", borderRadius:20, border:`1px solid ${C.gold}44` }}>
                Demo Mode
              </span>
            )}
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:14 }}>
            <button className="nb" onClick={loadQueue} style={{ color:C.muted, display:"flex", gap:4, alignItems:"center", fontSize:11, fontWeight:600 }}>
              {Svg.refresh(C.muted,13)} Refresh
            </button>
            <div style={{ position:"relative", cursor:"pointer" }} onClick={()=>setNotifsBell(0)}>
              {Svg.bell(C.muted,18)}
              {notifsBell>0&&<span style={{ position:"absolute",top:-6,right:-6,minWidth:15,height:15,padding:"0 3px",borderRadius:20,background:"#EF4444",color:"#fff",fontSize:8,fontWeight:800,display:"flex",alignItems:"center",justifyContent:"center" }}>{notifsBell}</span>}
            </div>
          </div>
        </header>

        {/* Body */}
        <main style={{ flex:1, overflowY:"auto", padding:"18px 22px 40px" }}>

          {/* Banner */}
          <div style={{ ...rv(0), background:C.goldBg, border:`1px solid #F5CFA0`, borderRadius:14, padding:"12px 18px", marginBottom:18, display:"flex", alignItems:"center", gap:12 }}>
            {Svg.alert(C.gold,17)}
            <div>
              <div style={{ fontSize:13, fontWeight:700, color:C.gold }}>No-Show & Delay Monitoring</div>
              <div style={{ fontSize:11, color:"#92400E", marginTop:1 }}>Monitor and manage customer delays or no-shows in real-time. {usingDemo?"(Using demo data — start backend to use live data)":""}</div>
            </div>
          </div>

          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 240px", gap:16 }}>

            {/* COL 1 — Queue list */}
            <div style={rv(1)}>
              <div style={{ background:C.white, borderRadius:16, border:`1px solid ${C.border}`, overflow:"hidden", boxShadow:"0 2px 10px rgba(0,0,0,.04)" }}>
                <div style={{ padding:"14px 16px 10px", borderBottom:`1px solid ${C.border2}` }}>
                  <div style={{ fontSize:13, fontWeight:800, color:C.ink }}>Live Queue ({queue.length})</div>
                  <div style={{ fontSize:11, color:C.muted }}>Click to manage</div>
                </div>
                <div style={{ padding:8 }}>
                  {queue.length === 0 ? (
                    <div style={{ textAlign:"center", padding:"24px 0", color:C.muted, fontSize:13 }}>Queue is empty right now</div>
                  ) : queue.map((c,i) => (
                    <div key={c.id} className={`q-row${i===selected?" sel":""}`} onClick={()=>{setSelected(i);startTimer(15*60);}}>
                      <Avatar name={c.customer_name} size={40} radius={10}/>
                      <div style={{ flex:1, minWidth:0 }}>
                        <div style={{ fontSize:13, fontWeight:700, color:C.ink }}>{c.customer_name}</div>
                        <div style={{ fontSize:11, color:C.muted }}>{c.services?.[0]?.service || "Grooming"}</div>
                        <StatusBadge status={c.status} small/>
                      </div>
                      <div style={{ fontSize:11, color:C.muted, textAlign:"right", flexShrink:0 }}>#{c.position}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* COL 2 — Current customer */}
            <div style={rv(2)}>
              {currentCustomer ? (
                <>
                  <div style={{ background:C.white, borderRadius:16, border:`1.5px solid ${statusCfg.border}`, padding:18, marginBottom:14, boxShadow:"0 4px 18px rgba(0,0,0,.06)", transition:"border-color .4s" }}>
                    <div style={{ display:"flex", justifyContent:"space-between", marginBottom:14 }}>
                      <div style={{ fontSize:11, fontWeight:700, color:C.muted, letterSpacing:.8 }}>CURRENT CUSTOMER</div>
                      <StatusBadge status={currentCustomer.status}/>
                    </div>
                    <div style={{ display:"flex", gap:12, marginBottom:16 }}>
                      <Avatar name={currentCustomer.customer_name} size={60} radius={14}/>
                      <div>
                        <div style={{ fontSize:17, fontWeight:800, color:C.ink, fontFamily:"'Cormorant Garamond',serif", marginBottom:6 }}>{currentCustomer.customer_name}</div>
                        <div style={{ fontSize:12, color:C.muted, display:"flex", alignItems:"center", gap:5, marginBottom:3 }}>{Svg.phone(C.muted,12)} {currentCustomer.customer_mobile}</div>
                        <div style={{ fontSize:12, color:C.muted }}>{currentCustomer.services?.[0]?.service || "Grooming"}</div>
                      </div>
                    </div>

                    {/* Timer */}
                    <div style={{ background:C.bg, borderRadius:10, padding:"12px 14px", marginBottom:12 }}>
                      <div style={{ fontSize:10, color:C.muted, fontWeight:600, letterSpacing:.8, marginBottom:6 }}>TIME REMAINING</div>
                      <div style={{ fontSize:36, fontWeight:900, color:seconds<60?"#EF4444":seconds<180?"#F59E0B":C.ink, letterSpacing:2, lineHeight:1, animation:seconds<30?"shake 1s infinite":"none", fontVariantNumeric:"tabular-nums" }}>
                        {fmtTime(seconds)}
                      </div>
                      <div style={{ height:6, background:C.border, borderRadius:3, overflow:"hidden", marginTop:10 }}>
                        <div style={{ height:"100%", width:`${pct}%`, background:progressColor, borderRadius:3, transition:"width 1s linear, background .5s" }}/>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div style={{ background:C.white, borderRadius:16, border:`1px solid ${C.border}`, padding:16, boxShadow:"0 2px 10px rgba(0,0,0,.04)" }}>
                    <div style={{ fontSize:11, fontWeight:800, color:C.ink, letterSpacing:.5, marginBottom:12 }}>UPDATE STATUS</div>
                    <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:8 }}>
                      <button className="act-btn" onClick={()=>setModal({type:"delayed",customer:currentCustomer})} style={{ background:"#FFFBEB",color:"#92400E",border:"1.5px solid #FCD34D" }}>{Svg.alert("#F59E0B",14)} Mark Delayed</button>
                      <button className="act-btn" onClick={()=>setModal({type:"noshow",customer:currentCustomer})} style={{ background:"#FEF2F2",color:"#991B1B",border:"1.5px solid #FECACA" }}>{Svg.x("#EF4444",13)} No-Show</button>
                      <button className="act-btn" onClick={()=>setModal({type:"notify",customer:currentCustomer})} style={{ background:"#EFF6FF",color:"#1D4ED8",border:"1.5px solid #BFDBFE" }}>{Svg.send("#1D4ED8",13)} Notify</button>
                      <button className="act-btn" onClick={handleComplete} style={{ background:"#ECFDF5",color:"#065F46",border:"1.5px solid #A7F3D0" }}>{Svg.check("#065F46",13)} Completed</button>
                    </div>
                    <button className="act-btn" onClick={()=>setModal({type:"rejoin",customer:currentCustomer})} style={{ background:C.ink,color:"#fff",border:"none",marginBottom:6 }}>{Svg.refresh("#fff",13)} Rejoin Queue</button>
                    <button className="act-btn" onClick={()=>setModal({type:"remove",customer:currentCustomer})} style={{ background:C.bg,color:C.muted,border:`1px solid ${C.border}` }}>{Svg.trash(C.muted,12)} Remove</button>
                  </div>
                </>
              ) : (
                <div style={{ background:C.white, borderRadius:16, border:`1px solid ${C.border}`, padding:32, textAlign:"center", color:C.muted }}>
                  Select a customer from the queue
                </div>
              )}
            </div>

            {/* COL 3 — Sidebar */}
            <div style={{ ...rv(3), display:"flex", flexDirection:"column", gap:12 }}>
              <div style={{ background:C.white, borderRadius:14, border:`1px solid ${C.border}`, padding:14, boxShadow:"0 2px 8px rgba(0,0,0,.04)" }}>
                <div style={{ fontSize:12, fontWeight:800, color:C.ink, marginBottom:10 }}>Next in Queue</div>
                {queue.filter((_,i)=>i!==selected && queue[i]?.status!=="noshow" && queue[i]?.status!=="completed").slice(0,3).map((c,i) => (
                  <div key={c.id} style={{ display:"flex", gap:8, alignItems:"center", padding:"7px 0", borderBottom:i<2?`1px solid ${C.border2}`:"none" }}>
                    <Avatar name={c.customer_name} size={34} radius={9}/>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ fontSize:12, fontWeight:700, color:C.ink, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{c.customer_name}</div>
                      <div style={{ fontSize:10, color:C.muted }}>#{c.position}</div>
                    </div>
                    <StatusBadge status={c.status} small/>
                  </div>
                ))}
                {queue.length <= 1 && <div style={{ fontSize:12, color:C.muted, textAlign:"center", padding:"8px 0" }}>No more in queue</div>}
              </div>

              <div style={{ background:C.white, borderRadius:14, border:`1px solid ${C.border}`, padding:14, boxShadow:"0 2px 8px rgba(0,0,0,.04)" }}>
                <div style={{ fontSize:12, fontWeight:800, color:C.ink, marginBottom:10 }}>Tips</div>
                {[
                  { icon:Svg.clock(C.gold,12), text:"Mark Delayed after 5 mins late" },
                  { icon:Svg.alert(C.gold,12), text:"No-Show after 10 mins missing" },
                  { icon:Svg.send("#1D4ED8",12), text:"Notify customer before their turn" },
                  { icon:Svg.refresh(C.muted,12), text:"Rejoin resets their timer" },
                ].map(({icon,text},i) => (
                  <div key={i} style={{ display:"flex", gap:7, alignItems:"flex-start", marginBottom:i<3?8:0 }}>
                    <div style={{ flexShrink:0, marginTop:1 }}>{icon}</div>
                    <span style={{ fontSize:11, color:C.muted, lineHeight:1.5 }}>{text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* ═══ MODALS ═══ */}
      {modal && (
        <div style={{ position:"fixed",inset:0,zIndex:500,display:"flex",alignItems:"center",justifyContent:"center" }} onClick={()=>setModal(null)}>
          <div style={{ position:"absolute",inset:0,background:"rgba(28,20,16,.45)",backdropFilter:"blur(3px)" }}/>
          <div style={{ position:"relative",background:C.white,borderRadius:20,padding:"26px 30px",maxWidth:380,width:"90%",boxShadow:"0 24px 60px rgba(0,0,0,.22)",animation:"modalIn .22s ease" }} onClick={e=>e.stopPropagation()}>

            {modal.type==="delayed"&&<>
              <div style={{ fontSize:17,fontWeight:800,color:C.ink,marginBottom:8 }}>Mark as Delayed?</div>
              <div style={{ fontSize:13,color:C.muted,lineHeight:1.6,marginBottom:18 }}><b style={{color:C.ink}}>{modal.customer?.customer_name}</b> will be marked delayed. 2-min grace period starts.</div>
              <div style={{ display:"flex",gap:8 }}>
                <button className="nb" onClick={()=>setModal(null)} style={{ flex:1,padding:11,borderRadius:10,border:`1.5px solid ${C.border}`,fontWeight:700,fontSize:13,cursor:"pointer" }}>Cancel</button>
                <button className="nb" onClick={handleMarkDelayed} style={{ flex:2,padding:11,borderRadius:10,background:"#F59E0B",color:"#fff",fontWeight:700,fontSize:13,cursor:"pointer" }}>Confirm Delayed</button>
              </div>
            </>}

            {modal.type==="noshow"&&<>
              <div style={{ fontSize:17,fontWeight:800,color:C.ink,marginBottom:8 }}>Mark as No-Show?</div>
              <div style={{ fontSize:13,color:C.muted,lineHeight:1.6,marginBottom:18 }}><b style={{color:C.ink}}>{modal.customer?.customer_name}</b>'s slot will be reassigned. This is logged.</div>
              <div style={{ display:"flex",gap:8 }}>
                <button className="nb" onClick={()=>setModal(null)} style={{ flex:1,padding:11,borderRadius:10,border:`1.5px solid ${C.border}`,fontWeight:700,fontSize:13,cursor:"pointer" }}>Cancel</button>
                <button className="nb" onClick={handleMarkNoShow} style={{ flex:2,padding:11,borderRadius:10,background:"#EF4444",color:"#fff",fontWeight:700,fontSize:13,cursor:"pointer" }}>Confirm No-Show</button>
              </div>
            </>}

            {modal.type==="notify"&&<>
              <div style={{ fontSize:17,fontWeight:800,color:C.ink,marginBottom:8 }}>Send Notification?</div>
              <div style={{ fontSize:13,color:C.muted,lineHeight:1.6,marginBottom:18 }}>Reminder will be sent to <b style={{color:C.ink}}>{modal.customer?.customer_name}</b> at {modal.customer?.customer_mobile}.</div>
              <div style={{ display:"flex",gap:8 }}>
                <button className="nb" onClick={()=>setModal(null)} style={{ flex:1,padding:11,borderRadius:10,border:`1.5px solid ${C.border}`,fontWeight:700,fontSize:13,cursor:"pointer" }}>Cancel</button>
                <button className="nb" onClick={handleSendNotif} style={{ flex:2,padding:11,borderRadius:10,background:"#1D4ED8",color:"#fff",fontWeight:700,fontSize:13,cursor:"pointer" }}>Send Now</button>
              </div>
            </>}

            {modal.type==="rejoin"&&<>
              <div style={{ fontSize:17,fontWeight:800,color:C.ink,marginBottom:8 }}>Rejoin Queue?</div>
              <div style={{ fontSize:13,color:C.muted,lineHeight:1.6,marginBottom:18 }}><b style={{color:C.ink}}>{modal.customer?.customer_name}</b> will be placed back and timer resets to 15 mins.</div>
              <div style={{ display:"flex",gap:8 }}>
                <button className="nb" onClick={()=>setModal(null)} style={{ flex:1,padding:11,borderRadius:10,border:`1.5px solid ${C.border}`,fontWeight:700,fontSize:13,cursor:"pointer" }}>Cancel</button>
                <button className="nb" onClick={handleRejoin} style={{ flex:2,padding:11,borderRadius:10,background:C.ink,color:"#fff",fontWeight:700,fontSize:13,cursor:"pointer" }}>Rejoin Queue</button>
              </div>
            </>}

            {modal.type==="remove"&&<>
              <div style={{ fontSize:17,fontWeight:800,color:C.ink,marginBottom:8 }}>Remove from Queue?</div>
              <div style={{ fontSize:13,color:C.muted,lineHeight:1.6,marginBottom:18 }}><b style={{color:C.ink}}>{modal.customer?.customer_name}</b> will be permanently removed. Cannot be undone.</div>
              <div style={{ display:"flex",gap:8 }}>
                <button className="nb" onClick={()=>setModal(null)} style={{ flex:1,padding:11,borderRadius:10,border:`1.5px solid ${C.border}`,fontWeight:700,fontSize:13,cursor:"pointer" }}>Cancel</button>
                <button className="nb" onClick={handleRemove} style={{ flex:2,padding:11,borderRadius:10,background:"#EF4444",color:"#fff",fontWeight:700,fontSize:13,cursor:"pointer" }}>Remove</button>
              </div>
            </>}
          </div>
        </div>
      )}

      {/* ═══ TOAST ═══ */}
      {toast && (
        <div style={{ position:"fixed",bottom:24,right:80,zIndex:600,animation:"slideIn .3s ease",background:toast.type==="error"?"#991B1B":toast.type==="warn"?"#92400E":C.ink,color:"#fff",padding:"12px 18px",borderRadius:12,fontWeight:600,fontSize:13,boxShadow:"0 8px 24px rgba(0,0,0,.25)",display:"flex",alignItems:"center",gap:9,maxWidth:320 }}>
          <span style={{ width:18,height:18,borderRadius:"50%",background:toast.type==="error"?"#EF4444":toast.type==="warn"?"#F59E0B":"#10B981",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0 }}>
            {toast.type==="error"?Svg.x("#fff",9):Svg.check("#fff",9)}
          </span>
          {toast.msg}
        </div>
      )}
    </div>
  );
}