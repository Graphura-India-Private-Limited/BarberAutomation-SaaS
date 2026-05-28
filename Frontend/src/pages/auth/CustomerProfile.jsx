import React, { useState } from "react";
import { 
  Scissors, User, Mail, Phone, Plus, Trash2, X, 
  Calendar, Clock, Award, Image, ChevronRight, ArrowLeft, Save
} from "lucide-react";
import backgroundImage from "../../assets/customerprofile.png";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";

const GOLD = "#C5A059";
const CHARCOAL = "#3E362E";

export default function CustomerProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [showStyleModal, setShowStyleModal] = useState(false); 
  const [newStyleName, setNewStyleName] = useState(""); 
  
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
    { id: 104, service: "Head Massage & Wash", date: "14 March 2026", time: "04:00 PM", status: "Completed" },
    { id: 105, service: "Detan Pack Treatment", date: "20 February 2026", time: "01:30 PM", status: "Completed" },
  ]);

  const [styles, setStyles] = useState([
    { id: 1, name: "Classic Trim" },
    { id: 2, name: "Taper Fade" },
    { id: 3, name: "Beard Lineup" }
  ]);

  const addMember = () => {
    setFamily([...family, { id: Date.now(), name: "", relation: "Son", age: "" }]);
    if(!isEditing) setIsEditing(true); // Automatically allow dynamic field controls
  };
  
  const removeMember = (id) => setFamily(family.filter(m => m.id !== id));
  
  const updateMember = (id, field, value) => {
    setFamily(family.map(m => m.id === id ? { ...m, [field]: value } : m));
  };

  const handleAddStyle = (e) => {
    e.preventDefault();
    if (!newStyleName.trim()) return;
    setStyles([...styles, { id: Date.now(), name: newStyleName.trim() }]);
    setNewStyleName("");
    setShowStyleModal(false);
  };

  const handleRemoveStyle = (id) => {
    setStyles(styles.filter(style => style.id !== id));
  };

  const handleSaveChanges = () => {
    // Framework action logic block for handling data syncing hooks
    setIsEditing(false);
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-cover bg-center bg-fixed flex flex-col relative font-sans text-[#3E362E]" style={{ backgroundImage: `url(${backgroundImage})` }}>
        <div className="absolute inset-0 bg-[#FFFBF2]/95 backdrop-blur-md z-0"></div>

        {/* ── UTILITY HEADER ── */}
        <header className="sticky top-0 w-full border-b z-50 px-6 py-4 transition-all bg-[#FFFBF2]/80 backdrop-blur-md" style={{ borderColor: `${GOLD}20` }}>
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
            
            {/* Back Control Link */}
            <button 
              onClick={() => window.history.back()} 
              className="flex items-center gap-2 text-xs font-black tracking-widest uppercase transition-opacity duration-200 hover:opacity-80 group text-[#3E362E] bg-transparent"
            >
              <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" style={{ color: GOLD }} />
              <span>Back to Marketplace</span>
            </button>
            
            {/* Premium Tier Tag */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-[10px] font-bold border" style={{ backgroundColor: "rgba(62, 54, 46, 0.05)", color: "#3E362E", borderColor: "rgba(62, 54, 46, 0.1)" }}>
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
              <span className="hidden xs:inline">Premium Tier</span>
            </div>
          </div>
        </header>

        {/* ── CORE DASHBOARD CONTENT PANELS ── */}
        <main className="max-w-7xl w-full mx-auto relative z-10 px-4 md:px-8 py-10 flex-1 flex flex-col justify-start">
          
          {/* Profile Headline View Banner */}
          <div className="flex flex-col md:flex-row justify-between items-center md:items-end mb-10 gap-6 border-l-4 pl-6 transition-all" style={{ borderColor: GOLD }}>
            <div>
              <h1 className="text-4xl md:text-5xl font-black tracking-tighter uppercase italic" style={{ color: CHARCOAL }}>
                User <span style={{ color: GOLD }}>Dashboard</span>
              </h1>
              <p className="text-[10px] md:text-xs tracking-[0.5em] mt-2 uppercase font-black text-gray-400">Premium Portal Experience</p>
            </div>
            
            <div className="w-full md:w-auto flex flex-col sm:flex-row gap-3">
              {isEditing && (
                <button 
                  onClick={handleSaveChanges}
                  className="flex items-center justify-center gap-2 px-8 py-4 rounded-2xl font-black text-[10px] tracking-widest transition-all duration-300 shadow-md bg-green-600 text-white hover:bg-green-700"
                >
                  <Save size={12} /> SAVE CHANGES
                </button>
              )}
              <button 
                onClick={() => setIsEditing(!isEditing)} 
                className={`w-full md:w-auto px-8 py-4 rounded-2xl font-black text-[10px] tracking-widest transition-all duration-300 shadow-md transform hover:-translate-y-0.5 ${isEditing ? "bg-red-50 text-red-500 border border-red-200" : "text-[#FFFBF2]"}`}
                style={{ background: isEditing ? "" : CHARCOAL }}
              >
                {isEditing ? "CANCEL REVISIONS" : "MODIFY MEMBERSHIP PROFILE"}
              </button>
            </div>
          </div>

          {/* TOP BLOCK: Identity & Family */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
            
            {/* LEFT AREA: Identity Profile & Loyalty */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-white border border-[#EAD8C0]/60 p-8 rounded-[2.5rem] shadow-xl relative overflow-hidden group">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 rotate-3 shadow-md transition-transform group-hover:rotate-6" style={{ background: `linear-gradient(135deg, ${GOLD}, #F8E4A0)` }}>
                  <span className="text-2xl font-black text-white">{profile.name ? profile.name[0].toUpperCase() : "U"}</span>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-[9px] uppercase font-black tracking-widest mb-1 block" style={{ color: GOLD }}>Primary Contact Link</label>
                    <div className="flex items-center gap-2 text-[#3E362E]">
                      <Phone size={14} className="text-gray-400" />
                      {isEditing ? (
                        <input type="text" value={profile.mobile} onChange={(e) => setProfile({...profile, mobile: e.target.value})} className="bg-transparent border-b border-gray-200 font-mono text-sm font-bold outline-none text-[#3E362E]" />
                      ) : (
                        <p className="text-base font-mono font-bold">{profile.mobile}</p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-3 pt-1">
                    <div className="flex items-center gap-3 border-b border-[#EAD8C0]/40 py-2">
                      <User size={14} className="text-gray-400 shrink-0" />
                      <input disabled={!isEditing} value={profile.name} onChange={(e) => setProfile({...profile, name: e.target.value})} className={`w-full bg-transparent p-0.5 outline-none text-sm font-bold text-[#3E362E] transition-all ${isEditing ? "bg-amber-50/50 rounded px-2" : ""}`} placeholder="Full Name" />
                    </div>
                    <div className="flex items-center gap-3 border-b border-[#EAD8C0]/40 py-2">
                      <Mail size={14} className="text-gray-400 shrink-0" />
                      <input disabled={!isEditing} value={profile.email} onChange={(e) => setProfile({...profile, email: e.target.value})} className={`w-full bg-transparent p-0.5 outline-none text-sm font-semibold text-[#3E362E] transition-all ${isEditing ? "bg-amber-50/50 rounded px-2" : ""}`} placeholder="Email Address" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Loyalty point system */}
              <div className="bg-white border border-[#EAD8C0]/60 p-6 rounded-[2rem] shadow-lg">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Award size={16} color={GOLD} />
                    <h4 className="text-xs font-black uppercase tracking-wider">Club Loyalty Balance</h4>
                  </div>
                  <span className="text-[9px] font-black tracking-widest uppercase px-2 py-0.5 rounded bg-amber-50" style={{ color: GOLD }}>Gold Tier</span>
                </div>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-2xl font-black font-mono">1,450</span>
                  <span className="text-[9px] font-bold uppercase text-gray-400">XP Points</span>
                </div>
                <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-500" style={{ width: "75%", background: GOLD }}></div>
                </div>
              </div>
            </div>

            {/* RIGHT AREA: Family Account */}
            <div className="lg:col-span-7">
              <div className="bg-white/90 border border-[#EAD8C0]/60 p-6 rounded-[2.5rem] shadow-xl flex flex-col h-full justify-start">
                <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
                  <div>
                    <h2 className="text-xl font-black uppercase tracking-tight" style={{ color: CHARCOAL }}>
                      Family <span style={{ color: GOLD }}>Access Accounts</span>
                    </h2>
                    <div className="h-[2px] w-12 mt-1.5 rounded-full" style={{ background: GOLD }}></div>
                  </div>
                  <button 
                    onClick={addMember} 
                    className="w-full sm:w-auto border h-10 px-5 rounded-xl font-black text-[9px] tracking-wider transition-all duration-300 flex items-center justify-center gap-2 hover:bg-[#C5A059] hover:text-white"
                    style={{ backgroundColor: `${GOLD}10`, color: GOLD, borderColor: `${GOLD}40` }}
                  >
                    <Plus size={12} /> LINK DEPENDENT
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 overflow-y-auto pr-1 auto-rows-max custom-scrollbar flex-1 max-h-[280px]">
                  {family.length === 0 ? (
                    <div className="col-span-full flex flex-col items-center justify-center text-center py-10 border border-dashed border-[#EAD8C0] rounded-2xl bg-white/40">
                      <User size={24} className="text-gray-300 mb-2" />
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">No linked family profiles</p>
                    </div>
                  ) : (
                    family.map((member) => (
                      <div key={member.id} className="relative border border-[#EAD8C0]/50 p-4 rounded-xl bg-[#FDF5E6]/30 group h-fit transition-shadow hover:shadow-sm">
                        <button onClick={() => removeMember(member.id)} className="absolute top-3 right-3 text-gray-400 hover:text-red-500 transition-colors text-[9px] font-bold uppercase tracking-wider">
                          Remove
                        </button>
                        <div className="flex items-center gap-3 mb-3">
                          <input disabled={!isEditing} placeholder="Name" value={member.name} onChange={(e) => updateMember(member.id, "name", e.target.value)} className={`bg-transparent border-b border-[#EAD8C0]/60 py-0.5 text-xs font-bold outline-none w-full text-[#3E362E] focus:border-[#C5A059] ${!isEditing ? "border-transparent" : ""}`} />
                        </div>
                        <div className="flex gap-2">
                          <select disabled={!isEditing} value={member.relation} onChange={(e) => updateMember(member.id, "relation", e.target.value)} className="flex-1 bg-white border border-[#EAD8C0]/60 text-[9px] font-bold rounded-md px-2 py-1 outline-none text-gray-700 disabled:bg-gray-50/50">
                            <option>Son</option><option>Daughter</option><option>Wife</option><option>Husband</option>
                          </select>
                          <input disabled={!isEditing} placeholder="Age" value={member.age} onChange={(e) => updateMember(member.id, "age", e.target.value.replace(/\D/g, ""))} className="w-12 bg-white border border-[#EAD8C0]/60 rounded-md text-[9px] text-center font-bold outline-none text-gray-700 disabled:bg-gray-50/50" />
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>  
          </div>

          {/* ── TIMELINE LOGS PANEL ── */}
          <div className="grid grid-cols-1 gap-8 mb-8">
            <div className="text-[#FFFBF2] p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden flex flex-col justify-between" style={{ background: CHARCOAL }}>
              <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -mr-16 -mt-16"></div>
              
              <div className="flex items-center justify-between mb-6 border-b border-white/10 pb-4">
                <h3 className="text-sm font-black uppercase tracking-[0.20em] flex items-center gap-2" style={{ color: GOLD }}>
                  <Calendar size={16} /> Recent Timeline Activity Logs
                </h3>
                <span className="text-[10px] uppercase font-bold text-white/40 tracking-wider">Showing latest items</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {appointments.slice(0, 3).map(app => (
                  <div key={app.id} className="bg-white/5 border border-white/10 p-5 rounded-2xl flex flex-col justify-between hover:bg-white/[0.08] transition-colors">
                    <div className="flex justify-between items-start gap-2 mb-3">
                      <p className="text-sm font-black tracking-wide">{app.service}</p>
                      <span className="text-[8px] px-2.5 py-0.5 rounded-full uppercase font-black tracking-wider shrink-0" style={{ backgroundColor: app.status === 'Upcoming' ? GOLD : 'rgba(255,255,255,0.1)', color: '#FFF' }}>
                        {app.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-white/50 text-[10px] font-medium pt-2 border-t border-white/5">
                      <span className="flex items-center gap-1"><Calendar size={11} /> {app.date}</span>
                      <span className="flex items-center gap-1"><Clock size={11} /> {app.time}</span>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="flex justify-center mt-6">
                <button 
                  onClick={() => setShowHistoryModal(true)}
                  className="w-full sm:w-64 py-3 border border-white/10 bg-white/5 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-white/10 hover:border-white/20 transition-all duration-300 flex items-center justify-center gap-1"
                >
                  Launch History Ledger <ChevronRight size={12} />
                </button>
              </div>
            </div>
          </div>

          {/* ── STYLE PROFILE VAULT ── */}
          <div className="bg-white border border-[#EAD8C0]/60 p-6 rounded-[2rem] shadow-xl">
            <div className="flex items-center gap-2 mb-4">
              <Image size={16} color={GOLD} />
              <h4 className="text-xs font-black uppercase tracking-wider">Style Profile Vault</h4>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-4 max-w-2xl">
              <div 
                onClick={() => setShowStyleModal(true)}
                className="aspect-square bg-gray-50 rounded-xl border-2 border-dashed border-[#EAD8C0]/60 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 transition-colors"
              >
                <Plus size={16} className="text-gray-400 mb-1" />
                <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Add Style</span>
              </div>
              
              {styles.map((style) => (
                <div key={style.id} className="aspect-square bg-[#FDF5E6]/40 rounded-xl flex flex-col items-center justify-center text-gray-500 border border-[#EAD8C0]/30 relative p-2 group text-center shadow-sm">
                  <button 
                    onClick={() => handleRemoveStyle(style.id)} 
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-white/80 backdrop-blur-sm p-1 rounded-md text-gray-400 hover:text-red-500 shadow-sm"
                    title="Delete style"
                  >
                    <Trash2 size={12} />
                  </button>
                  <Scissors size={18} className="mb-2" style={{ color: GOLD }} />
                  <span className="text-[10px] font-black uppercase tracking-tight text-[#3E362E] line-clamp-2 px-1">
                    {style.name}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </main>

        {/* ── BOOKING LEDGER MODAL ── */}
        {showHistoryModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-end animate-in fade-in duration-200">
            <div onClick={() => setShowHistoryModal(false)} className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>
            <div className="relative w-full max-w-md h-full bg-[#FFFBF2] shadow-2xl p-6 flex flex-col justify-start overflow-y-auto z-10 border-l border-[#EAD8C0]/80 animate-in slide-in-from-right duration-300">
              <div className="flex items-center justify-between pb-4 border-b border-[#EAD8C0]/60 mb-6">
                <div className="flex items-center gap-2">
                  <Scissors size={18} color={GOLD} />
                  <h3 className="text-md font-black uppercase tracking-wider" style={{ color: CHARCOAL }}>Complete Booking Ledger</h3>
                </div>
                <button onClick={() => setShowHistoryModal(false)} className="p-2 hover:bg-gray-100 rounded-xl text-gray-400">
                  <X size={18} />
                </button>
              </div>

              <div className="space-y-4 flex-1">
                {appointments.map((app) => (
                  <div key={app.id} className="p-4 bg-white rounded-2xl border border-[#EAD8C0]/40 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full" style={{ background: app.status === 'Upcoming' ? GOLD : '#8D7B68' }}></div>
                    <div className="flex justify-between items-start gap-2">
                      <div>
                        <p className="text-xs font-black tracking-wide" style={{ color: CHARCOAL }}>{app.service}</p>
                        <p className="text-[10px] text-gray-400 font-mono mt-0.5">ID: #{app.id}</p>
                      </div>
                      <span className="text-[8px] px-2 py-0.5 rounded font-black uppercase tracking-wider" style={{ backgroundColor: app.status === 'Upcoming' ? `${GOLD}15` : '#f3f4f6', color: app.status === 'Upcoming' ? GOLD : '#6b7280' }}>
                        {app.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 mt-3 pt-3 border-t border-dashed border-gray-100 text-[10px] text-gray-500 font-medium">
                      <span className="flex items-center gap-1"><Calendar size={12} /> {app.date}</span>
                      <span className="flex items-center gap-1"><Clock size={12} /> {app.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── STYLE ENTRY POPUP MODAL ── */}
        {showStyleModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div onClick={() => setShowStyleModal(false)} className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
            <form onSubmit={handleAddStyle} className="relative bg-[#FFFBF2] border border-[#EAD8C0] w-full max-w-sm rounded-[2rem] p-6 shadow-2xl z-10 animate-in fade-in zoom-in-95 duration-200">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-black uppercase tracking-wider flex items-center gap-2" style={{ color: CHARCOAL }}>
                  <Scissors size={14} color={GOLD} /> Add New Preferred Look
                </h3>
                <button type="button" onClick={() => setShowStyleModal(false)} className="text-gray-400 hover:text-gray-600">
                  <X size={16} />
                </button>
              </div>
              <div className="mb-4">
                <label className="text-[9px] uppercase font-black tracking-widest mb-1.5 block text-gray-400">Style / Cut Name</label>
                <input 
                  type="text"
                  required
                  autoFocus
                  value={newStyleName}
                  onChange={(e) => setNewStyleName(e.target.value)}
                  placeholder="e.g., Mid Drop Fade, Messy Quiff"
                  className="w-full bg-white border border-[#EAD8C0] rounded-xl px-4 py-3 text-xs font-bold outline-none text-[#3E362E] focus:border-[#C5A059] shadow-inner"
                />
              </div>
              <button 
                type="submit" 
                className="w-full py-3 text-[#FFFBF2] font-black text-[10px] uppercase tracking-widest rounded-xl shadow-md transition-all duration-200 hover:opacity-95"
                style={{ background: CHARCOAL }}
              >
                Save to Vault
              </button>
            </form>
          </div>
        )}

      </div>
      <Footer />
    </>
  );
}