// EarningsBarChart.jsx
import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid
} from 'recharts'
import { FaArrowUp } from 'react-icons/fa'

const data = [
  { month: 'Jan', thisMonth: 30,  lastMonth: 20 },
  { month: 'Feb', thisMonth: 115, lastMonth: 35 },
  { month: 'Mar', thisMonth: 40,  lastMonth: 30 },
  { month: 'Apr', thisMonth: 45,  lastMonth: 25 },
  { month: 'May', thisMonth: 60,  lastMonth: 55 },
  { month: 'Jun', thisMonth: 75,  lastMonth: 60 },
  { month: 'Jul', thisMonth: 85,  lastMonth: 70 },
  { month: 'Aug', thisMonth: 90,  lastMonth: 75 },
  { month: 'Sep', thisMonth: 88,  lastMonth: 65 },
  { month: 'Oct', thisMonth: 50,  lastMonth: 40 },
  { month: 'Nov', thisMonth: 60,  lastMonth: 45 },
  { month: 'Dec', thisMonth: 65,  lastMonth: 50 },
]

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-[#1a1f3a] rounded-xl shadow-xl px-3 py-2.5 flex flex-col gap-1.5 border border-white/10 min-w-[140px]">
      <span className="text-xs font-bold text-white">{label}</span>
      {payload.map((p) => (
        <div key={p.dataKey} className="flex items-center gap-2 text-xs">
          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: p.fill }} />
          <span className="text-gray-400">{p.name}:</span>
          <span className="font-bold text-white">{p.value}</span>
        </div>
      ))}
    </div>
  )
}

export default function EarningsBarChart() {
  return (
    <div className="bg-[#ffffff] dark:bg-[#292D4A] rounded-md p-5 flex flex-col gap-4">
      {/* Top row */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-1">
          <span className="text-base font-bold text-header-text">Earnings</span>
          <span className="text-xs text-content-text">Dec 1 – Dec 31, 2021</span>
        </div>
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={300 }>
        <BarChart data={data} barCategoryGap="10%" barSize={40} barGap={10}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(100,100,150,0.12)" vertical={false} />
          <XAxis
            dataKey="month"
            tick={{ fill: 'var(--content-text)', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: 'var(--content-text)', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            ticks={[0, 30, 60, 90, 120]}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
          <Bar dataKey="thisMonth" name="This Month" fill="#14B8A6" radius={[3, 3, 0, 0]} />
          <Bar dataKey="lastMonth" name="Last Month"  fill="#FBBF24" radius={[3, 3, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>

      {/* Bottom stat */}
      <div className="flex flex-col gap-1">
        <span className="text-xs text-content-text">This Month</span>
        <span className="text-2xl font-bold text-header-text">$53.678</span>
        <div className="flex items-center gap-1.5">
          <div className="w-5 h-5 rounded-full bg-teal-500/20 flex items-center justify-center">
            <FaArrowUp className="w-2.5 h-2.5 text-teal-500" />
          </div>
          <span className="text-xs font-semibold text-teal-500">+15%</span>
        </div>
      </div>
    </div>
  )
}
