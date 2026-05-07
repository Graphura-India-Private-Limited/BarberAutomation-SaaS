import { useState } from 'react'
import { Frame, Brand, Title, Sub, Field, Label, PhoneRow, Btn, ErrBox, Divider } from "../../components"

export default function OTPLogin({ onSendOTP, onRegister }) {
  const [phone, setPhone] = useState('')
  const [error, setError] = useState(false)

  function handleSend() {
    if (phone.length < 10) {
      setError(true)
      return
    }
    setError(false)
    onSendOTP(phone)
  }

  return (
    <Frame>
      <Brand />
      <Title>Welcome back</Title>
      <Sub>Enter your mobile number to receive a one-time password</Sub>

      <Field>
        <Label>Mobile number</Label>
        <PhoneRow value={phone} onChange={setPhone} error={error} />
      </Field>

      {error && <ErrBox>Please enter a valid 10-digit mobile number</ErrBox>}

      <Btn onClick={handleSend}>Send OTP</Btn>

      <Divider />

      <div className="text-xs text-muted text-center">
        New user?{' '}
        <span
          onClick={onRegister}
          className="text-primary font-medium cursor-pointer underline"
        >
          Register here
        </span>
      </div>
    </Frame>
  )
}
