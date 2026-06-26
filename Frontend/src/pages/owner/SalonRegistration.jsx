import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, MapPin, Upload, AlertTriangle, ShieldCheck, ChevronDown, X } from "lucide-react";
import shopImage from "../../assets/shop.jpg";
import CustomSelect from "../../components/common/CustomSelect";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const GOLD = "#C5A059";
const CHARCOAL = "#3E362E";

const AVAILABLE_SERVICES = [
  // Men's Services (40)
  "Classic Executive Cut",
  "Modern Fade (Skin/Low/Drop)",
  "Premium Keratin Infusion",
  "Indian Wedding Grooming",
  "Kids' Style Cut",
  "Slick Back Classic Pompadour",
  "Buzz Cut & Edge-up",
  "Textured Crop Fade",
  "Bollywood Premium Styling",
  "Scalp Detox & Cut Combo",
  
  "Beard Sculpting",
  "Royal Shave Ritual",
  "Beard Hydration & Wash",
  "Mustache Styling & Trim",
  "Charcoal Beard Softening",
  "Signature Hot Towel Shave",
  "Beard Color Touch-up",
  "Indian Royal Beard Styling",
  "Detox Clay Beard Mask",
  "Classic Clean Shave",
  
  "Gentleman's Facial",
  "Scalp Revitalize Massage",
  "Indian Ayurvedic Head Massage",
  "Detoxifying Charcoal Mask",
  "Premium Face & Neck Massage",
  "Tan Removal Peel-off Mask",
  "Anti-Stress Neck & Shoulder Rub",
  "Hydrating Aloe Vera Facial",
  "Ice Cool Mint Scalp Massage",
  "Aromatherapy Facial Spa",
  
  "Grey Blending",
  "Global Hair Highlight",
  "Beard Global Coloring",
  "Root Touch-Up (Men)",
  "Fashion Streaks (Per Streak)",
  "Ammonia-Free Organic Color",
  "Premium Beard Glossing",
  "Platinum Blonde Highlights",
  "Natural Henna Treatment",
  "Mustache & Beard Color Combo",

  // Women's Services (40)
  "Precision Cut & Blow Dry",
  "Bridal Style & Updo",
  "Couture Hair Styling (Curling/Straightening)",
  "Layered Cut & Blowout",
  "Creative Hair Makeover",
  "Express Hair Wash & Blow Dry",
  "Kids Girls Styling & Cut",
  "Bollywood Signature Blowout",
  "Anti-Frizz Hair Styling",
  "Premium Hot Iron Styling",
  
  "Global Hair Coloring",
  "Signature Balayage",
  "Ammonia-Free Root Touchup",
  "Ombre Hair Transformation",
  "Fashion Color Streaks (3 Foils)",
  "Blonde Highlights Accent",
  "Indian Henna Pack Application",
  "Shine Toner & Color Glaze",
  "Full Global Highlights",
  "Crown Area Highlights Touch-up",
  
  "Organic Oil Head Massage",
  "Hydrating Hair Spa",
  "Therapeutic Scalp Cleansing",
  "Relaxing Neck & Back Therapy",
  "Anti-Dandruff Scalp Treatment",
  "Intense Nourishing Cream Spa",
  "Ayurvedic Hair Vitality Ritual",
  "Detoxifying Charcoal Spa",
  "Deep Moisture Oil Therapy",
  "Aromatic Scalp Soothing Treatment",
  
  "Cysteine Smoothing Treatment",
  "Advanced Keratin Therapy",
  "Olaplex Damage Repair",
  "Pro-Keratin Shine Therapy",
  "Anti-Hairfall Laser Therapy",
  "Biotin Nourishing Infusion",
  "Volume-Boost Root Treatment",
  "Organic Frizz-Free Smoothing",
  "Silk Protein Glazing",
  "Scalp Hydradermie Treatment",

  // Addon Services (30)
  "Aromatherapy Scalp Massage",
  "Acupressure Shoulder Relief",
  "Charcoal Beard Detox",
  "Relaxing Foot Reflexology",
  "Warm Herbal Oil Champo",
  "Quick Eye Stress Relief",
  "Face Roller Massage",
  "Deep Back Relief",
  "Mint Cooling Champo",
  "Head & Temples Rub",
  
  "Deep Conditioning Mask",
  "Express Keratin Booster",
  "Instant Bond-Repair Shield",
  "Anti-Frizz Serum Infusion",
  "Citrus Scalp Scrub",
  "Protein Nourishing Spray",
  "Leave-in Moroccan Argan Shot",
  "Volumizing Root Boost",
  "Scalp Cooling Serum Ampoule",
  "Split-End Prevention treatment",
  
  "Premium Shine Glaze / Toner",
  "Silver / Grey Glossing",
  "Gold Highlights Accents (2 foils)",
  "Color Protect Lock Sealant",
  "Hair Gloss & Luster Spa",
  "Copper / Caramel Glaze Refresher",
  "Fashion Streaks booster",
  "Root Shadow blending",
  "Ammonia-Free color gloss",
  "Balayage glow booster"
];

