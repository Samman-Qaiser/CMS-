import { useState, useEffect } from 'react'
import {
  LineChart, Line, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid
} from 'recharts'
import { FaArrowUp, FaArrowDown } from 'react-icons/fa'
import axios from 'axios'
import { useSelector } from 'react-redux'

const baseUrl =
  import.meta.env?.VITE_BACKEND_URL ||
  "https://cms-backend-ashen.vercel.app";

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

export default function EarningsChart() {
  const [chartData, setChartData] = useState([])
  const [totalEarnings, setTotalEarnings] = useState(0)
  const [growthPercent, setGrowthPercent] = useState(0)
  const [isPositive, setIsPositive] = useState(true)
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

        setTotalEarnings(statsData.stats.totalEarnings || 0)

        // ✅ Monthly earnings chart data
        const monthlyEarnings = statsData.monthlyEarnings || []

        // ✅ Current month + last 11 months = 12 months
        const currentMonth = new Date().getMonth()

        const last12Months = []
        for (let i = 11; i >= 0; i--) {
          const monthIndex = (currentMonth - i + 12) % 12
          last12Months.push({
            monthIndex: monthIndex + 1,
            label: MONTHS[monthIndex],
          })
        }

        const chartMonths = last12Months.map(({ monthIndex, label }) => {
          const found = monthlyEarnings.find(
            (m) => m._id?.month === monthIndex &&
                   m._id?.year === new Date().getFullYear()
          )
          return {
            month: label,
            v: found?.total || 0,
          }
        })

        setChartData(chartMonths)

        // ✅ Growth calculate karo
        if (monthlyEarnings.length >= 2) {
          const lastMonth = monthlyEarnings[monthlyEarnings.length - 1]?.total || 0
          const prevMonth = monthlyEarnings[monthlyEarnings.length - 2]?.total || 0
          if (prevMonth > 0) {
            const growth = ((lastMonth - prevMonth) / prevMonth * 100).toFixed(1)
            setGrowthPercent(Math.abs(growth))
            setIsPositive(growth >= 0)
          }
        }

      } catch (error) {
        console.error('Error fetching earnings:', error)
        // Fallback
        const currentMonth = new Date().getMonth()
        const fallback = []
        for (let i = 11; i >= 0; i--) {
          const monthIndex = (currentMonth - i + 12) % 12
          fallback.push({ month: MONTHS[monthIndex], v: 0 })
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
      <div className="bg-[#ffffff] dark:bg-[#292D4A] rounded-md p-5 flex flex-col gap-4">
        <h3 className="text-base font-bold text-header-text">Earnings</h3>
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      </div>
    )
  }

  return (
    <div className="bg-[#ffffff] dark:bg-[#292D4A] rounded-md p-5 flex flex-col gap-4">
      <h3 className="text-base font-bold text-header-text">Earnings</h3>

      <ResponsiveContainer width="100%" height={160}>
        <LineChart data={chartData}>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="rgba(255,255,255,0.05)"
            vertical={false}
          />
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
            formatter={(v) => [`$${v.toLocaleString()}`, 'Earnings']}
            itemStyle={{ color: 'var(--content-text)' }}
          />
          <Line
            type="monotone"
            dataKey="v"
            stroke="#14B8A6"
            strokeWidth={2.5}
            dot={false}
            activeDot={{ r: 5, fill: '#14B8A6' }}
          />
        </LineChart>
      </ResponsiveContainer>

      <div className="flex items-center gap-3">
        <span className="text-2xl font-bold text-header-text">
          ${totalEarnings.toLocaleString()}
        </span>
        {growthPercent > 0 && (
          <div className={`flex items-center gap-1 rounded-full px-2.5 py-1 ${
            isPositive ? 'bg-primary/10' : 'bg-red-100'
          }`}>
            {isPositive
              ? <FaArrowUp className="w-2.5 h-2.5 text-primary" />
              : <FaArrowDown className="w-2.5 h-2.5 text-red-500" />
            }
            <span className={`text-xs font-semibold ${
              isPositive ? 'text-primary' : 'text-red-500'
            }`}>
              {isPositive ? '+' : '-'}{growthPercent}%
            </span>
          </div>
        )}
      </div>
    </div>
  )
}