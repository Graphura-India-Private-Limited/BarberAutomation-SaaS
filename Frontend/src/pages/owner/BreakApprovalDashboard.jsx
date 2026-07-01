import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Scissors, LogOut, Clock, CheckCircle, XCircle, Users, 
  Coffee, Sandwich, ArrowLeft, Calendar 
} from "lucide-react";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// ── ✅ DIRECT STRATEGIC IMPORTS FOR USER FRONTEND COHERENCE ──
import Navbar from "../../components/layout/Navbar"; // Adjust paths to match your folder hierarchy
import Footer from "../../components/layout/Footer";

const CHARCOAL = "#3E362E";
const GOLD = "#C5A059";

export default function BreakApprovalDashboard() {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [time, setTime] = useState(new Date().toLocaleTimeString("en-IN", { hour: '2-digit', minute: '2-digit' }));

  useEffect(() => {
    fetchRequests();
    const timer = setInterval(() => {
      setTime(new Date().toLocaleTimeString("en-IN", { hour: '2-digit', minute: '2-digit' }));
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  const token = localStorage.getItem("token");
  const headers = () => ({
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  });

  const fetchRequests = async () => {
    try {
      const res = await fetch(`${API}/breaks/pending`, { headers: headers() });
      const data = await res.json();
      if (data.success) setRequests(data.data);
      setLoading(false);
    } catch (err) { 
      console.error(err); 
      setLoading(false);
    }
  };

  const handleAction = async (id, status) => {
    try {
      const res = await fetch(`${API}/breaks/action/${id}`, {
        method: "PUT",
        headers: headers(),
        body: JSON.stringify({ status })
      });
      if (res.ok) setRequests(prev => prev.filter(req => req._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/owner/login");
  };

  const breakStats = useMemo(() => {
    const lunchCount = requests.filter(r => r.break_type === "lunch").length;
    const teaCount = requests.filter(r => r.break_type === "short" || r.break_type === "long").length;
    const leaveCount = requests.filter(r => r.break_type === "leave").length;
    return { total: requests.length, lunch: lunchCount, tea: teaCount, leave: leaveCount };
  }, [requests]);

  if (loading) {
    return (
      <div style={{ background: "#FAF6F0" }} className="min-h-screen flex items-center justify-center font-sans">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center animate-pulse">
            <Scissors className="w-6 h-6 text-amber-600" />
          </div>
          {/* Rule 3 Body text style specifications */}
          <p className="text-stone-600 text-sm font-normal leading-relaxed font-sans">Syncing Active Shifts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-3.5 py-6 md:p-10 font-sans text-stone-800 selection:bg-amber-100 min-h-screen relative" style={{ background: "#FAF6F0" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap');
        body, .font-sans { font-family: 'Plus Jakarta Sans', sans-serif !important; }
        .font-serif { font-family: 'Playfair Display', serif !important; }
        
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

      {/* Decorative Blur Overlays */}
      <div className="absolute top-[15%] right-[-5%] w-96 h-96 bg-amber-100/30 rounded-full blur-[120px] opacity-60 pointer-events-none" />
      <div className="absolute bottom-[10%] left-[-5%] w-80 h-80 bg-orange-100/20 rounded-full blur-[120px] opacity-50 pointer-events-none" />

      {/* ── CENTRAL APP WORKSPACE CONTENT PANEL ── */}
      <div className="relative z-10 max-w-4xl mx-auto">

        {/* ── CONTEXT HEADER TITLE CARD (Rule 1 & Rule 2 Standard Set) ── */}
        <header className="mb-8 rounded-3xl p-4 sm:p-6 md:p-8 card relative overflow-hidden bg-white text-left">
          <div className="relative z-10">
            {/* Rule 2 tag label tag description tracker text parameters */}
            <p className="font-extrabold uppercase tracking-widest text-[11px] text-[#C5A059] mb-1.5 font-sans">
              Grooming Team Administration
            </p>
            {/* Rule 1 Master Title Header Standard Single-Line Layout */}
            <h2 className="font-serif text-2xl sm:text-3xl tracking-normal text-stone-900 flex items-center justify-start gap-2 flex-wrap sm:whitespace-nowrap">
              <span className="font-bold uppercase">Register Your</span>
              <span className="italic text-[#C5A059] normal-case font-medium">Shifts</span>
            </h2>
            {/* Rule 3 Muted base contents summaries layouts elements */}
            <p className="text-stone-600 text-sm font-normal leading-relaxed font-sans mt-2">Manage staff status updates, lunchtime allocations, and active technician break coverage pipelines smoothly.</p>
          </div>
          <div className="absolute right-6 top-1/2 -translate-y-1/2 opacity-[0.03] transform rotate-6 pointer-events-none hidden xl:block">
            <Clock className="w-28 h-28 text-amber-700" strokeWidth={1} />
          </div>
        </header>

        {/* ── COUNTER METRICS DISPLAY SHARDS ── */}
        <section className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8 text-left">
          <div className="bg-white border border-[#EADBCE] rounded-2xl p-4 text-center shadow-sm card hover:transform-none">
            <div className="mx-auto w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center mb-2 text-amber-700">
              <Users size={16} />
            </div>
            {/* Rule 2 Display label metadata item text */}
            <span className="block text-[11px] font-extrabold uppercase tracking-widest text-[#C5A059] font-sans">Queue Active</span>
            <span className="block text-xl font-black font-serif text-stone-900 mt-0.5">-{breakStats.total === 0 ? "Full" : "Shifted"}</span>
          </div>
          <div className="bg-white border border-[#EADBCE] rounded-2xl p-4 text-center shadow-sm card hover:transform-none">
            <div className="mx-auto w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center mb-2 text-orange-700">
              <Sandwich size={16} />
            </div>
            <span className="block text-[11px] font-extrabold uppercase tracking-widest text-[#C5A059] font-sans">Lunch Requests</span>
            <span className="block text-xl font-black font-serif text-stone-900 mt-0.5">{breakStats.lunch}</span>
          </div>
          <div className="bg-white border border-[#EADBCE] rounded-2xl p-4 text-center shadow-sm card hover:transform-none">
            <div className="mx-auto w-8 h-8 rounded-lg bg-sky-50 flex items-center justify-center mb-2 text-sky-700">
              <Coffee size={16} />
            </div>
            <span className="block text-[11px] font-extrabold uppercase tracking-widest text-[#C5A059] font-sans">Short Breaks</span>
            <span className="block text-xl font-black font-serif text-stone-900 mt-0.5">{breakStats.tea}</span>
          </div>
          <div className="bg-white border border-[#EADBCE] rounded-2xl p-4 text-center shadow-sm card hover:transform-none">
            <div className="mx-auto w-8 h-8 rounded-lg bg-teal-50 flex items-center justify-center mb-2 text-teal-700">
              <Calendar size={16} />
            </div>
            <span className="block text-[11px] font-extrabold uppercase tracking-widest text-[#C5A059] font-sans">Leave Requests</span>
            <span className="block text-xl font-black font-serif text-stone-900 mt-0.5">{breakStats.leave}</span>
          </div>
        </section>

        {/* ── CORE OPERATIONS INCOMING QUEUE ── */}
        <div className="space-y-4 font-sans">
          <AnimatePresence mode="popLayout">
            {requests.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.96 }} 
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white border border-[#EADBCE] p-16 rounded-[2rem] text-center shadow-sm flex flex-col items-center justify-center"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl flex items-center justify-center border border-amber-100 shadow-sm text-3xl mb-4 animate-pulse">
                  ✨
                </div>
                {/* Rule 1 Fallback target empty content alignment text style */}
                <h2 className="font-serif text-xl sm:text-2xl tracking-normal text-stone-900 flex items-center justify-center gap-2 flex-wrap sm:whitespace-nowrap">
                  <span className="font-bold uppercase">Inbox</span>
                  <span className="italic text-[#C5A059] normal-case font-medium">Cleared</span>
                </h2>
                {/* Rule 3 Body tracking description layout */}
                <p className="mx-auto max-w-xs text-sm font-normal leading-relaxed text-stone-400 font-sans mt-2">All salon systems are running at maximum capacity. No pending barber shift adjustments require manual verification sequence loops.</p>
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
                             backgroundColor: req.break_type === 'lunch' ? '#FFF7ED' : req.break_type === 'leave' ? '#F0FDF4' : '#F0F9FF',
                             borderColor: req.break_type === 'lunch' ? '#FED7AA' : req.break_type === 'leave' ? '#BBF7D0' : '#BAE6FD'
                           }}>
                        {req.break_type === 'lunch' ? (
                          <Sandwich size={22} className="text-orange-600" />
                        ) : req.break_type === 'leave' ? (
                          <Calendar size={22} className="text-emerald-600" />
                        ) : (
                          <Coffee size={22} className="text-sky-600" />
                        )}
                      </div>
                      <div>
                        {/* Operator Name text format details */}
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-stone-900 text-sm tracking-tight font-sans">{req.barber_id?.name || "Personnel Barber"}</h3>
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-emerald-200 animate-pulse" title="Pending break request" />
                        </div>
                        {/* Rule 2 metadata badge kicker tag config styles */}
                        <p className="text-[11px] font-extrabold uppercase tracking-widest text-[#C5A059] mt-1 bg-amber-50 border border-amber-100 px-2 py-0.5 rounded-md inline-block font-sans">
                          {req.break_type === "leave" 
                            ? `Leave Request • ${Math.round(req.duration_mins / 1440)} Days` 
                            : `${req.break_type === "lunch" ? "Lunch Break" : req.break_type} • ${req.duration_mins} Mins Duration`}
                        </p>
                        {req.break_type === "leave" && req.start_time && (
                          <p className="text-[10px] font-bold text-stone-500 mt-1 font-sans">
                            Range: {new Date(req.start_time).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })} to {new Date(new Date(req.start_time).getTime() + (req.duration_mins * 60000)).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                          </p>
                        )}
                        {req.reason && (
                          <p className="text-[11px] text-[#8B5A2B] font-medium mt-1 font-sans italic">
                            Reason: "{req.reason}"
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Button Operations Controllers (Rule 4 Type Setup) */}
                    <div className="flex gap-2.5 justify-end sm:items-center font-sans">
                      <button 
                        onClick={() => handleAction(req._id, "rejected")} 
                        className="inline-flex items-center gap-1.5 px-4 py-3 text-stone-500 hover:text-rose-600 hover:bg-rose-50/50 rounded-xl transition-all font-extrabold text-xs uppercase tracking-wider border border-transparent hover:border-rose-200/60 cursor-pointer font-sans"
                      >
                        <XCircle size={14} /> Reject
                      </button>
                      <button 
                        onClick={() => handleAction(req._id, "approved")} 
                        className="inline-flex items-center gap-1.5 px-5 py-3 text-white rounded-xl font-extrabold text-xs uppercase tracking-wider shadow-md transition-all active:scale-98 cursor-pointer font-sans hover:opacity-95"
                        style={{ background: CHARCOAL }}
                      >
                        <CheckCircle size={14} color={GOLD} /> Approve Break
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}