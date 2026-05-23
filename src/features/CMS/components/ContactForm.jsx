import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import Swal from "sweetalert2";
import axios from "axios";

const ContactForm = ({ onSave, editData, onCancel }) => {
  const { register, handleSubmit, reset } = useForm();
  const baseUrl =
    import.meta.env?.VITE_BACKEND_URL || "https://cms-backend-ashen.vercel.app";

  const onSubmit = async (data) => {
    try {
      await axios.post(`${baseUrl}/api/emails/send`, {
        to: data.email, 
        subject: `New Message from ${data.name}`,
        message: `Phone: ${data.phone}\n\nMessage: ${data.message}`,
      });

      Swal.fire("Success", "Email sent successfully!", "success");
      onSave(data);
      reset();
    } catch (err) {
      console.error("Email Error:", err);
      Swal.fire("Error", "Failed to send email", "error");
    }
  };
  useEffect(() => {
    if (editData) {
      reset(editData);
    } else {
      reset({ name: "", email: "", phone: "", message: "" });
    }
  }, [editData, reset]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-[#292d4a] rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6"
    >
      <h3 className="text-primary font-bold text-lg mb-6">
        {editData ? "Edit Contact" : "Add Contact"}
      </h3>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-400">Name</label>
            <input
              {...register("name")}
              placeholder="Name"
              className="w-full px-4 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-600 bg-transparent outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-400">Email</label>
            <input
              {...register("email")}
              placeholder="Email"
              className="w-full px-4 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-600 bg-transparent outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-400">Phone</label>
            <input
              {...register("phone")}
              placeholder="Phone"
              className="w-full px-4 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-600 bg-transparent outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-400">Message</label>
          <textarea
            {...register("message")}
            rows="4"
            className="w-full px-4 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-600 bg-transparent outline-none focus:ring-1 focus:ring-primary resize-none"
          />
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            className="bg-primary cursor-pointer text-white px-8 py-2 rounded-lg font-bold shadow-lg shadow-primary/20 hover:scale-105 transition-all"
          >
            {editData ? "Update" : "Submit"}
          </button>
          {editData && (
            <button
              type="button"
              onClick={onCancel}
              className="border border-gray-300 text-gray-500 px-8 py-2 rounded-lg font-bold hover:bg-gray-50 transition-all"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </motion.div>
  );
};

export default ContactForm;
