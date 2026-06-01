import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

const FAQS = [
  {
    q: "How do I book an appointment?",
    a: "Simply browse services, choose your barber, select a time slot, and confirm your booking online.",
  },
  {
    q: "Do I need to pay full amount online?",
    a: "No. You only pay a small token amount online. Remaining payment can be done at the salon.",
  },
  {
    q: "Can I choose my preferred barber?",
    a: "Yes, you can select your favorite barber during the booking process.",
  },
  {
    q: "Are walk-ins allowed?",
    a: "Yes, but we highly recommend booking online to avoid waiting time.",
  },
  {
    q: "What products do you use?",
    a: "We use premium professional brands including Wella, L'Oréal, Schwarzkopf and more.",
  },
  {
    q: "Can I cancel or reschedule my appointment?",
    a: "Yes, appointments can be rescheduled or cancelled from your booking history section.",
  },
];

function FaqPage() {
  const [openFaq, setOpenFaq] = useState(null);
  const navigate = useNavigate();

  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <>
      <Navbar />

      <section className="relative py-16 sm:py-20 md:py-28 overflow-hidden bg-[#FAF6F0] selection:bg-[#C5A059] selection:text-white">

        {/* Glow */}
        <div className="absolute top-0 left-0 w-52 sm:w-72 h-52 sm:h-72 bg-[#C5A059]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-60 sm:w-96 h-60 sm:h-96 bg-[#EADDCA]/40 rounded-full blur-3xl pointer-events-none" />

        {/* Back button */}
        <div className="absolute top-6 left-4 sm:left-6 md:left-8 z-20">
          <button
            onClick={() => navigate("/")}
            className="group flex items-center gap-3 bg-white/70 backdrop-blur-md border border-[#EADDCA] px-5 py-2.5 rounded-2xl text-[#3E362E] font-sans font-extrabold text-[11px] uppercase tracking-widest transition-all duration-300 shadow-sm hover:bg-[#3E362E] hover:text-white hover:border-[#3E362E] hover:scale-105 cursor-pointer"
          >
            <span className="text-sm font-light text-[#C5A059] group-hover:text-white transition-transform duration-300 transform group-hover:-translate-x-1 inline-block">
              &lt;
            </span>
            Return
          </button>
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6">

          {/* ── Header ── */}
          <div className="text-center mb-14 sm:mb-20 pt-10 sm:pt-4">

            {/* Kicker tag */}
            <span className="font-sans text-[11px] font-extrabold uppercase tracking-widest text-[#C5A059] bg-white border border-[#EADDCA] px-4 py-1.5 rounded-full shadow-sm">
              Inquiries &amp; Assistance
            </span>

            {/* Primary header */}
            <h2 className="mt-6 leading-none">
              <span className="block font-sans font-black uppercase tracking-tight text-4xl sm:text-5xl md:text-6xl text-stone-900">
                Frequently Asked
              </span>
              <span className="block font-serif italic text-3xl sm:text-4xl md:text-5xl text-[#C5A059] normal-case mt-1">
                Questions
              </span>
            </h2>

            <div className="w-16 h-[2px] bg-[#C5A059] mx-auto mt-6" />

            {/* Body text */}
            <p className="max-w-2xl mx-auto font-sans text-sm font-normal leading-relaxed text-stone-600 mt-5 px-2">
              Everything you need to know about premium appointments, seamless bookings, payment safety, and luxury grooming services.
            </p>
          </div>

          {/* ── FAQ Grid ── */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-start">
            {FAQS.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div
                  key={index}
                  className={`group overflow-hidden border transition-all duration-500 rounded-[22px] ${
                    isOpen
                      ? "bg-white border-[#C5A059] shadow-[0_15px_40px_rgba(197,160,89,0.06)] scale-[1.01]"
                      : "bg-white/60 backdrop-blur-md border-[#EADDCA] hover:bg-white hover:border-[#C5A059]/50"
                  }`}
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    className="w-full flex items-center justify-between gap-4 p-5 sm:p-6 text-left cursor-pointer select-none"
                  >
                    {/* Question — minor subheading style */}
                    <h3 className="font-sans font-extrabold text-[11px] uppercase tracking-widest text-stone-900 leading-relaxed">
                      {faq.q}
                    </h3>

                    <div className={`flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center transition-all duration-300 ${
                      isOpen ? "bg-[#C5A059]/20 text-[#3E362E] rotate-45" : "bg-stone-100 text-stone-400"
                    }`}>
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                      </svg>
                    </div>
                  </button>

                  <div className={`grid transition-all duration-500 ease-in-out ${
                    isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                  }`}>
                    <div className="overflow-hidden">
                      {/* Answer — body text style */}
                      <p className="px-5 sm:px-6 pb-6 font-sans text-sm font-normal leading-relaxed text-stone-600 border-t border-stone-50 pt-4 mt-1">
                        {faq.a}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* ── CTA ── */}
          <div className="text-center mt-16">
            <button
              onClick={() => navigate("/customer/services")}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-gradient-to-r from-[#C5A059] to-[#D4B373] text-[#2A241F] px-8 py-4 rounded-xl font-sans font-extrabold uppercase text-xs tracking-wider hover:scale-105 transition-all duration-300 shadow-md cursor-pointer"
            >
              Book Appointment
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

        </div>
      </section>

      <Footer />
    </>
  );
}

export default FaqPage;
