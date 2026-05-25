import { useState } from 'react'
import { AlertCircle, CheckCircle2 } from 'lucide-react'

// Registered mock numbers database check array
const REGISTERED = ['9550105897', '9735897907']

const ScissorIcon = ({ className }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="6" cy="6" r="3" stroke="currentColor"/>
    <circle cx="6" cy="18" r="3" stroke="currentColor"/>
    <line x1="20" y1="4" x2="8.12" y2="15.88" stroke="currentColor"/>
    <line x1="14.47" y1="14.48" x2="20" y2="20" stroke="currentColor"/>
    <line x1="8.12" y1="8.12" x2="12" y2="12" stroke="currentColor"/>
  </svg>
);

export default function DuplicateAccount({ onBack }) {
  const [name, setName]         = useState('')
  const [phone, setPhone]       = useState('')
  const [status, setStatus]     = useState('idle') // 'idle' | 'duplicate' | 'available'

  function handleVerifyCheck() {
    const sanitizedPhone = phone.replace(/\D/g, '');

    if (!name.trim() || !sanitizedPhone) {
      alert('Please fill out all fields before verifying.');
      return;
    }

    if (REGISTERED.includes(sanitizedPhone)) {
      setStatus('duplicate');
    } else {
      setStatus('available');
      // Success action placeholder logic (e.g., dispatching registration details or trigger OTP workflow)
      setTimeout(() => {
        alert(`Verification Success! No duplicate found. Proceeding with OTP initialization for +91 ${sanitizedPhone}`);
      }, 100);
    }
  }

  return (
    <div className="min-h-screen w-full bg-[#FAF6F0] font-sans text-stone-800 antialiased flex">
      
      {/* ✂️ LEFT PANEL: LUXURY BRAND INTRO */}
      <div className="hidden lg:flex lg:w-5/12 bg-[#3E362E] p-12 flex-col justify-between relative overflow-hidden border-r border-[#2A241F] shadow-2xl">
        
        {/* 📸 IMAGE CONTAINER LAYER */}
        <div className="absolute inset-0 z-0 select-none pointer-events-none">
          <img 
            src="/DuplicateAccountImg.png" 
            alt="Barber Shop Interior Accent" 
            className="w-full h-full object-cover animate-fade-in" 
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/25 to-black/75 mix-blend-multiply" />
        </div>

        {/* Decorative background ambient flares */}
        <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-[#C5A059]/15 blur-3xl pointer-events-none z-10" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full bg-[#A37B58]/15 blur-3xl pointer-events-none z-10" />

        {/* Brand identity */}
        <div className="flex flex-col items-start relative z-20 select-none drop-shadow-[0_2px_8px_rgba(0,0,0,0.4)]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#3E362E]/90 border border-[#C5A059]/60 flex items-center justify-center shadow-md">
              <ScissorIcon className="w-5 h-5 text-[#C5A059]" />
            </div>
            <h1 className="text-xl font-black text-[#C5A059] tracking-[0.15em] uppercase leading-none">
              BARBER <span className="text-white">PRO</span>
            </h1>
          </div>
          <div className="h-[1px] w-48 bg-[#C5A059] mt-2 opacity-60"/>
          <p className="text-[9px] text-stone-300 font-bold tracking-[0.3em] uppercase mt-1">
            Premium Grooming Systems
          </p>
        </div>

        {/* Bottom catchphrase */}
        <div className="relative z-20 text-left max-w-sm drop-shadow-[0_4px_12px_rgba(0,0,0,0.6)]">
          <h2 className="text-3xl font-serif text-white font-medium leading-tight mb-3 italic">
            Account Integrity & Verification.
          </h2>
          <p className="text-xs text-stone-200 leading-relaxed font-semibold">
            We securely cross-reference client records instantly to protect your personal dashboard security and prevent duplicate queue conflicts.
          </p>
        </div>

        {/* Footer info label */}
        <p className="text-[9px] text-stone-300 uppercase tracking-widest relative z-20 font-black text-left drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
          Graphura India Private Limited
        </p>
      </div>
            
{/* 📄 RIGHT PANEL: CENTERING INTERACTIVE VERIFICATION CARD */}
      {/* 🔄 CHANGE 1: Main background changed to pure white (bg-white) */}
      <div className="w-full lg:w-7/12 flex items-center justify-center p-6 md:p-12 bg-white">
        
        {/* 🔄 CHANGE 2: Card container changed to the light cream color (bg-[#FAF6F0]) */}
        <div className="w-full max-w-md bg-[#FAF6F0] rounded-[2rem] border border-stone-200/60 shadow-md p-8 md:p-10 text-left animate-fade-in">
          
          {/* Form Header */}
          <div className="mb-8">
            <div className="flex lg:hidden items-center gap-2 mb-4">
              <ScissorIcon className="w-5 h-5 text-[#C5A059]" />
              <span className="text-xs font-black uppercase tracking-widest text-[#3E362E]">Barber Pro</span>
            </div>
            
            <h2 className="text-3xl font-black text-stone-900 tracking-tight uppercase leading-none">
              Verify Profile
            </h2>
            <p className="text-xs font-bold tracking-wide text-[#A37B58] uppercase mt-1.5">
              Check for existing profiles before registration
            </p>
          </div>

          {/* Form Fields Stack */}
          <div className="space-y-5">
            
            {/* Name Field Input */}
            <div className="space-y-2">
              <label className="text-[10px] text-stone-400 uppercase font-black tracking-wider ml-0.5">
                Full Name
              </label>
              {/* 🔄 CHANGE 3: Swapped input background to pure white so it pops against the cream container */}
              <input 
                type="text" 
                placeholder="e.g. Mayur K." 
                value={name} 
                onChange={e => { setName(e.target.value); setStatus('idle'); }}
                className="w-full bg-white border border-stone-200/80 rounded-xl px-4 py-3.5 text-sm font-bold text-stone-900 placeholder-stone-400 outline-none transition-all focus:border-[#C5A059] shadow-2xs"
              />
            </div>

            {/* Mobile Number Field Input */}
            <div className="space-y-2">
              <label className="text-[10px] text-stone-400 uppercase font-black tracking-wider ml-0.5">
                Mobile Number
              </label>
              <div className="flex gap-2">
                {/* 🔄 CHANGE 4: Prefix badge to pure white */}
                <div className="bg-white border border-stone-200/80 text-stone-500 font-bold text-sm rounded-xl px-4 flex items-center justify-center shadow-2xs">
                  +91
                </div>
                {/* 🔄 CHANGE 5: Input field background to pure white */}
                <input 
                  type="tel" 
                  placeholder="98765 43210" 
                  value={phone} 
                  onChange={e => { setPhone(e.target.value.replace(/\D/g, '').slice(0, 10)); setStatus('idle'); }}
                  className={`w-full bg-white border rounded-xl px-4 py-3.5 text-sm font-bold font-mono tracking-wide text-stone-900 placeholder-stone-400 outline-none transition-all shadow-2xs ${
                    status === 'duplicate' ? 'border-red-300 focus:border-red-500' : status === 'available' ? 'border-green-300 focus:border-green-500' : 'border-stone-200/80 focus:border-[#C5A059]'
                  }`}
                />
              </div>
            </div>

          </div>

          {/* 🚨 STATE 1: DUPLICATE ACCOUNT DETECTED */}
          {status === 'duplicate' && (
            <div className="mt-5 p-3.5 bg-red-50 border border-red-200/60 rounded-xl flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-red-800 text-xs font-black uppercase tracking-wider">Duplicate Profile Found</p>
                <p className="text-red-700 text-[11px] font-semibold mt-0.5 leading-normal">
                  This mobile number is already linked to an active client account. Please use the login panel instead.
                </p>
              </div>
            </div>
          )}

          {/* STATE 2: ACCOUNT IS UNIQUE & AVAILABLE */}
          {status === 'available' && (
            <div className="mt-5 p-3.5 bg-green-50 border border-green-200/60 rounded-xl flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-green-800 text-xs font-black uppercase tracking-wider">Profile Available</p>
                <p className="text-green-700 text-[11px] font-semibold mt-0.5 leading-normal">
                  No existing account matched this phone number. Integrity check complete.
                </p>
              </div>
            </div>
          )}

          {/* Core Action Button Group Links */}
          <div className="mt-8 space-y-3.5">
            <button 
              type="button"
              onClick={handleVerifyCheck}
              className="w-full bg-[#3E362E] hover:bg-[#2A241F] text-white font-black text-xs uppercase tracking-widest py-4 rounded-xl shadow-md transition-all active:scale-[0.98] cursor-pointer"
            >
              Verify Registration
            </button>
            
            <button 
              type="button"
              onClick={onBack}
              className="w-full bg-white border border-stone-200 hover:border-stone-400 text-stone-700 font-black text-xs uppercase tracking-widest py-4 rounded-xl transition-all shadow-2xs cursor-pointer"
            >
              Back to Login
            </button>
          </div>

          <p className="text-center text-[#8C8475] text-[8px] mt-8 uppercase tracking-[0.3em] opacity-40 leading-none">
            Professional Grooming Standards
          </p>

        </div>
      </div>

    </div>
  )
}