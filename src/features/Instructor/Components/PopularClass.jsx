// PopularClass.jsx
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'
import { BsThreeDots } from 'react-icons/bs'

const DATA = [
  { name: 'Design',      value: 27, color: '#FBBF24' },
  { name: 'Programming', value: 50, color: '#F87171' },
  { name: 'Science',     value: 23, color: '#14B8A6' },
]

const COUNT = 763

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null
  const d = payload[0]
  return (
    <div className="bg-white dark:bg-[#292D4A] rounded-xl shadow-xl px-3 py-2 border border-gray-100 dark:border-white/10 text-xs">
      <span className="font-bold text-header-text">{d.name}: </span>
      <span className="text-content-text">{d.value}%</span>
    </div>
  )
}

export default function PopularClass() {
  return (
    <div className="bg-[#ffffff] dark:bg-[#292D4A] rounded-md p-5 flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <span className="font-bold text-header-text">Popular Class</span>
        <button className="text-content-text hover:text-header-text transition-colors duration-200">
          <BsThreeDots className="w-4 h-4" />
        </button>
      </div>

      {/* Donut */}
      <div className="flex justify-center">
        <div className="w-40 h-40">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={DATA}
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
                {DATA.map((d, i) => (
                  <Cell key={i} fill={d.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-col gap-2.5">
        {DATA.map((d) => (
          <div key={d.name} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: d.color }} />
              <span className="text-xs text-content-text">
                {d.name} ({d.value}%)
              </span>
            </div>
            <span className="text-xs font-bold text-header-text">{COUNT}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
