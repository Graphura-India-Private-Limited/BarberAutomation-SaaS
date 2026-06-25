import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; 

import {
  Users,
  Search,
  Star,
  TrendingUp,
  Crown,
  Calendar,
  Mail,
  Zap,
  ArrowUpRight,
  ArrowLeft
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
  const navigate = useNavigate(); // ✅ Initialized the navigation router handle
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
      status: "Active",
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
      status: "Active",
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
    "bg-white/80 backdrop-blur-md border border-[#EADDCA] rounded-2xl p-5 md:p-6 shadow-[0_8px_25px_rgba(0,0,0,0.01)] hover:shadow-[0_15px_30px_rgba(62,54,46,0.04)] transition-all duration-300 text-left";

  return (
    <div className="w-full bg-[#FAF6F0] font-sans pb-12">
      {/* --- SHINY LUXURY GRADIENT GLOW LAYERS --- */}
      <div className="absolute top-40 -left-40 w-[600px] h-[600px] bg-gradient-to-br from-[#C5A059]/10 via-[#EADDCA]/20 to-transparent rounded-full blur-[120px] pointer-events-none animate-pulse duration-[8000ms]" />
      <div className="absolute bottom-1/4 right-10 w-[700px] h-[500px] bg-[#EADDCA]/30 rounded-full blur-[140px] pointer-events-none" />
      
      {/* SUB-HEADER UTILITIES SECTION */}
      <div className="max-w-7xl mx-auto w-full px-4 md:px-8 flex flex-col sm:flex-row gap-6 justify-between items-start sm:items-center mb-8 text-left z-10 relative ">
        <div>
          <span className="text-[9px] font-black uppercase tracking-[0.3em] text-[#C5A059] bg-[#C5A059]/10 px-2.5 py-1 rounded-md inline-block mb-1.5">
            Core Database Panel
          </span>
          <h2 className="text-3xl font-black text-[#3E362E] tracking-tight uppercase font-serif">Customer Registry</h2>
          <p className="text-[11px] font-medium tracking-wide text-stone-400 mt-1">Lifecycle Tracking, Retention Scoring & Financial Analytics</p>
        </div>

        {/* Dynamic Search Box Input */}
        <div className="relative w-full sm:w-[320px]">
          <Search
            size={14}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 stroke-[2.5px]"
          />
          <input
            type="text"
            placeholder="Search verified clients..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3 text-xs font-bold text-[#3E362E] placeholder-stone-400 bg-white border border-[#EADDCA] rounded-xl outline-none focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059] shadow-sm transition-all"
          />
        </div>
      </div>

      {/* 📊 SUMMARY EXECUTIVE STATS ROW */}
      <div className="max-w-7xl mx-auto w-full px-4 md:px-8 grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10 z-10 relative">
        
        <div className={cardStyle}>
          <div className="text-[#3E362E] bg-[#EADDCA]/30 p-2.5 rounded-xl w-fit border border-[#EADDCA]/40"><Users size={18} /></div>
          <h3 className="text-3xl font-serif font-black text-[#3E362E] tracking-tight mt-4 leading-none">245</h3>
          <p className="text-[10px] font-black uppercase tracking-wider text-stone-400 mt-2">Total Database</p>
        </div>

        <div className={cardStyle}>
          <div className="text-[#3E362E] bg-[#EADDCA]/30 p-2.5 rounded-xl w-fit border border-[#EADDCA]/40"><TrendingUp size={18} /></div>
          <h3 className="text-3xl font-serif font-black text-[#3E362E] tracking-tight mt-4 leading-none">52</h3>
          <p className="text-[10px] font-black uppercase tracking-wider text-stone-400 mt-2">Frequent Users</p>
        </div>

        <div className={cardStyle}>
          <div className="text-[#C5A059] bg-[#C5A059]/10 p-2.5 rounded-xl w-fit border border-[#C5A059]/20"><Zap size={18} /></div>
          <h3 className="text-3xl font-serif font-black text-[#3E362E] tracking-tight mt-4 leading-none">78</h3>
          <p className="text-[10px] font-black uppercase tracking-wider text-stone-400 mt-2">Active Accounts</p>
        </div>

        <div className={cardStyle}>
          <div className="text-emerald-700 bg-emerald-50 p-2.5 rounded-xl w-fit border border-emerald-100"><Star size={18} /></div>
          <h3 className="text-3xl font-serif font-black text-[#3E362E] tracking-tight mt-4 leading-none">4.8</h3>
          <p className="text-[10px] font-black uppercase tracking-wider text-stone-400 mt-2">Avg Retention Score</p>
        </div>

      </div>

      {/* 👥 CUSTOMER DETAIL TABLE LIST */}
      <div className="max-w-7xl mx-auto w-full px-4 md:px-8 z-10 relative">
        <div className="bg-white/90 backdrop-blur-md border border-[#EADDCA] rounded-[24px] overflow-hidden shadow-[0_8px_25px_rgba(0,0,0,0.01)] hover:shadow-[0_20px_40px_rgba(62,54,46,0.04)] transition-all duration-300">
          
          {/* Table Header */}
          <div className="hidden md:grid grid-cols-[1.5fr_1fr_1fr_1fr_1.2fr] border-b border-stone-100 bg-stone-50/50 px-6 py-4 text-[11px] font-extrabold uppercase tracking-widest text-[#C5A059]">
            <span>Customer Details</span>
            <span>Bookings</span>
            <span>Visits Logged</span>
            <span>Rating Given</span>
            <span>Gross Revenue Spent</span>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-stone-100">
            {filtered.map((customer) => (
              <div 
                key={customer.id} 
                className="grid gap-3 p-6 md:grid-cols-[1.5fr_1fr_1fr_1fr_1.2fr] md:items-center hover:bg-stone-50/30 transition-colors group text-left"
              >
                {/* Monogram, Name & Email */}
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-full bg-[#3E362E] text-white flex items-center justify-center font-serif font-black text-sm border border-[#2A241F] shadow-sm flex-shrink-0">
                    {customer.name.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-serif font-bold text-[#3E362E] text-base tracking-tight leading-tight mb-1">
                      {customer.name}
                    </h4>
                    <div className="flex items-center gap-1.5 text-stone-400">
                      <Mail className="w-3 h-3 flex-shrink-0" />
                      <p className="text-[11px] font-medium font-mono truncate tracking-tight">
                        {customer.email}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Bookings */}
                <div className="md:block flex justify-between items-center">
                  <span className="md:hidden text-[9px] text-stone-400 uppercase font-black tracking-wider">Bookings</span>
                  <p className="font-serif font-black text-[#3E362E] text-sm md:text-base leading-none">{customer.bookings}</p>
                </div>

                {/* Visits */}
                <div className="md:block flex justify-between items-center">
                  <span className="md:hidden text-[9px] text-stone-400 uppercase font-black tracking-wider">Visits Logged</span>
                  <p className="font-serif font-black text-[#3E362E] text-sm md:text-base leading-none">{customer.visits}</p>
                </div>

                {/* Rating */}
                <div className="md:block flex justify-between items-center">
                  <span className="md:hidden text-[9px] text-stone-400 uppercase font-black tracking-wider">Rating Given</span>
                  <p className="font-serif font-black text-[#3E362E] text-sm md:text-base leading-none flex items-center gap-1">
                    {customer.rating.toFixed(1)} <Star className="w-3.5 h-3.5 text-[#C5A059] fill-[#C5A059]" />
                  </p>
                </div>

                {/* Revenue / Progress bar */}
                <div className="md:block flex flex-col gap-1.5 justify-start">
                  <div className="flex justify-between items-center mb-1 md:mb-0">
                    <span className="md:hidden text-[9px] text-stone-400 uppercase font-black tracking-wider">Revenue</span>
                    <p className="font-mono font-black text-xs text-[#3E362E] bg-[#FAF6F0] px-2 py-0.5 rounded border border-[#EADDCA]/40">₹{customer.amount}</p>
                  </div>
                  <div className="hidden md:block w-3/4 h-1.5 rounded-full bg-[#FAF6F0] border border-[#EADDCA]/40 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[#3E362E] to-[#C5A059]"
                      style={{ width: `${Math.min(100, (customer.amount / 70000) * 100)}%` }}
                    />
                  </div>
                </div>

              </div>
            ))}
          </div>

        </div>
      </div>

      {/* 📈 INSIGHTS METRICS FOOTER CHARTS */}
      <div className="max-w-7xl mx-auto w-full px-4 md:px-8 grid grid-cols-1 xl:grid-cols-2 gap-6 mt-8 z-10 relative">
        
        {/* Panel 1: Frequent Visitors */}
        <div className={cardStyle}>
          <div className="flex items-center justify-between mb-5 border-b border-[#FAF6F0] pb-4">
            <div className="flex items-center gap-2.5">
              <div className="text-[#C5A059] bg-[#C5A059]/10 p-2 rounded-lg"><Calendar size={16} /></div>
              <h4 className="font-serif font-bold text-[#3E362E] text-md tracking-wide">Frequent Customer Flow</h4>
            </div>
            <ArrowUpRight className="w-4 h-4 text-stone-400" />
          </div>

          <div className="divide-y divide-[#FAF6F0]">
            {customers
              .filter((x) => x.visits > 8)
              .map((x) => (
                <div key={x.id} className="flex justify-between items-center py-3.5 text-sm font-medium">
                  <p className="text-[#3E362E] font-semibold">{x.name}</p>
                  <p className="text-[10px] font-black uppercase bg-[#3E362E] text-white tracking-wider px-2.5 py-1 rounded-md">
                    {x.visits} visits
                  </p>
                </div>
              ))}
          </div>
        </div>

        {/* Panel 2: High Value Spenders */}
        <div className={cardStyle}>
          <div className="flex items-center justify-between mb-5 border-b border-[#FAF6F0] pb-4">
            <div className="flex items-center gap-2.5">
              <div className="text-[#C5A059] bg-[#C5A059]/10 p-2 rounded-lg"><TrendingUp size={16} /></div>
              <h4 className="font-serif font-bold text-[#3E362E] text-md tracking-wide">High Value Client Spends</h4>
            </div>
            <ArrowUpRight className="w-4 h-4 text-stone-400" />
          </div>

          <div className="divide-y divide-[#FAF6F0]">
            {customers
              .filter((x) => x.amount > 30000)
              .map((x) => (
                <div key={x.id} className="flex justify-between items-center py-3.5 text-sm font-medium">
                  <p className="text-[#3E362E] font-semibold">{x.name}</p>
                  <p className="font-mono font-black text-[#C5A059] bg-[#FAF6F0] border border-[#EADDCA] px-3 py-1 rounded-md">
                    ₹{x.amount}
                  </p>
                </div>
              ))}
          </div>
        </div>
      </div>   
    </div>
  );
}