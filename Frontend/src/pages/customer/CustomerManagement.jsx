import React, { useState } from "react";
import {
  Users,
  Search,
  Star,
  TrendingUp,
  Crown,
  Calendar,
} from "lucide-react";

// Corporate Brand Scissor SVG Icon Component
const ScissorIcon = ({ className }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="6" cy="6" r="3" stroke="currentColor"/>
    <circle cx="6" cy="18" r="3" stroke="currentColor"/>
    <line x1="20" y1="4" x2="8.12" y2="15.88" stroke="currentColor"/>
    <line x1="14.47" y1="14.48" x2="20" y2="20" stroke="currentColor"/>
    <line x1="8.12" y1="8.12" x2="12" y2="12" stroke="currentColor"/>
  </svg>
);

export default function CustomerManagement() {
  const [search, setSearch] = useState("");

  const customers = [
    {
      id: 1,
      name: "Rahul Sharma",
      email: "rahul@gmail.com",
      bookings: 8,
      visits: 12,
      amount: 45000,
      rating: 4.8,
      status: "VIP",
    },
    {
      id: 2,
      name: "Priya Patil",
      email: "priya@gmail.com",
      bookings: 5,
      visits: 7,
      amount: 28000,
      rating: 4.5,
      status: "Regular",
    },
    {
      id: 3,
      name: "Amit Joshi",
      email: "amit@gmail.com",
      bookings: 10,
      visits: 15,
      amount: 62000,
      rating: 5.0,
      status: "VIP",
    },
    {
      id: 4,
      name: "Sneha Kulkarni",
      email: "sneha@gmail.com",
      bookings: 3,
      visits: 4,
      amount: 15000,
      rating: 4.2,
      status: "Regular",
    },
  ];

  const filtered = customers.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  const cardStyle =
    "bg-white border border-stone-200/50 rounded-2xl p-5 md:p-6 shadow-xs hover:shadow-md transition-all duration-300 text-left";

  return (
    <div className="min-h-screen bg-[#FAF6F0] font-sans text-stone-800 antialiased flex flex-col pb-16">

      {/* ✂️ BARBER PRO GLOBAL EXECUTIVE HEADER BAR */}
      <header className="bg-[#3E362E] border-b border-[#2A241F] px-8 py-4 flex items-center justify-between z-30 shadow-md mb-8">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-[#C5A059]/20 border border-[#C5A059]/40 flex items-center justify-center">
            <ScissorIcon className="w-5 h-5 text-[#C5A059]" />
          </div>
          <div className="text-left">
            <h1 className="text-xl font-black text-[#C5A059] tracking-[0.15em] uppercase leading-none">
              BARBER <span className="text-white">PRO</span>
            </h1>
            <p className="text-[9px] text-stone-400 font-bold tracking-[0.3em] uppercase mt-1 leading-none">
              Customer Intelligence
            </p>
          </div>
        </div>
        
        <div className="text-right hidden sm:block">
          <div className="text-[10px] text-stone-400 uppercase font-black tracking-widest leading-none">CRM Registry</div>
          <div className="text-sm text-white font-black mt-1 leading-none">
            Analytics Desk
          </div>
        </div>
      </header>

      {/* SUB-HEADER UTILITIES SECTION */}
      <div className="max-w-7xl mx-auto w-full px-4 md:px-8 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center mb-8 text-left">
        <div>
          <h2 className="text-2xl font-black text-stone-900 tracking-tight uppercase">Customer Registry</h2>
          <p className="text-xs font-bold tracking-wide text-[#A37B58] uppercase mt-1">Lifecycle Tracking & Insights</p>
        </div>

        {/* Dynamic Search Box Input */}
        <div className="relative w-full sm:w-[320px]">
          <Search
            size={16}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 stroke-[2.5px]"
          />
          <input
            type="text"
            placeholder="Search verified clients..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 text-xs font-bold text-stone-900 placeholder-stone-400 bg-white border border-stone-200/80 rounded-xl outline-none focus:border-[#C5A059] shadow-2xs transition-all"
          />
        </div>
      </div>

      {/* 📊 SUMMARY EXECUTIVE STATS ROW */}
      <div className="max-w-7xl mx-auto w-full px-4 md:px-8 grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        
        <div className={cardStyle}>
          <div className="text-[#A37B58] bg-stone-50 p-2.5 rounded-xl w-fit border border-stone-100"><Users size={20} /></div>
          <h3 className="text-2xl md:text-3xl font-black text-stone-900 tracking-tight mt-4 leading-none">245</h3>
          <p className="text-[10px] font-black uppercase tracking-wider text-stone-400 mt-1.5">Total Database</p>
        </div>

        <div className={cardStyle}>
          <div className="text-[#A37B58] bg-stone-50 p-2.5 rounded-xl w-fit border border-stone-100"><TrendingUp size={20} /></div>
          <h3 className="text-2xl md:text-3xl font-black text-stone-900 tracking-tight mt-4 leading-none">52</h3>
          <p className="text-[10px] font-black uppercase tracking-wider text-stone-400 mt-1.5">Frequent Users</p>
        </div>

        <div className={cardStyle}>
          <div className="text-[#C5A059] bg-stone-50 p-2.5 rounded-xl w-fit border border-stone-100"><Crown size={20} /></div>
          <h3 className="text-2xl md:text-3xl font-black text-stone-900 tracking-tight mt-4 leading-none">18</h3>
          <p className="text-[10px] font-black uppercase tracking-wider text-stone-400 mt-1.5">VIP Accounts</p>
        </div>

        <div className={cardStyle}>
          <div className="text-emerald-700 bg-stone-50 p-2.5 rounded-xl w-fit border border-stone-100"><Star size={20} /></div>
          <h3 className="text-2xl md:text-3xl font-black text-stone-900 tracking-tight mt-4 leading-none">4.8</h3>
          <p className="text-[10px] font-black uppercase tracking-wider text-stone-400 mt-1.5">Avg Retention Score</p>
        </div>

      </div>

      {/* 👥 CUSTOMER DETAIL CARD PIPELINE GRID */}
      <div className="max-w-7xl mx-auto w-full px-4 md:px-8 grid grid-cols-1 xl:grid-cols-2 gap-6">
        {filtered.map((customer) => (
          <div
            key={customer.id}
            className="bg-white rounded-2xl p-6 border border-stone-200/50 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 text-left"
          >
            {/* Top Alignment Header */}
            <div className="flex flex-col sm:flex-row gap-4 sm:justify-between sm:items-start">
              <div className="flex items-center gap-4">
                {/* Monogram Circle Badge */}
                <div className="w-12 h-12 rounded-full bg-[#3E362E] text-white flex items-center justify-center font-black text-base border border-[#2A241F] shadow-2xs">
                  {customer.name.charAt(0)}
                </div>

                <div className="min-w-0">
                  <h4 className="font-extrabold text-stone-900 text-lg tracking-tight leading-none mb-1.5">
                    {customer.name}
                  </h4>
                  <p className="text-xs font-semibold text-stone-400 font-mono truncate tracking-tight">
                    {customer.email}
                  </p>
                </div>
              </div>

              {/* Status Badge Custom Tags */}
              <span className={`inline-flex items-center justify-center text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-md border ${
                customer.status === "VIP"
                  ? "bg-amber-50 text-amber-700 border-amber-200/60"
                  : "bg-blue-50 text-blue-700 border-blue-200/60"
              }`}>
                {customer.status}
              </span>
            </div>

            {/* Structured Metric Fields */}
            <div className="grid grid-cols-3 mt-6 pt-5 border-t border-stone-100 gap-4">
              <div>
                <span className="text-[10px] text-stone-400 uppercase font-black tracking-wider block mb-0.5">Bookings</span>
                <h5 className="font-black text-stone-900 text-lg leading-none">{customer.bookings}</h5>
              </div>
              <div>
                <span className="text-[10px] text-stone-400 uppercase font-black tracking-wider block mb-0.5">Visits Logged</span>
                <h5 className="font-black text-stone-900 text-lg leading-none">{customer.visits}</h5>
              </div>
              <div>
                <span className="text-[10px] text-stone-400 uppercase font-black tracking-wider block mb-0.5">Rating Given</span>
                <h5 className="font-black text-stone-900 text-lg leading-none flex items-center gap-1">
                  {customer.rating.toFixed(1)} <span className="text-[#C5A059] text-xs">★</span>
                </h5>
              </div>
            </div>

            {/* Custom Expense Progress Canvas */}
            <div className="mt-6 pt-5 border-t border-stone-100">
              <div className="flex justify-between items-center mb-2 text-xs font-bold uppercase tracking-wider text-stone-500">
                <p>Total Revenue Spent</p>
                <p className="font-black text-stone-900 font-mono text-sm">₹{customer.amount}</p>
              </div>

              <div className="h-2 rounded-full bg-stone-100 border border-stone-200/30 overflow-hidden">
                <div
                  className="h-full rounded-full bg-[#3E362E] transition-all duration-500"
                  style={{ width: `${Math.min(100, (customer.amount / 70000) * 100)}%` }}
                />
              </div>
            </div>

          </div>
        ))}
      </div>

      {/* 📈 INSIGHTS METRICS FOOTER CHARTS */}
      <div className="max-w-7xl mx-auto w-full px-4 md:px-8 grid grid-cols-1 xl:grid-cols-2 gap-6 mt-8">
        
        {/* Panel 1: Frequent Visitors */}
        <div className={cardStyle}>
          <div className="flex items-center gap-2.5 mb-5 border-b border-stone-100 pb-4">
            <div className="text-[#A37B58]"><Calendar size={18} /></div>
            <h4 className="font-extrabold text-stone-900 uppercase text-sm tracking-wider">Frequent Customer Flow</h4>
          </div>

          <div className="divide-y divide-stone-100">
            {customers
              .filter((x) => x.visits > 8)
              .map((x) => (
                <div key={x.id} className="flex justify-between items-center py-3 text-sm font-semibold">
                  <p className="text-stone-800">{x.name}</p>
                  <p className="text-[10px] font-black uppercase bg-stone-50 text-stone-700 border border-stone-200/50 px-2 py-1 rounded-md">{x.visits} visits</p>
                </div>
              ))}
          </div>
        </div>

        {/* Panel 2: High Value VIP Accounts */}
        <div className={cardStyle}>
          <div className="flex items-center gap-2.5 mb-5 border-b border-stone-100 pb-4">
            <div className="text-[#C5A059]"><Crown size={18} /></div>
            <h4 className="font-extrabold text-stone-900 uppercase text-sm tracking-wider">High Value Client Revenue</h4>
          </div>

          <div className="divide-y divide-stone-100">
            {customers
              .filter((x) => x.status === "VIP")
              .map((x) => (
                <div key={x.id} className="flex justify-between items-center py-3 text-sm font-semibold">
                  <p className="text-stone-800">{x.name}</p>
                  <p className="font-black text-stone-900 font-mono">₹{x.amount}</p>
                </div>
              ))}
          </div>
        </div>

      </div>

    </div>
  );
}