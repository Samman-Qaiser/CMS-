import { MoreHorizontal } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
const ScoreActivity = () => {
  const data = [
    { name: 'Mon', thisMonth: 70, lastMonth: 40 },
    { name: 'Tue', thisMonth: 20, lastMonth: 55 },
    { name: 'Wed', thisMonth: 60, lastMonth: 50 },
    { name: 'Thu', thisMonth: 30, lastMonth: 40 },
    { name: 'Fri', thisMonth: 20, lastMonth: 75 },
    { name: 'Sat', thisMonth: 70, lastMonth: 80 },
    { name: 'Sun', thisMonth: 60, lastMonth: 90 },
  ];

  return (
    <div className="bg-white dark:bg-[#292D4A] p-6 rounded-lg shadow-sm mt-6">
      <div className="flex justify-between items-center mb-8">
        <h3 className="font-bold text-header-text">Score Activity</h3>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-xs text-sidebar-text">
            <span className="w-3 h-3 rounded-full border-2 border-orange-400"></span> This Month
          </div>
          <div className="flex items-center gap-2 text-xs text-sidebar-text">
            <span className="w-3 h-3 rounded-full border-2 border-blue-600"></span> Last Month
          </div>
          <select className="bg-headerbg/20 text-xs p-2 rounded-lg outline-none dark:text-white">
            <option>This Month</option>
          </select>
          <MoreHorizontal size={18} className="text-sidebar-text" />
        </div>
      </div>
      <div className="h-[250px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorThis" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f87171" stopOpacity={0.1}/>
                <stop offset="95%" stopColor="#f87171" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorLast" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#4cbc9a" stopOpacity={0.1}/>
                <stop offset="95%" stopColor="#4cbc9a" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.1} />
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#828690'}} />
            <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#828690'}} />
            <Tooltip />
            <Area type="monotone" dataKey="thisMonth" stroke="#f87171" strokeWidth={3} fillOpacity={1} fill="url(#colorThis)" />
            <Area type="monotone" dataKey="lastMonth" stroke="#4cbc9a" strokeWidth={3} fillOpacity={1} fill="url(#colorLast)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
export default ScoreActivity;