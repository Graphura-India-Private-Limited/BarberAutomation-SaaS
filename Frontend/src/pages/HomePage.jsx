import React from "react";
import { 
  Scissors, 
  CalendarDays, 
  Sparkles, 
  UserCheck, 
  Star, 
  Clock, 
  ChevronDown,
  User,      
  Palette    
} from "lucide-react";

export default function BarberProHomePage() {
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
      
      {/* Animation Styles */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes border-beam {
          0% { left: -100%; }
          100% { left: 100%; }
        }
        .animate-border-beam {
          animation: border-beam 3s linear infinite;
        }
      `}} />

      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#F9F1E2] to-transparent opacity-50 -z-10 rounded-full blur-3xl"></div>

      {/* Navbar - Fixed to extreme corners */}
<nav className="sticky top-0 z-50 border-b border-[#EADDCA]/50 bg-white/80 backdrop-blur-xl">
  {/* Yahan max-w-full karkay justify-between kiya hai */}
  <div className="flex w-full items-center justify-between px-6 md:px-12 py-4">
    
    {/* LEFT CORNER: Logo */}
    <div className="flex flex-col items-start group cursor-pointer font-serif">
      <div className="flex items-center gap-2.5">
        <Scissors className="w-5 h-5 text-[#C5A059] group-hover:rotate-[-30deg] transition-transform duration-300" />
        <h1 className="text-xl font-bold text-[#3E362E] tracking-[0.2em] uppercase italic">
          BARBER <span className="text-[#C5A059] relative after:absolute after:bottom-0 after:left-0 after:h-[1px] after:w-0 after:bg-[#C5A059] after:transition-all group-hover:after:w-full not-italic">PRO</span>
        </h1>
      </div>
      <div className="flex items-center gap-2 w-full mt-1">
         <div className="h-[1px] flex-grow bg-[#C5A059] opacity-30"></div>
         <span className="text-[8px] text-[#8D7B68] tracking-[0.3em] uppercase font-bold">Est. 2026</span>
         <div className="h-[1px] flex-grow bg-[#C5A059] opacity-30"></div>
      </div>
    </div>

    {/* CENTER: Navigation Links */}
    <div className="hidden lg:flex items-center gap-8 xl:gap-12">
      {navItems.map((item) => (
        <button key={item} className="text-[11px] font-bold uppercase tracking-widest text-stone-700 transition hover:text-[#C5A059]">
          {item}
        </button>
      ))}
    </div>

    {/* RIGHT CORNER: Book Now Button */}
    <div className="flex items-center">
      <button className="relative group overflow-hidden rounded-sm bg-[#3E362E] px-8 py-3 text-[10px] font-black uppercase tracking-[0.2em] text-white shadow-xl transition-all duration-500 hover:scale-105 active:scale-95">
        <div className="absolute top-0 h-[1px] w-full bg-gradient-to-r from-transparent via-[#C5A059] to-transparent animate-border-beam opacity-50"></div>
        <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-[-20deg]"></div>
        <span className="relative z-10 flex items-center gap-2">
          Book Now
          <div className="w-1.5 h-1.5 rounded-full bg-[#C5A059] animate-pulse shadow-[0_0_8px_#C5A059]"></div>
        </span>
      </button>
    </div>

  </div>
</nav>

      {/* Hero Section */}
      <section className="mx-auto grid max-w-7xl gap-16 px-6 py-20 md:py-32 md:grid-cols-2 md:items-center">
        <div className="space-y-8">
          <div className="inline-flex items-center gap-3 rounded-full border border-[#EADDCA] px-4 py-1.5">
            <Star className="w-3.5 h-3.5 fill-[#C5A059] text-[#C5A059]" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#8D7B68]">Elite Grooming Experience</span>
          </div>
          <h1 className="text-6xl font-extrabold leading-tight md:text-8xl text-[#3E362E] tracking-tighter uppercase">
            Mastering<br />
            <span className="text-[#C5A059] font-light italic font-serif">THE ART OF YOU.</span>
          </h1>
          <p className="text-lg text-stone-600 leading-relaxed max-w-lg italic font-serif">
            Where tradition meets modern precision. Step into a grooming sanctuary designed exclusively for the modern gentleman.
          </p>
          <button className="flex items-center justify-center gap-3 group rounded-xl bg-[#3E362E] px-10 py-5 text-sm font-bold uppercase tracking-widest text-white shadow-2xl transition hover:bg-[#C5A059]">
            <CalendarDays className="w-5 h-5 text-[#EADDCA] group-hover:scale-110 transition" />
            Secure Your Slot
          </button>
        </div>

        {/* Hero Dual Image Reveal */}
        <div className="relative group h-[600px] w-full">
          <div className="absolute -inset-6 bg-[#EADDCA]/20 rounded-[50px] blur-3xl transition duration-1000"></div>
          <div className="relative h-full w-full overflow-hidden rounded-[2rem] border-[12px] border-white shadow-[0_32px_64px_-12px_rgba(62,54,46,0.2)]">
            <div className="absolute inset-0 w-full h-full transition-all duration-700 ease-in-out group-hover:w-1/2 border-r border-white/20 z-10">
              <img src="https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&q=80&w=1000" alt="Male" className="h-full w-full object-cover grayscale-[20%] group-hover:grayscale-0" />
            </div>
            <div className="absolute inset-0 w-0 h-full left-full group-hover:left-1/2 group-hover:w-1/2 transition-all duration-700 ease-in-out overflow-hidden z-20">
              <img src="https://i.pinimg.com/736x/90/58/6b/90586b9445c43de32891a56d56e9447a.jpg" alt="Female" className="h-full w-[200%] max-w-none object-cover -translate-x-1/2" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-[#3E362E]/60 via-transparent to-transparent opacity-60 z-30 pointer-events-none"></div>
          </div>
        </div>
      </section>

      {/* Features Section - High Clarity Images */}
      <section className="mx-auto max-w-7xl px-6 pb-32">
        <div className="grid gap-8 md:grid-cols-4">
          {features.map((feature) => (
            <div key={feature.title} className="group relative h-96 rounded-3xl border border-[#EADDCA] bg-white overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl">
              <div className="absolute inset-0 z-0">
                <img 
                  src={feature.image} 
                  alt={feature.title}
                  className="h-full w-full object-cover opacity-60 transition-all duration-700 group-hover:scale-110 group-hover:opacity-90" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-white via-white/10 to-transparent"></div>
              </div>

              <div className="relative z-10 p-8 flex flex-col h-full justify-end">
                <div className="mb-6 inline-flex w-fit rounded-xl bg-[#FDFBF7] p-3 text-[#C5A059] shadow-sm border border-[#EADDCA]/30 transition-transform duration-500 group-hover:scale-110 group-hover:bg-[#C5A059] group-hover:text-white">
                  <feature.icon size={24} />
                </div>
                <h3 className="mb-3 text-sm font-black uppercase tracking-widest text-[#3E362E]">{feature.title}</h3>
                <p className="text-xs leading-relaxed text-stone-600 italic font-serif">{feature.description}</p>
              </div>
              <div className="absolute bottom-0 left-0 h-1.5 w-0 bg-[#C5A059] transition-all duration-500 group-hover:w-full"></div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}