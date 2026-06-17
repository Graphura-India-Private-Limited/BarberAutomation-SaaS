import { useState, useEffect } from 'react';
import { CUSTOMERS } from "../../config/data";
import CustomerCard from '../../components/customer/CustomerCard';
import DetailPanel from '../../components/customer/DetailPanel';
import { Search, UserMinus, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const GOLD = "#C5A059";

export default function CustomerInteractionView() {
  const loggedInBarberName = localStorage.getItem("barberName") || localStorage.getItem("name") || "";
  
  const initialCustomers = CUSTOMERS.filter(c => {
    if (!loggedInBarberName) return true;
    const cBarber = (c.barber || "").toLowerCase();
    const curBarber = loggedInBarberName.toLowerCase();
    if (cBarber === "unassigned" || !cBarber) return true;
    
    const getFirstWord = (str) => str.split(" ")[0].replace(/[^a-zA-Z]/g, "").toLowerCase();
    const firstWordCur = getFirstWord(curBarber);
    const firstWordC = getFirstWord(cBarber);
    
    return firstWordCur === firstWordC || curBarber.includes(cBarber) || cBarber.includes(curBarber);
  });

  const [customers, setCustomers] = useState(initialCustomers);
  const [selectedId, setSelectedId] = useState(initialCustomers[0]?.id || null);
  const [search, setSearch] = useState('');
  const navigate = useNavigate(); 

  const selected = customers.find(c => c.id === selectedId);

  const filtered = customers.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.service.toLowerCase().includes(search.toLowerCase()) ||
    c.status.toLowerCase().includes(search.toLowerCase())
  );

  function handleUpdate(updated) {
    setCustomers(cs => cs.map(c => c.id === updated.id ? updated : c));
  }

  const counts = {
    total:   customers.length,
    waiting: customers.filter(c => c.status === 'Waiting').length,
    inChair: customers.filter(c => c.status === 'In Chair').length,
    done:    customers.filter(c => c.status === 'Completed').length,
  };

  const profile = { salonName: "Master Barber Lounge", initials: "MB" };

  return (
    <div className="w-full text-[#3E362E] font-sans antialiased flex flex-col">
      {/* ── WORKSPACE DASHBOARD CONTENT CANVAS ── */}
      <main className="flex-grow max-w-6xl mx-auto w-full px-5 py-6 text-left">
        
        {/* Main Module Headline Context */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4 border-b border-stone-200/60 pb-6">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-stone-900 uppercase font-serif">
              Customer <span className="text-[#C5A059]">Interactions</span>
            </h1>
            <p className="text-[10px] font-black uppercase tracking-widest text-[#A37B58] mt-1.5">
              Live Studio Client Engagement Console
            </p>
          </div>
          
          <div className="flex items-center gap-2 bg-white px-3.5 py-2 rounded-xl border border-stone-200/80 shadow-3xs w-fit">
            <span className="w-2 h-2 rounded-full bg-[#8B5A2B] animate-pulse"></span>
            <span className="text-[10px] font-black uppercase tracking-wider text-stone-500 font-mono">
              Active Queue Monitoring
            </span>
          </div>
        </div>

        {/* 📊 ANALYTICS STATS CARDS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Total Today', value: counts.total,   color: 'text-stone-800' },
            { label: 'Waiting Queue', value: counts.waiting, color: 'text-amber-600' },
            { label: 'In Service Chair', value: counts.inChair, color: 'text-[#C5A059]' },
            { label: 'Completed Jobs', value: counts.done,    color: 'text-emerald-700' },
          ].map((s) => (
            <div key={s.label} className="bg-white border border-stone-200/80 rounded-2xl px-5 py-4 shadow-3xs text-left">
              <div className="text-[10px] font-black uppercase tracking-wider text-stone-400 mb-1">{s.label}</div>
              <div className={`font-mono font-black text-2xl md:text-3xl ${s.color}`}>
                {String(s.value).padStart(2, '0')}
              </div>
            </div>
          ))}
        </div>

        {/* 🧱 LAYOUT WORKSPACE AREA CONTAINER */}
        <div className="flex flex-col lg:flex-row gap-6 items-start">
          
          {/* 📋 SIDEBAR QUEUE MANAGER */}
          <aside className="w-full lg:w-[360px] flex-shrink-0 bg-white border border-stone-200/80 rounded-2xl flex flex-col shadow-3xs overflow-hidden">
            {/* Search Box Header Section */}
            <div className="p-4 border-b border-stone-200/60 bg-stone-50/50 w-full">
              <div className="relative w-full">
                <input 
                  type="text" 
                  placeholder="Search active profiles..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="w-full bg-[#FAF6F0]/40 border border-stone-200 rounded-xl pl-10 pr-4 py-2.5 text-xs font-bold text-stone-800 placeholder-stone-400 focus:outline-none focus:border-[#C5A059] transition-all"
                />
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
              </div>
              <div className="flex justify-between items-center mt-3 px-0.5">
                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-[#C5A059]">
                  Queue: {filtered.length} client{filtered.length !== 1 ? 's' : ''}
                </p>
                {search && (
                  <button onClick={() => setSearch('')} className="text-[9px] font-bold text-stone-400 hover:text-[#3E362E] underline uppercase tracking-wider">
                    Clear
                  </button>
                )}
              </div>
            </div>

            {/* Scrollable Customer Cards Sidebar Pipeline */}
            <div className="p-3 flex flex-col gap-2 max-h-[450px] overflow-y-auto bg-stone-50/10 w-full dynamic-scrollbar">
              {filtered.length === 0 ? (
                <div className="text-center py-12 flex flex-col items-center justify-center gap-2 w-full h-full">
                  <UserMinus className="w-7 h-7 text-stone-300" />
                  <div className="text-[10px] font-black uppercase tracking-widest text-stone-400">No matching queues</div>
                </div>
              ) : (
                filtered.map((c) => (
                  <div key={c.id} className="w-full transition-all duration-200 transform active:scale-[0.99] cursor-pointer">
                    <CustomerCard 
                      customer={c} 
                      isSelected={c.id === selectedId} 
                      onClick={() => setSelectedId(c.id)} 
                    />
                  </div>
                ))
              )}
            </div>
          </aside>

          {/* 🔍 ACCENTED DETAIL PROFILE GRID CANVAS */}
          <main className="flex-1 w-full bg-white border border-stone-200/80 rounded-2xl p-5 md:p-6 shadow-3xs min-h-[400px]">
            {selected ? (
              <DetailPanel 
                key={selected.id} 
                customer={selected} 
                onUpdate={handleUpdate} 
              />
            ) : (
              <div className="flex flex-col items-center justify-center h-full gap-3 text-stone-400 text-center py-20">
                <div className="w-12 h-12 rounded-full bg-[#C5A059]/10 flex items-center justify-center mb-1">
                  <svg className="w-6 h-6 text-[#C5A059]" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5a2.25 2.25 0 002.25 2.25zm.75-10.5h6a.75.75 0 01.75.75v6a.75.75 0 01-.75.75h-6a.75.75 0 01-.75-.75v-6a.75.75 0 01.75-.75z" />
                  </svg>
                </div>
                <p className="text-[10px] font-black uppercase tracking-[0.25em] text-[#3E362E]">
                  Select an active profile card to initialize
                </p>
              </div>
            )}
          </main>

        </div>
      </main>
    </div>
  );
}