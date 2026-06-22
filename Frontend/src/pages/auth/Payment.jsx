
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, CheckCircle2, AlertCircle, Scissors } from 'lucide-react';

const PLAN_ROWS = [
  ['Subscription tier',  'Silver Tier'],
  ['Billing cycle',    'Monthly'],
  ['Points per visit', '20 pts'],
  ['Discount Rate',    '10% Off'],
];

const GOLD = "#C5A059";
const CHARCOAL = "#3E362E";

const SALON_IMAGE = 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=900&q=80';

export default function Payment() {
  const [state, setState] = useState(0); // 0 = idle, 1 = failed, 2 = success
  const navigate = useNavigate();

  function handlePay() {
    setState(s => (s + 1) % 3);
  }

  const done = state === 2;

  return (
    <div className="flex min-h-screen font-sans antialiased text-stone-800" style={{ background: "#FAF6F0" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap');
        body, .font-sans { font-family: 'Plus Jakarta Sans', sans-serif !important; }
        .font-serif { font-family: 'Playfair Display', serif !important; }
        .card { 
          background: #FFFFFF; 
          border: 1px solid #EADBCE; 
          border-radius: 24px; 
          box-shadow: 0 10px 40px -6px rgba(44, 24, 16, 0.04);
        }
      `}</style>

      {/* ── LEFT SIDE ── */}
      <div className="relative hidden md:flex flex-col justify-end w-[48%] overflow-hidden min-h-screen">
        <img
          src={SALON_IMAGE}
          alt="Premium Barbershop Environment"
          className="absolute inset-0 w-full h-full object-cover object-center transform scale-102 hover:scale-100 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-900/40 to-stone-950/60" />

        <div className="absolute top-8 left-8 flex items-center gap-3 z-10">
          <div className="w-10 h-10 border rounded-xl flex items-center justify-center bg-stone-900/40 backdrop-blur-xs" style={{ borderColor: `${GOLD}60` }}>
            <Scissors size={18} color={GOLD} strokeWidth={2} />
          </div>
          <div className="text-left">
            <div className="text-sm font-black tracking-[0.15em] text-stone-50">
              BARBER <span style={{ color: GOLD }}>PRO</span>
            </div>
            <div className="text-[8px] tracking-[0.2em] uppercase font-bold text-stone-400 mt-0.5">
              Premium Grooming Systems
            </div>
          </div>
        </div>

        <div className="relative z-10 p-10 pb-12 text-left space-y-4">
          <h2 className="font-bold font-serif text-3xl md:text-4xl text-stone-100 italic leading-tight tracking-tight">
            Secure Settlement.<br />Instant Activation.
          </h2>
          <div className="w-10 h-0.5 rounded-full" style={{ backgroundColor: GOLD }} />
          <p className="text-xs font-medium leading-relaxed text-stone-300/80 max-w-sm">
            Complete your merchant subscription deposit securely. Staged business capabilities, live barber pipelines, and analytical metric streams unlock immediately post-verification.
          </p>
          <div className="flex flex-wrap gap-2 pt-2">
            {['256-Bit Encrypted', 'Razorpay Verified', 'Instant SLA Unlock'].map(tag => (
              <span key={tag} className="px-3 py-1 rounded-full border border-[#C5A059]/30 bg-[#C5A059]/10 text-[#C5A059] text-[10px] font-black uppercase tracking-wider">
                {tag}
              </span>
            ))}
          </div>
          <div className="pt-6 text-[9px] font-black tracking-widest text-stone-500 uppercase">
            Graphura India Private Limited
          </div>
        </div>
      </div>

      {/* ── RIGHT SIDE ── */}
      <div className="flex flex-1 items-center justify-center px-6 py-12 sm:px-12" style={{ backgroundColor: "#F2EBE0" }}>
        <div className="w-full max-w-md card p-8 sm:p-10 text-stone-800 text-left animate-in fade-in slide-in-from-right-8 duration-500">

          <div className="flex items-center gap-3.5 pb-4 border-b border-stone-100 mb-6">
            <div className="w-11 h-11 rounded-xl flex items-center justify-center shadow-inner" style={{ background: CHARCOAL }}>
              <CreditCard size={18} color={GOLD} strokeWidth={2.5} />
            </div>
            <div>
              <h2 className="text-md font-black tracking-tight text-stone-900">BarberAutomation</h2>
              <p className="text-[9px] font-black uppercase tracking-widest text-stone-400 mt-0.5">GRAPHURA INDIA PRIVATE LIMITED</p>
            </div>
          </div>

          <div className="mb-5">
            <h1 className="text-2xl font-black font-serif text-stone-900 tracking-tight">
              Payment <span style={{ color: GOLD }}>Verification</span>
            </h1>
            <p className="text-xs font-medium text-stone-400 mt-1">
              Confirm your premium account tier subscription parameters purchase.
            </p>
          </div>

          <div className="inline-block text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded bg-stone-50 text-stone-500 border border-stone-200/60 mb-4">
            Silver Plan — Monthly Tier
          </div>

          <div className="bg-stone-50/50 border border-stone-200/60 rounded-xl px-4 py-3.5 mb-5 space-y-2.5 shadow-3xs">
            {PLAN_ROWS.map(([key, value]) => (
              <div key={key} className="flex justify-between text-xs font-bold text-stone-500">
                <span>{key}</span>
                <span className="text-stone-900 font-extrabold tracking-tight">{value}</span>
              </div>
            ))}
            <div className="flex justify-between text-sm font-black text-stone-900 pt-3 border-t border-stone-200/60 mt-1">
              <span className="font-serif">Total Settlement</span>
              <span className="font-mono text-base text-stone-900">₹299 / mo</span>
            </div>
          </div>

          {state === 1 && (
            <div className="mb-4 rounded-xl bg-rose-50 border border-rose-200 p-3.5 flex items-center gap-2.5 text-xs font-bold text-rose-700 animate-in fade-in duration-200">
              <AlertCircle size={15} className="shrink-0" />
              <span>Transaction failed. Please check your bank token balance and retry.</span>
            </div>
          )}
          {state === 2 && (
            <div className="mb-4 rounded-xl bg-emerald-50 border border-emerald-200 p-3.5 flex items-center gap-2.5 text-xs font-bold text-emerald-700 animate-in fade-in duration-200">
              <CheckCircle2 size={15} className="shrink-0" />
              <span>Gateway check successful! Silver subscription is active.</span>
            </div>
          )}

          <div className="space-y-2.5">
            <button
              onClick={handlePay}
              disabled={done}
              className={`w-full py-4 rounded-xl text-xs font-black uppercase tracking-widest text-white shadow-md active:scale-95 transition-all focus:outline-none select-none ${
                done ? 'opacity-40 cursor-not-allowed' : 'hover:opacity-95 cursor-pointer'
              }`}
              style={{ background: CHARCOAL }}
            >
              {done ? 'Transaction Captured' : 'Pay ₹299 Now'}
            </button>

            {!done && (
              <button
                type="button"
                onClick={() => navigate('/register')}
                className="w-full py-3.5 rounded-xl text-xs font-black uppercase tracking-widest bg-white border border-stone-200 text-stone-500 hover:bg-stone-50 hover:text-stone-800 transition-all cursor-pointer shadow-3xs"
              >
                Cancel Authorization
              </button>
            )}
          </div>

          <p className="text-center text-[9px] uppercase tracking-widest text-stone-400/80 mt-6">
            🔒 Secured — End-to-End 256-bit encryption active
          </p>

        </div>
      </div>
    </div>
  );
}