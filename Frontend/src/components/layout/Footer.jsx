import React from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Scissors,
  Phone,
  Mail,
  MapPin,
  Send,
} from "lucide-react";

const Footer = () => {
  const navigate = useNavigate();

  // Demo Data
  const SERVICE_LINKS = [
    { label: "Men Services", path: "/customer/services/men" },
    { label: "Women Services", path: "/customer/services/women" },
    { label: "Addons", path: "/customer/services/addons" },
  ];

  const SocialSVG = [
    { label: "Instagram", d: "IG" },
    { label: "Twitter", d: "TW" },
    { label: "Facebook", d: "FB" },
  ];

  return (
    <>
      {/* ══ FOOTER ══ */}
      <footer
        id="contact"
        className="relative bg-[#0D0D0D] py-20 px-6 overflow-hidden"
      >
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-[#C5A059]/50 to-transparent" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4 mb-16">

            {/* LOGO */}
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="bg-[#C5A059] p-2 rounded-lg">
                  <Scissors className="w-5 h-5 text-white" />
                </div>

                <span className="text-xl font-black text-white tracking-[0.2em] uppercase italic">
                  BARBER <span className="text-[#C5A059]">PRO</span>
                </span>
              </div>

              <p className="text-stone-500 text-sm font-serif italic leading-relaxed">
                Crafting confidence through precision. Mastering the art of grooming since 2026.
              </p>

              <div className="flex gap-4">
                {SocialSVG.map((s) => (
                  <button
                    key={s.label}
                    className="w-10 h-10 rounded-full border border-white/10 hover:border-[#C5A059] hover:bg-[#C5A059] flex items-center justify-center transition-all duration-300 text-white"
                  >
                    {s.d}
                  </button>
                ))}
              </div>
            </div>

            {/* SERVICES */}
            <div>
              <h4 className="text-[12px] font-black uppercase tracking-[0.2em] text-[#C5A059] mb-6">
                Services
              </h4>

              <ul className="space-y-3">
                {SERVICE_LINKS.map((s) => (
                  <li key={s.path}>
                    <button
                      onClick={() => navigate(s.path)}
                      className="text-stone-400 hover:text-white text-sm transition-colors"
                    >
                      {s.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* EXPLORE */}
            <div>
              <h4 className="text-[12px] font-black uppercase tracking-[0.2em] text-[#C5A059] mb-6">
                Explore
              </h4>

              <ul className="space-y-3">
                {[
                  ["My Profile", "/customerprofile"],
                  ["Booking History", "/customer/history"],
                  ["Nearby Salons", "/nearby"],
                  ["Write Review", "/write-review"],
                  ["All Reviews", "/reviews"],
                  ["FAQs", "/faq"],
                ].map(([label, path]) => (
                  <li key={path}>
                    <button
                      onClick={() => navigate(path)}
                      className="text-stone-400 hover:text-white text-sm"
                    >
                      {label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* CONTACT */}
            <div className="space-y-6">
              <h4 className="text-[12px] font-black uppercase tracking-[0.2em] text-[#C5A059] mb-6">
                Contact Us
              </h4>

              <div className="space-y-4">
                {[
                  [Phone, "+91 98765 43210"],
                  [Mail, "hello@barberpro.com"],
                  [MapPin, "Pune, Maharashtra, India"],
                ].map(([Icon, text], i) => (
                  <div key={i} className="flex items-start gap-3 text-stone-400 text-sm">
                    <Icon className="w-4 h-4 text-[#C5A059]" />
                    <span>{text}</span>
                  </div>
                ))}
              </div>

              <div className="pt-4">
                <div className="flex p-1 bg-white/5 border border-white/10 rounded-xl">
                  <input
                    type="email"
                    placeholder="your@email.com"
                    className="flex-1 bg-transparent px-3 py-2 text-white text-xs outline-none"
                  />

                  <button className="bg-[#C5A059] text-white p-2 rounded-lg">
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* BOTTOM */}
          <div className="border-t border-white/5 pt-10 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-6">
              <p className="text-stone-600 text-[10px] uppercase tracking-[0.2em]">
                © 2026 BarberPro
              </p>

              <p className="text-stone-600 text-[10px] uppercase tracking-[0.2em]">
                Graphura India Pvt Ltd
              </p>
            </div>

            <div className="flex gap-8">
              <Link
                to="/privacy-policy"
                className="text-stone-600 hover:text-[#C5A059] text-[10px] uppercase tracking-[0.2em] transition"
              >
                Privacy Policy
              </Link>

              <Link
                to="/terms"
                className="text-stone-600 hover:text-[#C5A059] text-[10px] uppercase tracking-[0.2em] transition"
              >
                Terms & Conditions
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;