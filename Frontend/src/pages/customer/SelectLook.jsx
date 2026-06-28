import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";

/* ─── LOOKS DATABASE ────────────────────────────────────────── */
const LOOKS_DB = {
  styling: [
    { id: "wh1", name: "Premium Layer Cut & Blow Dry", img: "https://i.pinimg.com/1200x/79/1b/d4/791bd40e7756ad08631dbb79b6600e95.jpg" },
    { id: "wh2", name: "Luxury Feather Cut", img: "https://i.pinimg.com/736x/40/74/1c/40741c14e86e555444044a7fc5c73667.jpg" },
    { id: "wh3", name: "Classic Bob Styling", img: "https://i.pinimg.com/1200x/bb/db/62/bbdb6220af39cd2ce5e4fde1271babc7.jpg" },
    { id: "wh4", name: "Soft Curl Blowout", img: "https://i.pinimg.com/1200x/86/55/da/8655da48743eeb8a7d6418ffdc8104ca.jpg" },
    { id: "wh5", name: "Korean Wolf Cut", img: "https://i.pinimg.com/736x/ff/0b/10/ff0b100cd3e9e3e6dd4e097955885056.jpg" },
    { id: "wh6", name: "Luxury Straight Finish", img: "https://i.pinimg.com/1200x/2f/b8/72/2fb8722cd56fc94c01424fa12785641e.jpg" },
    { id: "wh7", name: "Textured Wavy Styling", img: "https://i.pinimg.com/736x/1d/77/07/1d77071c06be4c6c861511fca8260837.jpg" },
    { id: "wh8", name: "Elegant U-Cut", img: "https://i.pinimg.com/736x/58/4d/15/584d151c34e2767f013cbcd38a4103cc.jpg" },
    { id: "wh9", name: "Silky Rebond Styling", img: "https://i.pinimg.com/736x/f3/20/ad/f320ad568c178911c0df440181ad0955.jpg" },
    { id: "wh10", name: "Party Glam Hair", img: "https://i.pinimg.com/736x/1f/40/f1/1f40f1ff92767d608252cb554a34ccb5.jpg" },
  ],
  color: [
    { id: "wc1", name: "Global Golden Brown Couture", img: "https://i.pinimg.com/1200x/04/c5/b2/04c5b2b30680f2b5932ca7e6d80f7702.jpg" },
    { id: "wc3", name: "Jet Black", img: "https://i.pinimg.com/1200x/44/46/a2/4446a28a6f30eae2f008d243d6ff460b.jpg" },
    { id: "wc4", name: "Chocolate Brown Luxe", img: "https://i.pinimg.com/1200x/3e/56/86/3e56867afc33e00ee0ca9d5ae850fc0c.jpg" },
    { id: "wc5", name: "Honey Blonde Glow", img: "https://i.pinimg.com/736x/7a/ad/00/7aad00b196e28483ad3b2bc6d5ccd818.jpg" },
    { id: "wc6", name: "Burgundy Wine Finish", img: "https://i.pinimg.com/736x/d3/7f/85/d37f854123209471bdca3ff76040abdc.jpg" },
    { id: "wc7", name: "Ash Grey Smokey", img: "https://i.pinimg.com/1200x/ed/65/ee/ed65eef9616d21b73dea4ebc08bbc43a.jpg" },
    { id: "wc8", name: "Rose Gold Shine", img: "https://i.pinimg.com/736x/e4/0c/b4/e40cb4654373af49b862f4ef2b4fb177.jpg" },
    { id: "wc10", name: "Platinum Ice Blonde", img: "https://i.pinimg.com/736x/c6/ba/ab/c6baab82e30b1b0a520b65a67a0cb932.jpg" },
  ],
  highlights_balayage: [
    { id: "wb1", name: "Balayage Highlights Premium", img: "https://i.pinimg.com/originals/4f/ef/f1/4feff1a0e38a764d93cdbdef21f99a2d.png" },
    { id: "wb2", name: "Caramel Balayage", img: "https://i.pinimg.com/736x/d9/b8/d3/d9b8d3829e277c0d92f00d941409e8f8.jpg" },
    { id: "wb3", name: "Honey Blonde Balayage", img: "https://i.pinimg.com/736x/79/96/9f/79969f6e343085df302aa95acf7366ef.jpg" },
    { id: "wb4", name: "Ash Brown Balayage", img: "https://i.pinimg.com/1200x/b9/f5/85/b9f585a7958223110af3451d55e0181a.jpg" },
  ],
  spa: [
    { id: "ws1", name: "Deep Nourishing Keratin Spa", img: "https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=600" },
    { id: "ws2", name: "Advanced Scalp Therapy", img: "https://res.klook.com/image/upload/w_750,h_469,c_fill,q_85/activities/fchn5h7dfr2mmbbw3nq4.jpg?w=600" },
    { id: "ws3", name: "Luxury Hair Rejuvenation Spa", img: "https://i.pinimg.com/736x/50/8a/b7/508ab7b56e410e7701cb056e4e6a027a.jpg" },
    { id: "ws4", name: "Argan Oil Smoothening", img: "https://i.pinimg.com/1200x/3e/e4/36/3ee4366fbe905d991236d88793e799c8.jpg" },
    { id: "ws5", name: "Protein Repair Hair Spa", img: "https://i.pinimg.com/236x/4c/1a/43/4c1a430b006b6fdd7e4625c56bc27c07.jpg" },
    { id: "ws6", name: "Anti-Dandruff Detox", img: "https://i.pinimg.com/736x/7e/ce/a3/7ecea3ac6a931c1c172f8b96a5c8b4a0.jpg" },
  ],
  keratin_smoothing: [
    { id: "wk1", name: "Keratin Smoothing Treatment", img: "https://i.pinimg.com/1200x/2f/b8/72/2fb8722cd56fc94c01424fa12785641e.jpg" },
    { id: "wk2", name: "Luxury Keratin Rejuvenation", img: "https://i.pinimg.com/1200x/3e/56/86/3e56867afc33e00ee0ca9d5ae850fc0c.jpg" },
    { id: "wk3", name: "Premium Brazilian Blowout", img: "https://i.pinimg.com/1200x/86/55/da/8655da48743eeb8a7d6418ffdc8104ca.jpg" },
    { id: "wk4", name: "Silky Smooth Keratin Finish", img: "https://i.pinimg.com/1200x/79/1b/d4/791bd40e7756ad08631dbb79b6600e95.jpg" },
  ],
  haircut: [
    { id: "hc1", name: "Premium Mid Fade", img: "https://i.pinimg.com/1200x/3d/f3/ea/3df3ea1f0e7d4a6ab894ebb1e0c8865f.jpg" },
    { id: "hc2", name: "Luxury Textured Crop", img: "https://i.pinimg.com/736x/b3/ea/18/b3ea185ab96b4a271553798a00c14831.jpg" },
    { id: "hc3", name: "Classic Taper Fade", img: "https://i.pinimg.com/736x/54/85/53/548553592ddd5d7b8e0e7d5343b5a2f5.jpg" },
    { id: "hc4", name: "Modern Pompadour Style", img: "https://i.pinimg.com/1200x/0b/26/91/0b269149af68bb40573fe09be9eb8931.jpg" },
    { id: "hc5", name: "Luxury Slick Back", img: "https://i.pinimg.com/736x/9a/63/a5/9a63a518f58d46f62a456454dc79261c.jpg" },
    { id: "hc7", name: "High & Tight Military Fade", img: "https://i.pinimg.com/1200x/54/c3/ff/54c3fff8470d25cd040d72e876999d49.jpg" },
    { id: "hc8", name: "Messy Quiff Style", img: "https://i.pinimg.com/736x/be/de/12/bede12391e3193808afd86fccb518cc3.jpg" },
    { id: "hc9", name: "Modern Buzz Cut", img: "https://i.pinimg.com/736x/65/06/1f/65061fae181be208c1c9a452882568ed.jpg" },
  ],
  skin_fade: [
    { id: "sf1", name: "High Skin Fade Drop", img: "https://i.pinimg.com/736x/86/3c/0d/863c0ddfb402f94c7ed11d91ad0c438e.jpg" },
    { id: "sf2", name: "Mid Skin Fade with Crop Top", img: "https://i.pinimg.com/1200x/ad/ab/19/adab19435d74cd2ba6f7cd13bf25c45c.jpg" },
    { id: "sf3", name: "Low Skin Fade Blend", img: "https://i.pinimg.com/1200x/49/57/c0/4957c018732cfb85f921295da1a84380.jpg" },
    { id: "sf4", name: "Skin Fade Pompadour Luxe", img: "https://i.pinimg.com/736x/31/e5/e0/31e5e0c6f5a3c8202d89867e8a665e1b.jpg" },
  ],
  beard: [
    { id: "bd1", name: "Sharp Lineup & Fade", img: "https://i.pinimg.com/736x/26/f0/df/26f0dff49dcde4fb06d9161351eefb7a.jpg" },
    { id: "bd2", name: "Royal Beard Sculpt", img: "https://i.pinimg.com/1200x/a8/6d/5c/a86d5c56f775b111272b8a095db82135.jpg" },
    { id: "bd3", name: "Premium Full Beard Trim", img: "https://i.pinimg.com/736x/53/68/da/5368da011515917a966738b72d79b40d.jpg" },
    { id: "bd4", name: "Luxury Beard Fade", img: "https://i.pinimg.com/736x/12/51/e5/1251e51301afa8100a459e41e1eb8acc.jpg" },
  ],
  hot_towel_shave: [
    { id: "ht1", name: "Hot Towel Royal Shave", img: "https://i.pinimg.com/736x/af/11/fc/af11fce5bd7c0ae9183ac57558aa5472.jpg" },
    { id: "ht2", name: "Classic Hot Towel Shave", img: "https://i.pinimg.com/1200x/67/a3/74/67a374a79533ce703f034ce17b02c804.jpg" },
    { id: "ht3", name: "Luxury Foam & Towel Shave", img: "https://i.pinimg.com/1200x/83/17/75/831775720cb642376ee34c64ada61202.jpg" },
  ],
  scalp_revitalize: [
    { id: "sr1", name: "Scalp Revitalize Therapy", img: "https://images.unsplash.com/photo-1517832606299-7ae9b720a186?w=600" },
    { id: "sr2", name: "Premium Scalp Detox", img: "https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=600" },
    { id: "sr3", name: "Luxury Hair & Scalp Rejuvenation", img: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=600" },
  ],
  default: [
    { id: "df1", name: "Signature Salon Ritual", img: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=600" },
    { id: "df2", name: "Premium Hair Spa Experience", img: "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=600" },
    { id: "df3", name: "Luxury Grooming Session", img: "https://images.unsplash.com/photo-1517832606299-7ae9b720a186?w=600" },
  ],
};

function getCategory(service, gender) {
  if (!service) return "default";
  if (gender === "men") {
    const n = service.name?.toLowerCase() || "";
    if (n.includes("fade")) return "skin_fade";
    if (n.includes("beard")) return "beard";
    if (n.includes("shave")) return "hot_towel_shave";
    if (n.includes("scalp")) return "scalp_revitalize";
    return "haircut";
  }
  if (gender === "women") {
    const cat  = service.category?.toLowerCase() || "";
    const name = service.name?.toLowerCase() || "";
    if (cat === "color") return "color";
    if (cat === "spa")   return "spa";
    if (name.includes("keratin")) return "keratin_smoothing";
    return "styling";
  }
  return "default";
}

/* ─── LOOK CARD ─────────────────────────────────────────────── */
function LookCard({ look, isSelected, onSelect, index, visible }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => onSelect(look)}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0) scale(1)" : "translateY(24px) scale(0.98)",
        transition: `opacity 0.45s ease ${index * 55}ms, transform 0.45s ease ${index * 55}ms, box-shadow 0.3s, border-color 0.3s`,
        borderRadius: 16,
        overflow: "hidden",
        border: isSelected ? "2px solid #C5A059" : `1.5px solid ${hovered ? "#C5A05966" : "#EAE0D0"}`,
        boxShadow: isSelected
          ? "0 0 0 4px rgba(197,160,89,0.12), 0 16px 40px rgba(197,160,89,0.15)"
          : hovered ? "0 12px 32px rgba(44,36,30,0.08)" : "0 2px 10px rgba(44,36,30,0.03)",
        cursor: "pointer",
        position: "relative",
        background: "#EDE8E0",
      }}
    >
      {/* image */}
      <div style={{ position: "relative", height: 300, overflow: "hidden" }}>
        <img
          src={look.img}
          alt={look.name}
          loading="lazy"
          style={{
            width: "100%", height: "100%", objectFit: "cover",
            transform: hovered || isSelected ? "scale(1.06)" : "scale(1)",
            transition: "transform 0.65s ease",
          }}
        />
        {/* gradient */}
        <div style={{ position: "absolute", inset: 0, background: isSelected ? "rgba(0,0,0,0.35)" : "linear-gradient(to bottom, rgba(0,0,0,0) 45%, rgba(15,10,5,0.85) 100%)", transition: "background 0.3s" }} />

        {/* selected check */}
        {isSelected && (
          <div style={{
            position: "absolute", top: 12, right: 12,
            width: 30, height: 30, borderRadius: "50%",
            background: "#C5A059",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 2px 8px rgba(197,160,89,0.5)",
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
        )}

        {/* name overlay */}
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "14px 16px 16px" }}>
          <p style={{ fontFamily: "'Montserrat',sans-serif", fontSize: 9, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#C5A059", margin: "0 0 3px" }}>Style Template</p>
          <h4 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 18, fontWeight: 400, color: "#fff", margin: 0, lineHeight: 1.2, transition: "color 0.3s" }}>
            {look.name}
          </h4>
        </div>
      </div>
    </div>
  );
}

