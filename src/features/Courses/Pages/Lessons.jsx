import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import LessonForm from "../Components/LessonForm";
import { FaRegTrashAlt, FaPlus } from "react-icons/fa";
import { LuPencilLine } from "react-icons/lu";
const Spinner = () => (
  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary mx-auto my-4"></div>
);

const Lessons = () => {
  const [courses, setCourses] = useState([]);
  const [chapters, setChapters] = useState([]);
  const [lessons, setLessons] = useState([]);

  const [loading, setLoading] = useState({
    courses: false,
    chapters: false,
    lessons: false,
  });
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [editingLesson, setEditingLesson] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const baseUrl =
    import.meta.env?.VITE_BACKEND_URL || "https://cms-backend-ashen.vercel.app";

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading((prev) => ({ ...prev, courses: true }));
      try {
        const res = await axios.get(`${baseUrl}/api/courses`);
        setCourses(res.data.courses || res.data);
      } finally {
        setLoading((prev) => ({ ...prev, courses: false }));
      }
    };
    fetchCourses();
  }, [baseUrl]);

  const fetchChapters = async (courseId) => {
    setSelectedCourse(courseId);
    setSelectedChapter(null);
    setLessons([]);
    setLoading((prev) => ({ ...prev, chapters: true }));
    try {
      const res = await axios.get(`${baseUrl}/api/chapters/course/${courseId}`);
      setChapters(res.data.chapters || res.data);
    } finally {
      setLoading((prev) => ({ ...prev, chapters: false }));
    }
  };

  const fetchLessons = async (chapterId) => {
    setSelectedChapter(chapterId);
    setLoading((prev) => ({ ...prev, lessons: true }));
    try {
      const res = await axios.get(
        `${baseUrl}/api/lessons/chapter/${chapterId}`,
      );
      setLessons(res.data.lessons || res.data);
    } finally {
      setLoading((prev) => ({ ...prev, lessons: false }));
    }
  };

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Delete this lesson?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#EF4444",
    });
    if (confirm.isConfirmed) {
      await axios.delete(`${baseUrl}/api/lessons/${id}`);
      fetchLessons(selectedChapter);
    }
  };


  return (
    <div className="flex h-screen bg-slate-50">
      {/* 1. Courses Column */}
      <div className="w-1/3 border-r p-6 overflow-y-auto">
        <h2 className="text-lg font-bold text-slate-700 mb-4">Courses</h2>
        {loading.courses ? (
          <Spinner />
        ) : (
          courses.map((c) => (
            <button
              key={c._id}
              onClick={() => fetchChapters(c._id)}
              className={`w-full p-4 mb-2 rounded-xl text-left border transition-all ${selectedCourse === c._id ? "bg-primary text-white shadow-lg" : "bg-white hover:border-primary/50"}`}
            >
              {c.title}
            </button>
          ))
        )}
      </div>

      {/* 2. Chapters Column */}
      <div className="w-1/3 border-r p-6 overflow-y-auto bg-slate-100/50">
        <h2 className="text-lg font-bold text-slate-700 mb-4">Chapters</h2>
        {loading.chapters ? (
          <Spinner />
        ) : (
          chapters.map((ch) => (
            <button
              key={ch._id}
              onClick={() => fetchLessons(ch._id)}
              className={`w-full p-4 mb-2 rounded-xl text-left border transition-all ${selectedChapter === ch._id ? "bg-primary text-white shadow-lg" : "bg-white hover:border-primary/50"}`}
            >
              {ch.title}
            </button>
          ))
        )}
        {!loading.chapters && selectedCourse && chapters.length === 0 && (
          <p className="text-slate-400 text-sm italic">No chapters found.</p>
        )}
      </div>

      {/* 3. Lessons Column */}
      <div className="w-1/3 p-6 overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold text-slate-700">Lessons</h2>
          {selectedChapter && (
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-xl hover:bg-opacity-90 transition"
            >
              <FaPlus size={12} /> Add Lesson
            </button>
          )}
        </div>

        {(showForm || editingLesson) && (
          <div className="mb-6">
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
          </div>
        )}

        {loading.lessons ? (
          <Spinner />
        ) : (
          lessons.map((l) => (
            <div
              key={l._id}
              className="bg-white p-4 mb-3 rounded-2xl border flex justify-between items-center shadow-sm hover:shadow-md transition"
            >
              <span className="font-medium text-slate-700">
                {l.title}{" "}
                <span className="text-[10px] uppercase font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                  {l.type}
                </span>
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => setEditingLesson(l)}
                  className="p-2 text-primary bg-indigo-50 rounded-lg hover:bg-indigo-100"
                >
                  <LuPencilLine size={18} />
                </button>
                <button
                  onClick={() => handleDelete(l._id)}
                  className="p-2 text-red-500 bg-red-50 rounded-lg hover:bg-red-100"
                >
                  <FaRegTrashAlt size={18} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
export default Lessons;
