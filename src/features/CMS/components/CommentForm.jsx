import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { BsArrowLeft } from "react-icons/bs";
import Swal from "sweetalert2";
import axios from "axios";
import { useEffect, useState } from "react";

const CommentForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const baseUrl =
    import.meta.env?.VITE_BACKEND_URL || "https://cms-backend-ashen.vercel.app";

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: { author: "", email: "", comment: "", status: "pending" },
  });

  useEffect(() => {
    if (id) {
      const fetchComment = async () => {
        setLoading(true);
        try {
          const res = await axios.get(`${baseUrl}/api/comments/${id}`);
          const data = res.data.comment;  
 
          setValue("author", data.name);
          setValue("email", data.email);
          setValue("comment", data.content);
          setValue("status", data.status);
        } catch (err) {
          Swal.fire("Error", "Could not load comment details", "error");
        } finally {
          setLoading(false);
        }
      };
      fetchComment();
    }
  }, [id, setValue, baseUrl]);

  const onSubmit = async (data) => {
    try {
      await axios.put(`${baseUrl}/api/comments/${id}`, { status: data.status });
      Swal.fire("Success!", "Comment status updated", "success").then(() => {
        navigate("/dashboard/comments");
      });
    } catch (err) {
      Swal.fire("Error", "Failed to update status", "error");
    }
  };

  if (loading) return <div className="p-10 text-center">Loading...</div>;

  return (
    <div className="p-6 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="mb-6 flex items-center gap-4">
        <button
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-full transition-colors text-gray-500"
        >
          <BsArrowLeft size={20} />
        </button>
        <h2 className="text-xl font-bold text-primary">Edit Comment</h2>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <motion.div className="lg:col-span-8 bg-white dark:bg-[#292d4a] rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
            <div className="p-6 border-b border-gray-50 dark:border-gray-800">
              <h3 className="font-bold text-gray-700 dark:text-white">
                View/Edit Comment
              </h3>
            </div>
            <div className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-600 dark:text-gray-300">
                    Name
                  </label>
                  <input
                    {...register("author")}
                    readOnly
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-600 dark:text-gray-300">
                    Email
                  </label>
                  <input
                    {...register("email")}
                    readOnly
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-600 dark:text-gray-300">
                  Comment
                </label>
                <textarea
                  {...register("comment")}
                  readOnly
                  rows="8"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed resize-none"
                ></textarea>
              </div>
            </div>
          </motion.div>

          <motion.div className="lg:col-span-4 space-y-6">
            <div className="bg-white dark:bg-[#292d4a] rounded-2xl shadow-sm border p-6">
              <label className="text-[13px] text-gray-500 uppercase tracking-wider">
                Status
              </label>
              <select
                {...register("status")}
                className="w-full px-4 py-3 mt-2 rounded-xl border border-gray-200 bg-transparent outline-none cursor-pointer"
              >
                <option value="approved">Approved</option>
                <option value="pending">Pending</option>
                <option value="spam">Spam</option>
                <option value="trash">Trash</option>
              </select>
              <button
                type="submit"
                className="w-full mt-6 py-4 rounded-xl bg-primary text-white font-bold uppercase text-sm"
              >
                Update Status
              </button>
            </div>
          </motion.div>
        </div>
      </form>
    </div>
  );
};

export default CommentForm;
