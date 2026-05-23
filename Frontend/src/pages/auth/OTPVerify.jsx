import { useState, useEffect, useRef } from 'react'
import { Frame, Brand, Title, Sub, Btn, ErrBox, OkBox } from "../../components/common/FormAtoms"

const CORRECT_OTP = '1234'
const MAX_ATTEMPTS = 3
const TIMER_SECS = 150

export default function OTPVerify({ phone, onBack }) {
  const [otp, setOtp] = useState('')
  const [attempts, setAttempts] = useState(0)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [timerSecs, setTimerSecs] = useState(TIMER_SECS)
  const [canResend, setCanResend] = useState(false)
  const inputRef = useRef(null)
  const timerRef = useRef(null)

  useEffect(() => {
    startTimer()
    return () => clearInterval(timerRef.current)
  }, [])

  function startTimer() {
    clearInterval(timerRef.current)
    setTimerSecs(TIMER_SECS)
    setCanResend(false)
    timerRef.current = setInterval(() => {
      setTimerSecs(s => {
        if (s <= 1) {
          clearInterval(timerRef.current)
          setCanResend(true)
          return 0
        }
        return s - 1
      })
    }, 1000)
  }

  function handleResend() {
    if (!canResend) return
    setOtp('')
    setError('')
    setSuccess(false)
    setAttempts(0)
    startTimer()
  }

  function formatTimer(s) {
    const m = Math.floor(s / 60)
    const sec = s % 60
    return `${m < 10 ? '0' + m : m}:${sec < 10 ? '0' + sec : sec}`
  }

  function handleOtpInput(val) {
    const clean = val.replace(/\D/g, '').slice(0, 4)
    setOtp(clean)
  }

  function verify() {
    if (otp.length < 4) {
      setError('Please enter all 4 digits of the OTP.')
      setSuccess(false)
      return
    }
    const newAttempts = attempts + 1
    setAttempts(newAttempts)
    if (otp === CORRECT_OTP) {
      setError('')
      setSuccess(true)
    } else {
      setSuccess(false)
      setOtp('')
      const rem = MAX_ATTEMPTS - newAttempts
      setError(
        rem > 0
          ? `Invalid OTP. ${rem} attempt${rem > 1 ? 's' : ''} remaining before lockout.`
          : 'Too many failed attempts. Your account is temporarily locked.'
      )
    }
  }

  const locked = attempts >= MAX_ATTEMPTS && !success

  return (
    <Frame>
      <Brand />
      <Title>Enter OTP</Title>
      <Sub>We sent a 4-digit code to +91 {phone || '98765 43210'}. Valid for 5 minutes.</Sub>

      {/* OTP boxes */}
      <div
        className="flex gap-2.5 justify-center my-4 cursor-text"
        onClick={() => inputRef.current?.focus()}
      >
        {[0, 1, 2, 3].map(i => {
          const filled = i < otp.length
          const active = i === otp.length
          return (
            <div
              key={i}
              className={[
                'w-[52px] h-14 rounded-[10px] text-[22px] font-medium flex items-center justify-center font-mono text-primary transition-colors duration-150',
                active
                  ? 'border-[1.5px] border-accent bg-surface'
                  : filled
                    ? 'border border-primary bg-input-bg'
                    : 'border border-border bg-input-bg',
              ].join(' ')}
            >
              {filled ? otp[i] : '_'}
            </div>
          )
        })}
      </div>

      {/* Hidden real input */}
      <input
        ref={inputRef}
        type="tel"
        maxLength={4}
        value={otp}
        onChange={e => handleOtpInput(e.target.value)}
        className="opacity-0 absolute w-px h-px"
      />

      {/* Timer */}
      <div className="text-center text-xs text-muted mt-1">
        {canResend ? (
          <>
            <span>Resend OTP: </span>
            <b
              className="text-primary cursor-pointer underline font-medium"
              onClick={handleResend}
            >
              Resend now
            </b>
          </>
        ) : (
          <>
            Resend OTP in <b className="text-primary font-medium">{formatTimer(timerSecs)}</b>
          </>
        )}
      </div>

      <div className="h-2.5" />

      {error   && <ErrBox>{error}</ErrBox>}
      {success && <OkBox>OTP verified! Redirecting to your dashboard...</OkBox>}

      <Btn
        onClick={verify}
        className={locked ? 'opacity-50 pointer-events-none' : ''}
      >
        Verify OTP
      </Btn>
      <Btn variant="sec" onClick={onBack}>Change number</Btn>
    </Frame>
  )
}
