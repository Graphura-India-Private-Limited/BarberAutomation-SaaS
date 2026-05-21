import React from 'react';

// ─── CONSTANTS ────────────────────────────────────────────────────────────────
export const AVG_CUT = 20;

export const SERVICES = [
  { id: 'haircut', label: 'Haircut',        mins: 20, price: 15 },
  { id: 'shave',   label: 'Shave',          mins: 15, price: 10 },
  { id: 'beard',   label: 'Beard Trim',     mins: 10, price: 8  },
  { id: 'combo',   label: 'Haircut + Shave',mins: 35, price: 22 },
  { id: 'color',   label: 'Hair Color',     mins: 60, price: 45 },
  { id: 'kids',    label: "Kids' Cut",      mins: 15, price: 10 },
];

export const BARBERS = [
  { id: 'ali',   name: 'Ali',    color: '#ea580c' },
  { id: 'ravi',  name: 'Ravi',   color: '#0284c7' },
  { id: 'james', name: 'James',  color: '#7c3aed' },
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
      className="pulse-dot inline-block rounded-full flex-shrink-0"
      style={{ width:9, height:9, background: active ? '#16a34a' : '#dc2626' }}
    />
  );
}

export function Toast({ notif }) {
  if (!notif) return null;
  const map = {
    success: { bg:'#16a34a', text:'#fff' },
    warn:    { bg:'#d97706', text:'#fff' },
    info:    { bg:'#ea580c', text:'#fff' },
  };
  const s = map[notif.type] ?? map.info;
  return (
    <div className="animate-slide-up fixed top-4 left-1/2 -translate-x-1/2 z-[9999] px-5 py-3 rounded-2xl font-semibold text-sm shadow-2xl max-w-xs text-center"
      style={{ background: s.bg, color: s.text }}>
      {notif.msg}
    </div>
  );
}

export function Chip({ children, color = '#ea580c' }) {
  return (
    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full border"
      style={{ color, borderColor: color, background: `${color}1a`, fontFamily:'DM Sans, sans-serif' }}>
      {children}
    </span>
  );
}

export function SourceTag({ src }) {
  return src === 'booked'
    ? <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-sky-100 text-sky-800 border border-sky-300"> Booked</span>
    : <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-orange-100 text-orange-800 border border-orange-300"> Walk-in</span>;
}

