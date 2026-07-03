import { useState, useEffect } from "react";
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
  const [googleInfo, setGoogleInfo] = useState(null);
  const [googleMobile, setGoogleMobile] = useState("");
  const [loading, setLoading]= useState(false);
  const [error,   setError]  = useState("");

  const reset = () => {
    setError(""); setDevOtp(""); setOtp(["", "", "", "", "", ""]);
    setMobile(""); setGoogleMobile(""); setGoogleInfo(null);
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

  /* ── Google login flow ── */
  const handleGoogleCredentialResponse = async (response) => {
    setLoading(true); setError("");
    try {
      const res = await fetch(`${API}/auth/google-login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: response.credential }),
      });
      const data = await res.json();
      if (!data.success) {
        throw new Error(data.message || "Google login failed");
      }

      if (data.needsMobile) {
        setGoogleInfo({
          token: response.credential,
          email: data.email,
          name: data.name,
          picture: data.picture,
        });
        setStep("google-mobile");
      } else {
        localStorage.setItem("token",  data.token);
        localStorage.setItem("userId", data.user?._id || "");
        localStorage.setItem("role",   "customer");
        localStorage.setItem("name",   data.user?.name || "Customer");
        localStorage.setItem("email",  data.user?.email || "");
        localStorage.setItem("mobile", data.user?.mobile || "");
        if (data.user?.name) {
          localStorage.setItem("userName", data.user.name);
        }

        const from = location.state?.from;
        if (from) {
          navigate(from.pathname + (from.search || ""), { state: from.state, replace: true });
        } else {
          navigate("/customer/services");
        }
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleMobileSubmit = async (e) => {
    e.preventDefault();
    if (googleMobile.length !== 10) { setError("Enter valid 10-digit mobile number"); return; }
    setLoading(true); setError("");
    try {
      const res = await fetch(`${API}/auth/google-login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: googleInfo.token, mobile: googleMobile }),
      });
      const data = await res.json();
      if (!data.success) {
        throw new Error(data.message || "Google signup failed");
      }
      localStorage.setItem("token",  data.token);
      localStorage.setItem("userId", data.user?._id || "");
      localStorage.setItem("role",   "customer");
      localStorage.setItem("name",   data.user?.name || "Customer");
      localStorage.setItem("email",  data.user?.email || "");
      localStorage.setItem("mobile", data.user?.mobile || googleMobile);
      if (data.user?.name) {
        localStorage.setItem("userName", data.user.name);
      }

      const from = location.state?.from;
      if (from) {
        navigate(from.pathname + (from.search || ""), { state: from.state, replace: true });
      } else {
        navigate("/customer/services");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let cancelled = false;
    const initGoogle = async () => {
      try {
        const res = await fetch(`${API}/auth/config`);
        const data = await res.json();
        if (!cancelled && data.success && data.googleClientId && window.google) {
          // Guard: only initialize once per page load to prevent GSI_LOGGER warning
          if (!window.__googleGsiInitialized) {
            window.google.accounts.id.initialize({
              client_id: data.googleClientId,
              callback: handleGoogleCredentialResponse,
            });
            window.__googleGsiInitialized = true;
          }
          const btnParent = document.getElementById("google-signin-btn");
          if (btnParent) {
            window.google.accounts.id.renderButton(btnParent, {
              theme: "outline",
              size: "large",
              width: btnParent.offsetWidth || 320,
              text: "continue_with",
            });
          }
        }
      } catch (err) {
        console.error("Failed to initialize Google Sign-in:", err);
      }
    };
    if (step === "mobile") {
      setTimeout(initGoogle, 150);
    }
    return () => { cancelled = true; };
  }, [step]);


  const handleOtpChange = (el, idx) => {
    if (isNaN(el.value)) return;
    const n = [...otp]; n[idx] = el.value; setOtp(n); setError("");
    if (el.value && el.nextSibling) el.nextSibling.focus();
  };
  const handleOtpKey = (e, idx) => {
    if (e.key === "Backspace" && !otp[idx] && idx > 0) e.target.previousSibling?.focus();
  };

  return (
    <div className="w-full min-h-screen bg-[#f7f5f2] flex flex-col md:flex-row relative">

        {/* ── LEFT: Customer Hero ── */}
        <div className="w-full md:w-1/2 h-[220px] sm:h-[280px] md:h-screen md:sticky md:top-0 relative flex flex-col justify-between overflow-hidden">
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
          <div className="relative z-10 px-6 md:px-10 pb-5 md:pb-8 flex-1 flex flex-col justify-end md:justify-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl xl:text-7xl font-serif font-bold leading-none">
              <span style={{ color: GOLD }}>CUSTOMER</span>
              {" "}
              <span className="text-white md:block">PORTAL</span>
            </h1>
            <div className="w-12 md:w-16 h-0.5 md:h-1 mt-2 md:mt-5" style={{ background: GOLD }} />
            <p className="text-white/80 text-[10px] md:text-base mt-2 md:mt-5 leading-relaxed max-w-xs italic hidden sm:block">
              Book your grooming session, track your queue and manage your appointments with ease.
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

        {/* ── RIGHT: Form card ── */}
        <div className="w-full md:w-1/2 flex items-center justify-center px-4 sm:px-6 py-8 md:py-8" style={{ background: "#f7f5f2" }}>
          <div className="bg-white w-full max-w-[460px] px-6 sm:px-8 py-5 rounded-[28px] shadow-xl">

            {/* Scissors icon */}
            <div className="flex justify-center mb-3">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: "#FEF3DC", border: `1.5px solid ${GOLD}50` }}>
                <Scissors size={22} color={BROWN} />
              </div>
            </div>

            {/* Title */}
            <div className="text-center mb-4">
              <h2 className="text-2xl font-serif font-semibold text-gray-900">
                {step === "mobile" ? "Customer Login " : step === "google-mobile" ? "Complete Profile 👤" : "Verify OTP 🔑"}
              </h2>
              <p className="text-gray-400 text-xs mt-1">
                {step === "mobile"
                  ? "Enter your mobile to receive a one-time password"
                  : step === "google-mobile"
                  ? "Finish setting up your Google login"
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
                <div className="w-full flex justify-center py-1">
                  <div id="google-signin-btn" style={{ minHeight: 40, width: "100%", maxWidth: 320 }}></div>
                </div>

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

            {/* ══ STEP: Complete Google Profile ══ */}
            {step === "google-mobile" && (
              <form onSubmit={handleGoogleMobileSubmit} className="space-y-4">
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
                      required
                      type="tel"
                      maxLength={10}
                      placeholder="98765 43210"
                      value={googleMobile}
                      onChange={e => setGoogleMobile(e.target.value.replace(/\D/g, "").slice(0, 10))}
                      className="flex-1 px-4 py-3.5 outline-none text-sm font-semibold bg-white text-stone-800"
                    />
                  </div>
                </div>

                {error && <p className="text-red-500 text-xs font-medium text-center">{error}</p>}

                <button
                  type="submit"
                  disabled={loading || googleMobile.length !== 10}
                  className="w-full flex items-center justify-center gap-2 py-4 rounded-xl text-white font-semibold text-sm transition disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ background: BROWN }}
                  onMouseEnter={e => { if (!e.currentTarget.disabled) e.currentTarget.style.background = BROWN_HOVER; }}
                  onMouseLeave={e => { e.currentTarget.style.background = BROWN; }}
                >
                  {loading ? "Completing Setup…" : <><span>Verify & Sign In</span><ArrowRight size={16} /></>}
                </button>
                
                <button
                  type="button"
                  onClick={() => { setStep("mobile"); reset(); }}
                  className="w-full text-center text-xs text-stone-500 hover:text-stone-700 underline cursor-pointer mt-1"
                >
                  Cancel
                </button>
              </form>
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
  );
}
