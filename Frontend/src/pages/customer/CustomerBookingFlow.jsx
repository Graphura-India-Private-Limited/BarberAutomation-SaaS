import React, { useState, useEffect } from 'react';
import SlotSelection from '../../Components/SlotSelection';
import BookingForm from '../../Components/BookingForm';
import ConfirmationPage from '../../Components/ConfirmationPage';
import SmartWaitTimeCard from '../../Components/SmartWaitTimeCard';
import DelayAlertBanner from '../../Components/DelayAlertBanner';

const SESSION_START = Date.now();

export default function Wrapper() {
  const [bookingData, setBookingData] = useState({
    service: 'Haircut & Styling',
    price: 500,
    barber: 'Rahul',
    date: null,
    timeSlot: null,
  });

  const [queueState, setQueueState] = useState({
    queueLength: 4,
    barbers: 2,
    avgServiceTime: 20,
  });

  const [currentStep, setCurrentStep] = useState(3);

  const handleSlotSelected = (date, time) => {
    setBookingData({ ...bookingData, date, timeSlot: time });
    setCurrentStep(4);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setQueueState((current) => ({
        ...current,
        queueLength: Math.max(1, current.queueLength + (Math.random() > 0.5 ? 1 : -1)),
      }));
    }, 12000);

    return () => clearInterval(interval);
  }, []);

  const estimatedWait = Math.round(
    (queueState.queueLength * queueState.avgServiceTime) / queueState.barbers,
  );

  return (
    <div className="min-h-screen bg-salonBg py-12 px-4 font-sans text-gray-800">
      <div className="max-w-2xl mx-auto space-y-5">

        {/* ── AI FEATURES ───────────────────────────────────── */}
        <DelayAlertBanner
          estimatedMinutes={estimatedWait}
          startTime={SESSION_START}
        />

        <SmartWaitTimeCard
          queueLength={queueState.queueLength}
          barbers={queueState.barbers}
          avgServiceTime={queueState.avgServiceTime}
        />
        {/* ─────────────────────────────────────────────────── */}

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