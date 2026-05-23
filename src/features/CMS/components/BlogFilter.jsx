import { useState } from "react";
import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import { BsSearch, BsChevronUp, BsChevronDown } from "react-icons/bs";

const BlogFilter = ({ onFilter }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const { register, handleSubmit, reset, setValue, watch } = useForm({
    defaultValues: { title: "", status: "Select Status", date: "" },
  });

  const selectedStatus = watch("status");
  const statuses = ["published", "draft", "pending"];

  const onSubmit = (data) => onFilter && onFilter(data);

  const handleClear = () => {
    const defaultValues = { title: "", status: "Select Status", date: "" };
    reset(defaultValues);
    if (onFilter) onFilter(defaultValues);
  };

  return (
    <div className="bg-white dark:bg-[#292d4a] rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
      <div className="p-5 flex items-center justify-between">
        <h2 className="text-xl font-bold text-primary">Filter Blogs</h2>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-8 h-8 rounded-full flex items-center justify-center bg-primary text-white"
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
          >
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="px-6 pb-8 pt-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end"
            >
              <input
                {...register("title")}
                placeholder="Blog Title"
                className="w-full px-4 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-600 bg-transparent outline-none focus:ring-1"
              />

              <div className="relative">
                <div
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="w-full px-4 py-2 text-sm rounded-lg border flex items-center justify-between cursor-pointer border-gray-200 dark:border-gray-600"
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
                    className={isDropdownOpen ? "rotate-180" : ""}
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
                            className="p-3 hover:bg-gray-50 dark:hover:bg-white/5 cursor-pointer rounded-lg capitalize"
                          >
                            {s}
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <input
                type="date"
                {...register("date")}
                className="w-full px-4 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-600 bg-transparent outline-none"
              />

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="submit"
                  className="w-full justify-center px-6 py-2 text-sm rounded-lg bg-primary text-white font-semibold flex items-center gap-2"
                >
                  <BsSearch /> Filter
                </button>
                <button
                  type="button"
                  onClick={handleClear}
                  className="w-full justify-center px-6 py-2 text-sm rounded-lg text-primary border border-primary font-semibold"
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

export default BlogFilter;
