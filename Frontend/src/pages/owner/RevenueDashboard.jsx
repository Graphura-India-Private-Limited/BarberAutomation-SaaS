import React, { useEffect, useMemo, useState } from "react";
import { BadgeIndianRupee, CalendarDays, CircleDollarSign, ReceiptText, TrendingUp } from "lucide-react";

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
  const [range, setRange] = useState({ from: "", to: "" });
  const [dashboard, setDashboard] = useState(null);
  const [daily, setDaily] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
    return () => {
      active = false;
    };
  }, [query]);

  const summary = dashboard?.summary || {};
  const trends = dashboard?.trends || [];
  const services = dashboard?.services || [];
  const barbers = dashboard?.barbers || [];

  return (
    <div className="min-h-screen p-4 md:p-8 font-sans text-zinc-800" style={{ background: "var(--bg)" }}>
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
      
      <div className="mx-auto max-w-7xl">
        {/* Modern Header Banner */}
        <div className="rounded-2xl p-6 mb-6 relative overflow-hidden card" style={{ background: "rgba(250,246,240,0.95)" }}>
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <p className="text-amber-700 font-sans normal-case font-bold tracking-[2px] text-xs sm:text-sm uppercase mb-1">
                Payment Analytics & Stats
              </p>
              <h1 className="text-2xl font-bold font-serif tracking-normal text-zinc-900">Revenue Dashboard</h1>
              <p className="text-zinc-500 font-sans mt-1 text-sm">Track and analyze all successful payments</p>
            </div>
          </div>
          <div className="absolute right-6 top-1/2 -translate-y-1/2 opacity-20 transform rotate-12">
            <TrendingUp className="w-20 h-20 text-amber-600/30" />
          </div>
        </div>

        <header className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-end">
          <div className="grid grid-cols-2 gap-4 card p-4 bg-white max-w-md w-full">
            <DateInput label="From" value={range.from} onChange={value => setRange(prev => ({ ...prev, from: value }))} />
            <DateInput label="To" value={range.to} onChange={value => setRange(prev => ({ ...prev, to: value }))} />
          </div>
        </header>

        {loading ? <DashboardSkeleton /> : error ? (
          <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-sm font-bold text-red-700 card hover:transform-none">{error}</div>
        ) : (
          <>
            <section className="mb-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <MetricCard title="Daily Revenue" value={money(daily?.totalRevenue)} icon={CalendarDays} accent="bg-orange-50 border border-orange-200/50 text-orange-700" />
              <MetricCard title="Total Revenue" value={money(summary.totalRevenue)} icon={BadgeIndianRupee} accent="bg-amber-50 border border-amber-200/55 text-amber-700" />
              <MetricCard title="Token Payments" value={money(summary.tokenRevenue)} icon={ReceiptText} accent="bg-sky-50 border border-sky-200/50 text-sky-700" />
              <MetricCard title="Full Payments" value={money(summary.fullRevenue)} icon={CircleDollarSign} accent="bg-emerald-50 border border-emerald-200/50 text-emerald-700" />
            </section>

            <section className="mb-6 grid gap-6 lg:grid-cols-3">
              <ChartPanel title="Daily Revenue Graph" subtitle="Revenue trend from successful payments" className="lg:col-span-2">
                <LineChart data={trends} />
              </ChartPanel>
              <ChartPanel title="Service Revenue" subtitle="Share by service">
                <PieChart data={services.map(item => ({ name: item.serviceName, value: item.revenue }))} />
              </ChartPanel>
            </section>

            <section className="grid gap-6 lg:grid-cols-2">
              <ChartPanel title="Barber Performance" subtitle="Revenue by barber">
                <BarChart data={barbers.map(item => ({ name: item.barberName, value: item.revenue }))} />
              </ChartPanel>
              <ChartPanel title="Service-wise Revenue" subtitle="Top earning services">
                <RevenueList rows={services.map(item => ({ name: item.serviceName, value: item.revenue, count: item.transactions }))} />
              </ChartPanel>
            </section>
          </>
        )}
      </div>
    </div>
  );
}

function DateInput({ label, value, onChange }) {
  return (
    <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">
      {label}
      <input type="date" value={value} onChange={e => onChange(e.target.value)} className="mt-2 w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2 text-sm font-medium text-zinc-800 outline-none hover:bg-zinc-100 hover:border-amber-600/50 transition" />
    </label>
  );
}

function MetricCard({ title, value, icon: Icon, accent }) {
  return (
    <div className="card p-5 flex items-center gap-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${accent}`}>
        <Icon size={24} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1">{title}</p>
        <h3 className="text-2xl font-bold text-zinc-950 font-serif leading-none truncate">{value}</h3>
      </div>
    </div>
  );
}

