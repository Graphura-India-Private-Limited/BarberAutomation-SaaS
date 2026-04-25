import { useState, useEffect, useRef } from "react";

/* ─── DESIGN TOKENS ─────────────────────────────────────────────────────── */
const C = {
  navy:       "#0f1b2d",
  navyCard:   "#162236",
  navyBorder: "#1e3250",
  amber:      "#f5a623",
};

/* ─── DATA ───────────────────────────────────────────────────────────────── */
const NAV_LINKS = [
  { label: "How It Works", href: "#how-it-works" },
  { label: "Features",     href: "#features"     },
  { label: "Why BarberQ",  href: "#why"          },
  { label: "For Owners",   href: "#owners"       },
];

const STEPS = [
  { num: "01", dark: true,  title: "Find a Salon",      desc: "Open the app → Allow location → See salons near you with live queue counts & wait times." },
  { num: "02", dark: false, title: "Login in Seconds",  desc: "Enter your mobile number → Get OTP → You're in. No passwords, no hassle." },
  { num: "03", dark: true,  title: "Pick & Book",       desc: "Choose your barber, select a service (Haircut / Beard / Combo) and join the live queue or book a slot." },
  { num: "04", dark: false, title: "Arrive & Relax",    desc: "Get real-time notifications. Walk in right on time — zero waiting outside." },
];

const FEATURES = [
  { title: "Live Queue Tracker",     desc: "See real-time queue position, estimated wait & barber status. Zero surprises."              },
  { title: "Smart Slot Booking",     desc: "Book same-day or future slots. Priority bookings let you skip the queue."                  },
  { title: "Multi-Barber View",      desc: "Compare all barbers — availability, ratings, estimated free time."                         },
  { title: "Firebase Notifications", desc: "Get pinged when your turn is 10 min away, or when barber is free."                        },
  { title: "Loyalty & Rewards",      desc: "Earn points every visit, redeem for discounts. Membership plans available."               },
  { title: "AI Wait Prediction",     desc: "Smart estimates based on barber speed, queue length & past data."                         },
];

const STATS = [
  { val: "3.2×", label: "Faster service experience" },
  { val: "92%",  label: "No-show reduction"         },
  { val: "4.8★", label: "Average app rating"        },
];

const REVIEWS = [
  { text: "Booked in 30 seconds and was seated the moment I walked in. Never waiting again!",                     author: "Rahul M., Surat"     },
  { text: "The family booking feature is amazing — booked for my husband and son together.",                      author: "Priya K., Ahmedabad" },
  { text: "Queue notifications are spot on. The barber was free exactly when I arrived.",                        author: "Dev S., Mumbai"      },
];

const OWNER_FEATURES = [
  { tag: "CRM",   tagBg: "#22c55e", tagColor: "#fff",    title: "CRM Dashboard",       desc: "Live queue overview, barber analytics, peak hours & drop-off rates."        },
  { tag: "STAFF", tagBg: "#8b5cf6", tagColor: "#fff",    title: "Staff Management",    desc: "Add barbers, track breaks, approve schedules & monitor performance."         },
  { tag: "REV",   tagBg: C.amber,   tagColor: C.navy,    title: "Revenue Insights",    desc: "Daily/weekly/monthly reports — barber-wise and service-wise revenue."        },
  { tag: "NOTIF", tagBg: "#ef4444", tagColor: "#fff",    title: "Smart Notifications", desc: "Broadcast offers & updates. Auto-alert customers on delays."                },
  { tag: "PAY",   tagBg: "#06b6d4", tagColor: "#fff",    title: "Razorpay Payments",   desc: "Token payments prevent no-shows. Transparent transaction tracking."          },
  { tag: "LOYAL", tagBg: "#10b981", tagColor: "#fff",    title: "Loyalty Control",     desc: "Define reward rules, create membership plans, drive repeat visits."          },
];

