import React, { useEffect } from "react";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

function TermsPage() {
  const sections = [
    {
      title: "Appointments & Bookings",
      content:
        "Clients are advised to book appointments in advance. Walk-ins are accepted based on availability. Late arrivals may reduce service time to avoid delays for other clients.",
    },
    {
      title: "Payments",
      content:
        "We accept UPI, debit cards, credit cards, cash, and online payments. Full or partial advance payment may be required for selected premium services.",
    },
    {
      title: "Cancellation Policy",
      content:
        "Appointments can be cancelled or rescheduled before the scheduled slot. Frequent cancellations or no-shows may result in temporary booking restrictions.",
    },
    {
      title: "Refund Policy",
      content:
        "Payments made for completed services are generally non-refundable. Refund eligibility depends on service conditions and management approval.",
    },
    {
      title: "Service Disclaimer",
      content:
        "Service outcomes may vary depending on hair type, skin type, and customer preferences. We recommend consultation before premium treatments.",
    },
    {
      title: "User Responsibilities",
      content:
        "Users must provide accurate booking details, contact information, and payment information. Misuse of the platform may result in account suspension.",
    },
    {
      title: "Privacy & Security",
      content:
        "Customer information is securely stored and used only for appointments, communication, and service improvements. We do not sell personal data.",
    },
    {
      title: "Contact Information",
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
    <div className="relative min-h-screen bg-black overflow-hidden">
      
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?q=80&w=1600&auto=format&fit=crop"
          alt="Luxury salon"
          className="w-full h-full object-cover"
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/75" />

        {/* Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/90 via-black/70 to-black/90" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 py-20">

        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-[#C5A059] uppercase tracking-[0.4em] text-xs font-black">
            Legal Information
          </span>

          <h1 className="text-4xl md:text-6xl font-black text-white uppercase mt-4 tracking-tight">
            Terms &
            <span className="text-[#C5A059] italic font-serif">
              {" "}Conditions
            </span>
          </h1>

          <div className="w-24 h-1 bg-[#C5A059] mx-auto mt-6 rounded-full" />

          <p className="max-w-2xl mx-auto text-stone-300 mt-6 text-sm md:text-base leading-relaxed">
            Please read these terms and conditions carefully before using our
            salon booking platform and services.
          </p>
        </div>

        {/* Terms Cards */}
        <div className="grid gap-6 md:grid-cols-2">
          {sections.map((item, index) => (
            <div
              key={index}
              className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl hover:scale-[1.02] transition duration-300"
            >
              <div className="flex items-center gap-4 mb-5">
                <div className="w-12 h-12 rounded-full bg-[#C5A059]/20 border border-[#C5A059]/30 flex items-center justify-center text-[#C5A059] font-black text-lg">
                  {index + 1}
                </div>

                <h2 className="text-white text-lg md:text-xl font-black uppercase tracking-wide">
                  {item.title}
                </h2>
              </div>

              <p className="text-stone-300 leading-relaxed text-sm md:text-base">
                {item.content}
              </p>
            </div>
          ))}
        </div>

        {/* Bottom Notice */}
        <div className="mt-16 text-center">
          <div className="inline-block bg-[#C5A059]/10 border border-[#C5A059]/30 backdrop-blur-md px-8 py-5 rounded-2xl">
            <p className="text-stone-200 text-sm md:text-base">
              By using our platform and services, you agree to comply with all
              the terms mentioned above.
            </p>
          </div>
        </div>
      </div>
    </div>
    <Footer />
    </>
  );
}

export default TermsPage;