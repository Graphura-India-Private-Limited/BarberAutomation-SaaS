import React from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { ShieldAlert, Home, LogOut } from "lucide-react";

export default function ProtectedRoute({ children, allowedRoles }) {
  const location = useLocation();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  // Determine correct login redirect based on route prefix
  const getLoginRedirect = () => {
    if (location.pathname.startsWith("/admin")) return "/admin/login";
    if (location.pathname.startsWith("/owner")) return "/owner/login";
    if (location.pathname.startsWith("/barber")) return "/barber/login";
    return "/login";
  };

  if (!token) {
    return <Navigate to={getLoginRedirect()} state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    // Beautiful Premium Access Denied View
    return (
      <div className="min-h-screen bg-[#1E1A17] flex items-center justify-center px-4 font-sans text-white">
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap');
          .font-sans {
            font-family: 'Plus Jakarta Sans', sans-serif !important;
          }
          .font-serif {
            font-family: 'Playfair Display', serif !important;
          }
          .glass-panel {
            background: rgba(43, 33, 24, 0.45);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            border: 1px solid rgba(197, 160, 89, 0.15);
            box-shadow: 0 24px 80px rgba(0, 0, 0, 0.6);
          }
        `}</style>
        
        <div className="glass-panel max-w-md w-full rounded-[2.5rem] p-8 text-center border border-[#C5A059]/20 relative overflow-hidden">
          {/* Subtle top ambient glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-12 bg-[#C5A059]/10 rounded-full blur-xl" />

          {/* Shield Icon */}
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/25 flex items-center justify-center mx-auto mb-6">
            <ShieldAlert size={32} className="text-[#C5A059]" />
          </div>

          {/* Heading */}
          <h2 className="font-serif text-3xl font-black text-white tracking-tight mb-3">
            Access <span className="italic text-[#C5A059] font-medium">Denied</span>
          </h2>

          {/* Description */}
          <p className="text-stone-400 text-sm leading-relaxed mb-8">
            You do not have authorization to view this workspace. This page is restricted to users with the <strong className="text-white">{allowedRoles.join(" / ")}</strong> role. Your current role is <strong className="text-[#C5A059] uppercase">{role || "None"}</strong>.
          </p>

          {/* Action Buttons */}
          <div className="space-y-3.5">
            <button
              onClick={() => navigate("/")}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-gradient-to-r from-[#C5A059] via-[#E8C878] to-[#C5A059] text-[#1E1A17] text-xs font-black uppercase tracking-wider hover:scale-[1.02] active:scale-95 transition cursor-pointer border-none shadow-[0_0_20px_rgba(197,160,89,0.25)]"
            >
              <Home size={14} />
              Go Back Home
            </button>
            <button
              onClick={() => {
                localStorage.clear();
                navigate(getLoginRedirect());
              }}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl border border-white/10 bg-white/[0.03] text-stone-300 text-xs font-black uppercase tracking-wider hover:bg-white/[0.06] hover:text-white transition cursor-pointer"
            >
              <LogOut size={14} />
              Sign Out & Switch Account
            </button>
          </div>
        </div>
      </div>
    );
  }

  return children;
}