import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import shopImage from "../../assets/shop.jpg";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../Components/layout/Footer";

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

  const inputClass = "w-full bg-zinc-50/60 border border-zinc-200 rounded-2xl p-4 outline-none text-zinc-800 focus:border-amber-600 focus:bg-white transition text-sm font-medium";

  return (
   <div className="min-h-screen flex flex-col">

    <Navbar />
    <div
      className="relative flex-1 bg-cover bg-center bg-fixed p-6 font-sans text-zinc-800"
      style={{ backgroundImage: `url(${shopImage})` }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap');
        :root { 
          --gold: #D97706; 
          --gold2: #B45309; 
          --bg: #FAF6F0; 
          --bg2: #FFFFFF; 
          --border: #EADBCE; 
        }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body, .font-sans {
          font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important;
        }
        .font-serif {
          font-family: 'Playfair Display', Georgia, Cambria, "Times New Roman", Times, serif !important;
        }
        .card { 
          background: rgba(255, 255, 255, 0.85); 
          border: 1px solid var(--border); 
          border-radius: 32px; 
          box-shadow: 0 10px 30px -5px rgba(28, 25, 23, 0.08), 0 4px 12px -2px rgba(28, 25, 23, 0.03);
          transition: all 0.2s ease;
        }
      `}</style>

      <div className="absolute inset-0 bg-[#FAF6F0]/90 backdrop-blur-sm" />
      <div className="relative z-10 mx-auto max-w-5xl py-10">
        <header className="mb-10 text-center">
          <span className="mb-2 block text-[10px] font-bold uppercase tracking-widest text-amber-700">
            Graphura India Private Limited
          </span>
          <h1 className="text-4xl font-bold font-serif tracking-normal text-zinc-900 md:text-5xl">
            Register Your Salon
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-zinc-500 font-sans">
            Submit your salon profile for admin approval. Customers can discover and book only after approval.
          </p>
        </header>

        <form onSubmit={handleSubmit} className="card p-6 backdrop-blur-xl md:p-10">
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
              <button type="button" onClick={handleGeoTag} className={`h-14 rounded-2xl border px-6 text-xs font-bold uppercase tracking-wider transition-all duration-200 shadow-sm ${form.latitude ? "border-green-200 bg-green-50 text-green-700 shadow-none" : "border-amber-600 bg-white text-amber-700 hover:bg-amber-600 hover:text-white hover:shadow-md"}`}>
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
                <img key={index} src={image} alt={`Salon upload ${index + 1}`} className="aspect-square rounded-2xl border border-zinc-200 object-cover" />
              ))}
            </div>
          )}

          {error && <p className="mt-5 rounded-xl bg-red-50 border border-red-100 p-3 text-center text-xs font-bold text-red-700">{error}</p>}
          {message && <p className="mt-5 rounded-xl bg-green-50 border border-green-100 p-3 text-center text-xs font-bold text-green-700">{message}</p>}

          <button disabled={loading} className="mt-8 w-full rounded-2xl bg-amber-600 py-5 text-xs font-bold uppercase tracking-wider text-white shadow-lg transition-all duration-200 hover:bg-amber-700 hover:shadow-xl disabled:opacity-60">
            {loading ? "Submitting..." : "Submit for Approval"}
          </button>
        </form>
      </div>
    </div>
    <Footer />
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label className="block space-y-2">
      <span className="ml-1 text-[10px] font-bold uppercase tracking-wider text-zinc-500">{label}</span>
      {children}
    </label>
  );
}
