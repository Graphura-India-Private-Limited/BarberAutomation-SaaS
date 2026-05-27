import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Bell, 
  Scissors, 
  Clock, 
  Check, 
  Trash2, 
  Edit3, 
  ArrowLeft, 
  Plus, 
  Calendar, 
  Sparkles, 
  Info 
} from "lucide-react";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const getToken = () => localStorage.getItem("token");

const PRESET_DAYS = [15, 20, 30];

/* ── Days left badge component ── */
const DaysLeft = ({ lastDate, intervalDays }) => {
  const last = new Date(lastDate);
  const next = new Date(last.getTime() + intervalDays * 24 * 60 * 60 * 1000);
  const today = new Date();
  const diff = Math.ceil((next - today) / (1000 * 60 * 60 * 24));

  if (diff <= 0) return (
    <span className="bg-red-50 text-red-700 border border-red-200/60 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider shadow-sm animate-pulse">
      Overdue {Math.abs(diff)}d
    </span>
  );
  if (diff <= 3) return (
    <span className="bg-amber-50 text-amber-800 border border-amber-200/60 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider shadow-sm">
      Due in {diff}d
    </span>
  );
  return (
    <span className="bg-emerald-50 text-emerald-700 border border-emerald-200/60 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider shadow-sm">
      {diff}d left
    </span>
  );
};

