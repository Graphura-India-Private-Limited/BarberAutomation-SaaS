import React, { useState, useEffect } from 'react';

/**
 * DelayAlertBanner
 * Props:
 *   estimatedMinutes  – original estimated wait in minutes
 *   startTime         – Date when the booking session started (defaults to now)
 */
export default function DelayAlertBanner({ estimatedMinutes = 40, startTime }) {
  const [elapsedMins, setElapsedMins] = useState(0);
  const [visible, setVisible] = useState(true);
  const sessionStart = startTime || Date.now();

  useEffect(() => {
    const tick = () => {
      const diff = Math.floor((Date.now() - sessionStart) / 60000);
      setElapsedMins(diff);
    };
    tick();
    const id = setInterval(tick, 30000); // refresh every 30 s
    return () => clearInterval(id);
  }, [sessionStart]);

  const delay = elapsedMins - estimatedMinutes;

  // States
  let state = 'ontime'; // green
  if (delay >= 10) state = 'heavy';       // red
  else if (delay >= 5) state = 'slight';   // yellow

  const config = {
    ontime: {
      bg: 'bg-green-50',
      border: 'border-green-200',
      dot: 'bg-green-500',
      text: 'text-green-700',
      label: '✅ On Time',
      sub: 'Everything is running smoothly.',
      icon: '🟢',
    },
    slight: {
      bg: 'bg-yellow-50',
      border: 'border-yellow-300',
      dot: 'bg-yellow-400',
      text: 'text-yellow-700',
      label: `⚠️ Running ${delay} mins late`,
      sub: 'Slight delay — your barber will be with you shortly.',
      icon: '🟡',
    },
    heavy: {
      bg: 'bg-red-50',
      border: 'border-red-300',
      dot: 'bg-red-500',
      text: 'text-red-700',
      label: `🚨 Running ${delay} mins late`,
      sub: 'Heavy delay detected. We apologise for the inconvenience.',
      icon: '🔴',
    },
  }[state];

  if (!visible) return null;

  return (
    <div
      className={`relative flex items-start gap-3 p-4 rounded-2xl border ${config.bg} ${config.border} shadow-sm transition-all duration-500`}
    >
      {/* Pulsing dot */}
      <span className="relative flex h-3 w-3 mt-1 flex-shrink-0">
        <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-60 ${config.dot}`} />
        <span className={`relative inline-flex rounded-full h-3 w-3 ${config.dot}`} />
      </span>

      <div className="flex-1">
        <p className={`text-sm font-black ${config.text}`}>{config.label}</p>
        <p className={`text-[11px] mt-0.5 ${config.text} opacity-70`}>{config.sub}</p>
      </div>

      {/* Dismiss */}
      <button
        onClick={() => setVisible(false)}
        className={`text-xs font-bold ${config.text} opacity-50 hover:opacity-100 transition-opacity`}
      >
        ✕
      </button>
    </div>
  );
}
