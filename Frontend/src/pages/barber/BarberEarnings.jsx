import React, { useState } from "react";
import { 
  DollarSign, TrendingUp, Award, Calendar, ArrowUpRight, 
  Wallet, Sparkles, CheckCircle2, ArrowRight, Download, Menu, Bell 
} from "lucide-react";


const MOCK_EARNINGS_SUMMARY = {
  todayEarned: 1840,
  thisWeekEarned: 12450,
  commissionRate: "45%",
  totalTipsCollected: 2350,
};

const MOCK_PAYOUT_HISTORY = [
  { id: "PAY-99321", date: "25 May 2026", amount: 11200, type: "Weekly Payout", status: "Settled" },
  { id: "PAY-98110", date: "18 May 2026", amount: 9850, type: "Weekly Payout", status: "Settled" },
];

const MOCK_DAILY_COMMISSIONS = [
  { id: "TR-881", service: "Classic Haircut + Beard Combo", time: "10:30 AM", basePrice: 599, cutEarned: 270, tip: 50 },
  { id: "TR-884", service: "Premium Grooming & Facial Spa", time: "11:45 AM", basePrice: 799, cutEarned: 360, tip: 100 },
];

export default function BarberEarnings() {
  const [payouts] = useState(MOCK_PAYOUT_HISTORY);
  const [dailyCuts] = useState(MOCK_DAILY_COMMISSIONS);
  
  const [sideOpen, setSideOpen] = useState(false);
  const profile = { salonName: "Master Barber Lounge", initials: "MB" };

  return (
    <div className="min-h-screen bg-[#FAF6F0] text-stone-800 font-sans antialiased flex flex-col justify-between">
   
      <header className="sticky top-0 z-50 w-full px-4 md:px-8 py-4 bg-[#1A1A1A] border-b border-[#D4AF37]/20 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button className="md:hidden p-2 text-zinc-400" onClick={() => setSideOpen(!sideOpen)}>
            <Menu className="w-5 h-5" />
          </button>
          <div className="text-left">
            <h1 className="text-white font-bold text-xl font-serif">Earning</h1>
            <p className="text-[10px] text-zinc-500 uppercase tracking-widest">{profile.salonName}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="p-2 text-zinc-400 bg-white/5 rounded-lg border border-white/10"><Bell className="w-4 h-4" /></button>
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#F5C842] to-[#E8A020] flex items-center justify-center text-xs font-bold text-black">
            {profile.initials}
          </div>
        </div>
      </header>
      
      <div>
        {/* ── MAIN ANALYTICAL DATA CANVAS ── */}
        <main className="max-w-6xl mx-auto w-full px-5 py-10 text-left">
          
          {/* Section Dynamic Header Info */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4 border-b border-stone-200/60 pb-6">
            <div>
              <h1 className="text-3xl font-black tracking-tight text-stone-900 uppercase font-serif">
                Finance <span className="text-[#C5A059]">Stream</span>
              </h1>
              <p className="text-[10px] font-black uppercase tracking-widest text-[#A37B58] mt-1.5">
                Real-Time Commission Splits & Performance Audits
              </p>
            </div>

            {/* Structure baseline account metrics model pill */}
            <div className="flex items-center gap-2 bg-white px-4 py-2.5 rounded-xl border border-stone-200/80 shadow-3xs w-fit">
              <Wallet size={14} className="text-[#C5A059]" />
              <span className="text-[10px] font-black uppercase tracking-wider text-stone-500">
                Tier Settlement Model: <span className="text-emerald-700 font-extrabold">{MOCK_EARNINGS_SUMMARY.commissionRate} Split</span>
              </span>
            </div>
          </div>

          {/* ── PREMIUM DYNAMIC VISUAL HIGHLIGHT CARD GRID ── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            
            {/* Cell 1: Today's Earned Payout Allocation */}
            <div className="bg-white border border-stone-200/80 rounded-2xl p-5 flex items-center gap-4 shadow-3xs">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0">
                <DollarSign className="text-emerald-600 w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-wider text-stone-400 mb-0.5">Today's Commission</p>
                <h3 className="text-2xl font-black text-stone-900 font-serif">₹{MOCK_EARNINGS_SUMMARY.todayEarned.toLocaleString()}</h3>
                <p className="text-[10px] text-emerald-600 font-bold mt-1">Ready for settlement</p>
              </div>
            </div>

            {/* Cell 2: Rolling Weekly Pipeline Gross Accumulation */}
            <div className="bg-white border border-stone-200/80 rounded-2xl p-5 flex items-center gap-4 shadow-3xs">
              <div className="w-12 h-12 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center shrink-0">
                <TrendingUp className="text-orange-600 w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-wider text-stone-400 mb-0.5">Weekly Staged Pool</p>
                <h3 className="text-2xl font-black text-stone-900 font-serif">₹{MOCK_EARNINGS_SUMMARY.thisWeekEarned.toLocaleString()}</h3>
                <p className="text-[10px] text-stone-400 font-semibold mt-1">Payout scheduled Mon</p>
              </div>
            </div>

            {/* Cell 3: Live Tip Tracker Capture Metrics */}
            <div className="bg-white border border-stone-200/80 rounded-2xl p-5 flex items-center gap-4 shadow-3xs">
              <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center shrink-0">
                <Sparkles className="text-amber-600 w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-wider text-stone-400 mb-0.5">Total Client Tips</p>
                <h3 className="text-2xl font-black text-stone-900 font-serif">₹{MOCK_EARNINGS_SUMMARY.totalTipsCollected.toLocaleString()}</h3>
                <p className="text-[10px] text-amber-700 font-bold mt-1">100% Barber retained</p>
              </div>
            </div>

            {/* Cell 4: Performance Award Quality Rating Estimation */}
            <div className="bg-white border border-stone-200/80 rounded-2xl p-5 flex items-center gap-4 shadow-3xs">
              <div className="w-12 h-12 rounded-xl bg-stone-900 flex items-center justify-center shrink-0 shadow-md">
                <Award className="text-[#C5A059] w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-wider text-stone-400 mb-0.5">Bonus Efficiency multipliers</p>
                <h3 className="text-2xl font-black text-stone-900 font-serif">+₹1,200</h3>
                <p className="text-[10px] font-black text-[#C5A059] uppercase tracking-wider mt-1">Top Specialist Bonus</p>
              </div>
            </div>

          </div>

          {/* ── SECONDARY MATRIX DATAGRID SPLIT ── */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* LEFT COMPONENT COLUMN: Today's Shift Transactional Item Logs */}
            <div className="col-span-12 lg:col-span-7 card p-6 bg-white shadow-3xs">
              <div className="flex justify-between items-center mb-5 border-b pb-3 border-stone-50">
                <div>
                  <h3 className="text-sm font-black uppercase tracking-wider text-stone-900">Shift Allocation Log</h3>
                  <p className="text-[10px] font-medium text-stone-400 mt-0.5">Real-time dynamic ticket revenue breakdown</p>
                </div>
                <span className="text-[9px] font-black uppercase tracking-widest text-stone-500 bg-stone-50 px-2.5 py-1 rounded border border-stone-200/60 font-mono">Today</span>
              </div>

              <div className="space-y-3">
                {dailyCuts.map((cut, index) => (
                  <div key={index} className="group flex items-center justify-between p-4 border border-stone-100 bg-stone-50/40 rounded-xl hover:bg-white hover:border-[#C5A059]/40 transition-all duration-300 shadow-3xs">
                    <div className="min-w-0 flex-1">
                      <p className="font-extrabold text-stone-900 text-sm truncate tracking-tight">{cut.service}</p>
                      <p className="text-[10px] font-bold text-stone-400 uppercase tracking-wider mt-0.5">
                        Slot Time: {cut.time} <span className="text-stone-200 mx-1.5">·</span> Ticket base: ₹{cut.basePrice}
                      </p>
                    </div>

                    <div className="text-right shrink-0 ml-4">
                      <span className="text-[10px] font-black uppercase tracking-wider block text-stone-400">Share Earned</span>
                      <p className="font-mono text-sm font-black text-stone-900">
                        ₹{cut.cutEarned}
                        {cut.tip > 0 && <span className="text-[10px] font-sans text-emerald-600 font-extrabold ml-1.5">(+₹{cut.tip} Tip)</span>}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT COMPONENT COLUMN: Ledger Settlement Historical Archive Logs */}
            <div className="col-span-12 lg:col-span-5 card p-6 bg-white shadow-3xs flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center mb-5 border-b pb-3 border-stone-50">
                  <div>
                    <h3 className="text-sm font-black uppercase tracking-wider text-stone-900">Settlement Ledger</h3>
                    <p className="text-[10px] font-medium text-stone-400 mt-0.5">Verified banking release timelines archive</p>
                  </div>
                  <Download size={14} className="text-stone-400 hover:text-stone-900 transition-colors cursor-pointer" />
                </div>

                <div className="space-y-3">
                  {payouts.map(pay => (
                    <div key={pay.id} className="flex items-center justify-between p-3.5 border border-stone-50 bg-stone-50/30 rounded-xl hover:bg-white transition-all duration-200">
                      <div className="text-left">
                        <p className="font-extrabold text-stone-900 text-xs">{pay.type}</p>
                        <p className="text-[10px] font-medium text-stone-400 mt-0.5">{pay.date} · <span className="font-mono font-bold text-stone-500">{pay.id}</span></p>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="font-mono font-black text-sm text-stone-900 block">₹{pay.amount.toLocaleString()}</span>
                        <span className="inline-flex items-center gap-1 text-[8px] font-black uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100/50 mt-1">
                          <CheckCircle2 size={8} /> {pay.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <button type="button" className="w-full mt-6 bg-stone-50 hover:bg-stone-900 text-stone-500 hover:text-white border border-stone-200/80 rounded-xl text-[10px] font-black uppercase tracking-widest py-3.5 transition-all duration-300 shadow-3xs cursor-pointer flex items-center justify-center gap-1.5">
                Query Payout Audits <ArrowRight size={12} />
              </button>
            </div>

          </div>

        </main>
      </div>

      {/* ── ✅ BRAND FOOTER: Custom dark-wood theme module attaches at viewport bottom edge ── */}
      

    </div>
  );
}