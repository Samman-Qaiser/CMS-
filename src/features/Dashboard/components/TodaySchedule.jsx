import React, { useState, useCallback } from "react";
import { Calendar, dateFnsLocalizer, Views } from "react-big-calendar";
import { format, parse, startOfWeek, getDay, addHours, startOfHour } from "date-fns";
import { Plus, X, Clock, Trash2, AlignLeft, ChevronLeft, ChevronRight } from "lucide-react";
import "react-big-calendar/lib/css/react-big-calendar.css";


// ─── Localizer ───────────────────────────────────────────────────
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 0 }),
  getDay,
  locales: {},
});

// ─── Constants ───────────────────────────────────────────────────
const EVENT_COLORS = [
  { label: "Rose",    bg: "bg-rose-500",    hex: "#f43f5e" },
  { label: "Indigo",  bg: "bg-indigo-500",  hex: "#6366f1" },
  { label: "Amber",   bg: "bg-amber-400",   hex: "#fbbf24" },
  { label: "Emerald", bg: "bg-emerald-500", hex: "#10b981" },
  { label: "Sky",     bg: "bg-sky-500",     hex: "#0ea5e9" },
  { label: "Violet",  bg: "bg-violet-500",  hex: "#8b5cf6" },
];

const SAMPLE_EVENTS = [
  {
    id: 1, title: "All Day Event",
    start: (() => { const d = new Date(); d.setHours(0,0,0,0); return d; })(),
    end:   (() => { const d = new Date(); d.setHours(23,59,0,0); return d; })(),
    allDay: true, color: EVENT_COLORS[0], desc: "",
  },
  {
    id: 2, title: "Team Standup",
    start: addHours(startOfHour(new Date()), -3),
    end:   addHours(startOfHour(new Date()), -2),
    allDay: false, color: EVENT_COLORS[1], desc: "Daily sync",
  },
  {
    id: 3, title: "Design Review",
    start: addHours(startOfHour(new Date()), 1),
    end:   addHours(startOfHour(new Date()), 2),
    allDay: false, color: EVENT_COLORS[2], desc: "Review UI",
  },
  {
    id: 4, title: "Client Call",
    start: addHours(startOfHour(new Date()), 3),
    end:   addHours(startOfHour(new Date()), 4),
    allDay: false, color: EVENT_COLORS[5], desc: "",
  },
];

