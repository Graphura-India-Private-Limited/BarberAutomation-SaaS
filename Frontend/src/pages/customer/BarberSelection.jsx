import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { ArrowLeft, Sparkles, Users, Clock } from "lucide-react";
import SearchFilterHeader from "../../components/booking/SearchFilterHeader";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";

export default function BarberSelection() {
  const location = useLocation();
  const navigate = useNavigate();

  const selectedService = location.state?.service;

  const [selectedBarber, setSelectedBarber] = useState(null);

  const [filters, setFilters] = useState({
    search: "",
    cost: "",
    distance: "",
    rating: ""
  });

  const barbers = [
    {
      id: 1,
      name: "John",
      experience: "5 yrs",
      rating: 4.8,
      status: "Available",
      distance: 2,
      img: "https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=400",
      aiWaitTime: { queueLength: 0, past7DaysAvg: "15 mins/cut", estimatedWait: "0 mins" }
    },
    {
      id: 2,
      name: "Mike",
      experience: "3 yrs",
      rating: 4.5,
      status: "Busy",
      distance: 5,
      img: "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=400",
      aiWaitTime: { queueLength: 3, past7DaysAvg: "25 mins/cut", estimatedWait: "75 mins" }
    },
    {
      id: 3,
      name: "Alex",
      experience: "6 yrs",
      rating: 4.9,
      status: "Available",
      distance: 1,
      img: "https://images.unsplash.com/photo-1605497788044-5a32c7078486?w=400",
      aiWaitTime: { queueLength: 1, past7DaysAvg: "12 mins/cut", estimatedWait: "12 mins" }
    }
  ];

  // 🔥 FILTER LOGIC
  const filteredBarbers = barbers.filter((b) => {
    return (
      b.name.toLowerCase().includes(filters.search.toLowerCase()) &&
      (filters.rating === "" || b.rating >= Number(filters.rating)) &&
      (filters.distance === "" || b.distance <= Number(filters.distance))
    );
  });

  // 🔥 SELECT BARBER HANDLER
  const handleBarberSelect = (barber) => {
    setSelectedBarber(barber);
  };

  // 🔥 AUTO ASSIGN
  const handleAutoAssign = () => {
    const availableBarber = filteredBarbers.find(
      (b) => b.status === "Available"
    );

    if (availableBarber) {
      setSelectedBarber(availableBarber);
    } else {
      alert("No barbers available with current filters");
    }
  };

  return (
    <>
      <Navbar />
      <div className="bg-[#FAF6F0] min-h-screen font-sans text-[#3E362E] selection:bg-[#C5A059] selection:text-white relative overflow-hidden flex flex-col">
        
        {/* --- SHINY LUXURY GRADIENT GLOW LAYERS --- */}
        <div className="absolute top-20 -left-40 w-[600px] h-[600px] bg-gradient-to-br from-[#C5A059]/10 via-[#EADDCA]/20 to-transparent rounded-full blur-[120px] pointer-events-none animate-pulse duration-[8000ms]" />
        <div className="absolute bottom-1/3 right-10 w-[700px] h-[500px] bg-[#EADDCA]/30 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-[500px] h-[500px] bg-[#C5A059]/10 rounded-full blur-[100px] pointer-events-none" />

        {/* Premium Hero Banner Aura */}
        <div className="relative h-[280px] sm:h-[320px] flex items-center justify-center overflow-hidden mb-6">
          <div className="absolute inset-0 bg-gradient-to-b from-[#EADDCA]/20 via-transparent to-[#FAF6F0]" />
          
          {/* RETURN BACK BUTTON (Top Left) */}
          <div className="absolute top-6 left-4 sm:left-6 md:left-8 z-20">
            <button
              onClick={() => navigate(-1)}
              className="group flex items-center gap-2 bg-white/80 backdrop-blur-md border border-[#EADDCA] px-4 py-2 rounded-xl text-[#3E362E] font-medium text-xs tracking-wide transition-all duration-300 shadow-md hover:bg-[#3E362E] hover:text-white hover:border-[#3E362E] cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-[#C5A059] group-hover:text-white transition-transform duration-300 transform group-hover:-translate-x-0.5" />
              <span>Back</span>
            </button>
          </div>

          <div className="relative z-10 text-center px-4 max-w-3xl mx-auto pt-6">
            <span className="text-[10px] font-black uppercase tracking-[0.4em] bg-white/80 backdrop-blur-md border border-[#EADDCA] px-4 py-1.5 rounded-full text-[#C5A059] shadow-sm inline-block mb-4">
              Step 02 — Appointment Allocation
            </span>
            <h1 className="text-4xl sm:text-5xl font-black uppercase tracking-tight text-[#3E362E] font-serif leading-none">
              Select Your <span className="text-[#C5A059] italic normal-case">Stylist</span>
            </h1>
            <div className="w-16 h-[2px] bg-[#C5A059] mx-auto mt-5" />
          </div>
        </div>

        {/* Main Content Layout */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 relative z-10 flex-grow w-full">
          
          {/* Selected Service Card Box */}
          <div className="mb-8 flex justify-center">
            {selectedService ? (
              <div className="bg-white/90 backdrop-blur-md rounded-2xl p-3 border border-[#EADDCA] shadow-[0_8px_25px_rgba(0,0,0,0.02)] flex items-center gap-4 max-w-md w-full">
                <div className="w-16 h-16 rounded-xl overflow-hidden bg-stone-100 flex-shrink-0">
                  <img src={selectedService.img || "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=150"} alt={selectedService.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-[9px] font-black uppercase tracking-wider text-stone-400 block mb-0.5">Selected Ritual</span>
                  <h4 className="font-serif font-bold text-sm text-[#3E362E] truncate">{selectedService.name}</h4>
                  <p className="text-[#C5A059] font-serif font-bold text-xs mt-0.5">₹{selectedService.price}</p>
                </div>
              </div>
            ) : (
              <div className="bg-red-50 border border-red-200 rounded-2xl p-4 max-w-md w-full text-center">
                <p className="text-xs text-red-600 font-bold">No ritual selected. Please go back to services.</p>
              </div>
            )}
          </div>

          {/* Search & Filter Component Wrapper */}
          <div className="mb-8 bg-white/80 backdrop-blur-xl p-4 rounded-3xl border border-white/60 shadow-sm">
            <SearchFilterHeader onFiltersChange={setFilters} />
          </div>

          {/* Quick Actions Bar */}
          <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
            <p className="text-xs text-stone-400 font-light">Showing {filteredBarbers.length} bespoke professionals.</p>
            <button onClick={handleAutoAssign} className="bg-[#3E362E] hover:bg-[#C5A059] text-white hover:text-[#2A241F] font-black text-[10px] tracking-[0.2em] uppercase px-6 py-3.5 rounded-xl transition-all duration-300 shadow-sm cursor-pointer select-none">
              Auto Assign Best Stylist
            </button>
          </div>

          {/* Stylists Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {filteredBarbers.map((b) => {
              const isSelected = selectedBarber?.id === b.id;
              const isBusy = b.status === "Busy";

              return (
                <div 
                  key={b.id} 
                  onClick={() => !isBusy && handleBarberSelect(b)}
                  className={`group bg-white/90 backdrop-blur-md rounded-[28px] overflow-hidden border transition-all duration-500 flex flex-col justify-between ${
                    isSelected ? 'border-[#C5A059] shadow-[0_22px_45px_rgba(197,160,89,0.12)] ring-1 ring-[#C5A059]' : 'border-[#EADDCA] shadow-[0_10px_30px_rgba(0,0,0,0.01)] hover:shadow-[0_25px_50px_rgba(62,54,46,0.08)] hover:-translate-y-1.5'
                  } ${isBusy ? 'cursor-not-allowed opacity-85' : 'cursor-pointer'}`}
                >
                  <div className="h-60 overflow-hidden relative bg-stone-100">
                    <img src={b.img} alt={b.name} loading="lazy" className={`w-full h-full object-cover transform scale-100 group-hover:scale-105 transition-transform duration-700 ${isBusy ? 'grayscale-[0.5]' : ''}`} />
                    <div className="absolute top-4 right-4 z-10">
                      <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full border shadow-sm ${isBusy ? 'bg-[#FAF6F0] text-amber-700 border-[#EADDCA]' : 'bg-emerald-50 text-emerald-800 border-emerald-200'}`}>
                        {b.status}
                      </span>
                    </div>
                  </div>

                  <div className="p-6 flex-grow flex flex-col justify-between bg-gradient-to-b from-white to-[#FAF6F0]/20">
                    <div className="text-center mb-6">
                      <h3 className="font-serif font-bold text-2xl text-[#3E362E] mb-1 group-hover:text-[#C5A059] transition-colors">{b.name}</h3>
                      <div className="flex items-center justify-center gap-1 mb-3">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="#C5A059" stroke="#C5A059"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                        <span className="text-xs font-bold text-[#3E362E]">{b.rating} Verified Rating</span>
                      </div>
                      <div className="flex justify-center gap-4 text-xs font-light text-stone-400">
                        <span>{b.experience}</span>
                        <span>•</span>
                        <span>{b.distance} km away</span>
                      </div>

                      {/* AI WAIT TIME ENGINE */}
                      <div className="mt-5 bg-[#FAF6F0] border border-[#EADDCA] rounded-2xl p-4 text-left">
                        <div className="flex items-center gap-2 mb-3 border-b border-[#EADDCA]/60 pb-2">
                          <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
                          <span className="text-[9px] font-black tracking-[0.15em] uppercase text-[#3E362E]">AI Wait Time Engine</span>
                        </div>
                        <div className="space-y-2 text-xs">
                          <div className="flex justify-between text-stone-500">
                            <span className="flex items-center gap-1.5"><Users className="w-3 h-3" /> Queue Length:</span>
                            <span className="font-bold text-[#3E362E]">{b.aiWaitTime.queueLength} Guests</span>
                          </div>
                          <div className="flex justify-between text-stone-500">
                            <span className="flex items-center gap-1.5"><Clock className="w-3 h-3" /> Pace Metric:</span>
                            <span className="font-medium text-[#3E362E]">{b.aiWaitTime.past7DaysAvg}</span>
                          </div>
                          <div className="flex justify-between items-center pt-2 border-t border-dashed border-[#EADDCA] mt-1">
                            <span className="font-bold text-[#3E362E]">Est. Intermission:</span>
                            <span className={`font-serif font-bold px-2 py-0.5 rounded text-sm ${isBusy ? 'text-amber-700 bg-amber-50' : 'text-emerald-700 bg-emerald-50'}`}>
                              {b.aiWaitTime.estimatedWait}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {!isBusy ? (
                      <button
                        onClick={(e) => { e.stopPropagation(); handleBarberSelect(b); }}
                        className={`w-full py-3.5 rounded-xl font-black text-[10px] tracking-[0.2em] uppercase transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer select-none ${
                          isSelected ? 'bg-[#C5A059] text-white border border-[#C5A059]' : 'bg-white text-[#3E362E] border border-[#3E362E] hover:bg-[#3E362E] hover:text-white'
                        }`}
                      >
                        {isSelected ? "Artist Selected" : "Request Artist"}
                      </button>
                    ) : (
                      <button disabled className="w-full bg-stone-100 text-stone-400 py-3.5 rounded-xl font-black text-[10px] tracking-[0.2em] uppercase cursor-not-allowed select-none">
                        Fully Booked Today
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Empty Fallback State */}
          {filteredBarbers.length === 0 && (
            <div className="text-center py-20 bg-white/40 backdrop-blur-md rounded-[32px] border border-dashed border-[#EADDCA] px-4">
              <h4 className="text-sm font-bold uppercase tracking-wider text-[#3E362E] mb-1">No stylists found</h4>
              <p className="text-xs text-stone-400 font-light max-w-xs mx-auto">Try lowering your rating filter or expanding your distance range.</p>
            </div>
          )}

          {/* CONTINUE BUTTON */}
          {selectedBarber && (
            <div className="mt-12 text-center">
              <button
                className="bg-[#C5A059] hover:bg-[#3E362E] text-white font-black text-xs tracking-[0.2em] uppercase px-10 py-5 rounded-xl transition-all duration-300 shadow-md cursor-pointer"
                onClick={() =>
                  navigate("/customer/details", {
                    state: {
                      service: selectedService,
                      barber: selectedBarber
                    }
                  })
                }
              >
                Continue to Details →
              </button>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}