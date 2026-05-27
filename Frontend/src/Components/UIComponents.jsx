

import { X } from 'lucide-react'

export function Button({ children, onClick, variant = 'primary', size = 'md', disabled = false, className = '' }) {
  const base = 'inline-flex items-center gap-2 font-medium rounded-lg transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed'

  const variants = {
    primary:  'bg-[#B58B67] text-white hover:bg-[#9E7452] focus:ring-[#B58B67]',
    secondary:'bg-[#F0E8DF] text-[#3D3126] hover:bg-[#E8DDD0] focus:ring-[#B58B67]',
    danger:   'bg-red-600 text-white hover:bg-red-700 focus:ring-red-400',
    success:  'bg-green-600 text-white hover:bg-green-700 focus:ring-green-400',
    ghost:    'bg-transparent text-[#B58B67] hover:bg-[#F0E8DF] focus:ring-[#B58B67]',
    outline:  'border border-[#E8DDD0] text-[#B58B67] hover:bg-[#FAF6F0] focus:ring-[#B58B67]',
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

export function Modal({ isOpen, onClose, title, children, size = 'md' }) {
  if (!isOpen) return null

  const sizes = { sm: 'max-w-md', md: 'max-w-2xl', lg: 'max-w-4xl', xl: 'max-w-6xl' }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[#3D3126]/40 backdrop-blur-sm" onClick={onClose} />
      <div className={`relative w-full ${sizes[size]} bg-[#FAF6F0] rounded-2xl shadow-2xl border border-[#E8DDD0] flex flex-col max-h-[90vh]`}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E8DDD0]">
          <h2 className="text-xl font-semibold text-[#3D3126]">{title}</h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#8A7A6A] hover:bg-[#F0E8DF] hover:text-[#3D3126] transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        <div className="overflow-y-auto flex-1 px-6 py-4">{children}</div>
      </div>
    </div>
  )
}

export function Select({ value, onChange, options, className = '', label }) {
  return (
    <div className="flex flex-col gap-1">
      {label && <label className="text-xs font-medium text-[#8A7A6A]">{label}</label>}
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className={`border border-[#E8DDD0] bg-white rounded-lg px-3 py-2 text-sm text-[#3D3126] focus:outline-none focus:ring-2 focus:ring-[#B58B67] ${className}`}
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