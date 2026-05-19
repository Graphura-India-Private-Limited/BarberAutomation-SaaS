import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const DEMO = { mobile:"9876543210", password:"Barber@123" };

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

  const inp = "w-full px-5 py-4 bg-[#FDF5E6] border border-[#EAD8C0] rounded-2xl text-[#3E362E] outline-none focus:border-[#C5A059] focus:bg-white text-sm transition-all shadow-sm";
  const btn = "w-full bg-[#3E362E] text-[#FFFBF2] py-4 rounded-2xl font-black tracking-[3px] hover:bg-[#2A241F] shadow-lg transition-all uppercase text-xs disabled:opacity-50 disabled:cursor-not-allowed";

  return (
    <div className="min-h-screen bg-[#FFFBF2] flex items-center justify-center px-4 font-sans">
      <div className="absolute top-0 right-0 w-80 h-80 bg-[#C5A059]/10 rounded-full blur-[120px] pointer-events-none"/>

      <div className="w-full max-w-md relative z-10">

        <button onClick={() => navigate("/")} className="flex items-center gap-2 text-[10px] font-bold text-[#8D7B68] hover:text-[#C5A059] mb-8 uppercase tracking-widest transition">
          <ArrowLeft className="w-3.5 h-3.5"/> Back to Home
        </button>

        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#C5A059]/10 border border-[#C5A059]/20 mb-4">
            <ScissorIcon className="w-8 h-8 text-[#C5A059]"/>
          </div>
          <h2 className="text-3xl font-serif font-bold text-[#3E362E]">Barber Login</h2>
          <p className="text-[#C5A059] mt-2 tracking-[0.3em] uppercase text-[10px] font-bold">Staff Portal</p>
        </div>

        {/* Demo Box */}
        <div className="bg-[#FEF3DC] border border-[#C5A059]/30 rounded-2xl p-4 mb-6">
          <p className="text-[10px] font-black text-[#C5A059] uppercase tracking-widest mb-2">Demo Credentials</p>
          <div className="flex justify-between items-center">
            <div>
              <p className="text-xs text-[#3E362E] font-semibold">Mobile: <span className="font-black">{DEMO.mobile}</span></p>
              <p className="text-xs text-[#3E362E] font-semibold">Password: <span className="font-black">{DEMO.password}</span></p>
            </div>
            <button onClick={fillDemo}
              className="text-[10px] font-black text-white bg-[#C5A059] px-3 py-1.5 rounded-lg uppercase tracking-wide hover:bg-[#b38f4d] transition">
              Use Demo
            </button>
          </div>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block mb-2 text-[10px] font-black uppercase tracking-widest text-[#8D7B68] ml-1">Mobile Number</label>
            <div className="relative">
              <span className="absolute left-5 top-1/2 -translate-y-1/2 text-[#C5A059] font-bold text-sm">+91</span>
              <input type="tel" maxLength="10" required placeholder="Registered mobile"
                value={mobile} onChange={e => { setMobile(e.target.value.replace(/\D/g,"")); setError(""); }}
                className={`${inp} pl-16`}/>
            </div>
          </div>

          <div>
            <label className="block mb-2 text-[10px] font-black uppercase tracking-widest text-[#8D7B68] ml-1">Password</label>
            <input type="password" required placeholder="Enter your password"
              value={password} onChange={e => { setPassword(e.target.value); setError(""); }}
              className={inp}/>
          </div>

          {error   && <p className="text-red-500 text-xs font-semibold text-center bg-red-50 py-2 rounded-xl">{error}</p>}
          {success && <p className="text-green-600 text-xs font-semibold text-center bg-green-50 py-2 rounded-xl">{success}</p>}

          <button type="submit" disabled={loading || mobile.length!==10 || !password} className={btn}>
            {loading ? "Logging in..." : "Login to Dashboard"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <div className="flex justify-center gap-4 text-[9px] text-[#A09080] uppercase tracking-widest">
            <Link to="/login" className="hover:text-[#C5A059] transition">Customer Login</Link>
            <span>·</span>
            <Link to="/owner/login" className="hover:text-[#C5A059] transition">Owner Login</Link>
            <span>·</span>
            <Link to="/admin/login" className="hover:text-[#C5A059] transition">Admin Login</Link>
          </div>
        </div>
      </div>
    </div>
  );
}