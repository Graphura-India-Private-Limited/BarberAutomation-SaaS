import React, { useState } from 'react';

export default function BreakManagement() {
  // --- STATE FOR LUNCH TIMING ---
  const [lunchStart, setLunchStart] = useState('');
  const [lunchEnd, setLunchEnd] = useState('');

  // --- STATE FOR LONG BREAKS ---
  const [breakStart, setBreakStart] = useState('');
  const [breakDuration, setBreakDuration] = useState('');
  const [breakReason, setBreakReason] = useState('');

  // --- MOCK DATABASE FOR REQUESTS ---
  const [requests, setRequests] = useState([
    { id: 1, type: 'Lunch Schedule', details: '1:00 PM - 2:00 PM', status: 'Approved' }
  ]);

  // --- SUBMIT HANDLERS (MOCKING THE BACKEND) ---
  const handleLunchSubmit = (e) => {
    e.preventDefault();
    const newRequest = {
      id: Date.now(),
      type: 'Lunch Update',
      details: `${lunchStart} to ${lunchEnd}`,
      status: 'Pending Owner Approval'
    };
    setRequests([newRequest, ...requests]);
    setLunchStart('');
    setLunchEnd('');
  };

  const handleBreakSubmit = (e) => {
    e.preventDefault();
    const newRequest = {
      id: Date.now(),
      type: 'Long Break',
      details: `${breakDuration} mins at ${breakStart}`,
      status: 'Pending Owner Approval'
    };
    setRequests([newRequest, ...requests]);
    setBreakStart('');
    setBreakDuration('');
    setBreakReason('');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 font-sans text-gray-800">
      <div className="max-w-4xl mx-auto space-y-8">
        
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Break Management</h1>
          <p className="text-gray-500 mt-2">Submit schedule changes and break requests to the salon owner.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* --- 8.1 LUNCH TIME SETUP CARD --- */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Daily Lunch Schedule</h2>
            <form onSubmit={handleLunchSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                <input 
                  type="time" 
                  required
                  value={lunchStart}
                  onChange={(e) => setLunchStart(e.target.value)}
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-salonGold focus:border-salonGold outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
                <input 
                  type="time" 
                  required
                  value={lunchEnd}
                  onChange={(e) => setLunchEnd(e.target.value)}
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-salonGold focus:border-salonGold outline-none"
                />
              </div>
              <button type="submit" className="w-full bg-gray-900 text-white font-bold py-3 rounded-lg hover:bg-gray-800 transition">
                Request Schedule Change
              </button>
            </form>
          </div>

          {/* --- 8.4 LONG BREAK REQUEST CARD --- */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Request Long Break ({'>'}30m)</h2>
            <form onSubmit={handleBreakSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                  <input 
                    type="time" 
                    required
                    value={breakStart}
                    onChange={(e) => setBreakStart(e.target.value)}
                    className="w-full p-3 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-salonGold"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Duration (Mins)</label>
                  <input 
                    type="number" 
                    min="30"
                    required
                    value={breakDuration}
                    onChange={(e) => setBreakDuration(e.target.value)}
                    className="w-full p-3 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-salonGold"
                    placeholder="e.g. 45"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Reason (Optional)</label>
                <input 
                  type="text" 
                  value={breakReason}
                  onChange={(e) => setBreakReason(e.target.value)}
                  className="w-full p-3 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-salonGold"
                  placeholder="Doctor appointment, personal errand..."
                />
              </div>
              <button type="submit" className="w-full bg-gray-900 text-white font-bold py-3 rounded-lg hover:bg-gray-800 transition">
                Submit for Approval
              </button>
            </form>
          </div>
        </div>

        {/* --- REQUEST HISTORY & STATUS --- */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mt-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Request Status</h2>
          <div className="space-y-3">
            {requests.map((req) => (
              <div key={req.id} className="flex items-center justify-between p-4 border border-gray-100 rounded-lg bg-gray-50">
                <div>
                  <p className="font-bold text-gray-900">{req.type}</p>
                  <p className="text-sm text-gray-500">{req.details}</p>
                </div>
                <span className={`px-3 py-1 text-sm font-bold rounded-full ${
                  req.status === 'Approved' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {req.status}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
// ... UI Return statement will go here