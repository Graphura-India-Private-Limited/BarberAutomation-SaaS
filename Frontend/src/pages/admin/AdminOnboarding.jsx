import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { 
  LayoutDashboard, Store, Users, UserSquare2, UserPlus2, 
  CalendarCheck, Scissors, CreditCard, Star, Activity, Settings, LogOut 
} from "lucide-react";  

const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const getToken = () => localStorage.getItem("token");

/* ══ COLORS ══ */
const C = {
  bg:"#F7F5F2", bg2:"#FFFFFF", card:"#FFFFFF", sidebar:"#1A1410",
  gold:"#C5A059", goldD:"#8B6A2E", ink:"#1A1410", muted:"#8D7B68",
  border:"#EAE4DC", green:"#059669", red:"#DC2626", blue:"#2563EB",
  amber:"#D97706", purple:"#7C3AED",
};

/* ══ HELPERS ══ */
const Badge = ({ label, color }) => (
  <span style={{ padding:"3px 10px", borderRadius:20, fontSize:10, fontWeight:700, textTransform:"uppercase", letterSpacing:.8, background:`${color}15`, color, border:`1px solid ${color}30`, fontFamily:"'Plus Jakarta Sans',sans-serif" }}>
    {label}
  </span>
);

const Avatar = ({ name, size=32, color=C.gold, bg="#FEF3DC" }) => (
  <div style={{ width:size, height:size, borderRadius:size/3, background:bg, display:"flex", alignItems:"center", justifyContent:"center", fontSize:size*.38, fontWeight:800, color, flexShrink:0, border:`1px solid ${color}30`, fontFamily:"'Plus Jakarta Sans',sans-serif" }}>
    {name?.[0]?.toUpperCase()||"?"}
  </div>
);

const StatCard = ({ label, value, color, sub }) => (
  <div style={{ background:C.card, borderRadius:14, padding:"18px 20px", border:`1px solid ${C.border}`, boxShadow:"0 1px 4px rgba(0,0,0,.04)" }}>
    <div style={{ fontSize:11, color:C.muted, fontWeight:800, textTransform:"uppercase", letterSpacing:1.2, marginBottom:8, fontFamily:"'Plus Jakarta Sans',sans-serif" }}>{label}</div>
    <div style={{ fontSize:26, fontWeight:900, color:C.ink, fontFamily:"'Playfair Display',serif", lineHeight:1 }}>{value}</div>
    {sub && <div style={{ fontSize:11, color, fontWeight:600, marginTop:5, fontFamily:"'Plus Jakarta Sans',sans-serif" }}>{sub}</div>}
  </div>
);

const TH = ({ children }) => (
  <th style={{ padding:"10px 16px", textAlign:"left", fontSize:9, fontWeight:800, color:C.muted, textTransform:"uppercase", letterSpacing:1.2, whiteSpace:"nowrap", background:"#FAFAF8", borderBottom:`1px solid ${C.border}`, fontFamily:"'Plus Jakarta Sans',sans-serif" }}>
    {children}
  </th>
);
const TD = ({ children, style={} }) => (
  <td style={{ padding:"12px 16px", borderBottom:`1px solid ${C.border}`, fontFamily:"'Plus Jakarta Sans',sans-serif", ...style }}>{children}</td>
);

const NAV = [
  { k:"dashboard",    label:"Dashboard"       },
  { k:"salons",       label:"Salon Management"},
  { k:"customers",    label:"Customers"       },
  { k:"barbers",      label:"Barbers"         },
  { k:"addbarber",    label:"Add Barber"      },
  { k:"appointments", label:"Appointments"    },
  { k:"services",     label:"Services"        },
  { k:"payments",     label:"Payments"        },
  { k:"reviews",      label:"Reviews"         },
  { k:"live",         label:"Live Monitoring" },
  { k:"settings",     label:"Settings"        },
];

const salonImg = (i) => ["https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=400&q=80","https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=400&q=80","https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=400&q=80","https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=400&q=80"][i%4];
const barberImg = (i) => ["https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=200&q=80","https://images.unsplash.com/photo-1605497788044-5a32c7078486?w=200&q=80","https://images.unsplash.com/photo-1621605815841-aa33c5447a33?w=200&q=80"][i%3];

const bStatus  = s => s==="available"?C.green:s==="busy"?C.amber:s==="break"?C.blue:"#9CA3AF";
const bkStatus = s => s==="completed"?C.green:s==="pending"?C.amber:s==="cancelled"?C.red:C.blue;
const pyStatus = s => s==="captured"?C.green:s==="refunded"?C.blue:s==="pending"?C.amber:C.red;

