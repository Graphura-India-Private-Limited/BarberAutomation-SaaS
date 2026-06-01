
// import { StatusBadge, PriorityBadge, TypeBadge } from './TicketBadges.jsx'
// import { formatDistanceToNow } from '../utils/date.jsx'

// export function StatCard({ label, value, icon: Icon, color, sub }) {
//   const colors = {
//     orange: { bg: 'bg-[#F0E8DF]', text: 'text-[#9E7452]', icon: 'text-[#B58B67]', border: 'border-[#E8DDD0]' },
//     blue:   { bg: 'bg-blue-100',   text: 'text-blue-700',   icon: 'text-blue-600',   border: 'border-blue-200' },
//     amber:  { bg: 'bg-amber-100',  text: 'text-amber-700',  icon: 'text-amber-600',  border: 'border-amber-200' },
//     red:    { bg: 'bg-red-100',    text: 'text-red-700',    icon: 'text-red-600',    border: 'border-red-200' },
//     green:  { bg: 'bg-green-100',  text: 'text-green-700',  icon: 'text-green-600',  border: 'border-green-200' },
//     purple: { bg: 'bg-purple-100', text: 'text-purple-700', icon: 'text-purple-600', border: 'border-purple-200' },
//     teal:   { bg: 'bg-teal-100',   text: 'text-teal-700',   icon: 'text-teal-600',   border: 'border-teal-200' },
//     gray:   { bg: 'bg-gray-100',   text: 'text-gray-700',   icon: 'text-gray-500',   border: 'border-gray-200' },
//   }
//   const c = colors[color] || colors.orange

//   return (
//     <div className={`bg-white rounded-2xl border ${c.border} p-5 flex items-start gap-4 shadow-sm hover:shadow-md transition-shadow`}>
//       <div className={`w-12 h-12 rounded-xl ${c.bg} flex items-center justify-center shrink-0`}>
//         <Icon size={22} className={c.icon} />
//       </div>
//       <div className="flex-1 min-w-0">
//         <p className="text-sm text-[#8A7A6A]">{label}</p>
//         <p className={`text-3xl font-bold ${c.text} mt-0.5`}>{value}</p>
//         {sub && <p className="text-xs text-[#8A7A6A] mt-1">{sub}</p>}
//       </div>
//     </div>
//   )
// }

// export function RecentTickets({ tickets, onSelect }) {
//   return (
//     <div className="bg-white rounded-2xl border border-[#E8DDD0] shadow-sm overflow-hidden">
//       <div className="px-5 py-4 border-b border-[#E8DDD0] flex items-center justify-between">
//         <h3 className="font-semibold text-[#3D3126]">Recent Tickets</h3>
//         <span className="text-xs text-[#8A7A6A]">Latest activity</span>
//       </div>
//       <div className="divide-y divide-[#F0E8DF]">
//         {tickets.slice(0, 5).map(ticket => (
//           <button
//             key={ticket.id}
//             onClick={() => onSelect(ticket)}
//             className="w-full text-left px-5 py-3.5 hover:bg-[#FAF6F0] transition-colors flex items-start gap-3"
//           >
//             <div className="flex-1 min-w-0">
//               <div className="flex items-center gap-2 flex-wrap">
//                 <span className="text-xs font-mono text-[#8A7A6A]">{ticket.id}</span>
//                 <TypeBadge type={ticket.type} />
//               </div>
//               <p className="text-sm font-medium text-[#3D3126] mt-1 truncate">{ticket.title}</p>
//               <div className="flex items-center gap-2 mt-1.5 flex-wrap">
//                 <StatusBadge status={ticket.status} />
//                 <PriorityBadge priority={ticket.priority} />
//                 <span className="text-xs text-[#8A7A6A]">{formatDistanceToNow(ticket.updatedAt)}</span>
//               </div>
//             </div>
//           </button>
//         ))}
//       </div>
//     </div>
//   )
// }
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
