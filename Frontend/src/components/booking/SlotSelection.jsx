import React, { useState, useEffect, useRef } from 'react';
import { Clock, RefreshCw } from 'lucide-react';

const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Generate 15-min interval time slots between openTime and closeTime ("09:00" format, 24hr)
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
    m += 15;
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
  
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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

  // All 15-min slots between salon hours
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
    const candidateStartStr = getSlotISOString(dateLabel, timeStr);
    const candidateStart = new Date(candidateStartStr);
    const duration = bookingData?.duration || 30; // default to 30 mins
    const candidateEnd = new Date(candidateStart.getTime() + duration * 60 * 1000);

    return existingBookings.some(b => {
      const matchBarber =
        String(b.barber_id?._id || b.barber_id) === String(bookingData?.barber_id) ||
        (b.barber_id?.name?.toLowerCase().includes(bookingData?.barber?.toLowerCase()));
      const isActive = !["cancelled", "completed", "noshow"].includes(b.status);
      
      if (matchBarber && isActive && b.slot_time) {
        const bStart = new Date(b.slot_time);
        // calculate booking duration (sum of service durations)
        const bDuration = (b.services || []).reduce((sum, s) => sum + (s.duration || 30), 0);
        const bEnd = new Date(bStart.getTime() + bDuration * 60 * 1000);

        // check if candidate slot overlaps with booking: candidateStart < bEnd && candidateEnd > bStart
        return candidateStart < bEnd && candidateEnd > bStart;
      }
      return false;
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

  const availableCount = allSlots.filter(t => !isSlotBooked(selectedDate, t) && !isSlotInPast(selectedDate, t)).length;

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
      <div className="mb-8 text-left">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
            <Clock size={13} className="text-[#C5A059]" />
            Choose Time Slot
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
        ) : (
          <div className="relative font-sans" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="w-full bg-[#FAF9F6] border border-[#EBE6DF] text-[#3E362E] px-4 py-3.5 rounded-xl text-sm font-semibold transition-all duration-300 outline-none flex items-center justify-between cursor-pointer text-left select-none"
              style={{ borderColor: dropdownOpen ? "#C5A059" : "#EBE6DF" }}
            >
              <span className={selectedTime ? "text-[#3E362E] font-bold" : "text-stone-400 font-medium"}>
                {selectedTime || "-- Select a comfortable time --"}
              </span>
              <Clock size={16} className="text-[#C5A059] shrink-0 ml-2" />
            </button>

            {dropdownOpen && (
              <div className="absolute left-0 right-0 mt-2 bg-white border border-[#EADBCE] rounded-2xl shadow-xl z-50 max-h-48 sm:max-h-60 overflow-y-auto custom-scrollbar animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="py-1.5">
                  {allSlots.map(time => {
                    const isPast = isSlotInPast(selectedDate, time);
                    const isBooked = isSlotBooked(selectedDate, time);
                    const isDisabled = isPast || isBooked;
                    const isSelected = selectedTime === time;

                    let label = time;
                    let badge = null;
                    if (isBooked) {
                      badge = <span className="text-[9px] font-bold uppercase tracking-wider text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md">Booked</span>;
                    } else if (isPast) {
                      badge = <span className="text-[9px] font-bold uppercase tracking-wider text-stone-400 bg-stone-100 px-2 py-0.5 rounded-md">Passed</span>;
                    }

                    return (
                      <button
                        key={time}
                        type="button"
                        disabled={isDisabled}
                        onClick={() => {
                          setSelectedTime(time);
                          setDropdownOpen(false);
                        }}
                        className={`w-full px-4 py-3 text-left text-xs font-semibold flex items-center justify-between transition-colors border-none outline-none ${
                          isDisabled
                            ? "bg-stone-50/50 text-stone-300 cursor-not-allowed"
                            : isSelected
                              ? "bg-[#FEF3E2] text-[#3E362E] font-black"
                              : "text-stone-700 hover:bg-amber-50/30 hover:text-[#C5A059] cursor-pointer"
                        }`}
                      >
                        <span className={isSelected ? "text-[#3E362E] font-extrabold" : "text-stone-800"}>{label}</span>
                        {badge}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {!loading && availableCount === 0 && (
          <p className="text-xs text-stone-400 text-center mt-3 font-medium">
            All future slots for {selectedDate} have passed or are booked. Try another date.
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