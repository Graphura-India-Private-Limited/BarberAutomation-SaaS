import { SERVICES, AVG_CUT } from './constants';

export function timeAgo(ts) {
  const s = Math.floor((Date.now() - ts) / 1000);
  if (s < 60) return `${s}s ago`;
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  return `${Math.floor(s / 3600)}h ago`;
}

export function fmtWait(position, service) {
  const svc = SERVICES.find((s) => s.id === service);
  const mins = (position - 1) * AVG_CUT + (svc?.mins ?? AVG_CUT);
  if (mins < 60) return `~${mins}m`;
  return `~${Math.floor(mins / 60)}h ${mins % 60}m`;
}