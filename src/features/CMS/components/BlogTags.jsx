import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { BsTrash, BsPencilSquare } from "react-icons/bs";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";
import Swal from "sweetalert2";
import { tagsData } from "./blogsData";
import axios from "axios";

const BlogTags = () => {
  const baseUrl =
    import.meta.env?.VITE_BACKEND_URL || "https://cms-backend-ashen.vercel.app";

  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [editingTag, setEditingTag] = useState(null);

  // Initializing state 
  const [formData, setFormData] = useState({ name: "", slug: "" });

  const fetchTags = async () => {
    try {
      const res = await axios.get(`${baseUrl}/api/tags`);
      setTags(res.data.tags || []);
    } catch (err) {
      Swal.fire("Error", "Could not fetch tags", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTags();
  }, []);

  const handleNameChange = (val) => {
    setFormData({
      ...formData,
      name: val,
      slug: val
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, ""),
    });
  };

  const handleEdit = (tag) => {
    setEditingTag(tag);
    setFormData({ name: tag.name, slug: tag.slug });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingTag) {
        await axios.put(`${baseUrl}/api/tags/${editingTag._id}`, formData);
        Swal.fire("Updated!", "Tag updated.", "success");
      } else {
        await axios.post(`${baseUrl}/api/tags`, formData);
        Swal.fire("Added!", "New tag created.", "success");
      }
      setEditingTag(null);
      setFormData({ name: "", slug: "" });
      fetchTags();
    } catch (err) {
      Swal.fire("Error", "Operation failed. Check inputs.", "error");
      setLoading(false);
    }
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: `Delete this tag?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`${baseUrl}/api/tags/${id}`);
          fetchTags();
        } catch (err) {
          Swal.fire("Error", "Could not delete", "error");
        }
      }
    });
  };

  const handleSearch = async () => {
    try {
      const res = await axios.get(`${baseUrl}/api/tags`);
      const allTags = res.data.tags || [];
      const filtered = allTags.filter(
        (tag) =>
          tag.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          tag.slug.toLowerCase().includes(searchQuery.toLowerCase()),
      );
      setTags(filtered);
      setCurrentPage(1);
    } catch (err) {
      Swal.fire("Error", "Search failed", "error");
    }
  };

  // Pagination and selection logic 
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = tags.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(tags.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
      setSelectedTags([]);
    }
  };

 const handleSelectAll = (e) => {
   if (e.target.checked) {
     setSelectedTags(currentItems.map((t) => t._id)); 
   } else {
     setSelectedTags([]);
   }
 };

 const handleCheckboxChange = (id) => {
   setSelectedTags((prev) =>
     prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
   );
 };

  return (
    <div className="p-6">
      {/* 1st Row: Heading */}
      <div className="bg-white dark:bg-[#292d4a] p-6 rounded-xl mb-6 shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-primary">Blog Tags</h2>
            <p className="text-gray-500 text-sm">all tags</p>
          </div>
          <div className="flex items-center text-sm font-medium">
            <Link to="/dashboard" className="text-gray-500">
              Dashboard
            </Link>
            <span className="mx-2 text-gray-400">/</span>
            <span className="text-primary">Tags</span>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Left Column: Form */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-[#292d4a] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
              <h3 className="text-lg font-bold text-primary mb-6">
                {editingTag ? "Edit Tag" : "Add Tag"}
              </h3>
              <form className="space-y-5" onSubmit={handleSubmit}>
                <div>
                  <label className="text-sm font-semibold text-gray-600 dark:text-gray-300 block mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    className="w-full p-2.5 border rounded-lg dark:bg-[#1e2235] dark:border-gray-600 outline-none focus:border-primary transition-all text-sm"
                    placeholder="Tag name"
                    required
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="bg-primary text-white px-6 py-2.5 rounded-lg font-bold hover:bg-opacity-90 transition-all text-sm mt-2 flex-1"
                  >
                    {editingTag ? "Update" : "Save"}
                  </button>
                  {editingTag && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingTag(null);
                        setFormData({ name: "", slug: "" });
                      }}
                      className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-6 py-2.5 rounded-lg font-bold hover:bg-opacity-90 transition-all text-sm mt-2 flex-1"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>

          {/* Right Column: Table */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-[#292d4a] rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden"
            >
              <div className="p-6 flex flex-col md:flex-row justify-between items-center gap-4 border-b border-gray-50 dark:border-gray-800">
                <h2 className="text-xl font-semibold text-primary">
                  Tags List
                </h2>
                <div className="flex gap-2 w-full md:w-auto">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search tags..."
                    className="px-4 py-2 border rounded-lg dark:bg-[#1e2235] dark:border-gray-600 outline-none text-sm w-full md:w-64"
                  />
                  <button
                    onClick={handleSearch}
                    className="bg-primary text-white px-4 py-2 rounded-lg font-semibold text-sm shadow-lg shadow-primary/20 hover:bg-opacity-90 transition-all"
                  >
                    Search
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="text-content-text font-semibold text-sm border-b border-gray-50 dark:border-gray-800">
                      <th className="py-4 px-2 pl-8">
                        <input
                          type="checkbox"
                          onChange={handleSelectAll}
                          checked={
                            selectedTags.length === currentItems.length &&
                            currentItems.length > 0
                          }
                        />
                      </th>
                      <th className="py-4 px-2 text-sm font-medium">Name</th>
                      <th className="py-4 px-2 text-sm font-medium">
                        Created At
                      </th>
                      <th className="py-4 px-2 text-sm font-medium">Slug</th>
                      <th className="py-4 px-2 text-sm font-medium">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                    {currentItems.map((tag) => (
                      <tr
                        key={tag._id}
                        className="hover:bg-gray-50/50 dark:hover:bg-white/5 transition-colors"
                      >
                        <td className="py-4 px-2 pl-8">
                          <input
                            type="checkbox"
                            checked={selectedTags.includes(tag._id)}
                            onChange={() => handleCheckboxChange(tag._id)}
                          />
                        </td>
                        <td className="py-4 px-2 text-[13px] font-medium text-gray-600 dark:text-gray-300">
                          {tag.name}
                        </td>
                        <td className="py-4 px-2 text-[12px] text-gray-500 italic">
                          {tag.createdAt ? new Date(tag.createdAt).toLocaleDateString() : "N/A"}
                        </td>
                        <td className="py-4 px-2 text-[12px] text-gray-500">
                          <span className="px-2 py-1 rounded-md bg-gray-100 dark:bg-gray-800">
                            {tag.slug}
                          </span>
                        </td>
                        <td className="py-4 px-2 text-[12px]">
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEdit(tag)}
                              className="p-2 cursor-pointer bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors"
                            >
                              <BsPencilSquare size={16} />
                            </button>
                            <button
                              onClick={() => handleDelete(tag._id)}
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
                      className={`w-8 h-8 flex items-center justify-center rounded-lg font-semibold transition-all ${currentPage === index + 1 ? "bg-primary text-white shadow-md shadow-primary/30 scale-110" : "border border-gray-200 dark:border-gray-700 hover:bg-primary/10"}`}
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
        </div>
      )}
    </div>
  );
};

export default BlogTags;
