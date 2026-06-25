import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { 
  CheckCircle, AlertCircle, ArrowLeft, Star, Search, Check, ArrowRight
} from 'lucide-react';
import Navbar from "../layout/Navbar";
import Footer from "../layout/Footer";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const ReviewSystem = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  // Pull booking context from Router state OR query params
  const stateData = location.state || {};
  const [salonId, setSalonId] = useState(
    stateData.salonId || searchParams.get("salonId") || localStorage.getItem("lastSalonId") || ""
  );
  const [barberId, setBarberId] = useState(
    stateData.barberId || searchParams.get("barberId") || localStorage.getItem("lastBarberId") || ""
  );
  const bookingId = stateData.bookingId || searchParams.get("bookingId") || null;
  const barberName = stateData.barberName || searchParams.get("barberName") || "";
  const salonName = stateData.salonName || searchParams.get("salonName") || "";

  const token = localStorage.getItem("token");

  /* ── MCQ Questions Configurations ── */
  const mcqQuestions = [
    {
      key: "cleanliness",
      title: "Cleanliness & Hygiene",
      subtitle: "Sanitation and sterilization standards of tools & workspace",
      options: [
        { label: "Sparkling / Sterile", stars: 5 },
        { label: "Very Clean & Organized", stars: 4 },
        { label: "Decent / Acceptable", stars: 3 },
        { label: "Slightly Messy", stars: 2 },
        { label: "Poor Hygiene / Dirty", stars: 1 }
      ]
    },
    {
      key: "ambience",
      title: "Ambience & Comfort",
      subtitle: "Salon lighting, music playlist, seating, and aroma",
      options: [
        { label: "Luxurious & Peaceful", stars: 5 },
        { label: "Modern & Cozy", stars: 4 },
        { label: "Average / Ordinary", stars: 3 },
        { label: "Slightly Distracting", stars: 2 },
        { label: "Uncomfortable / Loud", stars: 1 }
      ]
    },
    {
      key: "staff",
      title: "Staff Behavior",
      subtitle: "Customer service reception, politeness, and care",
      options: [
        { label: "Highly Friendly & Skilled", stars: 5 },
        { label: "Competent & Courteous", stars: 4 },
        { label: "Standard / Normal", stars: 3 },
        { label: "Inattentive / Rushed", stars: 2 },
        { label: "Unprofessional / Rude", stars: 1 }
      ]
    },
    {
      key: "service",
      title: "Service Quality",
      subtitle: "Precision, technique, and final styling outcome",
      options: [
        { label: "Flawless & Bespoke", stars: 5 },
        { label: "Good & Satisfactory", stars: 4 },
        { label: "Decent / Ordinary", stars: 3 },
        { label: "Subpar / Rushed", stars: 2 },
        { label: "Very Poor Quality", stars: 1 }
      ]
    },
    {
      key: "wait_time",
      title: "Waiting Experience",
      subtitle: "Efficiency of queue flow and seating delays",
      options: [
        { label: "Seated Immediately / Perfect Queue", stars: 5 },
        { label: "Minimal Wait (Under 10 mins)", stars: 4 },
        { label: "Reasonable Wait Time", stars: 3 },
        { label: "Delayed / Long Wait", stars: 2 },
        { label: "Extremely Late / Mismanaged", stars: 1 }
      ]
    }
  ];

  /* ── State ── */
  const [salonsList, setSalonsList] = useState([]);
  const [barbersList, setBarbersList] = useState([]);
  const [salonSearch, setSalonSearch] = useState("");
  const [selectedSalonName, setSelectedSalonName] = useState(salonName);
  
  // MCQ Ratings State
  const [mcqSelections, setMcqSelections] = useState({
    cleanliness: null,
    ambience: null,
    staff: null,
    service: null,
    wait_time: null
  });

  const [barberRating, setBarberRating] = useState(0);
  const [barberHover, setBarberHover] = useState(0);
  const [selectedBarberName, setSelectedBarberName] = useState(barberName);

  const [reviewText, setReviewText] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [attemptedSubmit, setAttemptedSubmit] = useState(false);

  /* ── Redirect to login if not authenticated ── */
  useEffect(() => {
    if (!token) {
      setError("Please login to write a review");
      setTimeout(() => navigate("/login"), 1500);
    }
  }, [token, navigate]);

  /* ── Fetch Salons list if salonId is not present ── */
  useEffect(() => {
    if (!salonId) {
      fetch(`${API}/salon`)
        .then(r => r.json())
        .then(d => {
          if (d.success) setSalonsList(d.salons || []);
        })
        .catch(() => {});
    }
  }, [salonId]);

  /* ── Fetch Salon Details if salonId is present but selectedSalonName is empty ── */
  useEffect(() => {
    if (salonId && !selectedSalonName) {
      fetch(`${API}/salon`)
        .then(r => r.json())
        .then(d => {
          if (d.success && d.salons) {
            const found = d.salons.find(s => s._id === salonId);
            if (found) {
              setSelectedSalonName(found.salon_name);
            }
          }
        })
        .catch(() => {});
    }
  }, [salonId, selectedSalonName]);

  /* ── Fetch Barbers for selected Salon ── */
  useEffect(() => {
    if (salonId) {
      fetch(`${API}/barber/salon/${salonId}`)
        .then(r => r.json())
        .then(d => {
          if (d.success) setBarbersList(d.barbers || []);
        })
        .catch(() => {});
    }
  }, [salonId]);

  /* ── Update selected stylist name when barbersList loads ── */
  useEffect(() => {
    if (barbersList.length > 0 && barberId && !selectedBarberName) {
      const bObj = barbersList.find(b => b._id === barberId);
      if (bObj) {
        setSelectedBarberName(bObj.name);
      }
    }
  }, [barbersList, barberId, selectedBarberName]);

  /* ── Submit Handler ── */
  const handleSubmit = async () => {
    setLoading(true);
    setError("");

    // Calculate aggregated salon rating (average of 5 MCQ categories)
    const totalStars = mcqQuestions.reduce((sum, q) => sum + mcqSelections[q.key].stars, 0);
    const calculatedSalonRating = Number((totalStars / mcqQuestions.length).toFixed(1));

    try {
      const res = await fetch(`${API}/review`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          salon_id: salonId,
          barber_id: barberId || null,
          booking_id: bookingId,
          salon_rating: calculatedSalonRating,
          barber_rating: barberRating || 5,
          cleanliness: mcqSelections.cleanliness.label,
          ambience: mcqSelections.ambience.label,
          staff: mcqSelections.staff.label,
          service: mcqSelections.service.label,
          wait_time: mcqSelections.wait_time.label,
          review_text: reviewText.trim()
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSubmitted(true);
        window.scrollTo(0, 0);
        setTimeout(() => {
          navigate("/reviews");
        }, 2500);
      } else {
        setError(data.message || "Failed to submit review");
      }
    } catch {
      setError("Server error. Is the backend running?");
    } finally {
      setLoading(false);
    }
  };

  /* ── Validation before submit wrapper ── */
  const handleValidationAndSubmit = () => {
    setAttemptedSubmit(true);
    setError("");

    const missing = [];
    for (const q of mcqQuestions) {
      if (!mcqSelections[q.key]) {
        missing.push(q);
      }
    }

    const isStylistMissing = barbersList.length > 0 && !barberRating;

    if (missing.length > 0 || isStylistMissing) {
      const missingTitles = missing.map(q => q.title);
      if (isStylistMissing) {
        missingTitles.push("Stylist Rating");
      }
      
      setError(`Please complete: ${missingTitles.join(", ")}`);
      
      // Scroll to first missing section
      const firstMissingKey = missing.length > 0 ? missing[0].key : "stylist-rating";
      const element = document.getElementById(`category-${firstMissingKey}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    handleSubmit();
  };

  /* ── SUCCESS SCREEN ── */
  if (submitted) {
    return (
      <div className="min-h-screen w-full flex flex-col justify-between font-sans bg-[#FAF6F0] text-[#3E362E]">
        <Navbar />
        <div className="flex-grow flex items-center justify-center p-6 pt-32">
          <div className="bg-white rounded-[32px] border border-[#EADDCA] p-12 text-center max-w-md w-full shadow-2xl relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#C5A059]/5 rounded-full blur-2xl" />
            <div className="w-20 h-20 rounded-full bg-emerald-50 border border-emerald-100 mx-auto mb-6 flex items-center justify-center shadow-inner">
              <CheckCircle className="w-10 h-10 text-emerald-600" />
            </div>

            <h2 className="mb-1 leading-none">
              <span className="font-sans font-black uppercase text-3xl tracking-tight text-[#3E362E]">Thank </span>
              <span className="font-serif italic text-3xl text-[#C5A059] normal-case">You!</span>
            </h2>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#C5A059] mb-4">Review Submitted Successfully</p>
            <p className="text-stone-500 text-xs font-light leading-relaxed mb-8">
              Your detailed feedback has been logged. We are redirecting you to our reviews portal...
            </p>
            <button onClick={() => navigate("/reviews")}
              className="w-full bg-[#3E362E] hover:bg-[#C5A059] text-white hover:text-[#2A241F] py-4 rounded-xl font-sans font-extrabold text-[11px] tracking-widest uppercase transition-all duration-300 shadow-md">
              View All Reviews
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  /* ── SALON SELECTION SCREEN (WHEN SALON ID NOT SET) ── */
  if (!salonId) {
    return (
      <div className="min-h-screen w-full bg-[#FAF6F0] font-sans text-[#3E362E] antialiased flex flex-col justify-between relative overflow-x-hidden">
        <div>
          <Navbar />
          <div className="w-full max-w-2xl mx-auto px-4 pt-32 pb-16">
            <div className="bg-white rounded-[32px] border border-[#EADDCA] p-8 sm:p-12 shadow-2xl relative overflow-hidden text-left space-y-6">
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#C5A059]/5 rounded-full blur-2xl pointer-events-none" />
              
              <div className="text-center space-y-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-[#C5A059] bg-[#C5A059]/10 px-4 py-1.5 rounded-full border border-[#C5A059]/20">
                  Salon Selector
                </span>
                <h2 className="leading-tight pt-2">
                  <span className="font-sans font-black uppercase text-3xl tracking-tight text-[#3E362E]">Select your </span>
                  <span className="font-serif italic text-3xl text-[#C5A059] normal-case">Studio</span>
                </h2>
                <p className="text-[11px] text-stone-500 font-light max-w-sm mx-auto">
                  Search and select the salon you visited to write a personalized review
                </p>
              </div>

              {error && (
                <div className="p-4 bg-red-50 border border-red-150 rounded-2xl flex items-center gap-3 animate-fade-in">
                  <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                  <p className="text-xs text-red-700 font-medium leading-relaxed">{error}</p>
                </div>
              )}

              <div className="relative">
                <Search className="absolute left-4 top-3.5 w-4.5 h-4.5 text-stone-400" />
                <input
                  type="text"
                  placeholder="Search salons by name or location..."
                  value={salonSearch}
                  onChange={(e) => setSalonSearch(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-[#FAF6F0]/80 border border-[#EADDCA] rounded-2xl font-sans text-xs outline-none focus:border-[#C5A059] transition-all focus:ring-1 focus:ring-[#C5A059] shadow-inner text-[#3E362E]"
                />
              </div>

              <div className="max-h-80 overflow-y-auto space-y-2.5 pr-2 custom-scrollbar">
                {salonsList.filter(s => s.salon_name?.toLowerCase().includes(salonSearch.toLowerCase())).length === 0 ? (
                  <p className="text-center text-xs text-stone-400 py-8 italic">No salons found matching your search</p>
                ) : (
                  salonsList
                    .filter(s => s.salon_name?.toLowerCase().includes(salonSearch.toLowerCase()))
                    .map((s) => (
                      <button
                        key={s._id}
                        type="button"
                        onClick={() => {
                          setSalonId(s._id);
                          setSelectedSalonName(s.salon_name);
                          setError("");
                        }}
                        className="w-full text-left p-5 rounded-2xl border border-[#EADDCA]/50 hover:border-[#C5A059] hover:bg-[#FAF6F0]/40 transition-all flex items-center justify-between cursor-pointer group shadow-sm bg-white"
                      >
                        <div className="min-w-0 pr-4">
                          <h4 className="text-xs font-black uppercase text-[#3E362E] tracking-wider group-hover:text-[#C5A059] transition-colors">{s.salon_name}</h4>
                          <p className="text-[10px] text-stone-500 font-light mt-1 truncate">{s.address}</p>
                        </div>
                        <div className="w-8 h-8 rounded-full bg-[#FAF6E9] border border-[#EADDCA]/40 flex items-center justify-center text-[#C5A059] group-hover:bg-[#C5A059] group-hover:text-white transition-all shadow-sm">
                          <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                        </div>
                      </button>
                    ))
                )}
              </div>
            </div>
          </div>
        </div>
        <Footer />
        <style dangerouslySetInnerHTML={{
          __html: `
          .custom-scrollbar::-webkit-scrollbar {
            width: 5px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: #FAF6F0;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: #EADDCA;
            border-radius: 10px;
          }
        `}} />
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-[#FAF6F0] font-sans text-[#3E362E] antialiased flex flex-col justify-between relative overflow-x-hidden">
      <div>
        <Navbar />

        {/* TOP BAR BACK TRIGGER */}
        <div className="w-full max-w-7xl mx-auto px-4 pt-28 flex justify-between items-center relative z-20">
          <button
            onClick={() => {
              if (location.state?.salonId || searchParams.get("salonId")) {
                navigate(-1);
              } else {
                setSalonId("");
                setSelectedSalonName("");
              }
            }}
            className="flex items-center gap-2 bg-white/90 backdrop-blur-md px-4 py-2.5 rounded-full border border-[#EADDCA] shadow-md hover:bg-white transition-all duration-300 group cursor-pointer"
          >
            <ArrowLeft size={14} className="transition-transform group-hover:-translate-x-1 text-[#C5A059]" />
            <span className="font-sans font-black text-[10px] tracking-widest uppercase text-[#3E362E]">Back</span>
          </button>
          
          <div className="flex items-center gap-4">
            <span className="text-[10px] font-black uppercase tracking-widest bg-[#C5A059]/10 text-[#C5A059] px-4 py-1.5 rounded-full border border-[#C5A059]/20">
              Interactive Feedback Panel
            </span>
          </div>
        </div>

        {/* SPLIT SCREEN LAYOUT */}
        <div className="w-full max-w-7xl mx-auto px-4 my-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* LEFT COLUMN: 5 MCQ QUESTIONS & STYLIST EVALUATION */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Salon Title Header */}
              <div className="bg-white border border-[#EADDCA] rounded-3xl p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-sm">
                <div>
                  <span className="text-[9px] font-black uppercase tracking-widest text-[#C5A059] block mb-0.5">Reviewing Establishment</span>
                  <h2 className="text-xl font-black uppercase text-[#3E362E] tracking-tight">{selectedSalonName}</h2>
                </div>
                <button 
                  type="button" 
                  onClick={() => {
                    setSalonId("");
                    setSelectedSalonName("");
                    setBarberId("");
                    setSelectedBarberName("");
                    setMcqSelections({
                      cleanliness: null,
                      ambience: null,
                      staff: null,
                      service: null,
                      wait_time: null
                    });
                    setBarberRating(0);
                  }}
                  className="text-[9px] font-black uppercase tracking-widest text-[#C5A059] hover:text-[#3E362E] bg-[#C5A059]/10 hover:bg-[#C5A059]/20 px-3 py-1.5 rounded-lg border border-[#C5A059]/20 transition-all cursor-pointer"
                >
                  Change Salon
                </button>
              </div>

              {/* 5 MCQ Questionnaire Cards */}
              {mcqQuestions.map((q) => {
                const currentSelection = mcqSelections[q.key];
                const isMissing = attemptedSubmit && !currentSelection;
                return (
                  <div 
                    key={q.key} 
                    id={`category-${q.key}`}
                    className={`bg-white border rounded-3xl p-6 space-y-4 shadow-sm hover:shadow-md transition-all duration-300 text-left ${
                      isMissing ? 'border-red-300 ring-2 ring-red-100 bg-red-50/10' : 'border-[#EADDCA]'
                    }`}
                  >
                    <div>
                      <span className="text-[9px] font-black uppercase tracking-widest text-[#C5A059] block mb-1">
                        Quality Metric
                      </span>
                      <h3 className="text-sm font-black uppercase text-[#3E362E] tracking-wide flex items-center gap-2">
                        {q.title}
                      </h3>
                      <p className="text-[11px] text-stone-500 font-light mt-1">{q.subtitle}</p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-2.5">
                      {q.options.map((opt, idx) => {
                        const isSelected = currentSelection?.label === opt.label;
                        return (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => {
                              setMcqSelections(prev => ({
                                ...prev,
                                [q.key]: opt
                              }));
                              setError("");
                            }}
                            className={`text-left p-3.5 rounded-2xl border transition-all flex flex-col justify-between gap-2.5 cursor-pointer min-h-[100px] ${
                              isSelected 
                                ? 'border-[#C5A059] bg-[#C5A059]/5 shadow-sm ring-1 ring-[#C5A059]' 
                                : 'border-[#EADDCA]/40 hover:border-[#C5A059]/50 hover:bg-[#FAF6F0]/40'
                            }`}
                          >
                            <div className="flex justify-between items-start w-full">
                              <span className={`text-[9px] font-black uppercase tracking-wider leading-tight ${isSelected ? 'text-[#C5A059]' : 'text-[#3E362E]'}`}>
                                {opt.label}
                              </span>
                              {isSelected && (
                                <div className="w-3.5 h-3.5 rounded-full bg-[#C5A059] flex items-center justify-center text-white flex-shrink-0">
                                  <Check className="w-2.5 h-2.5 stroke-[3px]" />
                                </div>
                              )}
                            </div>
                            <div className="flex gap-0.5 mt-auto">
                              {[...Array(opt.stars)].map((_, i) => (
                                <Star key={i} className="w-2.5 h-2.5 fill-current text-[#C5A059]" />
                              ))}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}

              {/* Stylist / Barber Star Rating ("last me rating rahegi") */}
              {(() => {
                const isStylistMissing = attemptedSubmit && barbersList.length > 0 && !barberRating;
                return (
                  <div 
                    id="category-stylist-rating"
                    className={`bg-white border rounded-3xl p-6 space-y-6 shadow-sm text-left ${
                      isStylistMissing ? 'border-red-300 ring-2 ring-red-100 bg-red-50/10' : 'border-[#EADDCA]'
                    }`}
                  >
                <div>
                  <span className="text-[9px] font-black uppercase tracking-widest text-[#C5A059] block mb-1">
                    Bespoke Artistry
                  </span>
                  <h3 className="text-sm font-black uppercase text-[#3E362E] tracking-wide">
                    Stylist Evaluation
                  </h3>
                  <p className="text-[11px] text-stone-500 font-light mt-1">
                    Rate the stylist who crafted your haircut and style
                  </p>
                </div>

                {/* Stylist Selector if not pre-assigned */}
                {!stateData.barberId && barbersList.length > 0 && (
                  <div className="space-y-2.5">
                    <label className="text-[9px] font-black uppercase tracking-widest text-stone-400 block">
                      Select Stylist
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {barbersList.map((b) => {
                        const isSelected = barberId === b._id;
                        return (
                          <button
                            key={b._id}
                            type="button"
                            onClick={() => {
                              setBarberId(b._id);
                              setSelectedBarberName(b.name);
                              setError("");
                            }}
                            className={`p-3 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1.5 ${
                              isSelected
                                ? 'border-[#C5A059] bg-[#C5A059]/5 shadow-sm ring-1 ring-[#C5A059]'
                                : 'border-[#EADDCA]/40 hover:border-[#C5A059]/50 hover:bg-[#FAF6F0]/40'
                            }`}
                          >
                            <div className="w-8 h-8 rounded-full bg-[#FAF6E9] border border-[#EADDCA]/50 flex items-center justify-center text-[#C5A059] font-black text-xs uppercase shadow-inner">
                              {b.name.charAt(0)}
                            </div>
                            <span className="text-[10px] font-bold uppercase text-[#3E362E] truncate w-full">
                              {b.name}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {selectedBarberName && (
                  <div className="bg-[#FAF6E9]/50 border border-[#EADDCA]/60 p-4 rounded-2xl flex items-center gap-3.5 max-w-sm">
                    <div className="w-10 h-10 rounded-full bg-[#C5A059]/10 border border-[#C5A059]/20 flex items-center justify-center text-[#C5A059] font-black text-sm uppercase">
                      {selectedBarberName.charAt(0)}
                    </div>
                    <div>
                      <span className="text-[8px] font-mono text-stone-400 block uppercase">Assigned Expert</span>
                      <h4 className="text-xs font-black uppercase text-[#3E362E]">{selectedBarberName}</h4>
                    </div>
                  </div>
                )}

                {/* Stylist Rating Star Selector */}
                <div className="space-y-3 pt-3 border-t border-[#FAF6F0] text-center">
                  <span className="text-[9px] font-black uppercase tracking-widest text-stone-400 block">
                    Tap Stars to Rate Stylist
                  </span>
                  <div className="flex justify-center gap-4">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onMouseEnter={() => setBarberHover(star)}
                        onMouseLeave={() => setBarberHover(0)}
                        onClick={() => {
                          setBarberRating(star);
                          setError("");
                        }}
                        className="transition-transform duration-200 hover:scale-125 focus:outline-none cursor-pointer"
                      >
                        <Star
                          className={`w-9 h-9 transition-colors ${
                            star <= (barberHover || barberRating)
                              ? "fill-[#C5A059] text-[#C5A059] filter drop-shadow-[0_0_4px_rgba(197,160,89,0.3)]"
                              : "text-stone-200"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                  {barberRating > 0 && (
                    <p className="font-sans text-[9px] font-black uppercase tracking-widest text-[#C5A059] mt-2">
                      Stylist score: {barberRating} / 5 Stars
                    </p>
                  )}
                </div>
              </div>
            );
          })()}
        </div>

            {/* RIGHT COLUMN: STICKY LIVE PREVIEW & COMMENTS ("write side pe write review") */}
            <div className="lg:col-span-5 lg:sticky lg:top-28 space-y-6 text-left">
              <div className="bg-white border border-[#EADDCA] rounded-3xl p-6 shadow-sm space-y-6 relative overflow-hidden">
                <div className="absolute -top-12 -right-12 w-32 h-32 bg-[#C5A059]/5 rounded-full blur-2xl pointer-events-none" />
                
                <div>
                  <span className="text-[9px] font-black uppercase tracking-widest text-[#C5A059] block mb-0.5">Real-Time Summary</span>
                  <h3 className="font-sans font-black uppercase text-base text-[#3E362E] tracking-tight">Review Compilation</h3>
                </div>

                {/* The Live Review Card Preview */}
                <div className="border border-[#EADDCA]/60 rounded-2xl p-5 bg-[#FAF6E9]/20 space-y-4 shadow-inner">
                  {/* Salon Info & Dynamic Average Rating */}
                  <div className="flex justify-between items-start gap-4 pb-3 border-b border-[#EADDCA]/30">
                    <div className="min-w-0">
                      <span className="text-[8px] text-stone-400 uppercase font-bold block mb-0.5">Salon Name</span>
                      <h4 className="text-xs font-black uppercase text-[#3E362E] truncate">
                        {selectedSalonName || "No Salon Selected"}
                      </h4>
                    </div>
                    
                    {/* Dynamic Rating badge */}
                    <div className="bg-gradient-to-br from-[#3E362E] to-[#2A241F] text-white px-3 py-1.5 rounded-xl flex items-center gap-1.5 shadow flex-shrink-0">
                      <Star className="w-3.5 h-3.5 fill-[#C5A059] text-[#C5A059]" />
                      <span className="text-xs font-black tracking-wider">
                        {(() => {
                          const totalSelected = Object.values(mcqSelections).filter(Boolean).length;
                          if (totalSelected === 0) return "0.0";
                          const totalStars = Object.values(mcqSelections).reduce((sum, val) => sum + (val?.stars || 0), 0);
                          return (totalStars / totalSelected).toFixed(1);
                        })()}
                      </span>
                    </div>
                  </div>

                  {/* MCQ categories listing */}
                  <div className="space-y-2 text-[10px]">
                    {mcqQuestions.map((q) => {
                      const sel = mcqSelections[q.key];
                      return (
                        <div key={q.key} className="flex justify-between items-center py-0.5">
                          <span className="text-stone-500 font-medium">{q.title.split(' ')[0]}:</span>
                          <div className="flex items-center gap-1.5">
                            {sel ? (
                              <>
                                <span className="font-black text-[#3E362E] uppercase text-[9px] tracking-wide">{sel.label}</span>
                                <span className="text-[#C5A059] font-bold">({sel.stars}★)</span>
                              </>
                            ) : (
                              <span className="text-stone-400 italic text-[9px]">Not graded yet</span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Stylist summary */}
                  <div className="pt-3 border-t border-[#EADDCA]/30 flex justify-between items-center">
                    <div className="min-w-0 pr-2">
                      <span className="text-[8px] text-stone-400 uppercase font-bold block">Stylist Expert</span>
                      <span className="text-[10px] font-black uppercase text-[#3E362E] truncate block">
                        {selectedBarberName || "No stylist selected"}
                      </span>
                    </div>
                    <div className="flex gap-0.5 flex-shrink-0">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-3.5 h-3.5 ${i < barberRating ? 'fill-[#C5A059] text-[#C5A059]' : 'text-stone-200'}`} />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Written Comments area */}
                <div className="space-y-2 pt-2">
                  <label className="text-[9px] font-black uppercase tracking-widest text-[#C5A059] block">
                    Write Written Review
                  </label>
                  <textarea
                    value={reviewText}
                    onChange={(e) => {
                      setReviewText(e.target.value);
                      setError("");
                    }}
                    placeholder="Share details of your experience, custom hair cuts, styling service quality..."
                    maxLength={500}
                    className="w-full bg-white border border-[#EADDCA] rounded-2xl p-4 font-sans text-xs font-normal leading-relaxed text-stone-600 focus:border-[#C5A059] outline-none focus:ring-1 focus:ring-[#C5A059] transition-all h-28 resize-none shadow-sm"
                  />
                  <div className="flex justify-between items-center">
                    <p className="text-red-500 text-[9px] font-bold">{error}</p>
                    <p className="text-[8px] font-bold text-stone-400">
                      {reviewText.length}/500 Characters
                    </p>
                  </div>
                </div>

                {/* Submit Button */}
                {(() => {
                  const totalSelected = Object.values(mcqSelections).filter(Boolean).length;
                  const isFormComplete = totalSelected === 5 && (barbersList.length === 0 || barberRating > 0);
                  return (
                    <button
                      type="button"
                      onClick={handleValidationAndSubmit}
                      disabled={loading}
                      className={`w-full font-sans font-extrabold text-[10px] tracking-widest uppercase py-4 px-6 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md ${
                        isFormComplete
                          ? 'bg-[#C5A059] hover:bg-[#3E362E] hover:text-white text-[#2A241F]'
                          : 'bg-stone-150 text-stone-500 hover:bg-stone-200 border border-stone-200/50'
                      }`}
                    >
                      {loading ? (
                        <span>Submitting Review...</span>
                      ) : (
                        <>
                          <span>Submit Review</span>
                          <CheckCircle size={14} />
                        </>
                      )}
                    </button>
                  );
                })()}
              </div>
            </div>

          </div>
        </div>
      </div>
      
      <Footer />

      {/* CSS Scrollbar Styling */}
      <style dangerouslySetInnerHTML={{
        __html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #FAF6F0;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #EADDCA;
          border-radius: 10px;
        }
      `}} />
    </div>
  );
};

export default ReviewSystem;