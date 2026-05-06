import StatusBadge from './StatusBadge'

export default function CustomerCard({ customer, isSelected, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-3.5 py-3 rounded-xl border transition-spring group
        ${isSelected
          ? 'bg-white border-accent shadow-card-hover scale-[1.01]'
          : 'bg-white border-border shadow-card hover:border-accent/50 hover:shadow-card-hover hover:-translate-y-px'
        }`}
    >
      <div className="flex items-center gap-2.5">
        {/* Avatar */}
        <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 font-display font-bold text-[13px] text-white shadow-sm transition-spring
          ${isSelected ? 'gradient-accent shadow-glow' : 'gradient-avatar'}`}>
          {customer.avatar}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-1">
            <span className="font-body font-bold text-[13px] text-primary truncate leading-none">
              {customer.name}
            </span>
            <StatusBadge status={customer.status} />
          </div>
          <span className="text-[11px] text-muted font-body truncate block leading-none">
            {customer.service}
          </span>
        </div>
      </div>

      {isSelected && (
        <div className="mt-2.5 h-[2px] w-full rounded-full gradient-accent opacity-60" />
      )}
    </button>
  )
}
