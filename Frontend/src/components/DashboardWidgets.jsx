
import { StatusBadge, PriorityBadge, TypeBadge } from './TicketBadges.jsx'
import { formatDistanceToNow } from '../utils/date.jsx'

export function StatCard({ label, value, icon: Icon, color, sub }) {
  const colors = {
    orange: { bg: 'bg-[#F0E8DF]', text: 'text-[#9E7452]', icon: 'text-[#B58B67]', border: 'border-[#E8DDD0]' },
    blue:   { bg: 'bg-blue-100',   text: 'text-blue-700',   icon: 'text-blue-600',   border: 'border-blue-200' },
    amber:  { bg: 'bg-amber-100',  text: 'text-amber-700',  icon: 'text-amber-600',  border: 'border-amber-200' },
    red:    { bg: 'bg-red-100',    text: 'text-red-700',    icon: 'text-red-600',    border: 'border-red-200' },
    green:  { bg: 'bg-green-100',  text: 'text-green-700',  icon: 'text-green-600',  border: 'border-green-200' },
    purple: { bg: 'bg-purple-100', text: 'text-purple-700', icon: 'text-purple-600', border: 'border-purple-200' },
    teal:   { bg: 'bg-teal-100',   text: 'text-teal-700',   icon: 'text-teal-600',   border: 'border-teal-200' },
    gray:   { bg: 'bg-gray-100',   text: 'text-gray-700',   icon: 'text-gray-500',   border: 'border-gray-200' },
  }
  const c = colors[color] || colors.orange

  return (
    <div className={`bg-white rounded-2xl border ${c.border} p-5 flex items-start gap-4 shadow-sm hover:shadow-md transition-shadow`}>
      <div className={`w-12 h-12 rounded-xl ${c.bg} flex items-center justify-center shrink-0`}>
        <Icon size={22} className={c.icon} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-[#8A7A6A]">{label}</p>
        <p className={`text-3xl font-bold ${c.text} mt-0.5`}>{value}</p>
        {sub && <p className="text-xs text-[#8A7A6A] mt-1">{sub}</p>}
      </div>
    </div>
  )
}

export function RecentTickets({ tickets, onSelect }) {
  return (
    <div className="bg-white rounded-2xl border border-[#E8DDD0] shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-[#E8DDD0] flex items-center justify-between">
        <h3 className="font-semibold text-[#3D3126]">Recent Tickets</h3>
        <span className="text-xs text-[#8A7A6A]">Latest activity</span>
      </div>
      <div className="divide-y divide-[#F0E8DF]">
        {tickets.slice(0, 5).map(ticket => (
          <button
            key={ticket.id}
            onClick={() => onSelect(ticket)}
            className="w-full text-left px-5 py-3.5 hover:bg-[#FAF6F0] transition-colors flex items-start gap-3"
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-mono text-[#8A7A6A]">{ticket.id}</span>
                <TypeBadge type={ticket.type} />
              </div>
              <p className="text-sm font-medium text-[#3D3126] mt-1 truncate">{ticket.title}</p>
              <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                <StatusBadge status={ticket.status} />
                <PriorityBadge priority={ticket.priority} />
                <span className="text-xs text-[#8A7A6A]">{formatDistanceToNow(ticket.updatedAt)}</span>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}