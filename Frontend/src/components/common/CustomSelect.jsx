import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

export default function CustomSelect({
  value,
  onChange,
  options, // Array of { value/id, label } or simple strings
  placeholder = "Select option",
  className = "",
  disabled = false,
  icon: Icon = null,
  align = "left", // "left" or "right"
  size = "md" // "sm", "md", "lg"
}) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  // Normalize options to always be objects with value and label
  const normalizedOptions = options.map(opt => {
    if (typeof opt === 'object' && opt !== null) {
      const val = opt.value !== undefined ? opt.value : opt.id;
      return { value: val, label: opt.label || opt.name || val };
    }
    return { value: opt, label: String(opt) };
  });

  const selected = normalizedOptions.find(o => String(o.value) === String(value));

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const sizeClasses = {
    sm: "px-3 py-1.5 text-xs rounded-xl h-9",
    md: "px-4 py-2.5 text-xs rounded-xl h-11",
    lg: "px-5 py-3 text-sm rounded-2xl h-13"
  };

  const handleSelect = (val) => {
    onChange(val);
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className="relative inline-block text-left w-full select-none">
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between border border-[#EADDCA] bg-white font-semibold text-[#3E362E] cursor-pointer focus:outline-none focus:border-[#C5A059] transition-all font-sans disabled:opacity-50 disabled:cursor-not-allowed ${sizeClasses[size]} ${className}`}
      >
        <div className="flex items-center gap-2 truncate">
          {Icon && <Icon size={14} className="text-[#C5A059] flex-shrink-0" />}
          <span className="truncate">{selected ? selected.label : placeholder}</span>
        </div>
        <ChevronDown size={14} className={`text-[#C5A059] transition-transform duration-200 flex-shrink-0 ml-1.5 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          {/* Mobile backdrop to block events outside dropdown */}
          <div className="fixed inset-0 z-40 md:hidden" onClick={() => setIsOpen(false)} />
          <div 
            className={`absolute ${align === 'right' ? 'right-0' : 'left-0'} mt-1.5 w-full min-w-[160px] bg-white border border-[#C5A059]/30 rounded-xl shadow-xl overflow-hidden z-50 max-h-60 overflow-y-auto animate-in fade-in slide-in-from-top-1 duration-150`}
          >
            {normalizedOptions.map((opt) => {
              const isSelected = String(opt.value) === String(value);
              return (
                <button
                  key={String(opt.value)}
                  type="button"
                  onClick={() => handleSelect(opt.value)}
                  className={`w-full flex items-center justify-between px-4 py-3 text-xs border-b border-[#EADDCA]/20 last:border-0 hover:bg-[#FAF6F0] hover:text-[#8B5A2B] transition-colors text-left cursor-pointer font-bold ${
                    isSelected ? 'text-[#8B5A2B] bg-[#8B5A2B]/5 font-extrabold' : 'text-stone-700 font-medium'
                  }`}
                >
                  <span className="truncate">{opt.label}</span>
                  {isSelected && <Check size={12} className="text-[#8B5A2B] flex-shrink-0 ml-2" />}
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
