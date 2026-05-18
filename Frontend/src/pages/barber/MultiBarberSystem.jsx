import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ─── CONSTANTS ────────────────────────────────────────────────────────────────
const STATUS = { AVAILABLE: "Available", BUSY: "Busy", BREAK: "On Break", OFFLINE: "Offline" };
const BOOKING_TYPE = { WALKIN: "Walk-in", SLOT: "Slot", PRIORITY: "Priority" };
const SERVICE_DURATION = { Haircut: 20, Beard: 15, "Haircut + Beard": 30, Combo: 35 };

const STATUS_STYLE = {
  Available:  { dot: "bg-emerald-500", badge: "bg-emerald-50 text-emerald-700 border-emerald-200/60" },
  Busy:       { dot: "bg-amber-500 animate-pulse", badge: "bg-amber-50 text-amber-700 border-amber-200/60" },
  "On Break": { dot: "bg-sky-400", badge: "bg-sky-50 text-sky-700 border-sky-200/60" },
  Offline:    { dot: "bg-slate-300", badge: "bg-slate-100 text-slate-500 border-slate-200/60" },
};

const BOOKING_STYLE = {
  Priority: "bg-amber-50 text-amber-700 border-amber-300/50",
  Slot:     "bg-sky-50 text-sky-700 border-sky-300/50",
  "Walk-in":"bg-slate-100 text-slate-600 border-slate-300/50",
};

const AVATAR_COLORS = [
  "bg-violet-100 text-violet-700",
  "bg-sky-100 text-sky-700",
  "bg-emerald-100 text-emerald-700",
  "bg-orange-100 text-orange-700",
  "bg-rose-100 text-rose-700",
  "bg-teal-100 text-teal-700",
];

const SERVICES = Object.keys(SERVICE_DURATION);

let UID = 100;
const genId = () => ++UID;

function initials(name) { return name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase(); }

function calcWait(queue) {
  return queue.reduce((acc, c) => acc + (SERVICE_DURATION[c.service] ?? 20), 0);
}

function buildCustomer(overrides = {}) {
  const names = ["Rahul Sharma","Vikram Rao","Amit Patel","Sanjay Mehta","Ravi Kumar","Deepak Singh","Nikhil Joshi","Karan Verma","Priyesh Das","Tarun Gupta","Mohit Yadav","Suresh Nair"];
  const btypes = Object.values(BOOKING_TYPE);
  const name = names[Math.floor(Math.random() * names.length)];
  const service = SERVICES[Math.floor(Math.random() * SERVICES.length)];
  const bookingType = btypes[Math.floor(Math.random() * btypes.length)];
  return {
    id: genId(),
    name,
    service,
    bookingType,
    noShowCount: Math.random() < 0.15 ? 1 : 0,
    avatar: initials(name),
    avatarColor: AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)],
    assignedAt: Date.now(),
    ...overrides,
  };
}

function buildBarbers() {
  return [
    { id: 1, name: "Arjun Sharma",  specialization: "Haircut, Beard",   status: STATUS.AVAILABLE, queue: [buildCustomer({ bookingType: BOOKING_TYPE.PRIORITY })], totalServed: 14, avgTime: 22, rating: 4.8, avatarColor: AVATAR_COLORS[0], serviceStart: null },
    { id: 2, name: "Rohan Verma",   specialization: "Haircut, Styling", status: STATUS.BUSY,      queue: [buildCustomer({ bookingType: BOOKING_TYPE.SLOT }), buildCustomer()], totalServed: 11, avgTime: 25, rating: 4.6, avatarColor: AVATAR_COLORS[1], serviceStart: Date.now() - 8 * 60000 },
    { id: 3, name: "Kiran Patel",   specialization: "Combo, Beard",     status: STATUS.BREAK,     queue: [], totalServed: 9, avgTime: 28, rating: 4.5, avatarColor: AVATAR_COLORS[2], serviceStart: null },
    { id: 4, name: "Devraj Nair",   specialization: "Haircut",          status: STATUS.AVAILABLE, queue: [buildCustomer()], totalServed: 7, avgTime: 18, rating: 4.7, avatarColor: AVATAR_COLORS[3], serviceStart: null },
  ];
}

