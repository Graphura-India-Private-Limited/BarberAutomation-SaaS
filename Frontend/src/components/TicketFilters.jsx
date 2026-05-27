import { Search, X } from 'lucide-react'
import { TICKET_STATUS, TICKET_PRIORITY, TICKET_TYPE } from '../utils/tickets.jsx'

export function TicketFilters({
  filterStatus, setFilterStatus,
  filterType, setFilterType,
  filterPriority, setFilterPriority,
  searchQuery, setSearchQuery,
  total,
}) {
  const hasFilters = filterStatus !== 'All' || filterType !== 'All' || filterPriority !== 'All' || searchQuery !== ''

  const clearAll = () => {
    setFilterStatus('All')
    setFilterType('All')
    setFilterPriority('All')
    setSearchQuery('')
  }

  const filterBtnClass = (active) =>
    `px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${
      active
        ? 'bg-orange-600 text-white border-orange-600'
        : 'bg-white text-stone-600 border-orange-200 hover:border-orange-400 hover:text-orange-700'
    }`

  return (
    <div className="bg-white rounded-2xl border border-orange-200 p-4 space-y-4 shadow-sm">
      {/* Search */}
      <div className="relative">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="Search by ID, title, or customer..."
          className="w-full pl-9 pr-4 py-2.5 text-sm border border-orange-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400 bg-orange-50 text-stone-700 placeholder:text-stone-400"
        />
        {searchQuery && (
          <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700">
            <X size={14} />
          </button>
        )}
      </div>

      <div className="flex flex-wrap gap-4">
        {/* Status */}
        <div>
          <p className="text-xs font-semibold text-stone-500 mb-2 uppercase tracking-wider">Status</p>
          <div className="flex flex-wrap gap-1.5">
            {['All', ...Object.values(TICKET_STATUS)].map(s => (
              <button key={s} onClick={() => setFilterStatus(s)} className={filterBtnClass(filterStatus === s)}>{s}</button>
            ))}
          </div>
        </div>

        {/* Type */}
        <div>
          <p className="text-xs font-semibold text-stone-500 mb-2 uppercase tracking-wider">Type</p>
          <div className="flex flex-wrap gap-1.5">
            {['All', ...Object.values(TICKET_TYPE)].map(t => (
              <button key={t} onClick={() => setFilterType(t)} className={filterBtnClass(filterType === t)}>{t}</button>
            ))}
          </div>
        </div>

        {/* Priority */}
        <div>
          <p className="text-xs font-semibold text-stone-500 mb-2 uppercase tracking-wider">Priority</p>
          <div className="flex flex-wrap gap-1.5">
            {['All', ...Object.values(TICKET_PRIORITY)].map(p => (
              <button key={p} onClick={() => setFilterPriority(p)} className={filterBtnClass(filterPriority === p)}>{p}</button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between pt-1 border-t border-orange-100">
        <p className="text-xs text-stone-500">Showing <span className="font-semibold text-stone-700">{total}</span> ticket{total !== 1 ? 's' : ''}</p>
        {hasFilters && (
          <button onClick={clearAll} className="text-xs text-orange-600 hover:text-orange-800 font-medium flex items-center gap-1">
            <X size={12} /> Clear filters
          </button>
        )}
      </div>
    </div>
  )
}
