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
    <div className="min-h-screen bg-orange-50 px-4 py-6 text-slate-900 md:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Modern Header Banner */}
        <div className="mb-6 rounded-2xl bg-gradient-to-r from-orange-200 to-orange-300 p-6 shadow-md relative overflow-hidden">
          <div className="relative z-10">
            <h1 className="text-2xl font-bold text-white tracking-tight">Revenue Dashboard</h1>
            <p className="text-orange-100 font-medium mt-1">Track and analyze all successful payments</p>
          </div>
          <div className="absolute right-6 top-1/2 -translate-y-1/2 opacity-10 transform rotate-12">
            <div className="w-20 h-20 border-2 border-white rounded-xl"></div>
          </div>
        </div>

        <header className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex-1"></div>
          <div className="grid grid-cols-2 gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <DateInput label="From" value={range.from} onChange={value => setRange(prev => ({ ...prev, from: value }))} />
            <DateInput label="To" value={range.to} onChange={value => setRange(prev => ({ ...prev, to: value }))} />
          </div>
        </header>

        {loading ? <DashboardSkeleton /> : error ? (
          <div className="rounded-lg border border-rose-200 bg-rose-50 p-6 text-sm font-bold text-rose-700">{error}</div>
        ) : (
          <>
            <section className="mb-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <MetricCard title="Daily Revenue" value={money(daily?.totalRevenue)} icon={CalendarDays} accent="bg-orange-50 text-orange-700" />
              <MetricCard title="Total Revenue" value={money(summary.totalRevenue)} icon={BadgeIndianRupee} accent="bg-orange-100 text-orange-700" />
              <MetricCard title="Token Payments" value={money(summary.tokenRevenue)} icon={ReceiptText} accent="bg-orange-200 text-orange-700" />
              <MetricCard title="Full Payments" value={money(summary.fullRevenue)} icon={CircleDollarSign} accent="bg-orange-300 text-orange-700" />
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
    <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
      {label}
      <input type="date" value={value} onChange={e => onChange(e.target.value)} className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-800 outline-none" />
    </label>
  );
}

function MetricCard({ title, value, icon: Icon, accent }) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${accent}`}>
        <Icon size={24} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">{title}</p>
        <h3 className="text-2xl font-bold text-gray-900 leading-none truncate">{value}</h3>
      </div>
    </div>
  );
}

function ChartPanel({ title, subtitle, children, className = "" }) {
  return (
    <div className={`rounded-2xl border border-gray-100 bg-white p-6 shadow-sm hover:shadow-md transition-shadow ${className}`}>
      <div className="mb-6">
        <h2 className="text-base font-bold text-gray-900">{title}</h2>
        <p className="mt-1 text-xs font-medium text-gray-500">{subtitle}</p>
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
        {[0, 1, 2, 3].map(i => <line key={i} x1={pad} x2={width - pad} y1={pad + i * 58} y2={pad + i * 58} stroke="#e2e8f0" strokeDasharray="4,2" />)}
        {/* Area under line */}
        <polygon points={`${pad},${height - pad} ${points.join(" ")} ${width - pad},${height - pad}`} fill="#4f46e5" opacity="0.08" />
        {/* Line */}
        <polyline points={points.join(" ")} fill="none" stroke="#4f46e5" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        {/* Dots */}
        {data.map((item, index) => {
          const [x, y] = points[index].split(",").map(Number);
          return <circle key={item.date} cx={x} cy={y} r="4" fill="#4f46e5" stroke="#ffffff" strokeWidth="2" />;
        })}
        {/* Labels */}
        <text x={pad} y={height - 4} fill="#94a3b8" fontSize="12" fontWeight="500">{data[0]?.date}</text>
        <text x={width - pad - 80} y={height - 4} fill="#94a3b8" fontSize="12" fontWeight="500">{data[data.length - 1]?.date}</text>
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
            <span className="text-sm font-bold text-gray-900">{item.name}</span>
            <span className="text-sm font-bold text-indigo-600">{money(item.value)}</span>
          </div>
          <div className="h-3 rounded-full bg-gray-200">
            <div className="h-3 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-600 transition-all" style={{ width: `${Math.max((item.value / max) * 100, 5)}%` }} />
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
  const colors = ["#4f46e5", "#0f766e", "#f59e0b", "#db2777", "#475569", "#16a34a"];
  return (
    <div className="flex flex-col items-center gap-5">
      <svg viewBox="0 0 42 42" className="h-52 w-52 -rotate-90">
        <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#f1f5f9" strokeWidth="7" />
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
    <div className="space-y-2">
      {rows.map(row => (
        <div key={row.name} className="flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3 hover:bg-gray-100 transition-colors">
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-bold text-gray-900">{row.name}</p>
            {!compact && <p className="text-xs font-medium text-gray-500">{row.count || 0} transactions</p>}
          </div>
          <p className="ml-2 font-bold text-indigo-600">{money(row.value)}</p>
        </div>
      ))}
    </div>
  );
}

function EmptyChart({ label }) {
  return <div className="flex h-48 items-center justify-center rounded-xl border-2 border-dashed border-gray-200 text-sm font-medium text-gray-400">{label}</div>;
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-4">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-28 animate-pulse rounded-2xl bg-gray-100" />)}</div>
      <div className="grid gap-6 lg:grid-cols-3"><div className="h-80 animate-pulse rounded-2xl bg-gray-100 lg:col-span-2" /><div className="h-80 animate-pulse rounded-2xl bg-gray-100" /></div>
      <div className="grid gap-6 lg:grid-cols-2"><div className="h-80 animate-pulse rounded-2xl bg-gray-100" /><div className="h-80 animate-pulse rounded-2xl bg-gray-100" /></div>
    </div>
  );
}
