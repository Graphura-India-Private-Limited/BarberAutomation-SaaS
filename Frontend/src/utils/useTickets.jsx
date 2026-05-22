import { useState, useMemo } from 'react'
import { mockTickets, TICKET_STATUS, TICKET_TYPE } from './tickets.jsx'

export function useTickets() {
  const [tickets, setTickets] = useState(mockTickets)
  const [filterStatus, setFilterStatus] = useState('All')
  const [filterType, setFilterType] = useState('All')
  const [filterPriority, setFilterPriority] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTicket, setSelectedTicket] = useState(null)

  const filteredTickets = useMemo(() => {
    return tickets.filter(ticket => {
      const matchesStatus = filterStatus === 'All' || ticket.status === filterStatus
      const matchesType = filterType === 'All' || ticket.type === filterType
      const matchesPriority = filterPriority === 'All' || ticket.priority === filterPriority
      const matchesSearch =
        searchQuery === '' ||
        ticket.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ticket.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ticket.customer.toLowerCase().includes(searchQuery.toLowerCase())
      return matchesStatus && matchesType && matchesPriority && matchesSearch
    })
  }, [tickets, filterStatus, filterType, filterPriority, searchQuery])

  const updateTicketStatus = (ticketId, newStatus) => {
    setTickets(prev =>
      prev.map(t =>
        t.id === ticketId
          ? { ...t, status: newStatus, updatedAt: new Date().toISOString() }
          : t
      )
    )
    if (selectedTicket?.id === ticketId) {
      setSelectedTicket(prev => ({ ...prev, status: newStatus, updatedAt: new Date().toISOString() }))
    }
  }

  const resolveTicket = (ticketId) => updateTicketStatus(ticketId, TICKET_STATUS.RESOLVED)
  const escalateTicket = (ticketId) => updateTicketStatus(ticketId, TICKET_STATUS.ESCALATED)
  const closeTicket = (ticketId) => updateTicketStatus(ticketId, TICKET_STATUS.CLOSED)
  const reopenTicket = (ticketId) => updateTicketStatus(ticketId, TICKET_STATUS.OPEN)

  const assignTicket = (ticketId, agent) => {
    setTickets(prev =>
      prev.map(t => t.id === ticketId ? { ...t, assignee: agent, updatedAt: new Date().toISOString() } : t)
    )
    if (selectedTicket?.id === ticketId) {
      setSelectedTicket(prev => ({ ...prev, assignee: agent }))
    }
  }

  const addNote = (ticketId, noteText, author = 'Admin') => {
    const note = { author, text: noteText, timestamp: new Date().toISOString() }
    setTickets(prev =>
      prev.map(t =>
        t.id === ticketId
          ? { ...t, notes: [...t.notes, note], updatedAt: new Date().toISOString() }
          : t
      )
    )
    if (selectedTicket?.id === ticketId) {
      setSelectedTicket(prev => ({ ...prev, notes: [...prev.notes, note] }))
    }
  }

  return {
    tickets,
    filteredTickets,
    filterStatus, setFilterStatus,
    filterType, setFilterType,
    filterPriority, setFilterPriority,
    searchQuery, setSearchQuery,
    selectedTicket, setSelectedTicket,
    resolveTicket,
    escalateTicket,
    closeTicket,
    reopenTicket,
    assignTicket,
    addNote,
    updateTicketStatus,
  }
}
