import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import SearchFilterHeader from "../../components/booking/SearchFilterHeader";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";

export default function AddonServices() {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState("all");

  const [filters, setFilters] = useState({
    search: "",
    cost: "",
    distance: "",
    rating: ""
  });

  // Reset window scroll position cleanly on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const categories = [
    { id: "all", label: "All Add-ons" },
    { id: "massage", label: "Relaxing Massages" },
    { id: "treatment", label: "Premium Care" },
    { id: "color", label: "Color Enhancers" }
  ];

  const services = [
    {
      name: "Head Massage",
      price: 150,
      category: "massage",
      badge: "Most Popular",
      img: "https://res.klook.com/image/upload/w_750,h_469,c_fill,q_85/w_80,x_15,y_15,g_south_west,l_Klook_water_br_trans_yhcmh3/activities/fchn5h7dfr2mmbbw3nq4.jpg?w=800"
    },
    {
      name: "Hair Treatment",
      price: 600,
      category: "treatment",
      badge: "Indulgent",
      img: "https://images.unsplash.com/photo-1580618672591-eb180b1a973f?w=800"
    },
    {
      name: "Hair Coloring Add-on",
      price: 500,
      category: "color",
      badge: "Express Glow",
      img: "https://media.istockphoto.com/id/1305824214/photo/woman-dyeing-her-hair-at-the-salon.jpg?s=612x612&w=0&k=20&c=Jk2XQqn-5Tf1IeUPhmLYMP1Lq2nSlW_0udRXzc_KAJI="
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
        <div className="absolute top-20 -left-40 w-[600px] h-[600px] bg-gradient-to-br from-[#C5A059]/10 via-[#EADDCA]/20 to-transparent rounded-full blur-[120px] pointer-events-none animate-pulse duration-[8000ms]" />
        <div className="absolute bottom-1/3 right-10 w-[700px] h-[500px] bg-[#EADDCA]/30 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-[500px] h-[500px] bg-[#C5A059]/10 rounded-full blur-[100px] pointer-events-none" />

        {/* Premium Hero Banner */}
        <div className="relative h-[380px] sm:h-[420px] flex items-center justify-center overflow-hidden mb-6">
          <div 
            className="absolute inset-0 bg-cover bg-center filter brightness-[0.4] scale-105 transform transition-transform duration-1000"
            style={{ backgroundImage: "url('https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=1600&q=80')" }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#FAF6F0] via-transparent to-black/50" />
          
          {/* RETURN BACK BUTTON (Top Left) */}
          <div className="absolute top-6 left-4 sm:left-6 md:left-8 z-20">
            <button
              onClick={() => navigate(-1)}
              className="group flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 rounded-xl text-white font-medium text-xs tracking-wide transition-all duration-300 shadow-md hover:bg-white hover:text-[#3E362E] hover:border-white cursor-pointer"
            >
              <span className="text-sm font-light text-[#C5A059] group-hover:text-[#3E362E] transition-transform duration-300 inline-block">
                &lt;
              </span>
              <span>Back</span>
            </button>
          </div>

          <div className="relative z-10 text-center px-4 max-w-3xl mx-auto">
            <span className="text-[10px] font-black uppercase tracking-[0.4em] bg-white/10 backdrop-blur-md border border-white/20 px-4 py-1.5 rounded-full text-[#EADDCA] shadow-sm inline-block mb-4">
              Custom Enhancements
            </span>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight text-white font-serif leading-none">
              Add-On <span className="text-[#C5A059] italic normal-case">Services</span>
            </h1>
            <div className="w-16 h-[2px] bg-[#C5A059] mx-auto mt-6 mb-4" />
            <p className="text-stone-300 text-xs sm:text-sm md:text-base max-w-xl mx-auto font-light leading-relaxed">
              Enhance your ritual with therapeutic extras and premium upgrades. Tailored rituals that make every individual visit feel distinctly more indulgent.
            </p>
          </div>
        </div>

        {/* Main Content Layout */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 relative z-10 flex-grow w-full">
          
          {/* Search & Filter Component Wrapper */}
          <div className="mb-8 bg-white/80 backdrop-blur-xl p-4 rounded-3xl border border-white/60 shadow-[0_15px_40px_rgba(197,160,89,0.03)]">
            <SearchFilterHeader onFiltersChange={setFilters} />
          </div>

          {/* QUICK CATEGORY PILLS */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all duration-300 cursor-pointer select-none ${
                  activeCategory === cat.id
                    ? "bg-[#3E362E] text-white shadow-md scale-105"
                    : "bg-white/80 backdrop-blur-md text-[#3E362E] border border-[#EADDCA] hover:bg-[#C5A059]/10"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Services Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 justify-center">
            {filteredServices.map((s, i) => (
              <div 
                key={i} 
                className="group bg-white/90 backdrop-blur-md rounded-[28px] overflow-hidden border border-[#EADDCA] shadow-[0_10px_30px_rgba(0,0,0,0.02)] hover:shadow-[0_25px_50px_rgba(62,54,46,0.08)] hover:border-[#C5A059]/40 transition-all duration-500 flex flex-col transform hover:-translate-y-1.5 relative"
              >
                {/* Dynamic Luxury Badge */}
                {s.badge && (
                  <span className="absolute top-4 left-4 z-20 bg-[#3E362E] text-[#C5A059] border border-[#C5A059]/30 text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-lg shadow-md">
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
                <div className="p-6 flex flex-col flex-grow justify-between bg-gradient-to-b from-white to-[#FAF6F0]/20">
                  <div className="mb-6">
                    <h3 className="font-serif font-bold text-xl text-[#3E362E] tracking-wide mb-2 group-hover:text-[#C5A059] transition-colors duration-300">
                      {s.name}
                    </h3>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-[11px] font-medium text-stone-400 uppercase tracking-wider">Starting at</span>
                      <span className="text-xl font-black text-[#3E362E]">₹{s.price}</span>
                    </div>
                  </div>

                  <button
                    onClick={() =>
                      navigate("/customer/barber", {
                        state: { service: s }
                      })
                    }
                    className="w-full bg-[#3E362E] text-white py-3.5 px-4 rounded-xl font-black text-[10px] tracking-[0.2em] uppercase transition-all duration-300 group-hover:bg-[#C5A059] group-hover:text-[#2A241F] shadow-sm cursor-pointer select-none"
                  >
                    Select Service
                  </button>
                </div>
              </div>
            ))}

            {/* Empty Fallback State */}
            {filteredServices.length === 0 && (
              <div className="col-span-full text-center py-20 bg-white/40 backdrop-blur-md rounded-[32px] border border-dashed border-[#EADDCA] px-4">
                <div className="w-12 h-12 rounded-full bg-stone-100 flex items-center justify-center mx-auto mb-4 text-stone-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h4 className="text-sm font-bold uppercase tracking-wider text-[#3E362E] mb-1">No matches found</h4>
                <p className="text-xs text-stone-400 font-light max-w-xs mx-auto">Try selecting a different filter pill or adjusting your price limits.</p>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}