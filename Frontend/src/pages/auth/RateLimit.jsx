import { useState, useEffect, useRef } from 'react'
import { Frame, Brand, Title, Sub, Btn } from "../../components"

export default function RateLimit() {
  const [secs, setSecs]       = useState(59)
  const [ready, setReady]     = useState(false)
  const [clicked, setClicked] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    ref.current = setInterval(() => {
      setSecs(s => {
        if (s <= 1) {
          clearInterval(ref.current)
          setReady(true)
          return 0
        }
        return s - 1
      })
    }, 1000)
    return () => clearInterval(ref.current)
  }, [])

  function fmt(s) {
    return `00:${s < 10 ? '0' + s : s}`
  }

  function handleRetry() {
    setClicked(true)
  }

  return (
    <Frame>
      <Brand />
      <Title>Too many requests</Title>
      <Sub>You have made too many requests. Please wait before trying again.</Sub>

      {/* Warn box */}
      <div className="bg-warn-bg border border-accent rounded-xl p-4 text-center mb-3">
        <div className="text-[13px] font-medium text-primary mb-1">Please wait</div>
        <div className="text-xs text-muted mb-2">You can try again in</div>
        <div className="text-[36px] font-medium font-mono text-primary my-2.5">
          {fmt(secs)}
        </div>
        <div className="text-[11px] text-muted">seconds remaining</div>
      </div>

      {/* Error message */}
      <div className="bg-err-bg border border-err-bdr rounded-lg px-3 py-2.5 mb-2.5 flex gap-2 items-start">
        <div className="w-4 h-4 rounded-full bg-err-bdr text-white text-[10px] font-medium flex items-center justify-center flex-shrink-0 mt-px">
          !
        </div>
        <div className="text-xs text-err-txt leading-relaxed">
          Maximum 5 booking requests allowed per minute. Please wait and try again after the timer ends.
        </div>
      </div>

      <Btn
        onClick={handleRetry}
        className={ready && !clicked ? '' : 'opacity-[0.45] pointer-events-none'}
      >
        {clicked ? 'Redirecting...' : 'Try again'}
      </Btn>
      <Btn variant="sec">Go back to home</Btn>
    </Frame>
  )
}
