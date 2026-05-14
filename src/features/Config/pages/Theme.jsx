import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
 
const THEME_OPTIONS = [
  { id: "Theme1", label: "Theme1", isDefault: true },
  { id: "Theme2", label: "Theme2" },
  { id: "Theme3", label: "Theme3" },
  { id: "Theme4", label: "Theme4" },
  { id: "Theme5", label: "Theme5" },
  { id: "Theme6", label: "Theme6" },
  { id: "Theme7", label: "Theme7" },
  { id: "Theme8", label: "Theme8" },
  { id: "Theme9", label: "Theme9" },
  { id: "Theme10", label: "Theme10" },
];

const Theme = () => {
  const navigate = useNavigate();
  const [selectedTheme, setSelectedTheme] = useState("Theme1");

  const handleSave = (e) => {
    e.preventDefault();

    Swal.fire({
      title: "Theme Applied!",
      text: `Your dashboard has been updated to ${selectedTheme}.`,
      icon: "success",
      confirmButtonColor: "var(--primary)",
      background: document.documentElement.classList.contains("dark") ? "#292d4a" : "#fff",
      color: document.documentElement.classList.contains("dark") ? "#fff" : "#545454",
    });
  };

  return (
    <div className="bg-white dark:bg-[#292d4a] rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden max-w-6xl mx-auto animate-fadeIn">
      {/* Header Section */}
      <div className="py-6 px-8 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
        <h3 className="text-primary font-medium text-lg">Configurations</h3>
        <button
          onClick={() => navigate("/dashboard/configurations/add-config")}
          className="bg-primary text-white px-6 py-2 rounded-lg font-semibold hover:opacity-90 transition-all active:scale-95 text-sm"
        >
          Add Config
        </button>
      </div>

      {/* Form Section */}
      <form onSubmit={handleSave} className="p-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Left Label - matches image_b172d7.png layout */}
          <label className="text-content-text text-sm font-medium">
            Theme
          </label>

          {/* Radio Group Container */}
          <div className="md:col-span-2 space-y-3">
            {THEME_OPTIONS.map((theme) => (
              <label 
                key={theme.id} 
                className="flex items-center group cursor-pointer w-fit"
              >
                <div className="relative flex items-center justify-center">
                  <input
                    type="radio"
                    name="themeSelection"
                    value={theme.id}
                    checked={selectedTheme === theme.id}
                    onChange={(e) => setSelectedTheme(e.target.value)}
                    className="peer appearance-none w-5 h-5 border-2 border-gray-300 dark:border-gray-600 rounded-full checked:border-primary transition-all cursor-pointer"
                  />
                  {/* Custom inner dot for the radio button */}
                  <div className="absolute w-2.5 h-2.5 rounded-full bg-primary scale-0 peer-checked:scale-100 transition-transform" />
                </div>
                
                <span className="ml-3 text-sm font-bold text-gray-700 dark:text-gray-200 group-hover:text-primary transition-colors">
                  {theme.label}
                </span>

                {theme.isDefault && (
                  <span className="ml-2 text-sm font-normal text-gray-400">
                    (Default)
                  </span>
                )}
              </label>
            ))}
          </div>
        </div>

        {/* Action Footer */}
        <div className="pt-6 border-t border-gray-100 dark:border-gray-700">
          <button
            type="submit"
            className="px-10 py-3 bg-primary text-white font-bold rounded-xl shadow-lg hover:opacity-90 active:scale-95 transition-all"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
};

export default Theme;