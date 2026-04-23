import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import adminBg from "../../assets/adminlogin.jpg"; 

const ScissorIcon = ({ className }) => (
  <svg viewBox="0 0 24 24" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M6 15C7.65685 15 9 13.6569 9 12C9 11.3321 8.7818 10.715 8.4121 10.2148L11.5 12L14.5879 13.7852C14.2182 14.285 14 14.9019 14 15.5645C14 17.2213 15.3431 18.5645 17 18.5645C18.6569 18.5645 20 17.2213 20 15.5645C20 14.2964 19.2155 13.2117 18.102 12.7751L15.3 11.1574L18.102 9.53974C19.2155 9.10313 20 8.01844 20 6.75032C20 5.09347 18.6569 3.75032 17 3.75032C15.3431 3.75032 14 5.09347 14 6.75032C14 7.41292 14.2182 8.02983 14.5879 8.52959L11.5 10.3148L8.4121 8.5322C8.7818 8.03198 9 7.41492 9 6.74731C9 5.09046 7.65685 3.74731 6 3.74731C4.34315 3.74731 3 5.09046 3 6.74731C3 8.40417 4.34315 9.74731 6 9.74731C6.66508 9.74731 7.2798 9.53039 7.7788 9.16335L10.8667 10.9485L7.7788 12.7337C7.2798 12.3667 6.66508 12.1497 6 12.1497C4.34315 12.1497 3 13.4929 3 15.1497C3 16.8066 4.34315 18.1497 6 18.1497V15Z" />
  </svg>
);

function AdminLogin() {
  const [step, setStep] = useState(1);
  const navigate = useNavigate();

  const handleNext = (e) => {
    e.preventDefault();
    setStep(2);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    navigate("/admin/requests");
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-6 font-sans relative overflow-hidden bg-[#3E362E]">
      
      {/* Background Image */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center opacity-40"
        style={{ backgroundImage: `url(${adminBg})` }}
      ></div>

      {/* Logo Section */}
      <div className="relative md:absolute top-0 md:top-8 md:left-8 z-20 flex flex-col items-center md:items-start mb-10 md:mb-0">
        <h1 className="text-2xl font-black text-[#C5A059] tracking-[0.2em] uppercase flex items-center gap-2">
          <ScissorIcon className="w-6 h-6 text-[#3E362E] fill-[#C5A059] stroke-[#C5A059] stroke-[1px]" />
          Barber <span className="text-white">Pro</span>
        </h1>
        <div className="h-[2px] w-full bg-[#C5A059] mt-1 opacity-40"></div>
        <p className="text-[9px] text-[#EAD8C0] tracking-[0.4em] uppercase mt-1 text-center w-full">Est. 2026</p>
      </div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-[#3E362E] via-transparent to-[#C5A059]/20"></div>

      {/* Login Card */}
      <div className="w-full max-w-md bg-white/95 backdrop-blur-md rounded-[2.5rem] md:rounded-[3rem] p-8 md:p-14 shadow-2xl border border-white/20 relative z-10 animate-in fade-in zoom-in duration-500">
        
        {/* Header */}
        <div className="text-center mb-10">
          <div className="bg-[#3E362E] w-14 h-14 md:w-16 md:h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl ring-4 ring-[#C5A059]/20">
            <ScissorIcon className="w-8 h-8 fill-[#C5A059]" />
          </div>
          <h2 className="text-2xl md:text-3xl font-black text-[#3E362E] tracking-tight uppercase">Admin Access</h2>
          <p className="text-[#C5A059] text-[10px] font-black uppercase tracking-[0.3em] mt-2">
            {step === 1 ? "Platform Management" : "Secure 2FA Verification"}
          </p>
        </div>

        {step === 1 ? (
          <form onSubmit={handleNext} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-[#8D7B68] text-[10px] font-black uppercase tracking-widest ml-1">Admin Email</label>
              <input 
                type="email" 
                required
                className="w-full px-6 py-4 bg-[#FDF5E6] border border-[#EAD8C0] rounded-2xl text-[#3E362E] font-bold focus:border-[#C5A059] outline-none transition-all shadow-inner" 
                placeholder="admin@barberpro.com" 
              />
            </div>
            <div className="space-y-2">
              <label className="block text-[#8D7B68] text-[10px] font-black uppercase tracking-widest ml-1">Password</label>
              <input 
                type="password" 
                required
                className="w-full px-6 py-4 bg-[#FDF5E6] border border-[#EAD8C0] rounded-2xl text-[#3E362E] font-bold focus:border-[#C5A059] outline-none transition-all shadow-inner" 
                placeholder="••••••••" 
              />
            </div>
            <button className="w-full bg-[#3E362E] py-5 rounded-2xl font-black text-[#FFFBF2] hover:bg-[#2A241F] transition-all shadow-lg tracking-[0.2em] uppercase text-xs mt-4">
              Next Step →
            </button>
          </form>
        ) : (
          <form onSubmit={handleLogin} className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
            <div className="text-center space-y-4">
              <label className="block text-[#8D7B68] text-[10px] font-black uppercase tracking-widest">Enter 6-Digit MPIN</label>
              <div className="flex justify-between gap-1 md:gap-2">
                {[...Array(6)].map((_, i) => (
                  <input 
                    key={i}
                    type="text"
                    maxLength="1"
                    className="w-10 h-12 md:w-12 md:h-14 bg-[#FDF5E6] border border-[#EAD8C0] rounded-xl text-center text-lg md:text-xl font-black text-[#3E362E] focus:border-[#C5A059] focus:bg-white outline-none transition-all"
                  />
                ))}
              </div>
              <p className="text-[10px] text-[#C5A059] font-bold cursor-pointer hover:underline uppercase tracking-widest">Resend Code?</p>
            </div>
            <div className="flex gap-4">
               <button 
                type="button"
                onClick={() => setStep(1)}
                className="flex-1 border-2 border-[#3E362E] py-4 rounded-2xl font-black text-[#3E362E] hover:bg-[#3E362E] hover:text-white transition-all tracking-[0.1em] uppercase text-[10px]"
               >
                 Back
               </button>
               <button className="flex-[2] bg-[#C5A059] py-4 rounded-2xl font-black text-white hover:bg-[#b08d4a] transition-all shadow-lg tracking-[0.1em] uppercase text-[10px]">
                 Verify & Login
               </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default AdminLogin;