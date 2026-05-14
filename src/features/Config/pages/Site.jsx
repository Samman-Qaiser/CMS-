/* eslint-disable react-hooks/purity */
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { IoCloseCircle } from "react-icons/io5";
import Swal from "sweetalert2";

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

  const [faviconPreview, setFaviconPreview] = useState("/favicon.svg");
  const [logoPreview, setLogoPreview] = useState("/logo-full.png");
  const [logoIconPreview, setLogoIconPreview] = useState("/logo-half.png");

  const [sliderImages, setSliderImages] = useState([
    { id: Date.now() + 1, path: "/Theme1.jpg" },
    { id: Date.now() + 2, path: "/Theme2.jpg" },
    { id: Date.now() + 3, path: "/Theme3.jpg" },
    { id: Date.now() + 4, path: "/Theme4.jpg" },
  ]);

  const { register, handleSubmit } = useForm({
    defaultValues: {
      title: "W3CMS",
      email: "info@example.com",
      copyrightText: "Copyright © 2023",
      supportEmail: "gaurav.w3itexperts@gmail.com",
    },
  });

  // Handle single file changes (Favicon, Logo, etc.)
  const handleFileChange = (e, setPreview) => {
    const file = e.target.files[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  // Handle adding multiple files to the slider
  const handleSliderChange = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map((file) => ({
      id: Math.random(), // Unique ID for key/removal
      path: URL.createObjectURL(file),
    }));
    setSliderImages([...sliderImages, ...newImages]);
  };

  const removeImage = (id) => {
    setSliderImages(sliderImages.filter((img) => img.id !== id));
  };

  const onSubmit = (data) => {
    console.log("Submitted Data:", data);
    Swal.fire({
      title: "Success!",
      text: "Site configurations updated successfully.",
      icon: "success",
      confirmButtonColor: "var(--primary)",
    });
  };

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
            <img
              src={faviconPreview}
              alt="Favicon"
              className="w-16 h-16 object-contain mb-2 border rounded-lg p-1"
            />
            <p className="text-xs text-primary mb-2">
              Current File:{" "}
              {faviconPreview.includes("blob") ? "New Upload" : faviconPreview}
            </p>
            <input
              type="file"
              onChange={(e) => handleFileChange(e, setFaviconPreview)}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-l-lg file:border-0 file:text-sm file:font-semibold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200 border border-gray-200 rounded-lg"
            />
          </div>
        </FormRow>

        {/* Logo */}
        <FormRow label="Logo">
          <div className="space-y-2">
            <img
              src={logoPreview}
              alt="Logo"
              className="w-32 object-contain mb-2 border rounded-lg p-2"
            />
            <p className="text-xs text-primary mb-2">
              Current File:{" "}
              {logoPreview.includes("blob") ? "New Upload" : logoPreview}
            </p>
            <input
              type="file"
              onChange={(e) => handleFileChange(e, setLogoPreview)}
              className="block w-full border border-gray-200 rounded-lg text-sm file:mr-4 file:py-2 file:px-4 file:bg-gray-100 file:border-0"
            />
          </div>
        </FormRow>

        {/* Text Fields */}
        <FormRow label="Title">
          <input
            {...register("title")}
            className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 dark:bg-transparent"
          />
        </FormRow>

        {/* Logo Icon */}
        <FormRow label="Logo Icon">
          <div className="space-y-2">
            <img
              src={logoIconPreview}
              alt="Logo Icon"
              className="w-16 h-16 object-contain mb-2 border rounded-lg p-1"
            />
            <p className="text-xs text-primary mb-2">
              Current File:{" "}
              {logoIconPreview.includes("blob")
                ? "New Upload"
                : logoIconPreview}
            </p>
            <input
              type="file"
              onChange={(e) => handleFileChange(e, setLogoIconPreview)}
              className="block w-full border border-gray-200 rounded-lg text-sm file:mr-4 file:py-2 file:px-4 file:bg-gray-100 file:border-0"
            />
          </div>
        </FormRow>

        {/* Dynamic Multi-Slider */}
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
                    onClick={() => removeImage(img.id)}
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

        <FormRow label="Support Email">
          <input
            {...register("supportEmail")}
            className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 dark:bg-transparent"
          />
        </FormRow>

        <div className="pt-8 mt-6 border-t border-gray-100 dark:border-gray-700">
          <button
            type="submit"
            className="px-10 py-3 bg-primary text-white font-bold rounded-xl shadow-lg hover:opacity-90 active:scale-95 transition-all"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
};

export default Site;
