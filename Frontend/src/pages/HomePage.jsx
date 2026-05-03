import React, { useState } from "react";
import NearbyBarbers from "../components/NearbyBarbers";
import Footer from './Footer';

import { 
  Scissors, CalendarDays, Sparkles, User, Palette, 
  Star, Menu, X 
} from "lucide-react";

export default function BarberProHomePage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navItems = ["Home", "Services", "Barbers", "Booking", "About", "Contact"];

  const features = [
    {
      title: "Signature Cuts",
      icon: Scissors,
      image: "https://i.pinimg.com/736x/82/c5/3d/82c53d8a1ea142d096daec6430eca0db.jpg",
      description: "Precision tailoring for the modern gentleman's aesthetic."
    },
    {
      title: "Luxury Styling",
      icon: Sparkles,
      image: "https://i.pinimg.com/736x/ab/00/ea/ab00ead61169995482cc7703115efda2.jpg",
      description: "Couture hair transformations for an elegant feminine silhouette."
    },
    {
      title: "Beard Sculpture",
      icon: User,
      image: "https://i.pinimg.com/736x/70/66/7f/70667fddecd13bde2bac687c3a7fa5cd.jpg",
      description: "Architectural grooming for the ultimate masculine profile."
    },
    {
      title: "Color Artistry",
      icon: Palette,
      image: "https://i.pinimg.com/736x/96/36/06/9636062d461545f11d4e7c5c510b2481.jpg",
      description: "Bespoke color palettes designed for every hair texture."
    }
  ];

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#3E362E] font-sans selection:bg-[#EADDCA] selection:text-[#3E362E] relative overflow-hidden">
      
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes border-beam { 0% { left: -100%; } 100% { left: 100%; } }
        .animate-border-beam { animation: border-beam 3s linear infinite; }
      `}} />

      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-full md:w-[800px] h-[800px] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#F9F1E2] to-transparent opacity-50 -z-10 rounded-full blur-3xl"></div>

      {/* Navbar */}
      <nav className="sticky top-0 z-50 border-b border-[#EADDCA]/50 bg-white/80 backdrop-blur-xl">
        <div className="flex w-full items-center justify-between px-6 md:px-12 py-4">
          
          {/* Logo */}
          <div className="flex flex-col items-start group cursor-pointer font-serif">
            <div className="flex items-center gap-2.5">
              <Scissors className="w-5 h-5 text-[#C5A059]" />
              <h1 className="text-lg md:text-xl font-bold tracking-[0.2em] uppercase italic">
                BARBER <span className="text-[#C5A059] not-italic">PRO</span>
              </h1>
            </div>
            <div className="hidden md:flex items-center gap-2 w-full mt-1">
               <div className="h-[1px] flex-grow bg-[#C5A059] opacity-30"></div>
               <span className="text-[8px] text-[#8D7B68] tracking-[0.3em] uppercase font-bold">Est. 2026</span>
               <div className="h-[1px] flex-grow bg-[#C5A059] opacity-30"></div>
            </div>
          </div>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-8">
            {navItems.map((item) => (
              <button key={item} className="text-[11px] font-bold uppercase tracking-widest text-stone-700 hover:text-[#C5A059] transition">
                {item}
              </button>
            ))}
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-4">
            <button className="relative hidden sm:block overflow-hidden rounded-sm bg-[#3E362E] px-6 py-2.5 text-[10px] font-black uppercase tracking-[0.2em] text-white shadow-xl transition-all hover:scale-105">
              <div className="absolute top-0 h-[1px] w-full bg-gradient-to-r from-transparent via-[#C5A059] to-transparent animate-border-beam opacity-50"></div>
              Book Now
            </button>
            
            {/* Mobile Menu Toggle */}
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="lg:hidden text-[#3E362E]">
              {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Nav */}
        {isMenuOpen && (
          <div className="lg:hidden bg-white border-t border-[#EADDCA] p-6 space-y-4 shadow-2xl">
            {navItems.map((item) => (
              <button key={item} className="block w-full text-left text-sm font-bold uppercase tracking-widest text-stone-700">
                {item}
              </button>
            ))}
            <button className="w-full bg-[#3E362E] text-white py-4 rounded-lg font-black uppercase text-[10px] tracking-widest">
              Book Now
            </button>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="mx-auto grid max-w-7xl gap-12 px-6 py-12 md:py-32 lg:grid-cols-2 items-center">
        <div className="space-y-6 md:space-y-8 text-center lg:text-left">
          <div className="inline-flex items-center gap-3 rounded-full border border-[#EADDCA] px-4 py-1.5 bg-white">
            <Star className="w-3.5 h-3.5 fill-[#C5A059] text-[#C5A059]" />
            <span className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] text-[#8D7B68]">Elite Grooming Experience</span>
          </div>
          
          <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold leading-[1.1] text-[#3E362E] tracking-tighter uppercase">
            Mastering<br />
            <span className="text-[#C5A059] font-light italic font-serif">THE ART OF YOU.</span>
          </h1>
          
          <p className="text-base md:text-lg text-stone-600 leading-relaxed max-w-lg mx-auto lg:mx-0 italic font-serif">
            Where tradition meets modern precision. Step into a grooming sanctuary designed exclusively for the modern gentleman.
          </p>
          
          <button className="flex w-full sm:w-auto items-center justify-center gap-3 group rounded-xl bg-[#3E362E] px-10 py-5 text-sm font-bold uppercase tracking-widest text-white shadow-2xl transition hover:bg-[#C5A059]">
            <CalendarDays className="w-5 h-5 text-[#EADDCA]" />
            Secure Your Slot
          </button>
        </div>

        {/* Hero Image - Responsive Height */}
        <div className="relative group h-[400px] md:h-[600px] w-full">
          <div className="absolute -inset-4 bg-[#EADDCA]/20 rounded-[50px] blur-2xl"></div>
          <div className="relative h-full w-full overflow-hidden rounded-[2rem] border-[8px] md:border-[12px] border-white shadow-2xl">
            {/* Split Image Logic stays same, but optimized for touch */}
            <div className="absolute inset-0 w-full h-full lg:group-hover:w-1/2 transition-all duration-700 ease-in-out border-r border-white/20 z-10">
              <img src="https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&q=80&w=1000" alt="Male" className="h-full w-full object-cover" />
            </div>
            <div className="absolute inset-0 w-0 h-full left-full lg:group-hover:left-1/2 lg:group-hover:w-1/2 transition-all duration-700 ease-in-out overflow-hidden z-20">
              <img src="https://i.pinimg.com/736x/90/58/6b/90586b9445c43de32891a56d56e9447a.jpg" alt="Female" className="h-full w-[200%] lg:w-[200%] max-w-none object-cover -translate-x-1/2" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-[#3E362E]/40 via-transparent to-transparent z-30 pointer-events-none"></div>
          </div>
        </div>
      </section>

      {/* Features Section - Responsive Grid */}
      <section className="mx-auto max-w-7xl px-6 pb-20 md:pb-32">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <div key={feature.title} className="group relative h-80 md:h-96 rounded-3xl border border-[#EADDCA] bg-white overflow-hidden transition-all hover:-translate-y-2 hover:shadow-xl">
              <div className="absolute inset-0 z-0">
                <img src={feature.image} alt={feature.title} className="h-full w-full object-cover opacity-50 group-hover:opacity-80 transition-all duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-white via-white/20 to-transparent"></div>
              </div>

              <div className="relative z-10 p-6 md:p-8 flex flex-col h-full justify-end">
                <div className="mb-4 inline-flex w-fit rounded-xl bg-[#FDFBF7] p-3 text-[#C5A059] shadow-sm border border-[#EADDCA]/30 transition-all group-hover:bg-[#C5A059] group-hover:text-white">
                  <feature.icon size={22} />
                </div>
                <h3 className="mb-2 text-xs md:text-sm font-black uppercase tracking-widest text-[#3E362E]">{feature.title}</h3>
                <p className="text-[10px] md:text-xs leading-relaxed text-stone-600 italic font-serif">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
     
    </div>
    
  );
}