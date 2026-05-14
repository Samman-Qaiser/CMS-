import {
  LuInbox,
  LuSend,
  LuStar,
  LuFile,
  LuTrash2,
  LuChevronDown,
  LuArchive,
  LuFolder,
  LuTag,
} from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import EmailHeader from "../components/EmailHeader";
import { AlertCircle } from "lucide-react";

export const EmailLayout = ({ children, activeDropdown, toggleDropdown }) => {
  const navigate = useNavigate();

  const navItems = [
    {
      icon: <LuInbox size={18} />,
      label: "Inbox",
      count: 198,
      path: "/dashboard/email-inbox",
    },
    {
      icon: <LuSend size={18} />,
      label: "Sent",
      path: "/dashboard/email-inbox",
    },
    {
      icon: <LuStar size={18} />,
      label: "Important",
      count: 7,
      path: "/dashboard/email-inbox",
    },
    {
      icon: <LuFile size={18} />,
      label: "Draft",
      path: "/dashboard/email-inbox",
    },
    {
      icon: <LuTrash2 size={18} />,
      label: "Trash",
      path: "/dashboard/email-inbox",
    },
  ];

  return (
    <div className="animate-fadeIn pb-10">
      <EmailHeader />
      <div className="grid grid-cols-12 gap-6 items-start">
        {/* Persistent Sidebar */}
        <div className="col-span-12 lg:col-span-3 space-y-6">
          <button
            onClick={() => navigate("/dashboard/email-compose")}
            className="w-full py-3 bg-primary text-white font-bold rounded-lg shadow-md hover:opacity-90 transition-all"
          >
            Compose
          </button>

          <div className="bg-white dark:bg-[#292d4a] rounded-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
            <nav className="flex flex-col">
              {navItems.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => navigate(item.path)}
                  className="flex items-center justify-between px-5 py-3 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    {item.icon}
                    <span className="text-sm font-medium">{item.label}</span>
                  </div>
                  {item.count && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-red-100 text-red-500">
                      {item.count}
                    </span>
                  )}
                </button>
              ))}
            </nav>
          </div>

          <div className="bg-white dark:bg-[#292d4a] rounded-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
            <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
              <span className="text-sm font-bold text-gray-700 dark:text-gray-200">
                Categories
              </span>
              <LuChevronDown className="text-primary" />
            </div>
            <div className="p-2 space-y-1">
              {["Work", "Private", "Support", "Social"].map((cat) => (
                <button
                  key={cat}
                  onClick={() => navigate("/dashboard/email-inbox")}
                  className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg"
                >
                  <span className="w-3 h-3 rounded-full bg-gray-300 dark:bg-gray-600"></span>
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Main Content Area */}
        <div className="col-span-12 lg:col-span-9 bg-white dark:bg-[#292d4a] rounded-xl border border-gray-100 dark:border-gray-700 p-6 shadow-sm">
          {/* Shared Toolbar */}
          <div className="flex flex-wrap gap-2 mb-8">
            <button className="p-2.5 rounded-lg bg-primary/3 text-primary hover:bg-primary/10">
              <LuArchive size={20} />
            </button>
            <button className="p-2.5 rounded-lg bg-primary/3 text-primary hover:bg-primary/10">
              <AlertCircle size={20} />
            </button>
            <button className="p-2.5 rounded-lg bg-primary/3 text-primary hover:bg-primary/10">
              <LuTrash2 size={20} />
            </button>

            {/* Folder Dropdown */}
            <div className="relative">
              <button
                onClick={() => toggleDropdown("folder")}
                className={`flex items-center gap-1 p-2.5 rounded-lg transition-colors ${activeDropdown === "folder" ? "bg-primary text-white" : "bg-primary/3 text-primary hover:bg-primary/10"}`}
              >
                <LuFolder size={20} /> <LuChevronDown size={14} />
              </button>
              {activeDropdown === "folder" && (
                <div className="absolute left-0 mt-2 w-48 bg-white dark:bg-[#292d4a] shadow-xl border border-gray-100 dark:border-gray-700 rounded-lg py-2 z-50 animate-fadeIn">
                  {["Social", "Promotions", "Updates", "Forums"].map((item) => (
                    <button
                      key={item}
                      className="w-full text-left px-4 py-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                    >
                      {item}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Tag Dropdown  */}
            <div className="relative">
              <button
                onClick={() => toggleDropdown("tag")}
                className={`flex items-center gap-1 p-2.5 rounded-lg transition-colors ${activeDropdown === "tag" ? "bg-primary text-white" : "bg-primary/3 text-primary hover:bg-primary/10"}`}
              >
                <LuTag size={20} /> <LuChevronDown size={14} />
              </button>
              {activeDropdown === "tag" && (
                <div className="absolute left-0 mt-2 w-48 bg-white dark:bg-[#292d4a] shadow-xl border border-gray-100 dark:border-gray-700 rounded-lg py-2 z-50 animate-fadeIn">
                  {["Important", "Personal", "Work", "Bills"].map((item) => (
                    <button
                      key={item}
                      className="w-full text-left px-4 py-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                    >
                      {item}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* More Dropdown */}
            <div className="relative">
              <button
                onClick={() => toggleDropdown("more")}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-colors ${activeDropdown === "more" ? "bg-primary text-white" : "bg-primary/3 text-primary hover:bg-primary/10"}`}
              >
                More <LuChevronDown size={14} />
              </button>
              {activeDropdown === "more" && (
                <div className="absolute left-0 mt-2 w-56 bg-white dark:bg-[#292d4a] shadow-xl border border-gray-100 dark:border-gray-700 rounded-lg py-2 z-50 animate-fadeIn">
                  {[
                    "Mark as Unread",
                    "Add to Tasks",
                    "Add Star",
                    "Mute",
                    "Print",
                  ].map((item) => (
                    <button
                      key={item}
                      className="w-full text-left px-4 py-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                    >
                      {item}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {children}
        </div>
      </div>
    </div>
  );
};
