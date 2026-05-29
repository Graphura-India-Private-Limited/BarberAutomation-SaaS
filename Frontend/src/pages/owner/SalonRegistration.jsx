import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, MapPin, Upload, AlertTriangle, ShieldCheck } from "lucide-react";
import shopImage from "../../assets/shop.jpg";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const GOLD = "#C5A059";
const CHARCOAL = "#3E362E";

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
        setMessage("Location coordinates successfully linked.");
      },
      () => setError("Location permission denied. Please allow location access in your browser.")
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
      setError("Please geo-tag your studio location coordinates before submission.");
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
      
      setMessage("Submitted successfully. Your status is now Pending Admin Approval.");
      setTimeout(() => navigate("/owner/dashboard"), 1200);
    } catch (err) {
      setError(err.message || "Server linkage failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full bg-white border border-[#EADBCE] rounded-2xl p-4 outline-none text-[#3E362E] placeholder-stone-400 focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059] transition-all text-sm font-bold shadow-3xs";

  return (
    <div
      className="relative min-h-screen bg-cover bg-center bg-fixed p-4 sm:p-6 font-sans text-stone-800 flex flex-col items-center"
      style={{ backgroundImage: `url(${shopImage})` }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap');
        body, .font-sans {
          font-family: 'Plus Jakarta Sans', sans-serif !important;
        }
        .font-serif {
          font-family: 'Playfair Display', serif !important;
        }
        .card-premium { 
          background: rgba(250, 246, 240, 0.92); 
          backdrop-filter: blur(16px);
          border: 1px solid #EADBCE; 
          border-radius: 2.5rem; 
          box-shadow: 0 25px 50px -12px rgba(44, 24, 16, 0.15);
        }
      `}</style>

      {/* Background Mask Overlay */}
      <div className="absolute inset-0 bg-[#FAF6F0]/85 backdrop-blur-xs" />

      <div className="relative z-10 w-full max-w-5xl py-6 flex-grow flex flex-col">
        
        {/* ── TOP ACTION NAVIGATION BAR (No Header Component) ── */}
        <div className="w-full flex justify-start mb-8">
          <button 
            type="button"
            onClick={() => navigate("/")} 
            className="flex items-center gap-2 text-xs font-black tracking-widest uppercase transition-all duration-300 hover:opacity-80 group text-[#3E362E] bg-white/90 backdrop-blur-md px-4 py-2.5 rounded-full border border-[#EADBCE] shadow-md cursor-pointer select-none"
          >
            <ArrowLeft size={14} className="transition-transform group-hover:-translate-x-1 text-[#C5A059]" />
            <span>Cancel</span>
          </button>
        </div>

        {/* Form Identity Title */}
        <div className="text-center mb-10">
          <span className="mb-2 block text-[10px] font-black uppercase tracking-[0.3em] text-[#A37B58]">
            Graphura India Private Limited
          </span>
          <h1 className="text-4xl font-black font-serif tracking-tight text-stone-900 md:text-5xl">
            Register Your Salon
          </h1>
          <div className="w-12 h-[1.5px] bg-[#C5A059] mx-auto mt-4 mb-3" />
          <p className="mx-auto max-w-2xl text-xs sm:text-sm font-medium tracking-wide text-stone-500 font-sans">
            Submit your salon profile setup for system validation. Customers can discover and book slots only after approval sequence completion.
          </p>
        </div>

        {/* Main Application Data Form Card */}
        <form onSubmit={handleSubmit} className="card-premium p-6 sm:p-10 space-y-6 text-left">
          
          <div className="grid gap-5 md:grid-cols-2">
            <Field label="Salon Name *">
              <input required minLength={3} placeholder="e.g. Royal Razor Studio" value={form.salon_name} onChange={e => setField("salon_name", e.target.value)} className={inputClass} />
            </Field>
            
            <Field label="Owner Name *">
              <input required placeholder="e.g. Mayur K." value={form.owner_name} onChange={e => setField("owner_name", e.target.value)} className={inputClass} />
            </Field>
            
            <Field label="Mobile Number *">
              <input required maxLength={10} placeholder="e.g. 9876543210" value={form.mobile} onChange={e => setField("mobile", e.target.value.replace(/\D/g, "").slice(0, 10))} className={inputClass} />
            </Field>
            
            <Field label="Email Address">
              <input type="email" placeholder="e.g. contact@studio.com" value={form.email} onChange={e => setField("email", e.target.value)} className={inputClass} />
            </Field>
            
            <Field label="Security Password *">
              <input required type="password" minLength={6} placeholder="Minimum 6 characters" value={form.password} onChange={e => setField("password", e.target.value)} className={inputClass} />
            </Field>
            
            <Field label="Customer Support Number *">
              <input required maxLength={10} placeholder="e.g. 9123456789" value={form.support_number} onChange={e => setField("support_number", e.target.value.replace(/\D/g, "").slice(0, 10))} className={inputClass} />
            </Field>
            
            <Field label="Opening Hours">
              <input type="time" value={form.opening_time} onChange={e => setField("opening_time", e.target.value)} className={inputClass} />
            </Field>
            
            <Field label="Closing Hours">
              <input type="time" value={form.closing_time} onChange={e => setField("closing_time", e.target.value)} className={inputClass} />
            </Field>
            
            <Field label="Services Offered * (Comma Separated)">
              <input required placeholder="e.g. Haircut, Beard Trim, Hair Color, Facial" value={form.services_offered} onChange={e => setField("services_offered", e.target.value)} className={inputClass} />
            </Field>
            
            <Field label="Basic Haircut Price * (₹)">
              <input required type="number" min="1" placeholder="₹ 150" value={form.basic_pricing} onChange={e => setField("basic_pricing", e.target.value)} className={inputClass} />
            </Field>
            
            <Field label="Total Active Chairs / Barbers *">
              <input required type="number" min="1" placeholder="e.g. 3" value={form.number_of_barbers} onChange={e => setField("number_of_barbers", e.target.value)} className={inputClass} />
            </Field>
            
            {/* Styled File Upload Zone Component */}
            <Field label="Shop Gallery Images (Max 5)">
              <div className="relative w-full h-[50px]">
                <input type="file" id="gallery-uploads" accept="image/*" multiple onChange={handleImages} className="absolute inset-0 opacity-0 z-20 cursor-pointer w-full h-full" />
                <label htmlFor="gallery-uploads" className="absolute inset-0 bg-white border border-[#EADBCE] rounded-2xl px-4 flex items-center justify-between text-stone-400 text-sm font-bold shadow-3xs z-10 hover:border-[#C5A059] transition-colors">
                  <span className="text-stone-500 text-xs font-semibold">{form.images.length > 0 ? `${form.images.length} files selected` : "Upload storefront photos..."}</span>
                  <Upload size={14} color={GOLD} />
                </label>
              </div>
            </Field>
          </div>

          {/* Address Block with Geotag Trigger */}
          <div className="grid gap-5 md:grid-cols-[1fr_auto] items-end">
            <Field label="Physical Studio Address *">
              <textarea required minLength={10} placeholder="Complete shop address details..." value={form.address} onChange={e => setField("address", e.target.value)} className={`${inputClass} min-h-24 resize-none`} />
            </Field>
            <div className="pt-2">
              <button 
                type="button" 
                onClick={handleGeoTag} 
                className={`h-24 w-full md:w-auto rounded-2xl border px-6 text-xs font-black uppercase tracking-wider transition-all duration-200 shadow-3xs flex flex-col justify-center items-center gap-2 cursor-pointer ${
                  form.latitude 
                    ? "border-emerald-200 bg-emerald-50/50 text-emerald-800 shadow-none" 
                    : "border-[#C5A059] bg-white text-[#C5A059] hover:bg-[#3E362E] hover:text-white hover:border-[#3E362E]"
                }`}
              >
                <MapPin size={16} />
                <span>{form.latitude ? "Coordinates Tagged" : "Geo-Tag Location"}</span>
              </button>
            </div>
          </div>

          <Field label="About Studio / Bio">
            <textarea placeholder="Describe your shop atmosphere, specialization details..." value={form.about} onChange={e => setField("about", e.target.value)} className={`${inputClass} min-h-24 resize-none`} />
          </Field>

          {/* Uploaded Images Shimmer Stream Grid */}
          {form.images.length > 0 && (
            <div className="grid grid-cols-3 gap-3 md:grid-cols-5 pt-2">
              {form.images.map((image, index) => (
                <img key={index} src={image} alt={`Salon upload ${index + 1}`} className="aspect-square rounded-2xl border border-[#EADBCE] object-cover shadow-3xs animate-in fade-in zoom-in-95" />
              ))}
            </div>
          )}

          {/* Error and Success Dialog Framework boxes */}
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-100 rounded-xl flex items-center gap-2 text-rose-700 text-xs font-bold animate-in fade-in duration-200">
              <AlertTriangle size={14} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}
          {message && (
            <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center gap-2 text-emerald-800 text-xs font-bold animate-in fade-in duration-200">
              <ShieldCheck size={14} className="shrink-0" />
              <span>{message}</span>
            </div>
          )}

         {/* Dispatch Submitter */}
<div className="pt-4">
  <button 
    disabled={loading} 
    className="w-full h-14 md:h-16 rounded-2xl flex items-center justify-center text-xs sm:text-sm font-black uppercase tracking-widest text-white shadow-md transition-all duration-200 hover:opacity-95 disabled:opacity-50 cursor-pointer active:scale-[0.98] hover:shadow-lg"
    style={{ backgroundColor: CHARCOAL }}
  >
    {loading ? "Registering Studio System..." : "Submit Profile for Approval"}
  </button>
</div>
        </form>
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label className="block space-y-1.5">
      <span className="ml-0.5 text-[10px] font-black uppercase tracking-wider text-stone-400">{label}</span>
      {children}
    </label>
  );
}