/* eslint-disable react-hooks/purity */
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { IoCloseCircle } from "react-icons/io5";
import Swal from "sweetalert2";
import axios from "axios";

const baseUrl =
  import.meta.env?.VITE_BACKEND_URL ||
  "https://cms-backend-ashen.vercel.app";

const FormRow = ({ label, children }) => (
  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-start py-4">
    <label className="text-gray-500 dark:text-gray-400 text-sm mt-2">
      {label}
    </label>
    <div className="md:col-span-3">{children}</div>
  </div>
);

const Site = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false)
  const [faviconFile, setFaviconFile] = useState(null)
  const [logoFile, setLogoFile] = useState(null)
  const [logoIconFile, setLogoIconFile] = useState(null)
  const [sliderFiles, setSliderFiles] = useState([])

  const [faviconPreview, setFaviconPreview] = useState(null)
  const [logoPreview, setLogoPreview] = useState(null)
  const [logoIconPreview, setLogoIconPreview] = useState(null)
  const [sliderImages, setSliderImages] = useState([])

  const { register, handleSubmit, reset } = useForm()

  // ─── GET Site Config ──────────────────────────────
  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const { data } = await axios.get(`${baseUrl}/api/site-config`)
        const config = data.config

        // Form mein values set karo
        reset({
          title: config.title || '',
          supportEmail: config.supportEmail || '',
        })

        // Images set karo
        setFaviconPreview(config.favicon || null)
        setLogoPreview(config.logo || null)
        setLogoIconPreview(config.logoIcon || null)

        // Slider images
        if (config.homeSlider?.length > 0) {
          setSliderImages(
            config.homeSlider.map((url, index) => ({
              id: index,
              path: url,
              isExisting: true, // cloudinary se aa rahi hain
            }))
          )
        }
      } catch (error) {
        console.error('Error fetching config:', error)
      }
    }

    fetchConfig()
  }, [reset])

  // ─── Single File Change ───────────────────────────
  const handleFileChange = (e, setPreview, setFile) => {
    const file = e.target.files[0]
    if (file) {
      setPreview(URL.createObjectURL(file))
      setFile(file)
    }
  }

  // ─── Slider Change ────────────────────────────────
  const handleSliderChange = (e) => {
    const files = Array.from(e.target.files)
    const newImages = files.map((file) => ({
      id: Math.random(),
      path: URL.createObjectURL(file),
      file,
      isExisting: false,
    }))
    setSliderFiles((prev) => [...prev, ...files])
    setSliderImages((prev) => [...prev, ...newImages])
  }

  // ─── Remove Slider Image ──────────────────────────
  const removeImage = async (img) => {
    // Agar cloudinary ki image hai toh backend se delete karo
    if (img.isExisting) {
      try {
        await axios.delete(`${baseUrl}/api/site-config/slider`, {
          data: { imageUrl: img.path },
        })
      } catch (error) {
        console.error('Error deleting slider image:', error)
      }
    }
    setSliderImages((prev) => prev.filter((i) => i.id !== img.id))
  }

  // ─── Submit ───────────────────────────────────────
  const onSubmit = async (formData) => {
    try {
      setLoading(true)

      const data = new FormData()
      data.append('title', formData.title || '')
      data.append('supportEmail', formData.supportEmail || '')

      if (faviconFile) data.append('favicon', faviconFile)
      if (logoFile) data.append('logo', logoFile)
      if (logoIconFile) data.append('logoIcon', logoIconFile)

      // Nai slider images
      sliderFiles.forEach((file) => {
        data.append('homeSlider', file)
      })

      await axios.put(`${baseUrl}/api/site-config`, data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })

      Swal.fire({
        title: 'Success!',
        text: 'Site configurations updated successfully.',
        icon: 'success',
        confirmButtonColor: 'var(--primary)',
      })
    } catch (error) {
      Swal.fire({
        title: 'Error!',
        text: error.response?.data?.message || 'Something went wrong',
        icon: 'error',
        confirmButtonColor: 'var(--primary)',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white dark:bg-[#292d4a] rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden max-w-6xl mx-auto mb-10">
      <div className="py-6 px-8 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
        <h3 className="text-primary font-medium text-lg">Configurations</h3>
        <button
          type="button"
          onClick={() => navigate("/dashboard/configurations/add-config")}
          className="bg-primary text-white px-6 py-2 rounded-lg font-semibold hover:opacity-90 transition-all text-sm"
        >
          Add Config
        </button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="p-8">

        {/* Favicon */}
        <FormRow label="Favicon">
          <div className="space-y-2">
            {faviconPreview && (
              <img
                src={faviconPreview}
                alt="Favicon"
                className="w-16 h-16 object-contain mb-2 border rounded-lg p-1"
              />
            )}
            <p className="text-xs text-primary mb-2">
              Current File: {faviconPreview || 'No file chosen'}
            </p>
            <input
              type="file"
              onChange={(e) => handleFileChange(e, setFaviconPreview, setFaviconFile)}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-l-lg file:border-0 file:text-sm file:font-semibold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200 border border-gray-200 rounded-lg"
            />
          </div>
        </FormRow>

        {/* Logo */}
        <FormRow label="Logo">
          <div className="space-y-2">
            {logoPreview && (
              <img
                src={logoPreview}
                alt="Logo"
                className="w-32 object-contain mb-2 border rounded-lg p-2"
              />
            )}
            <p className="text-xs text-primary mb-2">
              Current File: {logoPreview || 'No file chosen'}
            </p>
            <input
              type="file"
              onChange={(e) => handleFileChange(e, setLogoPreview, setLogoFile)}
              className="block w-full border border-gray-200 rounded-lg text-sm file:mr-4 file:py-2 file:px-4 file:bg-gray-100 file:border-0"
            />
          </div>
        </FormRow>

        {/* Title */}
        <FormRow label="Title">
          <input
            {...register("title")}
            className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 dark:bg-transparent"
          />
        </FormRow>

        {/* Logo Icon */}
        <FormRow label="Logo Icon">
          <div className="space-y-2">
            {logoIconPreview && (
              <img
                src={logoIconPreview}
                alt="Logo Icon"
                className="w-16 h-16 object-contain mb-2 border rounded-lg p-1"
              />
            )}
            <p className="text-xs text-primary mb-2">
              Current File: {logoIconPreview || 'No file chosen'}
            </p>
            <input
              type="file"
              onChange={(e) => handleFileChange(e, setLogoIconPreview, setLogoIconFile)}
              className="block w-full border border-gray-200 rounded-lg text-sm file:mr-4 file:py-2 file:px-4 file:bg-gray-100 file:border-0"
            />
          </div>
        </FormRow>

        {/* Home Slider */}
        <FormRow label="Home Slider">
          <div className="space-y-4">
            <div className="flex flex-wrap gap-4">
              {sliderImages.map((img) => (
                <div
                  key={img.id}
                  className="relative w-24 h-16 rounded-lg overflow-hidden border border-gray-200 group"
                >
                  <img
                    src={img.path}
                    alt="Slider"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(img)}
                    className="absolute top-0 right-0 p-0.5 bg-white rounded-full text-red-500 shadow-md hover:scale-110 transition-transform"
                  >
                    <IoCloseCircle size={20} />
                  </button>
                </div>
              ))}
            </div>
            <div className="relative">
              <input
                type="file"
                multiple
                onChange={handleSliderChange}
                className="block w-full border border-gray-200 rounded-lg text-sm file:mr-4 file:py-2 file:px-4 file:bg-gray-100 file:border-0 cursor-pointer"
              />
              <p className="text-[10px] text-gray-400 mt-1">
                * You can select multiple files at once
              </p>
            </div>
          </div>
        </FormRow>

        {/* Support Email */}
        <FormRow label="Support Email">
          <input
            {...register("supportEmail")}
            className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 dark:bg-transparent"
          />
        </FormRow>

        <div className="pt-8 mt-6 border-t border-gray-100 dark:border-gray-700">
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

export default Site