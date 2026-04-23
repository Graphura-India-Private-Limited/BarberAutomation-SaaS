import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import barberImage from "../../assets/login.jpg";


const ScissorIcon = ({ className }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
    style={{ transform: 'rotate(180deg)' }}
  >
    <circle cx="6" cy="6" r="3" />
    <circle cx="6" cy="18" r="3" />
    <line x1="20" y1="4" x2="8.12" y2="15.88" />
    <line x1="14.47" y1="14.48" x2="20" y2="20" />
    <line x1="8.12" y1="8.12" x2="12" y2="12" />
  </svg>
);

function Login() {
  const [step, setStep] = useState(1);
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState(""); 
  const [otp, setOtp] = useState(["", "", "", ""]);
  const navigate = useNavigate();

  const handleMobileSubmit = (e) => {
    e.preventDefault();
    if (mobile.length === 10) {
      setStep(2);
    }
  };

  const handleOtpChange = (element, index) => {
    if (isNaN(element.value)) return false;
    const newOtp = [...otp.map((d, idx) => (idx === index ? element.value : d))];
    setOtp(newOtp);
    if (element.nextSibling && element.value) {
      element.nextSibling.focus();
    }
  };

  return (
    <div className="min-h-screen grid md:grid-cols-2 bg-[#FFFBF2] font-sans">
      
      {/* --- Left Side: Light Skin Aesthetic Section --- */}
      <div
        className="hidden md:flex relative bg-cover bg-center overflow-hidden"
        style={{ backgroundImage: `url(${barberImage})` }}
      >
        {/* Soft Warm Overlays */}
        <div className="absolute inset-0 bg-[#3E362E]/20"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#FFFBF2] via-transparent to-[#3E362E]/10"></div>
        
        {/* Logo Section */}
        <div className="absolute top-8 left-8 z-10 flex flex-col items-start">
          <h1 className="text-2xl font-black text-[#C5A059] tracking-[0.2em] uppercase flex items-center gap-2">
            <ScissorIcon className="w-6 h-6 text-[#3E362E] fill-[#C5A059] stroke-[#C5A059] stroke-[1px]" />
            Barber <span className="text-[#3E362E]">Pro</span>
          </h1>
          <div className="h-[2px] w-full bg-[#C5A059] mt-1 opacity-40"></div>
          <p className="text-[9px] text-[#8D7B68] tracking-[0.4em] uppercase mt-1 text-center w-full">Est. 2026</p>
        </div>

        {/* Floating Content Card */}
        <div className="relative z-10 flex items-end w-full p-12">
          <div className="w-full max-w-lg bg-[#FFFBF2]/70 backdrop-blur-xl rounded-[2.5rem] p-10 border border-[#EAD8C0] shadow-2xl">
            <h2 className="text-4xl font-extrabold text-[#3E362E] leading-tight uppercase tracking-tighter mb-4">
              Look Sharp. <br /> 
              <span className="text-transparent" style={{ WebkitTextStroke: '1px #3E362E' }}>Feel Confident.</span>
            </h2>
            <p className="text-[#8D7B68] italic border-l-2 border-[#C5A059] pl-4 text-sm">
              Skip the queue. Book your luxury grooming experience in seconds.
            </p>
          </div>
        </div>
      </div>

      {/* --- Right Side: Light Skin Form Section --- */}
      <div className="bg-[#FFFBF2] flex items-center justify-center px-6 py-10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#C5A059]/10 rounded-full blur-[120px]"></div>

        <div className="w-full max-w-md z-10">
          <div className="text-center mb-10">
            <div className="inline-block p-4 rounded-3xl bg-[#C5A059]/10 border border-[#C5A059]/20 mb-6 shadow-sm">
               <ScissorIcon className="w-10 h-10 text-[#C5A059]" />
            </div>
            
            <h2 className="text-4xl font-serif font-bold text-[#3E362E] tracking-tight">
              {step === 1 ? "Sign In" : "Verify OTP"}
            </h2>
            <p className="text-[#C5A059] mt-2 tracking-[0.3em] uppercase text-[10px] font-bold">
              {step === 1 ? "Secure access to your profile" : `Code sent to +91 ${mobile}`}
            </p>
          </div>

          {step === 1 ? (
            <form onSubmit={handleMobileSubmit} className="space-y-5">
              <div className="group">
                <label className="block mb-2 text-[10px] font-black uppercase tracking-widest text-[#8D7B68] ml-1">
                  Mobile Number
                </label>
                <div className="relative">
                  <span className="absolute left-5 top-1/2 -translate-y-1/2 text-[#C5A059] font-bold">+91</span>
                  <input
                    type="tel"
                    required
                    maxLength="10"
                    placeholder="Enter 10 digit number"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value.replace(/\D/g, ""))}
                    className="w-full pl-16 pr-5 py-5 bg-[#FDF5E6] border border-[#EAD8C0] rounded-2xl text-[#3E362E] text-lg outline-none focus:border-[#C5A059] focus:bg-white transition-all shadow-sm"
                  />
                </div>
              </div>

              <div className="group">
                <div className="flex justify-between items-center mb-2 px-1">
                  <label className="text-[10px] font-black uppercase tracking-widest text-[#8D7B68]">
                    Email Address
                  </label>
                  <span className="text-[9px] text-[#C5A059]/60 font-bold uppercase italic">Optional</span>
                </div>
                <input
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-5 py-5 bg-[#FDF5E6] border border-[#EAD8C0] rounded-2xl text-[#3E362E] outline-none focus:border-[#C5A059] focus:bg-white transition-all shadow-sm"
                />
              </div>

              <button className="w-full bg-[#3E362E] text-[#FFFBF2] py-5 rounded-2xl font-black tracking-[3px] hover:bg-[#2A241F] shadow-lg transition-all transform hover:scale-[1.01] uppercase text-xs">
                GET OTP
              </button>

              <div className="pt-6 text-center space-y-6">
                <p className="text-[#8D7B68] text-[11px] font-bold uppercase tracking-widest">
                  Don't have an account?{" "}
                  <Link to="/signup" className="text-[#C5A059] font-bold hover:underline underline-offset-4 ml-1">
                    Create Profile
                  </Link>
                </p>

                <div className="flex items-center gap-4">
                  <div className="h-[1px] flex-1 bg-[#EAD8C0]"></div>
                  <span className="text-[9px] text-[#A4907C] uppercase font-bold tracking-[0.3em]">Or</span>
                  <div className="h-[1px] flex-1 bg-[#EAD8C0]"></div>
                </div>

                <button 
                  type="button"
                  className="w-full py-4 bg-white border border-[#EAD8C0] rounded-2xl flex items-center justify-center gap-3 text-[#3E362E] text-[10px] font-black tracking-[0.2em] uppercase hover:bg-gray-50 transition-all shadow-sm"
                >
                  <img src="https://www.svgrepo.com/show/475656/google.svg" className="w-4 h-4" alt="google" />
                  Continue with Google
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-8">
              <div className="flex justify-between gap-3">
                {otp.map((data, index) => (
                  <input
                    key={index}
                    type="text"
                    maxLength="1"
                    value={data}
                    onChange={(e) => handleOtpChange(e.target, index)}
                    onFocus={(e) => e.target.select()}
                    className="w-full h-16 bg-[#FDF5E6] border border-[#EAD8C0] rounded-2xl text-center text-2xl font-black text-[#C5A059] outline-none focus:border-[#C5A059] focus:bg-white transition-all shadow-sm"
                  />
                ))}
              </div>

              <div className="space-y-4">
                <button 
                  onClick={() => navigate("/profile")} 
                  className="w-full bg-[#3E362E] text-[#FFFBF2] py-5 rounded-2xl font-black tracking-[3px] shadow-lg transition-all uppercase text-xs"
                >
                  VERIFY & PROCEED
                </button>
                <button 
                  onClick={() => setStep(1)} 
                  className="w-full py-2 text-[#8D7B68] text-[10px] font-bold tracking-widest uppercase hover:text-[#3E362E] transition-colors"
                >
                  Back to Login
                </button>
              </div>
            </div>
          )}

          <p className="text-center mt-10 text-[#A4907C] text-[9px] tracking-[0.2em] uppercase leading-relaxed">
            By continuing, you agree to our <br />
            <span className="text-[#3E362E] font-bold">Terms of Service & Privacy Policy</span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;