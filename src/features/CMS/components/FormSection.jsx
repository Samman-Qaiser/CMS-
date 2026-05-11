import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { IoChevronUp } from "react-icons/io5";

const FormSection = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="bg-white dark:bg-[#292d4a] rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 mb-6 overflow-hidden">
      <div
        className="p-4 border-b border-gray-50 dark:border-gray-800 flex justify-between items-center cursor-pointer hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h3 className="text-primary font-bold">{title}</h3>
        <motion.div animate={{ rotate: isOpen ? 0 : 180 }}>
          <IoChevronUp className="text-primary" />
        </motion.div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="p-4">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FormSection;
