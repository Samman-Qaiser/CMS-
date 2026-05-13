/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";
import ScreenOptions from "../components/ScreenOptions";
import Menu from "../components/Menu";
import MenuTypes from "../components/MenuTypes";
import MenuName from "../components/MenuName";
import { initialMenusData } from "../components/pagesData";

const MenuSetup = () => {
  // states management
  const [allMenusContent, setAllMenusContent] = useState(initialMenusData);
  const [menus, setMenus] = useState(Object.keys(initialMenusData));
  const [activeMenu, setActiveMenu] = useState("Header Menu");
  const [isAddingNew, setIsAddingNew] = useState(false);

  const [currentMenuItems, setCurrentMenuItems] = useState([]);
  useEffect(() => {
    if (!isAddingNew) {
      const data = allMenusContent[activeMenu] || [];
      setCurrentMenuItems(data);
    }
  }, [activeMenu, isAddingNew, allMenusContent]);

  // handlers
  const handleAddMenuClick = () => {
    setIsAddingNew(true);
    setActiveMenu("");
    setCurrentMenuItems([]);
  };

  const handleAddToMenu = (selectedItems) => {
    const newItemsWithIds = selectedItems.map((item) => ({
      ...item,
      id: `item-${Date.now()}-${Math.random()}`,
    }));
    setCurrentMenuItems((prev) => [...prev, ...newItemsWithIds]);
  };

  const handleRemoveItem = (id) => {
    setCurrentMenuItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleUpdateItemLabel = (id, newLabel) => {
    setCurrentMenuItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, label: newLabel } : item,
      ),
    );
  };

  const handleSaveMenu = (newName, itemsToSave) => {
    if (!newName.trim()) return;

    setAllMenusContent((prev) => ({
      ...prev,
      [newName]: itemsToSave,
    }));

    if (!menus.includes(newName)) {
      setMenus((prev) => [...prev, newName]);
    }

    console.log(`Saved ${newName} with ${itemsToSave.length} items.`);

    setActiveMenu(newName);
    setIsAddingNew(false);
  };

  return (
    <div className="p-4 space-y-6 bg-gray-50 dark:bg-[#1a1c2e] min-h-screen">
      <ScreenOptions />
      <Menu
        activeMenu={activeMenu}
        setActiveMenu={setActiveMenu}
        menus={menus}
        onAddClick={handleAddMenuClick}
      />
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-4">
          <MenuTypes onAddToMenu={handleAddToMenu} />
        </div>
        <div className="lg:col-span-8">
          <MenuName
            activeMenuName={activeMenu}
            isAddingNew={isAddingNew}
            menuItems={currentMenuItems}
            onSave={handleSaveMenu}
            onUpdateName={setActiveMenu}
            onRemoveItem={handleRemoveItem}
            onUpdateItemLabel={handleUpdateItemLabel}
          />
        </div>
      </div>
    </div>
  );
};

export default MenuSetup;
