import React, { useState } from "react";
import { 
  Scissors, Plus, ToggleLeft, ToggleRight, Sparkles, 
  Clock, DollarSign, Layers, PlusCircle, Search, Edit2 
} from "lucide-react";
import Footer from "../../components/layout/Footer";

const GOLD = "#C5A059";
const CHARCOAL = "#3E362E";

// Mock Core Service Catalog Menu Configuration Data
const INITIAL_SERVICES = [
  { id: "SVC-101", name: "Classic Haircut", category: "Men", price: 299, duration: "30 min", active: true, popular: true },
  { id: "SVC-102", name: "Beard Trim & Shape", category: "Men", price: 199, duration: "20 min", active: true, popular: false },
  { id: "SVC-103", name: "Hair Spa & Detox Treatment", category: "Addon", price: 599, duration: "45 min", active: true, popular: true },
  { id: "SVC-104", name: "Premium Royal Grooming Combo", category: "Men", price: 799, duration: "60 min", active: true, popular: true },
  { id: "SVC-105", name: "Classic Shave & Hot Towel", category: "Men", price: 249, duration: "25 min", active: false, popular: false },
  { id: "SVC-106", name: "Luxury Charcoal Face Mask", category: "Addon", price: 349, duration: "15 min", active: true, popular: false },
];

