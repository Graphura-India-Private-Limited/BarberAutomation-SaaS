import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  MessageSquare, HelpCircle, ArrowLeft, Mail, Phone, Clock, 
  CheckCircle, AlertCircle, ChevronDown, Sparkles, AlertTriangle, LifeBuoy
} from "lucide-react";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";

const GOLD = "#C5A059";
const CHARCOAL = "#3E362E";

const MOCK_FAQS = [
  { q: "How do I cancel or reschedule my active booking?", a: "You can change your timeline allocation straight from your Customer Profile dashboard up to 2 hours before your session. Alternatively, call your assigned studio branch location directly for an emergency slot lock shift." },
  { q: "Why isn't my barber showing up on the available chair list?", a: "If your chosen stylist is greyed out, they may be currently executing an active queue treatment session, taking an approved shift break, or their salary tier access configurations are locked by the salon owner." },
  { q: "How does the Smart Queue timeline estimation work?", a: "Our system calculates live check-in volumes dynamically by multiplying your queue position index with the baseline haircut service runtime averages (~20-30 minutes per appointment)." },
];

export default function ContactSupport() {
  const navigate = useNavigate();
  
  /* ── State Management ── */
  const [category, setCategory] = useState("booking"); // "booking" | "payment" | "account" | "other"
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [openFaq, setOpenFaq] = useState(null);

  /* ── Form Submission Pipeline Handler ── */
  const handleSupportSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !subject.trim() || !message.trim()) {
      setError("Please fill out all administrative support fields.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await new Promise((resolve) => setTimeout(resolve, 1400));
      // Save ticket details to localStorage
      const newTicket = {
        id: Date.now(),
        category,
        email,
        subject,
        message,
        date: new Date().toLocaleDateString("en-IN", { 
          day: "2-digit", 
          month: "short", 
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit"
        }),
        status: "Open"
      };
      const existing = JSON.parse(localStorage.getItem("support_tickets") || "[]");
      localStorage.setItem("support_tickets", JSON.stringify([newTicket, ...existing]));
      setSubmitted(true);
    } catch {
      setError("Failed to sync message ticket to the support matrix.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF6F0] font-sans text-stone-800 antialiased flex flex-col justify-between relative overflow-x-hidden">
      
      {/* --- SHINY LUXURY GRADIENT GLOW LAYERS --- */}
      <div className="absolute top-40 -left-40 w-[600px] h-[600px] bg-gradient-to-br from-[#C5A059]/10 via-[#EADDCA]/20 to-transparent rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-40 w-[600px] h-[600px] bg-[#EADDCA]/20 rounded-full blur-[120px] pointer-events-none" />

      <div>
        {/* ── GLOBAL NAVBAR HEADER ── */}
        <Navbar />

        {/* ── EXIT BACK NAVIGATION CAPSULE CHIP ── */}
        <div className="w-full max-w-7xl mx-auto px-6 pt-6 relative z-50 flex justify-start">
          <button 
            onClick={() => navigate(localStorage.getItem("token") ? "/dashboard" : "/")} 
            className="flex items-center gap-2 text-xs font-black tracking-widest uppercase transition-all duration-300 hover:opacity-80 group text-[#3E362E] bg-white/90 backdrop-blur-md px-4 py-2.5 rounded-full border border-[#EADBCE] shadow-md hover:bg-white cursor-pointer select-none"
          >
            <ArrowLeft size={14} className="transition-transform group-hover:-translate-x-1 text-[#C5A059]" />
            <span>Return to App</span>
          </button>
        </div>

        {/* ── MAIN WORKSPACE CONTENT CANVAS ── */}
        <main className="max-w-6xl mx-auto w-full px-5 py-8 text-left z-10 relative grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT COLUMN: CONTACT DETAILS & HELPDESK INFO (5 Cols) */}
          <div className="col-span-12 lg:col-span-5 space-y-6">
            <div>
              <span className="text-[9px] font-black uppercase tracking-[0.3em] text-[#C5A059] bg-[#C5A059]/10 px-2.5 py-1 rounded-md inline-block mb-2">
                Helpdesk Console
              </span>
              <h1 className="text-3xl sm:text-4xl font-black text-stone-900 tracking-tight uppercase font-serif">
                Contact <span className="text-[#C5A059] italic normal-case">Support</span>
              </h1>
              <p className="text-xs font-medium text-stone-400 mt-1 leading-relaxed">
                Have an operational system mismatch, booking bottleneck, or configuration query? Get in touch with our tech specialists.
              </p>
            </div>

            {/* Direct Channel Cards */}
            <div className="space-y-3 pt-2">
              <div className="bg-white border border-[#EADBCE] rounded-2xl p-4 shadow-3xs flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-stone-50 border border-stone-100 flex items-center justify-center text-[#C5A059] shrink-0">
                  <Mail size={16} />
                </div>
                <div>
                  <p className="text-[9px] font-black uppercase tracking-wider text-stone-400">Direct Email Support</p>
                  <p className="text-sm font-extrabold text-stone-900 mt-0.5">hello@barberpro.com</p>
                </div>
              </div>

              <div className="bg-white border border-[#EADBCE] rounded-2xl p-4 shadow-3xs flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-stone-50 border border-stone-100 flex items-center justify-center text-[#C5A059] shrink-0">
                  <Phone size={16} />
                </div>
                <div>
                  <p className="text-[9px] font-black uppercase tracking-wider text-stone-400">Executive Concierge Line</p>
                  <p className="text-sm font-extrabold text-stone-900 mt-0.5">+91 98765 43210</p>
                </div>
              </div>

              <div className="bg-white border border-[#EADBCE] rounded-2xl p-4 shadow-3xs flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-stone-50 border border-stone-100 flex items-center justify-center text-stone-700 shrink-0">
                  <Clock size={16} />
                </div>
                <div>
                  <p className="text-[9px] font-black uppercase tracking-wider text-stone-400">Response Threshold</p>
                  <p className="text-sm font-extrabold text-stone-900 mt-0.5">Mon—Sun · 9:00 AM — 6:00 PM</p>
                </div>
              </div>
            </div>

            {/* Expandable FAQs Accordion Accord matrix */}
            <div className="pt-4">
              <h3 className="text-sm font-black uppercase tracking-wider text-stone-900 mb-4 flex items-center gap-1.5">
                <HelpCircle size={14} color={GOLD} /> Frequent Clarifications
              </h3>
              <div className="space-y-2.5">
                {MOCK_FAQS.map((faq, idx) => (
                  <div key={idx} className="bg-white/70 border border-[#EADBCE]/80 rounded-xl overflow-hidden transition-all duration-300">
                    <button
                      type="button"
                      onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                      className="w-full px-4 py-3.5 flex items-center justify-between text-xs font-bold text-stone-800 text-left focus:outline-none cursor-pointer hover:bg-white"
                    >
                      <span>{faq.q}</span>
                      <ChevronDown size={14} className={`text-stone-400 transition-transform duration-300 ${openFaq === idx ? "rotate-180" : ""}`} />
                    </button>
                    {openFaq === idx && (
                      <div className="px-4 pb-4 pt-1 text-xs text-stone-500 leading-relaxed bg-white/40 border-t border-stone-100 animate-in fade-in duration-200">
                        {faq.a}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: CORE INTERACTIVE TICKET FORM (7 Cols) */}
          <div className="col-span-12 lg:col-span-7">
            <div className="bg-white border border-[#EADBCE] rounded-[2rem] p-6 sm:p-10 shadow-xl relative overflow-hidden">
              
              {submitted ? (
                /* Success Slate Overlay View state trigger */
                <div className="text-center py-10 space-y-4 animate-in zoom-in-95 duration-300">
                  <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-200 mx-auto flex items-center justify-center text-emerald-600 shadow-3xs">
                    <CheckCircle size={28} />
                  </div>
                  <h3 className="font-serif text-2xl font-black text-stone-900 tracking-tight">Ticket Dispatched</h3>
                  <p className="text-xs font-medium text-stone-500 max-w-sm mx-auto leading-relaxed">
                    Your helpdesk inquiry has been securely synced into our CRM registry. An account specialist will follow up at your provided email signature coordinates within 60 minutes.
                  </p>
                  <div className="pt-4">
                    <button
                      type="button"
                      onClick={() => navigate(localStorage.getItem("token") ? "/dashboard" : "/")}
                      className="bg-[#3E362E] hover:bg-stone-900 text-white font-sans text-[10px] font-black uppercase tracking-widest px-8 py-3.5 rounded-xl transition-all shadow-xs cursor-pointer"
                    >
                      Back to Dashboard Overview
                    </button>
                  </div>
                </div>
              ) : (
                /* Primary Active Request Form Module Layout */
                <form onSubmit={handleSupportSubmit} className="space-y-5">
                  <div className="border-b border-stone-100 pb-3 flex items-center justify-between">
                    <h2 className="text-lg font-black font-serif text-stone-900 tracking-tight">Open Support Ticket</h2>
                    <span className="inline-flex items-center gap-1 text-[8px] font-black uppercase tracking-wider text-[#A37B58] bg-[#FAF6E9] px-2.5 py-1 rounded-md border border-[#EADBCE]/50">
                      <LifeBuoy size={10} /> Live Router
                    </span>
                  </div>

                  {/* Category Filter Pills Grid Selector */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-wider text-stone-400 block">Select Inquiry Vector</label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {[
                        { id: "booking", label: "Booking Issue" },
                        { id: "payment", label: "Payment Error" },
                        { id: "account", label: "Account Tier" },
                        { id: "other", label: "System General" }
                      ].map((cat) => (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => setCategory(cat.id)}
                          className={`py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all border cursor-pointer text-center ${
                            category === cat.id
                              ? "bg-[#3E362E] text-white border-[#3E362E] shadow-3xs"
                              : "bg-stone-50 text-stone-500 border-stone-200/60 hover:border-stone-400"
                          }`}
                        >
                          {cat.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Input Element 1: Email Profile coordinates */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-wider text-stone-400 ml-0.5 block">Your Email Coordinates</label>
                    <input
                      type="email"
                      placeholder="e.g. client@example.com"
                      value={email}
                      onChange={(e) => { setEmail(e.target.value); setError(""); }}
                      className="w-full bg-white border border-stone-200 rounded-xl px-4 py-3 text-sm font-bold text-stone-900 placeholder-stone-400 outline-none focus:border-[#C5A059] transition-all"
                    />
                  </div>

                  {/* Input Element 2: Topic Subject Header */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-wider text-stone-400 ml-0.5 block">Ticket Subject Summary</label>
                    <input
                      type="text"
                      placeholder="Brief headline description of the roadblock"
                      value={subject}
                      onChange={(e) => { setSubject(e.target.value); setError(""); }}
                      className="w-full bg-white border border-stone-200 rounded-xl px-4 py-3 text-sm font-bold text-stone-900 placeholder-stone-400 outline-none focus:border-[#C5A059] transition-all"
                    />
                  </div>

                  {/* Input Element 3: Message Text Payload core text block */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-wider text-stone-400 ml-0.5 block">Detailed Inquiry Context</label>
                    <textarea
                      placeholder="Provide diagnostic insights or context regarding your inquiry layout profile details..."
                      value={message}
                      onChange={(e) => { setMessage(e.target.value); setError(""); }}
                      maxLength={1000}
                      className="w-full bg-white border border-stone-200 rounded-xl p-4 text-stone-900 placeholder-stone-400 outline-none focus:border-[#C5A059] transition-all h-32 resize-none text-sm font-medium leading-relaxed"
                    />
                    <p className="text-right text-[9px] font-mono font-bold text-stone-400">{message.length} / 1000</p>
                  </div>

                  {/* Context Validation Errors Diagnostics Box */}
                  {error && (
                    <div className="p-3 bg-rose-50 border border-rose-100 rounded-xl flex items-center gap-2 animate-in fade-in duration-200">
                      <AlertTriangle size={14} className="text-rose-600 flex-shrink-0" />
                      <p className="text-rose-700 text-xs font-semibold">{error}</p>
                    </div>
                  )}

                  {/* Submission dispatch element button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-4 rounded-xl text-xs font-black uppercase tracking-widest text-white shadow-md transition-all cursor-pointer bg-[#3E362E] hover:bg-stone-900 active:scale-[0.98] disabled:opacity-50"
                    >
                      {loading ? "Synchronizing Ticket..." : "File Assistance Ticket"}
                    </button>
                  </div>
                </form>
              )}

            </div>
          </div>

        </main>
      </div>

      {/* ── GLOBAL BRAND FOOTER ── */}
      <Footer />

    </div>
  );
}