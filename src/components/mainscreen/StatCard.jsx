import { motion } from "framer-motion";

const StatCard = ({ icon: Icon, count, label, bgColor, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: delay }}
      className="relative overflow-hidden rounded-2xl p-6 flex items-center gap-4 h-[110px] shadow-sm"
      style={{ backgroundColor: bgColor }}
    >
      <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shrink-0 shadow-inner">
        <Icon
          className="text-2xl"
          style={{ color: bgColor === "black" ? "#333" : bgColor }}
        />
      </div>

      <div className="flex flex-col text-white">
        <span className="text-2xl font-bold leading-none">{count}</span>
        <span className="text-sm font-medium opacity-90 mt-1">{label}</span>
      </div>

      <div className="absolute -right-2 top-1/2 -translate-y-1/2 opacity-20 pointer-events-none">
        <Icon size={80} color="white" />
      </div>
    </motion.div>
  );
};

export default StatCard;
