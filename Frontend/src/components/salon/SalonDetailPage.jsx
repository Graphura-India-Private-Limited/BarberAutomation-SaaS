import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../layout/Header"; 
import Footer from "../../components/layout/Footer";

import {
  ArrowLeft, // Used for the floating action overlay button
  CalendarClock,
  Clock,
  MapPin,
  Phone,
  Scissors,
  ShieldCheck,
  Star,
} from "lucide-react";

const demoSalons = [
  {
    id: "1",
    name: "The Royal Groom",
    address: "MG Road, Nashik",
    phone: "+91 98765 43210",
    rating: 4.9,
    reviews: 128,
    distance: "0.8 km",
    image:
      "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?q=80&w=1400",
    hours: "10:00 AM - 9:00 PM",
  },
  {
    id: "2",
    name: "Vintage Scissors",
    address: "College Road, Nashik",
    phone: "+91 98765 44321",
    rating: 4.7,
    reviews: 96,
    distance: "1.5 km",
    image:
      "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?q=80&w=1400",
    hours: "9:30 AM - 8:30 PM",
  },
  {
    id: "3",
    name: "Urban Edge Barber",
    address: "Gangapur Road, Nashik",
    phone: "+91 98765 45432",
    rating: 4.5,
    reviews: 82,
    distance: "2.3 km",
    image:
      "https://img.magnific.com/free-photo/handsome-man-barber-shop-styling-hair_1303-20978.jpg?semt=ais_hybrid&w=740&q=80",
    hours: "10:30 AM - 9:30 PM",
  },
];

const services = [
  { name: "Classic Haircut", duration: "30 min", price: "Rs. 249" },
  { name: "Beard Trim & Shape", duration: "20 min", price: "Rs. 149" },
  { name: "Hair Spa", duration: "45 min", price: "Rs. 599" },
  { name: "Premium Grooming", duration: "60 min", price: "Rs. 899" },
];

