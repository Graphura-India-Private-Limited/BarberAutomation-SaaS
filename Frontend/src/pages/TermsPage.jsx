import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import {
  ShieldCheck, CalendarDays, CreditCard, RefreshCcw,
  Scissors, UserCheck, Lock, PhoneCall, Plus, Minus,
} from "lucide-react";

const tags = [
  { id: "all",     label: "All Rules" },
  { id: "booking", label: "Appointments" },
  { id: "finance", label: "Payments & Refunds" },
  { id: "legal",   label: "Responsibilities" },
];

const sections = [
  { title: "Appointments & Bookings", icon: CalendarDays, tag: "booking",
    content: "Clients are advised to book appointments in advance. Walk-ins are accepted based on availability. Late arrivals may reduce service time to avoid delays for other clients." },
  { title: "Payments", icon: CreditCard, tag: "finance",
    content: "We accept UPI, debit cards, credit cards, cash, and online payments. Full or partial advance payment may be required for selected premium services." },
  { title: "Cancellation Policy", icon: RefreshCcw, tag: "booking",
    content: "Appointments can be cancelled or rescheduled before the scheduled slot. Frequent cancellations or no-shows may result in temporary booking restrictions." },
  { title: "Refund Policy", icon: ShieldCheck, tag: "finance",
    content: "Payments made for completed services are generally non-refundable. Refund eligibility depends on service conditions and management approval." },
  { title: "Service Disclaimer", icon: Scissors, tag: "legal",
    content: "Service outcomes may vary depending on hair type, skin type, and customer preferences. We recommend consultation before premium treatments." },
  { title: "User Responsibilities", icon: UserCheck, tag: "legal",
    content: "Users must provide accurate booking details, contact information, and payment information. Misuse of the platform may result in account suspension." },
  { title: "Privacy & Security", icon: Lock, tag: "legal",
    content: "Customer information is securely stored and used only for appointments, communication, and service improvements. We do not sell personal data." },
  { title: "Contact Information", icon: PhoneCall, tag: "legal",
    content: "For support, complaints, or queries regarding bookings and services, customers may contact our salon support team directly." },
];

