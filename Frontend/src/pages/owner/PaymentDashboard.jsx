import React, { useEffect, useMemo, useState } from "react";
import { Calendar, ChevronLeft, ChevronRight, CreditCard, RefreshCw, Search, X } from "lucide-react";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const money = value => `₹${Number(value || 0).toLocaleString("en-IN")}`;
const fmtDate = value => (value ? new Date(value).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" }) : "-");

const statusClass = {
  SUCCESS: "bg-emerald-50 text-emerald-700 border-emerald-200",
  PENDING: "bg-amber-50 text-amber-700 border-amber-200",
  FAILED: "bg-rose-50 text-rose-700 border-rose-200",
  REFUNDED: "bg-slate-100 text-slate-700 border-slate-200",
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
    <div className="min-h-screen bg-orange-50 px-4 py-6 text-slate-900 md:px-8">
      {toast && <Toast message={toast} onClose={() => setToast("")} />}
      <div className="mx-auto max-w-7xl">
        {/* Modern Header Banner */}
        <div className="mb-6 rounded-2xl bg-gradient-to-r from-orange-200 to-orange-300 p-6 shadow-md relative overflow-hidden">
          <div className="relative z-10">
            <h1 className="text-2xl font-bold text-white tracking-tight">Payment Management</h1>
            <p className="text-orange-100 font-medium mt-1">Track token, full and pending payments from Razorpay</p>
          </div>
          <div className="absolute right-6 top-1/2 -translate-y-1/2 opacity-10 transform rotate-12">
            <div className="w-20 h-20 border-2 border-white rounded-xl"></div>
          </div>
        </div>

        <header className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex-1"></div>
          <button onClick={() => setPage(1)} className="inline-flex items-center justify-center gap-2 rounded-lg bg-orange-950 px-4 py-3 text-sm font-bold text-white hover:bg-orange-800 transition">
            <RefreshCw size={16} /> Refresh
          </button>
        </header>

        <section className="mb-5 grid gap-3 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm md:grid-cols-5">
          <FilterSelect label="Type" value={filters.paymentType} onChange={value => updateFilter("paymentType", value)} options={["ALL", "TOKEN", "FULL"]} />
          <FilterSelect label="Status" value={filters.status} onChange={value => updateFilter("status", value)} options={["ALL", "PENDING", "SUCCESS", "FAILED", "REFUNDED"]} />
          <label className="text-xs font-bold uppercase tracking-wider text-gray-600">
            Date
            <div className="mt-2 flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 hover:bg-orange-100 transition">
              <Calendar size={16} className="text-gray-400" />
              <input type="date" value={filters.date} onChange={e => updateFilter("date", e.target.value)} className="w-full bg-transparent text-sm outline-none text-gray-900" />
            </div>
          </label>
          <FilterSelect
            label="Barber"
            value={filters.barberId}
            onChange={value => updateFilter("barberId", value)}
            options={[{ id: "", name: "All" }, ...barbers]}
            objectOptions
          />
          <label className="text-xs font-bold uppercase tracking-wider text-gray-600">
            Search
            <div className="mt-2 flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 hover:bg-orange-100 transition">
              <Search size={16} className="text-gray-400" />
              <input value={filters.q} onChange={e => updateFilter("q", e.target.value)} placeholder="Order or payment id" className="w-full bg-transparent text-sm outline-none text-gray-900" />
            </div>
          </label>
        </section>

        <section className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
          <div className="hidden grid-cols-[1.2fr_1fr_1fr_1fr_1fr_0.8fr] border-b border-gray-100 bg-gray-50 px-4 py-4 text-xs font-bold uppercase tracking-wider text-gray-600 md:grid">
            <span>Transaction</span><span>Customer</span><span>Barber</span><span>Amount</span><span>Status</span><span className="text-right">Action</span>
          </div>
          {loading ? <SkeletonRows /> : error ? <EmptyState title="Could not load payments" subtitle={error} /> : data.payments.length === 0 ? <EmptyState title="No payments found" subtitle="Try clearing filters or selecting a wider date range." /> : (
            data.payments.map(payment => (
              <PaymentRow key={payment._id} payment={payment} onOpen={() => setSelected(payment)} onRetry={() => retryPayment(payment)} />
            ))
          )}
        </section>

        <div className="mt-5 flex items-center justify-between">
          <p className="text-sm font-semibold text-gray-600">{data.pagination.total || 0} transactions</p>
          <div className="flex items-center gap-2">
            <button disabled={page <= 1} onClick={() => setPage(page - 1)} className="rounded-lg border border-gray-200 bg-white p-2 hover:bg-gray-50 disabled:opacity-40 transition"><ChevronLeft size={18} /></button>
            <span className="text-sm font-semibold text-gray-900">Page {page} of {data.pagination.pages || 1}</span>
            <button disabled={page >= (data.pagination.pages || 1)} onClick={() => setPage(page + 1)} className="rounded-lg border border-gray-200 bg-white p-2 hover:bg-gray-50 disabled:opacity-40 transition"><ChevronRight size={18} /></button>
          </div>
        </div>
      </div>
      {selected && <TransactionModal payment={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}

function FilterSelect({ label, value, onChange, options, objectOptions = false }) {
  return (
    <label className="text-xs font-bold uppercase tracking-wider text-gray-600">
      {label}
      <select value={value} onChange={e => onChange(e.target.value)} className="mt-2 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-semibold text-gray-900 outline-none hover:bg-gray-50 transition">
        {options.map(option => objectOptions ? (
          <option key={option.id} value={option.id}>{option.name}</option>
        ) : <option key={option} value={option}>{option}</option>)}
      </select>
    </label>
  );
}

function PaymentRow({ payment, onOpen, onRetry }) {
  return (
    <div className="grid gap-3 border-b border-gray-100 p-4 last:border-0 md:grid-cols-[1.2fr_1fr_1fr_1fr_1fr_0.8fr] md:items-center hover:bg-gray-50 transition">
      <div>
        <p className="font-bold text-gray-900">{payment.razorpay_order_id || "Pending order"}</p>
        <p className="mt-1 text-xs font-medium text-gray-500">{fmtDate(payment.created_at)}</p>
      </div>
      <p className="text-sm font-semibold text-gray-900">{payment.customer_id?.name || "Customer"}</p>
      <p className="text-sm font-medium text-gray-600">{payment.barber_id?.name || "Unassigned"}</p>
      <div>
        <p className="font-bold text-gray-900">{money(payment.amount)}</p>
        <p className="text-xs font-bold text-teal-600">{payment.payment_type}</p>
      </div>
      <span className={`w-max rounded-full border px-3 py-1 text-xs font-bold ${statusClass[payment.status] || statusClass.PENDING}`}>{payment.status}</span>
      <div className="flex justify-start gap-2 md:justify-end">
        <button onClick={onOpen} className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs font-bold text-gray-900 hover:bg-gray-50 transition">View</button>
        {payment.status === "FAILED" && <button onClick={onRetry} className="rounded-lg bg-orange-950 px-3 py-2 text-xs font-bold text-white hover:bg-orange-800 transition">Retry</button>}
      </div>
    </div>
  );
}

function TransactionModal({ payment, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end bg-slate-950/50 p-0 md:items-center md:justify-center md:p-6">
      <div className="w-full max-w-2xl rounded-t-2xl bg-white p-6 shadow-2xl md:rounded-2xl">
        <div className="mb-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-teal-50 p-3 text-teal-600"><CreditCard size={22} /></div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Transaction Details</h2>
              <p className="text-sm text-gray-500">{payment.razorpay_payment_id || "Payment not captured yet"}</p>
            </div>
          </div>
          <button onClick={onClose} className="rounded-lg border border-gray-200 bg-gray-50 p-2 hover:bg-gray-100 transition"><X size={18} /></button>
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
  return <div className="rounded-lg bg-gray-50 p-3 border border-gray-100"><p className="text-xs font-bold uppercase tracking-wider text-gray-500">{label}</p><p className="mt-1 break-words text-sm font-semibold text-gray-900">{value}</p></div>;
}

function SkeletonRows() {
  return Array.from({ length: 6 }).map((_, index) => <div key={index} className="border-b border-gray-100 p-4"><div className="h-5 w-1/2 animate-pulse rounded bg-gray-100" /><div className="mt-3 h-4 w-3/4 animate-pulse rounded bg-gray-100" /></div>);
}

function EmptyState({ title, subtitle }) {
  return <div className="p-12 text-center"><p className="text-lg font-bold text-gray-900">{title}</p><p className="mt-2 text-sm text-gray-500">{subtitle}</p></div>;
}

function Toast({ message, onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);
  return <div className="fixed right-4 top-4 z-50 rounded-lg bg-orange-950 px-4 py-3 text-sm font-bold text-white shadow-xl">{message}</div>;
}
