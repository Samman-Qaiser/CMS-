import { useState, useEffect } from 'react'
import axios from 'axios'
import Swal from 'sweetalert2'
import { BsTrash } from 'react-icons/bs'
import { BiEditAlt } from 'react-icons/bi'

const baseUrl =
  import.meta.env?.VITE_BACKEND_URL ||
  "https://cms-backend-ashen.vercel.app";

const CourseCategoriesPage = () => {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editData, setEditData] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    icon: '',
    isActive: true,
  })
  const [saving, setSaving] = useState(false)

  // ─── GET Categories ───────────────────────────────
  const fetchCategories = async () => {
    try {
      setLoading(true)
      const { data } = await axios.get(`${baseUrl}/api/course-categories`)
      setCategories(data.categories)
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  // ─── Open Modal ───────────────────────────────────
  const openAddModal = () => {
    setEditData(null)
    setFormData({ name: '', slug: '', description: '', icon: '', isActive: true })
    setShowModal(true)
  }

  const openEditModal = (cat) => {
    setEditData(cat)
    setFormData({
      name: cat.name,
      slug: cat.slug,
      description: cat.description || '',
      icon: cat.icon || '',
      isActive: cat.isActive,
    })
    setShowModal(true)
  }

  // ─── Auto Slug ────────────────────────────────────
  const handleNameChange = (e) => {
    const name = e.target.value
    setFormData((prev) => ({
      ...prev,
      name,
      slug: name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
    }))
  }

  // ─── Save ─────────────────────────────────────────
  const handleSave = async (e) => {
    e.preventDefault()
    try {
      setSaving(true)

      if (editData) {
        await axios.put(`${baseUrl}/api/course-categories/${editData._id}`, formData)
      } else {
        await axios.post(`${baseUrl}/api/course-categories`, formData)
      }

      await fetchCategories()
      setShowModal(false)

      Swal.fire({
        title: 'Success!',
        text: editData ? 'Category updated!' : 'Category added!',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false,
        toast: true,
        position: 'top-end',
      })
    } catch (error) {
      Swal.fire({
        title: 'Error!',
        text: error.response?.data?.message || 'Something went wrong',
        icon: 'error',
        confirmButtonColor: 'var(--primary)',
      })
    } finally {
      setSaving(false)
    }
  }

  // ─── Delete ───────────────────────────────────────
  const handleDelete = (cat) => {
    Swal.fire({
      title: 'Are you sure?',
      text: `Delete "${cat.name}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, delete!',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`${baseUrl}/api/course-categories/${cat._id}`)
          setCategories((prev) => prev.filter((c) => c._id !== cat._id))
          Swal.fire({
            title: 'Deleted!',
            icon: 'success',
            timer: 2000,
            showConfirmButton: false,
            toast: true,
            position: 'top-end',
          })
        } catch (error) {
          Swal.fire({
            title: 'Error!',
            text: error.response?.data?.message || 'Something went wrong',
            icon: 'error',
          })
        }
      }
    })
  }

  return (
    <div className="p-4 space-y-6">

      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-header-text">Course Categories</h2>
          <p className="text-content-text text-sm">Manage all course categories</p>
        </div>
        <button
          onClick={openAddModal}
          className="bg-primary text-white px-5 py-2 rounded-lg text-sm font-bold hover:opacity-90 transition-all active:scale-95"
        >
          + Add Category
        </button>
      </div>

      {/* Categories Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : categories.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          No categories found — add one!
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <div
              key={cat._id}
              className="bg-white dark:bg-[#292d4a] rounded-xl p-5 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-xl">
                    {cat.icon || '📚'}
                  </div>
                  <div>
                    <h4 className="text-header-text font-bold">{cat.name}</h4>
                    <p className="text-xs text-gray-400">{cat.slug}</p>
                  </div>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                  cat.isActive
                    ? 'bg-green-100 text-green-600'
                    : 'bg-red-100 text-red-600'
                }`}>
                  {cat.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>

              <p className="text-content-text text-xs mb-4">
                {cat.description || 'No description'}
              </p>

              <div className="flex gap-2">
                <button
                  onClick={() => openEditModal(cat)}
                  className="flex-1 flex items-center justify-center gap-1 py-2 bg-primary/10 text-primary rounded-lg text-xs font-bold hover:bg-primary/20 transition-all"
                >
                  <BiEditAlt size={14} /> Edit
                </button>
                <button
                  onClick={() => handleDelete(cat)}
                  className="flex-1 flex items-center justify-center gap-1 py-2 bg-red-100 text-red-600 rounded-lg text-xs font-bold hover:bg-red-200 transition-all"
                >
                  <BsTrash size={14} /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ─── Modal ──────────────────────────────────── */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#292d4a] rounded-2xl shadow-xl w-full max-w-md">

            {/* Modal Header */}
            <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
              <h3 className="text-primary font-bold text-lg">
                {editData ? 'Edit Category' : 'Add Category'}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600 text-xl font-bold"
              >
                ✕
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSave} className="p-6 space-y-4">

              {/* Name */}
              <div className="space-y-1">
                <label className="text-sm font-medium text-content-text">
                  Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={handleNameChange}
                  placeholder="e.g. Graphic Design"
                  required
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 outline-none focus:border-primary dark:bg-transparent text-sm"
                />
              </div>

              {/* Slug */}
              <div className="space-y-1">
                <label className="text-sm font-medium text-content-text">
                  Slug *
                </label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  placeholder="graphic-design"
                  required
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 outline-none focus:border-primary dark:bg-transparent text-sm"
                />
              </div>

              {/* Icon */}
              <div className="space-y-1">
                <label className="text-sm font-medium text-content-text">
                  Icon (emoji)
                </label>
                <input
                  type="text"
                  value={formData.icon}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  placeholder="🎨"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 outline-none focus:border-primary dark:bg-transparent text-sm"
                />
              </div>

              {/* Description */}
              <div className="space-y-1">
                <label className="text-sm font-medium text-content-text">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Category description..."
                  rows={3}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 outline-none focus:border-primary dark:bg-transparent text-sm resize-none"
                />
              </div>

              {/* isActive */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="w-4 h-4 accent-primary"
                />
                <label htmlFor="isActive" className="text-sm font-medium text-content-text cursor-pointer">
                  Active
                </label>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-2.5 border border-gray-200 dark:border-gray-700 text-content-text rounded-xl text-sm font-bold hover:bg-gray-50 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 py-2.5 bg-primary text-white rounded-xl text-sm font-bold hover:opacity-90 transition-all disabled:opacity-50"
                >
                  {saving ? 'Saving...' : editData ? 'Update' : 'Add'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default CourseCategoriesPage