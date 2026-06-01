
import { StatusBadge, PriorityBadge, TypeBadge } from './TicketBadges.jsx'
import { formatDistanceToNow } from '../utils/date.jsx'

// ══ COLORS — identical to AdminOnboarding palette ══
const C = {
  card: "#FFFFFF",
  ink: "#1C1917",
  muted: "#78716C",
  border: "#E7E5E4",
  gold: "#C5A059",
  goldLight: "#FDF9F3",
  bg: "#FAF6F0",
}

// ══ StatCard — matches AdminOnboarding StatCard exactly ══
export function StatCard({ label, value, icon: Icon, color, sub }) {
  const palette = {
    orange: { iconBg: "#FDF9F3", iconColor: "#C5A059" },
    blue:   { iconBg: "#EFF6FF", iconColor: "#2563EB" },
    amber:  { iconBg: "#FFFBEB", iconColor: "#D97706" },
    red:    { iconBg: "#FEF2F2", iconColor: "#DC2626" },
    green:  { iconBg: "#ECFDF5", iconColor: "#059669" },
    purple: { iconBg: "#F5F3FF", iconColor: "#7C3AED" },
    teal:   { iconBg: "#F0FDFA", iconColor: "#0D9488" },
    gray:   { iconBg: "#F9FAFB", iconColor: "#6B7280" },
  }
  const p = palette[color] || palette.orange

  return (
    <div
      style={{
        background: C.card, borderRadius: 12, padding: "18px 20px",
        border: `1px solid ${C.border}`, boxShadow: "0 1px 4px rgba(0,0,0,.04)",
        transition: "transform 0.2s, box-shadow 0.2s", cursor: "default",
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = "translateY(-2px)"
        e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.1)"
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = "translateY(0)"
        e.currentTarget.style.boxShadow = "0 1px 4px rgba(0,0,0,.04)"
      }}
    >
      <div style={{ fontSize: 13, color: C.muted, fontWeight: 500, marginBottom: 12 }}>{label}</div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{
          fontSize: 26, fontWeight: 700, color: C.ink,
          fontFamily: "Georgia, serif", lineHeight: 1,
        }}>
          {value}
        </div>
        {Icon && (
          <div style={{ padding: 10, borderRadius: 8, background: p.iconBg }}>
            <Icon size={20} color={p.iconColor} />
          </div>
        )}
      </div>
      {sub && (
        <div style={{ fontSize: 12, color: p.iconColor, fontWeight: 500, marginTop: 6 }}>{sub}</div>
      )}
    </div>
  )
}

// ══ RecentTickets — matches AdminOnboarding SectionCard + row style ══
export function RecentTickets({ tickets, onSelect }) {
  return (
    <div style={{
      background: C.card, borderRadius: 16,
      border: `1px solid ${C.border}`,
      overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,.04)",
    }}>
      {/* Header */}
      <div style={{
        padding: "14px 20px", borderBottom: `1px solid ${C.border}`,
        display: "flex", justifyContent: "space-between", alignItems: "center",
      }}>
        <span style={{ fontSize: 16, fontWeight: 700, color: C.ink, fontFamily: "Georgia, serif" }}>
          Recent Tickets
        </span>
        <span style={{ fontSize: 11, color: C.muted, fontWeight: 500 }}>Latest activity</span>
      </div>

      {/* Rows */}
      <div>
        {tickets.slice(0, 5).map((ticket, i) => (
          <button
            key={ticket.id}
            onClick={() => onSelect(ticket)}
            style={{
              width: "100%", textAlign: "left",
              padding: "12px 20px",
              borderBottom: i < Math.min(tickets.length, 5) - 1 ? `1px solid ${C.border}` : "none",
              background: "transparent", border: "none", cursor: "pointer",
              display: "flex", alignItems: "center", gap: 12,
              transition: "background 0.15s",
              fontFamily: "inherit",
            }}
            onMouseEnter={e => e.currentTarget.style.background = C.bg}
            onMouseLeave={e => e.currentTarget.style.background = "transparent"}
          >
            {/* Left: ID + title + badges */}
            <div style={{ flex: 1, minWidth: 0, textAlign: "left" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
                <span style={{ fontSize: 11, fontFamily: "monospace", color: C.muted }}>{ticket.id}</span>
                <TypeBadge type={ticket.type} />
              </div>
              <p style={{ fontSize: 13, fontWeight: 600, color: C.ink, marginBottom: 5, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {ticket.title}
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                <StatusBadge status={ticket.status} />
                <PriorityBadge priority={ticket.priority} />
                <span style={{ fontSize: 11, color: C.muted }}>{formatDistanceToNow(ticket.updatedAt)}</span>
              </div>
            </div>
          </button>
        ))}

        {tickets.length === 0 && (
          <div style={{ padding: "40px 20px", textAlign: "center", color: C.muted, fontSize: 13 }}>
            No tickets yet
          </div>
        )}
      </div>
    </div>
  )
}
