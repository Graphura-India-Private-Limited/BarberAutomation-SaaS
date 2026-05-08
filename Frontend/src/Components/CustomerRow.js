
import React from 'react';
import { Avatar, PlanBadge } from './Atoms';
import { PLANS } from '../constants';

export default function CustomerRow({ customer, onEarn, onRedeem, onClick }) {
  const plan     = PLANS[customer.plan];
  const pct      = Math.min(100, Math.round((customer.points / plan.minRedeem) * 100));
  const barColor = customer.plan === 'Gold' ? '#5C3D2E' : customer.plan === 'Silver' ? '#C8896A' : '#D4A882';

  return (
    <div
      onClick={onClick}
      className="flex items-center gap-3 py-3 border-b border-[#E8C9B0] last:border-0 cursor-pointer hover:bg-[#F5E6D8] rounded-xl px-2 transition-all"
    >
      <Avatar initials={customer.initials} plan={customer.plan} />

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="font-sans font-bold text-[#5C3D2E] text-sm">{customer.name}</span>
          <PlanBadge plan={customer.plan} />
          {customer.plan !== 'Basic' && (
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#F5E6D8] text-[#5C3D2E] border border-[#C8896A] font-mono">
              Priority
            </span>
          )}
        </div>
        <p className="font-sans text-xs text-[#A0785A] mt-0.5 m-0">
          {customer.visits} visits · {customer.phone} · Since {customer.joinedAt}
        </p>
        <div className="mt-1.5">
          <div className="flex justify-between text-[10px] text-[#A0785A] mb-1">
            <span>{customer.points} pts</span>
            <span>{plan.minRedeem} pts to redeem</span>
          </div>
          <div className="bg-[#EDD5C0] rounded-full h-1.5">
            <div
              className="h-1.5 rounded-full transition-all duration-500"
              style={{ background: barColor, width: `${pct}%` }}
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-1.5 flex-shrink-0">
        <button
          onClick={(e) => { e.stopPropagation(); onEarn(customer.id); }}
          className="bg-[#5C3D2E] text-white border border-[#5C3D2E] rounded-lg px-2.5 py-1 font-sans font-bold text-xs cursor-pointer hover:opacity-80 transition-colors"
        >+ Pts</button>
        <button
          onClick={(e) => { e.stopPropagation(); onRedeem(customer.id); }}
          className="bg-[#C8896A] text-white border border-[#C8896A] rounded-lg px-2.5 py-1 font-sans font-bold text-xs cursor-pointer hover:opacity-80 transition-colors"
        >Redeem</button>
      </div>
    </div>
  );
}