/* ─── MAIN PAGE ─────────────────────────────────────────────── */
export default function SelectLook() {
  const location = useLocation();
  const navigate  = useNavigate();

  const selectedService = location.state?.service;
  const selectedBarber  = location.state?.barber;
  const gender          = location.state?.gender || "men";

  const [selectedLook,  setSelectedLook]  = useState(null);
  const [searchQuery,   setSearchQuery]   = useState("");
  const [visibleCards,  setVisibleCards]  = useState(new Set());
  const cardRefs = useRef({});

  const category = getCategory(selectedService, gender);
  const allLooks = LOOKS_DB[category] || LOOKS_DB.default;

  const filteredLooks = allLooks.filter((l) =>
    l.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    const salonId = localStorage.getItem("selectedSalonId");
    if (!salonId) {
      navigate("/nearby");
    }
  }, [navigate]);

  useEffect(() => { window.scrollTo(0, 0); }, []);

  useEffect(() => {
    setVisibleCards(new Set());
    const observers = [];
    const t = setTimeout(() => {
      Object.entries(cardRefs.current).forEach(([id, el]) => {
        if (!el) return;
        const obs = new IntersectionObserver(([entry]) => {
          if (entry.isIntersecting) { setVisibleCards((p) => new Set([...p, id])); obs.disconnect(); }
        }, { threshold: 0.06 });
        obs.observe(el);
        observers.push(obs);
      });
    }, 60);
    return () => { clearTimeout(t); observers.forEach((o) => o.disconnect()); };
  }, [searchQuery]);

  const handleContinue = () => {
    if (!selectedLook) return;
    navigate("/customer/details", { state: { service: selectedService, barber: selectedBarber, look: selectedLook, gender } });
  };

  const catLabel = category.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <>
    <Navbar />
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;0,700;1,300;1,400&family=Montserrat:wght@300;400;500;600;700&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        ::selection { background: #C5A059; color: #fff; }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: #FAF6F0; }
        ::-webkit-scrollbar-thumb { background: #C5A059; border-radius: 3px; }
      `}</style>

      <div style={{ background: "#FAF6F0", minHeight: "100vh", fontFamily: "'Cormorant Garamond',serif", color: "#2C241E", paddingBottom: 120 }}>

        {/* ── BACK BUTTON ── */}
        <div className="absolute top-[72px] left-5 md:top-[88px] md:left-5 z-[9999]">
          <button
            onClick={() => navigate(-1)}
            style={{ width: 44, height: 44, borderRadius: "50%", border: "none", background: "rgba(255,255,255,0.95)", backdropFilter: "blur(12px)", cursor: "pointer", fontSize: 18, boxShadow: "0 4px 20px rgba(0,0,0,0.12)", transition: "all 0.3s", display: "flex", alignItems: "center", justifyItems: "center", justifyContent: "center", color: "#2C241E" }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "#C5A059"; e.currentTarget.style.color = "#fff"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.95)"; e.currentTarget.style.color = "#2C241E"; }}
          >←</button>
        </div>

        {/* ── HERO ── */}
        <div className="relative h-[400px] overflow-hidden mt-[56px] md:mt-[72px]">
          <div style={{ position: "absolute", inset: 0, backgroundImage: "url('https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=1600&q=80')", backgroundSize: "cover", backgroundPosition: "center", filter: "brightness(0.3)" }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(20,14,8,0.8))" }} />

          <div style={{ position: "absolute", inset: 0, zIndex: 5, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "0 24px" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 10, border: "1px solid rgba(197,160,89,0.45)", borderRadius: 40, padding: "5px 18px", marginBottom: 20, background: "rgba(0,0,0,0.25)" }}>
              <span style={{ fontFamily: "'Montserrat',sans-serif", fontSize: 9, fontWeight: 700, letterSpacing: "0.28em", textTransform: "uppercase", color: "#C5A059" }}>Step 03 — Lookbook Selection</span>
            </div>
            <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontWeight: 300, color: "#fff", fontSize: "clamp(36px,5vw,64px)", lineHeight: 1.05, margin: "0 0 10px" }}>
              Choose Your{" "}
              <em style={{ fontStyle: "italic", color: "#C5A059", fontWeight: 400 }}>Desired Look</em>
            </h1>
            <div style={{ width: 56, height: 1, background: "linear-gradient(to right, transparent, #C5A059, transparent)", margin: "14px auto 18px" }} />
            <p style={{ fontFamily: "'Montserrat',sans-serif", fontSize: 13, fontWeight: 300, color: "rgba(255,255,255,0.55)", maxWidth: 420, lineHeight: 1.8 }}>
              Browse our curated lookbook. Your stylist{selectedBarber ? `, ${selectedBarber.name},` : ""} will craft this exact look for you.
            </p>
          </div>

          <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 80, background: "linear-gradient(to bottom, transparent, #FAF6F0)", zIndex: 6 }} />
        </div>

        {/* ── MAIN CONTENT ── */}
        <div className="max-w-[1280px] mx-auto px-4 md:px-8 py-6 md:py-10">

          {/* ── CONTEXT STRIP ── */}
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 28, flexWrap: "wrap" }}>
            {/* service chip */}
            {selectedService && (
              <div style={{ display: "flex", alignItems: "center", gap: 10, background: "#fff", border: "1px solid #EAE0D0", borderRadius: 12, padding: "8px 14px" }}>
                <div style={{ width: 36, height: 36, borderRadius: 8, overflow: "hidden", background: "#EDE8E0", flexShrink: 0 }}>
                  <img src={selectedService.img || "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=80"} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
                <div>
                  <p style={{ fontFamily: "'Montserrat',sans-serif", fontSize: 9, color: "#AAA", textTransform: "uppercase", letterSpacing: "0.12em", margin: 0 }}>Ritual</p>
                  <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 15, fontWeight: 600, color: "#2C241E", margin: 0 }}>{selectedService.name}</p>
                </div>
              </div>
            )}

            {/* barber chip */}
            {selectedBarber && (
              <div style={{ display: "flex", alignItems: "center", gap: 10, background: "#fff", border: "1px solid #EAE0D0", borderRadius: 12, padding: "8px 14px" }}>
                <img src={selectedBarber.img} alt="" style={{ width: 36, height: 36, borderRadius: "50%", objectFit: "cover", border: "2px solid #C5A059" }} />
                <div>
                  <p style={{ fontFamily: "'Montserrat',sans-serif", fontSize: 9, color: "#AAA", textTransform: "uppercase", letterSpacing: "0.12em", margin: 0 }}>Stylist</p>
                  <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 15, fontWeight: 600, color: "#2C241E", margin: 0 }}>{selectedBarber.name}</p>
                </div>
              </div>
            )}

            {/* category chip */}
            <div style={{ display: "flex", alignItems: "center", gap: 8, background: "#FFF3DC", border: "1px solid #E8C84B60", borderRadius: 12, padding: "8px 14px" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#C5A059" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
              <p style={{ fontFamily: "'Montserrat',sans-serif", fontSize: 11, fontWeight: 700, color: "#8A6A10", margin: 0 }}>{catLabel} Catalogue</p>
            </div>
          </div>

          {/* ── SEARCH + COUNT BAR ── */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24, gap: 16, flexWrap: "wrap" }}>
            <p style={{ fontFamily: "'Montserrat',sans-serif", fontSize: 13, color: "#888", margin: 0 }}>
              Showing <strong style={{ color: "#2C241E" }}>{filteredLooks.length}</strong> of {allLooks.length} looks
            </p>
            {/* search */}
            <div style={{ position: "relative", width: 280 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#C5A059" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}>
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search looks…"
                style={{ width: "100%", padding: "9px 12px 9px 34px", borderRadius: 10, border: "1px solid #DDD4C4", background: "#fff", fontFamily: "'Montserrat',sans-serif", fontSize: 12, color: "#2C241E", outline: "none" }}
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery("")} style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", fontSize: 14, color: "#AAA" }}>✕</button>
              )}
            </div>
          </div>

          {/* ── LOOKBOOK GRID ── */}
          {filteredLooks.length === 0 ? (
            <div style={{ textAlign: "center", padding: "80px 20px", background: "#fff", borderRadius: 16, border: "1px dashed #DDD4C4", marginBottom: 32 }}>
              <div style={{ fontSize: 32, marginBottom: 12 }}>✦</div>
              <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 20, color: "#8A7060", margin: "0 0 8px" }}>No looks found</p>
              <button onClick={() => setSearchQuery("")} style={{ padding: "10px 28px", background: "#2C241E", color: "#fff", border: "none", borderRadius: 8, fontSize: 11, fontFamily: "'Montserrat',sans-serif", letterSpacing: "0.1em", textTransform: "uppercase", cursor: "pointer" }}>Clear Search</button>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 20, marginBottom: 32 }}>
              {filteredLooks.map((look, i) => (
                <div key={look.id} ref={(el) => (cardRefs.current[look.id] = el)}>
                  <LookCard
                    look={look}
                    index={i}
                    visible={visibleCards.has(look.id)}
                    isSelected={selectedLook?.id === look.id}
                    onSelect={setSelectedLook}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── STICKY BOTTOM BAR ── */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#EAE0D0] shadow-[0_-8px_32px_rgba(44,36,30,0.07)] z-50 p-4 md:px-8">
          <div className="max-w-[1280px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 w-full">
            {/* left: selected look preview */}
            <div className="flex items-center gap-3.5 min-w-0 w-full sm:w-auto justify-start">
              {selectedLook ? (
                <>
                  <div style={{ width: 48, height: 48, borderRadius: 10, overflow: "hidden", border: "2px solid #C5A059", flexShrink: 0 }}>
                    <img src={selectedLook.img} alt={selectedLook.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <p style={{ fontFamily: "'Montserrat',sans-serif", fontSize: 9, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "#AAA", margin: "0 0 2px" }}>Selected Look</p>
                    <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 18, fontWeight: 600, color: "#2C241E", margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: 280 }}>{selectedLook.name}</p>
                  </div>
                  <button
                    onClick={() => setSelectedLook(null)}
                    style={{ flexShrink: 0, background: "none", border: "none", cursor: "pointer", color: "#CCC", fontSize: 16, padding: "2px 6px" }}
                    title="Clear selection"
                  >✕</button>
                </>
              ) : (
                <p style={{ fontFamily: "'Montserrat',sans-serif", fontSize: 13, color: "#AAA", fontStyle: "italic", margin: 0 }}>
                  Select a look from the catalogue above to continue…
                </p>
              )}
            </div>

            {/* right: CTA */}
            <button
              onClick={handleContinue}
              disabled={!selectedLook}
              className="w-full sm:w-auto justify-center"
              style={{
                flexShrink: 0,
                padding: "14px 36px",
                borderRadius: 10,
                border: "none",
                background: selectedLook ? "#C5A059" : "#E5DDD0",
                color: selectedLook ? "#fff" : "#B0A898",
                fontFamily: "'Montserrat',sans-serif",
                fontWeight: 700,
                fontSize: 11,
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                cursor: selectedLook ? "pointer" : "not-allowed",
                transition: "background 0.25s, color 0.25s",
                display: "flex", alignItems: "center", gap: 8,
              }}
              onMouseEnter={(e) => { if (selectedLook) e.currentTarget.style.background = "#2C241E"; }}
              onMouseLeave={(e) => { if (selectedLook) e.currentTarget.style.background = "#C5A059"; }}
            >
              Continue to Booking Details →
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
