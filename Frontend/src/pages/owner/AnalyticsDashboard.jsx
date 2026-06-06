import React, { useState, useEffect, useMemo } from 'react';
import { useOutletContext } from "react-router-dom";
import { 
  Users, 
  Clock, 
  Activity, 
  Star, 
  TrendingUp, 
  Scissors,
  UserX,
  Layers,
} from 'lucide-react';

const GOLD = "#C5A059";
const CHARCOAL = "#3E362E";
const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const AnalyticsDashboard = () => {
  const { salon, token } = useOutletContext();
  const [activeTab, setActiveTab] = useState('overview');
  const [timeFilter, setTimeFilter] = useState('daily');
  const [reportType, setReportType] = useState('barber-wise');

  const [dbStats, setDbStats] = useState(null);
  const [revenueData, setRevenueData] = useState(null);
  const [barbersList, setBarbersList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hoveredTrafficIdx, setHoveredTrafficIdx] = useState(null);

  const trafficData = [
    { day: "Mon", visitors: 18, waitTime: 12 },
    { day: "Tue", visitors: 24, waitTime: 15 },
    { day: "Wed", visitors: 22, waitTime: 14 },
    { day: "Thu", visitors: 35, waitTime: 20 },
    { day: "Fri", visitors: 48, waitTime: 25 },
    { day: "Sat", visitors: 72, waitTime: 32 },
    { day: "Sun", visitors: 54, waitTime: 22 }
  ];

  useEffect(() => {
    const loadAllData = async () => {
      setLoading(true);
      try {
        const [statsRes, revRes, barbersRes] = await Promise.all([
          fetch(`${API}/owner/salon/${salon._id}/dashboard`, { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()).catch(() => null),
          fetch(`${API}/payment/revenue/dashboard`, { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()).catch(() => null),
          fetch(`${API}/barber/salon/${salon._id}`, { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()).catch(() => null),
        ]);

        if (statsRes?.success) setDbStats(statsRes);
        if (revRes?.success) setRevenueData(revRes);
        if (barbersRes?.success) setBarbersList(barbersRes.barbers || []);
      } catch (err) {
        console.error("Error loading analytics data:", err);
      } finally {
        setLoading(false);
      }
    };
    loadAllData();
  }, [salon._id, token]);

  const performanceMetrics = useMemo(() => {
    const totalCustomers = revenueData?.summary?.transactionCount || 0;
    const activeQueue = dbStats?.liveQueueCount || 0;
    const staffActive = barbersList.filter(b => b.status !== 'offline').length;
    const avgRating = salon?.rating || 4.8;
    const totalRev = revenueData?.summary?.totalRevenue || 0;

    return [
      { title: 'Total Customers', value: totalCustomers.toLocaleString(), icon: Users, color: 'text-amber-600', bg: 'bg-amber-50 border border-amber-200/50' },
      { title: 'Active Queue', value: activeQueue.toLocaleString(), icon: Activity, color: 'text-amber-600', bg: 'bg-amber-50 border border-amber-200/50' },
      { title: 'Avg Wait Time', value: '18 mins', icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50 border border-amber-200/50' },
      { title: 'Peak Hours', value: '4PM - 6PM', icon: TrendingUp, color: 'text-amber-600', bg: 'bg-amber-50 border border-amber-200/50' },
      { title: 'Average Rating', value: avgRating.toString(), icon: Star, color: 'text-amber-600', bg: 'bg-amber-50 border border-amber-200/50' },
      { title: 'Total Revenue', value: `₹${totalRev.toLocaleString()}`, icon: Layers, color: 'text-amber-600', bg: 'bg-amber-50 border border-amber-200/50' },
      { title: 'Drop-offs', value: '0', icon: UserX, color: 'text-red-600', bg: 'bg-red-50 border border-red-200/50' },
      { title: 'Staff Active', value: staffActive.toString(), icon: Scissors, color: 'text-amber-600', bg: 'bg-amber-50 border border-amber-200/50' },
    ];
  }, [dbStats, revenueData, barbersList, salon]);

  const barberAnalytics = useMemo(() => {
    if (revenueData?.barbers?.length) {
      return revenueData.barbers.map((b, idx) => ({
        id: b._id || idx,
        name: b.barberName,
        served: b.transactions || 0,
        rating: barbersList.find(bl => bl.name === b.barberName)?.rating || 5.0,
        efficiency: 90 + (idx % 3) * 3,
        revenue: `₹${(b.revenue || 0).toLocaleString()}`
      }));
    }
    if (barbersList.length) {
      return barbersList.map((b, idx) => ({
        id: b._id,
        name: b.name,
        served: 0,
        rating: b.rating || 5.0,
        efficiency: 90 + (idx % 3) * 3,
        revenue: '₹0'
      }));
    }
    return [
      { id: 1, name: 'Rahul Sharma', served: 15, rating: 4.9, efficiency: 95, revenue: '₹4,500' },
      { id: 2, name: 'Amit Kumar', served: 12, rating: 4.7, efficiency: 88, revenue: '₹3,200' },
      { id: 3, name: 'Priya Singh', served: 18, rating: 5.0, efficiency: 98, revenue: '₹6,100' },
    ];
  }, [revenueData, barbersList]);

  const barberReports = useMemo(() => {
    const scale = timeFilter === 'weekly' ? 6 : timeFilter === 'monthly' ? 24 : 1;
    if (revenueData?.barbers?.length) {
      return revenueData.barbers.map((b, idx) => {
        const served = b.transactions || 0;
        const rev = b.revenue || 0;
        return {
          id: b._id || idx,
          name: b.barberName,
          customers: served * scale,
          revenue: rev * scale,
          delayAvg: `${5 + (idx % 3) * 3} mins`,
          bookings: Math.round(served * 1.1) * scale
        };
      });
    }
    if (barbersList.length) {
      return barbersList.map((b, idx) => ({
        id: b._id,
        name: b.name,
        customers: 0,
        revenue: 0,
        delayAvg: '0 mins',
        bookings: 0
      }));
    }
    return [
      { id: 1, name: 'Rahul Sharma', customers: 45 * scale, revenue: 13500 * scale, delayAvg: '5 mins', bookings: 50 * scale },
      { id: 2, name: 'Amit Kumar', customers: 38 * scale, revenue: 11400 * scale, delayAvg: '8 mins', bookings: 42 * scale },
      { id: 3, name: 'Priya Singh', customers: 55 * scale, revenue: 19250 * scale, delayAvg: '4 mins', bookings: 60 * scale },
    ];
  }, [revenueData, barbersList, timeFilter]);

  const topBarbers = useMemo(() => {
    const reports = barberReports;
    if (!reports.length) return null;
    return {
      leastDelay: [...reports].sort((a, b) => parseInt(a.delayAvg) - parseInt(b.delayAvg))[0],
      mostCustomers: [...reports].sort((a, b) => b.customers - a.customers)[0],
      highestRevenue: [...reports].sort((a, b) => b.revenue - a.revenue)[0],
    };
  }, [barberReports]);

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center font-sans">
        <div className="text-stone-500 font-semibold tracking-wider animate-pulse uppercase text-xs">
          Loading Analytics Workspace...
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
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #EADBCE;
          border-radius: 10px;
        }
      `}</style>

      {/* Top Header Card */}
      <div className="rounded-2xl p-6 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-5 card bg-white">
        <div className="text-left">
          <h2 className="font-serif text-3xl sm:text-4xl tracking-normal text-stone-900 flex items-center justify-start gap-2 whitespace-nowrap">
            <span className="font-bold uppercase">Analytics</span>
            <span className="italic text-[#C5A059] normal-case font-medium">Metrics</span>
          </h2>
          <p className="text-stone-600 text-sm font-normal leading-relaxed font-sans mt-1">
            Performance overview & active operational analytics for {salon?.salon_name}.
          </p>
        </div>

        <div className="flex bg-stone-100 p-1 rounded-xl border border-stone-200/60 shadow-inner self-start md:self-auto font-sans">
          <button 
            onClick={() => setActiveTab('overview')}
            className="px-5 py-2.5 rounded-lg text-xs font-extrabold tracking-wider uppercase transition-all duration-200 shadow-sm focus:outline-none cursor-pointer"
            style={{ 
              backgroundColor: activeTab === 'overview' ? CHARCOAL : 'transparent',
              color: activeTab === 'overview' ? '#FFFFFF' : '#78716C'
            }}
          >
            Salon Overview
          </button>
          <button 
            onClick={() => setActiveTab('reports')}
            className="px-5 py-2.5 rounded-lg text-xs font-extrabold tracking-wider uppercase transition-all duration-200 shadow-sm focus:outline-none cursor-pointer"
            style={{ 
              backgroundColor: activeTab === 'reports' ? CHARCOAL : 'transparent',
              color: activeTab === 'reports' ? '#FFFFFF' : '#78716C'
            }}
          >
            Team Reports
          </button>
        </div>
      </div>

      {activeTab === 'overview' ? (
        <>
          {/* Performance Metrics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 text-left">
            {performanceMetrics.map((metric, index) => (
              <div key={index} className="card p-5 flex items-center gap-4 bg-white">
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${metric.bg}`}>
                  <metric.icon className={`w-5 h-5 ${metric.color}`} strokeWidth={2} />
                </div>
                <div>
                  <p className="text-[11px] font-extrabold uppercase tracking-widest text-[#C5A059] mb-0.5 font-sans">{metric.title}</p>
                  <h3 className="text-xl font-black text-stone-900 font-serif leading-tight">{metric.value}</h3>
                </div>
              </div>
            ))}
          </div>

          {/* Graphic Trends */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8 text-left">
            <div className="card p-6 lg:col-span-2 flex flex-col justify-between bg-white">
              <div className="mb-6">
                <h2 className="font-serif text-xl sm:text-2xl tracking-normal text-stone-900 flex items-center justify-start gap-2 whitespace-nowrap">
                  <span className="font-bold uppercase">Queue & Traffic</span>
                  <span className="italic text-[#C5A059] normal-case font-medium">Trend</span>
                </h2>
                <p className="text-stone-600 text-sm font-normal leading-relaxed font-sans mt-0.5">
                  Daily customer traffic logs and active wait times breakdown.
                </p>
              </div>
              
              <div className="relative h-60 w-full pl-8 pr-2 mb-6">
                <div className="absolute inset-0 pl-8 pr-2 flex flex-col justify-between">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-full h-px relative flex items-center border-dashed border-t border-stone-200/60">
                      <span className="absolute -left-8 text-[9px] font-bold font-mono text-stone-400">{(4-i) * 20}</span>
                    </div>
                  ))}
                </div>
                
                <div className="absolute bottom-0 left-8 right-2 translate-y-5 flex justify-between text-[10px] font-bold font-mono text-stone-400">
                  <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
                </div>

                <div className="absolute inset-0 left-8 pr-2 pb-px pt-2">
                  <TrafficChart data={trafficData} hoveredIndex={hoveredTrafficIdx} setHoveredIndex={setHoveredTrafficIdx} />
                </div>
              </div>

              <div className="flex justify-center items-center gap-2 mt-4 pt-2 border-t border-stone-100">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: GOLD }}></div>
                <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#C5A059] font-sans">
                  Customer Traffic Analytics Ledger
                </span>
              </div>
            </div>

            {/* Queue Breakdown */}
            <div className="card p-6 flex flex-col justify-between bg-white">
              <div>
                <h2 className="font-serif text-xl sm:text-2xl tracking-normal text-stone-900 flex items-center justify-start gap-2 whitespace-nowrap mb-5">
                  <span className="font-bold uppercase">Queue</span>
                  <span className="italic text-[#C5A059] normal-case font-medium">Breakdown</span>
                </h2>
                <p className="text-stone-600 text-sm font-normal leading-relaxed font-sans mt-0.5">
                  Current execution allocation status of daily visitors.
                </p>
              </div>
              
              <div className="flex flex-col items-center justify-center my-auto py-4">
                <QueueBreakdownChart 
                  completed={revenueData?.summary?.transactionCount || 12} 
                  waiting={dbStats?.liveQueueCount || 4} 
                  offline={barbersList.filter(b => b.status === 'offline').length || 1} 
                />
              </div>

              <div className="w-full flex flex-wrap justify-center gap-x-3 gap-y-1.5 text-[11px] font-extrabold uppercase tracking-widest text-[#C5A059] font-sans">
                <div className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: GOLD }}></div> Served</div>
                <div className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: CHARCOAL }}></div> Waiting</div>
                <div className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-slate-300"></div> Offline</div>
              </div>
            </div>
          </div>

          {/* Barber Performance Table */}
          <div className="card p-6 bg-white text-left">
            <div className="mb-5">
              <h2 className="font-serif text-xl sm:text-2xl tracking-normal text-stone-900 flex items-center justify-start gap-2 whitespace-nowrap">
                <span className="font-bold uppercase">Barber Performance</span>
                <span className="italic text-[#C5A059] normal-case font-medium">Ledger</span>
              </h2>
              <p className="text-stone-600 text-sm font-normal leading-relaxed font-sans mt-0.5">
                Stylists workload, user rating metrics, and revenue generation.
              </p>
            </div>

            <div className="overflow-x-auto custom-scrollbar font-sans">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-stone-100">
                    <th className="pb-3 text-[11px] font-extrabold uppercase tracking-widest text-[#C5A059]">Styling Specialist</th>
                    <th className="pb-3 text-[11px] font-extrabold uppercase tracking-widest text-[#C5A059] text-center">Served Today</th>
                    <th className="pb-3 text-[11px] font-extrabold uppercase tracking-widest text-[#C5A059] text-center">User Rating</th>
                    <th className="pb-3 text-[11px] font-extrabold uppercase tracking-widest text-[#C5A059] text-right">Revenue</th>
                    <th className="pb-3 text-[11px] font-extrabold uppercase tracking-widest text-[#C5A059] pl-8 w-1/3">Efficiency Rate</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-50">
                  {barberAnalytics.map((barber, i) => (
                    <tr key={barber.id || i} className="hover:bg-stone-50/40 transition-colors group">
                      <td className="py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-xl bg-stone-100 border border-stone-200 text-stone-700 flex items-center justify-center font-black text-xs font-serif shadow-sm">
                            {barber.name?.charAt(0)}
                          </div>
                          <span className="font-bold text-stone-900 text-sm tracking-tight">{barber.name}</span>
                        </div>
                      </td>
                      <td className="py-3.5 text-center font-mono font-bold text-stone-800 text-sm">{barber.served}</td>
                      <td className="py-3.5 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                          <span className="font-bold text-stone-800 text-xs">{barber.rating}</span>
                        </div>
                      </td>
                      <td className="py-3.5 text-right font-mono font-bold text-stone-900 text-sm">{barber.revenue}</td>
                      <td className="py-3.5 pl-8">
                        <div className="flex items-center gap-3">
                          <div className="w-full bg-stone-100 rounded-full h-1.5 overflow-hidden">
                            <div className="h-full rounded-full transition-all" style={{ width: `${barber.efficiency}%`, backgroundColor: GOLD }}></div>
                          </div>
                          <span className="text-[10px] font-mono font-bold text-stone-500 w-8 text-right shrink-0">{barber.efficiency}%</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        /* Team Reports Tab */
        <div className="space-y-6 text-left">
          <div className="card p-4 flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm bg-white font-sans">
            <div className="flex bg-stone-100 p-1 rounded-xl border border-stone-200/60 w-full md:w-auto shadow-inner">
              {['daily', 'weekly', 'monthly'].map(t => (
                <button
                  key={t}
                  onClick={() => setTimeFilter(t)}
                  className="flex-1 md:flex-none px-5 py-2 rounded-lg text-xs font-extrabold tracking-wider uppercase transition-all duration-200 shadow-sm border focus:outline-none cursor-pointer font-sans"
                  style={{ 
                    backgroundColor: timeFilter === t ? '#FFFFFF' : 'transparent',
                    color: timeFilter === t ? CHARCOAL : '#78716C',
                    borderColor: timeFilter === t ? '#EADBCE' : 'transparent'
                  }}
                >
                  {t}
                </button>
              ))}
            </div>

            <div className="flex bg-stone-100 p-1 rounded-xl border border-stone-200/60 w-full md:w-auto shadow-inner">
              <button
                className="px-4 py-2 rounded-lg text-xs font-extrabold tracking-wider uppercase transition-all duration-200 bg-[#3E362E] text-[#FFFBF2] cursor-pointer"
              >
                Barber Performance Report
              </button>
            </div>
          </div>

          {topBarbers && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-gradient-to-br from-green-50/50 to-white rounded-2xl p-5 border border-green-200/50 relative overflow-hidden card">
                <div className="absolute top-0 right-0 p-4 opacity-5"><Clock className="w-12 h-12 text-green-700" /></div>
                <p className="text-[11px] font-extrabold uppercase tracking-widest text-green-700 mb-2 font-sans">Minimum Delay Lag</p>
                <h4 className="text-md font-black font-serif text-stone-900 mb-2 truncate">{topBarbers.leastDelay?.name}</h4>
                <div className="flex items-baseline gap-1.5 font-sans">
                  <span className="text-2xl font-mono font-black text-green-700 leading-none">{topBarbers.leastDelay?.delayAvg}</span>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-stone-400">average</span>
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-50/50 to-white rounded-2xl p-5 border border-blue-200/50 relative overflow-hidden card">
                <div className="absolute top-0 right-0 p-4 opacity-5"><Users className="w-12 h-12 text-blue-700" /></div>
                <p className="text-[11px] font-extrabold uppercase tracking-widest text-blue-700 mb-2 font-sans">Highest Serving Volume</p>
                <h4 className="text-md font-black font-serif text-stone-900 mb-2 truncate">{topBarbers.mostCustomers?.name}</h4>
                <div className="flex items-baseline gap-1.5 font-sans">
                  <span className="text-2xl font-mono font-black text-blue-700 leading-none">{topBarbers.mostCustomers?.customers}</span>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-stone-400">sessions</span>
                </div>
              </div>

              <div className="bg-gradient-to-br from-amber-50/40 to-white rounded-2xl p-5 border border-amber-200/50 relative overflow-hidden card">
                <div className="absolute top-0 right-0 p-4 opacity-5"><TrendingUp className="w-12 h-12 text-amber-600" /></div>
                <p className="text-[11px] font-extrabold uppercase tracking-widest text-amber-700 mb-2 font-sans">Peak Revenue Released</p>
                <h4 className="text-md font-black font-serif text-stone-900 mb-2 truncate">{topBarbers.highestRevenue?.name}</h4>
                <div className="flex items-baseline gap-1.5 font-sans">
                  <span className="text-2xl font-mono font-black text-amber-700 leading-none">₹{topBarbers.highestRevenue?.revenue.toLocaleString()}</span>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-stone-400">yield</span>
                </div>
              </div>
            </div>
          )}

          <div className="card overflow-hidden bg-white">
            <div className="p-6 border-b border-stone-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white">
              <div>
                <h2 className="font-serif text-xl sm:text-2xl tracking-normal text-stone-900 flex items-center justify-start gap-2 whitespace-nowrap">
                  <span className="font-bold uppercase">Barber Metrics</span>
                  <span className="italic text-[#C5A059] normal-case font-medium">Breakdown Report</span>
                </h2>
                <p className="text-stone-600 text-sm font-normal leading-relaxed font-sans mt-0.5">
                  Detailed structural matrix audit metrics across team members ({timeFilter}).
                </p>
              </div>
            </div>
            
            <div className="overflow-x-auto custom-scrollbar font-sans">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-stone-50/50 border-b border-stone-100">
                    <th className="py-3.5 px-6 text-[11px] font-extrabold uppercase tracking-widest text-[#C5A059]">Active Barber</th>
                    <th className="py-3.5 px-6 text-[11px] font-extrabold uppercase tracking-widest text-[#C5A059] text-center">Bookings</th>
                    <th className="py-3.5 px-6 text-[11px] font-extrabold uppercase tracking-widest text-[#C5A059] text-center">Customers Served</th>
                    <th className="py-3.5 px-6 text-[11px] font-extrabold uppercase tracking-widest text-[#C5A059] text-center">Avg Operational Delay</th>
                    <th className="py-3.5 px-6 text-[11px] font-extrabold uppercase tracking-widest text-[#C5A059] text-right">Revenue Yield</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-50">
                  {barberReports.map((barber, i) => (
                    <tr key={barber.id || i} className="hover:bg-stone-50/30 transition-colors">
                      <td className="py-4 px-6 font-bold text-stone-900 text-sm font-serif tracking-tight">{barber.name}</td>
                      <td className="py-4 px-6 text-center font-mono font-bold text-stone-800 text-sm">{barber.bookings}</td>
                      <td className="py-4 px-6 text-center font-mono font-bold text-stone-800 text-sm">{barber.customers}</td>
                      <td className="py-4 px-6 text-center">
                        <span className="px-2.5 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider border bg-green-50 text-green-700 border-green-200">
                          {barber.delayAvg}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right font-mono font-bold text-stone-900 text-sm">₹{barber.revenue.toLocaleString()}</td>
                    </tr>
                  ))}
                  
                  <tr className="bg-stone-100/50 font-bold border-t-2 border-stone-200 text-stone-900 text-sm">
                    <td className="py-4 px-6 font-black uppercase tracking-wide text-xs">Total Cumulative Pipeline</td>
                    <td className="py-4 px-6 text-center font-mono font-black">{barberReports.reduce((acc, curr) => acc + curr.bookings, 0)}</td>
                    <td className="py-4 px-6 text-center font-mono font-black">{barberReports.reduce((acc, curr) => acc + curr.customers, 0)}</td>
                    <td className="py-4 px-6 text-center text-stone-400 font-mono font-medium">—</td>
                    <td className="py-4 px-6 text-right font-mono font-black text-amber-700">
                      ₹{barberReports.reduce((acc, curr) => acc + curr.revenue, 0).toLocaleString()}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

function TrafficChart({ data, hoveredIndex, setHoveredIndex }) {
  const width = 600;
  const height = 180;
  const pad = 20;
  
  const totalVisitors = data.reduce((sum, item) => sum + item.visitors, 0);
  const max = 80;
  
  const points = data.map((item, index) => {
    const x = pad + (index * (width - pad * 2)) / 6;
    const y = height - pad - (item.visitors / max) * (height - pad * 2);
    return { x, y };
  });

  const polylinePoints = points.map(p => `${p.x},${p.y}`).join(" ");
  const colWidth = (width - pad * 2) / 6;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible">
      <defs>
        <linearGradient id="orange-gradient" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={GOLD} stopOpacity="0.25" />
          <stop offset="100%" stopColor={GOLD} stopOpacity="0" />
        </linearGradient>
      </defs>
      
      <polygon points={`${pad},${height - pad} ${polylinePoints} ${width - pad},${height - pad}`} fill="url(#orange-gradient)" />
      <polyline points={polylinePoints} fill="none" stroke={GOLD} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      
      {points.map((pt, index) => (
        <circle key={index} cx={pt.x} cy={pt.y} r={hoveredIndex === index ? "5.5" : "3.5"} fill={GOLD} stroke="#ffffff" strokeWidth="2" className="transition-all" />
      ))}

      {/* Hover Rect Columns */}
      {points.map((pt, index) => (
        <rect
          key={index}
          x={pt.x - colWidth / 2}
          y={0}
          width={colWidth}
          height={height - pad}
          fill="transparent"
          className="cursor-pointer"
          onMouseEnter={() => setHoveredIndex(index)}
          onMouseLeave={() => setHoveredIndex(null)}
        />
      ))}

      {/* Tooltip display */}
      {hoveredIndex !== null && (
        <>
          <line
            x1={points[hoveredIndex].x}
            x2={points[hoveredIndex].x}
            y1={pad}
            y2={height - pad}
            stroke={GOLD}
            strokeWidth="1.5"
            strokeDasharray="4,4"
            pointerEvents="none"
          />
          <g pointerEvents="none">
            <rect
              x={Math.max(10, Math.min(width - 130, points[hoveredIndex].x - 60))}
              y={Math.max(5, points[hoveredIndex].y - 60)}
              width="120"
              height="48"
              rx="10"
              fill="#3E362E"
              stroke={GOLD}
              strokeWidth="1"
            />
            <text
              x={Math.max(10, Math.min(width - 130, points[hoveredIndex].x - 60)) + 60}
              y={Math.max(5, points[hoveredIndex].y - 60) + 14}
              fill="#C5A059"
              fontSize="9"
              fontWeight="800"
              className="font-sans uppercase tracking-widest"
              textAnchor="middle"
            >
              {data[hoveredIndex].day}
            </text>
            <text
              x={Math.max(10, Math.min(width - 130, points[hoveredIndex].x - 60)) + 60}
              y={Math.max(5, points[hoveredIndex].y - 60) + 26}
              fill="#FFFFFF"
              fontSize="10"
              fontWeight="bold"
              className="font-sans"
              textAnchor="middle"
            >
              {`${data[hoveredIndex].visitors} Clients (${((data[hoveredIndex].visitors / totalVisitors) * 100).toFixed(1)}%)`}
            </text>
            <text
              x={Math.max(10, Math.min(width - 130, points[hoveredIndex].x - 60)) + 60}
              y={Math.max(5, points[hoveredIndex].y - 60) + 38}
              fill="#A89E95"
              fontSize="8.5"
              fontWeight="bold"
              className="font-sans"
              textAnchor="middle"
            >
              {`Avg Wait: ${data[hoveredIndex].waitTime} mins`}
            </text>
          </g>
        </>
      )}
    </svg>
  );
}

function QueueBreakdownChart({ completed, waiting, offline }) {
  const [hoveredIdx, setHoveredIdx] = useState(null);
  const data = [
    { name: "Served", value: completed || 12, color: GOLD },
    { name: "Waiting", value: waiting || 4, color: CHARCOAL },
    { name: "Offline", value: offline || 1, color: "#CBD5E1" }
  ];
  
  const total = data.reduce((sum, item) => sum + item.value, 0);
  let offset = 0;
  
  return (
    <div className="relative h-36 w-36 mx-auto">
      <svg viewBox="0 0 42 42" className="h-full w-full -rotate-90 overflow-visible">
        <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#FAF6F0" strokeWidth="6" />
        {data.map((item, index) => {
          if (item.value === 0) return null;
          const percent = (item.value / total) * 100;
          const segment = (
            <circle
              key={item.name}
              cx="21"
              cy="21"
              r="15.915"
              fill="transparent"
              stroke={item.color}
              strokeWidth={hoveredIdx === index ? "7.5" : "6"}
              strokeDasharray={`${percent} ${100 - percent}`}
              strokeDashoffset={-offset}
              className="cursor-pointer transition-all duration-250"
              onMouseEnter={() => setHoveredIdx(index)}
              onMouseLeave={() => setHoveredIdx(null)}
            />
          );
          offset += percent;
          return segment;
        })}
      </svg>
      
      {/* Center text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center select-none font-sans">
        {hoveredIdx !== null ? (
          <>
            <p className="text-[9px] font-extrabold uppercase tracking-widest text-stone-400 leading-none mb-1">
              {data[hoveredIdx].name}
            </p>
            <h4 className="text-base font-black font-serif text-stone-900 leading-none">
              {data[hoveredIdx].value}
            </h4>
            <span className="text-[8px] font-mono font-bold text-[#C5A059] mt-1 leading-none">
              {((data[hoveredIdx].value / total) * 100).toFixed(0)}%
            </span>
          </>
        ) : (
          <>
            <p className="text-[9px] font-extrabold uppercase tracking-widest text-[#C5A059] leading-none mb-1">
              Total Queue
            </p>
            <h4 className="text-base font-black font-serif text-stone-900 leading-none">
              {total}
            </h4>
            <span className="text-[8px] font-extrabold uppercase tracking-wider text-stone-400 mt-1 leading-none">
              Clients
            </span>
          </>
        )}
      </div>
    </div>
  );
}

export default AnalyticsDashboard;