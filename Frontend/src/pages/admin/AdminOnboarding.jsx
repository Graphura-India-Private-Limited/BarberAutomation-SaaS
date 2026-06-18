
import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, Store, Users, UserSquare2, UserPlus2, 
  CalendarCheck, Scissors, CreditCard, Star, Activity, Settings, LogOut,
  Bell, RefreshCw, ChevronDown
} from "lucide-react";  

const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const getToken = () => localStorage.getItem("token");

/* ══ COLORS (Matched to File 1) ══ */
const C = {
  bg: "#FAF6F0",
  bg2: "#FFFFFF",
  card: "#FFFFFF",
  sidebar: "#FFFFFF",
  ink: "#1C1917",
  muted: "#78716C",
  border: "#E7E5E4",
  gold: "#C5A059",
  goldD: "#8B6A2E",
  goldLight: "#FDF9F3",
  blue: "#2563EB",
  blueLight: "#EFF6FF",
  green: "#059669",
  greenLight: "#ECFDF5",
  purple: "#7C3AED",
  purpleLight: "#F5F3FF",
  red: "#DC2626",
  redLight: "#FEF2F2",
  orange: "#D97706",
  orangeLight: "#FFFBEB",
  amber: "#D97706",
};

/* ══ HELPERS ══ */
const Badge = ({ label, color }) => (
  <span style={{
    padding: "3px 10px", borderRadius: 20, fontSize: 10, fontWeight: 700,
    textTransform: "uppercase", letterSpacing: 0.8,
    background: `${color}15`, color, border: `1px solid ${color}30`,
  }}>
    {label}
  </span>
);

const Avatar = ({ name, size = 32, color = C.gold, bg = C.goldLight }) => (
  <div style={{
    width: size, height: size, borderRadius: "50%", background: bg,
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: size * 0.4, fontWeight: 700, color, flexShrink: 0,
    border: `1px solid ${color}30`,
  }}>
    {name?.[0]?.toUpperCase() || "?"}
  </div>
);

const StatCard = ({ label, value, color, sub, icon: Icon, iconBg, iconColor }) => (
  <div style={{
    background: C.card, borderRadius: 12, padding: "18px 20px",
    border: `1px solid ${C.border}`, boxShadow: "0 1px 4px rgba(0,0,0,.04)",
    transition: "transform 0.2s, box-shadow 0.2s", cursor: "default",
  }}
    onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.1)"; }}
    onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 1px 4px rgba(0,0,0,.04)"; }}
  >
    <div style={{ fontSize: 13, color: C.muted, fontWeight: 500, marginBottom: 12 }}>{label}</div>
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
      <div style={{ fontSize: 26, fontWeight: 700, color: C.ink, fontFamily: "Georgia, serif", lineHeight: 1 }}>{value}</div>
      {Icon && (
        <div style={{ padding: 10, borderRadius: 8, background: iconBg || C.goldLight }}>
          <Icon size={20} color={iconColor || C.gold} />
        </div>
      )}
    </div>
    {sub && <div style={{ fontSize: 12, color, fontWeight: 500, marginTop: 6 }}>{sub}</div>}
  </div>
);

const TH = ({ children }) => (
  <th style={{
    padding: "10px 16px", textAlign: "left", fontSize: 10, fontWeight: 700,
    color: C.muted, textTransform: "uppercase", letterSpacing: 1.2,
    whiteSpace: "nowrap", background: "#FAFAF8", borderBottom: `1px solid ${C.border}`,
  }}>
    {children}
  </th>
);
const TD = ({ children, style = {} }) => (
  <td style={{ padding: "12px 16px", borderBottom: `1px solid ${C.border}`, ...style }}>{children}</td>
);

