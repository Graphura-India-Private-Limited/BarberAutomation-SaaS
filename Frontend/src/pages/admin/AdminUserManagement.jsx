import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

function AdminUserManagement() {
  const [activeTab, setActiveTab] = useState("owners"); // Tab states: owners | barbers | customers
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
      <div className="min-h-screen bg-brand-cream flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-brand-orange border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-cream p-6 md:p-12 font-sans text-brand-dark">
      <div className="max-w-6xl mx-auto">
        
        {/* Dashboard Title */}
        <header className="mb-12">
          <h1 className="text-4xl font-black tracking-tight">
            User <span className="text-brand-orange italic">Management</span>
          </h1>
          <p className="text-brand-slate font-medium mt-1">Super Admin Core Control Engine</p>
        </header>

        {/* Tab Controls Navigation */}
        <div className="flex gap-2 mb-8 bg-white p-1.5 rounded-2xl shadow-sm border border-slate-100 max-w-md">
          {["owners", "barbers", "customers"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all ${
                activeTab === tab
                  ? "bg-brand-dark text-white shadow-md"
                  : "text-brand-slate hover:text-brand-dark"
              }`}
            >
              {tab === "owners" ? "Salons / Owners" : tab}
            </button>
          ))}
        </div>

        {/* Workspace Display View */}
        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-orange-950/5 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="p-6 md:p-8"
            >
              {/* --- SALONS/OWNERS DATA TAB VIEW --- */}
              {activeTab === "owners" && (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-100 text-brand-slate text-[11px] font-black uppercase tracking-widest">
                        <th className="pb-4">Shop Name</th>
                        <th className="pb-4">Assigned Admin/Owner</th>
                        <th className="pb-4">Max Barber Provision</th>
                        <th className="pb-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50 text-sm">
                      {data.salons?.map((salon) => (
                        <tr key={salon._id} className="group hover:bg-slate-50/50 transition-colors">
                          <td className="py-4 font-bold text-brand-dark">{salon.salon_name}</td>
                          <td className="py-4">
                            <p className="font-semibold text-brand-dark">{salon.owner_name || "System Admin"}</p>
                            <p className="text-xs text-brand-slate">{salon.email || "No email available"}</p>
                          </td>
                          <td className="py-4">
                            {editingSalonId === salon._id ? (
                              <input
                                type="number"
                                value={newLimit}
                                onChange={(e) => setNewLimit(Number(e.target.value))}
                                className="w-16 px-2 py-1 border border-brand-orange rounded-lg text-center font-bold text-brand-dark focus:outline-none"
                              />
                            ) : (
                              <span className="inline-flex items-center px-3 py-1 rounded-full bg-orange-50 text-brand-orange font-bold text-xs">
                                {salon.max_barbers_limit || 3} Barbers Max
                              </span>
                            )}
                          </td>
                          <td className="py-4 text-right">
                            {editingSalonId === salon._id ? (
                              <div className="flex justify-end gap-2">
                                <button onClick={() => setEditingSalonId(null)} className="text-xs font-bold text-brand-slate hover:underline">Cancel</button>
                                <button onClick={() => handleUpdateLimit(salon._id)} className="px-3 py-1.5 bg-brand-orange text-white text-xs font-bold rounded-xl shadow-sm">Save</button>
                              </div>
                            ) : (
                              <button
                                onClick={() => { setEditingSalonId(salon._id); setNewLimit(salon.max_barbers_limit || 3); }}
                                className="text-xs font-bold bg-slate-100 text-brand-dark hover:bg-brand-dark hover:text-white px-3 py-1.5 rounded-xl transition-all"
                              >
                                Modify Limit
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* --- BARBERS DATA TAB VIEW --- */}
              {activeTab === "barbers" && (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-100 text-brand-slate text-[11px] font-black uppercase tracking-widest">
                        <th className="pb-4">Barber Name</th>
                        <th className="pb-4">Assigned Salon ID</th>
                        <th className="pb-4">Contact Info</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50 text-sm">
                      {data.barbers?.map((barber) => (
                        <tr key={barber._id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="py-4 font-bold text-brand-dark">{barber.name}</td>
                          <td className="py-4 font-mono text-xs text-brand-orange">{barber.salon_id || "Unassigned"}</td>
                          <td className="py-4 text-brand-slate font-medium">{barber.email || barber.phone}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* --- CUSTOMERS DATA TAB VIEW --- */}
              {activeTab === "customers" && (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-100 text-brand-slate text-[11px] font-black uppercase tracking-widest">
                        <th className="pb-4">Customer Details</th>
                        <th className="pb-4">Phone Registration</th>
                        <th className="pb-4">Join Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50 text-sm">
                      {data.customers?.map((cust) => (
                        <tr key={cust._id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="py-4">
                            <p className="font-bold text-brand-dark">{cust.name || "Anonymous App User"}</p>
                            <p className="text-xs text-brand-slate">{cust.email || "No Email Provided"}</p>
                          </td>
                          <td className="py-4 font-mono text-xs font-bold text-brand-dark">{cust.phone}</td>
                          <td className="py-4 text-brand-slate">{cust.created_at ? new Date(cust.created_at).toLocaleDateString() : "Prior to 2026"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
}

export default AdminUserManagement;