import { useState, useEffect } from "react";
import axios from "axios";

const CreateCategoryModal = ({ isOpen, onClose, onCategoryCreated }) => {
  const baseUrl =
    import.meta.env?.VITE_BACKEND_URL || "https://cms-backend-ashen.vercel.app";

  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [error, setError] = useState("");
  const [categories, setCategories] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    parentCategory: "",
    isActive: true,
  });

  // Fetch categories for parent category dropdown
  useEffect(() => {
    if (isOpen) {
      fetchCategories();
    }
  }, [isOpen]);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${baseUrl}/api/product-categories`);
      let categoriesData = [];
      if (response.data) {
        if (Array.isArray(response.data)) {
          categoriesData = response.data;
        } else if (response.data.data && Array.isArray(response.data.data)) {
          categoriesData = response.data.data;
        } else if (
          response.data.categories &&
          Array.isArray(response.data.categories)
        ) {
          categoriesData = response.data.categories;
        } else if (response.data.docs && Array.isArray(response.data.docs)) {
          categoriesData = response.data.docs;
        }
      }
      setCategories(categoriesData);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  // Generate slug from name
  const generateSlug = (name) => {
    return name
      .toLowerCase()
      .replace(/[^a-zA-Z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleNameBlur = () => {
    if (formData.name && !formData.slug) {
      setFormData((prev) => ({
        ...prev,
        slug: generateSlug(prev.name),
      }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const preview = URL.createObjectURL(file);
      setImagePreview(preview);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!formData.name) {
      setError("Category name is required");
      setLoading(false);
      return;
    }

    if (!formData.slug) {
      setError("Slug is required");
      setLoading(false);
      return;
    }

    try {
      const submitData = new FormData();
      submitData.append("name", formData.name);
      submitData.append("slug", formData.slug);
      if (formData.description) {
        submitData.append("description", formData.description);
      }
      if (formData.parentCategory) {
        submitData.append("parentCategory", formData.parentCategory);
      }
      submitData.append("isActive", formData.isActive);
      if (imageFile) {
        submitData.append("image", imageFile);
      }

      const response = await axios.post(
        `${baseUrl}/api/product-categories`,
        submitData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      if (response.status === 200 || response.status === 201) {
        // Reset form
        setFormData({
          name: "",
          slug: "",
          description: "",
          parentCategory: "",
          isActive: true,
        });
        setImageFile(null);
        setImagePreview(null);

        // Notify parent component
        if (onCategoryCreated) {
          onCategoryCreated();
        }

        onClose();
      }
    } catch (error) {
      console.error("Error creating category:", error);
      setError(error.response?.data?.message || "Failed to create category");
    } finally {
      setLoading(false);
    }
  };

  // Handle backdrop click
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto"
      onClick={handleBackdropClick}
    >
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div className="fixed inset-0 bg-black/20 transition-opacity"></div>

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen">
          &#8203;
        </span>

        <div
          className="inline-block overflow-hidden text-left align-bottom transition-all transform bg-white dark:bg-[#21233E] rounded-lg shadow-xl sm:my-8 sm:align-middle sm:max-w-lg sm:w-full relative z-10"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-header-text">
              Create Product Category
            </h3>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="px-6 py-4 space-y-4 max-h-[60vh] overflow-y-auto">
              {error && (
                <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium mb-1">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  onBlur={handleNameBlur}
                  required
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Electronics, Clothing, Books"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Slug <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="slug"
                  value={formData.slug}
                  onChange={handleInputChange}
                  required
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., electronics, clothing, books"
                />
                <p className="text-xs text-gray-500 mt-1">
                  URL-friendly version of the name
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Brief description of the category"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Parent Category
                </label>
                <select
                  name="parentCategory"
                  value={formData.parentCategory}
                  onChange={handleInputChange}
                  className="w-full  dark:bg-[#21233E] border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">None (Top Level Category)</option>
                  {categories.map((category) => (
                    <option
                      key={category._id || category.id}
                      value={category._id || category.id}
                    >
                      {category.name}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  Select a parent category if this is a subcategory
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Category Image
                </label>
                <input
                  type="file"
                  name="image"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {imagePreview && (
                  <div className="mt-2">
                    <img
                      src={imagePreview}
                      alt="Category preview"
                      className="w-32 h-32 object-cover rounded-lg border"
                    />
                  </div>
                )}
              </div>

              <div className="flex items-center">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleInputChange}
                    className="w-4 h-4"
                  />
                  <span className="text-sm font-medium">Active</span>
                </label>
              </div>
            </div>

            <div className="flex justify-end gap-3 px-6 py-4 bg-gray-50  dark:bg-[#21233E] rounded-b-lg">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 text-white bg-primary rounded-lg hover:bg-primary-dark disabled:bg-primary-light transition-colors"
              >
                {loading ? "Creating..." : "Create Category"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateCategoryModal;
