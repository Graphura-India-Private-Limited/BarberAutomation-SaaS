import React, { useState, useEffect } from "react";
import { Link, useNavigate, Outlet, useLocation, Navigate } from "react-router-dom";
import {
  Scissors, BarChart2, CreditCard, DollarSign, LayoutDashboard,
  LogOut, Clock, Calendar, Settings, Coffee, Users, ShieldAlert,
  Menu, X, Sparkles, Building
} from "lucide-react";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const CHARCOAL = "#3E362E";
const GOLD = "#C5A059";

export default function OwnerLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [salon, setSalon] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  // Authentication Guard
  if (!token || role !== "owner") {
    return <Navigate to="/owner/login" state={{ from: location }} replace />;
  }

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API}/auth/owner/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message || "Failed to load profile");
      setSalon(data.salon);
    } catch (err) {
      setError(err.message || "Server connection error");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/owner/login");
  };

  // Check if current page is Console Home (Dashboard status page)
  const isDashboardHome = location.pathname === "/owner/dashboard";

  // Navigation Items
  const menuItems = [
    { label: "Console Home", path: "/owner/dashboard", icon: LayoutDashboard, approvedOnly: false },
    { label: "Live Queue", path: "/owner/queue", icon: Clock, approvedOnly: true },
    { label: "Bookings & Slots", path: "/owner/bookings", icon: Calendar, approvedOnly: true },
    { label: "Services Catalog", path: "/owner/manage-services", icon: Scissors, approvedOnly: true },
    { label: "Barber Team", path: "/owner/barbers", icon: Users, approvedOnly: true },
    { label: "Break Approvals", path: "/owner/approvals", icon: Coffee, approvedOnly: true },
    { label: "Payment Gateway", path: "/owner/payments", icon: CreditCard, approvedOnly: true },
    { label: "Revenue Stream", path: "/owner/revenue", icon: DollarSign, approvedOnly: true },
    { label: "Analytics Metrics", path: "/owner/dashboard/analytics", icon: BarChart2, approvedOnly: true },
    { label: "Finance Overview", path: "/owner/finance", icon: DollarSign, approvedOnly: true },
    { label: "Salon Settings", path: "/owner/settings", icon: Settings, approvedOnly: true }
  ];

  if (loading) {
    return (
      <div style={{ background: "#FAF6F0" }} className="min-h-screen flex items-center justify-center font-sans">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center animate-pulse">
            <Scissors className="w-6 h-6 text-amber-600 animate-spin" style={{ animationDuration: '3s' }} />
          </div>
          <p className="text-stone-600 text-sm font-semibold tracking-wider uppercase font-sans animate-pulse">Synchronizing Console...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ background: "#FAF6F0" }} className="min-h-screen flex items-center justify-center p-6 text-center font-sans">
        <div className="max-w-md bg-white border border-[#EADBCE] rounded-[2rem] p-8 shadow-xl">
          <div className="w-16 h-16 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center mx-auto mb-6 text-red-600">
            <ShieldAlert size={28} />
          </div>
          <h2 className="font-serif text-2xl font-black text-stone-900 mb-2">Connection Blocked</h2>
          <p className="text-stone-500 text-sm leading-relaxed mb-6">{error}</p>
          <div className="space-y-3">
            <button 
              onClick={fetchProfile}
              className="w-full py-3.5 rounded-xl text-white font-extrabold text-xs tracking-wider uppercase transition-all shadow-md active:scale-95 cursor-pointer font-sans border-none"
              style={{ background: CHARCOAL }}
            >
              Retry Connection
            </button>
            <button 
              onClick={handleLogout}
              className="w-full py-3.5 rounded-xl text-stone-600 hover:text-stone-950 font-extrabold text-xs tracking-wider uppercase transition-all border border-stone-200 bg-transparent hover:bg-stone-50 cursor-pointer font-sans"
            >
              Return to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  const isApproved = salon?.status === "approved";

  // Security Gate: Redirect non-approved owners back to dashboard if they try to access other routes
  if (!isApproved && !isDashboardHome) {
    return <Navigate to="/owner/dashboard" replace />;
  }

  const getStatusBadge = () => {
    if (salon?.status === "approved") {
      return (
        <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200/50">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
          Active
        </span>
      );
    }
    if (salon?.status === "rejected") {
      return (
        <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-red-50 text-red-700 border border-red-200/50">
          Rejected
        </span>
      );
    }
    return (
      <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-50 text-amber-700 border border-amber-200/50">
        Pending Verification
      </span>
    );
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row text-stone-800" style={{ background: "#FAF6F0" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap');
        body, .font-sans { font-family: 'Plus Jakarta Sans', sans-serif !important; }
        .font-serif { font-family: 'Playfair Display', serif !important; }
        
        .owner-sidebar {
          background: #FFFFFF;
          border-right: 1px solid #EADBCE;
          box-shadow: 4px 0 24px -4px rgba(28, 25, 23, 0.02);
          transition: all 0.3s ease;
        }

        .nav-item {
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .nav-item.active {
          background: rgba(197, 160, 89, 0.08);
          color: #C5A059;
          border-left: 3px solid #C5A059;
          padding-left: 13px !important;
        }
      `}</style>

      {/* ── MOBILE HEADER ── */}
      <header className="md:hidden flex items-center justify-between p-4 bg-white border-b border-stone-200 sticky top-0 z-40 w-full">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-amber-50 border border-[#C5A059]/20">
            <Scissors size={16} color="#C5A059" strokeWidth={2.5} />
          </div>
          <span className="text-sm font-black text-stone-900 tracking-tight">Barber Pro</span>
        </div>
        <div className="flex items-center gap-3">
          {getStatusBadge()}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 rounded-lg hover:bg-stone-50 border-none bg-transparent cursor-pointer"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>

      {/* ── DESKTOP & MOBILE SIDEBAR ── */}
      <aside className={`owner-sidebar w-64 md:sticky md:top-0 h-screen md:flex flex-col justify-between p-6 z-30 fixed inset-y-0 left-0 transform md:transform-none transition-transform duration-300 ease-in-out shrink-0 ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'} bg-white`}>
        <div className="space-y-6 flex flex-col h-full overflow-y-auto custom-scrollbar">
          
          {/* Logo & Close Button (Mobile Only) */}
          <div className="flex items-center justify-between border-b pb-5 border-stone-100">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-amber-50 border border-[#C5A059]/20">
                <Scissors size={18} color="#C5A059" strokeWidth={2} />
              </div>
              <div className="text-left">
                <div className="text-sm font-black tracking-tight text-stone-900">Barber Pro</div>
                <div className="text-[10px] font-extrabold uppercase tracking-widest text-[#C5A059] mt-0.5">Owner Hub</div>
              </div>
            </div>
            <button 
              onClick={() => setMobileMenuOpen(false)}
              className="md:hidden p-1.5 rounded-lg hover:bg-stone-50 border-none bg-transparent cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>

          {/* Salon Context Card */}
          <div className="bg-stone-50 border border-stone-100 rounded-2xl p-4 text-left">
            <div className="flex items-center gap-2.5 mb-1.5">
              <Building size={14} className="text-[#C5A059]" />
              <p className="text-xs font-extrabold text-[#C5A059] uppercase tracking-wider truncate w-40">{salon?.salon_name || "Style Salon"}</p>
            </div>
            <p className="text-[10px] text-stone-400 font-bold truncate">{salon?.owner_name || "Salon Owner"}</p>
            <div className="mt-2.5 flex justify-start">
              {getStatusBadge()}
            </div>
          </div>

          {/* Sidebar Navigation Links */}
          <nav className="space-y-1 flex-1">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              const isLocked = item.approvedOnly && !isApproved;

              if (isLocked) return null; // Hide locked modules if salon is not approved yet

              return (
                <Link
                  key={item.label}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`nav-item flex items-center gap-3.5 px-4 py-3 text-xs font-extrabold tracking-wider uppercase rounded-xl transition-all cursor-pointer no-underline ${
                    isActive
                      ? "bg-amber-50/60 text-[#C5A059] border-l-4 border-[#C5A059] pl-3"
                      : "text-stone-500 hover:text-stone-900 hover:bg-stone-50"
                  }`}
                >
                  <item.icon size={16} className={isActive ? "text-[#C5A059]" : "text-stone-400"} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Exit Workspace Button */}
        <div className="pt-4 border-t border-stone-100">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3.5 px-4 py-3.5 text-xs font-extrabold tracking-wider uppercase rounded-xl text-red-500 hover:bg-red-50 transition-all border border-transparent cursor-pointer font-sans"
          >
            <LogOut size={16} className="text-red-400" />
            <span>Exit Hub</span>
          </button>
        </div>
      </aside>

      {/* ── OVERLAY FOR MOBILE SIDEBAR ── */}
      {mobileMenuOpen && (
        <div 
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 bg-black/20 backdrop-blur-xs z-20 md:hidden"
        />
      )}

      {/* ── MAIN CONTENT WORKSPACE ── */}
      <main className="flex-grow min-w-0 p-6 md:p-10 lg:p-12 overflow-y-auto">
        <Outlet context={{ salon, loadProfile: fetchProfile, token }} />
      </main>
    </div>
  );
}
