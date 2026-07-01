import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import SalonSelectorBar from "../../components/salon/SalonSelectorBar";
import CustomSelect from "../../components/common/CustomSelect";
import { SlidersHorizontal, X } from "lucide-react";
import { getPremiumServiceImage } from "../../components/common/Modals";


/* ─── DATA ─────────────────────────────────────────────────── */
const HERO_IMAGES = [
  "https://i.pinimg.com/1200x/c9/19/5b/c9195b3d76fedee86ae1031791d732cb.jpg",
  "https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=1600&q=80",
  "https://images.unsplash.com/photo-1600948836101-f9ffda59d250?w=1600&q=80",
  "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=1600&q=80",
];

const SERVICES = [
  // massage (Massages) - 1 to 10
  {
    id: 1,
    name: "Aromatherapy Scalp Massage",
    desc: "Deep-pressure scalp massage using premium essential oils to relieve tension.",
    price: 299,
    duration: "20 min",
    category: "massage",
    rating: 5,
    reviews: 218,
    tag: "Popular",
    img: "https://i.pinimg.com/1200x/a7/84/59/a784597c5a31691b0c652634fa4726b5.jpg?w=600&auto=format&fit=crop&q=80",
  },
  {
    id: 2,
    name: "Acupressure Shoulder Relief",
    desc: "Targeted tension-release massage for neck and shoulders using warm massage balms.",
    price: 399,
    duration: "25 min",
    category: "massage",
    rating: 4,
    reviews: 134,
    tag: "Relaxing",
    img: "https://i.pinimg.com/736x/4a/14/cb/4a14cb4a8f9eb9dbbfbf2ca8cfb2c8cf.jpg?w=600&auto=format&fit=crop&q=80",
  },
  {
    id: 3,
    name: "Charcoal Beard Detox",
    desc: "Premium charcoal scrub and wash to cleanse and soften beard follicles.",
    price: 449,
    duration: "20 min",
    category: "massage",
    rating: 5,
    reviews: 88,
    tag: "Popular",
    img: "https://i.pinimg.com/736x/de/5b/4b/de5b4be8e1f0e20cbda1b9ccb249a5db.jpg?w=600&auto=format&fit=crop&q=80",
  },
  {
    id: 4,
    name: "Relaxing Foot Reflexology",
    desc: "Acupressure foot massage targeting stress points to improve blood flow.",
    price: 350,
    duration: "20 min",
    category: "massage",
    rating: 5,
    reviews: 92,
    tag: null,
    img: "https://i.pinimg.com/736x/21/df/b8/21dfb85848bb22be4e2354fdf8bb0c0c.jpg?w=600&auto=format&fit=crop&q=80",
  },
  {
    id: 5,
    name: "Warm Herbal Oil Champo",
    desc: "Traditional hot herbal oil application with vigorous champi massage.",
    price: 250,
    duration: "15 min",
    category: "massage",
    rating: 4,
    reviews: 114,
    tag: "Bestseller",
    img: "https://i.pinimg.com/736x/6f/a7/df/6fa7dfa7cfb2ca3a9cbda1bc8dbf03a6.jpg?w=600&auto=format&fit=crop&q=80",
  },
  {
    id: 6,
    name: "Quick Eye Stress Relief",
    desc: "Cooling cucumber compress and temple massage for tired eyes.",
    price: 199,
    duration: "10 min",
    category: "massage",
    rating: 4,
    reviews: 63,
    tag: null,
    img: "https://i.pinimg.com/736x/91/9d/b1/919db1c5240f9076f8aebcfbe9aef7c5.jpg?w=600&auto=format&fit=crop&q=80",
  },
  {
    id: 7,
    name: "Face Roller Massage",
    desc: "Gentle jade rolling face massage to reduce puffiness and soothe facial muscles.",
    price: 150,
    duration: "10 min",
    category: "massage",
    rating: 5,
    reviews: 79,
    tag: null,
    img: "https://i.pinimg.com/736x/29/cf/5c/29cf5ce4e7b8f9e1e12762b3fdff40cb.jpg?w=600&auto=format&fit=crop&q=80",
  },
  {
    id: 8,
    name: "Deep Back Relief",
    desc: "Targeted upper back deep-tissue rub to release knots and stiffness.",
    price: 450,
    duration: "25 min",
    category: "massage",
    rating: 5,
    reviews: 112,
    tag: "Popular",
    img: "https://i.pinimg.com/736x/bd/8a/76/bd8a760bdf73df011bd7e4115162a8c3.jpg?w=600&auto=format&fit=crop&q=80",
  },
  {
    id: 9,
    name: "Mint Cooling Champo",
    desc: "Champi head massage using organic cooling peppermint scalp oil.",
    price: 299,
    duration: "20 min",
    category: "massage",
    rating: 5,
    reviews: 84,
    tag: "Relaxing",
    img: "https://i.pinimg.com/736x/55/a7/df/55a7df4c0803a111b7dfb8997a47fb72.jpg?w=600&auto=format&fit=crop&q=80",
  },
  {
    id: 10,
    name: "Head & Temples Rub",
    desc: "Quick dry scalp massage focusing on temples to relieve headaches.",
    price: 199,
    duration: "15 min",
    category: "massage",
    rating: 4,
    reviews: 130,
    tag: null,
    img: "https://i.pinimg.com/736x/6d/46/74/6d4674395df3d0a29430803cbe31bc2a.jpg?w=600&auto=format&fit=crop&q=80",
  },

  // treatment (Hair Treatments) - 11 to 20
  {
    id: 11,
    name: "Deep Conditioning Mask",
    desc: "Moisture-rich nourishing treatment mask for dry or chemically treated hair.",
    price: 499,
    duration: "30 min",
    category: "treatment",
    rating: 4,
    reviews: 61,
    tag: null,
    img: "https://i.pinimg.com/1200x/74/7a/aa/747aaa2f4f8b5262a552aa4baed6ff60.jpg?w=600&auto=format&fit=crop&q=80",
  },
  {
    id: 12,
    name: "Express Keratin Booster",
    desc: "Quick leave-in keratin protein infusion to reduce frizz and restore shine.",
    price: 799,
    duration: "40 min",
    category: "treatment",
    rating: 5,
    reviews: 97,
    tag: "Bestseller",
    img: "https://i.pinimg.com/1200x/81/e1/c2/81e1c2e2bc7932c9abaa57c4a9e46a41.jpg?w=600&auto=format&fit=crop&q=80",
  },
  {
    id: 13,
    name: "Instant Bond-Repair Shield",
    desc: "Olaplex-infused quick bond strengthening treatment during styling.",
    price: 1199,
    duration: "30 min",
    category: "treatment",
    rating: 5,
    reviews: 76,
    tag: "Premium",
    img: "https://i.pinimg.com/1200x/16/ad/e0/16ade0c394f6e919f1f6dc05c3206d8d.jpg?w=600&auto=format&fit=crop&q=80",
  },
  {
    id: 14,
    name: "Anti-Frizz Serum Infusion",
    desc: "Ultrasonic infusion of professional anti-frizz serums for high humidity protection.",
    price: 599,
    duration: "20 min",
    category: "treatment",
    rating: 5,
    reviews: 42,
    tag: null,
    img: "https://i.pinimg.com/1200x/ed/ba/9c/edba9c8e676663d02abbac15f2067a53.jpg?w=600&auto=format&fit=crop&q=80",
  },
  {
    id: 15,
    name: "Citrus Scalp Scrub",
    desc: "Exfoliating salicylic acid and citrus scalp scrub to eliminate buildup.",
    price: 699,
    duration: "25 min",
    category: "treatment",
    rating: 5,
    reviews: 67,
    tag: "Luxury",
    img: "https://i.pinimg.com/1200x/79/1b/d4/791bd40e7756ad08631dbb79b6600e95.jpg?w=600&auto=format&fit=crop&q=80",
  },
  {
    id: 16,
    name: "Protein Nourishing Spray",
    desc: "Leave-in protein spray that detangles and rebuilds weak strands.",
    price: 299,
    duration: "15 min",
    category: "treatment",
    rating: 4,
    reviews: 31,
    tag: null,
    img: "https://i.pinimg.com/736x/40/74/1c/40741c14e86e555444044a7fc5c73667.jpg?w=600&auto=format&fit=crop&q=80",
  },
  {
    id: 17,
    name: "Leave-in Moroccan Argan Shot",
    desc: "Concentrated shot of pure Moroccan argan oil to seal split ends.",
    price: 399,
    duration: "15 min",
    category: "treatment",
    rating: 5,
    reviews: 58,
    tag: "Popular",
    img: "https://i.pinimg.com/1200x/bb/db/62/bbdb6220af39cd2ce5e4fde1271babc7.jpg?w=600&auto=format&fit=crop&q=80",
  },
  {
    id: 18,
    name: "Volumizing Root Boost",
    desc: "Root-lifting treatment spray that adds height and bounce to flat hair.",
    price: 499,
    duration: "20 min",
    category: "treatment",
    rating: 4,
    reviews: 49,
    tag: null,
    img: "https://i.pinimg.com/1200x/86/55/da/8655da48743eeb8a7d6418ffdc8104ca.jpg?w=600&auto=format&fit=crop&q=80",
  },
  {
    id: 19,
    name: "Scalp Cooling Serum Ampoule",
    desc: "Tea tree and menthol ampoule to reduce scalp itchiness and irritation.",
    price: 550,
    duration: "15 min",
    category: "treatment",
    rating: 5,
    reviews: 73,
    tag: null,
    img: "https://i.pinimg.com/736x/ff/0b/10/ff0b100cd3e9e3e6dd4e097955885056.jpg?w=600&auto=format&fit=crop&q=80",
  },
  {
    id: 20,
    name: "Split-End Prevention treatment",
    desc: "Heat-activated nourishing cream designed to mend and prevent split ends.",
    price: 450,
    duration: "20 min",
    category: "treatment",
    rating: 5,
    reviews: 90,
    tag: "Popular",
    img: "https://i.pinimg.com/1200x/2f/b8/72/2fb8722cd56fc94c01424fa12785641e.jpg?w=600&auto=format&fit=crop&q=80",
  },

  // color (Color Enhancers) - 21 to 30
  {
    id: 21,
    name: "Premium Shine Glaze / Toner",
    desc: "Express glossing or color toner to refresh hair vibrancy and shine.",
    price: 999,
    duration: "45 min",
    category: "color",
    rating: 4,
    reviews: 53,
    tag: "Express Glow",
    img: "https://i.pinimg.com/736x/1d/77/07/1d77071c06be4c6c861511fca8260837.jpg?w=600&auto=format&fit=crop&q=80",
  },
  {
    id: 22,
    name: "Silver / Grey Glossing",
    desc: "Express toner to neutralize brassy tones in blonde, grey, or silver hair.",
    price: 899,
    duration: "30 min",
    category: "color",
    rating: 4,
    reviews: 31,
    tag: "New",
    img: "https://i.pinimg.com/736x/58/4d/15/584d151c34e2767f013cbcd38a4103cc.jpg?w=600&auto=format&fit=crop&q=80",
  },
  {
    id: 23,
    name: "Gold Highlights Accents (2 foils)",
    desc: "Dual accent highlight foils for an express sun-kissed look.",
    price: 599,
    duration: "30 min",
    category: "color",
    rating: 5,
    reviews: 62,
    tag: "Express Glow",
    img: "https://i.pinimg.com/736x/f3/20/ad/f320ad568c178911c0df440181ad0955.jpg?w=600&auto=format&fit=crop&q=80",
  },
  {
    id: 24,
    name: "Color Protect Lock Sealant",
    desc: "Acidic pH treatment that locks pigments in and seals the hair cuticle.",
    price: 499,
    duration: "20 min",
    category: "color",
    rating: 4,
    reviews: 41,
    tag: null,
    img: "https://i.pinimg.com/736x/1f/40/f1/1f40f1ff92767d608252cb554a34ccb5.jpg?w=600&auto=format&fit=crop&q=80",
  },
  {
    id: 25,
    name: "Hair Gloss & Luster Spa",
    desc: "Clear glossing mask that adds glass-like shine without changing color.",
    price: 799,
    duration: "30 min",
    category: "color",
    rating: 5,
    reviews: 83,
    tag: "Bestseller",
    img: "https://i.pinimg.com/1200x/04/c5/b2/04c5b2b30680f2b5932ca7e6d80f7702.jpg?w=600&auto=format&fit=crop&q=80",
  },
  {
    id: 26,
    name: "Copper / Caramel Glaze Refresher",
    desc: "Color-depositing express glaze to restore warm copper and gold tones.",
    price: 899,
    duration: "35 min",
    category: "color",
    rating: 5,
    reviews: 55,
    tag: "New",
    img: "https://i.pinimg.com/1200x/44/46/a2/4446a28a6f30eae2f008d243d6ff460b.jpg?w=600&auto=format&fit=crop&q=80",
  },
  {
    id: 27,
    name: "Fashion Streaks booster",
    desc: "Toner boost to maintain bright fantasy colors like purple, blue, or red.",
    price: 399,
    duration: "20 min",
    category: "color",
    rating: 4,
    reviews: 29,
    tag: null,
    img: "https://i.pinimg.com/1200x/3e/56/86/3e56867afc33e00ee0ca9d5ae850fc0c.jpg?w=600&auto=format&fit=crop&q=80",
  },
  {
    id: 28,
    name: "Root Shadow blending",
    desc: "Smudge root glaze to soften the transition line from natural roots.",
    price: 699,
    duration: "30 min",
    category: "color",
    rating: 5,
    reviews: 48,
    tag: "Popular",
    img: "https://i.pinimg.com/736x/7a/ad/00/7aad00b196e28483ad3b2bc6d5ccd818.jpg?w=600&auto=format&fit=crop&q=80",
  },
  {
    id: 29,
    name: "Ammonia-Free color gloss",
    desc: "Semi-permanent organic gloss to add subtle hues and nourish cuticles.",
    price: 750,
    duration: "25 min",
    category: "color",
    rating: 4,
    reviews: 73,
    tag: null,
    img: "https://i.pinimg.com/736x/d3/7f/85/d37f854123209471bdca3ff76040abdc.jpg?w=600&auto=format&fit=crop&q=80",
  },
  {
    id: 30,
    name: "Balayage glow booster",
    desc: "Post-bleach highlighting glaze that locks moisture and adds light reflection.",
    price: 899,
    duration: "30 min",
    category: "color",
    rating: 5,
    reviews: 95,
    tag: "Premium",
    img: "https://i.pinimg.com/1200x/ed/65/ee/ed65eef9616d21b73dea4ebc08bbc43a.jpg?w=600&auto=format&fit=crop&q=80",
  },
];

