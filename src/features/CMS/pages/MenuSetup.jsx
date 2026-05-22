import { useEffect, useState } from "react";
import ScreenOptions from "../components/ScreenOptions";
import Menu from "../components/Menu";
import MenuTypes from "../components/MenuTypes";
import MenuName from "../components/MenuName";
import Swal from "sweetalert2";
import axios from "axios";

const baseUrl =
  import.meta.env?.VITE_BACKEND_URL ||
  "https://cms-backend-ashen.vercel.app";

const MenuSetup = () => {
  const [menus, setMenus] = useState([])
  const [activeMenu, setActiveMenu] = useState(null)
  const [isAddingNew, setIsAddingNew] = useState(false)
  const [currentMenuItems, setCurrentMenuItems] = useState([])
  const [loading, setLoading] = useState(false)

  // ─── GET All Menus ────────────────────────────────
  const fetchMenus = async () => {
    try {
      const { data } = await axios.get(`${baseUrl}/api/menus`)
      setMenus(data.menus)
      if (data.menus.length > 0 && !activeMenu) {
        setActiveMenu(data.menus[0])
        setCurrentMenuItems(
          (data.menus[0].items || []).sort((a, b) => a.order - b.order)
        )
      }
    } catch (error) {
      console.error('Error fetching menus:', error)
    }
  }

  useEffect(() => {
    fetchMenus()
  }, [])

  // ─── Active Menu Change ───────────────────────────
  useEffect(() => {
    if (activeMenu && !isAddingNew) {
      setCurrentMenuItems(
        (activeMenu.items || []).sort((a, b) => a.order - b.order)
      )
    }
  }, [activeMenu, isAddingNew])

  // ─── Add New Menu Click ───────────────────────────
  const handleAddMenuClick = () => {
    setIsAddingNew(true)
    setActiveMenu(null)
    setCurrentMenuItems([])
  }

  // ─── Reorder ─────────────────────────────────────
  const handleReorder = (newOrder) => {
    setCurrentMenuItems(newOrder)
  }

  // ─── Add Items to Menu ────────────────────────────
  const handleAddToMenu = (selectedItems) => {
    const newItems = selectedItems.map((item) => ({
      ...item,
      id: `item-${Date.now()}-${Math.random()}`,
    }))
    setCurrentMenuItems((prev) => [...prev, ...newItems])
  }

  // ─── Remove Item ─────────────────────────────────
  const handleRemoveItem = (id) => {
    setCurrentMenuItems((prev) => prev.filter((item) => item.id !== id && item._id !== id))
  }

  // ─── Update Item ─────────────────────────────────
  const handleUpdateItem = (id, updates) => {
    setCurrentMenuItems((prev) =>
      prev.map((item) =>
        (item.id === id || item._id === id) ? { ...item, ...updates } : item
      )
    )
  }

  // ─── Format Items for Backend ─────────────────────
  const formatItems = (itemsToSave) => {
    return itemsToSave.map((item, index) => {
      const type = item.type?.toLowerCase() || 'custom_link'

      return {
        type,
        referenceId: (type === 'page' || type === 'blog') ? item.referenceId : null,
        label: item.label || 'Menu Item',
        // custom_link k liye url required hai
        url: type === 'custom_link' ? (item.url || '#') : (item.url || null),
        order: index,
        parent: item.parent || null,
        titleAttribute: item.titleAttribute || null,
        classAttribute: item.classAttribute || null,
        targetAttribute: item.openInNewTab ? '_blank' : (item.targetAttribute || '_self'),
        description: item.description || null,
      }
    })
  }

  // ─── Save Menu ────────────────────────────────────
  const handleSaveMenu = async (newName, itemsToSave) => {
    if (!newName.trim()) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Please enter a menu name!',
        confirmButtonColor: 'var(--primary)',
      })
      return
    }

    try {
      setLoading(true)
      const formattedItems = formatItems(itemsToSave)

      if (isAddingNew) {
        // ─── New Menu ─────────────────────────────
        const { data: menuData } = await axios.post(`${baseUrl}/api/menus`, {
          name: newName,
        })

        const menuId = menuData.menu._id

        // Items ek ek add karo
        for (const item of formattedItems) {
          await axios.post(`${baseUrl}/api/menus/${menuId}/items`, item)
        }

        // Naya menu fetch karo aur active set karo
        const { data: freshData } = await axios.get(`${baseUrl}/api/menus`)
        setMenus(freshData.menus)
        const newMenu = freshData.menus.find((m) => m._id === menuId)
        if (newMenu) {
          setActiveMenu(newMenu)
          setCurrentMenuItems(newMenu.items || [])
        }
        setIsAddingNew(false)

      } else {
        // ─── Existing Menu ────────────────────────
        const menuId = activeMenu._id

        // Name update karo
        await axios.put(`${baseUrl}/api/menus/${menuId}`, { name: newName })

        // Purane items delete karo
        const { data: freshMenu } = await axios.get(`${baseUrl}/api/menus/${menuId}`)
        const existingItemIds = freshMenu.menu.items.map((i) => i._id)

        for (const itemId of existingItemIds) {
          await axios.delete(`${baseUrl}/api/menus/${menuId}/items/${itemId}`)
        }

        // Naye items add karo
        for (const item of formattedItems) {
          await axios.post(`${baseUrl}/api/menus/${menuId}/items`, item)
        }

        // Fresh data lao
        const { data: updatedMenu } = await axios.get(`${baseUrl}/api/menus/${menuId}`)
        setActiveMenu(updatedMenu.menu)
        setCurrentMenuItems(
          (updatedMenu.menu.items || []).sort((a, b) => a.order - b.order)
        )

        // Menus list update karo
        const { data: allMenus } = await axios.get(`${baseUrl}/api/menus`)
        setMenus(allMenus.menus)
      }

      Swal.fire({
        title: 'Success!',
        text: `${newName} has been saved successfully.`,
        icon: 'success',
        timer: 2000,
        showConfirmButton: false,
        toast: true,
        position: 'top-end',
        timerProgressBar: true,
      })
    } catch (error) {
      console.error(error)
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: error.response?.data?.message || 'Something went wrong',
        confirmButtonColor: 'var(--primary)',
      })
    } finally {
      setLoading(false)
    }
  }

  // ─── Delete Menu ──────────────────────────────────
  const handleDeleteMenu = (menu) => {
    if (!menu) return

    Swal.fire({
      title: 'Are you sure?',
      text: `You are about to delete "${menu.name}". This cannot be undone!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, delete it!',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`${baseUrl}/api/menus/${menu._id}`)

          // Menus refresh karo
          const { data } = await axios.get(`${baseUrl}/api/menus`)
          setMenus(data.menus)

          // Pehla menu active karo
          if (data.menus.length > 0) {
            setActiveMenu(data.menus[0])
            setCurrentMenuItems(data.menus[0].items || [])
          } else {
            setActiveMenu(null)
            setCurrentMenuItems([])
          }

          Swal.fire('Deleted!', 'Your menu has been removed.', 'success')
        } catch (error) {
          Swal.fire({
            icon: 'error',
            title: 'Error!',
            text: error.response?.data?.message || 'Something went wrong',
            confirmButtonColor: 'var(--primary)',
          })
        }
      }
    })
  }

  return (
    <div className="p-4 space-y-6 min-h-screen">
      <ScreenOptions />
      <Menu
        activeMenu={activeMenu}
        setActiveMenu={(menu) => {
          setActiveMenu(menu)
          setCurrentMenuItems(
            (menu?.items || []).sort((a, b) => a.order - b.order)
          )
          setIsAddingNew(false)
        }}
        menus={menus}
        onAddClick={handleAddMenuClick}
      />
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-4">
          <MenuTypes onAddToMenu={handleAddToMenu} />
        </div>
        <div className="lg:col-span-8">
          <MenuName
            activeMenuName={activeMenu?.name || ''}
            isAddingNew={isAddingNew}
            menuItems={currentMenuItems}
            onReorder={handleReorder}
            onSave={handleSaveMenu}
            onDeleteMenu={() => handleDeleteMenu(activeMenu)}
            onUpdateName={(name) => {
              if (activeMenu) {
                setActiveMenu({ ...activeMenu, name })
              }
            }}
            onRemoveItem={handleRemoveItem}
            onUpdateItem={handleUpdateItem}
            loading={loading}
          />
        </div>
      </div>
    </div>
  )
}

export default MenuSetup