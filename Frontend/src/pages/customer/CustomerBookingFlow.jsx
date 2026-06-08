import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Home } from 'lucide-react';
import SlotSelection from '../../components/booking/SlotSelection';
import BookingForm from '../../components/booking/BookingForm';
import ConfirmationPage from '../../components/booking/ConfirmationPage';
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";

const GOLD = "#C5A059";
const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export default function Wrapper() {
  const navigate = useNavigate();
  const location = useLocation();

  // Extract query parameters if redirecting from dummy catalog
  const queryParams = new URLSearchParams(location.search);
  const querySvcId = queryParams.get("svcId");
  const queryPrice = queryParams.get("price");

  // Extract router state if navigating from Men's/Women's/Addon services
  const { service, barber, customer } = location.state || {};

  // Setup initial booking data state
  const [bookingData, setBookingData] = useState(() => {
    let serviceName = "Classic Haircut & Beard Styling";
    let price = 500;
    let serviceId = null;
    let barberName = "Barber Ajay";
    let barberId = null;

    if (service) {
      serviceName = service.name || serviceName;
      price = service.price || price;
      serviceId = service._id || service.id || null;
    } else if (querySvcId) {
      serviceId = querySvcId;
      const dummyMap = {
        s1: "Classic Haircut",
        s2: "Taper Fade & Trim",
        s3: "Beard Sculpting & Oil",
        s4: "Luxury Hot Stone Shave",
        s5: "Charcoal Face Mask",
        s6: "Organic Hair Color",
        s7: "Royal Head Massage",
        s8: "Deep Conditioning Shampoo"
      };
      serviceName = dummyMap[querySvcId] || "Premium Grooming Service";
      price = queryPrice ? parseInt(queryPrice, 10) : price;
    }

    if (barber) {
      barberName = barber.name || barberName;
      barberId = barber._id || barber.id || null;
    }

    return {
      service: serviceName,
      price: price,
      service_id: serviceId,
      barber: barberName,
      barber_id: barberId,
      date: null,
      time: null,
    };
  });

  const [currentStep, setCurrentStep] = useState(3); 

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentStep]);

  const handleSlotSelected = (date, selectedTime) => {
    setBookingData({ ...bookingData, date, time: selectedTime });
    setCurrentStep(4);
  };

  const handleBookingConfirmed = async (updatedDetails) => {
    let finalBookingData = { ...bookingData };
    if (updatedDetails) {
      finalBookingData = { ...finalBookingData, ...updatedDetails };
      setBookingData(finalBookingData);
    }

    const token = localStorage.getItem("token");
    if (!token) {
      console.log("No authorization token found. Proceeding with dummy confirmation.");
      setCurrentStep(5);
      return;
    }

    try {
      // 1. Fetch approved salons from backend
      const salonsRes = await fetch(`${API}/salon`);
      const salonsData = await salonsRes.json();
      if (!salonsData.success || !salonsData.salons || salonsData.salons.length === 0) {
        throw new Error("No approved salons found in system.");
      }
      
      const storedSalonId = localStorage.getItem("selectedSalonId");
      let salon = salonsData.salons[0];
      if (storedSalonId) {
        const found = salonsData.salons.find(s => s._id === storedSalonId);
        if (found) salon = found;
      }
      const salonId = salon._id;

      // 2. Fetch services for this salon from backend
      const servicesRes = await fetch(`${API}/services/${salonId}`);
      const servicesData = await servicesRes.json();
      let matchedServiceId = null;
      let matchedPrice = finalBookingData.price || 200;

      if (servicesData.success && servicesData.services && servicesData.services.length > 0) {
        const match = servicesData.services.find(
          s => s.name.toLowerCase().includes(finalBookingData.service.toLowerCase()) || 
               finalBookingData.service.toLowerCase().includes(s.name.toLowerCase())
        );
        if (match) {
          matchedServiceId = match._id;
          matchedPrice = match.price;
        } else {
          matchedServiceId = servicesData.services[0]._id;
          matchedPrice = servicesData.services[0].price;
        }
      }

      if (!matchedServiceId) {
        let allServices = [];
        for (const sln of salonsData.salons) {
          try {
            const fallbackRes = await fetch(`${API}/services/${sln._id}`);
            const fallbackData = await fallbackRes.json();
            if (fallbackData.success && fallbackData.services) {
              allServices.push(...fallbackData.services);
            }
          } catch (e) {
            console.error(e);
          }
        }
        // Prioritize premium active salon
        allServices.sort((a, b) => {
          if (a.salon_id === b.salon_id) return 0;
          if (a.salon_id === "6a23177862fa6d8d2c894a3c") return -1;
          if (b.salon_id === "6a23177862fa6d8d2c894a3c") return 1;
          return 0;
        });

        let match = allServices.find(
          s => s.name.toLowerCase().includes(finalBookingData.service.toLowerCase()) || 
               finalBookingData.service.toLowerCase().includes(s.name.toLowerCase())
        );
        if (!match) {
          const words = finalBookingData.service.toLowerCase().split(/\s+/);
          match = allServices.find(s => words.some(w => w.length > 3 && s.name.toLowerCase().includes(w)));
        }
        if (match) {
          matchedServiceId = match._id;
          matchedPrice = match.price;
        } else if (allServices.length > 0) {
          matchedServiceId = allServices[0]._id;
          matchedPrice = allServices[0].price;
        }
      }

      // 3. Fetch barbers for this salon from backend
      const barbersRes = await fetch(`${API}/barber/salon/${salonId}`);
      const barbersData = await barbersRes.json();
      let matchedBarberId = null;

      const getDistributedBarberId = (barberList, mockBarberName, mockBarberId) => {
        if (!barberList || barberList.length === 0) return null;
        
        // 0. Try direct database ID match first
        if (mockBarberId) {
          const directMatch = barberList.find(b => String(b._id) === String(mockBarberId) || String(b.id) === String(mockBarberId));
          if (directMatch) return directMatch._id;
        }
        
        // 1. Try exact/partial name match
        let match = barberList.find(
          b => b.name.toLowerCase().includes(mockBarberName.toLowerCase()) || 
               mockBarberName.toLowerCase().includes(b.name.toLowerCase())
        );
        if (match) return match._id;

        // 2. Try first name match
        const firstName = mockBarberName.toLowerCase().split(" ")[0];
        match = barberList.find(b => b.name.toLowerCase().includes(firstName));
        if (match) return match._id;

        // 3. Map to distinct database barbers by selected mock ID modulo
        const mockId = parseInt(mockBarberId, 10);
        if (!isNaN(mockId)) {
          const index = (mockId - 1) % barberList.length;
          return barberList[index >= 0 ? index : 0]._id;
        }

        // 4. Default fallback
        return barberList[0]._id;
      };

      if (barbersData.success && barbersData.barbers && barbersData.barbers.length > 0) {
        matchedBarberId = getDistributedBarberId(barbersData.barbers, finalBookingData.barber, finalBookingData.barber_id);
      }

      if (!matchedBarberId) {
        let allBarbers = [];
        for (const sln of salonsData.salons) {
          try {
            const fallbackRes = await fetch(`${API}/barber/salon/${sln._id}`);
            const fallbackData = await fallbackRes.json();
            if (fallbackData.success && fallbackData.barbers) {
              allBarbers.push(...fallbackData.barbers);
            }
          } catch (e) {
            console.error(e);
          }
        }
        // Prioritize premium active salon
        allBarbers.sort((a, b) => {
          if (a.salon_id === b.salon_id) return 0;
          if (a.salon_id === "6a23177862fa6d8d2c894a3c") return -1;
          if (b.salon_id === "6a23177862fa6d8d2c894a3c") return 1;
          return 0;
        });

        matchedBarberId = getDistributedBarberId(allBarbers, finalBookingData.barber, finalBookingData.barber_id);
      }

      if (!matchedServiceId) {
        throw new Error("Could not map to a valid service in DB.");
      }

      // 4. Construct formatted slot time
      let formattedSlot = null;
      if (finalBookingData.date && finalBookingData.time) {
        let bookingDateObj = new Date();
        if (finalBookingData.date === "Tomorrow") {
          bookingDateObj.setDate(bookingDateObj.getDate() + 1);
        } else if (finalBookingData.date === "Day After") {
          bookingDateObj.setDate(bookingDateObj.getDate() + 2);
        }
        
        let dateStr = bookingDateObj.toISOString().split("T")[0];
        let timeStr = finalBookingData.time; // e.g. "10:00 AM" or "2:30 PM"
        
        let [timePart, modifier] = timeStr.split(" ");
        let [hours, minutes] = timePart.split(":");
        if (hours === "12") hours = "00";
        if (modifier === "PM") hours = parseInt(hours, 10) + 12;
        hours = String(hours).padStart(2, "0");
        
        formattedSlot = `${dateStr}T${hours}:${minutes}:00.000Z`;
      } else {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        formattedSlot = `${tomorrow.toISOString().split("T")[0]}T11:00:00.000Z`;
      }

      // 5. Post booking payload to backend
      const payload = {
        salon_id: salonId,
        barber_id: matchedBarberId,
        booking_type: "slot",
        services: [{ service_id: matchedServiceId, member_name: "Self" }],
        slot_time: formattedSlot
      };

      console.log("Submitting online booking payload:", payload);
      const bookingRes = await fetch(`${API}/booking`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const bookingResult = await bookingRes.json();
      if (bookingResult.success && bookingResult.booking) {
        console.log("Booking successfully recorded in database:", bookingResult.booking);
        // Inject DB-created booking values to state for confirmation page
        setBookingData(prev => ({
          ...prev,
          _id: bookingResult.booking._id,
          bookingId: bookingResult.booking._id,
          price: matchedPrice
        }));
      } else {
        console.warn("Failed backend response. Proceeding with local state fallback.", bookingResult.message);
      }
    } catch (err) {
      console.error("Booking API pipeline error. Falling back to local offline mode.", err.message);
    } finally {
      setCurrentStep(5);
    }
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
    const token = localStorage.getItem("token");
    navigate(token ? "/dashboard" : "/");
  };

  const handleHeaderBackAction = () => {
    const token = localStorage.getItem("token");
    if (currentStep === 3) {
      navigate(token ? "/dashboard" : "/");
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