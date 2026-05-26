import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Scissors, LogOut, Users, Store, ShieldAlert, ChevronDown, UserCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function AdminUserManagement() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("owners"); // Tab states: owners | barbers | customers
  const [data, setData] = useState({ salons: [], barbers: [], customers: [] });
  const [loading, setLoading] = useState(true);
  const [editingSalonId, setEditingSalonId] = useState(null);
  const [newLimit, setNewLimit] = useState(3);
  const [time, setTime] = useState(new Date().toLocaleTimeString("en-IN", { hour: '2-digit', minute: '2-digit' }));

  useEffect(() => {
    fetchUsers();
    const timer = setInterval(() => {
      setTime(new Date().toLocaleTimeString("en-IN", { hour: '2-digit', minute: '2-digit' }));
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/admin/users-overview");
      const json = await res.json();
      if (json.success) {
        setData(json.data);
      }
    } catch (err) {
      console.error("Error fetching admin data overview:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateLimit = async (salonId) => {
    try {
      const res = await fetch(`http://localhost:5000/api/admin/salon-limit/${salonId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ max_barbers_limit: newLimit })
      });
      const json = await res.json();
      if (json.success) {
        setData(prev => ({
          ...prev,
          salons: prev.salons.map(s => s._id === salonId ? { ...s, max_barbers_limit: newLimit } : s)
        }));
        setEditingSalonId(null);
      }
    } catch (err) {
      console.error("Error adjusting capacity configuration threshold:", err);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF6F0] flex flex-col items-center justify-center gap-3">
        <div className="w-10 h-10 border-4 border-amber-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-xs font-bold text-stone-400 uppercase tracking-widest animate-pulse">Mapping Core Records...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen font-sans text-stone-800 selection:bg-amber-100" style={{ background: "#FAF6F0" }}>
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
      `}</style>

      {/* ── STICKY TOP PLATFORM HEADER (Redesigned with Premium Dark Espresso Theme) ── */}
      <header className="w-full border-b border-[#3E362E] bg-[#251F1B] sticky top-0 z-40 px-6 py-4 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#D97706] to-[#F59E0B] flex items-center justify-center shadow-md">
            <Scissors size={20} className="text-white" strokeWidth={2.5} />
          </div>
          <div>
            <h4 className="text-white font-extrabold tracking-[0.2em] text-xs uppercase">Barber Pro</h4>
            <p className="text-[#C5A059] text-[9px] font-black tracking-[0.3em] uppercase mt-0.5">Admin Management</p>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="hidden sm:flex flex-col text-right">
            <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wider">System Clock</span>
            <span className="text-xs font-extrabold text-[#FFE6A7] mt-0.5">{time} IST</span>
          </div>
          <button onClick={handleLogout} className="flex items-center gap-2 border border-stone-700 hover:border-stone-500 bg-white/5 hover:bg-white/10 px-4 py-2 rounded-xl text-stone-200 text-xs font-bold uppercase tracking-widest transition-all duration-200 cursor-pointer">
            <LogOut size={14} /> Exit
          </button>
        </div>
      </header>

      {/* ── MAIN CONTENT CONTAINER ── */}
      <main className="max-w-6xl mx-auto px-4 py-10 md:px-8">
        
        {/* Context Header */}
        <header className="mb-10 rounded-3xl p-8 card relative overflow-hidden bg-white">
          <div className="relative z-10">
            <p className="text-amber-700 font-bold tracking-[0.2em] text-xs uppercase mb-1.5">
              Super Admin Core Control Engine
            </p>
            <h1 className="text-3xl lg:text-4xl font-black font-serif tracking-tight text-stone-900 leading-none">
              User <span className="text-amber-600 italic">Management</span>
            </h1>
            <p className="text-stone-500 font-medium mt-3 text-sm">Monitor platform registration nodes, alter salon provision bounds, and inspect user directory states.</p>
          </div>
          <div className="absolute right-6 top-1/2 -translate-y-1/2 opacity-5 transform rotate-6 pointer-events-none hidden sm:block">
            <UserCircle2 className="w-28 h-28 text-amber-700" strokeWidth={1} />
          </div>
        </header>

        {/* Tab Controls Navigation */}
        <div className="flex gap-2 mb-8 bg-white p-1.5 rounded-2xl shadow-sm border border-[#EADBCE] max-w-md">
          {["owners", "barbers", "customers"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-3 rounded-xl font-black text-[11px] uppercase tracking-wider transition-all cubic-bezier(0.4,0,0.2,1) cursor-pointer ${
                activeTab === tab
                  ? "bg-[#251F1B] text-white shadow-md"
                  : "text-stone-400 hover:text-stone-900"
              }`}
            >
              {tab === "owners" ? "Salons / Owners" : tab}
            </button>
          ))}
        </div>

        {/* Workspace Display View */}
        <div className="card overflow-hidden bg-white mb-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="p-6 md:p-8"
            >
              {/* --- SALONS/OWNERS DATA TAB VIEW --- */}
              {activeTab === "owners" && (
                <div className="overflow-x-auto w-full custom-scrollbar">
                  <table className="w-full text-left border-collapse text-sm">
                    <thead>
                      <tr className="border-b border-stone-100 text-stone-400 text-[10px] font-black uppercase tracking-[0.15em]">
                        <th className="pb-4">Shop Name</th>
                        <th className="pb-4">Assigned Admin/Owner</th>
                        <th className="pb-4">Max Barber Provision</th>
                        <th className="pb-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-50">
                      {data.salons?.length === 0 ? (
                        <tr><td colSpan={4} className="text-center py-10 text-stone-400 italic">No registered salons in database index.</td></tr>
                      ) : (
                        data.salons?.map((salon) => (
                          <tr key={salon._id} className="group hover:bg-stone-50/50 transition-colors">
                            <td className="py-4.5 font-bold font-serif text-stone-900 text-base">{salon.salon_name}</td>
                            <td className="py-4.5">
                              <p className="font-extrabold text-stone-800 text-sm">{salon.owner_name || "System Admin"}</p>
                              <p className="text-xs text-stone-400 font-medium font-sans mt-0.5">{salon.email || "No contact mapping set"}</p>
                            </td>
                            <td className="py-4.5">
                              {editingSalonId === salon._id ? (
                                <input
                                  type="number"
                                  value={newLimit}
                                  onChange={(e) => setNewLimit(Number(e.target.value))}
                                  className="w-20 px-3 py-1.5 border border-[#D97706] rounded-xl text-center font-bold text-stone-900 bg-amber-50/40 focus:outline-none text-xs"
                                />
                              ) : (
                                <span className="inline-flex items-center px-3 py-1 rounded-full bg-amber-50 border border-amber-200/60 text-amber-800 font-black text-[10px] uppercase tracking-wider">
                                  {salon.max_barbers_limit || 3} Barbers Max
                                </span>
                              )}
                            </td>
                            <td className="py-4.5 text-right">
                              {editingSalonId === salon._id ? (
                                <div className="flex justify-end gap-3 items-center">
                                  <button onClick={() => setEditingSalonId(null)} className="text-xs font-bold text-stone-400 hover:text-stone-600 transition-colors cursor-pointer">Cancel</button>
                                  <button onClick={() => handleUpdateLimit(salon._id)} className="px-4 py-2 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-700 text-white text-xs font-black uppercase tracking-wider rounded-xl shadow-sm cursor-pointer">Save</button>
                                </div>
                              ) : (
                                <button
                                  onClick={() => { setEditingSalonId(salon._id); setNewLimit(salon.max_barbers_limit || 3); }}
                                  className="text-xs font-black uppercase tracking-wider bg-stone-50 hover:bg-stone-900 border border-stone-200 text-stone-700 hover:text-white px-3.5 py-2 rounded-xl transition-all duration-200 cursor-pointer"
                                >
                                  Modify Limit
                                </button>
                              )}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              )}

              {/* --- BARBERS DATA TAB VIEW --- */}
              {activeTab === "barbers" && (
                <div className="overflow-x-auto w-full custom-scrollbar">
                  <table className="w-full text-left border-collapse text-sm">
                    <thead>
                      <tr className="border-b border-stone-100 text-stone-400 text-[10px] font-black uppercase tracking-[0.15em]">
                        <th className="pb-4">Barber Name</th>
                        <th className="pb-4">Assigned Salon ID</th>
                        <th className="pb-4">Contact Info</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-50">
                      {data.barbers?.length === 0 ? (
                        <tr><td colSpan={3} className="text-center py-10 text-stone-400 italic">No registered staff barbers located.</td></tr>
                      ) : (
                        data.barbers?.map((barber) => (
                          <tr key={barber._id} className="hover:bg-stone-50/50 transition-colors">
                            <td className="py-4.5 font-bold text-stone-900 text-sm">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-stone-100 border border-stone-200 flex items-center justify-center text-xs font-black text-stone-600 shadow-inner">
                                  {(barber.name || "B")[0].toUpperCase()}
                                </div>
                                <span>{barber.name}</span>
                              </div>
                            </td>
                            <td className="py-4.5 font-mono text-xs text-amber-700 font-bold">{barber.salon_id || "Unassigned Anchor"}</td>
                            <td className="py-4.5 text-stone-500 font-medium font-sans">{barber.email || barber.phone || "—"}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              )}

              {/* --- CUSTOMERS DATA TAB VIEW --- */}
              {activeTab === "customers" && (
                <div className="overflow-x-auto w-full custom-scrollbar">
                  <table className="w-full text-left border-collapse text-sm">
                    <thead>
                      <tr className="border-b border-stone-100 text-stone-400 text-[10px] font-black uppercase tracking-[0.15em]">
                        <th className="pb-4">Customer Details</th>
                        <th className="pb-4">Phone Registration</th>
                        <th className="pb-4">Join Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-50">
                      {data.customers?.length === 0 ? (
                        <tr><td colSpan={3} className="text-center py-10 text-stone-400 italic">No app user installations flagged yet.</td></tr>
                      ) : (
                        data.customers?.map((cust) => (
                          <tr key={cust._id} className="hover:bg-stone-50/50 transition-colors">
                            <td className="py-4.5">
                              <p className="font-bold text-stone-900 text-sm">{cust.name || "Anonymous Guest"}</p>
                              <p className="text-xs text-stone-400 font-sans mt-0.5">{cust.email || "No direct email mapped"}</p>
                            </td>
                            <td className="py-4.5 font-mono text-xs font-bold text-stone-700">{cust.phone || "No wire token"}</td>
                            <td className="py-4.5 text-stone-500 font-medium font-sans">{cust.created_at ? new Date(cust.created_at).toLocaleDateString("en-IN", { dateStyle: "medium" }) : "Prior to 2026"}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

      </main>
    </div>
  );
}