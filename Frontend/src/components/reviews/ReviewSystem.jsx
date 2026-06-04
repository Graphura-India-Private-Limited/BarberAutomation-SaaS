import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle, AlertCircle, ArrowLeft } from 'lucide-react';
import Navbar from "../layout/Navbar";
import Footer from "../layout/Footer";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const ScissorIcon = ({ className }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="6" cy="6" r="3" stroke="currentColor" />
    <circle cx="6" cy="18" r="3" stroke="currentColor" />
    <line x1="20" y1="4" x2="8.12" y2="15.88" stroke="currentColor" />
    <line x1="14.47" y1="14.48" x2="20" y2="20" stroke="currentColor" />
    <line x1="8.12" y1="8.12" x2="12" y2="12" stroke="currentColor" />
  </svg>
);

const ReviewSystem = ({ bookingData }) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  /* ── State ── */
  const [salonRating, setSalonRating] = useState(0);
  const [barberRating, setBarberRating] = useState(0);
  const [salonHover, setSalonHover] = useState(0);
  const [barberHover, setBarberHover] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  /* ── Pull context from URL query params OR booking prop OR localStorage ── */
  const salonId = searchParams.get("salonId") || bookingData?.salonId || localStorage.getItem("lastSalonId") || null;
  const barberId = searchParams.get("barberId") || bookingData?.barberId || localStorage.getItem("lastBarberId") || null;
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
      <div className="min-h-screen w-full flex flex-col justify-between font-sans relative bg-[#FAF7F2]">
        <Navbar />
        <div className="w-full flex-grow pt-24"></div>
        <div className="flex-grow flex items-center justify-center p-4">
          <div className="bg-white rounded-[2rem] shadow-2xl p-12 text-center max-w-md border border-stone-200/40 w-full">
            <div className="w-20 h-20 rounded-full bg-green-100 mx-auto mb-6 flex items-center justify-center">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>

            {/* Primary heading — Rule 1 */}
            <h2 className="mb-1">
              <span className="font-sans font-black uppercase text-3xl tracking-tight text-stone-900">Thank </span>
              <span className="font-serif italic text-2xl text-[#C5A059] normal-case">You!</span>
            </h2>

            {/* Kicker — Rule 2 */}
            <p className="font-sans text-[11px] font-extrabold uppercase tracking-widest text-[#C5A059] mb-4">
              Review Submitted
            </p>

            {/* Body — Rule 3 */}
            <p className="font-sans text-sm font-normal leading-relaxed text-stone-600 mb-6">
              Your feedback helps us improve. Redirecting you home...
            </p>

            {/* Button — Rule 4 */}
            <button onClick={() => navigate("/")}
              className="bg-[#3C3530] text-white px-8 py-3 rounded-2xl font-sans font-extrabold text-xs tracking-wider uppercase transition hover:bg-[#C5A059] hover:text-[#2A241F] cursor-pointer">
              Go Home Now
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  /* ── FORM ── */
  return (
    <div className="min-h-screen w-full bg-[#FAF7F2] font-sans text-stone-800 antialiased flex flex-col justify-between relative overflow-x-hidden">

      <div>
        {/* ── GLOBAL NAVBAR HEADER ── */}
        <Navbar />

        {/* ── EXIT BACK BUTTON ── */}
        <div className="w-full max-w-7xl mx-auto px-6 pt-6 relative z-50 flex justify-start">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 bg-white/90 backdrop-blur-md px-4 py-2.5 rounded-full border border-[#EADDCA] shadow-md hover:bg-white transition-all duration-300 group cursor-pointer select-none"
          >
            <ArrowLeft size={14} className="transition-transform group-hover:-translate-x-1 text-[#C5A059]" />
            {/* Button label — Rule 4 */}
            <span className="font-sans font-extrabold text-xs tracking-wider uppercase text-[#3E362E]">Cancel Review</span>
          </button>
        </div>

        {/* Review Modal Card Container */}
        <div className="w-full max-w-lg bg-[#FDFBF0] rounded-[2rem] shadow-xl border border-stone-200/40 relative z-10 mx-auto my-12 animate-fade-in text-left">
          <div className="p-8 md:p-12">

            {/* Scissor Badge */}
            <div className="flex justify-center mb-6">
              <div className="bg-[#FAF6E9] p-4 rounded-2xl border border-[#F2EDE0] shadow-sm">
                <ScissorIcon className="w-8 h-8 text-[#A68942] stroke-[1.2px]" />
              </div>
            </div>

            {/* Primary Heading — Rule 1 */}
            <h2 className="text-center mb-2 leading-none">
              <span className="font-sans font-black uppercase text-3xl md:text-4xl tracking-tight text-stone-900">Review </span>
              <span className="font-serif italic text-2xl md:text-3xl text-[#C5A059] normal-case">Session</span>
            </h2>

            {/* Kicker — Rule 2 */}
            <p className="font-sans text-[11px] font-extrabold uppercase tracking-widest text-[#C5A059] text-center mb-10 opacity-80">
              Share your elite experience
            </p>

            <div className="space-y-8">
              {/* Salon Rating */}
              <div className="space-y-3">
                {/* Label — Rule 2 */}
                <label className="font-sans text-[11px] font-extrabold uppercase tracking-widest text-[#C5A059] block text-center">
                  Salon Ambience
                </label>
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
                {/* Rating count — Rule 2 */}
                {salonRating > 0 && (
                  <p className="font-sans text-[11px] font-extrabold uppercase tracking-widest text-[#C5A059] text-center">
                    {salonRating} / 5
                  </p>
                )}
              </div>

              {/* Barber Rating */}
              <div className="space-y-3">
                {/* Label — Rule 2 */}
                <label className="font-sans text-[11px] font-extrabold uppercase tracking-widest text-[#C5A059] block text-center">
                  Stylist: {barberName}
                </label>
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
                {/* Rating count — Rule 2 */}
                {barberRating > 0 && (
                  <p className="font-sans text-[11px] font-extrabold uppercase tracking-widest text-[#C5A059] text-center">
                    {barberRating} / 5
                  </p>
                )}
              </div>
            </div>

            {/* Textarea */}
            <div className="mt-10 mb-4">
              <textarea
                value={reviewText}
                onChange={(e) => { setReviewText(e.target.value); setError(""); }}
                placeholder="Your feedback matters..."
                maxLength={500}
                className="w-full bg-[#FAF6E9] border border-[#E5E0D0] rounded-2xl p-5 font-sans text-sm font-normal leading-relaxed text-stone-600 focus:border-[#A68942] focus:ring-0 outline-none transition-all h-28 resize-none placeholder:text-stone-400 shadow-inner"
              />
              {/* Character count — Rule 2 */}
              <p className="text-right font-sans text-[11px] font-extrabold uppercase tracking-widest text-stone-400 mt-1">
                {reviewText.length}/500
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                {/* Error text — Rule 3 */}
                <p className="font-sans text-sm font-normal leading-relaxed text-red-600">{error}</p>
              </div>
            )}

            {/* Submit Button — Rule 4 */}
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading || !token}
              className="w-full bg-[#3C3530] hover:bg-[#C5A059] hover:text-[#2A241F] text-white font-sans font-extrabold text-xs tracking-wider uppercase py-5 rounded-2xl transition-all shadow-xl active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer">
              {loading ? "Submitting..." : "Submit Review"}
            </button>

            {/* Footer note — Rule 2 */}
            <p className="font-sans text-[11px] font-extrabold uppercase tracking-widest text-stone-400 text-center mt-8 opacity-60">
              Professional Grooming Standards
            </p>
          </div>
        </div>
      </div>

      {/* ── BRAND FOOTER MODULE ── */}
      <Footer />

      {/* Embedded Fade-In Keyframe Logic */}
      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes fade-in { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in { animation: fade-in 0.6s ease-out forwards; }
      `}} />
    </div>
  );
};

export default ReviewSystem;