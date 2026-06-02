import { useEffect, useState } from "react";
import CourseCard from "../Components/CourseCard";
import { ChevronLeft, ChevronRight } from "lucide-react";
import CategoryCard from "../Components/CategoryCard";
import CategoryForm from "../Components/CategoryForm";
import axios from "axios";

const CoursesPage = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [categories, setCategories] = useState([]);
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const baseUrl =
    import.meta.env?.VITE_BACKEND_URL || "https://cms-backend-ashen.vercel.app";

  const itemsPerPage = 6;

  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${baseUrl}/api/course-categories`);
      setCategories(res.data.categories || res.data || []);
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  };

 const fetchCourses = async () => {
   try {
     setLoading(true);
     const res = await axios.get(`${baseUrl}/api/courses`);
     setCourses(res.data.courses || res.data || []);
   } catch (err) {
     console.error("Error fetching courses:", err);
   } finally {
     setLoading(false);
   }
 };

 useEffect(() => {
   fetchCategories();
   fetchCourses();
 }, [baseUrl]);

  const displayedCategories = showAllCategories
    ? categories
    : categories.slice(0, 3);

  // Calculate pagination
  const totalPages = Math.ceil(courses.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentCourses = courses.slice(startIndex, endIndex);

  // showing 5 pages at a time
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pageNumbers.push(i);
        pageNumbers.push("...");
        pageNumbers.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pageNumbers.push(1);
        pageNumbers.push("...");
        for (let i = totalPages - 3; i <= totalPages; i++) pageNumbers.push(i);
      } else {
        pageNumbers.push(1);
        pageNumbers.push("...");
        for (let i = currentPage - 1; i <= currentPage + 1; i++)
          pageNumbers.push(i);
        pageNumbers.push("...");
        pageNumbers.push(totalPages);
      }
    }
    return pageNumbers;
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className="p-2 flex flex-col gap-8 bg-headerbg/5 min-h-screen">
      {/* --- POPULAR THIS WEEK SECTION --- */}
      <section className="flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-header-text">
            Popular This Week
          </h2>
          <div className="flex gap-2">
            <button
              onClick={() => setIsFormOpen(true)}
              className="bg-secondary text-white px-5 py-2 rounded-lg text-xs font-bold"
            >
              Create Category
            </button>
            <button
              onClick={() => setShowAllCategories(!showAllCategories)}
              className="bg-primary text-white px-5 py-2 rounded-lg text-xs font-bold shadow-md"
            >
              {showAllCategories ? "Show Less" : "View all"}
            </button>
          </div>
        </div>

        {isFormOpen && (
          <CategoryForm
            onClose={() => setIsFormOpen(false)}
            onSave={() => {
              fetchCategories();
              setIsFormOpen(false);
            }}
          />
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {displayedCategories.map((cat) => (
            <CategoryCard key={cat._id} category={cat} />
          ))}
        </div>
      </section>

      {/* Header Section */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-header-text">All Courses</h2>
        <button className="bg-primary text-white px-4 py-1.5 rounded-md text-xs font-bold">
          View all
        </button>
      </div>

      {/* Grid Layout */}
      {loading ? (
        <div className="text-center py-10">Loading courses...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {currentCourses.map((course) => (
            <CourseCard key={course._id || course.id} course={course} />
          ))}
        </div>
      )}

      {/* Pagination Section */}
      {totalPages > 1 && (
        <div className="flex flex-col md:flex-row justify-between items-center mt-12 gap-4">
          <p className="text-content-text text-sm">
            Showing{" "}
            <span className="font-bold text-header-text">{startIndex + 1}</span>{" "}
            -{" "}
            <span className="font-bold text-header-text">
              {Math.min(endIndex, courses.length)}
            </span>{" "}
            from{" "}
            <span className="font-bold text-header-text">
              {courses.length}
            </span>{" "}
            data
          </p>

          <div className="flex items-center gap-2">
            {/* Previous Button */}
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className={`p-2 transition-colors rounded-lg ${
                currentPage === 1
                  ? "text-content-text/30 cursor-not-allowed"
                  : "text-content-text hover:text-primary hover:bg-primary/10"
              }`}
            >
              <ChevronLeft size={20} />
            </button>

            {/* Page Numbers */}
            {getPageNumbers().map((page, index) =>
              page === "..." ? (
                <span
                  key={`dots-${index}`}
                  className="w-10 h-10 flex items-center justify-center text-content-text"
                >
                  ...
                </span>
              ) : (
                <button
                  key={page}
                  onClick={() => {
                    setCurrentPage(page);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className={`w-10 h-10 rounded-lg font-bold transition-all ${
                    currentPage === page
                      ? "bg-primary text-white shadow-lg"
                      : "text-content-text hover:bg-headerbg/20"
                  }`}
                >
                  {page}
                </button>
              ),
            )}

            {/* Next Button */}
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className={`p-2 transition-colors rounded-lg ${
                currentPage === totalPages
                  ? "text-content-text/30 cursor-not-allowed"
                  : "text-content-text hover:text-primary hover:bg-primary/10"
              }`}
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CoursesPage;
