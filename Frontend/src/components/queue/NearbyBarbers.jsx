import React, { useState, useEffect } from "react";
import * as Icons from "lucide-react";

const NearbyBarbers = () => {
  const [location, setLocation] = useState(null);
  const [salons, setSalons] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const MapPin = Icons.MapPin;
  const Navigation = Icons.Navigation;
  const Star = Icons.Star;
  const Scissors = Icons.Scissors;

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

  // २. Backend कडून डेटा आणणे (Demo साठी सध्या Mock Data वापरला आहे)
  const fetchNearbySalons = async (lat, lng) => {
    try {
      // API Call: const response = await fetch(`/api/nearby-salons?lat=${lat}&lng=${lng}`);
      // const data = await response.json();
      
      // Demo Data
      setTimeout(() => {
        const demoData = [
          { id: 1, name: "The Royal Groom", distance: "0.8 km", rating: 4.9, image: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?q=80&w=500" },
          { id: 2, name: "Vintage Scissors", distance: "1.5 km", rating: 4.7, image: "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?q=80&w=500" },
          { id: 3, name: "Urban Edge Barber", distance: "2.3 km", rating: 4.5, image: "https://images.unsplash.com/photo-1621605815841-aa33c5447a33?q=80&w=500" },
        ];
        setSalons(demoData);
        setLoading(false);
      }, 1500);
    } catch (err) {
      setError("Failed to fetch shops");
      setLoading(false);
    }
  };

  return (
    <section className="py-16 px-6 bg-[#FDFBF7]">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div className="space-y-2">
            <h6 className="text-[#C5A059] text-[10px] font-black uppercase tracking-[0.4em]">Local Discovery</h6>
            <h2 className="text-4xl font-bold text-[#1A1612]">Nearby <span className="italic font-serif">Masters</span></h2>
          </div>
          
          <button 
            onClick={handleGetLocation}
            className="group relative flex items-center gap-3 bg-[#1A1612] text-[#C5A059] px-8 py-4 rounded-full font-bold text-xs uppercase tracking-widest overflow-hidden transition-all hover:shadow-[0_10px_30px_rgba(26,22,18,0.3)]"
          >
            <div className="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent via-white/10 to-transparent group-hover:animate-shine" />
            {Navigation && <Navigation size={16} className="group-hover:animate-bounce" />}
            {loading ? "Finding..." : "Detect My Location"}
          </button>
        </div>

        {/* Loading / Shimmer State */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-[400px] bg-stone-200 animate-pulse rounded-3xl" />
            ))}
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-20 bg-red-50 rounded-3xl border border-red-100">
            <p className="text-red-600 font-medium">{error}</p>
          </div>
        )}

        {/* Salons List */}
        {!loading && salons.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {salons.map((salon) => (
              <div key={salon.id} className="group relative bg-white rounded-[2rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-stone-100">
                {/* Image Section */}
                <div className="h-64 overflow-hidden relative">
                  <img src={salon.image} alt={salon.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full flex items-center gap-1 shadow-lg">
                    {Star && <Star size={12} className="fill-yellow-400 text-yellow-400" />}
                    <span className="text-[11px] font-bold">{salon.rating}</span>
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-8">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-[#1A1612] mb-1">{salon.name}</h3>
                      <div className="flex items-center gap-2 text-stone-400 text-xs uppercase tracking-tighter">
                        {MapPin && <MapPin size={12} className="text-[#C5A059]" />}
                        {salon.distance} away
                      </div>
                    </div>
                    <div className="p-3 bg-[#C5A059]/10 rounded-xl text-[#C5A059]">
                       {Scissors && <Scissors size={20} />}
                    </div>
                  </div>

                  <button className="w-full py-4 mt-4 border border-[#1A1612] rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-[#1A1612] hover:text-white transition-all duration-300">
                    View Studio & Book
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default NearbyBarbers;