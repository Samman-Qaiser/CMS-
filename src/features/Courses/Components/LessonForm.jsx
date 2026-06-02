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
  
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [filePreview, setFilePreview] = useState(null);

  const baseUrl =
    import.meta.env?.VITE_BACKEND_URL ||
    "https://cms-backend-ashen.vercel.app";

  // Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size
      if (file.size > 100 * 1024 * 1024) {
        Swal.fire("Error", "File size should be less than 100MB", "error");
        return;
      }
      
      setSelectedFile(file);
      const previewUrl = URL.createObjectURL(file);
      setFilePreview(previewUrl);
      // Clear URL input when file is selected
      setFormData({ ...formData, contentUrl: "" });
    }
  };

  const handleRemoveFile = () => {
    if (filePreview) {
      URL.revokeObjectURL(filePreview);
    }
    setSelectedFile(null);
    setFilePreview(null);
  };

  // Quiz handlers
  const addQuestion = () => {
    setFormData({
      ...formData,
      questions: [
        ...formData.questions,
        { question: "", options: ["", ""], correctAnswer: 0 },
      ],
    });
  };

  const removeQuestion = (qIdx) => {
    const updated = formData.questions.filter((_, idx) => idx !== qIdx);
    setFormData({ ...formData, questions: updated });
  };

  const updateQuestion = (qIdx, value) => {
    const updated = [...formData.questions];
    updated[qIdx].question = value;
    setFormData({ ...formData, questions: updated });
  };

  const addOption = (qIdx) => {
    const updated = [...formData.questions];
    updated[qIdx].options.push("");
    setFormData({ ...formData, questions: updated });
  };

  const updateOption = (qIdx, oIdx, value) => {
    const updated = [...formData.questions];
    updated[qIdx].options[oIdx] = value;
    setFormData({ ...formData, questions: updated });
  };

  const removeOption = (qIdx, oIdx) => {
    const updated = [...formData.questions];
    updated[qIdx].options.splice(oIdx, 1);
    if (updated[qIdx].correctAnswer >= updated[qIdx].options.length) {
      updated[qIdx].correctAnswer = 0;
    }
    setFormData({ ...formData, questions: updated });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title) {
      Swal.fire("Error", "Lesson title is required", "error");
      return;
    }
    
    setUploading(true);
    
    try {
      const submitData = new FormData();
      submitData.append("title", formData.title);
      submitData.append("type", formData.type);
      submitData.append("order", formData.order);
      submitData.append("isFree", formData.isFree);
      submitData.append("course", courseId);
      submitData.append("chapter", chapterId);
      
      if (formData.type === "video" || formData.type === "audio") {
        // Use file if selected, otherwise use URL
        if (selectedFile) {
          submitData.append("contentUrl", selectedFile);
        } else if (formData.contentUrl) {
          submitData.append("contentUrl", formData.contentUrl);
        }
        submitData.append("duration", formData.duration || "");
      }
      
      if (formData.type === "module") {
        submitData.append("content", formData.content || "");
      }
      
      if (formData.type === "quiz") {
        submitData.append("questions", JSON.stringify(formData.questions));
      }
      
      let response;
      const config = {
        headers: { "Content-Type": "multipart/form-data" }
      };
      
      if (initialData) {
        response = await axios.put(
          `${baseUrl}/api/lessons/${initialData._id}`,
          submitData,
          config
        );
      } else {
        response = await axios.post(`${baseUrl}/api/lessons`, submitData, config);
      }
      
      if (response.data.success) {
        Swal.fire("Success", `Lesson ${initialData ? "updated" : "created"} successfully`, "success");
        if (onSuccess) onSuccess();
        onClose();
      } else {
        throw new Error(response.data.message || "Save failed");
      }
    } catch (err) {
      console.error("Save error:", err);
      Swal.fire("Error", err.response?.data?.message || err.message || "Save failed", "error");
    } finally {
      setUploading(false);
    }
  };

  const getFileAccept = () => {
    if (formData.type === "video") {
      return "video/mp4,video/mpeg,video/quicktime,video/webm";
    }
    if (formData.type === "audio") {
      return "audio/mpeg,audio/mp3,audio/wav,audio/ogg,audio/aac";
    }
    return "";
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white dark:bg-[#292D4A] p-6 rounded-xl border shadow-sm space-y-4 max-h-[80vh] overflow-y-auto"
    >
      <h3 className="font-bold text-lg">
        {initialData ? "Edit" : "Add"} Lesson
      </h3>

      {/* Title */}
      <input
        className="w-full border p-2 rounded dark:bg-gray-800 dark:border-gray-700"
        placeholder="Title"
        value={formData.title}
        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        required
      />

      {/* Order & Type */}
      <div className="grid grid-cols-2 gap-4">
        <input
          type="number"
          className="border p-2 rounded dark:bg-gray-800 dark:border-gray-700"
          placeholder="Order"
          value={formData.order}
          onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
        />
        <select
          className="border p-2 rounded dark:bg-gray-800 dark:border-gray-700"
          value={formData.type}
          onChange={(e) => {
            setFormData({ ...formData, type: e.target.value });
            handleRemoveFile();
          }}
        >
          <option value="video">🎥 Video</option>
          <option value="audio">🎵 Audio</option>
          <option value="module">📚 Module</option>
          <option value="quiz">❓ Quiz</option>
        </select>
      </div>

      {/* Free Preview */}
      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={formData.isFree}
          onChange={(e) => setFormData({ ...formData, isFree: e.target.checked })}
        />
        Free Preview
      </label>

      {/* Video/Audio Fields */}
      {(formData.type === "video" || formData.type === "audio") && (
        <div className="space-y-2">
          {/* File Upload */}
          <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4 text-center">
            <input
              type="file"
              accept={getFileAccept()}
              onChange={handleFileChange}
              className="hidden"
              id="file-upload"
            />
            <label
              htmlFor="file-upload"
              className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
            >
              📁 Choose File
            </label>
            {selectedFile && (
              <div className="mt-2 text-sm">
                <span>{selectedFile.name}</span>
                <button
                  type="button"
                  onClick={handleRemoveFile}
                  className="ml-2 text-red-500"
                >
                  ✕
                </button>
                {formData.type === "audio" && filePreview && (
                  <audio controls className="w-full mt-2">
                    <source src={filePreview} />
                  </audio>
                )}
              </div>
            )}
          </div>
          
          {/* Or URL */}
          <input
            className="w-full border p-2 rounded dark:bg-gray-800 dark:border-gray-700"
            placeholder="Or Enter URL"
            value={formData.contentUrl}
            onChange={(e) => {
              setFormData({ ...formData, contentUrl: e.target.value });
              if (e.target.value) handleRemoveFile();
            }}
            disabled={!!selectedFile}
          />
          
          {/* Duration */}
          <input
            className="w-full border p-2 rounded dark:bg-gray-800 dark:border-gray-700"
            placeholder="Duration (e.g. 10:30)"
            value={formData.duration}
            onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
          />
        </div>
      )}

      {/* Module Content */}
      {formData.type === "module" && (
        <textarea
          className="w-full border p-2 rounded h-32 dark:bg-gray-800 dark:border-gray-700"
          placeholder="Module content..."
          value={formData.content}
          onChange={(e) => setFormData({ ...formData, content: e.target.value })}
        />
      )}

      {/* Quiz Section */}
      {formData.type === "quiz" && (
        <div className="space-y-4 border-t pt-4">
          {formData.questions.map((q, qIdx) => (
            <div key={qIdx} className="p-3 bg-gray-50 dark:bg-gray-800 rounded border space-y-2">
              <div className="flex justify-between">
                <strong>Question {qIdx + 1}</strong>
                <button
                  type="button"
                  onClick={() => removeQuestion(qIdx)}
                  className="text-red-500"
                >
                  Remove
                </button>
              </div>
              <input
                className="w-full p-2 border rounded dark:bg-gray-700"
                placeholder="Question"
                value={q.question}
                onChange={(e) => updateQuestion(qIdx, e.target.value)}
              />
              {q.options.map((opt, oIdx) => (
                <div key={oIdx} className="flex gap-2 items-center">
                  <input
                    type="radio"
                    name={`correct-${qIdx}`}
                    checked={q.correctAnswer === oIdx}
                    onChange={() => {
                      const updated = [...formData.questions];
                      updated[qIdx].correctAnswer = oIdx;
                      setFormData({ ...formData, questions: updated });
                    }}
                  />
                  <input
                    className="flex-1 p-2 border rounded dark:bg-gray-700"
                    placeholder={`Option ${oIdx + 1}`}
                    value={opt}
                    onChange={(e) => updateOption(qIdx, oIdx, e.target.value)}
                  />
                  {q.options.length > 2 && (
                    <button
                      type="button"
                      onClick={() => removeOption(qIdx, oIdx)}
                      className="text-red-500"
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={() => addOption(qIdx)}
                className="text-sm bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded"
              >
                + Add Option
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addQuestion}
            className="w-full bg-primary text-white py-2 rounded hover:bg-primary/90"
          >
            + Add Question
          </button>
        </div>
      )}

      {/* Buttons */}
      <div className="flex gap-2 pt-4">
        <button
          type="submit"
          disabled={uploading}
          className="flex-1 bg-primary text-white  py-2 rounded disabled:opacity-50"
        >
          {uploading ? "Saving..." : "Save Lesson"}
        </button>
        <button
          type="button"
          onClick={onClose}
          className="flex-1 bg-gray-200 dark:bg-gray-700 px-6 py-2 rounded"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default LessonForm;