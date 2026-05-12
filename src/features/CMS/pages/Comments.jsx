import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import {
  BsSearch,
  BsChevronUp,
  BsChevronDown,
  BsTrash,
  BsPencilSquare,
} from "react-icons/bs";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";
import Swal from "sweetalert2";
import { commentsData } from "../components/blogsData";

const Comments = () => {
  const [comments, setComments] = useState(commentsData);
  const [isOpen, setIsOpen] = useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // --- Checkbox Selection State ---
  const [selectedComments, setSelectedComments] = useState([]);

  // --- React Hook Form ---
  const { register, handleSubmit, reset, setValue, watch } = useForm({
    defaultValues: {
      name: "",
      email: "",
      status: "Select Status",
    },
  });

  const selectedStatus = watch("status");
  const statuses = ["pending", "approved", "spam", "trash"];

  // --- Pagination State ---
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = comments.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(comments.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
      setSelectedComments([]);
    }
  };

  // --- Checkbox Logic ---
  const handleCheckboxChange = (id) => {
    setSelectedComments((prev) =>
      prev.includes(id)
        ? prev.filter((itemId) => itemId !== id)
        : [...prev, id],
    );
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedComments(currentItems.map((item) => item.id));
    } else {
      setSelectedComments([]);
    }
  };

  // --- Filter Logic ---
  const onSubmit = (data) => {
    const filtered = commentsData.filter((item) => {
      const nameMatch = item.author
        .toLowerCase()
        .includes(data.name.toLowerCase());
      const emailMatch = item.email
        .toLowerCase()
        .includes(data.email.toLowerCase());
      const statusMatch =
        data.status === "Select Status" || item.status === data.status;
      return nameMatch && emailMatch && statusMatch;
    });
    setComments(filtered);
    setCurrentPage(1);
    setSelectedComments([]);
  };

  const handleClear = () => {
    reset({ name: "", email: "", status: "Select Status" });
    setComments(commentsData);
    setCurrentPage(1);
    setSelectedComments([]);
  };

  const handleDelete = (id, author) => {
    Swal.fire({
      title: "Are you sure?",
      text: `Delete comment from ${author}?`,
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
        Swal.fire("Deleted!", "Comment moved to trash.", "success");
      }
    });
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "approved":
        return "bg-green-500";
      case "pending":
        return "bg-yellow-500";
      case "spam":
        return "bg-orange-500";
      case "trash":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="p-6">
      {/* --- Filter Section --- */}
      <div className="bg-white dark:bg-[#292d4a] rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="p-5 flex items-center justify-between">
          <h2 className="text-xl font-bold" style={{ color: "var(--primary)" }}>
            Filter
          </h2>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200"
            style={{ backgroundColor: "var(--primary)", color: "white" }}
          >
            {isOpen ? <BsChevronUp size={18} /> : <BsChevronDown size={18} />}
          </button>
        </div>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="px-6 pb-8 pt-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end"
              >
                <input
                  {...register("name")}
                  placeholder="Name"
                  className="w-full px-4 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-600 bg-transparent outline-none focus:ring-1 transition-all text-content-text"
                />
                <input
                  {...register("email")}
                  placeholder="Email"
                  className="w-full px-4 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-600 bg-transparent outline-none focus:ring-1 transition-all text-content-text"
                />

                <div className="w-full relative">
                  <div
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className={`w-full px-4 py-2 text-sm rounded-lg border flex items-center justify-between cursor-pointer transition-all ${isDropdownOpen ? "border-primary ring-1 " : "border-gray-200 dark:border-gray-600"}`}
                  >
                    <span
                      className={
                        selectedStatus === "Select Status"
                          ? "text-gray-400"
                          : "text-gray-700 dark:text-gray-200"
                      }
                    >
                      {selectedStatus}
                    </span>
                    <BsChevronDown
                      className={`transition-transform ${isDropdownOpen ? "rotate-180" : ""}`}
                    />
                  </div>
                  <AnimatePresence>
                    {isDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute top-[110%] left-0 w-full bg-white dark:bg-[#32375a] border border-gray-100 dark:border-gray-600 rounded-lg shadow-xl z-20 overflow-hidden"
                      >
                        <div className="p-2">
                          {statuses.map((status) => (
                            <div
                              key={status}
                              onClick={() => {
                                setValue("status", status);
                                setIsDropdownOpen(false);
                              }}
                              className="p-3 hover:bg-gray-50 dark:hover:bg-white/5 cursor-pointer rounded-lg text-gray-500 hover:text-gray-800 transition-colors capitalize"
                            >
                              {status}
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="submit"
                    className="w-full justify-center px-6 py-2 text-sm rounded-lg bg-primary text-white font-semibold flex items-center gap-2 transition-transform hover:scale-105 active:scale-95"
                  >
                    <BsSearch /> Filter
                  </button>
                  <button
                    type="button"
                    onClick={handleClear}
                    className="w-full justify-center px-6 py-2 text-sm rounded-lg text-primary border-primary font-semibold border transition-all hover:bg-gray-50 active:scale-95"
                  >
                    Clear
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* --- Table Section --- */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-[#292d4a] mt-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden"
      >
        <div className="p-6 flex justify-between items-center border-b border-gray-50 dark:border-gray-800">
          <h2 className="text-xl font-semibold text-primary">
            Comment Records
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-content-text font-semibold text-sm">
                <th className="py-4 px-2 pl-8">
                  <input
                    type="checkbox"
                    onChange={handleSelectAll}
                    checked={
                      selectedComments.length === currentItems.length &&
                      currentItems.length > 0
                    }
                  />
                </th>
                <th className="py-4 px-2 text-sm font-medium">Commentor</th>
                <th className="py-4 px-2 text-sm font-medium">Blog</th>
                <th className="py-4 px-2 text-sm font-medium">Status</th>
                <th className="py-4 px-2 text-sm font-medium">Created</th>
                <th className="py-4 px-2 text-sm font-medium">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
              {currentItems.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-gray-50/50 dark:hover:bg-white/5 transition-colors"
                >
                  <td className="py-4 px-2 pl-8">
                    <input
                      type="checkbox"
                      checked={selectedComments.includes(item.id)}
                      onChange={() => handleCheckboxChange(item.id)}
                    />
                  </td>
                  <td className="py-4 px-2 text-[12px] font-medium">
                    {item.email}
                  </td>
                  <td className="py-4 px-2 text-[12px]">
                    <Link
                      to="#"
                      className="text-primary font-semibold hover:underline"
                    >
                      {item.post}
                    </Link>
                  </td>
                  <td className="py-4 px-2 text-center">
                    <div className="flex items-center justify-start gap-2">
                      <div
                        className={`text-[10px] py-1 px-2 rounded-full text-white ${getStatusStyle(item.status)}`}
                      >
                        {item.status}
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-2 text-[12px] text-gray-500 italic">
                    {item.date}
                  </td>
                  <td className="py-4 px-2">
                    <div className="flex gap-2">
                      <Link
                        to={`/dashboard/edit-comment/${item.id}`} 
                        className="p-2 bg-emerald-100 text-emerald-600 rounded-lg hover:bg-emerald-200 transition-colors"
                      >
                        <BsPencilSquare size={16} />
                      </Link>
                      <button
                        onClick={() => handleDelete(item.id, item.author)}
                        className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
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

        {/* --- Pagination --- */}
        <div className="p-6 flex justify-between items-center text-sm text-content-text font-medium">
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
                className={`w-8 h-8 flex items-center justify-center rounded-lg font-semibold transition-all ${currentPage === index + 1 ? "bg-primary text-white shadow-md shadow-primary/30 scale-110" : "border hover:bg-primary/10"}`}
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
    </div>
  );
};

export default Comments;
