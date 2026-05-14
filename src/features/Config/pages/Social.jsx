import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const Social = () => {
  const navigate = useNavigate();
 
  const [socialLinks, setSocialLinks] = useState({
    linkedinUrl: "http://www.linkedin.com",
    facebook: "http://www.facebook.com",
    twitterUrl: "https://twitter.com/login",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSocialLinks((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = (e) => {
    e.preventDefault();

    Swal.fire({
      title: "Settings Saved!",
      text: "Your social media configurations have been updated successfully.",
      icon: "success",
      confirmButtonColor: "var(--primary)",
      background: document.documentElement.classList.contains("dark")
        ? "#292d4a"
        : "#fff",
      color: document.documentElement.classList.contains("dark")
        ? "#fff"
        : "#545454",
    });
  };

  return (
    <div className="bg-white dark:bg-[#292d4a] rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden max-w-6xl mx-auto animate-fadeIn">
      {/* Header Section */}
      <div className="py-6 px-8 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
        <h3 className="text-primary font-medium text-lg">Configurations</h3>
        <button
          onClick={() => navigate("/dashboard/configurations/add-config")}
          className="bg-primary text-white px-6 py-2 rounded-lg font-semibold hover:opacity-90 transition-all active:scale-95 text-sm"
        >
          Add Config
        </button>
      </div>

      {/* Form Section */}
      <form onSubmit={handleSave} className="p-8 space-y-8">
        <div className="space-y-6">
          {/* Linkedin Row */}
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
                className="w-full md:w-2/3 px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary/20 outline-none transition-all dark:bg-transparent text-content-text"
              />
            </div>
          </div>

          {/* Facebook Row */}
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
                className="w-full md:w-2/3 px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary/20 outline-none transition-all dark:bg-transparent text-content-text"
              />
            </div>
          </div>

          {/* Twitter Row */}
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
                placeholder="https://twitter.com/login"
                className="w-full md:w-2/3 px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary/20 outline-none transition-all dark:bg-transparent text-content-text"
              />
            </div>
          </div>
        </div>

        {/* Action Footer */}
        <div className="pt-6 border-t border-gray-100 dark:border-gray-700">
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

export default Social;
