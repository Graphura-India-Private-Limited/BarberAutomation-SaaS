import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { ArrowLeft, Sparkles, Layers, Users, Clock, ShieldCheck, Phone, MapPin, Building } from "lucide-react";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const GOLD = "#C5A059";
const CHARCOAL = "#3E362E";

export default function HomeOverview() {
  const navigate = useNavigate();
  const { salon, token } = useOutletContext();

  const [queue, setQueue] = useState([]);
  const [dbStats, setDbStats] = useState(null);
  const [dailyRevenue, setDailyRevenue] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [queueRes, statsRes, revRes] = await Promise.all([
          fetch(`${API}/queue/${salon._id}`, { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()).catch(() => null),
          fetch(`${API}/owner/salon/${salon._id}/dashboard`, { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()).catch(() => null),
          fetch(`${API}/payment/revenue/daily`, { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()).catch(() => null),
        ]);

        if (queueRes?.success) setQueue(queueRes.queue || []);
        if (statsRes?.success) setDbStats(statsRes);
        if (revRes?.success) setDailyRevenue(revRes.revenue?.totalRevenue || 0);
      } catch (err) {
        console.error("Error loading home overview data:", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [salon._id, token]);

  const stats = useMemo(() => {
    const activeCount = queue.filter(q => q.status === "waiting" || q.status === "in-progress" || q.status === "paused").length;
    const completedToday = dbStats?.todayStats?.completed || 0;
    
    return [
      { label: "Active Queue", value: activeCount, icon: Clock },
      { label: "Completed Today", value: completedToday, icon: ShieldCheck },
      { label: "Today's Revenue", value: `₹${dailyRevenue.toLocaleString()}`, icon: Sparkles },
      { label: "Staff Active", value: dbStats?.barbers?.filter(b => b.status !== 'offline').length || 0, icon: Users },
    ];
  }, [queue, dbStats, dailyRevenue]);

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center font-sans">
        <div className="text-stone-500 font-semibold tracking-wider animate-pulse uppercase text-xs">
          Loading Salon Overview...
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

      {/* Top action bar */}
      <div className="mb-6 flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="group flex items-center gap-2.5 bg-white border border-[#EADBCE] px-4 py-2 rounded-xl text-[#3E362E] font-medium text-xs tracking-wide transition-all duration-300 shadow-sm hover:bg-[#3E362E] hover:text-white hover:border-[#3E362E] cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-[#C5A059] group-hover:text-white transition-transform duration-300 transform group-hover:-translate-x-0.5" />
          <span className="font-sans font-bold tracking-wider uppercase text-[10px]">Back</span>
        </button>

        <div className="flex items-center gap-1.5 opacity-60">
          <Layers className="w-3.5 h-3.5 text-[#C5A059]" />
          <span className="text-[9px] font-black text-[#3E362E] uppercase tracking-[0.2em]">Console Overview</span>
        </div>
      </div>

      {/* Welcome Card Box */}
      <div className="mb-8 border-b border-stone-200/60 pb-6 text-left">
        <h2 className="text-4xl font-bold font-serif text-stone-900 tracking-tight">
          Welcome, <span className="text-[#C5A059] italic font-normal">{salon.owner_name}</span>
        </h2>
        <p className="text-stone-400 text-xs font-black uppercase tracking-widest mt-2 flex items-center gap-2">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          {salon.salon_name}
        </p>
      </div>

      {/* Metric parameters grid tracking counters */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 text-left">
        {stats.map((s, i) => (
          <div key={i} className="card p-5 bg-white shadow-2xs hover:border-[#C5A059] transition-all duration-300 group flex flex-col justify-between">
            <div className="flex items-start justify-between w-full">
              <div className="text-3xl font-black font-serif text-stone-900 tracking-tight">{s.value}</div>
              <div className="w-7 h-7 rounded-lg bg-[#FAF6F0] flex items-center justify-center text-stone-400 group-hover:text-[#C5A059] transition-colors border border-stone-100">
                <s.icon className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="text-[10px] font-black uppercase tracking-wider text-stone-400 mt-2">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6 text-left">
        {/* Next Customers queue */}
        <div className="bg-white rounded-2xl border border-stone-200/85 p-6 shadow-2xs flex flex-col justify-between card hover:transform-none">
          <div>
            <h3 className="text-sm font-black uppercase tracking-wider text-stone-900 mb-4 border-b pb-2 border-stone-100 flex items-center gap-2">
              <span className="w-1 h-3 bg-[#C5A059] rounded-full" />
              Live Queue Status
            </h3>
            {queue.length === 0 ? (
              <p className="text-stone-400 text-xs font-black uppercase tracking-widest py-6">No customers currently in queue.</p>
            ) : (
              <div className="space-y-3">
                {queue.slice(0, 4).map((item, index) => (
                  <div key={item._id || index} className="flex items-center justify-between bg-stone-50/40 rounded-xl px-4 py-3 border border-stone-200/60 transition-all hover:bg-white hover:border-[#C5A059]/40 shadow-3xs">
                    <div className="text-left">
                      <p className="font-extrabold text-stone-900 text-sm tracking-tight">{item.customer_id?.name || "Walk-in Customer"}</p>
                      <p className="text-xs font-bold text-stone-400 uppercase tracking-wider mt-0.5">Position #{item.position || (index + 1)} · {item.status}</p>
                    </div>
                    <span className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded border shadow-3xs ${
                      item.status === "in-progress" ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                      : item.status === "waiting" ? "bg-amber-50 text-amber-700 border-amber-200"
                      : "bg-stone-50 text-stone-600 border-stone-200"
                    }`}>{item.status}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
          <button
            onClick={() => navigate("/owner/queue")}
            className="mt-6 text-xs font-black uppercase tracking-widest text-[#A37B58] hover:text-[#8F6947] transition-colors text-left border-none bg-transparent cursor-pointer outline-none"
          >
            Manage Live Queue ➔
          </button>
        </div>

        {/* Salon Workspace Info */}
        <div className="bg-white rounded-2xl border border-stone-200/85 p-6 shadow-2xs card hover:transform-none">
          <h3 className="text-sm font-black uppercase tracking-wider text-stone-900 mb-4 border-b pb-2 border-stone-100 flex items-center gap-2">
            <span className="w-1 h-3 bg-[#C5A059] rounded-full" />
            Salon Workspace Info
          </h3>
          <div className="space-y-3.5 text-sm text-stone-700 font-medium">
            <div className="flex border-b pb-2.5 border-stone-100 text-left items-center gap-2">
              <Building size={14} className="text-[#C5A059] shrink-0" />
              <span className="text-[10px] font-black uppercase tracking-wider text-stone-400 w-28 shrink-0">Salon Name</span>
              <span className="font-bold text-stone-900">{salon.salon_name}</span>
            </div>
            <div className="flex border-b pb-2.5 border-stone-100 text-left items-center gap-2">
              <MapPin size={14} className="text-[#C5A059] shrink-0" />
              <span className="text-[10px] font-black uppercase tracking-wider text-stone-400 w-28 shrink-0">Address</span>
              <span className="font-bold text-stone-900">{salon.address || "No address listed"}</span>
            </div>
            <div className="flex border-b pb-2.5 border-stone-100 text-left items-center gap-2">
              <Phone size={14} className="text-[#C5A059] shrink-0" />
              <span className="text-[10px] font-black uppercase tracking-wider text-stone-400 w-28 shrink-0">Support Phone</span>
              <span className="font-bold text-stone-900 font-mono text-xs">{salon.support_number || salon.mobile}</span>
            </div>
            <div className="flex text-left items-center gap-2">
              <Layers size={14} className="text-[#C5A059] shrink-0" />
              <span className="text-[10px] font-black uppercase tracking-wider text-stone-400 w-28 shrink-0">Salary Model</span>
              <span className="font-bold text-[#A37B58] uppercase tracking-wider text-xs">{salon.salary_model === "commission" ? `Commission (${salon.commission_percent || 10}%)` : "Fixed Salary"}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}