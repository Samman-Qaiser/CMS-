import { useState } from "react";
import { BsChevronDown, BsPlus } from "react-icons/bs";

const Menu = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState("Header Menu");

  const menus = ["Header Menu", "Footer Menu", "main menu", "vhtarfe"];

  return (
    <div className="bg-white dark:bg-[#292d4a] rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 transition-all">
      {/* Upper Section */}
      <div className="p-5 flex items-center justify-between border-b border-gray-50 dark:border-gray-800">
        <h3 className="text-primary font-bold text-lg">Menu</h3>
        <button className="flex items-center gap-1 px-4 py-2 bg-primary/10 text-primary font-bold rounded-lg hover:bg-primary hover:text-white transition-all">
          <BsPlus size={20} />
          <span>Add menu</span>
        </button>
      </div>

      {/* Lower Section */}
      <div className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <p className="text-gray-600 dark:text-gray-300 font-bold">
          Select a menu to edit
        </p>

        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
          <div className="relative min-w-[280px]">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-full flex items-center justify-between px-4 py-3 bg-white dark:bg-[#2e3458] border border-primary rounded-xl text-gray-500 dark:text-gray-300 transition-all"
            >
              <span>{selectedMenu}</span>
              <BsChevronDown
                className={`transition-transform ${isDropdownOpen ? "rotate-180" : ""}`}
              />
            </button>

            {isDropdownOpen && (
              <div className="absolute top-[calc(100%+8px)] left-0 w-full bg-white dark:bg-[#2e3458] shadow-xl border border-gray-100 dark:border-gray-700 rounded-xl z-20 overflow-hidden">
                {menus.map((menu) => (
                  <div
                    key={menu}
                    onClick={() => {
                      setSelectedMenu(menu);
                      setIsDropdownOpen(false);
                    }}
                    className={`px-4 py-3 cursor-pointer transition-colors ${
                      selectedMenu === menu
                        ? "bg-gray-100 dark:bg-white/10 text-gray-900 dark:text-white"
                        : "text-gray-500 hover:bg-gray-50 dark:hover:bg-white/5"
                    }`}
                  >
                    {menu}
                  </div>
                ))}
              </div>
            )}
          </div>

          <button className="px-8 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary-dark transition-all">
            Select
          </button>
        </div>
      </div>
    </div>
  );
};

export default Menu;
