import { useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";

const CATEGORIES = [
  {
    id: "men",
    title: "Men's Grooming",
    subtitle: "For the Modern Gentleman",
    desc: "Architectural cuts, razor-sharp beard styling, luxury shaves and premium skin treatments engineered for the discerning man.",
    img: "https://i.pinimg.com/1200x/a0/aa/9a/a0aa9ab25439f003bf28beb0b35fb9c0.jpg",
    path: "/customer/services/men",
    tag: "12 Services",
    accent: "#C5A059",
    stats: [
      { label: "Cuts & Styling", val: "5+" },
      { label: "Beard Artistry", val: "4+" },
      { label: "Spa & Facials", val: "3+" },
    ],
  },
  {
    id: "women",
    title: "Women's Luxury",
    subtitle: "Crafted for Her Elegance",
    desc: "Bespoke styling, rich couture colouring, and rejuvenating rituals that illuminate your natural radiance from root to tip.",
    img: "https://images.unsplash.com/photo-1560869713-7d0a29430803?w=900&q=80",
    path: "/customer/services/women",
    tag: "18 Services",
    accent: "#D4A0B0",
    stats: [
      { label: "Cuts & Blowouts", val: "6+" },
      { label: "Colour Rituals", val: "7+" },
      { label: "Treatments", val: "5+" },
    ],
  },
  {
    id: "addon",
    title: "Add-On Services",
    subtitle: "Elevate Every Visit",
    desc: "Complement your main ritual with therapeutic head massages, express treatments, and indulgent premium upgrades.",
    img: "https://i.pinimg.com/736x/5f/49/8a/5f498aa7b763d1b16c698c931bc19ff9.jpg",
    path: "/customer/services/addon",
    tag: "6 Add-Ons",
    accent: "#7BBFA5",
    stats: [
      { label: "Massages", val: "3+" },
      { label: "Treatments", val: "2+" },
      { label: "Colour Boosts", val: "1+" },
    ],
  },
];

function useInView(ref) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.1 }
    );
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return visible;
}

function CategoryCard({ cat, index, navigate }) {
  const ref = useRef(null);
  const visible = useInView(ref);
  const [hovered, setHovered] = useState(false);

  return (
    <div
      ref={ref}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(32px)",
        background: "#fff",
        borderRadius: 24,
        overflow: "hidden",
        border: hovered ? `1.5px solid ${cat.accent}60` : "1.5px solid #EAE0D0",
        boxShadow: hovered ? "0 24px 56px rgba(44,36,30,0.10)" : "0 2px 16px rgba(44,36,30,0.04)",
        transition: `opacity 0.55s ease ${index * 120}ms, transform 0.55s ease ${index * 120}ms, box-shadow 0.35s ease, border 0.35s ease`,
        display: "flex",
        flexDirection: "column",
        cursor: "pointer",
        position: "relative",
      }}
      onClick={() => navigate(cat.path, { state: { categoryType: cat.id, categoryTitle: cat.title } })}
    >
      {/* Image */}
      <div style={{ position: "relative", height: 260, overflow: "hidden", background: "#EDE8E0" }}>
        <img
          src={cat.img}
          alt={cat.title}
          loading="lazy"
          style={{
            width: "100%", height: "100%", objectFit: "cover",
            transform: hovered ? "scale(1.06)" : "scale(1)",
            transition: "transform 0.7s ease",
          }}
        />
        {/* gradient overlay */}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(0,0,0,0) 40%, rgba(20,15,10,0.55) 100%)" }} />

        {/* tag pill */}
        <span style={{
          position: "absolute", top: 16, right: 16,
          background: "rgba(255,255,255,0.15)", backdropFilter: "blur(10px)",
          border: "1px solid rgba(255,255,255,0.3)",
          color: "#fff", fontSize: 11, fontFamily: "'Montserrat',sans-serif",
          fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase",
          padding: "4px 12px", borderRadius: 20,
        }}>
          {cat.tag}
        </span>

        {/* bottom title overlay */}
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "20px 24px 18px" }}>
          <p style={{ fontFamily: "'Montserrat',sans-serif", fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: cat.accent, fontWeight: 600, margin: "0 0 4px" }}>
            {cat.subtitle}
          </p>
          <h3 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 28, fontWeight: 400, color: "#fff", margin: 0, lineHeight: 1.1 }}>
            {cat.title}
          </h3>
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: "20px 24px 24px", flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
        <p style={{ fontFamily: "'Montserrat',sans-serif", fontSize: 13, color: "#888", lineHeight: 1.7, margin: "0 0 20px", fontWeight: 400 }}>
          {cat.desc}
        </p>

        {/* Stats row */}
        <div style={{ display: "flex", gap: 0, marginBottom: 20, borderTop: "1px solid #F0E8DA", borderBottom: "1px solid #F0E8DA", padding: "14px 0" }}>
          {cat.stats.map((s, i) => (
            <div key={i} style={{ flex: 1, textAlign: "center", borderRight: i < cat.stats.length - 1 ? "1px solid #F0E8DA" : "none" }}>
              <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 22, fontWeight: 700, color: "#2C241E", margin: 0 }}>{s.val}</p>
              <p style={{ fontFamily: "'Montserrat',sans-serif", fontSize: 10, color: "#AAA", margin: 0, letterSpacing: "0.06em", textTransform: "uppercase" }}>{s.label}</p>
            </div>
          ))}
        </div>

        {/* CTA button */}
        <button
          style={{
            width: "100%",
            padding: "13px 0",
            borderRadius: 10,
            border: "none",
            background: hovered ? cat.accent : "#2C241E",
            color: hovered ? "#2C241E" : "#F5EFE0",
            fontFamily: "'Montserrat',sans-serif",
            fontWeight: 700,
            fontSize: 11,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            cursor: "pointer",
            transition: "background 0.3s ease, color 0.3s ease",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
          }}
        >
          Explore Services
          <span style={{ fontSize: 14, fontWeight: 300 }}>→</span>
        </button>
      </div>
    </div>
  );
}

