<<<<<<< HEAD
import React, { useState, useEffect } from 'react';
import { 
  Ticket, Users, HeadphonesIcon, AlertTriangle, 
  CheckCircle, Clock, TrendingUp, XCircle, ChevronRight, Activity,
  Mail, Search, RefreshCw, Trash2
=======
// import React from 'react';
// import { 
//   Ticket, Users, HeadphonesIcon, AlertTriangle, 
//   CheckCircle, Clock, TrendingUp, XCircle, ChevronRight, Activity
// } from 'lucide-react';
// import { StatCard, RecentTickets } from '../../Components/DashboardWidgets.jsx';
// import { getStats, TICKET_STATUS } from '../../utils/tickets.jsx';
// import { StatusBadge } from '../../Components/TicketBadges.jsx';

// const GOLD = "#C5A059";
// const CHARCOAL = "#3E362E";

// export function DashboardPage({ tickets, onSelectTicket }) {
//   const stats = getStats(tickets);

//   const breakdown = [
//     { label: 'Open Issue Track', value: stats.open, color: 'bg-[#C5A059]', status: TICKET_STATUS.OPEN },
//     { label: 'In Progress Handling', value: stats.inProgress, color: 'bg-[#3E362E]', status: TICKET_STATUS.IN_PROGRESS },
//     { label: 'Escalated Critical', value: stats.escalated, color: 'bg-rose-500', status: TICKET_STATUS.ESCALATED },
//     { label: 'Resolved Operations', value: stats.resolved, color: 'bg-emerald-500', status: TICKET_STATUS.RESOLVED },
//     { label: 'Closed Archive', value: stats.closed, color: 'bg-stone-300', status: TICKET_STATUS.CLOSED },
//   ];

//   return (
//     <div className="p-6 space-y-8 text-stone-800 animate-in fade-in duration-300">
      
//       {/* ── CRITICAL ALERT BANNER ── */}
//       {stats.critical > 0 && (
//         <div className="bg-rose-50/60 border border-rose-200 rounded-2xl px-5 py-4 flex items-start gap-3.5 shadow-xs">
//           <AlertTriangle size={18} className="text-rose-600 shrink-0 mt-0.5" />
//           <div className="text-left">
//             <p className="font-sans text-[11px] font-extrabold uppercase tracking-widest text-rose-800">
//               {stats.critical} Critical Ticket{stats.critical > 1 ? 's' : ''} Require Immediate Attention
//             </p>
//             <p className="font-sans text-sm font-normal leading-relaxed text-rose-600/90 mt-1">Please review details and execute support escalation procedures immediately.</p>
//           </div>
//         </div>
//       )}

//       {/* ── CORE VOLUME SEGMENT METRICS ── */}
//       <div>
//         <div className="mb-4 text-left">
//           <p className="font-sans text-[11px] font-extrabold uppercase tracking-widest text-[#C5A059]">System Volume Analysis</p>
//         </div>
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
//           <StatCardItem label="Total Tickets" value={stats.total} icon={Ticket} bg="bg-stone-50" border="border-stone-200" sub="All time ledger logs" />
//           <StatCardItem label="Customer Issues" value={stats.customerIssues} icon={Users} bg="bg-amber-50/50" border="border-amber-200/50" sub="B2C Client Portal incoming" />
//           <StatCardItem label="Salon Partner Issues" value={stats.salonIssues} icon={HeadphonesIcon} bg="bg-stone-50" border="border-stone-200" sub="B2B Merchant Console incoming" />
//           <StatCardItem label="Critical Pipeline" value={stats.critical} icon={AlertTriangle} bg="bg-rose-50/50" border="border-rose-200/60" sub="Requires manual action" isCritical={stats.critical > 0} />
//         </div>
//       </div>

//       {/* ── STATE DISPATCH COUNTER METRICS ── */}
//       <div>
//         <div className="mb-4 text-left">
//           <p className="font-sans text-[11px] font-extrabold uppercase tracking-widest text-[#C5A059]">Active Queue Pipeline States</p>
//         </div>
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
//           <StatCardItem label="Open Status" value={stats.open} icon={Clock} bg="bg-white" border="border-stone-200" />
//           <StatCardItem label="In Progress" value={stats.inProgress} icon={TrendingUp} bg="bg-white" border="border-stone-200" />
//           <StatCardItem label="Resolved" value={stats.resolved} icon={CheckCircle} bg="bg-white" border="border-stone-200" />
//           <StatCardItem label="Closed Items" value={stats.closed} icon={XCircle} bg="bg-white" border="border-stone-200" />
//         </div>
//       </div>

//       {/* ── VISUAL ANALYTIC DATA BREAKDOWNS ── */}
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-left">
        
//         {/* Progress Timeline Distribution */}
//         <div className="card p-6 bg-white shadow-sm flex flex-col justify-between">
//           <div>
//             <h3 className="font-sans font-black uppercase text-base tracking-tight text-stone-900">Status Breakdown</h3>
//             <p className="font-sans text-sm font-normal leading-relaxed text-stone-600 mt-1">Audit density share split across live nodes</p>
//           </div>
          
//           <div className="space-y-4 my-auto py-2">
//             {breakdown.map(b => (
//               <div key={b.label} className="space-y-1.5">
//                 <div className="flex items-center justify-between">
//                   <span className="font-sans text-xs font-extrabold uppercase tracking-widest text-[#C5A059]">{b.label}</span>
//                   <span className="font-sans font-black text-sm text-stone-900">{b.value}</span>
//                 </div>
//                 <div className="w-full bg-stone-100 rounded-full h-1.5 overflow-hidden">
//                   <div
//                     className={`${b.color} h-full rounded-full transition-all duration-500`}
//                     style={{ width: stats.total > 0 ? `${(b.value / stats.total) * 100}%` : '0%' }}
//                   />
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Donut Style Split Data Ratio */}
//         <div className="card p-6 bg-white shadow-sm flex flex-col justify-between">
//           <div>
//             <h3 className="font-sans font-black uppercase text-base tracking-tight text-stone-900">Issue Type Split</h3>
//             <p className="font-sans text-sm font-normal leading-relaxed text-stone-600 mt-1">Distribution ratio between client segments</p>
//           </div>
          
