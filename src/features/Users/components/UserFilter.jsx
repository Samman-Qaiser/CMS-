import { useState } from "react";
import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import { BsSearch, BsChevronUp, BsChevronDown } from "react-icons/bs";

const UserFilter = ({ onFilter }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const { register, handleSubmit, reset, setValue, watch } = useForm({
    defaultValues: {
      email: "",
      mobile: "",
      group: "Select Group",
    },
  });

  const selectedGroup = watch("group");
  const groups = ["Admin", "Manager", "Customer"];

  const onSubmit = (data) => {
    if (onFilter) {
      onFilter(data);
    }
  };

  const handleClear = () => {
    const defaultValues = {
      email: "",
      mobile: "",
      group: "Select Group",
    };
    reset(defaultValues);
    if (onFilter) {
      onFilter(defaultValues);
    }
  };

  return (
    <div className="bg-white dark:bg-[#292d4a] rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
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

      {/* Collapsible Content */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Grid Form Implementation */}
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="px-6 pb-8 pt-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end"
            >
              {/* Email Input */}
              <div className="w-full">
                <input
                  {...register("email")}
                  placeholder="Email"
                  className="w-full px-4 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-600 bg-transparent outline-none focus:ring-1 transition-all"
                  style={{ color: "var(--content-text)" }}
                />
              </div>

              {/* Mobile Input */}
              <div className="w-full">
                <input
                  {...register("mobile")}
                  placeholder="Mobile"
                  className="w-full px-4 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-600 bg-transparent outline-none focus:ring-1 transition-all"
                  style={{ color: "var(--content-text)" }}
                />
              </div>

              {/* Custom Group Dropdown */}
              <div className="w-full relative">
                <div
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className={`w-full px-4 py-2 text-sm rounded-lg border flex items-center justify-between cursor-pointer transition-all
                    ${isDropdownOpen ? "border-primary ring-1 " : "border-gray-200 dark:border-gray-600"}`}
                >
                  <span
                    className={
                      selectedGroup === "Select Group"
                        ? "text-gray-400"
                        : "text-gray-700 dark:text-gray-200"
                    }
                  >
                    {selectedGroup}
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
                        <div className="p-3 font-bold text-gray-800 dark:text-white border-b border-gray-50 dark:border-gray-700">
                          Select Group
                        </div>
                        {groups.map((group) => (
                          <div
                            key={group}
                            onClick={() => {
                              setValue("group", group);
                              setIsDropdownOpen(false);
                            }}
                            className="p-3 hover:bg-gray-50 dark:hover:bg-white/5 cursor-pointer rounded-lg text-gray-500 hover:text-gray-800 transition-colors"
                          >
                            {group}
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Buttons Grid Section */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="submit"
                  className="w-full justify-center px-6 py-2 text-sm rounded-lg bg-primary text-white font-semibold flex items-center gap-2 transition-transform hover:scale-105 active:scale-95"
                >
                  <BsSearch /> Filter
                </button>
                <button
                  type="button"
                  onClick={handleClear}
                  className="w-full justify-center px-6 py-2 text-sm rounded-lg text-primary border-primary font-semibold border transition-all hover:bg-gray-50 active:scale-95"
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

export default UserFilter;
