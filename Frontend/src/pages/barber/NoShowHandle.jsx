import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Header from "../../components/layout/Header";
import { Scissors, AlertTriangle, CheckCircle, Clock, Trash2, HelpCircle } from "lucide-react";

const INITIAL_QUEUE = [
  { id: 1, name: "Arjun Mehta", service: "Haircut + Beard", bookingType: "Priority", waitMins: 0, noShowCount: 2, avatar: "AM", avatarColor: "bg-amber-100 text-amber-900 border-amber-300/40" },
  { id: 2, name: "Rohan Das", service: "Haircut", bookingType: "Slot", waitMins: 12, noShowCount: 0, avatar: "RD", avatarColor: "bg-[#3E362E]/5 text-[#3E362E] border-stone-200" },
  { id: 3, name: "Karan Verma", service: "Beard Trim", bookingType: "Walk-in", waitMins: 24, noShowCount: 1, avatar: "KV", avatarColor: "bg-[#3E362E]/5 text-[#3E362E] border-stone-200" },
  { id: 4, name: "Nikhil Joshi", service: "Combo", bookingType: "Walk-in", waitMins: 38, noShowCount: 0, avatar: "NJ", avatarColor: "bg-[#3E362E]/5 text-[#3E362E] border-stone-200" },
];

const NO_SHOW_REASONS = ["Not responding", "Left the queue", "Wrong number", "Walked out"];
const GRACE_SECONDS = 15;

