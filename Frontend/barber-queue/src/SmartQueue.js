import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Dot, Toast } from './components/Atoms';
import AddCustomerModal from './components/AddCustomerModal';
import DetailModal from './components/DetailModal';
import QueueRow from './components/QueueRow';
import BookingRow from './components/BookingRow';
import StatsTab from './components/StatsTab';
import { initQueue, initBookings, SERVICES, AVG_CUT } from './constants';

export default function SmartQueue() {
  const [queue,       setQueue]       = useState(initQueue);
const [bookings, setBookings] = useState(() => initBookings());
  // const [bookings,    setBookings]    = useState(initBookings);
  const [tab,         setTab]         = useState('queue');
  const [showAdd,     setShowAdd]     = useState(false);
  const [detail,      setDetail]      = useState(null);
  const [notif,       setNotif]       = useState(null);
  const [liveActive,  setLiveActive]  = useState(true);
  const [servedCount, setServedCount] = useState(0);
  const notifRef = useRef();

  const toast = useCallback((msg, type = 'info') => {
    setNotif({ msg, type });
    clearTimeout(notifRef.current);
    notifRef.current = setTimeout(() => setNotif(null), 3500);
  }, []);

  useEffect(() => {
    if (!liveActive) return;
    const t = setInterval(() => {
      setQueue((prev) => {
        if (prev.length === 0) return prev;
        const [done, ...rest] = prev;
        toast(`${done.name} has been served `, 'success');
        setServedCount((n) => n + 1);
        return rest.map((e, i) => ({ ...e, position: i + 1 }));
      });
    }, 18000);
    return () => clearInterval(t);
  }, [liveActive, toast]);

  // useEffect(() => {
  //   if (!liveActive) return;
  //   const t = setInterval(() => {
  //     setBookings((prev) => {
  //       const toMove = prev.find((b) => b.status === 'confirmed');
  //       if (!toMove) return prev;
  //       setQueue((q) => {
  //         const newPos = q.length + 1;
  //         toast(`📅 ${toMove.name}'s booking auto-moved to queue at #${newPos}`, 'info');
  //         return [...q, {
  //           id: toMove.id, name: toMove.name, phone: toMove.phone,
  //           service: toMove.service, barber: toMove.barber,
  //           position: newPos, joinedAt: Date.now(), source: 'booked', status: 'waiting',
  //         }];
  //       });
  //       return prev.map((b) => b.id === toMove.id ? { ...b, status: 'in-queue' } : b);
  //     });
  //   }, 30000);
  //   return () => clearInterval(t);
  // }, [liveActive, toast]);
  useEffect(() => {
  if (!liveActive) return;
  const t = setInterval(() => {
    setBookings((prev) => {
      const toMove = prev.find((b) => b.status === 'confirmed');
      if (!toMove) return prev;

      const updated = prev.map((b) =>
        b.id === toMove.id ? { ...b, status: 'in-queue' } : b
      );

      setQueue((q) => {
        const alreadyInQueue = q.some((e) => e.id === toMove.id);
        if (alreadyInQueue) return q;
        const newPos = q.length + 1;
        toast(`${toMove.name}'s booking auto-moved to queue at #${newPos}`, 'info');
        return [...q, {
          id: toMove.id, name: toMove.name, phone: toMove.phone,
          service: toMove.service, barber: toMove.barber,
          position: newPos, joinedAt: Date.now(), source: 'booked', status: 'waiting',
        }];
      });

      return updated;
    });
  }, 30000);
  return () => clearInterval(t);
}, [liveActive, toast]);

  const handleAdd = ({ type, entry }) => {
    if (type === 'queue') {
      setQueue((prev) => [...prev, { ...entry, position: prev.length + 1 }]);
      toast(`${entry.name} added to queue 🎉`, 'success');
    } else {
      setBookings((prev) => [...prev, entry]);
      toast(`Booking confirmed for ${entry.name} at ${entry.slot} 📅`, 'success');
    }
  };

  const handleServe = (id) => {
    setQueue((prev) => {
      const done = prev.find((e) => e.id === id);
      if (done) { toast(`${done.name} served! ✅`, 'success'); setServedCount((n) => n + 1); }
      return prev.filter((e) => e.id !== id).map((e, i) => ({ ...e, position: i + 1 }));
    });
    setDetail(null);
  };

  const handleRemoveQueue = (id) => {
    setQueue((prev) => {
      const gone = prev.find((e) => e.id === id);
      if (gone) toast(`${gone.name} removed from queue`, 'warn');
      return prev.filter((e) => e.id !== id).map((e, i) => ({ ...e, position: i + 1 }));
    });
  };

  const handleRemoveBooking = (id) => {
    setBookings((prev) => {
      const gone = prev.find((e) => e.id === id);
      if (gone) toast(`${gone.name}'s booking cancelled`, 'warn');
      return prev.filter((e) => e.id !== id);
    });
  };

  const handleMoveToQueue = (id) => {
    setBookings((prev) => {
      const b = prev.find((e) => e.id === id);
      if (!b) return prev;
      setQueue((q) => {
        const newPos = q.length + 1;
        toast(`${b.name} moved from booking → queue at #${newPos}`, 'info');
        return [...q, {
          id: b.id, name: b.name, phone: b.phone,
          service: b.service, barber: b.barber,
          position: newPos, joinedAt: Date.now(), source: 'booked', status: 'waiting',
        }];
      });
      return prev.map((e) => e.id === id ? { ...e, status: 'in-queue' } : e);
    });
  };

  const totalWaitMins = queue.reduce(
    (acc, e) => acc + (SERVICES.find((s) => s.id === e.service)?.mins ?? AVG_CUT), 0
  );

  const tabs = [['queue', 'Queue'], ['bookings', 'Bookings'], ['stats', 'Stats']];

  return (
    <div className="min-h-screen bg-[#080807] font-sans pb-20">
      <Toast notif={notif} />

      //<div className="bg-gradient-to-b from-neutral-900 to-[#080807] border-b border-stone-900 px-4 pt-5 pb-0 sticky top-0 z-50">
        <div className="max-w-lg mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="font-mono text-stone-600 text-[20px] tracking-widest uppercase m-0">Smart Queue System</p>
              <h1 className="font-sans font-extrabold text-stone-100 text-xl tracking-tight m-0">Barber Shop </h1>
            </div>
            <div className="flex items-center gap-2.5">
              <button
                onClick={() => { setLiveActive((v) => !v); toast(liveActive ? 'Live updates paused' : 'Live updates resumed', 'info'); }}
                className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 border font-sans font-bold text-xs cursor-pointer transition-all ${
                  liveActive
                    ? 'bg-green-500/10 border-green-500 text-green-400'
                    : 'bg-red-500/10 border-red-500 text-red-400'
                }`}
              >
                <Dot color={liveActive ? '#22c55e' : '#ef4444'} size={7} />
                {liveActive ? 'LIVE' : 'PAUSED'}
              </button>
              <button
                onClick={() => setShowAdd(true)}
                className="w-9 h-9 rounded-xl border-none bg-gradient-to-br from-indigo-500 to-violet-500 text-white text-2xl cursor-pointer shadow-lg shadow-indigo-500/40 flex items-center justify-center font-light hover:opacity-90 transition-opacity"
              >+</button>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-2 mb-4">
            {[
              { v: queue.length, l: 'Queue', c: 'text-amber-400' },
              { v: bookings.filter((b) => b.status === 'confirmed').length, l: 'Bookings', c: 'text-sky-400' },
              { v: servedCount, l: 'Served', c: 'text-green-400' },
              { v: `${totalWaitMins}m`, l: 'Total Wait', c: 'text-violet-400' },
            ].map(({ v, l, c }) => (
              <div key={l} className="bg-neutral-900 border border-stone-800 rounded-xl py-2 px-1 text-center">
                <p className={`font-mono font-black text-base m-0 ${c}`}>{v}</p>
                <p className="font-sans text-[10px] text-stone-600 mt-0.5 m-0">{l}</p>
              </div>
            ))}
          </div>

          <div className="flex gap-0.5">
            {tabs.map(([k, label]) => (
              <button
                key={k}
                onClick={() => setTab(k)}
                className={`flex-1 py-2.5 border-none font-sans font-bold text-sm rounded-t-lg cursor-pointer transition-all duration-200 ${
                  tab === k
                    ? 'bg-stone-100 text-stone-900'
                    : 'bg-transparent text-stone-600 hover:text-stone-400'
                }`}
              >{label}</button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-3.5 pt-5">
        {tab === 'queue' && (
          <>
            {queue.length === 0 ? (
              <div className="bg-neutral-900 border border-stone-800 rounded-2xl p-10 text-center">
                <div className="text-5xl mb-3"></div>
                <p className="font-sans font-bold text-stone-100 text-lg mb-1.5">Queue is empty!</p>
                <p className="font-sans text-stone-600 text-sm mb-5">Add a customer or wait for walk-ins</p>
                <button
                  onClick={() => setShowAdd(true)}
                  className="px-7 py-3 bg-gradient-to-r from-indigo-500 to-violet-500 text-white border-none rounded-xl font-sans font-bold text-base cursor-pointer hover:opacity-90 transition-opacity"
                >+ Add Customer</button>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {queue.map((entry, i) => (
                  <QueueRow
                    key={entry.id} entry={entry} idx={i}
                    onClick={() => setDetail({ entry, type: 'queue' })}
                    onServe={handleServe}
                  />
                ))}
              </div>
            )}
            <button
              onClick={() => setShowAdd(true)}
              className="w-full mt-4 py-4 bg-gradient-to-r from-indigo-500 to-violet-500 text-white border-none rounded-2xl font-sans font-extrabold text-base cursor-pointer shadow-xl shadow-indigo-500/30 hover:opacity-90 transition-opacity"
            >Add Customer to Queue</button>
          </>
        )}

        {tab === 'bookings' && (
          <>
            <div className="flex justify-between items-center mb-3">
              <p className="font-sans font-bold text-stone-400 text-xs tracking-widest uppercase m-0">
                Upcoming Appointments
              </p>
              <button
                onClick={() => setShowAdd(true)}
                className="bg-sky-500/10 text-sky-400 border border-sky-600 rounded-lg px-3 py-1.5 font-sans font-bold text-xs cursor-pointer hover:bg-sky-500/20 transition-colors"
              >+ Book</button>
            </div>
            {bookings.length === 0 ? (
              <div className="bg-neutral-900 border border-stone-800 rounded-2xl p-9 text-center">
                <div className="text-4xl mb-2.5"></div>
                <p className="font-sans text-stone-600 text-sm">No upcoming bookings</p>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {bookings.map((entry, i) => (
                  <BookingRow
                    key={entry.id} entry={entry} idx={i}
                    onClick={() => setDetail({ entry, type: 'booking' })}
                    onMoveToQueue={handleMoveToQueue}
                  />
                ))}
              </div>
            )}
          </>
        )}

        {tab === 'stats' && (
          <StatsTab queue={queue} bookings={bookings} servedCount={servedCount} liveActive={liveActive} />
        )}
      </div>

      {showAdd && (
        <AddCustomerModal onClose={() => setShowAdd(false)} onAdd={handleAdd} queue={queue} />
      )}
      {detail?.type === 'queue' && (
        <DetailModal entry={detail.entry} isQueue onClose={() => setDetail(null)} onServe={handleServe} onRemove={handleRemoveQueue} />
      )}
      {detail?.type === 'booking' && (
        <DetailModal entry={detail.entry} isQueue={false} onClose={() => setDetail(null)} onServe={() => {}} onRemove={handleRemoveBooking} />
      )}
    </div>
  );
}