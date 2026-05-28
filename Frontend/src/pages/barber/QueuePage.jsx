import React, { useState } from "react";
import { useAuth, useQueue } from "../../contexts/AppContext";
import Navbar from "../../components/layout/Navbar";

const STATUS_COLORS = {
  "waiting": "bg-amber-100 text-amber-900 border-amber-300",
  "in-progress": "bg-emerald-100 text-emerald-900 border-emerald-300",
  "done": "bg-stone-100 text-stone-600 border-stone-300",
};

const SERVICES = ["Classic Haircut", "Beard Trim & Shape", "Hair Spa", "Premium Grooming", "Shave", "Hair Colour"];

export default function QueuePage() {
  const { currentUser } = useAuth();
  const { queue, updateStatus, addToQueue, removeFromQueue } = useQueue();
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ customer: "", service: SERVICES[0], time: "" });

  // Fallback to match whichever username key your Auth context exposes
  const currentBarberName = currentUser?.name || currentUser?.username || "Barber Master";
  const isOwner = currentUser?.role === "owner";

  // Filter pipeline handling defensive checks safely
  const activeQueueArray = Array.isArray(queue) ? queue : [];
  const visibleQueue = isOwner 
    ? activeQueueArray 
    : activeQueueArray.filter(q => q.barber === currentBarberName);

  const handleAdd = (e) => {
    if (e) e.preventDefault();

    if (!form.customer.trim() || !form.time) {
      alert("Please fill in both the Customer Name and target Appointment Time!");
      return;
    }

    // ✅ FIXED: Injected status: "waiting" explicitly so map rendering parameters don't break!
    const submissionPayload = {
      ...form,
      id: Date.now().toString(), // Safe fallback unique key asset string token
      barber: currentBarberName,
      status: "waiting" 
    };

    addToQueue(submissionPayload);
    
    // Clear inputs and fold form container drawer
    setForm({ customer: "", service: SERVICES[0], time: "" });
    setShowAdd(false);
  };

  return (
    <div className="min-h-screen bg-[#FAF6F0] text-stone-800 font-sans antialiased flex flex-col">
      <Navbar />
      
      <div className="max-w-5xl mx-auto w-full px-6 py-10 flex-1 text-left">
        
        {/* HEADER MANAGEMENT ROW CONTROL CONTAINER */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4 border-b border-stone-200/60 pb-6">
          <div>
            <h2 className="text-3xl font-extrabold tracking-tight text-stone-900 uppercase">
              Queue Management
            </h2>
            <p className="text-xs font-black uppercase tracking-widest text-[#A37B58] mt-1.5">
              {isOwner ? "All Studio Barbers' Pipelines" : `Your Live Queue — ${currentBarberName}`}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowAdd(!showAdd)}
            className="sm:self-end rounded-xl bg-[#3E362E] hover:bg-[#2A241F] text-[#C5A059] font-black text-xs uppercase tracking-widest px-6 py-3.5 transition shadow-xs cursor-pointer select-none"
          >
            {showAdd ? "✕ Close Panel" : "+ Add Customer"}
          </button>
        </div>

        {/* 📑 NEW ENTRY INPUT FORM OVERLAY PANEL */}
        {showAdd && (
          <div className="bg-white border border-stone-200/80 rounded-2xl p-6 mb-8 shadow-sm text-left animate-fade-in">
            <h3 className="text-sm font-black uppercase tracking-wider text-stone-900 mb-4 border-b border-stone-50 pb-2">
              New Pipeline Entry
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-stone-400 pl-0.5">Customer Name</label>
                <input
                  type="text"
                  className="border border-stone-200 rounded-xl px-4 py-3 text-sm text-stone-800 focus:outline-none focus:border-stone-900 bg-[#FAF6F0]/40 w-full font-semibold"
                  placeholder="e.g. Mayur K."
                  value={form.customer}
                  onChange={e => setForm({ ...form, customer: e.target.value })}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-stone-400 pl-0.5">Select Treatment Service</label>
                <select
                  className="border border-stone-200 rounded-xl px-4 py-3 text-sm text-stone-800 focus:outline-none focus:border-stone-900 bg-[#FAF6F0]/40 w-full font-semibold h-[46px] cursor-pointer"
                  value={form.service}
                  onChange={e => setForm({ ...form, service: e.target.value })}
                >
                  {SERVICES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-stone-400 pl-0.5">Target Time Slot</label>
                <input
                  type="time"
                  className="border border-stone-200 rounded-xl px-4 py-3 text-sm text-stone-800 focus:outline-none focus:border-stone-900 bg-[#FAF6F0]/40 w-full font-semibold h-[46px]"
                  value={form.time}
                  onChange={e => setForm({ ...form, time: e.target.value })}
                />
              </div>

            </div>

            <div className="flex gap-3 mt-6 border-t border-stone-50 pt-4 justify-end">
              <button 
                type="button" 
                onClick={() => setShowAdd(false)} 
                className="text-xs font-black uppercase tracking-widest text-stone-400 hover:text-stone-900 px-5 py-3 rounded-xl transition cursor-pointer"
              >
                Cancel
              </button>
              <button 
                type="button"
                onClick={handleAdd} 
                className="bg-[#A37B58] hover:bg-[#8F6947] text-white text-xs font-black uppercase tracking-widest px-6 py-3 rounded-xl transition shadow-3xs cursor-pointer"
              >
                Add To Pipeline
              </button>
            </div>
          </div>
        )}

        {/* 👥 LIVE ACTIVE PIPELINE QUEUE LIST VISIONS */}
        <div className="space-y-4">
          {visibleQueue.length === 0 ? (
            <div className="text-center py-16 bg-white border border-stone-200/40 rounded-2xl shadow-3xs text-stone-400 text-sm font-medium">
              📭 No active customers waiting in the pipeline queue tracking logs right now.
            </div>
          ) : (
            visibleQueue.map(item => (
              <div key={item.id} className="bg-white border border-stone-200/60 rounded-2xl px-6 py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between shadow-3xs hover:shadow-md transition-all gap-4">
                <div className="text-left">
                  <p className="font-extrabold text-stone-900 text-lg tracking-tight">{item.customer}</p>
                  <p className="text-xs font-bold text-stone-400 uppercase tracking-wider mt-0.5">
                    {item.service} <span className="text-stone-300 mx-1.5">·</span> {item.time}
                  </p>
                  {isOwner && (
                    <p className="text-[10px] text-[#A37B58] font-black uppercase tracking-wider mt-2 bg-[#FAF6F0] px-2.5 py-1 rounded-md inline-block border border-stone-200/30">
                      Assigned Barber: {item.barber || "Unassigned"}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-3 justify-between sm:justify-end border-t sm:border-t-0 pt-3 sm:pt-0 border-stone-50">
                  <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg border shadow-3xs ${STATUS_COLORS[item.status] || "bg-stone-50 text-stone-600"}`}>
                    {item.status || "waiting"}
                  </span>
                  
                  {item.status !== "done" && (
                    <select
                      className="text-xs font-bold border border-stone-200 bg-white rounded-lg px-2.5 py-1.5 text-stone-700 focus:outline-none focus:border-stone-900 cursor-pointer h-8 shadow-3xs"
                      value={item.status || "waiting"}
                      onChange={e => updateStatus(item.id, e.target.value)}
                    >
                      <option value="waiting">Waiting</option>
                      <option value="in-progress">In Progress</option>
                      <option value="done">Done</option>
                    </select>
                  )}

                  {isOwner && (
                    <button
                      type="button"
                      onClick={() => removeFromQueue(item.id)}
                      className="text-xs text-red-500 hover:text-red-700 font-black uppercase tracking-wider px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>
            )
          ))}
        </div>

      </div>
    </div>
  );
}