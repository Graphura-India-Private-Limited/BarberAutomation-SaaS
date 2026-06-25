import React from 'react';
import { X, User, Phone, Scissors, Calendar, Clock, Info, ShieldCheck, CheckCircle2, Trash2 } from 'lucide-react';
const GOLD = "#C5A059";
const CHARCOAL = "#3E362E";

// ─── CONSTANTS ────────────────────────────────────────────────────────────────
export const AVG_CUT = 20;

export const SERVICES = [
  { id: 'haircut', label: 'Haircut',         mins: 20, price: 15 },
  { id: 'shave',   label: 'Shave',           mins: 15, price: 10 },
  { id: 'beard',   label: 'Beard Trim',      mins: 10, price: 8  },
  { id: 'combo',   label: 'Haircut + Shave', mins: 35, price: 22 },
  { id: 'color',   label: 'Hair Color',      mins: 60, price: 45 },
  { id: 'kids',    label: "Kids' Cut",       mins: 15, price: 10 },
];

export const BARBERS = [
  { id: 'ali',   name: 'Ali',   color: '#C5A059', emoji: '💈' },
  { id: 'ravi',  name: 'Ravi',  color: '#3E362E', emoji: '✂️' },
  { id: 'james', name: 'James', color: '#A37B58', emoji: '👨‍🎨' },
];

export const SLOTS = [
  '9:00 AM','9:30 AM','10:00 AM','10:30 AM','11:00 AM','11:30 AM',
  '12:00 PM','12:30 PM','1:00 PM','1:30 PM','2:00 PM','2:30 PM',
  '3:00 PM','3:30 PM','4:00 PM','4:30 PM','5:00 PM','5:30 PM',
];

export const initQueue = [
  { id:1, name:'Amit Shah',   phone:'9876543210', service:'combo',   barber:'ali',   position:1, joinedAt:Date.now()-900000, source:'walk-in', status:'waiting' },
  { id:2, name:'Priya Nair',  phone:'9123456789', service:'haircut', barber:'ravi',  position:2, joinedAt:Date.now()-600000, source:'booked',  status:'waiting' },
  { id:3, name:'Rahul Gupta', phone:'9988776655', service:'beard',   barber:'james', position:3, joinedAt:Date.now()-300000, source:'walk-in', status:'waiting' },
  { id:4, name:'Sneha Patil', phone:'9765432109', service:'shave',   barber:'ali',   position:4, joinedAt:Date.now()-120000, source:'walk-in', status:'waiting' },
];

export function initBookings() {
  const now = new Date();
  const pad = n => String(n).padStart(2,'0');
  const today = `${now.getFullYear()}-${pad(now.getMonth()+1)}-${pad(now.getDate())}`;
  return [
    { id:101, name:'Kiran Desai', phone:'9871234560', service:'color',   barber:'ravi',  slot:'2:00 PM', date:today, status:'confirmed' },
    { id:102, name:'Meera Joshi', phone:'9845671230', service:'haircut', barber:'ali',   slot:'3:30 PM', date:today, status:'confirmed' },
    { id:103, name:'Arjun Mehta', phone:'9732145670', service:'combo',   barber:'james', slot:'4:00 PM', date:today, status:'confirmed' },
  ];
}

// ─── UTILS ────────────────────────────────────────────────────────────────────
export function timeAgo(ts) {
  const s = Math.floor((Date.now() - ts) / 1000);
  if (s < 60) return `${s}s ago`;
  if (s < 3600) return `${Math.floor(s/60)}m ago`;
  return `${Math.floor(s/3600)}h ago`;
}

export function fmtWait(position, service) {
  const svc = SERVICES.find(s => s.id === service);
  const mins = (position - 1) * AVG_CUT + (svc?.mins ?? AVG_CUT);
  if (mins < 60) return `~${mins}m`;
  return `~${Math.floor(mins/60)}h ${mins%60}m`;
}

