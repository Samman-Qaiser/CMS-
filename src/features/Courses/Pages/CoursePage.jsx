import { useState, useEffect } from "react";
import CourseCard from "../Components/CourseCard";
import CategoryCard from "../Components/CategoryCard";
import CategoryForm from "../Components/CategoryForm";
import { ChevronLeft, ChevronRight } from "lucide-react";
import axios from "axios";
import { Link } from "react-router-dom";

const baseUrl =
  import.meta.env?.VITE_BACKEND_URL || "https://cms-backend-ashen.vercel.app";

const CoursesPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [allCourses, setAllCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [popularCourses, setPopularCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const itemsPerPage = 6;

  // ─── FETCH COURSES ──────────────────────────────────
  const fetchCourses = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `${baseUrl}/api/courses?status=published`,
      );
      const coursesList = data.courses || data || [];
      setAllCourses(coursesList);

      // Popular — sort by totalStudents or rating
      const popular = [...coursesList]
        .sort(
          (a, b) =>
            (b.totalStudents || b.rating || 0) -
            (a.totalStudents || a.rating || 0),
        )
        .slice(0, 3);
      setPopularCourses(popular);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  // ─── FETCH CATEGORIES ──────────────────────────────────
  const fetchCategories = async () => {
    try {
      const { data } = await axios.get(`${baseUrl}/api/course-categories`);
      setCategories(data.categories || data || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  // ─── INITIAL FETCH ──────────────────────────────────
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await Promise.all([fetchCourses(), fetchCategories()]);
      setLoading(false);
    };
    fetchData();
  }, []);

  // ─── DISPLAYED CATEGORIES ──────────────────────────────────
  const displayedCategories = showAllCategories
    ? categories
    : categories.slice(0, 3);

  // ─── PAGINATION ───────────────────────────────────
  const totalPages = Math.ceil(allCourses.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentCourses = allCourses.slice(startIndex, endIndex);

  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pageNumbers.push(i);
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-2 flex flex-col gap-8 bg-headerbg/5 min-h-screen">
      {/* Popular This Week Section */}
      <section className="flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-header-text">
            Popular This Week
          </h2>
          <div className="flex gap-2">
            <button
              onClick={() => setIsFormOpen(true)}
              className="bg-secondary text-white px-5 py-2 rounded-lg text-xs font-bold shadow-md hover:bg-secondary/90 transition-all"
            >
              Create Category
            </button>
            <button
              onClick={() => setShowAllCategories(!showAllCategories)}
              className="bg-primary text-white px-5 py-2 rounded-lg text-xs font-bold shadow-md hover:bg-primary/90 transition-all"
            >
              {showAllCategories ? "Show Less" : "View all"}
            </button>
          </div>
        </div>

        {/* Category Form Modal */}
        {isFormOpen && (
          <CategoryForm
            onClose={() => setIsFormOpen(false)}
            onSave={() => {
              fetchCategories();
              setIsFormOpen(false);
            }}
          />
        )}

        {/* Categories Grid */}
        {displayedCategories.length === 0 ? (
          <div className="text-center py-10 text-gray-400">
            No categories found. Create your first category!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {displayedCategories.map((cat) => (
              <CategoryCard key={cat._id} category={cat} />
            ))}
          </div>
        )}
      </section>

      {/* All Courses Section */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-header-text">All Courses</h2>
        <Link
          to="/dashboard/course-categories"
          className="bg-primary text-white px-4 py-1.5 rounded-md text-xs font-bold hover:bg-primary/90 transition-all"
        >
          View all
        </Link>
      </div>

      {/* Courses Grid */}
      {allCourses.length === 0 ? (
        <div className="text-center py-20 text-gray-400">No courses found</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {currentCourses.map((course) => (
            <CourseCard key={course._id || course.id} course={course} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex flex-col md:flex-row justify-between items-center mt-12 gap-4">
          <p className="text-content-text text-sm">
            Showing{" "}
            <span className="font-bold text-header-text">{startIndex + 1}</span>{" "}
            -{" "}
            <span className="font-bold text-header-text">
              {Math.min(endIndex, allCourses.length)}
            </span>{" "}
            from{" "}
            <span className="font-bold text-header-text">
              {allCourses.length}
            </span>{" "}
            data
          </p>

          <div className="flex items-center gap-2">
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
