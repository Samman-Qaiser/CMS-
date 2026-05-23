import { useState, useEffect } from "react";
import axios from "axios";
import BlogFilter from "../components/BlogFilter";
import BlogTable from "../components/BlogTable";

const Blogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [filters, setFilters] = useState({
    title: "",
    status: "Select Status",
    date: "",
  });
  const baseUrl =
    import.meta.env?.VITE_BACKEND_URL || "https://cms-backend-ashen.vercel.app";

  const fetchBlogs = async (currentFilters) => {
    try {
      const params = new URLSearchParams();
      if (currentFilters.title) params.append("title", currentFilters.title);
      if (currentFilters.status !== "Select Status")
        params.append("status", currentFilters.status);
      if (currentFilters.date) params.append("date", currentFilters.date);

      const res = await axios.get(`${baseUrl}/api/blogs`, { params });
      setBlogs(res.data.blogs || res.data || []);
    } catch (err) {
      console.error("Error fetching blogs:", err);
    }
  };

  useEffect(() => {
    fetchBlogs(filters);
  }, [baseUrl, filters]);

  // Inside Blogs.jsx
  const filteredBlogs = blogs.filter((blog) => {
    const matchTitle = blog.title
      ?.toLowerCase()
      .includes(filters.title.toLowerCase());

    const matchStatus =
      filters.status === "Select Status" ||
      (blog.status &&
        blog.status.toLowerCase() === filters.status.toLowerCase());

    const matchDate =
      !filters.date ||
      (blog.publishedAt &&
        new Date(blog.publishedAt).toISOString().startsWith(filters.date));

    return matchTitle && matchStatus && matchDate;
  });

  return (
    <div>
      <div className="flex flex-col gap-6">
        <BlogFilter onFilter={setFilters} />
        <BlogTable blogs={filteredBlogs} onDeleteSuccess={fetchBlogs} />
      </div>
    </div>
  );
};

export default Blogs;
