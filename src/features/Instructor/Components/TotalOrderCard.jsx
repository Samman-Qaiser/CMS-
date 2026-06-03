import { useMemo } from "react";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";
import { useTransactions } from "../context/TransactionContext";

export default function TotalOrderCard() {
  const { transactions, loading } = useTransactions();

  const { total, percentage, isPositive, thisMonth, lastMonth, statusCounts } =
    useMemo(() => {
      const now = new Date();
      const currentYear = now.getFullYear();
      const currentMonth = now.getMonth();

      // Calculate counts for each status
      const counts = {
        completed: 0,
        pending: 0,
        cancelled: 0,
        refunded: 0,
      };

      transactions.forEach((t) => {
        if (counts[t.status] !== undefined) {
          counts[t.status]++;
        }
      });

      // Filter only completed transactions for growth calculation
      const completed = transactions.filter((t) => t.status === "completed");
      const totalCompleted = completed.length;

      // Calculate this month's completed orders
      const currentMonthOrders = completed.filter((t) => {
        const d = new Date(t.createdAt);
        return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
      }).length;

      // Calculate last month's completed orders
      let previousMonthOrders = 0;
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

      let growthPercentage = 0;
      let isGrowthPositive = true;

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
        statusCounts: counts,
      };
    }, [transactions]);

  return (
    <div className="bg-[#ffffff] dark:bg-[#292D4A] rounded-md p-5 flex flex-col gap-4">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <span className="text-sm text-content-text">
          Total Completed Orders
        </span>
        <div className="flex items-center gap-3">
          <span className="text-3xl font-bold text-header-text">
            {loading ? "..." : total.toLocaleString()}
          </span>
          {!loading &&
            (percentage > 0 || (thisMonth > 0 && lastMonth === 0)) && (
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

      {/* Status Breakdown Section */}
      <div className="grid grid-cols-3 gap-3 pt-2 border-t border-gray-100 dark:border-white/10">
        {/* Pending Orders */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between">
            <span className="text-xs text-content-text">Pending</span>
            <span className="text-xs font-semibold text-yellow-500">
              {loading ? "..." : statusCounts.pending}
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
            <div
              className="bg-yellow-500 h-1.5 rounded-full transition-all duration-300"
              style={{
                width: loading
                  ? "0%"
                  : `${
                      transactions.length > 0
                        ? (statusCounts.pending / transactions.length) * 100
                        : 0
                    }%`,
              }}
            />
          </div>
        </div>

        {/* Cancelled Orders */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between">
            <span className="text-xs text-content-text">Cancelled</span>
            <span className="text-xs font-semibold text-red-500">
              {loading ? "..." : statusCounts.cancelled}
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
            <div
              className="bg-red-500 h-1.5 rounded-full transition-all duration-300"
              style={{
                width: loading
                  ? "0%"
                  : `${
                      transactions.length > 0
                        ? (statusCounts.cancelled / transactions.length) * 100
                        : 0
                    }%`,
              }}
            />
          </div>
        </div>

        {/* Refunded Orders */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between">
            <span className="text-xs text-content-text">Refunded</span>
            <span className="text-xs font-semibold text-gray-500">
              {loading ? "..." : statusCounts.refunded}
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
            <div
              className="bg-gray-500 h-1.5 rounded-full transition-all duration-300"
              style={{
                width: loading
                  ? "0%"
                  : `${
                      transactions.length > 0
                        ? (statusCounts.refunded / transactions.length) * 100
                        : 0
                    }%`,
              }}
            />
          </div>
        </div>
      </div>

      {/* Total Orders Summary */}
      <div className="flex justify-between items-center pt-2 text-xs text-content-text border-t border-gray-100 dark:border-white/10">
        <span>Total Orders: {loading ? "..." : transactions.length}</span>
        <span>
          Completion Rate:{" "}
          {loading
            ? "..."
            : transactions.length > 0
              ? `${Math.round((statusCounts.completed / transactions.length) * 100)}%`
              : "0%"}
        </span>
      </div>
    </div>
  );
}
