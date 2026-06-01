import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import {
  ShieldCheck, Lock, UserCheck, CreditCard,
  RefreshCcw, Search, ChevronRight, Clock,
} from "lucide-react";

const sections = [
  { id: "info-collect",      title: "Information We Collect",  icon: UserCheck,
    content: "We may collect customer information including name, mobile number, email address, booking history, and payment details for service management purposes." },
  { id: "info-use",          title: "How We Use Information",  icon: ShieldCheck,
    content: "Your information is used to manage appointments, improve customer experience, send booking notifications, and provide personalized salon services." },
  { id: "payment-security",  title: "Payment Security",        icon: CreditCard,
    content: "All transactions are processed securely through trusted payment gateways. We do not store sensitive banking or card credentials on our servers." },
  { id: "data-protection",   title: "Data Protection",         icon: Lock,
    content: "We implement modern security measures to protect customer data from unauthorized access, misuse, or disclosure." },
  { id: "cookies-analytics", title: "Cookies & Analytics",     icon: RefreshCcw,
    content: "Our platform may use cookies and analytics tools to improve website functionality, user experience, and service performance." },
  { id: "third-party",       title: "Third-Party Services",    icon: ShieldCheck,
    content: "Some services such as payment gateways, maps, and communication tools may be provided by trusted third-party providers." },
  { id: "customer-rights",   title: "Customer Rights",         icon: UserCheck,
    content: "Users may request updates, corrections, or deletion of their personal information by contacting our support team." },
  { id: "policy-updates",    title: "Policy Updates",          icon: RefreshCcw,
    content: "This privacy policy may be updated periodically to reflect service improvements, legal requirements, or platform changes." },
];

const menuGroups = [
  { label: "Collection & Usage",    pairIndex: 0 },
  { label: "Security & Protection", pairIndex: 1 },
  { label: "Cookies & Providers",   pairIndex: 2 },
  { label: "Rights & Updates",      pairIndex: 3 },
];

