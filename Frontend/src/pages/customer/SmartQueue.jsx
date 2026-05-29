import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import { ArrowLeft } from "lucide-react";

import {
  SERVICES,
  BARBERS,
  AVG_CUT,
  initQueue,
  initBookings,
  fmtWait,
  timeAgo,
  LiveDot,
  Toast,
  Chip,
  SourceTag,
  AddCustomerModal,
  DetailModal,
} from "../../components/common/Modals";

import "../../styles/smart-queue.css";

// Scissor Brand SVG Icon Component
const ScissorIcon = ({ className }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="6" cy="6" r="3" stroke="currentColor"/>
    <circle cx="6" cy="18" r="3" stroke="currentColor"/>
    <line x1="20" y1="4" x2="8.12" y2="15.88" stroke="currentColor"/>
    <line x1="14.47" y1="14.48" x2="20" y2="20" stroke="currentColor"/>
    <line x1="8.12" y1="8.12" x2="12" y2="12" stroke="currentColor"/>
  </svg>
);


// ─── QUEUE ROW COMPONENT ──────────────────────────────────────────────────────
function QueueRow({ entry, idx, onClick, onServe }) {
  const barber  = BARBERS.find(b => b.id === entry.barber);
  const svc     = SERVICES.find(s => s.id === entry.service);
  const isFirst = entry.position === 1;

  return (
    <div
      onClick={onClick}
      className={`animate-slide-up flex items-center gap-4 px-5 py-4 cursor-pointer bg-white border border-stone-200/50 rounded-2xl transition-all hover:shadow-sm ${
        isFirst ? 'ring-2 ring-[#C5A059] bg-[#FFFBF4]/40' : ''
      }`}
      style={{ animationDelay: `${idx * 0.07}s` }}
    >
      {/* Position Badge */}
      <div 
        className="w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center font-black text-sm transition-colors"
        style={{
          background: isFirst ? '#3E362E' : '#F5EFE6',
          border: `1.5px solid ${isFirst ? '#2A241F' : '#EAD8C0'}`,
          color: isFirst ? '#FFF' : '#3E362E',
        }}
      >
        #{entry.position}
      </div>

      {/* Info context */}
      <div className="flex-1 min-w-0 text-left">
        <div className="flex items-center gap-2 flex-wrap mb-0.5">
          <span className="font-extrabold text-stone-900 text-base tracking-tight">{entry.name}</span>
          <SourceTag src={entry.source} />
          {isFirst && <Chip color="#A37B58">● NEXT UP</Chip>}
        </div>
        <p className="text-xs text-stone-500 font-semibold uppercase tracking-wider">
          {barber?.emoji} {barber?.name} &nbsp;·&nbsp; <span className="text-stone-700 normal-case font-medium">{svc?.label}</span>
        </p>
      </div>

      {/* Wait time text metric */}
      <div className="text-right flex-shrink-0">
        <p className="font-black text-sm text-stone-900 leading-none mb-1">
          {fmtWait(entry.position, entry.service)}
        </p>
        <p className="text-[10px] text-stone-400 font-bold uppercase tracking-wider">{timeAgo(entry.joinedAt)}</p>
      </div>

      {/* Action Trigger */}
      {isFirst && (
        <button
          onClick={e => { e.stopPropagation(); onServe(entry.id); }}
          className="bg-[#3E362E] hover:bg-[#2A241F] text-white font-black text-[10px] uppercase tracking-widest px-4 py-2.5 rounded-xl transition-colors shadow-xs cursor-pointer"
        >
          SERVE
        </button>
      )}
    </div>
  );
}

