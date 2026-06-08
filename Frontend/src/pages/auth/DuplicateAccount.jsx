import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, CheckCircle2, Scissors } from 'lucide-react';

const REGISTERED = ['9550105897', '9735897907'];

const BARBER_HERO_IMAGE = 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=900&auto=format&fit=crop&q=80';

export default function DuplicateAccount({ onBack }) {
  const [name, setName]     = useState('');
  const [phone, setPhone]   = useState('');
  const [status, setStatus] = useState('idle');
  const navigate            = useNavigate();

  const isFormValid = name.trim() !== '' && phone.replace(/\D/g, '').length === 10;

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
      setTimeout(() => {
        alert(`Verification Success! No duplicate found. Proceeding with OTP initialization for +91 ${sanitizedPhone}`);
      }, 100);
    }
  }

  return (
    <div className="min-h-screen w-full bg-[#FAF6F0] font-sans text-stone-800 antialiased flex text-left">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap');
        .font-sans { font-family: 'Plus Jakarta Sans', sans-serif !important; }
        .font-serif { font-family: 'Playfair Display', serif !important; }
        
        .card-minimalist {
          background: #FFFFFF;
          border-radius: 2.5rem;
          box-shadow: 0 30px 60px -15px rgba(62, 54, 46, 0.06);
          border: 1px solid rgba(234, 221, 206, 0.4);
        }
      `}</style>
      
      <div className="hidden lg:flex lg:w-5/12 bg-[#3E362E] p-12 flex-col justify-between relative overflow-hidden border-r border-[#2A241F] shadow-2xl min-h-screen">
        
        <div className="absolute inset-0 z-0 select-none pointer-events-none">
          <img 
            src={BARBER_HERO_IMAGE} 
            alt="Barber Shop Interior Accent" 
            className="w-full h-full object-cover" 
          />
          <div className="absolute inset-0 bg-gradient-to-b from-stone-950/60 via-stone-900/30 to-stone-950/85 mix-blend-multiply" />
        </div>

        <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-[#C5A059]/15 blur-3xl pointer-events-none z-10" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full bg-[#A37B58]/15 blur-3xl pointer-events-none z-10" />

        <div className="flex flex-col items-start relative z-20 select-none drop-shadow-[0_2px_8px_rgba(0,0,0,0.4)]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#3E362E]/90 border border-[#C5A059]/60 flex items-center justify-center shadow-md">
              <Scissors size={18} className="text-[#C5A059] rotate-90" />
            </div>
            <h1 className="text-xl font-bold text-[#C5A059] tracking-[0.15em] uppercase leading-none">
              BARBER <span className="text-white">PRO</span>
            </h1>
          </div>
          <div className="h-[1px] w-48 bg-[#C5A059] mt-2 opacity-60"/>
          <p className="text-[9px] text-stone-300 font-bold tracking-[0.3em] uppercase mt-1">
            Premium Grooming Systems
          </p>
        </div>

        <div className="relative z-20 text-left max-w-sm drop-shadow-[0_4px_12px_rgba(0,0,0,0.6)]">
          <h2 className="text-3xl font-serif text-white font-medium leading-tight mb-3 italic">
            Account Integrity & Verification.
          </h2>
          <p className="text-xs text-stone-200 leading-relaxed font-semibold">
            We securely cross-reference client records instantly to protect your personal dashboard security and prevent duplicate queue conflicts.
          </p>
        </div>

        <p className="text-[9px] text-stone-300 uppercase tracking-widest relative z-20 font-black text-left drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
          Graphura India Private Limited
        </p>
      </div>
            
      <div className="w-full lg:w-7/12 flex items-center justify-center p-6 md:p-12 bg-[#FAF6F0]">
        
        <div className="card-minimalist w-full max-w-[450px] p-8 sm:p-10 flex flex-col animate-in fade-in duration-300">
          
          {/* Header Identity Badge Group */}
          <div className="flex items-center gap-4 mb-5 text-left">
            <div className="w-12 h-12 rounded-xl bg-[#2C211A] flex items-center justify-center shrink-0">
              <Scissors size={20} color="#C5A059" className="rotate-90" />
            </div>
            <div>
              <h2 className="text-lg font-serif font-bold text-[#2C211A] tracking-wide leading-tight">Barber Pro</h2>
              <p className="text-[#C5A059] uppercase text-[9px] font-extrabold tracking-widest mt-0.5 font-sans">
                Graphura India Private Limited
              </p>
            </div>
          </div>

          <div className="h-[1px] bg-stone-100 w-full mb-6" />

          {/* Title */}
          <div className="mb-6 text-center">
            {/* Header Title */}
            <h3 className="text-3xl font-serif font-semibold text-gray-900">
              Verify Profile
            </h3>
            
            {/* Subtitle Description */}
            <p className="mt-2 text-sm font-normal leading-relaxed text-slate-400 font-sans">
              Check for existing profiles before registration.
            </p>
          </div>

          <div className="space-y-5">
            
            {/* Full name */}
            <div className="space-y-2 text-left">
              <label className="block text-[10px] font-extrabold text-[#C5A059] tracking-widest uppercase font-sans">
                Full Name
              </label>
              <div className="flex border border-[#EADBCE] rounded-xl overflow-hidden bg-white shadow-3xs focus-within:border-[#8B6B4E] transition-all">
                <input 
                  type="text" 
                  placeholder="e.g. Mayur K." 
                  value={name} 
                  onChange={e => { setName(e.target.value); setStatus('idle'); }}
                  className="w-full px-4 py-3.5 text-sm outline-none text-stone-800 font-medium font-sans"
                />
              </div>
            </div>

            {/* Mobile number */}
            <div className="space-y-2 text-left">
              <label className="block text-[10px] font-extrabold text-[#C5A059] tracking-widest uppercase font-sans">
                Mobile Number
              </label>
              <div className="flex border border-[#EADBCE] rounded-xl overflow-hidden bg-white shadow-3xs focus-within:border-[#8B6B4E] transition-all">
                <div className="px-4 flex items-center justify-center border-r border-[#EADBCE] bg-stone-50 text-stone-500 font-bold text-sm select-none font-sans">
                  +91
                </div>
                <input 
                  type="tel" 
                  placeholder="98765 43210" 
                  value={phone} 
                  onChange={e => { setPhone(e.target.value.replace(/\D/g, '').slice(0, 10)); setStatus('idle'); }}
                  className="w-full px-4 py-3.5 text-sm outline-none text-stone-800 font-medium font-sans tracking-wider"
                />
              </div>
            </div>

          </div>

          {status === 'duplicate' && (
            <div className="mt-5 p-3.5 bg-red-50 border border-red-200/60 rounded-xl flex items-start gap-2.5 text-left">
              <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-red-800 text-xs font-black uppercase tracking-wider">Duplicate Profile Found</p>
                <p className="text-red-700 text-[11px] font-semibold mt-0.5 leading-normal">
                  This mobile number is already linked to an active client account. Please use the login panel instead.
                </p>
              </div>
            </div>
          )}

          {status === 'available' && (
            <div className="mt-5 p-3.5 bg-green-50 border border-green-200/60 rounded-xl flex items-start gap-2.5 text-left">
              <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-green-800 text-xs font-black uppercase tracking-wider">Profile Available</p>
                <p className="text-green-700 text-[11px] font-semibold mt-0.5 leading-normal">
                  No existing account matched this phone number. Integrity check complete.
                </p>
              </div>
            </div>
          )}

          <div className="mt-8 space-y-3">
            {/* Verify Registration button */}
            <button 
              type="button"
              disabled={!isFormValid}
              onClick={handleVerifyCheck}
              className="w-full text-white font-bold text-xs uppercase tracking-widest py-4 rounded-xl transition-all duration-300 shadow-md active:scale-[0.99] font-sans"
              style={{ 
                backgroundColor: isFormValid ? "#2C1810" : "#9C928A",
                boxShadow: isFormValid ? "0 10px 25px -5px rgba(44, 24, 16, 0.25)" : "none"
              }}
            >
              Verify Registration
            </button>
            
            {/* Back to Login */}
            <button 
              type="button"
              onClick={() => (onBack ? onBack() : navigate('/login'))}
              className="w-full py-4 rounded-xl text-xs font-bold uppercase tracking-widest bg-white hover:bg-[#f0ece3] text-[#2b2118] border border-[#e0d8cc] transition-colors"
            >
              Back to Login
            </button>
          </div>

          <p className="text-center text-[9px] uppercase tracking-widest text-[#bbb] mt-6">
            Professional Grooming Standards
          </p>

        </div>
      </div>

    </div>
  );
}