const CATEGORIES = [
  { id: "all",       label: "All Add-ons",    icon: "✦" },
  { id: "massage",   label: "Massages",        icon: "♨" },
  { id: "treatment", label: "Hair Treatments", icon: "◈" },
  { id: "color",     label: "Color Enhancers", icon: "✿" },
];

const PRICE_RANGES = [
  { id: "all",       label: "Any Price" },
  { id: "under200",  label: "Under ₹200" },
  { id: "200-500",   label: "₹200 – ₹500" },
  { id: "500-1000",  label: "₹500 – ₹1,000" },
  { id: "above1000", label: "Above ₹1,000" },
];

const SORT_OPTIONS = [
  { id: "default",    label: "Featured" },
  { id: "price-asc",  label: "Price: Low to High" },
  { id: "price-desc", label: "Price: High to Low" },
  { id: "rating",     label: "Top Rated" },
];

const TAG_COLORS = {
  "Most Popular": { bg: "#FFF3DC", text: "#A0720A", border: "#E8C84B" },
  "Relaxing":     { bg: "#F0F5FF", text: "#3E5FCC", border: "#C3CEF6" },
  "Indulgent":    { bg: "#F5F0FF", text: "#6B3FC0", border: "#D1BAFF" },
  "Express Glow": { bg: "#FFF0F5", text: "#C0396B", border: "#F9C3D8" },
  "Premium":      { bg: "#F0FFF4", text: "#276749", border: "#9AE6B4" },
};

