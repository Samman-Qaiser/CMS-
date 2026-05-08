import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { allPermissions } from "./permissionsData";

const EditPermissionForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
 
  const [formData, setFormData] = useState({
    name: "",
    codeName: "",
    contentType: "",
  });

  useEffect(() => { 
    const permissionToEdit = allPermissions.find(
      (item) => item.id === parseInt(id),
    );

    if (permissionToEdit) {
      setFormData({
        name: permissionToEdit.name,
        codeName: permissionToEdit.code,
        contentType: permissionToEdit.type,
      });
    }
  }, [id]);

  const handleSave = () => { 
    console.log("Saving updated data:", formData);
    navigate(-1);
  };

  return (
    <div className="bg-white dark:bg-[#292d4a] rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
      <div className="p-6 border-b border-gray-50 dark:border-gray-800">
        <h2 className="text-xl font-bold text-primary">Edit Permissions</h2>
      </div>

      <div className="p-8 space-y-6">
        {/* Name Input */}
        <div>
          <label className="block text-sm font-medium text-gray-500 mb-2">
            Name
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 dark:bg-transparent rounded-xl outline-none focus:ring-2 focus:ring-[#20a1cf]/20 transition-all"
          />
        </div>

        {/* Code Name Input */}
        <div>
          <label className="block text-sm font-medium text-gray-500 mb-2">
            Code Name
          </label>
          <input
            type="text"
            value={formData.codeName}
            onChange={(e) =>
              setFormData({ ...formData, codeName: e.target.value })
            }
            className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 dark:bg-transparent rounded-xl outline-none focus:ring-2 focus:ring-[#20a1cf]/20 transition-all"
          />
        </div>

        {/* Content Type Select */}
        <div>
          <label className="block text-sm font-medium text-gray-500 mb-2">
            Content Type
          </label>
          <select
            value={formData.contentType}
            onChange={(e) =>
              setFormData({ ...formData, contentType: e.target.value })
            }
            className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 dark:bg-transparent rounded-xl outline-none appearance-none bg-no-repeat bg-[right_1rem_center] transition-all"
          >
            <option value="admin | log entry">admin | log entry</option>
            <option value="auth | group">auth | group</option>
            <option value="auth | permission">auth | permission</option>
            <option value="contenttypes | content type">
              contenttypes | content type
            </option>
            <option value="sessions | sessions">sessions | sessions</option>
            <option value="dashboard | configuration">
              dashboard | configuration
            </option>
          </select>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 pt-6 border-t border-gray-50 dark:border-gray-800">
          <button
            onClick={handleSave}
            className="px-8 py-3 bg-[#4CBC9A] text-white rounded-xl font-bold hover:bg-[#3a9b7e] transition-all shadow-md"
          >
            Save
          </button>
          <button
            onClick={() => navigate(-1)}
            className="px-8 py-3 bg-primary text-white rounded-xl font-bold hover:opacity-90 transition-all shadow-md"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditPermissionForm;
