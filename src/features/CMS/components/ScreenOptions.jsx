import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BsChevronUp } from "react-icons/bs";

const ScreenOptions = () => {
  const [isOpen, setIsOpen] = useState(true);
  const options = [
    "Page",
    "Blog",
    "CustomLink",
    "Title Attribute",
    "Class Attribute",
    "Target Attribute",
    "Description",
  ];

  return (
    <div className="bg-white dark:bg-[#292d4a] rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 mb-6 overflow-hidden transition-all">
      {/* Header */}
      <div className="p-5 flex items-center justify-between">
        <h3 className="text-primary font-bold text-lg">Screen Options</h3>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`w-8 h-8 flex items-center justify-center rounded-full bg-primary text-white transition-transform duration-300 ${
            isOpen ? "rotate-0" : "rotate-180"
          }`}
        >
          <BsChevronUp size={18} />
        </button>
      </div>

      {/* Collapsible Content */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="px-6 pb-8"
          >
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-y-6 gap-x-4">
              {options.map((option) => (
                <label
                  key={option}
                  className="flex items-center gap-3 cursor-pointer group"
                >
                  <div className="relative flex items-center justify-center">
                    <input
                      type="checkbox"
                      defaultChecked
                      className="peer appearance-none w-5 h-5 border-2 border-primary rounded-md checked:bg-primary transition-all cursor-pointer"
                    />
                    <svg
                      className="absolute w-3 h-3 text-white hidden peer-checked:block pointer-events-none"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="4"
                    >
                      <path d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-gray-600 dark:text-gray-300 font-semibold text-sm group-hover:text-primary transition-colors">
                    {option}
                  </span>
                </label>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ScreenOptions;
