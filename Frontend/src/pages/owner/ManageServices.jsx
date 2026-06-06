import React, { useEffect, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { 
  Scissors, BarChart2, CreditCard, DollarSign, LayoutDashboard,
  LogOut, Plus, Trash2, ArrowLeft, Clock, Tags 
} from "lucide-react";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const GOLD = "#C5A059";
const CHARCOAL = "#3E362E";

export default function ManageServices() {
  const navigate = useNavigate();
  const { salon, token } = useOutletContext();
  const [services, setServices] = useState([]);
  const [newService, setNewService] = useState({ name: "", price: "", duration: "30", category: "men", description: "", image: "" });
  const [isAdding, setIsAdding] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (salon?._id) {
      loadServices();
    }
  }, [salon?._id]);

  const loadServices = async () => {
    setLoading(true);
    setError("");
    try {
      const serviceData = await fetch(`${API}/services/${salon._id}`, {
        headers: { Authorization: `Bearer ${token}` }
      }).then(r => r.json());
      if (serviceData.success) {
        setServices(serviceData.services || []);
      } else {
        throw new Error(serviceData.message || "Unable to fetch services");
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
    try {
      const res = await fetch(`${API}/services`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json", 
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({
          ...newService,
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
    if (!window.confirm("Are you sure you want to delete this service?")) return;
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

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 font-sans">
        <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center animate-pulse mb-3">
          <Scissors className="w-5 h-5 text-[#C5A059] animate-bounce" />
        </div>
        <p className="text-stone-500 text-xs uppercase font-extrabold tracking-widest animate-pulse">Syncing Service Catalog...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto text-left font-sans animate-fade-in">
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

      {/* Manage Services Main Dashboard Heading Component */}
      <header className="mb-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5 border-b pb-6 border-stone-200 text-left">
        <div>
          <h2 className="font-serif text-3xl sm:text-4xl tracking-normal text-stone-900 flex items-center justify-start gap-2 whitespace-nowrap">
            <span className="font-bold uppercase">Manage</span>
            <span className="italic text-[#C5A059] normal-case font-medium">Services</span>
          </h2>
          <p className="text-[11px] font-extrabold uppercase tracking-widest text-[#C5A059] mt-2 font-sans">
            Current Workspace: {salon?.salon_name}
          </p>
        </div>
        
        {!isAdding && (
          <button 
            onClick={() => setIsAdding(true)} 
            className="flex items-center gap-2 px-6 py-3.5 rounded-xl font-extrabold text-xs tracking-wider text-white uppercase shadow-md transition-all active:scale-95 hover:opacity-90 cursor-pointer font-sans border-none"
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
        <div className="mb-8 card p-6 shadow-lg text-left bg-white">
          <h3 className="font-serif text-xl sm:text-2xl tracking-normal text-stone-900 flex items-center justify-start gap-2 whitespace-nowrap mb-5">
            <span className="font-bold uppercase">New Service</span>
            <span className="italic text-[#C5A059] normal-case font-medium">Specification</span>
          </h3>
          <form onSubmit={handleAddService} className="grid gap-4 md:grid-cols-6 font-sans">
            <div className="md:col-span-3">
              <label className="text-[11px] font-extrabold uppercase tracking-widest text-[#C5A059] mb-1.5 block font-sans">Service Name</label>
              <input required placeholder="e.g., Luxury Beard Trim" value={newService.name} onChange={e => setNewService(prev => ({ ...prev, name: e.target.value }))} className="w-full rounded-xl border border-stone-200 bg-white p-3.5 text-sm font-medium outline-none focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059]/20 transition-all text-stone-800 placeholder-stone-400 font-sans" />
            </div>
            <div className="md:col-span-3 flex flex-col justify-end">
              <label className="text-[11px] font-extrabold uppercase tracking-widest text-[#C5A059] mb-1.5 block font-sans">Service Image</label>
              <div className="flex gap-2">
                <input 
                  placeholder="Paste URL or choose file" 
                  value={newService.image} 
                  onChange={e => setNewService(prev => ({ ...prev, image: e.target.value }))} 
                  className="flex-1 rounded-xl border border-stone-200 bg-white p-3.5 text-sm font-medium outline-none focus:border-[#C5A059] transition-all text-stone-800 placeholder-stone-400 font-sans" 
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
                        reader.onload = () => setNewService(prev => ({ ...prev, image: reader.result }));
                        reader.readAsDataURL(file);
                      }
                    }} 
                    className="hidden" 
                  />
                </label>
              </div>
            </div>
            <div className="md:col-span-2">
              <label className="text-[11px] font-extrabold uppercase tracking-widest text-[#C5A059] mb-1.5 block font-sans">Ticket Rate (₹)</label>
              <input required type="number" min="1" placeholder="Price" value={newService.price} onChange={e => setNewService(prev => ({ ...prev, price: e.target.value }))} className="w-full rounded-xl border border-stone-200 bg-white p-3.5 text-sm font-medium outline-none focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059]/20 transition-all text-stone-800 placeholder-stone-400 font-sans" />
            </div>
            <div className="md:col-span-2">
              <label className="text-[11px] font-extrabold uppercase tracking-widest text-[#C5A059] mb-1.5 block font-sans">Session Minutes</label>
              <input type="number" min="5" placeholder="Duration" value={newService.duration} onChange={e => setNewService(prev => ({ ...prev, duration: e.target.value }))} className="w-full rounded-xl border border-stone-200 bg-white p-3.5 text-sm font-medium outline-none focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059]/20 transition-all text-stone-800 placeholder-stone-400 font-sans" />
            </div>
            <div className="md:col-span-2">
              <label className="text-[11px] font-extrabold uppercase tracking-widest text-[#C5A059] mb-1.5 block font-sans">Category Slot</label>
              <select value={newService.category} onChange={e => setNewService(prev => ({ ...prev, category: e.target.value }))} className="w-full rounded-xl border border-stone-200 bg-white p-3.5 text-sm font-medium outline-none focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059]/20 transition-all text-stone-750 cursor-pointer font-sans">
                <option value="men">Men</option>
                <option value="women">Women</option>
                <option value="addon">Addon</option>
              </select>
            </div>
            <div className="md:col-span-6">
              <label className="text-[11px] font-extrabold uppercase tracking-widest text-[#C5A059] mb-1.5 block font-sans">Service Description</label>
              <textarea placeholder="Provide detailed operational info about the service..." value={newService.description} onChange={e => setNewService(prev => ({ ...prev, description: e.target.value }))} className="w-full min-h-20 rounded-xl border border-stone-200 bg-white p-3.5 text-sm font-medium outline-none focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059]/20 transition-all text-stone-800 placeholder-stone-400 font-sans resize-none" />
            </div>
            <div className="flex gap-3 md:col-span-6 pt-2 border-t border-stone-100 mt-2 font-sans">
              <button type="submit" className="rounded-xl px-5 py-3 text-xs font-extrabold tracking-wider uppercase text-white shadow-md hover:opacity-95 transition-all cursor-pointer font-sans border-none" style={{ background: CHARCOAL }}>
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
        {services.map(service => (
          <div key={service._id} className="card p-5 flex flex-col justify-between shadow-sm bg-white overflow-hidden relative group">
            <div className="flex gap-4">
              <div className="w-20 h-20 rounded-2xl bg-stone-50 border border-stone-150 shrink-0 overflow-hidden relative">
                {service.image ? (
                  <img src={service.image} alt={service.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-stone-100 text-stone-400">
                    <Scissors size={24} />
                  </div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-md font-black font-serif text-stone-900 tracking-tight leading-snug truncate">{service.name}</h3>
                <p className="text-stone-500 text-xs mt-1.5 line-clamp-2 min-h-8 font-sans">
                  {service.description || "No description provided."}
                </p>
                <div className="flex items-center gap-3 mt-3.5 font-sans">
                  <span className="px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-widest text-[#C5A059] bg-stone-100 border border-stone-200/60 rounded">{service.category}</span>
                  <span className="flex items-center gap-1 text-stone-600 text-xs font-semibold"><Clock size={11} style={{ color: GOLD }} /> {service.duration || 30} Mins</span>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between pt-4 border-t border-stone-100 mt-4 font-sans">
              <div>
                <p className="text-xl font-black font-mono text-stone-900 leading-none">₹{service.price}</p>
                <p className="text-[9px] font-extrabold uppercase tracking-widest text-[#C5A059] mt-1.5">Base Price</p>
              </div>
              <button 
                onClick={() => deleteService(service._id)} 
                className="rounded-xl border border-red-200 bg-red-50/50 text-red-600 hover:bg-red-600 hover:text-white px-3.5 py-2 text-xs font-extrabold tracking-wider uppercase transition-all shadow-sm flex items-center gap-1 cursor-pointer"
              >
                <Trash2 size={11} /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {services.length === 0 && (
        <div className="bg-white border border-[#EADBCE] border-dashed rounded-3xl p-12 text-center text-[10px] font-extrabold uppercase tracking-widest text-[#C5A059] font-sans">
          No services added to your catalog yet.
        </div>
      )}
    </div>
  );
}