// NewUsersCard.jsx
import { AreaChart, Area, ResponsiveContainer } from 'recharts'
import { FaArrowUp } from 'react-icons/fa'

const data = [
  { v: 10 }, { v: 40 }, { v: 25 }, { v: 60 }, { v: 30 }, { v: 20 }, { v: 50 },
]

export default function NewUsersCard() {
  return (
    <div className="bg-[#ffffff] dark:bg-[#292D4A] rounded-md p-5 flex flex-col gap-3 flex-1 min-w-0">
      <div className="text-sm font-bold text-header-text">New Users</div>
      <div className="text-3xl font-bold text-header-text">+12.890</div>
      <div className="flex items-center gap-1.5">
        <div className="w-6 h-6 rounded-full bg-teal-500/20 flex items-center justify-center">
          <FaArrowUp className="w-2.5 h-2.5 text-teal-500" />
        </div>
        <span className="text-sm font-semibold text-teal-500">+15%</span>
      </div>
      <ResponsiveContainer width="100%" height={70}>
        <AreaChart data={data} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
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
