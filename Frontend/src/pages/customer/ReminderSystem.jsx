import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const getToken = () => localStorage.getItem("token");

/* ── ICONS ── */
const Ic = {
  bell:    (c="#C5A059",s=22)=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>,
  scissors:(c="#C5A059",s=22)=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><line x1="20" y1="4" x2="8.12" y2="15.88"/><line x1="14.47" y1="14.48" x2="20" y2="20"/><line x1="8.12" y1="8.12" x2="12" y2="12"/></svg>,
  clock:   (c="#C5A059",s=22)=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  check:   (c="#fff",s=16)=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
  trash:   (c="#EF4444",s=16)=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>,
  edit:    (c="#6366F1",s=16)=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
  back:    (c="#3E362E",s=20)=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>,
  plus:    (c="#fff",s=18)=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  calendar:(c="#C5A059",s=20)=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
};

const PRESET_DAYS = [15, 20, 30];

/* ── Days left badge ── */
const DaysLeft = ({ lastDate, intervalDays }) => {
  const last = new Date(lastDate);
  const next = new Date(last.getTime() + intervalDays * 24 * 60 * 60 * 1000);
  const today = new Date();
  const diff  = Math.ceil((next - today) / (1000 * 60 * 60 * 24));

  if (diff <= 0) return (
    <span style={{ background:"#FEE2E2", color:"#991B1B", padding:"3px 10px", borderRadius:20, fontSize:11, fontWeight:800 }}>
      Overdue {Math.abs(diff)}d
    </span>
  );
  if (diff <= 3) return (
    <span style={{ background:"#FEF9C3", color:"#854D0E", padding:"3px 10px", borderRadius:20, fontSize:11, fontWeight:800 }}>
      Due in {diff}d
    </span>
  );
  return (
    <span style={{ background:"#DCFCE7", color:"#166534", padding:"3px 10px", borderRadius:20, fontSize:11, fontWeight:800 }}>
      {diff}d left
    </span>
  );
};

