import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

function BreakApprovalDashboard() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchRequests(); }, []);

  const fetchRequests = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/breaks/pending");
      const data = await res.json();
      if (data.success) setRequests(data.data);
      setLoading(false);
    } catch (err) { console.error(err); }
  };

  const handleAction = async (id, status) => {
    const res = await fetch(`http://localhost:5000/api/breaks/action/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status })
    });
    if (res.ok) setRequests(prev => prev.filter(req => req._id !== id));
  };

  return (
    <div className="min-h-screen bg-brand-cream relative overflow-hidden">
      {/* Mesh Gradient Background Blobs */}
      <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-orange-100 rounded-full blur-[100px] opacity-60" />
      <div className="absolute bottom-[-5%] left-[-5%] w-80 h-80 bg-blue-50 rounded-full blur-[100px] opacity-60" />

      <div className="relative z-10 max-w-2xl mx-auto py-16 px-6">
        <header className="mb-12">
          <h1 className="text-4xl font-black text-brand-dark tracking-tight">
            Request <span className="text-brand-orange">Inbox</span>
          </h1>
          <p className="text-brand-slate font-medium mt-2">Manage your team's availability</p>
        </header>

        {loading ? (
          <div className="flex justify-center py-20"><div className="w-10 h-10 border-4 border-brand-orange border-t-transparent rounded-full animate-spin" /></div>
        ) : (
          <div className="space-y-6">
            <AnimatePresence mode="popLayout">
              {requests.length === 0 ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                  className="bg-white/60 backdrop-blur-md border border-white p-20 rounded-4xl text-center shadow-xl shadow-orange-900/5"
                >
                  <span className="text-5xl block mb-4">✨</span>
                  <h2 className="text-xl font-bold text-brand-dark">Inbox Cleared</h2>
                  <p className="text-brand-slate text-sm">No pending lunch or break requests.</p>
                </motion.div>
              ) : (
                requests.map((req) => (
                  <motion.div
                    key={req._id}
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="bg-white border border-slate-100 p-6 rounded-3xl shadow-sm hover:shadow-md transition-all group"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-brand-dark flex items-center justify-center text-2xl group-hover:bg-brand-orange transition-colors duration-300">
                          {req.break_type === 'lunch' ? '🍱' : '☕'}
                        </div>
                        <div>
                          <h3 className="font-bold text-brand-dark text-lg">{req.barber_id?.name || "Barber"}</h3>
                          <p className="text-xs font-black text-brand-orange uppercase tracking-widest">
                            {req.break_type} • {req.duration_mins} MINS
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => handleAction(req._id, "rejected")} className="p-3 text-brand-slate hover:text-red-500 transition-colors">✕</button>
                        <button onClick={() => handleAction(req._id, "approved")} className="px-6 py-3 bg-brand-dark text-white rounded-2xl font-bold text-sm hover:bg-brand-orange transition-all active:scale-95">Approve</button>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}

export default BreakApprovalDashboard;