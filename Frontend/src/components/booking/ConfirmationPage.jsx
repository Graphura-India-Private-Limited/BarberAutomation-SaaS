import React, { useState } from 'react';

export default function ConfirmationPage({ bookingData = {}, onReset }) {
  // Keeps the generated booking ID stable across component re-renders
  const [bookingId] = useState(() => "BKG-" + Math.floor(100000 + Math.random() * 900000));

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 text-center max-w-xl mx-auto">
      {/* Success Animation / Icon */}
      <div className="flex justify-center mb-6">
        <div className="h-20 w-20 bg-green-50 rounded-full flex items-center justify-center border border-green-100">
          <svg className="h-10 w-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
      </div>

      <h2 className="text-3xl font-bold text-gray-900 mb-2">Booking Confirmed!</h2>
      <p className="text-gray-500 mb-8 text-sm">Your token payment of ₹50 was successful.</p>

      {/* 🧾 Digital Receipt (FIXED: Replaced bg-salonBg with premium luxury cream theme combo) */}
      <div className="bg-[#FEF3E2] bg-opacity-40 p-6 rounded-2xl text-left border border-[#FEF3E2] mb-8">
        <div className="flex justify-between items-center mb-4 pb-4 border-b border-stone-200 border-dashed">
          <span className="text-stone-500 text-xs font-bold uppercase tracking-wider">Booking ID</span>
          <span className="font-mono font-bold text-[#3E362E] bg-white px-3 py-1 rounded-lg border border-stone-200 text-sm shadow-sm">
            {bookingId}
          </span>
        </div>
        
        <div className="space-y-4 text-sm">
          <div className="flex justify-between items-center">
            <span className="text-stone-500 font-medium">Service</span> 
            <span className="font-bold text-stone-900">{bookingData?.service || "Haircut & Styling"}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-stone-500 font-medium">Professional</span> 
            <span className="font-bold text-stone-900">{bookingData?.barber || "Rahul"}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-stone-500 font-medium">Date</span> 
            <span className="font-bold text-stone-900">{bookingData?.date || "Tomorrow"}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-stone-500 font-medium">Time</span> 
            <span className="font-bold text-stone-900">{bookingData?.timeSlot || "11:00 AM"}</span>
          </div>
        </div>
      </div>

      {/* 🏁 Back Home Action Button */}
      <button 
        type="button"
        onClick={onReset}
        className="w-full bg-[#3E362E] hover:bg-[#2A241F] text-white py-4 rounded-xl font-bold text-lg shadow-md transition-all duration-200 cursor-pointer"
      >
        Back to Home
      </button>
    </div>
  );
}