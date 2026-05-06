
import React from 'react';
import { PLANS } from '../constants';

export default function PlansTab({ toast }) {
  const features = [
    { key: 'ptsPerVisit', label: 'Points per visit',   fmt: (v) => `${v} pts`                   },
    { key: 'minRedeem',   label: 'Min pts to redeem',  fmt: (v) => `${v} pts`                   },
    { key: 'discount',    label: 'Service discount',   fmt: (v) => v ? `${v}%` : '—'            },
    { key: 'priority',    label: 'Priority queue',     fmt: (v) => v ? ' Yes' : '—'            },
    { key: 'price',       label: 'Monthly fee',        fmt: (v) => v === 0 ? 'Free' : `₹${v}/mo` },
  ];

  return (
    <div className="flex flex-col gap-3">
      <p className="font-sans font-bold text-[#7A4F3A] text-xs tracking-widest uppercase m-0 mt-1">
        Membership Plans
      </p>
      <div className="grid grid-cols-3 gap-3">
        {Object.entries(PLANS).map(([planName, plan]) => (
          <div
            key={planName}
            className={`bg-white rounded-2xl p-4 flex flex-col border ${
              planName === 'Silver' ? 'border-[#C8896A]' : 'border-[#E8C9B0]'
            }`}
          >
            {planName === 'Silver' && (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#F5E6D8] text-[#5C3D2E] border border-[#C8896A] font-mono self-start mb-2">
                Most Popular
              </span>
            )}
            {planName === 'Gold' && (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#F5E6D8] text-[#5C3D2E] border border-[#5C3D2E] font-mono self-start mb-2">
                Best Value
              </span>
            )}
            <p className="font-sans font-bold text-[#5C3D2E] text-base mb-1 m-0">{planName}</p>
            <p className="font-mono font-black text-2xl text-[#5C3D2E] m-0">{plan.price === 0 ? 'Free' : `₹${plan.price}`}</p>
            <p className="font-sans text-xs text-[#A0785A] mb-3">{plan.price === 0 ? 'No monthly fee' : 'per month'}</p>

            {features.map(({ key, label, fmt }) => (
              <div key={key} className="flex justify-between py-1.5 border-b border-[#E8C9B0] last:border-0">
                <span className="font-sans text-xs text-[#A0785A]">{label}</span>
                <span className={`font-mono text-xs font-medium ${
                  key === 'discount'    && plan.discount  ? 'text-[#2E6B45]'  :
                  key === 'priority'    && plan.priority  ? 'text-[#2E6B45]'  :
                  key === 'ptsPerVisit'                   ? 'text-[#5C3D2E]'  : 'text-[#7A4F3A]'
                }`}>{fmt(plan[key])}</span>
              </div>
            ))}

            <button
              onClick={() => toast(`${planName} plan selected!`, 'info')}
              className={`mt-4 py-2.5 rounded-xl border-none font-sans font-bold text-xs cursor-pointer transition-all ${
                planName === 'Silver' ? 'bg-[#C8896A] text-white hover:opacity-80'       :
                planName === 'Gold'   ? 'bg-[#5C3D2E] text-white hover:opacity-80'       :
                                        'bg-[#F5E6D8] text-[#5C3D2E] hover:bg-[#EDD5C0]'
              }`}
            >{planName === 'Basic' ? 'Default Plan' : `Activate ${planName}`}</button>
          </div>
        ))}
      </div>
    </div>
  );
}