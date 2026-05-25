import React, { useState } from 'react';
import SlotSelection from '../../components/booking/SlotSelection';
import BookingForm from '../../components/booking/BookingForm';
import ConfirmationPage from '../../components/booking/ConfirmationPage';
import { useNavigate } from 'react-router-dom';

export default function Wrapper() {
  const [bookingData, setBookingData] = useState({
    service: 'Haircut & Styling',
    price: 500,
    barber: 'Rahul',
    date: null,
    time: null, // 📑 FIXED: Changed 'timeSlot' to 'time' to match your sub-components!
  });
  const navigate = useNavigate();

  // Defaulting to Step 3 (Slot Selection view)
  const [currentStep, setCurrentStep] = useState(3); 

  const handleSlotSelected = (date, selectedTime) => {
    setBookingData({ ...bookingData, date, time: selectedTime }); // 📑 FIXED: Saved cleanly as 'time'
    setCurrentStep(4);
  };

  // Handles state finalization from the confirmation forms
  const handleBookingConfirmed = (updatedDetails) => {
    if (updatedDetails) {
      setBookingData((prev) => ({ ...prev, ...updatedDetails }));
    }
    setCurrentStep(5);
  };

  const handleResetFlow = () => {
    setBookingData({
      service: 'Haircut & Styling',
      price: 500,
      barber: 'Rahul',
      date: null,
      time: null,
    });
    setCurrentStep(1);
    navigate("/");
  };

  return (
    <div className="min-h-screen py-12 px-4 font-sans text-gray-800" style={{ position: "relative" }}>
      {/* Background Image with soft overlay */}
      <div style={{ position: "fixed", inset: 0, zIndex: -1, backgroundImage: "url(https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=1600&q=80)", backgroundSize: "cover", backgroundPosition: "center" }} />
      <div style={{ position: "fixed", inset: 0, zIndex: -1, background: "rgba(249,247,244,0.85)", backdropFilter: "blur(8px)" }} />
      
      <div className="max-w-2xl mx-auto" style={{ position: "relative", zIndex: 1 }}>
        
        {/* STEP 3: Slot Selection View */}
        {currentStep === 3 && (
          <SlotSelection 
            bookingData={bookingData} 
            onNext={handleSlotSelected} 
          />
        )}
        
        {/* STEP 4: Customer Contact & Attendee Details Form */}
        {currentStep === 4 && (
          <BookingForm 
            bookingData={bookingData} 
            onBack={() => setCurrentStep(3)} 
            onConfirm={handleBookingConfirmed}
          />
        )}

        {/* STEP 5: Successful Digital Receipt Page */}
        {currentStep === 5 && (
          <ConfirmationPage 
            bookingData={bookingData} 
            onReset={handleResetFlow}
          />
        )}
      </div>
    </div>
  );
}