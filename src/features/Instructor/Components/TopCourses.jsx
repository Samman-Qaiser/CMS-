// TopCourses.jsx
import { BarChart, Bar, ResponsiveContainer, Cell } from 'recharts'
import { FaBookOpen, FaStickyNote } from 'react-icons/fa'

// Tiny sparkbar for each course
function SparkBars({ data, color }) {
  return (
    <div className="w-16 h-8">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} barCategoryGap="20%">
          <Bar dataKey="v" radius={[2, 2, 0, 0]}>
            {data.map((_, i) => (
              <Cell key={i} fill={i === data.length - 1 ? color : color + '60'} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

// Mini line-like bars for second course
function SparkLines({ color }) {
  return (
    <div className="flex flex-col gap-1 justify-center">
      {[100, 60, 80].map((w, i) => (
        <div
          key={i}
          className="h-1 rounded-full"
          style={{ width: `${w}%`, maxWidth: 48, backgroundColor: color }}
        />
      ))}
    </div>
  )
}

const COURSES = [
  {
    id: 1,
    icon: FaBookOpen,
    iconBg: 'bg-teal-500/15',
    iconColor: 'text-teal-500',
    title: 'UI Design',
    count: '12,345',
    chart: 'bars',
    chartColor: '#14B8A6',
    chartData: [{ v: 6 }, { v: 9 }, { v: 5 }, { v: 11 }, { v: 8 }, { v: 13 }],
  },
  {
    id: 2,
    icon: FaStickyNote,
    iconBg: 'bg-yellow-400/15',
    iconColor: 'text-yellow-500',
    title: 'UI Design',
    count: '12,345',
    chart: 'lines',
    chartColor: '#FBBF24',
  },
]

export default function TopCourses() {
  return (
    <div className="bg-[#ffffff] dark:bg-[#292D4A] rounded-md p-5 flex flex-col gap-4">
      <span className="text-sm font-bold text-header-text">Top Courses</span>

      <div className="flex flex-col gap-3">
        {COURSES.map((c) => {
          const Icon = c.icon
          return (
            <div
              key={c.id}
              className="flex items-center gap-3 p-3 rounded-md bg-gray-50 dark:bg-white/5"
            >
              <div className={`w-10 h-10 rounded-md ${c.iconBg} flex items-center justify-center shrink-0`}>
                <Icon className={`w-4 h-4 ${c.iconColor}`} />
              </div>
              <div className="flex flex-col gap-0.5 flex-1">
                <span className="text-xs font-semibold text-header-text">{c.title}</span>
                <span className="text-base font-bold text-header-text">{c.count}</span>
              </div>
              {c.chart === 'bars'
                ? <SparkBars data={c.chartData} color={c.chartColor} />
                : <SparkLines color={c.chartColor} />
              }
            </div>
          )
        })}
      </div>
    </div>
  )
}
