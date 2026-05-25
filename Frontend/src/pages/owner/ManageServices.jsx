import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

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

  if (loading) {
    return (
      <div className="min-h-screen p-10 flex items-center justify-center font-sans text-zinc-800" style={{ background: "var(--bg)" }}>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap');
          :root { 
            --bg: #FAF6F0; 
          }
          body, .font-sans {
            font-family: 'Plus Jakarta Sans', sans-serif !important;
          }
        `}</style>
        <div className="text-center font-bold text-zinc-500 flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-amber-600 border-t-transparent rounded-full animate-spin" />
          <span>Loading services...</span>
        </div>
      </div>
    );
  }

  if (salon?.status !== "approved") {
    return (
      <div className="min-h-screen p-6 font-sans text-zinc-800 flex items-center justify-center" style={{ background: "var(--bg)" }}>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap');
          :root { 
            --bg: #FAF6F0; 
            --bg2: #FFFFFF; 
            --border: #EADBCE; 
          }
          body, .font-sans {
            font-family: 'Plus Jakarta Sans', sans-serif !important;
          }
          .font-serif {
            font-family: 'Playfair Display', serif !important;
          }
          .card { 
            background: var(--bg2); 
            border: 1px solid var(--border); 
            border-radius: 24px; 
            box-shadow: 0 4px 20px -2px rgba(28, 25, 23, 0.04), 0 2px 8px -1px rgba(28, 25, 23, 0.02);
          }
        `}</style>
        <div className="mx-auto max-w-xl text-center card p-10">
          <span className="text-5xl block mb-4">⌛</span>
          <h1 className="text-2xl font-bold text-zinc-900 font-serif">Approval Required</h1>
          <p className="mt-3 text-sm text-zinc-500">
            Barber management, queue controls and service pricing unlock after admin approval.
          </p>
          <button onClick={() => navigate("/owner/dashboard")} className="mt-8 rounded-xl bg-amber-600 text-white font-bold text-xs uppercase tracking-wider px-6 py-3.5 hover:bg-amber-700 transition shadow-md">
            Back to Status
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 font-sans text-zinc-800 md:p-10" style={{ background: "var(--bg)" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap');
        :root { 
          --gold: #D97706; 
          --gold2: #B45309; 
          --bg: #FAF6F0; 
          --bg2: #FFFFFF; 
          --bg3: #FDFBF7; 
          --border: #EADBCE; 
          --text: #1C1917; 
          --muted: #78716C; 
        }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body, .font-sans {
          font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important;
        }
        .font-serif {
          font-family: 'Playfair Display', Georgia, Cambria, "Times New Roman", Times, serif !important;
        }
        .card { 
          background: var(--bg2); 
          border: 1px solid var(--border); 
          border-radius: 24px; 
          box-shadow: 0 4px 20px -2px rgba(28, 25, 23, 0.04), 0 2px 8px -1px rgba(28, 25, 23, 0.02);
          transition: all 0.2s ease;
        }
        .card:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px -4px rgba(28, 25, 23, 0.06), 0 4px 12px -2px rgba(28, 25, 23, 0.03);
          border-color: #D6C4AE;
        }
      `}</style>
      <div className="mx-auto max-w-4xl">
        <button onClick={() => navigate("/owner/dashboard")} className="mb-8 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-700 hover:text-amber-800 transition hover:-translate-x-1">
          Back to Console
        </button>

        <div className="mb-10 flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold font-serif tracking-normal text-zinc-900 md:text-5xl">
              Manage <span className="text-amber-600 font-serif">Services</span>
            </h1>
            <p className="mt-2 text-xs font-bold uppercase tracking-widest text-zinc-500">
              {salon?.salon_name}
            </p>
          </div>
          {!isAdding && (
            <button onClick={() => setIsAdding(true)} className="rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs uppercase tracking-wider px-8 py-4 shadow-md transition-all duration-200">
              Add New Service
            </button>
          )}
        </div>

        {error && <p className="mb-5 rounded-xl bg-red-50 border border-red-100 p-3 text-center text-xs font-bold text-red-600">{error}</p>}

        {isAdding && (
          <div className="mb-10 card p-7">
            <h2 className="mb-5 text-xl font-bold font-serif text-zinc-900">New Service Details</h2>
            <form onSubmit={handleAddService} className="grid gap-4 md:grid-cols-5">
              <input required placeholder="Service name" value={newService.name} onChange={e => setNewService(prev => ({ ...prev, name: e.target.value }))} className="w-full bg-zinc-50 border border-zinc-200 rounded-xl p-3 outline-none text-zinc-800 focus:border-amber-600 focus:bg-white transition text-sm font-medium md:col-span-2" />
              <input required type="number" min="1" placeholder="Price (₹)" value={newService.price} onChange={e => setNewService(prev => ({ ...prev, price: e.target.value }))} className="w-full bg-zinc-50 border border-zinc-200 rounded-xl p-3 outline-none text-zinc-800 focus:border-amber-600 focus:bg-white transition text-sm font-medium" />
              <input type="number" min="5" placeholder="Minutes" value={newService.duration} onChange={e => setNewService(prev => ({ ...prev, duration: e.target.value }))} className="w-full bg-zinc-50 border border-zinc-200 rounded-xl p-3 outline-none text-zinc-800 focus:border-amber-600 focus:bg-white transition text-sm font-medium" />
              <select value={newService.category} onChange={e => setNewService(prev => ({ ...prev, category: e.target.value }))} className="w-full bg-zinc-50 border border-zinc-200 rounded-xl p-3 outline-none text-zinc-800 focus:border-amber-600 focus:bg-white transition text-sm font-medium cursor-pointer">
                <option value="men">Men</option>
                <option value="women">Women</option>
                <option value="addon">Addon</option>
              </select>
              <div className="flex gap-3 md:col-span-5 pt-2">
                <button className="rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs uppercase tracking-wider px-6 py-3 shadow-md transition-all">Save</button>
                <button type="button" onClick={() => setIsAdding(false)} className="rounded-xl bg-red-50 text-red-700 hover:bg-red-100 font-bold text-xs uppercase tracking-wider px-6 py-3 transition-all">Cancel</button>
              </div>
            </form>
          </div>
        )}

        <div className="space-y-4">
          {services.map(service => (
            <div key={service._id} className="card p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4 transition-all">
              <div>
                <h3 className="text-lg font-bold font-serif text-zinc-900">{service.name}</h3>
                <p className="mt-1 text-xs font-bold uppercase tracking-widest text-zinc-500">
                  {service.category} | {service.duration || 30} min
                </p>
              </div>
              <div className="flex items-center justify-between md:justify-end gap-6 w-full md:w-auto">
                <div className="text-left md:text-right">
                  <p className="text-2xl font-bold font-serif text-zinc-900">₹{service.price}</p>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-amber-700 mt-0.5">Base Price</p>
                </div>
                <button onClick={() => deleteService(service._id)} className="rounded-xl bg-red-50 border border-red-200/50 hover:bg-red-100 text-red-700 px-5 py-3 text-xs font-bold uppercase tracking-wider transition-all">
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {services.length === 0 && (
          <div className="bg-white/50 border border-zinc-200 border-dashed rounded-3xl p-12 text-center text-zinc-400 italic">
            No services added yet.
          </div>
        )}
      </div>
    </div>
  );
}
