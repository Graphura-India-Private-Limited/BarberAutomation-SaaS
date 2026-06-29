import React, { useState, useMemo, useEffect } from "react";
import { 
  Ticket, Users, HeadphonesIcon, AlertTriangle, 
  CheckCircle, Clock, TrendingUp, XCircle, 
  Mail, Search, RefreshCw, BarChart2, Layers, 
  Settings, MessageSquare, Shield, Bell, Globe, Check
} from "lucide-react";
import { TicketFilters } from "../../components/admin/TicketFilters.jsx";
import { TicketTable } from "../../components/admin/TicketTable.jsx";
import { TicketDetailModal } from "../../components/admin/TicketDetailModal.jsx";
import { getStats, TICKET_STATUS, TICKET_PRIORITY, TICKET_TYPE } from "../../utils/tickets.jsx";
import CustomSelect from "../../components/common/CustomSelect";

const GOLD = "#C5A059";
const CHARCOAL = "#3E362E";

export default function OwnerSupportPage({ ticketState }) {
  const [activeTab, setActiveTab] = useState("overview"); // "overview" | "tickets" | "reports" | "settings"
  const [saveToast, setSaveToast] = useState(false);

  const salonId = localStorage.getItem("salonId");
  const salonName = localStorage.getItem("salonName") || "Barber Salon";
  const ownerName = localStorage.getItem("name") || "Owner";

  // Dynamic filter: Map salon-type mock tickets to this salon, and filter for owner-specific tickets
  const ownerTickets = useMemo(() => {
    return ticketState.tickets.map(t => {
      // If it's a salon issue and has no salonId, associate it with this salon for demo
      if (t.type === TICKET_TYPE.SALON && !t.salonId) {
        return {
          ...t,
          salonId: salonId || "demo-salon-id",
          salonName: salonName,
          customer: salonName,
        };
      }
      return t;
    }).filter(t => {
      if (t.salonId && t.salonId === salonId) return true;
      if (t.salonName && t.salonName.toLowerCase() === salonName.toLowerCase()) return true;
      return false;
    });
  }, [ticketState.tickets, salonId, salonName]);

  // Retrieve stats for owner-specific tickets
  const stats = useMemo(() => getStats(ownerTickets), [ownerTickets]);

  // Support Toggles State
  const [notifPrefs, setNotifPrefs] = useState(() => {
    const saved = localStorage.getItem(`owner_notif_${salonId}`);
    return saved ? JSON.parse(saved) : { emailNewTicket: true, emailEscalation: true, dailyDigest: false };
  });

  const [securityPrefs, setSecurityPrefs] = useState(() => {
    const saved2FA = localStorage.getItem(`owner_sec_2fa_${salonId}`) === "true";
    const savedTimeout = localStorage.getItem(`owner_sec_timeout_${salonId}`) !== "false";
    return { twoFactor: saved2FA, sessionTimeout: savedTimeout };
  });

  const toggleNotif = (key) => {
    setNotifPrefs(prev => {
      const next = { ...prev, [key]: !prev[key] };
      localStorage.setItem(`owner_notif_${salonId}`, JSON.stringify(next));
      return next;
    });
  };

  const toggleSecurity = (key) => {
    setSecurityPrefs(prev => {
      const next = { ...prev, [key]: !prev[key] };
      localStorage.setItem(`owner_sec_${key}_${salonId}`, next[key] ? "true" : "false");
      return next;
    });
  };

  const handleSaveSettings = () => {
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 3000);
  };

  // Override note adder to use Owner name
  const handleAddOwnerNote = (ticketId, noteText) => {
    ticketState.addNote(ticketId, noteText, `${ownerName} (Owner)`);
  };

  return (
    <div className="p-6 md:p-10 font-sans text-stone-800 min-h-screen text-left animate-fade-in" style={{ background: "#FAF6F0" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap');
        body, .font-sans { font-family: 'Plus Jakarta Sans', sans-serif !important; }
        .font-serif { font-family: 'Playfair Display', serif !important; }
        
        .card { 
          background: #FFFFFF; 
          border: 1px solid #EADBCE; 
          border-radius: 24px; 
          box-shadow: 0 4px 20px -2px rgba(28, 25, 23, 0.03);
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .card:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 24px -4px rgba(28, 25, 23, 0.06);
          border-color: #C5A059;
        }
        .tab-btn {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          transition: all 0.2s ease;
          border-bottom: 2px solid transparent;
        }
        .tab-btn.active {
          color: #C5A059;
          border-bottom-color: #C5A059;
        }
      `}</style>

      {saveToast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-emerald-600 text-white px-5 py-3.5 rounded-xl shadow-lg font-sans text-xs font-extrabold uppercase tracking-wider">
          <Check size={16} /> Preferences updated successfully
        </div>
      )}

      <div className="max-w-5xl mx-auto">
        {/* Header Block */}
        <header className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5 border-b pb-6 border-stone-200">
          <div>
            <h2 className="font-serif text-3xl sm:text-4xl tracking-normal text-stone-900 flex items-center justify-start gap-2 whitespace-nowrap">
              <span className="font-bold uppercase">Support</span>
              <span className="italic text-[#C5A059] normal-case font-medium">& Escalation</span>
            </h2>
            <p className="text-stone-400 text-[11px] font-mono mt-1">
              {salonName} Support Console · Real-time ticket management and resolution SLA logs
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-wider text-[#A37B58] bg-[#FAF6E9] px-3 py-1.5 rounded-xl border border-[#EADBCE]/50">
              SLA Level Active
            </span>
          </div>
        </header>

        {/* Tab Menu Header */}
        <div className="hidden sm:flex gap-6 border-b border-stone-200 mb-8 overflow-x-auto select-none">
          {[
            { id: "overview", label: "Dashboard" },
            { id: "tickets", label: "All Tickets" },
            { id: "reports", label: "Reports" },
            { id: "settings", label: "Escalation Settings" }
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`tab-btn pb-3 px-1 cursor-pointer outline-none ${activeTab === t.id ? "active text-stone-900" : "text-stone-400 hover:text-stone-700"}`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Mobile Dropdown Menu */}
        <div className="sm:hidden mb-6 text-left">
          <label className="text-[10px] font-bold uppercase tracking-wider text-[#C5A059] block mb-1.5 font-sans">View Section</label>
          <CustomSelect
            value={activeTab}
            onChange={setActiveTab}
            options={[
              { value: "overview", label: "Dashboard" },
              { value: "tickets", label: "All Tickets" },
              { value: "reports", label: "Reports" },
              { value: "settings", label: "Escalation Settings" }
            ]}
          />
        </div>

        {/* Tab Viewports */}
        <main>
          {/* TAB 1: OVERVIEW */}
          {activeTab === "overview" && (
            <div className="space-y-8 animate-in fade-in duration-200">
              {/* Critical Alerts Banner */}
              {stats.critical > 0 && (
                <div className="bg-rose-50 border border-rose-200 rounded-2xl px-5 py-4 flex items-start gap-3.5 text-left">
                  <AlertTriangle size={18} className="text-rose-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-black uppercase tracking-wider text-rose-800">
                      {stats.critical} Critical Priority Support Ticket{stats.critical > 1 ? "s" : ""} Require Action
                    </p>
                    <p className="text-sm font-medium text-rose-600/90 mt-1">
                      Check specific customer/salon details and execute resolution protocols immediately.
                    </p>
                  </div>
                </div>
              )}

              {/* Volume stats */}
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-stone-400 mb-4 text-left">System Volume Analysis</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-left">
                  <StatCardItem label="Total Tickets" value={stats.total} icon={Ticket} bg="bg-white" sub="All time salon issues" />
                  <StatCardItem label="Customer Issues" value={stats.customerIssues} icon={Users} bg="bg-white" sub="Guest & client portal" />
                  <StatCardItem label="Staff Issues" value={stats.salonIssues} icon={HeadphonesIcon} bg="bg-white" sub="Staff & partner tier" />
                  <StatCardItem label="Critical Pipeline" value={stats.critical} icon={AlertTriangle} bg="bg-white" sub="Requires immediate SLA response" isCritical={stats.critical > 0} />
                </div>
              </div>

              {/* Status States */}
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-stone-400 mb-4 text-left">Active Pipeline States</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-left">
                  <StatCardItem label="Open Status" value={stats.open} icon={Clock} bg="bg-white" />
                  <StatCardItem label="In Progress" value={stats.inProgress} icon={TrendingUp} bg="bg-white" />
                  <StatCardItem label="Resolved" value={stats.resolved} icon={CheckCircle} bg="bg-white" />
                  <StatCardItem label="Closed Items" value={stats.closed} icon={XCircle} bg="bg-white" />
                </div>
              </div>

              {/* Status Breakdown and Summary */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                {/* Breakdown List */}
                <div className="card p-6 bg-white flex flex-col justify-between">
                  <div>
                    <h3 className="text-md font-black font-serif text-stone-900 tracking-tight">Status Breakdown</h3>
                    <p className="text-[11px] text-stone-400 font-medium mt-1">Audit density share split across live nodes</p>
                  </div>
                  <div className="space-y-4 my-auto py-4">
                    {[
                      { label: "Open Issue Track", value: stats.open, color: "bg-[#C5A059]" },
                      { label: "In Progress Handling", value: stats.inProgress, color: "bg-[#3E362E]" },
                      { label: "Escalated Critical", value: stats.escalated, color: "bg-rose-500" },
                      { label: "Resolved Operations", value: stats.resolved, color: "bg-emerald-500" },
                      { label: "Closed Archive", value: stats.closed, color: "bg-stone-300" },
                    ].map(b => (
                      <div key={b.label} className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-stone-600 tracking-wide">{b.label}</span>
                          <span className="text-sm font-mono font-black text-stone-900">{b.value}</span>
                        </div>
                        <div className="w-full bg-stone-100 rounded-full h-1.5 overflow-hidden">
                          <div
                            className={`${b.color} h-full rounded-full transition-all duration-500`}
                            style={{ width: stats.total > 0 ? `${(b.value / stats.total) * 100}%` : "0%" }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quick Summary parameters */}
                <div className="card p-6 bg-white flex flex-col justify-between">
                  <div>
                    <h3 className="text-md font-black font-serif text-stone-900 tracking-tight">Performance Ledger</h3>
                    <p className="text-[11px] text-stone-400 font-medium mt-1">Core performance index reference parameters</p>
                  </div>
                  <ul className="divide-y divide-stone-100 my-auto py-2">
                    <li className="flex items-center justify-between py-3 text-xs font-bold">
                      <span className="text-stone-500">Unassigned Pipeline Pool</span>
                      <span className="font-mono text-stone-900 bg-stone-50 px-2 py-0.5 rounded border border-stone-200/60 font-black">
                        {ownerTickets.filter(t => t.assignee === "Unassigned").length}
                      </span>
                    </li>
                    <li className="flex items-center justify-between py-3 text-xs font-bold">
                      <span className="text-stone-500">Escalated Today</span>
                      <span className="font-mono text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-100 font-black">
                        {stats.escalated}
                      </span>
                    </li>
                    <li className="flex items-center justify-between py-3 text-xs font-bold">
                      <span className="text-stone-500">Resolution SLA Rate</span>
                      <span className="font-mono text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100 font-black">
                        {stats.total > 0 ? Math.round(((stats.resolved + stats.closed) / stats.total) * 100) : 0}%
                      </span>
                    </li>
                    <li className="flex items-center justify-between py-3 text-xs font-bold">
                      <span className="text-stone-500">Active Pipeline Load</span>
                      <span className="font-mono text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-100 font-black">
                        {stats.open + stats.inProgress}
                      </span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Recent tickets list */}
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-stone-400 mb-4 text-left">Recent Studio Tickets</p>
                <TicketTable tickets={ownerTickets.slice(0, 5)} onSelect={(t) => ticketState.setSelectedTicket(t)} />
              </div>
            </div>
          )}

          {/* TAB 2: TICKETS TABLE */}
          {activeTab === "tickets" && (
            <div className="space-y-6 animate-in fade-in duration-200 text-left">
              <TicketFilters
                filterStatus={ticketState.filterStatus}
                setFilterStatus={ticketState.setFilterStatus}
                filterType={ticketState.filterType}
                setFilterType={ticketState.setFilterType}
                filterPriority={ticketState.filterPriority}
                setFilterPriority={ticketState.setFilterPriority}
                searchQuery={ticketState.searchQuery}
                setSearchQuery={ticketState.setSearchQuery}
                total={ownerTickets.length}
              />
              <div className="card overflow-hidden">
                <div style={{ padding: "12px 20px", borderBottom: "1px solid #EADBCE", background: "#FAF6F0", display: "flex", alignItems: "center", gap: 8 }}>
                  <Layers size={14} color={GOLD} />
                  <span style={{ fontSize: 10, fontWeight: 700, color: GOLD, textTransform: "uppercase", letterSpacing: "0.18em" }}>
                    Active Workspace Stream Ledger
                  </span>
                </div>
                <TicketTable tickets={ownerTickets} onSelect={(t) => ticketState.setSelectedTicket(t)} />
              </div>
            </div>
          )}

          {/* TAB 3: REPORTS */}
          {activeTab === "reports" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in duration-200 text-left">
              {/* Priority Breakdown */}
              <div className="card p-6 bg-white">
                <div className="flex items-center gap-2 mb-6">
                  <BarChart2 size={18} className="text-[#C5A059]" />
                  <h3 className="font-serif font-bold text-lg text-stone-900">Priority Distribution</h3>
                </div>
                <div className="space-y-5">
                  {Object.values(TICKET_PRIORITY).map(p => {
                    const count = ownerTickets.filter(t => t.priority === p).length;
                    const pct = stats.total > 0 ? (count / stats.total) * 100 : 0;
                    const colors = { Low: "bg-stone-300", Medium: "bg-[#D4B896]", High: "bg-[#C5A059]", Critical: "bg-rose-500" };
                    return (
                      <div key={p}>
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#C5A059]">{p}</span>
                          <span className="text-xs text-stone-500 font-medium">{count} ticket{count !== 1 ? "s" : ""} · {Math.round(pct)}%</span>
                        </div>
                        <div className="w-full bg-stone-100 rounded-full h-2.5 overflow-hidden">
                          <div className={`h-2.5 rounded-full ${colors[p] || "bg-stone-400"}`} style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* SLA details table */}
              <div className="card p-6 bg-white">
                <div className="flex items-center gap-2 mb-6">
                  <CheckCircle size={18} className="text-[#C5A059]" />
                  <h3 className="font-serif font-bold text-lg text-stone-900">Overall Performance Summary</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-stone-100 text-left text-[10px] font-black uppercase tracking-widest text-[#C5A059]">
                        <th className="pb-2">Metric</th>
                        <th className="pb-2 text-right">Value</th>
                        <th className="pb-2 text-right">%</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-50">
                      {[
                        { label: "Total Tickets Raised", value: stats.total, pct: 100 },
                        { label: "Active Open State", value: stats.open, pct: stats.total > 0 ? Math.round((stats.open / stats.total) * 100) : 0 },
                        { label: "Under In-Progress Care", value: stats.inProgress, pct: stats.total > 0 ? Math.round((stats.inProgress / stats.total) * 100) : 0 },
                        { label: "Escalated to Partner", value: stats.escalated, pct: stats.total > 0 ? Math.round((stats.escalated / stats.total) * 100) : 0 },
                        { label: "Successfully Resolved", value: stats.resolved, pct: stats.total > 0 ? Math.round((stats.resolved / stats.total) * 100) : 0 },
                        { label: "Closed Archive Stream", value: stats.closed, pct: stats.total > 0 ? Math.round((stats.closed / stats.total) * 100) : 0 },
                      ].map(row => (
                        <tr key={row.label}>
                          <td className="py-3 text-stone-500 font-medium">{row.label}</td>
                          <td className="py-3 text-right font-mono font-black text-stone-900">{row.value}</td>
                          <td className="py-3 text-right text-stone-400 font-bold">{row.pct}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: SETTINGS */}
          {activeTab === "settings" && (
            <div className="space-y-6 animate-in fade-in duration-200 text-left max-w-3xl mx-auto">
              {/* Notification Prefs */}
              <div className="card p-6 bg-white">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center shrink-0 border border-[#EADBCE]/50">
                    <Bell size={18} className="text-[#C5A059]" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-serif font-bold text-lg text-stone-900 mb-1">Support Notifications</h3>
                    <p className="text-xs text-stone-500 mb-5 leading-relaxed">
                      Configure email and alert preference protocols for support tickets updates filed under your studio outlet signature.
                    </p>
                    <div className="space-y-4">
                      {[
                        { key: "emailNewTicket", label: "Email on new support tickets" },
                        { key: "emailEscalation", label: "Email on critical escalations" },
                        { key: "dailyDigest", label: "Receive daily ticket summaries digest" }
                      ].map(pref => (
                        <label key={pref.key} className="flex items-center justify-between gap-3 cursor-pointer group">
                          <span className="text-sm font-semibold text-stone-600 group-hover:text-stone-900 transition-colors">{pref.label}</span>
                          <button
                            role="switch"
                            aria-checked={notifPrefs[pref.key]}
                            onClick={() => toggleNotif(pref.key)}
                            className={`relative w-11 h-6 shrink-0 rounded-full transition-colors outline-none cursor-pointer ${notifPrefs[pref.key] ? "bg-[#C5A059]" : "bg-stone-200"}`}
                          >
                            <span className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${notifPrefs[pref.key] ? "translate-x-5" : ""}`} />
                          </button>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Security Preferences */}
              <div className="card p-6 bg-white">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center shrink-0 border border-[#EADBCE]/50">
                    <Shield size={18} className="text-[#C5A059]" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-serif font-bold text-lg text-stone-900 mb-1">Escalation Security Controls</h3>
                    <p className="text-xs text-stone-500 mb-5 leading-relaxed">
                      Configure access level security constraints and identity verification locks when managing escalated client issues.
                    </p>
                    <div className="space-y-4">
                      {[
                        { key: "twoFactor", label: "Enforce multi-factor verification on resolutions" },
                        { key: "sessionTimeout", label: "Support terminal session timeout (30 min)" }
                      ].map(pref => (
                        <label key={pref.key} className="flex items-center justify-between gap-3 cursor-pointer group">
                          <span className="text-sm font-semibold text-stone-600 group-hover:text-stone-900 transition-colors">{pref.label}</span>
                          <button
                            role="switch"
                            aria-checked={securityPrefs[pref.key]}
                            onClick={() => toggleSecurity(pref.key)}
                            className={`relative w-11 h-6 shrink-0 rounded-full transition-colors outline-none cursor-pointer ${securityPrefs[pref.key] ? "bg-[#C5A059]" : "bg-stone-200"}`}
                          >
                            <span className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${securityPrefs[pref.key] ? "translate-x-5" : ""}`} />
                          </button>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Save Preferences Button */}
              <div className="flex justify-end pt-2">
                <button
                  onClick={handleSaveSettings}
                  className="bg-[#3E362E] hover:bg-stone-900 text-white font-sans text-xs font-bold uppercase tracking-wider px-6 py-3.5 rounded-xl shadow-md transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Check size={14} /> Update Escalation Rules
                </button>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Ticket Details Modal */}
      <TicketDetailModal
        ticket={ticketState.selectedTicket}
        isOpen={!!ticketState.selectedTicket}
        onClose={() => ticketState.setSelectedTicket(null)}
        onResolve={ticketState.resolveTicket}
        onEscalate={ticketState.escalateTicket}
        onCloseTicket={ticketState.closeTicket}
        onReopen={ticketState.reopenTicket}
        onAssign={ticketState.assignTicket}
        onAddNote={handleAddOwnerNote}
      />
    </div>
  );
}

function StatCardItem({ label, value, icon: Icon, bg = "bg-white", sub, isCritical = false }) {
  return (
    <div className={`card p-5 flex items-center gap-4 ${bg} border border-[#EADBCE] shadow-2xs ${isCritical ? "border-rose-400 bg-rose-50/10" : ""}`}>
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${isCritical ? "bg-rose-50 border border-rose-100 text-rose-600" : "bg-orange-50/50 border border-orange-100 text-[#C5A059]"}`}>
        <Icon size={18} />
      </div>
      <div>
        <p className="text-[11px] font-extrabold uppercase tracking-widest text-[#C5A059] mb-0.5">{label}</p>
        <h3 className={`text-xl font-black font-serif ${isCritical ? "text-rose-600" : "text-stone-900"}`}>{value}</h3>
        {sub && <p className="text-[10px] text-stone-400 font-medium mt-0.5 leading-none">{sub}</p>}
      </div>
    </div>
  );
}
