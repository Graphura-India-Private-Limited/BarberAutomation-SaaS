import { useState } from "react";


const ProfileField = ({ label, value, isFixed }) => (
  <div className="flex flex-col gap-1 p-4 rounded-2xl bg-white/[0.03] border border-white/5 backdrop-blur-md">
    <label className="text-[10px] uppercase tracking-[0.2em] text-[#D4AF37] font-bold">{label}</label>
    <p className={`text-lg ${isFixed ? 'text-gray-400' : 'text-white'} font-medium`}>{value}</p>
    {isFixed && <span className="text-[9px] text-gray-600 italic">Locked by Management</span>}
  </div>
);

function BarberProfile() {
  const [profile, setProfile] = useState({
    name: "Arjun Sharma",
    mobile: "9876543210",
    assignedSalon: "Elite Cuts & Spa - Downtown",
    experience: "5 Years",
    specialization: "Haircut & Beard Styling",
  });

  return (
    <div className="min-h-screen bg-[#050505] text-white p-4 md:p-10 font-sans relative overflow-hidden">
      {/* Background Glows for Depth */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#D4AF37]/10 blur-[120px] rounded-full"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#D4AF37]/5 blur-[120px] rounded-full"></div>

      <div className="max-w-4xl mx-auto relative z-10">
        
        {/* Header Section */}
        <header className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <h1 className="text-5xl font-black tracking-tighter uppercase italic">
              My <span className="text-[#D4AF37]">Profile</span>
            </h1>
            <div className="h-1 w-20 bg-[#D4AF37] mt-2 shadow-[0_0_15px_rgba(212,175,55,0.5)]"></div>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500 tracking-widest uppercase">Member Since</p>
            <p className="text-sm font-bold text-gray-300">OCT 2024</p>
          </div>
        </header>

        <div className="grid md:grid-cols-3 gap-8">
          
          {/* Left Column: Avatar & Basic Info */}
          <div className="md:col-span-1 space-y-6">
            <div className="aspect-square rounded-[3rem] bg-gradient-to-br from-[#1A1A1A] to-[#0A0A0A] border border-white/10 flex items-center justify-center relative group overflow-hidden shadow-2xl">
              <span className="text-7xl font-black text-[#D4AF37]/20 group-hover:scale-110 transition-transform">AS</span>
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              <div className="absolute bottom-6 text-center w-full">
                <p className="text-xl font-bold tracking-tight">{profile.name}</p>
                <p className="text-[10px] text-[#D4AF37] uppercase tracking-widest">Master Barber</p>
              </div>
            </div>
            
            <div className="space-y-4">
               <ProfileField label="Assigned Salon" value={profile.assignedSalon} isFixed={true} />
            </div>
          </div>

          {/* Right Column: Editable Professional Details */}
          <div className="md:col-span-2 bg-white/[0.02] border border-white/5 backdrop-blur-2xl rounded-[2.5rem] p-8 shadow-2xl">
            <h3 className="text-xl font-black uppercase tracking-widest mb-8 flex items-center gap-3">
              <span className="w-8 h-[2px] bg-[#D4AF37]"></span>
              Professional Stats
            </h3>

            <div className="grid gap-8">
              {/* Mobile Input */}
              <div className="relative group">
                <label className="text-[10px] uppercase tracking-widest text-gray-500 mb-2 block ml-2 font-bold">Mobile Number</label>
                <input 
                  type="text" 
                  value={profile.mobile}
                  onInput={(e) => e.target.value = e.target.value.replace(/[^0-9]/g, '').slice(0, 10)}
                  onChange={(e) => setProfile({...profile, mobile: e.target.value})}
                  placeholder="Enter Mobile Number"
                className="w-full bg-black/50 border border-gray-700 p-4 rounded-xl focus:border-[#D4AF37] outline-none text-white" 
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Experience Input */}
                <div className="relative group">
  <label className="text-[10px] uppercase tracking-widest text-gray-400 mb-2 block ml-2">
    Experience (Years)
  </label>
  
  <div className="flex items-center bg-white/[0.03] border border-white/10 rounded-2xl overflow-hidden focus-within:border-[#D4AF37] transition-all">
    
    {/* Minus Button */}
    <button 
      type="button"
      onClick={() => {
        const current = parseInt(profile.experience) || 0;
        if (current > 0) setProfile({...profile, experience: (current - 1).toString()});
      }}
      className="p-4 hover:bg-white/5 text-[#D4AF37] transition-colors font-bold text-xl w-14"
    >
      −
    </button>

    {/* Number Input */}
    <input 
      type="number" 
      value={profile.experience.replace(/[^0-9]/g, '')} // Sirf number allow karega
      onChange={(e) => setProfile({...profile, experience: e.target.value})}
      className="w-full bg-transparent p-4 text-center outline-none text-lg font-medium [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
    />

    <button 
      type="button"
      onClick={() => {
        const current = parseInt(profile.experience) || 0;
        setProfile({...profile, experience: (current + 1).toString()});
      }}
      className="p-4 hover:bg-white/5 text-[#D4AF37] transition-colors font-bold text-xl w-14"
    >
      +
    </button>
  </div>
                </div>

                {/* Specialization Select */}
                <div className="relative group">
                  <label className="text-[10px] uppercase tracking-widest text-gray-400 mb-2 block ml-2">Specialization</label>
                  <select className="w-full bg-white/[0.03] border border-white/10 p-4 rounded-2xl focus:border-[#D4AF37] outline-none transition-all appearance-none cursor-pointer">
                    <option className="bg-[#111]">Haircut & Beard</option>
                    <option className="bg-[#111]">Skin Fade Expert</option>
                    <option className="bg-[#111]">Complete Grooming</option>
                  </select>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-6">
                <button className="w-full group relative overflow-hidden bg-[#D4AF37] text-black font-black py-5 rounded-2xl tracking-[0.2em] uppercase transition-all hover:scale-[1.02] active:scale-[0.98]">
                  <span className="relative z-10">Save Profile Details</span>
                  <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                </button>
                <p className="text-center text-[10px] text-gray-600 mt-4 tracking-widest uppercase">
                  Last updated: 2 mins ago
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default BarberProfile;