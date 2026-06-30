import React, { useState } from "react";
import { Settings, Lock, Bell, ShieldCheck, Eye, EyeOff } from "lucide-react";

export default function BarberSettings() {
  const [showPassword, setShowPassword] = useState(false); 
  const [notifications, setNotifications] = useState(true);
  const [soundAlerts, setSoundAlerts] = useState(true);
  
  // Header States
  const profile = { salonName: "Master Barber Lounge", initials: "MB" };

  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: ""
  });

  const handlePasswordUpdate = (e) => {
    e.preventDefault();
    if (passwords.new !== passwords.confirm) {
      alert("New passwords do not match!");
      return;
    }
    alert("Security credentials updated successfully!");
    setPasswords({ current: "", new: "", confirm: "" });
  };

  const formInputStyle = "w-full pl-4 pr-11 py-3 bg-white border border-[#EADDCA] rounded-xl text-stone-900 font-semibold outline-none focus:border-[#C5A059] focus:shadow-[0_0_0_4px_rgba(197,160,89,0.08)] text-sm transition-all duration-300 h-11";

  return (
    <div className="w-full text-[#3E362E] font-sans antialiased flex flex-col relative overflow-hidden">

      {/* Luxury Background Ambient Glows */}
      <div className="absolute top-24 left-0 w-80 h-80 bg-[#C5A059]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-40 right-0 w-96 h-96 bg-[#EADDCA]/30 rounded-full blur-3xl pointer-events-none" />

      <main className="max-w-5xl mx-auto w-full px-4 sm:px-6 py-10 flex-1 text-left relative z-10">
 
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4 border-b border-stone-200/60 pb-6">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-stone-900 uppercase font-serif">
              Control <span className="text-[#C5A059]">Panel</span>
            </h1>
            <p className="text-[10px] font-black uppercase tracking-widest text-[#A37B58] mt-1.5">
              Configure workspace preferences, notifications & security
            </p>
          </div>

          <div className="flex items-center gap-2 bg-white px-3.5 py-2 rounded-xl border border-stone-200/80 shadow-3xs w-fit">
            <Settings size={13} className="text-[#C5A059]" />
            <span className="text-[10px] font-black uppercase tracking-wider text-stone-500 font-mono">
              Version: <span className="text-stone-700 font-extrabold">2.0.0</span>
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div className="md:col-span-1 space-y-4">
            <div className="bg-white/70 backdrop-blur-md border border-[#EADDCA] rounded-2xl p-5 shadow-3xs">
              <h3 className="text-sm font-black uppercase tracking-wider text-stone-900 mb-3 flex items-center gap-2">
                <Settings size={16} className="text-[#C5A059]" /> System Config
              </h3>
              <p className="text-xs text-stone-500 leading-relaxed font-medium">
                Manage your profile discoverability, workspace alerts, and password tokens safely from this control board.
              </p>
            </div>
          </div>

          <div className="md:col-span-2 space-y-6">
            
            <div className="bg-white/70 backdrop-blur-md border border-[#EADDCA] rounded-[22px] p-6 md:p-8 shadow-sm">
              <div className="flex items-center gap-2.5 mb-6 border-b border-[#EADDCA]/40 pb-4">
                <Lock className="text-[#C5A059]" size={18} />
                <h2 className="text-sm font-black uppercase tracking-[0.15em] text-[#3E362E]">Update Password</h2>
              </div>

              <form onSubmit={handlePasswordUpdate} className="space-y-4">
                <div className="flex flex-col gap-1.5 relative">
                  <label className="text-[9px] font-black uppercase tracking-[0.2em] text-stone-400 pl-0.5">Current Password <span className="text-red-500 font-bold">*</span></label>
                  <input 
                    type={showPassword ? "text" : "password"}
                    required
                    autoComplete="new-password"
                    value={passwords.current}
                    onChange={e => setPasswords({...passwords, current: e.target.value})}
                    className={formInputStyle}
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-[29px] text-stone-400 hover:text-[#C5A059] transition-colors">
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5 relative">
                    <label className="text-[9px] font-black uppercase tracking-[0.2em] text-stone-400 pl-0.5">New Secure Token <span className="text-red-500 font-bold">*</span></label>
                    <input type={showPassword ? "text" : "password"} required autoComplete="new-password" value={passwords.new} onChange={e => setPasswords({...passwords, new: e.target.value})} className={formInputStyle} />
                  </div>
                  <div className="flex flex-col gap-1.5 relative">
                    <label className="text-[9px] font-black uppercase tracking-[0.2em] text-stone-400 pl-0.5">Confirm New Token <span className="text-red-500 font-bold">*</span></label>
                    <input type={showPassword ? "text" : "password"} required autoComplete="new-password" value={passwords.confirm} onChange={e => setPasswords({...passwords, confirm: e.target.value})} className={formInputStyle} />
                  </div>
                </div>

                <button type="submit" className="w-full sm:w-auto bg-[#3E362E] hover:bg-[#2A241F] text-[#C5A059] font-black text-[10px] uppercase tracking-[0.2em] px-6 py-4 rounded-xl transition duration-300 shadow-xs cursor-pointer mt-2">
                  Save New Security Token
                </button>
              </form>
            </div>

            <div className="bg-white/70 backdrop-blur-md border border-[#EADDCA] rounded-[22px] p-6 md:p-8 shadow-sm">
              <div className="flex items-center gap-2.5 mb-6 border-b border-[#EADDCA]/40 pb-4">
                <Bell className="text-[#C5A059]" size={18} />
                <h2 className="text-sm font-black uppercase tracking-[0.15em] text-[#3E362E]">Workspace Alerts</h2>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-xl hover:bg-white transition-colors">
                  <div>
                    <p className="text-sm font-extrabold text-[#3E362E]">Live Queue Push Notifications</p>
                    <p className="text-[11px] text-stone-400 mt-0.5 font-medium leading-none">Alert me instantly when a new customer arrives.</p>
                  </div>
                  <input type="checkbox" checked={notifications} onChange={() => setNotifications(!notifications)} className="w-4 h-4 accent-[#3E362E] cursor-pointer" />
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl hover:bg-white transition-colors">
                  <div>
                    <p className="text-sm font-extrabold text-[#3E362E]">Auditory Radar Alerts</p>
                    <p className="text-[11px] text-stone-400 mt-0.5 font-medium leading-none">Play a sound chime when a customer turn is approaching.</p>
                  </div>
                  <input type="checkbox" checked={soundAlerts} onChange={() => setSoundAlerts(!soundAlerts)} className="w-4 h-4 accent-[#3E362E] cursor-pointer" />
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}