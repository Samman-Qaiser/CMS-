import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";

const baseUrl =
  import.meta.env?.VITE_BACKEND_URL ||
  "https://cms-backend-ashen.vercel.app";

const Reading = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [showOnFrontId, setShowOnFrontId] = useState(null)
  const [nodePerPageId, setNodePerPageId] = useState(null)
  const [formData, setFormData] = useState({
    showOnFront: "blog",
    nodePerPage: "10",
  })

  // ─── GET Reading Configurations ──────────────────
  useEffect(() => {
    const fetchReadingConfig = async () => {
      try {
        const { data } = await axios.get(
          `${baseUrl}/api/configurations?category=reading`
        )

        data.configurations.forEach((config) => {
          if (config.name === "Reading.showOnFront") {
            setShowOnFrontId(config._id)
            setFormData((prev) => ({ ...prev, showOnFront: config.value }))
          }
          if (config.name === "Reading.nodePerPage") {
            setNodePerPageId(config._id)
            setFormData((prev) => ({ ...prev, nodePerPage: config.value }))
          }
        })
      } catch (error) {
        console.error('Error fetching reading config:', error)
      }
    }

    fetchReadingConfig()
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // ─── Save ─────────────────────────────────────────
  const handleSave = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)

      // showOnFront update
      if (showOnFrontId) {
        await axios.put(`${baseUrl}/api/configurations/${showOnFrontId}`, {
          value: formData.showOnFront,
        })
      }

      // nodePerPage update
      if (nodePerPageId) {
        await axios.put(`${baseUrl}/api/configurations/${nodePerPageId}`, {
          value: formData.nodePerPage,
        })
      }

      Swal.fire({
        title: "Success!",
        text: "Reading configurations have been updated.",
        icon: "success",
        confirmButtonColor: "var(--primary)",
        background: document.documentElement.classList.contains("dark")
          ? "#292d4a" : "#fff",
        color: document.documentElement.classList.contains("dark")
          ? "#fff" : "#545454",
      })
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: error.response?.data?.message || "Something went wrong",
        icon: "error",
        confirmButtonColor: "var(--primary)",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white dark:bg-[#292d4a] rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden max-w-6xl mx-auto">
      <div className="py-6 px-8 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
        <h3 className="text-primary font-medium text-lg">Configurations</h3>
        <button
          onClick={() => navigate("/dashboard/configurations/add-config")}
          className="bg-primary text-white px-6 py-2 rounded-lg font-semibold hover:opacity-90 transition-all active:scale-95 text-sm"
        >
          Add Config
        </button>
      </div>

      <form onSubmit={handleSave} className="p-8 space-y-8">
        <div className="space-y-6">

          {/* Show On Front */}
          <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-4">
            <label className="text-content-text font-medium text-sm">
              Show On Front
            </label>
            <div className="md:col-span-2">
              <select
                name="showOnFront"
                value={formData.showOnFront}
                onChange={handleChange}
                className="w-full md:w-2/3 px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 outline-none transition-all dark:bg-transparent text-content-text"
              >
                <option value="blog">Blog</option>
                <option value="page">Page</option>
              </select>
            </div>
          </div>

          {/* Node Per Page */}
          <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-4">
            <label className="text-content-text font-medium text-sm">
              Node Per Page
            </label>
            <div className="md:col-span-2">
              <input
                type="number"
                name="nodePerPage"
                value={formData.nodePerPage}
                onChange={handleChange}
                className="w-full md:w-2/3 px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 outline-none transition-all dark:bg-transparent text-content-text"
              />
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-gray-100 dark:border-gray-700">
          <button
            type="submit"
            disabled={loading}
            className="px-10 py-3 bg-primary text-white font-bold rounded-xl shadow-lg hover:opacity-90 active:scale-95 transition-all disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Save'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default Reading