function BookingBadge({ type }) {
  const map = {
    Priority: "bg-amber-50 text-amber-800 border-amber-300/50",
    Slot: "bg-stone-100 text-stone-800 border-stone-300/50",
    "Walk-in": "bg-stone-50 text-stone-500 border-stone-200",
  };
  return (
    <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md border ${map[type] ?? map["Walk-in"]}`}>
      {type}
    </span>
  );
}

function NoShowBadge({ count }) {
  if (!count) return null;
  return (
    <span className="inline-flex items-center gap-1 text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-rose-50 text-rose-700 border border-rose-200">
      <span className="w-1 h-1 rounded-full bg-rose-600 inline-block" />
      {count}× no-show
    </span>
  );
}

function GraceTimer({ seconds, total, onSkip }) {
  const r = 22;
  const circ = 2 * Math.PI * r;
  const dash = circ * (seconds / total);
  
  return (
    <div className="flex flex-col items-center gap-3 py-2 bg-[#FAF6F0] rounded-2xl border border-stone-200/40 p-4 w-full">
      <div className="relative w-16 h-16">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 56 56">
          <circle cx="28" cy="28" r={r} fill="none" stroke="#EFEBE4" strokeWidth="4" />
          <circle cx="28" cy="28" r={r} fill="none"
            stroke={seconds <= 5 ? "#EF4444" : "#A37B58"}
            strokeWidth="4" strokeLinecap="round"
            strokeDasharray={`${dash} ${circ}`} 
            style={{ transition: "stroke-dasharray 1s linear, stroke 0.3s" }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`text-lg font-black tabular-nums ${seconds <= 5 ? "text-red-600" : "text-stone-800"}`}>
            {seconds}s
          </span>
        </div>
      </div>
      <div className="text-center">
        <p className="text-[10px] font-black uppercase tracking-wider text-stone-800">Grace Timer Active</p>
        <p className="text-[11px] text-stone-500 mt-0.5 font-medium">Holding workspace slot for client...</p>
      </div>
      <button 
        type="button"
        onClick={onSkip} 
        className="text-[10px] font-black uppercase tracking-widest text-[#A37B58] hover:text-[#8F6947] transition-colors mt-1"
      >
        Skip Wait Time ➔
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
    <motion.div className="fixed inset-0 z-50 flex items-center justify-center px-4"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <motion.div className="absolute inset-0 bg-[#3E362E]/40 backdrop-blur-sm" onClick={onCancel} />
      <motion.div
        className="relative w-full max-w-md bg-white rounded-[2rem] shadow-2xl border border-stone-200 overflow-hidden text-left"
        initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
      >
        <div className="relative p-6 md:p-8">
          <AnimatePresence mode="wait">
            {phase === "grace" && (
              <motion.div key="grace" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                className="flex flex-col items-center gap-5">
                <div className="flex items-center gap-3.5 w-full bg-[#FAF6F0] rounded-xl px-4 py-3.5 border border-stone-200/60">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-black border ${customer.avatarColor}`}>
                    {customer.avatar}
                  </div>
                  <div className="min-w-0 flex-1 text-left">
                    <p className="text-base font-extrabold text-stone-900 truncate">{customer.name}</p>
                    <p className="text-xs font-semibold text-stone-400 uppercase tracking-wider mt-0.5">{customer.service}</p>
                  </div>
                  <NoShowBadge count={customer.noShowCount} />
                </div>
                <GraceTimer seconds={timeLeft} total={GRACE_SECONDS} onSkip={skipGrace} />
                <button type="button" onClick={onCancel} className="w-full py-3.5 rounded-xl text-xs font-black uppercase tracking-widest text-stone-400 bg-stone-100 hover:bg-stone-200 hover:text-stone-700 transition-colors">
                  Dismiss Actions
                </button>
              </motion.div>
            )}

            {phase === "reason" && (
              <motion.div key="reason" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                className="flex flex-col gap-5">
                <div>
                  <h3 className="text-xl font-black uppercase tracking-tight text-stone-900">Flag Absence Logs</h3>
                  <p className="text-xs text-stone-500 mt-1 font-medium leading-relaxed">
                    Log custom abandonment records for <span className="font-extrabold text-stone-800">{customer.name}</span> profile track inputs.
                  </p>
                </div>
                {customer.noShowCount >= 1 && (
                  <div className="flex items-start gap-2.5 bg-rose-50 border border-rose-200 rounded-xl px-4 py-3">
                    <AlertTriangle className="text-rose-600 mt-0.5 shrink-0" size={16} />
                    <p className="text-xs text-rose-800 font-medium leading-normal">
                      Critical Notice: Customer contains <span className="font-black text-rose-950">{customer.noShowCount} historical no-shows</span>. Proceeding adds restrictions onto their account metadata.
                    </p>
                  </div>
                )}
                <div className="flex flex-col gap-2">
                  <p className="text-[10px] font-black uppercase tracking-widest text-stone-400 pl-0.5">Select Pipeline Mismatch Reason</p>
                  <div className="grid grid-cols-2 gap-2">
                    {NO_SHOW_REASONS.map(r => (
                      <button key={r} type="button" onClick={() => setSelectedReason(selectedReason === r ? null : r)}
                        className={`text-left text-xs px-4 py-3 rounded-xl border font-bold transition-all ${
                          selectedReason === r ? "bg-[#3E362E] text-white border-[#3E362E]" : "bg-white text-stone-600 border-stone-200 hover:border-stone-400"
                        }`}>
                        {r}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex gap-3 pt-2 border-t border-stone-50 justify-end">
                  <button type="button" onClick={onCancel} className="text-xs font-black uppercase tracking-widest text-stone-400 hover:text-stone-900 px-4 py-3 transition-colors">
                    Cancel
                  </button>
                  <button type="button" onClick={handleConfirm} className="py-3.5 px-5 rounded-xl text-xs font-black uppercase tracking-widest text-white bg-rose-600 hover:bg-rose-700 transition-all shadow-xs">
                    Confirm Log Absence
                  </button>
                </div>
              </motion.div>
            )}

            {phase === "done" && (
              <motion.div key="done" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center gap-3 py-6 text-center">
                <div className="w-12 h-12 rounded-xl bg-[#3E362E] flex items-center justify-center shadow-md">
                  <CheckCircle className="text-[#C5A059]" size={24} />
                </div>
                <div>
                  <p className="text-base font-extrabold text-stone-900 uppercase tracking-tight">Logs Fixed & Appended</p>
                  <p className="text-xs font-medium text-stone-400 mt-1">Re-indexing client queue queues dynamically...</p>
                </div>
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
      initial={{ opacity: 0, y: 12 }} 
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      className={`relative rounded-2xl border p-5 bg-white flex flex-col justify-between transition-all ${
        isCurrent ? "border-stone-300 shadow-md ring-1 ring-stone-900/5" : "border-stone-200/60 shadow-2xs"
      }`}
    >
      {isCurrent && (
        <div className="absolute top-4 right-4">
          <span className="flex items-center gap-1 text-[9px] font-black uppercase tracking-widest text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-md">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse inline-block" />
            Live Turn
          </span>
        </div>
      )}

      <div className="flex items-start gap-4">
        <div className="w-6 shrink-0 pt-1">
          <span className={`text-xs font-black ${isCurrent ? "text-stone-900" : "text-stone-300"}`}>
            #{position}
          </span>
        </div>

        <div className={`w-11 h-11 rounded-full flex items-center justify-center text-sm font-black border shrink-0 shadow-3xs ${customer.avatarColor}`}>
          {customer.avatar}
        </div>

        <div className="flex-1 min-w-0 text-left">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-base font-extrabold text-stone-900 tracking-tight leading-none">{customer.name}</span>
            <NoShowBadge count={customer.noShowCount} />
          </div>
          <p className="text-xs font-bold text-stone-400 uppercase tracking-wider mt-1.5">{customer.service}</p>
          
          <div className="flex items-center gap-3 mt-3 flex-wrap">
            <BookingBadge type={customer.bookingType} />
            {!isCurrent && (
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-stone-400 bg-stone-50/40 px-2 py-0.5 rounded border border-stone-200/30">
                <Clock size={10} />
                ~{customer.waitMins} min wait
              </span>
            )}
          </div>
        </div>
      </div>

      {isCurrent && (
        <button 
          type="button"
          onClick={() => onNoShow(customer)}
          className="mt-5 w-full py-3.5 rounded-xl text-xs font-black uppercase tracking-widest text-rose-600 bg-rose-50/40 border border-rose-200 hover:bg-rose-50 hover:text-rose-700 transition-all cursor-pointer shadow-3xs"
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
      initial={{ y: 15, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 15, opacity: 0 }}>
      <div className="bg-[#3E362E] border border-[#2A241F] text-white text-xs font-black uppercase tracking-wider px-5 py-3.5 rounded-xl shadow-xl flex items-center gap-2.5">
        <CheckCircle className="text-[#C5A059] shrink-0" size={14} />
        <span>{message}</span>
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
    setToast(`${removed?.name || "Client"} removed out of queue pipeline.`);
  };

  return (
    <div className="min-h-screen bg-[#FAF6F0] text-stone-800 font-sans antialiased flex flex-col">
      <Header 
      title="Absence Tracking" 
      subtitle="Live Studio Client Monitor Framework" 
    />

      <main className="max-w-2xl mx-auto w-full px-6 py-10 flex-1 text-center">
        
        {/* TOP COMPONENT CAPTION CONTROLS HEADER */}
        <div className="mb-8 border-b border-stone-200/60 pb-5 text-left flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-stone-900 uppercase">
              No-Show Customers
            </h1>
            <p className="text-xs font-black uppercase tracking-widest text-[#A37B58] mt-1.5">
              Live Studio Client Monitor Framework
            </p>
          </div>
          <span className="text-[10px] font-black uppercase tracking-widest text-stone-500 bg-white border border-stone-200 px-3 py-2 rounded-xl shadow-3xs">
            {queue.length} Total Logs Waiting
          </span>
        </div>

        {/* LOOP INJECTS ACCELERATED LAYOUT ITEMS */}
        <div className="flex flex-col gap-4">
          <AnimatePresence mode="popLayout">
            {queue.length === 0 ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="text-center py-16 bg-white border border-stone-200/50 rounded-2xl shadow-3xs text-stone-400 flex flex-col items-center justify-center gap-2">
                <div className="w-12 h-12 rounded-xl bg-[#FAF7F2] flex items-center justify-center text-[#A37B58] border border-stone-200/30">
                  <Scissors size={20} />
                </div>
                <div>
                  <p className="text-sm font-black uppercase tracking-tight text-stone-900 mt-2">Active Monitor Clear</p>
                  <p className="text-xs font-medium text-stone-400 mt-0.5">All customer slots have been processed safely.</p>
                </div>
              </motion.div>
            ) : (
              queue.map((customer, idx) => (
                <QueueCard key={customer.id} customer={customer} position={idx + 1}
                  isCurrent={idx === 0} onNoShow={setNoShowTarget} />
              ))
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* OVERLAY WRAPPERS COMPONENT TRIGGERS */}
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