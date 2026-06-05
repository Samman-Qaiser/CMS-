import { useState, useEffect } from "react";
import axios from "axios";
import CreateCategoryModal from "../components/CreateCategoryModal";
import Swal from "sweetalert2";

const CreateProduct = () => {
  const baseUrl =
    import.meta.env?.VITE_BACKEND_URL || "https://cms-backend-ashen.vercel.app";

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchingCategories, setFetchingCategories] = useState(true);
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Separate state for array inputs to allow typing
  const [sizesInput, setSizesInput] = useState("");
  const [tagsInput, setTagsInput] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    description: "",
    productCode: "",
    brand: "",
    category: "",
    price: "",
    originalPrice: "",
    sizes: [],
    tags: [],
    stock: "",
    availability: "in_stock",
    isFeatured: false,
    isActive: true,
  });

  // Fetch categories on component mount
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setFetchingCategories(true);
    setError("");
    try {
      const response = await axios.get(`${baseUrl}/api/product-categories`);
      console.log("Categories API response:", response.data);

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
        } else if (typeof response.data === "object") {
          for (const key in response.data) {
            if (Array.isArray(response.data[key])) {
              categoriesData = response.data[key];
              break;
            }
          }
        }
      }

      setCategories(categoriesData);

      if (categoriesData.length === 0) {
        console.warn("No categories found in response");
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      setError("Failed to load categories. Please refresh the page.");
    } finally {
      setFetchingCategories(false);
    }
  };

  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .replace(/[^a-zA-Z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === "title") {
      // Auto-generate slug when title changes
      const newSlug = generateSlug(value);
      setFormData((prev) => ({
        ...prev,
        title: value,
        slug: newSlug,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  // Handle sizes input - allows typing with commas
  const handleSizesChange = (e) => {
    const value = e.target.value;
    setSizesInput(value);
    // Convert to array for formData
    const arrayValue = value
      .split(",")
      .map((item) => item.trim().toUpperCase())
      .filter((item) => item);
    setFormData((prev) => ({
      ...prev,
      sizes: arrayValue,
    }));
  };

  // Handle tags input - allows typing with commas
  const handleTagsChange = (e) => {
    const value = e.target.value;
    setTagsInput(value);
    // Convert to array for formData
    const arrayValue = value
      .split(",")
      .map((item) => item.trim().toUpperCase())
      .filter((item) => item);
    setFormData((prev) => ({
      ...prev,
      tags: arrayValue,
    }));
  };

  // Handle multiple image selection
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    // Add new files to existing ones (allowing multiple uploads)
    setImageFiles((prevFiles) => [...prevFiles, ...files]);

    // Create preview URLs for new files
    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews((prevPreviews) => [...prevPreviews, ...newPreviews]);
  };

  // Remove a specific image
  const removeImage = (index) => {
    // Revoke the object URL to avoid memory leaks
    URL.revokeObjectURL(imagePreviews[index]);

    // Remove from previews array
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));

    // Remove from files array
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // Reorder images (drag and drop)
  const moveImage = (fromIndex, toIndex) => {
    if (toIndex < 0 || toIndex >= imagePreviews.length) return;

    const newPreviews = [...imagePreviews];
    const newFiles = [...imageFiles];

    // Move preview
    const [movedPreview] = newPreviews.splice(fromIndex, 1);
    newPreviews.splice(toIndex, 0, movedPreview);

    // Move file
    const [movedFile] = newFiles.splice(fromIndex, 1);
    newFiles.splice(toIndex, 0, movedFile);

    setImagePreviews(newPreviews);
    setImageFiles(newFiles);
  };

  // Set primary image (first image will be primary in most systems)
  const setAsPrimary = (index) => {
    if (index === 0) return;
    moveImage(index, 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!formData.category) {
      setError("Please select a category");
      setLoading(false);
      return;
    }

    if (imageFiles.length === 0) {
      const result = await Swal.fire({
        title: "No Images",
        text: "You haven't added any product images. Continue anyway?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, continue",
        cancelButtonText: "No, add images",
      });

      if (!result.isConfirmed) {
        setLoading(false);
        return;
      }
    }

    try {
      const submitData = new FormData();

      Object.keys(formData).forEach((key) => {
        if (key === "sizes" || key === "tags") {
          if (formData[key].length > 0) {
            submitData.append(key, JSON.stringify(formData[key]));
          } else {
            submitData.append(key, JSON.stringify([]));
          }
        } else if (key === "category" && formData[key]) {
          submitData.append(key, formData[key]);
        } else if (
          formData[key] !== undefined &&
          formData[key] !== null &&
          formData[key] !== ""
        ) {
          submitData.append(key, formData[key]);
        }
      });

      // Append all images
      imageFiles.forEach((file) => {
        submitData.append("images", file);
      });

      const response = await axios.post(`${baseUrl}/api/products`, submitData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 200 || response.status === 201) {
        // Success alert with SweetAlert
        Swal.fire({
          title: "Success!",
          text: "Product created successfully!",
          icon: "success",
          confirmButtonColor: "#3085d6",
          confirmButtonText: "OK",
          timer: 2000,
          timerProgressBar: true,
        });

        // Reset form
        setFormData({
          title: "",
          slug: "",
          description: "",
          productCode: "",
          brand: "",
          category: "",
          price: "",
          originalPrice: "",
          sizes: [],
          tags: [],
          stock: "",
          availability: "in_stock",
          isFeatured: false,
          isActive: true,
        });
        setSizesInput("");
        setTagsInput("");

        // Clean up and reset images
        imagePreviews.forEach((preview) => URL.revokeObjectURL(preview));
        setImageFiles([]);
        setImagePreviews([]);
      }
    } catch (error) {
      console.error("Error creating product:", error);

      // Error alert with SweetAlert
      Swal.fire({
        title: "Error!",
        text: error.response?.data?.message || "Failed to create product",
        icon: "error",
        confirmButtonColor: "#d33",
        confirmButtonText: "Try Again",
      });

      setError(error.response?.data?.message || "Failed to create product");
    } finally {
      setLoading(false);
    }
  };

  const availableSizes = ["XS", "SM", "MD", "LG", "XL", "XXL"];

  if (fetchingCategories) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p className="mt-2 text-gray-600">Loading categories...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl text-header-text mx-auto p-6">
      {/* Header with Create Category Button */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl text-header-text font-bold">
          Create New Product
        </h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors flex items-center gap-2"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          Create Product Category
        </button>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="bg-white dark:bg-[#21233E] rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Basic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Title *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Enter product name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Slug *</label>
              <input
                type="text"
                name="slug"
                value={formData.slug}
                onChange={handleInputChange}
                required
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Auto-generated from title"
              />
              <p className="text-xs text-gray-500 mt-1">
                Slug is automatically generated from the product name
              </p>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows="3"
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Product Code
              </label>
              <input
                type="text"
                name="productCode"
                value={formData.productCode}
                onChange={handleInputChange}
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Brand</label>
              <input
                type="text"
                name="brand"
                value={formData.brand}
                onChange={handleInputChange}
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Category *
              </label>
              <div className="flex gap-2">
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                  className="flex-1  dark:bg-[#21233E] border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">Select a category</option>
                  {categories.length > 0 ? (
                    categories.map((category) => (
                      <option
                        key={category._id || category.id}
                        value={category._id || category.id}
                      >
                        {category.name}
                      </option>
                    ))
                  ) : (
                    <option disabled>No categories available</option>
                  )}
                </select>
              </div>
              {categories.length === 0 && !fetchingCategories && (
                <p className="text-xs text-red-500 mt-1">
                  No categories found. Please create a category first.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Pricing */}
        <div className="bg-white dark:bg-[#21233E] rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Pricing</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Price *</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                required
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Original Price
              </label>
              <input
                type="number"
                name="originalPrice"
                value={formData.originalPrice}
                onChange={handleInputChange}
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
        </div>

        {/* Inventory */}
        <div className="bg-white dark:bg-[#21233E] rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Inventory</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Stock</label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleInputChange}
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Availability
              </label>
              <select
                name="availability"
                value={formData.availability}
                onChange={handleInputChange}
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="in_stock">In Stock</option>
                <option value="out_of_stock">Out of Stock</option>
                <option value="pre_order">Pre Order</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Sizes (comma separated)
              </label>
              <input
                type="text"
                name="sizes"
                placeholder="e.g., XS, SM, MD"
                value={sizesInput}
                onChange={handleSizesChange}
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <p className="text-xs text-gray-500 mt-1">
                Available sizes: {availableSizes.join(", ")}
              </p>
              {formData.sizes.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {formData.sizes.map((size, idx) => (
                    <span
                      key={idx}
                      className="text-xs bg-primary text-white px-2 py-1 rounded"
                    >
                      {size}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Tags (comma separated)
              </label>
              <input
                type="text"
                name="tags"
                placeholder="e.g., BAGS, CLOTHES, SHOES"
                value={tagsInput}
                onChange={handleTagsChange}
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              />
              {formData.tags.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {formData.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="text-xs bg-primary text-white px-2 py-1 rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Images - Enhanced Multiple Upload */}
        <div className="bg-white dark:bg-[#21233E] rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Product Images</h2>

          {/* Upload Area */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">
              Upload Images (Multiple files allowed)
            </label>
            <input
              type="file"
              name="images"
              accept="image/*"
              multiple
              onChange={handleImageChange}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <p className="text-xs text-gray-500 mt-1">
              You can select multiple images at once. Supported formats: JPG,
              PNG, GIF, WebP
            </p>
          </div>

          {/* Image Preview Grid */}
          {imagePreviews.length > 0 && (
            <div>
              <div className="flex justify-between items-center mb-3">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {imagePreviews.length} image
                  {imagePreviews.length !== 1 ? "s" : ""} selected
                </p>
                <p className="text-xs text-gray-500">
                  ★ Click to set as primary
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {imagePreviews.map((preview, index) => (
                  <div key={index} className="relative group">
                    {/* Image */}
                    <div className="relative aspect-square rounded-lg overflow-hidden border-2 border-gray-200 hover:border-primary transition-colors">
                      <img
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-full object-cover"
                      />

                      {/* Primary Badge */}
                      {index === 0 && (
                        <div className="absolute top-2 left-2 bg-primary text-white text-xs px-2 py-1 rounded-full">
                          Primary
                        </div>
                      )}

                      {/* Overlay Controls */}
                      <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        {/* Set as Primary Button */}
                        {index !== 0 && (
                          <button
                            type="button"
                            onClick={() => setAsPrimary(index)}
                            className="bg-primary text-white p-2 rounded-full hover:bg-primary-dark transition-colors"
                            title="Set as primary image"
                          >
                            <svg
                              className="w-4 h-4"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          </button>
                        )}

                        {/* Remove Button */}
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                          title="Remove image"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>

                    {/* Image Number */}
                    <p className="text-xs text-center text-gray-500 mt-1">
                      Image {index + 1}
                    </p>
                  </div>
                ))}
              </div>

              {/* Instructions */}
              <div className="mt-4 p-3 bg-primary/10 rounded-lg">
                <p className="text-xs text-primary">
                  💡 <strong>Tips:</strong> The first image will be used as the
                  primary product image. Use the ★ button to change the primary
                  image.
                </p>
              </div>
            </div>
          )}

          {/* No Images Message */}
          {imagePreviews.length === 0 && (
            <div className="mt-2 p-8 border-2 border-dashed border-gray-300 rounded-lg text-center">
              <svg
                className="w-12 h-12 mx-auto text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <p className="mt-2 text-sm text-gray-500">
                No images selected. Click above to upload product images.
              </p>
            </div>
          )}
        </div>

        {/* Status */}
        <div className="bg-white dark:bg-[#21233E] rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Status</h2>
          <div className="flex gap-6">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="isFeatured"
                checked={formData.isFeatured}
                onChange={handleInputChange}
                className="w-4 h-4"
              />
              <span>Featured Product</span>
            </label>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="isActive"
                checked={formData.isActive}
                onChange={handleInputChange}
                className="w-4 h-4"
              />
              <span>Active Product</span>
            </label>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end gap-4">
          {imagePreviews.length > 0 && (
            <div className="text-sm text-gray-500 self-center">
              {imagePreviews.length} image
              {imagePreviews.length !== 1 ? "s" : ""} will be uploaded
            </div>
          )}
          <button
            type="submit"
            disabled={loading}
            className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-dark disabled:bg-gray-300 transition-colors"
          >
            {loading ? "Creating..." : "Create Product"}
          </button>
        </div>
      </form>

      {/* Create Category Modal Component */}
      <CreateCategoryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCategoryCreated={fetchCategories}
      />
    </div>
  );
};

export default CreateProduct;
