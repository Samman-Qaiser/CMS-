import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import LessonForm from "../Components/LessonForm";
import { FaRegTrashAlt } from "react-icons/fa";
import { LuPencilLine } from "react-icons/lu";

const Lessons = () => {
  const [courses, setCourses] = useState([]);
  const [chapters, setChapters] = useState([]);
  const [lessons, setLessons] = useState([]);

  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [editingLesson, setEditingLesson] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const baseUrl =
    import.meta.env?.VITE_BACKEND_URL || "https://cms-backend-ashen.vercel.app";

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await axios.get(`${baseUrl}/api/courses`);
        setCourses(res.data.courses || res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchCourses();
  }, [baseUrl]);

  const fetchChapters = async (courseId) => {
    setSelectedCourse(courseId);
    setSelectedChapter(null);
    setLessons([]);
    const res = await axios.get(`${baseUrl}/api/chapters/course/${courseId}`);
    setChapters(res.data.chapters || res.data);
  };

  const fetchLessons = async (chapterId) => {
    setSelectedChapter(chapterId);
    const res = await axios.get(`${baseUrl}/api/lessons/chapter/${chapterId}`);
    setLessons(res.data.lessons || res.data);
  };

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Delete lesson?",
      icon: "warning",
      showCancelButton: true,
    });
    if (confirm.isConfirmed) {
      await axios.delete(`${baseUrl}/api/lessons/${id}`);
      fetchLessons(selectedChapter);
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Col 1: Courses */}
      <div className="w-1/3 border-r p-4 overflow-y-auto">
        <h2 className="font-bold mb-4">1. Courses</h2>
        {courses.map((c) => (
          <button
            key={c._id}
            onClick={() => fetchChapters(c._id)}
            className={`block w-full p-3 mb-2 rounded transition ${selectedCourse === c._id ? "bg-primary text-white" : "bg-white border"}`}
          >
            {c.title}
          </button>
        ))}
      </div>

      {/* Col 2: Chapters */}
      <div className="w-1/3 border-r p-4 overflow-y-auto bg-slate-100">
        <h2 className="font-bold mb-4">2. Chapters</h2>
        {chapters.map((ch) => (
          <button
            key={ch._id}
            onClick={() => fetchLessons(ch._id)}
            className={`block w-full p-3 mb-2 rounded transition ${selectedChapter === ch._id ? "bg-primary text-white" : "bg-white border"}`}
          >
            {ch.title}
          </button>
        ))}
      </div>

      {/* Col 3: Lessons */}
      <div className="w-1/3 p-4 overflow-y-auto">
        <div className="flex justify-between mb-4">
          <h2 className="font-bold">3. Lessons</h2>
          {selectedChapter && (
            <button
              onClick={() => setShowForm(true)}
              className="bg-primary text-white px-3 py-1 rounded text-sm"
            >
              + Add Lesson
            </button>
          )}
        </div>

        {(showForm || editingLesson) && (
          <LessonForm
            courseId={selectedCourse}
            chapterId={selectedChapter}
            initialData={editingLesson}
            onClose={() => {
              setShowForm(false);
              setEditingLesson(null);
            }}
            onSuccess={() => {
              fetchLessons(selectedChapter);
              setShowForm(false);
              setEditingLesson(null);
            }}
          />
        )}

        {lessons.map((l) => (
          <div
            key={l._id}
            className="bg-white p-3 mb-2 rounded shadow border flex justify-between items-center"
          >
            <span>
              {l.title} <small className="text-slate-400">({l.type})</small>
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => setEditingLesson(l)}
                className="p-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-all"
              >
                <LuPencilLine size={18} />
              </button>
              <button
                onClick={() => handleDelete(l._id)}
                className="p-2 bg-[#FF5C5C] text-white rounded-lg hover:bg-red-600 transition-all"
              >
                <FaRegTrashAlt size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default Lessons;
