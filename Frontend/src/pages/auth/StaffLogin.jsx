import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AppContext";
import { 
  Scissors, Mail, Lock, Eye, EyeOff, KeyRound, 
  ShieldAlert, Sparkles, ChevronRight, UserCheck 
} from "lucide-react";
import salonImage from "../../assets/shop.jpg"; // Reuses your unified dashboard luxury salon asset file

export default function StaffLogin() {
  const { login, logout } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const GOLD = "#C5A059";
  const BROWN = "#8B6B3E";
  const BROWN_HOVER = "#735A32";

  const handleLogin = (e) => {
    e.preventDefault();
    if (!email || !password) return;
    setLoading(true);
    setError("");

    setTimeout(() => {
      const ok = login(email, password);
      setLoading(false);
      if (ok) {
        const role = localStorage.getItem("role");
        if (role === "barber") {
          navigate("/barber/dashboard");
        } else {
          logout();
          setError("Access Denied. Only staff (barbers) are allowed to access the Staff Portal.");
        }
      } else {
        setError("Invalid credentials. Please verify your access tokens.");
      }
    }, 800);
  };

  const demoLogin = (em, pw) => {
    setLoading(true);
    setTimeout(() => {
      const ok = login(em, pw);
      setLoading(false);
      if (ok) {
        const role = localStorage.getItem("role");
        if (role === "barber") {
          navigate("/barber/dashboard");
        } else {
          logout();
          setError("Access Denied. Only staff (barbers) are allowed to access the Staff Portal.");
        }
      }
    }, 400);
  };

  return (
    <div className="min-h-screen bg-[#111] flex flex-col md:flex-row w-full font-sans overflow-x-hidden">
      <div className="w-full min-h-screen bg-white flex flex-col md:flex-row">
        
        {/* ── LEFT PANEL: LUXURY CONTEXT BRAND HERO ── */}
        <div className="w-full md:w-1/2 h-[220px] sm:h-[280px] md:h-screen md:sticky md:top-0 relative flex flex-col justify-between overflow-hidden">
          <img 
            src={salonImage} 
            alt="Salon Workspace" 
            className="absolute inset-0 w-full h-full object-cover" 
          />
          <div className="absolute inset-0 bg-black/60 backdrop-blur-[1px]" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/70" />

          {/* Core Platform Logo Badge */}
          <div className="relative z-10 p-6 xl:p-10 pt-6 xl:pt-12 text-left">
            <div className="flex items-center gap-3">
              <Scissors size={20} className="xl:w-[26px] xl:h-[26px]" color={GOLD} strokeWidth={2} />
              <div>
                <div className="text-white font-extrabold tracking-[0.25em] text-xs xl:text-sm uppercase">Barber Pro</div>
                <div className="text-white/50 text-[8px] xl:text-[10px] tracking-[0.35em] uppercase mt-0.5">— Platform Core —</div>
              </div>
            </div>
          </div>

          {/* Context Dynamic Headline */}
          <div className="relative z-10 px-6 md:px-10 pb-5 md:pb-8 flex-1 flex flex-col justify-end md:justify-center text-left">
            <span className="text-[9px] font-black tracking-[0.3em] uppercase mb-1.5" style={{ color: GOLD }}>
              Internal Workspace Gateway
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl xl:text-7xl font-serif font-bold leading-none text-white uppercase tracking-tight">
              Staff <br />
              <span style={{ color: GOLD }} className="md:block">Portal</span>
            </h1>
            <div className="w-12 md:w-16 h-0.5 md:h-1 mt-2 md:mt-5" style={{ background: GOLD }} />
            <p className="text-white/70 text-[10px] md:text-sm mt-2 md:mt-5 leading-relaxed max-w-sm font-medium hidden sm:block">
              Access scheduled client rosters, track real-time queue states, and manage personal shift parameters cleanly.
            </p>
          </div>

          {/* Secure Compliance Stamp Footer */}
          <div className="relative z-10 px-10 pb-10 hidden md:flex items-center gap-2 text-white/40 text-[10px] font-bold tracking-wider uppercase border-t border-white/10 pt-4 bg-black/20">
            <KeyRound size={12} style={{ color: GOLD }} />
            <span>Encrypted End-To-End Access Nodes</span>
          </div>
        </div>

        {/* ── RIGHT PANEL: FORM REGISTRATION ACCESS CARD ── */}
        <div className="w-full md:w-1/2 flex items-center justify-center px-6 py-8 md:py-8" style={{ background: "#F7F5F2" }}>
          <div className="bg-white w-[460px] px-8 py-7 rounded-[2.5rem] shadow-xl border border-[#EADBCE]/40">
            
            {/* Identity Icon Frame */}
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center border shadow-sm bg-stone-50" style={{ borderColor: `${GOLD}40` }}>
                <Scissors size={20} style={{ color: BROWN }} strokeWidth={2} />
              </div>
            </div>

            {/* Typography Labels Title */}
            <div className="text-center mb-6">
              <h2 className="text-2xl font-serif font-black text-stone-900 tracking-tight">
                The Royal Blade <span>💈</span>
              </h2>
              <p className="text-stone-400 text-xs mt-1.5 font-medium">Sign in to initialize your service terminal window</p>
            </div>

            {/* Interactive Credentials Core Login Form */}
            <form onSubmit={handleLogin} className="space-y-4">
              
              {/* Input Element Field 1: Email Identifier */}
              <div>
                <label className="block text-[10px] font-black uppercase tracking-[0.15em] mb-2 text-stone-500">
                  Work Email Address
                </label>
                <div className="flex border rounded-xl overflow-hidden bg-stone-50 border-stone-200 focus-within:border-amber-600 transition-all">
                  <div className="flex items-center px-4 bg-stone-50/50 border-r border-stone-200">
                    <Mail size={15} className="text-stone-400" />
                  </div>
                  <input
                    type="email"
                    required
                    placeholder="name@salon.com"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setError(""); }}
                    className="flex-1 px-4 py-3.5 text-sm outline-none bg-white text-stone-800 font-medium"
                  />
                </div>
              </div>

              {/* Input Element Field 2: Password Value Token */}
              <div>
                <label className="block text-[10px] font-black uppercase tracking-[0.15em] mb-2 text-stone-500">
                  Password Key
                </label>
                <div className="flex border rounded-xl overflow-hidden bg-stone-50 border-stone-200 focus-within:border-amber-600 transition-all">
                  <div className="flex items-center px-4 bg-stone-50/50 border-r border-stone-200">
                    <Lock size={15} className="text-stone-400" />
                  </div>
                  <input
                    type={showPwd ? "text" : "password"}
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setError(""); }}
                    className="flex-1 px-4 py-3.5 text-sm outline-none bg-white text-stone-800 font-medium tracking-wide"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPwd(p => !p)}
                    className="px-4 bg-white text-stone-400 hover:text-stone-600 cursor-pointer transition-colors"
                  >
                    {showPwd ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              {/* Action Dynamic Error Displays */}
              {error && (
                <div className="flex items-center justify-center gap-2 p-2.5 rounded-xl bg-rose-50 border border-rose-100 text-rose-600 text-xs font-bold text-center">
                  <ShieldAlert size={14} className="shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Terminal System Trigger Button */}
              <button
                type="submit"
                disabled={loading || !email || !password}
                className="w-full flex items-center justify-center gap-2 py-4 rounded-xl text-white font-bold text-xs uppercase tracking-widest transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-md mt-2"
                style={{ background: BROWN }}
                onMouseEnter={(e) => { if (!e.currentTarget.disabled) e.currentTarget.style.background = BROWN_HOVER; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = BROWN; }}
              >
                {loading ? "Verifying Token..." : (
                  <>
                    <span>Initialize Session</span>
                    <ChevronRight size={14} strokeWidth={2.5} />
                  </>
                )}
              </button>
            </form>

            {/* Divider Splitting Section */}
            <div className="flex items-center gap-4 my-5">
              <div className="flex-1 h-px bg-stone-200" />
              <span className="text-[9px] text-stone-400 font-black uppercase tracking-[0.2em] whitespace-nowrap">
                Demo Accounts
              </span>
              <div className="flex-1 h-px bg-stone-200" />
            </div>

            {/* ── DEMO SEED ACCOUNT TRIGGER LIST ── */}
            <div className="space-y-2 max-h-[180px] overflow-y-auto pr-1 custom-scrollbar">
              {[
                { label: "Ajay", role: "Barber (With Finances)", email: "ajay@salon.com", pass: "barber123", icon: "💈" },
                { label: "Kiran", role: "Barber (Fixed Salary)", email: "kiran@salon.com", pass: "kiran123", icon: "✂️" }
              ].map((demo) => (
                <button
                  key={demo.email}
                  type="button"
                  onClick={() => demoLogin(demo.email, demo.pass)}
                  disabled={loading}
                  className="w-full text-left p-3 rounded-xl border border-stone-200 bg-stone-50/50 hover:bg-[#FEF9EE] hover:border-[#C5A059]/60 transition-all duration-200 flex items-center justify-between group cursor-pointer"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="text-base">{demo.icon}</span>
                    <div className="min-w-0">
                      <p className="text-xs font-black text-stone-800 leading-tight group-hover:text-amber-900">
                        {demo.label} <span className="text-[10px] font-bold text-stone-400 normal-case ml-1">({demo.role})</span>
                      </p>
                      <p className="text-[11px] font-medium text-stone-400 truncate mt-0.5">{demo.email}</p>
                    </div>
                  </div>
                  <UserCheck size={14} className="text-stone-300 group-hover:text-amber-700 opacity-0 group-hover:opacity-100 transition-all shrink-0 ml-2" />
                </button>
              ))}
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}