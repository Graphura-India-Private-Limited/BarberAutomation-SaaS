/* ── Shared UI helpers ─────────────────────────────────────────────── */

export function Frame({ children }) {
  return (
    <div className="bg-surface rounded-3xl border border-border px-5 pt-7 pb-5 flex flex-col max-w-[340px] mx-auto">
      {children}
    </div>
  )
}

export function Brand() {
  return (
    <div className="text-center mb-[22px]">
      <div className="w-11 h-11 rounded-xl bg-primary mx-auto mb-2 flex items-center justify-center">
        <div
          className="w-5 h-5 bg-border"
          style={{ clipPath: 'polygon(50% 0%,61% 35%,98% 35%,68% 57%,79% 91%,50% 70%,21% 91%,32% 57%,2% 35%,39% 35%)' }}
        />
      </div>
      <div className="text-base font-medium text-primary">BarberAutomation</div>
      <div className="text-[10px] text-muted mt-0.5 tracking-[0.04em]">
        GRAPHURA INDIA PRIVATE LIMITED
      </div>
    </div>
  )
}

export function Title({ children }) {
  return <div className="text-base font-medium text-primary mb-[5px]">{children}</div>
}

export function Sub({ children }) {
  return <div className="text-xs text-muted mb-4 leading-relaxed">{children}</div>
}

export function Label({ children }) {
  return (
    <div className="text-[10px] text-muted uppercase tracking-[0.07em] mb-[5px]">
      {children}
    </div>
  )
}

export function Field({ children }) {
  return <div className="mb-3">{children}</div>
}

export function Input({ error, className = '', ...props }) {
  return (
    <input
      className={[
        'w-full px-3 py-2.5 rounded-lg text-[13px] font-sans text-primary outline-none',
        'border transition-colors',
        error
          ? 'border-err-bdr bg-err-bg'
          : 'border-border bg-input-bg',
        className,
      ].join(' ')}
      {...props}
    />
  )
}

export function PhoneRow({ value, onChange, error }) {
  return (
    <div className="flex gap-2">
      <div className="bg-input-bg border border-border rounded-lg px-2.5 text-[13px] text-secondary font-mono flex-shrink-0 flex items-center">
        +91
      </div>
      <Input
        type="tel"
        maxLength={10}
        placeholder="98765 43210"
        value={value}
        onChange={e => onChange(e.target.value.replace(/\D/g, ''))}
        error={error}
        className="flex-1"
      />
    </div>
  )
}

export function Btn({ variant = 'main', children, className = '', ...props }) {
  const base = 'w-full py-3 rounded-xl text-[13px] font-medium cursor-pointer font-sans mt-2 block transition-opacity duration-150'
  const variants = {
    main: 'bg-primary text-surface border-0',
    sec:  'bg-input-bg text-primary border border-accent',
  }
  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  )
}

export function ErrBox({ children }) {
  return (
    <div className="bg-err-bg border border-err-bdr rounded-lg px-3 py-2.5 mb-2.5 flex gap-2 items-start">
      <div className="w-4 h-4 rounded-full bg-err-bdr text-white text-[10px] font-medium flex items-center justify-center flex-shrink-0 mt-px">
        !
      </div>
      <div className="text-xs text-err-txt leading-relaxed">{children}</div>
    </div>
  )
}

export function OkBox({ children }) {
  return (
    <div className="bg-ok-bg border border-ok-bdr rounded-lg px-3 py-2.5 mb-2.5 flex gap-2 items-center">
      <div className="w-4 h-4 rounded-full bg-ok-bdr text-white text-[10px] flex items-center justify-center flex-shrink-0">
        ✓
      </div>
      <div className="text-xs text-ok-txt leading-relaxed">{children}</div>
    </div>
  )
}

export function Divider() {
  return <div className="h-px bg-border my-3" />
}