function PrivacyPolicy() {
  const navigate = useNavigate();
  const [searchQuery,     setSearchQuery]     = useState("");
  const [activePairIndex, setActivePairIndex] = useState(0);

  useEffect(() => { window.scrollTo(0, 0); }, []);

  const displayedSections = searchQuery
    ? sections.filter(
        (item) =>
          item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.content.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : sections.slice(activePairIndex * 2, activePairIndex * 2 + 2);

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-[#FAF6F0] overflow-hidden relative selection:bg-[#C5A059] selection:text-white">

        {/* Glow */}
        <div className="absolute top-[-100px] left-[-100px] w-[600px] h-[600px] bg-[#C5A059]/10 blur-[140px] rounded-full pointer-events-none" />
        <div className="absolute bottom-[30%] right-[-100px] w-[500px] h-[500px] bg-[#EADDCA]/50 blur-[130px] rounded-full pointer-events-none" />

        {/* ── Hero ── */}
        <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pt-12 sm:pt-16 pb-6">

          {/* Back button */}
          <button
            onClick={() => navigate("/")}
            className="group absolute left-4 sm:left-6 top-4 sm:top-6 flex items-center gap-3 bg-white/70 backdrop-blur-md border border-[#EADDCA] px-5 py-3 rounded-2xl text-[#3E362E] font-sans font-extrabold text-[11px] uppercase tracking-widest transition-all duration-500 shadow-sm hover:bg-[#3E362E] hover:text-white hover:border-[#3E362E] hover:scale-105 cursor-pointer z-20"
          >
            <span className="text-sm font-light text-[#C5A059] group-hover:text-white transition-transform duration-300 transform group-hover:-translate-x-1.5 inline-block">
              &lt;
            </span>
            Return
          </button>

          <div className="text-center pt-14 sm:pt-16">

            {/* Meta badges */}
            <div className="flex flex-wrap items-center justify-center gap-3 mb-5">
              <span className="font-sans text-[11px] font-extrabold uppercase tracking-widest text-[#C5A059] bg-white border border-[#EADDCA] px-3 py-1.5 rounded-xl flex items-center gap-1.5 shadow-sm">
                <Clock className="w-3 h-3" /> 3 Min Read
              </span>
              <span className="font-sans text-[11px] font-extrabold uppercase tracking-widest text-stone-900 bg-[#FEF3E2] border border-[#EADDCA] px-3 py-1.5 rounded-xl shadow-sm">
                Last Updated: May 2026
              </span>
            </div>

            {/* Primary header */}
            <h1 className="leading-none">
              <span className="block font-sans font-black uppercase tracking-tight text-4xl sm:text-6xl md:text-7xl text-stone-900">
                Privacy
              </span>
              <span className="block font-serif italic text-3xl sm:text-5xl md:text-6xl text-[#C5A059] normal-case mt-1 drop-shadow-[0_4px_10px_rgba(197,160,89,0.15)]">
                Policy
              </span>
            </h1>

            <div className="w-24 h-[2px] bg-gradient-to-r from-transparent via-[#C5A059] to-transparent mx-auto mt-6" />

            {/* Body text */}
            <p className="max-w-2xl mx-auto font-sans text-sm font-normal leading-relaxed text-stone-600 mt-5 px-2">
              Browse categories in pairs using our clean sub-navigation bar or perform a quick keyphrase search instantly.
            </p>

            {/* Search bar */}
            <div className="max-w-md mx-auto mt-10 px-4">
              <div className="relative flex items-center bg-white border-2 border-[#EADDCA] focus-within:border-[#C5A059] rounded-2xl px-4 py-3.5 transition-all duration-300 shadow-sm">
                <Search className="w-5 h-5 text-stone-400 mr-3 shrink-0" />
                <input
                  type="text"
                  placeholder="Search keywords (e.g. Security, Cookies)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent font-sans text-sm font-normal text-stone-900 placeholder-stone-400 outline-none"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="font-sans text-[11px] font-extrabold uppercase tracking-widest text-stone-400 hover:text-[#C5A059] transition ml-2 shrink-0"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* ── Content ── */}
        <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pb-20 mt-10">

          {/* Mobile tabs */}
          <div className="lg:hidden flex overflow-x-auto pb-4 mb-6 gap-2 no-scrollbar snap-x">
            {menuGroups.map((group) => (
              <button
                key={`mob-${group.pairIndex}`}
                onClick={() => { setActivePairIndex(group.pairIndex); setSearchQuery(""); }}
                className={`snap-center flex-shrink-0 px-4 py-2.5 rounded-xl font-sans font-extrabold text-[11px] uppercase tracking-widest whitespace-nowrap transition-all duration-300 ${
                  activePairIndex === group.pairIndex && !searchQuery
                    ? "bg-[#3E362E] text-white shadow-sm"
                    : "bg-white text-[#3E362E] border border-[#EADDCA]"
                }`}
              >
                {group.label}
              </button>
            ))}
          </div>

          <div className="flex flex-col lg:flex-row gap-8 items-start">

            {/* Sidebar */}
            <aside className="hidden lg:block w-64 sticky top-28 bg-white/60 backdrop-blur-xl border border-[#EADDCA]/70 p-4 rounded-[24px] shadow-sm">
              {/* Kicker */}
              <p className="font-sans text-[11px] font-extrabold uppercase tracking-widest text-[#C5A059] mb-3 px-2">
                Policy Categories
              </p>
              <nav className="space-y-1">
                {menuGroups.map((group) => (
                  <button
                    key={`desk-${group.pairIndex}`}
                    onClick={() => { setActivePairIndex(group.pairIndex); setSearchQuery(""); }}
                    className={`w-full flex items-center justify-between text-left px-3 py-3 rounded-lg font-sans font-extrabold text-[11px] uppercase tracking-widest transition-all duration-300 ${
                      activePairIndex === group.pairIndex && !searchQuery
                        ? "bg-[#3E362E] text-white shadow-sm scale-[1.01]"
                        : "text-stone-900 hover:bg-[#C5A059]/10 hover:text-[#C5A059]"
                    }`}
                  >
                    <span className="truncate pr-2">{group.label}</span>
                    <ChevronRight className={`w-3 h-3 flex-shrink-0 transition-transform ${
                      activePairIndex === group.pairIndex && !searchQuery ? "rotate-90 text-[#C5A059]" : "opacity-30"
                    }`} />
                  </button>
                ))}
              </nav>
            </aside>

            {/* Cards */}
            <div className="flex-1 w-full grid grid-cols-1 md:grid-cols-2 gap-5 min-h-[260px]">
              {displayedSections.length > 0 ? (
                displayedSections.map((item) => {
                  const Icon = item.icon;
                  const globalIndex = sections.findIndex((s) => s.id === item.id);
                  return (
                    <div
                      key={item.id}
                      className="animate-in fade-in zoom-in-95 flex flex-col justify-between bg-white/90 backdrop-blur-xl border border-[#C5A059]/30 rounded-[32px] p-6 sm:p-8 shadow-sm hover:border-[#C5A059]/60 transition-all duration-300"
                    >
                      <div>
                        <div className="flex items-center gap-3 mb-4 flex-wrap">
                          <div className="w-9 h-9 rounded-xl bg-[#C5A059]/10 text-[#C5A059] flex items-center justify-center border border-[#C5A059]/20 shrink-0">
                            <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                          </div>
                          {/* Subheading */}
                          <h2 className="font-sans font-extrabold text-[11px] uppercase tracking-widest text-stone-900">
                            {item.title}
                          </h2>
                        </div>

                        <div className="w-12 h-[2px] bg-[#C5A059]/40 rounded-full mb-4" />

                        {/* Body text */}
                        <p className="font-sans text-sm font-normal leading-relaxed text-stone-600">
                          {item.content}
                        </p>
                      </div>

                      {/* Section number */}
                      <div className="mt-6 pt-3 border-t border-stone-100 flex justify-end">
                        <span className="font-sans text-[11px] font-extrabold uppercase tracking-widest text-stone-400">
                          Section {String(globalIndex + 1).padStart(2, "0")}
                        </span>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="col-span-1 md:col-span-2 text-center py-16 bg-white/50 border border-dashed border-[#EADDCA] rounded-[32px]">
                  <p className="font-sans text-sm font-normal text-stone-600">No policy sections match your search query.</p>
                  <button
                    onClick={() => setSearchQuery("")}
                    className="mt-3 font-sans text-[11px] font-extrabold uppercase tracking-widest text-[#C5A059] underline"
                  >
                    Reset Filter
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Notice box */}
          <div className="mt-20">
            <div className="relative overflow-hidden bg-gradient-to-br from-[#2A241F] to-[#1A1613] rounded-[32px] p-6 sm:p-10 text-center shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-white/[0.06]">
              <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#FFE6A7]/50 to-transparent" />

              <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white/[0.05] border border-white/[0.1] backdrop-blur-xl mb-5">
                <ShieldCheck className="w-7 h-7 sm:w-8 sm:h-8 text-[#C5A059]" />
              </div>

              {/* Section header — dark bg variant */}
              <h3 className="leading-tight mb-4">
                <span className="block font-sans font-black uppercase tracking-tight text-2xl sm:text-3xl text-white">
                  Your Privacy
                </span>
                <span className="block font-serif italic text-xl sm:text-2xl text-[#C5A059] normal-case mt-1 drop-shadow-[0_0_10px_rgba(197,160,89,0.4)]">
                  Matters
                </span>
              </h3>

              {/* Body text */}
              <p className="max-w-2xl mx-auto font-sans text-sm font-normal leading-relaxed text-stone-400">
                By using our platform and premium services, you agree to our privacy practices and data protection policies. We are strictly committed to keeping your information transparent, secure, and fully confidential.
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
            <button
              onClick={() => { navigate("/", { replace: true }); window.scrollTo(0, 0); }}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white border border-[#EADDCA] text-[#3E362E] font-sans font-extrabold uppercase tracking-wider text-xs hover:bg-[#3E362E] hover:text-white hover:border-transparent transition-all duration-300 hover:scale-105 shadow-md cursor-pointer text-center"
            >
              Back to Home
            </button>
            <button
              onClick={() => navigate("/customer/services")}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-[#C5A059] via-[#E8C878] to-[#C5A059] text-[#2A241F] font-sans font-extrabold uppercase tracking-wider text-xs hover:scale-105 transition-all duration-300 shadow-[0_5px_20px_rgba(197,160,89,0.25)] cursor-pointer text-center"
            >
              Continue
            </button>
          </div>
        </section>
      </div>

      <Footer />
    </>
  );
}

export default PrivacyPolicy;
