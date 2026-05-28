import React, { useState } from "react";
import Header from "../../components/layout/Header";
import { Settings, Lock, Bell, Moon, ShieldCheck, Eye, EyeOff } from "lucide-react";

export default function BarberSettings() {
  const [showPassword, setShowPassword] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [soundAlerts, setSoundAlerts] = useState(true);
  
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

  return (
    <div className="min-h-screen bg-[#FAF6F0] text-stone-800 font-sans antialiased flex flex-col">
      {/* ✂️ GLOBAL BRAND HEADER */}
      <Header title="Control Panel" subtitle="Configure workspace preferences & security" />

      <main className="max-w-4xl mx-auto w-full px-6 py-10 flex-1 text-left">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* 📑 LEFT COL: MENU TABS DESCRIPTION */}
          <div className="md:col-span-1 space-y-4">
            <div className="bg-white border border-stone-200/60 rounded-2xl p-5 shadow-3xs">
              <h3 className="text-sm font-black uppercase tracking-wider text-stone-900 mb-3 flex items-center gap-2">
                <Settings size={16} className="text-[#A37B58]" /> System Config
              </h3>
              <p className="text-xs text-stone-500 leading-relaxed font-medium">
                Manage your profile discoverability, workspace alerts, and password tokens safely from this control board.
              </p>
            </div>
          </div>

          {/* ⚙️ RIGHT COL: INTERACTIVE CONFIGURATIONS MATRIX */}
          <div className="md:col-span-2 space-y-6">
            
            {/* PANEL 1: SECURITY & PASSWORD TRANSFORMS */}
            <div className="bg-white border border-stone-200/60 rounded-[2.5rem] p-6 md:p-8 shadow-sm">
              <div className="flex items-center gap-2.5 mb-6 border-b border-stone-50 pb-4">
                <Lock className="text-[#A37B58]" size={18} />
                <h2 className="text-lg font-black uppercase tracking-tight text-stone-900">Update Password</h2>
              </div>

              <form onSubmit={handlePasswordUpdate} className="space-y-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-stone-400 pl-0.5">Current Password</label>
                  <input 
                    type="password"
                    required
                    value={passwords.current}
                    onChange={e => setPasswords({...passwords, current: e.target.value})}
                    className="w-full px-4 py-3 bg-[#FAF6F0]/40 border border-stone-200 rounded-xl text-stone-900 font-semibold outline-none focus:border-stone-900 text-sm"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-stone-400 pl-0.5">New Secure Token</label>
                    <input 
                      type="password"
                      required
                      value={passwords.new}
                      onChange={e => setPasswords({...passwords, new: e.target.value})}
                      className="w-full px-4 py-3 bg-[#FAF6F0]/40 border border-stone-200 rounded-xl text-stone-900 font-semibold outline-none focus:border-stone-900 text-sm"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-stone-400 pl-0.5">Confirm New Token</label>
                    <input 
                      type="password"
                      required
                      value={passwords.confirm}
                      onChange={e => setPasswords({...passwords, confirm: e.target.value})}
                      className="w-full px-4 py-3 bg-[#FAF6F0]/40 border border-stone-200 rounded-xl text-stone-900 font-semibold outline-none focus:border-stone-900 text-sm"
                    />
                  </div>
                </div>

                <button type="submit" className="mt-4 bg-[#3E362E] hover:bg-[#2A241F] text-[#C5A059] font-black text-xs uppercase tracking-widest px-6 py-3.5 rounded-xl transition shadow-xs cursor-pointer">
                  Save New Security Token
                </button>
              </form>
            </div>

            {/* PANEL 2: RADAR & AUDIO NOTIFICATIONS SYSTEM */}
            <div className="bg-white border border-stone-200/60 rounded-[2.5rem] p-6 md:p-8 shadow-sm">
              <div className="flex items-center gap-2.5 mb-6 border-b border-stone-50 pb-4">
                <Bell className="text-[#A37B58]" size={18} />
                <h2 className="text-lg font-black uppercase tracking-tight text-stone-900">Workspace Alerts</h2>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-xl hover:bg-stone-50/60 transition-colors">
                  <div>
                    <p className="text-sm font-extrabold text-stone-900">Live Queue Push Notifications</p>
                    <p className="text-xs text-stone-400 mt-0.5 font-medium">Alert me instantly when a new customer arrives in the pipeline.</p>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={notifications}
                    onChange={() => setNotifications(!notifications)}
                    className="w-4 h-4 accent-[#3E362E] cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl hover:bg-stone-50/60 transition-colors">
                  <div>
                    <p className="text-sm font-extrabold text-stone-900">Auditory Radar Alerts</p>
                    <p className="text-xs text-stone-400 mt-0.5 font-medium">Play a sound chime when a customer turn is approaching limit caps.</p>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={soundAlerts}
                    onChange={() => setSoundAlerts(!soundAlerts)}
                    className="w-4 h-4 accent-[#3E362E] cursor-pointer"
                  />
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-xl bg-[#FAF7F2] border border-stone-200/40 p-4 text-xs text-stone-600 mt-6">
                <ShieldCheck size={16} className="shrink-0 text-[#C5A059] mt-0.5" />
                <span className="font-medium leading-normal">
                  All preferences configured here are saved locally to your current workspace interface profile safely.
                </span>
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}