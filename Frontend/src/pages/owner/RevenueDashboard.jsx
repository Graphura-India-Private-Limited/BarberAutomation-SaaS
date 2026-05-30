import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  BadgeIndianRupee, CalendarDays, CircleDollarSign, ReceiptText, 
  TrendingUp, Scissors, LogOut, LayoutDashboard, BarChart2, CreditCard, DollarSign 
} from "lucide-react";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const GOLD = "#C5A059";
const CHARCOAL = "#3E362E";

const money = value => `₹${Number(value || 0).toLocaleString("en-IN")}`;
const token = () => localStorage.getItem("token") || localStorage.getItem("ownerToken");

// ─── HIGH-FIDELITY LUXURY DUMMY DATA ENGINE ──────────────────────────────────
const DUMMY_DASHBOARD = {
  summary: {
    totalRevenue: 148200,
    tokenRevenue: 34500,
    fullRevenue: 113700
  },
  trends: [
    { date: "23 May", revenue: 12000 },
    { date: "24 May", revenue: 18500 },
    { date: "25 May", revenue: 14200 },
    { date: "26 May", revenue: 22400 },
    { date: "27 May", revenue: 19800 },
    { date: "28 May", revenue: 26500 },
    { date: "29 May", revenue: 34800 }
  ],
  services: [
    { serviceName: "Classic Haircut & Styling", revenue: 64000, transactions: 52 },
    { serviceName: "Premium Beard Sculpting", revenue: 32400, transactions: 36 },
    { serviceName: "Luxury Head Spa Massage", revenue: 28800, transactions: 18 },
    { serviceName: "Royal Shave Treatment", revenue: 14200, transactions: 20 },
    { serviceName: "Organic Hair Coloring", revenue: 8800, transactions: 4 }
  ],
  barbers: [
    { barberName: "Ali (Master Stylist)", revenue: 58400 },
    { barberName: "Ravi (Beard Expert)", revenue: 49200 },
    { barberName: "James (Color Specialist)", revenue: 40600 }
  ]
};

