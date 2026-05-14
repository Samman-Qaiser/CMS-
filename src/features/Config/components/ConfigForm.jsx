import { useState, useEffect } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom"; 
import { LuLayoutGrid } from "react-icons/lu";
import { MdOutlineSettings } from "react-icons/md";
import Swal from "sweetalert2"; 

const ConfigForm = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();  
  const [activeTab, setActiveTab] = useState("settings");

  const [formData, setFormData] = useState({
    name: "",
    value: "",
    title: "",
    inputType: "",
    description: "",
    params: "",
    editable: true,
  });

  useEffect(() => {
    if (location.state?.editData) {
      const { name, value, title, inputType, description, params, editable } =
        location.state.editData;
      setFormData({
        name: name || "",
        value: value || "",
        title: title || "",
        inputType: inputType || "",
        description: description || "",
        params: params || "",
        editable: editable !== undefined ? editable : true,
      });
    } else if (!id) {
      setFormData({
        name: "",
        value: "",
        title: "",
        inputType: "",
        description: "",
        params: "",
        editable: true,
      });
    }
  }, [location.state, id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Submitted:", formData);

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
      navigate("/dashboard/configurations");
    });
  };

  return (
    <>
      <div className="bg-white dark:bg-[#292d4a] rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="py-6 px-8 border-b border-gray-100 dark:border-gray-700">
          <h3 className="text-primary font-bold text-xl">
            {id ? "Edit Configuration" : "Add Configurations"}
          </h3>
        </div>

        <div className="p-8">
          <div className="flex border-b border-gray-100 dark:border-gray-700 mb-8">
            <button
              type="button"
              onClick={() => setActiveTab("settings")}
              className={`flex items-center gap-2 px-6 py-3 text-sm font-medium transition-all border-b-2 ${
                activeTab === "settings"
                  ? "border-primary text-primary bg-white dark:bg-transparent rounded-t-lg border-t border-x border-gray-100 dark:border-gray-700 -mb-[1px]"
                  : "border-transparent text-gray-500 hover:text-primary"
              }`}
            >
              <MdOutlineSettings
                className={activeTab === "settings" ? "text-primary" : ""}
              />
              Settings
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("misc")}
              className={`flex items-center gap-2 px-6 py-3 text-sm font-medium transition-all border-b-2 ${
                activeTab === "misc"
                  ? "border-primary text-primary bg-white dark:bg-transparent rounded-t-lg border-t border-x  dark:border-gray-700 -mb-[1px]"
                  : "border-transparent text-gray-500 hover:text-primary"
              }`}
            >
              <LuLayoutGrid
                className={activeTab === "misc" ? "text-primary" : ""}
              />
              Misc
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {activeTab === "settings" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fadeIn">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Site.favicon"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary/20 outline-none transition-all dark:bg-transparent text-gray-700 dark:text-white"
                  />
                  <p className="text-xs text-gray-400">e.g., 'Site.name'</p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Value
                  </label>
                  <input
                    type="text"
                    name="value"
                    value={formData.value}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary/20 outline-none transition-all dark:bg-transparent text-gray-700 dark:text-white"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-6 animate-fadeIn">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Title
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary/20 outline-none transition-all dark:bg-transparent text-gray-700 dark:text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Input type
                    </label>
                    <select
                      name="inputType"
                      value={formData.inputType}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary/20 outline-none transition-all dark:bg-transparent text-gray-700 dark:text-white"
                    >
                      <option value="">Select InputType</option>
                      <option value="text">Text</option>
                      <option value="textarea">Textarea</option>
                      <option value="file">File</option>
                      <option value="checkbox">Checkbox</option>
                      <option value="radio">Radio</option>
                      <option value="select">Select</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Description
                    </label>
                    <textarea
                      name="description"
                      rows="4"
                      value={formData.description}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary/20 outline-none transition-all dark:bg-transparent text-gray-700 dark:text-white resize-none"
                    ></textarea>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Params
                    </label>
                    <textarea
                      name="params"
                      rows="4"
                      value={formData.params}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary/20 outline-none transition-all dark:bg-transparent text-gray-700 dark:text-white resize-none"
                    ></textarea>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="editable"
                    id="editable"
                    checked={formData.editable}
                    onChange={handleChange}
                    className="w-4 h-4 accent-primary rounded cursor-pointer"
                  />
                  <label
                    htmlFor="editable"
                    className="text-sm font-bold text-gray-600 dark:text-gray-400 cursor-pointer"
                  >
                    Editable
                  </label>
                </div>
              </div>
            )}

            <div className="pt-4">
              <button
                type="submit"
                className="px-10 py-3 bg-primary text-white font-bold rounded-xl shadow-lg hover:opacity-90 active:scale-95 transition-all"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default ConfigForm;
