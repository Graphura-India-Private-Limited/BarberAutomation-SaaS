import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RefreshCw } from "lucide-react";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export default function AdminUserManagement() {
  const [activeTab, setActiveTab] = useState("owners");
  const [data, setData] = useState({ salons: [], barbers: [], customers: [] });
  const [loading, setLoading] = useState(true);
  const [editingSalonId, setEditingSalonId] = useState(null);
  const [newLimit, setNewLimit] = useState(3);

  useEffect(() => {
    fetchUsers();
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

  if (loading) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center gap-3">
        <div className="w-10 h-10 border-4 border-amber-600 border-t-transparent rounded-full animate-spin" />
        <p className="font-sans text-[11px] font-extrabold uppercase tracking-widest text-[#C5A059] animate-pulse">Mapping Core Records...</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap');
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

      {/* Tab Controls Navigation Row with Refresh */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
        <div className="flex gap-2 bg-white p-1.5 rounded-2xl shadow-sm border border-[#EADBCE] w-full sm:max-w-md">
          {["owners", "barbers", "customers"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-3 rounded-xl font-sans font-extrabold text-xs uppercase tracking-wider transition-all cubic-bezier(0.4,0,0.2,1) cursor-pointer ${
                activeTab === tab
                  ? "bg-[#251F1B] text-white shadow-md"
                  : "text-stone-400 hover:text-stone-900"
              }`}
            >
              {tab === "owners" ? "Salons / Owners" : tab}
            </button>
          ))}
        </div>

        <button
          onClick={fetchUsers}
          disabled={loading}
          className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white border border-[#EADBCE] text-xs font-black uppercase tracking-wider text-stone-700 shadow-sm hover:bg-stone-50 cursor-pointer disabled:opacity-50 transition-all active:scale-95 font-sans"
        >
          <RefreshCw size={14} className={loading ? "animate-spin text-[#C5A059]" : "text-stone-500"} />
          Sync Directory
        </button>
      </div>

      {/* Workspace Display View */}
      <div className="card overflow-hidden bg-white mb-6">
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
                    <tr className="border-b border-stone-100">
                      <th className="pb-4 font-sans text-[11px] font-extrabold uppercase tracking-widest text-[#C5A059]">Shop Name</th>
                      <th className="pb-4 font-sans text-[11px] font-extrabold uppercase tracking-widest text-[#C5A059]">Assigned Admin/Owner</th>
                      <th className="pb-4 font-sans text-[11px] font-extrabold uppercase tracking-widest text-[#C5A059]">Max Barber Provision</th>
                      <th className="pb-4 font-sans text-[11px] font-extrabold uppercase tracking-widest text-[#C5A059] text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-50">
                    {data.salons?.length === 0 ? (
                      <tr><td colSpan={4} className="text-center py-10 font-sans text-sm font-normal leading-relaxed text-stone-600 italic">No registered salons in database index.</td></tr>
                    ) : (
                      data.salons?.map((salon) => (
                        <tr key={salon._id} className="group hover:bg-stone-50/50 transition-colors">
                          <td className="py-4 font-serif italic text-[#C5A059] text-base">{salon.salon_name}</td>
                          <td className="py-4">
                            <p className="font-sans font-black text-stone-800 text-sm uppercase tracking-wide">{salon.owner_name || "System Admin"}</p>
                            <p className="font-sans text-sm font-normal leading-relaxed text-stone-600 mt-0.5">{salon.email || "No contact mapping set"}</p>
                          </td>
                          <td className="py-4">
                            {editingSalonId === salon._id ? (
                              <input
                                type="number"
                                value={newLimit}
                                onChange={(e) => setNewLimit(Number(e.target.value))}
                                className="w-20 px-3 py-1.5 border border-[#D97706] rounded-xl text-center font-sans font-extrabold text-xs uppercase tracking-wider text-stone-900 bg-amber-50/40 focus:outline-none"
                              />
                            ) : (
                              <span className="inline-flex items-center px-3 py-1 rounded-full bg-amber-50 border border-amber-200/60 text-amber-800 font-sans font-extrabold text-[11px] uppercase tracking-widest">
                                {salon.max_barbers_limit || 3} Barbers Max
                              </span>
                            )}
                          </td>
                          <td className="py-4 text-right">
                            {editingSalonId === salon._id ? (
                              <div className="flex justify-end gap-3 items-center">
                                <button onClick={() => setEditingSalonId(null)} className="font-sans text-xs font-extrabold uppercase tracking-wider text-stone-400 hover:text-stone-600 transition-colors cursor-pointer">Cancel</button>
                                <button onClick={() => handleUpdateLimit(salon._id)} className="px-4 py-2 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-700 text-white font-sans text-xs font-extrabold uppercase tracking-wider rounded-xl shadow-sm cursor-pointer">Save</button>
                              </div>
                            ) : (
                              <button
                                onClick={() => { setEditingSalonId(salon._id); setNewLimit(salon.max_barbers_limit || 3); }}
                                className="font-sans text-xs font-extrabold uppercase tracking-wider bg-stone-50 hover:bg-stone-900 border border-stone-200 text-stone-700 hover:text-white px-3.5 py-2 rounded-xl transition-all duration-200 cursor-pointer"
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
                    <tr className="border-b border-stone-100">
                      <th className="pb-4 font-sans text-[11px] font-extrabold uppercase tracking-widest text-[#C5A059]">Barber Name</th>
                      <th className="pb-4 font-sans text-[11px] font-extrabold uppercase tracking-widest text-[#C5A059]">Assigned Salon ID</th>
                      <th className="pb-4 font-sans text-[11px] font-extrabold uppercase tracking-widest text-[#C5A059]">Contact Info</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-50">
                    {data.barbers?.length === 0 ? (
                      <tr><td colSpan={3} className="text-center py-10 font-sans text-sm font-normal leading-relaxed text-stone-600 italic">No registered staff barbers located.</td></tr>
                    ) : (
                      data.barbers?.map((barber) => (
                        <tr key={barber._id} className="hover:bg-stone-50/50 transition-colors">
                          <td className="py-4 font-sans font-black text-stone-900 text-sm uppercase tracking-wide">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-lg bg-stone-100 border border-stone-200 flex items-center justify-center font-sans text-xs font-extrabold uppercase text-stone-600 shadow-inner">
                                {(barber.name || "B")[0].toUpperCase()}
                              </div>
                              <span>{barber.name}</span>
                            </div>
                          </td>
                          <td className="py-4 font-sans text-xs font-extrabold uppercase tracking-wider text-amber-700">{barber.salon_id || "Unassigned Anchor"}</td>
                          <td className="py-4 font-sans text-sm font-normal leading-relaxed text-stone-600">{barber.email || barber.phone || "—"}</td>
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
                    <tr className="border-b border-stone-100">
                      <th className="pb-4 font-sans text-[11px] font-extrabold uppercase tracking-widest text-[#C5A059]">Customer Details</th>
                      <th className="pb-4 font-sans text-[11px] font-extrabold uppercase tracking-widest text-[#C5A059]">Phone Registration</th>
                      <th className="pb-4 font-sans text-[11px] font-extrabold uppercase tracking-widest text-[#C5A059]">Join Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-50">
                    {data.customers?.length === 0 ? (
                      <tr><td colSpan={3} className="text-center py-10 font-sans text-sm font-normal leading-relaxed text-stone-600 italic">No app user installations flagged yet.</td></tr>
                    ) : (
                      data.customers?.map((cust) => (
                        <tr key={cust._id} className="hover:bg-stone-50/50 transition-colors">
                          <td className="py-4">
                            <p className="font-sans font-black text-stone-900 text-sm uppercase tracking-wide">{cust.name || "Anonymous Guest"}</p>
                            <p className="font-sans text-sm font-normal leading-relaxed text-stone-600 mt-0.5">{cust.email || "No direct email mapped"}</p>
                          </td>
                          <td className="py-4 font-sans text-xs font-extrabold uppercase tracking-wider text-stone-700">{cust.phone || "No wire token"}</td>
                          <td className="py-4 font-sans text-sm font-normal leading-relaxed text-stone-600">{cust.created_at ? new Date(cust.created_at).toLocaleDateString("en-IN", { dateStyle: "medium" }) : "Prior to 2026"}</td>
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
    </div>
  );
}