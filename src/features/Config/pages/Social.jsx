import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";

const baseUrl =
  import.meta.env?.VITE_BACKEND_URL ||
  "https://cms-backend-ashen.vercel.app";

const Social = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [ids, setIds] = useState({
    linkedin: null,
    facebook: null,
    twitter: null,
  })
  const [socialLinks, setSocialLinks] = useState({
    linkedinUrl: "",
    facebook: "",
    twitterUrl: "",
  })

  // ─── GET Social Configurations ───────────────────
  useEffect(() => {
    const fetchSocialConfig = async () => {
      try {
        const { data } = await axios.get(
          `${baseUrl}/api/configurations?category=social`
        )

        data.configurations.forEach((config) => {
          if (config.name === "Social.linkedin") {
            setIds((prev) => ({ ...prev, linkedin: config._id }))
            setSocialLinks((prev) => ({ ...prev, linkedinUrl: config.value }))
          }
          if (config.name === "Social.facebook") {
            setIds((prev) => ({ ...prev, facebook: config._id }))
            setSocialLinks((prev) => ({ ...prev, facebook: config.value }))
          }
          if (config.name === "Social.twitter") {
            setIds((prev) => ({ ...prev, twitter: config._id }))
            setSocialLinks((prev) => ({ ...prev, twitterUrl: config.value }))
          }
        })
      } catch (error) {
        console.error('Error fetching social config:', error)
      }
    }

    fetchSocialConfig()
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setSocialLinks((prev) => ({ ...prev, [name]: value }))
  }

  // ─── Save ─────────────────────────────────────────
  const handleSave = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)

      if (ids.linkedin) {
        await axios.put(`${baseUrl}/api/configurations/${ids.linkedin}`, {
          value: socialLinks.linkedinUrl,
        })
      }

      if (ids.facebook) {
        await axios.put(`${baseUrl}/api/configurations/${ids.facebook}`, {
          value: socialLinks.facebook,
        })
      }

      if (ids.twitter) {
        await axios.put(`${baseUrl}/api/configurations/${ids.twitter}`, {
          value: socialLinks.twitterUrl,
        })
      }

      Swal.fire({
        title: "Settings Saved!",
        text: "Social media configurations updated successfully.",
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
    <div className="bg-white dark:bg-[#292d4a] rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden max-w-6xl mx-auto animate-fadeIn">
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

          {/* Linkedin */}
          <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-4">
            <label className="text-content-text text-sm font-medium">
              Linkedin Url
            </label>
            <div className="md:col-span-2">
              <input
                type="url"
                name="linkedinUrl"
                value={socialLinks.linkedinUrl}
                onChange={handleChange}
                placeholder="http://www.linkedin.com"
                className="w-full md:w-2/3 px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 outline-none transition-all dark:bg-transparent text-content-text"
              />
            </div>
          </div>

          {/* Facebook */}
          <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-4">
            <label className="text-content-text text-sm font-medium">
              Facebook
            </label>
            <div className="md:col-span-2">
              <input
                type="url"
                name="facebook"
                value={socialLinks.facebook}
                onChange={handleChange}
                placeholder="http://www.facebook.com"
                className="w-full md:w-2/3 px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 outline-none transition-all dark:bg-transparent text-content-text"
              />
            </div>
          </div>

          {/* Twitter */}
          <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-4">
            <label className="text-content-text text-sm font-medium">
              Twitter Url
            </label>
            <div className="md:col-span-2">
              <input
                type="url"
                name="twitterUrl"
                value={socialLinks.twitterUrl}
                onChange={handleChange}
                placeholder="https://twitter.com"
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

export default Social