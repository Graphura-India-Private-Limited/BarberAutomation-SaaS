import React, { useEffect, useMemo, useState } from "react";
import { Calendar, ChevronLeft, ChevronRight, CreditCard, RefreshCw, Search, X, Scissors, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
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
    navigate("/login");
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
      
      {toast && <Toast message={toast} onClose={() => setToast("")} />}

      {/* ── STICKY TOP PLATFORM HEADER (No margin, sits perfectly at the top edge) ── */}
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

      {/* ── MAIN CONTENT GRID WITH PROPER PADDING ── */}
      <main className="mx-auto max-w-7xl px-4 py-8 md:px-8">
        
        {/* ── CONTEXT HEADER TITLE CARD ── */}
        <div className="relative rounded-3xl p-8 mb-6 overflow-hidden card">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <p className="text-amber-700 font-bold tracking-[0.2em] text-xs uppercase mb-1">
                Finances & Razorpay Integration
              </p>
              <h1 className="text-3xl lg:text-4xl font-black font-serif tracking-tight text-stone-900">Payment Management</h1>
              <p className="text-stone-500 mt-2 text-sm">Track token installments, fully captured orders, and pending deposits processed through Razorpay.</p>
            </div>
            <button onClick={() => setPage(1)} className="inline-flex items-center justify-center gap-2 rounded-xl bg-amber-600 hover:bg-amber-700 px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-white shadow-md active:scale-[0.98] transition-all duration-200 self-start md:self-center cursor-pointer">
              <RefreshCw size={15} /> Refresh Data
            </button>
          </div>
          <div className="absolute right-6 top-1/2 -translate-y-1/2 opacity-5 transform rotate-12 pointer-events-none">
            <CreditCard className="w-32 h-32 text-amber-700" />
          </div>
        </div>

        {/* ── FILTER UTILITY SECTION ── */}
        <section className="mb-6 grid gap-4 p-5 card md:grid-cols-5">
          <FilterSelect label="Type" value={filters.paymentType} onChange={value => updateFilter("paymentType", value)} options={["ALL", "TOKEN", "FULL"]} />
          <FilterSelect label="Status" value={filters.status} onChange={value => updateFilter("status", value)} options={["ALL", "PENDING", "SUCCESS", "FAILED", "REFUNDED"]} />
          
          <label className="text-xs font-bold uppercase tracking-wider text-stone-500">
            Date
            <div className="mt-2 flex items-center gap-2 rounded-xl border border-stone-200 bg-stone-50 px-3 py-2.5 hover:bg-stone-100 focus-within:border-amber-600 transition-all">
              <Calendar size={16} className="text-stone-400" />
              <input type="date" value={filters.date} onChange={e => updateFilter("date", e.target.value)} className="w-full bg-transparent text-sm outline-none text-stone-800 font-medium" />
            </div>
          </label>

          <FilterSelect
            label="Barber"
            value={filters.barberId}
            onChange={value => updateFilter("barberId", value)}
            options={[{ id: "", name: "All Barbers" }, ...barbers]}
            objectOptions
          />

          <label className="text-xs font-bold uppercase tracking-wider text-stone-500">
            Search
            <div className="mt-2 flex items-center gap-2 rounded-xl border border-stone-200 bg-stone-50 px-3 py-2.5 hover:bg-stone-100 focus-within:border-amber-600 transition-all">
              <Search size={16} className="text-stone-400" />
              <input value={filters.q} onChange={e => updateFilter("q", e.target.value)} placeholder="Order or payment id" className="w-full bg-transparent text-sm outline-none text-stone-800 font-medium placeholder-stone-400" />
            </div>
          </label>
        </section>

        {/* ── LEDGER ROW ENGINE ── */}
        <section className="card overflow-hidden bg-white">
          <div className="hidden grid-cols-[1.4fr_1fr_1fr_1fr_1fr_0.8fr] border-b border-stone-100 bg-stone-50/50 px-6 py-4.5 text-xs font-bold uppercase tracking-wider text-stone-500 md:grid">
            <span>Transaction Reference</span><span>Customer</span><span>Barber</span><span>Amount</span><span>Status</span><span className="text-right">Action</span>
          </div>
          
          <div className="divide-y divide-stone-100">
            {loading ? <SkeletonRows /> : error ? <EmptyState title="Could not load payments" subtitle={error} /> : data.payments.length === 0 ? <EmptyState title="No payments found" subtitle="Try clearing filters or selecting a wider date range." /> : (
              data.payments.map(payment => (
                <PaymentRow key={payment._id} payment={payment} onOpen={() => setSelected(payment)} onRetry={() => retryPayment(payment)} />
              ))
            )}
          </div>
        </section>

        {/* ── PAGINATION SYSTEM ── */}
        <div className="mt-6 flex items-center justify-between px-2">
          <p className="text-sm font-bold text-stone-500 font-sans">{data.pagination.total || 0} transactions logged</p>
          <div className="flex items-center gap-3">
            <button disabled={page <= 1} onClick={() => setPage(page - 1)} className="rounded-xl border border-stone-200 bg-white p-2.5 text-stone-600 hover:bg-stone-50 disabled:opacity-30 disabled:cursor-not-allowed shadow-sm transition-all cursor-pointer"><ChevronLeft size={18} /></button>
            <span className="text-sm font-bold text-stone-950 font-serif">Page {page} of {data.pagination.pages || 1}</span>
            <button disabled={page >= (data.pagination.pages || 1)} onClick={() => setPage(page + 1)} className="rounded-xl border border-stone-200 bg-white p-2.5 text-stone-600 hover:bg-stone-50 disabled:opacity-30 disabled:cursor-not-allowed shadow-sm transition-all cursor-pointer"><ChevronRight size={18} /></button>
          </div>
        </div>

      </main>

      {/* ── SIDE PANEL DATA DIALOGUE OVERLAY ── */}
      {selected && <TransactionModal payment={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}

function FilterSelect({ label, value, onChange, options, objectOptions = false }) {
  return (
    <label className="text-xs font-bold uppercase tracking-wider text-stone-500">
      {label}
      <select value={value} onChange={e => onChange(e.target.value)} className="mt-2 w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2.5 text-sm font-medium text-stone-800 outline-none hover:bg-stone-100 transition cursor-pointer">
        {options.map(option => objectOptions ? (
          <option key={option.id} value={option.id}>{option.name}</option>
        ) : <option key={option} value={option}>{option}</option>)}
      </select>
    </label>
  );
}

function PaymentRow({ payment, onOpen, onRetry }) {
  return (
    <div className="grid gap-3 p-6 md:grid-cols-[1.4fr_1fr_1fr_1fr_1fr_0.8fr] md:items-center hover:bg-stone-50/60 transition-colors">
      <div>
        <p className="font-bold font-serif text-stone-900 text-base truncate max-w-[220px]">{payment.razorpay_order_id || "Pending order intent"}</p>
        <p className="mt-1 text-xs text-stone-400 font-sans">{fmtDate(payment.created_at)}</p>
      </div>
      <p className="text-sm font-bold text-stone-800">{payment.customer_id?.name || "Customer Walk-in"}</p>
      <p className="text-sm font-medium text-stone-500">{payment.barber_id?.name || "Unassigned"}</p>
      <div>
        <p className="font-bold text-stone-900 font-serif text-base">{money(payment.amount)}</p>
        <p className="text-[10px] font-bold text-amber-800 uppercase bg-amber-50 border border-amber-200/60 px-2.5 py-0.5 rounded-full inline-block mt-1.5 tracking-wider">{payment.payment_type}</p>
      </div>
      <div>
        <span className={`w-max rounded-full border px-3 py-1 text-xs font-bold ${statusClass[payment.status] || statusClass.PENDING}`}>{payment.status}</span>
      </div>
      <div className="flex justify-start gap-2 md:justify-end">
        <button onClick={onOpen} className="rounded-xl border border-stone-200 bg-white px-4 py-2 text-xs font-bold text-stone-700 hover:bg-stone-50 shadow-sm transition-all cursor-pointer">View</button>
        {payment.status === "FAILED" && <button onClick={onRetry} className="rounded-xl bg-amber-600 hover:bg-amber-700 px-4 py-2 text-xs font-bold text-white shadow-md transition-all cursor-pointer">Retry</button>}
      </div>
    </div>
  );
}

function TransactionModal({ payment, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end bg-stone-900/40 backdrop-blur-sm p-0 md:items-center md:justify-center md:p-6">
      <div className="w-full max-w-2xl rounded-t-3xl bg-white p-6 shadow-2xl md:rounded-3xl card hover:transform-none">
        <div className="mb-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-amber-50 border border-amber-100 p-3 text-amber-600"><CreditCard size={22} /></div>
            <div>
              <h2 className="text-xl font-bold font-serif text-stone-900">Transaction Details</h2>
              <p className="text-xs text-stone-400 font-sans mt-0.5">{payment.razorpay_payment_id || "Payment mapping pending capture"}</p>
            </div>
          </div>
          <button onClick={onClose} className="rounded-xl border border-stone-200 bg-stone-50 text-stone-400 p-2 hover:text-stone-600 hover:bg-stone-100 transition-all cursor-pointer"><X size={18} /></button>
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          <Detail label="Amount" value={money(payment.amount)} highlight />
          <Detail label="Status" value={payment.status} />
          <Detail label="Payment Type" value={payment.payment_type} />
          <Detail label="Booking Type" value={payment.booking_type} />
          <Detail label="Customer" value={payment.customer_id?.name || "-"} />
          <Detail label="Barber" value={payment.barber_id?.name || "Unassigned"} />
          <Detail label="Order ID" value={payment.razorpay_order_id || "-"} />
          <Detail label="Created" value={fmtDate(payment.created_at)} />
        </div>
      </div>
    </div>
  );
}

function Detail({ label, value, highlight = false }) {
  return (
    <div className="bg-[#FAF6F0]/60 rounded-xl p-4 border border-[#EADBCE]/60 transition-all">
      <p className="text-[10px] font-bold uppercase tracking-wider text-stone-400">{label}</p>
      <p className={`mt-1 break-words text-sm font-bold ${highlight ? 'text-amber-800 font-serif text-base' : 'text-stone-900'}`}>{value}</p>
    </div>
  );
}

function SkeletonRows() {
  return Array.from({ length: 4 }).map((_, index) => <div key={index} className="border-b border-stone-100 p-6"><div className="h-5 w-1/2 animate-pulse rounded bg-stone-100" /><div className="mt-3 h-4 w-3/4 animate-pulse rounded bg-stone-100/60" /></div>);
}

function EmptyState({ title, subtitle }) {
  return <div className="p-14 text-center"><p className="text-lg font-bold font-serif text-stone-900">{title}</p><p className="mt-2 text-sm text-stone-400">{subtitle}</p></div>;
}

function Toast({ message, onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);
  return <div className="fixed right-4 top-20 z-50 rounded-xl bg-stone-900 px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-white shadow-xl">{message}</div>;
}