function findBestBarber(barbers, bookingType) {
  const available = barbers.filter(b => b.status === STATUS.AVAILABLE || b.status === STATUS.BUSY);
  if (!available.length) return null;
  const sorted = [...available].sort((a, b) => {
    const waitA = calcWait(a.queue);
    const waitB = calcWait(b.queue);
    if (bookingType === BOOKING_TYPE.PRIORITY) {
      if (a.status !== b.status) return a.status === STATUS.AVAILABLE ? -1 : 1;
    }
    return waitA - waitB;
  });
  return sorted[0];
}

function StatusDot({ status }) {
  const s = STATUS_STYLE[status] ?? STATUS_STYLE.Offline;
  return <span className={`w-2 h-2 rounded-full inline-block ${s.dot}`} />;
}

function StatusBadge({ status }) {
  const s = STATUS_STYLE[status] ?? STATUS_STYLE.Offline;
  return (
    <span className={`inline-flex items-center gap-1.5 text-[10px] font-semibold px-2.5 py-1 rounded-full border ${s.badge}`}>
      <StatusDot status={status} />{status}
    </span>
  );
}

function BookingBadge({ type }) {
  return (
    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${BOOKING_STYLE[type] ?? BOOKING_STYLE["Walk-in"]}`}>
      {type}
    </span>
  );
}

function NoShowBadge({ count }) {
  if (!count) return null;
  return (
    <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-rose-50 text-rose-600 border border-rose-200/50">
      ⚠ {count}×
    </span>
  );
}

function WaitPill({ mins }) {
  const color = mins === 0 ? "text-emerald-600 bg-emerald-50 border-emerald-200/60"
    : mins <= 20 ? "text-sky-600 bg-sky-50 border-sky-200/60"
    : mins <= 40 ? "text-amber-600 bg-amber-50 border-amber-200/60"
    : "text-rose-600 bg-rose-50 border-rose-200/60";
  return (
    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${color}`}>
      {mins === 0 ? "Ready now" : `~${mins} min`}
    </span>
  );
}

