import { useState, useEffect } from "react";
import { BiEditAlt } from "react-icons/bi";
import { BsTrash } from "react-icons/bs";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";

const baseUrl =
  import.meta.env?.VITE_BACKEND_URL ||
  "https://cms-backend-ashen.vercel.app";

const Configurations = () => {
  const [configurations, setConfigurations] = useState([])
  const [loading, setLoading] = useState(true)

  // ─── GET All Configurations ───────────────────────
  const fetchConfigurations = async () => {
    try {
      setLoading(true)
      const { data } = await axios.get(`${baseUrl}/api/configurations`)
      setConfigurations(data.configurations)
    } catch (error) {
      console.error('Error fetching configurations:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchConfigurations()
  }, [])

  // ─── DELETE ───────────────────────────────────────
  const handleDelete = (item) => {
    Swal.fire({
      title: "Are you sure?",
      text: `You are about to delete "${item.name}". This action cannot be undone!`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "var(--primary)",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
      background: document.documentElement.classList.contains("dark")
        ? "#292d4a" : "#fff",
      color: document.documentElement.classList.contains("dark")
        ? "#fff" : "#545454",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`${baseUrl}/api/configurations/${item._id}`)
          setConfigurations((prev) => prev.filter((c) => c._id !== item._id))
          Swal.fire({
            title: "Deleted!",
            text: "Configuration has been deleted.",
            icon: "success",
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
        }
      }
    })
  }

  // ─── RESET All Configurations ─────────────────────
  const handleReset = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "This will delete ALL configurations. This cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, reset all!",
      background: document.documentElement.classList.contains("dark")
        ? "#292d4a" : "#fff",
      color: document.documentElement.classList.contains("dark")
        ? "#fff" : "#545454",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          // Sab delete karo ek ek
          for (const config of configurations) {
            await axios.delete(`${baseUrl}/api/configurations/${config._id}`)
          }
          setConfigurations([])
          Swal.fire({
            title: "Reset!",
            text: "All configurations have been deleted.",
            icon: "success",
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
          })
        }
      }
    })
  }

  return (
    <div className="bg-white dark:bg-[#292d4a] rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
      {/* Header */}
      <div className="py-6 px-8 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
        <h3 className="text-primary font-medium text-xl">Configurations</h3>
        <div className="flex gap-3">
          <button
            onClick={handleReset}
            className="px-4 py-2 border border-primary text-primary font-semibold rounded-lg hover:bg-primary hover:text-white transition-all active:scale-95"
          >
            Reset Config
          </button>
          <Link
            to="/dashboard/configurations/add-config"
            className="px-4 py-2 bg-primary text-white font-semibold rounded-lg hover:opacity-90 transition-all active:scale-95 shadow-md shadow-primary/20"
          >
            Add Config
          </Link>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto px-8">
        {loading ? (
          <div className="py-20 text-center text-gray-400">Loading...</div>
        ) : configurations.length === 0 ? (
          <div className="py-20 text-center text-gray-400">
            No configurations found
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-gray-400 uppercase text-sm tracking-wider">
                <th className="px-5 py-3 font-bold">Name</th>
                <th className="px-5 py-3 font-bold">Value</th>
                <th className="px-5 py-3 font-bold">Category</th>
                <th className="px-5 py-3 font-bold text-right md:text-center">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700 text-xs">
              {configurations.map((item) => (
                <tr
                  key={item._id}
                  className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group"
                >
                  <td className="px-5 py-3 text-content-text font-medium">
                    {item.name}
                  </td>
                  <td className="px-5 py-3 text-content-text">
                    {item.value}
                  </td>
                  <td className="px-5 py-3">
                    <span className="px-2 py-1 bg-primary/10 text-primary rounded-lg text-xs font-medium capitalize">
                      {item.category}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center justify-end md:justify-center gap-2">
                      <Link
                        to={`/dashboard/configurations/edit-config/${item._id}`}
                        state={{ editData: item }}
                        className="p-2 bg-primary/10 text-primary cursor-pointer rounded-lg shadow-sm hover:bg-primary/20 transition-all"
                      >
                        <BiEditAlt size={16} />
                      </Link>
                      <button
                        onClick={() => handleDelete(item)}
                        className="p-2 bg-red-100 text-red-600 cursor-pointer rounded-lg hover:bg-red-200 transition-all"
                      >
                        <BsTrash size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

export default Configurations