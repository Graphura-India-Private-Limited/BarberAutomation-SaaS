
import React from 'react';
import { Modal } from './Atoms';
import { PLANS } from '../constants';

export default function RedeemModal({ customer, onClose, onConfirm }) {
  const plan      = PLANS[customer.plan];
  const canRedeem = customer.points >= plan.minRedeem;
  const rows = [
    ['Membership Plan',  customer.plan],
    ['Points Balance',   `${customer.points} pts`],
    ['Points Required',  `${plan.minRedeem} pts`],
    ['Discount Applied', `${plan.discount}%`],
    ['Remaining After',  canRedeem ? `${customer.points - plan.minRedeem} pts` : '—'],
  ];
  return (
    <Modal title={`Redeem Points — ${customer.name}`} onClose={onClose}>
      <div className="bg-[#F5E6D8] rounded-2xl p-4 mb-4">
        {rows.map(([k, v]) => (
          <div key={k} className="flex justify-between py-2 border-b border-[#E8C9B0] last:border-0">
            <span className="font-sans text-[#A0785A] text-sm">{k}</span>
            <span className={`font-mono text-sm font-medium ${
              k === 'Discount Applied' ? 'text-[#5C3D2E]'  :
              k === 'Remaining After'  ? 'text-[#7A4F3A]'  : 'text-[#A0785A]'
            }`}>{v}</span>
          </div>
        ))}
      </div>
      {!canRedeem
        ? <div className="bg-[#F8D7DA] border border-[#C0555A] rounded-xl p-3 text-center">
            <p className="text-[#7A2E32] text-sm font-sans m-0">
              Need {plan.minRedeem - customer.points} more points to redeem.
            </p>
          </div>
        : <button
            onClick={onConfirm}
            className="w-full py-3.5 bg-[#C8896A] text-white border-none rounded-xl font-sans font-black text-sm cursor-pointer hover:opacity-80 transition-colors"
          >🎁 Redeem & Apply {plan.discount}% Discount</button>
      }
    </Modal>
  );
}