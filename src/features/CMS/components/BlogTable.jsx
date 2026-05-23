import axios from "axios";
import { motion } from "framer-motion";
import { useState } from "react";
import { BsTrash, BsPencilSquare, BsPlusLg, BsCopy } from "react-icons/bs";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";

const BlogTable = ({ blogs = [], onDeleteSuccess }) => {
  // Added optional callback to refresh list
  const [selectedBlogs, setSelectedBlogs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const baseUrl =
    import.meta.env?.VITE_BACKEND_URL || "https://cms-backend-ashen.vercel.app";

  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentBlogs = blogs.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(blogs.length / itemsPerPage);

  const handlePageChange = (num) => {
    if (num >= 1 && num <= totalPages) {
      setCurrentPage(num);
      setSelectedBlogs([]);
    }
  };

  const handleCheckboxChange = (_id) => {
    setSelectedBlogs((prev) =>
      prev.includes(_id) ? prev.filter((item) => item !== _id) : [...prev, _id],
    );
  };

  const handleSelectAll = (e) => {
    setSelectedBlogs(e.target.checked ? currentBlogs.map((b) => b._id) : []);
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

  // --- Bulk Delete Logic ---
  const handleDeleteClick = async () => {
    if (selectedBlogs.length === 0) {
      Swal.fire("Oops...", "Please Select Blogs To Delete", "info");
      return;
    }

    const result = await Swal.fire({
      title: "Are you sure?",
      text: `Deleting ${selectedBlogs.length} blogs!`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      confirmButtonText: "Delete",
    });

    if (result.isConfirmed) {
      try {
        // Assuming your backend handles bulk delete via array of IDs
        await axios.post(`${baseUrl}/api/blogs/delete-many`, {
          ids: selectedBlogs,
        });
        Swal.fire("Deleted!", "Selected blogs have been removed.", "success");
        setSelectedBlogs([]);
        if (onDeleteSuccess) onDeleteSuccess(); // Refresh parent state
      } catch (err) {
        Swal.fire("Error", "Failed to delete blogs", "error");
      }
    }
  };

  // --- Single Delete Logic ---
  const handleDelete = async (_id, title) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: `Delete blog: ${title}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`${baseUrl}/api/blogs/${_id}`);
        Swal.fire("Deleted!", "Blog removed.", "success");
        if (onDeleteSuccess) onDeleteSuccess(); // Refresh parent state
      } catch (err) {
        Swal.fire("Error", "Failed to delete blog", "error");
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-[#292d4a] mt-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden"
    >
      <div className="p-6 flex justify-between items-center border-b border-gray-50 dark:border-gray-800">
        <h2 className="text-xl font-semibold text-primary">Blogs</h2>
        <div className="flex gap-3">
          <button
            onClick={handleDeleteClick}
            className="px-6 py-2 rounded-lg border border-primary text-primary font-semibold hover:bg-primary hover:text-white transition-colors"
          >
            Delete
          </button>
          <Link
            to="/dashboard/add-blog"
            className="flex items-center rounded-lg bg-primary text-white px-4 py-2 font-semibold shadow-lg shadow-primary/20"
          >
            ADD Blog <BsPlusLg className="ml-2" />
          </Link>
        </div>
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
                    selectedBlogs.length === currentBlogs.length &&
                    currentBlogs.length > 0
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
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {currentBlogs.map((blog) => (
              <tr
                key={blog._id}
                className="hover:bg-gray-50/50 dark:hover:bg-white/5 transition-colors text-[13px]"
              >
                <td className="py-4 px-4 pl-8">
                  <input
                    type="checkbox"
                    className="w-4 h-4"
                    checked={selectedBlogs.includes(blog._id)}
                    onChange={() => handleCheckboxChange(blog._id)}
                  />
                </td>
                <td className="py-4 px-2 text-[12px] font-medium text-gray-700 dark:text-gray-200">
                  {blog.title}
                </td>
                <td className="py-4 px-2 text-[12px] text-gray-500">
                  {blog.status}
                </td>
                <td className="py-4 px-2 text-[12px]">
                  <span
                    className={`px-3 py-1 rounded-full font-bold text-white ${blog.visibility === "Public" ? "bg-green-500" : "bg-cyan-500"}`}
                  >
                    {blog.visibility}
                  </span>
                </td>
                <td className="py-4 px-2 text-[12px] text-gray-500 whitespace-nowrap">
                  {blog.publishedAt ? new Date(blog.publishedAt).toLocaleDateString() : "N/A"}
                </td>
                <td className="py-4 px-2 text-[12px] text-gray-400">
                  {blog.createdAt}
                </td>
                <td className="py-4 px-2 text-[12px] text-gray-400">
                  {blog.updatedAt}
                </td>
                <td className="py-4 px-2 text-center">
                  <button
                    onClick={() => handleCopy(blog.url)}
                    className="text-primary cursor-pointer transition-colors"
                  >
                    <BsCopy size={18} />
                  </button>
                </td>
                <td className="py-4 px-4">
                  <div className="flex gap-2">
                    <Link
                      to={`/dashboard/edit-blog/${blog._id}`}
                      className="p-1.5 bg-primary text-white rounded shadow-sm cursor-pointer transition-colors"
                    >
                      <BsPencilSquare size={14} />
                    </Link>
                    <button
                      onClick={() => handleDelete(blog._id, blog.title)}
                      className="p-1.5 bg-red-500 text-white rounded shadow-sm cursor-pointer transition-colors"
                    >
                      <BsTrash size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="p-6 flex justify-between items-center border-t border-gray-100 dark:border-gray-800">
        <span className="text-gray-500 text-sm font-medium">
          Page {currentPage} of {totalPages || 1}.
        </span>
        <div className="flex items-center gap-1">
          <button
            disabled={currentPage === 1}
            onClick={() => handlePageChange(currentPage - 1)}
            className="p-2 border border-gray-200 rounded-lg text-gray-400 hover:bg-gray-50 disabled:opacity-30 transition-colors"
          >
            <IoChevronBack size={18} />
          </button>
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => handlePageChange(i + 1)}
              className={`w-9 h-9 flex items-center justify-center rounded-lg text-sm font-bold transition-all ${
                currentPage === i + 1
                  ? "bg-primary text-white shadow-lg"
                  : "text-gray-500 hover:bg-gray-100 border border-transparent"
              }`}
            >
              {i + 1}
            </button>
          ))}
          <button
            disabled={currentPage === totalPages || totalPages === 0}
            onClick={() => handlePageChange(currentPage + 1)}
            className="p-2 border border-gray-200 rounded-lg text-gray-400 hover:bg-gray-50 disabled:opacity-30 transition-colors"
          >
            <IoChevronForward size={18} />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default BlogTable;
