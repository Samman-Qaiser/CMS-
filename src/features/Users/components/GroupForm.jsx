import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  MdKeyboardDoubleArrowRight,
  MdKeyboardDoubleArrowLeft,
} from "react-icons/md";

const GroupForm = () => {
  const { name: groupName } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(groupName);

  const [name, setName] = useState("");
  const [available, setAvailable] = useState([
    "admin | log entry | Can add log entry",
    "admin | log entry | Can change log entry",
    "admin | log entry | Can delete log entry",
    "admin | log entry | Can view log entry",
    "auth | group | Can add group",
    "auth | group | Can change group",
    "auth | group | Can delete group",
    "auth | group | Can view group",
    "auth | permission | Can add permission",
    "auth | permission | Can change permission",
  ]);
  const [assigned, setAssigned] = useState([]);

  // Filter states
  const [availFilter, setAvailFilter] = useState("");
  const [assignFilter, setAssignFilter] = useState("");

  useEffect(() => {
    if (isEditMode) {
      setName(groupName);
    }
  }, [groupName, isEditMode]);

  const moveRight = (item) => {
    setAssigned([...assigned, item]);
    setAvailable(available.filter((i) => i !== item));
  };

  const moveLeft = (item) => {
    setAvailable([...available, item]);
    setAssigned(assigned.filter((i) => i !== item));
  };

  const handleSave = () => {
    const payload = { groupName: name, permissions: assigned };
    console.log(isEditMode ? "Updating..." : "Creating...", payload);
    navigate(-1);
  };

  return (
    <div className="bg-white dark:bg-[#292d4a] rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
      {/* Header - Dynamic Title */}
      <div className="p-6 border-b border-gray-50 dark:border-gray-800">
        <h2 className="text-xl font-bold text-primary">
          {isEditMode ? "Edit Group Permissions" : "Add New Group"}
        </h2>
      </div>

      <div className="p-8">
        {/* Group Name Input */}
        <div className="mb-8 max-w-full">
          <label className="block text-sm font-medium text-gray-500 mb-2">
            Name
          </label>
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 dark:bg-transparent rounded-lg outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
          {/* Left Column */}
          <div className="space-y-2">
            <label className="text-xs text-gray-500 font-medium">
              Showing all {available.length}
            </label>
            <input
              type="text"
              placeholder="Filter"
              value={availFilter}
              onChange={(e) => setAvailFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none focus:ring-1 focus:ring-primary/20 dark:bg-transparent"
            />
            <div className="text-center py-2">
              <button
                onClick={() => {
                  setAssigned([...assigned, ...available]);
                  setAvailable([]);
                }}
                className="text-gray-400 hover:text-primary transition-colors"
              >
                <MdKeyboardDoubleArrowRight size={32} />
              </button>
            </div>
            <div className="h-96 border border-gray-200 rounded-xl overflow-y-auto p-4 space-y-2 text-sm text-gray-600 dark:text-gray-300">
              {available
                .filter((i) =>
                  i.toLowerCase().includes(availFilter.toLowerCase()),
                )
                .map((item, index) => (
                  <p
                    key={index}
                    onClick={() => moveRight(item)}
                    className="hover:bg-gray-50 dark:hover:bg-white/5 p-2 cursor-pointer rounded transition-colors border-b border-gray-100 dark:border-gray-800"
                  >
                    {item}
                  </p>
                ))}
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-2">
            <label className="text-xs text-gray-500 font-medium">
              {assigned.length > 0
                ? `Assigned ${assigned.length}`
                : "Empty list"}
            </label>
            <input
              type="text"
              placeholder="Filter"
              value={assignFilter}
              onChange={(e) => setAssignFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none focus:ring-1 focus:ring-primary/20 dark:bg-transparent"
            />
            <div className="text-center py-2">
              <button
                onClick={() => {
                  setAvailable([...available, ...assigned]);
                  setAssigned([]);
                }}
                className="text-gray-400 hover:text-primary transition-colors"
              >
                <MdKeyboardDoubleArrowLeft size={32} />
              </button>
            </div>
            <div className="h-96 border border-gray-200 rounded-xl overflow-y-auto p-4 space-y-2 text-sm text-gray-600 dark:text-gray-300 bg-gray-50/10">
              {assigned
                .filter((i) =>
                  i.toLowerCase().includes(assignFilter.toLowerCase()),
                )
                .map((item, index) => (
                  <p
                    key={index}
                    onClick={() => moveLeft(item)}
                    className="hover:bg-red-50 dark:hover:bg-red-900/10 p-2 cursor-pointer rounded transition-colors border-b border-gray-100 dark:border-gray-800"
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
        </div>
 
        <div className="mt-8 pt-6 border-t border-gray-50 dark:border-gray-800 flex items-center gap-4">
          <button
            onClick={handleSave}
            className="px-8 py-2.5 bg-[#4CBC9A] text-white rounded-lg font-bold hover:bg-[#3a9b7e] transition-all shadow-sm"
          >
            Save
          </button>

          <button
            onClick={() => navigate(-1)}
            className="px-8 py-2.5 bg-primary text-white rounded-lg font-bold hover:opacity-90 transition-all shadow-sm"
          >
            Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default GroupForm;