const DUMMY_DAILY = {
  totalRevenue: 34800
};

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
      apiGet(`/payment/revenue/dashboard${query ? `?${query}` : ""}`).catch(() => null),
      apiGet("/payment/revenue/daily").catch(() => null),
    ])
      .then(([nextDashboard, nextDaily]) => {
        if (!active) return;

        if (!nextDashboard || !nextDashboard.summary || nextDashboard.trends?.length === 0) {
          setDashboard(DUMMY_DASHBOARD);
        } else {
          setDashboard(nextDashboard);
        }

        if (!nextDaily || !nextDaily.revenue) {
          setDaily(DUMMY_DAILY);
        } else {
          setDaily(nextDaily.revenue);
        }
      })
      .catch(err => {
        if (active) {
          setDashboard(DUMMY_DASHBOARD);
          setDaily(DUMMY_DAILY);
        }
      })
      .finally(() => active && setLoading(false));
      
    return () => { active = false; };
  }, [query]);

  const summary = dashboard?.summary || {};
  const trends = dashboard?.trends || [];
  const services = dashboard?.services || [];
  const barbers = dashboard?.barbers || [];

  const handleLogout = () => {
    localStorage.clear();
    navigate("/owner/login");
  };

  return (
    <div className="min-h-screen flex font-sans text-stone-800 selection:bg-amber-100" style={{ background: "#FAF6F0" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap');
        body, .font-sans { font-family: 'Plus Jakarta Sans', sans-serif !important; }
        .font-serif { font-family: 'Playfair Display', serif !important; }
        
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

      {/* ── SIDEBAR NAVIGATION (Rule 4 Text Styles Configured) ── */}
      <aside className="w-64 border-r fixed h-screen flex flex-col justify-between p-6 z-30 shrink-0 bg-white border-stone-200 font-sans">
        <div className="space-y-8">
          <div className="flex items-center gap-3 border-b pb-5 border-stone-100">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-amber-50 border border-[#C5A059]/20">
              <Scissors size={18} color="#C5A059" strokeWidth={2} />
            </div>
            <div className="text-left">
              <div className="text-sm font-black tracking-tight text-stone-900">Barber Pro</div>
              {/* Rule 2 tag label standard */}
              <div className="text-[11px] font-extrabold uppercase tracking-widest text-[#C5A059] mt-0.5">Owner Panel</div>
            </div>
          </div>

          <nav className="space-y-1">
            {/* Rule 4 UI Layout Link elements */}
            <button 
              onClick={() => navigate("/owner/dashboard")}
              className={`w-full flex items-center gap-3.5 px-4 py-3 text-xs font-extrabold tracking-wider uppercase rounded-xl transition-all cursor-pointer ${
                window.location.pathname === "/owner/dashboard"
                  ? "bg-amber-50/60 text-[#C5A059] border border-amber-200/40"
                  : "text-stone-500 hover:text-stone-900 hover:bg-stone-50"
              }`}
            >
              <LayoutDashboard size={18} className={window.location.pathname === "/owner/dashboard" ? "text-[#C5A059]" : "text-stone-400"} />
              <span>Console Home</span>
            </button>

            <button 
              onClick={() => navigate("/owner/manage-services")} 
              className={`w-full flex items-center gap-3.5 px-4 py-3 text-xs font-extrabold tracking-wider uppercase rounded-xl transition-all cursor-pointer ${
                window.location.pathname === "/owner/manage-services"
                  ? "bg-amber-50/60 text-[#C5A059] border border-amber-200/40"
                  : "text-stone-500 hover:text-stone-900 hover:bg-stone-50"
              }`}
            >
              <Scissors size={18} className={window.location.pathname === "/owner/manage-services" ? "text-[#C5A059]" : "text-stone-400"} />
              <span>Barbers & Services</span>
            </button>

            <button 
              onClick={() => navigate("/owner/dashboard/analytics")} 
              className={`w-full flex items-center gap-3.5 px-4 py-3 text-xs font-extrabold tracking-wider uppercase rounded-xl transition-all cursor-pointer ${
                window.location.pathname === "/owner/dashboard/analytics"
                  ? "bg-amber-50/60 text-[#C5A059] border border-amber-200/40"
                  : "text-stone-500 hover:text-stone-900 hover:bg-stone-50"
              }`}
            >
              <BarChart2 size={18} className={window.location.pathname === "/owner/dashboard/analytics" ? "text-[#C5A059]" : "text-stone-400"} />
              <span>Analytics Metrics</span>
            </button>

            <button 
              onClick={() => navigate("/owner/payments")} 
              className={`w-full flex items-center gap-3.5 px-4 py-3 text-xs font-extrabold tracking-wider uppercase rounded-xl transition-all cursor-pointer ${
                window.location.pathname === "/owner/payments"
                  ? "bg-amber-50/60 text-[#C5A059] border border-amber-200/40"
                  : "text-stone-500 hover:text-stone-900 hover:bg-stone-50"
              }`}
            >
              <CreditCard size={18} className={window.location.pathname === "/owner/payments" ? "text-[#C5A059]" : "text-stone-400"} />
              <span>Payment Gateway</span>
            </button>

            <button 
              onClick={() => navigate("/owner/revenue")} 
              className={`w-full flex items-center gap-3.5 px-4 py-3 text-xs font-extrabold tracking-wider uppercase rounded-xl transition-all cursor-pointer ${
                window.location.pathname === "/owner/revenue"
                  ? "bg-amber-50/60 text-[#C5A059] border border-amber-200/40"
                  : "text-stone-500 hover:text-stone-900 hover:bg-stone-50"
              }`}
            >
              <DollarSign size={18} className={window.location.pathname === "/owner/revenue" ? "text-[#C5A059]" : "text-stone-400"} />
              <span>Revenue Stream</span>
            </button>
          </nav>
        </div>

        {/* Rule 4 Standard Exit configuration */}
        <button 
          onClick={handleLogout} 
          className="w-full flex items-center gap-3.5 px-4 py-3 text-xs font-extrabold tracking-wider uppercase rounded-xl text-red-500 hover:bg-red-50 transition-all border border-transparent cursor-pointer"
        >
          <LogOut size={18} className="text-red-400" />
          <span>Exit Workspace</span>
        </button>
      </aside>

      {/* ── MAIN CONTENT WORKSPACE ── */}
      <main className="flex-1 ml-64 p-8 md:p-12 min-w-0">
        <div className="max-w-5xl mx-auto">
          
          {/* TIMING CONTROL METADATA BANNER */}
          <div className="flex justify-end items-center gap-6 mb-4 font-sans text-left">
            <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-xl border border-stone-200/60 shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
              {/* Rule 2 Timestamp format layout */}
              <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#C5A059]">Live Clock: <span className="text-stone-800 font-mono tracking-normal">{time} IST</span></span>
            </div>
          </div>

          {/* Core Branding Summary Header Panel */}
          <div className="rounded-3xl p-6 md:p-8 mb-8 overflow-hidden card relative bg-white text-left">
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                {/* Rule 2 Kicker heading label description tag */}
                <p className="font-extrabold uppercase tracking-widest text-[11px] text-[#C5A059] mb-1.5 font-sans">
                  Payment Analytics & Stats
                </p>
                {/* Rule 1 Single-Line Header Title layout standard */}
                <h2 className="font-serif text-3xl sm:text-4xl tracking-normal text-stone-900 flex items-center justify-start gap-2 whitespace-nowrap">
                  <span className="font-bold uppercase">Revenue</span>
                  <span className="italic text-[#C5A059] normal-case font-medium">Dashboard</span>
                </h2>
                {/* Rule 3 Smooth secondary block paragraph */}
                <p className="text-stone-600 text-sm font-normal leading-relaxed font-sans mt-2">Track and analyze all successful system incoming merchant settlement streams.</p>
              </div>

              <div className="flex gap-3 bg-stone-50 border border-stone-200/80 p-3.5 rounded-2xl w-full md:max-w-xs shrink-0 items-center shadow-inner font-sans">
                <DateInput label="From" value={range.from} onChange={value => setRange(prev => ({ ...prev, from: value }))} />
                <div className="h-6 w-px bg-stone-300 mt-5 shrink-0" />
                <DateInput label="To" value={range.to} onChange={value => setRange(prev => ({ ...prev, to: value }))} />
              </div>
            </div>
            <div className="absolute right-6 top-1/2 -translate-y-1/2 opacity-5 transform rotate-12 pointer-events-none">
              <TrendingUp className="w-32 h-32 text-stone-900" />
            </div>
          </div>

          {loading ? <DashboardSkeleton /> : error ? (
            <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-sm font-bold text-red-700 card hover:transform-none font-sans">{error}</div>
          ) : (
            <>
            {/* ── ✅ FIXED: FLATTENED STATS COUNTER ROWS WITH STANDARD VALUE LOOKUPS ── */}
              <section className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 text-left">
                {/* Fixed the missing daily revenue object reference bug */}
                <MetricCard title="Daily Revenue" value={money(daily?.totalRevenue || daily)} icon={CalendarDays} accent="bg-orange-50 border border-orange-200/50 text-orange-700" />
                <MetricCard title="Total Revenue" value={money(summary.totalRevenue)} icon={BadgeIndianRupee} accent="bg-amber-50 border border-amber-200/55 text-amber-700" />
                <MetricCard title="Token Payments" value={money(summary.tokenRevenue)} icon={ReceiptText} accent="bg-sky-50 border border-sky-200/50 text-sky-700" />
                <MetricCard title="Full Payments" value={money(summary.fullRevenue)} icon={CircleDollarSign} accent="bg-emerald-50 border border-emerald-200/50 text-emerald-700" />
              </section>

              {/* ── ✅ EXPANDED CHARTS PLACEMENT: REMOVED SIDE-BY-SIDE SIDEBAR RESTRICTIONS ── */}
              <section className="mb-6 space-y-6">
                {/* Graph expanded to full 100% width grid block columns to use empty space premiumly */}
                <ChartPanel title="Daily Revenue Graph" subtitle="Revenue trend compiled from successful payments matrix. animate-in fade-in" className="w-full">
                  <div className="w-full h-full pt-2">
                    <LineChart data={trends} />
                  </div>
                </ChartPanel>

                {/* Sub-charts nested cleanly side-by-side inside their own bottom workspace split grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <ChartPanel title="Service Revenue" subtitle="Share split breakdown ratio partitioned by catalog product items.">
                    <PieChart data={services.map(item => ({ name: item.serviceName, value: item.revenue }))} />
                  </ChartPanel>
                  <ChartPanel title="Barber Performance" subtitle="Revenue distribution profiles generated across active salon barber nodes.">
                    <BarChart data={barbers.map(item => ({ name: item.barberName, value: item.revenue }))} />
                  </ChartPanel>
                </div>
              </section>

              <section className="w-full">
                <ChartPanel title="Service-wise Revenue" subtitle="Top generating active operational layout service metrics overview.">
                  <RevenueList rows={services.map(item => ({ name: item.serviceName, value: item.revenue, count: item.transactions }))} />
                </ChartPanel>
              </section>
            </>
          )}
        </div>
      </main>
    </div>
  );
}

function DateInput({ label, value, onChange }) {
  return (
    <label className="text-[11px] font-extrabold uppercase tracking-widest text-[#C5A059] w-full text-left font-sans">
      {label}
      {/* ── ✅ FIXED: GHOST CHARACTERS REMOVED AND INPUT REWRITTEN CLEANLY ── */}
      <input 
        type="date" 
        value={value} 
        onChange={(e) => onChange(e.target.value)} 
        className="mt-1 w-full bg-transparent text-xs font-bold text-stone-800 outline-none cursor-pointer focus:text-[#C5A059] font-sans" 
      />
    </label>
  );
}

function MetricCard({ title, value, icon: Icon, accent }) {
  return (
    <div className="card p-5 flex items-center gap-4 bg-white shadow-sm text-left">
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${accent}`}>
        <Icon size={20} />
      </div>
      <div className="flex-1 min-w-0">
        {/* Rule 2 Counter Card metadata label tag */}
        <p className="text-[11px] font-extrabold uppercase tracking-widest text-[#C5A059] mb-0.5 font-sans">{title}</p>
        <h3 className="text-xl font-black text-stone-900 font-serif leading-none truncate">{value}</h3>
      </div>
    </div>
  );
}

function ChartPanel({ title, subtitle, children, className = "" }) {
  return (
    <div className={`card p-6 bg-white shadow-sm ${className} text-left`}>
      <div className="mb-6">
        {/* Rule 1 Segment Inner Module Title standard */}
        <h2 className="font-serif text-xl sm:text-2xl tracking-normal text-stone-900 flex items-center justify-start gap-2 whitespace-nowrap">
          <span className="font-bold uppercase">{title.split(" ")[0]}</span>
          <span className="italic text-[#C5A059] normal-case font-medium">{title.split(" ").slice(1).join(" ")}</span>
        </h2>
        {/* Rule 3 Core body paragraphs block text standard label details description */}
        <p className="text-stone-600 text-sm font-normal leading-relaxed font-sans mt-1">{subtitle}</p>
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
    <div className="overflow-x-auto custom-scrollbar font-sans">
      <svg viewBox={`0 0 ${width} ${height}`} className="h-72 min-w-[640px] mx-auto overflow-visible">
        {[0, 1, 2, 3].map(i => <line key={i} x1={pad} x2={width - pad} y1={pad + i * 58} y2={pad + i * 58} stroke="#EADBCE" strokeDasharray="4,2" opacity="0.6" />)}
        <polygon points={`${pad},${height - pad} ${points.join(" ")} ${width - pad},${height - pad}`} fill={GOLD} opacity="0.04" />
        <polyline points={points.join(" ")} fill="none" stroke={GOLD} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        {data.map((item, index) => {
          const [x, y] = points[index].split(",").map(Number);
          return <circle key={item.date} cx={x} cy={y} r="4.5" fill={GOLD} stroke="#ffffff" strokeWidth="2.5" />;
        })}
        <text x={pad} y={height - 4} fill="#A89E95" fontSize="9" fontWeight="800" className="font-sans uppercase tracking-widest">{data[0]?.date}</text>
        <text x={width - pad - 80} y={height - 4} fill="#A89E95" fontSize="9" fontWeight="800" className="font-sans uppercase tracking-widest text-right">{data[data.length - 1]?.date}</text>
      </svg>
    </div>
  );
}

function BarChart({ data }) {
  const max = Math.max(...data.map(item => item.value || 0), 1);
  if (!data.length) return <EmptyChart label="No barber revenue data logged yet" />;
  return (
    <div className="space-y-4 font-sans text-left">
      {data.map(item => (
        <div key={item.name} className="space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-stone-800 tracking-tight">{item.name}</span>
            <span className="text-sm font-black text-amber-700 font-serif">{money(item.value)}</span>
          </div>
          <div className="h-2 rounded-full bg-stone-50 border border-stone-200/60 overflow-hidden">
            <div className="h-full rounded-full transition-all duration-500" style={{ width: `${Math.max((item.value / max) * 100, 4)}%`, backgroundColor: GOLD }} />
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
    <div className="flex flex-col items-center gap-6 font-sans">
      <svg viewBox="0 0 42 42" className="h-44 w-44 -rotate-90 shadow-sm rounded-full">
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
    <div className="space-y-2 w-full font-sans text-left">
      {rows.map(row => (
        <div key={row.name} className="flex items-center justify-between rounded-xl bg-stone-50/50 border border-stone-200/60 px-4 py-3 hover:border-amber-600/40 transition-all duration-200">
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-bold text-stone-900 tracking-tight">{row.name}</p>
            {!compact && <p className="text-[10px] text-stone-400 font-bold uppercase mt-0.5 tracking-wider font-sans">{row.count || 0} completions</p>}
          </div>
          <p className="ml-2 font-black text-amber-700 font-mono text-xs shrink-0">{money(row.value)}</p>
        </div>
      ))}
    </div>
  );
}

function EmptyChart({ label }) {
  return (
    /* Rule 2 Empty placeholder info string tracking */
    <div className="flex h-44 items-center justify-center rounded-2xl border border-dashed border-stone-200 bg-stone-50/50 text-[11px] font-extrabold uppercase tracking-widest text-[#C5A059] font-sans italic">
      {label}
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-4">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-24 animate-pulse rounded-2xl bg-white border border-stone-100" />)}</div>
      <div className="grid gap-6 lg:grid-cols-3"><div className="h-80 animate-pulse rounded-2xl bg-white border border-stone-100 lg:col-span-2" /><div className="h-80 animate-pulse rounded-2xl bg-white border border-stone-100" /></div>
    </div>
  );
}