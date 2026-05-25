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

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Navbar />

      <section className="relative py-16 sm:py-20 md:py-28 overflow-hidden bg-[#FAF6F0]">
        
        {/* Luxury Glow Background */}
        <div className="absolute top-0 left-0 w-52 sm:w-72 h-52 sm:h-72 bg-[#C5A059]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-60 sm:w-96 h-60 sm:h-96 bg-[#EADDCA]/40 rounded-full blur-3xl" />

        {/* --- BACK TO HOME BUTTON (Top Left Corner) --- */}
<div className="absolute top-4 left-4 sm:top-6 sm:left-6 md:top-8 md:left-8 z-20">
  <button
    onClick={() => {
      navigate("/"); // Direct path to home page
    }}
    className="inline-flex items-center justify-center gap-2 bg-white/80 backdrop-blur-md border border-[#e6d5c3] text-[#3E362E] p-2.5 sm:px-4 sm:py-2 rounded-xl font-black uppercase text-[10px] tracking-[0.15em] hover:bg-[#3E362E] hover:text-white transition-all hover:scale-105 shadow-md cursor-pointer"
    title="Go to Home"
  >
    <svg
      className="w-4 h-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M19 12H5m7 7l-7-7 7-7"
      />
    </svg>
    <span className="hidden sm:inline">Back </span>
  </button>
</div>

        {/* Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6">

          {/* Header */}
          <div className="text-center mb-10 sm:mb-14">
            <span className="text-[10px] sm:text-[12px] font-black uppercase tracking-[0.25em] sm:tracking-[0.35em] text-[#C5A059]">
              Questions & Answers
            </span>

            <h2 className="text-3xl sm:text-4xl md:text-6xl font-black uppercase tracking-tight text-[#3E362E] mt-3 sm:mt-4 leading-tight">
              Frequently Asked
              <span className="text-[#C5A059] italic font-serif">
                {" "}Questions
              </span>
            </h2>

            <div className="w-16 sm:w-20 h-1 bg-[#C5A059] mx-auto mt-4 sm:mt-5 rounded-full" />

            <p className="max-w-2xl mx-auto text-stone-500 mt-5 sm:mt-6 text-xs sm:text-sm md:text-base leading-relaxed font-serif italic px-2">
              Everything you need to know about appointments, bookings,
              payments, and salon services.
            </p>
          </div>

          {/* FAQ Section */}
          <div className="space-y-4">
            {FAQS.map((faq, index) => {
              const isOpen = openFaq === index;

              return (
                <div
                  key={index}
                  className="bg-white/80 backdrop-blur-md border border-[#e6d5c3] rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    className="w-full flex items-center justify-between gap-4 p-4 sm:p-5 md:p-6 text-left"
                  >
                    <h3 className="font-black text-[12px] sm:text-sm md:text-base text-[#3E2C1C] uppercase tracking-wide leading-relaxed">
                      {faq.q}
                    </h3>

                    <div
                      className={`flex-shrink-0 transition-transform duration-300 ${
                        isOpen ? "rotate-45" : ""
                      }`}
                    >
                      <svg
                        className="w-5 h-5 text-[#B8864A]"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 4v16m8-8H4"
                        />
                      </svg>
                    </div>
                  </button>

                  <div
                    className={`grid transition-all duration-300 ease-in-out ${
                      isOpen
                        ? "grid-rows-[1fr] opacity-100"
                        : "grid-rows-[0fr] opacity-0"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <div className="px-4 sm:px-5 md:px-6 pb-5 md:pb-6 text-xs sm:text-sm leading-relaxed text-[#6b4f3b] font-serif">
                        {faq.a}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom CTA Button */}
          <div className="text-center mt-10 sm:mt-14">
            <button
              onClick={() => navigate("/customer/services")}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-[#3E362E] text-white px-6 sm:px-10 py-3.5 sm:py-4 rounded-xl font-black uppercase text-[10px] sm:text-[11px] tracking-[0.2em] hover:bg-[#C5A059] transition-all hover:scale-105 shadow-lg cursor-pointer"
            >
              Book Appointment

              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 12h14m-6-6l6 6-6 6"
                />
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