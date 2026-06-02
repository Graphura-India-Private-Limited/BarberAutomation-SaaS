import { useState } from 'react'
import { Modal, Button, Select } from './UIComponents.jsx'
import { StatusBadge, PriorityBadge, TypeBadge } from './TicketBadges.jsx'
import { formatDateTime } from '../../utils/date.jsx'
import { TICKET_STATUS, mockAgents } from '../../utils/tickets.jsx'
import { User, Mail, Phone, Tag, Clock, MessageSquare, CheckCircle, AlertTriangle, XCircle, RefreshCw } from 'lucide-react'

export function TicketDetailModal({ ticket, isOpen, onClose, onResolve, onEscalate, onCloseTicket, onReopen, onAssign, onAddNote }) {
  const [noteText, setNoteText] = useState('')

  if (!ticket) return null

  const handleAddNote = () => {
    if (!noteText.trim()) return
    onAddNote(ticket.id, noteText.trim())
    setNoteText('')
  }

  const canResolve  = [TICKET_STATUS.OPEN, TICKET_STATUS.IN_PROGRESS, TICKET_STATUS.ESCALATED].includes(ticket.status)
  const canEscalate = [TICKET_STATUS.OPEN, TICKET_STATUS.IN_PROGRESS].includes(ticket.status)
  const canClose    = ticket.status === TICKET_STATUS.RESOLVED
  const canReopen   = [TICKET_STATUS.RESOLVED, TICKET_STATUS.CLOSED].includes(ticket.status)

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Ticket ${ticket.id}`} size="lg">
      <div className="space-y-6">
        {/* Header Info */}
        <div>
          <h3 className="text-xl font-semibold text-stone-800 mb-3">{ticket.title}</h3>
          <div className="flex flex-wrap gap-2">
            <StatusBadge status={ticket.status} />
            <PriorityBadge priority={ticket.priority} />
            <TypeBadge type={ticket.type} />
          </div>
        </div>

        {/* Description */}
        <div className="bg-orange-50 rounded-xl p-4 border border-orange-100">
          <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-2">Description</p>
          <p className="text-sm text-stone-700 leading-relaxed">{ticket.description}</p>
        </div>

        {/* Two Column Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-3">
            <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider">Contact Details</p>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-stone-600">
                <User size={14} className="text-stone-400 shrink-0" /><span>{ticket.customer}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-stone-600">
                <Mail size={14} className="text-stone-400 shrink-0" /><span className="truncate">{ticket.email}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-stone-600">
                <Phone size={14} className="text-stone-400 shrink-0" /><span>{ticket.phone}</span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider">Ticket Details</p>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-stone-600">
                <Clock size={14} className="text-stone-400 shrink-0" /><span>Created: {formatDateTime(ticket.createdAt)}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-stone-600">
                <Clock size={14} className="text-stone-400 shrink-0" /><span>Updated: {formatDateTime(ticket.updatedAt)}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-stone-600">
                <Tag size={14} className="text-stone-400 shrink-0" />
                <div className="flex flex-wrap gap-1">
                  {ticket.tags.map(tag => (
                    <span key={tag} className="px-1.5 py-0.5 bg-orange-100 text-orange-700 rounded text-xs">{tag}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Assign Agent */}
        <div className="border-t border-orange-100 pt-4">
          <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-3">Assignment</p>
          <Select
            label="Assign to Agent"
            value={ticket.assignee}
            onChange={(val) => onAssign(ticket.id, val)}
            options={mockAgents}
          />
        </div>

        {/* Action Buttons */}
        <div className="border-t border-orange-100 pt-4">
          <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-3">Actions</p>
          <div className="flex flex-wrap gap-2">
            {canResolve && (
              <Button variant="success" size="sm" onClick={() => onResolve(ticket.id)}>
                <CheckCircle size={14} /> Resolve
              </Button>
            )}
            {canEscalate && (
              <Button variant="escalate" size="sm" onClick={() => onEscalate(ticket.id)}>
                <AlertTriangle size={14} /> Escalate
              </Button>
            )}
            {canClose && (
              <Button variant="secondary" size="sm" onClick={() => onCloseTicket(ticket.id)}>
                <XCircle size={14} /> Close Ticket
              </Button>
            )}
            {canReopen && (
              <Button variant="outline" size="sm" onClick={() => onReopen(ticket.id)}>
                <RefreshCw size={14} /> Reopen
              </Button>
            )}
          </div>
        </div>

        {/* Notes / Activity */}
        <div className="border-t border-orange-100 pt-4">
          <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-3">
            Activity & Notes <span className="text-orange-500">({ticket.notes.length})</span>
          </p>

          {ticket.notes.length === 0 ? (
            <p className="text-sm text-stone-400 italic mb-4">No notes yet. Add the first one below.</p>
          ) : (
            <div className="space-y-3 mb-4">
              {ticket.notes.map((note, idx) => (
                <div key={idx} className="bg-white border border-orange-100 rounded-xl p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-6 h-6 rounded-full bg-orange-200 flex items-center justify-center text-xs font-bold text-orange-700">
                      {note.author[0]}
                    </div>
                    <span className="text-xs font-semibold text-stone-700">{note.author}</span>
                    <span className="text-xs text-stone-400 ml-auto">{formatDateTime(note.timestamp)}</span>
                  </div>
                  <p className="text-sm text-stone-600 pl-8">{note.text}</p>
                </div>
              ))}
            </div>
          )}

          <div className="flex gap-2">
            <textarea
              value={noteText}
              onChange={e => setNoteText(e.target.value)}
              placeholder="Add a note or internal comment..."
              rows={2}
              className="flex-1 border border-orange-200 rounded-xl px-3 py-2 text-sm text-stone-700 focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white resize-none placeholder:text-stone-400"
            />
            <Button variant="primary" size="sm" onClick={handleAddNote} disabled={!noteText.trim()}>
              <MessageSquare size={14} /> Add
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  )
}
