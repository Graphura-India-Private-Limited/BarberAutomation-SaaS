import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import ServiceSummary from "../../components/booking/ServiceSummary";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import { Lock } from "lucide-react";

export default function CustomerDetails() {
  const navigate = useNavigate();
  const location = useLocation();

  const { service = { name: "Classic Haircut", price: 200 }, barber = { name: "John" } } = location.state || {};

  // Read stored customer info from localStorage (set at login)
  const isLoggedIn = !!localStorage.getItem("token") && localStorage.getItem("role") === "customer";
  const storedName   = localStorage.getItem("name")   || localStorage.getItem("userName") || "";
  const storedMobile = localStorage.getItem("mobile") || "";
  const storedEmail  = localStorage.getItem("email")  || "";

  const [form, setForm] = useState({
    name:  storedName,
    phone: storedMobile,
    email: storedEmail
  });

  // Keep form in sync if localStorage changes (e.g. user logs in on same tab)
  useEffect(() => {
    if (isLoggedIn) {
      setForm({
        name:  localStorage.getItem("name")   || localStorage.getItem("userName") || "",
        phone: localStorage.getItem("mobile") || "",
        email: localStorage.getItem("email")  || ""
      });
    }
  }, [isLoggedIn]);

  const handleChange = (e) => {
    // Never allow editing phone when logged in
    if (isLoggedIn && e.target.name === "phone") return;
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

  const lockedInputClass = "w-full px-4 py-3.5 rounded-xl border border-[#EBE6DF] bg-stone-100 text-stone-500 text-sm font-medium cursor-not-allowed select-none";
  const editableInputClass = "w-full px-4 py-3.5 rounded-xl border border-[#EBE6DF] bg-[#FAF9F6] text-[#3E362E] text-sm font-light transition-all duration-300 outline-none placeholder:text-stone-400 focus:border-[#C5A059] focus:bg-white focus:shadow-[0_0_0_4px_rgba(197,160,89,0.06)]";

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[#FAF6F0] text-[#3E362E] font-sans antialiased flex flex-col selection:bg-[#C5A059] selection:text-white relative overflow-hidden">
        
        {/* Ambient glows */}
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-gradient-to-br from-[#C5A059]/15 via-[#EADDCA]/20 to-transparent rounded-full blur-[120px] pointer-events-none animate-pulse duration-[7000ms]" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#EADDCA]/40 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute -bottom-20 -right-20 w-[600px] h-[600px] bg-gradient-to-tl from-[#C5A059]/15 via-[#FAF6F0] to-transparent rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute top-1/3 right-12 w-3 h-3 bg-[#C5A059]/30 rounded-full blur-xs pointer-events-none animate-bounce duration-[5000ms]" />
        <div className="absolute bottom-1/3 left-16 w-5 h-5 bg-[#C5A059]/20 rounded-full blur-sm pointer-events-none animate-pulse duration-[4000ms]" />

        {/* Back Button */}
        <div className="absolute top-24 left-4 sm:left-6 md:left-8 z-20">
          <button
            onClick={() => navigate(-1)}
            className="group flex items-center gap-2 bg-white/90 backdrop-blur-md border border-[#EADDCA] px-4 py-2 rounded-xl text-[#3E362E] font-medium text-xs tracking-wide transition-all duration-300 shadow-md hover:bg-[#3E362E] hover:text-white hover:border-[#3E362E] cursor-pointer"
          >
            <span className="text-sm font-light text-[#C5A059] group-hover:text-white transition-transform duration-300 inline-block">&lt;</span>
            <span>Back</span>
          </button>
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 w-full flex-grow py-12 md:py-16">
          
          {/* Header */}
          <div className="text-center mb-10 md:mb-14 pt-8">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-[#3E362E] tracking-normal">
              Enter Details
            </h2>
            <div className="w-12 h-[2px] bg-[#C5A059] mx-auto mt-4 rounded-full opacity-60" />
          </div>

          {/* Form Layout Grid */}
          {/* <div className={`grid gap-8 items-start ${service ? "grid-cols-1 md:grid-cols-3" : "max-w-xl mx-auto grid-cols-1"}`}> */}
          <div className={`grid gap-8 items-start ${service ? "grid-cols-1 lg:grid-cols-3" : "max-w-xl mx-auto grid-cols-1"}`}>
            
            {/* Form Card */}

            <div className={`bg-white/80 backdrop-blur-xl rounded-[24px] p-6 sm:p-10 border border-white/60 shadow-[0_20px_50px_rgba(197,160,89,0.05)] transition-all duration-300 hover:shadow-[0_25px_60px_rgba(197,160,89,0.1)] md:order-2 lg:order-1 ${service ? "lg:col-span-2" : ""}`}>
              
              {/* Logged-in notice banner */}
              {isLoggedIn && (
                <div className="mb-6 flex items-center gap-2.5 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3">
                  <Lock size={13} className="text-emerald-600 shrink-0" />
                  <p className="text-xs font-semibold text-emerald-700 leading-relaxed">
                    Your details are pre-filled from your account. Mobile number is locked for security.
                  </p>
                </div>
              )}

              <div className="space-y-6">
                {/* Full Name */}
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
                    readOnly={isLoggedIn}
                    className={isLoggedIn ? lockedInputClass : editableInputClass}
                  />
                </div>
                
                {/* Phone Number — LOCKED when logged in */}
                <div>
                  <label className="block font-bold text-[11px] text-[#3E362E] uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                    Phone Number <span className="text-[#C5A059]">*</span>
                    {isLoggedIn && (
                      <span className="flex items-center gap-1 text-[9px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full ml-1">
                        <Lock size={9} /> Verified
                      </span>
                    )}
                  </label>
                  <input
                    type="text"
                    name="phone"
                    placeholder="+91 98765 43210"
                    value={form.phone}
                    onChange={handleChange}
                    readOnly={isLoggedIn}
                    className={isLoggedIn ? lockedInputClass : editableInputClass}
                  />
                  {isLoggedIn && (
                    <p className="text-[10px] text-stone-400 mt-1.5 font-medium">
                      This is your registered mobile number and cannot be changed here.
                    </p>
                  )}
                </div>
                
                {/* Email Address */}
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
                    readOnly={isLoggedIn}
                    className={isLoggedIn ? lockedInputClass : editableInputClass}
                  />
                </div>
              </div>
              
              {/* Continue Button */}
              <button 
                className="w-full mt-8 flex items-center justify-center gap-2 bg-[#C5A059] hover:bg-[#B38F4B] text-white px-8 py-4 rounded-xl font-bold uppercase text-xs tracking-[0.15em] transition-all duration-300 shadow-md hover:shadow-xl hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
                onClick={handleContinue}
              >
                Continue to Payment &rarr;
              </button>
            </div>

            {/* Service Summary */}
            {service && (
              <div className="md:order-1 lg:order-2 lg:sticky lg:top-24 md:mx-auto md:max-w-md lg:mx-0 lg:max-w-none">
                <ServiceSummary service={service} barber={barber} />
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}