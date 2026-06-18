import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

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
  User,
  Calendar,
  Star,
  Settings,
  LogOut,
  LogIn,
} from "lucide-react";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [menuOpen, setMenuOpen] = useState(false);
  const [dropOpen, setDropOpen] = useState(false); // Desktop
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false); // Mobile
  const [profileOpen, setProfileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    const name = localStorage.getItem("name") || localStorage.getItem("userName") || localStorage.getItem("barberName") || localStorage.getItem("salonName") || "User";
    const email = localStorage.getItem("email") || "";

    if (token && role) {
      setIsLoggedIn(true);
      const initials = name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase() || "US";

      setUser({
        name,
        shortName: name.split(" ")[0],
        initials,
        email,
        role: role.toUpperCase() + (role === "customer" ? " MEMBER" : " PORTAL"),
      });
    } else {
      setIsLoggedIn(false);
      setUser(null);
    }
  }, [location.pathname]); 

  const dropRef = useRef(null);
  const profileRef = useRef(null);



  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (dropRef.current && !dropRef.current.contains(e.target))
        setDropOpen(false);
      if (profileRef.current && !profileRef.current.contains(e.target))
        setProfileOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Section scroll helper
  const handleSectionNav = (sectionId) => {
    navigate("/");
    setMenuOpen(false);
    setTimeout(() => {
      document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" });
    }, 500);
  };

  const handleNav = (path) => {
    navigate(path);
    setMenuOpen(false);
    setDropOpen(false);
    setProfileOpen(false);
  };

  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    setUser(null);
    setProfileOpen(false);
    setMenuOpen(false);
    navigate("/");
  };

  const getDashboardPath = () => {
    const role = localStorage.getItem("role") || "";
    const lowerRole = role.toLowerCase();
    if (lowerRole.includes("barber")) return "/barber/overview";
    if (lowerRole.includes("owner")) return "/owner/dashboard";
    if (lowerRole.includes("admin")) return "/admin";
    return "/dashboard";
  };

  // ── NAV CONFIG ──
  const NAV_ITEMS = [
    { label: "Home", path: "/", icon: Home },
    { label: "Services", hasDropdown: true, icon: Sparkles },
    { label: "Studios", path: "/nearby", icon: Users },
    { label: "About", section: "about", icon: Info },
    { label: "Contact", path: "/support", icon: Phone },
  ];

  const SERVICE_LINKS = [
    { label: "Men Services", path: "/customer/services/men", desc: "Haircut & Beard", icon: Scissors },
    { label: "Women Services", path: "/customer/services/women", desc: "Beauty & Spa", icon: Crown },
    { label: "Addon Services", path: "/customer/services/addons", desc: "Premium Addons", icon: Sparkles },
    { label: "All Services", path: "/customer/services", desc: "Explore All", icon: Home },
  ];

  const getProfileLinks = (userRole) => {
    const cleanRole = String(userRole).toLowerCase();
    if (cleanRole.includes("owner")) {
      return [
        { label: "Owner Dashboard", icon: Home, path: "/owner/dashboard" },
        { label: "Manage Services", icon: Scissors, path: "/owner/manage-services" },
        { label: "Finance & Revenue", icon: Star, path: "/owner/finance" },
        { label: "Settings", icon: Settings, path: "/owner/settings" },
      ];
    }
    if (cleanRole.includes("barber")) {
      return [
        { label: "Barber Dashboard", icon: Home, path: "/barber/overview" },
        { label: "My Queue", icon: Users, path: "/barber/queue" },
        { label: "Earnings", icon: Star, path: "/barber/earnings" },
        { label: "Settings", icon: Settings, path: "/barber/settings" },
      ];
    }
    if (cleanRole.includes("admin")) {
      return [
        { label: "Admin Dashboard", icon: Home, path: "/admin" },
        { label: "Requests & Salons", icon: Users, path: "/admin/requests" },
        { label: "Reports & Tickets", icon: Star, path: "/admin/tickets" },
        { label: "Platform Settings", icon: Settings, path: "/admin/settings" },
      ];
    }
    return [
      { label: "My Profile", icon: User, path: "/customerprofile" },
      { label: "My Appointments", icon: Calendar, path: "/customer/history" },
      { label: "Book Appointment", icon: Sparkles, path: "/customer/booking" },
    ];
  };

  const profileLinks = getProfileLinks(localStorage.getItem("role") || "");

  return (
    <>
      {/* ══ NAVBAR ══ */}
      <nav
        className={`fixed top-0 left-0 w-full z-[9999] transition-all duration-500 ${scrolled
          ? "bg-[#1E1A17]/95 backdrop-blur-2xl border-b border-[#C5A059]/10 shadow-[0_10px_40px_rgba(0,0,0,0.5)]"
          : "bg-gradient-to-r from-[#1E1A17] via-[#2A241F] to-[#1E1A17] border-b border-white/5"
          }`}
      >
        <div className="flex w-full items-center justify-between pl-5 pr-6 py-3 max-w-[1700px] mx-auto">

          {/* ── BRAND ── */}
          <div
            className="flex flex-col items-start cursor-pointer"
            onClick={() => handleNav("/")}
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#C5A059] to-[#E8C878] flex items-center justify-center">
                <Scissors className="w-4 h-4 text-[#1E1A17]" />
              </div>
              <h1 className="text-base md:text-lg font-black tracking-[0.15em] uppercase text-white">
                BARBER <span className="text-[#C5A059]">PRO</span>
              </h1>
            </div>
            <div className="hidden md:flex items-center gap-2 w-full mt-1.5">
              <div className="h-[1px] flex-grow bg-[#C5A059] opacity-20" />
              <span className="text-[7px] text-stone-400 tracking-[0.3em] uppercase font-black">Est. 2026</span>
              <div className="h-[1px] flex-grow bg-[#C5A059] opacity-20" />
            </div>
          </div>

          {/* ── DESKTOP LINKS ── */}
          <div className="hidden lg:flex items-center gap-8">
            {NAV_ITEMS.map((item) =>
              item.hasDropdown ? (
                <div
                  key={item.label}
                  className="relative py-2"
                  ref={dropRef}
                  onMouseEnter={() => setDropOpen(true)}
                  onMouseLeave={() => setDropOpen(false)}
                >
                  <button
                    className={`flex items-center gap-1.5 text-[11px] font-black uppercase tracking-widest transition-colors cursor-pointer border-none bg-transparent outline-none ${dropOpen ? "text-[#C5A059]" : "text-stone-300 hover:text-[#C5A059]"
                      }`}
                  >
                    {item.label}
                    <ChevronDown
                      className={`w-3.5 h-3.5 transition-transform duration-200 ${dropOpen ? "rotate-180 text-[#C5A059]" : "text-stone-400"
                        }`}
                    />
                  </button>

                  {dropOpen && (
                    <div className="absolute top-8 left-1/2 -translate-x-1/2 w-72 rounded-3xl bg-[#2B2118] backdrop-blur-2xl border border-[#C5A059]/20 shadow-[0_20px_60px_rgba(0,0,0,0.55)] overflow-hidden z-50 animate-fade-in">
                      <div className="p-2 space-y-0.5">
                        {SERVICE_LINKS.map((svc) => (
                          <button
                            key={svc.path}
                            onClick={() => handleNav(svc.path)}
                            className="w-full flex items-center gap-3.5 p-3 rounded-xl hover:bg-[#4A3728] transition-all group text-left border-none outline-none"
                          >
                            <div className="w-9 h-9 rounded-lg bg-[#3E362E] border border-stone-700/50 flex items-center justify-center text-[#C5A059] group-hover:bg-[#C5A059] group-hover:text-[#1E1A17] transition-all">
                              <svc.icon className="w-4 h-4" />
                            </div>
                            <div>
                              <p className="text-xs font-black uppercase tracking-wider text-white group-hover:text-[#C5A059] transition-colors">
                                {svc.label}
                              </p>
                              <p className="text-[10px] font-medium text-stone-400 mt-0.5">{svc.desc}</p>
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
                  onClick={() =>
                    item.section ? handleSectionNav(item.section) : handleNav(item.path)
                  }
                  className="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-widest text-stone-300 hover:text-[#C5A059] transition-colors cursor-pointer border-none bg-transparent outline-none"
                >
                  {item.label}
                </button>
              )
            )}
          </div>

          {/* ── RIGHT SIDE UTILITIES ── */}
          <div className="flex items-center gap-3">

            {/* ── LOGGED OUT ── */}
            {!isLoggedIn && (
              <>
                <button
                  onClick={() => handleNav("/login")}
                  className="hidden sm:flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-white border border-white/10 bg-white/[0.03] backdrop-blur-xl px-5 py-2.5 rounded-xl hover:border-[#C5A059]/40 hover:bg-white/[0.06] transition-all duration-300 cursor-pointer"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  Login
                </button>
                <button
                  onClick={() => handleNav("/customer/services")}
                  className="hidden sm:block rounded-xl bg-gradient-to-r from-[#C5A059] via-[#E8C878] to-[#C5A059] hover:scale-105 px-7 py-3 text-[10px] font-black uppercase tracking-[0.25em] text-[#1E1A17] shadow-[0_0_25px_rgba(197,160,89,0.35)] transition-all duration-300 cursor-pointer active:scale-[0.98] border-none"
                >
                  Book Now
                </button>
              </>
            )}

            {/* ── LOGGED IN: Profile Pill ── */}
            {isLoggedIn && user && (
              <div className="relative hidden sm:block" ref={profileRef}>
                <button
                  onClick={() => setProfileOpen((p) => !p)}
                  className={`flex items-center gap-2.5 pl-1.5 pr-3 py-1.5 rounded-full border transition-all duration-300 cursor-pointer ${
                    profileOpen
                      ? "border-[#C5A059]/50 bg-[#C5A059]/10"
                      : "border-[#C5A059]/15 bg-[#C5A059]/5 hover:border-[#C5A059]/40 hover:bg-[#C5A059]/10"
                  }`}
                >
                  {/* Avatar */}
                  <div className="relative">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#C5A059] to-[#b8860b] flex items-center justify-center text-[11px] font-black text-[#1E1A17] tracking-wide">
                      {user.initials}
                    </div>
                    {/* Online dot */}
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-[#1E1A17]" />
                  </div>

                  <div className="text-left">
                    <p className="text-[11px] font-bold text-white leading-none">{user.shortName}</p>
                    <p className="text-[9px] text-stone-400 font-semibold uppercase tracking-widest mt-0.5">{user.role}</p>
                  </div>

                  <ChevronDown
                    className={`w-3.5 h-3.5 text-stone-400 transition-transform duration-200 ${
                      profileOpen ? "rotate-180 text-[#C5A059]" : ""
                    }`}
                  />
                </button>

                {/* ── PROFILE DROPDOWN ── */}
                {profileOpen && (
                  <div className="absolute top-[calc(100%+10px)] right-0 w-56 rounded-2xl bg-[#1E1A17]/98 backdrop-blur-2xl border border-white/10 shadow-[0_24px_64px_rgba(0,0,0,0.6)] overflow-hidden z-50 animate-fade-in">
                    {/* Header */}
                    <div className="p-4 border-b border-white/[0.07]">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#C5A059] to-[#b8860b] flex items-center justify-center text-sm font-black text-[#1E1A17]">
                          {user.initials}
                        </div>
                        <div>
                          <p className="text-[13px] font-bold text-white">{user.name}</p>
                          <p className="text-[10px] text-stone-400 mt-0.5">{user.email}</p>
                          <span className="inline-block mt-1.5 px-2 py-0.5 rounded-full bg-[#C5A059]/15 border border-[#C5A059]/30 text-[9px] font-black uppercase tracking-wider text-[#C5A059]">
                            {user.role}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Links */}
                    <div className="p-2">
                      {profileLinks.map((link) => (
                        <button
                          key={link.path}
                          onClick={() => handleNav(link.path)}
                          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/[0.05] transition-all group text-left border-none outline-none"
                        >
                          <link.icon className="w-4 h-4 text-stone-500 group-hover:text-[#C5A059] transition-colors" />
                          <span className="text-[11px] font-bold text-stone-300 group-hover:text-white tracking-wide transition-colors">
                            {link.label}
                          </span>
                        </button>
                      ))}

                      <div className="my-1.5 mx-2 h-[1px] bg-white/[0.07]" />

                      {/* Logout */}
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-red-500/[0.08] transition-all group text-left border-none outline-none"
                      >
                        <LogOut className="w-4 h-4 text-red-400/70 group-hover:text-red-400 transition-colors" />
                        <span className="text-[11px] font-bold text-red-400/80 group-hover:text-red-400 tracking-wide transition-colors">
                          Sign Out
                        </span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Book Now always visible when logged in */}
            {isLoggedIn && (
              <button
                onClick={() => handleNav("/customer/services")}
                className="hidden sm:block rounded-xl bg-gradient-to-r from-[#C5A059] via-[#E8C878] to-[#C5A059] hover:scale-105 px-6 py-2.5 text-[10px] font-black uppercase tracking-[0.25em] text-[#1E1A17] shadow-[0_0_20px_rgba(197,160,89,0.3)] transition-all duration-300 cursor-pointer active:scale-[0.98] border-none"
              >
                Book Now
              </button>
            )}

            {/* ── MOBILE BURGER ── */}
            <button
              type="button"
              onClick={() => setMenuOpen(!menuOpen)}
              className="lg:hidden text-stone-300 hover:text-white transition-colors border-none bg-transparent"
            >
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* MOBILE MENU */}
        {menuOpen && (
          <div className="absolute top-full left-0 w-full lg:hidden px-5 pb-5 bg-[#1E1A17] border-t border-white/5 z-[10000] shadow-2xl">

            {NAV_ITEMS.map((item) => (
              <div key={item.label}>
                <button
                  onClick={() => {
                    if (item.hasDropdown) {
                      setMobileServicesOpen(!mobileServicesOpen);
                    } else if (item.section) {
                      handleSectionNav(item.section);
                    } else if (item.path) {
                      handleNav(item.path);
                    }
                  }}
                  className="flex items-center justify-between w-full text-xs font-black uppercase tracking-widest text-stone-300 hover:text-[#C5A059] py-3 border-b border-stone-800/40 bg-transparent transition-colors"
                >
                  {item.label}

                  {item.hasDropdown && (
                    <ChevronDown
                      className={`w-4 h-4 transition-transform ${dropOpen ? "rotate-180" : ""
                        }`}
                    />
                  )}
                </button>

                {item.hasDropdown && mobileServicesOpen && (
                  <div className="bg-[#1E1A17]/50 py-1 px-2 mb-2 rounded-xl border border-stone-800/30">
                    {SERVICE_LINKS.map((svc) => (
                      <Link
                        to={svc.path}
                        onClick={() => setMenuOpen(false)}
                        className="w-full flex items-center gap-3 p-3 hover:bg-[#2A241F] rounded-lg transition-all text-left"
                      >
                        <svc.icon className="w-3.5 h-3.5 text-[#C5A059]" />
                        <span className="text-[10px] font-bold text-white uppercase tracking-wider">
                          {svc.label}
                        </span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {!isLoggedIn ? (
              <div className="flex gap-2.5 mt-3">
                <button
                  onClick={() => handleNav("/login")}
                  className="flex-1 py-2.5 text-[10px] font-black uppercase tracking-wider text-white border border-white/10 rounded-xl"
                >
                  Login
                </button>

                <button
                  onClick={() => handleNav("/customer/services")}
                  className="flex-1 py-2.5 text-[10px] font-black uppercase tracking-wider text-[#1E1A17] bg-[#C5A059] rounded-xl"
                >
                  Book Now
                </button>
              </div>
            ) : (
              <>
                <div className="mt-2 pt-2 border-t border-stone-800/50">
                  {profileLinks.map((link) => (
                    <button
                      key={link.path}
                      onClick={() => handleNav(link.path)}
                      className="flex items-center gap-2.5 w-full text-left text-xs font-bold uppercase tracking-widest text-stone-400 hover:text-[#C5A059] py-2.5"
                    >
                      <link.icon className="w-3.5 h-3.5" />
                      {link.label}
                    </button>
                  ))}
                </div>

                <div className="flex gap-2.5 mt-3">
                  <button
                    onClick={handleLogout}
                    className="flex-1 py-2.5 text-[10px] font-black uppercase tracking-wider text-red-400 border border-red-500/20 rounded-xl"
                  >
                    Sign Out
                  </button>

                  <button
                    onClick={() => handleNav("/customer/services")}
                    className="flex-1 py-2.5 text-[10px] font-black uppercase tracking-wider text-[#1E1A17] bg-[#C5A059] rounded-xl"
                  >
                    Book Now
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </nav>
    </>
  );
};
export default Navbar;




