import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Calendar, ChevronLeft, ChevronRight, CreditCard, RefreshCw, 
  Search, X, Scissors, LogOut, LayoutDashboard, BarChart2, DollarSign 
} from "lucide-react";
import CustomSelect from "../../components/common/CustomSelect";

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
    <div className="p-6 md:p-10 font-sans text-stone-800 selection:bg-amber-100 min-h-screen" style={{ background: "#FAF6F0" }}>
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

      {/* ── MAIN CONTENT WORKSPACE ── */}
      <div className="max-w-5xl mx-auto">
          
          {/* SYSTEM TIMING METADATA */}
          <div className="flex justify-end items-center gap-6 mb-4 font-sans">
            <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-xl border border-stone-200/60 shadow-sm">
              <ClockIcon />
              {/* Rule 2 Timestamp subheader format modification */}
              <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#C5A059]">System Clock: <span className="text-stone-800 font-mono tracking-normal">{time} IST</span></span>
            </div>
          </div>

          {/* Context Header Title Card Block */}
          <div className="relative rounded-3xl p-6 md:p-8 mb-8 overflow-hidden card text-left bg-white">
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <p className="font-extrabold uppercase tracking-widest text-[11px] text-[#C5A059] mb-1.5 font-sans">
                  Finances & Razorpay Integration
                </p>
                <h2 className="font-serif text-3xl sm:text-4xl tracking-normal text-stone-900 flex items-center justify-start gap-2 flex-wrap sm:whitespace-nowrap">
                  <span className="font-bold uppercase">Payment</span>
                  <span className="italic text-[#C5A059] normal-case font-medium">Management</span>
                </h2>
                <p className="text-stone-600 text-sm font-normal leading-relaxed font-sans mt-2">Track token installments, fully captured orders, and pending deposits processed through Razorpay.</p>
              </div>
              <button 
                onClick={() => setPage(1)} 
                className="inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3.5 text-xs font-extrabold tracking-wider uppercase text-white shadow-md active:scale-[0.98] transition-all duration-200 self-start md:self-center cursor-pointer hover:opacity-90 font-sans"
                style={{ background: CHARCOAL }}
              >
                <RefreshCw size={14} color={GOLD} /> Refresh Ledger
              </button>
            </div>
            <div className="absolute right-6 top-1/2 -translate-y-1/2 opacity-5 transform rotate-12 pointer-events-none">
              <CreditCard className="w-32 h-32 text-stone-900" />
            </div>
          </div>

          {/* Filter Selection Panel Utility row */}
          <section className="mb-6 grid gap-4 p-5 card md:grid-cols-5 bg-white shadow-sm text-left">
            <FilterSelect label="Type" value={filters.paymentType} onChange={value => updateFilter("paymentType", value)} options={["ALL", "TOKEN", "FULL"]} />
            <FilterSelect label="Status" value={filters.status} onChange={value => updateFilter("status", value)} options={["ALL", "PENDING", "SUCCESS", "FAILED", "REFUNDED"]} />
            
            <div className="flex flex-col gap-1.5 text-left">
              <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#C5A059] font-sans pl-0.5">
                Target Date
              </span>
              <div className="flex items-center gap-2 rounded-xl border border-stone-200 bg-stone-50/50 px-3 h-10 hover:bg-white focus-within:border-[#C5A059] focus-within:bg-white transition-all">
                <Calendar size={14} className="text-[#C5A059] shrink-0" />
                <input type="date" value={filters.date} onChange={e => updateFilter("date", e.target.value)} className="w-full bg-transparent text-xs outline-none text-stone-850 font-bold font-sans" />
              </div>
            </div>

            <FilterSelect
              label="Barber Assignee"
              value={filters.barberId}
              onChange={value => updateFilter("barberId", value)}
              options={[{ id: "", name: "All Barbers" }, ...barbers]}
              objectOptions
            />

            <div className="flex flex-col gap-1.5 text-left">
              <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#C5A059] font-sans pl-0.5">
                ID Search Query
              </span>
              <div className="flex items-center gap-2 rounded-xl border border-[#EADBCE] bg-stone-50/50 px-3 h-10 hover:bg-white focus-within:border-[#C5A059] focus-within:bg-white transition-all">
                <Search size={14} className="text-[#C5A059] shrink-0" />
                <input type="text" placeholder="e.g. pay_..." value={filters.q} onChange={e => updateFilter("q", e.target.value)} className="w-full bg-transparent text-xs outline-none text-stone-850 font-bold font-sans" />
              </div>
            </div>
          </section>

          {/* Ledger Row Spreadsheet Ledger Container */}
          <section className="card overflow-hidden bg-white shadow-sm text-left font-sans">
            <div className="hidden grid-cols-[1.4fr_1fr_1fr_1fr_1fr_0.8fr] border-b border-stone-100 bg-stone-50/50 px-6 py-4 text-[11px] font-extrabold uppercase tracking-widest text-[#C5A059] md:grid">
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

          {/* Central Workspace Pagination Row element */}
          <div className="mt-6 flex items-center justify-between px-2 font-sans">
            {/* Rule 3 Muted metrics counter logs description view */}
            <p className="text-stone-600 text-sm font-normal leading-relaxed">{data.pagination.total || 0} transactions logged</p>
            <div className="flex items-center gap-3">
              <button disabled={page <= 1} onClick={() => setPage(page - 1)} className="rounded-xl border border-stone-200 bg-white p-2 text-stone-600 hover:bg-stone-50 disabled:opacity-30 disabled:cursor-not-allowed shadow-sm transition-all cursor-pointer"><ChevronLeft size={16} /></button>
              <span className="text-xs font-black text-stone-900 font-mono tracking-tight">Page {page} of {data.pagination.pages || 1}</span>
              <button disabled={page >= (data.pagination.pages || 1)} onClick={() => setPage(page + 1)} className="rounded-xl border border-stone-200 bg-white p-2 text-stone-600 hover:bg-stone-50 disabled:opacity-30 disabled:cursor-not-allowed shadow-sm transition-all cursor-pointer"><ChevronRight size={16} /></button>
            </div>
          </div>

        </div>
  
        {/* Modal overlays engine blocks drawer controller */}
        {selected && <TransactionModal payment={selected} onClose={() => setSelected(null)} />}
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
  const selectOptions = options.map(opt => {
    if (objectOptions && typeof opt === 'object' && opt !== null) {
      return { value: opt.id, label: opt.name };
    }
    return { value: opt, label: String(opt) };
  });

  return (
    <div className="flex flex-col gap-1.5 text-left">
      <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#C5A059] font-sans pl-0.5">
        {label}
      </span>
      <CustomSelect
        value={value}
        onChange={onChange}
        options={selectOptions}
        className="!bg-stone-50/50 !border-stone-200 !text-stone-700 !text-xs !font-bold !h-10"
      />
    </div>
  );
}
function PaymentRow({ payment, onOpen, onRetry }) {
  const servicesList = payment.booking_id?.services?.map(s => s.service_name).join(", ") 
    || payment.service_ids?.map(s => s.name).join(", ") 
    || "—";

  return (
    <div className="grid gap-3 p-6 md:grid-cols-[1.4fr_1fr_1fr_1fr_1fr_0.8fr] md:items-center hover:bg-stone-50/30 transition-colors group text-left font-sans">
      <div>
        <p className="font-bold font-serif text-stone-900 text-sm truncate max-w-[200px]">{payment.razorpay_order_id || "Pending order intent"}</p>
        <p className="mt-1 text-[11px] text-stone-400 font-medium font-sans">{fmtDate(payment.created_at)}</p>
      </div>
      <div>
        <p className="text-sm font-bold text-stone-900 tracking-tight">{payment.customer_id?.name || "Customer Walk-in"}</p>
        <p className="mt-0.5 text-xs font-semibold text-[#C5A059] truncate max-w-[160px]" title={servicesList}>
          {servicesList}
        </p>
      </div>
      <p className="text-xs font-bold text-stone-500 tracking-wide">{payment.barber_id?.name || "Unassigned"}</p>
      <div>
        <p className="font-black text-stone-900 font-mono text-sm">{money(payment.amount)}</p>
        <p className="text-[9px] font-black text-amber-800 uppercase bg-amber-50 border border-amber-200/40 px-2 py-0.5 rounded inline-block mt-1.5 tracking-widest">{payment.payment_type}</p>
      </div>
      <div>
        <span className={`w-max rounded-md border px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider ${statusClass[payment.status] || statusClass.PENDING}`}>{payment.status}</span>
      </div>
      <div className="flex justify-start gap-2 md:justify-end border-t md:border-0 pt-3 md:pt-0 border-stone-100 font-sans">
        {/* Rule 4 Internal View and Retry controls items */}
        <button onClick={onOpen} className="rounded-xl border border-stone-200 bg-white px-4 py-2 text-xs font-extrabold tracking-wider uppercase text-stone-700 hover:border-stone-400 shadow-sm transition-all cursor-pointer">View</button>
        {payment.status === "FAILED" && <button onClick={onRetry} className="rounded-xl hover:opacity-95 px-4 py-2 text-xs font-extrabold tracking-wider uppercase text-white shadow-md transition-all cursor-pointer" style={{ background: CHARCOAL }}>Retry</button>}
      </div>
    </div>
  );
}

