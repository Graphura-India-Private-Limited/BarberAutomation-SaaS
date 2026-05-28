import { useState } from 'react'
import { CUSTOMERS } from "../../config/data"
import CustomerCard from '../../components/customer/CustomerCard'
import DetailPanel from '../../components/customer/DetailPanel'

export default function CustomerInteractionView() {
  const [customers, setCustomers] = useState(CUSTOMERS)
  const [selectedId, setSelectedId] = useState(CUSTOMERS[0]?.id || null)
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
    <div className="min-h-screen bg-[#FAF6F0] flex flex-col font-sans text-[#3E362E] antialiased overflow-hidden selection:bg-[#C5A059] selection:text-white">
      
      {/* Glow effects for luxury depth */}
      <div className="absolute top-20 left-0 w-72 h-72 bg-[#C5A059]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#EADDCA]/30 rounded-full blur-3xl pointer-events-none" />

      {/* ✂️ PREMIUM LUXURY NAVIGATION HEADER BAR */}
      <header className="bg-[#3E362E] border-b border-[#2A241F] px-6 sm:px-8 py-4 flex items-center justify-between z-30 shadow-md relative">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-[#C5A059]/10 border border-[#C5A059]/30 flex items-center justify-center">
            {/* Elegant SVG Scissors Layer */}
            <svg className="w-5 h-5 text-[#C5A059]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M14.121 14.121L19 19m-4.879-4.879l-4.242-4.242M14.121 14.121a3 3 0 10-4.243-4.242m4.243 4.242a3 3 0 11-4.243-4.243m0 0L4 4m5.172 5.172L4 14m5.172-5.172l4.242 4.242" />
            </svg>
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-black text-[#C5A059] tracking-[0.2em] uppercase leading-none">
              BARBER <span className="text-white font-light">PRO</span>
            </h1>
            <p className="text-[9px] text-stone-400 font-bold tracking-[0.25em] uppercase mt-1.5 leading-none">
              Console Management Desk
            </p>
          </div>
        </div>
        
        <div className="text-right">
          <div className="text-[9px] text-[#C5A059] uppercase font-black tracking-[0.3em] leading-none">Live Monitor</div>
          <div className="text-xs sm:text-sm text-white font-black mt-1.5 tracking-wide leading-none">
            {new Date().toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })}
          </div>
        </div>
      </header>

      {/* 📊 ANALYTICS STATS STRIP OVERVIEW */}
      <div className="bg-white/70 backdrop-blur-md border-b border-[#EADDCA] grid grid-cols-4 z-20 shadow-xs relative">
        {[
          { label: 'Total Today', value: counts.total,   color: 'text-[#3E362E]',  border: 'border-r border-[#EADDCA]/60' },
          { label: 'Waiting Queue', value: counts.waiting, color: 'text-amber-600',  border: 'border-r border-[#EADDCA]/60' },
          { label: 'In Service Chair', value: counts.inChair, color: 'text-[#C5A059]', border: 'border-r border-[#EADDCA]/60' },
          { label: 'Completed Jobs', value: counts.done,    color: 'text-emerald-700', border: '' },
        ].map((s) => (
          <div key={s.label} className={`px-3 sm:px-6 py-4 flex flex-col items-center justify-center text-center transition-all duration-300 hover:bg-white/40 ${s.border}`}>
            <div className={`text-xl sm:text-2xl md:text-3xl font-black tracking-tight leading-none ${s.color}`}>
              {String(s.value).padStart(2, '0')}
            </div>
            <div className="text-[8px] sm:text-[10px] font-black uppercase tracking-[0.15em] text-stone-400 mt-2">
              {s.label}
            </div>
          </div>
        ))}
      </div>

      {/* 🧱 LAYOUT WORKSPACE AREA CONTAINER */}
      <div className="flex flex-1 overflow-hidden relative max-w-[1600px] mx-auto w-full px-4 sm:px-6 py-6 gap-6">

        {/* 📋 SIDEBAR QUEUE MANAGER */}
        <aside className="w-[310px] flex-shrink-0 bg-white/60 backdrop-blur-md border border-[#EADDCA] flex flex-col h-full z-10 rounded-[22px] overflow-hidden shadow-[0_15px_40px_rgba(0,0,0,0.01)]">
          
          {/* Search Box Header Section */}
          <div className="p-4 border-b border-[#EADDCA]/60 bg-white/40">
            <div className="relative">
              <input 
                type="text" 
                placeholder="Search active profiles..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full bg-white border border-[#EADDCA] rounded-xl pl-10 pr-4 py-3 text-xs font-medium text-[#3E362E] placeholder-stone-400 outline-none transition-all duration-300 focus:border-[#C5A059] focus:shadow-[0_0_0_4px_rgba(197,160,89,0.08)]"
              />
              {/* Clean Minimal Search Loupe SVG */}
              <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <p className="text-[9px] font-black uppercase tracking-[0.2em] text-[#C5A059] mt-3 pl-0.5">
              Queue: {filtered.length} client{filtered.length !== 1 ? 's' : ''} loaded
            </p>
          </div>

          {/* Scrollable Customer Cards Sidebar Pipeline */}
          <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-2.5 bg-stone-50/10">
            {filtered.length === 0 ? (
              <div className="text-center py-16 flex flex-col items-center justify-center gap-2">
                <svg className="w-8 h-8 text-stone-300" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div className="text-[10px] font-black uppercase tracking-widest text-stone-400">No matching queues</div>
              </div>
            ) : (
              filtered.map((c) => (
                <div key={c.id} className="transition-all duration-300 transform hover:scale-[1.01]">
                  <CustomerCard 
                    customer={c} 
                    isSelected={c.id === selectedId} 
                    onClick={() => setSelectedId(c.id)} 
                  />
                </div>
              ))
            )}
          </div>
        </aside>

        {/* 🔍 ACCENTED DETAIL PROFILE GRID CANVAS */}
        <main className="flex-1 overflow-y-auto bg-white/60 backdrop-blur-md border border-[#EADDCA] rounded-[22px] p-6 shadow-[0_15px_40px_rgba(0,0,0,0.01)] h-full">
          {selected ? (
            <div className="min-h-full">
              <DetailPanel 
                key={selected.id} 
                customer={selected} 
                onUpdate={handleUpdate} 
              />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full gap-3 text-stone-400 text-center py-20">
              <div className="w-12 h-12 rounded-full bg-[#C5A059]/10 flex items-center justify-center mb-1">
                <svg className="w-6 h-6 text-[#C5A059]" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5a2.25 2.25 0 002.25 2.25zm.75-10.5h6a.75.75 0 01.75.75v6a.75.75 0 01-.75.75h-6a.75.75 0 01-.75-.75v-6a.75.75 0 01.75-.75z" />
                </svg>
              </div>
              <p className="text-[10px] font-black uppercase tracking-[0.25em] text-[#3E362E]">
                Select an active profile card to initialize
              </p>
            </div>
          )}
        </main>

      </div>
    </div>
  )
}