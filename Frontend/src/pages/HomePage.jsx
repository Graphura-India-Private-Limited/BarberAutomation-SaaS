import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import MembershipSection from "../components/membership/MembershipSection";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

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
  const [reviews,         setReviews]         = useState([]);
  const [selectedReview,  setSelectedReview]  = useState(null);
  const dropRef = useRef(null);


  useEffect(() => {
    if (!API) {
    console.error("API base URL configuration is missing.");
    return;
  }
    fetch(`${API}/salon/nearby`)
    .then((r) => {
      if (!r.ok) throw new Error(`Network response error: ${r.status}`);
      return r.json();
    })
    .then((d) => {
      if (d.success) setSalons(d.salons?.slice(0, 3) || []);
    })
    .catch((err) => console.error("Failed fetching nearby salons:", err));

   // Fetch Reviews Pipeline
  fetch(`${API}/review`)
    .then((r) => {
      if (!r.ok) throw new Error(`Network response error: ${r.status}`);
      return r.json();
    })
    .then((d) => {
      if (d.success) setReviews(d.reviews || []);
    })
    .catch((err) => console.error("Failed fetching reviews:", err));

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
   {/* ══ MOCK DATA WITH IMAGES (अगर बैकएंड से इमेज न आए तो ये दिखेगी) ══ */}
  const BARBER_TESTIMONIALS = [
    {
      name: "Rahul Sharma",
      review_text: "The premium fade and beard grooming here is exceptional. Best luxury barber experience in town!",
      avatar: "https://i.pinimg.com/736x/da/ca/5f/daca5fccc87fc4eecf59867f40eb04ad.jpg"
    },
    {
      name: "Vikram Malhotra",
      review_text: "Amazing attention to detail. The hot towel treatment and head massage after the haircut felt incredibly premium.",
      avatar: "https://i.pinimg.com/736x/d1/03/fd/d103fd5176a5c410a524a91bda718bbd.jpg"
    },
    {
      name: "Sneha Patel",
      review_text: "Took their premium hair spa and styling service. Absolutely loved the ambiance and professional staff!",
      avatar: "https://i.pinimg.com/1200x/aa/a7/fd/aaa7fd00ad035bdb72a3de08df060edf.jpg"
    },
    {
      name: "Arjun Mehta",
      review_text: "Flawless hair texture enhancement and styling. The barbers really understand modern trends and face shapes.",
      avatar: "https://i.pinimg.com/736x/50/fb/25/50fb25ac36eb75cfc883983fd77b1694.jpg"
    },
  {
      name: "Karan Johar",
      review_text: "Highly professional system. Booking an appointment was seamless, and the service console is amazing.",
      avatar: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=256&q=80"
    },
    {
    name: "Ananya Deshmukh",
    review_text: "Super clean, aesthetic interiors, and highly skilled professionals. The Service Console updates you instantly about your turn. Brilliant management!",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80",
    barber_rating: 5,
    salon_rating: 5
  }
  ];

 const [currentIdx, setCurrentIdx] = useState(0);

const displayReviews = reviews && reviews.length > 0 ? reviews : BARBER_TESTIMONIALS;

const handlePrev = () => {
  setCurrentIdx((prev) => {
    if (prev === 0) {
      const maxVisible = typeof window !== 'undefined' && window.innerWidth >= 1024 ? 4 : 1;
      const maxIdx = Math.max(0, displayReviews.length - maxVisible);
      return maxIdx;
    }
    return prev - 1;
  });
};

const handleNext = () => {
  setCurrentIdx((prev) => {
    const maxVisible = typeof window !== 'undefined' && window.innerWidth >= 1024 ? 4 : 1;
    const maxIdx = Math.max(0, displayReviews.length - maxVisible);

    if (prev >= maxIdx) {
      return 0;
    }
    return prev + 1;
  });
};


  return (
    <div className="min-h-screen bg-[#FAF6F0] text-stone-800 font-sans overflow-x-hidden">
      <style dangerouslySetInnerHTML={{ __html:`
        @keyframes border-beam{0%{left:-100%}100%{left:100%}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:none}}
        .animate-border-beam{animation:border-beam 3s linear infinite}
        .fade-up{animation:fadeUp .6s ease forwards}
        .nav-link{position:relative}
        .nav-link::after{content:'';position:absolute;bottom:-2px;left:0;width:0;height:2px;background:#C5A059;transition:width .3s}
        .nav-link:hover::after{width:100%}
        .line-clamp-3 { display:-webkit-box; -webkit-line-clamp:3; -webkit-box-orient:vertical; overflow:hidden; }
      `}} />
  <Navbar />    
      
 {/* ══ FULL-PAGE IMMERSIVE BLENDED HERO SECTION ══ */}
      <section className="relative w-full bg-[#FAF7F2] overflow-hidden min-h-[550px] md:min-h-[650px] flex items-center">
        
        {/* 🌅 THE BACKGROUND IMAGE CANVAS: Spans the full section height on the right side */}
        <div className="absolute top-0 right-0 w-full md:w-[55%] h-full z-0 overflow-hidden select-none">
          <img 
            src="/hero-interior.png" 
            alt="Barber Pro Salon Immersive Background" 
            className="w-full h-full object-cover object-[40%_center] md:object-[80%_center]"
          />
          
          {/* 🪄 ULTRA-SMOOTH GRADIENT MASK: Blends the image directly into the main page color */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#FAF7F2] via-[#FAF7F2]/70 to-transparent w-full md:w-[20%] pointer-events-none" />
          
          {/* Subtle bottom fade to prevent harsh edges with the stats grid below */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#FAF7F2]/30 via-transparent to-transparent pointer-events-none" />
        </div>

        {/* 🧱 LAYOUT CONTENT GRID LAYER: Renders text elements dynamically over the background canvas */}
        <div className="mx-auto max-w-7xl w-full px-6 py-16 md:py-24 grid md:grid-cols-2 gap-12 items-center relative z-10">
          
          {/* Left Column: Typography Content */}
          <div className="space-y-6 max-w-xl fade-up">
          <h1 className="text-4xl sm:text-5xl md:text-5xl font-black text-stone-900 tracking-wide uppercase leading-[1.15] font-serif">
  Premium Services <br />
  <span className="text-[#C5A059] font-light italic normal-case font-serif tracking-normal">at affordable prices</span>
</h1>
            
        <p className="text-base md:text-lg text-stone-700 font-sans normal-case leading-relaxed">
              Where Classic Barbering Meets Modern Salon Luxury. Expert grooming & styling for both men and women. Because great style has no gender.
            </p>
            
            {/* 🏷️ ADDED START: Premium Category Badges */}
            <div className="flex flex-wrap items-center gap-4 pt-2 text-left">
              <div className="flex items-center gap-3 bg-white/70 backdrop-blur-sm border border-stone-200/60 p-2.5 px-4 rounded-xl shadow-sm">
                <div className="p-1.5 bg-stone-900/10 rounded-lg text-stone-800"><Scissors size={14} /></div>
                <div>
                  <h4 className="text-[11px] font-black uppercase tracking-wider text-stone-800 leading-tight">For Men</h4>
                  <p className="text-[9px] text-stone-500 leading-none mt-0.5">Sharp. Confident.</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 bg-white/70 backdrop-blur-sm border border-stone-200/60 p-2.5 px-4 rounded-xl shadow-sm">
                <div className="p-1.5 bg-stone-900/10 rounded-lg text-stone-800"><Sparkles size={14} /></div>
                <div>
                  <h4 className="text-[11px] font-black uppercase tracking-wider text-stone-800 leading-tight">For Women</h4>
                  <p className="text-[9px] text-stone-500 leading-none mt-0.5">Stylish. Empowered.</p>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-white/70 backdrop-blur-sm border border-stone-200/60 p-2.5 px-4 rounded-xl shadow-sm">
                <div className="p-1.5 bg-[#C5A059]/10 rounded-lg text-[#C5A059]"><Award size={14} /></div>
                <div>
                  <h4 className="text-[11px] font-black uppercase tracking-wider text-stone-800 leading-tight">Premium Experience</h4>
                  <p className="text-[9px] text-stone-500 leading-none mt-0.5">Personalized. Luxury.</p>
                </div>
              </div>
            </div>
            {/* 🏷️ ADDED END */}
            <div className="flex items-center gap-4 bg-white/40 backdrop-blur-xs border border-stone-200/50 p-3 px-5 rounded-2xl w-fit shadow-xs my-2">
      <div className="flex -space-x-3 overflow-hidden">
        <img className="inline-block h-9 w-9 rounded-full ring-2 ring-[#FAF7F2] object-cover" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80" alt="Client" />
        <img className="inline-block h-9 w-9 rounded-full ring-2 ring-[#FAF7F2] object-cover" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80" alt="Client" />
        <img className="inline-block h-9 w-9 rounded-full ring-2 ring-[#FAF7F2] object-cover" src="https://images.unsplash.com/photo-1628157582853-a796fa650a6a?w=100&q=80" alt="Client" />
        <img className="inline-block h-9 w-9 rounded-full ring-2 ring-[#FAF7F2] object-cover" src="https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&q=80" alt="Client" />
      </div>
      <div>
        <h5 className="text-xs font-black text-stone-900 tracking-tight leading-tight">10K+ Happy Clients</h5>
        <p className="text-[10px] text-stone-500 leading-none mt-0.5">Join thousands who trust us for style & confidence.</p>
      </div>
    </div>

            {/* Action Buttons Row */}
            <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
              
              {/* Primary Button: Book Appointment */}
              <button 
                onClick={() => navigate("/customer/services")}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 bg-[#bb8d65] hover:bg-[#916b4a] text-white rounded-xl font-bold uppercase text-xs tracking-widest shadow-md transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
              >
                {/* Calendar Icon Layout Line */}
                <svg className="w-4 h-4 text-white/90" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 002-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                BOOK APPOINTMENT
              </button>
              
              {/* Secondary Button: Explore Services Outline */}
              <button 
                onClick={() => handleNav("#services")}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 bg-white/40 backdrop-blur-xs border border-stone-400/60 hover:border-stone-500 text-stone-800 rounded-xl font-bold uppercase text-xs tracking-widest transition-all hover:scale-[1.02] active:scale-[0.98] group cursor-pointer"
              >
                {/* Play Triangle Icon Layout Line */}
                <svg className="w-3.5 h-3.5 text-[#A37B58] transition-transform group-hover:scale-110" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                </svg>
                EXPLORE SERVICES
              </button>

            </div>
            </div>
            

          {/* Right Column: Transparent Space that lifts up the Stylist Floating Card */}
          <div className="relative h-full w-full min-h-[200px] md:min-h-[400px] flex items-end justify-center md:justify-end">
            
            {/* Elegant Floating Stylist Badge */}
            <div className="w-full max-w-sm bg-white/85 backdrop-blur-md rounded-2xl p-4 shadow-xl border border-white/40 flex items-center gap-4 transition-all duration-300 hover:scale-[1.02]">
              <img 
                src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?&w=100&q=80" 
                alt="Rahul Sharma - Senior Stylist" 
                className="w-14 h-14 rounded-xl object-cover border border-stone-200 shadow-sm"
              />
              <div>
                <p className="text-[9px] font-black text-[#C5A059] uppercase tracking-[0.2em] leading-none mb-1">Senior Stylist</p>
                <h4 className="text-lg font-bold text-stone-900 tracking-tight">Rahul Sharma</h4>
                <p className="text-xs text-stone-500 mt-0.5">Specialist in Men’s Grooming</p>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ══ STATS ══ */}
      {/* 📊 UPGRADED: 4-Column Luxury Metrics Banner */}
      <section className="relative w-full bg-[#FAF7F2] pb-12 pt-4 px-6 z-20">
        <div className="mx-auto max-w-7xl bg-white/60 backdrop-blur-md border border-stone-200/40 rounded-3xl p-6 md:p-8 shadow-sm grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4 items-center">
          
          {/* Item 1: Expert Barbers */}
          <div className="flex items-center gap-4 justify-center md:border-r border-stone-200/60 last:border-none">
            <div className="text-[#A37B58]">
              {/* Scissors Icon */}
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.121 14.121L19 19m-4.879-4.879l-4.242-4.242M14.121 14.121a3 3 0 10-4.243-4.242m4.243 4.242a3 3 0 11-4.243-4.243m0 0L4 4m5.172 5.172L4 14m5.172-5.172l4.242 4.242" />
              </svg>
            </div>
            <div className="text-left">
              <h3 className="text-xl md:text-2xl font-black text-stone-900 tracking-tight leading-none">15+</h3>
              <p className="text-[10px] uppercase font-bold tracking-wider text-stone-500 mt-1">Expert Barbers</p>
            </div>
          </div>

          {/* Item 2: Happy Clients */}
          <div className="flex items-center gap-4 justify-center md:border-r border-stone-200/60 last:border-none">
            <div className="text-[#A37B58]">
              {/* User Portrait Icon */}
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div className="text-left">
              <h3 className="text-xl md:text-2xl font-black text-stone-900 tracking-tight leading-none">10K+</h3>
              <p className="text-[10px] uppercase font-bold tracking-wider text-stone-500 mt-1">Happy Clients</p>
            </div>
          </div>

          {/* Item 3: Open Every Week */}
          <div className="flex items-center gap-4 justify-center md:border-r border-stone-200/60 last:border-none">
            <div className="text-[#A37B58]">
              {/* Clock Icon */}
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="text-left">
              <h3 className="text-xl md:text-2xl font-black text-stone-900 tracking-tight leading-none">7 Days</h3>
              <p className="text-[10px] uppercase font-bold tracking-wider text-stone-500 mt-1">Open Every Week</p>
            </div>
          </div>

          {/* Item 4: Cities Served */}
          <div className="flex items-center gap-4 justify-center last:border-none">
            <div className="text-[#A37B58]">
              {/* Location Pin Icon */}
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div className="text-left">
              <h3 className="text-xl md:text-2xl font-black text-stone-900 tracking-tight leading-none">20+</h3>
              <p className="text-[10px] uppercase font-bold tracking-wider text-stone-500 mt-1">Cities Served</p>
            </div>
          </div>

        </div>
      </section>

      {/* ══ ABOUT SECTION (Updated to Match Reviews Dark Theme) ══ */}
<section id="about" className="w-full bg-[#3E362E] py-20 md:py-28">
  <div className="mx-auto max-w-7xl px-6">
    <div className="grid lg:grid-cols-2 gap-16 items-center">
      
      {/* LEFT COLUMN: IMAGE GRID */}
      <div className="relative">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-4">
            <img src="https://i.pinimg.com/736x/89/90/e0/8990e0304c44794197af164ab0138011.jpg" alt="Barber" className="w-full h-48 object-cover rounded-2xl shadow-xl"/>
            <img src="https://i.pinimg.com/736x/bd/10/db/bd10db8df4573f03415a898584459188.jpg" alt="Salon" className="w-full h-32 object-cover rounded-2xl shadow-xl"/>
          </div>
          <div className="space-y-4 mt-8">
            <img src="https://i.pinimg.com/1200x/35/e1/16/35e116f3d65f94e0525f4810f94b5fc7.jpg" alt="Interior" className="w-full h-32 object-cover rounded-2xl shadow-xl"/>
            <img src="https://i.pinimg.com/1200x/c0/7c/78/c07c78a373ee1bfd8c122578be42e0c2.jpg" alt="Service" className="w-full h-48 object-cover rounded-2xl shadow-xl"/>
          </div>
        </div>
        
        {/* Badge */}
        <div className="absolute -bottom-4 -right-4 bg-[#C5A059] text-white rounded-2xl p-5 shadow-2xl text-center z-10">
          <p className="text-3xl font-black">10+</p>
          <p className="text-[10px] font-bold uppercase tracking-widest">Years of<br/>Excellence</p>
        </div>
      </div>

      {/* RIGHT COLUMN: TEXT CONTENT */}
      <div>
        <span className="text-[12px] font-black uppercase tracking-[0.3em] text-[#C5A059]">About Us</span>
        
        {/* Heading text-stone-900 वरून text-white केला */}
        <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight text-white mt-3 mb-6">
          We Are The Art Of <span className="text-[#C5A059] italic font-serif">Grooming</span>
        </h2>
        
        {/* Paragraphs चा कलर लाईट (text-stone-300 / text-stone-400) केला */}
        <p className="leading-relaxed mb-4 font-serif italic text-stone-300 text-lg">
          BarberPro is Pune's premier grooming destination, where tradition meets modern luxury. We combine precision barbering with cutting-edge technology to deliver an unmatched experience.
        </p>
        <p className="leading-relaxed mb-8 text-stone-400">
          Our platform connects customers with the best barbers in the city, offering seamless booking, real-time queue management, and premium grooming services — all in one place.
        </p>
        
        {/* Checklist */}
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
              {/* text-stone-700 वरून text-stone-300 केला */}
              <span className="text-sm text-stone-300">{item}</span>
            </div>
          ))}
        </div>
        
        {/* Buttons */}
        <div className="flex flex-wrap gap-4">
          {/* Primary Button: बॅकग्राउंड आता पांढरा (White) केला जेणेकरून डार्कवर उठून दिसेल */}
          <button onClick={() => navigate("/salon-detail")}
            className="flex items-center gap-2 bg-white text-[#3E362E] px-8 py-4 rounded-xl font-black uppercase text-[11px] tracking-widest hover:bg-[#C5A059] hover:text-white transition hover:scale-105 cursor-pointer shadow-md">
            Read More <ArrowRight className="w-4 h-4" />
          </button>
          
          {/* Outline Button: बॉर्डरचा कलर पांढरा/२०% ओपॅसिटी केला */}
          <button onClick={() => navigate("/customer/services")}
            className="flex items-center gap-2 border-2 border-white/20 text-white px-8 py-4 rounded-xl font-black uppercase text-[11px] tracking-widest hover:border-[#C5A059] hover:text-[#C5A059] transition cursor-pointer">
            Book Now <CalendarDays className="w-4 h-4" />
          </button>
        </div>
      </div>

    </div>
  </div>
</section>

      {/* ══ SERVICES ══ */}
      <section id="services" className="bg-[#F9F5EF] py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center mb-14">
            <span className="text-[14px] font-black uppercase tracking-[0.3em] text-[#C5A059]">What We Offer</span>
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight text-[#3E362E] mt-3">Our Services</h2>
            <div className="w-16 h-1 bg-[#C5A059] mx-auto mt-4 rounded-full" />
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURES.map(f => (
              <div key={f.title} onClick={() => navigate(f.path)}
                className="group relative h-80 md:h-96 rounded-3xl border border-[#EADDCA] bg-white overflow-hidden transition-all hover:-translate-y-2 hover:shadow-2xl cursor-pointer">
                <div className="absolute inset-0 z-0">
                  <img src={f.image} alt={f.title} className="h-full w-full object-cover opacity-150 group-hover:opacity-100 transition-all duration-700" /> 
                  <div className="absolute inset-0 bg-gradient-to-t from-white via-white/5 to-transparent opacity-80" /> 
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
              className="inline-flex items-center gap-3 bg-[#3E362E] text-white px-10 py-4 rounded-xl font-black uppercase text-[11px] tracking-widest hover:bg-[#C5A059] transition-all hover:scale-105 cursor-pointer">
              View All Services <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* ══ HOW IT WORKS SECTION (Updated to Match Reviews Dark Theme) ══ */}
<section className="w-full bg-[#3E362E] py-20 md:py-28 select-none">
  <div className="mx-auto max-w-7xl px-6">
    
    {/* --- HEADER SECTION --- */}
    <div className="text-center mb-14">
      <span className="text-[12px] font-black uppercase tracking-[0.3em] text-[#C5A059]">Simple Process</span>
      {/* text-stone-900 वरून text-white केला */}
      <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight text-white mt-3">How It Works</h2>
      <div className="w-16 h-1 bg-[#C5A059] mx-auto mt-4 rounded-full" />
    </div>

    {/* --- PROCESS STEPS GRID --- */}
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
      {HOW_IT_WORKS.map((s, i) => (
        <div key={s.step} onClick={() => navigate(s.path)}
          className="group cursor-pointer relative">
          
          {/* Connecting Line between steps - gradient बदलून डार्क थीमसाठी मॅच केला */}
          {i < HOW_IT_WORKS.length - 1 && (
            <div className="hidden md:block absolute top-10 left-[calc(50%+3rem)] w-[calc(100%-3rem)] h-[2px] bg-gradient-to-r from-[#C5A059] to-white/10" />
          )}

          <div className="text-center relative z-10">
            {/* Icon Container */}
            <div className="w-20 h-20 rounded-2xl mx-auto mb-5 flex items-center justify-center transition-all duration-300 group-hover:-translate-y-2 group-hover:shadow-[0_10px_30px_rgba(0,0,0,0.3)] border-2"
              style={{ background: s.bg, borderColor: s.color, color: s.color }}>
              {s.icon}
            </div>

            {/* Step Pill */}
            <div className="inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-3 border"
              style={{ background: s.bg, color: s.color, borderColor: s.color }}>
              Step {s.step}
            </div>

            {/* Title - text-stone-900 वरून text-white केला */}
            <h3 className="font-black text-white text-sm mb-2 uppercase tracking-wide group-hover:text-[#C5A059] transition">
              {s.title}
            </h3>
            
            {/* Description - text-stone-500 वरून text-stone-300 केला */}
            <p className="text-[11px] text-stone-300 leading-relaxed max-w-[90%] mx-auto">{s.desc}</p>
          </div>
        </div>
      ))}
    </div>

    {/* --- BOTTOM CTA BUTTON --- */}
    <div className="text-center mt-12">
      {/* Primary Gold Button */}
      <button onClick={() => navigate("/login")}
        className="inline-flex items-center gap-3 bg-[#C5A059] text-white px-10 py-4 rounded-xl font-black uppercase text-[11px] tracking-widest hover:bg-[#E8A840] transition hover:scale-105 cursor-pointer shadow-md">
        Get Started Now <ArrowRight className="w-4 h-4" />
      </button>
    </div>

  </div>
</section>

      {/* ══ NEARBY SALONS ══ */}
      {salons.length > 0 && (
        <section className="bg-[#F9F5EF] py-20">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-14">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#C5A059]">Find Us</span>
              <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight text-[#3E362E] mt-3">Nearby Salons</h2>
              <div className="w-16 h-1 bg-[#C5A059] mx-auto mt-4 rounded-full" />
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              {salons.map((s) => (
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
                      className="flex-1 border border-[#EADDCA] text-[#3E362E] py-2 rounded-lg text-[10px] font-black uppercase tracking-widest hover:border-[#C5A059] transition cursor-pointer">
                      View Details
                    </button>
                    <button onClick={e => { e.stopPropagation(); navigate("/customer/services"); }}
                      className="flex-1 bg-[#3E362E] text-white py-2 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-[#C5A059] transition cursor-pointer">
                      Book Now
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="text-center mt-8">
              <button onClick={() => navigate("/nearby")}
                className="inline-flex items-center gap-2 text-[#C5A059] font-black uppercase text-[11px] tracking-widest hover:gap-4 transition-all cursor-pointer">
                View All Salons <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </section>
      )}

      <MembershipSection />

{/* ════════════════════════════════════════
      LUXURY TESTIMONIALS SECTION
════════════════════════════════════════ */}
<section className="relative w-full overflow-hidden bg-gradient-to-br from-[#1A1613] via-[#2A241F] to-[#3E362E] py-20 sm:py-24 px-4 flex flex-col items-center justify-center">

  {/* GLOW BACKGROUND EFFECTS */}
  <div className="absolute top-[-100px] left-[-100px] w-[320px] h-[320px] bg-[#C5A059]/20 blur-[120px] rounded-full animate-pulse" />

  <div className="absolute bottom-[-100px] right-[-100px] w-[320px] h-[320px] bg-white/10 blur-[120px] rounded-full animate-pulse" />

  {/* NOISE OVERLAY */}
  <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/asfalt-dark.png')]" />

  {/* HEADING */}
  <div className="relative z-20 text-center mb-14 px-4">

    <span className="text-[12px] sm:text-[14px] font-black uppercase tracking-[0.35em] text-[#C5A059]">
      WHAT THEY SAY
    </span>
    

    <h2 className="
      mt-4
      text-3xl
      sm:text-5xl
      lg:text-6xl
      font-black
      uppercase
      tracking-tight
      bg-gradient-to-r
      from-[#C5A059]
      via-[#FFE6A7]
      to-[#C5A059]
      bg-clip-text
      text-transparent
      leading-tight
    ">
      Customer Reviews
    </h2>

    <div className="w-20 h-[3px] bg-gradient-to-r from-[#C5A059] to-[#FFE6A7] mx-auto mt-5 rounded-full shadow-[0_0_20px_rgba(197,160,89,0.7)]" />

  </div>
  </section>

  {/* SLIDER CONTAINER */}
  <div className="relative w-full max-w-[1450px] px-2 sm:px-8">

    {/* LEFT BUTTON */}
    <button
      onClick={handlePrev}
      className="
        absolute
        left-0
        sm:left-2
        top-1/2
        -translate-y-1/2
        z-40

        w-11 h-11 sm:w-14 sm:h-14

        rounded-full

        bg-white/10
        backdrop-blur-xl
        border border-white/20

        text-white

        flex items-center justify-center

        hover:bg-[#C5A059]
        hover:scale-110

        transition-all duration-300

        shadow-[0_0_25px_rgba(255,255,255,0.08)]
      "
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={2.5}
        stroke="currentColor"
        className="w-5 h-5"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15.75 19.5L8.25 12l7.5-7.5"
        />
      </svg>
    </button>

    {/* SLIDER */}
    <div className="overflow-hidden py-6">

      <div
        className="flex gap-5 lg:gap-7 transition-transform duration-700 ease-out"
        style={{
          transform: `translateX(-${currentIdx * 100}%)`,
        }}
      >

        {displayReviews.map((item, idx) => {

          const isReal = !!item._id;

          const name =
            isReal
              ? (item.customer_id?.name || "Anonymous")
              : item.name;

          const text =
            isReal
              ? (item.review_text || "(No written feedback)")
              : item.review_text || item.text;

          const avatar = item.avatar;

          return (
            <div
              key={item._id || `${name}-${idx}`}

              onClick={() =>
                isReal &&
                setSelectedReview &&
                setSelectedReview(item)
              }

              className="
                relative

                min-w-full
                sm:min-w-[48%]
                lg:min-w-[31%]
                xl:min-w-[23.5%]

                max-w-[350px]
                min-h-[460px]

                rounded-[32px]

                bg-white/10
                backdrop-blur-2xl

                border border-white/10

                shadow-[0_0_40px_rgba(0,0,0,0.25)]

                overflow-hidden

                p-6 sm:p-7

                flex flex-col
                items-center
                justify-between
                text-center

                transition-all
                duration-500

                hover:-translate-y-3
                hover:scale-[1.02]

                hover:border-[#C5A059]/40

                hover:shadow-[0_0_45px_rgba(197,160,89,0.35)]

                group
                shrink-0
              "
            >

              {/* SHINY HOVER EFFECT */}
              <div className="
                absolute
                top-0
                left-[-120%]
                w-full
                h-full
                bg-gradient-to-r
                from-transparent
                via-white/10
                to-transparent

                group-hover:left-[120%]

                transition-all
                duration-1000
                rotate-12
              " />

              {/* AVATAR */}
              <div className="relative z-10 mt-2">

                <div className="
                  w-24 h-24
                  rounded-full
                  overflow-hidden

                  border-2 border-[#C5A059]

                  p-1

                  bg-white/10

                  shadow-[0_0_25px_rgba(197,160,89,0.5)]

                  animate-[float_4s_ease-in-out_infinite]
                ">

                  {avatar ? (
                    <img
                      src={avatar}
                      alt={name}
                      className="w-full h-full object-cover rounded-full"
                    />
                  ) : (
                    <div className="
                      w-full h-full rounded-full

                      bg-gradient-to-br
                      from-[#C5A059]
                      via-[#E8C878]
                      to-[#C5A059]

                      flex items-center justify-center

                      text-white
                      text-2xl
                      font-black
                    ">
                      {(name[0] || "?").toUpperCase()}
                    </div>
                  )}

                </div>
              </div>

              {/* QUOTE */}
              <div className="
                relative z-10

                text-[40px]
                font-serif
                text-[#FFE6A7]

                mt-4

                drop-shadow-[0_0_15px_rgba(255,230,167,0.8)]
              ">
                “
              </div>

              {/* REVIEW */}
              <p className="
                relative z-10

                text-stone-200

                italic
                font-serif

                text-[14px]
                leading-relaxed

                flex-grow

                flex items-center justify-center

                mt-4

                line-clamp-5
              ">
                {text}
              </p>

              {/* NAME */}
              <h3 className="
                relative z-10

                mt-5

                text-[17px]
                font-semibold
                tracking-wide

                text-[#FFE6A7]
              ">
                — {name}
              </h3>

              {/* BUTTON */}
              <div className="relative z-10 w-full mt-6">

                <button
                  onClick={(e) => {
                    e.stopPropagation();

                    navigate &&
                      navigate("/customer/services");
                  }}

                  className="
                    relative
                    overflow-hidden

                    w-full

                    py-3.5
                    px-4

                    rounded-full

                    bg-gradient-to-r
                    from-[#C5A059]
                    via-[#E8C878]
                    to-[#C5A059]

                    text-[#2A241F]

                    font-black
                    uppercase
                    tracking-[0.2em]
                    text-[10px]

                    shadow-[0_0_25px_rgba(197,160,89,0.45)]

                    hover:scale-105

                    transition-all
                    duration-300
                  "
                >

                  <span className="relative z-10">
                    Book This Experience
                  </span>

                </button>

              </div>

            </div>
          );
        })}

      </div>
    </div>

    {/* RIGHT BUTTON */}
    <button
      onClick={handleNext}
      className="
        absolute
        right-0
        sm:right-2
        top-1/2
        -translate-y-1/2
        z-40

        w-11 h-11 sm:w-14 sm:h-14

        rounded-full

        bg-white/10
        backdrop-blur-xl
        border border-white/20

        text-white

        flex items-center justify-center

        hover:bg-[#C5A059]
        hover:scale-110

        transition-all duration-300

        shadow-[0_0_25px_rgba(255,255,255,0.08)]
      "
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={2.5}
        stroke="currentColor"
        className="w-5 h-5"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M8.25 4.5l7.5 7.5-7.5 7.5"
        />
      </svg>
    </button>

  </div>

  {/* BOTTOM BUTTONS */}
  <div className="relative z-20 mt-14 flex flex-col sm:flex-row gap-4">

    <button
      onClick={() =>
        navigate && navigate("/reviews")
      }

      className="
        px-8 py-4

        rounded-2xl

        bg-gradient-to-r
        from-[#C5A059]
        via-[#E8C878]
        to-[#C5A059]

        text-[#2A241F]

        font-black
        uppercase
        tracking-[0.2em]
        text-[11px]

        shadow-[0_0_30px_rgba(197,160,89,0.45)]

        hover:scale-105

        transition-all duration-300
      "
    >
      See All Reviews
      {reviews &&
        reviews.length > 0 &&
        ` (${reviews.length})`}
    </button>

    <button
      onClick={() =>
        navigate && navigate("/write-review")
      }

      className="
        px-8 py-4

        rounded-2xl

        border border-[#C5A059]/40

        bg-white/5
        backdrop-blur-xl

        text-[#FFE6A7]

        font-black
        uppercase
        tracking-[0.2em]
        text-[11px]

        hover:bg-[#C5A059]/10
        hover:border-[#FFE6A7]

        transition-all duration-300
      "
    >
      Write a Review
    </button>

  </div>




{/* ══ CTA SECTION (Updated to Premium Light Theme matching your Screenshot) ══ */}
<section className="relative w-full bg-[#FAF7F0] py-24 px-6 border-t border-[#3E362E]/10">
  <div className="max-w-4xl mx-auto text-center">
    <h2 className="text-3xl md:text-5xl font-black uppercase text-[#3E362E] tracking-tight mb-4">
      Ready for Your <span className="text-[#C5A059] italic font-serif">Transformation?</span>
    </h2>
    <p className="text-stone-600 mb-10 font-serif italic text-lg">
      Book your appointment today and experience the BarberPro difference.
    </p>
    
    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
      {/* Primary Gold Button */}
      <button onClick={() => navigate("/customer/services")}
        className="w-full sm:w-auto flex items-center justify-center gap-3 bg-[#C5A059] text-white px-10 py-4 rounded-xl font-black uppercase text-[11px] tracking-widest hover:bg-[#3E362E] transition duration-300 hover:scale-105 shadow-md">
        <CalendarDays className="w-5 h-5" /> Book Now
      </button>
      
      {/* Outline Dark Button 1 */}
      <button onClick={() => navigate("/nearby")}
        className="w-full sm:w-auto flex items-center justify-center gap-3 border-2 border-[#3E362E]/20 text-[#3E362E] px-10 py-4 rounded-xl font-black uppercase text-[11px] tracking-widest hover:border-[#C5A059] hover:text-[#C5A059] transition duration-300">
        <MapPin className="w-5 h-5" /> Find Salon
      </button>
      
      {/* Outline Dark Button 2 */}
      <button onClick={() => navigate("/login")}
        className="w-full sm:w-auto flex items-center justify-center gap-3 border-2 border-[#3E362E]/20 text-[#3E362E] px-10 py-4 rounded-xl font-black uppercase text-[11px] tracking-widest hover:border-[#C5A059] hover:text-[#C5A059] transition duration-300">
        <User className="w-5 h-5" /> Login
      </button>
    </div>
  </div>
</section>
     
      <Footer />

      {/* ══ REVIEW DETAIL MODAL ══ */}
      {selectedReview && (
        <div className="fixed inset-0 bg-black/80 z-[100] flex items-center justify-center p-4 backdrop-blur-sm"
          style={{ animation: "fadeUp 0.3s ease forwards" }}
          onClick={() => setSelectedReview(null)}>
          <div className="bg-white rounded-3xl p-8 md:p-10 max-w-md w-full shadow-2xl border border-[#EADDCA]"
            onClick={e => e.stopPropagation()}>

            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#C5A059] to-[#E8A840] flex items-center justify-center text-white font-black text-lg">
                  {(selectedReview.customer_id?.name?.[0] || "?").toUpperCase()}
                </div>
                <div>
                  <p className="font-black text-[#3E362E] text-base">{selectedReview.customer_id?.name || "Anonymous"}</p>
                  <p className="text-[9px] tracking-[0.2em] uppercase text-[#8D7B68] font-bold mt-0.5">
                    {new Date(selectedReview.created_at).toLocaleDateString("en-IN", { day:"numeric", month:"long", year:"numeric" })}
                  </p>
                </div>
              </div>
              <button onClick={() => setSelectedReview(null)} className="text-[#8D7B68] hover:text-[#3E362E] transition cursor-pointer">
                <X className="w-5 h-5"/>
              </button>
            </div>

            {(selectedReview.salon_rating > 0 || selectedReview.barber_rating > 0) && (
              <div className="grid grid-cols-2 gap-3 mb-5">
                {selectedReview.salon_rating > 0 && (
                  <div className="bg-[#FEF3E2] rounded-xl p-3 text-center border border-[#EADDCA]">
                    <p className="text-[9px] tracking-widest uppercase text-[#C5A059] font-black mb-1">Salon</p>
                    <p className="text-2xl text-[#C5A059]">
                      {"★".repeat(selectedReview.salon_rating)}
                      <span className="text-[#EADDCA]">{"★".repeat(5-selectedReview.salon_rating)}</span>
                    </p>
                  </div>
                )}
                {selectedReview.barber_rating > 0 && (
                  <div className="bg-[#FEF3E2] rounded-xl p-3 text-center border border-[#EADDCA]">
                    <p className="text-[9px] tracking-widest uppercase text-[#C5A059] font-black mb-1">Barber</p>
                    <p className="text-2xl text-[#C5A059]">
                      {"★".repeat(selectedReview.barber_rating)}
                      <span className="text-[#EADDCA]">{"★".repeat(5-selectedReview.barber_rating)}</span>
                    </p>
                  </div>
                )}
              </div>
            )}

            <div className="text-[#C5A059] text-5xl font-serif italic leading-none mb-2">"</div>
            <p className="font-serif italic text-base leading-[1.7] text-[#3E362E] mb-6">
              {selectedReview.review_text || "No written feedback"}
            </p>

            {selectedReview.barber_id?.name && (
              <div className="bg-[#FDFBF7] rounded-xl p-3 mb-5 border border-[#EADDCA]/50">
                <p className="text-[9px] tracking-[0.2em] uppercase text-[#8D7B68] font-bold mb-0.5">Stylist</p>
                <p className="text-sm font-black text-[#C5A059]">{selectedReview.barber_id.name}</p>
              </div>
            )}

            <button onClick={() => setSelectedReview(null)}
              className="w-full bg-[#3E362E] text-white py-3.5 rounded-xl font-black uppercase text-[10px] tracking-[0.2em] hover:bg-[#C5A059] transition cursor-pointer">
              Close
            </button>
          </div>
        </div>
        
      )}
    </div>
  );
}