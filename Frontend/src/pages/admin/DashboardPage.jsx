import React, { useState, useEffect } from 'react';
import { 
  Ticket, Users, HeadphonesIcon, AlertTriangle, 
  CheckCircle, Clock, TrendingUp, XCircle,
  Mail, Search, Trash2, RefreshCw
} from 'lucide-react';
import { StatCard, RecentTickets } from '../../Components/DashboardWidgets.jsx';
import { getStats, TICKET_STATUS } from '../../utils/tickets.jsx';
import { StatusBadge } from '../../Components/TicketBadges.jsx';
import { useSubscriptions } from '../../contexts/AppContext.jsx';

const GOLD = "#C5A059";
const CHARCOAL = "#3E362E";
const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const getToken = () => localStorage.getItem("token");

export function DashboardPage({ tickets, onSelectTicket }) {
  const stats = getStats(tickets);
  const { subscriptions } = useSubscriptions();

  /* ── Newsletter Subscribers State ── */
  const [subscribers, setSubscribers] = useState([]);
  const [subLoading, setSubLoading] = useState(true);
  const [subSearch, setSubSearch] = useState("");
  const [deletingId, setDeletingId] = useState(null);
  const [subError, setSubError] = useState(null);

  const fetchSubscribers = async () => {
    setSubLoading(true);
    setSubError(null);
    try {
      const res = await fetch(`${API}/admin/newsletter-subscribers`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      if (data.success) {
        setSubscribers(data.subscribers || []);
      } else {
        setSubError(data.message || "Failed to load subscribers.");
      }
    } catch {
      setSubError("Network error. Could not load subscribers.");
    } finally {
      setSubLoading(false);
    }
  };

  useEffect(() => { fetchSubscribers(); }, []);

  const handleDeleteSubscriber = async (id) => {
    setDeletingId(id);
    try {
      const res = await fetch(`${API}/admin/newsletter-subscribers/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${getToken()}`,
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      if (data.success) {
        setSubscribers(prev => prev.filter(s => s._id !== id));
      }
    } catch {
      // silently ignore
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    const d = new Date(dateStr);
    return (
      d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) +
      " · " +
      d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true })
    );
  };

  const filteredSubscribers = subscribers.filter(s =>
    s.email.toLowerCase().includes(subSearch.toLowerCase())
  );

  const breakdown = [
    { label: 'Open Issue Track',       value: stats.open,       color: 'bg-[#C5A059]',   status: TICKET_STATUS.OPEN },
    { label: 'In Progress Handling',   value: stats.inProgress, color: 'bg-[#3E362E]',   status: TICKET_STATUS.IN_PROGRESS },
    { label: 'Escalated Critical',     value: stats.escalated,  color: 'bg-rose-500',    status: TICKET_STATUS.ESCALATED },
    { label: 'Resolved Operations',    value: stats.resolved,   color: 'bg-emerald-500', status: TICKET_STATUS.RESOLVED },
    { label: 'Closed Archive',         value: stats.closed,     color: 'bg-stone-300',   status: TICKET_STATUS.CLOSED },
  ];

  return (
    <div className="p-6 space-y-8 text-stone-800 animate-in fade-in duration-300">

      {/* ── CRITICAL ALERT BANNER ── */}
      {stats.critical > 0 && (
        <div className="bg-rose-50/60 border border-rose-200 rounded-2xl px-5 py-4 flex items-start gap-3.5 shadow-xs">
          <AlertTriangle size={18} className="text-rose-600 shrink-0 mt-0.5" />
          <div className="text-left">
            <p className="text-xs font-black uppercase tracking-wider text-rose-800">
              {stats.critical} Critical Ticket{stats.critical > 1 ? 's' : ''} Require Immediate Attention
            </p>
            <p className="text-sm font-medium text-rose-600/90 mt-1">
              Please review details and execute support escalation procedures immediately.
            </p>
          </div>
        </div>
      )}

      {/* ── CORE VOLUME SEGMENT METRICS ── */}
      <div>
        <div className="mb-4 text-left">
          <p className="text-[10px] font-black uppercase tracking-widest text-stone-400">System Volume Analysis</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCardItem label="Total Tickets"        value={stats.total}          icon={Ticket}         bg="bg-stone-50"    border="border-stone-200"    sub="All time ledger logs" />
          <StatCardItem label="Customer Issues"      value={stats.customerIssues} icon={Users}          bg="bg-amber-50/50" border="border-amber-200/50" sub="B2C Client Portal incoming" />
          <StatCardItem label="Salon Partner Issues" value={stats.salonIssues}    icon={HeadphonesIcon} bg="bg-stone-50"    border="border-stone-200"    sub="B2B Merchant Console incoming" />
          <StatCardItem label="Critical Pipeline"    value={stats.critical}       icon={AlertTriangle}  bg="bg-rose-50/50"  border="border-rose-200/60"  sub="Requires manual action" isCritical={stats.critical > 0} />
        </div>
      </div>

      {/* ── STATE DISPATCH COUNTER METRICS ── */}
      <div>
        <div className="mb-4 text-left">
          <p className="text-[10px] font-black uppercase tracking-widest text-stone-400">Active Queue Pipeline States</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCardItem label="Open Status"  value={stats.open}        icon={Clock}       bg="bg-white" border="border-stone-200" />
          <StatCardItem label="In Progress"  value={stats.inProgress}  icon={TrendingUp}  bg="bg-white" border="border-stone-200" />
          <StatCardItem label="Resolved"     value={stats.resolved}    icon={CheckCircle} bg="bg-white" border="border-stone-200" />
          <StatCardItem label="Closed Items" value={stats.closed}      icon={XCircle}     bg="bg-white" border="border-stone-200" />
        </div>
      </div>

      {/* ── VISUAL ANALYTIC DATA BREAKDOWNS ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-left">

        {/* Progress Timeline Distribution */}
        <div className="card p-6 bg-white shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-md font-black font-serif text-stone-900 tracking-tight">Status Breakdown</h3>
            <p className="text-[11px] text-stone-400 font-medium mt-1">Audit density share split across live nodes</p>
          </div>
          <div className="space-y-4 my-auto py-2">
            {breakdown.map(b => (
              <div key={b.label} className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-stone-600 tracking-wide">{b.label}</span>
                  <span className="text-sm font-mono font-black text-stone-900">{b.value}</span>
                </div>
                <div className="w-full bg-stone-100 rounded-full h-1.5 overflow-hidden">
                  <div
                    className={`${b.color} h-full rounded-full transition-all duration-500`}
                    style={{ width: stats.total > 0 ? `${(b.value / stats.total) * 100}%` : '0%' }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Donut Style Split Data Ratio */}
        <div className="card p-6 bg-white shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-md font-black font-serif text-stone-900 tracking-tight">Issue Type Split</h3>
            <p className="text-[11px] text-stone-400 font-medium mt-1">Distribution ratio between client segments</p>
          </div>
          <div className="flex items-center justify-center gap-8 my-auto py-4">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full border-4 flex items-center justify-center mx-auto bg-stone-50 font-mono font-black text-stone-900 text-lg shadow-inner" style={{ borderColor: GOLD }}>
                {stats.customerIssues}
              </div>
              <p className="text-[10px] font-black uppercase tracking-wider text-stone-400 mt-2">Customer</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 rounded-full border-4 flex items-center justify-center mx-auto bg-stone-50 font-mono font-black text-stone-900 text-lg shadow-inner" style={{ borderColor: CHARCOAL }}>
                {stats.salonIssues}
              </div>
              <p className="text-[10px] font-black uppercase tracking-wider text-stone-400 mt-2">Salon Outlet</p>
            </div>
          </div>
          <div className="flex gap-2.5 pt-2 border-t border-stone-50">
            <div className="flex-1 bg-stone-50/60 border border-stone-200/60 rounded-xl p-3 text-center">
              <p className="text-xl font-mono font-black" style={{ color: GOLD }}>
                {stats.total > 0 ? Math.round((stats.customerIssues / stats.total) * 100) : 0}%
              </p>
              <p className="text-[9px] font-black uppercase tracking-wider text-stone-400 mt-0.5">B2C Weight</p>
            </div>
            <div className="flex-1 bg-stone-50/60 border border-stone-200/60 rounded-xl p-3 text-center">
              <p className="text-xl font-mono font-black" style={{ color: CHARCOAL }}>
                {stats.total > 0 ? Math.round((stats.salonIssues / stats.total) * 100) : 0}%
              </p>
              <p className="text-[9px] font-black uppercase tracking-wider text-stone-400 mt-0.5">B2B Weight</p>
            </div>
          </div>
        </div>

        {/* Quick Parameters Checklist Summary */}
        <div className="card p-6 bg-white shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-md font-black font-serif text-stone-900 tracking-tight">Quick Summary</h3>
            <p className="text-[11px] text-stone-400 font-medium mt-1">Core performance index reference parameters</p>
          </div>
          <ul className="divide-y divide-stone-50 my-auto">
            <li className="flex items-center justify-between py-2.5 text-xs font-bold">
              <span className="text-stone-500">Unassigned Pipeline Pool</span>
              <span className="font-mono text-stone-900 bg-stone-50 px-2 py-0.5 rounded border border-stone-200/60 font-black">
                {tickets.filter(t => t.assignee === 'Unassigned').length}
              </span>
            </li>
            <li className="flex items-center justify-between py-2.5 text-xs font-bold">
              <span className="text-stone-500">Escalated Today</span>
              <span className="font-mono text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-100 font-black">{stats.escalated}</span>
            </li>
            <li className="flex items-center justify-between py-2.5 text-xs font-bold">
              <span className="text-stone-500">Resolution SLA Rate</span>
              <span className="font-mono text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100 font-black">
                {stats.total > 0 ? Math.round(((stats.resolved + stats.closed) / stats.total) * 100) : 0}%
              </span>
            </li>
            <li className="flex items-center justify-between py-2.5 text-xs font-bold">
              <span className="text-stone-500">Active Pipeline Load</span>
              <span className="font-mono text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-100 font-black">
                {stats.open + stats.inProgress}
              </span>
            </li>
          </ul>
        </div>
      </div>

      {/* ── FOOTER SUBSCRIPTIONS SUMMARY ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-6 bg-white shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-md font-black font-serif text-stone-900 tracking-tight">Footer Subscriptions</h3>
              <p className="text-[11px] text-stone-400 font-medium mt-1">Emails submitted from the home page footer.</p>
            </div>
            <span className="text-sm font-black text-stone-900 bg-stone-100 px-3 py-1 rounded-full border border-stone-200">
              {subscriptions.length}
            </span>
          </div>
          <div className="text-sm text-stone-500">Latest subscription emails are available here for admin review.</div>
        </div>

        <div className="card p-6 bg-white shadow-sm">
          <h3 className="text-md font-black font-serif text-stone-900 tracking-tight mb-4">Recent Footer Emails</h3>
          {subscriptions.length === 0 ? (
            <p className="text-sm text-stone-500">No footer emails have been submitted yet.</p>
          ) : (
            <ul className="space-y-3">
              {subscriptions.slice(-5).reverse().map((sub) => (
                <li key={sub.id} className="flex items-center justify-between gap-3 rounded-xl border border-stone-200/60 bg-stone-50 px-4 py-3">
                  <span className="truncate text-sm text-stone-700">{sub.email}</span>
                  <span className="text-[11px] uppercase tracking-[0.18em] text-stone-400">
                    {new Date(sub.createdAt).toLocaleDateString()}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* ── RECENT TICKETS ENTRY LEDGER LIST ── */}
      <div className="pt-2">
        <RecentTickets tickets={tickets} onSelect={onSelectTicket} />
      </div>

      {/* ══════════════════════════════════════════════════════════
          ── NEWSLETTER SUBSCRIBERS — visible on /admin/dashboard ONLY ──
         ══════════════════════════════════════════════════════════ */}
      <div className="pt-2">
        <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">

          {/* ── Card Header ── */}
          <div className="px-6 py-5 border-b border-stone-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: "#FDF9F3", border: `1px solid ${GOLD}30` }}
              >
                <Mail size={18} style={{ color: GOLD }} />
              </div>
              <div className="text-left">
                <h3 className="font-serif font-bold text-[17px] text-stone-900 tracking-tight">
                  Newsletter Subscribers
                </h3>
                <p className="text-[11px] text-stone-400 font-medium mt-0.5">
                  Emails collected from the home page footer
                </p>
              </div>
              {!subLoading && (
                <span
                  className="ml-2 px-2.5 py-0.5 rounded-full text-[11px] font-black"
                  style={{ background: `${GOLD}18`, color: GOLD }}
                >
                  {subscribers.length}
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              {/* Search box */}
              <div className="flex items-center gap-2 bg-stone-50 border border-stone-200 rounded-xl px-3 py-2">
                <Search size={13} className="text-stone-400 shrink-0" />
                <input
                  type="text"
                  placeholder="Search email..."
                  value={subSearch}
                  onChange={e => setSubSearch(e.target.value)}
                  className="bg-transparent text-[12px] text-stone-700 placeholder:text-stone-400 outline-none w-36"
                />
              </div>
              {/* Refresh button */}
              <button
                onClick={fetchSubscribers}
                disabled={subLoading}
                className="w-9 h-9 rounded-xl border border-stone-200 bg-stone-50 flex items-center justify-center text-stone-500 hover:bg-amber-50 hover:border-amber-200 hover:text-amber-600 transition-all duration-200 disabled:opacity-50"
                title="Refresh subscribers"
              >
                <RefreshCw size={14} className={subLoading ? "animate-spin" : ""} />
              </button>
            </div>
          </div>

          {/* ── Card Body ── */}
          <div className="px-6 py-4">
            {subLoading ? (
              /* Loading skeleton */
              <div className="space-y-3">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="flex items-center justify-between py-3 border-b border-stone-50 animate-pulse">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-stone-100 shrink-0" />
                      <div className="space-y-1.5">
                        <div className="h-3 w-48 bg-stone-100 rounded-full" />
                        <div className="h-2 w-32 bg-stone-100 rounded-full" />
                      </div>
                    </div>
                    <div className="h-7 w-7 rounded-lg bg-stone-100" />
                  </div>
                ))}
              </div>
            ) : subError ? (
              /* Error state */
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <div className="w-12 h-12 rounded-full bg-rose-50 border border-rose-200 flex items-center justify-center mb-3">
                  <AlertTriangle size={20} className="text-rose-500" />
                </div>
                <p className="text-[13px] font-semibold text-stone-700">{subError}</p>
                <button
                  onClick={fetchSubscribers}
                  className="mt-3 text-[11px] font-bold underline underline-offset-2"
                  style={{ color: GOLD }}
                >
                  Try again
                </button>
              </div>
            ) : filteredSubscribers.length === 0 ? (
              /* Empty state */
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-3" style={{ background: "#FDF9F3" }}>
                  <Mail size={26} style={{ color: GOLD }} />
                </div>
                <p className="text-[13px] font-semibold text-stone-700">
                  {subSearch ? `No results for "${subSearch}"` : "No subscribers yet"}
                </p>
                <p className="text-[11px] text-stone-400 mt-1">
                  {subSearch
                    ? "Try a different search term."
                    : "Emails submitted via the footer will appear here."}
                </p>
              </div>
            ) : (
              /* Subscriber rows */
              <div className="divide-y divide-stone-50">
                {filteredSubscribers.map((sub, idx) => (
                  <div
                    key={sub._id}
                    className="flex items-center justify-between py-3 group hover:bg-amber-50/40 rounded-xl px-2 -mx-2 transition-colors duration-150"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      {/* Coloured initial avatar */}
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-[11px] font-black text-white"
                        style={{ background: `hsl(${(idx * 53 + 18) % 360}, 55%, 52%)` }}
                      >
                        {sub.email[0]?.toUpperCase()}
                      </div>
                      <div className="min-w-0 text-left">
                        <p className="text-[13px] font-semibold text-stone-800 truncate">{sub.email}</p>
                        <p className="text-[10px] text-stone-400 font-medium mt-0.5">{formatDate(sub.subscribedAt)}</p>
                      </div>
                    </div>

                    {/* Delete button — appears on row hover */}
                    <button
                      onClick={() => handleDeleteSubscriber(sub._id)}
                      disabled={deletingId === sub._id}
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-stone-300 hover:bg-rose-50 hover:text-rose-500 border border-transparent hover:border-rose-200 transition-all duration-200 opacity-0 group-hover:opacity-100 disabled:opacity-50 shrink-0 ml-3"
                      title="Remove subscriber"
                    >
                      {deletingId === sub._id
                        ? <RefreshCw size={12} className="animate-spin" />
                        : <Trash2 size={13} />
                      }
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ── Card Footer bar ── */}
          {!subLoading && !subError && subscribers.length > 0 && (
            <div className="px-6 py-3 border-t border-stone-100 bg-stone-50/50 flex items-center justify-between">
              <p className="text-[10px] font-black uppercase tracking-wider text-stone-400">
                Showing {filteredSubscribers.length} of {subscribers.length} subscriber{subscribers.length !== 1 ? 's' : ''}
              </p>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wide">Live Collection Active</span>
              </div>
            </div>
          )}

        </div>
      </div>

    </div>
  );
}

/* ── ISOLATED STRUCTURAL METRIC COMPONENT CELL ── */
function StatCardItem({ label, value, icon: Icon, bg, border, sub, isCritical = false }) {
  return (
    <div className={`card p-5 flex items-center gap-4 shadow-2xs ${bg} ${border}`}>
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${isCritical ? 'bg-rose-100 border border-rose-300 text-rose-600' : 'bg-white border border-stone-200/80 text-stone-500 shadow-3xs'}`}>
        <Icon size={18} strokeWidth={2.5} className={!isCritical ? 'text-stone-500' : ''} style={{ color: (!isCritical && Icon === Ticket) ? GOLD : '' }} />
      </div>
      <div className="flex-1 min-w-0 text-left">
        <p className="text-[10px] font-black text-stone-400 uppercase tracking-wider mb-0.5">{label}</p>
        <h3 className={`text-2xl font-black font-serif leading-none tracking-tight ${isCritical ? 'text-rose-700' : 'text-stone-900'}`}>{value}</h3>
        {sub && <p className="text-[9px] font-bold text-stone-400 mt-1 truncate font-sans uppercase tracking-wide">{sub}</p>}
      </div>
    </div>
  );
}