/* ─── HOOKS ──────────────────────────────────────────────────────────────── */
function useScrolled(threshold = 24) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > threshold);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, [threshold]);
  return scrolled;
}

function useInView() {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setInView(true); obs.disconnect(); } },
      { threshold: 0.1 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, inView];
}

/* ─── BASE BUTTONS ───────────────────────────────────────────────────────── */
function BtnPrimary({ children, style = {} }) {
  return (
    <button
      style={{ background: C.amber, color: C.navy, ...style }}
      className="font-black px-7 py-[14px] rounded-lg text-[15px] border-none cursor-pointer
                 transition-all duration-200 hover:opacity-90 hover:scale-[1.03] active:scale-95"
    >
      {children}
    </button>
  );
}

function BtnOutline({ children }) {
  return (
    <button
      style={{ borderColor: C.amber, color: C.amber }}
      className="font-black px-7 py-[14px] rounded-lg text-[15px] bg-transparent cursor-pointer
                 border-2 transition-all duration-200 hover:bg-amber-400 hover:text-[#0f1b2d] active:scale-95"
    >
      {children}
    </button>
  );
}

/* ─── NAVBAR ─────────────────────────────────────────────────────────────── */
function Navbar() {
  const scrolled = useScrolled();
  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        background:    scrolled ? "rgba(15,27,45,0.96)" : "transparent",
        backdropFilter: scrolled ? "blur(12px)"          : "none",
        borderBottom:  scrolled ? `1px solid ${C.navyBorder}` : "none",
      }}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 md:px-10 py-4">
        <div
          className="font-black text-xs tracking-[3px] px-4 py-2 rounded select-none"
          style={{ background: C.amber, color: C.navy }}
        >
          BARBERQ
        </div>

        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map(({ label, href }) => (
            <a
              key={label}
              href={href}
              className="text-sm text-gray-400 hover:text-amber-400 transition-colors duration-150 font-medium no-underline"
            >
              {label}
            </a>
          ))}
        </div>

        <BtnPrimary style={{ padding: "10px 20px", fontSize: 13 }}>
          Get Started →
        </BtnPrimary>
      </div>
    </nav>
  );
}

/* ─── HERO ───────────────────────────────────────────────────────────────── */
function PhoneMockup() {
  return (
    <div
      className="rounded-3xl overflow-hidden w-[275px] flex-shrink-0"
      style={{
        background:  C.navyCard,
        border:      `2px solid ${C.navyBorder}`,
        boxShadow:   "0 40px 100px rgba(0,0,0,0.55)",
      }}
    >
      <div
        className="flex items-center gap-2 px-5 py-4"
        style={{ borderBottom: `1px solid ${C.navyBorder}` }}
      >
        <span className="text-lg">📍</span>
        <span className="text-white font-black text-sm">Nearby Salons</span>
      </div>

      {[
        { name: "Style Zone",       rating: "4.8", dist: "0.3 km", wait: "~8 min"  },
        { name: "The Grooming Co.", rating: "4.6", dist: "0.6 km", wait: "~15 min" },
      ].map((s) => (
        <div
          key={s.name}
          className="px-5 py-4"
          style={{ borderBottom: `1px solid ${C.navyBorder}` }}
        >
          <p className="text-white font-bold text-sm mb-1">{s.name}</p>
          <p className="text-gray-400 text-xs">
            <span style={{ color: C.amber }}>⭐</span>{" "}
            {s.rating} · {s.dist} · {s.wait}
          </p>
        </div>
      ))}

      <div className="px-5 pb-6 pt-3">
        <div className="h-16" />
        <button
          className="w-full font-black py-4 rounded-xl text-sm cursor-pointer border-none transition-opacity hover:opacity-90"
          style={{ background: C.amber, color: C.navy }}
        >
          Join Queue
        </button>
      </div>
    </div>
  );
}

