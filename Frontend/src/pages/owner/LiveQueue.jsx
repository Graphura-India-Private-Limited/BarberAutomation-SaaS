import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft, RefreshCw, Phone, Sparkles, Play, Check,
  Users, Clock, AlertCircle, Activity
} from "lucide-react";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export default function LiveQueue() {
  const navigate = useNavigate();
  const [queue,       setQueue]       = useState([]);
  const [barbers,     setBarbers]     = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [toast,       setToast]       = useState(null);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [busyId,      setBusyId]      = useState(null);
  const [lastUpdate,  setLastUpdate]  = useState(null);
  const [usingDemo,   setUsingDemo]   = useState(false);
  const intervalRef = useRef(null);

  const salonId = localStorage.getItem("salonId");
  const token   = localStorage.getItem("token");

  const headers = () => ({
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  });

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  /* ── Fetch queue + barbers in parallel ── */
  const fetchData = async () => {
    if (!salonId) {
      showToast("Salon ID missing. Please re-login.", "error");
      setLoading(false);
      return;
    }
    try {
      const [qRes, dRes] = await Promise.all([
        fetch(`${API}/queue/${salonId}`, { headers: headers() }).then(r => r.json()),
        fetch(`${API}/owner/salon/${salonId}/dashboard`, { headers: headers() }).then(r => r.json()),
      ]);
      
      if (qRes.success) {
        setQueue(qRes.queue || []);
        setUsingDemo(false);
      } else {
        if (queue.length === 0) {
          setQueue(MOCK_QUEUE);
        }
        setUsingDemo(true);
      }
      
      if (dRes.success && dRes.barbers && dRes.barbers.length > 0) {
        setBarbers(dRes.barbers);
      } else {
        if (barbers.length === 0) {
          setBarbers(MOCK_BARBERS);
        }
      }
      setLastUpdate(new Date());
    } catch (e) {
      if (queue.length === 0) {
        setQueue(MOCK_QUEUE);
      }
      if (barbers.length === 0) {
        setBarbers(MOCK_BARBERS);
      }
      setLastUpdate(new Date());
      setUsingDemo(true);
      showToast("Using local offline demo queue data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  /* ── Auto-refresh polling ── */
  useEffect(() => {
    if (autoRefresh) {
      intervalRef.current = setInterval(fetchData, 10000);
      return () => clearInterval(intervalRef.current);
    }
  }, [autoRefresh]);

  /* ── Interactive Actions with Local State Fallbacks ── */
  const autoAssign = async (q) => {
    setBusyId(q._id);
    const firstAvail = availBarbers[0] || MOCK_BARBERS.find(b => b.status === "available");
    
    // Optimistic update
    setQueue(prev => prev.map(item => item._id === q._id ? { ...item, barber_id: firstAvail, status: "waiting" } : item));

    try {
      const res = await fetch(`${API}/owner/queue/${q._id}/auto-assign`, {
        method: "POST",
        headers: headers()
      });
      const data = await res.json();
      if (data.success) {
        showToast(data.message || "Auto-assigned successfully");
        fetchData();
      } else {
        if (!usingDemo) {
          // Revert if online and failed
          setQueue(prev => prev.map(item => item._id === q._id ? { ...item, barber_id: null, status: "waiting" } : item));
          showToast(data.message || "Auto-assign failed", "error");
        } else {
          showToast(`Offline Demo: Auto-assigned to ${firstAvail?.name || "barber"}`);
        }
      }
    } catch {
      if (!usingDemo) {
        // Revert if online and failed
        setQueue(prev => prev.map(item => item._id === q._id ? { ...item, barber_id: null, status: "waiting" } : item));
        showToast("Network error during auto-assign", "error");
      } else {
        showToast(`Offline Demo: Auto-assigned to ${firstAvail?.name || "barber"}`);
      }
    } finally {
      setBusyId(null);
    }
  };

  const manualAssign = async (q, bid) => {
    setBusyId(q._id);
    const targetBarber = barbers.find(b => b._id === bid) || MOCK_BARBERS.find(b => b._id === bid);
    
    // Optimistic update
    setQueue(prev => prev.map(item => item._id === q._id ? { ...item, barber_id: targetBarber, status: "waiting" } : item));

    try {
      const res = await fetch(`${API}/owner/queue/${q._id}/assign`, {
        method: "POST",
        headers: headers(),
        body: JSON.stringify({ barber_id: bid })
      });
      const data = await res.json();
      if (data.success) {
        showToast(`Assigned to ${targetBarber?.name || "barber"}`);
        fetchData();
      } else {
        if (!usingDemo) {
          // Revert if online and failed
          setQueue(prev => prev.map(item => item._id === q._id ? { ...item, barber_id: null, status: "waiting" } : item));
          showToast(data.message || "Assignment failed", "error");
        } else {
          showToast(`Offline Demo: Assigned to ${targetBarber?.name}`);
        }
      }
    } catch {
      if (!usingDemo) {
        // Revert if online and failed
        setQueue(prev => prev.map(item => item._id === q._id ? { ...item, barber_id: null, status: "waiting" } : item));
        showToast("Network error during assignment", "error");
      } else {
        showToast(`Offline Demo: Assigned to ${targetBarber?.name}`);
      }
    } finally {
      setBusyId(null);
    }
  };

  const startService = async (q) => {
    setBusyId(q._id);
    
    // Optimistic update
    setQueue(prev => prev.map(item => item._id === q._id ? { ...item, status: "in-progress" } : item));

    try {
      const res = await fetch(`${API}/owner/queue/${q._id}/start`, { method: "PUT", headers: headers() });
      const data = await res.json();
      if (data.success) {
        showToast("Service started");
        fetchData();
      } else {
        if (!usingDemo) {
          // Revert if online and failed
          setQueue(prev => prev.map(item => item._id === q._id ? { ...item, status: "waiting" } : item));
          showToast(data.message || "Failed to start service", "error");
        } else {
          showToast("Offline Demo: Service started");
        }
      }
    } catch {
      if (!usingDemo) {
        // Revert if online and failed
        setQueue(prev => prev.map(item => item._id === q._id ? { ...item, status: "waiting" } : item));
        showToast("Network error starting service", "error");
      } else {
        showToast("Offline Demo: Service started");
      }
    } finally {
      setBusyId(null);
    }
  };

  const completeServ = async (q) => {
    setBusyId(q._id);
    
    // Optimistic update
    setQueue(prev => prev.filter(item => item._id !== q._id));

    try {
      const res = await fetch(`${API}/owner/queue/${q._id}/complete`, { method: "PUT", headers: headers() });
      const data = await res.json();
      if (data.success) {
        showToast("Service completed");
        fetchData();
      } else {
        if (!usingDemo) {
          // Revert if online and failed
          setQueue(prev => [...prev, q]);
          showToast(data.message || "Failed to complete service", "error");
        } else {
          showToast("Offline Demo: Service completed");
        }
      }
    } catch {
      if (!usingDemo) {
        // Revert if online and failed
        setQueue(prev => [...prev, q]);
        showToast("Network error completing service", "error");
      } else {
        showToast("Offline Demo: Service completed");
      }
    } finally {
      setBusyId(null);
    }
  };

  /* ── Buckets ── */
  const unassigned   = queue.filter(q => !q.barber_id && q.status === "waiting");
  const waiting      = queue.filter(q =>  q.barber_id && q.status === "waiting");
  const inProgress   = queue.filter(q =>  q.status === "in-progress");
  const availBarbers = barbers.filter(b => b.status === "available");
  const assignableBarbers = barbers.filter(b => b.status === "available" || b.status === "busy");

  return (
    <div className="p-6 md:p-10 font-sans text-zinc-800 text-left min-h-screen" style={{ background: "#FAF6F0" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap');
        body, .font-sans {
          font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important;
        }
        .font-serif {
          font-family: 'Playfair Display', Georgia, Cambria, "Times New Roman", Times, serif !important;
        }
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

      {/* ════ HEADER ════ */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold font-serif tracking-normal text-zinc-900">
            Live <span className="text-[#C5A059]">Queue</span>
          </h1>
          <div className="flex items-center gap-2 mt-2">
            <span className={`w-2.5 h-2.5 rounded-full ${autoRefresh ? "bg-[#8B6B3E] animate-pulse" : "bg-zinc-400"}`}/>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500">
              Auto-refresh {autoRefresh ? "ON" : "OFF"}
              {lastUpdate && ` · Updated ${lastUpdate.toLocaleTimeString()}`}
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <button onClick={() => setAutoRefresh(!autoRefresh)}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 border shadow-sm ${
              autoRefresh ? "bg-[#8B6B3E] text-white border-[#8B6B3E] shadow-md" : "bg-white text-zinc-600 border-zinc-200 hover:bg-zinc-50"
            }`}>
            Auto {autoRefresh ? "ON" : "OFF"}
          </button>
          <button onClick={fetchData}
            className="px-4 py-2.5 bg-[#8B6B3E] hover:bg-[#735A32] text-white rounded-xl text-xs font-bold tracking-wider uppercase flex items-center gap-2 transition-all shadow-sm">
            <RefreshCw className="w-4 h-4"/> Refresh
          </button>
        </div>
      </div>

      {/* ════ STATS STRIP ════ */}
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Unassigned",     value: unassigned.length,   color: "text-[#3E362E]",    bgColor: "bg-stone-50 border-stone-200/60",     icon: AlertCircle },
          { label: "Waiting",        value: waiting.length,      color: "text-[#8B6B3E]",  bgColor: "bg-[#FAF6F0] border-[#EADBCE]/60",  icon: Clock },
          { label: "In Progress",    value: inProgress.length,   color: "text-[#3E362E]",   bgColor: "bg-stone-50 border-stone-200/60",   icon: Activity },
          { label: "Avail. Barbers", value: availBarbers.length, color: "text-[#8B6B3E]",  bgColor: "bg-[#FAF6F0] border-[#EADBCE]/60",  icon: Users },
        ].map((s, i) => {
          const Icon = s.icon;
          return (
            <div key={i} className="card p-5">
              <div className="flex items-center justify-between mb-2">
                <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">{s.label}</p>
                <div className={`w-8 h-8 rounded-lg ${s.bgColor} border flex items-center justify-center`}>
                  <Icon className={`w-4 h-4 ${s.color}`}/>
                </div>
              </div>
              <p className={`text-3xl font-bold font-serif ${s.color}`}>{s.value}</p>
            </div>
          );
        })}
      </div>

      {loading ? (
        <div className="text-center py-20 text-zinc-500">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-3 text-[#8B6B3E]"/>
          Loading queue...
        </div>
      ) : (
        <div className="max-w-7xl mx-auto grid lg:grid-cols-3 gap-6">

          {/* ───── COL 1: UNASSIGNED ───── */}
          <div>
            <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-700 mb-4 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#8B6B3E]"/>
              Unassigned ({unassigned.length})
            </h2>
            {unassigned.length === 0 ? (
              <EmptyCard text="All bookings assigned 🎉"/>
            ) : unassigned.map((q, idx) => (
              <QueueCard key={q._id} q={q} displayPosition={idx + 1}>
                <button onClick={() => autoAssign(q)} disabled={busyId === q._id || availBarbers.length === 0}
                  className="w-full bg-[#8B6B3E] hover:bg-[#735A32] text-white py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition shadow-sm disabled:opacity-50 disabled:cursor-not-allowed">
                  <Sparkles className="w-4 h-4"/>
                  {busyId === q._id ? "Assigning..." : "Auto-Assign"}
                </button>
                {assignableBarbers.length === 0 && (
                  <p className="text-[10px] text-red-600 text-center font-semibold mt-2">No active barbers</p>
                )}
                <select
                  className="mt-2 w-full bg-[#FAF6F0]/60 border border-[#EADBCE]/50 rounded-xl px-3 py-2 text-xs text-zinc-700 outline-none focus:border-[#8B6B3E] transition font-medium cursor-pointer"
                  defaultValue=""
                  onChange={(e) => { if (e.target.value) manualAssign(q, e.target.value); }}
                  disabled={busyId === q._id}>
                  <option value="" disabled>Or pick manually...</option>
                  {assignableBarbers.map(b => (
                    <option key={b._id} value={b._id}>{b.name}</option>
                  ))}
                </select>
              </QueueCard>
            ))}
          </div>

          {/* ───── COL 2: WAITING ───── */}
          <div>
            <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-700 mb-4 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#C5A059]"/>
              Assigned & Waiting ({waiting.length})
            </h2>
            {waiting.length === 0 ? (
              <EmptyCard text="No one in waiting"/>
            ) : waiting.map((q, idx) => (
              <QueueCard key={q._id} q={q} displayPosition={idx + 1}>
                <div className="bg-[#FAF6F0] border border-[#EADBCE]/60 rounded-xl px-3 py-2.5 mb-3 text-xs flex items-center gap-2">
                  <Users className="w-4 h-4 text-[#8B6B3E]"/>
                  <span className="text-[#8B6B3E] font-medium">Barber:</span>
                  <span className="font-bold text-stone-900">{q.barber_id?.name || "—"}</span>
                </div>
                <button onClick={() => startService(q)} disabled={busyId === q._id}
                  className="w-full bg-[#8B6B3E] hover:bg-[#735A32] text-white py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition shadow-sm disabled:opacity-50">
                  <Play className="w-4 h-4"/>
                  {busyId === q._id ? "Starting..." : "Start Service"}
                </button>
              </QueueCard>
            ))}
          </div>

          {/* ───── COL 3: IN PROGRESS ───── */}
          <div>
            <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-700 mb-4 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#8B6B3E] animate-pulse"/>
              In Progress ({inProgress.length})
            </h2>
            {inProgress.length === 0 ? (
              <EmptyCard text="No services running"/>
            ) : inProgress.map(q => (
              <QueueCard key={q._id} q={q}>
                <div className="bg-stone-50 rounded-xl px-3 py-2.5 mb-3 text-xs flex items-center gap-2 border border-stone-200/60">
                  <Activity className="w-4 h-4 text-[#8B6B3E] animate-pulse"/>
                  <span className="text-[#8B6B3E] font-medium">Barber:</span>
                  <span className="font-bold text-stone-900">{q.barber_id?.name || "—"}</span>
                </div>
                <p className="text-[11px] text-zinc-500 text-center font-medium mt-2">Service Managed by Barber</p>
              </QueueCard>
            ))}
          </div>
        </div>
      )}

      {/* ════ BARBERS STRIP ════ */}
      <div className="max-w-7xl mx-auto mt-10">
        <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-700 mb-4 flex items-center gap-2">
          <Users className="w-4 h-4 text-[#8B6B3E]"/>
          Barbers in Salon ({barbers.length})
        </h2>
        {barbers.length === 0 ? (
          <div className="bg-white border border-zinc-200 rounded-3xl p-8 text-center text-zinc-500 text-sm italic card hover:transform-none">
            No barbers added yet. Ask admin to add barbers to this salon.
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {barbers.map(b => {
              const sc = b.status === "available" ? "text-emerald-700 bg-emerald-50 border border-emerald-200"
                       : b.status === "busy"      ? "text-zinc-600 bg-zinc-100 border border-zinc-200"
                       : b.status === "break"     ? "text-zinc-600 bg-zinc-100 border border-zinc-200"
                                                   : "text-zinc-500 bg-zinc-50 border border-zinc-200";
              return (
                <div key={b._id} className="card p-4 flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-[#FAF6F0] border border-[#EADBCE] flex items-center justify-center text-[#8B6B3E] font-bold text-lg flex-shrink-0 font-serif">
                    {b.name?.[0]?.toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm text-zinc-900 truncate">{b.name}</p>
                    <p className="text-xs text-zinc-500 truncate">{b.specialization || "Barber"}</p>
                    <span className={`inline-block text-[9px] font-bold uppercase tracking-wider mt-1.5 px-2.5 py-0.5 rounded-full border ${sc}`}>
                      ● {b.status}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ════ TOAST ════ */}
      {toast && (
        <div className={`fixed bottom-6 right-6 px-5 py-3 rounded-xl text-white font-bold text-sm shadow-2xl z-50 animate-in slide-in-from-right ${
          toast.type === "error" ? "bg-red-500" : "bg-green-600"
        }`}>
          {toast.msg}
        </div>
      )}
    </div>
  );
}

/* ════════════════════════════════════════════
   SUB-COMPONENTS
   ════════════════════════════════════════════ */
function QueueCard({ q, children, displayPosition }) {
  return (
    <div className="card p-5 mb-4">
      <div className="flex items-start gap-3 mb-3">
        <div className="w-12 h-12 rounded-full bg-[#FAF6F0] border border-[#EADBCE] flex items-center justify-center text-[#8B6B3E] font-bold text-lg flex-shrink-0 font-serif">
          {q.customer_id?.name?.[0]?.toUpperCase() || "?"}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-sm text-zinc-900 truncate">{q.customer_id?.name || "Customer"}</p>
          <p className="text-xs text-zinc-500 flex items-center gap-1.5 mt-0.5">
            <Phone className="w-3.5 h-3.5 text-zinc-400"/>{q.customer_id?.mobile || "—"}
          </p>
        </div>
        <div className="text-right flex-shrink-0">
          <p className="text-[9px] font-bold uppercase tracking-wider text-zinc-400">
            {q.status === "in-progress" ? "Status" : "Position"}
          </p>
          <p className="text-xl font-bold text-[#8B6B3E] font-serif">
            {q.status === "in-progress" ? "In Chair" : `#${displayPosition ?? q.position ?? "—"}`}
          </p>
        </div>
      </div>
      <div className="bg-[#FAF6F0]/60 border border-[#EADBCE]/40 rounded-xl px-3 py-2.5 mb-3">
        <p className="text-[9px] font-bold uppercase tracking-wider text-zinc-400 mb-0.5">Service</p>
        <p className="text-sm font-bold text-zinc-900">
          {q.booking_id?.services?.[0]?.service_name || "—"}
        </p>
        {q.booking_id?.total_amount > 0 && (
          <p className="text-[10px] text-[#8B6B3E] font-bold mt-1">₹{q.booking_id.total_amount}</p>
        )}
      </div>
      {children}
    </div>
  );
}

function EmptyCard({ text }) {
  return (
    <div className="bg-white/50 border border-zinc-200 border-dashed rounded-3xl p-8 text-center text-zinc-400 text-sm italic">
      {text}
    </div>
  );
}

const MOCK_BARBERS = [
  { _id: "barber-1", name: "Ali", status: "available", specialization: "Fade & Shave Expert" },
  { _id: "barber-2", name: "Ravi", status: "busy", specialization: "Beard Grooming Stylist" },
  { _id: "barber-3", name: "James", status: "available", specialization: "Hair Coloring Expert" },
];

const MOCK_QUEUE = [
  {
    _id: "mock-q-1",
    customer_id: { name: "Aarav Mehta", mobile: "9876543210" },
    position: 1,
    booking_id: { services: [{ service_name: "Premium Haircut & Beard Grooming" }], total_amount: 450 },
    barber_id: null,
    status: "waiting"
  },
  {
    _id: "mock-q-2",
    customer_id: { name: "Kabir Dev", mobile: "9876543211" },
    position: 2,
    booking_id: { services: [{ service_name: "Royal Oil Head Massage" }], total_amount: 250 },
    barber_id: { name: "Ali", _id: "barber-1" },
    status: "waiting"
  },
  {
    _id: "mock-q-3",
    customer_id: { name: "Rohan Das", mobile: "9876543212" },
    position: 3,
    booking_id: { services: [{ service_name: "Charcoal Face Scrub & Cleanse" }], total_amount: 350 },
    barber_id: { name: "Ravi", _id: "barber-2" },
    status: "in-progress"
  },
  {
    _id: "mock-q-4",
    customer_id: { name: "Vikram Sen", mobile: "9876543213" },
    position: 4,
    booking_id: { services: [{ service_name: "Classic Hair Wash & Conditioning" }], total_amount: 200 },
    barber_id: null,
    status: "waiting"
  }
];