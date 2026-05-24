import React, { useState } from 'react';

export default function BookingHistory() {
  const [activeTab, setActiveTab] = useState('upcoming');

  // mock data 
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
    <div className="min-h-screen bg-[#FAF6F0] py-10 px-4 font-sans text-gray-800">
      <div className="max-w-3xl mx-auto">
        
        {/* Header */}
        <div className="mb-8 text-left">
          <h3 className="font-black text-5xl font-serif tracking-wide text-gray-900">My Bookings</h3>
          <p className="text-stone-500 font-sans normal-case mt-2">Manage your upcoming appointments and view past visits.</p>
        </div>

        {/* 📊 ADDED: Summary Metrics Strip */}
        <div className="grid grid-cols-3 gap-4 mb-8 text-left">
          <div className="bg-white/60 border border-stone-200/50 rounded-2xl p-4 shadow-2xs">
            <span className="text-[10px] font-black uppercase tracking-wider text-stone-400 block mb-1">Total Visits</span>
            <span className="text-2xl font-black text-stone-900">{totalVisits}</span>
          </div>
          <div className="grid-cols-1 bg-white/60 border border-stone-200/50 rounded-2xl p-4 shadow-2xs">
            <span className="text-[10px] font-black uppercase tracking-wider text-stone-400 block mb-1">Total Expended</span>
            <span className="text-2xl font-black text-stone-900">₹{totalSpent}</span>
          </div>
          <div className="bg-white/60 border border-stone-200/50 rounded-2xl p-4 shadow-2xs truncate">
            <span className="text-[10px] font-black uppercase tracking-wider text-stone-400 block mb-1">Fav Service</span>
            <span className="text-sm font-black text-[#C5A059] uppercase tracking-wide block mt-1.5 truncate">Premium Haircut</span>
          </div>
        </div>

        {/* 📑 Custom Tabs */}
        <div className="flex space-x-2 bg-white p-1.5 rounded-xl shadow-xs border border-stone-200/40 mb-8">
          <button
            type="button"
            onClick={() => setActiveTab('upcoming')}
            className={`flex-1 py-3 px-4 rounded-lg font-bold text-sm transition-all duration-200 cursor-pointer ${
              activeTab === 'upcoming'
                ? 'bg-[#3E362E] text-white shadow-md'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            Upcoming
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('completed')}
            className={`flex-1 py-3 px-4 rounded-lg font-bold text-sm transition-all duration-200 cursor-pointer ${
              activeTab === 'completed'
                ? 'bg-[#3E362E] text-white shadow-md'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            Completed History
          </button>
        </div>

        {/* Booking Cards List */}
        <div className="space-y-4">
          {displayedBookings.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl border border-stone-200/40 shadow-xs">
              <p className="text-gray-500 font-medium">No {activeTab} bookings found.</p>
            </div>
          ) : (
            displayedBookings.map((booking) => (
              <div 
                key={booking.id} 
                className={`bg-white rounded-2xl border border-stone-100 shadow-xs hover:shadow-md transition-all overflow-hidden text-left ${
                  activeTab === 'completed' ? 'border-l-4 border-l-[#A37B58]' : 'border-l-4 border-l-[#3E362E]'
                }`}
              >
                {/* Upper Body Area */}
                <div className="p-6 flex justify-between items-start gap-4">
                  <div>
                    <span className="text-xs font-black text-[#C5A059] uppercase tracking-wider">
                      {booking.date}
                    </span>
                    <h3 className="text-xl font-bold text-gray-900 mt-1">{booking.salon}</h3>
                    <p className="text-[10px] text-stone-400 font-mono mt-1 uppercase tracking-wider">{booking.id}</p>
                  </div>
                  
                  <div className="text-right flex flex-col items-end gap-1.5">
                    <div>
                      <div className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold leading-none mb-1">Amount Paid</div>
                      <div className="text-xl font-black text-stone-900 leading-none">₹{booking.amountPaid}</div>
                    </div>

                    {/* DYNAMIC UI STATUS BADGES */}
                    {booking.status === 'completed' ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-[9px] font-black bg-green-50 text-green-700 border border-green-200/50 uppercase tracking-wider">
                        Completed
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-[9px] font-black bg-amber-50 text-amber-700 border border-amber-200/50 uppercase tracking-wider">
                        Confirmed
                      </span>
                    )}
                  </div>
                </div>

                {/* Card Divider */}
                <div className="border-t border-stone-100" />
                
                {/* Lower Footer Area (Receipt Format Style Layout) */}
                <div className="bg-stone-50/60 px-6 py-4 flex justify-between items-center text-gray-600">
                  <div className="flex items-center gap-2">
                    {/* Dynamic Status Icons */}
                    {booking.status === 'completed' ? (
                      <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4 text-[#C5A059]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    )}
                    <span className="text-sm text-stone-600">
                      Service: <strong className="text-stone-900 font-bold">{booking.service}</strong>
                    </span>
                  </div>
                  
                  {/* Action Buttons based on status context */}
                  {activeTab === 'upcoming' ? (
                    <button type="button" className="text-xs font-black uppercase tracking-widest text-red-500 hover:text-red-700 transition-colors cursor-pointer">
                      Cancel Visit
                    </button>
                  ) : (
                    <button type="button" className="flex items-center gap-1 text-xs font-black uppercase tracking-widest text-[#A37B58] hover:text-[#3E362E] transition-colors cursor-pointer group">
                      Rebook
                      <svg className="w-3 h-3 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
}