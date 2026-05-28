import React, { useState } from "react";
import { User, ShieldCheck, Briefcase, Phone, Award, Save } from "lucide-react";
import Footer from "../../components/layout/Footer";

const ProfileField = ({ label, value, icon: Icon }) => (
  <div className="flex items-center gap-4 p-5 rounded-2xl bg-[#3E362E]/5 border border-stone-200/60 shadow-3xs text-left">
    <div className="w-10 h-10 rounded-xl bg-[#3E362E] flex items-center justify-center text-[#C5A059] shrink-0">
      <Icon size={18} className="stroke-[2.5px]" />
    </div>
    <div className="min-w-0 flex-1">
      <label className="block text-[10px] font-black uppercase tracking-widest text-[#A37B58] leading-none mb-1.5">{label}</label>
      <p className="text-sm font-extrabold text-stone-900 truncate leading-tight">{value}</p>
      <span className="inline-flex items-center gap-1 text-[9px] text-stone-400 font-black uppercase tracking-widest mt-1">
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

  const handleSave = (e) => {
    e.preventDefault();
    setLoading(true);
    // Simulating backend save interaction pipeline
    setTimeout(() => {
      setLoading(false);
      alert("Professional profile details updated successfully!");
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#FAF6F0] text-stone-800 font-sans antialiased flex flex-col overflow-x-hidden">
      
      <main className="max-w-5xl mx-auto w-full px-6 py-10 flex-1">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* 👤 LEFT COLUMN: AVATAR CARD & FIXED ATTRIBUTES */}
          <div className="md:col-span-1 space-y-6">
            <div className="relative rounded-[2.5rem] bg-white border border-stone-200/60 p-6 shadow-sm flex flex-col items-center justify-center overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-24 bg-[#3E362E]" />
              
              <div className="w-24 h-24 rounded-3xl bg-[#FAF6F0] border-4 border-white flex items-center justify-center shadow-md relative z-10 mt-6">
                <span className="text-3xl font-black text-[#A37B58] tracking-wider">AS</span>
              </div>

              <div className="text-center mt-4 relative z-10 w-full">
                <h3 className="text-xl font-extrabold text-stone-900 tracking-tight">{profile.name}</h3>
                <p className="text-[10px] text-[#A37B58] font-black uppercase tracking-widest mt-1">Master Barber</p>
                <div className="mt-4 inline-flex items-center gap-1.5 px-3 py-1 bg-stone-50 border border-stone-200 text-stone-400 rounded-lg text-[9px] font-black uppercase tracking-wider">
                  Member since Oct 2024
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <ProfileField label="Assigned Workspace Location" value={profile.assignedSalon} icon={Briefcase} />
            </div>
          </div>

          {/* 📑 RIGHT COLUMN: PROFESSIONAL STATS INPUT FORMS */}
          <div className="md:col-span-2 bg-white border border-stone-200/60 rounded-[2.5rem] p-6 md:p-8 shadow-sm text-left flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2.5 mb-8 border-b border-stone-50 pb-4">
                <Award className="text-[#A37B58]" size={20} />
                <h2 className="text-xl font-black uppercase tracking-tight text-stone-900">Professional Stats</h2>
              </div>

              <form onSubmit={handleSave} className="space-y-6">
                {/* Mobile Input Container */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-stone-400 pl-0.5 flex items-center gap-1">
                    <Phone size={10} className="text-[#A37B58]" /> Contact Mobile Number
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
                  {/* Experience Dynamic Picker Control */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-stone-400 pl-0.5">
                      Experience Track (Years)
                    </label>
                    <div className="flex items-center bg-[#FAF6F0]/40 border border-stone-200 rounded-xl overflow-hidden focus-within:border-stone-900 transition-all h-[46px]">
                      <button 
                        type="button"
                        onClick={() => profile.experience > 0 && setProfile({...profile, experience: profile.experience - 1})}
                        className="h-full px-4 text-[#A37B58] hover:bg-stone-100 font-black text-lg w-12 transition-colors cursor-pointer select-none"
                      >
                        −
                      </button>
                      <input 
                        type="text" 
                        readOnly
                        value={`${profile.experience} Years`} 
                        className="w-full bg-transparent text-center outline-none text-sm font-extrabold text-stone-900 select-none pointer-events-none"
                      />
                      <button 
                        type="button"
                        onClick={() => setProfile({...profile, experience: profile.experience + 1})}
                        className="h-full px-4 text-[#A37B58] hover:bg-stone-100 font-black text-lg w-12 transition-colors cursor-pointer select-none"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Specialization Domain Dropdown Selection */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-stone-400 pl-0.5">
                      Expert Domain Specialization
                    </label>
                    <select 
                      value={profile.specialization}
                      onChange={(e) => setProfile({...profile, specialization: e.target.value})}
                      className="w-full bg-[#FAF6F0]/40 border border-stone-200 px-4 py-3 text-sm text-stone-900 font-extrabold outline-none focus:border-stone-900 rounded-xl h-[46px] cursor-pointer transition-all"
                    >
                      <option value="Haircut & Beard">Haircut & Beard Styling</option>
                      <option value="Skin Fade Expert">Skin Fade Specialist</option>
                      <option value="Complete Grooming">Premium Executive Grooming</option>
                    </select>
                  </div>
                </div>

                {/* Dashboard Action Submission Triggers */}
                <div className="pt-4 border-t border-stone-100">
                  <button 
                    type="submit"
                    disabled={loading || profile.mobile.length !== 10}
                    className="w-full flex items-center justify-center gap-2 bg-[#3E362E] hover:bg-[#2A241F] text-[#C5A059] font-black py-4 rounded-xl tracking-widest uppercase text-xs transition-all shadow-md cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.99]"
                  >
                    <Save size={14} className="stroke-[2.5px]" />
                    <span>{loading ? "Saving Credentials..." : "Save Profile Details"}</span>
                  </button>
                  <p className="text-center text-[9px] font-black uppercase tracking-widest text-stone-400 mt-4">
                    Workspace sync logs active • Last updated: 2 mins ago
                  </p>
                </div>
              </form>
            </div>
          </div>

        </div>
      </main>
      <Footer />
    </div>
  );
}

export default BarberProfile;