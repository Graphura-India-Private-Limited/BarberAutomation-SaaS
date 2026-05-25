import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

import {
  ShieldCheck,
  CalendarDays,
  CreditCard,
  RefreshCcw,
  Scissors,
  UserCheck,
  Lock,
  PhoneCall,
  ArrowLeft,
} from "lucide-react";

function TermsPage() {
  const navigate = useNavigate();

  const sections = [
    {
      title: "Appointments & Bookings",
      icon: CalendarDays,
      content:
        "Clients are advised to book appointments in advance. Walk-ins are accepted based on availability. Late arrivals may reduce service time to avoid delays for other clients.",
    },
    {
      title: "Payments",
      icon: CreditCard,
      content:
        "We accept UPI, debit cards, credit cards, cash, and online payments. Full or partial advance payment may be required for selected premium services.",
    },
    {
      title: "Cancellation Policy",
      icon: RefreshCcw,
      content:
        "Appointments can be cancelled or rescheduled before the scheduled slot. Frequent cancellations or no-shows may result in temporary booking restrictions.",
    },
    {
      title: "Refund Policy",
      icon: ShieldCheck,
      content:
        "Payments made for completed services are generally non-refundable. Refund eligibility depends on service conditions and management approval.",
    },
    {
      title: "Service Disclaimer",
      icon: Scissors,
      content:
        "Service outcomes may vary depending on hair type, skin type, and customer preferences. We recommend consultation before premium treatments.",
    },
    {
      title: "User Responsibilities",
      icon: UserCheck,
      content:
        "Users must provide accurate booking details, contact information, and payment information. Misuse of the platform may result in account suspension.",
    },
    {
      title: "Privacy & Security",
      icon: Lock,
      content:
        "Customer information is securely stored and used only for appointments, communication, and service improvements. We do not sell personal data.",
    },
    {
      title: "Contact Information",
      icon: PhoneCall,
      content:
        "For support, complaints, or queries regarding bookings and services, customers may contact our salon support team directly.",
    },
  ];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-[#FAF6F0] overflow-hidden relative">

        {/* Background Glow */}
        <div className="absolute top-0 left-0 w-72 h-72 bg-[#C5A059]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#E8D5C4]/20 rounded-full blur-3xl" />

       {/* HERO */}
<section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8 pb-14">

  {/* Back Button */}
 <button
  onClick={() => navigate("/")}
  className="absolute left-4 sm:left-6 top-4 sm:top-6 flex items-center gap-2 bg-white/90 backdrop-blur-md border border-[#EADDCA] px-4 py-2.5 rounded-2xl text-[#3E362E] font-bold text-sm hover:bg-[#C5A059] hover:text-white transition-all shadow-md hover:scale-105 cursor-pointer z-20"
>
  <ArrowLeft className="w-4 h-4" />
  Back
</button>

  {/* Heading */}
  <div className="text-center pt-14 sm:pt-16">
    <span className="text-[11px] sm:text-[12px] font-black uppercase tracking-[0.35em] text-[#C5A059]">
      Legal Information
    </span>

    <h1 className="mt-5 text-3xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight text-[#3E362E] leading-tight">
      Terms &
      <span className="text-[#C5A059] italic font-serif normal-case">
        {" "}Conditions
      </span>
    </h1>

    <div className="w-20 h-1 bg-[#C5A059] mx-auto mt-6 rounded-full" />

    <p className="max-w-2xl mx-auto mt-6 text-stone-600 leading-relaxed text-sm sm:text-base px-2">
      Please read these terms and conditions carefully before using our
      salon booking platform and premium grooming services.
    </p>
  </div>
</section>

        {/* TERMS GRID */}
        <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pb-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-7">

            {sections.map((item, index) => {
              const Icon = item.icon;

              return (
                <div
                  key={index}
                  className="group bg-white/80 backdrop-blur-md border border-[#EADDCA] rounded-3xl p-5 sm:p-8 hover:-translate-y-1 hover:shadow-2xl transition-all duration-300"
                >
                  {/* Top */}
                  <div className="flex items-start gap-4 sm:gap-5 mb-5">

                    {/* Number */}
                    <div className="flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[#FEF3E2] border border-[#EADDCA] flex items-center justify-center text-[#C5A059] font-black text-base sm:text-lg shadow-sm">
                      {index + 1}
                    </div>

                    {/* Title + Icon */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 sm:gap-3 mb-2 flex-wrap">

                        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#C5A059]/10 text-[#C5A059] flex items-center justify-center group-hover:bg-[#C5A059] group-hover:text-white transition-all">
                          <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                        </div>

                        <h2 className="text-base sm:text-xl font-black uppercase tracking-wide text-[#3E362E] leading-snug">
                          {item.title}
                        </h2>
                      </div>

                      <div className="w-12 h-[2px] bg-[#C5A059] rounded-full" />
                    </div>
                  </div>

                  {/* Content */}
                  <p className="text-stone-600 leading-relaxed text-sm sm:text-base">
                    {item.content}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Bottom Notice */}
          <div className="mt-14 sm:mt-16">
            <div className="bg-gradient-to-r from-[#3E362E] to-[#5B4B3F] rounded-3xl p-6 sm:p-8 md:p-10 text-center shadow-2xl border border-[#C5A059]/20">

              <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white/10 backdrop-blur-md mb-5">
                <ShieldCheck className="w-7 h-7 sm:w-8 sm:h-8 text-[#C5A059]" />
              </div>

              <h3 className="text-xl sm:text-2xl md:text-3xl font-black uppercase tracking-tight text-white mb-4 leading-tight">
                Your Trust Matters
              </h3>

              <p className="max-w-2xl mx-auto text-stone-300 leading-relaxed text-sm sm:text-base">
                By using our platform and services, you agree to comply with
                all the terms mentioned above. We are committed to providing
                a secure, premium, and transparent experience for every client.
              </p>
            </div>
          </div>
          {/* Bottom Action Buttons */}
<div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">

  {/* Home Button */}
  <button
  onClick={() => {
    navigate("/", { replace: true });
    window.scrollTo(0, 0);
  }}
  className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-[#3E362E] text-white font-black uppercase tracking-[0.2em] text-[11px] hover:bg-[#C5A059] transition-all hover:scale-105 shadow-lg cursor-pointer"
>
  Back to Home
</button>

  {/* Booking Button */}
  <button
    onClick={() => navigate("/customer/services")}
    className="w-full sm:w-auto px-8 py-4 rounded-2xl border-2 border-[#C5A059] text-[#C5A059] font-black uppercase tracking-[0.2em] text-[11px] hover:bg-[#C5A059] hover:text-white transition-all hover:scale-105 cursor-pointer"
  >
    Accept & Continue
  </button>

</div>
        </section>
      </div>

      <Footer />
    </>
  );
}

export default TermsPage;