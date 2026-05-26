
import { useState } from 'react'
import heroImg from '../../assets/blog27.png'

const REGISTERED = ['9550105897', '9735897907']

export default function Register({ onBack }) {
  const [name, setName]   = useState('')
  const [phone, setPhone] = useState('')
  const [error, setError] = useState('')
  const [done, setDone]   = useState(false)

  function handleRegister() {
    const cleanPhone = phone.replace(/\s/g, '').trim()
    if (!name.trim()) {
      setError('Please enter your full name.')
      setDone(false)
      return
    }
    if (!cleanPhone || cleanPhone.length < 10) {
      setError('Please enter a valid 10-digit mobile number.')
      setDone(false)
      return
    }
    if (REGISTERED.includes(cleanPhone)) {
      setError('This mobile number is already registered. Please login instead.')
      setDone(false)
      return
    }
    setError('')
    setDone(true)
  }

  return (
    <div className="flex min-h-screen font-sans">

      {/* ── Left hero ── */}
      <div className="relative hidden md:flex flex-col justify-end w-[52%] overflow-hidden">
        <img
          src={heroImg}
          alt="Barber at work"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        {/* Dark sepia overlay */}
        <div className="absolute inset-0 bg-black/55" />

        {/* Logo */}
        <div className="absolute top-6 left-6 flex items-center gap-3 z-10">
          <div className="w-10 h-10 border border-yellow-500/70 rounded-lg flex items-center justify-center">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#c9a96e" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="6" cy="6" r="3"/>
              <circle cx="6" cy="18" r="3"/>
              <line x1="20" y1="4" x2="8.12" y2="15.88"/>
              <line x1="14.47" y1="14.48" x2="20" y2="20"/>
              <line x1="8.12" y1="8.12" x2="12" y2="12"/>
            </svg>
          </div>
          <div>
            <div className="text-base font-bold tracking-wide">
              <span className="text-yellow-400">BARBER</span>{' '}
              <span className="text-amber-100">PRO</span>
            </div>
            <div className="text-[9px] tracking-[0.18em] uppercase font-light text-yellow-600/55">
              Premium Grooming Systems
            </div>
          </div>
        </div>

        {/* Hero bottom text */}
        <div className="relative z-10 p-8 pb-10">
          <h2 className="font-bold text-3xl leading-snug mb-3 italic text-amber-100">
            Style for Everyone.<br />Men and Women.
          </h2>
          <p className="text-xs font-light leading-relaxed text-amber-100/60 max-w-xs">
            Book expert stylists for haircuts, grooming and beauty treatments — all in one place.
          </p>

          <div className="flex flex-wrap gap-2 mt-5">
            {["Men's cuts", "Women's styling", "Easy booking"].map(b => (
              <span
                key={b}
                className="px-4 py-1.5 rounded-lg border border-amber-500/40 bg-amber-500/10 text-amber-300 text-xs font-medium"
              >
                {b}
              </span>
            ))}
          </div>

          <div className="mt-8 text-[9px] tracking-[0.14em] uppercase text-yellow-600/35">
            Graphura India Private Limited
          </div>
        </div>
      </div>

      {/* ── Right panel ── */}
      <div className="flex flex-1 items-center justify-center px-8 py-12 bg-[#FAF6F0]">

        {/* Card */}
        <div className="w-full max-w-md rounded-2xl shadow-xl px-10 py-10 bg-[#f5f0e8]">

          {/* Title */}
          <h1 className="text-3xl font-black uppercase tracking-tight mb-1 text-[#1a1a1a]">
            Create Account
          </h1>
          <p className="text-[10px] font-semibold uppercase tracking-widest mb-8 text-[#b5541a]">
            Register with your mobile number to get started
          </p>

          {/* Full name */}
          <div className="mb-5">
            <label className="block text-[10px] font-bold uppercase tracking-widest mb-1.5 text-[#888]">
              Full Name
            </label>
            <input
              type="text"
              placeholder="e.g. Mayur K."
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full bg-white rounded-xl px-4 py-3 text-sm text-[#333] placeholder-[#bbb] outline-none border border-transparent focus:border-[#b5541a] transition-colors"
            />
          </div>

          {/* Mobile number */}
          <div className="mb-7">
            <label className="block text-[10px] font-bold uppercase tracking-widest mb-1.5 text-[#888]">
              Mobile Number
            </label>
            <div className="flex gap-2">
              <div className="bg-white rounded-xl px-4 py-3 text-sm font-medium text-[#444] flex items-center select-none border border-transparent">
                +91
              </div>
              <input
                type="tel"
                placeholder="98765 43210"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                maxLength={10}
                className="flex-1 bg-white rounded-xl px-4 py-3 text-sm text-[#333] placeholder-[#bbb] outline-none border border-transparent focus:border-[#b5541a] transition-colors tracking-wider"
              />
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-4 text-xs rounded-lg px-3 py-2.5 flex items-start gap-2 bg-[#fdf5f0] border border-[#e8b49a] text-[#7a3018]">
              <span className="flex-shrink-0">⚠</span>
              <span>{error}</span>
            </div>
          )}

          {/* Success */}
          {done && (
            <div className="mb-4 text-xs rounded-lg px-3 py-2.5 flex items-start gap-2 bg-green-50 border border-green-200 text-green-800">
              <span className="flex-shrink-0">✓</span>
              <span>Registration successful! OTP sent to +91 {phone}</span>
            </div>
          )}

          {/* Create Account button */}
          <button
            onClick={handleRegister}
            className="w-full py-4 rounded-xl text-xs font-bold uppercase tracking-widest bg-[#2b2118] hover:bg-[#3d2f22] text-white transition-colors mb-3"
          >
            Create Account
          </button>

          {/* Back to Login */}
          <button
            onClick={onBack}
            className="w-full py-4 rounded-xl text-xs font-bold uppercase tracking-widest bg-white hover:bg-[#f0ece3] text-[#2b2118] border border-[#e0d8cc] transition-colors"
          >
            Back to Login
          </button>

          {/* Footer */}
          <p className="text-center text-[9px] uppercase tracking-widest text-[#bbb] mt-6">
            Professional Grooming Standards
          </p>

        </div>
      </div>
    </div>
  )
}