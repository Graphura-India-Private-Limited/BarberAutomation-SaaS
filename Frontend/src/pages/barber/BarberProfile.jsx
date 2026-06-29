import React, { useState, useEffect } from "react";
import { User, ShieldCheck, Briefcase, Phone, Award, Save, X } from "lucide-react";
import CustomSelect from "../../components/common/CustomSelect";

const API      = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const CHARCOAL = "#3E362E";
const GOLD     = "#C5A059";

const ProfileField = ({ label, value, icon: Icon }) => (
  <div className="flex items-center gap-4 p-5 rounded-2xl bg-[#3E362E]/5 border border-stone-200/60 shadow-3xs text-left">
    <div className="w-10 h-10 rounded-xl bg-[#3E362E] flex items-center justify-center text-[#C5A059] shrink-0">
      <Icon size={18} className="stroke-[2.5px]" />
    </div>
    <div className="min-w-0 flex-1">
      <label className="block text-[11px] font-extrabold uppercase tracking-widest text-[#C5A059] leading-none mb-1.5 font-sans">
        {label}
      </label>
      <p className="text-sm font-extrabold text-stone-900 truncate leading-tight font-sans">{value}</p>
      <span className="inline-flex items-center gap-1 text-[9px] text-stone-400 font-black uppercase tracking-widest mt-1 font-sans">
        <ShieldCheck size={10} className="text-stone-400 stroke-[2.5px]" /> Locked by Management
      </span>
    </div>
  </div>
);