function Hero() {
  return (
    <section
      className="min-h-screen flex items-center relative overflow-hidden px-6 md:px-10"
      style={{ background: C.navy }}
    >
      {/* Glow blobs */}
      <div
        className="absolute right-0 bottom-0 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle,#1c3255 0%,transparent 70%)",
          transform:  "translate(30%,30%)",
          opacity:    0.5,
        }}
      />
      <div
        className="absolute left-1/3 top-1/3 w-64 h-64 rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle,rgba(245,166,35,0.07) 0%,transparent 70%)" }}
      />

      <div className="max-w-7xl mx-auto w-full grid md:grid-cols-2 gap-16 items-center pt-24 pb-16">
        {/* LEFT */}
        <div className="space-y-8 animate-[fadeInUp_0.8s_ease_both]">
          <h1
            className="font-black leading-[1.06] text-white"
            style={{
              fontFamily: "Georgia,serif",
              fontSize:   "clamp(44px,6vw,72px)",
              letterSpacing: "-1px",
            }}
          >
            Skip the Wait.<br />
            Book Your Barber<br />
            Instantly.
          </h1>

          <p className="text-gray-400 text-lg leading-relaxed max-w-[420px]">
            Discover nearby salons, join a live queue or book a slot — no calls,
            no waiting outside.
          </p>

          <div className="flex flex-wrap gap-4">
            <BtnPrimary>Find Salons Now</BtnPrimary>
            <BtnOutline>For Salon Owners →</BtnOutline>
          </div>

          <div className="flex gap-10 pt-2">
            {[
              { val: "50K+",   label: "Users"  },
              { val: "1,200+", label: "Salons" },
              { val: "4.8★",   label: "Rating" },
            ].map(({ val, label }) => (
              <div key={label}>
                <div className="text-3xl font-black" style={{ color: C.amber }}>{val}</div>
                <div className="text-gray-400 text-xs mt-1 tracking-wide uppercase">{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT */}
        <div className="flex justify-center md:justify-end animate-[fadeInUp_0.8s_0.18s_ease_both]">
          <PhoneMockup />
        </div>
      </div>
    </section>
  );
}

/* ─── HOW IT WORKS ───────────────────────────────────────────────────────── */
function HowItWorks() {
  const [ref, inView] = useInView();
  return (
    <section id="how-it-works" className="py-24 px-6 md:px-10 bg-[#f2f2ed]">
      <div className="max-w-7xl mx-auto" ref={ref}>
        <div className="rounded-2xl px-10 py-8 mb-12" style={{ background: C.navy }}>
          <h2 className="text-4xl font-black text-white" style={{ fontFamily: "Georgia,serif" }}>
            How It Works
          </h2>
          <p className="text-gray-400 mt-2 text-sm">
            From discovery to your seat — in 4 simple steps
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {STEPS.map((step, i) => (
            <div
              key={step.num}
              className="bg-white rounded-2xl p-7 flex flex-col gap-5 border border-gray-200 transition-transform duration-200 hover:-translate-y-1"
              style={{
                opacity:    inView ? 1 : 0,
                transform:  inView ? "translateY(0)" : "translateY(30px)",
                transition: `opacity .5s ${i * 0.1}s ease, transform .5s ${i * 0.1}s ease`,
              }}
            >
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center font-black text-xl flex-shrink-0"
                style={{
                  background: step.dark ? C.navy  : C.amber,
                  color:      step.dark ? C.amber : C.navy,
                }}
              >
                {step.num}
              </div>
              <div>
                <h3 className="font-black text-[17px] mb-3" style={{ color: C.navy }}>
                  {step.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-center mt-12">
          <BtnPrimary>Get Started → It's Free</BtnPrimary>
        </div>
      </div>
    </section>
  );
}

/* ─── CORE FEATURES ──────────────────────────────────────────────────────── */
function CoreFeatures() {
  const [ref, inView] = useInView();
  return (
    <section id="features" className="py-24 px-6 md:px-10" style={{ background: C.navy }}>
      <div className="max-w-7xl mx-auto" ref={ref}>
        <h2 className="text-4xl font-black text-white mb-2" style={{ fontFamily: "Georgia,serif" }}>
          Core Features
        </h2>
        <p className="text-gray-400 mb-14 text-sm">
          Everything you need — in one smart platform
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map((f, i) => (
            <div
              key={f.title}
              className="rounded-2xl p-7 transition-transform duration-200 hover:-translate-y-1"
              style={{
                background:  C.navyCard,
                border:      `1px solid ${C.navyBorder}`,
                opacity:     inView ? 1 : 0,
                transform:   inView ? "translateY(0)" : "translateY(28px)",
                transition:  `opacity .5s ${i * 0.08}s ease, transform .5s ${i * 0.08}s ease`,
              }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-[14px] h-[14px] rounded-full flex-shrink-0" style={{ background: C.amber }} />
                <h3 className="text-white font-black text-[15px]">{f.title}</h3>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── WHY BARBERQ ────────────────────────────────────────────────────────── */
function WhyBarberQ() {
  const [ref, inView] = useInView();
  return (
    <section id="why" className="py-24 px-6 md:px-10 bg-[#f2f2ed]">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-10" ref={ref}>

        {/* Left — dark stat panel */}
        <div
          className="rounded-2xl p-10 flex flex-col justify-between"
          style={{
            background:  C.navy,
            minHeight:   480,
            opacity:     inView ? 1 : 0,
            transform:   inView ? "translateX(0)" : "translateX(-32px)",
            transition:  "opacity .6s ease, transform .6s ease",
          }}
        >
          <div>
            <h2
              className="font-black text-white leading-[1.08] mb-4"
              style={{ fontFamily: "Georgia,serif", fontSize: 52 }}
            >
              Why<br />BarberQ?
            </h2>
            <p className="text-gray-400 text-sm">Real numbers from real users across India.</p>
          </div>

          <div className="flex flex-col gap-8 mt-10">
            {STATS.map((s) => (
              <div key={s.val} className="flex items-stretch gap-4">
                <div className="w-1 rounded-full flex-shrink-0" style={{ background: C.amber }} />
                <div>
                  <div className="font-black leading-none" style={{ color: C.amber, fontSize: 34 }}>
                    {s.val}
                  </div>
                  <div className="text-gray-400 text-sm mt-2">{s.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right — reviews */}
        <div
          className="flex flex-col gap-5"
          style={{
            opacity:    inView ? 1 : 0,
            transform:  inView ? "translateX(0)" : "translateX(32px)",
            transition: "opacity .6s .15s ease, transform .6s .15s ease",
          }}
        >
          <h3 className="text-2xl font-black mb-1" style={{ color: C.navy }}>
            Customers Love It
          </h3>

          {REVIEWS.map((r, i) => (
            <div
              key={r.author}
              className="bg-white border border-gray-200 rounded-2xl p-6 transition-transform duration-200 hover:-translate-y-1"
              style={{
                opacity:    inView ? 1 : 0,
                transform:  inView ? "translateY(0)" : "translateY(20px)",
                transition: `opacity .5s ${0.2 + i * 0.12}s ease, transform .5s ${0.2 + i * 0.12}s ease`,
              }}
            >
              <div className="text-lg mb-3" style={{ color: C.amber }}>★★★★★</div>
              <p className="text-sm italic leading-relaxed mb-3" style={{ color: "#1a2940" }}>
                "{r.text}"
              </p>
              <p className="text-xs font-black" style={{ color: C.navy }}>— {r.author}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── FOR OWNERS ─────────────────────────────────────────────────────────── */
function ForOwners() {
  const [ref, inView] = useInView();
  return (
    <section id="owners" className="py-24 px-6 md:px-10 bg-white">
      <div className="max-w-7xl mx-auto" ref={ref}>
        <h2
          className="text-4xl font-black mb-2"
          style={{ color: C.navy, fontFamily: "Georgia,serif" }}
        >
          Grow Your Salon with BarberQ
        </h2>
        <p className="text-gray-500 mb-14 text-sm">
          A complete management dashboard — queue control, analytics, staff &amp; revenue. All in one place.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {OWNER_FEATURES.map((f, i) => (
            <div
              key={f.title}
              className="bg-white border border-gray-200 rounded-2xl p-7 transition-transform duration-200 hover:-translate-y-1"
              style={{
                opacity:    inView ? 1 : 0,
                transform:  inView ? "translateY(0)" : "translateY(28px)",
                transition: `opacity .5s ${i * 0.09}s ease, transform .5s ${i * 0.09}s ease`,
              }}
            >
              <div className="flex items-center gap-3 mb-4">
                <span
                  className="text-[11px] font-black px-3 py-1 rounded-md"
                  style={{ background: f.tagBg, color: f.tagColor }}
                >
                  {f.tag}
                </span>
                <h3 className="font-black text-[15px]" style={{ color: C.navy }}>{f.title}</h3>
              </div>
              <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── CTA ────────────────────────────────────────────────────────────────── */
function CTA() {
  const [ref, inView] = useInView();
  return (
    <section
      className="py-28 px-6 md:px-10 text-center relative overflow-hidden"
      style={{ background: C.navy }}
    >
      <div
        className="absolute left-1/2 top-1/2 w-[650px] h-[650px] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle,#1c3255 0%,transparent 65%)",
          opacity:    0.25,
          transform:  "translate(-50%,-50%)",
        }}
      />

      <div
        className="relative max-w-[680px] mx-auto"
        ref={ref}
        style={{
          opacity:    inView ? 1 : 0,
          transform:  inView ? "translateY(0)" : "translateY(32px)",
          transition: "opacity .7s ease, transform .7s ease",
        }}
      >
        <h2
          className="font-black text-white leading-[1.14] mb-6"
          style={{ fontFamily: "Georgia,serif", fontSize: "clamp(36px,5vw,60px)" }}
        >
          Ready to experience<br />smarter grooming?
        </h2>
        <p className="text-gray-400 text-lg mb-12 leading-relaxed">
          Join thousands of customers and salon owners already using BarberQ across India.
        </p>

        <div className="flex justify-center flex-wrap gap-5 mb-16">
          <BtnPrimary>Explore Salons →</BtnPrimary>
          <BtnOutline>List Your Salon →</BtnOutline>
        </div>

        <div
          className="border-t pt-10 flex justify-center flex-wrap gap-8 text-gray-400 text-sm"
          style={{ borderColor: C.navyBorder }}
        >
          {[
            { icon: "🔒", label: "OTP-secured login"  },
            { icon: "📍", label: "Location-aware"     },
            { icon: "💳", label: "Razorpay payments"  },
            { icon: "🔔", label: "Firebase alerts"    },
          ].map(({ icon, label }) => (
            <div key={label} className="flex items-center gap-2">
              <span>{icon}</span><span>{label}</span>
            </div>
          ))}
        </div>

        <p className="text-gray-600 text-xs mt-10">
          BARBERQ by Graphura India Pvt. Ltd.
        </p>
      </div>
    </section>
  );
}

/* ─── ROOT ───────────────────────────────────────────────────────────────── */
export default function App() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;700;900&display=swap');
        *, *::before, *::after { box-sizing: border-box; }
        html { scroll-behavior: smooth; }
        body { margin: 0; background: #0f1b2d; font-family: 'Outfit','Trebuchet MS',sans-serif; }
        a { text-decoration: none; }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(28px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <Navbar />
      <main>
        <Hero />
        <HowItWorks />
        <CoreFeatures />
        <WhyBarberQ />
        <ForOwners />
        <CTA />
      </main>
    </>
  );
}