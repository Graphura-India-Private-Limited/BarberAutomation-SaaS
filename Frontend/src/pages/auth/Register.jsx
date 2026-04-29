import { useState } from 'react'
import { Frame, Brand, Title, Sub, Field, Label, Input, PhoneRow, Btn, ErrBox } from "../../components"

const REGISTERED = ['9550105897', '9735897907']

export default function Register({ onBack }) {
  const [name, setName]   = useState('')
  const [phone, setPhone] = useState('')
  const [error, setError] = useState(false)
  const [done, setDone]   = useState(false)

  function handleRegister() {
    if (REGISTERED.includes(phone)) {
      setError(true)
      setDone(false)
      return
    }
    setError(false)
    setDone(true)
  }

  return (
    <Frame>
      <Brand />
      <Title>Create account</Title>
      <Sub>Register with your mobile number to get started</Sub>

      <Field>
        <Label>Full name</Label>
        <Input placeholder="e.g. Mayur K." value={name} onChange={e => setName(e.target.value)} />
      </Field>

      <Field>
        <Label>Mobile number</Label>
        <PhoneRow value={phone} onChange={setPhone} error={error} />
      </Field>

      {error && <ErrBox>This mobile number is already registered. Please login instead.</ErrBox>}

      {done && (
        <div className="bg-ok-bg border border-ok-bdr rounded-lg px-3 py-2.5 mb-2.5 text-xs text-ok-txt">
          Registration successful! OTP sent to +91 {phone}
        </div>
      )}

      <Btn onClick={handleRegister}>Create account</Btn>
      <Btn variant="sec" onClick={onBack}>Back to login</Btn>
    </Frame>
  )
}
