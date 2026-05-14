// CalendarSidebar.jsx
import { useState } from 'react'
import { FaTimes, FaGripVertical } from 'react-icons/fa'

import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from '@dnd-kit/core'
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

// ── Color config ──────────────────────────────────────────────────────────────
const COLOR_OPTIONS = [
  { label: 'Danger',  value: 'danger'  },
  { label: 'Warning', value: 'warning' },
  { label: 'Success', value: 'success' },
  { label: 'Primary', value: 'primary' },
  { label: 'Gray',    value: 'gray'    },
]

const COLOR_MAP = {
  danger:  { bg: 'bg-red-500/20',    activeBg: 'bg-red-500',    dot: 'bg-red-500'    },
  warning: { bg: 'bg-yellow-400/20', activeBg: 'bg-yellow-500', dot: 'bg-yellow-400' },
  success: { bg: 'bg-teal-500/20',   activeBg: 'bg-teal-500',   dot: 'bg-teal-500'   },
  primary: { bg: 'bg-primary/20',    activeBg: 'bg-primary',    dot: 'bg-primary'    },
  gray:    { bg: 'bg-gray-400/20',   activeBg: 'bg-gray-500',   dot: 'bg-gray-400'   },
}

const INIT_EVENTS = [
  { id: '1', label: 'New Theme Release', color: 'danger'  },
  { id: '2', label: 'My Event',          color: 'warning' },
  { id: '3', label: 'Meet manager',      color: 'danger'  },
  { id: '4', label: 'Create New theme',  color: 'success' },
  { id: '5', label: 'Project Launch',    color: 'gray'    },
  { id: '6', label: 'Meeting',           color: 'success' },
]

