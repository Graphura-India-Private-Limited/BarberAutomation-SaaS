
import React, { useState, useEffect, useRef, useCallback } from "react";

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
}  from "../../Components/Modals";

import "../../styles/smart-queue.css";

// ─── QUEUE ROW ────────────────────────────────────────────────────────────────
function QueueRow({ entry, idx, onClick, onServe }) {
  const barber  = BARBERS.find(b => b.id === entry.barber);
  const svc     = SERVICES.find(s => s.id === entry.service);
  const isFirst = entry.position === 1;

  return (
    <div
      onClick={onClick}
      className={`animate-slide-up flex items-center gap-3 px-4 py-3.5 cursor-pointer ${isFirst ? 'card-active' : 'card'}`}
      style={{ animationDelay: `${idx * 0.07}s` }}
    >
      {/* Position Badge */}
      <div className="w-11 h-11 rounded-xl flex-shrink-0 flex items-center justify-center font-mono-q font-black text-base"
        style={{
          background: isFirst ? '#ea580c' : '#fff7ed',
          border: `2px solid ${isFirst ? '#c2410c' : '#fed7aa'}`,
          color: isFirst ? '#fff' : '#c2410c',
        }}>
        {entry.position}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap mb-1">
          <span className="font-bold text-orange-950 text-[15px] leading-tight">{entry.name}</span>
          <SourceTag src={entry.source} />
          {isFirst && <Chip color="#16a34a">● NEXT UP</Chip>}
        </div>
        <p className="text-[13px] text-orange-600 font-medium">
          {barber?.emoji} {barber?.name} &nbsp;·&nbsp; {svc?.label}
        </p>
      </div>

      {/* Wait time */}
      <div className="text-right flex-shrink-0 mr-1">
        <p className="font-mono-q font-black text-[15px]" style={{ color: isFirst ? '#ea580c' : '#9a3412' }}>
          {fmtWait(entry.position, entry.service)}
        </p>
        <p className="text-[11px] text-orange-400 font-medium">{timeAgo(entry.joinedAt)}</p>
      </div>

      {/* Serve button (first only) */}
      {isFirst && (
        <button
          onClick={e => { e.stopPropagation(); onServe(entry.id); }}
          className="btn-primary px-3 py-2 text-[13px] flex-shrink-0"
          style={{ borderRadius:10 }}>
          SERVE
        </button>
      )}
    </div>
  );
}

// ─── BOOKING ROW ──────────────────────────────────────────────────────────────
function BookingRow({ entry, idx, onClick, onMoveToQueue }) {
  const barber  = BARBERS.find(b => b.id === entry.barber);
  const svc     = SERVICES.find(s => s.id === entry.service);
  const inQueue = entry.status === 'in-queue';
  const statusStyles = {
    confirmed: { bg:'#eff6ff', border:'#93c5fd', color:'#1d4ed8' },
    'in-queue':{ bg:'#fff7ed', border:'#fdba74', color:'#c2410c' },
    cancelled: { bg:'#fef2f2', border:'#fca5a5', color:'#dc2626' },
  };
  const ss = statusStyles[entry.status] ?? statusStyles.confirmed;

  return (
    <div
      onClick={onClick}
      className="animate-slide-up card flex items-center gap-3 px-4 py-3.5 cursor-pointer"
      style={{ animationDelay: `${idx * 0.07}s` }}
    >
      {/* Slot bubble */}
      <div className="w-14 flex-shrink-0 text-center rounded-xl py-2"
        style={{ background:'#fff7ed', border:'2px solid #fed7aa' }}>
        <p className="font-mono-q font-black text-[12px] text-orange-600 leading-tight">{entry.slot.split(' ')[0]}</p>
        <p className="font-mono-q text-[10px] text-orange-400">{entry.slot.split(' ')[1]}</p>
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap mb-1">
          <span className="font-bold text-orange-950 text-[15px]">{entry.name}</span>
          <span className="text-[11px] font-bold px-2 py-0.5 rounded-full capitalize"
            style={{ background:ss.bg, border:`1.5px solid ${ss.border}`, color:ss.color }}>
            {entry.status}
          </span>
        </div>
        <p className="text-[13px] text-orange-600 font-medium">
          {barber?.emoji} {barber?.name} &nbsp;·&nbsp; {svc?.label}
        </p>
      </div>

      {/* Action */}
      {!inQueue
        ? <button onClick={e => { e.stopPropagation(); onMoveToQueue(entry.id); }}
            className="btn-primary px-3 py-2 text-[13px] flex-shrink-0 whitespace-nowrap"
            style={{ borderRadius:10 }}>
            → Queue
          </button>
        : <span className="text-[12px] font-bold text-orange-500 flex-shrink-0"> In Queue</span>
      }
    </div>
  );
}

