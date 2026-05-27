
import { StatusBadge, PriorityBadge, TypeBadge } from './TicketBadges.jsx'
import { formatDistanceToNow } from '../utils/date.jsx'
import { User, Clock } from 'lucide-react'

export function TicketTable({ tickets, onSelect }) {
  if (tickets.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-[#E8DDD0] p-12 text-center shadow-sm">
        <p className="text-[#8A7A6A] text-lg">No tickets match your filters</p>
        <p className="text-[#8A7A6A]/60 text-sm mt-1">Try adjusting your search or filter criteria</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl border border-[#E8DDD0] shadow-sm overflow-hidden">
      {/* Table header - desktop */}
      <div className="hidden md:grid grid-cols-12 gap-3 px-5 py-3 border-b border-[#E8DDD0] bg-[#FAF6F0] text-xs font-semibold text-[#8A7A6A] uppercase tracking-wider">
        <div className="col-span-1">ID</div>
        <div className="col-span-3">Title</div>
        <div className="col-span-2">Type</div>
        <div className="col-span-2">Status</div>
        <div className="col-span-1">Priority</div>
        <div className="col-span-2">Assignee</div>
        <div className="col-span-1">Updated</div>
      </div>

      <div className="divide-y divide-[#F0E8DF]">
        {tickets.map(ticket => (
          <button
            key={ticket.id}
            onClick={() => onSelect(ticket)}
            className="w-full text-left hover:bg-[#FAF6F0] transition-colors"
          >
            {/* Desktop row */}
            <div className="hidden md:grid grid-cols-12 gap-3 px-5 py-3.5 items-center">
              <div className="col-span-1">
                <span className="text-xs font-mono text-[#B58B67] font-medium">{ticket.id}</span>
              </div>
              <div className="col-span-3">
                <p className="text-sm font-medium text-[#3D3126] truncate">{ticket.title}</p>
                <p className="text-xs text-[#8A7A6A] truncate">{ticket.customer}</p>
              </div>
              <div className="col-span-2"><TypeBadge type={ticket.type} /></div>
              <div className="col-span-2"><StatusBadge status={ticket.status} /></div>
              <div className="col-span-1"><PriorityBadge priority={ticket.priority} /></div>
              <div className="col-span-2">
                <span className="text-sm text-[#3D3126] flex items-center gap-1">
                  <User size={12} className="text-[#8A7A6A]" />
                  {ticket.assignee}
                </span>
              </div>
              <div className="col-span-1">
                <span className="text-xs text-[#8A7A6A] flex items-center gap-1">
                  <Clock size={11} />
                  {formatDistanceToNow(ticket.updatedAt)}
                </span>
              </div>
            </div>

            {/* Mobile row */}
            <div className="md:hidden px-4 py-3.5 space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="text-xs font-mono text-[#B58B67]">{ticket.id}</span>
                    <TypeBadge type={ticket.type} />
                  </div>
                  <p className="text-sm font-medium text-[#3D3126] line-clamp-2">{ticket.title}</p>
                  <p className="text-xs text-[#8A7A6A] mt-0.5">{ticket.customer}</p>
                </div>
                <PriorityBadge priority={ticket.priority} />
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <StatusBadge status={ticket.status} />
                <span className="text-xs text-[#8A7A6A]">{ticket.assignee} · {formatDistanceToNow(ticket.updatedAt)}</span>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}