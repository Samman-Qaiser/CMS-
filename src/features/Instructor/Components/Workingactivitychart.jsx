import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid, Cell
} from 'recharts'
import { FaChartLine } from 'react-icons/fa'
import { useState } from 'react'

const data = [
  { month: 'Jan', sent: 38,  answered: 50, hired: 27 },
  { month: 'Feb', sent: 48,  answered: 50, hired: 24 },
  { month: 'Mar', sent: 10,  answered: 35, hired: 48 },
  { month: 'Apr', sent: 45,  answered: 8,  hired: 40 },
  { month: 'May', sent: 45,  answered: 8,  hired: 48 },
  { month: 'Jun', sent: 70,  answered: 25, hired: 30 },
  { month: 'Jul', sent: 70,  answered: 5,  hired: 55 },
  { month: 'Aug', sent: 35,  answered: 55, hired: 40 },
  { month: 'Sep', sent: 48,  answered: 28, hired: 45 },
  { month: 'Oct', sent: 35,  answered: 40, hired: 12 },
  { month: 'Nov', sent: 35,  answered: 15, hired: 37 },
  { month: 'Dec', sent: 10,  answered: 48, hired: 63 },
]

const LEGEND = [
  { key: 'hired',    label: 'Hired',               color: '#C4C9E2' },
  { key: 'answered', label: 'Application Answered', color: '#F97316' },
  { key: 'sent',     label: 'Application Sent',     color: '#FBBF24' },
]

// Tooltip — shows only the hovered segment's name + value
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null

  // recharts sends all segments in payload; find the one that was hovered
  // We use the activeBar state passed via a trick — instead, show all but styled like image
  // Image shows only 1 item per tooltip at a time depending on which chunk is hovered
  // recharts stacked tooltip always gives all — we pick the last focused one
  const item = payload[payload.length - 1]

  return (
    <div className="rounded-xl shadow-xl px-4 py-3 flex flex-col gap-2 min-w-[200px]"
      style={{ background: 'rgba(240,242,250,0.97)', backdropFilter: 'blur(8px)' }}
    >
      <span className="text-sm font-semibold text-gray-600">{label}</span>
      <div className="flex items-center gap-2.5">
        <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: item.fill }} />
        <span className="text-sm text-gray-500">{item.name}:</span>
        <span className="text-sm font-bold text-gray-800 ml-auto pl-4">{item.value}</span>
      </div>
    </div>
  )
}

export default function WorkingActivityChart() {
  const [activeBar, setActiveBar] = useState(null) // { dataKey, index }

  const totalHired    = data.reduce((s, d) => s + d.hired, 0)
  const totalAnswered = data.reduce((s, d) => s + d.answered, 0)

  // Returns fill with dimming when another segment is hovered
  const getFill = (dataKey, index, baseColor) => {
    if (!activeBar) return baseColor
    if (activeBar.dataKey === dataKey && activeBar.index === index) return baseColor
    // Dim other segments
    return baseColor + '55'
  }

  return (
    <div className="bg-[#ffffff] dark:bg-[#292D4A] rounded-md p-5 flex flex-col gap-5">

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h3 className="text-base font-bold text-header-text">Working Activity</h3>
        <div className="flex items-center gap-6 flex-wrap">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-teal-500/20 flex items-center justify-center">
              <FaChartLine className="w-3.5 h-3.5 text-teal-400" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] text-content-text">Performance</span>
              <span className="text-sm font-bold text-header-text">{totalHired.toLocaleString()}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-primary/20 flex items-center justify-center">
              <FaChartLine className="w-3.5 h-3.5 text-primary" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] text-content-text">Performance</span>
              <span className="text-sm font-bold text-header-text">{totalAnswered.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-5 flex-wrap">
        {LEGEND.map((l) => (
          <div key={l.key} className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: l.color }} />
            <span className="text-xs text-content-text">{l.label}</span>
          </div>
        ))}
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={240}>
        <BarChart
          data={data}
          barCategoryGap="40%"
          barSize={28}
          onMouseLeave={() => setActiveBar(null)}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(100,100,150,0.15)" vertical={false} />
          <XAxis
            dataKey="month"
            tick={{ fill: 'var(--content-text)', fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: 'var(--content-text)', fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            ticks={[0, 40, 80, 120, 160]}
          />
          <Tooltip
            content={<CustomTooltip />}
            cursor={{ fill: 'rgba(255,255,255,0.03)' }}
          />

          {/* Bottom chunk — Application Sent (yellow) */}
          <Bar
            dataKey="sent"
            name="Application Sent"
            stackId="a"
            onMouseEnter={(_, index) => setActiveBar({ dataKey: 'sent', index })}
          >
            {data.map((_, index) => (
              <Cell key={index} fill={getFill('sent', index, '#FBBF24')} />
            ))}
          </Bar>

          {/* Middle chunk — Application Answered (orange) */}
          <Bar
            dataKey="answered"
            name="Application Answered"
            stackId="a"
            onMouseEnter={(_, index) => setActiveBar({ dataKey: 'answered', index })}
          >
            {data.map((_, index) => (
              <Cell key={index} fill={getFill('answered', index, '#F97316')} />
            ))}
          </Bar>

          {/* Top chunk — Hired (gray), rounded top */}
          <Bar
            dataKey="hired"
            name="Hired"
            stackId="a"
            radius={[4, 4, 0, 0]}
            onMouseEnter={(_, index) => setActiveBar({ dataKey: 'hired', index })}
          >
            {data.map((_, index) => (
              <Cell key={index} fill={getFill('hired', index, '#C4C9E2')} />
            ))}
          </Bar>

        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}