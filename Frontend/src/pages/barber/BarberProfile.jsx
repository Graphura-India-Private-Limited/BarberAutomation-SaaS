import React, { useState } from "react";
import { User, ShieldCheck, Briefcase, Phone, Award, Save, Menu, Bell } from "lucide-react";

const ProfileField = ({ label, value, icon: Icon }) => (
  <div className="flex items-center gap-4 p-5 rounded-2xl bg-[#3E362E]/5 border border-stone-200/60 shadow-3xs text-left">
    <div className="w-10 h-10 rounded-xl bg-[#3E362E] flex items-center justify-center text-[#C5A059] shrink-0">
      <Icon size={18} className="stroke-[2.5px]" />
    </div>
    <div className="min-w-0 flex-1">
      <label className="block text-[11px] font-extrabold uppercase tracking-widest text-[#C5A059] leading-none mb-1.5 font-sans">{label}</label>
      <p className="text-sm font-extrabold text-stone-900 truncate leading-tight font-sans">{value}</p>
      <span className="inline-flex items-center gap-1 text-[9px] text-stone-400 font-black uppercase tracking-widest mt-1 font-sans">
        <ShieldCheck size={10} className="text-stone-400 stroke-[2.5px]" /> Locked by Management
      </span>
    </div>
  </div>
);

