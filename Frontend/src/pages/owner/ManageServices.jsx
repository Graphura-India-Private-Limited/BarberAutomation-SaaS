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
    return <div className="min-h-screen bg-[#FFFBF2] p-10 text-center font-black text-[#3E362E]">Loading services...</div>;
  }

  if (salon?.status !== "approved") {
    return (
      <div className="min-h-screen bg-[#FFFBF2] p-6 font-sans text-[#3E362E]">
        <div className="mx-auto max-w-2xl rounded-[2rem] border border-yellow-200 bg-yellow-50 p-8 text-center">
          <h1 className="text-2xl font-black uppercase">Approval Required</h1>
          <p className="mt-3 text-sm font-semibold text-yellow-800">
            Barber management, queue controls and service pricing unlock after admin approval.
          </p>
          <button onClick={() => navigate("/owner/dashboard")} className="mt-6 rounded-xl bg-[#3E362E] px-6 py-3 text-[10px] font-black uppercase tracking-widest text-white">
            Back to Status
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFFBF2] p-4 font-sans text-[#3E362E] md:p-10">
      <div className="mx-auto max-w-4xl">
        <button onClick={() => navigate("/owner/dashboard")} className="mb-8 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#C5A059] transition hover:-translate-x-1">
          Back to Console
        </button>

        <div className="mb-10 flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-black uppercase tracking-tight md:text-5xl">
              Manage <span className="text-[#C5A059]">Services</span>
            </h1>
            <p className="mt-2 text-[10px] font-bold uppercase tracking-[0.4em] text-[#8D7B68]">
              {salon?.salon_name}
            </p>
          </div>
          {!isAdding && (
            <button onClick={() => setIsAdding(true)} className="rounded-2xl bg-[#3E362E] px-8 py-4 text-[10px] font-black uppercase tracking-widest text-white shadow-xl transition hover:scale-105">
              Add New Service
            </button>
          )}
        </div>

        {error && <p className="mb-5 rounded-xl bg-red-50 p-3 text-center text-xs font-bold text-red-600">{error}</p>}

        {isAdding && (
          <div className="mb-10 rounded-[2rem] border-2 border-[#C5A059] bg-white p-7">
            <h2 className="mb-5 text-xl font-black uppercase">New Service Details</h2>
            <form onSubmit={handleAddService} className="grid gap-4 md:grid-cols-5">
              <input required placeholder="Service name" value={newService.name} onChange={e => setNewService(prev => ({ ...prev, name: e.target.value }))} className="rounded-xl border border-[#EAD8C0] bg-[#FFFBF2] p-3 text-sm font-bold outline-none focus:border-[#C5A059] md:col-span-2" />
              <input required type="number" min="1" placeholder="Price" value={newService.price} onChange={e => setNewService(prev => ({ ...prev, price: e.target.value }))} className="rounded-xl border border-[#EAD8C0] bg-[#FFFBF2] p-3 text-sm font-bold outline-none focus:border-[#C5A059]" />
              <input type="number" min="5" placeholder="Minutes" value={newService.duration} onChange={e => setNewService(prev => ({ ...prev, duration: e.target.value }))} className="rounded-xl border border-[#EAD8C0] bg-[#FFFBF2] p-3 text-sm font-bold outline-none focus:border-[#C5A059]" />
              <select value={newService.category} onChange={e => setNewService(prev => ({ ...prev, category: e.target.value }))} className="rounded-xl border border-[#EAD8C0] bg-[#FFFBF2] p-3 text-sm font-bold outline-none focus:border-[#C5A059]">
                <option value="men">Men</option>
                <option value="women">Women</option>
                <option value="addon">Addon</option>
              </select>
              <div className="flex gap-3 md:col-span-5">
                <button className="rounded-xl bg-[#C5A059] px-6 py-3 text-[10px] font-black uppercase tracking-widest text-white">Save</button>
                <button type="button" onClick={() => setIsAdding(false)} className="rounded-xl bg-red-50 px-6 py-3 text-[10px] font-black uppercase tracking-widest text-red-500">Cancel</button>
              </div>
            </form>
          </div>
        )}

        <div className="space-y-4">
          {services.map(service => (
            <div key={service._id} className="flex flex-col gap-4 rounded-[2rem] border border-[#EAD8C0] bg-white p-6 transition hover:shadow-lg md:flex-row md:items-center md:justify-between">
              <div>
                <h3 className="text-lg font-black">{service.name}</h3>
                <p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-[#8D7B68]">
                  {service.category} | {service.duration || 30} min
                </p>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-right">
                  <p className="text-2xl font-black">Rs. {service.price}</p>
                  <p className="text-[9px] font-black uppercase tracking-widest text-[#C5A059]">Base Price</p>
                </div>
                <button onClick={() => deleteService(service._id)} className="rounded-xl bg-red-50 px-4 py-3 text-[10px] font-black uppercase tracking-widest text-red-500 hover:bg-red-500 hover:text-white">
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {services.length === 0 && (
          <div className="rounded-[2rem] border border-dashed border-[#EAD8C0] bg-white p-12 text-center text-sm font-black uppercase tracking-[0.3em] text-[#8D7B68]">
            No services added yet.
          </div>
        )}
      </div>
    </div>
  );
}
