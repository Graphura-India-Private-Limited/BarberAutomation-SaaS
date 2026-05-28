// import { Bell, Search, LayoutDashboard, Ticket, Users, BarChart2, Settings, HeadphonesIcon, ChevronRight } from 'lucide-react'

// // ── Page meta ───────────────────────────────────────────────────────────────
// const PAGE_TITLES = {
//   dashboard: { title: 'Dashboard',       subtitle: 'Overview of all support activity' },
//   tickets:   { title: 'All Tickets',     subtitle: 'Manage and resolve support tickets' },
//   customer:  { title: 'Customer Issues', subtitle: 'Tickets raised by customers' },
//   salon:     { title: 'Salon Issues',    subtitle: 'Tickets raised by salon partners' },
//   reports:   { title: 'Reports',         subtitle: 'Analytics and performance metrics' },
//   settings:  { title: 'Settings',        subtitle: 'System preferences and configuration' },
// }

// const NAV_ITEMS = [
//   { icon: LayoutDashboard, label: 'Dashboard',       page: 'dashboard' },
//   { icon: Ticket,          label: 'All Tickets',     page: 'tickets' },
//   { icon: Users,           label: 'Customer Issues', page: 'customer' },
//   { icon: HeadphonesIcon,  label: 'Salon Issues',    page: 'salon' },
//   { icon: BarChart2,       label: 'Reports',         page: 'reports' },
//   { icon: Settings,        label: 'Settings',        page: 'settings' },
// ]

// // ── Header ───────────────────────────────────────────────────────────────────
// export function Header({ activePage, unreadCount = 0, onBellClick }) {
//   const { title, subtitle } = PAGE_TITLES[activePage] || PAGE_TITLES.dashboard

//   return (
//     <header className="bg-orange-50 border-b border-orange-200 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
//       <div>
//         <h1 className="text-2xl font-bold text-stone-800">{title}</h1>
//         <p className="text-sm text-stone-500 mt-0.5">{subtitle}</p>
//       </div>

//       <div className="flex items-center gap-3">
//         <div className="relative hidden sm:flex items-center">
//           <Search size={16} className="absolute left-3 text-stone-400" />
//           <input
//             type="text"
//             placeholder="Quick search..."
//             className="pl-9 pr-4 py-2 text-sm bg-white border border-orange-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400 text-stone-700 w-48"
//           />
//         </div>

//         <button
//           onClick={onBellClick}
//           className="relative p-2 rounded-xl text-stone-500 hover:bg-orange-100 transition-colors"
//         >
//           <Bell size={20} />
//           {unreadCount > 0 && (
//             <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
//               {unreadCount}
//             </span>
//           )}
//         </button>
//       </div>
//     </header>
//   )
// }

// // ── Sidebar ──────────────────────────────────────────────────────────────────
// export function Sidebar({ activePage, setActivePage }) {
//   return (
//     <aside className="w-64 shrink-0 bg-stone-900 text-white flex flex-col min-h-screen">
//       {/* Brand */}
//       <div className="px-6 py-6 border-b border-stone-700">
//         <div className="flex items-center gap-3">
//           <div className="w-9 h-9 rounded-xl bg-orange-500 flex items-center justify-center">
//             <HeadphonesIcon size={18} className="text-white" />
//           </div>
//           <div>
//             <p className="text-xs text-stone-400 leading-none">Admin Panel</p>
//             <p className="text-sm font-semibold text-white leading-tight mt-0.5">Support & Escalation</p>
//           </div>
//         </div>
//       </div>

//       {/* Nav */}
//       <nav className="flex-1 px-3 py-4 space-y-1">
//         <p className="px-3 text-xs font-semibold text-stone-500 uppercase tracking-widest mb-2">Navigation</p>
//         {NAV_ITEMS.map(({ icon: Icon, label, page }) => {
//           const isActive = activePage === page
//           return (
//             <button
//               key={page}
//               onClick={() => setActivePage(page)}
//               className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-150 group ${
//                 isActive ? 'bg-orange-500 text-white' : 'text-stone-400 hover:bg-stone-800 hover:text-white'
//               }`}
//             >
//               <Icon size={18} className="shrink-0" />
//               <span className="flex-1 text-left">{label}</span>
//               {isActive && <ChevronRight size={14} />}
//             </button>
//           )
//         })}
//       </nav>

