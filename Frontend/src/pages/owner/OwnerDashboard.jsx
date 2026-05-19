import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

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
    return { label: "Pending Approval", dot: "bg-yellow-500", panel: "bg-yellow-50 border-yellow-200 text-yellow-800" };
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

  if (loading) {
    return <div className="min-h-screen bg-[#FFFBF2] p-10 text-center font-black text-[#3E362E]">Loading owner console...</div>;
  }

  return (
    <div className="min-h-screen bg-[#FFFBF2] p-4 font-sans text-[#3E362E] md:p-10">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-black uppercase tracking-tight md:text-5xl">
              Owner <span className="text-[#C5A059]">Console</span>
            </h1>
            <div className="mt-2 flex items-center gap-2">
              <span className={`h-2 w-2 rounded-full ${statusMeta.dot}`} />
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#8D7B68]">
                Salon Status: {statusMeta.label}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <button onClick={() => navigate("/owner/manage-services")} disabled={!approved} className="rounded-xl border border-[#EAD8C0] bg-white px-5 py-3 text-[10px] font-black uppercase tracking-widest transition hover:bg-[#FDF5E6] disabled:cursor-not-allowed disabled:opacity-50">
              Barber & Service Management
            </button>
            <button onClick={() => navigate("/owner/payments")} disabled={!approved} className="rounded-xl border border-[#EAD8C0] bg-white px-5 py-3 text-[10px] font-black uppercase tracking-widest transition hover:bg-[#FDF5E6] disabled:cursor-not-allowed disabled:opacity-50">
              Payments
            </button>
            <button onClick={() => navigate("/owner/revenue")} disabled={!approved} className="rounded-xl border border-[#EAD8C0] bg-white px-5 py-3 text-[10px] font-black uppercase tracking-widest transition hover:bg-[#FDF5E6] disabled:cursor-not-allowed disabled:opacity-50">
              Revenue
            </button>
            <button onClick={() => setEditing(prev => !prev)} className="rounded-xl bg-[#3E362E] px-5 py-3 text-[10px] font-black uppercase tracking-widest text-white shadow-lg transition hover:opacity-90">
              {editing ? "Close Editor" : "Edit Profile"}
            </button>
          </div>
        </header>

        <div className={`mb-8 rounded-2xl border p-5 ${statusMeta.panel}`}>
          <p className="text-sm font-bold">
            {approved
              ? "Your salon is live. Customers can discover and book your services."
              : salon?.status === "rejected"
                ? "Your submission was rejected. Edit your details and resubmit for approval."
                : "Your salon profile is under admin review. Customer discovery and booking unlock after approval."}
          </p>
          {salon?.status === "rejected" && salon?.rejection_reason && (
            <p className="mt-2 text-sm">Reason: <strong>{salon.rejection_reason}</strong></p>
          )}
        </div>

        {error && <p className="mb-5 rounded-xl bg-red-50 p-3 text-center text-xs font-bold text-red-600">{error}</p>}
        {message && <p className="mb-5 rounded-xl bg-green-50 p-3 text-center text-xs font-bold text-green-700">{message}</p>}

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          <section className="space-y-8 lg:col-span-5">
            <div className="rounded-[2rem] border border-[#EAD8C0] bg-white p-7 shadow-sm">
              <h2 className="mb-5 text-xl font-black uppercase">Salon Details</h2>
              <Info label="Business Name" value={salon?.salon_name} />
              <Info label="Owner" value={salon?.owner_name} />
              <Info label="Hours" value={`${salon?.opening_time || "09:00"} - ${salon?.closing_time || "21:00"}`} />
              <Info label="Address" value={salon?.address || "Not added"} />
              <Info label="Support" value={salon?.support_number || salon?.mobile || "Not added"} />
            </div>

            <div className="rounded-[2rem] border border-[#EAD8C0] bg-[#FDF5E6] p-7">
              <h2 className="mb-2 text-xl font-black uppercase">Shop Gallery</h2>
              <div className="mt-5 grid grid-cols-3 gap-3">
                {(form.images || []).map((url, index) => (
                  <img key={index} src={url} alt={`Salon ${index + 1}`} className="aspect-square rounded-2xl border border-white object-cover shadow-sm" />
                ))}
                {(!form.images || form.images.length === 0) && (
                  <div className="col-span-3 rounded-2xl border border-dashed border-[#C5A059]/40 bg-white p-8 text-center text-xs font-bold text-[#8D7B68]">
                    No shop images added yet.
                  </div>
                )}
              </div>
            </div>
          </section>

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
              <div className="rounded-[2rem] border border-[#EAD8C0] bg-white p-7 shadow-xl">
                <h2 className="mb-6 text-2xl font-black uppercase">Activation Checklist</h2>
                <ChecklistItem done={!!salon?.salon_name} label="Salon identity submitted" />
                <ChecklistItem done={!!salon?.latitude && !!salon?.longitude} label="Geo location tagged" />
                <ChecklistItem done={(salon?.services_offered || []).length > 0} label="Services offered added" />
                <ChecklistItem done={!!salon?.basic_pricing} label="Basic pricing added" />
                <ChecklistItem done={(salon?.images || []).length > 0} label="Shop images uploaded" />
                <ChecklistItem done={approved} label="Admin approval completed" />
                <div className="mt-8 rounded-2xl border border-dashed border-[#EAD8C0] bg-[#FDF5E6]/60 p-6">
                  <p className="text-sm font-bold text-[#8D7B68]">
                    Post-approval access includes barber management, service pricing, queue controls and full dashboard operations.
                  </p>
                </div>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div className="mb-4">
      <label className="text-[9px] font-black uppercase tracking-widest text-[#C5A059]">{label}</label>
      <p className="font-bold text-[#3E362E]">{value}</p>
    </div>
  );
}

