import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Scissors, Calendar, Clock, Star, Users,
  ChevronDown, Eye, EyeOff, Lock, ArrowRight, Shield,
} from "lucide-react";
import barberImage from "../../assets/login.jpg";
import { useAuth } from "../../contexts/AppContext";

const API  = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const DEMO = { mobile: "8888888801", password: "Barber@123" };

const GOLD        = "#C5A059";
const BROWN       = "#8B6B3E";
const BROWN_HOVER = "#735A32";

const FEATURES = [
  { icon: Calendar, title: "MY SCHEDULE",  sub: "Daily appointments" },
  { icon: Users,    title: "MY CLIENTS",   sub: "Client history" },
  { icon: Clock,    title: "QUEUE STATUS", sub: "Live updates" },
  { icon: Star,     title: "PERFORMANCE",  sub: "Track your stats" },
];

export default function BarberLogin() {
  const navigate = useNavigate();
  const { syncAuth } = useAuth();
  const [mobile,   setMobile]   = useState("");
  const [password, setPassword] = useState("");
  const [showPwd,  setShowPwd]  = useState(false);
  const [remember, setRemember] = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState("");
  const [success,  setSuccess]  = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    if (mobile.length !== 10) { setError("Enter valid 10-digit mobile"); return; }
    if (!password)             { setError("Enter password"); return; }
    setLoading(true); setError(""); setSuccess("");
    try {
      const res  = await fetch(`${API}/auth/barber/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobile, password }),
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem("token",      data.token);
        localStorage.setItem("role",       "barber");
        localStorage.setItem("barberId",   data.barber?._id || "");
        localStorage.setItem("barberName", data.barber?.name || "");
        localStorage.setItem("salonId",    data.barber?.salon_id?._id || "");
        localStorage.setItem("name",       data.barber?.name || "Barber");
        localStorage.setItem("email",      data.barber?.email || "");
        syncAuth();
        setSuccess("Login successful! Redirecting to dashboard...");
        setTimeout(() => navigate("/barber/overview"), 1200);
      } else {
        setError(data.message || "Login failed");
      }
    } catch {
      setError("Server error! Make sure backend is running.");
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = () => { setMobile(DEMO.mobile); setPassword(DEMO.password); setError(""); };

  return (
    <div className="min-h-screen bg-[#111] flex">
      <div className="w-full h-screen bg-white flex">

        {/* ── LEFT: Barber Hero ── */}
        <div className="w-1/2 relative hidden md:flex flex-col justify-between overflow-hidden">
          <img src={barberImage} alt="Barber" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/55" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60" />

          {/* Logo */}
          <div className="relative z-10 p-10 pt-12">
            <div className="flex items-center gap-3">
              <Scissors size={26} color={GOLD} strokeWidth={2} />
              <div>
                <div className="text-white font-bold tracking-[0.25em] text-sm uppercase">Barber Pro</div>
                <div className="text-white/60 text-[10px] tracking-[0.35em] uppercase mt-0.5">— Est. 2026 —</div>
              </div>
            </div>
          </div>

          {/* Headline */}
          <div className="relative z-10 px-10 pb-8 flex-1 flex flex-col justify-center">
            <h1 className="text-7xl font-serif font-bold leading-none">
              <span style={{ color: GOLD }}>BARBER</span>
              <br />
              <span className="text-white">PORTAL</span>
            </h1>
            <div className="w-16 h-1 mt-5" style={{ background: GOLD }} />
            <p className="text-white/80 text-base mt-5 leading-relaxed max-w-xs italic">
              Manage your daily schedule and clients through your personalized salon station.
            </p>
          </div>

          {/* Feature icons */}
          <div className="relative z-10 px-10 pb-10 grid grid-cols-4 gap-3">
            {FEATURES.map(({ icon: Icon, title, sub }) => (
              <div key={title} className="flex flex-col items-center text-center gap-2">
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center border"
                  style={{ borderColor: `${GOLD}80`, background: "rgba(0,0,0,0.35)" }}
                >
                  <Icon size={22} color={GOLD} strokeWidth={1.5} />
                </div>
                <span className="text-[9px] font-bold tracking-wider text-white uppercase leading-snug">{title}</span>
                <span className="text-[9px] text-white/60 leading-snug">{sub}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── RIGHT: Form card ── */}
        <div className="w-full md:w-1/2 flex items-center justify-center px-6 py-8" style={{ background: "#f7f5f2" }}>
          <div className="bg-white w-[460px] px-8 py-5 rounded-[28px] shadow-xl">

            {/* Scissors icon */}
            <div className="flex justify-center mb-3">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: "#FEF3DC", border: `1.5px solid ${GOLD}50` }}>
                <Scissors size={22} color={BROWN} />
              </div>
            </div>

            {/* Title */}
            <div className="text-center mb-4">
              <h2 className="text-2xl font-serif font-semibold text-gray-900">
                Barber Login 
              </h2>
              <p className="text-gray-400 text-xs mt-1">Sign in to access your station</p>
            </div>

            {/* Demo credentials */}
            <div
              className="rounded-xl px-4 py-2.5 mb-4 flex items-center justify-between"
              style={{ background: "#FEF9EE", border: `1px solid ${GOLD}40` }}
            >
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: GOLD }}>
                  Demo Credentials
                </p>
                <p className="text-sm font-semibold text-gray-700">
                  {DEMO.mobile} &nbsp;|&nbsp; {DEMO.password}
                </p>
              </div>
              <button
                onClick={fillDemo}
                className="text-[10px] font-bold uppercase tracking-wide px-3 py-1.5 rounded-lg text-white transition"
                style={{ background: BROWN }}
                onMouseEnter={e => (e.currentTarget.style.background = BROWN_HOVER)}
                onMouseLeave={e => (e.currentTarget.style.background = BROWN)}
              >
                Use
              </button>
            </div>

            <form onSubmit={handleLogin} className="space-y-3">
              {/* Mobile */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-widest mb-2 text-gray-600">
                  Mobile Number
                </label>
                <div className="flex border rounded-xl overflow-hidden" style={{ borderColor: "#E5E7EB" }}>
                  <div className="flex items-center gap-1 px-4 py-3.5 border-r bg-gray-50 text-sm font-semibold text-gray-700 shrink-0" style={{ borderColor: "#E5E7EB" }}>
                    <span>+91</span>
                    <ChevronDown size={13} className="text-gray-400" />
                  </div>
                  <input
                    type="tel"
                    maxLength={10}
                    autoFocus
                    placeholder="98765 43210"
                    value={mobile}
                    onChange={e => { setMobile(e.target.value.replace(/\D/g, "")); setError(""); }}
                    className="flex-1 px-4 py-3.5 text-sm outline-none bg-white text-gray-800"
                  />
                </div>
              </div>
              

              {/* Password */}
              <div>
                {/* ── PREMIUM FORGOT PASSWORD REDIRECT LINK ── */}
<div className="flex justify-end w-full px-1">
  <button
    type="button"
    onClick={() => navigate("/forgot-password")}
    className="text-[11px] font-black uppercase tracking-widest text-[#C5A059] hover:text-[#3E362E] hover:underline bg-transparent border-none cursor-pointer select-none transition-colors duration-200"
  >
    Forgot Password?
  </button>
</div>
                <div className="flex border rounded-xl overflow-hidden" style={{ borderColor: "#E5E7EB" }}>
                  <div className="flex items-center px-4 border-r bg-gray-50" style={{ borderColor: "#E5E7EB" }}>
                    <Lock size={15} className="text-gray-400" />
                  </div>
                  <input
                    type={showPwd ? "text" : "password"}
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={e => { setPassword(e.target.value); setError(""); }}
                    className="flex-1 px-4 py-3.5 text-sm outline-none bg-white text-gray-800"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPwd(p => !p)}
                    className="px-4 bg-white text-gray-400 hover:text-gray-600"
                  >
                    {showPwd ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              {/* Remember me */}
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={e => setRemember(e.target.checked)}
                  className="w-4 h-4 rounded accent-amber-700"
                />
                <span className="text-sm text-gray-500">Keep me signed in</span>
              </label>

              {error   && <p className="text-red-500 text-xs font-medium text-center">{error}</p>}
              {success && <p className="text-green-600 text-xs font-medium text-center">{success}</p>}

              {/* Login button */}
              <button
                type="submit"
                disabled={loading || mobile.length !== 10 || !password}
                className="w-full flex items-center justify-center gap-2 py-4 rounded-xl text-white font-semibold text-sm transition disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ background: BROWN }}
                onMouseEnter={e => { if (!e.currentTarget.disabled) e.currentTarget.style.background = BROWN_HOVER; }}
                onMouseLeave={e => { e.currentTarget.style.background = BROWN; }}
              >
                {loading ? "Logging in…" : <><span>Access Dashboard</span><ArrowRight size={16} /></>}
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-3 my-3">
              <div className="flex-1 h-px bg-gray-200" />
              <span className="text-xs text-gray-400 uppercase tracking-widest">New here?</span>
              <div className="flex-1 h-px bg-gray-200" />
            </div>

            {/* Login with Google */}
            <Link
              to="/login"
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border text-sm font-semibold text-gray-700 hover:bg-gray-50 transition"
              style={{ borderColor: "#E5E7EB" }}
            >
              <svg width="18" height="18" viewBox="0 0 48 48">
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.31-8.16 2.31-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
                <path fill="none" d="M0 0h48v48H0z"/>
              </svg>
              Login with Google
            </Link>

               {/* Help */ }
                       <p className="text-center text-xs text-gray-400 mt-3">
                         Need help?{" "}
                         <Link 
                           to="/support" 
                           className="font-semibold hover:underline cursor-pointer transition-all" 
                           style={{ color: GOLD }}
                         >
                           Contact Support
                         </Link>
                       </p>

            {/* Security note */}
            <div className="flex items-center justify-center gap-1.5 mt-2">
              <Shield size={12} className="text-gray-300" />
              <p className="text-[10px] text-gray-300 text-center">
                Secured with super-level authentication • Staff only
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
