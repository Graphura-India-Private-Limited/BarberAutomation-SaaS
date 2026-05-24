import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import shopImage from "../../assets/shop.jpg";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const emptyForm = {
  salon_name: "",
  owner_name: "",
  mobile: "",
  email: "",
  password: "",
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

export default function SalonRegistration() {
  const navigate = useNavigate();
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const setField = (name, value) => {
    setForm(prev => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleGeoTag = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by this browser.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      position => {
        setForm(prev => ({
          ...prev,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        }));
        setMessage("Location captured.");
      },
      () => setError("Location permission denied. Please allow location access.")
    );
  };

  const handleImages = async (event) => {
    const files = Array.from(event.target.files || []).slice(0, 5);
    const encoded = await Promise.all(
      files.map(file => new Promise(resolve => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.readAsDataURL(file);
      }))
    );
    setForm(prev => ({ ...prev, images: [...prev.images, ...encoded].slice(0, 5) }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!form.latitude || !form.longitude) {
      setError("Please tag your salon location before submission.");
      return;
    }
    setLoading(true);
    setError("");
    setMessage("");
    try {
      const payload = {
        ...form,
        services_offered: form.services_offered.split(",").map(s => s.trim()).filter(Boolean),
        basic_pricing: Number(form.basic_pricing),
        number_of_barbers: Number(form.number_of_barbers),
      };
      const res = await fetch(`${API}/auth/owner/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message || "Registration failed");
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", "owner");
      localStorage.setItem("salonId", data.salon?._id || "");
      localStorage.setItem("salonName", data.salon?.salon_name || "");
      setMessage("Submitted for approval. Your status is Pending Approval.");
      setTimeout(() => navigate("/owner/dashboard"), 1000);
    } catch (err) {
      setError(err.message || "Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full rounded-2xl border border-[#EAD8C0] bg-[#FDF5E6]/60 p-4 text-sm font-semibold text-[#3E362E] outline-none transition focus:border-[#C5A059] focus:bg-white";

  return (
    <div className="min-h-screen bg-[#FAF7F2] p-6 font-sans">
      <div className="mx-auto max-w-5xl py-10">
        <header className="mb-10 text-center">
          <span className="mb-2 block text-[10px] font-black uppercase tracking-[0.5em] text-[#C5A059]">
            Graphura India Private Limited
          </span>
          <h1 className="text-4xl font-serif tracking-normal text-[#3E362E] md:text-5xl">
            Register Your Salon
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-sm font-medium text-[#8D7B68]">
            Submit your salon profile for admin approval. Customers can discover and book only after approval.
          </p>
        </header>

        <form onSubmit={handleSubmit} className="rounded-[2rem] border border-[#EAD8C0] bg-white/75 p-6 shadow-2xl backdrop-blur-xl md:p-10">
          <div className="grid gap-5 md:grid-cols-2">
            <Field label="Salon Name *"><input required minLength={3} value={form.salon_name} onChange={e => setField("salon_name", e.target.value)} className={inputClass} /></Field>
            <Field label="Owner Name *"><input required value={form.owner_name} onChange={e => setField("owner_name", e.target.value)} className={inputClass} /></Field>
            <Field label="Mobile Number *"><input required maxLength={10} value={form.mobile} onChange={e => setField("mobile", e.target.value.replace(/\D/g, "").slice(0, 10))} className={inputClass} /></Field>
            <Field label="Email"><input type="email" value={form.email} onChange={e => setField("email", e.target.value)} className={inputClass} /></Field>
            <Field label="Password *"><input required type="password" minLength={6} value={form.password} onChange={e => setField("password", e.target.value)} className={inputClass} /></Field>
            <Field label="Customer Support Number *"><input required maxLength={10} value={form.support_number} onChange={e => setField("support_number", e.target.value.replace(/\D/g, "").slice(0, 10))} className={inputClass} /></Field>
            <Field label="Opening Time"><input type="time" value={form.opening_time} onChange={e => setField("opening_time", e.target.value)} className={inputClass} /></Field>
            <Field label="Closing Time"><input type="time" value={form.closing_time} onChange={e => setField("closing_time", e.target.value)} className={inputClass} /></Field>
            <Field label="Services Offered *"><input required placeholder="Haircut, Beard, Facial" value={form.services_offered} onChange={e => setField("services_offered", e.target.value)} className={inputClass} /></Field>
            <Field label="Basic Pricing *"><input required type="number" min="1" value={form.basic_pricing} onChange={e => setField("basic_pricing", e.target.value)} className={inputClass} /></Field>
            <Field label="Number of Barbers *"><input required type="number" min="1" value={form.number_of_barbers} onChange={e => setField("number_of_barbers", e.target.value)} className={inputClass} /></Field>
            <Field label="Shop Images"><input type="file" accept="image/*" multiple onChange={handleImages} className={inputClass} /></Field>
          </div>

          <div className="mt-5 grid gap-5 md:grid-cols-[1fr_auto]">
            <Field label="Address *"><textarea required minLength={10} value={form.address} onChange={e => setField("address", e.target.value)} className={`${inputClass} min-h-28 resize-none`} /></Field>
            <div className="flex items-end">
              <button type="button" onClick={handleGeoTag} className={`h-14 rounded-2xl border px-6 text-[10px] font-black uppercase tracking-widest transition ${form.latitude ? "border-green-200 bg-green-50 text-green-700" : "border-[#C5A059] bg-white text-[#C5A059] hover:bg-[#C5A059] hover:text-white"}`}>
                {form.latitude ? "Location Tagged" : "Geo Tag Location"}
              </button>
            </div>
          </div>

          <Field label="About Salon">
            <textarea value={form.about} onChange={e => setField("about", e.target.value)} className={`${inputClass} min-h-24 resize-none`} />
          </Field>

          {form.images.length > 0 && (
            <div className="mt-5 grid grid-cols-3 gap-3 md:grid-cols-5">
              {form.images.map((image, index) => (
                <img key={index} src={image} alt={`Salon upload ${index + 1}`} className="aspect-square rounded-2xl border border-[#EAD8C0] object-cover" />
              ))}
            </div>
          )}

          {error && <p className="mt-5 rounded-xl bg-red-50 p-3 text-center text-xs font-bold text-red-600">{error}</p>}
          {message && <p className="mt-5 rounded-xl bg-green-50 p-3 text-center text-xs font-bold text-green-700">{message}</p>}

          <button disabled={loading} className="mt-8 w-full rounded-2xl bg-[#3E362E] py-5 text-[11px] font-black uppercase tracking-[0.3em] text-[#FFFBF2] shadow-xl transition hover:bg-[#2A241F] disabled:opacity-60">
            {loading ? "Submitting..." : "Submit for Approval"}
          </button>
        </form>
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label className="block space-y-2">
      <span className="ml-1 text-[10px] font-black uppercase tracking-widest text-[#8D7B68]">{label}</span>
      {children}
    </label>
  );
}
