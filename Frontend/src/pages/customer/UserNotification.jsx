import { useState, useEffect, useRef, useCallback } from "react";

// ─── Theme ──────────────────────────────────────────────────────────────────
const C = {
  bg:       "#0e0e0e",
  surface:  "#141414",
  card:     "#1a1a1a",
  cardHov:  "#1e1e1e",
  border:   "#262626",
  gold:     "#C9A84C",
  goldLt:   "#ddb95e",
  goldDim:  "rgba(201,168,76,0.11)",
  goldGlow: "rgba(201,168,76,0.2)",
  cream:    "#ede8df",
  muted:    "#6b6660",
  mutedLt:  "#9a9590",
  red:      "#c0392b",
  redDim:   "rgba(192,57,43,0.13)",
  green:    "#27ae60",
  greenDim: "rgba(39,174,96,0.12)",
  blue:     "#2980b9",
  blueDim:  "rgba(41,128,185,0.12)",
  purple:   "#8e44ad",
  purpleDim:"rgba(142,68,173,0.12)",
};

// ─── Notification type config ────────────────────────────────────────────────
const NTYPES = {
  queue_turn:         { icon:"⚡", accent:C.gold,   dim:C.goldDim,   label:"Queue Alert",       dur:7000 },
  queue_update:       { icon:"⏱️", accent:C.blue,   dim:C.blueDim,   label:"Queue Update",      dur:6000 },
  booking_confirmed:  { icon:"✅", accent:C.green,  dim:C.greenDim,  label:"Booking Confirmed", dur:6000 },
  booking_reminder:   { icon:"🔔", accent:C.blue,   dim:C.blueDim,   label:"Reminder",          dur:6000 },
  delay_alert:        { icon:"⚠️", accent:C.red,    dim:C.redDim,    label:"Delay Alert",       dur:8000 },
  loyalty:            { icon:"💰", accent:C.gold,   dim:C.goldDim,   label:"Loyalty Points",    dur:6000 },
  offer:              { icon:"🎁", accent:C.purple, dim:C.purpleDim, label:"Special Offer",     dur:6000 },
  haircut_reminder:   { icon:"✂️", accent:C.gold,   dim:C.goldDim,   label:"Haircut Time",      dur:7000 },
};

// ─── Simulated live events (fires after mount, like a real app) ─────────────
const LIVE_EVENTS = [
  { delay:2200,  type:"booking_confirmed", title:"Booking Confirmed!",   body:"Your 4:30 PM slot at BarberPro Andheri is confirmed.", action:"View Booking",  group:"Today", timeLabel:"just now" },
  { delay:6000,  type:"queue_update",      title:"You're #3 in Queue",   body:"~18 min wait at Elite Cuts & Spa. We'll notify you.",  action:"Track Live",    group:"Today", timeLabel:"just now" },
  { delay:10500, type:"queue_turn",        title:"10 Minutes Left!",     body:"Barber Raj is almost free. Please head to the salon.", action:"I'm Coming",   group:"Today", timeLabel:"just now" },
  { delay:15000, type:"delay_alert",       title:"Slight Delay",         body:"Your barber is ~8 min behind schedule. Sorry!",        action:null,            group:"Today", timeLabel:"just now" },
  { delay:20000, type:"loyalty",           title:"+25 Points Earned",    body:"Your loyalty balance is now 175 pts. Keep it up!",     action:"View Points",   group:"Today", timeLabel:"just now" },
];

