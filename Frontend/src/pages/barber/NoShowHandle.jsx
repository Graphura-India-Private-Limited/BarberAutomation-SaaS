import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const INITIAL_QUEUE = [
  { id: 1, name: "Arjun Mehta", service: "Haircut + Beard", bookingType: "Priority", waitMins: 0, noShowCount: 2, avatar: "AM", avatarColor: "bg-violet-100 text-violet-700" },
  { id: 2, name: "Rohan Das", service: "Haircut", bookingType: "Slot", waitMins: 12, noShowCount: 0, avatar: "RD", avatarColor: "bg-sky-100 text-sky-700" },
  { id: 3, name: "Karan Verma", service: "Beard Trim", bookingType: "Walk-in", waitMins: 24, noShowCount: 1, avatar: "KV", avatarColor: "bg-emerald-100 text-emerald-700" },
  { id: 4, name: "Nikhil Joshi", service: "Combo", bookingType: "Walk-in", waitMins: 38, noShowCount: 0, avatar: "NJ", avatarColor: "bg-orange-100 text-orange-700" },
];

const NO_SHOW_REASONS = ["Customer not responding", "Left the queue", "Wrong contact number", "Walked out"];
const GRACE_SECONDS = 15;

function BookingBadge({ type }) {
  const map = {
    Priority: "bg-amber-50 text-amber-700 border-amber-300/50",
    Slot: "bg-sky-50 text-sky-700 border-sky-300/50",
    "Walk-in": "bg-slate-100 text-slate-600 border-slate-300/50",
  };
  return (
   <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${map[type] ?? map["Walk-in"]}`}>
      {type}
    </span>
  );
}

function NoShowBadge({ count }) {
  if (!count) return null;
  return (
    <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-rose-50 text-rose-600 border border-rose-300/40">
      <span className="w-1.5 h-1.5 rounded-full bg-rose-500 inline-block" />
      {count}× no-show
    </span>
  );
}

function GraceTimer({ seconds, total, onSkip }) {
  const r = 22;
  const circ = 2 * Math.PI * r;
  const dash = circ * (seconds / total);
  
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative w-16 h-16">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 56 56">
          <circle cx="28" cy="28" r={r} fill="none" stroke="#f1f5f9" strokeWidth="5" />
          <circle cx="28" cy="28" r={r} fill="none"
            stroke={seconds <= 5 ? "#ef4444" : "#f59e0b"}
            strokeWidth="5" strokeLinecap="round"
            /* ✅ Fixed: Added braces and backticks */
            strokeDasharray={`${dash} ${circ}`} 
            style={{ transition: "stroke-dasharray 1s linear, stroke 0.3s" }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          {/* ✅ Fixed: Added braces and backticks */}
          <span className={`text-lg font-bold tabular-nums ${seconds <= 5 ? "text-red-500" : "text-amber-600"}`}>
            {seconds}
          </span>
        </div>
      </div>
      <p className="text-xs text-slate-500 text-center leading-relaxed">
        Grace period active.<br />Waiting for customer…
      </p>
      <button onClick={onSkip} className="text-xs font-medium text-slate-500 underline underline-offset-2 hover:text-slate-700 transition-colors">
        Skip wait
      </button>
    </div>
  );
}

function NoShowModal({ customer, onConfirm, onCancel }) {
  const [phase, setPhase] = useState("grace");
  const [timeLeft, setTimeLeft] = useState(GRACE_SECONDS);
  const [selectedReason, setSelectedReason] = useState(null);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (phase !== "grace") return;
    intervalRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) { clearInterval(intervalRef.current); setPhase("reason"); return 0; }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(intervalRef.current);
  }, [phase]);

  const skipGrace = () => { clearInterval(intervalRef.current); setPhase("reason"); };

  const handleConfirm = () => {
    setPhase("done");
    setTimeout(() => onConfirm(customer.id, selectedReason), 800);
  };

  return (
    <motion.div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center px-4 pb-4 sm:pb-0"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <motion.div className="absolute inset-0 bg-slate-900/20 backdrop-blur-[2px]" onClick={onCancel} />
      <motion.div
        className="relative w-full max-w-sm bg-white rounded-2xl shadow-xl border border-slate-200/80 overflow-hidden"
        initial={{ y: 48, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 48, opacity: 0 }}
        transition={{ type: "spring", damping: 28, stiffness: 320 }}
      >
        <div className="absolute inset-0 opacity-[0.35] pointer-events-none"
          style={{ backgroundImage: "radial-gradient(#e2e8f0 1px, transparent 1px)", backgroundSize: "20px 20px" }} />
        <div className="relative p-6">
          <AnimatePresence mode="wait">
            {phase === "grace" && (
              <motion.div key="grace" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}
                className="flex flex-col items-center gap-4">
                <div className="flex items-center gap-3 w-full bg-slate-50 rounded-xl px-4 py-3 border border-slate-200/60">
                  <div className={'w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${customer.avatarColor}'}>
                    {customer.avatar}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-slate-900 truncate">{customer.name}</p>
                    <p className="text-xs text-slate-500 truncate">{customer.service}</p>
                  </div>
                  <NoShowBadge count={customer.noShowCount} />
                </div>
                <GraceTimer seconds={timeLeft} total={GRACE_SECONDS} onSkip={skipGrace} />
                <button onClick={onCancel} className="w-full py-2.5 rounded-xl text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors">
                  Cancel
                </button>
              </motion.div>
            )}

            {phase === "reason" && (
              <motion.div key="reason" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}
                className="flex flex-col gap-4">
                <div>
                  <h3 className="text-base font-semibold text-slate-900">Mark as No-Show?</h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    <span className="font-medium text-slate-700">{customer.name}</span> did not show up for{" "}
                    <span className="font-medium text-slate-700">{customer.service}</span>.
                  </p>
                </div>
                {customer.noShowCount >= 1 && (
                  <div className="flex items-start gap-2 bg-rose-50 border border-rose-200/60 rounded-xl px-3 py-2.5">
                    <span className="text-rose-500 mt-0.5 shrink-0 text-sm">⚠️</span>
                    <p className="text-xs text-rose-700">
                      This customer has <span className="font-semibold">{customer.noShowCount} previous</span> no-show{customer.noShowCount > 1 ? "s" : ""}. This will be logged.
                    </p>
                  </div>
                )}
                <div className="flex flex-col gap-2">
                  <p className="text-xs font-medium text-slate-600">Reason <span className="font-normal text-slate-400">(optional)</span></p>
                  <div className="grid grid-cols-2 gap-2">
                    {NO_SHOW_REASONS.map(r => (
                      <button key={r} onClick={() => setSelectedReason(selectedReason === r ? null : r)}
                        className={`text-left text-xs px-3 py-2 rounded-xl border font-medium transition-all ${
                          selectedReason === r ? "bg-slate-900 text-white border-slate-900" : "bg-white text-slate-600 border-slate-200 hover:border-slate-400"
                        }`}>
                        {r}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2 pt-1">
                  <button onClick={onCancel} className="flex-1 py-2.5 rounded-xl text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors">
                    Cancel
                  </button>
                  <button onClick={handleConfirm} className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white bg-rose-500 hover:bg-rose-600 active:scale-95 transition-all">
                    Confirm No-Show
                  </button>
                </div>
              </motion.div>
            )}

            {phase === "done" && (
              <motion.div key="done" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center gap-3 py-4">
                <motion.div className="w-14 h-14 rounded-full bg-slate-900 flex items-center justify-center"
                  initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", damping: 14 }}>
                  <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </motion.div>
                <p className="text-sm font-semibold text-slate-900">Marked & Queue Updated</p>
                <p className="text-xs text-slate-500">Next customer moving up…</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
}

function QueueCard({ customer, position, isCurrent, onNoShow }) {
  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 16 }} 
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -48, scale: 0.95 }}
      transition={{ type: "spring", damping: 25, stiffness: 280 }}
      /* ✅ Fixed: Wrapped in curly braces and backticks */
      className={`relative rounded-2xl border p-4 bg-white transition-shadow ${
        isCurrent ? "border-slate-300/80 shadow-md" : "border-slate-200/70 shadow-sm"
      }`}
    >
      {isCurrent && (
        <div className="absolute top-3 right-3">
          <span className="flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200/60 px-2 py-0.5 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse inline-block" />
            Current
          </span>
        </div>
      )}

      <div className="flex items-start gap-3">
        <div className="w-6 shrink-0 pt-0.5">
          {/* ✅ Fixed: Wrapped in curly braces and backticks */}
          <span className={`text-xs font-bold ${isCurrent ? "text-slate-900" : "text-slate-400"}`}>
            #{position}
          </span>
        </div>

        {/* ✅ Fixed: Used ONLY backticks, removed single quotes */}
        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${customer.avatarColor}`}>
          {customer.avatar}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-semibold text-slate-900">{customer.name}</span>
            <NoShowBadge count={customer.noShowCount} />
          </div>
          <p className="text-xs text-slate-500 mt-0.5">{customer.service}</p>
          <div className="flex items-center gap-2 mt-2 flex-wrap">
            <BookingBadge type={customer.bookingType} />
            {!isCurrent && <span className="text-[10px] text-slate-400">~{customer.waitMins} min wait</span>}
          </div>
        </div>
      </div>

      {isCurrent && (
        <button 
          onClick={() => onNoShow(customer)}
          className="mt-4 w-full py-2 rounded-xl text-xs font-semibold text-rose-600 bg-rose-50 border border-rose-200/60 hover:bg-rose-100 active:scale-95 transition-all"
        >
          Mark as No-Show
        </button>
      )}
    </motion.div>
  );
}

