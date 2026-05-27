import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { ArrowLeft, ShieldCheck, CreditCard } from "lucide-react";
import ServiceSummary from "../../components/booking/ServiceSummary";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";

export default function Booking() {
  const location = useLocation();
  const navigate = useNavigate();

  const service = location.state?.service;
  const barber = location.state?.barber;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!service) {
    return (
      <>
        <Navbar />
        <div className="bg-[#FAF6F0] min-h-screen flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full text-center border border-[#EADDCA] shadow-sm">
            <p className="text-sm text-amber-700 font-bold mb-4">No ritual or service selected.</p>
            <button onClick={() => navigate(-1)} className="bg-[#3E362E] text-white px-4 py-2 rounded-xl text-xs uppercase tracking-wider font-bold">
              Go Back
            </button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  const tokenAmount = Math.round(service.price * 0.2);

  const handlePayment = () => {
    const options = {
      key: "rzp_test_1234567890",
      amount: tokenAmount * 100,
      currency: "INR",
      name: "Barber Booking",
      description: `${service.name} (Token Payment)`,
      handler: function () {
        alert("Token Payment Successful ✅");
      },
      theme: { color: "#C5A059" }
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  return (
    <>
      <Navbar />
      <div className="bg-[#FAF6F0] min-h-screen font-sans text-[#3E362E] selection:bg-[#C5A059] selection:text-white relative overflow-hidden flex flex-col">
        
        {/* --- SHINY LUXURY GRADIENT GLOW LAYERS --- */}
        <div className="absolute top-20 -left-40 w-[600px] h-[600px] bg-gradient-to-br from-[#C5A059]/10 via-[#EADDCA]/20 to-transparent rounded-full blur-[120px] pointer-events-none animate-pulse duration-[8000ms]" />
        <div className="absolute bottom-1/3 right-10 w-[700px] h-[500px] bg-[#EADDCA]/30 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-[500px] h-[500px] bg-[#C5A059]/10 rounded-full blur-[100px] pointer-events-none" />

        {/* Premium Hero Banner Aura */}
        <div className="relative h-[240px] sm:h-[280px] flex items-center justify-center overflow-hidden mb-6">
          <div className="absolute inset-0 bg-gradient-to-b from-[#EADDCA]/20 via-transparent to-[#FAF6F0]" />
          
          {/* RETURN BACK BUTTON */}
          <div className="absolute top-6 left-4 sm:left-6 md:left-8 z-20">
            <button
              onClick={() => navigate(-1)}
              className="group flex items-center gap-2 bg-white/80 backdrop-blur-md border border-[#EADDCA] px-4 py-2 rounded-xl text-[#3E362E] font-medium text-xs tracking-wide transition-all duration-300 shadow-md hover:bg-[#3E362E] hover:text-white hover:border-[#3E362E] cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-[#C5A059] group-hover:text-white transition-transform duration-300 transform group-hover:-translate-x-0.5" />
              <span>Back</span>
            </button>
          </div>

          <div className="relative z-10 text-center px-4 max-w-3xl mx-auto pt-6">
            <span className="text-[10px] font-black uppercase tracking-[0.4em] bg-white/80 backdrop-blur-md border border-[#EADDCA] px-4 py-1.5 rounded-full text-[#C5A059] shadow-sm inline-block mb-4">
              Step 04 — Finalize Ritual
            </span>
            <h1 className="text-4xl sm:text-5xl font-black uppercase tracking-tight text-[#3E362E] font-serif leading-none">
              Confirm <span className="text-[#C5A059] italic normal-case">Booking</span>
            </h1>
            <div className="w-16 h-[2px] bg-[#C5A059] mx-auto mt-5" />
          </div>
        </div>

        {/* Main Layout Content */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 relative z-10 flex-grow w-full">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            
            {/* Left Column: Payment Box (Spans 2 columns on large screens) */}
            <div className="lg:col-span-2 bg-white/90 backdrop-blur-md rounded-[32px] p-6 sm:p-10 border border-[#EADDCA] shadow-[0_10px_30px_rgba(0,0,0,0.01)] flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2.5 mb-6 border-b border-[#FAF6F0] pb-4">
                  <CreditCard className="w-5 h-5 text-[#C5A059]" />
                  <h2 className="text-2xl font-serif font-bold text-[#3E362E]">Payment Gateway Allocation</h2>
                </div>

                {/* Token Scorecard */}
                <div className="bg-[#FAF6F0] rounded-2xl p-6 border border-[#EADDCA]/60 mb-8">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-xs sm:text-sm font-bold tracking-wide text-stone-500 uppercase">Premium Token Amount</span>
                    <span className="text-3xl sm:text-4xl font-serif font-black text-[#3E362E]">₹{tokenAmount}</span>
                  </div>
                  <div className="flex items-start gap-2 pt-3 border-t border-[#EADDCA]/40 mt-3">
                    <ShieldCheck className="w-4 h-4 text-[#C5A059] flex-shrink-0 mt-0.5" />
                    <p className="text-[11px] text-stone-400 font-medium leading-relaxed">
                      Secure your premium slot allocation instantly by paying a 20% token deposit online. The remaining balance can be handled gracefully at the salon counter.
                    </p>
                  </div>
                </div>
              </div>

              {/* Secure Payment Trigger Trigger */}
              <button 
                onClick={handlePayment}
                className="w-full bg-[#3E362E] text-white py-4 rounded-xl font-black text-xs tracking-[0.2em] uppercase transition-all duration-300 hover:bg-[#C5A059] hover:text-[#2A241F] shadow-md flex items-center justify-center gap-2 cursor-pointer select-none"
              >
                Proceed Securely • Pay ₹{tokenAmount}
              </button>
            </div>

            {/* Right Column: Sticky Service Summary Box */}
            <div className="lg:sticky lg:top-24 bg-white/40 backdrop-blur-md rounded-[32px] p-1 border border-transparent">
              <ServiceSummary service={service} barber={barber} />
            </div>

          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}