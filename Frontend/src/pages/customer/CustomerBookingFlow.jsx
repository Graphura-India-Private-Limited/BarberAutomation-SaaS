import React, { useState } from 'react';
import SlotSelection from '../../Components/SlotSelection';
import BookingForm from '../../Components/BookingForm';
import ConfirmationPage from '../../Components/ConfirmationPage';

export default function Wrapper() {
  const [bookingData, setBookingData] = useState({
    service: 'Haircut & Styling',
    price: 500,
    barber: 'Rahul',
    date: null,
    timeSlot: null,
  });

  const [currentStep, setCurrentStep] = useState(3); 

  const handleSlotSelected = (date, time) => {
    setBookingData({ ...bookingData, date, timeSlot: time });
    setCurrentStep(4);
  };

  return (
    // Premium soft background covering the whole screen
    <div className="min-h-screen bg-salonBg py-12 px-4 font-sans text-gray-800">
      <div className="max-w-2xl mx-auto">
        {currentStep === 3 && (
          <SlotSelection 
            bookingData={bookingData} 
            onNext={handleSlotSelected} 
          />
        )}
        
        {currentStep === 4 && (
          <BookingForm 
            bookingData={bookingData} 
            onBack={() => setCurrentStep(3)} 
            onConfirm={() => setCurrentStep(5)}
          />
        )}
        {currentStep === 5 && (
          <ConfirmationPage 
            bookingData={bookingData} 
            onReset={() => setCurrentStep(3)}
            />
        )}
      </div>
    </div>
  );
}