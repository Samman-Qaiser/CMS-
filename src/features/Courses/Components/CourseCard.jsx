import { Star, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';

const CourseCard = ({ course }) => {
  return (
    <div className="bg-white dark:bg-[#292D4A] rounded-md overflow-hidden shadow-sm hover:shadow-md transition-shadow group">
      {/* Course Image */}
      <div className="relative mt-3 h-48 w-[90%] m-auto overflow-hidden">
        <img
          src={course.thumbnail || 'https://via.placeholder.com/400x300'}
          alt={course.title}
          className="w-full mx-auto h-[90%] rounded-lg object-center object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* Course Details */}
      <div className="p-5 flex flex-col gap-4">
        <div className="flex justify-between items-start">
          <div>
            <h4 className="text-header-text font-bold text-lg mb-1">
              {course.title}
            </h4>
            <p className="text-content-text text-xs flex items-center gap-2">
              {/* ✅ instructor populate se naam */}
              {course.instructor?.user?.firstName} {course.instructor?.user?.lastName} •
              <span className="flex items-center gap-1">
                {course.rating || 0}{' '}
                <Star size={12} className="fill-secondary text-secondary" />
              </span>
            </p>
          </div>
          <span className="text-header-text font-bold text-lg">
            ${course.price}
          </span>
        </div>

        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-2 text-content-text text-sm">
            <BookOpen size={16} />
            <span>{course.totalContent || 0}+ Content</span>
          </div>
          {/* ✅ _id use karo */}
          <Link
            to={`/dashboard/course-details-1/${course._id}`}
            className="inline-block bg-primary hover:bg-primary/90 text-white px-3 py-1 rounded-md text-sm font-bold transition-all"
          >
            View Course
          </Link>
        </div>
      </div>
    </div>
  )
}

export default CourseCard