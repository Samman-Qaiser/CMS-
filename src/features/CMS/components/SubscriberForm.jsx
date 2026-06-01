import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import axios from "axios";

const SubscriberForm = ({ onSave, editData, onCancel }) => {
  const { register, handleSubmit, reset } = useForm();

  useEffect(() => {
    if (editData) {
      reset({
        name: editData.name,
        email: editData.email,
        phone: editData.phone,
        status: editData.status,
        unsubscribe: editData.unsubscribe,
      });
    } else {
      reset({
        name: "",
        email: "",
        phone: "",
        status: false,
        unsubscribe: false,
      });
    }
  }, [editData, reset]);
  const baseUrl =
    import.meta.env?.VITE_BACKEND_URL || "https://cms-backend-ashen.vercel.app";

  const handleUnsubscribeToggle = async (e) => {
    if (!editData) return;  

    const isUnsubscribed = e.target.checked;
    try {
      await axios.post(`${baseUrl}/api/subscribers/unsubscribe`, {
        id: editData._id,
        isUnsubscribed: isUnsubscribed,
      });
    } catch (error) {
      console.error("Failed to update subscription status:", error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-[#292d4a] rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700"
    >
      <div className="p-6">
        <h3 className="text-primary font-bold text-lg mb-6">
          {editData ? "Edit Subscriber" : "Add Subscriber"}
        </h3>
        <form onSubmit={handleSubmit(onSave)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-400">
                Name
              </label>
              <input
                {...register("name")}
                placeholder="Full Name"
                className="w-full px-4 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-600 bg-transparent outline-none focus:ring-1 focus:ring-primary transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-400">
                Email
              </label>
              <input
                {...register("email")}
                placeholder="Email Address"
                className="w-full px-4 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-600 bg-transparent outline-none focus:ring-1 focus:ring-primary transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-400">
                Phone
              </label>
              <input
                {...register("phone")}
                placeholder="Phone Number"
                className="w-full px-4 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-600 bg-transparent outline-none focus:ring-1 focus:ring-primary transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-8">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" {...register("status")} value="active" />
              <span>Active</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                {...register("isUnsubscribed")}
                onChange={handleUnsubscribeToggle}
              />
              <span>Unsubscribed</span>
            </label>
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              className="bg-primary text-white px-8 py-2 rounded-lg font-bold shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
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
      </div>
    </motion.div>
  );
};

export default SubscriberForm;
