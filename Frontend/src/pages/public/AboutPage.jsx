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
  const [currentSlide, setCurrentSlide] = React.useState(0);
  const slides = [
    "https://i.pinimg.com/736x/57/b8/8b/57b88b775be185ec80edb4447765cc66.jpg",
    "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=1600&q=80",
    "https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=1600&q=80"
  ];

  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

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
<section className="relative overflow-hidden bg-gradient-to-br from-[#1A1613] via-[#2A241F] to-[#3E362E] pt-32 pb-24 text-center select-none min-h-[60vh] flex items-center justify-center">
  {/* Background Images Container - Perfect Fit & Shiny */}
  <div className="absolute inset-0 z-0">
    {slides.map((img, index) => (
      <div
        key={index}
        className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${
          index === currentSlide ? "opacity-100" : "opacity-0"
        }`}
      >
        {/* The Image - acts as a perfect fit cover with a brightness/contrast boost for the "shiny" look */}
        <img
          src={img}
          alt={`Luxury Barbershop Interior ${index + 1}`}
          className="absolute inset-0 w-full h-full object-cover object-center scale-105 brightness-110 contrast-105"
        />
        {/* Glossy Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/80" />
      </div>
    ))}
  </div>

  {/* Ambient Orbs */}
  <div className="absolute top-[-100px] left-[-100px] w-[320px] h-[320px] bg-[#C5A059]/20 blur-[120px] rounded-full animate-pulse pointer-events-none" />
  <div className="absolute bottom-[-100px] right-[-100px] w-[320px] h-[320px] bg-[#FFE6A7]/10 blur-[120px] rounded-full animate-pulse pointer-events-none" />

  {/* Content */}
  <div className="relative z-10 max-w-7xl mx-auto px-6">
    <button
      onClick={() => navigate("/")}
      className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#FFE6A7] hover:text-[#C5A059] transition cursor-pointer border-none bg-transparent mb-6 group"
    >
      <ChevronLeft size={14} className="stroke-[2.5px] group-hover:-translate-x-1 transition-transform" /> Back to Home
    </button>

    <span className="block text-[11px] font-black uppercase tracking-[0.35em] text-[#C5A059] mb-2 drop-shadow-sm">
      Our Story
    </span>
    
    <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black uppercase tracking-tighter text-white leading-tight font-serif drop-shadow-[0_5px_15px_rgba(0,0,0,0.5)]">
      About <span className="bg-gradient-to-r from-[#C5A059] via-[#FFE6A7] to-[#C5A059] bg-clip-text text-transparent">BarberPro</span>
    </h1>
    
    <div className="w-24 h-1.5 bg-gradient-to-r from-[#C5A059] to-[#FFE6A7] mx-auto mt-6 rounded-full shadow-lg" />
    
    <p className="mt-8 text-[#E8DCCB] max-w-xl mx-auto text-sm font-light leading-relaxed drop-shadow-sm">
      Redefining the standard of luxury grooming across the globe. Where heritage craftsmanship meets modern digital precision.
    </p>
  </div>
</section>

     {/* ── MAIN CONTENT ── */}
<main className="max-w-7xl w-full mx-auto px-6 py-24 space-y-24">
  
  {/* Brand Mission & Story */}
  <section className="grid lg:grid-cols-2 gap-16 items-center">
    <div className="space-y-8 text-left">
      <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#C5A059] block">
        Where Tradition Meets Modern Technology
      </span>
      <h2 className="text-4xl sm:text-5xl font-serif font-black text-[#2A241F] leading-tight">
        Redefining the Luxury Grooming Standard
      </h2>
      <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
        Founded in 2026, BarberPro has grown into a premier network connecting discerning customers with master barbers. Our platform bridges the gap between premium heritage craftsmanship and advanced digital ease.
      </p>
      
      {/* Luxury Badges */}
      <div className="flex flex-wrap gap-4 pt-2">
        {["100% Hygienic", "Certified Experts", "Luxury Experience"].map((item, i) => (
          <div key={i} className="flex items-center gap-2 bg-white px-5 py-3 rounded-full border border-[#E8DCCB] shadow-sm hover:border-[#C5A059]/50 transition-all">
            <ShieldCheck size={14} className="text-[#C5A059]" />
            <span className="text-[10px] font-black uppercase tracking-widest text-[#2A241F]">{item}</span>
          </div>
        ))}
      </div>
    </div>

    {/* Image Section */}
    <div className="relative group">
      <div className="absolute inset-0 bg-[#C5A059]/10 rounded-[2.5rem] transform rotate-3 scale-[1.01] transition-transform group-hover:rotate-6" />
      <img 
        src="https://i.pinimg.com/1200x/a0/aa/9a/a0aa9ab25439f003bf28beb0b35fb9c0.jpg"
        alt="Grooming Consultation"
        className="w-full aspect-[4/3] object-contain bg-[#1E1915] rounded-[2.5rem] border border-[#E8DCCB] relative z-10 shadow-2xl transition-transform duration-500 group-hover:scale-[1.02]"
      />
      {/* Subtle floating badge */}
      <div className="absolute -bottom-6 -right-6 bg-[#2A241F] text-white p-6 rounded-2xl shadow-xl z-20">
        <p className="text-2xl font-black font-serif">4.9 ★</p>
        <p className="text-[8px] font-black uppercase tracking-widest text-stone-400">Verified Rating</p>
      </div>
    </div>
  </section>

  {/* Premium Stats Strip */}
<section className="grid grid-cols-2 md:grid-cols-4 gap-4">
  {STATS.map((stat, i) => (
    <div 
      key={i} 
      className="relative bg-[#FFFFFF] border border-[#E8DCCB]/30 p-8 text-center transition-all duration-500 hover:border-[#C5A059]/30 hover:shadow-[0_20px_30px_-10px_rgba(0,0,0,0.05)]"
    >
      <h3 className="text-4xl font-serif font-medium text-[#2A241F] mb-2 tracking-tight">
        {stat.value}
      </h3>
      <div className="h-[1px] w-8 bg-[#C5A059]/30 mx-auto mb-3" />
      <p className="text-[9px] font-bold uppercase tracking-[0.25em] text-[#7A726A]">
        {stat.label}
      </p>
    </div>
  ))}
</section>

        {/* Core Pillars / Values - Premium Refinement */}
<section className="py-20 bg-[#FBF9F6]">
  <div className="container mx-auto px-6 space-y-16">
    
    <div className="text-center space-y-4">
      <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#A6884E]">
        Our Philosophy
      </span>
      <h2 className="text-4xl md:text-5xl font-serif font-medium text-[#2A241F]">
        Excellence in Every Detail
      </h2>
      <div className="w-12 h-[1px] bg-[#C5A059] mx-auto" />
    </div>

    <div className="grid gap-6 md:grid-cols-3">
      {VALUES.map((val, i) => (
        <div 
          key={i} 
          className="group relative bg-white border border-[#E8DCCB]/40 p-10 text-left space-y-6 transition-all duration-500 hover:-translate-y-2 hover:border-[#C5A059]/30 hover:shadow-[0_20px_50px_-15px_rgba(197,160,89,0.15)]"
        >
          {/* Subtle Accent Line */}
          <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-[#C5A059] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          <div className="w-14 h-14 bg-[#FAF6F0] rounded-none flex items-center justify-center text-[#C5A059] border border-[#E8DCCB]/50 shadow-sm">
            <val.Icon size={24} strokeWidth={1.5} />
          </div>
          
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-[#2C241E] uppercase tracking-[0.2em]">
              {val.title}
            </h3>
            <p className="text-[#7A726A] text-sm leading-relaxed font-light">
              {val.desc}
            </p>
          </div>
        </div>
      ))}
    </div>
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
