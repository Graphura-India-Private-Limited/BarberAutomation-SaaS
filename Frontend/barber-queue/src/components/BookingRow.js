import React from 'react';
import { BARBERS, SERVICES } from '../constants';

export default function BookingRow({ entry, idx, onClick, onMoveToQueue }) {
  const barber = BARBERS.find((b) => b.id === entry.barber);
  const svc    = SERVICES.find((s) => s.id === entry.service);
  const inQueue = entry.status === 'in-queue';

  return (
    <div
      onClick={onClick}
      className={`flex items-center gap-3 rounded-2xl px-4 py-3 cursor-pointer border transition-all ${
        inQueue
          ? 'bg-stone-900/50 border-stone-800 opacity-60'
          : 'bg-gradient-to-r from-stone-900 to-stone-800 border-stone-700 hover:border-stone-600'
      }`}
    >
      <div className="bg-sky-500/10 border border-sky-600 rounded-xl px-2.5 py-1.5 flex-shrink-0">
        <p className="font-mono font-bold text-sky-400 text-xs m-0">{entry.slot}</p>
        <p className="font-sans text-[10px] text-sky-600 m-0">{entry.date}</p>
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <span className="font-sans font-bold text-stone-100 text-sm">{entry.name}</span>
          {inQueue && (
            <span className="text-[10px] px-1.5 py-0.5 rounded border border-stone-600 text-stone-500 font-mono">
              in queue
            </span>
          )}
        </div>
        <p className="font-sans text-xs text-stone-500 mt-0.5 m-0">
          {barber?.emoji} {barber?.name} · {svc?.label}
        </p>
      </div>

      {!inQueue && (
        <button
          onClick={(e) => { e.stopPropagation(); onMoveToQueue(entry.id); }}
          className="bg-sky-500/10 text-sky-400 border border-sky-600 rounded-lg px-2.5 py-1.5 font-sans font-bold text-xs cursor-pointer flex-shrink-0 hover:bg-sky-500/20 transition-colors"
        >→ Queue</button>
      )}
    </div>
  );
}