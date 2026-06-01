import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Scissors,
  Phone,
  Mail,
  MapPin,
  Send,
  ArrowUpRight,
  Clock,
  ShieldCheck,
  Award,
} from "lucide-react";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const Footer = () => {
  const navigate = useNavigate();
  const [email,      setEmail]      = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [status,     setStatus]     = useState(null); // null | { type: 'success'|'error', msg: string }

  const handleSubscribe = async () => {
    const trimmed = email.trim();
    if (!trimmed) {
      setStatus({ type: "error", msg: "Please enter your email." });
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmed)) {
      setStatus({ type: "error", msg: "Enter a valid email address." });
      return;
    }
    setSubmitting(true);
    setStatus(null);
    try {
      const res  = await fetch(`${API}/auth/subscribe`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmed }),
      });
      const data = await res.json();
      if (data.success) {
        setStatus({ type: "success", msg: "🎉 You're subscribed!" });
        setEmail("");
      } else {
        setStatus({ type: "error", msg: data.message || "Something went wrong." });
      }
    } catch {
      setStatus({ type: "error", msg: "Network error. Please try again." });
    } finally {
      setSubmitting(false);
      setTimeout(() => setStatus(null), 4000);
    }
  };

  const SERVICE_LINKS = [
    { label: "Men Services",   path: "/customer/services/men" },
    { label: "Women Services", path: "/customer/services/women" },
    { label: "Addons",         path: "/customer/services/addons" },
  ];

  const SocialLinks = [
    {
      label: "Instagram",
      href: "https://instagram.com",
      svg: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
          <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
        </svg>
      ),
    },
    {
      label: "Twitter",
      href: "https://twitter.com",
      svg: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
        </svg>
      ),
    },
    {
      label: "Facebook",
      href: "https://facebook.com",
      svg: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
        </svg>
      ),
    },
  ];

  return (
    <footer
      id="contact"
      className="relative mt-20 mx-4 mb-5 overflow-hidden rounded-[32px] bg-gradient-to-br from-[#1A1613] via-[#2A241F] to-[#3E362E] shadow-[0_20px_60px_rgba(0,0,0,0.7)]"
    >
      {/* GLOW EFFECTS */}
      <div className="absolute top-[-120px] left-[-120px] w-[340px] h-[340px] bg-[#C5A059]/20 blur-[140px] rounded-full animate-pulse" />
      <div className="absolute bottom-[-120px] right-[-120px] w-[340px] h-[340px] bg-white/10 blur-[140px] rounded-full animate-pulse" />

      {/* TEXTURE */}
      <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/asfalt-dark.png')]" />

      {/* IMAGE OVERLAY */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-10 mix-blend-overlay"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&q=80&w=1600')" }}
      />

      {/* SHINY TOP LINE */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#FFE6A7]/70 to-transparent" />

      {/* MAIN CONTENT */}
      <div className="relative z-20 px-5 md:px-10 py-14 backdrop-blur-xl border border-white/[0.06] rounded-[32px]">
        <div className="max-w-7xl mx-auto">

          {/* TOP GRID */}
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4 mb-12">

            {/* BRAND */}
            <div className="space-y-4">
              <div className="flex flex-col items-start cursor-pointer group" onClick={() => navigate("/")}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-xl border border-[#C5A059]/30 flex items-center justify-center shadow-[0_0_25px_rgba(197,160,89,0.25)] transition-all duration-500 group-hover:rotate-12 group-hover:scale-110">
                    <Scissors className="w-5 h-5 text-[#C5A059]" />
                  </div>
                  <h1 className="text-lg md:text-xl font-black tracking-[0.2em] uppercase text-white">
                    BARBER <span className="text-[#C5A059] drop-shadow-[0_0_15px_rgba(197,160,89,0.5)]">PRO</span>
                  </h1>
                </div>
                <div className="flex items-center gap-2 mt-2 opacity-50">
                  <div className="w-10 h-[1px] bg-[#C5A059]" />
                  <span className="text-[9px] uppercase tracking-[0.35em] text-stone-400 font-black">Est. 2026</span>
                  <div className="w-10 h-[1px] bg-[#C5A059]" />
                </div>
              </div>
              <p className="text-stone-300/80 text-sm leading-relaxed font-light max-w-[280px]">
                Crafting supreme confidence through tailored precision and luxury grooming experiences built for the modern gentleman.
              </p>
              <div className="flex gap-3">
                {SocialLinks.map((s) => (
                  <a key={s.label} href={s.href} target="_blank" rel="noreferrer"
                    className="group/icon w-11 h-11 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/10 flex items-center justify-center text-stone-300 hover:bg-[#C5A059] hover:text-black hover:scale-110 hover:-translate-y-1 transition-all duration-300 shadow-[0_0_25px_rgba(255,255,255,0.05)]"
                  >
                    <span className="transition-transform duration-300 group-hover/icon:scale-125">{s.svg}</span>
                  </a>
                ))}
              </div>
            </div>

            {/* SERVICES */}
            <div>
              <h4 className="text-[11px] uppercase tracking-[0.35em] font-black text-[#FFE6A7] mb-7 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059] shadow-[0_0_10px_#C5A059]" />
                Services
              </h4>
              <ul className="space-y-3">
                {SERVICE_LINKS.map((s) => (
                  <li key={s.path}>
                    <button onClick={() => navigate(s.path)} className="group flex items-center gap-2 text-stone-300 hover:text-[#FFE6A7] text-sm font-medium transition-all duration-300">
                      <span className="w-0 h-[1px] bg-[#C5A059] transition-all duration-300 group-hover:w-4" />
                      {s.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* EXPLORE */}
            <div>
              <h4 className="text-[11px] uppercase tracking-[0.35em] font-black text-[#FFE6A7] mb-7 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059] shadow-[0_0_10px_#C5A059]" />
                Explore
              </h4>
              <ul className="space-y-3">
                {[
                  ["My Profile",       "/customerprofile"],
                  ["Booking History",  "/customer/history"],
                  ["Nearby Salons",    "/nearby"],
                  ["Write Review",     "/write-review"],
                  ["All Reviews",      "/reviews"],
                  ["FAQs",             "/faq"],
                ].map(([label, path]) => (
                  <li key={path}>
                    <button onClick={() => navigate(path)} className="group flex items-center gap-2 text-stone-300 hover:text-[#FFE6A7] text-sm font-medium transition-all duration-300">
                      <span className="w-0 h-[1px] bg-[#C5A059] transition-all duration-300 group-hover:w-4" />
                      {label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* CONTACT + NEWSLETTER */}
            <div className="space-y-5">
              <h4 className="text-[11px] uppercase tracking-[0.35em] font-black text-[#FFE6A7] flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059] shadow-[0_0_10px_#C5A059]" />
                Get In Touch
              </h4>

              <div className="space-y-4">
                {[
                  [Phone,  "+91 98765 43210"],
                  [Mail,   "hello@barberpro.com"],
                  [MapPin, "Pune, Maharashtra, India"],
                ].map(([Icon, text], i) => (
                  <div key={i} className="flex items-center gap-3 bg-white/[0.04] backdrop-blur-xl border border-white/[0.06] px-4 py-3 rounded-2xl hover:border-[#C5A059]/30 hover:bg-white/[0.06] transition-all duration-300">
                    <div className="w-9 h-9 rounded-xl bg-[#C5A059]/10 border border-[#C5A059]/20 flex items-center justify-center">
                      <Icon className="w-4 h-4 text-[#C5A059]" />
                    </div>
                    <span className="text-sm text-stone-300">{text}</span>
                  </div>
                ))}
              </div>

              {/* NEWSLETTER INPUT */}
              <div>
                <div className="p-1 rounded-xl bg-white/[0.05] backdrop-blur-xl border border-white/[0.08] flex items-center transition-all duration-300 focus-within:border-[#C5A059]/50 focus-within:bg-white/[0.08]">
                  <input
                    type="email"
                    placeholder="Drop your email..."
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && !submitting && handleSubscribe()}
                    disabled={submitting}
                    className="flex-1 bg-transparent px-3 py-2.5 text-xs text-white placeholder:text-stone-500 outline-none disabled:opacity-60"
                  />
                  <button
                    onClick={handleSubscribe}
                    disabled={submitting}
                    className="w-10 h-10 rounded-lg bg-gradient-to-r from-[#C5A059] via-[#E8C878] to-[#C5A059] text-[#2A241F] flex items-center justify-center hover:scale-105 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {submitting ? (
                      <svg className="w-3.5 h-3.5 animate-spin" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="40" strokeDashoffset="10" />
                      </svg>
                    ) : (
                      <Send className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>

                {status && (
                  <div className={`mt-2 px-3 py-2 rounded-lg text-[11px] font-semibold transition-all duration-300 ${
                    status.type === "success"
                      ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/25"
                      : "bg-red-500/15 text-red-400 border border-red-500/25"
                  }`}>
                    {status.msg}
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* STATUS BAR */}
          <div className="grid md:grid-cols-2 gap-4 py-5 border-y border-white/[0.06] mb-6">
            <div className="flex items-center gap-3 bg-white/[0.04] backdrop-blur-xl border border-white/[0.06] rounded-2xl p-4">
              <div className="w-12 h-12 rounded-2xl bg-[#C5A059]/10 flex items-center justify-center">
                <Clock className="w-5 h-5 text-[#C5A059]" />
              </div>
              <div>
                <p className="text-white font-black text-[12px] uppercase tracking-[0.2em]">
                  Mon - Sat (09:00 AM - 09:00 PM)
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[10px] uppercase tracking-[0.25em] font-black text-emerald-400">Accepting Bookings</span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-start md:justify-end gap-3">
              <div className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-white/[0.04] border border-white/[0.06] text-stone-300 text-[10px] uppercase tracking-[0.2em] font-black">
                <Award className="w-4 h-4 text-[#C5A059]" />
                Top Rated 2026
              </div>
              <div className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-white/[0.04] border border-white/[0.06] text-stone-300 text-[10px] uppercase tracking-[0.2em] font-black">
                <ShieldCheck className="w-4 h-4 text-[#C5A059]" />
                100% Hygienic
              </div>
            </div>
          </div>

          {/* BOTTOM */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-5 text-center sm:text-left">
              <p className="text-stone-500 text-[10px] uppercase tracking-[0.25em]">© 2026 BarberPro</p>
              <span className="hidden sm:block text-stone-700">|</span>
              <p className="text-stone-500 text-[10px] uppercase tracking-[0.25em]">
                Engineered by{" "}
                <span className="text-stone-300 hover:text-[#C5A059] transition cursor-pointer">
                  Graphura India Pvt Ltd
                </span>
              </p>
            </div>

            <div className="flex gap-7">
              {[["Privacy", "/privacy-policy"], ["Terms", "/terms"]].map(([label, to]) => (
                <Link key={to} to={to} className="group text-stone-400 hover:text-[#FFE6A7] text-[10px] uppercase tracking-[0.25em] font-black transition-all duration-300 flex items-center gap-1">
                  {label}
                  <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
                </Link>
              ))}
            </div>
          </div>

        </div>
      </div>
    </footer>
  );
};

export default Footer;
