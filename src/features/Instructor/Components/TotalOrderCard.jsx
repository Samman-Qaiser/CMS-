import { useState, useEffect } from "react";
import axios from "axios";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";

export default function TotalOrderCard() {
  const [total, setTotal] = useState(0);
  const [percentage, setPercentage] = useState(0);
  const [isPositive, setIsPositive] = useState(true);
  const [loading, setLoading] = useState(true);  

  const baseUrl =
    import.meta.env?.VITE_BACKEND_URL || "https://cms-backend-ashen.vercel.app";

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${baseUrl}/api/transactions`);
        const transactions = res.data.transactions;
        const now = new Date();

        const completed = transactions.filter((t) => t.status === "completed");
        setTotal(completed.length);

        const thisMonth = completed.filter(
          (t) =>
            new Date(t.createdAt).getMonth() === now.getMonth() &&
            new Date(t.createdAt).getFullYear() === now.getFullYear(),
        ).length;

        const lastMonth = completed.filter((t) => {
          const d = new Date(t.createdAt);
          return (
            d.getMonth() === now.getMonth() - 1 &&
            d.getFullYear() === now.getFullYear()
          );
        }).length;

        if (lastMonth === 0) {
          setPercentage(thisMonth > 0 ? 100 : 0);
        } else {
          const growth = ((thisMonth - lastMonth) / lastMonth) * 100;
          setIsPositive(growth >= 0);
          setPercentage(Math.abs(Math.round(growth)));
        }
      } catch (err) {
        console.error("Error calculating order growth:", err);
      } finally {
        setLoading(false);  
      }
    };
    fetchData();
  }, [baseUrl]);

  return (
    <div className="bg-[#ffffff] dark:bg-[#292D4A] rounded-md p-5 flex flex-col gap-3">
      <span className="text-sm text-content-text">Total Completed Orders</span>
      <div className="flex items-center gap-3">
        <span className="text-3xl font-bold text-header-text">
          {loading ? "..." : total.toLocaleString()}
        </span>

        {/* Dynamic Badge - Hidden while loading */}
        {!loading && (
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
