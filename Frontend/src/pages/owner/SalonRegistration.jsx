import React, { useState } from "react";
import shopImage from "../../assets/shop.jpg";


const ScissorIcon = ({ className }) => (
  <svg viewBox="0 0 24 24" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M6 15C7.65685 15 9 13.6569 9 12C9 11.3321 8.7818 10.715 8.4121 10.2148L11.5 12L14.5879 13.7852C14.2182 14.285 14 14.9019 14 15.5645C14 17.2213 15.3431 18.5645 17 18.5645C18.6569 18.5645 20 17.2213 20 15.5645C20 14.2964 19.2155 13.2117 18.102 12.7751L15.3 11.1574L18.102 9.53974C19.2155 9.10313 20 8.01844 20 6.75032C20 5.09347 18.6569 3.75032 17 3.75032C15.3431 3.75032 14 5.09347 14 6.75032C14 7.41292 14.2182 8.02983 14.5879 8.52959L11.5 10.3148L8.4121 8.5322C8.7818 8.03198 9 7.41492 9 6.74731C9 5.09046 7.65685 3.74731 6 3.74731C4.34315 3.74731 3 5.09046 3 6.74731C3 8.40417 4.34315 9.74731 6 9.74731C6.66508 9.74731 7.2798 9.53039 7.7788 9.16335L10.8667 10.9485L7.7788 12.7337C7.2798 12.3667 6.66508 12.1497 6 12.1497C4.34315 12.1497 3 13.4929 3 15.1497C3 16.8066 4.34315 18.1497 6 18.1497V15Z" />
  </svg>
);

