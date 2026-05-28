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
    <div className="min-h-screen p-6 font-sans text-zinc-800 relative overflow-hidden" style={{ background: "var(--bg)" }}>
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

      {/* Mesh Gradient Background Blobs */}
      <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-amber-100/50 rounded-full blur-[100px] opacity-60" />
      <div className="absolute bottom-[-5%] left-[-5%] w-80 h-80 bg-orange-100/30 rounded-full blur-[100px] opacity-60" />

      <div className="relative z-10 max-w-2xl mx-auto py-12 px-4">
        <header className="mb-12">
          <p className="text-amber-700 font-sans normal-case font-bold tracking-[2px] text-xs sm:text-sm uppercase mb-1">
            Grooming Team Administration
          </p>
          <h1 className="text-4xl font-bold text-zinc-900 font-serif tracking-normal">
            Request <span className="text-amber-600">Inbox</span>
          </h1>
          <p className="text-zinc-500 font-medium mt-2">Manage your team's availability</p>
        </header>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-4 border-amber-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="space-y-6">
            <AnimatePresence mode="popLayout">
              {requests.length === 0 ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                  className="bg-white/90 backdrop-blur-md border border-zinc-200 p-16 rounded-3xl text-center shadow-lg card hover:transform-none"
                >
                  <span className="text-5xl block mb-4">✨</span>
                  <h2 className="text-xl font-bold text-zinc-900 font-serif">Inbox Cleared</h2>
                  <p className="text-zinc-500 text-sm mt-1">No pending lunch or break requests.</p>
                </motion.div>
              ) : (
                requests.map((req) => (
                  <motion.div
                    key={req._id}
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="card p-6 transition-all group"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center text-2xl group-hover:bg-amber-100 transition-colors duration-300">
                          {req.break_type === 'lunch' ? '🍱' : '☕'}
                        </div>
                        <div>
                          <h3 className="font-bold text-zinc-900 text-lg font-sans">{req.barber_id?.name || "Barber"}</h3>
                          <p className="text-xs font-bold text-amber-700 uppercase tracking-widest mt-0.5">
                            {req.break_type} • {req.duration_mins} MINS
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2 self-end sm:self-center">
                        <button 
                          onClick={() => handleAction(req._id, "rejected")} 
                          className="px-4 py-3 text-zinc-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all font-bold text-sm border border-transparent hover:border-red-100"
                        >
                          ✕ Reject
                        </button>
                        <button 
                          onClick={() => handleAction(req._id, "approved")} 
                          className="px-6 py-3 bg-amber-600 text-white rounded-xl font-bold text-sm hover:bg-amber-700 shadow-md transition-all active:scale-95"
                        >
                          Approve
                        </button>
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