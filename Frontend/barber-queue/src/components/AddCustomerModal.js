import React, { useState } from 'react';
import { Modal, Field, inputCls, selectCls } from './Modal';
import { SERVICES, BARBERS, TIME_SLOTS, nextId } from '../constants';

export default function AddCustomerModal({ onClose, onAdd, queue }) {
  const [name,    setName]    = useState('');
  const [phone,   setPhone]   = useState('');
  const [service, setService] = useState('haircut');
  const [barber,  setBarber]  = useState('auto');
  const [mode,    setMode]    = useState('walkin');
  const [slot,    setSlot]    = useState('10:00 AM');
  const [date,    setDate]    = useState('Today');
  const [error,   setError]   = useState('');

  const handleSubmit = () => {
    if (!name.trim()) { setError('Name is required'); return; }
    setError('');
    const assignedBarber = barber === 'auto'
      ? BARBERS[queue.length % BARBERS.length].id
      : parseInt(barber);

    if (mode === 'walkin') {
      onAdd({
        type: 'queue',
        entry: {
          id: nextId(), name: name.trim(), phone, service,
          barber: assignedBarber, position: queue.length + 1,
          joinedAt: Date.now(), source: 'walk-in', status: 'waiting',
        },
      });
    } else {
      onAdd({
        type: 'booking',
        entry: {
          id: nextId(), name: name.trim(), phone, service,
          barber: assignedBarber, slot, date, status: 'confirmed',
        },
      });
    }
    onClose();
  };

  return (
    <Modal title="Add Customer" onClose={onClose}>
      <div className="flex bg-stone-800 rounded-xl p-1 mb-5">
        {[['walkin', '🚶 Walk-In (Queue)'], ['book', '📅 Book Appointment']].map(([m, label]) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`flex-1 py-2 rounded-lg border-none font-sans font-bold text-sm cursor-pointer transition-all duration-200 ${
              mode === m
                ? 'bg-indigo-500 text-white'
                : 'bg-transparent text-stone-500 hover:text-stone-300'
            }`}
          >{label}</button>
        ))}
      </div>

      <Field label="Full Name">
        <input className={inputCls} placeholder="e.g. John Smith" value={name} onChange={(e) => setName(e.target.value)} />
      </Field>
      <Field label="Phone (optional)">
        <input className={inputCls} placeholder="555-0000" value={phone} onChange={(e) => setPhone(e.target.value)} />
      </Field>
      <Field label="Service">
        <select className={selectCls} value={service} onChange={(e) => setService(e.target.value)}>
          {SERVICES.map((s) => (
            <option key={s.id} value={s.id}>{s.label} — {s.mins}min · ${s.price}</option>
          ))}
        </select>
      </Field>
      <Field label="Barber">
        <select className={selectCls} value={barber} onChange={(e) => setBarber(e.target.value)}>
          <option value="auto">⚡ Auto-assign</option>
          {BARBERS.map((b) => (
            <option key={b.id} value={b.id}>{b.emoji} {b.name}</option>
          ))}
        </select>
      </Field>

      {mode === 'book' && (
        <>
          <Field label="Date">
            <select className={selectCls} value={date} onChange={(e) => setDate(e.target.value)}>
              {['Today', 'Tomorrow', 'Day After'].map((d) => <option key={d}>{d}</option>)}
            </select>
          </Field>
          <Field label="Time Slot">
            <select className={selectCls} value={slot} onChange={(e) => setSlot(e.target.value)}>
              {TIME_SLOTS.map((t) => <option key={t}>{t}</option>)}
            </select>
          </Field>
        </>
      )}

      {error && <p className="text-red-400 text-xs mb-3 font-sans">⚠ {error}</p>}

      <button
        onClick={handleSubmit}
        className="w-full py-4 bg-gradient-to-r from-indigo-500 to-violet-500 text-white border-none rounded-2xl font-sans font-extrabold text-base cursor-pointer shadow-lg shadow-indigo-500/30 hover:opacity-90 transition-opacity mt-1"
      >
        {mode === 'walkin' ? '➕ Add to Queue' : '📅 Confirm Booking'}
      </button>
    </Modal>
  );
}