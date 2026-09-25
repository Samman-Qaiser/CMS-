import { useState, useEffect } from 'react'
import {
  LineChart, Line, Tooltip, ResponsiveContainer
} from 'recharts'
import axios from 'axios'
import { useSelector } from 'react-redux'

const baseUrl =
  import.meta.env?.VITE_BACKEND_URL ||
  "https://cms-backend-ashen.vercel.app";

export default function CoursesChart() {
  const [chartData, setChartData] = useState([])
  const [totalCourses, setTotalCourses] = useState(0)
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

        setTotalCourses(statsData.stats.totalCourses || 0)

        // ✅ Courses data from popular courses
        const popularCourses = statsData.popularCourses || []

        // Chart ke liye enrollment trend banao
        const chartPoints = popularCourses.map((course, i) => ({
          v: course.totalStudents || 0,
          name: course.title,
        }))

        // Agar data kam hai toh padding karo
        while (chartPoints.length < 10) {
          chartPoints.unshift({ v: 0, name: '' })
        }

        setChartData(chartPoints)

        // ✅ Growth — monthly earnings se calculate
        const monthly = statsData.monthlyEarnings || []
        if (monthly.length >= 2) {
          const last = monthly[monthly.length - 1]?.total || 0
          const prev = monthly[monthly.length - 2]?.total || 0
          if (prev > 0) {
            const growth = ((last - prev) / prev * 100).toFixed(1)
            setGrowthPercent(growth)
          }
        }

      } catch (error) {
        console.error('Error fetching courses chart:', error)
        setChartData(
          Array.from({ length: 10 }, () => ({ v: 0 }))
        )
      } finally {
        setLoading(false)
      }
    }

    if (user?.id) fetchData()
  }, [user?.id])

  if (loading) {
    return (
      <div className="bg-[#ffffff] w-full dark:bg-[#292D4A] rounded-md p-5 flex flex-col gap-4">
        <h3 className="text-base font-bold text-header-text">Courses</h3>
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      </div>
    )
  }

  return (
    <div className="bg-[#ffffff] w-full dark:bg-[#292D4A] rounded-md p-5 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-bold text-header-text">Courses</h3>
        <div className="flex items-center gap-2 bg-primary/10 rounded-md px-3 py-1.5">
          <span className="text-lg font-bold text-primary">
            {totalCourses}
          </span>
          <span className="text-xs text-header-text">
            {growthPercent >= 0 ? '+' : ''}{growthPercent}% than last month
          </span>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={100}>
        <LineChart data={chartData}>
          <Tooltip
            contentStyle={{
              background: 'var(--sidebar-bg)',
              border: 'none',
              borderRadius: 8,
              fontSize: 12,
            }}
            labelStyle={{ color: 'var(--header-text)' }}
            formatter={(v, name, props) => [
              v,
              props.payload?.name || 'Students'
            ]}
            itemStyle={{ color: 'var(--content-text)' }}
          />
          <Line
            type="monotone"
            dataKey="v"
            stroke="#F97316"
            strokeWidth={2.5}
            dot={false}
            activeDot={{ r: 5, fill: '#F97316' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}