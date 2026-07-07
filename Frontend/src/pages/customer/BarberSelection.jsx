import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import SalonSelectorBar from "../../components/salon/SalonSelectorBar";
import { SlidersHorizontal, X } from "lucide-react";

/* ─── DATA ─────────────────────────────────────────────────── */
// (Unused static BARBERS array removed; real barbers are fetched from database in useEffect)

/* ─── HELPERS ───────────────────────────────────────────────── */
const fitsAnyPredefinedSpec = (name) => {
  const n = name.toLowerCase();
  const isBeard = n.includes("beard") || n.includes("shave") || n.includes("mustache");
  
  const matchHaircut = !isBeard && (n.includes("cut") || n.includes("fade") || n.includes("style") || n.includes("blow") || n.includes("wash"));
  if (matchHaircut) return true;
  if (isBeard) return true;
  
  const matchSpa = !isBeard && (n.includes("spa") || n.includes("treatment") || n.includes("oil") || n.includes("mask"));
  if (matchSpa) return true;
  
  const matchColor = !isBeard && (n.includes("color") || n.includes("highlight") || n.includes("glaze"));
  if (matchColor) return true;
  
  const matchFacial = n.includes("facial") || n.includes("massage") || n.includes("detox");
  if (matchFacial) return true;
  
  return false;
};

const fitsStandardCategory = (name, spec) => {
  const n = name.toLowerCase();
  const isBeard = n.includes("beard") || n.includes("shave") || n.includes("mustache");
  if (spec === "haircut & styling") return !isBeard && (n.includes("cut") || n.includes("fade") || n.includes("style") || n.includes("blow") || n.includes("wash"));
  if (spec === "beard sculpting & shave") return isBeard;
  if (spec === "hair spa & treatment") return !isBeard && (n.includes("spa") || n.includes("treatment") || n.includes("oil") || n.includes("mask"));
  if (spec === "hair coloring & highlights") return !isBeard && (n.includes("color") || n.includes("highlight") || n.includes("glaze"));
  if (spec === "facial & grooming massage") return n.includes("facial") || n.includes("massage") || n.includes("detox");
  return false;
};

const PREDEFINED_SPECS = [
  "haircut & styling",
  "beard sculpting & shave",
  "hair spa & treatment",
  "hair coloring & highlights",
  "facial & grooming massage",
  "ayurvedic head massage",
  "all-rounder master stylist"
];

const doesServiceMatchSpecs = (serviceName, specs) => {
  if (!serviceName || specs.length === 0) return true;
  const sName = serviceName.toLowerCase();
  const normalizedSpecs = specs.map(s => s.toLowerCase());
  
  // All-rounder matches everything
  if (normalizedSpecs.some(s => s.includes("all-rounder") || s.includes("master stylist"))) return true;
  
  // Check for semantic matches between service name and each specialty
  return normalizedSpecs.some(spec => {
    // 1. Direct containment
    if (sName.includes(spec) || spec.includes(sName)) return true;
    
    // 2. Keyword overlap
    const massageMatch = (sName.includes("massage") || sName.includes("facial")) && (spec.includes("massage") || spec.includes("facial"));
    const shaveMatch = (sName.includes("shave") || sName.includes("beard") || sName.includes("mustache")) && (spec.includes("shave") || spec.includes("beard") || spec.includes("sculpting"));
    const hairSpaMatch = (sName.includes("spa") || sName.includes("treatment") || sName.includes("oil") || sName.includes("mask")) && (spec.includes("spa") || spec.includes("treatment") || spec.includes("oil") || spec.includes("head massage"));
    const haircutMatch = (sName.includes("cut") || sName.includes("fade") || sName.includes("style") || sName.includes("hair")) && (spec.includes("cut") || spec.includes("styling") || spec.includes("haircut") || spec.includes("hair"));
    const colorMatch = (sName.includes("color") || sName.includes("highlight") || sName.includes("dye") || sName.includes("bleach")) && (spec.includes("color") || spec.includes("highlight") || spec.includes("styling"));
    
    if (massageMatch || shaveMatch || hairSpaMatch || haircutMatch || colorMatch) return true;
    
    // 3. Fallback: split words and look for common meaningful terms
    const sWords = sName.split(/\s+/).filter(w => w.length > 3 && w !== "with" && w !== "from");
    const specWords = spec.split(/\s+/).filter(w => w.length > 3 && w !== "with" && w !== "from");
    return sWords.some(w => specWords.some(sw => sw.includes(w) || w.includes(sw)));
  });
};
function Stars({ rating }) {
  return (
    <div style={{ display: "flex", gap: 2 }}>
      {[1, 2, 3, 4, 5].map((s) => (
        <svg key={s} width="11" height="11" viewBox="0 0 12 12" fill="none">
          <polygon
            points="6,1 7.5,4.5 11,4.5 8.5,7 9.5,11 6,8.5 2.5,11 3.5,7 1,4.5 4.5,4.5"
            fill={s <= Math.round(rating) ? "#C5A059" : "none"}
            stroke={s <= Math.round(rating) ? "#C5A059" : "#C5A05966"}
            strokeWidth="0.8"
          />
        </svg>
      ))}
    </div>
  );
}

