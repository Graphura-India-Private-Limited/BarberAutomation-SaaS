import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Scissors, LogOut, Clock, CheckCircle, XCircle, Users, Coffee, Sandwich } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../Components/layout/Navbar";
import Footer from "../../Components/layout/Footer";

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

  const fetchRequests = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/breaks/pending");
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
      const res = await fetch(`http://localhost:5000/api/breaks/action/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status })
      });
      if (res.ok) setRequests(prev => prev.filter(req => req._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  // Dynamic live metric statistics computed straight from the active request stream array
  const breakStats = useMemo(() => {
    const lunchCount = requests.filter(r => r.break_type === "lunch").length;
    const teaCount = requests.filter(r => r.break_type === "tea" || r.break_type === "break").length;
    return { total: requests.length, lunch: lunchCount, tea: teaCount };
  }, [requests]);

  return (
      <div className="min-h-screen flex flex-col">

    <Navbar />
    <div className="flex-1 font-sans text-stone-800 selection:bg-amber-100" style={{ background: "#FAF6F0" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap');
        body { background-color: #FAF6F0; }
        .font-sans { font-family: 'Plus Jakarta Sans', sans-serif !important; }
        .font-serif { font-family: 'Playfair Display', serif !important; }
        
        .card { 
          background: #FFFFFF; 
          border: 1px solid #EADBCE; 
          border-radius: 24px; 
          box-shadow: 0 4px 20px -2px rgba(28, 25, 23, 0.04), 0 2px 8px -1px rgba(28, 25, 23, 0.02);
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .card:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 24px -4px rgba(28, 25, 23, 0.06), 0 4px 12px -2px rgba(28, 25, 23, 0.03);
          border-color: #D6C4AE;
        }
      `}</style>

      {/* ── STICKY TOP PLATFORM HEADER ── */}
      <header className="w-full border-b border-[#EADBCE] bg-white/90 backdrop-blur-md sticky top-0 z-40 px-6 py-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#D97706] to-[#F59E0B] flex items-center justify-center shadow-md">
            <Scissors size={20} className="text-white" strokeWidth={2.5} />
          </div>
          <div>
            <h4 className="text-stone-900 font-extrabold tracking-[0.2em] text-xs uppercase">Barber Pro</h4>
            <p className="text-[#B45309] text-[9px] font-black tracking-[0.3em] uppercase mt-0.5">Owner Console</p>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="hidden sm:flex flex-col text-right">
            <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wider">System Clock</span>
            <span className="text-xs font-extrabold text-stone-800 mt-0.5">{time} IST</span>
          </div>
          <button onClick={handleLogout} className="flex items-center gap-2 border border-stone-200 hover:border-stone-400 hover:bg-stone-50 px-4 py-2 rounded-xl text-stone-600 text-xs font-bold uppercase tracking-widest transition-all duration-200 cursor-pointer">
            <LogOut size={14} /> Exit
          </button>
        </div>
      </header>

      {/* Mesh Gradient Background Blobs */}
      <div className="absolute top-[15%] right-[-5%] w-96 h-96 bg-amber-100/40 rounded-full blur-[120px] opacity-60 pointer-events-none" />
      <div className="absolute bottom-[10%] left-[-5%] w-80 h-80 bg-orange-100/30 rounded-full blur-[120px] opacity-50 pointer-events-none" />

      {/* ── MAIN WORKSPACE CONTENT ── */}
      <main className="relative z-10 max-w-3xl mx-auto py-10 px-4 sm:px-6">
        
        {/* ── CONTEXT HEADER TITLE CARD ── */}
        <header className="mb-8 rounded-3xl p-8 card relative overflow-hidden bg-white">
          <div className="relative z-10">
            <p className="text-amber-700 font-bold tracking-[0.2em] text-xs uppercase mb-1.5">
              Grooming Team Administration
            </p>
            <h1 className="text-3xl lg:text-4xl font-black font-serif tracking-tight text-stone-900 leading-none">
              Request <span className="text-amber-600">Inbox</span>
            </h1>
            <p className="text-stone-500 font-medium mt-2 text-sm">Manage staff shift requests, lunch coverage, and downtime intervals smoothly.</p>
          </div>
          <div className="absolute right-6 top-1/2 -translate-y-1/2 opacity-5 transform rotate-6 pointer-events-none hidden sm:block">
            <Clock className="w-28 h-28 text-amber-700" strokeWidth={1} />
          </div>
        </header>

        {/* ── REAL-TIME STAFF FLOATING SUMMARY METRICS ── */}
        <section className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white border border-[#EADBCE] rounded-2xl p-4 text-center shadow-sm">
            <div className="mx-auto w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center mb-2 text-amber-700">
              <Users size={16} />
            </div>
            <span className="block text-[10px] font-black uppercase tracking-wider text-stone-400">Queue Active</span>
            <span className="block text-2xl font-black font-serif text-stone-900 mt-0.5">-{breakStats.total === 0 ? "Full" : "Shifted"}</span>
          </div>
          <div className="bg-white border border-[#EADBCE] rounded-2xl p-4 text-center shadow-sm">
            <div className="mx-auto w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center mb-2 text-orange-700">
              <Sandwich size={16} />
            </div>
            <span className="block text-[10px] font-black uppercase tracking-wider text-stone-400">Lunch Requests</span>
            <span className="block text-2xl font-black font-serif text-stone-900 mt-0.5">{breakStats.lunch}</span>
          </div>
          <div className="bg-white border border-[#EADBCE] rounded-2xl p-4 text-center shadow-sm">
            <div className="mx-auto w-8 h-8 rounded-lg bg-sky-50 flex items-center justify-center mb-2 text-sky-700">
              <Coffee size={16} />
            </div>
            <span className="block text-[10px] font-black uppercase tracking-wider text-stone-400">Short Breaks</span>
            <span className="block text-2xl font-black font-serif text-stone-900 mt-0.5">{breakStats.tea}</span>
          </div>
        </section>

        {/* ── CORE REQUEST PROCESSING QUEUE ── */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-3">
            <div className="w-10 h-10 border-4 border-amber-600 border-t-transparent rounded-full animate-spin" />
            <p className="text-xs font-bold text-stone-400 uppercase tracking-widest animate-pulse">Syncing Active Shifts...</p>
          </div>
        ) : (
          <div className="space-y-4">
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
                  <h2 className="text-2xl font-black text-stone-900 font-serif tracking-tight">Inbox Cleared</h2>
                  <p className="text-stone-400 text-sm mt-2 max-w-xs leading-relaxed">All operations are running at full capacity. No pending barber shift adjustments need action.</p>
                </motion.div>
              ) : (
                requests.map((req) => (
                  <motion.div
                    key={req._id}
                    layout
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
                    className="card p-5 bg-white group"
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
                          <h3 className="font-extrabold text-stone-900 text-base tracking-tight">{req.barber_id?.name || "Personnel Barber"}</h3>
                          <p className="text-[10px] font-black text-amber-800 uppercase tracking-widest mt-1 bg-amber-50 border border-amber-100 px-2 py-0.5 rounded-md inline-block">
                            {req.break_type} • {req.duration_mins} Mins Duration
                          </p>
                        </div>
                      </div>

                      {/* Control Button Actions */}
                      <div className="flex gap-2.5 justify-end sm:items-center">
                        <button 
                          onClick={() => handleAction(req._id, "rejected")} 
                          className="inline-flex items-center gap-1.5 px-4 py-3 text-stone-500 hover:text-rose-600 hover:bg-rose-50/50 rounded-xl transition-all font-bold text-xs uppercase tracking-wider border border-transparent hover:border-rose-200/60 cursor-pointer"
                        >
                          <XCircle size={14} /> Reject
                        </button>
                        <button 
                          onClick={() => handleAction(req._id, "approved")} 
                          className="inline-flex items-center gap-1.5 px-5 py-3 bg-gradient-to-r from-amber-600 to-amber-500 text-white rounded-xl font-extrabold text-xs uppercase tracking-wider hover:from-amber-700 hover:to-amber-600 shadow-md transition-all active:scale-98 cursor-pointer"
                        >
                          <CheckCircle size={14} /> Approve Break
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        )}
      </main>
    </div>
    <Footer />
    </div>
  );
}