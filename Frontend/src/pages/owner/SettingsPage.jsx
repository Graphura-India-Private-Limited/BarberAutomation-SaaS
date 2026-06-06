import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { Settings, Scissors, Users, Award, Shield, CheckCircle, Percent, DollarSign } from "lucide-react";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const CHARCOAL = "#3E362E";
const GOLD = "#C5A059";

export default function SettingsPage() {
  const { salon, loadProfile, token } = useOutletContext();
  const [barbers, setBarbers] = useState([]);
  const [loadingBarbers, setLoadingBarbers] = useState(true);
  const [settings, setSettings] = useState({
    salary_model: "commission",
    commission_percent: 10
  });
  const [saved, setSaved] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (salon) {
      setSettings({
        salary_model: salon.salary_model || "commission",
        commission_percent: salon.commission_percent || 10
      });
      fetchBarbers();
    }
  }, [salon]);

  const fetchBarbers = async () => {
    setLoadingBarbers(true);
    try {
      const res = await fetch(`${API}/barber/salon/${salon._id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setBarbers(data.barbers || []);
      }
    } catch (err) {
      console.error("Failed to load barbers", err);
    } finally {
      setLoadingBarbers(false);
    }
  };

  const handleSaveSettings = async () => {
    setBusy(true);
    setError("");
    setSaved(false);
    try {
      const res = await fetch(`${API}/auth/owner/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          ...salon,
          salary_model: settings.salary_model,
          commission_percent: settings.commission_percent
        })
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message || "Failed to save settings");
      
      await loadProfile(); // Refresh context
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setError(err.message || "Error saving settings");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto text-left font-sans animate-fade-in">
      <header className="mb-8 border-b pb-6 border-stone-200">
        <p className="text-[#C5A059] font-sans font-bold tracking-[2px] text-xs uppercase mb-1">
          Salon Preferences
        </p>
        <h2 className="font-serif text-3xl sm:text-4xl tracking-normal text-stone-900 flex items-center justify-start gap-2 whitespace-nowrap">
          <span className="font-bold uppercase">Salon</span>
          <span className="italic text-[#C5A059] normal-case font-medium">Settings</span>
        </h2>
        <p className="text-sm text-stone-600 font-sans mt-2">Manage salon-wide salary models, barber rules, and payroll configurations.</p>
      </header>

      {error && <p className="mb-6 rounded-xl bg-red-50 border border-red-200 p-4 text-center text-xs font-bold text-red-600 font-sans">{error}</p>}

      {/* ── SALARY MODEL CONFIGURATION ── */}
      <section className="card p-6 mb-6 bg-white shadow-sm">
        <h3 className="font-serif text-xl text-stone-900 mb-2 flex items-center gap-2">
          <DollarSign size={18} className="text-[#C5A059]" />
          <span>Compensation & Commission Model</span>
        </h3>
        <p className="text-sm text-stone-500 font-sans mb-6 leading-relaxed">
          Configure how barbers are paid. You can switch between a standard commission percentage or a fixed salary base.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="text-[11px] font-extrabold uppercase tracking-widest text-[#C5A059] block mb-2">Payout Architecture</label>
            <select
              value={settings.salary_model}
              onChange={e => setSettings({ ...settings, salary_model: e.target.value })}
              className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-sm font-semibold text-stone-800 outline-none hover:border-[#C5A059] focus:border-[#C5A059] transition cursor-pointer"
            >
              <option value="commission">Commission Percentage Split</option>
              <option value="salary">Fixed Base Payouts</option>
            </select>
          </div>
          
          {settings.salary_model === "commission" && (
            <div>
              <label className="text-[11px] font-extrabold uppercase tracking-widest text-[#C5A059] block mb-2">Commission Percent (%)</label>
              <div className="relative">
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={settings.commission_percent}
                  onChange={e => setSettings({ ...settings, commission_percent: Math.min(100, Math.max(1, Number(e.target.value) || 10)) })}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl pl-4 pr-10 py-3 text-sm font-semibold text-stone-800 outline-none hover:border-[#C5A059] focus:border-[#C5A059] transition"
                />
                <Percent size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400" />
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center gap-4 pt-4 border-t border-stone-50">
          <button
            onClick={handleSaveSettings}
            disabled={busy}
            className="px-6 py-3.5 rounded-xl text-white font-extrabold text-xs uppercase tracking-wider shadow-md hover:opacity-95 transition-all cursor-pointer font-sans border-none"
            style={{ background: CHARCOAL }}
          >
            {busy ? "Saving Configuration..." : "Save Preferences"}
          </button>
          {saved && <span className="text-emerald-700 text-sm font-bold flex items-center gap-1"><CheckCircle size={15} /> Saved successfully!</span>}
        </div>
      </section>

      {/* ── ACTIVE BARBERS REFERENCE ── */}
      <section className="card p-6 bg-white shadow-sm mb-6">
        <h3 className="font-serif text-xl text-stone-900 mb-2 flex items-center gap-2">
          <Users size={18} className="text-[#C5A059]" />
          <span>Active Stylist Access List</span>
        </h3>
        <p className="text-sm text-stone-500 font-sans mb-5 leading-relaxed">
          Stylists have limited workspace clearances. You can monitor and add barbers in the <span className="text-[#C5A059] font-bold">Barber Team</span> tab.
        </p>

        {loadingBarbers ? (
          <p className="text-stone-400 text-xs animate-pulse">Syncing shifts...</p>
        ) : (
          <div className="space-y-3">
            {barbers.map(barber => (
              <div key={barber._id} className="flex items-center justify-between p-3.5 bg-stone-50/50 border border-stone-100 rounded-xl">
                <div>
                  <p className="font-bold text-stone-900 text-sm">{barber.name}</p>
                  <p className="text-xs text-stone-400 font-sans mt-0.5">{barber.specialization}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                    barber.status === "available" ? "bg-emerald-50 border-emerald-200 text-emerald-700" : "bg-stone-100 border-stone-200 text-stone-500"
                  }`}>
                    {barber.status}
                  </span>
                  <span className="text-xs font-bold text-stone-500 font-mono">Exp: {barber.experience} Yrs</span>
                </div>
              </div>
            ))}
            {barbers.length === 0 && (
              <p className="text-center py-6 text-stone-400 italic text-sm">No active team members registered.</p>
            )}
          </div>
        )}
      </section>

      <div className="bg-amber-50/50 border border-amber-200/50 rounded-2xl p-5 text-sm text-stone-700">
        <div className="flex gap-2">
          <Shield size={16} className="text-[#C5A059] shrink-0 mt-0.5" />
          <div>
            <strong className="text-stone-900 font-bold">Workspace Access Rules:</strong>
            <ul className="mt-2 space-y-1.5 list-disc list-inside text-stone-600 font-sans">
              <li>General statistics are strictly isolated for security. Barbers cannot see other barbers' earnings or overall salon revenue metrics.</li>
              <li>Base pricing changes will apply immediately to new check-ins and booking estimates.</li>
              <li>Only approved owners have access to the Payment Gateway and financial configurations.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}