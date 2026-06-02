import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { Upload, Save } from "lucide-react";

const CourseForm = () => {
  const navigate = useNavigate();
  const [instructors, setInstructors] = useState([]);
  const [categories, setCategories] = useState([]);

  // State for Arrays
  const [requirements, setRequirements] = useState("");
  const [learnItems, setLearnItems] = useState("");
  const [tags, setTags] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    description: "",
    excerpt: "",
    instructor: "",
    category: "",
    price: "",
    originalPrice: "",
    level: "beginner",
    language: "English",
    status: "draft",
    previewVideo: "",  
  });

  const [thumbnail, setThumbnail] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);

  const baseUrl =
    import.meta.env?.VITE_BACKEND_URL || "https://cms-backend-ashen.vercel.app";

  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        const [instRes, catRes] = await Promise.all([
          axios.get(`${baseUrl}/api/instructors`),
          axios.get(`${baseUrl}/api/course-categories`),
        ]);
        setInstructors(instRes.data.instructors || instRes.data || []);
        setCategories(catRes.data.categories || catRes.data || []);
      } catch (err) {
        console.error("Error fetching dropdown data:", err);
      }
    };
    fetchDropdownData();
  }, [baseUrl]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setThumbnail(file);
      setThumbnailPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    Swal.fire({
      title: "Saving...",
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading(),
    });

    const data = new FormData();
    Object.keys(formData).forEach((key) => data.append(key, formData[key]));

    // Append arrays
    data.append(
      "requirements",
      JSON.stringify(requirements.split(",").map((i) => i.trim())),
    );
    data.append(
      "whatYouLearn",
      JSON.stringify(learnItems.split(",").map((i) => i.trim())),
    );
    data.append("tags", JSON.stringify(tags.split(",").map((i) => i.trim())));

    if (thumbnail) data.append("thumbnail", thumbnail);

    try {
      await axios.post(`${baseUrl}/api/courses`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      Swal.fire({
        icon: "success",
        title: "Course Created!",
        confirmButtonColor: "#4F46E5",
      });
      navigate("/dashboard/courses");
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Failed",
        text: err.response?.data?.message || "Check your input.",
      });
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-8 bg-white dark:bg-[#292D4A] rounded-2xl shadow-sm border ">
      <h2 className="text-3xl font-bold text-header-text mb-8">
        Create New Course
      </h2>
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-8"
      >
        {/* Core Info */}
        <div className="space-y-4">
          <input
            name="title"
            placeholder="Course Title"
            onChange={handleChange}
            className="w-full p-3 rounded-xl border border-slate-200"
            required
          />
          <input
            name="slug"
            placeholder="Slug (e.g., react-mastery)"
            onChange={handleChange}
            className="w-full p-3 rounded-xl border border-slate-200"
            required
          />
          <input
            name="previewVideo"
            placeholder="Preview Video URL"
            onChange={handleChange}
            className="w-full p-3 rounded-xl border border-slate-200"
          />
          <textarea
            name="description"
            placeholder="Full Description"
            onChange={handleChange}
            rows={4}
            className="w-full p-3 rounded-xl border border-slate-200"
          />
        </div>

        {/* Media & Relations */}
        <div className="space-y-4">
          <select
            name="instructor"
            onChange={handleChange}
            className="w-full p-3 rounded-xl border border-slate-200"
            required
          >
            <option value="">Select Instructor</option>
            {instructors.map((i) => (
              <option key={i._id} value={i._id}>
                {i.user?.firstName}
              </option>
            ))}
          </select>
          <select
            name="category"
            onChange={handleChange}
            className="w-full p-3 rounded-xl border border-slate-200"
            required
          >
            <option value="">Select Category</option>
            {categories.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
          </select>
          <div className="grid grid-cols-2 gap-4">
            <input
              type="number"
              name="price"
              placeholder="Price"
              onChange={handleChange}
              className="p-3 rounded-xl border border-slate-200"
            />
            <input
              type="number"
              name="originalPrice"
              placeholder="Old Price"
              onChange={handleChange}
              className="p-3 rounded-xl border border-slate-200"
            />
          </div>
        </div>

        {/* Advanced Arrays */}
        <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            placeholder="Requirements (comma separated)"
            onChange={(e) => setRequirements(e.target.value)}
            className="p-3 rounded-xl border border-slate-200"
          />
          <input
            placeholder="What you learn (comma separated)"
            onChange={(e) => setLearnItems(e.target.value)}
            className="p-3 rounded-xl border border-slate-200"
          />
          <input
            placeholder="Tags (comma separated)"
            onChange={(e) => setTags(e.target.value)}
            className="p-3 rounded-xl border border-slate-200"
          />
        </div>

        {/* Thumbnail Only */}
        <div className="md:col-span-2">
          <div className="border-2 border-dashed p-8 rounded-xl text-center relative">
            {thumbnailPreview ? (
              <img
                src={thumbnailPreview}
                className="h-20 mx-auto object-cover rounded"
              />
            ) : (
              <Upload className="mx-auto text-slate-400 mb-2" />
            )}
            <p className="text-sm font-semibold">Upload Thumbnail</p>
            <input
              type="file"
              onChange={handleFileChange}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
          </div>
        </div>

        <button
          type="submit"
          className="md:col-span-2 bg-indigo-600 text-white py-4 rounded-xl font-bold hover:bg-indigo-700"
        >
          <Save className="inline mr-2" size={20} /> Add Course
        </button>
      </form>
    </div>
  );
};

export default CourseForm;
