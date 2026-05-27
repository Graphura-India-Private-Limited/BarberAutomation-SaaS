import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { 
  Users, 
  Clock, 
  Activity, 
  Star, 
  TrendingUp, 
  Scissors,
  UserX,
  Layers,
  Crown,
  Store,
  LayoutDashboard,
  BarChart2,
  CreditCard,
  DollarSign,
  LogOut
} from 'lucide-react';

const GOLD = "#C5A059";
const CHARCOAL = "#3E362E";

const AnalyticsDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [timeFilter, setTimeFilter] = useState('daily');
  const [reportType, setReportType] = useState('salon-wise');

  // --- Mock Data ---
  const performanceMetrics = [
    { title: 'Total Customers', value: '1,245', icon: Users, color: 'text-amber-600', bg: 'bg-amber-50 border border-amber-200/50' },
    { title: 'Active Queue', value: '12', icon: Activity, color: 'text-amber-600', bg: 'bg-amber-50 border border-amber-200/50' },
    { title: 'Avg Wait Time', value: '18 mins', icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50 border border-amber-200/50' },
    { title: 'Peak Hours', value: '4PM - 6PM', icon: TrendingUp, color: 'text-amber-600', bg: 'bg-amber-50 border border-amber-200/50' },
    { title: 'Average Rating', value: '4.8', icon: Star, color: 'text-amber-600', bg: 'bg-amber-50 border border-amber-200/50' },
    { title: 'Total Revenue', value: '₹48,500', icon: Layers, color: 'text-amber-600', bg: 'bg-amber-50 border border-amber-200/50' },
    { title: 'Drop-offs', value: '14', icon: UserX, color: 'text-red-600', bg: 'bg-red-50 border border-red-200/50' },
    { title: 'Staff Active', value: '6', icon: Scissors, color: 'text-amber-600', bg: 'bg-amber-50 border border-amber-200/50' },
  ];

  const barberAnalytics = [
    { id: 1, name: 'Rahul Sharma', served: 15, rating: 4.9, efficiency: 95, revenue: '₹4,500' },
    { id: 2, name: 'Amit Kumar', served: 12, rating: 4.7, efficiency: 88, revenue: '₹3,200' },
    { id: 3, name: 'Priya Singh', served: 18, rating: 5.0, efficiency: 98, revenue: '₹6,100' },
    { id: 4, name: 'Vikram Gupta', served: 10, rating: 4.6, efficiency: 82, revenue: '₹2,800' },
  ];

  const salonReports = [
    { id: 1, name: 'Elite Cuts - Downtown', customers: 145, revenue: 18500, delayAvg: '5 mins', bookings: 160 },
    { id: 2, name: 'Urban Barber - Westside', customers: 98, revenue: 12000, delayAvg: '12 mins', bookings: 105 },
    { id: 3, name: 'Classic Shave - North', customers: 112, revenue: 14200, delayAvg: '8 mins', bookings: 125 },
    { id: 4, name: 'Modern Fade - South', customers: 85, revenue: 10800, delayAvg: '15 mins', bookings: 90 },
    { id: 5, name: 'Premium Trims - Central', customers: 130, revenue: 16500, delayAvg: '4 mins', bookings: 140 },
  ];

  const topSalons = {
    leastDelay: [...salonReports].sort((a, b) => parseInt(a.delayAvg) - parseInt(b.delayAvg))[0],
    mostCustomers: [...salonReports].sort((a, b) => b.customers - a.customers)[0],
    highestRevenue: [...salonReports].sort((a, b) => b.revenue - a.revenue)[0],
  };

  const getFilteredData = () => {
    if (timeFilter === 'weekly') {
      return salonReports.map(s => ({ ...s, customers: s.customers * 6, revenue: s.revenue * 6, bookings: s.bookings * 6 }));
    } else if (timeFilter === 'monthly') {
      return salonReports.map(s => ({ ...s, customers: s.customers * 24, revenue: s.revenue * 24, bookings: s.bookings * 24 }));
    }
    return salonReports;
  };

  const displayData = getFilteredData();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/owner/login");
  };

  return (
    <div className="min-h-screen flex font-sans text-stone-800" style={{ background: "#FAF6F0" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap');
        body, .font-sans {
          font-family: 'Plus Jakarta Sans', sans-serif !important;
        }
        .font-serif {
          font-family: 'Playfair Display', serif !important;
        }
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

   {/* ── MATCHING SIDEBAR NAVIGATION ── */}
      <aside className="w-64 border-r fixed h-screen flex flex-col justify-between p-6 z-30 shrink-0 bg-white border-stone-200">
        <div className="space-y-8">
          {/* Logo Centerpiece */}
          <div className="flex items-center gap-3 border-b pb-5 border-stone-100">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-amber-50 border border-[#C5A059]/20">
              <Scissors size={18} color="#C5A059" strokeWidth={2} />
            </div>
            <div>
              <div className="text-sm font-black tracking-tight text-stone-900">
                Barber Pro
              </div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-stone-400 mt-0.5">Owner Panel</div>
            </div>
          </div>

          {/* Navigation Links Framework */}
          <nav className="space-y-1">
            <button 
              onClick={() => navigate("/owner/dashboard")}
              className={`w-full flex items-center gap-3.5 px-4 py-3 text-xs font-bold tracking-wide rounded-xl transition-all ${
                window.location.pathname === "/owner/dashboard"
                  ? "bg-amber-50/60 text-[#C5A059] border border-amber-200/40 font-extrabold"
                  : "text-stone-500 hover:text-stone-900 hover:bg-stone-50"
              }`}
            >
              <LayoutDashboard size={18} className={window.location.pathname === "/owner/dashboard" ? "text-[#C5A059]" : "text-stone-400"} />
              <span>Console Home</span>
            </button>

            <button 
              onClick={() => navigate("/owner/manage-services")} 
              className={`w-full flex items-center gap-3.5 px-4 py-3 text-xs font-bold tracking-wide rounded-xl transition-all ${
                window.location.pathname === "/owner/manage-services"
                  ? "bg-amber-50/60 text-[#C5A059] border border-amber-200/40 font-extrabold"
                  : "text-stone-500 hover:text-stone-900 hover:bg-stone-50"
              }`}
            >
              <Scissors size={18} className={window.location.pathname === "/owner/manage-services" ? "text-[#C5A059]" : "text-stone-400"} />
              <span>Barbers & Services</span>
            </button>

            <button 
              onClick={() => navigate("/owner/dashboard/analytics")} 
              className={`w-full flex items-center gap-3.5 px-4 py-3 text-xs font-bold tracking-wide rounded-xl transition-all ${
                window.location.pathname === "/owner/dashboard/analytics"
                  ? "bg-amber-50/60 text-[#C5A059] border border-amber-200/40 font-extrabold"
                  : "text-stone-500 hover:text-stone-900 hover:bg-stone-50"
              }`}
            >
              <BarChart2 size={18} className={window.location.pathname === "/owner/dashboard/analytics" ? "text-[#C5A059]" : "text-stone-400"} />
              <span>Analytics Metrics</span>
            </button>

            <button 
              onClick={() => navigate("/owner/payments")} 
              className={`w-full flex items-center gap-3.5 px-4 py-3 text-xs font-bold tracking-wide rounded-xl transition-all ${
                window.location.pathname === "/owner/payments"
                  ? "bg-amber-50/60 text-[#C5A059] border border-amber-200/40 font-extrabold"
                  : "text-stone-500 hover:text-stone-900 hover:bg-stone-50"
              }`}
            >
              <CreditCard size={18} className={window.location.pathname === "/owner/payments" ? "text-[#C5A059]" : "text-stone-400"} />
              <span>Payment Gateway</span>
            </button>

            <button 
              onClick={() => navigate("/owner/revenue")} 
              className={`w-full flex items-center gap-3.5 px-4 py-3 text-xs font-bold tracking-wide rounded-xl transition-all ${
                window.location.pathname === "/owner/revenue"
                  ? "bg-amber-50/60 text-[#C5A059] border border-amber-200/40 font-extrabold"
                  : "text-stone-500 hover:text-stone-900 hover:bg-stone-50"
              }`}
            >
              <DollarSign size={18} className={window.location.pathname === "/owner/revenue" ? "text-[#C5A059]" : "text-stone-400"} />
              <span>Revenue Stream</span>
            </button>
          </nav>
        </div>

        {/* System Exit Button */}
        <button 
          onClick={handleLogout} 
          className="w-full flex items-center gap-3.5 px-4 py-3 text-xs font-bold tracking-wide rounded-xl text-red-500 hover:bg-red-50 transition-all border border-transparent"
        >
          <LogOut size={18} className="text-red-400" />
          <span>Exit Workspace</span>
        </button>
      </aside>

      {/* ── MAIN SCREEN DATA WORKSPACE ── */}
      <main className="flex-1 ml-64 p-8 md:p-12 min-w-0">
        <div className="max-w-5xl mx-auto">
          
          {/* Top Integrated Headline Bar */}
          <div className="rounded-2xl p-6 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-5 card">
            <div className="flex items-center">
              <h1 className="text-3xl font-black font-serif tracking-tight text-stone-900">Owner Dashboard</h1>
              <span className="text-stone-400 text-xs font-black tracking-widest uppercase ml-4 border-l pl-4 border-stone-200">Analytics & Reports</span>
            </div>

            {/* Dashboard Category Tabs */}
            <div className="flex bg-stone-100 p-1 rounded-xl border border-stone-200/60 shadow-inner self-start md:self-auto">
              <button 
                onClick={() => setActiveTab('overview')}
                className={`px-5 py-2.5 rounded-lg text-[10px] font-black tracking-wider uppercase transition-all duration-200 ${activeTab === 'overview' ? 'text-white shadow-sm' : 'text-stone-500 hover:text-stone-800'}`}
                style={{ backgroundColor: activeTab === 'overview' ? CHARCOAL : 'transparent' }}
              >
                Salon Overview
              </button>
              <button 
                onClick={() => setActiveTab('reports')}
                className={`px-5 py-2.5 rounded-lg text-[10px] font-black tracking-wider uppercase transition-all duration-200 ${activeTab === 'reports' ? 'text-white shadow-sm' : 'text-stone-500 hover:text-stone-800'}`}
                style={{ backgroundColor: activeTab === 'reports' ? CHARCOAL : 'transparent' }}
              >
                System Reports
              </button>
            </div>
          </div>

          {activeTab === 'overview' ? (
            <>
              {/* Metrics Parameter Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {performanceMetrics.map((metric, index) => (
                  <div key={index} className="card p-5 flex items-center gap-4">
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${metric.bg}`}>
                      <metric.icon className={`w-5 h-5 ${metric.color}`} strokeWidth={2} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-wider text-stone-400 mb-0.5">{metric.title}</p>
                      <h3 className="text-xl font-black text-stone-900 font-serif leading-tight">{metric.value}</h3>
                    </div>
                  </div>
                ))}
              </div>

              {/* Graphical Charts Row */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                
                {/* Line Chart Component Wrapper */}
                <div className="card p-6 lg:col-span-2 flex flex-col justify-between">
                  <div className="mb-6">
                    <h3 className="text-md font-black font-serif text-stone-900 tracking-tight">Queue & Traffic Trend</h3>
                    <p className="text-[11px] text-stone-400 font-medium mt-1">Daily customer traffic and wait times</p>
                  </div>
                  
                  <div className="relative h-60 w-full px-2 mb-4">
                    <div className="absolute inset-0 flex flex-col justify-between">
                      {[0, 1, 2, 3, 4].map((i) => (
                        <div key={i} className="w-full h-px relative flex items-center border-dashed border-t border-stone-200/60">
                          <span className="absolute -left-7 text-[9px] font-bold font-mono text-stone-400">{(4-i) * 25}</span>
                        </div>
                      ))}
                    </div>
                    
                    <div className="absolute bottom-0 inset-x-0 translate-y-6 flex justify-between text-[10px] font-bold font-mono text-stone-400 px-1">
                      <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
                    </div>

                    <div className="absolute inset-0 pb-px pt-2">
                      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full overflow-visible">
                        <path 
                          d="M0,70 Q15,60 30,75 T60,50 T100,20 L100,100 L0,100 Z" 
                          fill="url(#orange-gradient)" 
                          className="opacity-15"
                        />
                        <path 
                          d="M0,70 Q15,60 30,75 T60,50 T100,20" 
                          fill="none" 
                          stroke={GOLD} 
                          strokeWidth="2.5"
                          vectorEffect="non-scaling-stroke"
                        />
                        <defs>
                          <linearGradient id="orange-gradient" x1="0" x2="0" y1="0" y2="1">
                            <stop offset="0%" stopColor={GOLD} stopOpacity="1" />
                            <stop offset="100%" stopColor={GOLD} stopOpacity="0" />
                          </linearGradient>
                        </defs>
                      </svg>
                    </div>
                  </div>

                  <div className="flex justify-center items-center gap-2 mt-4 pt-2 border-t border-stone-100">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: GOLD }}></div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-stone-400">Customer Traffic Analytics</span>
                  </div>
                </div>

                {/* Donut Chart Container */}
                <div className="card p-6 flex flex-col justify-between">
                  <div>
                    <h3 className="text-md font-black font-serif text-stone-900 tracking-tight">Queue Breakdown</h3>
                    <p className="text-[11px] text-stone-400 font-medium mt-1">Current status of daily visitors</p>
                  </div>
                  
                  <div className="flex flex-col items-center justify-center my-auto py-4">
                    <div className="w-36 h-36 rounded-full relative shadow-sm" style={{
                      background: `conic-gradient(${GOLD} 0% 45%, ${CHARCOAL} 45% 75%, #CBD5E1 75% 90%, #EF4444 90% 100%)`
                    }}>
                      <div className="absolute inset-0 m-auto w-20 h-20 rounded-full border border-stone-100/50" style={{ backgroundColor: "#FFFFFF" }}></div>
                    </div>
                  </div>

                  <div className="w-full flex flex-wrap justify-center gap-x-3 gap-y-1.5 text-[9px] font-black uppercase tracking-wider text-stone-500">
                    <div className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: GOLD }}></div> Served (45%)</div>
                    <div className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: CHARCOAL }}></div> Waiting (30%)</div>
                    <div className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-slate-300"></div> Delayed (15%)</div>
                    <div className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-red-500"></div> Drops (10%)</div>
                  </div>
                </div>
              </div>

              {/* Barber Analytics Table Block */}
              <div className="card p-6">
                <div className="mb-5">
                  <h3 className="text-md font-black font-serif text-stone-900 tracking-tight">Barber Performance Ledger</h3>
                  <p className="text-[11px] text-stone-400 font-medium mt-1">Customers served, efficiency metric logs & revenue shares per specialist</p>
                </div>

                <div className="overflow-x-auto custom-scrollbar">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-stone-100">
                        <th className="pb-3 text-[10px] font-black uppercase tracking-wider text-stone-400">Styling Specialist</th>
                        <th className="pb-3 text-[10px] font-black uppercase tracking-wider text-stone-400 text-center">Served Today</th>
                        <th className="pb-3 text-[10px] font-black uppercase tracking-wider text-stone-400 text-center">User Rating</th>
                        <th className="pb-3 text-[10px] font-black uppercase tracking-wider text-stone-400 text-right">Revenue</th>
                        <th className="pb-3 text-[10px] font-black uppercase tracking-wider text-stone-400 pl-8 w-1/3">Efficiency Rate</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-50">
                      {barberAnalytics.map((barber) => (
                        <tr key={barber.id} className="hover:bg-stone-50/40 transition-colors group">
                          <td className="py-3.5">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-xl bg-stone-100 border border-stone-200 text-stone-700 flex items-center justify-center font-black text-xs font-serif shadow-sm">
                                {barber.name.charAt(0)}
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
            /* SYSTEM REPORTS PANEL BLOCK */
            <div className="space-y-6">
              
              {/* Dynamic Filtering Sub-Bar */}
              <div className="card p-4 flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm">
                
                {/* Time Filter Action Hub */}
                <div className="flex bg-stone-100 p-1 rounded-xl border border-stone-200/60 w-full md:w-auto shadow-inner">
                  {['daily', 'weekly', 'monthly'].map(t => (
                    <button
                      key={t}
                      onClick={() => setTimeFilter(t)}
                      className="flex-1 md:flex-none px-5 py-2 rounded-lg text-[10px] font-black tracking-wider uppercase transition-all duration-200 shadow-sm border border-transparent focus:outline-none"
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

                {/* Report Variable Filter Hub */}
                <div className="flex bg-stone-100 p-1 rounded-xl border border-stone-200/60 w-full md:w-auto shadow-inner">
                  {['salon-wise', 'revenue-wise', 'booking-wise'].map(type => (
                    <button
                      key={type}
                      onClick={() => setReportType(type)}
                      className="flex-1 md:flex-none px-4 py-2 rounded-lg text-[10px] font-black tracking-wider uppercase transition-all duration-200 focus:outline-none"
                      style={{ 
                        backgroundColor: reportType === type ? CHARCOAL : 'transparent',
                        color: reportType === type ? '#FFFBF2' : '#78716C'
                      }}
                    >
                      {type.replace('-', ' ')}
                    </button>
                  ))}
                </div>
              </div>

              {/* Top Highlights Context Summary Headers */}
              <div>
                <h3 className="text-md font-black font-serif tracking-tight text-stone-900 flex items-center gap-2">
                  <Crown className="w-4 h-4" style={{ color: GOLD }} /> Top Performing Outlets
                </h3>
                <p className="text-[11px] text-stone-400 font-medium mt-1">Highlighted franchise locations based on key operational metrics.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Delay Element */}
                <div className="bg-gradient-to-br from-green-50/50 to-white rounded-2xl p-5 border border-green-200/50 relative overflow-hidden card">
                  <div className="absolute top-0 right-0 p-4 opacity-5"><Clock className="w-12 h-12 text-green-700" /></div>
                  <p className="text-[9px] font-black uppercase tracking-wider text-green-700 mb-2">Minimum Waiting Lag</p>
                  <h4 className="text-md font-black font-serif text-stone-900 mb-2 truncate">{topSalons.leastDelay.name}</h4>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-2xl font-mono font-black text-green-700 leading-none">{topSalons.leastDelay.delayAvg}</span>
                    <span className="text-[9px] font-bold uppercase text-stone-400">delay index</span>
                  </div>
                </div>

                {/* Customer Volume Element */}
                <div className="bg-gradient-to-br from-blue-50/50 to-white rounded-2xl p-5 border border-blue-200/50 relative overflow-hidden card">
                  <div className="absolute top-0 right-0 p-4 opacity-5"><Users className="w-12 h-12 text-blue-700" /></div>
                  <p className="text-[9px] font-black uppercase tracking-wider text-blue-700 mb-2">Highest Traffic Volume</p>
                  <h4 className="text-md font-black font-serif text-stone-900 mb-2 truncate">{topSalons.mostCustomers.name}</h4>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-2xl font-mono font-black text-blue-700 leading-none">{topSalons.mostCustomers.customers}</span>
                    <span className="text-[9px] font-bold uppercase text-stone-400">visitors today</span>
                  </div>
                </div>

                {/* Gross Revenue Element */}
                <div className="bg-gradient-to-br from-amber-50/40 to-white rounded-2xl p-5 border border-amber-200/50 relative overflow-hidden card">
                  <div className="absolute top-0 right-0 p-4 opacity-5"><TrendingUp className="w-12 h-12 text-amber-600" /></div>
                  <p className="text-[9px] font-black uppercase tracking-wider text-amber-700 mb-2">Peak Revenue Released</p>
                  <h4 className="text-md font-black font-serif text-stone-900 mb-2 truncate">{topSalons.highestRevenue.name}</h4>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-2xl font-mono font-black text-amber-700 leading-none">₹{topSalons.highestRevenue.revenue.toLocaleString()}</span>
                    <span className="text-[9px] font-bold uppercase text-stone-400">gross income</span>
                  </div>
                </div>
              </div>

              {/* Detailed Breakdown Ledger Spreadsheet */}
              <div className="card overflow-hidden">
                <div className="p-6 border-b border-stone-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white">
                  <div>
                    <h3 className="text-sm font-black font-serif tracking-tight text-stone-900 flex items-center gap-2">
                      <Store className="w-4 h-4" style={{ color: GOLD }} />
                      {reportType.replace('-', ' ').toUpperCase()} BREAKDOWN REPORT
                    </h3>
                    <p className="text-[11px] text-stone-400 font-medium mt-1">Detailed structural audit across active branch collections ({timeFilter})</p>
                  </div>
                  <button className="rounded-xl border h-10 px-4 text-[10px] font-black tracking-widest uppercase transition-all duration-300 flex items-center justify-center gap-2 hover:text-white"
                    style={{ backgroundColor: `${GOLD}10`, color: GOLD, borderColor: `${GOLD}40` }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = GOLD}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = `${GOLD}10`}
                  >
                    Export CSV Matrix
                  </button>
                </div>
                
                <div className="overflow-x-auto custom-scrollbar">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-stone-50/50 border-b border-stone-100">
                        <th className="py-3.5 px-6 text-[10px] font-black uppercase tracking-wider text-stone-400">Active Salon Node</th>
                        <th className="py-3.5 px-6 text-[10px] font-black uppercase tracking-wider text-stone-400 text-center">Bookings</th>
                        <th className="py-3.5 px-6 text-[10px] font-black uppercase tracking-wider text-stone-400 text-center">Customers Served</th>
                        <th className="py-3.5 px-6 text-[10px] font-black uppercase tracking-wider text-stone-400 text-center">Avg Operational Delay</th>
                        <th className="py-3.5 px-6 text-[10px] font-black uppercase tracking-wider text-stone-400 text-right">Revenue Yield</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-50">
                      {displayData.map((salon) => (
                        <tr key={salon.id} className="hover:bg-stone-50/30 transition-colors">
                          <td className="py-4 px-6 font-bold text-stone-900 text-sm font-serif tracking-tight">{salon.name}</td>
                          <td className="py-4 px-6 text-center font-mono font-bold text-stone-800 text-sm">{salon.bookings}</td>
                          <td className="py-4 px-6 text-center font-mono font-bold text-stone-800 text-sm">{salon.customers}</td>
                          <td className="py-4 px-6 text-center">
                            <span className={`px-2.5 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider border ${parseInt(salon.delayAvg) > 10 ? 'bg-red-50 text-red-700 border-red-200' : 'bg-green-50 text-green-700 border-green-200'}`}>
                              {salon.delayAvg}
                            </span>
                          </td>
                          <td className="py-4 px-6 text-right font-mono font-bold text-stone-900 text-sm">₹{salon.revenue.toLocaleString()}</td>
                        </tr>
                      ))}
                      
                      {/* Summation Row */}
                      <tr className="bg-stone-100/50 font-bold border-t-2 border-stone-200 text-stone-900 text-sm">
                        <td className="py-4 px-6 font-black uppercase tracking-wide text-xs">Total Cumulative Pipeline</td>
                        <td className="py-4 px-6 text-center font-mono font-black">{displayData.reduce((acc, curr) => acc + curr.bookings, 0)}</td>
                        <td className="py-4 px-6 text-center font-mono font-black">{displayData.reduce((acc, curr) => acc + curr.customers, 0)}</td>
                        <td className="py-4 px-6 text-center text-stone-400 font-mono font-medium">—</td>
                        <td className="py-4 px-6 text-right font-mono font-black text-amber-700">
                          ₹{displayData.reduce((acc, curr) => acc + curr.revenue, 0).toLocaleString()}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AnalyticsDashboard;