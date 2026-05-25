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
    <div className="min-h-screen bg-[#FAF6F0] flex flex-col font-sans text-stone-800 antialiased overflow-hidden">

      {/* ✂️ PREMIUM LUXURY NAVIGATION HEADER BAR */}
      <header className="bg-[#3E362E] border-b border-[#2A241F] px-8 py-4 flex items-center justify-between z-30 shadow-md">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-[#C5A059]/20 border border-[#C5A059]/40 flex items-center justify-center">
            {/* Elegant SVG Scissors Layer */}
            <svg className="w-5 h-5 text-[#C5A059]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M14.121 14.121L19 19m-4.879-4.879l-4.242-4.242M14.121 14.121a3 3 0 10-4.243-4.242m4.243 4.242a3 3 0 11-4.243-4.243m0 0L4 4m5.172 5.172L4 14m5.172-5.172l4.242 4.242" />
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-black text-[#C5A059] tracking-[0.15em] uppercase leading-none">
              BARBER <span className="text-white">PRO</span>
            </h1>
            <p className="text-[9px] text-stone-400 font-bold tracking-[0.3em] uppercase mt-1 leading-none">
              Console Management Desk
            </p>
          </div>
        </div>
        
        <div className="text-right">
          <div className="text-[10px] text-stone-400 uppercase font-black tracking-widest leading-none">Live Monitor</div>
          <div className="text-sm text-white font-black mt-1 leading-none">
            {new Date().toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })}
          </div>
        </div>
      </header>

      {/* 📊 ANALYTICS STATS STRIP OVERVIEW */}
      <div className="bg-white/80 backdrop-blur-md border-b border-stone-200/60 grid grid-cols-4 z-20 shadow-xs">
        {[
          { label: 'Total Today', value: counts.total,   color: 'text-stone-900',  border: 'border-r border-stone-100' },
          { label: 'Waiting Queue', value: counts.waiting, color: 'text-amber-600',  border: 'border-r border-stone-100' },
          { label: 'In Service Chair', value: counts.inChair, color: 'text-[#A37B58]', border: 'border-r border-stone-100' },
          { label: 'Completed Jobs', value: counts.done,    color: 'text-emerald-700', border: '' },
        ].map((s) => (
          <div key={s.label} className={`px-6 py-4 flex flex-col items-center justify-center text-center ${s.border}`}>
            <div className={`text-2xl md:text-3xl font-black tracking-tight leading-none ${s.color}`}>
              {s.value}
            </div>
            <div className="text-[10px] font-black uppercase tracking-wider text-stone-400 mt-1.5">
              {s.label}
            </div>
          </div>
        ))}
      </div>

      {/* 🧱 LAYOUT WORKSPACE AREA CONTAINER */}
      <div className="flex flex-1 overflow-hidden relative max-w-[1600px] mx-auto w-full w-full">

        {/* 📋 SIDEBAR QUEUE MANAGER */}
        <aside className="w-[320px] flex-shrink-0 bg-white/50 border-r border-stone-200/50 flex flex-col h-full z-10">
          
          {/* Search Box Header Section */}
          <div className="p-4 border-b border-stone-200/40 bg-white/30 backdrop-blur-xs">
            <div className="relative">
              <input 
                type="text" 
                placeholder="Search active profiles..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full bg-white/80 border border-stone-200/80 rounded-xl pl-10 pr-4 py-3 text-xs font-bold text-stone-900 placeholder-stone-400 outline-none transition-all focus:border-[#C5A059] focus:bg-white shadow-xs"
              />
              {/* Clean Minimal Search Loupe SVG */}
              <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <p className="text-[10px] font-black uppercase tracking-wider text-stone-400 mt-3 pl-0.5">
              Queue: {filtered.length} client{filtered.length !== 1 ? 's' : ''} loaded
            </p>
          </div>

          {/* Scrollable Customer Cards Sidebar Pipeline */}
          <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-2.5 bg-stone-50/20">
            {filtered.length === 0 ? (
              <div className="text-center py-16 flex flex-col items-center justify-center gap-2">
                <svg className="w-8 h-8 text-stone-300" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div className="text-xs font-bold uppercase tracking-wider text-stone-400">No matching queues</div>
              </div>
            ) : (
              filtered.map((c) => (
                <CustomerCard 
                  key={c.id} 
                  customer={c} 
                  isSelected={c.id === selectedId} 
                  onClick={() => setSelectedId(c.id)} 
                />
              ))
            )}
          </div>
        </aside>

        {/* 🔍 ACCENTED DETAIL PROFILE GRID CANVAS */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 bg-[#FAF6F0]">
          {selected ? (
            <div className="bg-white/80 backdrop-blur-sm border border-stone-200/40 rounded-3xl p-6 shadow-sm min-h-full">
              <DetailPanel 
                key={selected.id} 
                customer={selected} 
                onUpdate={handleUpdate} 
              />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full gap-3 text-stone-400 text-center">
              <svg className="w-12 h-12 text-stone-300 animate-pulse" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5a2.25 2.25 0 002.25 2.25zm.75-10.5h6a.75.75 0 01.75.75v6a.75.75 0 01-.75.75h-6a.75.75 0 01-.75-.75v-6a.75.75 0 01.75-.75z" />
              </svg>
              <p className="text-xs font-black uppercase tracking-widest text-stone-400">
                Select an active profile card to initialize
              </p>
            </div>
          )}
        </main>

      </div>
    </div>
  )
}