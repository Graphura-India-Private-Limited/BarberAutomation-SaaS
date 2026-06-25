import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import { 
  ChevronLeft, 
  Sparkles, 
  Scissors, 
  Award, 
  ShieldCheck, 
  Users, 
  Smile, 
  MapPin, 
  Star 
} from "lucide-react";

export default function AboutPage() {
  const navigate = useNavigate();

  const STATS = [
    { label: "Master Stylists", value: "15+" },
    { label: "Satisfied Members", value: "10K+" },
    { label: "Cities Served", value: "20+" },
    { label: "Years of Craft", value: "10+" }
  ];

  const VALUES = [
    {
      title: "Master Craftsmanship",
      desc: "All our partners host certified professionals specializing in state-of-the-art styling, grooming, and aesthetic textures.",
      Icon: Scissors
    },
    {
      title: "Hygienic Standards",
      desc: "100% sterilized instruments, disposable tools where applicable, and clean rooms. Your safety is our absolute priority.",
      Icon: ShieldCheck
    },
    {
      title: "Real-Time Tracking",
      desc: "No more waiting in line. Track active queue statuses, wait times, and get automatic slot reminders through our console.",
      Icon: Sparkles
    }
  ];

  return (
    <div className="min-h-screen bg-[#FAF6F0] text-[#3E362E] font-sans flex flex-col justify-between overflow-x-hidden">
      <Navbar />

      {/* ── HERO BANNER ── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#1A1613] via-[#2A241F] to-[#3E362E] pt-32 pb-24 text-center select-none">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=1600&q=80"
            alt="Luxury Barbershop Interior"
            className="w-full h-full object-cover opacity-20 object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#2A241F]/40 to-black/20" />
        </div>

        <div className="absolute top-[-100px] left-[-100px] w-[320px] h-[320px] bg-[#C5A059]/25 blur-[120px] rounded-full animate-pulse pointer-events-none" />
        <div className="absolute bottom-[-100px] right-[-100px] w-[320px] h-[320px] bg-white/10 blur-[120px] rounded-full animate-pulse pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-6">
          <button
            onClick={() => navigate("/")}
            className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#FFE6A7] hover:text-[#C5A059] transition cursor-pointer border-none bg-transparent mb-6"
          >
            <ChevronLeft size={14} className="stroke-[2.5px]" /> Back to Home
          </button>

          <span className="block text-[11px] font-black uppercase tracking-[0.35em] text-[#C5A059] mb-2">Our Story</span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight bg-gradient-to-r from-[#C5A059] via-[#FFE6A7] to-[#C5A059] bg-clip-text text-transparent leading-tight font-serif">
            About BarberPro
          </h1>
          <div className="w-20 h-[3px] bg-gradient-to-r from-[#C5A059] to-[#FFE6A7] mx-auto mt-5 rounded-full" />
        </div>
      </section>

      {/* ── MAIN CONTENT ── */}
      <main className="max-w-7xl w-full mx-auto px-6 py-16 space-y-20">
        
        {/* Brand Mission & Story */}
        <section className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 text-left">
            <span className="text-xs font-black uppercase tracking-widest text-[#C5A059] block">Where Tradition Meets Modern Technology</span>
            <h2 className="text-3xl sm:text-4xl font-serif font-black text-[#2A241F]">
              Redefining the Luxury Grooming Standard
            </h2>
            <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
              Founded in 2026, BarberPro has grown into a premier network connecting discerning customers with master barbers and luxury salon spaces across Globally . Our platform bridges the gap between premium heritage craftsmanship and advanced digital ease.
            </p>
            <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
              Whether you are looking for a razor-sharp mid fade, a global balayage highlight, or a relaxing scalp revitalization spa, our studios provide highly customized consultations tailored to your visual geometry.
            </p>
          </div>
          <div className="relative group">
            <div className="absolute inset-0 bg-[#C5A059]/10 rounded-[2.5rem] transform rotate-3 scale-[1.01] z-0" />
            <img 
              src="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&q=80" 
              alt="Grooming Consultation"
              className="w-full aspect-[4/3] object-cover rounded-[2.5rem] border border-[#E8DCCB] relative z-10 shadow-lg group-hover:scale-[1.01] transition-transform duration-500"
            />
          </div>
        </section>

        {/* Stats strip */}
        <section className="bg-white border border-[#E8DCCB] rounded-[2rem] p-8 grid grid-cols-2 md:grid-cols-4 gap-8 text-center shadow-xs">
          {STATS.map((stat, i) => (
            <div key={i} className="space-y-1">
              <h3 className="text-3xl sm:text-4xl font-black text-[#2C241E] font-serif">{stat.value}</h3>
              <p className="text-[10px] font-black uppercase tracking-wider text-stone-400">{stat.label}</p>
            </div>
          ))}
        </section>

        {/* Core Pillars / Values */}
        <section className="space-y-12">
          <div className="text-center space-y-3">
            <span className="text-xs font-black uppercase tracking-widest text-[#C5A059]">How We Excel</span>
            <h2 className="text-3xl font-serif font-black text-[#2A241F]">Our Core Pillars</h2>
            <div className="w-16 h-[2px] bg-[#C5A059] mx-auto" />
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {VALUES.map((val, i) => (
              <div 
                key={i} 
                className="bg-white rounded-[2rem] border border-[#E8DCCB] p-8 text-left space-y-4 hover:border-[#C5A059]/50 hover:shadow-md transition-all duration-300 flex flex-col justify-start"
              >
                <div className="w-12 h-12 bg-[#FAF6F0] rounded-xl flex items-center justify-center text-[#C5A059] border border-[#E8DCCB]/60">
                  <val.Icon size={22} className="stroke-[1.8px]" />
                </div>
                <h3 className="text-lg font-black text-[#2C241E] uppercase tracking-wider">{val.title}</h3>
                <p className="text-stone-500 text-xs sm:text-sm leading-relaxed">{val.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Quality Commitment Section */}
        <section className="bg-gradient-to-br from-[#1A1613] via-[#2A241F] to-[#3E362E] rounded-[2.5rem] p-8 sm:p-12 text-center text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#C5A059]/10 blur-[80px] rounded-full pointer-events-none" />
          <div className="relative z-10 max-w-2xl mx-auto space-y-6">
            <Award className="w-12 h-12 text-[#C5A059] mx-auto stroke-[1.5px]" />
            <h2 className="text-3xl font-serif text-[#FFE6A7] font-black uppercase tracking-tight">Our Quality Guarantee</h2>
            <p className="text-stone-300 text-sm sm:text-base leading-relaxed">
              Every appointment booked through BarberPro is backed by our signature satisfaction policy. If you are not completely content with your cut, style, or therapy result, we will coordinate directly with our partner studio to make it right, free of charge.
            </p>
            <button 
              onClick={() => navigate("/customer/services")}
              className="px-8 py-3.5 bg-gradient-to-r from-[#C5A059] via-[#E8C878] to-[#C5A059] text-[#2A241F] font-black uppercase text-xs tracking-widest rounded-xl transition hover:scale-105 border-none shadow-md cursor-pointer"
            >
              Book Your Appointment
            </button>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
