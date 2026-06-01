
import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard, Store, Users, UserSquare, UserPlus, Calendar,
  Scissors, CreditCard, Star, Radio, Settings, RefreshCw, Bell,
  CalendarDays, IndianRupee, FileText, ShieldCheck, BarChart, ChevronDown,
  LogOut, Clock, MapPin, X, ArrowRight, Menu
} from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { AdminGlobalStyles } from "../../Components/admin/AdminUIKit";
import {
  CustomersModule, SalonsModule, BarbersModule, AddBarberModule, AppointmentsModule,
  ServicesModule, PaymentsModule, ReviewsModule, LiveMonitoringModule, SettingsModule,
} from "./AdminModulePages";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const getToken = () => localStorage.getItem("token");

/* ══ COLORS ══ */
const C = {
  bg: "#FAF6F0",
  sidebar: "#FFFFFF",
  card: "#FFFFFF",
  ink: "#1C1917",
  muted: "#78716C",
  border: "#E7E5E4",
  gold: "#C5A059",
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
  orangeLight: "#FFFBEB"
};

const USE_DEMO_DATA = import.meta.env.DEV;
const DEMO_DATA = {
  stats: { customers: 2, salons: 2, bookings: 2, revenue: 7500 },
  customers: [
    { _id: "demo-c1", name: "Rohit Patel", email: "rohit@example.com", phone: "9876543210", blocked: false, createdAt: "2026-05-20" },
    { _id: "demo-c2", name: "Sneha Mehta", email: "sneha@example.com", phone: "9123456780", blocked: true, createdAt: "2026-05-18" },
  ],
  salons: [
    { _id: "demo-s1", salon_name: "Royal Cuts", salon_city: "Ahmedabad", status: "approved", owner_name: "Karan Shah" },
    { _id: "demo-s2", salon_name: "Style Hub", salon_city: "Vadodara", status: "pending", owner_name: "Priya Joshi" },
  ],
  barbers: [
    { _id: "demo-b1", name: "Amit", mobile: "9812345678", status: "available", salon_name: "Royal Cuts", specialization: "Haircut & Styling" },
    { _id: "demo-b2", name: "Deepak", mobile: "9823456789", status: "break", salon_name: "Style Hub", specialization: "Beard Trim" },
  ],
  bookings: [
    { _id: "demo-book1", customer_id: { name: "Rohit Patel" }, barber_id: { name: "Amit" }, salon_id: { salon_name: "Royal Cuts" }, created_at: "2026-05-24", amount: 450, status: "completed" },
    { _id: "demo-book2", customer_id: { name: "Sneha Mehta" }, barber_id: { name: "Deepak" }, salon_id: { salon_name: "Style Hub" }, created_at: "2026-05-25", amount: 300, status: "pending" },
  ],
  services: [
    { _id: "demo-service1", name: "Classic Haircut", category: "men", price: 250, duration: "30", salon_id: { salon_name: "Royal Cuts" } },
    { _id: "demo-service2", name: "Beard Trim", category: "men", price: 150, duration: "20", salon_id: { salon_name: "Style Hub" } },
  ],
  payments: [
    { _id: "demo-pay1", customer_id: { name: "Rohit Patel" }, salon_id: { salon_name: "Royal Cuts" }, amount: 450, status: "captured", created_at: "2026-05-24" },
    { _id: "demo-pay2", customer_id: { name: "Sneha Mehta" }, salon_id: { salon_name: "Style Hub" }, amount: 300, status: "pending", created_at: "2026-05-25" },
  ],
  reviews: [
    { _id: "demo-rev1", customer_id: { name: "Rohit Patel" }, salon_id: { salon_name: "Royal Cuts" }, rating: 5, review_text: "Excellent haircut and fast service!" },
    { _id: "demo-rev2", customer_id: { name: "Sneha Mehta" }, salon_id: { salon_name: "Style Hub" }, rating: 3, review_text: "Good styling but waiting time was high." },
  ],
};

/* ══ HELPERS ══ */
const Badge = ({ label, color }) => (
  <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider"
    style={{ background: `${color}15`, color, border: `1px solid ${color}30` }}>
    {label}
  </span>
);

const Avatar = ({ name, size = 32, color = C.gold, bg = C.goldLight }) => (
  <div style={{ width: size, height: size, borderRadius: "50%", background: bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: size * 0.4, fontWeight: 700, color, flexShrink: 0, border: `1px solid ${color}30` }}>
    {name?.[0]?.toUpperCase() || "?"}
  </div>
);