/* ─── SUB-COMPONENTS ────────────────────────────────────────── */
function StarRating({ rating, count }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
      <div style={{ display: "flex", gap: 1 }}>
        {[1, 2, 3, 4, 5].map((s) => (
          <svg key={s} width="12" height="12" viewBox="0 0 12 12" fill="none">
            <polygon
              points="6,1 7.5,4.5 11,4.5 8.5,7 9.5,11 6,8.5 2.5,11 3.5,7 1,4.5 4.5,4.5"
              fill={s <= rating ? "#C5A059" : "none"}
              stroke={s <= rating ? "#C5A059" : "#C5A05960"}
              strokeWidth="0.8"
            />
          </svg>
        ))}
      </div>
      <span style={{ fontSize: 12, color: "#888", fontFamily: "'Montserrat',sans-serif" }}>
        ({count})
      </span>
    </div>
  );
}

function Highlight({ text, query }) {
  if (!query.trim()) return <>{text}</>;
  const re = new RegExp(
    `(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`,
    "gi"
  );
  const parts = text.split(re);
  return (
    <>
      {parts.map((p, i) =>
        re.test(p) ? (
          <mark key={i} style={{ background: "#FFF3DC", color: "#8A6A10", borderRadius: 2, padding: "0 1px" }}>
            {p}
          </mark>
        ) : p
      )}
    </>
  );
}

