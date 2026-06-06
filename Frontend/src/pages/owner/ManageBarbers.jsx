import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { 
  Users, Scissors, Plus, Trash2, Clock, 
  TrendingUp, Award, Phone, ShieldCheck, Sparkles, X
} from "lucide-react";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const CHARCOAL = "#3E362E";
const GOLD = "#C5A059";

export default function ManageBarbers() {
  const { salon, token } = useOutletContext();
  const [barbers, setBarbers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [form, setForm] = useState({
    name: "",
    mobile: "",
    password: "",
    specialization: "Hair Stylist & Grooming Expert",
    experience: "3",
    aadhaar: "",
    image: ""
  });
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (salon?._id) {
      fetchBarbers();
    }
  }, [salon?._id]);

  const fetchBarbers = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API}/barber/salon/${salon._id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message || "Failed to load barbers");
      setBarbers(data.barbers || []);
    } catch (err) {
      setError(err.message || "Error fetching barbers");
    } finally {
      setLoading(false);
    }
  };

  const handleAddBarber = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    setMessage("");
    try {
      const res = await fetch(`${API}/barber`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          salon_id: salon._id,
          name: form.name.trim(),
          mobile: form.mobile.replace(/\D/g, "").slice(0, 10),
          password: form.password,
          specialization: form.specialization.trim(),
          experience: Number(form.experience) || 0,
          aadhaar: form.aadhaar.trim(),
          image: form.image.trim()
        })
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message || "Registration failed");
      
      setBarbers(prev => [...prev, data.barber]);
      setMessage("Barber registered successfully!");
      setForm({
        name: "",
        mobile: "",
        password: "",
        specialization: "Hair Stylist & Grooming Expert",
        experience: "3",
        aadhaar: "",
        image: ""
      });
      setIsAdding(false);
    } catch (err) {
      setError(err.message || "Failed to register barber");
    } finally {
      setBusy(false);
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    const nextStatus = currentStatus === "available" ? "break" : "available";
    try {
      const res = await fetch(`${API}/barber/${id}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status: nextStatus })
      });
      const data = await res.json();
      if (data.success) {
        setBarbers(prev => prev.map(b => b._id === id ? { ...b, status: nextStatus } : b));
      } else {
        throw new Error(data.message || "Status toggle failed");
      }
    } catch (err) {
      setError(err.message || "Could not update status");
    }
  };

  const handleDeleteBarber = async (id) => {
    if (!window.confirm("Are you sure you want to deactivate this barber? They will not be able to log in.")) return;
    try {
      const res = await fetch(`${API}/barber/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setBarbers(prev => prev.filter(b => b._id !== id));
        setMessage("Barber account deactivated.");
      } else {
        throw new Error(data.message || "Deactivation failed");
      }
    } catch (err) {
      setError(err.message || "Could not remove barber");
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case "available":
        return { label: "Present & Available", bg: "bg-emerald-50 text-emerald-700 border-emerald-200" };
      case "busy":
        return { label: "Busy (In Service)", bg: "bg-orange-50 text-orange-700 border-orange-200" };
      case "break":
        return { label: "On Break", bg: "bg-amber-50 text-amber-700 border-amber-200" };
      default:
        return { label: "Offline / Absent", bg: "bg-stone-50 text-stone-500 border-stone-200" };
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 font-sans">
        <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center animate-pulse mb-3">
          <Users className="w-5 h-5 text-[#C5A059]" />
        </div>
        <p className="text-stone-500 text-xs uppercase font-extrabold tracking-widest animate-pulse">Syncing Barber Team...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto text-left font-sans">
      <header className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5 border-b pb-6 border-stone-200">
        <div>
          <p className="text-[#C5A059] font-sans font-bold tracking-[2px] text-xs uppercase mb-1">
            Personnel Directory
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl tracking-normal text-stone-900 flex items-center justify-start gap-2 whitespace-nowrap">
            <span className="font-bold uppercase">Barber</span>
            <span className="italic text-[#C5A059] normal-case font-medium">Management</span>
          </h2>
          <p className="text-stone-600 text-sm mt-2 font-sans">Monitor active stylist shifts, update work states, and expand your service crew.</p>
        </div>

        {!isAdding && (
          <button 
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-2 px-6 py-3.5 rounded-xl font-extrabold text-xs tracking-wider text-white uppercase shadow-md hover:opacity-95 active:scale-95 transition-all cursor-pointer font-sans"
            style={{ background: CHARCOAL }}
          >
            <Plus size={14} style={{ color: GOLD }} />
            Add New Barber
          </button>
        )}
      </header>

      {error && <p className="mb-6 rounded-xl bg-red-50 border border-red-200 p-4 text-center text-xs font-bold text-red-600 font-sans">{error}</p>}
      {message && <p className="mb-6 rounded-xl bg-green-50 border border-green-200 p-4 text-center text-xs font-bold text-green-700 font-sans">{message}</p>}

      {/* ── BARBER REGISTRATION PORTAL ── */}
      {isAdding && (
        <div className="mb-8 card p-6 shadow-lg bg-white relative animate-fade-in">
          <button 
            onClick={() => setIsAdding(false)}
            className="absolute top-5 right-5 text-stone-400 hover:text-stone-600 p-1.5 rounded-lg hover:bg-stone-50 border-none bg-transparent cursor-pointer"
          >
            <X size={16} />
          </button>
          
          <h3 className="font-serif text-xl sm:text-2xl text-stone-900 mb-5 flex items-center gap-2">
            <span className="font-bold uppercase">New Stylist</span>
            <span className="italic text-[#C5A059] font-medium">Registration</span>
          </h3>

          <form onSubmit={handleAddBarber} className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-[11px] font-extrabold uppercase tracking-widest text-[#C5A059] mb-1.5 block">Stylist Full Name</label>
              <input 
                required 
                placeholder="e.g., Nitin Bhandari" 
                value={form.name} 
                onChange={e => setForm({ ...form, name: e.target.value })} 
                className="w-full rounded-xl border border-stone-200 bg-white p-3.5 text-sm font-medium outline-none focus:border-[#C5A059] transition-all text-stone-800 font-sans" 
              />
            </div>
            <div className="flex flex-col justify-end">
              <label className="text-[11px] font-extrabold uppercase tracking-widest text-[#C5A059] mb-1.5 block">Profile Image</label>
              <div className="flex gap-2">
                <input 
                  placeholder="Paste URL or choose file" 
                  value={form.image} 
                  onChange={e => setForm({ ...form, image: e.target.value })} 
                  className="flex-1 rounded-xl border border-stone-200 bg-white p-3.5 text-sm font-medium outline-none focus:border-[#C5A059] transition-all text-stone-800 font-sans" 
                />
                <label className="rounded-xl border border-dashed border-[#C5A059] hover:bg-amber-50/20 text-[#C5A059] px-4 py-3.5 text-xs font-extrabold uppercase tracking-wider flex items-center justify-center cursor-pointer shrink-0 transition-all font-sans select-none">
                  Upload PC
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = () => setForm(prev => ({ ...prev, image: reader.result }));
                        reader.readAsDataURL(file);
                      }
                    }} 
                    className="hidden" 
                  />
                </label>
              </div>
            </div>
            <div>
              <label className="text-[11px] font-extrabold uppercase tracking-widest text-[#C5A059] mb-1.5 block">Mobile Number (Login ID)</label>
              <input 
                required 
                type="tel"
                placeholder="10-digit mobile" 
                value={form.mobile} 
                onChange={e => setForm({ ...form, mobile: e.target.value.replace(/\D/g, "").slice(0,10) })} 
                className="w-full rounded-xl border border-stone-200 bg-white p-3.5 text-sm font-medium outline-none focus:border-[#C5A059] transition-all text-stone-800 font-sans" 
              />
            </div>
            <div>
              <label className="text-[11px] font-extrabold uppercase tracking-widest text-[#C5A059] mb-1.5 block">Aadhaar Number (12-digit)</label>
              <input 
                required 
                placeholder="e.g., 123456789012" 
                value={form.aadhaar} 
                onChange={e => setForm({ ...form, aadhaar: e.target.value.replace(/\D/g, "").slice(0,12) })} 
                className="w-full rounded-xl border border-stone-200 bg-white p-3.5 text-sm font-medium outline-none focus:border-[#C5A059] transition-all text-stone-800 font-sans" 
              />
            </div>
            <div>
              <label className="text-[11px] font-extrabold uppercase tracking-widest text-[#C5A059] mb-1.5 block">Access Password</label>
              <input 
                required 
                type="password"
                placeholder="Secure access pin" 
                value={form.password} 
                onChange={e => setForm({ ...form, password: e.target.value })} 
                className="w-full rounded-xl border border-stone-200 bg-white p-3.5 text-sm font-medium outline-none focus:border-[#C5A059] transition-all text-stone-800 font-sans" 
              />
            </div>
            <div>
              <label className="text-[11px] font-extrabold uppercase tracking-widest text-[#C5A059] mb-1.5 block">Years of Experience</label>
              <input 
                required 
                type="number"
                min="0"
                max="50"
                placeholder="Years on floor" 
                value={form.experience} 
                onChange={e => setForm({ ...form, experience: e.target.value })} 
                className="w-full rounded-xl border border-stone-200 bg-white p-3.5 text-sm font-medium outline-none focus:border-[#C5A059] transition-all text-stone-800 font-sans" 
              />
            </div>
            <div className="md:col-span-2">
              <label className="text-[11px] font-extrabold uppercase tracking-widest text-[#C5A059] mb-1.5 block">Specializations / Tagline</label>
              <input 
                required 
                placeholder="e.g., Hair Stylist, Beard Sculptor & Grooming Expert" 
                value={form.specialization} 
                onChange={e => setForm({ ...form, specialization: e.target.value })} 
                className="w-full rounded-xl border border-stone-200 bg-white p-3.5 text-sm font-medium outline-none focus:border-[#C5A059] transition-all text-stone-800 font-sans" 
              />
            </div>

            <div className="flex gap-3 md:col-span-2 pt-2 border-t border-stone-100 mt-3">
              <button 
                type="submit" 
                disabled={busy}
                className="rounded-xl px-6 py-3.5 text-xs font-extrabold tracking-wider uppercase text-white shadow-md hover:opacity-95 transition-all cursor-pointer font-sans disabled:opacity-40" 
                style={{ background: CHARCOAL }}
              >
                {busy ? "Saving Stylist..." : "Register Stylist"}
              </button>
              <button 
                type="button" 
                onClick={() => setIsAdding(false)} 
                className="rounded-xl bg-stone-100 border border-stone-200 text-stone-500 hover:bg-stone-200 font-extrabold text-xs uppercase tracking-wider px-6 py-3.5 transition-all cursor-pointer font-sans"
              >
                Dismiss
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ── BARBER CARDS GRID ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {barbers.map(barber => {
          const status = getStatusColor(barber.status);
          
          return (
            <div key={barber._id} className="card p-6 bg-white flex flex-col justify-between shadow-sm relative group overflow-hidden">
              {/* Subtle top decoration */}
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#C5A059]/20 group-hover:bg-[#C5A059] transition-colors" />

              <div>
                <div className="flex justify-between items-start gap-4 mb-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-14 h-14 rounded-2xl bg-stone-100 border border-stone-200/50 shrink-0 overflow-hidden relative">
                      {barber.image ? (
                        <img src={barber.image} alt={barber.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[#C5A059]">
                          <Scissors size={20} />
                        </div>
                      )}
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-serif text-lg font-black text-stone-900 leading-tight truncate">{barber.name}</h4>
                      <p className="text-[10px] text-[#C5A059] font-extrabold uppercase mt-1 tracking-wider truncate" title={barber.specialization}>{barber.specialization}</p>
                    </div>
                  </div>

                  <span className={`px-2.5 py-0.5 rounded-full border text-[9px] font-black uppercase tracking-wider shrink-0 ${status.bg}`}>
                    {status.label}
                  </span>
                </div>

                <div className="space-y-2 border-t border-stone-50 pt-4 pb-4 font-sans">
                  <div className="flex items-center gap-2 text-stone-600 text-xs">
                    <Phone size={13} className="text-stone-400" />
                    <span>{barber.mobile}</span>
                  </div>
                  <div className="flex items-center gap-2 text-stone-600 text-xs">
                    <Award size={13} className="text-stone-400" />
                    <span>{barber.experience} Years Experience</span>
                  </div>
                  {barber.aadhaar && (
                    <div className="flex items-center gap-2 text-stone-600 text-xs">
                      <ShieldCheck size={13} className="text-stone-400" />
                      <span>Aadhaar: <span className="font-mono text-stone-500">{barber.aadhaar.slice(0,4)}-{barber.aadhaar.slice(4,8)}-{barber.aadhaar.slice(8)}</span></span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-stone-600 text-xs">
                    <TrendingUp size={13} className="text-stone-400" />
                    <span>Rating: {barber.rating ? `${barber.rating} / 5` : "New (No reviews yet)"}</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-2.5 pt-4 border-t border-stone-100 mt-2">
                <button 
                  onClick={() => handleToggleStatus(barber._id, barber.status)}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl border text-[11px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                    barber.status === "available"
                      ? "bg-amber-50/50 border-amber-200 text-amber-700 hover:bg-amber-100"
                      : "bg-emerald-50/50 border-emerald-200 text-emerald-700 hover:bg-emerald-100"
                  }`}
                >
                  <Clock size={13} />
                  {barber.status === "available" ? "Go on Break" : "Set Available"}
                </button>
                
                <button 
                  onClick={() => handleDeleteBarber(barber._id)}
                  className="px-3.5 py-2.5 rounded-xl border border-red-200 bg-red-50/50 text-red-600 hover:bg-red-600 hover:text-white transition-all cursor-pointer shadow-2xs"
                  title="Deactivate Stylist"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {barbers.length === 0 && (
        <div className="card border border-[#EADBCE] border-dashed rounded-3xl p-16 text-center">
          <div className="w-16 h-16 rounded-full bg-amber-50 flex items-center justify-center mx-auto mb-4 border border-amber-100">
            <Users className="w-8 h-8 text-[#C5A059]" />
          </div>
          <h4 className="font-serif text-xl font-bold text-stone-900 mb-2">No Stylists Registered</h4>
          <p className="text-stone-500 text-xs uppercase font-extrabold tracking-widest mb-6">Your salon workspace is empty.</p>
          <button 
            onClick={() => setIsAdding(true)}
            className="px-6 py-3.5 rounded-xl font-extrabold text-xs tracking-wider text-white uppercase shadow-md transition-all active:scale-95 cursor-pointer"
            style={{ background: CHARCOAL }}
          >
            Add First Barber
          </button>
        </div>
      )}
    </div>
  );
}
