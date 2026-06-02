import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Scissors, LogOut, TrendingUp, Users, Store, Clock, Award, Lightbulb } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function AdminAnalytics() {
  const navigate = useNavigate();
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [time, setTime] = useState(new Date().toLocaleTimeString("en-IN", { hour: '2-digit', minute: '2-digit' }));

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/admin/global-metrics");
        const json = await res.json();
        if (json.success) setMetrics(json.metrics);
      } catch (err) {
        console.error("Error loading platform insights:", err);
      } finally {
        setLoading(false); 
      }
    };
    
    fetchAnalytics();
    const timer = setInterval(() => {
      setTime(new Date().toLocaleTimeString("en-IN", { hour: '2-digit', minute: '2-digit' }));
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-3" style={{ background: "#FAF6F0" }}>
        <div className="w-10 h-10 border-4 border-amber-600 border-t-transparent rounded-full animate-spin" />
        <p className="font-sans text-[11px] font-extrabold uppercase tracking-widest text-stone-400 animate-pulse">Syncing Telemetry System...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen font-sans text-stone-800 selection:bg-amber-100" style={{ background: "#FAF6F0" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap');
        body { background-color: #FAF6F0; }
        .font-sans { font-family: 'Plus Jakarta Sans', sans-serif !important; }
        .font-serif { font-family: 'Playfair Display', serif !important; }
        
        .card { 
          background: #FFFFFF; 
          border: 1px solid #EADBCE; 
          border-radius: 24px; 
          box-shadow: 0 4px 20px -2px rgba(28, 25, 23, 0.04), 0 2px 8px -1px rgba(28, 25, 23, 0.02);
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .card:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 24px -4px rgba(28, 25, 23, 0.06), 0 4px 12px -2px rgba(28, 25, 23, 0.03);
          border-color: #D6C4AE;
        }
      `}</style>

      {/* ── STICKY TOP PLATFORM HEADER ── */}
      <header className="w-full border-b border-[#3E362E] bg-[#251F1B] sticky top-0 z-40 px-6 py-4 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#D97706] to-[#F59E0B] flex items-center justify-center shadow-md">
            <Scissors size={20} className="text-white" strokeWidth={2.5} />
          </div>
          <div>
            <h4 className="font-sans font-black uppercase tracking-widest text-xs text-white">Barber Pro</h4>
            <p className="font-sans text-[11px] font-extrabold uppercase tracking-widest text-[#C5A059] mt-0.5">Admin Management</p>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="hidden sm:flex flex-col text-right">
            <span className="font-sans text-[11px] font-extrabold uppercase tracking-widest text-stone-400">System Clock</span>
            <span className="font-sans text-xs font-extrabold text-[#FFE6A7] mt-0.5">{time} IST</span>
          </div>
          <button onClick={handleLogout} className="flex items-center gap-2 border border-stone-700 hover:border-stone-500 bg-white/5 hover:bg-white/10 px-4 py-2 rounded-xl text-stone-200 font-sans text-xs font-extrabold uppercase tracking-wider transition-all duration-200 cursor-pointer">
            <LogOut size={14} /> Exit
          </button>
        </div>
      </header>

      {/* ── MAIN WORKSPACE VIEWPORT ── */}
      <main className="max-w-6xl mx-auto px-4 py-10 md:px-8">
        
        {/* Context Dashboard Banner */}
        <header className="mb-8 rounded-3xl p-8 card relative overflow-hidden bg-white">
          <div className="relative z-10">
            <p className="font-sans text-[11px] font-extrabold uppercase tracking-widest text-[#C5A059] mb-1.5">
              Real-time SaaS operational telemetry & insights
            </p>
            <h1 className="font-sans font-black uppercase text-4xl sm:text-5xl tracking-tight text-stone-900 leading-none">
                 Platform <span className="font-serif italic text-3xl sm:text-4xl text-[#C5A059] normal-case">Analytics</span>
              </h1>
            <p className="font-sans text-sm font-normal leading-relaxed text-stone-600 mt-3">Review global system utilization, identify scaling constraints, and monitor ecosystem growth tracks.</p>
          </div>
          <div className="absolute right-6 top-1/2 -translate-y-1/2 opacity-5 transform rotate-6 pointer-events-none hidden sm:block">
            <TrendingUp className="w-28 h-28 text-amber-700" strokeWidth={1} />
          </div>
        </header>

        {/* Core Global Aggregate Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <motion.div whileHover={{ y: -3 }} className="p-6 rounded-3xl card bg-white flex items-center justify-between">
            <div>
              <p className="font-sans text-[11px] font-extrabold uppercase tracking-widest text-stone-400 mb-2">Total Active Members</p>
              <h3 className="font-sans font-black text-4xl text-stone-900 leading-none tabular-nums">{metrics?.totalUsers || 0}</h3>
            </div>
            <div className="w-14 h-14 bg-amber-50 rounded-2xl flex items-center justify-center border border-amber-100/70 text-amber-700">
              <Users size={22} />
            </div>
          </motion.div>

          <motion.div whileHover={{ y: -3 }} className="p-6 rounded-3xl card bg-white flex items-center justify-between">
            <div>
              <p className="font-sans text-[11px] font-extrabold uppercase tracking-widest text-stone-400 mb-2">Registered Salons</p>
              <h3 className="font-sans font-black text-4xl text-stone-900 leading-none tabular-nums">{metrics?.totalSalons || 0}</h3>
            </div>
            <div className="w-14 h-14 bg-orange-50 rounded-2xl flex items-center justify-center border border-orange-100/70 text-orange-700">
              <Store size={22} />
            </div>
          </motion.div>
        </div>

        {/* Operational Insight Visualization Panes */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          
          {/* Peak Booking Interval Component Card */}
          <div className="p-6 rounded-3xl card bg-white md:col-span-1">
            <div className="flex items-center gap-2 mb-6 border-b border-stone-50 pb-3">
              <Clock size={16} className="text-amber-700" />
              <h4 className="font-sans text-[11px] font-extrabold uppercase tracking-widest text-stone-400">Peak Usage Hours</h4>
            </div>
            <div className="space-y-4">
              {metrics?.peakHours && metrics.peakHours.length > 0 ? (
                metrics.peakHours.map((item, idx) => (
                  <div key={idx} className="space-y-2">
                    <div className="flex justify-between">
                      <span className="font-mono text-sm text-stone-800">{item.hourString}</span>
                      <span className="font-mono text-sm text-amber-700">{item.bookingsCount} orders</span>
                    </div>
                    <div className="w-full bg-stone-50 h-2 rounded-full overflow-hidden border border-stone-200/40">
                      <div 
                        className="bg-gradient-to-r from-amber-500 to-amber-600 h-full rounded-full transition-all duration-500" 
                        style={{ width: `${Math.min(100, (item.bookingsCount / metrics.peakHours[0].bookingsCount) * 100)}%` }}
                      />
                    </div>
                  </div>
                ))
              ) : (
                <p className="font-sans text-sm font-normal leading-relaxed text-stone-400 py-4 italic">No aggregate system booking history found yet.</p>
              )}
            </div>
          </div>

          {/* High-Performing Salons Ledger Component */}
          <div className="p-6 rounded-3xl card bg-white md:col-span-2">
            <div className="flex items-center gap-2 mb-6 border-b border-stone-50 pb-3">
              <Award size={16} className="text-amber-700" />
              <h4 className="font-sans text-[11px] font-extrabold uppercase tracking-widest text-stone-400">High-Performing Salons</h4>
            </div>
            <div className="divide-y divide-stone-100">
              {metrics?.highPerformingSalons && metrics.highPerformingSalons.length > 0 ? (
                metrics.highPerformingSalons.map((salon, idx) => (
                  <div key={salon._id} className="flex items-center justify-between py-4 first:pt-0 last:pb-0 transition-colors duration-200 hover:bg-stone-50/40 px-2 rounded-xl">
                    <div className="flex items-center gap-4 min-w-0">
                      <span className={`w-8 h-8 rounded-xl font-sans font-black text-xs flex items-center justify-center shrink-0 border ${
                        idx === 0 ? "bg-amber-50 text-amber-700 border-amber-200" : idx === 1 ? "bg-stone-50 text-stone-600 border-stone-200" : "bg-orange-50 text-orange-700 border-orange-100"
                      }`}>
                        #{idx + 1}
                      </span>
                      <div className="min-w-0">
                        <p className="font-sans text-sm font-extrabold text-stone-900 truncate">{salon.salonName}</p>
                        <p className="font-sans text-sm font-normal leading-relaxed text-stone-400 mt-0.5">Owner: {salon.ownerName || "Merchant Partner"}</p>
                      </div>
                    </div>
                    <div className="shrink-0 ml-3">
                      <span className="inline-flex items-center px-3 py-1.5 rounded-xl bg-stone-900 text-white font-sans text-xs font-extrabold uppercase tracking-wider">
                        {salon.totalBookings} checkouts
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="font-sans text-sm font-normal leading-relaxed text-stone-400 py-4 italic">No salon stores recorded processing booking records yet.</p>
              )}
            </div>
          </div>

        </div>

        {/* Product Expansion Map Footer */}
        <footer className="text-center bg-[#FEF9EE] p-4 rounded-2xl border border-[#EADBCE]">
          <p className="font-sans text-sm font-normal leading-relaxed text-stone-600">
            <Lightbulb size={14} className="inline mr-1.5 text-amber-600 mb-0.5" /> 
            <span className="font-sans font-black uppercase text-stone-900 text-xs tracking-tight">Future Extension Blueprint:</span> Ready to interface monetized premium tiers using your <span className="text-[#C5A059] font-extrabold">"Sponsored/Promoted Salons Slot"</span> feature hook variables!
          </p>
        </footer>

      </main>
    </div>
  );
}