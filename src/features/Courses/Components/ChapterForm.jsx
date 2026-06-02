import { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const ChapterForm = ({ courseId, onClose, onChapterAdded }) => {
  // Initialize with the passed courseId
  const [formData, setFormData] = useState({
    title: "",
    course: courseId,
    order: 0,
  });

  const baseUrl =
    import.meta.env?.VITE_BACKEND_URL || "https://cms-backend-ashen.vercel.app";

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${baseUrl}/api/chapters`, formData);
      Swal.fire("Success", "Chapter created!", "success");
      onChapterAdded();
      onClose();
    } catch (err) {
      Swal.fire(
        "Error",
        err.response?.data?.message || "Failed to create",
        "error",
      );
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-xl border border-slate-200 mb-6 shadow-sm"
    >
      <h3 className="font-bold mb-4">Add New Chapter</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          placeholder="Chapter Title"
          className="p-3 rounded-lg border border-slate-300 focus:outline-primary"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
        />
        <input
          type="number"
          placeholder="Order (e.g. 1)"
          className="p-3 rounded-lg border border-slate-300 focus:outline-primary"
          value={formData.order}
          onChange={(e) => setFormData({ ...formData, order: e.target.value })}
          required
        />
      </div>
      <div className="mt-4 flex gap-2">
        <button
          type="submit"
          className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-dark"
        >
          Save Chapter
        </button>
        <button
          type="button"
          onClick={onClose}
          className="bg-slate-200 text-slate-700 px-6 py-2 rounded-lg hover:bg-slate-300"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default ChapterForm;
