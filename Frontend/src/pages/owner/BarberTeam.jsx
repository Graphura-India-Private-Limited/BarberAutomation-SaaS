import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Users, Scissors, Phone, Award, ShieldCheck, 
  Trash2, Coffee, Sparkles, Check, Star, RefreshCw, Plus
} from "lucide-react";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const GOLD = "#C5A059";
const CHARCOAL = "#3E362E";

export default function BarberTeam() {
  const navigate = useNavigate();
  const [barbers, setBarbers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [busyId, setBusyId] = useState(null);
  
  const salonId = localStorage.getItem("salonId");
  const token = localStorage.getItem("token");

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const headers = () => ({
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`
  });

  const fetchBarbers = async () => {
    if (!salonId) {
      showToast("Salon ID missing. Please log in again.", "error");
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API}/barber/salon/${salonId}`, {
        headers: headers()
      });
      const data = await res.json();
      if (data.success) {
        setBarbers(data.barbers || []);
      } else {
        showToast(data.message || "Failed to load barbers", "error");
      }
    } catch (err) {
      showToast("Network error loading barbers", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBarbers();
  }, []);

  const toggleStatus = async (barberId, currentStatus) => {
    const nextStatus = currentStatus === "available" ? "break" : "available";
    setBusyId(barberId);
    try {
      const res = await fetch(`${API}/barber/${barberId}/status`, {
        method: "PUT",
        headers: headers(),
        body: JSON.stringify({ status: nextStatus })
      });
      const data = await res.json();
      if (data.success) {
        showToast(`Barber status updated to ${nextStatus === "break" ? "On Break" : "Available"}`);
        setBarbers(prev => prev.map(b => b._id === barberId ? { ...b, status: nextStatus } : b));
      } else {
        showToast(data.message || "Failed to update status", "error");
      }
    } catch (err) {
      showToast("Network error updating status", "error");
    } finally {
      setBusyId(null);
    }
  };

  const deactivateBarber = async (barberId) => {
    if (!window.confirm("Are you sure you want to deactivate this barber? They will be removed from your active team catalog.")) return;
    setBusyId(barberId);
    try {
      const res = await fetch(`${API}/barber/${barberId}`, {
        method: "DELETE",
        headers: headers()
      });
      const data = await res.json();
      if (data.success) {
        showToast("Barber deactivated successfully");
        setBarbers(prev => prev.filter(b => b._id !== barberId));
      } else {
        showToast(data.message || "Failed to deactivate barber", "error");
      }
    } catch (err) {
      showToast("Network error deactivating barber", "error");
    } finally {
      setBusyId(null);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "available":
        return {
          label: "Present & Available",
          style: "bg-emerald-50 text-emerald-700 border-emerald-200"
        };
      case "busy":
        return {
          label: "Busy",
          style: "bg-rose-50 text-rose-700 border-rose-200"
        };
      case "break":
        return {
          label: "On Break",
          style: "bg-amber-50 text-amber-700 border-amber-200"
        };
      default:
        return {
          label: "Offline",
          style: "bg-zinc-50 text-zinc-500 border-zinc-200"
        };
    }
  };

  return (
    <div className="min-h-screen p-6 md:p-10 font-sans text-stone-800 text-left animate-fade-in" style={{ background: "#FAF6F0" }}>
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

      {/* Header */}
      <header className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5 border-b pb-6 border-stone-200">
        <div>
          <h2 className="font-serif text-3xl sm:text-4xl tracking-normal text-stone-900 flex items-center justify-start gap-2 whitespace-nowrap">
            <span className="font-bold uppercase">Barber</span>
            <span className="italic text-[#C5A059] normal-case font-medium">Team</span>
          </h2>
          <p className="text-stone-400 text-xs font-medium tracking-wide mt-1.5">
            Manage your salon technicians, active statuses, and scheduling approvals
          </p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => navigate("/owner/add-barber")}
            className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-xs font-black uppercase tracking-wider text-white shadow-sm hover:opacity-90 cursor-pointer transition-all active:scale-95"
            style={{ background: GOLD }}
          >
            <Plus size={14} className="text-white" />
            Add Barber
          </button>
          <button 
            onClick={fetchBarbers} 
            disabled={loading}
            className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white border border-[#EADBCE] text-xs font-black uppercase tracking-wider text-stone-700 shadow-sm hover:bg-stone-50 cursor-pointer disabled:opacity-50 transition-all active:scale-95"
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
            Sync Team
          </button>
        </div>
      </header>

      {loading && barbers.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center animate-pulse">
            <Users className="w-6 h-6 text-amber-600" />
          </div>
          <p className="text-stone-500 text-sm font-medium">Syncing barber profiles...</p>
        </div>
      ) : (
        <>
          {barbers.length === 0 ? (
            <div className="card p-12 text-center border-dashed">
              <div className="w-16 h-16 mx-auto bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl flex items-center justify-center border border-amber-100 shadow-sm text-3xl mb-4">
                💈
              </div>
              <h2 className="font-serif text-xl sm:text-2xl text-stone-900 font-bold uppercase mb-2">No Barbers Seeded</h2>
              <p className="mx-auto max-w-xs text-sm text-stone-400 font-sans leading-relaxed">
                Add barbers to build your team catalog.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {barbers.map(barber => {
                const statusMeta = getStatusBadge(barber.status);
                const rating = barber.rating || 0;
                
                return (
                  <div key={barber._id} className="card p-6 flex flex-col justify-between relative bg-white">
                    <div>
                      <div className="flex items-start justify-between gap-4 mb-4">
                        <div className="flex items-center gap-3.5">
                          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#8B5A2B] to-[#4A3E3D] text-white flex items-center justify-center font-serif text-xl font-bold">
                            {barber.name?.[0]?.toUpperCase() || "?"}
                          </div>
                          <div>
                            <h3 className="text-base font-black font-serif text-stone-900 leading-tight">{barber.name}</h3>
                            <span className="text-xs text-[#C5A059] font-bold mt-1.5 inline-block">{barber.specialization || "General Stylist"}</span>
                          </div>
                        </div>

                        <button 
                          onClick={() => deactivateBarber(barber._id)}
                          disabled={busyId === barber._id}
                          className="p-2 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition cursor-pointer disabled:opacity-40"
                          title="Deactivate Barber"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>

                      <div className="space-y-2.5 py-4 border-t border-b border-stone-100/60 my-4 text-xs font-medium">
                        <div className="flex items-center gap-3 text-stone-600">
                          <Phone size={14} className="text-[#C5A059]" />
                          <span>+91 {barber.mobile}</span>
                        </div>
                        <div className="flex items-center gap-3 text-stone-600">
                          <Award size={14} className="text-[#C5A059]" />
                          <span>{barber.experience || 0} Years Experience</span>
                        </div>
                        <div className="flex items-center gap-3 text-stone-600">
                          <ShieldCheck size={14} className="text-[#C5A059]" />
                          <span>Aadhaar: XXXX-XXXX-4932</span>
                        </div>
                        <div className="flex items-center gap-3 text-stone-600">
                          <Star size={14} className="text-[#C5A059] fill-amber-400 stroke-amber-500" />
                          <span className="font-bold text-stone-900">{rating.toFixed(1)} / 5.0 Rating</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-2 flex items-center justify-between gap-4">
                      <span className={`px-2.5 py-1 rounded-lg border text-[10px] font-black uppercase tracking-wider ${statusMeta.style}`}>
                        {statusMeta.label}
                      </span>

                      {barber.status !== "busy" && barber.status !== "offline" && (
                        <button 
                          onClick={() => toggleStatus(barber._id, barber.status)}
                          disabled={busyId === barber._id}
                          className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-extrabold text-[10px] uppercase tracking-wider transition-all active:scale-95 cursor-pointer border shadow-xs ${
                            barber.status === "break" 
                              ? "bg-white text-stone-700 border-[#EADBCE] hover:bg-stone-50"
                              : "bg-[#3E362E] text-white border-transparent hover:opacity-90"
                          }`}
                        >
                          {barber.status === "break" ? (
                            <>
                              <Check size={12} className="text-emerald-500" />
                              Set Available
                            </>
                          ) : (
                            <>
                              <Coffee size={12} className="text-amber-500" />
                              Go On Break
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* Toast Alert */}
      {toast && (
        <div className={`fixed bottom-6 right-6 px-5 py-3 rounded-xl text-white font-bold text-xs shadow-2xl z-50 animate-in slide-in-from-right ${
          toast.type === "error" ? "bg-red-500" : "bg-[#8B5A2B]"
        }`}>
          {toast.msg}
        </div>
      )}
    </div>
  );
}
