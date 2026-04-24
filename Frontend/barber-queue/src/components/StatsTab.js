import React from 'react';
import { Badge, Dot } from './Atoms';
import { BARBERS, SERVICES, AVG_CUT } from '../constants';

export default function StatsTab({ queue, bookings, servedCount, liveActive }) {
  const totalWaitMins = queue.reduce(
    (acc, e) => acc + (SERVICES.find((s) => s.id === e.service)?.mins ?? AVG_CUT), 0
  );

  return (
    <div className="flex flex-col gap-3">
      <p className="font-sans font-bold text-stone-400 text-xs tracking-widest uppercase mb-0 mt-1">
        Barber Workload
      </p>

      {BARBERS.map((b) => {
        const assigned = queue.filter((e) => e.barber === b.id).length;
        const pct = Math.min(100, queue.length > 0 ? (assigned / queue.length) * 100 : 0);
        return (
          <div key={b.id} className="bg-neutral-900 border border-stone-800 rounded-2xl p-4">
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center gap-2">
                <span className="text-xl">{b.emoji}</span>
                <span className="font-sans font-bold text-stone-100 text-base">{b.name}</span>
              </div>
              <Badge color={b.color}>{assigned} clients</Badge>
            </div>
            <div className="bg-stone-800 rounded-full h-2">
              <div
                className="h-2 rounded-full transition-all duration-700"
                style={{ background: b.color, width: `${pct}%` }}
              />
            </div>
            <div className="flex justify-between mt-1.5">
              <span className="font-sans text-[11px] text-stone-600">Queue load</span>
              <span className="font-mono text-[11px] text-stone-500">{Math.round(pct)}%</span>
            </div>
          </div>
        );
      })}

      <div className="bg-neutral-900 border border-stone-800 rounded-2xl p-4">
        <p className="font-sans font-bold text-stone-100 text-sm mb-3">📊 Session Summary</p>
        {[
          ['Customers served',  servedCount],
          ['Currently waiting', queue.length],
          ['Pending bookings',  bookings.filter((b) => b.status === 'confirmed').length],
          ['Total queue wait',  `${totalWaitMins} mins`],
          ['Avg service time',  `${AVG_CUT} mins`],
          ['Live updates',      liveActive ? 'Active ✅' : 'Paused ⏸'],
        ].map(([k, v]) => (
          <div key={k} className="flex justify-between py-2 border-b border-stone-800 last:border-0">
            <span className="font-sans text-stone-500 text-sm">{k}</span>
            <span className="font-mono text-stone-300 text-sm font-semibold">{v}</span>
          </div>
        ))}
      </div>

      <div className="bg-neutral-900 border border-stone-800 rounded-2xl p-4">
        <p className="font-sans font-bold text-stone-100 text-sm mb-3">🔧 Services Breakdown</p>
        {SERVICES.map((s) => {
          const count = queue.filter((e) => e.service === s.id).length;
          return (
            <div key={s.id} className="flex justify-between items-center py-2 border-b border-stone-800 last:border-0">
              <span className="font-sans text-stone-500 text-sm">{s.label}</span>
              <div className="flex items-center gap-2">
                <span className="font-mono text-stone-600 text-xs">{s.mins}min · ${s.price}</span>
                <Badge color="#a78bfa">{count}</Badge>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 flex items-center gap-3">
        <Dot color="#38bdf8" size={8} />
        <p className="font-sans text-sm text-slate-500 m-0">
          Queue auto-advances every 18s · Bookings auto-queue every 30s when live is active.
        </p>
      </div>
    </div>
  );
}