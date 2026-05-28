import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Calendar, ChevronLeft, ChevronRight, CreditCard, RefreshCw, 
  Search, X, Scissors, LogOut, LayoutDashboard, BarChart2, DollarSign 
} from "lucide-react";
import Navbar from "../../Components/layout/Navbar";
import Footer from "../../Components/layout/Footer";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const GOLD = "#C5A059";
const CHARCOAL = "#3E362E";

const money = value => `₹${Number(value || 0).toLocaleString("en-IN")}`;
const fmtDate = value => (value ? new Date(value).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" }) : "-");

const statusClass = {
  SUCCESS: "bg-emerald-50 text-emerald-700 border-emerald-200/60 font-bold",
  PENDING: "bg-amber-50 text-amber-700 border-amber-200/60 font-bold",
  FAILED: "bg-rose-50 text-rose-700 border-rose-200/60 font-bold",
  REFUNDED: "bg-zinc-100 text-zinc-700 border-zinc-200/60 font-bold",
};

function getToken() {
  return localStorage.getItem("token") || localStorage.getItem("ownerToken");
}

async function apiGet(path) {
  const res = await fetch(`${API}${path}`, { headers: { Authorization: `Bearer ${getToken()}` } });
  const data = await res.json();
  if (!data.success) throw new Error(data.message || "Request failed");
  return data;
}

export default function PaymentDashboard() {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({ paymentType: "ALL", status: "ALL", date: "", barberId: "", q: "" });
  const [page, setPage] = useState(1);
  const [data, setData] = useState({ payments: [], pagination: { page: 1, pages: 1, total: 0 } });
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState("");
  const [error, setError] = useState("");
  const [time, setTime] = useState(new Date().toLocaleTimeString("en-IN", { hour: '2-digit', minute: '2-digit' }));

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date().toLocaleTimeString("en-IN", { hour: '2-digit', minute: '2-digit' }));
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  const params = useMemo(() => {
    const query = new URLSearchParams({ page, limit: 10 });
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== "ALL") query.set(key, value);
    });
    return query.toString();
  }, [filters, page]);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError("");
    apiGet(`/payment?${params}`)
      .then(next => active && setData(next))
      .catch(err => active && setError(err.message))
      .finally(() => active && setLoading(false));
    return () => { active = false; };
  }, [params]);

  const barbers = useMemo(() => {
    const map = new Map();
    data.payments.forEach(payment => {
      if (payment.barber_id?._id) map.set(payment.barber_id._id, payment.barber_id.name);
    });
    return Array.from(map, ([id, name]) => ({ id, name }));
  }, [data.payments]);

  const updateFilter = (name, value) => {
    setFilters(prev => ({ ...prev, [name]: value }));
    setPage(1);
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/owner/login");
  };

  const retryPayment = async payment => {
    try {
      const res = await fetch(`${API}/payment/${payment._id}/retry`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
      });
      const next = await res.json();
      if (!next.success) throw new Error(next.message || "Retry failed");
      setToast("Retry order created.");
    } catch (err) {
      setToast(err.message);
    }
  };

  return (
   <div className="min-h-screen flex flex-col">

    <Navbar />

    <div className="flex-1 flex font-sans text-stone-800 selection:bg-amber-100" style={{ background: "#FAF6F0" }}>
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
      
      {toast && <Toast message={toast} onClose={() => setToast("")} />}

  {/* ── MATCHING SIDEBAR NAVIGATION ── */}
      <aside className="w-64 border-r sticky top-0 self-start h-screen flex flex-col justify-between p-6 z-30 shrink-0 bg-white border-stone-200">
        <div className="space-y-8">
          {/* Logo Centerpiece */}
          <div className="flex items-center gap-3 border-b pb-5 border-stone-100">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-amber-50 border border-[#C5A059]/20">
              <Scissors size={18} color="#C5A059" strokeWidth={2} />
            </div>
            <div>
              <div className="text-sm font-black tracking-tight text-stone-900">
                Barber Pro
              </div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-stone-400 mt-0.5">Owner Panel</div>
            </div>
          </div>

          {/* Navigation Links Framework */}
          <nav className="space-y-1">
            <button 
              onClick={() => navigate("/owner/dashboard")}
              className={`w-full flex items-center gap-3.5 px-4 py-3 text-xs font-bold tracking-wide rounded-xl transition-all ${
                window.location.pathname === "/owner/dashboard"
                  ? "bg-amber-50/60 text-[#C5A059] border border-amber-200/40 font-extrabold"
                  : "text-stone-500 hover:text-stone-900 hover:bg-stone-50"
              }`}
            >
              <LayoutDashboard size={18} className={window.location.pathname === "/owner/dashboard" ? "text-[#C5A059]" : "text-stone-400"} />
              <span>Console Home</span>
            </button>

            <button 
              onClick={() => navigate("/owner/manage-services")} 
              className={`w-full flex items-center gap-3.5 px-4 py-3 text-xs font-bold tracking-wide rounded-xl transition-all ${
                window.location.pathname === "/owner/manage-services"
                  ? "bg-amber-50/60 text-[#C5A059] border border-amber-200/40 font-extrabold"
                  : "text-stone-500 hover:text-stone-900 hover:bg-stone-50"
              }`}
            >
              <Scissors size={18} className={window.location.pathname === "/owner/manage-services" ? "text-[#C5A059]" : "text-stone-400"} />
              <span>Barbers & Services</span>
            </button>

            <button 
              onClick={() => navigate("/owner/dashboard/analytics")} 
              className={`w-full flex items-center gap-3.5 px-4 py-3 text-xs font-bold tracking-wide rounded-xl transition-all ${
                window.location.pathname === "/owner/dashboard/analytics"
                  ? "bg-amber-50/60 text-[#C5A059] border border-amber-200/40 font-extrabold"
                  : "text-stone-500 hover:text-stone-900 hover:bg-stone-50"
              }`}
            >
              <BarChart2 size={18} className={window.location.pathname === "/owner/dashboard/analytics" ? "text-[#C5A059]" : "text-stone-400"} />
              <span>Analytics Metrics</span>
            </button>

            <button 
              onClick={() => navigate("/owner/payments")} 
              className={`w-full flex items-center gap-3.5 px-4 py-3 text-xs font-bold tracking-wide rounded-xl transition-all ${
                window.location.pathname === "/owner/payments"
                  ? "bg-amber-50/60 text-[#C5A059] border border-amber-200/40 font-extrabold"
                  : "text-stone-500 hover:text-stone-900 hover:bg-stone-50"
              }`}
            >
              <CreditCard size={18} className={window.location.pathname === "/owner/payments" ? "text-[#C5A059]" : "text-stone-400"} />
              <span>Payment Gateway</span>
            </button>

            <button 
              onClick={() => navigate("/owner/revenue")} 
              className={`w-full flex items-center gap-3.5 px-4 py-3 text-xs font-bold tracking-wide rounded-xl transition-all ${
                window.location.pathname === "/owner/revenue"
                  ? "bg-amber-50/60 text-[#C5A059] border border-amber-200/40 font-extrabold"
                  : "text-stone-500 hover:text-stone-900 hover:bg-stone-50"
              }`}
            >
              <DollarSign size={18} className={window.location.pathname === "/owner/revenue" ? "text-[#C5A059]" : "text-stone-400"} />
              <span>Revenue Stream</span>
            </button>
          </nav>
        </div>

        {/* System Exit Button */}
        <button 
          onClick={handleLogout} 
          className="w-full flex items-center gap-3.5 px-4 py-3 text-xs font-bold tracking-wide rounded-xl text-red-500 hover:bg-red-50 transition-all border border-transparent"
        >
          <LogOut size={18} className="text-red-400" />
          <span>Exit Workspace</span>
        </button>
      </aside>

      {/* ── MAIN CONTENT WORKSPACE ── */}
      <main className="flex-1 p-8 md:p-12 min-w-0">
        <div className="max-w-5xl mx-auto">
          
          {/* ── SYSTEM TIMING & LOGOUT ACTIONS CONTAINER ── */}
          <div className="flex justify-end items-center gap-6 mb-4 text-xs font-bold text-stone-400 uppercase tracking-wider">
            <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-xl border border-stone-200/60 shadow-sm">
              <ClockIcon />
              <span>System Clock: <span className="text-stone-800 font-mono">{time} IST</span></span>
            </div>
          </div>

          {/* ── CONTEXT HEADER TITLE CARD ── */}
          <div className="relative rounded-3xl p-6 md:p-8 mb-8 overflow-hidden card">
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <p className="font-black tracking-[0.2em] text-[10px] uppercase mb-1.5" style={{ color: GOLD }}>
                  Finances & Razorpay Integration
                </p>
                <h1 className="text-3xl lg:text-4xl font-black font-serif tracking-tight text-stone-900">Payment Management</h1>
                <p className="text-stone-400 mt-2 text-sm font-medium">Track token installments, fully captured orders, and pending deposits processed through Razorpay.</p>
              </div>
              <button 
                onClick={() => setPage(1)} 
                className="inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3.5 text-xs font-black tracking-widest uppercase text-white shadow-md active:scale-[0.98] transition-all duration-200 self-start md:self-center cursor-pointer hover:opacity-90"
                style={{ background: CHARCOAL }}
              >
                <RefreshCw size={14} color={GOLD} /> Refresh Ledger
              </button>
            </div>
            <div className="absolute right-6 top-1/2 -translate-y-1/2 opacity-5 transform rotate-12 pointer-events-none">
              <CreditCard className="w-32 h-32 text-stone-900" />
            </div>
          </div>

          {/* ── FILTER UTILITY SECTION ── */}
          <section className="mb-6 grid gap-4 p-5 card md:grid-cols-5 bg-white shadow-sm">
            <FilterSelect label="Type" value={filters.paymentType} onChange={value => updateFilter("paymentType", value)} options={["ALL", "TOKEN", "FULL"]} />
            <FilterSelect label="Status" value={filters.status} onChange={value => updateFilter("status", value)} options={["ALL", "PENDING", "SUCCESS", "FAILED", "REFUNDED"]} />
            
            <label className="text-[10px] font-black uppercase tracking-wider text-stone-400">
              Target Date
              <div className="mt-2 flex items-center gap-2 rounded-xl border border-stone-200 bg-stone-50/50 px-3 py-2.5 hover:bg-white focus-within:border-[#C5A059] focus-within:bg-white transition-all">
                <Calendar size={15} className="text-stone-400" />
                <input type="date" value={filters.date} onChange={e => updateFilter("date", e.target.value)} className="w-full bg-transparent text-xs outline-none text-stone-800 font-bold" />
              </div>
            </label>

            <FilterSelect
              label="Barber Assignee"
              value={filters.barberId}
              onChange={value => updateFilter("barberId", value)}
              options={[{ id: "", name: "All Barbers" }, ...barbers]}
              objectOptions
            />

            <label className="text-[10px] font-black uppercase tracking-wider text-stone-400">
              ID Search Query
              <div className="mt-2 flex items-center gap-2 rounded-xl border border-stone-200 bg-stone-50/50 px-3 py-2.5 hover:bg-white focus-within:border-[#C5A059] focus-within:bg-white transition-all">
                <Search size={15} className="text-stone-400" />
                <input value={filters.q} onChange={e => updateFilter("q", e.target.value)} placeholder="Order or payment ID" className="w-full bg-transparent text-xs outline-none text-stone-800 font-bold placeholder-stone-400" />
              </div>
            </label>
          </section>

          {/* ── LEDGER ROW ENGINE ── */}
          <section className="card overflow-hidden bg-white shadow-sm">
            <div className="hidden grid-cols-[1.4fr_1fr_1fr_1fr_1fr_0.8fr] border-b border-stone-100 bg-stone-50/50 px-6 py-4 text-[10px] font-black uppercase tracking-wider text-stone-400 md:grid">
              <span>Transaction Reference</span><span>Customer</span><span>Barber</span><span>Amount</span><span>Status</span><span className="text-right">Action</span>
            </div>
            
            <div className="divide-y divide-stone-50">
              {loading ? <SkeletonRows /> : error ? <EmptyState title="Could not load payments" subtitle={error} /> : data.payments.length === 0 ? <EmptyState title="No payments found" subtitle="Try clearing filters or selecting a wider date range." /> : (
                data.payments.map(payment => (
                  <PaymentRow key={payment._id} payment={payment} onOpen={() => setSelected(payment)} onRetry={() => retryPayment(payment)} />
                ))
              )}
            </div>
          </section>

          {/* ── PAGINATION SYSTEM ── */}
          <div className="mt-6 flex items-center justify-between px-2">
            <p className="text-xs font-bold text-stone-400 uppercase tracking-wide">{data.pagination.total || 0} transactions logged</p>
            <div className="flex items-center gap-3">
              <button disabled={page <= 1} onClick={() => setPage(page - 1)} className="rounded-xl border border-stone-200 bg-white p-2 text-stone-600 hover:bg-stone-50 disabled:opacity-30 disabled:cursor-not-allowed shadow-sm transition-all cursor-pointer"><ChevronLeft size={16} /></button>
              <span className="text-xs font-black text-stone-900 font-mono tracking-tight">Page {page} of {data.pagination.pages || 1}</span>
              <button disabled={page >= (data.pagination.pages || 1)} onClick={() => setPage(page + 1)} className="rounded-xl border border-stone-200 bg-white p-2 text-stone-600 hover:bg-stone-50 disabled:opacity-30 disabled:cursor-not-allowed shadow-sm transition-all cursor-pointer"><ChevronRight size={16} /></button>
            </div>
          </div>

        </div>
      </main>

      {/* ── SIDE PANEL DATA DIALOGUE OVERLAY ── */}
      {selected && <TransactionModal payment={selected} onClose={() => setSelected(null)} />}
    </div>
    <Footer />
    </div>
  );
}

