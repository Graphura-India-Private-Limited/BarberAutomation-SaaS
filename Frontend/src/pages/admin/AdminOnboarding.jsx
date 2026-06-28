
import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, Store, Users, UserSquare2, UserPlus2, 
  CalendarCheck, Scissors, CreditCard, Star, Activity, Settings, LogOut,
  Bell, RefreshCw, ChevronDown, X, Eye, Minimize2, Maximize2, Award, Phone, ShieldCheck, FileText, Inbox, Menu
} from "lucide-react";  
import { useTickets } from "../../utils/useTickets";
import { TicketsPage } from "./TicketsPage";
import { 
  ResponsiveContainer, AreaChart, Area, BarChart, Bar, XAxis, YAxis, 
  CartesianGrid, Tooltip, Legend 
} from "recharts";

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
    whiteSpace: "nowrap", display: "inline-block"
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


const StatCard = ({ label, value, color, sub, icon: Icon, iconBg, iconColor, onClick }) => (
  <button
    onClick={onClick}
    style={{
      background: "#FFFFFF",
      borderRadius: 12,
      padding: "18px 20px",
      border: "1px solid #E7E5E4",
      boxShadow: "0 1px 4px rgba(0,0,0,.04)",
      cursor: onClick ? "pointer" : "default",
      position: "relative",
      overflow: "hidden",
      transition: "transform 0.22s ease, box-shadow 0.22s ease, border-color 0.22s ease",
      outline: "none",
      textAlign: "left",
      width: "100%",
      fontFamily: "inherit",
    }}
    onMouseEnter={e => {
      if (!onClick) return;
      e.currentTarget.style.transform = "translateY(-3px)";
      e.currentTarget.style.boxShadow = "0 8px 28px rgba(197,160,89,0.13), 0 2px 8px rgba(0,0,0,0.07)";
      e.currentTarget.style.border = "1.5px solid #C5A059";
      const arrow = e.currentTarget.querySelector(".sc-arrow");
      if (arrow) {
        arrow.style.transform = "translateX(3px)";
        arrow.style.opacity = "1";
      }
    }}
    onMouseLeave={e => {
      e.currentTarget.style.transform = "translateY(0)";
      e.currentTarget.style.boxShadow = "0 1px 4px rgba(0,0,0,.04)";
      e.currentTarget.style.border = "1px solid #E7E5E4";
      const arrow = e.currentTarget.querySelector(".sc-arrow");
      if (arrow) {
        arrow.style.transform = "translateX(0)";
        arrow.style.opacity = "0.5";
      }
    }}
    onFocus={e => {
      if (!onClick) return;
      e.currentTarget.style.boxShadow = "0 0 0 3px rgba(197,160,89,0.35)";
      e.currentTarget.style.transform = "translateY(-2px)";
    }}
    onBlur={e => {
      e.currentTarget.style.boxShadow = "0 1px 4px rgba(0,0,0,.04)";
      e.currentTarget.style.transform = "translateY(0)";
    }}
  >
    {/* Label */}
    <div
      style={{
        fontSize: 13,
        color: C.muted,
        fontWeight: 500,
        marginBottom: 12,
      }}
    >
      {label}
    </div>

    {/* Value + Icon row */}
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <div
        style={{
          fontSize: 26,
          fontWeight: 700,
          color: C.ink,
          fontFamily: "Georgia, serif",
          lineHeight: 1,
        }}
      >
        {value}
      </div>

      {Icon && (
        <div
          style={{
            padding: 10,
            borderRadius: 8,
            background: iconBg || C.goldLight,
          }}
        >
          <Icon size={20} color={iconColor || C.gold} />
        </div>
      )}
    </div>

    {/* Sub text */}
    {sub && (
      <div
        style={{
          fontSize: 12,
          color,
          fontWeight: 500,
          marginTop: 6,
        }}
      >
        {sub}
      </div>
    )}

    {/* Footer — only rendered when card is clickable */}
    {onClick && (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginTop: 12,
          paddingTop: 10,
          borderTop: "1px solid #F0EDEA",
        }}
      >
        <span
          style={{
            fontSize: 11,
            color: "#A9A09A",
            fontWeight: 500,
            letterSpacing: "0.01em",
          }}
        >
          View details
        </span>

        <span
          className="sc-arrow"
          style={{
            fontSize: 13,
            color: C.gold,
            fontWeight: 700,
            opacity: 0.5,
            transition: "transform 0.2s ease, opacity 0.2s ease",
            display: "inline-block",
            lineHeight: 1,
          }}
        >
          →
        </span>
      </div>
    )}
  </button>
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

const formatDate = (value) => {
  if (!value) return "—";
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? value : parsed.toLocaleDateString("en-US", { day: "2-digit", month: "short", year: "numeric" });
};

const PaginationSelect = ({ value, onChange, options }) => (
  <div style={{ position: "relative", display: "inline-block" }}>
    <select
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      style={{
        padding: "5px 28px 5px 12px",
        borderRadius: 10,
        border: `1px solid ${C.border}`,
        background: "#FAF9F6",
        fontSize: 11,
        color: C.ink,
        cursor: "pointer",
        outline: "none",
        fontWeight: 700,
        textTransform: "uppercase",
        letterSpacing: "0.05em",
        appearance: "none",
        WebkitAppearance: "none",
        MozAppearance: "none"
      }}
    >
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
    <div style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", pointerEvents: "none", display: "flex", alignItems: "center", color: C.gold }}>
      <ChevronDown size={12} style={{ strokeWidth: "2.5px" }} />
    </div>
  </div>
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
  { k: "reviews", label: "Salon Performance" },
  { k: "tickets", label: "Support Tickets" },
  { k: "ownerRequests", label: "Owner Requests" },
  { k: "settings", label: "Settings" },
];

const salonImg = (i) => ["https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=400&q=80","https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=400&q=80","https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=400&q=80","https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=400&q=80"][i%4];
const barberImg = (i) => [
  "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=200&q=80",
  "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&w=200&q=80",
  "https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&w=200&q=80",
  "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?auto=format&fit=crop&w=200&q=80",
  "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=200&q=80"
][i % 5];

const bStatus  = s => s === "available" ? C.green : s === "busy" ? C.amber : s === "break" ? C.blue : "#9CA3AF";
const bkStatus = s => s === "completed" ? C.green : s === "pending" ? C.purple : s === "cancelled" ? C.red : C.blue;
const pyStatus = s => s === "captured" ? C.green : s === "refunded" ? C.blue : s === "pending" ? C.amber : C.red;

const getStatusBadge = (status) => {
  switch (status) {
    case "available":
      return {
        label: "Present & Available",
        bg: C.greenLight,
        color: C.green,
        border: `${C.green}30`
      };
    case "busy":
      return {
        label: "Busy",
        bg: C.redLight,
        color: C.red,
        border: `${C.red}30`
      };
    case "break":
      return {
        label: "On Break",
        bg: C.orangeLight,
        color: C.orange,
        border: `${C.orange}30`
      };
    default:
      return {
        label: "Offline",
        bg: "#FAFAF8",
        color: C.muted,
        border: C.border
      };
  }
};

const NAV_ICONS = {
  dashboard: LayoutDashboard, salons: Store, customers: Users,
  barbers: UserSquare2, addbarber: UserPlus2, appointments: CalendarCheck,
  services: Scissors, payments: CreditCard, reviews: Star,
  tickets: Inbox, live: Activity, settings: Settings, ownerRequests: ShieldCheck
};

const DocumentPreview = ({ label, data }) => {
  if (!data) {
    return (
      <div style={{ border: "1px dashed #EADBCE", borderRadius: 12, padding: 12, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", backgroundColor: "#FAF6F0", height: 110 }}>
        <span style={{ color: "#78716C", fontSize: 11, fontWeight: 700, textAlign: "center" }}>{label}</span>
        <span style={{ fontSize: 9, color: "#78716C", marginTop: 4 }}>Not Uploaded</span>
      </div>
    );
  }

  const isPdf = data.startsWith("data:application/pdf");

  return (
    <div style={{ border: "1px solid #EADBCE", borderRadius: 12, padding: 12, display: "flex", flexDirection: "column", justifyContent: "between", backgroundColor: "#FFFFFF", height: 130, boxShadow: "0 1px 2px rgba(0,0,0,.03)" }}>
      <div>
        <span style={{ color: "#1C1917", fontSize: 11, fontWeight: 700, display: "block", marginBottom: 6 }}>{label}</span>
        {isPdf ? (
          <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#DC2626", background: "#FEF2F2", border: "1px solid #FEF2F2", borderRadius: 6, padding: 6, marginTop: 4 }}>
            <span style={{ fontSize: 11, fontWeight: 900 }}>PDF</span>
            <span style={{ fontSize: 9, color: "#78716C", fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 100 }}>Document.pdf</span>
          </div>
        ) : (
          <div style={{ width: "100%", height: 50, borderRadius: 4, overflow: "hidden", border: "1px solid #E7E5E4" }}>
            <img src={data} alt={label} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
        )}
      </div>
      <a
        href={data}
        download={`${label.replace(/\s+/g, "_")}_doc${isPdf ? ".pdf" : ".png"}`}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          marginTop: 8, display: "block", textAlign: "center", bg: "#C5A059", background: "#C5A059", color: "#FFFFFF", fontSize: 9, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5, padding: "5px 0", borderRadius: 6, textDecoration: "none", cursor: "pointer"
        }}
      >
        View / Download
      </a>
    </div>
  );
};

