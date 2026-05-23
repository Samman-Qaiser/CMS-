import { useRef, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux"; 
import { logout } from "../../redux/Slice/authSlice";
import { BsPerson, BsEnvelope, BsKey, BsBoxArrowRight, BsTelephone } from "react-icons/bs";
import { BsPerson, BsEnvelope, BsKey, BsBoxArrowRight } from "react-icons/bs";
import { FaGraduationCap } from "react-icons/fa6";


export default function ProfileDropdown({ onClose }) {
  const ref = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

const user = useSelector((state) => state.auth.user);
const menuItems = [
  { icon: BsPerson,   label: "Profile",         path: "/dashboard/profile-page" },
  { icon: BsEnvelope, label: "Inbox",            path: "/dashboard/contact-us" },
  { icon: BsKey,      label: "Change Password",  path: "/change-password" },

  ...(user?.role === 'customer' ? [
    { icon: FaGraduationCap, label: "Become Instructor", path: "/dashboard/become-instructor" }
  ] : []),
];
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
      className="absolute right-[70px] top-0 z-[200] w-[220px] rounded-2xl shadow-xl border border-gray-100 dark:border-white/10 bg-bg-main overflow-hidden"
      style={{ animation: "dropIn 0.2s ease" }}
    >
      <style>{`
        @keyframes dropIn {
          from { opacity: 0; transform: translateY(-8px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>

      <ul className="py-2">
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