//           <div className="flex items-center justify-center gap-8 my-auto py-4">
//             <div className="text-center">
//               <div className="w-16 h-16 rounded-full border-4 flex items-center justify-center mx-auto bg-stone-50 font-sans font-black text-stone-900 text-lg shadow-inner" style={{ borderColor: GOLD }}>
//                 {stats.customerIssues}
//               </div>
//               <p className="font-sans text-[11px] font-extrabold uppercase tracking-widest text-[#C5A059] mt-2">Customer</p>
//             </div>
            
//             <div className="text-center">
//               <div className="w-16 h-16 rounded-full border-4 flex items-center justify-center mx-auto bg-stone-50 font-sans font-black text-stone-900 text-lg shadow-inner" style={{ borderColor: CHARCOAL }}>
//                 {stats.salonIssues}
//               </div>
//               <p className="font-sans text-[11px] font-extrabold uppercase tracking-widest text-stone-400 mt-2">Salon Outlet</p>
//             </div>
//           </div>

//           <div className="flex gap-2.5 pt-2 border-t border-stone-50">
//             <div className="flex-1 bg-stone-50/60 border border-stone-200/60 rounded-xl p-3 text-center">
//               <p className="font-sans font-black text-xl" style={{ color: GOLD }}>
//                 {stats.total > 0 ? Math.round((stats.customerIssues / stats.total) * 100) : 0}%
//               </p>
//               <p className="font-sans text-[11px] font-extrabold uppercase tracking-widest text-[#C5A059] mt-0.5">B2C Weight</p>
//             </div>
//             <div className="flex-1 bg-stone-50/60 border border-stone-200/60 rounded-xl p-3 text-center">
//               <p className="font-sans font-black text-xl" style={{ color: CHARCOAL }}>
//                 {stats.total > 0 ? Math.round((stats.salonIssues / stats.total) * 100) : 0}%
//               </p>
//               <p className="font-sans text-[11px] font-extrabold uppercase tracking-widest text-stone-400 mt-0.5">B2B Weight</p>
//             </div>
//           </div>
//         </div>

//         {/* Quick Parameters Checklist Summary */}
//         <div className="card p-6 bg-white shadow-sm flex flex-col justify-between">
//           <div>
//             <h3 className="font-sans font-black uppercase text-base tracking-tight text-stone-900">Quick Summary</h3>
//             <p className="font-sans text-sm font-normal leading-relaxed text-stone-600 mt-1">Core performance index reference parameters</p>
//           </div>
          
