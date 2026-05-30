import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Scissors, BarChart2, CreditCard, DollarSign, UserCheck, 
  MapPin, Clock, ShieldAlert, Edit, LogOut, LayoutDashboard,
  TrendingUp, Users, Activity, Sparkles, Image as ImageIcon 
} from "lucide-react";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const GOLD = "#C5A059";
const CHARCOAL = "#3E362E";

export default function OwnerDashboard() {
  const navigate = useNavigate();
  const [salon, setSalon] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/owner/login");
      return;
    }
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API}/auth/owner/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message || "Unable to load profile");
      syncSalon(data.salon);
    } catch (err) {
      setError(err.message || "Unable to load profile");
    } finally {
      setLoading(false);
    }
  };

  const syncSalon = (nextSalon) => {
    setSalon(nextSalon);
    setForm({
      salon_name: nextSalon?.salon_name || "",
      owner_name: nextSalon?.owner_name || "",
      email: nextSalon?.email || "",
      address: nextSalon?.address || "",
      latitude: nextSalon?.latitude || 0,
      longitude: nextSalon?.longitude || 0,
      opening_time: nextSalon?.opening_time || "09:00",
      closing_time: nextSalon?.closing_time || "21:00",
      services_offered: (nextSalon?.services_offered || []).join(", "),
      basic_pricing: nextSalon?.basic_pricing || "",
      number_of_barbers: nextSalon?.number_of_barbers || "",
      support_number: nextSalon?.support_number || "",
      images: nextSalon?.images || [],
      about: nextSalon?.about || "",
    });
  };

  const setField = (name, value) => {
    setForm(prev => ({ ...prev, [name]: value }));
    setMessage("");
    setError("");
  };

  const statusMeta = useMemo(() => {
    if (salon?.status === "approved") return { label: "Approved & Live", dot: "bg-emerald-500", panel: "bg-emerald-50/60 border-emerald-200 text-emerald-800" };
    if (salon?.status === "rejected") return { label: "Rejected", dot: "bg-rose-500", panel: "bg-rose-50/60 border-rose-200 text-rose-800" };
    return { label: "Pending Verification", dot: "bg-amber-500", panel: "bg-amber-50/60 border-amber-200 text-amber-800" };
  }, [salon?.status]);

  const approved = salon?.status === "approved";

  const payload = () => ({
    ...form,
    services_offered: form.services_offered.split(",").map(s => s.trim()).filter(Boolean),
    basic_pricing: Number(form.basic_pricing) || 0,
    number_of_barbers: Number(form.number_of_barbers) || 0,
  });

  const saveProfile = async (resubmit = false) => {
    setBusy(true);
    setError("");
    setMessage("");
    try {
      const res = await fetch(`${API}/auth/owner/${resubmit ? "resubmit" : "profile"}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload()),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message || "Update failed");
      syncSalon(data.salon);
      setEditing(false);
      setMessage(resubmit ? "Profile resubmitted for approval." : "Profile updated.");
    } catch (err) {
      setError(err.message || "Update failed");
    } finally {
      setBusy(false);
    }
  };

  const tagLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by this browser.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      position => {
        setField("latitude", position.coords.latitude);
        setField("longitude", position.coords.longitude);
        setMessage("Location updated.");
      },
      () => setError("Location permission denied.")
    );
  };

  const addImages = async (event) => {
    const files = Array.from(event.target.files || []).slice(0, 5);
    const encoded = await Promise.all(
      files.map(file => new Promise(resolve => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.readAsDataURL(file);
      }))
    );
    setField("images", [...form.images, ...encoded].slice(0, 5));
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/owner/login");
  };

  if (loading) {
    return (
      <div style={{ background: "#FAF6F0" }} className="min-h-screen flex items-center justify-center font-sans">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center animate-pulse">
            <Scissors className="w-6 h-6 text-amber-600" />
          </div>
          {/* Rule 3 Body Description style fallback */}
          <p className="text-stone-600 text-sm font-normal leading-relaxed font-sans">Loading Owner Console...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex font-sans text-stone-800" style={{ background: "#FAF6F0" }}>
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

      {/* ── STICKY LIGHT NAVIGATION SIDEBAR ── */}
      <aside className="w-64 border-r fixed h-screen flex flex-col justify-between p-6 z-30 shrink-0 bg-white border-stone-200 font-sans">
        <div className="space-y-8">
          <div className="flex items-center gap-3 text-left border-b pb-5 border-stone-100">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-amber-50 border border-[#C5A059]/20">
              <Scissors size={18} color="#C5A059" strokeWidth={2} />
            </div>
            <div>
              <div className="text-sm font-black tracking-tight text-stone-900">Barber Pro</div>
              {/* Rule 2 Kicker Label Standard */}
              <div className="text-[11px] font-extrabold uppercase tracking-widest text-[#C5A059] mt-0.5">Owner Panel</div>
            </div>
          </div>

          <nav className="space-y-1">
            {/* Rule 4 Primary UI Action Link Standardized Buttons */}
            <button className="w-full flex items-center gap-3.5 px-4 py-3 text-xs font-extrabold tracking-wider uppercase rounded-xl bg-amber-50/60 text-[#C5A059] border border-amber-200/40 cursor-pointer">
              <LayoutDashboard size={18} color="#C5A059" />
              <span>Console Home</span>
            </button>
            <button onClick={() => navigate("/owner/manage-services")} className="w-full flex items-center gap-3.5 px-4 py-3 text-xs font-extrabold tracking-wider uppercase rounded-xl text-stone-500 hover:text-stone-900 hover:bg-stone-50 cursor-pointer">
              <Scissors size={18} className="text-stone-400" />
              <span>Barbers & Services</span>
            </button>
            <button onClick={() => navigate("/owner/dashboard/analytics")} className="w-full flex items-center gap-3.5 px-4 py-3 text-xs font-extrabold tracking-wider uppercase rounded-xl text-stone-500 hover:text-stone-900 hover:bg-stone-50 cursor-pointer">
              <BarChart2 size={18} className="text-stone-400" />
              <span>Analytics Metrics</span>
            </button>
            <button onClick={() => navigate("/owner/payments")} className="w-full flex items-center gap-3.5 px-4 py-3 text-xs font-extrabold tracking-wider uppercase rounded-xl text-stone-500 hover:text-stone-900 hover:bg-stone-50 cursor-pointer">
              <CreditCard size={18} className="text-stone-400" />
              <span>Payment Gateway</span>
            </button>
            <button onClick={() => navigate("/owner/revenue")} className="w-full flex items-center gap-3.5 px-4 py-3 text-xs font-extrabold tracking-wider uppercase rounded-xl text-stone-500 hover:text-stone-900 hover:bg-stone-50 cursor-pointer">
              <DollarSign size={18} className="text-stone-400" />
              <span>Revenue Stream</span>
            </button>
          </nav>
        </div>

        {/* Rule 4 Standardized Exit Button */}
        <button onClick={handleLogout} className="w-full flex items-center gap-3.5 px-4 py-3 text-xs font-extrabold tracking-wider uppercase rounded-xl text-red-500 hover:bg-red-50 transition-all border border-transparent cursor-pointer">
          <LogOut size={18} className="text-red-400" />
          <span>Exit Workspace</span>
        </button>
      </aside>

      {/* ── MAIN SCREEN DATA WORKSPACE ── */}
      <main className="flex-1 ml-64 p-8 md:p-12 min-w-0">
        <div className="max-w-5xl mx-auto">
          
          {/* Main Dashboard Header */}
          <header className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5 border-b pb-6 border-stone-200 text-left">
            <div>
              {/* Rule 1 Master Single-Line Header Title Layout Standard */}
              <h2 className="font-serif text-3xl sm:text-4xl tracking-normal text-stone-900 flex items-center justify-start gap-2 whitespace-nowrap">
                <span className="font-bold uppercase">Dashboard</span>
                <span className="italic text-[#C5A059] normal-case font-medium">Overview</span>
              </h2>
              <p className="text-stone-400 text-[11px] font-mono mt-1">
                {salon?.salon_name || "The Royal Cuts"} · {new Date().toLocaleTimeString("en-IN", { hour: '2-digit', minute: '2-digit' })} pm
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-white px-3.5 py-2 rounded-xl border border-[#EADBCE] shadow-2xs">
                <span className={`h-2 w-2 rounded-full ${statusMeta.dot}`} />
                {/* Rule 2 Kicker Subtitle Metadata Tag */}
                <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#C5A059] font-sans">{statusMeta.label}</span>
              </div>
              {/* Rule 4 System Trigger Button */}
              <button 
                onClick={() => setEditing(prev => !prev)} 
                className="flex items-center gap-2 px-5 py-3.5 rounded-xl font-extrabold text-xs tracking-wider text-white uppercase shadow-sm transition-all active:scale-95 cursor-pointer font-sans"
                style={{ background: CHARCOAL }}
              >
                <Edit size={14} color="#C5A059" />
                {editing ? "Close System Editor" : "Modify Salon Profile"}
              </button>
            </div>
          </header>

          {/* ── HIGHLIGHT METRIC COUNTERS ── */}
          {!editing && (
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 text-left">
              <div className="card p-5 flex items-center gap-4 bg-white shadow-2xs">
                <div className="w-11 h-11 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center shrink-0">
                  <TrendingUp className="text-orange-600 w-5 h-5" />
                </div>
                <div>
                  {/* Rule 2 Card Counter Label standard */}
                  <p className="text-[11px] font-extrabold uppercase tracking-widest text-[#C5A059] mb-0.5 font-sans">Today's Revenue</p>
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
                  <h3 className="text-xl font-black text-stone-900 font-serif">{salon?.number_of_barbers || "3"} / 4</h3>
                </div>
              </div>
              <div className="card p-5 flex items-center gap-4 bg-white shadow-2xs">
                <div className="w-11 h-11 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center shrink-0">
                  <Clock className="text-purple-600 w-5 h-5" />
                </div>
                <div>
                  <p className="text-[11px] font-extrabold uppercase tracking-widest text-[#C5A059] mb-0.5 font-sans">Avg Wait Time</p>
                  <h3 className="text-xl font-black text-stone-900 font-serif">18 min</h3>
                </div>
              </div>
            </section>
          )}

          {error && <p className="mb-6 rounded-xl bg-red-50 border border-red-200 p-4 text-center text-xs font-bold text-red-600 font-sans">{error}</p>}
          {message && <p className="mb-6 rounded-xl bg-green-50 border border-green-200 p-4 text-center text-xs font-bold text-green-700 font-sans">{message}</p>}

          {/* ── CORE GRID WORKSPACE PLATFORMS ── */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 text-left">
            
            {editing ? (
              <section className="lg:col-span-12">
                <ProfileEditor form={form} setField={setField} addImages={addImages} tagLocation={tagLocation} saveProfile={saveProfile} busy={busy} canResubmit={salon?.status === "rejected"} />
              </section>
            ) : (
              <>
                {/* Left Side Info Panel Stack */}
                <section className="space-y-6 lg:col-span-5">
                  <div className="card p-6">
                    {/* Rule 1 Secondary Module Title Alignment */}
                    <h2 className="font-serif text-xl sm:text-2xl tracking-normal text-stone-900 flex items-center justify-start gap-2 whitespace-nowrap mb-4">
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
                    <h2 className="font-serif text-xl sm:text-2xl tracking-normal text-stone-900 flex items-center justify-start gap-2 whitespace-nowrap mb-4">
                      <span className="font-bold uppercase">Media</span>
                      <span className="italic text-[#C5A059] normal-case font-medium">Gallery Vault</span>
                    </h2>
                    <div className="grid grid-cols-3 gap-2.5">
                      {(form.images || []).map((url, index) => (
                        <img key={index} src={url} alt={`Preview ${index + 1}`} className="aspect-square rounded-xl object-cover border border-stone-100" />
                      ))}
                      {(!form.images || form.images.length === 0) && (
                        /* Rule 2 Empty State Text Styling */
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
                        {/* Rule 1 Header Segment variation matching internal layout elements */}
                        <h2 className="font-serif text-xl sm:text-2xl tracking-normal text-stone-900 flex items-center justify-start gap-2 whitespace-nowrap">
                          <span className="font-bold uppercase">Weekly</span>
                          <span className="italic text-[#C5A059] normal-case font-medium">Revenue</span>
                        </h2>
                        {/* Rule 3 Body text label metrics subtext setup */}
                        <p className="text-stone-600 text-sm font-normal leading-relaxed font-sans mt-0.5">Mon — Sun parameters pipeline</p>
                      </div>
                      <span className="text-[11px] font-extrabold uppercase tracking-widest text-amber-800 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200/50 font-sans">This Week ₹52,300</span>
                    </div>

                    {/* Chart visual display tracking bar lines */}
                    <div className="flex justify-between items-end h-32 pt-4 px-2">
                      {[
                        { day: "Mon", val: "₹3.2k", h: "35%" },
                        { day: "Tue", val: "₹4.1k", h: "45%" },
                        { day: "Wed", val: "₹3.8k", h: "40%" },
                        { day: "Thu", val: "₹5.2k", h: "60%" },
                        { day: "Fri", val: "₹6.8k", h: "75%" },
                        { day: "Sat", val: "₹9.1k", h: "95%" },
                        { day: "Sun", val: "₹5.6k", h: "65%", active: true }
                      ].map((item, i) => (
                        <div key={i} className="flex flex-col items-center gap-2 flex-1 group">
                          <span className="text-[9px] font-mono font-bold text-stone-400 opacity-0 group-hover:opacity-100 transition-opacity">{item.val}</span>
                          <div className="w-full max-w-[32px] rounded-t-md transition-all duration-300" style={{ height: item.h, backgroundColor: item.active ? GOLD : "#FAF1E6" }} />
                          <span className="text-[11px] font-extrabold uppercase tracking-widest text-stone-400 font-sans mt-1">{item.day}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Onboarding Checklist Status Matrix */}
                  <div className="card p-6">
                    <h2 className="font-serif text-xl sm:text-2xl tracking-normal text-stone-900 flex items-center justify-start gap-2 whitespace-nowrap mb-5">
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
              </>
            )}
          </div>

        </div>
      </main>
    </div>
  );
}

const emptyForm = { salon_name: "", owner_name: "", email: "", address: "", latitude: 0, longitude: 0, opening_time: "09:00", closing_time: "21:00", services_offered: "", basic_pricing: "", number_of_barbers: "", support_number: "", images: [], about: "" };

function Info({ label, value }) {
  return (
    <div className="border-b last:border-0 pb-2.5 last:pb-0 text-left border-stone-50">
      {/* Rule 2 Core Label Meta */}
      <label className="text-[11px] font-extrabold uppercase tracking-widest text-[#C5A059] block font-sans">{label}</label>
      <p className="font-bold text-stone-900 mt-0.5 text-sm font-sans">{value || "Value entry missing"}</p>
    </div>
  );
}

function ChecklistItem({ done, label }) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-stone-100 bg-stone-50/40 p-3 text-xs text-left">
      {/* Rule 3 Inline description tag block */}
      <span className="font-normal text-stone-600 leading-relaxed font-sans">{label}</span>
      <span className={`rounded px-2 py-0.5 text-[9px] font-black uppercase tracking-wider border font-sans ${done ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-amber-50 text-amber-600 border-amber-200/60"}`}>
        {done ? "Completed" : "Awaiting Action"}
      </span>
    </div>
  );
}

function ProfileEditor({ form, setField, addImages, tagLocation, saveProfile, busy, canResubmit }) {
  const inputClass = "w-full rounded-xl border border-stone-200 bg-white p-3 text-sm font-medium outline-none focus:border-[#C5A059] transition-all text-stone-800 placeholder-stone-400 font-sans";
  return (
    <div className="card p-6 shadow-md bg-white text-left">
      {/* Rule 1 Layout block inside edit portal system section layout details */}
      <h2 className="font-serif text-xl sm:text-2xl tracking-normal text-stone-900 flex items-center justify-start gap-2 whitespace-nowrap mb-5 border-b pb-3 border-stone-100">
        <span className="font-bold uppercase">Edit Workspace</span>
        <span className="italic text-[#C5A059] normal-case font-medium">Profile</span>
      </h2>
      <div className="grid gap-4 md:grid-cols-2">
        <input className={inputClass} value={form.salon_name} onChange={e => setField("salon_name", e.target.value)} placeholder="Salon Name" />
        <input className={inputClass} value={form.owner_name} onChange={e => setField("owner_name", e.target.value)} placeholder="Owner Full Name" />
        <input className={inputClass} value={form.email} onChange={e => setField("email", e.target.value)} placeholder="Business Email" />
        <input className={inputClass} value={form.support_number} onChange={e => setField("support_number", e.target.value.replace(/\D/g, "").slice(0, 10))} placeholder="10-digit Help Desk line" />
        <input type="time" className={inputClass} value={form.opening_time} onChange={e => setField("opening_time", e.target.value)} />
        <input type="time" className={inputClass} value={form.closing_time} onChange={e => setField("closing_time", e.target.value)} />
        <input className={inputClass} value={form.services_offered} onChange={e => setField("services_offered", e.target.value)} placeholder="Services, comma separated" />
        <input type="number" className={inputClass} value={form.basic_pricing} onChange={e => setField("basic_pricing", e.target.value)} placeholder="Base Rate (₹)" />
      </div>
      <textarea className={`${inputClass} mt-4 min-h-16 resize-none`} value={form.address} onChange={e => setField("address", e.target.value)} placeholder="Physical Destination Address" />
      
      <div className="mt-5 flex flex-wrap gap-3 pt-4 border-t border-stone-50">
        {/* Rule 4 Standardized internal layout buttons links controls */}
        <button type="button" onClick={tagLocation} className="rounded-xl border border-[#C5A059] text-[#C5A059] px-5 py-3 text-xs font-extrabold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer font-sans"><MapPin size={14} /> Tag GPS Geolocation</button>
        <button type="button" onClick={() => saveProfile(false)} disabled={busy} className="rounded-xl bg-stone-900 text-white px-6 py-3 text-xs font-extrabold uppercase tracking-wider hover:bg-stone-800 disabled:opacity-40 shadow-sm cursor-pointer font-sans">Save Staged Changes</button>
        {canResubmit && <button type="button" onClick={() => saveProfile(true)} disabled={busy} className="rounded-xl px-6 py-3 text-xs font-extrabold uppercase tracking-wider text-white shadow-sm cursor-pointer font-sans" style={{ background: GOLD }}>Resubmit Request</button>}
      </div>
    </div>
  );
}