const formatDate = (value) => {
  if (!value) return "—";
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? value : parsed.toLocaleDateString("en-US", { day: "2-digit", month: "short", year: "numeric" });
};

const NAV = [
  { k: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { k: "salons", label: "Salon Management", icon: Store },
  { k: "customers", label: "Customers", icon: Users },
  { k: "barbers", label: "Barbers", icon: UserSquare },
  { k: "addbarber", label: "Add Barber", icon: UserPlus },
  { k: "appointments", label: "Appointments", icon: Calendar },
  { k: "services", label: "Services", icon: Scissors },
  { k: "payments", label: "Payments", icon: CreditCard },
  { k: "reviews", label: "Reviews", icon: Star },
  { k: "live", label: "Live Monitoring", icon: Radio },
  { k: "settings", label: "Settings", icon: Settings },
];

const bStatus = s => s === "available" ? C.green : s === "busy" ? C.orange : s === "break" ? C.blue : "#9CA3AF";
const bkStatus = s => s === "completed" ? C.green : s === "pending" ? C.purple : s === "cancelled" ? C.red : C.blue;
const pyStatus = s => s === "captured" ? C.green : s === "refunded" ? C.blue : s === "pending" ? C.orange : C.red;

const ROUTE_TAB_MAP = {
  "/admin/customers": "customers",
  "/admin/salon-management": "salons",
  "/admin/barbers": "barbers",
  "/admin/add-barber": "addbarber",
  "/admin/appointments": "appointments",
  "/admin/services": "services",
  "/admin/payments": "payments",
  "/admin/reviews": "reviews",
  "/admin/live": "live",
  "/admin/platform-settings": "settings",
};

export function AdminRequests({ initialTab = "dashboard" }) {
  const navigate = useNavigate();
  const location = useLocation();
  const photoRef = useRef();
  const docRef = useRef();

  const [tab, setTab] = useState(initialTab);
  const [salons, setSalons] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [customers, setCustomers] = useState([]);
  const [barbers, setBarbers] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [services, setServices] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [payments, setPayments] = useState([]);
  const [modal, setModal] = useState(null);
  const [toast, setToast] = useState(null);
  const [customerSearch, setCustomerSearch] = useState("");
  const [reason, setReason] = useState("");
  const [busy, setBusy] = useState(false);
  const [addedBarbers, setAddedBarbers] = useState([]);
  const [showBellDropdown, setShowBellDropdown] = useState(false);
  const [showAdminDropdown, setShowAdminDropdown] = useState(false);

  const addSalon = async (salonData) => {
    try {
      const r = await fetch(`${API}/salon/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...salonData,
          opening_time: "09:00",
          closing_time: "21:00",
          commission_percent: 10,
        }),
      });
      const d = await r.json();
      if (d.success) {
        pop("Salon added successfully!");
        fetchAll(); // Refresh the list of salons and stats immediately
        return true;
      } else {
        pop(d.message || "Failed to add salon", "error");
        return false;
      }
    } catch {
      pop("Server error", "error");
      return false;
    }
  };

  const [newBarber, setNewBarber] = useState({
    name: "", mobile: "", password: "", specialization: "", experience: "", salon_id: "",
    email: "", photo: null, photoPreview: null, document: null, documentName: "",
  });
  const [newService, setNewService] = useState({ name: "", category: "men", price: "", duration: "30", salon_id: "" });

  useEffect(() => { fetchAll(); }, []);

  useEffect(() => {
    const routeTab = ROUTE_TAB_MAP[location.pathname];
    if (routeTab) setTab(routeTab);
    else if (location.pathname === "/admin/requests") setTab(initialTab || "dashboard");
  }, [location.pathname, initialTab]);

  const h = () => ({ Authorization: `Bearer ${getToken()}`, "Content-Type": "application/json" });

  const fetchAll = async () => {
    setLoading(true);
    try {
      const results = await Promise.allSettled([
        fetch(`${API}/admin/salons`, { headers: h() }).then(r => r.json()),
        fetch(`${API}/admin/stats`, { headers: h() }).then(r => r.json()),
        fetch(`${API}/admin/customers`, { headers: h() }).then(r => r.json()),
        fetch(`${API}/admin/barbers`, { headers: h() }).then(r => r.json()),
        fetch(`${API}/admin/bookings`, { headers: h() }).then(r => r.json()),
        fetch(`${API}/admin/services`, { headers: h() }).then(r => r.json()),
        fetch(`${API}/admin/payments`, { headers: h() }).then(r => r.json()),
        fetch(`${API}/admin/reviews`, { headers: h() }).then(r => r.json()),
      ]);

      const [salonsR, statsR, custR, barbersR, bookR, servR, payR, revR] = results.map(r => r.status === "fulfilled" ? r.value : null);

      if (salonsR?.success) setSalons(salonsR.salons || []);
      if (statsR?.success) setStats(statsR.stats);
      if (custR?.success) setCustomers(custR.customers || []);
      if (barbersR?.success) setBarbers(barbersR.barbers || []);
      if (bookR?.success) setBookings(bookR.bookings || []);
      if (servR?.success) setServices(servR.services || []);
      if (payR?.success) setPayments(payR.payments || []);
      if (revR?.success) setReviews(revR.reviews || []);
    } catch (e) { pop("Failed to load data", "error"); }
    finally {
      if (USE_DEMO_DATA) {
        setStats((prev) => prev || DEMO_DATA.stats);
        setCustomers((prev) => (prev?.length ? prev : DEMO_DATA.customers));
        setSalons((prev) => (prev?.length ? prev : DEMO_DATA.salons));
        setBarbers((prev) => (prev?.length ? prev : DEMO_DATA.barbers));
        setBookings((prev) => (prev?.length ? prev : DEMO_DATA.bookings));
        setServices((prev) => (prev?.length ? prev : DEMO_DATA.services));
        setPayments((prev) => (prev?.length ? prev : DEMO_DATA.payments));
        setReviews((prev) => (prev?.length ? prev : DEMO_DATA.reviews));
      }
      setLoading(false);
    }
  };

  const updateSalonStatus = async (id, status, rejection_reason = "") => {
    setBusy(true);
    try {
      const r = await fetch(`${API}/admin/salon/${id}/status`, {
        method: "PUT", headers: h(), body: JSON.stringify({ status, rejection_reason }),
      });
      const d = await r.json();
      if (d.success) {
        setSalons(p => p.map(s => s._id === id ? d.salon || { ...s, status, rejection_reason } : s));
        pop(`Salon ${status}!`, status === "approved" ? "success" : "error");
        setModal(null); setReason("");
      } else pop(d.message || "Failed", "error");
    } catch { pop("Server error", "error"); }
    finally { setBusy(false); }
  };

  const blockCustomer = async (id, blocked) => {
    try {
      const r = await fetch(`${API}/admin/customer/${id}/block`, {
        method: "PUT", headers: h(), body: JSON.stringify({ blocked }),
      });
      const d = await r.json();
      if (d.success) {
        setCustomers(p => p.map(c => c._id === id ? { ...c, blocked } : c));
        pop(`Customer ${blocked ? "blocked" : "unblocked"}!`);
      } else pop(d.message || "Failed", "error");
    } catch { pop("Server error", "error"); }
  };

  const changeBarberStatus = async (id, status) => {
    try {
      const r = await fetch(`${API}/admin/barber/${id}/status`, {
        method: "PUT", headers: h(), body: JSON.stringify({ status }),
      });
      const d = await r.json();
      if (d.success) {
        setBarbers(p => p.map(b => b._id === id ? { ...b, status } : b));
        pop(`Barber set to ${status}!`);
      } else pop(d.message || "Failed", "error");
    } catch { pop("Server error", "error"); }
  };

  const removeBarber = async (id) => {
    try {
      const r = await fetch(`${API}/admin/barber/${id}`, { method: "DELETE", headers: h() });
      const d = await r.json();
      if (d.success) { setBarbers(p => p.filter(b => b._id !== id)); pop("Barber removed!"); }
      else pop(d.message || "Failed", "error");
    } catch { pop("Server error", "error"); }
  };

  const addBarber = async () => {
    if (!newBarber.name || !newBarber.mobile || !newBarber.password) { pop("Name, mobile and password required", "error"); return; }
    setBusy(true);
    try {
      const salonId = newBarber.salon_id || salons.find(s => s.status === "approved")?._id;
      if (!salonId) { pop("No approved salon found! Approve a salon first.", "error"); setBusy(false); return; }

      const r = await fetch(`${API}/admin/barber`, {
        method: "POST", headers: h(),
        body: JSON.stringify({
          name: newBarber.name, mobile: newBarber.mobile, password: newBarber.password,
          specialization: newBarber.specialization, experience: Number(newBarber.experience) || 0,
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
          salon: salons.find(s => s._id === salonId)?.salon_name || "—",
          addedAt: new Date().toLocaleString(),
        }]);
        setNewBarber({ name: "", mobile: "", password: "", specialization: "", experience: "", salon_id: "", email: "", photo: null, photoPreview: null, document: null, documentName: "" });
        const br = await fetch(`${API}/admin/barbers`, { headers: h() }).then(r => r.json());
        if (br.success) setBarbers(br.barbers || []);
      } else pop(d.message || "Failed", "error");
    } catch { pop("Server error", "error"); }
    finally { setBusy(false); }
  };

  const changeBookingStatus = async (id, status) => {
    try {
      const r = await fetch(`${API}/admin/booking/${id}/status`, {
        method: "PUT", headers: h(), body: JSON.stringify({ status }),
      });
      const d = await r.json();
      if (d.success) {
        setBookings(p => p.map(b => b._id === id ? { ...b, status } : b));
        pop(`Booking ${status}!`);
      } else pop(d.message || "Failed", "error");
    } catch { pop("Server error", "error"); }
  };

  const deleteReview = async (id) => {
    try {
      const r = await fetch(`${API}/admin/review/${id}`, { method: "DELETE", headers: h() });
      const d = await r.json();
      if (d.success) { setReviews(p => p.filter(x => x._id !== id)); pop("Review deleted!"); }
      else pop(d.message || "Failed", "error");
    } catch { pop("Server error", "error"); }
  };

  const addService = async () => {
    if (!newService.name || !newService.price) { pop("Name and price required", "error"); return; }
    const salonId = newService.salon_id || salons.find(s => s.status === "approved")?._id;
    if (!salonId) { pop("No approved salon found!", "error"); return; }
    try {
      const r = await fetch(`${API}/admin/service`, {
        method: "POST", headers: h(),
        body: JSON.stringify({ ...newService, salon_id: salonId, price: Number(newService.price), duration: Number(newService.duration) }),
      });
      const d = await r.json();
      if (d.success) {
        setServices(p => [...p, d.service]);
        setNewService({ name: "", category: "men", price: "", duration: "30", salon_id: "" });
        pop("Service added!");
      } else pop(d.message || "Failed", "error");
    } catch { pop("Server error", "error"); }
  };

  const toggleService = async (id, is_active) => {
    try {
      const r = await fetch(`${API}/admin/service/${id}`, {
        method: "PUT", headers: h(), body: JSON.stringify({ is_active }),
      });
      const d = await r.json();
      if (d.success) { setServices(p => p.map(s => s._id === id ? { ...s, is_active } : s)); pop(`Service ${is_active ? "enabled" : "disabled"}!`); }
    } catch { pop("Server error", "error"); }
  };

  const deleteService = async (id) => {
    try {
      const r = await fetch(`${API}/admin/service/${id}`, { method: "DELETE", headers: h() });
      const d = await r.json();
      if (d.success) { setServices(p => p.filter(s => s._id !== id)); pop("Service deleted!"); }
    } catch { pop("Server error", "error"); }
  };

  const pop = (msg, type = "success") => { setToast({ msg, type }); setTimeout(() => setToast(null), 3000); };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setNewBarber(p => ({ ...p, photo: file, photoPreview: ev.target.result }));
    reader.readAsDataURL(file);
  };
  const handleDocChange = (e) => {
    const file = e.target.files[0]; if (!file) return;
    setNewBarber(p => ({ ...p, document: file, documentName: file.name }));
  };

  const pendingBookings = bookings.filter(b => b.status === "pending").length;
  const totalRevenue = payments.filter(p => p.status === "captured" || p.status === "SUCCESS").reduce((a, b) => a + (b.amount || 0), 0);

  const revenueDisplay = loading
    ? "—"
    : `₹${((stats?.revenue || totalRevenue) || 0).toLocaleString("en-IN")}`;

  const handleSignOut = () => {
    localStorage.removeItem("token");
    navigate("/admin/login");
  };

  return (
    <div className="admin-root flex h-screen overflow-hidden font-sans" style={{ background: C.bg, color: C.ink }}>
      <AdminGlobalStyles />

      {/* ════ SIDEBAR ════ */}
      <aside className="w-64 flex-shrink-0 flex flex-col h-full overflow-y-auto border-r" style={{ background: C.sidebar, borderColor: C.border }}>
        <div className="p-6 flex items-center gap-3">
          <div className="w-8 h-8 rounded flex items-center justify-center shrink-0" style={{ background: C.goldLight }}>
            <Scissors size={18} color={C.gold} />
          </div>
          <div>
            <div style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontSize: 22, fontWeight: 900, letterSpacing: "-0.3px", lineHeight: 1, color: C.ink }}>Barber Pro</div>
            <div className="text-[9px] font-bold tracking-[0.2em] mt-1" style={{ color: C.gold }}>ADMIN CONSOLE</div>
          </div>
        </div>

        {/* ── NAV: no dividers ── */}
        <nav className="flex-1 px-4 py-2 flex flex-col gap-1 min-h-0">
          {NAV.map((n) => {
            const Icon = n.icon;
            const isActive = tab === n.k;
            return (
              <button
                key={n.k}
                onClick={() => setTab(n.k)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium transition-all relative"
                style={{
                  background: isActive ? C.goldLight : "transparent",
                  color: isActive ? C.gold : C.muted,
                  borderLeft: isActive ? `3px solid ${C.gold}` : "3px solid transparent",
                }}
              >
                <Icon size={18} />
                {n.label}
                {n.k === "appointments" && pendingBookings > 0 && (
                  <span className="ml-auto px-2 py-0.5 rounded-full text-[10px] font-bold" style={{ background: C.purpleLight, color: C.purple }}>
                    {pendingBookings}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        <div className="px-4 pb-6 mt-auto border-t pt-4" style={{ borderColor: C.border }}>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-2 w-full px-3 py-2.5 rounded-lg text-[13px] font-medium transition-colors hover:bg-red-50"
            style={{ color: C.red }}
          >
            <LogOut size={16} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* ════ MAIN ════ */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-y-auto">
        <div className="w-full px-6 lg:px-8">

          {/* HEADER */}
          <header className="pt-12 pb-6 flex items-end justify-between shrink-0 relative z-30">
            <div>
              <h1 style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontSize: 56, fontWeight: 900, lineHeight: 1, letterSpacing: "-0.5px", color: C.ink, marginBottom: 8 }}>{NAV.find(n => n.k === tab)?.label || "Dashboard"}</h1>
              {tab === "dashboard" && (
                <p style={{ fontFamily: "Segoe UI, system-ui, sans-serif", fontSize: 17, fontWeight: 500, color: C.muted }}>Welcome back, Admin!</p>
              )}
              {tab !== "dashboard" && (
                <p className="text-[13px] font-medium mt-1" style={{ color: C.muted }}>
                  <button type="button" onClick={() => setTab("dashboard")} className="hover:underline" style={{ color: C.gold }}>
                    Dashboard
                  </button>
                  <span className="mx-2">&gt;</span>
                  <span style={{ color: C.ink }}>{NAV.find(n => n.k === tab)?.label}</span>
                </p>
              )}
            </div>
            <div className="flex items-center gap-5 pb-1">
              <span className="text-[13px] font-medium" style={{ color: C.muted }}>
                {new Date().toLocaleDateString("en-US", { weekday: "short", day: "numeric", month: "short", year: "numeric" })}
              </span>
              <button onClick={fetchAll} className="flex items-center gap-2 px-4 py-2 rounded-full text-[13px] font-medium transition-colors border"
                style={{ background: C.sidebar, borderColor: C.border, color: C.ink }}>
                <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
                Refresh
              </button>
              <div 
                onClick={() => { setShowBellDropdown(!showBellDropdown); setShowAdminDropdown(false); }}
                className="relative cursor-pointer w-10 h-10 rounded-full flex items-center justify-center bg-white border hover:bg-gray-50 transition-all select-none" 
                style={{ borderColor: C.border }}
              >
                <Bell size={18} color={C.muted} />
                <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-[#C5A059] text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-white">3</span>
                {showBellDropdown && (
                  <div 
                    onClick={(e) => e.stopPropagation()}
                    className="absolute right-0 top-12 z-50 w-80 bg-white rounded-xl border shadow-xl p-4 text-left animate-fade-in"
                    style={{ borderColor: C.border }}
                  >
                    <div className="flex items-center justify-between pb-3 border-b mb-3" style={{ borderColor: C.border }}>
                      <h4 className="font-sans text-sm font-extrabold uppercase tracking-wider" style={{ color: C.ink }}>Notifications</h4>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FAF6F0] text-[#C5A059] border border-[#EADBCE]">3 New</span>
                    </div>
                    <div className="space-y-3 max-h-64 overflow-y-auto">
                      {[
                        { title: "New Salon Request", desc: "Style Hub has submitted an onboarding application.", time: "10 mins ago", type: "salon", tab: "salons" },
                        { title: "Slot Confirmed", desc: "Rohit Patel's haircut is confirmed at Royal Cuts.", time: "45 mins ago", type: "booking", tab: "appointments" },
                        { title: "Barber Status Alert", desc: "Barber Amit set status to 'busy' for active slot.", time: "1 hour ago", type: "barber", tab: "live" },
                      ].map((item, idx) => (
                        <div 
                          key={idx}
                          onClick={() => { setTab(item.tab); setShowBellDropdown(false); }}
                          className="p-2.5 rounded-lg hover:bg-orange-50/40 border border-transparent hover:border-[#EADBCE] transition-all cursor-pointer text-left"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold" style={{ color: C.ink }}>{item.title}</span>
                            <span className="text-[9px]" style={{ color: C.muted }}>{item.time}</span>
                          </div>
                          <p className="text-[11px] mt-1 leading-normal" style={{ color: C.muted }}>{item.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <div 
                onClick={() => { setShowAdminDropdown(!showAdminDropdown); setShowBellDropdown(false); }}
                className="flex items-center gap-3 cursor-pointer pl-4 border-l select-none relative hover:opacity-80 transition-all" 
                style={{ borderColor: C.border }}
              >
                <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#D1BFA5", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: "#FFFFFF", flexShrink: 0 }}>AD</div>
                <div className="flex items-center gap-1">
                  <span className="text-[13px] font-semibold" style={{ color: C.ink }}>Admin</span>
                  <ChevronDown size={14} color={C.muted} className={`transition-transform duration-200 ${showAdminDropdown ? "rotate-180" : ""}`} />
                </div>
                {showAdminDropdown && (
                  <div 
                    onClick={(e) => e.stopPropagation()}
                    className="absolute right-0 top-12 z-50 w-56 bg-white rounded-xl border shadow-xl p-4 text-left animate-fade-in"
                    style={{ borderColor: C.border }}
                  >
                    <div className="pb-3 border-b mb-3" style={{ borderColor: C.border }}>
                      <div className="text-xs font-bold" style={{ color: C.ink }}>Super Admin</div>
                      <div className="text-[10px] truncate" style={{ color: C.muted }}>admin@barberpro.com</div>
                    </div>
                    <div className="space-y-1.5">
                      <button 
                        type="button"
                        onClick={() => { setTab("settings"); setShowAdminDropdown(false); }}
                        className="w-full text-left px-2 py-1.5 rounded-lg text-xs font-medium hover:bg-gray-50 flex items-center gap-2 transition-colors"
                        style={{ color: C.ink }}
                      >
                        <Settings size={13} color={C.muted} />
                        Platform Settings
                      </button>
                      <button 
                        type="button"
                        onClick={() => { setTab("dashboard"); setShowAdminDropdown(false); }}
                        className="w-full text-left px-2 py-1.5 rounded-lg text-xs font-medium hover:bg-gray-50 flex items-center gap-2 transition-colors"
                        style={{ color: C.ink }}
                      >
                        <LayoutDashboard size={13} color={C.muted} />
                        View Dashboard
                      </button>
                      <div className="h-px my-1.5 bg-stone-200/50" />
                      <button 
                        type="button"
                        onClick={handleSignOut}
                        className="w-full text-left px-2 py-1.5 rounded-lg text-xs font-bold hover:bg-red-50 flex items-center gap-2 transition-colors"
                        style={{ color: C.red }}
                      >
                        <LogOut size={13} />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </header>

          <div className="w-full h-[2px]" style={{ background: '#A1804E', opacity: 0.9 }}></div>

          <main className="pt-8 pb-12" key={tab}>
            {tab === "dashboard" && (
              <div className="space-y-6 animate-fade-in">

                {/* ── STAT CARDS: now with colored subtext ── */}
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                  {[
                    { label: "Total Customers", value: loading ? "—" : stats?.customers ?? customers.length, sub: "Registered users", subColor: C.gold, icon: Users, iconBg: C.goldLight, iconColor: C.gold },
                    { label: "Active Salons", value: loading ? "—" : stats?.salons ?? salons.filter(s => s.status === "approved").length, sub: "Approved & live", subColor: C.green, icon: Store, iconBg: C.greenLight, iconColor: C.green },
                    { label: "Total Bookings", value: loading ? "—" : stats?.bookings ?? bookings.length, sub: `${pendingBookings} pending`, subColor: C.purple, icon: CalendarDays, iconBg: C.purpleLight, iconColor: C.purple },
                    { label: "Revenue", value: loading ? "—" : revenueDisplay, sub: "Total collected", subColor: C.orange, icon: IndianRupee, iconBg: C.orangeLight, iconColor: C.orange },
                  ].map((card) => {
                    const Icon = card.icon;
                    return (
                      <div key={card.label} className="bg-white rounded-xl border card-shadow p-6 transform transition-all duration-200 hover:-translate-y-1 hover:shadow-lg" style={{ borderColor: C.border }}>
                        <p className="text-[13px] font-medium" style={{ color: C.muted }}>{card.label}</p>
                        <div className="flex items-center justify-between mt-3">
                          <div>
                            <div style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontSize: 30, fontWeight: 900, lineHeight: 1, color: C.ink }}>{card.value}</div>
                            {/* ── colored subtext below value ── */}
                            <div className="text-[12px] font-medium mt-1" style={{ color: card.subColor }}>{card.sub}</div>
                          </div>
                          <div className="p-3 rounded-lg" style={{ background: card.iconBg }}>
                            <Icon size={22} color={card.iconColor} />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* ── DASHBOARD PANELS: 2-column grid, no chart ── */}
                <div className="grid grid-cols-2 gap-4">

                  {/* 1. Recent Bookings */}
                  <div className="bg-white rounded-2xl border card-shadow p-6 flex flex-col" style={{ borderColor: C.border }}>
                    <div className="flex items-center justify-between mb-6">
                      <h3 style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontSize: 20, fontWeight: 900, color: C.ink }}>Recent Bookings</h3>
                      <button onClick={() => setTab("appointments")} className="text-[11px] font-bold" style={{ color: C.orange }}>View All →</button>
                    </div>
                    {bookings.length === 0 ? (
                      <div className="flex-1 flex flex-col items-center justify-center text-center py-12">
                        <div className="text-[13px] font-semibold" style={{ color: C.muted }}>No bookings yet</div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {bookings.slice(0, 4).map(b => (
                          <div key={b._id} className="flex justify-between items-center">
                            <div className="flex items-center gap-3">
                              <Avatar name={b.customer_id?.name || "C"} size={36} color={C.blue} bg={C.blueLight} />
                              <div>
                                <div className="text-[13px] font-semibold">{b.customer_id?.name || "Customer"}</div>
                                <div className="text-[11px]" style={{ color: C.muted }}>{b.services?.[0]?.service_name || "Service"}</div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-[13px] font-bold">₹{b.total_amount}</div>
                              <Badge label={b.status} color={bkStatus(b.status)} />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* 2. Barber Status */}
                  <div className="bg-white rounded-2xl border card-shadow p-6 flex flex-col" style={{ borderColor: C.border }}>
                    <div className="flex items-center justify-between mb-6">
                      <h3 style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontSize: 20, fontWeight: 900, color: C.ink }}>Barber Status</h3>
                      <button onClick={() => setTab("live")} className="text-[11px] font-bold" style={{ color: C.orange }}>Live View →</button>
                    </div>
                    {barbers.length === 0 ? (
                      <div className="flex-1 flex flex-col items-center justify-center text-center py-12">
                        <div className="text-[13px] font-semibold" style={{ color: C.muted }}>No barbers added yet</div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {barbers.slice(0, 4).map((b) => (
                          <div key={b._id} className="flex justify-between items-center">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 bg-gray-200 rounded-full flex items-center justify-center text-xs font-bold text-gray-500 overflow-hidden">
                                {b.name[0]}
                              </div>
                              <div>
                                <div className="text-[13px] font-semibold">{b.name}</div>
                                <div className="text-[11px]" style={{ color: C.muted }}>{b.salon_id?.salon_name || "—"}</div>
                              </div>
                            </div>
                            <Badge label={b.status} color={bStatus(b.status)} />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* 3. Pending Salon Requests */}
                  <div className="bg-white rounded-2xl border card-shadow p-6 flex flex-col" style={{ borderColor: C.border }}>
                    <div className="flex items-center justify-between mb-4">
                      <h3 style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontSize: 20, fontWeight: 900, color: C.ink }}>Pending Salon Requests</h3>
                      <button onClick={() => setTab("salons")} className="text-[11px] font-bold" style={{ color: C.orange }}>View All →</button>
                    </div>
                    {salons.filter(s => s.status === "pending").length === 0 ? (
                      <div className="flex-1 flex flex-col items-center justify-center text-center py-12">
                        <div className="text-[13px] font-semibold" style={{ color: C.muted }}>No pending requests — all caught up!</div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {salons.filter(s => s.status === "pending").slice(0, 3).map(s => (
                          <div key={s._id} className="flex justify-between items-center">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 bg-gray-200 rounded-lg"></div>
                              <div>
                                <div className="text-[13px] font-semibold">{s.salon_name}</div>
                                <div className="text-[11px]" style={{ color: C.muted }}>{s.owner_name}</div>
                              </div>
                            </div>
                            <button className="text-[11px] px-3 py-1.5 rounded-md font-bold bg-green-50 text-green-700" onClick={() => updateSalonStatus(s._id, "approved")}>Approve</button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* 4. Barber Credentials */}
                  <div className="bg-white rounded-2xl border card-shadow p-6 flex flex-col" style={{ borderColor: C.border }}>
                    <div className="flex items-center justify-between mb-4">
                      <h3 style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontSize: 20, fontWeight: 900, color: C.ink }}>Barber Credentials (This Session)</h3>
                    </div>
                    {addedBarbers.length === 0 ? (
                      <div className="flex-1 flex flex-col items-center justify-center text-center py-12">
                        <div className="text-[13px] font-semibold" style={{ color: C.muted }}>No barbers added this session</div>
                      </div>
                    ) : (
                      <div className="space-y-3 overflow-y-auto max-h-[160px]">
                        {addedBarbers.map((b, i) => (
                          <div key={i} className="text-[12px] bg-gray-50 p-2 rounded-lg border">
                            <div className="font-bold">{b.name}</div>
                            <div className="text-[11px] text-gray-500 flex justify-between mt-1">
                              <span>{b.mobile}</span>
                              <span className="font-mono text-red-500">{b.password}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                </div>
              </div>
            )}

            {tab === "salons" && (
              <SalonsModule
                salons={salons}
                customers={customers}
                bookings={bookings}
                stats={stats}
                loading={loading}
                pendingBookings={pendingBookings}
                revenueDisplay={revenueDisplay}
                updateSalonStatus={updateSalonStatus}
                addSalon={addSalon}
              />
            )}
            {tab === "customers" && (
              <CustomersModule
                customers={customers}
                loading={loading}
                customerSearch={customerSearch}
                setCustomerSearch={setCustomerSearch}
                blockCustomer={blockCustomer}
                stats={stats}
              />
            )}
            {tab === "barbers" && (
              <BarbersModule
                barbers={barbers}
                loading={loading}
                onSetTab={setTab}
                changeBarberStatus={changeBarberStatus}
                removeBarber={removeBarber}
              />
            )}
            {tab === "addbarber" && (
              <AddBarberModule
                salons={salons}
                newBarber={newBarber}
                setNewBarber={setNewBarber}
                addBarber={addBarber}
                busy={busy}
                addedBarbers={addedBarbers}
                photoRef={photoRef}
                docRef={docRef}
                handlePhotoChange={handlePhotoChange}
                handleDocChange={handleDocChange}
              />
            )}
            {tab === "appointments" && (
              <AppointmentsModule bookings={bookings} loading={loading} changeBookingStatus={changeBookingStatus} />
            )}
            {tab === "services" && (
              <ServicesModule
                services={services}
                salons={salons}
                loading={loading}
                newService={newService}
                setNewService={setNewService}
                addService={addService}
                toggleService={toggleService}
                deleteService={deleteService}
              />
            )}
            {tab === "payments" && (
              <PaymentsModule payments={payments} loading={loading} />
            )}
            {tab === "reviews" && (
              <ReviewsModule reviews={reviews} loading={loading} deleteReview={deleteReview} />
            )}
            {tab === "live" && (
              <LiveMonitoringModule barbers={barbers} loading={loading} changeBarberStatus={changeBarberStatus} />
            )}
            {tab === "settings" && (
              <SettingsModule onSave={() => pop("Settings saved!")} />
            )}

          </main>
        </div>
      </div>

      {/* ══ TOAST ══ */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 px-5 py-3 rounded-xl font-semibold text-sm shadow-xl text-white animate-fade-in" style={{ background: toast.type === "error" ? C.red : C.green }}>
          {toast.msg}
        </div>
      )}
    </div>
  );
}

export default AdminRequests;