// ─── Existing inbox history (pre-filled, realistic) ─────────────────────────
const HISTORY_SEED = [
  { id:10, read:true,  type:"offer",            title:"Weekend Deal — 20% Off",  body:"Book any combo this Saturday and save flat 20%.",           action:"Book Now",    group:"Yesterday", timeLabel:"Yesterday 6 PM" },
  { id:11, read:true,  type:"booking_reminder", title:"Slot Tomorrow at 11 AM",  body:"Don't forget your appointment at BarberPro Bandra.",        action:"View",        group:"Yesterday", timeLabel:"Yesterday 2 PM" },
  { id:12, read:true,  type:"loyalty",          title:"+20 Points Earned",       body:"Great visit! Balance: 150 pts.",                             action:"View Points", group:"Yesterday", timeLabel:"Yesterday 10 AM" },
  { id:13, read:true,  type:"haircut_reminder", title:"Time for a Trim?",        body:"It's been 20 days since your last visit. Raj has slots!",   action:"Book Now",    group:"Earlier",   timeLabel:"3 days ago" },
  { id:14, read:true,  type:"offer",            title:"Gold Membership Upgrade", body:"Priority booking + 15% off every visit. Upgrade now!",      action:"Explore",     group:"Earlier",   timeLabel:"5 days ago" },
  { id:15, read:true,  type:"booking_confirmed",title:"Booking Confirmed",       body:"Last week's slot at Elite Cuts was confirmed.",              action:null,          group:"Earlier",   timeLabel:"1 week ago" },
];

// ─── Single Toast notification ───────────────────────────────────────────────
function Toast({ notif, onDismiss, stackIndex, totalVisible }) {
  const cfg = NTYPES[notif.type];
  const [phase, setPhase]       = useState("enter");
  const [progress, setProg]     = useState(100);
  const [paused, setPaused]     = useState(false);
  const timerRef  = useRef(null);
  const remainRef = useRef(cfg.dur);
  const startRef  = useRef(null);

  const isTop    = stackIndex === totalVisible - 1;
  const peekOffset = (totalVisible - 1 - stackIndex) * 8;
  const peekScale  = 1 - (totalVisible - 1 - stackIndex) * 0.04;

  function drain(ms) {
    startRef.current = Date.now();
    timerRef.current = setInterval(() => {
      const pct = Math.max(0, 100 - ((Date.now() - startRef.current) / ms) * 100);
      setProg(pct);
      if (pct <= 0) { clearInterval(timerRef.current); leave(); }
    }, 40);
  }

  function leave() {
    setPhase("exit");
    setTimeout(() => onDismiss(notif.id), 360);
  }

  useEffect(() => {
    const t = setTimeout(() => setPhase("visible"), 30);
    drain(remainRef.current);
    return () => { clearTimeout(t); clearInterval(timerRef.current); };
  }, []);

  function pause() {
    if (paused) return;
    setPaused(true);
    clearInterval(timerRef.current);
    remainRef.current = (progress / 100) * cfg.dur;
  }
  function resume() {
    if (!paused) return;
    setPaused(false);
    drain(remainRef.current);
  }

  const yTranslate = {
    enter:   "-110%",
    visible: `${peekOffset}px`,
    exit:    "calc(100% + 30px)",
  }[phase];

  return (
    <div
      onMouseEnter={pause}
      onMouseLeave={resume}
      style={{
        position:   "absolute", top:0, left:0, right:0,
        transform:  `translateY(${yTranslate}) scale(${peekScale})`,
        opacity:    phase === "enter" ? 0 : 1,
        transition: phase === "exit"
          ? "transform 0.36s cubic-bezier(0.4,0,1,1), opacity 0.28s"
          : "transform 0.44s cubic-bezier(0.34,1.35,0.64,1), opacity 0.28s",
        zIndex:     stackIndex,
        pointerEvents: isTop ? "auto" : "none",
      }}
    >
      <div style={{
        background:   C.card,
        border:       `1px solid ${cfg.accent}50`,
        borderRadius: 16,
        overflow:     "hidden",
        boxShadow:    `0 12px 48px rgba(0,0,0,0.75), 0 0 0 1px ${cfg.accent}14, inset 0 1px 0 rgba(255,255,255,0.03)`,
      }}>
        {/* Progress rail */}
        <div style={{ height:3, background:"#1f1f1f" }}>
          <div style={{
            height:"100%", width:`${progress}%`,
            background:`linear-gradient(90deg,${cfg.accent},${cfg.accent}99)`,
            transition: paused ? "none" : "width 0.04s linear",
            borderRadius:3,
          }}/>
        </div>

        <div style={{ padding:"14px 16px", display:"flex", gap:12, alignItems:"flex-start" }}>
          {/* Icon */}
          <div style={{
            width:42, height:42, borderRadius:12, flexShrink:0,
            background:cfg.dim, border:`1px solid ${cfg.accent}30`,
            display:"flex", alignItems:"center", justifyContent:"center",
            fontSize:19,
          }}>{cfg.icon}</div>

          {/* Content */}
          <div style={{ flex:1, minWidth:0 }}>
            <span style={{
              fontSize:9, fontFamily:"sans-serif", fontWeight:800,
              letterSpacing:"0.15em", textTransform:"uppercase", color:cfg.accent,
              display:"block", marginBottom:3,
            }}>{cfg.label}</span>
            <div style={{ fontSize:13, fontWeight:700, color:C.cream,
              fontFamily:"Georgia,serif", lineHeight:1.3, marginBottom:4 }}>
              {notif.title}
            </div>
            <p style={{ fontSize:11, color:C.muted, fontFamily:"sans-serif",
              lineHeight:1.5, margin:0 }}>{notif.body}</p>
            {notif.action && (
              <button onClick={leave} style={{
                marginTop:9, padding:"5px 12px", borderRadius:7,
                background:cfg.dim, border:`1px solid ${cfg.accent}40`,
                color:cfg.accent, cursor:"pointer",
                fontSize:10, fontWeight:800, fontFamily:"sans-serif",
                letterSpacing:"0.07em",
              }}>{notif.action} →</button>
            )}
          </div>

          {/* Dismiss */}
          <button onClick={leave} style={{
            width:24, height:24, borderRadius:7, flexShrink:0,
            background:"transparent", border:`1px solid ${C.border}`,
            color:C.muted, cursor:"pointer", fontSize:12,
            display:"flex", alignItems:"center", justifyContent:"center",
          }}>✕</button>
        </div>
      </div>
    </div>
  );
}

