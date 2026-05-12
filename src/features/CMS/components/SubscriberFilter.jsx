import { useState } from "react";
import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import { BsSearch, BsChevronUp, BsChevronDown } from "react-icons/bs";

const SubscriberFilter = ({ onFilter }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const { register, handleSubmit, reset, setValue, watch } = useForm({
    defaultValues: {
      name: "",
      email: "",
      status: "Select Status",
    },
  });

  const selectedStatus = watch("status");
  const statuses = ["Active", "Inactive"];

  const onSubmit = (data) => {
    if (onFilter) onFilter(data);
  };

  const handleClear = () => {
    const defaultValues = { name: "", email: "", status: "Select Status" };
    reset(defaultValues);
    if (onFilter) onFilter(defaultValues);
  };

  return (
    <div className="bg-white dark:bg-[#292d4a] rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
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
              <input
                {...register("name")}
                placeholder="Name"
                className="w-full px-4 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-600 bg-transparent outline-none focus:ring-1 transition-all"
                style={{ color: "var(--content-text)" }}
              />
              <input
                {...register("email")}
                placeholder="Email"
                className="w-full px-4 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-600 bg-transparent outline-none focus:ring-1 transition-all"
                style={{ color: "var(--content-text)" }}
              />

              {/* Custom Status Dropdown */}
              <div className="w-full relative">
                <div
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className={`w-full px-4 py-2 text-sm rounded-lg border flex items-center justify-between cursor-pointer transition-all ${isDropdownOpen ? "border-primary ring-1" : "border-gray-200 dark:border-gray-600"}`}
                >
                  <span
                    className={
                      selectedStatus === "Select Status"
                        ? "text-gray-400"
                        : "text-gray-700 dark:text-gray-200"
                    }
                  >
                    {selectedStatus}
                  </span>
                  <BsChevronDown
                    className={`transition-transform ${isDropdownOpen ? "rotate-180" : ""}`}
                  />
                </div>
                <AnimatePresence>
                  {isDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute top-[110%] left-0 w-full bg-white dark:bg-[#32375a] border border-gray-100 dark:border-gray-600 rounded-lg shadow-xl z-20 overflow-hidden"
                    >
                      <div className="p-2">
                        {statuses.map((s) => (
                          <div
                            key={s}
                            onClick={() => {
                              setValue("status", s);
                              setIsDropdownOpen(false);
                            }}
                            className="p-3 hover:bg-gray-50 dark:hover:bg-white/5 cursor-pointer rounded-lg text-gray-500 hover:text-gray-800 transition-colors"
                          >
                            {s}
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="submit"
                  className="bg-primary text-white py-2 rounded-lg font-semibold flex items-center justify-center gap-2 hover:scale-105 active:scale-95 transition-transform"
                >
                  <BsSearch /> Filter
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

export default SubscriberFilter;
