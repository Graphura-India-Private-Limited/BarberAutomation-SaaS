import React from "react";
import barberImage from "../../assets/login.jpg";

const ScissorIcon = ({ className }) => (
  <svg viewBox="0 0 24 24" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M6 15C7.65685 15 9 13.6569 9 12C9 11.3321 8.7818 10.715 8.4121 10.2148L11.5 12L14.5879 13.7852C14.2182 14.285 14 14.9019 14 15.5645C14 17.2213 15.3431 18.5645 17 18.5645C18.6569 18.5645 20 17.2213 20 15.5645C20 14.2964 19.2155 13.2117 18.102 12.7751L15.3 11.1574L18.102 9.53974C19.2155 9.10313 20 8.01844 20 6.75032C20 5.09347 18.6569 3.75032 17 3.75032C15.3431 3.75032 14 5.09347 14 6.75032C14 7.41292 14.2182 8.02983 14.5879 8.52959L11.5 10.3148L8.4121 8.5322C8.7818 8.03198 9 7.41492 9 6.74731C9 5.09046 7.65685 3.74731 6 3.74731C4.34315 3.74731 3 5.09046 3 6.74731C3 8.40417 4.34315 9.74731 6 9.74731C6.66508 9.74731 7.2798 9.53039 7.7788 9.16335L10.8667 10.9485L7.7788 12.7337C7.2798 12.3667 6.66508 12.1497 6 12.1497C4.34315 12.1497 3 13.4929 3 15.1497C3 16.8066 4.34315 18.1497 6 18.1497V15Z" />
  </svg>
);

function BarberLogin() {
  return (
    <div className="min-h-screen grid md:grid-cols-2 bg-[#FFFBF2]">
      
      {/* Mobile Logo*/}
      <div className="md:hidden flex flex-col items-center pt-10">
        <h1 className="text-xl font-black text-[#C5A059] tracking-[0.2em] uppercase flex items-center gap-2">
          <ScissorIcon className="w-5 h-5 fill-[#C5A059]" />
          Barber <span className="text-[#3E362E]">Pro</span>
        </h1>
        <div className="h-[1.5px] w-32 bg-[#C5A059] mt-1 opacity-50"></div>
        <p className="text-[8px] text-[#8D7B68] tracking-[0.3em] uppercase mt-1">Est. 2026</p>
      </div>

      {/* Left Side: Branding (Visible on md and up) */}
      <div 
        className="hidden md:flex relative bg-cover bg-center" 
        style={{ backgroundImage: `url(${barberImage})` }}
      >
        <div className="absolute inset-0 bg-[#3E362E]/40 backdrop-blur-[1px]"></div>
        
        {/* Logo Section */}
        <div className="absolute top-8 left-8 z-10 flex flex-col items-start">
          <h1 className="text-2xl font-black text-[#C5A059] tracking-[0.2em] uppercase leading-none flex items-center gap-2">
            <ScissorIcon className="w-6 h-6 fill-[#C5A059]" />
            Barber <span className="text-white">Pro</span>
          </h1>
          <div className="h-[2px] w-full bg-[#C5A059] mt-1 opacity-70"></div>
          <p className="text-[10px] text-gray-200 tracking-[0.4em] uppercase mt-1 text-center w-full">Est. 2026</p>
        </div>

        {/* Branding Content */}
        <div className="relative z-10 flex flex-col justify-end p-12 w-full pb-20">
          <h1 className="text-[#C5A059] text-6xl font-black tracking-tighter uppercase leading-none">
            Barber <br/><span className="text-white">Portal</span>
          </h1>
          <div className="h-[2px] w-24 bg-[#C5A059] my-4 opacity-100"></div>
          <p className="text-gray-100 max-w-xs border-l-2 border-[#C5A059] pl-4 italic font-medium">
            Manage your daily schedule and clients through your personalized salon station.
          </p>
        </div>
      </div>

      {/* Right Side: Form */}
      <div className="bg-[#FFFBF2] flex items-center justify-center p-6 md:p-8">
        <div className="w-full max-w-md bg-white rounded-[2rem] md:rounded-[2.5rem] p-8 md:p-12 shadow-[0_20px_50px_rgba(62,54,46,0.1)] border border-[#EAD8C0]">
          
          <div className="text-center mb-10">
            <div className="bg-[#C5A059]/10 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <ScissorIcon className="w-8 h-8 fill-[#C5A059]" />
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-[#3E362E] tracking-tight uppercase">Welcome Back</h2>
            <p className="text-[#8D7B68] text-xs md:text-sm mt-2 font-medium">Enter your salon-assigned credentials</p>
          </div>

          <form className="space-y-6">
            <div className="space-y-1">
              <label className="block text-[#3E362E] text-[10px] font-black uppercase tracking-widest ml-1">Login ID / Email</label>
              <input 
                type="text" 
                className="w-full px-5 py-4 bg-[#FDF5E6]/50 border border-[#EAD8C0] rounded-2xl text-[#3E362E] focus:border-[#C5A059] focus:bg-white outline-none transition-all duration-300 placeholder:text-[#A4907C]/40" 
                placeholder="e.g. B-102" 
              />
            </div>
            <div className="space-y-1">
              <label className="block text-[#3E362E] text-[10px] font-black uppercase tracking-widest ml-1">Password</label>
              <input 
                type="password" 
                className="w-full px-5 py-4 bg-[#FDF5E6]/50 border border-[#EAD8C0] rounded-2xl text-[#3E362E] focus:border-[#C5A059] focus:bg-white outline-none transition-all duration-300 placeholder:text-[#A4907C]/40" 
                placeholder="••••••••" 
              />
            </div>
            <button className="w-full bg-[#3E362E] py-5 rounded-2xl font-black text-[#FFFBF2] hover:bg-[#2A241F] transition-all shadow-xl tracking-[0.2em] uppercase text-xs mt-4 active:scale-95">
              ACCESS PORTAL
            </button>
          </form>
          
          <div className="mt-10 pt-8 border-t border-[#EAD8C0]/50 text-center">
            <p className="text-[9px] md:text-[10px] text-[#8D7B68] uppercase tracking-widest leading-relaxed">
              Forgot credentials? <br />
              <span className="text-[#C5A059] font-black">Contact your Salon Manager</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BarberLogin;