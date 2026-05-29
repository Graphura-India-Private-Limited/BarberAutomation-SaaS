import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  KeyRound, ShieldCheck, Lock, Phone, Mail, ArrowLeft, 
  CheckCircle2, AlertTriangle, Eye, EyeOff, RefreshCw
} from "lucide-react";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";

const GOLD = "#C5A059";
const CHARCOAL = "#3E362E";

export default function ForgotPassword() {
  const navigate = useNavigate();

  /* ── Flow Steps ── */
  // 1: Identity Input | 2: OTP Verification | 3: New Password Reset | 4: Success
  const [step, setStep] = useState(1);

  /* ── Form States ── */
  const [method, setMethod] = useState("phone"); // "phone" | "email"
  const [inputValue, setInputValue] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  /* ── UI Interactivity States ── */
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [timer, setTimer] = useState(30);

  const inputStyle = "w-full bg-white border border-[#EADBCE] rounded-2xl p-4 outline-none text-[#3E362E] placeholder-stone-400 focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059] transition-all text-sm font-bold shadow-3xs";

  /* ── Countdown Timer Simulation for OTP ── */
  const startOtpTimer = () => {
    setTimer(30);
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  /* ── Step 1: Dispatch Identity verification Request ── */
  const handleIdentifyAccount = async (e) => {
    e.preventDefault();
    if (!inputValue.trim()) {
      setError(`Please enter a valid verified account ${method}.`);
      return;
    }
    setLoading(true);
    setError("");

    try {
      // Simulate backend validation stream check
      await new Promise(resolve => setTimeout(resolve, 1000));
      setStep(2);
      startOtpTimer();
    } catch {
      setError("Identity target missing in CRM registry records.");
    } finally {
      setLoading(false);
    }
  };

  /* ── Step 2: Verify Single-Use Security Hash (OTP) ── */
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    const enteredOtp = otp.join("");
    if (enteredOtp.length < 6) {
      setError("Please input the complete 6-digit security sequence code.");
      return;
    }
    setLoading(true);
    setError("");

    try {
      // Simulate cryptographic pin validation handshake
      await new Promise(resolve => setTimeout(resolve, 1000));
      setStep(3);
    } catch {
      setError("Invalid security authentication hash token submitted.");
    } finally {
      setLoading(false);
    }
  };

  /* ── Step 3: Save New Encrypted Password Configuration ── */
  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (password.length < 6) {
      setError("Security parameter mismatch. Password must hold at least 6 metrics.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Confirmation sequence mismatch. Passwords do not cross-match.");
      return;
    }
    setLoading(true);
    setError("");

    try {
      // Simulate sending update package payload over database streams
      await new Promise(resolve => setTimeout(resolve, 1200));
      setStep(4);
      setTimeout(() => navigate("/login"), 3000);
    } catch {
      setError("System database write sync failure. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  /* ── Helper: Manage Multi-Input OTP Target Traversal ── */
  const handleOtpChange = (element, index) => {
    if (isNaN(element.value)) return false;
    const nextOtp = [...otp];
    nextOtp[index] = element.value;
    setOtp(nextOtp);
    setError("");

    if (element.nextSibling && element.value !== "") {
      element.nextSibling.focus();
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF6F0] font-sans text-stone-800 antialiased flex flex-col justify-between relative overflow-x-hidden">
      
      {/* --- SHINY LUXURY GRADIENT GLOW LAYERS --- */}
      <div className="absolute top-40 -left-40 w-[600px] h-[600px] bg-gradient-to-br from-[#C5A059]/10 via-[#EADDCA]/20 to-transparent rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-40 w-[600px] h-[600px] bg-[#EADDCA]/20 rounded-full blur-[120px] pointer-events-none" />

      <div>
        {/* ── GLOBAL NAVBAR HEADER ── */}
        <Navbar />

        {/* ── BACK ACTION SAFETY NAVIGATION CAPSULE CHIP ── */}
        <div className="w-full max-w-7xl mx-auto px-6 pt-6 relative z-50 flex justify-start">
          <button 
            type="button"
            onClick={() => navigate(-1)} 
            className="flex items-center gap-2 text-xs font-black tracking-widest uppercase transition-all duration-300 hover:opacity-80 group text-[#3E362E] bg-white/90 backdrop-blur-md px-4 py-2.5 rounded-full border border-[#EADBCE] shadow-md cursor-pointer select-none"
          >
            <ArrowLeft size={14} className="transition-transform group-hover:-translate-x-1 text-[#C5A059]" />
            <span>Back to Login</span>
          </button>
        </div>

        {/* ── CRITICAL RECOVERY VIEW SHELL CONTAINER ── */}
        <main className="w-full max-w-md mx-auto px-4 py-12 relative z-10">
          <div className="bg-white/90 backdrop-blur-md rounded-[2.5rem] p-6 sm:p-10 border border-[#EADBCE] shadow-[0_20px_50px_-12px_rgba(44,24,16,0.1)] text-left">
            
            {/* Upper Structural Visual Icon Frame Component */}
            <div className="flex justify-center mb-6">
              <div className="bg-[#FAF6E9] p-4.5 rounded-2xl border border-[#F2EDE0] shadow-3xs text-[#C5A059]">
                {step === 1 && <KeyRound size={26} strokeWidth={1.5} />}
                {step === 2 && <ShieldCheck size={26} strokeWidth={1.5} />}
                {step === 3 && <Lock size={26} strokeWidth={1.5} />}
                {step === 4 && <CheckCircle2 size={26} className="text-emerald-600" />}
              </div>
            </div>

            {/* Headers Titles dynamic map */}
            <div className="text-center mb-8">
              <h2 className="font-serif text-2xl font-black text-stone-900 tracking-tight">
                {step === 1 && "Recover Access"}
                {step === 2 && "Verification Code"}
                {step === 3 && "Secure Core Reset"}
                {step === 4 && "Access Rebuilt!"}
              </h2>
              <p className="text-[9px] font-black uppercase tracking-[0.25em] text-[#A68942] mt-1">
                {step === 1 && "Identity Verification Parameters"}
                {step === 2 && "OTP Single-Use Authentication"}
                {step === 3 && "Establish New Profile Signature"}
                {step === 4 && "Database Sync Complete"}
              </p>
            </div>

            {/* ── STEP 1: IDENTITY RECOVERY DISCOVERY ROUTER ── */}
            {step === 1 && (
              <form onSubmit={handleIdentifyAccount} className="space-y-5">
                {/* Embedded Inline Tab Vectors Selection Track switcher */}
                <div className="grid grid-cols-2 p-1 bg-stone-100 rounded-2xl border border-stone-200/40 mb-2">
                  <button type="button" onClick={() => { setMethod("phone"); setInputValue(""); setError(""); }}
                    className={`py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer ${method === "phone" ? "bg-[#3E362E] text-white shadow-3xs" : "text-stone-500 hover:text-stone-900"}`}>
                    Mobile Number
                  </button>
                  <button type="button" onClick={() => { setMethod("email"); setInputValue(""); setError(""); }}
                    className={`py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer ${method === "email" ? "bg-[#3E362E] text-white shadow-3xs" : "text-stone-500 hover:text-stone-900"}`}>
                    Email Registry
                  </button>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-wider text-stone-400 ml-0.5 flex items-center gap-1">
                    {method === "phone" ? <Phone size={10} color={GOLD} /> : <Mail size={10} color={GOLD} />}
                    {method === "phone" ? "Registered Mobile Number" : "Registered Email Account"}
                  </label>
                  {method === "phone" ? (
                    <div className="relative flex">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-stone-400 font-mono">+91</span>
                      <input type="tel" required placeholder="98765 43210" value={inputValue} maxLength={10} onChange={e => setInputValue(e.target.value.replace(/\D/g, ""))} className={`${inputStyle} pl-16 font-mono tracking-wide`} />
                    </div>
                  ) : (
                    <input type="email" required placeholder="barber@example.com" value={inputValue} onChange={e => setInputValue(e.target.value)} className={inputStyle} />
                  )}
                </div>

                {error && <ErrorBlock msg={error} />}

                <button type="submit" disabled={loading} className="w-full h-14 rounded-2xl text-xs font-black uppercase tracking-widest text-white transition-all shadow-md cursor-pointer active:scale-98" style={{ backgroundColor: CHARCOAL }}>
                  {loading ? "Verifying..." : "Dispatch Secure OTP"}
                </button>
              </form>
            )}

            {/* ── STEP 2: VERIFY CODE TRANSIT MATRIX ── */}
            {step === 2 && (
              <form onSubmit={handleVerifyOtp} className="space-y-6">
                <p className="text-xs font-medium text-stone-500 text-center leading-relaxed max-w-xs mx-auto">
                  We sent a 6-digit security signature token code to your registered verification endpoint destination.
                </p>

                <div className="flex justify-between gap-2 max-w-sm mx-auto">
                  {otp.map((data, index) => (
                    <input
                      key={index}
                      type="text"
                      maxLength="1"
                      value={data}
                      onChange={e => handleOtpChange(e.target, index)}
                      onFocus={e => e.target.select()}
                      className="w-11 h-13 bg-white border border-[#EADBCE] text-center rounded-xl text-lg font-black text-stone-900 font-mono outline-none focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059] transition-all shadow-3xs"
                    />
                  ))}
                </div>

                {error && <ErrorBlock msg={error} />}

                <div className="space-y-3">
                  <button type="submit" disabled={loading} className="w-full h-14 rounded-2xl text-xs font-black uppercase tracking-widest text-white transition-all shadow-md cursor-pointer active:scale-98" style={{ backgroundColor: CHARCOAL }}>
                    {loading ? "Authenticating..." : "Validate Token Code"}
                  </button>

                  <div className="text-center">
                    {timer > 0 ? (
                      <p className="text-[10px] text-stone-400 font-mono font-bold uppercase tracking-wider">Resend payload loop locks for: {timer}s</p>
                    ) : (
                      <button type="button" onClick={startOtpTimer} className="text-[10px] font-black uppercase tracking-widest text-[#C5A059] hover:underline flex items-center gap-1 mx-auto cursor-pointer">
                        <RefreshCw size={10} /> Request New SMS Token
                      </button>
                    )}
                  </div>
                </div>
              </form>
            )}

            {/* ── STEP 3: ESTABLISH CHAIR LOCK PASSWORD CREATION ── */}
            {step === 3 && (
              <form onSubmit={handleResetPassword} className="space-y-4">
                <div className="space-y-1.5 relative">
                  <label className="text-[10px] font-black uppercase tracking-wider text-stone-400 ml-0.5 block">Create New Password</label>
                  <input type={showPass ? "text" : "password"} required placeholder="Minimum 6 characters" value={password} onChange={e => setPassword(e.target.value)} className={inputClassStyle(inputStyle)} />
                  <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-9 text-stone-400 hover:text-stone-700">
                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-wider text-stone-400 ml-0.5 block">Confirm Password Key</label>
                  <input type="password" required placeholder="Re-enter security passphrase" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className={inputStyle} />
                </div>

                {error && <ErrorBlock msg={error} />}

                <button type="submit" disabled={loading} className="w-full h-14 rounded-2xl text-xs font-black uppercase tracking-widest text-white transition-all shadow-md cursor-pointer active:scale-98 pt-1" style={{ backgroundColor: CHARCOAL }}>
                  {loading ? "Saving System Rules..." : "Rebuild Account Password"}
                </button>
              </form>
            )}

            {/* ── STEP 4: SUCCESS SYSTEM DISPATCH CONFIRMATION ── */}
            {step === 4 && (
              <div className="text-center py-4 space-y-3 animate-in zoom-in-95 duration-200">
                <p className="text-sm font-medium text-stone-600 leading-relaxed">
                  Your biometric credential sync has been verified successfully. Password records updated.
                </p>
                <div className="text-stone-400 text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 bg-stone-50 py-2.5 border border-stone-200/50 rounded-xl animate-pulse">
                  <span>Routing to terminal authentication desk...</span>
                </div>
              </div>
            )}

          </div>
        </main>
      </div>

      {/* ── GLOBAL BRAND FOOTER MODULE ── */}
      <Footer />

    </div>
  );
}

/* ── REUSABLE HELPER SUB-COMPONENTS ATOMS ── */
function ErrorBlock({ msg }) {
  return (
    <div className="p-3 bg-rose-50 border border-rose-100 rounded-xl flex items-center gap-2 text-rose-700 text-xs font-bold animate-in fade-in duration-200">
      <AlertTriangle size={14} className="shrink-0" />
      <span>{msg}</span>
    </div>
  );
}

function inputClassStyle(base) {
  return `${base} pr-12`;
}