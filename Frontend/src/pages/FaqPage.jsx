import React, { useState, useEffect } from "react";
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

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
    <Navbar />
    <section className="relative py-20 md:py-28 overflow-hidden">

      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1622286342621-4bd786c2447c?q=80&w=1600&auto=format&fit=crop"
          alt="Luxury salon background"
          className="w-full h-full object-cover"
        />

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/70" />

        {/* Luxury Gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/70" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-6">

        <div className="text-center mb-14">
          <span className="text-[12px] font-black uppercase tracking-[0.3em] text-[#C5A059]">
            Questions & Answers
          </span>

          <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight text-white mt-3">
            Frequently Asked
            <span className="text-[#C5A059] italic font-serif">
              {" "}Questions
            </span>
          </h2>

          <div className="w-16 h-1 bg-[#C5A059] mx-auto mt-4 rounded-full" />
        </div>

        <div className="space-y-4">
          {FAQS.map((faq, index) => {
            const isOpen = openFaq === index;

            return (
              <div
                key={index}
                className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden shadow-xl"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : index)}
                  className="w-full flex items-center justify-between p-6 text-left"
                >
                  <h3 className="font-black text-sm md:text-base text-white uppercase tracking-wide">
                    {faq.q}
                  </h3>

                  <div
                    className={`transition-transform duration-300 ${
                      isOpen ? "rotate-45" : ""
                    }`}
                  >
                    <svg
                      className="w-5 h-5 text-[#C5A059]"
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
                    <div className="px-6 pb-6 text-sm leading-relaxed text-stone-200 font-serif italic">
                      {faq.a}
                    </div>
                  </div>
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
    <Footer />
    </>
  );
}

export default FaqPage;