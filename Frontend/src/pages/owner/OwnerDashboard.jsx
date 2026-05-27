import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Scissors, BarChart2, CreditCard, DollarSign, UserCheck, 
  MapPin, Clock, ShieldAlert, Edit, LogOut, LayoutDashboard,
  Image as ImageIcon // 👈 Add the 'as ImageIcon' alias right here
} from "lucide-react";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const emptyForm = {
  salon_name: "",
  owner_name: "",
  email: "",
  address: "",
  latitude: 0,
  longitude: 0,
  opening_time: "09:00",
  closing_time: "21:00",
  services_offered: "",
  basic_pricing: "",
  number_of_barbers: "",
  support_number: "",
  images: [],
  about: "",
};

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
    if (salon?.status === "approved") return { label: "Approved", dot: "bg-green-500", panel: "bg-green-50 border-green-200 text-green-800" };
    if (salon?.status === "rejected") return { label: "Rejected", dot: "bg-red-500", panel: "bg-red-50 border-red-200 text-red-800" };
    return { label: "Pending Approval", dot: "bg-amber-500", panel: "bg-amber-50/50 border-amber-200 text-amber-800" };
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
          <p className="text-stone-600 text-sm font-semibold tracking-wide">Loading Owner Console...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex font-sans text-stone-800" style={{ background: "#FAF6F0" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap');
        body, .font-sans {
          font-family: 'Plus Jakarta Sans', sans-serif !important;
        }
        .font-serif {
          font-family: 'Playfair Display', serif !important;
        }
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
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #EADBCE;
          border-radius: 10px;
        }
      `}</style>
{/* ── MATCHING SIDEBAR NAVIGATION ── */}
      <aside className="w-64 border-r fixed h-screen flex flex-col justify-between p-6 z-30 shrink-0 bg-white border-stone-200">
        <div className="space-y-8">
          {/* Logo Centerpiece */}
          <div className="flex items-center gap-3 border-b pb-5 border-stone-100">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-amber-50 border border-[#C5A059]/20">
              <Scissors size={18} color="#C5A059" strokeWidth={2} />
            </div>
            <div>
              <div className="text-sm font-black tracking-tight text-stone-900">
                Barber Pro
              </div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-stone-400 mt-0.5">Owner Panel</div>
            </div>
          </div>

          {/* Navigation Links Framework */}
          <nav className="space-y-1">
            <button 
              onClick={() => navigate("/owner/dashboard")}
              className={`w-full flex items-center gap-3.5 px-4 py-3 text-xs font-bold tracking-wide rounded-xl transition-all ${
                window.location.pathname === "/owner/dashboard"
                  ? "bg-amber-50/60 text-[#C5A059] border border-amber-200/40 font-extrabold"
                  : "text-stone-500 hover:text-stone-900 hover:bg-stone-50"
              }`}
            >
              <LayoutDashboard size={18} className={window.location.pathname === "/owner/dashboard" ? "text-[#C5A059]" : "text-stone-400"} />
              <span>Console Home</span>
            </button>

            <button 
              onClick={() => navigate("/owner/manage-services")} 
              className={`w-full flex items-center gap-3.5 px-4 py-3 text-xs font-bold tracking-wide rounded-xl transition-all ${
                window.location.pathname === "/owner/manage-services"
                  ? "bg-amber-50/60 text-[#C5A059] border border-amber-200/40 font-extrabold"
                  : "text-stone-500 hover:text-stone-900 hover:bg-stone-50"
              }`}
            >
              <Scissors size={18} className={window.location.pathname === "/owner/manage-services" ? "text-[#C5A059]" : "text-stone-400"} />
              <span>Barbers & Services</span>
            </button>

            <button 
              onClick={() => navigate("/owner/dashboard/analytics")} 
              className={`w-full flex items-center gap-3.5 px-4 py-3 text-xs font-bold tracking-wide rounded-xl transition-all ${
                window.location.pathname === "/owner/dashboard/analytics"
                  ? "bg-amber-50/60 text-[#C5A059] border border-amber-200/40 font-extrabold"
                  : "text-stone-500 hover:text-stone-900 hover:bg-stone-50"
              }`}
            >
              <BarChart2 size={18} className={window.location.pathname === "/owner/dashboard/analytics" ? "text-[#C5A059]" : "text-stone-400"} />
              <span>Analytics Metrics</span>
            </button>

            <button 
              onClick={() => navigate("/owner/payments")} 
              className={`w-full flex items-center gap-3.5 px-4 py-3 text-xs font-bold tracking-wide rounded-xl transition-all ${
                window.location.pathname === "/owner/payments"
                  ? "bg-amber-50/60 text-[#C5A059] border border-amber-200/40 font-extrabold"
                  : "text-stone-500 hover:text-stone-900 hover:bg-stone-50"
              }`}
            >
              <CreditCard size={18} className={window.location.pathname === "/owner/payments" ? "text-[#C5A059]" : "text-stone-400"} />
              <span>Payment Gateway</span>
            </button>

            <button 
              onClick={() => navigate("/owner/revenue")} 
              className={`w-full flex items-center gap-3.5 px-4 py-3 text-xs font-bold tracking-wide rounded-xl transition-all ${
                window.location.pathname === "/owner/revenue"
                  ? "bg-amber-50/60 text-[#C5A059] border border-amber-200/40 font-extrabold"
                  : "text-stone-500 hover:text-stone-900 hover:bg-stone-50"
              }`}
            >
              <DollarSign size={18} className={window.location.pathname === "/owner/revenue" ? "text-[#C5A059]" : "text-stone-400"} />
              <span>Revenue Stream</span>
            </button>
          </nav>
        </div>

        {/* System Exit Button */}
        <button 
          onClick={handleLogout} 
          className="w-full flex items-center gap-3.5 px-4 py-3 text-xs font-bold tracking-wide rounded-xl text-red-500 hover:bg-red-50 transition-all border border-transparent"
        >
          <LogOut size={18} className="text-red-400" />
          <span>Exit Workspace</span>
        </button>
      </aside>

      {/* ── MAIN SCREEN DATA WORKSPACE ── */}
      <main className="flex-1 ml-64 p-8 md:p-12 min-w-0">
        <div className="max-w-5xl mx-auto">
          
          {/* Main Dashboard Header */}
          <header className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5 border-b pb-6 border-stone-200">
            <div>
              <h1 className="text-4xl font-black font-serif text-stone-900 tracking-tight">
                Owner <span style={{ color: "#C5A059" }}>Console</span>
              </h1>
              <div className="mt-2.5 flex items-center gap-2 bg-white px-3 py-1 rounded-lg border border-[#EADBCE] w-fit shadow-sm">
                <span className={`h-2 w-2 rounded-full ${statusMeta.dot}`} />
                <p className="text-[10px] font-bold tracking-wider uppercase text-stone-500">
                  Salon Verification Status: {statusMeta.label}
                </p>
              </div>
            </div>
            
            <button 
              onClick={() => setEditing(prev => !prev)} 
              className="flex items-center gap-2 self-start sm:self-center px-6 py-3.5 rounded-xl font-black text-[10px] tracking-widest text-white uppercase shadow-md transition-all active:scale-95 hover:opacity-90"
              style={{ background: "#3E362E" }}
            >
              <Edit size={14} color="#C5A059" />
              {editing ? "Close System Editor" : "Modify Salon Profile"}
            </button>
          </header>

          {/* Alert Status Panel Notification banner */}
          <div className={`mb-8 rounded-2xl border-l-4 p-5 shadow-sm flex items-start gap-3 ${statusMeta.panel}`}>
            <ShieldAlert size={18} className="mt-0.5 shrink-0" />
            <p className="text-sm font-semibold leading-relaxed">
              {approved
                ? "Your salon is completely live! Customers can now locate, discover, and instantly reserve slots for your services."
                : salon?.status === "rejected"
                  ? "Your profile submission has been rejected by admin. Review the rejection reasoning below, modify your fields, and re-submit."
                  : "Your salon profile is currently undergoing verification tracking checks. Customer marketplace discovery and appointments unlock post-approval."}
            </p>
          </div>

          {salon?.status === "rejected" && salon?.rejection_reason && (
            <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-xl text-sm font-medium text-red-800">
              🚨 Rejection Reason Filed: <strong>{salon.rejection_reason}</strong>
            </div>
          )}

          {error && <p className="mb-6 rounded-xl bg-red-50 border border-red-200 p-4 text-center text-xs font-bold text-red-600">{error}</p>}
          {message && <p className="mb-6 rounded-xl bg-green-50 border border-green-200 p-4 text-center text-xs font-bold text-green-700">{message}</p>}

          {/* Grid Split Content Framework */}
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
            
            {/* Left Content Side */}
            <section className="space-y-6 lg:col-span-5">
              <div className="card p-7">
                <h2 className="mb-5 text-lg font-black font-serif text-stone-900 tracking-tight flex items-center gap-2">
                  <Scissors size={16} style={{ color: "#C5A059" }} /> Registered Salon Info
                </h2>
                <div className="space-y-4 pt-1">
                  <Info label="Business Name" value={salon?.salon_name} />
                  <Info label="Primary Owner" value={salon?.owner_name} />
                  <Info label="Operational Hours" value={`${salon?.opening_time || "09:00"} — ${salon?.closing_time || "21:00"}`} />
                  <Info label="Physical Location Address" value={salon?.address} />
                  <Info label="Support Help Desk" value={salon?.support_number || salon?.mobile} />
                </div>
              </div>

              
<div className="card p-7">
  <h2 className="mb-4 text-lg font-black font-serif text-stone-900 tracking-tight flex items-center gap-2">
    <ImageIcon size={16} style={{ color: "#C5A059" }} /> Production Gallery
  </h2>
  {/* Rest of gallery code stays exactly the same... */}
                <div className="grid grid-cols-3 gap-3 pt-2">
                  {(form.images || []).map((url, index) => (
                    <img key={index} src={url} alt={`Salon Preview ${index + 1}`} className="aspect-square rounded-xl border border-stone-200 object-cover shadow-sm transition-transform hover:scale-105 duration-200" />
                  ))}
                  {(!form.images || form.images.length === 0) && (
                    <div className="col-span-3 rounded-xl border-2 border-dashed border-[#EADBCE] p-6 text-center text-[10px] font-black uppercase tracking-widest text-stone-400">
                      No media files uploaded yet.
                    </div>
                  )}
                </div>
              </div>
            </section>

            {/* Right Action Side Editor/Checklist */}
            <section className="lg:col-span-7">
              {editing ? (
                <ProfileEditor
                  form={form}
                  setField={setField}
                  addImages={addImages}
                  tagLocation={tagLocation}
                  saveProfile={saveProfile}
                  busy={busy}
                  canResubmit={salon?.status === "rejected"}
                />
              ) : (
                <div className="card p-7">
                  <h2 className="mb-6 text-xl font-black font-serif text-stone-900 tracking-tight">Activation Onboarding Checklist</h2>
                  <div className="space-y-3">
                    <ChecklistItem done={!!salon?.salon_name} label="Salon identity and metadata records submitted" />
                    <ChecklistItem done={!!salon?.latitude && !!salon?.longitude} label="Geographical GPS coordinates tagged" />
                    <ChecklistItem done={(salon?.services_offered || []).length > 0} label="Operational catalog services declared" />
                    <ChecklistItem done={!!salon?.basic_pricing} label="Standard baseline tier pricing structured" />
                    <ChecklistItem done={(salon?.images || []).length > 0} label="Interior shop production media uploaded" />
                    <ChecklistItem done={approved} label="Central admin dashboard authorization verified" />
                  </div>
                  
                  <div className="mt-8 rounded-2xl border border-dashed border-[#EADBCE] bg-[#FDFBF7] p-5 flex items-start gap-3">
                    <Clock size={16} style={{ color: "#C5A059" }} className="mt-0.5 shrink-0" />
                    <p className="text-[11px] font-bold uppercase tracking-wider text-stone-500 leading-relaxed">
                      Post-activation configuration unlocks full capability streams including active barber load controls, real-time timeline assignments, automated customer reminders, and finance streams.
                    </p>
                  </div>
                </div>
              )}
            </section>

          </div>
        </div>
      </main>
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div className="border-b last:border-0 pb-3 last:pb-0 border-stone-100">
      <label className="text-[10px] font-black uppercase tracking-wider block" style={{ color: "#C5A059" }}>{label}</label>
      <p className="font-bold text-stone-900 mt-1 text-sm">{value || "Value entry missing"}</p>
    </div>
  );
}

function ChecklistItem({ done, label }) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-stone-200/60 bg-stone-50/50 p-4 hover:bg-white hover:border-amber-600/40 transition-all duration-200">
      <span className="text-xs font-bold text-stone-600 tracking-wide">{label}</span>
      <span className={`rounded-lg px-2.5 py-1 text-[9px] font-black uppercase tracking-wider border shrink-0 ${done ? "bg-green-50 text-green-700 border-green-200" : "bg-amber-50 text-amber-700 border-amber-200"}`}>
        {done ? "Completed" : "Awaiting Actions"}
      </span>
    </div>
  );
}

function ProfileEditor({ form, setField, addImages, tagLocation, saveProfile, busy, canResubmit }) {
  const inputClass = "w-full rounded-xl border border-stone-200 bg-white p-3.5 text-sm font-semibold outline-none focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059]/20 transition-all text-stone-800 placeholder-stone-400";
  return (
    <div className="card p-7 shadow-lg">
      <h2 className="mb-6 text-xl font-black font-serif text-stone-900 tracking-tight">Edit Salon Profile</h2>
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="text-[9px] font-black uppercase tracking-wider text-stone-400 mb-1.5 block">Salon Name</label>
          <input className={inputClass} value={form.salon_name} onChange={e => setField("salon_name", e.target.value)} placeholder="e.g., Luxury Trim Barbershop" />
        </div>
        <div>
          <label className="text-[9px] font-black uppercase tracking-wider text-stone-400 mb-1.5 block">Owner Full Name</label>
          <input className={inputClass} value={form.owner_name} onChange={e => setField("owner_name", e.target.value)} placeholder="e.g., Jane Smith" />
        </div>
        <div>
          <label className="text-[9px] font-black uppercase tracking-wider text-stone-400 mb-1.5 block">Business Email</label>
          <input className={inputClass} value={form.email} onChange={e => setField("email", e.target.value)} placeholder="e.g., shop@barberpro.com" />
        </div>
        <div>
          <label className="text-[9px] font-black uppercase tracking-wider text-stone-400 mb-1.5 block">Support Help Line</label>
          <input className={inputClass} value={form.support_number} onChange={e => setField("support_number", e.target.value.replace(/\D/g, "").slice(0, 10))} placeholder="10-digit mobile line" />
        </div>
        <div>
          <label className="text-[9px] font-black uppercase tracking-wider text-stone-400 mb-1.5 block">Opening Shift</label>
          <input type="time" className={inputClass} value={form.opening_time} onChange={e => setField("opening_time", e.target.value)} />
        </div>
        <div>
          <label className="text-[9px] font-black uppercase tracking-wider text-stone-400 mb-1.5 block">Closing Shift</label>
          <input type="time" className={inputClass} value={form.closing_time} onChange={e => setField("closing_time", e.target.value)} />
        </div>
        <div>
          <label className="text-[9px] font-black uppercase tracking-wider text-stone-400 mb-1.5 block">Services Offered</label>
          <input className={inputClass} value={form.services_offered} onChange={e => setField("services_offered", e.target.value)} placeholder="Haircut, Shave, Spa Treatment" />
        </div>
        <div>
          <label className="text-[9px] font-black uppercase tracking-wider text-stone-400 mb-1.5 block">Base Ticket Pricing (₹)</label>
          <input type="number" className={inputClass} value={form.basic_pricing} onChange={e => setField("basic_pricing", e.target.value)} placeholder="Standard base rate" />
        </div>
        <div className="md:col-span-2">
          <label className="text-[9px] font-black uppercase tracking-wider text-stone-400 mb-1.5 block">Staff Capacity (Barbers)</label>
          <input type="number" className={inputClass} value={form.number_of_barbers} onChange={e => setField("number_of_barbers", e.target.value)} placeholder="Total onboarded styling specialists" />
        </div>
        <div className="md:col-span-2">
          <label className="text-[9px] font-black uppercase tracking-wider text-stone-400 mb-1.5 block">Media Vault Upload (Max 5 Files)</label>
          <input type="file" accept="image/*" multiple className={`${inputClass} file:bg-[#C5A059]/10 file:text-[#C5A059] file:border-0 file:rounded-md file:px-2.5 file:py-0.5 file:text-[10px] file:font-black file:uppercase file:mr-3 cursor-pointer`} onChange={addImages} />
        </div>
      </div>
      <div className="mt-4">
        <label className="text-[9px] font-black uppercase tracking-wider text-stone-400 mb-1.5 block">Physical Destination Address</label>
        <textarea className={`${inputClass} min-h-20 resize-none`} value={form.address} onChange={e => setField("address", e.target.value)} placeholder="Complete business map address details..." />
      </div>
      <div className="mt-4">
        <label className="text-[9px] font-black uppercase tracking-wider text-stone-400 mb-1.5 block">About the Business</label>
        <textarea className={`${inputClass} min-h-20 resize-none`} value={form.about} onChange={e => setField("about", e.target.value)} placeholder="Describe your salon history, vision, and special achievements..." />
      </div>

      <div className="mt-6 pt-4 border-t border-stone-100 flex flex-wrap gap-3">
        <button 
          type="button"
          onClick={tagLocation} 
          className="rounded-xl border px-5 py-3.5 text-xs font-black tracking-widest uppercase transition shadow-sm bg-white hover:bg-stone-50 active:scale-95 flex items-center gap-2"
          style={{ color: "#C5A059", borderColor: "#C5A059" }}
        >
          <MapPin size={14} /> Tag GPS Geolocation
        </button>
        <button 
          type="button"
          onClick={() => saveProfile(false)} 
          disabled={busy} 
          className="rounded-xl bg-stone-900 px-6 py-3.5 text-xs font-black tracking-widest uppercase text-white hover:bg-stone-800 transition disabled:opacity-50 shadow-md active:scale-95"
        >
          Save Staged Profile
        </button>
        {canResubmit && (
          <button 
            type="button"
            onClick={() => saveProfile(true)} 
            disabled={busy} 
            className="rounded-xl px-6 py-3.5 text-xs font-black tracking-widest uppercase text-white hover:opacity-90 transition disabled:opacity-50 shadow-md active:scale-95"
            style={{ background: "#C5A059" }}
          >
            Resubmit Approval Request
          </button>
        )}
      </div>
    </div>
  );
}