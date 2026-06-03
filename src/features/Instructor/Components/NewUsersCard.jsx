import { useState, useEffect } from 'react'
import { AreaChart, Area, ResponsiveContainer } from 'recharts'
import { FaArrowUp, FaArrowDown } from 'react-icons/fa'
import axios from 'axios'
import { useSelector } from 'react-redux'

const baseUrl =
  import.meta.env?.VITE_BACKEND_URL ||
  "https://cms-backend-ashen.vercel.app";

export default function NewUsersCard() {
  const [newUsers, setNewUsers] = useState(0)
  const [growth, setGrowth] = useState(0)
  const [isPositive, setIsPositive] = useState(true)
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
          // ─── Admin: Sab users count ───────────────
          const { data } = await axios.get(`${baseUrl}/api/users`)
          const users = data.users || []

          // This month new users
          const now = new Date()
          const thisMonth = users.filter((u) => {
            const d = new Date(u.createdAt)
            return d.getMonth() === now.getMonth() &&
                   d.getFullYear() === now.getFullYear()
          })

          // Last month
          const lastMonth = users.filter((u) => {
            const d = new Date(u.createdAt)
            const lm = new Date(now.getFullYear(), now.getMonth() - 1)
            return d.getMonth() === lm.getMonth() &&
                   d.getFullYear() === lm.getFullYear()
          })

          setNewUsers(thisMonth.length)

          // Growth calculate
          if (lastMonth.length > 0) {
            const g = ((thisMonth.length - lastMonth.length) / lastMonth.length * 100).toFixed(1)
            setGrowth(Math.abs(g))
            setIsPositive(g >= 0)
          }

          // Chart — last 7 months
          const last7 = []
          for (let i = 6; i >= 0; i--) {
            const m = new Date(now.getFullYear(), now.getMonth() - i)
            const count = users.filter((u) => {
              const d = new Date(u.createdAt)
              return d.getMonth() === m.getMonth() &&
                     d.getFullYear() === m.getFullYear()
            }).length
            last7.push({ v: count })
          }
          setChartData(last7)

        } else if (isInstructor) {
          // ─── Instructor: Apne new students ────────
          const { data: instructorData } = await axios.get(
            `${baseUrl}/api/instructors/user/${user?.id}`
          )
          const instructorId = instructorData.instructor._id

          const { data: statsData } = await axios.get(
            `${baseUrl}/api/instructors/${instructorId}/stats`
          )

          const monthlyStudents = statsData.monthlyStudents || []
          const now = new Date()

          // This month
          const thisMonth = monthlyStudents.find(
            (m) => m._id?.month === now.getMonth() + 1 &&
                   m._id?.year === now.getFullYear()
          )

          // Last month
          const lastMonthDate = new Date(now.getFullYear(), now.getMonth() - 1)
          const lastMonth = monthlyStudents.find(
            (m) => m._id?.month === lastMonthDate.getMonth() + 1 &&
                   m._id?.year === lastMonthDate.getFullYear()
          )

          const thisMonthCount = thisMonth?.total || 0
          const lastMonthCount = lastMonth?.total || 0

          setNewUsers(thisMonthCount)

          if (lastMonthCount > 0) {
            const g = ((thisMonthCount - lastMonthCount) / lastMonthCount * 100).toFixed(1)
            setGrowth(Math.abs(g))
            setIsPositive(g >= 0)
          }

          // Chart last 7 months
          const last7 = []
          for (let i = 6; i >= 0; i--) {
            const monthIndex = (now.getMonth() - i + 12) % 12
            const found = monthlyStudents.find(
              (m) => m._id?.month === monthIndex + 1
            )
            last7.push({ v: found?.total || 0 })
          }
          setChartData(last7)
        }

      } catch (error) {
        console.error('Error fetching new users:', error)
        setChartData(Array.from({ length: 7 }, () => ({ v: 0 })))
      } finally {
        setLoading(false)
      }
    }

    if (user?.id) fetchData()
  }, [user?.id])

  return (
    <div className="bg-[#ffffff] dark:bg-[#292D4A] rounded-md p-5 flex flex-col gap-3 flex-1 min-w-0">
      <div className="text-sm font-bold text-header-text">
        {isAdmin ? 'New Users' : 'New Students'}
      </div>

      {loading ? (
        <div className="w-6 h-6 border-2 border-teal-500 border-t-transparent rounded-full animate-spin" />
      ) : (
        <>
          <div className="text-3xl font-bold text-header-text">
            +{newUsers.toLocaleString()}
          </div>
          <div className="flex items-center gap-1.5">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
              isPositive ? 'bg-teal-500/20' : 'bg-red-400/20'
            }`}>
              {isPositive
                ? <FaArrowUp className="w-2.5 h-2.5 text-teal-500" />
                : <FaArrowDown className="w-2.5 h-2.5 text-red-400" />
              }
            </div>
            <span className={`text-sm font-semibold ${
              isPositive ? 'text-teal-500' : 'text-red-400'
            }`}>
              {isPositive ? '+' : '-'}{growth}%
            </span>
          </div>
        </>
      )}

      <ResponsiveContainer width="100%" height={70}>
        <AreaChart data={chartData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="tealGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#14B8A6" stopOpacity={0.5} />
              <stop offset="100%" stopColor="#14B8A6" stopOpacity={0} />
            </linearGradient>
          </defs>
          <Area
            type="monotone"
            dataKey="v"
            stroke="#14B8A6"
            strokeWidth={2.5}
            fill="url(#tealGrad)"
            dot={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}