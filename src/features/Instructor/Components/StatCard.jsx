// StatCard.jsx — reusable stat card with icon, value, label, and ring loader
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'

// Mini donut ring to show progress
function MiniRing({ color = '#ffffff' }) {
  const data = [{ v: 70 }, { v: 30 }]
  return (
    <div className="w-16 h-16 shrink-0">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={16}
            outerRadius={26}
            startAngle={90}
            endAngle={-270}
            dataKey="v"
            strokeWidth={0}
          >
            <Cell fill={color} fillOpacity={0.9} />
            <Cell fill={color} fillOpacity={0.25} />
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}

export default function StatCard({ icon: Icon, value, label, bgClass, ringColor = '#ffffff' }) {
  return (
    <div className={`${bgClass} w-[100%] rounded-md px-4 py-6 flex items-center justify-between gap-4`}>
      <div className="flex items-center gap-4">
        {/* Icon box */}
        <div className="w-11 h-11 rounded-md bg-white/20 flex items-center justify-center shrink-0">
          <Icon className="w-5 h-5 text-white" />
        </div>
        <div className="flex flex-col gap-0.5">
          <span className="text-xl font-bold text-white">{value}</span>
          <span className="text-xs text-white/80">{label}</span>
        </div>
      </div>
      <MiniRing color={ringColor} />
    </div>
  )
}
