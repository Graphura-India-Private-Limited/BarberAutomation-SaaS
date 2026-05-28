import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Scissors, BarChart2, CreditCard, DollarSign, LayoutDashboard,
  LogOut, Plus, Trash2, ArrowLeft, Clock, Tags 
} from "lucide-react";
import Navbar from "../../Components/layout/Navbar";
import Footer from "../../Components/layout/Footer";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const GOLD = "#C5A059";
const CHARCOAL = "#3E362E";

export default function ManageServices() {
  const navigate = useNavigate();
  const [salon, setSalon] = useState(null);
  const [services, setServices] = useState([]);
  const [newService, setNewService] = useState({ name: "", price: "", duration: "30", category: "men" });
  const [isAdding, setIsAdding] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/owner/login");
      return;
    }
    loadData();
  }, []);

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
    try {
      const res = await fetch(`${API}/services`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
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
      setNewService({ name: "", price: "", duration: "30", category: "men" });
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

  if (loading) {
    return (
      <div style={{ background: "#FAF6F0" }} className="min-h-screen flex items-center justify-center font-sans">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center animate-pulse">
            <Scissors className="w-6 h-6 text-amber-600" />
          </div>
          <p className="text-stone-600 text-sm font-semibold tracking-wide">Loading Operational Catalog...</p>
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
          <h1 className="text-2xl font-bold text-zinc-900 font-serif">Approval Required</h1>
          <p className="mt-3 text-sm text-zinc-500">
            Barber management, queue controls and service pricing unlock after admin approval.
          </p>
          <button onClick={() => navigate("/owner/dashboard")} className="mt-8 rounded-xl text-white font-black text-[10px] tracking-widest uppercase px-6 py-4 hover:opacity-95 transition shadow-md" style={{ background: CHARCOAL }}>
            Back to Status
          </button>
        </div>
      </div>
    );
  }

  return (
      <div className="min-h-screen flex flex-col">

    <Navbar />
    <div className="flex-1 flex font-sans text-stone-800" style={{ background: "#FAF6F0" }}>
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

  {/* ── MATCHING SIDEBAR NAVIGATION ── */}
      <aside className="w-64 border-r sticky top-0 self-start  h-screen flex flex-col justify-between p-6 z-30 shrink-0 bg-white border-stone-200">
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

      {/* ── MAIN CONTENT DATA WORKSPACE ── */}
      <main className="flex-1 p-8 md:p-12 min-w-0">
        <div className="max-w-4xl mx-auto">
          
          {/* Breadcrumb Control Action */}
          <button 
            onClick={() => navigate("/owner/dashboard")} 
            className="mb-6 flex items-center gap-2 text-[10px] font-black tracking-widest uppercase text-stone-400 hover:text-stone-600 transition-colors group"
          >
            <ArrowLeft size={14} className="transform group-hover:-translate-x-0.5 transition-transform" style={{ color: GOLD }} /> 
            Back to Console
          </button>

          {/* Manage Services Title Heading */}
          <header className="mb-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5 border-b pb-6 border-stone-200">
            <div>
              <h1 className="text-4xl font-black font-serif text-stone-900 tracking-tight">
                Manage <span style={{ color: GOLD }}>Services</span>
              </h1>
              <p className="mt-2 text-[10px] font-black uppercase tracking-widest text-stone-400">
                Current Workspace: {salon?.salon_name}
              </p>
            </div>
            
            {!isAdding && (
              <button 
                onClick={() => setIsAdding(true)} 
                className="flex items-center gap-2 px-6 py-3.5 rounded-xl font-black text-[10px] tracking-widest text-white uppercase shadow-md transition-all active:scale-95 hover:opacity-90"
                style={{ background: CHARCOAL }}
              >
                <Plus size={14} style={{ color: GOLD }} />
                Add New Service
              </button>
            )}
          </header>

          {error && <p className="mb-6 rounded-xl bg-red-50 border border-red-200 p-4 text-center text-xs font-bold text-red-600">{error}</p>}

          {/* Inline Add Form overlay block */}
          {isAdding && (
            <div className="mb-8 card p-6 shadow-lg">
              <h2 className="mb-5 text-sm font-black uppercase tracking-wider text-stone-900 flex items-center gap-2">
                <Tags size={14} style={{ color: GOLD }} /> New Service Specification
              </h2>
              <form onSubmit={handleAddService} className="grid gap-4 md:grid-cols-5">
                <div className="md:col-span-2">
                  <label className="text-[9px] font-black uppercase tracking-wider text-stone-400 mb-1.5 block">Service Name</label>
                  <input required placeholder="e.g., Luxury Beard Trim" value={newService.name} onChange={e => setNewService(prev => ({ ...prev, name: e.target.value }))} className="w-full rounded-xl border border-stone-200 bg-white p-3.5 text-sm font-semibold outline-none focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059]/20 transition-all text-stone-800 placeholder-stone-400" />
                </div>
                <div>
                  <label className="text-[9px] font-black uppercase tracking-wider text-stone-400 mb-1.5 block">Ticket Rate (₹)</label>
                  <input required type="number" min="1" placeholder="Price" value={newService.price} onChange={e => setNewService(prev => ({ ...prev, price: e.target.value }))} className="w-full rounded-xl border border-stone-200 bg-white p-3.5 text-sm font-semibold outline-none focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059]/20 transition-all text-stone-800 placeholder-stone-400" />
                </div>
                <div>
                  <label className="text-[9px] font-black uppercase tracking-wider text-stone-400 mb-1.5 block">Session Minutes</label>
                  <input type="number" min="5" placeholder="Duration" value={newService.duration} onChange={e => setNewService(prev => ({ ...prev, duration: e.target.value }))} className="w-full rounded-xl border border-stone-200 bg-white p-3.5 text-sm font-semibold outline-none focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059]/20 transition-all text-stone-800 placeholder-stone-400" />
                </div>
                <div>
                  <label className="text-[9px] font-black uppercase tracking-wider text-stone-400 mb-1.5 block">Category Slot</label>
                  <select value={newService.category} onChange={e => setNewService(prev => ({ ...prev, category: e.target.value }))} className="w-full rounded-xl border border-stone-200 bg-white p-3.5 text-sm font-semibold outline-none focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059]/20 transition-all text-stone-700 cursor-pointer">
                    <option value="men">Men</option>
                    <option value="women">Women</option>
                    <option value="addon">Addon</option>
                  </select>
                </div>
                <div className="flex gap-3 md:col-span-5 pt-2 border-t border-stone-100 mt-2">
                  <button type="submit" className="rounded-xl px-5 py-3 text-xs font-black tracking-widest uppercase text-white shadow-md hover:opacity-95 transition-all" style={{ background: CHARCOAL }}>
                    Save Catalog Item
                  </button>
                  <button type="button" onClick={() => setIsAdding(false)} className="rounded-xl bg-stone-100 border border-stone-200 text-stone-500 hover:bg-stone-200 font-black text-xs uppercase tracking-widest px-5 py-3 transition-all">
                    Dismiss
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Active Services Listing Frame Stack */}
          <div className="space-y-4">
            {services.map(service => (
              <div key={service._id} className="card p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4 shadow-sm">
                <div>
                  <h3 className="text-md font-black font-serif text-stone-900 tracking-tight">{service.name}</h3>
                  <div className="flex items-center gap-3 text-stone-400 text-[10px] font-bold uppercase tracking-widest mt-2">
                    <span className="px-2 py-0.5 rounded bg-stone-100 border border-stone-200/60 text-stone-600">{service.category}</span>
                    <span className="flex items-center gap-1"><Clock size={12} style={{ color: GOLD }} /> {service.duration || 30} Mins</span>
                  </div>
                </div>
                <div className="flex items-center justify-between md:justify-end gap-6 w-full md:w-auto pt-3 md:pt-0 border-t md:border-0 border-stone-100">
                  <div className="text-left md:text-right">
                    <p className="text-2xl font-black font-mono text-stone-900">₹{service.price}</p>
                    <p className="text-[9px] font-black uppercase tracking-wider mt-0.5" style={{ color: GOLD }}>Base Price</p>
                  </div>
                  <button 
                    onClick={() => deleteService(service._id)} 
                    className="rounded-xl border border-red-200 bg-red-50/50 text-red-600 hover:bg-red-600 hover:text-white px-4 py-2.5 text-[10px] font-black uppercase tracking-widest transition-all shadow-sm flex items-center gap-1"
                  >
                    <Trash2 size={12} /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

          {services.length === 0 && (
            <div className="bg-white border border-[#EADBCE] border-dashed rounded-3xl p-12 text-center text-stone-400 text-xs font-black uppercase tracking-widest">
              No services added to your catalog yet.
            </div>
          )}
        </div>
      </main>
    </div>
    <Footer />
    </div>
  );
}