import { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const ChapterForm = ({ courseId, initialData, onClose, onChapterAdded }) => {
  const [formData, setFormData] = useState(
    initialData || { title: "", course: courseId, order: 0 },
  );

  const baseUrl =
    import.meta.env?.VITE_BACKEND_URL || "https://cms-backend-ashen.vercel.app";

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (initialData) {
        await axios.put(`${baseUrl}/api/chapters/${initialData._id}`, formData);
        Swal.fire("Success", "Chapter updated!", "success");
      } else {
        await axios.post(`${baseUrl}/api/chapters`, formData);
        Swal.fire("Success", "Chapter created!", "success");
      }
      onChapterAdded();
      onClose();
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
      className="bg-white p-6 rounded-xl border border-slate-200 mb-6 shadow-sm"
    >
      <h3 className="font-bold mb-4">
        {initialData ? "Edit Chapter" : "Add New Chapter"}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          placeholder="Chapter Title"
          className="p-3 rounded-lg border border-slate-300"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
        />
        <input
          type="number"
          placeholder="Order"
          className="p-3 rounded-lg border border-slate-300"
          value={formData.order}
          onChange={(e) => setFormData({ ...formData, order: e.target.value })}
          required
        />
      </div>
      <div className="mt-4 flex gap-2">
        <button
          type="submit"
          className="bg-primary text-white px-6 py-2 rounded-lg"
        >
          Save
        </button>
        <button
          type="button"
          onClick={onClose}
          className="bg-slate-200 px-6 py-2 rounded-lg"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};
export default ChapterForm;