//           <ul className="divide-y divide-stone-50 my-auto">
//             <li className="flex items-center justify-between py-2.5">
//               <span className="font-sans text-sm font-normal leading-relaxed text-stone-600">Unassigned Pipeline Pool</span>
//               <span className="font-sans font-black text-xs uppercase tracking-wider text-stone-900 bg-stone-50 px-2 py-0.5 rounded border border-stone-200/60">
//                 {tickets.filter(t => t.assignee === 'Unassigned').length}
//               </span>
//             </li>
//             <li className="flex items-center justify-between py-2.5">
//               <span className="font-sans text-sm font-normal leading-relaxed text-stone-600">Escalated Today</span>
//               <span className="font-sans font-black text-xs uppercase tracking-wider text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-100">{stats.escalated}</span>
//             </li>
//             <li className="flex items-center justify-between py-2.5">
//               <span className="font-sans text-sm font-normal leading-relaxed text-stone-600">Resolution SLA Rate</span>
//               <span className="font-sans font-black text-xs uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
//                 {stats.total > 0 ? Math.round(((stats.resolved + stats.closed) / stats.total) * 100) : 0}%
//               </span>
//             </li>
//             <li className="flex items-center justify-between py-2.5">
//               <span className="font-sans text-sm font-normal leading-relaxed text-stone-600">Active Pipeline Load</span>
//               <span className="font-sans font-black text-xs uppercase tracking-wider text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-100">{stats.open + stats.inProgress}</span>
//             </li>
//           </ul>
//         </div>
//       </div>

//       {/* ── RECENT TICKETS ENTRY LEDGER LIST ── */}
//       <div className="pt-2">
//         <RecentTickets tickets={tickets} onSelect={onSelectTicket} />
//       </div>
//     </div>
//   );
// }

// {/* ── ISOLATED STRUCTURAL METRIC COMPONENT CELL ── */}
// function StatCardItem({ label, value, icon: Icon, bg, border, sub, isCritical = false }) {
//   return (
//     <div className={`card p-5 flex items-center gap-4 shadow-2xs ${bg} ${border}`}>
//       <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${isCritical ? 'bg-rose-100 border border-rose-300 text-rose-600' : 'bg-white border border-stone-200/80 text-stone-500 shadow-3xs'}`}>
//         <Icon size={18} strokeWidth={2.5} className={!isCritical ? 'text-stone-500' : ''} style={{ color: (!isCritical && Icon === Ticket) ? GOLD : '' }} />
//       </div>
//       <div className="flex-1 min-w-0 text-left">
//         <p className="font-sans text-[11px] font-extrabold uppercase tracking-widest text-[#C5A059] mb-0.5">{label}</p>
//         <h3 className={`font-sans font-black text-2xl leading-none tracking-tight ${isCritical ? 'text-rose-700' : 'text-stone-900'}`}>{value}</h3>
//         {sub && <p className="font-sans text-[11px] font-extrabold uppercase tracking-widest text-stone-400 mt-1 truncate">{sub}</p>}
//       </div>
//     </div>
//   );
// }
import React from 'react';
import {
  Ticket, Users, HeadphonesIcon, AlertTriangle,
  CheckCircle, Clock, TrendingUp, XCircle,
>>>>>>> f619ee9 (updated UI of support-escalation-task)
} from 'lucide-react';
import { StatCard, RecentTickets } from '../../Components/DashboardWidgets.jsx';
import { getStats, TICKET_STATUS } from '../../utils/tickets.jsx';

<<<<<<< HEAD
const GOLD = "#C5A059";
const CHARCOAL = "#3E362E";
const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
=======
// ══ COLORS — identical to AdminOnboarding palette ══
const C = {
  bg: "#FAF6F0",
  card: "#FFFFFF",
  ink: "#1C1917",
  muted: "#78716C",
  border: "#E7E5E4",
  gold: "#C5A059",
  goldLight: "#FDF9F3",
  red: "#DC2626",
  redLight: "#FEF2F2",
  green: "#059669",
  greenLight: "#ECFDF5",
  amber: "#D97706",
  amberLight: "#FFFBEB",
  blue: "#2563EB",
  blueLight: "#EFF6FF",
}

// ── Section label — matches AdminOnboarding section headers ──
function SectionLabel({ children }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <p style={{
        fontSize: 10, fontWeight: 700, color: C.gold,
        textTransform: "uppercase", letterSpacing: "0.18em",
      }}>
        {children}
      </p>
    </div>
  )
}

