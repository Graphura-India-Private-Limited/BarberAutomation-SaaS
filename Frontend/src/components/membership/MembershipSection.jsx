import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles, Check, Crown, Star, Gem, X,
  Phone, MessageCircle, CheckCircle, LogIn
} from "lucide-react";

/* Salon WhatsApp number — change this to your salon's actual number */
const SALON_WHATSAPP = "919876543210"; // +91 98765 43210

const MembershipSection = () => {
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showConfirm,  setShowConfirm]  = useState(false);
  const [toast,        setToast]        = useState(null);

  const plans = [
    {
      name: "The Essential",
      icon: <Star size={18} />,
      price: "1,499",
      description: "Perfect for the monthly grooming routine.",
      features: [
        "2 Precision Haircuts",
        "1 Signature Beard Grooming",
        "Relaxing Hair Wash & Conditioning",
        "Complimentary Coffee/Tea",
        "10% Off on Retail Products"
      ],
      shiny: false,
    },
    {
      name: "The Royal",
      icon: <Crown size={18} />,
      price: "2,999",
      description: "Our most popular elite grooming experience.",
      features: [
        "Unlimited Haircuts",
        "Unlimited Beard Trims & Styling",
        "2 Luxury Hot Towel Shaves",
        "Monthly Skin Detox Facial",
        "Priority Booking via WhatsApp",
        "15% Off on All Services"
      ],
      popular: true,
      shiny: true,
    },
    {
      name: "The Legend",
      icon: <Gem size={18} />,
      price: "5,499",
      description: "The ultimate lifestyle membership.",
      features: [
        "All Royal Plan Benefits",
        "Home Service (Twice a Month)",
        "VIP Lounge Access & Drinks",
        "Manicure & Pedicure Sessions",
        "Family Add-on (1 Member)",
        "Premium Gift Box (Quarterly)"
      ],
      shiny: false,
    },
  ];

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  /* ── Main click handler ── */
  const handleBecomeMember = (plan) => {
    const token = localStorage.getItem("token");

    if (!token) {
      /* Not logged in → save selected plan, redirect to login */
      localStorage.setItem("pendingMembership", plan.name);
      showToast("Please login first to subscribe", "info");
      setTimeout(() => navigate("/login"), 1200);
      return;
    }

    /* Logged in → open confirm modal */
    setSelectedPlan(plan);
    setShowConfirm(true);
  };

  /* ── Confirm subscription interest ── */
  const confirmInterest = () => {
    if (!selectedPlan) return;

    /* Save interest to localStorage (until backend is built) */
    const existing = JSON.parse(localStorage.getItem("membershipInterests") || "[]");
    existing.push({
      plan: selectedPlan.name,
      price: selectedPlan.price,
      submittedAt: new Date().toISOString(),
      userId: localStorage.getItem("userId") || "guest",
    });
    localStorage.setItem("membershipInterests", JSON.stringify(existing));

    /* TODO: When backend ready, replace with:
       fetch(`${API}/membership/interest`, { method: "POST", body: JSON.stringify({ plan: selectedPlan.name }) })
    */

    setShowConfirm(false);
    showToast(`✓ Interest submitted for ${selectedPlan.name}! Our team will contact you soon.`);
  };

  /* ── Open WhatsApp with pre-filled message ── */
  const contactWhatsApp = () => {
    if (!selectedPlan) return;
    const msg = `Hi! I'm interested in the *${selectedPlan.name}* membership plan (₹${selectedPlan.price}/month). Please share more details.`;
    const url = `https://wa.me/${SALON_WHATSAPP}?text=${encodeURIComponent(msg)}`;
    window.open(url, "_blank");
    setShowConfirm(false);
    showToast("Opening WhatsApp...");
  };

  return (
    <section className="relative mx-auto max-w-7xl px-6 py-24 mb-20 overflow-hidden bg-[#FDFBF7] rounded-[4rem] border border-[#EADDCA]/50 shadow-2xl">
      {/* Background Ambient Glows */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-[#C5A059]/10 blur-[100px] rounded-full -z-10"></div>
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-[#3E362E]/5 blur-[100px] rounded-full -z-10"></div>

      <div className="text-center mb-16">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#C5A059]/10 border border-[#C5A059]/20 mb-6"
        >
          <Sparkles size={14} className="text-[#C5A059]" />
          <span className="text-[#C5A059] text-[11px] font-black uppercase tracking-[0.3em]">
            Membership Experience
          </span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          className="text-5xl md:text-7xl font-bold text-[#3E362E] font-serif italic"
        >
          Join The <span className="text-[#C5A059] not-italic">Elite</span> Club
        </motion.h2>
        <p className="text-stone-500 mt-4 font-serif italic text-lg">Invest in your presence, every single month.</p>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        {plans.map((plan, index) => (
          <motion.div
            key={plan.name}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.6 }}
            className={`relative flex flex-col rounded-[3rem] transition-all duration-500 ${
              plan.popular
                ? "scale-105 z-10 shadow-2xl ring-2 ring-[#C5A059]"
                : "bg-white border border-[#EADDCA]/40 hover:border-[#C5A059]/50"
            }`}
          >
            {/* Card Body */}
            <div className={`flex flex-col h-full p-10 rounded-[3rem] overflow-hidden relative ${
                plan.popular ? "bg-[#3E362E]" : "bg-white"
            }`}>

              {/* Header */}
              <div className="flex justify-between items-start mb-6">
                <div className={`p-3 rounded-2xl ${plan.popular ? "bg-[#C5A059] text-white" : "bg-[#F9F5EF] text-[#C5A059]"}`}>
                  {plan.icon}
                </div>
                {plan.popular && (
                  <span className="bg-[#C5A059] text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest shadow-lg">
                    Most Popular
                  </span>
                )}
              </div>

              <h3 className={`text-xl font-bold font-serif italic mb-1 ${plan.popular ? "text-white" : "text-[#3E362E]"}`}>
                {plan.name}
              </h3>
              <p className={`text-xs mb-8 leading-relaxed ${plan.popular ? "text-stone-400" : "text-stone-500"}`}>
                {plan.description}
              </p>

              <div className="flex items-baseline gap-1 mb-10 border-b border-stone-200/10 pb-8">
                <span className={`text-5xl font-black tracking-tight ${plan.popular ? "text-white" : "text-[#3E362E]"}`}>
                  ₹{plan.price}
                </span>
                <span className={`text-sm font-bold uppercase tracking-widest ${plan.popular ? "text-[#C5A059]" : "text-stone-400"}`}>
                  /mo
                </span>
              </div>

              {/* Features */}
              <div className="space-y-5 mb-12 flex-grow">
                {plan.features.map((feature) => (
                  <div key={feature} className="flex items-start gap-4">
                    <div className={`mt-1 flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center ${plan.popular ? "bg-[#C5A059]" : "bg-[#F9F5EF]"}`}>
                      <Check size={12} className={plan.popular ? "text-white" : "text-[#C5A059]"} />
                    </div>
                    <span className={`text-sm font-medium leading-tight ${plan.popular ? "text-stone-300" : "text-stone-600"}`}>
                      {feature}
                    </span>
                  </div>
                ))}
              </div>

              {/* CTA Button — NOW WORKING */}
              <button
                onClick={() => handleBecomeMember(plan)}
                className={`w-full py-5 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] transition-all duration-500 hover:scale-[1.02] ${
                  plan.popular
                    ? "bg-[#C5A059] text-white hover:bg-white hover:text-[#3E362E] shadow-xl"
                    : "bg-[#3E362E] text-white hover:bg-[#C5A059]"
                }`}>
                Become a Member
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="text-center mt-12 text-stone-400 text-[10px] uppercase tracking-[0.3em]">
        * All memberships require a minimum 3-month commitment.
      </div>

      {/* ════════════════ CONFIRMATION MODAL ════════════════ */}
      <AnimatePresence>
        {showConfirm && selectedPlan && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 z-[100] flex items-center justify-center p-4 backdrop-blur-sm"
            onClick={() => setShowConfirm(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-[2rem] shadow-2xl max-w-md w-full p-8 border border-[#EADDCA] relative"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close */}
              <button onClick={() => setShowConfirm(false)}
                className="absolute top-5 right-5 text-stone-400 hover:text-stone-700 transition">
                <X className="w-5 h-5" />
              </button>

              {/* Plan icon */}
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#C5A059] text-white mb-4">
                {selectedPlan.icon}
              </div>

              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#C5A059] mb-2">Confirm Plan</p>
              <h3 className="text-3xl font-bold text-[#3E362E] font-serif italic mb-2">{selectedPlan.name}</h3>
              <p className="text-stone-500 text-sm mb-6">{selectedPlan.description}</p>

              <div className="bg-[#FDFBF7] border border-[#EADDCA] rounded-2xl p-5 mb-6">
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-4xl font-black text-[#3E362E]">₹{selectedPlan.price}</span>
                  <span className="text-xs font-bold uppercase tracking-widest text-stone-400">/month</span>
                </div>
                <p className="text-[10px] uppercase tracking-widest text-[#8D7B68] font-bold">
                  {selectedPlan.features.length} premium benefits included
                </p>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
                <p className="text-[11px] text-amber-800 leading-relaxed">
                  <strong>Note:</strong> Online payment for memberships is launching soon.
                  Submit your interest and our team will contact you within 24 hours
                  to activate your plan, OR reach us on WhatsApp directly.
                </p>
              </div>

              {/* Action buttons */}
              <div className="space-y-3">
                <button onClick={confirmInterest}
                  className="w-full py-4 bg-[#3E362E] text-white rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] hover:bg-[#C5A059] transition flex items-center justify-center gap-2 shadow-lg">
                  <CheckCircle className="w-4 h-4" /> Submit Interest
                </button>
                <button onClick={contactWhatsApp}
                  className="w-full py-4 bg-green-600 text-white rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] hover:bg-green-700 transition flex items-center justify-center gap-2">
                  <MessageCircle className="w-4 h-4" /> Contact on WhatsApp
                </button>
                <button onClick={() => setShowConfirm(false)}
                  className="w-full py-3 text-stone-500 text-[10px] font-bold uppercase tracking-widest hover:text-[#C5A059] transition">
                  Maybe Later
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ════════════════ TOAST ════════════════ */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: 50, x: "-50%" }}
            className={`fixed bottom-6 left-1/2 z-[200] px-6 py-4 rounded-2xl shadow-2xl font-bold text-sm max-w-md ${
              toast.type === "info"
                ? "bg-blue-600 text-white"
                : toast.type === "error"
                ? "bg-red-600 text-white"
                : "bg-[#3E362E] text-white border border-[#C5A059]/30"
            }`}
          >
            <div className="flex items-center gap-3">
              {toast.type === "info" ? (
                <LogIn className="w-5 h-5 flex-shrink-0" />
              ) : toast.type === "error" ? (
                <X className="w-5 h-5 flex-shrink-0" />
              ) : (
                <CheckCircle className="w-5 h-5 text-[#C5A059] flex-shrink-0" />
              )}
              <p>{toast.msg}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default MembershipSection;