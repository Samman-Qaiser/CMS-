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
  const [formData, setFormData] = useState(() => ({
    title: initialData?.title || "",
    type: initialData?.type || "video",
    order: initialData?.order || 0,
    isFree: initialData?.isFree || false,
    contentUrl: initialData?.contentUrl || "",
    duration: initialData?.duration || "",
    content: initialData?.content || "",
    questions: initialData?.questions || [],
  }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const baseUrl =
      import.meta.env?.VITE_BACKEND_URL ||
      "https://cms-backend-ashen.vercel.app";

    const data = new FormData();
    data.append("title", formData.title);
    data.append("type", formData.type);
    data.append("order", formData.order);
    data.append("isFree", formData.isFree);
    data.append("course", courseId);
    data.append("chapter", chapterId);

    if (formData.type === "video" || formData.type === "audio") {
      data.append("contentUrl", formData.contentUrl || "");
      data.append("duration", formData.duration || "");
    } else if (formData.type === "module") {
      data.append("content", formData.content || "");
    } else if (formData.type === "quiz") {
      data.append("questions", JSON.stringify(formData.questions));
    }

    try {
      if (initialData) {
        await axios.put(`${baseUrl}/api/lessons/${initialData._id}`, data);
      } else {
        await axios.post(`${baseUrl}/api/lessons`, data);
      }
      onSuccess();
    } catch (err) {
      console.error("Save Error:", err.response?.data);
      Swal.fire("Error", "Save failed. Check console for details.", "error");
    }
  };


  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-xl border shadow-sm space-y-4 max-h-[80vh] overflow-y-auto"
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

      <div className="grid grid-cols-2 gap-4">
        <input
          type="number"
          className="border p-2 rounded"
          placeholder="Order"
          value={formData.order}
          onChange={(e) => setFormData({ ...formData, order: e.target.value })}
        />
        <select
          className="border p-2 rounded"
          value={formData.type}
          onChange={(e) => setFormData({ ...formData, type: e.target.value })}
        >
          <option value="video">Video</option>
          <option value="audio">Audio</option>
          <option value="module">Module</option>
          <option value="quiz">Quiz</option>
        </select>
      </div>

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={formData.isFree}
          onChange={(e) =>
            setFormData({ ...formData, isFree: e.target.checked })
          }
        />{" "}
        Free Preview
      </label>

      {/* Conditional Rendering of Inputs */}
      {(formData.type === "video" || formData.type === "audio") && (
        <div className="space-y-2">
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
            placeholder="Duration (e.g. 1:00)"
            value={formData.duration}
            onChange={(e) =>
              setFormData({ ...formData, duration: e.target.value })
            }
          />
        </div>
      )}

      {formData.type === "module" && (
        <textarea
          className="w-full border p-2 rounded h-32"
          placeholder="Module content..."
          value={formData.content}
          onChange={(e) =>
            setFormData({ ...formData, content: e.target.value })
          }
        />
      )}

      {formData.type === "quiz" && (
        <div className="space-y-4 border-t pt-4">
          {formData.questions.map((q, qIdx) => (
            <div
              key={qIdx}
              className="p-3 bg-slate-50 rounded border space-y-2"
            >
              <input
                className="w-full p-1 border"
                placeholder="Question"
                value={q.question}
                onChange={(e) => {
                  const n = [...formData.questions];
                  n[qIdx].question = e.target.value;
                  setFormData({ ...formData, questions: n });
                }}
              />
              {q.options.map((opt, oIdx) => (
                <div key={oIdx} className="flex gap-2 items-center">
                  <input
                    type="radio"
                    name={`correct-${qIdx}`}
                    checked={q.correctAnswer === oIdx}
                    onChange={() => {
                      const n = [...formData.questions];
                      n[qIdx].correctAnswer = oIdx;
                      setFormData({ ...formData, questions: n });
                    }}
                  />
                  <input
                    className="flex-1 p-1 border"
                    placeholder={`Option ${oIdx + 1}`}
                    value={opt}
                    onChange={(e) => {
                      const n = [...formData.questions];
                      n[qIdx].options[oIdx] = e.target.value;
                      setFormData({ ...formData, questions: n });
                    }}
                  />
                </div>
              ))}
              <button
                type="button"
                onClick={() => {
                  const n = [...formData.questions];
                  n[qIdx].options.push("");
                  setFormData({ ...formData, questions: n });
                }}
                className="text-xs bg-slate-200 px-2 py-1 rounded"
              >
                + Add Option
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() =>
              setFormData({
                ...formData,
                questions: [
                  ...formData.questions,
                  { question: "", options: [""], correctAnswer: 0 },
                ],
              })
            }
            className="w-full bg-slate-800 text-white py-2 rounded"
          >
            + Add Question
          </button>
        </div>
      )}

      <div className="flex gap-2 pt-4">
        <button
          type="submit"
          className="bg-primary text-white px-6 py-2 rounded"
        >
          Save Lesson
        </button>
        <button
          type="button"
          onClick={onClose}
          className="bg-slate-200 px-6 py-2 rounded"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};
export default LessonForm;
