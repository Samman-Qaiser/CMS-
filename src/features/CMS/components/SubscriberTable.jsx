import { motion } from "framer-motion";
import { useState } from "react";
import { BsTrash, BsPencilSquare } from "react-icons/bs";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";
import Swal from "sweetalert2";

const SubscriberTable = ({ subscribers = [], onEdit }) => {
  const [selectedIds, setSelectedIds] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // --- Pagination Logic ---
  const indexOfLast = currentPage * itemsPerPage;
  const currentSubs = subscribers.slice(
    indexOfLast - itemsPerPage,
    indexOfLast,
  );
  const totalPages = Math.ceil(subscribers.length / itemsPerPage);

  // --- Selection Logic ---
  const handleCheckboxChange = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  const handleSelectAll = (e) => {
    setSelectedIds(e.target.checked ? currentSubs.map((s) => s.id) : []);
  };

  // --- Delete Logic ---
  const confirmDelete = (ids) => {
    const isBulk = Array.isArray(ids);
    const count = isBulk ? ids.length : 1;

    Swal.fire({
      title: "Are you sure?",
      text: `You are deleting ${count} subscriber${count > 1 ? "s" : ""}!`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      confirmButtonText: "Delete",
      background: document.documentElement.classList.contains("dark")
        ? "#292d4a"
        : "#fff",
      color: document.documentElement.classList.contains("dark")
        ? "#fff"
        : "#000",
    }).then((result) => {
      if (result.isConfirmed) {
        if (isBulk) setSelectedIds([]);
      }
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-[#292d4a] mt-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden"
    >
      <div className="p-6 flex justify-between items-center border-b border-gray-50 dark:border-gray-800">
        <h2 className="text-xl font-semibold text-primary">Subscribers</h2>
        {selectedIds.length > 0 && (
          <button
            onClick={() => confirmDelete(selectedIds)}
            className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-bold hover:bg-red-600 transition-all"
          >
            <BsTrash /> Delete Selected ({selectedIds.length})
          </button>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="text-gray-400 font-semibold text-sm uppercase tracking-wider">
              <th className="py-4 px-2 pl-8">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-primary focus:ring-primary"
                  onChange={handleSelectAll}
                  checked={
                    selectedIds.length === currentSubs.length &&
                    currentSubs.length > 0
                  }
                />
              </th>
              <th className="py-4 px-2 text-xs font-bold">Name</th>
              <th className="py-4 px-2 text-xs font-bold">Email</th>
              <th className="py-4 px-2 text-xs font-bold">Phone</th>
              <th className="py-4 px-2 text-xs font-bold text-center">
                Status
              </th>
              <th className="py-4 px-2 text-xs font-bold text-center">
                Unsubscribed
              </th>
              <th className="py-4 px-2 text-xs font-bold">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
            {currentSubs.map((sub) => (
              <tr
                key={sub._id}
                className="hover:bg-gray-50/50 dark:hover:bg-white/5 transition-colors"
              >
                <td className="py-4 px-2 pl-8">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-primary focus:ring-primary"
                    checked={selectedIds.includes(sub._id)}
                    onChange={() => handleCheckboxChange(sub._id)}
                  />
                </td>
                <td className="py-4 px-2 text-[13px] text-content-text">
                  {sub.name}
                </td>
                <td className="py-4 px-2 text-[13px]  text-content-text">
                  {sub.email}
                </td>
                <td className="py-4 px-2 text-[13px] text-gray-500">
                  {sub.phone}
                </td>
                <td className="py-4 px-2 text-center">
                  <span className="px-3 py-1 rounded-full text-[10px] text-content-text uppercase tracking-wider">
                    {sub.status || "Inactive"}
                  </span>
                </td>
                <td className="py-4 px-2 text-center">
                  <div className="w-2.5 h-2.5 rounded-full mx-auto">
                    {sub.isUnsubscribed ? "Yes" : "No"}
                  </div>
                </td>
                <td className="py-4 px-2">
                  <div className="flex gap-2">
                    <button
                      onClick={() => onEdit(sub)}
                      className="p-2 bg-primary/10 text-primary rounded-lg hover:bg-primary hover:text-white transition-all active:scale-90"
                      title="Edit Subscriber"
                    >
                      <BsPencilSquare size={16} />
                    </button>
                    <button
                      onClick={() => confirmDelete(sub._id)}
                      className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition-all active:scale-90"
                      title="Delete Subscriber"
                    >
                      <BsTrash size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* --- Pagination Footer --- */}
      <div className="p-6 flex justify-between items-center text-sm text-gray-500 font-medium border-t border-gray-50 dark:border-gray-800">
        <span>
          Showing {currentSubs.length} of {subscribers.length} entries.
        </span>
        <div className="flex items-center gap-2">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
            className={`p-2 border rounded-lg transition-colors ${
              currentPage === 1
                ? "opacity-30 cursor-not-allowed"
                : "hover:bg-primary hover:text-white border-gray-200"
            }`}
          >
            <IoChevronBack size={18} />
          </button>

          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index + 1}
              onClick={() => setCurrentPage(index + 1)}
              className={`w-9 h-9 flex items-center justify-center rounded-lg font-bold transition-all ${
                currentPage === index + 1
                  ? "bg-primary text-white shadow-lg shadow-primary/30 scale-105"
                  : "border border-gray-100 hover:bg-primary/5 text-gray-400"
              }`}
            >
              {index + 1}
            </button>
          ))}

          <button
            disabled={currentPage === totalPages || totalPages === 0}
            onClick={() => setCurrentPage(currentPage + 1)}
            className={`p-2 border rounded-lg transition-colors ${
              currentPage === totalPages || totalPages === 0
                ? "opacity-30 cursor-not-allowed"
                : "hover:bg-primary hover:text-white border-gray-200"
            }`}
          >
            <IoChevronForward size={18} />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default SubscriberTable;
