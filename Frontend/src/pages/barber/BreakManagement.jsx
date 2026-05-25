import React, { useState } from 'react';
import Navbar from "../../components/layout/Navbar";
import { Coffee, Clock, CalendarCheck, ShieldAlert, CheckCircle2, AlertCircle } from "lucide-react";

export default function BreakManagement() {
  // --- STATE FOR LUNCH TIMING ---
  const [lunchStart, setLunchStart] = useState('');
  const [lunchEnd, setLunchEnd] = useState('');

  // --- STATE FOR LONG BREAKS ---
  const [breakStart, setBreakStart] = useState('');
  const [breakDuration, setBreakDuration] = useState('');
  const [breakReason, setBreakReason] = useState('');

  // --- REQUESTS RECORD DATA ---
  const [requests, setRequests] = useState([
    { id: 1, type: 'Lunch Schedule', details: '01:00 PM - 02:00 PM', status: 'Approved' }
  ]);

  // --- SUBMIT HANDLERS ---
  const handleLunchSubmit = (e) => {
    e.preventDefault();
    if (!lunchStart || !lunchEnd) return;

    const newRequest = {
      id: Date.now(),
      type: 'Lunch Update',
      details: `${lunchStart} to ${lunchEnd}`,
      status: 'Pending'
    };
    setRequests([newRequest, ...requests]);
    setLunchStart('');
    setLunchEnd('');
  };

  const handleBreakSubmit = (e) => {
    e.preventDefault();
    if (!breakStart || !breakDuration) return;

    const newRequest = {
      id: Date.now(),
      type: 'Long Break',
      details: `${breakDuration} Mins at ${breakStart}`,
      status: 'Pending'
    };
    setRequests([newRequest, ...requests]);
    setBreakStart('');
    setBreakDuration('');
    setBreakReason('');
  };

  // Status Badge Mapper Utility
  const getStatusBadge = (status) => {
    if (status === 'Approved') {
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg shadow-3xs">
          <CheckCircle2 size={12} className="stroke-[2.5px]" />
          Approved
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest bg-amber-50 text-amber-700 border border-amber-200 rounded-lg shadow-3xs">
        <AlertCircle size={12} className="stroke-[2.5px]" />
        Pending
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-[#FAF6F0] text-stone-800 font-sans antialiased flex flex-col">
      <Navbar />

      <main className="max-w-5xl mx-auto w-full px-6 py-10 flex-1 text-left">
        
        {/* PAGE DESCRIPTIVE HERO LAYER */}
        <div className="mb-10 border-b border-stone-200/60 pb-6">
          <h1 className="text-3xl font-extrabold tracking-tight text-stone-900 uppercase">
            Break Management
          </h1>
          <p className="text-xs font-black uppercase tracking-widest text-[#A37B58] mt-1.5">
            Submit Schedule Intervals & Absences to Salon Owner
          </p>
        </div>

        {/* INTERACTIVE REQUEST ACTIONS CARDS HOLDER */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* 🥪 LUNCH SETUP CONTAINER */}
          <div className="bg-white p-6 rounded-2xl border border-stone-200/50 shadow-3xs flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2.5 mb-5 border-b border-stone-50 pb-3">
                <Coffee className="text-[#A37B58]" size={20} />
                <h2 className="text-lg font-black uppercase tracking-tight text-stone-900">Daily Lunch Schedule</h2>
              </div>
              
              <form onSubmit={handleLunchSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-stone-400 pl-0.5">Start Time</label>
                    <input 
                      type="time" 
                      required
                      value={lunchStart}
                      onChange={(e) => setLunchStart(e.target.value)}
                      className="w-full p-3.5 border border-stone-200 rounded-xl focus:outline-none focus:border-stone-900 bg-[#FAF6F0]/30 font-semibold h-11"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-stone-400 pl-0.5">End Time</label>
                    <input 
                      type="time" 
                      required
                      value={lunchEnd}
                      onChange={(e) => setLunchEnd(e.target.value)}
                      className="w-full p-3.5 border border-stone-200 rounded-xl focus:outline-none focus:border-stone-900 bg-[#FAF6F0]/30 font-semibold h-11"
                    />
                  </div>
                </div>
                
                <button type="submit" className="w-full bg-[#3E362E] hover:bg-[#2A241F] text-[#C5A059] font-black text-xs uppercase tracking-widest py-4 rounded-xl transition shadow-xs cursor-pointer mt-2">
                  Request Schedule Change
                </button>
              </form>
            </div>
          </div>

          {/* ⏱️ LONG BREAK FORM PANEL CONTAINER */}
          <div className="bg-white p-6 rounded-2xl border border-stone-200/50 shadow-3xs flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2.5 mb-5 border-b border-stone-50 pb-3">
                <Clock className="text-[#A37B58]" size={20} />
                <h2 className="text-lg font-black uppercase tracking-tight text-stone-900">Request Long Break (&gt;30m)</h2>
              </div>

              <form onSubmit={handleBreakSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-stone-400 pl-0.5">Start Time</label>
                    <input 
                      type="time" 
                      required
                      value={breakStart}
                      onChange={(e) => setBreakStart(e.target.value)}
                      className="w-full p-3.5 border border-stone-200 rounded-xl focus:outline-none focus:border-stone-900 bg-[#FAF6F0]/30 font-semibold h-11"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-stone-400 pl-0.5">Duration (Mins)</label>
                    <input 
                      type="number" 
                      min="30"
                      required
                      value={breakDuration}
                      onChange={(e) => setBreakDuration(e.target.value)}
                      className="w-full p-3.5 border border-stone-200 rounded-xl focus:outline-none focus:border-stone-900 bg-[#FAF6F0]/30 font-semibold h-11"
                      placeholder="e.g. 45"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-stone-400 pl-0.5">Reason (Optional)</label>
                  <input 
                    type="text" 
                    value={breakReason}
                    onChange={(e) => setBreakReason(e.target.value)}
                    className="w-full p-3.5 border border-stone-200 rounded-xl focus:outline-none focus:border-stone-900 bg-[#FAF6F0]/30 font-semibold h-11"
                    placeholder="Doctor appointment, personal errand..."
                  />
                </div>

                <button type="submit" className="w-full bg-[#3E362E] hover:bg-[#2A241F] text-[#C5A059] font-black text-xs uppercase tracking-widest py-4 rounded-xl transition shadow-xs cursor-pointer">
                  Submit For Approval
                </button>
              </form>
            </div>
          </div>

        </div>

        {/* 📜 HISTORICAL MONITOR STATUS QUEUE FLOW PANEL */}
        <div className="bg-white p-6 rounded-2xl border border-stone-200/50 shadow-3xs mt-10">
          <div className="flex items-center gap-2.5 mb-5 border-b border-stone-50 pb-3">
            <CalendarCheck className="text-[#A37B58]" size={20} />
            <h2 className="text-xl font-black uppercase tracking-tight text-stone-900">Request Status</h2>
          </div>

          <div className="space-y-4">
            {requests.map((req) => (
              <div key={req.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 border border-stone-200/40 rounded-xl bg-[#FAF6F0]/30 hover:bg-stone-50/60 transition-colors gap-3">
                <div className="text-left">
                  <p className="font-extrabold text-stone-900 text-base">{req.type}</p>
                  <p className="text-xs font-bold text-stone-400 uppercase tracking-wider mt-0.5">{req.details}</p>
                </div>
                <div className="flex sm:justify-end">
                  {getStatusBadge(req.status)}
                </div>
              </div>
            ))}
          </div>

          {/* Quick Informational Notice Seam Guard */}
          <div className="flex items-start gap-3 rounded-xl bg-[#FAF7F2] border border-stone-200/40 p-4 text-xs text-stone-600 mt-6">
            <ShieldAlert size={16} className="shrink-0 text-[#C5A059] mt-0.5" />
            <span className="font-medium leading-normal">
              Approved breaks sync live with the client booking portal. Active client reservation slots will dynamically close to safeguard your schedule layout.
            </span>
          </div>
        </div>

      </main>
    </div>
  );
}