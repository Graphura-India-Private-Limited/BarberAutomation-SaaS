import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import ServiceSummary from "../../components/booking/ServiceSummary";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";

export default function CustomerDetails() {
  const navigate = useNavigate();
  const location = useLocation();

  const { service = { name: "Classic Haircut", price: 200 }, barber = { name: "John" } } = location.state || {};

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleContinue = () => {
    if (!form.name || !form.phone) {
      alert("Please fill required fields");
      return;
    }

    navigate("/customer/booking", {
      state: { service, barber, customer: form }
    });
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[#FAF6F0] text-[#3E362E] font-sans antialiased flex flex-col selection:bg-[#C5A059] selection:text-white relative overflow-hidden">
        
        {/* --- SHINY LUXURY GRADIENT GLOW LAYERS (No Image Needed) --- */}
        {/* 1. Top-Left Vibrant Golden Shimmer */}
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-gradient-to-br from-[#C5A059]/15 via-[#EADDCA]/20 to-transparent rounded-full blur-[120px] pointer-events-none animate-pulse duration-[7000ms]" />
        
        {/* 2. Intense Center Soft Ambient Light */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#EADDCA]/40 rounded-full blur-[140px] pointer-events-none" />
        
        {/* 3. Bottom-Right Warm Gold Accent */}
        <div className="absolute -bottom-20 -right-20 w-[600px] h-[600px] bg-gradient-to-tl from-[#C5A059]/15 via-[#FAF6F0] to-transparent rounded-full blur-[100px] pointer-events-none" />

        {/* 4. Tiny Floating Highlights for Shiny Effect */}
        <div className="absolute top-1/3 right-12 w-3 h-3 bg-[#C5A059]/30 rounded-full blur-xs pointer-events-none animate-bounce duration-[5000ms]" />
        <div className="absolute bottom-1/3 left-16 w-5 h-5 bg-[#C5A059]/20 rounded-full blur-sm pointer-events-none animate-pulse duration-[4000ms]" />
        {/* ----------------------------------------------------------- */}

        {/* Return Back Button */}
        <div className="absolute top-6 left-4 sm:left-6 md:left-8 z-20">
          <button
            onClick={() => navigate(-1)}
            className="group flex items-center gap-2 bg-white/90 backdrop-blur-md border border-[#EADDCA] px-4 py-2 rounded-xl text-[#3E362E] font-medium text-xs tracking-wide transition-all duration-300 shadow-md hover:bg-[#3E362E] hover:text-white hover:border-[#3E362E] cursor-pointer"
          >
            <span className="text-sm font-light text-[#C5A059] group-hover:text-white transition-transform duration-300 inline-block">
              &lt;
            </span>
            <span>Back</span>
          </button>
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 w-full flex-grow py-12 md:py-16">
          
          {/* Header Section (Changed back to #3E362E for ultimate contrast on light bg) */}
          <div className="text-center mb-10 md:mb-14 pt-8">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-[#3E362E] tracking-normal">
              Enter Details
            </h2>
            <div className="w-12 h-[2px] bg-[#C5A059] mx-auto mt-4 rounded-full opacity-60" />
          </div>

          {/* Form Layout Grid */}
          <div className={`grid gap-8 items-start ${service ? "grid-cols-1 md:grid-cols-3" : "max-w-xl mx-auto grid-cols-1"}`}>
            
            {/* Left Column: Input Form Card */}
            <div className={`bg-white/80 backdrop-blur-xl rounded-[24px] p-6 sm:p-10 border border-white/60 shadow-[0_20px_50px_rgba(197,160,89,0.05)] transition-all duration-300 hover:shadow-[0_25px_60px_rgba(197,160,89,0.1)] ${service ? "md:col-span-2" : ""}`}>
              
              <div className="space-y-6">
                {/* Full Name Input */}
                <div>
                  <label className="block font-bold text-[11px] text-[#3E362E] uppercase tracking-wider mb-2.5">
                    Full Name <span className="text-[#C5A059]">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    placeholder="e.g. Rahul Sharma"
                    value={form.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3.5 rounded-xl border border-[#EBE6DF] bg-[#FAF9F6] text-[#3E362E] text-sm font-light transition-all duration-300 outline-none placeholder:text-stone-400 focus:border-[#C5A059] focus:bg-white focus:shadow-[0_0_0_4px_rgba(197,160,89,0.06)]"
                  />
                </div>
                
                {/* Phone Number Input */}
                <div>
                  <label className="block font-bold text-[11px] text-[#3E362E] uppercase tracking-wider mb-2.5">
                    Phone Number <span className="text-[#C5A059]">*</span>
                  </label>
                  <input
                    type="text"
                    name="phone"
                    placeholder="+91 98765 43210"
                    value={form.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3.5 rounded-xl border border-[#EBE6DF] bg-[#FAF9F6] text-[#3E362E] text-sm font-light transition-all duration-300 outline-none placeholder:text-stone-400 focus:border-[#C5A059] focus:bg-white focus:shadow-[0_0_0_4px_rgba(197,160,89,0.06)]"
                  />
                </div>
                
                {/* Email Address Input */}
                <div>
                  <label className="block font-bold text-[11px] text-[#3E362E] uppercase tracking-wider mb-2.5">
                    Email Address <span className="text-stone-400 font-normal text-xs lowercase italic">(optional)</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    placeholder="rahul@example.com"
                    value={form.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3.5 rounded-xl border border-[#EBE6DF] bg-[#FAF9F6] text-[#3E362E] text-sm font-light transition-all duration-300 outline-none placeholder:text-stone-400 focus:border-[#C5A059] focus:bg-white focus:shadow-[0_0_0_4px_rgba(197,160,89,0.06)]"
                  />
                </div>
              </div>
              
              {/* CTA Continue Button */}
              <button 
                className="w-full mt-8 flex items-center justify-center gap-2 bg-[#C5A059] hover:bg-[#B38F4B] text-white px-8 py-4 rounded-xl font-bold uppercase text-xs tracking-[0.15em] transition-all duration-300 shadow-md hover:shadow-xl hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
                onClick={handleContinue}
              >
                Continue to Payment &rarr;
              </button>
            </div>

            {/* Right Column: Service Summary Card */}
            {service && (
              <div className="md:sticky md:top-24">
                <div className="bg-white/80 backdrop-blur-xl p-6 sm:p-8 rounded-[24px] border border-white/60 shadow-[0_20px_50px_rgba(197,160,89,0.05)]">
                  <ServiceSummary service={service} barber={barber} />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}