export default function SalonDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  
  // Find matching salon dynamically or fall back to the first item
  const salon = demoSalons.find((item) => item.id === id) || demoSalons[0];

  return (
    <main className="min-h-screen bg-[#FAF6F0] text-[#1A1612] font-sans antialiased flex flex-col">
      
      {/* ✂️ GLOBAL SHARED NAV HEADER PANEL */}
      <Header 
        subtitle="Studio Profile Details" 
        rightElement={
          <div className="flex items-center gap-4">
            
            {/* Separator line visible only on desktop */}
            <div className="hidden md:block h-4 w-[1px] bg-stone-700" />

            {/* 🔗 Action 2: Premium Share Native Action Toggle Button */}
            <button 
              type="button"
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                alert("Studio profile link copied to clipboard!");
              }}
              className="flex items-center gap-2 bg-[#A37B58] hover:bg-[#8F6947] text-white px-4 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all cursor-pointer shadow-xs active:scale-[0.98]"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 10.742l4.574-2.286m0 5.088l-4.574-2.286M16 12a3 3 0 11-6 0 3 3 0 016 0zM4 6a3 3 0 11-6 0 3 3 0 016 0zm0 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Share Studio
            </button>

          </div>
        }
      />

      {/* 📸 HERO CONTENT IMAGE DISPLAY */}
      <section className="relative min-h-[60vh] overflow-hidden flex-shrink-0">
        <img
          src={salon.image}
          alt={salon.name}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1A1612] via-[#1A1612]/60 to-transparent" />

        {/* ── ✅ FLOATING BACK BUTTON MOUNTED NATIVELY ON IMAGE CANVAS ── */}
        <div className="absolute top-6 left-6 sm:left-8 lg:left-10 z-30">
          <button
            type="button"
            onClick={() => navigate(-1)} // Takes user back cleanly to the discovery workspace radar loop
            className="w-10 h-10 rounded-full flex items-center justify-center bg-black/30 backdrop-blur-md border border-white/20 text-white shadow-lg transition-all duration-300 hover:bg-white hover:text-stone-900 hover:scale-105 active:scale-95 group cursor-pointer"
          >
            <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-0.5" />
          </button>
        </div>

        <div className="relative mx-auto flex min-h-[60vh] max-w-7xl flex-col justify-end px-6 pb-12 pt-24 sm:px-8 lg:px-10">
          <div className="max-w-3xl text-white text-left">
            <div className="mb-4 flex flex-wrap items-center gap-3 text-xs font-black uppercase tracking-wider">
              <span className="inline-flex items-center gap-1.5 rounded-lg bg-white px-3 py-2 text-stone-900 shadow-sm">
                <Star size={14} className="fill-[#C5A059] text-[#C5A059]" />
                {salon.rating} ({salon.reviews} reviews)
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-lg bg-black/40 px-3 py-2 backdrop-blur-md border border-white/10">
                <MapPin size={14} className="text-[#C5A059]" />
                {salon.distance} away
              </span>
            </div>

            <h1 className="font-serif text-4xl font-black leading-tight sm:text-6xl tracking-tight">
              {salon.name}
            </h1>
            <p className="mt-4 max-w-xl text-sm font-medium text-stone-200/90 leading-relaxed sm:text-base">
              Premium grooming, reliable queue updates, and quick booking in one
              polished studio experience.
            </p>
          </div>
        </div>
      </section>

      {/* 🧱 DATA PROFILE DETAILS LAYOUT COLUMNS GRID */}
      <section className="mx-auto grid max-w-7xl w-full gap-8 px-6 py-10 sm:px-8 lg:grid-cols-[1.25fr_0.75fr] lg:px-10 flex-1">
        <div className="space-y-8">
          {/* Quick Context Details InfoTiles */}
          <div className="grid gap-4 sm:grid-cols-3">
            <InfoTile icon={MapPin} label="Address" value={salon.address} />
            <InfoTile icon={Clock} label="Hours" value={salon.hours} />
            <InfoTile icon={Phone} label="Phone" value={salon.phone} />
          </div>

          {/* Core Menu Panel List */}
          <div className="rounded-2xl border border-stone-200/60 bg-white p-6 shadow-xs text-left">
            <div className="mb-5 flex items-center gap-3 border-b border-stone-100 pb-4">
              <Scissors className="text-[#A37B58]" size={20} />
              <h2 className="text-xl font-black uppercase tracking-tight text-stone-900">Popular Menu Services</h2>
            </div>

            <div className="divide-y divide-stone-100">
              {services.map((service) => (
                <div
                  key={service.name}
                  className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between transition-all"
                >
                  <div>
                    <h3 className="font-extrabold text-stone-900 text-base">{service.name}</h3>
                    <p className="text-xs font-semibold text-stone-400 uppercase mt-0.5 tracking-wider">{service.duration}</p>
                  </div>
                  <div className="flex items-center justify-between sm:justify-end gap-6">
                    <span className="font-black text-stone-900 font-mono text-sm">
                      {service.price}
                    </span>
                    <button
                      type="button"
                      onClick={() => navigate("/customer/barber")}
                      className="rounded-xl bg-[#3E362E] hover:bg-[#2A241F] text-white font-black text-[10px] uppercase tracking-widest px-5 py-3 transition shadow-xs cursor-pointer"
                    >
                      Book
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 📑 FIXED FLOATING RIGHT SIDEBAR ANCHOR */}
        <aside className="rounded-2xl border border-stone-200/60 bg-white p-6 shadow-xs lg:sticky lg:top-24 lg:self-start text-left">
          <div className="mb-4 flex items-center gap-3 border-b border-stone-100 pb-3">
            <CalendarClock className="text-[#A37B58]" size={20} />
            <h2 className="text-lg font-black uppercase tracking-tight text-stone-900">Book Your Visit</h2>
          </div>
          <p className="mb-6 text-xs font-medium leading-relaxed text-stone-500">
            Select a service and barber, then reserve your slot with a small
            token payment.
          </p>
          <button
            type="button"
            onClick={() => navigate("/customer/services")}
            className="w-full rounded-xl bg-[#3E362E] hover:bg-[#2A241F] px-5 py-4 text-xs font-black uppercase tracking-widest text-white shadow-md transition-all active:scale-[0.99] cursor-pointer"
          >
            Choose Services
          </button>
          <div className="flex items-start gap-3 rounded-xl bg-[#FAF7F2] border border-stone-200/40 p-4 text-xs text-stone-600 mt-4">
            <ShieldCheck size={16} className="shrink-0 text-[#C5A059]" />
            <span className="font-medium leading-normal">Verified salon profile with appointment logs and live smart queue support.</span>
          </div>
        </aside>
      </section>
      <Footer/>
    </main>
  );
}

function InfoTile({ icon: Icon, label, value }) {
  return (
    <div className="rounded-2xl border border-stone-200/60 bg-white p-5 shadow-xs text-left">
      <Icon className="mb-3 text-[#A37B58]" size={20} />
      <p className="text-[10px] font-black uppercase tracking-widest text-stone-400">
        {label}
      </p>
      <p className="mt-2 font-extrabold text-stone-900 text-sm leading-snug">{value}</p>
    </div>
  );
}