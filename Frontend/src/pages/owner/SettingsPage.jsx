import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AppContext";
import { Scissors, Edit, MapPin, Image as ImageIcon } from "lucide-react";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const GOLD = "#C5A059";
const CHARCOAL = "#3E362E";

export default function SettingsPage() {
  const { currentUser } = useAuth();
  const [salon, setSalon] = useState(null);
  const [salaryModel, setSalaryModel] = useState("commission");
  const [commissionPercent, setCommissionPercent] = useState("10");
  const [barbers, setBarbers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  // Salon Profile Editing States
  const [editing, setEditing] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [form, setForm] = useState({
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
    about: ""
  });

  const salonId = localStorage.getItem("salonId");
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role") || currentUser?.role;

  const headers = () => ({
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`
  });

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

  const loadSettingsData = async () => {
    if (role !== "owner") {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const profile = await fetch(`${API}/auth/owner/profile`, {
        headers: headers()
      }).then(r => r.json());
      
      if (profile.success) {
        setSalon(profile.salon);
        setSalaryModel(profile.salon.salary_model || "commission");
        setCommissionPercent(String(profile.salon.commission_percent ?? 10));
        syncSalon(profile.salon);
      }
      
      if (salonId) {
        const bs = await fetch(`${API}/barber/salon/${salonId}`, {
          headers: headers()
        }).then(r => r.json());
        if (bs.success) {
          setBarbers(bs.barbers || []);
        }
      }
    } catch (err) {
      setError("Failed to load settings data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSettingsData();
  }, []);

  const setField = (name, value) => {
    setForm(prev => ({ ...prev, [name]: value }));
    setMessage("");
    setError("");
  };

  const handleAddressBlur = async () => {
    if (!form.address || form.address.trim().length < 5) return;
    try {
      setMessage("Looking up coordinates for manual address...");
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(form.address)}`, {
        headers: { "User-Agent": "BarberPro-App/1.0" }
      });
      const data = await res.json();
      if (data && data.length > 0) {
        const newLat = parseFloat(data[0].lat);
        const newLon = parseFloat(data[0].lon);
        setForm(prev => ({
          ...prev,
          latitude: newLat,
          longitude: newLon
        }));
        setMessage("Coordinates updated based on manual address.");
        setError("");
        setTimeout(() => setMessage(""), 3000);
      } else {
        setError("Could not resolve coordinates for manual address. Please check address spelling or tag via GPS.");
        setTimeout(() => setError(""), 4000);
      }
    } catch (err) {
      console.error("Geocoding failed", err);
    }
  };

  const tagLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by this browser.");
      return;
    }
    setError("");
    setMessage("Acquiring GPS fix... please check browser prompt.");
    
    const geoOptions = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0
    };

    navigator.geolocation.getCurrentPosition(
      position => {
        const { latitude, longitude } = position.coords;
        setField("latitude", latitude);
        setField("longitude", longitude);
        setMessage("Coordinates tagged. Fetching physical address details...");
        
        fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`, {
          headers: {
            "User-Agent": "BarberPro-App/1.0"
          }
        })
          .then(res => res.json())
          .then(data => {
            if (data && data.display_name) {
              setField("address", data.display_name);
              setMessage("Location and physical address successfully linked.");
            } else {
              setMessage("Location coordinates successfully linked.");
            }
            setTimeout(() => setMessage(""), 3000);
          })
          .catch(err => {
            console.error("Reverse geocode lookup error:", err);
            setMessage("Location coordinates successfully linked.");
            setTimeout(() => setMessage(""), 3000);
          });
      },
      err => {
        setMessage("");
        if (err.code === 1) {
          setError("Location permission denied! Please allow access in browser URL bar.");
        } else {
          setError("GPS signal timeout. Please try clicking the button again.");
        }
        setTimeout(() => setError(""), 4000);
      },
      geoOptions
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

  const saveProfile = async (resubmit = false) => {
    setBusy(true);
    setError("");
    setMessage("");
    try {
      const payload = {
        ...form,
        services_offered: form.services_offered.split(",").map(s => s.trim()).filter(Boolean),
        basic_pricing: Number(form.basic_pricing) || 0,
        number_of_barbers: Number(form.number_of_barbers) || 0,
      };

      const res = await fetch(`${API}/auth/owner/${resubmit ? "resubmit" : "profile"}`, {
        method: "PUT",
        headers: headers(),
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message || "Update failed");
      const statusChangedToPending = data.salon?.status === "pending" && salon?.status === "approved";
      syncSalon(data.salon);
      setEditing(false);
      if (statusChangedToPending) {
        setMessage("Address changed! Reset to pending verification for admin approval.");
      } else {
        setMessage(resubmit ? "Profile resubmitted for approval." : "Profile details saved successfully.");
      }
      setTimeout(() => setMessage(""), 5000);
    } catch (err) {
      setError(err.message || "Update failed");
    } finally {
      setBusy(false);
    }
  };

  const handleSavePreferences = async (e) => {
    e.preventDefault();
    setError("");
    setSaved(false);
    try {
      const res = await fetch(`${API}/auth/owner/profile`, {
        method: "PUT",
        headers: headers(),
        body: JSON.stringify({
          salary_model: salaryModel,
          commission_percent: Number(commissionPercent) || 0
        })
      });
      const data = await res.json();
      if (data.success) {
        setSaved(true);
        setSalon(data.salon);
        setTimeout(() => setSaved(false), 3000);
      } else {
        setError(data.message || "Failed to save settings");
      }
    } catch (err) {
      setError("Network error saving settings");
    }
  };

  if (role !== "owner") {
    return (
      <div className="p-6 md:p-10 font-sans text-stone-800 text-left min-h-screen" style={{ background: "#FAF6F0" }}>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap');
          .card { 
            background: #FFFFFF; 
            border: 1px solid #EADBCE; 
            border-radius: 24px; 
            box-shadow: 0 4px 20px -2px rgba(28, 25, 23, 0.04), 0 2px 8px -1px rgba(28, 25, 23, 0.02);
          }
        `}</style>
        <div className="max-w-xl mx-auto py-16 text-center">
          <div className="card p-10 bg-white">
            <span className="text-5xl block mb-4">🔒</span>
            <h2 className="text-2xl font-bold text-zinc-900 font-serif mb-2">Owner Only</h2>
            <p className="text-zinc-500 text-sm mt-1 leading-relaxed">
              Only the salon owner can access settings configurations.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div style={{ background: "#FAF6F0" }} className="min-h-screen flex items-center justify-center font-sans">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center animate-pulse">
            <Scissors className="w-6 h-6 text-amber-600" />
          </div>
          <p className="text-stone-600 text-sm font-normal leading-relaxed font-sans">Syncing Salon Settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10 font-sans text-stone-800 text-left min-h-screen" style={{ background: "#FAF6F0" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap');
        :root { 
          --gold: #C5A059;
          --bg: #FAF6F0; 
          --bg2: #FFFFFF; 
          --border: #EADBCE; 
        }
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
          box-shadow: 0 4px 20px -2px rgba(28, 25, 23, 0.03);
          transition: all 0.2s ease;
        }
        .card:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px -4px rgba(28, 25, 23, 0.05);
          border-color: var(--gold);
        }
      `}</style>

      <div className="max-w-4xl mx-auto">
        <p className="text-amber-700 font-sans font-bold tracking-[2px] text-xs sm:text-sm uppercase mb-1">
          SALON PREFERENCES
        </p>
        <h2 className="font-serif text-3xl sm:text-4xl tracking-normal text-stone-900 flex items-center justify-start gap-2 whitespace-nowrap mb-1">
          <span className="font-bold uppercase">SALON</span>
          <span className="italic text-[#C5A059] normal-case font-medium">Settings</span>
        </h2>
        <p className="text-sm text-zinc-500 font-sans mb-8">
          Manage salon-wide salary models, barber rules, and payroll configurations.
        </p>

        {error && (
          <p className="mb-6 rounded-xl bg-red-50 border border-red-200 p-4 text-center text-xs font-bold text-red-600 font-sans">
            {error}
          </p>
        )}
        {message && (
          <p className="mb-6 rounded-xl bg-green-50 border border-green-200 p-4 text-center text-xs font-bold text-green-700 font-sans">
            {message}
          </p>
        )}

        {/* Salon Profile Identity Card (Move from home to settings page) */}
        <div className="card p-6 mb-6 bg-white text-left">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b pb-4 border-stone-100 mb-6">
            <div>
              <h3 className="text-lg font-bold font-serif text-zinc-900 flex items-center gap-2">
                🏛️ Salon Profile Information
              </h3>
              <p className="text-xs text-stone-500 font-sans mt-0.5">
                View and edit your business metadata, address, contact, and gallery details.
              </p>
            </div>
            <button 
              onClick={() => setEditing(prev => !prev)} 
              className="flex items-center gap-2 px-5 py-3 rounded-xl font-extrabold text-xs tracking-wider text-white uppercase shadow-sm transition-all active:scale-95 cursor-pointer font-sans"
              style={{ background: CHARCOAL }}
            >
              <Edit size={14} color="#C5A059" />
              {editing ? "Close Profile Editor" : "Modify Salon Profile"}
            </button>
          </div>

          {editing ? (
            <ProfileEditor 
              form={form} 
              setField={setField} 
              addImages={addImages} 
              tagLocation={tagLocation} 
              saveProfile={saveProfile} 
              busy={busy} 
              canResubmit={salon?.status === "rejected"} 
              handleAddressBlur={handleAddressBlur}
            />
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 text-xs font-medium">
              <Info label="Business Name" value={salon?.salon_name} />
              <Info label="Primary Owner" value={salon?.owner_name} />
              <Info label="Contact Email" value={salon?.email || "No email registered"} />
              <Info label="Support Contact" value={salon?.support_number || "No support number"} />
              <Info label="Opening Hours" value={`${salon?.opening_time || "09:00"} — ${salon?.closing_time || "21:00"}`} />
              <Info label="Base Haircut Pricing" value={salon?.basic_pricing ? `₹${salon.basic_pricing}` : "₹0"} />
              <div className="sm:col-span-2">
                <Info label="Physical Studio Address" value={salon?.address} />
              </div>
              <div className="sm:col-span-2">
                <Info label="About / Bio" value={salon?.about || "No description set"} />
              </div>
              <div className="sm:col-span-2">
                <label className="text-[11px] font-extrabold uppercase tracking-widest text-[#C5A059] block mb-2 font-sans">Storefront Gallery</label>
                <div className="grid grid-cols-5 gap-2">
                  {(salon?.images || []).map((url, i) => (
                    <img key={i} src={url} alt={`Gallery ${i}`} className="aspect-square rounded-xl object-cover border border-[#EADBCE]" />
                  ))}
                  {(salon?.images || []).length === 0 && (
                    <p className="text-stone-400 italic text-[11px] uppercase tracking-wider font-bold">No gallery photos added.</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Compensation & Commission Model Card */}
        <div className="card p-6 mb-6 bg-white">
          <h3 className="text-lg font-bold font-serif text-zinc-900 mb-1 flex items-center gap-2">
            <span className="text-[#C5A059] font-sans font-bold">$</span> Compensation & Commission Model
          </h3>
          <p className="text-sm text-zinc-500 font-sans mb-6 leading-relaxed">
            Configure how barbers are paid. You can switch between a standard commission percentage or a fixed salary base.
          </p>

          <form onSubmit={handleSavePreferences} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 block mb-2">PAYOUT ARCHITECTURE</label>
                <select
                  value={salaryModel}
                  onChange={e => setSalaryModel(e.target.value)}
                  className="w-full bg-white border border-zinc-200 rounded-xl px-4 py-3.5 text-sm font-semibold text-zinc-800 outline-none hover:border-amber-600/50 focus:border-amber-600 transition cursor-pointer"
                >
                  <option value="commission">Commission Percentage Split</option>
                  <option value="salary">Fixed Salary Base</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 block mb-2">
                  {salaryModel === "salary" ? "SALARY BASE (₹)" : "COMMISSION PERCENT (%)"}
                </label>
                <div className="flex border border-zinc-200 rounded-xl overflow-hidden bg-white hover:border-[#C5A059]/50 focus-within:border-[#C5A059] transition">
                  {salaryModel === "salary" && (
                    <span className="flex items-center px-4 bg-zinc-50 border-r border-zinc-200 text-zinc-400 font-bold select-none">₹</span>
                  )}
                  <input
                    type="number"
                    min="0"
                    max={salaryModel === "salary" ? undefined : "100"}
                    placeholder={salaryModel === "salary" ? "e.g. 15000" : "15"}
                    value={commissionPercent}
                    onChange={e => setCommissionPercent(e.target.value)}
                    className="w-full bg-white px-4 py-3.5 text-sm font-semibold text-zinc-800 outline-none"
                  />
                  {salaryModel !== "salary" && (
                    <span className="flex items-center px-4 bg-zinc-50 border-l border-zinc-200 text-zinc-400 font-bold select-none">%</span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 pt-2">
              <button
                type="submit"
                className="bg-[#2E2824] hover:bg-[#3F3630] text-white font-sans text-xs font-bold uppercase tracking-wider px-6 py-3.5 rounded-xl shadow-md transition-all cursor-pointer"
              >
                SAVE PREFERENCES
              </button>
              {saved && <span className="text-emerald-700 text-sm font-bold animate-fade-in">Saved successfully!</span>}
            </div>
          </form>
        </div>

        {/* Active Stylist Access List Card */}
        <div className="card p-6 mb-6 bg-white">
          <h3 className="text-lg font-bold font-serif text-zinc-900 mb-1 flex items-center gap-2">
            🔑 Active Stylist Access List
          </h3>
          <p className="text-sm text-zinc-500 font-sans mb-6 leading-relaxed">
            Stylists have limited workspace clearances. You can monitor and add barbers in the <span className="text-[#C5A059] font-bold">Barber Team</span> tab.
          </p>

          <div className="space-y-4">
            {barbers.map(barber => {
              let badgeClass = "bg-zinc-100 text-zinc-600 border border-zinc-200";
              let statusLabel = barber.status || "offline";
              
              if (barber.status === "available") {
                badgeClass = "bg-emerald-50 text-emerald-700 border border-emerald-200";
                statusLabel = "available";
              } else if (barber.status === "busy") {
                badgeClass = "bg-rose-50 text-rose-700 border border-rose-200";
                statusLabel = "busy";
              } else if (barber.status === "break") {
                badgeClass = "bg-amber-50 text-amber-700 border border-amber-200";
                statusLabel = "break";
              }

              return (
                <div key={barber._id} className="bg-[#FAF6F0]/60 border border-[#EADBCE]/35 rounded-2xl p-4 flex items-center justify-between transition hover:bg-[#FAF6F0]/80">
                  <div className="text-left">
                    <p className="font-bold text-zinc-900 text-sm tracking-tight">{barber.name}</p>
                    <p className="text-xs text-zinc-500 font-sans mt-0.5">{barber.specialization || "Hair Stylist & Grooming Expert"}</p>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <span className={`text-[10px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-full ${badgeClass}`}>
                      {statusLabel}
                    </span>
                    <span className="text-xs text-zinc-500 font-sans font-bold">
                      Exp: {barber.experience || 0} Yrs
                    </span>
                  </div>
                </div>
              );
            })}

            {barbers.length === 0 && (
              <p className="text-center text-xs text-zinc-400 py-4 italic">No active barbers registered to your salon.</p>
            )}
          </div>
        </div>

        {/* Access Rules Segment */}
        <div className="mt-8">
          <div className="bg-[#FAF6F0]/60 border border-[#EADBCE]/50 rounded-2xl p-5 text-sm text-stone-700">
            <strong className="text-zinc-900 font-bold mb-2 block font-serif text-base">Workspace Access Rules:</strong>
            <ul className="mt-2 space-y-2 list-disc list-inside text-stone-600 font-sans leading-relaxed">
              <li>General statistics are strictly isolated for security. Barbers cannot see other barbers' earnings or overall salon revenue metrics.</li>
              <li>Base pricing changes will apply immediately to new check-ins and booking estimates.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div className="border-b last:border-0 pb-2.5 last:pb-0 text-left border-stone-50">
      <label className="text-[11px] font-extrabold uppercase tracking-widest text-[#C5A059] block font-sans">{label}</label>
      <p className="font-bold text-stone-900 mt-0.5 text-sm font-sans">{value || "Value entry missing"}</p>
    </div>
  );
}

function ProfileEditor({ form, setField, addImages, tagLocation, saveProfile, busy, canResubmit, handleAddressBlur }) {
  const inputClass = "w-full rounded-xl border border-[#EADBCE] bg-white p-3 text-sm font-medium outline-none focus:border-[#C5A059] transition-all text-stone-800 placeholder-stone-400 font-sans shadow-3xs";
  return (
    <div className="card p-6 shadow-xs border border-[#EADBCE] bg-white text-left animate-in fade-in duration-200">
      <h2 className="font-serif text-lg tracking-normal text-stone-900 flex items-center justify-start gap-2 whitespace-nowrap mb-5 border-b pb-3 border-stone-100">
        <span className="font-bold uppercase">Edit Workspace</span>
        <span className="italic text-[#C5A059] normal-case font-medium">Profile Details</span>
      </h2>
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 block mb-1">Salon Name</label>
          <input className={inputClass} value={form.salon_name} onChange={e => setField("salon_name", e.target.value)} placeholder="Salon Name" />
        </div>
        <div>
          <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 block mb-1">Owner Name</label>
          <input className={inputClass} value={form.owner_name} onChange={e => setField("owner_name", e.target.value)} placeholder="Owner Full Name" />
        </div>
        <div>
          <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 block mb-1">Email Address</label>
          <input className={inputClass} value={form.email} onChange={e => setField("email", e.target.value)} placeholder="Business Email" />
        </div>
        <div>
          <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 block mb-1">Support Phone</label>
          <input className={inputClass} value={form.support_number} onChange={e => setField("support_number", e.target.value.replace(/\D/g, "").slice(0, 10))} placeholder="10-digit Help Desk line" />
        </div>
        <div>
          <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 block mb-1">Opening Time</label>
          <input type="time" className={inputClass} value={form.opening_time} onChange={e => setField("opening_time", e.target.value)} />
        </div>
        <div>
          <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 block mb-1">Closing Time</label>
          <input type="time" className={inputClass} value={form.closing_time} onChange={e => setField("closing_time", e.target.value)} />
        </div>
        <div>
          <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 block mb-1">Services Offered (comma separated)</label>
          <input className={inputClass} value={form.services_offered} onChange={e => setField("services_offered", e.target.value)} placeholder="Services, comma separated" />
        </div>
        <div>
          <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 block mb-1">Base Haircut Pricing (₹)</label>
          <input type="number" className={inputClass} value={form.basic_pricing} onChange={e => setField("basic_pricing", e.target.value)} placeholder="Base Rate (₹)" />
        </div>
        <div>
          <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 block mb-1">Latitude</label>
          <input type="number" step="any" className={inputClass} value={form.latitude} onChange={e => setField("latitude", parseFloat(e.target.value) || 0)} placeholder="Latitude" />
        </div>
        <div>
          <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 block mb-1">Longitude</label>
          <input type="number" step="any" className={inputClass} value={form.longitude} onChange={e => setField("longitude", parseFloat(e.target.value) || 0)} placeholder="Longitude" />
        </div>
      </div>
      
      <div className="mt-4">
        <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 block mb-1">Physical Address</label>
        <textarea className={`${inputClass} min-h-16 resize-none`} value={form.address} onChange={e => setField("address", e.target.value)} onBlur={handleAddressBlur} placeholder="Physical Destination Address" />
      </div>
      
      <div className="mt-5 flex flex-wrap gap-3 pt-4 border-t border-stone-50">
        <button type="button" onClick={tagLocation} className="rounded-xl border border-[#C5A059] text-[#C5A059] px-5 py-3 text-xs font-extrabold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer font-sans bg-white hover:bg-stone-50 transition"><MapPin size={14} /> Tag GPS Geolocation</button>
        <button type="button" onClick={() => saveProfile(false)} disabled={busy} className="rounded-xl bg-stone-900 text-white px-6 py-3 text-xs font-extrabold uppercase tracking-wider hover:bg-stone-800 disabled:opacity-40 shadow-sm cursor-pointer font-sans transition">Save Staged Changes</button>
        {canResubmit && <button type="button" onClick={() => saveProfile(true)} disabled={busy} className="rounded-xl px-6 py-3 text-xs font-extrabold uppercase tracking-wider text-white shadow-sm cursor-pointer font-sans transition" style={{ background: GOLD }}>Resubmit Request</button>}
      </div>
    </div>
  );
}