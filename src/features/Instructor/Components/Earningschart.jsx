import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from 'recharts'
import { FaArrowUp } from 'react-icons/fa'

const data = [
  { month: 'Jan', v: 20000 },
  { month: 'Feb', v: 35000 },
  { month: 'Mar', v: 28000 },
  { month: 'Apr', v: 45000 },
  { month: 'May', v: 38000 },
  { month: 'Jun', v: 52000 },
  { month: 'Jul', v: 41000 },
  { month: 'Aug', v: 48000 },
  { month: 'Sep', v: 44000 },
  { month: 'Oct', v: 55000 },
  { month: 'Nov', v: 45741 },
]

export default function EarningsChart() {
  return (
    <div className="bg-[#ffffff] dark:bg-[#292D4A] rounded-md p-5 flex flex-col gap-4">
      <h3 className="text-base font-bold text-header-text">Earnings</h3>

      <ResponsiveContainer width="100%" height={160}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
          <XAxis
            dataKey="month"
            tick={{ fill: 'var(--content-text)', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis hide />
          <Tooltip
            contentStyle={{ background: 'var(--sidebar-bg)', border: 'none', borderRadius: 8, fontSize: 12 }}
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
        <span className="text-2xl font-bold text-header-text">$45,741</span>
        <div className="flex items-center gap-1 bg-primary/10 rounded-full px-2.5 py-1">
          <FaArrowUp className="w-2.5 h-2.5 text-primary" />
          <span className="text-xs font-semibold text-primary">+10%</span>
        </div>
      </div>
    </div>
  )
}