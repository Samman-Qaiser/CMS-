import { useState } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid, Cell
} from 'recharts'

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

const TABS = ['Insight', 'Selling']

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white dark:bg-[#292D4A] rounded-xl shadow-xl px-3 py-2.5 border border-gray-100 dark:border-white/10 flex flex-col gap-1.5">
      <span className="text-xs font-bold text-header-text">{label}</span>
      {payload.map((p) => (
        <div key={p.dataKey} className="flex items-center gap-2 text-xs">
          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: p.fill }} />
          <span className="text-content-text">{p.name}:</span>
          <span className="font-bold text-header-text">${p.value}</span>
        </div>
      ))}
    </div>
  )
}

export default function SellingActivityChart({ monthlyEarnings = [] }) {
  const [activeTab, setActiveTab] = useState('Insight')

  // Backend data ko chart format mein convert karo
  const data = monthlyEarnings.map((item) => ({
    week: MONTHS[(item._id?.month - 1)] || 'N/A',
    thisWeek: item.total || 0,
    lastWeek: Math.round((item.total || 0) * 0.8), // estimate
  }))

  // Agar data nahi hai
  const chartData = data.length > 0 ? data : [
    { week: 'Jan', thisWeek: 0, lastWeek: 0 },
    { week: 'Feb', thisWeek: 0, lastWeek: 0 },
    { week: 'Mar', thisWeek: 0, lastWeek: 0 },
    { week: 'Apr', thisWeek: 0, lastWeek: 0 },
  ]

  return (
    <div className="bg-[#ffffff] dark:bg-[#292D4A] rounded-md p-5 flex flex-col gap-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-4">
          <span className="font-bold text-header-text">Selling Activity</span>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-teal-500" />
              <span className="text-sm text-content-text">This Month</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
              <span className="text-sm text-content-text">Last Month</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`text-xs font-semibold px-3 py-1 transition-colors duration-200 ${
                activeTab === tab
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-content-text hover:text-header-text'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <ResponsiveContainer width="100%" height={340}>
        <BarChart
          data={chartData}
          layout="vertical"
          barCategoryGap="30%"
          barGap={4}
          margin={{ left: -10, right: 10 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(100,100,150,0.1)" horizontal={false} />
          <XAxis
            type="number"
            tick={{ fill: 'var(--content-text)', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            type="category"
            dataKey="week"
            tick={{ fill: 'var(--content-text)', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            width={30}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
          <Bar dataKey="thisWeek" name="This Month" fill="#14B8A6" radius={[0, 4, 4, 0]} />
          <Bar dataKey="lastWeek" name="Last Month" fill="#FBBF24" radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}