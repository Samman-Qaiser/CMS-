import { useState, useEffect } from 'react'
import { BsThreeDots } from 'react-icons/bs'
import axios from 'axios'
import { useSelector } from 'react-redux'
import { format } from 'date-fns'

const baseUrl =
  import.meta.env?.VITE_BACKEND_URL ||
  "https://cms-backend-ashen.vercel.app";

const EVENT_COLORS = [
  'bg-primary',
  'bg-teal-500',
  'bg-yellow-400',
  'bg-purple-500',
  'bg-pink-500',
]

export default function UpcomingEvents() {
  const [groupedEvents, setGroupedEvents] = useState([])
  const [loading, setLoading] = useState(true)

  const user = useSelector((state) => state.auth.user)

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true)

        // Instructor ID lao
        const { data: instructorData } = await axios.get(
          `${baseUrl}/api/instructors/user/${user?.id}`
        )
        const instructorId = instructorData.instructor._id

        // Sirf event type schedules lao
        const { data } = await axios.get(
          `${baseUrl}/api/schedules?instructor=${instructorId}&type=event`
        )

        const now = new Date()

        // Upcoming events filter karo
        const upcomingEvents = data.schedules
          .filter((s) => new Date(s.startTime) >= now)
          .sort((a, b) => new Date(a.startTime) - new Date(b.startTime))

        // Date ke mutabiq group karo
        const grouped = {}
        upcomingEvents.forEach((event, index) => {
          const dateKey = format(new Date(event.startTime), 'd MMM')
          if (!grouped[dateKey]) {
            grouped[dateKey] = []
          }
          grouped[dateKey].push({
            ...event,
            color: event.color
              ? ''
              : EVENT_COLORS[index % EVENT_COLORS.length],
            colorStyle: event.color ? { backgroundColor: event.color } : {},
          })
        })

        // Array mein convert karo
        const groupedArray = Object.entries(grouped).map(([date, items]) => ({
          date,
          items,
        }))

        setGroupedEvents(groupedArray)

      } catch (error) {
        console.error('Error fetching events:', error)
      } finally {
        setLoading(false)
      }
    }

    if (user?.id) fetchEvents()
  }, [user?.id])

  if (loading) {
    return (
      <div className="bg-[#ffffff] dark:bg-[#292D4A] rounded-md p-5 flex flex-col gap-5">
        <h3 className="text-base font-bold text-header-text">Upcoming Events</h3>
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      </div>
    )
  }

  if (groupedEvents.length === 0) {
    return (
      <div className="bg-[#ffffff] dark:bg-[#292D4A] rounded-md p-5 flex flex-col gap-5">
        <h3 className="text-base font-bold text-header-text">Upcoming Events</h3>
        <div className="text-center py-8">
          <p className="text-content-text text-sm">No upcoming events</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-[#ffffff] dark:bg-[#292D4A] rounded-md p-5 flex flex-col gap-5">
      <h3 className="text-base font-bold text-header-text">Upcoming Events</h3>

      <div className="flex flex-col gap-5">
        {groupedEvents.map((group, gi) => (
          <div key={gi} className="flex flex-col gap-3">

            {/* Date row */}
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-header-text">
                {group.date}
              </span>
              <button className="text-content-text hover:text-header-text transition-colors">
                <BsThreeDots className="w-4 h-4" />
              </button>
            </div>

            {/* Event items */}
            <div className="flex flex-col gap-2.5">
              {group.items.map((ev) => (
                <div key={ev._id} className="flex items-start gap-3">
                  {/* Time */}
                  <span className="text-xs text-content-text w-16 shrink-0 pt-0.5">
                    {format(new Date(ev.startTime), 'hh:mm a')}
                  </span>

                  {/* Color bar */}
                  <div
                    className={`w-1 self-stretch rounded-full shrink-0 ${ev.color}`}
                    style={ev.colorStyle}
                  />

                  {/* Details */}
                  <div className="flex flex-col gap-0.5">
                    <span className="text-sm font-semibold text-header-text leading-tight">
                      {ev.title}
                    </span>
                    {ev.description && (
                      <span className="text-xs text-content-text line-clamp-1">
                        {ev.description}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {gi < groupedEvents.length - 1 && (
              <div className="border-t border-gray-100 dark:border-white/10" />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}