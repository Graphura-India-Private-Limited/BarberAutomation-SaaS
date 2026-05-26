import React, { useEffect, useMemo, useState } from "react";
import { BadgeIndianRupee, CalendarDays, CircleDollarSign, ReceiptText, TrendingUp, Scissors, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const money = value => `₹${Number(value || 0).toLocaleString("en-IN")}`;
const token = () => localStorage.getItem("token") || localStorage.getItem("ownerToken");

async function apiGet(path) {
  const res = await fetch(`${API}${path}`, { headers: { Authorization: `Bearer ${token()}` } });
  const data = await res.json();
  if (!data.success) throw new Error(data.message || "Request failed");
  return data;
}

export default function RevenueDashboard() {
  const navigate = useNavigate();
  const [range, setRange] = useState({ from: "", to: "" });
  const [dashboard, setDashboard] = useState(null);
  const [daily, setDaily] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [time, setTime] = useState(new Date().toLocaleTimeString("en-IN", { hour: '2-digit', minute: '2-digit' }));

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date().toLocaleTimeString("en-IN", { hour: '2-digit', minute: '2-digit' }));
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  const query = useMemo(() => {
    const params = new URLSearchParams();
    if (range.from) params.set("from", range.from);
    if (range.to) params.set("to", range.to);
    return params.toString();
  }, [range]);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError("");
    Promise.all([
      apiGet(`/payment/revenue/dashboard${query ? `?${query}` : ""}`),
      apiGet("/payment/revenue/daily"),
    ])
      .then(([nextDashboard, nextDaily]) => {
        if (!active) return;
        setDashboard(nextDashboard);
        setDaily(nextDaily.revenue);
      })
      .catch(err => active && setError(err.message))
      .finally(() => active && setLoading(false));
    return () => { active = false; };
  }, [query]);

  const summary = dashboard?.summary || {};
  const trends = dashboard?.trends || [];
  const services = dashboard?.services || [];
  const barbers = dashboard?.barbers || [];

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="min-h-screen font-sans text-stone-800 selection:bg-amber-100" style={{ background: "#FAF6F0" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap');
        body { background-color: #FAF6F0; }
        .font-sans { font-family: 'Plus Jakarta Sans', sans-serif !important; }
        .font-serif { font-family: 'Playfair Display', serif !important; }
        
        .card { 
          background: #FFFFFF; 
          border: 1px solid #EADBCE; 
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

      {/* ── STICKY TOP PLATFORM HEADER ── */}
      <header className="w-full border-b border-[#EADBCE] bg-white/90 backdrop-blur-md sticky top-0 z-40 px-6 py-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#D97706] to-[#F59E0B] flex items-center justify-center shadow-md">
            <Scissors size={20} className="text-white" strokeWidth={2.5} />
          </div>
          <div>
            <h4 className="text-stone-900 font-extrabold tracking-[0.2em] text-xs uppercase">Barber Pro</h4>
            <p className="text-[#B45309] text-[9px] font-black tracking-[0.3em] uppercase mt-0.5">Owner Console</p>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="hidden sm:flex flex-col text-right">
            <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wider">System Clock</span>
            <span className="text-xs font-extrabold text-stone-800 mt-0.5">{time} IST</span>
          </div>
          <button onClick={handleLogout} className="flex items-center gap-2 border border-stone-200 hover:border-stone-400 hover:bg-stone-50 px-4 py-2 rounded-xl text-stone-600 text-xs font-bold uppercase tracking-widest transition-all duration-200 cursor-pointer">
            <LogOut size={14} /> Exit
          </button>
        </div>
      </header>

      {/* ── MAIN LAYOUT VIEWPORT CONTAINER ── */}
      <main className="mx-auto max-w-7xl px-4 py-8 md:px-8">
        
        {/* Modern Header Banner */}
        <div className="rounded-3xl p-8 mb-6 relative overflow-hidden card">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <p className="text-amber-700 font-bold tracking-[0.2em] text-xs uppercase mb-1">
                Payment Analytics & Stats
              </p>
              <h1 className="text-3xl lg:text-4xl font-black font-serif tracking-tight text-stone-900">Revenue Dashboard</h1>
              <p className="text-stone-500 mt-2 text-sm">Track and analyze all successful system incoming merchant settlement streams.</p>
            </div>

            {/* Range Picker Inline with Header Controls */}
            <div className="flex gap-3 bg-stone-50 border border-stone-200 p-3 rounded-2xl w-full md:max-w-xs shrink-0 items-center">
              <DateInput label="From" value={range.from} onChange={value => setRange(prev => ({ ...prev, from: value }))} />
              <div className="h-6 w-px bg-stone-300 mt-5 shrink-0" />
              <DateInput label="To" value={range.to} onChange={value => setRange(prev => ({ ...prev, to: value }))} />
            </div>
          </div>
          <div className="absolute right-6 top-1/2 -translate-y-1/2 opacity-5 transform rotate-12 pointer-events-none">
            <TrendingUp className="w-32 h-32 text-amber-700" />
          </div>
        </div>

        {loading ? <DashboardSkeleton /> : error ? (
          <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-sm font-bold text-red-700 card hover:transform-none">{error}</div>
        ) : (
          <>
            {/* ── METRIC BLOCK COUNTERS ── */}
            <section className="mb-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <MetricCard title="Daily Revenue" value={money(daily?.totalRevenue)} icon={CalendarDays} accent="bg-orange-50 border border-orange-200/50 text-orange-700" />
              <MetricCard title="Total Revenue" value={money(summary.totalRevenue)} icon={BadgeIndianRupee} accent="bg-amber-50 border border-amber-200/55 text-amber-700" />
              <MetricCard title="Token Payments" value={money(summary.tokenRevenue)} icon={ReceiptText} accent="bg-sky-50 border border-sky-200/50 text-sky-700" />
              <MetricCard title="Full Payments" value={money(summary.fullRevenue)} icon={CircleDollarSign} accent="bg-emerald-50 border border-emerald-200/50 text-emerald-700" />
            </section>

            {/* ── VISUAL ANALYTIC DATA JUMP PANELS ── */}
            <section className="mb-6 grid gap-6 lg:grid-cols-3">
              <ChartPanel title="Daily Revenue Graph" subtitle="Revenue trend from successful payments" className="lg:col-span-2">
                <LineChart data={trends} />
              </ChartPanel>
              <ChartPanel title="Service Revenue" subtitle="Share split breakdown ratio by service item">
                <PieChart data={services.map(item => ({ name: item.serviceName, value: item.revenue }))} />
              </ChartPanel>
            </section>

            <section className="grid gap-6 lg:grid-cols-2">
              <ChartPanel title="Barber Performance" subtitle="Revenue distribution generated by active staff barber nodes">
                <BarChart data={barbers.map(item => ({ name: item.barberName, value: item.revenue }))} />
              </ChartPanel>
              <ChartPanel title="Service-wise Revenue" subtitle="Top generating active operational service metrics">
                <RevenueList rows={services.map(item => ({ name: item.serviceName, value: item.revenue, count: item.transactions }))} />
              </ChartPanel>
            </section>
          </>
        )}
      </main>
    </div>
  );
}

function DateInput({ label, value, onChange }) {
  return (
    <label className="text-[10px] font-black uppercase tracking-wider text-stone-400 w-full">
      {label}
      <input type="date" value={value} onChange={e => onChange(e.target.value)} className="mt-1 w-full bg-transparent text-xs font-bold text-stone-800 outline-none cursor-pointer" />
    </label>
  );
}

// Fixed metric value font-sizes to pop elegantly with the serif profile weight
function MetricCard({ title, value, icon: Icon, accent }) {
  return (
    <div className="card p-6 flex items-center gap-4 bg-white">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${accent}`}>
        <Icon size={22} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[10px] font-black text-stone-400 uppercase tracking-wider mb-1.5">{title}</p>
        <h3 className="text-3xl font-black text-stone-900 font-serif leading-none truncate">{value}</h3>
      </div>
    </div>
  );
}

function ChartPanel({ title, subtitle, children, className = "" }) {
  return (
    <div className={`card p-6 bg-white ${className}`}>
      <div className="mb-6">
        <h2 className="text-lg font-black font-serif text-stone-900 tracking-tight">{title}</h2>
        <p className="mt-1 text-xs font-medium text-stone-400 font-sans">{subtitle}</p>
      </div>
      {children}
    </div>
  );
}

function LineChart({ data }) {
  const width = 720;
  const height = 260;
  const pad = 28;
  const max = Math.max(...data.map(item => item.revenue || 0), 1);
  const points = data.map((item, index) => {
    const x = pad + (index * (width - pad * 2)) / Math.max(data.length - 1, 1);
    const y = height - pad - ((item.revenue || 0) / max) * (height - pad * 2);
    return `${x},${y}`;
  });

  if (!data.length) return <EmptyChart label="No revenue trend data" />;
  return (
    <div className="overflow-x-auto custom-scrollbar">
      <svg viewBox={`0 0 ${width} ${height}`} className="h-72 min-w-[640px] mx-auto">
        {[0, 1, 2, 3].map(i => <line key={i} x1={pad} x2={width - pad} y1={pad + i * 58} y2={pad + i * 58} stroke="#EADBCE" strokeDasharray="4,2" opacity="0.6" />)}
        <polygon points={`${pad},${height - pad} ${points.join(" ")} ${width - pad},${height - pad}`} fill="#D97706" opacity="0.04" />
        <polyline points={points.join(" ")} fill="none" stroke="#D97706" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        {data.map((item, index) => {
          const [x, y] = points[index].split(",").map(Number);
          return <circle key={item.date} cx={x} cy={y} r="4.5" fill="#D97706" stroke="#ffffff" strokeWidth="2.5" />;
        })}
        <text x={pad} y={height - 4} fill="#A89E95" fontSize="10" fontWeight="700" className="font-sans uppercase tracking-wider">{data[0]?.date}</text>
        <text x={width - pad - 80} y={height - 4} fill="#A89E95" fontSize="10" fontWeight="700" className="font-sans uppercase tracking-wider">{data[data.length - 1]?.date}</text>
      </svg>
    </div>
  );
}

function BarChart({ data }) {
  const max = Math.max(...data.map(item => item.value || 0), 1);
  if (!data.length) return <EmptyChart label="No barber revenue data logged yet" />;
  return (
    <div className="space-y-4.5">
      {data.map(item => (
        <div key={item.name} className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-stone-800">{item.name}</span>
            <span className="text-sm font-bold text-amber-700 font-serif">{money(item.value)}</span>
          </div>
          <div className="h-2.5 rounded-full bg-stone-50 border border-stone-200/70 overflow-hidden">
            <div className="h-2.5 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 transition-all duration-500" style={{ width: `${Math.max((item.value / max) * 100, 4)}%` }} />
          </div>
        </div>
      ))}
    </div>
  );
}

function PieChart({ data }) {
  const total = data.reduce((sum, item) => sum + Number(item.value || 0), 0);
  if (!total) return <EmptyChart label="No service revenue transaction volume captured" />;
  let offset = 0;
  const colors = ["#B45309", "#D97706", "#F59E0B", "#FBBF24", "#FEF3C7", "#A89E95"];
  return (
    <div className="flex flex-col items-center gap-6">
      <svg viewBox="0 0 42 42" className="h-48 w-48 -rotate-90">
        <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#FAF6F0" strokeWidth="6" />
        {data.map((item, index) => {
          const percent = (item.value / total) * 100;
          const segment = <circle key={item.name} cx="21" cy="21" r="15.915" fill="transparent" stroke={colors[index % colors.length]} strokeWidth="6" strokeDasharray={`${percent} ${100 - percent}`} strokeDashoffset={-offset} />;
          offset += percent;
          return segment;
        })}
      </svg>
      <RevenueList rows={data.slice(0, 3).map(item => ({ name: item.name, value: item.value }))} compact />
    </div>
  );
}

function RevenueList({ rows, compact = false }) {
  if (!rows.length) return <EmptyChart label="No metrics table data compiled" />;
  return (
    <div className="space-y-2.5 w-full">
      {rows.map(row => (
        <div key={row.name} className="flex items-center justify-between rounded-xl bg-[#FAF6F0]/60 border border-[#EADBCE]/60 px-4 py-3 hover:bg-[#FAF6F0] transition-colors duration-200">
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-bold text-stone-900">{row.name}</p>
            {!compact && <p className="text-[11px] text-stone-400 font-sans mt-0.5">{row.count || 0} completions</p>}
          </div>
          <p className="ml-2 font-bold text-amber-700 font-serif text-sm">{money(row.value)}</p>
        </div>
      ))}
    </div>
  );
}

function EmptyChart({ label }) {
  return <div className="flex h-48 items-center justify-center rounded-2xl border border-dashed border-stone-200 bg-stone-50/50 text-xs font-semibold text-stone-400 font-sans tracking-wide uppercase italic">{label}</div>;
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-4">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-28 animate-pulse rounded-2xl bg-white border border-stone-100" />)}</div>
      <div className="grid gap-6 lg:grid-cols-3"><div className="h-80 animate-pulse rounded-2xl bg-white border border-stone-100 lg:col-span-2" /><div className="h-80 animate-pulse rounded-2xl bg-white border border-stone-100" /></div>
    </div>
  );
}