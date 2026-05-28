import React from 'react';

// Scissor Vector SVG Icon Asset
const ScissorIcon = ({ className }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="6" cy="6" r="3" stroke="currentColor"/>
    <circle cx="6" cy="18" r="3" stroke="currentColor"/>
    <line x1="20" y1="4" x2="8.12" y2="15.88" stroke="currentColor"/>
    <line x1="14.47" y1="14.48" x2="20" y2="20" stroke="currentColor"/>
    <line x1="8.12" y1="8.12" x2="12" y2="12" stroke="currentColor"/>
  </svg>
);

export default function Header({ subtitle = "Premium Grooming Systems", rightElement }) {
  return (
    <header className="w-full bg-[#3E362E] border-b border-[#2A241F] px-8 py-4 flex items-center justify-between z-50 shadow-md">
      
      {/* Brand Identity Branding */}
      <div className="flex items-center gap-3.5">
        <div className="w-10 h-10 rounded-xl bg-[#C5A059]/20 border border-[#C5A059]/40 flex items-center justify-center">
          <ScissorIcon className="w-5 h-5 text-[#C5A059]" />
        </div>
        <div className="text-left">
          <h1 className="text-xl font-black text-[#C5A059] tracking-[0.15em] uppercase leading-none">
            BARBER <span className="text-white">PRO</span>
          </h1>
          <p className="text-[9px] text-stone-400 font-bold tracking-[0.3em] uppercase mt-1 leading-none">
            {subtitle}
          </p>
        </div>
      </div>
      
      {/* Contextual Right Actions (Toggles, Buttons, Status Bars) */}
      <div className="flex items-center gap-3">
        {rightElement}
      </div>

    </header>
  );
}