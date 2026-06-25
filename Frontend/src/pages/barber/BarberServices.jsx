import React, { useState } from "react";
import {
  Scissors, Plus, ToggleLeft, ToggleRight, Sparkles,
  Clock, DollarSign, Layers, PlusCircle, Search, Edit2
} from "lucide-react";

const GOLD = "#C5A059";
const CHARCOAL = "#3E362E";

// Mock Core Service Catalog Menu Configuration Data
const INITIAL_SERVICES = [
  // Men's Services (40)
  { id: "SVC-101", name: "Classic Executive Cut", category: "Men", price: 350, duration: "35 min", active: true, popular: true },
  { id: "SVC-102", name: "Modern Fade (Skin/Low/Drop)", category: "Men", price: 450, duration: "40 min", active: true, popular: true },
  { id: "SVC-103", name: "Premium Keratin Infusion", category: "Men", price: 2200, duration: "90 min", active: true, popular: true },
  { id: "SVC-104", name: "Indian Wedding Grooming", category: "Men", price: 1500, duration: "60 min", active: true, popular: true },
  { id: "SVC-105", name: "Kids' Style Cut", category: "Men", price: 250, duration: "25 min", active: true, popular: false },
  { id: "SVC-106", name: "Slick Back Classic Pompadour", category: "Men", price: 500, duration: "45 min", active: true, popular: true },
  { id: "SVC-107", name: "Buzz Cut & Edge-up", category: "Men", price: 200, duration: "20 min", active: true, popular: false },
  { id: "SVC-108", name: "Textured Crop Fade", category: "Men", price: 400, duration: "40 min", active: true, popular: true },
  { id: "SVC-109", name: "Bollywood Premium Styling", category: "Men", price: 800, duration: "45 min", active: true, popular: true },
  { id: "SVC-110", name: "Scalp Detox & Cut Combo", category: "Men", price: 900, duration: "50 min", active: true, popular: false },
  
  { id: "SVC-111", name: "Beard Sculpting", category: "Men", price: 250, duration: "30 min", active: true, popular: true },
  { id: "SVC-112", name: "Royal Shave Ritual", category: "Men", price: 450, duration: "40 min", active: true, popular: true },
  { id: "SVC-113", name: "Beard Hydration & Wash", category: "Men", price: 300, duration: "25 min", active: true, popular: false },
  { id: "SVC-114", name: "Mustache Styling & Trim", category: "Men", price: 150, duration: "15 min", active: true, popular: false },
  { id: "SVC-115", name: "Charcoal Beard Softening", category: "Men", price: 400, duration: "30 min", active: true, popular: true },
  { id: "SVC-116", name: "Signature Hot Towel Shave", category: "Men", price: 350, duration: "30 min", active: true, popular: true },
  { id: "SVC-117", name: "Beard Color Touch-up", category: "Men", price: 500, duration: "35 min", active: true, popular: false },
  { id: "SVC-118", name: "Indian Royal Beard Styling", category: "Men", price: 600, duration: "45 min", active: true, popular: true },
  { id: "SVC-119", name: "Detox Clay Beard Mask", category: "Men", price: 450, duration: "30 min", active: true, popular: false },
  { id: "SVC-120", name: "Classic Clean Shave", category: "Men", price: 200, duration: "20 min", active: true, popular: false },
  
  { id: "SVC-121", name: "Gentleman's Facial", category: "Men", price: 800, duration: "45 min", active: true, popular: true },
  { id: "SVC-122", name: "Scalp Revitalize Massage", category: "Men", price: 400, duration: "30 min", active: true, popular: false },
  { id: "SVC-123", name: "Indian Ayurvedic Head Massage", category: "Men", price: 500, duration: "35 min", active: true, popular: true },
  { id: "SVC-124", name: "Detoxifying Charcoal Mask", category: "Men", price: 600, duration: "30 min", active: true, popular: false },
  { id: "SVC-125", name: "Premium Face & Neck Massage", category: "Men", price: 550, duration: "30 min", active: true, popular: false },
  { id: "SVC-126", name: "Tan Removal Peel-off Mask", category: "Men", price: 450, duration: "25 min", active: true, popular: true },
  { id: "SVC-127", name: "Anti-Stress Neck & Shoulder Rub", category: "Men", price: 400, duration: "20 min", active: true, popular: false },
  { id: "SVC-128", name: "Hydrating Aloe Vera Facial", category: "Men", price: 700, duration: "40 min", active: true, popular: false },
  { id: "SVC-129", name: "Ice Cool Mint Scalp Massage", category: "Men", price: 450, duration: "25 min", active: true, popular: true },
  { id: "SVC-130", name: "Aromatherapy Facial Spa", category: "Men", price: 1200, duration: "50 min", active: true, popular: true },
  
  { id: "SVC-131", name: "Grey Blending", category: "Men", price: 1000, duration: "60 min", active: true, popular: false },
  { id: "SVC-132", name: "Global Hair Highlight", category: "Men", price: 1499, duration: "75 min", active: true, popular: true },
  { id: "SVC-133", name: "Beard Global Coloring", category: "Men", price: 600, duration: "40 min", active: true, popular: false },
  { id: "SVC-134", name: "Root Touch-Up (Men)", category: "Men", price: 800, duration: "45 min", active: true, popular: true },
  { id: "SVC-135", name: "Fashion Streaks (Per Streak)", category: "Men", price: 300, duration: "30 min", active: true, popular: false },
  { id: "SVC-136", name: "Ammonia-Free Organic Color", category: "Men", price: 1200, duration: "60 min", active: true, popular: true },
  { id: "SVC-137", name: "Premium Beard Glossing", category: "Men", price: 500, duration: "30 min", active: true, popular: false },
  { id: "SVC-138", name: "Platinum Blonde Highlights", category: "Men", price: 1999, duration: "90 min", active: true, popular: true },
  { id: "SVC-139", name: "Natural Henna Treatment", category: "Men", price: 500, duration: "60 min", active: true, popular: false },
  { id: "SVC-140", name: "Mustache & Beard Color Combo", category: "Men", price: 900, duration: "50 min", active: true, popular: true },

  // Women's Services (40)
  { id: "SVC-141", name: "Precision Cut & Blow Dry", category: "Women", price: 750, duration: "60 min", active: true, popular: true },
  { id: "SVC-142", name: "Bridal Style & Updo", category: "Women", price: 2999, duration: "90 min", active: true, popular: true },
  { id: "SVC-143", name: "Couture Hair Styling (Curling/Straightening)", category: "Women", price: 1200, duration: "45 min", active: true, popular: false },
  { id: "SVC-144", name: "Layered Cut & Blowout", category: "Women", price: 999, duration: "60 min", active: true, popular: true },
  { id: "SVC-145", name: "Creative Hair Makeover", category: "Women", price: 1500, duration: "75 min", active: true, popular: false },
  { id: "SVC-146", name: "Express Hair Wash & Blow Dry", category: "Women", price: 499, duration: "30 min", active: true, popular: false },
  { id: "SVC-147", name: "Kids Girls Styling & Cut", category: "Women", price: 400, duration: "35 min", active: true, popular: false },
  { id: "SVC-148", name: "Bollywood Signature Blowout", category: "Women", price: 1100, duration: "50 min", active: true, popular: true },
  { id: "SVC-149", name: "Anti-Frizz Hair Styling", category: "Women", price: 800, duration: "40 min", active: true, popular: false },
  { id: "SVC-150", name: "Premium Hot Iron Styling", category: "Women", price: 1300, duration: "50 min", active: true, popular: true },
  
  { id: "SVC-151", name: "Global Hair Coloring", category: "Women", price: 2199, duration: "100 min", active: true, popular: false },
  { id: "SVC-152", name: "Signature Balayage", category: "Women", price: 3999, duration: "150 min", active: true, popular: true },
  { id: "SVC-153", name: "Ammonia-Free Root Touchup", category: "Women", price: 999, duration: "45 min", active: true, popular: false },
  { id: "SVC-154", name: "Ombre Hair Transformation", category: "Women", price: 4499, duration: "160 min", active: true, popular: true },
  { id: "SVC-155", name: "Fashion Color Streaks (3 Foils)", category: "Women", price: 899, duration: "50 min", active: true, popular: false },
  { id: "SVC-156", name: "Blonde Highlights Accent", category: "Women", price: 2499, duration: "90 min", active: true, popular: true },
  { id: "SVC-157", name: "Indian Henna Pack Application", category: "Women", price: 799, duration: "70 min", active: true, popular: false },
  { id: "SVC-158", name: "Shine Toner & Color Glaze", category: "Women", price: 1499, duration: "60 min", active: true, popular: false },
  { id: "SVC-159", name: "Full Global Highlights", category: "Women", price: 4999, duration: "180 min", active: true, popular: true },
  { id: "SVC-160", name: "Crown Area Highlights Touch-up", category: "Women", price: 1999, duration: "90 min", active: true, popular: true },
  
  { id: "SVC-161", name: "Organic Oil Head Massage", category: "Women", price: 450, duration: "30 min", active: true, popular: false },
  { id: "SVC-162", name: "Hydrating Hair Spa", category: "Women", price: 999, duration: "50 min", active: true, popular: true },
  { id: "SVC-163", name: "Therapeutic Scalp Cleansing", category: "Women", price: 1200, duration: "45 min", active: true, popular: true },
  { id: "SVC-164", name: "Relaxing Neck & Back Therapy", category: "Women", price: 800, duration: "35 min", active: true, popular: false },
  { id: "SVC-165", name: "Anti-Dandruff Scalp Treatment", category: "Women", price: 1100, duration: "50 min", active: true, popular: false },
  { id: "SVC-166", name: "Intense Nourishing Cream Spa", category: "Women", price: 1299, duration: "60 min", active: true, popular: true },
  { id: "SVC-167", name: "Ayurvedic Hair Vitality Ritual", category: "Women", price: 1399, duration: "70 min", active: true, popular: true },
  { id: "SVC-168", name: "Detoxifying Charcoal Spa", category: "Women", price: 1199, duration: "50 min", active: true, popular: false },
  { id: "SVC-169", name: "Deep Moisture Oil Therapy", category: "Women", price: 600, duration: "40 min", active: true, popular: true },
  { id: "SVC-170", name: "Aromatic Scalp Soothing Treatment", category: "Women", price: 950, duration: "45 min", active: true, popular: true },
  
  { id: "SVC-171", name: "Cysteine Smoothing Treatment", category: "Women", price: 4999, duration: "180 min", active: true, popular: true },
  { id: "SVC-172", name: "Advanced Keratin Therapy", category: "Women", price: 3499, duration: "120 min", active: true, popular: true },
  { id: "SVC-173", name: "Olaplex Damage Repair", category: "Women", price: 1800, duration: "60 min", active: true, popular: false },
  { id: "SVC-174", name: "Pro-Keratin Shine Therapy", category: "Women", price: 2999, duration: "110 min", active: true, popular: true },
  { id: "SVC-175", name: "Anti-Hairfall Laser Therapy", category: "Women", price: 5999, duration: "90 min", active: true, popular: true },
  { id: "SVC-176", name: "Biotin Nourishing Infusion", category: "Women", price: 3200, duration: "80 min", active: true, popular: false },
  { id: "SVC-177", name: "Volume-Boost Root Treatment", category: "Women", price: 1500, duration: "45 min", active: true, popular: false },
  { id: "SVC-178", name: "Organic Frizz-Free Smoothing", category: "Women", price: 4500, duration: "150 min", active: true, popular: true },
  { id: "SVC-179", name: "Silk Protein Glazing", category: "Women", price: 2200, duration: "70 min", active: true, popular: false },
  { id: "SVC-180", name: "Scalp Hydradermie Treatment", category: "Women", price: 2500, duration: "60 min", active: true, popular: true },

  // Addon Services (30)
  { id: "SVC-181", name: "Aromatherapy Scalp Massage", category: "Addon", price: 299, duration: "20 min", active: true, popular: true },
  { id: "SVC-182", name: "Acupressure Shoulder Relief", category: "Addon", price: 399, duration: "25 min", active: true, popular: false },
  { id: "SVC-183", name: "Charcoal Beard Detox", category: "Addon", price: 449, duration: "20 min", active: true, popular: true },
  { id: "SVC-184", name: "Relaxing Foot Reflexology", category: "Addon", price: 350, duration: "20 min", active: true, popular: false },
  { id: "SVC-185", name: "Warm Herbal Oil Champo", category: "Addon", price: 250, duration: "15 min", active: true, popular: true },
  { id: "SVC-186", name: "Quick Eye Stress Relief", category: "Addon", price: 199, duration: "10 min", active: true, popular: false },
  { id: "SVC-187", name: "Face Roller Massage", category: "Addon", price: 150, duration: "10 min", active: true, popular: false },
  { id: "SVC-188", name: "Deep Back Relief", category: "Addon", price: 450, duration: "25 min", active: true, popular: true },
  { id: "SVC-189", name: "Mint Cooling Champo", category: "Addon", price: 299, duration: "20 min", active: true, popular: false },
  { id: "SVC-190", name: "Head & Temples Rub", category: "Addon", price: 199, duration: "15 min", active: true, popular: false },
  
  { id: "SVC-191", name: "Deep Conditioning Mask", category: "Addon", price: 499, duration: "30 min", active: true, popular: false },
  { id: "SVC-192", name: "Express Keratin Booster", category: "Addon", price: 799, duration: "40 min", active: true, popular: true },
  { id: "SVC-193", name: "Instant Bond-Repair Shield", category: "Addon", price: 1199, duration: "30 min", active: true, popular: true },
  { id: "SVC-194", name: "Anti-Frizz Serum Infusion", category: "Addon", price: 599, duration: "20 min", active: true, popular: false },
  { id: "SVC-195", name: "Citrus Scalp Scrub", category: "Addon", price: 699, duration: "25 min", active: true, popular: true },
  { id: "SVC-196", name: "Protein Nourishing Spray", category: "Addon", price: 299, duration: "15 min", active: true, popular: false },
  { id: "SVC-197", name: "Leave-in Moroccan Argan Shot", category: "Addon", price: 399, duration: "15 min", active: true, popular: true },
  { id: "SVC-198", name: "Volumizing Root Boost", category: "Addon", price: 499, duration: "20 min", active: true, popular: false },
  { id: "SVC-199", name: "Scalp Cooling Serum Ampoule", category: "Addon", price: 550, duration: "15 min", active: true, popular: false },
  { id: "SVC-200", name: "Split-End Prevention treatment", category: "Addon", price: 450, duration: "20 min", active: true, popular: true },
  
  { id: "SVC-201", name: "Premium Shine Glaze / Toner", category: "Addon", price: 999, duration: "45 min", active: true, popular: false },
  { id: "SVC-202", name: "Silver / Grey Glossing", category: "Addon", price: 899, duration: "30 min", active: true, popular: false },
  { id: "SVC-203", name: "Gold Highlights Accents (2 foils)", category: "Addon", price: 599, duration: "30 min", active: true, popular: true },
  { id: "SVC-204", name: "Color Protect Lock Sealant", category: "Addon", price: 499, duration: "20 min", active: true, popular: false },
  { id: "SVC-205", name: "Hair Gloss & Luster Spa", category: "Addon", price: 799, duration: "30 min", active: true, popular: true },
  { id: "SVC-206", name: "Copper / Caramel Glaze Refresher", category: "Addon", price: 899, duration: "35 min", active: true, popular: false },
  { id: "SVC-207", name: "Fashion Streaks booster", category: "Addon", price: 399, duration: "20 min", active: true, popular: false },
  { id: "SVC-208", name: "Root Shadow blending", category: "Addon", price: 699, duration: "30 min", active: true, popular: true },
  { id: "SVC-209", name: "Ammonia-Free color gloss", category: "Addon", price: 750, duration: "25 min", active: true, popular: false },
  { id: "SVC-210", name: "Balayage glow booster", category: "Addon", price: 899, duration: "30 min", active: true, popular: true }
];

