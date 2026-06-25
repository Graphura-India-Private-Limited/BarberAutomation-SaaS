import React, { useState, useEffect } from 'react';

const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export default function SlotSelection({ bookingData = { barber: "Rahul", service: "Haircut" }, onNext }) {
  const [selectedDate, setSelectedDate] = useState('Today');
  const [selectedTime, setSelectedTime] = useState(null);
  const [existingBookings, setExistingBookings] = useState([]);
  const [loading, setLoading] = useState(false);

  const availableDates = ['Today', 'Tomorrow', 'Day After'];
  const timeSlots = ['10:00 AM', '11:00 AM', '1:00 PM', '2:30 PM', '4:00 PM', '5:30 PM'];

  useEffect(() => {
    const fetchBookings = async () => {
      const token = localStorage.getItem("token");
      const salonId = localStorage.getItem("selectedSalonId");
      if (!token) return;
      
      let targetSalonId = salonId;
      if (!targetSalonId) {
        try {
          const res = await fetch(`${API}/salon`);
          const data = await res.json();
          if (data.success && data.salons && data.salons.length > 0) {
            targetSalonId = data.salons[0]._id;
          }
        } catch (e) {
          console.error("Error fetching fallback salon:", e);
        }
      }
      if (!targetSalonId) return;
      
      setLoading(true);
      try {
        const res = await fetch(`${API}/booking/salon/${targetSalonId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (data.success && data.bookings) {
          setExistingBookings(data.bookings);
        }
      } catch (err) {
        console.error("Error fetching salon bookings:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  const getSlotISOString = (dateLabel, timeStr) => {
    let bookingDateObj = new Date();
    if (dateLabel === "Tomorrow") {
      bookingDateObj.setDate(bookingDateObj.getDate() + 1);
    } else if (dateLabel === "Day After") {
      bookingDateObj.setDate(bookingDateObj.getDate() + 2);
    }
    
    let dateStr = bookingDateObj.toISOString().split("T")[0];
    
    let [timePart, modifier] = timeStr.split(" ");
    let [hours, minutes] = timePart.split(":");
    let h = parseInt(hours, 10);
    if (h === 12) h = 0;
    if (modifier === "PM") h += 12;
    let hStr = String(h).padStart(2, "0");
    
    return `${dateStr}T${hStr}:${minutes}:00.000Z`;
  };

  const isSlotBooked = (dateLabel, timeStr) => {
    const candidateSlot = getSlotISOString(dateLabel, timeStr);
    
    const isBookedInDb = existingBookings.some(b => {
      const matchBarber = b.barber_id === bookingData?.barber_id || 
                          (b.barber_id?._id && String(b.barber_id._id) === String(bookingData?.barber_id)) ||
                          (b.barber_id?.name && b.barber_id.name.toLowerCase().includes(bookingData?.barber?.toLowerCase()));
      const isActive = b.status !== "cancelled" && b.status !== "completed" && b.status !== "noshow";
      return matchBarber && isActive && b.slot_time === candidateSlot;
    });

    if (isBookedInDb) return true;

    // Fallback: If no db records exist, simulate schedule for Ajay, Rahul, Vijay
    const barberKey = (bookingData?.barber || "").toLowerCase();
    const mockBusySlots = {
      "ajay": {
        "Today": ["11:00 AM", "4:00 PM"],
        "Tomorrow": ["1:00 PM"],
        "Day After": ["10:00 AM", "5:30 PM"]
      },
      "rahul": {
        "Today": ["10:00 AM", "2:30 PM"],
        "Tomorrow": ["4:00 PM", "5:30 PM"],
        "Day After": ["11:00 AM"]
      },
      "vijay": {
        "Today": ["1:00 PM", "5:30 PM"],
        "Tomorrow": ["10:00 AM", "2:30 PM"],
        "Day After": ["4:00 PM"]
      }
    };

    for (const [nameKey, datesMap] of Object.entries(mockBusySlots)) {
      if (barberKey.includes(nameKey)) {
        const busyTimes = datesMap[dateLabel] || [];
        if (busyTimes.includes(timeStr)) return true;
      }
    }

    return false;
  };

  const isSlotInPast = (date, time) => {
    if (date !== 'Today') return false;

    const now = new Date();
    const [timePart, modifier] = time.split(' ');
    let [hours, minutes] = timePart.split(':').map(Number);

    if (modifier === 'PM' && hours !== 12) {
      hours += 12;
    }
    if (modifier === 'AM' && hours === 12) {
      hours = 0;
    }

    const slotDate = new Date();
    slotDate.setHours(hours, minutes, 0, 0);

    return slotDate <= now;
  };

  const handleContinue = () => {
    if (selectedDate && selectedTime) {
      if (onNext) onNext(selectedDate, selectedTime);
    } else {
      alert("Please select both a date and a time slot.");
    }
  };

  const displayedSlots = timeSlots.filter(time => !isSlotBooked(selectedDate, time));

  return (
    <div className="max-w-xl mx-auto">
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
              onClick={() => {
                setSelectedDate(date);
                setSelectedTime(null);
              }}
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
        {loading ? (
          <p className="text-sm text-stone-400 font-semibold text-center py-4 animate-pulse">Loading availability slots...</p>
        ) : displayedSlots.length === 0 ? (
          <p className="text-sm font-semibold text-amber-700 bg-amber-50 border border-amber-150 rounded-xl p-4 text-center">
            No slots available for {selectedDate}. Please select another date.
          </p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {displayedSlots.map(time => {
              const isPast = isSlotInPast(selectedDate, time);
              return (
                <button 
                  key={time}
                  type="button"
                  disabled={isPast}
                  onClick={() => setSelectedTime(time)}
                  className={`p-3 rounded-xl font-bold border transition-all duration-200 text-sm text-center ${
                    isPast
                      ? 'border-stone-200 bg-stone-50 text-stone-300 cursor-not-allowed opacity-50'
                      : selectedTime === time 
                        ? 'border-[#C5A059] bg-[#FEF3E2] text-[#3E362E] shadow-sm font-black' 
                        : 'border-gray-200 text-gray-600 hover:border-[#C5A059] hover:text-[#C5A059]'
                  }`}
                >
                  {time}
                </button>
              );
            })}
          </div>
        )}
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