// ─── ADD CUSTOMER MODAL ───────────────────────────────────────────────────────
export function AddCustomerModal({ onClose, onAdd }) {
  const [mode,    setMode]    = React.useState('queue');
  const [name,    setName]    = React.useState('');
  const [phone,   setPhone]   = React.useState('');
  const [service, setService] = React.useState(SERVICES[0].id);
  const [barber,  setBarber]  = React.useState(BARBERS[0].id);
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
    <div className="animate-fade fixed inset-0 z-[100] flex items-end justify-center sm:items-center"
      style={{ background:'rgba(67,20,7,0.45)', backdropFilter:'blur(6px)' }}
      onClick={onClose}>
      <div className="animate-slide-up w-full max-w-lg p-6 rounded-t-3xl sm:rounded-3xl"
        style={{ background:'#fff7ed', border:'2px solid #fed7aa', boxShadow:'0 20px 60px rgba(194,65,12,0.22)' }}
        onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="flex justify-between items-center mb-5">
          <div>
            <p className="font-display text-2xl font-black text-orange-950">Add Customer</p>
            <p className="text-sm text-orange-500 font-medium mt-0.5">Walk-in or schedule a booking</p>
          </div>
          <button onClick={onClose}
            className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-orange-700 hover:bg-orange-100 transition-colors"
            style={{ border:'2px solid #fed7aa', background:'#fff' }}>✕</button>
        </div>

        {/* Mode Toggle */}
        <div className="flex gap-1 mb-5 p-1 rounded-xl" style={{ background:'#ffedd5', border:'2px solid #fed7aa' }}>
          {[['queue',' Walk-in'],['booking',' Booking']].map(([m,l]) => (
            <button key={m} onClick={() => setMode(m)}
              className={`flex-1 py-2 rounded-lg font-semibold text-sm border-none cursor-pointer transition-all ${mode===m ? 'tab-active shadow-md' : 'tab-inactive'}`}>
              {l}
            </button>
          ))}
        </div>

        <div className="flex flex-col gap-3.5">
          {[
            { label:'Full Name', placeholder:'Customer name', val:name, set:setName, type:'text' },
            { label:'Phone Number', placeholder:'e.g. 9876543210', val:phone, set:setPhone, type:'tel' },
          ].map(({ label, placeholder, val, set, type }) => (
            <div key={label}>
              <label className="block text-xs font-bold uppercase tracking-widest text-orange-600 mb-1.5">{label}</label>
              <input className="input-field" type={type} placeholder={placeholder} value={val} onChange={e=>set(e.target.value)} />
            </div>
          ))}

          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-orange-600 mb-1.5">Service</label>
            <select className="input-field" value={service} onChange={e=>setService(e.target.value)}>
              {SERVICES.map(s => <option key={s.id} value={s.id}>{s.label} — {s.mins}min · ₹{s.price*80}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-orange-600 mb-1.5">Barber</label>
            <select className="input-field" value={barber} onChange={e=>setBarber(e.target.value)}>
              {BARBERS.map(b => <option key={b.id} value={b.id}>{b.emoji} {b.name}</option>)}
            </select>
          </div>

          {mode === 'booking' && (
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-orange-600 mb-1.5">Time Slot</label>
              <select className="input-field" value={slot} onChange={e=>setSlot(e.target.value)}>
                {SLOTS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          )}
        </div>

        <button className="btn-primary w-full mt-5 py-3.5"
          disabled={!name.trim()}
          style={{ opacity: name.trim() ? 1 : 0.45, cursor: name.trim() ? 'pointer' : 'not-allowed' }}
          onClick={handleSubmit}>
          {mode === 'queue' ? '+ Add to Queue' : '✓ Confirm Booking'}
        </button>
      </div>
    </div>
  );
}

// ─── DETAIL MODAL ─────────────────────────────────────────────────────────────
export function DetailModal({ entry, isQueue, onClose, onServe, onRemove }) {
  const barber = BARBERS.find(b => b.id === entry.barber);
  const svc    = SERVICES.find(s => s.id === entry.service);

  const fields = isQueue
    ? [['Service', svc?.label], ['Barber', `${barber?.emoji} ${barber?.name}`], ['Position', `#${entry.position}`], ['Wait', fmtWait(entry.position, entry.service)], ['Source', entry.source], ['Joined', timeAgo(entry.joinedAt)]]
    : [['Service', svc?.label], ['Barber', `${barber?.emoji} ${barber?.name}`], ['Slot', entry.slot], ['Date', entry.date], ['Status', entry.status], ['Phone', entry.phone]];

  return (
    <div className="animate-fade fixed inset-0 z-[100] flex items-end justify-center sm:items-center"
      style={{ background:'rgba(67,20,7,0.45)', backdropFilter:'blur(6px)' }}
      onClick={onClose}>
      <div className="animate-slide-up w-full max-w-lg p-6 rounded-t-3xl sm:rounded-3xl"
        style={{ background:'#fff7ed', border:'2px solid #fed7aa', boxShadow:'0 20px 60px rgba(194,65,12,0.22)' }}
        onClick={e => e.stopPropagation()}>

        <div className="flex justify-between items-start mb-5">
          <div>
            <p className="font-display text-2xl font-black text-orange-950">{entry.name}</p>
            <p className="text-sm text-orange-500 font-medium mt-0.5">{entry.phone}</p>
          </div>
          <button onClick={onClose}
            className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-orange-700 hover:bg-orange-100 transition-colors"
            style={{ border:'2px solid #fed7aa', background:'#fff' }}>✕</button>
        </div>

        <div className="grid grid-cols-2 gap-2.5 mb-5">
          {fields.map(([k, v]) => (
            <div key={k} className="rounded-xl p-3" style={{ background:'#fff', border:'2px solid #fed7aa' }}>
              <p className="text-[10px] font-bold uppercase tracking-widest text-orange-400 mb-1">{k}</p>
              <p className="text-sm font-bold text-orange-950 capitalize">{v ?? '—'}</p>
            </div>
          ))}
        </div>

        <div className="flex gap-2.5">
          <button className="flex-1 py-3 rounded-xl font-bold text-[15px] cursor-pointer transition-colors"
            style={{ background:'#fff', border:'2px solid #fca5a5', color:'#dc2626' }}
            onClick={() => { onRemove(entry.id); onClose(); }}>
            {isQueue ? 'Remove' : 'Cancel Booking'}
          </button>
          {isQueue && entry.position === 1 && (
            <button className="btn-primary flex-1 py-3"
              onClick={() => { onServe(entry.id); onClose(); }}>
              ✓ Mark Served
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
