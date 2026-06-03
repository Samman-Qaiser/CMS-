import { useMemo } from "react";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";
import { useTransactions } from "../context/TransactionContext";

export default function TotalOrderCard() {
  const { transactions, loading } = useTransactions();

  const { total, percentage, isPositive, thisMonth, lastMonth } =
    useMemo(() => {
      const now = new Date();
      const currentYear = now.getFullYear();
      const currentMonth = now.getMonth();

      // Filter only completed transactions
      const completed = transactions.filter((t) => t.status === "completed");
      const totalCompleted = completed.length;

      // Calculate this month's completed orders
      const currentMonthOrders = completed.filter((t) => {
        const d = new Date(t.createdAt);
        return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
      }).length;

      // Calculate last month's completed orders
      let previousMonthOrders;
      if (currentMonth === 0) {
        previousMonthOrders = completed.filter((t) => {
          const d = new Date(t.createdAt);
          return d.getMonth() === 11 && d.getFullYear() === currentYear - 1;
        }).length;
      } else {
        previousMonthOrders = completed.filter((t) => {
          const d = new Date(t.createdAt);
          return (
            d.getMonth() === currentMonth - 1 && d.getFullYear() === currentYear
          );
        }).length;
      }

      // Calculate growth percentage without unnecessary assignments
      let growthPercentage;
      let isGrowthPositive;

      if (previousMonthOrders === 0 && currentMonthOrders === 0) {
        growthPercentage = 0;
        isGrowthPositive = true;
      } else if (previousMonthOrders === 0 && currentMonthOrders > 0) {
        growthPercentage = 100;
        isGrowthPositive = true;
      } else if (previousMonthOrders > 0 && currentMonthOrders === 0) {
        growthPercentage = 100;
        isGrowthPositive = false;
      } else {
        const growth =
          ((currentMonthOrders - previousMonthOrders) / previousMonthOrders) *
          100;
        isGrowthPositive = growth >= 0;
        growthPercentage = Math.abs(Math.round(growth));
      }

      return {
        total: totalCompleted,
        percentage: growthPercentage,
        isPositive: isGrowthPositive,
        thisMonth: currentMonthOrders,
        lastMonth: previousMonthOrders,
      };
    }, [transactions]);

  return (
    <div className="bg-[#ffffff] dark:bg-[#292D4A] rounded-md p-5 flex flex-col gap-3">
      <span className="text-sm text-content-text">Total Completed Orders</span>
      <div className="flex items-center gap-3">
        <span className="text-3xl font-bold text-header-text">
          {loading ? "..." : total.toLocaleString()}
        </span>

        {/* Always show badge if there's growth or new orders */}
        {!loading && (percentage > 0 || (thisMonth > 0 && lastMonth === 0)) && (
          <div
            className={`flex items-center gap-1 rounded-full px-2.5 py-1 ${
              isPositive ? "bg-teal-500/15" : "bg-red-500/15"
            }`}
          >
            {isPositive ? (
              <FaArrowUp className="w-2.5 h-2.5 text-teal-500" />
            ) : (
              <FaArrowDown className="w-2.5 h-2.5 text-red-500" />
            )}
            <span
              className={`text-xs font-semibold ${
                isPositive ? "text-teal-500" : "text-red-500"
              }`}
            >
              {percentage}%
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
