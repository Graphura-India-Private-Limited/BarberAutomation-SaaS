import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Scissors, BarChart2, CreditCard, DollarSign, UserCheck, 
  MapPin, Clock, ShieldAlert, Edit, LogOut, LayoutDashboard,
  TrendingUp, Users, Activity, Sparkles, Image as ImageIcon, RefreshCw, Coffee 
} from "lucide-react";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const GOLD = "#C5A059";
const CHARCOAL = "#3E362E";

export default function OwnerDashboard() {
  const navigate = useNavigate();
  const [salon, setSalon] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedDay, setSelectedDay] = useState(null);
  const [pendingBreaks, setPendingBreaks] = useState([]);
  const [showBreaks, setShowBreaks] = useState(false);

  const token = localStorage.getItem("token");

  const fetchProfile = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API}/auth/owner/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message || "Unable to load profile");
      setSalon(data.salon);
    } catch (err) {
      setError(err.message || "Unable to load profile");
    } finally {
      setLoading(false);
    }
  };

  const fetchPendingBreaks = async () => {
    if (!token) return;
    try {
      const res = await fetch(`${API}/breaks/pending`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setPendingBreaks(data.data || []);
      }
    } catch (err) {
      console.error("Error fetching pending breaks:", err);
    }
  };

  const handleBreakAction = async (id, action) => {
    try {
      const res = await fetch(`${API}/breaks/action/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ status: action === "approve" ? "approved" : "rejected" })
      });
      const data = await res.json();
      if (data.success) {
        fetchPendingBreaks();
        fetchProfile();
      } else {
        alert(data.message || "Failed to update break status");
      }
    } catch (err) {
      console.error("Error handling break request:", err);
      alert("Error handling break request");
    }
  };

  useEffect(() => {
    if (!token) {
      navigate("/owner/login");
      return;
    }
    fetchProfile();
    fetchPendingBreaks();

    const interval = setInterval(() => {
      fetchPendingBreaks();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const statusMeta = useMemo(() => {
    if (salon?.status === "approved") return { label: "Approved & Live", dot: "bg-emerald-500", panel: "bg-emerald-50/60 border-emerald-200 text-emerald-800" };
    if (salon?.status === "rejected") return { label: "Rejected", dot: "bg-rose-500", panel: "bg-rose-50/60 border-rose-200 text-rose-800" };
    return { label: "Pending Verification", dot: "bg-amber-500", panel: "bg-amber-50/60 border-amber-200 text-amber-800" };
  }, [salon?.status]);

  const approved = salon?.status === "approved";

  if (loading) {
    return (
      <div style={{ background: "#FAF6F0" }} className="min-h-screen flex items-center justify-center font-sans">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center animate-pulse">
            <Scissors className="w-6 h-6 text-amber-600" />
          </div>
          <p className="text-stone-600 text-sm font-normal leading-relaxed font-sans">Loading Owner Console...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10 font-sans text-stone-800 min-h-screen text-left animate-fade-in" style={{ background: "#FAF6F0" }}>
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

      <div className="max-w-5xl mx-auto">
        
        {/* Main Dashboard Header */}
        <header className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5 border-b pb-6 border-stone-200">
          <div>
            <h2 className="font-serif text-3xl sm:text-4xl tracking-normal text-stone-900 flex items-center justify-start gap-2 flex-wrap sm:whitespace-nowrap">
              <span className="font-bold uppercase">Dashboard</span>
              <span className="italic text-[#C5A059] normal-case font-medium">Overview</span>
            </h2>
            <p className="text-stone-400 text-[11px] font-mono mt-1 font-sans">
              {salon?.salon_name || "The Royal Cuts"} · {new Date().toLocaleTimeString("en-IN", { hour: '2-digit', minute: '2-digit' })} pm
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={fetchProfile}
              disabled={loading}
              className="flex items-center justify-center p-2.5 rounded-xl bg-white border border-[#EADBCE] hover:bg-stone-50 cursor-pointer transition shadow-2xs"
              title="Refresh Dashboard"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            </button>

            {/* Toggle Button for Break Requests */}
            <div className="relative">
              <button 
                type="button"
                onClick={() => setShowBreaks(!showBreaks)}
                className="flex items-center justify-center p-2.5 rounded-xl bg-white border border-[#EADBCE] hover:bg-stone-50 cursor-pointer transition shadow-2xs relative"
                title="Break Requests"
              >
                <Coffee className="w-3.5 h-3.5 text-[#3E362E]" />
                {pendingBreaks.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                )}
              </button>

              {showBreaks && (
                <>
                  <div className="fixed inset-0 z-30" onClick={() => setShowBreaks(false)} />
                  <div className="fixed top-24 left-4 right-4 sm:absolute sm:top-auto sm:left-auto sm:right-0 sm:mt-2.5 sm:w-80 bg-white border border-[#EADBCE] rounded-2xl p-4 shadow-xl z-40 text-left text-sm text-[#3E362E] animate-in fade-in slide-in-from-top-1 duration-200">
                    <div className="border-b border-[#EADBCE]/50 pb-2 mb-2 flex justify-between items-center">
                      <span className="font-serif font-black text-[#8B5A2B] uppercase tracking-wider text-xs">Break Requests</span>
                      <span className="text-[9px] font-bold bg-[#8B5A2B]/10 text-[#8B5A2B] px-2 py-0.5 rounded-full">{pendingBreaks.length} Pending</span>
                    </div>
                    
                    {pendingBreaks.length === 0 ? (
                      <p className="text-xs text-stone-400 font-medium py-4 text-center">No pending break requests.</p>
                    ) : (
                      <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                        {pendingBreaks.map((req) => (
                          <div key={req._id} className="border-b border-stone-100 pb-3 last:border-0 last:pb-0">
                            <div className="flex justify-between items-start gap-1">
                              <div>
                                <p className="text-xs font-black text-[#8B5A2B]">{req.barber_id?.name || "A Barber"}</p>
                                <p className="text-[10px] text-stone-500 mt-0.5">
                                  Type: <span className="capitalize">{req.break_type}</span> ({req.duration_mins || 15}m)
                                </p>
                                {req.reason && <p className="text-[10px] italic text-stone-400 mt-1">"{req.reason}"</p>}
                              </div>
                              <div className="flex flex-col gap-1.5 shrink-0">
                                <button 
                                  onClick={() => { handleBreakAction(req._id, "approve"); setShowBreaks(false); }}
                                  className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-[8px] uppercase tracking-wider rounded-md transition cursor-pointer border-none"
                                >
                                  Approve
                                </button>
                                <button 
                                  onClick={() => { handleBreakAction(req._id, "reject"); setShowBreaks(false); }}
                                  className="px-2.5 py-1 bg-white border border-red-200 hover:border-red-400 text-red-600 font-extrabold text-[8px] uppercase tracking-wider rounded-md transition cursor-pointer"
                                >
                                  Reject
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>

            <div className="flex items-center gap-2 bg-white px-3.5 py-2 rounded-xl border border-[#EADBCE] shadow-2xs">
              <span className={`h-2 w-2 rounded-full ${statusMeta.dot}`} />
              <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#C5A059] font-sans">{statusMeta.label}</span>
            </div>
          </div>
        </header>

        {/* ── HIGHLIGHT METRIC COUNTERS ── */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="card p-5 flex items-center gap-4 bg-white shadow-2xs">
            <div className="w-11 h-11 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center shrink-0">
              <TrendingUp className="text-orange-600 w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] font-extrabold uppercase tracking-widest text-[#C5A059] mb-0.5 font-sans">Total Revenue (per day)</p>
              <h3 className="text-xl font-black text-stone-900 font-serif">₹{salon?.basic_pricing ? salon.basic_pricing * 14 : "8,450"}</h3>
            </div>
          </div>
          <div className="card p-5 flex items-center gap-4 bg-white shadow-2xs">
            <div className="w-11 h-11 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center shrink-0">
              <Users className="text-amber-600 w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] font-extrabold uppercase tracking-widest text-[#C5A059] mb-0.5 font-sans">Live Queue</p>
              <h3 className="text-xl font-black text-stone-900 font-serif">4 <span className="text-xs text-stone-400 font-sans font-medium">Waiting</span></h3>
            </div>
          </div>
          <div className="card p-5 flex items-center gap-4 bg-white shadow-2xs">
            <div className="w-11 h-11 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0">
              <Activity className="text-emerald-600 w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] font-extrabold uppercase tracking-widest text-[#C5A059] mb-0.5 font-sans">Active Staff</p>
              <h3 className="text-xl font-black text-stone-900 font-serif">{typeof salon?.number_of_barbers === 'number' ? salon.number_of_barbers : "0"} / {salon?.max_barbers_limit || "3"}</h3>
            </div>
          </div>
          <div className="card p-5 flex items-center gap-4 bg-white shadow-2xs">
            <div className="w-11 h-11 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center shrink-0">
              <Clock className="text-purple-600 w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] font-extrabold uppercase tracking-widest text-[#C5A059] mb-0.5 font-sans">Avg Wait Time (per day)</p>
              <h3 className="text-xl font-black text-stone-900 font-serif">18 min</h3>
            </div>
          </div>
        </section>

        {error && <p className="mb-6 rounded-xl bg-red-50 border border-red-200 p-4 text-center text-xs font-bold text-red-600 font-sans">{error}</p>}

        {/* ── CORE GRID WORKSPACE PLATFORMS ── */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          
          {/* Left Side Info Panel Stack */}
          <section className="space-y-6 lg:col-span-5">
            <div className="card p-6">
              <h2 className="font-serif text-xl sm:text-2xl tracking-normal text-stone-900 flex items-center justify-start gap-2 flex-wrap sm:whitespace-nowrap mb-4">
                <span className="font-bold uppercase">Registered</span>
                <span className="italic text-[#C5A059] normal-case font-medium">Salon Info</span>
              </h2>
              <div className="space-y-3.5">
                <Info label="Business Name" value={salon?.salon_name} />
                <Info label="Primary Owner" value={salon?.owner_name} />
                <Info label="Operational Hours" value={`${salon?.opening_time || "09:00"} — ${salon?.closing_time || "21:00"}`} />
                <Info label="Physical Destination Address" value={salon?.address} />
              </div>
            </div>

            <div className="card p-6">
              <h2 className="font-serif text-xl sm:text-2xl tracking-normal text-stone-900 flex items-center justify-start gap-2 flex-wrap sm:whitespace-nowrap mb-4">
                <span className="font-bold uppercase">Media</span>
                <span className="italic text-[#C5A059] normal-case font-medium">Gallery Vault</span>
              </h2>
              <div className="grid grid-cols-3 gap-2.5">
                {(salon?.images || []).map((url, index) => (
                  <img key={index} src={url} alt={`Preview ${index + 1}`} className="aspect-square rounded-xl object-cover border border-stone-100" />
                ))}
                {(!salon?.images || salon.images.length === 0) && (
                  <div className="col-span-3 py-8 rounded-xl border border-dashed border-stone-200 text-center text-[11px] font-extrabold uppercase tracking-widest text-[#C5A059] font-sans">
                    No images uploaded yet
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Right Side Dashboard Graphs */}
          <section className="space-y-6 lg:col-span-7">
            
            {/* WEEKLY REVENUE GRAPHIC */}
            <div className="card p-6 flex flex-col justify-between" style={{ minHeight: "260px" }}>
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h2 className="font-serif text-xl sm:text-2xl tracking-normal text-stone-900 flex items-center justify-start gap-2 flex-wrap sm:whitespace-nowrap">
                    <span className="font-bold uppercase">Weekly</span>
                    <span className="italic text-[#C5A059] normal-case font-medium">Revenue</span>
                  </h2>
                  <p className="text-stone-600 text-sm font-normal leading-relaxed font-sans mt-0.5">Mon — Sun parameters pipeline</p>
                </div>
                <span className="text-[11px] font-extrabold uppercase tracking-widest text-amber-800 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200/50 font-sans font-semibold">This Week ₹52,300</span>
              </div>

              {/* Chart visual display tracking bar lines */}
              <div className="flex justify-between items-end h-32 pt-4 px-2">
                {[
                  { day: "Mon", val: "₹3,200", h: "35%" },
                  { day: "Tue", val: "₹4,100", h: "45%" },
                  { day: "Wed", val: "₹3,800", h: "40%" },
                  { day: "Thu", val: "₹5,200", h: "60%" },
                  { day: "Fri", val: "₹6,800", h: "75%" },
                  { day: "Sat", val: "₹9,100", h: "95%" },
                  { day: "Sun", val: "₹5,600", h: "65%" }
                ].map((item, i) => {
                  const isSelected = selectedDay === item.day;
                  return (
                    <div 
                      key={i} 
                      onClick={() => setSelectedDay(item.day)}
                      className="flex flex-col items-center justify-end h-full flex-1 group cursor-pointer"
                      title={`Click to view ${item.day} transactions`}
                    >
                      <span className="text-[9px] font-mono font-bold text-[#8B5A2B] opacity-0 group-hover:opacity-100 transition-opacity mb-1">{item.val}</span>
                      <div 
                        className="w-full max-w-[32px] rounded-t-md transition-all duration-300 group-hover:scale-y-105 origin-bottom group-hover:brightness-95" 
                        style={{ 
                          height: item.h, 
                          backgroundColor: isSelected ? "#8B5A2B" : (item.day === "Sun" ? GOLD : "#EADBCE"),
                          border: isSelected ? "1.5px solid #3E362E" : "none"
                        }} 
                      />
                      <span className={`text-[10px] font-extrabold uppercase tracking-wider font-sans mt-2 ${isSelected ? "text-[#8B5A2B] font-black" : "text-stone-400"}`}>{item.day}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Onboarding Checklist Status Matrix */}
            <div className="card p-6">
              <h2 className="font-serif text-xl sm:text-2xl tracking-normal text-stone-900 flex items-center justify-start gap-2 flex-wrap sm:whitespace-nowrap mb-5">
                <span className="font-bold uppercase">Activation</span>
                <span className="italic text-[#C5A059] normal-case font-medium">Metrics Check</span>
              </h2>
              <div className="space-y-2.5">
                <ChecklistItem done={!!salon?.salon_name} label="Salon identity and metadata records submitted" />
                <ChecklistItem done={!!salon?.latitude && !!salon?.longitude} label="Geographical GPS coordinates tagged" />
                <ChecklistItem done={(salon?.services_offered || []).length > 0} label="Operational catalog services declared" />
                <ChecklistItem done={approved} label="Central admin dashboard authorization verified" />
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* ── 🌟 DAILY TRANSACTION LEDGER MODAL ── */}
      {selectedDay && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FDFBF7] border border-[#EADBCE] rounded-3xl p-6 max-w-sm w-full shadow-2xl relative animate-in fade-in zoom-in-95 duration-200 text-left font-sans">
            <h3 className="font-serif text-xl font-bold text-stone-900 border-b pb-3 mb-4 flex justify-between items-center">
              <span>{selectedDay} Ledger Breakdown</span>
              <button 
                onClick={() => setSelectedDay(null)}
                className="text-stone-400 hover:text-stone-900 font-sans font-bold text-sm cursor-pointer border border-stone-200 rounded-lg px-2 py-0.5 hover:bg-stone-50 transition"
              >
                Close
              </button>
            </h3>
            
            {(() => {
              const ledger = MOCK_DAY_LEDGERS[selectedDay] || { revenue: 0, count: 0, haircut: 0, shave: 0, facial: 0, topBarber: "N/A" };
              return (
                <div className="space-y-4 text-xs font-semibold text-stone-600">
                  <div className="flex justify-between items-center border-b pb-2 border-stone-100">
                    <span className="text-stone-400 uppercase tracking-widest text-[9px]">Total Revenue</span>
                    <span className="text-base font-black text-[#8B5A2B] font-mono">₹{ledger.revenue.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center border-b pb-2 border-stone-100">
                    <span className="text-stone-400 uppercase tracking-widest text-[9px]">Customers Served</span>
                    <span className="text-sm font-bold text-stone-900 font-mono">{ledger.count} Guests</span>
                  </div>
                  <div className="space-y-2 pt-1">
                    <p className="text-[10px] font-bold text-[#C5A059] uppercase tracking-wider mb-2">Services Completed</p>
                    <div className="flex justify-between items-center pl-2">
                      <span>Haircut & Styling</span>
                      <span className="font-mono font-bold text-stone-900">{ledger.haircut}</span>
                    </div>
                    <div className="flex justify-between items-center pl-2">
                      <span>Beard Grooming / Shave</span>
                      <span className="font-mono font-bold text-stone-900">{ledger.shave}</span>
                    </div>
                    <div className="flex justify-between items-center pl-2">
                      <span>Facial Scrub / Spa</span>
                      <span className="font-mono font-bold text-stone-900">{ledger.facial}</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center pt-3 border-t border-stone-100">
                    <span className="text-stone-400 uppercase tracking-widest text-[9px]">Top Artist Stylist</span>
                    <span className="text-xs font-black bg-amber-50 text-[#8B5A2B] border border-amber-200/50 px-2 py-0.5 rounded-md">{ledger.topBarber}</span>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}


    </div>
  );
}

const MOCK_DAY_LEDGERS = {
  Mon: { revenue: 3200, count: 8, haircut: 5, shave: 2, facial: 1, topBarber: "Ali" },
  Tue: { revenue: 4100, count: 11, haircut: 7, shave: 3, facial: 1, topBarber: "Ravi" },
  Wed: { revenue: 3800, count: 9, haircut: 6, shave: 2, facial: 1, topBarber: "Ali" },
  Thu: { revenue: 5200, count: 14, haircut: 9, shave: 3, facial: 2, topBarber: "James" },
  Fri: { revenue: 6800, count: 18, haircut: 11, shave: 4, facial: 3, topBarber: "Ravi" },
  Sat: { revenue: 9100, count: 24, haircut: 15, shave: 6, facial: 3, topBarber: "Ali" },
  Sun: { revenue: 5600, count: 15, haircut: 10, shave: 3, facial: 2, topBarber: "James" },
};

function Info({ label, value }) {
  return (
    <div className="border-b last:border-0 pb-2.5 last:pb-0 text-left border-stone-50">
      <label className="text-[11px] font-extrabold uppercase tracking-widest text-[#C5A059] block font-sans">{label}</label>
      <p className="font-bold text-stone-900 mt-0.5 text-sm font-sans">{value || "Value entry missing"}</p>
    </div>
  );
}

function ChecklistItem({ done, label }) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-stone-100 bg-stone-50/40 p-3 text-xs text-left">
      <span className="font-normal text-stone-600 leading-relaxed font-sans">{label}</span>
      <span className={`rounded px-2 py-0.5 text-[9px] font-black uppercase tracking-wider border font-sans ${done ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-amber-50 text-amber-600 border-amber-200/60"}`}>
        {done ? "Completed" : "Awaiting Action"}
      </span>
    </div>
  );
}