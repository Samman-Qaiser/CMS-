import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import axios from "axios";
import Swal from "sweetalert2";

const ContactAdminForm = () => {
  const { register, handleSubmit, reset } = useForm();
  const baseUrl =
    import.meta.env?.VITE_BACKEND_URL || "https://cms-backend-ashen.vercel.app";

  const onSubmit = async (data) => {
    try {
      await axios.post(`${baseUrl}/api/contacts`, data);
      Swal.fire("Success", "Message sent to admin successfully!", "success");
      reset();
    } catch (err) {
      console.error("Full Error Object:", err.response || err);
      const errorMessage =
        err.response?.data?.message || "Failed to submit contact request";
      Swal.fire("Error", errorMessage, "error");
    }
  };

  return (
    <div className="p-6">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto bg-white dark:bg-[#292d4a] rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-8"
      >
        <h3 className="text-primary font-bold text-xl mb-6">Contact Admin</h3>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <input
              {...register("name", { required: true })}
              placeholder="Name"
              className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-transparent outline-none focus:ring-1 focus:ring-primary"
            />
            <input
              {...register("email", { required: true })}
              placeholder="Email"
              className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-transparent outline-none focus:ring-1 focus:ring-primary"
            />
            <input
              {...register("phone")}
              placeholder="Phone"
              className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-transparent outline-none focus:ring-1 focus:ring-primary"
            />
            <textarea
              {...register("message", { required: true })}
              rows="4"
              placeholder="Your Message"
              className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-transparent outline-none focus:ring-1 focus:ring-primary resize-none"
            />
          </div>

          <button
            type="submit"
            className="bg-primary text-white px-8 py-2 rounded-lg font-bold w-full hover:opacity-90 transition-all"
          >
            Submit Request
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default ContactAdminForm;
