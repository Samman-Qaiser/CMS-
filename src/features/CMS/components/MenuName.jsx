import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BsChevronDown, BsArrowsMove, BsTrash } from "react-icons/bs";
import { MenuItemForm } from "./MenuItemForm";

const MenuName = ({
  activeMenuName,
  isAddingNew,
  menuItems,
  onSave,
  onUpdateName,
  onRemoveItem,
  onUpdateItem,
  onDeleteMenu,
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
            value={activeMenuName}
            onChange={(e) => onUpdateName(e.target.value)}
            className="w-full sm:w-64 px-4 text-sm py-2 rounded-lg bg-white outline-none text-gray-600 font-medium"
          />
        </div>
        <button
          onClick={() => onSave(activeMenuName, menuItems)}
          className="cursor-pointer active:scale-95 transition-all px-3 py-1 bg-primary hover:bg-primary-dark rounded-lg text-white font-bold "
        >
          Save Menu
        </button>
      </div>

      <div className="p-6 space-y-4 min-h-[400px]">
        <div className="mb-6">
          <h4 className="text-sm font-bold text-gray-700 dark:text-gray-200">
            Menu Structure
          </h4>
          <p className="text-xs text-gray-400">
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
                className={`border rounded-xl overflow-hidden bg-white dark:bg-[#2e3458] transition-colors ${
                  openItem === item.id
                    ? "border-primary/50 shadow-md"
                    : "border-gray-200 dark:border-gray-700"
                }`}
              >
                {/* Accordion Header */}
                <div
                  className="flex items-center p-4 cursor-pointer select-none"
                  onClick={() =>
                    setOpenItem(openItem === item.id ? null : item.id)
                  }
                >
                  <div className="text-primary mr-4">
                    <BsArrowsMove size={18} />
                  </div>
                  <div className="flex-1 flex items-center justify-between">
                    <p
                      className={`text-xs font-medium ${openItem === item.id ? "text-primary" : "text-gray-700 dark:text-gray-200"}`}
                    >
                      {item.label}{" "}
                      <span className="mx-2 text-gray-300 font-normal">|</span>
                      <span
                        className={
                          openItem === item.id
                            ? "text-primary/70"
                            : "text-primary"
                        }
                      >
                        {item.type}
                      </span>
                    </p>
                    <BsChevronDown
                      className={`text-gray-400 transition-transform duration-300 ${openItem === item.id ? "rotate-180 text-primary" : ""}`}
                    />
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
                      <MenuItemForm
                        item={item}
                        onUpdateItem={onUpdateItem}
                        onRemoveItem={onRemoveItem}
                        onClose={() => setOpenItem(null)}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer Save Section */}
      <div className="p-4 bg-gray-50 dark:bg-black/10 border-t border-gray-200 flex items-center justify-between">
        <button
          type="button"
          onClick={onDeleteMenu} 
          className="flex items-center gap-2 cursor-pointer active:scale-95 transition-all text-red-500 hover:bg-red-50 p-2 rounded-lg font-bold"
        >
          <BsTrash size={20} />
        </button>
        <button
          onClick={() => onSave(activeMenuName, menuItems)}
          className="cursor-pointer active:scale-95 transition-all px-10 py-3 bg-primary text-white font-bold rounded-xl shadow-lg hover:opacity-90"
        >
          Save Menu
        </button>
      </div>
    </div>
  );
};

export default MenuName;
