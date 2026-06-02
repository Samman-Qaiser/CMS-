import { useState, useEffect } from "react";
import axios from "axios";
import ChapterForm from "../Components/ChapterForm";
import Swal from "sweetalert2";
import { LuPencilLine } from "react-icons/lu";
import { FaRegTrashAlt } from "react-icons/fa";

const Chapters = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editingChapter, setEditingChapter] = useState(null);

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

  const handleDelete = async (chapterId) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`${baseUrl}/api/chapters/${chapterId}`);
        fetchChapters(selectedCourse._id);
        Swal.fire("Deleted!", "Chapter removed.", "success");
      } catch (err) {
        Swal.fire("Error", "Could not delete chapter", "error");
      }
    }
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

            {(showForm || editingChapter) && (
              <ChapterForm
                courseId={selectedCourse._id}
                initialData={editingChapter}
                onClose={() => {
                  setShowForm(false);
                  setEditingChapter(null);
                }}
                onChapterAdded={() => {
                  fetchChapters(selectedCourse._id);
                  setEditingChapter(null);
                }}
              />
            )}

            <div className="grid gap-4">
              {chapters.map((chapter) => (
                <div
                  key={chapter._id}
                  className="p-4 bg-white rounded-lg shadow-sm border border-slate-200 flex justify-between items-center"
                >
                  <div>
                    <h3 className="font-bold">{chapter.title}</h3>
                    <p className="text-sm text-slate-500">
                      Order: {chapter.order}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setEditingChapter(chapter)}
                      className="p-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-all"
                    >
                      <LuPencilLine size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(chapter._id)}
                      className="p-2 bg-[#FF5C5C] text-white rounded-lg hover:bg-red-600 transition-all"
                    >
                      <FaRegTrashAlt size={18} />
                    </button>
                  </div>
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