function CustomerChip({ customer, pos, onNoShow, isActive }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20, scale: 0.9 }}
      transition={{ type: "spring", damping: 22, stiffness: 300 }}
      className={`flex items-center gap-2 px-3 py-2 rounded-xl border ${
        isActive ? "bg-slate-900 border-slate-700 text-white" : "bg-white border-slate-200/80"
      }`}
    >
      <span className={`text-[10px] font-bold w-4 shrink-0 ${isActive ? "text-slate-300" : "text-slate-400"}`}>{pos}</span>
      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold shrink-0 ${
        isActive ? "bg-white/20 text-white" : customer.avatarColor
      }`}>{customer.avatar}</div>
      <div className="flex-1 min-w-0">
        <p className={`text-xs font-semibold truncate ${isActive ? "text-white" : "text-slate-800"}`}>{customer.name}</p>
        <p className={`text-[10px] truncate ${isActive ? "text-slate-300" : "text-slate-500"}`}>{customer.service}</p>
      </div>
      <div className="flex items-center gap-1 shrink-0">
        <BookingBadge type={customer.bookingType} />
        <NoShowBadge count={customer.noShowCount} />
      </div>
      {isActive && onNoShow && (
        <button onClick={() => onNoShow(customer)}
          className="text-[10px] font-semibold px-2 py-0.5 rounded-lg bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 transition-colors shrink-0">
          No-show
        </button>
      )}
    </motion.div>
  );
}

function BarberCard({ barber, onStartService, onCompleteService, onStatusChange, onNoShow, onReassign, allBarbers }) {
  const wait = calcWait(barber.queue);
  const current = barber.queue[0];

  return (
    <motion.div layout className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
      <div className="px-4 pt-4 pb-3">
        <div className="flex items-start gap-3">
          <div className={`w-11 h-11 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${barber.avatarColor}`}>
            {initials(barber.name)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-semibold text-slate-900">{barber.name}</span>
              <StatusBadge status={barber.status} />
            </div>
            <p className="text-xs text-slate-500 mt-0.5">{barber.specialization}</p>
          </div>
          <div className="shrink-0 text-right">
            <WaitPill mins={wait} />
            <p className="text-[10px] text-slate-400 mt-1">{barber.queue.length} in queue</p>
          </div>
        </div>

        <div className="flex gap-3 mt-3 pt-3 border-t border-slate-100 items-center">
          <div className="text-center">
            <p className="text-sm font-bold text-slate-900">{barber.totalServed}</p>
            <p className="text-[10px] text-slate-400">Served</p>
          </div>
          <div className="w-px bg-slate-100 h-6" />
          <div className="text-center">
            <p className="text-sm font-bold text-slate-900">{barber.avgTime}m</p>
            <p className="text-[10px] text-slate-400">Avg</p>
          </div>
          <div className="w-px bg-slate-100 h-6" />
          <div className="text-center">
            <p className="text-sm font-bold text-slate-900">★{barber.rating}</p>
            <p className="text-[10px] text-slate-400">Rating</p>
          </div>
          <div className="flex-1" />
          <select value={barber.status} onChange={e => onStatusChange(barber.id, e.target.value)}
            className="text-[10px] border border-slate-200 rounded-lg px-2 py-1.5 text-slate-600 bg-white focus:outline-none cursor-pointer">
            {Object.values(STATUS).map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>

      {current && (
        <div className="px-4 pb-3 flex gap-2">
          {barber.status === STATUS.AVAILABLE && (
            <button onClick={() => onStartService(barber.id)}
              className="flex-1 py-2 rounded-xl text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 active:scale-95 transition-all">
              ▶ Start Service
            </button>
          )}
          {barber.status === STATUS.BUSY && (
            <button onClick={() => onCompleteService(barber.id)}
              className="flex-1 py-2 rounded-xl text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 active:scale-95 transition-all">
              ✓ Complete
            </button>
          )}
          <select onChange={e => { if (e.target.value) onReassign(barber.id, current.id, parseInt(e.target.value)); e.target.value = ""; }}
            className="text-[10px] border border-slate-200 rounded-xl px-2 py-2 text-slate-600 bg-white focus:outline-none cursor-pointer"
            defaultValue="">
            <option value="" disabled>Reassign →</option>
            {allBarbers.filter(b => b.id !== barber.id && b.status !== STATUS.OFFLINE && b.status !== STATUS.BREAK).map(b => (
              <option key={b.id} value={b.id}>{b.name}</option>
            ))}
          </select>
        </div>
      )}

      <div className="px-4 pb-4">
        {barber.queue.length > 0 ? (
          <div className="flex flex-col gap-1.5">
            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Queue</p>
            <AnimatePresence>
              {barber.queue.map((c, i) => (
                <CustomerChip key={c.id} customer={c} pos={i + 1}
                  isActive={i === 0 && barber.status === STATUS.BUSY}
                  onNoShow={i === 0 ? onNoShow : null} />
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <div className="py-3 text-center text-xs text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
            Queue empty
          </div>
        )}
      </div>
    </motion.div>
  );
}

function Toast({ message, type = "success", onDone }) {
  useEffect(() => { const t = setTimeout(onDone, 3500); return () => clearTimeout(t); }, [onDone]);
  const colors = type === "success" ? "bg-slate-900 text-white" : type === "warn" ? "bg-amber-600 text-white" : "bg-rose-600 text-white";
  return (
    <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }}>
      <div className={`${colors} text-xs font-medium px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2 max-w-xs`}>
        {message}
      </div>
    </motion.div>
  );
}

function AddCustomerModal({ onAdd, onClose, barbers }) {
  const [name, setName] = useState("");
  const [service, setService] = useState(SERVICES[0]);
  const [type, setType] = useState(BOOKING_TYPE.WALKIN);
  const [mode, setMode] = useState("auto");
  const [targetBarber, setTargetBarber] = useState("");

  const submit = () => {
    if (!name.trim()) return;
    const customer = buildCustomer({ name: name.trim(), service, bookingType: type, avatar: initials(name.trim()) });
    const barberId = mode === "manual" && targetBarber ? parseInt(targetBarber) : null;
    onAdd(customer, barberId);
    onClose();
  };

  return (
    <motion.div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center px-4 pb-4 sm:pb-0"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <motion.div className="absolute inset-0 bg-slate-900/20 backdrop-blur-[2px]" onClick={onClose} />
      <motion.div
        className="relative w-full max-w-sm bg-white rounded-2xl shadow-xl border border-slate-200/80 overflow-hidden"
        initial={{ y: 48, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 48, opacity: 0 }}
        transition={{ type: "spring", damping: 28, stiffness: 320 }}
      >
        <div className="absolute inset-0 opacity-[0.3] pointer-events-none"
          style={{ backgroundImage: "radial-gradient(#e2e8f0 1px, transparent 1px)", backgroundSize: "20px 20px" }} />
        <div className="relative p-6 flex flex-col gap-4">
          <div>
            <h3 className="text-base font-semibold text-slate-900">Add Customer</h3>
            <p className="text-xs text-slate-500 mt-0.5">Auto-assigns to least-loaded barber</p>
          </div>
          <input value={name} onChange={e => setName(e.target.value)} placeholder="Customer name"
            className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-400 bg-white" />
          <div className="grid grid-cols-2 gap-2">
            <div>
              <p className="text-[10px] font-medium text-slate-500 mb-1">Service</p>
              <select value={service} onChange={e => setService(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-700 bg-white focus:outline-none">
                {SERVICES.map(s => <option key={s} value={s}>{s} ({SERVICE_DURATION[s]}m)</option>)}
              </select>
            </div>
            <div>
              <p className="text-[10px] font-medium text-slate-500 mb-1">Booking type</p>
              <select value={type} onChange={e => setType(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-700 bg-white focus:outline-none">
                {Object.values(BOOKING_TYPE).map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>
          <div>
            <p className="text-[10px] font-medium text-slate-500 mb-1.5">Assignment</p>
            <div className="flex gap-2">
              {["auto", "manual"].map(m => (
                <button key={m} onClick={() => setMode(m)}
                  className={`flex-1 py-2 rounded-xl text-xs font-medium border transition-all ${
                    mode === m ? "bg-slate-900 text-white border-slate-900" : "bg-white text-slate-600 border-slate-200 hover:border-slate-400"
                  }`}>
                  {m === "auto" ? "⚡ Auto" : "✋ Manual"}
                </button>
              ))}
            </div>
            {mode === "manual" && (
              <select value={targetBarber} onChange={e => setTargetBarber(e.target.value)}
                className="mt-2 w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-700 bg-white focus:outline-none">
                <option value="">Select barber…</option>
                {barbers.filter(b => b.status !== STATUS.OFFLINE).map(b => (
                  <option key={b.id} value={b.id}>{b.name} — {b.status} (~{calcWait(b.queue)}m)</option>
                ))}
              </select>
            )}
          </div>
          <div className="flex gap-2">
            <button onClick={onClose} className="flex-1 py-2.5 rounded-xl text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors">
              Cancel
            </button>
            <button onClick={submit} disabled={!name.trim()}
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed active:scale-95 transition-all">
              Add to Queue
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function MultiBarberSystem() {
  const [barbers, setBarbers] = useState(buildBarbers);
  const [toasts, setToasts] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [noShowTarget, setNoShowTarget] = useState(null);
  const toastId = useRef(0);

  const addToast = useCallback((message, type = "success") => {
    const id = ++toastId.current;
    setToasts(prev => [...prev, { id, message, type }]);
  }, []);
  const removeToast = id => setToasts(prev => prev.filter(t => t.id !== id));

  const handleStartService = useCallback((barberId) => {
    setBarbers(prev => prev.map(b =>
      b.id === barberId && b.queue.length
        ? { ...b, status: STATUS.BUSY, serviceStart: Date.now() }
        : b
    ));
    setBarbers(curr => {
      const b = curr.find(b => b.id === barberId);
      if (b) addToast(`▶ ${b.name} started — ${b.queue[0]?.name}`);
      return curr;
    });
  }, [addToast]);

  const handleCompleteService = useCallback((barberId) => {
    setBarbers(prev => {
      const b = prev.find(b => b.id === barberId);
      if (!b || !b.queue.length) return prev;
      const dur = SERVICE_DURATION[b.queue[0]?.service] ?? 20;
      const newServed = b.totalServed + 1;
      const newAvg = Math.round((b.avgTime * b.totalServed + dur) / newServed);
      addToast(`✓ Done — ${b.queue[0]?.name} served`);
      return prev.map(bar =>
        bar.id === barberId
          ? { ...bar, queue: bar.queue.slice(1), status: STATUS.AVAILABLE, totalServed: newServed, avgTime: newAvg, serviceStart: null }
          : bar
      );
    });
  }, [addToast]);

  const handleStatusChange = useCallback((barberId, newStatus) => {
    setBarbers(prev => prev.map(b => b.id === barberId ? { ...b, status: newStatus } : b));
    setBarbers(curr => {
      const b = curr.find(b => b.id === barberId);
      if (b) addToast(`${b.name} → ${newStatus}`, newStatus === STATUS.BREAK ? "warn" : "success");
      return curr;
    });
  }, [addToast]);

  const handleAddCustomer = useCallback((customer, forceBarberId) => {
    setBarbers(prev => {
      let targetId = forceBarberId;
      if (!targetId) {
        const best = findBestBarber(prev, customer.bookingType);
        if (!best) { addToast("⚠ No barbers available", "error"); return prev; }
        targetId = best.id;
      }
      return prev.map(b => {
        if (b.id !== targetId) return b;
        let newQueue;
        if (customer.bookingType === BOOKING_TYPE.PRIORITY && b.queue.length > 1) {
          newQueue = [b.queue[0], customer, ...b.queue.slice(1)];
        } else {
          newQueue = [...b.queue, customer];
        }
        return { ...b, queue: newQueue };
      });
    });
    setTimeout(() => {
      setBarbers(curr => {
        const assigned = curr.find(b => b.queue.some(c => c.id === customer.id));
        if (assigned) addToast(`${customer.name} → ${assigned.name} (${customer.bookingType})`);
        return curr;
      });
    }, 60);
  }, [addToast]);

  const handleReassign = useCallback((fromId, customerId, toId) => {
    setBarbers(prev => {
      const from = prev.find(b => b.id === fromId);
      const customer = from?.queue.find(c => c.id === customerId);
      if (!customer) return prev;
      const to = prev.find(b => b.id === toId);
      addToast(`↔ Reassigned to ${to?.name}`, "warn");
      return prev.map(b => {
        if (b.id === fromId) return { ...b, queue: b.queue.filter(c => c.id !== customerId), status: b.queue.length <= 1 ? STATUS.AVAILABLE : b.status };
        if (b.id === toId)   return { ...b, queue: [...b.queue, customer] };
        return b;
      });
    });
  }, [addToast]);

  const handleNoShow = useCallback((barberId, customer) => {
    setBarbers(prev => prev.map(b =>
      b.id === barberId
        ? { ...b, queue: b.queue.filter(c => c.id !== customer.id), status: STATUS.AVAILABLE, serviceStart: null }
        : b
    ));
    setNoShowTarget(null);
    addToast(`${customer.name} — No-Show. Queue updated.`, "warn");
  }, [addToast]);

  const totalInQueue = barbers.reduce((a, b) => a + b.queue.length, 0);
  const totalServed  = barbers.reduce((a, b) => a + b.totalServed, 0);
  const activeBarbers = barbers.filter(b => b.status !== STATUS.OFFLINE);
  const avgWait = activeBarbers.length
    ? activeBarbers.reduce((a, b) => a + calcWait(b.queue), 0) / activeBarbers.length
    : 0;
  const availableCount = barbers.filter(b => b.status === STATUS.AVAILABLE).length;

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="fixed inset-0 pointer-events-none opacity-40"
        style={{ backgroundImage: "radial-gradient(#e2e8f0 1px, transparent 1px)", backgroundSize: "28px 28px" }} />
      <div className="fixed top-0 right-0 w-80 h-80 bg-violet-100 rounded-full blur-3xl opacity-25 pointer-events-none" />
      <div className="fixed bottom-0 left-0 w-80 h-80 bg-orange-100 rounded-full blur-3xl opacity-20 pointer-events-none" />

      <div className="relative max-w-2xl mx-auto px-4 py-6">
        <div className="mb-6">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1">Barber Dashboard</p>
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-slate-900">Queue Control</h1>
            <button onClick={() => setShowAddModal(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 active:scale-95 transition-all shadow-sm">
              <span className="text-base leading-none">+</span> Add Customer
            </button>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-3 mb-6">
          {[
            { label: "In Queue",    value: totalInQueue,            color: "bg-violet-50 border-violet-200/60 text-violet-700" },
            { label: "Available",   value: `${availableCount}/4`,   color: "bg-emerald-50 border-emerald-200/60 text-emerald-700" },
            { label: "Avg Wait",    value: `${Math.round(avgWait)}m`, color: "bg-sky-50 border-sky-200/60 text-sky-700" },
            { label: "Served Today",value: totalServed,             color: "bg-orange-50 border-orange-200/60 text-orange-700" },
          ].map(s => (
            <div key={s.label} className={`rounded-2xl border px-3 py-3 text-center ${s.color}`}>
              <p className="text-lg font-bold">{s.value}</p>
              <p className="text-[10px] font-medium opacity-70 leading-tight mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-4">
          <AnimatePresence>
            {barbers.map(barber => (
              <BarberCard key={barber.id} barber={barber} allBarbers={barbers}
                onStartService={handleStartService}
                onCompleteService={handleCompleteService}
                onStatusChange={handleStatusChange}
                onNoShow={(customer) => setNoShowTarget({ barberId: barber.id, customer })}
                onReassign={handleReassign} />
            ))}
          </AnimatePresence>
        </div>

        <div className="mt-6 flex flex-wrap gap-2 justify-center">
          {Object.entries(STATUS_STYLE).map(([status, s]) => (
            <span key={status} className={`inline-flex items-center gap-1.5 text-[10px] font-medium px-2.5 py-1 rounded-full border ${s.badge}`}>
              <StatusDot status={status} />{status}
            </span>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {showAddModal && (
          <AddCustomerModal barbers={barbers} onAdd={handleAddCustomer} onClose={() => setShowAddModal(false)} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {noShowTarget && (
          <motion.div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center px-4 pb-4"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="absolute inset-0 bg-slate-900/20 backdrop-blur-[2px]" onClick={() => setNoShowTarget(null)} />
            <motion.div
              className="relative w-full max-w-xs bg-white rounded-2xl shadow-xl border border-slate-200/80 p-6 flex flex-col gap-4"
              initial={{ y: 32, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 32, opacity: 0 }}
              transition={{ type: "spring", damping: 26, stiffness: 320 }}>
              <div>
                <h3 className="text-sm font-semibold text-slate-900">Mark as No-Show?</h3>
                <p className="text-xs text-slate-500 mt-1">
                  <span className="font-medium text-slate-700">{noShowTarget.customer.name}</span> didn't arrive for{" "}
                  <span className="font-medium text-slate-700">{noShowTarget.customer.service}</span>. Next customer moves up.
                </p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => setNoShowTarget(null)}
                  className="flex-1 py-2.5 rounded-xl text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors">
                  Cancel
                </button>
                <button onClick={() => handleNoShow(noShowTarget.barberId, noShowTarget.customer)}
                  className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white bg-rose-500 hover:bg-rose-600 active:scale-95 transition-all">
                  Confirm
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-2 items-center">
        <AnimatePresence>
          {toasts.slice(-3).map(t => (
            <Toast key={t.id} message={t.message} type={t.type} onDone={() => removeToast(t.id)} />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}