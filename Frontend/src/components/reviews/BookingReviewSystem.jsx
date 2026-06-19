import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle, AlertCircle, ArrowLeft, Calendar, CreditCard, Monitor } from 'lucide-react';
import Navbar from "../layout/Navbar";
import Footer from "../layout/Footer";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const BookingReviewSystem = ({ bookingData }) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  /* ── State ── */
  const [bookingRating, setBookingRating] = useState(0);
  const [paymentRating, setPaymentRating] = useState(0);
  const [websiteRating, setWebsiteRating] = useState(0);

  const [bookingHover, setBookingHover] = useState(0);
  const [paymentHover, setPaymentHover] = useState(0);
  const [websiteHover, setWebsiteHover] = useState(0);

  const [reviewText, setReviewText] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const bookingId = searchParams.get("bookingId") || bookingData?.bookingId || null;
  const token = localStorage.getItem("token");

  /* ── Redirect if not authenticated ── */
  useEffect(() => {
    if (!token) {
      setError("Please login to submit feedback.");
      setTimeout(() => navigate("/login"), 1500);
    }
  }, [token, navigate]);

  /* ── Submit handler ── */
  const handleSubmit = async () => {
    if (!bookingRating || !paymentRating || !websiteRating) {
      setError("Please provide a rating for all three categories.");
      return;
    }
    if (!token) {
      setError("Please login first.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API}/booking-feedback`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          booking_id: bookingId,
          booking_process_rating: bookingRating,
          payment_process_rating: paymentRating,
          website_usability_rating: websiteRating,
          feedback_text: reviewText.trim(),
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSubmitted(true);
        window.scrollTo(0, 0);
        setTimeout(() => {
          window.scrollTo(0, 0);
          navigate("/");
        }, 2500);
      } else {
        setError(data.message || "Failed to submit feedback.");
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

            <h2 className="mb-1">
              <span className="font-sans font-black uppercase text-3xl tracking-tight text-stone-900">Thank </span>
              <span className="font-serif italic text-2xl text-[#C5A059] normal-case">You!</span>
            </h2>

            <p className="font-sans text-[11px] font-extrabold uppercase tracking-widest text-[#C5A059] mb-4">
              Feedback Submitted
            </p>

            <p className="font-sans text-sm font-normal leading-relaxed text-stone-600 mb-6">
              Your booking experience feedback helps us refine our online booking system. Redirecting you home...
            </p>

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

  return (
    <div className="min-h-screen w-full bg-[#FAF7F2] font-sans text-stone-800 antialiased flex flex-col justify-between relative overflow-x-hidden">
      <div>
        <Navbar />

        {/* ── EXIT BACK BUTTON ── */}
        <div className="w-full max-w-7xl mx-auto px-6 pt-6 relative z-50 flex justify-start">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 bg-white/90 backdrop-blur-md px-4 py-2.5 rounded-full border border-[#EADDCA] shadow-md hover:bg-white transition-all duration-300 group cursor-pointer select-none"
          >
            <ArrowLeft size={14} className="transition-transform group-hover:-translate-x-1 text-[#C5A059]" />
            <span className="font-sans font-extrabold text-xs tracking-wider uppercase text-[#3E362E]">Cancel Feedback</span>
          </button>
        </div>

        {/* Feedback Card Container */}
        <div className="w-full max-w-xl bg-[#FDFBF0] rounded-[2rem] shadow-xl border border-stone-200/40 relative z-10 mx-auto my-12 animate-fade-in text-left">
          <div className="p-8 md:p-12">

            {/* Icon Row */}
            <div className="flex justify-center gap-3 mb-6">
              <div className="bg-[#FAF6E9] p-3.5 rounded-2xl border border-[#F2EDE0] shadow-sm">
                <Calendar className="w-6 h-6 text-[#A68942] stroke-[1.2px]" />
              </div>
              <div className="bg-[#FAF6E9] p-3.5 rounded-2xl border border-[#F2EDE0] shadow-sm">
                <CreditCard className="w-6 h-6 text-[#A68942] stroke-[1.2px]" />
              </div>
              <div className="bg-[#FAF6E9] p-3.5 rounded-2xl border border-[#F2EDE0] shadow-sm">
                <Monitor className="w-6 h-6 text-[#A68942] stroke-[1.2px]" />
              </div>
            </div>

            {/* Primary Heading */}
            <h2 className="text-center mb-2 leading-none">
              <span className="font-sans font-black uppercase text-3xl md:text-4xl tracking-tight text-stone-900">Rate </span>
              <span className="font-serif italic text-2xl md:text-3xl text-[#C5A059] normal-case">Booking Experience</span>
            </h2>

            {/* Kicker */}
            <p className="font-sans text-[11px] font-extrabold uppercase tracking-widest text-[#C5A059] text-center mb-10 opacity-80">
              Help us perfect our reservation & payment process
            </p>

            <div className="space-y-8">
              {/* Booking Process Rating */}
              <div className="bg-white/60 p-5 rounded-2xl border border-stone-200/20 shadow-sm space-y-3">
                <label className="font-sans text-[11px] font-extrabold uppercase tracking-widest text-[#C5A059] block text-center">
                  1. Ease of Booking
                </label>
                <div className="flex justify-center gap-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button key={star}
                      type="button"
                      onMouseEnter={() => setBookingHover(star)}
                      onMouseLeave={() => setBookingHover(0)}
                      onClick={() => { setBookingRating(star); setError(""); }}
                      className="transition-transform duration-200 hover:scale-125 focus:outline-none cursor-pointer">
                      <span className={`text-4xl ${star <= (bookingHover || bookingRating) ? "text-[#A68942]" : "text-[#E5E0D0]"}`}>★</span>
                    </button>
                  ))}
                </div>
                {bookingRating > 0 && (
                  <p className="font-sans text-[10px] font-bold text-[#A68942] text-center uppercase tracking-wider">
                    {bookingRating} / 5
                  </p>
                )}
              </div>

              {/* Payment Flow Rating */}
              <div className="bg-white/60 p-5 rounded-2xl border border-stone-200/20 shadow-sm space-y-3">
                <label className="font-sans text-[11px] font-extrabold uppercase tracking-widest text-[#C5A059] block text-center">
                  2. Payment Flow & Transaction Convenience
                </label>
                <div className="flex justify-center gap-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button key={star}
                      type="button"
                      onMouseEnter={() => setPaymentHover(star)}
                      onMouseLeave={() => setPaymentHover(0)}
                      onClick={() => { setPaymentRating(star); setError(""); }}
                      className="transition-transform duration-200 hover:scale-125 focus:outline-none cursor-pointer">
                      <span className={`text-4xl ${star <= (paymentHover || paymentRating) ? "text-[#A68942]" : "text-[#E5E0D0]"}`}>★</span>
                    </button>
                  ))}
                </div>
                {paymentRating > 0 && (
                  <p className="font-sans text-[10px] font-bold text-[#A68942] text-center uppercase tracking-wider">
                    {paymentRating} / 5
                  </p>
                )}
              </div>

              {/* Website Usability Rating */}
              <div className="bg-white/60 p-5 rounded-2xl border border-stone-200/20 shadow-sm space-y-3">
                <label className="font-sans text-[11px] font-extrabold uppercase tracking-widest text-[#C5A059] block text-center">
                  3. Website Usability & Interface
                </label>
                <div className="flex justify-center gap-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button key={star}
                      type="button"
                      onMouseEnter={() => setWebsiteHover(star)}
                      onMouseLeave={() => setWebsiteHover(0)}
                      onClick={() => { setWebsiteRating(star); setError(""); }}
                      className="transition-transform duration-200 hover:scale-125 focus:outline-none cursor-pointer">
                      <span className={`text-4xl ${star <= (websiteHover || websiteRating) ? "text-[#A68942]" : "text-[#E5E0D0]"}`}>★</span>
                    </button>
                  ))}
                </div>
                {websiteRating > 0 && (
                  <p className="font-sans text-[10px] font-bold text-[#A68942] text-center uppercase tracking-wider">
                    {websiteRating} / 5
                  </p>
                )}
              </div>
            </div>

            {/* Textarea */}
            <div className="mt-10 mb-4">
              <textarea
                value={reviewText}
                onChange={(e) => { setReviewText(e.target.value); setError(""); }}
                placeholder="Any suggestions or thoughts about the online reservation process?"
                maxLength={500}
                className="w-full bg-[#FAF6E9] border border-[#E5E0D0] rounded-2xl p-5 font-sans text-sm font-normal leading-relaxed text-stone-600 focus:border-[#A68942] focus:ring-0 outline-none transition-all h-28 resize-none placeholder:text-stone-400 shadow-inner"
              />
              <p className="text-right font-sans text-[11px] font-extrabold uppercase tracking-widest text-stone-400 mt-1">
                {reviewText.length}/500
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                <p className="font-sans text-sm font-normal leading-relaxed text-red-600">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading || !token}
              className="w-full bg-[#3C3530] hover:bg-[#C5A059] hover:text-[#2A241F] text-white font-sans font-extrabold text-xs tracking-wider uppercase py-5 rounded-2xl transition-all shadow-xl active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer">
              {loading ? "Submitting..." : "Submit Booking Feedback"}
            </button>

            <p className="font-sans text-[11px] font-extrabold uppercase tracking-widest text-stone-400 text-center mt-8 opacity-60">
              Online Reservation Quality Standards
            </p>
          </div>
        </div>
      </div>

      <Footer />

      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes fade-in { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in { animation: fade-in 0.6s ease-out forwards; }
      `}} />
    </div>
  );
};

export default BookingReviewSystem;