export default function BarberServices() {
  const [services, setServices] = useState(INITIAL_SERVICES);
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedService, setSelectedService] = useState(null);
  const [editForm, setEditForm] = useState({
    name: "",
    price: "",
    duration: "",
    category: ""
  });

  // Header States
  const profile = { salonName: "Master Barber Lounge", initials: "MB" };

  const toggleServiceStatus = (id) => {
    setServices(prev => prev.map(s => s.id === id ? { ...s, active: !s.active } : s));
  };

  const saveServiceChanges = () => {
    setServices(prev =>
      prev.map(service =>
        service.id === selectedService.id
          ? {
            ...service,
            name: editForm.name,
            price: Number(editForm.price),
            duration: editForm.duration,
            category: editForm.category
          }
          : service
      )
    );

    setSelectedService(null);
  };

  const filteredServices = services.filter(svc => {
    const matchesSearch = svc.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === "all" || svc.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="w-full text-stone-800 font-sans antialiased flex flex-col">

      <div>
        <main className="max-w-6xl mx-auto w-full px-5 py-10 text-left">

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

          <div className="bg-white border border-stone-200/80 rounded-2xl p-5 mb-6 shadow-3xs flex flex-col md:flex-row md:items-center justify-between gap-4">
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

            <div className="flex items-center gap-2">
              {[
                { id: "all", label: "Complete Menu" },
                { id: "Men", label: "Men's Grooming" },
                { id: "Women", label: "Women's Styling" },
                { id: "Addon", label: "Premium Addons" }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveCategory(tab.id)}
                  className={`px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer ${activeCategory === tab.id
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredServices.length === 0 ? (
              <div className="col-span-12 text-center py-16 bg-white border border-stone-200/50 rounded-2xl shadow-3xs text-stone-400 text-xs font-black uppercase tracking-widest">
                📭 No baseline treatment entries currently scale this configuration query.
              </div>
            ) : (
              filteredServices.map(svc => (
                <div
                  key={svc.id}
                  className={`card p-6 bg-white flex flex-col justify-between shadow-2xs hover:shadow-md transition-all border relative overflow-hidden ${!svc.active ? "opacity-60 grayscale-[30%] border-stone-200" : "border-stone-200/60"
                    }`}
                >
                  {svc.active && svc.popular && (
                    <div className="absolute top-0 right-0">
                      <span className="inline-flex items-center gap-1 text-[8px] font-black uppercase tracking-widest text-emerald-800 bg-emerald-50 border-l border-b border-emerald-200/80 px-2.5 py-1 rounded-bl-xl shadow-3xs">
                        <Sparkles size={8} className="fill-emerald-500 stroke-none" /> High Demand
                      </span>
                    </div>
                  )}

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

                    <div className="flex items-center gap-4 pt-1.5 text-stone-500 text-xs font-bold">
                      <span className="flex items-center gap-1">
                        <Clock size={12} className="text-stone-400" /> {svc.duration}
                      </span>
                      <span className="flex items-center gap-0.5 text-stone-900 font-extrabold">
                        <DollarSign size={13} className="text-[#C5A059]" /> {svc.price} Baseline
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-5 mt-5 border-t border-stone-50">
                    {/* <button type="button" className="text-[10px] font-black uppercase tracking-widest text-stone-400 hover:text-stone-900 transition-colors cursor-pointer flex items-center gap-1">
                      <Edit2 size={11} /> Modify
                    </button> */}

                    <button
                      type="button"
                      // onClick={() => setSelectedService(svc)}
                      onClick={() => {
                        setSelectedService(svc);

                        setEditForm({
                          name: svc.name,
                          price: svc.price,
                          duration: svc.duration,
                          category: svc.category
                        });
                      }}
                      className="text-[10px] font-black uppercase tracking-widest text-stone-400 hover:text-stone-900 transition-colors cursor-pointer flex items-center gap-1"
                    >
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

      {selectedService && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl w-[400px] shadow-xl">
            <h2 className="text-xl font-bold mb-4">
              {selectedService.name}
            </h2>

            {/* <p>Price: ₹{selectedService.price}</p>
            <p>Duration: {selectedService.duration}</p>
            <p>Category: {selectedService.category}</p> */}

            <div className="space-y-3 mt-4">

              <input
                value={editForm.name}
                onChange={(e) =>
                  setEditForm({ ...editForm, name: e.target.value })
                }
                className="w-full border p-2 rounded"
                placeholder="Service Name"
              />

              <input
                value={editForm.price}
                onChange={(e) =>
                  setEditForm({ ...editForm, price: e.target.value })
                }
                className="w-full border p-2 rounded"
                placeholder="Price"
              />

              <input
                value={editForm.duration}
                onChange={(e) =>
                  setEditForm({ ...editForm, duration: e.target.value })
                }
                className="w-full border p-2 rounded"
                placeholder="Duration"
              />

              <input
                value={editForm.category}
                onChange={(e) =>
                  setEditForm({ ...editForm, category: e.target.value })
                }
                className="w-full border p-2 rounded"
                placeholder="Category"
              />

            </div>

            <button
              onClick={saveServiceChanges}
              className="mt-4 mr-2 px-4 py-2 bg-[#C5A059] text-white rounded-lg"
            >
              Save Changes
            </button>

            <button
              onClick={() => setSelectedService(null)}
              className="mt-4 px-4 py-2 bg-black text-white rounded-lg"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}