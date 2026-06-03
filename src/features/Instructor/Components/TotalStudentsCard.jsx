import { useState, useEffect } from 'react'
import { AreaChart, Area, ResponsiveContainer, Tooltip } from 'recharts'
import { FaUserFriends } from 'react-icons/fa'
import axios from 'axios'
import { useSelector } from 'react-redux'

const baseUrl =
  import.meta.env?.VITE_BACKEND_URL ||
  "https://cms-backend-ashen.vercel.app";

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

export default function TotalStudentsCard() {
  const [totalStudents, setTotalStudents] = useState(0)
  const [chartData, setChartData] = useState([])
  const [loading, setLoading] = useState(true)

  const user = useSelector((state) => state.auth.user)
  const isAdmin = user?.role === 'admin'
  const isInstructor = user?.role === 'instructor'

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)

        if (isAdmin) {
          // ─── Admin: Sab enrollments count ─────────
          const { data } = await axios.get(`${baseUrl}/api/enrollments`)
          setTotalStudents(data.total || 0)

          // Monthly chart data
          const currentMonth = new Date().getMonth()
          const last7 = []
          for (let i = 6; i >= 0; i--) {
            const monthIndex = (currentMonth - i + 12) % 12
            const monthEnrollments = data.enrollments?.filter((e) => {
              const d = new Date(e.enrolledAt)
              return d.getMonth() === monthIndex
            })
            last7.push({ v: monthEnrollments?.length || 0 })
          }
          setChartData(last7)

        } else if (isInstructor) {
          // ─── Instructor: Apne students ────────────
          const { data: instructorData } = await axios.get(
            `${baseUrl}/api/instructors/user/${user?.id}`
          )
          const instructorId = instructorData.instructor._id

          // Stats lao
          const { data: statsData } = await axios.get(
            `${baseUrl}/api/instructors/${instructorId}/stats`
          )

          setTotalStudents(statsData.stats.totalStudents || 0)

          // Monthly students chart
          const monthlyStudents = statsData.monthlyStudents || []
          const currentMonth = new Date().getMonth()
          const last7 = []
          for (let i = 6; i >= 0; i--) {
            const monthIndex = (currentMonth - i + 12) % 12
            const found = monthlyStudents.find(
              (m) => m._id?.month === monthIndex + 1
            )
            last7.push({ v: found?.total || 0 })
          }
          setChartData(last7)
        }

      } catch (error) {
        console.error('Error fetching total students:', error)
        setChartData(Array.from({ length: 7 }, () => ({ v: 0 })))
      } finally {
        setLoading(false)
      }
    }

    if (user?.id) fetchData()
  }, [user?.id])

  return (
    <div className="bg-teal-500 rounded-md p-5 flex flex-col gap-3 w-[50%]">
      <div className="w-12 h-12 rounded-md bg-white/20 flex items-center justify-center">
        <FaUserFriends className="w-6 h-6 text-white" />
      </div>

      <div>
        {loading ? (
          <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
        ) : (
          <>
            <div className="text-2xl font-bold text-white">
              {totalStudents.toLocaleString()}
            </div>
            <div className="text-sm text-white/80">Total Students</div>
          </>
        )}
      </div>

      <ResponsiveContainer width="100%" height={60}>
        <AreaChart data={chartData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="whiteGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ffffff" stopOpacity={0.4} />
              <stop offset="100%" stopColor="#ffffff" stopOpacity={0} />
            </linearGradient>
          </defs>
          <Tooltip
            contentStyle={{
              background: '#0f766e',
              border: 'none',
              borderRadius: 8,
              fontSize: 12,
            }}
            labelStyle={{ color: '#fff' }}
            formatter={(v) => [v, 'Students']}
            itemStyle={{ color: '#fff' }}
          />
          <Area
            type="monotone"
            dataKey="v"
            stroke="#ffffff"
            strokeWidth={2}
            fill="url(#whiteGrad)"
            dot={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}