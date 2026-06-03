import { useState, useEffect } from "react";
import axios from "axios";
import { BsDownload } from "react-icons/bs";

const STATUS_STYLES = {
  completed: "bg-teal-500/15 text-teal-500 border border-teal-500/30",
  pending: "bg-yellow-400/15 text-yellow-500 border border-yellow-400/30",
  cancelled: "bg-red-400/15 text-red-400 border border-red-400/30",
  refunded: "bg-gray-400/15 text-gray-500 border border-gray-400/30",
};

export default function LatestTransactionTable() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const baseUrl =
    import.meta.env?.VITE_BACKEND_URL || "https://cms-backend-ashen.vercel.app";

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await axios.get(`${baseUrl}/api/transactions`);
        setTransactions(res.data.transactions);
      } catch (err) {
        console.error("Error fetching transactions:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTransactions();
  }, [baseUrl]);

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await axios.put(`${baseUrl}/api/transactions/${id}`, {
        status: newStatus,
      });
      setTransactions((prev) =>
        prev.map((t) => (t._id === id ? { ...t, status: newStatus } : t)),
      );
    } catch (err) {
      alert("Failed to update status", err);
    }
  };

  if (loading)
    return (
      <div className="p-5 text-center text-sm text-content-text">
        Loading...
      </div>
    );

  return (
    <div className="bg-[#ffffff] dark:bg-[#292D4A] rounded-md p-5 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <span className="text-sm font-bold text-header-text">
          Latest Transaction
        </span>
        <button className="bg-primary text-white text-xs font-semibold px-4 py-2 rounded-md hover:bg-primary/90 transition-colors">
          View all
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 dark:border-white/10">
              {["Date", "Name", "Amount", "Status", "Invoice"].map((col) => (
                <th
                  key={col}
                  className="text-left py-3 px-2 font-semibold text-content-text"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {transactions.map((t) => (
              <tr
                key={t._id}
                className="border-b border-gray-50 dark:border-white/5 last:border-none"
              >
                <td className="py-3.5 px-2 text-content-text">
                  {new Date(t.createdAt).toLocaleDateString()}
                </td>
                <td className="py-3.5 px-2 font-medium text-header-text">
                  {t.user?.firstName} {t.user?.lastName}
                </td>
                <td className="py-3.5 px-2 font-semibold text-header-text">
                  ${t.amount}
                </td>
                <td className="py-3.5 px-2">
                  <select
                    value={t.status}
                    onChange={(e) => handleStatusUpdate(t._id, e.target.value)}
                    className={`text-xs font-semibold px-3 py-1 rounded-full cursor-pointer ${STATUS_STYLES[t.status]}`}
                  >
                    <option value="completed">Completed</option>
                    <option value="pending">Pending</option>
                    <option value="cancelled">Cancelled</option>
                    <option value="refunded">Refunded</option>
                  </select>
                </td>
                <td className="py-3.5 px-2">
                  <button className="flex items-center gap-2 text-xs font-semibold text-content-text hover:text-header-text">
                    Download <BsDownload />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
