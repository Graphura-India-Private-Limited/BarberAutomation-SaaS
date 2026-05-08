import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Scissors, CalendarDays, Sparkles, User, Palette,
  Star, Menu, X, ChevronDown, MapPin, Clock, Phone,
  Mail, ArrowRight, Shield, Award, Users, CheckCircle,
  Heart, Send, CreditCard, Coffee, Layers, Smile
} from "lucide-react";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const SERVICE_LINKS = [
  { label:"Men Services",   path:"/customer/services/men",   desc:"Haircut, Fade, Beard",      icon:<Scissors className="w-4 h-4"/> },
  { label:"Women Services", path:"/customer/services/women", desc:"Styling, Colour, Treatment", icon:<Sparkles className="w-4 h-4"/> },
  { label:"Addon Services", path:"/customer/services/addon", desc:"Facial, Spa, Massage",       icon:<Coffee className="w-4 h-4"/> },
  { label:"All Services",   path:"/customer/services",       desc:"Browse everything",          icon:<Layers className="w-4 h-4"/> },
];

const NAV_ITEMS = [
  { label:"Home",     path:"/" },
  { label:"Services", path:"/customer/services", hasDropdown:true },
  { label:"Barbers",  path:"/nearby" },
  { label:"About",    path:"#about" },
  { label:"Contact",  path:"#contact" },
];

const FEATURES = [
  { title:"Signature Cuts",  icon:Scissors, image:"https://i.pinimg.com/736x/82/c5/3d/82c53d8a1ea142d096daec6430eca0db.jpg", description:"Precision tailoring for the modern gentleman.", path:"/customer/services/men" },
  { title:"Luxury Styling",  icon:Sparkles, image:"https://i.pinimg.com/736x/ab/00/ea/ab00ead61169995482cc7703115efda2.jpg", description:"Couture hair transformations for feminine silhouette.", path:"/customer/services/women" },
  { title:"Beard Sculpture", icon:User,     image:"https://i.pinimg.com/736x/70/66/7f/70667fddecd13bde2bac687c3a7fa5cd.jpg", description:"Architectural grooming for the masculine profile.", path:"/customer/services/men" },
  { title:"Color Artistry",  icon:Palette,  image:"https://i.pinimg.com/736x/96/36/06/9636062d461545f11d4e7c5c510b2481.jpg", description:"Bespoke color palettes for every hair texture.", path:"/customer/services/women" },
];

const STATS = [
  { icon:Users,   val:"12,650+", label:"Happy Customers" },
  { icon:Award,   val:"4.9",     label:"Average Rating"  },
  { icon:Scissors,val:"2,350+",  label:"Services Done"   },
  { icon:Shield,  val:"100%",    label:"Satisfaction"    },
];

const TESTIMONIALS = [
  { name:"Rahul Mehta",   role:"Regular Customer", rating:5, text:"Best grooming experience in the city! The fade is always perfect.",     avatar:"RM" },
  { name:"Priya Singh",   role:"Loyal Customer",   rating:5, text:"Love the women's styling section. Always leave feeling amazing!",       avatar:"PS" },
  { name:"Amit Kulkarni", role:"Premium Member",   rating:5, text:"The combo package is incredible value. Highly recommend to everyone!", avatar:"AK" },
];

/* ── How it works — proper SVG icons ── */
const HOW_IT_WORKS = [
  {
    step:"01", title:"Choose Service", path:"/customer/services",
    desc:"Browse men, women or addon services and pick what you need.",
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8"><circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><line x1="20" y1="4" x2="8.12" y2="15.88"/><line x1="14.47" y1="14.48" x2="20" y2="20"/><line x1="8.12" y1="8.12" x2="12" y2="12"/></svg>,
    bg:"#FEF3E2", color:"#C5A059",
  },
  {
    step:"02", title:"Select Barber", path:"/customer/barber",
    desc:"Pick your preferred barber or let us auto-assign the best available.",
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
    bg:"#EFF6FF", color:"#1D4ED8",
  },
  {
    step:"03", title:"Book & Pay", path:"/customer/booking",
    desc:"Pay a small token amount online. Rest to be paid at the salon.",
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>,
    bg:"#ECFDF5", color:"#065F46",
  },
  {
    step:"04", title:"Visit & Relax", path:"/salon-detail",
    desc:"Walk in at your slot and enjoy a premium grooming experience.",
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
    bg:"#FEF2F2", color:"#991B1B",
  },
];

