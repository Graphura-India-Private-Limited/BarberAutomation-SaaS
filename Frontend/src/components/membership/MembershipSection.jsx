import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Sparkles, Check, Crown, Star, Gem, ChevronLeft } from "lucide-react";
import Navbar from "../layout/Navbar";
import Footer from "../layout/Footer";

const MembershipSection = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Logic: Agar path "/" hai, toh ye components nahi dikhenge
  const isHomePage = location.pathname === "/";

  const plans = [
    // ... (plans array waisa hi rahega)
    {
      name: "The Essential",
      icon: <Star size={20} />,
      price: "1,499",
      description: "Perfect for the monthly grooming routine.",
      features: ["2 Precision Haircuts", "1 Signature Beard Grooming", "Relaxing Hair Wash & Conditioning", "Complimentary Coffee/Tea", "10% Off on Retail Products"],
      popular: false,
    },
    {
      name: "The Royal",
      icon: <Crown size={20} />,
      price: "2,999",
      description: "Our most popular elite grooming experience.",
      features: ["Unlimited Haircuts", "Unlimited Beard Trims & Styling", "2 Luxury Hot Towel Shaves", "Monthly Skin Detox Facial", "Priority Booking via WhatsApp", "15% Off on All Services"],
      popular: true,
    },
    {
      name: "The Legend",
      icon: <Gem size={20} />,
      price: "5,499",
      description: "The ultimate lifestyle membership.",
      features: ["All Royal Plan Benefits", "Home Service (Twice a Month)", "VIP Lounge Access & Drinks", "Manicure & Pedicure Sessions", "Family Add-on (1 Member)", "Premium Gift Box (Quarterly)"],
      popular: false,
    },
  ];

  return (
    <>
      {/* Agar Home page nahi hai, tabhi Navbar dikhao */}
      {!isHomePage && <Navbar />}
      
      <section className="relative mx-auto max-w-[1450px] px-6 py-20 bg-[#F9F7F2]">
        
        {/* Back button logic */}
        {!isHomePage && (
          <button 
            onClick={() => navigate(-1)} 
            className="absolute top-10 left-6 z-20 flex items-center gap-2 text-stone-400 hover:text-[#C5A059] transition-colors font-bold uppercase tracking-[0.2em] text-[10px]"
          >
            <ChevronLeft size={16} /> Back
          </button>
        )}

        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#C5A059]/10 border border-[#C5A059]/20 mb-6">
            <Sparkles size={14} className="text-[#C5A059]" />
            <span className="text-[#C5A059] text-[11px] font-black uppercase tracking-[0.3em]">Membership Experience</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-serif italic font-bold text-[#C5A059] mb-4">Join The Elite Club</h2>
          <p className="text-stone-500 font-serif italic">Invest in your presence, every single month.</p>
        </div>

        {/* Plans Grid */}
        <div className="grid gap-8 md:grid-cols-3 items-start">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`relative flex flex-col p-8 rounded-[2rem] h-full ${plan.popular ? "bg-[#1A1A1A] text-white shadow-2xl scale-[1.02]" : "bg-[#1A1A1A] text-white"}`}
            >
              {plan.popular && (
                <div className="absolute top-4 right-4 bg-[#C5A059] text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest text-black">
                  Most Popular
                </div>
              )}
              
              <div className="mb-6 text-[#C5A059]">{plan.icon}</div>
              <h3 className="text-2xl font-serif italic mb-2">{plan.name}</h3>
              <p className="text-stone-400 text-sm mb-6">{plan.description}</p>
              
              <div className="flex items-baseline gap-1 mb-8">
                <span className="text-5xl font-black">₹{plan.price}</span>
                <span className="text-sm text-stone-400">/MO</span>
              </div>

              <div className="space-y-4 mb-8 flex-grow border-t border-stone-800 pt-8">
                {plan.features.map((feature) => (
                  <div key={feature} className="flex items-center gap-3">
                    <div className="bg-[#C5A059]/20 p-0.5 rounded-full"><Check size={12} className="text-[#C5A059]" /></div>
                    <span className="text-sm text-stone-300">{feature}</span>
                  </div>
                ))}
              </div>

              <button className="w-full py-4 rounded-xl font-black uppercase tracking-[0.2em] text-[11px] bg-[#C5A059] text-black hover:bg-white transition-all">
                Become a Member
              </button>
            </motion.div>
          ))}
        </div>
        <p className="text-center text-stone-400 text-[10px] mt-10 uppercase tracking-widest">* All memberships require a minimum 3-month commitment.</p>
      </section>

      {/* Agar Home page nahi hai, tabhi Footer dikhao */}
      {!isHomePage && <Footer />}
    </>
  );
};

export default MembershipSection;