function SalonRegistration() {
  const [formData, setFormData] = useState({
    salonName: "",
    ownerName: "",
    mobileNumber: "",
    email: "",
    address: "",
    location: { lat: null, lng: null },
    numBarbers: "",
    pricing: "",
    supportNumber: "",
  });

  const [status, setStatus] = useState("Idle");

  const validateEmail = (email) => {
    return String(email).toLowerCase().match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
  };

  const handleGeoTag = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setFormData({ ...formData, location: { lat: position.coords.latitude, lng: position.coords.longitude } });
        alert("Location Captured!");
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.location.lat) {
      alert("Please capture your salon location first.");
      return;
    }
    setStatus("Pending Approval");
  };

  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-fixed flex items-center justify-center p-6 relative font-sans"
      style={{ backgroundImage: `url(${shopImage})` }}
    >
      {/* Light Luxury Overlay */}
      <div className="absolute inset-0 bg-[#FFFBF2]/90 backdrop-blur-sm"></div>

      {/* Logo Section */}
      <div className="absolute top-8 left-8 z-20 flex flex-col items-start hidden md:flex">
        <h1 className="text-2xl font-black text-[#C5A059] tracking-[0.2em] uppercase flex items-center gap-2">
          <ScissorIcon className="w-7 h-7 fill-[#C5A059] stroke-none" />
          Barber <span className="text-[#3E362E]">Pro</span>
        </h1>
        <div className="h-[2px] w-full bg-[#C5A059] mt-1 opacity-40"></div>
        <p className="text-[10px] text-[#8D7B68] tracking-[0.4em] uppercase mt-1 text-center w-full">Partner Dashboard</p>
      </div>

      <div className="max-w-4xl w-full mx-auto relative z-10 py-12">
        <header className="mb-12 text-center">
          <span className="text-[#C5A059] text-[10px] tracking-[0.5em] uppercase mb-2 block font-black">
            Business Onboarding
          </span>
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-[#3E362E]">
            Register Your <span className="text-transparent" style={{ WebkitTextStroke: '1.2px #C5A059' }}>Salon</span>
          </h1>

          <div className="flex justify-center items-center gap-4 mt-4">
            <div className="h-[1px] w-12 bg-[#EAD8C0]"></div>
            <div className="w-2 h-2 rotate-45 border border-[#C5A059]"></div>
            <div className="h-[1px] w-12 bg-[#EAD8C0]"></div>
          </div>
        </header>

        <form 
          onSubmit={handleSubmit} 
          className="space-y-8 bg-white/60 p-8 md:p-12 rounded-[3rem] border border-[#EAD8C0] shadow-2xl backdrop-blur-xl"
        >
          {/* Section 1: Identity */}
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-[#8D7B68] ml-1">Salon Name *</label>
              <input 
                required minLength={3}
                placeholder="The Royal Barber"
                className="w-full bg-[#FDF5E6]/50 border border-[#EAD8C0] p-4 rounded-2xl focus:border-[#C5A059] focus:bg-white outline-none transition-all text-[#3E362E] placeholder:text-[#A4907C]/50" 
                onChange={(e) => setFormData({...formData, salonName: e.target.value})} 
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-[#8D7B68] ml-1">Owner Full Name *</label>
              <input 
                required 
                placeholder="Rahul Jagtap"
                className="w-full bg-[#FDF5E6]/50 border border-[#EAD8C0] p-4 rounded-2xl focus:border-[#C5A059] focus:bg-white outline-none transition-all text-[#3E362E] placeholder:text-[#A4907C]/50" 
                onChange={(e) => setFormData({...formData, ownerName: e.target.value})} 
              />
            </div>
          </div>

          {/* Section 2: Contact */}
          <div className="grid md:grid-cols-3 gap-6">
            <div className="space-y-2 col-span-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-[#8D7B68] ml-1">Mobile Number *</label>
              <input 
                required type="tel" value={formData.mobileNumber}
                onInput={(e) => {
                  e.target.value = e.target.value.replace(/[^0-9]/g, '').slice(0, 10);
                  setFormData({...formData, mobileNumber: e.target.value});
                }}
                placeholder="98XXXXXXXX"
                className="w-full bg-[#FDF5E6]/50 border border-[#EAD8C0] p-4 rounded-2xl focus:border-[#C5A059] focus:bg-white outline-none text-[#3E362E]" 
              />
            </div>
            <div className="space-y-2 col-span-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-[#8D7B68] ml-1">Email Address</label>
              <input 
                type="email" value={formData.email}
                placeholder="contact@salon.com"
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className={`w-full bg-[#FDF5E6]/50 border p-4 rounded-2xl outline-none transition-all text-[#3E362E] ${
                  formData.email && !validateEmail(formData.email) ? "border-red-300" : "border-[#EAD8C0] focus:border-[#C5A059]"
                }`}
              />
            </div>
            <div className="space-y-2 col-span-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-[#8D7B68] ml-1">Support No. *</label>
              <input 
                required type="tel" value={formData.supportNumber}
                onChange={(e) => {
  // 1. Grab the raw text and clean it in a separate variable
                  const cleanedNumber = e.target.value.replace(/[^0-9]/g, '').slice(0, 10);
  // 2. Update the state with the clean variable
                  setFormData({ ...formData, supportNumber: cleanedNumber });
}}
                placeholder="Helpline No."
                className="w-full bg-[#FDF5E6]/50 border border-[#EAD8C0] p-4 rounded-2xl focus:border-[#C5A059] focus:bg-white outline-none text-[#3E362E]" 
              />
            </div>
          </div>

          {/* Section 3: Location */}
          <div className="space-y-5 p-6 bg-[#C5A059]/5 rounded-[2rem] border border-[#C5A059]/10">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-[#8D7B68] ml-1">Physical Address *</label>
              <textarea 
                required minLength={10}
                placeholder="Shop No. 5, MG Road, Pune..."
                className="w-full bg-white border border-[#EAD8C0] p-4 rounded-2xl focus:border-[#C5A059] outline-none h-24 text-[#3E362E] resize-none" 
                onChange={(e) => setFormData({...formData, address: e.target.value})} 
              />
            </div>
            <button 
              type="button" 
              onClick={handleGeoTag} 
              className={`flex items-center gap-3 px-6 py-3 rounded-xl border transition-all font-black text-[10px] tracking-widest uppercase ${
                formData.location.lat 
                ? "bg-green-50 border-green-200 text-green-600" 
                : "bg-white border-[#C5A059] text-[#C5A059] hover:bg-[#C5A059] hover:text-white"
              }`}
            >
              {formData.location.lat ? "✓ Location Verified" : "📍 Tag GPS Location"}
            </button>
          </div>

          {/* Section 4: Operational Stats */}
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-[#8D7B68] ml-1">Barber Stations *</label>
              <input 
                required type="number" min="1"
                placeholder="Count"
                className="w-full bg-[#FDF5E6]/50 border border-[#EAD8C0] p-4 rounded-2xl focus:border-[#C5A059] outline-none text-[#3E362E]" 
                onChange={(e) => setFormData({...formData, numBarbers: e.target.value})} 
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-[#8D7B68] ml-1">Starting Price (₹) *</label>
              <input 
                required type="number" min="1"
                placeholder="Min. Service Cost"
                className="w-full bg-[#FDF5E6]/50 border border-[#EAD8C0] p-4 rounded-2xl focus:border-[#C5A059] outline-none text-[#3E362E]" 
                onChange={(e) => setFormData({...formData, pricing: e.target.value})} 
              />
            </div>
          </div>

          {/* Submission Button */}
          <div className="pt-4">
            <button 
              disabled={status === "Pending Approval"}
              className={`w-full py-6 rounded-2xl font-black tracking-[0.3em] transition-all uppercase text-[11px]
                ${status === "Pending Approval" 
                  ? "bg-[#EAD8C0] text-[#A4907C] cursor-not-allowed" 
                  : "bg-[#3E362E] text-[#FFFBF2] hover:bg-[#2A241F] shadow-xl hover:scale-[1.01]"}`}
            >
              {status === "Pending Approval" ? "Application Submitted" : "Submit Registration"}
            </button>
          </div>
        </form>

        {status === "Pending Approval" && (
          <div className="mt-8 p-6 bg-[#C5A059]/10 border border-[#C5A059]/20 text-[#3E362E] rounded-[2rem] text-center backdrop-blur-md animate-pulse">
            <p className="text-xs font-bold uppercase tracking-widest">
              Application Under Review. We will contact you shortly.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default SalonRegistration;