import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  Scissors,
  Sparkles,
  Crown,
  Home,
  Users,
  Phone,
  Info,
  ChevronDown,
  ArrowRight,
  Menu,
  X,
} from "lucide-react";  

const Navbar = () => {
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);
  const [dropOpen, setDropOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const dropRef = useRef(null);

  // 🔄 Add a scroll listener to transition from absolute transparent alignment to sticky flat surfaces
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // CLOSE DROPDOWNS ON CLICK OUTSIDE
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropRef.current && !dropRef.current.contains(event.target)) {
        setDropOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // SECTION NAVIGATION
  const handleSectionNav = (sectionId) => {
    navigate("/");
    setMenuOpen(false);

    setTimeout(() => {
      const section = document.getElementById(sectionId);
      if (section) {
        section.scrollIntoView({
          behavior: "smooth",
        });
      }
    }, 500);
  };

  // NAV ITEMS
  const NAV_ITEMS = [
    { label: "Home", path: "/", icon: Home },
    { label: "Services", hasDropdown: true, icon: Sparkles },
    { label: "Barbers", path: "/barbers", icon: Users },
    { label: "About", section: "about", icon: Info },
    { label: "Contact", section: "contact", icon: Phone },
  ];

  // SERVICE LINKS
  const SERVICE_LINKS = [
    {
      label: "Men Services",
      path: "/customer/services/men",
      desc: "Haircut & Beard",
      icon: Scissors,
    },
    {
      label: "Women Services",
      path: "/customer/services/women",
      desc: "Beauty & Spa",
      icon: Crown,
    },
    {
      label: "Addon Services",
      path: "/customer/services/addons",
      desc: "Premium Addons",
      icon: Sparkles,
    },
  ];

  const handleNav = (path) => {
    navigate(path);
    setMenuOpen(false);
    setDropOpen(false);
  };

  return (
    <>
      {/* ══ NAVBAR CONTAINER FIXED CONSOLE ══ */}
      <nav
  className={`sticky top-0 z-50 transition-all duration-500 ${
    scrolled
      ? "bg-[#241F1B]/92 backdrop-blur-2xl border-b border-[#C5A059]/10 shadow-[0_10px_40px_rgba(0,0,0,0.45)]"
      : "bg-gradient-to-r from-[#2A241F] via-[#3E362E] to-[#2A241F] border-b border-white/5"
  }`}
>
        <div className="flex w-full items-center justify-between pl-5 pr-6 py-3 max-w-[1700px] mx-auto">

          {/* BRAND LOGO DESIGN PANEL */}
          <div
            className="flex flex-col items-start cursor-pointer font-sans"
            onClick={() => handleNav("/")}
          >
            <div className="flex items-center gap-2.5">
             <div className="relative flex items-center gap-1.5 text-[11px] font-black uppercase tracking-[0.2em] text-stone-300 hover:text-[#FFE6A7] transition-all duration-300 cursor-pointer after:absolute after:left-0 after:-bottom-2 after:h-[2px] after:w-0 after:bg-[#C5A059] after:transition-all hover:after:w-full">
                <Scissors className="w-4 h-4 text-[#C5A059]" />
              </div>

              <h1 className="text-base md:text-lg font-black tracking-[0.15em] uppercase text-white">
                BARBER <span className="text-[#C5A059]">PRO</span>
              </h1>
            </div>

            <div className="hidden md:flex items-center gap-2 w-full mt-1.5">
              <div className="h-[1px] flex-grow bg-[#C5A059] opacity-20" />
              <span className="text-[7px] text-stone-400 tracking-[0.3em] uppercase font-black">
                Est. 2026
              </span>
              <div className="h-[1px] flex-grow bg-[#C5A059] opacity-20" />
            </div>
          </div>

          {/* DESKTOP LINKS LINK BLOCK */}
          <div className="hidden lg:flex items-center gap-8">
            {NAV_ITEMS.map((item) =>
              item.hasDropdown ? (
                <div key={item.label} className="relative" ref={dropRef}>
                  <button
                    onClick={() => setDropOpen((p) => !p)}
                    className={`flex items-center gap-1.5 text-[11px] font-black uppercase tracking-widest transition-colors cursor-pointer ${
                      dropOpen ? "text-[#C5A059]" : "text-stone-300 hover:text-[#C5A059]"
                    }`}
                  >
                    {item.label}
                    <ChevronDown
                      className={`w-3.5 h-3.5 transition-transform duration-200 ${
                        dropOpen ? "rotate-180 text-[#C5A059]" : "text-stone-400"
                      }`}
                    />
                  </button>

                  {/* SUBMENU SERVICES OVERLAY POPUP */}
                  {dropOpen && (
                    <div className="absolute top-10 left-1/2 -translate-x-1/2 w-72 rounded-3xl bg-[#2A241F]/95 backdrop-blur-2xl border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.45)] overflow-hidden z-50 animate-fade-in">
                      <div className="p-2 space-y-0.5">
                        {SERVICE_LINKS.map((svc) => (
                          <button
                            key={svc.path}
                            onClick={() => handleNav(svc.path)}
                            className="w-full flex items-center gap-3.5 p-3 rounded-xl hover:bg-[#2A241F] transition-all group text-left"
                          >
                            <div className="w-9 h-9 rounded-lg bg-[#3E362E] border border-stone-700/50 flex items-center justify-center text-[#C5A059] group-hover:bg-[#C5A059] group-hover:text-white transition-all">
                              <svc.icon className="w-4 h-4" />
                            </div>

                            <div>
                              <p className="text-xs font-black uppercase tracking-wider text-white group-hover:text-[#C5A059] transition-colors">
                                {svc.label}
                              </p>
                              <p className="text-[10px] font-medium text-stone-400 mt-0.5">
                                {svc.desc}
                              </p>
                            </div>

                            <ArrowRight className="w-3.5 h-3.5 text-[#C5A059] ml-auto opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  key={item.label}
                  onClick={() => {
                    if (item.section) {
                      handleSectionNav(item.section);
                    } else {
                      handleNav(item.path);
                    }
                  }}
                  className="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-widest text-stone-300 hover:text-[#C5A059] transition-colors cursor-pointer"
                >
                  {item.label}
                </button>
              )
            )}
          </div>

          {/* EXECUTIVE UTILITIES ROW TARGET */}
          <div className="flex items-center gap-3.5">
            <button
              type="button"
              onClick={() => handleNav("/login")}
              className="hidden sm:block text-[10px] font-black uppercase tracking-[0.2em] text-white border border-white/10 bg-white/[0.03] backdrop-blur-xl px-5 py-2.5 rounded-xl hover:border-[#C5A059]/40 hover:bg-white/[0.06] transition-all duration-300 cursor-pointer">
              Login
            </button>

            <button
              type="button"
              onClick={() => handleNav("/customer/services")}
             className="hidden sm:block rounded-xl bg-gradient-to-r from-[#C5A059] via-[#E8C878] to-[#C5A059] hover:scale-105 px-7 py-3 text-[10px] font-black uppercase tracking-[0.25em] text-[#2A241F] shadow-[0_0_25px_rgba(197,160,89,0.35)] transition-all duration-300 cursor-pointer active:scale-[0.98]">
              Book Now
            </button>

            {/* Mobile Burger Switch Trigger */}
            <button
              type="button"
              onClick={() => setMenuOpen(!menuOpen)}
              className="lg:hidden text-stone-300 hover:text-white transition-colors"
            >
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* 📱 MOBILE RESPONSIVE LINKS EXPANSION GRID */}
        {menuOpen && (
          <div className="lg:hidden bg-[#3E362E] border-t border-[#2A241F] px-6 py-4 space-y-1 shadow-2xl text-left animate-slide-in">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.label}
                onClick={() => {
                  if (item.section) {
                    handleSectionNav(item.section);
                  } else if (item.path) {
                    handleNav(item.path);
                  } else {
                    setDropOpen(!dropOpen);
                  }
                }}
                className="block w-full text-left text-xs font-black uppercase tracking-widest text-stone-300 hover:text-[#C5A059] py-3 border-b border-stone-800/40 last:border-0"
              >
                {item.label}
              </button>
            ))}
          </div>
        )}
      </nav>
    </>
  );
};

export default Navbar;