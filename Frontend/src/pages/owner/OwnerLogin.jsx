import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Phone,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Store,
  Shield,
  PlusCircle,
} from "lucide-react";
import shopImage from "../../assets/shop.jpg";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const ScissorIcon = ({ className }) => (
  <svg viewBox="0 0 24 24" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M6 15C7.65685 15 9 13.6569 9 12C9 11.3321 8.7818 10.715 8.4121 10.2148L11.5 12L14.5879 13.7852C14.2182 14.285 14 14.9019 14 15.5645C14 17.2213 15.3431 18.5645 17 18.5645C18.6569 18.5645 20 17.2213 20 15.5645C20 14.2964 19.2155 13.2117 18.102 12.7751L15.3 11.1574L18.102 9.53974C19.2155 9.10313 20 8.01844 20 6.75032C20 5.09347 18.6569 3.75032 17 3.75032C15.3431 3.75032 14 5.09347 14 6.75032C14 7.41292 14.2182 8.02983 14.5879 8.52959L11.5 10.3148L8.4121 8.5322C8.7818 8.03198 9 7.41492 9 6.74731C9 5.09046 7.65685 3.74731 6 3.74731C4.34315 3.74731 3 5.09046 3 6.74731C3 8.40417 4.34315 9.74731 6 9.74731C6.66508 9.74731 7.2798 9.53039 7.7788 9.16335L10.8667 10.9485L7.7788 12.7337C7.2798 12.3667 6.66508 12.1497 6 12.1497C4.34315 12.1497 3 13.4929 3 15.1497C3 16.8066 4.34315 18.1497 6 18.1497V15Z" />
  </svg>
);

