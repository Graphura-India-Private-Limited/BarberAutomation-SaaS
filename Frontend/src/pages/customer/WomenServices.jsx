import { useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import SalonSelectorBar from "../../components/salon/SalonSelectorBar";
import CustomSelect from "../../components/common/CustomSelect";
import { SlidersHorizontal, X } from "lucide-react";

const services = [
  // styling (Cuts & Styling) - 1 to 10
  { id: 1, name: "Precision Cut & Blow Dry", desc: "Tailored haircut styled with professional volume.", price: 750, duration: "60 min", category: "styling", rating: 5, reviews: 128, tag: "Bestseller", img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&auto=format&fit=crop&q=80" },
  { id: 2, name: "Bridal Style & Updo", desc: "Couture bridal hair design for weddings and special occasions.", price: 2999, duration: "90 min", category: "styling", rating: 5, reviews: 142, tag: "Luxury", img: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=600&auto=format&fit=crop&q=80" },
  { id: 3, name: "Couture Hair Styling (Curling/Straightening)", desc: "Professional heat styling for a sleek or wavy look.", price: 1200, duration: "45 min", category: "styling", rating: 4, reviews: 93, tag: null, img: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=600&auto=format&fit=crop&q=80" },
  { id: 4, name: "Layered Cut & Blowout", desc: "Classic layered haircut finished with a premium blowout.", price: 999, duration: "60 min", category: "styling", rating: 5, reviews: 76, tag: "Popular", img: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=600&auto=format&fit=crop&q=80" },
  { id: 5, name: "Creative Hair Makeover", desc: "Complete style redesign with customized color consult.", price: 1500, duration: "75 min", category: "styling", rating: 4, reviews: 54, tag: null, img: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=600&auto=format&fit=crop&q=80" },
  { id: 6, name: "Express Hair Wash & Blow Dry", desc: "Quick wash and dry for style on the go.", price: 499, duration: "30 min", category: "styling", rating: 4, reviews: 110, tag: null, img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80" },
  { id: 7, name: "Kids Girls Styling & Cut", desc: "Gentle styling and haircutting for young girls.", price: 400, duration: "35 min", category: "styling", rating: 5, reviews: 49, tag: null, img: "https://images.unsplash.com/photo-1643402305704-474b129161a5?w=600&auto=format&fit=crop&q=80" },
  { id: 8, name: "Bollywood Signature Blowout", desc: "High-volume celebrity blowout with long-lasting hold.", price: 1100, duration: "50 min", category: "styling", rating: 5, reviews: 88, tag: "Popular", img: "https://images.unsplash.com/photo-1519823551278-64ac92734fb1?w=600&auto=format&fit=crop&q=80" },
  { id: 9, name: "Anti-Frizz Hair Styling", desc: "Smooth heat styling using humidity protection serums.", price: 800, duration: "40 min", category: "styling", rating: 5, reviews: 67, tag: null, img: "https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=600&auto=format&fit=crop&q=80" },
  { id: 10, name: "Premium Hot Iron Styling", desc: "Long-lasting flat iron straightening or wand curls.", price: 1300, duration: "50 min", category: "styling", rating: 5, reviews: 31, tag: "Premium", img: "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=600&auto=format&fit=crop&q=80" },

  // color (Colour & Highlights) - 11 to 20
  { id: 11, name: "Global Hair Coloring", desc: "Rich global color transformation using ammonia-free pigments.", price: 2199, duration: "100 min", category: "color", rating: 4, reviews: 63, tag: null, img: "https://images.unsplash.com/photo-1628157582853-a796fa650a6a?w=600&auto=format&fit=crop&q=80" },
  { id: 12, name: "Signature Balayage", desc: "Hand-painted highlights for natural, sun-kissed dimensional depth.", price: 3999, duration: "150 min", category: "color", rating: 5, reviews: 99, tag: "Premium", img: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600&auto=format&fit=crop&q=80" },
  { id: 13, name: "Ammonia-Free Root Touchup", desc: "Grey coverage root touchup with gentle organic formulas.", price: 999, duration: "45 min", category: "color", rating: 4, reviews: 81, tag: null, img: "https://i.pinimg.com/1200x/8d/21/29/8d2129c8a618f113eb8aa2bc596b1658.jpg?w=600&auto=format&fit=crop&q=80" },
  { id: 14, name: "Ombre Hair Transformation", desc: "Gradient color transition from dark roots to light ends.", price: 4499, duration: "160 min", category: "color", rating: 5, reviews: 52, tag: "Luxury", img: "https://i.pinimg.com/736x/7e/7d/b6/7e7db69384f023cf935f954d09e5f5c3.jpg?w=600&auto=format&fit=crop&q=80" },
  { id: 15, name: "Fashion Color Streaks (3 Foils)", desc: "Vibrant custom fashion shades applied to accent sections.", price: 899, duration: "50 min", category: "color", rating: 4, reviews: 36, tag: null, img: "https://i.pinimg.com/1200x/7f/c5/a2/7fc5a2bfa31be902b66a6049d8f4b890.jpg?w=600&auto=format&fit=crop&q=80" },
  { id: 16, name: "Blonde Highlights Accent", desc: "Face-framing highlighting foils for a bright, sun-kissed look.", price: 2499, duration: "90 min", category: "color", rating: 5, reviews: 71, tag: "Popular", img: "https://i.pinimg.com/736x/f5/74/dc/f574dc0a7ae5e8937e0d923b95fdbfa4.jpg?w=600&auto=format&fit=crop&q=80" },
  { id: 17, name: "Indian Henna Pack Application", desc: "Traditional cooling scalp henna pack for color and shine.", price: 799, duration: "70 min", category: "color", rating: 5, reviews: 104, tag: null, img: "https://i.pinimg.com/736x/c4/af/f7/c4aff7cfc65e4a207eb6d58bbfdb37a2.jpg?w=600&auto=format&fit=crop&q=80" },
  { id: 18, name: "Shine Toner & Color Glaze", desc: "Express glaze treatment to refresh faded global hair color.", price: 1499, duration: "60 min", category: "color", rating: 4, reviews: 45, tag: null, img: "https://i.pinimg.com/736x/24/0f/56/240f567877004691c5f56df55ab368d2.jpg?w=600&auto=format&fit=crop&q=80" },
  { id: 19, name: "Full Global Highlights", desc: "Complete head-turned highlights with customized tone mapping.", price: 4999, duration: "180 min", category: "color", rating: 5, reviews: 68, tag: "Luxury", img: "https://i.pinimg.com/1200x/69/03/4b/69034b21f1c6a462bc242526af9455bd.jpg?w=600&auto=format&fit=crop&q=80" },
  { id: 20, name: "Crown Area Highlights Touch-up", desc: "Crown section highlights touch up to refresh existing color.", price: 1999, duration: "90 min", category: "color", rating: 4, reviews: 39, tag: "Popular", img: "https://i.pinimg.com/736x/44/75/cf/4475cf227f367f74d7dfe6d7e3a64086.jpg?w=600&auto=format&fit=crop&q=80" },

  // spa (Spa & Wellness) - 21 to 30
  { id: 21, name: "Organic Oil Head Massage", desc: "Luxurious oil treatment for hair nourishment and scalp relaxation.", price: 450, duration: "30 min", category: "spa", rating: 4, reviews: 87, tag: null, img: "https://i.pinimg.com/736x/1d/4b/93/1d4b938c2be5d8cac2c40116795291e5.jpg?w=600&auto=format&fit=crop&q=80" },
  { id: 22, name: "Hydrating Hair Spa", desc: "Rejuvenating cream-bath spa treatment for dry, damaged hair.", price: 999, duration: "50 min", category: "spa", rating: 5, reviews: 214, tag: "Popular", img: "https://i.pinimg.com/736x/68/42/21/6842217cdd12a7e73b0c6fd4d347240f.jpg?w=600&auto=format&fit=crop&q=80" },
  { id: 23, name: "Therapeutic Scalp Cleansing", desc: "Exfoliating treatment for healthy roots and hair growth.", price: 1200, duration: "45 min", category: "spa", rating: 5, reviews: 81, tag: "Popular", img: "https://i.pinimg.com/736x/1f/46/b1/1f46b1993f85aed2698535c310a6baac.jpg?w=600&auto=format&fit=crop&q=80" },
  { id: 24, name: "Relaxing Neck & Back Therapy", desc: "Pressure point back massage with cooling herbal massage balms.", price: 800, duration: "35 min", category: "spa", rating: 5, reviews: 92, tag: null, img: "https://i.pinimg.com/1200x/c9/19/5b/c9195b3d76fedee86ae1031791d732cb.jpg?w=600&auto=format&fit=crop&q=80" },
  { id: 25, name: "Anti-Dandruff Scalp Treatment", desc: "Targeted tea-tree scalp peeling treatment for dandruff removal.", price: 1100, duration: "50 min", category: "spa", rating: 4, reviews: 104, tag: null, img: "https://res.klook.com/image/upload/w_750,h_469,c_fill,q_85/w_80,x_15,y_15,g_south_west,l_Klook_water_br_trans_yhcmh3/activities/fchn5h7dfr2mmbbw3nq4.jpg?w=600&auto=format&fit=crop&q=80" },
  { id: 26, name: "Intense Nourishing Cream Spa", desc: "Deep hydration hair spa mask with warm steam conditioning.", price: 1299, duration: "60 min", category: "spa", rating: 5, reviews: 118, tag: "Bestseller", img: "https://i.pinimg.com/736x/b2/f0/73/b2f073d74bf0ee78c31cb870f7bb0d2a.jpg?w=600&auto=format&fit=crop&q=80" },
  { id: 27, name: "Ayurvedic Hair Vitality Ritual", desc: "Bhringraj and amla oil head massage for structural hair strength.", price: 1399, duration: "70 min", category: "spa", rating: 5, reviews: 63, tag: "Premium", img: "https://i.pinimg.com/736x/d5/42/e3/d542e36a5630e84bcc7f0214474247e3.jpg?w=600&auto=format&fit=crop&q=80" },
  { id: 28, name: "Detoxifying Charcoal Spa", desc: "Absorbent charcoal scalp spa to clear product build-up.", price: 1199, duration: "50 min", category: "spa", rating: 4, reviews: 52, tag: null, img: "https://i.pinimg.com/736x/32/38/c2/3238c237da8df8e986de51ee9ee02f9b.jpg?w=600&auto=format&fit=crop&q=80" },
  { id: 29, name: "Deep Moisture Oil Therapy", desc: "Hot coconut and almond oil scalp massage treatment.", price: 600, duration: "40 min", category: "spa", rating: 5, reviews: 154, tag: "Popular", img: "https://i.pinimg.com/736x/28/74/2e/28742e65243fd1b4edb58f71f49a7816.jpg?w=600&auto=format&fit=crop&q=80" },
  { id: 30, name: "Aromatic Scalp Soothing Treatment", desc: "Lavender oil infused scalp massage to relieve deep stress.", price: 950, duration: "45 min", category: "spa", rating: 5, reviews: 83, tag: "Luxury", img: "/sandra-gabriel-4PQ0aGtzGGI-unsplash.jpg" },

  // treatment (Treatments) - 31 to 40
  { id: 31, name: "Cysteine Smoothing Treatment", desc: "Premium safe protein smoothing treatment for frizz-free hair.", price: 4999, duration: "180 min", category: "treatment", rating: 5, reviews: 176, tag: "Luxury", img: "https://i.pinimg.com/736x/ae/65/e3/ae65e3f17deb79872414b037fd997045.jpg?w=600&auto=format&fit=crop&q=80" },
  { id: 32, name: "Advanced Keratin Therapy", desc: "Deep repair treatment to restore shine and strength.", price: 3499, duration: "120 min", category: "treatment", rating: 5, reviews: 104, tag: "Premium", img: "https://i.pinimg.com/736x/b6/ff/a4/b6ffa4916c9b5f375ba8b01987a07fcc.jpg?w=600&auto=format&fit=crop&q=80" },
  { id: 33, name: "Olaplex Damage Repair", desc: "Deep bond-building treatment to restore chemical-damaged hair.", price: 1800, duration: "60 min", category: "treatment", rating: 4, reviews: 55, tag: null, img: "https://i.pinimg.com/736x/43/40/f4/4340f4e24eb2ccfde6d8f566459c34d2.jpg?w=600&auto=format&fit=crop&q=80" },
  { id: 34, name: "Pro-Keratin Shine Therapy", desc: "Pro-keratin styling treatment to restore smooth mirror shine.", price: 2999, duration: "110 min", category: "treatment", rating: 5, reviews: 92, tag: "Popular", img: "https://i.pinimg.com/736x/77/8b/72/778b7245d8b88d8b9bb8e5621379d2b2.jpg?w=600&auto=format&fit=crop&q=80" },
  { id: 35, name: "Anti-Hairfall Laser Therapy", desc: "Advanced low-level laser therapy mapping to stimulate roots.", price: 5999, duration: "90 min", category: "treatment", rating: 4, reviews: 41, tag: "Premium", img: "https://i.pinimg.com/736x/89/3e/2a/893e2a77f98ee1d8a1dbcb9c25da7eb6.jpg?w=600&auto=format&fit=crop&q=80" },
  { id: 36, name: "Biotin Nourishing Infusion", desc: "Intense vitamin B7 biotin injection treatment for hair thickness.", price: 3200, duration: "80 min", category: "treatment", rating: 5, reviews: 59, tag: null, img: "https://i.pinimg.com/736x/cb/a1/38/cba138e12154db034df4e287bfef83c3.jpg?w=600&auto=format&fit=crop&q=80" },
  { id: 37, name: "Volume-Boost Root Treatment", desc: "Targeted root volumizing styling mask for fine hair texture.", price: 1500, duration: "45 min", category: "treatment", rating: 4, reviews: 83, tag: null, img: "https://i.pinimg.com/736x/81/4f/7b/814f7b2bd34a5d89bbd8f28df13b2ce2.jpg?w=600&auto=format&fit=crop&q=80" },
  { id: 38, name: "Organic Frizz-Free Smoothing", desc: "Organic botanical smoothing mask with plant-based proteins.", price: 4500, duration: "150 min", category: "treatment", rating: 5, reviews: 67, tag: "Luxury", img: "https://i.pinimg.com/736x/d6/33/c4/d633c41ea4ee63b40d6c97a8e2cb2c9a.jpg?w=600&auto=format&fit=crop&q=80" },
  { id: 39, name: "Silk Protein Glazing", desc: "Glossy silk protein glazing treatment to seal cuticle shafts.", price: 2200, duration: "70 min", category: "treatment", rating: 5, reviews: 49, tag: null, img: "https://i.pinimg.com/736x/5f/aa/df/5faadfc9cc51608034db3fe91a5db4b4.jpg?w=600&auto=format&fit=crop&q=80" },
  { id: 40, name: "Scalp Hydradermie Treatment", desc: "Hydradermie dry scalp healing mask to prevent irritation.", price: 2500, duration: "60 min", category: "treatment", rating: 5, reviews: 31, tag: "Popular", img: "https://i.pinimg.com/1200x/33/92/d6/3392d6b561434dde4bd4f71ba0335449.jpg?w=600&auto=format&fit=crop&q=80" }
];

const heroImages = [
  "https://i.pinimg.com/1200x/b7/15/d8/b715d80600ec4d67ea49667eef835cb0.jpg",
  "https://i.pinimg.com/1200x/b1/40/6a/b1406aa54962b2511a14f187c1f06b40.jpg",
  "https://i.pinimg.com/736x/39/40/96/394096edc9fa7ac61b2f8e743d59f2cd.jpg",
  "https://i.pinimg.com/736x/57/4e/b5/574eb58b99bb66d458a1c9d2ef76447f.jpg",
];

const CATEGORIES = [
  { id: "all", label: "All Services", icon: "✦" },
  { id: "styling", label: "Cuts & Styling", icon: "✂" },
  { id: "color", label: "Colour & Highlights", icon: "◈" },
  { id: "spa", label: "Spa & Wellness", icon: "❋" },
  { id: "treatment", label: "Treatments", icon: "◉" },
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

export default function WomenServices() {
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
    const timers = [];
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
    timers.push(t);
    return () => { timers.forEach(clearTimeout); observers.forEach((o) => o.disconnect()); };
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

        {/* HERO */}
        <div style={{ position: "relative", height: 540, overflow: "hidden" }}>
          {heroImages.map((img, idx) => (
            <div key={idx} style={{ position: "absolute", inset: 0, backgroundImage: `url('${img}')`, backgroundSize: "cover", backgroundPosition: "center", opacity: idx === slideIndex ? 1 : 0, transition: "opacity 1.2s ease", filter: "brightness(0.38)" }} />
          ))}

          <div className="fixed bottom-5 left-5 md:bottom-auto md:top-[90px] md:left-5 z-[9999]">
            <button
              onClick={() => navigate(localStorage.getItem("token") ? "/dashboard" : "/")}
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "50%",
                border: "none",
                background: "rgba(255,255,255,0.95)",
                backdropFilter: "blur(10px)",
                cursor: "pointer",
                fontSize: "20px",
                boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#C5A059";
                e.currentTarget.style.color = "#fff";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.95)";
                e.currentTarget.style.color = "#000";
              }}
            >
              ←
            </button>
          </div>

          {/* dots */}
          <div style={{ position: "absolute", bottom: 22, left: "50%", transform: "translateX(-50%)", display: "flex", gap: 8, zIndex: 10 }}>
            {heroImages.map((_, idx) => (
              <button key={idx} onClick={() => setSlideIndex(idx)} style={{ width: idx === slideIndex ? 24 : 8, height: 8, borderRadius: 4, padding: 0, border: "none", cursor: "pointer", background: idx === slideIndex ? "#C5A059" : "rgba(255,255,255,0.35)", transition: "all 0.4s ease" }} />
            ))}
          </div>

          {/* hero content */}
          <div style={{ position: "absolute", inset: 0, zIndex: 5, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "0 24px" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 10, border: "1px solid rgba(197,160,89,0.5)", borderRadius: 40, padding: "6px 20px", marginBottom: 20, background: "rgba(0,0,0,0.2)" }}>
              <span style={{ width: 18, height: 1, background: "#C5A059", display: "inline-block" }} />
              <span style={{ color: "#C5A059", fontSize: 10, letterSpacing: "0.22em", fontFamily: "'Montserrat',sans-serif", fontWeight: 600, textTransform: "uppercase" }}>Aesthetic Artistry</span>
              <span style={{ width: 18, height: 1, background: "#C5A059", display: "inline-block" }} />
            </div>

            <h1 style={{ fontSize: "clamp(38px,5.5vw,68px)", fontWeight: 300, color: "#fff", margin: "0 0 12px", lineHeight: 1.1, letterSpacing: "0.05em" }}>
              WOMEN'S <em style={{ fontStyle: "italic", color: "#C5A059", fontWeight: 400 }}>Services</em>
            </h1>

            <div style={{ width: 60, height: 1, background: "linear-gradient(to right,transparent,#C5A059,transparent)", margin: "0 auto 16px" }} />

            <p style={{ color: "rgba(255,255,255,0.65)", fontSize: 14, fontWeight: 300, maxWidth: 440, lineHeight: 1.75, fontFamily: "'Montserrat',sans-serif", marginBottom: 28 }}>
              Bespoke styling, rich couture colouring, and rejuvenating hair rituals crafted to illuminate your natural elegance.
            </p>

            {/* ── SEARCH BAR ── */}
            <div style={{ position: "relative", width: "100%", maxWidth: 520, transition: "transform 0.2s", transform: searchFocused ? "scale(1.025)" : "scale(1)" }}>
              {/* search icon */}
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
                placeholder="Search — e.g. colour, spa, bridal, keratin…"
                style={{
                  width: "100%", boxSizing: "border-box",
                  padding: "15px 48px 15px 48px",
                  borderRadius: 50,
                  border: searchFocused ? "2px solid #C5A059" : "2px solid rgba(255,255,255,0.28)",
                  background: searchFocused ? "rgba(255,255,255,0.97)" : "rgba(255,255,255,0.13)",
                  backdropFilter: "blur(12px)",
                  color: searchFocused ? "#2C241E" : "#fff",
                  fontSize: 14, fontFamily: "'Montserrat',sans-serif",
                  outline: "none", transition: "all 0.25s ease",
                  letterSpacing: "0.02em",
                }}
              />

              {searchQuery && (
                <button onClick={() => setSearchQuery("")} style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", background: "rgba(0,0,0,0.2)", border: "none", borderRadius: "50%", width: 22, height: 22, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: 11, color: searchFocused ? "#666" : "#fff", zIndex: 2 }}>✕</button>
              )}
            </div>

            {/* quick pills */}
            <div style={{ display: "flex", gap: 8, marginTop: 14, flexWrap: "wrap", justifyContent: "center" }}>
              {["Spa", "Bridal", "Colour", "Keratin"].map((q) => (
                <button key={q} onClick={() => setSearchQuery(q)}
                  style={{ background: searchQuery === q ? "rgba(197,160,89,0.45)" : "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.28)", color: "rgba(255,255,255,0.85)", borderRadius: 20, padding: "4px 14px", fontSize: 11, fontFamily: "'Montserrat',sans-serif", cursor: "pointer", transition: "all 0.2s", backdropFilter: "blur(6px)" }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(197,160,89,0.35)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = searchQuery === q ? "rgba(197,160,89,0.45)" : "rgba(255,255,255,0.12)"; }}
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        </div>

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
              className="md:hidden flex items-center justify-center gap-1.5 px-3 py-1.5 border border-[#DDD4C4] rounded-lg bg-white text-[11px] font-bold text-[#2C241E] cursor-pointer hover:bg-stone-50 transition-colors h-9"
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
        <div className="max-w-[1280px] mx-auto px-4 md:px-8 py-6 md:py-10 flex flex-col md:flex-row gap-6 md:gap-9 items-start">

          {/* Mobile Backdrop */}
          {showFilters && (
            <div 
              className="fixed inset-0 bg-stone-900/60 z-50 md:hidden animate-in fade-in duration-200" 
              onClick={() => setShowFilters(false)}
            />
          )}

          {/* SIDEBAR */}
          <aside className={`
            shrink-0 md:w-[248px] md:sticky md:top-[100px] md:mb-0 md:block md:max-h-[calc(100vh-120px)] md:overflow-y-auto thin-scrollbar
            ${showFilters 
              ? "fixed top-0 left-0 bottom-0 z-50 w-[280px] bg-white h-screen overflow-y-auto p-4 shadow-2xl animate-in slide-in-from-left duration-200" 
              : "hidden md:block"
            }
          `}>
            {showFilters && (
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-stone-100 md:hidden">
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
                    onMouseLeave={(e) => { if (activeCategory !== cat.id) e.currentTarget.style.background = "transparent"; }}
                  >
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
                    onMouseLeave={(e) => { if (minRating !== r) e.currentTarget.style.background = "transparent"; }}
                  >
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
                      onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
                    >
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
      gender: 'women', 
      barber: null           
    } 
  })}
  style={{  
    background:"linear-gradient(135deg,#C5A059,#B58D3B)",
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
        </div>
      </div>
      <Footer />
    </>
  );
}