import React, { useState } from 'react';
import { 
  Users, 
  Clock, 
  Activity, 
  Star, 
  TrendingUp, 
  Scissors,
  Timer, 
  UserX,
  Calendar,
  Layers,
  Filter,
  BarChart3,
  Store,
  Crown
} from 'lucide-react';

const AnalyticsDashboard = () => {
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

  return (
    <div className="min-h-screen p-6 font-sans text-zinc-800" style={{ background: "var(--bg)" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap');
        :root { 
          --gold: #D97706; 
          --gold2: #B45309; 
          --bg: #FAF6F0; 
          --bg2: #FFFFFF; 
          --bg3: #FDFBF7; 
          --border: #EADBCE; 
          --text: #1C1917; 
          --muted: #78716C; 
        }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body, .font-sans {
          font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important;
        }
        .font-serif {
          font-family: 'Playfair Display', Georgia, Cambria, "Times New Roman", Times, serif !important;
        }
        .card { 
          background: var(--bg2); 
          border: 1px solid var(--border); 
          border-radius: 24px; 
          box-shadow: 0 4px 20px -2px rgba(28, 25, 23, 0.04), 0 2px 8px -1px rgba(28, 25, 23, 0.02);
          transition: all 0.2s ease;
        }
        .card:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px -4px rgba(28, 25, 23, 0.06), 0 4px 12px -2px rgba(28, 25, 23, 0.03);
          border-color: #D6C4AE;
        }
      `}</style>
      
      {/* Top Banner */}
      <div className="rounded-2xl p-6 mb-6 relative overflow-hidden card" style={{ background: "rgba(250,246,240,0.95)" }}>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold mr-3 font-serif tracking-normal text-zinc-900">Owner Dashboard</h1>
            <span className="text-zinc-600 font-medium font-sans normal-case">Analytics & Reports</span>
          </div>

          {/* Tabs Navigation */}
          <div className="flex bg-zinc-200/50 p-1 rounded-xl border border-zinc-200/50 backdrop-blur-sm">
            <button 
              onClick={() => setActiveTab('overview')}
              className={`px-6 py-2 rounded-lg text-sm font-bold transition-all duration-200 ${activeTab === 'overview' ? 'bg-amber-600 text-white shadow-md' : 'text-zinc-600 hover:text-zinc-800'}`}
            >
              Salon Overview
            </button>
            <button 
              onClick={() => setActiveTab('reports')}
              className={`px-6 py-2 rounded-lg text-sm font-bold transition-all duration-200 ${activeTab === 'reports' ? 'bg-amber-600 text-white shadow-md' : 'text-zinc-600 hover:text-zinc-800'}`}
            >
              System Reports
            </button>
          </div>
        </div>
        {/* Decorative background element */}
        <div className="absolute right-6 top-1/2 -translate-y-1/2 opacity-20 transform rotate-12">
          <div className="w-16 h-16 border-2 border-amber-600/30 rounded-xl"></div>
        </div>
      </div>

      {activeTab === 'overview' ? (
        <>
          {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {performanceMetrics.map((metric, index) => (
          <div key={index} className="card p-5 flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${metric.bg}`}>
              <metric.icon className={`w-6 h-6 ${metric.color}`} strokeWidth={2} />
            </div>
            <div>
              <p className="text-[11px] font-bold text-zinc-500 font-sans normal-case mb-1">{metric.title}</p>
              <h3 className="text-2xl font-bold text-zinc-950 leading-none font-serif tracking-normal">{metric.value}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        
        {/* Line Chart Container (Performance Trend) */}
        <div className="card p-6 lg:col-span-2">
          <div className="mb-6">
            <h3 className="text-base font-bold text-zinc-900 font-serif tracking-normal">Queue & Traffic Trend</h3>
            <p className="text-xs text-zinc-500 font-sans normal-case mt-1">Daily customer traffic and wait times</p>
          </div>
          
          {/* Mock Line Chart with Grid */}
          <div className="relative h-64 w-full">
            {/* Grid Lines */}
            <div className="absolute inset-0 flex flex-col justify-between">
              {[0, 1, 2, 3, 4].map((i) => (
                <div key={i} className="w-full h-px bg-gray-100 flex items-center border-dashed border-t border-gray-200">
                  <span className="absolute -left-6 text-[10px] text-gray-400">{(4-i) * 25}</span>
                </div>
              ))}
            </div>
            
            {/* X-Axis labels */}
            <div className="absolute bottom-0 inset-x-0 translate-y-6 flex justify-between text-[10px] text-gray-400 pl-2">
              <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
            </div>

            {/* SVG Line (Mocked curve) */}
            <div className="absolute inset-0 pl-2 pb-px pt-2">
              <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full overflow-visible">
                {/* Area under line */}
                <path 
                  d="M0,70 Q15,60 30,75 T60,50 T100,20 L100,100 L0,100 Z" 
                  fill="url(#orange-gradient)" 
                  className="opacity-20"
                />
                {/* Line */}
                <path 
                  d="M0,70 Q15,60 30,75 T60,50 T100,20" 
                  fill="none" 
                  stroke="#D97706" 
                  strokeWidth="2"
                  vectorEffect="non-scaling-stroke"
                />
                <defs>
                  <linearGradient id="orange-gradient" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#D97706" stopOpacity="1" />
                    <stop offset="100%" stopColor="#D97706" stopOpacity="0" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
            
            {/* Legend */}
            <div className="absolute -bottom-10 inset-x-0 flex justify-center items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-amber-600"></div>
              <span className="text-xs text-gray-500 font-medium">Customer Traffic</span>
            </div>
          </div>
        </div>

        {/* Pie Chart Container (Customer Types) */}
        <div className="card p-6">
          <div className="mb-6">
            <h3 className="text-base font-bold text-zinc-900 font-serif tracking-normal">Queue Breakdown</h3>
            <p className="text-xs text-zinc-500 font-sans normal-case mt-1">Current status of daily visitors</p>
          </div>
          
          <div className="flex flex-col items-center justify-center h-56">
            {/* CSS Conic Gradient Pie Chart */}
            <div className="w-40 h-40 rounded-full mb-6 relative" style={{
              background: 'conic-gradient(#D97706 0% 45%, #1C1917 45% 75%, #cbd5e1 75% 90%, #ef4444 90% 100%)'
            }}>
              {/* Inner circle for Donut look */}
              <div className="absolute inset-0 m-auto w-20 h-20 bg-white rounded-full border border-zinc-100"></div>
            </div>

            {/* Custom Legend */}
            <div className="w-full flex flex-wrap justify-center gap-x-4 gap-y-2 text-[10px] font-medium text-gray-600">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-amber-600"></div>
                Served (45%)
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-zinc-800"></div>
                Waiting (30%)
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-slate-300"></div>
                Delayed (15%)
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-red-500"></div>
                Drop-offs (10%)
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Barber Analytics Table */}
      <div className="card p-6">
        <div className="mb-6">
          <h3 className="text-base font-bold text-zinc-900 font-serif tracking-normal">Barber Performance</h3>
          <p className="text-xs text-zinc-500 font-sans normal-case mt-1">Customers served, efficiency & revenue per barber</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="pb-3 text-xs font-bold text-zinc-500 font-sans normal-case">Barber</th>
                <th className="pb-3 text-xs font-bold text-zinc-500 font-sans normal-case text-center">Served Today</th>
                <th className="pb-3 text-xs font-bold text-zinc-500 font-sans normal-case text-center">Rating</th>
                <th className="pb-3 text-xs font-bold text-zinc-500 font-sans normal-case text-right">Revenue</th>
                <th className="pb-3 text-xs font-bold text-zinc-500 font-sans normal-case pl-8 w-1/3">Efficiency</th>
              </tr>
            </thead>
            <tbody>
              {barberAnalytics.map((barber) => (
                <tr key={barber.id} className="border-b border-gray-55 last:border-0 hover:bg-gray-50/50 transition-colors">
                  <td className="py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-amber-50 text-amber-700 border border-amber-200 flex items-center justify-center font-bold text-sm font-serif tracking-normal">
                        {barber.name.charAt(0)}
                      </div>
                      <span className="font-semibold font-serif tracking-normal text-zinc-900 text-sm">{barber.name}</span>
                    </div>
                  </td>
                  <td className="py-4 text-center font-bold text-zinc-800 font-sans normal-case text-sm">
                    {barber.served}
                  </td>
                  <td className="py-4 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                      <span className="font-semibold text-zinc-800 text-sm font-sans normal-case">{barber.rating}</span>
                    </div>
                  </td>
                  <td className="py-4 text-right font-bold text-zinc-800 font-sans normal-case text-sm">
                    {barber.revenue}
                  </td>
                  <td className="py-4 pl-8">
                    <div className="flex items-center gap-3">
                      <div className="w-full bg-gray-100 rounded-full h-2">
                        <div 
                          className="h-2 rounded-full bg-amber-600" 
                          style={{ width: `${barber.efficiency}%` }}
                        ></div>
                      </div>
                      <span className="text-xs font-bold text-gray-600 w-8 text-right font-sans normal-case">
                        {barber.efficiency}%
                      </span>
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
        /* REPORTS TAB CONTENT */
        <div className="space-y-6">
          
          {/* Controls Bar */}
          <div className="card p-4 flex flex-col md:flex-row items-center justify-between gap-4">
            
            {/* Time Filter */}
            <div className="flex bg-zinc-200/50 p-1 rounded-xl border border-zinc-200/50 w-full md:w-auto">
              {['daily', 'weekly', 'monthly'].map(t => (
                <button
                  key={t}
                  onClick={() => setTimeFilter(t)}
                  className={`flex-1 md:flex-none px-6 py-2 rounded-lg text-sm font-bold font-sans normal-case transition-all duration-200 ${timeFilter === t ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-600 hover:text-zinc-800'}`}
                >
                  {t}
                </button>
              ))}
            </div>

            {/* Report Type Filter */}
            <div className="flex bg-zinc-200/50 p-1 rounded-xl border border-zinc-200/50 w-full md:w-auto">
              {['salon-wise', 'revenue-wise', 'booking-wise'].map(type => (
                <button
                  key={type}
                  onClick={() => setReportType(type)}
                  className={`flex-1 md:flex-none px-4 py-2 rounded-lg text-sm font-bold font-sans normal-case transition-all duration-200 ${reportType === type ? 'bg-zinc-900 text-white shadow-sm' : 'text-zinc-600 hover:text-zinc-800'}`}
                >
                  {type.replace('-', ' ')}
                </button>
              ))}
            </div>
            
          </div>

          {/* Top Performing Salons */}
          <div className="mb-2">
            <h3 className="text-lg font-bold font-serif tracking-normal text-zinc-900 flex items-center gap-2">
              <Crown className="w-5 h-5 text-amber-600" />
              Top Performing Salons
            </h3>
            <p className="text-xs text-zinc-500 font-sans normal-case mt-1">Highlighted locations based on key operational metrics.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Delay Timings */}
            <div className="bg-gradient-to-br from-green-50 to-white rounded-2xl p-6 border border-green-200/60 shadow-sm relative overflow-hidden card">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <Clock className="w-16 h-16 text-green-600" />
              </div>
              <p className="text-[11px] font-bold text-green-700 font-sans normal-case mb-2">Least Delay Timings</p>
              <h4 className="text-xl font-bold font-serif tracking-normal text-zinc-900 mb-1">{topSalons.leastDelay.name}</h4>
              <div className="flex items-end gap-2">
                <span className="text-3xl font-black text-green-700 leading-none">{topSalons.leastDelay.delayAvg}</span>
                <span className="text-sm font-semibold text-gray-500 mb-1">avg delay</span>
              </div>
            </div>

            {/* Number of Customers */}
            <div className="bg-gradient-to-br from-blue-50 to-white rounded-2xl p-6 border border-blue-200/60 shadow-sm relative overflow-hidden card">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <Users className="w-16 h-16 text-blue-600" />
              </div>
              <p className="text-[11px] font-bold text-blue-700 font-sans normal-case mb-2">Highest Customer Volume</p>
              <h4 className="text-xl font-bold font-serif tracking-normal text-zinc-900 mb-1">{topSalons.mostCustomers.name}</h4>
              <div className="flex items-end gap-2">
                <span className="text-3xl font-black text-blue-700 leading-none">{topSalons.mostCustomers.customers}</span>
                <span className="text-sm font-semibold text-gray-500 mb-1">customers today</span>
              </div>
            </div>

            {/* Revenue */}
            <div className="bg-gradient-to-br from-amber-50 to-white rounded-2xl p-6 border border-amber-200/60 shadow-sm relative overflow-hidden card">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <TrendingUp className="w-16 h-16 text-brand-orange" />
              </div>
              <p className="text-[11px] font-bold text-amber-700 font-sans normal-case mb-2">Highest Revenue</p>
              <h4 className="text-xl font-bold font-serif tracking-normal text-zinc-900 mb-1">{topSalons.highestRevenue.name}</h4>
              <div className="flex items-end gap-2">
                <span className="text-3xl font-black text-orange-600 leading-none">₹{topSalons.highestRevenue.revenue.toLocaleString()}</span>
                <span className="text-sm font-semibold text-gray-500 mb-1">earned</span>
              </div>
            </div>
          </div>

          {/* Detailed Report Table */}
          <div className="card overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold font-serif tracking-normal text-zinc-900 flex items-center gap-2">
                  <Store className="w-5 h-5 text-amber-600" />
                  {reportType.replace('-', ' ').toUpperCase()} REPORT
                </h3>
                <p className="text-xs text-zinc-500 font-sans normal-case mt-1">Detailed breakdown across all salon locations ({timeFilter})</p>
              </div>
              <button className="px-4 py-2 bg-amber-50 border border-amber-200 text-amber-700 rounded-xl text-xs font-bold font-sans normal-case hover:bg-amber-100 transition-all">
                Export CSV
              </button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50/50">
                    <th className="py-4 px-6 text-xs font-bold text-zinc-500 font-sans normal-case border-b border-zinc-100">Salon Name</th>
                    <th className="py-4 px-6 text-xs font-bold text-zinc-500 font-sans normal-case text-center border-b border-zinc-100">Bookings</th>
                    <th className="py-4 px-6 text-xs font-bold text-zinc-500 font-sans normal-case text-center border-b border-zinc-100">Customers Served</th>
                    <th className="py-4 px-6 text-xs font-bold text-zinc-500 font-sans normal-case text-center border-b border-zinc-100">Avg Delay</th>
                    <th className="py-4 px-6 text-xs font-bold text-zinc-500 font-sans normal-case text-right border-b border-zinc-100">Revenue</th>
                  </tr>
                </thead>
                <tbody>
                  {displayData.map((salon) => (
                    <tr key={salon.id} className="border-b border-gray-50 last:border-0 hover:bg-orange-50/30 transition-colors">
                      <td className="py-4 px-6">
                        <div className="font-bold font-serif tracking-normal text-zinc-900 text-sm">{salon.name}</div>
                      </td>
                      <td className="py-4 px-6 text-center font-bold text-zinc-800 font-sans normal-case text-sm">
                        {salon.bookings}
                      </td>
                      <td className="py-4 px-6 text-center font-bold text-zinc-800 font-sans normal-case text-sm">
                        {salon.customers}
                      </td>
                      <td className="py-4 px-6 text-center">
                        <span className={`px-2 py-1 rounded-full text-[10px] font-bold font-sans normal-case border ${parseInt(salon.delayAvg) > 10 ? 'bg-red-50 text-red-700 border-red-200' : 'bg-green-50 text-green-700 border-green-200'}`}>
                          {salon.delayAvg}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right font-bold text-gray-900 text-sm">
                        ₹{salon.revenue.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                  {/* Total Row */}
                  <tr className="bg-zinc-50 font-bold border-t-2 border-zinc-200 font-sans normal-case text-zinc-900">
                    <td className="py-4 px-6 text-gray-900">Total System Wide</td>
                    <td className="py-4 px-6 text-center text-gray-900">{displayData.reduce((acc, curr) => acc + curr.bookings, 0)}</td>
                    <td className="py-4 px-6 text-center text-gray-900">{displayData.reduce((acc, curr) => acc + curr.customers, 0)}</td>
                    <td className="py-4 px-6 text-center text-gray-500">-</td>
                    <td className="py-4 px-6 text-right text-amber-700">
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
  );
};

export default AnalyticsDashboard;