/* ─── BARBER CARD ───────────────────────────────────────────── */
function BarberCard({ b, isSelected, onSelect, index, visible }) {
  const [hovered, setHovered] = useState(false);
  const isBusy = b.status === "Busy";
  const isOnBreak = b.status === "On Break";
  const isOffline = b.status === "Offline";
  const isUnavailable = isOnBreak || isOffline;
  const active = isSelected || hovered;

  return (
    <div
      onMouseEnter={() => !isUnavailable && setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => !isUnavailable && onSelect(b)}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(28px)",
        transition: `opacity 0.5s ease ${index * 100}ms, transform 0.5s ease ${index * 100}ms, box-shadow 0.3s ease, border-color 0.3s ease`,
        background: "#fff",
        borderRadius: 20,
        overflow: "hidden",
        border: isSelected ? "2px solid #C5A059" : `1.5px solid ${hovered && !isUnavailable ? "#C5A05966" : "#EAE0D0"}`,
        boxShadow: isSelected
          ? "0 20px 48px rgba(197,160,89,0.14)"
          : hovered && !isUnavailable
          ? "0 16px 40px rgba(44,36,30,0.09)"
          : "0 2px 12px rgba(44,36,30,0.03)",
        cursor: isUnavailable ? "not-allowed" : "pointer",
        display: "flex",
        flexDirection: "column",
        position: "relative",
      }}
    >
      {/* selected ribbon */}
      {isSelected && (
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: "linear-gradient(to right, #C5A059, #E8D5A3, #C5A059)", zIndex: 10 }} />
      )}

      {/* image */}
      <div style={{ position: "relative", height: 240, overflow: "hidden", background: "#EDE8E0" }}>
        <img
          src={b.img}
          alt={b.name}
          loading="lazy"
          style={{
            width: "100%", height: "100%", objectFit: "cover",
            filter: isUnavailable ? "grayscale(40%) brightness(0.9)" : "none",
            transform: active && !isUnavailable ? "scale(1.06)" : "scale(1)",
            transition: "transform 0.6s ease, filter 0.3s",
          }}
        />
        {/* gradient */}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(0,0,0,0) 50%, rgba(20,14,8,0.5) 100%)" }} />

        {/* status badge */}
        <span style={{
          position: "absolute", top: 14, right: 14,
          background: isBusy ? "rgba(251,191,36,0.15)" : (isOnBreak || isOffline) ? "rgba(239, 68, 68, 0.12)" : "rgba(16,185,129,0.12)",
          border: `1px solid ${isBusy ? "rgba(251,191,36,0.4)" : (isOnBreak || isOffline) ? "rgba(239, 68, 68, 0.35)" : "rgba(16,185,129,0.35)"}`,
          color: isBusy ? "#B45309" : (isOnBreak || isOffline) ? "#991B1B" : "#065F46",
          fontSize: 10, fontFamily: "'Montserrat',sans-serif", fontWeight: 700,
          letterSpacing: "0.08em", textTransform: "uppercase",
          padding: "4px 11px", borderRadius: 20, backdropFilter: "blur(8px)",
        }}>
          {b.status}
        </span>

        {/* name overlay */}
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "16px 20px 14px" }}>
          <p style={{ fontFamily: "'Montserrat',sans-serif", fontSize: 9, letterSpacing: "0.2em", textTransform: "uppercase", color: "#C5A059", fontWeight: 600, margin: "0 0 2px" }}>{b.role}</p>
          <h3 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 24, fontWeight: 400, color: "#fff", margin: 0, lineHeight: 1.1 }}>{b.name}</h3>
        </div>
      </div>

      {/* body */}
      <div style={{ padding: "18px 20px 20px", flex: 1, display: "flex", flexDirection: "column", gap: 14 }}>

        {/* rating + meta */}
        <div style={{ display: "flex", alignItems: "center", justifycontent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <Stars rating={b.rating} />
            <span style={{ fontFamily: "'Montserrat',sans-serif", fontSize: 12, fontWeight: 700, color: "#2C241E" }}>{b.rating}</span>
            <span style={{ fontFamily: "'Montserrat',sans-serif", fontSize: 11, color: "#AAA" }}>({b.reviews})</span>
          </div>
          <div style={{ display: "flex", gap: 12 }}>
            {[`${b.experience}`, `${b.distance} km`].map((v, i) => (
              <span key={i} style={{ fontFamily: "'Montserrat',sans-serif", fontSize: 11, color: "#888" }}>{v}</span>
            ))}
          </div>
        </div>

        {/* specialties */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {b.specialties.map((sp) => (
            <span key={sp} style={{ fontFamily: "'Montserrat',sans-serif", fontSize: 10, fontWeight: 500, letterSpacing: "0.05em", color: "#8A6A10", background: "#FFF3DC", border: "1px solid #E8C84B60", borderRadius: 20, padding: "3px 10px" }}>
              {sp}
            </span>
          ))}
        </div>

        {/* AI wait panel */}
        <div style={{ background: "#FAF6F0", border: "1px solid #EAE0D0", borderRadius: 12, padding: "12px 14px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8, paddingBottom: 8, borderBottom: "1px solid #EAE0D0" }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#C5A059" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
            <span style={{ fontFamily: "'Montserrat',sans-serif", fontSize: 9, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: "#2C241E" }}>AI Wait Engine</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {[
              { label: "Queue", val: `${b.aiWait.queue} guests` },
              { label: "Avg pace", val: b.aiWait.pace },
            ].map((row) => (
              <div key={row.label} style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontFamily: "'Montserrat',sans-serif", fontSize: 11, color: "#AAA" }}>{row.label}</span>
                <span style={{ fontFamily: "'Montserrat',sans-serif", fontSize: 11, fontWeight: 600, color: "#2C241E" }}>{row.val}</span>
              </div>
            ))}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 6, borderTop: "1px dashed #DDD4C4", marginTop: 2 }}>
              <span style={{ fontFamily: "'Montserrat',sans-serif", fontSize: 11, color: "#AAA" }}>Est. wait</span>
              <span style={{
                fontFamily: "'Cormorant Garamond',serif", fontSize: 15, fontWeight: 700,
                color: isBusy ? "#B45309" : (isOnBreak || isOffline) ? "#991B1B" : "#065F46",
                background: isBusy ? "#FFF8EC" : (isOnBreak || isOffline) ? "#FEF2F2" : "#ECFDF5",
                padding: "2px 10px", borderRadius: 6,
              }}>
                {b.aiWait.wait}
              </span>
            </div>
          </div>
        </div>

        {/* CTA */}
        {isUnavailable ? (
          <button disabled style={{ width: "100%", padding: "12px 0", borderRadius: 10, border: "none", background: "#F5F0EA", color: "#C0B8B0", fontFamily: "'Montserrat',sans-serif", fontWeight: 700, fontSize: 10, letterSpacing: "0.16em", textTransform: "uppercase", cursor: "not-allowed" }}>
            {b.status === "Busy" ? "Fully Booked Today" : b.status === "On Break" ? "Stylist On Break" : "Stylist Offline"}
          </button>
        ) : (
          <button
            onClick={(e) => { e.stopPropagation(); onSelect(b); }}
            style={{
              width: "100%", padding: "12px 0", borderRadius: 10,
              border: isSelected ? "none" : "1.5px solid #2C241E",
              background: isSelected ? "#C5A059" : "transparent",
              color: isSelected ? "#fff" : "#2C241E",
              fontFamily: "'Montserrat',sans-serif", fontWeight: 700,
              fontSize: 10, letterSpacing: "0.16em", textTransform: "uppercase",
              cursor: "pointer", transition: "all 0.25s ease",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
            }}
            onMouseEnter={(e) => { if (!isSelected) { e.currentTarget.style.background = "#2C241E"; e.currentTarget.style.color = "#F5EFE0"; } }}
            onMouseLeave={(e) => { if (!isSelected) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#2C241E"; } }}
          >
            {isSelected ? "✓  Artist Selected" : "Request Artist →"}
          </button>
        )}
      </div>
    </div>
  );
}

const BARBER_IMAGES = [
  "https://i.pinimg.com/1200x/8d/21/29/8d2129c8a618f113eb8aa2bc596b1658.jpg",
  "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=400",
  "https://images.unsplash.com/photo-1605497788044-5a32c7078486?w=400",
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400"
];

const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

/* ─── MAIN PAGE ─────────────────────────────────────────────── */
export default function BarberSelection() {
  const location  = useLocation();
  const navigate  = useNavigate();

  const selectedService = location.state?.service;
  const gender          = location.state?.gender || "men";

  const [selectedBarber, setSelectedBarber] = useState(null);
  const [searchQuery,    setSearchQuery]     = useState("");
  const [minRating,      setMinRating]       = useState(0);
  const [maxDistance,    setMaxDistance]     = useState(20);
  const [showAll,        setShowAll]         = useState(true);
  const [visibleCards,   setVisibleCards]    = useState(new Set());
  const [showFilters,    setShowFilters]     = useState(false);
  const cardRefs = useRef({});

  const [barbersList,    setBarbersList]     = useState([]);
  const [loading,        setLoading]         = useState(true);
  const [salonId,        setSalonId]         = useState(localStorage.getItem("selectedSalonId") || "");
  const [salonName,      setSalonName]       = useState(localStorage.getItem("selectedSalonName") || "");
  const [hasSalon,       setHasSalon]        = useState(!!localStorage.getItem("selectedSalonId"));

  useEffect(() => {
    const storedSalonId = localStorage.getItem("selectedSalonId");
    if (!storedSalonId) {
      navigate("/nearby");
    }
  }, [navigate]);

  useEffect(() => {
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, []);

  useEffect(() => {
    if (!loading) {
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;

      const timer = setTimeout(() => {
        window.scrollTo(0, 0);
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [loading]);

  useEffect(() => {
    const handleStorageChange = () => {
      const currentSalonId = localStorage.getItem("selectedSalonId") || "";
      const currentSalonName = localStorage.getItem("selectedSalonName") || "";
      setSalonId(currentSalonId);
      setSalonName(currentSalonName);
      setHasSalon(!!currentSalonId);
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  useEffect(() => {
    const fetchBarbers = async () => {
      setLoading(true);
      if (!salonId) {
        // No selected salon ID found yet (user will select one via the UI)
        setHasSalon(false);
        setBarbersList([]);
        setLoading(false);
        return;
      }
      setHasSalon(true);
      try {
        const res = await fetch(`${API}/barber/salon/${salonId}`);
        const data = await res.json();
        if (data.success && data.barbers) {
          const mapped = data.barbers.map((b, index) => {
            const specs = b.specialization
              ? b.specialization.split(",").map(s => s.trim()).filter(Boolean)
              : ["Haircut", "Styling"];
              
            let status = "Available";
            if (b.status === "busy") status = "Busy";
            else if (b.status === "break") status = "On Break";
            else if (b.status === "offline") status = "Offline";

            const queueCount = b.queue_count || 0;
            let aiWait = { queue: 0, pace: "15 mins/cut", wait: "Ready Now" };

            if (b.status === "busy") {
              aiWait = { queue: queueCount, pace: "20 mins/cut", wait: queueCount > 0 ? `~${queueCount * 20} mins` : "Ready Now" };
            } else if (b.status === "break") {
              aiWait = { queue: 0, pace: "15 mins/cut", wait: "On Break" };
            } else if (b.status === "offline") {
              aiWait = { queue: 0, pace: "—", wait: "Offline" };
            } else if (queueCount > 0) {
              aiWait = { queue: queueCount, pace: "20 mins/cut", wait: `~${queueCount * 20} mins` };
            }

            return {
              id: b._id,
              _id: b._id,
              name: b.name,
              role: b.experience >= 5 ? "Senior Stylist" : "Stylist",
              experience: `${b.experience || 0} yrs`,
              rating: b.rating || 5.0,
              reviews: Math.floor(Math.random() * 80) + 20,
              status: status,
              distance: Math.floor(Math.random() * 3) + 1,
              specialties: specs,
              img: b.photo || BARBER_IMAGES[index % BARBER_IMAGES.length],
              aiWait: aiWait,
            };
          });
          setBarbersList(mapped);
        }
      } catch (err) {
        console.error("Failed to fetch barbers:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBarbers();
  }, [salonId]);

  useEffect(() => {
    setVisibleCards(new Set());
    const observers = [];
    const t = setTimeout(() => {
      Object.entries(cardRefs.current).forEach(([id, el]) => {
        if (!el) return;
        const obs = new IntersectionObserver(([entry]) => {
          if (entry.isIntersecting) { setVisibleCards((p) => new Set([...p, id])); obs.disconnect(); }
        }, { threshold: 0.08 });
        obs.observe(el);
        observers.push(obs);
      });
    }, 60);
    return () => { clearTimeout(t); observers.forEach((o) => o.disconnect()); };
  }, [searchQuery, minRating, maxDistance, showAll, barbersList]);

  const filtered = barbersList.filter((b) => {
    const q = searchQuery.toLowerCase();
    const matchSearch = b.name.toLowerCase().includes(q) || b.role.toLowerCase().includes(q) || b.specialties.some((s) => s.toLowerCase().includes(q));
    const matchRating = b.rating >= minRating;
    const matchDist   = b.distance <= maxDistance;
    const matchAvail  = showAll || b.status === "Available";
    
    // Filter barbers by customer's selected service specialization
    let matchService = true;
    if (selectedService && selectedService.name) {
      matchService = doesServiceMatchSpecs(selectedService.name, b.specialties);
    }
    
    return matchSearch && matchRating && matchDist && matchAvail && matchService;
  });

  const handleAutoAssign = () => {
    const best = filtered.find((b) => b.status === "Available");
    if (best) setSelectedBarber(best);
  };

  const hasFilters = searchQuery || minRating > 0 || maxDistance < 20 || !showAll;
  const clearFilters = () => { setSearchQuery(""); setMinRating(0); setMaxDistance(20); setShowAll(true); };

  return (
    <>
    <Navbar />
    <SalonSelectorBar />
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;0,700;1,300;1,400&family=Montserrat:wght@300;400;500;600;700&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        ::selection { background: #C5A059; color: #fff; }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: #FAF6F0; }
        ::-webkit-scrollbar-thumb { background: #C5A059; border-radius: 3px; }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>

      <div style={{ background: "#FAF6F0", minHeight: "100vh", fontFamily: "'Cormorant Garamond',serif", color: "#2C241E" }}>

        {/* ── BACK BUTTON ── */}
        {!showFilters && (
          <div className="fixed top-20 left-4 md:top-[88px] md:left-5 z-[9999]">
            <button
              onClick={() => navigate(-1)}
              style={{ width: 44, height: 44, borderRadius: "50%", border: "none", background: "rgba(255,255,255,0.95)", backdropFilter: "blur(12px)", cursor: "pointer", fontSize: 18, boxShadow: "0 4px 20px rgba(0,0,0,0.12)", transition: "all 0.3s", display: "flex", alignItems: "center", justifyItems: "center", justifyContent: "center", color: "#2C241E" }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "#C5A059"; e.currentTarget.style.color = "#fff"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.95)"; e.currentTarget.style.color = "#2C241E"; }}
            >←</button>
          </div>
        )}

        {/* ── HERO ── */}
        <div className="relative h-[260px] sm:h-[280px] md:h-[320px] lg:h-[420px] overflow-hidden">
          <div style={{ position: "absolute", inset: 0, backgroundImage: "url('https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=1600&q=80')", backgroundSize: "cover", backgroundPosition: "center", filter: "brightness(0.32)" }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(20,14,8,0.78))" }} />

          <div style={{ position: "absolute", inset: 0, zIndex: 5, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center" }} className="px-6 md:px-[72px]">
            {/* step badge */}
            <div style={{ display: "inline-flex", alignItems: "center", gap: 10, border: "1px solid rgba(197,160,89,0.45)", borderRadius: 40, padding: "5px 18px", marginBottom: 10, background: "rgba(0,0,0,0.25)" }}>
              <span style={{ fontFamily: "'Montserrat',sans-serif", fontSize: 9, fontWeight: 700, letterSpacing: "0.28em", textTransform: "uppercase", color: "#C5A059" }}>Step 02 — Appointment Allocation</span>
            </div>

            <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontWeight: 300, color: "#fff", fontSize: "clamp(38px,5.5vw,66px)", lineHeight: 1.05, margin: "0 0 10px", letterSpacing: "0.04em" }}>
              Select Your{" "}
              <em style={{ fontStyle: "italic", color: "#C5A059", fontWeight: 400 }}>Stylist</em>
            </h1>
            {salonName && (
              <p style={{ fontFamily: "'Montserrat',sans-serif", fontSize: 14, fontWeight: 600, color: "#C5A059", textTransform: "uppercase", letterSpacing: "0.15em", margin: "10px 0 0" }}>
                At {salonName}
              </p>
            )}
            <div style={{ width: 56, height: 1, background: "linear-gradient(to right, transparent, #C5A059, transparent)", margin: "10px auto" }} />
            <p style={{ fontFamily: "'Montserrat',sans-serif", fontSize: 13, fontWeight: 300, color: "rgba(255,255,255,0.85)", maxWidth: 400, lineHeight: 1.8 }}>
              Our curated professionals are ready to craft your perfect experience.
            </p>
          </div>

          <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "linear-gradient(to bottom, transparent, #FAF6F0)", zIndex: 6 }} className="h-10 md:h-20" />
        </div>

        {/* ── MAIN ── */}
        <div className={`max-w-[1280px] mx-auto px-4 md:px-8 py-6 md:py-10 ${selectedBarber ? "pb-10 sm:pb-10" : ""}`}>

          {/* ── SERVICE CONTEXT STRIP ── */}
          {selectedService && (
            <div style={{ background: "#fff", border: "1px solid #EAE0D0", borderRadius: 16, padding: "14px 20px", marginBottom: 28, display: "flex", alignItems: "center", gap: 16, maxWidth: 560 }}>
              <div style={{ width: 52, height: 52, borderRadius: 10, overflow: "hidden", background: "#EDE8E0", flexShrink: 0 }}>
                <img src={selectedService.img || "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=150"} alt={selectedService.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontFamily: "'Montserrat',sans-serif", fontSize: 9, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#AAA", margin: "0 0 3px" }}>Selected Ritual</p>
                <h4 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 18, fontWeight: 600, color: "#2C241E", margin: "0 0 2px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{selectedService.name}</h4>
                <p style={{ fontFamily: "'Montserrat',sans-serif", fontSize: 13, fontWeight: 700, color: "#C5A059", margin: 0 }}>₹{selectedService.price?.toLocaleString()}</p>
              </div>
              <div style={{ width: 1, height: 40, background: "#EAE0D0" }} />
              <div style={{ textAlign: "right", flexShrink: 0 }}>
                <p style={{ fontFamily: "'Montserrat',sans-serif", fontSize: 9, color: "#AAA", letterSpacing: "0.1em", textTransform: "uppercase", margin: "0 0 3px" }}>Duration</p>
                <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 16, fontWeight: 600, color: "#2C241E", margin: 0 }}>{selectedService.duration || "—"}</p>
              </div>
            </div>
          )}

          {/* ── LAYOUT ── */}
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start">

            {/* Mobile Backdrop */}
            {showFilters && (
              <div 
                className="fixed inset-0 bg-stone-900/60 z-[10000] lg:hidden animate-in fade-in duration-200" 
                onClick={() => setShowFilters(false)}
              />
            )}

            {/* ── SIDEBAR ── */}
            <aside className={`
              shrink-0 lg:w-[240px] lg:sticky lg:top-[90px] lg:mb-0 lg:block
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
                <div style={{ padding: "15px 20px 12px", borderBottom: "1px solid #EAE0D0", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span style={{ fontFamily: "'Montserrat',sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#2C241E" }}>⚙ Filters</span>
                  {hasFilters && <button onClick={clearFilters} style={{ fontFamily: "'Montserrat',sans-serif", fontSize: 10, color: "#C5A059", background: "#FFF8EC", border: "1px solid #E8C84B50", borderRadius: 20, padding: "3px 10px", cursor: "pointer" }}>Clear</button>}
                </div>

                {/* search */}
                <div style={{ padding: "14px 16px", borderBottom: "1px solid #F0E8DA" }}>
                  <p style={{ fontFamily: "'Montserrat',sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "#B0A090", margin: "0 0 8px" }}>Search</p>
                  <div style={{ position: "relative" }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#C5A059" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}>
                      <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                    </svg>
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Name or specialty…"
                      style={{ width: "100%", padding: "8px 10px 8px 30px", borderRadius: 8, border: "1px solid #DDD4C4", background: "#FAFAF8", fontFamily: "'Montserrat',sans-serif", fontSize: 12, color: "#2C241E", outline: "none" }}
                    />
                  </div>
                </div>

                {/* availability */}
                <div style={{ padding: "14px 16px", borderBottom: "1px solid #F0E8DA" }}>
                  <p style={{ fontFamily: "'Montserrat',sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "#B0A090", margin: "0 0 8px" }}>Availability</p>
                  {[{ id: true, label: "All Stylists" }, { id: false, label: "Available Only" }].map((opt) => (
                    <div key={String(opt.id)} onClick={() => setShowAll(opt.id)} style={{ display: "flex", alignItems: "center", gap: 9, padding: "5px 0", cursor: "pointer" }}>
                      <span style={{ width: 16, height: 16, borderRadius: "50%", border: `2px solid ${showAll === opt.id ? "#C5A059" : "#CCC"}`, background: showAll === opt.id ? "#C5A059" : "transparent", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s" }}>
                        {showAll === opt.id && <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#fff" }} />}
                      </span>
                      <span style={{ fontFamily: "'Montserrat',sans-serif", fontSize: 12, color: showAll === opt.id ? "#2C241E" : "#666", fontWeight: showAll === opt.id ? 600 : 400 }}>{opt.label}</span>
                    </div>
                  ))}
                </div>

                {/* min rating */}
                <div style={{ padding: "14px 16px", borderBottom: "1px solid #F0E8DA" }}>
                  <p style={{ fontFamily: "'Montserrat',sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "#B0A090", margin: "0 0 8px" }}>Min Rating</p>
                  {[5, 4, 3, 0].map((r) => (
                    <button key={r} onClick={() => setMinRating(r)} style={{ display: "flex", alignItems: "center", gap: 6, width: "100%", padding: "6px 8px", marginBottom: 2, borderRadius: 8, border: "none", background: minRating === r ? "linear-gradient(135deg,#FFF3DC,#FAEAC5)" : "transparent", cursor: "pointer", textAlign: "left", transition: "background 0.2s" }}
                      onMouseEnter={(e) => { if (minRating !== r) e.currentTarget.style.background = "#FAF6F0"; }}
                      onMouseLeave={(e) => { if (minRating !== r) e.currentTarget.style.background = "transparent"; }}
                    >
                      {r === 0
                        ? <span style={{ fontFamily: "'Montserrat',sans-serif", fontSize: 12, color: "#666" }}>Any</span>
                        : <><Stars rating={r} /><span style={{ fontFamily: "'Montserrat',sans-serif", fontSize: 11, color: "#888" }}>& up</span></>
                      }
                    </button>
                  ))}
                </div>

                {/* max distance */}
                <div style={{ padding: "14px 16px" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                    <p style={{ fontFamily: "'Montserrat',sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "#B0A090", margin: 0 }}>Max Distance</p>
                    <span style={{ fontFamily: "'Montserrat',sans-serif", fontSize: 12, fontWeight: 700, color: "#C5A059" }}>{maxDistance} km</span>
                  </div>
                  <input type="range" min="1" max="20" step="1" value={maxDistance} onChange={(e) => setMaxDistance(Number(e.target.value))} style={{ width: "100%", accentColor: "#C5A059" }} />
                </div>
              </div>
            </aside>

            {/* ── CARDS AREA ── */}
            <div className="flex-1 w-full min-w-0">
              {/* top bar */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20, flexWrap: "wrap", gap: 10 }}>
                <p style={{ fontFamily: "'Montserrat',sans-serif", fontSize: 13, color: "#888", margin: 0 }}>
                  Showing <strong style={{ color: "#2C241E" }}>{filtered.length}</strong> of {barbersList.length} stylists
                  {hasFilters && <button onClick={clearFilters} style={{ marginLeft: 10, fontSize: 11, color: "#C5A059", background: "none", border: "none", cursor: "pointer", fontFamily: "'Montserrat',sans-serif", textDecoration: "underline", padding: 0 }}>Clear all</button>}
                </p>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <button
                    onClick={() => setShowFilters(true)}
                    className="lg:hidden flex items-center justify-center gap-1.5 px-3 py-1.5 border border-[#DDD4C4] rounded-lg bg-white text-[11px] font-bold text-[#2C241E] cursor-pointer hover:bg-stone-50 transition-colors h-9"
                    style={{ fontFamily: "'Montserrat',sans-serif" }}
                  >
                    <SlidersHorizontal size={12} className="text-[#C5A059]" />
                    <span>Filters</span>
                  </button>
                  <button
                    onClick={handleAutoAssign}
                    style={{ display: "flex", alignItems: "center", gap: 8, background: "#2C241E", color: "#F5EFE0", border: "none", borderRadius: 10, padding: "10px 20px", fontFamily: "'Montserrat',sans-serif", fontWeight: 700, fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase", cursor: "pointer", transition: "background 0.25s" }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = "#C5A059"; e.currentTarget.style.color = "#fff"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = "#2C241E"; e.currentTarget.style.color = "#F5EFE0"; }}
                  >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
                    Auto-Assign Best
                  </button>
                </div>
              </div>

              {/* grid */}
              {loading ? (
                <div style={{ textAlign: "center", padding: "80px 20px" }}>
                  <div style={{ width: 40, height: 40, border: "3px solid #EAE0D0", borderTopColor: "#C5A059", borderRadius: "50%", animation: "spin 1s linear infinite", margin: "0 auto 16px" }} />
                  <p style={{ fontFamily: "'Montserrat',sans-serif", fontSize: 14, color: "#888" }}>Finding active stylists...</p>
                </div>
              ) : !hasSalon ? (
                <div style={{ textAlign: "center", padding: "80px 20px", background: "#fff", borderRadius: 16, border: "1px dashed #DDD4C4" }}>
                  <div style={{ fontSize: 32, marginBottom: 12 }}>📍</div>
                  <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 20, color: "#8A7060", margin: "0 0 8px" }}>No Salon Selected</p>
                  <p style={{ fontFamily: "'Montserrat',sans-serif", fontSize: 13, color: "#AAA", margin: "0 0 24px", lineHeight: 1.6 }}>You have not selected a salon studio yet. Please choose a studio location using the selector bar at the top or click below.</p>
                  <button onClick={() => navigate("/nearby")} style={{ padding: "10px 28px", background: "#2C241E", color: "#fff", border: "none", borderRadius: 8, fontSize: 11, fontFamily: "'Montserrat',sans-serif", letterSpacing: "0.1em", textTransform: "uppercase", cursor: "pointer" }}>Select Salon Studio</button>
                </div>
              ) : barbersList.length === 0 ? (
                <div style={{ textAlign: "center", padding: "80px 20px", background: "#fff", borderRadius: 16, border: "1px dashed #DDD4C4" }}>
                  <div style={{ fontSize: 32, marginBottom: 12 }}>💈</div>
                  <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 20, color: "#8A7060", margin: "0 0 8px" }}>No stylists registered</p>
                  <p style={{ fontFamily: "'Montserrat',sans-serif", fontSize: 13, color: "#AAA", margin: "0 0 24px", lineHeight: 1.6 }}>There are no stylists registered for this salon yet. Please choose another studio or check back later.</p>
                  <button onClick={() => navigate("/nearby")} style={{ padding: "10px 28px", background: "#2C241E", color: "#fff", border: "none", borderRadius: 8, fontSize: 11, fontFamily: "'Montserrat',sans-serif", letterSpacing: "0.1em", textTransform: "uppercase", cursor: "pointer" }}>Change Studio</button>
                </div>
              ) : filtered.length === 0 ? (
                <div style={{ textAlign: "center", padding: "80px 20px", background: "#fff", borderRadius: 16, border: "1px dashed #DDD4C4" }}>
                  <div style={{ fontSize: 32, marginBottom: 12 }}>✦</div>
                  <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 20, color: "#8A7060", margin: "0 0 8px" }}>No stylists found</p>
                  <p style={{ fontFamily: "'Montserrat',sans-serif", fontSize: 13, color: "#AAA", margin: "0 0 24px" }}>Try adjusting your filter criteria.</p>
                  <button onClick={clearFilters} style={{ padding: "10px 28px", background: "#2C241E", color: "#fff", border: "none", borderRadius: 8, fontSize: 11, fontFamily: "'Montserrat',sans-serif", letterSpacing: "0.1em", textTransform: "uppercase", cursor: "pointer" }}>Clear Filters</button>
                </div>
              ) : (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 24 }}>
                  {filtered.map((b, i) => (
                    <div key={b.id} ref={(el) => (cardRefs.current[b.id] = el)}>
                      <BarberCard
                        b={b}
                        index={i}
                        visible={visibleCards.has(String(b.id))}
                        isSelected={selectedBarber?.id === b.id}
                        onSelect={setSelectedBarber}
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* CONTINUE CTA */}
              {selectedBarber && (
                <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-white/95 backdrop-blur-md border-t border-[#EAE0D0] flex flex-row items-center justify-between gap-3 shadow-[0_-10px_30px_rgba(44,36,30,0.12)] xl:relative xl:bottom-auto xl:left-auto xl:right-auto xl:z-0 xl:mt-10 xl:p-6 xl:bg-white xl:border xl:rounded-2xl xl:flex-row xl:gap-4 xl:shadow-none">
                  <div className="w-auto text-left">
                    <p style={{ fontFamily: "'Montserrat',sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "#AAA", margin: "0 0 4px" }} className="hidden xl:block">Selected Artist</p>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <img src={selectedBarber.img} alt={selectedBarber.name} style={{ borderRadius: "50%", objectFit: "cover", border: "2px solid #C5A059" }} className="w-9 h-9 xl:w-10 xl:h-10" />
                      <div>
                        <p style={{ fontFamily: "'Cormorant Garamond',serif", fontWeight: 600, color: "#2C241E", margin: 0 }} className="text-[16px] xl:text-[20px] leading-tight">{selectedBarber.name}</p>
                        <p style={{ fontFamily: "'Montserrat',sans-serif", color: "#AAA", margin: 0 }} className="text-[10px] xl:text-[11px]">{selectedBarber.role}</p>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      const token = localStorage.getItem("token");
                      const role = localStorage.getItem("role");
                      if (!token || role !== "customer") {
                        navigate("/login", {
                          state: {
                            from: {
                              pathname: "/customer/look",
                              state: { service: selectedService, barber: selectedBarber, gender }
                            }
                          }
                        });
                      } else {
                        navigate("/customer/look", { state: { service: selectedService, barber: selectedBarber, gender } });
                      }
                    }}
                    className="w-auto justify-center py-2.5 px-4 xl:py-3.5 xl:px-8 text-[10px] xl:text-[11px]"
                    style={{ background: "#C5A059", color: "#fff", border: "none", borderRadius: 10, fontFamily: "'Montserrat',sans-serif", fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", cursor: "pointer", transition: "background 0.25s", display: "flex", alignItems: "center", gap: 8 }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = "#2C241E"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = "#C5A059"; }}
                  >
                    Choose Your Look →
                  </button>
                </div>
              )}

            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
