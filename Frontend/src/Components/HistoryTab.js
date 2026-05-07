
import React from 'react';

export default function HistoryTab({ history }) {
  return (
    <div>
      <p className="font-sans font-bold text-[#7A4F3A] text-xs tracking-widest uppercase mb-3 mt-1">
        Points Activity Log
      </p>
      <div className="bg-white border border-[#E8C9B0] rounded-2xl px-4">
        {history.length === 0
          ? <p className="text-[#A0785A] text-sm text-center py-8 font-sans">No activity yet.</p>
          : [...history].reverse().map((h) => (
              <div key={h.id} className="flex items-center justify-between py-3 border-b border-[#E8C9B0] last:border-0">
                <div>
                  <p className="font-sans font-bold text-[#5C3D2E] text-sm m-0">{h.custName}</p>
                  <p className="font-sans text-xs text-[#A0785A] m-0">{h.desc} · {h.time}</p>
                </div>
                <span className={`font-mono font-bold text-sm ${h.type === 'earn' ? 'text-[#2E6B45]' : 'text-[#C0555A]'}`}>
                  {h.type === 'earn' ? '+' : ''}{h.pts} pts
                </span>
              </div>
            ))
        }
      </div>
    </div>
  );
}