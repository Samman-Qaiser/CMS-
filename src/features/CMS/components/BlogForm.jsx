import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import { IoChevronUp } from "react-icons/io5";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import FormSection from "./FormSection";
import { allBlogs } from "./blogsData";
import Swal from "sweetalert2";

const BlogForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  // Form setup
  const { register, handleSubmit, control, reset, setValue } = useForm({
    defaultValues: {
      title: "",
      content: "",
      excerpt: "",
      slug: "",
      author: "w3@admin",
      status: "Published",
      visibility: "Public",
      publishOn: "",
      videoUrl: "",
      categories: [],
      tags: "",
      seoTitle: "",
      seoKeywords: "",
      seoDescription: "",
    },
  });

  // State management
  const [isOptionsOpen, setIsOptionsOpen] = useState(true);
  const [featuredImage, setFeaturedImage] = useState(null);
  const [showAddCategory, setShowAddCategory] = useState(false); 
  const [localCategories, setLocalCategories] = useState([
    "Backend",
    "Design",
    "Frontend",
    "News",
  ]);
 
  const [newCategory, setNewCategory] = useState({ name: "", parent: "None" });

  const [screenOptions, setScreenOptions] = useState({
    Categories: true,
    FeaturedImage: true,
    Video: true,
    Excerpt: true,
    Slug: true,
    Author: true,
    SEO: true,
    Tags: true,
  });

  const [tags, setTags] = useState([]);  
  const [tagInput, setTagInput] = useState("");
 
  useEffect(() => {
    setValue("tags", tags);
  }, [tags, setValue]);

  const handleTagKeyDown = (e) => {
    if (e.key === "," || e.key === "Enter") {
      e.preventDefault();
      const val = tagInput.trim().replace(/,/g, "");
      if (val && !tags.includes(val)) {
        setTags([...tags, val]);
        setTagInput("");
      }
    } else if (e.key === "Backspace" && !tagInput && tags.length > 0) { 
      setTags(tags.slice(0, -1));
    }
  };

  const removeTag = (indexToRemove) => {
    setTags(tags.filter((_, index) => index !== indexToRemove));
  };
  useEffect(() => {
    if (isEditMode) {
      const blog = allBlogs.find((b) => b.id === parseInt(id));
      if (blog) {
        setScreenOptions({
          Categories: true, 
          FeaturedImage: true,
          Video: true,
          Excerpt: true,
          Slug: true,
          Author: true,
          SEO: true,
          Tags: true,
        });

        reset({
          ...blog,
          seoTitle: blog.seo?.blogTitle || "",
          seoKeywords: blog.seo?.metaKeywords || "",
          seoDescription: blog.seo?.metaDescription || "",
          tags: blog.tags?.join(", ") || "",
        });
      }
    } else {
      setScreenOptions({
        Categories: true,
        FeaturedImage: true,
        Video: true,
        Excerpt: true,
        Slug: true,
        Author: true,
        SEO: true,
        Tags: true,
      });
    }
  }, [id, isEditMode, reset]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) setFeaturedImage(URL.createObjectURL(file));
  };

  const onSubmit = (data) => {
    console.log("Saving Blog:", data);
    Swal.fire({
      icon: "success",
      title: isEditMode ? "Blog Updated!" : "Blog Created!",
      timer: 1500,
      showConfirmButton: false,
    });
    setTimeout(() => navigate("/dashboard/blogs"), 1500);
  };

  return (
    <div className="p-6">
      {/* 1st row: Screen Options */}
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
                {Object.keys(screenOptions).map((opt) => (
                  <label
                    key={opt}
                    className="flex items-center space-x-3 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={screenOptions[opt]}
                      onChange={() =>
                        setScreenOptions((prev) => ({
                          ...prev,
                          [opt]: !prev[opt],
                        }))
                      }
                      className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                      {opt}
                    </span>
                  </label>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 2nd row: Heading */}
      <div className="bg-white dark:bg-[#292d4a] p-6 rounded-xl mb-6 shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-primary">Blogs</h2>
            <p className="text-gray-500 text-sm">
              {isEditMode ? "Edit Blog" : "Add Blog"}
            </p>
          </div>
          <div className="flex items-center text-sm font-medium">
            <Link to="/dashboard/blogs" className="text-gray-500">
              Blogs
            </Link>
            <span className="mx-2 text-gray-400">/</span>
            <span className="text-primary">
              {isEditMode ? "Edit Blog" : "Add Blog"}
            </span>
          </div>
        </div>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
      >
        {/* 1st column: Content & Metadata */}
        <div className="lg:col-span-2 space-y-6">
          {/* Add Blog Content Row */}
          <FormSection
            title={isEditMode ? "Edit Blog Content" : "Add Blog Content"}
          >
            <input
              {...register("title", { required: true })}
              className="w-full p-2 mb-4 border rounded-lg dark:bg-[#1e2235] dark:border-gray-600"
              placeholder="Enter title here"
            />
            <Controller
              name="content"
              control={control}
              render={({ field }) => (
                <CKEditor
                  editor={ClassicEditor}
                  data={field.value}
                  onChange={(event, editor) => field.onChange(editor.getData())}
                  onReady={(editor) =>
                    editor.editing.view.change((writer) =>
                      writer.setStyle(
                        "height",
                        "300px",
                        editor.editing.view.document.getRoot(),
                      ),
                    )
                  }
                />
              )}
            />
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
                className="w-full border rounded-lg p-2 dark:bg-[#1e2235]"
              />
            </FormSection>
          )}

          {screenOptions.Author && (
            <FormSection title="Author">
              <select
                {...register("author")}
                className="w-full border rounded-lg p-2 dark:bg-[#1e2235]"
              >
                <option value="w3@admin">w3@admin</option>
                <option value="w3@manager">w3@manager</option>
                <option value="w3@customer">w3@customer</option>
              </select>
            </FormSection>
          )}

          {screenOptions.SEO && (
            <FormSection title="SEO Settings">
              <div className="space-y-4">
                <input
                  {...register("seoTitle")}
                  placeholder="Page Title"
                  className="w-full border rounded-lg p-2 dark:bg-[#1e2235]"
                />
                <textarea
                  {...register("seoKeywords")}
                  placeholder="Meta Keywords"
                  className="w-full border rounded-lg p-2 dark:bg-[#1e2235]"
                />
                <textarea
                  {...register("seoDescription")}
                  placeholder="Meta Description"
                  className="w-full border rounded-lg p-2 dark:bg-[#1e2235]"
                />
              </div>
            </FormSection>
          )}
        </div>

        <div className="space-y-6">
          {/* Publish Row */}
          <FormSection title="Publish">
            <div className="space-y-4">
              <select
                {...register("status")}
                className="w-full border rounded-lg p-2 dark:bg-[#1e2235]"
              >
                <option>Published</option>
                <option>Draft</option>
                <option>Pending</option>
              </select>
              <select
                {...register("visibility")}
                className="w-full border rounded-lg p-2 dark:bg-[#1e2235]"
              >
                <option>Public</option>
                <option>Password Protected</option>
                <option>Private</option>
              </select>
              <input
                {...register("publishOn")}
                type="date"
                className="w-full border rounded-lg p-2 dark:bg-[#1e2235]"
              />
              <button
                type="submit"
                className="w-full bg-primary text-white py-2 rounded-lg font-bold"
              >
                {isEditMode ? "Update" : "Publish"}
              </button>
            </div>
          </FormSection>

          {/* Categories Row */}
          {/* Categories Row */}
          <FormSection title="Categories">
            <div className="space-y-2 max-h-40 overflow-y-auto mb-4 custom-scrollbar">
              {localCategories.map((cat) => (
                <label
                  key={cat}
                  className="flex items-center space-x-2 text-sm dark:text-gray-300 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    value={cat}
                    {...register("categories")}
                    className="rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <span>{cat}</span>
                </label>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setShowAddCategory(!showAddCategory)}
              className="text-primary text-sm font-semibold underline mb-2 block"
            >
              {showAddCategory ? "- Hide Options" : "+ Add New Category"}
            </button>

            {showAddCategory && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-3 space-y-3 p-3 bg-gray-50 dark:bg-white/5 rounded-lg border border-gray-100 dark:border-gray-700"
              >
                <div>
                  <label className="text-[11px] uppercase font-bold text-gray-400 mb-1 block">
                    Category Name
                  </label>
                  <input
                    type="text"
                    value={newCategory.name}
                    className="w-full text-sm p-2 border rounded dark:bg-[#1e2235] dark:border-gray-600 outline-none focus:border-primary"
                    onChange={(e) =>
                      setNewCategory({ ...newCategory, name: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label className="text-[11px] uppercase font-bold text-gray-400 mb-1 block">
                    Parent Category
                  </label>
                  <select
                    value={newCategory.parent}
                    className="w-full text-sm p-2 border rounded dark:bg-[#1e2235] dark:border-gray-600 outline-none"
                    onChange={(e) =>
                      setNewCategory({ ...newCategory, parent: e.target.value })
                    }
                  >
                    <option value="None">— Parent Category —</option>
                    {localCategories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    if (newCategory.name.trim()) {
                      setLocalCategories([
                        ...localCategories,
                        newCategory.name,
                      ]);
                      setNewCategory({ name: "", parent: "None" });
                      setShowAddCategory(false);
                    }
                  }}
                  className="w-full bg-primary hover:bg-primary-dark text-white transition-colors text-sm py-1.5 rounded font-bold"
                >
                  Save
                </button>
              </motion.div>
            )}
          </FormSection>

          {/* Featured Image Row */}
          <FormSection title="Featured Image">
            <div className="border-2 border-dashed border-gray-100 dark:border-gray-700 rounded-xl p-4 text-center min-h-[150px] flex items-center justify-center mb-4">
              {featuredImage ? (
                <img
                  src={featuredImage}
                  alt="Preview"
                  className="max-h-[130px] rounded-lg"
                />
              ) : (
                <span className="text-gray-400 text-sm">No image selected</span>
              )}
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="text-xs w-full file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-primary/10 file:text-primary"
            />
          </FormSection>

          {/* Video URL Row */}
          <FormSection title="Video URL">
            <input
              {...register("videoUrl")}
              placeholder="YouTube Video URL"
              className="w-full border rounded-lg p-2 dark:bg-[#1e2235]"
            />
          </FormSection>

          {/* Tags Row */}
          <FormSection title="Tags">
            <div className="flex flex-wrap gap-2 p-2 border rounded-lg dark:bg-[#1e2235] dark:border-gray-600 min-h-[42px] focus-within:ring-1 focus-within:ring-primary transition-all">
           
              {tags.map((tag, index) => (
                <div
                  key={index}
                  className="flex items-center gap-1 bg-primary dark:bg-primary/20 text-white dark:text-primary px-2 py-1 rounded text-xs font-medium border border-gray-200 dark:border-primary/30"
                >
                  <span>{tag}</span>
                  <button
                    type="button"
                    onClick={() => removeTag(index)}
                    className="hover:text-red-500 transition-colors"
                  >
                    &times;
                  </button>
                </div>
              ))}
 
              <input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagKeyDown}
                placeholder={tags.length === 0 ? "tag1, tag2..." : ""}
                className="flex-1 bg-transparent outline-none text-sm min-w-[60px] dark:text-white"
              />
            </div>
            <p className="text-[10px] text-gray-400 mt-2 italic">
              Separate tags with commas or the Enter key
            </p>
          </FormSection>
        </div>
      </form>
    </div>
  );
};;

export default BlogForm;
