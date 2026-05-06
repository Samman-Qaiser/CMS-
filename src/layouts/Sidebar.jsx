import { useState } from "react"; // Added useState
import {
  IoGridOutline,
  IoLayersOutline,
  IoPeopleOutline,
  IoDocumentTextOutline,
  IoChatbubbleEllipsesOutline,
  IoSettingsOutline,
} from "react-icons/io5";
import logo1 from "/public/images/logo.png";
import logo2 from "/public/images/logo1.png";

const Sidebar = () => {
  const [activeItem, setActiveItem] = useState("Dashboard");

  const menuItems = [
    { icon: <IoGridOutline />, label: "Dashboard" },
    { icon: <IoLayersOutline />, label: "CMS" },
    { icon: <IoPeopleOutline />, label: "User" },
    { icon: <IoDocumentTextOutline />, label: "Courses" },
    { icon: <IoChatbubbleEllipsesOutline />, label: "Messages" },
    { icon: <IoSettingsOutline />, label: "Config" },
  ];

  return (
    <aside className="bg-sidebar text-content-text w-64 h-screen fixed left-0 top-0 border-r border-slate-200/50 flex flex-col transition-colors duration-300 z-40">
      <div className="p-6 flex items-center gap-3">
        <a href="#">
          <img src={logo1} alt="Logo" />
        </a>
        <a href="#">
          <img src={logo2} alt="Logo" />
        </a>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-2">
        {menuItems.map((item) => {
          const isActive = activeItem === item.label;

          return (
            <div
              key={item.label}
              onClick={() => setActiveItem(item.label)}
              className={`
                flex items-center gap-4 px-4 py-3 rounded-xl cursor-pointer transition-all duration-200 group
                ${
                  isActive
                    ? "bg-primary text-white font-bold shadow-sm"
                    : "text-content-text hover:bg-primary/10"
                }
              `}
            >
              <span
                className={`text-xl transition-transform group-hover:scale-110 
                  ${isActive ? "text-white" : "text-primary"}
                `}
              >
                {item.icon}
              </span>
              <span className="text-sm tracking-wide">{item.label}</span>

              {isActive && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              )}
            </div>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;
