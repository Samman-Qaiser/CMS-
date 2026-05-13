// StudentsActivityChart.jsx
import {
  LineChart, Line, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid
} from 'recharts'
import { BsThreeDots } from 'react-icons/bs'

const data = [
  { day: 'Mon', present: 15, visitors: 25 },
  { day: 'Tue', present: 22, visitors: 40 },
  { day: 'Wed', present: 30, visitors: 70 },
  { day: 'Thu', present: 55, visitors: 45 },
  { day: 'Fri', present: 40, visitors: 30 },
  { day: 'Sat', present: 35, visitors: 55 },
  { day: 'Sun', present: 50, visitors: 60 },
]

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-xl shadow-2xl px-5 py-4 flex flex-col gap-2 min-w-[160px]"
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
  return (
    <div className="bg-[#ffffff] dark:bg-[#292D4A] rounded-md p-5 flex flex-col gap-4 flex-1 min-w-0">
      {/* Header */}
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
          <button className="text-content-text hover:text-header-text transition-colors duration-200">
            <BsThreeDots className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={160}>
        <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(100,100,150,0.1)" vertical={false} />
          <XAxis
            dataKey="day"
            tick={{ fill: 'var(--content-text)', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis hide />
          <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(255,255,255,0.15)', strokeDasharray: '4 4' }} />
          <Line
            type="monotoneX"
            dataKey="present"
            name="Persent"
            stroke="#14B8A6"
            strokeWidth={3}
            dot={{ r: 5, fill: '#14B8A6', strokeWidth: 0 }}
            activeDot={{ r: 7, fill: '#14B8A6', stroke: '#fff', strokeWidth: 2 }}
          />
          <Line
            type="monotoneX"
            dataKey="visitors"
            name="Visitors"
            stroke="#F87171"
            strokeWidth={3}
            dot={{ r: 5, fill: '#F87171', strokeWidth: 0 }}
            activeDot={{ r: 7, fill: '#F87171', stroke: '#fff', strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
