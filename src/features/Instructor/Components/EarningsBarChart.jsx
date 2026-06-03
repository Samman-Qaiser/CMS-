import { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";
import { useTransactions } from "../context/TransactionContext";

export default function EarningsBarChart() {
  const { transactions, loading } = useTransactions();

  const { data, thisMonthTotal, growth } = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    // Filter only completed transactions
    const completedTransactions = transactions.filter(
      (t) => t.status === "completed",
    );

    // Aggregate monthly data
    const monthly = Array(12)
      .fill(0)
      .map((_, i) => ({
        month: [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ][i],
        thisMonth: completedTransactions
          .filter((t) => {
            const date = new Date(t.createdAt);
            return date.getMonth() === i && date.getFullYear() === currentYear;
          })
          .reduce((sum, t) => sum + t.amount, 0),
      }));

    const currentTotal = monthly[currentMonth].thisMonth;
    const lastTotal =
      currentMonth > 0 ? monthly[currentMonth - 1].thisMonth : 0;

    const growthVal =
      lastTotal === 0
        ? currentTotal > 0
          ? 100
          : 0
        : ((currentTotal - lastTotal) / lastTotal) * 100;

    return {
      data: monthly,
      thisMonthTotal: currentTotal,
      growth: Math.round(growthVal),
    };
  }, [transactions]);

  return (
    <div className="bg-[#ffffff] dark:bg-[#292D4A] rounded-md p-5 flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <span className="text-base font-bold text-header-text">Earnings</span>
        <span className="text-xs text-content-text">
          {new Date().toLocaleString("default", { month: "long" })} 2026
        </span>
      </div>

      {/* Fixed: Added min-h-[300px] and w-full to ensure container has dimensions */}
      <div className="w-full min-h-[300px]">
        {loading ? (
          <div className="h-[300px] flex items-center justify-center">
            <span className="text-xs text-content-text">Loading chart...</span>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data} barSize={40}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(100,100,150,0.12)"
                vertical={false}
              />
              <XAxis
                dataKey="month"
                tick={{ fill: "var(--content-text)", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: "var(--content-text)", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                cursor={{ fill: "rgba(255,255,255,0.03)" }}
                formatter={(value) => [`$${value}`, "Earnings"]}
              />
              <Bar dataKey="thisMonth" fill="#14B8A6" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <span className="text-xs text-content-text">This Month</span>
        <span className="text-2xl font-bold text-header-text">
          {loading ? "..." : `$${thisMonthTotal.toLocaleString()}`}
        </span>

        {!loading && (
          <div
            className={`flex items-center gap-1.5 ${growth >= 0 ? "text-teal-500" : "text-red-500"}`}
          >
            <div
              className={`w-5 h-5 rounded-full flex items-center justify-center ${
                growth >= 0 ? "bg-teal-500/20" : "bg-red-500/20"
              }`}
            >
              {growth >= 0 ? (
                <FaArrowUp className="w-2.5 h-2.5" />
              ) : (
                <FaArrowDown className="w-2.5 h-2.5" />
              )}
            </div>
            <span className="text-xs font-semibold">{Math.abs(growth)}%</span>
          </div>
        )}
      </div>
    </div>
  );
}
