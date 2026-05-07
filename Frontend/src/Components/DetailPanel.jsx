import { useState } from 'react'
import StatusBadge from './StatusBadge'
import { SERVICES, BOOKING_TYPES } from '../data'

function SectionLabel({ children }) {
  return (
    <div className="text-[10px] font-bold uppercase tracking-[0.12em] text-muted mb-1.5">
      {children}
    </div>
  )
}

function StatBox({ label, value, accent }) {
  return (
    <div className="bg-card-warm border border-border/60 rounded-xl px-3.5 py-3 shadow-inner">
      <div className="text-[10px] font-bold uppercase tracking-[0.12em] text-muted mb-1">{label}</div>
      <div className={`font-display font-bold text-[22px] leading-none ${accent ? 'text-accent' : 'text-primary'}`}>
        {value}
      </div>
    </div>
  )
}

function InfoBox({ label, value }) {
  return (
    <div className="bg-card-warm border border-border/60 rounded-xl px-3.5 py-3 shadow-inner">
      <div className="text-[10px] font-bold uppercase tracking-[0.12em] text-muted mb-1">{label}</div>
      <div className="font-body font-bold text-[14px] text-primary">{value || '—'}</div>
    </div>
  )
}

function Divider() {
  return (
    <div className="flex items-center gap-3 my-4">
      <div className="flex-1 h-px bg-border" />
      <div className="w-5 h-5 rounded-full border-2 border-border bg-surface flex items-center justify-center">
        <div className="w-1.5 h-1.5 rounded-full gradient-accent" />
      </div>
      <div className="flex-1 h-px bg-border" />
    </div>
  )
}

