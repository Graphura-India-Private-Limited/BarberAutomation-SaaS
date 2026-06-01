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

// import { Bell, Search, LayoutDashboard, Ticket, Users, BarChart2, Settings, HeadphonesIcon, ChevronRight } from 'lucide-react'

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

// export function Header({ activePage, unreadCount = 0, onBellClick }) {
//   const { title, subtitle } = PAGE_TITLES[activePage] || PAGE_TITLES.dashboard

//   return (
//     <header className="bg-[#FAF6F0] border-b border-[#E8DDD0] px-6 py-4 flex items-center justify-between sticky top-0 z-10">
//       <div>
//         <h1 className="text-2xl font-bold text-[#3D3126]">{title}</h1>
//         <p className="text-sm text-[#8A7A6A] mt-0.5">{subtitle}</p>
//       </div>

//       <div className="flex items-center gap-3">
//         <div className="relative hidden sm:flex items-center">
//           <Search size={16} className="absolute left-3 text-[#8A7A6A]" />
//           <input
//             type="text"
//             placeholder="Quick search..."
//             className="pl-9 pr-4 py-2 text-sm bg-white border border-[#E8DDD0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#B58B67] text-[#3D3126] w-48"
//           />
//         </div>

//         <button
//           onClick={onBellClick}
//           className="relative p-2 rounded-xl text-[#8A7A6A] hover:bg-[#F0E8DF] transition-colors"
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


// export function Sidebar({ activePage, setActivePage }) {
//   return (
//     <aside className="w-64 shrink-0 bg-[#FFFDF9] text-[#3D3126] flex flex-col min-h-screen border-r border-[#E8DDD0]">
//       {/* Brand */}
//       <div className="px-6 py-6 border-b border-[#E8DDD0]">
//         <div className="flex items-center gap-3">
//           <div className="w-9 h-9 rounded-xl bg-[#B58B67] flex items-center justify-center">
//             <HeadphonesIcon size={18} className="text-white" />
//           </div>
//           <div>
//             <p className="text-xs text-[#8A7A6A] leading-none">Admin Panel</p>
//             <p className="text-sm font-semibold text-[#3D3126] leading-tight mt-0.5">Support & Escalation</p>
//           </div>
//         </div>
//       </div>

//       {/* Nav */}
//       <nav className="flex-1 px-3 py-4 space-y-1">
//         <p className="px-3 text-xs font-semibold text-[#8A7A6A] uppercase tracking-widest mb-2">Navigation</p>
//         {NAV_ITEMS.map(({ icon: Icon, label, page }) => {
//           const isActive = activePage === page
//           return (
//             <button
//               key={page}
//               onClick={() => setActivePage(page)}
//               className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-150 group ${
//                 isActive
//                   ? 'bg-[#B58B67] text-white'
//                   : 'text-[#8A7A6A] hover:bg-[#F0E8DF] hover:text-[#3D3126]'
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
//       <div className="px-4 py-4 border-t border-[#E8DDD0]">
//         <div className="flex items-center gap-3 px-2">
//           <div className="w-8 h-8 rounded-full bg-[#B58B67] flex items-center justify-center text-sm font-bold text-white">
//             A
//           </div>
//           <div className="flex-1 min-w-0">
//             <p className="text-sm font-medium text-[#3D3126] truncate">Admin User</p>
//             <p className="text-xs text-[#8A7A6A] truncate">Admin Use Only</p>
//           </div>
//         </div>
//       </div>
//     </aside>
//   )
// }
import { Bell, Search, LayoutDashboard, Ticket, Users, BarChart2, Settings, HeadphonesIcon, LogOut, ChevronDown } from 'lucide-react'

// ══ COLORS — identical to AdminOnboarding palette ══
const C = {
  bg: "#FAF6F0",
  bg2: "#FFFFFF",
  card: "#FFFFFF",
  sidebar: "#FFFFFF",
  ink: "#1C1917",
  muted: "#78716C",
  border: "#E7E5E4",
  gold: "#C5A059",
  goldD: "#8B6A2E",
  goldLight: "#FDF9F3",
  red: "#DC2626",
  redLight: "#FEF2F2",
}

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

