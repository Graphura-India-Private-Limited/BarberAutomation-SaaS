import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Shield, ShieldCheck, Users, Clock, ShieldAlert,
  ChevronDown, Eye, EyeOff, Lock, ArrowRight,
} from "lucide-react";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const DEMO = { mobile: "9000000000", password: "Admin@123" };

const GOLD = "#C5A059";
const BROWN = "#8B6B3E";
const BROWN_HOVER = "#735A32";

const FEATURES = [
  { icon: ShieldCheck, title: "SECURITY", sub: "Protected access" },
  { icon: Users, title: "USERS", sub: "Manage accounts" },
  { icon: Clock, title: "REQUESTS", sub: "Review quickly" },
  { icon: ShieldAlert, title: "AUDIT", sub: "Track activity" },
];

export default function AdminLogin() {
  const navigate = useNavigate();
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    if (mobile.length !== 10) { setError("Enter valid 10-digit mobile"); return; }
    if (!password) { setError("Enter password"); return; }
    setLoading(true); setError(""); setSuccess("");
    try {
      const res = await fetch(`${API}/auth/admin/login/mobile`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobile, password }),
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", "admin");
        setSuccess("Access granted! Redirecting...");
        setTimeout(() => navigate("/admin/requests"), 1000);
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

        {/* ── LEFT: Admin Hero ── */}
        {/* <div className="w-1/2 relative hidden md:flex flex-col justify-between overflow-hidden"
          style={{ background: "linear-gradient(135deg, #0f0f0f 0%, #1a1a2e 40%, #16213e 70%, #0f3460 100%)" }}
        > */}
        <div
          className="w-1/2 relative hidden md:flex flex-col justify-between overflow-hidden"
          style={{
            backgroundImage:
              "url('https://t4.ftcdn.net/jpg/03/74/32/65/360_F_374326500_IZuSyagnKizUonpTAxmG9xoJA7LLLavU.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0 bg-black/60" />
          {/* <div className="absolute inset-0 opacity-10"
            style={{ backgroundImage: "radial-gradient(circle at 20% 50%, #C5A059 0%, transparent 50%), radial-gradient(circle at 80% 20%, #8B6B3E 0%, transparent 40%)" }}
          /> */}
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage:
                "radial-gradient(circle at 20% 50%, #C5A059 0%, transparent 50%), radial-gradient(circle at 80% 20%, #8B6B3E 0%, transparent 40%)"
            }}
          />

          {/* Logo */}
          <div className="relative z-10 p-10 pt-12">
            <div className="flex items-center gap-3">
              <Shield size={26} color={GOLD} strokeWidth={2} />
              <div>
                <div className="text-white font-bold tracking-[0.25em] text-sm uppercase">Admin Station</div>
                <div className="text-white/60 text-[10px] tracking-[0.35em] uppercase mt-0.5">— Secure Access —</div>
              </div>
            </div>
          </div>

          {/* Headline */}
          <div className="relative z-10 px-10 pb-8 flex-1 flex flex-col justify-center">
            <h1 className="text-7xl font-serif font-bold leading-none">
              <span style={{ color: GOLD }}>ADMIN</span>
              <br />
              <span className="text-white">PORTAL</span>
            </h1>
            <div className="w-16 h-1 mt-5" style={{ background: GOLD }} />
            <p className="text-white/80 text-base mt-5 leading-relaxed max-w-xs italic">
              Manage requests, users, and analytics through a secure control center.
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

            {/* Shield icon */}
            <div className="flex justify-center mb-3">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: "#FEF3DC", border: `1.5px solid ${GOLD}50` }}>
                <Shield size={22} color={BROWN} />
              </div>
            </div>

            {/* Title */}
            <div className="text-center mb-4">
              <h2 className="text-2xl font-serif font-semibold text-gray-900">
                Admin Login
              </h2>
              <p className="text-gray-400 text-xs mt-1">Sign in to access the admin dashboard</p>
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
                className="text-[10px] font-bold uppercase tracking-wide px-3 py-1.5 rounded-lg text-white transition shrink-0"
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
                <div className="flex justify-between items-center mb-2">
                  <label className="text-[11px] font-bold uppercase tracking-widest text-gray-600">Password</label>
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

              {error && <p className="text-red-500 text-xs font-medium text-center">{error}</p>}
              {success && <p className="text-green-600 text-xs font-medium text-center">{success}</p>}

              {/* Access Dashboard button */}
              <button
                type="submit"
                disabled={loading || mobile.length !== 10 || !password}
                className="w-full flex items-center justify-center gap-2 py-4 rounded-xl text-white font-semibold text-sm transition disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ background: BROWN }}
                onMouseEnter={e => { if (!e.currentTarget.disabled) e.currentTarget.style.background = BROWN_HOVER; }}
                onMouseLeave={e => { e.currentTarget.style.background = BROWN; }}
              >
                {loading ? "Signing in…" : <><span>Access Dashboard</span><ArrowRight size={16} /></>}
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-3 my-3">
              <div className="flex-1 h-px bg-gray-200" />
              <span className="text-xs text-gray-400 uppercase tracking-widest">Need help?</span>
              <div className="flex-1 h-px bg-gray-200" />
            </div>

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
            <div className="flex items-center justify-center gap-1.5 mt-3">
              <Shield size={12} className="text-gray-300" />
              <p className="text-[10px] text-gray-300 text-center">
                Secured with super-level authentication • Admins only
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
