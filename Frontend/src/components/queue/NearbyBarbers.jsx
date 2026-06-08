import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import * as Icons from "lucide-react";


/* ─────────────────────────────────────────────
   STEP INDICATOR
───────────────────────────────────────────── */
const StepBar = ({ step }) => (
  <div className="flex items-center gap-0 mb-8">
    {[
      { n: 1, label: "Pick Studio" },
      { n: 2, label: "Choose Service" },
      { n: 3, label: "Confirm Booking" },
    ].map(({ n, label }, i) => (
      <React.Fragment key={n}>
        <div className="flex items-center gap-2">
          <div
            className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-black transition-all duration-300 ${
              step >= n
                ? "bg-[#3E362E] text-[#C5A059] shadow-sm"
                : "bg-[#E8DCCB] text-[#B0A090]"
            }`}
          >
            {step > n ? "✓" : n}
          </div>
          <span
            className={`text-[10px] font-black uppercase tracking-widest transition-all ${
              step >= n ? "text-[#3E362E]" : "text-[#B0A090]"
            }`}
          >
            {label}
          </span>
        </div>
        {i < 2 && (
          <div
            className={`flex-1 h-px mx-3 transition-all duration-500 ${
              step > n ? "bg-[#C5A059]" : "bg-[#E8DCCB]"
            }`}
          />
        )}
      </React.Fragment>
    ))}
  </div>
);

/* ─────────────────────────────────────────────
   SALON CARD
───────────────────────────────────────────── */
const SalonCard = ({ salon, selected, onSelect }) => {
  const isSelected = selected?.id === salon.id;
  return (
    <button
      type="button"
      onClick={() => onSelect(salon)}
      className={`group w-full text-left rounded-2xl overflow-hidden border transition-all duration-300 cursor-pointer focus:outline-none ${
        isSelected
          ? "border-[#C5A059] shadow-[0_0_0_3px_rgba(197,160,89,0.18)] scale-[1.01]"
          : "border-[#E8DCCB] hover:border-[#C5A059]/60 hover:shadow-lg"
      } bg-white`}
    >
      {/* Image */}
      <div className="relative h-36 overflow-hidden bg-stone-100">
        <img
          src={salon.image}
          alt={salon.name}
          onError={(e) => {
            e.currentTarget.src =
              "https://images.unsplash.com/photo-1621605815841-aa33c5447a33?q=80&w=700";
          }}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />
        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          <span
            className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full ${
              salon.openNow
                ? "bg-emerald-100 text-emerald-700"
                : "bg-red-100 text-red-600"
            }`}
          >
            {salon.openNow ? "● Open Now" : "● Closed"}
          </span>
        </div>
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur px-2.5 py-1 rounded-lg flex items-center gap-1 shadow-sm">
          <Icons.Star size={10} className="fill-[#C5A059] text-[#C5A059]" />
          <span className="text-[11px] font-black text-stone-900">{salon.rating}</span>
          <span className="text-[9px] text-stone-400">({salon.reviews})</span>
        </div>
        {/* Selected overlay tick */}
        {isSelected && (
          <div className="absolute inset-0 bg-[#3E362E]/20 flex items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-[#C5A059] flex items-center justify-center shadow-lg">
              <Icons.Check size={22} className="text-white stroke-[3px]" />
            </div>
          </div>
        )}
      </div>

      {/* Body */}
      <div className="p-3">
        <h3 className="text-sm font-extrabold text-[#3E362E] tracking-tight leading-tight mb-1">
          {salon.name}
        </h3>
        <div className="flex items-center gap-1.5 text-stone-400 text-[10px] font-semibold mb-2">
          <Icons.MapPin size={10} className="text-[#C5A059] stroke-[2.5px] flex-shrink-0" />
          <span className="truncate">{salon.address}</span>
          <span className="text-[#C5A059] font-black ml-auto flex-shrink-0">
            {salon.distance}
          </span>
        </div>
        {/* Tags */}
        <div className="flex flex-wrap gap-1">
          {salon.tags.map((t) => (
            <span
              key={t}
              className="text-[8px] font-black uppercase tracking-wider bg-[#F8F4EE] text-[#8A7B6A] px-1.5 py-0.5 rounded border border-[#E8DCCB]"
            >
              {t}
            </span>
          ))}
        </div>
      </div>
    </button>
  );
};

/* ─────────────────────────────────────────────
   SERVICE CARD
───────────────────────────────────────────── */
const ServiceCard = ({ service, selected, onSelect }) => {
  const isSel = selected?.id === service.id;
  return (
    <button
      type="button"
      onClick={() => onSelect(service)}
      className={`group w-full text-left p-4 rounded-2xl border transition-all duration-200 cursor-pointer focus:outline-none ${
        isSel
          ? "border-[#C5A059] bg-[#FDF8F0] shadow-[0_0_0_3px_rgba(197,160,89,0.15)]"
          : "border-[#E8DCCB] bg-white hover:border-[#C5A059]/50 hover:bg-[#FDFAF6]"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-extrabold text-[#3E362E] tracking-tight">
              {service.name}
            </span>
            {service.popular && (
              <span className="text-[8px] font-black uppercase tracking-widest bg-[#C5A059]/15 text-[#A07830] px-2 py-0.5 rounded-full">
                Popular
              </span>
            )}
          </div>
          <div className="flex items-center gap-1 text-stone-400 text-[11px] font-semibold">
            <Icons.Clock size={10} className="stroke-[2.5px]" />
            {service.duration}
          </div>
        </div>
        <div className="flex flex-col items-end gap-2 flex-shrink-0">
          <span className="text-base font-black text-[#3E362E]">₹{service.price}</span>
          <div
            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
              isSel
                ? "border-[#C5A059] bg-[#C5A059]"
                : "border-[#D4C8B8] group-hover:border-[#C5A059]"
            }`}
          >
            {isSel && <Icons.Check size={11} className="text-white stroke-[3px]" />}
          </div>
        </div>
      </div>
    </button>
  );
};

/* ─────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────── */
const NearbyBarbers = () => {
  const [step, setStep] = useState(1);
  const [salons, setSalons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [locationError, setLocationError] = useState(null);
  const [selectedSalon, setSelectedSalon] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [bookingDone, setBookingDone] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);
  const sectionRef = useRef(null);
  const [services, setServices] = useState([]);

  /* fetch salons */
 useEffect(() => {
  const fetchSalons = async () => {
    try {
      setLoading(true);

      const API =
        import.meta.env.VITE_API_URL ||
        "http://localhost:5000/api";

      const response = await fetch(`${API}/salon`);
      const data = await response.json();
if (data.success) {
  const mapped = data.salons.map(s => ({
    ...s,
    id: s._id,
    name: s.salon_name,
    address: s.address || "Address not listed",
    image: s.images?.[0] || "",
    rating: s.rating || 4.5,
    reviews: s.total_reviews || 0,
    distance: "Nearby",
    openNow: true,
    tags: s.services_offered?.slice(0, 3) || ["Haircut", "Grooming"],
  }));
  setSalons(mapped);
}
    } catch (error) {
      console.error("Failed to fetch salons:", error);
    } finally {
      setLoading(false);
    }
  };

  fetchSalons();
}, []);
const handleSalonSelect = async (salon) => {
  setSelectedSalon(salon);
  setSelectedService(null);

  try {
    const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
    const response = await fetch(`${API}/services/${salon._id || salon.id}`);
    const data = await response.json();

    if (data.success) {
      const mapped = data.services.map(s => ({
        ...s,
        id: s._id,
        duration: `${s.duration} min`,
        popular: false,
      }));
      setServices(mapped);
    }
  } catch (error) {
    console.error("Failed to fetch services:", error);
  }
};


  const handleConfirmSalon = () => {
    if (!selectedSalon) return;
    setStep(2);
    setTimeout(
      () => sectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }),
      100
    );
  };

  const handleConfirmService = () => {
    if (!selectedService) return;
    setStep(3);
  };

