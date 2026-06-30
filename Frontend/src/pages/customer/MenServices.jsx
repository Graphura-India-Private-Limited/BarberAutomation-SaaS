import { useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import SalonSelectorBar from "../../components/salon/SalonSelectorBar";
import CustomSelect from "../../components/common/CustomSelect";
import { SlidersHorizontal, X } from "lucide-react";

const services = [
  // styling (Haircuts & Styling) - 1 to 10
  { id: 1, name: "Classic Executive Cut", desc: "A timeless, sharp haircut designed for a professional aesthetic.", price: 350, duration: "35 min", category: "styling", rating: 5, reviews: 156, tag: "Bestseller", img: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=600&auto=format&fit=crop&q=80" },
  { id: 2, name: "Modern Fade (Skin/Low/Drop)", desc: "Ultra-precise gradient fade using clippers and detailers.", price: 450, duration: "40 min", category: "styling", rating: 5, reviews: 114, tag: "Popular", img: "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=600&auto=format&fit=crop&q=80" },
  { id: 3, name: "Premium Keratin Infusion", desc: "Hair softening and frizz-reduction treatment for men.", price: 2200, duration: "90 min", category: "styling", rating: 5, reviews: 62, tag: "Premium", img: "https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=600&auto=format&fit=crop&q=80" },
  { id: 4, name: "Indian Wedding Grooming", desc: "Complete luxury hair styling and setting for grooms and wedding guests.", price: 1500, duration: "60 min", category: "styling", rating: 5, reviews: 198, tag: "Luxury", img: "https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=600&auto=format&fit=crop&q=80" },
  { id: 5, name: "Kids' Style Cut", desc: "Fun, quick hair styling and cutting for children under 12.", price: 250, duration: "25 min", category: "styling", rating: 4, reviews: 88, tag: null, img: "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=600&auto=format&fit=crop&q=80" },
  { id: 6, name: "Slick Back Classic Pompadour", desc: "Classic slicked back haircut styled with premium high-shine pomade.", price: 500, duration: "45 min", category: "styling", rating: 5, reviews: 75, tag: "Popular", img: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=600&auto=format&fit=crop&q=80" },
  { id: 7, name: "Buzz Cut & Edge-up", desc: "Clean, ultra-short buzz cut with sharp razor edge detailing.", price: 200, duration: "20 min", category: "styling", rating: 4, reviews: 130, tag: null, img: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=600&auto=format&fit=crop&q=80" },
  { id: 8, name: "Textured Crop Fade", desc: "Modern messy textured top with short high-skin fade sides.", price: 400, duration: "40 min", category: "styling", rating: 5, reviews: 92, tag: "Popular", img: "https://images.unsplash.com/photo-1562322140-8baeececf3df?w=600&auto=format&fit=crop&q=80" },
  { id: 9, name: "Bollywood Premium Styling", desc: "Premium celebrity-inspired haircut and volume blow dry styling.", price: 800, duration: "45 min", category: "styling", rating: 5, reviews: 147, tag: "Premium", img: "https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=600&auto=format&fit=crop&q=80" },
  { id: 10, name: "Scalp Detox & Cut Combo", desc: "Detoxifying scalp wash paired with a precise haircut.", price: 900, duration: "50 min", category: "styling", rating: 5, reviews: 54, tag: null, img: "https://images.unsplash.com/photo-1600948836101-f9ffda59d250?w=600&auto=format&fit=crop&q=80" },

  // beard (Beard Grooming) - 11 to 20
  { id: 11, name: "Beard Sculpting", desc: "Expert trimming, shaping, and line-up with hot towel finish.", price: 250, duration: "30 min", category: "beard", rating: 5, reviews: 202, tag: "Popular", img: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600&auto=format&fit=crop&q=80" },
  { id: 12, name: "Royal Shave Ritual", desc: "Traditional straight-razor shave with premium essential oils.", price: 450, duration: "40 min", category: "beard", rating: 5, reviews: 138, tag: "Premium", img: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=600&auto=format&fit=crop&q=80" },
  { id: 13, name: "Beard Hydration & Wash", desc: "Deep conditioning wash followed by nourishing oil massage.", price: 300, duration: "25 min", category: "beard", rating: 4, reviews: 67, tag: null, img: "https://images.unsplash.com/photo-1620331311520-246422fd82f9?w=600&auto=format&fit=crop&q=80" },
  { id: 14, name: "Mustache Styling & Trim", desc: "Precise mustache trimming and styling with natural styling wax.", price: 150, duration: "15 min", category: "beard", rating: 4, reviews: 42, tag: null, img: "/ashish-sam-N6gZ_28vL3c-unsplash.jpg" },
  { id: 15, name: "Charcoal Beard Softening", desc: "Activated charcoal treatment to soften rough, dry beard hair.", price: 400, duration: "30 min", category: "beard", rating: 5, reviews: 110, tag: "Bestseller", img: "/salah-regouane-Z2WfmQC-sVk-unsplash.jpg" },
  { id: 16, name: "Signature Hot Towel Shave", desc: "Classic wet shave with rich lather and multiple hot towels.", price: 350, duration: "30 min", category: "beard", rating: 5, reviews: 93, tag: "Popular", img: "https://images.unsplash.com/photo-1517832606299-7ae9b720a186?w=600&auto=format&fit=crop&q=80" },
  { id: 17, name: "Beard Color Touch-up", desc: "Quick gray hair coverage for a younger, natural beard look.", price: 500, duration: "35 min", category: "beard", rating: 4, reviews: 81, tag: null, img: "/shan-a-rajpoot-BTC7uMsbjdM-unsplash.jpg" },
  { id: 18, name: "Indian Royal Beard Styling", desc: "Luxury royal grooming fit for premium style occasions.", price: 600, duration: "45 min", category: "beard", rating: 5, reviews: 154, tag: "Luxury", img: "/WhatsApp%20Image%202026-05-25%20at%202.11.24%20PM.jpeg" },
  { id: 19, name: "Detox Clay Beard Mask", desc: "Soothing natural bentonite clay mask for healthy beard roots.", price: 450, duration: "30 min", category: "beard", rating: 5, reviews: 63, tag: null, img: "https://images.unsplash.com/photo-1492106087820-71f1a00d2b11?w=600&auto=format&fit=crop&q=80" },
  { id: 20, name: "Classic Clean Shave", desc: "Traditional smooth clean shave using premium cooling gel.", price: 200, duration: "20 min", category: "beard", rating: 4, reviews: 105, tag: null, img: "https://images.unsplash.com/photo-1605497746444-052d5b597d15?w=600&auto=format&fit=crop&q=80" },

  // spa (Spa & Massage) - 21 to 30
  { id: 21, name: "Gentleman's Facial", desc: "Deep-cleansing treatment to remove impurities and rejuvenate skin.", price: 800, duration: "45 min", category: "spa", rating: 4, reviews: 94, tag: "Bestseller", img: "https://images.unsplash.com/photo-1580618672591-eb180b1a973f?w=600&auto=format&fit=crop&q=80" },
  { id: 22, name: "Scalp Revitalize Massage", desc: "Invigorating scalp massage and oil treatment for hair health.", price: 400, duration: "30 min", category: "spa", rating: 5, reviews: 72, tag: "Luxury", img: "https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=600&auto=format&fit=crop&q=80" },
  { id: 23, name: "Indian Ayurvedic Head Massage", desc: "Classic stress-relieving champi massage with traditional oils.", price: 500, duration: "35 min", category: "spa", rating: 5, reviews: 165, tag: "Popular", img: "https://images.unsplash.com/photo-1560869713-7d0a29430803?w=600&auto=format&fit=crop&q=80" },
  { id: 24, name: "Detoxifying Charcoal Mask", desc: "Activated peel-off mask to cleanse pores and remove blackheads.", price: 600, duration: "30 min", category: "spa", rating: 4, reviews: 122, tag: null, img: "https://images.unsplash.com/photo-1634449571010-02c2930788c5?w=600&auto=format&fit=crop&q=80" },
  { id: 25, name: "Premium Face & Neck Massage", desc: "Relaxing face massage using rich herbal massage creams.", price: 550, duration: "30 min", category: "spa", rating: 4, reviews: 89, tag: null, img: "https://images.unsplash.com/photo-1453396450673-3fe83d2db2c4?w=600&auto=format&fit=crop&q=80" },
  { id: 26, name: "Tan Removal Peel-off Mask", desc: "Advanced de-tan treatment to restore natural skin brightness.", price: 450, duration: "25 min", category: "spa", rating: 5, reviews: 104, tag: "Popular", img: "https://images.unsplash.com/photo-1609542449464-48e229fdbc7a?w=600&auto=format&fit=crop&q=80" },
  { id: 27, name: "Anti-Stress Neck & Shoulder Rub", desc: "Short acupressure massage targeting upper back tension.", price: 400, duration: "20 min", category: "spa", rating: 4, reviews: 131, tag: null, img: "https://images.unsplash.com/photo-1607460541894-4db6b2a90f89?w=600&auto=format&fit=crop&q=80" },
  { id: 28, name: "Hydrating Aloe Vera Facial", desc: "Soothing natural aloe facial treatment for sun-burnt skin.", price: 700, duration: "40 min", category: "spa", rating: 5, reviews: 78, tag: null, img: "https://images.unsplash.com/photo-1579038773867-044c48829161?w=600&auto=format&fit=crop&q=80" },
  { id: 29, name: "Ice Cool Mint Scalp Massage", desc: "Refreshing cooling head massage using organic mint extracts.", price: 450, duration: "25 min", category: "spa", rating: 5, reviews: 92, tag: "Popular", img: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=600&auto=format&fit=crop&q=80" },
  { id: 30, name: "Aromatherapy Facial Spa", desc: "Luxury face massage utilizing premium natural essential oils.", price: 1200, duration: "50 min", category: "spa", rating: 5, reviews: 61, tag: "Premium", img: "https://images.unsplash.com/photo-1519824145371-296894a0daa9?w=600&auto=format&fit=crop&q=80" },

  // color (Hair Colour) - 31 to 40
  { id: 31, name: "Grey Blending", desc: "Subtle colour application to reduce grey hair naturally.", price: 1000, duration: "60 min", category: "color", rating: 4, reviews: 45, tag: null, img: "https://images.unsplash.com/photo-1597764693654-15b3a1e7b6c4?w=600&auto=format&fit=crop&q=80" },
  { id: 32, name: "Global Hair Highlight", desc: "Bold highlights or global coloring for modern styling.", price: 1499, duration: "75 min", category: "color", rating: 4, reviews: 39, tag: "Luxury", img: "https://images.unsplash.com/photo-1454094309557-181967334e22?w=600&auto=format&fit=crop&q=80" },
  { id: 33, name: "Beard Global Coloring", desc: "Even global beard coloring using premium ammonia-free colors.", price: 600, duration: "40 min", category: "color", rating: 4, reviews: 54, tag: null, img: "https://images.unsplash.com/photo-1654805983816-0efe3ee3f8bd?w=600&auto=format&fit=crop&q=80" },
  { id: 34, name: "Root Touch-Up (Men)", desc: "Quick hair root touch up to cover emerging grey hair.", price: 800, duration: "45 min", category: "color", rating: 5, reviews: 87, tag: "Popular", img: "https://images.unsplash.com/photo-1696497327672-2bdce2e033dd?w=600&auto=format&fit=crop&q=80" },
  { id: 35, name: "Fashion Streaks (Per Streak)", desc: "Single highlight foils with bold electric fashion shades.", price: 300, duration: "30 min", category: "color", rating: 4, reviews: 29, tag: null, img: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=600&auto=format&fit=crop&q=80" },
  { id: 36, name: "Ammonia-Free Organic Color", desc: "Global hair coloring using certified organic herbal dyes.", price: 1200, duration: "60 min", category: "color", rating: 5, reviews: 49, tag: "Premium", img: "https://images.unsplash.com/photo-1605497788044-5a32c7078486?w=600&auto=format&fit=crop&q=80" },
  { id: 37, name: "Premium Beard Glossing", desc: "Shine-boosting gloss application to soften and enrich beard tone.", price: 500, duration: "30 min", category: "color", rating: 5, reviews: 33, tag: null, img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&auto=format&fit=crop&q=80" },
  { id: 38, name: "Platinum Blonde Highlights", desc: "High-lift platinum highlighting foils with bond protection.", price: 1999, duration: "90 min", category: "color", rating: 5, reviews: 21, tag: "Luxury", img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&fit=crop&q=80" },
  { id: 39, name: "Natural Henna Treatment", desc: "Soothing organic henna application for natural reddish-brown tones.", price: 500, duration: "60 min", category: "color", rating: 4, reviews: 68, tag: null, img: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=600&auto=format&fit=crop&q=80" },
  { id: 40, name: "Mustache & Beard Color Combo", desc: "Complete beard and mustache color mapping with root grooming.", price: 900, duration: "50 min", category: "color", rating: 5, reviews: 50, tag: "Popular", img: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=600&auto=format&fit=crop&q=80" }
];

const heroImages = [
  "https://i.pinimg.com/1200x/74/7a/aa/747aaa2f4f8b5262a552aa4baed6ff60.jpg",
  "https://i.pinimg.com/1200x/81/e1/c2/81e1c2e2bc7932c9abaa57c4a9e46a41.jpg",
  "https://i.pinimg.com/1200x/16/ad/e0/16ade0c394f6e919f1f6dc05c3206d8d.jpg",
  "https://i.pinimg.com/1200x/ed/ba/9c/edba9c8e676663d02abbac15f2067a53.jpg",
];

const CATEGORIES = [
  { id: "all", label: "All Services", icon: "✦" },
  { id: "styling", label: "Haircuts", icon: "✂" },
  { id: "beard", label: "Beard Grooming", icon: "🧔" },
  { id: "spa", label: "Spa & Massage", icon: "♨" },
  { id: "color", label: "Hair Colour", icon: "◈" },
];

const PRICE_RANGES = [
  { id: "all", label: "Any Price" },
  { id: "under500", label: "Under ₹500" },
  { id: "500-1000", label: "₹500 – ₹1,000" },
  { id: "1000-2000", label: "₹1,000 – ₹2,000" },
  { id: "above2000", label: "Above ₹2,000" },
];

const SORT_OPTIONS = [
  { id: "default", label: "Featured" },
  { id: "price-asc", label: "Price: Low to High" },
  { id: "price-desc", label: "Price: High to Low" },
  { id: "rating", label: "Top Rated" },
];

const TAG_COLORS = {
  Bestseller: { bg: "#FFF3DC", text: "#A0720A", border: "#E8C84B" },
  Popular:    { bg: "#F0F5FF", text: "#3E5FCC", border: "#C3CEF6" },
  Premium:    { bg: "#F5F0FF", text: "#6B3FC0", border: "#D1BAFF" },
  Luxury:     { bg: "#FFF0F5", text: "#C0396B", border: "#F9C3D8" },
};

function StarRating({ rating, count }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
      <div style={{ display: "flex", gap: 1 }}>
        {[1,2,3,4,5].map((s) => (
          <svg key={s} width="12" height="12" viewBox="0 0 12 12" fill="none">
            <polygon points="6,1 7.5,4.5 11,4.5 8.5,7 9.5,11 6,8.5 2.5,11 3.5,7 1,4.5 4.5,4.5"
              fill={s <= rating ? "#C5A059" : "none"} stroke={s <= rating ? "#C5A059" : "#C5A05960"} strokeWidth="0.8" />
          </svg>
        ))}
      </div>
      <span style={{ fontSize: 12, color: "#888", fontFamily: "'Montserrat',sans-serif" }}>({count})</span>
    </div>
  );
}

function Highlight({ text, query }) {
  if (!query.trim()) return <>{text}</>;
  const re = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi");
  const parts = text.split(re);
  return (
    <>
      {parts.map((p, i) =>
        re.test(p)
          ? <mark key={i} style={{ background: "#FFF3DC", color: "#8A6A10", borderRadius: 2, padding: "0 1px" }}>{p}</mark>
          : p
      )}
    </>
  );
}

export default function MenServices() {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState("all");
  const [selectedPrice, setSelectedPrice]   = useState("all");
  const [minRating, setMinRating]           = useState(0);
  const [sortBy, setSortBy]                 = useState("default");
  const [searchQuery, setSearchQuery]       = useState("");
  const [searchFocused, setSearchFocused]   = useState(false);
  const [slideIndex, setSlideIndex]         = useState(0);
  const [visibleCards, setVisibleCards]     = useState(new Set());
  const [showFilters, setShowFilters]       = useState(false);
  const cardRefs = useRef({});

  useEffect(() => {
    const salonId = localStorage.getItem("selectedSalonId");
    if (!salonId) {
      navigate("/nearby");
    }
  }, [navigate]);

  useEffect(() => {
    const iv = setInterval(() => setSlideIndex((p) => (p + 1) % heroImages.length), 5000);
    return () => clearInterval(iv);
  }, []);

  useEffect(() => {
    setVisibleCards(new Set());
    const observers = [];
    const t = setTimeout(() => {
      Object.entries(cardRefs.current).forEach(([id, el]) => {
        if (!el) return;
        const obs = new IntersectionObserver(([entry]) => {
          if (entry.isIntersecting) { setVisibleCards((prev) => new Set([...prev, id])); obs.disconnect(); }
        }, { threshold: 0.08 });
        obs.observe(el);
        observers.push(obs);
      });
    }, 60);
    return () => { clearTimeout(t); observers.forEach((o) => o.disconnect()); };
  }, [activeCategory, selectedPrice, minRating, searchQuery, sortBy]);

  const filtered = services
    .filter((s) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        if (!s.name.toLowerCase().includes(q) && !s.desc.toLowerCase().includes(q)) return false;
      }
      if (activeCategory !== "all" && s.category !== activeCategory) return false;
      if (minRating > 0 && s.rating < minRating) return false;
      if (selectedPrice === "under500")  return s.price < 500;
      if (selectedPrice === "500-1000")  return s.price >= 500 && s.price <= 1000;
      if (selectedPrice === "1000-2000") return s.price > 1000 && s.price <= 2000;
      if (selectedPrice === "above2000") return s.price > 2000;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === "price-asc")  return a.price - b.price;
      if (sortBy === "price-desc") return b.price - a.price;
      if (sortBy === "rating")     return b.rating - a.rating;
      return 0;
    });

  const hasActive = activeCategory !== "all" || selectedPrice !== "all" || minRating > 0 || !!searchQuery.trim();
  const clearAll  = () => { setActiveCategory("all"); setSelectedPrice("all"); setMinRating(0); setSortBy("default"); setSearchQuery(""); };

  return (
    <>
      <Navbar />
      <SalonSelectorBar />
     <div
        className="[scrollbar-width:thin] [scrollbar-color:#C9BFA8_transparent] [&::-webkit-scrollbar]:w-[6px] [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-[#C9BFA8] [&::-webkit-scrollbar-thumb]:rounded-[10px] hover:[&::-webkit-scrollbar-thumb]:bg-[#B0A488]"
        style={{ background: "#FAF6F0", minHeight: "100vh", fontFamily: "'Cormorant Garamond','Georgia',serif", color: "#2C241E" }}
      >

        {/* FLOATING BACK BUTTON — fixed, same as WomenServices */}
        <div className="fixed bottom-5 left-5 md:bottom-auto md:top-[90px] md:left-5 z-[9999]">
          <button
            onClick={() => navigate(localStorage.getItem("token") ? "/dashboard" : "/")}
            style={{ width: 48, height: 48, borderRadius: "50%", border: "none", background: "rgba(255,255,255,0.95)", backdropFilter: "blur(10px)", cursor: "pointer", fontSize: 20, boxShadow: "0 8px 20px rgba(0,0,0,0.15)", transition: "all 0.3s ease" }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "#C5A059"; e.currentTarget.style.color = "#fff"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.95)"; e.currentTarget.style.color = "#000"; }}
          >
            ←
          </button>
        </div>

        {/* HERO */}
        <div style={{ position: "relative", height: 540, overflow: "hidden" }}>
          {/* Slideshow images */}
          {heroImages.map((img, idx) => (
            <div key={idx} style={{ position: "absolute", inset: 0, backgroundImage: `url('${img}')`, backgroundSize: "cover", backgroundPosition: "center", opacity: idx === slideIndex ? 1 : 0, transition: "opacity 1.2s ease", filter: "brightness(0.38)" }} />
          ))}

          {/* Overlay — correctly inside hero */}
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(0,0,0,0.25), rgba(0,0,0,0.75))", zIndex: 2 }} />

          {/* Dot indicators */}
          <div style={{ position: "absolute", bottom: 22, left: "50%", transform: "translateX(-50%)", display: "flex", gap: 8, zIndex: 10 }}>
            {heroImages.map((_, idx) => (
              <button key={idx} onClick={() => setSlideIndex(idx)}
                style={{ width: idx === slideIndex ? 24 : 8, height: 8, borderRadius: 4, padding: 0, border: "none", cursor: "pointer", background: idx === slideIndex ? "#C5A059" : "rgba(255,255,255,0.35)", transition: "all 0.4s ease" }} />
            ))}
          </div>

          {/* Hero content */}
          <div style={{ position: "absolute", inset: 0, zIndex: 5, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "0 24px" }}>

            {/* Decorative badge — same style as WomenServices */}
            <div style={{ display: "inline-flex", alignItems: "center", gap: 10, border: "1px solid rgba(197,160,89,0.5)", borderRadius: 40, padding: "6px 20px", marginBottom: 20, background: "rgba(0,0,0,0.2)" }}>
              <span style={{ width: 18, height: 1, background: "#C5A059", display: "inline-block" }} />
              <span style={{ color: "#C5A059", fontSize: 10, letterSpacing: "0.22em", fontFamily: "'Montserrat',sans-serif", fontWeight: 600, textTransform: "uppercase" }}>Gentleman's Craft</span>
              <span style={{ width: 18, height: 1, background: "#C5A059", display: "inline-block" }} />
            </div>

            <h1 style={{ fontSize: "clamp(38px,5.5vw,68px)", fontWeight: 300, color: "#fff", margin: "0 0 12px", lineHeight: 1.1, letterSpacing: "0.05em" }}>
              MEN'S <em style={{ fontStyle: "italic", color: "#C5A059", fontWeight: 400 }}>Grooming</em>
            </h1>

            {/* Decorative divider line */}
            <div style={{ width: 60, height: 1, background: "linear-gradient(to right,transparent,#C5A059,transparent)", margin: "0 auto 16px" }} />

            <p style={{ color: "rgba(255,255,255,0.65)", fontSize: 14, fontWeight: 300, maxWidth: 440, lineHeight: 1.75, fontFamily: "'Montserrat',sans-serif", marginBottom: 28 }}>
              Premium haircuts, beard artistry, facials, and luxury grooming experiences tailored for the modern gentleman.
            </p>

            {/* Search bar */}
            <div style={{ position: "relative", width: "100%", maxWidth: 520, transition: "transform 0.2s", transform: searchFocused ? "scale(1.025)" : "scale(1)" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                stroke={searchFocused ? "#C5A059" : "rgba(255,255,255,0.6)"} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"
                style={{ position: "absolute", left: 18, top: "50%", transform: "translateY(-50%)", transition: "stroke 0.25s", pointerEvents: "none", zIndex: 2 }}>
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                placeholder="Search — e.g. beard, shave, facial, scalp…"
                style={{ width: "100%", boxSizing: "border-box", padding: "15px 48px 15px 48px", borderRadius: 50, border: searchFocused ? "2px solid #C5A059" : "2px solid rgba(255,255,255,0.28)", background: searchFocused ? "rgba(255,255,255,0.97)" : "rgba(255,255,255,0.13)", backdropFilter: "blur(12px)", color: searchFocused ? "#2C241E" : "#fff", fontSize: 14, fontFamily: "'Montserrat',sans-serif", outline: "none", transition: "all 0.25s ease", letterSpacing: "0.02em" }}
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery("")} style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", background: "rgba(0,0,0,0.2)", border: "none", borderRadius: "50%", width: 22, height: 22, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: 11, color: searchFocused ? "#666" : "#fff", zIndex: 2 }}>✕</button>
              )}
            </div>

            {/* Quick pills */}
            <div style={{ display: "flex", gap: 8, marginTop: 14, flexWrap: "wrap", justifyContent: "center" }}>
              {["Haircut", "Beard", "Shave", "Facial", "Spa"].map((q) => (
                <button key={q} onClick={() => setSearchQuery(q)}
                  style={{ background: searchQuery === q ? "rgba(197,160,89,0.45)" : "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.28)", color: "rgba(255,255,255,0.85)", borderRadius: 20, padding: "4px 14px", fontSize: 11, fontFamily: "'Montserrat',sans-serif", cursor: "pointer", transition: "all 0.2s", backdropFilter: "blur(6px)" }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(197,160,89,0.35)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = searchQuery === q ? "rgba(197,160,89,0.45)" : "rgba(255,255,255,0.12)"; }}>
                  {q}
                </button>
              ))}
            </div>
          </div>
        </div>
        {/* END HERO */}

        {/* RESULTS BAR */}
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "16px 32px 0", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
          <p style={{ fontSize: 13, color: "#888", fontFamily: "'Montserrat',sans-serif", margin: 0 }}>
            {searchQuery.trim() && <><strong style={{ color: "#2C241E" }}>"{searchQuery}"</strong> — </>}
            Showing <strong style={{ color: "#2C241E" }}>{filtered.length}</strong> of {services.length} services
            {hasActive && <button onClick={clearAll} style={{ marginLeft: 10, fontSize: 11, color: "#C5A059", background: "none", border: "none", cursor: "pointer", fontFamily: "'Montserrat',sans-serif", textDecoration: "underline", padding: 0 }}>Clear all</button>}
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button
              onClick={() => setShowFilters(true)}
              className="lg:hidden flex items-center justify-center gap-1.5 px-3 py-1.5 border border-[#DDD4C4] rounded-lg bg-white text-[11px] font-bold text-[#2C241E] cursor-pointer hover:bg-stone-50 transition-colors h-9"
              style={{ fontFamily: "'Montserrat',sans-serif" }}
            >
              <SlidersHorizontal size={12} className="text-[#C5A059]" />
              <span>Filters</span>
            </button>

            <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 155 }}>
              <span style={{ fontSize: 11, color: "#AAA", fontFamily: "'Montserrat',sans-serif", textTransform: "uppercase", letterSpacing: "0.08em" }}>Sort:</span>
              <CustomSelect
                value={sortBy}
                onChange={setSortBy}
                options={SORT_OPTIONS}
                className="!h-9 !rounded-lg !border-[#DDD4C4] font-sans !text-[13px] !py-1"
              />
            </div>
          </div>
        </div>

        {/* MAIN */}
        <div className="max-w-[1280px] mx-auto px-4 md:px-8 py-6 md:py-10 flex flex-col lg:flex-row gap-6 lg:gap-9 items-start">

          {/* Mobile Backdrop */}
          {showFilters && (
            <div 
              className="fixed inset-0 bg-stone-900/60 z-[10000] lg:hidden animate-in fade-in duration-200" 
              onClick={() => setShowFilters(false)}
            />
          )}

          {/* SIDEBAR */}
          <aside className={`
            shrink-0 lg:w-[248px] lg:sticky lg:top-[90px] lg:mb-0 lg:block lg:max-h-[calc(100vh-110px)] lg:overflow-y-auto thin-scrollbar
            ${showFilters 
              ? "fixed top-0 left-0 bottom-0 z-[10001] w-[280px] bg-white h-screen overflow-y-auto p-4 shadow-2xl animate-in slide-in-from-left duration-200" 
              : "hidden lg:block"
            }
          `}>
            {showFilters && (
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-stone-100 lg:hidden">
                <span className="text-xs font-bold text-[#2C241E] uppercase tracking-wider">Filters</span>
                <button onClick={() => setShowFilters(false)} className="text-stone-500 hover:text-stone-900">
                  <X size={18} />
                </button>
              </div>
            )}

            <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #EAE0D0", overflow: "hidden" }}>
              <div style={{ padding: "16px 20px 13px", borderBottom: "1px solid #EAE0D0", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", fontFamily: "'Montserrat',sans-serif", color: "#2C241E" }}>⚙ Filters</span>
                {hasActive && <button onClick={clearAll} style={{ fontSize: 10, color: "#C5A059", background: "#FFF8EC", border: "1px solid #E8C84B50", borderRadius: 20, padding: "3px 10px", cursor: "pointer", fontFamily: "'Montserrat',sans-serif" }}>Clear all</button>}
              </div>

              {/* Category */}
              <div style={{ padding: "14px 20px", borderBottom: "1px solid #F0E8DA" }}>
                <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: "#B0A090", fontFamily: "'Montserrat',sans-serif", margin: "0 0 9px" }}>Category</p>
                {CATEGORIES.map((cat) => (
                  <button key={cat.id} onClick={() => setActiveCategory(cat.id)}
                    style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", padding: "7px 10px", marginBottom: 2, borderRadius: 8, border: "none", cursor: "pointer", textAlign: "left", background: activeCategory === cat.id ? "linear-gradient(135deg,#FFF3DC,#FAEAC5)" : "transparent", transition: "background 0.2s" }}
                    onMouseEnter={(e) => { if (activeCategory !== cat.id) e.currentTarget.style.background = "#FAF6F0"; }}
                    onMouseLeave={(e) => { if (activeCategory !== cat.id) e.currentTarget.style.background = "transparent"; }}>
                    <span style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, fontFamily: "'Montserrat',sans-serif", color: activeCategory === cat.id ? "#8A6A10" : "#555", fontWeight: activeCategory === cat.id ? 600 : 400 }}>
                      <span style={{ fontSize: 10, opacity: 0.65 }}>{cat.icon}</span>{cat.label}
                    </span>
                    {activeCategory === cat.id && <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#C5A059", flexShrink: 0 }} />}
                  </button>
                ))}
              </div>

              {/* Price */}
              <div style={{ padding: "14px 20px", borderBottom: "1px solid #F0E8DA" }}>
                <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: "#B0A090", fontFamily: "'Montserrat',sans-serif", margin: "0 0 9px" }}>Price Range</p>
                {PRICE_RANGES.map((r) => (
                  <div key={r.id} onClick={() => setSelectedPrice(r.id)} style={{ display: "flex", alignItems: "center", gap: 9, padding: "6px 0", cursor: "pointer" }}>
                    <span style={{ width: 16, height: 16, borderRadius: "50%", border: `2px solid ${selectedPrice === r.id ? "#C5A059" : "#CCC"}`, background: selectedPrice === r.id ? "#C5A059" : "transparent", flexShrink: 0, transition: "all 0.2s", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      {selectedPrice === r.id && <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#fff" }} />}
                    </span>
                    <span style={{ fontSize: 13, fontFamily: "'Montserrat',sans-serif", color: selectedPrice === r.id ? "#2C241E" : "#666", fontWeight: selectedPrice === r.id ? 600 : 400 }}>{r.label}</span>
                  </div>
                ))}
              </div>

              {/* Rating */}
              <div style={{ padding: "14px 20px" }}>
                <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: "#B0A090", fontFamily: "'Montserrat',sans-serif", margin: "0 0 9px" }}>Minimum Rating</p>
                {[5,4,3,0].map((r) => (
                  <button key={r} onClick={() => setMinRating(r)}
                    style={{ display: "flex", alignItems: "center", gap: 7, width: "100%", padding: "7px 10px", marginBottom: 2, borderRadius: 8, border: "none", background: minRating === r ? "linear-gradient(135deg,#FFF3DC,#FAEAC5)" : "transparent", cursor: "pointer", textAlign: "left", transition: "background 0.2s" }}
                    onMouseEnter={(e) => { if (minRating !== r) e.currentTarget.style.background = "#FAF6F0"; }}
                    onMouseLeave={(e) => { if (minRating !== r) e.currentTarget.style.background = "transparent"; }}>
                    {r === 0
                      ? <span style={{ fontSize: 12, fontFamily: "'Montserrat',sans-serif", color: "#666" }}>Any rating</span>
                      : <>{[1,2,3,4,5].map((s) => (
                          <svg key={s} width="12" height="12" viewBox="0 0 12 12" fill="none">
                            <polygon points="6,1 7.5,4.5 11,4.5 8.5,7 9.5,11 6,8.5 2.5,11 3.5,7 1,4.5 4.5,4.5" fill={s <= r ? "#C5A059" : "none"} stroke={s <= r ? "#C5A059" : "#CCC"} strokeWidth="0.8" />
                          </svg>
                        ))}
                        <span style={{ fontSize: 11, color: "#888", fontFamily: "'Montserrat',sans-serif" }}>& up</span>
                      </>
                    }
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* CARDS */}
          <div className="flex-1 w-full min-w-0">
            {filtered.length === 0 ? (
              <div style={{ textAlign: "center", padding: "80px 20px", background: "#fff", borderRadius: 16, border: "1px dashed #DDD4C4" }}>
                <div style={{ fontSize: 36, marginBottom: 14 }}>✦</div>
                <p style={{ fontSize: 20, fontFamily: "'Cormorant Garamond',serif", color: "#8A7060", margin: "0 0 8px" }}>No services found</p>
                <p style={{ fontSize: 13, fontFamily: "'Montserrat',sans-serif", color: "#AAA", margin: "0 0 24px" }}>
                  {searchQuery.trim() ? `No results for "${searchQuery}". Try a different keyword.` : "Try adjusting your filter selections."}
                </p>
                <button onClick={clearAll} style={{ padding: "10px 28px", background: "#2C241E", color: "#fff", border: "none", borderRadius: 8, fontSize: 12, fontFamily: "'Montserrat',sans-serif", letterSpacing: "0.1em", textTransform: "uppercase", cursor: "pointer" }}>
                  Clear all filters
                </button>
              </div>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))", gap: 24 }}>
                {filtered.map((s, i) => {
                  const tagStyle = s.tag ? TAG_COLORS[s.tag] : null;
                  const visible  = visibleCards.has(String(s.id));
                  return (
                    <div key={s.id} ref={(el) => (cardRefs.current[s.id] = el)}
                      style={{ background: "#fff", borderRadius: 16, overflow: "hidden", border: "1px solid #EAE0D0", opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(22px)", transition: `opacity 0.42s ease ${i * 65}ms, transform 0.42s ease ${i * 65}ms, box-shadow 0.28s ease` }}
                      onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-6px)"; e.currentTarget.style.boxShadow = "0 16px 40px rgba(44,36,30,0.11)"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}>
                      <div style={{ position: "relative", height: 210, overflow: "hidden" }}>
                        <img src={s.img} alt={s.name} style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.5s ease" }}
                          onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.07)")}
                          onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")} />
                        {tagStyle && (
                          <span style={{ position: "absolute", top: 12, left: 12, background: tagStyle.bg, color: tagStyle.text, border: `1px solid ${tagStyle.border}`, borderRadius: 20, padding: "3px 10px", fontSize: 10, fontFamily: "'Montserrat',sans-serif", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" }}>{s.tag}</span>
                        )}
                        <span style={{ position: "absolute", bottom: 10, right: 10, background: "rgba(0,0,0,0.52)", backdropFilter: "blur(6px)", color: "#fff", borderRadius: 20, padding: "3px 10px", fontSize: 11, fontFamily: "'Montserrat',sans-serif" }}>⏱ {s.duration}</span>
                      </div>
                      <div style={{ padding: "16px 18px 18px" }}>
                        <h3 style={{ fontSize: 20, fontWeight: 400, margin: "0 0 4px", lineHeight: 1.25, fontFamily: "'Cormorant Garamond',serif", color: "#2C241E" }}>
                          <Highlight text={s.name} query={searchQuery} />
                        </h3>
                        <p style={{ fontSize: 12, fontFamily: "'Montserrat',sans-serif", color: "#999", margin: "0 0 10px", lineHeight: 1.6 }}>
                          <Highlight text={s.desc} query={searchQuery} />
                        </p>
                        <StarRating rating={s.rating} count={s.reviews} />
                        <div style={{ marginTop: 14, display: "flex", alignItems: "center", justifyContent: "space-between", borderTop: "1px solid #F0E8DA", paddingTop: 12 }}>
                          <span style={{ fontSize: 22, fontWeight: 700, fontFamily: "'Cormorant Garamond',serif", color: "#2C241E" }}>₹{s.price.toLocaleString()}</span>
<button 
  onClick={() => navigate("/customer/barber", { 
    state: { 
      service: s,            
      gender: 'men', 
      barber: null           
    } 
  })}
  style={{ 
    background: "#2C241E", 
    color: "#F5EFE0", 
    border: "none", 
    borderRadius: 8, 
    padding: "9px 16px", 
    fontSize: 11, 
    fontFamily: "'Montserrat',sans-serif", 
    fontWeight: 600, 
    letterSpacing: "0.1em", 
    textTransform: "uppercase", 
    cursor: "pointer", 
    transition: "background 0.2s,color 0.2s" 
  }}
  onMouseEnter={(e) => { e.currentTarget.style.background = "#C5A059"; e.currentTarget.style.color = "#fff"; }}
  onMouseLeave={(e) => { e.currentTarget.style.background = "#2C241E"; e.currentTarget.style.color = "#F5EFE0"; }}
>
  Book Now →
</button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* FLOATING FILTERS BUTTON FOR MOBILE/TABLET */}
          <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-40 lg:hidden">
            <button
              onClick={() => setShowFilters(true)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                background: "#2C241E",
                color: "#F5EFE0",
                border: "1px solid #C5A059",
                borderRadius: 30,
                padding: "10px 20px",
                fontFamily: "'Montserrat',sans-serif",
                fontWeight: 700,
                fontSize: 11,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                cursor: "pointer",
                boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
                transition: "all 0.3s"
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "#C5A059"; e.currentTarget.style.color = "#fff"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "#2C241E"; e.currentTarget.style.color = "#F5EFE0"; }}
            >
              <SlidersHorizontal size={14} className="text-[#C5A059]" />
              <span>Filters</span>
            </button>
          </div>

        </div>
      </div>
      <Footer />
    </>
  );
}