const emptyForm = {
  salon_name: "",
  owner_name: "",
  mobile: "",
  email: "",
  password: "",
  address: "",
  state: "Maharashtra",
  latitude: 0,
  longitude: 0,
  opening_time: "09:00",
  closing_time: "21:00",
  services_offered: [], // Array for dropdown selection
  service_prices: {}, // Map of service_name -> price
  basic_pricing: "",
  number_of_barbers: "",
  support_number: "",
  images: [],
  about: "",
  shop_establishment_certificate: "",
  trade_license: "",
  gst_certificate: "",
  aadhaar_card: "",
};

export default function SalonRegistration() {
  const navigate = useNavigate();
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [timeError, setTimeError] = useState("");
  const [customServiceInput, setCustomServiceInput] = useState("");
  const [availableServices, setAvailableServices] = useState(AVAILABLE_SERVICES);

  const handleAddCustomService = () => {
    const trimmed = customServiceInput.trim();
    if (!trimmed) return;
    const formatted = trimmed.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    if (!availableServices.includes(formatted)) {
      setAvailableServices(prev => [...prev, formatted]);
    }
    if (!form.services_offered.includes(formatted)) {
      toggleService(formatted);
    }
    setCustomServiceInput("");
  };

  const setField = (name, value) => {
    setForm(prev => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleAddressBlur = async () => {
    if (!form.address || form.address.trim().length < 5) return;
    try {
      setMessage("Looking up coordinates for manual address...");
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(form.address)}`, {
        headers: { "User-Agent": "BarberPro-App/1.0" }
      });
      const data = await res.json();
      if (data && data.length > 0) {
        const newLat = parseFloat(data[0].lat);
        const newLon = parseFloat(data[0].lon);
        setForm(prev => ({
          ...prev,
          latitude: newLat,
          longitude: newLon
        }));
        setMessage("Coordinates updated based on manual address.");
        setError("");
      } else {
        setError("Could not resolve coordinates for manual address. Please check address spelling or tag via GPS.");
      }
    } catch (err) {
      console.error("Geocoding failed", err);
    }
  };

  const validateTimes = (open, close) => {
    if (!open || !close) return true;
    const [oH, oM] = open.split(":").map(Number);
    const [cH, cM] = close.split(":").map(Number);
    const openMins = oH * 60 + oM;
    const closeMins = cH * 60 + cM;
    return closeMins > openMins;
  };

  const handleTimeChange = (field, val) => {
    const nextForm = { ...form, [field]: val };
    setForm(nextForm);
    if (!validateTimes(nextForm.opening_time, nextForm.closing_time)) {
      setTimeError("Closing hour must be later than opening hour.");
    } else {
      setTimeError("");
    }
  };

  const toggleService = (service) => {
    let nextServices = [...form.services_offered];
    let nextPrices = { ...form.service_prices };
    
    if (nextServices.includes(service)) {
      nextServices = nextServices.filter(s => s !== service);
      delete nextPrices[service];
    } else {
      nextServices.push(service);
      nextPrices[service] = "";
    }
    
    setForm(prev => ({
      ...prev,
      services_offered: nextServices,
      service_prices: nextPrices
    }));
  };

  // ── 📍 OPTIMIZED GEOLOCATION DETECTION ENGINE ──
  const handleGeoTag = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by this browser.");
      return;
    }
    
    setError("");
    setMessage("Acquiring GPS fix... please check browser prompt.");

    const geoOptions = {
      enableHighAccuracy: true,
      timeout: 10000, // 10 seconds maximum wait time
      maximumAge: 0
    };

    navigator.geolocation.getCurrentPosition(
      position => {
        const { latitude, longitude } = position.coords;
        setForm(prev => ({
          ...prev,
          latitude,
          longitude,
        }));
        setError("");
        setMessage("Coordinates tagged. Fetching physical address details...");
        
        fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`, {
          headers: {
            "User-Agent": "BarberPro-App/1.0"
          }
        })
          .then(res => res.json())
          .then(data => {
            if (data && data.display_name) {
              setForm(prev => ({
                ...prev,
                address: data.display_name,
              }));
              setMessage("Location and physical address successfully linked.");
            } else {
              setMessage("Location coordinates successfully linked.");
            }
          })
          .catch(err => {
            console.error("Reverse geocode lookup error:", err);
            setMessage("Location coordinates successfully linked.");
          });
      },
      err => {
        setMessage("");
        if (err.code === 1) {
          setError("Location permission denied! Please click the crossed-out pin icon in your browser URL bar and change it to 'Allow'.");
        } else {
          setError("GPS signal timeout. Please try clicking the button again.");
        }
      },
      geoOptions
    );
  };

  const handleImages = async (event) => {
    const files = Array.from(event.target.files || []).slice(0, 5);
    const encoded = await Promise.all(
      files.map(file => new Promise(resolve => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.readAsDataURL(file);
      }))
    );
    setForm(prev => ({ ...prev, images: [...prev.images, ...encoded].slice(0, 5) }));
  };

  const handleDocumentUpload = async (event, fieldName) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setForm(prev => ({ ...prev, [fieldName]: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!form.latitude || !form.longitude) {
      setError("Please geo-tag your studio location coordinates before submission.");
      return;
    }
    
    if (form.services_offered.length === 0) {
      setError("Please select at least one service offered.");
      return;
    }

    if (!validateTimes(form.opening_time, form.closing_time)) {
      setError("Closing hour must be later than opening hour.");
      return;
    }

    if (!form.shop_establishment_certificate) {
      setError("Please upload your Shop and Establishment Certificate.");
      return;
    }
    if (!form.trade_license) {
      setError("Please upload your Trade License.");
      return;
    }
    if (!form.gst_certificate) {
      setError("Please upload your GST Certificate.");
      return;
    }
    if (!form.aadhaar_card) {
      setError("Please upload your Aadhaar Card.");
      return;
    }
    
    setLoading(true);
    setError("");
    setMessage("");
    try {
      const servicePrices = {};
      form.services_offered.forEach(s => {
        servicePrices[s] = 150;
      });

      const payload = {
        ...form,
        services_offered: form.services_offered,
        service_prices: servicePrices,
        basic_pricing: 150,
        number_of_barbers: Number(form.number_of_barbers),
      };
      
      const res = await fetch(`${API}/auth/owner/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message || "Registration failed");
      
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", "owner");
      localStorage.setItem("salonId", data.salon?._id || "");
      localStorage.setItem("salonName", data.salon?.salon_name || "");
      
      setMessage("Submitted successfully. Your status is now Pending Admin Approval.");
      setTimeout(() => navigate("/owner/dashboard"), 1200);
    } catch (err) {
      setError(err.message || "Server linkage failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full bg-white border border-[#EADBCE] rounded-2xl p-4 outline-none text-[#3E362E] placeholder-stone-400 focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059] transition-all text-sm font-medium font-sans shadow-3xs";

  return (
    <div
      className="relative min-h-screen bg-cover bg-center bg-fixed p-4 sm:p-6 font-sans text-stone-800 flex flex-col items-center"
      style={{ backgroundImage: `url(${shopImage})` }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap');
        body, .font-sans {
          font-family: 'Plus Jakarta Sans', sans-serif !important;
        }
        .font-serif {
          font-family: 'Playfair Display', serif !important;
        }
        .card-premium { 
          background: rgba(250, 246, 240, 0.92); 
          backdrop-filter: blur(16px);
          border: 1px solid #EADBCE; 
          border-radius: 2.5rem; 
          box-shadow: 0 25px 50px -12px rgba(44, 24, 16, 0.15);
        }
      `}</style>

      {/* Background Mask Overlay */}
      <div className="absolute inset-0 bg-[#FAF6F0]/85 backdrop-blur-xs" />

      <div className="relative z-10 w-full max-w-5xl py-6 flex-grow flex flex-col">
        
        {/* TOP ACTION NAVIGATION BAR */}
        <div className="w-full flex justify-start mb-8">
          <button 
            type="button"
            onClick={() => navigate("/")} 
            className="flex items-center gap-2 text-xs font-extrabold tracking-wider uppercase transition-all duration-300 hover:opacity-80 group text-[#3E362E] bg-white/90 backdrop-blur-md px-4 py-2.5 rounded-full border border-[#EADBCE] shadow-md cursor-pointer select-none font-sans"
          >
            <ArrowLeft size={14} className="transition-transform group-hover:-translate-x-1 text-[#C5A059]" />
            <span>Cancel</span>
          </button>
        </div>

        {/* Title Identity Block */}
        <div className="text-center mb-10">
          <span className="mb-2 block text-[11px] font-extrabold uppercase tracking-widest text-[#C5A059] font-sans">
            Graphura India Private Limited
          </span>
          <div className="text-center mb-5">
            <h2 className="font-serif text-3xl sm:text-4xl tracking-normal text-stone-900 flex items-center justify-center gap-2">
              <span className="font-bold uppercase">Register Your</span>
              <span className="italic text-[#C5A059] normal-case font-medium">Salon</span>
            </h2>
          </div>
          <div className="w-12 h-[1.5px] bg-[#C5A059] mx-auto mt-4 mb-3" />
          <p className="mx-auto max-w-2xl text-sm font-normal leading-relaxed text-stone-600 font-sans">
            Submit your salon profile setup for system validation. Customers can discover and book slots only after approval sequence completion.
          </p>
        </div>

        {/* Form Main Layout Grid Card */}
        <form onSubmit={handleSubmit} className="card-premium p-6 sm:p-10 space-y-6 text-left">
          <div className="grid gap-5 md:grid-cols-2">
            <Field label="Salon Name *">
              <div className="relative">
                <input required minLength={3} maxLength={40} placeholder="e.g. Royal Razor Studio" value={form.salon_name} onChange={e => setField("salon_name", e.target.value.slice(0, 40))} className={inputClass} />
                <div className="flex justify-between items-center mt-1 px-1">
                  <span className="text-[10px] text-stone-400">Min 3 characters</span>
                  <span className="text-[10px] text-stone-400 font-semibold">{form.salon_name.length}/40</span>
                </div>
              </div>
            </Field>
            
            <Field label="Owner Name *">
              <div className="relative">
                <input required maxLength={30} placeholder="e.g. Mayur K." value={form.owner_name} onChange={e => setField("owner_name", e.target.value.slice(0, 30))} className={inputClass} />
                <div className="flex justify-end mt-1 px-1">
                  <span className="text-[10px] text-stone-400 font-semibold">{form.owner_name.length}/30</span>
                </div>
              </div>
            </Field>
            
            <Field label="Mobile Number *">
              <div className="relative">
                <input required maxLength={10} placeholder="e.g. 9876543210" value={form.mobile} onChange={e => setField("mobile", e.target.value.replace(/\D/g, "").slice(0, 10))} className={inputClass} />
                <div className="flex justify-between items-center mt-1 px-1">
                  <span className="text-[10px] text-stone-400">10 digits</span>
                  <span className="text-[10px] text-stone-400 font-semibold">{form.mobile.length}/10</span>
                </div>
              </div>
            </Field>
            
            <Field label="Email Address">
              <div className="relative">
                <input type="email" maxLength={50} placeholder="e.g. contact@studio.com" value={form.email} onChange={e => setField("email", e.target.value.slice(0, 50))} className={inputClass} />
                <div className="flex justify-end mt-1 px-1">
                  <span className="text-[10px] text-stone-400 font-semibold">{form.email.length}/50</span>
                </div>
              </div>
            </Field>
            
            <Field label="Security Password *">
              <div className="relative">
                <input required type="password" minLength={6} maxLength={25} placeholder="Minimum 6 characters" value={form.password} onChange={e => setField("password", e.target.value.slice(0, 25))} className={inputClass} />
                <div className="flex justify-between items-center mt-1 px-1">
                  <span className="text-[10px] text-stone-400">Min 6 characters</span>
                  <span className="text-[10px] text-stone-400 font-semibold">{form.password.length}/25</span>
                </div>
              </div>
            </Field>
            
            <Field label="Customer Support Number *">
              <div className="relative">
                <input required maxLength={10} placeholder="e.g. 9123456789" value={form.support_number} onChange={e => setField("support_number", e.target.value.replace(/\D/g, "").slice(0, 10))} className={inputClass} />
                <div className="flex justify-between items-center mt-1 px-1">
                  <span className="text-[10px] text-stone-400">10 digits</span>
                  <span className="text-[10px] text-stone-400 font-semibold">{form.support_number.length}/10</span>
                </div>
              </div>
            </Field>
            
            <Field label="Opening Hours">
              <input type="time" value={form.opening_time} onChange={e => handleTimeChange("opening_time", e.target.value)} className={inputClass} />
            </Field>
            
            <Field label="Closing Hours">
              <input type="time" value={form.closing_time} onChange={e => handleTimeChange("closing_time", e.target.value)} className={inputClass} />
            </Field>

            {/* Premium Custom Services Offered Dropdown */}
            <div className="relative md:col-span-2">
              <Field label="Services Offered *">
                <div 
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="w-full bg-white border border-[#EADBCE] rounded-2xl p-4 flex items-center justify-between text-[#3E362E] text-sm font-medium font-sans shadow-3xs cursor-pointer hover:border-[#C5A059] transition-all"
                >
                  <span className={form.services_offered.length === 0 ? "text-stone-400" : "text-[#3E362E]"}>
                    {form.services_offered.length === 0 
                      ? "Select services offered..." 
                      : `${form.services_offered.length} services selected`}
                  </span>
                  <ChevronDown size={16} className={`transition-transform duration-300 text-[#C5A059] ${dropdownOpen ? "rotate-180" : ""}`} />
                </div>
              </Field>

              {dropdownOpen && (
                <>
                  <div className="fixed inset-0 z-20" onClick={() => setDropdownOpen(false)} />
                  <div className="absolute left-0 right-0 top-[85px] mt-1 bg-white border border-[#EADBCE] rounded-2xl shadow-xl z-30 p-2 space-y-1 max-h-60 overflow-y-auto">
                    {availableServices.map(service => {
                      const isSelected = form.services_offered.includes(service);
                      return (
                        <div 
                          key={service} 
                          onClick={() => toggleService(service)}
                          className={`flex items-center justify-between p-3 rounded-xl transition-all cursor-pointer select-none text-xs font-bold uppercase tracking-wider ${
                            isSelected 
                              ? "bg-[#FAF6F0] text-[#C5A059]" 
                              : "hover:bg-stone-50 text-[#3E362E]"
                          }`}
                        >
                          <span>{service}</span>
                          <input 
                            type="checkbox" 
                            checked={isSelected}
                            readOnly
                            className="accent-[#C5A059] h-4 w-4 rounded cursor-pointer"
                          />
                        </div>
                      );
                    })}
                  </div>
                </>
              )}

              {form.services_offered.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {form.services_offered.map(service => (
                    <span 
                      key={service} 
                      className="inline-flex items-center gap-1 bg-[#FAF6F0] border border-[#EADBCE] text-[#3E362E] px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider animate-in fade-in zoom-in-95"
                    >
                      {service}
                      <button 
                        type="button" 
                        onClick={() => toggleService(service)}
                        className="text-[#C5A059] hover:text-red-500 transition-colors ml-1 cursor-pointer"
                      >
                        <X size={12} />
                      </button>
                    </span>
                  ))}
                </div>
              )}

              {/* Custom Service Insertion Block */}
              <div className="flex gap-3 mt-4 items-center max-w-lg">
                <input 
                  type="text" 
                  placeholder="Can't find your service? Add a custom one..." 
                  value={customServiceInput}
                  onChange={e => setCustomServiceInput(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddCustomService();
                    }
                  }}
                  className="flex-grow bg-white border border-[#EADBCE] rounded-2xl p-3.5 outline-none text-[#3E362E] placeholder-stone-400 focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059] transition-all text-xs font-medium font-sans shadow-3xs"
                />
                <button
                  type="button"
                  onClick={handleAddCustomService}
                  className="h-11 px-5 rounded-2xl text-xs font-extrabold uppercase tracking-wider text-white transition-all bg-[#C5A059] hover:bg-[#3E362E] cursor-pointer"
                >
                  Add Service
                </button>
              </div>
            </div>

            {/* Business & Legal Verification Documents */}
            <div className="md:col-span-2 space-y-4">
              <div className="border-b border-[#EADBCE] pb-2">
                <span className="text-[12px] font-extrabold uppercase tracking-wider text-[#C5A059] font-sans">
                  Business & Legal Verification Documents *
                </span>
                <p className="text-stone-500 text-xs mt-1 font-sans">
                  Please upload valid copies of the requested documents (PDF or Image formats supported).
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {/* Shop and Establishment Certificate */}
                <Field label="Shop & Establishment Certificate *">
                  <div className="relative w-full h-[50px]">
                    <input 
                      type="file" 
                      id="shop-establishment-upload" 
                      accept="image/*,application/pdf" 
                      onChange={e => handleDocumentUpload(e, "shop_establishment_certificate")} 
                      className="absolute inset-0 opacity-0 z-20 cursor-pointer w-full h-full" 
                    />
                    <label htmlFor="shop-establishment-upload" className="absolute inset-0 bg-white border border-[#EADBCE] rounded-2xl px-4 flex items-center justify-between text-stone-400 text-sm font-medium font-sans shadow-3xs z-10 hover:border-[#C5A059] transition-colors">
                      <span className="text-stone-500 text-xs font-normal truncate max-w-[80%]">
                        {form.shop_establishment_certificate ? "Document uploaded ✓" : "Upload Certificate..."}
                      </span>
                      <Upload size={14} color={GOLD} />
                    </label>
                  </div>
                </Field>

                {/* Trade License */}
                <Field label="Trade License *">
                  <div className="relative w-full h-[50px]">
                    <input 
                      type="file" 
                      id="trade-license-upload" 
                      accept="image/*,application/pdf" 
                      onChange={e => handleDocumentUpload(e, "trade_license")} 
                      className="absolute inset-0 opacity-0 z-20 cursor-pointer w-full h-full" 
                    />
                    <label htmlFor="trade-license-upload" className="absolute inset-0 bg-white border border-[#EADBCE] rounded-2xl px-4 flex items-center justify-between text-stone-400 text-sm font-medium font-sans shadow-3xs z-10 hover:border-[#C5A059] transition-colors">
                      <span className="text-stone-500 text-xs font-normal truncate max-w-[80%]">
                        {form.trade_license ? "Document uploaded ✓" : "Upload License..."}
                      </span>
                      <Upload size={14} color={GOLD} />
                    </label>
                  </div>
                </Field>

                {/* GST Certificate */}
                <Field label="GST Certificate *">
                  <div className="relative w-full h-[50px]">
                    <input 
                      type="file" 
                      id="gst-certificate-upload" 
                      accept="image/*,application/pdf" 
                      onChange={e => handleDocumentUpload(e, "gst_certificate")} 
                      className="absolute inset-0 opacity-0 z-20 cursor-pointer w-full h-full" 
                    />
                    <label htmlFor="gst-certificate-upload" className="absolute inset-0 bg-white border border-[#EADBCE] rounded-2xl px-4 flex items-center justify-between text-stone-400 text-sm font-medium font-sans shadow-3xs z-10 hover:border-[#C5A059] transition-colors">
                      <span className="text-stone-500 text-xs font-normal truncate max-w-[80%]">
                        {form.gst_certificate ? "Document uploaded ✓" : "Upload GST Certificate..."}
                      </span>
                      <Upload size={14} color={GOLD} />
                    </label>
                  </div>
                </Field>

                {/* Aadhaar Card */}
                <Field label="Owner's Aadhaar Card *">
                  <div className="relative w-full h-[50px]">
                    <input 
                      type="file" 
                      id="aadhaar-card-upload" 
                      accept="image/*,application/pdf" 
                      onChange={e => handleDocumentUpload(e, "aadhaar_card")} 
                      className="absolute inset-0 opacity-0 z-20 cursor-pointer w-full h-full" 
                    />
                    <label htmlFor="aadhaar-card-upload" className="absolute inset-0 bg-white border border-[#EADBCE] rounded-2xl px-4 flex items-center justify-between text-stone-400 text-sm font-medium font-sans shadow-3xs z-10 hover:border-[#C5A059] transition-colors">
                      <span className="text-stone-500 text-xs font-normal truncate max-w-[80%]">
                        {form.aadhaar_card ? "Document uploaded ✓" : "Upload Aadhaar Card..."}
                      </span>
                      <Upload size={14} color={GOLD} />
                    </label>
                  </div>
                </Field>
              </div>
            </div>

            <Field label="Total Active Chairs / Barbers *">
              <input required type="number" min="1" placeholder="e.g. 3" value={form.number_of_barbers} onChange={e => setField("number_of_barbers", e.target.value)} className={inputClass} />
            </Field>
            
            <Field label="Shop Gallery Images (Max 5)">
              <div className="relative w-full h-[50px]">
                <input type="file" id="gallery-uploads" accept="image/*" multiple onChange={handleImages} className="absolute inset-0 opacity-0 z-20 cursor-pointer w-full h-full" />
                <label htmlFor="gallery-uploads" className="absolute inset-0 bg-white border border-[#EADBCE] rounded-2xl px-4 flex items-center justify-between text-stone-400 text-sm font-medium font-sans shadow-3xs z-10 hover:border-[#C5A059] transition-colors">
                  <span className="text-stone-500 text-xs font-normal">{form.images.length > 0 ? `${form.images.length} files selected` : "Upload storefront photos..."}</span>
                  <Upload size={14} color={GOLD} />
                </label>
              </div>
            </Field>
          </div>

          <div className="grid gap-5 md:grid-cols-2 mb-4">
            <Field label="Branch State *">
              <CustomSelect
                value={form.state}
                onChange={val => setField("state", val)}
                options={[
                  "Maharashtra",
                  "Madhya Pradesh",
                  "Gujarat",
                  "Delhi",
                  "Karnataka",
                  "Rajasthan",
                  "Uttar Pradesh",
                  "Tamil Nadu"
                ]}
                placeholder="Select State"
                className="!h-11 !rounded-2xl !border-[#EADBCE] !text-[#3e362e] !text-sm !font-medium"
              />
            </Field>
          </div>

          {/* Address with MapPin Geotag integration layout */}
          <div className="grid gap-5 md:grid-cols-[1fr_auto] items-end">
            <Field label="Physical Studio Address *">
              <div className="relative w-full">
                <textarea required minLength={10} maxLength={150} placeholder="Complete shop address details..." value={form.address} onChange={e => setField("address", e.target.value.slice(0, 150))} onBlur={handleAddressBlur} className={`${inputClass} min-h-24 resize-none`} />
                <div className="flex justify-between items-center mt-1 px-1">
                  <span className="text-[10px] text-stone-400">Min 10 characters</span>
                  <span className="text-[10px] text-stone-400 font-semibold">{form.address.length}/150</span>
                </div>
              </div>
            </Field>
            <div className="pt-2 pb-5">
              <button 
                type="button" 
                onClick={handleGeoTag} 
                className={`h-24 w-full md:w-auto rounded-2xl border px-6 text-xs font-extrabold uppercase tracking-wider transition-all duration-200 shadow-3xs flex flex-col justify-center items-center gap-2 cursor-pointer font-sans ${
                  form.latitude 
                    ? "border-emerald-200 bg-emerald-50/50 text-emerald-800 shadow-none" 
                    : "border-[#C5A059] bg-white text-[#C5A059] hover:bg-[#3E362E] hover:text-white hover:border-[#3E362E]"
                }`}
              >
                <MapPin size={16} />
                <span>{form.latitude ? "Coordinates Tagged" : "Geo-Tag Location"}</span>
              </button>
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <Field label="Latitude *">
              <input required type="number" step="any" placeholder="Latitude" value={form.latitude || ""} onChange={e => setField("latitude", parseFloat(e.target.value) || 0)} className={inputClass} />
            </Field>
            <Field label="Longitude *">
              <input required type="number" step="any" placeholder="Longitude" value={form.longitude || ""} onChange={e => setField("longitude", parseFloat(e.target.value) || 0)} className={inputClass} />
            </Field>
          </div>

          <Field label="About Studio / Bio">
            <div className="relative w-full">
              <textarea maxLength={300} placeholder="Describe your shop atmosphere, specialization details..." value={form.about} onChange={e => setField("about", e.target.value.slice(0, 300))} className={`${inputClass} min-h-24 resize-none`} />
              <div className="flex justify-end mt-1 px-1">
                <span className="text-[10px] text-stone-400 font-semibold">{form.about.length}/300</span>
              </div>
            </div>
          </Field>

          {/* Images preview stream layer with Delete Buttons */}
          {form.images.length > 0 && (
            <div className="grid grid-cols-3 gap-4 md:grid-cols-5 pt-2">
              {form.images.map((image, index) => (
                <div key={index} className="relative group aspect-square">
                  <img 
                    src={image} 
                    alt={`Salon upload ${index + 1}`} 
                    className="w-full h-full rounded-2xl border border-[#EADBCE] object-cover shadow-3xs transition-all duration-200 group-hover:brightness-95 animate-in fade-in zoom-in-95" 
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setForm(prev => ({
                        ...prev,
                        images: prev.images.filter((_, idx) => idx !== index)
                      }));
                    }}
                    className="absolute -top-1.5 -right-1.5 bg-[#3E362E] hover:bg-[#C5A059] text-white rounded-full p-1.5 shadow-md transition-all duration-200 border border-[#EADBCE] cursor-pointer flex items-center justify-center"
                    title="Remove Image"
                  >
                    <X size={10} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Dialog message status monitors */}
          {timeError && (
            <div className="p-3 bg-amber-50 border border-amber-100 rounded-xl flex items-center gap-2 text-amber-800 text-xs font-semibold font-sans animate-in fade-in duration-200">
              <AlertTriangle size={14} className="shrink-0 text-amber-600" />
              <span>{timeError}</span>
            </div>
          )}
          
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-100 rounded-xl flex items-center gap-2 text-rose-700 text-xs font-medium font-sans animate-in fade-in duration-200">
              <AlertTriangle size={14} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}
          
          {message && (
            <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center gap-2 text-emerald-800 text-xs font-medium font-sans animate-in fade-in duration-200">
              <ShieldCheck size={14} className="shrink-0" />
              <span>{message}</span>
            </div>
          )}

          {/* Form Action Dispatcher button */}
          <div className="pt-4">
            <button 
              type="submit"
              disabled={loading} 
              className="w-full h-14 md:h-16 rounded-2xl flex items-center justify-center text-xs sm:text-sm font-extrabold uppercase tracking-wider text-white shadow-md transition-all duration-200 hover:opacity-95 disabled:opacity-50 cursor-pointer active:scale-[0.98] hover:shadow-lg font-sans"
              style={{ backgroundColor: CHARCOAL }}
            >
              {loading ? "Registering Studio System..." : "Submit Profile for Approval"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Field({ label, children }) {
  const parts = label.split("*");
  const hasAsterisk = label.includes("*");

  return (
    <label className="block space-y-1.5">
      <span className="ml-0.5 text-[11px] font-extrabold uppercase tracking-widest text-stone-400 font-sans">
        {parts[0]}
        {hasAsterisk && <span className="text-red-500 font-bold ml-0.5">*</span>}
      </span>
      {children}
    </label>
  );
}