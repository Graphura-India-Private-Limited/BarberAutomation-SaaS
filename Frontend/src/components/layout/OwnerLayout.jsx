import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import { 
  Scissors, LayoutDashboard, Clock, Calendar, Coffee, 
  CreditCard, DollarSign, BarChart2, IndianRupee, Settings, 
  LogOut, Menu, X, Users, Activity, UserPlus, HeadphonesIcon
} from "lucide-react";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export default function OwnerLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [sideOpen, setSideOpen] = useState(false);
  const [pendingBreakCount, setPendingBreakCount] = useState(0);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  const salonName = localStorage.getItem("salonName") || "Barber Salon";
  const ownerName = localStorage.getItem("name") || "Owner";
  const initials = ownerName.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2) || "OW";

  useEffect(() => {
    const fetchPendingCount = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;
        const res = await fetch(`${API}/breaks/pending`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const data = await res.json();
        if (data.success) {
          setPendingBreakCount(data.data?.length || 0);
        }
      } catch (err) {
        console.error("Error fetching pending breaks count:", err);
      }
    };

    fetchPendingCount();
    const interval = setInterval(fetchPendingCount, 15000); // Poll every 15 seconds
    return () => clearInterval(interval);
  }, []);

  const NAV = [
    { id: "dashboard", label: "Console Home", icon: LayoutDashboard, route: "/owner/dashboard" },
    { id: "queue", label: "Live Queue", icon: Clock, route: "/owner/queue" },
    { id: "live", label: "Live Monitoring", icon: Activity, route: "/owner/live" },
    { id: "bookings", label: "Bookings & Slots", icon: Calendar, route: "/owner/bookings" },
    { id: "services", label: "Services Catalog", icon: Scissors, route: "/owner/manage-services" },
    { id: "barbers", label: "Barber Team", icon: Users, route: "/owner/barbers" },
    { id: "addbarber", label: "Add Barber", icon: UserPlus, route: "/owner/add-barber" },
    { id: "customers", label: "Customer Registry", icon: Users, route: "/owner/customers" },
    { id: "approvals", label: "Break Approvals", icon: Coffee, route: "/owner/approvals" },
    { id: "payments", label: "Payment Gateway", icon: CreditCard, route: "/owner/payments" },
    { id: "settlements", label: "Salon Settlements", icon: IndianRupee, route: "/owner/settlements" },
    { id: "financial-analytics", label: "Financial Analytics", icon: BarChart2, route: "/owner/financial-analytics" },
    { id: "support", label: "Support Tickets", icon: HeadphonesIcon, route: "/owner/support" },
    { id: "settings", label: "Profile ", icon: Settings, route: "/owner/settings" },
  ];

  return (
    <div className="flex min-h-screen text-[#4A3E3D] relative overflow-x-hidden" style={{ background: "#FDFBF7", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      
      {/* 📱 Mobile Backdrop Overlay */}
      {sideOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-xs z-40 xl:hidden transition-opacity duration-300"
          onClick={() => setSideOpen(false)}
        />
      )}

      {/* ── ═══ LUXURY SIDEBAR ═══ ── */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 flex flex-col transition-all duration-300 bg-[#FDFBF7]/95 border-r border-[#E6D5C3] backdrop-blur-md 
          ${sideOpen ? "w-64 translate-x-0" : "-translate-x-full w-64 xl:translate-x-0 xl:w-64"}`}
      >
        {/* Logo Brand Header */}
        <div className="flex items-center gap-3 px-6 py-5 border-b border-[#E6D5C3]">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-gradient-to-br from-[#A06D3B] to-[#8B5A2B] shrink-0">
            <Scissors className="w-4.5 h-4.5 text-white" size={18} />
          </div>
          <div className="overflow-hidden">
            <p className="font-serif font-black text-sm leading-none uppercase tracking-wider truncate w-40">Barber Pro</p>
            <p className="text-[10px] mt-1.5 font-bold uppercase tracking-widest text-[#8B5A2B]">Owner Hub</p>
          </div>
        </div>

        {/* Profile Details Panel */}
        <div className="mx-4 my-4 rounded-xl p-4 bg-[#8B5A2B]/5 border border-[#8B5A2B]/15">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full flex items-center justify-center font-black text-sm text-white bg-gradient-to-br from-[#8B5A2B] to-[#4A3E3D] shrink-0">
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-serif font-black text-sm truncate">{salonName}</p>
              <p className="text-[10px] text-stone-500 font-medium truncate">{ownerName}</p>
            </div>
          </div>

          {/* Active Status Badge */}
          <div className="mt-3 flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-black uppercase tracking-wider bg-white border border-[#E6D5C3] text-stone-700 h-9">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-emerald-700">Active</span>
          </div>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 px-3 space-y-0.5 overflow-y-auto pb-4">
          {NAV.map((n) => {
            const isActive = location.pathname === n.route;
            return (
              <button 
                key={n.id} 
                onClick={() => { navigate(n.route); setSideOpen(false); }} 
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all text-left cursor-pointer group relative ${
                  isActive 
                    ? "bg-[#8B5A2B]/10 font-black text-[#4A3E3D]" 
                    : "text-stone-500 hover:bg-[#8B5A2B]/5 hover:text-stone-900 font-extrabold"
                }`}
              >
                <n.icon className="w-4 h-4 shrink-0 transition-colors" style={{ color: isActive ? "#8B5A2B" : "#A39796" }} />
                <span className="text-xs uppercase tracking-wider font-sans">{n.label}</span>
                {n.id === "approvals" && pendingBreakCount > 0 && (
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 ring-4 ring-emerald-100 animate-pulse ml-2 shrink-0" />
                )}
                
                {isActive && (
                  <div className="w-1.5 h-4 rounded-full bg-[#8B5A2B] ml-auto" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Logout Exit Hub */}
        <div className="px-3 pb-4 pt-3 border-t border-[#E6D5C3]">
          <button 
            onClick={() => { localStorage.clear(); navigate("/owner/login"); }} 
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-red-700 hover:bg-red-50/60 text-xs font-black uppercase tracking-wider transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4 text-red-600" /> Exit Hub
          </button>
        </div>
      </aside>

      {/* ── ═══ MAIN CONTENT AREA ═══ ── */}
      <div className="flex-1 min-w-0 xl:ml-64 flex flex-col">
        
        {/* Desktop Top Navbar Header */}
        <header className="hidden xl:flex items-center justify-between px-8 py-4 bg-gradient-to-r from-[#FDFBF7] to-[#F5F1ED] border-b border-[#E6D5C3] sticky top-0 z-30">
          <div className="flex-1">
            <p className="font-serif font-black text-lg text-[#3E362E]">{salonName}</p>
          </div>
          
          {/* Desktop Profile Avatar with Dropdown */}
          <div className="relative">
            <button 
              onClick={() => setShowProfileDropdown(!showProfileDropdown)}
              className="w-10 h-10 rounded-full bg-gradient-to-br from-[#8B5A2B] to-[#4A3E3D] text-white flex items-center justify-center font-bold text-sm shrink-0 hover:shadow-md transition-all cursor-pointer"
            >
              {initials}
            </button>
            
            {/* Profile Dropdown Menu */}
            {showProfileDropdown && (
              <>
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setShowProfileDropdown(false)}
                />
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50">
                  <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-[#FDFBF7] to-[#F5F1ED]">
                    <p className="font-serif font-black text-sm text-[#3E362E]">{ownerName}</p>
                    <p className="text-xs text-stone-500 mt-1.5 font-bold uppercase tracking-wider">{salonName}</p>
                  </div>
                  
                  <div className="py-2">
                    <button
                      onClick={() => {
                        navigate("/owner/settings");
                        setShowProfileDropdown(false);
                      }}
                      className="w-full px-4 py-2.5 text-left text-sm text-[#3E362E] hover:bg-[#8B5A2B]/5 font-bold uppercase tracking-wider transition-colors"
                    >
                      MY PROFILE
                    </button>
                    
                    <button
                      onClick={() => {
                        navigate("/owner/approvals");
                        setShowProfileDropdown(false);
                      }}
                      className="w-full px-4 py-2.5 text-left text-sm text-[#3E362E] hover:bg-[#8B5A2B]/5 font-bold uppercase tracking-wider transition-colors"
                    >
                      BREAK APPROVALS
                    </button>
                  </div>
                  
                  <div className="border-t border-gray-100 py-2">
                    <button
                      onClick={() => {
                        localStorage.clear();
                        navigate("/owner/login");
                      }}
                      className="w-full px-4 py-2.5 text-left text-sm text-red-600 hover:bg-red-50 font-bold uppercase tracking-wider transition-colors"
                    >
                      LOGOUT
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </header>
        
        {/* Mobile Top Navbar Header */}
        <header className="xl:hidden flex items-center justify-between px-4 py-4 bg-[#3E362E] border-b border-[#4A3E3D] sticky top-0 z-30">
          <button onClick={() => setSideOpen(!sideOpen)} className="p-1 text-[#C5A059] hover:text-white cursor-pointer">
            {sideOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
          <p className="font-serif font-black text-sm text-white truncate max-w-[180px]">{salonName}</p>
          
          {/* Profile Avatar with Dropdown */}
          <div className="relative">
            <button 
              onClick={() => setShowProfileDropdown(!showProfileDropdown)}
              className="w-8 h-8 rounded-full bg-[#C5A059] text-[#2A241F] flex items-center justify-center font-bold text-xs shrink-0 hover:bg-[#D4B896] transition-colors cursor-pointer"
            >
              {initials}
            </button>
            
            {/* Profile Dropdown Menu */}
            {showProfileDropdown && (
              <>
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setShowProfileDropdown(false)}
                />
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden z-50">
                  <div className="p-4 border-b border-gray-100">
                    <p className="font-bold text-sm text-gray-900">{ownerName}</p>
                    <p className="text-xs text-stone-500 mt-1 font-bold uppercase tracking-wider">{salonName}</p>
                  </div>
                  
                  <div className="py-2">
                    <button
                      onClick={() => {
                        navigate("/owner/settings");
                        setShowProfileDropdown(false);
                      }}
                      className="w-full px-4 py-2.5 text-left text-sm text-[#3E362E] hover:bg-[#8B5A2B]/5 font-bold uppercase tracking-wider transition-colors"
                    >
                      MY PROFILE
                    </button>
                    
                    <button
                      onClick={() => {
                        navigate("/owner/approvals");
                        setShowProfileDropdown(false);
                      }}
                      className="w-full px-4 py-2.5 text-left text-sm text-[#3E362E] hover:bg-[#8B5A2B]/5 font-bold uppercase tracking-wider transition-colors"
                    >
                      BREAK APPROVALS
                    </button>
                  </div>
                  
                  <div className="border-t border-gray-100 py-2">
                    <button
                      onClick={() => {
                        localStorage.clear();
                        navigate("/owner/login");
                      }}
                      className="w-full px-4 py-2.5 text-left text-sm text-red-600 hover:bg-red-50 font-bold uppercase tracking-wider transition-colors"
                    >
                      LOGOUT
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </header>

        {/* Dynamic Inner Page Content Area */}
        <main className="flex-1">
          <Outlet />
        </main>
      </div>

    </div>
  );
}
