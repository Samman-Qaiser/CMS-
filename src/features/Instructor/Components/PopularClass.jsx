import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'
import { BsThreeDots } from 'react-icons/bs'

const COLORS = ['#FBBF24', '#F87171', '#14B8A6', '#818CF8', '#FB923C']

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null
  const d = payload[0]
  return (
    <div className="bg-white dark:bg-[#292D4A] rounded-xl shadow-xl px-3 py-2 border border-gray-100 dark:border-white/10 text-xs">
      <span className="font-bold text-header-text">{d.name}: </span>
      <span className="text-content-text">{d.value} students</span>
    </div>
  )
}

export default function PopularClass({ popularCourses = [] }) {
  // Courses ko pie data mein convert karo
  const DATA = popularCourses.slice(0, 5).map((course, i) => ({
    name: course.title,
    value: course.totalStudents || 0,
    color: COLORS[i % COLORS.length],
  }))

  // Agar data nahi hai
  const chartData = DATA.length > 0 ? DATA : [
    { name: 'No Data', value: 1, color: '#e5e7eb' }
  ]

  return (
    <div className="bg-[#ffffff] w-[90%] dark:bg-[#292D4A] rounded-md p-5 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <span className="font-bold text-header-text">Popular Class</span>
        <button className="text-content-text hover:text-header-text transition-colors">
          <BsThreeDots className="w-4 h-4" />
        </button>
      </div>

      <div className="flex justify-center">
        <div className="w-40 h-40">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={48}
                outerRadius={68}
                dataKey="value"
                startAngle={90}
                endAngle={-270}
                paddingAngle={2}
                strokeWidth={0}
              >
                {chartData.map((d, i) => (
                  <Cell key={i} fill={d.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="flex flex-col gap-2.5">
        {DATA.map((d) => (
          <div key={d.name} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: d.color }} />
              <span className="text-xs text-content-text truncate max-w-[120px]">
                {d.name}
              </span>
            </div>
            <span className="text-xs font-bold text-header-text">
              {d.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}