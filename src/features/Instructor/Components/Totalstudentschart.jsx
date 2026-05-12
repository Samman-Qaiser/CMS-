import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell
} from 'recharts'

const data = [
  { month: 'Jan', a: 60,  b: 90  },
  { month: 'Feb', a: 100, b: 60  },
  { month: 'Mar', a: 75,  b: 110 },
  { month: 'Apr', a: 90,  b: 80  },
  { month: 'May', a: 50,  b: 95  },
]

export default function TotalStudentsChart() {
  return (
    <div className="bg-[#ffffff] w-full dark:bg-[#292D4A] rounded-md p-5 flex flex-col gap-4">
      <h3 className="text-base font-bold text-header-text">Total Students</h3>

      <ResponsiveContainer width="100%" height={120}>
        <BarChart data={data} barCategoryGap="30%" barGap={3}>
          <XAxis dataKey="month" tick={{ fill: 'var(--content-text)', fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis hide />
          <Tooltip
            contentStyle={{ background: 'var(--sidebar-bg)', border: 'none', borderRadius: 8, fontSize: 12 }}
            labelStyle={{ color: 'var(--header-text)' }}
            itemStyle={{ color: 'var(--content-text)' }}
          />
          <Bar dataKey="a" fill="#F97316" radius={[3, 3, 0, 0]} />
          <Bar dataKey="b" fill="#14B8A6" radius={[3, 3, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>

      <div className="flex flex-col gap-0.5">
        <span className="text-2xl font-bold text-header-text">12,345</span>
        <span className="text-xs text-content-text">5.4% than last year</span>
      </div>
    </div>
  )
}