export default function BarberServices() {
  const [services, setServices] = useState(INITIAL_SERVICES);
  const [activeCategory, setActiveCategory] = useState("all"); // "all" | "Men" | "Addon"
  const [searchQuery, setSearchQuery] = useState("");

  // Toggle Activation State mutation
  const toggleServiceStatus = (id) => {
    setServices(prev => prev.map(s => s.id === id ? { ...s, active: !s.active } : s));
  };

  // Filter Catalog Pipeline
  const filteredServices = services.filter(svc => {
    const matchesSearch = svc.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === "all" || svc.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    /* ✅ Structural flex parameters securely anchor your custom brand footer at the absolute viewport baseline */
    <div className="min-h-screen bg-[#FAF6F0] text-stone-800 font-sans antialiased flex flex-col justify-between">
      
      <div>
        {/* ── MAIN WORKSPACE CONTENT CANVAS ── */}
        <main className="max-w-6xl mx-auto w-full px-5 py-10 text-left">
          
          {/* Header Description Title Blocks */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4 border-b border-stone-200/60 pb-6">
            <div>
              <h1 className="text-3xl font-black tracking-tight text-stone-900 uppercase font-serif">
                Service <span className="text-[#C5A059]">Catalog</span>
              </h1>
              <p className="text-[10px] font-black uppercase tracking-widest text-[#A37B58] mt-1.5">
                Configure Treatment Durations, Seat Tiers, & Discovery Multipliers
              </p>
            </div>

            <div className="flex items-center gap-2 bg-white px-3.5 py-2 rounded-xl border border-stone-200/80 shadow-3xs w-fit">
              <Layers size={13} className="text-[#C5A059]" />
              <span className="text-[10px] font-black uppercase tracking-wider text-stone-500 font-mono">
                {services.filter(s => s.active).length} Active Subsets Operational
              </span>
            </div>
          </div>

          {/* ── CATALOG CONTROLS FILTER STRIP BAR ── */}
          <div className="bg-white border border-stone-200/80 rounded-2xl p-5 mb-6 shadow-3xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            
            {/* Search Input Field Box */}
            <div className="relative flex items-center flex-1 max-w-md">
              <Search size={15} className="absolute left-3.5 text-stone-400" />
              <input 
                type="text"
                placeholder="Search catalog services or add-on filters..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full bg-[#FAF6F0]/40 border border-stone-200 rounded-xl pl-10 pr-4 py-3 text-xs font-bold text-stone-800 placeholder-stone-400 focus:outline-none focus:border-[#C5A059] transition-all"
              />
            </div>

            {/* Filter buttons list matrix row */}
            <div className="flex items-center gap-2">
              {[
                { id: "all", label: "Complete Menu" },
                { id: "Men", label: "Grooming Set" },
                { id: "Addon", label: "Premium Addons" }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveCategory(tab.id)}
                  className={`px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer ${
                    activeCategory === tab.id 
                      ? "text-white shadow-xs" 
                      : "bg-stone-50 text-stone-500 border border-stone-200/60 hover:border-stone-400 hover:text-stone-800"
                  }`}
                  style={{ backgroundColor: activeCategory === tab.id ? CHARCOAL : "" }}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* ── DYNAMIC CATALOG CARDS GRID DISPLAY LAYER ── */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredServices.length === 0 ? (
              <div className="col-span-12 text-center py-16 bg-white border border-stone-200/50 rounded-2xl shadow-3xs text-stone-400 text-xs font-black uppercase tracking-widest">
                📭 No baseline treatment entries currently scale this configuration query.
              </div>
            ) : (
              filteredServices.map(svc => (
                <div 
                  key={svc.id} 
                  className={`card p-6 bg-white flex flex-col justify-between shadow-2xs hover:shadow-md transition-all border relative overflow-hidden ${
                    !svc.active ? "opacity-60 grayscale-[30%] border-stone-200" : "border-stone-200/60"
                  }`}
                >
                  {/* Popular Trend Sticker Tagline */}
                  {svc.active && svc.popular && (
                    <div className="absolute top-0 right-0">
                      <span className="inline-flex items-center gap-1 text-[8px] font-black uppercase tracking-widest text-emerald-800 bg-emerald-50 border-l border-b border-emerald-200/80 px-2.5 py-1 rounded-bl-xl shadow-3xs">
                        <Sparkles size={8} className="fill-emerald-500 stroke-none" /> High Demand
                      </span>
                    </div>
                  )}

                  {/* Top Credentials Stack */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-mono font-bold text-stone-400 bg-stone-50 px-2 py-0.5 rounded border border-stone-200/40">
                        {svc.id}
                      </span>
                      <span className="text-[9px] font-black uppercase tracking-wider text-stone-400">
                        {svc.category} Segment
                      </span>
                    </div>
                    
                    <h3 className="text-lg font-extrabold text-stone-900 tracking-tight leading-snug pt-1">
                      {svc.name}
                    </h3>
                    
                    {/* Operational parameters line elements row */}
                    <div className="flex items-center gap-4 pt-1.5 text-stone-500 text-xs font-bold">
                      <span className="flex items-center gap-1">
                        <Clock size={12} className="text-stone-400" /> {svc.duration}
                      </span>
                      <span className="flex items-center gap-0.5 text-stone-900 font-extrabold">
                        <DollarSign size={13} className="text-[#C5A059]" /> {svc.price} Baseline
                      </span>
                    </div>
                  </div>

                  {/* Activation Action Toggles Switch Row */}
                  <div className="flex items-center justify-between pt-5 mt-5 border-t border-stone-50">
                    <button type="button" className="text-[10px] font-black uppercase tracking-widest text-stone-400 hover:text-stone-900 transition-colors cursor-pointer flex items-center gap-1">
                      <Edit2 size={11} /> Modify
                    </button>

                    <div className="flex items-center gap-2">
                      <span className={`text-[9px] font-black uppercase tracking-wider ${svc.active ? "text-emerald-600" : "text-stone-400"}`}>
                        {svc.active ? "Bookable" : "Paused"}
                      </span>
                      <button 
                        type="button" 
                        onClick={() => toggleServiceStatus(svc.id)}
                        className="text-stone-400 hover:text-stone-900 transition-colors focus:outline-none cursor-pointer"
                      >
                        {svc.active ? (
                          <ToggleRight size={26} className="text-stone-800" fill={GOLD} strokeWidth={1} />
                        ) : (
                          <ToggleLeft size={26} className="text-stone-300" strokeWidth={1} />
                        )}
                      </button>
                    </div>
                  </div>

                </div>
              ))
            )}
          </div>

        </main>
      </div>

      {/* ── ✅ SYSTEM BASE BRAND FOOTER: Radial flashes snap exactly into place at baseline edge ── */}
      <Footer />

    </div>
  );
}