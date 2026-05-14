import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const Reading = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    showOnFront: "Blog",
    nodePerPage: "7",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = (e) => {
    e.preventDefault();

    Swal.fire({
      title: "Success!",
      text: "Reading configurations have been updated.",
      icon: "success",
      confirmButtonColor: "var(--primary)",
      background: document.documentElement.classList.contains("dark")
        ? "#292d4a"
        : "#fff",
      color: document.documentElement.classList.contains("dark")
        ? "#fff"
        : "#545454",
    });
  };

  return (
    <div className="bg-white dark:bg-[#292d4a] rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden max-w-6xl mx-auto">
      {/* Card Header */}
      <div className="py-6 px-8 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
        <h3 className="text-primary font-medium text-lg">Configurations</h3>
        <button
          onClick={() => navigate("/dashboard/configurations/add-config")}
          className="bg-primary text-white px-6 py-2 rounded-lg font-semibold hover:opacity-90 transition-all active:scale-95 text-sm"
        >
          Add Config
        </button>
      </div>

      {/* Form Content */}
      <form onSubmit={handleSave} className="p-8 space-y-8">
        <div className="space-y-6">
          {/* Show On Front Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-4">
            <label className="text-content-text font-medium text-sm">
              Show On Front
            </label>
            <div className="md:col-span-2">
              <select
                name="showOnFront"
                value={formData.showOnFront}
                onChange={handleChange}
                className="w-full md:w-2/3 px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary/20 outline-none transition-all dark:bg-transparent text-content-text"
              >
                <option value="Blog">Blog</option>
                <option value="Page">Page</option>
              </select>
            </div>
          </div>

          {/* Node Per Page Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-4">
            <label className="text-content-text font-medium text-sm">
              Node Per Page
            </label>
            <div className="md:col-span-2">
              <input
                type="number"
                name="nodePerPage"
                value={formData.nodePerPage}
                onChange={handleChange}
                className="w-full md:w-2/3 px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary/20 outline-none transition-all dark:bg-transparent text-content-text"
              />
            </div>
          </div>
        </div>

        {/* Footer Action */}
        <div className="pt-6 border-t border-gray-100 dark:border-gray-700">
          <button
            type="submit"
            className="px-10 py-3 bg-primary text-white font-bold rounded-xl shadow-lg hover:opacity-90 active:scale-95 transition-all"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
};

export default Reading;
