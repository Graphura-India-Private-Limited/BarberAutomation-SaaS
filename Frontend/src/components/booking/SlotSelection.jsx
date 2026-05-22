import React, { useState } from 'react';


export default function SlotSelection({ bookingData, onNext }) {
  const [selectedDate, setSelectedDate] = useState('Today');
  const [selectedTime, setSelectedTime] = useState(null);

  const availableDates = ['Today', 'Tomorrow', 'Day After'];
  const timeSlots = ['10:00 AM', '11:00 AM', '1:00 PM', '2:30 PM', '4:00 PM', '5:30 PM'];

  const handleContinue = () => {
    if (selectedDate && selectedTime) {
      onNext(selectedDate, selectedTime);
    } else {
      alert("Please select both a date and a time slot.");
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm p-8 border border-gray-100">
      <div className="mb-8 border-b pb-4">
        <h2 className="text-2xl font-bold text-gray-900">Select your slot</h2>
        <p className="text-gray-500 mt-1">Booking with {bookingData.barber} for {bookingData.service}</p>
      </div>
      
      {/* Date Selection */}
      <div className="mb-8">
        <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-3">Select Date</h3>
        <div className="flex flex-wrap gap-3">
          {availableDates.map(date => (
            <button 
              key={date}
              onClick={() => setSelectedDate(date)}
              className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                selectedDate === date 
                  ? 'bg-salonGold text-white shadow-md transform -translate-y-0.5' 
                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              {date}
            </button>
          ))}
        </div>
      </div>

      {/* Time Selection */}
      <div className="mb-10">
        <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-3">Available Times</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {timeSlots.map(time => (
            <button 
              key={time}
              onClick={() => setSelectedTime(time)}
              className={`p-3 rounded-xl font-medium border transition-all duration-200 ${
                selectedTime === time 
                  ? 'border-salonGold bg-orange-50 text-salonGold' 
                  : 'border-gray-200 text-gray-600 hover:border-salonGold hover:text-salonGold'
              }`}
            >
              {time}
            </button>
          ))}
        </div>
      </div>

      <button 
        onClick={handleContinue}
        disabled={!selectedTime}
        className={`w-full py-4 rounded-xl font-bold text-lg transition-all duration-200 ${
          selectedTime 
            ? 'bg-salonGold hover:bg-salonGoldHover text-white shadow-md' 
            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
        }`}
      >
        Continue to Details
      </button>
    </div>
  );
}