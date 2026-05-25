import React, { useEffect, useMemo, useState } from "react";
import { Calendar, ChevronLeft, ChevronRight, CreditCard, RefreshCw, Search, X } from "lucide-react";

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
  const [filters, setFilters] = useState({ paymentType: "ALL", status: "ALL", date: "", barberId: "", q: "" });
  const [page, setPage] = useState(1);
  const [data, setData] = useState({ payments: [], pagination: { page: 1, pages: 1, total: 0 } });
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState("");
  const [error, setError] = useState("");

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
    return () => {
      active = false;
    };
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
      
      {toast && <Toast message={toast} onClose={() => setToast("")} />}
      <div className="mx-auto max-w-7xl">
        {/* Modern Header Banner */}
        <div className="rounded-2xl p-6 mb-6 relative overflow-hidden card" style={{ background: "rgba(250,246,240,0.95)" }}>
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <p className="text-amber-700 font-sans normal-case font-bold tracking-[2px] text-xs sm:text-sm uppercase mb-1">
                Finances & Razorpay Integration
              </p>
              <h1 className="text-2xl font-bold font-serif tracking-normal text-zinc-900">Payment Management</h1>
              <p className="text-zinc-500 font-sans mt-1 text-sm">Track token, full and pending payments from Razorpay</p>
            </div>
            <button onClick={() => setPage(1)} className="inline-flex items-center justify-center gap-2 rounded-xl bg-amber-600 hover:bg-amber-700 px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-white shadow-md transition-all duration-200 self-start md:self-center">
              <RefreshCw size={16} /> Refresh
            </button>
          </div>
          <div className="absolute right-6 top-1/2 -translate-y-1/2 opacity-20 transform rotate-12">
            <CreditCard className="w-20 h-20 text-amber-600/30" />
          </div>
        </div>

        <section className="mb-5 grid gap-4 card p-5 md:grid-cols-5">
          <FilterSelect label="Type" value={filters.paymentType} onChange={value => updateFilter("paymentType", value)} options={["ALL", "TOKEN", "FULL"]} />
          <FilterSelect label="Status" value={filters.status} onChange={value => updateFilter("status", value)} options={["ALL", "PENDING", "SUCCESS", "FAILED", "REFUNDED"]} />
          <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">
            Date
            <div className="mt-2 flex items-center gap-2 rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2.5 hover:bg-zinc-100 focus-within:border-amber-600 transition-all">
              <Calendar size={16} className="text-zinc-400" />
              <input type="date" value={filters.date} onChange={e => updateFilter("date", e.target.value)} className="w-full bg-transparent text-sm outline-none text-zinc-800 font-medium" />
            </div>
          </label>
          <FilterSelect
            label="Barber"
            value={filters.barberId}
            onChange={value => updateFilter("barberId", value)}
            options={[{ id: "", name: "All" }, ...barbers]}
            objectOptions
          />
          <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">
            Search
            <div className="mt-2 flex items-center gap-2 rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2.5 hover:bg-zinc-100 focus-within:border-amber-600 transition-all">
              <Search size={16} className="text-zinc-400" />
              <input value={filters.q} onChange={e => updateFilter("q", e.target.value)} placeholder="Order or payment id" className="w-full bg-transparent text-sm outline-none text-zinc-800 font-medium placeholder-zinc-400" />
            </div>
          </label>
        </section>

        <section className="card overflow-hidden">
          <div className="hidden grid-cols-[1.2fr_1fr_1fr_1fr_1fr_0.8fr] border-b border-zinc-200 bg-zinc-50/50 px-5 py-4 text-xs font-bold uppercase tracking-wider text-zinc-500 md:grid">
            <span>Transaction</span><span>Customer</span><span>Barber</span><span>Amount</span><span>Status</span><span className="text-right">Action</span>
          </div>
          {loading ? <SkeletonRows /> : error ? <EmptyState title="Could not load payments" subtitle={error} /> : data.payments.length === 0 ? <EmptyState title="No payments found" subtitle="Try clearing filters or selecting a wider date range." /> : (
            data.payments.map(payment => (
              <PaymentRow key={payment._id} payment={payment} onOpen={() => setSelected(payment)} onRetry={() => retryPayment(payment)} />
            ))
          )}
        </section>

        <div className="mt-6 flex items-center justify-between">
          <p className="text-sm font-bold text-zinc-500 font-sans">{data.pagination.total || 0} transactions</p>
          <div className="flex items-center gap-2">
            <button disabled={page <= 1} onClick={() => setPage(page - 1)} className="rounded-xl border border-zinc-200 bg-white p-2.5 text-zinc-600 hover:bg-zinc-50 hover:text-zinc-800 disabled:opacity-30 disabled:cursor-not-allowed shadow-sm transition-all"><ChevronLeft size={18} /></button>
            <span className="text-sm font-bold text-zinc-950 font-serif">Page {page} of {data.pagination.pages || 1}</span>
            <button disabled={page >= (data.pagination.pages || 1)} onClick={() => setPage(page + 1)} className="rounded-xl border border-zinc-200 bg-white p-2.5 text-zinc-600 hover:bg-zinc-50 hover:text-zinc-800 disabled:opacity-30 disabled:cursor-not-allowed shadow-sm transition-all"><ChevronRight size={18} /></button>
          </div>
        </div>
      </div>
      {selected && <TransactionModal payment={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}

function FilterSelect({ label, value, onChange, options, objectOptions = false }) {
  return (
    <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">
      {label}
      <select value={value} onChange={e => onChange(e.target.value)} className="mt-2 w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2.5 text-sm font-medium text-zinc-800 outline-none hover:bg-zinc-100 transition cursor-pointer">
        {options.map(option => objectOptions ? (
          <option key={option.id} value={option.id}>{option.name}</option>
        ) : <option key={option} value={option}>{option}</option>)}
      </select>
    </label>
  );
}

function PaymentRow({ payment, onOpen, onRetry }) {
  return (
    <div className="grid gap-3 border-b border-zinc-100 p-5 last:border-0 md:grid-cols-[1.2fr_1fr_1fr_1fr_1fr_0.8fr] md:items-center hover:bg-zinc-50/80 transition-colors">
      <div>
        <p className="font-bold font-serif text-zinc-900 text-sm truncate max-w-[200px]">{payment.razorpay_order_id || "Pending order"}</p>
        <p className="mt-1 text-xs text-zinc-400 font-sans">{fmtDate(payment.created_at)}</p>
      </div>
      <p className="text-sm font-bold text-zinc-800">{payment.customer_id?.name || "Customer"}</p>
      <p className="text-sm font-medium text-zinc-500">{payment.barber_id?.name || "Unassigned"}</p>
      <div>
        <p className="font-bold text-zinc-900 font-serif">{money(payment.amount)}</p>
        <p className="text-[10px] font-bold text-emerald-700 uppercase bg-emerald-50 border border-emerald-200/60 px-2 py-0.5 rounded-full inline-block mt-1">{payment.payment_type}</p>
      </div>
      <span className={`w-max rounded-full border px-3 py-1 text-xs font-bold ${statusClass[payment.status] || statusClass.PENDING}`}>{payment.status}</span>
      <div className="flex justify-start gap-2 md:justify-end">
        <button onClick={onOpen} className="rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-xs font-bold text-zinc-700 hover:bg-zinc-50 shadow-sm transition-all">View</button>
        {payment.status === "FAILED" && <button onClick={onRetry} className="rounded-xl bg-amber-600 hover:bg-amber-700 px-4 py-2.5 text-xs font-bold text-white shadow-md transition-all">Retry</button>}
      </div>
    </div>
  );
}

function TransactionModal({ payment, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end bg-zinc-900/40 backdrop-blur-sm p-0 md:items-center md:justify-center md:p-6">
      <div className="w-full max-w-2xl rounded-t-3xl bg-white p-6 shadow-2xl md:rounded-3xl card hover:transform-none">
        <div className="mb-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-amber-50 border border-amber-100 p-3 text-amber-600"><CreditCard size={22} /></div>
            <div>
              <h2 className="text-xl font-bold font-serif text-zinc-900">Transaction Details</h2>
              <p className="text-sm text-zinc-400 font-sans">{payment.razorpay_payment_id || "Payment not captured yet"}</p>
            </div>
          </div>
          <button onClick={onClose} className="rounded-xl border border-zinc-200 bg-zinc-50 text-zinc-400 p-2 hover:text-zinc-600 hover:bg-zinc-100 transition-all"><X size={18} /></button>
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          <Detail label="Amount" value={money(payment.amount)} />
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

function Detail({ label, value }) {
  return (
    <div className="bg-amber-50/40 rounded-xl p-3 border border-amber-200/50 transition-all">
      <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">{label}</p>
      <p className="mt-1 break-words text-sm font-bold text-zinc-900">{value}</p>
    </div>
  );
}

function SkeletonRows() {
  return Array.from({ length: 6 }).map((_, index) => <div key={index} className="border-b border-zinc-100 p-5"><div className="h-5 w-1/2 animate-pulse rounded bg-zinc-100" /><div className="mt-3 h-4 w-3/4 animate-pulse rounded bg-zinc-100" /></div>);
}

function EmptyState({ title, subtitle }) {
  return <div className="p-12 text-center"><p className="text-lg font-bold font-serif text-zinc-900">{title}</p><p className="mt-2 text-sm text-zinc-400">{subtitle}</p></div>;
}

function Toast({ message, onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);
  return <div className="fixed right-4 top-4 z-50 rounded-lg bg-orange-950 px-4 py-3 text-sm font-bold text-white shadow-xl">{message}</div>;
}
