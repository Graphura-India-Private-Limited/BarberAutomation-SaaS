import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Coffee, Clock, CalendarCheck, ShieldAlert, CheckCircle2, AlertCircle, ChevronDown, Check } from "lucide-react";

function CustomDropdown({ label, value, onChange, options }) {
  const [isOpen, setIsOpen] = useState(false);
  const selected = options.find(o => o.value === value) || options[0];

  return (
    <div className="relative flex-1 text-left">
      <label className="block text-[11px] font-extrabold uppercase tracking-widest text-[#C5A059] mb-1.5 pl-0.5 font-sans">
        {label}
      </label>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-3.5 py-3 border border-[#EADDCA] rounded-xl bg-white text-xs font-semibold text-[#3E362E] cursor-pointer h-11 focus:outline-none focus:border-[#C5A059] transition-all font-sans"
      >
        <span>{selected.label}</span>
        <ChevronDown size={14} className={`text-[#C5A059] transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute left-0 right-0 mt-1.5 bg-white border border-[#C5A059]/30 rounded-xl shadow-lg overflow-hidden z-50 max-h-60 overflow-y-auto animate-in fade-in slide-in-from-top-1 duration-150">
            {options.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  onChange(opt.value);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center justify-between px-4 py-3 text-xs border-b border-[#EADDCA]/20 last:border-0 hover:bg-[#FAF6F0] transition-colors text-left cursor-pointer font-bold ${
                  value === opt.value ? 'text-[#8B5A2B] bg-[#8B5A2B]/5 font-extrabold' : 'text-stone-700 font-medium'
                }`}
              >
                <span>{opt.label}</span>
                {value === opt.value && <Check size={12} className="text-[#8B5A2B]" />}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export default function BreakManagement() {
  const navigate = useNavigate();
  const isBarber = localStorage.getItem("role") === "barber";
  const barberId = localStorage.getItem("barberId");
  const salonId = localStorage.getItem("salonId");
  const token = localStorage.getItem("token");

  // --- स्टेट्स ---
  const [lunchStart, setLunchStart] = useState('');
  const [lunchEnd, setLunchEnd] = useState('');
  
  // Short Break Form states
  const [breakType, setBreakType] = useState('Coffee Break');
  const [duration, setDuration] = useState('15');
  const [reason, setReason] = useState('');

  const [requests, setRequests] = useState([]);
  const [breakRequests, setBreakRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const headers = () => ({
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`
  });

  const fetchBreaks = async () => {
    setLoading(true);
    setError("");
    try {
      if (isBarber) {
        if (!barberId) return;
        const res = await fetch(`${API}/barber/${barberId}/breaks`, { headers: headers() });
        const data = await res.json();
        if (data.success) {
          const mapped = (data.requests || []).map(r => ({
            id: r._id,
            type: r.break_type,
            details: `${r.duration_mins} mins (${new Date(r.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })})` + (r.reason ? ` - Reason: ${r.reason}` : ''),
            status: r.status.charAt(0).toUpperCase() + r.status.slice(1)
          }));
          setRequests(mapped);
        }
      } else {
        if (!salonId) return;
        const res = await fetch(`${API}/owner/salon/${salonId}/break-requests`, { headers: headers() });
        const data = await res.json();
        if (data.success) {
          const mapped = (data.requests || []).map(r => ({
            id: r._id,
            name: r.barber_id?.name || "Barber",
            type: r.break_type,
            time: new Date(r.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            duration: `${r.duration_mins}m`,
            status: r.status
          }));
          setBreakRequests(mapped);
        }
      }
    } catch (err) {
      console.error(err);
      setError("Failed to fetch break history");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBreaks();
  }, [isBarber, barberId, salonId]);

  // --- हैंडल्स ---
  const handleLunchSubmit = async (e) => {
    e.preventDefault();
    if (!lunchStart || !lunchEnd) return;
    
    const startHour = parseInt(lunchStart.split(":")[0]);
    const startMin = parseInt(lunchStart.split(":")[1]);
    const endHour = parseInt(lunchEnd.split(":")[0]);
    const endMin = parseInt(lunchEnd.split(":")[1]);
    
    let durationMins = (endHour - startHour) * 60 + (endMin - startMin);
    if (durationMins < 0) durationMins += 24 * 60; // handle wrap around

    const startTimeObj = new Date();
    startTimeObj.setHours(startHour, startMin, 0, 0);

    try {
      const res = await fetch(`${API}/barber/${barberId}/break-request`, {
        method: "POST",
        headers: headers(),
        body: JSON.stringify({
          break_type: "lunch",
          start_time: startTimeObj.toISOString(),
          duration_mins: durationMins,
          reason: "Scheduled Lunch Break"
        })
      });
      const data = await res.json();
      if (data.success) {
        setLunchStart(''); setLunchEnd('');
        fetchBreaks();
      } else {
        alert(data.message || "Failed to submit lunch request");
      }
    } catch (err) {
      alert("Network error submitting lunch request");
    }
  };

  const handleBreakSubmit = async (e) => {
    e.preventDefault();
    const durationVal = parseInt(duration);

    // Map frontend break types to backend-compatible enum values ("short" or "long")
    let backendBreakType = "short";
    if (durationVal > 30) {
      backendBreakType = "long";
    }

    try {
      const res = await fetch(`${API}/barber/${barberId}/break-request`, {
        method: "POST",
        headers: headers(),
        body: JSON.stringify({
          break_type: backendBreakType,
          start_time: new Date().toISOString(),
          duration_mins: durationVal,
          reason: reason ? `Type: ${breakType} - ${reason}` : `Type: ${breakType}`
        })
      });
      const data = await res.json();
      if (data.success) {
        setReason('');
        fetchBreaks();
      } else {
        alert(data.message || "Failed to submit break request");
      }
    } catch (err) {
      alert("Network error submitting break request");
    }
  };

  const handleApprove = async (id) => {
    try {
      const res = await fetch(`${API}/owner/break-request/${id}`, {
        method: "PUT",
        headers: headers(),
        body: JSON.stringify({ status: "approved" })
      });
      if (res.ok) fetchBreaks();
    } catch (err) {
      console.error(err);
    }
  };

  const handleReject = async (id) => {
    try {
      const res = await fetch(`${API}/owner/break-request/${id}`, {
        method: "PUT",
        headers: headers(),
        body: JSON.stringify({ status: "rejected" })
      });
      if (res.ok) fetchBreaks();
    } catch (err) {
      console.error(err);
    }
  };

  const getStatusBadge = (status) => {
    if (status === 'Approved') {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[9px] font-black uppercase tracking-[0.2em] bg-emerald-50 text-emerald-700 border border-emerald-200/60 rounded-lg">
          <CheckCircle2 size={11} /> Approved
        </span>
      );
    } else if (status === 'Pending') {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[9px] font-black uppercase tracking-[0.2em] bg-amber-50 text-amber-700 border border-amber-200/60 rounded-lg">
          <AlertCircle size={11} /> Pending
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[9px] font-black uppercase tracking-[0.2em] bg-rose-50 text-rose-700 border border-rose-200/60 rounded-lg">
          <ShieldAlert size={11} /> Rejected
        </span>
      );
    }
  };

  const formInputStyle = "w-full p-3.5 border border-[#EADDCA] rounded-xl focus:outline-none focus:border-[#C5A059] bg-white font-medium text-xs text-[#3E362E] transition-all h-11";

  const breakTypes = [
    { value: 'Coffee Break', label: 'Coffee Break ☕' },
    { value: 'Tea Break', label: 'Tea Break 🍵' },
    { value: 'Short Break', label: 'Short Break ⏱️' },
    { value: 'Restroom Break', label: 'Restroom Break 🚽' },
    { value: 'Personal Break', label: 'Personal Break 👤' }
  ];

  const durations = [
    { value: '10', label: '10 Minutes' },
    { value: '15', label: '15 Minutes' },
    { value: '20', label: '20 Minutes' },
    { value: '30', label: '30 Minutes' },
    { value: '45', label: '45 Minutes (Approval Needed)' },
    { value: '60', label: '60 Minutes (Approval Needed)' }
  ];

  return (
    <div className="w-full text-[#3E362E] font-sans antialiased px-4 sm:px-6 md:px-8">
      <main className="max-w-5xl mx-auto w-full py-6 md:py-10 pb-24">

        {/* HEADER */}
        <div className="mb-10 border-b border-[#EADDCA]/60 pb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-3xl font-black tracking-tight text-stone-900 uppercase font-serif">Break <span className="text-[#C5A059]">Management</span></h1>
          <button
            onClick={() => navigate('/barber/queue')}
            className="bg-[#3E362E] hover:bg-[#2A241F] text-[#C5A059] border border-[#C5A059] px-4 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all cursor-pointer shadow-xs self-start sm:self-auto"
          >
            Live Monitoring
          </button>
        </div>

        {/* 3-GRID LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

          {/* LUNCH & SHORT BREAK FORMS */}
          <div className={`${isBarber ? 'lg:col-span-4 grid grid-cols-1 md:grid-cols-2 gap-6 space-y-0' : 'lg:col-span-2 space-y-8'}`}>
            
            {/* LUNCH FORM */}
            <div className="bg-white/70 p-6 rounded-[22px] border border-[#EADDCA] text-left">
              <h2 className="text-sm font-black uppercase mb-4 tracking-wider text-[#3E362E] font-serif">Daily Lunch Request</h2>
              <form onSubmit={handleLunchSubmit} className="space-y-4">
                <div>
                  <label className="block text-[11px] font-extrabold uppercase tracking-widest text-[#C5A059] mb-1.5 pl-0.5">Start Time</label>
                  <input type="time" required value={lunchStart} onChange={(e) => setLunchStart(e.target.value)} className={formInputStyle} />
                </div>
                <div>
                  <label className="block text-[11px] font-extrabold uppercase tracking-widest text-[#C5A059] mb-1.5 pl-0.5">End Time</label>
                  <input type="time" required value={lunchEnd} onChange={(e) => setLunchEnd(e.target.value)} className={formInputStyle} />
                </div>
                <button type="submit" className="w-full bg-[#3E362E] hover:bg-[#2A241F] text-[#C5A059] hover:text-[#FAF6F0] py-3.5 rounded-xl font-black text-[10px] uppercase tracking-widest transition-colors cursor-pointer border-none shadow-sm">Request Lunch Time</button>
              </form>
            </div>

            {/* SHORT BREAK FORM */}
            <div className="bg-white/70 p-6 rounded-[22px] border border-[#EADDCA] text-left flex flex-col justify-between">
              <div>
                <h2 className="text-sm font-black uppercase mb-2 tracking-wider text-[#3E362E] font-serif">Request Short Break</h2>
                <p className="text-[10px] text-stone-500 font-bold mb-4 font-sans leading-relaxed">
                  If the break duration is more than 30 minutes, write the reason why you need it in the field below. No reason is required for breaks 30 minutes or under.
                </p>
                <form onSubmit={handleBreakSubmit} className="space-y-4">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <CustomDropdown
                      label="Break Type"
                      value={breakType}
                      onChange={setBreakType}
                      options={breakTypes}
                    />
                    <CustomDropdown
                      label="Duration"
                      value={duration}
                      onChange={setDuration}
                      options={durations}
                    />
                  </div>

                  {parseInt(duration) > 30 && (
                    <div className="flex flex-col gap-1.5 animate-in fade-in slide-in-from-top-1 duration-200">
                      <label className="block text-[11px] font-extrabold uppercase tracking-widest text-[#C5A059] pl-0.5">
                        Reason for Break <span className="text-red-500 font-bold">*</span>
                      </label>
                      <textarea
                        required
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        placeholder="Please describe the reason for taking a break longer than 30 minutes..."
                        className="w-full p-3.5 border border-[#EADDCA] rounded-xl focus:outline-none focus:border-[#C5A059] bg-white font-medium text-xs text-[#3E362E] transition-all min-h-[70px] resize-none"
                      />
                      <span className="inline-flex items-center gap-1 text-[9px] text-amber-700 font-black uppercase tracking-wider pl-0.5">
                        ⚠️ Breaks longer than 30m require owner approval.
                      </span>
                    </div>
                  )}

                  <button 
                    type="submit" 
                    className="w-full bg-[#3E362E] hover:bg-[#2A241F] text-[#C5A059] hover:text-[#FAF6F0] py-3.5 rounded-xl font-black text-[10px] uppercase tracking-widest transition-colors cursor-pointer border-none shadow-sm"
                  >
                    Send Break Request
                  </button>
                </form>
              </div>
            </div>

          </div>

          {/* BREAK REQUESTS FEED */}
          {!isBarber && (
            <div className="bg-white/80 backdrop-blur-md p-5 lg:col-span-2 rounded-[22px] border border-[#E6D5C3] shadow-[0_4px_20px_rgba(74,62,61,0.02)]">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-serif font-black text-[#4A3E3D] text-sm uppercase">Break Requests Approval</h3>
                <span className="w-5 h-5 rounded-full text-[10px] font-black flex items-center justify-center text-white bg-[#8B5A2B]">
                  {breakRequests.filter(r => r.status === "pending").length}
                </span>
              </div>
              <div className="space-y-3">
                {breakRequests.map(r => (
                  <div key={r.id} className="bg-[#FDFBF7]/60 p-3 rounded-xl border border-[#E6D5C3]/50 text-left">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <p className="text-[#4A3E3D] font-black text-sm font-serif">{r.name}</p>
                      <span
                        className={`text-[9px] font-black uppercase px-2 py-1 rounded-full border ${
                          r.status === "pending"
                            ? "text-amber-800 bg-amber-50 border-amber-200"
                            : r.status === "approved"
                              ? "text-emerald-800 bg-emerald-50 border-emerald-200"
                              : "text-red-800 bg-red-50 border-red-200"
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
                        <button
                          onClick={() => handleApprove(r.id)}
                          className="flex-1 py-1.5 rounded-lg text-[10px] font-black text-white bg-emerald-700 hover:bg-emerald-800 cursor-pointer border-none shadow-xs"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleReject(r.id)}
                          className="flex-1 py-1.5 rounded-lg text-[10px] font-black text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 cursor-pointer shadow-2xs"
                        >
                          Reject
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* STATUS HISTORY */}
        <div className="mt-10 bg-white/60 p-6 rounded-[22px] border border-[#EADDCA]">
          <h2 className="text-sm font-black uppercase mb-6 text-left font-serif">Request Status History</h2>
          <div className="space-y-3">
            {requests.map((req) => (
              <div key={req.id} className="flex justify-between p-4 border border-[#EADDCA]/40 rounded-xl bg-white/40">
                <div className="text-left">
                  <p className="font-black text-[#3E362E]">{req.type}</p>
                  <p className="text-[10px] font-bold text-stone-400 uppercase mt-0.5">{req.details}</p>
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