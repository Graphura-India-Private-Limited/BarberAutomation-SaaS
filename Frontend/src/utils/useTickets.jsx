import { useState, useMemo, useEffect } from 'react'
import { mockTickets, TICKET_STATUS, TICKET_TYPE, TICKET_PRIORITY } from './tickets.jsx'

export function useTickets() {
  const [tickets, setTickets] = useState(() => {
    const saved = localStorage.getItem('app_tickets');
    return saved ? JSON.parse(saved) : mockTickets;
  });

  useEffect(() => {
    localStorage.setItem('app_tickets', JSON.stringify(tickets));
  }, [tickets]);

  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'app_tickets' && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          setTickets(parsed);
        } catch (err) {
          console.error("Error synchronizing tickets across tabs:", err);
        }
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);
  const [filterStatus, setFilterStatus] = useState('All')
  const [filterType, setFilterType] = useState('All')
  const [filterPriority, setFilterPriority] = useState('All')
  const [filterSalon, setFilterSalon] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTicket, setSelectedTicket] = useState(null)

  const filteredTickets = useMemo(() => {
    return tickets.filter(ticket => {
      const matchesStatus = filterStatus === 'All' || ticket.status === filterStatus
      const matchesType = filterType === 'All' || ticket.type === filterType
      const matchesPriority = filterPriority === 'All' || ticket.priority === filterPriority
      const matchesSalon = filterSalon === 'All' || 
        (ticket.salonId && ticket.salonId === filterSalon) || 
        (ticket.salonName && ticket.salonName === filterSalon) ||
        (ticket.customer && ticket.customer === filterSalon);
      const matchesSearch =
        searchQuery === '' ||
        ticket.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ticket.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ticket.customer.toLowerCase().includes(searchQuery.toLowerCase())
      return matchesStatus && matchesType && matchesPriority && matchesSalon && matchesSearch
    })
  }, [tickets, filterStatus, filterType, filterPriority, filterSalon, searchQuery])

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

  const addTicket = (ticketData) => {
    const role = localStorage.getItem("role") || "customer";
    const loggedInName = localStorage.getItem("name") || localStorage.getItem("userName") || localStorage.getItem("barberName") || localStorage.getItem("salonName") || "";
    
    const determinedType = (role === "owner" || role === "barber") 
      ? TICKET_TYPE.SALON 
      : TICKET_TYPE.CUSTOMER;
      
    let determinedPriority = TICKET_PRIORITY.MEDIUM;
    if (ticketData.category === "payment") {
      determinedPriority = TICKET_PRIORITY.HIGH;
    } else if (ticketData.category === "other") {
      determinedPriority = TICKET_PRIORITY.LOW;
    }
    
    const tags = [ticketData.category || "general"];

    const newTicket = {
      id: `TKT-${1000 + tickets.length + 1}`,
      title: ticketData.title || "Inquiry Ticket",
      description: ticketData.description || "",
      type: determinedType,
      status: TICKET_STATUS.OPEN,
      priority: determinedPriority,
      customer: loggedInName || (ticketData.email ? ticketData.email.split("@")[0] : "Guest User"),
      email: ticketData.email || "",
      phone: "-",
      assignee: "Unassigned",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      tags: tags,
      notes: [],
      salonId: ticketData.salonId || "",
      salonName: ticketData.salonName || "",
    };
    
    setTickets(prev => [newTicket, ...prev]);
    return newTicket;
  };

  return {
    tickets,
    filteredTickets,
    filterStatus, setFilterStatus,
    filterType, setFilterType,
    filterPriority, setFilterPriority,
    filterSalon, setFilterSalon,
    searchQuery, setSearchQuery,
    selectedTicket, setSelectedTicket,
    resolveTicket,
    escalateTicket,
    closeTicket,
    reopenTicket,
    assignTicket,
    addNote,
    updateTicketStatus,
    addTicket,
  }
}
