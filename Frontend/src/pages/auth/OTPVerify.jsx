import { useState, useEffect, useRef } from 'react'

const CORRECT_OTP = '1234'
const MAX_ATTEMPTS = 3
const TIMER_SECS = 150

// Dummy barber salon image (replace with your actual image path)
const SALON_IMAGE = 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=900&q=80'

function ScissorIcon({ size = 20, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="6" cy="6" r="3" />
      <circle cx="6" cy="18" r="3" />
      <line x1="20" y1="4" x2="8.12" y2="15.88" />
      <line x1="14.47" y1="14.48" x2="20" y2="20" />
      <line x1="8.12" y1="8.12" x2="12" y2="12" />
    </svg>
  )
}

export default function OTPVerify({ phone, onBack }) {
  const [otp, setOtp]             = useState(['', '', '', ''])
  const [attempts, setAttempts]   = useState(0)
  const [error, setError]         = useState('')
  const [success, setSuccess]     = useState(false)
  const [timerSecs, setTimerSecs] = useState(TIMER_SECS)
  const [canResend, setCanResend] = useState(false)
  const [shaking, setShaking]     = useState(false)
  const [mounted, setMounted]     = useState(false)
  const inputRefs = [useRef(), useRef(), useRef(), useRef()]
  const timerRef  = useRef(null)

  useEffect(() => {
    setMounted(true)
    startTimer()
    setTimeout(() => inputRefs[0].current?.focus(), 400)
    return () => clearInterval(timerRef.current)
  }, [])

  function startTimer() {
    clearInterval(timerRef.current)
    setTimerSecs(TIMER_SECS)
    setCanResend(false)
    timerRef.current = setInterval(() => {
      setTimerSecs(s => {
        if (s <= 1) { clearInterval(timerRef.current); setCanResend(true); return 0 }
        return s - 1
      })
    }, 1000)
  }

  function handleResend() {
    if (!canResend) return
    setOtp(['', '', '', ''])
    setError(''); setSuccess(false); setAttempts(0)
    startTimer()
    setTimeout(() => inputRefs[0].current?.focus(), 50)
  }

  function fmt(s) {
    const m = Math.floor(s / 60), sec = s % 60
    return `${m < 10 ? '0' + m : m}:${sec < 10 ? '0' + sec : sec}`
  }

  function handleKeyDown(e, idx) {
    if (e.key === 'Backspace') {
      if (otp[idx]) { const n = [...otp]; n[idx] = ''; setOtp(n) }
      else if (idx > 0) {
        const n = [...otp]; n[idx - 1] = ''; setOtp(n)
        inputRefs[idx - 1].current?.focus()
      }
    }
  }

  function handleInput(val, idx) {
    const digit = val.replace(/\D/g, '').slice(-1)
    if (!digit) return
    const n = [...otp]; n[idx] = digit; setOtp(n)
    if (idx < 3) inputRefs[idx + 1].current?.focus()
  }

  function handlePaste(e) {
    const text = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 4)
    if (!text) return
    const n = ['', '', '', '']
    text.split('').forEach((ch, i) => { n[i] = ch })
    setOtp(n)
    inputRefs[Math.min(text.length, 3)].current?.focus()
    e.preventDefault()
  }

  function verify() {
    const code = otp.join('')
    if (code.length < 4) { setError('Please enter all 4 digits of the OTP.'); return }
    const newAttempts = attempts + 1; setAttempts(newAttempts)
    if (code === CORRECT_OTP) {
      setError(''); setSuccess(true)
    } else {
      setSuccess(false); setOtp(['', '', '', ''])
      setShaking(true); setTimeout(() => setShaking(false), 500)
      setTimeout(() => inputRefs[0].current?.focus(), 50)
      const rem = MAX_ATTEMPTS - newAttempts
      setError(rem > 0
        ? `Invalid OTP. ${rem} attempt${rem > 1 ? 's' : ''} remaining.`
        : 'Too many failed attempts. Account temporarily locked.')
    }
  }

  const locked   = attempts >= MAX_ATTEMPTS && !success
  const allFilled = otp.every(d => d !== '')
  const displayPhone = phone || '98765 43210'

  return (
    <div style={S.page}>
      <style>{CSS}</style>

      {/* ── LEFT: Image Panel ── */}
      <div style={S.left} className={mounted ? 'slide-in-left' : ''}>
        {/* Image */}
        <img src={SALON_IMAGE} alt="Barber salon" style={S.bgImg} />
        <div style={S.overlay} />

        {/* Logo top-left */}
        <div style={S.logoWrap}>
          <div style={S.logoBox}><ScissorIcon size={18} color="#D4A843" /></div>
          <div>
            <div style={S.logoText}>BARBER <span style={S.logoPro}>PRO</span></div>
            <div style={S.logoTagline}>PREMIUM GROOMING SYSTEMS</div>
          </div>
        </div>

        {/* Bottom text */}
        <div style={S.leftBottom}>
          <p style={S.leftItalic}>Verify your identity.<br />Your session awaits.</p>
          <div style={S.goldLine} />
          <p style={S.leftSmall}>
            We sent a one-time password to your registered mobile number to ensure secure access to your personal dashboard.
          </p>
          <div style={S.tagRow}>
            {['Secure Access', 'OTP Login', 'Instant Verify'].map(t => (
              <span key={t} style={S.tag}>{t}</span>
            ))}
          </div>
          <div style={S.bottomBrand}>GRAPHURA INDIA PRIVATE LIMITED</div>
        </div>
      </div>

      {/* ── RIGHT: OTP Form ── */}
      <div style={S.right}>
        <div style={{ ...S.card, ...(mounted ? {} : { opacity: 0 }) }}
          className={mounted ? 'slide-in-right' : ''}>

          {/* Card header brand */}
          <div style={S.cardBrand}>
            <div style={S.cardIcon}><ScissorIcon size={22} color="#D4A843" /></div>
            <div>
              <div style={S.cardBrandName}>BarberAutomation</div>
              <div style={S.cardBrandSub}>GRAPHURA INDIA PRIVATE LIMITED</div>
            </div>
          </div>

          <div style={S.cardDivider} />

          <h2 style={S.cardTitle}>Verify OTP</h2>
          <p style={S.cardSub}>
            We sent a 4-digit code to{' '}
            <span style={S.phoneHi}>+91 {displayPhone}</span>.
            <br />Valid for 5 minutes.
          </p>

          {/* OTP Inputs */}
          <div
            style={S.otpRow}
            onPaste={handlePaste}
            className={shaking ? 'shake' : ''}
          >
            {otp.map((digit, i) => (
              <input
                key={i}
                ref={inputRefs[i]}
                type="tel"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                disabled={locked || success}
                onChange={e => handleInput(e.target.value, i)}
                onKeyDown={e => handleKeyDown(e, i)}
                style={{
                  ...S.otpBox,
                  borderColor: error && !success
                    ? '#C0392B'
                    : digit ? '#8B6914' : '#DDD3C0',
                  background: digit ? '#FDF8F0' : '#FAFAF8',
                  color: digit ? '#2C1810' : '#C4B49A',
                }}
                className="otp-input"
              />
            ))}
          </div>

          {/* Timer */}
          <div style={S.timerRow}>
            {canResend ? (
              <span style={S.timerTxt}>
                Didn't receive it?{' '}
                <span style={S.resendLink} onClick={handleResend}>Resend OTP</span>
              </span>
            ) : (
              <span style={S.timerTxt}>
                Resend OTP in <span style={S.timerBold}>{fmt(timerSecs)}</span>
              </span>
            )}
          </div>

          {/* Messages */}
          {error && !success && (
            <div style={S.errBox} className="msg-fade">
              <span style={S.errIcon}>✕</span> {error}
            </div>
          )}
          {success && (
            <div style={S.okBox} className="msg-fade">
              <span style={S.okIcon}>✓</span> OTP verified! Redirecting to your dashboard…
            </div>
          )}

          {/* Buttons */}
          <button
            onClick={verify}
            disabled={locked || success || !allFilled}
            style={{
              ...S.btnPrimary,
              opacity: locked || success || !allFilled ? 0.5 : 1,
              cursor: locked || success || !allFilled ? 'not-allowed' : 'pointer',
            }}
            className="btn-primary"
          >
            Verify OTP
          </button>

          <button onClick={onBack} style={S.btnSec} className="btn-sec">
            ← Change Number
          </button>

          <p style={S.footNote}>PROFESSIONAL GROOMING STANDARDS</p>
        </div>
      </div>
    </div>
  )
}