function ClockIcon() {
  return (
    <svg className="w-3.5 h-3.5 text-stone-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2m6-2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function FilterSelect({ label, value, onChange, options, objectOptions = false }) {
  return (
    <label className="text-[10px] font-black uppercase tracking-wider text-stone-400">
      {label}
      <select value={value} onChange={e => onChange(e.target.value)} className="mt-2 w-full bg-stone-50/50 border border-stone-200 rounded-xl px-3 py-2.5 text-xs font-bold text-stone-700 outline-none hover:bg-white focus:border-[#C5A059] focus:bg-white transition cursor-pointer">
        {options.map(option => objectOptions ? (
          <option key={option.id} value={option.id}>{option.name}</option>
        ) : <option key={option} value={option}>{option}</option>)}
      </select>
    </label>
  );
}

function PaymentRow({ payment, onOpen, onRetry }) {
  return (
    <div className="grid gap-3 p-6 md:grid-cols-[1.4fr_1fr_1fr_1fr_1fr_0.8fr] md:items-center hover:bg-stone-50/30 transition-colors group">
      <div>
        <p className="font-bold font-serif text-stone-900 text-sm truncate max-w-[200px]">{payment.razorpay_order_id || "Pending order intent"}</p>
        <p className="mt-1 text-[11px] text-stone-400 font-medium font-sans">{fmtDate(payment.created_at)}</p>
      </div>
      <p className="text-sm font-bold text-stone-900 tracking-tight">{payment.customer_id?.name || "Customer Walk-in"}</p>
      <p className="text-xs font-bold text-stone-500 tracking-wide">{payment.barber_id?.name || "Unassigned"}</p>
      <div>
        <p className="font-black text-stone-900 font-mono text-sm">{money(payment.amount)}</p>
        <p className="text-[9px] font-black text-amber-800 uppercase bg-amber-50 border border-amber-200/40 px-2 py-0.5 rounded inline-block mt-1.5 tracking-widest">{payment.payment_type}</p>
      </div>
      <div>
        <span className={`w-max rounded-md border px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider ${statusClass[payment.status] || statusClass.PENDING}`}>{payment.status}</span>
      </div>
      <div className="flex justify-start gap-2 md:justify-end border-t md:border-0 pt-3 md:pt-0 border-stone-100">
        <button onClick={onOpen} className="rounded-xl border border-stone-200 bg-white px-4 py-2 text-xs font-bold text-stone-700 hover:border-stone-400 shadow-sm transition-all cursor-pointer">View</button>
        {payment.status === "FAILED" && <button onClick={onRetry} className="rounded-xl hover:opacity-95 px-4 py-2 text-xs font-bold text-white shadow-md transition-all cursor-pointer" style={{ background: CHARCOAL }}>Retry</button>}
      </div>
    </div>
  );
}

function TransactionModal({ payment, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end bg-stone-900/40 backdrop-blur-sm p-0 md:items-center md:justify-center md:p-6 animate-in fade-in duration-200">
      <div className="w-full max-w-xl rounded-t-3xl bg-white p-6 shadow-2xl md:rounded-2xl border border-stone-200 flex flex-col justify-start">
        <div className="mb-6 flex items-center justify-between pb-4 border-b border-stone-100">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-stone-50 border border-stone-200 p-3" style={{ color: GOLD }}><CreditCard size={20} /></div>
            <div>
              <h2 className="text-lg font-black font-serif text-stone-900 tracking-tight">Transaction Details</h2>
              <p className="text-[10px] text-stone-400 font-mono font-bold mt-0.5">{payment.razorpay_payment_id || "Payment mapping pending capture"}</p>
            </div>
          </div>
          <button onClick={onClose} className="rounded-xl border border-stone-200 bg-stone-50 text-stone-400 p-2 hover:text-stone-600 hover:bg-stone-100 transition-all cursor-pointer"><X size={16} /></button>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <Detail label="Amount Captured" value={money(payment.amount)} highlight />
          <Detail label="Gateway Status" value={payment.status} />
          <Detail label="Payment Type" value={payment.payment_type} />
          <Detail label="Booking Mode" value={payment.booking_type} />
          <Detail label="Client Profile" value={payment.customer_id?.name || "-"} />
          <Detail label="Assigned Stylist" value={payment.barber_id?.name || "Unassigned"} />
          <Detail label="Razorpay Order ID" value={payment.razorpay_order_id || "-"} />
          <Detail label="Timestamp Logged" value={fmtDate(payment.created_at)} />
        </div>
      </div>
    </div>
  );
}

function Detail({ label, value, highlight = false }) {
  return (
    <div className="bg-[#FAF6F0]/60 rounded-xl p-4 border border-[#EADBCE]/60 transition-all">
      <p className="text-[9px] font-black uppercase tracking-wider text-stone-400">{label}</p>
      <p className={`mt-1.5 break-words text-sm font-bold ${highlight ? 'font-mono text-stone-900 text-base' : 'text-stone-900'}`}>{value}</p>
    </div>
  );
}

function SkeletonRows() {
  return Array.from({ length: 3 }).map((_, index) => <div key={index} className="border-b border-stone-50 p-6"><div className="h-5 w-1/3 animate-pulse rounded bg-stone-100" /><div className="mt-3 h-3 w-1/2 animate-pulse rounded bg-stone-100/60" /></div>);
}

function EmptyState({ title, subtitle }) {
  return <div className="p-14 text-center"><p className="text-md font-black font-serif text-stone-900 tracking-tight">{title}</p><p className="mt-1.5 text-xs font-medium text-stone-400">{subtitle}</p></div>;
}

function Toast({ message, onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);
  return <div className="fixed right-4 top-6 z-50 rounded-xl bg-stone-900 px-5 py-3.5 text-xs font-black uppercase tracking-widest text-white shadow-xl">{message}</div>;
}