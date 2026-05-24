import { STATUS_META } from '../../config/data'

export default function StatusBadge({ status }) {
  const m = STATUS_META[status] ?? {
    bg: 'bg-gray-100', border: 'border-gray-300',
    text: 'text-gray-700', dot: 'bg-gray-400',
  }
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-[5px] rounded-full text-[11px] font-bold tracking-[0.04em] border ${m.bg} ${m.border} ${m.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${m.dot} ${status === 'In Chair' ? 'animate-pulse-slow' : ''}`} />
      {status}
    </span>
  )
}
