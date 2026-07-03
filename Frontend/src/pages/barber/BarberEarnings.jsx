import React, { useState, useEffect } from "react";
import {
  DollarSign, TrendingUp, Award, Calendar, ArrowUpRight,
  Wallet, Sparkles, CheckCircle2, ArrowRight, Download, RefreshCw
} from "lucide-react";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export default function BarberEarnings() {
  const [payouts] = useState([]);
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(true);
  const [earningsSummary, setEarningsSummary] = useState({
    todayEarned: 0,
    thisWeekEarned: 0,
    commissionRate: "0%",
    totalTipsCollected: 0,
  });
  const [shiftLog, setShiftLog] = useState([]);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const fetchEarnings = async () => {
    const barberId = localStorage.getItem("barberId");
    const token = localStorage.getItem("token");
    if (!barberId || !token) { setLoading(false); return; }
    try {
      const res = await fetch(`${API}/barber/${barberId}/dashboard`, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }
      });
      const data = await res.json();
      if (data.success) {
        const stats = data.stats || {};
        const todayRevenue = stats.todayRevenue || 0;
        const weekRevenue = stats.weekRevenue || 0;
        // Commission rate: assume 60% of revenue goes to barber
        const commissionRate = "60%";
        const todayEarned = Math.round(todayRevenue * 0.6);
        const thisWeekEarned = Math.round(weekRevenue * 0.6);

        setEarningsSummary({
          todayEarned,
          thisWeekEarned,
          commissionRate,
          totalTipsCollected: 0,
        });

        // Build shift log from today's completed queue
        const todayQueue = (data.todayQueue || []).filter(q => q.status === "done" || q.status === "Completed");
        const log = todayQueue.map(q => {
          const services = q.booking_id?.services || [];
          const serviceName = services.map(s => s.service_name).filter(Boolean).join(", ") || "Service";
          const basePrice = q.booking_id?.total_amount || 0;
          const time = q.served_at
            ? new Date(q.served_at).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })
            : "—";
          return { service: serviceName, time, basePrice, cutEarned: Math.round(basePrice * 0.6), tip: 0 };
        });
        setShiftLog(log);
      }
    } catch (err) {
      console.error("Failed to fetch earnings:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEarnings();
  }, []);


  return (
    <div className="w-full text-stone-800 font-sans antialiased flex flex-col justify-between">

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
            <div className="flex items-center gap-3 flex-shrink-0">
              <div className="flex items-center gap-2 bg-white px-4 py-2.5 rounded-xl border border-stone-200/80 shadow-3xs w-fit">
                <Wallet size={14} className="text-[#C5A059]" />
                <span className="text-[10px] font-black uppercase tracking-wider text-stone-500">
                  Tier Settlement Model: <span className="text-emerald-700 font-extrabold">{earningsSummary.commissionRate} Split</span>
                </span>
              </div>
              <button
                onClick={() => { setLoading(true); fetchEarnings(); }}
                className="w-9 h-9 rounded-xl bg-white border border-stone-200 flex items-center justify-center hover:bg-stone-50 transition cursor-pointer shadow-3xs"
                title="Refresh earnings"
              >
                <RefreshCw size={14} className={`text-stone-500 ${loading ? 'animate-spin' : ''}`} />
              </button>
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
                <h3 className="text-2xl font-black text-stone-900 font-serif">₹{earningsSummary.todayEarned.toLocaleString()}</h3>
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
                <h3 className="text-2xl font-black text-stone-900 font-serif">₹{earningsSummary.thisWeekEarned.toLocaleString()}</h3>
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
                <h3 className="text-2xl font-black text-stone-900 font-serif">₹{earningsSummary.totalTipsCollected.toLocaleString()}</h3>
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
                {shiftLog.length === 0 ? (
                  <div className="py-8 text-center text-stone-400">
                    <p className="text-xs font-bold uppercase tracking-wider">No completed services today</p>
                    <p className="text-[10px] mt-1 font-medium">Earnings will appear here once you complete services</p>
                  </div>
                ) : shiftLog.map((cut, index) => (
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
                  {/* <Download size={14} className="text-stone-400 hover:text-stone-900 transition-colors cursor-pointer" /> */}
                  <button
                    onClick={() => {
                      const headers = ["Payout ID", "Date", "Amount (INR)", "Type", "Status"];
                      const rows = payouts.map(pay => [
                        pay.id,
                        pay.date,
                        pay.amount,
                        pay.type,
                        pay.status
                      ]);
                      const csvContent = [
                        headers.join(","),
                        ...rows.map(row => row.map(val => `"${String(val).replace(/"/g, '""')}"`).join(","))
                      ].join("\n");

                      const blob = new Blob([csvContent], {
                        type: "text/csv;charset=utf-8;",
                      });

                      const url = URL.createObjectURL(blob);

                      const a = document.createElement("a");
                      a.href = url;
                      a.download = "payout-history.csv";
                      a.click();

                      URL.revokeObjectURL(url);
                    }}
                  >
                    <Download
                      size={14}
                      className="text-stone-400 hover:text-stone-900 transition-colors cursor-pointer"
                    />
                  </button>
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

              {/* <button type="button" className="w-full mt-6 bg-stone-50 hover:bg-stone-900 text-stone-500 hover:text-white border border-stone-200/80 rounded-xl text-[10px] font-black uppercase tracking-widest py-3.5 transition-all duration-300 shadow-3xs cursor-pointer flex items-center justify-center gap-1.5">
                Query Payout Audits <ArrowRight size={12} />
              </button> */}
              <button
                type="button"
                onClick={() => showToast("Payout Audit Loaded")}
                className="w-full mt-6 bg-stone-50 hover:bg-stone-900 text-stone-500 hover:text-white border border-stone-200/80 rounded-xl text-[10px] font-black uppercase tracking-widest py-3.5 transition-all duration-300 shadow-sm cursor-pointer flex items-center justify-center gap-1.5"
              >
                Query Payout Audits <ArrowRight size={12} />
              </button>
            </div>

          </div>

        </main>
      </div>

      {/* ── ✅ BRAND FOOTER: Custom dark-wood theme module attaches at viewport bottom edge ── */}


      {toast && (
        <div className="fixed right-4 top-6 z-50 rounded-xl bg-stone-900 px-5 py-3.5 text-xs font-black uppercase tracking-wider text-white shadow-xl font-sans flex items-center gap-2 border border-white/10 animate-fade-in">
          <CheckCircle2 size={14} className="text-emerald-400" />
          <span>{toast}</span>
        </div>
      )}

    </div>
  );
}