export default function DetailPanel({ customer, onUpdate }) {
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({
    service:     customer.service,
    bookingType: customer.bookingType,
    notes:       customer.notes,
    status:      customer.status,
  })
  const [saved, setSaved] = useState(false)

  if (form.service !== customer.service && !editing) {
    setForm({
      service:     customer.service,
      bookingType: customer.bookingType,
      notes:       customer.notes,
      status:      customer.status,
    })
  }

  function handleSave() {
    onUpdate({ ...customer, ...form })
    setEditing(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  function handleCancel() {
    setForm({
      service:     customer.service,
      bookingType: customer.bookingType,
      notes:       customer.notes,
      status:      customer.status,
    })
    setEditing(false)
  }

  return (
    <div className="flex flex-col animate-fade-up max-w-2xl">

      {/* Hero Card */}
      <div className="bg-white rounded-2xl border border-border shadow-card p-5 mb-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3.5">
            <div className="w-14 h-14 rounded-xl gradient-avatar flex items-center justify-center shadow-glow flex-shrink-0">
              <span className="font-display font-bold text-xl text-white">{customer.avatar}</span>
            </div>
            <div>
              <h2 className="font-display text-[20px] font-bold text-primary leading-tight text-shadow">
                {customer.name}
              </h2>
              <p className="text-[11px] font-mono text-muted mt-0.5">
                +91 {customer.phone}
              </p>
            </div>
          </div>
          <StatusBadge status={form.status} />
        </div>

        <div className="grid grid-cols-3 gap-2.5">
          <StatBox label="Loyalty Points" value={`${customer.loyaltyPts} pts`} accent />
          <StatBox label="Total Visits"   value={customer.visits} />
          <div className="bg-card-warm border border-border/60 rounded-xl px-3.5 py-3 shadow-inner">
            <div className="text-[10px] font-bold uppercase tracking-[0.12em] text-muted mb-1">Barber</div>
            <div className="font-body font-bold text-[13px] text-primary leading-snug">{customer.barber}</div>
          </div>
        </div>
      </div>

      {/* Timing */}
      <div className="grid grid-cols-2 gap-2.5 mb-4">
        <InfoBox label="Arrival Time"  value={customer.arrivalTime} />
        <InfoBox label="Est. Duration" value={customer.duration} />
      </div>

      <Divider />

      {/* Editable section */}
      {editing ? (
        <div className="bg-white rounded-2xl border border-border shadow-card p-5 flex flex-col gap-4">
          <h3 className="font-display text-[15px] font-bold text-primary border-b border-border pb-3">
            Edit Interaction
          </h3>

          <div>
            <SectionLabel>Service Selected</SectionLabel>
            <select
              value={form.service}
              onChange={e => setForm(f => ({ ...f, service: e.target.value }))}
              className="w-full bg-input-bg border-2 border-border rounded-xl px-3.5 py-2.5 text-[13px] text-primary font-body font-semibold outline-none focus:border-accent transition-spring appearance-none cursor-pointer shadow-inner"
            >
              {SERVICES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          <div>
            <SectionLabel>Booking Type</SectionLabel>
            <div className="flex gap-2">
              {BOOKING_TYPES.map(bt => (
                <button key={bt}
                  onClick={() => setForm(f => ({ ...f, bookingType: bt }))}
                  className={`flex-1 py-2.5 rounded-xl text-[12px] font-bold font-body border-2 transition-spring
                    ${form.bookingType === bt
                      ? 'gradient-accent text-white border-transparent shadow-glow'
                      : 'bg-input-bg border-border text-muted hover:border-accent/40 hover:text-primary'}`}>
                  {bt}
                </button>
              ))}
            </div>
          </div>

          <div>
            <SectionLabel>Status</SectionLabel>
            <div className="flex gap-2">
              {['Waiting', 'In Chair', 'Completed'].map(st => (
                <button key={st}
                  onClick={() => setForm(f => ({ ...f, status: st }))}
                  className={`flex-1 py-2.5 rounded-xl text-[12px] font-bold font-body border-2 transition-spring
                    ${form.status === st
                      ? 'bg-primary text-white border-primary shadow-card'
                      : 'bg-input-bg border-border text-muted hover:border-primary/40 hover:text-primary'}`}>
                  {st}
                </button>
              ))}
            </div>
          </div>

          <div>
            <SectionLabel>Notes</SectionLabel>
            <textarea rows={3} placeholder="Add special instructions or preferences..."
              value={form.notes}
              onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
              className="w-full bg-input-bg border-2 border-border rounded-xl px-3.5 py-2.5 text-[13px] text-primary font-body font-medium outline-none focus:border-accent transition-spring resize-none placeholder:text-muted/50 shadow-inner"
            />
          </div>

          <div className="flex gap-2.5">
            <button onClick={handleCancel}
              className="flex-1 py-3 rounded-xl border-2 border-border text-primary text-[13px] font-bold font-body hover:border-primary transition-spring">
              Cancel
            </button>
            <button onClick={handleSave}
              className="flex-1 py-3 rounded-xl gradient-accent text-white text-[13px] font-bold font-body shadow-glow hover:opacity-90 transition-spring">
              Save Changes
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-border shadow-card p-5 flex flex-col gap-4">

          <div>
            <SectionLabel>Service Selected</SectionLabel>
            <div className="flex items-center gap-2.5">
              <span className="px-2.5 py-1 rounded-lg bg-accent/10 border border-accent/35 text-[11px] text-accent font-mono font-bold tracking-wider">
                {customer.serviceCode}
              </span>
              <span className="text-[13px] text-primary font-body font-bold">{form.service}</span>
            </div>
          </div>

          <div>
            <SectionLabel>Booking Type</SectionLabel>
            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-bold font-body border-2
              ${form.bookingType === 'Walk-in'     ? 'bg-amber-50 text-amber-900 border-amber-200'    : ''}
              ${form.bookingType === 'Appointment' ? 'bg-blue-50  text-blue-900  border-blue-200'     : ''}
              ${form.bookingType === 'Online'      ? 'bg-emerald-50 text-emerald-900 border-emerald-200' : ''}`}>
              {form.bookingType === 'Walk-in' }
              {form.bookingType === 'Appointment'}
              {form.bookingType === 'Online'}
              &nbsp;{form.bookingType}
            </span>
          </div>

          <div>
            <SectionLabel>Notes</SectionLabel>
            {form.notes ? (
              <div className="bg-card-warm border border-border rounded-xl px-4 py-3 shadow-inner"
                style={{ borderLeft: '3px solid #B5622A', borderRadius: '0 12px 12px 0' }}>
                <p className="text-[13px] text-primary font-body font-medium leading-relaxed">{form.notes}</p>
              </div>
            ) : (
              <div className="bg-input-bg border-2 border-dashed border-border rounded-xl px-4 py-3">
                <p className="text-[12px] text-muted font-body italic">No notes added yet.</p>
              </div>
            )}
          </div>

          <button onClick={() => setEditing(true)}
            className="w-full py-3 rounded-xl gradient-accent text-white text-[13px] font-bold font-body shadow-glow hover:opacity-90 transition-spring">
             Edit Interaction
          </button>

          {saved && (
            <div className="flex items-center gap-2 justify-center py-2.5 rounded-xl bg-ok-bg border border-ok-bdr/40 text-ok-txt text-[12px] font-bold font-body animate-fade-up">
               Changes saved successfully
            </div>
          )}
        </div>
      )}
    </div>
  )
}
