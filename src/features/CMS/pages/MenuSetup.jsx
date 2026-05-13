import { useState } from "react";
import ScreenOptions from "../components/ScreenOptions";
import Menu from "../components/Menu";
import MenuTypes from "../components/MenuTypes";
import MenuName from "../components/MenuName";

const MenuSetup = () => {
  const [menus, setMenus] = useState([
    "Header Menu",
    "Footer Menu",
    "main menu",
  ]);
  const [activeMenu, setActiveMenu] = useState("Header Menu");
  const [isAddingNew, setIsAddingNew] = useState(false);

  const [currentMenuItems, setCurrentMenuItems] = useState([]);

  const handleAddMenuClick = () => {
    setIsAddingNew(true);
    setActiveMenu("");
    setCurrentMenuItems([]);
  };

  const handleAddToMenu = (selectedItems) => {
    // selectedItems is an array of { label: string, type: string }
    const newItemsWithIds = selectedItems.map((item) => ({
      ...item,
      id: `item-${Date.now()}-${Math.random()}`,  
    }));

    setCurrentMenuItems((prev) => [...prev, ...newItemsWithIds]);
  };

  const handleSaveMenu = (newName) => {
    if (!newName.trim()) return;
    if (!menus.includes(newName)) setMenus([...menus, newName]);
    setActiveMenu(newName);
    setIsAddingNew(false); 
  };

  return (
    <div className="p-4 space-y-6">
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
          />
        </div>
      </div>
    </div>
  );
};

export default MenuSetup;
