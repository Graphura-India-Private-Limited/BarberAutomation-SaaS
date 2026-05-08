
import React from 'react';
import { Modal } from './Atoms';
import { PLANS } from '../constants';

export default function EarnModal({ customer, onClose, onConfirm }) {
  const plan = PLANS[customer.plan];
  const rows = [
    ['Membership Plan',  customer.plan],
    ['Phone',            customer.phone],
    ['Current Points',   `${customer.points} pts`],
    ['Points to Earn',   `+${plan.ptsPerVisit} pts`],
    ['New Total',        `${customer.points + plan.ptsPerVisit} pts`],
  ];
  return (
    <Modal title={`Earn Points — ${customer.name}`} onClose={onClose}>
      <div className="bg-[#F5E6D8] rounded-2xl p-4 mb-4">
        {rows.map(([k, v]) => (
          <div key={k} className="flex justify-between py-2 border-b border-[#E8C9B0] last:border-0">
            <span className="font-sans text-[#A0785A] text-sm">{k}</span>
            <span className={`font-mono text-sm font-medium ${
              k === 'Points to Earn' ? 'text-[#2E6B45]' :
              k === 'New Total'      ? 'text-[#5C3D2E]' : 'text-[#7A4F3A]'
            }`}>{v}</span>
          </div>
        ))}
      </div>
      <button
        onClick={onConfirm}
        className="w-full py-3.5 bg-[#5C3D2E] text-white border-none rounded-xl font-sans font-black text-sm cursor-pointer hover:opacity-80 transition-colors"
      >✅ Confirm Visit & Add {plan.ptsPerVisit} Points</button>
    </Modal>
  );
}