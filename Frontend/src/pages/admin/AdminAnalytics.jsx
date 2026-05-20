import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

function AdminAnalytics() {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);

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
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-cream flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-brand-orange border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-cream p-6 md:p-12 font-sans text-brand-dark">
      <div className="max-w-6xl mx-auto">
        
        {/* Header Block */}
        <header className="mb-12">
          <h1 className="text-4xl font-black tracking-tight">
            Platform <span className="text-brand-orange italic">Analytics</span>
          </h1>
          <p className="text-brand-slate font-medium mt-1">Real-time SaaS operational telemetry & insights</p>
        </header>

        {/* 6.1 Platform Metrics Grid Component */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <motion.div 
            whileHover={{ y: -4 }}
            className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-orange-950/5 flex items-center justify-between"
          >
            <div>
              <p className="text-[11px] font-black uppercase text-brand-slate tracking-widest mb-1">Total Active Members</p>
              <h3 className="text-5xl font-black text-brand-dark tabular-nums">{metrics?.totalUsers || 0}</h3>
            </div>
            <div className="w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center text-3xl">👥</div>
          </motion.div>

          <motion.div 
            whileHover={{ y: -4 }}
            className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-orange-950/5 flex items-center justify-between"
          >
            <div>
              <p className="text-[11px] font-black uppercase text-brand-slate tracking-widest mb-1">Registered Salons</p>
              <h3 className="text-5xl font-black text-brand-dark tabular-nums">{metrics?.totalSalons || 0}</h3>
            </div>
            <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-3xl">💈</div>
          </motion.div>
        </div>

        {/* 6.2 Operational Insights Section Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Peak Usage Hours Visual Bar Graph */}
          <div className="bg-white p-6 md:p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-orange-950/5 md:col-span-1">
            <h4 className="text-sm font-black uppercase text-brand-slate tracking-wider mb-6">⏳ Peak Usage Hours</h4>
            <div className="space-y-4">
              {metrics?.peakHours && metrics.peakHours.length > 0 ? (
                metrics.peakHours.map((item, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between text-xs font-bold">
                      <span className="text-brand-dark">{item.hourString}</span>
                      <span className="text-brand-orange">{item.bookingsCount} bookings</span>
                    </div>
                    <div className="w-full bg-slate-50 h-2 rounded-full overflow-hidden">
                      <div 
                        className="bg-brand-orange h-full rounded-full" 
                        style={{ width: `${Math.min(100, (item.bookingsCount / metrics.peakHours[0].bookingsCount) * 100)}%` }}
                      />
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs font-semibold text-brand-slate py-4">No aggregate system booking history found yet.</p>
              )}
            </div>
          </div>

          {/* High-Performing Salons Podiums leaderboard */}
          <div className="bg-white p-6 md:p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-orange-950/5 md:col-span-2">
            <h4 className="text-sm font-black uppercase text-brand-slate tracking-wider mb-6">🏆 High-Performing Salons</h4>
            <div className="divide-y divide-slate-50">
              {metrics?.highPerformingSalons && metrics.highPerformingSalons.length > 0 ? (
                metrics.highPerformingSalons.map((salon, idx) => (
                  <div key={salon._id} className="flex items-center justify-between py-4 first:pt-0 last:pb-0">
                    <div className="flex items-center gap-4">
                      <span className={`w-8 h-8 rounded-xl font-black text-xs flex items-center justify-center ${
                        idx === 0 ? "bg-amber-100 text-amber-700" : idx === 1 ? "bg-slate-100 text-slate-700" : "bg-orange-50 text-brand-orange"
                      }`}>
                        #{idx + 1}
                      </span>
                      <div>
                        <p className="font-bold text-brand-dark text-base">{salon.salonName}</p>
                        <p className="text-xs text-brand-slate">Managed by {salon.ownerName || "Merchant Partner"}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="inline-flex items-center px-3 py-1.5 rounded-xl bg-slate-900 text-white font-mono text-xs font-bold">
                        {salon.totalBookings} checkouts
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs font-semibold text-brand-slate py-4">No salon stores recorded processing booking records yet.</p>
              )}
            </div>
          </div>

        </div>

        {/* Feature Suggestion Hint Block from image details */}
        <footer className="mt-8 text-center bg-brand-dark/5 p-4 rounded-2xl border border-brand-dark/5">
          <p className="text-xs font-bold text-brand-slate">
            💡 <span className="text-brand-dark">Future Extension Blueprint:</span> Ready to interface monetized premium tiers using your <span className="text-brand-orange">"Sponsored/Promoted Salons Slot"</span> feature hook variables!
          </p>
        </footer>

      </div>
    </div>
  );
}

export default AdminAnalytics;