import React, { useState } from 'react'
import { 
  Bell, 
  Search, 
  LayoutDashboard, 
  Ticket, 
  Users, 
  BarChart2, 
  Settings, 
  HeadphonesIcon, 
  LogOut, 
  ChevronDown,
  User,
  ShieldAlert,
  History,
  TrendingUp
} from 'lucide-react'

// ══ COLORS ══
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
  analytics: { title: 'Platform Analytics', subtitle: 'Real-time SaaS operational telemetry & insights' },
  users:     { title: 'User Management', subtitle: 'Platform directory database and node provision control' },
  settings:  { title: 'Settings',        subtitle: 'System preferences and configuration' },
}

const NAV_ITEMS = [
  { icon: LayoutDashboard, label: 'Dashboard',       page: 'dashboard' },
  { icon: Ticket,          label: 'All Tickets',     page: 'tickets' },
  { icon: Users,           label: 'Customer Issues', page: 'customer' },
  { icon: HeadphonesIcon,  label: 'Salon Issues',    page: 'salon' },
  { icon: BarChart2,       label: 'Reports',         page: 'reports' },
  { icon: TrendingUp,      label: 'Platform Analytics', page: 'analytics' },
  { icon: User,            label: 'User Management', page: 'users' },
  { icon: Settings,        label: 'Settings',        page: 'settings' },
]

// Added setActivePage and onSignOut to the Header props
export function Header({ activePage, setActivePage, unreadCount = 0, onBellClick, onSignOut }) {
  const { title, subtitle } = PAGE_TITLES[activePage] || PAGE_TITLES.dashboard
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <header style={{
      background: C.bg,
      borderBottom: `1px solid ${C.border}`,
      padding: "48px 32px 0",
      position: "relative",
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
            type="button"
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

          {/* Admin Avatar Container */}
          <div style={{ position: "relative" }}>
            <button
              type="button"
              onClick={() => setDropdownOpen(!dropdownOpen)}
              style={{
                display: "flex", alignItems: "center", gap: 10,
                paddingLeft: 16, borderLeft: `1px solid ${C.border}`, cursor: "pointer",
                background: "transparent", border: "none", color: "inherit",
              }}
            >
              <div style={{
                width: 36, height: 36, borderRadius: "50%",
                background: "#D1BFA5", display: "flex", alignItems: "center",
                justifyContent: "center", fontSize: 13, fontWeight: 700, color: "#fff",
              }}>
                AD
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: C.ink }}>Admin</span>
                <ChevronDown 
                  size={13} 
                  color={C.muted} 
                  style={{ 
                    transform: dropdownOpen ? "rotate(180deg)" : "rotate(0deg)", 
                    transition: "transform 0.2s ease" 
                  }} 
                />
              </div>
            </button>

            {/* Dropdown panel overlay */}
            {dropdownOpen && (
              <>
                <div 
                  onClick={() => setDropdownOpen(false)} 
                  style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, zIndex: 998 }} 
                />
                
                <div style={{
                  position: "absolute",
                  top: "calc(100% + 12px)",
                  right: 0,
                  width: 240,
                  background: C.bg2,
                  border: `1px solid ${C.border}`,
                  borderRadius: 12,
                  boxShadow: "0 10px 25px -5px rgba(28, 25, 23, 0.08), 0 8px 10px -6px rgba(28, 25, 23, 0.04)",
                  padding: "8px 0",
                  zIndex: 999,
                  display: "flex",
                  flexDirection: "column",
                }}>
                  <div style={{ padding: "8px 16px 4px", fontSize: 9, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: "0.12em" }}>
                    Account Details
                  </div>

                  {/* Profile Option -> switches view to Settings tab */}
                  <button
                    type="button"
                    onClick={() => { setDropdownOpen(false); if(setActivePage) setActivePage('settings'); }}
                    style={dropdownItemStyle}
                    onMouseEnter={(e) => { e.currentTarget.style.background = C.bg; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
                  >
                    <User size={15} color={C.gold} />
                    <span style={{ fontWeight: 500, color: C.ink }}>Admin Settings</span>
                  </button>

                  <div style={{ height: 1, background: C.border, margin: "6px 0" }} />

                  <div style={{ padding: "4px 16px 4px", fontSize: 9, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: "0.12em" }}>
                    Escalation Quick links
                  </div>

                  {/* Dashboard Shortcut */}
                  <button
                    type="button"
                    onClick={() => { setDropdownOpen(false); if(setActivePage) setActivePage('dashboard'); }}
                    style={dropdownItemStyle}
                    onMouseEnter={(e) => { e.currentTarget.style.background = C.bg; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
                  >
                    <LayoutDashboard size={15} color={C.gold} />
                    <span style={{ fontWeight: 500, color: C.ink }}>SLA Breach Center</span>
                  </button>

                  {/* Customer Issues Shortcut */}
                  <button
                    type="button"
                    onClick={() => { setDropdownOpen(false); if(setActivePage) setActivePage('customer'); }}
                    style={dropdownItemStyle}
                    onMouseEnter={(e) => { e.currentTarget.style.background = C.bg; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
                  >
                    <Users size={15} color={C.gold} />
                    <span style={{ fontWeight: 500, color: C.ink }}>Customer Approvals</span>
                  </button>

                  {/* Reports Shortcut */}
                  <button
                    type="button"
                    onClick={() => { setDropdownOpen(false); if(setActivePage) setActivePage('reports'); }}
                    style={dropdownItemStyle}
                    onMouseEnter={(e) => { e.currentTarget.style.background = C.bg; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
                  >
                    <BarChart2 size={15} color={C.gold} />
                    <span style={{ fontWeight: 500, color: C.ink }}>System Audit Ledger</span>
                  </button>

                  <div style={{ height: 1, background: C.border, margin: "6px 0" }} />

                  {/* Sign Out Console */}
                  <button
                    type="button"
                    onClick={() => { setDropdownOpen(false); if(onSignOut) onSignOut(); }}
                    style={dropdownItemStyle}
                    onMouseEnter={(e) => { e.currentTarget.style.background = C.redLight; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
                  >
                    <LogOut size={15} color={C.red} />
                    <span style={{ fontWeight: 600, color: C.red }}>Sign Out Console</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Gold divider line */}
      <div style={{ width: "100%", height: 2, background: "#A1804E", opacity: 0.9 }} />
    </header>
  )
}

export function Sidebar({ activePage, setActivePage, onSignOut }) {
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

      {/* Footer Sign Out */}
      <div style={{ padding: 16, borderTop: `1px solid ${C.border}` }}>
        <button
          className="logout-btn"
          onClick={onSignOut}
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

const dropdownItemStyle = {
  display: "flex",
  alignItems: "center",
  gap: 12,
  width: "100%",
  padding: "10px 16px",
  background: "transparent",
  border: "none",
  textAlign: "left",
  fontSize: 13,
  cursor: "pointer",
  transition: "background 0.12s ease",
  fontFamily: "inherit"
};