// ── Inline card matching AdminOnboarding SectionCard ──
function SectionCard({ title, subtitle, children }) {
  return (
    <div style={{
      background: C.card, borderRadius: 16,
      border: `1px solid ${C.border}`,
      overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,.04)",
    }}>
      <div style={{
        padding: "14px 20px", borderBottom: `1px solid ${C.border}`,
      }}>
        <span style={{ fontSize: 16, fontWeight: 700, color: C.ink, fontFamily: "Georgia, serif" }}>{title}</span>
        {subtitle && <p style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>{subtitle}</p>}
      </div>
      <div>{children}</div>
    </div>
  )
}
>>>>>>> f619ee9 (updated UI of support-escalation-task)

export function DashboardPage({ tickets, onSelectTicket }) {
  const stats = getStats(tickets);

  const breakdown = [
    { label: 'Open',       value: stats.open,       color: C.gold,   bg: "#FDF9F3" },
    { label: 'In Progress',value: stats.inProgress, color: C.blue,   bg: "#EFF6FF" },
    { label: 'Escalated',  value: stats.escalated,  color: C.red,    bg: "#FEF2F2" },
    { label: 'Resolved',   value: stats.resolved,   color: C.green,  bg: "#ECFDF5" },
    { label: 'Closed',     value: stats.closed,     color: C.muted,  bg: C.bg },
  ];

  return (
    <div style={{ padding: "32px 32px 60px", display: "flex", flexDirection: "column", gap: 32 }}>

      {/* ── CRITICAL ALERT BANNER ── */}
      {stats.critical > 0 && (
        <div style={{
          background: C.redLight, border: `1px solid #FECACA`,
          borderRadius: 16, padding: "14px 18px",
          display: "flex", alignItems: "flex-start", gap: 12,
        }}>
          <AlertTriangle size={18} color={C.red} style={{ flexShrink: 0, marginTop: 2 }} />
          <div>
            <p style={{ fontSize: 11, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.12em", color: "#991B1B" }}>
              {stats.critical} Critical Ticket{stats.critical > 1 ? 's' : ''} Require Immediate Attention
            </p>
            <p style={{ fontSize: 13, color: "#B91C1C", marginTop: 4, lineHeight: 1.5 }}>
              Please review details and execute support escalation procedures immediately.
            </p>
          </div>
        </div>
      )}

      {/* ── SYSTEM VOLUME ANALYSIS ── */}
      <div>
        <SectionLabel>System Volume Analysis</SectionLabel>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14 }}>
          <StatCard label="Total Tickets"        value={stats.total}         icon={Ticket}         color="orange" sub="All time ledger logs" />
          <StatCard label="Customer Issues"      value={stats.customerIssues} icon={Users}          color="amber"  sub="B2C Client Portal incoming" />
          <StatCard label="Salon Partner Issues" value={stats.salonIssues}   icon={HeadphonesIcon} color="blue"   sub="B2B Merchant Console incoming" />
          <StatCard label="Critical Pipeline"    value={stats.critical}      icon={AlertTriangle}  color="red"    sub="Requires manual action" />
        </div>
      </div>

      {/* ── ACTIVE QUEUE PIPELINE STATES ── */}
      <div>
        <SectionLabel>Active Queue Pipeline States</SectionLabel>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14 }}>
          <StatCard label="Open Status"   value={stats.open}       icon={Clock}        color="orange" />
          <StatCard label="In Progress"   value={stats.inProgress} icon={TrendingUp}   color="blue"   />
          <StatCard label="Resolved"      value={stats.resolved}   icon={CheckCircle}  color="green"  />
          <StatCard label="Closed Items"  value={stats.closed}     icon={XCircle}      color="gray"   />
        </div>
      </div>

      {/* ── VISUAL BREAKDOWN ROW ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>

        {/* Status Breakdown */}
        <SectionCard title="Status Breakdown" subtitle="Audit density share split across live nodes">
          <div style={{ padding: "20px 20px", display: "flex", flexDirection: "column", gap: 14 }}>
            {breakdown.map(b => (
              <div key={b.label}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <span style={{ fontSize: 12, fontWeight: 600, color: C.muted }}>{b.label}</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: C.ink }}>{b.value}</span>
                </div>
                <div style={{ height: 6, borderRadius: 99, background: C.bg, overflow: "hidden" }}>
                  <div style={{
                    height: "100%", borderRadius: 99,
                    background: b.color,
                    width: stats.total > 0 ? `${(b.value / stats.total) * 100}%` : "0%",
                    transition: "width 0.5s ease",
                  }} />
                </div>
              </div>
            ))}
          </div>
        </SectionCard>

        {/* Issue Type Split */}
        <SectionCard title="Issue Type Split" subtitle="Distribution ratio between client segments">
          <div style={{ padding: "24px 20px" }}>
            {/* Circles */}
            <div style={{ display: "flex", justifyContent: "center", gap: 40, marginBottom: 24 }}>
              <div style={{ textAlign: "center" }}>
                <div style={{
                  width: 64, height: 64, borderRadius: "50%",
                  border: `4px solid ${C.gold}`, background: C.goldLight,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  margin: "0 auto", fontSize: 20, fontWeight: 700, color: C.ink,
                  fontFamily: "Georgia, serif",
                }}>
                  {stats.customerIssues}
                </div>
                <p style={{ fontSize: 10, fontWeight: 700, color: C.gold, textTransform: "uppercase", letterSpacing: "0.12em", marginTop: 8 }}>Customer</p>
              </div>
              <div style={{ textAlign: "center" }}>
                <div style={{
                  width: 64, height: 64, borderRadius: "50%",
                  border: `4px solid ${C.ink}`, background: C.bg,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  margin: "0 auto", fontSize: 20, fontWeight: 700, color: C.ink,
                  fontFamily: "Georgia, serif",
                }}>
                  {stats.salonIssues}
                </div>
                <p style={{ fontSize: 10, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: "0.12em", marginTop: 8 }}>Salon</p>
              </div>
            </div>

            {/* % bars */}
            <div style={{ display: "flex", gap: 10 }}>
              <div style={{
                flex: 1, background: C.goldLight, border: `1px solid ${C.border}`,
                borderRadius: 10, padding: "10px 12px", textAlign: "center",
              }}>
                <p style={{ fontSize: 18, fontWeight: 700, color: C.gold, fontFamily: "Georgia, serif" }}>
                  {stats.total > 0 ? Math.round((stats.customerIssues / stats.total) * 100) : 0}%
                </p>
                <p style={{ fontSize: 10, fontWeight: 700, color: C.gold, textTransform: "uppercase", letterSpacing: "0.1em", marginTop: 2 }}>B2C Weight</p>
              </div>
              <div style={{
                flex: 1, background: C.bg, border: `1px solid ${C.border}`,
                borderRadius: 10, padding: "10px 12px", textAlign: "center",
              }}>
                <p style={{ fontSize: 18, fontWeight: 700, color: C.ink, fontFamily: "Georgia, serif" }}>
                  {stats.total > 0 ? Math.round((stats.salonIssues / stats.total) * 100) : 0}%
                </p>
                <p style={{ fontSize: 10, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: "0.1em", marginTop: 2 }}>B2B Weight</p>
              </div>
            </div>
          </div>
        </SectionCard>

        {/* Quick Summary */}
        <SectionCard title="Quick Summary" subtitle="Core performance index reference">
          <div>
            {[
              { label: "Unassigned Pipeline",  value: tickets.filter(t => t.assignee === 'Unassigned').length, color: C.muted,  bg: C.bg },
              { label: "Escalated Today",       value: stats.escalated,                                         color: C.red,    bg: C.redLight },
              { label: "Resolution SLA Rate",   value: `${stats.total > 0 ? Math.round(((stats.resolved + stats.closed) / stats.total) * 100) : 0}%`, color: C.green, bg: C.greenLight },
              { label: "Active Pipeline Load",  value: stats.open + stats.inProgress,                           color: C.amber,  bg: C.amberLight },
            ].map((row, i, arr) => (
              <div key={row.label} style={{
                display: "flex", justifyContent: "space-between", alignItems: "center",
                padding: "12px 20px",
                borderBottom: i < arr.length - 1 ? `1px solid ${C.border}` : "none",
              }}>
                <span style={{ fontSize: 13, color: C.muted }}>{row.label}</span>
                <span style={{
                  fontSize: 11, fontWeight: 700, color: row.color,
                  background: row.bg, border: `1px solid ${row.color}20`,
                  borderRadius: 6, padding: "3px 10px",
                  textTransform: "uppercase", letterSpacing: "0.06em",
                }}>
                  {row.value}
                </span>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>

<<<<<<< HEAD
      {/* ── RECENT TICKETS ENTRY LEDGER LIST ── */}
      <div className="pt-2">
        <RecentTickets tickets={tickets} onSelect={onSelectTicket} />
      </div>

      {/* ── NEWSLETTER SUBSCRIBERS LIST ── */}
      <div className="pt-2">
        <NewsletterSubscribersCard />
      </div>
    </div>
  );
}

function NewsletterSubscribersCard() {
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchSubscribers = async () => {
    setLoading(true);
    setError(false);
    try {
      const res = await fetch(`${API}/newsletter/subscribers`);
      const data = await res.json();
      if (res.ok && data.success) {
        setSubscribers(data.subscribers || []);
      } else {
        setError(true);
      }
    } catch (err) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to remove this subscriber?")) return;
    try {
      const res = await fetch(`${API}/newsletter/subscriber/${id}`, {
        method: "DELETE"
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSubscribers(prev => prev.filter(sub => sub._id !== id));
      } else {
        alert(data.message || "Failed to delete subscriber");
      }
    } catch (err) {
      alert("Failed to delete subscriber. Please check your network connection.");
    }
  };

  useEffect(() => {
    fetchSubscribers();
  }, []);

  const filteredSubscribers = subscribers.filter(sub => 
    sub.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-white rounded-2xl border border-[#E8DDD0] shadow-sm overflow-hidden text-left">
      <div className="px-5 py-4 border-b border-[#E8DDD0] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#FAF6F0] border border-[#E8DDD0] flex items-center justify-center text-[#B58B67] shrink-0">
            <Mail size={18} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-[#3D3126]">Newsletter Subscribers</h3>
              <span className="font-mono text-xs text-[#8A7A6A] bg-[#FAF6F0] px-2 py-0.5 rounded border border-[#E8DDD0] font-black">
                {subscribers.length}
              </span>
            </div>
            <p className="text-[10px] font-black uppercase tracking-wider text-stone-400 mt-0.5">
              Emails collected from the home page footer
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <div className="relative flex items-center">
            <Search size={14} className="absolute left-3 text-[#8A7A6A]" />
            <input
              type="text"
              placeholder="Search email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-1.5 text-xs bg-white border border-[#E8DDD0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#B58B67] text-[#3D3126] w-48 font-sans"
            />
          </div>
          <button
            onClick={fetchSubscribers}
            className="p-1.5 rounded-xl border border-[#E8DDD0] hover:bg-[#FAF6F0] text-[#8A7A6A] transition-colors"
            title="Refresh list"
            disabled={loading}
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
          </button>
        </div>
      </div>

      <div className="min-h-[160px] flex flex-col justify-center">
        {loading ? (
          <div className="py-8 text-center text-xs text-[#8A7A6A]">
            <div className="w-6 h-6 border-2 border-[#B58B67] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            Loading subscribers...
          </div>
        ) : error ? (
          <div className="py-10 text-center flex flex-col items-center justify-center">
            <div className="w-10 h-10 rounded-full bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-500 mb-2">
              <AlertTriangle size={18} />
            </div>
            <p className="text-xs font-semibold text-stone-600">Network error. Could not load subscribers.</p>
            <button
              onClick={fetchSubscribers}
              className="text-xs font-bold text-[#B58B67] hover:underline mt-1.5"
            >
              Try again
            </button>
          </div>
        ) : filteredSubscribers.length === 0 ? (
          <div className="py-10 text-center text-[#8A7A6A] text-xs">
            <Mail size={24} className="mx-auto mb-2 opacity-30" />
            {searchQuery ? "No matching subscribers found." : "No subscribers yet."}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#FAF6F0]/60 border-b border-[#E8DDD0] text-[10px] font-black uppercase tracking-wider text-[#8A7A6A]">
                  <th className="px-5 py-3">Email Address</th>
                  <th className="px-5 py-3">Subscribed On</th>
                  <th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0E8DF]">
                {filteredSubscribers.map(sub => (
                  <tr key={sub._id} className="hover:bg-[#FAF6F0]/40 transition-colors">
                    <td className="px-5 py-3.5 font-medium text-[#3D3126] font-mono">{sub.email}</td>
                    <td className="px-5 py-3.5 text-[#8A7A6A] font-sans">
                      {new Date(sub.created_at).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <button
                        onClick={() => handleDelete(sub._id)}
                        className="p-1.5 rounded-lg text-[#8A7A6A] hover:text-rose-500 hover:bg-rose-50 transition-colors"
                        title="Delete subscriber"
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
=======
      {/* ── RECENT TICKETS ── */}
      <RecentTickets tickets={tickets} onSelect={onSelectTicket} />
>>>>>>> f619ee9 (updated UI of support-escalation-task)
    </div>
  )
}
