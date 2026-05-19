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
    <div className="min-h-screen bg-[#FFFBF2] p-4 md:p-8 font-sans text-[#3E362E]">

      {/* ════ HEADER ════ */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <button onClick={() => navigate("/owner/dashboard")}
            className="flex items-center gap-2 text-[10px] font-bold text-[#8D7B68] hover:text-[#C5A059] mb-3 uppercase tracking-widest transition">
            <ArrowLeft className="w-3.5 h-3.5"/> Back to Dashboard
          </button>
          <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tighter">
            Live <span className="text-[#C5A059] italic">Queue</span>
          </h1>
          <div className="flex items-center gap-2 mt-2">
            <span className={`w-2 h-2 rounded-full ${autoRefresh ? "bg-green-500 animate-pulse" : "bg-gray-400"}`}/>
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#8D7B68]">
              Auto-refresh {autoRefresh ? "ON" : "OFF"}
              {lastUpdate && ` · Updated ${lastUpdate.toLocaleTimeString()}`}
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <button onClick={() => setAutoRefresh(!autoRefresh)}
            className={`px-4 py-2.5 rounded-xl text-[10px] font-black tracking-widest uppercase transition border ${
              autoRefresh ? "bg-[#C5A059] text-white border-[#C5A059]" : "bg-white text-[#8D7B68] border-[#EAD8C0]"
            }`}>
            Auto {autoRefresh ? "ON" : "OFF"}
          </button>
          <button onClick={fetchData}
            className="px-4 py-2.5 bg-[#3E362E] text-white rounded-xl text-[10px] font-black tracking-widest flex items-center gap-2 hover:opacity-90 transition">
            <RefreshCw className="w-3.5 h-3.5"/> Refresh
          </button>
        </div>
      </div>

      {/* ════ STATS STRIP ════ */}
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Unassigned",     value: unassigned.length,   color: "text-red-600",    icon: AlertCircle },
          { label: "Waiting",        value: waiting.length,      color: "text-amber-600",  icon: Clock },
          { label: "In Progress",    value: inProgress.length,   color: "text-blue-600",   icon: Activity },
          { label: "Avail. Barbers", value: availBarbers.length, color: "text-green-600",  icon: Users },
        ].map((s, i) => {
          const Icon = s.icon;
          return (
            <div key={i} className="bg-white border border-[#EAD8C0] rounded-2xl p-5 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <p className="text-[9px] font-black uppercase tracking-widest text-[#8D7B68]">{s.label}</p>
                <Icon className={`w-4 h-4 ${s.color}`}/>
              </div>
              <p className={`text-3xl font-black ${s.color}`}>{s.value}</p>
            </div>
          );
        })}
      </div>

      {loading ? (
        <div className="text-center py-20 text-[#8D7B68]">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-3 text-[#C5A059]"/>
          Loading queue...
        </div>
      ) : (
        <div className="max-w-7xl mx-auto grid lg:grid-cols-3 gap-6">

          {/* ───── COL 1: UNASSIGNED ───── */}
          <div>
            <h2 className="text-sm font-black uppercase tracking-widest text-[#3E362E] mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500"/>
              Unassigned ({unassigned.length})
            </h2>
            {unassigned.length === 0 ? (
              <EmptyCard text="All bookings assigned 🎉"/>
            ) : unassigned.map(q => (
              <QueueCard key={q._id} q={q}>
                <button onClick={() => autoAssign(q)} disabled={busyId === q._id || availBarbers.length === 0}
                  className="w-full bg-[#C5A059] text-white py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-[#A88748] transition disabled:opacity-50 disabled:cursor-not-allowed">
                  <Sparkles className="w-3.5 h-3.5"/>
                  {busyId === q._id ? "Assigning..." : "Auto-Assign"}
                </button>
                {availBarbers.length === 0 && (
                  <p className="text-[10px] text-red-500 text-center mt-2">No available barbers</p>
                )}
                <select
                  className="mt-2 w-full bg-[#FDF5E6] border border-[#EAD8C0] rounded-xl px-3 py-2 text-xs text-[#3E362E] outline-none focus:border-[#C5A059] cursor-pointer"
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
            <h2 className="text-sm font-black uppercase tracking-widest text-[#3E362E] mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-500"/>
              Assigned & Waiting ({waiting.length})
            </h2>
            {waiting.length === 0 ? (
              <EmptyCard text="No one in waiting"/>
            ) : waiting.map(q => (
              <QueueCard key={q._id} q={q}>
                <div className="bg-[#FDF5E6] rounded-lg px-3 py-2 mb-3 text-xs flex items-center gap-2">
                  <Users className="w-3 h-3 text-[#C5A059]"/>
                  <span className="text-[#8D7B68]">Barber:</span>
                  <span className="font-bold text-[#3E362E]">{q.barber_id?.name || "—"}</span>
                </div>
                <button onClick={() => startService(q)} disabled={busyId === q._id}
                  className="w-full bg-blue-600 text-white py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-blue-700 transition disabled:opacity-50">
                  <Play className="w-3.5 h-3.5"/>
                  {busyId === q._id ? "Starting..." : "Start Service"}
                </button>
              </QueueCard>
            ))}
          </div>

          {/* ───── COL 3: IN PROGRESS ───── */}
          <div>
            <h2 className="text-sm font-black uppercase tracking-widest text-[#3E362E] mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"/>
              In Progress ({inProgress.length})
            </h2>
            {inProgress.length === 0 ? (
              <EmptyCard text="No services running"/>
            ) : inProgress.map(q => (
              <QueueCard key={q._id} q={q}>
                <div className="bg-blue-50 rounded-lg px-3 py-2 mb-3 text-xs flex items-center gap-2 border border-blue-200">
                  <Activity className="w-3 h-3 text-blue-600 animate-pulse"/>
                  <span className="text-[#8D7B68]">Barber:</span>
                  <span className="font-bold text-blue-700">{q.barber_id?.name || "—"}</span>
                </div>
                <button onClick={() => completeServ(q)} disabled={busyId === q._id}
                  className="w-full bg-green-600 text-white py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-green-700 transition disabled:opacity-50">
                  <Check className="w-3.5 h-3.5"/>
                  {busyId === q._id ? "Completing..." : "Mark Complete"}
                </button>
              </QueueCard>
            ))}
          </div>
        </div>
      )}

      {/* ════ BARBERS STRIP ════ */}
      <div className="max-w-7xl mx-auto mt-10">
        <h2 className="text-sm font-black uppercase tracking-widest text-[#3E362E] mb-4 flex items-center gap-2">
          <Users className="w-4 h-4 text-[#C5A059]"/>
          Barbers in Salon ({barbers.length})
        </h2>
        {barbers.length === 0 ? (
          <div className="bg-white border border-[#EAD8C0] rounded-2xl p-5 text-center text-[#8D7B68] text-sm italic">
            No barbers added yet. Ask admin to add barbers to this salon.
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {barbers.map(b => {
              const sc = b.status === "available" ? "text-green-600 bg-green-50"
                       : b.status === "busy"      ? "text-amber-600 bg-amber-50"
                       : b.status === "break"     ? "text-blue-600 bg-blue-50"
                                                  : "text-gray-400 bg-gray-50";
              return (
                <div key={b._id} className="bg-white border border-[#EAD8C0] rounded-2xl p-4 flex items-center gap-3 shadow-sm">
                  <div className="w-11 h-11 rounded-full bg-[#FEF3DC] border border-[#C5A059] flex items-center justify-center text-[#C5A059] font-black text-lg flex-shrink-0">
                    {b.name?.[0]?.toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm truncate">{b.name}</p>
                    <p className="text-[10px] text-[#8D7B68] truncate">{b.specialization || "Barber"}</p>
                    <span className={`inline-block text-[9px] font-black uppercase tracking-widest mt-1 px-2 py-0.5 rounded-full ${sc}`}>
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
    <div className="bg-white border border-[#EAD8C0] rounded-2xl p-5 shadow-sm mb-4 hover:shadow-md transition">
      <div className="flex items-start gap-3 mb-3">
        <div className="w-12 h-12 rounded-full bg-[#FEF3DC] border border-[#C5A059] flex items-center justify-center text-[#C5A059] font-black text-lg flex-shrink-0">
          {q.customer_id?.name?.[0]?.toUpperCase() || "?"}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-sm truncate">{q.customer_id?.name || "Customer"}</p>
          <p className="text-[10px] text-[#8D7B68] flex items-center gap-1.5">
            <Phone className="w-3 h-3"/>{q.customer_id?.mobile || "—"}
          </p>
        </div>
        <div className="text-right flex-shrink-0">
          <p className="text-[8px] font-black uppercase tracking-widest text-[#8D7B68]">Position</p>
          <p className="text-2xl font-black text-[#C5A059]">#{q.position || "—"}</p>
        </div>
      </div>
      <div className="bg-[#FFFBF2] border border-[#EAD8C0]/50 rounded-lg px-3 py-2 mb-3">
        <p className="text-[9px] font-black uppercase tracking-widest text-[#8D7B68] mb-0.5">Service</p>
        <p className="text-sm font-bold">
          {q.booking_id?.services?.[0]?.service_name || "—"}
        </p>
        {q.booking_id?.total_amount > 0 && (
          <p className="text-[10px] text-[#C5A059] font-bold mt-1">₹{q.booking_id.total_amount}</p>
        )}
      </div>
      {children}
    </div>
  );
}

function EmptyCard({ text }) {
  return (
    <div className="bg-white border border-[#EAD8C0] border-dashed rounded-2xl p-8 text-center text-[#8D7B68] text-sm italic">
      {text}
    </div>
  );
}