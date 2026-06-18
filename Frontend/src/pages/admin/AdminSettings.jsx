import { useState } from 'react'
import { Settings, Bell, Users, Shield, Globe, X, Check } from 'lucide-react'
import { Button } from '../../components/admin/UIComponents.jsx'

const NOTIFICATION_PREFS = [
  { key: 'emailNewTicket',  label: 'Email on new ticket',   defaultChecked: true },
  { key: 'emailEscalation', label: 'Email on escalation',   defaultChecked: true },
  { key: 'dailyDigest',     label: 'Daily digest report',   defaultChecked: false },
]

const SECURITY_PREFS = [
  { key: 'twoFactor',       label: 'Two-factor authentication',  defaultChecked: false },
  { key: 'sessionTimeout',  label: 'Session timeout (30 min)',   defaultChecked: true },
]

export function AdminSettings() {
  const [platformName, setPlatformName]       = useState('Support & Escalation System')
  const [timezone, setTimezone]               = useState('Asia/Kolkata (IST +5:30)')
  const [saveToast, setSaveToast]             = useState(false)
  const [notifPrefs, setNotifPrefs]           = useState(() =>
    Object.fromEntries(NOTIFICATION_PREFS.map(p => [p.key, p.defaultChecked]))
  )
  const [securityPrefs, setSecurityPrefs]     = useState(() => {
    const saved2FA = localStorage.getItem('security_twoFactor') === 'true';
    const savedTimeout = localStorage.getItem('security_sessionTimeout') !== 'false'; // default true
    return {
      twoFactor: saved2FA,
      sessionTimeout: savedTimeout
    };
  })

  const handleSave = () => {
    setSaveToast(true)
    setTimeout(() => setSaveToast(false), 3000)
  }

  const toggleNotif    = key => setNotifPrefs(p => ({ ...p, [key]: !p[key] }))
  const toggleSecurity = key => setSecurityPrefs(p => {
    const nextVal = !p[key];
    localStorage.setItem(`security_${key}`, nextVal ? "true" : "false");
    return { ...p, [key]: nextVal };
  })

  return (
    <div className="p-6 space-y-6 relative">

      {saveToast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-green-600 text-white px-4 py-3 rounded-xl shadow-lg font-sans text-xs font-extrabold uppercase tracking-wider">
          <Check size={16} /> Settings saved successfully
        </div>
      )}

      <Section icon={Bell} title="Notifications" desc="Configure email and in-app notification preferences for ticket updates.">
        <div className="space-y-3">
          {NOTIFICATION_PREFS.map(item => (
            <Toggle key={item.key} label={item.label} checked={notifPrefs[item.key]} onChange={() => toggleNotif(item.key)} />
          ))}
        </div>
      </Section>

      <Section icon={Users} title="Admin Management" desc="Sole administrator for the platform.">
        <div className="space-y-2">
          <div className="flex items-center justify-between p-3 bg-[#FAF6F0] rounded-xl border border-[#E8DDD0]">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-full bg-[#E8DDD0] flex items-center justify-center font-sans font-black text-xs text-[#9E7452]">
                G
              </div>
              <span className="font-sans text-sm font-normal leading-relaxed text-stone-700">Graphura</span>
            </div>
            <span className="font-sans text-[11px] font-extrabold uppercase tracking-widest text-[#C5A059] border border-[#E8DDD0] px-2 py-0.5 rounded-full bg-white">Admin</span>
          </div>
        </div>
      </Section>

      <Section icon={Shield} title="Security" desc="Configure session timeout, 2FA, and access controls.">
        <div className="space-y-3">
          {SECURITY_PREFS.map(item => (
            <Toggle key={item.key} label={item.label} checked={securityPrefs[item.key]} onChange={() => toggleSecurity(item.key)} />
          ))}
        </div>
      </Section>

      <Section icon={Globe} title="General" desc="Platform name, timezone, and locale settings.">
        <div className="space-y-3">
          <div>
            <label className="font-sans text-[11px] font-extrabold uppercase tracking-widest text-[#C5A059] block mb-1">Platform Name</label>
            <input
              value={platformName}
              onChange={e => setPlatformName(e.target.value)}
              className="w-full border border-[#E8DDD0] rounded-xl px-3 py-2 font-sans text-sm font-normal text-stone-700 focus:outline-none focus:ring-2 focus:ring-[#B58B67]"
            />
          </div>
          <div>
            <label className="font-sans text-[11px] font-extrabold uppercase tracking-widest text-[#C5A059] block mb-1">Timezone</label>
            <select
              value={timezone}
              onChange={e => setTimezone(e.target.value)}
              className="w-full border border-[#E8DDD0] rounded-xl px-3 py-2 font-sans text-sm font-normal text-stone-700 focus:outline-none focus:ring-2 focus:ring-[#B58B67]"
            >
              <option>Asia/Kolkata (IST +5:30)</option>
              <option>UTC</option>
              <option>America/New_York</option>
            </select>
          </div>
          <Button variant="primary" size="sm" onClick={handleSave} className="font-sans text-xs font-extrabold uppercase tracking-wider">
            <Check size={14} /> Save Settings
          </Button>
        </div>
      </Section>
    </div>
  )
}

function Section({ icon: Icon, title, desc, children }) {
  return (
    <div className="bg-white rounded-2xl border border-[#E8DDD0] shadow-sm p-5">
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 rounded-xl bg-[#F0E8DF] flex items-center justify-center shrink-0">
          <Icon size={18} className="text-[#B58B67]" />
        </div>
        <div className="flex-1">
          <h3 className="font-sans font-black uppercase text-base tracking-tight text-stone-900 mb-1">{title}</h3>
          <p className="font-sans text-sm font-normal leading-relaxed text-stone-600 mb-4">{desc}</p>
          {children}
        </div>
      </div>
    </div>
  )
}

function Toggle({ label, checked, onChange }) {
  return (
    <label className="flex items-center justify-between cursor-pointer">
      <span className="font-sans text-sm font-normal leading-relaxed text-stone-600">{label}</span>
      <button
        role="switch"
        aria-checked={checked}
        onClick={onChange}
        className={`relative w-10 h-5 rounded-full transition-colors ${checked ? 'bg-[#B58B67]' : 'bg-[#E8DDD0]'}`}
      >
        <span
          className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${checked ? 'translate-x-5' : ''}`}
        />
      </button>
    </label>
  )
}
