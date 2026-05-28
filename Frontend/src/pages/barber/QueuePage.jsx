import React, { useState } from "react";
import { useAuth, useQueue } from "../../contexts/AppContext";
import Navbar from "../../components/layout/Navbar";


const STATUS_COLORS = {
  "waiting": "bg-amber-50 text-amber-800 border-amber-200",
  "in-progress": "bg-emerald-50 text-emerald-800 border-emerald-200",
  "done": "bg-stone-100 text-stone-600 border-stone-200",
};

const SERVICES = ["Classic Haircut", "Beard Trim & Shape", "Hair Spa", "Premium Grooming", "Shave", "Hair Colour"];

export default function QueuePage() {
  const { currentUser } = useAuth();
  const { queue, updateStatus, addToQueue } = useQueue();
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ customer: "", service: SERVICES[0], time: "" });

  // Safety checks
  const user = currentUser || {};
  const isOwner = user?.role === "owner";
  const currentBarberName = user?.name || user?.username || "Barber Master";
  
  // Pipeline filter
  const activeQueueArray = Array.isArray(queue) ? queue : [];
  const visibleQueue = isOwner 
    ? activeQueueArray 
    : activeQueueArray.filter(q => q.barber === currentBarberName);

  const handleAdd = () => {
    if (!form.customer.trim() || !form.time) {
      alert("Please fill in both the Customer Name and Time!");
      return;
    }

    addToQueue({
      ...form,
      id: Date.now().toString(),
      barber: currentBarberName,
      status: "waiting"
    });
    
    setForm({ customer: "", service: SERVICES[0], time: "" });
    setShowAdd(false);
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#4A3E3D] font-sans antialiased flex flex-col">
      <div className="max-w-5xl mx-auto w-full px-4 md:px-6 py-8 md:py-10 flex-1 text-left">
        
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4 border-b border-[#E6D5C3]/40 pb-6">
          <div>
            <h2 className="font-serif text-3xl font-black text-[#4A3E3D] uppercase">My Queue</h2>
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#8B5A2B] mt-1.5">
              {isOwner ? "All Studio Barbers' Pipelines" : `Live Session — ${currentBarberName}`}
            </p>
          </div>
          <button
            onClick={() => setShowAdd(!showAdd)}
            className="rounded-xl bg-[#4A3E3D] hover:bg-[#5C4D4C] text-white font-black text-xs uppercase tracking-wider px-6 py-3.5 transition shadow-md cursor-pointer"
          >
            {showAdd ? "✕ Close Panel" : "+ Add Customer"}
          </button>
        </div>

        {/* FORM PANEL */}
        {showAdd && (
          <div className="bg-white/80 backdrop-blur-md border border-[#E6D5C3] rounded-2xl p-6 mb-8 shadow-[0_4px_20px_rgba(74,62,61,0.05)]">
            <h3 className="font-serif text-sm font-black uppercase text-[#4A3E3D] mb-4 border-b border-[#E6D5C3]/30 pb-2">New Pipeline Entry</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input type="text" className="border border-[#E6D5C3] rounded-xl px-4 py-3 text-sm bg-[#FDFBF7] focus:border-[#8B5A2B] outline-none" placeholder="Customer Name" value={form.customer} onChange={e => setForm({ ...form, customer: e.target.value })} />
              <select className="border border-[#E6D5C3] rounded-xl px-4 py-3 text-sm bg-[#FDFBF7] focus:border-[#8B5A2B] outline-none" value={form.service} onChange={e => setForm({ ...form, service: e.target.value })}>
                {SERVICES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              <input type="time" className="border border-[#E6D5C3] rounded-xl px-4 py-3 text-sm bg-[#FDFBF7] focus:border-[#8B5A2B] outline-none" value={form.time} onChange={e => setForm({ ...form, time: e.target.value })} />
            </div>
            <div className="flex gap-3 mt-6 justify-end">
              <button onClick={handleAdd} className="bg-[#8B5A2B] text-white text-xs font-black uppercase px-6 py-3 rounded-xl hover:opacity-90 cursor-pointer">Add To Pipeline</button>
            </div>
          </div>
        )}

        {/* QUEUE LIST */}
        <div className="space-y-3">
          {visibleQueue.length > 0 ? visibleQueue.map((item, i) => (
            <div key={item.id} className="bg-white/80 backdrop-blur-md p-4 flex items-center gap-4 rounded-xl border border-[#E6D5C3]/40 hover:border-[#8B5A2B]/40 transition-all shadow-sm">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-xs border border-[#E6D5C3] text-[#8B5A2B] bg-[#FDFBF7]">
                #{i + 1}
              </div>
              
              <div className="flex-1 min-w-0">
                <p className="text-[#4A3E3D] font-black text-sm font-serif">{item.customer}</p>
                <p className="text-[11px] text-stone-500 font-medium">{item.service} · {item.time}</p>
              </div>

              <span className={`text-[9px] font-black uppercase tracking-wider px-3 py-1 rounded-full border ${STATUS_COLORS[item.status] || STATUS_COLORS.waiting}`}>
                {item.status || "waiting"}
              </span>

              <select 
                className="text-[10px] font-bold border border-[#E6D5C3] rounded-lg px-2 py-1.5 text-[#4A3E3D] bg-white cursor-pointer"
                value={item.status || "waiting"}
                onChange={e => updateStatus(item.id, e.target.value)}
              >
                <option value="waiting">Waiting</option>
                <option value="in-progress">In Progress</option>
                <option value="done">Done</option>
              </select>
            </div>
          )) : (
            <div className="text-center py-10 text-stone-400 font-medium text-sm">No customers in queue.</div>
          )}
        </div>
      </div>
      
    </div>
    
  );
}