import { TicketFilters } from '../../Components/TicketFilters.jsx'
import { TicketTable } from '../../Components/TicketTable.jsx'
import { TicketDetailModal } from '../../Components/TicketDetailModal.jsx'

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
    : filteredTickets

  return (
    <div className="p-6 space-y-4">
      <TicketFilters
        filterStatus={filterStatus}   setFilterStatus={setFilterStatus}
        filterType={filterType}       setFilterType={setFilterType}
        filterPriority={filterPriority} setFilterPriority={setFilterPriority}
        searchQuery={searchQuery}     setSearchQuery={setSearchQuery}
        total={displayTickets.length}
      />
      <TicketTable tickets={displayTickets} onSelect={setSelectedTicket} />
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
  )
}
