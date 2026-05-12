import { BsThreeDots } from 'react-icons/bs'

const EVENTS = [
  {
    date: '5 Jan',
    items: [
      { time: '08:00 AM', category: 'UI Design',      title: 'Introduction Wireframe', color: 'bg-primary' },
      { time: '08:00 AM', category: 'Graphic Design', title: 'Basic HTML',             color: 'bg-teal-500' },
      { time: '08:00 AM', category: 'Web Design',     title: 'Basic HTML',             color: 'bg-yellow-400' },
    ],
  },
  {
    date: '5 Jan',
    items: [
      { time: '08:00 AM', category: 'UI Design',      title: 'Introduction Wireframe', color: 'bg-primary' },
      { time: '08:00 AM', category: 'UI Design',      title: 'Prototyping',            color: 'bg-teal-500' },
      { time: '08:00 AM', category: 'Graphic Design', title: 'Photo Manipulation',     color: 'bg-yellow-400' },
    ],
  },
]

export default function UpcomingEvents() {
  return (
    <div className="bg-[#ffffff] dark:bg-[#292D4A] rounded-md p-5 flex flex-col gap-5">
      <h3 className="text-base font-bold text-header-text">Upcoming Events</h3>

      <div className="flex flex-col gap-5">
        {EVENTS.map((group, gi) => (
          <div key={gi} className="flex flex-col gap-3">
            {/* Date row */}
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-header-text">{group.date}</span>
              <button className="text-content-text hover:text-header-text transition-colors duration-200">
                <BsThreeDots className="w-4 h-4" />
              </button>
            </div>

            {/* Event items */}
            <div className="flex flex-col gap-2.5">
              {group.items.map((ev, ei) => (
                <div key={ei} className="flex items-start gap-3">
                  <span className="text-xs text-content-text w-16 shrink-0 pt-0.5">{ev.time}</span>
                  <div className={`w-1 self-stretch rounded-full shrink-0 ${ev.color}`} />
                  <div className="flex flex-col gap-0.5">
                    <span className="text-xs text-content-text">{ev.category}</span>
                    <span className="text-sm font-semibold text-header-text leading-tight">{ev.title}</span>
                  </div>
                </div>
              ))}
            </div>

            {gi < EVENTS.length - 1 && (
              <div className="border-t border-gray-100 dark:border-white/10" />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}