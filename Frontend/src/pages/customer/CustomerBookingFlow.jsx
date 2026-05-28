import React, { useState, useEffect } from 'react';
import SlotSelection from '../../components/booking/SlotSelection';
import BookingForm from '../../components/booking/BookingForm';
import ConfirmationPage from '../../components/booking/ConfirmationPage';
import { useNavigate } from 'react-router-dom';
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";

export default function Wrapper() {
  const [bookingData, setBookingData] = useState({
    service: 'Haircut & Styling',
    price: 500,
    barber: 'Rahul',
    date: null,
    time: null, // 📑 FIXED: Changed 'timeSlot' to 'time' to match sub-components
  });
  const navigate = useNavigate();

  // Defaulting to Step 3 (Slot Selection view)
  const [currentStep, setCurrentStep] = useState(3); 

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentStep]);

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
    <>
      <Navbar />
      <div className="bg-[#FAF6F0] min-h-screen font-sans text-[#3E362E] selection:bg-[#C5A059] selection:text-white relative overflow-hidden flex flex-col">
        
        {/* --- SHINY LUXURY GRADIENT GLOW LAYERS --- */}
        <div className="absolute top-20 -left-40 w-[600px] h-[600px] bg-gradient-to-br from-[#C5A059]/10 via-[#EADDCA]/20 to-transparent rounded-full blur-[120px] pointer-events-none animate-pulse duration-[8000ms]" />
        <div className="absolute bottom-1/3 right-10 w-[700px] h-[500px] bg-[#EADDCA]/30 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-[500px] h-[500px] bg-[#C5A059]/10 rounded-full blur-[100px] pointer-events-none" />

        {/* Dynamic Step Info Banner Aura */}
        <div className="relative h-[180px] sm:h-[220px] flex items-center justify-center overflow-hidden mb-2">
          <div className="absolute inset-0 bg-gradient-to-b from-[#EADDCA]/20 via-transparent to-[#FAF6F0]" />
          
          <div className="relative z-10 text-center px-4 max-w-3xl mx-auto pt-6">
            {currentStep === 3 && (
              <>
                <span className="text-[10px] font-black uppercase tracking-[0.4em] bg-white/80 backdrop-blur-md border border-[#EADDCA] px-4 py-1.5 rounded-full text-[#C5A059] shadow-sm inline-block mb-3">
                  Step 03 — Timeline Allocation
                </span>
                <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-[#3E362E] font-serif">
                  Select <span className="text-[#C5A059] italic normal-case">Slot & Time</span>
                </h1>
              </>
            )}
            {currentStep === 4 && (
              <>
                <span className="text-[10px] font-black uppercase tracking-[0.4em] bg-white/80 backdrop-blur-md border border-[#EADDCA] px-4 py-1.5 rounded-full text-[#C5A059] shadow-sm inline-block mb-3">
                  Step 04 — Guest Credentials
                </span>
                <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-[#3E362E] font-serif">
                  Personal <span className="text-[#C5A059] italic normal-case">Information</span>
                </h1>
              </>
            )}
            {currentStep === 5 && (
              <>
                <span className="text-[10px] font-black uppercase tracking-[0.4em] bg-emerald-50 border border-emerald-200 px-4 py-1.5 rounded-full text-emerald-800 shadow-sm inline-block mb-3">
                  Allocation Successful
                </span>
                <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-[#3E362E] font-serif">
                  Digital <span className="text-[#C5A059] italic normal-case">Receipt Ledger</span>
                </h1>
              </>
            )}
            <div className="w-12 h-[1.5px] bg-[#C5A059] mx-auto mt-4" />
          </div>
        </div>

        {/* Dynamic Steps Wrapper Layout */}
        <div className="max-w-2xl mx-auto px-4 pb-24 relative z-10 flex-grow w-full">
          <div className="bg-white/90 backdrop-blur-md rounded-[32px] p-6 sm:p-10 border border-[#EADDCA] shadow-[0_10px_30px_rgba(0,0,0,0.01)] transition-all duration-500">
            
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
      </div>
      <Footer />
    </>
  );
}