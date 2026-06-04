import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import * as Icons from "lucide-react";
import Footer from "../layout/Footer";
import Navbar from "../layout/Navbar";

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
  const ArrowLeft = Icons.ArrowLeft;


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
        console.error(err);
        setError("Location access denied. Please search manually.");
        setLoading(false);
      }
    );
  };


  useEffect(() => {
    handleGetLocation();
  }, []);


  const fetchNearbySalons = async (lat, lng) => {
    const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
    try {
      const r = await fetch(`${API}/salon`);
      const d = await r.json();
      if (d.success && d.salons && d.salons.length > 0) {
        setSalons(d.salons.map((s, idx) => ({
          id: s._id,
          name: s.salon_name,
          distance: `${(idx + 1) * 0.8} km`,
          rating: s.rating || 4.5 + (idx % 5) * 0.1,
          image: (s.images && s.images[0]) || "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?q=80&w=500"
        })));
      } else {
        const demoData = [
          { id: "demo-s1", name: "The Royal Groom", distance: "0.8 km", rating: 4.9, image: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?q=80&w=500" },
          { id: "demo-s2", name: "Vintage Scissors", distance: "1.5 km", rating: 4.7, image: "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?q=80&w=500" },
          { id: "demo-s3", name: "Urban Edge Barber", distance: "2.3 km", rating: 4.5, image: "https://img.magnific.com/free-photo/handsome-man-barber-shop-styling-hair_1303-20978.jpg?semt=ais_hybrid&w=740&q=80" },
        ];
        setSalons(demoData);
      }
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch shops");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF6F0] flex flex-col font-sans text-stone-800 antialiased overflow-x-hidden justify-between">

      <Navbar />
      {/* ── FLOATING BACK BUTTON ── */}
      <div className="fixed top-24 left-5 z-[999]">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="group flex items-center gap-2 backdrop-blur-xl border border-[#C5A059]/20 hover:border-[#C5A059]/50 px-4 py-3 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.35)] transition-all duration-300 hover:scale-105 active:scale-[0.98]"
        >
          <ArrowLeft
            size={14}
            className="text-[#C5A059] transition-transform duration-300 group-hover:-translate-x-1"
          />

        </button>
      </div>


      {/* 🗺️ DISCOVERY MAP CONTENT VIEW CANVAS */}
      <section className="pt-[110px] md:pt-[130px] lg:pt-[140px] pb-12 px-4 md:px-6 bg-[#FAF6F0] flex-1">
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
                    {/* <img
                      src={salon.image}
                      alt={salon.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    /> */}
                    <img
                      src={salon.image}
                      alt={salon.name}
                      onError={(e) => {
                        e.currentTarget.src =
                          "https://images.unsplash.com/photo-1621605815841-aa33c5447a33?q=80&w=500";
                      }}
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