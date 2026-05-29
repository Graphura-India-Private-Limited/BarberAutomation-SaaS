import React, { useState, useEffect } from "react";
import { useAuth, useQueue } from "../../contexts/AppContext";
import { useNavigate } from "react-router-dom";
import { Menu, Bell, X, User } from "lucide-react";

const SERVICES = ["Classic Haircut", "Beard Trim & Shape", "Hair Spa", "Premium Grooming", "Shave", "Hair Colour"];

export default function QueuePage() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { queue } = useQueue();

  const [showAdd, setShowAdd] = useState(false);
  const [sideOpen, setSideOpen] = useState(false);
  const [salonOpen, setSalonOpen] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());

  const user = currentUser || {};
  const isOwner = user?.role === "owner";
  const currentBarberName = user?.name || user?.username || "Barber Master";
  
  const profile = { name: user?.name || "Barber", initials: "SK", salonName: "The Royal Cuts" };

  const activeQueueArray = Array.isArray(queue) ? queue : [];

  const visibleQueue = isOwner 
    ? activeQueueArray 
    : activeQueueArray.filter(q => q.barber?.trim().toLowerCase() === currentBarberName?.trim().toLowerCase());

  useEffect(() => {
    const t = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const [newCustomer, setNewCustomer] = useState({ customer: "", service: "" });

return (
  <div className="min-h-screen bg-[#FDFBF7] text-[#4A3E3D] font-sans antialiased">
    
    {/* १. हेडर (Full Width) */}
    <header className="sticky top-0 z-50 w-full px-4 md:px-8 py-4 bg-[#1A1A1A] border-b border-[#D4AF37]/20 flex items-center justify-between">
      <div className="flex items-center gap-4">
         <button className="md:hidden p-2 text-zinc-400" onClick={() => setSideOpen(!sideOpen)}>
           <Menu className="w-5 h-5" />
         </button>
         <div className="text-left">
            <h1 className="text-white font-bold text-xl font-serif">Queue</h1>
            <p className="text-[10px] text-zinc-500 uppercase tracking-widest">{profile.salonName}</p>
         </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-[#10B981]/10 border border-[#10B981]/20">
           <div className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
           <span className="text-[9px] font-bold text-[#10B981] uppercase">Salon Open</span>
        </div>
        <button className="p-2 text-zinc-400 bg-white/5 rounded-lg border border-white/10"><Bell className="w-4 h-4" /></button>
        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#F5C842] to-[#E8A020] flex items-center justify-center text-xs font-bold text-black">
          {profile.initials}
        </div>
      </div>
    </header>
    
    {/* २. मेन कंटेंट (Centering the content like Dashboard) */}
    <main className="max-w-7xl mx-auto px-4 md:px-8 py-10">
      
      {/* My Queue हेडर आता इथे आहे */}
      <div className="w-full mb-10 border-b border-[#E6D5C3]/30 pb-8 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
        <div className="space-y-1">
          <h2 className="font-serif text-5xl font-black text-[#4A3E3D] uppercase tracking-tight">My Queue</h2>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#8B5A2B] animate-pulse"></span>
            <p className="text-[11px] font-bold uppercase tracking-widest text-[#8B5A2B]">
              {isOwner ? "All Studio Barbers' Pipelines" : `Live Session — ${currentBarberName}`}
            </p>
          </div>
        </div>
        <button 
          onClick={() => setShowAdd(!showAdd)} 
          className="px-8 py-4 bg-[#4A3E3D] text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-[#2d2726] shadow-lg"
        >
          {showAdd ? "✕ Close Panel" : "+ Add Customer"}
        </button>
      </div>
      {/* Add Customer Panel */}
{showAdd && (
  <div className="mb-10 bg-white p-6 rounded-3xl border border-[#E6D5C3] shadow-xl animate-in slide-in-from-top-4">
    <h3 className="font-bold text-[#4A3E3D] mb-4 uppercase text-sm">Add New Customer</h3>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <input 
        placeholder="Customer Name" 
        className="p-3 rounded-xl border border-[#E6D5C3] bg-[#FDFBF7]"
        value={newCustomer.customer}
        onChange={(e) => setNewCustomer({...newCustomer, customer: e.target.value})}
      />
      <select 
        className="p-3 rounded-xl border border-[#E6D5C3] bg-[#FDFBF7]"
        value={newCustomer.service}
        onChange={(e) => setNewCustomer({...newCustomer, service: e.target.value})}
      >
        <option value="">Select Service</option>
        {SERVICES.map(s => <option key={s} value={s}>{s}</option>)}
      </select>
      <button 
        onClick={() => {
            console.log("Adding:", newCustomer);
            setShowAdd(false);
            setNewCustomer({ customer: "", service: "" });
        }}
        className="bg-[#4A3E3D] text-white rounded-xl font-bold uppercase text-xs"
      >
        Add to Queue
      </button>
    </div>
  </div>
)}

      {/* Queue List */}
      <div className="space-y-2.5">
        {visibleQueue.length > 0 ? visibleQueue.map((q) => (
          <div key={q.id} className="bg-white p-4 rounded-xl border border-[#E6D5C3] shadow-sm">
            <p className="font-bold text-[#4A3E3D]">{q.customer}</p>
            <p className="text-xs text-stone-500">{q.service}</p>
          </div>
        )) : (
          <div className="text-center py-10 text-stone-400 border border-dashed border-[#E6D5C3] rounded-xl">Queue is empty.</div>
        )}
      </div>
    </main>
  </div>
);
}