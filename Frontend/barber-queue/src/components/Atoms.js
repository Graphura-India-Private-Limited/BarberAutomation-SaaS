import React from 'react';

export function Dot({ color, size = 8 }) {
  return (
    <span
      style={{ background: color, width: size, height: size }}
      className="rounded-full inline-block flex-shrink-0"
    />
  );
}

export function Tag({ src }) {
  return (
    <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/10 text-stone-400 font-mono">
      {src}
    </span>
  );
}

export function Badge({ color, children }) {
  return (
    <span
      style={{ color, borderColor: color }}
      className="text-[10px] px-1.5 py-0.5 rounded border font-mono bg-white/5"
    >
      {children}
    </span>
  );
}

export function Toast({ notif }) {
  if (!notif) return null;
  const colors = {
    success: 'bg-green-500/20 border-green-500 text-green-300',
    info:    'bg-sky-500/20 border-sky-500 text-sky-300',
    warn:    'bg-amber-500/20 border-amber-500 text-amber-300',
  };
  return (
    <div className={`fixed top-4 left-1/2 -translate-x-1/2 z-[200] px-4 py-2.5 rounded-xl border text-sm font-sans font-medium shadow-xl ${colors[notif.type] ?? colors.info}`}>
      {notif.msg}
    </div>
  );
}