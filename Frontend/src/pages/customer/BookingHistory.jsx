import React, { useState} from 'react';
export default function BookingHistory(){
    const[activeTab, setActiveTab]= useState('upcoming')

    //mock data 
    const mockBookings= [
        {
            id: 'BKG-001',
            date:'May 2, 2026• 10:00 AM',
            salon:'Graphura Premier League',
            service:'Haircut and Beard combo',
            amountPaid:350,
            status: 'upcoming'



        },
        {
            id: 'BKG-002',
            date:'April 15,2026 • 02:30 PM',
            salon:'Graphura Premier League',
            service:'Premium Haircut',
            amountPaid:250,
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
    const displayedBookings= mockBookings.filter(booking => booking.status === activeTab);

return (
    <div className="min-h-screen bg-orange-50 py-10 px-4 font-sans text-gray-800">
      <div className="max-w-3xl mx-auto">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Bookings</h1>
          <p className="text-gray-500 mt-2">Manage your upcoming appointments and view past visits.</p>
        </div>

        {/* Custom Tabs */}
        <div className="flex space-x-2 bg-white p-1 rounded-xl shadow-sm border border-gray-100 mb-8">
          <button
            onClick={() => setActiveTab('upcoming')}
            className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all duration-200 ${
              activeTab === 'upcoming'
                ? 'bg-salonGold text-white shadow-md'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            Upcoming
          </button>
          <button
            onClick={() => setActiveTab('completed')}
            className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all duration-200 ${
              activeTab === 'completed'
                ? 'bg-salonGold text-white shadow-md'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            Completed History
          </button>
        </div>

        {/* Booking Cards List */}
        <div className="space-y-4">
          {displayedBookings.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl border border-gray-100 shadow-sm">
              <p className="text-gray-500 font-medium">No {activeTab} bookings found.</p>
            </div>
          ) : (
            displayedBookings.map((booking) => (
              <div key={booking.id} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-4 border-b border-gray-50 pb-4">
                  <div>
                    <span className="text-sm font-bold text-salonGold uppercase tracking-wider">
                      {booking.date}
                    </span>
                    <h3 className="text-xl font-bold text-gray-900 mt-1">{booking.salon}</h3>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-500">Amount Paid</div>
                    <div className="text-lg font-black text-gray-900">₹{booking.amountPaid}</div>
                  </div>
                </div>
                
                <div className="flex justify-between items-center text-gray-600">
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                    </svg>
                    <span className="font-medium">{booking.service}</span>
                  </div>
                  
                  {/* Action Buttons based on status */}
                  {activeTab === 'upcoming' ? (
                    <button className="text-sm font-semibold text-red-500 hover:text-red-700 transition-colors">
                      Cancel
                    </button>
                  ) : (
                    <button className="text-sm font-semibold text-salonGold hover:text-yellow-600 transition-colors">
                      Rebook
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