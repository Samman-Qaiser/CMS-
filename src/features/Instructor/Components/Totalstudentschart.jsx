import { useState, useEffect } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer
} from 'recharts'
import axios from 'axios'
import { useSelector } from 'react-redux'

const baseUrl =
  import.meta.env?.VITE_BACKEND_URL ||
  "https://cms-backend-ashen.vercel.app";

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

export default function TotalStudentsChart() {
  const [chartData, setChartData] = useState([])
  const [totalStudents, setTotalStudents] = useState(0)
  const [growthPercent, setGrowthPercent] = useState(0)
  const [loading, setLoading] = useState(true)

  const user = useSelector((state) => state.auth.user)

useEffect(() => {
  const fetchData = async () => {
    try {
      setLoading(true)

      // Instructor ID lao
      const { data: instructorData } = await axios.get(
        `${baseUrl}/api/instructors/user/${user?.id}`
      )
      const instructorId = instructorData.instructor._id

      // Stats lao
      const { data: statsData } = await axios.get(
        `${baseUrl}/api/instructors/${instructorId}/stats`
      )

      setTotalStudents(statsData.stats.totalStudents || 0)

      // ✅ Real monthly students data
      const monthlyStudents = statsData.monthlyStudents || []

      // ✅ Current month + last 5 months = 6 months
      const currentMonth = new Date().getMonth() // 0-indexed

      const last6Months = []
      for (let i = 5; i >= 0; i--) {
        const monthIndex = (currentMonth - i + 12) % 12
        last6Months.push({
          monthIndex: monthIndex + 1,
          label: MONTHS[monthIndex]
        })
      }

      const chartMonths = last6Months.map(({ monthIndex, label }) => {
        const thisYear = monthlyStudents.find(
          (m) => m._id?.month === monthIndex &&
                 m._id?.year === new Date().getFullYear()
        )
        const lastYear = monthlyStudents.find(
          (m) => m._id?.month === monthIndex &&
                 m._id?.year === new Date().getFullYear() - 1
        )
        return {
          month: label,
          a: thisYear?.total || 0,
          b: lastYear?.total || 0,
        }
      })

      setChartData(chartMonths)

      // ✅ Growth calculate karo monthly students se
      if (monthlyStudents.length >= 2) {
        const lastMonth = monthlyStudents[monthlyStudents.length - 1]?.total || 0
        const prevMonth = monthlyStudents[monthlyStudents.length - 2]?.total || 0
        if (prevMonth > 0) {
          const growth = ((lastMonth - prevMonth) / prevMonth * 100).toFixed(1)
          setGrowthPercent(growth)
        }
      }

    } catch (error) {
      console.error('Error fetching student stats:', error)
      // ✅ Fallback — sab 0
      const currentMonth = new Date().getMonth()
      const fallback = []
      for (let i = 5; i >= 0; i--) {
        const monthIndex = (currentMonth - i + 12) % 12
        fallback.push({ month: MONTHS[monthIndex], a: 0, b: 0 })
      }
      setChartData(fallback)
    } finally {
      setLoading(false)
    }
  }

  if (user?.id) fetchData()
}, [user?.id])

  if (loading) {
    return (
      <div className="bg-[#ffffff] w-full dark:bg-[#292D4A] rounded-md p-5 flex flex-col gap-4">
        <h3 className="text-base font-bold text-header-text">Total Students</h3>
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      </div>
    )
  }

  return (
    <div className="bg-[#ffffff] w-full dark:bg-[#292D4A] rounded-md p-5 flex flex-col gap-4">
      <h3 className="text-base font-bold text-header-text">Total Students</h3>

      <ResponsiveContainer width="100%" height={120}>
        <BarChart data={chartData} barCategoryGap="30%" barGap={3}>
          <XAxis
            dataKey="month"
            tick={{ fill: 'var(--content-text)', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis hide />
          <Tooltip
            contentStyle={{
              background: 'var(--sidebar-bg)',
              border: 'none',
              borderRadius: 8,
              fontSize: 12,
            }}
            labelStyle={{ color: 'var(--header-text)' }}
            itemStyle={{ color: 'var(--content-text)' }}
          />
          <Bar dataKey="a" name="This Year" fill="#F97316" radius={[3, 3, 0, 0]} />
          <Bar dataKey="b" name="Last Year" fill="#14B8A6" radius={[3, 3, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>

      <div className="flex flex-col gap-0.5">
        <span className="text-2xl font-bold text-header-text">
          {totalStudents.toLocaleString()}
        </span>
        <span className="text-xs text-content-text">
          {growthPercent >= 0 ? '+' : ''}{growthPercent}% than last month
        </span>
      </div>
    </div>
  )
}