//       {/* Footer */}
//       <div className="px-4 py-4 border-t border-stone-700">
//         <div className="flex items-center gap-3 px-2">
//           <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-sm font-bold text-white">
//             A
//           </div>
//           <div className="flex-1 min-w-0">
//             <p className="text-sm font-medium text-white truncate">Admin User</p>
//             <p className="text-xs text-stone-400 truncate">admin@platform.in</p>
//           </div>
//         </div>
//       </div>
//     </aside>
//   )
// }

import { Bell, Search, LayoutDashboard, Ticket, Users, BarChart2, Settings, HeadphonesIcon, ChevronRight } from 'lucide-react'

const PAGE_TITLES = {
  dashboard: { title: 'Dashboard',       subtitle: 'Overview of all support activity' },
  tickets:   { title: 'All Tickets',     subtitle: 'Manage and resolve support tickets' },
  customer:  { title: 'Customer Issues', subtitle: 'Tickets raised by customers' },
  salon:     { title: 'Salon Issues',    subtitle: 'Tickets raised by salon partners' },
  reports:   { title: 'Reports',         subtitle: 'Analytics and performance metrics' },
  settings:  { title: 'Settings',        subtitle: 'System preferences and configuration' },
}

const NAV_ITEMS = [
  { icon: LayoutDashboard, label: 'Dashboard',       page: 'dashboard' },
  { icon: Ticket,          label: 'All Tickets',     page: 'tickets' },
  { icon: Users,           label: 'Customer Issues', page: 'customer' },
  { icon: HeadphonesIcon,  label: 'Salon Issues',    page: 'salon' },
  { icon: BarChart2,       label: 'Reports',         page: 'reports' },
  { icon: Settings,        label: 'Settings',        page: 'settings' },
]

export function Header({ activePage, unreadCount = 0, onBellClick }) {
  const { title, subtitle } = PAGE_TITLES[activePage] || PAGE_TITLES.dashboard

  return (
    <header className="bg-[#FAF6F0] border-b border-[#E8DDD0] px-6 py-4 flex items-center justify-between sticky top-0 z-10">
      <div>
        <h1 className="text-2xl font-bold text-[#3D3126]">{title}</h1>
        <p className="text-sm text-[#8A7A6A] mt-0.5">{subtitle}</p>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative hidden sm:flex items-center">
          <Search size={16} className="absolute left-3 text-[#8A7A6A]" />
          <input
            type="text"
            placeholder="Quick search..."
            className="pl-9 pr-4 py-2 text-sm bg-white border border-[#E8DDD0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#B58B67] text-[#3D3126] w-48"
          />
        </div>

        <button
          onClick={onBellClick}
          className="relative p-2 rounded-xl text-[#8A7A6A] hover:bg-[#F0E8DF] transition-colors"
        >
          <Bell size={20} />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
              {unreadCount}
            </span>
          )}
        </button>
      </div>
    </header>
  )
}

export function Sidebar({ activePage, setActivePage }) {
  return (
    <aside className="w-64 shrink-0 bg-[#FFFDF9] text-[#3D3126] flex flex-col min-h-screen border-r border-[#E8DDD0]">
      {/* Brand */}
      <div className="px-6 py-6 border-b border-[#E8DDD0]">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#B58B67] flex items-center justify-center">
            <HeadphonesIcon size={18} className="text-white" />
          </div>
          <div>
            <p className="text-xs text-[#8A7A6A] leading-none">Admin Panel</p>
            <p className="text-sm font-semibold text-[#3D3126] leading-tight mt-0.5">Support & Escalation</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        <p className="px-3 text-xs font-semibold text-[#8A7A6A] uppercase tracking-widest mb-2">Navigation</p>
        {NAV_ITEMS.map(({ icon: Icon, label, page }) => {
          const isActive = activePage === page
          return (
            <button
              key={page}
              onClick={() => setActivePage(page)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-150 group ${
                isActive
                  ? 'bg-[#B58B67] text-white'
                  : 'text-[#8A7A6A] hover:bg-[#F0E8DF] hover:text-[#3D3126]'
              }`}
            >
              <Icon size={18} className="shrink-0" />
              <span className="flex-1 text-left">{label}</span>
              {isActive && <ChevronRight size={14} />}
            </button>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="px-4 py-4 border-t border-[#E8DDD0]">
        <div className="flex items-center gap-3 px-2">
          <div className="w-8 h-8 rounded-full bg-[#B58B67] flex items-center justify-center text-sm font-bold text-white">
            A
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-[#3D3126] truncate">Admin User</p>
            <p className="text-xs text-[#8A7A6A] truncate">Admin Use Only</p>
          </div>
        </div>
      </div>
    </aside>
  )
}