function ChecklistItem({ done, label }) {
  return (
    <div className="mb-3 flex items-center justify-between rounded-xl border border-[#EAD8C0] bg-[#FFFBF2] p-4">
      <span className="text-sm font-bold">{label}</span>
      <span className={`rounded-full px-3 py-1 text-[10px] font-black uppercase ${done ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
        {done ? "Done" : "Pending"}
      </span>
    </div>
  );
}

function ProfileEditor({ form, setField, addImages, tagLocation, saveProfile, busy, canResubmit }) {
  const inputClass = "w-full rounded-xl border border-[#EAD8C0] bg-[#FFFBF2] p-3 text-sm font-semibold outline-none focus:border-[#C5A059]";
  return (
    <div className="rounded-[2rem] border border-[#EAD8C0] bg-white p-7 shadow-xl">
      <h2 className="mb-6 text-2xl font-black uppercase">Edit Salon Profile</h2>
      <div className="grid gap-4 md:grid-cols-2">
        <input className={inputClass} value={form.salon_name} onChange={e => setField("salon_name", e.target.value)} placeholder="Salon name" />
        <input className={inputClass} value={form.owner_name} onChange={e => setField("owner_name", e.target.value)} placeholder="Owner name" />
        <input className={inputClass} value={form.email} onChange={e => setField("email", e.target.value)} placeholder="Email" />
        <input className={inputClass} value={form.support_number} onChange={e => setField("support_number", e.target.value.replace(/\D/g, "").slice(0, 10))} placeholder="Support number" />
        <input type="time" className={inputClass} value={form.opening_time} onChange={e => setField("opening_time", e.target.value)} />
        <input type="time" className={inputClass} value={form.closing_time} onChange={e => setField("closing_time", e.target.value)} />
        <input className={inputClass} value={form.services_offered} onChange={e => setField("services_offered", e.target.value)} placeholder="Services, comma separated" />
        <input type="number" className={inputClass} value={form.basic_pricing} onChange={e => setField("basic_pricing", e.target.value)} placeholder="Basic pricing" />
        <input type="number" className={inputClass} value={form.number_of_barbers} onChange={e => setField("number_of_barbers", e.target.value)} placeholder="Number of barbers" />
        <input type="file" accept="image/*" multiple className={inputClass} onChange={addImages} />
      </div>
      <textarea className={`${inputClass} mt-4 min-h-24 resize-none`} value={form.address} onChange={e => setField("address", e.target.value)} placeholder="Address" />
      <textarea className={`${inputClass} mt-4 min-h-20 resize-none`} value={form.about} onChange={e => setField("about", e.target.value)} placeholder="About salon" />
      <div className="mt-5 flex flex-wrap gap-3">
        <button onClick={tagLocation} className="rounded-xl border border-[#C5A059] px-5 py-3 text-[10px] font-black uppercase tracking-widest text-[#C5A059] hover:bg-[#C5A059] hover:text-white">
          Update Location
        </button>
        <button onClick={() => saveProfile(false)} disabled={busy} className="rounded-xl bg-[#3E362E] px-5 py-3 text-[10px] font-black uppercase tracking-widest text-white disabled:opacity-50">
          Save Profile
        </button>
        {canResubmit && (
          <button onClick={() => saveProfile(true)} disabled={busy} className="rounded-xl bg-[#C5A059] px-5 py-3 text-[10px] font-black uppercase tracking-widest text-white disabled:opacity-50">
            Resubmit Request
          </button>
        )}
      </div>
    </div>
  );
}
