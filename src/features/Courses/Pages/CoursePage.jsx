import React, { useState } from 'react';
import CourseCard from '../Components/CourseCard';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import CategoryCard from '../Components/CategoryCard';

const CoursesPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6; // Number of courses per page
  
  // Mock Data (Image ke mutabiq)
  const allCourses = [
    { id: 1, title: "Developer", instructor: "Samantha", rating: 5.0, price: 50.99, contentCount: 110, image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=400" },
    { id: 2, title: "UI Design Beginner", instructor: "Karen Hope", rating: 5.0, price: 50.99, contentCount: 110, image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=400" },
    { id: 3, title: "Freelancer", instructor: "Jack and Sally", rating: 5.0, price: 50.99, contentCount: 110, image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=400" },
    { id: 4, title: "UX Research", instructor: "Cahaya Hikari", rating: 5.0, price: 50.99, contentCount: 110, image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=400" },
    { id: 5, title: "Basic Web Design", instructor: "Ahmad", rating: 5.0, price: 50.99, contentCount: 110, image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400" },
    { id: 6, title: "3D Designer", instructor: "Jordan Nico", rating: 5.0, price: 50.99, contentCount: 110, image: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=400" },
    { id: 7, title: "React Mastery", instructor: "Sarah Johnson", rating: 5.0, price: 65.99, contentCount: 150, image: "https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?q=80&w=400" },
    { id: 8, title: "Python Bootcamp", instructor: "Mike Ross", rating: 5.0, price: 55.99, contentCount: 130, image: "https://images.unsplash.com/photo-1526379879527-8559ecfcaec0?q=80&w=400" },
    { id: 9, title: "Data Science", instructor: "Emily Chen", rating: 5.0, price: 75.99, contentCount: 180, image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=400" },
    { id: 10, title: "Cloud Computing", instructor: "David Kim", rating: 5.0, price: 70.99, contentCount: 140, image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=400" },
  ];

  const categories = [
    { id: 1, title: "Graphic", icon: "🎨" },
    { id: 2, title: "Coding", icon: "💻" },
    { id: 3, title: "Soft Skill", icon: "🧠" }
  ];

  // Calculate pagination
  const totalPages = Math.ceil(allCourses.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentCourses = allCourses.slice(startIndex, endIndex);
  
  // Generate page numbers to display (showing 5 pages at a time)
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
        pageNumbers.push('...');
        pageNumbers.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pageNumbers.push(1);
        pageNumbers.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) pageNumbers.push(i);
      } else {
        pageNumbers.push(1);
        pageNumbers.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pageNumbers.push(i);
        pageNumbers.push('...');
        pageNumbers.push(totalPages);
      }
    }
    return pageNumbers;
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="p-2 flex flex-col gap-8 bg-headerbg/5 min-h-screen">
      {/* --- POPULAR THIS WEEK SECTION --- */}
      <section className="flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-header-text">Popular This Week</h2>
          <button className="bg-primary text-white px-5 py-2 rounded-lg text-xs font-bold shadow-md hover:bg-primary/90 transition-all">
            View all
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {categories.map(cat => (
            <CategoryCard key={cat.id} category={cat} />
          ))}
        </div>
      </section>
      
      {/* Header Section */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-header-text">All Courses</h2>
        <button className="bg-primary text-white px-4 py-1.5 rounded-md text-xs font-bold">View all</button>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {currentCourses.map(course => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>

      {/* Pagination Section */}
      {totalPages > 1 && (
        <div className="flex flex-col md:flex-row justify-between items-center mt-12 gap-4">
          <p className="text-content-text text-sm">
            Showing <span className="font-bold text-header-text">{startIndex + 1}</span> - <span className="font-bold text-header-text">
              {Math.min(endIndex, allCourses.length)}
            </span> from <span className="font-bold text-header-text">{allCourses.length}</span> data
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
            {getPageNumbers().map((page, index) => (
              page === '...' ? (
                <span key={`dots-${index}`} className="w-10 h-10 flex items-center justify-center text-content-text">
                  ...
                </span>
              ) : (
                <button 
                  key={page}
                  onClick={() => {
                    setCurrentPage(page);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className={`w-10 h-10 rounded-lg font-bold transition-all ${
                    currentPage === page 
                    ? "bg-primary text-white shadow-lg" 
                    : "text-content-text hover:bg-headerbg/20"
                  }`}
                >
                  {page}
                </button>
              )
            ))}

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