// ─── Event Modal ─────────────────────────────────────────────────
function EventModal({ slot, event, onSave, onDelete, onClose }) {
  const isEdit = !!event;
  const [title,  setTitle]  = useState(event?.title  ?? "");
  const [desc,   setDesc]   = useState(event?.desc   ?? "");
  const [color,  setColor]  = useState(event?.color  ?? EVENT_COLORS[0]);
  const [allDay, setAllDay] = useState(event?.allDay ?? false);
  const [start,  setStart]  = useState(event?.start  ?? slot?.start ?? new Date());
  const [end,    setEnd]    = useState(event?.end    ?? slot?.end   ?? addHours(new Date(), 1));

  const fmt = (d) => format(new Date(d), "yyyy-MM-dd'T'HH:mm");

  const handleSave = () => {
    if (!title.trim()) return;
    onSave({ id: event?.id ?? Date.now(), title: title.trim(), desc, color, allDay, start: new Date(start), end: new Date(end) });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-md bg-white dark:bg-[#292D4A] 
      rounded-[2rem] shadow-2xl flex flex-col  gap-4 p-6 border border-black/8 dark:border-white/8">

        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-header-text tracking-wide">
            {isEdit ? "Edit Event" : "New Event"}
          </h2>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-lg text-content cursor-pointer bg-transparent border-0 hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
          >
            <X size={14} />
          </button>
        </div>

        {/* Title */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-semibold uppercase tracking-widest text-content opacity-60">
            Title
          </label>
          <input
            autoFocus
            value={title}
            onChange={e => setTitle(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleSave()}
            placeholder="Event title..."
            className="w-full rounded-lg px-3 py-2 text-sm text-header-text bg-black/5 dark:bg-white/5 border border-black/8 dark:border-white/8 outline-none placeholder:text-content placeholder:opacity-30"
          />
        </div>

        {/* Description */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-semibold uppercase tracking-widest text-content opacity-60 flex items-center gap-1">
            <AlignLeft size={10} /> Note
          </label>
          <textarea
            value={desc}
            onChange={e => setDesc(e.target.value)}
            placeholder="Add a note..."
            rows={2}
            className="w-full rounded-lg px-3 py-2 text-sm text-header-text bg-black/5 dark:bg-white/5 border border-black/8 dark:border-white/8 outline-none resize-none placeholder:text-content placeholder:opacity-30"
          />
        </div>

        {/* All Day */}
        <label className="flex items-center gap-3 cursor-pointer select-none">
          <div
            onClick={() => setAllDay(v => !v)}
            className={`w-9 h-5 rounded-full relative cursor-pointer transition-colors border border-black/8 dark:border-white/8 ${allDay ? "bg-primary" : "bg-black/5 dark:bg-white/5"}`}
          >
            <div className={`absolute top-0.5 w-4 h-4 rounded-full transition-all bg-white ${allDay ? "left-[18px]" : "left-0.5"}`} />
          </div>
          <span className="text-xs text-content opacity-60">All Day</span>
        </label>

        {/* Time */}
        {!allDay && (
          <div className="grid grid-cols-2 gap-3">
            {[["Start", start, setStart], ["End", end, setEnd]].map(([lbl, val, setter]) => (
              <div key={lbl} className="flex flex-col gap-1.5">
                <label className="text-[10px] font-semibold uppercase tracking-widest text-content opacity-60 flex items-center gap-1">
                  <Clock size={10} /> {lbl}
                </label>
                <input
                  type="datetime-local"
                  value={fmt(val)}
                  onChange={e => setter(e.target.value)}
                  className="w-full rounded-lg px-3 py-2 text-xs text-header-text bg-black/5 dark:bg-white/5 border border-black/8 dark:border-white/8 outline-none dark:[color-scheme:dark]"
                />
              </div>
            ))}
          </div>
        )}

        {/* Color */}
        <div className="flex flex-col gap-2">
          <label className="text-[10px] font-semibold uppercase tracking-widest text-content opacity-60">
            Color
          </label>
          <div className="flex gap-2">
            {EVENT_COLORS.map(c => (
              <button
                key={c.label}
                onClick={() => setColor(c)}
                className={`w-7 h-7 rounded-full border-0 cursor-pointer transition-transform hover:scale-110 ${c.bg} ${color.bg === c.bg ? "ring-2 ring-offset-2 ring-offset-white dark:ring-offset-[#292D4A] ring-current" : ""}`}
              />
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 pt-1">
          {isEdit && (
            <button
              onClick={() => onDelete(event.id)}
              className="flex items-center gap-1.5 text-xs text-rose-500 cursor-pointer bg-transparent border-0 hover:opacity-70 transition-opacity"
            >
              <Trash2 size={12} /> Delete
            </button>
          )}
          <div className="ml-auto flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-xs text-content cursor-pointer bg-black/5 dark:bg-white/5 border-0 hover:opacity-70 transition-opacity"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={!title.trim()}
              className={`px-5 py-2 rounded-lg text-xs text-white font-semibold cursor-pointer border-0 bg-primary transition-opacity ${!title.trim() ? "opacity-40" : "hover:opacity-90"}`}
            >
              {isEdit ? "Update" : "Save"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Event Pill ──────────────────────────────────────────────────
function EventPill({ event }) {
  return (
    <div className="flex items-center gap-1 h-full overflow-hidden px-1">
      <span className="w-1.5 h-1.5 rounded-full shrink-0 bg-white/70" />
      <span className="truncate text-[11px] font-semibold leading-tight text-white">
        {event.title}
      </span>
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────
export default function TodaySchedule() {
  const [events, setEvents] = useState(SAMPLE_EVENTS);
  const [view,   setView]   = useState(Views.MONTH);
  const [date,   setDate]   = useState(new Date());
  const [modal,  setModal]  = useState(null);

  const handleNavigate = (direction) => {
    const newDate = new Date(date);
    if (view === Views.DAY) {
      newDate.setDate(newDate.getDate() + direction);
    } else if (view === Views.WEEK) {
      newDate.setDate(newDate.getDate() + direction * 7);
    } else if (view === Views.MONTH) {
      newDate.setMonth(newDate.getMonth() + direction);
    }
    setDate(newDate);
  };

  const headerLabel = () => {
    if (view === Views.DAY)  return format(date, "MMMM d, yyyy").toUpperCase();
    if (view === Views.WEEK) {
      const s = startOfWeek(date, { weekStartsOn: 0 });
      const e = addHours(s, 24 * 6);
      return `${format(s, "MMM d")} – ${format(e, "MMM d, yyyy")}`.toUpperCase();
    }
    return format(date, "MMMM yyyy").toUpperCase();
  };

  const handleSelectSlot  = useCallback(slot  => setModal({ type: "new",  slot  }), []);
  const handleSelectEvent = useCallback(event => setModal({ type: "edit", event }), []);

  const handleSave = (data) => {
    setEvents(ev =>
      modal.type === "edit"
        ? ev.map(e => e.id === data.id ? data : e)
        : [...ev, data]
    );
    setModal(null);
  };

  const handleDelete = (id) => {
    setEvents(ev => ev.filter(e => e.id !== id));
    setModal(null);
  };

  const eventPropGetter = (event) => ({
    style: { backgroundColor: event.color?.hex ?? "#6366f1" },
  });

  const views   = [Views.MONTH, Views.WEEK, Views.DAY];
  const isDark  = document.documentElement.classList.contains("dark");

  return (
    <div className={`w-full h-auto flex flex-col bg-white dark:bg-[#292D4A] overflow-x-auto ${isDark ? "" : "scheduler-light"}`}>
      <div className="w-[100%] flex shrink-0  flex-col">

        {/* ── Toolbar ── */}
        <div className="flex items-center px-5 py-3 gap-4 border-b border-black/8 dark:border-white/8">

          {/* Navigation and Today section */}
          <div className="flex items-center gap-2">
            {/* Previous button */}
            <button
              onClick={() => handleNavigate(-1)}
              className="w-8 h-8 flex items-center justify-center rounded-lg text-content bg-transparent border-0 cursor-pointer hover:bg-primary hover:text-white transition-all duration-200"
              aria-label="Previous"
            >
              <ChevronLeft size={18} />
            </button>
            
            {/* Next button */}
            <button
              onClick={() => handleNavigate(1)}
              className="w-8 h-8 flex items-center justify-center rounded-lg text-content bg-transparent border-0 cursor-pointer hover:bg-primary hover:text-white transition-all duration-200"
              aria-label="Next"
            >
              <ChevronRight size={18} />
            </button>
            
            {/* Today button */}
            <button
              onClick={() => setDate(new Date())}
              className="px-4 py-1.5 rounded-lg text-xs font-semibold text-white bg-primary border-0 cursor-pointer hover:opacity-90 transition-opacity ml-2"
            >
              today
            </button>
          </div>

          {/* Month label */}
          <div className="flex-1 text-center">
            <span className="text-sm font-semibold tracking-widest text-header-text">
              {headerLabel()}
            </span>
          </div>

          {/* View switcher */}
          <div className="flex rounded-lg overflow-hidden border border-black/8 dark:border-white/8">
            {views.map(v => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={`px-4 py-1.5 text-xs font-semibold cursor-pointer border-0 transition-all capitalize
                  ${view === v
                    ? "bg-primary text-white"
                    : "bg-transparent text-content hover:bg-black/5 dark:hover:bg-white/5"
                  }`}
              >
                {v}
              </button>
            ))}
          </div>

          {/* Add */}
          <button
            onClick={() => setModal({ type: "new", slot: { start: startOfHour(new Date()), end: addHours(startOfHour(new Date()), 1) } })}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-white bg-primary border-0 cursor-pointer hover:opacity-90 transition-opacity"
          >
            <Plus size={15} strokeWidth={2.5} />
          </button>
        </div>

        {/* ── Calendar ── */}
        <div className="flex-1">
          <Calendar
            localizer={localizer}
            events={events}
            view={view}
            date={date}
            onView={setView}
            onNavigate={setDate}
            selectable
            onSelectSlot={handleSelectSlot}
            onSelectEvent={handleSelectEvent}
            eventPropGetter={eventPropGetter}
            components={{ event: EventPill }}
            style={{ height: 600 }}
            step={30}
            timeslots={2}
            popup
            showMultiDayTimes
          />
        </div>
      </div>

      {/* ── Modal ── */}
      {modal && (
        <EventModal
          slot={modal.type === "new" ? modal.slot : null}
          event={modal.type === "edit" ? modal.event : null}
          onSave={handleSave}
          onDelete={handleDelete}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  );
}