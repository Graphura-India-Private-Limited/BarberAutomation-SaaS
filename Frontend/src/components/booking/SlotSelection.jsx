import React, { useState, useEffect } from 'react';
import { Clock, RefreshCw } from 'lucide-react';

const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Generate 30-min interval time slots between openTime and closeTime ("09:00" format, 24hr)
function generateSlots(openTime = "09:00", closeTime = "21:00") {
  const slots = [];
  const [openH, openM] = openTime.split(":").map(Number);
  const [closeH, closeM] = closeTime.split(":").map(Number);
  let h = openH, m = openM;
  while (h < closeH || (h === closeH && m < closeM)) {
    const suffix = h < 12 ? "AM" : "PM";
    const displayH = h === 0 ? 12 : h > 12 ? h - 12 : h;
    const displayM = String(m).padStart(2, "0");
    slots.push(`${displayH}:${displayM} ${suffix}`);
    m += 30;
    if (m >= 60) { m -= 60; h++; }
  }
  return slots;
}

export default function SlotSelection({ bookingData = { barber: "Rahul", service: "Haircut" }, onNext }) {
  const [selectedDate, setSelectedDate] = useState('Today');
  const [selectedTime, setSelectedTime] = useState(null);
  const [existingBookings, setExistingBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [salonHours, setSalonHours] = useState({ opening_time: "09:00", closing_time: "21:00" });

  const availableDates = ['Today', 'Tomorrow', 'Day After'];

  // Fetch salon hours + existing bookings
  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      const salonId = localStorage.getItem("selectedSalonId");
      setLoading(true);
      try {
        // 1. Find salon (for opening/closing hours)
        let targetSalonId = salonId;
        if (!targetSalonId) {
          const res = await fetch(`${API}/salon`);
          const data = await res.json();
          if (data.success && data.salons?.length > 0) {
            targetSalonId = data.salons[0]._id;
            // Extract salon hours
            const salon = salonId ? data.salons.find(s => s._id === salonId) : data.salons[0];
            if (salon) {
              setSalonHours({
                opening_time: salon.opening_time || "09:00",
                closing_time: salon.closing_time || "21:00"
              });
            }
          }
        } else {
          // Fetch the specific salon's hours
          try {
            const res = await fetch(`${API}/salon`);
            const data = await res.json();
            if (data.success && data.salons) {
              const salon = data.salons.find(s => s._id === salonId) || data.salons[0];
              if (salon) {
                setSalonHours({
                  opening_time: salon.opening_time || "09:00",
                  closing_time: salon.closing_time || "21:00"
                });
              }
            }
          } catch { /* use defaults */ }
        }

        // 2. Fetch existing bookings to block busy slots
        if (token && targetSalonId) {
          const res = await fetch(`${API}/booking/salon/${targetSalonId}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          const data = await res.json();
          if (data.success && data.bookings) {
            setExistingBookings(data.bookings);
          }
        }
      } catch (err) {
        console.error("Error fetching slot data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // All 30-min slots between salon hours
  const allSlots = generateSlots(salonHours.opening_time, salonHours.closing_time);

  const getSlotISOString = (dateLabel, timeStr) => {
    let bookingDateObj = new Date();
    if (dateLabel === "Tomorrow") bookingDateObj.setDate(bookingDateObj.getDate() + 1);
    else if (dateLabel === "Day After") bookingDateObj.setDate(bookingDateObj.getDate() + 2);
    const dateStr = bookingDateObj.toISOString().split("T")[0];
    let [timePart, modifier] = timeStr.split(" ");
    let [hours, minutes] = timePart.split(":");
    let h = parseInt(hours, 10);
    if (h === 12) h = 0;
    if (modifier === "PM") h += 12;
    return `${dateStr}T${String(h).padStart(2, "0")}:${minutes}:00.000Z`;
  };

  const isSlotBooked = (dateLabel, timeStr) => {
    const candidateSlot = getSlotISOString(dateLabel, timeStr);
    return existingBookings.some(b => {
      const matchBarber =
        String(b.barber_id?._id || b.barber_id) === String(bookingData?.barber_id) ||
        (b.barber_id?.name?.toLowerCase().includes(bookingData?.barber?.toLowerCase()));
      const isActive = !["cancelled", "completed", "noshow"].includes(b.status);
      return matchBarber && isActive && b.slot_time === candidateSlot;
    });
  };

  const isSlotInPast = (date, time) => {
    if (date !== 'Today') return false;
    const now = new Date();
    const [timePart, modifier] = time.split(' ');
    let [hours, minutes] = timePart.split(':').map(Number);
    if (modifier === 'PM' && hours !== 12) hours += 12;
    if (modifier === 'AM' && hours === 12) hours = 0;
    const slotDate = new Date();
    slotDate.setHours(hours, minutes, 0, 0);
    return slotDate <= now;
  };

  const handleContinue = () => {
    if (selectedDate && selectedTime) {
      if (onNext) onNext(selectedDate, selectedTime);
    }
  };

  // Slots to display: all - booked ones; past ones shown as disabled
  const displayedSlots = allSlots.filter(t => !isSlotBooked(selectedDate, t));
  const availableCount = displayedSlots.filter(t => !isSlotInPast(selectedDate, t)).length;

  return (
    <div className="max-w-xl mx-auto">
      <div className="mb-6 border-b pb-4">
        <h2 className="text-2xl font-bold text-gray-900">Select your slot</h2>
        <p className="text-gray-500 mt-1 text-sm">
          Booking with <strong className="text-[#3E362E]">{bookingData?.barber || "Barber"}</strong> for{" "}
          <strong className="text-[#3E362E]">{bookingData?.service || "Styling"}</strong>
        </p>
      </div>

      {/* Date Selection */}
      <div className="mb-6">
        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Select Date</h3>
        <div className="flex gap-3">
          {availableDates.map(date => (
            <button
              key={date}
              type="button"
              onClick={() => { setSelectedDate(date); setSelectedTime(null); }}
              className={`px-5 py-3 rounded-xl font-semibold transition-all duration-200 flex-1 text-center text-sm ${
                selectedDate === date
                  ? 'bg-[#3E362E] text-white shadow-md -translate-y-0.5'
                  : 'bg-stone-50 text-stone-600 hover:bg-stone-100 border border-stone-200'
              }`}
            >
              {date}
            </button>
          ))}
        </div>
      </div>

      {/* Time Selection */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
            <Clock size={13} className="text-[#C5A059]" />
            Available Times
          </h3>
          {!loading && (
            <span className="text-[10px] font-bold text-stone-400 bg-stone-100 px-2.5 py-1 rounded-full">
              {availableCount} slot{availableCount !== 1 ? 's' : ''} available
            </span>
          )}
        </div>

        {loading ? (
          <div className="flex items-center justify-center gap-2 py-8 text-stone-400">
            <RefreshCw size={14} className="animate-spin text-[#C5A059]" />
            <p className="text-sm font-semibold">Loading availability…</p>
          </div>
        ) : displayedSlots.length === 0 ? (
          <p className="text-sm font-semibold text-amber-700 bg-amber-50 border border-amber-200 rounded-xl p-4 text-center">
            No slots available for {selectedDate}. Please select another date.
          </p>
        ) : (
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5 max-h-72 overflow-y-auto pr-1 custom-scrollbar">
            {displayedSlots.map(time => {
              const isPast = isSlotInPast(selectedDate, time);
              const isSelected = selectedTime === time;
              return (
                <button
                  key={time}
                  type="button"
                  disabled={isPast}
                  onClick={() => setSelectedTime(time)}
                  className={`py-2.5 px-2 rounded-xl font-semibold border transition-all duration-150 text-xs text-center leading-tight ${
                    isPast
                      ? 'border-stone-100 bg-stone-50 text-stone-300 cursor-not-allowed line-through'
                      : isSelected
                        ? 'border-[#C5A059] bg-[#FEF3E2] text-[#3E362E] shadow-sm font-black ring-2 ring-[#C5A059]/30'
                        : 'border-gray-200 text-gray-600 hover:border-[#C5A059] hover:text-[#C5A059] hover:bg-amber-50/30'
                  }`}
                >
                  {time}
                </button>
              );
            })}
          </div>
        )}

        {!loading && availableCount === 0 && displayedSlots.length > 0 && (
          <p className="text-xs text-stone-400 text-center mt-3 font-medium">
            All future slots for {selectedDate} have passed. Try Tomorrow.
          </p>
        )}
      </div>

      {/* Selected slot preview */}
      {selectedTime && (
        <div className="mb-4 px-4 py-3 bg-emerald-50 border border-emerald-200 rounded-xl text-sm font-semibold text-emerald-800 flex items-center gap-2">
          <Clock size={14} />
          <span>Selected: <strong>{selectedDate}</strong> at <strong>{selectedTime}</strong></span>
        </div>
      )}

      {/* Continue Button */}
      <button
        type="button"
        onClick={handleContinue}
        disabled={!selectedTime}
        className={`w-full py-4 rounded-xl font-bold text-base transition-all duration-200 ${
          selectedTime
            ? 'bg-[#3E362E] hover:bg-[#2A241F] text-white shadow-md cursor-pointer'
            : 'bg-gray-100 text-gray-400 cursor-not-allowed opacity-60'
        }`}
      >
        Continue to Details
      </button>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #F5F5F4; border-radius: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #E6D5C3; border-radius: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #C5A059; }
      `}</style>
    </div>
  );
}