// ─── BOOKING ROW COMPONENT ──────────────────────────────────────────────────
function BookingRow({ entry, idx, onClick, onMoveToQueue }) {
  const barber  = BARBERS.find(b => b.id === entry.barber);
  const svc     = SERVICES.find(s => s.id === entry.service);
  const inQueue = entry.status === 'in-queue';
  
  const statusStyles = {
    confirmed: { bg: 'bg-blue-50', border: 'border-blue-200/60', text: 'text-blue-700' },
    'in-queue': { bg: 'bg-stone-100', border: 'border-stone-200', text: 'text-stone-600' },
    cancelled: { bg: 'bg-red-50', border: 'border-red-200/60', text: 'text-red-700' },
  };
  const ss = statusStyles[entry.status] ?? statusStyles.confirmed;

  return (
    <div
      onClick={onClick}
      className="animate-slide-up flex items-center gap-4 px-5 py-4 cursor-pointer bg-white border border-stone-200/50 rounded-2xl transition-all hover:shadow-sm"
      style={{ animationDelay: `${idx * 0.07}s` }}
    >
      {/* Slot layout bubble */}
      <div className="w-14 flex-shrink-0 text-center rounded-xl py-1.5 bg-[#FAF7F2] border border-[#EAD8C0]">
        <p className="font-black text-xs text-stone-900 leading-tight">{entry.slot.split(' ')[0]}</p>
        <p className="text-[9px] uppercase font-black tracking-wider text-[#A37B58] mt-0.5">{entry.slot.split(' ')[1]}</p>
      </div>

      {/* Core Profile Metadata */}
      <div className="flex-1 min-w-0 text-left">
        <div className="flex items-center gap-2 flex-wrap mb-0.5">
          <span className="font-extrabold text-stone-900 text-base tracking-tight">{entry.name}</span>
          <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md border ${ss.bg} ${ss.border} ${ss.text}`}>
            {entry.status}
          </span>
        </div>
        <p className="text-xs text-stone-500 font-semibold uppercase tracking-wider">
          {barber?.emoji} {barber?.name} &nbsp;·&nbsp; <span className="text-stone-700 normal-case font-medium">{svc?.label}</span>
        </p>
      </div>

      {/* Trigger Handler */}
      {!inQueue ? (
        <button 
          onClick={e => { e.stopPropagation(); onMoveToQueue(entry.id); }}
          className="border border-[#C5A059] text-[#C5A059] bg-white hover:bg-[#C5A059] hover:text-white font-black text-[10px] uppercase tracking-widest px-3 py-2.5 rounded-xl transition-all cursor-pointer shadow-2xs"
        >
          → Queue
        </button>
      ) : (
        <span className="text-[10px] font-black uppercase tracking-wider text-stone-400 bg-stone-50 px-2.5 py-1.5 rounded-lg border border-stone-200/40">
          In Queue
        </span>
      )}
    </div>
  );
}

// ─── STATS TAB COMPONENT ──────────────────────────────────────────────────────
function StatsPanel({ queue, bookings, servedCount, liveActive }) {
  const totalWait = queue.reduce((acc, e) => acc + (SERVICES.find(s => s.id === e.service)?.mins ?? AVG_CUT), 0);

  return (
    <div className="flex flex-col gap-4 animate-slide-up text-left">
      <p className="text-[10px] font-black uppercase tracking-widest text-[#A37B58] mt-1">Barber Workload</p>
      
      <div className="flex flex-col gap-3">
        {BARBERS.map(b => {
          const assigned = queue.filter(e => e.barber === b.id).length;
          const pct = Math.min(100, queue.length > 0 ? (assigned / queue.length) * 100 : 0);
          return (
            <div key={b.id} className="bg-white border border-stone-200/50 rounded-2xl p-5 shadow-2xs">
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{b.emoji}</span>
                  <span className="font-extrabold text-stone-900 text-base tracking-tight">{b.name}</span>
                </div>
                <span className="text-[10px] font-black bg-stone-50 text-stone-700 border border-stone-200/60 px-2.5 py-1 rounded-md uppercase tracking-wider">
                  {assigned} clients
                </span>
              </div>
              <div className="rounded-full h-2 bg-stone-100 overflow-hidden">
                <div className="h-full rounded-full transition-all duration-700"
                  style={{ background: '#3E362E', width: `${pct}%` }} />
              </div>
              <div className="flex justify-between mt-2">
                <span className="text-xs text-stone-400 font-bold uppercase tracking-wider">Queue distribution</span>
                <span className="text-xs text-stone-900 font-black">{Math.round(pct)}%</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary Data Context Grid */}
      <div className="bg-white border border-stone-200/50 rounded-2xl p-5 shadow-2xs">
        <p className="font-extrabold text-stone-900 text-base tracking-tight mb-3">Session Summary</p>
        {[
          ['Customers served',   servedCount],
          ['Currently waiting', queue.length],
          ['Pending bookings',  bookings.filter(b => b.status === 'confirmed').length],
          ['Total queue wait',  `${totalWait} mins`],
          ['Avg service time',  `${AVG_CUT} mins`],
          ['Live updates',      liveActive ? '● Operational' : '⏸ Paused'],
        ].map(([k, v]) => (
          <div key={k} className="flex justify-between py-3 border-b border-stone-100 last:border-0">
            <span className="text-sm text-stone-600 font-medium">{k}</span>
            <span className="text-sm text-stone-900 font-black">{v}</span>
          </div>
        ))}
      </div>

      {/* Auto Ticker Message Container */}
      <div className="rounded-2xl p-4 flex items-center gap-3 bg-white/60 border border-stone-200/40 shadow-2xs">
        <span className="text-[#C5A059] text-base">⏱</span>
        <p className="text-xs text-stone-600 font-medium leading-normal">
          Queue auto-advances every <strong className="text-stone-900 font-bold">18s</strong> · Bookings auto-queue every <strong className="text-stone-900 font-bold">30s</strong> when system status is live.
        </p>
      </div>
    </div>
  );
}

// ─── MAIN APP VIEW PANEL ──────────────────────────────────────────────────────
export default function SmartQueue() {
  const navigate = useNavigate();
  const [queue,       setQueue]       = useState(initQueue);
  const [bookings,    setBookings]    = useState(() => initBookings());
  const [tab,         setTab]         = useState('queue');
  const [showAdd,     setShowAdd]     = useState(false);
  const [detail,      setDetail]      = useState(null);
  const [notif,       setNotif]       = useState(null);
  const [liveActive,  setLiveActive]  = useState(true);
  const [servedCount, setServedCount] = useState(0);
  const notifRef = useRef();

  const toast = useCallback((msg, type='info') => {
    setNotif({ msg, type });
    clearTimeout(notifRef.current);
    notifRef.current = setTimeout(() => setNotif(null), 3500);
  }, []);

  useEffect(() => {
    if (!liveActive) return;
    const t = setInterval(() => {
      setQueue(prev => {
        if (!prev.length) return prev;
        const [done, ...rest] = prev;
        toast(`${done.name} has been served `, 'success');
        setServedCount(n => n + 1);
        return rest.map((e, i) => ({ ...e, position: i + 1 }));
      });
    }, 18000);
    return () => clearInterval(t);
  }, [liveActive, toast]);

  useEffect(() => {
    if (!liveActive) return;
    const t = setInterval(() => {
      setBookings(prev => {
        const toMove = prev.find(b => b.status === 'confirmed');
        if (!toMove) return prev;
        const updated = prev.map(b => b.id === toMove.id ? { ...b, status: 'in-queue' } : b);
        setQueue(q => {
          if (q.some(e => e.id === toMove.id)) return q;
          const newPos = q.length + 1;
          toast(`${toMove.name}'s booking moved to queue at #${newPos}`, 'info');
          return [...q, { id: toMove.id, name: toMove.name, phone: toMove.phone, service: toMove.service, barber: toMove.barber, position: newPos, joinedAt: Date.now(), source: 'booked', status: 'waiting' }];
        });
        return updated;
      });
    }, 30000);
    return () => clearInterval(t);
  }, [liveActive, toast]);

  const handleAdd = ({ type, entry }) => {
    if (type === 'queue') {
      setQueue(prev => [...prev, { ...entry, position: prev.length + 1 }]);
      toast(`${entry.name} added to queue `, 'success');
    } else {
      setBookings(prev => [...prev, entry]);
      toast(`Booking confirmed for ${entry.name} at ${entry.slot} `, 'success');
    }
  };

  const handleServe = id => {
    setQueue(prev => {
      const done = prev.find(e => e.id === id);
      if (done) { toast(`${done.name} served! `, 'success'); setServedCount(n => n + 1); }
      return prev.filter(e => e.id !== id).map((e, i) => ({ ...e, position: i + 1 }));
    });
    setDetail(null);
  };

  const handleRemoveQueue = id => {
    setQueue(prev => {
      const gone = prev.find(e => e.id === id);
      if (gone) toast(`${gone.name} removed from queue`, 'warn');
      return prev.filter(e => e.id !== id).map((e, i) => ({ ...e, position: i + 1 }));
    });
  };

  const handleRemoveBooking = id => {
    setBookings(prev => {
      const gone = prev.find(e => e.id === id);
      if (gone) toast(`${gone.name}'s booking cancelled`, 'warn');
      return prev.filter(e => e.id !== id);
    });
  };
  

  const handleMoveToQueue = id => {
    setBookings(prev => {
      const b = prev.find(e => e.id === id);
      if (!b) return prev;
      setQueue(q => {
        const newPos = q.length + 1;
        toast(`${b.name} moved booking → queue at #${newPos}`, 'info');
        return [...q, { id: b.id, name: b.name, phone: b.phone, service: b.service, barber: b.barber, position: newPos, joinedAt: Date.now(), source: 'booked', status: 'waiting' }];
      });
      return prev.map(e => e.id === id ? { ...e, status: 'in-queue' } : e);
    });
  };

  const totalWaitMins = queue.reduce((acc, e) => acc + (SERVICES.find(s => s.id === e.service)?.mins ?? AVG_CUT), 0);
  const tabs = [['queue', 'Active Queue'], ['bookings', 'Live Bookings'], ['stats', 'Analytics Stats']];

  return (
    
    <>
      <Navbar />

      <div className="min-h-screen pb-24 bg-[#FAF6F0] font-sans text-stone-800 antialiased flex flex-col">
        <Toast notif={notif} />
<header className="bg-[#FAF6F0] border-b border-[#EADBCE]/60 px-8 py-4 flex items-center justify-between z-30 shadow-xs">
  <div className="flex items-center gap-3.5">
    
    {/* ── ✅ THE CHIP INJECTION: PREMIUM RETRO GRADE EXIT TOGGLE BUTTON ── */}
    <button
      onClick={() => navigate("/")}
      className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-all duration-300 hover:opacity-85 group text-stone-800 bg-white px-3.5 py-2 rounded-xl border border-[#EADBCE] shadow-3xs cursor-pointer select-none mr-2"
    >
      <ArrowLeft size={12} className="transition-transform group-hover:-translate-x-0.5 text-[#C5A059]" />
      <span>Exit Panel</span>
    </button>

    {/* Your existing header details follow right here... */}
  </div>
</header>
      
          
          {/* Top Control Automation Elements */}
         
        

        {/* 📊 CORE GRID SUMMARY COUNTERS ROW */}
        <div className="bg-white border-b border-stone-200/40 shadow-2xs py-4 px-4">
          <div className="max-w-lg mx-auto grid grid-cols-4 gap-3">
            {[
              { v: queue.length,                                             l: 'In Queue',   c: 'text-[#3E362E]' },
              { v: bookings.filter(b => b.status === 'confirmed').length,    l: 'Bookings',   c: 'text-blue-600' },
              { v: servedCount,                                              l: 'Served',     c: 'text-emerald-700' },
              { v: `${totalWaitMins}m`,                                      l: 'Total Wait', c: 'text-[#A37B58]' },
            ].map(({ v, l, c }) => (
              <div key={l} className="text-center rounded-xl py-3 px-1 bg-[#FAF7F2] border border-stone-200/50 shadow-2xs">
                <p className={`font-black text-xl leading-none m-0 ${c}`}>{v}</p>
                <p className="text-[10px] font-bold uppercase tracking-wider text-stone-400 mt-1.5 leading-none">{l}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 📑 SWITCHER SEGMENTED TABS ROW */}
        <div className="bg-white/40 backdrop-blur-md border-b border-stone-200/30 px-4 py-2.5 sticky top-0 z-20 shadow-3xs">
          <div className="max-w-lg mx-auto flex gap-2 bg-stone-100/80 p-1 rounded-xl border border-stone-200/30">
            {tabs.map(([k, label]) => (
              <button 
                key={k} 
                onClick={() => setTab(k)}
                className={`flex-1 py-2.5 rounded-lg border-none font-bold text-xs uppercase tracking-wider cursor-pointer transition-all ${
                  tab === k 
                    ? 'bg-[#3E362E] text-white shadow-xs' 
                    : 'text-stone-500 hover:text-stone-800 hover:bg-stone-200/50'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* ── CENTRAL PIPELINE VIEWPORT CONTENT ── */}
        <div className="max-w-lg mx-auto w-full px-4 pt-6 flex-1">

          {/* QUEUE PIPELINE ACTION CONTENT */}
          {tab === 'queue' && (
            <div className="flex flex-col gap-3">
              {queue.length === 0 ? (
                <div className="bg-white border border-stone-200/40 rounded-3xl p-12 text-center shadow-xs">
                  <p className="font-extrabold text-stone-900 text-xl tracking-tight mb-1">Queue container empty</p>
                  <p className="text-stone-400 text-xs font-semibold uppercase tracking-wider mb-6">No walk-in lines active</p>
                  <button 
                    className="bg-[#3E362E] hover:bg-[#2A241F] text-white font-black text-xs uppercase tracking-widest px-6 py-3.5 rounded-xl cursor-pointer transition-colors"
                    onClick={() => setShowAdd(true)}
                  >
                    + Inject Customer
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {queue.map((entry, i) => (
                    <QueueRow 
                      key={entry.id} 
                      entry={entry} 
                      idx={i}
                      onClick={() => setDetail({ entry, type: 'queue' })}
                      onServe={handleServe} 
                    />
                  ))}
                </div>
              )}
              <button 
                className="bg-[#A37B58] hover:bg-[#8F6947] text-white font-black text-xs uppercase tracking-widest w-full mt-4 py-4 rounded-xl shadow-xs transition-colors cursor-pointer"
                onClick={() => setShowAdd(true)}
              >
                + Add Customer to Queue
              </button>
            </div>
          )}

          {/* BOOKINGS REGISTER PIPELINE ACTION CONTENT */}
          {tab === 'bookings' && (
            <div className="flex flex-col gap-3">
              <div className="flex justify-between items-center mb-1">
                <p className="text-[10px] font-black uppercase tracking-widest text-[#A37B58]">Upcoming Registry</p>
                <button 
                  onClick={() => setShowAdd(true)}
                  className="bg-white border border-stone-200 hover:border-stone-400 text-stone-700 font-bold text-xs px-3.5 py-2 rounded-xl transition-colors cursor-pointer"
                >
                  + Create Slot
                </button>
              </div>
              {bookings.length === 0 ? (
                <div className="bg-white border border-stone-200/40 rounded-3xl p-12 text-center shadow-xs">
                  <p className="text-stone-400 text-xs font-semibold uppercase tracking-wider">No appointment logs active</p>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {bookings.map((entry, i) => (
                    <BookingRow 
                      key={entry.id} 
                      entry={entry} 
                      idx={i}
                      onClick={() => setDetail({ entry, type: 'booking' })}
                      onMoveToQueue={handleMoveToQueue} 
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ANALYTICS WORKLOAD TAB */}
          {tab === 'stats' && (
            <StatsPanel queue={queue} bookings={bookings} servedCount={servedCount} liveActive={liveActive} />
          )}
        </div>

        {/* ── PORTAL MODAL DRIVERS ── */}
        {showAdd && <AddCustomerModal onClose={() => setShowAdd(false)} onAdd={handleAdd} />}
        {detail?.type === 'queue' && (
          <DetailModal entry={detail.entry} isQueue onClose={() => setDetail(null)} onServe={handleServe} onRemove={handleRemoveQueue} />
        )}
        {detail?.type === 'booking' && (
          <DetailModal entry={detail.entry} isQueue={false} onClose={() => setDetail(null)} onServe={() => {}} onRemove={handleRemoveBooking} />
        )}
      </div>

      <Footer />
    </>
  );
}