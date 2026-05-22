import { useState, useEffect } from "react";
import { motion, AnimatePresence, Reorder } from "framer-motion";
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
  onReorder,
  loading,
}) => {
  const [openItem, setOpenItem] = useState(null)
  // ✅ Local state rakho — parent se sync karo
  const [localName, setLocalName] = useState(activeMenuName)

  useEffect(() => {
    setLocalName(activeMenuName)
  }, [activeMenuName])

  return (
    <div className="bg-white dark:bg-[#292d4a] rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
      {/* Header */}
      <div className="bg-primary p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <h3 className="text-white font-bold text-lg whitespace-nowrap">
            Menu Name
          </h3>
          {/* ✅ localName use karo */}
          <input
            type="text"
            value={localName}
            onChange={(e) => {
              setLocalName(e.target.value)
              onUpdateName(e.target.value)
            }}
            placeholder="Enter menu name..."
            className="w-full sm:w-64 px-4 text-sm py-2 rounded-lg bg-white outline-none text-gray-600 font-medium"
          />
        </div>
        <button
          onClick={() => onSave(localName, menuItems)}
          disabled={loading}
          className="cursor-pointer active:scale-95 transition-all px-3 py-1 bg-primary hover:bg-primary-dark rounded-lg text-white font-bold disabled:opacity-50"
        >
          {loading ? 'Saving...' : 'Save Menu'}
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
              : "Drag the move icon to reorder items."}
          </p>
        </div>

        {menuItems.length === 0 ? (
          <div className="h-40 flex items-center justify-center border-2 border-dashed border-gray-200 rounded-2xl">
            <p className="text-gray-400 italic">No items added yet.</p>
          </div>
        ) : (
          <Reorder.Group
            axis="y"
            values={menuItems}
            onReorder={onReorder}
            className="space-y-3"
          >
            {menuItems.map((item) => (
              <Reorder.Item
                key={item._id || item.id}
                value={item}
                className={`border rounded-xl overflow-hidden bg-white dark:bg-[#2e3458] transition-colors ${
                  openItem === (item._id || item.id)
                    ? "border-primary/50 shadow-md"
                    : "border-gray-200 dark:border-gray-700"
                }`}
              >
                <div className="flex items-center p-4 select-none">
                  <div className="text-primary mr-4 cursor-grab active:cursor-grabbing">
                    <BsArrowsMove size={18} />
                  </div>
                  <div
                    className="flex-1 flex items-center justify-between cursor-pointer"
                    onClick={() =>
                      setOpenItem(
                        openItem === (item._id || item.id)
                          ? null
                          : (item._id || item.id)
                      )
                    }
                  >
                    <p className={`text-xs font-medium ${
                      openItem === (item._id || item.id)
                        ? "text-primary"
                        : "text-gray-700 dark:text-gray-200"
                    }`}>
                      {item.label}{" "}
                      <span className="mx-2 text-gray-300 font-normal">|</span>
                      <span className={
                        openItem === (item._id || item.id)
                          ? "text-primary/70"
                          : "text-primary"
                      }>
                        {item.type}
                      </span>
                    </p>
                    <BsChevronDown
                      className={`text-gray-400 transition-transform duration-300 ${
                        openItem === (item._id || item.id)
                          ? "rotate-180 text-primary"
                          : ""
                      }`}
                    />
                  </div>
                </div>

                <AnimatePresence>
                  {openItem === (item._id || item.id) && (
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
              </Reorder.Item>
            ))}
          </Reorder.Group>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 bg-gray-50 dark:bg-black/10 border-t border-gray-200 flex items-center justify-between">
        <button
          type="button"
          onClick={onDeleteMenu}
          className="flex items-center gap-2 cursor-pointer active:scale-95 transition-all text-red-500 hover:bg-red-50 p-2 rounded-lg font-bold"
        >
          <BsTrash size={20} />
        </button>
        <button
          onClick={() => onSave(localName, menuItems)}
          disabled={loading}
          className="cursor-pointer active:scale-95 transition-all px-10 py-3 bg-primary text-white font-bold rounded-xl shadow-lg hover:opacity-90 disabled:opacity-50"
        >
          {loading ? 'Saving...' : 'Save Menu'}
        </button>
      </div>
    </div>
  )
}

export default MenuName