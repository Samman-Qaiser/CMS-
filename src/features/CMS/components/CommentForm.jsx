import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { BsArrowLeft } from "react-icons/bs";
import Swal from "sweetalert2";
import { commentsData } from "../components/blogsData";

const CommentForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Find the specific comment data
  const commentToEdit = commentsData.find((c) => c.id === parseInt(id));

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      author: commentToEdit?.author || "",
      email: commentToEdit?.email || "",
      comment: commentToEdit?.comment || "",
      status: commentToEdit?.status || "Pending",
    },
  });

  const onSubmit = (data) => {
    console.log("Updated Data:", data);
    Swal.fire({
      title: "Success!",
      text: "Comment updated successfully",
      icon: "success",
      confirmButtonColor: "var(--primary)",
    }).then(() => {
      navigate("/dashboard/comments");
    });
  };

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
          {/* LEFT COLUMN: Main Details  */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-8 bg-white dark:bg-[#292d4a] rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden"
          >
            <div className="p-6 border-b border-gray-50 dark:border-gray-800">
              <h3 className="font-bold text-gray-700 dark:text-white">
                Edit Comment
              </h3>
            </div>

            <div className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Author Name */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-600 dark:text-gray-300">
                    Name
                  </label>
                  <input
                    {...register("author", { required: "Name is required" })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-transparent outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  />
                  {errors.author && (
                    <p className="text-red-500 text-xs">
                      {errors.author.message}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-600 dark:text-gray-300">
                    Email
                  </label>
                  <input
                    {...register("email", {
                      required: "Email is required",
                      pattern: {
                        value: /^\S+@\S+$/i,
                        message: "Invalid email",
                      },
                    })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-transparent outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-xs">
                      {errors.email.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Comment Content */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-600 dark:text-gray-300">
                  Comment
                </label>
                <textarea
                  {...register("comment", { required: "Comment is required" })}
                  rows="8"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-transparent outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
                ></textarea>
                {errors.comment && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.comment.message}
                  </p>
                )}
              </div>
            </div>
          </motion.div>

          {/* RIGHT COLUMN: Save Changes */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-4 space-y-6"
          >
            <div className="bg-white dark:bg-[#292d4a] rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
              {/* Card Header */}
              <div className="p-5 border-b border-gray-50 dark:border-gray-800 bg-gray-50/30 dark:bg-white/5">
                <h3 className="font-bold text-gray-700 dark:text-white flex items-center gap-2">
                  Save Changes
                </h3>
              </div>

              <div className="p-6 space-y-6">
                {/* Status Section */}
                <div className="space-y-3">
                  <label className="text-[13px] text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Status
                  </label>
                  <div className="relative group">
                    <select
                      {...register("status")}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-transparent outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all appearance-none cursor-pointer text-gray-700 dark:text-gray-200 font-medium z-10 relative"
                    >
                      <option value="approved">Approved</option>
                      <option value="pending">Pending</option>
                      <option value="spam">Spam</option>
                      <option value="trash">Trash</option>
                    </select>
                  </div>
                </div>

                <hr className="border-gray-50 dark:border-gray-800" />

                {/* Update Button */}
                <button
                  type="submit"
                  className="w-full py-4 rounded-xl bg-primary hover:bg-primary-dark text-white font-bold flex items-center justify-center gap-2 transition-all active:scale-[0.98] uppercase text-sm tracking-widest"
                >
                  Update
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </form>
    </div>
  );
};

export default CommentForm;