const SectionCard = ({ title, actionLabel, onAction, children, minHeight }) => (
  <div style={{ background: C.card, borderRadius: 16, border: `1px solid ${C.border}`, overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,.04)" }}>
    <div style={{ padding: "14px 20px", borderBottom: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <span style={{ fontSize: 16, fontWeight: 700, color: C.ink, fontFamily: "Georgia, serif" }}>{title}</span>
      {actionLabel && (
        <button onClick={onAction} style={{ fontSize: 11, color: C.orange, fontWeight: 700, background: "none", border: "none", cursor: "pointer" }}>{actionLabel}</button>
      )}
    </div>
    <div style={{ minHeight: minHeight || "auto" }}>{children}</div>
  </div>
);

const NAV = [
  { k: "dashboard", label: "Dashboard" },
  { k: "salons", label: "Salon Management" },
  { k: "customers", label: "Customers" },
  { k: "appointments", label: "Appointments" },
  { k: "services", label: "Services" },
  { k: "payments", label: "Payments" },
  { k: "reviews", label: "Reviews" },
  { k: "settings", label: "Settings" },
];

const salonImg = (i) => ["https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=400&q=80","https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=400&q=80","https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=400&q=80","https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=400&q=80"][i%4];
const barberImg = (i) => ["https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=200&q=80","https://images.unsplash.com/photo-1605497788044-5a32c7078486?w=200&q=80","https://images.unsplash.com/photo-1621605815841-aa33c5447a33?w=200&q=80"][i%3];

const bStatus  = s => s === "available" ? C.green : s === "busy" ? C.amber : s === "break" ? C.blue : "#9CA3AF";
const bkStatus = s => s === "completed" ? C.green : s === "pending" ? C.purple : s === "cancelled" ? C.red : C.blue;
const pyStatus = s => s === "captured" ? C.green : s === "refunded" ? C.blue : s === "pending" ? C.amber : C.red;

const NAV_ICONS = {
  dashboard: LayoutDashboard, salons: Store, customers: Users,
  barbers: UserSquare2, addbarber: UserPlus2, appointments: CalendarCheck,
  services: Scissors, payments: CreditCard, reviews: Star,
  live: Activity, settings: Settings
};

export default function AdminOnboarding() {
  const navigate  = useNavigate();
  const location  = useLocation();
  const photoRef  = useRef();
  const docRef    = useRef();
  const adminMenuRef = useRef(null);

  const ROUTE_TAB_MAP = {
    "/admin": "dashboard",
    "/admin/": "dashboard",
    "/admin/requests": "dashboard",
    "/admin/salons": "salons",
    "/admin/salon-management": "salons",
    "/admin/customers": "customers",
    "/admin/appointments": "appointments",
    "/admin/services": "services",
    "/admin/payments": "payments",
    "/admin/reviews": "reviews",
    "/admin/live": "live",
    "/admin/live-monitoring": "live",
    "/admin/settings": "settings",
    "/admin/platform-settings": "settings",
    "/admin/onboarding": "dashboard"
  };

  const [tab, setTab] = useState(() => {
    return ROUTE_TAB_MAP[window.location.pathname] || "dashboard";
  });

  useEffect(() => {
    const routeTab = ROUTE_TAB_MAP[location.pathname];
    if (routeTab) {
      setTab(routeTab);
    }
  }, [location.pathname]);

  const handleTabChange = (tabKey) => {
    setTab(tabKey);
    if (tabKey === "dashboard") {
      navigate("/admin");
    } else if (tabKey === "salons") {
      navigate("/admin/salon-management");
    } else if (tabKey === "settings") {
      navigate("/admin/platform-settings");
    } else {
      navigate(`/admin/${tabKey}`);
    }
  };
  const [salons,     setSalons]    = useState([]);
  const [stats,      setStats]     = useState(null);
  const [loading,    setLoading]   = useState(true);
  const [customers,  setCustomers] = useState([]);
  const [custPage,   setCustPage]  = useState(1);
  const [custPerPage, setCustPerPage] = useState(10);
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
  const [adminMenuOpen, setAdminMenuOpen] = useState(false);

  const [newBarber, setNewBarber] = useState({
    name:"", mobile:"", password:"", specialization:"", experience:"", salon_id:"",
    email:"", photo:null, photoPreview:null, document:null, documentName:"",
  });
  const [newService, setNewService] = useState({ name:"", category:"men", price:"", duration:"30", salon_id:"" });

  useEffect(() => { fetchAll(); }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (adminMenuRef.current && !adminMenuRef.current.contains(event.target)) {
        setAdminMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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

  const updateSalonCapacity = async (id, limit) => {
    try {
      const r = await fetch(`${API}/admin/salon-limit/${id}`, {
        method: "PUT",
        headers: h(),
        body: JSON.stringify({ max_barbers_limit: limit }),
      });
      const d = await r.json();
      if (d.success) {
        setSalons(p => p.map(s => s._id === id ? { ...s, max_barbers_limit: limit } : s));
        pop("Salon capacity limit updated successfully!");
      } else {
        pop(d.message || "Failed to update capacity limit", "error");
      }
    } catch (err) {
      console.error(err);
      pop("Server error updating capacity limit", "error");
    }
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
      const salonId = newBarber.salon_id;
      if (!salonId) { pop("Please select a salon to assign this barber to.", "error"); setBusy(false); return; }
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
          name: newBarber.name, mobile: newBarber.mobile, password: newBarber.password,
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

  const inputStyle = {
    background: "#FAFAF8", border: `1.5px solid ${C.border}`, borderRadius: 9,
    padding: "10px 13px", fontSize: 13, color: C.ink, outline: "none", width: "100%",
    fontFamily: "inherit", transition: "border 0.2s",
  };
  const btnStyle = (bg, color, border) => ({
    display: "inline-flex", alignItems: "center", gap: 5, padding: "8px 14px",
    borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: "pointer",
    border: border || "none", background: bg, color, fontFamily: "inherit",
    transition: "all 0.18s",
  });

  const currentNavLabel = NAV.find(n => n.k === tab)?.label || "Dashboard";

  return (
    <div style={{ display:"flex", minHeight:"100vh", background: C.bg, color: C.ink, fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
      <style>{`
        *{box-sizing:border-box}
        ::-webkit-scrollbar{width:3px}
        ::-webkit-scrollbar-thumb{background:#DDD5CC;border-radius:4px}
        .tr:hover td{background:#FAFAF8}
        .inp:focus{border-color:#C5A059 !important; background:#fff !important; outline:none;}
        .inp::placeholder{color:#A09080}
        select.inp option{background:#fff;color:#1A1410}
        .upload-box{border:2px dashed ${C.border};border-radius:12px;padding:20px;text-align:center;cursor:pointer;transition:border 0.2s;background:#FAFAF8}
        .upload-box:hover{border-color:${C.gold};background:#FEF9F0}
        @keyframes fadeUp{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes slideIn{from{opacity:0;transform:translateX(16px)}to{opacity:1;transform:none}}
        .fade-in{animation:fadeUp .35s ease}
        .nav-btn:hover{background:#FAF6F0 !important; color:${C.ink} !important;}
        .action-btn:hover{filter:brightness(.95);transform:translateY(-1px);}
        .action-btn:disabled{opacity:.4;cursor:not-allowed;transform:none;filter:none;}
      `}</style>

      {/* ════ SIDEBAR ════ */}
      <aside style={{
        width: 256, background: C.sidebar, display: "flex", flexDirection: "column",
        flexShrink: 0, position: "sticky", top: 0, height: "100vh", overflowY: "auto",
        borderRight: `1px solid ${C.border}`,
      }}>
        {/* Brand */}
        <div style={{ padding: "24px 20px 20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 32, height: 32, borderRadius: 8,
              background: C.goldLight,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <Scissors size={16} color={C.gold} />
            </div>
            <div>
              <div style={{ fontSize: 18, fontWeight: 700, color: C.ink, fontFamily: "Georgia, serif", letterSpacing: "-0.01em", lineHeight: 1 }}>Barber Pro</div>
              <div style={{ fontSize: 9, color: C.gold, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", marginTop: 3 }}>ADMIN CONSOLE</div>
            </div>
          </div>
        </div>

        {/* Nav label */}
        <div style={{ padding: "0 28px 6px" }}>
          <span style={{ fontSize: 9, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: "0.18em" }}>Navigation</span>
        </div>

        {/* Nav */}
        <nav style={{ padding: "0 16px 8px", flex: 1, display: "flex", flexDirection: "column", gap: 2 }}>
          {NAV.map((n, i) => {
            const isActive = tab === n.k;
            const Icon = NAV_ICONS[n.k] || LayoutDashboard;
            return (
              <React.Fragment key={n.k}>
                {(i === 3 || i === 6 || i === 7) && (
                  <div style={{ height: 1, background: C.border, margin: "10px 0" }} />
                )}
                <button
                  className={isActive ? "" : "nav-btn"}
                  onClick={() => handleTabChange(n.k)}
                  style={{
                    display: "flex", alignItems: "center", gap: 10, width: "100%",
                    padding: "10px 12px", borderRadius: 8,
                    background: isActive ? C.goldLight : "transparent",
                    border: "none",
                    borderLeft: isActive ? `3px solid ${C.gold}` : "3px solid transparent",
                    color: isActive ? C.gold : C.muted,
                    fontSize: 13, fontWeight: isActive ? 600 : 500,
                    textAlign: "left", cursor: "pointer", transition: "all 0.18s",
                    fontFamily: "inherit",
                  }}
                >
                  <Icon size={16} strokeWidth={isActive ? 2.5 : 2} style={{ color: isActive ? C.gold : C.muted, flexShrink: 0 }} />
                  <span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{n.label}</span>
                  {n.k === "appointments" && pendingBookings > 0 && (
                    <span style={{
                      background: C.purpleLight, color: C.purple,
                      borderRadius: 8, padding: "2px 7px", fontSize: 10, fontWeight: 700, lineHeight: 1,
                    }}>
                      {pendingBookings}
                    </span>
                  )}
                </button>
              </React.Fragment>
            );
          })}
        </nav>

        {/* Footer */}
        <div style={{ padding: "16px", borderTop: `1px solid ${C.border}` }}>
          <button
            onClick={() => { localStorage.clear(); navigate("/login"); }}
            style={{
              display: "flex", alignItems: "center", gap: 10, width: "100%",
              padding: "10px 12px", borderRadius: 8, background: "transparent",
              border: "none", color: C.red, fontSize: 13, fontWeight: 500,
              textAlign: "left", cursor: "pointer", transition: "background 0.18s", fontFamily: "inherit",
            }}
            onMouseEnter={e => e.currentTarget.style.background = C.redLight}
            onMouseLeave={e => e.currentTarget.style.background = "transparent"}
          >
            <LogOut size={16} color={C.red} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* ════ MAIN ════ */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        <div style={{ padding: "0 32px" }}>

          {/* ── HEADER (matches File 1 large serif style) ── */}
          <header style={{ paddingTop: 48, paddingBottom: 24, display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
            <div>
              <h1 style={{ fontSize: 42, fontWeight: 700, color: C.ink, fontFamily: "Georgia, serif", lineHeight: 1, marginBottom: 8 }}>
                {currentNavLabel}
              </h1>
              {tab === "dashboard" ? (
                <p style={{ fontSize: 15, fontWeight: 500, color: C.muted }}>Welcome back, Admin!</p>
              ) : (
                <p style={{ fontSize: 13, fontWeight: 500, color: C.muted, marginTop: 4 }}>
                  <button onClick={() => handleTabChange("dashboard")} style={{ background:"none", border:"none", cursor:"pointer", color: C.gold, fontWeight: 500, fontSize: 13, padding: 0 }}>Dashboard</button>
                  <span style={{ margin: "0 8px", color: C.muted }}>&gt;</span>
                  <span style={{ color: C.ink }}>{currentNavLabel}</span>
                </p>
              )}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 16, paddingBottom: 4 }}>
              <span style={{ fontSize: 13, fontWeight: 500, color: C.muted }}>
                {new Date().toLocaleDateString("en-US", { weekday:"short", day:"numeric", month:"short", year:"numeric" })}
              </span>
              <button type="button"
                onClick={fetchAll}
                style={{ display:"flex", alignItems:"center", gap:6, padding:"8px 16px", borderRadius:99, fontSize:13, fontWeight:500, background: C.bg2, border:`1px solid ${C.border}`, color: C.ink, cursor:"pointer", fontFamily:"inherit" }}
              >
                <RefreshCw size={13} style={{ animation: loading ? "spin 1s linear infinite" : "none" }} />
                Refresh
              </button>
              <button
                type="button"
                onClick={() => handleTabChange("appointments")}
                style={{ position:"relative", cursor:"pointer", width:40, height:40, borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", background:"#fff", border:`1px solid ${C.border}` }}
              >
                <Bell size={17} color={C.muted} />
                {pendingBookings > 0 && (
                  <span style={{ position:"absolute", top:-1, right:-1, minWidth:17, height:17, padding:"0 3px", borderRadius:99, background: C.gold, color:"#fff", fontSize:10, fontWeight:700, display:"flex", alignItems:"center", justifyContent:"center", boxShadow:"0 0 0 2px #fff" }}>
                    {pendingBookings}
                  </span>
                )}
              </button>
              <div ref={adminMenuRef} style={{ position: "relative" }}>
                <button
                  type="button"
                  onClick={() => setAdminMenuOpen((prev) => !prev)}
                  style={{ display:"flex", alignItems:"center", gap:10, paddingLeft:16, borderLeft:`1px solid ${C.border}`, cursor:"pointer", background:"transparent", border:"none", color:"inherit" }}
                >
                  <div style={{ width:36, height:36, borderRadius:"50%", background:"#D1BFA5", display:"flex", alignItems:"center", justifyContent:"center", fontSize:13, fontWeight:700, color:"#fff" }}>AD</div>
                  <div style={{ display:"flex", alignItems:"center", gap:4 }}>
                    <span style={{ fontSize:13, fontWeight:600, color:C.ink }}>Admin</span>
                    <ChevronDown size={13} color={C.muted} />
                  </div>
                </button>

                {adminMenuOpen && (
                  <div
                    style={{
                      position: "absolute",
                      top: "calc(100% + 8px)",
                      right: 0,
                      minWidth: 170,
                      background: "#fff",
                      border: `1px solid ${C.border}`,
                      borderRadius: 10,
                      boxShadow: "0 12px 28px rgba(0,0,0,.12)",
                      overflow: "hidden",
                      zIndex: 30,
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => { handleTabChange("dashboard"); setAdminMenuOpen(false); }}
                      style={{ width: "100%", textAlign: "left", padding: "10px 12px", background: "#fff", border: "none", cursor: "pointer", fontSize: 13, color: C.ink, fontFamily: "inherit" }}
                    >
                      Profile
                    </button>
                    <button
                      type="button"
                      onClick={() => { handleTabChange("settings"); setAdminMenuOpen(false); }}
                      style={{ width: "100%", textAlign: "left", padding: "10px 12px", background: "#fff", border: "none", borderTop: `1px solid ${C.border}`, cursor: "pointer", fontSize: 13, color: C.ink, fontFamily: "inherit" }}
                    >
                      Settings
                    </button>
                    <button
                      type="button"
                      onClick={() => { localStorage.clear(); navigate("/login"); }}
                      style={{ width: "100%", textAlign: "left", padding: "10px 12px", background: "#fff", border: "none", borderTop: `1px solid ${C.border}`, cursor: "pointer", fontSize: 13, color: C.red, fontFamily: "inherit", fontWeight: 600 }}
                    >
                      Logout
                    </button>
                </div>
                )}
              </div>
            </div>
          </header>

          {/* Gold divider line */}
          <div style={{ width:"100%", height:2, background:"#A1804E", opacity:0.9, marginBottom:32 }} />

          {/* ════ MAIN CONTENT ════ */}
          <main style={{ paddingBottom: 60 }}>

            {/* STAT CARDS — shown on all tabs */}
            <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:14, marginBottom:24 }}>
              <StatCard label="Total Customers" value={loading?"—":stats?.customers??customers.length} sub="Registered users" color={C.blue} icon={Users} iconBg={C.blueLight} iconColor={C.blue}/>
              <StatCard label="Active Salons"   value={loading?"—":stats?.salons??salons.filter(s=>s.status==="approved").length} sub="Approved & live" color={C.green} icon={Store} iconBg={C.greenLight} iconColor={C.green}/>
              <StatCard label="Total Bookings"  value={loading?"—":stats?.bookings??bookings.length} sub={`${pendingBookings} pending`} color={C.purple} icon={CalendarCheck} iconBg={C.purpleLight} iconColor={C.purple}/>
              <StatCard label="Revenue"         value={loading?"—":`₹${((stats?.revenue||totalRevenue)/100||0).toLocaleString("en-IN")}`} sub="Total collected" color={C.orange} icon={CreditCard} iconBg={C.orangeLight} iconColor={C.orange}/>
            </div>

             {/* ══ DASHBOARD ══ */}
             {tab==="dashboard" && (
               <div className="fade-in">
                 <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
 
                   {/* Recent Bookings */}
                   <SectionCard title="Recent Bookings" actionLabel="View All →" onAction={()=>handleTabChange("appointments")}>
                     {loading ? <div style={{ padding:20, textAlign:"center", color:C.muted, fontSize:13 }}>Loading...</div>
                     : bookings.length===0 ? <div style={{ padding:40, textAlign:"center", color:C.muted, fontSize:13 }}>No bookings yet</div>
                     : bookings.slice(0,4).map((b,i) => (
                       <div key={b._id} style={{ padding:"12px 20px", borderBottom:i<Math.min(bookings.length, 4)-1?`1px solid ${C.border}`:"none", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                         <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                           <Avatar name={b.customer_id?.name||"C"} size={32} color={C.blue} bg={C.blueLight}/>
                           <div>
                             <div style={{ fontSize:13, fontWeight:600, color:C.ink }}>{b.customer_id?.name||"Customer"}</div>
                             <div style={{ fontSize:11, color:C.muted }}>{b.services?.[0]?.service_name||"Service"} · {b.salon_id?.salon_name||"Salon"}</div>
                           </div>
                         </div>
                         <div style={{ textAlign:"right" }}>
                           <div style={{ fontSize:13, fontWeight:700, color:C.ink, marginBottom:4 }}>₹{b.total_amount}</div>
                           <Badge label={b.status} color={bkStatus(b.status)}/>
                         </div>
                       </div>
                     ))}
                   </SectionCard>
 
                   {/* Barber Status */}
                   <SectionCard title="Barber Status" actionLabel="Live View →" onAction={()=>handleTabChange("live")}>
                     {loading ? <div style={{ padding:20, textAlign:"center", color:C.muted, fontSize:13 }}>Loading...</div>
                     : barbers.length===0 ? <div style={{ padding:40, textAlign:"center", color:C.muted, fontSize:13 }}>No barbers added yet</div>
                     : barbers.slice(0,4).map((b,i) => (
                       <div key={b._id} style={{ padding:"12px 20px", borderBottom:i<Math.min(barbers.length, 4)-1?`1px solid ${C.border}`:"none", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                         <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                           <img src={barberImg(i)} alt={b.name} style={{ width:34, height:34, borderRadius:8, objectFit:"cover", border:`1px solid ${C.border}` }}/>
                           <div>
                             <div style={{ fontSize:13, fontWeight:600, color:C.ink }}>{b.name}</div>
                             <div style={{ fontSize:11, color:C.muted }}>{b.specialization} · {b.salon_id?.salon_name||"—"}</div>
                           </div>
                         </div>
                         <Badge label={b.status} color={bStatus(b.status)}/>
                       </div>
                     ))}
                   </SectionCard>
 
                   {/* Pending Salon Requests */}
                   <SectionCard title="Pending Salon Requests" actionLabel="View All →" onAction={()=>handleTabChange("salons")}>
                     {salons.filter(s=>s.status==="pending").length===0
                       ? <div style={{ padding:40, textAlign:"center", color:C.muted, fontSize:13 }}>No pending requests — all caught up!</div>
                       : salons.filter(s=>s.status==="pending").slice(0,3).map((s,i) => (
                       <div key={s._id} style={{ padding:"12px 20px", borderBottom:i<Math.min(salons.filter(s=>s.status==="pending").length, 3)-1?`1px solid ${C.border}`:"none", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                         <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                           <img src={salonImg(i)} alt={s.salon_name} style={{ width:36, height:36, borderRadius:8, objectFit:"cover" }}/>
                           <div>
                             <div style={{ fontSize:13, fontWeight:600, color:C.ink }}>{s.salon_name}</div>
                             <div style={{ fontSize:11, color:C.muted }}>{s.owner_name} · {s.mobile}</div>
                           </div>
                         </div>
                         <div style={{ display:"flex", gap:6 }}>
                           <button type="button" className="action-btn" onClick={()=>updateSalonStatus(s._id,"approved")} style={btnStyle(`${C.green}15`, C.green, `1px solid ${C.green}30`)}>Approve</button>
                           <button type="button" className="action-btn" onClick={()=>setModal({type:"reject",salon:s})} style={btnStyle(`${C.red}10`, C.red, `1px solid ${C.red}30`)}>Reject</button>
                         </div>
                       </div>
                     ))}
                   </SectionCard>
 
                   {/* Registered Salons (Live) */}
                   <SectionCard title="Registered Salons (Live)" actionLabel="View All →" onAction={()=>handleTabChange("salons")}>
                     {salons.filter(s=>s.status==="approved").length===0
                       ? <div style={{ padding:40, textAlign:"center", color:C.muted, fontSize:13 }}>No approved salons yet</div>
                       : salons.filter(s=>s.status==="approved").slice(0,3).map((s,i) => (
                       <div key={s._id} style={{ padding:"12px 20px", borderBottom:i<Math.min(salons.filter(s=>s.status==="approved").length, 3)-1?`1px solid ${C.border}`:"none", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                         <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                           <img src={s.images?.[0]||salonImg(i)} alt={s.salon_name} style={{ width:36, height:36, borderRadius:8, objectFit:"cover", border:`1px solid ${C.border}` }}/>
                           <div>
                             <div style={{ fontSize:13, fontWeight:600, color:C.ink }}>{s.salon_name}</div>
                             <div style={{ fontSize:11, color:C.muted }}>{s.owner_name} · {s.mobile} · {s.address||"No address"}</div>
                           </div>
                         </div>
                         <Badge label="Active" color={C.green}/>
                       </div>
                     ))}
                   </SectionCard>
 
                   {/* Barber Credentials */}
                   <div style={{ gridColumn: "span 2" }}>
                     <SectionCard title="Barber Credentials">
                       {loading ? <div style={{ padding:20, textAlign:"center", color:C.muted, fontSize:13 }}>Loading...</div>
                       : barbers.length===0
                         ? <div style={{ padding:40, textAlign:"center", color:C.muted, fontSize:13 }}>No barbers in system</div>
                         : (
                           <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, padding: "10px 20px" }}>
                             {barbers.slice(0, 4).map((b,i) => (
                               <div key={b._id} style={{ padding: 12, border: `1px solid ${C.border}`, borderRadius: 12, background: C.goldLight }}>
                                 <div style={{ fontSize:13, fontWeight:700, color:C.ink, marginBottom:6 }}>{b.name}</div>
                                 <div style={{ display:"flex", flexDirection:"column", gap:4 }}>
                                   <span style={{ fontSize:11, color:C.muted }}>Mobile: <strong style={{ color:C.ink }}>{b.mobile}</strong></span>
                                   <span style={{ fontSize:11, color:C.muted }}>Password: <strong style={{ color:C.red }}>••••••••</strong></span>
                                   <span style={{ fontSize:11, color:C.muted }}>Salon: <strong style={{ color:C.gold }}>{b.salon_id?.salon_name || "—"}</strong></span>
                                 </div>
                                 <div style={{ fontSize:10, color:C.muted, marginTop:8, borderTop: `1px solid ${C.border}`, paddingTop: 6 }}>Registered: {b.created_at ? new Date(b.created_at).toLocaleDateString("en-IN") : "—"}</div>
                               </div>
                             ))}
                           </div>
                         )}
                     </SectionCard>
                   </div>
                 </div>
               </div>
             )}

            {/* ══ SALON MANAGEMENT ══ */}
            {tab==="salons" && (
              <div className="fade-in">
                <div style={{ display:"flex", gap:8, marginBottom:16 }}>
                  {["requests","approved","rejected"].map(t=>(
                    <button key={t} className="action-btn" onClick={()=>setSalonTab(t)}
                      style={{ ...btnStyle(salonTab===t ? C.gold : "#fff", salonTab===t ? "#fff" : C.muted, `1px solid ${salonTab===t ? C.gold : C.border}`), padding:"8px 18px", textTransform:"capitalize" }}>
                      {t} ({salons.filter(s=>s.status===(t==="requests"?"pending":t)).length})
                    </button>
                  ))}
                </div>
                {loading ? (
                  <div style={{ padding:60, textAlign:"center" }}>
                    <div style={{ width:24, height:24, border:`2px solid ${C.border}`, borderTopColor:C.gold, borderRadius:"50%", animation:"spin 1s linear infinite", margin:"0 auto" }}/>
                  </div>
                ) : SALONS_FILTERED.length===0 ? (
                  <div style={{ background:C.card, borderRadius:16, border:`1px solid ${C.border}`, padding:60, textAlign:"center", color:C.muted }}>No {salonTab} salons</div>
                ) : (
                  <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))", gap:14 }}>
                    {SALONS_FILTERED.map((s,i)=>(
                      <div key={s._id} style={{ background:C.card, borderRadius:16, border:`1px solid ${C.border}`, overflow:"hidden", boxShadow:"0 1px 4px rgba(0,0,0,.04)" }}>
                        <div style={{ height:140, overflow:"hidden", position:"relative" }}>
                          <img src={s.images?.[0]||salonImg(i)} alt={s.salon_name} style={{ width:"100%", height:"100%", objectFit:"cover" }}/>
                          <div style={{ position:"absolute", inset:0, background:"linear-gradient(to top,rgba(0,0,0,.5),transparent)" }}/>
                          <div style={{ position:"absolute", bottom:10, left:12 }}>
                            <div style={{ fontSize:15, fontWeight:700, color:"#fff", fontFamily:"Georgia, serif" }}>{s.salon_name}</div>
                          </div>
                          <div style={{ position:"absolute", top:10, right:10 }}>
                            <Badge label={s.status} color={s.status==="approved"?C.green:s.status==="rejected"?C.red:C.amber}/>
                          </div>
                        </div>
                        <div style={{ padding:"14px 16px" }}>
                          <div style={{ fontSize:13, fontWeight:600, color:C.ink }}>{s.owner_name}</div>
                          <div style={{ fontSize:11, color:C.muted, marginBottom:8 }}>{s.mobile} · {s.address||"No address"}</div>
                          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:6, marginBottom:10 }}>
                            <div style={{ background:C.bg, borderRadius:8, padding:"7px 8px" }}>
                              <div style={{ fontSize:9, color:C.muted, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.08em" }}>Pricing</div>
                              <div style={{ fontSize:13, color:C.ink, fontWeight:700 }}>₹{s.basic_pricing||0}+</div>
                            </div>
                            <div style={{ background:C.bg, borderRadius:8, padding:"7px 8px" }}>
                              <div style={{ fontSize:9, color:C.muted, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.08em" }}>Barbers</div>
                              <div style={{ fontSize:13, color:C.ink, fontWeight:700 }}>{s.number_of_barbers||0}</div>
                            </div>
                             <div style={{ background:C.bg, borderRadius:8, padding:"5px 6px" }}>
                              <div style={{ fontSize:9, color:C.muted, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.08em", marginBottom: 2 }}>Limit</div>
                              <input
                                type="number"
                                min="1"
                                value={s.max_barbers_limit !== undefined ? s.max_barbers_limit : 3}
                                onChange={(e) => {
                                  const val = e.target.value === "" ? "" : Number(e.target.value);
                                  setSalons(p => p.map(salon => salon._id === s._id ? { ...salon, max_barbers_limit: val } : salon));
                                }}
                                onBlur={(e) => {
                                  const val = Number(e.target.value) || 3;
                                  updateSalonCapacity(s._id, val);
                                }}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") {
                                    e.target.blur();
                                  }
                                }}
                                style={{
                                  width: "100%",
                                  border: `1px solid ${C.gold}60`,
                                  background: "#fff",
                                  borderRadius: 6,
                                  fontSize: 12,
                                  color: C.ink,
                                  fontWeight: 700,
                                  outline: "none",
                                  padding: "3px 4px",
                                  margin: 0,
                                  textAlign: "center"
                                }}
                              />
                            </div>
                          </div>
                          {salonTab==="rejected" && s.rejection_reason && (
                            <div style={{ fontSize:11, color:C.red, background:C.redLight, border:`1px solid ${C.red}25`, borderRadius:8, padding:8, marginBottom:10 }}>
                              Reason: {s.rejection_reason}
                            </div>
                          )}
                          <div style={{ fontSize:11, color:C.muted, marginBottom:12 }}>
                            Registered: {s.created_at ? new Date(s.created_at).toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"}) : "—"}
                          </div>
                          {salonTab==="requests" && (
                            <div style={{ display:"flex", gap:8 }}>
                              <button className="action-btn" disabled={busy} onClick={()=>updateSalonStatus(s._id,"approved")} style={{ ...btnStyle(`${C.green}15`, C.green, `1px solid ${C.green}30`), flex:1, justifyContent:"center" }}>Approve</button>
                              <button className="action-btn" disabled={busy} onClick={()=>setModal({type:"reject",salon:s})} style={{ ...btnStyle(`${C.red}10`, C.red, `1px solid ${C.red}30`), flex:1, justifyContent:"center" }}>Reject</button>
                            </div>
                          )}
                          {salonTab==="approved" && (
                            <button type="button" className="action-btn" onClick={()=>updateSalonStatus(s._id,"rejected","Suspended by admin")} style={{ ...btnStyle(`${C.red}10`, C.red, `1px solid ${C.red}30`), width:"100%", justifyContent:"center" }}>Suspend</button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ══ CUSTOMERS ══ */}
            {tab==="customers" && (() => {
              const filtered = customers.filter(c=>!search||c.name?.toLowerCase().includes(search.toLowerCase())||c.mobile?.includes(search));
              const totalPages = Math.ceil(filtered.length / custPerPage) || 1;
              const startIndex = (custPage - 1) * custPerPage;
              const paginated = filtered.slice(startIndex, startIndex + custPerPage);

              return (
                <div className="fade-in">
                  <div style={{ background:C.card, borderRadius:16, border:`1px solid ${C.border}`, overflow:"hidden", boxShadow:"0 1px 4px rgba(0,0,0,.04)" }}>
                    <div style={{ padding:"14px 20px", borderBottom:`1px solid ${C.border}`, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                      <span style={{ fontSize:16, fontWeight:700, color:C.ink, fontFamily:"Georgia, serif" }}>{filtered.length} Customers</span>
                      <input className="inp" value={search} onChange={e=>{ setSearch(e.target.value); setCustPage(1); }} placeholder="Search by name or mobile..." style={{ ...inputStyle, width:220, padding:"7px 12px", fontSize:12 }}/>
                    </div>
                    {loading ? <div style={{ padding:40, textAlign:"center", color:C.muted }}>Loading...</div>
                    : filtered.length===0 ? <div style={{ padding:40, textAlign:"center", color:C.muted }}>No customers yet</div>
                    : (
                      <>
                        <table style={{ width:"100%", borderCollapse:"collapse" }}>
                          <thead><tr>{["Customer","Mobile","Email","Loyalty Points","Joined","Status","Actions"].map(h=><TH key={h}>{h}</TH>)}</tr></thead>
                          <tbody>
                            {paginated.map(c=>(
                              <tr key={c._id} className="tr">
                                <TD><div style={{ display:"flex", alignItems:"center", gap:8 }}><Avatar name={c.name||"C"} size={30} color={C.blue} bg={C.blueLight}/><span style={{ fontSize:13, fontWeight:600, color:C.ink }}>{c.name||"—"}</span></div></TD>
                                <TD style={{ fontSize:12, color:C.muted, fontFamily:"monospace" }}>{c.mobile}</TD>
                                <TD style={{ fontSize:12, color:C.muted }}>{c.email||"—"}</TD>
                                <TD style={{ fontSize:13, fontWeight:700, color:C.gold }}>{c.loyalty_points||0}</TD>
                                <TD style={{ fontSize:12, color:C.muted }}>{c.created_at?new Date(c.created_at).toLocaleDateString("en-IN",{day:"numeric",month:"short"}):"—"}</TD>
                                <TD><Badge label={c.blocked?"Blocked":"Active"} color={c.blocked?C.red:C.green}/></TD>
                                <TD>
                                  <button className="action-btn" onClick={()=>blockCustomer(c._id,!c.blocked)}
                                    style={btnStyle(c.blocked?`${C.green}15`:`${C.red}10`, c.blocked?C.green:C.red, `1px solid ${c.blocked?C.green:C.red}30`)}>
                                    {c.blocked?"Unblock":"Block"}
                                  </button>
                                </TD>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                        
                        {/* Premium Pagination Control Footer */}
                        <div style={{
                          padding: "12px 20px",
                          borderTop: `1px solid ${C.border}`,
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          flexWrap: "wrap",
                          gap: 12,
                          background: "#FAFAF8"
                        }}>
                          <div style={{ fontSize: 12, color: C.muted, fontWeight: 505 }}>
                            Showing {filtered.length === 0 ? 0 : startIndex + 1} - {Math.min(startIndex + custPerPage, filtered.length)} of {filtered.length} customers
                          </div>
                          
                          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                            {/* Page size dropdown */}
                            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                              <span style={{ fontSize: 12, color: C.muted, fontWeight: 505 }}>Show:</span>
                              <select 
                                value={custPerPage} 
                                onChange={(e) => {
                                  setCustPerPage(Number(e.target.value));
                                  setCustPage(1);
                                }}
                                style={{
                                  padding: "4px 8px",
                                  borderRadius: 8,
                                  border: `1px solid ${C.border}`,
                                  background: "#fff",
                                  fontSize: 12,
                                  color: C.ink,
                                  cursor: "pointer",
                                  outline: "none",
                                  fontWeight: 600
                                }}
                              >
                                <option value={5}>5</option>
                                <option value={10}>10</option>
                                <option value={20}>20</option>
                                <option value={50}>50</option>
                              </select>
                            </div>

                            {/* Page selection dropdown */}
                            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                              <span style={{ fontSize: 12, color: C.muted, fontWeight: 505 }}>Page:</span>
                              <select
                                value={custPage}
                                onChange={(e) => setCustPage(Number(e.target.value))}
                                style={{
                                  padding: "4px 8px",
                                  borderRadius: 8,
                                  border: `1px solid ${C.border}`,
                                  background: "#fff",
                                  fontSize: 12,
                                  color: C.ink,
                                  cursor: "pointer",
                                  outline: "none",
                                  fontWeight: 600
                                }}
                              >
                                {Array.from({ length: totalPages }, (_, idx) => (
                                  <option key={idx + 1} value={idx + 1}>{idx + 1}</option>
                                ))}
                              </select>
                              <span style={{ fontSize: 12, color: C.muted, fontWeight: 505 }}>of {totalPages}</span>
                            </div>

                            {/* Prev / Next buttons */}
                            <div style={{ display: "flex", gap: 6 }}>
                              <button
                                disabled={custPage === 1}
                                onClick={() => setCustPage(p => Math.max(p - 1, 1))}
                                style={{
                                  padding: "5px 12px",
                                  borderRadius: 8,
                                  border: `1px solid ${C.border}`,
                                  background: custPage === 1 ? "#F5F5F4" : "#fff",
                                  color: custPage === 1 ? "#A8A29E" : C.ink,
                                  fontSize: 12,
                                  fontWeight: 650,
                                  cursor: custPage === 1 ? "not-allowed" : "pointer",
                                  transition: "all 0.2s",
                                  boxShadow: "0 1px 2px rgba(0,0,0,0.05)"
                                }}
                              >
                                Prev
                              </button>
                              <button
                                disabled={custPage >= totalPages}
                                onClick={() => setCustPage(p => Math.min(p + 1, totalPages))}
                                style={{
                                  padding: "5px 12px",
                                  borderRadius: 8,
                                  border: `1px solid ${C.border}`,
                                  background: custPage >= totalPages ? "#F5F5F4" : "#fff",
                                  color: custPage >= totalPages ? "#A8A29E" : C.ink,
                                  fontSize: 12,
                                  fontWeight: 650,
                                  cursor: custPage >= totalPages ? "not-allowed" : "pointer",
                                  transition: "all 0.2s",
                                  boxShadow: "0 1px 2px rgba(0,0,0,0.05)"
                                }}
                              >
                                Next
                              </button>
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              );
            })()}



            {/* ══ APPOINTMENTS ══ */}
            {tab==="appointments" && (
              <div className="fade-in">
                <div style={{ background:C.card, borderRadius:16, border:`1px solid ${C.border}`, overflow:"hidden", boxShadow:"0 1px 4px rgba(0,0,0,.04)" }}>
                  <div style={{ padding:"14px 20px", borderBottom:`1px solid ${C.border}` }}>
                    <span style={{ fontSize:16, fontWeight:700, color:C.ink, fontFamily:"Georgia, serif" }}>{bookings.length} Appointments</span>
                  </div>
                  {loading ? <div style={{ padding:40, textAlign:"center", color:C.muted }}>Loading...</div>
                  : bookings.length===0 ? <div style={{ padding:40, textAlign:"center", color:C.muted }}>No bookings yet</div>
                  : (
                    <table style={{ width:"100%", borderCollapse:"collapse" }}>
                      <thead><tr>{["Customer","Service","Barber","Salon","Date","Amount","Status","Actions"].map(h=><TH key={h}>{h}</TH>)}</tr></thead>
                      <tbody>
                        {bookings.map(b=>(
                          <tr key={b._id} className="tr">
                            <TD><div style={{ display:"flex", alignItems:"center", gap:8 }}><Avatar name={b.customer_id?.name||"C"} size={28} color={C.blue} bg={C.blueLight}/><span style={{ fontSize:13, fontWeight:600, color:C.ink }}>{b.customer_id?.name||"—"}</span></div></TD>
                            <TD style={{ fontSize:12, color:C.muted }}>{b.services?.[0]?.service_name||"—"}</TD>
                            <TD style={{ fontSize:12, color:C.gold }}>{b.barber_id?.name||"—"}</TD>
                            <TD style={{ fontSize:12, color:C.muted }}>{b.salon_id?.salon_name||"—"}</TD>
                            <TD style={{ fontSize:12, color:C.muted }}>{b.created_at?new Date(b.created_at).toLocaleDateString("en-IN"):"—"}</TD>
                            <TD style={{ fontSize:13, fontWeight:700, color:C.ink }}>₹{b.total_amount||0}</TD>
                            <TD><Badge label={b.status} color={bkStatus(b.status)}/></TD>
                            <TD>
                              {b.status==="pending" && (
                                <div style={{ display:"flex", gap:6 }}>
                                  <button className="action-btn" onClick={()=>changeBookingStatus(b._id,"confirmed")} style={btnStyle(`${C.green}15`, C.green, `1px solid ${C.green}30`)}>Confirm</button>
                                  <button className="action-btn" onClick={()=>changeBookingStatus(b._id,"cancelled")} style={btnStyle(`${C.red}10`, C.red, `1px solid ${C.red}30`)}>Cancel</button>
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
              <div className="fade-in">
                <div style={{ background:C.card, borderRadius:16, border:`1px solid ${C.border}`, overflow:"hidden", boxShadow:"0 1px 4px rgba(0,0,0,.04)" }}>
                  {services.length===0 ? <div style={{ padding:40, textAlign:"center", color:C.muted }}>No services yet</div>
                  : (
                    <table style={{ width:"100%", borderCollapse:"collapse" }}>
                      <thead><tr>{["Service","Salon","Category","Price","Duration","Status","Actions"].map(h=><TH key={h}>{h}</TH>)}</tr></thead>
                      <tbody>
                        {services.map(s=>(
                          <tr key={s._id} className="tr">
                            <TD style={{ fontSize:13, fontWeight:600, color:C.ink }}>{s.name}</TD>
                            <TD style={{ fontSize:12, color:C.gold }}>{s.salon_id?.salon_name||"—"}</TD>
                            <TD><Badge label={s.category} color={s.category==="men"?C.blue:s.category==="women"?C.purple:C.amber}/></TD>
                            <TD style={{ fontSize:13, fontWeight:700, color:C.gold }}>₹{s.price}</TD>
                            <TD style={{ fontSize:12, color:C.muted }}>{s.duration} min</TD>
                            <TD><Badge label={s.is_active?"Active":"Inactive"} color={s.is_active?C.green:C.red}/></TD>
                            <TD>
                              <div style={{ display:"flex", gap:6 }}>
                                <button className="action-btn" onClick={()=>toggleService(s._id,!s.is_active)} style={btnStyle(`${C.gold}15`, C.gold, `1px solid ${C.gold}30`)}>{s.is_active?"Disable":"Enable"}</button>
                                <button className="action-btn" onClick={()=>deleteService(s._id)} style={btnStyle(`${C.red}10`, C.red, `1px solid ${C.red}30`)}>Delete</button>
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
              <div className="fade-in">
                <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:14, marginBottom:16 }}>
                  <StatCard label="Total Collected" value={`₹${(payments.filter(p=>p.status==="captured").reduce((a,b)=>a+(b.amount||0),0)/100).toLocaleString("en-IN")}`} sub="Captured payments" color={C.green} icon={CreditCard} iconBg={C.greenLight} iconColor={C.green}/>
                  <StatCard label="Pending" value={payments.filter(p=>p.status==="pending").length} sub="Awaiting capture" color={C.amber} icon={CreditCard} iconBg={C.orangeLight} iconColor={C.orange}/>
                  <StatCard label="Refunded" value={payments.filter(p=>p.status==="refunded").length} sub="Returned to customer" color={C.red} icon={CreditCard} iconBg={C.redLight} iconColor={C.red}/>
                </div>
                <div style={{ background:C.card, borderRadius:16, border:`1px solid ${C.border}`, overflow:"hidden", boxShadow:"0 1px 4px rgba(0,0,0,.04)" }}>
                  {payments.length===0 ? <div style={{ padding:40, textAlign:"center", color:C.muted }}>No payments yet</div>
                  : (
                    <table style={{ width:"100%", borderCollapse:"collapse" }}>
                      <thead><tr>{["Customer","Salon","Amount","Type","Status","Date"].map(h=><TH key={h}>{h}</TH>)}</tr></thead>
                      <tbody>
                        {payments.map(p=>(
                          <tr key={p._id} className="tr">
                            <TD><div style={{ display:"flex", alignItems:"center", gap:8 }}><Avatar name={p.customer_id?.name||"C"} size={28} color={C.purple} bg={C.purpleLight}/><span style={{ fontSize:13, fontWeight:600, color:C.ink }}>{p.customer_id?.name||"—"}</span></div></TD>
                            <TD style={{ fontSize:12, color:C.gold }}>{p.salon_id?.salon_name||"—"}</TD>
                            <TD style={{ fontSize:13, fontWeight:700, color:C.ink }}>₹{(p.amount||0)/100}</TD>
                            <TD><Badge label={p.payment_type||"token"} color={p.payment_type==="full"?C.green:C.blue}/></TD>
                            <TD><Badge label={p.status} color={pyStatus(p.status)}/></TD>
                            <TD style={{ fontSize:12, color:C.muted }}>{p.created_at?new Date(p.created_at).toLocaleDateString("en-IN"):"—"}</TD>
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
              <div className="fade-in">
                {reviews.length===0 ? <div style={{ background:C.card, borderRadius:16, border:`1px solid ${C.border}`, padding:60, textAlign:"center", color:C.muted }}>No reviews yet</div>
                : (
                  <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))", gap:14 }}>
                    {reviews.map(r=>(
                      <div key={r._id} style={{ background:C.card, borderRadius:16, border:`1px solid ${C.border}`, padding:18, boxShadow:"0 1px 4px rgba(0,0,0,.04)" }}>
                        <div style={{ display:"flex", justifyContent:"space-between", marginBottom:10 }}>
                          <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                            <Avatar name={r.customer_id?.name||"C"} size={32} color={C.purple} bg={C.purpleLight}/>
                            <div>
                              <div style={{ fontSize:13, fontWeight:600, color:C.ink }}>{r.customer_id?.name||"Customer"}</div>
                              <div style={{ fontSize:11, color:C.muted }}>{r.salon_id?.salon_name||"—"}</div>
                            </div>
                          </div>
                          <button className="action-btn" onClick={()=>deleteReview(r._id)} style={btnStyle(`${C.red}10`, C.red, `1px solid ${C.red}30`)}>Delete</button>
                        </div>
                        <div style={{ display:"flex", gap:2, marginBottom:8 }}>
                          {[1,2,3,4,5].map(s=>(<span key={s} style={{ fontSize:14, color:s<=r.rating?C.gold:"#D1C5BA" }}>★</span>))}
                        </div>
                        <div style={{ fontSize:13, color:C.muted, lineHeight:1.6 }}>{r.review_text||"No comment"}</div>
                        <div style={{ fontSize:10, color:C.border, marginTop:8 }}>{r.created_at?new Date(r.created_at).toLocaleDateString("en-IN"):"—"}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ══ LIVE MONITORING ══ */}
            {tab==="live" && (
              <div className="fade-in">
                <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:16, background:C.card, padding:"10px 16px", borderRadius:10, border:`1px solid ${C.border}`, width:"fit-content", boxShadow:"0 1px 4px rgba(0,0,0,.04)" }}>
                  <div style={{ width:8, height:8, borderRadius:"50%", background:C.green }}/>
                  <span style={{ fontSize:12, color:C.green, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.08em" }}>Live Monitoring Active</span>
                  <span style={{ fontSize:12, color:C.muted }}>· {barbers.length} barbers tracked</span>
                </div>
                {barbers.length===0 ? <div style={{ background:C.card, borderRadius:16, border:`1px solid ${C.border}`, padding:60, textAlign:"center", color:C.muted }}>No barbers to monitor</div>
                : (
                  <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))", gap:14 }}>
                    {barbers.map((b,i)=>(
                      <div key={b._id} style={{ background:C.card, borderRadius:16, border:`2px solid ${b.status==="available"?C.green+"40":C.border}`, overflow:"hidden", boxShadow:"0 1px 4px rgba(0,0,0,.04)" }}>
                        <div style={{ height:160, overflow:"hidden", position:"relative" }}>
                          <img src={barberImg(i)} alt={b.name} style={{ width:"100%", height:"100%", objectFit:"cover" }}/>
                          <div style={{ position:"absolute", inset:0, background:"linear-gradient(to top,rgba(0,0,0,.6),transparent)" }}/>
                          <div style={{ position:"absolute", bottom:10, left:12 }}>
                            <div style={{ fontSize:15, fontWeight:700, color:"#fff", fontFamily:"Georgia, serif" }}>{b.name}</div>
                            <div style={{ fontSize:11, color:"rgba(255,255,255,.7)" }}>{b.specialization}</div>
                          </div>
                          <div style={{ position:"absolute", top:10, right:10 }}>
                            <Badge label={b.status} color={bStatus(b.status)}/>
                          </div>
                        </div>
                        <div style={{ padding:"14px 16px" }}>
                          <div style={{ fontSize:12, color:C.muted, marginBottom:12 }}>Salon: <span style={{ color:C.gold, fontWeight:700 }}>{b.salon_id?.salon_name||"—"}</span></div>
                          <div style={{ display:"flex", gap:6 }}>
                            {["available","break","offline"].map(s=>(
                              <button key={s} className="action-btn" disabled={b.status===s}
                                onClick={()=>changeBarberStatus(b._id,s)}
                                style={{ flex:1, padding:"6px 4px", fontSize:10, fontWeight:700, borderRadius:6, cursor:"pointer", border:`1px solid ${b.status===s?bStatus(s)+"50":C.border}`, background:b.status===s?`${bStatus(s)}20`:"#F7F5F2", color:b.status===s?bStatus(s):C.muted, fontFamily:"inherit", textAlign:"center", textTransform:"capitalize" }}>
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
              <div className="fade-in" style={{ maxWidth:560, margin:"0 auto" }}>
                <div style={{ background:C.card, borderRadius:16, border:`1px solid ${C.border}`, overflow:"hidden", boxShadow:"0 1px 4px rgba(0,0,0,.04)" }}>
                  <div style={{ padding:"16px 20px", borderBottom:`1px solid ${C.border}` }}>
                    <span style={{ fontSize:18, fontWeight:700, color:C.ink, fontFamily:"Georgia, serif" }}>System Settings</span>
                  </div>
                  {[
                    { label:"Platform Name",       placeholder:"Barber Pro",            type:"text" },
                    { label:"Support Email",        placeholder:"support@barberpro.com", type:"email" },
                    { label:"Support Mobile",       placeholder:"9999999999",            type:"tel" },
                    { label:"Commission %",         placeholder:"10",                    type:"number" },
                    { label:"Token Payment %",      placeholder:"20",                    type:"number" },
                    { label:"Default Opening Time", placeholder:"09:00 AM",              type:"text" },
                    { label:"Default Closing Time", placeholder:"09:00 PM",              type:"text" },
                    { label:"GST %",                placeholder:"18",                    type:"number" },
                  ].map((f,i)=>(
                    <div key={i} style={{ padding:"12px 20px", borderBottom:`1px solid ${C.border}`, display:"flex", alignItems:"center", gap:16 }}>
                      <label style={{ fontSize:13, fontWeight:500, color:C.ink, minWidth:180, lineHeight:1.6 }}>{f.label}</label>
                      <input className="inp" type={f.type} placeholder={f.placeholder} style={{ ...inputStyle, flex:1 }}/>
                    </div>
                  ))}
                  <div style={{ padding:"16px 20px", display:"flex", justifyContent:"center" }}>
                    <button className="action-btn" onClick={()=>pop("Settings saved!")}
                      style={{ width:"auto", minWidth:200, padding:"13px 32px", background:`linear-gradient(135deg,${C.gold},${C.goldD})`, color:"#fff", fontSize:13, fontWeight:700, justifyContent:"center", borderRadius:10, border:"none", cursor:"pointer", fontFamily:"inherit", display:"flex", alignItems:"center" }}>
                      Save Settings
                    </button>
                  </div>
                </div>
              </div>
            )}

          </main>
        </div>
      </div>

      {/* ══ REJECT MODAL ══ */}
      {modal?.type==="reject" && (
        <div style={{ position:"fixed", inset:0, zIndex:50, display:"flex", alignItems:"center", justifyContent:"center", padding:16, background:"rgba(0,0,0,.5)", backdropFilter:"blur(4px)" }}
          onClick={()=>{ setModal(null); setReason(""); }}>
          <div style={{ background:C.card, border:`1px solid ${C.border}`, width:"100%", maxWidth:400, borderRadius:16, padding:24, boxShadow:"0 20px 60px rgba(0,0,0,.15)" }}
            onClick={e=>e.stopPropagation()}>
            <div style={{ fontSize:22, fontWeight:700, color:C.ink, fontFamily:"Georgia, serif", marginBottom:4 }}>Reject Salon</div>
            <div style={{ fontSize:12, color:C.muted, marginBottom:16, lineHeight:1.6 }}>{modal.salon?.salon_name} — {modal.salon?.owner_name}</div>
            <label style={{ display:"block", fontSize:10, fontWeight:700, color:C.muted, textTransform:"uppercase", letterSpacing:1.2, marginBottom:6 }}>Rejection Reason</label>
            <textarea className="inp" value={reason} onChange={e=>setReason(e.target.value)} placeholder="Provide reason..." style={{ ...inputStyle, height:80, resize:"none", lineHeight:1.6 }}/>
            <div style={{ display:"flex", gap:8, marginTop:14 }}>
              <button type="button" onClick={()=>{ setModal(null); setReason(""); }} style={{ flex:1, padding:10, border:`1px solid ${C.border}`, borderRadius:8, color:C.muted, fontSize:13, background:"#fff", cursor:"pointer", fontFamily:"inherit" }}>Cancel</button>
              <button type="button" className="action-btn" disabled={!reason.trim()||busy} onClick={()=>updateSalonStatus(modal.salon._id,"rejected",reason)}
                style={{ flex:2, padding:10, background:reason.trim()?C.red:"#FCA5A5", color:"#fff", borderRadius:8, fontSize:13, fontWeight:700, border:"none", cursor:"pointer", fontFamily:"inherit" }}>
                {busy?"Processing...":"Confirm Rejection"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══ TOAST ══ */}
      {toast && (
        <div style={{
          position:"fixed", bottom:24, right:24, zIndex:100,
          padding:"12px 20px", borderRadius:12, fontWeight:600, fontSize:14,
          color:"#fff", animation:"slideIn .3s ease",
          background: toast.type==="error" ? C.red : C.green,
          boxShadow:"0 8px 24px rgba(0,0,0,.2)",
        }}>
          {toast.msg}
        </div>
      )}
    </div>
  );
}
