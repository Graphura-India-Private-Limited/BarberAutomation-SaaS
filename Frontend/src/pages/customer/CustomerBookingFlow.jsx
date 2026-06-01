import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Home } from 'lucide-react';
import SlotSelection from '../../components/booking/SlotSelection';
import BookingForm from '../../components/booking/BookingForm';
import ConfirmationPage from '../../components/booking/ConfirmationPage';
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";

const GOLD = "#C5A059";

export default function Wrapper() {
  const [bookingData, setBookingData] = useState({
    service: 'Haircut & Styling',
    price: 500,
    barber: 'Rahul',
    date: null,
    time: null,
  });
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(3); 

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentStep]);

  const handleSlotSelected = (date, selectedTime) => {
    setBookingData({ ...bookingData, date, time: selectedTime });
    setCurrentStep(4);
  };

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

  const handleHeaderBackAction = () => {
    if (currentStep === 3) {
      navigate("/");
    } else if (currentStep === 4) {
      setCurrentStep(3);
    } else if (currentStep === 5) {
      handleResetFlow();
    }
  };

  return (
    <>
      {/* ── ✅ GLOBAL FLOATING NAVBAR MOUNTED CLEANLY ── */}
      <Navbar />
      
      <div className="bg-[#FAF6F0] min-h-screen font-sans text-[#3E362E] selection:bg-[#C5A059] selection:text-white relative overflow-hidden flex flex-col justify-between">
        
        {/* ── LUXURY BLUR BACKGROUND BLOBS ── */}
        <div className="absolute top-20 -left-40 w-[600px] h-[600px] bg-gradient-to-br from-[#C5A059]/10 via-[#EADDCA]/20 to-transparent rounded-full blur-[120px] pointer-events-none animate-pulse duration-[8000ms]" />
        <div className="absolute bottom-1/3 right-10 w-[700px] h-[500px] bg-[#EADDCA]/30 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-[500px] h-[500px] bg-[#C5A059]/10 rounded-full blur-[100px] pointer-events-none" />

        {/* ── ✅ pt-24 ADDS THE ZONE PADDING TO SHOW THE OVERRIDE BACK BUTTON BELOW NAV ── */}
        <div className="w-full flex-grow pt-24">
          
          {/* ── 📑 BACK NAVIGATION PILL TRIGGER ── */}
          {currentStep >= 3 && (
            <div className="w-full max-w-7xl mx-auto px-6 pt-4 relative z-50 flex justify-start">
              {/* Rule 4: Action button uppercase bold typography standards */}
              <button 
                onClick={handleHeaderBackAction} 
                className="flex items-center gap-2 text-xs font-extrabold tracking-wider uppercase transition-all duration-300 hover:opacity-80 group text-[#3E362E] bg-white/90 backdrop-blur-md px-4 py-2.5 rounded-full border border-[#EADDCA] shadow-md hover:bg-white cursor-pointer select-none font-sans outline-none"
              >
                {currentStep === 3 || currentStep === 5 ? (
                  <Home size={14} className="transition-transform group-hover:scale-110 text-[#C5A059]" />
                ) : (
                  <ArrowLeft size={14} className="transition-transform group-hover:-translate-x-1 text-[#C5A059]" />
                )}
                <span>
                  {currentStep === 3 ? "Exit Booking" : currentStep === 5 ? "Home" : "Back"}
                </span>
              </button>
            </div>
          )}

          {/* Dynamic Progress Typography Banner Row */}
          <div className="relative h-[150px] sm:h-[180px] flex items-center justify-center overflow-hidden mb-2">
            <div className="absolute inset-0 bg-gradient-to-b from-[#EADDCA]/20 via-transparent to-[#FAF6F0]" />
            
            <div className="relative z-10 text-center px-4 max-w-3xl mx-auto pt-4 w-full">
              {currentStep === 3 && (
                <>
                  {/* Rule 2: Minor tag subheading tracking style */}
                  <span className="mb-3 inline-block text-[11px] font-extrabold uppercase tracking-widest text-[#C5A059] font-sans bg-white/80 backdrop-blur-md border border-[#EADDCA] px-4 py-1.5 rounded-full shadow-sm">
                    Step 03 — Timeline Allocation
                  </span>
                  {/* Rule 1: Master typography single line banner composition */}
                  <h2 className="font-serif text-3xl sm:text-4xl tracking-normal text-stone-900 flex items-center justify-center gap-2 whitespace-nowrap">
                    <span className="font-bold uppercase">Select Your</span>
                    <span className="italic text-[#C5A059] normal-case font-medium">Slot & Time</span>
                  </h2>
                </>
              )}
              {currentStep === 4 && (
                <>
                  <span className="mb-3 inline-block text-[11px] font-extrabold uppercase tracking-widest text-[#C5A059] font-sans bg-white/80 backdrop-blur-md border border-[#EADDCA] px-4 py-1.5 rounded-full shadow-sm">
                    Step 04 — Guest Credentials
                  </span>
                  <h2 className="font-serif text-3xl sm:text-4xl tracking-normal text-stone-900 flex items-center justify-center gap-2 whitespace-nowrap">
                    <span className="font-bold uppercase">Personal</span>
                    <span className="italic text-[#C5A059] normal-case font-medium">Information</span>
                  </h2>
                </>
              )}
              {currentStep === 5 && (
                <>
                  <span className="mb-3 inline-block text-[11px] font-extrabold uppercase tracking-widest text-emerald-800 font-sans bg-emerald-50 border border-emerald-200 px-4 py-1.5 rounded-full shadow-sm">
                    Allocation Successful
                  </span>
                  <h2 className="font-serif text-3xl sm:text-4xl tracking-normal text-stone-900 flex items-center justify-center gap-2 whitespace-nowrap">
                    <span className="font-bold uppercase">Digital Receipt</span>
                    <span className="italic text-[#C5A059] normal-case font-medium">Ledger</span>
                  </h2>
                </>
              )}
              <div className="w-12 h-[1.5px] bg-[#C5A059] mx-auto mt-4" />
            </div>
          </div>

          {/* Core Embedded Subcomponent Viewport Node */}
          <div className="max-w-2xl mx-auto px-4 pb-24 relative z-10 w-full">
            <div className="bg-white/90 backdrop-blur-md rounded-[32px] p-6 sm:p-10 border border-[#EADDCA] shadow-[0_10px_30px_rgba(0,0,0,0.01)] transition-all duration-500">
              
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
                  onConfirm={handleBookingConfirmed}
                />
              )}

              {currentStep === 5 && (
                <ConfirmationPage 
                  bookingData={bookingData} 
                  onReset={handleResetFlow}
                />
              )}
              
            </div>
          </div>
        </div>

        {/* ── ✅ GLOBAL LUXURY BRAND FOOTER ── */}
        <Footer />
      </div>
    </>
  );
}