export default function ServiceCategories() {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;0,700;1,300;1,400&family=Montserrat:wght@300;400;500;600;700&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        ::selection { background: #C5A059; color: #fff; }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: #FAF6F0; }
        ::-webkit-scrollbar-thumb { background: #C5A059; border-radius: 3px; }
      `}</style>

      <Navbar />

      <div style={{ background: "#FAF6F0", minHeight: "100vh", fontFamily: "'Cormorant Garamond',serif", color: "#2C241E" }}>

        {/* ── BACK BUTTON ── */}
        <div style={{ position: "fixed", top: 88, left: 20, zIndex: 9999 }}>
          <button
            onClick={() => navigate(localStorage.getItem("token") ? "/dashboard" : "/")}
            style={{
              width: 44, height: 44, borderRadius: "50%",
              border: "none",
              background: "rgba(255,255,255,0.95)",
              backdropFilter: "blur(12px)",
              cursor: "pointer", fontSize: 18,
              boxShadow: "0 4px 20px rgba(0,0,0,0.12)",
              transition: "all 0.3s ease",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "#2C241E",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "#C5A059"; e.currentTarget.style.color = "#fff"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.95)"; e.currentTarget.style.color = "#2C241E"; }}
          >
            ←
          </button>
        </div>

        {/* ── HERO ── */}
        <div style={{ position: "relative", height: 520, overflow: "hidden", marginTop: 72 }}>
          <div style={{
            position: "absolute", inset: 0,
            backgroundImage: "url('https://images.unsplash.com/photo-1560066984-138dadb4c035?w=1600&q=80')",
            backgroundSize: "cover", backgroundPosition: "center",
            filter: "brightness(0.35)",
            transform: scrolled ? "scale(1.04)" : "scale(1)",
            transition: "transform 0.6s ease",
          }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(0,0,0,0.15) 0%, rgba(20,14,8,0.72) 100%)" }} />

          {/* decorative lines */}
          <div style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", width: 1, height: 60, background: "linear-gradient(to bottom, transparent, rgba(197,160,89,0.6))", zIndex: 2 }} />

          <div style={{ position: "absolute", inset: 0, zIndex: 5, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "0 24px" }}>
            {/* eyebrow */}
            <div style={{ display: "inline-flex", alignItems: "center", gap: 12, marginBottom: 22 }}>
              <div style={{ width: 32, height: 1, background: "rgba(197,160,89,0.7)" }} />
              <span style={{ fontFamily: "'Montserrat',sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: "0.32em", textTransform: "uppercase", color: "#C5A059" }}>The Luxury Experience</span>
              <div style={{ width: 32, height: 1, background: "rgba(197,160,89,0.7)" }} />
            </div>

            <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontWeight: 300, color: "#fff", fontSize: "clamp(40px,6vw,72px)", lineHeight: 1.05, letterSpacing: "0.03em", margin: "0 0 10px" }}>
              Choose Your{" "}
              <em style={{ fontStyle: "italic", color: "#C5A059", fontWeight: 400 }}>Ritual</em>
            </h1>

            {/* gold rule */}
            <div style={{ width: 64, height: 1, background: "linear-gradient(to right, transparent, #C5A059, transparent)", margin: "18px auto" }} />

            <p style={{ fontFamily: "'Montserrat',sans-serif", fontSize: 14, fontWeight: 300, color: "rgba(255,255,255,0.6)", maxWidth: 480, lineHeight: 1.8, marginBottom: 36 }}>
              Three worlds of curated beauty — each designed to give you an experience that's truly your own.
            </p>

            {/* quick pills */}
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "center" }}>
              {["Men's Grooming", "Women's Luxury", "Add-Ons"].map((label) => (
                <span key={label} style={{ fontFamily: "'Montserrat',sans-serif", fontSize: 11, fontWeight: 500, letterSpacing: "0.06em", color: "rgba(255,255,255,0.75)", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 20, padding: "5px 16px", backdropFilter: "blur(8px)" }}>
                  {label}
                </span>
              ))}
            </div>
          </div>

          {/* bottom fade */}
          <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 100, background: "linear-gradient(to bottom, transparent, #FAF6F0)", zIndex: 6 }} />
        </div>

        {/* ── SECTION HEADER ── */}
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "48px 32px 0", textAlign: "center" }}>
          <p style={{ fontFamily: "'Montserrat',sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: "0.28em", textTransform: "uppercase", color: "#C5A059", marginBottom: 10 }}>
            Explore Our Collections
          </p>
          <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontWeight: 300, fontSize: "clamp(28px,4vw,44px)", color: "#2C241E", letterSpacing: "0.04em" }}>
            Select a Service Category
          </h2>
          <div style={{ width: 48, height: 1, background: "#C5A059", margin: "16px auto 8px" }} />
          <p style={{ fontFamily: "'Montserrat',sans-serif", fontSize: 13, color: "#AAA", maxWidth: 420, margin: "0 auto", lineHeight: 1.7, fontWeight: 300 }}>
            Each category is a curated world of treatments. Pick yours and explore.
          </p>
        </div>

        {/* ── CARDS GRID ── */}
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "40px 32px 100px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 28 }}>
            {CATEGORIES.map((cat, i) => (
              <CategoryCard key={cat.id} cat={cat} index={i} navigate={navigate} />
            ))}
          </div>
        </div>

        {/* ── BOTTOM TRUST BAR ── */}
        <div style={{ borderTop: "1px solid #EAE0D0", background: "#fff" }}>
          <div style={{ maxWidth: 1200, margin: "0 auto", padding: "28px 32px", display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "center", gap: 40 }}>
            {[
              { icon: "✦", text: "Premium Ingredients" },
              { icon: "◈", text: "Expert Stylists" },
              { icon: "♨", text: "Luxury Ambience" },
              { icon: "✿", text: "Personalized Rituals" },
            ].map((item) => (
              <div key={item.text} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ color: "#C5A059", fontSize: 12 }}>{item.icon}</span>
                <span style={{ fontFamily: "'Montserrat',sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "#888" }}>{item.text}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      <Footer />
    </>
  );
}
