import { useState } from "react";
import { IoSettingsOutline, IoWaterOutline, IoClose } from "react-icons/io5";
import ThemeSwitcher from "./ThemeSwitcher";
import DemoSwitcher from "./DemoSwitcher";

const ControlPanel = () => {
  const [activeModal, setActiveModal] = useState(null);

  return (
    <>
      <div className="fixed right-0 top-1/2 -translate-y-1/2 flex flex-col gap-1 z-[9999]">
        {/* Demo Switcher Button (Blue) */}
        <button
          onClick={() => setActiveModal("demo")}
          className="bg-[#627EEA] text-white p-3 rounded-l-md shadow-lg hover:bg-[#4a6cf0] transition-all cursor-pointer"
          title="Select Demo"
        >
          <IoWaterOutline size={24} />
        </button>

        {/* Theme Config Button (Red) */}
        <button
          onClick={() => setActiveModal("theme")}
          className="bg-[#FF6A59] text-white p-3 rounded-l-md shadow-lg hover:bg-[#ee4a4a] transition-all cursor-pointer"
          title="Pick Your Style"
        >
          <IoSettingsOutline
            size={24}
            className="animate-[spin_4s_linear_infinite]"
          />
        </button>
      </div>

      {/* 2. MODAL OVERLAY */}
      {activeModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[10000] flex items-center justify-center p-4">
          <div className="relative w-full max-w-5xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl">
            <button
              onClick={() => setActiveModal(null)}
              className="absolute top-4 right-4 p-2 bg-slate-100 hover:bg-slate-200 rounded-full text-slate-800 transition-colors cursor-pointer"
            >
              <IoClose size={24} />
            </button>

            <div className="p-8">
              {activeModal === "demo" ? (
                <DemoSwitcher onClose={() => setActiveModal(null)} />
              ) : (
                <ThemeSwitcher />
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ControlPanel;
