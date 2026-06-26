import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Calendar, Clock3, User, Award, Star, ArrowLeft, Scissors } from "lucide-react";
import barberImage from "../../assets/login.jpg";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

function FeatureCard({ icon, title, subtitle }) {
  return (
    <div className="text-center text-white">
      <div className="w-16 h-16 mx-auto border border-amber-500 rounded-xl flex items-center justify-center text-amber-500">
        {icon}
      </div>
      <h4 className="mt-3 text-amber-500 font-semibold text-sm">{title}</h4>
      <p className="text-xs">{subtitle}</p>
    </div>
  );
}

export default function OTPLogin() {
  const navigate = useNavigate();
  const [phone,   setPhone]   = useState("");
  const [otp,     setOtp]     = useState(["", "", "", "", "", ""]);
  const [step,    setStep]    = useState("mobile");
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");
  const [devOtp,  setDevOtp]  = useState("");

  const sendOtp = async (e) => {
    e?.preventDefault();
    if (phone.length !== 10) { setError("Please enter a valid 10-digit mobile number"); return; }
    setLoading(true); setError("");
    try {
      const res  = await fetch(`${API}/auth/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobile: phone }),
      });
      const data = await res.json();
      if (data.success) {
        setStep("otp");
        if (data.otp) setDevOtp(data.otp);
      } else {
        setError(data.message || "Failed to send OTP");
      }
    } catch {
      setError("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    const otpStr = otp.join("");
    if (otpStr.length !== 6) { setError("Please enter the complete 6-digit OTP"); return; }
    setLoading(true); setError("");
    try {
      const res  = await fetch(`${API}/auth/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobile: phone, otp: otpStr }),
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem("token",  data.token);
        localStorage.setItem("userId", data.user?._id || "");
        localStorage.setItem("role",   "customer");
        localStorage.setItem("name",   data.user?.name || "Customer");
        localStorage.setItem("email",  data.user?.email || "");
        localStorage.setItem("mobile", data.user?.mobile || phone || "");
        if (data.user?.name) {
          localStorage.setItem("userName", data.user.name);
        }
        navigate("/");
      } else {
        setError(data.message || "Invalid OTP");
      }
    } catch {
      setError("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (e, idx) => {
    if (isNaN(e.target.value)) return;
    const next = [...otp];
    next[idx] = e.target.value;
    setOtp(next);
    setError("");
    if (e.target.value) {
      const nextInput = e.target.parentElement?.children[idx + 1];
      nextInput?.focus();
    }
  };

  const handleOtpKey = (e, idx) => {
    if (e.key === "Backspace" && !otp[idx] && idx > 0) {
      e.target.previousElementSibling?.focus();
    }
  };

  // ── ✅ STATE LOGIC MONITOR FOR DYNAMIC BUTTON GLOW STATUS ──
  const isPhoneValid = phone.length === 10;
  const isOtpComplete = otp.join("").length === 6;

  return (
    <div className="min-h-screen bg-[#111] flex antialiased">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap');
        .font-sans { font-family: 'Plus Jakarta Sans', sans-serif !important; }
        .font-serif { font-family: 'Playfair Display', serif !important; }
        
        .card-minimalist {
          background: #FFFFFF;
          border-radius: 2.5rem;
          box-shadow: 0 30px 60px -15px rgba(62, 54, 46, 0.06);
          border: 1px solid rgba(234, 221, 206, 0.4);
        }
      `}</style>

      <div className="w-full h-screen bg-[#FAF6F0] flex">

        {/* ── LEFT CONTAINER SECTION ── */}
        <div className="w-1/2 relative hidden md:block">
          <img src={barberImage} alt="Barber" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/45" />

          {/* Logo labels */}
          <div className="absolute top-10 left-10 text-white">
            <h1 className="text-4xl font-bold tracking-wider font-sans">
              BARBER <span className="text-amber-500">PRO</span>
            </h1>
            <p className="text-sm tracking-[4px] mt-2">EST. 2026</p>
          </div>

          {/* Banner typography block */}
          <div className="absolute left-10 top-[45%] -translate-y-1/2 max-w-md">
            <h2 className="text-6xl font-serif leading-tight text-white">
              <span className="text-amber-500">YOUR STYLE,</span>
              <br />
              OUR EXPERTISE
            </h2>
            <div className="w-20 h-1 bg-amber-500 mt-4" />
            <p className="text-white text-xl mt-6 leading-9 font-sans">
              Log in to your account to manage bookings, track appointments, and more.
            </p>
          </div>

          {/* Horizontal streaming metrics badges */}
          <div className="absolute bottom-10 left-0 right-0 px-8">
            <div className="grid grid-cols-4 gap-4">
              <FeatureCard icon={<Calendar size={28} />} title="BOOK"          subtitle="APPOINTMENTS" />
              <FeatureCard icon={<Clock3 size={28} />}   title="MANAGE"        subtitle="SCHEDULES" />
              <FeatureCard icon={<User size={28} />}     title="PERSONALIZED"  subtitle="EXPERIENCE" />
              <FeatureCard icon={<Award size={28} />}    title="EXCLUSIVE"     subtitle="OFFERS" />
            </div>
          </div>
        </div>

        {/* ── RIGHT ACCENTS VIEWPORT CONTAINER ── */}
        <div className="w-full md:w-1/2 bg-[#FAF6F0] flex items-center justify-center p-6">
          <div className="card-minimalist w-full max-w-[450px] p-8 sm:p-10 flex flex-col">

            {/* Header Identity Badge Group */}
            <div className="flex items-center gap-4 mb-5 text-left">
              <div className="w-12 h-12 rounded-xl bg-[#2C211A] flex items-center justify-center shrink-0">
                <Scissors size={20} color="#C5A059" className="rotate-90" />
              </div>
              <div>
                <h2 className="text-lg font-serif font-bold text-[#2C211A] tracking-wide leading-tight">BarberAutomation</h2>
                <p className="text-[#C5A059] uppercase text-[9px] font-extrabold tracking-widest mt-0.5 font-sans">
                  Graphura India Private Limited
                </p>
              </div>
            </div>

            <div className="h-[1px] bg-stone-100 w-full mb-6" />

            {step === "mobile" ? (
              <>
                <div className="mb-6 text-center">
  {/* Header Title */}
  <h3 className="text-3xl font-serif font-semibold text-gray-900">
                OTP-Login
              </h3>
  
  {/* Subtitle Description */}
  <p className="mt-2 text-sm font-normal leading-relaxed text-slate-400 font-sans">
    Enter your mobile number to receive a secure login one-time verification password.
  </p>
</div>

                <form onSubmit={sendOtp} className="space-y-5 text-left">
                  <div>
                    <label className="block text-[10px] font-extrabold text-[#C5A059] tracking-widest mb-2 uppercase font-sans">
                      Mobile Contact Number
                    </label>
                    <div className="flex border border-[#EADBCE] rounded-xl overflow-hidden bg-white shadow-3xs focus-within:border-[#8B6B4E] transition-all">
                      <div className="px-4 flex items-center justify-center border-r border-[#EADBCE] bg-stone-50 text-stone-500 font-bold text-sm select-none font-sans">
                        +91
                      </div>
                      <input
                        type="tel"
                        maxLength={10}
                        autoFocus
                        placeholder="98765 43210"
                        value={phone}
                        onChange={e => { setPhone(e.target.value.replace(/\D/g, "")); setError(""); }}
                        className="w-full px-4 py-3.5 text-sm outline-none text-stone-800 font-medium font-sans"
                      />
                    </div>
                  </div>

                  {error && <p className="text-rose-600 text-xs font-semibold mt-1 font-sans">{error}</p>}

                  {/* ── ✅ FIXED DYNAMIC BUTTON STYLE INTERPOLATION LAYER ── */}
                  <button
                    type="submit"
                    disabled={loading || !isPhoneValid}
                    className="w-full text-white font-bold text-xs uppercase tracking-wider py-4 rounded-xl transition-all duration-300 shadow-md active:scale-[0.99] font-sans"
                    style={{ 
                      backgroundColor: isPhoneValid ? "#2C1810" : "#9C928A",
                      boxShadow: isPhoneValid ? "0 10px 25px -5px rgba(44, 24, 16, 0.25)" : "none"
                    }}
                  >
                    {loading ? "Sending…" : "Request Secure Passcode"}
                  </button>
                </form>

                <div className="flex items-center my-6 justify-center">
                  <div className="flex-1 h-[1px] bg-[#EADBCE]" />
                  <span className="mx-4 text-[10px] font-black tracking-widest text-stone-300 font-sans">OR</span>
                  <div className="flex-1 h-[1px] bg-[#EADBCE]" />
                </div>

                <p className="text-center text-xs font-medium text-stone-500 font-sans">
                  New user to the studio?{" "}
                  <Link to="/signup" className="text-[#C5A059] font-bold underline hover:text-[#8B6A2E] transition-colors">
                    Create an account
                  </Link>
                </p>
              </>
            ) : (
              <>
                <div className="mb-6 text-center">
                  <h3 className="text-3xl font-serif font-semibold text-gray-900">
                Verify OTP
              </h3>
                  <p className="text-stone-400 mt-2 text-sm font-medium font-sans">
                    We sent a 6-digit code to <span className="text-stone-800 font-bold">+91 {phone}</span>.
                  </p>
                  <p className="text-stone-400 text-xs mt-1 font-sans">Valid for 5 minutes.</p>
                </div>

                {devOtp && (
                  <div className="mb-4 p-3 rounded-xl text-center border border-sky-100 bg-sky-50/60 font-sans">
                    <p className="text-[9px] font-black text-sky-600 uppercase tracking-widest mb-0.5">Sandbox Test Code</p>
                    <p className="text-xl font-black text-sky-800 tracking-[0.2em] pl-1">{devOtp}</p>
                  </div>
                )}

                <div className="flex justify-between gap-2 mt-4 mb-6">
                  {otp.map((d, i) => (
                    <input
                      key={i}
                      type="tel"
                      inputMode="numeric"
                      maxLength={1}
                      value={d}
                      onChange={e => handleOtpChange(e, i)}
                      onKeyDown={e => handleOtpKey(e, i)}
                      onFocus={e => e.target.select()}
                      className="w-full h-14 rounded-xl border text-center text-xl font-bold outline-none transition-all font-sans focus:border-[#8B6B4E]"
                      style={{ 
                        borderColor: d ? "#A68B5B" : "#E2DFD8", 
                        backgroundColor: d ? "#FFFDF9" : "#FAF9F6",
                        color: "#2C211A"
                      }}
                    />
                  ))}
                </div>

                {error && <p className="text-rose-600 text-xs font-semibold text-center mb-4 font-sans">{error}</p>}

                <div className="space-y-3">
                  {/* ── ✅ FIXED DYNAMIC BUTTON STYLE INTERPOLATION LAYER ── */}
                  <button
                    type="button"
                    onClick={verifyOtp}
                    disabled={loading || !isOtpComplete}
                    className="w-full text-white font-bold text-xs uppercase tracking-wider py-4 rounded-xl transition-all duration-300 shadow-md active:scale-[0.99] font-sans"
                    style={{ 
                      backgroundColor: isOtpComplete ? "#2C1810" : "#9C928A",
                      boxShadow: isOtpComplete ? "0 10px 25px -5px rgba(44, 24, 16, 0.25)" : "none"
                    }}
                  >
                    {loading ? "Verifying…" : "Verify OTP"}
                  </button>

                  <button
                    type="button"
                    onClick={() => { setStep("mobile"); setOtp(["","","","","",""]); setError(""); setDevOtp(""); }}
                    className="w-full bg-white border border-[#EADBCE] hover:bg-stone-50 font-bold text-xs uppercase tracking-wider py-4 rounded-xl transition-all cursor-pointer text-[#8B6B4E] flex items-center justify-center gap-1 font-sans"
                  >
                    ← Change Number
                  </button>
                </div>

                <button
                  type="button"
                  onClick={sendOtp}
                  disabled={loading}
                  className="w-full mt-4 bg-transparent border-none outline-none text-[10px] font-extrabold hover:underline uppercase tracking-widest text-[#C5A059] cursor-pointer font-sans"
                >
                  Resend Code
                </button>
              </>
            )}

            <div className="text-center mt-8">
              <p className="text-[9px] font-black tracking-widest text-stone-300 uppercase font-sans">
                Professional Grooming Standards
              </p>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}