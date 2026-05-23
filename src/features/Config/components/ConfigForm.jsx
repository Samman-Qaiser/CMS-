import { useState, useEffect } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { LuLayoutGrid } from "react-icons/lu";
import { MdOutlineSettings } from "react-icons/md";
import Swal from "sweetalert2";
import axios from "axios";

const baseUrl =
  import.meta.env?.VITE_BACKEND_URL ||
  "https://cms-backend-ashen.vercel.app";

const ConfigForm = () => {
  const { id } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState("settings")
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
     watch,        // ✅ add
  setValue,     // ✅ add
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      value: "",
      title: "",
      inputType: "",
      description: "",
      
      params: "",
      isEditable: true,
      category: "misc",
    },
  })

  // ─── Load existing data if editing ───────────────
  useEffect(() => {
    if (id) {
      // Edit mode — backend se data lao
      const fetchConfig = async () => {
        try {
          const { data } = await axios.get(`${baseUrl}/api/configurations/${id}`)
          const config = data.configuration
          reset({
            name: config.name || "",
            value: config.value || "",
            title: config.title || "",
            inputType: config.inputType || "",
            description: config.description || "",
            params: config.params || "",
            isEditable: config.isEditable !== undefined ? config.isEditable : true,
            category: config.category || "misc",
          })
        } catch (error) {
          console.error('Error fetching configuration:', error)
        }
      }
      fetchConfig()
    } else if (location.state?.editData) {
      reset(location.state.editData)
    } else {
      reset({
        name: "",
        value: "",
        title: "",
        inputType: "",
        description: "",
        params: "",
        isEditable: true,
        category: "misc",
      })
    }
  }, [id, location.state, reset])

  // ─── Submit ───────────────────────────────────────
  const onSubmit = async (formData) => {
    try {
      setLoading(true)

      const payload = {
        name: formData.name,
        value: formData.value,
        title: formData.title,
        inputType: formData.inputType,
        description: formData.description,
        params: formData.params,
        isEditable: formData.isEditable,
        category: formData.category || "misc",
      }

      if (id) {
        // ─── Update ───────────────────────────────
        await axios.put(`${baseUrl}/api/configurations/${id}`, payload)
      } else {
        // ─── Create ───────────────────────────────
        await axios.post(`${baseUrl}/api/configurations`, payload)
      }

      Swal.fire({
        title: "Success!",
        text: id
          ? "Configuration updated successfully."
          : "New configuration added.",
        icon: "success",
        confirmButtonColor: "var(--primary)",
        background: document.documentElement.classList.contains("dark")
          ? "#292d4a"
          : "#fff",
        color: document.documentElement.classList.contains("dark")
          ? "#fff"
          : "#545454",
      }).then(() => {
        navigate("/dashboard/configurations")
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

  // ─── Validation Error ─────────────────────────────
  const onError = (formErrors) => {
    if (activeTab === "settings" && (formErrors.title || formErrors.inputType)) {
      setActiveTab("misc")
    } else if (activeTab === "misc" && (formErrors.name || formErrors.value)) {
      setActiveTab("settings")
    }
  }

  return (
    <div className="bg-white dark:bg-[#292d4a] rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
      <div className="py-6 px-8 border-b border-gray-100 dark:border-gray-700">
        <h3 className="text-primary font-bold text-xl">
          {id ? "Edit Configuration" : "Add Configurations"}
        </h3>
      </div>

      <div className="p-8">
        {/* Tab Navigation */}
        <div className="flex border-b border-gray-100 dark:border-gray-700 mb-8">
          <button
            type="button"
            onClick={() => setActiveTab("settings")}
            className={`relative flex items-center gap-2 px-6 py-3 text-sm font-medium transition-all border-b-2 ${
              activeTab === "settings"
                ? "border-primary text-primary bg-white dark:bg-transparent rounded-t-lg border-t border-x border-gray-100 dark:border-gray-700 -mb-[1px]"
                : "border-transparent text-gray-500 hover:text-primary"
            }`}
          >
            <MdOutlineSettings className={activeTab === "settings" ? "text-primary" : ""} />
            Settings
            {(errors.name || errors.value) && (
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("misc")}
            className={`relative flex items-center gap-2 px-6 py-3 text-sm font-medium transition-all border-b-2 ${
              activeTab === "misc"
                ? "border-primary text-primary bg-white dark:bg-transparent rounded-t-lg border-t border-x dark:border-gray-700 -mb-[1px]"
                : "border-transparent text-gray-500 hover:text-primary"
            }`}
          >
            <LuLayoutGrid className={activeTab === "misc" ? "text-primary" : ""} />
            Misc
            {(errors.title || errors.inputType) && (
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
            )}
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit, onError)} className="space-y-6">
          {activeTab === "settings" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fadeIn">
              <div className="space-y-2">
                <label className="text-sm font-medium text-content-text">Name</label>
                <input
                  {...register("name", { required: "Name is required" })}
                  type="text"
                  placeholder="Site.favicon"
                  className={`w-full px-4 py-3 rounded-xl border ${
                    errors.name ? "border-red-500" : "border-gray-200 dark:border-gray-700"
                  } outline-none transition-all dark:bg-transparent dark:text-white`}
                />
                {errors.name && (
                  <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
                )}
                <p className="text-xs text-content-text">e.g., 'Site.name'</p>
              </div>

           {/* Value field — inputType k mutabiq */}
<div className="space-y-2">
  <label className="text-sm font-medium text-content-text">Value</label>

  {watch('inputType') === 'file' || watch('inputType') === 'image' ? (
    <div className="space-y-2">
      {/* Existing image preview */}
      {watch('value') && (
        <img
          src={watch('value')}
          alt="preview"
          className="w-24 h-24 object-contain border rounded-lg p-1"
        />
      )}
      <input
        type="file"
        onChange={async (e) => {
          const file = e.target.files[0]
          if (!file) return
          const formData = new FormData()
          formData.append('featuredImage', file)
          // Cloudinary pe upload — pages route use karo temporarily
          const { data } = await axios.post(
            `${baseUrl}/api/pages`,
            formData
          )
          setValue('value', data.page?.featuredImage || '')
        }}
        className="block w-full border border-gray-200 rounded-lg text-sm file:mr-4 file:py-2 file:px-4 file:bg-gray-100 file:border-0"
      />
    </div>
  ) : watch('inputType') === 'textarea' ? (
    <textarea
      {...register("value", { required: "Value is required" })}
      rows="4"
      className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 outline-none dark:bg-transparent dark:text-white resize-none"
    />
  ) : watch('inputType') === 'checkbox' || watch('inputType') === 'boolean' ? (
    <input
      {...register("value")}
      type="checkbox"
      className="w-5 h-5 accent-primary"
    />
  ) : watch('inputType') === 'number' ? (
    <input
      {...register("value", { required: "Value is required" })}
      type="number"
      className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 outline-none dark:bg-transparent dark:text-white"
    />
  ) : watch('inputType') === 'email' ? (
    <input
      {...register("value", { required: "Value is required" })}
      type="email"
      className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 outline-none dark:bg-transparent dark:text-white"
    />
  ) : (
    // Default text
    <input
      {...register("value", { required: "Value is required" })}
      type="text"
      className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 outline-none dark:bg-transparent dark:text-white"
    />
  )}

  {errors.value && (
    <p className="text-red-500 text-xs mt-1">{errors.value.message}</p>
  )}
</div>

              {/* Category */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-content-text">Category</label>
                <select
                  {...register("category")}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 outline-none transition-all dark:bg-[#292D4A] dark:text-white"
                >
                  <option value="site">Site</option>
                  <option value="reading">Reading</option>
                  <option value="social">Social</option>
                  <option value="widget">Widget</option>
                  <option value="theme">Theme</option>
                  <option value="misc">Misc</option>
                </select>
              </div>
            </div>
          ) : (
            <div className="space-y-6 animate-fadeIn">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-content-text">Title</label>
                  <input
                    {...register("title", { required: "Title is required" })}
                    type="text"
                    className={`w-full px-4 py-3 rounded-xl border ${
                      errors.title ? "border-red-500" : "border-gray-200 dark:border-gray-700"
                    } outline-none transition-all dark:bg-transparent dark:text-white`}
                  />
                  {errors.title && (
                    <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-content-text">Input type</label>
                  <select
                    {...register("inputType", { required: "Input type is required" })}
                    className={`w-full px-4 py-3 rounded-xl border ${
                      errors.inputType ? "border-red-500" : "border-gray-200 dark:border-gray-700"
                    } outline-none transition-all dark:bg-[#292D4A] dark:text-white`}
                  >
                    <option value="">Select InputType</option>
                    <option value="text">Text</option>
                    <option value="textarea">Textarea</option>
                    <option value="file">File</option>
                    <option value="checkbox">Checkbox</option>
                    <option value="radio">Radio</option>
                    <option value="select">Select</option>
                  </select>
                  {errors.inputType && (
                    <p className="text-red-500 text-xs mt-1">{errors.inputType.message}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-content-text">Description</label>
                  <textarea
                    {...register("description")}
                    rows="4"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 outline-none transition-all dark:bg-transparent dark:text-white resize-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-content-text">Params</label>
                  <textarea
                    {...register("params")}
                    rows="4"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 outline-none transition-all dark:bg-transparent dark:text-white resize-none"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  {...register("isEditable")}
                  type="checkbox"
                  id="isEditable"
                  className="w-4 h-4 accent-primary rounded cursor-pointer"
                />
                <label
                  htmlFor="isEditable"
                  className="text-sm font-bold text-content-text cursor-pointer"
                >
                  Editable
                </label>
              </div>
            </div>
          )}

          <div className="pt-4">
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
    </div>
  )
}

export default ConfigForm