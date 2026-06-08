import React, { useState } from 'react';
import { Coffee, Clock, CalendarCheck, ShieldAlert, CheckCircle2, AlertCircle } from "lucide-react";

export default function BreakManagement() {
  // --- स्टेट्स ---
  const [lunchStart, setLunchStart] = useState('');
  const [lunchEnd, setLunchEnd] = useState('');
  const profile = { salonName: "Master Barber Lounge", initials: "MB" }; // प्रोफाइल डेटा

  const [requests, setRequests] = useState([
    { id: 1, type: 'Lunch Schedule', details: '01:00 PM - 02:00 PM', status: 'Approved' }
  ]);

  const [breakRequests, setBreakRequests] = useState([
    { id: 101, name: "Rahul S.", type: "Coffee Break", time: "02:00 PM", duration: "15m", status: "pending" },
    { id: 102, name: "Anita K.", type: "Short Break", time: "03:30 PM", duration: "10m", status: "approved" }
  ]);

  // --- हैंडल्स ---
  const handleLunchSubmit = (e) => {
    e.preventDefault();
    if (!lunchStart || !lunchEnd) return;
    const formatTime = (timeStr) => {
      const [hour, minute] = timeStr.split(':');
      const ampm = hour >= 12 ? 'PM' : 'AM';
      const formattedHour = hour % 12 || 12;
      return `${formattedHour}:${minute} ${ampm}`;
    };
    const newRequest = { id: Date.now(), type: 'Lunch Update', details: `${formatTime(lunchStart)} - ${formatTime(lunchEnd)}`, status: 'Pending' };
    setRequests([newRequest, ...requests]);
    setLunchStart(''); setLunchEnd('');
  };

  const handleApprove = (id) => {
    setBreakRequests(prev =>
      prev.map(req =>
        req.id === id
          ? { ...req, status: "approved" }
          : req
      )
    );
  };

  const handleReject = (id) => {
    setBreakRequests(prev =>
      prev.map(req =>
        req.id === id
          ? { ...req, status: "rejected" }
          : req
      )
    );
  };

  const getStatusBadge = (status) => {
    return status === 'Approved' ? (
      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[9px] font-black uppercase tracking-[0.2em] bg-emerald-50 text-emerald-700 border border-emerald-200/60 rounded-lg">
        <CheckCircle2 size={11} /> Approved
      </span>
    ) : (
      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[9px] font-black uppercase tracking-[0.2em] bg-amber-50 text-amber-700 border border-amber-200/60 rounded-lg">
        <AlertCircle size={11} /> Pending
      </span>
    );
  };

  const formInputStyle = "w-full p-3.5 border border-[#EADDCA] rounded-xl focus:outline-none focus:border-[#C5A059] bg-white font-medium text-xs text-[#3E362E] transition-all h-11";

  return (
    <div className="w-full text-[#3E362E] font-sans antialiased">
      <main className="max-w-5xl mx-auto w-full py-10">

        {/* HEADER */}
        <div className="mb-10 border-b border-[#EADDCA]/60 pb-6">
          <h1 className="text-3xl font-black tracking-tight text-stone-900 uppercase font-serif">Break <span className="text-[#C5A059]">Management</span></h1>
        </div>

        {/* 3-GRID LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

          {/* LUNCH & LONG BREAK FORMS */}
          <div className="lg:col-span-2 space-y-8">
            {/* LUNCH FORM */}
            <div className="bg-white/70 p-6 rounded-[22px] border border-[#EADDCA]">
              <h2 className="text-sm font-black uppercase mb-4">Daily Lunch</h2>
              <form onSubmit={handleLunchSubmit} className="space-y-4">
                <input type="time" required value={lunchStart} onChange={(e) => setLunchStart(e.target.value)} className={formInputStyle} />
                <input type="time" required value={lunchEnd} onChange={(e) => setLunchEnd(e.target.value)} className={formInputStyle} />
                <button type="submit" className="w-full bg-[#3E362E] text-[#C5A059] py-3 rounded-xl font-black text-[10px] uppercase">Request Change</button>
              </form>
            </div>
          </div>

          {/* BREAK REQUESTS FEED (The new component you provided) */}
          <div className="bg-white/80 backdrop-blur-md p-5 lg:col-span-2 rounded-[22px] border border-[#E6D5C3] shadow-[0_4px_20px_rgba(74,62,61,0.02)]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-serif font-black text-[#4A3E3D] text-sm uppercase">Break Requests</h3>
              <span className="w-5 h-5 rounded-full text-[10px] font-black flex items-center justify-center text-white bg-[#8B5A2B]">
                {breakRequests.filter(r => r.status === "pending").length}
              </span>
            </div>
            <div className="space-y-3">
              {breakRequests.map(r => (
                <div key={r.id} className="bg-[#FDFBF7]/60 p-3 rounded-xl border border-[#E6D5C3]/50">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <p className="text-[#4A3E3D] font-black text-sm font-serif">{r.name}</p>
                    {/* <span className={`text-[9px] font-black uppercase px-2 py-1 rounded-full border ${r.status === "pending" ? "text-amber-800 bg-amber-50" : "text-emerald-800 bg-emerald-50"}`}>{r.status}</span> */}
                    <span
                      className={`text-[9px] font-black uppercase px-2 py-1 rounded-full border ${r.status === "pending"
                          ? "text-amber-800 bg-amber-50"
                          : r.status === "approved"
                            ? "text-emerald-800 bg-emerald-50"
                            : "text-red-800 bg-red-50"
                        }`}
                    >
                      {r.status}
                    </span>
                  </div>
                  <p className="text-[11px] mb-0.5 text-stone-500 flex items-center gap-1">
                    <Coffee className="w-3 h-3 text-[#8B5A2B]" /> {r.type} · {r.time} ({r.duration})
                  </p>
                  {r.status === "pending" && (
                    <div className="flex gap-2 mt-2.5">
                      {/* <button className="flex-1 py-1.5 rounded-lg text-[10px] font-black text-white bg-emerald-700">Approve</button> */}

                      <button
                        onClick={() => handleApprove(r.id)}
                        className="flex-1 py-1.5 rounded-lg text-[10px] font-black text-white bg-emerald-700"
                      >
                        Approve
                      </button>
                      {/* <button className="flex-1 py-1.5 rounded-lg text-[10px] font-black text-red-700 bg-red-50 border border-red-200">Reject</button> */}

                      <button
                        onClick={() => handleReject(r.id)}
                        className="flex-1 py-1.5 rounded-lg text-[10px] font-black text-red-700 bg-red-50 border border-red-200"
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* STATUS HISTORY */}
        <div className="mt-10 bg-white/60 p-6 rounded-[22px] border border-[#EADDCA]">
          <h2 className="text-sm font-black uppercase mb-6">Request Status History</h2>
          <div className="space-y-3">
            {requests.map((req) => (
              <div key={req.id} className="flex justify-between p-4 border border-[#EADDCA]/40 rounded-xl bg-white/40">
                <div>
                  <p className="font-black text-[#3E362E]">{req.type}</p>
                  <p className="text-[10px] font-bold text-stone-400 uppercase">{req.details}</p>
                </div>
                {getStatusBadge(req.status)}
              </div>
            ))}
          </div>
        </div>

      </main>
    </div>
  );
}