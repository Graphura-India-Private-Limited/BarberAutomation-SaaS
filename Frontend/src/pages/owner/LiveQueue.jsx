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
      if (qRes.success) setQueue(qRes.queue || []);
      if (dRes.success) setBarbers(dRes.barbers || []);
      setLastUpdate(new Date());
    } catch (e) {
      showToast("Failed to fetch data", "error");
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

  /* ── Generic action handler ── */
  const callAction = async (queueId, url, method = "POST", body = null) => {
    setBusyId(queueId);
    try {
      const opts = { method, headers: headers() };
      if (body) opts.body = JSON.stringify(body);
      const res  = await fetch(url, opts);
      const data = await res.json();
      if (data.success) {
        showToast(data.message || "Done!");
        await fetchData();
      } else {
        showToast(data.message || "Action failed", "error");
      }
    } catch {
      showToast("Server error", "error");
    } finally {
      setBusyId(null);
    }
  };

  const autoAssign   = (q)      => callAction(q._id, `${API}/owner/queue/${q._id}/auto-assign`, "POST");
  const manualAssign = (q, bid) => callAction(q._id, `${API}/owner/queue/${q._id}/assign`,      "POST", { barber_id: bid });
  const startService = (q)      => callAction(q._id, `${API}/owner/queue/${q._id}/start`,       "PUT");
  const completeServ = (q)      => callAction(q._id, `${API}/owner/queue/${q._id}/complete`,    "PUT");

  /* ── Buckets ── */
  const unassigned   = queue.filter(q => !q.barber_id && q.status === "waiting");
  const waiting      = queue.filter(q =>  q.barber_id && q.status === "waiting");
  const inProgress   = queue.filter(q =>  q.status === "in-progress");
  const availBarbers = barbers.filter(b => b.status === "available");

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

      {/* ════ HEADER ════ */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <button onClick={() => navigate("/owner/dashboard")}
            className="flex items-center gap-2 text-xs font-bold text-amber-700 hover:text-amber-800 mb-3 uppercase tracking-wider transition">
            <ArrowLeft className="w-4 h-4"/> Back to Dashboard
          </button>
          <h1 className="text-3xl md:text-4xl font-bold font-serif tracking-normal text-zinc-900">
            Live <span className="text-amber-600">Queue</span>
          </h1>
          <div className="flex items-center gap-2 mt-2">
            <span className={`w-2.5 h-2.5 rounded-full ${autoRefresh ? "bg-emerald-500 animate-pulse" : "bg-zinc-400"}`}/>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500">
              Auto-refresh {autoRefresh ? "ON" : "OFF"}
              {lastUpdate && ` · Updated ${lastUpdate.toLocaleTimeString()}`}
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <button onClick={() => setAutoRefresh(!autoRefresh)}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 border shadow-sm ${
              autoRefresh ? "bg-amber-600 text-white border-amber-600 shadow-md" : "bg-white text-zinc-600 border-zinc-200 hover:bg-zinc-50"
            }`}>
            Auto {autoRefresh ? "ON" : "OFF"}
          </button>
          <button onClick={fetchData}
            className="px-4 py-2.5 bg-zinc-800 text-white rounded-xl text-xs font-bold tracking-wider uppercase flex items-center gap-2 hover:bg-zinc-900 transition-all shadow-sm">
            <RefreshCw className="w-4 h-4"/> Refresh
          </button>
        </div>
      </div>

      {/* ════ STATS STRIP ════ */}
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Unassigned",     value: unassigned.length,   color: "text-red-600",    bgColor: "bg-red-50/50 border-red-200/50",     icon: AlertCircle },
          { label: "Waiting",        value: waiting.length,      color: "text-amber-600",  bgColor: "bg-amber-50 border-amber-200/60",  icon: Clock },
          { label: "In Progress",    value: inProgress.length,   color: "text-sky-600",   bgColor: "bg-sky-50 border-sky-200/60",   icon: Activity },
          { label: "Avail. Barbers", value: availBarbers.length, color: "text-emerald-600",  bgColor: "bg-emerald-50 border-emerald-200/60",  icon: Users },
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
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-3 text-amber-600"/>
          Loading queue...
        </div>
      ) : (
        <div className="max-w-7xl mx-auto grid lg:grid-cols-3 gap-6">

          {/* ───── COL 1: UNASSIGNED ───── */}
          <div>
            <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-700 mb-4 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500"/>
              Unassigned ({unassigned.length})
            </h2>
            {unassigned.length === 0 ? (
              <EmptyCard text="All bookings assigned 🎉"/>
            ) : unassigned.map(q => (
              <QueueCard key={q._id} q={q}>
                <button onClick={() => autoAssign(q)} disabled={busyId === q._id || availBarbers.length === 0}
                  className="w-full bg-amber-600 text-white py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-amber-700 transition shadow-md disabled:opacity-50 disabled:cursor-not-allowed">
                  <Sparkles className="w-4 h-4"/>
                  {busyId === q._id ? "Assigning..." : "Auto-Assign"}
                </button>
                {availBarbers.length === 0 && (
                  <p className="text-[10px] text-red-600 text-center font-semibold mt-2">No available barbers</p>
                )}
                <select
                  className="mt-2 w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2 text-xs text-zinc-700 outline-none focus:border-amber-600 transition font-medium cursor-pointer"
                  defaultValue=""
                  onChange={(e) => { if (e.target.value) manualAssign(q, e.target.value); }}
                  disabled={busyId === q._id}>
                  <option value="" disabled>Or pick manually...</option>
                  {availBarbers.map(b => (
                    <option key={b._id} value={b._id}>{b.name}</option>
                  ))}
                </select>
              </QueueCard>
            ))}
          </div>

          {/* ───── COL 2: WAITING ───── */}
          <div>
            <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-700 mb-4 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500"/>
              Assigned & Waiting ({waiting.length})
            </h2>
            {waiting.length === 0 ? (
              <EmptyCard text="No one in waiting"/>
            ) : waiting.map(q => (
              <QueueCard key={q._id} q={q}>
                <div className="bg-amber-50 border border-amber-200/50 rounded-xl px-3 py-2.5 mb-3 text-xs flex items-center gap-2">
                  <Users className="w-4 h-4 text-amber-700"/>
                  <span className="text-amber-800 font-medium">Barber:</span>
                  <span className="font-bold text-amber-950">{q.barber_id?.name || "—"}</span>
                </div>
                <button onClick={() => startService(q)} disabled={busyId === q._id}
                  className="w-full bg-sky-600 text-white py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-sky-700 transition shadow-md disabled:opacity-50">
                  <Play className="w-4 h-4"/>
                  {busyId === q._id ? "Starting..." : "Start Service"}
                </button>
              </QueueCard>
            ))}
          </div>

          {/* ───── COL 3: IN PROGRESS ───── */}
          <div>
            <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-700 mb-4 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-sky-500 animate-pulse"/>
              In Progress ({inProgress.length})
            </h2>
            {inProgress.length === 0 ? (
              <EmptyCard text="No services running"/>
            ) : inProgress.map(q => (
              <QueueCard key={q._id} q={q}>
                <div className="bg-sky-50 rounded-xl px-3 py-2.5 mb-3 text-xs flex items-center gap-2 border border-sky-200/60">
                  <Activity className="w-4 h-4 text-sky-600 animate-pulse"/>
                  <span className="text-sky-800 font-medium">Barber:</span>
                  <span className="font-bold text-sky-950">{q.barber_id?.name || "—"}</span>
                </div>
                <button onClick={() => completeServ(q)} disabled={busyId === q._id}
                  className="w-full bg-emerald-600 text-white py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-emerald-700 transition shadow-md disabled:opacity-50">
                  <Check className="w-4 h-4"/>
                  {busyId === q._id ? "Completing..." : "Mark Complete"}
                </button>
              </QueueCard>
            ))}
          </div>
        </div>
      )}

      {/* ════ BARBERS STRIP ════ */}
      <div className="max-w-7xl mx-auto mt-10">
        <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-700 mb-4 flex items-center gap-2">
          <Users className="w-4 h-4 text-amber-700"/>
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
                       : b.status === "busy"      ? "text-amber-700 bg-amber-50 border border-amber-200"
                       : b.status === "break"     ? "text-sky-700 bg-sky-50 border border-sky-200"
                                                   : "text-zinc-500 bg-zinc-50 border border-zinc-200";
              return (
                <div key={b._id} className="card p-4 flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700 font-bold text-lg flex-shrink-0 font-serif">
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
function QueueCard({ q, children }) {
  return (
    <div className="card p-5 mb-4">
      <div className="flex items-start gap-3 mb-3">
        <div className="w-12 h-12 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700 font-bold text-lg flex-shrink-0 font-serif">
          {q.customer_id?.name?.[0]?.toUpperCase() || "?"}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-sm text-zinc-900 truncate">{q.customer_id?.name || "Customer"}</p>
          <p className="text-xs text-zinc-500 flex items-center gap-1.5 mt-0.5">
            <Phone className="w-3.5 h-3.5 text-zinc-400"/>{q.customer_id?.mobile || "—"}
          </p>
        </div>
        <div className="text-right flex-shrink-0">
          <p className="text-[9px] font-bold uppercase tracking-wider text-zinc-400">Position</p>
          <p className="text-2xl font-bold text-amber-600 font-serif">#{q.position || "—"}</p>
        </div>
      </div>
      <div className="bg-amber-50/50 border border-amber-200/50 rounded-xl px-3 py-2.5 mb-3">
        <p className="text-[9px] font-bold uppercase tracking-wider text-zinc-400 mb-0.5">Service</p>
        <p className="text-sm font-bold text-zinc-900">
          {q.booking_id?.services?.[0]?.service_name || "—"}
        </p>
        {q.booking_id?.total_amount > 0 && (
          <p className="text-[10px] text-amber-700 font-bold mt-1">₹{q.booking_id.total_amount}</p>
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