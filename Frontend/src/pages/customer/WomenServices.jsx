import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { ArrowLeft, Sparkles, SlidersHorizontal, Sparkle } from "lucide-react";
import SearchFilterHeader from "../../components/booking/SearchFilterHeader";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";

export default function WomenServices() {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState("all");

  const [filters, setFilters] = useState({
    search: "",
    cost: "",
    distance: "",
    rating: ""
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const categories = [
    { id: "all", label: "All Treatments" },
    { id: "styling", label: "Cuts & Styling" },
    { id: "color", label: "Color & Balayage" },
    { id: "spa", label: "Hair Rituals & Spa" }
  ];

  const services = [
    {
      name: "Haircut & Styling",
      price: 500,
      category: "styling",
      badge: "Signature",
      img: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=800"
    },
    {
      name: "Hair Coloring",
      price: 800,
      category: "color",
      badge: null,
      img: "https://images.unsplash.com/photo-1562322140-8baeececf3df?w=800"
    },
    {
      name: "Highlights & Balayage",
      price: 1000,
      category: "color",
      badge: "Trending",
      img: "https://static.showit.co/1200/jkhBAC8zTjOGSVP2KgBdTQ/219521/hair_on_2nd_avenue_balayage_and_coloring.jpg?w=800"
    },
    {
      name: "Hair Spa Treatment",
      price: 700,
      category: "spa",
      badge: "Premium Care",
      img: "https://res.klook.com/image/upload/w_750,h_469,c_fill,q_85/w_80,x_15,y_15,g_south_west,l_Klook_water_br_trans_yhcmh3/activities/fchn5h7dfr2mmbbw3nq4.jpg?w=800"
    }
  ];

  const getPriceRange = (cost) => {
    switch (cost) {
      case "under200": return [0, 200];
      case "200-500": return [200, 500];
      case "500-1000": return [500, 1000];
      case "above1000": return [1000, Infinity];
      default: return [0, Infinity];
    }
  };

  const filteredServices = services.filter((s) => {
    const [minPrice, maxPrice] = getPriceRange(filters.cost);
    const matchesCategory = activeCategory === "all" || s.category === activeCategory;
    const matchesSearch = s.name.toLowerCase().includes(filters.search.toLowerCase());
    const matchesPrice = s.price >= minPrice && s.price <= maxPrice;
    
    return matchesCategory && matchesSearch && matchesPrice;
  });

  return (
    <>
      <Navbar />
      <div className="bg-[#FAF6F0] min-h-screen font-sans text-[#3E362E] selection:bg-[#C5A059] selection:text-white relative overflow-hidden flex flex-col">
        
        {/* --- SHINY LUXURY GRADIENT GLOW LAYERS --- */}
        <div className="absolute top-80 -left-40 w-[600px] h-[600px] bg-gradient-to-br from-[#C5A059]/10 via-[#EADDCA]/20 to-transparent rounded-full blur-[120px] pointer-events-none animate-pulse duration-[8000ms]" />
        <div className="absolute bottom-1/3 right-10 w-[700px] h-[500px] bg-[#EADDCA]/30 rounded-full blur-[140px] pointer-events-none" />

        {/* Premium Hero Banner */}
        <div className="relative h-[380px] sm:h-[420px] flex items-center justify-center overflow-hidden mb-10">
          <div 
            className="absolute inset-0 bg-cover bg-center filter brightness-[0.35] scale-105 transform transition-transform duration-1000"
            style={{ backgroundImage: "url('https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?w=1600&q=80')" }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#FAF6F0] via-transparent to-black/50" />
          
          {/* RETURN BUTTON */}
          <div className="absolute top-6 left-4 sm:left-6 md:left-8 z-20">
            <button
              onClick={() => navigate("/")}
              className="group flex items-center gap-2.5 bg-white/10 backdrop-blur-md border border-white/20 px-5 py-2.5 rounded-2xl text-white font-black text-[10px] tracking-[0.2em] uppercase transition-all duration-300 shadow-sm hover:bg-white hover:text-[#3E362E] hover:border-white hover:scale-105 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-[#C5A059] transition-transform duration-300 transform group-hover:-translate-x-0.5" />
              <span>Return</span>
            </button>
          </div>

          <div className="relative z-10 text-center px-4 max-w-3xl mx-auto pt-8">
            <span className="text-[10px] font-black uppercase tracking-[0.4em] bg-white/10 backdrop-blur-md border border-white/20 px-4 py-1.5 rounded-full text-[#EADDCA] shadow-sm inline-block mb-4">
              Aesthetic Artistry
            </span>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight text-white font-serif leading-none">
              Women's <span className="text-[#C5A059] italic normal-case">Services</span>
            </h1>
            <div className="w-16 h-[1.5px] bg-[#C5A059] mx-auto mt-6 mb-5" />
            <p className="text-stone-300 text-xs sm:text-sm max-w-xl mx-auto font-light leading-relaxed tracking-wide">
              Bespoke styling, rich couture coloring, and rejuvenating hair rituals crafted to illuminate your natural elegance.
            </p>
          </div>
        </div>

        {/* Main Content Layout */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 relative z-10 flex-grow w-full">
          
          {/* QUICK CATEGORY PILLS */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 mb-8">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-5 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 cursor-pointer select-none ${
                  activeCategory === cat.id
                    ? "bg-[#3E362E] text-white shadow-md scale-105"
                    : "bg-white/80 text-[#3E362E] border border-[#EADDCA] backdrop-blur-md hover:bg-[#C5A059]/10"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Search & Filter Component Wrapper */}
          <div className="mb-12 bg-white/80 backdrop-blur-md p-4 rounded-[24px] border border-[#EADDCA] shadow-[0_8px_25px_rgba(0,0,0,0.01)] flex flex-col gap-2">
            <div className="flex items-center gap-2 px-2 pt-1 text-stone-400">
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#C5A059]" />
              <span className="text-[9px] font-black uppercase tracking-wider">Refinement Controls</span>
            </div>
            <SearchFilterHeader onFiltersChange={setFilters} />
          </div>

          {/* Services Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredServices.map((s, i) => (
              <div 
                key={i} 
                className="group bg-white rounded-[28px] overflow-hidden border border-[#EADDCA] shadow-[0_8px_25px_rgba(0,0,0,0.01)] hover:shadow-[0_22px_45px_rgba(62,54,46,0.06)] hover:border-[#C5A059]/30 transition-all duration-500 flex flex-col transform hover:-translate-y-1.5 relative"
              >
                {/* Dynamic Luxury Badge */}
                {s.badge && (
                  <span className="absolute top-4 left-4 z-20 bg-[#3E362E] text-[#C5A059] border border-[#C5A059]/30 text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg shadow-md backdrop-blur-md flex items-center gap-1">
                    <Sparkles className="w-2.5 h-2.5 fill-[#C5A059]/20" />
                    {s.badge}
                  </span>
                )}

                {/* Image Container with Shimmer Fade */}
                <div className="h-56 overflow-hidden relative bg-stone-100">
                  <div className="absolute inset-0 bg-black/5 z-10 group-hover:bg-transparent transition-colors duration-500" />
                  <img 
                    src={s.img} 
                    alt={s.name}
                    loading="lazy"
                    className="w-full h-full object-cover transform scale-100 group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                </div>

                {/* Service Details Card */}
                <div className="p-6 flex flex-col flex-grow justify-between bg-gradient-to-b from-white via-white to-[#FAF6F0]/20">
                  <div className="mb-6 text-left">
                    <span className="text-[9px] font-black text-stone-400 uppercase tracking-widest block mb-1">
                      {s.category} Ritual
                    </span>
                    <h3 className="font-serif font-bold text-xl text-[#3E362E] tracking-wide mb-3 group-hover:text-[#C5A059] transition-colors duration-300 min-h-[56px] flex items-start">
                      {s.name}
                    </h3>
                    <div className="flex items-baseline gap-1.5 border-t border-[#FAF6F0] pt-3">
                      <span className="text-[9px] font-black text-stone-400 uppercase tracking-wider">Starting at</span>
                      <span className="text-2xl font-serif font-black text-[#3E362E]">₹{s.price}</span>
                    </div>
                  </div>

                  <button
                    onClick={() =>
                      navigate("/customer/barber", {
                        state: { service: s }
                      })
                    }
                    className="w-full bg-[#3E362E] text-white py-4 px-4 rounded-xl font-black text-[10px] tracking-[0.2em] uppercase transition-all duration-300 group-hover:bg-[#C5A059] group-hover:text-[#2A241F] shadow-sm cursor-pointer select-none flex items-center justify-center gap-2"
                  >
                    <Sparkle className="w-3.5 h-3.5" />
                    <span>Select Service</span>
                  </button>
                </div>
              </div>
            ))}

            {/* Empty Fallback State */}
            {filteredServices.length === 0 && (
              <div className="col-span-full text-center py-20 bg-white/60 backdrop-blur-md rounded-[32px] border border-dashed border-[#EADDCA] px-4">
                <div className="w-12 h-12 rounded-full bg-[#FAF6F0] border border-[#EADDCA] flex items-center justify-center mx-auto mb-4 text-stone-400">
                  <Sparkle className="w-4 h-4 text-stone-400" />
                </div>
                <h4 className="text-xs font-black uppercase tracking-widest text-[#3E362E] mb-1">No matches found</h4>
                <p className="text-[11px] text-stone-400 font-light max-w-xs mx-auto">Try selecting a different filter pill or adjusting your price limits.</p>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}