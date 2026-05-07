import React from "react";
import { motion } from "framer-motion";
import { Sparkles, Check, Zap, Crown, Star, Gem } from "lucide-react";

const MembershipSection = () => {
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

              {/* CTA Button */}
              <button className={`w-full py-5 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] transition-all duration-500 hover:scale-[1.02] ${
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
    </section>
  );
};

export default MembershipSection;