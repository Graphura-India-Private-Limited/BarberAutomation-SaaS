import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import * as Icons from "lucide-react";
import Footer from "../../components/layout/Footer";

const NearbyBarbers = () => {
  const navigate = useNavigate();
  const [location, setLocation] = useState(null);
  const [salons, setSalons] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const MapPin = Icons.MapPin;
  const Navigation = Icons.Navigation;
  const Star = Icons.Star;
  const Scissors = Icons.Scissors;
  const ArrowLeft = Icons.ArrowLeft; // ✅ Imported ArrowLeft navigation icon

  // १. User ची Location मिळवणे
  const handleGetLocation = () => {
    setLoading(true);
    setError(null);

    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setLocation(coords);
        fetchNearbySalons(coords.lat, coords.lng);
      },
      (err) => {
        setError("Location access denied. Please search manually.");
        setLoading(false);
      }
    );
  };

  // Run automatically on first mount to simulate loading states
  useEffect(() => {
    handleGetLocation();
  }, []);

  // २. Backend कडून डेटा आणणे (Demo साठी सध्या Mock Data वापरला आहे)
  const fetchNearbySalons = async (lat, lng) => {
    try {
      // Demo Data
      setTimeout(() => {
        const demoData = [
          { id: "1", name: "The Royal Groom", distance: "0.8 km", rating: 4.9, image: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?q=80&w=500" },
          { id: "2", name: "Vintage Scissors", distance: "1.5 km", rating: 4.7, image: "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?q=80&w=500" },
          { id: "3", name: "Urban Edge Barber", distance: "2.3 km", rating: 4.5, image: "https://images.unsplash.com/photo-1621605815841-aa33c5447a33?q=80&w=500" },
        ];
        setSalons(demoData);
        loading(false);
        setLoading(false);
      }, 1200);
    } catch (err) {
      setError("Failed to fetch shops");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF6F0] flex flex-col font-sans text-stone-800 antialiased overflow-x-hidden justify-between">

      {/* ✂️ BARBER PRO GLOBAL EXECUTIVE STICKY NAVIGATION HEADER */}
      <header className="sticky top-0 bg-[#3E362E] border-b border-[#2A241F] px-6 md:px-8 py-4 flex items-center justify-between z-50 shadow-md">
        <div className="flex items-center gap-5">
          
          {/* ── ✅ THE CHIP INJECTION: EXECUTIVE REAR-FACING EXIT BUTTON ── */}
          <button
            type="button"
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-all duration-300 hover:opacity-85 group text-white bg-white/10 px-3.5 py-2.5 rounded-xl border border-white/10 cursor-pointer select-none"
          >
            <ArrowLeft size={12} className="transition-transform group-hover:-translate-x-0.5 text-[#C5A059]" />
            <span>Exit</span>
          </button>

          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#C5A059]/20 border border-[#C5A059]/40 flex items-center justify-center">
              <svg className="w-5 h-5 text-[#C5A059]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.121 14.121L19 19m-4.879-4.879l-4.242-4.242M14.121 14.121a3 3 0 10-4.243-4.242m4.243 4.242a3 3 0 11-4.243-4.243m0 0L4 4m5.172 5.172L4 14m5.172-5.172l4.242 4.242" />
              </svg>
            </div>
            <div className="text-left">
              <h1 className="text-xl font-black text-[#C5A059] tracking-[0.15em] uppercase leading-none">
                BARBER <span className="text-white">PRO</span>
              </h1>
              <p className="text-[9px] text-stone-400 font-bold tracking-[0.3em] uppercase mt-1 leading-none">
                Premium Grooming Systems
              </p>
            </div>
          </div>
        </div>
        
        <div className="text-right hidden sm:block">
          <div className="text-[10px] text-stone-400 uppercase font-black tracking-widest leading-none">Discovery Radar</div>
          <div className="text-sm text-white font-black mt-1 bg-white/10 px-3 py-1 rounded-md border border-white/5 inline-block leading-none">
            Salons Studio List
          </div>
        </div>
      </header>

      {/* 🗺️ DISCOVERY MAP CONTENT VIEW CANVAS */}
      <section className="py-12 px-6 bg-[#FAF6F0] flex-1">
        <div className="max-w-7xl mx-auto pt-4">
          
          {/* Section Main Header Titles */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6 text-left">
            <div className="space-y-2">
              <h6 className="text-[#A37B58] text-[10px] font-black uppercase tracking-[0.4em]">Local Discovery</h6>
              <h2 className="text-4xl font-black text-stone-900 tracking-tight uppercase leading-none">
                Nearby <span className="italic font-serif font-medium lowercase text-[#C5A059]">Masters</span>
              </h2>
            </div>
            
            <button 
              type="button"
              onClick={handleGetLocation}
              className="group relative flex items-center gap-3 bg-[#3E362E] hover:bg-[#2A241F] text-[#C5A059] px-8 py-4 rounded-xl font-black text-xs uppercase tracking-widest transition-all shadow-md cursor-pointer active:scale-[0.98]"
            >
              {Navigation && <Navigation size={14} className="stroke-[2.5px] transition-transform group-hover:rotate-45" />}
              {loading ? "Scanning Radar..." : "Detect My Location"}
            </button>
          </div>

          {/* Loading / Shimmer Mock State View */}
          {loading && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3].map((n) => (
                <div key={n} className="h-[420px] bg-white border border-stone-200/40 animate-pulse rounded-[2rem] shadow-xs" />
              ))}
            </div>
          )}

          {/* Error Message Box Layout */}
          {error && (
            <div className="text-center py-16 bg-red-50 rounded-3xl border border-red-200/60 max-w-xl mx-auto shadow-xs px-8 flex items-center gap-4">
              <div className="text-red-500 text-2xl">⚠️</div>
              <div className="text-left">
                <p className="text-red-900 text-xs font-black uppercase tracking-wider">Radar Connection Dropped</p>
                <p className="text-red-600 text-xs font-semibold mt-0.5 leading-normal">{error}</p>
              </div>
            </div>
          )}

          {/* Studio Grid Item Cards Pipeline */}
          {!loading && salons.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {salons.map((salon) => (
                <div key={salon.id} className="group relative bg-white rounded-[2rem] overflow-hidden shadow-xs hover:shadow-xl transition-all duration-500 border border-stone-200/50 flex flex-col">
                  
                  {/* Image Header Area Section */}
                  <div className="h-64 overflow-hidden relative bg-stone-100 flex-shrink-0">
                    <img 
                      src={salon.image} 
                      alt={salon.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                    />
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-lg flex items-center gap-1 shadow-sm border border-stone-200/20">
                      {Star && <Star size={11} className="fill-[#C5A059] text-[#C5A059]" />}
                      <span className="text-xs font-black text-stone-900">{salon.rating.toFixed(1)}</span>
                    </div>
                  </div>

                  {/* Body Content Description Section */}
                  <div className="p-6 flex flex-col flex-1 justify-between text-left">
                    <div className="flex justify-between items-start gap-4 mb-4">
                      <div className="min-w-0">
                        <h3 className="text-xl font-extrabold text-stone-900 tracking-tight truncate mb-1">
                          {salon.name}
                        </h3>
                        <div className="flex items-center gap-1.5 text-stone-400 text-xs font-bold uppercase tracking-wider">
                          {MapPin && <MapPin size={12} className="text-[#C5A059] stroke-[2.5px]" />}
                          {salon.distance} away
                        </div>
                      </div>
                      <div className="p-3 bg-stone-50 border border-stone-200/40 rounded-xl text-[#A37B58] flex-shrink-0">
                        {Scissors && <Scissors size={18} className="stroke-[2.5px]" />}
                      </div>
                    </div>

                    {/* Action Trigger Link Button */}
                    <button
                      type="button"
                      onClick={() => navigate(`/salon/${salon.id}`)}
                      className="w-full py-4 mt-2 border border-stone-200 hover:border-stone-900 bg-white hover:bg-[#3E362E] hover:text-white text-stone-800 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all shadow-3xs cursor-pointer relative z-30 active:scale-[0.99]"
                    >
                      View Studio & Book
                    </button>
                  </div>

                </div>
              ))}
            </div>
          )}
          
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default NearbyBarbers;