function BarberProfile() {
  const [profile, setProfile] = useState({
    name: "Arjun Sharma",
    mobile: "9876543210",
    assignedSalon: "Elite Cuts & Spa - Downtown",
    experience: 5,
    specialization: "Haircut & Beard",
  });

  const [loading, setLoading] = useState(false);
  
  // Header States
  const [sideOpen, setSideOpen] = useState(false);
  const salonInfo = { salonName: "Master Barber Lounge", initials: "AS" };

  // ── ✅ INITIALIZATION HOOK: HYDRATE FROM LOCALSTORAGE FALLBACK OR SERVER ROUTES ──
  useEffect(() => {
    const fetchProfileMetrics = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${API}/auth/barber/profile`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        });
        const data = await response.json();
        
        // 1. Try Loading from Database Metrics First
        if (data.success && data.barber) {
          // If server is active but has dummy mock properties, double-check local storage state caches
          const cachedExperience = localStorage.getItem("barber_experience_cache");
          const cachedMobile = localStorage.getItem("barber_mobile_cache");
          const cachedSpec = localStorage.getItem("barber_specialization_cache");

          setProfile({
            name: data.barber.name || "Arjun Sharma",
            mobile: cachedMobile || data.barber.mobile_number || "9876543210",
            assignedSalon: data.barber.salon_id?.salon_name || "Elite Cuts & Spa - Downtown",
            experience: cachedExperience ? Number(cachedExperience) : (data.barber.experience_years || 5), 
            specialization: cachedSpec || data.barber.specialization || "Haircut & Beard",
          });
        }
      } catch (err) {
        console.warn("API Offline, fallback to local storage cache state synchronization strategy.");
        
        // 2. Offline Fallback Pipeline Strategy
        const cachedExperience = localStorage.getItem("barber_experience_cache");
        const cachedMobile = localStorage.getItem("barber_mobile_cache");
        const cachedSpec = localStorage.getItem("barber_specialization_cache");

        setProfile((prev) => ({
          ...prev,
          mobile: cachedMobile || prev.mobile,
          experience: cachedExperience ? Number(cachedExperience) : prev.experience,
          specialization: cachedSpec || prev.specialization
        }));
      } finally {
        setLoading(false);
      }
    };

    fetchProfileMetrics();
  }, []);

  // ── ✅ SAVE HANDLER: COMMIT SYNC TO DATABASE AND LOCALSTORAGE SIMULTANEOUSLY ──
  const handleSave = async (e) => {
    e.preventDefault();
    if (profile.mobile.length !== 10) return;
    
    setSaving(true);

    // 🌟 LOCAL STORAGE STATE SNAPSHOT CACHE LOCK
    localStorage.setItem("barber_experience_cache", profile.experience);
    localStorage.setItem("barber_mobile_cache", profile.mobile);
    localStorage.setItem("barber_specialization_cache", profile.specialization);

    try {
      const response = await fetch(`${API}/auth/barber/update-profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          mobile_number: profile.mobile,
          experience_years: Number(profile.experience), 
          specialization: profile.specialization,
        }),
      });

      const data = await response.json();
      if (data.success) {
        alert("Professional profile details synchronized successfully!");
      } else {
        // If the server route responded but code logic failed, fallback still shields the client UI state
        alert("Local cache locked! Note: Server dropped remote state save request updates.");
      }
    } catch (err) {
      console.error("Network payload submission error:", err);
      alert("Profile data cached locally on this machine! (Server transmission channel offline)");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF6F0] text-stone-800 font-sans antialiased flex flex-col">
      
      {/* हेडर सेक्शन */}
      <header className="sticky top-0 z-50 w-full px-4 md:px-8 py-4 bg-[#1A1A1A] border-b border-[#D4AF37]/20 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button className="md:hidden p-2 text-zinc-400" onClick={() => setSideOpen(!sideOpen)}>
            <Menu className="w-5 h-5" />
          </button>
          <div className="text-left">
            <h1 className="text-white font-bold text-xl font-serif">Profile</h1>
            <p className="text-[10px] text-zinc-500 uppercase tracking-widest">{salonInfo.salonName}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="p-2 text-zinc-400 bg-white/5 rounded-lg border border-white/10"><Bell className="w-4 h-4" /></button>
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#F5C842] to-[#E8A020] flex items-center justify-center text-xs font-bold text-black">
            {salonInfo.initials}
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto w-full px-6 py-10 flex-1">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* 👤 LEFT BIOMETRIC COLUMN */}
          <div className="md:col-span-1 space-y-6">
            <div className="relative rounded-[2.5rem] bg-white border border-stone-200/60 p-6 shadow-sm flex flex-col items-center justify-center overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-24 bg-[#3E362E]" />
              
              <div className="w-24 h-24 rounded-3xl bg-[#FAF6F0] border-4 border-white flex items-center justify-center shadow-md relative z-10 mt-6">
                <span className="text-3xl font-black text-[#A37B58] tracking-wider">{salonInfo.initials}</span>
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
              <ProfileField label="Assigned Workspace Location" value={profile.assignedSalon} icon={Briefcase} />
            </div>
          </div>
          
          {/* 📑 RIGHT OPERATIONS COLUMN */}
          <div className="md:col-span-2 bg-white border border-stone-200/60 rounded-[2.5rem] p-6 md:p-8 shadow-sm text-left flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2.5 mb-8 border-b border-stone-50 pb-4">
                <Award className="text-[#C5A059]" size={20} />
                <h2 className="font-serif text-xl sm:text-2xl tracking-normal text-stone-900 flex items-center justify-start gap-2 whitespace-nowrap">
                  <span className="font-bold uppercase">Professional</span>
                  <span className="italic text-[#C5A059] normal-case font-medium">Stats</span>
                </h2>
              </div>

              <form onSubmit={handleSave} className="space-y-6">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-extrabold uppercase tracking-widest text-[#C5A059] pl-0.5 flex items-center gap-1 font-sans">
                    <Phone size={10} className="text-[#C5A059]" /> Contact Mobile Number
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A37B58] font-black text-sm">+91</span>
                    <input 
                      type="tel" 
                      value={profile.mobile}
                      required
                      placeholder="Enter 10-digit primary contact"
                      onInput={(e) => e.target.value = e.target.value.replace(/[^0-9]/g, '').slice(0, 10)}
                      onChange={(e) => setProfile({...profile, mobile: e.target.value})}
                      className="w-full pl-14 pr-4 py-3.5 bg-[#FAF6F0]/40 border border-stone-200 rounded-xl text-stone-900 font-semibold outline-none focus:border-stone-900 text-sm transition-all shadow-3xs" 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-stone-400 pl-0.5">Experience Track (Years)</label>
                    <div className="flex items-center bg-[#FAF6F0]/40 border border-stone-200 rounded-xl overflow-hidden focus-within:border-stone-900 transition-all h-[46px]">
                      <button type="button" onClick={() => profile.experience > 0 && setProfile({...profile, experience: profile.experience - 1})} className="h-full px-4 text-[#A37B58] hover:bg-stone-100 font-black text-lg w-12 transition-colors cursor-pointer">−</button>
                      <input type="text" readOnly value={`${profile.experience} Years`} className="w-full bg-transparent text-center outline-none text-sm font-extrabold text-stone-900 pointer-events-none" />
                      <button type="button" onClick={() => setProfile({...profile, experience: profile.experience + 1})} className="h-full px-4 text-[#A37B58] hover:bg-stone-100 font-black text-lg w-12 transition-colors cursor-pointer">+</button>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-stone-400 pl-0.5">Expert Domain Specialization</label>
                    <select 
                      value={profile.specialization}
                      onChange={(e) => setProfile({...profile, specialization: e.target.value})}
                      className="w-full bg-[#FAF6F0]/40 border border-stone-200 px-4 py-3 text-sm text-stone-900 font-extrabold outline-none focus:border-stone-900 rounded-xl h-[46px] cursor-pointer"
                    >
                      <option value="Haircut & Beard">Haircut & Beard Styling</option>
                      <option value="Skin Fade Expert">Skin Fade Specialist</option>
                      <option value="Complete Grooming">Premium Executive Grooming</option>
                    </select>
                  </div>
                </div>

                <div className="pt-4 border-t border-stone-100 font-sans">
                  <button 
                    type="submit"
                    disabled={loading || profile.mobile.length !== 10}
                    className="w-full flex items-center justify-center gap-2 bg-[#3E362E] hover:bg-[#2A241F] text-[#C5A059] font-black py-4 rounded-xl tracking-widest uppercase text-xs transition-all shadow-md cursor-pointer disabled:opacity-40"
                  >
                    <Save size={14} className="stroke-[2.5px]" />
                    <span>{loading ? "Saving Credentials..." : "Save Profile Details"}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default BarberProfile; 