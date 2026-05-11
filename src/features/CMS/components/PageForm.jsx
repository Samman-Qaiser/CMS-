import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import { IoChevronUp } from "react-icons/io5";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import FormSection from "./FormSection";
import { allPages } from "./pagesData";
import Swal from "sweetalert2";

const PageForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  // --- React Hook Form Setup ---
  const { register, handleSubmit, control, reset } = useForm({
    defaultValues: {
      title: "",
      content: "",
      excerpt: "",
      slug: "",
      author: "w3@admin",
      status: "Published",
      visibility: "Public",
      publishOn: "",
      seoTitle: "",
      seoDescription: "",
    },
  });

  const [isOptionsOpen, setIsOptionsOpen] = useState(true);
  const [featuredImage, setFeaturedImage] = useState(null);
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

  // --- Load Data for Edit Mode ---
  useEffect(() => {
    if (isEditMode) {
      const pageToEdit = allPages.find((p) => p.id === parseInt(id));
      if (pageToEdit) {
        reset({
          title: pageToEdit.title || "",
          content: pageToEdit.content || "",
          excerpt: pageToEdit.excerpt || "",
          slug: pageToEdit.slug || "",
          author: pageToEdit.author || "w3@admin",
          status: pageToEdit.status || "Published",
          visibility: pageToEdit.visibility || "Public",
          publishOn: pageToEdit.publishOn || "",
          seoTitle: pageToEdit.title || "",
          seoDescription: pageToEdit.excerpt || "",
        });
      }
    }
  }, [id, isEditMode, reset]);

  // --- Handlers ---
  const onSubmit = (data) => {
    // Your original logic preserved here
    console.log("Saving Page Data:", data);

    Swal.fire({
      icon: "success",
      title: isEditMode ? "Page Updated!" : "Page Created!",
      showConfirmButton: false,
      timer: 1500,
      background: document.documentElement.classList.contains("dark")
        ? "#292d4a"
        : "#fff",
      color: document.documentElement.classList.contains("dark")
        ? "#fff"
        : "#000",
    });

    setTimeout(() => {
      navigate("/dashboard/pages");
    }, 1500);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFeaturedImage(URL.createObjectURL(file));
    }
  };

  return (
    <div className="p-6">
      {/* Screen Options */}
      <div className="bg-white dark:bg-[#292d4a] rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 mb-6 overflow-hidden">
        <div
          className="p-4 flex justify-between items-center cursor-pointer hover:bg-gray-50 dark:hover:bg-white/5"
          onClick={() => setIsOptionsOpen(!isOptionsOpen)}
        >
          <h3 className="text-primary font-semibold text-lg">Screen Options</h3>
          <motion.div animate={{ rotate: isOptionsOpen ? 0 : 180 }}>
            <IoChevronUp className="text-primary" size={20} />
          </motion.div>
        </div>
        <AnimatePresence>
          {isOptionsOpen && (
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: "auto" }}
              exit={{ height: 0 }}
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
                      className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <span
                      className={`text-sm ${screenOptions[option] ? "text-gray-700" : "text-gray-400"}`}
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

      {/* Header Section */}
      <div className="bg-white dark:bg-[#292d4a] p-6 rounded-xl mb-6 shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-primary">Pages</h2>
            <p className="text-gray-500 text-sm">
              {isEditMode ? "Edit Page" : "Add Page"}
            </p>
          </div>
          <div className="flex items-center text-sm font-medium">
            <Link
              to="/dashboard/pages"
              className="text-gray-500 hover:text-primary transition-colors"
            >
              Pages
            </Link>
            <span className="mx-2 text-gray-400">/</span>
            <span className="text-primary">
              {isEditMode ? "Edit Page" : "Add Page"}
            </span>
          </div>
        </div>
      </div>

      {/* Main Form */}
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <FormSection title={isEditMode ? "Edit Page" : "Create Page"}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Title
                </label>
                <input
                  {...register("title", { required: true })}
                  type="text"
                  className="w-full p-2 border rounded-lg dark:bg-[#1e2235] dark:border-gray-600"
                  placeholder="Page Title"
                />
              </div>
              <div className="prose max-w-none dark:text-white">
                <Controller
                  name="content"
                  control={control}
                  render={({ field }) => (
                    <CKEditor
                      editor={ClassicEditor}
                      data={field.value}
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
                  className="w-full border rounded-lg p-3 dark:bg-[#1e2235] dark:border-gray-600"
                />
              </FormSection>
            )}

            {screenOptions.Slug && (
              <FormSection title="Slug">
                <input
                  {...register("slug")}
                  type="text"
                  className="w-full border rounded-lg p-2 dark:bg-[#1e2235] dark:border-gray-600"
                />
              </FormSection>
            )}

            {screenOptions.Author && (
              <FormSection title="Author">
                <select
                  {...register("author")}
                  className="w-full border rounded-lg p-2 dark:bg-[#1e2235] dark:border-gray-600"
                >
                  <option value="w3@admin">w3@admin</option>
                  <option value="w3@manager">w3@manager</option>
                  <option value="w3@customer">w3@customer</option>
                </select>
              </FormSection>
            )}

            {screenOptions.SEO && (
              <FormSection title="SEO">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-500 mb-1">
                      Page Title
                    </label>
                    <input
                      {...register("seoTitle")}
                      type="text"
                      className="w-full border rounded-lg p-2 dark:bg-[#1e2235]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-500 mb-1">
                      Meta Descriptions
                    </label>
                    <textarea
                      {...register("seoDescription")}
                      rows="3"
                      className="w-full border rounded-lg p-2 dark:bg-[#1e2235]"
                    />
                  </div>
                </div>
              </FormSection>
            )}
          </div>

          <div className="space-y-6">
            <FormSection title="Publish">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-500 mb-1">
                    Status
                  </label>
                  <select
                    {...register("status")}
                    className="w-full border rounded-lg p-2 dark:bg-[#1e2235]"
                  >
                    <option>Published</option>
                    <option>Draft</option>
                    <option>Pending</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-500 mb-1">
                    Visibility
                  </label>
                  <select
                    {...register("visibility")}
                    className="w-full border rounded-lg p-2 dark:bg-[#1e2235]"
                  >
                    <option>Public</option>
                    <option>Password Protected</option>
                    <option>Private</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-500 mb-1">
                    Published on
                  </label>
                  <input
                    {...register("publishOn")}
                    type="date"
                    className="w-full border rounded-lg p-2 dark:bg-[#1e2235]"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-primary text-white py-2 rounded-lg font-bold mt-2 hover:bg-primary/90 transition-colors"
                >
                  {isEditMode ? "Update" : "Create"}
                </button>
              </div>
            </FormSection>

            {screenOptions.FeaturedImage && (
              <FormSection title="Featured Image">
                <div className="border-2 border-dashed border-gray-100 rounded-xl p-4 text-center text-gray-400 mb-4 dark:border-gray-700 min-h-[200px] flex items-center justify-center overflow-hidden">
                  {featuredImage ? (
                    <img
                      src={featuredImage}
                      alt="Preview"
                      className="max-w-full max-h-[180px] rounded-lg object-cover"
                    />
                  ) : (
                    <span>No preview available</span>
                  )}
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="text-sm block w-full file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-primary/10 file:text-primary cursor-pointer"
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
