import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Scissors, LogOut, Clock, CheckCircle2, XCircle, Users, 
  Coffee, Sandwich, ArrowLeft 
} from "lucide-react";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const CHARCOAL = "#3E362E";
const GOLD = "#C5A059";

export default function BreakApprovalDashboard() {
  const navigate = useNavigate();
  const { salon, token } = useOutletContext();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [time, setTime] = useState(new Date().toLocaleTimeString("en-IN", { hour: '2-digit', minute: '2-digit' }));

  useEffect(() => {
    if (salon?._id) {
      fetchRequests();
    }
    const timer = setInterval(() => {
      setTime(new Date().toLocaleTimeString("en-IN", { hour: '2-digit', minute: '2-digit' }));
    }, 60000);
    return () => clearInterval(timer);
  }, [salon?._id]);

  const fetchRequests = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API}/owner/salon/${salon._id}/break-requests`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      // Only display pending break requests
      if (data.success) {
        setRequests((data.requests || []).filter(r => r.status === "pending"));
      } else {
        throw new Error(data.message || "Failed to fetch shift schedules");
      }
    } catch (err) { 
      setError(err.message || "Error loading break requests");
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (id, status) => {
    setError("");
    try {
      const res = await fetch(`${API}/owner/break-request/${id}`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });
      const data = await res.json();
      if (data.success) {
        setRequests(prev => prev.filter(req => req._id !== id));
      } else {
        throw new Error(data.message || "Failed to update break request");
      }
    } catch (err) {
      setError(err.message || "Error performing action");
    }
  };

  const breakStats = useMemo(() => {
    const lunchCount = requests.filter(r => r.break_type === "lunch").length;
    const teaCount = requests.filter(r => r.break_type === "tea" || r.break_type === "short" || r.break_type === "break").length;
    return { total: requests.length, lunch: lunchCount, tea: teaCount };
  }, [requests]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 font-sans">
        <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center animate-pulse mb-3">
          <Coffee className="w-5 h-5 text-[#C5A059] animate-bounce" />
        </div>
        <p className="text-stone-500 text-xs uppercase font-extrabold tracking-widest animate-pulse">Syncing Active Shifts...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto text-left font-sans animate-fade-in">
      <style>{`
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
      `}</style>

      {/* Decorative ambient blur overlay */}
      <div className="absolute top-[15%] right-[-5%] w-96 h-96 bg-amber-100/30 rounded-full blur-[120px] opacity-60 pointer-events-none z-0" />

      {/* ── CONTEXT HEADER TITLE CARD ── */}
      <header className="mb-8 rounded-3xl p-6 md:p-8 card relative overflow-hidden bg-white text-left z-10">
        <div className="relative z-10">
          <p className="font-extrabold uppercase tracking-widest text-[10px] text-[#C5A059] mb-1.5 font-sans">
            Grooming Team Administration
          </p>
          <h2 className="font-serif text-2xl sm:text-3xl tracking-normal text-stone-900 flex items-center justify-start gap-2 whitespace-nowrap">
            <span className="font-bold uppercase">Break</span>
            <span className="italic text-[#C5A059] normal-case font-medium">Approvals</span>
          </h2>
          <p className="text-stone-600 text-sm font-normal leading-relaxed font-sans mt-2">Manage staff status updates, lunchtime allocations, and active technician break coverage pipelines smoothly.</p>
        </div>
        <div className="absolute right-6 top-1/2 -translate-y-1/2 opacity-5 transform rotate-6 pointer-events-none hidden sm:block">
          <Clock className="w-28 h-28 text-amber-700" strokeWidth={1} />
        </div>
      </header>

      {error && <p className="mb-6 rounded-xl bg-red-50 border border-red-200 p-4 text-center text-xs font-bold text-red-600 font-sans">{error}</p>}

      {/* ── COUNTER METRICS DISPLAY SHARDS ── */}
      <section className="grid grid-cols-3 gap-4 mb-8 text-left z-10 relative">
        <div className="bg-white border border-[#EADBCE] rounded-2xl p-4 text-center shadow-sm card hover:transform-none">
          <div className="mx-auto w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center mb-2 text-amber-700">
            <Users size={16} />
          </div>
          <span className="block text-[10px] font-extrabold uppercase tracking-widest text-[#C5A059] font-sans">Pending Shifts</span>
          <span className="block text-xl font-black font-serif text-stone-900 mt-0.5">{breakStats.total}</span>
        </div>
        <div className="bg-white border border-[#EADBCE] rounded-2xl p-4 text-center shadow-sm card hover:transform-none">
          <div className="mx-auto w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center mb-2 text-orange-700">
            <Sandwich size={16} />
          </div>
          <span className="block text-[10px] font-extrabold uppercase tracking-widest text-[#C5A059] font-sans">Lunch Requests</span>
          <span className="block text-xl font-black font-serif text-stone-900 mt-0.5">{breakStats.lunch}</span>
        </div>
        <div className="bg-white border border-[#EADBCE] rounded-2xl p-4 text-center shadow-sm card hover:transform-none">
          <div className="mx-auto w-8 h-8 rounded-lg bg-sky-50 flex items-center justify-center mb-2 text-sky-700">
            <Coffee size={16} />
          </div>
          <span className="block text-[10px] font-extrabold uppercase tracking-widest text-[#C5A059] font-sans">Short Breaks</span>
          <span className="block text-xl font-black font-serif text-stone-900 mt-0.5">{breakStats.tea}</span>
        </div>
      </section>

      {/* ── CORE OPERATIONS INCOMING QUEUE ── */}
      <div className="space-y-4 font-sans z-10 relative">
        <AnimatePresence mode="popLayout">
          {requests.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.96 }} 
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white border border-[#EADBCE] p-16 rounded-[2rem] text-center shadow-sm flex flex-col items-center justify-center card"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl flex items-center justify-center border border-amber-100 shadow-sm text-3xl mb-4 animate-pulse">
                ✨
              </div>
              <h2 className="font-serif text-xl sm:text-2xl tracking-normal text-stone-900 flex items-center justify-center gap-2 whitespace-nowrap">
                <span className="font-bold uppercase">Inbox</span>
                <span className="italic text-[#C5A059] normal-case font-medium">Cleared</span>
              </h2>
              <p className="mx-auto max-w-xs text-sm font-normal leading-relaxed text-stone-400 font-sans mt-2">All salon systems are running at maximum capacity. No pending barber shift adjustments require manual verification.</p>
            </motion.div>
          ) : (
            requests.map((req) => (
              <motion.div
                key={req._id}
                layout
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
                className="card p-5 bg-white group text-left"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
                  <div className="flex items-center gap-4.5">
                    <div className="w-14 h-14 rounded-2xl border flex items-center justify-center text-xl shadow-inner flex-shrink-0 transition-transform duration-300 group-hover:scale-105"
                         style={{ 
                           backgroundColor: req.break_type === 'lunch' ? '#FFF7ED' : '#F0F9FF',
                           borderColor: req.break_type === 'lunch' ? '#FED7AA' : '#BAE6FD'
                         }}>
                      {req.break_type === 'lunch' ? <Sandwich size={22} className="text-orange-600" /> : <Coffee size={22} className="text-sky-600" />}
                    </div>
                    <div>
                      <h3 className="font-bold text-stone-900 text-sm tracking-tight font-sans">{req.barber_id?.name || "Personnel Barber"}</h3>
                      <p className="text-[10px] font-extrabold uppercase tracking-widest text-[#C5A059] mt-1 bg-amber-50 border border-amber-100 px-2 py-0.5 rounded-md inline-block font-sans">
                        {req.break_type} • {req.duration_mins} Mins Duration
                      </p>
                    </div>
                  </div>

                  {/* Button Operations Controllers */}
                  <div className="flex gap-2.5 justify-end sm:items-center font-sans">
                    <button 
                      onClick={() => handleAction(req._id, "rejected")} 
                      className="inline-flex items-center gap-1.5 px-4 py-3 text-stone-500 hover:text-rose-600 hover:bg-rose-50/50 rounded-xl transition-all font-extrabold text-xs uppercase tracking-wider border border-transparent hover:border-rose-200/60 cursor-pointer font-sans bg-transparent"
                    >
                      <XCircle size={14} /> Reject
                    </button>
                    <button 
                      onClick={() => handleAction(req._id, "approved")} 
                      className="inline-flex items-center gap-1.5 px-5 py-3 text-white rounded-xl font-extrabold text-xs uppercase tracking-wider shadow-md transition-all active:scale-98 cursor-pointer font-sans hover:opacity-95 border-none"
                      style={{ background: CHARCOAL }}
                    >
                      <CheckCircle2 size={14} color={GOLD} /> Approve Break
                    </button>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}