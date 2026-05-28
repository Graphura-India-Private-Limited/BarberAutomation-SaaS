import { useState, useEffect } from 'react'
import { CUSTOMERS } from "../../config/data"
import CustomerCard from '../../components/customer/CustomerCard'
import DetailPanel from '../../components/customer/DetailPanel'
import Navbar from "../../components/layout/Navbar" 
import Footer from "../../components/layout/Footer" 
import { ArrowLeft, Search, UserMinus } from 'lucide-react' 
import { useNavigate } from 'react-router-dom' 

const GOLD = "#C5A059";

export default function CustomerInteractionView() {
  const [customers, setCustomers] = useState(CUSTOMERS)
  const [selectedId, setSelectedId] = useState(CUSTOMERS[0]?.id || null)
  const [search, setSearch] = useState('')
  const navigate = useNavigate(); 

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
    <div className="min-h-screen bg-[#FAF6F0] flex flex-col font-sans text-[#3E362E] antialiased selection:bg-[#C5A059] selection:text-white relative">
      
      <Navbar />

      {/* Main Wrapper with relative position for glow effects */}
      <div className="flex-1 flex flex-col relative overflow-hidden">
        
        {/* Glow effects for luxury depth */}
        <div className="absolute top-20 left-0 w-72 h-72 bg-[#C5A059]/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#EADDCA]/30 rounded-full blur-3xl pointer-events-none" />

        {/* ✂️ PREMIUM LUXURY NAVIGATION HEADER BAR */}
        <header className="bg-white/80 backdrop-blur-md border-b border-[#EADDCA] px-4 sm:px-8 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between z-30 shadow-xs relative gap-4">
          
          {/* Left Side: Back Button & Branding Wrapper */}
          <div className="flex flex-wrap items-center gap-3 sm:gap-6 w-full sm:w-auto">
            <button 
              onClick={() => navigate('/barber/dashboard')} 
              className="flex items-center gap-2 text-[10px] font-black tracking-widest uppercase transition-all duration-300 hover:bg-[#3E362E] hover:text-white group text-[#3E362E] bg-white px-3.5 py-2.5 rounded-xl border border-[#EADDCA] shadow-xs shrink-0">
              <ArrowLeft size={13} className="transition-transform group-hover:-translate-x-1 text-[#C5A059]" />
              <span>Back to Panel</span>
            </button>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-xl font-black tracking-tight text-[#C5A059] uppercase">Customer Interactions</h1>
              <div className="text-[9px] font-black uppercase tracking-[0.2em] text-[#C5A059] bg-[#C5A059]/10 border border-[#C5A059]/20 px-2.5 py-1 rounded-full hidden xs:inline-block">
                Console
              </div>
            </div>
          </div>
          
          {/* Right Side: Live Monitor Status */}
          <div className="text-left sm:text-right shrink-0 w-full sm:w-auto border-t sm:border-none pt-2 sm:pt-0 border-[#EADDCA]/60 flex sm:flex-col justify-between items-center sm:items-end">
            <div className="text-[9px] text-[#C5A059] uppercase font-black tracking-[0.3em] leading-none">Live Monitor</div>
            <div className="text-xs sm:text-sm text-[#3E362E] font-black mt-1 sm:mt-1.5 tracking-wide leading-none">
              {new Date().toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })}
            </div>
          </div>
        </header>

        {/* 📊 ANALYTICS STATS STRIP OVERVIEW */}
        <div className="bg-white/70 backdrop-blur-md border-b border-[#EADDCA] grid grid-cols-2 md:grid-cols-4 z-20 shadow-xs relative">
          {[
            { label: 'Total Today', value: counts.total,   color: 'text-[#3E362E]',  border: 'border-r border-b md:border-b-0 border-[#EADDCA]/60' },
            { label: 'Waiting Queue', value: counts.waiting, color: 'text-amber-600',  border: 'border-b md:border-b-0 md:border-r border-[#EADDCA]/60' },
            { label: 'In Service Chair', value: counts.inChair, color: 'text-[#C5A059]', border: 'border-r border-[#EADDCA]/60' },
            { label: 'Completed Jobs', value: counts.done,    color: 'text-emerald-700', border: '' },
          ].map((s) => (
            <div key={s.label} className={`px-3 sm:px-6 py-3.5 flex flex-col items-center justify-center text-center transition-all duration-300 hover:bg-white/40 ${s.border}`}>
              <div className={`text-xl sm:text-2xl md:text-3xl font-black tracking-tight leading-none ${s.color}`}>
                {String(s.value).padStart(2, '0')}
              </div>
              <div className="text-[8px] sm:text-[10px] font-black uppercase tracking-[0.15em] text-stone-400 mt-1.5">
                {s.label}
              </div>
            </div>
          ))}
        </div>

        {/* 🧱 LAYOUT WORKSPACE AREA CONTAINER */}
        {/* बदल: लहान स्क्रीन्सवर एकाखाली एक (flex-col) आणि मोठ्या स्क्रीनवर शेजारी (lg:flex-row) दिसेल */}
        <div className="flex flex-col lg:flex-row flex-1 overflow-hidden relative w-full max-w-full px-3 sm:px-4 py-4 gap-4 h-auto lg:h-[calc(100vh-190px)] min-h-[500px]">

          {/* 📋 SIDEBAR QUEUE MANAGER */}
          {/* बदल: मोबाईलवर पूर्ण विड्थ (w-full) आणि डेस्कटॉपवर (lg:w-[400px]) फिक्स रुंदी */}
          <aside className="w-full lg:w-[400px] flex-shrink-0 bg-white/60 backdrop-blur-md border border-[#EADDCA] flex flex-col h-[45vh] lg:h-full z-10 rounded-[22px] overflow-hidden shadow-[0_15px_40px_rgba(0,0,0,0.01)]">
            
            {/* Search Box Header Section */}
            <div className="p-4 border-b border-[#EADDCA]/60 bg-white/40 w-full">
              <div className="relative w-full">
                <input 
                  type="text" 
                  placeholder="Search active profiles..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="w-full bg-white border border-[#EADDCA] rounded-xl pl-10 pr-4 py-2.5 text-xs font-medium text-[#3E362E] placeholder-stone-400 outline-none transition-all duration-300 focus:border-[#C5A059] focus:shadow-[0_0_0_4px_rgba(197,160,89,0.08)]"
                />
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" strokeWidth={2.5} />
              </div>
              <div className="flex justify-between items-center mt-3 px-0.5">
                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-[#C5A059]">
                  Queue: {filtered.length} client{filtered.length !== 1 ? 's' : ''} loaded
                </p>
                {search && (
                  <button onClick={() => setSearch('')} className="text-[9px] font-bold text-stone-400 hover:text-[#3E362E] underline uppercase tracking-wider">
                    Clear
                  </button>
                )}
              </div>
            </div>

            {/* Scrollable Customer Cards Sidebar Pipeline */}
            <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-2 bg-stone-50/10 w-full dynamic-scrollbar">
              {filtered.length === 0 ? (
                <div className="text-center py-12 flex flex-col items-center justify-center gap-2 w-full h-full">
                  <UserMinus className="w-7 h-7 text-stone-300" strokeWidth={1.5} />
                  <div className="text-[10px] font-black uppercase tracking-widest text-stone-400">No matching queues</div>
                </div>
              ) : (
                filtered.map((c) => (
                  <div key={c.id} className="w-full transition-all duration-200 transform active:scale-[0.99]">
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
          {/* बदल: मोबाईलवर स्क्रोल नीट व्हावा म्हणून h-full ऐवजी flex-1 दिला आहे */}
          <main className="flex-1 bg-white/60 backdrop-blur-md border border-[#EADDCA] rounded-[22px] p-4 sm:p-6 shadow-[0_15px_40px_rgba(0,0,0,0.01)] h-[55vh] lg:h-full overflow-y-auto">
            {selected ? (
              <div className="min-h-full">
                <DetailPanel 
                  key={selected.id} 
                  customer={selected} 
                  onUpdate={handleUpdate} 
                />
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full gap-3 text-stone-400 text-center py-16">
                <div className="w-12 h-12 rounded-full bg-[#C5A059]/10 flex items-center justify-center mb-1 animate-pulse">
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
      <Footer />
    </div>
  )
}