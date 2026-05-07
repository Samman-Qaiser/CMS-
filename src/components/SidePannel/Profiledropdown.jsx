// src/components/RightPanel/ProfileDropdown.jsx
import { useRef, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../../redux/Slice/authSlice";
import { BsPerson, BsEnvelope, BsKey, BsBoxArrowRight } from "react-icons/bs";

const menuItems = [
  { icon: BsPerson,  label: "Profile",         path: "/profile" },
  { icon: BsEnvelope,label: "Inbox",           path: "/inbox" },
  { icon: BsKey,     label: "Change Password", path: "/change-password" },
];

export default function ProfileDropdown({ onClose }) {
  const ref      = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) onClose();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose]);

  const handleLogout = () => {
    dispatch(logout());
    onClose();
    navigate("/");
  };

  return (
    <div
      ref={ref}
      className="absolute right-[70px] top-0 z-[200] w-[220px] rounded-2xl shadow-xl border border-gray-100 dark:border-white/10 bg-white dark:bg-gray-900 overflow-hidden"
      style={{ animation: "dropIn 0.2s ease" }}
    >
      <style>{`
        @keyframes dropIn {
          from { opacity: 0; transform: translateY(-8px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>

      <ul className="py-2">
        {/* Normal nav items */}
        {menuItems.map(({ icon: Icon, label, path }) => (
          <li key={label}>
            <NavLink
              to={path}
              onClick={onClose}
              className="flex items-center gap-3 px-4 py-3 text-sm transition-colors duration-150 hover:bg-gray-50 dark:hover:bg-white/5"
              style={{ color: "var(--content-text, #374151)" }}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{label}</span>
            </NavLink>
          </li>
        ))}

        {/* Logout — dispatch + navigate */}
        <li>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-sm transition-colors duration-150 hover:bg-gray-50 dark:hover:bg-white/5"
            style={{ color: "var(--primary)" }}
          >
            <BsBoxArrowRight className="w-4 h-4 shrink-0" />
            <span>Logout</span>
          </button>
        </li>
      </ul>
    </div>
  );
}