
import React from 'react';

export function Avatar({ initials, plan }) {
  const colors = {
    Gold:   'bg-[#F5E6D8] text-[#5C3D2E]',
    Silver: 'bg-[#EDD5C0] text-[#7A4F3A]',
    Basic:  'bg-[#F9EDE4] text-[#A0785A]',
  };
  return (
    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-sans font-bold text-sm flex-shrink-0 ${colors[plan] ?? colors.Basic}`}>
      {initials}
    </div>
  );
}

export function PlanBadge({ plan }) {
  const colors = {
    Gold:   'bg-[#F5E6D8] text-[#5C3D2E] border-[#C8896A]',
    Silver: 'bg-[#EDD5C0] text-[#7A4F3A] border-[#B87A5A]',
    Basic:  'bg-[#F9EDE4] text-[#A0785A] border-[#D4A882]',
  };
  return (
    <span className={`text-[10px] px-2 py-0.5 rounded-full border font-mono ${colors[plan] ?? colors.Basic}`}>
      {plan}
    </span>
  );
}

export function Toast({ notif }) {
  if (!notif) return null;
  const styles = {
    success: 'bg-[#D4EDDA] border-[#5C9E6E] text-[#2E6B45]',
    warn:    'bg-[#F5E6D8] border-[#C8896A] text-[#5C3D2E]',
    info:    'bg-[#EDD5C0] border-[#B87A5A] text-[#7A4F3A]',
    danger:  'bg-[#F8D7DA] border-[#C0555A] text-[#7A2E32]',
  };
  return (
    <div className={`fixed top-4 left-1/2 -translate-x-1/2 z-[200] px-4 py-2.5 rounded-xl border text-sm font-sans font-medium shadow-xl whitespace-nowrap ${styles[notif.type] ?? styles.info}`}>
      {notif.msg}
    </div>
  );
}

export function Modal({ title, onClose, children }) {
  return (
    <div
      className="fixed inset-0 z-[100] bg-black/40 flex items-end justify-center"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-[#FDF6F0] border border-[#E8C9B0] rounded-t-3xl w-full max-w-lg p-5 pb-8">
        <div className="w-10 h-1 bg-[#C8896A] rounded-full mx-auto mb-4" />
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-sans font-bold text-[#5C3D2E] text-base m-0">{title}</h2>
          <button onClick={onClose} className="text-[#A0785A] hover:text-[#5C3D2E] text-2xl leading-none border-none bg-transparent cursor-pointer">×</button>
        </div>
        {children}
      </div>
    </div>
  );
}

export function StatCard({ value, label, color }) {
  return (
    <div className="bg-[#F5E6D8] border border-[#E8C9B0] rounded-xl py-3 px-2 text-center">
      <p className={`font-mono font-black text-lg m-0 ${color}`}>{value}</p>
      <p className="font-sans text-[10px] text-[#A0785A] mt-1 m-0">{label}</p>
    </div>
  );
}