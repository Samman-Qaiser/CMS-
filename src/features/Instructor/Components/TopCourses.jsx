import { ResponsiveContainer, BarChart, Bar, Cell } from 'recharts'
import { FaBookOpen } from 'react-icons/fa'

const COLORS = ['#14B8A6', '#FBBF24', '#F87171', '#818CF8', '#FB923C']

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

export default function TopCourses({ topCourses = [] }) {
  return (
    <div className="bg-[#ffffff] w-[90%] dark:bg-[#292D4A] rounded-md p-5 flex flex-col gap-4">
      <span className="text-sm font-bold text-header-text">Top Courses</span>

      {topCourses.length === 0 ? (
        <p className="text-content-text text-xs">No courses yet</p>
      ) : (
        <div className="flex flex-col gap-3">
          {topCourses.slice(0, 3).map((course, index) => {
            const color = COLORS[index % COLORS.length]
            const chartData = [
              { v: 6 }, { v: 9 }, { v: 5 },
              { v: 11 }, { v: 8 },
              { v: course.totalStudents > 0 ? 13 : 0 }
            ]
            return (
              <div
                key={course._id}
                className="flex items-center gap-3 p-3 rounded-md bg-gray-50 dark:bg-white/5"
              >
                <div className="w-10 h-10 rounded-md bg-primary/10 flex items-center justify-center shrink-0">
                  <FaBookOpen className="w-4 h-4 text-primary" />
                </div>
                <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                  <span className="text-xs font-semibold text-header-text truncate">
                    {course.title}
                  </span>
                  <span className="text-base font-bold text-header-text">
                    {course.totalStudents?.toLocaleString() || 0}
                  </span>
                </div>
                <SparkBars data={chartData} color={color} />
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}