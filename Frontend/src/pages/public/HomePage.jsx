import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import {
  Scissors, CalendarDays, Sparkles, User, Palette,
  Star, Menu, X, ChevronDown, MapPin, Clock, Phone,
  Mail, ArrowRight, Shield, Award, Users, CheckCircle,
  Heart, Send, CreditCard, Coffee, Layers, Smile
} from "lucide-react";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const SERVICE_LINKS = [
  { label: "Men Services",   path: "/customer/services/men",   desc: "Haircut, Fade, Beard",       icon: <Scissors className="w-4 h-4" /> },
  { label: "Women Services", path: "/customer/services/women", desc: "Styling, Colour, Treatment",  icon: <Sparkles className="w-4 h-4" /> },
  { label: "Addon Services", path: "/customer/services/addon", desc: "Facial, Spa, Massage",        icon: <Coffee className="w-4 h-4" /> },
  { label: "All Services",   path: "/customer/services",       desc: "Browse everything",           icon: <Layers className="w-4 h-4" /> },
];

const NAV_ITEMS = [
  { label: "Home",     path: "/" },
  { label: "Services", path: "/customer/services", hasDropdown: true },
  { label: "Barbers",  path: "/nearby" },
  { label: "About",    path: "#about" },
  { label: "Contact",  path: "#contact" },
];

const FEATURES = [
   
 { title: "Signature Cuts",  Icon: Scissors, image: "https://i.pinimg.com/736x/82/c5/3d/82c53d8a1ea142d096daec6430eca0db.jpg", description: "Precision tailoring for the modern gentleman.",          path: "/customer/look" },
  { title: "Luxury Styling",  Icon: Sparkles, image: "https://i.pinimg.com/736x/ab/00/ea/ab00ead61169995482cc7703115efda2.jpg", description: "Couture hair transformations for feminine silhouette.",  path: "/customer/services/women" },
  { title: "Beard Sculpture", Icon: User,     image: "https://i.pinimg.com/736x/70/66/7f/70667fddecd13bde2bac687c3a7fa5cd.jpg", description: "Architectural grooming for the masculine profile.",      path: "/customer/services/men" },
  { title: "Color Artistry",  Icon: Palette,  image: "https://i.pinimg.com/736x/96/36/06/9636062d461545f11d4e7c5c510b2481.jpg", description: "Bespoke color palettes for every hair texture.",         path: "/customer/services/women" },
];

const HOW_IT_WORKS = [
  {
    step: "01", title: "Choose Service", path: "/customer/services",
    desc: "Browse men, women or addon services and pick what you need.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
        <circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/>
        <line x1="20" y1="4" x2="8.12" y2="15.88"/><line x1="14.47" y1="14.48" x2="20" y2="20"/><line x1="8.12" y1="8.12" x2="12" y2="12"/>
      </svg>
    ),
    bg: "#FEF3E2", color: "#C5A059",
  },
  {
    step: "02", title: "Select Barber", path: "/customer/barber",
    desc: "Pick your preferred barber or let us auto-assign the best available.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
    bg: "#FEF3E2", color: "#C5A059",
  },
  {
    step: "03", title: "Book & Pay", path: "/customer/booking",
    desc: "Pay a small token amount online. Rest to be paid at the salon.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
        <rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/>
      </svg>
    ),
    bg: "#FEF3E2", color: "#C5A059",
  },
  {
    step: "04", title: "Visit & Relax", path: "/visit-relax",
    desc: "Walk in at your slot and enjoy a premium grooming experience.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
      </svg>
    ),
    bg: "#FEF3E2", color: "#C5A059",
  },
];

const BARBER_TESTIMONIALS = [
  {
    name: "Rahul Sharma",
    review_text: "The premium fade and beard grooming here is exceptional. Best luxury barber experience in town!",
    avatar: "https://i.pinimg.com/736x/da/ca/5f/daca5fccc87fc4eecf59867f40eb04ad.jpg",
  },
  {
    name: "Vikram Malhotra",
    review_text: "Amazing attention to detail. The hot towel treatment and head massage after the haircut felt incredibly premium.",
    avatar: "https://i.pinimg.com/736x/d1/03/fd/d103fd5176a5c410a524a91bda718bbd.jpg",
  },
  {
    name: "Sneha Patel",
    review_text: "Took their premium hair spa and styling service. Absolutely loved the ambiance and professional staff!",
    avatar: "https://i.pinimg.com/1200x/aa/a7/fd/aaa7fd00ad035bdb72a3de08df060edf.jpg",
  },
  {
    name: "Arjun Mehta",
    review_text: "Flawless hair texture enhancement and styling. The barbers really understand modern trends and face shapes.",
    avatar: "https://i.pinimg.com/736x/50/fb/25/50fb25ac36eb75cfc883983fd77b1694.jpg",
  },
  {
    name: "Karan Johar",
    review_text: "Highly professional system. Booking an appointment was seamless, and the service console is amazing.",
    avatar: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=256&q=80",
  },
  {
    name: "Ananya Deshmukh",
    review_text: "Super clean, aesthetic interiors, and highly skilled professionals. The Service Console updates you instantly about your turn. Brilliant management!",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80",
    barber_rating: 5,
    salon_rating: 5,
  },
];
    const heroImages = [
  "https://i.pinimg.com/1200x/35/e1/16/35e116f3d65f94e0525f4810f94b5fc7.jpg",
  "https://i.pinimg.com/736x/d3/94/0b/d3940b17db908e6eb6aadb81b8c9723f.jpg",
  "https://images.unsplash.com/photo-1517832606299-7ae9b720a186?w=1600&q=80",
  "https://i.pinimg.com/1200x/02/24/d1/0224d143df59cb973f200f66f02713bb.jpg"
];

