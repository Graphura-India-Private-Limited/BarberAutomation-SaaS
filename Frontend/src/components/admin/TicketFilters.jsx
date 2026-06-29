import React, { useState, useEffect } from 'react';
import { Search, X, SlidersHorizontal } from 'lucide-react';
import { TICKET_STATUS, TICKET_PRIORITY, TICKET_TYPE } from '../../utils/tickets.jsx';
import CustomSelect from "../common/CustomSelect";

const GOLD = "#C5A059";
const CHARCOAL = "#3E362E";

export function TicketFilters({
  filterStatus, setFilterStatus,
  filterType, setFilterType,
  filterPriority, setFilterPriority,
  filterSalon, setFilterSalon,
  searchQuery, setSearchQuery,
  total,
  hideType = false,
}) {
  const [salons, setSalons] = useState([]);

  useEffect(() => {
    const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
    fetch(`${API}/salon`)
      .then(res => res.json())
      .then(data => {
        if (data.success && data.salons) {
          setSalons(data.salons);
        }
      })
      .catch(err => console.error("Error fetching salons:", err));
  }, []);

  const hasFilters = filterStatus !== 'All' || filterType !== 'All' || filterPriority !== 'All' || (filterSalon && filterSalon !== 'All') || searchQuery !== '';

  const clearAll = () => {
    setFilterStatus('All');
    setFilterType('All');
    setFilterPriority('All');
    if (setFilterSalon) setFilterSalon('All');
    setSearchQuery('');
  };

  const filterBtnClass = (active) =>
    `px-4 py-2 rounded-xl text-[11px] font-black uppercase tracking-wider transition-all duration-200 border cursor-pointer ${
      active
        ? 'bg-[#3E362E] text-white border-transparent shadow-sm'
        : 'bg-[#FAF6F0]/40 text-stone-600 border-[#EADBCE] hover:border-[#C5A059] hover:text-stone-900'
    }`;

  return (
    <div className="bg-white rounded-3xl border border-[#EADBCE] p-6 space-y-6 shadow-3xs text-left font-sans">
      
      {/* Search Input bar */}
      <div className="relative">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#C5A059]" />
        <input
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="Search by ID, title, or customer name..."
          className="w-full pl-11 pr-10 py-3 text-xs border border-[#EADBCE] rounded-xl focus:outline-none focus:border-[#C5A059] focus:bg-white bg-[#FAF6F0]/45 text-stone-850 font-bold placeholder:text-stone-400 shadow-3xs transition-all"
        />
        {searchQuery && (
          <button onClick={() => setSearchQuery('')} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 cursor-pointer">
            <X size={15} />
          </button>
        )}
      </div>

      {/* Filter Options Row */}
      <div className="flex flex-wrap gap-6 items-start">
        
        {/* Status */}
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-[#C5A059] mb-2.5 pl-0.5">Status</p>
          <div className="flex flex-wrap gap-2">
            {['All', ...Object.values(TICKET_STATUS)].map(s => (
              <button key={s} onClick={() => setFilterStatus(s)} className={filterBtnClass(filterStatus === s)}>{s}</button>
            ))}
          </div>
        </div>

        {/* Type (Rendered unless hidden) */}
        {!hideType && (
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#C5A059] mb-2.5 pl-0.5">Type</p>
            <div className="flex flex-wrap gap-2">
              {['All', ...Object.values(TICKET_TYPE)].map(t => (
                <button key={t} onClick={() => setFilterType(t)} className={filterBtnClass(filterType === t)}>{t}</button>
              ))}
            </div>
          </div>
        )}

        {/* Priority */}
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-[#C5A059] mb-2.5 pl-0.5">Priority</p>
          <div className="flex flex-wrap gap-2">
            {['All', ...Object.values(TICKET_PRIORITY)].map(p => (
              <button key={p} onClick={() => setFilterPriority(p)} className={filterBtnClass(filterPriority === p)}>{p}</button>
            ))}
          </div>
        </div>

        {/* Salon Selector (Rendered on Admin panel only) */}
        {setFilterSalon && (
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#C5A059] mb-2.5 pl-0.5">Salon / Studio</p>
            <CustomSelect
              value={filterSalon}
              onChange={setFilterSalon}
              options={[
                { value: "All", label: "All Salons" },
                ...salons.map(s => ({ value: s.salon_name, label: s.salon_name }))
              ]}
              size="sm"
              className="h-10 rounded-xl"
            />
          </div>
        )}
      </div>

      {/* Ledger footer meta info */}
      <div className="flex items-center justify-between pt-4 border-t border-stone-100">
        <div className="flex items-center gap-1.5 text-xs text-stone-500 font-bold">
          <SlidersHorizontal size={13} className="text-[#C5A059]" />
          <span>Showing <span className="font-extrabold text-stone-900">{total}</span> ticket{total !== 1 ? 's' : ''}</span>
        </div>
        {hasFilters && (
          <button onClick={clearAll} className="text-xs text-[#C5A059] hover:text-amber-800 font-bold uppercase tracking-wider flex items-center gap-1 cursor-pointer">
            <X size={12} /> Clear all filters
          </button>
        )}
      </div>
    </div>
  );
}