import { useState } from 'react'
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'

const DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']
const MONTHS = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December'
]

function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate()
}
function getFirstDay(year, month) {
  return new Date(year, month, 1).getDay()
}

export default function MiniCalendar() {
  const today = new Date()
  const [current, setCurrent] = useState({ year: today.getFullYear(), month: today.getMonth() })

  const daysInMonth = getDaysInMonth(current.year, current.month)
  const firstDay    = getFirstDay(current.year, current.month)

  const prevMonth = () => setCurrent(c =>
    c.month === 0 ? { year: c.year - 1, month: 11 } : { ...c, month: c.month - 1 }
  )
  const nextMonth = () => setCurrent(c =>
    c.month === 11 ? { year: c.year + 1, month: 0 } : { ...c, month: c.month + 1 }
  )

  const cells = []
  for (let i = 0; i < firstDay; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(d)

  const isToday = (d) =>
    d === today.getDate() &&
    current.month === today.getMonth() &&
    current.year === today.getFullYear()

  // Highlighted event days
  const eventDays = [17, 19, 22]

  return (
    <div className="bg-[#ffffff] dark:bg-[#292D4A] rounded-md p-5 flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={prevMonth}
          className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-primary/10 transition-colors duration-200"
        >
          <FaChevronLeft className="w-3 h-3 text-content-text" />
        </button>
        <span className="text-sm font-bold text-header-text">
          {MONTHS[current.month]} {current.year}
        </span>
        <button
          onClick={nextMonth}
          className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-primary/10 transition-colors duration-200"
        >
          <FaChevronRight className="w-3 h-3 text-content-text" />
        </button>
      </div>

      {/* Day names */}
      <div className="grid grid-cols-7 text-center">
        {DAYS.map(d => (
          <span key={d} className="text-xs font-semibold text-content-text py-1">{d}</span>
        ))}
      </div>

      {/* Date cells */}
      <div className="grid grid-cols-7 text-center gap-y-1">
        {cells.map((d, i) => (
          <div key={i} className="flex items-center justify-center">
            {d ? (
              <button className={`
                w-8 h-8 text-xs font-medium rounded-md transition-all duration-200
                ${isToday(d)
                  ? 'bg-primary text-white font-bold'
                  : eventDays.includes(d)
                  ? 'bg-primary/15 text-primary font-semibold'
                  : 'text-header-text hover:bg-primary/10 hover:text-primary'
                }
              `}>
                {d}
              </button>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  )
}