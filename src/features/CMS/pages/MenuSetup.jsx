/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";
import ScreenOptions from "../components/ScreenOptions";
import Menu from "../components/Menu";
import MenuTypes from "../components/MenuTypes";
import MenuName from "../components/MenuName";
import { initialMenusData } from "../components/pagesData";
import Swal from "sweetalert2";

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
  const handleReorder = (newOrder) => {
    setCurrentMenuItems(newOrder);
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

  // handler to update any property of a menu item
  const handleUpdateItem = (id, updates) => {
    setCurrentMenuItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updates } : item)),
    );
  };
  const handleDeleteMenu = (menuName) => {
    if (!menuName) return;

    Swal.fire({
      title: "Are you sure?",
      text: `You are about to delete "${menuName}". This cannot be undone!`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        // 1. Remove from allMenusContent
        setAllMenusContent((prev) => {
          const newContent = { ...prev };
          delete newContent[menuName];
          return newContent;
        });

        setMenus((prev) => prev.filter((m) => m !== menuName));
        setActiveMenu(menus[0] || "");

        Swal.fire("Deleted!", "Your menu has been removed.", "success");
      }
    });
  };

  const handleSaveMenu = (newName, itemsToSave) => {
    if (!newName.trim()) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Please enter a menu name!",
        confirmButtonColor: "var(--primary)",
      });
      return;
    }

    setAllMenusContent((prev) => ({
      ...prev,
      [newName]: itemsToSave,
    }));

    if (!menus.includes(newName)) {
      setMenus((prev) => [...prev, newName]);
    }

    // 2. Trigger the Success Alert
    Swal.fire({
      title: "Success!",
      text: `${newName} has been saved successfully.`,
      icon: "success",
      timer: 2000,
      showConfirmButton: false,
      toast: true,
      position: "top-end",
      timerProgressBar: true,
    });

    setActiveMenu(newName);
    setIsAddingNew(false);
  };

  return (
    <div className="p-4 space-y-6 min-h-screen">
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
            onReorder={handleReorder}
            onSave={handleSaveMenu}
            onDeleteMenu={() => handleDeleteMenu(activeMenu)}
            onUpdateName={setActiveMenu}
            onRemoveItem={handleRemoveItem}
            onUpdateItem={handleUpdateItem}
          />
        </div>
      </div>
    </div>
  );
};

export default MenuSetup;
