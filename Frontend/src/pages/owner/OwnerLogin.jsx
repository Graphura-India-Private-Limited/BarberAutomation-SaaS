import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

/* Demo credentials shown on page */
const DEMO = { mobile:"9999999999", password:"Owner@123" };

const ScissorIcon = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/>
    <line x1="20" y1="4" x2="8.12" y2="15.88"/>
    <line x1="14.47" y1="14.48" x2="20" y2="20"/>
    <line x1="8.12" y1="8.12" x2="12" y2="12"/>
  </svg>
);

export default function OwnerLogin() {
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
      const res  = await fetch(`${API}/auth/owner/login`, {
        method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({ mobile, password }),
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem("token",    data.token);
        localStorage.setItem("role",     "owner");
        localStorage.setItem("salonId",  data.salon?._id || "");
        localStorage.setItem("salonName",data.salon?.salon_name || "");
        if (data.status === "pending") {
          setSuccess("Login successful! Your salon is pending approval.");
          setTimeout(() => navigate("/owner/dashboard"), 1500);
        } else if (data.status === "approved") {
          setSuccess("Welcome back! Redirecting to dashboard...");
          setTimeout(() => navigate("/owner/dashboard"), 1200);
        } else if (data.status === "rejected") {
          setSuccess("Login successful. Please review rejection details and resubmit.");
          setTimeout(() => navigate("/owner/dashboard"), 1500);
        } else {
          setError(`Account ${data.status}. Contact admin.`);
        }
      } else setError(data.message || "Login failed");
    } catch { setError("Server error! Make sure backend is running."); }
    finally { setLoading(false); }
  };

  const fillDemo = () => { setMobile(DEMO.mobile); setPassword(DEMO.password); setError(""); };

  const inp = "w-full px-5 py-4 bg-zinc-50 border border-zinc-200 rounded-2xl text-zinc-800 outline-none focus:border-amber-600 focus:bg-white text-sm font-medium transition-all shadow-sm";
  const btn = "w-full bg-amber-600 text-white py-4 rounded-2xl font-bold tracking-wider hover:bg-amber-700 shadow-md transition-all uppercase text-xs disabled:opacity-50 disabled:cursor-not-allowed";

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 font-sans text-zinc-800" style={{ background: "var(--bg)" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap');
        :root { 
          --gold: #D97706; 
          --gold2: #B45309; 
          --bg: #FAF6F0; 
          --bg2: #FFFFFF; 
          --border: #EADBCE; 
        }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body, .font-sans {
          font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important;
        }
        .font-serif {
          font-family: 'Playfair Display', Georgia, Cambria, "Times New Roman", Times, serif !important;
        }
        .card { 
          background: var(--bg2); 
          border: 1px solid var(--border); 
          border-radius: 24px; 
          box-shadow: 0 4px 20px -2px rgba(28, 25, 23, 0.04), 0 2px 8px -1px rgba(28, 25, 23, 0.02);
          transition: all 0.2s ease;
        }
      `}</style>
      
      <div className="absolute top-0 right-0 w-80 h-80 bg-amber-100/30 rounded-full blur-[120px] pointer-events-none"/>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-orange-100/20 rounded-full blur-[120px] pointer-events-none"/>

      <div className="w-full max-w-md relative z-10">

        {/* Back */}
        <button onClick={() => navigate("/")} className="flex items-center gap-2 text-xs font-bold text-amber-700 hover:text-amber-800 mb-6 uppercase tracking-wider transition">
          <ArrowLeft className="w-4 h-4"/> Back to Home
        </button>

        <div className="card p-8 bg-white">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-amber-50 border border-amber-100 mb-4">
              <ScissorIcon className="w-8 h-8 text-amber-600"/>
            </div>
            <h2 className="text-3xl font-serif font-bold text-zinc-900">Owner Login</h2>
            <p className="text-amber-700 mt-2 tracking-widest uppercase text-[10px] font-bold">Salon Management Portal</p>
          </div>

          {/* Demo Credentials Box */}
          <div className="bg-amber-50/50 border border-amber-200/50 rounded-xl p-4 mb-6">
            <p className="text-[10px] font-bold text-amber-700 uppercase tracking-wider mb-2">Demo Credentials</p>
            <div className="flex justify-between items-center">
              <div>
                <p className="text-xs text-zinc-700 font-semibold">Mobile: <span className="font-bold">{DEMO.mobile}</span></p>
                <p className="text-xs text-zinc-700 font-semibold">Password: <span className="font-bold">{DEMO.password}</span></p>
              </div>
              <button onClick={fillDemo}
                className="text-[10px] font-bold text-white bg-amber-600 px-3 py-1.5 rounded-lg uppercase tracking-wide hover:bg-amber-700 transition">
                Use Demo
              </button>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            {/* Mobile */}
            <div>
              <label className="block mb-2 text-[10px] font-bold uppercase tracking-wider text-zinc-50 ml-1">Mobile Number</label>
              <div className="relative">
                <span className="absolute left-5 top-1/2 -translate-y-1/2 text-amber-700 font-bold text-sm">+91</span>
                <input type="tel" maxLength="10" required placeholder="Registered mobile"
                  value={mobile} onChange={e => { setMobile(e.target.value.replace(/\D/g,"")); setError(""); }}
                  className={`${inp} pl-16`}/>
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block mb-2 text-[10px] font-bold uppercase tracking-wider text-zinc-50 ml-1">Password</label>
              <input type="password" required placeholder="Enter your password"
                value={password} onChange={e => { setPassword(e.target.value); setError(""); }}
                className={inp}/>
            </div>

            {error   && <p className="text-red-700 text-xs font-semibold text-center bg-red-50 border border-red-100 py-2 rounded-xl">{error}</p>}
            {success && <p className="text-green-700 text-xs font-semibold text-center bg-green-50 border border-green-100 py-2 rounded-xl">{success}</p>}

            <button type="submit" disabled={loading || mobile.length!==10 || !password} className={btn}>
              {loading ? "Logging in..." : "Login to Dashboard"}
            </button>
          </form>

          {/* Register link */}
          <div className="mt-6 text-center space-y-4">
            <p className="text-zinc-500 text-xs">
              Don't have a salon account?{" "}
              <Link to="/register-salon" className="text-amber-700 font-bold hover:text-amber-800 hover:underline">Register Salon</Link>
            </p>
            <div className="flex flex-wrap justify-center gap-3 text-[10px] text-zinc-400 uppercase tracking-wider border-t border-zinc-100 pt-4">
              <Link to="/login" className="hover:text-amber-600 transition">Customer Login</Link>
              <span>·</span>
              <Link to="/barber/login" className="hover:text-amber-600 transition">Barber Login</Link>
              <span>·</span>
              <Link to="/admin/login" className="hover:text-amber-600 transition">Admin Login</Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