export default function AdminOnboarding() {
  const navigate  = useNavigate();
  const photoRef  = useRef();
  const docRef    = useRef();

  const [tab,        setTab]       = useState("dashboard");
  const [salons,     setSalons]    = useState([]);
  const [stats,      setStats]     = useState(null);
  const [loading,    setLoading]   = useState(true);
  const [customers,  setCustomers] = useState([]);
  const [barbers,    setBarbers]   = useState([]);
  const [bookings,   setBookings]  = useState([]);
  const [services,   setServices]  = useState([]);
  const [reviews,    setReviews]   = useState([]);
  const [payments,   setPayments]  = useState([]);
  const [modal,      setModal]     = useState(null);
  const [toast,      setToast]     = useState(null);
  const [search,     setSearch]    = useState("");
  const [salonTab,   setSalonTab]  = useState("requests");
  const [reason,     setReason]    = useState("");
  const [busy,       setBusy]      = useState(false);
  const [addedBarbers, setAddedBarbers] = useState([]);

  const [newBarber, setNewBarber] = useState({
    name:"", mobile:"", password:"", specialization:"", experience:"", salon_id:"",
    email:"", photo:null, photoPreview:null, document:null, documentName:"",
  });
  const [newService, setNewService] = useState({ name:"", category:"men", price:"", duration:"30", salon_id:"" });

  useEffect(() => { fetchAll(); }, []);

  const h = () => ({ Authorization:`Bearer ${getToken()}`, "Content-Type":"application/json" });

  const fetchAll = async () => {
    setLoading(true);
    try {
      const results = await Promise.allSettled([
        fetch(`${API}/admin/salons`,    { headers:h() }).then(r=>r.json()),
        fetch(`${API}/admin/stats`,     { headers:h() }).then(r=>r.json()),
        fetch(`${API}/admin/customers`, { headers:h() }).then(r=>r.json()),
        fetch(`${API}/admin/barbers`,   { headers:h() }).then(r=>r.json()),
        fetch(`${API}/admin/bookings`,  { headers:h() }).then(r=>r.json()),
        fetch(`${API}/admin/services`,  { headers:h() }).then(r=>r.json()),
        fetch(`${API}/admin/payments`,  { headers:h() }).then(r=>r.json()),
        fetch(`${API}/admin/reviews`,   { headers:h() }).then(r=>r.json()),
      ]);

      const [salonsR, statsR, custR, barbersR, bookR, servR, payR, revR] = results.map(r => r.status==="fulfilled" ? r.value : null);

      if (salonsR?.success)   setSalons(salonsR.salons||[]);
      if (statsR?.success)    setStats(statsR.stats);
      if (custR?.success)     setCustomers(custR.customers||[]);
      if (barbersR?.success)  setBarbers(barbersR.barbers||[]);
      if (bookR?.success)     setBookings(bookR.bookings||[]);
      if (servR?.success)     setServices(servR.services||[]);
      if (payR?.success)      setPayments(payR.payments||[]);
      if (revR?.success)      setReviews(revR.reviews||[]);
    } catch(e) { pop("Failed to load data","error"); }
    finally { setLoading(false); }
  };

  const updateSalonStatus = async (id, status, rejection_reason="") => {
    setBusy(true);
    try {
      const r = await fetch(`${API}/admin/salon/${id}/status`, {
        method:"PUT", headers:h(), body: JSON.stringify({ status, rejection_reason }),
      });
      const d = await r.json();
      if (d.success) {
        setSalons(p => p.map(s => s._id===id ? d.salon || {...s, status, rejection_reason} : s));
        pop(`Salon ${status}!`, status==="approved"?"success":"error");
        setModal(null); setReason("");
      } else pop(d.message||"Failed","error");
    } catch { pop("Server error","error"); }
    finally { setBusy(false); }
  };

  const blockCustomer = async (id, blocked) => {
    try {
      const r = await fetch(`${API}/admin/customer/${id}/block`, {
        method:"PUT", headers:h(), body: JSON.stringify({ blocked }),
      });
      const d = await r.json();
      if (d.success) {
        setCustomers(p => p.map(c => c._id===id ? {...c, blocked} : c));
        pop(`Customer ${blocked?"blocked":"unblocked"}!`);
      } else pop(d.message||"Failed","error");
    } catch { pop("Server error","error"); }
  };

  const changeBarberStatus = async (id, status) => {
    try {
      const r = await fetch(`${API}/admin/barber/${id}/status`, {
        method:"PUT", headers:h(), body: JSON.stringify({ status }),
      });
      const d = await r.json();
      if (d.success) {
        setBarbers(p => p.map(b => b._id===id ? {...b, status} : b));
        pop(`Barber set to ${status}!`);
      } else pop(d.message||"Failed","error");
    } catch { pop("Server error","error"); }
  };

  const removeBarber = async (id) => {
    try {
      const r = await fetch(`${API}/admin/barber/${id}`, { method:"DELETE", headers:h() });
      const d = await r.json();
      if (d.success) { setBarbers(p => p.filter(b => b._id!==id)); pop("Barber removed!"); }
      else pop(d.message||"Failed","error");
    } catch { pop("Server error","error"); }
  };

  const addBarber = async () => {
    if (!newBarber.name||!newBarber.mobile||!newBarber.password) { pop("Name, mobile and password required","error"); return; }
    setBusy(true);
    try {
      const salonId = newBarber.salon_id || salons.find(s=>s.status==="approved")?._id;
      if (!salonId) { pop("No approved salon found! Approve a salon first.","error"); setBusy(false); return; }

      const r = await fetch(`${API}/admin/barber`, {
        method:"POST", headers:h(),
        body: JSON.stringify({
          name: newBarber.name, mobile: newBarber.mobile, password: newBarber.password,
          specialization: newBarber.specialization, experience: Number(newBarber.experience)||0,
          salon_id: salonId,
        }),
      });
      const d = await r.json();
      if (d.success) {
        pop("Barber added successfully!");
        setAddedBarbers(prev => [...prev, {
          name: newBarber.name,
          mobile: newBarber.mobile,
          password: newBarber.password,
          specialization: newBarber.specialization,
          salon: salons.find(s=>s._id===salonId)?.salon_name || "—",
          addedAt: new Date().toLocaleString(),
        }]);
        setNewBarber({ name:"", mobile:"", password:"", specialization:"", experience:"", salon_id:"", email:"", photo:null, photoPreview:null, document:null, documentName:"" });
        const br = await fetch(`${API}/admin/barbers`, { headers:h() }).then(r=>r.json());
        if (br.success) setBarbers(br.barbers||[]);
      } else pop(d.message||"Failed","error");
    } catch { pop("Server error","error"); }
    finally { setBusy(false); }
  };

  const changeBookingStatus = async (id, status) => {
    try {
      const r = await fetch(`${API}/admin/booking/${id}/status`, {
        method:"PUT", headers:h(), body: JSON.stringify({ status }),
      });
      const d = await r.json();
      if (d.success) {
        setBookings(p => p.map(b => b._id===id ? {...b, status} : b));
        pop(`Booking ${status}!`);
      } else pop(d.message||"Failed","error");
    } catch { pop("Server error","error"); }
  };

  const deleteReview = async (id) => {
    try {
      const r = await fetch(`${API}/admin/review/${id}`, { method:"DELETE", headers:h() });
      const d = await r.json();
      if (d.success) { setReviews(p => p.filter(x => x._id!==id)); pop("Review deleted!"); }
      else pop(d.message||"Failed","error");
    } catch { pop("Server error","error"); }
  };

  const addService = async () => {
    if (!newService.name||!newService.price) { pop("Name and price required","error"); return; }
    const salonId = newService.salon_id || salons.find(s=>s.status==="approved")?._id;
    if (!salonId) { pop("No approved salon found!","error"); return; }
    try {
      const r = await fetch(`${API}/admin/service`, {
        method:"POST", headers:h(),
        body: JSON.stringify({ ...newService, salon_id:salonId, price:Number(newService.price), duration:Number(newService.duration) }),
      });
      const d = await r.json();
      if (d.success) {
        setServices(p => [...p, d.service]);
        setNewService({ name:"", category:"men", price:"", duration:"30", salon_id:"" });
        pop("Service added!");
      } else pop(d.message||"Failed","error");
    } catch { pop("Server error","error"); }
  };

  const toggleService = async (id, is_active) => {
    try {
      const r = await fetch(`${API}/admin/service/${id}`, {
        method:"PUT", headers:h(), body: JSON.stringify({ is_active }),
      });
      const d = await r.json();
      if (d.success) { setServices(p => p.map(s => s._id===id ? {...s, is_active} : s)); pop(`Service ${is_active?"enabled":"disabled"}!`); }
    } catch { pop("Server error","error"); }
  };

  const deleteService = async (id) => {
    try {
      const r = await fetch(`${API}/admin/service/${id}`, { method:"DELETE", headers:h() });
      const d = await r.json();
      if (d.success) { setServices(p => p.filter(s => s._id!==id)); pop("Service deleted!"); }
    } catch { pop("Server error","error"); }
  };

  const pop = (msg, type="success") => { setToast({msg,type}); setTimeout(()=>setToast(null),3000); };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setNewBarber(p=>({...p, photo:file, photoPreview:ev.target.result}));
    reader.readAsDataURL(file);
  };
  const handleDocChange = (e) => {
    const file = e.target.files[0]; if (!file) return;
    setNewBarber(p=>({...p, document:file, documentName:file.name}));
  };

  const SALONS_FILTERED = salons.filter(s =>
    salonTab==="requests" ? s.status==="pending" :
    salonTab==="approved" ? s.status==="approved" : s.status==="rejected"
  );

  const pendingBookings = bookings.filter(b=>b.status==="pending").length;
  const totalRevenue = payments.filter(p=>p.status==="captured").reduce((a,b)=>a+(b.amount||0),0);

  return (
    <div style={{ display:"flex", minHeight:"100vh", background:C.bg, color:C.ink, fontFamily:"'Plus Jakarta Sans','Segoe UI',sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        ::-webkit-scrollbar{width:3px}::-webkit-scrollbar-thumb{background:#DDD5CC;border-radius:4px}
        .nb{background:none;border:none;cursor:pointer;font-family:'Plus Jakarta Sans',sans-serif}
        .nav-i{display:flex;align-items:center;gap:9px;padding:9px 12px;border-radius:8px;cursor:pointer;font-size:12px;font-weight:600;color:rgba(255,255,255,0.45);width:100%;border:none;background:transparent;transition:all .18s;text-align:left;font-family:'Plus Jakarta Sans',sans-serif}
        .nav-i:hover{background:rgba(255,255,255,0.07);color:rgba(255,255,255,0.9)}
        .nav-i.on{background:rgba(197,160,89,0.18);color:#C5A059;border-left:2px solid #C5A059;padding-left:10px}
        .tr:hover td{background:#FAFAF8}
        .inp{background:#FAFAF8;border:1.5px solid #EAE4DC;border-radius:9px;padding:10px 13px;font-size:13px;color:#1A1410;outline:none;font-family:'Plus Jakarta Sans',sans-serif;width:100%;transition:border .2s}
        .inp:focus{border-color:#C5A059;background:#fff}
        .inp::placeholder{color:#A09080}
        select.inp option{background:#fff;color:#1A1410}
        .btn{display:inline-flex;align-items:center;gap:5px;padding:8px 14px;border-radius:8px;font-size:11px;font-weight:800;cursor:pointer;border:none;font-family:'Plus Jakarta Sans',sans-serif;letter-spacing:.8px;text-transform:uppercase;transition:all .18s}
        .btn:hover{filter:brightness(.95);transform:translateY(-1px)}
        .btn:disabled{opacity:.4;cursor:not-allowed;transform:none;filter:none}
        .upload-box{border:2px dashed #EAE4DC;border-radius:12px;padding:20px;text-align:center;cursor:pointer;transition:border .2s;background:#FAFAF8}
        .upload-box:hover{border-color:#C5A059;background:#FEF9F0}
        @keyframes fu{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}
        @keyframes sp{to{transform:rotate(360deg)}}
        @keyframes sl{from{opacity:0;transform:translateX(16px)}to{opacity:1;transform:none}}
      `}</style>

      {/* ════ SIDEBAR ════ */}
      <aside style={{ 
        width: 240, 
        background: "#FFFFFF", 
        display: "flex", 
        flexDirection: "column", 
        flexShrink: 0, 
        position: "sticky", 
        top: 0, 
        height: "100vh", 
        overflowY: "auto",
        borderRight: "1px solid #EADBCE"
      }}>
        {/* Brand Header */}
        <div style={{ padding: "24px 20px 20px", borderBottom: "1px solid #FAF6F0" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ 
              width: 36, height: 36, borderRadius: 10, 
              background: "linear-gradient(135deg, #D97706, #B45309)", 
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 4px 10px -2px rgba(217,119,6,0.2)"
            }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/>
                <line x1="20" y1="4" x2="8.12" y2="15.88"/><line x1="14.47" y1="14.48" x2="20" y2="20"/><line x1="8.12" y1="8.12" x2="12" y2="12"/>
              </svg>
            </div>
            <div>
              <div style={{ fontSize: 16, fontWeight: 800, color: "#1C1917", fontFamily: "'Plus Jakarta Sans', sans-serif", letterSpacing: "-0.02em" }}>Barber Pro</div>
              <div style={{ fontSize: 9, color: "#B45309", fontWeight: 800, letterSpacing: "1.5px", textTransform: "uppercase", marginTop: 1, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Admin Console</div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav style={{ padding: "16px 12px", flex: 1, display: "flex", flexDirection: "column", gap: 4 }}>
          {NAV.map((n, i) => {
            const isActive = tab === n.k;
            const IconComponent = {
              dashboard: LayoutDashboard, salons: Store, customers: Users,
              barbers: UserSquare2, addbarber: UserPlus2, appointments: CalendarCheck,
              services: Scissors, payments: CreditCard, reviews: Star,
              live: Activity, settings: Settings
            }[n.k] || LayoutDashboard;

            return (
              <React.Fragment key={n.k}>
                {(i === 5 || i === 8 || i === 10) && (
                  <div style={{ height: 1, background: "#EADBCE", margin: "8px 10px", opacity: 0.5 }} />
                )}
                <button 
                  onClick={() => setTab(n.k)}
                  style={{
                    display: "flex", alignItems: "center", gap: 12, width: "100%",
                    padding: "10px 14px", borderRadius: "12px",
                    background: isActive ? "#FEF9EE" : "transparent",
                    border: "none",
                    borderLeft: isActive ? "3px solid #D97706" : "3px solid transparent",
                    color: isActive ? "#B45309" : "#78716C",
                    fontSize: "12px", fontWeight: isActive ? 800 : 500,
                    textAlign: "left", cursor: "pointer", transition: "all 0.2s ease",
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    letterSpacing: isActive ? "0.01em" : "normal",
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) { e.currentTarget.style.background = "#FAF6F0"; e.currentTarget.style.color = "#1C1917"; }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#78716C"; }
                  }}
                >
                  <IconComponent size={16} strokeWidth={isActive ? 2.5 : 2} style={{ color: isActive ? "#D97706" : "#A89E95", flexShrink: 0 }} />
                  <span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{n.label}</span>
                  {n.k === "appointments" && pendingBookings > 0 && (
                    <span style={{ background: "#EF4444", color: "#ffffff", borderRadius: "8px", padding: "2px 6px", fontSize: "10px", fontWeight: 800, lineHeight: 1, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                      {pendingBookings}
                    </span>
                  )}
                </button>
              </React.Fragment>
            );
          })}
        </nav>

        {/* Footer */}
        <div style={{ padding: "14px 12px", borderTop: "1px solid #FAF6F0", background: "#FDFBF7" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", background: "#FFFFFF", borderRadius: "12px", marginBottom: 8, border: "1px solid #EADBCE" }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#22C55E" }} />
            <div>
              <div style={{ fontSize: "12px", fontWeight: 800, color: "#1C1917", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Admin Hub</div>
              <div style={{ fontSize: "10px", color: "#78716C", marginTop: 1, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Barber Pro System</div>
            </div>
          </div>
          <button 
            onClick={() => { localStorage.clear(); navigate("/login"); }} 
            style={{ display: "flex", alignItems: "center", gap: 12, width: "100%", padding: "10px 14px", borderRadius: "12px", background: "transparent", border: "none", color: "#EF4444", fontSize: "12px", fontWeight: 800, textAlign: "left", cursor: "pointer", transition: "all 0.2s ease", fontFamily: "'Plus Jakarta Sans', sans-serif", textTransform: "uppercase", letterSpacing: "0.05em" }}
            onMouseEnter={(e) => e.currentTarget.style.background = "#FEF2F2"}
            onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
          >
            <LogOut size={16} strokeWidth={2.5} style={{ color: "#EF4444" }} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* ════ MAIN ════ */}
      <div style={{ flex:1, display:"flex", flexDirection:"column", minWidth:0 }}>
        <header style={{ background:C.bg2, borderBottom:`1px solid ${C.border}`, padding:"0 24px", height:54, display:"flex", alignItems:"center", justifyContent:"space-between", flexShrink:0, position:"sticky", top:0, zIndex:20, boxShadow:"0 1px 4px rgba(0,0,0,.04)" }}>
          <h1 style={{ fontSize:15, fontWeight:800, color:C.ink, fontFamily:"'Plus Jakarta Sans',sans-serif", textTransform:"uppercase", letterSpacing:"0.05em" }}>
            {NAV.find(n=>n.k===tab)?.label}
          </h1>
          <div style={{ display:"flex", gap:8, alignItems:"center" }}>
            <span style={{ fontSize:11, color:C.muted, fontFamily:"'Plus Jakarta Sans',sans-serif", fontWeight:500 }}>{new Date().toLocaleDateString("en-IN",{weekday:"short",day:"numeric",month:"short",year:"numeric"})}</span>
            <button onClick={fetchAll} className="btn" style={{ background:`${C.gold}18`, color:C.gold, border:`1px solid ${C.gold}30`, padding:"6px 12px" }}>
              {loading ? "Loading..." : "Refresh"}
            </button>
          </div>
        </header>

        <main style={{ flex:1, overflowY:"auto", padding:"22px 24px 60px" }}>

          {/* STAT CARDS */}
          <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12, marginBottom:22 }}>
            <StatCard label="Total Customers" value={loading?"—":stats?.customers??customers.length} sub="Registered users" color={C.blue}/>
            <StatCard label="Active Salons"   value={loading?"—":stats?.salons??salons.filter(s=>s.status==="approved").length} sub="Approved & live" color={C.green}/>
            <StatCard label="Total Bookings"  value={loading?"—":stats?.bookings??bookings.length} sub={`${pendingBookings} pending`} color={C.purple}/>
            <StatCard label="Revenue"         value={loading?"—":`₹${((stats?.revenue||totalRevenue)/100).toLocaleString("en-IN")}`} sub="Total collected" color={C.gold}/>
          </div>

          {/* ══ DASHBOARD ══ */}
          {tab==="dashboard" && (
            <div style={{ animation:"fu .4s ease" }}>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>

                {/* Recent Bookings */}
                <div style={{ background:C.card, borderRadius:14, border:`1px solid ${C.border}`, overflow:"hidden" }}>
                  <div style={{ padding:"14px 18px", borderBottom:`1px solid ${C.border}`, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                    <span style={{ fontSize:13, fontWeight:800, color:C.ink, fontFamily:"'Plus Jakarta Sans',sans-serif", textTransform:"uppercase", letterSpacing:"0.05em" }}>Recent Bookings</span>
                    <button className="nb" onClick={()=>setTab("appointments")} style={{ fontSize:11, color:C.gold, fontWeight:800, fontFamily:"'Plus Jakarta Sans',sans-serif", textTransform:"uppercase", letterSpacing:"0.05em" }}>View All</button>
                  </div>
                  {loading ? <div style={{ padding:20, textAlign:"center", color:C.muted, fontSize:12, fontFamily:"'Plus Jakarta Sans',sans-serif" }}>Loading...</div>
                  : bookings.length===0 ? <div style={{ padding:20, textAlign:"center", color:C.muted, fontSize:12, fontFamily:"'Plus Jakarta Sans',sans-serif" }}>No bookings yet</div>
                  : bookings.slice(0,4).map((b,i) => (
                    <div key={b._id} style={{ padding:"11px 18px", borderBottom:i<3?`1px solid ${C.border}`:"none", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                      <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                        <Avatar name={b.customer_id?.name||"C"} size={30} color={C.blue} bg="#EFF6FF"/>
                        <div>
                          <div style={{ fontSize:12, fontWeight:700, color:C.ink, fontFamily:"'Plus Jakarta Sans',sans-serif" }}>{b.customer_id?.name||"Customer"}</div>
                          <div style={{ fontSize:10, color:C.muted, fontFamily:"'Plus Jakarta Sans',sans-serif" }}>{b.services?.[0]?.service_name||"Service"} · {b.salon_id?.salon_name||"Salon"}</div>
                        </div>
                      </div>
                      <div style={{ textAlign:"right" }}>
                        <div style={{ fontSize:12, fontWeight:700, color:C.ink, fontFamily:"'Plus Jakarta Sans',sans-serif" }}>₹{b.total_amount}</div>
                        <Badge label={b.status} color={bkStatus(b.status)}/>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Barber Status */}
                <div style={{ background:C.card, borderRadius:14, border:`1px solid ${C.border}`, overflow:"hidden" }}>
                  <div style={{ padding:"14px 18px", borderBottom:`1px solid ${C.border}`, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                    <span style={{ fontSize:13, fontWeight:800, color:C.ink, fontFamily:"'Plus Jakarta Sans',sans-serif", textTransform:"uppercase", letterSpacing:"0.05em" }}>Barber Status</span>
                    <button className="nb" onClick={()=>setTab("live")} style={{ fontSize:11, color:C.gold, fontWeight:800, fontFamily:"'Plus Jakarta Sans',sans-serif", textTransform:"uppercase", letterSpacing:"0.05em" }}>Live View</button>
                  </div>
                  {loading ? <div style={{ padding:20, textAlign:"center", color:C.muted, fontSize:12, fontFamily:"'Plus Jakarta Sans',sans-serif" }}>Loading...</div>
                  : barbers.length===0 ? <div style={{ padding:20, textAlign:"center", color:C.muted, fontSize:12, fontFamily:"'Plus Jakarta Sans',sans-serif" }}>No barbers added yet</div>
                  : barbers.slice(0,3).map((b,i) => (
                    <div key={b._id} style={{ padding:"11px 18px", borderBottom:i<2?`1px solid ${C.border}`:"none", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                      <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                        <img src={barberImg(i)} alt={b.name} style={{ width:34, height:34, borderRadius:8, objectFit:"cover", border:`1px solid ${C.border}` }}/>
                        <div>
                          <div style={{ fontSize:12, fontWeight:700, color:C.ink, fontFamily:"'Plus Jakarta Sans',sans-serif" }}>{b.name}</div>
                          <div style={{ fontSize:10, color:C.muted, fontFamily:"'Plus Jakarta Sans',sans-serif" }}>{b.specialization} · {b.salon_id?.salon_name||"—"}</div>
                        </div>
                      </div>
                      <Badge label={b.status} color={bStatus(b.status)}/>
                    </div>
                  ))}
                </div>

                {/* Pending Salon Requests */}
                <div style={{ background:C.card, borderRadius:14, border:`1px solid ${C.border}`, overflow:"hidden" }}>
                  <div style={{ padding:"14px 18px", borderBottom:`1px solid ${C.border}`, display:"flex", justifyContent:"space-between" }}>
                    <span style={{ fontSize:13, fontWeight:800, color:C.ink, fontFamily:"'Plus Jakarta Sans',sans-serif", textTransform:"uppercase", letterSpacing:"0.05em" }}>Pending Salon Requests</span>
                    <button className="nb" onClick={()=>setTab("salons")} style={{ fontSize:11, color:C.gold, fontWeight:800, fontFamily:"'Plus Jakarta Sans',sans-serif", textTransform:"uppercase", letterSpacing:"0.05em" }}>View All</button>
                  </div>
                  {salons.filter(s=>s.status==="pending").length===0
                    ? <div style={{ padding:20, textAlign:"center", color:C.muted, fontSize:12, fontFamily:"'Plus Jakarta Sans',sans-serif" }}>No pending requests</div>
                    : salons.filter(s=>s.status==="pending").slice(0,3).map((s,i) => (
                    <div key={s._id} style={{ padding:"11px 18px", borderBottom:`1px solid ${C.border}`, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                      <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                        <img src={salonImg(i)} alt={s.salon_name} style={{ width:36, height:36, borderRadius:8, objectFit:"cover" }}/>
                        <div>
                          <div style={{ fontSize:12, fontWeight:700, color:C.ink, fontFamily:"'Plus Jakarta Sans',sans-serif" }}>{s.salon_name}</div>
                          <div style={{ fontSize:10, color:C.muted, fontFamily:"'Plus Jakarta Sans',sans-serif" }}>{s.owner_name} · {s.mobile}</div>
                        </div>
                      </div>
                      <div style={{ display:"flex", gap:6 }}>
                        <button className="btn" onClick={()=>updateSalonStatus(s._id,"approved")} style={{ background:`${C.green}15`, color:C.green, border:`1px solid ${C.green}30`, padding:"5px 10px" }}>Approve</button>
                        <button className="btn" onClick={()=>setModal({type:"reject",salon:s})} style={{ background:`${C.red}10`, color:C.red, border:`1px solid ${C.red}30`, padding:"5px 10px" }}>Reject</button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Added Barbers Credentials */}
                <div style={{ background:C.card, borderRadius:14, border:`1px solid ${C.border}`, overflow:"hidden" }}>
                  <div style={{ padding:"14px 18px", borderBottom:`1px solid ${C.border}` }}>
                    <span style={{ fontSize:13, fontWeight:800, color:C.ink, fontFamily:"'Plus Jakarta Sans',sans-serif", textTransform:"uppercase", letterSpacing:"0.05em" }}>Barber Credentials (This Session)</span>
                  </div>
                  {addedBarbers.length===0
                    ? <div style={{ padding:20, textAlign:"center", color:C.muted, fontSize:12, fontFamily:"'Plus Jakarta Sans',sans-serif" }}>No barbers added this session</div>
                    : addedBarbers.map((b,i) => (
                    <div key={i} style={{ padding:"11px 18px", borderBottom:`1px solid ${C.border}` }}>
                      <div style={{ fontSize:12, fontWeight:700, color:C.ink, marginBottom:4, fontFamily:"'Plus Jakarta Sans',sans-serif" }}>{b.name}</div>
                      <div style={{ display:"flex", gap:12, flexWrap:"wrap" }}>
                        <span style={{ fontSize:10, color:C.muted, fontFamily:"'Plus Jakarta Sans',sans-serif" }}>Mobile: <strong style={{ color:C.ink }}>{b.mobile}</strong></span>
                        <span style={{ fontSize:10, color:C.muted, fontFamily:"'Plus Jakarta Sans',sans-serif" }}>Pass: <strong style={{ color:C.red }}>{b.password}</strong></span>
                        <span style={{ fontSize:10, color:C.muted, fontFamily:"'Plus Jakarta Sans',sans-serif" }}>Salon: <strong style={{ color:C.gold }}>{b.salon}</strong></span>
                      </div>
                      <div style={{ fontSize:9, color:C.muted, marginTop:2, fontFamily:"'Plus Jakarta Sans',sans-serif" }}>Added: {b.addedAt}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ══ SALON MANAGEMENT ══ */}
          {tab==="salons" && (
            <div style={{ animation:"fu .4s ease" }}>
              <div style={{ display:"flex", gap:6, marginBottom:16 }}>
                {["requests","approved","rejected"].map(t=>(
                  <button key={t} className="btn" onClick={()=>setSalonTab(t)}
                    style={{ background:salonTab===t?C.gold:"#fff", color:salonTab===t?"#fff":C.muted, border:`1px solid ${salonTab===t?C.gold:C.border}`, padding:"8px 16px" }}>
                    {t} ({salons.filter(s=>s.status===(t==="requests"?"pending":t)).length})
                  </button>
                ))}
              </div>
              {loading ? (
                <div style={{ padding:60, textAlign:"center" }}>
                  <div style={{ width:24, height:24, border:`2px solid ${C.border}`, borderTopColor:C.gold, borderRadius:"50%", animation:"sp 1s linear infinite", margin:"0 auto" }}/>
                </div>
              ) : SALONS_FILTERED.length===0 ? (
                <div style={{ background:C.card, borderRadius:14, border:`1px solid ${C.border}`, padding:60, textAlign:"center", color:C.muted, fontFamily:"'Plus Jakarta Sans',sans-serif" }}>No {salonTab} salons</div>
              ) : (
                <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))", gap:14 }}>
                  {SALONS_FILTERED.map((s,i)=>(
                    <div key={s._id} style={{ background:C.card, borderRadius:14, border:`1px solid ${C.border}`, overflow:"hidden" }}>
                      <div style={{ height:140, overflow:"hidden", position:"relative" }}>
                        <img src={s.images?.[0] || salonImg(i)} alt={s.salon_name} style={{ width:"100%", height:"100%", objectFit:"cover" }}/>
                        <div style={{ position:"absolute", inset:0, background:"linear-gradient(to top,rgba(0,0,0,.5),transparent)" }}/>
                        <div style={{ position:"absolute", bottom:10, left:12 }}>
                          <div style={{ fontSize:14, fontWeight:800, color:"#fff", fontFamily:"'Playfair Display',serif" }}>{s.salon_name}</div>
                        </div>
                        <div style={{ position:"absolute", top:10, right:10 }}>
                          <Badge label={s.status} color={s.status==="approved"?C.green:s.status==="rejected"?C.red:C.amber}/>
                        </div>
                      </div>
                      <div style={{ padding:"14px 16px" }}>
                        <div style={{ fontSize:12, fontWeight:700, color:C.ink, fontFamily:"'Plus Jakarta Sans',sans-serif" }}>{s.owner_name}</div>
                        <div style={{ fontSize:11, color:C.muted, marginBottom:6, fontFamily:"'Plus Jakarta Sans',sans-serif" }}>{s.mobile} · {s.address||"No address"}</div>
                        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:6, marginBottom:10 }}>
                          <div style={{ background:"#F7F5F2", borderRadius:8, padding:"7px 8px" }}>
                            <div style={{ fontSize:9, color:C.muted, fontWeight:800, textTransform:"uppercase", letterSpacing:"0.08em", fontFamily:"'Plus Jakarta Sans',sans-serif" }}>Pricing</div>
                            <div style={{ fontSize:12, color:C.ink, fontWeight:800, fontFamily:"'Plus Jakarta Sans',sans-serif" }}>Rs. {s.basic_pricing || 0}+</div>
                          </div>
                          <div style={{ background:"#F7F5F2", borderRadius:8, padding:"7px 8px" }}>
                            <div style={{ fontSize:9, color:C.muted, fontWeight:800, textTransform:"uppercase", letterSpacing:"0.08em", fontFamily:"'Plus Jakarta Sans',sans-serif" }}>Barbers</div>
                            <div style={{ fontSize:12, color:C.ink, fontWeight:800, fontFamily:"'Plus Jakarta Sans',sans-serif" }}>{s.number_of_barbers || 0}</div>
                          </div>
                        </div>
                        {(s.services_offered?.length > 0 || s.support_number) && (
                          <div style={{ fontSize:10, color:C.muted, marginBottom:10, lineHeight:1.5, fontFamily:"'Plus Jakarta Sans',sans-serif" }}>
                            {s.services_offered?.length > 0 && <div><strong style={{ color:C.ink }}>Services:</strong> {s.services_offered.join(", ")}</div>}
                            {s.support_number && <div><strong style={{ color:C.ink }}>Support:</strong> {s.support_number}</div>}
                          </div>
                        )}
                        {salonTab==="rejected" && s.rejection_reason && (
                          <div style={{ fontSize:10, color:C.red, background:`${C.red}10`, border:`1px solid ${C.red}25`, borderRadius:8, padding:8, marginBottom:10, fontFamily:"'Plus Jakarta Sans',sans-serif" }}>
                            Rejection reason: {s.rejection_reason}
                          </div>
                        )}
                        <div style={{ fontSize:10, color:C.muted, marginBottom:12, fontFamily:"'Plus Jakarta Sans',sans-serif" }}>
                          Registered: {s.created_at ? new Date(s.created_at).toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"}) : "—"}
                        </div>
                        {salonTab==="requests" && (
                          <div style={{ display:"flex", gap:8 }}>
                            <button className="btn" disabled={busy} onClick={()=>updateSalonStatus(s._id,"approved")} style={{ flex:1, background:`${C.green}15`, color:C.green, border:`1px solid ${C.green}30`, justifyContent:"center" }}>Approve</button>
                            <button className="btn" disabled={busy} onClick={()=>setModal({type:"reject",salon:s})} style={{ flex:1, background:`${C.red}10`, color:C.red, border:`1px solid ${C.red}30`, justifyContent:"center" }}>Reject</button>
                          </div>
                        )}
                        {salonTab==="approved" && (
                          <button className="btn" onClick={()=>updateSalonStatus(s._id,"rejected","Suspended by admin")} style={{ width:"100%", background:`${C.red}10`, color:C.red, border:`1px solid ${C.red}30`, justifyContent:"center" }}>Suspend</button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ══ CUSTOMERS ══ */}
          {tab==="customers" && (
            <div style={{ animation:"fu .4s ease" }}>
              <div style={{ background:C.card, borderRadius:14, border:`1px solid ${C.border}`, overflow:"hidden" }}>
                <div style={{ padding:"12px 18px", borderBottom:`1px solid ${C.border}`, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                  <span style={{ fontSize:13, fontWeight:800, color:C.ink, fontFamily:"'Plus Jakarta Sans',sans-serif", textTransform:"uppercase", letterSpacing:"0.05em" }}>{customers.length} Customers</span>
                  <input className="inp" value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search..." style={{ width:180, padding:"6px 10px", fontSize:11 }}/>
                </div>
                {loading ? <div style={{ padding:40, textAlign:"center", color:C.muted, fontFamily:"'Plus Jakarta Sans',sans-serif" }}>Loading...</div>
                : customers.length===0 ? <div style={{ padding:40, textAlign:"center", color:C.muted, fontFamily:"'Plus Jakarta Sans',sans-serif" }}>No customers yet</div>
                : (
                  <table style={{ width:"100%", borderCollapse:"collapse" }}>
                    <thead><tr>{["Customer","Mobile","Email","Points","Joined","Status","Actions"].map(h=><TH key={h}>{h}</TH>)}</tr></thead>
                    <tbody>
                      {customers.filter(c=>!search||c.name?.toLowerCase().includes(search.toLowerCase())||c.mobile?.includes(search)).map(c=>(
                        <tr key={c._id} className="tr">
                          <TD><div style={{ display:"flex", alignItems:"center", gap:8 }}><Avatar name={c.name||"C"} size={30} color={C.blue} bg="#EFF6FF"/><span style={{ fontSize:12, fontWeight:700, color:C.ink, fontFamily:"'Plus Jakarta Sans',sans-serif" }}>{c.name||"—"}</span></div></TD>
                          <TD style={{ fontSize:11, color:C.muted, fontFamily:"monospace" }}>{c.mobile}</TD>
                          <TD style={{ fontSize:11, color:C.muted }}>{c.email||"—"}</TD>
                          <TD style={{ fontSize:12, fontWeight:700, color:C.gold }}>{c.loyalty_points||0}</TD>
                          <TD style={{ fontSize:11, color:C.muted }}>{c.created_at?new Date(c.created_at).toLocaleDateString("en-IN",{day:"numeric",month:"short"}):"—"}</TD>
                          <TD><Badge label={c.blocked?"Blocked":"Active"} color={c.blocked?C.red:C.green}/></TD>
                          <TD>
                            <button className="btn" onClick={()=>blockCustomer(c._id,!c.blocked)}
                              style={{ background:c.blocked?`${C.green}15`:`${C.red}10`, color:c.blocked?C.green:C.red, border:`1px solid ${c.blocked?C.green:C.red}30`, padding:"5px 10px" }}>
                              {c.blocked?"Unblock":"Block"}
                            </button>
                          </TD>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          )}

          {/* ══ BARBERS ══ */}
          {tab==="barbers" && (
            <div style={{ animation:"fu .4s ease" }}>
              {barbers.length===0 && !loading
                ? <div style={{ background:C.card, borderRadius:14, border:`1px solid ${C.border}`, padding:60, textAlign:"center", color:C.muted, fontFamily:"'Plus Jakarta Sans',sans-serif" }}>No barbers added yet. Go to "Add Barber" to add one!</div>
                : (
                <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))", gap:14 }}>
                  {barbers.map((b,i)=>(
                    <div key={b._id} style={{ background:C.card, borderRadius:14, border:`1px solid ${C.border}`, overflow:"hidden" }}>
                      <div style={{ height:160, overflow:"hidden", position:"relative" }}>
                        <img src={barberImg(i)} alt={b.name} style={{ width:"100%", height:"100%", objectFit:"cover" }}/>
                        <div style={{ position:"absolute", inset:0, background:"linear-gradient(to top,rgba(0,0,0,.6),transparent)" }}/>
                        <div style={{ position:"absolute", bottom:10, left:12 }}>
                          <div style={{ fontSize:14, fontWeight:800, color:"#fff", fontFamily:"'Playfair Display',serif" }}>{b.name}</div>
                          <div style={{ fontSize:11, color:"rgba(255,255,255,.7)", fontFamily:"'Plus Jakarta Sans',sans-serif" }}>{b.specialization}</div>
                        </div>
                        <div style={{ position:"absolute", top:10, right:10 }}>
                          <Badge label={b.status} color={bStatus(b.status)}/>
                        </div>
                      </div>
                      <div style={{ padding:"14px 16px" }}>
                        <div style={{ fontSize:11, color:C.muted, marginBottom:4, fontFamily:"'Plus Jakarta Sans',sans-serif" }}>{b.mobile} · {b.salon_id?.salon_name||"—"}</div>
                        <div style={{ fontSize:11, color:C.muted, marginBottom:10, fontFamily:"'Plus Jakarta Sans',sans-serif" }}>{b.experience} yrs exp · Rating: ⭐{b.rating||"N/A"}</div>
                        <div style={{ display:"flex", gap:6, marginBottom:8 }}>
                          {["available","break","offline"].map(s=>(
                            <button key={s} className="btn" disabled={b.status===s}
                              onClick={()=>changeBarberStatus(b._id,s)}
                              style={{ flex:1, background:b.status===s?`${bStatus(s)}20`:"#F7F5F2", color:b.status===s?bStatus(s):C.muted, border:`1px solid ${b.status===s?bStatus(s)+"50":C.border}`, padding:"5px 4px", fontSize:9, justifyContent:"center" }}>
                              {s}
                            </button>
                          ))}
                        </div>
                        <button className="btn" onClick={()=>removeBarber(b._id)}
                          style={{ width:"100%", background:`${C.red}10`, color:C.red, border:`1px solid ${C.red}30`, justifyContent:"center", padding:"6px" }}>
                          Remove Barber
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ══ ADD BARBER ══ */}
          {tab==="addbarber" && (
            <div style={{ animation:"fu .4s ease", maxWidth:640 }}>
              <div style={{ background:C.card, borderRadius:14, border:`1px solid ${C.border}`, padding:28 }}>
                <div style={{ fontSize:18, fontWeight:800, color:C.ink, fontFamily:"'Playfair Display',serif", marginBottom:4 }}>Add New Barber</div>
                <div style={{ fontSize:12, color:C.muted, marginBottom:20, fontFamily:"'Plus Jakarta Sans',sans-serif", fontWeight:400, lineHeight:1.6 }}>Credentials will be saved and barber can login to their dashboard</div>

                <div style={{ background:"#EFF6FF", border:`1px solid ${C.blue}30`, borderRadius:10, padding:"10px 14px", marginBottom:20 }}>
                  <div style={{ fontSize:11, color:C.blue, fontWeight:700, fontFamily:"'Plus Jakarta Sans',sans-serif" }}>After adding barber, they can login at /barber/login with:</div>
                  <div style={{ fontSize:11, color:C.ink, marginTop:4, fontFamily:"'Plus Jakarta Sans',sans-serif" }}>Mobile number + Password you set below</div>
                </div>

                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14, marginBottom:20 }}>
                  <div>
                    <label style={{ display:"block", fontSize:9, fontWeight:800, color:C.muted, textTransform:"uppercase", letterSpacing:1.2, marginBottom:8, fontFamily:"'Plus Jakarta Sans',sans-serif" }}>Profile Photo</label>
                    <div className="upload-box" onClick={()=>photoRef.current?.click()}>
                      {newBarber.photoPreview ? (
                        <div style={{ position:"relative" }}>
                          <img src={newBarber.photoPreview} style={{ width:"100%", height:120, objectFit:"cover", borderRadius:8 }}/>
                          <button className="nb" onClick={e=>{e.stopPropagation();setNewBarber(p=>({...p,photo:null,photoPreview:null}))}}
                            style={{ position:"absolute", top:4, right:4, background:"rgba(239,68,68,0.9)", color:"#fff", borderRadius:"50%", width:22, height:22, fontSize:12, display:"flex", alignItems:"center", justifyContent:"center" }}>✕</button>
                        </div>
                      ) : (
                        <div>
                          <div style={{ fontSize:28, marginBottom:6 }}>📷</div>
                          <div style={{ fontSize:12, fontWeight:600, color:C.muted, fontFamily:"'Plus Jakarta Sans',sans-serif" }}>Click to upload photo</div>
                          <div style={{ fontSize:10, color:C.border, fontFamily:"'Plus Jakarta Sans',sans-serif" }}>JPG, PNG up to 5MB</div>
                        </div>
                      )}
                    </div>
                    <input ref={photoRef} type="file" accept="image/*" style={{ display:"none" }} onChange={handlePhotoChange}/>
                  </div>
                  <div>
                    <label style={{ display:"block", fontSize:9, fontWeight:800, color:C.muted, textTransform:"uppercase", letterSpacing:1.2, marginBottom:8, fontFamily:"'Plus Jakarta Sans',sans-serif" }}>ID / Document</label>
                    <div className="upload-box" onClick={()=>docRef.current?.click()} style={{ height:newBarber.documentName?"auto":"164px", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center" }}>
                      {newBarber.documentName ? (
                        <div style={{ width:"100%", padding:12, background:"#F0FDF4", borderRadius:8, border:`1px solid ${C.green}30` }}>
                          <div style={{ fontSize:20, marginBottom:4 }}>📄</div>
                          <div style={{ fontSize:11, fontWeight:700, color:C.green, fontFamily:"'Plus Jakarta Sans',sans-serif" }}>{newBarber.documentName}</div>
                          <button className="nb" onClick={e=>{e.stopPropagation();setNewBarber(p=>({...p,document:null,documentName:""}))}}
                            style={{ marginTop:6, fontSize:10, color:C.red, fontWeight:700, fontFamily:"'Plus Jakarta Sans',sans-serif" }}>Remove</button>
                        </div>
                      ) : (
                        <div style={{ textAlign:"center" }}>
                          <div style={{ fontSize:28, marginBottom:6 }}>📄</div>
                          <div style={{ fontSize:12, fontWeight:600, color:C.muted, fontFamily:"'Plus Jakarta Sans',sans-serif" }}>Upload ID/Aadhar</div>
                          <div style={{ fontSize:10, color:C.border, fontFamily:"'Plus Jakarta Sans',sans-serif" }}>PDF, JPG, PNG</div>
                        </div>
                      )}
                    </div>
                    <input ref={docRef} type="file" accept=".pdf,.jpg,.jpeg,.png" style={{ display:"none" }} onChange={handleDocChange}/>
                  </div>
                </div>

                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
                  {[
                    { key:"name",           label:"Full Name *",     placeholder:"Rahul Sharma",       type:"text" },
                    { key:"mobile",         label:"Mobile Number *", placeholder:"10 digit mobile",    type:"tel" },
                    { key:"password",       label:"Password *",      placeholder:"Set login password", type:"password" },
                    { key:"specialization", label:"Specialization",  placeholder:"Haircut & Fade",     type:"text" },
                    { key:"experience",     label:"Experience (yrs)",placeholder:"5",                  type:"number" },
                    { key:"email",          label:"Email (Optional)",placeholder:"barber@email.com",   type:"email" },
                  ].map(f=>(
                    <div key={f.key}>
                      <label style={{ display:"block", fontSize:9, fontWeight:800, color:C.muted, textTransform:"uppercase", letterSpacing:1.2, marginBottom:6, fontFamily:"'Plus Jakarta Sans',sans-serif" }}>{f.label}</label>
                      <input className="inp" type={f.type} placeholder={f.placeholder}
                        value={newBarber[f.key]} onChange={e=>setNewBarber(p=>({...p,[f.key]:e.target.value}))}/>
                    </div>
                  ))}
                  <div>
                    <label style={{ display:"block", fontSize:9, fontWeight:800, color:C.muted, textTransform:"uppercase", letterSpacing:1.2, marginBottom:6, fontFamily:"'Plus Jakarta Sans',sans-serif" }}>Assign Salon *</label>
                    <select className="inp" value={newBarber.salon_id} onChange={e=>setNewBarber(p=>({...p,salon_id:e.target.value}))}>
                      <option value="">Select approved salon...</option>
                      {salons.filter(s=>s.status==="approved").map(s=>(
                        <option key={s._id} value={s._id}>{s.salon_name}</option>
                      ))}
                    </select>
                    {salons.filter(s=>s.status==="approved").length===0 && (
                      <div style={{ fontSize:10, color:C.red, marginTop:4, fontFamily:"'Plus Jakarta Sans',sans-serif" }}>No approved salons! Approve a salon first.</div>
                    )}
                  </div>
                </div>

                <button className="btn" disabled={!newBarber.name||!newBarber.mobile||!newBarber.password||busy}
                  onClick={addBarber}
                  style={{ marginTop:22, width:"100%", padding:13, background:`linear-gradient(135deg,${C.gold},${C.goldD})`, color:"#fff", fontSize:12, letterSpacing:1, justifyContent:"center", borderRadius:10 }}>
                  {busy?"Adding Barber...":"Add Barber to Platform"}
                </button>
              </div>

              {addedBarbers.length>0 && (
                <div style={{ background:C.card, borderRadius:14, border:`1px solid ${C.border}`, padding:20, marginTop:16 }}>
                  <div style={{ fontSize:11, fontWeight:800, color:C.ink, marginBottom:12, fontFamily:"'Plus Jakarta Sans',sans-serif", textTransform:"uppercase", letterSpacing:"0.08em" }}>Added Barbers — Login Credentials</div>
                  {addedBarbers.map((b,i)=>(
                    <div key={i} style={{ background:"#F0FDF4", border:`1px solid ${C.green}30`, borderRadius:10, padding:"12px 14px", marginBottom:8 }}>
                      <div style={{ fontSize:12, fontWeight:800, color:C.ink, marginBottom:6, fontFamily:"'Plus Jakarta Sans',sans-serif" }}>{b.name} · {b.salon}</div>
                      <div style={{ display:"flex", gap:16, flexWrap:"wrap" }}>
                        <span style={{ fontSize:11, color:C.muted, fontFamily:"'Plus Jakarta Sans',sans-serif" }}>Mobile: <strong style={{ color:C.ink }}>{b.mobile}</strong></span>
                        <span style={{ fontSize:11, color:C.muted, fontFamily:"'Plus Jakarta Sans',sans-serif" }}>Password: <strong style={{ color:C.red, fontFamily:"monospace" }}>{b.password}</strong></span>
                        <span style={{ fontSize:11, color:C.muted, fontFamily:"'Plus Jakarta Sans',sans-serif" }}>Login at: <strong style={{ color:C.blue }}>/barber/login</strong></span>
                      </div>
                      <div style={{ fontSize:10, color:C.muted, marginTop:4, fontFamily:"'Plus Jakarta Sans',sans-serif" }}>Added: {b.addedAt}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ══ APPOINTMENTS ══ */}
          {tab==="appointments" && (
            <div style={{ animation:"fu .4s ease" }}>
              <div style={{ background:C.card, borderRadius:14, border:`1px solid ${C.border}`, overflow:"hidden" }}>
                <div style={{ padding:"12px 18px", borderBottom:`1px solid ${C.border}` }}>
                  <span style={{ fontSize:13, fontWeight:800, color:C.ink, fontFamily:"'Plus Jakarta Sans',sans-serif", textTransform:"uppercase", letterSpacing:"0.05em" }}>{bookings.length} Appointments</span>
                </div>
                {loading ? <div style={{ padding:40, textAlign:"center", color:C.muted, fontFamily:"'Plus Jakarta Sans',sans-serif" }}>Loading...</div>
                : bookings.length===0 ? <div style={{ padding:40, textAlign:"center", color:C.muted, fontFamily:"'Plus Jakarta Sans',sans-serif" }}>No bookings yet</div>
                : (
                  <table style={{ width:"100%", borderCollapse:"collapse" }}>
                    <thead><tr>{["Customer","Service","Barber","Salon","Date","Amount","Status","Actions"].map(h=><TH key={h}>{h}</TH>)}</tr></thead>
                    <tbody>
                      {bookings.map(b=>(
                        <tr key={b._id} className="tr">
                          <TD><div style={{ display:"flex", alignItems:"center", gap:8 }}><Avatar name={b.customer_id?.name||"C"} size={28} color={C.blue} bg="#EFF6FF"/><span style={{ fontSize:12, fontWeight:700, color:C.ink, fontFamily:"'Plus Jakarta Sans',sans-serif" }}>{b.customer_id?.name||"—"}</span></div></TD>
                          <TD style={{ fontSize:11, color:C.muted }}>{b.services?.[0]?.service_name||"—"}</TD>
                          <TD style={{ fontSize:11, color:C.gold }}>{b.barber_id?.name||"—"}</TD>
                          <TD style={{ fontSize:11, color:C.muted }}>{b.salon_id?.salon_name||"—"}</TD>
                          <TD style={{ fontSize:11, color:C.muted }}>{b.created_at?new Date(b.created_at).toLocaleDateString("en-IN"):"—"}</TD>
                          <TD style={{ fontSize:12, fontWeight:700, color:C.ink }}>₹{b.total_amount||0}</TD>
                          <TD><Badge label={b.status} color={bkStatus(b.status)}/></TD>
                          <TD>
                            {b.status==="pending" && (
                              <div style={{ display:"flex", gap:6 }}>
                                <button className="btn" onClick={()=>changeBookingStatus(b._id,"confirmed")} style={{ background:`${C.green}15`, color:C.green, border:`1px solid ${C.green}30`, padding:"5px 8px" }}>Confirm</button>
                                <button className="btn" onClick={()=>changeBookingStatus(b._id,"cancelled")} style={{ background:`${C.red}10`, color:C.red, border:`1px solid ${C.red}30`, padding:"5px 8px" }}>Cancel</button>
                              </div>
                            )}
                          </TD>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          )}

          {/* ══ SERVICES ══ */}
          {tab==="services" && (
            <div style={{ animation:"fu .4s ease" }}>
              <div style={{ background:C.card, borderRadius:14, border:`1px solid ${C.border}`, padding:18, marginBottom:14 }}>
                <div style={{ fontSize:11, fontWeight:800, color:C.ink, marginBottom:14, fontFamily:"'Plus Jakarta Sans',sans-serif", textTransform:"uppercase", letterSpacing:"0.08em" }}>Add New Service</div>
                <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
                  <input className="inp" placeholder="Service name" value={newService.name} onChange={e=>setNewService(p=>({...p,name:e.target.value}))} style={{ flex:2, minWidth:150 }}/>
                  <select className="inp" value={newService.category} onChange={e=>setNewService(p=>({...p,category:e.target.value}))} style={{ flex:1, minWidth:100 }}>
                    <option value="men">Men</option><option value="women">Women</option><option value="addon">Addon</option>
                  </select>
                  <input className="inp" placeholder="Price ₹" type="number" value={newService.price} onChange={e=>setNewService(p=>({...p,price:e.target.value}))} style={{ flex:1, minWidth:80 }}/>
                  <input className="inp" placeholder="Duration (min)" type="number" value={newService.duration} onChange={e=>setNewService(p=>({...p,duration:e.target.value}))} style={{ flex:1, minWidth:100 }}/>
                  <select className="inp" value={newService.salon_id} onChange={e=>setNewService(p=>({...p,salon_id:e.target.value}))} style={{ flex:1, minWidth:120 }}>
                    <option value="">Select salon...</option>
                    {salons.filter(s=>s.status==="approved").map(s=>(<option key={s._id} value={s._id}>{s.salon_name}</option>))}
                  </select>
                  <button className="btn" disabled={!newService.name||!newService.price} onClick={addService}
                    style={{ background:`linear-gradient(135deg,${C.gold},${C.goldD})`, color:"#fff", padding:"9px 18px" }}>
                    Add
                  </button>
                </div>
              </div>
              <div style={{ background:C.card, borderRadius:14, border:`1px solid ${C.border}`, overflow:"hidden" }}>
                {services.length===0 ? <div style={{ padding:40, textAlign:"center", color:C.muted, fontFamily:"'Plus Jakarta Sans',sans-serif" }}>No services yet</div>
                : (
                  <table style={{ width:"100%", borderCollapse:"collapse" }}>
                    <thead><tr>{["Service","Salon","Category","Price","Duration","Status","Actions"].map(h=><TH key={h}>{h}</TH>)}</tr></thead>
                    <tbody>
                      {services.map(s=>(
                        <tr key={s._id} className="tr">
                          <TD style={{ fontSize:12, fontWeight:700, color:C.ink }}>{s.name}</TD>
                          <TD style={{ fontSize:11, color:C.gold }}>{s.salon_id?.salon_name||"—"}</TD>
                          <TD><Badge label={s.category} color={s.category==="men"?C.blue:s.category==="women"?C.purple:C.amber}/></TD>
                          <TD style={{ fontSize:12, fontWeight:700, color:C.gold }}>₹{s.price}</TD>
                          <TD style={{ fontSize:11, color:C.muted }}>{s.duration} min</TD>
                          <TD><Badge label={s.is_active?"Active":"Inactive"} color={s.is_active?C.green:C.red}/></TD>
                          <TD>
                            <div style={{ display:"flex", gap:6 }}>
                              <button className="btn" onClick={()=>toggleService(s._id,!s.is_active)} style={{ background:`${C.gold}15`, color:C.gold, border:`1px solid ${C.gold}30`, padding:"5px 10px" }}>{s.is_active?"Disable":"Enable"}</button>
                              <button className="btn" onClick={()=>deleteService(s._id)} style={{ background:`${C.red}10`, color:C.red, border:`1px solid ${C.red}30`, padding:"5px 10px" }}>Delete</button>
                            </div>
                          </TD>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          )}

          {/* ══ PAYMENTS ══ */}
          {tab==="payments" && (
            <div style={{ animation:"fu .4s ease" }}>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:12, marginBottom:16 }}>
                <StatCard label="Collected" value={`₹${payments.filter(p=>p.status==="captured").reduce((a,b)=>a+(b.amount||0),0)/100}`} sub="Captured" color={C.green}/>
                <StatCard label="Pending"   value={payments.filter(p=>p.status==="pending").length}  sub="Awaiting" color={C.amber}/>
                <StatCard label="Refunded"  value={payments.filter(p=>p.status==="refunded").length} sub="Returned" color={C.red}/>
              </div>
              <div style={{ background:C.card, borderRadius:14, border:`1px solid ${C.border}`, overflow:"hidden" }}>
                {payments.length===0 ? <div style={{ padding:40, textAlign:"center", color:C.muted, fontFamily:"'Plus Jakarta Sans',sans-serif" }}>No payments yet</div>
                : (
                  <table style={{ width:"100%", borderCollapse:"collapse" }}>
                    <thead><tr>{["Customer","Salon","Amount","Type","Status","Date"].map(h=><TH key={h}>{h}</TH>)}</tr></thead>
                    <tbody>
                      {payments.map(p=>(
                        <tr key={p._id} className="tr">
                          <TD><div style={{ display:"flex", alignItems:"center", gap:8 }}><Avatar name={p.customer_id?.name||"C"} size={28} color={C.purple} bg="#F5F3FF"/><span style={{ fontSize:12, fontWeight:700, color:C.ink, fontFamily:"'Plus Jakarta Sans',sans-serif" }}>{p.customer_id?.name||"—"}</span></div></TD>
                          <TD style={{ fontSize:11, color:C.gold }}>{p.salon_id?.salon_name||"—"}</TD>
                          <TD style={{ fontSize:12, fontWeight:700, color:C.ink }}>₹{(p.amount||0)/100}</TD>
                          <TD><Badge label={p.payment_type||"token"} color={p.payment_type==="full"?C.green:C.blue}/></TD>
                          <TD><Badge label={p.status} color={pyStatus(p.status)}/></TD>
                          <TD style={{ fontSize:11, color:C.muted }}>{p.created_at?new Date(p.created_at).toLocaleDateString("en-IN"):"—"}</TD>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          )}

          {/* ══ REVIEWS ══ */}
          {tab==="reviews" && (
            <div style={{ animation:"fu .4s ease" }}>
              {reviews.length===0 ? <div style={{ background:C.card, borderRadius:14, border:`1px solid ${C.border}`, padding:60, textAlign:"center", color:C.muted, fontFamily:"'Plus Jakarta Sans',sans-serif" }}>No reviews yet</div>
              : (
                <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))", gap:14 }}>
                  {reviews.map(r=>(
                    <div key={r._id} style={{ background:C.card, borderRadius:14, border:`1px solid ${C.border}`, padding:18 }}>
                      <div style={{ display:"flex", justifyContent:"space-between", marginBottom:10 }}>
                        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                          <Avatar name={r.customer_id?.name||"C"} size={32} color={C.purple} bg="#F5F3FF"/>
                          <div>
                            <div style={{ fontSize:12, fontWeight:700, color:C.ink, fontFamily:"'Plus Jakarta Sans',sans-serif" }}>{r.customer_id?.name||"Customer"}</div>
                            <div style={{ fontSize:10, color:C.muted, fontFamily:"'Plus Jakarta Sans',sans-serif" }}>{r.salon_id?.salon_name||"—"}</div>
                          </div>
                        </div>
                        <button className="btn" onClick={()=>deleteReview(r._id)} style={{ background:`${C.red}10`, color:C.red, border:`1px solid ${C.red}30`, padding:"4px 8px", fontSize:10 }}>Delete</button>
                      </div>
                      <div style={{ display:"flex", gap:2, marginBottom:8 }}>
                        {[1,2,3,4,5].map(s=>(<span key={s} style={{ fontSize:14, color:s<=r.rating?C.gold:"#D1C5BA" }}>★</span>))}
                      </div>
                      <div style={{ fontSize:12, color:C.muted, lineHeight:1.6, fontFamily:"'Plus Jakarta Sans',sans-serif", fontWeight:400 }}>{r.review_text||"No comment"}</div>
                      <div style={{ fontSize:10, color:C.border, marginTop:8, fontFamily:"'Plus Jakarta Sans',sans-serif" }}>{r.created_at?new Date(r.created_at).toLocaleDateString("en-IN"):"—"}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ══ LIVE MONITORING ══ */}
          {tab==="live" && (
            <div style={{ animation:"fu .4s ease" }}>
              <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:16, background:C.card, padding:"10px 16px", borderRadius:10, border:`1px solid ${C.border}`, width:"fit-content" }}>
                <div style={{ width:8, height:8, borderRadius:"50%", background:C.green }}/>
                <span style={{ fontSize:11, color:C.green, fontWeight:800, fontFamily:"'Plus Jakarta Sans',sans-serif", textTransform:"uppercase", letterSpacing:"0.08em" }}>Live Monitoring Active</span>
                <span style={{ fontSize:11, color:C.muted, fontFamily:"'Plus Jakarta Sans',sans-serif" }}>{barbers.length} barbers tracked</span>
              </div>
              {barbers.length===0 ? <div style={{ background:C.card, borderRadius:14, border:`1px solid ${C.border}`, padding:60, textAlign:"center", color:C.muted, fontFamily:"'Plus Jakarta Sans',sans-serif" }}>No barbers to monitor</div>
              : (
                <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))", gap:14 }}>
                  {barbers.map((b,i)=>(
                    <div key={b._id} style={{ background:C.card, borderRadius:14, border:`2px solid ${b.status==="available"?C.green+"40":C.border}`, overflow:"hidden" }}>
                      <div style={{ height:160, overflow:"hidden", position:"relative" }}>
                        <img src={barberImg(i)} alt={b.name} style={{ width:"100%", height:"100%", objectFit:"cover" }}/>
                        <div style={{ position:"absolute", inset:0, background:"linear-gradient(to top,rgba(0,0,0,.6),transparent)" }}/>
                        <div style={{ position:"absolute", bottom:10, left:12 }}>
                          <div style={{ fontSize:14, fontWeight:800, color:"#fff", fontFamily:"'Playfair Display',serif" }}>{b.name}</div>
                          <div style={{ fontSize:11, color:"rgba(255,255,255,.7)", fontFamily:"'Plus Jakarta Sans',sans-serif" }}>{b.specialization}</div>
                        </div>
                        <div style={{ position:"absolute", top:10, right:10 }}>
                          <Badge label={b.status} color={bStatus(b.status)}/>
                        </div>
                      </div>
                      <div style={{ padding:"14px 16px" }}>
                        <div style={{ fontSize:11, color:C.muted, marginBottom:12, fontFamily:"'Plus Jakarta Sans',sans-serif" }}>Salon: <span style={{ color:C.gold, fontWeight:700 }}>{b.salon_id?.salon_name||"—"}</span></div>
                        <div style={{ display:"flex", gap:6 }}>
                          {["available","break","offline"].map(s=>(
                            <button key={s} className="btn" disabled={b.status===s}
                              onClick={()=>changeBarberStatus(b._id,s)}
                              style={{ flex:1, background:b.status===s?`${bStatus(s)}20`:"#F7F5F2", color:b.status===s?bStatus(s):C.muted, border:`1px solid ${b.status===s?bStatus(s)+"50":C.border}`, padding:"6px 4px", fontSize:9, justifyContent:"center" }}>
                              {s}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ══ SETTINGS ══ */}
          {tab==="settings" && (
            <div style={{ animation:"fu .4s ease", maxWidth:560 }}>
              <div style={{ background:C.card, borderRadius:14, border:`1px solid ${C.border}`, overflow:"hidden" }}>
                <div style={{ padding:"14px 18px", borderBottom:`1px solid ${C.border}` }}>
                  <span style={{ fontSize:11, fontWeight:800, color:C.ink, fontFamily:"'Plus Jakarta Sans',sans-serif", textTransform:"uppercase", letterSpacing:"0.08em" }}>System Settings</span>
                </div>
                {[
                  { label:"Platform Name",      placeholder:"Barber Pro",            type:"text" },
                  { label:"Support Email",       placeholder:"support@barberpro.com", type:"email" },
                  { label:"Support Mobile",      placeholder:"9999999999",            type:"tel" },
                  { label:"Commission %",        placeholder:"10",                    type:"number" },
                  { label:"Token Payment %",     placeholder:"20",                    type:"number" },
                  { label:"Default Opening Time",placeholder:"09:00 AM",              type:"text" },
                  { label:"Default Closing Time",placeholder:"09:00 PM",              type:"text" },
                  { label:"GST %",              placeholder:"18",                    type:"number" },
                ].map((f,i)=>(
                  <div key={i} style={{ padding:"12px 18px", borderBottom:`1px solid ${C.border}`, display:"flex", alignItems:"center", gap:16 }}>
                    <label style={{ fontSize:12, fontWeight:500, color:C.ink, minWidth:160, fontFamily:"'Plus Jakarta Sans',sans-serif", lineHeight:1.6 }}>{f.label}</label>
                    <input className="inp" type={f.type} placeholder={f.placeholder} style={{ flex:1 }}/>
                  </div>
                ))}
                <div style={{ padding:"16px 18px" }}>
                  <button className="btn" onClick={()=>pop("Settings saved!")}
                    style={{ width:"100%", padding:12, background:`linear-gradient(135deg,${C.gold},${C.goldD})`, color:"#fff", fontSize:12, justifyContent:"center", borderRadius:10 }}>
                    Save Settings
                  </button>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* ══ REJECT MODAL ══ */}
      {modal?.type==="reject" && (
        <div style={{ position:"fixed", inset:0, zIndex:50, display:"flex", alignItems:"center", justifyContent:"center", padding:16, background:"rgba(0,0,0,.5)", backdropFilter:"blur(4px)" }}
          onClick={()=>{ setModal(null); setReason(""); }}>
          <div style={{ background:C.card, border:`1px solid ${C.border}`, width:"100%", maxWidth:400, borderRadius:14, padding:24, boxShadow:"0 20px 60px rgba(0,0,0,.15)" }}
            onClick={e=>e.stopPropagation()}>
            <div style={{ fontSize:18, fontWeight:800, color:C.ink, fontFamily:"'Playfair Display',serif", marginBottom:4 }}>Reject Salon</div>
            <div style={{ fontSize:11, color:C.muted, marginBottom:16, fontFamily:"'Plus Jakarta Sans',sans-serif", fontWeight:400, lineHeight:1.6 }}>{modal.salon?.salon_name} — {modal.salon?.owner_name}</div>
            <label style={{ display:"block", fontSize:9, fontWeight:800, color:C.muted, textTransform:"uppercase", letterSpacing:1.2, marginBottom:6, fontFamily:"'Plus Jakarta Sans',sans-serif" }}>Rejection Reason</label>
            <textarea className="inp" value={reason} onChange={e=>setReason(e.target.value)} placeholder="Provide reason..." style={{ height:80, resize:"none", lineHeight:1.6 }}/>
            <div style={{ display:"flex", gap:8, marginTop:14 }}>
              <button className="nb btn" onClick={()=>{ setModal(null); setReason(""); }} style={{ flex:1, padding:10, border:`1px solid ${C.border}`, borderRadius:8, color:C.muted, fontSize:12, background:"#fff" }}>Cancel</button>
              <button className="btn" disabled={!reason.trim()||busy} onClick={()=>updateSalonStatus(modal.salon._id,"rejected",reason)}
                style={{ flex:2, padding:10, background:reason.trim()?C.red:"#FCA5A5", color:"#fff", borderRadius:8, fontSize:12, border:"none" }}>
                {busy?"Processing...":"Confirm Rejection"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══ TOAST ══ */}
      {toast && (
        <div style={{ position:"fixed", bottom:20, right:20, zIndex:100, padding:"12px 20px", borderRadius:10, fontWeight:800, fontSize:12, color:"#fff", animation:"sl .3s ease", background:toast.type==="error"?C.red:C.green, boxShadow:"0 8px 24px rgba(0,0,0,.2)", fontFamily:"'Plus Jakarta Sans',sans-serif", textTransform:"uppercase", letterSpacing:"0.05em" }}>
        {toast.msg}
      </div>
      )}
    </div>
  );
}