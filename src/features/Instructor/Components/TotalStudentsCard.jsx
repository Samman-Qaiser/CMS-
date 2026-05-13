// TotalStudentsCard.jsx
import { AreaChart, Area, ResponsiveContainer, Tooltip } from 'recharts'
import { FaUserFriends } from 'react-icons/fa'

const data = [
  { v: 30 }, { v: 55 }, { v: 20 }, { v: 60 }, { v: 35 }, { v: 70 }, { v: 40 },
]

export default function TotalStudentsCard() {
  return (
    <div className="bg-teal-500 rounded-md p-5 flex flex-col gap-3 w-[50%]">
      <div className="w-12 h-12 rounded-md bg-white/20 flex items-center justify-center">
        <FaUserFriends className="w-6 h-6 text-white" />
      </div>
      <div>
        <div className="text-2xl font-bold text-white">43.322</div>
        <div className="text-sm text-white/80">Total Students</div>
      </div>
      <ResponsiveContainer width="100%" height={60}>
        <AreaChart data={data} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="whiteGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ffffff" stopOpacity={0.4} />
              <stop offset="100%" stopColor="#ffffff" stopOpacity={0} />
            </linearGradient>
          </defs>
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
