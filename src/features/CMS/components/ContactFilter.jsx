import { useState } from "react";
import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import { BsSearch, BsChevronUp, BsChevronDown } from "react-icons/bs";

const ContactFilter = ({ onFilter }) => {
  const [isOpen, setIsOpen] = useState(true);

  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      name: "",
      email: "",
      phone: "",
    },
  });

  const onSubmit = (data) => {
    if (onFilter) onFilter(data);
  };

  const handleClear = () => {
    const defaultValues = { name: "", email: "", phone: "" };
    reset(defaultValues);
    if (onFilter) onFilter(defaultValues);
  };

  return (
    <div className="bg-white dark:bg-[#292d4a] rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
      {/* Header with Toggle */}
      <div className="p-5 flex items-center justify-between">
        <h2 className="text-xl font-bold" style={{ color: "var(--primary)" }}>
          Filter
        </h2>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200"
          style={{ backgroundColor: "var(--primary)", color: "white" }}
        >
          {isOpen ? <BsChevronUp size={18} /> : <BsChevronDown size={18} />}
        </button>
      </div>

      {/* Animated Expandable Content */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="px-6 pb-8 pt-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end"
            >
              {/* Name Input */}
              <div className="w-full">
                <input
                  {...register("name")}
                  placeholder="Name"
                  className="w-full px-4 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-600 bg-transparent outline-none focus:ring-1 transition-all"
                  style={{ color: "var(--content-text)" }}
                />
              </div>

              {/* Email Input */}
              <div className="w-full">
                <input
                  {...register("email")}
                  placeholder="Email"
                  className="w-full px-4 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-600 bg-transparent outline-none focus:ring-1 transition-all"
                  style={{ color: "var(--content-text)" }}
                />
              </div>

              {/* Phone Input */}
              <div className="w-full">
                <input
                  {...register("phone")}
                  placeholder="Phone"
                  className="w-full px-4 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-600 bg-transparent outline-none focus:ring-1 transition-all"
                  style={{ color: "var(--content-text)" }}
                />
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="submit"
                  className="bg-primary text-white py-2 rounded-lg font-semibold flex items-center justify-center gap-2 hover:scale-105 active:scale-95 transition-transform shadow-lg shadow-primary/20"
                >
                  <BsSearch size={16} /> Filter
                </button>
                <button
                  type="button"
                  onClick={handleClear}
                  className="text-primary border-primary border py-2 rounded-lg font-semibold hover:bg-gray-50 active:scale-95 transition-all"
                >
                  Clear
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ContactFilter;
