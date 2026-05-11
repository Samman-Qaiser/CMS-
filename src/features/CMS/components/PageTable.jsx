import { motion } from "framer-motion";
import { useState } from "react";
import { BsTrash, BsPencilSquare, BsPlusLg, BsCopy } from "react-icons/bs";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";

const PageTable = ({ pages = [] }) => {
  const [selectedPages, setSelectedPages] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

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
      setSelectedPages(currentPages.map((p) => p.id));
    } else {
      setSelectedPages([]);
    }
  };

  const handleCopy = (url) => {
    navigator.clipboard.writeText(window.location.origin + url);
    Swal.fire({
      toast: true,
      position: "top-end",
      icon: "success",
      title: "URL Copied!",
      showConfirmButton: false,
      timer: 1500,
    });
  };

  // --- Bulk Delete Logic   ---
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
        text: `Deleting ${selectedPages.length} pages!`,
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
      }).then((result) => {
        if (result.isConfirmed) {
          console.log("Deleting pages:", selectedPages);
          setSelectedPages([]);
          Swal.fire("Deleted!", "Selected pages have been removed.", "success");
        }
      });
    }
  };

  // --- Single Delete Logic ---
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
    }).then((result) => {
      if (result.isConfirmed) {
        console.log(`Deleting page: ${id}`);
        Swal.fire("Deleted!", "Page removed.", "success");
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
        <h2 className="text-xl font-semibold text-primary">Pages</h2>
        <div className="flex gap-3">
          <button
            onClick={handleDeleteClick}
            className="px-6 py-2 rounded-lg border border-primary text-primary font-semibold hover:bg-primary hover:text-white transition-colors"
          >
            Delete
          </button>
          <Link
            to="/add-page"
            className="flex items-center rounded-lg bg-primary text-white px-4 py-2 font-semibold shadow-lg shadow-primary/20"
          >
            ADD Page <BsPlusLg className="ml-2" />
          </Link>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full overflow-x-scroll text-left border-collapse">
          <thead>
            <tr className="text-content-text font-semibold text-sm">
              <th className="py-4 px-2 pl-8">
                <input
                  type="checkbox"
                  onChange={handleSelectAll}
                  checked={
                    selectedPages.length === currentPages.length &&
                    currentPages.length > 0
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
                key={page.id}
                className="hover:bg-gray-50/50 dark:hover:bg-white/5 transition-colors text-sm"
              >
                <td className="py-4 px-2 pl-8">
                  <input
                    type="checkbox"
                    checked={selectedPages.includes(page.id)}
                    onChange={() => handleCheckboxChange(page.id)}
                  />
                </td>
                <td className="py-4 px-2 text-[12px] text-gray-600 dark:text-gray-300">
                  {page.title}
                </td>
                <td className="py-4 px-2 text-[12px] text-gray-500">
                  {page.status}
                </td>
                <td className="py-4 px-2 text-[12px]">
                  <span
                    className={`px-3 py-1 rounded-lg text-xs font-bold text-white ${page.visibility === "Public" ? "bg-green-500" : "bg-orange-400"}`}
                  >
                    {page.visibility}
                  </span>
                </td>
                <td className="py-4 px-2 text-[12px] text-gray-500">
                  {page.publishOn}
                </td>
                <td className="py-4 px-2 text-[12px] text-gray-500">
                  {page.createdAt}
                </td>
                <td className="py-4 px-2 text-[12px] text-gray-500">
                  {page.updatedAt}
                </td>
                <td className="py-4 px-2 text-[12px] text-center">
                  <button
                    onClick={() => handleCopy(page.url)}
                    className="p-2 text-primary cursor-pointer"
                  >
                    <BsCopy size={18} />
                  </button>
                </td>
                <td className="py-4 px-2">
                  <div className="flex gap-2">
                    <button className="p-2 cursor-pointer bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors">
                      <BsPencilSquare size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(page.id, page.title)}
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

      <div className="p-6 flex justify-between items-center text-sm text-content-text font-medium border-t border-gray-50 dark:border-gray-800">
        <span>
          Page {currentPage} of {totalPages || 1}.
        </span>
        <div className="flex items-center gap-2">
          <button
            disabled={currentPage === 1}
            onClick={() => handlePageChange(currentPage - 1)}
            className={`p-2 border rounded-lg transition-colors ${currentPage === 1 ? "opacity-50 cursor-not-allowed" : "hover:bg-primary hover:text-white cursor-pointer"}`}
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
                  : "border hover:bg-primary/10"
              }`}
            >
              {index + 1}
            </button>
          ))}

          <button
            disabled={currentPage === totalPages || totalPages === 0}
            onClick={() => handlePageChange(currentPage + 1)}
            className={`p-2 border rounded-lg transition-colors ${currentPage === totalPages || totalPages === 0 ? "opacity-50 cursor-not-allowed" : "hover:bg-primary hover:text-white cursor-pointer"}`}
          >
            <IoChevronForward />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default PageTable;
