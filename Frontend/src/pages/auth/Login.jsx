import React, { useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import barberImage from "../../assets/login.jpg";
import { Scissors, User, Home, Shield, ArrowLeft, Phone, Lock, Eye, EyeOff } from "lucide-react";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const ROLES = [
  { key:"customer", label:"Customer",    desc:"Book & manage appointments", icon:User,     bg:"#FEF3E2", border:"#F5CFA0", color:"#C5A059" },
  { key:"owner",    label:"Salon Owner", desc:"Manage salon & barbers",     icon:Home,     bg:"#EFF6FF", border:"#BFDBFE", color:"#1D4ED8" },
  { key:"barber",   label:"Barber",      desc:"View queue & services",      icon:Scissors, bg:"#ECFDF5", border:"#A7F3D0", color:"#065F46" },
  { key:"admin",    label:"Admin",       desc:"Platform management",        icon:Shield,   bg:"#FEF2F2", border:"#FECACA", color:"#991B1B" },
];

const ScissorIcon = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round" className={className}
    style={{ transform:"rotate(180deg)" }}>
    <circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/>
    <line x1="20" y1="4" x2="8.12" y2="15.88"/>
    <line x1="14.47" y1="14.48" x2="20" y2="20"/>
    <line x1="8.12" y1="8.12" x2="12" y2="12"/>
  </svg>
);

