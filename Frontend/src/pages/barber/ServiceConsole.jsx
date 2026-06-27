import React, { useState, useEffect, useRef, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  CheckCircle, PlusCircle, ArrowLeft, User, X, Trash2, Clock,
  AlertTriangle, Send, RefreshCw, Bell, Phone, Award, Layers, HelpCircle, Play, Pause, ChevronRight
} from "lucide-react";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const getToken = () => localStorage.getItem("token");

const STATUSES = {
  waiting: { label: "Waiting", color: "text-amber-800", bg: "bg-amber-50/60", border: "border-amber-200" },
  inqueue: { label: "In Queue", color: "text-stone-800", bg: "bg-stone-100", border: "border-stone-200" },
  "in-progress": { label: "In Service", color: "text-emerald-800", bg: "bg-emerald-50/60", border: "border-emerald-200" },
  busy: { label: "In Service", color: "text-emerald-800", bg: "bg-emerald-50/60", border: "border-emerald-200" },
  delayed: { label: "Delayed", color: "text-rose-700", bg: "bg-rose-50/40", border: "border-rose-200" },
  noshow: { label: "No-Show", color: "text-red-700", bg: "bg-red-50/60", border: "border-red-200" },
  completed: { label: "Completed", color: "text-emerald-800", bg: "bg-emerald-50/60", border: "border-emerald-200" },
};

const DEMO_QUEUE = [
  { id: 1, booking_id: 1, position: 1, customer_name: "Rohit Sharma", customer_mobile: "+91 98765 43210", services: [{ service: "Haircut & Beard" }], status: "in-progress", joined_at: new Date().toISOString() },
  { id: 2, booking_id: 2, position: 2, customer_name: "Priya Mehta", customer_mobile: "+91 91234 56789", services: [{ service: "Hair Spa" }], status: "waiting", joined_at: new Date().toISOString() },
  { id: 3, booking_id: 3, position: 3, customer_name: "Amit Kumar", customer_mobile: "+91 99887 66554", services: [{ service: "Haircut" }], status: "waiting", joined_at: new Date().toISOString() },
  { id: 4, booking_id: 4, position: 4, customer_name: "Sneha Patil", customer_mobile: "+91 77665 44321", services: [{ service: "Hair Color" }], status: "waiting", joined_at: new Date().toISOString() },
];

const NO_SHOW_REASONS = ["Not responding", "Left the queue", "Wrong number", "Walked out"];
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
            stroke={seconds <= 120 ? "#EF4444" : "#C5A059"}
            strokeWidth="4" strokeLinecap="round"
            strokeDasharray={`${dash} ${circ}`} 
            style={{ transition: "stroke-dasharray 1s linear, stroke 0.3s" }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`text-sm font-black tabular-nums ${seconds <= 120 ? "text-red-600" : "text-[#3E362E]"}`}>
            {Math.floor(seconds / 60)}m
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
        className="text-[10px] font-black uppercase tracking-widest text-[#C5A059] hover:text-[#8F6947] transition-colors mt-1 bg-transparent border-none cursor-pointer"
      >
        Skip Wait Time ➔
      </button>
    </div>
  );
}

