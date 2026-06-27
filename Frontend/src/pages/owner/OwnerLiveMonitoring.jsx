import React, { useState, useEffect } from "react";
import { Users, Activity, RefreshCw, Scissors, ShieldAlert, Check, Coffee } from "lucide-react";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const GOLD = "#C5A059";
const CHARCOAL = "#3E362E";

export default function OwnerLiveMonitoring() {
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
        showToast(data.message || "Failed to load live staff", "error");
      }
    } catch (err) {
      showToast("Network error loading staff", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBarbers();
  }, []);

  const changeBarberStatus = async (barberId, nextStatus) => {
    setBusyId(barberId);
    try {
      const res = await fetch(`${API}/barber/${barberId}/status`, {
        method: "PUT",
        headers: headers(),
        body: JSON.stringify({ status: nextStatus })
      });
      const data = await res.json();
      if (data.success) {
        showToast(`Barber status set to ${nextStatus}`);
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

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "available":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "busy":
        return "bg-rose-50 text-rose-700 border-rose-200";
      case "break":
        return "bg-amber-50 text-amber-700 border-amber-200";
      default:
        return "bg-zinc-50 text-zinc-500 border-zinc-200";
    }
  };

  const barberImg = (i) => [
    "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=400&q=80",
    "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&w=400&q=80",
    "https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&w=400&q=80",
    "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?auto=format&fit=crop&w=400&q=80",
    "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80"
  ][i % 5];

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
      <header className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5 border-b pb-6 border-stone-200">
        <div>
          <h2 className="font-serif text-3xl sm:text-4xl tracking-normal text-stone-900 flex items-center justify-start gap-2 whitespace-nowrap">
            <span className="font-bold uppercase">Live</span>
            <span className="italic text-[#C5A059] normal-case font-medium">Monitoring</span>
          </h2>
          <p className="text-stone-400 text-xs font-medium tracking-wide mt-1.5 font-sans">
            Real-time tracking of on-duty staff, breaks, and active queue availability
          </p>
        </div>
        <div>
          <button 
            onClick={fetchBarbers} 
            disabled={loading}
            className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white border border-[#EADBCE] text-xs font-black uppercase tracking-wider text-stone-700 shadow-sm hover:bg-stone-50 cursor-pointer disabled:opacity-50 transition-all active:scale-95 font-sans"
          >
            <RefreshCw size={14} className={loading ? "animate-spin text-[#C5A059]" : "text-stone-500"} />
            Sync Statuses
          </button>
        </div>
      </header>
 
      {/* Live Badge indicator bar */}
      <div className="flex items-center gap-2 bg-white px-4 py-3 rounded-2xl border border-[#EADBCE] shadow-3xs w-fit mb-6">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#C5A059] font-sans">Live tracking active</span>
        <span className="text-xs text-stone-500 font-sans font-medium">· {barbers.length} staff registered</span>
      </div>
 
      {loading && barbers.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center animate-pulse">
            <Activity className="w-6 h-6 text-amber-600" />
          </div>
          <p className="text-stone-500 text-sm font-medium font-sans">Synchronizing live status feeds...</p>
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
                Add barbers in the Barber Team tab to see them in live monitoring.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {barbers.map((b, i) => (
                <div key={b._id} className="card p-0 overflow-hidden bg-white">
                  <div className="h-44 overflow-hidden relative">
                    <img 
                      src={barberImg(i)} 
                      alt={b.name} 
                      className="w-full h-full object-cover" 
                      onError={(e) => {
                        e.target.src = "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?auto=format&fit=crop&w=400&q=80";
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    
                    <div className="absolute bottom-4 left-4 text-left">
                      <h3 className="text-base font-black font-serif text-white leading-tight">{b.name}</h3>
                      <p className="text-xs text-stone-300 font-sans mt-0.5 font-semibold">{b.specialization || "Grooming Specialist"}</p>
                    </div>

                    <div className="absolute top-4 right-4">
                      <span className={`px-2.5 py-1 rounded-lg border text-[10px] font-black uppercase tracking-wider ${getStatusBadgeClass(b.status)}`}>
                        {b.status}
                      </span>
                    </div>
                  </div>

                  <div className="p-5 text-left space-y-4">
                    <div className="flex gap-2">
                      {["available", "busy", "break"].map(s => (
                        <button
                          key={s}
                          disabled={b.status === s || busyId === b._id}
                          onClick={() => changeBarberStatus(b._id, s)}
                          className={`flex-1 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all active:scale-95 cursor-pointer border text-center font-sans ${
                            b.status === s
                              ? "bg-[#FAF6F0] text-[#C5A059] border-[#C5A059]"
                              : "bg-[#FAFAF8] text-stone-500 border-[#EADBCE] hover:bg-stone-50"
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
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
