import React from 'react';

export const inputCls = "w-full bg-stone-800 border border-stone-700 rounded-xl px-3 py-2.5 text-stone-100 text-sm font-sans outline-none focus:border-indigo-500 transition-colors";
export const selectCls = "w-full bg-stone-800 border border-stone-700 rounded-xl px-3 py-2.5 text-stone-100 text-sm font-sans outline-none focus:border-indigo-500 transition-colors";

export function Field({ label, children }) {
  return (
    <div className="mb-3">
      <p className="text-[11px] text-stone-500 uppercase tracking-widest font-sans mb-1.5">{label}</p>
      {children}
    </div>
  );
}

export function Modal({ title, onClose, children }) {
  return (
    <div
      className="fixed inset-0 z-[100] bg-black/70 flex items-end justify-center"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-[#111110] border border-stone-800 rounded-t-3xl w-full max-w-lg p-5 pb-8">
        <div className="w-10 h-1 bg-stone-700 rounded-full mx-auto mb-5" />
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-sans font-bold text-stone-100 text-lg">{title}</h2>
          <button
            onClick={onClose}
            className="text-stone-500 hover:text-stone-300 text-2xl leading-none border-none bg-transparent cursor-pointer"
          >×</button>
        </div>
        {children}
      </div>
    </div>
  );
}