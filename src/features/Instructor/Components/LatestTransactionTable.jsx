// LatestTransactionTable.jsx
import { useState, useMemo } from "react";
import { BsDownload, BsChevronLeft, BsChevronRight } from "react-icons/bs";
import { useTransactions } from "../context/TransactionContext";
import TransactionReceipt from "./TransactionReceipt";

const STATUS_STYLES = {
  completed: "bg-teal-500/15 text-teal-500 border border-teal-500/30",
  pending: "bg-yellow-400/15 text-yellow-500 border border-yellow-400/30",
  cancelled: "bg-red-400/15 text-red-400 border border-red-400/30",
  refunded: "bg-gray-400/15 text-gray-500 border border-gray-400/30",
};

export default function LatestTransactionTable() {
  const { transactions, loading, updateTransactionStatus } = useTransactions();
  const [updatingId, setUpdatingId] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const itemsPerPage = 6;

  // Filter transactions based on status and search
  const filteredTransactions = useMemo(() => {
    let filtered = transactions;

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((t) => t.status === statusFilter);
    }

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (t) =>
          t.user?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          t.user?.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          t.course?.title?.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    return filtered;
  }, [transactions, statusFilter, searchTerm]);

  // Pagination logic
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentTransactions = filteredTransactions.slice(startIndex, endIndex);

  // Reset to first page when filters change
  const handleFilterChange = (newFilter) => {
    setStatusFilter(newFilter);
    setCurrentPage(1);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  // Pagination controls
  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToPage = (page) => {
    setCurrentPage(page);
  };

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push("...");
        pageNumbers.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pageNumbers.push(1);
        pageNumbers.push("...");
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pageNumbers.push(i);
        }
      } else {
        pageNumbers.push(1);
        pageNumbers.push("...");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push("...");
        pageNumbers.push(totalPages);
      }
    }
    return pageNumbers;
  };

  const statusCounts = useMemo(() => {
    const counts = {
      all: transactions.length,
      completed: transactions.filter((t) => t.status === "completed").length,
      pending: transactions.filter((t) => t.status === "pending").length,
      cancelled: transactions.filter((t) => t.status === "cancelled").length,
      refunded: transactions.filter((t) => t.status === "refunded").length,
    };
    return counts;
  }, [transactions]);

  const handleStatusUpdate = async (id, newStatus) => {
    setUpdatingId(id);
    try {
      await updateTransactionStatus(id, newStatus);
    } catch (err) {
      alert(
        "Failed to update status: " +
          (err.response?.data?.message || err.message),
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDownloadReceipt = (transaction) => {
    // Only allow download for completed transactions
    if (transaction.status !== "completed") {
      alert("Receipt is only available for completed transactions");
      return;
    }
    setSelectedTransaction(transaction);
  };

  const closeReceipt = () => {
    setSelectedTransaction(null);
  };

  if (loading)
    return (
      <div className="p-5 text-center text-sm text-content-text">
        Loading...
      </div>
    );

  return (
    <>
      <div className="bg-[#ffffff] dark:bg-[#292D4A] rounded-md p-5 flex flex-col gap-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <span className="text-sm font-bold text-header-text">
            Transaction History
          </span>
          <div className="flex gap-2">
            <div className="relative">
              <input
                type="text"
                placeholder="Search by name or course..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-transparent text-header-text placeholder:text-content-text focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
          </div>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex gap-2 border-b border-gray-100 dark:border-white/10 pb-2 overflow-x-auto">
          {["all", "completed", "pending", "cancelled", "refunded"].map(
            (status) => (
              <button
                key={status}
                onClick={() => handleFilterChange(status)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
                  statusFilter === status
                    ? "bg-primary text-white"
                    : "text-content-text hover:bg-gray-100 dark:hover:bg-white/10"
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
                <span className="ml-1.5 px-1.5 py-0.5 rounded-full bg-white/20 text-xs">
                  {statusCounts[status]}
                </span>
              </button>
            ),
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 dark:border-white/10">
                {["Date", "Name", "Course", "Amount", "Status", "Receipt"].map(
                  (col) => (
                    <th
                      key={col}
                      className="text-left py-3 px-2 font-semibold text-content-text"
                    >
                      {col}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody>
              {currentTransactions.map((t) => (
                <tr
                  key={t._id}
                  className="border-b border-gray-50 dark:border-white/5 last:border-none hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                >
                  <td className="py-3.5 px-2 text-content-text">
                    {new Date(t.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-3.5 px-2 font-medium text-header-text">
                    {t.user?.firstName} {t.user?.lastName}
                  </td>
                  <td className="py-3.5 px-2 text-content-text">
                    {t.course?.title?.length > 30
                      ? t.course.title.substring(0, 30) + "..."
                      : t.course?.title}
                  </td>
                  <td className="py-3.5 px-2 font-semibold text-header-text">
                    ${t.amount}
                  </td>
                  <td className="py-3.5 px-2">
                    <select
                      value={t.status}
                      onChange={(e) =>
                        handleStatusUpdate(t._id, e.target.value)
                      }
                      disabled={updatingId === t._id}
                      className={`text-xs font-semibold px-3 py-1 rounded-full cursor-pointer ${STATUS_STYLES[t.status]} ${
                        updatingId === t._id ? "opacity-50 cursor-wait" : ""
                      }`}
                    >
                      <option value="completed">Completed</option>
                      <option value="pending">Pending</option>
                      <option value="cancelled">Cancelled</option>
                      <option value="refunded">Refunded</option>
                    </select>
                  </td>
                  <td className="py-3.5 px-2">
                    <button
                      onClick={() => handleDownloadReceipt(t)}
                      disabled={t.status !== "completed"}
                      className={`flex items-center gap-2 text-xs font-semibold transition-colors ${
                        t.status === "completed"
                          ? "text-content-text hover:text-header-text cursor-pointer"
                          : "text-gray-400 cursor-not-allowed"
                      }`}
                      title={
                        t.status !== "completed"
                          ? "Receipt only available for completed transactions"
                          : "Download receipt"
                      }
                    >
                      Download <BsDownload />
                    </button>
                  </td>
                </tr>
              ))}
              {currentTransactions.length === 0 && (
                <tr>
                  <td
                    colSpan="6"
                    className="text-center py-8 text-content-text"
                  >
                    No transactions found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Section */}
        {filteredTransactions.length > 0 && (
          <div className="flex justify-between items-center pt-3 border-t border-gray-100 dark:border-white/10">
            <div className="text-xs text-content-text">
              Showing {startIndex + 1} to{" "}
              {Math.min(endIndex, filteredTransactions.length)} of{" "}
              {filteredTransactions.length} transactions
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={goToPreviousPage}
                disabled={currentPage === 1}
                className={`p-2 rounded-md transition-colors ${
                  currentPage === 1
                    ? "text-gray-400 cursor-not-allowed"
                    : "text-content-text hover:bg-gray-100 dark:hover:bg-white/10"
                }`}
              >
                <BsChevronLeft className="w-4 h-4" />
              </button>

              <div className="flex gap-1">
                {getPageNumbers().map((page, index) => (
                  <button
                    key={index}
                    onClick={() => typeof page === "number" && goToPage(page)}
                    className={`px-3 py-1 text-sm rounded-md transition-colors ${
                      currentPage === page
                        ? "bg-primary text-white"
                        : "text-content-text hover:bg-gray-100 dark:hover:bg-white/10"
                    } ${typeof page !== "number" ? "cursor-default" : ""}`}
                    disabled={typeof page !== "number"}
                  >
                    {page}
                  </button>
                ))}
              </div>

              <button
                onClick={goToNextPage}
                disabled={currentPage === totalPages}
                className={`p-2 rounded-md transition-colors ${
                  currentPage === totalPages
                    ? "text-gray-400 cursor-not-allowed"
                    : "text-content-text hover:bg-gray-100 dark:hover:bg-white/10"
                }`}
              >
                <BsChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Receipt Modal */}
      {selectedTransaction && (
        <TransactionReceipt
          transaction={selectedTransaction}
          onClose={closeReceipt}
        />
      )}
    </>
  );
}
