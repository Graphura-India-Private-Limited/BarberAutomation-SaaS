import React from 'react';
import { TicketFilters } from '../../Components/TicketFilters.jsx';
import { TicketTable } from '../../Components/TicketTable.jsx';
import { TicketDetailModal } from '../../Components/TicketDetailModal.jsx';
import { Inbox, Layers, Filter } from 'lucide-react';

const GOLD = "#C5A059";

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
  
  // Dynamic pipeline filter mapping defensive evaluation
  const displayTickets = typeFilter
    ? filteredTickets.filter(t => t.type === typeFilter)
    : filteredTickets;

  return (
    <div className="p-6 space-y-8 text-stone-800 animate-in fade-in duration-300">
      
      {/* ── CONTEXTUAL SECTION HEADER ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b pb-5 border-stone-200/60 text-left">
        <div>
          <h1 className="text-3xl font-black font-serif text-stone-900 tracking-tight uppercase">
            Support <span style={{ color: GOLD }}>Tickets</span>
          </h1>
          <p className="text-[10px] font-black uppercase tracking-widest text-stone-400 mt-1">
            {typeFilter ? `${typeFilter} Segment Pipeline` : "All Central Escalation Workspace Logs"}
          </p>
        </div>
        
        <div className="flex items-center gap-2 bg-white border border-stone-200 px-3.5 py-2 rounded-xl shadow-2xs">
          <Inbox size={14} style={{ color: GOLD }} />
          <span className="text-[10px] font-black uppercase tracking-wider text-stone-500 font-mono">
            {displayTickets.length} Records Loaded
          </span>
        </div>
      </div>

      {/* ── UTILITY FILTER ENGINE CARD ── */}
      <div className="card bg-white p-2 shadow-xs border border-stone-200/80">
        <TicketFilters
          filterStatus={filterStatus}     setFilterStatus={setFilterStatus}
          filterType={filterType}         setFilterType={setFilterType}
          filterPriority={filterPriority} setFilterPriority={setFilterPriority}
          searchQuery={searchQuery}       setSearchQuery={setSearchQuery}
          total={displayTickets.length}
        />
      </div>

      {/* ── METADATA DATA TABLE CONTAINER ── */}
      <div className="card bg-white overflow-hidden shadow-sm border border-stone-200/80">
        <div className="px-6 py-4 border-b border-stone-100 bg-stone-50/40 flex items-center gap-2 text-left">
          <Layers size={14} style={{ color: GOLD }} />
          <h3 className="text-[10px] font-black uppercase tracking-wider text-stone-400">
            Active Workspace Stream Ledger
          </h3>
        </div>
        
        <div className="divide-y divide-stone-50">
          <TicketTable tickets={displayTickets} onSelect={setSelectedTicket} />
        </div>
      </div>

      {/* ── MODAL SIDE OVERLAY DATA CANVAS ── */}
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