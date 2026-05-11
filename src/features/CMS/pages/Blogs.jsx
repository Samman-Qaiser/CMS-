import { useState } from "react";
import { allBlogs } from "../components/blogsData";
import BlogFilter from "../components/BlogFilter";
import BlogTable from "../components/BlogTable";

const Blogs = () => {
  const [filters, setFilters] = useState({
    title: "",
    status: "Select Status",
    date: "",
  });

  const filteredBlogs = allBlogs.filter((blog) => {
    const matchTitle = blog.title
      .toLowerCase()
      .includes(filters.title.toLowerCase());
    const matchStatus =
      filters.status === "Select Status" || blog.status === filters.status;

    return matchTitle && matchStatus;
  });

  return (
    <div>
      <div className="flex flex-col gap-6">
        <BlogFilter onFilter={setFilters} />
        <BlogTable blogs={filteredBlogs} />
      </div>
    </div>
  );
};

export default Blogs;
