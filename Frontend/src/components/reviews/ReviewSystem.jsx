import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle, AlertCircle } from 'lucide-react';

const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const ScissorIcon = ({ className }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="6" cy="6" r="3" stroke="currentColor"/>
    <circle cx="6" cy="18" r="3" stroke="currentColor"/>
    <line x1="20" y1="4" x2="8.12" y2="15.88" stroke="currentColor"/>
    <line x1="14.47" y1="14.48" x2="20" y2="20" stroke="currentColor"/>
    <line x1="8.12" y1="8.12" x2="12" y2="12" stroke="currentColor"/>
  </svg>
);

const ReviewSystem = ({ bookingData }) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  /* ── State ── */
  const [salonRating,   setSalonRating]   = useState(0);
  const [barberRating,  setBarberRating]  = useState(0);
  const [salonHover,    setSalonHover]    = useState(0);
  const [barberHover,   setBarberHover]   = useState(0);
  const [reviewText,    setReviewText]    = useState("");
  const [loading,       setLoading]       = useState(false);
  const [submitted,     setSubmitted]     = useState(false);
  const [error,         setError]         = useState("");

  /* ── Pull context from URL query params OR booking prop OR localStorage ── */
  const salonId   = searchParams.get("salonId")   || bookingData?.salonId   || localStorage.getItem("lastSalonId")   || null;
  const barberId  = searchParams.get("barberId")  || bookingData?.barberId  || localStorage.getItem("lastBarberId")  || null;
  const bookingId = searchParams.get("bookingId") || bookingData?.bookingId || null;
  const barberName = searchParams.get("barberName") || bookingData?.barberName || "Your Barber";

  const token = localStorage.getItem("token");

  /* ── Redirect to login if not authenticated ── */
  useEffect(() => {
    if (!token) {
      setError("Please login to write a review");
      setTimeout(() => navigate("/login"), 1500);
    }
  }, [token, navigate]);

  /* ── Submit handler ── */
  const handleSubmit = async () => {
    if (!salonRating && !barberRating && !reviewText.trim()) {
      setError("Please add a rating or write something");
      return;
    }
    if (!token) {
      setError("Please login first");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API}/review`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          salon_id: salonId,
          barber_id: barberId,
          booking_id: bookingId,
          salon_rating: salonRating,
          barber_rating: barberRating,
          review_text: reviewText.trim(),
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSubmitted(true);
        setTimeout(() => navigate("/"), 2500);
      } else {
        setError(data.message || "Failed to submit review");
      }
    } catch {
      setError("Server error. Is the backend running?");
    } finally {
      setLoading(false);
    }
  };

  /* ── SUCCESS SCREEN ── */
  if (submitted) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center p-4 font-sans relative bg-[#FAF7F2]">
        <div className="bg-white rounded-[2rem] shadow-2xl p-12 text-center max-w-md border border-stone-200/40">
          <div className="w-20 h-20 rounded-full bg-green-100 mx-auto mb-6 flex items-center justify-center">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h2 className="text-3xl font-serif font-bold text-[#2D2926] mb-2 italic">Thank You!</h2>
          <p className="text-[#A68942] text-[10px] uppercase tracking-[0.25em] mb-4 font-bold">Review Submitted</p>
          <p className="text-[#8C8475] text-sm mb-6">Your feedback helps us improve. Redirecting you home...</p>
          <button onClick={() => navigate("/")}
            className="bg-[#3C3530] text-white px-8 py-3 rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:bg-[#2D2926] transition cursor-pointer">
            Go Home Now
          </button>
        </div>
      </div>
    );
  }

  /* ── FORM ── */
  return (
    <div className="min-h-screen w-full bg-[#FAF7F2] p-4 md:p-10 font-sans relative flex items-center justify-center overflow-x-hidden">

      {/* Brand Identity Header (Positioned absolutely so it doesn't break alignment flow) */}
      <div className="absolute top-6 left-6 md:top-10 md:left-10 z-30">
        <div className="flex flex-col items-start">
          <h1 className="text-xl md:text-2xl font-black text-[#C5A059] tracking-[0.2em] uppercase flex items-center gap-2">
            <ScissorIcon className="w-6 h-6 text-[#C5A059] stroke-[1.5px]" />
            Barber <span className="text-stone-900">Pro</span>
          </h1>
          <div className="h-[1px] w-full bg-[#C5A059] mt-1 opacity-50"/>
          <p className="text-[8px] text-stone-500 tracking-[0.4em] uppercase mt-1 opacity-70">Premium Grooming</p>
        </div>
      </div>

      {/* Review Modal Card Container */}
      <div className="w-full max-w-lg bg-[#FDFBF0] rounded-[2rem] shadow-xl border border-stone-200/40 relative z-10 mt-20 md:mt-0 animate-fade-in text-left">
        <div className="p-8 md:p-12">

          {/* Badge */}
          <div className="flex justify-center mb-6">
            <div className="bg-[#FAF6E9] p-4 rounded-2xl border border-[#F2EDE0] shadow-sm">
              <ScissorIcon className="w-8 h-8 text-[#A68942] stroke-[1.2px]" />
            </div>
          </div>

          <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#2D2926] text-center mb-2 italic">Review Session</h2>
          <p className="text-[#A68942] text-center text-[10px] uppercase tracking-[0.25em] mb-10 font-bold opacity-80">
            Share your elite experience
          </p>

          <div className="space-y-8">
            {/* Salon Rating */}
            <div className="space-y-3">
              <label className="text-[#8C8475] text-[9px] uppercase font-black tracking-widest block text-center">Salon Ambience</label>
              <div className="flex justify-center gap-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button key={star}
                    type="button"
                    onMouseEnter={() => setSalonHover(star)}
                    onMouseLeave={() => setSalonHover(0)}
                    onClick={() => { setSalonRating(star); setError(""); }}
                    className="transition-transform duration-200 hover:scale-125 focus:outline-none cursor-pointer">
                    <span className={`text-4xl ${star <= (salonHover || salonRating) ? "text-[#A68942]" : "text-[#E5E0D0]"}`}>★</span>
                  </button>
                ))}
              </div>
              {salonRating > 0 && <p className="text-center text-[10px] text-[#A68942] font-bold">{salonRating} / 5</p>}
            </div>

            {/* Barber Rating */}
            <div className="space-y-3">
              <label className="text-[#8C8475] text-[9px] uppercase font-black tracking-widest block text-center">Stylist: {barberName}</label>
              <div className="flex justify-center gap-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button key={star}
                    type="button"
                    onMouseEnter={() => setBarberHover(star)}
                    onMouseLeave={() => setBarberHover(0)}
                    onClick={() => { setBarberRating(star); setError(""); }}
                    className="transition-transform duration-200 hover:scale-125 focus:outline-none cursor-pointer">
                    <span className={`text-4xl ${star <= (barberHover || barberRating) ? "text-[#A68942]" : "text-[#E5E0D0]"}`}>★</span>
                  </button>
                ))}
              </div>
              {barberRating > 0 && <p className="text-center text-[10px] text-[#A68942] font-bold">{barberRating} / 5</p>}
            </div>
          </div>

          {/* Textarea Input Container */}
          <div className="mt-10 mb-4">
            <textarea
              value={reviewText}
              onChange={(e) => { setReviewText(e.target.value); setError(""); }}
              placeholder="Your feedback matters..."
              maxLength={500}
              className="w-full bg-[#FAF6E9] border border-[#E5E0D0] rounded-2xl p-5 text-[#2D2926] focus:border-[#A68942] focus:ring-0 outline-none transition-all h-28 resize-none placeholder-[#BDB7AB] text-sm shadow-inner"
            />
            <p className="text-right text-[9px] text-[#BDB7AB] mt-1">{reviewText.length}/500</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
              <p className="text-red-600 text-xs font-semibold">{error}</p>
            </div>
          )}

          {/* Action Trigger Button */}
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading || !token}
            className="w-full bg-[#3C3530] hover:bg-[#2D2926] text-white font-bold py-5 rounded-2xl transition-all shadow-xl uppercase tracking-widest text-[10px] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer">
            {loading ? "Submitting..." : "Submit Review"}
          </button>

          <p className="text-center text-[#8C8475] text-[8px] mt-8 uppercase tracking-[0.3em] opacity-60">
            Professional Grooming Standards
          </p>
        </div>
      </div>

      {/* Embedded Fade-In Keyframe Logic */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes fade-in { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in { animation: fade-in 0.6s ease-out forwards; }
      `}} />
    </div>
  );
};

export default ReviewSystem;