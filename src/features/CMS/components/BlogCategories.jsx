import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { BsTrash, BsPencilSquare } from "react-icons/bs";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";
import { categoriesData } from "./blogsData";
import Swal from "sweetalert2";

const BlogCategories = () => {
  const [categories, setCategories] = useState(categoriesData);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCats, setSelectedCats] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // filters data based on the state
  const handleSearch = () => {
    const filtered = categoriesData.filter(
      (cat) =>
        cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cat.slug.toLowerCase().includes(searchQuery.toLowerCase()),
    );
    setCategories(filtered);
    setCurrentPage(1);
  };
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = categories.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(categories.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
      setSelectedCats([]);
    }
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedCats(currentItems.map((c) => c.id));
    } else {
      setSelectedCats([]);
    }
  };

  const handleCheckboxChange = (id) => {
    setSelectedCats((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const handleDelete = (name) => {
    Swal.fire({
      title: "Are you sure?",
      text: `Delete ${name}?`,
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
        Swal.fire("Deleted!", "Category removed.", "success");
      }
    });
  };

  return (
    <div className="p-6">
      {/* 1st Row: Heading */}
      <div className="bg-white dark:bg-[#292d4a] p-6 rounded-xl mb-6 shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-primary">Blog Categories</h2>
            <p className="text-gray-500 text-sm">all categories</p>
          </div>
          <div className="flex items-center text-sm font-medium">
            <Link to="/dashboard" className="text-gray-500">
              Dashboard
            </Link>
            <span className="mx-2 text-gray-400">/</span>
            <span className="text-primary">Categories</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Column: Add Category Form */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-[#292d4a] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
            <h3 className="text-lg font-bold text-primary mb-6">
              Add Category
            </h3>
            <form className="space-y-5">
              <div>
                <label className="text-sm font-semibold text-gray-600 dark:text-gray-300 block mb-2">
                  Parent Category
                </label>
                <select className="w-full p-2.5 border rounded-lg dark:bg-[#1e2235] dark:border-gray-600 outline-none text-sm text-gray-500">
                  <option value="None">None</option>
                  {categoriesData.map((cat) => (
                    <option key={cat.id} value={cat.name}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-600 dark:text-gray-300 block mb-2">
                  Name
                </label>
                <input
                  type="text"
                  className="w-full p-2.5 border rounded-lg dark:bg-[#1e2235] dark:border-gray-600 outline-none focus:border-primary transition-all text-sm"
                  placeholder="Category name"
                />
              </div>
              <button
                type="submit"
                className="bg-primary text-white px-6 py-2.5 rounded-lg font-bold hover:bg-opacity-90 transition-all text-sm mt-2"
              >
                Save
              </button>
            </form>
          </div>
        </div>

        <div className="lg:col-span-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-[#292d4a] rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden"
          >
            {/* Header Action Bar  */}
            <div className="p-6 flex flex-col md:flex-row justify-between items-center gap-4 border-b border-gray-50 dark:border-gray-800">
              <h2 className="text-xl font-semibold text-primary">Categories</h2>
              <div className="flex gap-2 w-full md:w-auto">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search..."
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

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="text-content-text font-semibold text-sm border-b border-gray-50 dark:border-gray-800">
                    <th className="py-4 px-2 pl-8">
                      <input
                        type="checkbox"
                        onChange={handleSelectAll}
                        checked={
                          selectedCats.length === currentItems.length &&
                          currentItems.length > 0
                        }
                      />
                    </th>
                    <th className="py-4 px-2 text-sm font-medium">Name</th>
                    <th className="py-4 px-2 text-sm font-medium">
                      Description
                    </th>
                    <th className="py-4 px-2 text-sm font-medium">Slug</th>
                    <th className="py-4 px-2 text-sm font-medium text-center">
                      Count
                    </th>
                    <th className="py-4 px-2 text-sm font-medium">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                  {currentItems.map((cat) => (
                    <tr
                      key={cat.id}
                      className="hover:bg-gray-50/50 dark:hover:bg-white/5 transition-colors"
                    >
                      <td className="py-4 px-2 pl-8">
                        <input
                          type="checkbox"
                          checked={selectedCats.includes(cat.id)}
                          onChange={() => handleCheckboxChange(cat.id)}
                        />
                      </td>
                      <td className="py-4 px-2 text-[12px] font-medium text-gray-600 dark:text-gray-300">
                        {cat.name}
                      </td>
                      <td className="py-4 px-2 text-[12px] text-gray-500">
                        {cat.description || "—"}
                      </td>
                      <td className="py-4 px-2 text-[12px] text-gray-500">
                        {cat.slug}
                      </td>
                      <td className="py-4 px-2 text-[12px] text-center">
                        <span className="px-2 py-1 rounded bg-gray-100 dark:bg-gray-700 text-xs font-medium">
                          {cat.count}
                        </span>
                      </td>
                      <td className="py-4 px-2 text-[12px]">
                        <div className="flex gap-2">
                          <button className="p-2 cursor-pointer bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors">
                            <BsPencilSquare size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(cat.name)}
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

            {/* Pagination Footer */}
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
                        : "border border-gray-200 dark:border-gray-700 hover:bg-primary/10"
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
        </div>
      </div>
    </div>
  );
};

export default BlogCategories;
