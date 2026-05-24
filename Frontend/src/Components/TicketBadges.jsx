export function StatusBadge({ status }) {
  const map = {
    'Open': 'bg-blue-100 text-blue-800 border border-blue-200',
    'In Progress': 'bg-amber-100 text-amber-800 border border-amber-200',
    'Resolved': 'bg-green-100 text-green-800 border border-green-200',
    'Escalated': 'bg-red-100 text-red-800 border border-red-200',
    'Closed': 'bg-gray-100 text-gray-600 border border-gray-200',
  }
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${map[status] || 'bg-gray-100 text-gray-600'}`}>
      {status}
    </span>
  )
}

export function PriorityBadge({ priority }) {
  const map = {
    'Low': 'bg-slate-100 text-slate-600 border border-slate-200',
    'Medium': 'bg-yellow-100 text-yellow-800 border border-yellow-200',
    'High': 'bg-orange-100 text-orange-800 border border-orange-200',
    'Critical': 'bg-red-100 text-red-900 border border-red-300',
  }
  const dots = {
    'Low': 'bg-slate-400',
    'Medium': 'bg-yellow-500',
    'High': 'bg-orange-500',
    'Critical': 'bg-red-600',
  }
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${map[priority] || 'bg-gray-100 text-gray-600'}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dots[priority] || 'bg-gray-400'}`} />
      {priority}
    </span>
  )
}

export function TypeBadge({ type }) {
  const map = {
    'Customer Issue': 'bg-purple-100 text-purple-800 border border-purple-200',
    'Salon Issue': 'bg-teal-100 text-teal-800 border border-teal-200',
  }
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${map[type] || 'bg-gray-100 text-gray-600'}`}>
      {type}
    </span>
  )
}
