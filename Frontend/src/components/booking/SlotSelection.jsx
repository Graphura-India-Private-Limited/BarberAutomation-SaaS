import React, { useState } from 'react';

export default function SlotSelection({ bookingData = { barber: "Rahul", service: "Haircut" }, onNext }) {
  const [selectedDate, setSelectedDate] = useState('Today');
  const [selectedTime, setSelectedTime] = useState(null);

  const availableDates = ['Today', 'Tomorrow', 'Day After'];
  const timeSlots = ['10:00 AM', '11:00 AM', '1:00 PM', '2:30 PM', '4:00 PM', '5:30 PM'];

  const handleContinue = () => {
    if (selectedDate && selectedTime) {
      if (onNext) onNext(selectedDate, selectedTime);
    } else {
      alert("Please select both a date and a time slot.");
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 max-w-xl mx-auto">
      <div className="mb-8 border-b pb-4">
        <h2 className="text-2xl font-bold text-gray-900">Select your slot</h2>
        <p className="text-gray-500 mt-1">
          Booking with {bookingData?.barber || "Rahul"} for {bookingData?.service || "Styling"}
        </p>
      </div>
      
      {/* 📅 Date Selection */}
      <div className="mb-8">
        <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-3">Select Date</h3>
        <div className="flex flex-wrap gap-3">
          {availableDates.map(date => (
            <button 
              key={date}
              type="button"
              onClick={() => setSelectedDate(date)}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 flex-1 min-w-[100px] text-center ${
                selectedDate === date 
                  ? 'bg-[#3E362E] text-white border-[#3E362E] shadow-md transform -translate-y-0.5' 
                  : 'bg-stone-50 text-stone-600 hover:bg-stone-100 border border-stone-200'
              }`}
            >
              {date}
            </button>
          ))}
        </div>
      </div>

      {/* ⏰ Time Selection */}
      <div className="mb-10">
        <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-3">Available Times</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {timeSlots.map(time => (
            <button 
              key={time}
              type="button"
              onClick={() => setSelectedTime(time)}
              className={`p-3 rounded-xl font-bold border transition-all duration-200 text-sm text-center ${
                selectedTime === time 
                  ? 'border-[#C5A059] bg-[#FEF3E2] text-[#3E362E] shadow-sm font-black' 
                  : 'border-gray-200 text-gray-600 hover:border-[#C5A059] hover:text-[#C5A059]'
              }`}
            >
              {time}
            </button>
          ))}
        </div>
      </div>

      {/* 🏁 Bottom Action Button */}
      <button 
        type="button"
        onClick={handleContinue}
        disabled={!selectedTime}
        className={`w-full py-4 rounded-xl font-bold text-lg transition-all duration-200 ${
          selectedTime 
            ? 'bg-[#3E362E] hover:bg-[#2A241F] text-white shadow-md cursor-pointer' 
            : 'bg-gray-100 text-gray-400 cursor-not-allowed opacity-60'
        }`}
      >
        Continue to Details
      </button>
    </div>
  );
}