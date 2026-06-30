import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Scissors, BarChart2, CreditCard, DollarSign, LayoutDashboard,
  LogOut, Plus, Trash2, ArrowLeft, Clock, Tags, Edit2, X
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
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const token = localStorage.getItem("token");
  const [selectedService, setSelectedService] = useState(null);
  const [editForm, setEditForm] = useState({ name: "", price: "", duration: "30", category: "men", description: "", image: "" });

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

  const saveServiceChanges = async () => {
    if (!selectedService) return;
    setError("");
    try {
      const res = await fetch(`${API}/services/${selectedService._id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: editForm.name,
          price: Number(editForm.price),
          duration: Number(editForm.duration) || 30,
          category: editForm.category.toLowerCase(),
          description: editForm.description,
          image: editForm.image || fallbacks[editForm.category.toLowerCase()] || fallbacks.men
        })
      });
      const data = await res.json();
      if (data.success && data.service) {
        setServices(prev => prev.map(s => s._id === selectedService._id ? data.service : s));
        setSelectedService(null);
      } else {
        throw new Error(data.message || "Failed to update service changes");
      }
    } catch (err) {
      console.error("Failed to save service changes:", err);
      setError(err.message || "Error updating service");
    }
  };

  const handleEditImageUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setEditForm(prev => ({ ...prev, image: reader.result || "" }));
    };
    reader.readAsDataURL(file);
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
          <h2 className="font-serif text-2xl sm:text-3xl tracking-normal text-stone-900 flex items-center justify-center gap-2 flex-wrap sm:whitespace-nowrap">
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
              <h2 className="font-serif text-3xl sm:text-4xl tracking-normal text-stone-900 flex items-center justify-start gap-2 flex-wrap sm:whitespace-nowrap">
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
                className="flex items-center gap-2 px-6 py-3.5 rounded-xl font-extrabold text-xs tracking-wider text-white uppercase shadow-md transition-all active:scale-95 hover:opacity-90 cursor-pointer font-sans shrink-0"
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
              <h2 className="font-serif text-xl sm:text-2xl tracking-normal text-stone-900 flex items-center justify-start gap-2 flex-wrap sm:whitespace-nowrap mb-5">
                <span className="font-bold uppercase">New Service</span>
                <span className="italic text-[#C5A059] normal-case font-medium">Specification</span>
              </h2>
              <form onSubmit={handleAddService} className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 font-sans">
                <div className="col-span-1 sm:col-span-2 lg:col-span-2">
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
                <div className="relative">
                  <label className="text-[11px] font-extrabold uppercase tracking-widest text-[#C5A059] mb-1.5 block font-sans">Category Slot</label>
                  <button
                    type="button"
                    onClick={() => setCategoryDropdownOpen(!categoryDropdownOpen)}
                    className="w-full flex items-center justify-between rounded-xl border border-stone-200 bg-white p-3.5 text-sm font-medium outline-none hover:border-[#C5A059] focus:border-[#C5A059] transition-all text-stone-700 cursor-pointer font-sans"
                  >
                    <span className="capitalize">{newService.category}</span>
                    <svg
                      className={`w-4 h-4 text-stone-500 transition-transform duration-200 ${categoryDropdownOpen ? "rotate-180" : ""}`}
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                    </svg>
                  </button>
                  {categoryDropdownOpen && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setCategoryDropdownOpen(false)} />
                      <div className="absolute left-0 right-0 mt-1 z-20 rounded-xl border border-[#EADBCE] bg-white shadow-lg overflow-hidden animate-fade-in font-sans">
                        {[
                          { value: "men", label: "Men" },
                          { value: "women", label: "Women" },
                          { value: "addon", label: "Addon" }
                        ].map((opt) => (
                          <button
                            key={opt.value}
                            type="button"
                            onClick={() => {
                              setNewService(prev => ({ ...prev, category: opt.value }));
                              setCategoryDropdownOpen(false);
                            }}
                            className={`w-full text-left px-4 py-3 text-sm font-medium transition-colors cursor-pointer block ${
                              newService.category === opt.value
                                ? "bg-[#FEF9F0] text-[#C5A059] font-bold"
                                : "text-stone-700 hover:bg-stone-50 hover:text-stone-900"
                            }`}
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </div>
                <div className="col-span-1 sm:col-span-2 lg:col-span-2">
                  <label className="text-[11px] font-extrabold uppercase tracking-widest text-[#C5A059] mb-1.5 block font-sans">Service Image URL</label>
                  <div className="flex gap-2">
                    <input 
                      placeholder="e.g., https://example.com/image.jpg" 
                      value={newService.image} 
                      onChange={e => setNewService(prev => ({ ...prev, image: e.target.value }))} 
                      className="w-full rounded-xl border border-stone-200 bg-white p-3.5 text-sm font-medium outline-none focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059]/20 transition-all text-stone-800 placeholder-stone-400 font-sans" 
                    />
                    <div className="relative shrink-0">
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              setNewService(prev => ({ ...prev, image: reader.result }));
                            };
                            reader.readAsDataURL(file);
                          }
                        }} 
                        className="absolute inset-0 opacity-0 z-20 cursor-pointer w-full" 
                      />
                      <button 
                        type="button" 
                        className="rounded-xl border border-[#C5A059] text-[#C5A059] hover:bg-stone-50 font-extrabold text-xs uppercase tracking-wider px-4 py-3.5 transition-all cursor-pointer font-sans h-full flex items-center justify-center bg-white"
                      >
                        Upload
                      </button>
                    </div>
                  </div>
                  {newService.image && (
                    <div className="mt-1.5 flex items-center gap-2">
                      <img src={newService.image} className="w-8 h-8 rounded object-cover border border-stone-200 shadow-3xs" alt="Preview" />
                      <button 
                        type="button" 
                        onClick={() => setNewService(prev => ({ ...prev, image: "" }))} 
                        className="text-[10px] text-red-500 font-bold hover:underline cursor-pointer"
                      >
                        Remove Image
                      </button>
                    </div>
                  )}
                </div>
                <div className="col-span-1 sm:col-span-2 lg:col-span-3">
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="text-[11px] font-extrabold uppercase tracking-widest text-[#C5A059] block font-sans">Service Description</label>
                    <span className="text-[10px] text-stone-400 font-semibold">{newService.description.length}/500</span>
                  </div>
                  <textarea 
                    maxLength={500} 
                    placeholder="e.g., Premium style and custom grooming detailing..." 
                    value={newService.description} 
                    onChange={e => setNewService(prev => ({ ...prev, description: e.target.value }))} 
                    className="w-full rounded-xl border border-stone-200 bg-white p-3 text-sm font-medium outline-none focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059]/20 transition-all text-stone-800 placeholder-stone-400 font-sans resize-none min-h-[50px]" 
                    rows={1}
                  />
                </div>
                <div className="flex gap-3 col-span-1 sm:col-span-2 lg:col-span-5 pt-2 border-t border-stone-100 mt-2 font-sans">
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
                <div className="flex items-center justify-between md:justify-end gap-3 w-full md:w-auto pt-3 md:pt-0 border-t md:border-0 border-stone-100 font-sans shrink-0">
                  <div className="text-left md:text-right mr-3">
                    <p className="text-2xl font-black font-mono text-stone-900">₹{service.price}</p>
                    {/* Rule 2 Fee metadata tracker label kicker tag */}
                    <p className="text-[11px] font-extrabold uppercase tracking-widest text-[#C5A059] mt-0.5">Base Price</p>
                  </div>
                  
                  <button 
                    onClick={() => {
                      setSelectedService(service);
                      setEditForm({
                        name: service.name,
                        price: service.price,
                        duration: service.duration,
                        category: service.category,
                        description: service.description || "",
                        image: service.image || ""
                      });
                    }} 
                    className="rounded-xl border border-[#C5A059] bg-[#FAF6F0]/50 text-[#C5A059] hover:bg-[#C5A059] hover:text-white px-4 py-2.5 text-xs font-extrabold tracking-wider uppercase transition-all shadow-sm flex items-center gap-1 cursor-pointer"
                  >
                    <Edit2 size={12} /> Modify
                  </button>

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

        {selectedService && (
        <div className="fixed inset-0 bg-stone-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#FAF6F0] border border-[#EADBCE] p-6 rounded-[2rem] w-full max-w-md max-h-[90vh] overflow-y-auto shadow-2xl animate-in fade-in duration-250">
            <div className="flex justify-between items-center pb-4 border-b border-[#EADBCE]/50 mb-4">
              <h2 className="text-xl font-serif font-black text-stone-900 uppercase">
                Modify Service
              </h2>
              <button onClick={() => setSelectedService(null)} className="w-8 h-8 rounded-xl flex items-center justify-center border border-stone-200 bg-white text-stone-400 hover:text-stone-800 transition-all cursor-pointer">
                <X size={14} />
              </button>
            </div>

            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-wider text-stone-400">Service Name</label>
                <input
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="w-full bg-white border border-[#EADBCE] rounded-xl p-3 text-sm font-bold text-stone-800 outline-none focus:border-[#C5A059]"
                  placeholder="Service Name"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-wider text-stone-400">Price (₹)</label>
                <input
                  type="number"
                  value={editForm.price}
                  onChange={(e) => setEditForm({ ...editForm, price: e.target.value })}
                  className="w-full bg-white border border-[#EADBCE] rounded-xl p-3 text-sm font-bold text-stone-800 outline-none focus:border-[#C5A059]"
                  placeholder="Price"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-wider text-stone-400">Duration (mins)</label>
                <input
                  type="number"
                  value={editForm.duration}
                  onChange={(e) => setEditForm({ ...editForm, duration: e.target.value })}
                  className="w-full bg-white border border-[#EADBCE] rounded-xl p-3 text-sm font-bold text-stone-800 outline-none focus:border-[#C5A059]"
                  placeholder="Duration"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-wider text-stone-400">Category</label>
                <select
                  value={editForm.category}
                  onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                  className="w-full bg-white border border-[#EADBCE] rounded-xl p-3 text-sm font-bold text-stone-800 outline-none focus:border-[#C5A059] h-[48px] cursor-pointer"
                >
                  <option value="men">Men</option>
                  <option value="women">Women</option>
                  <option value="addon">Addon</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-wider text-stone-400">Description</label>
                <textarea
                  value={editForm.description}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                  className="w-full bg-white border border-[#EADBCE] rounded-xl p-3 text-sm font-bold text-stone-800 outline-none focus:border-[#C5A059] min-h-[60px]"
                  placeholder="Description"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-wider text-stone-400">Upload Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleEditImageUpload}
                  className="w-full bg-white border border-[#EADBCE] rounded-xl p-2.5 text-xs file:mr-2 file:py-1 file:px-2.5 file:rounded-lg file:border-0 file:bg-[#FAF6F0] file:text-stone-700 file:font-black file:uppercase file:cursor-pointer"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-wider text-stone-400">Image URL</label>
                <input
                  value={editForm.image}
                  onChange={(e) => setEditForm({ ...editForm, image: e.target.value })}
                  className="w-full bg-white border border-[#EADBCE] rounded-xl p-3 text-sm font-bold text-stone-800 outline-none focus:border-[#C5A059]"
                  placeholder="Image URL"
                />
              </div>

              {editForm.image && (
                <div className="mt-2">
                  <p className="text-[10px] font-black uppercase tracking-wider text-stone-400 mb-1">Preview</p>
                  <div className="w-full h-32 rounded-xl overflow-hidden border border-stone-200 bg-stone-50">
                    <img src={editForm.image} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-3 pt-4 border-t border-[#EADBCE]/50 mt-5 font-sans">
              <button 
                onClick={saveServiceChanges}
                className="rounded-xl px-5 py-3 text-xs font-extrabold tracking-wider uppercase text-white shadow-md hover:opacity-95 transition-all cursor-pointer font-sans" 
                style={{ background: CHARCOAL }}
              >
                Save Changes
              </button>
              <button 
                onClick={() => setSelectedService(null)} 
                className="rounded-xl bg-stone-100 border border-stone-200 text-stone-500 hover:bg-stone-200 font-extrabold text-xs uppercase tracking-wider px-5 py-3 transition-all cursor-pointer font-sans"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      </div>
    );
  }