/* ══ MOVED OUTSIDE COMPONENT — fixes focus loss issue ══ */
function MobilePasswordForm({ loginMob, setLoginMob, password, setPassword,
  showPass, setShowPass, loading, error, setError,
  onSubmit, btnLabel, hint, extraBtn, onBack }) {

  const labelCls = "block mb-2 text-[10px] font-black uppercase tracking-widest text-[#8D7B68] ml-1";
  const btnCls   = "w-full bg-[#3E362E] text-[#FFFBF2] py-5 rounded-2xl font-black tracking-[3px] hover:bg-[#2A241F] shadow-lg transition-all uppercase text-xs disabled:opacity-50 disabled:cursor-not-allowed";

  return (
    <>
      <button type="button" onClick={onBack}
        className="flex items-center gap-1 text-[10px] font-bold text-[#8D7B68] hover:text-[#C5A059] mb-6 transition uppercase tracking-widest">
        <ArrowLeft className="w-3.5 h-3.5"/> Back
      </button>

      <form onSubmit={onSubmit} className="space-y-5">
        {/* Mobile */}
        <div>
          <label className={labelCls}>Mobile Number</label>
          <div className="relative">
            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#C5A059]"/>
            <input
              type="tel"
              required
              maxLength="10"
              autoFocus
              autoComplete="tel"
              placeholder="Enter 10 digit mobile"
              value={loginMob}
              onChange={e => { setLoginMob(e.target.value.replace(/\D/g,"")); setError(""); }}
              className="w-full pl-12 pr-5 py-4 bg-[#FDF5E6] border border-[#EAD8C0] rounded-2xl text-[#3E362E] outline-none focus:border-[#C5A059] focus:bg-white transition-all shadow-sm text-base"
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <label className={labelCls}>Password</label>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#C5A059]"/>
            <input
              type={showPass ? "text" : "password"}
              required
              autoComplete="current-password"
              placeholder="Enter password"
              value={password}
              onChange={e => { setPassword(e.target.value); setError(""); }}
              className="w-full pl-12 pr-12 py-4 bg-[#FDF5E6] border border-[#EAD8C0] rounded-2xl text-[#3E362E] outline-none focus:border-[#C5A059] focus:bg-white transition-all shadow-sm text-base"
            />
            <button type="button" onClick={() => setShowPass(p => !p)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8D7B68] hover:text-[#C5A059] transition">
              {showPass ? <EyeOff className="w-4 h-4"/> : <Eye className="w-4 h-4"/>}
            </button>
          </div>
        </div>

        {/* Hint */}
        {hint && (
          <div className="bg-[#FEF3E2] border border-[#F5CFA0] rounded-2xl p-3 text-center">
            <p className="text-[10px] font-bold text-[#C5A059] uppercase tracking-widest mb-1">Test Credentials</p>
            <p className="text-xs text-[#3E362E] font-mono">{hint}</p>
          </div>
        )}

        {error && <p className="text-red-500 text-xs font-semibold text-center">{error}</p>}

        <button type="submit"
          disabled={loading || loginMob.length !== 10 || !password}
          className={btnCls}>
          {loading ? "Logging in..." : btnLabel}
        </button>

        {extraBtn}

        <button type="button" onClick={onBack}
          className="w-full py-2 text-[#8D7B68] text-[10px] font-bold tracking-widest uppercase hover:text-[#3E362E] transition">
          Back to Role Selection
        </button>
      </form>
    </>
  );
}

export default function Login() {
  const navigate = useNavigate();
  const [step,     setStep]    = useState("role");
  const [role,     setRole]    = useState(null);
  // Customer OTP
  const [mobile,   setMobile]  = useState("");
  const [email,    setEmail]   = useState("");
  const [otp,      setOtp]     = useState(["","","","","",""]);
  const [devOtp,   setDevOtp]  = useState("");
  // Other roles
  const [loginMob, setLoginMob]= useState("");
  const [password, setPassword]= useState("");
  const [showPass, setShowPass]= useState(false);
  const [loading,  setLoading] = useState(false);
  const [error,    setError]   = useState("");

  const reset = () => {
    setError(""); setPassword(""); setLoginMob("");
    setDevOtp(""); setOtp(["","","","","",""]);
    setMobile(""); setEmail(""); setShowPass(false);
  };

  const goBack = useCallback(() => { setStep("role"); reset(); }, []);

  const handleRole = (r) => {
    setRole(r); reset();
    setStep(r.key === "customer" ? "mobile" : "login");
  };

  /* ── Customer: Send OTP ── */
  const sendOtp = async (e) => {
    e?.preventDefault();
    if (mobile.length !== 10) { setError("Enter valid 10-digit mobile number"); return; }
    setLoading(true); setError("");
    try {
      const res  = await fetch(`${API}/auth/send-otp`, {
        method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({ mobile }),
      });
      const data = await res.json();
      if (data.success) { setStep("otp"); if (data.otp) setDevOtp(data.otp); }
      else setError(data.message || "Failed to send OTP");
    } catch { setError("Server error! Make sure backend is running."); }
    finally { setLoading(false); }
  };

  /* ── Customer: Verify OTP ── */
  const verifyOtp = async () => {
    const otpStr = otp.join("");
    if (otpStr.length !== 6) { setError("Enter complete 6-digit OTP"); return; }
    setLoading(true); setError("");
    try {
      const res  = await fetch(`${API}/auth/verify-otp`, {
        method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({ mobile, otp: otpStr }),
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem("token",  data.token);
        localStorage.setItem("userId", data.user?._id || "");
        localStorage.setItem("role",   "customer");
        navigate("/customerprofile");
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

  /* ── Owner Login ── */
  const ownerLogin = async (e) => {
    e.preventDefault();
    setLoading(true); setError("");
    try {
      const res  = await fetch(`${API}/auth/owner/login`, {
        method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({ mobile: loginMob, password }),
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem("token",   data.token);
        localStorage.setItem("salonId", data.salon?._id || "");
        localStorage.setItem("role",    "owner");
        navigate("/owner/dashboard");
      } else setError(data.message || "Login failed");
    } catch { setError("Server error!"); }
    finally { setLoading(false); }
  };

  /* ── Barber Login ── */
  const barberLogin = async (e) => {
    e.preventDefault();
    setLoading(true); setError("");
    try {
      const res  = await fetch(`${API}/auth/barber/login`, {
        method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({ mobile: loginMob, password }),
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem("token",    data.token);
        localStorage.setItem("barberId", data.barber?._id || "");
        localStorage.setItem("role",     "barber");
        navigate("/barber/dashboard");
      } else setError(data.message || "Invalid credentials");
    } catch { setError("Server error!"); }
    finally { setLoading(false); }
  };

  /* ── Admin Login ── */
  const adminLogin = async (e) => {
    e.preventDefault();
    setLoading(true); setError("");
    try {
      const res  = await fetch(`${API}/auth/admin/login/mobile`, {
        method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({ mobile: loginMob, password }),
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("role",  "admin");
        navigate("/admin/requests");
      } else setError(data.message || "Invalid credentials");
    } catch { setError("Server error!"); }
    finally { setLoading(false); }
  };

  const labelCls = "block mb-2 text-[10px] font-black uppercase tracking-widest text-[#8D7B68] ml-1";
  const btnCls   = "w-full bg-[#3E362E] text-[#FFFBF2] py-5 rounded-2xl font-black tracking-[3px] hover:bg-[#2A241F] shadow-lg transition-all uppercase text-xs disabled:opacity-50 disabled:cursor-not-allowed";
  const backBtn  = "flex items-center gap-1 text-[10px] font-bold text-[#8D7B68] hover:text-[#C5A059] mb-6 transition uppercase tracking-widest";

  const sharedProps = { loginMob, setLoginMob, password, setPassword, showPass, setShowPass, loading, error, setError, onBack: goBack };

  return (
    <div className="min-h-screen grid md:grid-cols-2 bg-[#FFFBF2] font-sans">

      {/* ── LEFT IMAGE ── */}
      <div className="hidden md:flex relative bg-cover bg-center overflow-hidden"
        style={{ backgroundImage:`url(${barberImage})` }}>
        <div className="absolute inset-0 bg-[#3E362E]/20"/>
        <div className="absolute inset-0 bg-gradient-to-t from-[#FFFBF2] via-transparent to-[#3E362E]/10"/>
        <div className="absolute top-8 left-8 z-10 flex flex-col items-start">
          <h1 className="text-2xl font-black text-[#C5A059] tracking-[0.2em] uppercase flex items-center gap-2">
            <ScissorIcon className="w-6 h-6 text-[#3E362E] fill-[#C5A059] stroke-[#C5A059] stroke-[1px]"/>
            Barber <span className="text-[#3E362E]">Pro</span>
          </h1>
          <div className="h-[2px] w-full bg-[#C5A059] mt-1 opacity-40"/>
          <p className="text-[9px] text-[#8D7B68] tracking-[0.4em] uppercase mt-1 text-center w-full">Est. 2026</p>
        </div>
        <div className="relative z-10 flex items-end w-full p-12">
          <div className="w-full max-w-lg bg-[#FFFBF2]/70 backdrop-blur-xl rounded-[2.5rem] p-10 border border-[#EAD8C0] shadow-2xl">
            <h2 className="text-4xl font-extrabold text-[#3E362E] leading-tight uppercase tracking-tighter mb-4">
              Look Sharp.<br/>
              <span className="text-transparent" style={{WebkitTextStroke:"1px #3E362E"}}>Feel Confident.</span>
            </h2>
            <p className="text-[#8D7B68] italic border-l-2 border-[#C5A059] pl-4 text-sm">
              Skip the queue. Book your luxury grooming experience in seconds.
            </p>
          </div>
        </div>
      </div>

      {/* ── RIGHT FORM ── */}
      <div className="bg-[#FFFBF2] flex items-center justify-center px-6 py-10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#C5A059]/10 rounded-full blur-[120px]"/>
        <div className="w-full max-w-md z-10">

          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-block p-4 rounded-3xl bg-[#C5A059]/10 border border-[#C5A059]/20 mb-5 shadow-sm">
              <ScissorIcon className="w-10 h-10 text-[#C5A059]"/>
            </div>
            <h2 className="text-4xl font-serif font-bold text-[#3E362E] tracking-tight">
              {step === "role"         ? "Welcome Back"   :
               step === "mobile"       ? "Customer Login" :
               step === "otp"         ? "Verify OTP"     :
               role?.key === "owner"  ? "Owner Login"    :
               role?.key === "barber" ? "Barber Login"   : "Admin Login"}
            </h2>
            <p className="text-[#C5A059] mt-2 tracking-[0.3em] uppercase text-[10px] font-bold">
              {step === "role"   ? "Choose your role to continue" :
               step === "mobile" ? "Enter mobile to receive OTP"  :
               step === "otp"   ? `Code sent to +91 ${mobile}`    :
               "Mobile number & password"}
            </p>
          </div>

          {/* ══ ROLE SELECTION ══ */}
          {step === "role" && (
            <>
              <div className="grid grid-cols-2 gap-3 mb-6">
                {ROLES.map(r => {
                  const Icon = r.icon;
                  return (
                    <button key={r.key} onClick={() => handleRole(r)}
                      className="group p-5 rounded-2xl border-2 text-left transition-all hover:-translate-y-1 hover:shadow-lg active:scale-95"
                      style={{ background:r.bg, borderColor:r.border }}>
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-3 transition-transform group-hover:scale-110"
                        style={{ background:`${r.color}20`, color:r.color }}>
                        <Icon className="w-5 h-5"/>
                      </div>
                      <p className="font-black text-[#3E362E] text-sm mb-0.5">{r.label}</p>
                      <p className="text-[10px] leading-relaxed" style={{ color:r.color }}>{r.desc}</p>
                    </button>
                  );
                })}
              </div>
              <p className="text-[#8D7B68] text-[11px] font-bold uppercase tracking-widest text-center">
                Don't have an account?{" "}
                <Link to="/signup" className="text-[#C5A059] font-bold hover:underline underline-offset-4">
                  Create Profile
                </Link>
              </p>
            </>
          )}

          {/* ══ CUSTOMER: Enter Mobile ══ */}
          {step === "mobile" && (
            <>
              <button onClick={() => { setStep("role"); reset(); }} className={backBtn}>
                <ArrowLeft className="w-3.5 h-3.5"/> Back
              </button>
              <form onSubmit={sendOtp} className="space-y-5">
                <div>
                  <label className={labelCls}>Mobile Number</label>
                  <div className="relative">
                    <span className="absolute left-5 top-1/2 -translate-y-1/2 text-[#C5A059] font-bold text-sm">+91</span>
                    <input
                      type="tel" required maxLength="10" autoFocus autoComplete="tel"
                      placeholder="Enter 10 digit number"
                      value={mobile}
                      onChange={e => { setMobile(e.target.value.replace(/\D/g,"")); setError(""); }}
                      className="w-full pl-16 pr-5 py-4 bg-[#FDF5E6] border border-[#EAD8C0] rounded-2xl text-[#3E362E] text-lg outline-none focus:border-[#C5A059] focus:bg-white transition-all shadow-sm"
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2 px-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-[#8D7B68]">Email</label>
                    <span className="text-[9px] text-[#C5A059]/60 font-bold uppercase italic">Optional</span>
                  </div>
                  <input
                    type="email" placeholder="name@example.com" autoComplete="email"
                    value={email} onChange={e => setEmail(e.target.value)}
                    className="w-full px-5 py-4 bg-[#FDF5E6] border border-[#EAD8C0] rounded-2xl text-[#3E362E] outline-none focus:border-[#C5A059] focus:bg-white transition-all shadow-sm"
                  />
                </div>
                {error && <p className="text-red-500 text-xs font-semibold text-center">{error}</p>}
                <button type="submit" disabled={loading || mobile.length !== 10} className={btnCls}>
                  {loading ? "Sending OTP..." : "GET OTP"}
                </button>
                <div className="flex items-center gap-4 pt-1">
                  <div className="h-[1px] flex-1 bg-[#EAD8C0]"/>
                  <span className="text-[9px] text-[#A4907C] uppercase font-bold tracking-[0.3em]">Or</span>
                  <div className="h-[1px] flex-1 bg-[#EAD8C0]"/>
                </div>
                <button type="button"
                  className="w-full py-4 bg-white border border-[#EAD8C0] rounded-2xl flex items-center justify-center gap-3 text-[#3E362E] text-[10px] font-black tracking-[0.2em] uppercase hover:bg-gray-50 transition shadow-sm">
                  <img src="https://www.svgrepo.com/show/475656/google.svg" className="w-4 h-4" alt="google"/>
                  Continue with Google
                </button>
                <button type="button" onClick={() => { setStep("role"); reset(); }}
                  className="w-full py-2 text-[#8D7B68] text-[10px] font-bold tracking-widest uppercase hover:text-[#3E362E] transition">
                  Back to Role Selection
                </button>
              </form>
            </>
          )}

          {/* ══ CUSTOMER: OTP Verify ══ */}
          {step === "otp" && (
            <>
              <button onClick={() => { setStep("mobile"); reset(); }} className={backBtn}>
                <ArrowLeft className="w-3.5 h-3.5"/> Back
              </button>
              {devOtp && (
                <div className="mb-5 p-4 bg-blue-50 border border-blue-200 rounded-2xl text-center">
                  <p className="text-[10px] font-bold text-blue-500 uppercase tracking-widest mb-1">Your OTP (Dev Mode)</p>
                  <p className="text-3xl font-black text-blue-700 tracking-[0.4em]">{devOtp}</p>
                  <p className="text-[9px] text-blue-400 mt-1">Enter this OTP below</p>
                </div>
              )}
              <div className="flex justify-between gap-2 mb-6">
                {otp.map((d,i) => (
                  <input key={i} type="tel" inputMode="numeric" maxLength="1" value={d}
                    onChange={e => handleOtpChange(e.target, i)}
                    onKeyDown={e => handleOtpKey(e, i)}
                    onFocus={e => e.target.select()}
                    className="w-full h-16 bg-[#FDF5E6] border-2 rounded-2xl text-center text-2xl font-black text-[#C5A059] outline-none focus:bg-white transition-all shadow-sm"
                    style={{ borderColor: d ? "#C5A059" : "#EAD8C0" }}/>
                ))}
              </div>
              {error && <p className="text-red-500 text-xs font-semibold text-center mb-4">{error}</p>}
              <div className="space-y-3">
                <button onClick={verifyOtp} disabled={loading || otp.join("").length !== 6} className={btnCls}>
                  {loading ? "Verifying..." : "VERIFY & PROCEED"}
                </button>
                <button onClick={sendOtp} disabled={loading}
                  className="w-full py-2 text-[#C5A059] text-[10px] font-bold tracking-widest uppercase hover:underline transition">
                  Resend OTP
                </button>
                <button onClick={() => { setStep("mobile"); reset(); }}
                  className="w-full py-2 text-[#8D7B68] text-[10px] font-bold tracking-widest uppercase hover:text-[#3E362E] transition">
                  Back to Login
                </button>
              </div>
            </>
          )}

          {/* ══ OWNER LOGIN ══ */}
          {step === "login" && role?.key === "owner" && (
            <MobilePasswordForm
              {...sharedProps}
              onSubmit={ownerLogin}
              btnLabel="LOGIN AS OWNER"
              hint="9999999999  |  Owner@123"
              extraBtn={
                <button type="button" onClick={() => navigate("/register-salon")}
                  className="w-full py-3 border-2 border-[#EADDCA] text-[#3E362E] rounded-2xl text-[10px] font-black tracking-widest uppercase hover:border-[#C5A059] hover:text-[#C5A059] transition">
                  Register New Salon Instead
                </button>
              }
            />
          )}

          {/* ══ BARBER LOGIN ══ */}
          {step === "login" && role?.key === "barber" && (
            <MobilePasswordForm
              {...sharedProps}
              onSubmit={barberLogin}
              btnLabel="LOGIN AS BARBER"
              hint="9876543210  |  Barber@123"
            />
          )}

          {/* ══ ADMIN LOGIN ══ */}
          {step === "login" && role?.key === "admin" && (
            <MobilePasswordForm
              {...sharedProps}
              onSubmit={adminLogin}
              btnLabel="LOGIN AS ADMIN"
              hint="9000000000  |  Admin@123"
            />
          )}

          <p className="text-center mt-8 text-[#A4907C] text-[9px] tracking-[0.2em] uppercase leading-relaxed">
            By continuing, you agree to our<br/>
            <span className="text-[#3E362E] font-bold">Terms of Service & Privacy Policy</span>
          </p>
        </div>
      </div>
    </div>
  );
}