const handleBook = async () => {
  try {
    setBookingLoading(true);

    const API =
      import.meta.env.VITE_API_URL ||
      "http://localhost:5000/api";

    const response = await fetch(`${API}/booking/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        salonId: selectedSalon._id,
        serviceId: selectedService.id,
      }),
    });

    const data = await response.json();

    if (data.success) {
      setBookingDone(true);
    }
  } catch (error) {
    console.error(error);
  } finally {
    setBookingLoading(false);
  }
};

  const handleReset = () => {
    setStep(1);
    setSelectedSalon(null);
    setSelectedService(null);
    setBookingDone(false);
  };


  return (
    <div ref={sectionRef} className="w-full">
      {/* ── SECTION WRAPPER ── */}
      <section className="py-6">
       <div className="w-full">

          {/* ── HEADER CARD ── */}
          <div className="bg-[#F8F4EE] border border-[#E8DCCB] rounded-3xl p-7 mb-7">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div>
                <p className="text-[10px] tracking-[0.3em] uppercase text-[#B58B67] font-black mb-1">
                  Book a Grooming Session
                </p>
                <h2 className="text-3xl font-black text-[#3E362E] tracking-tight leading-tight">
                  {step === 1
                    ? "Choose Your Studio"
                    : step === 2
                    ? `Services at ${selectedSalon?.name}`
                    : "Confirm Your Booking"}
                </h2>
                <p className="text-[#8A7B6A] text-sm mt-1.5 font-medium">
                  {step === 1
                    ? "Pick a nearby salon to begin your booking."
                    : step === 2
                    ? "Select the service you'd like to book."
                    : "Review and confirm your appointment."}
                </p>
              </div>

              {/* location pill */}
              <div className="flex-shrink-0">
                {locationError ? (
                  <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 px-3 py-2 rounded-xl text-[10px] font-bold text-amber-700 uppercase tracking-wider">
                    <Icons.AlertCircle size={12} />
                    {locationError}
                  </div>
                ) : (
                  <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 px-3 py-2 rounded-xl text-[10px] font-bold text-emerald-700 uppercase tracking-wider">
                    <Icons.Navigation size={12} />
                    Location Active
                  </div>
                )}
              </div>
            </div>

            {/* Step bar */}
            <div className="mt-6">
              <StepBar step={step} />
            </div>

            {/* Breadcrumb trail when salon selected */}
            {selectedSalon && (
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                <button
                  type="button"
                  onClick={handleReset}
                  className="text-[10px] font-black uppercase tracking-widest text-[#8A7B6A] hover:text-[#3E362E] transition-colors cursor-pointer flex items-center gap-1"
                >
                  <Icons.ChevronLeft size={12} />
                  All Studios
                </button>
                <span className="text-[#D4C8B8] text-xs">›</span>
                <span className="text-[10px] font-black uppercase tracking-widest text-[#C5A059]">
                  {selectedSalon.name}
                </span>
                {selectedService && step >= 3 && (
                  <>
                    <span className="text-[#D4C8B8] text-xs">›</span>
                    <span className="text-[10px] font-black uppercase tracking-widest text-[#3E362E]">
                      {selectedService.name}
                    </span>
                  </>
                )}
              </div>
            )}
          </div>

          {/* ══════════════════════════════
              STEP 1 — SALON SELECTION
          ══════════════════════════════ */}
          {step === 1 && (
            <>
              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                  {[1, 2, 3, 4].map((n) => (
                    <div
                      key={n}
                      className="h-[280px] bg-white border border-[#E8DCCB] animate-pulse rounded-2xl"
                    />
                  ))}
                </div>
              ) : (
                <>
                <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
                    {salons.map((salon) => (
  <SalonCard
    key={salon._id}
    salon={{
      id: salon._id,
      name: salon.salon_name,
      address: salon.address,
      image: salon.images?.[0] || "",
      rating: salon.rating || 4.5,
      reviews: salon.reviews || 0,
      openNow: true,
      tags: salon.tags || [],
    }}
    selected={selectedSalon}
    onSelect={handleSalonSelect}
  />
))}
                  </div>

                  {/* CTA */}
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={handleConfirmSalon}
                      disabled={!selectedSalon}
                      className={`flex items-center gap-2.5 px-8 py-4 rounded-xl font-black text-[11px] uppercase tracking-widest transition-all duration-300 ${
                        selectedSalon
                          ? "bg-[#3E362E] text-[#C5A059] hover:bg-[#2A241F] shadow-md active:scale-[0.98] cursor-pointer"
                          : "bg-[#E8DCCB] text-[#B0A090] cursor-not-allowed"
                      }`}
                    >
                      <Icons.Scissors size={13} className="stroke-[2.5px]" />
                      {selectedSalon
                        ? `Continue with ${selectedSalon.name}`
                        : "Select a Studio First"}
                      <Icons.ChevronRight size={14} />
                    </button>
                  </div>
                </>
              )}
            </>
          )}

          {/* ══════════════════════════════
              STEP 2 — SERVICE SELECTION
          ══════════════════════════════ */}
          {step === 2 && (
            <>
              {/* Selected salon summary strip */}
              <div className="flex items-center gap-4 bg-white border border-[#E8DCCB] rounded-2xl p-4 mb-6 shadow-sm">
                <img
                  src={selectedSalon.image}
                  alt={selectedSalon.name}
                  onError={(e) => {
                    e.currentTarget.src =
                      "https://images.unsplash.com/photo-1621605815841-aa33c5447a33?q=80&w=300";
                  }}
                  className="w-14 h-14 rounded-xl object-cover flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-black uppercase tracking-widest text-[#B58B67] mb-0.5">
                    Selected Studio
                  </p>
                  <h3 className="text-base font-extrabold text-[#3E362E] truncate">
                    {selectedSalon.name}
                  </h3>
                  <div className="flex items-center gap-3 text-[11px] text-stone-400 font-semibold mt-0.5">
                    <span className="flex items-center gap-1">
                      <Icons.MapPin size={10} className="text-[#C5A059]" />
                      {selectedSalon.distance}
                    </span>
                    <span className="flex items-center gap-1">
                      <Icons.Star size={10} className="fill-[#C5A059] text-[#C5A059]" />
                      {selectedSalon.rating} ({selectedSalon.reviews} reviews)
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-[10px] font-black uppercase tracking-widest text-[#8A7B6A] hover:text-[#3E362E] border border-[#E8DCCB] hover:border-[#3E362E] px-3 py-2 rounded-lg transition-all cursor-pointer flex-shrink-0"
                >
                  Change
                </button>
              </div>

              {/* Services grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
               {services.map((service) => (
  <ServiceCard
    key={service._id}
    service={{
      id: service._id,
      name: service.name,
      duration: `${service.duration} min`,
      price: service.price,
      popular: service.popular,
    }}
    selected={selectedService}
    onSelect={setSelectedService}
  />
))}
              </div>

              {/* CTAs */}
              <div className="flex items-center justify-between gap-4">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex items-center gap-2 px-5 py-3.5 rounded-xl border border-[#E8DCCB] text-[#8A7B6A] font-black text-[10px] uppercase tracking-widest hover:border-[#3E362E] hover:text-[#3E362E] transition-all cursor-pointer"
                >
                  <Icons.ChevronLeft size={13} />
                  Back
                </button>
                <button
                  type="button"
                  onClick={handleConfirmService}
                  disabled={!selectedService}
                  className={`flex items-center gap-2.5 px-8 py-4 rounded-xl font-black text-[11px] uppercase tracking-widest transition-all duration-300 ${
                    selectedService
                      ? "bg-[#3E362E] text-[#C5A059] hover:bg-[#2A241F] shadow-md active:scale-[0.98] cursor-pointer"
                      : "bg-[#E8DCCB] text-[#B0A090] cursor-not-allowed"
                  }`}
                >
                  <Icons.CalendarCheck size={13} className="stroke-[2.5px]" />
                  {selectedService
                    ? `Book ${selectedService.name}`
                    : "Select a Service First"}
                  <Icons.ChevronRight size={14} />
                </button>
              </div>
            </>
          )}

          {/* ══════════════════════════════
              STEP 3 — CONFIRM BOOKING
          ══════════════════════════════ */}
          {step === 3 && !bookingDone && (
            <div className="max-w-xl mx-auto">
              <div className="bg-white border border-[#E8DCCB] rounded-2xl overflow-hidden shadow-sm mb-5">
                {/* Header */}
                <div className="bg-[#F8F4EE] border-b border-[#E8DCCB] px-6 py-4">
                  <p className="text-[10px] font-black uppercase tracking-widest text-[#B58B67]">
                    Booking Summary
                  </p>
                </div>

                {/* Studio row */}
                <div className="flex items-center gap-4 px-6 py-5 border-b border-[#F0E8DC]">
                  <div className="w-10 h-10 rounded-xl bg-[#F8F4EE] flex items-center justify-center flex-shrink-0">
                    <Icons.Store size={18} className="text-[#C5A059] stroke-[2px]" />
                  </div>
                  <div className="flex-1">
                    <p className="text-[10px] font-black uppercase tracking-wider text-[#B58B67] mb-0.5">
                      Studio
                    </p>
                    <p className="text-sm font-extrabold text-[#3E362E]">
                      {selectedSalon?.name}
                    </p>
                    <p className="text-[11px] text-stone-400 font-medium">
                      {selectedSalon?.address} · {selectedSalon?.distance}
                    </p>
                  </div>
                </div>

                {/* Service row */}
                <div className="flex items-center gap-4 px-6 py-5 border-b border-[#F0E8DC]">
                  <div className="w-10 h-10 rounded-xl bg-[#F8F4EE] flex items-center justify-center flex-shrink-0">
                    <Icons.Scissors size={18} className="text-[#C5A059] stroke-[2px]" />
                  </div>
                  <div className="flex-1">
                    <p className="text-[10px] font-black uppercase tracking-wider text-[#B58B67] mb-0.5">
                      Service
                    </p>
                    <p className="text-sm font-extrabold text-[#3E362E]">
                      {selectedService?.name}
                    </p>
                    <p className="text-[11px] text-stone-400 font-medium">
                      {selectedService?.duration}
                    </p>
                  </div>
                  <span className="text-base font-black text-[#3E362E]">
                    ₹{selectedService?.price}
                  </span>
                </div>

                {/* Total */}
                <div className="flex items-center justify-between px-6 py-5">
                  <p className="text-sm font-black uppercase tracking-widest text-[#3E362E]">
                    Total
                  </p>
                  <p className="text-xl font-black text-[#C5A059]">
                    ₹{selectedService?.price}
                  </p>
                </div>
              </div>

              {/* CTAs */}
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="flex items-center gap-2 px-5 py-3.5 rounded-xl border border-[#E8DCCB] text-[#8A7B6A] font-black text-[10px] uppercase tracking-widest hover:border-[#3E362E] hover:text-[#3E362E] transition-all cursor-pointer flex-shrink-0"
                >
                  <Icons.ChevronLeft size={13} />
                  Back
                </button>
                <button
                  type="button"
                  onClick={handleBook}
                  disabled={bookingLoading}
                  className="flex-1 flex items-center justify-center gap-2.5 py-4 rounded-xl bg-[#3E362E] text-[#C5A059] font-black text-[11px] uppercase tracking-widest hover:bg-[#2A241F] shadow-md active:scale-[0.99] transition-all cursor-pointer disabled:opacity-70"
                >
                  {bookingLoading ? (
                    <>
                      <Icons.Loader2 size={14} className="animate-spin" />
                      Confirming…
                    </>
                  ) : (
                    <>
                      <Icons.CalendarCheck size={14} className="stroke-[2.5px]" />
                      Confirm Booking
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* ══════════════════════════════
              BOOKING SUCCESS STATE
          ══════════════════════════════ */}
          {bookingDone && (
            <div className="max-w-md mx-auto text-center py-10">
              <div className="w-20 h-20 rounded-full bg-emerald-50 border-2 border-emerald-200 flex items-center justify-center mx-auto mb-5">
                <Icons.CheckCircle2 size={40} className="text-emerald-500 stroke-[1.5px]" />
              </div>
              <h3 className="text-2xl font-black text-[#3E362E] mb-2">
                You're All Set!
              </h3>
              <p className="text-[#8A7B6A] text-sm mb-1 font-medium">
                <span className="font-extrabold text-[#3E362E]">{selectedService?.name}</span>{" "}
                at{" "}
                <span className="font-extrabold text-[#3E362E]">{selectedSalon?.name}</span>
              </p>
              <p className="text-[#B58B67] text-xs font-bold mb-8">
                Our team will confirm your slot shortly.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  type="button"
                  onClick={() => navigate("/appointments")}
                  className="flex items-center justify-center gap-2 px-6 py-3.5 bg-[#3E362E] text-[#C5A059] rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-[#2A241F] transition-all cursor-pointer shadow-md"
                >
                  <Icons.CalendarDays size={13} />
                  View Appointments
                </button>
                <button
                  type="button"
                  onClick={handleReset}
                  className="flex items-center justify-center gap-2 px-6 py-3.5 border border-[#E8DCCB] text-[#8A7B6A] rounded-xl font-black text-[10px] uppercase tracking-widest hover:border-[#3E362E] hover:text-[#3E362E] transition-all cursor-pointer"
                >
                  <Icons.RefreshCw size={13} />
                  Book Again
                </button>
              </div>
            </div>
          )}

        </div>
      </section>
    </div>
  );
};

export default NearbyBarbers;