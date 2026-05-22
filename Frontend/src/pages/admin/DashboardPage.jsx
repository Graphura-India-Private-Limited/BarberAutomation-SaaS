import { Ticket, Users, HeadphonesIcon, AlertTriangle, CheckCircle, Clock, TrendingUp, XCircle } from 'lucide-react'
import { StatCard, RecentTickets } from '../../Components/DashboardWidgets.jsx'
import { getStats, TICKET_STATUS } from '../../utils/tickets.jsx'
import { StatusBadge } from '../../Components/TicketBadges.jsx'

export function DashboardPage({ tickets, onSelectTicket }) {
  const stats = getStats(tickets)

  const breakdown = [
    { label: 'Open',        value: stats.open,       color: 'bg-blue-500',  status: TICKET_STATUS.OPEN },
    { label: 'In Progress', value: stats.inProgress,  color: 'bg-amber-500', status: TICKET_STATUS.IN_PROGRESS },
    { label: 'Escalated',   value: stats.escalated,   color: 'bg-red-500',   status: TICKET_STATUS.ESCALATED },
    { label: 'Resolved',    value: stats.resolved,    color: 'bg-green-500', status: TICKET_STATUS.RESOLVED },
    { label: 'Closed',      value: stats.closed,      color: 'bg-gray-400',  status: TICKET_STATUS.CLOSED },
  ]

  return (
    <div className="p-6 space-y-6">
      {/* Critical Banner */}
      {stats.critical > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-2xl px-5 py-4 flex items-center gap-3">
          <AlertTriangle size={20} className="text-red-600 shrink-0" />
          <div>
            <p className="font-semibold text-red-800">
              {stats.critical} Critical Ticket{stats.critical > 1 ? 's' : ''} Require Immediate Attention
            </p>
            <p className="text-sm text-red-600">Please review and escalate if necessary.</p>
          </div>
        </div>
      )}

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Tickets"    value={stats.total}          icon={Ticket}          color="orange" sub="All time" />
        <StatCard label="Customer Issues"  value={stats.customerIssues} icon={Users}           color="purple" sub="From customers" />
        <StatCard label="Salon Issues"     value={stats.salonIssues}    icon={HeadphonesIcon}  color="teal"   sub="From salon partners" />
        <StatCard label="Critical"         value={stats.critical}       icon={AlertTriangle}   color="red"    sub="Needs urgent action" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Open"        value={stats.open}       icon={Clock}        color="blue" />
        <StatCard label="In Progress" value={stats.inProgress} icon={TrendingUp}   color="amber" />
        <StatCard label="Resolved"    value={stats.resolved}   icon={CheckCircle}  color="green" />
        <StatCard label="Closed"      value={stats.closed}     icon={XCircle}      color="gray" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Status Breakdown */}
        <div className="bg-white rounded-2xl border border-orange-200 shadow-sm p-5">
          <h3 className="font-semibold text-stone-800 mb-4">Status Breakdown</h3>
          <div className="space-y-3">
            {breakdown.map(b => (
              <div key={b.label}>
                <div className="flex items-center justify-between mb-1">
                  <StatusBadge status={b.status} />
                  <span className="text-sm font-semibold text-stone-700">{b.value}</span>
                </div>
                <div className="w-full bg-orange-50 rounded-full h-2">
                  <div
                    className={`${b.color} h-2 rounded-full transition-all`}
                    style={{ width: stats.total > 0 ? `${(b.value / stats.total) * 100}%` : '0%' }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Issue Type Split */}
        <div className="bg-white rounded-2xl border border-orange-200 shadow-sm p-5">
          <h3 className="font-semibold text-stone-800 mb-4">Issue Type Split</h3>
          <div className="flex items-center justify-center gap-8 my-4">
            <div className="text-center">
              <div className="w-20 h-20 rounded-full border-8 border-purple-300 flex items-center justify-center mx-auto">
                <span className="text-xl font-bold text-purple-700">{stats.customerIssues}</span>
              </div>
              <p className="text-xs text-stone-500 mt-2">Customer</p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 rounded-full border-8 border-teal-300 flex items-center justify-center mx-auto">
                <span className="text-xl font-bold text-teal-700">{stats.salonIssues}</span>
              </div>
              <p className="text-xs text-stone-500 mt-2">Salon</p>
            </div>
          </div>
          <div className="flex gap-2 mt-2">
            <div className="flex-1 bg-purple-50 border border-purple-100 rounded-xl p-3 text-center">
              <p className="text-2xl font-bold text-purple-700">
                {stats.total > 0 ? Math.round((stats.customerIssues / stats.total) * 100) : 0}%
              </p>
              <p className="text-xs text-purple-500">Customer</p>
            </div>
            <div className="flex-1 bg-teal-50 border border-teal-100 rounded-xl p-3 text-center">
              <p className="text-2xl font-bold text-teal-700">
                {stats.total > 0 ? Math.round((stats.salonIssues / stats.total) * 100) : 0}%
              </p>
              <p className="text-xs text-teal-500">Salon</p>
            </div>
          </div>
        </div>

        {/* Quick Summary */}
        <div className="bg-white rounded-2xl border border-orange-200 shadow-sm p-5">
          <h3 className="font-semibold text-stone-800 mb-4">Quick Summary</h3>
          <ul className="space-y-3">
            <li className="flex items-center justify-between text-sm">
              <span className="text-stone-500">Unassigned tickets</span>
              <span className="font-semibold text-stone-700">{tickets.filter(t => t.assignee === 'Unassigned').length}</span>
            </li>
            <li className="flex items-center justify-between text-sm">
              <span className="text-stone-500">Escalated today</span>
              <span className="font-semibold text-red-600">{stats.escalated}</span>
            </li>
            <li className="flex items-center justify-between text-sm">
              <span className="text-stone-500">Resolution rate</span>
              <span className="font-semibold text-green-600">
                {stats.total > 0 ? Math.round(((stats.resolved + stats.closed) / stats.total) * 100) : 0}%
              </span>
            </li>
            <li className="flex items-center justify-between text-sm">
              <span className="text-stone-500">Active tickets</span>
              <span className="font-semibold text-amber-600">{stats.open + stats.inProgress}</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Recent Tickets */}
      <RecentTickets tickets={tickets} onSelect={onSelectTicket} />
    </div>
  )
}
