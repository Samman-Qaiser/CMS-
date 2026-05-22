import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import { IoChevronUp } from "react-icons/io5";
import FormSection from "./FormSection";
import Swal from "sweetalert2";
import { useSelector } from "react-redux";
import axios from "axios";
import { TipTapEditor } from "./TipTapEditor";

const BlogForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);
  const user = useSelector((state) => state.auth.user);
  const baseUrl =
    import.meta.env?.VITE_BACKEND_URL || "https://cms-backend-ashen.vercel.app";

  const { register, handleSubmit, control } = useForm();

  const [categories, setCategories] = useState([]);
  const [featuredImage, setFeaturedImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [isOptionsOpen, setIsOptionsOpen] = useState(true);

  // Tags state for the UI
  const [tags, setTags] = useState([]);
  const [allTags, setAllTags] = useState([]); // Tags from database

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, tagRes] = await Promise.all([
          axios.get(`${baseUrl}/api/categories`),
          axios.get(`${baseUrl}/api/tags`),
        ]);
        setCategories(catRes.data.categories || []);
        setAllTags(tagRes.data.tags || []);
      } catch (err) {
        console.error("Error fetching dependencies", err);
      }
    };
    fetchData();
  }, [baseUrl]);
  const toggleTagSelection = (tag) => {
    if (tags.includes(tag)) {
      setTags(tags.filter((t) => t !== tag));
    } else {
      setTags([...tags, tag]);
    }
  };

  const removeTag = (indexToRemove) => {
    setTags(tags.filter((_, index) => index !== indexToRemove));
  };
  // -----------------------

  const onSubmit = async (data) => {
    const formData = new FormData();
    Object.keys(data).forEach((key) => {
      // Skip the author key from the form data since we are injecting it manually
      if (key === "author") return;

      if (key === "categories") {
        formData.append("categories", JSON.stringify(data.categories));
      } else {
        formData.append(key, data[key]);
      }
    });

    if (user?.id) {
      formData.append("author", user.id);
    }

    formData.append("tags", JSON.stringify(tags));
    if (imageFile) formData.append("featuredImage", imageFile);

    try {
      if (isEditMode) {
        await axios.put(`${baseUrl}/api/blogs/${id}`, formData);
      } else {
        await axios.post(`${baseUrl}/api/blogs`, formData);
      }
      Swal.fire("Success", "Blog saved successfully!", "success");
      navigate("/dashboard/blogs");
    } catch (err) {
      console.error("Full Error:", err.response?.data || err.message);

      Swal.fire(
        "Error",
        err.response?.data?.message || "Operation failed",
        "error",
      );
    }
  };
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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setFeaturedImage(URL.createObjectURL(file));
    }
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
                <TipTapEditor value={field.value} onChange={field.onChange} />
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
              <div className="p-2 border rounded-lg bg-gray-50 dark:bg-[#1e2235] text-gray-500">
                {user?.id})
              </div>
              <input type="hidden" {...register("author")} value={user?.id} />
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
                <option value="published">Published</option>
                <option value="pending">Pending</option>
                <option value="draft">Draft</option>
              </select>
              <select
                {...register("visibility")}
                className="w-full border rounded-lg p-2 dark:bg-[#1e2235]"
              >
                <option value="public">Public</option>
                <option value="password_protected">Password Protected</option>
                <option value="private">Private</option>
              </select>
              <input
                {...register("publishedAt")}
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

          <FormSection title="Categories">
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {categories.map((cat) => (
                <label
                  key={cat._id}
                  className="flex items-center space-x-2 text-sm"
                >
                  <input
                    type="checkbox"
                    value={cat._id}
                    {...register("categories")}
                  />
                  <span>{cat.name}</span>
                </label>
              ))}
            </div>
          </FormSection>

          <FormSection title="Featured Image">
            <input type="file" onChange={handleImageChange} />
            {featuredImage && <img src={featuredImage} className="mt-2 h-20" />}
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
            {/* Selected Tags Display */}
            <div className="flex flex-wrap gap-2 mb-3">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="bg-primary text-white px-2 py-1 rounded text-xs flex items-center gap-1"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tags.indexOf(tag))}
                  >
                    &times;
                  </button>
                </span>
              ))}
            </div>
            <select
              className="..."
              onChange={(e) => {
                const selectedTagId = e.target.value;
                if (selectedTagId && !tags.includes(selectedTagId)) {
                  setTags([...tags, selectedTagId]);
                }
                e.target.value = "";
              }}
            >
              <option value="">Select a tag...</option>
              {allTags.map((tag) => (
                <option key={tag._id} value={tag._id}>
                  {" "}
                  {/* Use _id here */}
                  {tag.name}
                </option>
              ))}
            </select>
            <p className="text-[10px] text-gray-400 mt-2">
              Select tags from the list to add them.
            </p>
          </FormSection>
        </div>
      </form>
    </div>
  );
};

export default BlogForm;
