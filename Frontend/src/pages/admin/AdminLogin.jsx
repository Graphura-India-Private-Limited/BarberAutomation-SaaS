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

  const [show2FA, setShow2FA] = useState(false);
  const [tempToken, setTempToken] = useState("");
  const [otp, setOtp] = useState("");

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
        const is2FAEnabled = localStorage.getItem("security_twoFactor") === "true";
        if (is2FAEnabled) {
          setTempToken(data.token);
          setShow2FA(true);
          setLoading(false);
        } else {
          localStorage.setItem("token", data.token);
          localStorage.setItem("role", "admin");
          localStorage.setItem("name", "System Admin");
          localStorage.setItem("email", "admin@barberpro.com");
          setSuccess("Access granted! Redirecting...");
          setTimeout(() => navigate("/admin"), 1000);
        }
      } else {
        setError(data.message || "Login failed");
      }
    } catch {
      setError("Server error! Make sure backend is running.");
    } finally {
      setLoading(false);
    }
  };

  const handle2FAVerify = (e) => {
    e.preventDefault();
    if (otp.length !== 6) { setError("Enter 6-digit verification code"); return; }
    setLoading(true); setError(""); setSuccess("");
    setTimeout(() => {
      localStorage.setItem("token", tempToken);
      localStorage.setItem("role", "admin");
      localStorage.setItem("name", "System Admin");
      localStorage.setItem("email", "admin@barberpro.com");
      setSuccess("2FA Verified! Redirecting...");
      setTimeout(() => navigate("/admin"), 1000);
      setLoading(false);
    }, 800);
  };

  const handleSecretKeyAutofill = () => {
    const key = prompt("Enter Secret Key to autofill Admin credentials:");
    if (key === "admin" || key === "BarberProAdmin2026") {
      setMobile(DEMO.mobile);
      setPassword(DEMO.password);
      setError("");
    } else if (key !== null) {
      setError("Invalid Secret Key!");
    }
  };

  return (
    <div className="w-full min-h-screen bg-white flex flex-col md:flex-row relative">

        {/* ── LEFT: Admin Hero ── */}
        <div
          className="w-full md:w-1/2 h-[220px] sm:h-[280px] md:h-screen md:sticky md:top-0 relative flex flex-col justify-between overflow-hidden"
          style={{
            backgroundImage:
              "url('https://t4.ftcdn.net/jpg/03/74/32/65/360_F_374326500_IZuSyagnKizUonpTAxmG9xoJA7LLLavU.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0 bg-black/60" />
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage:
                "radial-gradient(circle at 20% 50%, #C5A059 0%, transparent 50%), radial-gradient(circle at 80% 20%, #8B6B3E 0%, transparent 40%)"
            }}
          />

          {/* Logo */}
          <div className="relative z-10 p-6 xl:p-10 pt-6 xl:pt-12 text-left">
            <div className="flex items-center gap-3">
              <Shield size={20} className="xl:w-[26px] xl:h-[26px]" color={GOLD} strokeWidth={2} />
              <div>
                <div className="font-sans font-black uppercase tracking-widest text-xs xl:text-sm text-white">Admin Station</div>
                <div className="font-sans text-[8px] xl:text-[10px] font-extrabold uppercase tracking-widest text-white/60 mt-0.5">— Secure Access —</div>
              </div>
            </div>
          </div>

          {/* Headline */}
          <div className="relative z-10 px-6 md:px-10 pb-5 md:pb-8 flex-1 flex flex-col justify-end md:justify-center text-left">
            <h1 className="leading-none">
              <span className="font-sans font-black uppercase text-3xl sm:text-4xl md:text-5xl tracking-tight" style={{ color: GOLD }}>ADMIN</span>
              {" "}
              <span className="font-serif italic text-2xl sm:text-3xl text-white normal-case mt-1 block" style={{ color: "white" }}>Portal</span>
            </h1>
            <div className="w-12 md:w-16 h-0.5 md:h-1 mt-2 md:mt-5 bg-amber-500" style={{ background: GOLD }} />
            <p className="font-sans text-[10px] md:text-sm font-normal leading-relaxed text-white/80 mt-2 md:mt-5 max-w-xs hidden sm:block">
              Manage requests, users, and analytics through a secure control center.
            </p>
          </div>

          {/* Feature icons */}
          <div className="relative z-10 px-10 pb-10 hidden md:grid grid-cols-4 gap-3">
            {FEATURES.map(({ icon: Icon, title, sub }) => (
              <div key={title} className="flex flex-col items-center text-center gap-2">
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center border"
                  style={{ borderColor: `${GOLD}80`, background: "rgba(0,0,0,0.35)" }}
                >
                  <Icon size={22} color={GOLD} strokeWidth={1.5} />
                </div>
                <span className="font-sans text-[9px] font-extrabold uppercase tracking-widest text-white leading-snug">{title}</span>
                <span className="font-sans text-[9px] font-normal text-white/60 leading-snug">{sub}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── RIGHT: Form card ── */}
        <div className="w-full md:w-1/2 flex items-center justify-center px-6 py-8 md:py-8" style={{ background: "#f7f5f2" }}>
          <div className="bg-white w-[460px] px-8 py-5 rounded-[28px] shadow-xl">

            {/* Shield icon */}
            <div className="flex justify-center mb-3">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: "#FEF3DC", border: `1.5px solid ${GOLD}50` }}>
                <Shield size={22} color={BROWN} />
              </div>
            </div>

            {/* Title */}
            <div className="text-center mb-4">
              <h2 className="font-sans font-black uppercase text-4xl tracking-tight text-stone-900">
                {!show2FA ? (
                  <>Admin <span className="font-serif italic text-3xl text-[#C5A059] normal-case">Login</span></>
                ) : (
                  <>2FA <span className="font-serif italic text-3xl text-[#C5A059] normal-case">Security</span></>
                )}
              </h2>
              <p className="font-sans text-sm font-normal leading-relaxed text-stone-600 mt-1">
                {!show2FA ? "Sign in to access the admin dashboard" : "Two-factor verification stage"}
              </p>
            </div>

            {!show2FA && (
              <div className="mb-4">
                <button
                  type="button"
                  onClick={handleSecretKeyAutofill}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-dashed text-xs font-bold uppercase tracking-wider transition hover:bg-stone-50 active:scale-95"
                  style={{ borderColor: GOLD, color: BROWN, cursor: "pointer" }}
                >
                  <Lock size={12} />
                  <span>Autofill with Secret Key</span>
                </button>
              </div>
            )}

            {!show2FA ? (
              <form onSubmit={handleLogin} className="space-y-3">
                {/* Mobile */}
                <div>
                  <label className="font-sans text-[11px] font-extrabold uppercase tracking-widest block mb-2 text-[#C5A059]">
                    Mobile Number
                  </label>
                  <div className="flex border rounded-xl overflow-hidden" style={{ borderColor: "#E5E7EB" }}>
                    <div className="flex items-center gap-1 px-4 py-3.5 border-r bg-gray-50 shrink-0" style={{ borderColor: "#E5E7EB" }}>
                      <span className="font-sans text-sm font-normal text-stone-600">+91</span>
                      <ChevronDown size={13} className="text-gray-400" />
                    </div>
                    <input
                      type="tel"
                      maxLength={10}
                      autoFocus
                      placeholder="98765 43210"
                      value={mobile}
                      onChange={e => { setMobile(e.target.value.replace(/\D/g, "")); setError(""); }}
                      className="flex-1 px-4 py-3.5 font-sans text-sm font-normal outline-none bg-white text-stone-900"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="font-sans text-[11px] font-extrabold uppercase tracking-widest text-[#C5A059]">Password</label>
                    <button
                      type="button"
                      onClick={() => navigate("/forgot-password")}
                      className="font-sans text-[11px] font-extrabold uppercase tracking-widest text-[#C5A059] hover:text-[#3E362E] hover:underline bg-transparent border-none cursor-pointer select-none transition-colors duration-200"
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
                      className="flex-1 px-4 py-3.5 font-sans text-sm font-normal outline-none bg-white text-stone-900"
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

                {error && <p className="font-sans text-sm font-normal text-red-500 text-center">{error}</p>}
                {success && <p className="font-sans text-sm font-normal text-green-600 text-center">{success}</p>}

                {/* Access Dashboard button */}
                <button
                  type="submit"
                  disabled={loading || mobile.length !== 10 || !password}
                  className="w-full flex items-center justify-center gap-2 py-4 rounded-xl text-white font-sans text-xs font-extrabold uppercase tracking-wider transition disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ background: BROWN }}
                  onMouseEnter={e => { if (!e.currentTarget.disabled) e.currentTarget.style.background = BROWN_HOVER; }}
                  onMouseLeave={e => { e.currentTarget.style.background = BROWN; }}
                >
                  {loading ? "Signing in…" : <><span>Access Dashboard</span><ArrowRight size={16} /></>}
                </button>
              </form>
            ) : (
              <form onSubmit={handle2FAVerify} className="space-y-4">
                {/* OTP Code */}
                <div>
                  <label className="font-sans text-[11px] font-extrabold uppercase tracking-widest block mb-2 text-[#C5A059]">
                    Enter 6-Digit Verification Code
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    autoFocus
                    placeholder="123456"
                    value={otp}
                    onChange={e => { setOtp(e.target.value.replace(/\D/g, "")); setError(""); }}
                    className="w-full border rounded-xl px-4 py-3.5 font-sans text-sm font-normal outline-none bg-white text-stone-900 text-center tracking-[0.4em] text-lg font-black focus:ring-2 focus:ring-[#C5A059]"
                    style={{ borderColor: "#E5E7EB" }}
                  />
                  <p className="font-sans text-[10px] text-stone-400 mt-2 text-center">
                    Enter any 6-digit code to authorize access (e.g. 123456)
                  </p>
                </div>

                {error && <p className="font-sans text-sm font-normal text-red-500 text-center">{error}</p>}
                {success && <p className="font-sans text-sm font-normal text-green-600 text-center">{success}</p>}

                {/* Verify Code button */}
                <button
                  type="submit"
                  disabled={loading || otp.length !== 6}
                  className="w-full flex items-center justify-center gap-2 py-4 rounded-xl text-white font-sans text-xs font-extrabold uppercase tracking-wider transition disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ background: BROWN }}
                  onMouseEnter={e => { if (!e.currentTarget.disabled) e.currentTarget.style.background = BROWN_HOVER; }}
                  onMouseLeave={e => { e.currentTarget.style.background = BROWN; }}
                >
                  {loading ? "Verifying OTP…" : <><span>Verify & Access</span><ArrowRight size={16} /></>}
                </button>

                <button
                  type="button"
                  onClick={() => { setShow2FA(false); setOtp(""); setError(""); }}
                  className="w-full text-center font-sans text-xs font-extrabold uppercase tracking-wider text-stone-400 hover:text-[#C5A059] bg-transparent border-none cursor-pointer mt-1"
                >
                  Back to Login
                </button>
              </form>
            )}

            {/* Divider */}
            <div className="flex items-center gap-3 my-3">
              <div className="flex-1 h-px bg-gray-200" />
              <span className="font-sans text-[11px] font-extrabold uppercase tracking-widest text-stone-600">Need help?</span>
              <div className="flex-1 h-px bg-gray-200" />
            </div>

            {/* Help */}
            <p className="font-sans text-sm font-normal leading-relaxed text-stone-600 text-center mt-3">
              Need help?{" "}
              <Link
                to="/support"
                className="font-sans text-xs font-extrabold uppercase tracking-wider hover:underline cursor-pointer transition-all"
                style={{ color: GOLD }}
              >
                Contact Support
              </Link>
            </p>

            {/* Security note */}
            <div className="flex items-center justify-center gap-1.5 mt-3">
              <Shield size={12} className="text-gray-300" />
              <p className="font-sans text-[10px] font-normal text-gray-300 text-center">
                Secured with super-level authentication • Admins only
              </p>
            </div>
          </div>
        </div>
      </div>
  );
}