function BarberProfile() {
  const isBarber = localStorage.getItem("role") === "barber";
  const [profile, setProfile] = useState({
    name:          "Arjun Sharma",
    mobile:        "9876543210",
    assignedSalon: "Elite Cuts & Spa - Downtown",
    experience:    5,
    specialization:"Haircut & Beard",
  });

  const [loading,  setLoading]  = useState(true);
  const [saving,   setSaving]   = useState(false);
  const [toast,    setToast]    = useState(null);

  const triggerToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const salonInfo = { salonName: "Master Barber Lounge", initials: "AS" };

  /* ── Fetch profile on mount ── */
  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const res  = await fetch(`${API}/auth/barber/profile`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        const data = await res.json();
        if (data.success && data.barber) {
          setProfile({
            name:          data.barber.name            || "Arjun Sharma",
            mobile:        data.barber.mobile_number   || "9876543210",
            assignedSalon: data.barber.salon_id?.salon_name || "Elite Cuts & Spa - Downtown",
            experience:    data.barber.experience_years || 5,
            specialization:data.barber.specialization  || "Haircut & Beard",
          });
        }
      } catch (err) {
        console.error("Failed to fetch barber profile:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  /* ── Save handler ── */
  const handleSave = async (e) => {
    e.preventDefault();
    if (profile.mobile.length !== 10) return;
    setSaving(true);
    try {
      const res  = await fetch(`${API}/auth/barber/update-profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          mobile_number:    profile.mobile,
          experience_years: Number(profile.experience),
          specialization:   profile.specialization,
        }),
      });
      const data = await res.json();
      if (data.success) {
        triggerToast("Profile saved successfully!", "success");
      } else {
        triggerToast(data.message || "Failed to save profile.", "error");
      }
    } catch (err) {
      console.error("Save error:", err);
      triggerToast("Network error. Make sure the backend is running.", "error");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={{ background: "#FAF6F0" }} className="min-h-screen flex items-center justify-center font-sans">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center animate-pulse">
            <User className="w-6 h-6 text-amber-600" />
          </div>
          <p className="text-stone-600 text-sm font-normal leading-relaxed font-sans">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full text-stone-800 font-sans antialiased flex flex-col">

      {/* ── Main ── */}
      <main className="max-w-5xl mx-auto w-full px-6 py-10 flex-1">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          {/* LEFT — Barber identity card */}
          <div className="md:col-span-1 space-y-6">
            <div className="relative rounded-[2.5rem] bg-white border border-stone-200/60 p-6 shadow-sm flex flex-col items-center justify-center overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-24 bg-[#3E362E]" />
              <div className="w-24 h-24 rounded-3xl bg-[#FAF6F0] border-4 border-white flex items-center justify-center shadow-md relative z-10 mt-6">
                <span className="text-3xl font-black text-[#A37B58] tracking-wider font-sans">
                  {salonInfo.initials}
                </span>
              </div>
              <div className="text-center mt-4 relative z-10 w-full">
                <h3 className="text-xl font-extrabold text-stone-900 tracking-tight font-sans">{profile.name}</h3>
                <p className="text-[11px] font-extrabold uppercase tracking-widest text-[#C5A059] mt-1 font-sans">Master Barber</p>
                <div className="mt-4 inline-flex items-center gap-1.5 px-3 py-1 bg-stone-50 border border-stone-200 text-stone-400 rounded-lg text-[9px] font-black uppercase tracking-wider font-sans">
                  Member since Oct 2024
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <ProfileField label="Assigned Workspace" value={profile.assignedSalon} icon={Briefcase} />
            </div>
          </div>

          {/* RIGHT — Edit form */}
          <div className="md:col-span-2 bg-white border border-stone-200/60 rounded-[2.5rem] p-6 md:p-8 shadow-sm text-left flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2.5 mb-8 border-b border-stone-50 pb-4">
                <Award className="text-[#C5A059]" size={20} />
                <h2 className="font-serif text-xl sm:text-2xl tracking-normal text-stone-900 flex items-center gap-2">
                  <span className="font-bold uppercase">Professional</span>
                  <span className="italic text-[#C5A059] normal-case font-medium">Stats</span>
                </h2>
              </div>

              <form onSubmit={handleSave} className="space-y-6 font-sans">

                {/* Mobile */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-extrabold uppercase tracking-widest text-[#C5A059] pl-0.5 flex items-center gap-1 font-sans">
                    <Phone size={10} className="text-[#C5A059]" /> Contact Mobile Number <span className="text-red-500 font-bold">*</span>
                  </label>
                  <div className="relative font-sans">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#C5A059] font-black text-sm font-sans">+91</span>
                    <input
                      type="tel"
                      value={profile.mobile}
                      required
                      placeholder="Enter 10-digit primary contact"
                      onInput={e => (e.target.value = e.target.value.replace(/\D/g, "").slice(0, 10))}
                      onChange={e => setProfile({ ...profile, mobile: e.target.value })}
                      className="w-full pl-14 pr-4 py-3.5 bg-[#FAF6F0]/40 border border-stone-200 rounded-xl text-stone-900 font-semibold outline-none focus:border-stone-900 text-sm transition-all shadow-3xs font-sans"
                    />
                  </div>
                </div>

                {/* Experience + Specialization */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 font-sans">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-extrabold uppercase tracking-widest text-[#C5A059] pl-0.5 font-sans">
                      Experience (Years)
                    </label>
                    <div className="flex items-center bg-[#FAF6F0]/40 border border-stone-200 rounded-xl overflow-hidden focus-within:border-stone-900 transition-all h-[46px] font-sans">
                      <button type="button"
                        disabled={isBarber}
                        onClick={() => !isBarber && profile.experience > 0 && setProfile({ ...profile, experience: profile.experience - 1 })}
                        className={`h-full px-4 text-[#A37B58] font-black text-lg w-12 transition-colors outline-none bg-transparent select-none ${isBarber ? 'opacity-30 cursor-not-allowed' : 'hover:bg-stone-100 cursor-pointer'}`}>
                        −
                      </button>
                      <input type="text" readOnly value={`${profile.experience} Years`}
                        className="w-full bg-transparent text-center outline-none text-sm font-extrabold text-stone-900 pointer-events-none font-sans" />
                      <button type="button"
                        disabled={isBarber}
                        onClick={() => !isBarber && setProfile({ ...profile, experience: profile.experience + 1 })}
                        className={`h-full px-4 text-[#A37B58] font-black text-lg w-12 transition-colors outline-none bg-transparent select-none ${isBarber ? 'opacity-30 cursor-not-allowed' : 'hover:bg-stone-100 cursor-pointer'}`}>
                        +
                      </button>
                    </div>
                    {isBarber && (
                      <span className="inline-flex items-center gap-1 text-[9px] text-stone-400 font-black uppercase tracking-widest mt-1 font-sans">
                        <ShieldCheck size={10} className="text-stone-400 stroke-[2.5px]" /> Locked by Management
                      </span>
                    )}
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-extrabold uppercase tracking-widest text-[#C5A059] pl-0.5 font-sans">
                      Specialization
                    </label>
                    <CustomSelect
                      disabled={isBarber}
                      value={profile.specialization}
                      onChange={val => setProfile({ ...profile, specialization: val })}
                      options={[
                        { value: "Haircut & Beard", label: "Haircut & Beard Styling" },
                        { value: "Skin Fade Expert", label: "Skin Fade Specialist" },
                        { value: "Complete Grooming", label: "Premium Executive Grooming" }
                      ]}
                      className="!bg-[#FAF6F0]/40 !border-stone-200 !text-stone-900 font-extrabold !h-[46px]"
                    />
                    {isBarber && (
                      <span className="inline-flex items-center gap-1 text-[9px] text-stone-400 font-black uppercase tracking-widest mt-1 font-sans">
                        <ShieldCheck size={10} className="text-stone-400 stroke-[2.5px]" /> Locked by Management
                      </span>
                    )}
                  </div>
                </div>

                {/* Save button */}
                <div className="pt-4 border-t border-stone-100 font-sans">
                  <button
                    type="submit"
                    disabled={saving || profile.mobile.length !== 10}
                    className="w-full flex items-center justify-center gap-2 text-white font-extrabold py-4 rounded-xl tracking-wider uppercase text-xs transition-all shadow-md cursor-pointer disabled:opacity-40 font-sans border-none outline-none hover:opacity-95"
                    style={{ background: CHARCOAL }}
                  >
                    <Save size={14} color={GOLD} className="stroke-[2.5px]" />
                    <span>{saving ? "Saving..." : "Save Profile Details"}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>

        </div>
      </main>

      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-5 py-4 rounded-2xl border shadow-xl text-xs font-black uppercase tracking-wider transition-all duration-300 animate-in fade-in slide-in-from-bottom-5 ${
            toast.type === "error"
              ? "bg-[#FFF5F5] text-[#C53030] border-[#FEB2B2]"
              : "bg-[#F0FDF4] text-[#166534] border-[#BBF7D0]"
          }`}
        >
          <span>{toast.msg}</span>
          <button 
            type="button" 
            onClick={() => setToast(null)}
            className="w-5 h-5 rounded-lg flex items-center justify-center border-none bg-transparent hover:bg-black/5 cursor-pointer text-current"
          >
            <X size={12} />
          </button>
        </div>
      )}
    </div>
  );
}

export default BarberProfile;