export default function HomePage() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropOpen, setDropOpen] = useState(false);
  const [salons, setSalons] = useState([]);
  const [scrolled, setScrolled] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [selectedReview, setSelectedReview] = useState(null);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [visibleCount, setVisibleCount] = useState(1);
  const dropRef = useRef(null);

  const [userCoords, setUserCoords] = useState(null);
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);
  const [locationError, setLocationError] = useState(null);

  const detectLocation = () => {
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by this browser.");
      return;
    }
    setIsDetectingLocation(true);
    setLocationError(null);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserCoords({ latitude, longitude });
        setIsDetectingLocation(false);
      },
      (error) => {
        console.error(error);
        setLocationError("Location permission denied. Please allow location access to see salons.");
        setIsDetectingLocation(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  // Compute visible cards based on window width
  const getVisibleCount = () => {
    if (typeof window === "undefined") return 1;
    if (window.innerWidth >= 1280) return 4;
    if (window.innerWidth >= 1024) return 3;
    if (window.innerWidth >= 640) return 2;
    return 1;
  };

  useEffect(() => {
    const update = () => setVisibleCount(getVisibleCount());
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  useEffect(() => {
    localStorage.removeItem("selectedSalonId");
    localStorage.removeItem("selectedSalonName");
    localStorage.removeItem("pendingBooking");

    detectLocation();

    if (!API) {
      console.error("API base URL configuration is missing.");
      return;
    }
    fetch(`${API}/salon/nearby`)
      .then((r) => { if (!r.ok) throw new Error(`Network response error: ${r.status}`); return r.json(); })
      .then((d) => { if (d.success) setSalons(d.salons?.slice(0, 3) || []); })
      .catch((err) => console.error("Failed fetching nearby salons:", err));

    fetch(`${API}/review`)
      .then((r) => { if (!r.ok) throw new Error(`Network response error: ${r.status}`); return r.json(); })
      .then((d) => { if (d.success) setReviews(d.reviews || []); })
      .catch((err) => console.error("Failed fetching reviews:", err));

    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (dropRef.current && !dropRef.current.contains(e.target)) setDropOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleNav = (path) => {
    setMenuOpen(false);
    setDropOpen(false);
    if (path.startsWith("#")) {
      document.querySelector(path)?.scrollIntoView({ behavior: "smooth" });
    } else {
      navigate(path);
    }
  };

  const handleCategoryClick = (category) => {
    const paths = {
      men: "/customer/services/men",
      women: "/customer/services/women",
    };
    navigate(paths[category] || "/customer/services");
  };

  const displayReviews = reviews.length > 0 ? reviews : BARBER_TESTIMONIALS;
  const maxIdx = Math.max(0, displayReviews.length - visibleCount);

  const handlePrev = () => setCurrentIdx((prev) => (prev <= 0 ? maxIdx : prev - 1));
  const handleNext = () => setCurrentIdx((prev) => (prev >= maxIdx ? 0 : prev + 1));

  const slidePercentage =
  visibleCount === 4 ? 25
  : visibleCount === 3 ? 33.5
  : visibleCount === 2 ? 50
  : 90;


  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const minSwipeDistance = 50;
    if (distance > minSwipeDistance) {
      handleNext();
    } else if (distance < -minSwipeDistance) {
      handlePrev();
    }
  };

const [currentSlide, setCurrentSlide] = useState(0);

useEffect(() => {
  const interval = setInterval(() => {
    setCurrentSlide((prev) => (prev + 1) % heroImages.length);
  }, 4000);

  return () => clearInterval(interval);
}, []); 

  return (
    <div className="min-h-screen bg-[#FAF6F0] text-stone-800 font-sans overflow-x-hidden">
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes border-beam { 0% { left:-100% } 100% { left:100% } }
        @keyframes fadeUp { from { opacity:0; transform:translateY(20px) } to { opacity:1; transform:none } }
        @keyframes float { 0%,100% { transform:translateY(0) } 50% { transform:translateY(-8px) } }
        .animate-border-beam { animation: border-beam 3s linear infinite }
        .fade-up { animation: fadeUp .6s ease forwards }
        .nav-link { position: relative }
        .nav-link::after { content:''; position:absolute; bottom:-2px; left:0; width:0; height:2px; background:#C5A059; transition:width .3s }
        .nav-link:hover::after { width:100% }
        .line-clamp-5 { display:-webkit-box; -webkit-line-clamp:5; -webkit-box-orient:vertical; overflow:hidden }
        .float-avatar { animation: float 4s ease-in-out infinite }
      `}} />

      <Navbar />

    {/* ── HERO ── */}
      <section className="relative w-full bg-[#FAF7F2] overflow-hidden min-h-[550px] md:min-h-[650px] flex items-center">
     <div className="absolute top-0 right-0 w-full md:w-[55%] h-full z-0 overflow-hidden select-none">
  <div className="absolute inset-0 bg-black/10 md:bg-transparent pointer-events-none" />

  {/* Slides */}
  {heroImages.map((img, index) => (
    <img
      key={index}
      src={img}
      alt={`Hero ${index + 1}`}
      className={`absolute inset-0 w-full h-full object-cover object-center md:object-[80%_center]
      transition-opacity duration-1000 ${
        index === currentSlide ? "opacity-100" : "opacity-0"
      }`}
    />
  ))}

  {/* Overlays */}
  <div className="absolute inset-0 bg-gradient-to-r from-[#FAF7F2] via-[#FAF7F2]/70 to-transparent w-full md:w-[20%] pointer-events-none" />
  <div className="absolute inset-0 bg-gradient-to-t from-[#FAF7F2]/30 via-transparent to-transparent pointer-events-none" />
</div>

        {/* ── ✅ FIXED: ADJUSTED TOP PADDING TO MOVE THE PACKET GRID LOGIC DOWN CLEANLY ── */}
        <div className="mx-auto max-w-7xl w-full px-6 pt-28 pb-16 md:pt-40 md:pb-24 grid md:grid-cols-2 gap-12 items-center relative z-10">
          <div className="space-y-6 max-w-xl fade-up">
            <h1 className="text-4xl sm:text-5xl md:text-5xl font-black text-stone-900 tracking-wide uppercase leading-[1.15] font-serif">
              Premium Services <br />
              <span className="text-[#C5A059] font-light italic normal-case font-serif tracking-normal">at affordable prices</span>
            </h1>

            <p className="text-base md:text-lg text-stone-700 font-sans normal-case leading-relaxed">
              Where Classic Barbering Meets Modern Salon Luxury. Expert grooming & styling for both men and women. Because great style has no gender.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2 text-left">
              <button
                onClick={() => handleCategoryClick("men")}
                className="flex items-center gap-3 bg-white/70 hover:bg-white transition-colors duration-200 backdrop-blur-sm border border-stone-200/60 hover:border-stone-400 p-2.5 px-4 rounded-xl shadow-sm cursor-pointer"
              >
                <div className="p-1.5 bg-stone-900/10 rounded-lg text-stone-800"><Scissors size={14} /></div>
                <div>
                  <h4 className="text-[11px] font-black uppercase tracking-wider text-stone-800 leading-tight">For Men</h4>
                  <p className="text-[9px] text-stone-500 leading-none mt-0.5">Sharp. Confident.</p>
                </div>
              </button>

              <button
                onClick={() => handleCategoryClick("women")}
                className="flex items-center gap-3 bg-white/70 hover:bg-white transition-colors duration-200 backdrop-blur-sm border border-stone-200/60 hover:border-stone-400 p-2.5 px-4 rounded-xl shadow-sm cursor-pointer"
              >
                <div className="p-1.5 bg-stone-900/10 rounded-lg text-stone-800"><Sparkles size={14} /></div>
                <div>
                  <h4 className="text-[11px] font-black uppercase tracking-wider text-stone-800 leading-tight">For Women</h4>
                  <p className="text-[9px] text-stone-500 leading-none mt-0.5">Stylish. Empowered.</p>
                </div>
              </button>


            </div>

            <div className="flex items-center gap-4 bg-white/40 backdrop-blur-sm border border-stone-200/50 p-3 px-5 rounded-2xl w-fit shadow-xs my-2">
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

            <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
              <button
                onClick={() => navigate("/customer/services")}
                className="gap-3 sm:gap-4 flex items-center justify-center px-8 py-3.5 bg-[#bb8d65] hover:bg-[#916b4a] text-white rounded-xl font-bold uppercase text-xs tracking-widest shadow-md transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer border-none"
              >
                <svg className="w-4 h-4 text-white/90" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 002-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                BOOK APPOINTMENT
              </button>

              <button
                onClick={() => handleNav("#services")}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 bg-white/40 backdrop-blur-xs border border-stone-400/60 hover:border-stone-500 text-stone-800 rounded-xl font-bold uppercase text-xs tracking-widest transition-all hover:scale-[1.02] active:scale-[0.98] group cursor-pointer"
              >
                <svg className="w-3.5 h-3.5 text-[#A37B58] transition-transform group-hover:scale-110" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                </svg>
                EXPLORE SERVICES
              </button>
            </div>
          </div>

          <div className="relative h-full w-full min-h-[260px] sm:min-h-[320px] md:min-h-[400px] flex items-end justify-center md:justify-end">
            <div 
              onClick={() => navigate("/customer/barber")}
              className="w-full max-w-sm bg-white/85 backdrop-blur-md rounded-2xl p-4 shadow-xl border border-white/40 flex items-center gap-4 transition-all duration-300 hover:scale-[1.02] cursor-pointer"
            >
              <img
                src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?&w=100&q=80"
                alt="Rahul Sharma - Senior Stylist"
                className="w-14 h-14 rounded-xl object-cover border border-stone-200 shadow-sm"
              />
              <div className="text-left">
                <p className="text-[9px] font-black text-[#C5A059] uppercase tracking-[0.2em] leading-none mb-1">Senior Stylist</p>
                <h4 className="text-lg font-bold text-stone-900 tracking-tight">Rahul Sharma</h4>
                <p className="text-xs text-stone-500 mt-0.5">Specialist in Men's Grooming</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* ── STATS BAR ── */}
      <section className="relative w-full bg-[#FAF7F2] pb-12 pt-4 px-6 z-20">
        <div className="mx-auto max-w-7xl bg-white/60 backdrop-blur-md border border-stone-200/40 rounded-3xl p-6 md:p-8 shadow-sm grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4 items-center">
          <div className="flex items-center gap-4 justify-center md:border-r border-stone-200/60">
            <div className="text-[#A37B58]">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.121 14.121L19 19m-4.879-4.879l-4.242-4.242M14.121 14.121a3 3 0 10-4.243-4.242m4.243 4.242a3 3 0 11-4.243-4.243m0 0L4 4m5.172 5.172L4 14m5.172-5.172l4.242 4.242" />
              </svg>
            </div>
            <div className="text-left">
              <h3 className="text-xl md:text-2xl font-black text-stone-900 tracking-tight leading-none">15+</h3>
              <p className="text-[10px] uppercase font-bold tracking-wider text-stone-500 mt-1">Expert Barbers</p>
            </div>
          </div>

          <div className="flex items-center gap-4 justify-center md:border-r border-stone-200/60">
            <div className="text-[#A37B58]">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div className="text-left">
              <h3 className="text-xl md:text-2xl font-black text-stone-900 tracking-tight leading-none">10K+</h3>
              <p className="text-[10px] uppercase font-bold tracking-wider text-stone-500 mt-1">Happy Clients</p>
            </div>
          </div>

          <div className="flex items-center gap-4 justify-center md:border-r border-stone-200/60">
            <div className="text-[#A37B58]">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="text-left">
              <h3 className="text-xl md:text-2xl font-black text-stone-900 tracking-tight leading-none">7 Days</h3>
              <p className="text-[10px] uppercase font-bold tracking-wider text-stone-500 mt-1">Open Every Week</p>
            </div>
          </div>

          <div className="flex items-center gap-4 justify-center">
            <div className="text-[#A37B58]">
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

      {/* ── ABOUT ── */}
      <section id="about" className="relative w-full overflow-hidden bg-gradient-to-br from-[#1A1613] via-[#2A241F] to-[#3E362E] py-14 md:py-16">
        <div className="absolute top-[-120px] left-[-100px] w-[320px] h-[320px] bg-[#C5A059]/20 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-120px] right-[-100px] w-[320px] h-[320px] bg-white/10 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/asfalt-dark.png')]" />

        <div className="relative z-20 mx-auto max-w-[1550px] px-4 md:px-8">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-center">
            <div className="relative group">
              <div className="absolute inset-0 rounded-[32px] overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-[-120%] w-[60%] h-full rotate-12 bg-gradient-to-r from-transparent via-white/10 to-transparent group-hover:left-[140%] transition-all duration-1000" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                 
                 <img src="https://images.unsplash.com/photo-1682693299902-9a749e6cc55b?q=80&w=600&auto=format&fit=crop" alt="Barber"   className="w-full h-40 md:h-44 object-cover rounded-[28px] border border-white/10 hover:scale-[1.03] hover:border-[#C5A059]/40 transition-all duration-500" />
                  <img  src="https://images.unsplash.com/photo-1672257493626-038f96997ade?q=80&w=600&auto=format&fit=crop"alt="Salon"    className="w-full h-28 md:h-32 object-cover rounded-[28px] border border-white/10 hover:scale-[1.03] hover:border-[#C5A059]/40 transition-all duration-500" />
                </div>
                <div className="space-y-4 mt-6">
                  <img src="https://images.unsplash.com/photo-1718364673840-4bf5de5240b5?q=80&w=600&auto=format&fit=crop" alt="Interior" className="w-full h-28 md:h-32 object-cover rounded-[28px] border border-white/10 hover:scale-[1.03] hover:border-[#C5A059]/40 transition-all duration-500" />
                  <img src="https://i.pinimg.com/1200x/c0/7c/78/c07c78a373ee1bfd8c122578be42e0c2.jpg" alt="Service"  className="w-full h-40 md:h-44 object-cover rounded-[28px] border border-white/10 hover:scale-[1.03] hover:border-[#C5A059]/40 transition-all duration-500" />
                </div>
              </div>
              <div className="absolute -bottom-3 -right-3 bg-white/10 backdrop-blur-2xl border border-[#C5A059]/30 text-white rounded-3xl px-5 py-4 text-center z-10">
                <p className="text-2xl font-black text-[#FFE6A7]">10+</p>
                <p className="text-[9px] font-black uppercase tracking-[0.25em] text-stone-300 mt-1">Years of Excellence</p>
              </div>
            </div>

            <div>
              <span className="text-[11px] font-black uppercase tracking-[0.35em] text-[#C5A059]">About Us</span>
              <h2 className="mt-4 text-3xl md:text-4xl lg:text-5xl font-black uppercase tracking-tight bg-gradient-to-r from-[#C5A059] via-[#FFE6A7] to-[#C5A059] bg-clip-text text-transparent leading-tight">
                We Are The Art Of <span className="italic font-serif">Grooming</span>
              </h2>
              <div className="w-20 h-[3px] bg-gradient-to-r from-[#C5A059] to-[#FFE6A7] rounded-full mt-4" />
              <p className="leading-relaxed mt-6 mb-4 font-serif italic text-stone-300 text-base md:text-lg">
                BarberPro is Pune's premier grooming destination, where tradition meets modern luxury.
              </p>
              <p className="leading-relaxed mb-6 text-stone-400 text-sm md:text-base">
                Our platform connects customers with the best barbers in the city, offering seamless booking, real-time queue management, and premium grooming services.
              </p>
              <div className="space-y-3 mb-8">
                {["Real-time queue tracking","Certified master barbers","Premium grooming products","100% hygienic tools","Easy online booking system"].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 bg-white/[0.04] backdrop-blur-xl border border-white/10 rounded-2xl px-4 py-3 hover:border-[#C5A059]/40 transition-all duration-300">
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#C5A059] to-[#E8C878] flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="w-4 h-4 text-[#2A241F]" />
                    </div>
                    <span className="text-sm text-stone-200">{item}</span>
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap gap-4">
                <button onClick={() => navigate("/about")} className="flex items-center gap-2 px-7 py-3.5 rounded-2xl bg-gradient-to-r from-[#C5A059] via-[#E8C878] to-[#C5A059] text-[#2A241F] font-black uppercase tracking-[0.2em] text-[10px] hover:scale-105 transition-all duration-300 cursor-pointer">
                  Read More <ArrowRight className="w-4 h-4" />
                </button>
                <button onClick={() => navigate("/customer/services")} className="flex items-center gap-2 px-7 py-3.5 rounded-2xl border border-[#C5A059]/40 bg-white/5 backdrop-blur-xl text-[#FFE6A7] font-black uppercase tracking-[0.2em] text-[10px] hover:bg-[#C5A059]/10 hover:border-[#FFE6A7] transition-all duration-300 cursor-pointer">
                  Book Now <CalendarDays className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SERVICES ── */}
      <section id="services" className="relative overflow-hidden py-20 md:py-28 bg-[#F9F5EF]">
        <div className="absolute top-[-120px] left-[-120px] w-[320px] h-[320px] bg-[#C5A059]/10 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-[-120px] right-[-120px] w-[320px] h-[320px] bg-[#C5A059]/10 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute inset-0 opacity-[0.025] bg-[url('https://www.transparenttextures.com/patterns/asfalt-dark.png')] pointer-events-none" />

        <div className="relative z-10 mx-auto max-w-7xl px-6">
          <div className="text-center mb-16">
            <span className="text-[12px] sm:text-[14px] font-black uppercase tracking-[0.35em] text-[#C5A059]">What We Offer</span>
            <h2 className="mt-4 text-3xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight leading-tight bg-gradient-to-r from-[#3E362E] via-[#C5A059] to-[#3E362E] bg-clip-text text-transparent">
              Our Services
            </h2>
            <div className="w-20 h-[3px] rounded-full mx-auto mt-5 bg-gradient-to-r from-[#C5A059] to-[#E8C878]" />
          </div>

          <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                
              onClick={() => {
    if (f.title === "Signature Cuts") {
      navigate("/customer/look", {
      state: { gender: "women", service: { name: "Haircut & Styling", category: "women" }, barber: null }});
      } else if (f.title === "Color Artistry") {
         navigate("/customer/look", {state: { gender: "women", service: { name: "Color Artistry", category: "color" }, barber: null }});
     } else {
         navigate(f.path);
         }
        }}
                className="group relative h-[360px] rounded-[30px] overflow-hidden border border-[#EADDCA] bg-white/80 backdrop-blur-xl shadow-[0_10px_40px_rgba(0,0,0,0.08)] transition-all duration-500 hover:-translate-y-3 hover:shadow-[0_20px_60px_rgba(197,160,89,0.18)] hover:border-[#C5A059]/50 cursor-pointer"
              >
                <div className="absolute top-0 left-[-120%] w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent rotate-12 group-hover:left-[120%] transition-all duration-1000 z-20 pointer-events-none" />
                <div className="absolute inset-0 z-0">
                  <img src={f.image} alt={f.title} className="h-full w-full object-cover opacity-400 scale-100 group-hover:scale-110 group-hover:opacity-100 transition-all duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#F9F5EF] via-[#F9F5EF]/20 to-transparent" />
                </div>
                <div className="relative z-10 p-6 md:p-7 flex flex-col justify-end h-full">
                  <div className="mb-5 inline-flex w-fit rounded-2xl bg-white/70 backdrop-blur-xl p-4 text-[#C5A059] border border-white/40 group-hover:bg-[#C5A059] group-hover:text-white transition-all duration-300">
                    <f.Icon size={24} />
                  </div>
                  <h3 className="mb-3 text-sm md:text-base font-black uppercase tracking-[0.18em] text-[#3E362E]">{f.title}</h3>
                  <p className="text-[11px] md:text-xs leading-relaxed text-stone-700 italic font-serif mb-5">{f.description}</p>
                  <span className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.22em] text-[#C5A059] opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                    Book Now <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-14">
            <button
              onClick={() => navigate("/customer/services")}
              className="inline-flex items-center gap-3 px-10 py-4 rounded-2xl bg-gradient-to-r from-[#3E362E] via-[#4B4037] to-[#3E362E] text-white font-black uppercase text-[11px] tracking-[0.2em] hover:scale-105 hover:from-[#C5A059] hover:to-[#E8C878] transition-all duration-300 cursor-pointer"
            >
              View All Services <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="relative w-full overflow-hidden bg-[#3E362E] py-20 md:py-28 select-none">
        <div className="absolute top-[-120px] left-[-120px] w-[320px] h-[320px] bg-[#C5A059]/15 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-[-120px] right-[-120px] w-[320px] h-[320px] bg-white/5 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/asfalt-dark.png')] pointer-events-none" />

        <div className="relative z-10 mx-auto max-w-7xl px-6">
          <div className="text-center mb-16">
            <span className="text-[12px] sm:text-[14px] font-black uppercase tracking-[0.35em] text-[#C5A059]">Simple Process</span>
            <h2 className="mt-4 text-3xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight bg-gradient-to-r from-[#C5A059] via-[#FFE6A7] to-[#C5A059] bg-clip-text text-transparent">
              How It Works
            </h2>
            <div className="w-20 h-[3px] rounded-full mx-auto mt-5 bg-gradient-to-r from-[#C5A059] to-[#FFE6A7]" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {HOW_IT_WORKS.map((s, i) => (
              <div key={s.step} onClick={() => navigate(s.path)} className="group relative cursor-pointer">
                {i < HOW_IT_WORKS.length - 1 && (
                  <div className="hidden lg:block absolute top-16 left-[calc(50%+4rem)] w-[calc(100%-4rem)] h-[2px] bg-gradient-to-r from-[#C5A059] to-white/10" />
                )}
                <div className="relative min-h-[320px] rounded-[30px] bg-white/10 backdrop-blur-2xl border border-white/10 overflow-hidden p-8 text-center transition-all duration-500 hover:-translate-y-3 hover:scale-[1.02] hover:border-[#C5A059]/40 hover:shadow-[0_0_45px_rgba(197,160,89,0.25)] flex flex-col items-center justify-center">
                  <div className="absolute top-0 left-[-120%] w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent rotate-12 group-hover:left-[120%] transition-all duration-1000 pointer-events-none" />
                  <div className="relative z-10 w-24 h-24 rounded-3xl flex items-center justify-center border-2 transition-all duration-300 group-hover:scale-110 group-hover:-translate-y-2"
                    style={{ background: s.bg, borderColor: s.color, color: s.color }}>
                    {s.icon}
                  </div>
                  <div className="relative z-10 mt-6 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.22em] border"
                    style={{ background: s.bg, borderColor: s.color, color: s.color }}>
                    Step {s.step}
                  </div>
                  <h3 className="relative z-10 mt-5 text-[15px] font-black uppercase tracking-[0.15em] text-white group-hover:text-[#FFE6A7] transition-all">{s.title}</h3>
                  <p className="relative z-10 mt-4 text-[12px] leading-relaxed text-stone-300 max-w-[240px]">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-14">
            <button
              onClick={() => navigate("/customer/services")}
              className="inline-flex items-center gap-3 px-10 py-4 rounded-2xl bg-gradient-to-r from-[#C5A059] via-[#E8C878] to-[#C5A059] text-[#2A241F] font-black uppercase text-[11px] tracking-[0.22em] hover:scale-105 transition-all duration-300 cursor-pointer"
            >
              Get Started Now <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* ── NEARBY SALONS ── */}
      <section className="bg-[#F9F5EF] py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#C5A059]">Find Us</span>
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight text-[#3E362E] mt-3">Nearby Salons</h2>
            <div className="w-16 h-1 bg-[#C5A059] mx-auto mt-4 rounded-full" />
          </div>

          {userCoords ? (
            salons.length === 0 ? (
              <div className="py-12 text-center bg-white border border-[#EADDCA] rounded-[32px]">
                <MapPin className="w-12 h-12 mx-auto text-[#C5A059]/40 mb-3" />
                <p className="text-base font-extrabold text-[#3E362E]">No Salons Available</p>
                <p className="text-stone-400 text-xs mt-1">There are no approved salons in our system at the moment.</p>
              </div>
            ) : (
              <>
                <div className="grid gap-6 md:grid-cols-3">
                  {salons.map((s) => (
                    <div key={s._id} onClick={() => {
                      localStorage.setItem("selectedSalonId", s._id);
                      localStorage.setItem("selectedSalonName", s.salon_name);
                      navigate("/salon");
                    }}
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
                        <button type="button" onClick={(e) => {
                          e.stopPropagation();
                          localStorage.setItem("selectedSalonId", s._id);
                          localStorage.setItem("selectedSalonName", s.salon_name);
                          navigate("/salon");
                        }}
                          className="flex-1 border border-[#EADDCA] text-[#3E362E] py-2 rounded-lg text-[10px] font-black uppercase tracking-widest hover:border-[#C5A059] transition cursor-pointer bg-transparent">
                          View Details
                        </button>
                        <button type="button" onClick={(e) => { e.stopPropagation(); navigate("/customer/services"); }}
                          className="flex-1 bg-[#3E362E] text-white py-2 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-[#C5A059] transition cursor-pointer">
                          Book Now
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="text-center mt-8">
                  <button type="button" onClick={() => navigate("/nearby")}
                    className="inline-flex items-center gap-2 text-[#C5A059] font-black uppercase text-[11px] tracking-widest hover:gap-4 transition-all cursor-pointer bg-transparent border-none">
                    View All Salons <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </>
            )
          ) : (
            <div className="max-w-2xl mx-auto text-center py-12 px-6 bg-white border border-[#EADDCA] rounded-[32px] shadow-sm relative overflow-hidden">
              <div className="absolute top-0 left-[-120%] w-full h-full bg-gradient-to-r from-transparent via-[#C5A059]/5 to-transparent rotate-12 pointer-events-none" />
              
              <div className="relative z-10 flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-[#FAF6F0] border border-[#EADDCA] flex items-center justify-center mb-6 shadow-xs relative">
                  <MapPin className="w-8 h-8 text-[#C5A059] animate-bounce" />
                  <div className="absolute inset-0 rounded-full border-2 border-[#C5A059]/30 animate-ping opacity-75" />
                </div>

                <h3 className="text-xl font-black uppercase tracking-wider text-[#3E362E] mb-3">
                  Enable Location Services
                </h3>
                
                <p className="text-stone-600 text-sm leading-relaxed max-w-md mb-8">
                  To view our premium grooming studios and nearby salons, please allow location access. Antigravity requires location to discover the nearest artists and estimate queue wait times.
                </p>

                <button
                  type="button"
                  onClick={detectLocation}
                  disabled={isDetectingLocation}
                  className="px-8 py-4 bg-[#3E362E] hover:bg-[#C5A059] text-white hover:text-[#2A241F] font-black uppercase text-xs tracking-widest rounded-xl transition-all duration-300 shadow-md hover:scale-[1.02] active:scale-[0.98] cursor-pointer border-none flex items-center gap-2"
                >
                  {isDetectingLocation ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Requesting...
                    </>
                  ) : (
                    <>
                      <MapPin className="w-4 h-4" />
                      Allow Location Access
                    </>
                  )}
                </button>

                {locationError && (
                  <div className="mt-6 p-4 bg-amber-50/60 border border-amber-200/50 rounded-2xl max-w-md text-left flex items-start gap-3">
                    <svg className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <div>
                      <p className="text-xs font-extrabold text-amber-800 uppercase tracking-wider mb-1">
                        Permission Blocked
                      </p>
                      <p className="text-stone-600 text-xs leading-normal">
                        It looks like location permission is disabled or blocked. Please click the settings/lock icon next to the URL in your browser address bar and enable Location for this site.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </section>



 {/* ── 5. CUSTOMER TESTIMONIALS SECTION ── */}
      <section className="relative w-full overflow-hidden bg-gradient-to-br from-[#1A1613] via-[#2A241F] to-[#3E362E] py-20 sm:py-24 px-4 flex flex-col items-center justify-center">
        <div className="absolute top-[-100px] left-[-100px] w-[320px] h-[320px] bg-[#C5A059]/20 blur-[120px] rounded-full animate-pulse pointer-events-none" />
        <div className="absolute bottom-[-100px] right-[-100px] w-[320px] h-[320px] bg-white/10 blur-[120px] rounded-full animate-pulse pointer-events-none" />
        <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/asfalt-dark.png')] pointer-events-none" />

        <div className="relative z-20 text-center mb-14 px-4">
          <span className="text-[12px] sm:text-[14px] font-black uppercase tracking-[0.35em] text-[#C5A059]">WHAT Clients SAYS</span>
          <h2 className="mt-4 text-3xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight bg-gradient-to-r from-[#C5A059] via-[#FFE6A7] to-[#C5A059] bg-clip-text text-transparent leading-tight">
            Customer Reviews
          </h2>
          <div className="w-20 h-[3px] bg-gradient-to-r from-[#C5A059] to-[#FFE6A7] mx-auto mt-5 rounded-full shadow-[0_0_20px_rgba(197,160,89,0.7)]" />
        </div>

        <div className="relative w-full max-w-[1450px] px-2 sm:px-8">
          <button
            type="button"
            onClick={handlePrev}
            className="absolute left-[-5px] sm:left-0 lg:left-[-25px] top-1/2 -translate-y-1/2 z-40 bg-transparent border-none text-stone-400 hover:text-white cursor-pointer transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>

          <div 
            className="overflow-hidden py-6 w-full cursor-grab active:cursor-grabbing select-none"
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            <div
              className="flex items-stretch gap-5 lg:gap-7 transition-transform duration-700 ease-out"
              style={{
                /* ── ✅ FIXED: WRAPPED TRANSLATION INTERPOLATION IN BACKTICKS VERBATIM ── */
                transform: `translateX(-${currentIdx * slidePercentage}%)`,
              }}
            >
              {displayReviews.map((item, idx) => {
                const isReal = !!item._id;
                const name = isReal ? item.customer_id?.name || "Anonymous" : item.name;
                const rawText = isReal ? item.review_text || "(No written feedback)" : item.review_text || item.text || "";

                // Parse MCQ details
                let cleanText = rawText;
                let mcqDetails = null;
                if (rawText.startsWith("[")) {
                  const closeIndex = rawText.indexOf("]");
                  if (closeIndex !== -1) {
                    const bracketed = rawText.substring(1, closeIndex);
                    cleanText = rawText.substring(closeIndex + 1).trim();
                    if (!cleanText) {
                      cleanText = "Bespoke styling and premium grooming experience.";
                    }
                    
                    mcqDetails = {};
                    const parts = bracketed.split("|");
                    parts.forEach(p => {
                      const colonIndex = p.indexOf(":");
                      if (colonIndex !== -1) {
                        const key = p.substring(0, colonIndex).trim();
                        const val = p.substring(colonIndex + 1).trim();
                        mcqDetails[key] = val;
                      }
                    });
                  }
                }

                const rating = item.salon_rating || item.barber_rating || item.rating || 5;

                return (
                  <div
                    /* ── ✅ FIXED: CLEANED ARRAY COMPILATION FALLBACK STRING STRIPING ── */
                    key={item._id || `${name}-${idx}`}
                    onClick={() =>
                      isReal &&
                      setSelectedReview &&
                      setSelectedReview(item)
                    }
                    className="
                      relative
                      w-[85%]
                      sm:w-[48%]
                      lg:w-[31%]
                      xl:w-[23%]
                      min-h-[350px]
                      flex-shrink-0
                      rounded-[24px]
                      border border-white/10
                      bg-white/[0.07]
                      backdrop-blur-2xl
                      overflow-hidden
                      p-6 sm:p-7
                      flex flex-col
                      items-start
                      text-left
                      transition-all
                      duration-500
                      hover:-translate-y-3
                      hover:shadow-[0_0_40px_rgba(197,160,89,0.25)]
                      hover:border-[#C5A059]/40
                      group
                      cursor-pointer
                    "
                  >
                    {/* Glow */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/[0.06] to-transparent opacity-50 pointer-events-none" />

                    {/* Shine Effect */}
                    <div className="absolute top-0 left-[-120%] w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent group-hover:left-[120%] transition-all duration-1000 rotate-12 pointer-events-none" />

                    {/* Author Header */}
                    <div className="w-full flex justify-between items-start z-10 relative">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <h3 className="text-[#FFE6A7] text-[15px] font-black uppercase tracking-wide truncate">
                          {name}
                        </h3>
                        {isReal && (
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400/10 stroke-[2.5px] flex-shrink-0" />
                        )}
                      </div>
                      {isReal && item.created_at && (
                        <span className="text-[8px] font-mono text-stone-400 uppercase tracking-widest flex-shrink-0">
                          {new Date(item.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                        </span>
                      )}
                    </div>

                    {/* Stars Rating */}
                    <div className="flex gap-0.5 justify-start mt-2 mb-3.5 relative z-10">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`w-3.5 h-3.5 ${i < Math.round(rating) ? 'fill-[#E8C878] text-[#E8C878]' : 'text-white/20'}`} 
                        />
                      ))}
                    </div>

                    {/* Review Text */}
                    <p className="relative z-10 text-stone-200 italic font-serif text-[13.5px] leading-6 line-clamp-5 flex-grow text-left w-full">
                      "{cleanText}"
                    </p>

                    {/* MCQ Details Badges */}
                    {mcqDetails && (
                      <div className="relative z-10 flex flex-wrap gap-1.5 mt-4 mb-2 w-full justify-start">
                        {Object.entries(mcqDetails).map(([key, val]) => (
                          <span key={key} className="text-[7px] font-sans font-black uppercase tracking-widest bg-white/10 text-[#FFE6A7] px-2.5 py-1 rounded-md border border-white/5 whitespace-nowrap">
                            {key}: {val}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Button */}
                    <div className="relative z-10 w-full mt-5">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate("/customer/services");
                        }}
                        className="
                          w-full
                          py-3
                          border-none
                          rounded-xl
                          bg-gradient-to-r
                          from-[#C5A059]
                          via-[#E8C878]
                          to-[#C5A059]
                          text-[#2A241F]
                          font-black
                          uppercase
                          tracking-[0.2em]
                          text-[9px]
                          shadow-[0_0_20px_rgba(197,160,89,0.25)]
                          hover:scale-[1.02]
                          transition-all
                          duration-300
                          cursor-pointer
                        "
                      >
                        BOOK THIS EXPERIENCE
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          
          <button
            type="button"
            onClick={handleNext}
            className="absolute right-[-5px] sm:right-0 lg:right-[-25px] top-1/2 -translate-y-1/2 z-40 bg-transparent border-none text-stone-400 hover:text-white cursor-pointer transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </button>
        </div>

        <div className="relative z-20 mt-14 flex flex-col sm:flex-row gap-4">
          <button
            type="button"
            onClick={() => { if (navigate) navigate("/reviews"); }}
            className="px-8 py-4 border-none rounded-2xl bg-gradient-to-r from-[#C5A059] via-[#E8C878] to-[#C5A059] text-[#2A241F] font-black uppercase tracking-[0.2em] text-[11px] shadow-[0_0_30px_rgba(197,160,89,0.45)] hover:scale-105 transition-all duration-300 cursor-pointer"
          >
            {/* ── ✅ FIXED: REPAIRED BROKEN CONDITIONAL TEMPLATE ESCAPES OUTSIDE VALUE WRAPPERS ── */}
            See All Reviews {reviews && reviews.length > 0 ? ` (${reviews.length})` : ""}
          </button>

          <button
            type="button"
            onClick={() => { if (navigate) navigate("/write-review"); }}
            className="px-8 py-4 rounded-2xl border border-[#C5A059]/40 bg-white/5 backdrop-blur-xl text-[#FFE6A7] font-black uppercase tracking-[0.2em] text-[11px] hover:bg-[#C5A059]/10 hover:border-[#FFE6A7] transition-all duration-300 cursor-pointer"
          >
            Write a Review
          </button>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="relative w-full overflow-hidden bg-[#FAF7F0] py-24 px-6 border-t border-[#3E362E]/10">
        <div className="absolute top-[-120px] left-[-120px] w-[320px] h-[320px] bg-[#C5A059]/10 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-[-120px] right-[-120px] w-[320px] h-[320px] bg-[#C5A059]/10 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute inset-0 opacity-[0.025] bg-[url('https://www.transparenttextures.com/patterns/asfalt-dark.png')] pointer-events-none" />

        <div className="relative z-10 max-w-5xl mx-auto">
          <div className="relative overflow-hidden rounded-[40px] border border-[#E6D7BC] bg-white/60 backdrop-blur-2xl shadow-[0_20px_60px_rgba(62,54,46,0.08)] px-6 sm:px-10 lg:px-16 py-14 lg:py-16 text-center">
            <span className="relative z-10 text-[12px] font-black uppercase tracking-[0.35em] text-[#C5A059]">Luxury Experience</span>
            <h2 className="relative z-10 mt-5 text-3xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight leading-tight text-[#3E362E]">
              Ready For Your{" "}
              <span className="italic font-serif bg-gradient-to-r from-[#C5A059] via-[#E8C878] to-[#C5A059] bg-clip-text text-transparent pr-4 inline-block">
                Transformation?
              </span>
            </h2>
            <div className="w-20 h-[3px] rounded-full mx-auto mt-6 bg-gradient-to-r from-[#C5A059] to-[#E8C878]" />
            <p className="relative z-10 mt-7 text-stone-600 text-base sm:text-lg italic font-serif leading-relaxed max-w-2xl mx-auto">
              Book your appointment today and experience the premium BarberPro grooming journey crafted for confidence and style.
            </p>
            <div className="relative z-10 mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button type="button" onClick={() => navigate("/customer/services")}
                className="w-full sm:w-auto flex items-center justify-center gap-3 px-10 py-4 rounded-2xl bg-gradient-to-r from-[#C5A059] via-[#E8C878] to-[#C5A059] text-[#2A241F] font-black uppercase text-[11px] tracking-[0.22em] hover:scale-105 transition-all duration-300 cursor-pointer">
                <CalendarDays className="w-5 h-5" /> Book Now
              </button>
              <button type="button" onClick={() => navigate("/nearby")}
                className="w-full sm:w-auto flex items-center justify-center gap-3 px-10 py-4 rounded-2xl border border-[#3E362E]/15 bg-white/50 backdrop-blur-xl text-[#3E362E] font-black uppercase text-[11px] tracking-[0.22em] hover:border-[#C5A059] hover:text-[#C5A059] hover:scale-105 transition-all duration-300 cursor-pointer">
                <MapPin className="w-5 h-5" /> Find Salon
              </button>
              <button type="button" onClick={() => navigate("/login")}
                className="w-full sm:w-auto flex items-center justify-center gap-3 px-10 py-4 rounded-2xl border border-[#3E362E]/15 bg-white/50 backdrop-blur-xl text-[#3E362E] font-black uppercase text-[11px] tracking-[0.22em] hover:border-[#C5A059] hover:text-[#C5A059] hover:scale-105 transition-all duration-300 cursor-pointer">
                <User className="w-5 h-5" /> Login
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <Footer />

      {/* ── REVIEW MODAL ── */}
      {selectedReview && (
        <div
          className="fixed inset-0 bg-black/80 z-[100] overflow-y-auto flex items-start sm:items-center justify-center p-4 backdrop-blur-sm"
          style={{ animation: "fadeUp 0.3s ease forwards" }}
          onClick={() => setSelectedReview(null)}
        >
          <div
            className="bg-white rounded-3xl p-6 sm:p-10 max-w-md w-full shadow-2xl border border-[#EADDCA] my-auto relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#C5A059] to-[#E8A840] flex items-center justify-center text-white font-black text-lg">
                  {(selectedReview.customer_id?.name?.[0] || "?").toUpperCase()}
                </div>
                <div>
                  <p className="font-black text-[#3E362E] text-base">{selectedReview.customer_id?.name || "Anonymous"}</p>
                  <p className="text-[9px] tracking-[0.2em] uppercase text-[#8D7B68] font-bold mt-0.5">
                    {new Date(selectedReview.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
                  </p>
                </div>
              </div>
              <button type="button" onClick={() => setSelectedReview(null)} className="text-[#8D7B68] hover:text-[#3E362E] transition cursor-pointer bg-transparent border-none">
                <X className="w-5 h-5" />
              </button>
            </div>

            {(selectedReview.salon_rating > 0 || selectedReview.barber_rating > 0) && (
              <div className="grid grid-cols-2 gap-3 mb-5">
                {selectedReview.salon_rating > 0 && (
                  <div className="bg-[#FEF3E2] rounded-xl p-3 text-center border border-[#EADDCA]">
                    <p className="text-[9px] tracking-widest uppercase text-[#C5A059] font-black mb-1">Salon</p>
                    <p className="text-2xl text-[#C5A059]">
                      {"★".repeat(selectedReview.salon_rating)}
                      <span className="text-[#EADDCA]">{"★".repeat(5 - selectedReview.salon_rating)}</span>
                    </p>
                  </div>
                )}
                {selectedReview.barber_rating > 0 && (
                  <div className="bg-[#FEF3E2] rounded-xl p-3 text-center border border-[#EADDCA]">
                    <p className="text-[9px] tracking-widests uppercase text-[#C5A059] font-black mb-1">Barber</p>
                    <p className="text-2xl text-[#C5A059]">
                      {"★".repeat(selectedReview.barber_rating)}
                      <span className="text-[#EADDCA]">{"★".repeat(5 - selectedReview.barber_rating)}</span>
                    </p>
                  </div>
                )}
              </div>
            )}

            {(() => {
              const rawText = selectedReview.review_text || "";
              let cleanText = rawText;
              let mcqDetails = null;
              if (rawText.startsWith("[")) {
                const closeIndex = rawText.indexOf("]");
                if (closeIndex !== -1) {
                  const bracketed = rawText.substring(1, closeIndex);
                  cleanText = rawText.substring(closeIndex + 1).trim();
                  if (!cleanText) {
                    cleanText = "Bespoke styling and premium grooming experience.";
                  }
                  
                  mcqDetails = {};
                  const parts = bracketed.split("|");
                  parts.forEach(p => {
                    const colonIndex = p.indexOf(":");
                    if (colonIndex !== -1) {
                      const key = p.substring(0, colonIndex).trim();
                      const val = p.substring(colonIndex + 1).trim();
                      mcqDetails[key] = val;
                    }
                  });
                }
              }
              
              return (
                <>
                  {mcqDetails && (
                    <div className="bg-[#FAF6F0] rounded-xl p-4 border border-[#EADDCA]/60 mb-5 space-y-2.5 text-left shadow-inner">
                      <p className="text-[9px] tracking-widest uppercase text-[#C5A059] font-black border-b border-[#EADDCA]/30 pb-1.5 mb-2">Category Metrics</p>
                      <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs text-[#3E362E]">
                        {Object.entries(mcqDetails).map(([key, val]) => (
                          <div key={key} className="flex justify-between font-sans">
                            <span className="font-semibold text-stone-500 text-[10px]">{key}:</span>
                            <span className="font-black uppercase text-[10px] text-stone-800">{val}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div className="text-[#C5A059] text-5xl font-serif italic leading-none mb-2">"</div>
                  <p className="font-serif italic text-base leading-[1.7] text-[#3E362E] mb-6">
                    {cleanText || "No written feedback"}
                  </p>
                </>
              );
            })()}

            {selectedReview.barber_id?.name && (
              <div className="bg-[#FDFBF7] rounded-xl p-3 mb-5 border border-[#EADDCA]/50">
                <p className="text-[9px] tracking-[0.2em] uppercase text-[#8D7B68] font-bold mb-0.5">Stylist</p>
                <p className="text-sm font-black text-[#C5A059]">{selectedReview.barber_id.name}</p>
              </div>
            )}

            <button type="button" onClick={() => setSelectedReview(null)}
              className="w-full bg-[#3E362E] text-white py-3.5 rounded-xl font-black uppercase text-[10px] tracking-[0.2em] hover:bg-[#C5A059] transition cursor-pointer">
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

