import React from 'react';

export default function ConfirmationPage({ bookingData, onReset }) {
  // random booking id here
  const bookingId = "BKG-" + Math.floor(Math.random() * 1000000);

  return (
    <div className="bg-white rounded-2xl shadow-sm p-8 border border-gray-100 text-center">
      {/* Success Animation / Icon */}
      <div className="flex justify-center mb-6">
        <div className="h-20 w-20 bg-green-100 rounded-full flex items-center justify-center">
          <svg className="h-10 w-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
      </div>

      <h2 className="text-3xl font-bold text-gray-900 mb-2">Booking Confirmed!</h2>
      <p className="text-gray-500 mb-8">Your token payment of ₹50 was successful.</p>

      {/* Digital Receipt */}
      <div className="bg-salonBg p-6 rounded-xl text-left border border-gray-100 mb-8">
        <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-200">
          <span className="text-gray-500 text-sm">Booking ID</span>
          <span className="font-mono font-semibold text-gray-900">{bookingId}</span>
        </div>
        
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500">Service</span> 
            <span className="font-medium text-gray-900">{bookingData.service}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Professional</span> 
            <span className="font-medium text-gray-900">{bookingData.barber}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Date</span> 
            <span className="font-medium text-gray-900">{bookingData.date}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Time</span> 
            <span className="font-medium text-gray-900">{bookingData.timeSlot}</span>
          </div>
        </div>
      </div>

      <button 
        onClick={onReset}
        className="w-full bg-gray-900 hover:bg-gray-800 text-white py-4 rounded-xl font-bold text-lg shadow-md transition-all duration-200"
      >
        Back to Home
      </button>
    </div>
  );
}