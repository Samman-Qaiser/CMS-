import { useState, useEffect } from "react";
import axios from "axios";
import ChapterForm from "../Components/ChapterForm";

const Chapters = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);  

  const baseUrl =
    import.meta.env?.VITE_BACKEND_URL || "https://cms-backend-ashen.vercel.app";

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${baseUrl}/api/courses`);
        const data = res.data.courses || res.data;
        setCourses(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error fetching courses:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, [baseUrl]);

  const fetchChapters = async (courseId) => {
    setLoading(true);
    try {
      const res = await axios.get(`${baseUrl}/api/chapters/course/${courseId}`);
      setChapters(res.data.chapters || res.data);
    } catch (err) {
      console.error("Error fetching chapters:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCourseClick = (course) => {
    setSelectedCourse(course);
    fetchChapters(course._id);
  };

  return (
    <div className="flex h-screen bg-slate-50">
      <div className="w-1/4 bg-white border-r border-slate-200 p-4 overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Courses</h2>
        {loading && !courses.length ? (
          <p className="text-slate-400">Loading courses...</p>
        ) : (
          courses.map((course) => (
            <button
              key={course._id}
              onClick={() => handleCourseClick(course)}
              className={`w-full text-left p-3 rounded-lg mb-2 transition ${
                selectedCourse?._id === course._id
                  ? "bg-primary text-white"
                  : "hover:bg-slate-100"
              }`}
            >
              {course.title}
            </button>
          ))
        )}
      </div>

      <div className="flex-1 p-8 overflow-y-auto">
        {loading ? (
          <div className="flex h-full items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : selectedCourse ? (
          <>
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold">
                Chapters: {selectedCourse.title}
              </h2>
              <button
                onClick={() => setShowForm(!showForm)}
                className="bg-primary text-white px-4 py-2 rounded-lg"
              >
                {showForm ? "Cancel" : "+ Add Chapter"}
              </button>
            </div>

            {showForm && (
              <ChapterForm
                courseId={selectedCourse._id}
                onClose={() => setShowForm(false)}
                onChapterAdded={() => fetchChapters(selectedCourse._id)}
              />
            )}

            <div className="grid gap-4">
              {chapters.map((chapter) => (
                <div
                  key={chapter._id}
                  className="p-4 bg-white rounded-lg shadow-sm border border-slate-200"
                >
                  <h3 className="font-bold">{chapter.title}</h3>
                  <p className="text-sm text-slate-500">
                    Order: {chapter.order}
                  </p>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="flex h-full items-center justify-center text-slate-400">
            Select a course to view its chapters
          </div>
        )}
      </div>
    </div>
  );
};

export default Chapters;
