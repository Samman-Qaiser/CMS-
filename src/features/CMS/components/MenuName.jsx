import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BsChevronDown, BsArrowsMove, BsTrash } from "react-icons/bs";

const MenuName = ({
  activeMenuName,
  isAddingNew,
  menuItems,
  onSave,
  onUpdateName,
}) => {
  const [openItem, setOpenItem] = useState(null);

  return (
    <div className="bg-white dark:bg-[#292d4a] rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
      {/* Header Section */}
      <div className="bg-primary p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <h3 className="text-white font-bold text-lg whitespace-nowrap">
            Menu Name
          </h3>
          <input
            type="text"
            placeholder="Enter menu name..."
            value={activeMenuName}
            onChange={(e) => onUpdateName(e.target.value)}
            className="w-full sm:w-64 px-4 py-2 rounded-lg bg-white outline-none text-gray-600 font-medium placeholder:text-gray-300"
          />
        </div>
        <button
          onClick={() => onSave(activeMenuName)}
          className="text-white font-bold hover:underline transition-all"
        >
          Save Menu
        </button>
      </div>

      {/* Menu Structure */}
      <div className="p-6 space-y-4 min-h-[400px] ">
        <div className="mb-6">
          <h4 className="text-lg font-bold text-gray-700 dark:text-gray-200">
            Menu Structure
          </h4>
          <p className="text-sm text-gray-400">
            {isAddingNew
              ? "Add menu items from the column on the left."
              : "Drag each item into the order you prefer."}
          </p>
        </div>

        {menuItems.length === 0 ? (
          <div className="h-40 flex items-center justify-center border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-2xl">
            <p className="text-gray-400 italic">
              No items added to this menu yet.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {menuItems.map((item) => (
              <div
                key={item.id}
                className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden shadow-sm bg-white dark:bg-[#2e3458]"
              >
                {/* Item Header */}
                <div className="flex items-center p-4">
                  <div className="text-primary mr-4 cursor-move hover:scale-110 transition-transform">
                    <BsArrowsMove size={18} />
                  </div>
                  <div className="flex-1 flex items-center justify-between">
                    <p className="text-sm font-bold text-gray-700 dark:text-gray-200">
                      {item.label}
                      <span className="mx-2 text-gray-300 font-light">|</span>
                      <span className="text-primary font-medium">
                        {item.type}
                      </span>
                    </p>
                    <button
                      onClick={() =>
                        setOpenItem(openItem === item.id ? null : item.id)
                      }
                      className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${openItem === item.id ? "bg-primary/10 text-primary" : "text-gray-400"}`}
                    >
                      <BsChevronDown
                        className={`transition-transform duration-300 ${openItem === item.id ? "rotate-180" : ""}`}
                      />
                    </button>
                  </div>
                </div>

                {/* Accordion Content */}
                <AnimatePresence>
                  {openItem === item.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="px-12 pb-6 pt-2 space-y-4 border-t border-gray-50 dark:border-gray-800">
                        <div className="grid grid-cols-1 gap-4">
                          <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-400 uppercase">
                              Navigation Label
                            </label>
                            <input
                              type="text"
                              defaultValue={item.label}
                              className="w-full p-2 text-sm border rounded-lg outline-none focus:border-primary dark:bg-black/20 dark:border-gray-600"
                            />
                          </div>
                        </div>
                        <div className="flex items-center gap-4 text-xs">
                          <button className="text-red-500 hover:underline">
                            Remove
                          </button>
                          <span className="text-gray-300">|</span>
                          <button className="text-gray-400 hover:underline">
                            Cancel
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer Actions */}
      <div className="p-4 bg-gray-50 dark:bg-black/10 border-t border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button className="flex items-center gap-2 text-red-500 font-bold hover:bg-red-50 p-2 px-4 rounded-lg transition-colors">
            <BsTrash size={18} />
            <span className="hidden sm:inline">Delete Menu</span>
          </button>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={() => onSave(activeMenuName)}
            className="w-full sm:w-auto px-10 py-3 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/30 hover:opacity-90 hover:scale-[1.02] active:scale-95 transition-all"
          >
            Save Menu
          </button>
        </div>
      </div>
    </div>
  );
};

export default MenuName;
