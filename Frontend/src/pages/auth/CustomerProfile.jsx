import React, { useState } from "react";
import backgroundImage from "../../assets/customerprofile.png";

const ScissorIcon = ({ className }) => (
  <svg viewBox="0 0 24 24" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M6 15C7.65685 15 9 13.6569 9 12C9 11.3321 8.7818 10.715 8.4121 10.2148L11.5 12L14.5879 13.7852C14.2182 14.285 14 14.9019 14 15.5645C14 17.2213 15.3431 18.5645 17 18.5645C18.6569 18.5645 20 17.2213 20 15.5645C20 14.2964 19.2155 13.2117 18.102 12.7751L15.3 11.1574L18.102 9.53974C19.2155 9.10313 20 8.01844 20 6.75032C20 5.09347 18.6569 3.75032 17 3.75032C15.3431 3.75032 14 5.09347 14 6.75032C14 7.41292 14.2182 8.02983 14.5879 8.52959L11.5 10.3148L8.4121 8.5322C8.7818 8.03198 9 7.41492 9 6.74731C9 5.09046 7.65685 3.74731 6 3.74731C4.34315 3.74731 3 5.09046 3 6.74731C3 8.40417 4.34315 9.74731 6 9.74731C6.66508 9.74731 7.2798 9.53039 7.7788 9.16335L10.8667 10.9485L7.7788 12.7337C7.2798 12.3667 6.66508 12.1497 6 12.1497C4.34315 12.1497 3 13.4929 3 15.1497C3 16.8066 4.34315 18.1497 6 18.1497V15Z" />
  </svg>
);

function CustomerProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: "Rahul Jagtap",
    mobile: "9876543210",
    email: "rahul@example.com",
    address: "Flat 402, Golden Heights, Pune",
  });

  const [family, setFamily] = useState([
    { id: 1, name: "Aryan", relation: "Son", age: "12" },
    { id: 2, name: "Snehal", relation: "Wife", age: "32" }
  ]);


  const [appointments] = useState([
    { id: 101, service: "Classic Haircut", date: "24 April 2026", time: "10:30 AM", status: "Upcoming" },
    { id: 102, service: "Beard Trim & Spa", date: "15 April 2026", time: "02:15 PM", status: "Completed" },
    { id: 103, service: "Hair Coloring", date: "02 April 2026", time: "11:00 AM", status: "Completed" },
  ]);

  const addMember = () => {
    setFamily([...family, { id: Date.now(), name: "", relation: "Relation", age: "" }]);
  };
  const removeMember = (id) => setFamily(family.filter(m => m.id !== id));
  const updateMember = (id, field, value) => {
    setFamily(family.map(m => m.id === id ? { ...m, [field]: value } : m));
  };

  return (
    <div className="min-h-screen bg-cover bg-center bg-fixed flex flex-col items-center justify-start p-4 md:p-10 relative font-sans text-[#3E362E]" style={{ backgroundImage: `url(${backgroundImage})` }}>
      <div className="absolute inset-0 bg-[#FFFBF2]/90 backdrop-blur-md z-0"></div>

      {/* Logo Section */}
      <div className="absolute top-8 left-8 z-20 flex flex-col items-start hidden md:flex">
        <h1 className="text-2xl font-black text-[#C5A059] tracking-[0.2em] uppercase flex items-center gap-2">
          <ScissorIcon className="w-6 h-6 fill-[#C5A059]" />
          Barber <span className="text-[#3E362E]">Pro</span>
        </h1>
        <div className="h-[2px] w-full bg-[#C5A059] mt-1 opacity-40"></div>
        <p className="text-[9px] text-[#8D7B68] tracking-[0.4em] uppercase mt-1">Est. 2026</p>
      </div>

      <div className="max-w-7xl w-full mx-auto relative z-10 pb-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center md:items-end mb-10 mt-12 md:mt-20 gap-6 border-l-0 md:border-l-4 border-[#C5A059] pl-0 md:pl-6">
          <div>
            <h1 className="text-3xl md:text-5xl font-black tracking-tighter uppercase italic text-[#3E362E]">
              User <span className="text-[#C5A059]">Dashboard</span>
            </h1>
            <p className="text-[#8D7B68] text-[9px] md:text-xs tracking-[0.5em] mt-2 uppercase font-bold text-center md:text-left">Premium Experience</p>
          </div>
          <button onClick={() => setIsEditing(!isEditing)} className={`w-full md:w-auto px-8 py-4 rounded-xl font-black text-[10px] tracking-widest transition-all ${isEditing ? "bg-red-50 text-red-500 border border-red-200" : "bg-[#3E362E] text-[#FFFBF2] shadow-lg"}`}>
            {isEditing ? "CANCEL EDIT" : "MODIFY PROFILE"}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT COLUMN: Profile & Stats */}
          <div className="lg:col-span-4 space-y-6">
            {/* Identity Card */}
            <div className="bg-white/60 backdrop-blur-2xl border border-[#EAD8C0] p-8 rounded-[3rem] shadow-xl relative overflow-hidden">
              <div className="w-20 h-20 bg-gradient-to-tr from-[#C5A059] to-[#F8E4A0] rounded-3xl flex items-center justify-center mb-8 rotate-3 shadow-md">
                 <span className="text-3xl font-black text-white">{profile.name[0]}</span>
              </div>
              <div className="space-y-6">
                <div>
                  <label className="text-[9px] text-[#C5A059] uppercase font-black tracking-widest mb-1 block">Primary Contact</label>
                  <p className="text-xl font-mono text-[#3E362E] font-bold">{profile.mobile}</p>
                </div>
                <div className="space-y-4">
                  <input disabled={!isEditing} value={profile.name} onChange={(e) => setProfile({...profile, name: e.target.value})} className="w-full bg-[#FDF5E6]/50 border-b border-[#EAD8C0] py-2 outline-none text-sm font-semibold" placeholder="Full Name" />
                  <input disabled={!isEditing} value={profile.email} onChange={(e) => setProfile({...profile, email: e.target.value})} className="w-full bg-[#FDF5E6]/50 border-b border-[#EAD8C0] py-2 outline-none text-sm font-semibold" placeholder="Email" />
                </div>
              </div>
            </div>

            {/* Appointment History (Backup Data) */}
            <div className="bg-[#3E362E] text-[#FFFBF2] p-8 rounded-[3rem] shadow-2xl relative overflow-hidden">
               <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full -mr-10 -mt-10"></div>
               <h3 className="text-sm font-black uppercase tracking-[0.2em] mb-6 text-[#C5A059]">Recent Appointments</h3>
               <div className="space-y-4">
                 {appointments.map(app => (
                   <div key={app.id} className="border-b border-white/10 pb-3 last:border-0">
                     <div className="flex justify-between items-start">
                       <p className="text-xs font-bold">{app.service}</p>
                       <span className={`text-[8px] px-2 py-1 rounded-full uppercase font-black ${app.status === 'Upcoming' ? 'bg-[#C5A059] text-white' : 'bg-white/10 text-white/60'}`}>{app.status}</span>
                     </div>
                     <p className="text-[10px] text-white/50 mt-1">{app.date} • {app.time}</p>
                   </div>
                 ))}
               </div>
               <button className="w-full mt-6 py-3 border border-white/20 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-white/10 transition-all">View All History</button>
            </div>
          </div>

          {/* RIGHT COLUMN: Family Management */}
          <div className="lg:col-span-8">
            <div className="bg-white/80 backdrop-blur-3xl border border-[#EAD8C0] p-6 md:p-10 rounded-[3.5rem] shadow-2xl h-full flex flex-col">
              <div className="flex flex-col sm:flex-row justify-between items-center mb-10 gap-4">
                <div>
                  <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-[#3E362E]">Family <span className="text-[#C5A059]">Access</span></h2>
                  <div className="h-[2px] w-12 bg-[#C5A059] mt-2"></div>
                </div>
                <button onClick={addMember} className="w-full sm:w-auto bg-[#C5A059]/10 text-[#C5A059] border border-[#C5A059]/30 h-12 px-6 rounded-2xl font-black text-[10px] hover:bg-[#C5A059] hover:text-white transition-all">+ ADD MEMBER</button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 overflow-y-auto max-h-[450px] pr-2 custom-scrollbar">
                {family.map((member) => (
                  <div key={member.id} className="relative bg-[#FDF5E6]/40 border border-[#EAD8C0] p-6 rounded-[2rem] group hover:bg-white transition-all shadow-sm">
                    <button onClick={() => removeMember(member.id)} className="absolute top-4 right-4 text-[#A4907C] hover:text-red-500 text-[9px] font-bold">REMOVE</button>
                    <div className="flex items-center gap-4 mb-4">
                       <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center border border-[#C5A059]/30 text-[#C5A059] font-bold">{member.relation[0]}</div>
                       <input placeholder="Name" value={member.name} onChange={(e) => updateMember(member.id, "name", e.target.value)} className="bg-transparent border-b border-[#EAD8C0] py-1 text-sm font-bold outline-none w-full" />
                    </div>
                    <div className="flex gap-3">
                        <select value={member.relation} onChange={(e) => updateMember(member.id, "relation", e.target.value)} className="flex-1 bg-white border border-[#EAD8C0] text-[10px] rounded-lg px-2 py-2 outline-none">
                          <option>Son</option><option>Daughter</option><option>Wife</option><option>Husband</option>
                        </select>
                        <input placeholder="Age" value={member.age} onChange={(e) => updateMember(member.id, "age", e.target.value)} className="w-14 bg-white border border-[#EAD8C0] rounded-lg text-[10px] text-center outline-none" />
                    </div>
                  </div>
                ))}
              </div>

              {isEditing && (
                <div className="mt-auto pt-8">
                  <button className="w-full py-5 bg-[#3E362E] text-[#FFFBF2] font-black uppercase tracking-[0.2em] rounded-[2rem] shadow-xl hover:bg-[#2A241F] transition-all">
                    Sync Changes to Account
                  </button>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default CustomerProfile;