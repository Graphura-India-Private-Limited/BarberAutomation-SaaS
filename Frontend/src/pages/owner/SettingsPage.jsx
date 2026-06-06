import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AppContext";
import { Scissors } from "lucide-react";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export default function SettingsPage() {
  const { currentUser } = useAuth();
  const [salon, setSalon] = useState(null);
  const [salaryModel, setSalaryModel] = useState("commission");
  const [commissionPercent, setCommissionPercent] = useState("10");
  const [barbers, setBarbers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const salonId = localStorage.getItem("salonId");
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role") || currentUser?.role;

  const headers = () => ({
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`
  });

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
        setTimeout(() => setSaved(false), 3000);
      } else {
        setError(data.message || "Failed to save settings");
      }
    } catch (err) {
      setError("Network error saving settings");
    }
  };

  // ── NON-OWNER ACCESS RESTRICTION BANNER ──
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
                <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 block mb-2">COMMISSION PERCENT (%)</label>
                <div className="flex border border-zinc-200 rounded-xl overflow-hidden bg-white hover:border-[#C5A059]/50 focus-within:border-[#C5A059] transition">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    placeholder="15"
                    value={commissionPercent}
                    onChange={e => setCommissionPercent(e.target.value)}
                    className="w-full bg-white px-4 py-3.5 text-sm font-semibold text-zinc-800 outline-none"
                  />
                  <span className="flex items-center px-4 bg-zinc-50 border-l border-zinc-200 text-zinc-400 font-bold select-none">%</span>
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