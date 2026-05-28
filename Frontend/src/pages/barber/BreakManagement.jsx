import React, { useState } from 'react';
import { Coffee, Clock, CalendarCheck, ShieldAlert, CheckCircle2, AlertCircle, ArrowLeft } from "lucide-react";


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

    const formatTime = (timeStr) => {
      const [hour, minute] = timeStr.split(':');
      const ampm = hour >= 12 ? 'PM' : 'AM';
      const formattedHour = hour % 12 || 12;
      return `${formattedHour}:${minute} ${ampm}`;
    };

    const newRequest = {
      id: Date.now(),
      type: 'Lunch Update',
      details: `${formatTime(lunchStart)} - ${formatTime(lunchEnd)}`,
      status: 'Pending'
    };
    setRequests([newRequest, ...requests]);
    setLunchStart('');
    setLunchEnd('');
  };

  const handleBreakSubmit = (e) => {
    e.preventDefault();
    if (!breakStart || !breakDuration) return;

    const formatTime = (timeStr) => {
      const [hour, minute] = timeStr.split(':');
      const ampm = hour >= 12 ? 'PM' : 'AM';
      const formattedHour = hour % 12 || 12;
      return `${formattedHour}:${minute} ${ampm}`;
    };

    const newRequest = {
      id: Date.now(),
      type: 'Long Break',
      details: `${breakDuration} Mins at ${formatTime(breakStart)}`,
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
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[9px] font-black uppercase tracking-[0.2em] bg-emerald-50 text-emerald-700 border border-emerald-200/60 rounded-lg">
          <CheckCircle2 size={11} className="stroke-[2.5px]" />
          Approved
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[9px] font-black uppercase tracking-[0.2em] bg-amber-50 text-amber-700 border border-amber-200/60 rounded-lg">
        <AlertCircle size={11} className="stroke-[2.5px]" />
        Pending
      </span>
    );
  };

  const formInputStyle = "w-full p-3.5 border border-[#EADDCA] rounded-xl focus:outline-none focus:border-[#C5A059] focus:shadow-[0_0_0_4px_rgba(197,160,89,0.08)] bg-white font-medium text-xs text-[#3E362E] placeholder-stone-400 transition-all duration-300 h-11";

  return (
    <div className="min-h-screen bg-[#FAF6F0] text-[#3E362E] font-sans antialiased flex flex-col selection:bg-[#C5A059] selection:text-white relative overflow-hidden">
      

      {/* Luxury Background Ambient Glows */}
      <div className="absolute top-24 left-0 w-80 h-80 bg-[#C5A059]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-40 right-0 w-96 h-96 bg-[#EADDCA]/30 rounded-full blur-3xl pointer-events-none" />

      {/* MAIN CONTENT AREA */}
      <main className="max-w-5xl mx-auto w-full px-4 sm:px-6 py-10 flex-1 text-left relative z-10">

        {/* PAGE DESCRIPTIVE HERO LAYER */}
        <div className="mb-10 border-b border-[#EADDCA]/60 pb-6">
          <h1 className="text-3xl font-black tracking-tight text-stone-900 uppercase font-serif">
            Break <span className="text-[#C5A059]">Management</span>
          </h1>
          <p className="text-[10px] font-black uppercase tracking-[0.15em] text-[#C5A059] mt-1">
            Submit Schedule Intervals & Absences to Salon Owner
          </p>
        </div>

        {/* INTERACTIVE REQUEST ACTIONS CARDS HOLDER */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* 🥪 LUNCH SETUP CONTAINER */}
          <div className="bg-white/70 backdrop-blur-md p-6 rounded-[22px] border border-[#EADDCA] shadow-[0_15px_40px_rgba(0,0,0,0.01)] flex flex-col justify-between hover:bg-white transition-all duration-500">
            <div>
              <div className="flex items-center gap-2.5 mb-6 border-b border-[#EADDCA]/40 pb-4">
                <Coffee className="text-[#C5A059]" size={18} />
                <h2 className="text-sm font-black uppercase tracking-[0.15em] text-[#3E362E]">Daily Lunch Schedule</h2>
              </div>
              
              <form onSubmit={handleLunchSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[9px] font-black uppercase tracking-[0.2em] text-stone-400 pl-0.5">Start Time</label>
                    <input 
                      type="time" 
                      required
                      value={lunchStart}
                      onChange={(e) => setLunchStart(e.target.value)}
                      className={formInputStyle}
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[9px] font-black uppercase tracking-[0.2em] text-stone-400 pl-0.5">End Time</label>
                    <input 
                      type="time" 
                      required
                      value={lunchEnd}
                      onChange={(e) => setLunchEnd(e.target.value)}
                      className={formInputStyle}
                    />
                  </div>
                </div>
                
                <button type="submit" className="w-full bg-[#3E362E] hover:bg-[#2A241F] text-[#C5A059] font-black text-[10px] uppercase tracking-[0.2em] py-4 rounded-xl transition duration-300 shadow-xs cursor-pointer mt-2">
                  Request Schedule Change
                </button>
              </form>
            </div>
          </div>

          {/* ⏱️ LONG BREAK FORM PANEL CONTAINER */}
          <div className="bg-white/70 backdrop-blur-md p-6 rounded-[22px] border border-[#EADDCA] shadow-[0_15px_40px_rgba(0,0,0,0.01)] flex flex-col justify-between hover:bg-white transition-all duration-500">
            <div>
              <div className="flex items-center gap-2.5 mb-6 border-b border-[#EADDCA]/40 pb-4">
                <Clock className="text-[#C5A059]" size={18} />
                <h2 className="text-sm font-black uppercase tracking-[0.15em] text-[#3E362E]">Request Long Break</h2>
              </div>

              <form onSubmit={handleBreakSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[9px] font-black uppercase tracking-[0.2em] text-stone-400 pl-0.5">Start Time</label>
                    <input 
                      type="time" 
                      required
                      value={breakStart}
                      onChange={(e) => setBreakStart(e.target.value)}
                      className={formInputStyle}
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[9px] font-black uppercase tracking-[0.2em] text-stone-400 pl-0.5">Duration (Mins)</label>
                    <input 
                      type="number" 
                      min="30"
                      required
                      value={breakDuration}
                      onChange={(e) => setBreakDuration(e.target.value)}
                      className={formInputStyle}
                      placeholder="e.g. 45"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] font-black uppercase tracking-[0.2em] text-stone-400 pl-0.5">Reason (Optional)</label>
                  <input 
                    type="text" 
                    value={breakReason}
                    onChange={(e) => setBreakReason(e.target.value)}
                    className={formInputStyle}
                    placeholder="Doctor appointment, personal errand..."
                  />
                </div>

                <button type="submit" className="w-full bg-[#3E362E] hover:bg-[#2A241F] text-[#C5A059] font-black text-[10px] uppercase tracking-[0.2em] py-4 rounded-xl transition duration-300 shadow-xs cursor-pointer">
                  Submit For Approval
                </button>
              </form>
            </div>
          </div>

        </div>

        {/* 📜 HISTORICAL MONITOR STATUS QUEUE FLOW PANEL */}
        <div className="bg-white/60 backdrop-blur-md p-6 rounded-[22px] border border-[#EADDCA] shadow-[0_15px_40px_rgba(0,0,0,0.01)] mt-10">
          <div className="flex items-center gap-2.5 mb-6 border-b border-[#EADDCA]/40 pb-4">
            <CalendarCheck className="text-[#C5A059]" size={18} />
            <h2 className="text-sm font-black uppercase tracking-[0.15em] text-[#3E362E]">Request Status History</h2>
          </div>

          <div className="space-y-3">
            {requests.map((req) => (
              <div key={req.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 border border-[#EADDCA]/40 rounded-xl bg-white/40 hover:bg-white transition-all duration-300 gap-3">
                <div className="text-left">
                  <p className="font-black text-[#3E362E] text-base leading-none mb-2">{req.type}</p>
                  <p className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">{req.details}</p>
                </div>
                <div className="flex sm:justify-end">
                  {getStatusBadge(req.status)}
                </div>
              </div>
            ))}
          </div>

          {/* Quick Informational Notice Seam Guard */}
          <div className="flex items-start gap-3 rounded-xl bg-[#FAF6F0] border border-[#EADDCA]/60 p-4 text-xs text-stone-500 mt-6 leading-relaxed">
            <ShieldAlert size={15} className="shrink-0 text-[#C5A059] mt-0.5" />
            <span className="font-medium">
              Approved breaks sync live with the client booking portal. Active client reservation slots will dynamically close to safeguard your schedule layout.
            </span>
          </div>
        </div>

      </main>
     

    </div>
  );
}