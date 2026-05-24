import React, { useEffect } from "react";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

function PrivacyPolicy() {
  const sections = [
    {
      title: "Information We Collect",
      content:
        "We may collect customer information including name, mobile number, email address, booking history, and payment details for service management purposes.",
    },
    {
      title: "How We Use Information",
      content:
        "Your information is used to manage appointments, improve customer experience, send booking notifications, and provide personalized salon services.",
    },
    {
      title: "Payment Security",
      content:
        "All transactions are processed securely through trusted payment gateways. We do not store sensitive banking or card credentials on our servers.",
    },
    {
      title: "Data Protection",
      content:
        "We implement modern security measures to protect customer data from unauthorized access, misuse, or disclosure.",
    },
    {
      title: "Cookies & Analytics",
      content:
        "Our platform may use cookies and analytics tools to improve website functionality, user experience, and service performance.",
    },
    {
      title: "Third-Party Services",
      content:
        "Some services such as payment gateways, maps, and communication tools may be provided by trusted third-party providers.",
    },
    {
      title: "Customer Rights",
      content:
        "Users may request updates, corrections, or deletion of their personal information by contacting our support team.",
    },
    {
      title: "Policy Updates",
      content:
        "This privacy policy may be updated periodically to reflect service improvements, legal requirements, or platform changes.",
    },
  ];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);


  return (
    <>
      <Navbar />

      <div className="relative min-h-screen bg-black overflow-hidden">

        {/* Background */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=1600&auto=format&fit=crop"
            alt="Luxury salon"
            className="w-full h-full object-cover"
          />

          <div className="absolute inset-0 bg-black/75" />
          <div className="absolute inset-0 bg-gradient-to-br from-black/90 via-black/70 to-black/90" />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-6xl mx-auto px-6 py-20">

          {/* Header */}
          <div className="text-center mb-16">
            <span className="text-[#C5A059] uppercase tracking-[0.4em] text-xs font-black">
              Data Protection
            </span>

            <h1 className="text-4xl md:text-6xl font-black text-white uppercase mt-4 tracking-tight">
              Privacy
              <span className="text-[#C5A059] italic font-serif">
                {" "}Policy
              </span>
            </h1>

            <div className="w-24 h-1 bg-[#C5A059] mx-auto mt-6 rounded-full" />

            <p className="max-w-2xl mx-auto text-stone-300 mt-6 text-sm md:text-base leading-relaxed">
              Your privacy and data security are important to us. Please read
              our policy carefully to understand how we collect and use data.
            </p>
          </div>

          {/* Cards */}
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
                By using our platform, you agree to our privacy practices and
                data protection policies.
              </p>
            </div>
          </div>

        </div>
      </div>

      <Footer />
    </>
  );
}

export default PrivacyPolicy;