const SocialSVG = [
  { label:"Instagram", d:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg> },
  { label:"Twitter",   d:<svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.741l7.737-8.835L1.254 2.25H8.08l4.253 5.622 5.911-5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg> },
  { label:"Youtube",   d:<svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M23.498 6.186a2.99 2.99 0 0 0-2.105-2.118C19.618 3.5 12 3.5 12 3.5s-7.618 0-9.393.568A2.99 2.99 0 0 0 .502 6.186 31.32 31.32 0 0 0 0 12a31.32 31.32 0 0 0 .502 5.814 2.99 2.99 0 0 0 2.105 2.118C4.382 20.5 12 20.5 12 20.5s7.618 0 9.393-.568a2.99 2.99 0 0 0 2.105-2.118A31.32 31.32 0 0 0 24 12a31.32 31.32 0 0 0-.502-5.814zM9.75 15.02V8.98L15.5 12l-5.75 3.02z"/></svg> },
];

export default function HomePage() {
  const navigate    = useNavigate();
  const [menuOpen,  setMenuOpen]  = useState(false);
  const [dropOpen,  setDropOpen]  = useState(false);
  const [salons,    setSalons]    = useState([]);
  const [scrolled,  setScrolled]  = useState(false);
  const dropRef = useRef(null);

  useEffect(() => {
    fetch(`${API}/salon/nearby`)
      .then(r => r.json())
      .then(d => { if (d.success) setSalons(d.salons?.slice(0, 3) || []); })
      .catch(() => {});
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const handler = e => { if (dropRef.current && !dropRef.current.contains(e.target)) setDropOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleNav = (path) => {
    setMenuOpen(false); setDropOpen(false);
    if (path.startsWith("#")) {
      document.querySelector(path)?.scrollIntoView({ behavior:"smooth" });
    } else { navigate(path); }
  };

  return (
    <div className="relative w-full bg-[#f7d693] text-[#312b26] font-sans overflow-x-hidden">
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
    <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-orange-200/40 blur-[120px]"></div>
    <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-amber-100/40 blur-[120px]"></div>
  </div>
      <style dangerouslySetInnerHTML={{ __html:`
        @keyframes border-beam{0%{left:-100%}100%{left:100%}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:none}}
        @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}
        .animate-border-beam{animation:border-beam 3s linear infinite}
        .fade-up{animation:fadeUp .6s ease forwards}
        .float-anim{animation:float 3s ease-in-out infinite}
        .dd-enter{animation:fadeUp .2s ease forwards}
        .nav-link{position:relative}
        .nav-link::after{content:'';position:absolute;bottom:-2px;left:0;width:0;height:2px;background:#C5A059;transition:width .3s}
        .nav-link:hover::after{width:100%}
      `}} />
      <div className="relative z-10"></div>

      {/* ══ NAVBAR ══ */}
      <nav className={`sticky top-0 z-50 border-b transition-all duration-300 ${scrolled ? "border-[#EADDCA]/80 bg-white/95 shadow-md backdrop-blur-xl" : "border-[#EADDCA]/30 bg-white/80 backdrop-blur-xl"}`}>
        <div className="flex w-full items-center justify-between px-6 md:px-12 py-4 max-w-7xl mx-auto">
          <div className="flex flex-col items-start cursor-pointer font-serif" onClick={() => navigate("/")}>
            <div className="flex items-center gap-2.5">
              <Scissors className="w-5 h-5 text-[#C5A059]" />
              <h1 className="text-lg md:text-xl font-bold tracking-[0.2em] uppercase italic">BARBER <span className="text-[#C5A059] not-italic">PRO</span></h1>
            </div>
            <div className="hidden md:flex items-center gap-2 w-full mt-1">
              <div className="h-[1px] flex-grow bg-[#C5A059] opacity-30" />
              <span className="text-[8px] text-[#8D7B68] tracking-[0.3em] uppercase font-bold">Est. 2026</span>
              <div className="h-[1px] flex-grow bg-[#C5A059] opacity-30" />
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-8">
            {NAV_ITEMS.map(item => (
              item.hasDropdown ? (
                <div key={item.label} className="relative" ref={dropRef}>
                  <button onClick={() => setDropOpen(p => !p)}
                    className="nav-link flex items-center gap-1 text-[11px] font-bold uppercase tracking-widest text-stone-700 hover:text-[#C5A059] transition">
                    {item.label}
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform ${dropOpen ? "rotate-180 text-[#C5A059]" : ""}`} />
                  </button>
                  {dropOpen && (
                    <div className="dd-enter absolute top-8 left-1/2 -translate-x-1/2 w-64 bg-white rounded-2xl shadow-2xl border border-[#EADDCA] overflow-hidden z-50">
                      <div className="p-2">
                        {SERVICE_LINKS.map(svc => (
                          <button key={svc.path} onClick={() => handleNav(svc.path)}
                            className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-[#FEF3E2] transition-all group text-left">
                            <span className="text-[#C5A059]">{svc.icon}</span>
                            <div>
                              <p className="text-[12px] font-bold text-[#3E362E] group-hover:text-[#C5A059]">{svc.label}</p>
                              <p className="text-[10px] text-[#8D7B68]">{svc.desc}</p>
                            </div>
                            <ArrowRight className="w-3.5 h-3.5 text-[#C5A059] ml-auto opacity-0 group-hover:opacity-100 transition" />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <button key={item.label} onClick={() => handleNav(item.path)}
                  className="nav-link text-[11px] font-bold uppercase tracking-widest text-stone-700 hover:text-[#C5A059] transition">
                  {item.label}
                </button>
              )
            ))}
          </div>

          <div className="flex items-center gap-3">
            <button onClick={() => navigate("/login")}
              className="hidden sm:block text-[10px] font-bold uppercase tracking-widest text-[#3E362E] border border-[#EADDCA] px-4 py-2 rounded-lg hover:bg-[#FEF3E2] hover:border-[#C5A059] transition">
              Login
            </button>
            <button onClick={() => navigate("/customer/services")}
              className="relative hidden sm:block overflow-hidden rounded-lg bg-[#3E362E] px-6 py-2.5 text-[10px] font-black uppercase tracking-[0.2em] text-white shadow-xl transition-all hover:scale-105 hover:bg-[#C5A059]">
              <div className="absolute top-0 h-[1px] w-full bg-gradient-to-r from-transparent via-[#C5A059] to-transparent animate-border-beam opacity-50" />
              Book Now
            </button>
            <button onClick={() => setMenuOpen(!menuOpen)} className="lg:hidden text-[#3E362E]">
              {menuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="lg:hidden bg-white border-t border-[#EADDCA] p-6 space-y-3 shadow-2xl">
            {NAV_ITEMS.map(item => (
              <div key={item.label}>
                <button onClick={() => item.hasDropdown ? setDropOpen(p => !p) : handleNav(item.path)}
                  className="flex items-center justify-between w-full text-left text-sm font-bold uppercase tracking-widest text-stone-700 py-2 border-b border-[#EADDCA]/50">
                  {item.label}
                  {item.hasDropdown && <ChevronDown className={`w-4 h-4 transition-transform ${dropOpen ? "rotate-180" : ""}`} />}
                </button>
                {item.hasDropdown && dropOpen && (
                  <div className="pl-4 space-y-2 mt-2">
                    {SERVICE_LINKS.map(svc => (
                      <button key={svc.path} onClick={() => handleNav(svc.path)}
                        className="flex items-center gap-2 w-full text-left text-sm text-[#8D7B68] hover:text-[#C5A059] py-1.5">
                        <span className="text-[#C5A059]">{svc.icon}</span>{svc.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <div className="pt-3 space-y-2">
              <button onClick={() => navigate("/login")} className="w-full border border-[#EADDCA] text-[#3E362E] py-3 rounded-lg font-bold uppercase text-[10px] tracking-widest">Login</button>
              <button onClick={() => navigate("/customer/services")} className="w-full bg-[#3E362E] text-white py-4 rounded-lg font-black uppercase text-[10px] tracking-widest hover:bg-[#C5A059] transition">Book Now</button>
            </div>
          </div>
        )}
      </nav>

      {/* ══ HERO ══ */}
      <section className="mx-auto grid max-w-7xl gap-12 px-6 py-12 md:py-28 lg:grid-cols-2 items-center">
        <div className="space-y-6 md:space-y-8 text-center lg:text-left fade-up">
          <div className="inline-flex items-center gap-3 rounded-full border border-[#EADDCA] px-4 py-1.5 bg-white shadow-sm">
            <Star className="w-3.5 h-3.5 fill-[#C5A059] text-[#C5A059]" />
            <span className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] text-[#8D7B68]">Elite Grooming Experience</span>
          </div>
          <h1 className="text-2xl sm:text-4xl md:text-3xl lg:text-5xl font-extrabold leading-[1.1] text-[#3E362E] tracking-tighter uppercase">
            Mastering<br />
            <span className="text-[#C5A059] font-light italic font-serif">THE ART OF YOU.</span>
          </h1>
          <p className="text-base md:text-lg text-stone-600 leading-relaxed max-w-lg mx-auto lg:mx-0 italic font-serif">
            Where tradition meets modern precision. Step into a grooming sanctuary designed exclusively for the modern individual.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <button onClick={() => navigate("/customer/services")}
              className="flex items-center justify-center gap-3 rounded-xl bg-[#3E362E] px-10 py-5 text-sm font-bold uppercase tracking-widest text-white shadow-2xl transition hover:bg-[#C5A059] hover:scale-105">
              <CalendarDays className="w-5 h-5" /> Book Appointment
            </button>
            <button onClick={() => handleNav("#about")}
              className="flex items-center justify-center gap-3 rounded-xl border-2 border-[#EADDCA] bg-white px-8 py-5 text-sm font-bold uppercase tracking-widest text-[#3E362E] transition hover:border-[#C5A059] hover:text-[#C5A059]">
              <ArrowRight className="w-5 h-5" /> Learn More
            </button>
          </div>
          <div className="flex gap-8 justify-center lg:justify-start pt-4">
            {[["12K+","Customers"],["4.9","Rating"],["50+","Barbers"]].map(([v,l]) => (
              <div key={l} className="text-center">
                <p className="text-2xl font-black text-[#C5A059]">{v}</p>
                <p className="text-[10px] uppercase tracking-widest text-[#8D7B68] font-bold">{l}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative group h-[400px] md:h-[600px] w-full float-anim">
          <div className="absolute -inset-4 bg-[#EADDCA]/20 rounded-[50px] blur-2xl" />
          <div className="relative h-full w-full overflow-hidden rounded-[2rem] border-[8px] md:border-[12px] border-white shadow-2xl">
            <div className="absolute inset-0 w-full h-full lg:group-hover:w-1/2 transition-all duration-700 ease-in-out border-r border-white/20 z-10">
              <img src="https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&q=80&w=1000" alt="Male" className="h-full w-full object-cover" />
            </div>
            <div className="absolute inset-0 w-0 h-full left-full lg:group-hover:left-1/2 lg:group-hover:w-1/2 transition-all duration-700 ease-in-out overflow-hidden z-20">
              <img src="https://i.pinimg.com/736x/90/58/6b/90586b9445c43de32891a56d56e9447a.jpg" alt="Female" className="h-full w-[200%] max-w-none object-cover -translate-x-1/2" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-[#3E362E]/40 via-transparent to-transparent z-30 pointer-events-none" />
          </div>
        </div>
      </section>

      {/* ══ STATS ══ */}
      <section className="bg-[#3E362E] py-12">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
          {STATS.map(({ icon:Icon, val, label }) => (
            <div key={label} className="text-center">
              <div className="w-12 h-12 rounded-xl bg-[#C5A059]/20 flex items-center justify-center mx-auto mb-3">
                <Icon className="w-6 h-6 text-[#C5A059]" />
              </div>
              <p className="text-2xl md:text-3xl font-black text-white mb-1">{val}</p>
              <p className="text-[10px] uppercase tracking-widest text-[#8D7B68] font-bold">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ══ ABOUT ══ */}
      <section id="about" className="mx-auto max-w-7xl px-6 py-20 md:py-28">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="relative">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <img src="https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=400&h=300&fit=crop" alt="Barber" className="w-full h-48 object-cover rounded-2xl shadow-lg"/>
                <img src="https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400&h=200&fit=crop" alt="Salon" className="w-full h-32 object-cover rounded-2xl shadow-lg"/>
              </div>
              <div className="space-y-4 mt-8">
                <img src="https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=400&h=200&fit=crop" alt="Interior" className="w-full h-32 object-cover rounded-2xl shadow-lg"/>
                <img src="https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=400&h=300&fit=crop" alt="Service" className="w-full h-48 object-cover rounded-2xl shadow-lg"/>
              </div>
            </div>
            <div className="absolute -bottom-4 -right-4 bg-[#C5A059] text-white rounded-2xl p-5 shadow-2xl text-center">
              <p className="text-3xl font-black">10+</p>
              <p className="text-[10px] font-bold uppercase tracking-widest">Years of<br/>Excellence</p>
            </div>
          </div>

          <div>
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#C5A059]">About Us</span>
            <h2 className="text-3xl md:text-4.7xl font-black uppercase tracking-tight text-[#3E362E] mt-3 mb-6">
              We Are The Art Of <span className="text-[#C5A059] italic font-serif">Grooming</span>
            </h2>
            <p className="text-stone-600 leading-relaxed mb-4 font-serif italic">
              BarberPro is Pune's premier grooming destination, where tradition meets modern luxury. We combine precision barbering with cutting-edge technology to deliver an unmatched experience.
            </p>
            <p className="text-stone-600 leading-relaxed mb-8">
              Our platform connects customers with the best barbers in the city, offering seamless booking, real-time queue management, and premium grooming services — all in one place.
            </p>
            <div className="space-y-3 mb-8">
              {[
                "Real-time queue tracking — know your exact wait time",
                "Certified master barbers with 3-10 years experience",
                "Premium products — Wella, Schwarzkopf, L'Oreal",
                "Hygienic tools — sterilized after every use",
                "Easy online booking with token payment system",
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-[#C5A059] flex-shrink-0" />
                  <span className="text-sm text-stone-600">{item}</span>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap gap-4">
              <button onClick={() => navigate("/salon-detail")}
                className="flex items-center gap-2 bg-[#3E362E] text-white px-8 py-4 rounded-xl font-black uppercase text-[11px] tracking-widest hover:bg-[#C5A059] transition hover:scale-105">
                Read More <ArrowRight className="w-4 h-4" />
              </button>
              <button onClick={() => navigate("/customer/services")}
                className="flex items-center gap-2 border-2 border-[#EADDCA] text-[#3E362E] px-8 py-4 rounded-xl font-black uppercase text-[11px] tracking-widest hover:border-[#C5A059] hover:text-[#C5A059] transition">
                Book Now <CalendarDays className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ══ SERVICES ══ */}
      <section id="services" className="bg-[#f5e1c3] py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center mb-14">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#C5A059]">What We Offer</span>
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight text-[#3E362E] mt-3">Our Services</h2>
            <div className="w-16 h-1 bg-[#C5A059] mx-auto mt-4 rounded-full" />
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURES.map(f => (
              <div key={f.title} onClick={() => navigate(f.path)}
                className="group relative h-80 md:h-96 rounded-3xl border border-[#EADDCA] bg-white overflow-hidden transition-all hover:-translate-y-2 hover:shadow-2xl cursor-pointer">
                <div className="absolute inset-0 z-0">
                  <img src={f.image} alt={f.title} className="h-full w-full object-cover opacity-50 group-hover:opacity-80 transition-all duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-white via-white/20 to-transparent" />
                </div>
                <div className="relative z-10 p-6 md:p-8 flex flex-col h-full justify-end">
                  <div className="mb-4 inline-flex w-fit rounded-xl bg-[#FDFBF7] p-3 text-[#C5A059] shadow-sm border border-[#EADDCA]/30 group-hover:bg-[#C5A059] group-hover:text-white transition-all">
                    <f.icon size={22} />
                  </div>
                  <h3 className="mb-2 text-xs md:text-sm font-black uppercase tracking-widest text-[#3E362E]">{f.title}</h3>
                  <p className="text-[10px] md:text-xs leading-relaxed text-stone-600 italic font-serif mb-3">{f.description}</p>
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#C5A059] flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all">
                    Book Now <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <button onClick={() => navigate("/customer/services")}
              className="inline-flex items-center gap-3 bg-[#3E362E] text-white px-10 py-4 rounded-xl font-black uppercase text-[11px] tracking-widest hover:bg-[#C5A059] transition-all hover:scale-105">
              View All Services <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* ══ HOW IT WORKS — proper SVG icons ══ */}
      <section className="mx-auto max-w-7xl px-6 py-20 md:py-28">
        <div className="text-center mb-14">
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#C5A059]">Simple Process</span>
          <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight text-[#3E362E] mt-3">How It Works</h2>
          <div className="w-16 h-1 bg-[#C5A059] mx-auto mt-4 rounded-full" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {HOW_IT_WORKS.map((s, i) => (
            <div key={s.step} onClick={() => navigate(s.path)}
              className="group cursor-pointer relative">
              {/* Connector line */}
              {i < HOW_IT_WORKS.length - 1 && (
                <div className="hidden md:block absolute top-10 left-[calc(50%+3rem)] w-[calc(100%-3rem)] h-[2px] bg-gradient-to-r from-[#C5A059] to-[#EAD8C0]" />
              )}

              <div className="text-center relative z-10">
                {/* Icon box */}
                <div className="w-20 h-20 rounded-2xl mx-auto mb-5 flex items-center justify-center transition-all duration-300 group-hover:-translate-y-2 group-hover:shadow-xl border-2"
                  style={{ background:s.bg, borderColor:s.color, color:s.color }}>
                  {s.icon}
                </div>

                {/* Step number */}
                <div className="inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-3 border"
                  style={{ background:s.bg, color:s.color, borderColor:s.color }}>
                  Step {s.step}
                </div>

                <h3 className="font-black text-[#3E362E] text-sm mb-2 uppercase tracking-wide group-hover:text-[#C5A059] transition">
                  {s.title}
                </h3>
                <p className="text-[11px] text-stone-500 leading-relaxed">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <button onClick={() => navigate("/login")}
            className="inline-flex items-center gap-3 bg-[#C5A059] text-white px-10 py-4 rounded-xl font-black uppercase text-[11px] tracking-widest hover:bg-[#E8A840] transition hover:scale-105">
            Get Started Now <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* ══ NEARBY SALONS ══ */}
      {salons.length > 0 && (
        <section className="bg-[#f5e4c9] py-20">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-14">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#C5A059]">Find Us</span>
              <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight text-[#3E362E] mt-3">Nearby Salons</h2>
              <div className="w-16 h-1 bg-[#C5A059] mx-auto mt-4 rounded-full" />
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              {salons.map(s => (
                <div key={s._id} onClick={() => navigate(`/salon/${s._id}`)}
                  className="bg-white rounded-2xl p-6 border border-[#EADDCA] hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-black text-[#3E362E] text-lg">{s.salon_name}</h3>
                      <p className="text-[11px] text-[#8D7B68] flex items-center gap-1 mt-1"><MapPin className="w-3 h-3" />{s.address}</p>
                    </div>
                    <span className="bg-[#ECFDF5] text-[#065F46] text-[10px] font-black px-2 py-1 rounded-full uppercase">Open</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-[#8D7B68] mb-4">
                    <span className="flex items-center gap-1"><Star className="w-3 h-3 fill-[#C5A059] text-[#C5A059]" />{s.rating || "4.9"}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{s.opening_time} - {s.closing_time}</span>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={e => { e.stopPropagation(); navigate(`/salon/${s._id}`); }}
                      className="flex-1 border border-[#EADDCA] text-[#3E362E] py-2 rounded-lg text-[10px] font-black uppercase tracking-widest hover:border-[#C5A059] transition">
                      View Details
                    </button>
                    <button onClick={e => { e.stopPropagation(); navigate("/customer/services"); }}
                      className="flex-1 bg-[#3E362E] text-white py-2 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-[#C5A059] transition">
                      Book Now
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="text-center mt-8">
              <button onClick={() => navigate("/nearby")}
                className="inline-flex items-center gap-2 text-[#C5A059] font-black uppercase text-[11px] tracking-widest hover:gap-4 transition-all">
                View All Salons <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </section>
      )}

      {/* ══ TESTIMONIALS ══ */}
      <section className="mx-auto max-w-7xl px-6 py-20 md:py-28">
        <div className="text-center mb-14">
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#C5A059]">What They Say</span>
          <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight text-[#3E362E] mt-3">Customer Reviews</h2>
          <div className="w-16 h-1 bg-[#C5A059] mx-auto mt-4 rounded-full" />
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {TESTIMONIALS.map(t => (
            <div key={t.name} className="bg-white rounded-2xl p-8 border border-[#EADDCA] hover:shadow-xl hover:-translate-y-1 transition-all">
              <div className="flex gap-1 mb-4">
                {[...Array(t.rating)].map((_, i) => <Star key={i} className="w-4 h-4 fill-[#C5A059] text-[#C5A059]" />)}
              </div>
              <p className="text-sm text-stone-600 italic font-serif leading-relaxed mb-6">"{t.text}"</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#C5A059] to-[#E8A840] flex items-center justify-center text-white font-black text-sm">{t.avatar}</div>
                <div>
                  <p className="font-black text-[#3E362E] text-sm">{t.name}</p>
                  <p className="text-[10px] text-[#8D7B68] uppercase tracking-widest">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center mt-8">
          <button onClick={() => navigate("/write-review")}
            className="inline-flex items-center gap-2 border-2 border-[#EADDCA] text-[#3E362E] px-8 py-3 rounded-xl font-black uppercase text-[11px] tracking-widest hover:border-[#C5A059] hover:text-[#C5A059] transition">
            <Heart className="w-4 h-4" /> Write a Review
          </button>
        </div>
      </section>

      {/* ══ CTA ══ */}
      <section className="bg-[#3E362E] py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-black uppercase text-white tracking-tight mb-4">
            Ready for Your <span className="text-[#C5A059] italic font-serif">Transformation?</span>
          </h2>
          <p className="text-stone-400 mb-8 font-serif italic">Book your appointment today and experience the BarberPro difference.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={() => navigate("/customer/services")}
              className="flex items-center justify-center gap-3 bg-[#C5A059] text-white px-10 py-4 rounded-xl font-black uppercase text-[11px] tracking-widest hover:bg-[#E8A840] transition hover:scale-105">
              <CalendarDays className="w-5 h-5" /> Book Now
            </button>
            <button onClick={() => navigate("/nearby")}
              className="flex items-center justify-center gap-3 border-2 border-white/20 text-white px-10 py-4 rounded-xl font-black uppercase text-[11px] tracking-widest hover:border-[#C5A059] hover:text-[#C5A059] transition">
              <MapPin className="w-5 h-5" /> Find Salon
            </button>
            <button onClick={() => navigate("/login")}
              className="flex items-center justify-center gap-3 border-2 border-white/20 text-white px-10 py-4 rounded-xl font-black uppercase text-[11px] tracking-widest hover:border-[#C5A059] hover:text-[#C5A059] transition">
              <User className="w-5 h-5" /> Login
            </button>
          </div>
        </div>
      </section>

      {/* ══ FOOTER ══ */}
      <footer id="contact" className="bg-[#2A241F] py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid gap-10 md:grid-cols-4 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Scissors className="w-5 h-5 text-[#C5A059]" />
                <span className="text-lg font-bold text-white tracking-widest uppercase italic">BARBER <span className="text-[#C5A059]">PRO</span></span>
              </div>
              <p className="text-stone-400 text-sm font-serif italic leading-relaxed mb-4">Mastering the art of grooming since 2026.</p>
              <div className="flex gap-3">
                {SocialSVG.map(s => (
                  <button key={s.label} title={s.label}
                    className="w-9 h-9 rounded-lg bg-white/5 hover:bg-[#C5A059] flex items-center justify-center transition text-white">
                    {s.d}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-[11px] font-black uppercase tracking-widest text-white mb-4">Services</h4>
              <ul className="space-y-2">
                {SERVICE_LINKS.map(s => (
                  <li key={s.path}>
                    <button onClick={() => navigate(s.path)} className="text-stone-400 hover:text-[#C5A059] text-sm transition">{s.label}</button>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-[11px] font-black uppercase tracking-widest text-white mb-4">Quick Links</h4>
              <ul className="space-y-2">
                {[
                  ["My Profile",      "/customerprofile"],
                  ["Booking History", "/booking-history"],
                  ["Salon Detail",    "/salon-detail"],
                  ["Nearby Salons",   "/nearby"],
                  ["Owner Login",     "/owner/login"],
                  ["Barber Login",    "/barber/login"],
                  ["Salon Register",  "/register-salon"],
                  ["Admin Panel",     "/admin/login"],
                ].map(([l,p]) => (
                  <li key={p}><button onClick={() => navigate(p)} className="text-stone-400 hover:text-[#C5A059] text-sm transition">{l}</button></li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-[11px] font-black uppercase tracking-widest text-white mb-4">Contact</h4>
              <div className="space-y-3 mb-6">
                {[
                  [Phone,  "+91 98765 43210"],
                  [Mail,   "hello@barberpro.com"],
                  [MapPin, "Pune, Maharashtra, India"],
                  [Clock,  "Mon-Sun: 9AM - 9PM"],
                ].map(([Icon,text],i) => (
                  <div key={i} className="flex items-center gap-3 text-stone-400 text-sm">
                    <Icon className="w-4 h-4 text-[#C5A059] flex-shrink-0" />{text}
                  </div>
                ))}
              </div>
              <p className="text-[10px] font-black uppercase tracking-widest text-white mb-3">Newsletter</p>
              <div className="flex gap-2">
                <input type="email" placeholder="your@email.com"
                  className="flex-1 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-xs outline-none focus:border-[#C5A059] placeholder:text-stone-500" />
                <button className="bg-[#C5A059] text-white px-3 py-2 rounded-lg hover:bg-[#E8A840] transition">
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-stone-500 text-[11px] uppercase tracking-widest">© 2026 BarberPro by Graphura India Pvt Ltd</p>
            <p className="text-stone-500 text-[11px] uppercase tracking-widest">All Rights Reserved</p>
          </div>
        </div>
      </footer>
    </div>
  );
}