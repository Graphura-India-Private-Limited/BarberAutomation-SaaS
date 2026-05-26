import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function ServiceCategories() {
  const navigate = useNavigate();

  // विंडो स्क्रोल रिसेट
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const categories = [
    {
      title: "Men Services",
      desc: "Architectural cuts, razor-sharp beard styling, and premium treatments engineered for the modern gentleman.",
      img: "https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=800&q=80",
      path: "/customer/services/men"
    },
    {
      title: "Women Services",
      desc: "Bespoke styling, rich couture coloring, and rejuvenating hair rituals crafted to illuminate your natural elegance.",
      img: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=800&q=80",
      path: "/customer/services/women"
    },
    {
      title: "Add-On Services",
      desc: "Enhance your main ritual with therapeutic head massages, express treatments, and premium upgrades.",
      img: "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=800&q=80",
      path: "/customer/services/addon"
    }
  ];

  return (
    <div className="bg-[#FAF6F0] min-h-screen font-sans text-[#3E362E] selection:bg-[#C5A059] selection:text-white">
      
      {/* Premium Hero Banner */}
      <div className="relative h-[380px] sm:h-[420px] flex items-center justify-center overflow-hidden mb-12">
        <div 
          className="absolute inset-0 bg-cover bg-center filter brightness-[0.4] scale-105 transform transition-transform duration-1000"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1560066984-138dadb4c035?w=1600&q=80')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#FAF6F0] via-transparent to-black/40" />
        
        {/* Subtle Ambient Glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#C5A059]/10 rounded-full blur-3xl pointer-events-none" />
        
        {/* RETURN BUTTON (Top Left Corner) */}
        <div className="absolute top-6 left-4 sm:left-6 md:left-8 z-20">
          <button
            onClick={() => navigate("/")}
            className="group flex items-center gap-3 bg-white/10 backdrop-blur-md border border-white/20 px-5 py-2.5 rounded-2xl text-white font-black text-[11px] uppercase tracking-[0.2em] transition-all duration-300 shadow-sm hover:bg-white hover:text-[#3E362E] hover:border-white hover:scale-105 cursor-pointer"
          >
            <span className="text-sm font-light text-[#C5A059] transition-transform duration-300 transform group-hover:-translate-x-1 inline-block">
              &lt;
            </span>
            <span className="relative">Return</span>
          </button>
        </div>

        <div className="relative z-10 text-center px-4 max-w-3xl mx-auto">
          <span className="text-[10px] font-black uppercase tracking-[0.4em] bg-white/10 backdrop-blur-md border border-white/20 px-4 py-1.5 rounded-full text-[#EADDCA] shadow-sm inline-block mb-4">
            The Luxury Experience
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight text-white font-serif leading-none">
            Our Service <span className="text-[#C5A059] italic normal-case">Categories</span>
          </h1>
          <div className="w-16 h-[2px] bg-[#C5A059] mx-auto mt-6 mb-4" />
          <p className="text-stone-300 text-xs sm:text-sm md:text-base max-w-xl mx-auto font-light leading-relaxed">
            Select a specialized category below to explore our meticulously curated treatments designed for your absolute rejuvenation.
          </p>
        </div>
      </div>

      {/* Grid Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 justify-center">
          {categories.map((cat, i) => (
            <div 
              key={i} 
              className="group bg-white rounded-[28px] overflow-hidden border border-[#EADDCA] shadow-sm hover:shadow-[0_22px_45px_rgba(62,54,46,0.08)] hover:border-[#C5A059]/40 transition-all duration-500 flex flex-col transform hover:-translate-y-2"
            >
              {/* Image Container with Smooth Zoom */}
              <div className="h-64 overflow-hidden relative bg-stone-100">
                <div className="absolute inset-0 bg-black/10 z-10 group-hover:bg-transparent transition-colors duration-500" />
                <img 
                  src={cat.img} 
                  alt={cat.title}
                  loading="lazy"
                  className="w-full h-full object-cover transform scale-100 group-hover:scale-105 transition-transform duration-700 ease-out"
                />
              </div>

              {/* Category Details Card */}
              <div className="p-8 flex flex-col flex-grow justify-between bg-gradient-to-b from-white to-[#FAF6F0]/10">
                <div className="mb-6">
                  <h3 className="font-serif font-bold text-2xl text-[#3E362E] tracking-wide mb-3 group-hover:text-[#C5A059] transition-colors duration-300">
                    {cat.title}
                  </h3>
                  <p className="text-stone-500 text-sm font-light leading-relaxed">
                    {cat.desc}
                  </p>
                </div>

                <button
                  onClick={() => navigate(cat.path)}
                  className="w-full bg-[#3E362E] text-white py-4 px-4 rounded-xl font-black text-[10px] tracking-[0.2em] uppercase transition-all duration-300 group-hover:bg-[#C5A059] group-hover:text-[#2A241F] shadow-sm cursor-pointer select-none"
                >
                  Explore Services
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}