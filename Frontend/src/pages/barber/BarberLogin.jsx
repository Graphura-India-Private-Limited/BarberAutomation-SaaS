import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const DEMO = { mobile: "9876543210", password: "Barber@123" };

const ScissorIcon = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/>
    <line x1="20" y1="4" x2="8.12" y2="15.88"/>
    <line x1="14.47" y1="14.48" x2="20" y2="20"/>
    <line x1="8.12" y1="8.12" x2="12" y2="12"/>
  </svg>
);

export default function BarberLogin() {
  const navigate  = useNavigate();
  const [mobile,  setMobile]   = useState("");
  const [password,setPassword] = useState("");
  const [loading, setLoading]  = useState(false);
  const [error,   setError]    = useState("");
  const [success, setSuccess]  = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    if (mobile.length !== 10) { setError("Enter valid 10-digit mobile"); return; }
    if (!password) { setError("Enter password"); return; }
    setLoading(true); setError(""); setSuccess("");
    try {
      const res  = await fetch(`${API}/auth/barber/login`, {
        method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({ mobile, password }),
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem("token",    data.token);
        localStorage.setItem("role",     "barber");
        localStorage.setItem("barberId", data.barber?._id || "");
        localStorage.setItem("barberName", data.barber?.name || "");
        localStorage.setItem("salonId",  data.barber?.salon_id?._id || "");
        setSuccess("Login successful! Redirecting to dashboard...");
        setTimeout(() => navigate("/barber/dashboard"), 1200);
      } else setError(data.message || "Login failed");
    } catch { setError("Server error! Make sure backend is running."); }
    finally { setLoading(false); }
  };

  const fillDemo = () => { setMobile(DEMO.mobile); setPassword(DEMO.password); setError(""); };

  const inp = "w-full px-5 py-3.5 bg-white border border-stone-200 rounded-xl text-[#3E362E] font-semibold outline-none focus:border-[#C5A059] text-sm transition-all shadow-3xs placeholder-stone-400";
  const btn = "w-full bg-[#3E362E] text-white py-4 rounded-xl font-black tracking-[0.2em] hover:bg-[#2A241F] shadow-md transition-all uppercase text-xs cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 active:scale-[0.99]";

  return (
    <div className="min-h-screen bg-[#FAF6F0] font-sans antialiased flex w-full overflow-hidden">
      
      {/* 📸 LEFT SIDE: PREMIUM VISUAL ACCENT PANEL */}
      <div className="hidden lg:flex lg:w-5/12 bg-[#3E362E] p-12 flex-col justify-between relative overflow-hidden border-r border-stone-200/20 shadow-2xl">
        
        {/* Background Image Layer */}
        <div className="absolute inset-0 z-0 select-none pointer-events-none">
          <img 
            src="https://images.unsplash.com/photo-1503951914875-452162b0f3f1?q=80&w=1200" 
            alt="Premium Barber Studio" 
            className="w-full h-full object-cover" 
          />
          {/* Deep professional vignette mask */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/25 to-black/75 mix-blend-multiply" />
        </div>

        {/* Decorative background flares */}
        <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-[#C5A059]/15 blur-3xl pointer-events-none z-10" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full bg-[#A37B58]/15 blur-3xl pointer-events-none z-10" />

        {/* Back Button positioned cleanly inside the panel */}
        <button 
          type="button"
          onClick={() => navigate("/")} 
          className="flex items-center gap-2 text-[10px] font-black text-stone-300 hover:text-white uppercase tracking-widest transition cursor-pointer bg-transparent border-none relative z-20"
        >
          <ArrowLeft className="w-3.5 h-3.5 stroke-[2.5px]"/> Back to Home
        </button>

        {/* Branding Catchphrase */}
        <div className="relative z-20 text-left max-w-sm drop-shadow-[0_4px_12px_rgba(0,0,0,0.6)]">
          <h2 className="text-3xl font-serif text-white font-medium leading-tight mb-3 italic">
            Crafting Executive Profiles Daily.
          </h2>
          <p className="text-xs text-stone-200 leading-relaxed font-semibold">
            Log in to manage your workstation live pipeline queue, claim break intervals, and track appointment reservation logs.
          </p>
        </div>

        {/* Footer info label */}
        <p className="text-[9px] text-stone-400 uppercase tracking-widest relative z-20 font-black text-left drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
          Graphura India Private Limited
        </p>
      </div>

      {/* 📄 RIGHT SIDE: CENTERED CORE LOGIN CARD */}
      <div className="w-full lg:w-7/12 flex items-center justify-center p-6 sm:p-12 md:p-20 bg-[#FAF6F0]">
        
        {/* Matte Bone Cream Card Wrapper */}
        <div className="w-full max-w-md bg-[#F4EFE6]/60 border border-stone-200/40 rounded-[2.5rem] p-8 md:p-10 shadow-sm text-left">

          {/* Mobile Back Button (Only shows when left banner hides on small screens) */}
          <button 
            type="button"
            onClick={() => navigate("/")} 
            className="flex lg:hidden items-center gap-2 text-[10px] font-black text-stone-400 hover:text-[#3E362E] mb-6 uppercase tracking-widest transition cursor-pointer bg-transparent border-none"
          >
            <ArrowLeft className="w-3.5 h-3.5 stroke-[2.5px]"/> Back to Home
          </button>

          {/* Header Branding Section */}
          <div className="text-center md:text-left mb-6 flex flex-col items-center md:items-start">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[#3E362E]/5 border border-[#C5A059]/20 mb-4">
              <ScissorIcon className="w-6 h-6 text-[#A37B58]"/>
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight text-stone-900 uppercase">Barber Login</h2>
            <p className="text-xs font-black uppercase tracking-widest text-[#A37B58] mt-1">Staff Portal Entry</p>
          </div>

          {/* Demo Box */}
          <div className="bg-[#FAF6F0] border border-stone-200/60 rounded-xl p-4 mb-6">
            <p className="text-[10px] font-black text-[#A37B58] uppercase tracking-widest mb-2.5">Demo Credentials</p>
            <div className="flex justify-between items-center gap-4">
              <div className="space-y-0.5">
                <p className="text-xs text-stone-600 font-semibold">Mobile: <span className="font-extrabold text-stone-900">{DEMO.mobile}</span></p>
                <p className="text-xs text-stone-600 font-semibold">Password: <span className="font-extrabold text-stone-900">{DEMO.password}</span></p>
              </div>
              <button 
                type="button"
                onClick={fillDemo}
                className="text-[10px] font-black text-white bg-[#A37B58] hover:bg-[#8F6947] px-4 py-2.5 rounded-lg uppercase tracking-wider transition shadow-3xs cursor-pointer"
              >
                Use Demo
              </button>
            </div>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block mb-2 text-[10px] font-black uppercase tracking-widest text-stone-400 pl-0.5">Mobile Number</label>
              <div className="relative">
                <span className="absolute left-5 top-1/2 -translate-y-1/2 text-[#A37B58] font-black text-sm">+91</span>
                <input 
                  type="tel" 
                  maxLength="10" 
                  required 
                  placeholder="Registered mobile link"
                  value={mobile} 
                  onChange={e => { setMobile(e.target.value.replace(/\D/g,"")); setError(""); }}
                  className={`${inp} pl-16`}
                />
              </div>
            </div>

            <div>
              <label className="block mb-2 text-[10px] font-black uppercase tracking-widest text-stone-400 pl-0.5">Password ID</label>
              <input 
                type="password" 
                required 
                placeholder="Enter secure staff key token"
                value={password} 
                onChange={e => { setPassword(e.target.value); setError(""); }}
                className={inp}
              />
            </div>

            {error   && <p className="text-red-600 text-xs font-semibold text-center bg-red-50 border border-red-100 py-2.5 rounded-xl">{error}</p>}
            {success && <p className="text-emerald-700 text-xs font-semibold text-center bg-emerald-50 border border-emerald-100 py-2.5 rounded-xl">{success}</p>}

            <button 
              type="submit" 
              disabled={loading || mobile.length !== 10 || !password} 
              className={btn}
            >
              {loading ? "Verifying..." : "Login to Dashboard"}
            </button>
          </form>

          {/* Sub-portal Navigation Links */}
          <div className="mt-8 pt-4 border-t border-stone-200/40 text-center">
            <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 text-[9px] font-black text-stone-400 uppercase tracking-widest">
              <Link to="/login" className="hover:text-[#A37B58] transition-colors">Customer Login</Link>
              <span className="text-stone-200">·</span>
              <Link to="/owner/login" className="hover:text-[#A37B58] transition-colors">Owner Login</Link>
              <span className="text-stone-200">·</span>
              <Link to="/admin/login" className="hover:text-[#A37B58] transition-colors">Admin Login</Link>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}