// ─── ATOMS ────────────────────────────────────────────────────────────────────
export function LiveDot({ active }) {
  return (
    <span
      className="pulse-dot inline-block rounded-full flex-shrink-0 animate-pulse"
      style={{ width:9, height:9, background: active ? '#15803d' : '#b91c1c' }}
    />
  );
}

export function Toast({ notif }) {
  if (!notif) return null;
  const map = {
    success: { bg: '#3E362E', text: '#FAF6F0', border: '#C5A059' },
    warn:    { bg: '#3E362E', text: '#FAF6F0', border: '#b91c1c' },
    info:    { bg: '#3E362E', text: '#FAF6F0', border: '#EADBCE' },
  };
  const s = map[notif.type] ?? map.info;
  return (
    <div className="animate-slide-up fixed top-6 left-1/2 -translate-x-1/2 z-[9999] px-6 py-3.5 rounded-full font-sans font-bold text-xs uppercase tracking-widest shadow-2xl max-w-sm text-center border"
      style={{ background: s.bg, color: s.text, borderColor: s.border }}>
      {notif.msg}
    </div>
  );
}

export function Chip({ children, color = '#C5A059' }) {
  return (
    <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md border"
      style={{ color, borderColor: `${color}40`, background: `${color}0c`, fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
      {children}
    </span>
  );
}

export function SourceTag({ src }) {
  return src === 'booked'
    ? <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg bg-stone-100 text-stone-700 border border-stone-300/60">Booked</span>
    : <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg bg-[#EADBCE]/30 text-[#A37B58] border border-[#EADBCE]/60">Walk-in</span>;
}

// ─── ADD CUSTOMER MODAL ───────────────────────────────────────────────────────
export function AddCustomerModal({ onClose, onAdd }) {
  const loggedInBarberName = localStorage.getItem("barberName") || localStorage.getItem("name") || "";
  const currentBarberId = loggedInBarberName ? loggedInBarberName.split(" ")[0].toLowerCase() : "";
  const isBarber = localStorage.getItem("role") === "barber";

  const initialBarberId = isBarber && currentBarberId && BARBERS.some(b => b.id === currentBarberId)
    ? currentBarberId
    : BARBERS[0].id;

  const [mode,    setMode]    = React.useState('queue');
  const [name,    setName]    = React.useState('');
  const [phone,   setPhone]   = React.useState('');
  const [service, setService] = React.useState(SERVICES[0].id);
  const [barber,  setBarber]  = React.useState(initialBarberId);
  const [slot,    setSlot]    = React.useState(SLOTS[0]);

  const handleSubmit = () => {
    if (!name.trim()) return;
    const base = { id: Date.now(), name: name.trim(), phone, service, barber };
    if (mode === 'queue') {
      onAdd({ type:'queue', entry: { ...base, joinedAt:Date.now(), source:'walk-in', status:'waiting' } });
    } else {
      const now = new Date(), pad = n => String(n).padStart(2,'0');
      const date = `${now.getFullYear()}-${pad(now.getMonth()+1)}-${pad(now.getDate())}`;
      onAdd({ type:'booking', entry: { ...base, slot, date, status:'confirmed' } });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center p-4 bg-stone-900/40 backdrop-blur-sm transition-all duration-300 animate-in fade-in" onClick={onClose}>
      <style>{`
        .input-field-custom {
          width: 100%;
          background-color: #FFFFFF;
          border: 1px solid #EADBCE;
          border-radius: 14px;
          padding: 12px 16px;
          font-size: 14px;
          font-weight: 700;
          color: #1C1917;
          outline: none;
          transition: all 0.2s ease;
        }
        .input-field-custom:focus {
          border-color: #C5A059;
          box-shadow: 0 0 0 3px rgba(197, 160, 89, 0.1);
        }
        .tab-btn-active {
          background-color: #3E362E !important;
          color: #FFFFFF !important;
        }
        .tab-btn-inactive {
          background-color: transparent !important;
          color: #78716C !important;
        }
        .tab-btn-inactive:hover {
          color: #1C1917 !important;
          background-color: rgba(28, 25, 23, 0.04) !important;
        }
      `}</style>

      <div className="w-full max-w-lg bg-[#FAF6F0] rounded-t-[2.5rem] sm:rounded-[2.5rem] border border-[#EADBCE] shadow-2xl overflow-hidden animate-in slide-in-from-bottom-8 duration-300" onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="flex justify-between items-center px-6 py-5 border-b border-[#EADBCE]/50 bg-white">
          <div className="text-left">
            <p className="font-serif text-2xl font-black text-stone-900 tracking-tight">Add Customer</p>
            <p className="text-[10px] font-black uppercase tracking-widest text-[#A37B58] mt-1">Walk-in or schedule a studio booking</p>
          </div>
          <button onClick={onClose} className="w-9 h-9 rounded-xl flex items-center justify-center border border-stone-200 bg-white text-stone-400 hover:text-stone-800 hover:border-stone-400 transition-all cursor-pointer shadow-3xs">
            <X size={15} />
          </button>
        </div>

        {/* Mode Toggle */}
        <div className="mx-6 mt-5 p-1 rounded-2xl flex gap-1 bg-[#EFEBE4] border border-[#EADBCE]/60">
          {[['queue','Walk-in'],['booking','Booking']].map(([m,l]) => (
            <button key={m} onClick={() => setMode(m)}
              className={`flex-1 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider border-none cursor-pointer transition-all ${mode===m ? 'tab-btn-active shadow-3xs' : 'tab-btn-inactive'}`}>
              {l}
            </button>
          ))}
        </div>

        {/* Form Fields Stack */}
        <div className="p-6 space-y-4 text-left">
          {[
            { label:'Full Name', placeholder:'Customer name', val:name, set:setName, type:'text', icon: <User size={11} color="#C5A059" /> },
            { label:'Phone Number', placeholder:'e.g. 9876543210', val:phone, set:setPhone, type:'tel', icon: <Phone size={11} color="#C5A059" /> },
          ].map(({ label, placeholder, val, set, type, icon }) => (
            <div key={label} className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-wider text-stone-400 ml-0.5 flex items-center gap-1">{icon} {label}</label>
              <input className="input-field-custom" type={type} placeholder={placeholder} value={val} onChange={e=>set(e.target.value)} />
            </div>
          ))}

          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-wider text-stone-400 ml-0.5 flex items-center gap-1"><Scissors size={11} color="#C5A059" /> Service</label>
            <select className="input-field-custom h-[48px] cursor-pointer" value={service} onChange={e=>setService(e.target.value)}>
              {SERVICES.map(s => <option key={s.id} value={s.id}>{s.label} — {s.mins}min · ₹{s.price*80}</option>)}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-wider text-stone-400 ml-0.5 flex items-center gap-1"><Calendar size={11} color="#C5A059" /> Barber</label>
            <select className="input-field-custom h-[48px] cursor-pointer" value={barber} onChange={e=>setBarber(e.target.value)}>
              {(isBarber && currentBarberId && BARBERS.some(b => b.id === currentBarberId)
                ? BARBERS.filter(b => b.id === currentBarberId)
                : BARBERS).map(b => <option key={b.id} value={b.id}>{b.emoji} {b.name}</option>)}
            </select>
          </div>

          {mode === 'booking' && (
            <div className="space-y-1.5 animate-in fade-in slide-in-from-top-2 duration-200">
              <label className="text-[10px] font-black uppercase tracking-wider text-stone-400 ml-0.5 flex items-center gap-1"><Clock size={11} color="#C5A059" /> Time Slot</label>
              <select className="input-field-custom h-[48px] cursor-pointer" value={slot} onChange={e=>setSlot(e.target.value)}>
                {SLOTS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          )}

          {/* Action Footer Trigger */}
          <div className="pt-2">
            <button 
              disabled={!name.trim()}
              onClick={handleSubmit}
              className={`w-full py-4 rounded-xl text-xs font-black uppercase tracking-widest text-white shadow-md transition-all ${
                name.trim() ? 'opacity-100 cursor-pointer active:scale-98 hover:opacity-95' : 'opacity-45 cursor-not-allowed'
              }`}
              style={{ backgroundColor: CHARCOAL }}
            >
              {mode === 'queue' ? '+ Add to Queue Pipeline' : '✓ Confirm System Booking'}
            </button>
          </div>
        </div>

      </div>  
    </div>
  );
}

// ─── DETAIL MODAL ─────────────────────────────────────────────────────────────
export function DetailModal({ entry, isQueue, onClose, onServe, onRemove }) {
  const barber = BARBERS.find(b => b.id === entry.barber);
  const svc    = SERVICES.find(s => s.id === entry.service);

  const fields = isQueue
    ? [['Service', svc?.label], ['Barber', `${barber?.emoji || '💈'} ${barber?.name}`], ['Position', `#${entry.position}`], ['Wait Time', fmtWait(entry.position, entry.service)], ['Source Log', entry.source], ['Joined Stream', timeAgo(entry.joinedAt)]]
    : [['Service', svc?.label], ['Barber', `${barber?.emoji || '💈'} ${barber?.name}`], ['Target Slot', entry.slot], ['Date Log', entry.date], ['System Status', entry.status], ['Phone Signature', entry.phone]];

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center p-4 bg-stone-900/40 backdrop-blur-sm transition-all duration-300 animate-in fade-in" onClick={onClose}>
      <div className="w-full max-w-lg bg-[#FAF6F0] rounded-t-[2.5rem] sm:rounded-[2.5rem] border border-[#EADBCE] shadow-2xl overflow-hidden animate-in slide-in-from-bottom-8 duration-300" onClick={e => e.stopPropagation()}>

        {/* Modal Header */}
        <div className="flex justify-between items-center px-6 py-5 border-b border-[#EADBCE]/50 bg-white">
          <div className="text-left">
            <p className="font-serif text-2xl font-black text-stone-900 tracking-tight">{entry.name}</p>
            <p className="text-[10px] font-mono font-bold text-[#A37B58] tracking-wide uppercase mt-1">Contact: {entry.phone}</p>
          </div>
          <button onClick={onClose} className="w-9 h-9 rounded-xl flex items-center justify-center border border-stone-200 bg-white text-stone-400 hover:text-stone-800 hover:border-stone-400 transition-all cursor-pointer shadow-3xs">
            <X size={15} />
          </button>
        </div>

        {/* Info Grid Allocation */}
        <div className="p-6 text-left">
          <div className="grid grid-cols-2 gap-3 mb-6">
            {fields.map(([k, v]) => (
              <div key={k} className="rounded-2xl p-4 bg-white border border-[#EADBCE]/70 shadow-3xs transition-all duration-200 hover:border-[#C5A059]/40">
                <p className="text-[9px] font-black uppercase tracking-widest text-stone-400 mb-1 flex items-center gap-1">
                  <Info size={10} color="#C5A059" /> {k}
                </p>
                <p className="text-sm font-extrabold text-stone-900 capitalize tracking-tight">{v ?? '—'}</p>
              </div>
            ))}
          </div>

          {/* Action Operations Controller Hub */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button 
              className="flex-1 py-4 rounded-xl font-black text-xs uppercase tracking-widest border border-rose-200 bg-rose-50/40 text-rose-700 hover:bg-rose-600 hover:text-white hover:border-rose-600 transition-all cursor-pointer shadow-3xs flex items-center justify-center gap-1.5"
              onClick={() => { onRemove(entry); onClose(); }}
            >
              <Trash2 size={13} />
              {isQueue ? 'Remove from Queue' : 'Cancel Booking'}
            </button>
            
            {isQueue && entry.position === 1 && (
              <button 
                className="flex-1 py-4 rounded-xl font-black text-xs uppercase tracking-widest text-white shadow-md active:scale-98 hover:opacity-95 transition-all cursor-pointer flex items-center justify-center gap-1.5"
                style={{ backgroundColor: CHARCOAL }}
                onClick={() => { onServe(entry); onClose(); }}
              >
                <CheckCircle2 size={13} color={GOLD} />
                {entry.status === 'in-progress' ? 'Complete Service' : 'Start Service'}
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}