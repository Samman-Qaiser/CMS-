import { useEffect, useState } from "react";
import { Star, BookOpen } from "lucide-react";
import axios from "axios";

const CourseCard = ({ course }) => {
  const [instructorName, setInstructorName] = useState("Loading...");
  useEffect(() => {
    const fetchInstructor = async () => {
      try {
        const baseUrl =
          import.meta.env?.VITE_BACKEND_URL ||
          "https://cms-backend-ashen.vercel.app";

        const instructorId =
          typeof course.instructor === "object"
            ? course.instructor._id
            : course.instructor;

        if (!instructorId) return; // Stop if there's no ID

        const res = await axios.get(
          `${baseUrl}/api/instructors/${instructorId}`,
        );

        const data = res.data.instructor || res.data;
        if (data && data.user) {
          setInstructorName(`${data.user.firstName} ${data.user.lastName}`);
        }
      } catch (err) {
        console.error("Error fetching instructor:", err);
        setInstructorName("Unknown Instructor");
      }
    };

    if (course.instructor) {
      fetchInstructor();
    }
  }, [course.instructor]);

  return (
    <div className="bg-white dark:bg-[#292D4A] rounded-md overflow-hidden shadow-sm hover:shadow-md transition-shadow group">
      {/* Course Image */}
      <div className="relative mt-3 h-48 w-[90%] m-auto overflow-hidden">
        <img
          src={course.image}
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
            <div className="text-content-text text-xs flex items-center gap-2">
              <p className="text-gray-600 font-medium">{instructorName}</p>
              <span className="flex items-center gap-1">
                {course.rating}{" "}
                <Star size={12} className="fill-secondary text-secondary" />
              </span>
            </div>
          </div>
          <span className="text-header-text font-bold text-lg">
            ${course.price}
          </span>
        </div>

        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-2 text-content-text text-sm">
            <BookOpen size={16} />
            <span>{course.contentCount || 0}+ Content</span>
          </div>
          <button className="bg-primary hover:bg-primary/90 text-white px-4 py-1 rounded-md text-sm font-bold transition-all">
            View all
          </button>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
