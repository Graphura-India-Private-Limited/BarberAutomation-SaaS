import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { 
  Users, UserCheck, Clock, CheckCircle2, XCircle, Play, 
  RefreshCw, Shuffle, Hourglass, ArrowLeftRight, HelpCircle, Scissors
} from "lucide-react";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const CHARCOAL = "#3E362E";
const GOLD = "#C5A059";

export default function LiveQueue() {
  const { salon, token } = useOutletContext();
  const [queue, setQueue] = useState([]);
  const [barbers, setBarbers] = useState([]);
  const [stats, setStats] = useState({ waiting: 0, completed: 0, noshows: 0, delayed: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [actionBusy, setActionBusy] = useState(null); // Tracks ID of queue item undergoing action

  useEffect(() => {
    if (salon?._id) {
      loadQueueData();
    }
  }, [salon?._id]);

  const loadQueueData = async () => {
    setLoading(true);
    setError("");
    try {
      const [queueRes, barbersRes, statsRes] = await Promise.all([
        fetch(`${API}/queue/${salon._id}`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${API}/barber/salon/${salon._id}`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${API}/noshow/stats/${salon._id}`, { headers: { Authorization: `Bearer ${token}` } })
      ]);

      const queueData = await queueRes.json();
      const barbersData = await barbersRes.json();
      const statsData = await statsRes.json();

      if (!queueData.success) throw new Error(queueData.message || "Failed to load queue");
      if (!barbersData.success) throw new Error(barbersData.message || "Failed to load barbers");

      // Sort queue by position
      const sortedQueue = (queueData.queue || []).sort((a, b) => a.position - b.position);
      setQueue(sortedQueue);
      setBarbers(barbersData.barbers || []);
      
      if (statsData.success) {
        setStats(statsData.stats);
      }
    } catch (err) {
      setError(err.message || "Error loading dashboard metrics");
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (queueId, action, payload = {}) => {
    setActionBusy(queueId);
    setError("");
    setMessage("");
    try {
      let url = `${API}/owner/queue/${queueId}/${action}`;
      let method = "PUT";

      if (action === "assign" || action === "auto-assign") {
        url = `${API}/owner/queue/${queueId}/${action}`;
        method = "POST";
      } else if (action === "delay" || action === "noshow" || action === "rejoin") {
        url = `${API}/noshow/${queueId}/${action}`;
        method = "PUT";
      }

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || `${action} request failed`);

      setMessage(data.message || `Action ${action} completed`);
      await loadQueueData(); // Refresh queue states
    } catch (err) {
      setError(err.message || "Failed to perform operation");
    } finally {
      setActionBusy(null);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "in-progress":
        return <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-orange-50 text-orange-700 border border-orange-200">Serving</span>;
      case "paused":
        return <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-red-50 text-red-700 border border-red-200">Paused</span>;
      case "delayed":
        return <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-sky-50 text-sky-700 border border-sky-200">Delayed</span>;
      default:
        return <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200">Waiting</span>;
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 font-sans">
        <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center animate-pulse mb-3">
          <Clock className="w-5 h-5 text-[#C5A059] animate-spin" style={{ animationDuration: '2.5s' }} />
        </div>
        <p className="text-stone-500 text-xs uppercase font-extrabold tracking-widest animate-pulse">Streaming Live Queue...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto text-left font-sans">
      <header className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5 border-b pb-6 border-stone-200">
        <div>
          <p className="text-[#C5A059] font-sans font-bold tracking-[2px] text-xs uppercase mb-1">
            Real-Time Monitor
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl tracking-normal text-stone-900 flex items-center justify-start gap-2 whitespace-nowrap">
            <span className="font-bold uppercase">Live Queue</span>
            <span className="italic text-[#C5A059] normal-case font-medium">Console</span>
          </h2>
          <p className="text-stone-600 text-sm mt-2 font-sans">Manage customer flow, assign stylists, trigger session states, and adjust delays.</p>
        </div>

        <button 
          onClick={loadQueueData}
          className="flex items-center gap-2 px-5 py-3.5 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 font-extrabold text-xs uppercase tracking-wider text-stone-700 transition cursor-pointer font-sans"
        >
          <RefreshCw size={13} className="text-[#C5A059]" />
          Refresh View
        </button>
      </header>

      {error && <p className="mb-6 rounded-xl bg-red-50 border border-red-200 p-4 text-center text-xs font-bold text-red-600 font-sans">{error}</p>}
      {message && <p className="mb-6 rounded-xl bg-green-50 border border-green-200 p-4 text-center text-xs font-bold text-green-700 font-sans">{message}</p>}

      {/* ── QUEUE STATS ROW ── */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { title: "Waiting List", value: stats.waiting || queue.filter(q => q.status === "waiting").length, icon: Users, color: "bg-orange-50 text-orange-700 border-orange-100" },
          { title: "Serving Now", value: queue.filter(q => q.status === "in-progress").length, icon: Play, color: "bg-emerald-50 text-emerald-700 border-emerald-100" },
          { title: "Delayed Seats", value: stats.delayed || queue.filter(q => q.status === "delayed").length, icon: Hourglass, color: "bg-sky-50 text-sky-700 border-sky-100" },
          { title: "Completed Today", value: stats.completed || 0, icon: CheckCircle2, color: "bg-amber-50 text-amber-700 border-amber-100" }
        ].map(item => (
          <div key={item.title} className="card p-5 bg-white flex items-center gap-4">
            <div className={`w-11 h-11 rounded-xl border flex items-center justify-center shrink-0 ${item.color}`}>
              <item.icon size={20} />
            </div>
            <div>
              <p className="text-[10px] font-extrabold uppercase tracking-widest text-[#C5A059] mb-0.5">{item.title}</p>
              <h3 className="text-xl font-black font-serif text-stone-900 leading-none">{item.value}</h3>
            </div>
          </div>
        ))}
      </section>

      {/* ── QUEUE LEDGER CONSOLE ── */}
      <div className="card p-6 bg-white overflow-hidden mb-8 shadow-sm">
        <h3 className="font-serif text-xl sm:text-2xl text-stone-900 mb-6 border-b border-stone-50 pb-4">
          <span className="font-bold uppercase">Customer Entry</span>
          <span className="italic text-[#C5A059] font-medium">Ledger</span>
        </h3>

        <div className="overflow-x-auto w-full custom-scrollbar">
          <table className="w-full min-w-[700px] border-collapse">
            <thead>
              <tr className="border-b border-stone-100 text-stone-400 text-[10px] font-extrabold uppercase tracking-widest font-sans">
                <th className="text-left py-4 pr-3">Pos</th>
                <th className="text-left pr-4">Customer Entity</th>
                <th className="text-left pr-4">Assigned Barber</th>
                <th className="text-left pr-4">Est. Wait</th>
                <th className="text-left pr-4">State</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-50 font-sans">
              {queue.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-16 text-stone-400 font-medium italic">
                    The salon queue is currently empty. All seats cleared!
                  </td>
                </tr>
              ) : (
                queue.map((entry) => {
                  const customer = entry.customer_id || { name: "Walk-in Guest", mobile: "N/A" };
                  const isBusy = actionBusy === entry._id;
                  
                  return (
                    <tr key={entry._id} className="hover:bg-stone-50/50 transition-colors group">
                      <td className="py-4.5 pr-3 font-mono font-bold text-stone-400">#{entry.position}</td>
                      <td className="pr-4 whitespace-nowrap">
                        <p className="font-bold text-stone-900 text-sm leading-none">{customer.name}</p>
                        <p className="text-[10px] text-stone-400 mt-1 font-mono">{customer.mobile}</p>
                      </td>
                      <td className="pr-4 whitespace-nowrap">
                        {entry.status === "in-progress" ? (
                          <div className="flex items-center gap-1.5 bg-amber-50/50 border border-amber-200/50 rounded-xl px-3 py-1.5 w-fit">
                            <Scissors size={12} className="text-[#C5A059]" />
                            <span className="text-xs font-bold text-stone-800">
                              {barbers.find(b => b._id === entry.barber_id)?.name || "Assigned Stylist"}
                            </span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <select
                              disabled={isBusy}
                              value={entry.barber_id || ""}
                              onChange={(e) => handleAction(entry._id, "assign", { barber_id: e.target.value })}
                              className="bg-white border border-stone-200 rounded-xl px-2.5 py-1.5 text-xs font-bold text-stone-700 outline-none hover:border-[#C5A059] focus:border-[#C5A059] cursor-pointer"
                            >
                              <option value="">-- Assign Barber --</option>
                              {barbers.map(b => (
                                <option key={b._id} value={b._id}>{b.name} ({b.status})</option>
                              ))}
                            </select>
                            
                            {!entry.barber_id && (
                              <button
                                disabled={isBusy}
                                onClick={() => handleAction(entry._id, "auto-assign")}
                                className="p-1.5 rounded-lg border border-amber-200 bg-amber-50 text-[#C5A059] hover:bg-amber-100 cursor-pointer"
                                title="Auto-Assign best available barber"
                              >
                                <Shuffle size={13} />
                              </button>
                            )}
                          </div>
                        )}
                      </td>
                      <td className="pr-4 whitespace-nowrap font-mono font-medium text-stone-500">
                        {entry.estimated_wait || 0} mins
                      </td>
                      <td className="pr-4 whitespace-nowrap">
                        {getStatusBadge(entry.status)}
                      </td>
                      <td>
                        <div className="flex gap-2 justify-end font-sans">
                          {entry.status === "waiting" && entry.barber_id && (
                            <button
                              disabled={isBusy}
                              onClick={() => handleAction(entry._id, "start")}
                              className="bg-emerald-50 border border-emerald-200 hover:bg-emerald-600 hover:text-white hover:border-emerald-600 text-emerald-700 px-3 py-1.5 rounded-xl text-xs font-extrabold uppercase tracking-wider transition-all flex items-center gap-1 cursor-pointer"
                            >
                              <Play size={11} strokeWidth={2.5} /> Start
                            </button>
                          )}
                          
                          {entry.status === "in-progress" && (
                            <button
                              disabled={isBusy}
                              onClick={() => handleAction(entry._id, "complete")}
                              className="bg-amber-50 border border-amber-200 hover:bg-amber-600 hover:text-white hover:border-amber-600 text-amber-700 px-3 py-1.5 rounded-xl text-xs font-extrabold uppercase tracking-wider transition-all flex items-center gap-1 cursor-pointer"
                            >
                              <CheckCircle2 size={11} strokeWidth={2.5} /> Done
                            </button>
                          )}
                          
                          {entry.status !== "in-progress" && (
                            <>
                              <button
                                disabled={isBusy}
                                onClick={() => handleAction(entry._id, "delay", { delay_mins: 15 })}
                                className="bg-sky-50 border border-sky-200 hover:bg-sky-100 text-sky-700 p-2 rounded-xl transition cursor-pointer"
                                title="Delay check-in by 15 mins"
                              >
                                <Hourglass size={12} />
                              </button>
                              
                              {entry.status === "delayed" && (
                                <button
                                  disabled={isBusy}
                                  onClick={() => handleAction(entry._id, "rejoin")}
                                  className="bg-stone-50 border border-stone-200 hover:bg-stone-100 text-stone-600 p-2 rounded-xl transition cursor-pointer"
                                  title="Rejoin at end of queue"
                                >
                                  <ArrowLeftRight size={12} />
                                </button>
                              )}

                              <button
                                disabled={isBusy}
                                onClick={() => handleAction(entry._id, "noshow")}
                                className="bg-red-50 border border-red-200 hover:bg-red-600 hover:text-white hover:border-red-600 text-red-700 p-2 rounded-xl transition cursor-pointer"
                                title="Mark No-Show"
                              >
                                <XCircle size={12} />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-amber-50/50 border border-amber-200/50 rounded-2xl p-5 text-sm text-stone-700 text-left">
        <div className="flex gap-2 items-start">
          <HelpCircle size={16} className="text-[#C5A059] shrink-0 mt-0.5" />
          <div>
            <strong className="text-stone-900 font-bold">Flow Operations Help:</strong>
            <ul className="mt-2 space-y-1.5 list-disc list-inside text-stone-600 font-sans">
              <li><strong>Auto-Assign</strong>: Finds the barber marked "available" with the smallest wait queue and assigns them.</li>
              <li><strong>Delay</strong>: Toggles status to delayed and shifts estimation back.</li>
              <li><strong>No-Show</strong>: Completes the session block as failed and returns the assigned barber's state to "available".</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}