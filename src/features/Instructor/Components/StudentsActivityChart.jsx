import { useState, useEffect } from 'react'
import {
  LineChart, Line, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid
} from 'recharts'
import { BsThreeDots } from 'react-icons/bs'
import axios from 'axios'
import { useSelector } from 'react-redux'

const baseUrl =
  import.meta.env?.VITE_BACKEND_URL ||
  "https://cms-backend-ashen.vercel.app";

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div
      className="rounded-xl shadow-2xl px-5 py-4 flex flex-col gap-2 min-w-[160px]"
      style={{ background: '#111827', border: 'none' }}
    >
      <span className="text-base font-bold text-white">{label}</span>
      {payload.map((p) => (
        <div key={p.dataKey} className="flex items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <span
              className="w-3 h-3 rounded-full border-2"
              style={{ borderColor: p.stroke, backgroundColor: 'transparent' }}
            />
            <span className="text-sm text-gray-300 capitalize">{p.name}:</span>
          </div>
          <span className="text-sm font-bold text-white">{p.value}</span>
        </div>
      ))}
    </div>
  )
}

export default function StudentsActivityChart() {
  const [chartData, setChartData] = useState([])
  const [loading, setLoading] = useState(true)

  const user = useSelector((state) => state.auth.user)
  const isInstructor = user?.role === 'instructor'
  const isAdmin = user?.role === 'admin'

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)

        let enrollments = []

        if (isAdmin) {
          const { data } = await axios.get(`${baseUrl}/api/enrollments`)
          enrollments = data.enrollments || []

        } else if (isInstructor) {
          const { data: instructorData } = await axios.get(
            `${baseUrl}/api/instructors/user/${user?.id}`
          )
          const instructorId = instructorData.instructor._id

          const { data: coursesData } = await axios.get(
            `${baseUrl}/api/courses?instructor=${instructorId}`
          )

          for (const course of coursesData.courses) {
            const { data } = await axios.get(
              `${baseUrl}/api/enrollments?course=${course._id}`
            )
            enrollments.push(...(data.enrollments || []))
          }
        }

        const now = new Date()

        // This month — day of week se group karo
        const thisMonthEnrollments = enrollments.filter((e) => {
          const d = new Date(e.enrolledAt)
          return d.getMonth() === now.getMonth() &&
                 d.getFullYear() === now.getFullYear()
        })

        // Last month
        const lastMonthDate = new Date(now.getFullYear(), now.getMonth() - 1)
        const lastMonthEnrollments = enrollments.filter((e) => {
          const d = new Date(e.enrolledAt)
          return d.getMonth() === lastMonthDate.getMonth() &&
                 d.getFullYear() === lastMonthDate.getFullYear()
        })

        // Day of week se group karo
        const dayData = DAYS.map((day, i) => {
          const present = thisMonthEnrollments.filter((e) => {
            return new Date(e.enrolledAt).getDay() === i
          }).length

          const visitors = lastMonthEnrollments.filter((e) => {
            return new Date(e.enrolledAt).getDay() === i
          }).length

          return { day, present, visitors }
        })

        setChartData(dayData)

      } catch (error) {
        console.error('Error fetching activity:', error)
        setChartData(DAYS.map((day) => ({ day, present: 0, visitors: 0 })))
      } finally {
        setLoading(false)
      }
    }

    if (user?.id) fetchData()
  }, [user?.id])

  return (
    <div className="bg-[#ffffff] dark:bg-[#292D4A] rounded-md p-5 flex flex-col gap-4 flex-1 min-w-0">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <span className="text-sm font-bold text-header-text">Students Activity</span>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full border-2 border-teal-500" />
            <span className="text-xs text-content-text">This Month</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full border-2 border-red-400" />
            <span className="text-xs text-content-text">Last Month</span>
          </div>
          <button className="text-content-text hover:text-header-text transition-colors">
            <BsThreeDots className="w-4 h-4" />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={160}>
          <LineChart
            data={chartData}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(100,100,150,0.1)"
              vertical={false}
            />
            <XAxis
              dataKey="day"
              tick={{ fill: 'var(--content-text)', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis hide />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ stroke: 'rgba(255,255,255,0.15)', strokeDasharray: '4 4' }}
            />
            <Line
              type="monotoneX"
              dataKey="present"
              name="This Month"
              stroke="#14B8A6"
              strokeWidth={3}
              dot={{ r: 5, fill: '#14B8A6', strokeWidth: 0 }}
              activeDot={{ r: 7, fill: '#14B8A6', stroke: '#fff', strokeWidth: 2 }}
            />
            <Line
              type="monotoneX"
              dataKey="visitors"
              name="Last Month"
              stroke="#F87171"
              strokeWidth={3}
              dot={{ r: 5, fill: '#F87171', strokeWidth: 0 }}
              activeDot={{ r: 7, fill: '#F87171', stroke: '#fff', strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}