export default function ServiceConsole() {
  const navigate = useNavigate();

  const [queue, setQueue] = useState([]);
  const [loading, setLoading] = useState(true);
  const [usingDemo, setUsingDemo] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [elapsedTimes, setElapsedTimes] = useState({});

  const barberId = localStorage.getItem("barberId");
  const activeQueue = queue.filter(c => {
    if (c.status === "completed" || c.status === "noshow") return false;
    if (barberId && !usingDemo) {
      return c.barber_id === barberId;
    }
    return true;
  });
  const cur = activeQueue.find(c => c.id === selectedId) || activeQueue[0];

  // Set/Sync selectedId
  useEffect(() => {
    if (activeQueue.length > 0) {
      if (!selectedId || !activeQueue.some(c => c.id === selectedId)) {
        setSelectedId(activeQueue[0].id);
      }
    } else {
      setSelectedId(null);
    }
  }, [activeQueue, selectedId]);

  // Derive activeSeconds
  const activeSeconds = cur 
    ? (elapsedTimes[cur.id] !== undefined 
        ? elapsedTimes[cur.id] 
        : ((cur.status === "in-progress" || cur.status === "busy") && cur.served_at 
            ? Math.max(0, Math.floor((Date.now() - new Date(cur.served_at).getTime()) / 1000)) 
            : 0)) 
    : 0;

  // Twin Timers
  const [graceSeconds, setGraceSeconds] = useState(15 * 60);
  const [activeTimerStatus, setActiveTimerStatus] = useState("paused");

  const [showServices, setShowServices] = useState(false);
  const [selectedServices, setSelectedServices] = useState([]);
  const [modal, setModal] = useState(null);
  const [toast, setToast] = useState(null);

  const graceTimerRef = useRef(null);
  const activeTimerRef = useRef(null);

  const baseService = React.useMemo(() => {
    if (cur && cur.services && cur.services.length > 0) {
      const s = cur.services[0];
      return {
        name: s.service_name || s.service || "Grooming Session",
        price: s.price !== undefined ? s.price : 499
      };
    }
    return {
      name: "Premium Haircut",
      price: 499,
    };
  }, [cur]);

  const extraServices = [
    { id: 1, name: "Beard Shape", price: 150 },
    { id: 2, name: "Head Massage (Oil)", price: 100 },
    { id: 3, name: "Face D-Tan", price: 350 },
    { id: 4, name: "Hair Color (Black)", price: 500 },
  ];

  const loadQueue = async () => {
    try {
      const salonId = localStorage.getItem("salonId");
      if (!salonId) {
        setQueue(prev => prev.length > 0 ? prev : DEMO_QUEUE);
        setUsingDemo(true);
        setLoading(false);
        return;
      }
      const res = await fetch(`${API}/queue/${salonId}`, {
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      const data = await res.json();
      if (data.success) {
        const mapped = (data.queue || []).map(q => ({
          id: q._id,
          booking_id: q.booking_id?._id || q.booking_id,
          position: q.position,
          customer_name: q.customer_id?.name || q.name || "Walk-in Customer",
          customer_mobile: q.customer_id?.mobile || q.phone || "No Mobile",
          services: q.booking_id?.services || [{ service_name: q.service || "Grooming Session", price: q.booking_id?.total_amount || 499 }],
          status: q.status, // waiting, in-progress, paused, delayed, noshow, completed
          joined_at: q.joined_at,
          served_at: q.served_at,
          barber_id: q.barber_id?._id || q.barber_id || null
        }));
        setQueue(mapped);
        setUsingDemo(false);
      } else {
        setQueue(prev => prev.length > 0 ? prev : DEMO_QUEUE);
        setUsingDemo(true);
      }
    } catch (err) {
      console.error(err);
      setQueue(prev => prev.length > 0 ? prev : DEMO_QUEUE);
      setUsingDemo(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadQueue();
    const interval = setInterval(loadQueue, 15000);
    return () => clearInterval(interval);
  }, []);

  // Grace timer handler
  const startGraceTimer = useCallback((sec) => {
    clearInterval(graceTimerRef.current);
    setGraceSeconds(sec);
    graceTimerRef.current = setInterval(() => {
      setGraceSeconds((p) => {
        if (p <= 1) {
          clearInterval(graceTimerRef.current);
          return 0;
        }
        return p - 1;
      });
    }, 1000);
  }, []);

  // Sync grace timer depending on selection status
  useEffect(() => {
    if (cur) {
      const isWaiting = cur.status === "waiting" || cur.status === "inqueue" || cur.status === "in-queue";
      const isDelayed = cur.status === "delayed";
      
      if (isWaiting) {
        startGraceTimer(15 * 60);
      } else if (isDelayed) {
        startGraceTimer(2 * 60);
      } else {
        clearInterval(graceTimerRef.current);
      }
    }
    return () => clearInterval(graceTimerRef.current);
  }, [cur?.id, cur?.status, startGraceTimer]);

  // Automated status timeouts
  useEffect(() => {
    if (graceSeconds > 0 || !cur) return;
    if (cur.status === "inqueue" || cur.status === "waiting" || cur.status === "in-queue") {
      handleAPIStatusUpdate(cur.id, "delayed", "Grace timer expired");
    } else if (cur.status === "delayed") {
      handleAPIStatusUpdate(cur.id, "noshow", "No-show timeout");
    }
  }, [graceSeconds, cur?.id, cur?.status]);

  // Active session timer counting up
  useEffect(() => {
    clearInterval(activeTimerRef.current);
    if (activeTimerStatus === "running" && cur) {
      activeTimerRef.current = setInterval(() => {
        setElapsedTimes((prev) => ({
          ...prev,
          [cur.id]: (prev[cur.id] !== undefined 
            ? prev[cur.id] 
            : ((cur.status === "in-progress" || cur.status === "busy") && cur.served_at 
                ? Math.max(0, Math.floor((Date.now() - new Date(cur.served_at).getTime()) / 1000)) 
                : 0)) + 1
        }));
      }, 1000);
    }
    return () => clearInterval(activeTimerRef.current);
  }, [activeTimerStatus, cur?.id, cur?.status]);

  // Sync active timer status depending on selected customer
  useEffect(() => {
    if (cur) {
      const isInChair = cur.status === "in-progress" || cur.status === "busy";
      if (isInChair) {
        setActiveTimerStatus("running");
      } else {
        setActiveTimerStatus("paused");
      }
    } else {
      setActiveTimerStatus("paused");
    }
  }, [cur?.id, cur?.status]);

  const toast_ = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleAPIStatusUpdate = async (queueId, status, reason = "") => {
    try {
      if (!usingDemo) {
        await fetch(`${API}/queue/${queueId}/status`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getToken()}`,
          },
          body: JSON.stringify({ status, reason }),
        });
      }
      setQueue(prev => prev.map(q => q.id === queueId ? { ...q, status } : q));
    } catch (err) {
      console.error(err);
      setQueue(prev => prev.map(q => q.id === queueId ? { ...q, status } : q));
    }
  };

  const handleAPIRejoin = async (queueId) => {
    try {
      if (!usingDemo) {
        await fetch(`${API}/noshow/${queueId}/rejoin`, {
          method: "PUT",
          headers: { Authorization: `Bearer ${getToken()}` }
        });
      }
      setQueue(prev => prev.map(q => q.id === queueId ? { ...q, status: "waiting" } : q));
      startGraceTimer(15 * 60);
    } catch (err) {
      console.error(err);
      setQueue(prev => prev.map(q => q.id === queueId ? { ...q, status: "waiting" } : q));
      startGraceTimer(15 * 60);
    }
  };

  const handleAPINotify = async (queueId, name) => {
    try {
      if (!usingDemo) {
        await fetch(`${API}/queue/notify`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getToken()}`,
          },
          body: JSON.stringify({
            queue_id: queueId,
            message: `Hello ${name}, your turn is coming up soon!`,
          }),
        });
      }
      toast_(`Reminder sent to ${name}!`);
    } catch {
      toast_(`Notification sent to ${name}!`);
    }
  };

  const handleStartService = async () => {
    if (!cur) return;
    
    // Automatically complete any other currently in-progress or busy customer
    const activeInChair = queue.find(q => q.id !== cur.id && (q.status === "in-progress" || q.status === "busy"));
    if (activeInChair) {
      await handleAPIStatusUpdate(activeInChair.id, "completed", "Auto-completed on next service start");
    }

    await handleAPIStatusUpdate(cur.id, "in-progress");
    setElapsedTimes(prev => ({ ...prev, [cur.id]: 0 }));
    setActiveTimerStatus("running");
    toast_(`Service started for ${cur.customer_name}!`);
  };

  const handleMarkDelayed = async () => {
    if (!cur) return;
    await handleAPIStatusUpdate(cur.id, "delayed", "Late by 5+ mins");
    startGraceTimer(2 * 60);
    setModal(null);
    toast_(`${cur.customer_name} marked Delayed. 2-min grace started.`, "warn");
  };

  const handleMarkNoShow = async (reason = "") => {
    if (!cur) return;
    await handleAPIStatusUpdate(cur.id, "noshow", reason || "Did not arrive");
    clearInterval(graceTimerRef.current);
    setGraceSeconds(0);
    setModal(null);
    toast_(`${cur.customer_name} marked No-Show. Slot reassigned.`, "error");
  };

  const handleSendNotif = async () => {
    if (!cur) return;
    await handleAPINotify(cur.id, cur.customer_name);
    setModal(null);
  };

  const handleRejoin = async () => {
    if (!cur) return;
    await handleAPIRejoin(cur.id);
    setModal(null);
    toast_(`${cur.customer_name} rejoined waitlist!`);
  };

  const handleCompleteService = async () => {
    if (!cur) return;
    await handleAPIStatusUpdate(cur.id, "completed");
    clearInterval(activeTimerRef.current);
    setElapsedTimes(prev => ({ ...prev, [cur.id]: 0 }));
    alert(`Service Completed ✅\n\nCustomer: ${cur.customer_name}\nTotal Bill: ₹${totalAmount}`);
    toast_(`Completed - ${cur.customer_name}`);
    setTimeout(() => {
      navigate("/barber/overview");
    }, 1000);
  };

  const handleRemove = async () => {
    if (!cur) return;
    await handleAPIStatusUpdate(cur.id, "noshow", "Manually removed");
    clearInterval(graceTimerRef.current);
    setGraceSeconds(0);
    setModal(null);
    toast_(`${cur.customer_name} removed from queue.`, "error");
  };

  const addService = (service) => {
    const alreadyAdded = selectedServices.find(
      (item) => item.id === service.id
    );
    if (alreadyAdded) return;
    setSelectedServices((prev) => [...prev, service]);
    setShowServices(false);
  };

  const removeService = (id) => {
    setSelectedServices((prev) =>
      prev.filter((service) => service.id !== id)
    );
  };

  const totalAmount =
    baseService.price +
    selectedServices.reduce((acc, item) => acc + item.price, 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF6F0] flex items-center justify-center font-sans">
        <div className="text-center space-y-3">
          <Clock className="w-10 h-10 text-[#C5A059] animate-spin mx-auto" />
          <p className="text-xs font-black uppercase tracking-widest text-[#3E362E] animate-pulse">Syncing live pipelines...</p>
        </div>
      </div>
    );
  }

  const isInChair = cur && (cur.status === "in-progress" || cur.status === "busy");
  const progressPct = Math.round((graceSeconds / 900) * 100);
  const progressColor = graceSeconds < 60 ? "bg-rose-600" : graceSeconds < 180 ? "bg-amber-500" : "bg-[#C5A059]";

  return (
    <div className="w-full text-stone-800 font-sans antialiased flex flex-col overflow-x-hidden min-h-screen bg-[#FAF6F0]">
      <main className="max-w-[1450px] mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 flex-1 flex flex-col lg:flex-row gap-6 items-start">
        
        {/* COLUMN 1: LIVE MONITOR PIPELINE GRID VIEW */}
        <div className="w-full lg:w-3/12 flex flex-col gap-4">
          <div className="bg-white border border-stone-200/60 rounded-3xl p-5 shadow-3xs text-left w-full">
            <div className="flex justify-between items-center mb-4 border-b border-stone-50 pb-3">
              <div>
                <h3 className="text-base font-black uppercase tracking-tight text-stone-900">Live Pipelines</h3>
                <p className="text-[10px] font-black uppercase tracking-widest text-stone-400 mt-0.5">Click log target to handle</p>
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest text-stone-500 bg-[#FAF6F0] px-2.5 py-1.5 rounded-lg border border-stone-200/40">
                {activeQueue.length} Active
              </span>
            </div>

            <div className="space-y-3 max-h-[560px] overflow-y-auto pr-1">
              {activeQueue.length === 0 ? (
                <p className="text-center py-10 text-stone-400 text-xs font-semibold">Workspace pipeline logs empty.</p>
              ) : activeQueue.map((c) => (
                <div
                  key={c.id}
                  onClick={() => setSelectedId(c.id)}
                  className={`flex items-center gap-3.5 p-4 rounded-xl border transition-all cursor-pointer text-left ${c.id === cur?.id
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
                      {c.services?.[0]?.service_name || c.services?.[0]?.service || "Grooming"}
                    </p>
                    <div className="pt-0.5">
                      <StatusBadge status={c.status} small />
                    </div>
                  </div>
                  <span className="text-xs font-black text-stone-300">
                    {c.status === "in-progress" ? "In Chair" : `#${c.position}`}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* COLUMN 2: SELECTED PROFILE WORKSPACE CONSOLE */}
        <div className="w-full lg:w-6/12 flex flex-col gap-4">
          {cur ? (
            <div className="bg-white border border-stone-200/80 rounded-[2rem] p-6 shadow-sm text-left w-full space-y-6 relative">
              
              {/* Profile Details Header */}
              <div className="flex justify-between items-start border-b border-stone-50 pb-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-[#3E362E] text-[#C5A059] flex items-center justify-center font-black text-xl shadow-sm shrink-0">
                    {cur.customer_name?.[0] || "?"}
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] font-black uppercase tracking-widest text-[#C5A059] block">
                      Active Customer Panel
                    </span>
                    <h4 className="text-lg font-black tracking-tight text-stone-900 mt-0.5 leading-none">
                      {cur.customer_name}
                    </h4>
                    <p className="text-xs font-bold text-stone-400 mt-1 inline-flex items-center gap-1">
                      <Phone size={12} className="text-[#C5A059]" /> {cur.customer_mobile}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <StatusBadge status={cur.status} />
                  {isInChair && (
                    <button
                      onClick={() => setActiveTimerStatus(prev => prev === "running" ? "paused" : "running")}
                      className={`px-3 py-1 rounded-full text-[10px] font-black tracking-wider uppercase border transition-all ${
                        activeTimerStatus === "running"
                          ? "bg-[#FAF6F0] text-[#A37B58] border-[#EADDCA]"
                          : "bg-red-50 text-red-500 border-red-200"
                      }`}
                    >
                      {activeTimerStatus === "running" ? "busy" : "paused"}
                    </button>
                  )}
                </div>
              </div>

              {/* TIMERS AND DYNAMIC BODY */}
              {isInChair ? (
                /* IN-PROGRESS / CHAIR VIEW */
                <div className="space-y-6">
                  {/* Elapsed Timer bubble */}
                  <div className="flex justify-center py-2">
                    <div className="relative w-44 h-44 flex items-center justify-center border-4 border-[#FAF6F0] rounded-full bg-gradient-to-br from-white to-stone-50 shadow-3xs">
                      <div className="text-center">
                        <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest">
                          Elapsed
                        </p>
                        <div className="text-3xl font-black text-stone-900 font-mono">
                          {fmtTime(activeSeconds)}
                        </div>
                        <p className="text-[9px] text-[#C5A059] font-bold mt-1">
                          ACTIVE SESSION
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Billing Details list */}
                  <div className="bg-stone-50 rounded-2xl p-4 border border-[#EADDCA] relative">
                    <p className="text-[10px] font-black uppercase tracking-widest text-[#8A7B6A] border-b border-[#EADDCA]/60 pb-2 mb-3">
                      Grooming Invoice Details
                    </p>
                    <div className="flex justify-between text-sm font-bold mb-2">
                      <span>{baseService.name}</span>
                      <span>₹{baseService.price}</span>
                    </div>

                    {selectedServices.length > 0 && (
                      <div className="space-y-2 mt-4 pt-4 border-t border-stone-200/50">
                        {selectedServices.map((service) => (
                          <div
                            key={service.id}
                            className="flex justify-between items-center bg-white rounded-xl px-3 py-2 border border-stone-200"
                          >
                            <div>
                              <p className="text-sm font-semibold">{service.name}</p>
                              <p className="text-xs text-stone-500">Extra Service</p>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="font-black text-sm">₹{service.price}</span>
                              <button
                                onClick={() => removeService(service.id)}
                                className="text-red-400 hover:text-red-600 transition bg-transparent border-none cursor-pointer p-0"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Total Amount Checkout */}
                    <div className="flex justify-between items-center mt-5 pt-4 border-t border-dashed border-stone-300">
                      <span className="font-black uppercase text-sm">Total Amount</span>
                      <span className="text-2xl font-black text-[#C5A059]">₹{totalAmount}</span>
                    </div>

                    {/* Extra services selector popup */}
                    {showServices && (
                      <div className="absolute bottom-[90px] left-4 right-4 bg-white border border-[#EADDCA] rounded-2xl shadow-2xl p-4 z-50 animate-in slide-in-from-bottom-4">
                        <div className="flex items-center justify-between mb-4">
                          <p className="text-[10px] font-black uppercase text-stone-400">Add Extra Service</p>
                          <button onClick={() => setShowServices(false)} className="text-stone-400 hover:text-black bg-transparent border-none cursor-pointer">
                            <X size={18} />
                          </button>
                        </div>
                        <div className="space-y-2">
                          {extraServices.map((service) => (
                            <button
                              key={service.id}
                              onClick={() => addService(service)}
                              className="w-full flex justify-between items-center px-4 py-3 text-sm font-bold bg-stone-50 rounded-xl hover:bg-[#C5A059]/10 transition-all border-none cursor-pointer"
                            >
                              <span>{service.name}</span>
                              <span className="text-[#C5A059]">₹{service.price}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Primary Billing Trigger */}
                  <div className="grid grid-cols-6 gap-3">
                    <button
                      onClick={handleCompleteService}
                      className="col-span-5 flex items-center justify-center gap-2 text-white py-4 rounded-xl font-black text-xs uppercase tracking-widest bg-[#3E362E] hover:bg-[#C5A059] hover:text-[#2A241F] transition-all cursor-pointer border-none shadow-md"
                    >
                      <CheckCircle size={16} />
                      Complete & Bill
                    </button>
                    <button
                      onClick={() => setShowServices(prev => !prev)}
                      className={`col-span-1 flex items-center justify-center border rounded-xl transition-all cursor-pointer ${
                        showServices
                          ? "bg-[#3E362E] text-[#C5A059] border-[#3E362E]"
                          : "border-[#EADDCA] text-[#3E362E] hover:bg-stone-50 bg-white"
                      }`}
                    >
                      <PlusCircle size={22} />
                    </button>
                  </div>
                </div>
              ) : (
                /* WAITING / DELAYED GRACE COUNTDOWN VIEW */
                <div className="space-y-6">
                  <GraceTimer
                    seconds={graceSeconds}
                    total={cur.status === "delayed" ? 2 * 60 : 15 * 60}
                    onSkip={() => {
                      if (cur.status === "delayed") handleMarkNoShow("Grace period skipped");
                      else handleMarkDelayed();
                    }}
                  />

                  {/* Start service trigger */}
                  <button
                    onClick={handleStartService}
                    className="w-full py-4 bg-[#3E362E] hover:bg-[#C5A059] text-white hover:text-[#2A241F] font-black uppercase text-xs tracking-widest rounded-xl transition-all cursor-pointer border-none shadow-md flex items-center justify-center gap-2"
                  >
                    <Play size={14} className="fill-current" />
                    Start Service Now
                  </button>
                </div>
              )}

              {/* CONSOLE OPERATIONS MATRIX */}
              <div className="border-t border-stone-100 pt-5 space-y-4">
                <p className="text-[10px] font-black uppercase tracking-widest text-stone-400">Exception Override Controls</p>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    disabled={cur.status === "delayed"}
                    onClick={() => setModal({ type: "delayed" })}
                    className="flex items-center justify-center gap-1.5 p-3.5 border border-amber-200 hover:border-amber-400 bg-amber-50/20 rounded-xl text-xs font-black uppercase tracking-wider text-amber-900 transition-colors cursor-pointer disabled:opacity-50"
                  >
                    <Clock size={12} /> Delay Log
                  </button>
                  <button
                    type="button"
                    disabled={cur.status === "noshow"}
                    onClick={() => setModal({ type: "noshow" })}
                    className="flex items-center justify-center gap-1.5 p-3.5 border border-rose-200 hover:border-rose-400 bg-rose-50/20 rounded-xl text-xs font-black uppercase tracking-wider text-rose-900 transition-colors cursor-pointer disabled:opacity-50"
                  >
                    <AlertTriangle size={12} className="text-rose-600" /> No-Show
                  </button>
                  <button
                    type="button"
                    onClick={() => setModal({ type: "notify" })}
                    className="flex items-center justify-center gap-1.5 p-3.5 border border-stone-200 hover:border-stone-400 bg-stone-50 rounded-xl text-xs font-black uppercase tracking-wider text-stone-700 transition-colors cursor-pointer"
                  >
                    <Send size={12} /> Notify Client
                  </button>
                  <button
                    type="button"
                    onClick={() => setModal({ type: "rejoin" })}
                    className="flex items-center justify-center gap-1.5 p-3.5 border border-[#C5A059]/30 hover:border-[#C5A059] bg-[#FAF6F0] rounded-xl text-xs font-black uppercase tracking-wider text-[#8A7B6A] transition-colors cursor-pointer"
                  >
                    <RefreshCw size={12} /> Rejoin Queue
                  </button>
                </div>

                <div className="text-center pt-2">
                  <button
                    type="button"
                    onClick={() => setModal({ type: "remove" })}
                    className="py-2.5 text-xs font-black uppercase tracking-widest text-stone-400 hover:text-red-700 transition-colors bg-transparent border-none cursor-pointer inline-flex items-center gap-1.5"
                  >
                    <Trash2 size={12} /> Manually Purge Record
                  </button>
                </div>
              </div>

            </div>
          ) : (
            <div className="bg-white border border-stone-200/60 rounded-3xl p-12 text-center text-stone-400 text-sm font-medium w-full">
              Select an active customer matrix entry node on the left dashboard tracker to initiate console operations.
            </div>
          )}
        </div>

        {/* COLUMN 3: HISTORICAL EXPECTATIONS TRACE & COMPONENT SUMMARY TRACE */}
        <div className="w-full lg:w-3/12 flex flex-col gap-4">
          {/* TRACE CARD 1: PIPELINE SUCCESSORS */}
          <div className="bg-white border border-stone-200/60 rounded-2xl p-5 shadow-3xs text-left w-full">
            <h4 className="text-xs font-black uppercase tracking-widest text-stone-900 mb-3 flex items-center gap-1.5 border-b border-stone-50 pb-2">
              <Layers size={14} className="text-[#C5A059]" /> Successor Sequence
            </h4>
            <div className="space-y-3">
              {activeQueue.filter((c) => c.id !== cur?.id).slice(0, 3).map((c) => (
                <div key={c.id} className="flex items-center gap-3 py-2 border-b border-stone-50 last:border-none">
                  <div className="w-7 h-7 rounded-lg bg-[#3E362E]/5 text-[#3E362E] flex items-center justify-center font-extrabold text-[11px] border border-stone-200/60 shrink-0">
                    {c.customer_name?.[0] || "?"}
                  </div>
                  <div className="flex-1 min-w-0 text-left">
                    <p className="text-xs font-extrabold text-stone-900 truncate leading-tight">{c.customer_name}</p>
                    <p className="text-[10px] text-stone-400 font-bold mt-0.5 leading-none">Position #{c.position}</p>
                  </div>
                  <StatusBadge status={c.status} small />
                </div>
              ))}
              {activeQueue.length <= 1 && <p className="text-[11px] text-stone-400 font-medium py-2 text-center">No following client nodes.</p>}
            </div>
          </div>

          {/* TRACE CARD 2: DOCUMENTATION TIPS SEAM */}
          <div className="bg-white border border-stone-200/60 rounded-2xl p-5 shadow-3xs text-left w-full">
            <h4 className="text-xs font-black uppercase tracking-widest text-stone-900 mb-3 flex items-center gap-1.5 border-b border-stone-50 pb-2">
              <HelpCircle size={14} className="text-[#C5A059]" /> Operations Guide
            </h4>
            <ul className="space-y-3 pl-0 list-none text-left">
              <li className="flex gap-2.5 items-start text-xs text-stone-500 font-medium leading-normal">
                <span className="text-[#C5A059] font-black mt-0.5">01.</span>
                <span>Click <strong>Start Service</strong> to lock client in chair and activate elapsed billing timers.</span>
              </li>
              <li className="flex gap-2.5 items-start text-xs text-stone-500 font-medium leading-normal">
                <span className="text-[#C5A059] font-black mt-0.5">02.</span>
                <span>Flag <strong>Delayed</strong> updates if a waitlist visitor exceeds their expected check-in grace.</span>
              </li>
              <li className="flex gap-2.5 items-start text-xs text-stone-500 font-medium leading-normal">
                <span className="text-[#C5A059] font-black mt-0.5">03.</span>
                <span>Trigger complete <strong>No-Show</strong> logs once the grace timer hits 0 to reassign slots.</span>
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
            <motion.div 
              className="relative bg-white rounded-[2rem] p-6 md:p-8 max-w-sm w-full shadow-2xl border border-stone-200 text-left z-10" 
              onClick={e => e.stopPropagation()}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
            >
              {modal.type === "delayed" && (
                <div className="space-y-5">
                  <div>
                    <h3 className="text-lg font-black uppercase tracking-tight text-stone-900">Mark as Delayed?</h3>
                    <p className="text-xs text-stone-500 mt-1 font-medium leading-relaxed">
                      This will change <span className="font-bold text-stone-800">{cur.customer_name}</span>'s status to delayed and trigger a 2-minute auto grace block counter.
                    </p>
                  </div>
                  <div className="flex gap-2.5 pt-2 border-t border-stone-50 justify-end">
                    <button type="button" onClick={() => setModal(null)} className="text-xs font-black uppercase tracking-widest text-stone-400 hover:text-stone-900 px-4 py-2 bg-transparent border-none cursor-pointer">Cancel</button>
                    <button type="button" onClick={handleMarkDelayed} className="py-3 px-5 rounded-xl text-xs font-black uppercase tracking-widest text-white bg-amber-600 hover:bg-amber-700 shadow-xs border-none cursor-pointer">Confirm Delay</button>
                  </div>
                </div>
              )}

              {modal.type === "noshow" && (
                <div className="space-y-5">
                  <div>
                    <h3 className="text-lg font-black uppercase tracking-tight text-stone-900">Mark as No-Show?</h3>
                    <p className="text-xs text-stone-500 mt-1 font-medium leading-relaxed">
                      Please select a reason for documenting <span className="font-extrabold text-stone-800">{cur.customer_name}</span>'s absence in the workspace records.
                    </p>
                  </div>
                  <div className="flex flex-col gap-2">
                    {NO_SHOW_REASONS.map(r => (
                      <button
                        key={r}
                        type="button"
                        onClick={() => handleMarkNoShow(r)}
                        className="text-left text-xs px-4 py-3 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 text-stone-600 font-bold transition-all cursor-pointer"
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                  <div className="flex gap-2.5 pt-2 border-t border-stone-50 justify-end">
                    <button type="button" onClick={() => setModal(null)} className="text-xs font-black uppercase tracking-widest text-stone-400 hover:text-stone-900 px-4 py-2 bg-transparent border-none cursor-pointer">Cancel</button>
                  </div>
                </div>
              )}

              {modal.type === "notify" && (
                <div className="space-y-5">
                  <div>
                    <h3 className="text-lg font-black uppercase tracking-tight text-stone-900">Send Notification?</h3>
                    <p className="text-xs text-stone-500 mt-1 font-medium leading-relaxed">
                      Dispatch an SMS sequence query check directly to <span className="font-bold text-stone-800">{cur.customer_name}</span>'s mobile record.
                    </p>
                  </div>
                  <div className="flex gap-2.5 pt-2 border-t border-stone-50 justify-end">
                    <button type="button" onClick={() => setModal(null)} className="text-xs font-black uppercase tracking-widest text-stone-400 hover:text-stone-900 px-4 py-2 bg-transparent border-none cursor-pointer">Cancel</button>
                    <button type="button" onClick={handleSendNotif} className="py-3 px-5 rounded-xl text-xs font-black uppercase tracking-widest text-white bg-stone-900 hover:bg-stone-800 shadow-xs border-none cursor-pointer">Send Reminder</button>
                  </div>
                </div>
              )}

              {modal.type === "rejoin" && (
                <div className="space-y-5">
                  <div>
                    <h3 className="text-lg font-black uppercase tracking-tight text-stone-900">Rejoin Queue Pipeline?</h3>
                    <p className="text-xs text-stone-500 mt-1 font-medium leading-relaxed">
                      Place <span className="font-bold text-stone-800">{cur.customer_name}</span> back into the tracking queue metrics and reset countdown structures safely.
                    </p>
                  </div>
                  <div className="flex gap-2.5 pt-2 border-t border-stone-50 justify-end">
                    <button type="button" onClick={() => setModal(null)} className="text-xs font-black uppercase tracking-widest text-stone-400 hover:text-stone-900 px-4 py-2 bg-transparent border-none cursor-pointer">Cancel</button>
                    <button type="button" onClick={handleRejoin} className="py-3 px-5 rounded-xl text-xs font-black uppercase tracking-widest text-[#C5A059] bg-[#3E362E] hover:bg-[#2A241F] shadow-xs border-none cursor-pointer">Confirm Rejoin</button>
                  </div>
                </div>
              )}

              {modal.type === "remove" && (
                <div className="space-y-5">
                  <div>
                    <h3 className="text-lg font-black uppercase tracking-tight text-stone-900">Purge Session Log?</h3>
                    <p className="text-xs text-stone-500 mt-1 font-medium leading-relaxed">
                      Permanently wipe <span className="font-bold text-stone-800">{cur.customer_name}</span> out of active logs. This metadata operation cannot be reversed.
                    </p>
                  </div>
                  <div className="flex gap-2.5 pt-2 border-t border-stone-50 justify-end">
                    <button type="button" onClick={() => setModal(null)} className="text-xs font-black uppercase tracking-widest text-stone-400 hover:text-stone-900 px-4 py-2 bg-transparent border-none cursor-pointer">Cancel</button>
                    <button type="button" onClick={handleRemove} className="py-3 px-5 rounded-xl text-xs font-black uppercase tracking-widest text-white bg-rose-600 hover:bg-rose-700 shadow-xs border-none cursor-pointer">Purge Log</button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ═══ LIVE NOTIFICATION TOAST OVERLAYS ═══ */}
      <AnimatePresence>
        {toast && (
          <motion.div 
            className="fixed bottom-6 right-6 z-50 bg-[#3E362E] border border-stone-800 text-white font-black text-xs uppercase tracking-wider px-5 py-3.5 rounded-xl shadow-2xl flex items-center gap-2.5 max-w-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
          >
            <span className={`w-2 h-2 rounded-full inline-block shrink-0 ${toast.type === "error" ? "bg-rose-500" : toast.type === "warn" ? "bg-amber-500" : "bg-emerald-500"}`} />
            <span>{toast.msg}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}