function ChartPanel({ title, subtitle, children, className = "" }) {
  return (
    <div className={`card p-6 ${className}`}>
      <div className="mb-6">
        <h2 className="text-base font-bold font-serif text-zinc-950">{title}</h2>
        <p className="mt-1 text-xs text-zinc-400 font-sans">{subtitle}</p>
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
    <div className="overflow-x-auto">
      <svg viewBox={`0 0 ${width} ${height}`} className="h-72 min-w-[680px]">
        {/* Grid lines */}
        {[0, 1, 2, 3].map(i => <line key={i} x1={pad} x2={width - pad} y1={pad + i * 58} y2={pad + i * 58} stroke="#ebdcd0" strokeDasharray="4,2" />)}
        {/* Area under line */}
        <polygon points={`${pad},${height - pad} ${points.join(" ")} ${width - pad},${height - pad}`} fill="#D97706" opacity="0.06" />
        {/* Line */}
        <polyline points={points.join(" ")} fill="none" stroke="#D97706" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        {/* Dots */}
        {data.map((item, index) => {
          const [x, y] = points[index].split(",").map(Number);
          return <circle key={item.date} cx={x} cy={y} r="4" fill="#D97706" stroke="#ffffff" strokeWidth="2" />;
        })}
        {/* Labels */}
        <text x={pad} y={height - 4} fill="#8c827a" fontSize="11" fontWeight="600">{data[0]?.date}</text>
        <text x={width - pad - 80} y={height - 4} fill="#8c827a" fontSize="11" fontWeight="600">{data[data.length - 1]?.date}</text>
      </svg>
    </div>
  );
}

function BarChart({ data }) {
  const max = Math.max(...data.map(item => item.value || 0), 1);
  if (!data.length) return <EmptyChart label="No barber revenue yet" />;
  return (
    <div className="space-y-4">
      {data.map(item => (
        <div key={item.name} className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-zinc-900">{item.name}</span>
            <span className="text-sm font-bold text-amber-700 font-serif">{money(item.value)}</span>
          </div>
          <div className="h-3 rounded-full bg-zinc-100 border border-zinc-200/50 overflow-hidden">
            <div className="h-3 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 transition-all" style={{ width: `${Math.max((item.value / max) * 100, 5)}%` }} />
          </div>
        </div>
      ))}
    </div>
  );
}

function PieChart({ data }) {
  const total = data.reduce((sum, item) => sum + Number(item.value || 0), 0);
  if (!total) return <EmptyChart label="No service revenue yet" />;
  let offset = 0;
  const colors = ["#B45309", "#D97706", "#F59E0B", "#FBBF24", "#FEF3C7", "#78716C"];
  return (
    <div className="flex flex-col items-center gap-5">
      <svg viewBox="0 0 42 42" className="h-52 w-52 -rotate-90">
        <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#fdfbf7" strokeWidth="7" />
        {data.map((item, index) => {
          const percent = (item.value / total) * 100;
          const segment = <circle key={item.name} cx="21" cy="21" r="15.915" fill="transparent" stroke={colors[index % colors.length]} strokeWidth="7" strokeDasharray={`${percent} ${100 - percent}`} strokeDashoffset={-offset} />;
          offset += percent;
          return segment;
        })}
      </svg>
      <RevenueList rows={data.slice(0, 4).map(item => ({ name: item.name, value: item.value }))} compact />
    </div>
  );
}

function RevenueList({ rows, compact = false }) {
  if (!rows.length) return <EmptyChart label="No rows to show" />;
  return (
    <div className="space-y-2 w-full">
      {rows.map(row => (
        <div key={row.name} className="flex items-center justify-between rounded-xl bg-amber-50/50 border border-amber-200/50 px-4 py-3 hover:bg-amber-50 transition-colors">
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-bold text-zinc-900">{row.name}</p>
            {!compact && <p className="text-xs text-zinc-400 font-sans mt-0.5">{row.count || 0} transactions</p>}
          </div>
          <p className="ml-2 font-bold text-amber-700 font-serif">{money(row.value)}</p>
        </div>
      ))}
    </div>
  );
}

function EmptyChart({ label }) {
  return <div className="flex h-48 items-center justify-center rounded-xl border border-dashed border-zinc-200 bg-white/50 text-sm font-medium text-zinc-400 italic">{label}</div>;
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-4">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-28 animate-pulse rounded-2xl bg-zinc-100/50" />)}</div>
      <div className="grid gap-6 lg:grid-cols-3"><div className="h-80 animate-pulse rounded-2xl bg-zinc-100/50 lg:col-span-2" /><div className="h-80 animate-pulse rounded-2xl bg-zinc-100/50" /></div>
      <div className="grid gap-6 lg:grid-cols-2"><div className="h-80 animate-pulse rounded-2xl bg-zinc-100/50" /><div className="h-80 animate-pulse rounded-2xl bg-zinc-100/50" /></div>
    </div>
  );
}
