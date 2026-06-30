import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Scissors, User, Mail, Phone, Lock,
  ChevronDown, Eye, EyeOff, ArrowRight, Shield, UserPlus,
} from "lucide-react";
import signupImage from "../../assets/signup.png";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const GOLD        = "#C5A059";
const BROWN       = "#8B6B3E";
const BROWN_HOVER = "#735A32";

const FEATURES = [
  { icon: UserPlus, title: "FREE SIGNUP",  sub: "No charges ever" },
  { icon: Phone,    title: "OTP LOGIN",    sub: "Passwordless entry" },
  { icon: Scissors, title: "BOOK FAST",    sub: "Instant booking" },
  { icon: Shield,   title: "SECURE",       sub: "Your data is safe" },
];

export default function Signup() {
  const navigate = useNavigate();
  const [fullName,     setFullName]     = useState("");
  const [email,        setEmail]        = useState("");
  const [mobile,       setMobile]       = useState("");
  const [password,     setPassword]     = useState("");
  const [showPwd,      setShowPwd]      = useState(false);
  const [emailError,   setEmailError]   = useState("");
  const [mobileError,  setMobileError]  = useState("");
  const [loading,      setLoading]      = useState(false);
  const [error,        setError]        = useState("");
  const [success,      setSuccess]      = useState("");

  const validateEmail = (value) => {
    setEmail(value);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (value.trim() !== "" && !emailRegex.test(value)) {
      setEmailError("Invalid email format");
    } else {
      setEmailError("");
    }
  };

  const handleMobileChange = (e) => {
    const value = e.target.value.replace(/\D/g, "");
    setMobile(value);
    if (value.length > 0 && value.length < 10) {
      setMobileError("Enter 10 digits");
    } else {
      setMobileError("");
    }
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (mobile.length !== 10) { setMobileError("10-digit number required"); return; }
    if (emailError) return;
    if (!password)  { setError("Enter a password"); return; }
    setLoading(true); setError(""); setSuccess("");
    try {
      const res  = await fetch(`${API}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: fullName, email, mobile, password }),
      });
      const data = await res.json();
      if (data.success) {
        setSuccess("Account created! Redirecting to login…");
        setTimeout(() => navigate("/login"), 1200);
      } else {
        setError(data.message || "Registration failed. Try again.");
      }
    } catch {
      setError("Backend is not responding. Make sure your server is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#111] flex flex-col md:flex-row w-full">
      <div className="w-full min-h-screen bg-white flex flex-col md:flex-row">

        {/* ── LEFT: Hero Panel ── */}
        <div className="w-full md:w-1/2 h-[220px] sm:h-[280px] md:h-screen relative flex flex-col justify-between overflow-hidden">
          <img src={signupImage} alt="Barber" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/55" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60" />

          {/* Logo */}
          <div className="relative z-10 p-6 xl:p-10 pt-6 xl:pt-12">
            <div className="flex items-center gap-3">
              <Scissors size={20} className="xl:w-[26px] xl:h-[26px]" color={GOLD} strokeWidth={2} />
              <div>
                <div className="text-white font-bold tracking-[0.25em] text-xs xl:text-sm uppercase">Barber Pro</div>
                <div className="text-white/60 text-[8px] xl:text-[10px] tracking-[0.35em] uppercase mt-0.5">— Est. 2026 —</div>
              </div>
            </div>
          </div>

          {/* Headline */}
          <div className="relative z-10 px-6 md:px-10 pb-5 md:pb-8 flex-1 flex flex-col justify-end md:justify-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl xl:text-7xl font-serif font-bold leading-none">
              <span style={{ color: GOLD }}>JOIN</span>
              {" "}
              <span className="text-white md:block">US TODAY</span>
            </h1>
            <div className="w-12 md:w-16 h-0.5 md:h-1 mt-2 md:mt-5" style={{ background: GOLD }} />
            <p className="text-white/80 text-[10px] md:text-base mt-2 md:mt-5 leading-relaxed max-w-xs italic hidden sm:block">
              Create your free account and start booking premium grooming sessions in seconds.
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
                <span className="text-[9px] font-bold tracking-wider text-white uppercase leading-snug">{title}</span>
                <span className="text-[9px] text-white/60 leading-snug">{sub}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── RIGHT: Form Card ── */}
        <div className="w-full md:w-1/2 flex items-center justify-center px-4 sm:px-6 py-8 md:py-8" style={{ background: "#f7f5f2" }}>
          <div className="bg-white w-full max-w-[460px] px-6 sm:px-8 py-5 rounded-[28px] shadow-xl">

            {/* Icon */}
            <div className="flex justify-center mb-3">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{ background: "#FEF3DC", border: `1.5px solid ${GOLD}50` }}
              >
                <UserPlus size={22} color={BROWN} />
              </div>
            </div>

            {/* Title */}
            <div className="text-center mb-4">
              <h2 className="text-2xl font-serif font-semibold text-gray-900">
                Create Account 
              </h2>
              <p className="text-gray-400 text-xs mt-1">Sign up to start booking your grooming sessions</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">

              {/* Full Name */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-widest mb-2 text-gray-600">
                  Full Name <span className="text-red-500 font-bold">*</span>
                </label>
                <div className="flex border rounded-xl overflow-hidden" style={{ borderColor: "#E5E7EB" }}>
                  <div className="flex items-center px-4 border-r bg-gray-50" style={{ borderColor: "#E5E7EB" }}>
                    <User size={15} className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    required
                    autoFocus
                    placeholder="e.g. Rahul Sharma"
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                    className="flex-1 px-4 py-3.5 text-sm outline-none bg-white text-gray-800"
                  />
                </div>
              </div>

              {/* Mobile */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-[11px] font-bold uppercase tracking-widest text-gray-600">
                    Mobile Number <span className="text-red-500 font-bold">*</span>
                  </label>
                  {mobileError && (
                    <span className="text-[10px] text-red-500 font-semibold">{mobileError}</span>
                  )}
                </div>
                <div className="flex border rounded-xl overflow-hidden" style={{ borderColor: mobileError ? "#EF4444" : "#E5E7EB" }}>
                  <div
                    className="flex items-center gap-1 px-4 py-3.5 border-r bg-gray-50 text-sm font-semibold text-gray-700 shrink-0"
                    style={{ borderColor: mobileError ? "#EF4444" : "#E5E7EB" }}
                  >
                    <span>+91</span>
                    <ChevronDown size={13} className="text-gray-400" />
                  </div>
                  <input
                    type="tel"
                    maxLength={10}
                    placeholder="98765 43210"
                    value={mobile}
                    onChange={handleMobileChange}
                    className="flex-1 px-4 py-3.5 text-sm outline-none bg-white text-gray-800"
                  />
                </div>
              </div>

              {/* Email (optional) */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-[11px] font-bold uppercase tracking-widest text-gray-600">
                    Email Address
                  </label>
                  {emailError ? (
                    <span className="text-[10px] text-red-500 font-semibold">{emailError}</span>
                  ) : (
                    <span className="text-[10px] text-gray-400 italic">Optional</span>
                  )}
                </div>
                <div
                  className="flex border rounded-xl overflow-hidden"
                  style={{ borderColor: emailError ? "#EF4444" : "#E5E7EB" }}
                >
                  <div className="flex items-center px-4 border-r bg-gray-50" style={{ borderColor: emailError ? "#EF4444" : "#E5E7EB" }}>
                    <Mail size={15} className="text-gray-400" />
                  </div>
                  <input
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={e => validateEmail(e.target.value)}
                    className="flex-1 px-4 py-3.5 text-sm outline-none bg-white text-gray-800"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-widest mb-2 text-gray-600">
                  Password <span className="text-red-500 font-bold">*</span>
                </label>
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

              {error   && <p className="text-red-500 text-xs font-medium text-center">{error}</p>}
              {success && <p className="text-green-600 text-xs font-medium text-center">{success}</p>}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading || !fullName || mobile.length !== 10 || !password || !!emailError}
                className="w-full flex items-center justify-center gap-2 py-4 rounded-xl text-white font-semibold text-sm transition disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ background: BROWN }}
                onMouseEnter={e => { if (!e.currentTarget.disabled) e.currentTarget.style.background = BROWN_HOVER; }}
                onMouseLeave={e => { e.currentTarget.style.background = BROWN; }}
              >
                {loading ? "Creating Account…" : <><span>Create My Account</span><ArrowRight size={16} /></>}
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-3 my-3">
              <div className="flex-1 h-px bg-gray-200" />
              <span className="text-xs text-gray-400 uppercase tracking-widest">Have an account?</span>
              <div className="flex-1 h-px bg-gray-200" />
            </div>

            {/* Sign in link */}
            <Link
              to="/login"
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border text-sm font-semibold text-gray-700 hover:bg-gray-50 transition"
              style={{ borderColor: "#E5E7EB" }}
            >
              Sign In Instead
            </Link>

            {/* Help */}
            <p className="text-center text-xs text-gray-400 mt-3">
              Need help?{" "}
              <a href="mailto:support@barberpro.in" className="font-semibold hover:underline" style={{ color: GOLD }}>
                Contact Support
              </a>
            </p>

            {/* Security note */}
            <div className="flex items-center justify-center gap-1.5 mt-2">
              <Shield size={12} className="text-gray-300" />
              <p className="text-[10px] text-gray-300 text-center">
                Your data is encrypted and never shared
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
