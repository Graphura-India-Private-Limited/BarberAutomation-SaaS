import { useState } from 'react'
import { Frame, Brand, Title, Sub, Btn, ErrBox, OkBox } from "../../components/common/FormAtoms"

const PLAN_ROWS = [
  ['Membership plan',  'Silver'],
  ['Billing cycle',    'Monthly'],
  ['Points per visit', '20 pts'],
  ['Discount',         '10%'],
  ['Priority access',  'Yes'],
]

export default function Payment() {
  const [state, setState] = useState(0) // 0=idle, 1=failed, 2=success

  function handlePay() {
    setState(s => (s + 1) % 3)
  }

  const done = state === 2

  return (
    <Frame>
      <Brand />
      <Title>Payment verification</Title>
      <Sub>Confirm your Silver membership purchase</Sub>

      {/* Badge */}
      <div className="inline-block text-[10px] px-2 py-0.5 rounded-full bg-input-bg text-primary border border-accent mb-2.5 self-start">
        Silver Plan — Monthly
      </div>

      {/* Plan summary */}
      <div className="bg-input-bg border border-border rounded-[10px] px-3.5 py-3 mb-3">
        {PLAN_ROWS.map(([k, v]) => (
          <div key={k} className="flex justify-between text-xs py-[3px] text-secondary">
            <span>{k}</span>
            <span>{v}</span>
          </div>
        ))}
        <div className="flex justify-between text-sm font-medium text-primary pt-2 border-t border-border mt-1.5">
          <span>Total</span>
          <span>Rs. 299 / mo</span>
        </div>
      </div>

      {state === 1 && <ErrBox>Payment failed. Please check your details and try again.</ErrBox>}
      {state === 2 && <OkBox>Payment verified! Silver membership is now active.</OkBox>}

      <Btn
        onClick={handlePay}
        className={done ? 'opacity-60 pointer-events-none' : ''}
      >
        {done ? 'Payment done' : 'Pay Rs. 299'}
      </Btn>
      <Btn variant="sec">Cancel</Btn>

      <div className="flex items-center gap-1 justify-center text-[11px] text-muted mt-1.5">
        🔒 Secured — your data is encrypted
      </div>
    </Frame>
  )
}
