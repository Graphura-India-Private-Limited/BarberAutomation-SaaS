
import { useState } from 'react'
import { CUSTOMERS } from '../data'
import CustomerCard from '../Components/CustomerCard'
import DetailPanel from '../Components/DetailPanel'

export default function CustomerInteractionView() {
  const [customers, setCustomers] = useState(CUSTOMERS)
  const [selectedId, setSelectedId] = useState(CUSTOMERS[0].id)
  const [search, setSearch] = useState('')

  const selected = customers.find(c => c.id === selectedId)

  const filtered = customers.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.service.toLowerCase().includes(search.toLowerCase()) ||
    c.status.toLowerCase().includes(search.toLowerCase())
  )

  function handleUpdate(updated) {
    setCustomers(cs => cs.map(c => c.id === updated.id ? updated : c))
  }

  const counts = {
    total:   customers.length,
    waiting: customers.filter(c => c.status === 'Waiting').length,
    inChair: customers.filter(c => c.status === 'In Chair').length,
    done:    customers.filter(c => c.status === 'Completed').length,
  }

  return (
    <div className="min-h-screen bg-bg flex flex-col">

      {/* Header */}
      <header className="gradient-header px-6 py-3.5 flex items-center justify-between animate-fade-up"
        style={{ boxShadow: '0 4px 18px rgba(26,10,0,0.30)' }}>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center">
            <span className="text-white text-[15px] font-bold leading-none">✂</span>
          </div>
          <div>
            <h1 className="font-display text-[17px] font-bold text-white leading-none text-shadow">
              BarberAutomation
            </h1>
            <p className="text-[10px] text-white/55 font-body mt-0.5 tracking-[0.1em] uppercase">
            </p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-[10px] text-white/45 font-body uppercase tracking-widest">Today</div>
          <div className="text-[13px] text-white font-body font-bold mt-0.5">
            {new Date().toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })}
          </div>
        </div>
      </header>

      {/* Stats strip */}
      <div className="flex border-b border-border bg-white animate-fade-up delay-75"
        style={{ boxShadow: '0 2px 8px rgba(26,10,0,0.07)' }}>
        {[
          { label: 'Total Today', value: counts.total,   color: 'text-primary'     },
          { label: 'Waiting',     value: counts.waiting, color: 'text-amber-700'   },
          { label: 'In Chair',    value: counts.inChair, color: 'text-accent'      },
          { label: 'Completed',   value: counts.done,    color: 'text-emerald-700' },
        ].map((s, i) => (
          <div key={s.label} className={`flex-1 px-4 py-4 text-center ${i < 3 ? 'border-r border-border' : ''}`}>
            <div className={`font-display text-[26px] font-bold leading-none ${s.color}`}>{s.value}</div>
            <div className="text-[10px] font-bold uppercase tracking-[0.1em] text-muted mt-1.5 font-body">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Layout */}
      <div className="flex flex-1 overflow-hidden">

        {/* Sidebar */}
        <aside className="flex-shrink-0 border-r border-border bg-surface flex flex-col animate-slide-in"
          style={{ width: '284px' }}>

          <div className="px-3.5 pt-3.5 pb-3 border-b border-border/60">
            <div className="relative">
              <input type="text" placeholder="Search customers..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full bg-input-bg border border-border rounded-xl pl-9 pr-3.5 py-2.5 text-[13px] text-primary font-body font-medium outline-none focus:border-accent transition-spring placeholder:text-muted/50 shadow-inner"
              />
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted text-[15px] leading-none">⌕</span>
            </div>
            <p className="text-[11px] text-muted font-body font-medium mt-2 pl-0.5">
              {filtered.length} customer{filtered.length !== 1 ? 's' : ''} today
            </p>
          </div>

          <div className="flex-1 overflow-y-auto custom-scroll px-2.5 py-2.5 flex flex-col gap-2">
            {filtered.length === 0 ? (
              <div className="text-center py-10 flex flex-col items-center gap-2">
                <div className="text-3xl"></div>
                <div className="text-[12px] text-muted font-body font-medium">No customers found</div>
              </div>
            ) : (
              filtered.map((c, i) => (
                <div key={c.id} className="animate-fade-up" style={{ animationDelay: `${i * 55}ms` }}>
                  <CustomerCard customer={c} isSelected={c.id === selectedId} onClick={() => setSelectedId(c.id)} />
                </div>
              ))
            )}
          </div>
        </aside>

        {/* Detail */}
        <main className="flex-1 overflow-y-auto custom-scroll p-5 bg-bg animate-fade-up delay-150">
          {selected ? (
            <DetailPanel key={selected.id} customer={selected} onUpdate={handleUpdate} />
          ) : (
            <div className="flex flex-col items-center justify-center h-full gap-2 text-muted">
              <div className="text-4xl"></div>
              <p className="font-body text-[13px] font-medium">Select a customer to view details</p>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
