import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Calendar, Clock3, User, Award, Star, ArrowLeft } from "lucide-react";
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

  return (
    <div className="min-h-screen bg-[#111] flex">
      <div className="w-full h-screen bg-white flex">

        {/* ── LEFT SECTION ── */}
        <div className="w-1/2 relative hidden md:block">
          <img src={barberImage} alt="Barber" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/45" />

          {/* Logo */}
          <div className="absolute top-10 left-10 text-white">
            <h1 className="text-4xl font-bold tracking-wider">
              BARBER <span className="text-amber-500">PRO</span>
            </h1>
            <p className="text-sm tracking-[4px] mt-2">EST. 2026</p>
          </div>

          {/* Main Content */}
          <div className="absolute left-10 top-[45%] -translate-y-1/2 max-w-md">
            <h2 className="text-6xl font-serif leading-tight">
              <span className="text-amber-500">YOUR STYLE,</span>
              <br />
              <span className="text-white">OUR EXPERTISE</span>
            </h2>
            <div className="w-20 h-1 bg-amber-500 mt-4" />
            <p className="text-white text-xl mt-6 leading-9">
              Log in to your account to manage bookings, track appointments, and more.
            </p>
          </div>

          {/* Features */}
          <div className="absolute bottom-10 left-0 right-0 px-8">
            <div className="grid grid-cols-4 gap-4">
              <FeatureCard icon={<Calendar size={28} />} title="BOOK"          subtitle="APPOINTMENTS" />
              <FeatureCard icon={<Clock3 size={28} />}   title="MANAGE"        subtitle="SCHEDULES" />
              <FeatureCard icon={<User size={28} />}     title="PERSONALIZED"  subtitle="EXPERIENCE" />
              <FeatureCard icon={<Award size={28} />}    title="EXCLUSIVE"     subtitle="OFFERS" />
            </div>
          </div>
        </div>

        {/* ── RIGHT SECTION ── */}
        <div className="w-full md:w-1/2 bg-[#f7f5f2] flex items-center justify-center">
          <div className="bg-white w-[450px] p-7 rounded-[30px] shadow-xl">

            {/* Top Icon */}
            <div className="flex justify-center">
              <div className="w-16 h-16 rounded-xl flex items-center justify-center" style={{ background: "#8B6B3E" }}>
                <Star fill="white" color="white" />
              </div>
            </div>

            {/* Brand */}
            <div className="text-center mt-4">
              <h2 className="text-4xl font-serif font-semibold">BarberAutomation</h2>
              <p className="text-amber-600 uppercase text-xs tracking-[3px] mt-2">
                Graphura India Private Limited
              </p>
            </div>

            <hr className="my-5" />

            {step === "mobile" ? (
              <>
                <h3 className="text-xl font-serif font-semibold">Welcome back</h3>
                <p className="text-gray-500 mt-1 text-sm">
                  Enter your mobile number to receive a one-time password
                </p>

                <form onSubmit={sendOtp}>
                  {/* Mobile Number */}
                  <div className="mt-5">
                    <label className="block text-xs font-semibold text-amber-600 tracking-[2px] mb-3">
                      MOBILE NUMBER
                    </label>
                    <div className="flex border rounded-xl overflow-hidden">
                      <div className="px-5 py-4 border-r bg-gray-50 font-semibold text-gray-700">+91</div>
                      <input
                        type="tel"
                        maxLength={10}
                        autoFocus
                        placeholder="98765 43210"
                        value={phone}
                        onChange={e => { setPhone(e.target.value.replace(/\D/g, "")); setError(""); }}
                        className="flex-1 px-4 outline-none text-gray-800"
                      />
                    </div>
                  </div>

                  {error && <p className="text-red-500 text-sm mt-3 font-medium">{error}</p>}

                  <button
                    type="submit"
                    disabled={loading || phone.length !== 10}
                    className="w-full mt-5 text-white font-semibold py-4 rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ background: "#8B6B3E" }}
                    onMouseEnter={e => { if (!e.currentTarget.disabled) e.currentTarget.style.background = "#735A32"; }}
                    onMouseLeave={e => { e.currentTarget.style.background = "#8B6B3E"; }}
                  >
                    {loading ? "Sending…" : "Send OTP"}
                  </button>
                </form>

                <div className="flex items-center my-5">
                  <div className="flex-1 h-[1px] bg-gray-200" />
                  <span className="mx-4 text-gray-400">OR</span>
                  <div className="flex-1 h-[1px] bg-gray-200" />
                </div>

                <p className="text-center text-gray-500">
                  New user?{" "}
                  <Link to="/signup" className="text-amber-600 font-semibold underline">
                    Register here
                  </Link>
                </p>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => { setStep("mobile"); setOtp(["","","","","",""]); setError(""); setDevOtp(""); }}
                  className="flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-amber-600 mb-6 transition"
                >
                  <ArrowLeft size={16} /> Back
                </button>

                <h3 className="text-4xl font-serif font-semibold">Verify OTP</h3>
                <p className="text-gray-500 mt-3 text-lg">Code sent to +91 {phone}</p>

                {devOtp && (
                  <div className="mt-4 p-4 rounded-xl text-center border border-blue-200 bg-blue-50">
                    <p className="text-[10px] font-bold text-blue-600 uppercase mb-1">Dev OTP</p>
                    <p className="text-2xl font-black text-blue-800 tracking-[0.3em]">{devOtp}</p>
                  </div>
                )}

                <div className="flex justify-between gap-2 mt-8 mb-4">
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
                      className="w-full h-14 rounded-xl border-2 text-center text-xl font-bold outline-none transition-colors"
                      style={{ borderColor: d ? "#d97706" : "#E5E7EB", color: "#d97706" }}
                    />
                  ))}
                </div>

                {error && <p className="text-red-500 text-sm font-medium text-center mb-4">{error}</p>}

                <button
                  type="button"
                  onClick={verifyOtp}
                  disabled={loading || otp.join("").length !== 6}
                  className="w-full mt-4 text-white font-semibold py-4 rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ background: "#8B6B3E" }}
                  onMouseEnter={e => { if (!e.currentTarget.disabled) e.currentTarget.style.background = "#735A32"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "#8B6B3E"; }}
                >
                  {loading ? "Verifying…" : "Verify & Proceed"}
                </button>

                <button
                  type="button"
                  onClick={sendOtp}
                  disabled={loading}
                  className="w-full mt-4 text-sm font-semibold hover:underline uppercase tracking-wider"
                  style={{ color: "#8B6B3E" }}
                >
                  Resend OTP
                </button>
              </>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
