import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Scissors, BarChart2, CreditCard, DollarSign, LayoutDashboard,
  LogOut, Plus, Trash2, ArrowLeft, Clock, Tags 
} from "lucide-react";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const GOLD = "#C5A059";
const CHARCOAL = "#3E362E";

export default function ManageServices() {
  const navigate = useNavigate();
  const [salon, setSalon] = useState(null);
  const [services, setServices] = useState([]);
  const [newService, setNewService] = useState({ name: "", price: "", duration: "30", category: "men", description: "", image: "" });
  const [isAdding, setIsAdding] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const token = localStorage.getItem("token");

  const fallbacks = {
    men: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=150&q=80",
    women: "https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&w=150&q=80",
    addon: "https://images.unsplash.com/photo-1620331311520-246422fd82f9?auto=format&fit=crop&w=150&q=80"
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const profile = await fetch(`${API}/auth/owner/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      }).then(r => r.json());
      if (!profile.success) throw new Error(profile.message || "Unable to load salon profile");
      setSalon(profile.salon);
      if (profile.salon?.status === "approved") {
        const serviceData = await fetch(`${API}/services/${profile.salon._id}`).then(r => r.json());
        if (serviceData.success) setServices(serviceData.services || []);
      }
    } catch (err) {
      setError(err.message || "Unable to load services");
    } finally {
      setLoading(false);
    }
  };

  const handleAddService = async (event) => {
    event.preventDefault();
    setError("");
    const finalImage = newService.image || fallbacks[newService.category];
    try {
      const res = await fetch(`${API}/services`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          ...newService,
          image: finalImage,
          salon_id: salon._id,
          price: Number(newService.price),
          duration: Number(newService.duration) || 30,
        }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message || "Unable to add service");
      setServices(prev => [...prev, data.service]);
      setNewService({ name: "", price: "", duration: "30", category: "men", description: "", image: "" });
      setIsAdding(false);
    } catch (err) {
      setError(err.message || "Unable to add service");
    }
  };

  const deleteService = async (id) => {
    try {
      const res = await fetch(`${API}/services/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message || "Unable to delete service");
      setServices(prev => prev.filter(service => service._id !== id));
    } catch (err) {
      setError(err.message || "Unable to delete service");
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/owner/login");
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) {
    return (
      <div style={{ background: "#FAF6F0" }} className="min-h-screen flex items-center justify-center font-sans">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center animate-pulse">
            <Scissors className="w-6 h-6 text-amber-600" />
          </div>
          {/* Rule 3 Body Style Text */}
          <p className="text-stone-600 text-sm font-normal leading-relaxed font-sans">Loading Operational Catalog...</p>
        </div>
      </div>
    );
  }

  if (salon?.status !== "approved") {
    return (
      <div className="min-h-screen p-6 font-sans text-zinc-800 flex items-center justify-center" style={{ background: "#FAF6F0" }}>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap');
          .font-serif { font-family: 'Playfair Display', serif !important; }
          .card { background: #FFFFFF; border: 1px solid #EADBCE; border-radius: 24px; box-shadow: 0 4px 20px -2px rgba(28, 25, 23, 0.03); }
        `}</style>
        <div className="mx-auto max-w-xl text-center card p-10">
          <span className="text-5xl block mb-4">⌛</span>
          {/* Rule 1 Fallback Title */}
          <h2 className="font-serif text-2xl sm:text-3xl tracking-normal text-stone-900 flex items-center justify-center gap-2 whitespace-nowrap">
            <span className="font-bold uppercase">Approval</span>
            <span className="italic text-[#C5A059] normal-case font-medium">Required</span>
          </h2>
          {/* Rule 3 Body Description text */}
          <p className="text-stone-600 text-sm font-normal leading-relaxed font-sans mt-3">
            Barber management, queue controls and service pricing unlock after admin approval.
          </p>
          {/* Rule 4 Action Trigger */}
          <button onClick={() => navigate("/owner/dashboard")} className="mt-8 rounded-xl text-white font-extrabold text-xs tracking-wider uppercase px-6 py-4 hover:opacity-95 transition shadow-md cursor-pointer font-sans" style={{ background: CHARCOAL }}>
            Back to Status
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10 font-sans text-stone-800 min-h-screen" style={{ background: "#FAF6F0" }}>
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

      {/* ── MAIN CONTENT DATA WORKSPACE ── */}
      <div className="max-w-4xl mx-auto">
          
          {/* Rule 4 Action Breadcrumb Link */}
          <button 
            onClick={() => navigate("/owner/dashboard")} 
            className="mb-6 flex items-center gap-2 text-xs font-extrabold tracking-wider uppercase text-stone-400 hover:text-stone-600 transition-colors group cursor-pointer font-sans"
          >
            <ArrowLeft size={14} className="transform group-hover:-translate-x-0.5 transition-transform text-[#C5A059]" /> 
            Back to Console
          </button>

          {/* Manage Services Main Dashboard Heading Component */}
          <header className="mb-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5 border-b pb-6 border-stone-200 text-left">
            <div>
              {/* Rule 1 Master Header Composition standard */}
              <h2 className="font-serif text-3xl sm:text-4xl tracking-normal text-stone-900 flex items-center justify-start gap-2 whitespace-nowrap">
                <span className="font-bold uppercase">Manage</span>
                <span className="italic text-[#C5A059] normal-case font-medium">Services</span>
              </h2>
              {/* Rule 2 Workspace title kicker label metadata standard */}
              <p className="text-[11px] font-extrabold uppercase tracking-widest text-[#C5A059] mt-2 font-sans">
                Current Workspace: {salon?.salon_name}
              </p>
            </div>
            
            {!isAdding && (
              /* Rule 4 Action trigger button link components mapping standard strings */
              <button 
                onClick={() => setIsAdding(true)} 
                className="flex items-center gap-2 px-6 py-3.5 rounded-xl font-extrabold text-xs tracking-wider text-white uppercase shadow-md transition-all active:scale-95 hover:opacity-90 cursor-pointer font-sans"
                style={{ background: CHARCOAL }}
              >
                <Plus size={14} style={{ color: GOLD }} />
                Add New Service
              </button>
            )}
          </header>

          {error && <p className="mb-6 rounded-xl bg-red-50 border border-red-200 p-4 text-center text-xs font-bold text-red-600 font-sans">{error}</p>}

          {/* Inline Addition layout block workflow details module */}
          {isAdding && (
            <div className="mb-8 card p-6 shadow-lg text-left">
              {/* Rule 1 Nested module subtitle layout rules standard */}
              <h2 className="font-serif text-xl sm:text-2xl tracking-normal text-stone-900 flex items-center justify-start gap-2 whitespace-nowrap mb-5">
                <span className="font-bold uppercase">New Service</span>
                <span className="italic text-[#C5A059] normal-case font-medium">Specification</span>
              </h2>
              <form onSubmit={handleAddService} className="grid gap-4 md:grid-cols-5 font-sans">
                <div className="md:col-span-2">
                  {/* Rule 2 Input Field descriptors metadata tags labels */}
                  <label className="text-[11px] font-extrabold uppercase tracking-widest text-[#C5A059] mb-1.5 block font-sans">Service Name</label>
                  <input required placeholder="e.g., Luxury Beard Trim" value={newService.name} onChange={e => setNewService(prev => ({ ...prev, name: e.target.value }))} className="w-full rounded-xl border border-stone-200 bg-white p-3.5 text-sm font-medium outline-none focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059]/20 transition-all text-stone-800 placeholder-stone-400 font-sans" />
                </div>
                <div>
                  <label className="text-[11px] font-extrabold uppercase tracking-widest text-[#C5A059] mb-1.5 block font-sans">Ticket Rate (₹)</label>
                  <input required type="number" min="1" placeholder="Price" value={newService.price} onChange={e => setNewService(prev => ({ ...prev, price: e.target.value }))} className="w-full rounded-xl border border-stone-200 bg-white p-3.5 text-sm font-medium outline-none focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059]/20 transition-all text-stone-800 placeholder-stone-400 font-sans" />
                </div>
                <div>
                  <label className="text-[11px] font-extrabold uppercase tracking-widest text-[#C5A059] mb-1.5 block font-sans">Session Minutes</label>
                  <input type="number" min="5" placeholder="Duration" value={newService.duration} onChange={e => setNewService(prev => ({ ...prev, duration: e.target.value }))} className="w-full rounded-xl border border-stone-200 bg-white p-3.5 text-sm font-medium outline-none focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059]/20 transition-all text-stone-800 placeholder-stone-400 font-sans" />
                </div>
                <div>
                  <label className="text-[11px] font-extrabold uppercase tracking-widest text-[#C5A059] mb-1.5 block font-sans">Category Slot</label>
                  <select value={newService.category} onChange={e => setNewService(prev => ({ ...prev, category: e.target.value }))} className="w-full rounded-xl border border-stone-200 bg-white p-3.5 text-sm font-medium outline-none focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059]/20 transition-all text-stone-700 cursor-pointer font-sans">
                    <option value="men">Men</option>
                    <option value="women">Women</option>
                    <option value="addon">Addon</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="text-[11px] font-extrabold uppercase tracking-widest text-[#C5A059] mb-1.5 block font-sans">Service Image URL</label>
                  <input placeholder="e.g., https://example.com/image.jpg" value={newService.image} onChange={e => setNewService(prev => ({ ...prev, image: e.target.value }))} className="w-full rounded-xl border border-stone-200 bg-white p-3.5 text-sm font-medium outline-none focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059]/20 transition-all text-stone-800 placeholder-stone-400 font-sans" />
                </div>
                <div className="md:col-span-3">
                  <label className="text-[11px] font-extrabold uppercase tracking-widest text-[#C5A059] mb-1.5 block font-sans">Service Description</label>
                  <input placeholder="e.g., Premium style and custom grooming detailing..." value={newService.description} onChange={e => setNewService(prev => ({ ...prev, description: e.target.value }))} className="w-full rounded-xl border border-stone-200 bg-white p-3.5 text-sm font-medium outline-none focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059]/20 transition-all text-stone-800 placeholder-stone-400 font-sans" />
                </div>
                <div className="flex gap-3 md:col-span-5 pt-2 border-t border-stone-100 mt-2 font-sans">
                  {/* Rule 4 Inside form data trigger action submission keys */}
                  <button type="submit" className="rounded-xl px-5 py-3 text-xs font-extrabold tracking-wider uppercase text-white shadow-md hover:opacity-95 transition-all cursor-pointer font-sans" style={{ background: CHARCOAL }}>
                    Save Catalog Item
                  </button>
                  <button type="button" onClick={() => setIsAdding(false)} className="rounded-xl bg-stone-100 border border-stone-200 text-stone-500 hover:bg-stone-200 font-extrabold text-xs uppercase tracking-wider px-5 py-3 transition-all cursor-pointer font-sans">
                    Dismiss
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Active Services List Mapping Grid items container */}
          <div className="space-y-4 text-left">
            {services.map(service => (
              <div key={service._id} className="card p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4 shadow-sm bg-white">
                <div className="flex items-start gap-4 flex-1">
                  <img 
                    src={service.image || fallbacks[service.category] || fallbacks.men} 
                    alt={service.name} 
                    className="w-16 h-16 rounded-xl object-cover border border-stone-100 shrink-0" 
                  />
                  <div className="text-left">
                    <h3 className="text-md font-black font-serif text-stone-900 tracking-tight">{service.name}</h3>
                    {service.description && (
                      <p className="text-stone-500 text-xs mt-1 max-w-md font-sans font-medium line-clamp-2">
                        {service.description}
                      </p>
                    )}
                    <div className="flex items-center gap-3 mt-2 font-sans">
                      {/* Rule 2 Category Metadata badge labels styling config tags */}
                      <span className="px-2 py-0.5 text-[11px] font-extrabold uppercase tracking-widest text-[#C5A059] bg-stone-100 border border-stone-200/60 rounded">{service.category}</span>
                      {/* Rule 3 Core layout description sub-labels features details indicators */}
                      <span className="flex items-center gap-1 text-stone-600 text-sm font-normal leading-relaxed"><Clock size={12} style={{ color: GOLD }} /> {service.duration || 30} Mins</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between md:justify-end gap-6 w-full md:w-auto pt-3 md:pt-0 border-t md:border-0 border-stone-100 font-sans shrink-0">
                  <div className="text-left md:text-right">
                    <p className="text-2xl font-black font-mono text-stone-900">₹{service.price}</p>
                    {/* Rule 2 Fee metadata tracker label kicker tag */}
                    <p className="text-[11px] font-extrabold uppercase tracking-widest text-[#C5A059] mt-0.5">Base Price</p>
                  </div>
                  {/* Rule 4 Core Action item Delete configuration system elements button link links */}
                  <button 
                    onClick={() => deleteService(service._id)} 
                    className="rounded-xl border border-red-200 bg-red-50/50 text-red-600 hover:bg-red-600 hover:text-white px-4 py-2.5 text-xs font-extrabold tracking-wider uppercase transition-all shadow-sm flex items-center gap-1 cursor-pointer"
                  >
                    <Trash2 size={12} /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

          {services.length === 0 && (
            /* Rule 2 Empty catalog container context identifier text info */
            <div className="bg-white border border-[#EADBCE] border-dashed rounded-3xl p-12 text-center text-[11px] font-extrabold uppercase tracking-widest text-[#C5A059] font-sans">
              No services added to your catalog yet.
            </div>
          )}
        </div>
      </div>
    );
  }