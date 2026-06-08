import React, { useState, useEffect } from "react";
import { MapPin, ChevronDown, Check, X, Star } from "lucide-react";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export default function SalonSelectorBar({ onChange }) {
  const [salonId, setSalonId] = useState(localStorage.getItem("selectedSalonId") || "");
  const [salonName, setSalonName] = useState(localStorage.getItem("selectedSalonName") || "");
  const [salons, setSalons] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Keep sync with localStorage in case it changes externally
    const handleStorageChange = () => {
      setSalonId(localStorage.getItem("selectedSalonId") || "");
      setSalonName(localStorage.getItem("selectedSalonName") || "");
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const fetchSalons = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API}/salon`);
      const data = await res.json();
      if (data.success) {
        setSalons(data.salons);
        // Extract unique cities
        const uniqueCities = [...new Set(data.salons.map(s => {
          const addr = s.address || "";
          if (addr.toLowerCase().includes("noida")) return "Noida";
          if (addr.toLowerCase().includes("nashik")) return "Nashik";
          if (addr.toLowerCase().includes("pune")) return "Pune";
          if (addr.toLowerCase().includes("delhi")) return "Delhi";
          const parts = addr.split(",");
          return parts[parts.length - 1]?.trim() || "Other";
        }))].filter(c => c && c !== "Not Listed" && c !== "Other");
        setCities(uniqueCities);
      }
    } catch (err) {
      console.error("Failed to fetch salons in selector:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenSelector = () => {
    fetchSalons();
    setShowModal(true);
  };

  const handleSelectSalon = (selectedSalon) => {
    localStorage.setItem("selectedSalonId", selectedSalon._id);
    localStorage.setItem("selectedSalonName", selectedSalon.salon_name);
    setSalonId(selectedSalon._id);
    setSalonName(selectedSalon.salon_name);
    setShowModal(false);
    // Dispatch storage event to notify other components
    window.dispatchEvent(new Event("storage"));
    if (onChange) onChange(selectedSalon);
  };

  const filteredSalons = salons.filter(s => {
    if (!selectedCity) return true;
    const addr = (s.address || "").toLowerCase();
    return addr.includes(selectedCity.toLowerCase());
  });

  return (
    <div className="w-full bg-white py-3.5 px-6 border-b border-[#E8DCCB] flex flex-col sm:flex-row items-center justify-between gap-4 font-sans text-left">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-[#FEF3E2] flex items-center justify-center text-[#9E7452] shrink-0">
          <MapPin size={16} className="stroke-[2.5px]" />
        </div>
        <div>
          <p className="text-[9px] font-black uppercase tracking-widest text-[#B58B67] mb-0.5">Current Salon Location</p>
          {salonName ? (
            <p className="text-sm font-extrabold text-[#3E362E]">
              {salonName} <span className="text-stone-400 font-normal ml-1.5 text-xs">| Bookings Active</span>
            </p>
          ) : (
            <p className="text-sm font-extrabold text-amber-600">
              No Studio Selected — Click to choose a salon location
            </p>
          )}
        </div>
      </div>

      <button
        onClick={handleOpenSelector}
        className="px-5 py-2.5 bg-[#3E362E] hover:bg-[#2A241F] text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition shadow-xs flex items-center gap-2 cursor-pointer border-none shrink-0"
      >
        Choose Salon By Location
        <ChevronDown size={12} className="stroke-[2.5px]" />
      </button>

      {/* Selector Modal Overlay */}
      {showModal && (
        <div className="fixed inset-0 z-[99999] bg-stone-900/40 backdrop-blur-xs flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
          <div className="w-full max-w-2xl bg-[#FAF6F0] rounded-[2rem] border border-[#EADBCE] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
            {/* Header */}
            <div className="flex justify-between items-center px-6 py-5 border-b border-[#EADBCE]/50 bg-white">
              <div className="text-left">
                <h3 className="font-serif text-2xl font-black text-stone-900 tracking-tight">Select Salon Location</h3>
                <p className="text-[10px] font-black uppercase tracking-widest text-[#A37B58] mt-1">Choose a studio near you to start booking services</p>
              </div>
              <button onClick={() => setShowModal(false)} className="w-9 h-9 rounded-xl flex items-center justify-center border border-stone-200 bg-white text-stone-400 hover:text-stone-850 transition cursor-pointer">
                <X size={16} />
              </button>
            </div>

            {/* City Filters */}
            <div className="px-6 py-4 bg-white/50 border-b border-[#EADBCE]/35 flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedCity("")}
                className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider border transition cursor-pointer ${
                  selectedCity === ""
                    ? "bg-[#FEF3E2] text-[#9E7452] border-[#EEDBCA]"
                    : "bg-white text-stone-600 border-stone-200 hover:bg-stone-50"
                }`}
              >
                All Cities
              </button>
              {cities.map(city => (
                <button
                  key={city}
                  onClick={() => setSelectedCity(city)}
                  className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider border transition cursor-pointer ${
                    selectedCity === city
                      ? "bg-[#FEF3E2] text-[#9E7452] border-[#EEDBCA]"
                      : "bg-white text-stone-600 border-stone-200 hover:bg-stone-50"
                  }`}
                >
                  {city}
                </button>
              ))}
            </div>

            {/* Salon List Grid */}
            <div className="p-6 max-h-[50vh] overflow-y-auto space-y-3">
              {loading ? (
                <p className="text-center text-xs text-stone-500 py-10 font-bold uppercase tracking-widest animate-pulse">Loading salons list...</p>
              ) : filteredSalons.length === 0 ? (
                <p className="text-center text-xs text-stone-500 py-10">No studios listed in this location.</p>
              ) : (
                filteredSalons.map(s => {
                  const isSelected = s._id === salonId;
                  return (
                    <div
                      key={s._id}
                      onClick={() => handleSelectSalon(s)}
                      className={`p-4 bg-white border rounded-2xl flex items-center justify-between gap-4 cursor-pointer transition hover:border-[#C5A059] ${
                        isSelected ? "border-[#C5A059] ring-2 ring-[#C5A059]/10" : "border-[#EADBCE]/80"
                      }`}
                    >
                      <div className="text-left flex items-start gap-3">
                        <MapPin size={16} className="text-[#C5A059] mt-0.5 shrink-0" />
                        <div>
                          <h4 className="text-sm font-extrabold text-[#3E362E]">{s.salon_name}</h4>
                          <p className="text-xs text-stone-400 font-semibold mt-0.5">{s.address || "Address not listed"}</p>
                          <div className="flex items-center gap-1.5 mt-2">
                            <Star size={10} className="fill-[#C5A059] text-[#C5A059]" />
                            <span className="text-[10px] font-extrabold text-stone-850">{s.rating || 4.5}</span>
                            <span className="text-[9px] text-stone-400">({s.total_reviews || 0} reviews)</span>
                          </div>
                        </div>
                      </div>
                      {isSelected && (
                        <div className="w-8 h-8 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
                          <Check size={16} className="stroke-[2.5px]" />
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
