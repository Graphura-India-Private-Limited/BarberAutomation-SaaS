

import React, { useState, useRef, useEffect } from 'react';
import { X, ChevronDown, Check } from 'lucide-react';

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
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  const normalizedOptions = options.map(opt => {
    if (typeof opt === 'object' && opt !== null) {
      return { value: opt.value !== undefined ? opt.value : opt.id, label: opt.label || opt.name };
    }
    return { value: opt, label: String(opt) };
  });

  const selected = normalizedOptions.find(o => String(o.value) === String(value));

  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="relative flex flex-col gap-1 text-left w-full select-none font-sans">
      {label && <label className="text-xs font-semibold text-[#8A7A6A] pl-0.5">{label}</label>}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between border border-[#E8DDD0] bg-white text-sm text-[#3D3126] font-semibold px-3 py-2.5 rounded-lg cursor-pointer focus:outline-none focus:border-[#B58B67] transition-all ${className}`}
      >
        <span className="truncate">{selected ? selected.label : "Select option"}</span>
        <ChevronDown size={14} className={`text-[#B58B67] transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-[100%] left-0 right-0 mt-1 bg-white border border-[#E8DDD0] rounded-lg shadow-lg overflow-hidden z-[999] max-h-48 overflow-y-auto animate-in fade-in slide-in-from-top-1 duration-100">
          {normalizedOptions.map((opt) => {
            const isSelected = String(opt.value) === String(value);
            return (
              <button
                key={String(opt.value)}
                type="button"
                onClick={() => {
                  onChange(opt.value);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 text-sm hover:bg-[#FAF6F0] hover:text-[#9E7452] transition-colors text-left cursor-pointer font-bold ${
                  isSelected ? 'text-[#9E7452] bg-[#FAF6F0] font-extrabold' : 'text-stone-700 font-medium'
                }`}
              >
                <span className="truncate">{opt.label}</span>
                {isSelected && <Check size={12} className="text-[#9E7452]" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  )
}