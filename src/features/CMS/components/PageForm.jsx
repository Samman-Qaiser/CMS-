import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import { IoChevronUp } from "react-icons/io5";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import FormSection from "./FormSection";
import { useSelector } from "react-redux";
import axios from "axios";
import Swal from "sweetalert2";

const PageForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);
  const [isLoading, setIsLoading] = useState(false);
  const currentUser = useSelector((state) => state.auth.user);

  const baseUrl =
    import.meta.env?.VITE_BACKEND_URL || "https://cms-backend-ashen.vercel.app";

  const { register, handleSubmit, control, reset } = useForm({
    defaultValues: {
      title: "",
      content: "",
      excerpt: "",
      slug: "",
      author: currentUser?._id || currentUser?.id || "",
      status: "draft", // Matches Mongoose schema default fallback
      visibility: "public",
      publishOn: "",
      metaTitle: "",
      metaKeywords: "",
      metaDescription: "",
      order: 0,
    },
  });

  const [isOptionsOpen, setIsOptionsOpen] = useState(true);
  const [featuredImage, setFeaturedImage] = useState(null); // Used for image preview URI
  const [imageFile, setImageFile] = useState(null); // Used for raw upload file binary

  const [screenOptions, setScreenOptions] = useState({
    PageAttributes: false,
    PageType: false,
    FeaturedImage: true,
    Slug: true,
    Excerpt: true,
    CustomFields: false,
    Discussion: false,
    Author: true,
    SEO: true,
  });

  const getSwalThemeColors = () => {
    const isDark = document.documentElement.classList.contains("dark");
    return {
      background: isDark ? "#292d4a" : "#fff",
      color: isDark ? "#fff" : "#000",
    };
  };

  // Cleanup object URLs to avoid memory leaks
  useEffect(() => {
    return () => {
      if (featuredImage && featuredImage.startsWith("blob:")) {
        URL.revokeObjectURL(featuredImage);
      }
    };
  }, [featuredImage]);

  // --- Data Fetching and Reset Sync Module ---
  useEffect(() => {
    if (isEditMode) {
      const fetchPageData = async () => {
        try {
          const response = await axios.get(`${baseUrl}/api/pages/${id}`);

          console.log("Full API Response Payload:", response.data);

          const pageData =
            response.data?.page || response.data?.data || response.data;

          if (pageData) {
            reset({
              title: pageData.title || "",
              content: pageData.content || "",
              excerpt: pageData.excerpt || "",
              slug: pageData.slug || "",
              author:
                typeof pageData.author === "object"
                  ? pageData.author?._id || pageData.author?.id || ""
                  : pageData.author || "",
              status: pageData.status || "draft",
              visibility: pageData.visibility || "public",
              // Map backend "publishedAt" down to frontend "publishOn" input element
              publishOn: pageData.publishedAt
                ? pageData.publishedAt.split("T")[0]
                : "",
              metaTitle: pageData.metaTitle || "",
              metaKeywords: pageData.metaKeywords || "",
              metaDescription: pageData.metaDescription || "",
              order: Number(pageData.order) || 0,
            });

            // Handle Image Previews safely
            if (pageData.featuredImage) {
              const imageUrl = pageData.featuredImage.startsWith("http")
                ? pageData.featuredImage
                : `${baseUrl}/${pageData.featuredImage}`;
              setFeaturedImage(imageUrl);
            }
          }
        } catch (error) {
          console.error("Error fetching page data:", error);
          Swal.fire({
            icon: "error",
            title: "Failed to load page details",
            text:
              error.response?.data?.message || "An unexpected error occurred.",
            ...getSwalThemeColors(),
          });
        }
      };

      fetchPageData();
    }
  }, [id, isEditMode, reset, baseUrl]);

  // --- Process and Submit Handler ---
  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const url = isEditMode
        ? `${baseUrl}/api/pages/${id}`
        : `${baseUrl}/api/pages`;

      const finalAuthor = data.author || "6a0afff01777cf4ad2216901";

      // 1. Compile schema-compliant clean payload data structure
      const cleanData = {
        ...data,
        author: finalAuthor,
        publishedAt: data.publishOn || null, // Remap field correctly to Mongoose schema target
        order: Number(data.order) || 0,
      };
      delete cleanData.publishOn; // Purge unmapped reference from transmission

      let response;

      // 2. Transmit through FormData or JSON conditional structures
      if (imageFile || typeof featuredImage === "string") {
        const formData = new FormData();

        Object.keys(cleanData).forEach((key) => {
          if (cleanData[key] !== undefined && cleanData[key] !== null) {
            formData.append(key, cleanData[key]);
          }
        });

        if (imageFile) {
          formData.append("featuredImage", imageFile);
        } else if (featuredImage && !featuredImage.startsWith("blob:")) {
          formData.append(
            "featuredImage",
            featuredImage.replace(`${baseUrl}/`, ""),
          );
        }

        const config = { headers: { "Content-Type": "multipart/form-data" } };
        if (isEditMode) {
          response = await axios.put(url, formData, config);
        } else {
          response = await axios.post(url, formData, config);
        }
      } else {
        const config = { headers: { "Content-Type": "application/json" } };
        if (isEditMode) {
          response = await axios.put(url, cleanData, config);
        } else {
          response = await axios.post(url, cleanData, config);
        }
      }

      Swal.fire({
        icon: "success",
        title: isEditMode ? "Page Updated!" : "Page Created!",
        showConfirmButton: false,
        timer: 1500,
        ...getSwalThemeColors(),
      });

      setTimeout(() => {
        navigate("/dashboard/pages");
      }, 1500);
    } catch (error) {
      console.error("API Processing Error:", error);
      Swal.fire({
        icon: "error",
        title: "Submission Failed",
        text:
          error.response?.data?.message ||
          "Could not connect to the database schema accurately.",
        ...getSwalThemeColors(),
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (featuredImage && featuredImage.startsWith("blob:")) {
        URL.revokeObjectURL(featuredImage);
      }
      setImageFile(file);
      setFeaturedImage(URL.createObjectURL(file));
    }
  };

  return (
    <div className="p-6">
      {/* Screen Options Panel */}
      <div className="bg-white dark:bg-[#292d4a] rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 mb-6 overflow-hidden">
        <div
          className="p-4 flex justify-between items-center cursor-pointer hover:bg-gray-50 dark:hover:bg-white/5"
          onClick={() => setIsOptionsOpen(!isOptionsOpen)}
        >
          <h3 className="text-primary font-semibold text-lg">Screen Options</h3>
          <motion.div
            animate={{ rotate: isOptionsOpen ? 0 : 180 }}
            transition={{ duration: 0.2 }}
          >
            <IoChevronUp className="text-primary" size={20} />
          </motion.div>
        </div>
        <AnimatePresence initial={false}>
          {isOptionsOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="px-6 pb-6 overflow-hidden"
            >
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {Object.keys(screenOptions).map((option) => (
                  <label
                    key={option}
                    className="flex items-center space-x-3 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={screenOptions[option]}
                      onChange={() =>
                        setScreenOptions((prev) => ({
                          ...prev,
                          [option]: !prev[option],
                        }))
                      }
                      className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary dark:bg-[#1e2235] dark:border-gray-600"
                    />
                    <span
                      className={`text-sm ${screenOptions[option] ? "text-gray-700 dark:text-gray-200" : "text-gray-400"}`}
                    >
                      {option.replace(/([A-Z])/g, " $1").trim()}
                    </span>
                  </label>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Header breadcrumb row */}
      <div className="bg-white dark:bg-[#292d4a] p-6 rounded-xl mb-6 shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-primary dark:text-white">
              Pages
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              {isEditMode ? "Edit Page" : "Add Page"}
            </p>
          </div>
          <div className="flex items-center text-sm font-medium">
            <Link
              to="/dashboard/pages"
              className="text-gray-500 hover:text-primary dark:hover:text-white transition-colors"
            >
              Pages
            </Link>
            <span className="mx-2 text-gray-400">/</span>
            <span className="text-primary dark:text-purple-400">
              {isEditMode ? "Edit Page" : "Add Page"}
            </span>
          </div>
        </div>
      </div>

      {/* Main Layout Form Grid */}
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <FormSection title={isEditMode ? "Edit Page" : "Create Page"}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
                  Title
                </label>
                <input
                  {...register("title", { required: true })}
                  type="text"
                  className="w-full p-2 border rounded-lg dark:bg-[#1e2235] dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/40"
                  placeholder="Page Title"
                />
              </div>
              <div className="prose max-w-none dark:text-white unique-editor-wrapper">
                <Controller
                  name="content"
                  control={control}
                  render={({ field }) => (
                    <CKEditor
                      editor={ClassicEditor}
                      data={field.value || ""}
                      onChange={(event, editor) =>
                        field.onChange(editor.getData())
                      }
                      onReady={(editor) => {
                        editor.editing.view.change((writer) => {
                          writer.setStyle(
                            "height",
                            "300px",
                            editor.editing.view.document.getRoot(),
                          );
                        });
                      }}
                    />
                  )}
                />
              </div>
            </FormSection>

            {screenOptions.Excerpt && (
              <FormSection title="Excerpt">
                <textarea
                  {...register("excerpt")}
                  rows="4"
                  className="w-full border rounded-lg p-3 dark:bg-[#1e2235] dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
              </FormSection>
            )}

            {screenOptions.Slug && (
              <FormSection title="Slug">
                <input
                  {...register("slug")}
                  type="text"
                  className="w-full border rounded-lg p-2 dark:bg-[#1e2235] dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
              </FormSection>
            )}

            {screenOptions.Author && (
              <FormSection title="Author">
                <input
                  {...register("author")}
                  type="text"
                  placeholder="Paste User ID (e.g. 6a0afff01777cf4ad2216901)"
                  className="w-full border rounded-lg p-2 dark:bg-[#1e2235] dark:border-gray-600 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
              </FormSection>
            )}

            {screenOptions.SEO && (
              <FormSection title="SEO Settings">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1">
                      Meta Title
                    </label>
                    <input
                      {...register("metaTitle")}
                      type="text"
                      className="w-full border rounded-lg p-2 dark:bg-[#1e2235] dark:border-gray-600 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1">
                      Meta Keywords
                    </label>
                    <textarea
                      {...register("metaKeywords")}
                      rows="3"
                      className="w-full border rounded-lg p-2 dark:bg-[#1e2235] dark:border-gray-600 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1">
                      Meta Description
                    </label>
                    <textarea
                      {...register("metaDescription")}
                      rows="3"
                      className="w-full border rounded-lg p-2 dark:bg-[#1e2235] dark:border-gray-600 dark:text-white"
                    />
                  </div>
                </div>
              </FormSection>
            )}
          </div>

          {/* Sidebar Section */}
          <div className="space-y-6">
            <FormSection title="Publish Configurations">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1">
                    Status
                  </label>
                  <select
                    {...register("status")}
                    className="w-full border rounded-lg p-2 dark:bg-[#1e2235] dark:border-gray-600 dark:text-white"
                  >
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1">
                    Visibility
                  </label>
                  <select
                    {...register("visibility")}
                    className="w-full border rounded-lg p-2 dark:bg-[#1e2235] dark:border-gray-600 dark:text-white"
                  >
                    <option value="public">Public</option>
                    <option value="private">Private</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1">
                    Order Hierarchy
                  </label>
                  <input
                    {...register("order")}
                    type="number"
                    className="w-full border rounded-lg p-2 dark:bg-[#1e2235] dark:border-gray-600 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1">
                    Published On Date
                  </label>
                  <input
                    {...register("publishOn")}
                    type="date"
                    className="w-full border rounded-lg p-2 dark:bg-[#1e2235] dark:border-gray-600 dark:text-white"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-primary text-white py-2 rounded-lg font-bold mt-2 hover:bg-primary/90 transition-colors disabled:opacity-50"
                >
                  {isLoading
                    ? "Processing..."
                    : isEditMode
                      ? "Update Page"
                      : "Create Page"}
                </button>
              </div>
            </FormSection>

            {screenOptions.FeaturedImage && (
              <FormSection title="Featured Image">
                <div className="border-2 border-dashed border-gray-100 rounded-xl p-4 text-center text-gray-400 mb-4 dark:border-gray-700 min-h-[200px] flex items-center justify-center overflow-hidden bg-gray-50 dark:bg-[#1e2235]">
                  {featuredImage ? (
                    <img
                      src={featuredImage}
                      alt="Preview"
                      className="max-w-full max-h-[180px] rounded-lg object-cover shadow-sm"
                    />
                  ) : (
                    <span className="text-sm">No preview available</span>
                  )}
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="text-sm block w-full file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-primary/10 file:text-primary dark:file:bg-white/10 dark:file:text-white cursor-pointer"
                />
              </FormSection>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

export default PageForm;
