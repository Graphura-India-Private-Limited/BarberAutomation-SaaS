import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import barberImage from "../../assets/login.jpg";
import { ArrowLeft, Phone, Lock, Eye, EyeOff, Home } from "lucide-react";

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

export default function OwnerLogin() {
  const navigate = useNavigate();
  
  const [mobile,   setMobile]   = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    if (mobile.length !== 10) { setError("Enter a valid 10-digit mobile number"); return; }
    if (!password) { setError("Password is required"); return; }

    setLoading(true); 
    setError("");

    try {
      const res = await fetch(`${API}/auth/owner/login`, {
        method: "POST", 
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobile, password }),
      });
      
      const data = await res.json();
      
      if (data.success) {
        // Securely store owner credentials
        localStorage.setItem("token",   data.token);
        localStorage.setItem("salonId", data.salon?._id || "");
        localStorage.setItem("role",    "owner");
        
        // Redirect to the Owner Dashboard
        navigate("/owner/dashboard");
      } else {
        setError(data.message || "Invalid mobile number or password");
      }
    } catch (err) { 
      setError("Server error! Please check your connection."); 
    } finally { 
      setLoading(false); 
    }
  };

  const labelCls = "block mb-2 text-[10px] font-black uppercase tracking-widest text-[#8D7B68] ml-1";
  const inputWrapperCls = "relative";
  const inputCls = "w-full pl-12 pr-12 py-4 bg-[#FDF5E6] border border-[#EAD8C0] rounded-2xl text-[#3E362E] outline-none focus:border-[#C5A059] focus:bg-white transition-all shadow-sm text-base";
  const iconCls = "absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#C5A059]";

  return (
    <div className="min-h-screen grid md:grid-cols-2 bg-[#FFFBF2] font-sans">

      {/* ── LEFT IMAGE (Brand Consistency) ── */}
      <div className="hidden md:flex relative bg-cover bg-center overflow-hidden"
        style={{ backgroundImage:`url(${barberImage})` }}>
        <div className="absolute inset-0 bg-[#3E362E]/40"/>
        <div className="absolute inset-0 bg-gradient-to-t from-[#FFFBF2] via-transparent to-[#3E362E]/10"/>
        <div className="absolute top-8 left-8 z-10 flex flex-col items-start">
          <h1 className="text-2xl font-black text-[#C5A059] tracking-[0.2em] uppercase flex items-center gap-2">
            <ScissorIcon className="w-6 h-6 text-[#FFFBF2] fill-[#C5A059] stroke-[#C5A059] stroke-[1px]"/>
            Barber <span className="text-[#FFFBF2]">Pro</span>
          </h1>
          <div className="h-[2px] w-full bg-[#C5A059] mt-1 opacity-40"/>
          <p className="text-[9px] text-white tracking-[0.4em] uppercase mt-1 text-center w-full">Partner Portal</p>
        </div>
        <div className="relative z-10 flex items-end w-full p-12">
          <div className="w-full max-w-lg bg-[#FFFBF2]/80 backdrop-blur-xl rounded-[2.5rem] p-10 border border-[#EAD8C0] shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <Home className="w-8 h-8 text-[#C5A059]"/>
              <h2 className="text-2xl font-black text-[#3E362E] uppercase tracking-widest">
                Grow Your Business
              </h2>
            </div>
            <p className="text-[#8D7B68] italic border-l-2 border-[#C5A059] pl-4 text-sm leading-relaxed">
              Manage your barbers, track your daily revenue, and control your salon's live queue all in one place.
            </p>
          </div>
        </div>
      </div>

      {/* ── RIGHT FORM ── */}
      <div className="bg-[#FFFBF2] flex items-center justify-center px-6 py-10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#C5A059]/10 rounded-full blur-[120px]"/>
        
        <div className="w-full max-w-md z-10">
          
          <button onClick={() => navigate("/login")} className="flex items-center gap-1 text-[10px] font-bold text-[#8D7B68] hover:text-[#C5A059] mb-8 transition uppercase tracking-widest">
            <ArrowLeft className="w-3.5 h-3.5"/> Back to Main Site
          </button>

          {/* Header */}
          <div className="mb-8">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#C5A059]">Salon Partners</span>
            <h2 className="text-4xl font-serif font-bold text-[#3E362E] tracking-tight mt-2">
              Owner Login
            </h2>
            <p className="text-[#8D7B68] mt-2 text-sm">Enter your credentials to access your dashboard.</p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-5">
            
            {/* Mobile Number */}
            <div>
              <label className={labelCls}>Registered Mobile</label>
              <div className={inputWrapperCls}>
                <Phone className={iconCls}/>
                <input
                  type="tel"
                  required
                  maxLength="10"
                  autoFocus
                  placeholder="Enter 10 digit mobile"
                  value={mobile}
                  onChange={e => { setMobile(e.target.value.replace(/\D/g,"")); setError(""); }}
                  className={inputCls}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className={labelCls}>Password</label>
              <div className={inputWrapperCls}>
                <Lock className={iconCls}/>
                <input
                  type={showPass ? "text" : "password"}
                  required
                  placeholder="Enter password"
                  value={password}
                  onChange={e => { setPassword(e.target.value); setError(""); }}
                  className={inputCls}
                />
                <button type="button" onClick={() => setShowPass(p => !p)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8D7B68] hover:text-[#C5A059] transition">
                  {showPass ? <EyeOff className="w-4 h-4"/> : <Eye className="w-4 h-4"/>}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-xs font-bold text-center">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button type="submit"
              disabled={loading || mobile.length !== 10 || !password}
              className="w-full bg-[#3E362E] text-[#FFFBF2] py-5 mt-4 rounded-2xl font-black tracking-[3px] hover:bg-[#C5A059] shadow-lg transition-all uppercase text-xs disabled:opacity-50 disabled:cursor-not-allowed">
              {loading ? "Authenticating..." : "Login to Dashboard"}
            </button>

            {/* Register Salon Link */}
            <div className="mt-6 text-center">
              <p className="text-[#8D7B68] text-[11px] font-bold uppercase tracking-widest">
                New Partner?{" "}
                <Link to="/register-salon" className="text-[#C5A059] font-black hover:underline underline-offset-4">
                  Register Your Salon
                </Link>
              </p>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}