// ── Add Category Modal ────────────────────────────────────────────────────────
function AddCategoryModal({ onClose, onSave }) {
  const [name,  setName]  = useState('')
  const [color, setColor] = useState('success')

  const handleSave = () => {
    if (!name.trim()) return
    onSave({ name: name.trim(), color })
    setName('')
    setColor('success')
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-[#ffffff] dark:bg-[#292D4A] rounded-md w-full max-w-lg mx-4 shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-white/10">
          <span className="text-base font-bold text-header-text">Add a category</span>
          <button onClick={onClose} className="text-content-text hover:text-header-text transition-colors duration-200">
            <FaTimes className="w-4 h-4" />
          </button>
        </div>

        <div className="flex gap-5 px-6 py-6">
          <div className="flex flex-col gap-2 flex-1">
            <label className="text-sm font-semibold text-header-text">Category Name</label>
            <input
              type="text"
              placeholder="Enter name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSave()}
              className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-md px-4 py-3 text-sm text-header-text placeholder:text-content-text outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all duration-200"
            />
          </div>
          <div className="flex flex-col gap-2 flex-1">
            <label className="text-sm font-semibold text-header-text">Choose Category Color</label>
            <select
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="w-full bg-gray-50 dark:bg-[#292D4A]  border border-gray-200 dark:border-white/10 rounded-md px-4 py-3 text-sm text-header-text outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all duration-200 cursor-pointer"
            >
              {COLOR_OPTIONS.map((c) => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 dark:border-white/10">
          <button onClick={onClose} className="text-sm font-semibold text-content-text hover:text-header-text transition-colors duration-200 px-4 py-2">
            Close
          </button>
          <button onClick={handleSave} className="bg-primary text-white text-sm font-semibold px-6 py-2.5 rounded-md hover:bg-primary/90 transition-colors duration-200">
            Save
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Sortable Event Row ────────────────────────────────────────────────────────
function SortableEventRow({ event, isActive, isDragging }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSelfDragging,
  } = useSortable({ id: event.id })

  const c = COLOR_MAP[event.color] || COLOR_MAP.primary

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isSelfDragging ? 0.35 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`
        flex items-center gap-3 px-3 py-3 rounded-md
        transition-colors duration-200 select-none
        ${isActive ? c.activeBg : c.bg}
      `}
    >
      {/* Drag handle */}
      <button
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing text-white/40 hover:text-white/80 transition-colors duration-150 shrink-0 touch-none"
        tabIndex={-1}
      >
        <FaGripVertical className="w-3.5 h-3.5" />
      </button>

      <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${c.dot}`} />
      <span className={`text-sm font-medium flex-1 ${isActive ? 'text-white' : 'text-header-text'}`}>
        {event.label}
      </span>
    </div>
  )
}

// ── Drag Overlay Row (ghost while dragging) ───────────────────────────────────
function OverlayRow({ event }) {
  const c = COLOR_MAP[event.color] || COLOR_MAP.primary
  return (
    <div className={`flex items-center gap-3 px-3 py-3 rounded-md ${c.activeBg} shadow-2xl opacity-95 w-56`}>
      <FaGripVertical className="w-3.5 h-3.5 text-white/60 shrink-0" />
      <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${c.dot}`} />
      <span className="text-sm font-medium text-white flex-1">{event.label}</span>
    </div>
  )
}

// ── Main CalendarSidebar ──────────────────────────────────────────────────────
export default function CalendarSidebar({ onEventDragStart }) {
  const [events, setEvents]           = useState(INIT_EVENTS)
  const [activeId, setActiveId]       = useState('6')
  const [draggingId, setDraggingId]   = useState(null)
  const [removeAfter, setRemoveAfter] = useState(false)
  const [modalOpen, setModalOpen]     = useState(false)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  )

  const draggingEvent = events.find((e) => e.id === draggingId)

  const handleDragStart = ({ active }) => {
    setDraggingId(active.id)
    const ev = events.find((e) => e.id === active.id)
    if (ev) onEventDragStart?.(ev)
  }

  const handleDragEnd = ({ active, over }) => {
    setDraggingId(null)
    if (!over || active.id === over.id) return

    setEvents((prev) => {
      const oldIndex = prev.findIndex((e) => e.id === active.id)
      const newIndex = prev.findIndex((e) => e.id === over.id)
      const reordered = arrayMove(prev, oldIndex, newIndex)

      if (removeAfter) {
        return reordered.filter((e) => e.id !== active.id)
      }
      return reordered
    })
  }

  const handleSave = ({ name, color }) => {
    setEvents((prev) => [
      ...prev,
      { id: String(Date.now()), label: name, color },
    ])
    setModalOpen(false)
  }

  return (
    <>
      <div className="bg-[#ffffff] dark:bg-[#292D4A] rounded-md p-5 flex flex-col gap-4 w-64 shrink-0">

        <div className="flex flex-col gap-1">
          <span className="text-base font-bold text-header-text">Calendar</span>
          <span className="text-xs text-content-text leading-relaxed">
            Drag and drop your event or click in the calendar
          </span>
        </div>

        {/* Sortable list */}
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={events.map((e) => e.id)} strategy={verticalListSortingStrategy}>
            <div className="flex flex-col gap-2">
              {events.map((ev) => (
                <SortableEventRow
                  key={ev.id}
                  event={ev}
                  isActive={activeId === ev.id}
                  isDragging={draggingId === ev.id}
                />
              ))}
            </div>
          </SortableContext>

          {/* Ghost overlay while dragging */}
          <DragOverlay>
            {draggingEvent ? <OverlayRow event={draggingEvent} /> : null}
          </DragOverlay>
        </DndContext>

        {/* Remove after drop */}
        <div className="flex items-center gap-2.5">
          <input
            type="checkbox"
            id="removeAfter"
            checked={removeAfter}
            onChange={(e) => setRemoveAfter(e.target.checked)}
            className="w-4 h-4 accent-primary rounded cursor-pointer"
          />
          <label htmlFor="removeAfter" className="text-xs text-content-text cursor-pointer select-none">
            Remove After Drop
          </label>
        </div>

        {/* Create New */}
        <button
          onClick={() => setModalOpen(true)}
          className="w-full py-3 rounded-md bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-colors duration-200 flex items-center justify-center gap-2"
        >
          <span className="text-lg leading-none">+</span>
          Create New
        </button>
      </div>

      {modalOpen && (
        <AddCategoryModal
          onClose={() => setModalOpen(false)}
          onSave={handleSave}
        />
      )}
    </>
  )
}