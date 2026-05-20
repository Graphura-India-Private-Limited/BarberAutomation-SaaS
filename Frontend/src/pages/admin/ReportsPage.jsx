import { getStats, TICKET_STATUS, TICKET_PRIORITY, mockAgents } from '../../utils/tickets.jsx'
import { TrendingUp, Award, Users } from 'lucide-react'

export function ReportsPage({ tickets }) {
  const stats = getStats(tickets)

  const priorityBreakdown = Object.values(TICKET_PRIORITY).map(p => ({
    priority: p,
    count: tickets.filter(t => t.priority === p).length,
  }))

  const priorityColors = { Low: 'bg-slate-400', Medium: 'bg-yellow-400', High: 'bg-orange-500', Critical: 'bg-red-600' }

  const agentStats = mockAgents.filter(a => a !== 'Unassigned').map(agent => ({
    name: agent,
    total: tickets.filter(t => t.assignee === agent).length,
    resolved: tickets.filter(t => t.assignee === agent && (t.status === TICKET_STATUS.RESOLVED || t.status === TICKET_STATUS.CLOSED)).length,
  }))

  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Priority Distribution */}
        <div className="bg-white rounded-2xl border border-orange-200 shadow-sm p-5">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp size={18} className="text-orange-600" />
            <h3 className="font-semibold text-stone-800">Priority Distribution</h3>
          </div>
          <div className="space-y-4">
            {priorityBreakdown.map(({ priority, count }) => (
              <div key={priority}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-stone-600">{priority}</span>
                  <span className="text-sm font-semibold text-stone-700">{count} tickets</span>
                </div>
                <div className="w-full bg-orange-50 rounded-full h-3">
                  <div
                    className={`${priorityColors[priority]} h-3 rounded-full`}
                    style={{ width: stats.total > 0 ? `${(count / stats.total) * 100}%` : '0%' }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Agent Performance */}
        <div className="bg-white rounded-2xl border border-orange-200 shadow-sm p-5">
          <div className="flex items-center gap-2 mb-4">
            <Award size={18} className="text-orange-600" />
            <h3 className="font-semibold text-stone-800">Agent Performance</h3>
          </div>
          <div className="space-y-3">
            {agentStats.sort((a, b) => b.total - a.total).map(agent => (
              <div key={agent.name} className="flex items-center justify-between p-3 bg-orange-50 rounded-xl border border-orange-100">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-orange-200 flex items-center justify-center text-sm font-bold text-orange-700">
                    {agent.name[0]}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-stone-700">{agent.name}</p>
                    <p className="text-xs text-stone-400">{agent.total} assigned</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-green-700">{agent.resolved} resolved</p>
                  <p className="text-xs text-stone-400">
                    {agent.total > 0 ? Math.round((agent.resolved / agent.total) * 100) : 0}% rate
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Summary Stats Table */}
      <div className="bg-white rounded-2xl border border-orange-200 shadow-sm p-5">
        <div className="flex items-center gap-2 mb-4">
          <Users size={18} className="text-orange-600" />
          <h3 className="font-semibold text-stone-800">Overall Performance Summary</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-orange-100">
                <th className="text-left py-2 text-xs font-semibold text-stone-500 uppercase tracking-wider">Metric</th>
                <th className="text-right py-2 text-xs font-semibold text-stone-500 uppercase tracking-wider">Value</th>
                <th className="text-right py-2 text-xs font-semibold text-stone-500 uppercase tracking-wider">%</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-orange-50">
              {[
                { label: 'Total Tickets', value: stats.total,      pct: 100 },
                { label: 'Open',          value: stats.open,       pct: stats.total > 0 ? Math.round((stats.open       / stats.total) * 100) : 0 },
                { label: 'In Progress',   value: stats.inProgress, pct: stats.total > 0 ? Math.round((stats.inProgress / stats.total) * 100) : 0 },
                { label: 'Escalated',     value: stats.escalated,  pct: stats.total > 0 ? Math.round((stats.escalated  / stats.total) * 100) : 0 },
                { label: 'Resolved',      value: stats.resolved,   pct: stats.total > 0 ? Math.round((stats.resolved   / stats.total) * 100) : 0 },
                { label: 'Closed',        value: stats.closed,     pct: stats.total > 0 ? Math.round((stats.closed     / stats.total) * 100) : 0 },
              ].map(row => (
                <tr key={row.label} className="hover:bg-orange-50 transition-colors">
                  <td className="py-2.5 text-stone-700">{row.label}</td>
                  <td className="py-2.5 text-right font-semibold text-stone-800">{row.value}</td>
                  <td className="py-2.5 text-right text-stone-500">{row.pct}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
