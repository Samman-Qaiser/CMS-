// EarningCoursesDonut.jsx
import { useMemo } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { useTransactions } from "../context/TransactionContext";

const COLORS = ["#FBBF24", "#F87171", "#14B8A6", "#60A5FA", "#A78BFA"];

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const d = payload[0];
  return (
    <div className="bg-[#1a1f3a] rounded-xl shadow-xl px-3 py-2 border border-white/10 text-xs">
      <span className="font-bold text-white">{d.name}: </span>
      <span className="text-gray-300">${d.value.toLocaleString()}</span>
    </div>
  );
};

export default function EarningCoursesDonut() {
  const { transactions, loading } = useTransactions();

  const { chartData, totalEarnings } = useMemo(() => {
    // Filter only completed transactions for earnings calculation
    const completedTransactions = transactions.filter(t => t.status === 'completed');
    
    const grouped = completedTransactions.reduce((acc, t) => {
      const title = t.course?.title || "Unknown";
      acc[title] = (acc[title] || 0) + t.amount;
      return acc;
    }, {});

    const formattedData = Object.entries(grouped).map(
      ([name, value], i) => ({
        name,
        value,
        color: COLORS[i % COLORS.length],
      }),
    );

    const total = completedTransactions.reduce((sum, t) => sum + t.amount, 0);

    return { chartData: formattedData, totalEarnings: total };
  }, [transactions]);

  return (
    <div className="bg-[#ffffff] dark:bg-[#292D4A] rounded-md p-5 flex flex-col gap-4">
      <div className="flex flex-col gap-0.5">
        <span className="text-sm font-bold text-header-text">
          Earning Courses
        </span>
        <span className="text-xs text-content-text">All Time</span>
        <span className="text-2xl font-bold text-header-text mt-1">
          {loading ? "..." : `$${totalEarnings.toLocaleString()}`}
        </span>
      </div>

      <div className="flex justify-center items-center h-44">
        {loading ? (
          <span className="text-xs text-content-text">Loading chart...</span>
        ) : (
          <div className="w-44 h-44">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={52}
                  outerRadius={76}
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
        )}
      </div>

      <div className="flex flex-col gap-2.5">
        {loading ? (
          <div className="text-xs text-content-text text-center">
            Loading list...
          </div>
        ) : (
          chartData.map((d, i) => (
            <div key={i} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span
                  className="w-3 h-3 rounded-full shrink-0"
                  style={{ backgroundColor: d.color }}
                />
                <span className="text-xs text-content-text">{d.name}</span>
              </div>
              <span className="text-xs font-bold text-header-text">
                ${d.value}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}