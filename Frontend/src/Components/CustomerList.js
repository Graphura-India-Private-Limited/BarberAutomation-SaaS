
import React, { useState } from 'react';
import CustomerRow from './CustomerRow';
import { nextId } from '../constants';
import { getInitials } from '../utils';

export default function CustomerList({ customers, setCustomers, onEarn, onRedeem, onSelect, onAdd }) {
  const [showForm, setShowForm] = useState(false);
  const [name,     setName]     = useState('');
  const [phone,    setPhone]    = useState('');
  const [plan,     setPlan]     = useState('Basic');
  const [error,    setError]    = useState('');

  const handleAdd = () => {
    if (!name.trim()) { setError('Name is required'); return; }
    const newCust = {
      id:       nextId(),
      name:     name.trim(),
      initials: getInitials(name.trim()),
      phone:    phone.trim() || '—',
      plan,
      points:   0,
      visits:   0,
      joinedAt: new Date().toISOString().slice(0, 10),
    };
    setCustomers((prev) => [...prev, newCust]);
    onAdd(`${newCust.name} added as ${plan} member!`);
    setName(''); setPhone(''); setPlan('Basic'); setError(''); setShowForm(false);
  };

  const inputCls = "w-full bg-white border border-[#E8C9B0] rounded-xl px-3 py-2.5 text-[#5C3D2E] text-sm font-sans outline-none focus:border-[#C8896A] transition-colors mb-3";

  return (
    <div>
      <div className="flex justify-between items-center mb-3">
        <p className="font-sans font-bold text-[#7A4F3A] text-xs tracking-widest uppercase m-0">All Customers</p>
        <button
          onClick={() => setShowForm((v) => !v)}
          className="bg-[#5C3D2E] text-white border border-[#5C3D2E] rounded-lg px-3 py-1.5 font-sans font-bold text-xs cursor-pointer hover:opacity-80 transition-colors"
        >{showForm ? 'Cancel' : '+ Add Customer'}</button>
      </div>

      {showForm && (
        <div className="bg-[#F5E6D8] border border-[#E8C9B0] rounded-2xl p-4 mb-4">
          <p className="text-[11px] text-[#A0785A] uppercase tracking-widest mb-1.5">Full Name *</p>
          <input className={inputCls} placeholder="e.g. Mayur K." value={name} onChange={(e) => setName(e.target.value)} />
          <p className="text-[11px] text-[#A0785A] uppercase tracking-widest mb-1.5">Phone</p>
          <input className={inputCls} placeholder="955-010-5897" value={phone} onChange={(e) => setPhone(e.target.value)} />
          <p className="text-[11px] text-[#A0785A] uppercase tracking-widest mb-1.5">Membership Plan</p>
          <select className={inputCls} value={plan} onChange={(e) => setPlan(e.target.value)}>
            <option value="Basic">Basic — Free (10 pts/visit)</option>
            <option value="Silver">Silver — ₹299/mo (20 pts/visit)</option>
            <option value="Gold">Gold — ₹599/mo (30 pts/visit)</option>
          </select>
          {error && <p className="text-red-500 text-xs mb-2 font-sans">⚠ {error}</p>}
          <button
            onClick={handleAdd}
            className="w-full py-3 bg-[#5C3D2E] text-white border-none rounded-xl font-sans font-bold text-sm cursor-pointer hover:opacity-80 transition-opacity"
          >Add Customer</button>
        </div>
      )}

      <div className="bg-white border border-[#E8C9B0] rounded-2xl px-4">
        {customers.length === 0
          ? <p className="text-[#A0785A] text-sm text-center py-8 font-sans">No customers yet. Add one above.</p>
          : customers.map((c) => (
              <CustomerRow
                key={c.id} customer={c}
                onEarn={onEarn} onRedeem={onRedeem}
                onClick={() => onSelect(c)}
              />
            ))
        }
      </div>
    </div>
  );
}