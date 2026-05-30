import React from 'react';
import { 
  Ticket, Users, HeadphonesIcon, AlertTriangle, 
  CheckCircle, Clock, TrendingUp, XCircle, ChevronRight, Activity
} from 'lucide-react';
import { StatCard, RecentTickets } from '../../Components/DashboardWidgets.jsx';
import { getStats, TICKET_STATUS } from '../../utils/tickets.jsx';
import { StatusBadge } from '../../Components/TicketBadges.jsx';

const GOLD = "#C5A059";
const CHARCOAL = "#3E362E";

export function DashboardPage({ tickets, onSelectTicket }) {
  const stats = getStats(tickets);

  const breakdown = [
    { label: 'Open Issue Track', value: stats.open, color: 'bg-[#C5A059]', status: TICKET_STATUS.OPEN },
    { label: 'In Progress Handling', value: stats.inProgress, color: 'bg-[#3E362E]', status: TICKET_STATUS.IN_PROGRESS },
    { label: 'Escalated Critical', value: stats.escalated, color: 'bg-rose-500', status: TICKET_STATUS.ESCALATED },
    { label: 'Resolved Operations', value: stats.resolved, color: 'bg-emerald-500', status: TICKET_STATUS.RESOLVED },
    { label: 'Closed Archive', value: stats.closed, color: 'bg-stone-300', status: TICKET_STATUS.CLOSED },
  ];

  return (
    <div className="p-6 space-y-8 text-stone-800 animate-in fade-in duration-300">
      
      {/* ── CRITICAL ALERT BANNER ── */}
      {stats.critical > 0 && (
        <div className="bg-rose-50/60 border border-rose-200 rounded-2xl px-5 py-4 flex items-start gap-3.5 shadow-xs">
          <AlertTriangle size={18} className="text-rose-600 shrink-0 mt-0.5" />
          <div className="text-left">
            <p className="font-sans text-[11px] font-extrabold uppercase tracking-widest text-rose-800">
              {stats.critical} Critical Ticket{stats.critical > 1 ? 's' : ''} Require Immediate Attention
            </p>
            <p className="font-sans text-sm font-normal leading-relaxed text-rose-600/90 mt-1">Please review details and execute support escalation procedures immediately.</p>
          </div>
        </div>
      )}

      {/* ── CORE VOLUME SEGMENT METRICS ── */}
      <div>
        <div className="mb-4 text-left">
          <p className="font-sans text-[11px] font-extrabold uppercase tracking-widest text-[#C5A059]">System Volume Analysis</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCardItem label="Total Tickets" value={stats.total} icon={Ticket} bg="bg-stone-50" border="border-stone-200" sub="All time ledger logs" />
          <StatCardItem label="Customer Issues" value={stats.customerIssues} icon={Users} bg="bg-amber-50/50" border="border-amber-200/50" sub="B2C Client Portal incoming" />
          <StatCardItem label="Salon Partner Issues" value={stats.salonIssues} icon={HeadphonesIcon} bg="bg-stone-50" border="border-stone-200" sub="B2B Merchant Console incoming" />
          <StatCardItem label="Critical Pipeline" value={stats.critical} icon={AlertTriangle} bg="bg-rose-50/50" border="border-rose-200/60" sub="Requires manual action" isCritical={stats.critical > 0} />
        </div>
      </div>

      {/* ── STATE DISPATCH COUNTER METRICS ── */}
      <div>
        <div className="mb-4 text-left">
          <p className="font-sans text-[11px] font-extrabold uppercase tracking-widest text-[#C5A059]">Active Queue Pipeline States</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCardItem label="Open Status" value={stats.open} icon={Clock} bg="bg-white" border="border-stone-200" />
          <StatCardItem label="In Progress" value={stats.inProgress} icon={TrendingUp} bg="bg-white" border="border-stone-200" />
          <StatCardItem label="Resolved" value={stats.resolved} icon={CheckCircle} bg="bg-white" border="border-stone-200" />
          <StatCardItem label="Closed Items" value={stats.closed} icon={XCircle} bg="bg-white" border="border-stone-200" />
        </div>
      </div>

      {/* ── VISUAL ANALYTIC DATA BREAKDOWNS ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-left">
        
        {/* Progress Timeline Distribution */}
        <div className="card p-6 bg-white shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="font-sans font-black uppercase text-base tracking-tight text-stone-900">Status Breakdown</h3>
            <p className="font-sans text-sm font-normal leading-relaxed text-stone-600 mt-1">Audit density share split across live nodes</p>
          </div>
          
          <div className="space-y-4 my-auto py-2">
            {breakdown.map(b => (
              <div key={b.label} className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-sans text-xs font-extrabold uppercase tracking-widest text-[#C5A059]">{b.label}</span>
                  <span className="font-sans font-black text-sm text-stone-900">{b.value}</span>
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
            <h3 className="font-sans font-black uppercase text-base tracking-tight text-stone-900">Issue Type Split</h3>
            <p className="font-sans text-sm font-normal leading-relaxed text-stone-600 mt-1">Distribution ratio between client segments</p>
          </div>
          
          <div className="flex items-center justify-center gap-8 my-auto py-4">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full border-4 flex items-center justify-center mx-auto bg-stone-50 font-sans font-black text-stone-900 text-lg shadow-inner" style={{ borderColor: GOLD }}>
                {stats.customerIssues}
              </div>
              <p className="font-sans text-[11px] font-extrabold uppercase tracking-widest text-[#C5A059] mt-2">Customer</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 rounded-full border-4 flex items-center justify-center mx-auto bg-stone-50 font-sans font-black text-stone-900 text-lg shadow-inner" style={{ borderColor: CHARCOAL }}>
                {stats.salonIssues}
              </div>
              <p className="font-sans text-[11px] font-extrabold uppercase tracking-widest text-stone-400 mt-2">Salon Outlet</p>
            </div>
          </div>

          <div className="flex gap-2.5 pt-2 border-t border-stone-50">
            <div className="flex-1 bg-stone-50/60 border border-stone-200/60 rounded-xl p-3 text-center">
              <p className="font-sans font-black text-xl" style={{ color: GOLD }}>
                {stats.total > 0 ? Math.round((stats.customerIssues / stats.total) * 100) : 0}%
              </p>
              <p className="font-sans text-[11px] font-extrabold uppercase tracking-widest text-[#C5A059] mt-0.5">B2C Weight</p>
            </div>
            <div className="flex-1 bg-stone-50/60 border border-stone-200/60 rounded-xl p-3 text-center">
              <p className="font-sans font-black text-xl" style={{ color: CHARCOAL }}>
                {stats.total > 0 ? Math.round((stats.salonIssues / stats.total) * 100) : 0}%
              </p>
              <p className="font-sans text-[11px] font-extrabold uppercase tracking-widest text-stone-400 mt-0.5">B2B Weight</p>
            </div>
          </div>
        </div>

        {/* Quick Parameters Checklist Summary */}
        <div className="card p-6 bg-white shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="font-sans font-black uppercase text-base tracking-tight text-stone-900">Quick Summary</h3>
            <p className="font-sans text-sm font-normal leading-relaxed text-stone-600 mt-1">Core performance index reference parameters</p>
          </div>
          
          <ul className="divide-y divide-stone-50 my-auto">
            <li className="flex items-center justify-between py-2.5">
              <span className="font-sans text-sm font-normal leading-relaxed text-stone-600">Unassigned Pipeline Pool</span>
              <span className="font-sans font-black text-xs uppercase tracking-wider text-stone-900 bg-stone-50 px-2 py-0.5 rounded border border-stone-200/60">
                {tickets.filter(t => t.assignee === 'Unassigned').length}
              </span>
            </li>
            <li className="flex items-center justify-between py-2.5">
              <span className="font-sans text-sm font-normal leading-relaxed text-stone-600">Escalated Today</span>
              <span className="font-sans font-black text-xs uppercase tracking-wider text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-100">{stats.escalated}</span>
            </li>
            <li className="flex items-center justify-between py-2.5">
              <span className="font-sans text-sm font-normal leading-relaxed text-stone-600">Resolution SLA Rate</span>
              <span className="font-sans font-black text-xs uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                {stats.total > 0 ? Math.round(((stats.resolved + stats.closed) / stats.total) * 100) : 0}%
              </span>
            </li>
            <li className="flex items-center justify-between py-2.5">
              <span className="font-sans text-sm font-normal leading-relaxed text-stone-600">Active Pipeline Load</span>
              <span className="font-sans font-black text-xs uppercase tracking-wider text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-100">{stats.open + stats.inProgress}</span>
            </li>
          </ul>
        </div>
      </div>

      {/* ── RECENT TICKETS ENTRY LEDGER LIST ── */}
      <div className="pt-2">
        <RecentTickets tickets={tickets} onSelect={onSelectTicket} />
      </div>
    </div>
  );
}

{/* ── ISOLATED STRUCTURAL METRIC COMPONENT CELL ── */}
function StatCardItem({ label, value, icon: Icon, bg, border, sub, isCritical = false }) {
  return (
    <div className={`card p-5 flex items-center gap-4 shadow-2xs ${bg} ${border}`}>
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${isCritical ? 'bg-rose-100 border border-rose-300 text-rose-600' : 'bg-white border border-stone-200/80 text-stone-500 shadow-3xs'}`}>
        <Icon size={18} strokeWidth={2.5} className={!isCritical ? 'text-stone-500' : ''} style={{ color: (!isCritical && Icon === Ticket) ? GOLD : '' }} />
      </div>
      <div className="flex-1 min-w-0 text-left">
        <p className="font-sans text-[11px] font-extrabold uppercase tracking-widest text-[#C5A059] mb-0.5">{label}</p>
        <h3 className={`font-sans font-black text-2xl leading-none tracking-tight ${isCritical ? 'text-rose-700' : 'text-stone-900'}`}>{value}</h3>
        {sub && <p className="font-sans text-[11px] font-extrabold uppercase tracking-widest text-stone-400 mt-1 truncate">{sub}</p>}
      </div>
    </div>
  );
}