function TransactionModal({ payment, onClose }) {
  const servicesList = payment.booking_id?.services?.map(s => s.service_name).join(", ") 
    || payment.service_ids?.map(s => s.name).join(", ") 
    || "—";

  return (
    <div 
      className="fixed inset-0 z-50 flex items-end bg-stone-900/40 backdrop-blur-sm p-0 md:items-center md:justify-center md:p-6 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-xl rounded-t-3xl bg-white p-6 shadow-2xl md:rounded-2xl border border-stone-200 flex flex-col justify-start text-left max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className="mb-6 flex items-center justify-between pb-4 border-b border-stone-100">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-stone-50 border border-stone-200 p-3" style={{ color: GOLD }}><CreditCard size={20} /></div>
            <div>
              {/* Rule 1 Nested Side Drawer Header Title */}
              <h2 className="font-serif text-xl sm:text-2xl tracking-normal text-stone-900 flex items-center justify-start gap-2 whitespace-nowrap">
                <span className="font-bold uppercase">Transaction</span>
                <span className="italic text-[#C5A059] normal-case font-medium">Details</span>
              </h2>
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
          <Detail label="Services Taken" value={servicesList} />
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
    <div className="bg-[#FAF6F0]/60 rounded-xl p-4 border border-[#EADBCE]/60 transition-all text-left">
      {/* Rule 2 Meta item info cards titles */}
      <p className="text-[11px] font-extrabold uppercase tracking-widest text-[#C5A059] font-sans">{label}</p>
      <p className={`mt-1.5 break-words text-sm font-bold font-sans ${highlight ? 'font-mono text-stone-900 text-base' : 'text-stone-900'}`}>{value}</p>
    </div>
  );
}

function SkeletonRows() {
  return Array.from({ length: 3 }).map((_, index) => <div key={index} className="border-b border-stone-50 p-6"><div className="h-5 w-1/3 animate-pulse rounded bg-stone-100" /><div className="mt-3 h-3 w-1/2 animate-pulse rounded bg-stone-100/60" /></div>);
}

function EmptyState({ title, subtitle }) {
  return (
    <div className="p-14 text-center">
      {/* Rule 1 Fallback variant mapping empty space frames */}
      <h2 className="font-serif text-xl sm:text-2xl tracking-normal text-stone-900 flex items-center justify-center gap-2 whitespace-nowrap">
        <span className="font-bold uppercase">{title}</span>
      </h2>
      {/* Rule 3 Core placeholder descriptions texts layout views */}
      <p className="mx-auto max-w-2xl text-sm font-normal leading-relaxed text-stone-400 font-sans mt-1.5">{subtitle}</p>
    </div>
  );
}

function Toast({ message, onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);
  {/* Rule 4 Popup Toast Text system standard */}
  return <div className="fixed right-4 top-6 z-50 rounded-xl bg-stone-900 px-5 py-3.5 text-xs font-extrabold tracking-wider uppercase text-white shadow-xl font-sans">{message}</div>;
}