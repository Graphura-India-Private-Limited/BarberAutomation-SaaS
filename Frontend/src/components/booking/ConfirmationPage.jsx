
import React, { useState } from 'react';
import { Star, Copy, Check, ArrowRight, CalendarCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Format a MongoDB ObjectId into a readable short reference: BKG-4EDA425
const formatBookingRef = (rawId) => {
  if (!rawId) return null;
  const id = String(rawId);
  if (id.startsWith("BKG-")) return id; // already formatted
  return `BKG-${id.slice(-7).toUpperCase()}`;
};

export default function ConfirmationPage({ bookingData = {}, onReset, onWriteReview }) {
  const navigate = useNavigate();
  const rawBookingId = bookingData._id || bookingData.bookingId || null;
  const bookingRef = formatBookingRef(rawBookingId) || ("BKG-" + Math.floor(1000000 + Math.random() * 9000000));
  const fullBookingId = rawBookingId || bookingRef;

  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(fullBookingId).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleViewBookings = () => {
    // Navigate to customer dashboard appointments tab
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/dashboard", { state: { activeTab: "history" } });
    } else {
      navigate("/login");
    }
  };

  return (
    <div className="text-center max-w-xl mx-auto">
      {/* Success Icon */}
      <div className="flex justify-center mb-6">
        <div className="h-20 w-20 bg-green-50 rounded-full flex items-center justify-center border border-green-100">
          <svg className="h-10 w-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
      </div>

      <h2 className="text-3xl font-bold text-gray-900 mb-2">Booking Confirmed!</h2>
      <p className="text-gray-500 mb-8 text-sm">
        {bookingData?.paymentType === "FULL"
          ? `Your full payment of ₹${bookingData?.amountPaid || 500} was successful.`
          : `Your token payment of ₹${bookingData?.amountPaid || 50} was successful.`
        }
      </p>

      <div className="bg-[#FEF3E2] bg-opacity-40 p-6 rounded-2xl text-left border border-[#F5E6D0] mb-6">

        {/* Booking Reference */}
        <div className="mb-5 pb-4 border-b border-stone-200 border-dashed">
          <span className="text-stone-500 text-[10px] font-bold uppercase tracking-wider block mb-2">Booking Reference</span>
          <div className="flex items-center justify-between gap-3">
            <div>
              {/* Short formatted ref */}
              <span className="font-mono font-black text-[#3E362E] text-lg tracking-wider">{bookingRef}</span>
              {/* Full ID smaller below */}
              {rawBookingId && (
                <p className="text-[10px] text-stone-400 font-mono mt-0.5 truncate max-w-[200px]">{rawBookingId}</p>
              )}
            </div>
            <button
              onClick={handleCopy}
              title="Copy full booking ID"
              className={`flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider px-3 py-2 rounded-lg transition-all cursor-pointer border ${
                copied
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                  : 'bg-white border-stone-200 text-stone-600 hover:border-[#C5A059] hover:text-[#C5A059]'
              }`}
            >
              {copied ? <Check size={12} /> : <Copy size={12} />}
              {copied ? 'Copied!' : 'Copy ID'}
            </button>
          </div>
          <p className="text-[10px] text-stone-400 mt-2 font-medium leading-relaxed">
            💡 Use this reference to track your appointment, request support, or show at the salon counter.
          </p>
        </div>

        {/* Booking Details */}
        <div className="space-y-3.5 text-sm">
          <div className="flex justify-between items-center">
            <span className="text-stone-500 font-medium">Service</span>
            <span className="font-bold text-stone-900">{bookingData?.service || "Haircut & Styling"}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-stone-500 font-medium">Professional</span>
            <span className="font-bold text-stone-900">{bookingData?.barber || "Barber"}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-stone-500 font-medium">Date</span>
            <span className="font-bold text-stone-900">{bookingData?.date || "Tomorrow"}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-stone-500 font-medium">Time</span>
            <span className="font-bold text-stone-900">{bookingData?.time || bookingData?.timeSlot || "11:00 AM"}</span>
          </div>
          {bookingData?.attendees && bookingData.attendees.length > 1 && (
            <div className="flex justify-between items-start">
              <span className="text-stone-500 font-medium">Attendees</span>
              <div className="text-right">
                {bookingData.attendees.map((a, i) => (
                  <p key={i} className="font-bold text-stone-900 text-sm">{a.name} <span className="text-[10px] text-stone-400 font-normal">({a.type})</span></p>
                ))}
              </div>
            </div>
          )}
          <div className="flex justify-between items-center">
            <span className="text-stone-500 font-medium">Payment Option</span>
            <span className="font-bold text-stone-900">{bookingData?.paymentType === "FULL" ? "Full Payment" : "Partial Token"}</span>
          </div>
          <div className="flex justify-between items-center pt-2 border-t border-stone-200/50">
            <span className="text-[#3E362E] font-bold">Paid Amount</span>
            <span className="font-extrabold text-emerald-600 font-mono text-base">₹{bookingData?.amountPaid}</span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-3">
        <button
          type="button"
          onClick={handleViewBookings}
          className="w-full flex items-center justify-center gap-2 bg-[#3E362E] hover:bg-[#2A241F] text-white py-3.5 rounded-xl font-bold text-sm shadow-md transition-all duration-200 cursor-pointer"
        >
          <CalendarCheck size={16} />
          View My Appointments
        </button>
        <button
          type="button"
          onClick={onWriteReview}
          className="w-full flex items-center justify-center gap-2 bg-[#C5A059] hover:opacity-90 text-white py-3.5 rounded-xl font-bold text-sm shadow-md transition-all duration-200 cursor-pointer"
        >
          <Star size={16} fill="white" />
          Rate Booking Experience
        </button>
        <button
          type="button"
          onClick={onReset}
          className="w-full bg-white hover:bg-stone-50 text-stone-600 border border-stone-200 py-3.5 rounded-xl font-bold text-sm transition-all duration-200 cursor-pointer"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
}