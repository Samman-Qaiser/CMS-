import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BsChevronDown, BsArrowsMove, BsTrash } from "react-icons/bs";

const MenuName = ({
  activeMenuName,
  isAddingNew,
  menuItems,
  onSave,
  onUpdateName,
  onRemoveItem,
  onUpdateItemLabel,
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
            className="w-full sm:w-64 px-4 py-2 rounded-lg bg-white outline-none text-gray-600 font-medium"
          />
        </div>
        <button
          onClick={() => onSave(activeMenuName, menuItems)}
          className="text-white font-bold hover:underline transition-all"
        >
          Save Menu
        </button>
      </div>

      {/* Menu Structure */}
      <div className="p-6 space-y-4 min-h-[400px]">
        <div className="mb-6">
          <h4 className="text-lg font-bold text-gray-700 dark:text-gray-200">
            Menu Structure
          </h4>
          <p className="text-sm text-gray-400">
            {isAddingNew
              ? "Add menu items from the left."
              : "Drag each item into the order you prefer."}
          </p>
        </div>

        {menuItems.length === 0 ? (
          <div className="h-40 flex items-center justify-center border-2 border-dashed border-gray-200 rounded-2xl">
            <p className="text-gray-400 italic">No items added yet.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {menuItems.map((item) => (
              <div
                key={item.id}
                className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden bg-white dark:bg-[#2e3458]"
              >
                <div className="flex items-center p-4">
                  <div className="text-primary mr-4 cursor-move">
                    <BsArrowsMove size={18} />
                  </div>
                  <div className="flex-1 flex items-center justify-between">
                    <p className="text-sm font-bold text-gray-700 dark:text-gray-200">
                      {item.label} <span className="mx-2 text-gray-300">|</span>
                      <span className="text-primary">{item.type}</span>
                    </p>
                    <button
                      onClick={() =>
                        setOpenItem(openItem === item.id ? null : item.id)
                      }
                      className="text-gray-400"
                    >
                      <BsChevronDown
                        className={`transition-transform ${openItem === item.id ? "rotate-180" : ""}`}
                      />
                    </button>
                  </div>
                </div>

                <AnimatePresence>
                  {openItem === item.id && (
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: "auto" }}
                      exit={{ height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="px-12 pb-6 pt-2 space-y-4 border-t border-gray-50 dark:border-gray-800">
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-gray-400 uppercase">
                            Navigation Label
                          </label>
                          <input
                            type="text"
                            value={item.label}
                            onChange={(e) =>
                              onUpdateItemLabel(item.id, e.target.value)
                            }
                            className="w-full p-2 text-sm border rounded-lg dark:bg-black/20"
                          />
                        </div>
                        <div className="flex items-center gap-4 text-xs">
                          <button
                            onClick={() => onRemoveItem(item.id)}
                            className="text-red-500 hover:underline"
                          >
                            Remove
                          </button>
                          <span className="text-gray-300">|</span>
                          <button
                            onClick={() => setOpenItem(null)}
                            className="text-gray-400 hover:underline"
                          >
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

      {/* Footer Save Section */}
      <div className="p-4 bg-gray-50 dark:bg-black/10 border-t border-gray-300 flex items-center justify-between">
        <button className="flex items-center gap-2 cursor-pointer active:scale-95 transition-all ease-linear text-red-500 font-bold">
          <BsTrash size={18} />
        </button>
        <button
          onClick={() => onSave(activeMenuName, menuItems)}
          className="cursor-pointer active:scale-95 transition-all ease-linear px-10 py-3 bg-primary text-white font-bold rounded-xl shadow-lg hover:opacity-90"
        >
          Save Menu
        </button>
      </div>
    </div>
  );
};

export default MenuName;
