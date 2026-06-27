import React, { useState, useEffect } from "react";
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

const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export default function CustomerManagement() {
  const navigate = useNavigate(); // ✅ Initialized the navigation router handle
  const [search, setSearch] = useState("");
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const salonId = localStorage.getItem("salonId");
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchCustomers = async () => {
      if (!salonId) {
        setLoading(false);
        return;
      }
      try {
        const [bookingsRes, reviewsRes] = await Promise.all([
          fetch(`${API}/booking/salon/${salonId}`, {
            headers: { Authorization: `Bearer ${token}` }
          }),
          fetch(`${API}/review/salon/${salonId}`, {
            headers: { Authorization: `Bearer ${token}` }
          }).catch(() => null)
        ]);

        const bookingsData = await bookingsRes.json();
        const reviewsData = reviewsRes ? await reviewsRes.json() : { success: false, reviews: [] };

        if (bookingsData.success && bookingsData.bookings) {
          // Group bookings by customer
          const customerMap = {};
          bookingsData.bookings.forEach((booking) => {
            if (!booking.customer_id) return;
            const cId = booking.customer_id._id || booking.customer_id;
            if (!cId) return;

            if (!customerMap[cId]) {
              customerMap[cId] = {
                id: cId,
                name: booking.customer_id.name || "Guest Customer",
                email: booking.customer_id.email || booking.customer_id.mobile || "No Email",
                bookingsList: []
              };
            }
            customerMap[cId].bookingsList.push(booking);
          });

          // Group reviews by customer
          const reviewMap = {};
          if (reviewsData.success && reviewsData.reviews) {
            reviewsData.reviews.forEach((rev) => {
              if (!rev.customer_id) return;
              const custId = rev.customer_id._id || rev.customer_id;
              if (!custId) return;
              if (!reviewMap[custId]) {
                reviewMap[custId] = [];
              }
              reviewMap[custId].push(rev.salon_rating);
            });
          }

          const aggregatedCustomers = Object.values(customerMap).map((c) => {
            const bookingsCount = c.bookingsList.length;
            const completedBookings = c.bookingsList.filter(b => b.status === "completed");
            const visitsCount = completedBookings.length || bookingsCount;
            const totalSpent = c.bookingsList
              .filter(b => b.status !== "cancelled")
              .reduce((sum, b) => sum + (b.total_amount || 0), 0);
            
            // Sync with real-time salon reviews
            const customerReviews = reviewMap[c.id] || [];
            const avgRating = customerReviews.length > 0
              ? customerReviews.reduce((sum, val) => sum + val, 0) / customerReviews.length
              : null;

            const status = bookingsCount >= 5 ? "Active" : "Regular";

            return {
              id: c.id,
              name: c.name,
              email: c.email,
              bookings: bookingsCount,
              visits: visitsCount,
              amount: totalSpent,
              rating: avgRating,
              status: status
            };
          });

          setCustomers(aggregatedCustomers);
        } else {
          setError(bookingsData.message || "Failed to load booking registry");
        }
      } catch (err) {
        setError("Network error loading customers");
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, [salonId, token]);

  const filtered = customers.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  const cardStyle =
    "bg-white/80 backdrop-blur-md border border-[#EADDCA] rounded-2xl p-5 md:p-6 shadow-[0_8px_25px_rgba(0,0,0,0.01)] hover:shadow-[0_15px_30px_rgba(62,54,46,0.04)] transition-all duration-300 text-left";

  if (!salonId) {
    return (
      <div className="w-full min-h-[70vh] bg-[#FAF6F0] font-sans flex items-center justify-center py-12 px-4">
        <div className="bg-white border border-[#EADDCA] p-12 text-center max-w-md w-full shadow-xl rounded-3xl">
          <div className="w-16 h-16 mx-auto bg-rose-50 rounded-2xl flex items-center justify-center border border-rose-100 shadow-sm text-3xl mb-4">
            ⚠️
          </div>
          <h2 className="font-serif text-xl sm:text-2xl text-stone-900 font-bold uppercase mb-2">Session Expired</h2>
          <p className="mx-auto max-w-xs text-sm text-stone-400 font-sans leading-relaxed mb-6">
            We couldn't detect your salon identification. Please log in again to manage your customer registry.
          </p>
          <button 
            onClick={() => navigate("/owner/login")}
            className="w-full py-3 rounded-xl text-xs font-black uppercase tracking-wider text-white shadow-sm hover:opacity-90 cursor-pointer transition-all active:scale-95"
            style={{ background: "#C5A059" }}
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="w-full min-h-[70vh] bg-[#FAF6F0] font-sans flex items-center justify-center py-12">
        <div className="flex flex-col items-center justify-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#C5A059]/10 flex items-center justify-center animate-pulse">
            <Users className="w-6 h-6 text-[#C5A059]" />
          </div>
          <p className="text-stone-500 text-sm font-medium">Loading customer database...</p>
        </div>
      </div>
    );
  }

  // Aggregate stats
  const totalDatabase = customers.length;
  const frequentUsers = customers.filter(c => c.visits >= 3).length;
  const activeAccounts = customers.filter(c => c.status === "Active" || c.bookings > 0).length;
  const ratedCustomers = customers.filter(c => c.rating !== null && c.rating !== undefined);
  const avgRetention = ratedCustomers.length > 0
    ? Number(ratedCustomers.reduce((sum, c) => sum + c.rating, 0) / ratedCustomers.length).toFixed(1)
    : "—";

  // Filter lists for bottom sections
  const frequentCustomersList = [...customers]
    .sort((a, b) => b.visits - a.visits)
    .slice(0, 5)
    .filter(c => c.visits > 0);

  const highValueSpendersList = [...customers]
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 5)
    .filter(c => c.amount > 0);

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
          <h3 className="text-3xl font-serif font-black text-[#3E362E] tracking-tight mt-4 leading-none">{totalDatabase}</h3>
          <p className="text-[10px] font-black uppercase tracking-wider text-stone-400 mt-2">Total Database</p>
        </div>

        <div className={cardStyle}>
          <div className="text-[#3E362E] bg-[#EADDCA]/30 p-2.5 rounded-xl w-fit border border-[#EADDCA]/40"><TrendingUp size={18} /></div>
          <h3 className="text-3xl font-serif font-black text-[#3E362E] tracking-tight mt-4 leading-none">{frequentUsers}</h3>
          <p className="text-[10px] font-black uppercase tracking-wider text-stone-400 mt-2">Frequent Users</p>
        </div>

        <div className={cardStyle}>
          <div className="text-[#C5A059] bg-[#C5A059]/10 p-2.5 rounded-xl w-fit border border-[#C5A059]/20"><Zap size={18} /></div>
          <h3 className="text-3xl font-serif font-black text-[#3E362E] tracking-tight mt-4 leading-none">{activeAccounts}</h3>
          <p className="text-[10px] font-black uppercase tracking-wider text-stone-400 mt-2">Active Accounts</p>
        </div>

        <div className={cardStyle}>
          <div className="text-emerald-700 bg-emerald-50 p-2.5 rounded-xl w-fit border border-emerald-100"><Star size={18} /></div>
          <h3 className="text-3xl font-serif font-black text-[#3E362E] tracking-tight mt-4 leading-none">{avgRetention}</h3>
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
            {filtered.length === 0 ? (
              <div className="p-12 text-center">
                <p className="text-stone-400 text-sm font-medium">No verified clients found in this salon's registry.</p>
              </div>
            ) : (
              filtered.map((customer) => (
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
                      {customer.rating !== null && customer.rating !== undefined ? (
                        <>
                          {Number(customer.rating).toFixed(1)} <Star className="w-3.5 h-3.5 text-[#C5A059] fill-[#C5A059]" />
                        </>
                      ) : (
                        <span className="text-stone-300 font-sans text-xs font-normal">—</span>
                      )}
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
              ))
            )}
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
            {frequentCustomersList.length === 0 ? (
              <p className="text-stone-400 text-xs font-semibold py-4 text-center">No recurring visits logged yet.</p>
            ) : (
              frequentCustomersList.map((x) => (
                <div key={x.id} className="flex justify-between items-center py-3.5 text-sm font-medium">
                  <p className="text-[#3E362E] font-semibold">{x.name}</p>
                  <p className="text-[10px] font-black uppercase bg-[#3E362E] text-white tracking-wider px-2.5 py-1 rounded-md">
                    {x.visits} visits
                  </p>
                </div>
              ))
            )}
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
            {highValueSpendersList.length === 0 ? (
              <p className="text-stone-400 text-xs font-semibold py-4 text-center">No spend history recorded yet.</p>
            ) : (
              highValueSpendersList.map((x) => (
                <div key={x.id} className="flex justify-between items-center py-3.5 text-sm font-medium">
                  <p className="text-[#3E362E] font-semibold">{x.name}</p>
                  <p className="font-mono font-black text-[#C5A059] bg-[#FAF6F0] border border-[#EADDCA] px-3 py-1 rounded-md">
                    ₹{x.amount}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>   
    </div>
  );
}