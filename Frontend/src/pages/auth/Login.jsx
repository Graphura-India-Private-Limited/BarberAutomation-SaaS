import { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import {
  Scissors, Calendar, Clock, Star, Sparkles,
  ChevronDown, ArrowRight, Shield, ArrowLeft,
} from "lucide-react";
import barberImage from "../../assets/login.jpg";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const GOLD        = "#C5A059";
const BROWN       = "#8B6B3E";
const BROWN_HOVER = "#735A32";

const FEATURES = [
  { icon: Calendar,  title: "EASY BOOKING",  sub: "Book in seconds" },
  { icon: Clock,     title: "LIVE QUEUE",    sub: "Real-time status" },
  { icon: Star,      title: "REVIEWS",       sub: "Rate your barber" },
  { icon: Sparkles,  title: "OFFERS",        sub: "Exclusive deals" },
];

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const [step,    setStep]   = useState("mobile");
  const [mobile,  setMobile] = useState("");
  const [otp,     setOtp]    = useState(["", "", "", "", "", ""]);
  const [devOtp,  setDevOtp] = useState("");
  const [loading, setLoading]= useState(false);
  const [error,   setError]  = useState("");

  const reset = () => {
    setError(""); setDevOtp(""); setOtp(["", "", "", "", "", ""]);
    setMobile("");
  };

  /* ── Send OTP ── */
  const sendOtp = async (e) => {
    e?.preventDefault();
    if (mobile.length !== 10) { setError("Enter valid 10-digit mobile number"); return; }
    setLoading(true); setError("");
    try {
      const res  = await fetch(`${API}/auth/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobile }),
      });
      const data = await res.json();
      if (data.success) { setStep("otp"); if (data.otp) setDevOtp(data.otp); }
      else setError(data.message || "Failed to send OTP");
    } catch { setError("Server error! Make sure backend is running."); }
    finally { setLoading(false); }
  };

  /* ── Verify OTP ── */
  const verifyOtp = async () => {
    const otpStr = otp.join("");
    if (otpStr.length !== 6) { setError("Enter complete 6-digit OTP"); return; }
    setLoading(true); setError("");
    try {
      const res  = await fetch(`${API}/auth/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobile, otp: otpStr }),
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem("token",  data.token);
        localStorage.setItem("userId", data.user?._id || "");
        localStorage.setItem("role",   "customer");
        localStorage.setItem("name",   data.user?.name || "Customer");
        localStorage.setItem("email",  data.user?.email || "");
        localStorage.setItem("mobile", data.user?.mobile || mobile || "");

        if (data.user?.name) {
          localStorage.setItem("userName", data.user.name);
        }

        const from = location.state?.from;
        if (from) {
          navigate(from.pathname + (from.search || ""), { state: from.state, replace: true });
        } else {
          navigate("/customer/services");
        }
      } else setError(data.message || "Invalid OTP");
    } catch { setError("Server error!"); }
    finally { setLoading(false); }
  };

  const handleOtpChange = (el, idx) => {
    if (isNaN(el.value)) return;
    const n = [...otp]; n[idx] = el.value; setOtp(n); setError("");
    if (el.value && el.nextSibling) el.nextSibling.focus();
  };
  const handleOtpKey = (e, idx) => {
    if (e.key === "Backspace" && !otp[idx] && idx > 0) e.target.previousSibling?.focus();
  };

  return (
    <div className="min-h-screen bg-[#111] flex flex-col xl:flex-row w-full">
      <div className="w-full min-h-screen bg-white flex flex-col xl:flex-row">

        {/* ── LEFT: Customer Hero ── */}
        <div className="w-full xl:w-1/2 h-[220px] sm:h-[280px] md:h-[360px] lg:h-[400px] xl:h-screen relative flex flex-col justify-between overflow-hidden">
          <img src={barberImage} alt="Barber" className="absolute inset-0 w-full h-full object-cover" />
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
          <div className="relative z-10 px-6 xl:px-10 pb-5 xl:pb-8 flex-1 flex flex-col justify-end xl:justify-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl xl:text-7xl font-serif font-bold leading-none">
              <span style={{ color: GOLD }}>CUSTOMER</span>
              {" "}
              <span className="text-white xl:block">PORTAL</span>
            </h1>
            <div className="w-12 xl:w-16 h-0.5 xl:h-1 mt-2 xl:mt-5" style={{ background: GOLD }} />
            <p className="text-white/80 text-[10px] xl:text-base mt-2 xl:mt-5 leading-relaxed max-w-xs italic hidden sm:block">
              Book your grooming session, track your queue and manage your appointments with ease.
            </p>
          </div>

          {/* Feature icons */}
          <div className="relative z-10 px-10 pb-10 hidden xl:grid grid-cols-4 gap-3">
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
        <div className="w-full xl:w-1/2 flex items-center justify-center px-4 sm:px-6 py-8 xl:py-8" style={{ background: "#f7f5f2" }}>
          <div className="bg-white w-full max-w-[460px] md:max-w-[640px] xl:max-w-[460px] px-6 sm:px-8 py-5 rounded-[28px] shadow-xl">

            {/* Scissors icon */}
            <div className="flex justify-center mb-3">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: "#FEF3DC", border: `1.5px solid ${GOLD}50` }}>
                <Scissors size={22} color={BROWN} />
              </div>
            </div>

            {/* Title */}
            <div className="text-center mb-4">
              <h2 className="text-2xl font-serif font-semibold text-gray-900">
                {step === "mobile" ? "Customer Login " : "Verify OTP 🔑"}
              </h2>
              <p className="text-gray-400 text-xs mt-1">
                {step === "mobile"
                  ? "Enter your mobile to receive a one-time password"
                  : `Code sent to +91 ${mobile}`}
              </p>
            </div>

            {/* ══ STEP: Enter Mobile ══ */}
            {step === "mobile" && (
              <form onSubmit={sendOtp} className="space-y-3">
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
                  <div className="flex justify-end mt-2">
                    <button
                      type="button"
                      onClick={() => navigate("/forgot-password")}
                      className="text-[10px] font-black uppercase tracking-widest text-[#C5A059] hover:text-[#3E362E] hover:underline bg-transparent border-none cursor-pointer select-none transition-colors duration-200"
                    >
                      Forgot Password?
                    </button>
                  </div>
                </div>

                {error && <p className="text-red-500 text-xs font-medium text-center">{error}</p>}

                {/* Send OTP button */}
                <button
                  type="submit"
                  disabled={loading || mobile.length !== 10}
                  className="w-full flex items-center justify-center gap-2 py-4 rounded-xl text-white font-semibold text-sm transition disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ background: BROWN }}
                  onMouseEnter={e => { if (!e.currentTarget.disabled) e.currentTarget.style.background = BROWN_HOVER; }}
                  onMouseLeave={e => { e.currentTarget.style.background = BROWN; }}
                >
                  {loading ? "Sending OTP…" : <><span>Get OTP</span><ArrowRight size={16} /></>}
                </button>

                {/* Divider */}
                <div className="flex items-center gap-3 my-1">
                  <div className="flex-1 h-px bg-gray-200" />
                  <span className="text-xs text-gray-400 uppercase tracking-widest">Or</span>
                  <div className="flex-1 h-px bg-gray-200" />
                </div>

                {/* Google login */}
                <button
                  type="button"
                  onClick={() => setError("Google login coming soon! Please use mobile OTP.")}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border text-sm font-semibold text-gray-700 hover:bg-gray-50 transition relative"
                  style={{ borderColor: "#E5E7EB" }}
                >
                  <svg width="18" height="18" viewBox="0 0 48 48">
                    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.31-8.16 2.31-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
                    <path fill="none" d="M0 0h48v48H0z"/>
                  </svg>
                  Continue with Google
                  <span className="absolute -top-2 -right-2 bg-[#C5A059] text-white text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest">
                    Soon
                  </span>
                </button>

                {/* Divider */}
                <div className="flex items-center gap-3 my-1">
                  <div className="flex-1 h-px bg-gray-200" />
                  <span className="text-xs text-gray-400 uppercase tracking-widest">New here?</span>
                  <div className="flex-1 h-px bg-gray-200" />
                </div>

                {/* Sign up link */}
                <Link
                  to="/signup"
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border text-sm font-semibold text-gray-700 hover:bg-gray-50 transition"
                  style={{ borderColor: "#E5E7EB" }}
                >
                  Create an Account
                </Link>
              </form>
            )}

            {/* ══ STEP: OTP Verify ══ */}
            {step === "otp" && (
              <div className="space-y-3">
                <button
                  onClick={() => { setStep("mobile"); reset(); }}
                  className="flex items-center gap-1 text-[11px] font-bold text-gray-400 hover:text-gray-600 mb-1 transition uppercase tracking-widest"
                >
                  <ArrowLeft size={13} /> Back
                </button>

                {devOtp && (
                  <div
                    className="rounded-xl px-4 py-2.5 flex items-center justify-between"
                    style={{ background: "#FEF9EE", border: `1px solid ${GOLD}40` }}
                  >
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: GOLD }}>
                        Your OTP (Dev Mode)
                      </p>
                      <p className="text-xl font-bold tracking-[0.3em] text-gray-800">{devOtp}</p>
                    </div>
                  </div>
                )}

                {/* OTP boxes */}
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-widest mb-3 text-gray-600">
                    Enter 6-digit OTP
                  </label>
                  <div className="flex justify-between gap-2">
                    {otp.map((d, i) => (
                      <input
                        key={i}
                        type="tel"
                        inputMode="numeric"
                        maxLength="1"
                        value={d}
                        onChange={e => handleOtpChange(e.target, i)}
                        onKeyDown={e => handleOtpKey(e, i)}
                        onFocus={e => e.target.select()}
                        className="w-full h-14 border-2 rounded-xl text-center text-xl font-bold outline-none transition"
                        style={{
                          borderColor: d ? GOLD : "#E5E7EB",
                          color: d ? BROWN : "#9CA3AF",
                          background: d ? "#FEF9EE" : "white",
                        }}
                      />
                    ))}
                  </div>
                </div>

                {error && <p className="text-red-500 text-xs font-medium text-center">{error}</p>}

                {/* Verify button */}
                <button
                  onClick={verifyOtp}
                  disabled={loading || otp.join("").length !== 6}
                  className="w-full flex items-center justify-center gap-2 py-4 rounded-xl text-white font-semibold text-sm transition disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ background: BROWN }}
                  onMouseEnter={e => { if (!e.currentTarget.disabled) e.currentTarget.style.background = BROWN_HOVER; }}
                  onMouseLeave={e => { e.currentTarget.style.background = BROWN; }}
                >
                  {loading ? "Verifying…" : <><span>Verify & Continue</span><ArrowRight size={16} /></>}
                </button>

                {/* Resend */}
                <button
                  onClick={sendOtp}
                  disabled={loading}
                  className="w-full py-2 text-xs font-semibold hover:underline transition"
                  style={{ color: GOLD }}
                >
                  Resend OTP
                </button>
              </div>
            )}

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
                Secured with OTP authentication • Customers only
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
