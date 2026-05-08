import { useState } from "react";
import { IoSettingsOutline, IoWaterOutline, IoClose } from "react-icons/io5";
import { motion, AnimatePresence } from "framer-motion"; 
import ThemeSwitcher from "./ThemeSwitcher";
import DemoSwitcher from "./DemoSwitcher";

const ControlPanel = () => {
  const [activeModal, setActiveModal] = useState(null);
  const handleClose = () => setActiveModal(null);

  return (
    <>
      <div className="fixed right-0 top-[28%] -translate-y-1/2 flex flex-col gap-1 z-[9999]">
        <button
          onClick={() => setActiveModal("demo")}
          className="bg-[#627EEA] text-white p-3 rounded-l-md shadow-lg hover:bg-[#4a6cf0] transition-all cursor-pointer"
        >
          <IoWaterOutline size={24} />
        </button>

        <button
          onClick={() => setActiveModal("theme")}
          className="bg-[#FF6A59] text-white p-3 rounded-l-md shadow-lg hover:bg-[#ee4a4a] transition-all cursor-pointer"
        >
          <IoSettingsOutline size={24} className="animate-[spin_4s_linear_infinite]" />
        </button>
      </div>

      <AnimatePresence>
        {activeModal && (
          <div className="fixed inset-0 z-[10000] overflow-hidden">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleClose}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            {/* Sliding Full-Screen Container */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="absolute inset-0 flex justify-end"
            >
              <div className="w-full h-full overflow-y-auto custom-scrollbar bg-transparent">
                 {activeModal === "demo" ? (
                  <DemoSwitcher onClose={handleClose} />
                ) : (
                  <ThemeSwitcher onClose={handleClose}  />
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ControlPanel;