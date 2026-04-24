import React from 'react';
import { Modal } from './Modal';
import { BARBERS, SERVICES } from '../constants';
import { timeAgo, fmtWait } from '../utils';

export default function DetailModal({ entry, isQueue, onClose, onServe, onRemove }) {
  const barber = BARBERS.find((b) => b.id === entry.barber);
  const svc    = SERVICES.find((s) => s.id === entry.service);

  return (
    <Modal title="Customer Details" onClose={onClose}>
      <div className="bg-stone-800/50 rounded-2xl p-4 mb-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-xl">
            💈
          </div>
          <div>
            <p className="font-sans font-bold text-stone-100 text-base m-0">{entry.name}</p>
            <p className="font-sans text-stone-500 text-xs m-0">{entry.phone || 'No phone'}</p>
          </div>
        </div>
        {[
          ['Service',  svc?.label],
          ['Barber',   `${barber?.emoji} ${barber?.name}`],
          ['Status',   entry.status],
          isQueue
            ? ['Position', `#${entry.position}`]
            : ['Slot', entry.slot],
          isQueue
            ? ['Wait',  fmtWait(entry.position, entry.service)]
            : ['Date',  entry.date],
          isQueue
            ? ['Joined', timeAgo(entry.joinedAt)]
            : ['Booking', entry.source ?? 'booked'],
        ].map(([k, v]) => (
          <div key={k} className="flex justify-between py-2 border-b border-stone-700/50 last:border-0">
            <span className="font-sans text-stone-500 text-sm">{k}</span>
            <span className="font-sans text-stone-200 text-sm font-medium">{v}</span>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        {isQueue && entry.position === 1 && (
          <button
            onClick={() => { onServe(entry.id); onClose(); }}
            className="flex-1 py-3 bg-green-500 text-green-950 border-none rounded-xl font-sans font-black text-sm cursor-pointer hover:bg-green-400 transition-colors"
          >✅ Mark as Served</button>
        )}
        <button
          onClick={() => { onRemove(entry.id); onClose(); }}
          className="flex-1 py-3 bg-red-500/10 text-red-400 border border-red-500/40 rounded-xl font-sans font-bold text-sm cursor-pointer hover:bg-red-500/20 transition-colors"
        >🗑 Remove</button>
      </div>
    </Modal>
  );
}