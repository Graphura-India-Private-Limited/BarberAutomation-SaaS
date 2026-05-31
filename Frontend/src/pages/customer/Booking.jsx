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
  const barber  = location.state?.barber;

  useEffect(() => { window.scrollTo(0, 0); }, []);

  /* ── Empty-state guard ── */
  if (!service) {
    return (
      <>
        <Navbar />
        <div className="bg-[#FAF6F0] min-h-screen flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full text-center border border-[#EADDCA] shadow-sm">
            {/* Body text style */}
            <p className="font-sans text-sm font-normal leading-relaxed text-stone-600 mb-4">
              No ritual or service selected.
            </p>
            {/* Primary button style */}
            <button
              onClick={() => navigate(-1)}
              className="bg-[#3E362E] text-white px-4 py-2.5 rounded-xl font-sans text-xs font-extrabold uppercase tracking-wider cursor-pointer hover:bg-[#C5A059] transition-colors"
            >
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
      theme: { color: "#C5A059" },
    };
    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  return (
    <>
      <Navbar />
      <div className="bg-[#FAF6F0] min-h-screen font-sans text-[#3E362E] selection:bg-[#C5A059] selection:text-white relative overflow-hidden flex flex-col">

        {/* ── Ambient glow layers ── */}
        <div className="absolute top-20 -left-40 w-[600px] h-[600px] bg-gradient-to-br from-[#C5A059]/10 via-[#EADDCA]/20 to-transparent rounded-full blur-[120px] pointer-events-none animate-pulse duration-[8000ms]" />
        <div className="absolute bottom-1/3 right-10 w-[700px] h-[500px] bg-[#EADDCA]/30 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-[500px] h-[500px] bg-[#C5A059]/10 rounded-full blur-[100px] pointer-events-none" />

        {/* ── Hero banner ── */}
        <div className="relative h-[240px] sm:h-[280px] flex items-center justify-center overflow-hidden mb-6">
          <div className="absolute inset-0 bg-gradient-to-b from-[#EADDCA]/20 via-transparent to-[#FAF6F0]" />

          {/* Back button */}
          <div className="absolute top-6 left-4 sm:left-6 md:left-8 z-20">
            <button
              onClick={() => navigate(-1)}
              className="group flex items-center gap-2 bg-white/80 backdrop-blur-md border border-[#EADDCA] px-4 py-2 rounded-xl shadow-md transition-all duration-300 hover:bg-[#3E362E] hover:border-[#3E362E] cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-[#C5A059] group-hover:text-white transition-transform duration-300 group-hover:-translate-x-0.5" />
              {/* Button text */}
              <span className="font-sans text-xs font-extrabold uppercase tracking-wider text-[#3E362E] group-hover:text-white transition-colors">
                Back
              </span>
            </button>
          </div>

          {/* Hero title */}
          <div className="relative z-10 text-center px-4 max-w-3xl mx-auto pt-6">

            {/* ── Kicker / minor subheading ── */}
            <span className="font-sans text-[11px] font-extrabold uppercase tracking-widest text-[#C5A059] bg-white/80 backdrop-blur-md border border-[#EADDCA] px-4 py-1.5 rounded-full shadow-sm inline-block mb-5">
              Step 04 — Finalize Ritual
            </span>

            {/* ── Primary section header ── */}
            <h1 className="leading-none">
              {/* Line 1 — sans-serif, black, uppercase, tight */}
              <span className="block font-sans font-black uppercase text-4xl sm:text-5xl tracking-tight text-stone-900">
                Confirm
              </span>
              {/* Line 2 — serif, italic, gold accent */}
              <span className="block font-serif italic text-3xl sm:text-4xl text-[#C5A059] normal-case mt-1">
                Booking
              </span>
            </h1>

            <div className="w-16 h-[2px] bg-[#C5A059] mx-auto mt-5" />
          </div>
        </div>

        {/* ── Main content ── */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 relative z-10 flex-grow w-full">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

            {/* ── Left column: Payment card ── */}
            <div className="lg:col-span-2 bg-white/90 backdrop-blur-md rounded-[32px] p-6 sm:p-10 border border-[#EADDCA] shadow-[0_10px_30px_rgba(0,0,0,0.01)] flex flex-col justify-between">
              <div>

                {/* Card section header */}
                <div className="flex items-center gap-2.5 mb-6 border-b border-[#FAF6F0] pb-4">
                  <CreditCard className="w-5 h-5 text-[#C5A059]" />
                  {/* Section header (scaled for card) */}
                  <h2 className="font-sans font-black uppercase text-xl tracking-tight text-stone-900">
                    Payment Gateway{" "}
                    <span className="font-serif italic normal-case text-[#C5A059]">
                      Allocation
                    </span>
                  </h2>
                </div>

                {/* Token scorecard */}
                <div className="bg-[#FAF6F0] rounded-2xl p-6 border border-[#EADDCA]/60 mb-8">
                  <div className="flex justify-between items-center mb-3">
                    {/* Minor subheading / kicker */}
                    <span className="font-sans text-[11px] font-extrabold uppercase tracking-widest text-[#C5A059]">
                      Premium Token Amount
                    </span>
                    {/* Stat — kept serif for luxury number feel */}
                    <span className="text-3xl sm:text-4xl font-serif font-black text-[#3E362E]">
                      ₹{tokenAmount}
                    </span>
                  </div>

                  <div className="flex items-start gap-2 pt-3 border-t border-[#EADDCA]/40 mt-3">
                    <ShieldCheck className="w-4 h-4 text-[#C5A059] flex-shrink-0 mt-0.5" />
                    {/* Body text */}
                    <p className="font-sans text-sm font-normal leading-relaxed text-stone-600">
                      Secure your premium slot allocation instantly by paying a 20% token deposit online.
                      The remaining balance can be handled gracefully at the salon counter.
                    </p>
                  </div>
                </div>

                {/* What's included note */}
                <div className="mb-8 space-y-3">
                  {/* Kicker label */}
                  <p className="font-sans text-[11px] font-extrabold uppercase tracking-widest text-[#C5A059]">
                    What this covers
                  </p>
                  {[
                    "Confirmed time slot with your selected barber",
                    "Priority queue entry on arrival",
                    "Full amount adjustable at salon",
                  ].map((point, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#C5A059] mt-1.5 flex-shrink-0" />
                      {/* Body text */}
                      <p className="font-sans text-sm font-normal leading-relaxed text-stone-600">
                        {point}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* ── Primary CTA button ── */}
              <button
                onClick={handlePayment}
                className="w-full bg-[#3E362E] text-white py-4 rounded-xl font-sans text-xs font-extrabold uppercase tracking-wider transition-all duration-300 hover:bg-[#C5A059] shadow-md flex items-center justify-center gap-2 cursor-pointer select-none"
              >
                Proceed Securely &nbsp;•&nbsp; Pay ₹{tokenAmount}
              </button>
            </div>

            {/* ── Right column: Service summary (sticky) ── */}
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