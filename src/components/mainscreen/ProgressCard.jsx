import { motion } from "framer-motion";

const ProgressCard = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="bg-white dark:bg-[#292d4a] rounded-2xl p-8 shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col items-center justify-center text-center h-full"
    >
      <div className="relative mb-6">
        {/* SVG Circular Progress */}
        <svg className="w-32 h-32 transform -rotate-90">
          <circle
            cx="64"
            cy="64"
            r="58"
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            className="text-gray-100 dark:text-gray-800"
          />
          <circle
            cx="64"
            cy="64"
            r="58"
            stroke="var(--primary)"
            strokeWidth="8"
            fill="transparent"
            strokeDasharray="364.4"
            strokeDashoffset={364.4 * (1 - 0.75)}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-2xl font-bold text-gray-800 dark:text-white">
          75%
        </span>
      </div>

      <h3
        className="text-xl font-bold mb-2"
        style={{ color: "var(--content-text)" }}
      >
        My Progress
      </h3>
      <p className="text-gray-500 text-sm mb-6 max-w-[200px]">
        Lorem ipsum dolor sit amet, consectetur
      </p>

      <button className="px-8 py-3 rounded-xl bg-primary hover:bg-primary-dark text-white font-semibold transition-transform hover:scale-105 active:scale-95">
        More Details
      </button>
    </motion.div>
  );
};

export default ProgressCard;
