import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Star, Search, Filter, X, Heart } from "lucide-react";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export default function AllReviews() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [ratingFilter, setRatingFilter] = useState(0);
  const [selectedReview, setSelectedReview] = useState(null);
  const [stats, setStats] = useState({ total: 0, avgSalon: 0, avgBarber: 0 });

  const [activeTab, setActiveTab] = useState("service"); // "service" or "booking"
  const [serviceReviews, setServiceReviews] = useState([]);
  const [bookingReviews, setBookingReviews] = useState([]);

  useEffect(() => {
    window.scrollTo(0, 0);
    setLoading(true);
    Promise.all([
      fetch(`${API}/review`).then(r => r.json()).catch(() => ({ success: false, reviews: [] })),
      fetch(`${API}/booking-feedback/public`).then(r => r.json()).catch(() => ({ success: false, feedback: [] }))
    ]).then(([reviewsData, bookingData]) => {
      let svc = [];
      let bk = [];
      if (reviewsData.success) {
        svc = reviewsData.reviews || [];
        setServiceReviews(svc);
      }
      if (bookingData.success) {
        bk = bookingData.feedback || [];
        setBookingReviews(bk);
      }

      if (svc.length) {
        const salonAvg  = svc.reduce((s, r) => s + (r.salon_rating || 0), 0) / svc.length;
        const barberAvg = svc.reduce((s, r) => s + (r.barber_rating || 0), 0) / svc.length;
        setStats({ total: svc.length + bk.length, avgSalon: salonAvg.toFixed(1), avgBarber: barberAvg.toFixed(1) });
      } else {
        setStats({ total: bk.length, avgSalon: "0.0", avgBarber: "0.0" });
      }
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  /* ── Filter Logic ── */
  const filtered = activeTab === "service"
    ? serviceReviews.filter(r => {
        const matchSearch = !search ||
          r.customer_id?.name?.toLowerCase().includes(search.toLowerCase()) ||
          r.review_text?.toLowerCase().includes(search.toLowerCase());
        const maxRating = Math.max(r.salon_rating || 0, r.barber_rating || 0);
        const matchRating = !ratingFilter || Math.round(maxRating) === ratingFilter;
        return matchSearch && matchRating;
      })
    : bookingReviews.filter(r => {
        const matchSearch = !search ||
          r.customer_id?.name?.toLowerCase().includes(search.toLowerCase()) ||
          r.feedback_text?.toLowerCase().includes(search.toLowerCase());
        const avgRating = ((r.booking_process_rating || 0) + (r.payment_process_rating || 0) + (r.website_usability_rating || 0)) / 3;
        const matchRating = !ratingFilter || Math.round(avgRating) === ratingFilter;
        return matchSearch && matchRating;
      });

  const currentReviewsList = activeTab === "service" ? serviceReviews : bookingReviews;

  return (
    <>
      <Navbar />
      <div className="bg-[#FAF6F0] min-h-screen font-sans text-[#3E362E] selection:bg-[#C5A059] selection:text-white relative overflow-hidden flex flex-col">
        
        {/* --- SHINY LUXURY GRADIENT GLOW LAYERS --- */}
        <div className="absolute top-20 -left-40 w-[600px] h-[600px] bg-gradient-to-br from-[#C5A059]/10 via-[#EADDCA]/20 to-transparent rounded-full blur-[120px] pointer-events-none animate-pulse duration-[8000ms]" />
        <div className="absolute bottom-1/3 right-10 w-[700px] h-[500px] bg-[#EADDCA]/30 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-[500px] h-[500px] bg-[#C5A059]/10 rounded-full blur-[100px] pointer-events-none" />

        {/* Premium Hero Banner */}
        <div className="relative pt-32 pb-12 flex flex-col items-center justify-center overflow-hidden mb-6">
          <div className="absolute inset-0 bg-gradient-to-b from-[#EADDCA]/20 via-transparent to-[#FAF6F0]" />
          
          {/* HEADER BUTTONS BAR */}
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center relative z-20 mb-8">
            {/* RETURN BUTTON */}
            <button
              onClick={() => navigate(-1)}
              className="group flex items-center gap-2 bg-white/80 backdrop-blur-md border border-[#EADDCA] px-4 py-2 rounded-xl text-[#3E362E] font-sans font-extrabold text-xs tracking-wider uppercase transition-all duration-300 shadow-md hover:bg-[#3E362E] hover:text-white hover:border-[#3E362E] cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-[#C5A059] group-hover:text-white transition-transform duration-300 transform group-hover:-translate-x-0.5" />
              <span>Back</span>
            </button>

            {/* WRITE REVIEW BUTTON (Top Right) */}
            <button
              onClick={() => navigate(activeTab === "service" ? "/write-review" : "/write-booking-review")}
              className="group flex items-center gap-2 bg-[#3E362E] text-white border border-[#C5A059]/30 px-5 py-2 rounded-xl font-sans font-extrabold text-xs tracking-wider uppercase transition-all duration-300 shadow-md hover:bg-[#C5A059] hover:text-[#2A241F] cursor-pointer"
            >
              <Heart className="w-3.5 h-3.5 fill-current text-[#C5A059] group-hover:text-[#2A241F]" />
              <span>Write Review</span>
            </button>
          </div>

          <div className="relative z-10 text-center px-4 max-w-3xl mx-auto">
            {/* Kicker Tag — Rule 2 */}
            <span className="font-sans text-[11px] font-extrabold uppercase tracking-widest text-[#C5A059] bg-white/80 backdrop-blur-md border border-[#EADDCA] px-4 py-1.5 rounded-full shadow-sm inline-block mb-4">
              Guest Testimonials
            </span>

            {/* Primary Hero Heading — Rule 1 */}
            <h1 className="leading-none">
              <span className="font-sans font-black uppercase text-4xl sm:text-5xl md:text-6xl tracking-tight text-stone-900">
                All Our{" "}
              </span>
              <span className="font-serif italic text-3xl sm:text-4xl md:text-5xl text-[#C5A059] normal-case">
                Reviews
              </span>
            </h1>

            <div className="w-16 h-[2px] bg-[#C5A059] mx-auto mt-5 mb-4" />

            {/* Body Text — Rule 3 */}
            <p className="font-sans text-sm font-normal leading-relaxed text-stone-600 max-w-xl mx-auto">
              Discover real stories and experiences shared by our esteemed guests. Authentic guest feedback beautifully driving our perfection.
            </p>
          </div>
        </div>

        {/* Main Content Layout */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 sm:pb-24 relative z-10 flex-grow w-full">
          
          {/* ═══ STATS STRIP ═══ */}
          <div className="grid grid-cols-3 gap-4 sm:gap-6 mb-10">
            <div className="bg-white/90 backdrop-blur-md rounded-[24px] p-5 md:p-6 text-center border border-white/60 shadow-[0_10px_30px_rgba(0,0,0,0.01)]">
              {/* Kicker — Rule 2 */}
              <p className="font-sans text-[11px] font-extrabold uppercase tracking-widest text-[#C5A059] mb-1.5">Total Reviews</p>
              {/* Big number uses serif accent style */}
              <p className="font-serif italic text-3xl sm:text-4xl md:text-5xl text-[#C5A059] normal-case">{stats.total}</p>
            </div>
            <div className="bg-white/90 backdrop-blur-md rounded-[24px] p-5 md:p-6 text-center border border-white/60 shadow-[0_10px_30px_rgba(0,0,0,0.01)]">
              <p className="font-sans text-[11px] font-extrabold uppercase tracking-widest text-[#C5A059] mb-1.5">Avg Salon</p>
              <div className="flex items-center justify-center gap-1">
                <Star className="w-4 h-4 sm:w-5 fill-[#C5A059] text-[#C5A059]"/>
                <p className="font-serif italic text-3xl sm:text-4xl md:text-5xl text-[#C5A059] normal-case">{stats.avgSalon || "—"}</p>
              </div>
            </div>
            <div className="bg-white/90 backdrop-blur-md rounded-[24px] p-5 md:p-6 text-center border border-white/60 shadow-[0_10px_30px_rgba(0,0,0,0.01)]">
              <p className="font-sans text-[11px] font-extrabold uppercase tracking-widest text-[#C5A059] mb-1.5">Avg Stylist</p>
              <div className="flex items-center justify-center gap-1">
                <Star className="w-4 h-4 sm:w-5 fill-[#C5A059] text-[#C5A059]"/>
                <p className="font-serif italic text-3xl sm:text-4xl md:text-5xl text-[#C5A059] normal-case">{stats.avgBarber || "—"}</p>
              </div>
            </div>
          </div>

          {/* ═══ TAB OPTIONS: SERVICE REVIEW & BOOKING EXPERIENCE ═══ */}
          <div className="flex justify-center mb-8">
            <div className="bg-white/80 backdrop-blur-md p-1.5 rounded-2xl border border-[#EADDCA] shadow-sm flex gap-2">
              <button
                type="button"
                onClick={() => { setActiveTab("service"); setRatingFilter(0); }}
                className={`px-6 py-3 rounded-xl font-sans text-xs font-black uppercase tracking-widest transition-all duration-300 cursor-pointer ${
                  activeTab === "service"
                    ? "bg-[#3E362E] text-white shadow-md"
                    : "text-[#3E362E] hover:bg-[#FAF6F0]"
                }`}
              >
                Service Reviews
              </button>
              <button
                type="button"
                onClick={() => { setActiveTab("booking"); setRatingFilter(0); }}
                className={`px-6 py-3 rounded-xl font-sans text-xs font-black uppercase tracking-widest transition-all duration-300 cursor-pointer ${
                  activeTab === "booking"
                    ? "bg-[#3E362E] text-white shadow-md"
                    : "text-[#3E362E] hover:bg-[#FAF6F0]"
                }`}
              >
                Booking Experience
              </button>
            </div>
          </div>

          {/* ═══ FILTERS ═══ */}
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-4 sm:p-5 mb-8 border border-white/60 shadow-sm flex flex-col lg:flex-row gap-4 lg:items-center">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="w-4 h-4 text-[#C5A059] absolute left-4 top-1/2 -translate-y-1/2"/>
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search by name, experiences or feedback..."
                className="w-full pl-11 pr-4 py-3.5 bg-[#FAF6F0]/60 border border-[#EADDCA] rounded-xl font-sans text-sm font-normal text-stone-600 outline-none focus:border-[#C5A059] focus:bg-white transition-all duration-300 placeholder:text-stone-400"
              />
            </div>

            {/* Rating filter */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <div className="flex items-center gap-2 mr-2">
                <Filter className="w-3.5 h-3.5 text-[#C5A059]"/>
                {/* Kicker label — Rule 2 */}
                <span className="font-sans text-[11px] font-extrabold tracking-widest uppercase text-[#3E362E]">Filter:</span>
              </div>
              {[0, 5, 4, 3, 2, 1].map(r => (
                <button key={r}
                  onClick={() => setRatingFilter(r)}
                  className={`px-4 py-2 rounded-xl font-sans text-xs font-extrabold uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                    ratingFilter === r
                      ? "bg-[#3E362E] text-white shadow-md"
                      : "bg-[#FAF6F0] text-[#3E362E] border border-[#EADDCA] hover:bg-[#C5A059]/10"
                  }`}>
                  {r === 0 ? "All" : `${r} ★`}
                </button>
              ))}
            </div>
          </div>

          {/* ═══ REVIEWS GRID / CONTENT ═══ */}
          {loading ? (
            /* Loading state — Rule 3 body text, italic serif accent */
            <div className="text-center py-24">
              <span className="font-serif italic text-lg tracking-wide text-stone-400">Loading premium reviews...</span>
            </div>
          ) : filtered.length === 0 ? (
            <div className="bg-white/40 backdrop-blur-md rounded-[32px] p-12 text-center border border-dashed border-[#EADDCA]">
              <Star className="w-8 h-8 text-[#C5A059] mx-auto mb-4 opacity-40"/>
              {/* Subheading — Rule 1 line 1 style at smaller scale */}
              <h4 className="font-sans font-black uppercase tracking-tight text-xl text-stone-900 mb-1">No Reviews Match</h4>
              <p className="font-serif italic text-base text-[#C5A059] normal-case mb-4">your current criteria</p>
              {/* Body — Rule 3 */}
              <p className="font-sans text-sm font-normal leading-relaxed text-stone-600 max-w-sm mx-auto mb-6">
                {currentReviewsList.length === 0 
                  ? "Be the first to share your ultimate experience with us!" 
                  : "Try modifying your search tags or rating options."}
              </p>
              {/* Button — Rule 4 */}
              <button onClick={() => navigate(activeTab === "service" ? "/write-review" : "/write-booking-review")}
                className="bg-[#3E362E] text-white py-3.5 px-8 rounded-xl font-sans font-extrabold text-xs tracking-wider uppercase transition-all duration-300 hover:bg-[#C5A059] hover:text-[#2A241F] shadow-sm cursor-pointer">
                {currentReviewsList.length === 0 ? "Write the First Review" : "Write a Review"}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map(r => {
                const isService = activeTab === "service";
                const rating = isService
                  ? Math.max(r.salon_rating || 0, r.barber_rating || 0)
                  : Math.round(((r.booking_process_rating || 0) + (r.payment_process_rating || 0) + (r.website_usability_rating || 0)) / 3);
                
                const rawText = isService ? r.review_text || "" : r.feedback_text || "";
                let cleanText = rawText;
                let mcqDetails = null;

                if (isService) {
                  if (rawText.startsWith("[")) {
                    const closeIndex = rawText.indexOf("]");
                    if (closeIndex !== -1) {
                      const bracketed = rawText.substring(1, closeIndex);
                      cleanText = rawText.substring(closeIndex + 1).trim();
                      if (!cleanText) {
                        cleanText = "Bespoke styling and premium grooming experience.";
                      }
                      
                      mcqDetails = {};
                      const parts = bracketed.split("|");
                      parts.forEach(p => {
                        const colonIndex = p.indexOf(":");
                        if (colonIndex !== -1) {
                          const key = p.substring(0, colonIndex).trim();
                          const val = p.substring(colonIndex + 1).trim();
                          mcqDetails[key] = val;
                        }
                      });
                    }
                  }
                } else {
                  mcqDetails = {
                    "Booking Process": `${r.booking_process_rating || 5} ★`,
                    "Payment Flow": `${r.payment_process_rating || 5} ★`,
                    "Website Usability": `${r.website_usability_rating || 5} ★`
                  };
                }

                return (
                  <div key={r._id}
                    onClick={() => setSelectedReview(r)}
                    className="group bg-white/90 backdrop-blur-md rounded-[28px] p-6 border border-[#EADDCA] shadow-[0_10px_30px_rgba(0,0,0,0.01)] hover:shadow-[0_22px_45px_rgba(62,54,46,0.06)] hover:border-[#C5A059]/40 transition-all duration-500 flex flex-col justify-between cursor-pointer transform hover:-translate-y-1 relative"
                  >
                    <div>
                      {/* Stars & Date Header */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex gap-0.5">
                          {[...Array(5)].map((_, k) => (
                            <Star key={k} className={`w-3.5 h-3.5 ${k < Math.round(rating) ? "fill-[#C5A059] text-[#C5A059]" : "text-stone-200"}`}/>
                          ))}
                        </div>
                        {/* Date — Rule 2 kicker style */}
                        <span className="font-sans text-[11px] font-extrabold tracking-widest uppercase text-stone-400">
                          {new Date(r.created_at).toLocaleDateString("en-IN", { day:"numeric", month:"short" })}
                        </span>
                      </div>

                      {/* Opening quote mark */}
                      <div className="text-[#C5A059] font-serif text-4xl leading-none -mb-1 opacity-60">"</div>

                      {/* Review text — serif italic luxury accent (Rule 1 Line 2 style) */}
                      <p className="font-serif italic text-[#3E362E] text-base leading-relaxed line-clamp-4 mb-4">
                        {cleanText || "(No written feedback provided by customer)"}
                      </p>
                      
                      {mcqDetails && (
                        <div className="flex flex-wrap gap-1 mb-5">
                          {Object.entries(mcqDetails).map(([key, val]) => (
                            <span key={key} className="text-[7.5px] font-sans font-black uppercase tracking-widest bg-[#C5A059]/10 text-[#C5A059] px-2 py-0.5 rounded-full border border-[#C5A059]/20 whitespace-nowrap">
                              {key}: {val}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Profile Wrapper */}
                    <div className="flex items-center gap-3 pt-4 border-t border-[#FAF6F0]">
                      <div className="w-10 h-10 rounded-xl bg-[#3E362E] flex items-center justify-center text-[#C5A059] font-sans font-black text-sm border border-[#C5A059]/20 shadow-inner">
                        {(r.customer_id?.name?.[0] || "?").toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        {/* Customer name — serif bold */}
                        <p className="font-serif font-bold text-sm text-[#3E362E] truncate">{r.customer_id?.name || "Anonymous"}</p>
                        {isService && r.barber_id?.name && (
                          /* Stylist tag — Rule 2 kicker */
                          <p className="font-sans text-[11px] font-extrabold tracking-widest uppercase text-stone-400 truncate mt-0.5">
                            Stylist: <span className="text-[#C5A059]">{r.barber_id.name}</span>
                          </p>
                        )}
                        {!isService && (
                          <p className="font-sans text-[11px] font-extrabold tracking-widest uppercase text-stone-400 truncate mt-0.5">
                            Booking Rating
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* ═══ LUXURY EXPAND MODAL ═══ */}
      {selectedReview && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] overflow-y-auto flex items-start sm:items-center justify-center p-4 transition-all duration-300"
          onClick={() => setSelectedReview(null)}>
          <div className="bg-white rounded-[32px] p-6 sm:p-10 max-w-md w-full shadow-2xl border border-[#EADDCA] relative my-auto animate-in fade-in zoom-in-95 duration-200"
            onClick={e => e.stopPropagation()}>
            
            {/* Close Button */}
            <button onClick={() => setSelectedReview(null)} className="absolute top-6 right-6 text-stone-400 hover:text-[#3E362E] transition-colors cursor-pointer">
              <X className="w-5 h-5"/>
            </button>

            <div className="flex items-center gap-3.5 mb-6">
              <div className="w-12 h-12 rounded-xl bg-[#3E362E] flex items-center justify-center text-[#C5A059] font-sans font-black text-lg border border-[#C5A059]/20">
                {(selectedReview.customer_id?.name?.[0] || "?").toUpperCase()}
              </div>
              <div>
                {/* Customer name in modal — serif bold */}
                <p className="font-serif font-bold text-lg text-[#3E362E]">{selectedReview.customer_id?.name || "Anonymous"}</p>
                {/* Date — Rule 2 kicker */}
                <p className="font-sans text-[11px] font-extrabold tracking-widest uppercase text-stone-400 mt-0.5">
                  {new Date(selectedReview.created_at).toLocaleDateString("en-IN", { day:"numeric", month:"long", year:"numeric" })}
                </p>
              </div>
            </div>

            {/* Dual-Rating Scorecard */}
            {activeTab === "service" ? (
              (selectedReview.salon_rating > 0 || selectedReview.barber_rating > 0) && (
                <div className="grid grid-cols-2 gap-3 mb-6">
                  {selectedReview.salon_rating > 0 && (
                    <div className="bg-[#FAF6F0] rounded-xl p-3 text-center border border-[#EADDCA]/60">
                      {/* Label — Rule 2 */}
                      <p className="font-sans text-[11px] font-extrabold tracking-widest uppercase text-[#C5A059] mb-1">Salon Experience</p>
                      {/* Stars — body weight */}
                      <p className="font-sans text-sm font-normal text-[#3E362E]">
                        {"★".repeat(selectedReview.salon_rating)}<span className="text-stone-200">{"★".repeat(5-selectedReview.salon_rating)}</span>
                      </p>
                    </div>
                  )}
                  {selectedReview.barber_rating > 0 && (
                    <div className="bg-[#FAF6F0] rounded-xl p-3 text-center border border-[#EADDCA]/60">
                      <p className="font-sans text-[11px] font-extrabold tracking-widest uppercase text-[#C5A059] mb-1">Stylist Service</p>
                      <p className="font-sans text-sm font-normal text-[#3E362E]">
                        {"★".repeat(selectedReview.barber_rating)}<span className="text-stone-200">{"★".repeat(5-selectedReview.barber_rating)}</span>
                      </p>
                    </div>
                  )}
                </div>
              )
            ) : (
              <div className="grid grid-cols-3 gap-2 mb-6">
                <div className="bg-[#FAF6F0] rounded-xl p-2.5 text-center border border-[#EADDCA]/60">
                  <p className="font-sans text-[9px] font-extrabold tracking-widest uppercase text-[#C5A059] mb-1">Booking</p>
                  <p className="font-sans text-xs font-bold text-[#3E362E]">{selectedReview.booking_process_rating || 5} ★</p>
                </div>
                <div className="bg-[#FAF6F0] rounded-xl p-2.5 text-center border border-[#EADDCA]/60">
                  <p className="font-sans text-[9px] font-extrabold tracking-widest uppercase text-[#C5A059] mb-1">Payment</p>
                  <p className="font-sans text-xs font-bold text-[#3E362E]">{selectedReview.payment_process_rating || 5} ★</p>
                </div>
                <div className="bg-[#FAF6F0] rounded-xl p-2.5 text-center border border-[#EADDCA]/60">
                  <p className="font-sans text-[9px] font-extrabold tracking-widest uppercase text-[#C5A059] mb-1">Usability</p>
                  <p className="font-sans text-xs font-bold text-[#3E362E]">{selectedReview.website_usability_rating || 5} ★</p>
                </div>
              </div>
            )}

            {(() => {
              const isService = activeTab === "service";
              const rawText = isService ? selectedReview.review_text || "" : selectedReview.feedback_text || "";
              let cleanText = rawText;
              let mcqDetails = null;

              if (isService) {
                if (rawText.startsWith("[")) {
                  const closeIndex = rawText.indexOf("]");
                  if (closeIndex !== -1) {
                    const bracketed = rawText.substring(1, closeIndex);
                    cleanText = rawText.substring(closeIndex + 1).trim();
                    if (!cleanText) {
                      cleanText = "Bespoke styling and premium grooming experience.";
                    }
                    
                    mcqDetails = {};
                    const parts = bracketed.split("|");
                    parts.forEach(p => {
                      const colonIndex = p.indexOf(":");
                      if (colonIndex !== -1) {
                        const key = p.substring(0, colonIndex).trim();
                        const val = p.substring(colonIndex + 1).trim();
                        mcqDetails[key] = val;
                      }
                    });
                  }
                }
              } else {
                mcqDetails = {
                  "Booking Process": `${selectedReview.booking_process_rating || 5} ★`,
                  "Payment Flow": `${selectedReview.payment_process_rating || 5} ★`,
                  "Website Usability": `${selectedReview.website_usability_rating || 5} ★`
                };
              }
              
              return (
                <>
                  {mcqDetails && (
                    <div className="bg-[#FAF6F0] rounded-xl p-4 border border-[#EADDCA]/60 mb-5 space-y-2 text-left shadow-inner">
                      <p className="font-sans text-[10px] font-extrabold tracking-widest uppercase text-[#C5A059] border-b border-[#EADDCA]/30 pb-1.5 mb-2">Category Metrics</p>
                      <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs text-[#3E362E]">
                        {Object.entries(mcqDetails).map(([key, val]) => (
                          <div key={key} className="flex justify-between font-sans">
                            <span className="font-semibold text-stone-500 text-[10px]">{key}:</span>
                            <span className="font-black uppercase text-[10px] text-[#3E362E]">{val}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Opening quote */}
                  <div className="text-[#C5A059] font-serif text-5xl leading-none opacity-60 mb-1">"</div>
                  
                  {/* Review body — Rule 3 but serif italic for luxury feel */}
                  <p className="font-serif italic text-base leading-relaxed text-[#3E362E] mb-6 whitespace-pre-wrap">
                    {cleanText || "No written feedback provided."}
                  </p>
                </>
              );
            })()}

            {activeTab === "service" && selectedReview.barber_id?.name && (
              <div className="bg-[#FAF6F0] border-l-2 border-[#C5A059] px-4 py-2.5 rounded-r-xl mb-6">
                {/* Body text — Rule 3 */}
                <span className="font-sans text-sm font-normal leading-relaxed text-stone-600">
                  Crafted by specialist artist:{" "}
                  <span className="font-sans font-extrabold text-[#3E362E]">{selectedReview.barber_id.name}</span>
                </span>
              </div>
            )}

            {/* CTA Button — Rule 4 */}
            <button onClick={() => setSelectedReview(null)}
              className="w-full bg-[#3E362E] text-white py-3.5 rounded-xl font-sans font-extrabold text-xs tracking-wider uppercase transition-all duration-300 hover:bg-[#C5A059] hover:text-[#2A241F] cursor-pointer">
              Close Experience
            </button>
          </div>
        </div>
      )}
      <Footer />
    </>
  );
}