export default function ReminderSystem() {
  const navigate = useNavigate();
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [toast, setToast] = useState(null);
  const [form, setForm] = useState({
    title: "Haircut Reminder",
    interval_days: 20,
    last_haircut_date: new Date().toISOString().split("T")[0],
    notify_before_days: 2,
  });

  const toast_ = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  /* load reminders */
  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/reminder`, {
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      const data = await res.json();
      if (data.success) setReminders(data.reminders);
    } catch {
      const local = JSON.parse(localStorage.getItem("reminders") || "[]");
      setReminders(local);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
    window.scrollTo(0, 0);
    load(); 
  }, []);

  /* save reminder */
  const handleSave = async () => {
    if (!form.title || !form.interval_days || !form.last_haircut_date) {
      toast_("Fill all fields!", "error"); return;
    }

    const payload = {
      ...form,
      interval_days: Number(form.interval_days),
      notify_before_days: Number(form.notify_before_days),
    };

    try {
      const url = editId ? `${API}/reminder/${editId}` : `${API}/reminder`;
      const method = editId ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        toast_(editId ? "Reminder updated!" : "Reminder set!");
        setShowForm(false); setEditId(null);
        load();
        return;
      }
    } catch {}

    // Local fallback
    const local = JSON.parse(localStorage.getItem("reminders") || "[]");
    if (editId) {
      const updated = local.map(r => r.id === editId ? { ...r, ...payload } : r);
      localStorage.setItem("reminders", JSON.stringify(updated));
      setReminders(updated);
    } else {
      const newR = { ...payload, id: Date.now(), created_at: new Date().toISOString() };
      const updated = [...local, newR];
      localStorage.setItem("reminders", JSON.stringify(updated));
      setReminders(updated);
    }
    toast_(editId ? "Reminder updated!" : "Reminder set!");
    setShowForm(false); setEditId(null);
  };

  /* delete */
  const handleDelete = async (id) => {
    try {
      await fetch(`${API}/reminder/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${getToken()}` }
      });
    } catch {}
    const local = JSON.parse(localStorage.getItem("reminders") || "[]");
    const updated = local.filter(r => r.id !== id);
    localStorage.setItem("reminders", JSON.stringify(updated));
    setReminders(prev => prev.filter(r => r.id !== id));
    toast_("Reminder deleted");
  };

  /* edit */
  const handleEdit = (r) => {
    setForm({
      title: r.title,
      interval_days: r.interval_days,
      last_haircut_date: r.last_haircut_date?.split("T")[0] || new Date().toISOString().split("T")[0],
      notify_before_days: r.notify_before_days || 2,
    });
    setEditId(r.id);
    setShowForm(true);
  };

  /* next haircut date calculation */
  const getNextDate = (lastDate, days) => {
    const d = new Date(lastDate);
    d.setDate(d.getDate() + Number(days));
    return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
  };

  return (
    <>
      <Navbar />
      <div className="bg-[#FAF6F0] min-h-screen font-sans text-[#3E362E] selection:bg-[#C5A059] selection:text-white relative overflow-hidden flex flex-col">
        
        {/* Ambient Premium Glow Layers */}
        <div className="absolute top-40 -left-40 w-[500px] h-[500px] bg-[#C5A059]/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-40 -right-40 w-[500px] h-[500px] bg-[#EADDCA]/40 rounded-full blur-[120px] pointer-events-none" />

        {/* HERO HEADER */}
        <div className="relative bg-gradient-to-br from-[#3E362E] to-[#2A241F] pt-12 pb-16 px-4 overflow-hidden shadow-md">
          <div className="absolute inset-0 bg-[radial-gradient(#C5A059_0.5px,transparent_0.5px)] [background-size:16px_16px] opacity-10" />
          
          <div className="max-w-2xl mx-auto relative z-10">
            <div className="flex items-center gap-4 mb-8">
              <button 
                onClick={() => navigate("/customerprofile")}
                className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md border border-white/10 flex items-center justify-center text-white transition-all hover:bg-white hover:text-[#3E362E] hover:scale-105 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <div>
                <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-wide">Haircut Reminders</h1>
                <p className="text-xs text-stone-400 mt-0.5 font-light tracking-wider uppercase">Never miss your next grooming standard</p>
              </div>
            </div>

            {/* Metrics Layout Grid */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: "Active Stays", val: reminders.length },
                { 
                  label: "Due Soon", 
                  val: reminders.filter(r => {
                    const d = Math.ceil((new Date(r.last_haircut_date).getTime() + r.interval_days * 86400000 - Date.now()) / 86400000);
                    return d > 0 && d <= 3;
                  }).length 
                },
                { 
                  label: "Overdue", 
                  val: reminders.filter(r => {
                    const d = Math.ceil((new Date(r.last_haircut_date).getTime() + r.interval_days * 86400000 - Date.now()) / 86400000);
                    return d <= 0;
                  }).length 
                },
              ].map(({ label, val }) => (
                <div key={label} className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-3 text-center shadow-sm">
                  <div className="text-2xl font-serif font-black text-[#C5A059]">{val}</div>
                  <div className="text-[9px] text-stone-400 font-black uppercase tracking-widest mt-1">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* MAIN BODY LAYOUT */}
        <div className="max-w-2xl mx-auto px-4 py-8 pb-24 relative z-10 w-full flex-grow">
          
          {/* TRIGGER CONTROL BUTTON */}
          {!showForm && (
            <button 
              onClick={() => { 
                setShowForm(true); 
                setEditId(null); 
                setForm({ title: "Haircut Reminder", interval_days: 20, last_haircut_date: new Date().toISOString().split("T")[0], notify_before_days: 2 }); 
              }}
              className="w-full bg-[#3E362E] hover:bg-[#4E443A] text-white rounded-2xl py-4 font-black text-xs uppercase tracking-[0.2em] transition-all duration-300 shadow-sm hover:shadow-md flex items-center justify-center gap-2 mb-6 cursor-pointer transform hover:-translate-y-0.5 select-none"
            >
              <Plus className="w-4 h-4 text-[#C5A059]" /> Add New Reminder
            </button>
          )}

          {/* DYNAMIC FORM CONTAINER */}
          {showForm && (
            <div className="bg-white rounded-[28px] border border-[#EADDCA] p-6 mb-6 shadow-sm animate-[slideUp_0.3s_ease]">
              <div className="flex items-center gap-2 mb-6">
                <Sparkles className="w-4 h-4 text-[#C5A059]" />
                <h3 className="font-serif font-bold text-lg text-[#3E362E]">
                  {editId ? "Modify Ritual Target" : "Configure Custom Tracking"}
                </h3>
              </div>

              {/* Input Control Set */}
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest block mb-2">Reminder Label</label>
                  <input 
                    type="text"
                    className="w-full bg-[#FAF6F0] border border-[#EADDCA] rounded-xl px-4 py-3 text-sm font-medium text-[#3E362E] outline-none focus:border-[#C5A059] transition-colors placeholder:text-stone-400"
                    placeholder="e.g. Sharp Fade Renewal"
                    value={form.title}
                    onChange={e => setForm(p => ({ ...p, title: e.target.value }))} 
                  />
                </div>

                <div>
                  <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest block mb-2">Interval Frequency</label>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {PRESET_DAYS.map(d => (
                      <button 
                        key={d}
                        type="button"
                        onClick={() => setForm(p => ({ ...p, interval_days: d }))}
                        className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all select-none cursor-pointer ${
                          form.interval_days === d
                            ? "bg-[#3E362E] text-white shadow-sm"
                            : "bg-[#FAF6F0] text-stone-600 border border-[#EADDCA] hover:bg-[#C5A059]/10"
                        }`}
                      >
                        {d} Days
                      </button>
                    ))}
                    <button 
                      type="button"
                      className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all select-none ${
                        !PRESET_DAYS.includes(form.interval_days)
                          ? "bg-[#3E362E] text-white shadow-sm"
                          : "bg-[#FAF6F0] text-stone-600 border border-[#EADDCA]"
                      }`}
                    >
                      Custom
                    </button>
                  </div>
                  
                  <div className="flex items-center gap-3 max-w-[200px]">
                    <input 
                      type="number" 
                      className="w-full bg-[#FAF6F0] border border-[#EADDCA] rounded-xl px-4 py-2.5 text-sm font-medium text-[#3E362E] outline-none focus:border-[#C5A059] transition-colors"
                      placeholder="Custom standard"
                      value={!PRESET_DAYS.includes(form.interval_days) ? form.interval_days : ""}
                      onChange={e => setForm(p => ({ ...p, interval_days: Number(e.target.value) }))} 
                    />
                    <span className="text-xs font-medium text-stone-400 uppercase tracking-wider">Days</span>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest block mb-2">Last Incident Log</label>
                  <input 
                    type="date"
                    className="w-full bg-[#FAF6F0] border border-[#EADDCA] rounded-xl px-4 py-3 text-sm font-medium text-[#3E362E] outline-none focus:border-[#C5A059] transition-colors"
                    value={form.last_haircut_date}
                    onChange={e => setForm(p => ({ ...p, last_haircut_date: e.target.value }))} 
                  />
                </div>

                <div>
                  <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest block mb-2">Notification Lead Time</label>
                  <div className="flex gap-2">
                    {[1, 2, 3].map(d => (
                      <button 
                        key={d}
                        type="button"
                        onClick={() => setForm(p => ({ ...p, notify_before_days: d }))}
                        className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all select-none cursor-pointer ${
                          form.notify_before_days === d
                            ? "bg-[#3E362E] text-white shadow-sm"
                            : "bg-[#FAF6F0] text-stone-600 border border-[#EADDCA] hover:bg-[#C5A059]/10"
                        }`}
                      >
                        {d} Day{d > 1 ? "s" : ""} Before
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Dynamic Live Preview Box */}
              {form.last_haircut_date && form.interval_days > 0 && (
                <div className="mt-6 p-4 rounded-2xl bg-[#FAF6F0] border border-[#EADDCA] text-left">
                  <div className="flex items-center gap-2 text-stone-400 mb-1">
                    <Calendar className="w-3.5 h-3.5 text-[#C5A059]" />
                    <span className="text-[9px] font-black uppercase tracking-widest">Calculated Target Milestone</span>
                  </div>
                  <div className="text-xl font-serif font-black text-[#3E362E]">
                    {getNextDate(form.last_haircut_date, form.interval_days)}
                  </div>
                  <p className="text-[10px] text-stone-400 mt-1 font-light">
                    Early alert triggers exactly {form.notify_before_days} day{form.notify_before_days > 1 ? "s" : ""} prior.
                  </p>
                </div>
              )}

              {/* Form Actions */}
              <div className="flex gap-3 mt-6">
                <button 
                  onClick={() => { setShowForm(false); setEditId(null); }}
                  className="flex-1 bg-white border border-[#EADDCA] text-stone-600 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all hover:bg-stone-50 cursor-pointer select-none"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSave}
                  className="flex-[2] bg-[#C5A059] hover:bg-[#B48F4B] text-white py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-sm cursor-pointer select-none"
                >
                  {editId ? "Update Standard" : "Establish Tracker"}
                </button>
              </div>
            </div>
          )}

          {/* ACTIVE TRACKERS GRID CONTAINER */}
          {loading ? (
            <div className="text-center py-16">
              <div className="w-8 h-8 border-2 border-[#EADDCA] border-t-[#C5A059] rounded-full mx-auto animate-spin mb-3" />
              <p className="text-xs text-stone-400 tracking-wider font-light uppercase">Synchronizing profiles...</p>
            </div>
          ) : reminders.length === 0 ? (
            <div className="bg-white rounded-[28px] border border-[#EADDCA] p-10 text-center shadow-sm">
              <div className="w-14 h-14 bg-[#FAF6F0] border border-[#EADDCA] rounded-full flex items-center justify-center mx-auto mb-4 text-stone-300">
                <Scissors className="w-6 h-6" />
              </div>
              <h3 className="font-serif font-bold text-lg text-[#3E362E] mb-2">No Tracking Cycles Discovered</h3>
              <p className="text-xs text-stone-400 font-light max-w-sm mx-auto leading-relaxed">
                Establish your typical hair length cycle metrics above. We'll automatically signal your device interface when scheduling parameters peak.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {reminders.map(r => {
                const nextDate = getNextDate(r.last_haircut_date, r.interval_days);
                return (
                  <div key={r.id} className="bg-white rounded-[24px] border border-[#EADDCA] p-5 shadow-[0_8px_25px_rgba(0,0,0,0.01)] hover:shadow-[0_16px_35px_rgba(62,54,46,0.04)] hover:border-[#C5A059]/30 transition-all duration-300 flex flex-col text-left">
                    
                    {/* Header Core Panel */}
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-xl bg-[#FAF6F0] border border-[#EADDCA] flex items-center justify-center text-[#C5A059]">
                          <Scissors className="w-4 h-4" />
                        </div>
                        <div>
                          <h3 className="font-serif font-bold text-base text-[#3E362E]">{r.title}</h3>
                          <p className="text-[10px] text-stone-400 font-medium uppercase tracking-wider mt-0.5">Recurring Frequency: {r.interval_days}d</p>
                        </div>
                      </div>
                      <DaysLeft lastDate={r.last_haircut_date} intervalDays={r.interval_days} />
                    </div>

                    {/* Meta Diagnostics Blocks */}
                    <div className="grid grid-cols-2 gap-2.5 mb-4">
                      {[
                        { icon: Calendar, label: "Last Cut", val: new Date(r.last_haircut_date).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) },
                        { icon: Clock, label: "Target Window", val: nextDate },
                        { icon: Bell, label: "Notification Signal", val: `${r.notify_before_days} day${r.notify_before_days > 1 ? "s" : ""} prior` },
                        { icon: Sparkles, label: "Cadence Mode", val: "Automated" },
                      ].map((item, idx) => (
                        <div key={idx} className="bg-[#FAF6F0]/60 border border-[#EADDCA]/50 rounded-xl p-3">
                          <div className="flex items-center gap-1.5 text-stone-400 mb-1">
                            <item.icon className="w-3 h-3 text-[#C5A059]" />
                            <span className="text-[8px] font-black uppercase tracking-wider">{item.label}</span>
                          </div>
                          <div className="text-xs font-bold text-[#3E362E]">{item.val}</div>
                        </div>
                      ))}
                    </div>

                    {/* Grid Core Operations */}
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleEdit(r)}
                        className="flex-1 bg-[#FAF6F0] hover:bg-stone-100 border border-[#EADDCA] text-stone-600 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-1.5 cursor-pointer select-none"
                      >
                        <Edit3 className="w-3 h-3" /> Edit
                      </button>
                      <button 
                        onClick={() => {
                          const updated = reminders.map(rem =>
                            rem.id === r.id ? { ...rem, last_haircut_date: new Date().toISOString().split("T")[0] } : rem
                          );
                          setReminders(updated);
                          localStorage.setItem("reminders", JSON.stringify(updated));
                          toast_("Cycle Reset! Date synced to today.");
                        }}
                        className="flex-[2] bg-[#3E362E] hover:bg-[#4E443A] text-white py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm select-none"
                      >
                        <Check className="w-3 h-3 text-[#C5A059]" /> Got Haircut Today
                      </button>
                      <button 
                        onClick={() => handleDelete(r.id)}
                        className="w-11 bg-red-50 hover:bg-red-100 border border-red-200/60 rounded-xl flex items-center justify-center text-red-600 transition-all cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* DOCUMENTATION PANEL */}
          <div className="mt-8 bg-gradient-to-br from-[#3E362E] to-[#4E443A] rounded-[24px] p-5 text-white shadow-sm text-left relative overflow-hidden">
            <div className="absolute right-0 bottom-0 translate-x-4 translate-y-4 opacity-5 text-white pointer-events-none">
              <Bell className="w-32 h-32" />
            </div>
            <div className="flex items-center gap-2 mb-4">
              <Info className="w-4 h-4 text-[#C5A059]" />
              <h4 className="font-serif font-bold text-sm tracking-wide">Tracking Operations Walkthrough</h4>
            </div>
            <div className="space-y-3">
              {[
                "Input your tailored length milestones (standard cycles usually range from 15 to 30 days).",
                "The engine cross-references real-time timestamps with your last check-in log.",
                "Automated alerts process ahead of time based on your set notification lead window.",
                "Dispatching the 'Got Haircut Today' action instantly sets your target milestone forward to the next cycle."
              ].map((tip, i) => (
                <div key={i} className="flex gap-3 text-xs text-stone-300 font-light items-start leading-relaxed">
                  <span className="w-5 h-5 rounded-full bg-[#C5A059] text-[#3E362E] font-black text-[9px] flex items-center justify-center flex-shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  <p>{tip}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <Footer />

      {/* TOAST NOTIFICATION STACK */}
      {toast && (
        <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-5 py-3.5 rounded-2xl font-black text-xs uppercase tracking-wider text-white shadow-xl flex items-center gap-2.5 animate-[slideUp_0.2s_ease] ${
          toast.type === "error" ? "bg-red-900 border border-red-700" : "bg-[#3E362E] border border-[#C5A059]/30"
        }`}>
          <div className={`w-5 h-5 rounded-full flex items-center justify-center text-white ${
            toast.type === "error" ? "bg-red-500" : "bg-emerald-500"
          }`}>
            <Check className="w-3 h-3" strokeWidth={3} />
          </div>
          {toast.msg}
        </div>
      )}
    </>
  );
}