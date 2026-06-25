import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../layout/Navbar";
import Footer from "../layout/Footer";
import defaultShopImage from "../../assets/shop.jpg";
import {
  MapPin,
  Clock,
  Phone,
  Star,
  Scissors,
  CalendarCheck,
  ArrowRight,
  Search,
  ChevronDown,
  ChevronLeft,
  SlidersHorizontal,
  Sparkles,
  Info,
  UserCheck,
  Mail,
  Navigation,
  AlertCircle,
  RefreshCw
} from "lucide-react";

export default function AllSalonsPage() {
  const navigate = useNavigate();

  const [salons, setSalons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [minRating, setMinRating] = useState(0);
  const [sortBy, setSortBy] = useState("");

  const [userCoords, setUserCoords] = useState(null);
  const [userAddress, setUserAddress] = useState("");
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);
  const [locationError, setLocationError] = useState(null);

  // Helper to compute distance in km
  const getDistanceInKm = (lat1, lon1, lat2, lon2) => {
    if (!lat1 || !lon1 || !lat2 || !lon2) return null;
    const R = 6371; // Earth radius in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
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
        console.error("Location error:", error);
        setLocationError("Location access denied or unavailable");
        setIsDetectingLocation(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  useEffect(() => {
    detectLocation();

    const fetchSalons = async () => {
      try {
        setLoading(true);
        const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
        const response = await fetch(`${API}/salon`);
        const data = await response.json();
        
        if (data.success && data.salons) {
          const mapped = data.salons.map((s) => ({
            id: s._id,
            name: s.salon_name,
            address: s.address || "Address not listed",
            phone: s.support_number || s.mobile || "No Contact Info",
            email: s.email || "contact@barberpro.com",
            rating: s.rating || 4.5,
            reviews: s.total_reviews || 0,
            distance: "Nearby",
            image: s.images?.[0] || defaultShopImage,
            hours: `${s.opening_time || "09:00"} - ${s.closing_time || "21:00"}`,
            about: s.about || "Premium grooming, experienced stylists, and luxury comfort — all designed for a smooth modern booking experience.",
            owner_name: s.owner_name || "Valued Partner",
            latitude: s.latitude,
            longitude: s.longitude
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
    return "Nearby";
  };

  const extractCity = (address) => {
    if (!address || address === "Address not listed") return "Not Listed";
    const addressLower = address.toLowerCase();
    if (addressLower.includes("noida")) return "Noida";
    if (addressLower.includes("nashik")) return "Nashik";
    if (addressLower.includes("maharashtra")) return "Maharashtra";
    if (addressLower.includes("delhi")) return "Delhi";
    if (addressLower.includes("pune")) return "Pune";
    const parts = address.split(",");
    return parts[parts.length - 1]?.trim() || parts[0]?.trim() || "Other";
  };

  const uniqueCities = [...new Set(salons.map((s) => extractCity(s.address)))].filter(
    (c) => c !== "Not Listed" && c !== "Other"
  );

  const filteredSalons = salons
    .filter((salon) => {
      const matchesSearch =
        salon.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        salon.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
        salon.about.toLowerCase().includes(searchQuery.toLowerCase());
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

  return (
    <div className="min-h-screen bg-[#FAF6F0] text-stone-800 font-sans overflow-x-hidden flex flex-col">
      <Navbar />

      {/* ── HERO BANNER ── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#1A1613] via-[#2A241F] to-[#3E362E] pt-32 pb-24 text-center select-none">
        {/* Background Image Layer with Gradient Overlay for premium visual texture */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1560066984-138dadb4c035?w=1600&q=80"
            alt="Luxury Studio Interior"
            className="w-full h-full object-cover opacity-20 object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#2A241F]/40 to-black/20" />
        </div>

        <div className="absolute top-[-100px] left-[-100px] w-[320px] h-[320px] bg-[#C5A059]/25 blur-[120px] rounded-full animate-pulse pointer-events-none" />
        <div className="absolute bottom-[-100px] right-[-100px] w-[320px] h-[320px] bg-white/10 blur-[120px] rounded-full animate-pulse pointer-events-none" />
        <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/asfalt-dark.png')] pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-6">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#FFE6A7] hover:text-[#C5A059] transition cursor-pointer border-none bg-transparent mb-6"
          >
            <ChevronLeft size={14} className="stroke-[2.5px]" /> Back
          </button>

          <span className="block text-[11px] font-black uppercase tracking-[0.35em] text-[#C5A059]">Discover Luxury Studios</span>
          <h1 className="mt-4 text-4xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight bg-gradient-to-r from-[#C5A059] via-[#FFE6A7] to-[#C5A059] bg-clip-text text-transparent leading-tight font-serif">
            Our Elite Partners
          </h1>
          <div className="w-20 h-[3px] bg-gradient-to-r from-[#C5A059] to-[#FFE6A7] mx-auto mt-5 rounded-full shadow-[0_0_20px_rgba(197,160,89,0.7)]" />
          <p className="mt-6 text-stone-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Browse through all our premium salon destinations. Check details, real-time reviews, location parameters, and reserve your premier slot.
          </p>
        </div>
      </section>

      {/* ── SEARCH & FILTER CONSOLE ── */}
      <section className="max-w-7xl w-full mx-auto px-6 -mt-8 relative z-30">
        <div className="bg-white border border-[#E8DCCB] rounded-[2rem] p-5 shadow-lg flex flex-col lg:flex-row gap-4 items-center justify-between">
          {/* Search Box */}
          <div className="relative w-full lg:max-w-md">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              placeholder="Search by studio name, service, or keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3.5 bg-[#FAF6F0] border border-[#E8DCCB] rounded-2xl text-sm font-semibold text-[#3E362E] placeholder-stone-400 focus:outline-none focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059] transition-all"
            />
          </div>

          {/* Filters Row */}
          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
            {/* Location dropdown */}
            <div className="relative flex-grow sm:flex-grow-0">
              <MapPin size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#C5A059] stroke-[2.5px]" />
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="pl-9 pr-9 py-3.5 bg-[#FAF6F0] border border-[#E8DCCB] rounded-2xl text-xs font-black uppercase tracking-wider text-[#3E362E] focus:outline-none focus:border-[#C5A059] appearance-none cursor-pointer w-full min-w-[140px]"
              >
                <option value="">All Cities</option>
                {uniqueCities.map((city) => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
              <ChevronDown size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#8A7B6A] pointer-events-none" />
            </div>

            {/* Rating Filter */}
            <div className="relative flex-grow sm:flex-grow-0">
              <Star size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#C5A059] fill-[#C5A059]" />
              <select
                value={minRating}
                onChange={(e) => setMinRating(Number(e.target.value))}
                className="pl-9 pr-9 py-3.5 bg-[#FAF6F0] border border-[#E8DCCB] rounded-2xl text-xs font-black uppercase tracking-wider text-[#3E362E] focus:outline-none focus:border-[#C5A059] appearance-none cursor-pointer w-full min-w-[130px]"
              >
                <option value={0}>All Ratings</option>
                <option value={4.7}>4.7+ ★ Excellent</option>
                <option value={4.5}>4.5+ ★ Premium</option>
                <option value={4.0}>4.0+ ★ Good</option>
              </select>
              <ChevronDown size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#8A7B6A] pointer-events-none" />
            </div>

            {/* Sort Dropdown */}
            <div className="relative flex-grow sm:flex-grow-0">
              <SlidersHorizontal size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#C5A059]" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="pl-9 pr-9 py-3.5 bg-[#FAF6F0] border border-[#E8DCCB] rounded-2xl text-xs font-black uppercase tracking-wider text-[#3E362E] focus:outline-none focus:border-[#C5A059] appearance-none cursor-pointer w-full min-w-[140px]"
              >
                <option value="">Sort By</option>
                {userCoords && <option value="distance">Distance (Closest)</option>}
                <option value="rating">Rating (High to Low)</option>
                <option value="name">Name (A-Z)</option>
              </select>
              <ChevronDown size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#8A7B6A] pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Location Status strip */}
        {userAddress && (
          <div className="mt-4 flex items-center gap-2 text-stone-600 text-xs font-semibold bg-white/60 border border-[#E8DCCB] px-4 py-2.5 rounded-2xl w-fit shadow-3xs">
            <Navigation size={12} className="text-[#C5A059] flex-shrink-0 animate-pulse" />
            <span>Studio Location Radar Active: <strong className="text-[#3E362E]">{userAddress}</strong></span>
            <button
              onClick={detectLocation}
              disabled={isDetectingLocation}
              className="text-[#C5A059] hover:text-[#3E362E] transition-colors ml-2 bg-transparent border-none cursor-pointer p-0 font-bold flex items-center gap-1"
              title="Refresh Location"
            >
              <RefreshCw size={11} className={isDetectingLocation ? "animate-spin" : ""} />
            </button>
          </div>
        )}
      </section>

      {/* ── MAIN STUDIOS LIST GRID ── */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-6 py-12">
        {loading ? (
          <div className="grid gap-8 grid-cols-1 md:grid-cols-2">
            {[1, 2, 4].map((n) => (
              <div
                key={n}
                className="h-[460px] bg-white border border-[#E8DCCB] animate-pulse rounded-[2rem] shadow-xs"
              />
            ))}
          </div>
        ) : filteredSalons.length === 0 ? (
          <div className="py-20 text-center bg-white border border-[#E8DCCB] rounded-[2rem] shadow-sm max-w-xl mx-auto">
            <AlertCircle className="w-16 h-16 mx-auto text-[#C5A059]/40 mb-4" />
            <h3 className="text-lg font-black uppercase text-[#3E362E] tracking-wider">No Premium Studios Match</h3>
            <p className="text-stone-500 text-xs mt-2 max-w-sm mx-auto leading-normal">
              We couldn't find any approved salons matching your keyword search or location parameters. Try relaxing your filters.
            </p>
          </div>
        ) : (
          <div className="grid gap-8 grid-cols-1 lg:grid-cols-2">
            {filteredSalons.map((salon) => {
              const distanceStr = getSalonDistanceStr(salon);
              return (
                <div
                  key={salon.id}
                  className="group bg-white rounded-[2rem] border border-[#E8DCCB] hover:border-[#C5A059]/50 hover:shadow-[0_15px_45px_rgba(197,160,89,0.12)] transition-all duration-500 overflow-hidden flex flex-col justify-between"
                >
                  <div>
                    {/* Header Image Frame */}
                    <div className="relative h-64 overflow-hidden bg-stone-100 border-b border-[#E8DCCB]/60">
                      <img
                        src={salon.image}
                        alt={salon.name}
                        onError={(e) => {
                          e.currentTarget.src = defaultShopImage;
                        }}
                        className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent pointer-events-none" />

                      {/* Status Badges */}
                      <div className="absolute top-4 left-4 flex gap-2">
                        <span className="bg-emerald-50/95 backdrop-blur text-emerald-700 text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-xl border border-emerald-200/50 shadow-2xs">
                          ● Approved Studio
                        </span>
                        {userCoords && salon.latitude && (
                          <span className="bg-white/95 backdrop-blur text-[#C5A059] text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-xl border border-stone-250 shadow-2xs flex items-center gap-1">
                            <Navigation size={9} />
                            {distanceStr}
                          </span>
                        )}
                      </div>

                      {/* Rating Capsule */}
                      <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur px-3 py-2 rounded-xl flex items-center gap-1.5 shadow-md">
                        <Star size={11} className="fill-[#C5A059] text-[#C5A059]" />
                        <span className="text-[12px] font-black text-stone-900 leading-none">{salon.rating}</span>
                        <span className="text-[10px] text-stone-400 font-semibold leading-none">({salon.reviews} reviews)</span>
                      </div>
                    </div>

                    {/* Content Area */}
                    <div className="p-6 sm:p-8 space-y-4 text-left">
                      <div>
                        <h2 className="text-xl sm:text-2xl font-serif font-black text-[#3E362E] tracking-tight group-hover:text-[#C5A059] transition-colors duration-300">
                          {salon.name}
                        </h2>
                        <div className="flex items-center gap-1.5 text-stone-400 text-xs font-semibold mt-1.5">
                          <MapPin size={12} className="text-[#C5A059] flex-shrink-0" />
                          <span className="truncate">{salon.address}</span>
                        </div>
                      </div>

                      <p className="text-stone-500 text-sm leading-relaxed font-medium line-clamp-3">
                        {salon.about}
                      </p>

                      {/* Info Details Row */}
                      <div className="grid grid-cols-2 gap-4 pt-5 border-t border-stone-100 text-xs font-semibold text-stone-500">
                        <div className="flex items-center gap-2.5">
                          <div className="p-1.5 bg-[#FAF6F0] rounded-lg text-[#C5A059]">
                            <Clock size={14} className="stroke-[2.5px]" />
                          </div>
                          <div>
                            <span className="block text-[9px] uppercase font-black tracking-wider text-stone-400 leading-none mb-0.5">Hours</span>
                            <span className="text-[#3E362E] font-extrabold">{salon.hours}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2.5">
                          <div className="p-1.5 bg-[#FAF6F0] rounded-lg text-[#C5A059]">
                            <Phone size={14} className="stroke-[2.5px]" />
                          </div>
                          <div>
                            <span className="block text-[9px] uppercase font-black tracking-wider text-stone-400 leading-none mb-0.5">Phone</span>
                            <span className="text-[#3E362E] font-extrabold">{salon.phone}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2.5">
                          <div className="p-1.5 bg-[#FAF6F0] rounded-lg text-[#C5A059]">
                            <Mail size={14} className="stroke-[2.5px]" />
                          </div>
                          <div>
                            <span className="block text-[9px] uppercase font-black tracking-wider text-stone-400 leading-none mb-0.5">Email</span>
                            <span className="text-[#3E362E] font-extrabold truncate max-w-[125px] block">{salon.email}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2.5">
                          <div className="p-1.5 bg-[#FAF6F0] rounded-lg text-[#C5A059]">
                            <UserCheck size={14} className="stroke-[2.5px]" />
                          </div>
                          <div>
                            <span className="block text-[9px] uppercase font-black tracking-wider text-stone-400 leading-none mb-0.5">Owner</span>
                            <span className="text-[#3E362E] font-extrabold">{salon.owner_name}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="p-6 sm:p-8 pt-0 flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={() => {
                        localStorage.setItem("selectedSalonId", salon.id);
                        localStorage.setItem("selectedSalonName", salon.name);
                        navigate("/salon");
                      }}
                      className="flex-1 px-5 py-3.5 border border-[#E8DCCB] hover:border-[#C5A059] bg-white hover:bg-stone-50/50 text-[#3E362E] font-black text-[10px] uppercase tracking-[0.2em] rounded-xl hover:scale-[1.02] transition-all duration-300 cursor-pointer flex items-center justify-center gap-2"
                    >
                      <Info size={13} className="stroke-[2.5px]" /> View Studio Details
                    </button>
                    
                    <button
                      onClick={() => {
                        localStorage.setItem("selectedSalonId", salon.id);
                        localStorage.setItem("selectedSalonName", salon.name);
                        navigate("/customer/services");
                      }}
                      className="flex-1 px-5 py-3.5 bg-gradient-to-r from-[#C5A059] via-[#E8C878] to-[#C5A059] hover:from-[#b08e4d] hover:to-[#b08e4d] text-[#2A241F] font-black text-[10px] uppercase tracking-[0.2em] rounded-xl hover:scale-[1.02] transition-all duration-300 cursor-pointer border-none flex items-center justify-center gap-2 shadow-md active:scale-[0.98]"
                    >
                      <CalendarCheck size={13} className="stroke-[2.5px]" /> Book Appointment
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
