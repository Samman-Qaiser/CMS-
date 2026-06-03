import React, { useState, useCallback, useEffect } from "react";
import { Calendar, dateFnsLocalizer, Views } from "react-big-calendar";
import { format, parse, startOfWeek, getDay, addHours, startOfHour } from "date-fns";
import { Plus, X, Clock, Trash2, AlignLeft, ChevronLeft, ChevronRight } from "lucide-react";
import axios from "axios";
import Swal from "sweetalert2";
import { useSelector } from "react-redux";
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

const baseUrl = import.meta.env?.VITE_BACKEND_URL || "https://cms-backend-ashen.vercel.app";

// ─── Event Modal ─────────────────────────────────────────────────
// In TodaySchedule.jsx, update the EventModal component
function EventModal({ slot, event, onSave, onDelete, onClose }) {
  const isEdit = !!event;
  const user = useSelector((state) => state.auth.user);
  
  const [title, setTitle] = useState(event?.title ?? "");
  const [desc, setDesc] = useState(event?.description ?? event?.desc ?? "");
  const [color, setColor] = useState(() => {
    if (event?.color) {
      const found = EVENT_COLORS.find(c => c.hex === event.color);
      return found || EVENT_COLORS[0];
    }
    return EVENT_COLORS[0];
  });
  const [allDay, setAllDay] = useState(event?.allDay ?? false);
  const [start, setStart] = useState(() => {
    if (event?.start) return new Date(event.start);
    if (event?.startTime) return new Date(event.startTime);
    return slot?.start ?? new Date();
  });
  const [end, setEnd] = useState(() => {
    if (event?.end) return new Date(event.end);
    if (event?.endTime) return new Date(event.endTime);
    return slot?.end ?? addHours(new Date(), 1);
  });
  const [type, setType] = useState(event?.type ?? "task");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [instructorId, setInstructorId] = useState(null);
  const [fetchingInstructor, setFetchingInstructor] = useState(true);

  // Fetch instructor ID when modal opens (for new events)
  useEffect(() => {
    const fetchInstructorId = async () => {
      if (isEdit) {
        // For edit, use existing event's instructor
        setInstructorId(event?.instructor);
        setFetchingInstructor(false);
        return;
      }
      
      if (!user?.id) {
        setFetchingInstructor(false);
        return;
      }
      
      try {
        const response = await axios.get(`${baseUrl}/api/instructors/user/${user.id}`);
        if (response.data.success && response.data.instructor) {
          setInstructorId(response.data.instructor._id);
        }
      } catch (error) {
        console.error("Error fetching instructor:", error);
      } finally {
        setFetchingInstructor(false);
      }
    };
    
    fetchInstructorId();
  }, [user?.id, isEdit, event]);

  const fmt = (d) => format(new Date(d), "yyyy-MM-dd'T'HH:mm");

  const validateForm = () => {
    const newErrors = {};
    
    if (!title.trim()) {
      newErrors.title = "Title is required";
    }
    
    if (!start) {
      newErrors.start = "Start time is required";
    }
    
    if (!end) {
      newErrors.end = "End time is required";
    }
    
    if (start && end && new Date(start) >= new Date(end)) {
      newErrors.end = "End time must be after start time";
    }
    
    if (!instructorId && !isEdit) {
      newErrors.instructor = "Instructor not found. Please contact admin.";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;
    
    setLoading(true);
    
    try {
      const scheduleData = {
        instructor: instructorId,
        title: title.trim(),
        description: desc,
        startTime: new Date(start).toISOString(),
        endTime: new Date(end).toISOString(),
        type: type,
        color: color.hex,
      };
      
      let response;
      if (isEdit) {
        response = await axios.put(`${baseUrl}/api/schedules/${event._id || event.id}`, scheduleData);
      } else {
        response = await axios.post(`${baseUrl}/api/schedules`, scheduleData);
      }
      
      if (response.data.success) {
        onSave(response.data.schedule);
        Swal.fire({
          title: "Success!",
          text: `Event ${isEdit ? "updated" : "created"} successfully`,
          icon: "success",
          timer: 2000,
          showConfirmButton: false
        });
        onClose();
      }
    } catch (error) {
      console.error("Save error:", error);
      Swal.fire({
        title: "Error!",
        text: error.response?.data?.message || "Failed to save event",
        icon: "error",
        confirmButtonColor: "#FF6F61"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    const result = await Swal.fire({
      title: "Delete Event?",
      text: "This action cannot be undone",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!"
    });
    
    if (result.isConfirmed) {
      try {
        await axios.delete(`${baseUrl}/api/schedules/${event._id || event.id}`);
        onDelete(event._id || event.id);
        Swal.fire("Deleted!", "Event has been deleted.", "success");
      } catch (error) {
        console.error("Delete error:", error);
        Swal.fire("Error!", "Failed to delete event", "error");
      }
    }
  };

  if (fetchingInstructor && !isEdit) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <div className="bg-white dark:bg-[#292D4A] rounded-2xl p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-center text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-md bg-white dark:bg-[#292D4A] rounded-2xl shadow-2xl flex flex-col gap-4 p-6 border border-black/8 dark:border-white/8 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-header-text">
            {isEdit ? "Edit Event" : "New Event"}
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-content hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Instructor Field (Read-only) */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold uppercase tracking-widest text-content opacity-60">
            Instructor *
          </label>
          <input
            type="text"
            value={user?.firstName ? `${user.firstName} ${user.lastName}` : user?.email || "Loading..."}
            disabled
            className="w-full rounded-lg px-3 py-2 text-sm text-header-text bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 outline-none cursor-not-allowed"
          />
          {errors.instructor && (
            <p className="text-xs text-red-500 mt-1">{errors.instructor}</p>
          )}
        </div>

        {/* Title */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold uppercase tracking-widest text-content opacity-60">
            Title *
          </label>
          <input
            autoFocus
            value={title}
            onChange={e => {
              setTitle(e.target.value);
              if (errors.title) setErrors({ ...errors, title: null });
            }}
            placeholder="Event title..."
            className={`w-full rounded-lg px-3 py-2 text-sm text-header-text bg-black/5 dark:bg-white/5 border ${errors.title ? 'border-red-500' : 'border-black/8 dark:border-white/8'} outline-none`}
          />
          {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title}</p>}
        </div>

        {/* Type */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold uppercase tracking-widest text-content opacity-60">
            Event Type
          </label>
          <select
            value={type}
            onChange={e => setType(e.target.value)}
            className="w-full rounded-lg px-3 py-2 text-sm text-header-text bg-white dark:bg-[#292D4A] border border-black/8 dark:border-white/8 outline-none"
          >
            <option value="task">Task</option>
             <option value="live_class">Live Class</option>
            <option value="event">Event</option>
            <option value="meeting">Meeting</option>
            <option value="reminder">Reminder</option>
            <option value="deadline">Deadline</option>
          </select>
        </div>

        {/* Description */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold uppercase tracking-widest text-content opacity-60">
            Description
          </label>
          <textarea
            value={desc}
            onChange={e => setDesc(e.target.value)}
            placeholder="Add a description..."
            rows={2}
            className="w-full rounded-lg px-3 py-2 text-sm text-header-text bg-black/5 dark:bg-white/5 border border-black/8 dark:border-white/8 outline-none resize-none"
          />
        </div>

        {/* All Day Toggle */}
        <label className="flex items-center gap-3 cursor-pointer select-none">
          <div
            onClick={() => setAllDay(v => !v)}
            className={`w-9 h-5 rounded-full relative cursor-pointer transition-colors ${allDay ? "bg-primary" : "bg-gray-300 dark:bg-gray-600"}`}
          >
            <div className={`absolute top-0.5 w-4 h-4 rounded-full transition-all bg-white ${allDay ? "left-[18px]" : "left-0.5"}`} />
          </div>
          <span className="text-sm text-content">All Day</span>
        </label>

        {/* Date/Time Fields */}
        {!allDay ? (
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold uppercase tracking-widest text-content opacity-60">
                Start Time *
              </label>
              <input
                type="datetime-local"
                value={fmt(start)}
                onChange={e => {
                  setStart(e.target.value);
                  if (errors.start) setErrors({ ...errors, start: null });
                }}
                className={`w-full rounded-lg px-3 py-2 text-sm text-header-text bg-black/5 dark:bg-white/5 border ${errors.start ? 'border-red-500' : 'border-black/8 dark:border-white/8'} outline-none`}
              />
              {errors.start && <p className="text-xs text-red-500">{errors.start}</p>}
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold uppercase tracking-widest text-content opacity-60">
                End Time *
              </label>
              <input
                type="datetime-local"
                value={fmt(end)}
                onChange={e => {
                  setEnd(e.target.value);
                  if (errors.end) setErrors({ ...errors, end: null });
                }}
                className={`w-full rounded-lg px-3 py-2 text-sm text-header-text bg-black/5 dark:bg-white/5 border ${errors.end ? 'border-red-500' : 'border-black/8 dark:border-white/8'} outline-none`}
              />
              {errors.end && <p className="text-xs text-red-500">{errors.end}</p>}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold uppercase tracking-widest text-content opacity-60">
                Start Date *
              </label>
              <input
                type="date"
                value={format(new Date(start), "yyyy-MM-dd")}
                onChange={e => {
                  const newDate = new Date(start);
                  newDate.setFullYear(parseInt(e.target.value.split('-')[0]));
                  newDate.setMonth(parseInt(e.target.value.split('-')[1]) - 1);
                  newDate.setDate(parseInt(e.target.value.split('-')[2]));
                  setStart(newDate);
                }}
                className="w-full rounded-lg px-3 py-2 text-sm text-header-text bg-black/5 dark:bg-white/5 border border-black/8 dark:border-white/8 outline-none"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold uppercase tracking-widest text-content opacity-60">
                End Date *
              </label>
              <input
                type="date"
                value={format(new Date(end), "yyyy-MM-dd")}
                onChange={e => {
                  const newDate = new Date(end);
                  newDate.setFullYear(parseInt(e.target.value.split('-')[0]));
                  newDate.setMonth(parseInt(e.target.value.split('-')[1]) - 1);
                  newDate.setDate(parseInt(e.target.value.split('-')[2]));
                  setEnd(newDate);
                }}
                className="w-full rounded-lg px-3 py-2 text-sm text-header-text bg-black/5 dark:bg-white/5 border border-black/8 dark:border-white/8 outline-none"
              />
            </div>
          </div>
        )}

        {/* Color Selection */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold uppercase tracking-widest text-content opacity-60">
            Color
          </label>
          <div className="flex gap-2 flex-wrap">
            {EVENT_COLORS.map(c => (
              <button
                key={c.label}
                type="button"
                onClick={() => setColor(c)}
                className={`w-8 h-8 rounded-full transition-transform hover:scale-110 ${c.bg} ${color.bg === c.bg ? "ring-2 ring-offset-2 ring-offset-white dark:ring-offset-[#292D4A] ring-current" : ""}`}
              />
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 pt-4">
          {isEdit && (
            <button
              type="button"
              onClick={handleDelete}
              className="px-4 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
            >
              Delete
            </button>
          )}
          <div className="flex-1" />
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm text-content hover:bg-black/5 dark:hover:bg-white/5 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={loading || fetchingInstructor}
            className="px-6 py-2 text-sm font-semibold text-white bg-primary rounded-lg hover:bg-primary/90 disabled:opacity-50 transition-colors"
          >
            {loading ? "Saving..." : (isEdit ? "Update" : "Save")}
          </button>
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
  const [events, setEvents] = useState([]);
  const [view, setView] = useState(Views.MONTH);
  const [date, setDate] = useState(new Date());
  const [modal, setModal] = useState(null);
  const [loading, setLoading] = useState(true);
  const user = useSelector((state) => state.auth.user);

  // Fetch schedules from backend
  const fetchSchedules = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${baseUrl}/api/schedules`);
      
      if (response.data.success) {
        // Transform backend data to calendar format
        const calendarEvents = response.data.schedules.map(schedule => ({
          id: schedule._id,
          title: schedule.title,
          description: schedule.description,
          start: new Date(schedule.startTime),
          end: new Date(schedule.endTime),
          allDay: schedule.allDay || false,
          color: EVENT_COLORS.find(c => c.hex === schedule.color) || EVENT_COLORS[0],
          type: schedule.type,
          instructor: schedule.instructor
        }));
        setEvents(calendarEvents);
      }
    } catch (error) {
      console.error("Error fetching schedules:", error);
      if (error.response?.status !== 404) {
        Swal.fire("Error", "Failed to load schedules", "error");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchedules();
  }, []);

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
    if (view === Views.DAY) return format(date, "MMMM d, yyyy").toUpperCase();
    if (view === Views.WEEK) {
      const s = startOfWeek(date, { weekStartsOn: 0 });
      const e = addHours(s, 24 * 6);
      return `${format(s, "MMM d")} – ${format(e, "MMM d, yyyy")}`.toUpperCase();
    }
    return format(date, "MMMM yyyy").toUpperCase();
  };

  const handleSelectSlot = useCallback(slot => {
    if (!user?.id) {
      Swal.fire({
        title: "Login Required",
        text: "Please login to create events",
        icon: "warning",
        confirmButtonColor: "#FF6F61"
      });
      return;
    }
    setModal({ type: "new", slot });
  }, [user]);

  const handleSelectEvent = useCallback(event => {
    setModal({ type: "edit", event });
  }, []);

  const handleSave = (data) => {
    const calendarEvent = {
      id: data._id,
      title: data.title,
      description: data.description,
      start: new Date(data.startTime),
      end: new Date(data.endTime),
      allDay: data.allDay || false,
      color: EVENT_COLORS.find(c => c.hex === data.color) || EVENT_COLORS[0],
      type: data.type
    };
    
    setEvents(prev => {
      const exists = prev.find(e => e.id === calendarEvent.id);
      if (exists) {
        return prev.map(e => e.id === calendarEvent.id ? calendarEvent : e);
      }
      return [...prev, calendarEvent];
    });
    setModal(null);
    fetchSchedules();
  };

  const handleDelete = (id) => {
    setEvents(prev => prev.filter(e => e.id !== id));
    setModal(null);
    fetchSchedules();
  };

  const eventPropGetter = (event) => ({
    style: { backgroundColor: event.color?.hex ?? "#6366f1" },
  });

  const views = [Views.MONTH, Views.WEEK, Views.DAY];
  const isDark = document.documentElement.classList.contains("dark");

  if (loading) {
    return (
      <div className="w-full h-[600px] flex items-center justify-center bg-white dark:bg-[#292D4A]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-500">Loading schedules...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`w-full h-auto flex flex-col bg-white dark:bg-[#292D4A] overflow-x-auto ${isDark ? "" : "scheduler-light"}`}>
      <div className="w-[100%] flex shrink-0 flex-col">
        {/* Toolbar */}
        <div className="flex items-center px-5 py-3 gap-4 border-b border-black/8 dark:border-white/8">
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleNavigate(-1)}
              className="w-8 h-8 flex items-center justify-center rounded-lg text-content bg-transparent border-0 cursor-pointer hover:bg-primary hover:text-white transition-all duration-200"
            >
              <ChevronLeft size={18} />
            </button>
            
            <button
              onClick={() => handleNavigate(1)}
              className="w-8 h-8 flex items-center justify-center rounded-lg text-content bg-transparent border-0 cursor-pointer hover:bg-primary hover:text-white transition-all duration-200"
            >
              <ChevronRight size={18} />
            </button>
            
            <button
              onClick={() => setDate(new Date())}
              className="px-4 py-1.5 rounded-lg text-xs font-semibold text-white bg-primary border-0 cursor-pointer hover:opacity-90 transition-opacity ml-2"
            >
              today
            </button>
          </div>

          <div className="flex-1 text-center">
            <span className="text-sm font-semibold tracking-widest text-header-text">
              {headerLabel()}
            </span>
          </div>

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

          <button
            onClick={() => {
              if (!user?.id) {
                Swal.fire({
                  title: "Login Required",
                  text: "Please login to create events",
                  icon: "warning",
                  confirmButtonColor: "#FF6F61"
                });
                return;
              }
              setModal({ type: "new", slot: { start: startOfHour(new Date()), end: addHours(startOfHour(new Date()), 1) } });
            }}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-white bg-primary border-0 cursor-pointer hover:opacity-90 transition-opacity"
          >
            <Plus size={15} strokeWidth={2.5} />
          </button>
        </div>

        {/* Calendar */}
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

      {/* Modal */}
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