import React from 'react';
import { TicketFilters } from '../../components/admin/TicketFilters.jsx';
import { TicketTable } from '../../components/admin/TicketTable.jsx';
import { TicketDetailModal } from '../../components/admin/TicketDetailModal.jsx';
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
  filterSalon, setFilterSalon,
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

      {/* ── ✅ FIXED: CLEANED HERO TOP BAR (REMOVED INNER DUPED HEADERS) ── */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "flex-end", // Push the status count badge cleanly to the right side
        paddingBottom: 20, borderBottom: `1px solid ${C.border}`,
      }}>
        {/* Records badge */}
        <div style={{
          display: "flex", alignItems: "center", gap: 8,
          background: C.card, border: `1px solid ${C.border}`,
          padding: "8px 16px", borderRadius: 10,
          boxShadow: "0 1px 4px rgba(0,0,0,.04)",
        }}>
  
        </div>
      </div>

      {/* ── FILTERS CARD ── */}
      <div style={{
        background: C.card, borderRadius: 16,
        border: `1px solid ${C.border}`,
        boxShadow: "0 1px 4px rgba(0,0,0,.04)",
        overflow: "visible",
      }}>
        <TicketFilters
          filterStatus={filterStatus}     setFilterStatus={setFilterStatus}
          filterType={filterType}         setFilterType={setFilterType}
          filterPriority={filterPriority} setFilterPriority={setFilterPriority}
          filterSalon={filterSalon}       setFilterSalon={setFilterSalon}
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