export default function AdminOnboarding() {
  const navigate  = useNavigate();
  const location  = useLocation();
  const photoRef  = useRef();
  const docRef    = useRef();
  const adminMenuRef = useRef(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showBranchDropdown, setShowBranchDropdown] = useState(false);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [showMobileStatsDropdown, setShowMobileStatsDropdown] = useState(false);

  const ROUTE_TAB_MAP = {
    "/admin": "dashboard",
    "/admin/": "dashboard",
    "/admin/salons": "salons",
    "/admin/salon-management": "salons",
    "/admin/customers": "customers",
    "/admin/appointments": "appointments",
    "/admin/services": "services",
    "/admin/payments": "payments",
    "/admin/reviews": "reviews",
    "/admin/tickets": "tickets",
    "/admin/customer-issues": "tickets",
    "/admin/salon-issues": "tickets",
    "/admin/owner-requests": "ownerRequests",
    "/admin/requests": "ownerRequests",
    "/admin/ownerRequests": "ownerRequests",
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

  const handleTabChange = (tabKey, salonId = "") => {
    setTab(tabKey);
    setSelectedSalonId(salonId);
    setIsSidebarOpen(false);
    if (tabKey === "dashboard") {
      navigate("/admin");
    } else if (tabKey === "salons") {
      navigate("/admin/salon-management");
    } else if (tabKey === "settings") {
      navigate("/admin/platform-settings");
    } else if (tabKey === "ownerRequests") {
      navigate("/admin/owner-requests");
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
  const [bookingFeedbacks, setBookingFeedbacks] = useState([]);
  const [payments,   setPayments]  = useState([]);
  const [modal,      setModal]     = useState(null);
  const [toast,      setToast]     = useState(null);
  const [search,     setSearch]    = useState("");
  const [salonTab,   setSalonTab]  = useState("requests");
  const [reason,     setReason]    = useState("");
  const [busy,       setBusy]      = useState(false);
  const [addedBarbers, setAddedBarbers] = useState([]);
  const [adminMenuOpen, setAdminMenuOpen] = useState(false);
  const [viewingSalon, setViewingSalon] = useState(null);
  const [selectedSalonId, setSelectedSalonId] = useState("");
  const [selectedState, setSelectedState] = useState("All India");
  const [expandedSalons, setExpandedSalons] = useState({});
  const [apptPage, setApptPage] = useState(1);
  const [apptPerPage, setApptPerPage] = useState(10);
  const [servPage, setServPage] = useState(1);
  const [servPerPage, setServPerPage] = useState(10);
  const [payPage, setPayPage] = useState(1);
  const [payPerPage, setPayPerPage] = useState(10);
  const [payPeriod, setPayPeriod] = useState("all");
  const [selectedBarber, setSelectedBarber] = useState(null);
  const [viewingDocument, setViewingDocument] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [selectedPerformanceSalon, setSelectedPerformanceSalon] = useState(null);
  const ticketState = useTickets();
  const [approvalRequests, setApprovalRequests] = useState([]);
  const [ownerRequestSearch, setOwnerRequestSearch] = useState("");
  const [ownerRequestFilter, setOwnerRequestFilter] = useState("All");
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [adminNote, setAdminNote] = useState("");

  const [newBarber, setNewBarber] = useState({
    name:"", mobile:"", password:"", specialization:"", experience:"", salon_id:"",
    email:"", photo:null, photoPreview:null, document:null, documentName:"",
  });
  const [newService, setNewService] = useState({ name:"", category:"men", price:"", duration:"30", salon_id:"" });

  useEffect(() => { fetchAll(selectedState); }, [selectedState]);

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

  const fetchAll = async (stateFilter = selectedState) => {
    setLoading(true);
    try {
      const q = stateFilter && stateFilter !== "All India" ? `?state=${encodeURIComponent(stateFilter)}` : "";
      const results = await Promise.allSettled([
        fetch(`${API}/admin/salons${q}`,    { headers:h() }).then(r=>r.json()),
        fetch(`${API}/admin/stats${q}`,     { headers:h() }).then(r=>r.json()),
        fetch(`${API}/admin/customers${q}`, { headers:h() }).then(r=>r.json()),
        fetch(`${API}/admin/barbers${q}`,   { headers:h() }).then(r=>r.json()),
        fetch(`${API}/admin/bookings${q}`,  { headers:h() }).then(r=>r.json()),
        fetch(`${API}/admin/services${q}`,  { headers:h() }).then(r=>r.json()),
        fetch(`${API}/admin/payments${q}`,  { headers:h() }).then(r=>r.json()),
        fetch(`${API}/admin/reviews${q}`,   { headers:h() }).then(r=>r.json()),
        fetch(`${API}/admin/approval-requests${q}`, { headers:h() }).then(r=>r.json()),
      ]);
      const [salonsR, statsR, custR, barbersR, bookR, servR, payR, revR, appReqR] = results.map(r => r.status==="fulfilled" ? r.value : null);
      if (salonsR?.success)   setSalons(salonsR.salons||[]);
      if (statsR?.success)    setStats(statsR.stats);
      if (custR?.success)     setCustomers(custR.customers||[]);
      if (barbersR?.success)  setBarbers(barbersR.barbers||[]);
      if (bookR?.success)     setBookings(bookR.bookings||[]);
      if (servR?.success)     setServices(servR.services||[]);
      if (payR?.success)      setPayments(payR.payments||[]);
      if (revR?.success) {
        setReviews(revR.reviews||[]);
        setBookingFeedbacks(revR.bookingFeedbacks||[]);
      }
      if (appReqR?.success)   setApprovalRequests(appReqR.requests||[]);
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

  const handleApprovalRequest = async (id, action, admin_note = "") => {
    setBusy(true);
    try {
      const r = await fetch(`${API}/admin/approval-request/${id}/action`, {
        method: "PUT",
        headers: h(),
        body: JSON.stringify({ action, admin_note }),
      });
      const d = await r.json();
      if (d.success) {
        pop(`Request successfully ${action}!`, "success");
        fetchAll(selectedState);
      } else {
        pop(d.message || "Failed to update request status", "error");
      }
    } catch (err) {
      console.error(err);
      pop("Server error updating request", "error");
    } finally {
      setBusy(false);
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
        const salonsRes = await fetch(`${API}/admin/salons${selectedState && selectedState !== "All India" ? `?state=${encodeURIComponent(selectedState)}` : ""}`, { headers:h() }).then(r=>r.json());
        if (salonsRes.success) setSalons(salonsRes.salons||[]);
      } else pop(d.message||"Failed","error");
    } catch { pop("Server error","error"); }
  };

  const removeBarber = async (id) => {
    try {
      const r = await fetch(`${API}/admin/barber/${id}`, { method:"DELETE", headers:h() });
      const d = await r.json();
      if (d.success) { 
        setBarbers(p => p.filter(b => b._id!==id)); 
        pop("Barber removed!"); 
        const salonsRes = await fetch(`${API}/admin/salons${selectedState && selectedState !== "All India" ? `?state=${encodeURIComponent(selectedState)}` : ""}`, { headers:h() }).then(r=>r.json());
        if (salonsRes.success) setSalons(salonsRes.salons||[]);
      }
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
        const salonsRes = await fetch(`${API}/admin/salons${selectedState && selectedState !== "All India" ? `?state=${encodeURIComponent(selectedState)}` : ""}`, { headers:h() }).then(r=>r.json());
        if (salonsRes.success) setSalons(salonsRes.salons||[]);
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

  const deleteBookingFeedback = async (id) => {
    try {
      const r = await fetch(`${API}/admin/booking-feedback/${id}`, { method:"DELETE", headers:h() });
      const d = await r.json();
      if (d.success) { setBookingFeedbacks(p => p.filter(x => x._id!==id)); pop("Booking feedback deleted!"); }
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

  // --- Filtered lists for Studio-wise data ---
  const filteredBookings = selectedSalonId
    ? bookings.filter(b => (b.salon_id?._id || b.salon_id) === selectedSalonId)
    : bookings;

  const filteredBarbers = selectedSalonId
    ? barbers.filter(b => (b.salon_id?._id || b.salon_id) === selectedSalonId)
    : barbers;

  const filteredServices = selectedSalonId
    ? services.filter(s => (s.salon_id?._id || s.salon_id) === selectedSalonId)
    : services;

  const filteredPayments = selectedSalonId
    ? payments.filter(p => (p.salon_id?._id || p.salon_id) === selectedSalonId)
    : payments;

  const filteredReviews = selectedSalonId
    ? reviews.filter(r => (r.salon_id?._id || r.salon_id) === selectedSalonId)
    : reviews;

  const filteredBookingFeedbacks = selectedSalonId
    ? bookingFeedbacks.filter(fb => (fb.booking_id?.salon_id?._id || fb.booking_id?.salon_id) === selectedSalonId)
    : bookingFeedbacks;

  const getSalonPerformanceData = (salon) => {
    const salonId = salon._id;

    // Bookings for this salon
    const salonBookings = bookings.filter(b => (b.salon_id?._id || b.salon_id) === salonId);
    const completedBookings = salonBookings.filter(b => b.status === "completed");
    const cancelledBookings = salonBookings.filter(b => b.status === "cancelled");
    const pendingBookings = salonBookings.filter(b => b.status === "pending");

    // Payments for this salon
    const salonPayments = payments.filter(p => (p.salon_id?._id || p.salon_id) === salonId);
    
    // Income: captured or success payments for bookings that are NOT cancelled
    const income = salonPayments
      .filter(p => p.status?.toLowerCase() === "captured" || p.status?.toLowerCase() === "success")
      .reduce((a, b) => a + (b.amount || 0), 0);

    // Loss: failed/refunded payments + captured/success payments for CANCELLED bookings
    const loss = salonPayments
      .filter(p => p.status?.toLowerCase() === "refunded" || p.status?.toLowerCase() === "failed" || ((p.status?.toLowerCase() === "captured" || p.status?.toLowerCase() === "success") && salonBookings.find(b => b._id === p.booking_id && b.status === "cancelled")))
      .reduce((a, b) => a + (b.amount || 0), 0);

    const netProfit = income - loss;

    // Reviews for this salon
    const salonReviews = reviews.filter(r => (r.salon_id?._id || r.salon_id) === salonId);
    const avgRating = salonReviews.length > 0
      ? salonReviews.reduce((sum, r) => sum + (r.rating || r.salon_rating || 5), 0) / salonReviews.length
      : 5.0;

    // Booking Feedback for this salon
    const salonFeedbacks = bookingFeedbacks.filter(fb => (fb.booking_id?.salon_id?._id || fb.booking_id?.salon_id) === salonId);
    const avgBookingProcess = salonFeedbacks.length > 0 ? salonFeedbacks.reduce((sum, fb) => sum + (fb.booking_process_rating || 5), 0) / salonFeedbacks.length : 5.0;
    const avgPaymentProcess = salonFeedbacks.length > 0 ? salonFeedbacks.reduce((sum, fb) => sum + (fb.payment_process_rating || 5), 0) / salonFeedbacks.length : 5.0;
    const avgWebsiteUsability = salonFeedbacks.length > 0 ? salonFeedbacks.reduce((sum, fb) => sum + (fb.website_usability_rating || 5), 0) / salonFeedbacks.length : 5.0;

    return {
      salon,
      bookingsCount: salonBookings.length,
      completedCount: completedBookings.length,
      cancelledCount: cancelledBookings.length,
      pendingCount: pendingBookings.length,
      income,
      loss,
      netProfit,
      avgRating,
      avgBookingProcess,
      avgPaymentProcess,
      avgWebsiteUsability,
      reviews: salonReviews,
      feedbacks: salonFeedbacks
    };
  };

  // Filter customers to only those who booked with this salon
  const filteredCustomers = selectedSalonId
    ? (() => {
        const salonCustomerIds = new Set(
          bookings
             .filter(b => (b.salon_id?._id || b.salon_id) === selectedSalonId)
            .map(b => b.customer_id?._id || b.customer_id)
            .filter(Boolean)
        );
        return customers.filter(c => salonCustomerIds.has(c._id));
      })()
    : customers;

  // Helper to get customers for a specific salon
  const getSalonCustomers = (salonId) => {
    const customerIds = new Set(
      bookings
         .filter(b => (b.salon_id?._id || b.salon_id) === salonId)
        .map(b => b.customer_id?._id || b.customer_id)
        .filter(Boolean)
    );
    return customers.filter(c => customerIds.has(c._id));
  };

  const toggleSalonExpand = (salonId) => {
    setExpandedSalons(prev => ({
      ...prev,
      [salonId]: prev[salonId] === false ? true : false
    }));
  };

  // --- Calculations for Stat Cards ---
  const displayCustomersCount = loading ? "—" : filteredCustomers.length;
  const displaySalonsCount = loading
    ? "—"
    : selectedSalonId
    ? (salons.find(s => s._id === selectedSalonId && s.status === "approved") ? 1 : 0)
    : salons.filter(s => s.status === "approved").length;
  const displayBookingsCount = loading ? "—" : filteredBookings.length;
  const displayPendingBookingsCount = filteredBookings.filter(b => b.status === "pending").length;
  const displayRevenue = loading
    ? "—"
    : `₹${(filteredPayments.filter(p => p.status?.toLowerCase() === "captured" || p.status?.toLowerCase() === "success").reduce((a, b) => a + (b.amount || 0), 0)).toLocaleString("en-IN")}`;

  const globalPendingBookings = bookings.filter(b => b.status === "pending").length;

  const SALONS_FILTERED = salons.filter(s =>
    (salonTab === "requests" ? s.status === "pending" :
     salonTab === "approved" ? s.status === "approved" : s.status === "rejected") &&
    (!selectedSalonId || s._id === selectedSalonId)
  );

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
        button:focus:not(:focus-visible){outline:none;box-shadow:none;}

      `}</style>

      {/* Mobile Sidebar Backdrop */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-stone-900/60 z-50 md:hidden animate-in fade-in duration-200" 
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* ════ SIDEBAR ════ */}
      <aside 
        className={`bg-white border-r border-stone-200 h-screen md:sticky md:top-0 overflow-y-auto z-50 transition-all duration-300 flex flex-col shrink-0
          ${isSidebarOpen 
            ? "fixed inset-y-0 left-0 w-64 translate-x-0 shadow-2xl md:translate-x-0 md:relative md:w-64" 
            : "fixed inset-y-0 left-0 w-64 -translate-x-full md:translate-x-0 md:relative md:w-64"
          }
        `}
      >
        {/* Brand */}
        <div style={{ padding: "24px 20px 20px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
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
            <button 
              onClick={() => setIsSidebarOpen(false)}
              className="md:hidden p-1.5 text-stone-500 hover:text-stone-900 hover:bg-stone-100 rounded-lg cursor-pointer"
            >
              <X size={18} />
            </button>
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
                {(i === 2 || i === 5 || i === 6) && (
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
                  {n.k === "appointments" && globalPendingBookings > 0 && (
                    <span style={{
                      background: C.purpleLight, color: C.purple,
                      borderRadius: 8, padding: "2px 7px", fontSize: 10, fontWeight: 700, lineHeight: 1,
                    }}>
                      {globalPendingBookings}
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
      <div className="flex-1 flex flex-col min-w-0">
        <div className="px-4 md:px-8">

          {/* ── HEADER ── */}
          <header 
            className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pt-12 pb-6"
          >
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setIsSidebarOpen(true)}
                className="md:hidden p-2 rounded-lg border border-[#E7E5E4] bg-white text-stone-700 hover:bg-stone-50 cursor-pointer flex items-center justify-center shrink-0"
              >
                <Menu size={18} className="text-[#C5A059]" />
              </button>
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
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 16, paddingBottom: 4, flexWrap: "wrap" }}>
              <span style={{ fontSize: 13, fontWeight: 500, color: C.muted }}>
                {new Date().toLocaleDateString("en-US", { weekday:"short", day:"numeric", month:"short", year:"numeric" })}
              </span>
              <div style={{ display: "flex", alignItems: "center", gap: 8, background: "#fff", border: `1px solid ${C.border}`, borderRadius: 99, padding: "2px 8px 2px 14px", marginRight: 4, position: "relative" }}>
                <span style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5, color: C.muted }}>Branch:</span>
                <button
                  type="button"
                  onClick={() => setShowBranchDropdown(!showBranchDropdown)}
                  style={{
                    border: "none",
                    background: "transparent",
                    fontSize: 13,
                    fontWeight: 600,
                    color: C.gold,
                    outline: "none",
                    cursor: "pointer",
                    padding: "6px 8px 6px 0px",
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                  }}
                >
                  <span>{selectedState}</span>
                  <ChevronDown size={12} style={{ transform: showBranchDropdown ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s", color: C.muted }} />
                </button>

                {showBranchDropdown && (
                  <>
                    <div 
                      onClick={() => setShowBranchDropdown(false)} 
                      style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, zIndex: 998 }} 
                    />
                    <div style={{
                      position: "absolute",
                      top: "calc(100% + 4px)",
                      left: 0,
                      minWidth: 150,
                      background: "#FFFFFF",
                      border: `1px solid ${C.border}`,
                      borderRadius: 12,
                      boxShadow: "0 8px 30px rgba(0,0,0,0.08)",
                      zIndex: 999,
                      padding: "4px 0",
                    }}>
                      {["All India", "Maharashtra", "Madhya Pradesh", "Gujarat", "Delhi", "Karnataka", "Rajasthan", "Uttar Pradesh", "Tamil Nadu"].map((st) => (
                        <button
                          key={st}
                          type="button"
                          onClick={() => {
                            setSelectedState(st);
                            setShowBranchDropdown(false);
                          }}
                          style={{
                            width: "100%",
                            padding: "8px 16px",
                            background: selectedState === st ? `${C.gold}15` : "transparent",
                            border: "none",
                            textAlign: "left",
                            fontSize: 13,
                            color: C.ink,
                            fontWeight: selectedState === st ? 700 : 500,
                            cursor: "pointer",
                            outline: "none",
                            display: "block",
                            transition: "background 0.15s",
                          }}
                          onMouseEnter={(e) => { e.currentTarget.style.background = `${C.gold}25`; }}
                          onMouseLeave={(e) => { e.currentTarget.style.background = selectedState === st ? `${C.gold}15` : "transparent"; }}
                        >
                          {st}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
              <button type="button"
                onClick={() => fetchAll(selectedState)}
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
                {globalPendingBookings > 0 && (
                  <span style={{ position:"absolute", top:-1, right:-1, minWidth:17, height:17, padding:"0 3px", borderRadius:99, background: C.gold, color:"#fff", fontSize:10, fontWeight:700, display:"flex", alignItems:"center", justifyContent:"center", boxShadow:"0 0 0 2px #fff" }}>
                    {globalPendingBookings}
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
          <div style={{ width:"100%", height:2, background:"#A1804E", opacity:0.9, marginBottom:24 }} />

          {/* Studio Selector Bar */}
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            background: "#FFFFFF",
            border: `1px solid ${C.gold}30`,
            borderRadius: 16,
            padding: "12px 24px",
            marginBottom: 24,
            boxShadow: "0 4px 15px rgba(197, 160, 89, 0.04)",
            flexWrap: "wrap",
            gap: 12
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: selectedSalonId ? C.green : C.gold }} />
              <span style={{ fontSize: 13, fontWeight: 700, color: C.ink, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Active View:
              </span>
              <span style={{ fontSize: 14, fontWeight: 650, color: selectedSalonId ? C.goldD : C.muted }}>
                {selectedSalonId ? salons.find(s => s._id === selectedSalonId)?.salon_name : "All Salons & Studios"}
              </span>
            </div>
            
            <div style={{ display: "flex", alignItems: "center", gap: 8, position: "relative" }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: C.muted }}>Filter Studio:</span>
              <button
                type="button"
                onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                style={{
                  padding: "6px 14px",
                  borderRadius: 10,
                  border: `1px solid ${C.gold}50`,
                  background: "#FAF9F6",
                  fontSize: 12,
                  color: C.ink,
                  fontWeight: 705,
                  outline: "none",
                  cursor: "pointer",
                  minWidth: 200,
                  boxShadow: "0 1px 3px rgba(0,0,0,0.03)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 8,
                }}
              >
                <span>
                  {selectedSalonId ? `💈 ${salons.find(s => s._id === selectedSalonId)?.salon_name}` : "✨ All Studios / Salons"}
                </span>
                <ChevronDown size={12} style={{ transform: showFilterDropdown ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s", color: C.muted }} />
              </button>

              {showFilterDropdown && (
                <>
                  <div 
                    onClick={() => setShowFilterDropdown(false)} 
                    style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, zIndex: 998 }} 
                  />
                  <div style={{
                    position: "absolute",
                    top: "calc(100% + 4px)",
                    right: 0,
                    minWidth: "100%",
                    maxHeight: 250,
                    overflowY: "auto",
                    background: "#FAF9F6",
                    border: `1px solid ${C.gold}50`,
                    borderRadius: 10,
                    boxShadow: "0 8px 30px rgba(197,160,89,0.15)",
                    zIndex: 999,
                    padding: "4px 0",
                    textAlign: "left",
                  }}>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedSalonId("");
                        setCustPage(1);
                        setApptPage(1);
                        setServPage(1);
                        setShowFilterDropdown(false);
                      }}
                      style={{
                        width: "100%",
                        padding: "8px 14px",
                        background: !selectedSalonId ? `${C.gold}15` : "transparent",
                        border: "none",
                        textAlign: "left",
                        fontSize: 12,
                        color: C.ink,
                        fontWeight: !selectedSalonId ? 750 : 500,
                        cursor: "pointer",
                        outline: "none",
                        display: "block",
                        transition: "background 0.15s",
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = `${C.gold}25`; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = !selectedSalonId ? `${C.gold}15` : "transparent"; }}
                    >
                      ✨ All Studios / Salons
                    </button>
                    {salons.filter(s => s.status === "approved").map(s => {
                      const isSelected = selectedSalonId === s._id;
                      return (
                        <button
                          key={s._id}
                          type="button"
                          onClick={() => {
                            setSelectedSalonId(s._id);
                            setCustPage(1);
                            setApptPage(1);
                            setServPage(1);
                            setShowFilterDropdown(false);
                          }}
                          style={{
                            width: "100%",
                            padding: "8px 14px",
                            background: isSelected ? `${C.gold}15` : "transparent",
                            border: "none",
                            textAlign: "left",
                            fontSize: 12,
                            color: C.ink,
                            fontWeight: isSelected ? 750 : 500,
                            cursor: "pointer",
                            outline: "none",
                            display: "block",
                            transition: "background 0.15s",
                          }}
                          onMouseEnter={(e) => { e.currentTarget.style.background = `${C.gold}25`; }}
                          onMouseLeave={(e) => { e.currentTarget.style.background = isSelected ? `${C.gold}15` : "transparent"; }}
                        >
                          💈 {s.salon_name}
                        </button>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* ════ MAIN CONTENT ════ */}
          <main style={{ paddingBottom: 60 }}>

            {/* Mobile Stats Dropdown */}
            <div className="block sm:hidden mb-6" style={{ position: "relative" }}>
              <button
                type="button"
                onClick={() => setShowMobileStatsDropdown(!showMobileStatsDropdown)}
                style={{
                  width: "100%",
                  padding: "14px 18px",
                  borderRadius: 12,
                  border: `1px solid ${C.border}`,
                  background: "#FFFFFF",
                  fontSize: 14,
                  fontWeight: 700,
                  color: C.ink,
                  outline: "none",
                  cursor: "pointer",
                  boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <Activity size={18} color={C.gold} />
                  <span>View Details & Stats Summary</span>
                </div>
                <ChevronDown size={16} style={{ transform: showMobileStatsDropdown ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s", color: C.muted }} />
              </button>

              {showMobileStatsDropdown && (
                <>
                  <div 
                    onClick={() => setShowMobileStatsDropdown(false)} 
                    style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, zIndex: 998 }} 
                  />
                  <div style={{
                    position: "absolute",
                    top: "calc(100% + 6px)",
                    left: 0,
                    right: 0,
                    background: "#FFFFFF",
                    border: `1px solid ${C.border}`,
                    borderRadius: 12,
                    boxShadow: "0 8px 30px rgba(0,0,0,0.08)",
                    zIndex: 999,
                    padding: "6px",
                    display: "flex",
                    flexDirection: "column",
                    gap: 4,
                  }}>
                    {/* Customers option */}
                    <button
                      type="button"
                      onClick={() => {
                        handleTabChange("customers", "all");
                        setCustPage(1);
                        setShowMobileStatsDropdown(false);
                      }}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "12px 14px",
                        borderRadius: 8,
                        background: tab === "customers" ? `${C.blue}08` : "transparent",
                        border: "none",
                        width: "100%",
                        cursor: "pointer",
                        outline: "none",
                        textAlign: "left",
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = `${C.blue}08`; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = tab === "customers" ? `${C.blue}08` : "transparent"; }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={{ padding: 6, borderRadius: 6, background: C.blueLight }}>
                          <Users size={16} color={C.blue} />
                        </div>
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 700, color: C.ink }}>Total Customers</div>
                          <div style={{ fontSize: 11, color: C.muted }}>{selectedSalonId ? "Booked in Studio" : "Registered users"}</div>
                        </div>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <span style={{ fontSize: 16, fontWeight: 700, color: C.ink }}>{displayCustomersCount}</span>
                        <span style={{ color: C.muted, fontSize: 12 }}>→</span>
                      </div>
                    </button>

                    {/* Salons option */}
                    <button
                      type="button"
                      onClick={() => {
                        handleTabChange("salons");
                        setShowMobileStatsDropdown(false);
                      }}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "12px 14px",
                        borderRadius: 8,
                        background: tab === "salons" ? `${C.green}08` : "transparent",
                        border: "none",
                        width: "100%",
                        cursor: "pointer",
                        outline: "none",
                        textAlign: "left",
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = `${C.green}08`; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = tab === "salons" ? `${C.green}08` : "transparent"; }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={{ padding: 6, borderRadius: 6, background: C.greenLight }}>
                          <Store size={16} color={C.green} />
                        </div>
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 700, color: C.ink }}>Active Salons</div>
                          <div style={{ fontSize: 11, color: C.muted }}>{selectedSalonId ? "Selected Studio" : "Approved & live"}</div>
                        </div>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <span style={{ fontSize: 16, fontWeight: 700, color: C.ink }}>{displaySalonsCount}</span>
                        <span style={{ color: C.muted, fontSize: 12 }}>→</span>
                      </div>
                    </button>

                    {/* Bookings option */}
                    <button
                      type="button"
                      onClick={() => {
                        handleTabChange("appointments");
                        setShowMobileStatsDropdown(false);
                      }}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "12px 14px",
                        borderRadius: 8,
                        background: tab === "appointments" ? `${C.purple}08` : "transparent",
                        border: "none",
                        width: "100%",
                        cursor: "pointer",
                        outline: "none",
                        textAlign: "left",
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = `${C.purple}08`; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = tab === "appointments" ? `${C.purple}08` : "transparent"; }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={{ padding: 6, borderRadius: 6, background: C.purpleLight }}>
                          <CalendarCheck size={16} color={C.purple} />
                        </div>
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 700, color: C.ink }}>Total Bookings</div>
                          <div style={{ fontSize: 11, color: C.muted }}>{displayPendingBookingsCount} pending</div>
                        </div>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <span style={{ fontSize: 16, fontWeight: 700, color: C.ink }}>{displayBookingsCount}</span>
                        <span style={{ color: C.muted, fontSize: 12 }}>→</span>
                      </div>
                    </button>

                    {/* Revenue option */}
                    <button
                      type="button"
                      onClick={() => {
                        handleTabChange("payments");
                        setShowMobileStatsDropdown(false);
                      }}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "12px 14px",
                        borderRadius: 8,
                        background: tab === "payments" ? `${C.orange}08` : "transparent",
                        border: "none",
                        width: "100%",
                        cursor: "pointer",
                        outline: "none",
                        textAlign: "left",
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = `${C.orange}08`; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = tab === "payments" ? `${C.orange}08` : "transparent"; }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={{ padding: 6, borderRadius: 6, background: C.orangeLight }}>
                          <CreditCard size={16} color={C.orange} />
                        </div>
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 700, color: C.ink }}>Revenue</div>
                          <div style={{ fontSize: 11, color: C.muted }}>Total collected</div>
                        </div>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <span style={{ fontSize: 16, fontWeight: 700, color: C.ink }}>{displayRevenue}</span>
                        <span style={{ color: C.muted, fontSize: 12 }}>→</span>
                      </div>
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* STAT CARDS — shown on all tabs */}
            <div className="hidden sm:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 mb-6">
              <StatCard label="Total Customers" value={displayCustomersCount} sub={selectedSalonId ? "Booked in Studio" : "Registered users"} color={C.blue} icon={Users} iconBg={C.blueLight} iconColor={C.blue} onClick={() => { handleTabChange("customers", "all"); setCustPage(1); }}/>
              <StatCard label="Active Salons"   value={displaySalonsCount} sub={selectedSalonId ? "Selected Studio" : "Approved & live"} color={C.green} icon={Store} iconBg={C.greenLight} iconColor={C.green} onClick={() => handleTabChange("salons")}/>
              <StatCard label="Total Bookings"  value={displayBookingsCount} sub={`${displayPendingBookingsCount} pending`} color={C.purple} icon={CalendarCheck} iconBg={C.purpleLight} iconColor={C.purple} onClick={() => handleTabChange("appointments")}/>
              <StatCard label="Revenue"         value={displayRevenue} sub="Total collected" color={C.orange} icon={CreditCard} iconBg={C.orangeLight} iconColor={C.orange} onClick={() => handleTabChange("payments")}/>
            </div>

             {/* ══ DASHBOARD ══ */}
             {tab==="dashboard" && (
               <div className="fade-in">
                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
 
                   {/* Recent Bookings */}
                   <SectionCard title="Recent Bookings" actionLabel="View All →" onAction={()=>handleTabChange("appointments")}>
                     {loading ? <div style={{ padding:20, textAlign:"center", color:C.muted, fontSize:13 }}>Loading...</div>
                     : filteredBookings.length===0 ? <div style={{ padding:40, textAlign:"center", color:C.muted, fontSize:13 }}>No bookings yet</div>
                     : filteredBookings.slice(0,4).map((b,i) => (
                       <div key={b._id} style={{ padding:"12px 20px", borderBottom:i<Math.min(filteredBookings.length, 4)-1?`1px solid ${C.border}`:"none", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
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
                     : filteredBarbers.length===0 ? <div style={{ padding:40, textAlign:"center", color:C.muted, fontSize:13 }}>No barbers added yet</div>
                     : filteredBarbers.slice(0,4).map((b,i) => (
                       <div key={b._id} style={{ padding:"12px 20px", borderBottom:i<Math.min(filteredBarbers.length, 4)-1?`1px solid ${C.border}`:"none", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
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
                     {(() => {
                       const activeSalons = selectedSalonId
                         ? salons.filter(s => s._id === selectedSalonId && s.status === "approved")
                         : salons.filter(s => s.status === "approved");
                       
                       return activeSalons.length===0
                         ? <div style={{ padding:40, textAlign:"center", color:C.muted, fontSize:13 }}>No approved salons yet</div>
                         : activeSalons.slice(0,3).map((s,i) => (
                         <div key={s._id} style={{ padding:"12px 20px", borderBottom:i<Math.min(activeSalons.length, 3)-1?`1px solid ${C.border}`:"none", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                           <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                             <img src={s.images?.[0]||salonImg(i)} alt={s.salon_name} style={{ width:36, height:36, borderRadius:8, objectFit:"cover", border:`1px solid ${C.border}` }}/>
                             <div>
                               <div style={{ fontSize:13, fontWeight:600, color:C.ink }}>{s.salon_name}</div>
                               <div style={{ fontSize:11, color:C.muted }}>{s.owner_name} · {s.mobile} · {s.address||"No address"}</div>
                             </div>
                           </div>
                           <Badge label="Active" color={C.green}/>
                         </div>
                       ));
                     })()}
                   </SectionCard>
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
                          <button 
                            type="button" 
                            className="action-btn" 
                            onClick={() => setViewingSalon(s)} 
                            style={{ 
                              display: "inline-flex", 
                              alignItems: "center", 
                              justifyContent: "center", 
                              gap: 5, 
                              padding: "8px 14px", 
                              borderRadius: 8, 
                              fontSize: 12, 
                              fontWeight: 700, 
                              cursor: "pointer", 
                              background: `${C.gold}15`, 
                              color: C.gold, 
                              border: `1px solid ${C.gold}30`, 
                              width: "100%", 
                              marginBottom: 8, 
                              fontFamily: "inherit",
                              transition: "all 0.18s"
                            }}
                          >
                            <Eye size={13} style={{ color: C.gold }} />
                            View Details & Docs
                          </button>
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
              const filterList = (list) => list.filter(c => !search || c.name?.toLowerCase().includes(search.toLowerCase()) || c.mobile?.includes(search));
              
              const allBookedCustomerIds = new Set(
                bookings.map(b => b.customer_id?._id || b.customer_id).filter(Boolean)
              );
              const unassignedCustomers = filterList(customers.filter(c => !allBookedCustomerIds.has(c._id)));

              if (selectedSalonId) {
                const isGeneral = selectedSalonId === "general";
                const isAll = selectedSalonId === "all";
                
                const filtered = isAll
                  ? filterList(customers)
                  : isGeneral 
                  ? unassignedCustomers 
                  : filterList(getSalonCustomers(selectedSalonId));
                
                const totalPages = Math.ceil(filtered.length / custPerPage) || 1;
                const startIndex = (custPage - 1) * custPerPage;
                const paginated = filtered.slice(startIndex, startIndex + custPerPage);

                const currentSalonName = isAll
                  ? "All Registered Users"
                  : isGeneral 
                  ? "General / Unassigned Customers" 
                  : salons.find(s => s._id === selectedSalonId)?.salon_name || "Selected Studio";

                return (
                  <div className="fade-in">
                    <div style={{ marginBottom: 16 }}>
                      <button 
                        onClick={() => setSelectedSalonId("")}
                        style={btnStyle(C.goldLight, C.gold, `1px solid ${C.gold}30`)}
                      >
                        ← Back to All Studios
                      </button>
                    </div>

                    <div style={{ background:C.card, borderRadius:16, border:`1px solid ${C.border}`, overflow:"hidden", boxShadow:"0 1px 4px rgba(0,0,0,.04)" }}>
                      <div style={{ padding:"14px 20px", borderBottom:`1px solid ${C.border}`, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                        <span style={{ fontSize:16, fontWeight:700, color:C.ink, fontFamily:"Georgia, serif" }}>
                          {filtered.length} Customers for {currentSalonName}
                        </span>
                        <input className="inp" value={search} onChange={e=>{ setSearch(e.target.value); setCustPage(1); }} placeholder="Search by name or mobile..." style={{ ...inputStyle, width:220, padding:"7px 12px", fontSize:12 }}/>
                      </div>
                      {loading ? <div style={{ padding:40, textAlign:"center", color:C.muted }}>Loading...</div>
                      : filtered.length===0 ? <div style={{ padding:40, textAlign:"center", color:C.muted }}>No customers found</div>
                      : (
                        <>
                          <div className="w-full overflow-x-auto">
                            <table style={{ width:"100%", borderCollapse:"collapse" }}>
                            <thead><tr>{["Customer","Mobile","Email","Loyalty Points","Joined","Status","Studio / Saloon"].map(h=><TH key={h}>{h}</TH>)}</tr></thead>
                            <tbody>
                              {paginated.map(c=>(
                                <tr key={c._id} className="tr">
                                  <TD><div style={{ display:"flex", alignItems:"center", gap:8 }}><Avatar name={c.name||"C"} size={30} color={C.blue} bg={C.blueLight}/><span style={{ fontSize:13, fontWeight:600, color:C.ink }}>{c.name||"—"}</span></div></TD>
                                  <TD style={{ fontSize:12, color:C.muted, fontFamily:"monospace" }}>{c.mobile}</TD>
                                  <TD style={{ fontSize:12, color:C.muted }}>{c.email||"—"}</TD>
                                  <TD style={{ fontSize:13, fontWeight:700, color:C.gold }}>{c.loyalty_points||0}</TD>
                                  <TD style={{ fontSize:12, color:C.muted }}>{c.created_at?new Date(c.created_at).toLocaleDateString("en-IN",{day:"numeric",month:"short"}):"—"}</TD>
                                  <TD><Badge label={c.blocked?"Blocked":"Active"} color={c.blocked?C.red:C.green}/></TD>
                                  <TD style={{ fontSize:12, fontWeight:600, color:C.gold }}>
                                    {(() => {
                                      const getSalonId = (salon) => {
                                        if (!salon) return "";
                                        return typeof salon === "object" ? salon._id : salon;
                                      };
                                      const getCustomerId = (cust) => {
                                        if (!cust) return "";
                                        return typeof cust === "object" ? cust._id : cust;
                                      };
                                      
                                      const customerBookings = bookings.filter(b => 
                                        getCustomerId(b.customer_id) === c._id
                                      );
                                      if (customerBookings.length === 0) return "—";
                                      
                                      const uniqueSalons = new Set(
                                        customerBookings.map(b => {
                                          if (b.salon_id?.salon_name) return b.salon_id.salon_name;
                                          const sId = getSalonId(b.salon_id);
                                          return salons.find(s => s._id === sId)?.salon_name;
                                        }).filter(Boolean)
                                      );
                                      return uniqueSalons.size > 0 ? Array.from(uniqueSalons).join(", ") : "—";
                                    })()}
                                  </TD>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                          
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
                                 <PaginationSelect 
                                  value={custPerPage} 
                                  onChange={(val) => {
                                    setCustPerPage(val);
                                    setCustPage(1);
                                  }}
                                  options={[5, 10, 20, 50]}
                                />
                              </div>

                              {/* Page selection dropdown */}
                              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                <span style={{ fontSize: 12, color: C.muted, fontWeight: 505 }}>Page:</span>
                                <PaginationSelect 
                                  value={custPage} 
                                  onChange={setCustPage}
                                  options={Array.from({ length: totalPages }, (_, idx) => idx + 1)}
                                />
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
              }

              // Grid of Salon Containers
              const approvedSalons = salons.filter(s => s.status === "approved");

              return (
                <div className="fade-in" style={{ display:"flex", flexDirection:"column", gap:20 }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", background:C.card, padding:"12px 20px", borderRadius:12, border:`1px solid ${C.border}`, boxShadow:"0 1px 3px rgba(0,0,0,0.02)" }}>
                    <span style={{ fontSize:15, fontWeight:700, color:C.ink, fontFamily:"Georgia, serif" }}>Select a Studio to View Customers</span>
                    <input className="inp" value={search} onChange={e=>{ setSearch(e.target.value); }} placeholder="Search salons..." style={{ ...inputStyle, width:220, padding:"7px 12px", fontSize:12 }}/>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 20 }}>
                    {approvedSalons
                      .filter(s => !search || s.salon_name?.toLowerCase().includes(search.toLowerCase()) || s.address?.toLowerCase().includes(search.toLowerCase()))
                      .map((salon, idx) => {
                        const count = getSalonCustomers(salon._id).length;
                        return (
                          <div 
                            key={salon._id}
                            onClick={() => {
                              setSelectedSalonId(salon._id);
                              setCustPage(1);
                              setApptPage(1);
                              setServPage(1);
                            }}
                            style={{
                              background: C.card,
                              border: `1.5px solid ${C.border}`,
                              borderRadius: 16,
                              padding: 20,
                              cursor: "pointer",
                              transition: "all 0.22s ease",
                              boxShadow: "0 2px 6px rgba(0,0,0,0.02)",
                              position: "relative",
                              overflow: "hidden"
                            }}
                            onMouseEnter={e => {
                              e.currentTarget.style.transform = "translateY(-4px)";
                              e.currentTarget.style.borderColor = C.gold;
                              e.currentTarget.style.boxShadow = "0 8px 24px rgba(197, 160, 89, 0.08)";
                            }}
                            onMouseLeave={e => {
                              e.currentTarget.style.transform = "translateY(0)";
                              e.currentTarget.style.borderColor = C.border;
                              e.currentTarget.style.boxShadow = "0 2px 6px rgba(0,0,0,0.02)";
                            }}
                          >
                            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 4, background: `linear-gradient(90deg, ${C.gold}, ${C.goldD})` }} />
                            
                            <div style={{ fontSize: 16, fontWeight: 700, color: C.ink, fontFamily: "Georgia, serif", marginBottom: 8 }}>
                              💈 {salon.salon_name}
                            </div>
                            
                            <div style={{ fontSize: 12, color: C.muted, marginBottom: 16, lineHeight: 1.4, height: 34, overflow: "hidden", textOverflow: "ellipsis" }}>
                              📍 {salon.address || salon.state || "No Address"}
                            </div>
                            
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: `1px solid ${C.border}80`, paddingTop: 12 }}>
                              <span style={{ fontSize: 11, color: C.muted }}>Owner: <strong style={{ color: C.ink }}>{salon.owner_name}</strong></span>
                              <span style={{
                                background: C.blueLight,
                                color: C.blue,
                                padding: "3px 9px",
                                borderRadius: 20,
                                fontSize: 10,
                                fontWeight: 700
                              }}>
                                {count} Customers
                              </span>
                            </div>
                          </div>
                        );
                      })}

                    {/* General / Unassigned Customers Card */}
                    <div 
                      onClick={() => {
                        setSelectedSalonId("general");
                        setCustPage(1);
                        setApptPage(1);
                        setServPage(1);
                      }}
                      style={{
                        background: C.card,
                        border: `1.5px solid ${C.border}`,
                        borderRadius: 16,
                        padding: 20,
                        cursor: "pointer",
                        transition: "all 0.22s ease",
                        boxShadow: "0 2px 6px rgba(0,0,0,0.02)",
                        position: "relative",
                        overflow: "hidden"
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.transform = "translateY(-4px)";
                        e.currentTarget.style.borderColor = C.purple;
                        e.currentTarget.style.boxShadow = "0 8px 24px rgba(124, 58, 237, 0.08)";
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.transform = "translateY(0)";
                        e.currentTarget.style.borderColor = C.border;
                        e.currentTarget.style.boxShadow = "0 2px 6px rgba(0,0,0,0.02)";
                      }}
                    >
                      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 4, background: `linear-gradient(90deg, ${C.purple}, ${C.purpleLight})` }} />
                      
                      <div style={{ fontSize: 16, fontWeight: 700, color: C.ink, fontFamily: "Georgia, serif", marginBottom: 8 }}>
                        🌐 General Customers
                      </div>
                      
                      <div style={{ fontSize: 12, color: C.muted, marginBottom: 16, lineHeight: 1.4, height: 34 }}>
                        Registered users with no salon bookings yet.
                      </div>
                      
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: `1px solid ${C.border}80`, paddingTop: 12 }}>
                        <span style={{ fontSize: 11, color: C.muted }}>System-wide</span>
                        <span style={{
                          background: C.purpleLight,
                          color: C.purple,
                          padding: "3px 9px",
                          borderRadius: 20,
                          fontSize: 10,
                          fontWeight: 700
                        }}>
                          {customers.filter(c => !allBookedCustomerIds.has(c._id)).length} Customers
                        </span>
                      </div>
                    </div>

                    {/* All Registered Customers Card */}
                    <div 
                      onClick={() => {
                        setSelectedSalonId("all");
                        setCustPage(1);
                        setApptPage(1);
                        setServPage(1);
                      }}
                      style={{
                        background: C.card,
                        border: `1.5px solid ${C.border}`,
                        borderRadius: 16,
                        padding: 20,
                        cursor: "pointer",
                        transition: "all 0.22s ease",
                        boxShadow: "0 2px 6px rgba(0,0,0,0.02)",
                        position: "relative",
                        overflow: "hidden"
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.transform = "translateY(-4px)";
                        e.currentTarget.style.borderColor = C.blue;
                        e.currentTarget.style.boxShadow = "0 8px 24px rgba(37, 99, 235, 0.08)";
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.transform = "translateY(0)";
                        e.currentTarget.style.borderColor = C.border;
                        e.currentTarget.style.boxShadow = "0 2px 6px rgba(0,0,0,0.02)";
                      }}
                    >
                      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 4, background: `linear-gradient(90deg, ${C.blue}, ${C.blueLight})` }} />
                      
                      <div style={{ fontSize: 16, fontWeight: 700, color: C.ink, fontFamily: "Georgia, serif", marginBottom: 8 }}>
                        👥 All Registered Users
                      </div>
                      
                      <div style={{ fontSize: 12, color: C.muted, marginBottom: 16, lineHeight: 1.4, height: 34 }}>
                        View all customers registered across the entire system.
                      </div>
                      
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: `1px solid ${C.border}80`, paddingTop: 12 }}>
                        <span style={{ fontSize: 11, color: C.muted }}>System-wide</span>
                        <span style={{
                          background: C.blueLight,
                          color: C.blue,
                          padding: "3px 9px",
                          borderRadius: 20,
                          fontSize: 10,
                          fontWeight: 700
                        }}>
                          {customers.length} Customers
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}



            {/* ══ APPOINTMENTS ══ */}
            {tab==="appointments" && (() => {
              const filterAppointments = (list) => list.filter(b => 
                !search || 
                b.customer_id?.name?.toLowerCase().includes(search.toLowerCase()) || 
                b.barber_id?.name?.toLowerCase().includes(search.toLowerCase()) ||
                b.services?.[0]?.service_name?.toLowerCase().includes(search.toLowerCase())
              );

              if (selectedSalonId) {
                const salonBookings = bookings.filter(b => (b.salon_id?._id || b.salon_id) === selectedSalonId);
                const filtered = filterAppointments(salonBookings);
                const totalPages = Math.ceil(filtered.length / apptPerPage) || 1;
                const startIndex = (apptPage - 1) * apptPerPage;
                const paginated = filtered.slice(startIndex, startIndex + apptPerPage);
                const currentSalonName = salons.find(s => s._id === selectedSalonId)?.salon_name || "Selected Studio";

                return (
                  <div className="fade-in">
                    <div style={{ marginBottom: 16 }}>
                      <button 
                        onClick={() => setSelectedSalonId("")}
                        style={btnStyle(C.goldLight, C.gold, `1px solid ${C.gold}30`)}
                      >
                        ← Back to All Studios
                      </button>
                    </div>

                    <div style={{ background:C.card, borderRadius:16, border:`1px solid ${C.border}`, overflow:"hidden", boxShadow:"0 1px 4px rgba(0,0,0,.04)" }}>
                      <div style={{ padding:"14px 20px", borderBottom:`1px solid ${C.border}`, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                        <span style={{ fontSize:16, fontWeight:700, color:C.ink, fontFamily:"Georgia, serif" }}>
                          {filtered.length} Appointments for {currentSalonName}
                        </span>
                        <input className="inp" value={search} onChange={e=>{ setSearch(e.target.value); setApptPage(1); }} placeholder="Search by customer, service or stylist..." style={{ ...inputStyle, width:280, padding:"7px 12px", fontSize:12 }}/>
                      </div>
                      {loading ? <div style={{ padding:40, textAlign:"center", color:C.muted }}>Loading...</div>
                      : filtered.length===0 ? <div style={{ padding:40, textAlign:"center", color:C.muted }}>No appointments found</div>
                      : (
                        <>
                          <div className="w-full overflow-x-auto">
                            <table style={{ width:"100%", borderCollapse:"collapse" }}>
                            <thead><tr>{["Customer","Service","Barber","Date","Amount","Status","Actions"].map(h=><TH key={h}>{h}</TH>)}</tr></thead>
                            <tbody>
                              {paginated.map(b=>(
                                <tr key={b._id} className="tr">
                                  <TD><div style={{ display:"flex", alignItems:"center", gap:8 }}><Avatar name={b.customer_id?.name||"C"} size={28} color={C.blue} bg={C.blueLight}/><span style={{ fontSize:13, fontWeight:600, color:C.ink }}>{b.customer_id?.name||"—"}</span></div></TD>
                                  <TD style={{ fontSize:12, color:C.muted }}>{b.services?.[0]?.service_name||"—"}</TD>
                                  <TD style={{ fontSize:12, color:C.gold }}>{b.barber_id?.name||"—"}</TD>
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
                        </div>

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
                              Showing {filtered.length === 0 ? 0 : startIndex + 1} - {Math.min(startIndex + apptPerPage, filtered.length)} of {filtered.length} appointments
                            </div>
                            
                            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                              {/* Page size dropdown */}
                              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                <span style={{ fontSize: 12, color: C.muted, fontWeight: 505 }}>Show:</span>
                                 <PaginationSelect 
                                  value={apptPerPage} 
                                  onChange={(val) => {
                                    setApptPerPage(val);
                                    setApptPage(1);
                                  }}
                                  options={[5, 10, 20, 50]}
                                />
                              </div>

                              {/* Page selection dropdown */}
                              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                <span style={{ fontSize: 12, color: C.muted, fontWeight: 505 }}>Page:</span>
                                <PaginationSelect 
                                  value={apptPage} 
                                  onChange={setApptPage}
                                  options={Array.from({ length: totalPages }, (_, idx) => idx + 1)}
                                />
                                <span style={{ fontSize: 12, color: C.muted, fontWeight: 505 }}>of {totalPages}</span>
                              </div>

                              {/* Prev / Next buttons */}
                              <div style={{ display: "flex", gap: 6 }}>
                                <button
                                  disabled={apptPage === 1}
                                  onClick={() => setApptPage(p => Math.max(p - 1, 1))}
                                  style={{
                                    padding: "5px 12px",
                                    borderRadius: 8,
                                    border: `1px solid ${C.border}`,
                                    background: apptPage === 1 ? "#F5F5F4" : "#fff",
                                    color: apptPage === 1 ? "#A8A29E" : C.ink,
                                    fontSize: 12,
                                    fontWeight: 650,
                                    cursor: apptPage === 1 ? "not-allowed" : "pointer",
                                    transition: "all 0.2s",
                                    boxShadow: "0 1px 2px rgba(0,0,0,0.05)"
                                  }}
                                >
                                  Prev
                                </button>
                                <button
                                  disabled={apptPage >= totalPages}
                                  onClick={() => setApptPage(p => Math.min(p + 1, totalPages))}
                                  style={{
                                    padding: "5px 12px",
                                    borderRadius: 8,
                                    border: `1px solid ${C.border}`,
                                    background: apptPage >= totalPages ? "#F5F5F4" : "#fff",
                                    color: apptPage >= totalPages ? "#A8A29E" : C.ink,
                                    fontSize: 12,
                                    fontWeight: 650,
                                    cursor: apptPage >= totalPages ? "not-allowed" : "pointer",
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
              }

              // Grid of Salon Containers for Appointments
              const approvedSalons = salons.filter(s => s.status === "approved");

              return (
                <div className="fade-in" style={{ display:"flex", flexDirection:"column", gap:20 }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", background:C.card, padding:"12px 20px", borderRadius:12, border:`1px solid ${C.border}`, boxShadow:"0 1px 3px rgba(0,0,0,0.02)" }}>
                    <span style={{ fontSize:15, fontWeight:700, color:C.ink, fontFamily:"Georgia, serif" }}>Select a Studio to View Appointments</span>
                    <input className="inp" value={search} onChange={e=>{ setSearch(e.target.value); }} placeholder="Search salons..." style={{ ...inputStyle, width:220, padding:"7px 12px", fontSize:12 }}/>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 20 }}>
                    {approvedSalons
                      .filter(s => !search || s.salon_name?.toLowerCase().includes(search.toLowerCase()) || s.address?.toLowerCase().includes(search.toLowerCase()))
                      .map((salon, idx) => {
                        const salonBookings = bookings.filter(b => (b.salon_id?._id || b.salon_id) === salon._id);
                        const pendingCount = salonBookings.filter(b => b.status === "pending").length;
                        return (
                          <div 
                            key={salon._id}
                            onClick={() => {
                              setSelectedSalonId(salon._id);
                              setCustPage(1);
                              setApptPage(1);
                              setServPage(1);
                            }}
                            style={{
                              background: C.card,
                              border: `1.5px solid ${C.border}`,
                              borderRadius: 16,
                              padding: 20,
                              cursor: "pointer",
                              transition: "all 0.22s ease",
                              boxShadow: "0 2px 6px rgba(0,0,0,0.02)",
                              position: "relative",
                              overflow: "hidden"
                            }}
                            onMouseEnter={e => {
                              e.currentTarget.style.transform = "translateY(-4px)";
                              e.currentTarget.style.borderColor = C.gold;
                              e.currentTarget.style.boxShadow = "0 8px 24px rgba(197, 160, 89, 0.08)";
                            }}
                            onMouseLeave={e => {
                              e.currentTarget.style.transform = "translateY(0)";
                              e.currentTarget.style.borderColor = C.border;
                              e.currentTarget.style.boxShadow = "0 2px 6px rgba(0,0,0,0.02)";
                            }}
                          >
                            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 4, background: `linear-gradient(90deg, ${C.gold}, ${C.goldD})` }} />
                            
                            <div style={{ fontSize: 16, fontWeight: 700, color: C.ink, fontFamily: "Georgia, serif", marginBottom: 8 }}>
                              💈 {salon.salon_name}
                            </div>
                            
                            <div style={{ fontSize: 12, color: C.muted, marginBottom: 16, lineHeight: 1.4, height: 34, overflow: "hidden", textOverflow: "ellipsis" }}>
                              📍 {salon.address || salon.state || "No Address"}
                            </div>
                            
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: `1px solid ${C.border}80`, paddingTop: 12 }}>
                              <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                                <span style={{ fontSize: 11, color: C.muted }}>Owner: <strong style={{ color: C.ink }}>{salon.owner_name}</strong></span>
                                {pendingCount > 0 && (
                                  <span style={{ fontSize: 10, color: C.purple, fontWeight: 600 }}>{pendingCount} pending request{pendingCount > 1 ? "s" : ""}</span>
                                )}
                              </div>
                              <span style={{
                                background: C.purpleLight,
                                color: C.purple,
                                padding: "3px 9px",
                                borderRadius: 20,
                                fontSize: 10,
                                fontWeight: 700
                              }}>
                                {salonBookings.length} Bookings
                              </span>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>
              );
            })()}

            {/* ══ SERVICES ══ */}
            {tab==="services" && (
              <div className="fade-in">
                {selectedSalonId && selectedSalonId !== "general" ? (
                  // Single salon view
                  <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <button 
                        onClick={() => setSelectedSalonId("")}
                        style={btnStyle(C.goldLight, C.gold, `1px solid ${C.gold}30`)}
                      >
                        ← Back to All Studios
                      </button>
                    </div>

                    <div style={{ background:C.card, borderRadius:16, border:`1px solid ${C.border}`, overflow:"hidden", boxShadow:"0 1px 4px rgba(0,0,0,.04)" }}>
                      <div style={{ padding:"14px 20px", borderBottom:`1px solid ${C.border}`, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                        <span style={{ fontSize:16, fontWeight:700, color:C.ink, fontFamily:"Georgia, serif" }}>
                          Services for {salons.find(s => s._id === selectedSalonId)?.salon_name || "Selected Studio"}
                        </span>
                      </div>
                      {filteredServices.length===0 ? <div style={{ padding:40, textAlign:"center", color:C.muted }}>No services yet</div>
                      : (() => {
                        const totalPages = Math.ceil(filteredServices.length / servPerPage) || 1;
                        const startIndex = (servPage - 1) * servPerPage;
                        const paginated = filteredServices.slice(startIndex, startIndex + servPerPage);
                        return (
                          <>
                            <div className="w-full overflow-x-auto">
                              <table style={{ width:"100%", borderCollapse:"collapse" }}>
                              <thead><tr>{["Service","Category","Price","Duration","Status","Actions"].map(h=><TH key={h}>{h}</TH>)}</tr></thead>
                              <tbody>
                                {paginated.map(s=>(
                                  <tr key={s._id} className="tr">
                                    <TD style={{ fontSize:13, fontWeight:600, color:C.ink }}>{s.name}</TD>
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
                          </div>

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
                                Showing {filteredServices.length === 0 ? 0 : startIndex + 1} - {Math.min(startIndex + servPerPage, filteredServices.length)} of {filteredServices.length} services
                              </div>
                              
                              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                                {/* Page size dropdown */}
                                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                  <span style={{ fontSize: 12, color: C.muted, fontWeight: 505 }}>Show:</span>
                                   <PaginationSelect 
                                    value={servPerPage} 
                                    onChange={(val) => {
                                      setServPerPage(val);
                                      setServPage(1);
                                    }}
                                    options={[5, 10, 20, 50]}
                                  />
                                </div>

                                {/* Page selection dropdown */}
                                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                  <span style={{ fontSize: 12, color: C.muted, fontWeight: 505 }}>Page:</span>
                                  <PaginationSelect 
                                    value={servPage} 
                                    onChange={setServPage}
                                    options={Array.from({ length: totalPages }, (_, idx) => idx + 1)}
                                  />
                                  <span style={{ fontSize: 12, color: C.muted, fontWeight: 505 }}>of {totalPages}</span>
                                </div>

                                {/* Prev / Next buttons */}
                                <div style={{ display: "flex", gap: 6 }}>
                                  <button
                                    disabled={servPage === 1}
                                    onClick={() => setServPage(p => Math.max(p - 1, 1))}
                                    style={{
                                      padding: "5px 12px",
                                      borderRadius: 8,
                                      border: `1px solid ${C.border}`,
                                      background: servPage === 1 ? "#F5F5F4" : "#fff",
                                      color: servPage === 1 ? "#A8A29E" : C.ink,
                                      fontSize: 12,
                                      fontWeight: 650,
                                      cursor: servPage === 1 ? "not-allowed" : "pointer",
                                      transition: "all 0.2s",
                                      boxShadow: "0 1px 2px rgba(0,0,0,0.05)"
                                    }}
                                  >
                                    Prev
                                  </button>
                                  <button
                                    disabled={servPage >= totalPages}
                                    onClick={() => setServPage(p => Math.min(p + 1, totalPages))}
                                    style={{
                                      padding: "5px 12px",
                                      borderRadius: 8,
                                      border: `1px solid ${C.border}`,
                                      background: servPage >= totalPages ? "#F5F5F4" : "#fff",
                                      color: servPage >= totalPages ? "#A8A29E" : C.ink,
                                      fontSize: 12,
                                      fontWeight: 650,
                                      cursor: servPage >= totalPages ? "not-allowed" : "pointer",
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
                        );
                      })()}
                    </div>
                  </div>
                ) : (
                  // Grid of Salon Containers
                  <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", background:C.card, padding:"12px 20px", borderRadius:12, border:`1px solid ${C.border}`, boxShadow:"0 1px 3px rgba(0,0,0,0.02)" }}>
                      <span style={{ fontSize:15, fontWeight:700, color:C.ink, fontFamily:"Georgia, serif" }}>Select a Studio to View Services</span>
                      <input className="inp" value={search} onChange={e=>{ setSearch(e.target.value); }} placeholder="Search salons..." style={{ ...inputStyle, width:220, padding:"7px 12px", fontSize:12 }}/>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 20 }}>
                      {salons.filter(s => s.status === "approved" && (!search || s.salon_name?.toLowerCase().includes(search.toLowerCase()) || s.address?.toLowerCase().includes(search.toLowerCase()))).map((salon) => {
                        const salonServices = services.filter(s => (s.salon_id?._id || s.salon_id) === salon._id);
                        return (
                          <div 
                            key={salon._id}
                            onClick={() => {
                              setSelectedSalonId(salon._id);
                              setCustPage(1);
                              setApptPage(1);
                              setServPage(1);
                            }}
                            style={{
                              background: C.card,
                              border: `1.5px solid ${C.border}`,
                              borderRadius: 16,
                              padding: 20,
                              cursor: "pointer",
                              transition: "all 0.22s ease",
                              boxShadow: "0 2px 6px rgba(0,0,0,0.02)",
                              position: "relative",
                              overflow: "hidden"
                            }}
                            onMouseEnter={e => {
                              e.currentTarget.style.transform = "translateY(-4px)";
                              e.currentTarget.style.borderColor = C.gold;
                              e.currentTarget.style.boxShadow = "0 8px 24px rgba(197, 160, 89, 0.08)";
                            }}
                            onMouseLeave={e => {
                              e.currentTarget.style.transform = "translateY(0)";
                              e.currentTarget.style.borderColor = C.border;
                              e.currentTarget.style.boxShadow = "0 2px 6px rgba(0,0,0,0.02)";
                            }}
                          >
                            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 4, background: `linear-gradient(90deg, ${C.gold}, ${C.goldD})` }} />
                            
                            <div style={{ fontSize: 16, fontWeight: 700, color: C.ink, fontFamily: "Georgia, serif", marginBottom: 8 }}>
                              💈 {salon.salon_name}
                            </div>
                            
                            <div style={{ fontSize: 12, color: C.muted, marginBottom: 16, lineHeight: 1.4, height: 34, overflow: "hidden", textOverflow: "ellipsis" }}>
                              📍 {salon.address || salon.state || "No Address"}
                            </div>
                            
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: `1px solid ${C.border}80`, paddingTop: 12 }}>
                              <span style={{ fontSize: 11, color: C.muted }}>Owner: <strong style={{ color: C.ink }}>{salon.owner_name}</strong></span>
                              <span style={{
                                background: C.goldLight,
                                color: C.gold,
                                padding: "3px 9px",
                                borderRadius: 20,
                                fontSize: 10,
                                fontWeight: 700
                              }}>
                                {salonServices.length} Services
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ══ PAYMENTS ══ */}
            {tab==="payments" && (() => {
              const approvedSalons = salons.filter(s => s.status === "approved");
              
              if (!selectedSalonId) {
                const searchedSalons = approvedSalons.filter(s => 
                  !search || 
                  s.salon_name?.toLowerCase().includes(search.toLowerCase()) || 
                  s.address?.toLowerCase().includes(search.toLowerCase())
                );
                
                return (
                  <div className="fade-in" style={{ display:"flex", flexDirection:"column", gap:20 }}>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", background:C.card, padding:"12px 20px", borderRadius:12, border:`1px solid ${C.border}`, boxShadow:"0 1px 3px rgba(0,0,0,0.02)" }}>
                      <span style={{ fontSize:15, fontWeight:700, color:C.ink, fontFamily:"Georgia, serif" }}>Select a Studio to View Payments</span>
                      <input className="inp" value={search} onChange={e=>{ setSearch(e.target.value); }} placeholder="Search salons..." style={{ ...inputStyle, width:220, padding:"7px 12px", fontSize:12 }}/>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 20 }}>
                      {searchedSalons.map((salon, idx) => {
                        const salonPayments = payments.filter(p => (p.salon_id?._id || p.salon_id) === salon._id);
                        const capturedPayments = salonPayments.filter(p => {
                          const isSuccess = p.status?.toLowerCase() === "captured" || p.status?.toLowerCase() === "success";
                          if (!isSuccess) return false;
                          const bId = p.booking_id?._id || p.booking_id;
                          const booking = bookings.find(b => b._id === bId);
                          return booking?.status?.toLowerCase() !== "cancelled";
                        });
                        const totalIncome = capturedPayments.reduce((sum, p) => sum + (p.amount || 0), 0);
                        return (
                          <div 
                            key={salon._id}
                            onClick={() => {
                              setSelectedSalonId(salon._id);
                              setPayPage(1);
                              setPayPeriod("all");
                            }}
                            style={{
                              background: C.card,
                              border: `1.5px solid ${C.border}`,
                              borderRadius: 16,
                              padding: 20,
                              cursor: "pointer",
                              transition: "all 0.22s ease",
                              boxShadow: "0 2px 6px rgba(0,0,0,0.02)",
                              position: "relative",
                              overflow: "hidden"
                            }}
                            onMouseEnter={e => {
                              e.currentTarget.style.transform = "translateY(-4px)";
                              e.currentTarget.style.borderColor = C.gold;
                              e.currentTarget.style.boxShadow = "0 8px 24px rgba(197, 160, 89, 0.08)";
                            }}
                            onMouseLeave={e => {
                              e.currentTarget.style.transform = "translateY(0)";
                              e.currentTarget.style.borderColor = C.border;
                              e.currentTarget.style.boxShadow = "0 2px 6px rgba(0,0,0,0.02)";
                            }}
                          >
                            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 4, background: `linear-gradient(90deg, ${C.gold}, ${C.goldD})` }} />
                            
                            <div style={{ fontSize: 16, fontWeight: 700, color: C.ink, fontFamily: "Georgia, serif", marginBottom: 8 }}>
                              💈 {salon.salon_name}
                            </div>
                            
                            <div style={{ fontSize: 12, color: C.muted, marginBottom: 16, lineHeight: 1.4, height: 34, overflow: "hidden", textOverflow: "ellipsis" }}>
                              📍 {salon.address || salon.state || "No Address"}
                            </div>
                            
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: `1px solid ${C.border}80`, paddingTop: 12 }}>
                              <span style={{ fontSize: 11, color: C.muted }}>Owner: <strong style={{ color: C.ink }}>{salon.owner_name}</strong></span>
                              <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-end", gap:2 }}>
                                <span style={{ background: C.greenLight, color: C.green, padding: "2px 8px", borderRadius: 12, fontSize: 10, fontWeight: 700 }}>
                                  ₹{totalIncome.toLocaleString("en-IN")}
                                </span>
                                <span style={{ fontSize: 9, color: C.muted }}>
                                  {capturedPayments.length} txns
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              }

              // Detailed studio payments view
              const currentSalon = salons.find(s => s._id === selectedSalonId);
              const currentSalonName = currentSalon?.salon_name || "Selected Studio";
              const salonPayments = payments.filter(p => (p.salon_id?._id || p.salon_id) === selectedSalonId);

              // Date period filtering helper
              const getPeriodFilteredPayments = (list, period) => {
                if (period === "all") return list;
                const now = new Date();
                
                // Today start: 00:00:00.000 local
                const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
                
                // Week start (Sunday)
                const startOfWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay());
                
                // Month start
                const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
                
                // Year start
                const startOfYear = new Date(now.getFullYear(), 0, 1);
                
                return list.filter(p => {
                  if (!p.created_at) return false;
                  const pDate = new Date(p.created_at);
                  if (period === "day") return pDate >= startOfToday;
                  if (period === "week") return pDate >= startOfWeek;
                  if (period === "month") return pDate >= startOfMonth;
                  if (period === "year") return pDate >= startOfYear;
                  return true;
                });
              };

              const periodPayments = getPeriodFilteredPayments(salonPayments, payPeriod);

              // Calculations for StatCards
              const capturedList = periodPayments.filter(p => {
                const isSuccess = p.status?.toLowerCase() === "captured" || p.status?.toLowerCase() === "success";
                if (!isSuccess) return false;
                const bId = p.booking_id?._id || p.booking_id;
                const booking = bookings.find(b => b._id === bId);
                return booking?.status?.toLowerCase() !== "cancelled";
              });
              const totalIncome = capturedList.reduce((sum, p) => sum + (p.amount || 0), 0);

              const lossList = periodPayments.filter(p => {
                const isFailed = p.status?.toLowerCase() === "failed" || p.status?.toLowerCase() === "refunded";
                const bId = p.booking_id?._id || p.booking_id;
                const booking = bookings.find(b => b._id === bId);
                const isCancelled = booking?.status?.toLowerCase() === "cancelled";
                return isFailed || isCancelled;
              });
              const totalLoss = lossList.reduce((sum, p) => sum + (p.amount || 0), 0);

              const netProfit = totalIncome - totalLoss;

              // Search filtering
              const searchFilteredPayments = periodPayments.filter(p => {
                if (!search) return true;
                const term = search.toLowerCase();
                const custName = p.customer_id?.name?.toLowerCase() || "";
                const custMobile = p.customer_id?.mobile || "";
                const payId = p.razorpay_payment_id?.toLowerCase() || "";
                const payType = p.payment_type?.toLowerCase() || "";
                const payStatus = p.status?.toLowerCase() || "";
                return custName.includes(term) || custMobile.includes(term) || payId.includes(term) || payType.includes(term) || payStatus.includes(term);
              });

              // Pagination
              const totalPages = Math.ceil(searchFilteredPayments.length / payPerPage) || 1;
              const startIndex = (payPage - 1) * payPerPage;
              const paginatedPayments = searchFilteredPayments.slice(startIndex, startIndex + payPerPage);

              const getChartData = () => {
                const now = new Date();
                
                if (payPeriod === "day") {
                  const hours = Array.from({ length: 24 }, (_, i) => ({
                    name: `${String(i).padStart(2, '0')}:00`,
                    Income: 0,
                    Loss: 0
                  }));
                  
                  periodPayments.forEach(p => {
                    if (!p.created_at) return;
                    const hour = new Date(p.created_at).getHours();
                    const isSuccess = p.status?.toLowerCase() === "captured" || p.status?.toLowerCase() === "success";
                    const bId = p.booking_id?._id || p.booking_id;
                    const booking = bookings.find(b => b._id === bId);
                    const isCancelled = booking?.status?.toLowerCase() === "cancelled";
                    
                    const amt = (p.amount || 0);
                    if (isSuccess && !isCancelled) {
                      hours[hour].Income += amt;
                    } else if (p.status?.toLowerCase() === "failed" || p.status?.toLowerCase() === "refunded" || isCancelled) {
                      hours[hour].Loss += amt;
                    }
                  });
                  return hours.filter(h => h.Income > 0 || h.Loss > 0);
                }

                if (payPeriod === "week") {
                  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
                  const weekData = days.map(d => ({ name: d.slice(0, 3), Income: 0, Loss: 0 }));
                  
                  periodPayments.forEach(p => {
                    if (!p.created_at) return;
                    const dayIdx = new Date(p.created_at).getDay();
                    const isSuccess = p.status?.toLowerCase() === "captured" || p.status?.toLowerCase() === "success";
                    const bId = p.booking_id?._id || p.booking_id;
                    const booking = bookings.find(b => b._id === bId);
                    const isCancelled = booking?.status?.toLowerCase() === "cancelled";
                    
                    const amt = (p.amount || 0);
                    if (isSuccess && !isCancelled) {
                      weekData[dayIdx].Income += amt;
                    } else if (p.status?.toLowerCase() === "failed" || p.status?.toLowerCase() === "refunded" || isCancelled) {
                      weekData[dayIdx].Loss += amt;
                    }
                  });
                  
                  const todayIdx = now.getDay();
                  const orderedWeekData = [];
                  for (let i = 6; i >= 0; i--) {
                    const idx = (todayIdx - i + 7) % 7;
                    orderedWeekData.push(weekData[idx]);
                  }
                  return orderedWeekData;
                }

                if (payPeriod === "month") {
                  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
                  const monthData = Array.from({ length: daysInMonth }, (_, i) => ({
                    name: String(i + 1),
                    Income: 0,
                    Loss: 0
                  }));
                  
                  periodPayments.forEach(p => {
                    if (!p.created_at) return;
                    const date = new Date(p.created_at);
                    if (date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear()) {
                      const dateNum = date.getDate();
                      const isSuccess = p.status?.toLowerCase() === "captured" || p.status?.toLowerCase() === "success";
                      const bId = p.booking_id?._id || p.booking_id;
                      const booking = bookings.find(b => b._id === bId);
                      const isCancelled = booking?.status?.toLowerCase() === "cancelled";
                      
                      const amt = (p.amount || 0);
                      if (isSuccess && !isCancelled) {
                        monthData[dateNum - 1].Income += amt;
                      } else if (p.status?.toLowerCase() === "failed" || p.status?.toLowerCase() === "refunded" || isCancelled) {
                        monthData[dateNum - 1].Loss += amt;
                      }
                    }
                  });
                  return monthData.filter((d, i) => d.Income > 0 || d.Loss > 0 || (i + 1) % 5 === 0);
                }

                const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
                const yearData = months.map(m => ({ name: m, Income: 0, Loss: 0 }));
                
                periodPayments.forEach(p => {
                  if (!p.created_at) return;
                  const date = new Date(p.created_at);
                  if (payPeriod === "all" || date.getFullYear() === now.getFullYear()) {
                    const monthIdx = date.getMonth();
                    const isSuccess = p.status?.toLowerCase() === "captured" || p.status?.toLowerCase() === "success";
                    const bId = p.booking_id?._id || p.booking_id;
                    const booking = bookings.find(b => b._id === bId);
                    const isCancelled = booking?.status?.toLowerCase() === "cancelled";
                    
                    const amt = (p.amount || 0);
                    if (isSuccess && !isCancelled) {
                      yearData[monthIdx].Income += amt;
                    } else if (p.status?.toLowerCase() === "failed" || p.status?.toLowerCase() === "refunded" || isCancelled) {
                      yearData[monthIdx].Loss += amt;
                    }
                  }
                });
                
                return yearData;
              };

              const chartData = getChartData();

              const getBreakdownData = () => {
                let tokenCount = 0;
                let fullCount = 0;
                let tokenAmount = 0;
                let fullAmount = 0;

                periodPayments.forEach(p => {
                  const isSuccess = p.status?.toLowerCase() === "captured" || p.status?.toLowerCase() === "success";
                  if (!isSuccess) return;
                  const bId = p.booking_id?._id || p.booking_id;
                  const booking = bookings.find(b => b._id === bId);
                  if (booking?.status?.toLowerCase() === "cancelled") return;

                  const amt = (p.amount || 0);
                  if (p.payment_type?.toUpperCase() === "FULL") {
                    fullCount++;
                    fullAmount += amt;
                  } else {
                    tokenCount++;
                    tokenAmount += amt;
                  }
                });

                return [
                  { name: "Token Payments", Count: tokenCount, Revenue: tokenAmount },
                  { name: "Full Payments", Count: fullCount, Revenue: fullAmount }
                ];
              };

              const breakdownData = getBreakdownData();

              return (
                <div className="fade-in" style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <button 
                      onClick={() => setSelectedSalonId("")}
                      style={btnStyle(C.goldLight, C.gold, `1px solid ${C.gold}30`)}
                    >
                      ← Back to All Studios
                    </button>
                  </div>

                  <div style={{ background: C.card, borderRadius: 16, border: `1px solid ${C.border}`, padding: 20, boxShadow: "0 1px 4px rgba(0,0,0,.04)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 14 }}>
                      <div>
                        <h2 style={{ fontSize: 18, fontWeight: 700, color: C.ink, fontFamily: "Georgia, serif", margin: 0 }}>
                          💈 {currentSalonName} Payments
                        </h2>
                        <p style={{ fontSize: 12, color: C.muted, margin: "4px 0 0 0" }}>
                          Viewing payment history and time-period analysis
                        </p>
                      </div>
                      
                      {/* Time Period Selector Tabs */}
                      <div style={{ display: "flex", gap: 6, background: "#F5F5F4", padding: 4, borderRadius: 10 }}>
                        {[
                          { k: "all", label: "All Time" },
                          { k: "day", label: "Today" },
                          { k: "week", label: "This Week" },
                          { k: "month", label: "This Month" },
                          { k: "year", label: "This Year" }
                        ].map(p => (
                          <button
                            key={p.k}
                            onClick={() => {
                              setPayPeriod(p.k);
                              setPayPage(1);
                            }}
                            style={{
                              padding: "6px 12px",
                              borderRadius: 8,
                              fontSize: 11,
                              fontWeight: 700,
                              cursor: "pointer",
                              border: "none",
                              background: payPeriod === p.k ? C.card : "transparent",
                              color: payPeriod === p.k ? C.goldD : C.muted,
                              boxShadow: payPeriod === p.k ? "0 1px 3px rgba(0,0,0,0.06)" : "none",
                              transition: "all 0.15s ease"
                            }}
                          >
                            {p.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Analytics Stats Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <StatCard 
                      label="Total Income" 
                      value={`₹${totalIncome.toLocaleString("en-IN")}`} 
                      sub="Successful/Captured bookings" 
                      color={C.green} 
                      icon={CreditCard} 
                      iconBg={C.greenLight} 
                      iconColor={C.green}
                    />
                    <StatCard 
                      label="Total Transactions" 
                      value={`${capturedList.length}`} 
                      sub="Completed payments count" 
                      color={C.purple} 
                      icon={CreditCard} 
                      iconBg={C.purpleLight} 
                      iconColor={C.purple}
                    />
                  </div>

                  {/* Graph Analytics Section */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    {/* Left: AreaChart showing Income vs Refund Trend */}
                    <div className="lg:col-span-2" style={{ background: C.card, borderRadius: 16, border: `1px solid ${C.border}`, padding: 20, boxShadow: "0 1px 4px rgba(0,0,0,.04)" }}>
                      <span style={{ fontSize: 14, fontWeight: 700, color: C.ink, fontFamily: "Georgia, serif", display: "block", marginBottom: 16 }}>
                        Income Trend (₹)
                      </span>
                      <div style={{ width: "100%", height: 260 }}>
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <defs>
                              <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={C.green} stopOpacity={0.25}/>
                                <stop offset="95%" stopColor={C.green} stopOpacity={0.01}/>
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={C.border} />
                            <XAxis dataKey="name" stroke={C.muted} fontSize={11} tickLine={false} />
                            <YAxis stroke={C.muted} fontSize={11} tickLine={false} axisLine={false} />
                            <Tooltip 
                              contentStyle={{ background: "#FFF", borderRadius: 8, border: `1px solid ${C.border}`, fontSize: 12 }} 
                              formatter={(value) => [`₹${value}`, ""]}
                            />
                            <Legend wrapperStyle={{ fontSize: 12, paddingTop: 10 }} />
                            <Area type="monotone" dataKey="Income" stroke={C.green} strokeWidth={2.5} fillOpacity={1} fill="url(#colorIncome)" name="Income" />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    {/* Right: BarChart showing Revenue breakdown by Payment Type */}
                    <div style={{ background: C.card, borderRadius: 16, border: `1px solid ${C.border}`, padding: 20, boxShadow: "0 1px 4px rgba(0,0,0,.04)" }}>
                      <span style={{ fontSize: 14, fontWeight: 700, color: C.ink, fontFamily: "Georgia, serif", display: "block", marginBottom: 16 }}>
                        Payment Type Revenue (₹)
                      </span>
                      <div style={{ width: "100%", height: 260 }}>
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={breakdownData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={C.border} />
                            <XAxis dataKey="name" stroke={C.muted} fontSize={11} tickLine={false} />
                            <YAxis stroke={C.muted} fontSize={11} tickLine={false} axisLine={false} />
                            <Tooltip 
                              contentStyle={{ background: "#FFF", borderRadius: 8, border: `1px solid ${C.border}`, fontSize: 12 }}
                              formatter={(value) => [`₹${value}`, "Revenue"]}
                            />
                            <Bar dataKey="Revenue" fill={C.gold} radius={[6, 6, 0, 0]} maxBarSize={45} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>

                  {/* Transactions Table & Search */}
                  <div style={{ background:C.card, borderRadius:16, border:`1px solid ${C.border}`, overflow:"hidden", boxShadow:"0 1px 4px rgba(0,0,0,.04)" }}>
                    <div style={{ padding:"14px 20px", borderBottom:`1px solid ${C.border}`, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                      <span style={{ fontSize:16, fontWeight:700, color:C.ink, fontFamily:"Georgia, serif" }}>
                        {searchFilteredPayments.length} Transactions Found
                      </span>
                      <input 
                        className="inp" 
                        value={search} 
                        onChange={e=>{ setSearch(e.target.value); setPayPage(1); }} 
                        placeholder="Search by customer, payment ID, type..." 
                        style={{ ...inputStyle, width:260, padding:"7px 12px", fontSize:12 }}
                      />
                    </div>

                    {searchFilteredPayments.length === 0 ? (
                      <div style={{ padding:40, textAlign:"center", color:C.muted }}>No payments found for the selected criteria</div>
                    ) : (
                      <>
                        <div className="w-full overflow-x-auto">
                          <table style={{ width:"100%", borderCollapse:"collapse" }}>
                          <thead>
                            <tr>
                              {["Customer", "Payment ID", "Amount", "Type", "Status", "Date"].map(h=><TH key={h}>{h}</TH>)}
                            </tr>
                          </thead>
                          <tbody>
                            {paginatedPayments.map(p=>(
                              <tr key={p._id} className="tr">
                                <TD>
                                  <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                                    <Avatar name={p.customer_id?.name||"C"} size={28} color={C.purple} bg={C.purpleLight}/>
                                    <div>
                                      <div style={{ fontSize:13, fontWeight:600, color:C.ink }}>{p.customer_id?.name||"—"}</div>
                                      <div style={{ fontSize:10, color:C.muted }}>{p.customer_id?.mobile||""}</div>
                                    </div>
                                  </div>
                                </TD>
                                <TD style={{ fontSize:12, color:C.muted, fontFamily:"monospace" }}>
                                  {p.razorpay_payment_id || p.razorpay_order_id || "Manual/Offline"}
                                </TD>
                                <TD style={{ fontSize:13, fontWeight:700, color:C.ink }}>
                                  ₹{(p.amount||0).toLocaleString("en-IN")}
                                </TD>
                                <TD>
                                  <Badge label={p.payment_type||"TOKEN"} color={p.payment_type?.toUpperCase()==="FULL"?C.green:C.blue}/>
                                </TD>
                                <TD>
                                  <Badge 
                                    label={p.status} 
                                    color={
                                      p.status?.toLowerCase()==="success" || p.status?.toLowerCase()==="captured"
                                        ? C.green
                                        : p.status?.toLowerCase()==="refunded"
                                        ? C.blue
                                        : p.status?.toLowerCase()==="pending"
                                        ? C.amber
                                        : C.red
                                    }
                                  />
                                </TD>
                                <TD style={{ fontSize:12, color:C.muted }}>
                                  {p.created_at ? new Date(p.created_at).toLocaleString("en-IN", { dateStyle: "short", timeStyle: "short" }) : "—"}
                                </TD>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                        
                        {/* Pagination Footer */}
                        <div style={{ padding: "12px 20px", background: "#FAFAF8", borderTop: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
                          <div style={{ fontSize: 12, color: C.muted, fontWeight: 505 }}>
                            Showing {searchFilteredPayments.length === 0 ? 0 : startIndex + 1} - {Math.min(startIndex + payPerPage, searchFilteredPayments.length)} of {searchFilteredPayments.length} items
                          </div>
                          
                          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                            {/* Show per page dropdown */}
                            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                              <span style={{ fontSize: 12, color: C.muted, fontWeight: 505 }}>Show:</span>
                               <PaginationSelect 
                                value={payPerPage} 
                                onChange={(val) => {
                                  setPayPerPage(val);
                                  setPayPage(1);
                                }}
                                options={[5, 10, 20, 50]}
                              />
                            </div>

                            {/* Page selection dropdown */}
                            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                              <span style={{ fontSize: 12, color: C.muted, fontWeight: 505 }}>Page:</span>
                              <PaginationSelect 
                                value={payPage} 
                                onChange={setPayPage}
                                options={Array.from({ length: totalPages }, (_, idx) => idx + 1)}
                              />
                              <span style={{ fontSize: 12, color: C.muted, fontWeight: 505 }}>of {totalPages}</span>
                            </div>

                            {/* Prev / Next buttons */}
                            <div style={{ display: "flex", gap: 6 }}>
                              <button
                                disabled={payPage === 1}
                                onClick={() => setPayPage(p => Math.max(p - 1, 1))}
                                style={{
                                  padding: "5px 12px",
                                  borderRadius: 8,
                                  border: `1px solid ${C.border}`,
                                  background: payPage === 1 ? "#F5F5F4" : "#fff",
                                  color: payPage === 1 ? "#A8A29E" : C.ink,
                                  fontSize: 12,
                                  fontWeight: 650,
                                  cursor: payPage === 1 ? "not-allowed" : "pointer",
                                  transition: "all 0.2s",
                                  boxShadow: "0 1px 2px rgba(0,0,0,0.05)"
                                }}
                              >
                                Prev
                              </button>
                              <button
                                disabled={payPage >= totalPages}
                                onClick={() => setPayPage(p => Math.min(p + 1, totalPages))}
                                style={{
                                  padding: "5px 12px",
                                  borderRadius: 8,
                                  border: `1px solid ${C.border}`,
                                  background: payPage >= totalPages ? "#F5F5F4" : "#fff",
                                  color: payPage >= totalPages ? "#A8A29E" : C.ink,
                                  fontSize: 12,
                                  fontWeight: 650,
                                  cursor: payPage >= totalPages ? "not-allowed" : "pointer",
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


            {/* ══ SALON PERFORMANCE ══ */}
            {tab==="reviews" && (() => {
              const approvedSalons = salons.filter(s => s.status === "approved");
              const salonPerformances = approvedSalons.map(s => getSalonPerformanceData(s));

              // Top revenue salon
              const topRevenueSalon = salonPerformances.length > 0 
                ? [...salonPerformances].sort((a, b) => b.netProfit - a.netProfit)[0]
                : null;

              // Highest rated salon
              const topRatedSalon = salonPerformances.length > 0
                ? [...salonPerformances].sort((a, b) => b.avgRating - a.avgRating)[0]
                : null;

              // Salons with negative net profit or high loss
              const lossSalonsCount = salonPerformances.filter(p => p.netProfit < 0 || p.loss > p.income * 0.4).length;

              return (
                <div className="fade-in">
                  {/* Performance Summary Cards */}
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16, marginBottom: 24 }}>
                    <StatCard 
                      label="Tracked Studios" 
                      value={approvedSalons.length} 
                      sub="Active & Approved" 
                      color={C.gold} 
                      icon={Store} 
                      iconBg={C.goldLight} 
                      iconColor={C.gold} 
                    />
                    <StatCard 
                      label="Most Profitable" 
                      value={topRevenueSalon ? `₹${topRevenueSalon.netProfit.toLocaleString("en-IN", { maximumFractionDigits: 0 })}` : "₹0"} 
                      sub={topRevenueSalon ? topRevenueSalon.salon.salon_name : "No data"} 
                      color={C.green} 
                      icon={CreditCard} 
                      iconBg={C.greenLight} 
                      iconColor={C.green} 
                    />
                    <StatCard 
                      label="Highest Rated" 
                      value={topRatedSalon ? `${topRatedSalon.avgRating.toFixed(1)} ★` : "5.0 ★"} 
                      sub={topRatedSalon ? topRatedSalon.salon.salon_name : "No data"} 
                      color={C.purple} 
                      icon={Star} 
                      iconBg={C.purpleLight} 
                      iconColor={C.purple} 
                    />
                  </div>

                  {/* Main comparison list */}
                  <div style={{ background: C.card, borderRadius: 16, border: `1px solid ${C.border}`, overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,.04)" }}>
                    <div style={{ padding: "16px 20px", borderBottom: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div>
                        <span style={{ fontSize: 16, fontWeight: 700, color: C.ink, fontFamily: "Georgia, serif", display: "block" }}>Studios Performance Comparison</span>
                        <span style={{ fontSize: 11, color: C.muted, marginTop: 4 }}>Compare financial status, booking completion rates, and average customer ratings.</span>
                      </div>
                    </div>

                    <div style={{ overflowX: "auto" }}>
                      <table style={{ width: "100%", borderCollapse: "collapse" }}>
                        <thead>
                          <tr>
                            <TH>Salon / Studio</TH>
                            <TH>Financial Summary</TH>
                            <TH>Total Income</TH>
                            <TH>Booking Success</TH>
                            <TH>Avg Rating</TH>
                            <TH>Action</TH>
                          </tr>
                        </thead>
                        <tbody>
                          {salonPerformances.length === 0 ? (
                            <tr>
                              <td colSpan={6} style={{ padding: 40, textAlign: "center", color: C.muted, fontSize: 13 }}>No active salons available for analysis.</td>
                            </tr>
                          ) : (
                            salonPerformances.map((p, i) => {
                              const completionRate = p.bookingsCount > 0 
                                ? Math.round((p.completedCount / p.bookingsCount) * 100)
                                : 0;
                              const profitLabel = "Income";
                              const profitColor = C.green;
                              const profitBg = C.greenLight;

                              return (
                                <tr key={p.salon._id} className="tr" style={{ transition: "background 0.2s" }}>
                                  <TD>
                                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                      <img src={p.salon.images?.[0] || salonImg(i)} alt={p.salon.salon_name} style={{ width: 40, height: 40, borderRadius: 8, objectFit: "cover", border: `1px solid ${C.border}` }} />
                                      <div>
                                        <div style={{ fontSize: 13, fontWeight: 700, color: C.ink }}>{p.salon.salon_name}</div>
                                        <div style={{ fontSize: 11, color: C.muted }}>Owner: {p.salon.owner_name}</div>
                                      </div>
                                    </div>
                                  </TD>
                                  <TD>
                                    <span style={{
                                      padding: "4px 10px", borderRadius: 8, fontSize: 11, fontWeight: 700,
                                      background: profitBg, color: profitColor, border: `1px solid ${profitColor}30`, whiteSpace: "nowrap"
                                    }}>
                                      {profitLabel}: ₹{p.income.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
                                    </span>
                                  </TD>
                                  <TD style={{ fontSize: 12 }}>
                                    <div style={{ color: C.green, fontWeight: 600 }}>₹{p.income.toLocaleString("en-IN", { maximumFractionDigits: 0 })}</div>
                                  </TD>
                                  <TD>
                                    <div style={{ display: "flex", flexDirection: "column", gap: 4, width: 120 }}>
                                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, fontWeight: 650 }}>
                                        <span style={{ color: C.muted }}>{completionRate}% Successful</span>
                                        <span style={{ color: C.ink }}>{p.bookingsCount} total</span>
                                      </div>
                                      <div style={{ width: "100%", height: 6, borderRadius: 3, backgroundColor: "#E7E5E4", overflow: "hidden" }}>
                                        <div style={{ width: `${completionRate}%`, height: "100%", backgroundColor: completionRate > 75 ? C.green : completionRate > 50 ? C.orange : C.red, borderRadius: 3 }} />
                                      </div>
                                    </div>
                                  </TD>
                                  <TD>
                                    <div style={{ display: "flex", alignItems: "center", gap: 4, fontWeight: 700, fontSize: 13, color: C.ink }}>
                                      <Star size={14} fill="#F59E0B" color="#F59E0B" />
                                      {p.avgRating.toFixed(1)}
                                      <span style={{ fontSize: 11, color: C.muted, fontWeight: 500 }}>({p.reviews.length})</span>
                                    </div>
                                  </TD>
                                  <TD>
                                    <button 
                                      className="action-btn" 
                                      onClick={() => setSelectedPerformanceSalon(p)} 
                                      style={btnStyle(C.goldLight, C.gold, `1px solid ${C.gold}30`)}
                                    >
                                      Analyze Why
                                    </button>
                                  </TD>
                                </tr>
                              );
                            })
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* ══ LIVE MONITORING ══ */}
            {tab==="live" && (
              <div className="fade-in">
                <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:16, background:C.card, padding:"10px 16px", borderRadius:10, border:`1px solid ${C.border}`, width:"fit-content", boxShadow:"0 1px 4px rgba(0,0,0,.04)" }}>
                  <div style={{ width:8, height:8, borderRadius:"50%", background:C.green }}/>
                  <span style={{ fontSize:12, color:C.green, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.08em" }}>Live Monitoring Active</span>
                  <span style={{ fontSize:12, color:C.muted }}>· {filteredBarbers.length} barbers tracked</span>
                </div>
                {filteredBarbers.length===0 ? <div style={{ background:C.card, borderRadius:16, border:`1px solid ${C.border}`, padding:60, textAlign:"center", color:C.muted }}>No barbers to monitor</div>
                : (
                  <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))", gap:14 }}>
                    {filteredBarbers.map((b,i)=>(
                      <div 
                        key={b._id} 
                        onClick={() => setSelectedBarber(b)}
                        onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.08)"; }}
                        onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 1px 4px rgba(0,0,0,.04)"; }}
                        style={{ background:C.card, borderRadius:16, border:`2px solid ${b.status==="available"?C.green+"40":C.border}`, overflow:"hidden", boxShadow:"0 1px 4px rgba(0,0,0,.04)", cursor:"pointer", transition:"transform 0.2s, box-shadow 0.2s" }}
                      >
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
                          <div style={{ fontSize:12, color:C.muted, marginBottom:4 }}>Salon: <span style={{ color:C.gold, fontWeight:700 }}>{b.salon_id?.salon_name||"—"}</span></div>
                          <div style={{ fontSize:11, color:C.muted, marginBottom:4 }}>Mobile: <strong style={{ color:C.ink }}>{b.mobile}</strong></div>
                          <div style={{ fontSize:11, color:C.muted, marginBottom:4 }}>Password: <strong style={{ color:C.red }}>••••••••</strong></div>
                          <div style={{ fontSize:11, color:C.muted, marginBottom:12 }}>Registered: <strong style={{ color:C.ink }}>{b.created_at ? new Date(b.created_at).toLocaleDateString("en-IN") : "—"}</strong></div>
                          
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ══ SUPPORT TICKETS ══ */}
            {tab==="tickets" && (() => {
              const typeFilter = window.location.pathname.includes("customer-issues") 
                ? "Customer" 
                : window.location.pathname.includes("salon-issues") 
                ? "Salon" 
                : undefined;
              return (
                <div className="fade-in">
                  <TicketsPage {...ticketState} typeFilter={typeFilter} />
                </div>
              );
            })()}

            {/* ══ OWNER REQUESTS ══ */}
            {tab==="ownerRequests" && (() => {
               const filteredRequests = approvalRequests.filter(req => {
                 const matchesFilter = ownerRequestFilter === "All" || req.status === ownerRequestFilter.toLowerCase();
                 const query = ownerRequestSearch.toLowerCase();
                 const matchesSearch = !query || 
                   req.salon_name.toLowerCase().includes(query) ||
                   req.owner_name.toLowerCase().includes(query) ||
                   (req.request_type && req.request_type.toLowerCase().includes(query));
                 return matchesFilter && matchesSearch;
               });

               return (
                 <div className="fade-in" style={{ padding: "0 0 60px", display: "flex", flexDirection: "column", gap: 20 }}>
                   {/* Top Header Card */}
                   <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", borderBottom:`1px solid ${C.border}`, paddingBottom:16 }}>
                     <div>
                       <span style={{ fontSize:10, fontWeight:700, color:C.gold, textTransform:"uppercase", letterSpacing:"0.18em" }}>Salon Operations Console</span>
                       <h2 style={{ fontSize:22, fontWeight:700, color:C.ink, margin:"4px 0 0 0", fontFamily:"Georgia, serif" }}>Owner Update Requests</h2>
                     </div>
                     
                     <div style={{ display:"flex", alignItems:"center", gap:8, background:C.card, border:`1px solid ${C.border}`, padding:"8px 16px", borderRadius:10, boxShadow:"0 1px 4px rgba(0,0,0,.04)" }}>
                       <ShieldCheck size={16} color={C.gold} />
                       <span style={{ fontSize:12, fontWeight:700, color:C.ink }}>{approvalRequests.filter(r => r.status === "pending").length} Pending Requests</span>
                     </div>
                   </div>

                   {/* Filters and Search Row */}
                   <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", gap:16, flexWrap:"wrap" }}>
                     <div style={{ display:"flex", gap:8 }}>
                       {["All", "Pending", "Approved", "Rejected"].map(filterVal => {
                         const count = filterVal === "All" 
                           ? approvalRequests.length 
                           : approvalRequests.filter(r => r.status === filterVal.toLowerCase()).length;
                         const isActive = ownerRequestFilter === filterVal;
                         return (
                           <button
                             key={filterVal}
                             onClick={() => setOwnerRequestFilter(filterVal)}
                             style={{
                               padding: "8px 16px",
                               borderRadius: 20,
                               fontSize: 12,
                               fontWeight: 700,
                               cursor: "pointer",
                               border: `1px solid ${isActive ? C.gold : C.border}`,
                               background: isActive ? C.gold : "#fff",
                               color: isActive ? "#fff" : C.muted,
                               transition: "all 0.2s"
                             }}
                           >
                             {filterVal} ({count})
                           </button>
                         );
                       })}
                     </div>

                     <div style={{ position:"relative", width:300 }}>
                       <input
                         type="text"
                         placeholder="Search by salon, owner, type..."
                         value={ownerRequestSearch}
                         onChange={(e) => setOwnerRequestSearch(e.target.value)}
                         style={{
                           width: "100%",
                           padding: "10px 16px",
                           borderRadius: 12,
                           border: `1px solid ${C.border}`,
                           fontSize: 12,
                           outline: "none",
                           background: "#fff",
                           color: C.ink
                         }}
                       />
                     </div>
                   </div>

                   {/* Main requests stream list */}
                   {filteredRequests.length === 0 ? (
                     <div style={{ background:C.card, borderRadius:16, border:`1px solid ${C.border}`, padding:60, textAlign:"center", color:C.muted }}>
                       No requests matching the selected filter query criteria.
                     </div>
                   ) : (
                     <div style={{ background: C.card, borderRadius: 16, border: `1px solid ${C.border}`, overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,.04)" }}>
                       <div className="w-full overflow-x-auto">
                        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                         <thead>
                           <tr style={{ background: "#FAFAF8", borderBottom: `1px solid ${C.border}` }}>
                             <th style={{ padding: "14px 20px", fontSize: 10, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: "0.08em" }}>Salon & Owner</th>
                             <th style={{ padding: "14px 20px", fontSize: 10, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: "0.08em" }}>Request Type</th>
                             <th style={{ padding: "14px 20px", fontSize: 10, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: "0.08em" }}>Submitted Date</th>
                             <th style={{ padding: "14px 20px", fontSize: 10, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: "0.08em" }}>Status</th>
                             <th style={{ padding: "14px 20px", fontSize: 10, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: "0.08em", textAlign: "right" }}>Action</th>
                           </tr>
                         </thead>
                         <tbody>
                           {filteredRequests.map(req => {
                             let typeLabel = req.request_type ? req.request_type.replace("_", " ") : "address change";
                             let statusColor = req.status === "approved" ? C.green : req.status === "rejected" ? C.red : C.orange;
                             return (
                               <tr key={req._id} style={{ borderBottom: `1px solid ${C.border}`, transition: "background 0.2s" }} className="table-row-hover">
                                 <td style={{ padding: "16px 20px" }}>
                                   <div style={{ fontWeight: 700, color: C.ink }}>{req.salon_name}</div>
                                   <div style={{ fontSize: 11, color: C.muted }}>Owner: {req.owner_name}</div>
                                 </td>
                                 <td style={{ padding: "16px 20px", textTransform: "capitalize" }}>
                                   <span style={{ fontSize: 11, fontWeight: 600, color: C.ink }}>{typeLabel}</span>
                                 </td>
                                 <td style={{ padding: "16px 20px", fontSize: 12, color: C.muted }}>
                                   {formatDate(req.created_at)}
                                 </td>
                                 <td style={{ padding: "16px 20px" }}>
                                   <Badge label={req.status} color={statusColor} />
                                 </td>
                                 <td style={{ padding: "16px 20px", textAlign: "right" }}>
                                   <button
                                     onClick={() => {
                                       setSelectedRequest(req);
                                       setAdminNote(req.admin_note || "");
                                     }}
                                     style={{
                                       padding: "6px 12px",
                                       fontSize: 11,
                                       fontWeight: 700,
                                       borderRadius: 8,
                                       cursor: "pointer",
                                       border: `1px solid ${C.gold}`,
                                       background: "transparent",
                                       color: C.gold,
                                       transition: "all 0.2s"
                                     }}
                                   >
                                     Review Changes
                                   </button>
                                 </td>
                               </tr>
                             );
                           })}
                         </tbody>
                       </table>
                      </div>
                     </div>
                   )}

                   {/* Detail Review Modal popup */}
                   {selectedRequest && (
                     <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.4)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:1000, backdropFilter:"blur(4px)" }}>
                       <div className="scale-up" style={{ background: "#fff", borderRadius: 16, width: "100%", maxWidth: 640, overflow: "hidden", boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)" }}>
                         
                         {/* Modal Header */}
                         <div style={{ background: "linear-gradient(to right, #8B5A2B, #4A3E3D)", padding: "20px 24px", color: "#fff", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                           <div>
                             <span style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: 1.2, color: "rgba(255,255,255,0.7)", fontWeight: 700 }}>Review Update Request</span>
                             <h3 style={{ fontSize: 18, fontWeight: 700, margin: "2px 0 0 0", fontFamily: "Georgia, serif" }}>{selectedRequest.salon_name}</h3>
                           </div>
                           <button onClick={() => setSelectedRequest(null)} style={{ border: "none", background: "none", color: "#fff", cursor: "pointer" }}>
                             <X size={20} />
                           </button>
                         </div>

                         {/* Modal Content */}
                         <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 18, maxHeight: "calc(100vh - 200px)", overflowY: "auto" }}>
                           {/* Info grid */}
                           <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, background: C.bg, padding: 12, borderRadius: 10 }}>
                             <div>
                               <div style={{ fontSize: 9, color: C.muted, fontWeight: 700, textTransform: "uppercase" }}>Salon Owner</div>
                               <div style={{ fontSize: 12, color: C.ink, fontWeight: 600 }}>{selectedRequest.owner_name}</div>
                             </div>
                             <div>
                               <div style={{ fontSize: 9, color: C.muted, fontWeight: 700, textTransform: "uppercase" }}>Request Type</div>
                               <div style={{ fontSize: 12, color: C.ink, fontWeight: 600, textTransform: "capitalize" }}>{selectedRequest.request_type ? selectedRequest.request_type.replace("_", " ") : "address change"}</div>
                             </div>
                           </div>

                           {/* Proposed Changes Matrix */}
                           <div>
                             <div style={{ fontSize: 11, fontWeight: 700, color: C.gold, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 8 }}>Proposed Values & Comparison</div>
                             
                             {/* If general query request type */}
                             {selectedRequest.request_type === "general_query" ? (
                               <div style={{ background: "#FAFAF8", padding: 14, borderRadius: 8, border: `1px solid ${C.border}` }}>
                                 <div style={{ fontSize: 10, color: C.muted, fontWeight: 700, marginBottom: 4, textTransform: "uppercase" }}>Query Message / Request Description</div>
                                 <p style={{ fontSize: 12, color: C.ink, margin: 0, whiteSpace: "pre-wrap", lineHeight: 1.5 }}>
                                   {selectedRequest.proposed_changes?.query_text || (selectedRequest.proposed_changes instanceof Map ? selectedRequest.proposed_changes.get("query_text") : selectedRequest.proposed_changes?.query_text) || "No details provided"}
                                 </p>
                               </div>
                             ) : (
                               <div style={{ border: `1px solid ${C.border}`, borderRadius: 8, overflow: "hidden" }}>
                                 <div className="w-full overflow-x-auto">
                                    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12, textAlign: "left" }}>
                                   <thead>
                                     <tr style={{ background: "#FAFAF8", borderBottom: `1px solid ${C.border}` }}>
                                       <th style={{ padding: "8px 12px", fontWeight: 700, color: C.muted }}>Field</th>
                                       <th style={{ padding: "8px 12px", fontWeight: 700, color: C.muted }}>Current Value</th>
                                       <th style={{ padding: "8px 12px", fontWeight: 700, color: C.muted }}>Proposed Value</th>
                                     </tr>
                                   </thead>
                                   <tbody>
                                     {Object.keys(selectedRequest.proposed_changes || {}).map(field => {
                                       const currentVal = selectedRequest.current_values?.[field];
                                       const proposedVal = selectedRequest.proposed_changes?.[field];
                                       
                                       const renderVal = (v) => {
                                         if (typeof v === "object" && v !== null) return JSON.stringify(v);
                                         return String(v ?? "—");
                                       };

                                       return (
                                         <tr key={field} style={{ borderBottom: `1px solid ${C.border}` }}>
                                           <td style={{ padding: "10px 12px", fontWeight: 700, textTransform: "capitalize" }}>{field.replace("_", " ")}</td>
                                           <td style={{ padding: "10px 12px", color: C.muted }}>{renderVal(currentVal)}</td>
                                           <td style={{ padding: "10px 12px", color: C.green, fontWeight: 700 }}>{renderVal(proposedVal)}</td>
                                         </tr>
                                       );
                                     })}
                                   </tbody>
                                 </table>
                                 </div>
                               </div>
                             )}
                           </div>

                           {/* Resolution Note Section */}
                           <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                             <label style={{ fontSize: 10, fontWeight: 700, color: C.muted, textTransform: "uppercase" }}>Admin Action Feedback / Resolution Note</label>
                             <textarea
                               value={adminNote}
                               onChange={(e) => setAdminNote(e.target.value)}
                               placeholder="Add verification findings, approval note, or reason for rejection here..."
                               disabled={selectedRequest.status !== "pending"}
                               style={{
                                 width: "100%",
                                 height: 80,
                                 borderRadius: 8,
                                 border: `1px solid ${C.border}`,
                                 padding: 10,
                                 fontSize: 12,
                                 outline: "none",
                                 resize: "none",
                                 background: selectedRequest.status !== "pending" ? "#FAF8F6" : "#fff",
                                 color: C.ink
                               }}
                             />
                           </div>

                           {/* Resolution details if already resolved */}
                           {selectedRequest.status !== "pending" && (
                             <div style={{ background: selectedRequest.status === "approved" ? C.greenLight : C.redLight, border: `1px solid ${selectedRequest.status === "approved" ? C.green : C.red}30`, padding: 12, borderRadius: 10 }}>
                               <div style={{ fontSize: 11, fontWeight: 700, color: selectedRequest.status === "approved" ? C.green : C.red, textTransform: "uppercase" }}>
                                 Resolution details
                               </div>
                               <div style={{ fontSize: 11, color: C.muted, marginTop: 4 }}>
                                 Decision: <strong style={{ textTransform: "capitalize", color: selectedRequest.status === "approved" ? C.green : C.red }}>{selectedRequest.status}</strong>
                               </div>
                               {selectedRequest.resolved_at && (
                                 <div style={{ fontSize: 11, color: C.muted }}>
                                   Resolved On: {new Date(selectedRequest.resolved_at).toLocaleString("en-IN")}
                                 </div>
                               )}
                             </div>
                           )}
                         </div>

                         {/* Modal Footer */}
                         <div style={{ padding: "16px 24px", borderTop: `1px solid ${C.border}`, display: "flex", justifyContent: "flex-end", gap: 10, background: "#FAFAF8" }}>
                           <button
                             onClick={() => setSelectedRequest(null)}
                             style={{
                               padding: "8px 16px",
                               fontSize: 12,
                               fontWeight: 700,
                               borderRadius: 8,
                               border: `1px solid ${C.border}`,
                               background: "#fff",
                               color: C.muted,
                               cursor: "pointer"
                             }}
                           >
                             Cancel
                           </button>
                           
                           {selectedRequest.status === "pending" && (
                             <>
                               <button
                                 onClick={() => {
                                   handleApprovalRequest(selectedRequest._id, "rejected", adminNote);
                                   setSelectedRequest(null);
                                 }}
                                 style={{
                                   padding: "8px 16px",
                                   fontSize: 12,
                                   fontWeight: 700,
                                   borderRadius: 8,
                                   border: "none",
                                   background: C.red,
                                   color: "#fff",
                                   cursor: "pointer"
                                 }}
                               >
                                 Reject Request
                               </button>
                               <button
                                 onClick={() => {
                                   handleApprovalRequest(selectedRequest._id, "approved", adminNote);
                                   setSelectedRequest(null);
                                 }}
                                 style={{
                                   padding: "8px 16px",
                                   fontSize: 12,
                                   fontWeight: 700,
                                   borderRadius: 8,
                                   border: "none",
                                   background: C.green,
                                   color: "#fff",
                                   cursor: "pointer"
                                 }}
                               >
                                 Approve & Apply
                               </button>
                             </>
                           )}
                         </div>

                       </div>
                     </div>
                   )}
                 </div>
               );
            })()}

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


      {/* ══ VIEW DETAILS MODAL ══ */}
      {viewingSalon && (
        <div style={{ position:"fixed", inset:0, zIndex:50, display:"flex", alignItems:"center", justifyContent:"center", padding:16, background:"rgba(0,0,0,.5)", backdropFilter:"blur(4px)" }}
          onClick={() => setViewingSalon(null)}>
          <div style={{ background:C.card, border:`1px solid ${C.border}`, width:"100%", maxWidth:650, borderRadius:16, padding:24, boxShadow:"0 20px 60px rgba(0,0,0,.15)", display:"flex", flexDirection:"column", maxHeight:"90vh" }}
            onClick={e=>e.stopPropagation()}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", borderBottom:`1px solid ${C.border}`, paddingBottom:12, marginBottom:16 }}>
              <div>
                <div style={{ fontSize:22, fontWeight:700, color:C.ink, fontFamily:"Georgia, serif" }}>{viewingSalon.salon_name}</div>
                <div style={{ fontSize:11, color:C.muted, marginTop:2 }}>Submitted by {viewingSalon.owner_name}</div>
              </div>
              <button type="button" onClick={() => setViewingSalon(null)} style={{ background:"none", border:"none", cursor:"pointer", color:C.muted }}>
                <X size={20} />
              </button>
            </div>

            <div style={{ flex:1, overflowY:"auto", paddingRight:6, display:"flex", flexDirection:"column", gap:20 }}>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
                <div>
                  <h4 style={{ fontSize:12, fontWeight:700, color:C.gold, borderBottom:`1px solid ${C.border}`, paddingBottom:4, marginBottom:8 }}>General Info</h4>
                  <div style={{ display:"flex", flexDirection:"column", gap:6, fontSize:12 }}>
                    <div style={{ display:"flex", justifyContent:"space-between" }}><span style={{ color:C.muted }}>Mobile:</span> <strong>{viewingSalon.mobile || "—"}</strong></div>
                    <div style={{ display:"flex", justifyContent:"space-between" }}><span style={{ color:C.muted }}>Email:</span> <strong>{viewingSalon.owner_email || viewingSalon.email || "—"}</strong></div>
                    <div style={{ display:"flex", justifyContent:"space-between" }}><span style={{ color:C.muted }}>Support Hotline:</span> <strong>{viewingSalon.support_number || "—"}</strong></div>
                    <div style={{ display:"flex", justifyContent:"space-between" }}><span style={{ color:C.muted }}>Opening Hours:</span> <strong>{viewingSalon.opening_time} - {viewingSalon.closing_time}</strong></div>
                    <div style={{ display:"flex", justifyContent:"space-between" }}><span style={{ color:C.muted }}>Active Barbers:</span> <strong>{viewingSalon.number_of_barbers}</strong></div>
                    <div style={{ display:"flex", justifyContent:"space-between" }}><span style={{ color:C.muted }}>Salary Model:</span> <strong style={{ textTransform:"capitalize" }}>{viewingSalon.salary_model}</strong></div>
                  </div>
                </div>

                <div>
                  <h4 style={{ fontSize:12, fontWeight:700, color:C.gold, borderBottom:`1px solid ${C.border}`, paddingBottom:4, marginBottom:8 }}>Legal Identifiers</h4>
                  <div style={{ display:"flex", flexDirection:"column", gap:6, fontSize:12 }}>
                    <div style={{ display:"flex", justifyContent:"space-between" }}><span style={{ color:C.muted }}>GSTIN:</span> <strong>{viewingSalon.gstin || "—"}</strong></div>
                    <div style={{ display:"flex", justifyContent:"space-between" }}><span style={{ color:C.muted }}>License No:</span> <strong>{viewingSalon.license_number || "—"}</strong></div>
                    <div style={{ display:"flex", flexDirection:"column", gap:2, marginTop:4 }}>
                      <span style={{ color:C.muted }}>Address:</span>
                      <strong style={{ lineHeight:1.4 }}>{viewingSalon.address || "—"}</strong>
                    </div>
                  </div>
                </div>
              </div>

              {viewingSalon.about && (
                <div>
                  <h4 style={{ fontSize:12, fontWeight:700, color:C.gold, borderBottom:`1px solid ${C.border}`, paddingBottom:4, marginBottom:6 }}>About</h4>
                  <p style={{ fontSize:12, color:C.ink, margin:0, lineHeight:1.5 }}>{viewingSalon.about}</p>
                </div>
              )}

              {viewingSalon.images && viewingSalon.images.length > 0 && (
                <div>
                  <h4 style={{ fontSize:12, fontWeight:700, color:C.gold, borderBottom:`1px solid ${C.border}`, paddingBottom:4, marginBottom:8 }}>Studio Gallery</h4>
                  <div style={{ display:"grid", gridTemplateColumns:"repeat(4, 1fr)", gap:8 }}>
                    {viewingSalon.images.map((img, idx) => (
                      <div key={idx} style={{ height:64, borderRadius:8, overflow:"hidden", border:`1px solid ${C.border}` }}>
                        <img src={img} alt="" style={{ width:"100%", height:"100%", objectFit:"cover" }} />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <h4 style={{ fontSize:12, fontWeight:700, color:C.gold, borderBottom:`1px solid ${C.border}`, paddingBottom:4, marginBottom:8 }}>Verification Documents</h4>
                <div style={{ display:"grid", gridTemplateColumns:"repeat(2, 1fr)", gap:10 }}>
                  <DocumentPreview label="Shop & Establishment Certificate" data={viewingSalon.shop_establishment_certificate} />
                  <DocumentPreview label="Trade License" data={viewingSalon.trade_license} />
                  <DocumentPreview label="GST Certificate" data={viewingSalon.gst_certificate} />
                  <DocumentPreview label="Aadhaar Card" data={viewingSalon.aadhaar_card} />
                </div>
              </div>
            </div>

            <div style={{ display:"flex", gap:8, borderTop:`1px solid ${C.border}`, paddingTop:12, marginTop:16 }}>
              <button type="button" onClick={() => setViewingSalon(null)} style={{ flex:1, padding:10, border:`1px solid ${C.border}`, borderRadius:8, color:C.muted, fontSize:13, background:"#fff", cursor:"pointer", fontFamily:"inherit" }}>Close</button>
              {viewingSalon.status !== "approved" && (
                <button type="button" className="action-btn" onClick={() => { updateSalonStatus(viewingSalon._id, "approved"); setViewingSalon(null); }}
                  style={{ flex:2, padding:10, background:C.green, color:"#fff", borderRadius:8, fontSize:13, fontWeight:700, border:"none", cursor:"pointer", fontFamily:"inherit" }}>
                  Approve Salon
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ══ BARBER DETAILS MODAL ══ */}
      {selectedBarber && (
        <div 
          style={{ 
            position: "fixed", inset: 0, zIndex: 1000, 
            display: "flex", alignItems: "center", justifyContext: "center", 
            justifyContent: "center",
            padding: 16, background: "rgba(28, 25, 23, 0.6)", backdropFilter: "blur(4px)" 
          }}
          onClick={() => { setSelectedBarber(null); setViewingDocument(false); }}
        >
          <div 
            style={{ 
              background: C.card, 
              border: `1px solid ${C.border}`, 
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)", 
              position: "relative", 
              display: "flex", 
              flexDirection: "column", 
              overflow: "hidden", 
              transition: "all 0.3s ease",
              width: "100%",
              maxWidth: isMaximized ? 1024 : 512,
              height: isMaximized ? "90vh" : "auto",
              maxHeight: isMaximized ? "90vh" : "85vh",
              borderRadius: 24,
            }}
            onClick={e => e.stopPropagation()}
          >
            {/* Header / Banner */}
            <div 
              style={{ 
                height: 96, 
                background: "linear-gradient(to right, #8B5A2B, #4A3E3D)", 
                position: "relative", 
                display: "flex", 
                alignItems: "center", 
                justifyContent: "flex-end", 
                padding: "0 24px", 
                flexShrink: 0 
              }}
            >
              {/* Window Controls (Maximize, Close) */}
              <div 
                style={{ 
                  display: "flex", 
                  alignItems: "center", 
                  gap: 10, 
                  position: "absolute", 
                  top: 16, 
                  right: 16, 
                  background: "rgba(0, 0, 0, 0.25)", 
                  backdropFilter: "blur(4px)", 
                  padding: "6px 12px", 
                  borderRadius: 99, 
                  zIndex: 10, 
                  userSelect: "none" 
                }}
              >
                {/* Maximize/Restore Toggle Button */}
                <button 
                  onClick={() => setIsMaximized(!isMaximized)}
                  style={{ 
                    background: "none", border: "none", color: "rgba(255, 255, 255, 0.8)", 
                    cursor: "pointer", padding: 4, display: "flex", alignItems: "center" 
                  }}
                  title={isMaximized ? "Restore Size" : "Maximize Details"}
                >
                  {isMaximized ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
                </button>
                <span style={{ width: 1, height: 12, background: "rgba(255, 255, 255, 0.2)" }}></span>
                {/* Close Button */}
                <button 
                  onClick={() => { setSelectedBarber(null); setViewingDocument(false); }}
                  style={{ 
                    background: "none", border: "none", color: "rgba(255, 255, 255, 0.8)", 
                    cursor: "pointer", padding: 4, display: "flex", alignItems: "center" 
                  }}
                  title="Close Details"
                >
                  <X size={14} />
                </button>
              </div>
            </div>

            {/* Modal Body (Scrollable) */}
            <div 
              style={{ 
                padding: "16px 24px 32px", 
                overflowY: "auto", 
                flex: 1, 
                scrollbarWidth: "thin" 
              }}
            >
              {/* Profile Header Row */}
              <div 
                style={{ 
                  display: "flex", 
                  flexDirection: isMaximized ? "row" : "column", 
                  alignItems: isMaximized ? "flex-start" : "center", 
                  gap: 24, 
                  marginTop: 16, 
                  marginBottom: 32 
                }}
              >
                {/* Passport size photo */}
                <div style={{ flexShrink: 0, zIndex: 10 }}>
                  <div 
                    style={{ 
                      width: 128, 
                      height: 176, 
                      borderRadius: 16, 
                      border: "4px solid #fff", 
                      background: "linear-gradient(to bottom right, #8B5A2B, #4A3E3D)", 
                      color: "#fff", 
                      display: "flex", 
                      alignItems: "center", 
                      justifyContent: "center", 
                      fontFamily: "Georgia, serif", 
                      fontSize: 32, 
                      fontWeight: "bold", 
                      overflow: "hidden", 
                      boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" 
                    }}
                  >
                    {selectedBarber.photo ? (
                      <img src={selectedBarber.photo} alt={selectedBarber.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    ) : (
                      selectedBarber.name?.[0]?.toUpperCase() || "?"
                    )}
                  </div>
                </div>

                {/* Header Information */}
                <div 
                  style={{ 
                    flex: 1, 
                    display: "flex", 
                    flexDirection: "column", 
                    justifyContent: "space-between", 
                    alignSelf: "stretch", 
                    padding: "4px 0", 
                    width: "100%",
                    textAlign: isMaximized ? "left" : "center"
                  }}
                >
                  <div>
                    <div 
                      style={{ 
                        display: "flex", 
                        flexDirection: isMaximized ? "row" : "column", 
                        alignItems: isMaximized ? "center" : "center", 
                        justifyContent: "space-between", 
                        gap: 12 
                      }}
                    >
                      <div>
                        <h3 style={{ fontSize: 28, fontWeight: 900, fontFamily: "Georgia, serif", color: C.ink, margin: 0 }}>
                          {selectedBarber.name}
                        </h3>
                        <p style={{ fontSize: 12, color: C.gold, fontWeight: 900, margin: "6px 0 0", letterSpacing: "0.05em", textTransform: "uppercase" }}>
                          {selectedBarber.specialization || "General Stylist"}
                        </p>
                      </div>
                      <div 
                        style={{ 
                          display: "flex", 
                          flexDirection: "column", 
                          alignItems: isMaximized ? "flex-end" : "center", 
                          gap: 6, 
                          flexShrink: 0 
                        }}
                      >
                        {(() => {
                          const statusMeta = getStatusBadge(selectedBarber.status);
                          return (
                            <span 
                              style={{ 
                                padding: "4px 12px", 
                                borderRadius: 8, 
                                border: `1px solid ${statusMeta.border}`, 
                                background: statusMeta.bg, 
                                color: statusMeta.color, 
                                fontSize: 10, 
                                fontWeight: 900, 
                                textTransform: "uppercase", 
                                letterSpacing: "0.05em" 
                              }}
                            >
                              {statusMeta.label}
                            </span>
                          );
                        })()}
                        <span style={{ fontSize: 10, color: C.muted, fontWeight: 600 }}>
                          Joined: {new Date(selectedBarber.created_at || selectedBarber.createdAt || Date.now()).toLocaleDateString("en-IN")}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Highlights Bar */}
                  <div 
                    style={{ 
                      display: "grid", 
                      gridTemplateColumns: "repeat(3, 1fr)", 
                      gap: 12, 
                      marginTop: 24, 
                      borderTop: `1px solid ${C.border}`, 
                      borderBottom: `1px solid ${C.border}`, 
                      padding: "14px 0", 
                      color: C.muted, 
                      fontSize: 12, 
                      fontWeight: "bold", 
                      backgroundColor: "#FAFAF8", 
                      borderRadius: 12, 
                      border: `1px solid ${C.border}` 
                    }}
                  >
                    <div style={{ textAlign: "center" }}>
                      <span style={{ fontSize: 9, color: C.muted, display: "block", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 2 }}>Rating</span>
                      <span style={{ color: C.ink, display: "flex", alignItems: "center", justifyContent: "center", gap: 4 }}>
                        <Star size={12} fill="#F59E0B" color="#F59E0B" />
                        {(selectedBarber.rating || 0).toFixed(1)}
                      </span>
                    </div>
                    <div style={{ textAlign: "center", borderLeft: `1px solid ${C.border}`, borderRight: `1px solid ${C.border}` }}>
                      <span style={{ fontSize: 9, color: C.muted, display: "block", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 2 }}>Experience</span>
                      <span style={{ color: C.ink, display: "flex", alignItems: "center", justifyContent: "center", gap: 4 }}>
                        <Award size={12} color={C.gold} />
                        {selectedBarber.experience || 0} Years
                      </span>
                    </div>
                    <div style={{ textAlign: "center" }}>
                      <span style={{ fontSize: 9, color: C.muted, display: "block", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 2 }}>Phone</span>
                      <span style={{ color: C.ink, display: "flex", alignItems: "center", justifyContent: "center", gap: 4 }}>
                        <Phone size={12} color={C.gold} />
                        +91 {selectedBarber.mobile}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Three Column Layout when Maximized */}
              <div 
                style={{ 
                  display: "grid", 
                  gridTemplateColumns: isMaximized ? "1fr 1fr 1fr" : "1fr", 
                  gap: 24 
                }}
              >
                {/* Column 1: Personal Details */}
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  <div style={{ padding: 16, borderRadius: 16, backgroundColor: "#FAFAF8", border: `1px solid ${C.border}` }}>
                    <h4 style={{ fontSize: 12, fontWeight: "bold", color: "#8B5A2B", textTransform: "uppercase", letterSpacing: "0.05em", margin: "0 0 12px", paddingBottom: 6, borderBottom: `1px solid ${C.border}` }}>
                      Personal Profile
                    </h4>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 12, fontSize: 12, fontWeight: 600, color: C.muted }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span>Mobile Number</span>
                        <span style={{ color: C.ink, display: "flex", alignItems: "center", gap: 6 }}>
                          <Phone size={12} color={C.gold} />
                          +91 {selectedBarber.mobile}
                        </span>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span>Email Address</span>
                        <span style={{ color: C.ink, textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap", maxWidth: 180 }} title={selectedBarber.email}>
                          {selectedBarber.email || "Not Provided"}
                        </span>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span>Experience</span>
                        <span style={{ color: C.ink, display: "flex", alignItems: "center", gap: 6 }}>
                          <Award size={12} color={C.gold} />
                          {selectedBarber.experience || 0} Years
                        </span>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span>Rating</span>
                        <span style={{ color: C.ink, display: "flex", alignItems: "center", gap: 6 }}>
                          <Star size={12} fill="#F59E0B" color="#F59E0B" />
                          {(selectedBarber.rating || 0).toFixed(1)} / 5.0 Rating
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Column 2: Verification Details */}
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  <div style={{ padding: 16, borderRadius: 16, backgroundColor: "#FAFAF8", border: `1px solid ${C.border}` }}>
                    <h4 style={{ fontSize: 12, fontWeight: "bold", color: "#8B5A2B", textTransform: "uppercase", letterSpacing: "0.05em", margin: "0 0 12px", paddingBottom: 6, borderBottom: `1px solid ${C.border}` }}>
                      Verification & ID
                    </h4>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 12, fontSize: 12, fontWeight: 600, color: C.muted }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span>Aadhaar Number</span>
                        <span style={{ color: C.ink, display: "flex", alignItems: "center", gap: 6 }}>
                          <ShieldCheck size={12} color={C.gold} />
                          {selectedBarber.aadhaar || "Not Provided"}
                        </span>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span>PAN Card Number</span>
                        <span style={{ color: C.ink, textTransform: "uppercase" }}>
                          {selectedBarber.pan || "Not Provided"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Column 3: Login Credentials */}
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  <div style={{ padding: 16, borderRadius: 16, backgroundColor: "#FAFAF8", border: `1px solid ${C.border}` }}>
                    <h4 style={{ fontSize: 12, fontWeight: "bold", color: "#8B5A2B", textTransform: "uppercase", letterSpacing: "0.05em", margin: "0 0 12px", paddingBottom: 6, borderBottom: `1px solid ${C.border}` }}>
                      Login Credentials
                    </h4>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 12, fontSize: 12, fontWeight: 600, color: C.muted }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span>Mobile (Login ID)</span>
                        <strong style={{ color: C.ink }}>{selectedBarber.mobile}</strong>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span>Password</span>
                        <strong style={{ color: C.red }}>••••••••</strong>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span>Assigned Salon</span>
                        <strong style={{ color: C.gold }}>{selectedBarber.salon_id?.salon_name || "—"}</strong>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span>Registration Date</span>
                        <strong style={{ color: C.ink }}>
                          {selectedBarber.created_at ? new Date(selectedBarber.created_at).toLocaleDateString("en-IN") : "—"}
                        </strong>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Uploaded Documents ID Section */}
              {selectedBarber.document ? (
                <div style={{ marginTop: 24, padding: 16, borderRadius: 16, backgroundColor: "#FAFAF8", border: `1px solid ${C.border}` }}>
                  <h4 style={{ fontSize: 12, fontWeight: "bold", color: "#8B5A2B", textTransform: "uppercase", letterSpacing: "0.05em", margin: "0 0 12px", paddingBottom: 6, borderBottom: `1px solid ${C.border}` }}>
                    Attached Document ID
                  </h4>
                  <div style={{ display: "flex", flexDirection: isMaximized ? "row" : "column", alignItems: isMaximized ? "center" : "stretch", justifyContent: "space-between", gap: 16 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 0 }}>
                      <div style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: "#ECFDF5", border: "1px solid #D1FAE5", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>
                        📄
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <p style={{ fontSize: 12, fontWeight: "bold", color: C.ink, margin: 0, textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}>
                          {selectedBarber.documentName || "Identity Document"}
                        </p>
                        <p style={{ fontSize: 10, color: C.muted, margin: "2px 0 0" }}>Identity verification file</p>
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
                      <button 
                        onClick={() => setViewingDocument(true)}
                        style={{ 
                          display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", borderRadius: 12, 
                          backgroundColor: "#fff", border: `1px solid ${C.border}`, fontSize: 10, fontWeight: 900, 
                          textTransform: "uppercase", color: C.ink, cursor: "pointer", transition: "all 0.2s" 
                        }}
                      >
                        <Eye size={12} color={C.gold} />
                        View
                      </button>
                      <a 
                        href={selectedBarber.document} 
                        download={selectedBarber.documentName || "document"} 
                        style={{ 
                          display: "flex", alignItems: "center", padding: "8px 16px", borderRadius: 12, 
                          backgroundColor: C.gold, fontSize: 10, fontWeight: 900, textTransform: "uppercase", 
                          color: "#fff", textDecoration: "none", cursor: "pointer", transition: "all 0.2s" 
                        }}
                      >
                        Download
                      </a>
                    </div>
                  </div>
                  {/* Document preview if it's an image */}
                  {(selectedBarber.document.startsWith("data:image/") || selectedBarber.documentName?.match(/\.(jpg|jpeg|png|gif|webp)$/i)) && (
                    <div 
                      onClick={() => setViewingDocument(true)}
                      style={{ 
                        marginTop: 16, borderRadius: 12, overflow: "hidden", border: `1px solid ${C.border}`, 
                        maxHeight: 224, display: "flex", alignItems: "center", justifyContent: "center", 
                        backgroundColor: "#fff", cursor: "pointer", transition: "opacity 0.2s" 
                      }}
                    >
                      <img src={selectedBarber.document} alt="Document Preview" style={{ maxHeight: 224, width: "100%", objectFit: "contain" }} />
                    </div>
                  )}
                </div>
              ) : (
                <div style={{ marginTop: 24, padding: 24, borderRadius: 16, backgroundColor: "#FAFAF8", border: `1px dashed ${C.border}`, textAlign: "center", fontSize: 12, color: C.muted, fontWeight: 600 }}>
                  No identity documents uploaded.
                </div>
              )}

              {/* Footer actions */}
              <div style={{ marginTop: 32, paddingTop: 16, borderTop: `1px solid ${C.border}`, display: "flex", justifyContent: "flex-end" }}>
                <button 
                  onClick={() => { setSelectedBarber(null); setViewingDocument(false); }}
                  style={{ 
                    padding: "10px 20px", borderRadius: 12, backgroundColor: "#F3F4F6", border: `1px solid ${C.border}`, 
                    color: C.muted, fontWeight: "bold", fontSize: 12, textTransform: "uppercase", cursor: "pointer", 
                    transition: "all 0.2s" 
                  }}
                >
                  Close Details
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Lightbox Document Viewer Modal */}
      {selectedBarber && viewingDocument && selectedBarber.document && (
        <div 
          style={{ 
            zIndex: 2000, position: "fixed", inset: 0, 
            background: "rgba(0, 0, 0, 0.85)", backdropFilter: "blur(8px)", 
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 16 
          }}
          onClick={() => setViewingDocument(false)}
        >
          <div 
            style={{ 
              position: "absolute", top: 16, right: 16, display: "flex", alignItems: "center", gap: 12 
            }}
            onClick={e => e.stopPropagation()}
          >
            <a 
              href={selectedBarber.document} 
              download={selectedBarber.documentName || "document"} 
              style={{ 
                backgroundColor: "rgba(255, 255, 255, 0.1)", border: "1px solid rgba(255, 255, 255, 0.2)",
                color: "#fff", padding: "8px 16px", borderRadius: 12, fontSize: 12, fontWeight: "bold", 
                textTransform: "uppercase", textDecoration: "none", cursor: "pointer", transition: "background 0.2s" 
              }}
            >
              Download Original
            </a>
            <button 
              onClick={() => setViewingDocument(false)}
              style={{ 
                backgroundColor: "rgba(255, 255, 255, 0.1)", border: "none", color: "#fff", 
                borderRadius: "50%", width: 40, height: 40, display: "flex", alignItems: "center", 
                justifyContent: "center", fontSize: 18, fontWeight: "bold", cursor: "pointer", transition: "background 0.2s" 
              }}
            >
              ✕
            </button>
          </div>
          
          <div 
            style={{ 
              maxWidth: 1024, width: "100%", maxHeight: "80vh", display: "flex", alignItems: "center", 
              justifyContent: "center", padding: 8, borderRadius: 16, backgroundColor: "rgba(255, 255, 255, 0.05)", 
              border: "1px solid rgba(255, 255, 255, 0.1)", overflow: "hidden", boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)" 
            }}
            onClick={e => e.stopPropagation()}
          >
            {selectedBarber.document.startsWith("data:image/") || selectedBarber.documentName?.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
              <img 
                src={selectedBarber.document} 
                alt={selectedBarber.documentName || "Document Proof"} 
                style={{ maxWidth: "100%", maxHeight: "75vh", objectFit: "contain", borderRadius: 8 }}
              />
            ) : selectedBarber.document.startsWith("data:application/pdf") || selectedBarber.documentName?.match(/\.pdf$/i) ? (
              <object 
                data={selectedBarber.document} 
                type="application/pdf" 
                style={{ width: "100%", height: "75vh", borderRadius: 8 }}
              >
                <div style={{ padding: 32, textAlign: "center", color: "#fff", fontSize: 14 }}>
                  <p style={{ marginBottom: 16 }}>PDF Preview is not supported by your browser directly from Base64 Data URL.</p>
                  <a 
                    href={selectedBarber.document} 
                    download={selectedBarber.documentName || "document.pdf"}
                    style={{ 
                      display: "inline-block", padding: "12px 20px", borderRadius: 12, fontSize: 12, 
                      fontWeight: "bold", textTransform: "uppercase", color: "#000", backgroundColor: "#fff", 
                      textDecoration: "none" 
                    }}
                  >
                    Download and View PDF
                  </a>
                </div>
              </object>
            ) : (
              <div style={{ padding: 48, textAlign: "center", color: "#fff" }}>
                <FileText size={48} style={{ margin: "0 auto 16px", color: "rgba(255, 255, 255, 0.5)" }} />
                <h4 style={{ fontSize: 16, fontWeight: "bold", margin: "0 0 4px" }}>{selectedBarber.documentName || "Identity Document"}</h4>
                <p style={{ fontSize: 12, color: "rgba(255, 255, 255, 0.4)", marginBottom: 24 }}>Preview unavailable for this file format.</p>
                <a 
                  href={selectedBarber.document} 
                  download={selectedBarber.documentName || "document"}
                  style={{ 
                    display: "inline-block", padding: "12px 20px", borderRadius: 12, fontSize: 12, 
                    fontWeight: "bold", textTransform: "uppercase", color: "#000", backgroundColor: "#fff", 
                    textDecoration: "none" 
                  }}
                >
                  Download Document
                </a>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ══ SALON PERFORMANCE ANALYTICS MODAL ══ */}
      {selectedPerformanceSalon && (
        <div 
          style={{ 
            position: "fixed", inset: 0, zIndex: 1000, 
            display: "flex", alignItems: "center", justifyContent: "center", 
            padding: 16, background: "rgba(28, 25, 23, 0.6)", backdropFilter: "blur(4px)" 
          }}
          onClick={() => setSelectedPerformanceSalon(null)}
        >
          <div 
            style={{ 
              background: C.card, 
              border: `1px solid ${C.border}`, 
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)", 
              position: "relative", 
              display: "flex", 
              flexDirection: "column", 
              overflow: "hidden", 
              width: "100%",
              maxWidth: 768,
              height: "85vh",
              borderRadius: 24,
            }}
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div 
              style={{ 
                padding: "20px 24px", 
                borderBottom: `1px solid ${C.border}`, 
                display: "flex", 
                justifyContent: "space-between", 
                alignItems: "center",
                flexShrink: 0
              }}
            >
              <div>
                <h3 style={{ fontSize: 20, fontWeight: 700, fontFamily: "Georgia, serif", color: C.ink, margin: 0 }}>
                  Performance Analysis: {selectedPerformanceSalon.salon.salon_name}
                </h3>
                <p style={{ fontSize: 12, color: C.muted, margin: "4px 0 0" }}>
                  Detailed analysis of why this studio is in {selectedPerformanceSalon.netProfit >= 0 ? "Profit" : "Deficit"}
                </p>
              </div>
              <button 
                onClick={() => setSelectedPerformanceSalon(null)} 
                style={{ background: "none", border: "none", cursor: "pointer", color: C.muted }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body (Scrollable) */}
            <div style={{ padding: 24, overflowY: "auto", flex: 1, scrollbarWidth: "thin" }}>
              
              {/* Row 1: Financial & Booking Status Overview */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 24 }}>
                {/* Financial Summary */}
                <div style={{ padding: 16, borderRadius: 16, backgroundColor: "#FAFAF8", border: `1px solid ${C.border}` }}>
                  <h4 style={{ fontSize: 12, fontWeight: "bold", color: "#8B5A2B", textTransform: "uppercase", letterSpacing: "0.05em", margin: "0 0 12px", paddingBottom: 6, borderBottom: `1px solid ${C.border}` }}>
                    Financial Summary
                  </h4>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8, fontSize: 12, fontWeight: 650 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, fontWeight: 700 }}>
                      <span style={{ color: C.ink }}>Total Income:</span>
                      <span style={{ color: C.green }}>₹{selectedPerformanceSalon.income.toLocaleString("en-IN")}</span>
                    </div>
                  </div>
                </div>

                {/* Booking Efficiency */}
                <div style={{ padding: 16, borderRadius: 16, backgroundColor: "#FAFAF8", border: `1px solid ${C.border}` }}>
                  <h4 style={{ fontSize: 12, fontWeight: "bold", color: "#8B5A2B", textTransform: "uppercase", letterSpacing: "0.05em", margin: "0 0 12px", paddingBottom: 6, borderBottom: `1px solid ${C.border}` }}>
                    Booking Efficiency
                  </h4>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8, fontSize: 12, fontWeight: 650 }}>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span style={{ color: C.muted }}>Total Appointments:</span>
                      <span style={{ color: C.ink }}>{selectedPerformanceSalon.bookingsCount} bookings</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span style={{ color: C.muted }}>Completed:</span>
                      <span style={{ color: C.green }}>{selectedPerformanceSalon.completedCount} ({selectedPerformanceSalon.bookingsCount > 0 ? Math.round((selectedPerformanceSalon.completedCount/selectedPerformanceSalon.bookingsCount)*100) : 0}%)</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span style={{ color: C.muted }}>Cancellation Rate:</span>
                      <span style={{ color: C.red }}>{selectedPerformanceSalon.cancelledCount} ({selectedPerformanceSalon.bookingsCount > 0 ? Math.round((selectedPerformanceSalon.cancelledCount/selectedPerformanceSalon.bookingsCount)*100) : 0}%)</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Row 2: Customer Quality Metrics */}
              <div style={{ padding: 16, borderRadius: 16, backgroundColor: "#FAFAF8", border: `1px solid ${C.border}`, marginBottom: 24 }}>
                <h4 style={{ fontSize: 12, fontWeight: "bold", color: "#8B5A2B", textTransform: "uppercase", letterSpacing: "0.05em", margin: "0 0 16px", paddingBottom: 6, borderBottom: `1px solid ${C.border}` }}>
                  Customer Quality Metrics (Platform Feedback)
                </h4>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
                  <div style={{ textAlign: "center", borderRight: `1px solid ${C.border}` }}>
                    <span style={{ fontSize: 10, color: C.muted, textTransform: "uppercase", display: "block", marginBottom: 6 }}>Booking Process</span>
                    <div style={{ fontSize: 16, fontWeight: 700, color: C.ink }}>
                      {selectedPerformanceSalon.avgBookingProcess.toFixed(1)} / 5.0
                    </div>
                    <div style={{ fontSize: 12, color: C.gold, marginTop: 4 }}>
                      {"★".repeat(Math.round(selectedPerformanceSalon.avgBookingProcess)) + "☆".repeat(5 - Math.round(selectedPerformanceSalon.avgBookingProcess))}
                    </div>
                  </div>
                  <div style={{ textAlign: "center", borderRight: `1px solid ${C.border}` }}>
                    <span style={{ fontSize: 10, color: C.muted, textTransform: "uppercase", display: "block", marginBottom: 6 }}>Payment Flow</span>
                    <div style={{ fontSize: 16, fontWeight: 700, color: C.ink }}>
                      {selectedPerformanceSalon.avgPaymentProcess.toFixed(1)} / 5.0
                    </div>
                    <div style={{ fontSize: 12, color: C.gold, marginTop: 4 }}>
                      {"★".repeat(Math.round(selectedPerformanceSalon.avgPaymentProcess)) + "☆".repeat(5 - Math.round(selectedPerformanceSalon.avgPaymentProcess))}
                    </div>
                  </div>
                  <div style={{ textAlign: "center" }}>
                    <span style={{ fontSize: 10, color: C.muted, textTransform: "uppercase", display: "block", marginBottom: 6 }}>Website Usability</span>
                    <div style={{ fontSize: 16, fontWeight: 700, color: C.ink }}>
                      {selectedPerformanceSalon.avgWebsiteUsability.toFixed(1)} / 5.0
                    </div>
                    <div style={{ fontSize: 12, color: C.gold, marginTop: 4 }}>
                      {"★".repeat(Math.round(selectedPerformanceSalon.avgWebsiteUsability)) + "☆".repeat(5 - Math.round(selectedPerformanceSalon.avgWebsiteUsability))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Row 3: Reviews & Comments */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 20 }}>
                {/* Customer Reviews & Feedback comments */}
                <div>
                  <h4 style={{ fontSize: 13, fontWeight: "bold", color: "#8B5A2B", textTransform: "uppercase", letterSpacing: "0.05em", margin: "0 0 12px", paddingBottom: 6, borderBottom: `1px solid ${C.border}` }}>
                    Written Customer Reviews & Complaints
                  </h4>
                  {selectedPerformanceSalon.reviews.length === 0 ? (
                    <div style={{ padding: 24, textAlign: "center", color: C.muted, fontSize: 12, border: `1px dashed ${C.border}`, borderRadius: 12 }}>
                      No written reviews left for this studio yet.
                    </div>
                  ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                      {selectedPerformanceSalon.reviews.map((r) => (
                        <div key={r._id} style={{ padding: 12, borderRadius: 12, backgroundColor: "#FAFAF8", border: `1px solid ${C.border}`, fontSize: 12 }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                            <strong style={{ color: C.ink }}>{r.customer_id?.name || "Customer"}</strong>
                            <div style={{ color: C.gold }}>
                              {"★".repeat(r.rating || r.salon_rating || 5)}{"☆".repeat(5 - (r.rating || r.salon_rating || 5))}
                            </div>
                          </div>
                          <p style={{ margin: 0, color: C.muted, lineHeight: 1.5 }}>
                            {r.review_text || "No written review comments provided"}
                          </p>
                          <div style={{ fontSize: 9, color: C.muted, marginTop: 6, textAlign: "right" }}>
                            {r.created_at ? new Date(r.created_at).toLocaleDateString("en-IN") : "—"}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Booking App Feedback comments */}
                <div>
                  <h4 style={{ fontSize: 13, fontWeight: "bold", color: "#8B5A2B", textTransform: "uppercase", letterSpacing: "0.05em", margin: "0 0 12px", paddingBottom: 6, borderBottom: `1px solid ${C.border}` }}>
                    System Feedback & Suggestions
                  </h4>
                  {selectedPerformanceSalon.feedbacks.length === 0 ? (
                    <div style={{ padding: 24, textAlign: "center", color: C.muted, fontSize: 12, border: `1px dashed ${C.border}`, borderRadius: 12 }}>
                      No platform suggestions or website comments left for this studio yet.
                    </div>
                  ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                      {selectedPerformanceSalon.feedbacks.map((fb) => (
                        <div key={fb._id} style={{ padding: 12, borderRadius: 12, backgroundColor: "#FAFAF8", border: `1px solid ${C.border}`, fontSize: 12 }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                            <strong style={{ color: C.ink }}>{fb.customer_id?.name || "Customer"}</strong>
                            <span style={{ fontSize: 10, color: C.muted }}>{fb.customer_id?.mobile}</span>
                          </div>
                          <p style={{ margin: 0, color: C.muted, lineHeight: 1.5 }}>
                            {fb.feedback_text || "No text suggestion comments provided"}
                          </p>
                          <div style={{ fontSize: 9, color: C.muted, marginTop: 6, textAlign: "right" }}>
                            {fb.created_at ? new Date(fb.created_at).toLocaleDateString("en-IN") : "—"}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

            </div>

            {/* Footer */}
            <div 
              style={{ 
                padding: 16, 
                borderTop: `1px solid ${C.border}`, 
                display: "flex", 
                justifyContent: "flex-end",
                flexShrink: 0
              }}
            >
              <button 
                onClick={() => setSelectedPerformanceSalon(null)}
                style={{ 
                  padding: "10px 20px", borderRadius: 12, backgroundColor: "#F3F4F6", border: `1px solid ${C.border}`, 
                  color: C.muted, fontWeight: "bold", fontSize: 12, textTransform: "uppercase", cursor: "pointer", 
                  transition: "all 0.2s" 
                }}
              >
                Close Analysis
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
