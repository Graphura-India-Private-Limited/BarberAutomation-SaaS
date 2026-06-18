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

  const [hoveredTrafficIdx, setHoveredTrafficIdx] = useState(null);
  const [hoveredQueueIdx, setHoveredQueueIdx] = useState(null);

  const trafficData = [
    { day: "Mon", val: 25 },
    { day: "Tue", val: 40 },
    { day: "Wed", val: 30 },
    { day: "Thu", val: 55 },
    { day: "Fri", val: 50 },
    { day: "Sat", val: 75 },
    { day: "Sun", val: 90 },
  ];

  const queueData = [
    { name: "Served", value: 45, color: GOLD },
    { name: "Waiting", value: 30, color: CHARCOAL },
    { name: "Delayed", value: 15, color: "#CBD5E1" },
    { name: "Drops", value: 10, color: "#EF4444" },
  ];

  const trafficWidth = 720;
  const trafficHeight = 220;
  const trafficPad = 20;
  const maxTraffic = 100;
  
  const trafficPoints = trafficData.map((item, index) => {
    const x = trafficPad + (index * (trafficWidth - trafficPad * 2)) / (trafficData.length - 1);
    const y = trafficHeight - trafficPad - (item.val / maxTraffic) * (trafficHeight - trafficPad * 2);
    return { x, y, day: item.day, val: item.val };
  });
  
  const trafficPointsStr = trafficPoints.map(p => `${p.x},${p.y}`).join(" ");
  const trafficRectWidth = (trafficWidth - trafficPad * 2) / (trafficData.length - 1);
  const areaPointsStr = `${trafficPad},${trafficHeight - trafficPad} ${trafficPointsStr} ${trafficWidth - trafficPad},${trafficHeight - trafficPad}`;

  // --- Mock Data ---
  const performanceMetrics = [
    { title: 'Total Customers', value: '1,245', icon: Users, color: 'text-amber-600', bg: 'bg-amber-50 border border-amber-200/50' },
    { title: 'Active Queue', value: '12', icon: Activity, color: 'text-amber-600', bg: 'bg-amber-50 border border-amber-200/50' },
    { title: 'Avg Wait Time (per day)', value: '18 mins', icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50 border border-amber-200/50' },
    { title: 'Peak Hours', value: '4PM - 6PM', icon: TrendingUp, color: 'text-amber-600', bg: 'bg-amber-50 border border-amber-200/50' },
    { title: 'Average Rating', value: '4.8', icon: Star, color: 'text-amber-600', bg: 'bg-amber-50 border border-amber-200/50' },
    { title: 'Total Revenue (per day)', value: '₹48,500', icon: Layers, color: 'text-amber-600', bg: 'bg-amber-50 border border-amber-200/50' },
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
    <div className="p-6 md:p-10 font-sans text-stone-800 selection:bg-amber-100 min-h-screen" style={{ background: "#FAF6F0" }}>
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

      {/* ── MAIN SCREEN DATA WORKSPACE ── */}
      <div className="max-w-5xl mx-auto">
          
          {/* Top Header Card Container Block */}
          <div className="rounded-2xl p-6 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-5 card">
            <div className="text-left">
              {/* Rule 1 Master Title Layout Setup */}
              <h2 className="font-serif text-3xl sm:text-4xl tracking-normal text-stone-900 flex items-center justify-start gap-2 whitespace-nowrap">
                <span className="font-bold uppercase">Owner</span>
                <span className="italic text-[#C5A059] normal-case font-medium">Dashboard</span>
              </h2>
              {/* Rule 3 Muted Body text explanation standard */}
              <p className="text-stone-600 text-sm font-normal leading-relaxed font-sans mt-1">Analytics overview & system reports portal management control.</p>
            </div>

            {/* Selector Categories Navigation Controls */}
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
                System Reports
              </button>
            </div>
          </div>

          {activeTab === 'overview' ? (
            <>
              {/* Performance Counter Framework Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 text-left">
                {performanceMetrics.map((metric, index) => (
                  <div key={index} className="card p-5 flex items-center gap-4 bg-white">
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${metric.bg}`}>
                      <metric.icon className={`w-5 h-5 ${metric.color}`} strokeWidth={2} />
                    </div>
                    <div>
                      {/* Rule 2 Minor Kicker Label inside counter nodes */}
                      <p className="text-[11px] font-extrabold uppercase tracking-widest text-[#C5A059] mb-0.5 font-sans">{metric.title}</p>
                      <h3 className="text-xl font-black text-stone-900 font-serif leading-tight">{metric.value}</h3>
                    </div>
                  </div>
                ))}
              </div>

              {/* Graphic Performance Layout Charts Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8 text-left">
                
                {/* Traffic Trend Stream Graph Card Line */}
                <div className="card p-6 lg:col-span-2 flex flex-col justify-between bg-white">
                  <div className="mb-6">
                    {/* Rule 1 Mid-Level Workspace Section Header */}
                    <h2 className="font-serif text-xl sm:text-2xl tracking-normal text-stone-900 flex items-center justify-start gap-2 whitespace-nowrap">
                      <span className="font-bold uppercase">Queue & Traffic</span>
                      <span className="italic text-[#C5A059] normal-case font-medium">Trend</span>
                    </h2>
                    {/* Rule 3 Core Paragraph Details */}
                    <p className="text-stone-600 text-sm font-normal leading-relaxed font-sans mt-0.5">Daily customer traffic index logs and active wait times breakdown.</p>
                  </div>
                  
                  <div className="relative h-60 w-full pl-8 pr-2 mb-6 font-sans">
                    <div className="absolute inset-0 pl-8 pr-2 flex flex-col justify-between pointer-events-none">
                      {[0, 1, 2, 3, 4].map((i) => (
                        <div key={i} className="w-full h-px relative flex items-center border-dashed border-t border-stone-200/60">
                          <span className="absolute -left-8 text-[9px] font-bold font-mono text-stone-400">{(4-i) * 25}</span>
                        </div>
                      ))}
                    </div>
                    
                    <div className="absolute bottom-0 left-8 right-2 translate-y-5 flex justify-between text-[10px] font-bold font-mono text-stone-400 pointer-events-none">
                      <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
                    </div>

                    <div className="absolute inset-0 left-8 pr-2 pb-px pt-2">
                      <svg viewBox={`0 0 ${trafficWidth} ${trafficHeight}`} className="w-full h-full overflow-visible">
                        <defs>
                          <linearGradient id="orange-gradient" x1="0" x2="0" y1="0" y2="1">
                            <stop offset="0%" stopColor={GOLD} stopOpacity="0.4" />
                            <stop offset="100%" stopColor={GOLD} stopOpacity="0" />
                          </linearGradient>
                        </defs>
                        
                        <polygon points={areaPointsStr} fill="url(#orange-gradient)" />
                        <polyline points={trafficPointsStr} fill="none" stroke={GOLD} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                        
                        {hoveredTrafficIdx !== null && (
                          <>
                            <line 
                              x1={trafficPoints[hoveredTrafficIdx].x} 
                              y1={trafficPad} 
                              x2={trafficPoints[hoveredTrafficIdx].x} 
                              y2={trafficHeight - trafficPad} 
                              stroke="#8B5A2B" 
                              strokeWidth="1.5" 
                              strokeDasharray="3,3" 
                              opacity="0.8" 
                            />
                            <circle 
                              cx={trafficPoints[hoveredTrafficIdx].x} 
                              cy={trafficPoints[hoveredTrafficIdx].y} 
                              r="8" 
                              fill={GOLD} 
                              opacity="0.3" 
                            />
                          </>
                        )}
                        
                        {trafficPoints.map((p, index) => (
                          <circle 
                            key={p.day} 
                            cx={p.x} 
                            cy={p.y} 
                            r={hoveredTrafficIdx === index ? "6" : "4"} 
                            fill={hoveredTrafficIdx === index ? "#8B5A2B" : GOLD} 
                            stroke="#ffffff" 
                            strokeWidth="2" 
                            style={{ transition: "all 0.15s ease" }}
                          />
                        ))}
                        
                        {trafficPoints.map((p, index) => {
                          const rectX = index === 0 ? p.x : p.x - trafficRectWidth / 2;
                          const currentWidth = (index === 0 || index === trafficData.length - 1) ? trafficRectWidth / 2 : trafficRectWidth;
                          return (
                            <rect
                              key={index}
                              x={rectX}
                              y={trafficPad}
                              width={currentWidth}
                              height={trafficHeight - trafficPad * 2}
                              fill="transparent"
                              style={{ cursor: "pointer" }}
                              onMouseEnter={() => setHoveredTrafficIdx(index)}
                              onMouseLeave={() => setHoveredTrafficIdx(null)}
                            />
                          );
                        })}
                      </svg>
                      
                      {hoveredTrafficIdx !== null && (
                        <div 
                          className="absolute bg-zinc-900/95 text-[#FAF6F0] px-3 py-2 rounded-xl text-[10px] font-bold shadow-xl border border-[#C5A059]/40 pointer-events-none transition-all duration-150 animate-in fade-in zoom-in-95 z-20"
                          style={{
                            left: `${(trafficPoints[hoveredTrafficIdx].x / trafficWidth) * 100}%`,
                            top: `${(trafficPoints[hoveredTrafficIdx].y / trafficHeight) * 100}%`,
                            transform: 'translate(-50%, -125%)',
                          }}
                        >
                          <p className="text-[#C5A059] uppercase tracking-wider mb-0.5">{trafficPoints[hoveredTrafficIdx].day}</p>
                          <p className="text-white font-mono font-extrabold text-xs">Traffic: {trafficPoints[hoveredTrafficIdx].val}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-center items-center gap-2 mt-4 pt-2 border-t border-stone-100">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: GOLD }}></div>
                    <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#C5A059] font-sans">Customer Traffic Analytics Ledger</span>
                  </div>
                </div>

                {/* Donut Segmentation Chart Card Node */}
                <div className="card p-6 flex flex-col justify-between bg-white">
                  <div>
                    {/* Rule 1 Segment Card Title */}
                    <h2 className="font-serif text-xl sm:text-2xl tracking-normal text-stone-900 flex items-center justify-start gap-2 whitespace-nowrap">
                      <span className="font-bold uppercase">Queue</span>
                      <span className="italic text-[#C5A059] normal-case font-medium">Breakdown</span>
                    </h2>
                    {/* Rule 3 Metric summary description label */}
                    <p className="text-stone-600 text-sm font-normal leading-relaxed font-sans mt-0.5">Current execution allocation status of daily visitors pool.</p>
                  </div>
                  
                  <div className="flex flex-col items-center justify-center my-auto py-4 font-sans">
                    {(() => {
                      let queueOffset = 0;
                      return (
                        <svg viewBox="0 0 42 42" className="h-44 w-44 shadow-sm rounded-full overflow-visible">
                          <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#FAF6F0" strokeWidth="6" />
                          <g transform="rotate(-90 21 21)">
                            {queueData.map((item, index) => {
                              const percent = item.value;
                              const isHovered = hoveredQueueIdx === index;
                              const segment = (
                                <circle 
                                  key={item.name} 
                                  cx="21" 
                                  cy="21" 
                                  r="15.915" 
                                  fill="transparent" 
                                  stroke={item.color} 
                                  strokeWidth={isHovered ? "7.5" : "6"} 
                                  strokeDasharray={`${percent} ${100 - percent}`} 
                                  strokeDashoffset={-queueOffset}
                                  style={{ cursor: "pointer", transition: "stroke-width 0.2s ease" }}
                                  onMouseEnter={() => setHoveredQueueIdx(index)}
                                  onMouseLeave={() => setHoveredQueueIdx(null)}
                                />
                              );
                              queueOffset += percent;
                              return segment;
                            })}
                          </g>

                          {hoveredQueueIdx !== null ? (
                            <>
                              <text x="21" y="18.5" textAnchor="middle" fontSize="3" fontWeight="800" fill="#3E362E" className="font-sans font-bold">
                                {queueData[hoveredQueueIdx].name}
                              </text>
                              <text x="21" y="23" textAnchor="middle" fontSize="4.5" fontWeight="950" fill={queueData[hoveredQueueIdx].color} className="font-mono">
                                {queueData[hoveredQueueIdx].value}%
                              </text>
                              <text x="21" y="26.5" textAnchor="middle" fontSize="2" fontWeight="800" fill="#A89E95" className="font-sans uppercase tracking-wider">
                                of visitor pool
                              </text>
                            </>
                          ) : (
                            <>
                              <text x="21" y="19" textAnchor="middle" fontSize="3.5" fontWeight="900" fill="#3E362E" className="font-serif">
                                Queue
                              </text>
                              <text x="21" y="23.5" textAnchor="middle" fontSize="3" fontWeight="950" fill="#8B5A2B" className="font-mono">
                                12 Active
                              </text>
                              <text x="21" y="26.5" textAnchor="middle" fontSize="1.8" fontWeight="800" fill="#A89E95" className="font-sans uppercase tracking-wider">
                                hover for %
                              </text>
                            </>
                          )}
                        </svg>
                      );
                    })()}
                  </div>

                  {/* Rule 2 Labels Grid setup for pie-charts details definitions links */}
                  <div className="w-full flex flex-wrap justify-center gap-x-3 gap-y-1.5 text-[11px] font-extrabold uppercase tracking-widest text-[#C5A059] font-sans">
                    <div className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: GOLD }}></div> Served</div>
                    <div className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: CHARCOAL }}></div> Waiting</div>
                    <div className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-slate-300"></div> Delayed</div>
                    <div className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-red-500"></div> Drops</div>
                  </div>
                </div>
              </div>

              {/* Barber Analytics Performance Table Card Block */}
              <div className="card p-6 bg-white text-left">
                <div className="mb-5">
                  {/* Rule 1 Section Grid Title Layout */}
                  <h2 className="font-serif text-xl sm:text-2xl tracking-normal text-stone-900 flex items-center justify-start gap-2 whitespace-nowrap">
                    <span className="font-bold uppercase">Barber Performance</span>
                    <span className="italic text-[#C5A059] normal-case font-medium">Ledger</span>
                  </h2>
                  {/* Rule 3 Table summary information context text layout */}
                  <p className="text-stone-600 text-sm font-normal leading-relaxed font-sans mt-0.5">Customers served, efficiency metrics track logs, and real-time revenue shares.</p>
                </div>

                <div className="overflow-x-auto custom-scrollbar font-sans">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-stone-100">
                        {/* Rule 2 Table Header Cell Typography Label Elements */}
                        <th className="pb-3 text-[11px] font-extrabold uppercase tracking-widest text-[#C5A059]">Styling Specialist</th>
                        <th className="pb-3 text-[11px] font-extrabold uppercase tracking-widest text-[#C5A059] text-center">Served Today</th>
                        <th className="pb-3 text-[11px] font-extrabold uppercase tracking-widest text-[#C5A059] text-center">User Rating</th>
                        <th className="pb-3 text-[11px] font-extrabold uppercase tracking-widest text-[#C5A059] text-right">Revenue</th>
                        <th className="pb-3 text-[11px] font-extrabold uppercase tracking-widest text-[#C5A059] pl-8 w-1/3">Efficiency Rate</th>
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
            /* ── CENTRAL SYSTEM REPORTS MANAGEMENT WORKSPACE ── */
            <div className="space-y-6 text-left">
              
              {/* Dynamic Filtering Sub-Bar controls component panel wrapper */}
              <div className="card p-4 flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm bg-white font-sans">
                
                {/* Time Allocation Filter Actions Hub */}
                <div className="flex bg-stone-100 p-1 rounded-xl border border-stone-200/60 w-full md:w-auto shadow-inner">
                {['daily', 'weekly', 'monthly'].map(t => (
            <button
              key={t}
              onClick={() => setTimeFilter(t)}
              /* ── ✅ FIXED: COMMENT WRAPPED SAFELY IN JSX EXPRESSION BRACKETS ── */
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

                {/* Report Type Core Categorization Filters Hub Wrapper links */}
                <div className="flex bg-stone-100 p-1 rounded-xl border border-stone-200/60 w-full md:w-auto shadow-inner">
                  {['salon-wise', 'revenue-wise', 'booking-wise'].map(type => (
                    <button
                      key={type}
                      onClick={() => setReportType(type)}
                      className="flex-1 md:flex-none px-4 py-2 rounded-lg text-xs font-extrabold tracking-wider uppercase transition-all duration-200 focus:outline-none cursor-pointer"
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

              {/* Franchise Volume Highlights Labels Segment Row */}
              <div>
                {/* Rule 1 Segment Header Composition */}
                <h2 className="font-serif text-xl sm:text-2xl tracking-normal text-stone-900 flex items-center justify-start gap-2 whitespace-nowrap">
                  <span className="font-bold uppercase">Top Performing</span>
                  <span className="italic text-[#C5A059] normal-case font-medium">Outlets</span>
                </h2>
                {/* Rule 3 Muted description summary standard label tag */}
                <p className="text-stone-600 text-sm font-normal leading-relaxed font-sans mt-0.5">Highlighted tracking metrics displaying core performance indexes per branch node.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Delay Element */}
                <div className="bg-gradient-to-br from-green-50/50 to-white rounded-2xl p-5 border border-green-200/50 relative overflow-hidden card">
                  <div className="absolute top-0 right-0 p-4 opacity-5"><Clock className="w-12 h-12 text-green-700" /></div>
                  {/* Rule 2 Card Internal Section Kicker Subheader */}
                  <p className="text-[11px] font-extrabold uppercase tracking-widest text-green-700 mb-2 font-sans">Minimum Waiting Lag</p>
                  <h4 className="text-md font-black font-serif text-stone-900 mb-2 truncate">{topSalons.leastDelay.name}</h4>
                  <div className="flex items-baseline gap-1.5 font-sans">
                    <span className="text-2xl font-mono font-black text-green-700 leading-none">{topSalons.leastDelay.delayAvg}</span>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-stone-400">delay index</span>
                  </div>
                </div>

                {/* Customer Volume Element */}
                <div className="bg-gradient-to-br from-blue-50/50 to-white rounded-2xl p-5 border border-blue-200/50 relative overflow-hidden card">
                  <div className="absolute top-0 right-0 p-4 opacity-5"><Users className="w-12 h-12 text-blue-700" /></div>
                  <p className="text-[11px] font-extrabold uppercase tracking-widest text-blue-700 mb-2 font-sans">Highest Traffic Volume</p>
                  <h4 className="text-md font-black font-serif text-stone-900 mb-2 truncate">{topSalons.mostCustomers.name}</h4>
                  <div className="flex items-baseline gap-1.5 font-sans">
                    <span className="text-2xl font-mono font-black text-blue-700 leading-none">{topSalons.mostCustomers.customers}</span>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-stone-400">visitors today</span>
                  </div>
                </div>

                {/* Gross Revenue Element */}
                <div className="bg-gradient-to-br from-amber-50/40 to-white rounded-2xl p-5 border border-amber-200/50 relative overflow-hidden card">
                  <div className="absolute top-0 right-0 p-4 opacity-5"><TrendingUp className="w-12 h-12 text-amber-600" /></div>
                  <p className="text-[11px] font-extrabold uppercase tracking-widest text-amber-700 mb-2 font-sans">Peak Revenue Released</p>
                  <h4 className="text-md font-black font-serif text-stone-900 mb-2 truncate">{topSalons.highestRevenue.name}</h4>
                  <div className="flex items-baseline gap-1.5 font-sans">
                    <span className="text-2xl font-mono font-black text-amber-700 leading-none">₹{topSalons.highestRevenue.revenue.toLocaleString()}</span>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-stone-400">gross income</span>
                  </div>
                </div>
              </div>

              {/* Detailed Spreadsheet Audit Matrix Ledger Data Container */}
              <div className="card overflow-hidden bg-white">
                <div className="p-6 border-b border-stone-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white">
                  <div>
                    {/* Rule 1 Table block header mapping key properties values */}
                    <h2 className="font-serif text-xl sm:text-2xl tracking-normal text-stone-900 flex items-center justify-start gap-2 whitespace-nowrap">
                      <span className="font-bold uppercase">{reportType.replace('-', ' ')}</span>
                      <span className="italic text-[#C5A059] normal-case font-medium">Breakdown Report</span>
                    </h2>
                    {/* Rule 3 spreadsheet description notes label layout */}
                    <p className="text-stone-600 text-sm font-normal leading-relaxed font-sans mt-0.5">Detailed structural matrix audit metrics across active franchise coordinates logs ({timeFilter})</p>
                  </div>
                  {/* Rule 4 Dynamic Export Layout Document Button */}
                  <button className="rounded-xl border h-10 px-4 text-xs font-extrabold tracking-wider uppercase transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer font-sans"
                    style={{ backgroundColor: `${GOLD}10`, color: GOLD, borderColor: `${GOLD}40` }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = GOLD;
                      e.currentTarget.style.color = '#FFFFFF';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = `${GOLD}10`;
                      e.currentTarget.style.color = GOLD;
                    }}
                  >
                    Export CSV Matrix
                  </button>
                </div>
                
                <div className="overflow-x-auto custom-scrollbar font-sans">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-stone-50/50 border-b border-stone-100">
                        {/* Rule 2 Database Spreadsheet Ledger Header Labels style maps */}
                        <th className="py-3.5 px-6 text-[11px] font-extrabold uppercase tracking-widest text-[#C5A059]">Active Salon Node</th>
                        <th className="py-3.5 px-6 text-[11px] font-extrabold uppercase tracking-widest text-[#C5A059] text-center">Bookings</th>
                        <th className="py-3.5 px-6 text-[11px] font-extrabold uppercase tracking-widest text-[#C5A059] text-center">Customers Served</th>
                        <th className="py-3.5 px-6 text-[11px] font-extrabold uppercase tracking-widest text-[#C5A059] text-center">Avg Operational Delay</th>
                        <th className="py-3.5 px-6 text-[11px] font-extrabold uppercase tracking-widest text-[#C5A059] text-right">Revenue Yield</th>
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
                      
                      {/* Operational Ledger Data Summary Footer Row Block */}
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
    </div>
  );
};

export default AnalyticsDashboard;