export default function ReminderSystem() {
  const navigate = useNavigate();
  const [reminders,   setReminders]   = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [showForm,    setShowForm]    = useState(false);
  const [editId,      setEditId]      = useState(null);
  const [toast,       setToast]       = useState(null);
  const [customDays,  setCustomDays]  = useState("");
  const [form, setForm] = useState({
    title: "Haircut Reminder",
    interval_days: 20,
    last_haircut_date: new Date().toISOString().split("T")[0],
    notify_before_days: 2,
  });

  const toast_ = (msg, type="success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  /* load reminders */
  const load = async () => {
    setLoading(true);
    try {
      const res  = await fetch(`${API}/reminder`, {
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      const data = await res.json();
      if (data.success) setReminders(data.reminders);
    } catch {
      // use local storage fallback
      const local = JSON.parse(localStorage.getItem("reminders") || "[]");
      setReminders(local);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

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
      const url    = editId ? `${API}/reminder/${editId}` : `${API}/reminder`;
      const method = editId ? "PUT" : "POST";
      const res    = await fetch(url, {
        method,
        headers: { "Content-Type":"application/json", Authorization:`Bearer ${getToken()}` },
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

  /* next haircut date */
  const getNextDate = (lastDate, days) => {
    const d = new Date(lastDate);
    d.setDate(d.getDate() + Number(days));
    return d.toLocaleDateString("en-IN", { day:"2-digit", month:"short", year:"numeric" });
  };

  return (
    <div style={{ minHeight:"100vh", background:"#FFFBF2", fontFamily:"'DM Sans','Segoe UI',sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        @keyframes fadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:.6}}
        .nb{background:none;border:none;cursor:pointer;font-family:'DM Sans',sans-serif}
        .card{background:#fff;border-radius:18px;border:1px solid #EAD8C0;box-shadow:0 4px 20px rgba(62,54,46,.07)}
        .inp{width:100%;padding:11px 14px;border-radius:11px;border:1.5px solid #EAD8C0;font-size:14px;font-family:'DM Sans',sans-serif;color:#3E362E;background:#FFFBF2;outline:none;transition:border .2s}
        .inp:focus{border-color:#C5A059}
        .btn-gold{background:linear-gradient(135deg,#C5A059,#E8A840);color:#fff;border:none;border-radius:12px;padding:12px 24px;font-weight:800;font-size:14px;cursor:pointer;font-family:'DM Sans',sans-serif;transition:all .2s}
        .btn-gold:hover{filter:brightness(1.08);transform:translateY(-1px)}
        .preset{padding:8px 18px;border-radius:10px;font-size:13px;font-weight:700;cursor:pointer;transition:all .2s;font-family:'DM Sans',sans-serif}
        .reminder-card{animation:fadeUp .4s ease}
        .reminder-card:hover{transform:translateY(-2px);box-shadow:0 8px 32px rgba(62,54,46,.12)!important}
      `}</style>

      {/* HEADER */}
      <div style={{ background:"linear-gradient(135deg,#3E362E,#5C4A3A)", padding:"24px 20px 0" }}>
        <div style={{ maxWidth:640, margin:"0 auto" }}>
          <div style={{ display:"flex", alignItems:"center", gap:14, marginBottom:24 }}>
            <button className="nb" onClick={() => navigate("/customerprofile")}
              style={{ width:38, height:38, borderRadius:"50%", background:"rgba(255,255,255,.12)", display:"flex", alignItems:"center", justifyContent:"center" }}>
              {Ic.back("#fff")}
            </button>
            <div>
              <h1 style={{ fontSize:22, fontWeight:800, color:"#fff", letterSpacing:-.5 }}>Haircut Reminders</h1>
              <p style={{ fontSize:12, color:"rgba(255,255,255,.6)", marginTop:2 }}>Never miss your next haircut</p>
            </div>
          </div>

          {/* Stats row */}
          <div style={{ display:"flex", gap:12, paddingBottom:20 }}>
            {[
              { label:"Active Reminders", val: reminders.length },
              { label:"Due Soon",         val: reminders.filter(r => {
                  const d = Math.ceil((new Date(r.last_haircut_date).getTime() + r.interval_days*86400000 - Date.now()) / 86400000);
                  return d <= 3;
                }).length },
              { label:"Overdue",          val: reminders.filter(r => {
                  const d = Math.ceil((new Date(r.last_haircut_date).getTime() + r.interval_days*86400000 - Date.now()) / 86400000);
                  return d <= 0;
                }).length },
            ].map(({ label, val }) => (
              <div key={label} style={{ flex:1, background:"rgba(255,255,255,.1)", borderRadius:14, padding:"12px 14px", textAlign:"center" }}>
                <div style={{ fontSize:22, fontWeight:800, color:"#E8A840" }}>{val}</div>
                <div style={{ fontSize:10, color:"rgba(255,255,255,.7)", fontWeight:600, marginTop:2 }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth:640, margin:"0 auto", padding:"24px 16px 80px" }}>

        {/* ADD BUTTON */}
        {!showForm && (
          <button className="btn-gold" onClick={() => { setShowForm(true); setEditId(null); setForm({ title:"Haircut Reminder", interval_days:20, last_haircut_date: new Date().toISOString().split("T")[0], notify_before_days:2 }); }}
            style={{ width:"100%", marginBottom:20, display:"flex", alignItems:"center", justifyContent:"center", gap:8, fontSize:15 }}>
            {Ic.plus()} Add New Reminder
          </button>
        )}

        {/* FORM */}
        {showForm && (
          <div className="card" style={{ padding:22, marginBottom:20, animation:"fadeUp .3s ease" }}>
            <h3 style={{ fontSize:16, fontWeight:800, color:"#3E362E", marginBottom:18 }}>
              {editId ? "Edit Reminder" : "Set New Reminder"}
            </h3>

            {/* Title */}
            <div style={{ marginBottom:14 }}>
              <label style={{ fontSize:12, fontWeight:700, color:"#8D7B68", display:"block", marginBottom:6 }}>REMINDER NAME</label>
              <input className="inp" placeholder="e.g. Haircut Reminder"
                value={form.title}
                onChange={e => setForm(p => ({ ...p, title:e.target.value }))} />
            </div>

            {/* Interval */}
            <div style={{ marginBottom:14 }}>
              <label style={{ fontSize:12, fontWeight:700, color:"#8D7B68", display:"block", marginBottom:8 }}>REMIND EVERY</label>
              <div style={{ display:"flex", gap:8, marginBottom:10, flexWrap:"wrap" }}>
                {PRESET_DAYS.map(d => (
                  <button key={d} className="nb preset" onClick={() => setForm(p => ({ ...p, interval_days:d }))}
                    style={{ background:form.interval_days===d?"linear-gradient(135deg,#C5A059,#E8A840)":"#F9F5EF", color:form.interval_days===d?"#fff":"#8D7B68", border:`1.5px solid ${form.interval_days===d?"#C5A059":"#EAD8C0"}` }}>
                    {d} Days
                  </button>
                ))}
                <button className="nb preset" onClick={() => {}} style={{ background:![15,20,30].includes(form.interval_days)?"linear-gradient(135deg,#C5A059,#E8A840)":"#F9F5EF", color:![15,20,30].includes(form.interval_days)?"#fff":"#8D7B68", border:`1.5px solid ${![15,20,30].includes(form.interval_days)?"#C5A059":"#EAD8C0"}` }}>
                  Custom
                </button>
              </div>
              {/* Custom input */}
              <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                <input className="inp" type="number" placeholder="Custom days (e.g. 25)"
                  style={{ maxWidth:180 }}
                  value={![15,20,30].includes(form.interval_days) ? form.interval_days : ""}
                  onChange={e => { setForm(p => ({ ...p, interval_days: Number(e.target.value) })); setCustomDays(e.target.value); }} />
                <span style={{ fontSize:12, color:"#8D7B68" }}>days</span>
              </div>
            </div>

            {/* Last haircut date */}
            <div style={{ marginBottom:14 }}>
              <label style={{ fontSize:12, fontWeight:700, color:"#8D7B68", display:"block", marginBottom:6 }}>LAST HAIRCUT DATE</label>
              <input className="inp" type="date"
                value={form.last_haircut_date}
                onChange={e => setForm(p => ({ ...p, last_haircut_date: e.target.value }))} />
            </div>

            {/* Notify before */}
            <div style={{ marginBottom:18 }}>
              <label style={{ fontSize:12, fontWeight:700, color:"#8D7B68", display:"block", marginBottom:6 }}>NOTIFY ME BEFORE (DAYS)</label>
              <div style={{ display:"flex", gap:8 }}>
                {[1,2,3].map(d => (
                  <button key={d} className="nb preset" onClick={() => setForm(p => ({ ...p, notify_before_days:d }))}
                    style={{ background:form.notify_before_days===d?"linear-gradient(135deg,#C5A059,#E8A840)":"#F9F5EF", color:form.notify_before_days===d?"#fff":"#8D7B68", border:`1.5px solid ${form.notify_before_days===d?"#C5A059":"#EAD8C0"}` }}>
                    {d} Day{d>1?"s":""}
                  </button>
                ))}
              </div>
            </div>

            {/* Preview */}
            {form.last_haircut_date && form.interval_days && (
              <div style={{ background:"#FDF5E6", borderRadius:12, padding:"12px 16px", marginBottom:18, border:"1px solid #EAD8C0" }}>
                <p style={{ fontSize:12, fontWeight:700, color:"#8D7B68", marginBottom:4 }}>NEXT HAIRCUT DATE</p>
                <p style={{ fontSize:18, fontWeight:800, color:"#C5A059" }}>
                  {getNextDate(form.last_haircut_date, form.interval_days)}
                </p>
                <p style={{ fontSize:11, color:"#8D7B68", marginTop:4 }}>
                  You'll be notified {form.notify_before_days} day{form.notify_before_days>1?"s":""} before
                </p>
              </div>
            )}

            <div style={{ display:"flex", gap:10 }}>
              <button className="nb" onClick={() => { setShowForm(false); setEditId(null); }}
                style={{ flex:1, padding:"12px", borderRadius:12, border:"1.5px solid #EAD8C0", fontWeight:700, fontSize:14, color:"#8D7B68", cursor:"pointer" }}>
                Cancel
              </button>
              <button className="btn-gold" onClick={handleSave} style={{ flex:2 }}>
                {editId ? "Update Reminder" : "Set Reminder"}
              </button>
            </div>
          </div>
        )}

        {/* REMINDER CARDS */}
        {loading ? (
          <div style={{ textAlign:"center", padding:"40px 0" }}>
            <div style={{ width:40, height:40, border:"3px solid #EAD8C0", borderTopColor:"#C5A059", borderRadius:"50%", margin:"0 auto 12px", animation:"pulse 1s infinite" }}/>
            <p style={{ color:"#8D7B68", fontSize:13 }}>Loading reminders...</p>
          </div>
        ) : reminders.length === 0 ? (
          <div className="card" style={{ padding:"40px 20px", textAlign:"center", animation:"fadeUp .4s ease" }}>
            {Ic.scissors("#EAD8C0", 48)}
            <h3 style={{ fontSize:18, fontWeight:800, color:"#3E362E", margin:"16px 0 8px" }}>No Reminders Yet</h3>
            <p style={{ fontSize:13, color:"#8D7B68", lineHeight:1.6 }}>
              Set your first haircut reminder and we'll tell you when it's time to visit your barber!
            </p>
          </div>
        ) : (
          <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
            {reminders.map(r => {
              const nextDate = getNextDate(r.last_haircut_date, r.interval_days);
              return (
                <div key={r.id} className="card reminder-card" style={{ padding:18, transition:"all .2s" }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:14 }}>
                    <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                      <div style={{ width:44, height:44, borderRadius:13, background:"linear-gradient(135deg,#FEF3E2,#FDE8C0)", display:"flex", alignItems:"center", justifyContent:"center" }}>
                        {Ic.scissors()}
                      </div>
                      <div>
                        <h3 style={{ fontSize:15, fontWeight:800, color:"#3E362E" }}>{r.title}</h3>
                        <p style={{ fontSize:11, color:"#8D7B68", marginTop:2 }}>Every {r.interval_days} days</p>
                      </div>
                    </div>
                    <DaysLeft lastDate={r.last_haircut_date} intervalDays={r.interval_days} />
                  </div>

                  {/* Info rows */}
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:14 }}>
                    {[
                      { icon: Ic.calendar, label:"Last Haircut", val: new Date(r.last_haircut_date).toLocaleDateString("en-IN",{ day:"2-digit", month:"short", year:"numeric" }) },
                      { icon: Ic.clock,    label:"Next Haircut", val: nextDate },
                      { icon: Ic.bell,     label:"Notify Before", val: `${r.notify_before_days} day${r.notify_before_days>1?"s":""}` },
                      { icon: Ic.scissors, label:"Interval",      val: `${r.interval_days} days` },
                    ].map(({ icon, label, val }) => (
                      <div key={label} style={{ background:"#FFFBF2", borderRadius:10, padding:"10px 12px", border:"1px solid #EAD8C0" }}>
                        <div style={{ display:"flex", alignItems:"center", gap:5, marginBottom:4 }}>
                          {icon("#C5A059", 13)}
                          <span style={{ fontSize:10, fontWeight:700, color:"#8D7B68", textTransform:"uppercase", letterSpacing:.5 }}>{label}</span>
                        </div>
                        <span style={{ fontSize:13, fontWeight:700, color:"#3E362E" }}>{val}</span>
                      </div>
                    ))}
                  </div>

                  {/* Actions */}
                  <div style={{ display:"flex", gap:8 }}>
                    <button className="nb" onClick={() => handleEdit(r)}
                      style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center", gap:6, padding:"9px", borderRadius:10, background:"#EEF2FF", border:"none", cursor:"pointer", fontSize:12, fontWeight:700, color:"#6366F1" }}>
                      {Ic.edit()} Edit
                    </button>
                    <button className="nb"
                      onClick={() => {
                        // Mark as done — update last haircut date to today
                        const updated = reminders.map(rem =>
                          rem.id === r.id ? { ...rem, last_haircut_date: new Date().toISOString().split("T")[0] } : rem
                        );
                        setReminders(updated);
                        localStorage.setItem("reminders", JSON.stringify(updated));
                        toast_("Haircut done! Reminder reset to today.");
                      }}
                      style={{ flex:2, display:"flex", alignItems:"center", justifyContent:"center", gap:6, padding:"9px", borderRadius:10, background:"linear-gradient(135deg,#C5A059,#E8A840)", border:"none", cursor:"pointer", fontSize:12, fontWeight:800, color:"#fff" }}>
                      {Ic.check()} Got Haircut Today!
                    </button>
                    <button className="nb" onClick={() => handleDelete(r.id)}
                      style={{ width:40, display:"flex", alignItems:"center", justifyContent:"center", padding:"9px", borderRadius:10, background:"#FEF2F2", border:"none", cursor:"pointer" }}>
                      {Ic.trash()}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* INFO CARD */}
        <div style={{ marginTop:20, background:"linear-gradient(135deg,#3E362E,#5C4A3A)", borderRadius:18, padding:20, color:"#fff" }}>
          <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:10 }}>
            {Ic.bell("#E8A840", 18)}
            <h4 style={{ fontSize:14, fontWeight:800 }}>How it works</h4>
          </div>
          {[
            "Set your preferred haircut interval (15, 20, or 30 days)",
            "We track your last haircut date",
            "Get reminded before your next appointment is due",
            "Click 'Got Haircut Today!' to reset the timer",
          ].map((tip, i) => (
            <div key={i} style={{ display:"flex", gap:10, marginBottom:8, fontSize:12, color:"rgba(255,255,255,.8)", alignItems:"flex-start" }}>
              <span style={{ width:18, height:18, borderRadius:"50%", background:"#C5A059", display:"inline-flex", alignItems:"center", justifyContent:"center", fontSize:9, fontWeight:800, flexShrink:0, marginTop:1 }}>{i+1}</span>
              {tip}
            </div>
          ))}
        </div>
      </div>

      {/* TOAST */}
      {toast && (
        <div style={{ position:"fixed", bottom:24, left:"50%", transform:"translateX(-50%)", zIndex:600,
          background: toast.type==="error"?"#991B1B":"#3E362E",
          color:"#fff", padding:"12px 24px", borderRadius:14, fontWeight:700, fontSize:13,
          boxShadow:"0 8px 24px rgba(0,0,0,.25)", display:"flex", alignItems:"center", gap:10,
          animation:"fadeUp .3s ease", whiteSpace:"nowrap" }}>
          <span style={{ width:20, height:20, borderRadius:"50%", background: toast.type==="error"?"#EF4444":"#22C55E", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
            {Ic.check()}
          </span>
          {toast.msg}
        </div>
      )}
    </div>
  );
}
