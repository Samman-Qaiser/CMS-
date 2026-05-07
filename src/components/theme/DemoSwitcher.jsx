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
    <div className="min-h-screen w-full flex items-center justify-center p-4">
      <div className="bg-[#111111] w-full max-w-7xl flex flex-col rounded-2xl p-8 shadow-2xl relative">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center bg-white rounded-lg text-black hover:bg-slate-200 transition-colors cursor-pointer z-10"
        >
          <IoClose size={24} />
        </button>

        {/* Header Section */}
        <div className="mb-10 flex-none">
          <button
            onClick={() => {
              localStorage.removeItem("user-theme-custom");
              window.location.reload();
            }}
            className="bg-primary text-white px-4 py-1.5 rounded-md text-sm font-semibold mb-4 text-[10px] hover:brightness-110 transition-all cursor-pointer"
          >
            Delete All Cookie
          </button>
          <h2 className="text-lg font-bold text-white tracking-tight">
            Select A Demo
          </h2>
        </div>

        {/* Demos Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10 pr-2">
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
                    ${isActive ? "" : "border-transparent "}`}
                >
                  <img
                    src={thumbMap[key] || "https://placehold.co/600x400?text=No+Preview"}
                    alt={key}
                    className="w-full h-full object-cover"
                  />

                  {isActive && (
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                      <span className="bg-[#5EEAD4]  px-6 py-2 rounded-lg text-sm text-white font-[500] shadow-xl">
                        {key === "default" ? "Default" : key}
                      </span>
                    </div>
                  )}

                  {!isActive && (
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="bg-[#5EEAD4]  py-2 px-4 rounded-sm text-[14px] text-white capitalize font-semibold">
                       {key}
                      </span>
                    </div>
                  )}
                </div>

                <p className="mt-4 text-base text-white capitalize tracking-wide">
                  {key === "default" ? "Default" : key.replace("demo", "Demo ")}
                </p>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <p className="mt-12 text-[13px] text-white/60 font-medium flex-none">
          <span className="text-[#FF4D4D] font-bold">*Note :</span> This theme
          switcher is not part of product...
        </p>
      </div>
    </div>
  );
};

export default DemoSwitcher;