function Toast({ message, onDone }) {
  useEffect(() => { const t = setTimeout(onDone, 3000); return () => clearTimeout(t); }, [onDone]);
  return (
    <motion.div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-max max-w-xs px-2"
      initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }}>
      <div className="bg-slate-900 text-white text-xs font-medium px-5 py-3 rounded-2xl shadow-lg flex items-center gap-2">
        <svg className="w-4 h-4 text-emerald-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
        {message}
      </div>
    </motion.div>
  );
}

export default function NoShowHandler() {
  const [queue, setQueue] = useState(INITIAL_QUEUE);
  const [noShowTarget, setNoShowTarget] = useState(null);
  const [toast, setToast] = useState(null);

  const handleNoShowConfirm = (customerId, reason) => {
    const removed = queue.find(c => c.id === customerId);
    setQueue(prev => prev.filter(c => c.id !== customerId));
    setNoShowTarget(null);
    setToast(`${removed?.name} marked as no-show${reason ? ` - ${reason}` : ""}. Queue updated.`);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="fixed inset-0 pointer-events-none opacity-40"
        style={{ backgroundImage: "radial-gradient(#e2e8f0 1px, transparent 1px)", backgroundSize: "28px 28px" }} />
      <div className="fixed top-0 right-0 w-72 h-72 bg-violet-100 rounded-full blur-3xl opacity-30 pointer-events-none" />
      <div className="fixed bottom-0 left-0 w-72 h-72 bg-orange-100 rounded-full blur-3xl opacity-25 pointer-events-none" />

      <div className="relative max-w-sm mx-auto px-4 py-8">
        <div className="mb-6">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1">Live Queue</p>
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-slate-900">Your Queue</h1>
            <span className="text-xs font-medium text-slate-500 bg-white border border-slate-200 px-3 py-1 rounded-full shadow-sm">
              {queue.length} waiting
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <AnimatePresence>
            {queue.length === 0 ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="text-center py-16 text-slate-400">
                <div className="text-4xl mb-3">✓</div>
                <p className="text-sm font-medium">Queue is empty</p>
                <p className="text-xs mt-1">All customers served</p>
              </motion.div>
            ) : (
              queue.map((customer, idx) => (
                <QueueCard key={customer.id} customer={customer} position={idx + 1}
                  isCurrent={idx === 0} onNoShow={setNoShowTarget} />
              ))
            )}
          </AnimatePresence>
        </div>
      </div>

      <AnimatePresence>
        {noShowTarget && (
          <NoShowModal customer={noShowTarget} onConfirm={handleNoShowConfirm} onCancel={() => setNoShowTarget(null)} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {toast && <Toast message={toast} onDone={() => setToast(null)} />}
      </AnimatePresence>
    </div>
  );
}