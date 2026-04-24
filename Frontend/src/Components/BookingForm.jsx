import React, { useState } from 'react';

export default function BookingForm({ bookingData, onBack, onConfirm }) {
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
  });

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Final Payload:", { ...bookingData, ...formData });
    onConfirm();
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm p-8 border border-gray-100">
      <div className="flex items-center mb-8 pb-4 border-b">
        <button onClick={onBack} className="text-gray-400 hover:text-salonGold transition-colors mr-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>
        <h2 className="text-2xl font-bold text-gray-900">Confirm Details</h2>
      </div>

      {/* Elegant Booking Summary */}
      <div className="bg-salonBg p-6 rounded-xl mb-8 border border-gray-100">
        <h3 className="font-semibold text-gray-800 mb-4">Booking Summary</h3>
        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex justify-between"><span className="text-gray-500">Service:</span> <span className="font-medium text-gray-900">{bookingData.service}</span></div>
          <div className="flex justify-between"><span className="text-gray-500">Professional:</span> <span className="font-medium text-gray-900">{bookingData.barber}</span></div>
          <div className="flex justify-between"><span className="text-gray-500">Date & Time:</span> <span className="font-medium text-gray-900">{bookingData.date} at {bookingData.timeSlot}</span></div>
          <div className="border-t border-gray-200 mt-3 pt-3 flex justify-between items-center">
            <span className="text-gray-500">Token Payment to Confirm:</span> 
            <span className="font-bold text-lg text-gray-900">₹50</span>
          </div>
        </div>
      </div>

      {/* Clean User Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Full Name</label>
          <input 
            type="text" name="name" required
            onChange={handleChange}
            className="w-full border border-gray-300 px-4 py-3 rounded-xl focus:ring-2 focus:ring-salonGold focus:border-salonGold outline-none transition-all" 
            placeholder="Enter your name"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Mobile Number</label>
          <input 
            type="tel" name="mobile" required
            onChange={handleChange}
            className="w-full border border-gray-300 px-4 py-3 rounded-xl focus:ring-2 focus:ring-salonGold focus:border-salonGold outline-none transition-all" 
            placeholder="10-digit mobile number"
          />
        </div>

        <button type="submit" className="w-full bg-salonGold hover:bg-salonGoldHover text-white py-4 rounded-xl font-bold text-lg shadow-md transition-all duration-200 mt-4">
          Confirm & Pay ₹50
        </button>
      </form>
    </div>
  );
}