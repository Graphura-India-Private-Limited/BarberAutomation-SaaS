import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import barberImage from "../../assets/login.jpg";
import { ArrowLeft } from "lucide-react";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

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

export default function Login() {
  const navigate = useNavigate();
  // We changed the default step to "mobile" so it skips role selection entirely!
  const [step,     setStep]    = useState("mobile"); 
  
  const [mobile,   setMobile]  = useState("");
  const [email,    setEmail]   = useState("");
  const [otp,      setOtp]     = useState(["","","","","",""]);
  const [devOtp,   setDevOtp]  = useState("");
  const [loading,  setLoading] = useState(false);
  const [error,    setError]   = useState("");

  const reset = () => {
    setError(""); setDevOtp(""); setOtp(["","","","","",""]);
    setMobile(""); setEmail("");
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

  const labelCls = "block mb-2 text-[10px] font-black uppercase tracking-widest text-[#8D7B68] ml-1";
  const btnCls   = "w-full bg-[#3E362E] text-[#FFFBF2] py-5 rounded-2xl font-black tracking-[3px] hover:bg-[#2A241F] shadow-lg transition-all uppercase text-xs disabled:opacity-50 disabled:cursor-not-allowed";

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
              {step === "mobile" ? "Customer Login" : "Verify OTP"}
            </h2>
            <p className="text-[#C5A059] mt-2 tracking-[0.3em] uppercase text-[10px] font-bold">
              {step === "mobile" ? "Enter mobile to receive OTP" : `Code sent to +91 ${mobile}`}
            </p>
          </div>

          {/* ══ CUSTOMER: Enter Mobile ══ */}
          {step === "mobile" && (
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

              {/* Moved the Create Profile link here so it's always visible */}
              <p className="text-[#8D7B68] text-[11px] font-bold uppercase tracking-widest text-center mt-6">
                Don't have an account?{" "}
                <Link to="/signup" className="text-[#C5A059] font-bold hover:underline underline-offset-4">
                  Create Profile
                </Link>
              </p>
            </form>
          )}

          {/* ══ CUSTOMER: OTP Verify ══ */}
          {step === "otp" && (
            <>
              <button onClick={() => { setStep("mobile"); reset(); }} className="flex items-center gap-1 text-[10px] font-bold text-[#8D7B68] hover:text-[#C5A059] mb-6 transition uppercase tracking-widest">
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
              </div>
            </>
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