function OwnerLogin() {
  const navigate = useNavigate();

  const [mobile,      setMobile]      = useState("");
  const [password,    setPassword]    = useState("");
  const [showPass,    setShowPass]    = useState(false);
  const [keepSigned,  setKeepSigned]  = useState(false);
  const [loading,     setLoading]     = useState(false);
  const [error,       setError]       = useState("");

  /* ── Submit ── */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (mobile.length !== 10) { setError("Enter a valid 10-digit mobile number."); return; }
    if (!password)             { setError("Password is required."); return; }

    setLoading(true);
    setError("");

    try {
      const res  = await fetch(`${API}/auth/owner/login`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ mobile, password }),
      });
      const data = await res.json();

      if (data.success) {
        localStorage.setItem("token",   data.token);
        localStorage.setItem("salonId", data.salon?._id || "s1");
        localStorage.setItem("role",    "owner");
        navigate("/owner/dashboard");
      } else {
        setError(data.message || "Invalid credentials. Please try again.");
      }
    } catch {
      setError("Server error. Make sure the backend is running.");
    } finally {
      setLoading(false);
    }
  };

  /* ── Shared styles ── */
  const fieldWrap = (hasError) =>
    `h-[46px] bg-white border rounded-[14px] px-4 flex items-center gap-2 transition-all
     ${hasError ? "border-red-400 focus-within:border-red-500" : "border-[#e9dfd1] focus-within:border-[#c59b49]"}`;

  const inputCls = "flex-1 bg-transparent outline-none text-[13px] text-[#1a1612] placeholder:text-gray-400";

  return (
    <div className="min-h-screen grid md:grid-cols-2 bg-[#FFFBF2]">

      {/* ── MOBILE LOGO ── */}
      <div className="md:hidden flex flex-col items-center pt-10 pb-2">
        <h1 className="text-xl font-black text-[#C5A059] tracking-[0.2em] uppercase flex items-center gap-2">
          <ScissorIcon className="w-5 h-5 fill-[#C5A059]" />
          Barber <span className="text-[#3E362E]">Pro</span>
        </h1>
        <div className="h-[1.5px] w-32 bg-[#C5A059] mt-1 opacity-50" />
        <p className="text-[8px] text-[#8D7B68] tracking-[0.3em] uppercase mt-1">Est. 2026</p>
      </div>

      {/* ── LEFT — hero image ── */}
      <div
        className="hidden md:flex relative bg-cover bg-center"
        style={{ backgroundImage: `url(${shopImage})` }}
      >
        <div className="absolute inset-0 bg-[#3E362E]/50 backdrop-blur-[1px]" />

        {/* Logo */}
        <div className="absolute top-8 left-8 z-10 flex flex-col items-start">
          <h1 className="text-2xl font-black text-[#C5A059] tracking-[0.2em] uppercase leading-none flex items-center gap-2">
            <ScissorIcon className="w-6 h-6 fill-[#C5A059]" />
            Barber <span className="text-white">Pro</span>
          </h1>
          <div className="h-[2px] w-full bg-[#C5A059] mt-1 opacity-70" />
          <p className="text-[10px] text-gray-200 tracking-[0.4em] uppercase mt-1 text-center w-full">
            Est. 2026
          </p>
        </div>

        {/* Hero text */}
        <div className="relative z-10 flex flex-col justify-end p-12 w-full pb-20">
          <h1 className="text-[#C5A059] text-6xl font-black tracking-tighter uppercase leading-none">
            Salon <br />
            <span className="text-white">Owner</span>
          </h1>
          <div className="h-[2px] w-24 bg-[#C5A059] my-4" />
          <p className="text-gray-100 max-w-xs border-l-2 border-[#C5A059] pl-4 italic font-medium">
            Manage your salon, staff, bookings and revenue — all from one
            powerful dashboard.
          </p>

          {/* Feature pills */}
          <div className="flex flex-wrap gap-2 mt-6">
            {["Live Queue", "Staff Control", "Analytics", "Billing"].map(f => (
              <span key={f}
                className="px-3 py-1 bg-white/10 border border-white/20 rounded-full text-[10px] font-bold text-white uppercase tracking-widest backdrop-blur-sm">
                {f}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── RIGHT — login card ── */}
      <div className="bg-[#f8f4ee] flex items-center justify-center px-2 py-6 lg:px-4">
        <div className="w-full max-w-[560px] bg-white border border-[#eadfce] rounded-[24px] shadow-[0_6px_24px_rgba(0,0,0,0.05)] px-5 py-6 sm:px-6 lg:px-8 lg:py-8">

          {/* Top icon */}
          <div className="flex justify-center mb-6">
            <div className="w-12 h-12 rounded-[18px] bg-[#f6f0e6] flex items-center justify-center shadow-inner border border-[#eee2cf]">
              <Store className="w-5 h-5 text-[#c59b49]" />
            </div>
          </div>

          {/* Heading */}
          <div className="text-center mb-6">
            <h2 className="text-[26px] font-black text-[#1f1a14] leading-none">
              Owner Login 🏪
            </h2>
            <p className="text-[#8f8374] text-[13px] mt-3">
              Sign in to manage your salon
            </p>
          </div>

          {/* Test credentials hint */}
          <div className="mb-5 p-3 bg-[#FDF5E6] border border-[#EAD8C0] rounded-2xl text-center">
            <p className="text-[9px] font-black text-[#C5A059] uppercase tracking-widest mb-0.5">
              Test Credentials
            </p>
            <p className="text-[11px] text-[#3E362E] font-mono">
              9999999999 &nbsp;|&nbsp; Owner@123
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Mobile */}
            <div>
              <label className="block text-[10px] font-black uppercase tracking-[0.16em] text-[#1d1813] mb-2">
                Mobile Number
              </label>
              <div className={fieldWrap(error && mobile.length !== 10)}>
                <Phone className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <span className="text-[#C5A059] font-bold text-sm">+91</span>
                <input
                  type="tel"
                  maxLength={10}
                  autoFocus
                  autoComplete="tel"
                  placeholder="98XXXXXXXX"
                  value={mobile}
                  onChange={e => { setMobile(e.target.value.replace(/\D/g, "")); setError(""); }}
                  className={inputCls}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-[10px] font-black uppercase tracking-[0.16em] text-[#1d1813]">
                  Password
                </label>
                <button type="button"
                  className="text-[#c59b49] font-bold text-[11px] hover:underline">
                  Forgot password?
                </button>
              </div>
              <div className={fieldWrap(false)}>
                <Lock className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <input
                  type={showPass ? "text" : "password"}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  value={password}
                  onChange={e => { setPassword(e.target.value); setError(""); }}
                  className={inputCls}
                />
                <button type="button" onClick={() => setShowPass(p => !p)}
                  className="flex-shrink-0 text-gray-400 hover:text-[#c59b49] transition-colors">
                  {showPass
                    ? <Eye className="w-4 h-4" />
                    : <EyeOff className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Keep signed in */}
            <label className="flex items-center gap-2 cursor-pointer pt-1">
              <input
                type="checkbox"
                checked={keepSigned}
                onChange={e => setKeepSigned(e.target.checked)}
                className="w-3.5 h-3.5 rounded border-gray-300 accent-[#1f1a14]"
              />
              <span className="text-[12px] text-[#52493e]">Keep me signed in</span>
            </label>

            {/* Error */}
            {error && (
              <p className="text-red-500 text-[11px] font-bold text-center bg-red-50 border border-red-200 rounded-xl py-2 px-3">
                {error}
              </p>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading || mobile.length !== 10 || !password}
              className="w-full h-[48px] rounded-[14px] bg-[#2a211b] hover:bg-[#1f1813] text-white text-[14px] font-black transition-all flex items-center justify-center gap-2 shadow-[0_10px_20px_rgba(0,0,0,0.12)] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Signing in…" : "Access Dashboard"}
              {!loading && <ArrowRight className="w-4 h-4" />}
            </button>

            {/* Divider */}
            <div className="relative py-1">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#eadfce]" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-white px-4 text-[10px] font-bold text-[#a08f7d] uppercase">
                  New here?
                </span>
              </div>
            </div>

            {/* Register CTA */}
            <Link
              to="/register-salon"
              className="w-full h-[48px] rounded-[14px] border border-[#e9dfd1] bg-white hover:bg-[#faf6ef] text-[#2e241d] text-[13px] font-bold transition-all flex items-center justify-center gap-2"
            >
              <PlusCircle className="w-4 h-4 text-[#c59b49]" />
              Register Your Salon
            </Link>
          </form>

          {/* Footer */}
          <div className="text-center mt-6 space-y-2">
            <p className="text-[#9f9383] text-[11px]">
              Need help?{" "}
              <span className="text-[#c59b49] font-black cursor-pointer hover:underline">
                Contact Support
              </span>
            </p>
            <p className="flex items-center justify-center gap-1 text-[10px] text-[#b3a89a]">
              <Shield className="w-3 h-3" />
              Secured with salon-level authentication • Owners only
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OwnerLogin;
