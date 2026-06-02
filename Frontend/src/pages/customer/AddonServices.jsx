import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";

/* ─── DATA ─────────────────────────────────────────────────── */
const HERO_IMAGES = [
  "https://images.unsplash.com/photo-1519415943484-9fa1873496d4?w=1600&q=80",
  "https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=1600&q=80",
  "https://images.unsplash.com/photo-1600948836101-f9ffda59d250?w=1600&q=80",
  "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=1600&q=80",
];

const SERVICES = [
  {
    id: 1,
    name: "Head Massage",
    desc: "Deep-pressure scalp massage that relieves tension and promotes blood circulation.",
    price: 150,
    duration: "20 min",
    category: "massage",
    rating: 5,
    reviews: 218,
    tag: "Most Popular",
    img: "https://res.klook.com/image/upload/w_750,h_469,c_fill,q_85/w_80,x_15,y_15,g_south_west,l_Klook_water_br_trans_yhcmh3/activities/fchn5h7dfr2mmbbw3nq4.jpg?w=800",
  },
  {
    id: 2,
    name: "Shoulder Massage",
    desc: "Targeted relief for neck and shoulder stiffness using warm aromatherapy oils.",
    price: 200,
    duration: "25 min",
    category: "massage",
    rating: 4,
    reviews: 134,
    tag: "Relaxing",
    img: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800",
  },
  {
    id: 3,
    name: "Hair Treatment",
    desc: "Intensive keratin and protein mask to restore shine, strength, and silkiness.",
    price: 600,
    duration: "45 min",
    category: "treatment",
    rating: 5,
    reviews: 97,
    tag: "Indulgent",
    img: "https://images.unsplash.com/photo-1580618672591-eb180b1a973f?w=800",
  },
  {
    id: 4,
    name: "Deep Conditioning",
    desc: "Moisture-rich conditioning ritual for dry, damaged, or chemically-treated hair.",
    price: 400,
    duration: "30 min",
    category: "treatment",
    rating: 4,
    reviews: 61,
    tag: null,
    img: "https://images.unsplash.com/photo-1522337660859-02fbefca4702?w=800",
  },
  {
    id: 5,
    name: "Hair Coloring Add-on",
    desc: "Express gloss or toner applied over existing color for renewed vibrancy.",
    price: 500,
    duration: "40 min",
    category: "color",
    rating: 4,
    reviews: 53,
    tag: "Express Glow",
    img: "https://media.istockphoto.com/id/1305824214/photo/woman-dyeing-her-hair-at-the-salon.jpg?s=612x612&w=0&k=20&c=Jk2XQqn-5Tf1IeUPhmLYMP1Lq2nSlW_0udRXzc_KAJI=",
  },
  {
    id: 6,
    name: "Highlight Booster",
    desc: "Refresh faded highlights with targeted foil application and bond-protecting serum.",
    price: 800,
    duration: "55 min",
    category: "color",
    rating: 5,
    reviews: 42,
    tag: "Premium",
    img: "https://images.unsplash.com/photo-1560869713-7d0a29430803?w=800",
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

  const cardRefs = useRef({});

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
  }, [activeCategory, selectedPrice, minRating, searchQuery, sortBy]);

  /* filtering + sorting */
  const filtered = SERVICES
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

      <div style={{ background: "#FAF6F0", minHeight: "100vh", fontFamily: "'Cormorant Garamond','Georgia',serif", color: "#2C241E" }}>

        {/* ── BACK BUTTON ── */}
        <div style={{ position: "fixed", top: 90, left: 20, zIndex: 9999 }}>
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
        <div style={{ position: "relative", height: 540, overflow: "hidden", marginTop: 72 }}>
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
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 11, color: "#AAA", fontFamily: "'Montserrat',sans-serif", textTransform: "uppercase", letterSpacing: "0.08em" }}>Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{ border: "1px solid #DDD4C4", background: "#fff", borderRadius: 8, padding: "7px 12px", fontSize: 13, color: "#2C241E", fontFamily: "'Montserrat',sans-serif", cursor: "pointer", outline: "none" }}
            >
              {SORT_OPTIONS.map((o) => <option key={o.id} value={o.id}>{o.label}</option>)}
            </select>
          </div>
        </div>

        {/* ── MAIN LAYOUT ── */}
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "22px 32px 80px", display: "flex", gap: 36, alignItems: "flex-start" }}>

          {/* ── SIDEBAR ── */}
          <aside style={{ width: 248, flexShrink: 0, position: "sticky", top: 90 }}>
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
          <div style={{ flex: 1, minWidth: 0 }}>
            {filtered.length === 0 ? (
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