// ── Styles ────────────────────────────────────────────────────────────────────
const S = {
  page: {
    display: 'flex',
    minHeight: '100vh',
    fontFamily: "'Jost', sans-serif",
    background: '#FAF6F0',
    overflow: 'hidden',
  },

  // LEFT
  left: {
    width: '48%',
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    overflow: 'hidden',
    minHeight: '100vh',
  },
  bgImg: {
    position: 'absolute', inset: 0,
    width: '100%', height: '100%',
    objectFit: 'cover', objectPosition: 'center',
  },
  overlay: {
    position: 'absolute', inset: 0,
    background: 'linear-gradient(160deg, rgba(20,10,5,0.55) 0%, rgba(20,10,5,0.3) 40%, rgba(20,10,5,0.72) 100%)',
  },
  logoWrap: {
    position: 'relative', zIndex: 2,
    display: 'flex', alignItems: 'center', gap: '12px',
    padding: '36px 40px',
  },
  logoBox: {
    width: '40px', height: '40px',
    border: '1.5px solid rgba(212,168,67,0.7)',
    borderRadius: '8px',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  logoText: {
    fontFamily: "'Jost', sans-serif",
    fontWeight: 600, fontSize: '16px',
    letterSpacing: '0.1em', color: '#FAF6F0',
    textTransform: 'uppercase',
  },
  logoPro: { color: '#D4A843' },
  logoTagline: {
    fontSize: '8px', letterSpacing: '0.22em',
    color: 'rgba(212,168,67,0.75)', textTransform: 'uppercase', marginTop: '2px',
  },
  leftBottom: {
    position: 'relative', zIndex: 2,
    padding: '0 40px 44px',
  },
  leftItalic: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: '36px', fontWeight: 400,
    fontStyle: 'italic', lineHeight: 1.2,
    color: '#FAF6F0', marginBottom: '18px',
    letterSpacing: '-0.01em',
  },
  goldLine: {
    width: '36px', height: '2px',
    background: '#D4A843', marginBottom: '18px',
  },
  leftSmall: {
    fontSize: '12.5px', fontWeight: 300,
    color: 'rgba(250,246,240,0.72)',
    lineHeight: 1.75, marginBottom: '22px',
    maxWidth: '320px',
  },
  tagRow: {
    display: 'flex', gap: '8px',
    flexWrap: 'wrap', marginBottom: '28px',
  },
  tag: {
    padding: '5px 13px',
    border: '1px solid rgba(212,168,67,0.5)',
    borderRadius: '999px',
    fontSize: '10px', letterSpacing: '0.08em',
    color: '#D4A843', textTransform: 'uppercase',
    fontWeight: 500,
  },
  bottomBrand: {
    fontSize: '8.5px', letterSpacing: '0.2em',
    color: 'rgba(250,246,240,0.4)', textTransform: 'uppercase',
  },

  // RIGHT
  right: {
    width: '52%',
    background: '#F2EBE0',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    padding: '40px 36px',
    minHeight: '100vh',
  },
  card: {
    background: '#FFFFFF',
    borderRadius: '22px',
    padding: '44px 40px 36px',
    width: '100%', maxWidth: '420px',
    boxShadow: '0 8px 56px rgba(44,24,16,0.10)',
  },

  cardBrand: {
    display: 'flex', alignItems: 'center', gap: '14px',
    marginBottom: '20px',
  },
  cardIcon: {
    width: '48px', height: '48px',
    background: '#2C1810', borderRadius: '11px',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    flexShrink: 0,
  },
  cardBrandName: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: '20px', fontWeight: 600, color: '#2C1810',
  },
  cardBrandSub: {
    fontSize: '8.5px', letterSpacing: '0.18em',
    color: '#8B6914', textTransform: 'uppercase', marginTop: '2px',
  },
  cardDivider: {
    height: '1px', background: '#EDE5D8', margin: '0 0 24px',
  },

  cardTitle: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: '28px', fontWeight: 600,
    color: '#2C1810', marginBottom: '8px',
    letterSpacing: '0.01em',
  },
  cardSub: {
    fontSize: '13px', fontWeight: 300,
    color: '#7A6650', lineHeight: 1.7,
    marginBottom: '28px',
  },
  phoneHi: { color: '#2C1810', fontWeight: 500 },

  // OTP
  otpRow: {
    display: 'flex', gap: '12px',
    justifyContent: 'center', marginBottom: '20px',
  },
  otpBox: {
    width: '64px', height: '68px',
    borderRadius: '12px',
    border: '1.5px solid #DDD3C0',
    fontSize: '26px',
    fontFamily: "'Cormorant Garamond', serif",
    fontWeight: 600, textAlign: 'center',
    transition: 'all 0.18s ease',
    outline: 'none', cursor: 'pointer',
    caretColor: 'transparent',
  },

  timerRow: { textAlign: 'center', marginBottom: '18px' },
  timerTxt: { fontSize: '12px', color: '#A89070', fontWeight: 300 },
  timerBold: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: '14px', fontWeight: 600, color: '#2C1810',
  },
  resendLink: {
    color: '#8B6914', fontWeight: 500, cursor: 'pointer',
    borderBottom: '1px solid #8B6914', paddingBottom: '1px',
  },

  errBox: {
    background: '#FEF2F2', border: '1px solid #FECACA',
    borderRadius: '10px', padding: '11px 16px',
    fontSize: '12.5px', color: '#7F1D1D',
    marginBottom: '16px',
    display: 'flex', alignItems: 'center', gap: '8px',
  },
  errIcon: { color: '#EF4444', fontWeight: 700, fontSize: '11px' },
  okBox: {
    background: '#F0FDF4', border: '1px solid #BBF7D0',
    borderRadius: '10px', padding: '11px 16px',
    fontSize: '12.5px', color: '#14532D',
    marginBottom: '16px',
    display: 'flex', alignItems: 'center', gap: '8px',
  },
  okIcon: { color: '#22C55E', fontWeight: 700, fontSize: '14px' },

  btnPrimary: {
    width: '100%', padding: '15px',
    background: '#2C1810', color: '#FAF6F0',
    border: 'none', borderRadius: '12px',
    fontSize: '12px', letterSpacing: '0.12em',
    fontFamily: "'Jost', sans-serif",
    fontWeight: 600, textTransform: 'uppercase',
    transition: 'all 0.2s ease', marginBottom: '12px',
  },
  btnSec: {
    width: '100%', padding: '13px',
    background: 'transparent', color: '#8B6914',
    border: '1.5px solid #DDD3C0', borderRadius: '12px',
    fontSize: '12.5px', letterSpacing: '0.06em',
    fontFamily: "'Jost', sans-serif",
    fontWeight: 500, cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  footNote: {
    textAlign: 'center', marginTop: '20px',
    fontSize: '9px', letterSpacing: '0.2em',
    color: '#C4B49A', textTransform: 'uppercase',
  },
}

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,500&family=Jost:wght@300;400;500;600&display=swap');

  * { box-sizing: border-box; }

  .slide-in-left  { animation: slideLeft  0.65s cubic-bezier(.22,1,.36,1) both; }
  .slide-in-right { animation: slideRight 0.65s cubic-bezier(.22,1,.36,1) 0.1s both; }

  @keyframes slideLeft  { from { opacity:0; transform:translateX(-30px); } to { opacity:1; transform:translateX(0); } }
  @keyframes slideRight { from { opacity:0; transform:translateX(30px);  } to { opacity:1; transform:translateX(0); } }

  .otp-input:focus {
    outline: none !important;
    border-color: #8B6914 !important;
    background: #FDF8F0 !important;
    color: #2C1810 !important;
    box-shadow: 0 0 0 3.5px rgba(139,105,20,0.13) !important;
  }

  .btn-primary:hover:not(:disabled) {
    background: #3D2010 !important;
    transform: translateY(-1px);
    box-shadow: 0 8px 28px rgba(44,24,16,0.25) !important;
  }
  .btn-sec:hover {
    background: #F0E8D8 !important;
    border-color: #C4B08A !important;
    color: #2C1810 !important;
  }

  .shake { animation: shake 0.45s ease; }
  @keyframes shake {
    0%,100% { transform:translateX(0); }
    18%     { transform:translateX(-7px); }
    36%     { transform:translateX(7px); }
    54%     { transform:translateX(-4px); }
    72%     { transform:translateX(4px); }
  }

  .msg-fade { animation: msgIn 0.25s ease both; }
  @keyframes msgIn { from { opacity:0; transform:translateY(-6px); } to { opacity:1; transform:translateY(0); } }

  @media (max-width: 768px) {
    .slide-in-left { display: none !important; }
    div[style*="width: 52%"] { width: 100% !important; }
    div[style*="width: 48%"] { display: none !important; }
  }
`