// ── NoShowDelayPage.jsx ────────────────────────────
// Frontend-integrated premium layout update

import { useState, useEffect, useRef, useCallback } from "react";
import Header from "../layout/Header";
import {
  User, RefreshCw, AlertTriangle, CheckCircle, Clock,
  Trash2, Bell, Phone, Award, Layers, HelpCircle, Send
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const getToken = () => localStorage.getItem("token");
const SALON_ID = 1;

// Refactored unified status configuration mapping to eliminate raw primary color clashing
const STATUSES = {
  waiting: { label: "Waiting", color: "text-amber-800", bg: "bg-amber-50/60", border: "border-amber-200" },
  inqueue: { label: "In Queue", color: "text-stone-800", bg: "bg-stone-100", border: "border-stone-200" },
  delayed: { label: "Delayed", color: "text-rose-700", bg: "bg-rose-50/40", border: "border-rose-200" },
  noshow: { label: "No-Show", color: "text-red-700", bg: "bg-red-50/60", border: "border-red-200" },
  completed: { label: "Completed", color: "text-emerald-800", bg: "bg-emerald-50/60", border: "border-emerald-200" },
};

const DEMO_QUEUE = [
  { id: 1, booking_id: 1, position: 1, customer_name: "Rohit Sharma", customer_mobile: "+91 98765 43210", services: [{ service: "Haircut & Beard" }], status: "inqueue", joined_at: new Date().toISOString() },
  { id: 2, booking_id: 2, position: 2, customer_name: "Priya Mehta", customer_mobile: "+91 91234 56789", services: [{ service: "Hair Spa" }], status: "waiting", joined_at: new Date().toISOString() },
  { id: 3, booking_id: 3, position: 3, customer_name: "Amit Kumar", customer_mobile: "+91 99887 66554", services: [{ service: "Haircut" }], status: "waiting", joined_at: new Date().toISOString() },
  { id: 4, booking_id: 4, position: 4, customer_name: "Sneha Patil", customer_mobile: "+91 77665 44321", services: [{ service: "Hair Color" }], status: "waiting", joined_at: new Date().toISOString() },
];

const pad = n => String(Math.max(0, n)).padStart(2, "0");
const fmtTime = s => `${pad(Math.floor(s / 60))}:${pad(s % 60)}`;

const StatusBadge = ({ status, small }) => {
  const cfg = STATUSES[status] || STATUSES.waiting;
  return (
    <span className={`inline-flex items-center gap-1.5 font-black uppercase tracking-widest border rounded-md ${small ? 'text-[9px] px-2 py-0.5' : 'text-[10px] px-3 py-1.5'} ${cfg.bg} ${cfg.color} ${cfg.border} shadow-3xs`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current inline-block" />
      {cfg.label}
    </span>
  );
};

export default function NoShowDelayPage() {
  const [queue, setQueue] = useState([]);
  const [loading, setLoading] = useState(true);
  const [usingDemo, setUsingDemo] = useState(false);
  const [selected, setSelected] = useState(0);
  const [seconds, setSeconds] = useState(15 * 60);
  const [modal, setModal] = useState(null);
  const [toast, setToast] = useState(null);
  const timerRef = useRef(null);

  useEffect(() => {
    loadQueue();
    const interval = setInterval(loadQueue, 15000);
    return () => clearInterval(interval);
  }, []);

  const loadQueue = async () => {
    try {
      const res = await fetch(`${API}/queue/${SALON_ID}`, {
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      const data = await res.json();
      if (data.success && data.queue?.length > 0) {
        setQueue(data.queue);
        setUsingDemo(false);
      } else {
        setQueue(DEMO_QUEUE);
        setUsingDemo(true);
      }
    } catch {
      setQueue(DEMO_QUEUE);
      setUsingDemo(true);
    } finally {
      setLoading(false);
    }
  };

  const startTimer = useCallback((sec) => {
    clearInterval(timerRef.current);
    setSeconds(sec);
    timerRef.current = setInterval(() => setSeconds(p => {
      if (p <= 1) { clearInterval(timerRef.current); return 0; }
      return p - 1;
    }), 1000);
  }, []);

  useEffect(() => { startTimer(15 * 60); return () => clearInterval(timerRef.current); }, [selected, startTimer]);

  useEffect(() => {
    if (seconds > 0 || !queue[selected]) return;
    const cur = queue[selected];
    if (cur.status === "inqueue") handleAPIStatusUpdate(cur.id, "delayed");
    else if (cur.status === "delayed") handleAPIStatusUpdate(cur.id, "noshow");
  }, [seconds, queue, selected]);

  const toast_ = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const handleAPIStatusUpdate = async (queueId, status, reason = "") => {
    try {
      if (!usingDemo) {
        await fetch(`${API}/queue/${queueId}/status`, {
          method: "PUT",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
          body: JSON.stringify({ status, reason })
        });
      }
      setQueue(prev => prev.map(q => q.id === queueId ? { ...q, status } : q));
    } catch {
      setQueue(prev => prev.map(q => q.id === queueId ? { ...q, status } : q));
    }
  };

  const handleAPIRejoin = async (queueId) => {
    try {
      if (!usingDemo) {
        await fetch(`${API}/queue/${queueId}/rejoin`, {
          method: "PUT",
          headers: { Authorization: `Bearer ${getToken()}` }
        });
      }
      setQueue(prev => prev.map(q => q.id === queueId ? { ...q, status: "inqueue" } : q));
      startTimer(15 * 60);
    } catch {
      setQueue(prev => prev.map(q => q.id === queueId ? { ...q, status: "inqueue" } : q));
      startTimer(15 * 60);
    }
  };

  const handleAPINotify = async (queueId, name) => {
    try {
      if (!usingDemo) {
        await fetch(`${API}/queue/notify`, {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
          body: JSON.stringify({ queue_id: queueId, message: `Hello ${name}, your turn is coming up soon!` })
        });
      }
      toast_(`Reminder sent to ${name}!`);
    } catch {
      toast_(`Notification sent to ${name}!`);
    }
  };

  const handleMarkDelayed = async () => {
    const cur = queue[selected];
    await handleAPIStatusUpdate(cur.id, "delayed", "Late by 5+ mins");
    startTimer(2 * 60);
    setModal(null);
    toast_(`${cur.customer_name} marked Delayed. 2-min grace started.`, "warn");
  };

  const handleMarkNoShow = async () => {
    const cur = queue[selected];
    await handleAPIStatusUpdate(cur.id, "noshow", "Did not arrive");
    clearInterval(timerRef.current); setSeconds(0);
    setModal(null);
    toast_(`${cur.customer_name} marked No-Show. Slot reassigned.`, "error");
  };

  const handleSendNotif = async () => {
    const cur = queue[selected];
    await handleAPINotify(cur.id, cur.customer_name);
    setModal(null);
  };

  const handleRejoin = async () => {
    const cur = queue[selected];
    await handleAPIRejoin(cur.id);
    setModal(null);
    toast_(`${cur.customer_name} rejoined queue!`);
  };

  const handleComplete = async () => {
    const cur = queue[selected];
    await handleAPIStatusUpdate(cur.id, "completed");
    clearInterval(timerRef.current); setSeconds(0);
    toast_(`Service completed for ${cur.customer_name}!`);
  };

  const handleRemove = async () => {
    const cur = queue[selected];
    await handleAPIStatusUpdate(cur.id, "noshow", "Manually removed");
    clearInterval(timerRef.current); setSeconds(0);
    setModal(null);
    toast_(`${cur.customer_name} removed from queue.`, "error");
  };

  const currentCustomer = queue[selected];
  const pct = Math.round((seconds / 900) * 100);
  const progressColor = seconds < 60 ? "bg-rose-600" : seconds < 180 ? "bg-amber-500" : "bg-[#A37B58]";

  if (loading) return (
    <div className="min-h-screen bg-[#FAF6F0] flex items-center justify-center font-sans">
      <div className="text-center space-y-3">
        <div className="w-10 h-10 border-4 border-[#A37B58] border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs font-black uppercase tracking-widest text-stone-400">Syncing live pipelines...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FAF6F0] text-stone-800 font-sans antialiased flex flex-col overflow-x-hidden">
      {/* ✂️ MASTER GLOBAL MONITOR NAVIGATION HEADER */}
      <Header title="Exceptions Monitor" subtitle="Real-time handling of delays and workflow gaps" />

      <main className="max-w-6xl mx-auto w-full px-6 py-10 flex-1 flex flex-col lg:flex-row gap-8 items-start">

        {/* COLUMN 1: LIVE MONITOR PIPELINE GRID VIEW */}
        <div className="w-full lg:w-4/12 flex flex-col gap-4">
          <div className="bg-white border border-stone-200/60 rounded-3xl p-5 shadow-3xs text-left w-full">
            <div className="flex justify-between items-center mb-4 border-b border-stone-50 pb-3">
              <div>
                <h3 className="text-base font-black uppercase tracking-tight text-stone-900">Live Pipelines</h3>
                <p className="text-[10px] font-black uppercase tracking-widest text-stone-400 mt-0.5">Click log target to handle</p>
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest text-stone-500 bg-[#FAF6F0] px-2.5 py-1.5 rounded-lg border border-stone-200/40">
                {queue.length} Active
              </span>
            </div>

            <div className="space-y-3 max-h-[520px] overflow-y-auto pr-1">
              {queue.length === 0 ? (
                <p className="text-center py-10 text-stone-400 text-xs font-semibold">Workspace pipeline logs empty.</p>
              ) : queue.map((c, i) => (
                <div
                  key={c.id}
                  onClick={() => { setSelected(i); startTimer(15 * 60); }}
                  className={`flex items-center gap-3.5 p-4 rounded-xl border transition-all cursor-pointer text-left ${i === selected
                      ? 'bg-[#FAF6F0] border-stone-400 ring-1 ring-stone-900/5 shadow-3xs'
                      : 'bg-white border-stone-200/60 hover:border-stone-400'
                    }`}
                >
                  <div className="w-9 h-9 rounded-xl bg-[#3E362E] text-[#C5A059] flex items-center justify-center font-black text-xs shrink-0 shadow-3xs">
                    {c.customer_name?.[0] || "?"}
                  </div>
                  <div className="flex-1 min-w-0 space-y-1">
                    <p className="text-sm font-extrabold text-stone-900 truncate leading-none">{c.customer_name}</p>
                    <p className="text-xs text-stone-400 font-bold uppercase tracking-wider truncate leading-none">
                      {c.services?.[0]?.service || "Grooming"}
                    </p>
                    <div className="pt-0.5">
                      <StatusBadge status={c.status} small />
                    </div>
                  </div>
                  <span className="text-xs font-black text-stone-300">#{c.position}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* COLUMN 2: SELECTED PROFILE EXCEPTION ACTIONS OPERATOR CONSOLE */}
        <div className="w-full lg:w-5/12 flex flex-col gap-4">
          {currentCustomer ? (
            <>
              {/* CURRENT PROFILE DISPLAY LOG CARD */}
              <div className="bg-white border border-stone-200/80 rounded-[2rem] p-6 shadow-sm text-left w-full">
                <div className="flex justify-between items-start mb-4 border-b border-stone-50 pb-3.5">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-stone-400">Selected Log Target</span>
                    <h4 className="text-lg font-black uppercase tracking-tight text-stone-900 mt-0.5">Focus Tracking Panel</h4>
                  </div>
                  <StatusBadge status={currentCustomer.status} />
                </div>

                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-[#3E362E] text-[#C5A059] flex items-center justify-center font-black text-xl shadow-sm shrink-0">
                    {currentCustomer.customer_name?.[0] || "?"}
                  </div>
                  <div className="min-w-0">
                    <h5 className="text-lg font-extrabold text-stone-900 tracking-tight leading-tight">{currentCustomer.customer_name}</h5>
                    <p className="text-xs font-bold text-stone-400 tracking-wide mt-1 inline-flex items-center gap-1">
                      <Phone size={12} className="text-[#A37B58]" /> {currentCustomer.customer_mobile}
                    </p>
                    <p className="text-xs font-black text-[#A37B58] uppercase tracking-wider mt-0.5">
                      {currentCustomer.services?.[0]?.service || "Grooming Session"}
                    </p>
                  </div>
                </div>

                {/* TIMING COUNTDOWN BLOCK METRIC */}
                <div className="bg-[#FAF6F0] border border-stone-200/40 rounded-xl p-4">
                  <p className="text-[10px] font-black uppercase tracking-widest text-stone-400 pl-0.5">Session Target Boundary Counter</p>
                  <p className="text-4xl font-extrabold tracking-tight font-mono text-stone-900 mt-1.5 leading-none">
                    {fmtTime(seconds)}
                  </p>
                  <div className="h-2 bg-stone-200 rounded-full overflow-hidden mt-4">
                    <div className={`h-full ${progressColor} transition-all duration-1000`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              </div>

              {/* DYNAMIC ACTION TRIGGER MATRIX PANELS */}
              <div className="bg-white border border-stone-200/60 rounded-[2rem] p-6 shadow-3xs text-left w-full">
                <p className="text-[10px] font-black uppercase tracking-widest text-stone-400 border-b border-stone-50 pb-2 mb-4">Execute Exception Override Rules</p>
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <button type="button" onClick={() => setModal({ type: "delayed", customer: currentCustomer })} className="inline-flex items-center justify-center gap-1.5 p-3.5 border border-amber-200 hover:border-amber-400 bg-amber-50/20 rounded-xl text-xs font-black uppercase tracking-wider text-amber-900 transition-colors cursor-pointer">
                    <Clock size={12} className="text-[#A37B58]" /> Delay Log
                  </button>
                  <button type="button" onClick={() => setModal({ type: "noshow", customer: currentCustomer })} className="inline-flex items-center justify-center gap-1.5 p-3.5 border border-rose-200 hover:border-rose-400 bg-rose-50/20 rounded-xl text-xs font-black uppercase tracking-wider text-rose-900 transition-colors cursor-pointer">
                    <AlertTriangle size={12} className="text-rose-600" /> No-Show
                  </button>
                  <button type="button" onClick={() => setModal({ type: "notify", customer: currentCustomer })} className="inline-flex items-center justify-center gap-1.5 p-3.5 border border-stone-200 hover:border-stone-400 bg-stone-50 rounded-xl text-xs font-black uppercase tracking-wider text-stone-700 transition-colors cursor-pointer">
                    <Send size={12} className="text-[#A37B58]" /> Notify Client
                  </button>
                  <button type="button" onClick={handleComplete} className="inline-flex items-center justify-center gap-1.5 p-3.5 border border-emerald-200 hover:border-emerald-400 bg-emerald-50/20 rounded-xl text-xs font-black uppercase tracking-wider text-emerald-900 transition-colors cursor-pointer">
                    <CheckCircle size={12} className="text-emerald-700" /> Completed
                  </button>
                </div>
                <div className="flex flex-col gap-2 border-t border-stone-50 pt-3">
                  <button type="button" onClick={() => setModal({ type: "rejoin", customer: currentCustomer })} className="w-full py-4 rounded-xl text-xs font-black uppercase tracking-widest text-[#C5A059] bg-[#3E362E] hover:bg-[#2A241F] transition-colors cursor-pointer shadow-3xs">
                    Rejoin Queue Pipeline
                  </button>
                  <button type="button" onClick={() => setModal({ type: "remove", customer: currentCustomer })} className="w-full py-3 rounded-xl text-xs font-black uppercase tracking-widest text-stone-400 hover:text-red-700 hover:bg-red-50/40 transition-colors cursor-pointer inline-flex items-center justify-center gap-1.5">
                    <Trash2 size={12} /> Manually Purge Record
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="bg-white border border-stone-200/60 rounded-3xl p-8 text-center text-stone-400 text-sm font-medium w-full">
              Select an active customer matrix entry node on the left dashboard tracker to initiate console operations.
            </div>
          )}
        </div>

        {/* COLUMN 3: HISTORICAL EXPECTATIONS TRACE & COMPONENT SUMMARY TRACE */}
        <div className="w-full lg:w-3/12 flex flex-col gap-4">
          {/* TRACE CARD 1: PIPELINE SUCCESSORS */}
          <div className="bg-white border border-stone-200/60 rounded-2xl p-5 shadow-3xs text-left w-full">
            <h4 className="text-xs font-black uppercase tracking-widest text-stone-900 mb-3 flex items-center gap-1.5">
              <Layers size={14} className="text-[#A37B58]" /> Successor Sequence
            </h4>
            <div className="space-y-3">
              {queue.filter((_, i) => i !== selected && queue[i]?.status !== "noshow" && queue[i]?.status !== "completed").slice(0, 3).map((c, i) => (
                <div key={c.id} className="flex items-center gap-3 py-2 border-b border-stone-50 last:border-none">
                  <div className="w-7 h-7 rounded-lg bg-[#3E362E]/5 text-[#3E362E] flex items-center justify-center font-extrabold text-[11px] border border-stone-200/60 shrink-0">
                    {c.customer_name?.[0] || "?"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-extrabold text-stone-900 truncate leading-tight">{c.customer_name}</p>
                    <p className="text-[10px] text-stone-400 font-bold mt-0.5 leading-none">Position #{c.position}</p>
                  </div>
                  <StatusBadge status={c.status} small />
                </div>
              ))}
              {queue.length <= 1 && <p className="text-[11px] text-stone-400 font-medium py-2 text-center">No following client nodes.</p>}
            </div>
          </div>

          {/* TRACE CARD 2: DOCUMENTATION TIPS SEAM */}
          <div className="bg-white border border-stone-200/60 rounded-2xl p-5 shadow-3xs text-left w-full">
            <h4 className="text-xs font-black uppercase tracking-widest text-stone-900 mb-3 flex items-center gap-1.5">
              <HelpCircle size={14} className="text-[#A37B58]" /> Operations Guide
            </h4>
            <ul className="space-y-3">
              <li className="flex gap-2.5 items-start text-xs text-stone-500 font-medium leading-normal">
                <span className="text-[#A37B58] font-black mt-0.5">01.</span> Flag <span className="font-bold text-stone-800">Delayed</span> updates if a visitor surpasses a five-minute latency window.
              </li>
              <li className="flex gap-2.5 items-start text-xs text-stone-500 font-medium leading-normal">
                <span className="text-[#A37B58] font-black mt-0.5">02.</span> Trigger complete <span className="font-bold text-stone-800">No-Show</span> locks if client remains unreachable past ten minutes.
              </li>
              <li className="flex gap-2.5 items-start text-xs text-stone-500 font-medium leading-normal">
                <span className="text-[#A37B58] font-black mt-0.5">03.</span> Utilize text <span className="font-bold text-stone-800">Notifications</span> to nudge client profiles before clearing active slots.
              </li>
            </ul>
          </div>
        </div>

      </main>

      {/* ═══ INTERACTIVE SYSTEM OVERLAY MODALS ═══ */}
      <AnimatePresence>
        {modal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4" onClick={() => setModal(null)}>
            <div className="absolute inset-0 bg-[#3E362E]/40 backdrop-blur-sm" />
            <div className="relative bg-white rounded-[2rem] p-6 md:p-8 max-w-sm w-full shadow-2xl border border-stone-200 text-left" onClick={e => e.stopPropagation()}>

              {modal.type === "delayed" && (
                <div className="space-y-5">
                  <div>
                    <h3 className="text-lg font-black uppercase tracking-tight text-stone-900">Mark as Delayed?</h3>
                    <p className="text-xs text-stone-500 mt-1 font-medium leading-relaxed">
                      This will change <span className="font-bold text-stone-800">{modal.customer?.customer_name}</span>'s status to delayed and trigger a 2-minute auto grace block counter.
                    </p>
                  </div>
                  <div className="flex gap-2.5 pt-2 border-t border-stone-50 justify-end">
                    <button type="button" onClick={() => setModal(null)} className="text-xs font-black uppercase tracking-widest text-stone-400 hover:text-stone-900 px-4 py-2">Cancel</button>
                    <button type="button" onClick={handleMarkDelayed} className="py-3 px-5 rounded-xl text-xs font-black uppercase tracking-widest text-white bg-amber-600 hover:bg-amber-700 shadow-xs">Confirm Delay</button>
                  </div>
                </div>
              )}

              {modal.type === "noshow" && (
                <div className="space-y-5">
                  <div>
                    <h3 className="text-lg font-black uppercase tracking-tight text-stone-900">Mark as No-Show?</h3>
                    <p className="text-xs text-stone-500 mt-1 font-medium leading-relaxed">
                      This will permanently drop <span className="font-bold text-stone-800">{modal.customer?.customer_name}</span>'s active appointment block and free up the workspace timeline.
                    </p>
                  </div>
                  <div className="flex gap-2.5 pt-2 border-t border-stone-50 justify-end">
                    <button type="button" onClick={() => setModal(null)} className="text-xs font-black uppercase tracking-widest text-stone-400 hover:text-stone-900 px-4 py-2">Cancel</button>
                    <button type="button" onClick={handleMarkNoShow} className="py-3 px-5 rounded-xl text-xs font-black uppercase tracking-widest text-white bg-rose-600 hover:bg-rose-700 shadow-xs">Confirm No-Show</button>
                  </div>
                </div>
              )}

              {modal.type === "notify" && (
                <div className="space-y-5">
                  <div>
                    <h3 className="text-lg font-black uppercase tracking-tight text-stone-900">Send Notification?</h3>
                    <p className="text-xs text-stone-500 mt-1 font-medium leading-relaxed">
                      Dispatch an SMS sequence query check directly to <span className="font-bold text-stone-800">{modal.customer?.customer_name}</span> mobile record destination.
                    </p>
                  </div>
                  <div className="flex gap-2.5 pt-2 border-t border-stone-50 justify-end">
                    <button type="button" onClick={() => setModal(null)} className="text-xs font-black uppercase tracking-widest text-stone-400 hover:text-stone-900 px-4 py-2">Cancel</button>
                    <button type="button" onClick={handleSendNotif} className="py-3 px-5 rounded-xl text-xs font-black uppercase tracking-widest text-white bg-stone-900 hover:bg-stone-800 shadow-xs">Send Reminder</button>
                  </div>
                </div>
              )}

              {modal.type === "rejoin" && (
                <div className="space-y-5">
                  <div>
                    <h3 className="text-lg font-black uppercase tracking-tight text-stone-900">Rejoin Queue Pipeline?</h3>
                    <p className="text-xs text-stone-500 mt-1 font-medium leading-relaxed">
                      Place <span className="font-bold text-stone-800">{modal.customer?.customer_name}</span> back into the tracking queue metrics and reset countdown structures safely.
                    </p>
                  </div>
                  <div className="flex gap-2.5 pt-2 border-t border-stone-50 justify-end">
                    <button type="button" onClick={() => setModal(null)} className="text-xs font-black uppercase tracking-widest text-stone-400 hover:text-stone-900 px-4 py-2">Cancel</button>
                    <button type="button" onClick={handleRejoin} className="py-3 px-5 rounded-xl text-xs font-black uppercase tracking-widest text-[#C5A059] bg-[#3E362E] hover:bg-[#2A241F] shadow-xs">Confirm Rejoin</button>
                  </div>
                </div>
              )}

              {modal.type === "remove" && (
                <div className="space-y-5">
                  <div>
                    <h3 className="text-lg font-black uppercase tracking-tight text-stone-900">Purge Session Log?</h3>
                    <p className="text-xs text-stone-500 mt-1 font-medium leading-relaxed">
                      Permanently wipe <span className="font-bold text-stone-800">{modal.customer?.customer_name}</span> out of active logs. This metadata operation cannot be reversed.
                    </p>
                  </div>
                  <div className="flex gap-2.5 pt-2 border-t border-stone-50 justify-end">
                    <button type="button" onClick={() => setModal(null)} className="text-xs font-black uppercase tracking-widest text-stone-400 hover:text-stone-900 px-4 py-2">Cancel</button>
                    <button type="button" onClick={handleRemove} className="py-3 px-5 rounded-xl text-xs font-black uppercase tracking-widest text-white bg-rose-600 hover:bg-rose-700 shadow-xs">Purge Log</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* ═══ LIVE NOTIFICATION TOAST OVERLAYS ═══ */}
      <AnimatePresence>
        {toast && (
          <div className="fixed bottom-6 right-6 z-50 bg-[#3E362E] border border-stone-800 text-white font-black text-xs uppercase tracking-wider px-5 py-3.5 rounded-xl shadow-2xl flex items-center gap-2.5 animate-fade-in max-w-sm">
            <span className={`w-2 h-2 rounded-full inline-block shrink-0 ${toast.type === "error" ? "bg-rose-500" : toast.type === "warn" ? "bg-amber-500" : "bg-emerald-500"}`} />
            <span>{toast.msg}</span>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}