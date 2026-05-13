import {
  LineChart, Line, Tooltip, ResponsiveContainer
} from 'recharts'

const data = [
  { v: 30 }, { v: 55 }, { v: 40 }, { v: 70 }, { v: 45 },
  { v: 80 }, { v: 60 }, { v: 90 }, { v: 50 }, { v: 75 },
]

export default function CoursesChart() {
  return (
    <div className="bg-[#ffffff] w-[100%] dark:bg-[#292D4A] rounded-md p-5 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-bold text-header-text">Courses</h3>
        <div className="flex items-center gap-2 bg-primary/10 rounded-md px-3 py-1.5">
          <span className="text-lg font-bold text-primary">100</span>
          <span className="text-xs text-header-text">+19% than last year</span>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={100}>
        <LineChart data={data}>
          <Tooltip
            contentStyle={{ background: 'var(--sidebar-bg)', border: 'none', borderRadius: 8, fontSize: 12 }}
            labelStyle={{ color: 'var(--header-text)' }}
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