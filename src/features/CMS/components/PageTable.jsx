import { motion } from "framer-motion";
import { useState } from "react";
import { BsTrash, BsPencilSquare, BsPlusLg, BsCopy } from "react-icons/bs";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";
import { Link } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

const PageTable = ({ pages = [], onRefresh }) => {
  const [selectedPages, setSelectedPages] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const baseUrl =
    import.meta.env?.VITE_BACKEND_URL || "https://cms-backend-ashen.vercel.app";

  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentPages = pages.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(pages.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
      setSelectedPages([]);
    }
  };

  const handleCheckboxChange = (pageId) => {
    setSelectedPages((prev) =>
      prev.includes(pageId)
        ? prev.filter((id) => id !== pageId)
        : [...prev, pageId],
    );
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedPages(currentPages.map((p) => p._id));
    } else {
      setSelectedPages([]);
    }
  };

  const handleCopy = (slug) => {
    const targetPath = slug ? `/pages/${slug}` : "/";
    navigator.clipboard.writeText(window.location.origin + targetPath);
    Swal.fire({
      toast: true,
      position: "top-end",
      icon: "success",
      title: "URL Copied!",
      showConfirmButton: false,
      timer: 1500,
    });
  };

  // ---  Bulk Delete ---
  const handleDeleteClick = () => {
    if (selectedPages.length === 0) {
      Swal.fire({
        title: "Oops...",
        text: "Please Select Items To Delete",
        icon: "info",
        confirmButtonColor: "var(--primary)",
      });
    } else {
      Swal.fire({
        title: "Are you sure?",
        text: `Deleting ${selectedPages.length} selected pages completely!`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#ef4444",
        cancelButtonColor: "#a0aec0",
        confirmButtonText: "Delete",
        background: document.documentElement.classList.contains("dark")
          ? "#292d4a"
          : "#fff",
        color: document.documentElement.classList.contains("dark")
          ? "#fff"
          : "#000",
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            await Promise.all(
              selectedPages.map((id) =>
                axios.delete(`${baseUrl}/api/pages/${id}`),
              ),
            );

            setSelectedPages([]);
            Swal.fire(
              "Deleted!",
              "Selected pages have been removed.",
              "success",
            );
            if (onRefresh) onRefresh();
          } catch (error) {
            console.error("Bulk Processing Error:", error);
            Swal.fire(
              "Error",
              "Could not complete bulk deletion requests.",
              "error",
            );
          }
        }
      });
    }
  };

  const handleDelete = (id, title) => {
    Swal.fire({
      title: "Are you sure?",
      text: `Delete page: ${title}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "var(--primary)",
      confirmButtonText: "Yes, delete it!",
      background: document.documentElement.classList.contains("dark")
        ? "#292d4a"
        : "#fff",
      color: document.documentElement.classList.contains("dark")
        ? "#fff"
        : "#000",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`${baseUrl}/api/pages/${id}`);
          Swal.fire("Deleted!", "Page removed.", "success");
          if (onRefresh) onRefresh();
        } catch (error) {
          console.error("Delete Endpoint Error:", error);
          Swal.fire(
            "Error",
            "Could not remove specified item document.",
            "error",
          );
        }
      }
    });
  };

  const formatDate = (isoString) => {
    if (!isoString || isoString.startsWith("0001") || isoString === "")
      return "N/A";
    try {
      return isoString.includes("T") ? isoString.split("T")[0] : isoString;
    } catch (e) {
      return "N/A";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-[#292d4a] mt-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden"
    >
      <div className="p-6 flex justify-between items-center border-b border-gray-50 dark:border-gray-800">
        <h2 className="text-xl font-semibold text-primary dark:text-white">
          Pages
        </h2>
        <div className="flex gap-3">
          <button
            onClick={handleDeleteClick}
            className="px-6 py-2 rounded-lg border border-primary text-primary font-semibold hover:bg-primary hover:text-white transition-colors"
          >
            Delete
          </button>
          <Link
            to="/dashboard/add-page"
            className="flex items-center rounded-lg bg-primary text-white px-4 py-2 font-semibold shadow-lg shadow-primary/20"
          >
            ADD Page <BsPlusLg className="ml-2" />
          </Link>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="text-gray-400 font-semibold text-sm border-b border-gray-100 dark:border-gray-800">
              <th className="py-4 px-2 pl-8">
                <input
                  type="checkbox"
                  onChange={handleSelectAll}
                  checked={
                    currentPages.length > 0 &&
                    currentPages.every((p) => selectedPages.includes(p._id))
                  }
                />
              </th>
              <th className="py-4 px-2 text-sm font-medium">Title</th>
              <th className="py-4 px-2 text-sm font-medium">Status</th>
              <th className="py-4 px-2 text-sm font-medium">Visibility</th>
              <th className="py-4 px-2 text-sm font-medium">Publish On</th>
              <th className="py-4 px-2 text-sm font-medium">Created At</th>
              <th className="py-4 px-2 text-sm font-medium">Updated At</th>
              <th className="py-4 px-2 text-sm font-medium text-center">
                Copy Url
              </th>
              <th className="py-4 px-2 text-sm font-medium">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
            {currentPages.map((page) => (
              <tr
                key={page._id}
                className="hover:bg-gray-50/50 dark:hover:bg-white/5 transition-colors text-sm"
              >
                <td className="py-4 px-2 pl-8">
                  <input
                    type="checkbox"
                    checked={selectedPages.includes(page._id)}
                    onChange={() => handleCheckboxChange(page._id)}
                  />
                </td>
                <td className="py-4 px-2 text-[12px] font-medium text-gray-700 dark:text-gray-200 max-w-[180px] truncate">
                  {page.title}
                </td>
                <td className="py-4 px-2 text-[12px] capitalize text-gray-500 dark:text-gray-400">
                  {page.status}
                </td>
                <td className="py-4 px-2 text-[12px]">
                  <span
                    className={`px-3 py-1 rounded-lg text-xs font-bold text-white ${
                      page.visibility?.toLowerCase() === "public"
                        ? "bg-green-500"
                        : "bg-orange-400"
                    }`}
                  >
                    {page.visibility || "public"}
                  </span>
                </td>
                <td className="py-4 px-2 text-[12px] text-gray-500 dark:text-gray-400">
                  {formatDate(page.publishedAt)}
                </td>
                <td className="py-4 px-2 text-[12px] text-gray-500 dark:text-gray-400">
                  {formatDate(page.createdAt)}
                </td>
                <td className="py-4 px-2 text-[12px] text-gray-500 dark:text-gray-400">
                  {formatDate(page.updatedAt)}
                </td>
                <td className="py-4 px-2 text-[12px] text-center">
                  <button
                    onClick={() => handleCopy(page.slug)}
                    className="p-2 text-primary dark:text-purple-400 cursor-pointer hover:scale-110 transition-transform"
                  >
                    <BsCopy size={16} />
                  </button>
                </td>
                <td className="py-4 px-2">
                  <div className="flex gap-2">
                    <Link
                      to={`/dashboard/edit-page/${page._id}`}
                      className="p-2 cursor-pointer bg-primary/10 text-primary dark:text-purple-400 rounded-lg hover:bg-primary/20 transition-colors"
                    >
                      <BsPencilSquare size={16} />
                    </Link>
                    <button
                      onClick={() => handleDelete(page._id, page.title)}
                      className="p-2 cursor-pointer bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
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

      {/* Pagination Controls Footer */}
      <div className="p-6 flex justify-between items-center text-sm text-gray-500 dark:text-gray-400 font-medium border-t border-gray-50 dark:border-gray-800">
        <span>
          Page {currentPage} of {totalPages || 1}.
        </span>
        <div className="flex items-center gap-2">
          <button
            disabled={currentPage === 1}
            onClick={() => handlePageChange(currentPage - 1)}
            className={`p-2 border rounded-lg transition-colors ${
              currentPage === 1
                ? "opacity-50 cursor-not-allowed border-gray-100 dark:border-gray-800"
                : "hover:bg-primary hover:text-white dark:border-gray-600 cursor-pointer"
            }`}
          >
            <IoChevronBack />
          </button>

          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index + 1}
              onClick={() => handlePageChange(index + 1)}
              className={`w-8 h-8 flex items-center justify-center rounded-lg font-semibold transition-all ${
                currentPage === index + 1
                  ? "bg-primary text-white shadow-md shadow-primary/30 scale-110"
                  : "border dark:border-gray-600 hover:bg-primary/10"
              }`}
            >
              {index + 1}
            </button>
          ))}

          <button
            disabled={currentPage === totalPages || totalPages === 0}
            onClick={() => handlePageChange(currentPage + 1)}
            className={`p-2 border rounded-lg transition-colors ${
              currentPage === totalPages || totalPages === 0
                ? "opacity-50 cursor-not-allowed border-gray-100 dark:border-gray-800"
                : "hover:bg-primary hover:text-white dark:border-gray-600 cursor-pointer"
            }`}
          >
            <IoChevronForward />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default PageTable;
