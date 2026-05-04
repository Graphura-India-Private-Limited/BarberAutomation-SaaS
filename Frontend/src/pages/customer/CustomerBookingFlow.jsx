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
    <div className="min-h-screen py-12 px-4 font-sans text-gray-800" style={{position:"relative"}}>
      {/* Background Image with soft overlay */}
      <div style={{position:"fixed",inset:0,zIndex:-1,backgroundImage:"url(https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=1600&q=80)",backgroundSize:"cover",backgroundPosition:"center"}} />
      <div style={{position:"fixed",inset:0,zIndex:-1,background:"rgba(249,247,244,0.85)",backdropFilter:"blur(8px)"}} />
      
      <div className="max-w-2xl mx-auto" style={{position:"relative",zIndex:1}}>
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