// ─── STATS TAB ────────────────────────────────────────────────────────────────
function StatsPanel({ queue, bookings, servedCount, liveActive }) {
  const totalWait = queue.reduce((acc,e) => acc + (SERVICES.find(s=>s.id===e.service)?.mins ?? AVG_CUT), 0);

  return (
    <div className="flex flex-col gap-4 animate-slide-up">
      {/* Barber Cards */}
      <p className="text-xs font-bold uppercase tracking-widest text-orange-500 mt-1">Barber Workload</p>
      <div className="flex flex-col gap-3">
        {BARBERS.map(b => {
          const assigned = queue.filter(e => e.barber === b.id).length;
          const pct = Math.min(100, queue.length > 0 ? (assigned/queue.length)*100 : 0);
          return (
            <div key={b.id} className="card p-4">
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{b.emoji}</span>
                  <span className="font-bold text-orange-950 text-[15px]">{b.name}</span>
                </div>
                <Chip color={b.color}>{assigned} clients</Chip>
              </div>
              <div className="rounded-full h-2.5 overflow-hidden" style={{ background:'#ffedd5', border:'1.5px solid #fed7aa' }}>
                <div className="h-full rounded-full transition-all duration-700"
                  style={{ background: b.color, width:`${pct}%` }} />
              </div>
              <div className="flex justify-between mt-1.5">
                <span className="text-[12px] text-orange-400 font-medium">Queue load</span>
                <span className="font-mono-q text-[12px] text-orange-600 font-bold">{Math.round(pct)}%</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary */}
      <div className="card p-4">
        <p className="font-bold text-orange-950 text-[15px] mb-3">Session Summary</p>
        {[
          ['Customers served',  servedCount],
          ['Currently waiting', queue.length],
          ['Pending bookings',  bookings.filter(b=>b.status==='confirmed').length],
          ['Total queue wait',  `${totalWait} mins`],
          ['Avg service time',  `${AVG_CUT} mins`],
          ['Live updates',      liveActive ? '● Active' : '⏸ Paused'],
        ].map(([k,v]) => (
          <div key={k} className="flex justify-between py-2.5 border-b last:border-0" style={{ borderColor:'#ffedd5' }}>
            <span className="text-[14px] text-orange-600 font-medium">{k}</span>
            <span className="font-mono-q text-[14px] text-orange-950 font-bold">{v}</span>
          </div>
        ))}
      </div>

      {/* Services */}
      <div className="card p-4">
        <p className="font-bold text-orange-950 text-[15px] mb-3"> Services Breakdown</p>
        {SERVICES.map(s => {
          const count = queue.filter(e=>e.service===s.id).length;
          return (
            <div key={s.id} className="flex justify-between items-center py-2.5 border-b last:border-0" style={{ borderColor:'#ffedd5' }}>
              <span className="text-[14px] text-orange-800 font-semibold">{s.label}</span>
              <div className="flex items-center gap-2">
                <span className="font-mono-q text-[12px] text-orange-400">{s.mins}m</span>
                <Chip color="#ea580c">{count}</Chip>
              </div>
            </div>
          );
        })}
      </div>

      <div className="rounded-2xl p-4 flex items-center gap-3" style={{ background:'#fff7ed', border:'2px solid #fed7aa' }}>
        <span className="text-orange-400 text-lg">⏱</span>
        <p className="text-[13px] text-orange-700 font-medium leading-snug">
          Queue auto-advances every <strong>18s</strong> · Bookings auto-queue every <strong>30s</strong> when live.
        </p>
      </div>
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function SmartQueue() {
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
        setServedCount(n => n+1);
        return rest.map((e,i) => ({ ...e, position:i+1 }));
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
        const updated = prev.map(b => b.id===toMove.id ? { ...b, status:'in-queue' } : b);
        setQueue(q => {
          if (q.some(e => e.id===toMove.id)) return q;
          const newPos = q.length + 1;
          toast(`${toMove.name}'s booking moved to queue at #${newPos}`, 'info');
          return [...q, { id:toMove.id, name:toMove.name, phone:toMove.phone, service:toMove.service, barber:toMove.barber, position:newPos, joinedAt:Date.now(), source:'booked', status:'waiting' }];
        });
        return updated;
      });
    }, 30000);
    return () => clearInterval(t);
  }, [liveActive, toast]);

  const handleAdd = ({ type, entry }) => {
    if (type === 'queue') {
      setQueue(prev => [...prev, { ...entry, position:prev.length+1 }]);
      toast(`${entry.name} added to queue `, 'success');
    } else {
      setBookings(prev => [...prev, entry]);
      toast(`Booking confirmed for ${entry.name} at ${entry.slot} `, 'success');
    }
  };

  const handleServe = id => {
    setQueue(prev => {
      const done = prev.find(e => e.id===id);
      if (done) { toast(`${done.name} served! `, 'success'); setServedCount(n=>n+1); }
      return prev.filter(e=>e.id!==id).map((e,i) => ({ ...e, position:i+1 }));
    });
    setDetail(null);
  };

  const handleRemoveQueue = id => {
    setQueue(prev => {
      const gone = prev.find(e => e.id===id);
      if (gone) toast(`${gone.name} removed from queue`, 'warn');
      return prev.filter(e=>e.id!==id).map((e,i) => ({ ...e, position:i+1 }));
    });
  };

  const handleRemoveBooking = id => {
    setBookings(prev => {
      const gone = prev.find(e => e.id===id);
      if (gone) toast(`${gone.name}'s booking cancelled`, 'warn');
      return prev.filter(e=>e.id!==id);
    });
  };

  const handleMoveToQueue = id => {
    setBookings(prev => {
      const b = prev.find(e=>e.id===id);
      if (!b) return prev;
      setQueue(q => {
        const newPos = q.length+1;
        toast(`${b.name} moved booking → queue at #${newPos}`, 'info');
        return [...q, { id:b.id, name:b.name, phone:b.phone, service:b.service, barber:b.barber, position:newPos, joinedAt:Date.now(), source:'booked', status:'waiting' }];
      });
      return prev.map(e => e.id===id ? { ...e, status:'in-queue' } : e);
    });
  };

  const totalWaitMins = queue.reduce((acc,e) => acc + (SERVICES.find(s=>s.id===e.service)?.mins ?? AVG_CUT), 0);
  const tabs = [['queue','Queue'],['bookings','Bookings'],['stats','Stats']];

  return (
    <div className="min-h-screen pb-24" style={{ background:'#fff7ed' }}>
      <Toast notif={notif} />

      {/* ── STICKY HEADER ── */}
      <div className="sticky top-0 z-50 px-4 pt-5 pb-0"
        style={{ background:'linear-gradient(to bottom, #ffffff 60%, #fff7ed)', borderBottom:'2px solid #fed7aa', boxShadow:'0 2px 12px rgba(194,65,12,0.1)' }}>
        <div className="max-w-lg mx-auto">

          {/* Title Row */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-widest text-orange-400 mb-0.5">Smart Queue System</p>
              <h1 className="font-display font-black text-orange-950 leading-tight" style={{ fontSize:22 }}>
                 Barber Shop
              </h1>
            </div>
            <div className="flex items-center gap-2.5">
              {/* Live Toggle */}
              <button
                onClick={() => { setLiveActive(v=>!v); toast(liveActive ? 'Live updates paused' : 'Live updates resumed', 'info'); }}
                className="flex items-center gap-2 rounded-full px-3.5 py-2 font-bold text-[12px] cursor-pointer transition-all border-2"
                style={liveActive
                  ? { background:'#f0fdf4', borderColor:'#16a34a', color:'#15803d' }
                  : { background:'#fef2f2', borderColor:'#dc2626', color:'#dc2626' }
                }>
                <LiveDot active={liveActive} />
                {liveActive ? 'LIVE' : 'PAUSED'}
              </button>
              {/* Add Button */}
              <button onClick={() => setShowAdd(true)}
                className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-2xl font-light cursor-pointer transition-all hover:scale-105"
                style={{ background:'linear-gradient(135deg,#ea580c,#f97316)', border:'none', boxShadow:'0 4px 14px rgba(234,88,12,0.4)' }}>
                +
              </button>
            </div>
          </div>

          {/* Stats Strip */}
          <div className="grid grid-cols-4 gap-2 mb-4">
            {[
              { v: queue.length,                                             l:'In Queue',   c:'#d97706' },
              { v: bookings.filter(b=>b.status==='confirmed').length,        l:'Bookings',   c:'#0284c7' },
              { v: servedCount,                                              l:'Served',     c:'#16a34a' },
              { v: `${totalWaitMins}m`,                                      l:'Total Wait', c:'#ea580c' },
            ].map(({ v,l,c }) => (
              <div key={l} className="text-center rounded-2xl py-2.5 px-1"
                style={{ background:'#fff', border:'2px solid #fed7aa', boxShadow:'0 1px 6px rgba(194,65,12,0.07)' }}>
                <p className="font-mono-q font-black text-[17px] leading-tight m-0" style={{ color:c }}>{v}</p>
                <p className="text-[10px] font-semibold text-orange-500 mt-0.5 leading-tight">{l}</p>
              </div>
            ))}
          </div>

          {/* Tabs */}
          <div className="flex gap-1">
            {tabs.map(([k,label]) => (
              <button key={k} onClick={() => setTab(k)}
                className={`flex-1 py-2.5 border-none font-bold text-[14px] cursor-pointer transition-all duration-200 ${tab===k ? 'tab-active' : 'tab-inactive'}`}>
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── CONTENT ── */}
      <div className="max-w-lg mx-auto px-4 pt-5">

        {/* QUEUE TAB */}
        {tab === 'queue' && (
          <>
            {queue.length === 0 ? (
              <div className="card p-12 text-center">
                <div className="text-5xl mb-3"></div>
                <p className="font-display font-bold text-orange-950 text-xl mb-1.5">Queue is empty!</p>
                <p className="text-orange-500 text-[14px] font-medium mb-6">Add a customer or wait for walk-ins</p>
                <button className="btn-primary px-8 py-3.5" onClick={() => setShowAdd(true)}>+ Add Customer</button>
              </div>
            ) : (
              <div className="flex flex-col gap-2.5">
                {queue.map((entry,i) => (
                  <QueueRow key={entry.id} entry={entry} idx={i}
                    onClick={() => setDetail({ entry, type:'queue' })}
                    onServe={handleServe} />
                ))}
              </div>
            )}
            <button className="btn-primary w-full mt-4 py-4" onClick={() => setShowAdd(true)}>
              + Add Customer to Queue
            </button>
          </>
        )}

        {/* BOOKINGS TAB */}
        {tab === 'bookings' && (
          <>
            <div className="flex justify-between items-center mb-3">
              <p className="text-[12px] font-bold uppercase tracking-widest text-orange-500">Upcoming Appointments</p>
              <button onClick={() => setShowAdd(true)}
                className="px-3.5 py-1.5 rounded-xl font-bold text-[13px] cursor-pointer transition-colors"
                style={{ background:'#eff6ff', border:'2px solid #93c5fd', color:'#1d4ed8' }}>
                + Book
              </button>
            </div>
            {bookings.length === 0 ? (
              <div className="card p-10 text-center">
                <div className="text-4xl mb-2.5"></div>
                <p className="text-orange-500 font-medium text-[14px]">No upcoming bookings</p>
              </div>
            ) : (
              <div className="flex flex-col gap-2.5">
                {bookings.map((entry,i) => (
                  <BookingRow key={entry.id} entry={entry} idx={i}
                    onClick={() => setDetail({ entry, type:'booking' })}
                    onMoveToQueue={handleMoveToQueue} />
                ))}
              </div>
            )}
          </>
        )}

        {/* STATS TAB */}
        {tab === 'stats' && (
          <StatsPanel queue={queue} bookings={bookings} servedCount={servedCount} liveActive={liveActive} />
        )}
      </div>

      {/* ── MODALS ── */}
      {showAdd && <AddCustomerModal onClose={() => setShowAdd(false)} onAdd={handleAdd} />}
      {detail?.type === 'queue' && (
        <DetailModal entry={detail.entry} isQueue onClose={() => setDetail(null)} onServe={handleServe} onRemove={handleRemoveQueue} />
      )}
      {detail?.type === 'booking' && (
        <DetailModal entry={detail.entry} isQueue={false} onClose={() => setDetail(null)} onServe={() => {}} onRemove={handleRemoveBooking} />
      )}
    </div>
  );
}
