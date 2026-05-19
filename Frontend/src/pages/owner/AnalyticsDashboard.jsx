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
  Layers
} from 'lucide-react';

const AnalyticsDashboard = () => {
  // --- Mock Data ---
  const performanceMetrics = [
    { title: 'Total Customers', value: '1,245', icon: Users, color: 'text-brand-orange', bg: 'bg-orange-50' },
    { title: 'Active Queue', value: '12', icon: Activity, color: 'text-brand-orange', bg: 'bg-orange-50' },
    { title: 'Avg Wait Time', value: '18 mins', icon: Clock, color: 'text-brand-orange', bg: 'bg-orange-50' },
    { title: 'Peak Hours', value: '4PM - 6PM', icon: TrendingUp, color: 'text-brand-orange', bg: 'bg-orange-50' },
    { title: 'Average Rating', value: '4.8', icon: Star, color: 'text-brand-orange', bg: 'bg-orange-50' },
    { title: 'Total Revenue', value: '₹48,500', icon: Layers, color: 'text-brand-orange', bg: 'bg-orange-50' },
    { title: 'Drop-offs', value: '14', icon: UserX, color: 'text-red-500', bg: 'bg-red-50' },
    { title: 'Staff Active', value: '6', icon: Scissors, color: 'text-brand-orange', bg: 'bg-orange-50' },
  ];

  const barberAnalytics = [
    { id: 1, name: 'Rahul Sharma', served: 15, rating: 4.9, efficiency: 95, revenue: '₹4,500' },
    { id: 2, name: 'Amit Kumar', served: 12, rating: 4.7, efficiency: 88, revenue: '₹3,200' },
    { id: 3, name: 'Priya Singh', served: 18, rating: 5.0, efficiency: 98, revenue: '₹6,100' },
    { id: 4, name: 'Vikram Gupta', served: 10, rating: 4.6, efficiency: 82, revenue: '₹2,800' },
  ];

  return (
    <div className="min-h-screen bg-[#f8f9fa] p-6 font-sans">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-brand-dark to-slate-800 rounded-2xl p-6 mb-6 relative overflow-hidden shadow-md">
        <div className="relative z-10 flex items-center">
          <h1 className="text-2xl font-bold text-white tracking-tight mr-3">Owner Dashboard</h1>
          <span className="text-slate-300 font-medium">Analytics & Performance Overview</span>
        </div>
        {/* Decorative background element matching reference */}
        <div className="absolute right-6 top-1/2 -translate-y-1/2 opacity-20 transform rotate-12">
          <div className="w-16 h-16 border-2 border-white rounded-xl"></div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {performanceMetrics.map((metric, index) => (
          <div key={index} className="bg-white rounded-2xl p-5 flex items-center gap-4 shadow-sm border border-gray-100">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${metric.bg}`}>
              <metric.icon className={`w-6 h-6 ${metric.color}`} strokeWidth={2} />
            </div>
            <div>
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">{metric.title}</p>
              <h3 className="text-2xl font-bold text-gray-900 leading-none">{metric.value}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        
        {/* Line Chart Container (Performance Trend) */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 lg:col-span-2">
          <div className="mb-6">
            <h3 className="text-base font-bold text-gray-900">Queue & Traffic Trend</h3>
            <p className="text-xs text-gray-500 mt-1">Daily customer traffic and wait times</p>
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
                  stroke="#f97316" 
                  strokeWidth="2"
                  vectorEffect="non-scaling-stroke"
                />
                <defs>
                  <linearGradient id="orange-gradient" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#f97316" stopOpacity="1" />
                    <stop offset="100%" stopColor="#f97316" stopOpacity="0" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
            
            {/* Legend */}
            <div className="absolute -bottom-10 inset-x-0 flex justify-center items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-brand-orange"></div>
              <span className="text-xs text-gray-500 font-medium">Customer Traffic</span>
            </div>
          </div>
        </div>

        {/* Pie Chart Container (Customer Types) */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="mb-6">
            <h3 className="text-base font-bold text-gray-900">Queue Breakdown</h3>
            <p className="text-xs text-gray-500 mt-1">Current status of daily visitors</p>
          </div>
          
          <div className="flex flex-col items-center justify-center h-56">
            {/* CSS Conic Gradient Pie Chart */}
            <div className="w-40 h-40 rounded-full mb-6 relative" style={{
              background: 'conic-gradient(#f97316 0% 45%, #111827 45% 75%, #cbd5e1 75% 90%, #ef4444 90% 100%)'
            }}>
              {/* Inner circle for Donut look (optional, but references show pie and donut) */}
              <div className="absolute inset-0 m-auto w-20 h-20 bg-white rounded-full"></div>
            </div>

            {/* Custom Legend */}
            <div className="w-full flex flex-wrap justify-center gap-x-4 gap-y-2 text-[10px] font-medium text-gray-600">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-brand-orange"></div>
                Served (45%)
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-brand-dark"></div>
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
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="mb-6">
          <h3 className="text-base font-bold text-gray-900">Barber Performance</h3>
          <p className="text-xs text-gray-500 mt-1">Customers served, efficiency & revenue per barber</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="pb-3 text-xs font-bold text-gray-400 uppercase tracking-wider">Barber</th>
                <th className="pb-3 text-xs font-bold text-gray-400 uppercase tracking-wider text-center">Served Today</th>
                <th className="pb-3 text-xs font-bold text-gray-400 uppercase tracking-wider text-center">Rating</th>
                <th className="pb-3 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Revenue</th>
                <th className="pb-3 text-xs font-bold text-gray-400 uppercase tracking-wider pl-8 w-1/3">Efficiency</th>
              </tr>
            </thead>
            <tbody>
              {barberAnalytics.map((barber) => (
                <tr key={barber.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors">
                  <td className="py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-orange-100 text-brand-orange flex items-center justify-center font-bold text-sm">
                        {barber.name.charAt(0)}
                      </div>
                      <span className="font-semibold text-gray-800 text-sm">{barber.name}</span>
                    </div>
                  </td>
                  <td className="py-4 text-center font-bold text-gray-700 text-sm">
                    {barber.served}
                  </td>
                  <td className="py-4 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <Star className="w-3.5 h-3.5 text-orange-400 fill-orange-400" />
                      <span className="font-semibold text-gray-700 text-sm">{barber.rating}</span>
                    </div>
                  </td>
                  <td className="py-4 text-right font-bold text-gray-700 text-sm">
                    {barber.revenue}
                  </td>
                  <td className="py-4 pl-8">
                    <div className="flex items-center gap-3">
                      <div className="w-full bg-gray-100 rounded-full h-2">
                        <div 
                          className="h-2 rounded-full bg-brand-orange" 
                          style={{ width: `${barber.efficiency}%` }}
                        ></div>
                      </div>
                      <span className="text-xs font-bold text-gray-600 w-8 text-right">
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

    </div>
  );
};

export default AnalyticsDashboard;
