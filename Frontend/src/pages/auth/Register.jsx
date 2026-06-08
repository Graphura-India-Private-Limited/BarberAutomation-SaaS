import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Scissors } from 'lucide-react'
import heroImg from '../../assets/blog27.png'

const REGISTERED = ['9550105897', '9735897907']

export default function Register({ onBack }) {
  const navigate = useNavigate() // Initialize the router navigator pipeline
  const [name, setName]   = useState('')
  const [phone, setPhone] = useState('')
  const [error, setError] = useState('')
  const [done, setDone]   = useState(false)

  const isFormValid = name.trim() !== '' && phone.replace(/\D/g, '').length === 10;

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

  // ✅ Created a unified click handler fallback to resolve navigation errors
  const handleBackToLogin = () => {
    if (typeof onBack === 'function') {
      onBack() // Fallback to prop toggle handler if parent conditional exists
    } else {
      navigate('/login') // Direct link route swap path fallback
    }
  }

  return (
    <div className="flex min-h-screen font-sans">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap');
        .font-sans { font-family: 'Plus Jakarta Sans', sans-serif !important; }
        .font-serif { font-family: 'Playfair Display', serif !important; }
        
        .card-minimalist {
          background: #FFFFFF;
          border-radius: 2.5rem;
          box-shadow: 0 30px 60px -15px rgba(62, 54, 46, 0.06);
          border: 1px solid rgba(234, 221, 206, 0.4);
        }
      `}</style>

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
        <div className="card-minimalist w-full max-w-[450px] p-8 sm:p-10 flex flex-col">

          {/* Header Identity Badge Group */}
          <div className="flex items-center gap-4 mb-5 text-left">
            <div className="w-12 h-12 rounded-xl bg-[#2C211A] flex items-center justify-center shrink-0">
              <Scissors size={20} color="#C5A059" className="rotate-90" />
            </div>
            <div>
              <h2 className="text-lg font-serif font-bold text-[#2C211A] tracking-wide leading-tight">Barber Pro</h2>
              <p className="text-[#C5A059] uppercase text-[9px] font-extrabold tracking-widest mt-0.5 font-sans">
                Graphura India Private Limited
              </p>
            </div>
          </div>

          <div className="h-[1px] bg-stone-100 w-full mb-6" />

          {/* Title */}
          <div className="mb-6 text-center">
            {/* Header Title */}
            <h3 className="text-3xl font-serif font-semibold text-gray-900">
              Create Account
            </h3>
            
            {/* Subtitle Description */}
            <p className="mt-2 text-sm font-normal leading-relaxed text-slate-400 font-sans">
              Register with your mobile number to get started.
            </p>
          </div>

          {/* Full name */}
          <div className="mb-5 text-left">
            <label className="block text-[10px] font-extrabold text-[#C5A059] tracking-widest mb-2 uppercase font-sans">
              Full Name
            </label>
            <div className="flex border border-[#EADBCE] rounded-xl overflow-hidden bg-white shadow-3xs focus-within:border-[#8B6B4E] transition-all">
              <input
                type="text"
                placeholder="e.g. Mayur K."
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full px-4 py-3.5 text-sm outline-none text-stone-800 font-medium font-sans"
              />
            </div>
          </div>

          {/* Mobile number */}
          <div className="mb-7 text-left">
            <label className="block text-[10px] font-extrabold text-[#C5A059] tracking-widest mb-2 uppercase font-sans">
              Mobile Number
            </label>
            <div className="flex border border-[#EADBCE] rounded-xl overflow-hidden bg-white shadow-3xs focus-within:border-[#8B6B4E] transition-all">
              <div className="px-4 flex items-center justify-center border-r border-[#EADBCE] bg-stone-50 text-stone-500 font-bold text-sm select-none font-sans">
                +91
              </div>
              <input
                type="tel"
                placeholder="98765 43210"
                value={phone}
                onChange={e => setPhone(e.target.value.replace(/\D/g, ''))}
                maxLength={10}
                className="w-full px-4 py-3.5 text-sm outline-none text-stone-800 font-medium font-sans tracking-wider"
              />
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-4 text-xs rounded-lg px-3 py-2.5 flex items-start gap-2 bg-[#fdf5f0] border border-[#e8b49a] text-[#7a3018] text-left">
              <span className="flex-shrink-0">⚠</span>
              <span>{error}</span>
            </div>
          )}

          {/* Success */}
          {done && (
            <div className="mb-4 text-xs rounded-lg px-3 py-2.5 flex items-start gap-2 bg-green-50 border border-green-200 text-green-800 text-left">
              <span className="flex-shrink-0">✓</span>
              <span>Registration successful! OTP sent to +91 {phone}</span>
            </div>
          )}

          {/* Create Account button */}
          <button
            onClick={handleRegister}
            disabled={!isFormValid}
            className="w-full text-white font-bold text-xs uppercase tracking-widest py-4 rounded-xl transition-all duration-300 shadow-md active:scale-[0.99] font-sans mb-3"
            style={{ 
              backgroundColor: isFormValid ? "#2C1810" : "#9C928A",
              boxShadow: isFormValid ? "0 10px 25px -5px rgba(44, 24, 16, 0.25)" : "none"
            }}
          >
            Create Account
          </button>

          {/* Back to Login */}
          <button
            type="button"
            onClick={handleBackToLogin} // ✅ Triggers our dual-safe backup router function
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