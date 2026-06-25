import React, { useState } from 'react';

export default function BookingForm({ bookingData, onBack, onConfirm }) {
  const [mobile, setMobile] = useState('');
  const [attendees, setAttendees] = useState([
    { id: 1, name: '', type: 'Primary' }
  ]);

  const handleAddFamilyMember = () => {
    setAttendees([
      ...attendees, 
      { id: Date.now(), name: '', type: 'Family Member' }
    ]);
  };

  const handleRemoveFamilyMember = (id) => {
    setAttendees(attendees.filter(member => member.id !== id));
  };

  const handleNameChange = (id, newName) => {
    setAttendees(attendees.map(member => 
      member.id === id ? { ...member, name: newName } : member
    ));
  };

  const tokenTotal = attendees.length * 50;

  const handleSubmit = (e) => {
    e.preventDefault();
    onConfirm({ mobile, attendees }); 
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center mb-8 pb-4 border-b">
        <button type="button" onClick={onBack} className="text-gray-400 hover:text-stone-700 transition-colors mr-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>
        <h2 className="text-2xl font-bold text-gray-900">Confirm Details</h2>
      </div>

      {/* 🧾 Booking Summary Panel (FIXED: Replaced unconfigured bg-salonBg with light theme container) */}
      <div className="bg-[#FEF3E2] bg-opacity-40 p-6 rounded-xl mb-8 border border-[#FEF3E2]">
        <h3 className="font-bold text-[#3E362E] mb-4 text-sm uppercase tracking-wider">Booking Summary</h3>
        <div className="space-y-3 text-sm text-gray-600">
          <div className="flex justify-between"><span className="text-stone-500">Service:</span> <span className="font-bold text-gray-900">{bookingData.service}</span></div>
          <div className="flex justify-between"><span className="text-stone-500">Professional:</span> <span className="font-bold text-gray-900">{bookingData.barber}</span></div>
          <div className="flex justify-between"><span className="text-stone-500">Date & Time:</span> <span className="font-bold text-gray-900">{bookingData.date} at {bookingData.time}</span></div>
          <div className="flex justify-between"><span className="text-stone-500">Total People:</span> <span className="font-bold text-gray-900">{attendees.length}</span></div>
          
          <div className="border-t border-stone-200 mt-3 pt-3 flex justify-between items-center border-dashed">
            <span className="text-stone-500 font-medium">Token Payment to Confirm:</span> 
            <span className="font-black text-xl text-stone-900">₹{tokenTotal}</span>
          </div>
        </div>
      </div>

      {/* Dynamic Multi-User Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Primary Mobile Number</label>
          <input 
            type="tel" name="mobile" required
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            className="w-full border border-gray-300 px-4 py-3 rounded-xl focus:ring-2 focus:ring-[#C5A059] focus:border-[#C5A059] outline-none transition-all" 
            placeholder="10-digit mobile number for SMS updates"
          />
        </div>

        <div className="space-y-3 mt-6">
          <div className="flex justify-between items-end mb-2">
            <label className="block text-sm font-semibold text-gray-700">Attendees</label>
            <button 
              type="button" 
              onClick={handleAddFamilyMember}
              className="text-sm text-[#C5A059] hover:text-stone-800 font-bold flex items-center gap-1 transition-colors"
            >
              <span>+ Add Family Member</span>
            </button>
          </div>

          {attendees.map((member, index) => (
            <div key={member.id} className="flex gap-3 items-center">
              <div className="flex-grow">
                <input 
                  type="text" required
                  value={member.name}
                  onChange={(e) => handleNameChange(member.id, e.target.value)}
                  className="w-full border border-gray-300 px-4 py-3 rounded-xl focus:ring-2 focus:ring-[#C5A059] focus:border-[#C5A059] outline-none transition-all" 
                  placeholder={`Name of ${member.type}`}
                />
              </div>
              
              {index > 0 && (
                <button 
                  type="button"
                  onClick={() => handleRemoveFamilyMember(member.id)}
                  className="p-3 text-red-500 hover:bg-red-50 rounded-xl transition-colors border border-transparent hover:border-red-100"
                  title="Remove"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              )}
            </div>
          ))}
        </div>

        {/* 🏁 FIXED SUBMIT BUTTON: Hardcoded premium background */}
        <button 
          type="submit" 
          className="w-full bg-[#3E362E] hover:bg-[#2A241F] text-white py-4 rounded-xl font-bold text-lg shadow-md transition-all duration-200 mt-8 cursor-pointer"
        >
          Proceed to Checkout
        </button>
      </form>
    </div>
  );
}