import { presets } from "../../context/ThemeConfig";
import { useTheme } from "../../context/ThemeProvider";
import { IoClose } from "react-icons/io5";

import thumbnail1 from "/public/images/thumbnail1.jpg"; 
import thumbnail2 from "/public/images/thumbnail2.jpg";
import thumbnail3 from "/public/images/thumbnail3.jpg";
import thumbnail4 from "/public/images/thumbnail4.jpg";
import thumbnail5 from "/public/images/thumbnail5.jpg";
import thumbnail6 from "/public/images/thumbnail6.jpg";
import thumbnail7 from "/public/images/thumbnail7.jpg";
import thumbnail8 from "/public/images/thumbnail8.jpg";
import thumbnail9 from "/public/images/thumbnail9.jpg";

const DemoSwitcher = ({ onClose }) => {
  const { applyPreset } = useTheme();
  const demoKeys = Object.keys(presets);

  const thumbMap = {
    default: thumbnail1,
    demo1: thumbnail2,
    demo2: thumbnail3,
    demo3: thumbnail4,
    demo4: thumbnail5,
    demo5: thumbnail6,
    demo6: thumbnail7,
    demo7: thumbnail8,
    demo8: thumbnail9,
  };

  const savedTheme = JSON.parse(localStorage.getItem("user-theme-custom"));

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#111111] w-full max-w-7xl h-[90vh] flex flex-col rounded-2xl p-8 relative shadow-2xl">
        {/* 1. Header Section (Static) */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center bg-white rounded-lg text-black hover:bg-slate-200 transition-colors cursor-pointer z-10"
        >
          <IoClose size={24} />
        </button>

        <div className="mb-10 flex-none">
          <button
            onClick={() => {
              localStorage.removeItem("user-theme-custom");
              window.location.reload();
            }}
            className="bg-[#FF4D4D] text-white px-4 py-1.5 rounded-lg text-sm font-bold mb-4 hover:brightness-110 transition-all cursor-pointer"
          >
            Delete All Cookie
          </button>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            Select A Demo
          </h2>
        </div>

        {/* 2. Scrollable Demos Section (Only this part scrolls) */}
        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10">
            {demoKeys.map((key) => {
              const isActive =
                savedTheme &&
                JSON.stringify(savedTheme) === JSON.stringify(presets[key]);

              return (
                <div key={key} className="group">
                  <div
                    onClick={() => {
                      applyPreset(key);
                      onClose();
                    }}
                    className={`relative aspect-[16/10] rounded-lg overflow-hidden border-4 transition-all cursor-pointer shadow-lg 
                      ${isActive ? "border-[#5EEAD4]" : "border-transparent hover:border-[#5EEAD4]"}`}
                  >
                    <img
                      src={
                        thumbMap[key] ||
                        "https://placehold.co/600x400?text=No+Preview"
                      }
                      alt={key}
                      className="w-full h-full object-cover"
                    />

                    {isActive && (
                      <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                        <span className="bg-[#5EEAD4] text-[#111111] px-6 py-2 rounded-lg text-sm font-black uppercase shadow-xl">
                          {key === "default" ? "Default" : key}
                        </span>
                      </div>
                    )}

                    {!isActive && (
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="bg-[#5EEAD4] text-[#111111] px-6 py-2 rounded-lg text-sm font-black uppercase">
                          Apply {key}
                        </span>
                      </div>
                    )}
                  </div>

                  <p className="mt-4 text-base font-bold text-white capitalize tracking-wide">
                    {key === "default"
                      ? "Default"
                      : key.replace("demo", "Demo ")}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* 3. Footer Section (Static) */}
        <p className="mt-12 text-[13px] text-white/60 font-medium flex-none">
          <span className="text-[#FF4D4D] font-bold">*Note :</span> This theme
          switcher is not part of product. It is only for demo. you will get all
          guideline in documentation. please check{" "}
          <span className="text-[#FF4D4D] cursor-pointer hover:underline">
            documentation.
          </span>
        </p>
      </div>
    </div>
  );
};

export default DemoSwitcher;