/* ─── MAIN PAGE ─────────────────────────────────────────────── */
export default function AddonServices() {
  const navigate = useNavigate();

  const [activeCategory, setActiveCategory] = useState("all");
  const [selectedPrice,  setSelectedPrice]  = useState("all");
  const [minRating,      setMinRating]       = useState(0);
  const [sortBy,         setSortBy]          = useState("default");
  const [searchQuery,    setSearchQuery]     = useState("");
  const [searchFocused,  setSearchFocused]   = useState(false);
  const [slideIndex,     setSlideIndex]      = useState(0);
  const [visibleCards,   setVisibleCards]    = useState(new Set());
  const [showFilters,    setShowFilters]     = useState(false);

  const cardRefs = useRef({});
  const [servicesList, setServicesList] = useState([]);
  const [loadingState, setLoadingState] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const salonId = localStorage.getItem("selectedSalonId");
        if (!salonId) {
          navigate("/nearby");
          return;
        }
        const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
        const res = await fetch(`${API}/services/${salonId}`);
        const data = await res.json();
        if (data.success) {
          const mapped = data.services
            .filter(bs => bs.category === "addon" && bs.is_active !== false)
            .map(bs => {
              const match = SERVICES.find(s => s.name.toLowerCase() === bs.name.toLowerCase());
              const image = getPremiumServiceImage(bs.name, "addon");
              
              if (match) {
                return {
                  ...match,
                  id: bs._id,
                  price: bs.price,
                  duration: `${bs.duration} min`,
                  desc: bs.description || match.desc,
                  img: image
                };
              }
              
              let subcat = "treatment";
              const name = bs.name.toLowerCase();
              if (name.includes("color") || name.includes("colour") || name.includes("highlight") || name.includes("streaks") || name.includes("henna") || name.includes("glaze") || name.includes("dye")) {
                subcat = "color";
              } else if (name.includes("massage") || name.includes("spa") || name.includes("facial") || name.includes("clean") || name.includes("scrub") || name.includes("detox") || name.includes("mask") || name.includes("wellness") || name.includes("shoulder") || name.includes("reflexology") || name.includes("champi") || name.includes("roller")) {
                subcat = "massage";
              }
              
              return {
                id: bs._id,
                name: bs.name,
                desc: bs.description || "Premium addon service.",
                price: bs.price,
                duration: `${bs.duration || 20} min`,
                category: subcat,
                rating: 5,
                reviews: 80,
                tag: null,
                img: image
              };
            });
          setServicesList(mapped);
        }
      } catch (err) {
        console.error("Error fetching salon services:", err);
      } finally {
        setLoadingState(false);
      }
    };
    fetchServices();
  }, [navigate]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  /* hero slideshow */
  useEffect(() => {
    const iv = setInterval(() => setSlideIndex((p) => (p + 1) % HERO_IMAGES.length), 5000);
    return () => clearInterval(iv);
  }, []);

  /* scroll-reveal cards */
  useEffect(() => {
    setVisibleCards(new Set());
    const observers = [];
    const t = setTimeout(() => {
      Object.entries(cardRefs.current).forEach(([id, el]) => {
        if (!el) return;
        const obs = new IntersectionObserver(
          ([entry]) => {
            if (entry.isIntersecting) {
              setVisibleCards((prev) => new Set([...prev, id]));
              obs.disconnect();
            }
          },
          { threshold: 0.08 }
        );
        obs.observe(el);
        observers.push(obs);
      });
    }, 60);
    return () => { clearTimeout(t); observers.forEach((o) => o.disconnect()); };
  }, [activeCategory, selectedPrice, minRating, searchQuery, sortBy, servicesList]);

  /* filtering + sorting */
  const filtered = servicesList
    .filter((s) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        if (!s.name.toLowerCase().includes(q) && !s.desc.toLowerCase().includes(q)) return false;
      }
      if (activeCategory !== "all" && s.category !== activeCategory) return false;
      if (minRating > 0 && s.rating < minRating) return false;
      if (selectedPrice === "under200")  return s.price < 200;
      if (selectedPrice === "200-500")   return s.price >= 200 && s.price <= 500;
      if (selectedPrice === "500-1000")  return s.price > 500 && s.price <= 1000;
      if (selectedPrice === "above1000") return s.price > 1000;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === "price-asc")  return a.price - b.price;
      if (sortBy === "price-desc") return b.price - a.price;
      if (sortBy === "rating")     return b.rating - a.rating;
      return 0;
    });

  const hasActive = activeCategory !== "all" || selectedPrice !== "all" || minRating > 0 || !!searchQuery.trim();
  const clearAll  = () => {
    setActiveCategory("all");
    setSelectedPrice("all");
    setMinRating(0);
    setSortBy("default");
    setSearchQuery("");
  };

  /* ── RENDER ── */
  return (
    <>
    <Navbar />
    <SalonSelectorBar />
      {/* inject Google Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,700;1,400&family=Montserrat:wght@300;400;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #FAF6F0; }
        ::selection { background: #C5A059; color: #fff; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #FAF6F0; }
        ::-webkit-scrollbar-thumb { background: #C5A059; border-radius: 3px; }
      `}</style>

      {/* <div style={{ background: "#FAF6F0", minHeight: "100vh", fontFamily: "'Cormorant Garamond','Georgia',serif", color: "#2C241E" }}> */}
      <div
        className="[scrollbar-width:thin] [scrollbar-color:#C9BFA8_transparent] [&::-webkit-scrollbar]:w-[6px] [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-[#C9BFA8] [&::-webkit-scrollbar-thumb]:rounded-[10px] hover:[&::-webkit-scrollbar-thumb]:bg-[#B0A488]"
        style={{ background: "#FAF6F0", minHeight: "100vh", fontFamily: "'Cormorant Garamond','Georgia',serif", color: "#2C241E" }}
      >

        {/* ── BACK BUTTON ── */}
        <div className="fixed bottom-5 left-5 md:bottom-auto md:top-[90px] md:left-5 z-[9999]">
          <button
            onClick={() => navigate(-1)}
            style={{ width: 48, height: 48, borderRadius: "50%", border: "none", background: "rgba(255,255,255,0.95)", backdropFilter: "blur(10px)", cursor: "pointer", fontSize: 20, boxShadow: "0 8px 20px rgba(0,0,0,0.15)", transition: "all 0.3s ease", display: "flex", alignItems: "center", justifyContent: "center" }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "#C5A059"; e.currentTarget.style.color = "#fff"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.95)"; e.currentTarget.style.color = "#000"; }}
          >
            ←
          </button>
        </div>

        {/* ── HERO ── */}
        <div style={{ position: "relative", height: 540, overflow: "hidden" }}>
          {HERO_IMAGES.map((img, idx) => (
            <div
              key={idx}
              style={{ position: "absolute", inset: 0, backgroundImage: `url('${img}')`, backgroundSize: "cover", backgroundPosition: "center", opacity: idx === slideIndex ? 1 : 0, transition: "opacity 1.2s ease", filter: "brightness(0.38)" }}
            />
          ))}
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom,rgba(0,0,0,0.25),rgba(0,0,0,0.75))", zIndex: 2 }} />

          {/* dot indicators */}
          <div style={{ position: "absolute", bottom: 22, left: "50%", transform: "translateX(-50%)", display: "flex", gap: 8, zIndex: 10 }}>
            {HERO_IMAGES.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setSlideIndex(idx)}
                style={{ width: idx === slideIndex ? 24 : 8, height: 8, borderRadius: 4, padding: 0, border: "none", cursor: "pointer", background: idx === slideIndex ? "#C5A059" : "rgba(255,255,255,0.35)", transition: "all 0.4s ease" }}
              />
            ))}
          </div>

          {/* hero content */}
          <div style={{ position: "absolute", inset: 0, zIndex: 5, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "0 24px" }}>
            {/* decorative badge */}
            <div style={{ display: "inline-flex", alignItems: "center", gap: 10, border: "1px solid rgba(197,160,89,0.5)", borderRadius: 40, padding: "6px 20px", marginBottom: 20, background: "rgba(0,0,0,0.2)" }}>
              <span style={{ width: 18, height: 1, background: "#C5A059", display: "inline-block" }} />
              <span style={{ color: "#C5A059", fontSize: 10, letterSpacing: "0.22em", fontFamily: "'Montserrat',sans-serif", fontWeight: 600, textTransform: "uppercase" }}>Custom Enhancements</span>
              <span style={{ width: 18, height: 1, background: "#C5A059", display: "inline-block" }} />
            </div>

            <h1 style={{ fontSize: "clamp(38px,5.5vw,68px)", fontWeight: 300, color: "#fff", margin: "0 0 12px", lineHeight: 1.1, letterSpacing: "0.05em" }}>
              ADD-ON{" "}
              <em style={{ fontStyle: "italic", color: "#C5A059", fontWeight: 400 }}>Services</em>
            </h1>

            <div style={{ width: 60, height: 1, background: "linear-gradient(to right,transparent,#C5A059,transparent)", margin: "0 auto 16px" }} />

            <p style={{ color: "rgba(255,255,255,0.65)", fontSize: 14, fontWeight: 300, maxWidth: 440, lineHeight: 1.75, fontFamily: "'Montserrat',sans-serif", marginBottom: 28 }}>
              Elevate every visit with therapeutic extras and premium upgrades. Tailored rituals that make each appointment feel distinctly more indulgent.
            </p>

            {/* search bar */}
            <div style={{ position: "relative", width: "100%", maxWidth: 520, transition: "transform 0.2s", transform: searchFocused ? "scale(1.025)" : "scale(1)" }}>
              <svg
                width="16" height="16" viewBox="0 0 24 24" fill="none"
                stroke={searchFocused ? "#C5A059" : "rgba(255,255,255,0.6)"}
                strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"
                style={{ position: "absolute", left: 18, top: "50%", transform: "translateY(-50%)", pointerEvents: "none", zIndex: 2, transition: "stroke 0.25s" }}
              >
                <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                placeholder="Search — massage, treatment, color…"
                style={{ width: "100%", padding: "15px 48px 15px 48px", borderRadius: 50, border: searchFocused ? "2px solid #C5A059" : "2px solid rgba(255,255,255,0.28)", background: searchFocused ? "rgba(255,255,255,0.97)" : "rgba(255,255,255,0.13)", backdropFilter: "blur(12px)", color: searchFocused ? "#2C241E" : "#fff", fontSize: 14, fontFamily: "'Montserrat',sans-serif", outline: "none", transition: "all 0.25s ease", letterSpacing: "0.02em" }}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", background: "rgba(0,0,0,0.2)", border: "none", borderRadius: "50%", width: 22, height: 22, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: 11, color: searchFocused ? "#666" : "#fff", zIndex: 2 }}
                >✕</button>
              )}
            </div>

            {/* quick pills */}
            <div style={{ display: "flex", gap: 8, marginTop: 14, flexWrap: "wrap", justifyContent: "center" }}>
              {["Massage", "Treatment", "Color", "Highlight", "Keratin"].map((q) => (
                <button
                  key={q}
                  onClick={() => setSearchQuery(q)}
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
        {/* END HERO */}

        {/* ── RESULTS BAR ── */}
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "16px 32px 0", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
          <p style={{ fontSize: 13, color: "#888", fontFamily: "'Montserrat',sans-serif", margin: 0 }}>
            {searchQuery.trim() && <><strong style={{ color: "#2C241E" }}>"{searchQuery}"</strong> — </>}
            Showing <strong style={{ color: "#2C241E" }}>{filtered.length}</strong> of {SERVICES.length} add-ons
            {hasActive && (
              <button
                onClick={clearAll}
                style={{ marginLeft: 10, fontSize: 11, color: "#C5A059", background: "none", border: "none", cursor: "pointer", fontFamily: "'Montserrat',sans-serif", textDecoration: "underline", padding: 0 }}
              >
                Clear all
              </button>
            )}
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

        {/* ── MAIN LAYOUT ── */}
        <div className="max-w-[1280px] mx-auto px-4 md:px-8 py-6 md:py-10 flex flex-col md:flex-row gap-6 md:gap-9 items-start">
          
          {/* Mobile Backdrop */}
          {showFilters && (
            <div 
              className="fixed inset-0 bg-stone-900/60 z-50 md:hidden animate-in fade-in duration-200" 
              onClick={() => setShowFilters(false)}
            />
          )}

          {/* ── SIDEBAR ── */}
        <aside className={`
            shrink-0 md:w-[248px] md:sticky md:top-[90px] md:mb-0 md:block md:max-h-[calc(100vh-110px)] md:overflow-y-auto
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
              {/* header */}
              <div style={{ padding: "16px 20px 13px", borderBottom: "1px solid #EAE0D0", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", fontFamily: "'Montserrat',sans-serif", color: "#2C241E" }}>⚙ Filters</span>
                {hasActive && (
                  <button
                    onClick={clearAll}
                    style={{ fontSize: 10, color: "#C5A059", background: "#FFF8EC", border: "1px solid #E8C84B50", borderRadius: 20, padding: "3px 10px", cursor: "pointer", fontFamily: "'Montserrat',sans-serif" }}
                  >
                    Clear all
                  </button>
                )}
              </div>

              {/* category */}
              <div style={{ padding: "14px 20px", borderBottom: "1px solid #F0E8DA" }}>
                <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: "#B0A090", fontFamily: "'Montserrat',sans-serif", margin: "0 0 9px" }}>Category</p>
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
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

              {/* price */}
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

              {/* rating */}
              <div style={{ padding: "14px 20px" }}>
                <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: "#B0A090", fontFamily: "'Montserrat',sans-serif", margin: "0 0 9px" }}>Minimum Rating</p>
                {[5, 4, 3, 0].map((r) => (
                  <button
                    key={r}
                    onClick={() => setMinRating(r)}
                    style={{ display: "flex", alignItems: "center", gap: 7, width: "100%", padding: "7px 10px", marginBottom: 2, borderRadius: 8, border: "none", background: minRating === r ? "linear-gradient(135deg,#FFF3DC,#FAEAC5)" : "transparent", cursor: "pointer", textAlign: "left", transition: "background 0.2s" }}
                    onMouseEnter={(e) => { if (minRating !== r) e.currentTarget.style.background = "#FAF6F0"; }}
                    onMouseLeave={(e) => { if (minRating !== r) e.currentTarget.style.background = "transparent"; }}
                  >
                    {r === 0 ? (
                      <span style={{ fontSize: 12, fontFamily: "'Montserrat',sans-serif", color: "#666" }}>Any rating</span>
                    ) : (
                      <>
                        {[1, 2, 3, 4, 5].map((s) => (
                          <svg key={s} width="12" height="12" viewBox="0 0 12 12" fill="none">
                            <polygon points="6,1 7.5,4.5 11,4.5 8.5,7 9.5,11 6,8.5 2.5,11 3.5,7 1,4.5 4.5,4.5" fill={s <= r ? "#C5A059" : "none"} stroke={s <= r ? "#C5A059" : "#CCC"} strokeWidth="0.8" />
                          </svg>
                        ))}
                        <span style={{ fontSize: 11, color: "#888", fontFamily: "'Montserrat',sans-serif" }}>& up</span>
                      </>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* ── CARDS GRID ── */}
          <div className="flex-1 w-full min-w-0">
            {loadingState ? (
              <div style={{ textAlign: "center", padding: "100px 20px", background: "#fff", borderRadius: 16, border: "1px solid #EAE0D0" }}>
                <p style={{ fontFamily: "'Montserrat',sans-serif", fontSize: 14, color: "#888", letterSpacing: "0.05em" }}>Loading Catalog Services...</p>
              </div>
            ) : filtered.length === 0 ? (
              <div style={{ textAlign: "center", padding: "80px 20px", background: "#fff", borderRadius: 16, border: "1px dashed #DDD4C4" }}>
                <div style={{ fontSize: 36, marginBottom: 14 }}>✦</div>
                <p style={{ fontSize: 20, fontFamily: "'Cormorant Garamond',serif", color: "#8A7060", margin: "0 0 8px" }}>No add-ons found</p>
                <p style={{ fontSize: 13, fontFamily: "'Montserrat',sans-serif", color: "#AAA", margin: "0 0 24px" }}>
                  {searchQuery.trim() ? `No results for "${searchQuery}". Try a different keyword.` : "Try adjusting your filter selections."}
                </p>
                <button
                  onClick={clearAll}
                  style={{ padding: "10px 28px", background: "#2C241E", color: "#fff", border: "none", borderRadius: 8, fontSize: 12, fontFamily: "'Montserrat',sans-serif", letterSpacing: "0.1em", textTransform: "uppercase", cursor: "pointer" }}
                >
                  Clear all filters
                </button>
              </div>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))", gap: 24 }}>
                {filtered.map((s, i) => {
                  const tagStyle = s.tag ? TAG_COLORS[s.tag] : null;
                  const visible  = visibleCards.has(String(s.id));
                  return (
                    <div
                      key={s.id}
                      ref={(el) => (cardRefs.current[s.id] = el)}
                      style={{ background: "#fff", borderRadius: 16, overflow: "hidden", border: "1px solid #EAE0D0", opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(22px)", transition: `opacity 0.42s ease ${i * 65}ms, transform 0.42s ease ${i * 65}ms, box-shadow 0.28s ease` }}
                      onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-6px)"; e.currentTarget.style.boxShadow = "0 16px 40px rgba(44,36,30,0.11)"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
                    >
                      {/* image */}
                      <div style={{ position: "relative", height: 210, overflow: "hidden" }}>
                        <img
                          src={s.img}
                          alt={s.name}
                          style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.5s ease" }}
                          onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.07)")}
                          onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                        />
                        {tagStyle && (
                          <span style={{ position: "absolute", top: 12, left: 12, background: tagStyle.bg, color: tagStyle.text, border: `1px solid ${tagStyle.border}`, borderRadius: 20, padding: "3px 10px", fontSize: 10, fontFamily: "'Montserrat',sans-serif", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                            {s.tag}
                          </span>
                        )}
                        <span style={{ position: "absolute", bottom: 10, right: 10, background: "rgba(0,0,0,0.52)", backdropFilter: "blur(6px)", color: "#fff", borderRadius: 20, padding: "3px 10px", fontSize: 11, fontFamily: "'Montserrat',sans-serif" }}>
                          ⏱ {s.duration}
                        </span>
                      </div>

                      {/* details */}
                      <div style={{ padding: "16px 18px 18px" }}>
                        <h3 style={{ fontSize: 20, fontWeight: 400, margin: "0 0 4px", lineHeight: 1.25, fontFamily: "'Cormorant Garamond',serif", color: "#2C241E" }}>
                          <Highlight text={s.name} query={searchQuery} />
                        </h3>
                        <p style={{ fontSize: 12, fontFamily: "'Montserrat',sans-serif", color: "#999", margin: "0 0 10px", lineHeight: 1.6 }}>
                          <Highlight text={s.desc} query={searchQuery} />
                        </p>
                        <StarRating rating={s.rating} count={s.reviews} />
                        <div style={{ marginTop: 14, display: "flex", alignItems: "center", justifyContent: "space-between", borderTop: "1px solid #F0E8DA", paddingTop: 12 }}>
                          <div>
                            <span style={{ fontSize: 10, fontFamily: "'Montserrat',sans-serif", color: "#AAA", textTransform: "uppercase", letterSpacing: "0.08em", display: "block", marginBottom: 1 }}>Starting at</span>
                            <span style={{ fontSize: 22, fontWeight: 700, fontFamily: "'Cormorant Garamond',serif", color: "#2C241E" }}>₹{s.price.toLocaleString()}</span>
                          </div>
                          <button
                            onClick={() => navigate("/customer/barber", { state: { service: s } })}
                            style={{ background: "#2C241E", color: "#F5EFE0", border: "none", borderRadius: 8, padding: "9px 16px", fontSize: 11, fontFamily: "'Montserrat',sans-serif", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", cursor: "pointer", transition: "background 0.2s,color 0.2s" }}
                            onMouseEnter={(e) => { e.currentTarget.style.background = "#C5A059"; e.currentTarget.style.color = "#fff"; }}
                            onMouseLeave={(e) => { e.currentTarget.style.background = "#2C241E"; e.currentTarget.style.color = "#F5EFE0"; }}
                          >
                            Add On →
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
