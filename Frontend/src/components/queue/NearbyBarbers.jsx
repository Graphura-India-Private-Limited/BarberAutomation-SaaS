import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import * as Icons from "lucide-react";
import Navbar from "../layout/Navbar";
import Footer from "../layout/Footer";
import defaultShopImage from "../../assets/shop.jpg";


/* ─────────────────────────────────────────────
   STEP INDICATOR
───────────────────────────────────────────── */
const StepBar = ({ step }) => (
  <div className="flex items-center gap-0 mb-8">
    {[
      { n: 1, label: "Pick Studio" },
      { n: 2, label: "Choose Service" },
      { n: 3, label: "Confirm Booking" },
    ].map(({ n, label }, i) => (
      <React.Fragment key={n}>
        <div className="flex items-center gap-2">
          <div
            className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-black transition-all duration-300 ${
              step >= n
                ? "bg-[#3E362E] text-[#C5A059] shadow-sm"
                : "bg-[#E8DCCB] text-[#B0A090]"
            }`}
          >
            {step > n ? "✓" : n}
          </div>
          <span
            className={`text-[10px] font-black uppercase tracking-widest transition-all ${
              step >= n ? "text-[#3E362E]" : "text-[#B0A090]"
            }`}
          >
            {label}
          </span>
        </div>
        {i < 2 && (
          <div
            className={`flex-1 h-px mx-3 transition-all duration-500 ${
              step > n ? "bg-[#C5A059]" : "bg-[#E8DCCB]"
            }`}
          />
        )}
      </React.Fragment>
    ))}
  </div>
);

/* ─────────────────────────────────────────────
   SALON CARD
───────────────────────────────────────────── */
const SalonCard = ({ salon, onSelect }) => {
  const navigate = useNavigate();

  return (
    <div
      className="group w-full text-left rounded-2xl overflow-hidden border border-[#E8DCCB] hover:border-[#C5A059]/60 hover:shadow-lg transition-all duration-300 bg-white flex flex-col justify-between"
    >
      {/* Clickable Card Body for Selection */}
      <div 
        onClick={() => onSelect(salon)}
        className="cursor-pointer flex-grow"
      >
        {/* Image */}
        <div className="relative h-36 overflow-hidden bg-stone-100">
          <img
            src={salon.image}
            alt={salon.name}
            onError={(e) => {
              e.currentTarget.src = defaultShopImage;
            }}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
          {/* Badges */}
          <div className="absolute top-3 left-3 flex gap-2">
            <span
              className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full ${
                salon.openNow
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-red-100 text-red-600"
              }`}
            >
              {salon.openNow ? "● Open Now" : "● Closed"}
            </span>
          </div>
          <div className="absolute top-3 right-3 bg-white/90 backdrop-blur px-2.5 py-1 rounded-lg flex items-center gap-1 shadow-sm">
            <Icons.Star size={10} className="fill-[#C5A059] text-[#C5A059]" />
            <span className="text-[11px] font-black text-stone-900">{salon.rating}</span>
            <span className="text-[9px] text-stone-400">({salon.reviews})</span>
          </div>
        </div>

        {/* Body */}
        <div className="p-3.5 space-y-3">
          <div>
            <h3 className="text-sm font-extrabold text-[#3E362E] tracking-tight leading-tight mb-1 group-hover:text-[#C5A059] transition-colors">
              {salon.name}
            </h3>
            <div className="flex items-center gap-1.5 text-stone-400 text-[10px] font-semibold">
              <Icons.MapPin size={10} className="text-[#C5A059] stroke-[2.5px] flex-shrink-0" />
              <span className="truncate">{salon.address}</span>
              <span className="text-[#C5A059] font-black ml-auto flex-shrink-0">
                {salon.distance}
              </span>
            </div>
          </div>

          {/* Salon Bio/About Snippet */}
          {salon.about && (
            <p className="text-[10px] text-[#8A7B6A] font-medium leading-relaxed line-clamp-2 bg-stone-50/50 p-2 rounded-lg border border-stone-100">
              {salon.about}
            </p>
          )}

          {/* Grid of details */}
          <div className="grid grid-cols-2 gap-x-2 gap-y-1.5 pt-2 text-[9px] font-semibold text-stone-500 border-t border-stone-100">
            {/* Hours */}
            <div className="flex items-center gap-1.5">
              <Icons.Clock size={9} className="text-[#C5A059] flex-shrink-0" />
              <span className="truncate">
                {salon.opening_time && salon.closing_time 
                  ? `${salon.opening_time} - ${salon.closing_time}` 
                  : "09:00 - 21:00"}
              </span>
            </div>
            
            {/* Base Price */}
            <div className="flex items-center gap-1.5 justify-end">
              <Icons.Scissors size={9} className="text-[#C5A059] flex-shrink-0" />
              <span>
                Min: ₹{salon.basic_pricing || "200"}
              </span>
            </div>

            {/* Active Barbers/Chairs */}
            <div className="flex items-center gap-1.5">
              <Icons.Users size={9} className="text-[#C5A059] flex-shrink-0" />
              <span>
                {salon.number_of_barbers || salon.max_barbers_limit || "3"} Stylists
              </span>
            </div>

            {/* Support Phone */}
            <div className="flex items-center gap-1.5 justify-end">
              <Icons.Phone size={9} className="text-[#C5A059] flex-shrink-0" />
              <span className="truncate">
                {salon.support_number || salon.mobile || "No Contact"}
              </span>
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-1 pt-2 border-t border-stone-100">
            {salon.tags.map((t) => (
              <span
                key={t}
                className="text-[8px] font-black uppercase tracking-wider bg-[#F8F4EE] text-[#8A7B6A] px-1.5 py-0.5 rounded border border-[#E8DCCB]"
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Card Footer with Info/Details Button */}
      <div className="px-3 pb-3 pt-2 border-t border-stone-100 flex items-center justify-between">
        <button
          type="button"
          onClick={() => onSelect(salon)}
          className="text-[10px] font-black uppercase tracking-widest text-[#8A7B6A] hover:text-[#C5A059] transition-colors cursor-pointer"
        >
          Select
        </button>
        <button
          type="button"
          onClick={() => navigate(`/salon/${salon.id}`)}
          className="text-[10px] font-black uppercase tracking-widest text-[#C5A059] hover:text-[#a07f3f] transition-colors cursor-pointer flex items-center gap-1"
        >
          <Icons.Info size={11} className="stroke-[2.5px]" />
          Details
        </button>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────
   SERVICE CARD
───────────────────────────────────────────── */
const ServiceCard = ({ service, selected, onSelect }) => {
  const isSel = selected?.id === service.id;
  return (
    <button
      type="button"
      onClick={() => onSelect(service)}
      className={`group w-full text-left p-4 rounded-2xl border transition-all duration-200 cursor-pointer focus:outline-none ${
        isSel
          ? "border-[#C5A059] bg-[#FDF8F0] shadow-[0_0_0_3px_rgba(197,160,89,0.15)]"
          : "border-[#E8DCCB] bg-white hover:border-[#C5A059]/50 hover:bg-[#FDFAF6]"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-extrabold text-[#3E362E] tracking-tight">
              {service.name}
            </span>
            {service.popular && (
              <span className="text-[8px] font-black uppercase tracking-widest bg-[#C5A059]/15 text-[#A07830] px-2 py-0.5 rounded-full">
                Popular
              </span>
            )}
          </div>
          <div className="flex items-center gap-1 text-stone-400 text-[11px] font-semibold">
            <Icons.Clock size={10} className="stroke-[2.5px]" />
            {service.duration}
          </div>
        </div>
        <div className="flex flex-col items-end gap-2 flex-shrink-0">
          <span className="text-base font-black text-[#3E362E]">₹{service.price}</span>
          <div
            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
              isSel
                ? "border-[#C5A059] bg-[#C5A059]"
                : "border-[#D4C8B8] group-hover:border-[#C5A059]"
            }`}
          >
            {isSel && <Icons.Check size={11} className="text-white stroke-[3px]" />}
          </div>
        </div>
      </div>
    </button>
  );
};

/* ─────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────── */
const NearbyBarbers = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isStandalone = location.pathname === "/nearby" || location.pathname === "/barbers";

  const [step, setStep] = useState(location.state?.step || 1);
  const [salons, setSalons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [locationError, setLocationError] = useState(null);
  const [selectedSalon, setSelectedSalon] = useState(location.state?.selectedSalon || null);
  const [selectedService, setSelectedService] = useState(location.state?.selectedService || null);
  const [bookingDone, setBookingDone] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [services, setServices] = useState([]);
  const sectionRef = useRef(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [minRating, setMinRating] = useState(0);
  const [sortBy, setSortBy] = useState("");

  const [userAddress, setUserAddress] = useState("");
  const [userCoords, setUserCoords] = useState(null);
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);

  const getDistanceInKm = (lat1, lon1, lat2, lon2) => {
    if (!lat1 || !lon1 || !lat2 || !lon2) return null;
    const R = 6371; // Radius of earth in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // Distance in km
    return d;
  };

  const getSalonDistanceStr = (salon) => {
    if (userCoords && salon.latitude && salon.longitude) {
      const dist = getDistanceInKm(
        userCoords.latitude,
        userCoords.longitude,
        salon.latitude,
        salon.longitude
      );
      if (dist !== null) {
        return `${dist.toFixed(1)} km away`;
      }
    }
    return salon.distance || "Nearby";
  };

  const detectLocation = () => {
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported");
      return;
    }
    setIsDetectingLocation(true);
    setLocationError(null);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setUserCoords({ latitude, longitude });
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );
          const data = await res.json();
          if (data && data.display_name) {
            setUserAddress(data.display_name);
          } else {
            setUserAddress(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
          }
        } catch (err) {
          setUserAddress(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
        } finally {
          setIsDetectingLocation(false);
        }
      },
      (error) => {
        console.error(error);
        setLocationError("Location permission denied");
        setIsDetectingLocation(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  useEffect(() => {
    detectLocation();
  }, []);

  useEffect(() => {
    if (location.state?.selectedSalon) {
      handleSalonSelect(location.state.selectedSalon);
    }
  }, [location.state?.selectedSalon]);

  /* fetch salons */
 useEffect(() => {
  const fetchSalons = async () => {
    try {
      setLoading(true);

      const API =
        import.meta.env.VITE_API_URL ||
        "http://localhost:5000/api";

      const response = await fetch(`${API}/salon`);
      const data = await response.json();
if (data.success) {
  const mapped = data.salons.map(s => ({
    ...s,
    id: s._id,
    name: s.salon_name,
    address: s.address || "Address not listed",
    image: s.images?.[0] || defaultShopImage,
    rating: s.rating || 4.5,
    reviews: s.total_reviews || 0,
    distance: "Nearby",
    openNow: true,
    tags: s.services_offered?.slice(0, 3) || ["Haircut", "Grooming"],
  }));
  setSalons(mapped);
}
    } catch (error) {
      console.error("Failed to fetch salons:", error);
    } finally {
      setLoading(false);
    }
  };

  fetchSalons();
}, []);
const handleSalonSelect = async (salon) => {
  setSelectedSalon(salon);
  setSelectedService(null);
  localStorage.setItem("selectedSalonId", salon.id || salon._id);
  localStorage.setItem("selectedSalonName", salon.name);
  navigate("/customer/services");
};


  const handleConfirmSalon = () => {
    if (!selectedSalon) return;
    localStorage.setItem("selectedSalonId", selectedSalon.id);
    localStorage.setItem("selectedSalonName", selectedSalon.name);
    navigate("/customer/services");
  };

  const handleConfirmService = () => {
    if (!selectedService) return;
    setStep(3);
  };

const handleBook = async () => {
  const token = localStorage.getItem("token");
  if (!token) {
    navigate("/login", {
      state: {
        from: {
          pathname: "/nearby",
          state: { step: 3, selectedSalon, selectedService }
        }
      }
    });
    return;
  }

  try {
    setBookingLoading(true);

    const API =
      import.meta.env.VITE_API_URL ||
      "http://localhost:5000/api";

    const response = await fetch(`${API}/booking`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        salon_id: selectedSalon.id || selectedSalon._id,
        booking_type: "slot",
        services: [{ service_id: selectedService.id || selectedService._id, member_name: "Self" }],
      }),
    });

    const data = await response.json();

    if (data.success) {
      setBookingDone(true);
    } else {
      alert(data.message || "Booking failed.");
    }
  } catch (error) {
    console.error(error);
    alert("An error occurred during booking. Please try again.");
  } finally {
    setBookingLoading(false);
  }
};

  const handleReset = () => {
    setStep(1);
    setSelectedSalon(null);
    setSelectedService(null);
    setBookingDone(false);
  };


  // Helper to extract city from address
  const extractCity = (address) => {
    if (!address || address === "Address not listed") return "Not Listed";
    const addressLower = address.toLowerCase();
    if (addressLower.includes("noida")) return "Noida";
    if (addressLower.includes("nashik")) return "Nashik";
    if (addressLower.includes("maharashtra")) return "Maharashtra";
    if (addressLower.includes("delhi")) return "Delhi";
    const parts = address.split(",");
    return parts[parts.length - 1]?.trim() || parts[0]?.trim() || "Other";
  };

  // Extract unique cities dynamically from the fetched salons list
  const uniqueCities = [...new Set(salons.map(s => extractCity(s.address)))].filter(
    (c) => c !== "Not Listed" && c !== "Other"
  );

  // Filtered & sorted salons list
  const filteredSalons = salons
    .filter((salon) => {
      const matchesSearch =
        salon.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        salon.address.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCity = !selectedCity || extractCity(salon.address) === selectedCity;
      const matchesRating = salon.rating >= minRating;
      return matchesSearch && matchesCity && matchesRating;
    })
    .sort((a, b) => {
      if (sortBy === "distance" && userCoords && a.latitude && a.longitude && b.latitude && b.longitude) {
        const distA = getDistanceInKm(userCoords.latitude, userCoords.longitude, a.latitude, a.longitude);
        const distB = getDistanceInKm(userCoords.latitude, userCoords.longitude, b.latitude, b.longitude);
        return distA - distB;
      }
      if (sortBy === "rating") {
        return b.rating - a.rating;
      }
      if (sortBy === "name") {
        return a.name.localeCompare(b.name);
      }
      return 0;
    });

  const content = (
    <div className="w-full">
      {/* ── HEADER CARD ── */}
      <div className="bg-[#F8F4EE] border border-[#E8DCCB] rounded-3xl p-7 mb-7">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <p className="text-[10px] tracking-[0.3em] uppercase text-[#B58B67] font-black mb-1">
              Book a Grooming Session
            </p>
            <h2 className="text-3xl font-black text-[#3E362E] tracking-tight leading-tight">
              {step === 1
                ? "Choose Your Studio"
                : step === 2
                ? `Services at ${selectedSalon?.name}`
                : "Confirm Your Booking"}
            </h2>
            <p className="text-[#8A7B6A] text-sm mt-1.5 font-medium">
              {step === 1
                ? "Pick a nearby salon to begin your booking."
                : step === 2
                ? "Select the service you'd like to book."
                : "Review and confirm your appointment."}
            </p>
            {userAddress && (
              <div className="mt-3 flex items-center gap-2 text-stone-600 text-xs font-semibold bg-white/60 border border-[#E8DCCB] px-3.5 py-2 rounded-xl w-fit">
                <Icons.MapPin size={12} className="text-[#C5A059] flex-shrink-0" />
                <span className="truncate max-w-md sm:max-w-xl">Searching near: <strong className="text-[#3E362E]">{userAddress}</strong></span>
                <button
                  onClick={detectLocation}
                  disabled={isDetectingLocation}
                  className="text-[#C5A059] hover:text-[#3E362E] transition-colors ml-2 bg-transparent border-none cursor-pointer p-0 font-bold"
                  title="Refresh Location"
                >
                  <Icons.RefreshCw size={11} className={isDetectingLocation ? "animate-spin" : ""} />
                </button>
              </div>
            )}
          </div>

          {/* location pill */}
          <div className="flex-shrink-0">
            {locationError ? (
              <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 px-3 py-2 rounded-xl text-[10px] font-bold text-amber-700 uppercase tracking-wider">
                <Icons.AlertCircle size={12} />
                {locationError}
              </div>
            ) : (
              <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 px-3 py-2 rounded-xl text-[10px] font-bold text-emerald-700 uppercase tracking-wider">
                <Icons.Navigation size={12} />
                Location Active
              </div>
            )}
          </div>
        </div>

        {/* Step bar */}
        <div className="mt-6">
          <StepBar step={step} />
        </div>

        {/* Breadcrumb trail when salon selected */}
        {selectedSalon && (
          <div className="flex items-center gap-2 mt-1 flex-wrap">
            <button
              type="button"
              onClick={handleReset}
              className="text-[10px] font-black uppercase tracking-widest text-[#8A7B6A] hover:text-[#3E362E] transition-colors cursor-pointer flex items-center gap-1"
            >
              <Icons.ChevronLeft size={12} />
              All Studios
            </button>
            <span className="text-[#D4C8B8] text-xs">›</span>
            <span className="text-[10px] font-black uppercase tracking-widest text-[#C5A059]">
              {selectedSalon.name}
            </span>
            {selectedService && step >= 3 && (
              <>
                <span className="text-[#D4C8B8] text-xs">›</span>
                <span className="text-[10px] font-black uppercase tracking-widest text-[#3E362E]">
                  {selectedService.name}
                </span>
              </>
            )}
          </div>
        )}
      </div>

      {/* ══════════════════════════════
          STEP 1 — SALON SELECTION
      ══════════════════════════════ */}
      {step === 1 && (
        <>
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((n) => (
                <div
                  key={n}
                  className="h-[280px] bg-white border border-[#E8DCCB] animate-pulse rounded-2xl"
                />
              ))}
            </div>
          ) : (
            <>
              {/* 🔍 Search and Filters Section */}
              <div className="bg-white border border-[#E8DCCB] rounded-2xl p-5 mb-6 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
                {/* Search Input */}
                <div className="relative w-full md:max-w-md">
                  <Icons.Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                  <input
                    type="text"
                    placeholder="Search salons by name or address..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-[#FAF6F0] border border-[#E8DCCB] rounded-xl text-sm font-semibold text-[#3E362E] placeholder-stone-400 focus:outline-none focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059] transition-all"
                  />
                </div>

                {/* Filter Group */}
                <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                  {/* Location/City Dropdown */}
                  <div className="relative flex-grow sm:flex-grow-0">
                    <Icons.MapPin size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#C5A059] stroke-[2.5px]" />
                    <select
                      value={selectedCity}
                      onChange={(e) => setSelectedCity(e.target.value)}
                      className="pl-8 pr-8 py-3 bg-[#FAF6F0] border border-[#E8DCCB] rounded-xl text-xs font-black uppercase tracking-wider text-[#3E362E] focus:outline-none focus:border-[#C5A059] appearance-none cursor-pointer w-full min-w-[140px]"
                    >
                      <option value="">All Locations</option>
                      {uniqueCities.map((city) => (
                        <option key={city} value={city}>{city}</option>
                      ))}
                    </select>
                    <Icons.ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8A7B6A] pointer-events-none" />
                  </div>

                  {/* Rating Dropdown */}
                  <div className="relative flex-grow sm:flex-grow-0">
                    <Icons.Star size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#C5A059] fill-[#C5A059]" />
                    <select
                      value={minRating}
                      onChange={(e) => setMinRating(Number(e.target.value))}
                      className="pl-8 pr-8 py-3 bg-[#FAF6F0] border border-[#E8DCCB] rounded-xl text-xs font-black uppercase tracking-wider text-[#3E362E] focus:outline-none focus:border-[#C5A059] appearance-none cursor-pointer w-full min-w-[120px]"
                    >
                      <option value={0}>All Ratings</option>
                      <option value={4.5}>4.5+ ★</option>
                      <option value={4.0}>4.0+ ★</option>
                    </select>
                    <Icons.ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8A7B6A] pointer-events-none" />
                  </div>

                  {/* Sort By Dropdown */}
                  <div className="relative flex-grow sm:flex-grow-0">
                    <Icons.SlidersHorizontal size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#C5A059]" />
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="pl-8 pr-8 py-3 bg-[#FAF6F0] border border-[#E8DCCB] rounded-xl text-xs font-black uppercase tracking-wider text-[#3E362E] focus:outline-none focus:border-[#C5A059] appearance-none cursor-pointer w-full min-w-[140px]"
                    >
                      <option value="">Sort By</option>
                      {userCoords && <option value="distance">Distance (Closest)</option>}
                      <option value="rating">Rating (High to Low)</option>
                      <option value="name">Name (A-Z)</option>
                    </select>
                    <Icons.ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8A7B6A] pointer-events-none" />
                  </div>
                </div>
              </div>

              {filteredSalons.length === 0 ? (
                <div className="py-16 text-center bg-white border border-[#E8DCCB] rounded-3xl mb-6 shadow-sm">
                  <Icons.SearchCode size={48} className="mx-auto text-stone-300 mb-3" />
                  <p className="text-base font-extrabold text-[#3E362E]">No Salons Found</p>
                  <p className="text-stone-400 text-xs mt-1">Try adjusting your search keywords or filters.</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
                  {filteredSalons.map((salon) => (
                    <SalonCard
                      key={salon.id}
                      salon={{
                        ...salon,
                        distance: getSalonDistanceStr(salon),
                      }}
                      onSelect={handleSalonSelect}
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </>
      )}

      {/* ══════════════════════════════
          STEP 2 — SERVICE SELECTION
      ══════════════════════════════ */}
      {step === 2 && (
        <>
          {/* Selected salon summary strip */}
          <div className="flex items-center gap-4 bg-white border border-[#E8DCCB] rounded-2xl p-4 mb-6 shadow-sm">
            <img
              src={selectedSalon.image}
              alt={selectedSalon.name}
              onError={(e) => {
                e.currentTarget.src = defaultShopImage;
              }}
              className="w-14 h-14 rounded-xl object-cover flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-black uppercase tracking-widest text-[#B58B67] mb-0.5">
                Selected Studio
              </p>
              <h3 className="text-base font-extrabold text-[#3E362E] truncate">
                {selectedSalon.name}
              </h3>
              <div className="flex items-center gap-3 text-[11px] text-stone-400 font-semibold mt-0.5">
                <span className="flex items-center gap-1">
                  <Icons.MapPin size={10} className="text-[#C5A059]" />
                  {selectedSalon.distance}
                </span>
                <span className="flex items-center gap-1">
                  <Icons.Star size={10} className="fill-[#C5A059] text-[#C5A059]" />
                  {selectedSalon.rating} ({selectedSalon.reviews} reviews)
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setStep(1)}
              className="text-[10px] font-black uppercase tracking-widest text-[#8A7B6A] hover:text-[#3E362E] border border-[#E8DCCB] hover:border-[#3E362E] px-3 py-2 rounded-lg transition-all cursor-pointer flex-shrink-0"
            >
              Change
            </button>
          </div>

          {/* Services grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            {services.map((service) => (
              <ServiceCard
                key={service._id}
                service={{
                  id: service._id,
                  name: service.name,
                  duration: `${service.duration} min`,
                  price: service.price,
                  popular: service.popular,
                }}
                selected={selectedService}
                onSelect={setSelectedService}
              />
            ))}
          </div>

          {/* CTAs */}
          <div className="flex items-center justify-between gap-4">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="flex items-center gap-2 px-5 py-3.5 rounded-xl border border-[#E8DCCB] text-[#8A7B6A] font-black text-[10px] uppercase tracking-widest hover:border-[#3E362E] hover:text-[#3E362E] transition-all cursor-pointer"
            >
              <Icons.ChevronLeft size={13} />
              Back
            </button>
            <button
              type="button"
              onClick={handleConfirmService}
              disabled={!selectedService}
              className={`flex items-center gap-2.5 px-8 py-4 rounded-xl font-black text-[11px] uppercase tracking-widest transition-all duration-300 ${
                selectedService
                  ? "bg-[#3E362E] text-[#C5A059] hover:bg-[#2A241F] shadow-md active:scale-[0.98] cursor-pointer"
                  : "bg-[#E8DCCB] text-[#B0A090] cursor-not-allowed"
              }`}
            >
              <Icons.CalendarCheck size={13} className="stroke-[2.5px]" />
              {selectedService
                ? `Book ${selectedService.name}`
                : "Select a Service First"}
              <Icons.ChevronRight size={14} />
            </button>
          </div>
        </>
      )}

      {/* ══════════════════════════════
          STEP 3 — CONFIRM BOOKING
      ══════════════════════════════ */}
      {step === 3 && !bookingDone && (
        <div className="max-w-xl mx-auto">
          <div className="bg-white border border-[#E8DCCB] rounded-2xl overflow-hidden shadow-sm mb-5">
            {/* Header */}
            <div className="bg-[#F8F4EE] border-b border-[#E8DCCB] px-6 py-4">
              <p className="text-[10px] font-black uppercase tracking-widest text-[#B58B67]">
                Booking Summary
              </p>
            </div>

            {/* Studio row */}
            <div className="flex items-center gap-4 px-6 py-5 border-b border-[#F0E8DC]">
              <div className="w-10 h-10 rounded-xl bg-[#F8F4EE] flex items-center justify-center flex-shrink-0">
                <Icons.Store size={18} className="text-[#C5A059] stroke-[2px]" />
              </div>
              <div className="flex-1">
                <p className="text-[10px] font-black uppercase tracking-wider text-[#B58B67] mb-0.5">
                  Studio
                </p>
                <p className="text-sm font-extrabold text-[#3E362E]">
                  {selectedSalon?.name}
                </p>
                <p className="text-[11px] text-stone-400 font-medium">
                  {selectedSalon?.address} · {selectedSalon?.distance}
                </p>
              </div>
            </div>

            {/* Service row */}
            <div className="flex items-center gap-4 px-6 py-5 border-b border-[#F0E8DC]">
              <div className="w-10 h-10 rounded-xl bg-[#F8F4EE] flex items-center justify-center flex-shrink-0">
                <Icons.Scissors size={18} className="text-[#C5A059] stroke-[2px]" />
              </div>
              <div className="flex-1">
                <p className="text-[10px] font-black uppercase tracking-wider text-[#B58B67] mb-0.5">
                  Service
                </p>
                <p className="text-sm font-extrabold text-[#3E362E]">
                  {selectedService?.name}
                </p>
                <p className="text-[11px] text-stone-400 font-medium">
                  {selectedService?.duration}
                </p>
              </div>
              <span className="text-base font-black text-[#3E362E]">
                ₹{selectedService?.price}
              </span>
            </div>

            {/* Total */}
            <div className="flex items-center justify-between px-6 py-5">
              <p className="text-sm font-black uppercase tracking-widest text-[#3E362E]">
                Total
              </p>
              <p className="text-xl font-black text-[#C5A059]">
                ₹{selectedService?.price}
              </p>
            </div>
          </div>

          {/* CTAs */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="flex items-center gap-2 px-5 py-3.5 rounded-xl border border-[#E8DCCB] text-[#8A7B6A] font-black text-[10px] uppercase tracking-widest hover:border-[#3E362E] hover:text-[#3E362E] transition-all cursor-pointer flex-shrink-0"
            >
              <Icons.ChevronLeft size={13} />
              Back
            </button>
            <button
              type="button"
              onClick={handleBook}
              disabled={bookingLoading}
              className="flex-1 flex items-center justify-center gap-2.5 py-4 rounded-xl bg-[#3E362E] text-[#C5A059] font-black text-[11px] uppercase tracking-widest hover:bg-[#2A241F] shadow-md active:scale-[0.99] transition-all cursor-pointer disabled:opacity-70"
            >
              {bookingLoading ? (
                <>
                  <Icons.Loader2 size={14} className="animate-spin" />
                  Confirming…
                </>
              ) : (
                <>
                  <Icons.CalendarCheck size={14} className="stroke-[2.5px]" />
                  Confirm Booking
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* ══════════════════════════════
          BOOKING SUCCESS STATE
      ══════════════════════════════ */}
      {bookingDone && (
        <div className="max-w-md mx-auto text-center py-10">
          <div className="w-20 h-20 rounded-full bg-emerald-50 border-2 border-emerald-200 flex items-center justify-center mx-auto mb-5">
            <Icons.CheckCircle2 size={40} className="text-emerald-500 stroke-[1.5px]" />
          </div>
          <h3 className="text-2xl font-black text-[#3E362E] mb-2">
            You're All Set!
          </h3>
          <p className="text-[#8A7B6A] text-sm mb-1 font-medium">
            <span className="font-extrabold text-[#3E362E]">{selectedService?.name}</span>{" "}
            at{" "}
            <span className="font-extrabold text-[#3E362E]">{selectedSalon?.name}</span>
          </p>
          <p className="text-[#B58B67] text-xs font-bold mb-8">
            Our team will confirm your slot shortly.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              type="button"
              onClick={() => navigate("/appointments")}
              className="flex items-center justify-center gap-2 px-6 py-3.5 bg-[#3E362E] text-[#C5A059] rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-[#2A241F] transition-all cursor-pointer shadow-md"
            >
              <Icons.CalendarDays size={13} />
              View Appointments
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="flex items-center justify-center gap-2 px-6 py-3.5 border border-[#E8DCCB] text-[#8A7B6A] rounded-xl font-black text-[10px] uppercase tracking-widest hover:border-[#3E362E] hover:text-[#3E362E] transition-all cursor-pointer"
            >
              <Icons.RefreshCw size={13} />
              Book Again
            </button>
          </div>
        </div>
      )}
    </div>
  );

  const locationGateContent = (
    <div className="max-w-2xl mx-auto text-center py-16 px-6 bg-white border border-[#EADDCA] rounded-[32px] shadow-sm relative overflow-hidden my-8">
      {/* Shine Effect */}
      <div className="absolute top-0 left-[-120%] w-full h-full bg-gradient-to-r from-transparent via-[#C5A059]/5 to-transparent rotate-12 pointer-events-none" />
      
      <div className="relative z-10 flex flex-col items-center">
        <div className="w-16 h-16 rounded-full bg-[#FAF6F0] border border-[#EADDCA] flex items-center justify-center mb-6 shadow-xs relative">
          <Icons.MapPin className="w-8 h-8 text-[#C5A059] animate-bounce" />
          <div className="absolute inset-0 rounded-full border-2 border-[#C5A059]/30 animate-ping opacity-75" />
        </div>

        <h3 className="text-xl font-black uppercase tracking-wider text-[#3E362E] mb-3">
          Location Permission Required
        </h3>
        
        <p className="text-[#8A7B6A] text-sm leading-relaxed max-w-md mb-8 font-medium">
          To browse grooming studios, view real-time queue lengths, and book slots with nearby stylists, please allow location access.
        </p>

        <button
          type="button"
          onClick={detectLocation}
          disabled={isDetectingLocation}
          className="px-8 py-4 bg-[#3E362E] hover:bg-[#C5A059] text-white hover:text-[#2A241F] font-black uppercase text-xs tracking-widest rounded-xl transition-all duration-300 shadow-md hover:scale-[1.02] active:scale-[0.98] cursor-pointer border-none flex items-center gap-2"
        >
          {isDetectingLocation ? (
            <>
              <Icons.Loader2 className="w-4 h-4 animate-spin" />
              Requesting...
            </>
          ) : (
            <>
              <Icons.MapPin className="w-4 h-4" />
              Allow Location Access
            </>
          )}
        </button>

        {locationError && (
          <div className="mt-6 p-4 bg-amber-50/60 border border-amber-200/50 rounded-2xl max-w-md text-left flex items-start gap-3">
            <Icons.AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-extrabold text-amber-800 uppercase tracking-wider mb-1">
                Permission Blocked
              </p>
              <p className="text-stone-600 text-xs leading-normal">
                It looks like location permission is disabled or blocked. Please click the settings/lock icon next to the URL in your browser address bar and enable Location for this site.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  if (isDetectingLocation && !userCoords) {
    const loadingContent = (
      <div className="flex flex-col items-center justify-center py-20">
        <Icons.Loader2 size={40} className="text-[#C5A059] animate-spin mb-4" />
        <p className="text-sm font-bold text-[#3E362E] uppercase tracking-widest animate-pulse">
          Detecting location...
        </p>
      </div>
    );

    if (isStandalone) {
      return (
        <div className="min-h-screen bg-[#FAF6F0] text-[#1A1612] font-sans antialiased flex flex-col">
          <Navbar />
          <div ref={sectionRef} className="flex-grow max-w-[1450px] w-full mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16 flex items-center justify-center">
            {loadingContent}
          </div>
          <Footer />
        </div>
      );
    }

    return (
      <div ref={sectionRef} className="w-full flex items-center justify-center py-12">
        {loadingContent}
      </div>
    );
  }

  const displayContent = userCoords ? content : locationGateContent;

  if (isStandalone) {
    return (
      <div className="min-h-screen bg-[#FAF6F0] text-[#1A1612] font-sans antialiased flex flex-col">
        <Navbar />
        <div ref={sectionRef} className="flex-grow max-w-[1450px] w-full mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16">
          {displayContent}
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div ref={sectionRef} className="w-full">
      {/* ── SECTION WRAPPER ── */}
      <section className="py-6">
        {displayContent}
      </section>
    </div>
  );
};

export default NearbyBarbers;