function TermsPage() {
  const navigate = useNavigate();
  const [openSection,  setOpenSection]  = useState(0);
  const [selectedTag,  setSelectedTag]  = useState("all");

  useEffect(() => { window.scrollTo(0, 0); }, []);

  const filteredSections = selectedTag === "all"
    ? sections
    : sections.filter(s => s.tag === selectedTag);

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-[#FAF6F0] overflow-hidden relative selection:bg-[#C5A059] selection:text-white">

        {/* Glow */}
        <div className="absolute top-[-5%] left-[-10%] w-[600px] h-[600px] bg-[#C5A059]/10 blur-[150px] rounded-full pointer-events-none" />
        <div className="absolute bottom-[20%] right-[-10%] w-[500px] h-[500px] bg-[#E8D5C4]/40 blur-[130px] rounded-full pointer-events-none" />

        {/* ── Hero ── */}
        <section className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 pt-16 pb-10">

          {/* Back button */}
          <button
            onClick={() => navigate("/")}
            className="group absolute left-4 sm:left-6 top-6 flex items-center gap-3 bg-white/70 backdrop-blur-md border border-[#EADDCA] px-5 py-2.5 rounded-2xl text-[#3E362E] font-sans font-extrabold text-[11px] uppercase tracking-widest transition-all duration-300 shadow-sm hover:bg-[#3E362E] hover:text-white hover:border-[#3E362E] hover:scale-105 cursor-pointer z-20"
          >
            <span className="text-sm font-light text-[#C5A059] group-hover:text-white transition-transform duration-300 transform group-hover:-translate-x-1 inline-block">
              &lt;
            </span>
            Return
          </button>

          {/* Heading */}
          <div className="text-center pt-12">

            {/* Kicker tag */}
            <span className="font-sans text-[11px] font-extrabold uppercase tracking-widest text-[#C5A059] bg-white border border-[#EADDCA] px-4 py-1.5 rounded-full shadow-sm">
              Legal Framework
            </span>

            {/* Primary header */}
            <h1 className="mt-6 leading-none">
              <span className="block font-sans font-black uppercase tracking-tight text-4xl sm:text-5xl md:text-6xl text-stone-900">
                Terms &amp;
              </span>
              <span className="block font-serif italic text-3xl sm:text-4xl md:text-5xl text-[#C5A059] normal-case mt-1">
                Conditions
              </span>
            </h1>

            <div className="w-16 h-[2px] bg-[#C5A059] mx-auto mt-6" />

            {/* Body text */}
            <p className="max-w-2xl mx-auto font-sans text-sm font-normal leading-relaxed text-stone-600 mt-5">
              Please review our operating guidelines, cancellation rules, and payment policies to ensure a seamless luxury grooming session.
            </p>
          </div>

          {/* Filter pills */}
          <div className="flex flex-wrap justify-center items-center gap-2 mt-12 max-w-3xl mx-auto px-2">
            {tags.map((tag) => (
              <button
                key={tag.id}
                onClick={() => { setSelectedTag(tag.id); setOpenSection(0); }}
                className={`px-5 py-2.5 rounded-xl font-sans font-extrabold text-[11px] uppercase tracking-widest transition-all duration-300 cursor-pointer ${
                  selectedTag === tag.id
                    ? "bg-[#3E362E] text-white shadow-md scale-105"
                    : "bg-white/80 text-[#3E362E] border border-[#EADDCA] hover:bg-[#C5A059]/10"
                }`}
              >
                {tag.label}
              </button>
            ))}
          </div>
        </section>

        {/* ── Accordion ── */}
        <section className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 pb-20">
          <div className="space-y-4">
            {filteredSections.map((item, index) => {
              const Icon = item.icon;
              const isOpen = openSection === index;
              return (
                <div
                  key={index}
                  className={`group overflow-hidden border transition-all duration-500 rounded-[24px] ${
                    isOpen
                      ? "bg-white border-[#C5A059] shadow-[0_15px_40px_rgba(197,160,89,0.08)] scale-[1.01]"
                      : "bg-white/60 backdrop-blur-md border-[#EADDCA] hover:bg-white hover:border-[#C5A059]/50"
                  }`}
                >
                  <button
                    onClick={() => setOpenSection(isOpen ? -1 : index)}
                    className="w-full flex items-center justify-between text-left p-5 sm:p-6 cursor-pointer select-none"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center border transition-all duration-300 ${
                        isOpen
                          ? "bg-[#3E362E] text-white border-[#3E362E]"
                          : "bg-[#C5A059]/10 text-[#C5A059] border-[#C5A059]/10 group-hover:bg-[#C5A059] group-hover:text-white"
                      }`}>
                        <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                      </div>
                      <div>
                        {/* Kicker */}
                        <span className="block font-sans text-[9px] font-extrabold tracking-widest text-[#C5A059] uppercase mb-0.5">
                          Article {String(index + 1).padStart(2, "0")}
                        </span>
                        {/* Subheading */}
                        <h2 className="font-sans font-extrabold text-[11px] uppercase tracking-widest text-stone-900">
                          {item.title}
                        </h2>
                      </div>
                    </div>

                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all duration-300 ${
                      isOpen ? "bg-[#C5A059]/20 text-[#3E362E]" : "bg-stone-100 text-stone-400"
                    }`}>
                      {isOpen ? <Minus className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                    </div>
                  </button>

                  <div className={`transition-all duration-500 ease-in-out overflow-hidden ${
                    isOpen ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
                  }`}>
                    {/* Body text */}
                    <p className="p-6 pt-0 ml-14 sm:ml-16 border-t border-stone-50 mt-1 font-sans text-sm font-normal leading-relaxed text-stone-600">
                      {item.content}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Notice card */}
          <div className="mt-16">
            <div className="relative overflow-hidden bg-gradient-to-br from-[#2A241F] to-[#14110F] rounded-[32px] p-6 sm:p-8 md:p-10 text-center shadow-2xl border border-white/[0.05]">
              <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#C5A059]/40 to-transparent" />

              <div className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-white/[0.04] border border-white/[0.08] backdrop-blur-md mb-4">
                <ShieldCheck className="w-6 h-6 text-[#C5A059]" />
              </div>

              {/* Section header — dark bg variant */}
              <h3 className="leading-tight mb-3">
                <span className="block font-sans font-black uppercase tracking-tight text-2xl sm:text-3xl text-white">
                  Your Trust Is Our
                </span>
                <span className="block font-serif italic text-xl sm:text-2xl text-[#C5A059] normal-case mt-1">
                  Standard
                </span>
              </h3>

              <p className="max-w-xl mx-auto font-sans text-sm font-normal leading-relaxed text-stone-400">
                By navigating our portal and booking experiences, you gracefully align with our salon rules. We pledge safe, ultra-premium operations for your complete comfort.
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 max-w-sm mx-auto">
            <button
              onClick={() => { navigate("/", { replace: true }); window.scrollTo(0, 0); }}
              className="w-full px-6 py-4 rounded-xl bg-white border border-[#EADDCA] text-[#3E362E] font-sans font-extrabold uppercase tracking-wider text-xs hover:bg-[#3E362E] hover:text-white hover:border-transparent transition-all duration-300 shadow-sm cursor-pointer text-center"
            >
              Declined
            </button>
            <button
              onClick={() => navigate("/customer/services")}
              className="w-full px-6 py-4 rounded-xl bg-gradient-to-r from-[#C5A059] to-[#D4B373] text-[#2A241F] font-sans font-extrabold uppercase tracking-wider text-xs hover:scale-[1.03] transition-all duration-300 shadow-md cursor-pointer text-center"
            >
              I Accept
            </button>
          </div>
        </section>
      </div>

      <Footer />
    </>
  );
}

export default TermsPage;