// ─── Inbox bottom sheet ──────────────────────────────────────────────────────
const ITABS = [
  { id:"all",      label:"All" },
  { id:"queue",    label:"Queue" },
  { id:"booking",  label:"Bookings" },
  { id:"offer",    label:"Offers" },
  { id:"reminder", label:"Reminders" },
];

function Inbox({ history, onClose, onMarkAll, onClear }) {
  const [tab, setTab] = useState("all");

  const filtered = history.filter(n => {
    if (tab === "all") return true;
    if (tab === "queue")    return n.type.startsWith("queue");
    if (tab === "booking")  return n.type.startsWith("booking");
    if (tab === "offer")    return n.type === "offer";
    if (tab === "reminder") return n.type === "haircut_reminder" || n.type === "loyalty";
    return true;
  });

  const groups = ["Today","Yesterday","Earlier"].reduce((acc,g) => {
    const items = filtered.filter(n => n.group === g);
    if (items.length) acc.push({ g, items });
    return acc;
  },[]);

  const unread = history.filter(n=>!n.read).length;

  return (
    <div onClick={e => e.target===e.currentTarget && onClose()} style={{
      position:"fixed", inset:0, zIndex:900,
      background:"rgba(0,0,0,0.8)", backdropFilter:"blur(10px)",
      display:"flex", alignItems:"flex-end", justifyContent:"center",
    }}>
      <div style={{
        width:"100%", maxWidth:480,
        background:C.surface,
        borderRadius:"22px 22px 0 0",
        border:`1px solid ${C.border}`,
        borderBottom:"none",
        maxHeight:"80vh",
        display:"flex", flexDirection:"column",
        boxShadow:"0 -24px 70px rgba(0,0,0,0.85)",
        animation:"sheetUp 0.34s cubic-bezier(0.34,1.2,0.64,1)",
      }}>
        {/* Drag handle */}
        <div style={{ display:"flex", justifyContent:"center", paddingTop:12, paddingBottom:4 }}>
          <div style={{ width:38, height:4, borderRadius:4, background:C.border }}/>
        </div>

        {/* Header */}
        <div style={{ padding:"12px 20px 0", borderBottom:`1px solid ${C.border}, flexShrink:0` }}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:14 }}>
            <div>
              <h3 style={{ fontSize:17, color:C.cream, fontFamily:"Georgia,serif", fontWeight:700 }}>
                Notifications
              </h3>
              <p style={{ fontSize:11, color:C.muted, fontFamily:"sans-serif", marginTop:2 }}>
                {unread > 0 ? `${unread} unread` : "All caught up ✓"}
              </p>
            </div>
            <div style={{ display:"flex", gap:8 }}>
              {unread > 0 && (
                <button onClick={onMarkAll} style={{
                  padding:"5px 11px", borderRadius:8,
                  background:C.goldDim, border:`1px solid ${C.gold}44`,
                  color:C.gold, cursor:"pointer",
                  fontSize:10, fontWeight:800, fontFamily:"sans-serif", letterSpacing:"0.05em",
                }}>Mark all read</button>
              )}
              <button onClick={onClose} style={{
                width:30, height:30, borderRadius:8,
                background:"transparent", border:`1px solid ${C.border}`,
                color:C.muted, cursor:"pointer", fontSize:14,
                display:"flex", alignItems:"center", justifyContent:"center",
              }}>✕</button>
            </div>
          </div>

          {/* Tabs */}
          <div style={{ display:"flex", gap:2, overflowX:"auto", scrollbarWidth:"none" }}>
            {ITABS.map(t => {
              const cnt = history.filter(n => {
                if (!n.read === false) return false;
                const match = t.id==="all" ? true
                  : t.id==="queue"    ? n.type.startsWith("queue")
                  : t.id==="booking"  ? n.type.startsWith("booking")
                  : t.id==="offer"    ? n.type==="offer"
                  : n.type==="haircut_reminder"||n.type==="loyalty";
                return match && !n.read;
              }).length;
              const active = tab === t.id;
              return (
                <button key={t.id} onClick={() => setTab(t.id)} style={{
                  padding:"7px 13px", borderRadius:"8px 8px 0 0", flexShrink:0,
                  background: active ? C.card : "transparent",
                  border: active ? `1px solid ${C.border}` : "1px solid transparent",
                  borderBottom: active ? `1px solid ${C.card}` : "none",
                  color: active ? C.cream : C.muted,
                  cursor:"pointer", fontSize:11, fontWeight:700,
                  fontFamily:"sans-serif", whiteSpace:"nowrap",
                  transition:"all 0.18s", marginBottom:-1,
                }}>
                  {t.label}
                  {cnt > 0 && (
                    <span style={{
                      marginLeft:5, background:C.red, color:"#fff",
                      fontSize:9, fontWeight:800, padding:"1px 5px",
                      borderRadius:8, fontFamily:"sans-serif",
                    }}>{cnt}</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* List */}
        <div style={{ overflowY:"auto", flex:1, padding:"14px 14px 28px" }}>
          {groups.length === 0 ? (
            <div style={{ textAlign:"center", padding:"52px 0", color:C.muted, fontFamily:"sans-serif" }}>
              <div style={{ fontSize:40, marginBottom:12 }}>🔔</div>
              <div style={{ fontSize:14, color:C.mutedLt, fontWeight:600, fontFamily:"Georgia,serif" }}>
                Nothing here yet
              </div>
            </div>
          ) : groups.map(({g,items}) => (
            <div key={g}>
              <div style={{ display:"flex", alignItems:"center", gap:10, margin:"10px 0 11px" }}>
                <span style={{ fontSize:9, color:C.gold, fontFamily:"sans-serif",
                  fontWeight:800, letterSpacing:"0.16em", textTransform:"uppercase" }}>{g}</span>
                <div style={{ flex:1, height:1, background:C.border }}/>
              </div>
              {items.map(n => {
                const cfg = NTYPES[n.type];
                return (
                  <div key={n.id} style={{
                    background:C.card,
                    border:`1px solid ${n.read ? C.border : cfg.accent+"44"}`,
                    borderRadius:13, padding:"13px 14px",
                    display:"flex", gap:11, alignItems:"flex-start",
                    marginBottom:8,
                    boxShadow: n.read ? "none" : `0 0 0 1px ${cfg.accent}15`,
                    position:"relative",
                  }}>
                    {!n.read && (
                      <div style={{
                        position:"absolute", top:13, right:13,
                        width:7, height:7, borderRadius:"50%",
                        background:cfg.accent, boxShadow:`0 0 5px ${cfg.accent}88`,
                      }}/>
                    )}
                    <div style={{
                      width:38, height:38, borderRadius:10, flexShrink:0,
                      background:cfg.dim, border:`1px solid ${cfg.accent}30`,
                      display:"flex", alignItems:"center", justifyContent:"center", fontSize:17,
                    }}>{cfg.icon}</div>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ fontSize:9, color:cfg.accent, fontFamily:"sans-serif",
                        fontWeight:800, letterSpacing:"0.13em", textTransform:"uppercase", marginBottom:3 }}>
                        {cfg.label}
                      </div>
                      <div style={{ fontSize:13, fontWeight:600, color:n.read ? C.mutedLt : C.cream,
                        fontFamily:"Georgia,serif", marginBottom:3, lineHeight:1.3 }}>{n.title}</div>
                      <p style={{ fontSize:11, color:C.muted, fontFamily:"sans-serif",
                        lineHeight:1.5, margin:"0 0 6px" }}>{n.body}</p>
                      <span style={{ fontSize:10, color:C.muted, fontFamily:"sans-serif" }}>{n.timeLabel}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          ))}

          {history.length > 0 && (
            <button onClick={onClear} style={{
              width:"100%", marginTop:6, padding:"11px",
              borderRadius:10, background:"transparent",
              border:`1px solid ${C.border}`,
              color:C.muted, cursor:"pointer",
              fontSize:11, fontFamily:"sans-serif", fontWeight:700,
              letterSpacing:"0.04em",
            }}>Clear all notifications</button>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Profile stat card ───────────────────────────────────────────────────────
function StatCard({ icon, label, value, accent }) {
  return (
    <div style={{
      background:C.card, border:`1px solid ${C.border}`,
      borderRadius:14, padding:"16px 14px", flex:1,
      display:"flex", flexDirection:"column", gap:8,
    }}>
      <div style={{
        width:36, height:36, borderRadius:10,
        background: `accent ? ${accent}15 : C.goldDim`,
        border:`1px solid ${accent ? accent+"30" : C.gold+"30"}`,
        display:"flex", alignItems:"center", justifyContent:"center", fontSize:17,
      }}>{icon}</div>
      <div style={{ fontSize:18, fontWeight:700, color:C.cream, fontFamily:"Georgia,serif" }}>{value}</div>
      <div style={{ fontSize:11, color:C.muted, fontFamily:"sans-serif", lineHeight:1.3 }}>{label}</div>
    </div>
  );
}

// ─── Upcoming booking card ───────────────────────────────────────────────────
function BookingCard({ salon, service, time, barber, type }) {
  const typeStyle = {
    Priority: { bg:C.goldDim, color:C.gold, border:`${C.gold}44` },
    Slot:     { bg:C.blueDim, color:C.blue, border:`${C.blue}40` },
  }[type] || {};
  return (
    <div style={{
      background:C.card, border:`1px solid ${C.border}`,
      borderRadius:16, padding:"18px 18px", marginBottom:12,
    }}>
      <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:12 }}>
        <div>
          <div style={{ fontSize:15, fontWeight:700, color:C.cream,
            fontFamily:"Georgia,serif", marginBottom:4 }}>{salon}</div>
          <div style={{ fontSize:12, color:C.muted, fontFamily:"sans-serif" }}>{service} · {barber}</div>
        </div>
        <span style={{
          fontSize:10, fontFamily:"sans-serif", fontWeight:800,
          letterSpacing:"0.08em", textTransform:"uppercase",
          padding:"4px 10px", borderRadius:20,
          background:typeStyle.bg, color:typeStyle.color,
          border:`1px solid ${typeStyle.border}`,
        }}>{type}</span>
      </div>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <div style={{ display:"flex", alignItems:"center", gap:6 }}>
          <span style={{ fontSize:14 }}>📅</span>
          <span style={{ fontSize:13, color:C.goldLt, fontFamily:"sans-serif", fontWeight:600 }}>{time}</span>
        </div>
        <button style={{
          padding:"7px 14px", borderRadius:8,
          background:C.goldDim, border:`1px solid ${C.gold}44`,
          color:C.gold, cursor:"pointer",
          fontSize:11, fontWeight:800, fontFamily:"sans-serif", letterSpacing:"0.05em",
        }}>View Details →</button>
      </div>
    </div>
  );
}

// ─── ROOT ────────────────────────────────────────────────────────────────────
let UID = 50;

export default function UserProfile() {
  const [toasts,    setToasts]    = useState([]);
  const [history,   setHistory]   = useState(HISTORY_SEED);
  const [showInbox, setShowInbox] = useState(false);
  const timersRef = useRef([]);

  const unread = history.filter(h => !h.read).length + toasts.length;

  const push = useCallback((evt) => {
    const id   = ++UID;
    const item = { ...evt, id, read:false };
    setToasts(p => [...p, item]);
    setHistory(p => [item, ...p]);
  }, []);

  // Fire live events automatically after mount
  useEffect(() => {
    timersRef.current = LIVE_EVENTS.map(e =>
      setTimeout(() => push(e), e.delay)
    );
    return () => timersRef.current.forEach(clearTimeout);
  }, []);

  function dismiss(id) {
    setToasts(p => p.filter(t => t.id !== id));
    setHistory(p => p.map(h => h.id === id ? {...h, read:true} : h));
  }
  function markAll()  { setHistory(p => p.map(h=>({...h,read:true}))); setToasts([]); }
  function clearAll() { setHistory([]); setToasts([]); setShowInbox(false); }

  const visible = toasts.slice(-3);

  return (
    <div style={{ minHeight:"100vh", background:C.bg, fontFamily:"Georgia,serif" }}>
      <style>{`
        @keyframes sheetUp {
          from { transform:translateY(100%); opacity:0; }
          to   { transform:translateY(0);    opacity:1; }
        }
        @keyframes bellRing {
          0%,100%{ transform:rotate(0); }
          15%    { transform:rotate(-18deg); }
          30%    { transform:rotate(16deg); }
          45%    { transform:rotate(-10deg); }
          60%    { transform:rotate(6deg); }
        }
        * { box-sizing:border-box; margin:0; padding:0; }
        ::-webkit-scrollbar{ width:4px; }
        ::-webkit-scrollbar-thumb{ background:#222; border-radius:4px; }
      `}</style>

      {/* ── Header ── */}
      <div style={{
        background:`linear-gradient(170deg,#181208 0%,#0e0e0e 100%)`,
        borderBottom:`1px solid ${C.border}`,
        padding:"20px 22px 0",
      }}>
        {/* Top row */}
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:22 }}>
          <span style={{
            fontSize:11, color:C.gold, fontFamily:"sans-serif",
            fontWeight:800, letterSpacing:"0.18em", textTransform:"uppercase",
          }}>BarberPro</span>

          {/* Bell */}
          <button
            onClick={() => { setShowInbox(true); markAll(); }}
            style={{
              position:"relative", width:44, height:44, borderRadius:13,
              background:C.goldDim, border:`1px solid ${C.gold}55`,
              cursor:"pointer", fontSize:20,
              display:"flex", alignItems:"center", justifyContent:"center",
              boxShadow: unread > 0 ? `0 0 20px ${C.goldGlow} `: "none",
              animation: unread > 0 ? "bellRing 0.5s ease" : "none",
              transition:"box-shadow 0.4s",
            }}
          >
            🔔
            {unread > 0 && (
              <div style={{
                position:"absolute", top:-5, right:-5,
                width:19, height:19, borderRadius:"50%",
                background:C.red, border:`2px solid ${C.bg}`,
                display:"flex", alignItems:"center", justifyContent:"center",
                fontSize:10, fontWeight:800, color:"#fff", fontFamily:"sans-serif",
              }}>{unread > 9 ? "9+" : unread}</div>
            )}
          </button>
        </div>

        {/* Avatar + name */}
        <div style={{ display:"flex", alignItems:"flex-end", gap:16, paddingBottom:22 }}>
          <div style={{ position:"relative" }}>
            <div style={{
              width:72, height:72, borderRadius:20,
              background:"linear-gradient(135deg,#241e14,#2e2616)",
              border:`2.5px solid ${C.gold}`,
              display:"flex", alignItems:"center", justifyContent:"center",
              fontSize:26, fontWeight:700, color:C.goldLt, fontFamily:"sans-serif",
              boxShadow:`0 4px 20px ${C.goldGlow}`,
            }}>AS</div>
            <div style={{
              position:"absolute", bottom:-4, right:-4,
              width:20, height:20, borderRadius:6,
              background:"linear-gradient(135deg,#C9A84C,#a07620)",
              display:"flex", alignItems:"center", justifyContent:"center",
              fontSize:11, border:`2px solid ${C.bg}`,
            }}>👑</div>
          </div>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:20, fontWeight:700, color:C.cream, letterSpacing:"0.02em", marginBottom:3 }}>
              Arjun Sharma
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:8 }}>
              <span style={{
                fontSize:10, fontFamily:"sans-serif", fontWeight:800,
                letterSpacing:"0.1em", textTransform:"uppercase",
                padding:"3px 10px", borderRadius:20,
                background:C.goldDim, color:C.gold, border:`1px solid ${C.gold}40`,
              }}>Gold Member</span>
              <span style={{ fontSize:12, color:C.muted, fontFamily:"sans-serif" }}>
                +91 98765 43210
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Scrollable content ── */}
      <div style={{ padding:"22px 20px", maxWidth:520, margin:"0 auto" }}>

        {/* Stats row */}
        <div style={{ display:"flex", gap:10, marginBottom:24 }}>
          <StatCard icon="✂️" label="Total Visits"    value="24"     accent={C.gold}   />
          <StatCard icon="💰" label="Loyalty Points"  value="175 pts" accent={C.gold}  />
          <StatCard icon="⭐" label="Avg Rating"      value="4.9"    accent={C.green}  />
        </div>

        {/* Upcoming bookings */}
        <div style={{ marginBottom:24 }}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:14 }}>
            <span style={{
              fontSize:10, color:C.gold, fontFamily:"sans-serif",
              fontWeight:800, letterSpacing:"0.15em", textTransform:"uppercase",
            }}>Upcoming Bookings</span>
            <span style={{ fontSize:11, color:C.muted, fontFamily:"sans-serif", cursor:"pointer" }}>View all →</span>
          </div>
          <BookingCard salon="BarberPro Andheri" service="Haircut + Beard" time="Today, 4:30 PM" barber="Barber Raj" type="Priority" />
          <BookingCard salon="Elite Cuts & Spa"  service="Haircut"          time="Sat, 11:00 AM"  barber="Barber Aryan" type="Slot" />
        </div>

        {/* Loyalty card */}
        <div style={{
          background:`linear-gradient(135deg,#1c1408,#1a1a1a)`,
          border:`1px solid ${C.gold}33`,
          borderRadius:16, padding:"18px 20px", marginBottom:24,
          boxShadow:`inset 0 1px 0 ${C.gold}18`,
        }}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:14 }}>
            <div>
              <div style={{ fontSize:10, color:C.gold, fontFamily:"sans-serif",
                fontWeight:800, letterSpacing:"0.15em", textTransform:"uppercase", marginBottom:5 }}>
                Loyalty Balance
              </div>
              <div style={{ fontSize:26, fontWeight:700, color:C.cream, fontFamily:"Georgia,serif" }}>
                175 <span style={{ fontSize:14, color:C.muted }}>pts</span>
              </div>
            </div>
            <div style={{ fontSize:32 }}>💰</div>
          </div>
          {/* Progress bar toward next reward */}
          <div style={{ marginBottom:8 }}>
            <div style={{ height:6, background:C.border, borderRadius:6 }}>
              <div style={{ height:"100%", width:"70%",
                background:`linear-gradient(90deg,${C.gold},${C.goldLt})`,
                borderRadius:6, boxShadow:`0 0 8px ${C.goldGlow}` }}/>
            </div>
          </div>
          <div style={{ display:"flex", justifyContent:"space-between" }}>
            <span style={{ fontSize:11, color:C.muted, fontFamily:"sans-serif" }}>175 / 250 pts to next reward</span>
            <span style={{ fontSize:11, color:C.gold, fontFamily:"sans-serif", fontWeight:700 }}>Redeem →</span>
          </div>
        </div>

        {/* Recent activity */}
        <div>
          <span style={{ fontSize:10, color:C.gold, fontFamily:"sans-serif",
            fontWeight:800, letterSpacing:"0.15em", textTransform:"uppercase", display:"block", marginBottom:14 }}>
            Recent Visits
          </span>
          {[
            { salon:"BarberPro Andheri", date:"12 Apr 2025", service:"Haircut + Beard", amount:"₹350" },
            { salon:"Elite Cuts & Spa",  date:"22 Mar 2025", service:"Haircut",          amount:"₹200" },
            { salon:"BarberPro Bandra",  date:"01 Mar 2025", service:"Combo",            amount:"₹450" },
          ].map((v,i) => (
            <div key={i} style={{
              background:C.card, border:`1px solid ${C.border}`,
              borderRadius:13, padding:"14px 16px",
              display:"flex", alignItems:"center", justifyContent:"space-between",
              marginBottom:9,
            }}>
              <div style={{ display:"flex", gap:12, alignItems:"center" }}>
                <div style={{ width:36, height:36, borderRadius:10,
                  background:`C.goldDim, border:1px solid ${C.gold}30`,
                  display:"flex", alignItems:"center", justifyContent:"center", fontSize:16 }}>✂️</div>
                <div>
                  <div style={{ fontSize:13, fontWeight:600, color:C.cream,
                    fontFamily:"Georgia,serif", marginBottom:3 }}>{v.salon}</div>
                  <div style={{ fontSize:11, color:C.muted, fontFamily:"sans-serif" }}>{v.date} · {v.service}</div>
                </div>
              </div>
              <div style={{ fontSize:14, fontWeight:700, color:C.goldLt,
                fontFamily:"sans-serif" }}>{v.amount}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Toast stack (top-right) ── */}
      <div style={{ position:"fixed", top:16, right:16, width:320, zIndex:800 }}>
        <div style={{ position:"relative", height: visible.length > 0 ? 120 + visible.length * 8 : 0 }}>
          {visible.map((t,i) => (
            <Toast
              key={t.id}
              notif={t}
              onDismiss={dismiss}
              stackIndex={i}
              totalVisible={visible.length}
            />
          ))}
        </div>
      </div>

      {/* ── Inbox ── */}
      {showInbox && (
        <Inbox
          history={history}
          onClose={() => setShowInbox(false)}
          onMarkAll={markAll}
          onClear={clearAll}
        />
      )}
    </div>
  );
}