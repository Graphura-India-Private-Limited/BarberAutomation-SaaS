import { X } from 'lucide-react'

// ── Button ──────────────────────────────────────────────────────────────────
export function Button({ children, onClick, variant = 'primary', size = 'md', disabled = false, className = '' }) {
  const base = 'inline-flex items-center gap-2 font-medium rounded-lg transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed'

  const variants = {
    primary:  'bg-orange-600 text-white hover:bg-orange-700 focus:ring-orange-400',
    secondary:'bg-orange-100 text-orange-800 hover:bg-orange-200 focus:ring-orange-300',
    danger:   'bg-red-600 text-white hover:bg-red-700 focus:ring-red-400',
    success:  'bg-green-600 text-white hover:bg-green-700 focus:ring-green-400',
    ghost:    'bg-transparent text-orange-700 hover:bg-orange-100 focus:ring-orange-300',
    outline:  'border border-orange-300 text-orange-700 hover:bg-orange-50 focus:ring-orange-300',
    escalate: 'bg-red-100 text-red-800 hover:bg-red-200 focus:ring-red-300 border border-red-200',
  }

  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-5 py-2.5 text-base',
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {children}
    </button>
  )
}

// ── Modal ───────────────────────────────────────────────────────────────────
export function Modal({ isOpen, onClose, title, children, size = 'md' }) {
  if (!isOpen) return null

  const sizes = { sm: 'max-w-md', md: 'max-w-2xl', lg: 'max-w-4xl', xl: 'max-w-6xl' }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-stone-900/40 backdrop-blur-sm" onClick={onClose} />
      <div className={`relative w-full ${sizes[size]} bg-orange-50 rounded-2xl shadow-2xl border border-orange-200 flex flex-col max-h-[90vh]`}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-orange-200">
          <h2 className="text-xl font-semibold text-stone-800">{title}</h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-500 hover:bg-orange-100 hover:text-stone-800 transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        <div className="overflow-y-auto flex-1 px-6 py-4">{children}</div>
      </div>
    </div>
  )
}

// ── Select ──────────────────────────────────────────────────────────────────
export function Select({ value, onChange, options, className = '', label }) {
  return (
    <div className="flex flex-col gap-1">
      {label && <label className="text-xs font-medium text-stone-600">{label}</label>}
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className={`border border-orange-200 bg-white rounded-lg px-3 py-2 text-sm text-stone-700 focus:outline-none focus:ring-2 focus:ring-orange-400 ${className}`}
      >
        {options.map(opt => (
          <option key={typeof opt === 'string' ? opt : opt.value} value={typeof opt === 'string' ? opt : opt.value}>
            {typeof opt === 'string' ? opt : opt.label}
          </option>
        ))}
      </select>
    </div>
  )
}
