import React, { useState, useRef } from "react";
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

  // SECTION NAVIGATION
  const handleSectionNav = (sectionId) => {
    navigate("/");

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
  {
    label: "Home",
    path: "/",
    icon: Home,
  },
  {
    label: "Services",
    hasDropdown: true,
    icon: Sparkles,
  },
  {
    label: "Barbers",
    path: "/barbers",
    icon: Users,
  },
  {
    label: "About",
    section: "about",
    icon: Info,
  },
  {
    label: "Contact",
    section: "contact",
    icon: Phone,
  },
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
  // HANDLE NAVIGATION
  const handleNav = (path) => {
    navigate(path);
    setMenuOpen(false);
    setDropOpen(false);
  };

  return (
    <>
      {/* ══ NAVBAR ══ */}
      <nav
        className={`sticky top-0 z-50 border-b transition-all duration-300 ${
          scrolled
            ? "border-[#EADDCA]/80 bg-white/95 shadow-md backdrop-blur-xl"
            : "border-[#EADDCA]/30 bg-[#FAF6F0]/80 backdrop-blur-md"
        }`}
      >
        <div className="flex w-full items-center justify-between pl-3 pr-6 md:pl-5 md:pr-10 py-4">

          {/* LOGO */}
          <div
            className="flex flex-col items-start cursor-pointer font-serif"
            onClick={() => navigate("/")}
          >
            <div className="flex items-center gap-2.5">
              <Scissors className="w-5 h-5 text-[#C5A059]" />

              <h1 className="text-lg md:text-xl font-bold tracking-[0.2em] uppercase italic text-[#3E362E]">
                BARBER{" "}
                <span className="text-[#C5A059] not-italic">
                  PRO
                </span>
              </h1>
            </div>

            <div className="hidden md:flex items-center gap-2 w-full mt-1">
              <div className="h-[1px] flex-grow bg-[#C5A059] opacity-30" />

              <span className="text-[8px] text-[#8D7B68] tracking-[0.3em] uppercase font-bold">
                Est. 2026
              </span>

              <div className="h-[1px] flex-grow bg-[#C5A059] opacity-30" />
            </div>
          </div>

          {/* DESKTOP MENU */}
          <div className="hidden lg:flex items-center gap-8">
            {NAV_ITEMS.map((item) =>
              item.hasDropdown ? (
                <div
                  key={item.label}
                  className="relative"
                  ref={dropRef}
                >
                  <button
                    onClick={() => setDropOpen((p) => !p)}
                    className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-widest text-stone-700 hover:text-[#C5A059] transition"
                  >
                    {item.label}

                    <ChevronDown
                      className={`w-3.5 h-3.5 transition-transform ${
                        dropOpen
                          ? "rotate-180 text-[#C5A059]"
                          : ""
                      }`}
                    />
                  </button>

                  {dropOpen && (
                    <div className="absolute top-8 left-1/2 -translate-x-1/2 w-64 bg-white rounded-2xl shadow-2xl border border-[#EADDCA] overflow-hidden z-50">
                      <div className="p-2">
                        {SERVICE_LINKS.map((svc) => (
                          <button
                            key={svc.path}
                            onClick={() => handleNav(svc.path)}
                            className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-[#FEF3E2] transition-all group text-left"
                          >
                            <div className="w-10 h-10 rounded-xl bg-[#FEF3E2] flex items-center justify-center text-[#C5A059] group-hover:bg-[#C5A059] group-hover:text-white transition">
  <svc.icon className="w-5 h-5" />
</div>

                            <div>
                              <p className="text-[12px] font-bold text-[#3E362E] group-hover:text-[#C5A059]">
                                {svc.label}
                              </p>

                              <p className="text-[10px] text-[#8D7B68]">
                                {svc.desc}
                              </p>
                            </div>

                            <ArrowRight className="w-3.5 h-3.5 text-[#C5A059] ml-auto opacity-0 group-hover:opacity-100 transition" />
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
  className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-stone-700 hover:text-[#C5A059] transition"
>
  {item.icon && <item.icon className="w-4 h-4" />}
  {item.label}
</button>
              )
            )}
          </div>

          {/* RIGHT BUTTONS */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/login")}
              className="hidden sm:block text-[10px] font-bold uppercase tracking-widest text-[#3E362E] border border-[#EADDCA] px-4 py-2 rounded-lg hover:bg-[#FEF3E2] hover:border-[#C5A059] transition"
            >
              Login
            </button>

            <button
              onClick={() => navigate("/customer/services")}
              className="hidden sm:block rounded-lg bg-[#3E362E] px-6 py-2.5 text-[10px] font-black uppercase tracking-[0.2em] text-white hover:bg-[#C5A059] transition"
            >
              Book Now
            </button>

            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="lg:hidden text-[#3E362E]"
            >
              {menuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>

        {/* MOBILE MENU */}
        {menuOpen && (
          <div className="lg:hidden bg-white border-t border-[#EADDCA] p-6 space-y-3 shadow-2xl">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.label}
                onClick={() =>
                  item.path && handleNav(item.path)
                }
                className="block w-full text-left text-sm font-bold uppercase tracking-widest text-stone-700 py-2"
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