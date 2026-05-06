import React from 'react';
import { Tag, Badge } from './Atoms';
import { BARBERS, SERVICES } from '../constants';
import { fmtWait, timeAgo } from '../utils';

export default function QueueRow({ entry, idx, onClick, onServe }) {
  const barber  = BARBERS.find((b) => b.id === entry.barber);
  const svc     = SERVICES.find((s) => s.id === entry.service);
  const isFirst = entry.position === 1;

  return (
    <div
      onClick={onClick}
      className={`flex items-center gap-3 rounded-2xl px-4 py-3 cursor-pointer border transition-all ${
        isFirst
          ? 'bg-gradient-to-r from-green-950 to-green-900 border-green-600 shadow-lg shadow-green-900/20'
          : 'bg-gradient-to-r from-stone-900 to-stone-800 border-stone-700 hover:border-stone-600'
      }`}
      style={{ animationDelay: `${idx * 0.06}s` }}
    >
      <div className={`w-9 h-9 rounded-xl flex-shrink-0 flex items-center justify-center font-mono font-black text-sm border ${
        isFirst
          ? 'bg-green-900/40 border-green-500 text-green-400'
          : 'bg-white/5 border-stone-600 text-stone-500'
      }`}>
        {entry.position}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="font-sans font-bold text-stone-100 text-sm">{entry.name}</span>
          <Tag src={entry.source} />
          {isFirst && <Badge color="#22c55e">NEXT</Badge>}
        </div>
        <p className="font-sans text-xs text-stone-500 mt-0.5 m-0">
          {barber?.emoji} {barber?.name} · {svc?.label}
        </p>
      </div>

      <div className="text-right flex-shrink-0">
        <p className={`font-mono font-bold text-sm m-0 ${isFirst ? 'text-green-400' : 'text-stone-400'}`}>
          {fmtWait(entry.position, entry.service)}
        </p>
        <p className="font-sans text-[10px] text-stone-600 m-0">{timeAgo(entry.joinedAt)}</p>
      </div>

      {isFirst && (
        <button
          onClick={(e) => { e.stopPropagation(); onServe(entry.id); }}
          className="bg-green-500 text-green-950 border-none rounded-lg px-2.5 py-1.5 font-sans font-black text-xs cursor-pointer flex-shrink-0 hover:bg-green-400 transition-colors"
        >SERVE</button>
      )}
    </div>
  );
}