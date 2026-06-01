
import React from 'react';
import { TicketFilters } from '../../Components/TicketFilters.jsx';
import { TicketTable } from '../../Components/TicketTable.jsx';
import { TicketDetailModal } from '../../Components/TicketDetailModal.jsx';
import { Inbox, Layers } from 'lucide-react';

// ══ COLORS — identical to AdminOnboarding palette ══
const C = {
  bg: "#FAF6F0",
  card: "#FFFFFF",
  ink: "#1C1917",
  muted: "#78716C",
  border: "#E7E5E4",
  gold: "#C5A059",
  goldLight: "#FDF9F3",
}

export function TicketsPage({
  filteredTickets,
  filterStatus, setFilterStatus,
  filterType, setFilterType,
  filterPriority, setFilterPriority,
  searchQuery, setSearchQuery,
  selectedTicket, setSelectedTicket,
  resolveTicket, escalateTicket, closeTicket, reopenTicket,
  assignTicket, addNote,
  typeFilter,
}) {
  const displayTickets = typeFilter
    ? filteredTickets.filter(t => t.type === typeFilter)
    : filteredTickets;

  return (
    <div style={{ padding: "32px 32px 60px", display: "flex", flexDirection: "column", gap: 24 }}>

      {/* ── PAGE HERO — matches AdminOnboarding header style ── */}
      <div style={{
        display: "flex", alignItems: "flex-end", justifyContent: "space-between",
        paddingBottom: 20, borderBottom: `1px solid ${C.border}`,
      }}>
        <div>
          <h1 style={{
            fontSize: 42, fontWeight: 700, color: C.ink,
            fontFamily: "Georgia, serif", lineHeight: 1, marginBottom: 6,
          }}>
            Support Tickets
          </h1>
          <p style={{
            fontSize: 28, fontStyle: "italic", color: C.gold,
            fontFamily: "Georgia, serif", lineHeight: 1, marginBottom: 8,
          }}>
            {typeFilter ? `${typeFilter} Segment Pipeline` : "Escalation Workspace"}
          </p>
          <p style={{
            fontSize: 10, fontWeight: 700, color: C.gold,
            textTransform: "uppercase", letterSpacing: "0.18em",
          }}>
            {typeFilter ? `${typeFilter} segment pipeline` : "All Central Escalation Workspace Logs"}
          </p>
        </div>

        {/* Records badge */}
        <div style={{
          display: "flex", alignItems: "center", gap: 8,
          background: C.card, border: `1px solid ${C.border}`,
          padding: "8px 16px", borderRadius: 10,
          boxShadow: "0 1px 4px rgba(0,0,0,.04)",
        }}>
          <Inbox size={14} color={C.gold} />
          <span style={{ fontSize: 12, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: "0.08em" }}>
            {displayTickets.length} Records Loaded
          </span>
        </div>
      </div>

      {/* ── FILTERS CARD ── */}
      <div style={{
        background: C.card, borderRadius: 16,
        border: `1px solid ${C.border}`,
        boxShadow: "0 1px 4px rgba(0,0,0,.04)",
        overflow: "hidden",
      }}>
        <TicketFilters
          filterStatus={filterStatus}     setFilterStatus={setFilterStatus}
          filterType={filterType}         setFilterType={setFilterType}
          filterPriority={filterPriority} setFilterPriority={setFilterPriority}
          searchQuery={searchQuery}       setSearchQuery={setSearchQuery}
          total={displayTickets.length}
        />
      </div>

      {/* ── TICKET TABLE CARD ── */}
      <div style={{
        background: C.card, borderRadius: 16,
        border: `1px solid ${C.border}`,
        overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,.04)",
      }}>
        {/* Table header label */}
        <div style={{
          padding: "12px 20px", borderBottom: `1px solid ${C.border}`,
          background: "#FAFAF8",
          display: "flex", alignItems: "center", gap: 8,
        }}>
          <Layers size={14} color={C.gold} />
          <span style={{
            fontSize: 10, fontWeight: 700, color: C.gold,
            textTransform: "uppercase", letterSpacing: "0.18em",
          }}>
            Active Workspace Stream Ledger
          </span>
        </div>

        <TicketTable tickets={displayTickets} onSelect={setSelectedTicket} />
      </div>

      {/* ── DETAIL MODAL ── */}
      <TicketDetailModal
        ticket={selectedTicket}
        isOpen={!!selectedTicket}
        onClose={() => setSelectedTicket(null)}
        onResolve={resolveTicket}
        onEscalate={escalateTicket}
        onCloseTicket={closeTicket}
        onReopen={reopenTicket}
        onAssign={assignTicket}
        onAddNote={addNote}
      />
    </div>
  );
}