export function Header({ activePage, unreadCount = 0, onBellClick, onRefresh, loading }) {
  const { title, subtitle } = PAGE_TITLES[activePage] || PAGE_TITLES.dashboard

  return (
    <header style={{
      background: C.bg,
      borderBottom: `1px solid ${C.border}`,
      padding: "48px 32px 0",
    }}>
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", paddingBottom: 24 }}>
        {/* Title */}
        <div>
          <h1 style={{
            fontSize: 42, fontWeight: 700, color: C.ink,
            fontFamily: "Georgia, serif", lineHeight: 1, marginBottom: 8,
          }}>
            {title}
          </h1>
          <p style={{ fontSize: 15, fontWeight: 500, color: C.muted }}>{subtitle}</p>
        </div>

        {/* Right actions */}
        <div style={{ display: "flex", alignItems: "center", gap: 16, paddingBottom: 4 }}>
          {/* Search */}
          <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
            <Search size={14} style={{ position: "absolute", left: 12, color: C.muted, pointerEvents: "none" }} />
            <input
              type="text"
              placeholder="Quick search..."
              style={{
                paddingLeft: 34, paddingRight: 14, paddingTop: 8, paddingBottom: 8,
                fontSize: 13, background: C.bg2, border: `1px solid ${C.border}`,
                borderRadius: 99, outline: "none", color: C.ink,
                fontFamily: "inherit", width: 192,
              }}
            />
          </div>

          {/* Bell */}
          <button
            onClick={onBellClick}
            style={{
              position: "relative", width: 40, height: 40, borderRadius: "50%",
              display: "flex", alignItems: "center", justifyContent: "center",
              background: C.bg2, border: `1px solid ${C.border}`, cursor: "pointer",
            }}
          >
            <Bell size={17} color={C.muted} />
            {unreadCount > 0 && (
              <span style={{
                position: "absolute", top: -1, right: -1,
                minWidth: 17, height: 17, padding: "0 3px", borderRadius: 99,
                background: C.gold, color: "#fff", fontSize: 10, fontWeight: 700,
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: "0 0 0 2px #fff",
              }}>
                {unreadCount}
              </span>
            )}
          </button>

          {/* Admin avatar */}
          <div style={{
            display: "flex", alignItems: "center", gap: 10,
            paddingLeft: 16, borderLeft: `1px solid ${C.border}`, cursor: "pointer",
          }}>
            <div style={{
              width: 36, height: 36, borderRadius: "50%",
              background: "#D1BFA5", display: "flex", alignItems: "center",
              justifyContent: "center", fontSize: 13, fontWeight: 700, color: "#fff",
            }}>
              AD
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: C.ink }}>Admin</span>
              <ChevronDown size={13} color={C.muted} />
            </div>
          </div>
        </div>
      </div>

      {/* Gold divider line */}
      <div style={{ width: "100%", height: 2, background: "#A1804E", opacity: 0.9 }} />
    </header>
  )
}

export function Sidebar({ activePage, setActivePage }) {
  return (
    <aside style={{
      width: 256, background: C.sidebar, display: "flex", flexDirection: "column",
      flexShrink: 0, position: "sticky", top: 0, height: "100vh", overflowY: "auto",
      borderRight: `1px solid ${C.border}`,
    }}>
      <style>{`
        .nav-sb-btn:hover { background: #FAF6F0 !important; color: #1C1917 !important; }
        .logout-btn:hover { background: #FEF2F2 !important; }
      `}</style>

      {/* Brand */}
      <div style={{ padding: "24px 20px 20px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 8,
            background: C.goldLight,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <HeadphonesIcon size={16} color={C.gold} />
          </div>
          <div>
            <div style={{ fontSize: 9, color: C.muted, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", lineHeight: 1 }}>Admin Panel</div>
            <div style={{ fontSize: 15, fontWeight: 700, color: C.ink, fontFamily: "Georgia, serif", letterSpacing: "-0.01em", lineHeight: 1.3 }}>Support & Escalation</div>
          </div>
        </div>
      </div>

      {/* Nav label */}
      <div style={{ padding: "0 28px 6px" }}>
        <span style={{ fontSize: 9, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: "0.18em" }}>Navigation</span>
      </div>

      {/* Nav items */}
      <nav style={{ padding: "0 16px", flex: 1, display: "flex", flexDirection: "column", gap: 2 }}>
        {NAV_ITEMS.map(({ icon: Icon, label, page }) => {
          const isActive = activePage === page
          return (
            <button
              key={page}
              className={isActive ? "" : "nav-sb-btn"}
              onClick={() => setActivePage(page)}
              style={{
                display: "flex", alignItems: "center", gap: 10, width: "100%",
                padding: "10px 12px", borderRadius: 8,
                background: isActive ? C.goldLight : "transparent",
                border: "none",
                borderLeft: isActive ? `3px solid ${C.gold}` : "3px solid transparent",
                color: isActive ? C.gold : C.muted,
                fontSize: 13, fontWeight: isActive ? 600 : 500,
                textAlign: "left", cursor: "pointer", transition: "all 0.18s",
                fontFamily: "inherit",
              }}
            >
              <Icon size={16} strokeWidth={isActive ? 2.5 : 2} style={{ color: isActive ? C.gold : C.muted, flexShrink: 0 }} />
              <span style={{ flex: 1 }}>{label}</span>
            </button>
          )
        })}
      </nav>

      {/* Footer */}
      <div style={{ padding: 16, borderTop: `1px solid ${C.border}` }}>
        <button
          className="logout-btn"
          onClick={() => {}}
          style={{
            display: "flex", alignItems: "center", gap: 10, width: "100%",
            padding: "10px 12px", borderRadius: 8, background: "transparent",
            border: "none", color: C.red, fontSize: 13, fontWeight: 500,
            textAlign: "left", cursor: "pointer", transition: "background 0.18s", fontFamily: "inherit",
          }}
        >
          <LogOut size={16} color={C.red} />
          Sign Out
        </button>
      </div>
    </aside>
  )
}
