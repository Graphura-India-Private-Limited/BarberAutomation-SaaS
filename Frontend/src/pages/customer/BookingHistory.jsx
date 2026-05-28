import React, { useState, useEffect } from 'react';
import { Calendar, CheckCircle, Clock, RotateCcw, XCircle, DollarSign, Sparkles, TrendingUp } from 'lucide-react';
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";

export default function BookingHistory() {
  const [activeTab, setActiveTab] = useState('upcoming');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Mock Data 
  const mockBookings = [
    {
      id: 'BKG-001',
      date: 'May 2, 2026 • 10:00 AM',
      salon: 'Graphura Premier League',
      service: 'Haircut and Beard combo',
      amountPaid: 350,
      status: 'upcoming'
    },
    {
      id: 'BKG-002',
      date: 'April 15, 2026 • 02:30 PM',
      salon: 'Graphura Premier League',
      service: 'Premium Haircut',
      amountPaid: 250,
      status: 'completed'
    },
    {
      id: 'BKG-003',
      date: 'March 20, 2026 • 11:00 AM',
      salon: 'Elite Scissors',
      service: 'Beard Grooming',
      amountPaid: 150,
      status: 'completed'
    }
  ];

  // Calculate stats values on the fly
  const totalVisits = mockBookings.filter(b => b.status === 'completed').length;
  const totalSpent = mockBookings.filter(b => b.status === 'completed').reduce((sum, b) => sum + b.amountPaid, 0);

  const displayedBookings = mockBookings.filter(booking => booking.status === activeTab);

  return (
    <>
      <Navbar />
      <div className="bg-[#FAF6F0] min-h-screen font-sans text-[#3E362E] selection:bg-[#C5A059] selection:text-white relative overflow-hidden flex flex-col">
        
        {/* --- SHINY LUXURY GRADIENT GLOW LAYERS --- */}
        <div className="absolute top-20 -left-40 w-[600px] h-[600px] bg-gradient-to-br from-[#C5A059]/10 via-[#EADDCA]/20 to-transparent rounded-full blur-[120px] pointer-events-none animate-pulse duration-[8000ms]" />
        <div className="absolute bottom-1/3 right-10 w-[700px] h-[500px] bg-[#EADDCA]/30 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-[500px] h-[500px] bg-[#C5A059]/10 rounded-full blur-[100px] pointer-events-none" />

        {/* Premium Hero Banner Aura */}
        <div className="relative h-[220px] sm:h-[260px] flex items-center justify-center overflow-hidden mb-2">
          <div className="absolute inset-0 bg-gradient-to-b from-[#EADDCA]/20 via-transparent to-[#FAF6F0]" />
          
          <div className="relative z-10 text-center px-4 max-w-3xl mx-auto pt-6">
            <span className="text-[10px] font-black uppercase tracking-[0.4em] bg-white/80 backdrop-blur-md border border-[#EADDCA] px-4 py-1.5 rounded-full text-[#C5A059] shadow-sm inline-block mb-4">
              Dashboard Overview
            </span>
            <h1 className="text-4xl sm:text-5xl font-black uppercase tracking-tight text-[#3E362E] font-serif leading-none">
              My <span className="text-[#C5A059] italic normal-case">Bookings</span>
            </h1>
            <p className="text-stone-500 font-sans text-xs font-light tracking-wide mt-3 max-w-sm mx-auto">
              Manage your upcoming appointments and view past bespoke visits.
            </p>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 relative z-10 flex-grow w-full">
          
          {/* 📊 Summary Metrics Strip */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-white/80 backdrop-blur-md border border-[#EADDCA] rounded-2xl p-4 shadow-[0_8px_25px_rgba(0,0,0,0.01)] flex flex-col justify-between">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[9px] font-black uppercase tracking-wider text-stone-400 block">Total Visits</span>
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
              </div>
              <span className="text-2xl font-black text-[#3E362E] font-serif">{totalVisits}</span>
            </div>

            <div className="bg-white/80 backdrop-blur-md border border-[#EADDCA] rounded-2xl p-4 shadow-[0_8px_25px_rgba(0,0,0,0.01)] flex flex-col justify-between">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[9px] font-black uppercase tracking-wider text-stone-400 block">Total Expended</span>
                <DollarSign className="w-3.5 h-3.5 text-[#C5A059]" />
              </div>
              <span className="text-2xl font-black text-[#3E362E] font-serif">₹{totalSpent}</span>
            </div>

            <div className="bg-white/80 backdrop-blur-md border border-[#EADDCA] rounded-2xl p-4 shadow-[0_8px_25px_rgba(0,0,0,0.01)] flex flex-col justify-between truncate">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[9px] font-black uppercase tracking-wider text-stone-400 block">Fav Service</span>
                <TrendingUp className="w-3.5 h-3.5 text-amber-600" />
              </div>
              <span className="text-xs font-black text-[#C5A059] uppercase tracking-wide block mt-1 truncate">
                Premium Haircut
              </span>
            </div>
          </div>

          {/* 📑 Custom Luxury Tabs */}
          <div className="flex space-x-2 bg-white/60 backdrop-blur-md p-1.5 rounded-2xl shadow-sm border border-[#EADDCA] mb-8">
            <button
              type="button"
              onClick={() => setActiveTab('upcoming')}
              className={`flex-1 py-3 px-4 rounded-xl font-black text-[11px] tracking-[0.15em] uppercase transition-all duration-300 cursor-pointer select-none ${
                activeTab === 'upcoming'
                  ? 'bg-[#3E362E] text-white shadow-md'
                  : 'text-stone-500 hover:text-[#3E362E] hover:bg-[#FAF6F0]'
              }`}
            >
              Upcoming
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('completed')}
              className={`flex-1 py-3 px-4 rounded-xl font-black text-[11px] tracking-[0.15em] uppercase transition-all duration-300 cursor-pointer select-none ${
                activeTab === 'completed'
                  ? 'bg-[#3E362E] text-white shadow-md'
                  : 'text-stone-500 hover:text-[#3E362E] hover:bg-[#FAF6F0]'
              }`}
            >
              Completed History
            </button>
          </div>

          {/* Booking Cards List */}
          <div className="space-y-6">
            {displayedBookings.length === 0 ? (
              <div className="text-center py-16 bg-white/60 backdrop-blur-md rounded-3xl border border-dashed border-[#EADDCA] px-4">
                <p className="text-stone-400 font-light text-xs">No {activeTab} booking logs available.</p>
              </div>
            ) : (
              displayedBookings.map((booking) => (
                <div 
                  key={booking.id} 
                  className={`bg-white/90 backdrop-blur-md rounded-[24px] border border-[#EADDCA] shadow-[0_8px_25px_rgba(0,0,0,0.01)] hover:shadow-[0_15px_35px_rgba(62,54,46,0.05)] hover:-translate-y-0.5 transition-all duration-300 overflow-hidden text-left ${
                    activeTab === 'completed' ? 'border-l-4 border-l-[#C5A059]' : 'border-l-4 border-l-[#3E362E]'
                  }`}
                >
                  {/* Upper Card Grid Structure */}
                  <div className="p-6 flex flex-col sm:flex-row justify-between items-start gap-4">
                    <div>
                      <span className="text-[10px] font-black text-[#C5A059] uppercase tracking-widest bg-[#C5A059]/10 px-2.5 py-1 rounded-md inline-block mb-2">
                        {booking.date}
                      </span>
                      <h3 className="text-xl font-serif font-bold text-[#3E362E] mt-1">{booking.salon}</h3>
                      <p className="text-[9px] text-stone-400 font-mono mt-1 uppercase tracking-wider">ID: {booking.id}</p>
                    </div>
                    
                    <div className="sm:text-right flex sm:flex-col items-start sm:items-end justify-between w-full sm:w-auto gap-2 border-t sm:border-none border-[#FAF6F0] pt-3 sm:pt-0">
                      <div>
                        <div className="text-[9px] text-stone-400 uppercase tracking-wider font-black mb-0.5">Amount Transacted</div>
                        <div className="text-2xl font-serif font-black text-[#3E362E]">₹{booking.amountPaid}</div>
                      </div>

                      {/* UI Status Badges */}
                      {booking.status === 'completed' ? (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[9px] font-black bg-emerald-50 text-emerald-800 border border-emerald-200 uppercase tracking-widest shadow-3xs">
                          Completed
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[9px] font-black bg-amber-50 text-amber-800 border border-amber-200 uppercase tracking-widest shadow-3xs">
                          Confirmed Slot
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Card Divider Line */}
                  <div className="border-t border-[#FAF6F0]" />
                  
                  {/* Lower Footer Area */}
                  <div className="bg-[#FAF6F0]/50 px-6 py-4 flex justify-between items-center text-stone-600 gap-4">
                    <div className="flex items-center gap-2 min-w-0">
                      {booking.status === 'completed' ? (
                        <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                      ) : (
                        <Clock className="w-4 h-4 text-[#C5A059] flex-shrink-0 animate-pulse" />
                      )}
                      <span className="text-xs text-stone-500 truncate">
                        Ritual Allocation: <strong className="text-[#3E362E] font-bold">{booking.service}</strong>
                      </span>
                    </div>
                    
                    {/* Status Aware Dynamic CTA Links */}
                    {activeTab === 'upcoming' ? (
                      <button 
                        type="button" 
                        className="flex-shrink-0 flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-red-500 hover:text-red-700 transition-colors cursor-pointer select-none"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Cancel Visit</span>
                      </button>
                    ) : (
                      <button 
                        type="button" 
                        className="flex-shrink-0 flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-[#3E362E] hover:text-[#C5A059] transition-colors cursor-pointer group select-none"
                      >
                        <RotateCcw className="w-3.5 h-3.5 group-hover:rotate-45 transition-transform duration-300" />
                        <span>Rebook</span>
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

        </div>
      </div>
      <Footer />
    </>
  );
}