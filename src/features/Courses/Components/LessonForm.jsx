import { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const LessonForm = ({
  courseId,
  chapterId,
  initialData,
  onClose,
  onSuccess,
}) => {
  const [formData, setFormData] = useState(
    initialData || {
      title: "",
      type: "video",
      order: 0,
      isFree: false,
      contentUrl: "",
      duration: "",
      content: "",
      questions: "",
    },
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();

    // Append common fields
    Object.keys(formData).forEach((key) => {
      if (formData[key] !== null && formData[key] !== "") {
        data.append(key, formData[key]);
      }
    });

    // Add IDs
    data.append("course", courseId);
    data.append("chapter", chapterId);

    try {
      const baseUrl =
        import.meta.env?.VITE_BACKEND_URL ||
        "https://cms-backend-ashen.vercel.app";
      if (initialData) {
        await axios.put(`${baseUrl}/api/lessons/${initialData._id}`, data);
      } else {
        await axios.post(`${baseUrl}/api/lessons`, data);
      }
      onSuccess();
    } catch (err) {
      Swal.fire(
        "Error",
        err.response?.data?.message || "Failed to save",
        "error",
      );
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4"
    >
      <h3 className="font-bold text-lg">
        {initialData ? "Edit" : "Add"} Lesson
      </h3>

      <input
        className="w-full border p-2 rounded"
        placeholder="Title"
        value={formData.title}
        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        required
      />

      <select
        className="w-full border p-2 rounded"
        value={formData.type}
        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
      >
        <option value="video">Video</option>
        <option value="audio">Audio</option>
        <option value="module">Module</option>
        <option value="quiz">Quiz</option>
      </select>

      {/* Conditional Fields */}
      {["video", "audio"].includes(formData.type) && (
        <>
          <input
            className="w-full border p-2 rounded"
            placeholder="Content URL"
            value={formData.contentUrl}
            onChange={(e) =>
              setFormData({ ...formData, contentUrl: e.target.value })
            }
          />
          <input
            className="w-full border p-2 rounded"
            placeholder="Duration (e.g., 1:00)"
            value={formData.duration}
            onChange={(e) =>
              setFormData({ ...formData, duration: e.target.value })
            }
          />
        </>
      )}

      {formData.type === "module" && (
        <textarea
          className="w-full border p-2 rounded"
          placeholder="Module Content"
          value={formData.content}
          onChange={(e) =>
            setFormData({ ...formData, content: e.target.value })
          }
        />
      )}

      {formData.type === "quiz" && (
        <textarea
          className="w-full border p-2 rounded"
          placeholder='Questions JSON e.g. [{"question": "...", "options": ["A","B"], "correctAnswer": 0}]'
          value={formData.questions}
          onChange={(e) =>
            setFormData({ ...formData, questions: e.target.value })
          }
        />
      )}

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={formData.isFree}
          onChange={(e) =>
            setFormData({ ...formData, isFree: e.target.checked })
          }
        />
        <label>Is Free?</label>
      </div>

      <div className="flex gap-2">
        <button
          type="submit"
          className="bg-primary text-white px-4 py-2 rounded"
        >
          Save
        </button>
        <button
          type="button"
          onClick={onClose}
          className="bg-slate-200 px-4 py-2 rounded"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};
export default LessonForm;
