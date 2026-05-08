import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  MdKeyboardDoubleArrowRight,
  MdKeyboardDoubleArrowLeft,
} from "react-icons/md";

const AssignPermissionsToUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // State to manage list items
  const [available, setAvailable] = useState([
    "admin | log entry | Can add log entry",
    "admin | log entry | Can change log entry",
    "admin | log entry | Can delete log entry",
    "admin | log entry | Can view log entry",
    "auth | group | Can add group",
  ]);
  const [assigned, setAssigned] = useState([]);

  // Function to move item from Left to Right
  const moveRight = (item) => {
    setAssigned([...assigned, item]);
    setAvailable(available.filter((i) => i !== item));
  };

  // Function to move item from Right to Left
  const moveLeft = (item) => {
    setAvailable([...available, item]);
    setAssigned(assigned.filter((i) => i !== item));
  };

  const handleSave = () => {
    console.log("Saved permissions for user ID:", id, "Permissions:", assigned);
    navigate(-1);
  };

  return (
    <div className="bg-white dark:bg-[#292d4a] rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-gray-50 dark:border-gray-800">
        <h2 className="text-xl font-bold text-primary">
          Manage User Permissions
        </h2>
      </div>

      <div className="p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
          {/* ROW 1: Filters */}
          <div className="space-y-2">
            <label className="text-xs text-gray-500 font-medium">
              Showing all {available.length}
            </label>
            <input
              type="text"
              placeholder="Filter"
              className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none focus:ring-1 focus:ring-primary/20"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs text-gray-500 font-medium">
              {assigned.length > 0
                ? `Assigned ${assigned.length}`
                : "Empty list"}
            </label>
            <input
              type="text"
              placeholder="Filter"
              className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none focus:ring-1 focus:ring-primary/20"
            />
          </div>

          {/* ROW 2: Transfer Buttons  */}
          <div className="col-span-1 md:col-span-2 flex justify-center gap-12 py-2">
            <button
              onClick={() => {
                if (available.length > 0) {
                  setAssigned([...assigned, ...available]);
                  setAvailable([]);
                }
              }}
              className="text-content-text hover:text-primary hover:scale-125 transition-transform"
            >
              <MdKeyboardDoubleArrowRight size={32} />
            </button>
            <button
              onClick={() => {
                if (assigned.length > 0) {
                  setAvailable([...available, ...assigned]);
                  setAssigned([]);
                }
              }}
              className="text-content-text hover:text-primary hover:scale-125 transition-transform"
            >
              <MdKeyboardDoubleArrowLeft size={32} />
            </button>
          </div>

          {/* ROW 3: Big Boxes */}
          <div className="h-96 border border-gray-200 rounded-xl overflow-y-auto p-4 space-y-2 text-sm text-gray-600 dark:text-gray-300">
            {available.map((item, index) => (
              <p
                key={index}
                onClick={() => moveRight(item)}
                className="hover:bg-gray-50 p-2 cursor-pointer rounded transition-colors border-b border-transparent hover:border-gray-100"
              >
                {item}
              </p>
            ))}
          </div>

          <div className="h-96 border border-gray-200 rounded-xl overflow-y-auto p-4 space-y-2 text-sm text-gray-600 dark:text-gray-300 bg-gray-50/10">
            {assigned.map((item, index) => (
              <p
                key={index}
                onClick={() => moveLeft(item)}
                className="hover:bg-red-50 p-2 cursor-pointer rounded transition-colors border-b border-transparent hover:border-red-100"
              >
                {item}
              </p>
            ))}
            {assigned.length === 0 && (
              <div className="h-full flex items-center justify-center text-gray-400 italic">
                No permissions assigned
              </div>
            )}
          </div>
        </div>

        {/* Footer Action Button */}
        <div className="mt-8 pt-6 border-t border-gray-50">
          <button
            onClick={handleSave}
            className="px-8 py-2.5 bg-[#4CBC9A] text-white rounded-lg font-bold hover:bg-[#3a9b7e] transition-all shadow-sm"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssignPermissionsToUser;
