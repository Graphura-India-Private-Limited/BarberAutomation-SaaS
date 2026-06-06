import React, { useState, useEffect, useMemo } from "react";
import { useOutletContext } from "react-router-dom";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const CHARCOAL = "#3E362E";
const GOLD = "#C5A059";

function StatCard({ label, value }) {
  return (
    <div className="card p-6 flex flex-col justify-between bg-white text-left">
      <h3 className="text-[10px] font-extrabold uppercase tracking-widest text-[#C5A059] mb-1 font-sans">{label}</h3>
      <p className="text-2xl sm:text-3xl font-black font-serif tracking-normal text-stone-900 leading-tight">{value}</p>
    </div>
  );
}

export default function FinancePage() {
  const { salon, token } = useOutletContext();
  const [revenueData, setRevenueData] = useState(null);
  const [dailyRevenue, setDailyRevenue] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFinance = async () => {
      setLoading(true);
      try {
        const [revRes, dailyRes] = await Promise.all([
          fetch(`${API}/payment/revenue/dashboard`, { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()).catch(() => null),
          fetch(`${API}/payment/revenue/daily`, { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()).catch(() => null),
        ]);
        if (revRes?.success) setRevenueData(revRes);
        if (dailyRes?.success) setDailyRevenue(dailyRes.revenue);
      } catch (err) {
        console.error("Error loading finance page data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchFinance();
  }, [salon._id, token]);

  const activeFinance = useMemo(() => {
    const today = dailyRevenue?.totalRevenue || 0;
    const total = revenueData?.summary?.totalRevenue || 0;
    
    // Construct barber breakdown list based on the salon salary settings
    const barbers = (revenueData?.barbers || []).map((b, idx) => {
      const isCommission = salon.salary_model === "commission";
      const commRate = salon.commission_percent || 10;
      const earned = isCommission ? Math.round(b.revenue * (commRate / 100)) : 15000;

      return {
        name: b.barberName,
        revenue: b.revenue || 0,
        type: isCommission ? "Commission" : "Fixed Salary",
        rate: isCommission ? `${commRate}%` : null,
        earned: earned
      };
    });

    const services = (revenueData?.services || []).map(s => ({
      service: s.serviceName,
      count: s.transactions || 0,
      revenue: s.revenue || 0
    }));

    return {
      todayRevenue: today,
      weekRevenue: Math.round(total * 0.4), // Estimate weekly share
      monthRevenue: total,
      barberBreakdown: barbers,
      topServices: services
    };
  }, [revenueData, dailyRevenue, salon]);

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center font-sans">
        <div className="text-stone-500 font-semibold tracking-wider animate-pulse uppercase text-xs">
          Loading Finance Workspace...
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto text-left font-sans animate-fade-in">
      <style>{`
        .card { 
          background: #FFFFFF; 
          border: 1px solid #EADBCE; 
          border-radius: 24px; 
          box-shadow: 0 4px 20px -2px rgba(28, 25, 23, 0.03);
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .card:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 24px -4px rgba(28, 25, 23, 0.06);
          border-color: #C5A059;
        }
      `}</style>

      <div className="mb-6">
        <p className="text-amber-700 font-sans font-bold tracking-[2px] text-xs sm:text-sm uppercase mb-1">
          Salon Financial Administration
        </p>
        <h2 className="text-3xl sm:text-4xl font-black text-stone-900 font-serif tracking-normal mb-1">
          Finance Overview
        </h2>
        <p className="text-sm text-stone-500 font-sans normal-case">
          Full financial statements and barber payouts for {salon?.salon_name}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <StatCard label="Today's Revenue" value={`₹${activeFinance.todayRevenue.toLocaleString()}`} />
        <StatCard label="Estimated Weekly" value={`₹${activeFinance.weekRevenue.toLocaleString()}`} />
        <StatCard label="Total Captured (Month)" value={`₹${activeFinance.monthRevenue.toLocaleString()}`} />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Left Panel: Barber Earnings */}
        <div className="card p-6 bg-white">
          <h3 className="text-lg font-bold text-stone-900 font-serif mb-4">
            Barber Earnings Breakdown
          </h3>
          
          {activeFinance.barberBreakdown.length === 0 ? (
            <p className="text-stone-400 text-xs font-black uppercase tracking-widest py-6">No barbers registered or serving.</p>
          ) : (
            <div className="space-y-4">
              {activeFinance.barberBreakdown.map((b, i) => (
                <div key={i} className="bg-amber-50/50 border border-amber-200/50 rounded-xl p-4 transition-all duration-200 hover:bg-amber-50 text-left">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-bold text-stone-900">{b.name}</span>
                    <span className="text-[10px] bg-amber-100 text-amber-800 font-black border border-amber-200/60 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                      {b.type}
                    </span>
                  </div>
                  <div className="text-sm text-stone-600 space-y-1 font-sans">
                    <p>Generated Revenue: <strong className="text-stone-950 font-bold">₹{b.revenue.toLocaleString()}</strong></p>
                    {b.rate && <p>Commission Rate: <strong className="text-stone-950 font-bold">{b.rate}</strong></p>}
                    <p>Payout Share: <strong className="text-emerald-700 font-black">₹{b.earned.toLocaleString()}</strong></p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Panel: Top Services */}
        <div className="card p-6 bg-white">
          <h3 className="text-lg font-bold text-stone-900 font-serif mb-4">Top Performing Services</h3>
          
          {activeFinance.topServices.length === 0 ? (
            <p className="text-stone-400 text-xs font-black uppercase tracking-widest py-6">No service sales captured.</p>
          ) : (
            <div className="space-y-3">
              {activeFinance.topServices.map((s, i) => (
                <div key={i} className="flex items-center justify-between bg-amber-50/50 rounded-xl px-4 py-3 border border-amber-200/50 transition-all duration-200 hover:bg-amber-50">
                  <div className="text-left">
                    <p className="font-bold text-stone-900">{s.service}</p>
                    <p className="text-xs text-stone-500 font-sans">{s.count} sessions</p>
                  </div>
                  <span className="font-bold text-amber-700 font-serif">₹{s.revenue.toLocaleString()}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}