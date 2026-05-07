// src/components/RightPanel/NotificationPanel.jsx
import { BsBell, BsX, BsHouse, BsPerson } from "react-icons/bs";

const notifications = [
  { id: 1, icon: null,     avatar: "https://i.pravatar.cc/40?img=3",  bg: null,           title: "Dr sultads Send you Photo",   time: "29 July 2020 - 02:26 PM" },
  { id: 2, icon: null,     initials: "KG",                            bg: "#bee3f8",       title: "Report created successfully",  time: "29 July 2020 - 02:26 PM" },
  { id: 3, icon: BsHouse,  iconColor: "#fff",                         bg: "#c6f6d5",       title: "Reminder: Treatment Time!",    time: "29 July 2020 - 02:26 PM" },
  { id: 4, icon: null,     avatar: "https://i.pravatar.cc/40?img=8",  bg: null,           title: "Dr sultads Send you Photo",   time: "29 July 2020 - 02:26 PM" },
  { id: 5, icon: null,     initials: "KG",                            bg: "#fed7d7",       title: "Report created successfully",  time: "29 July 2020 - 02:26 PM" },
  { id: 6, icon: BsHouse,  iconColor: "#fff",                         bg: "#fbb6ce",       title: "Reminder: Treatment Time!",    time: "29 July 2020 - 02:26 PM" },
  { id: 7, icon: null,     avatar: "https://i.pravatar.cc/40?img=5",  bg: null,           title: "Dr sultads Send you Photo",   time: "29 July 2020 - 02:26 PM" },
];

export default function NotificationPanel({ onClose }) {
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-white/10 shrink-0">
        <div className="flex items-center gap-2">
          <BsBell className="w-5 h-5" style={{ color: "var(--primary)" }} />
          <h3 className="font-semibold text-base" style={{ color: "var(--content-text, #111827)" }}>
            Notifications
          </h3>
          <span className="text-xs font-bold px-2 py-0.5 rounded-full text-white" style={{ backgroundColor: "var(--primary)" }}>
            {notifications.length}
          </span>
        </div>
        <button
          onClick={onClose}
          className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
        >
          <BsX className="w-5 h-5 text-gray-400" />
        </button>
      </div>

      {/* List */}
      <ul className="flex-1 overflow-y-auto divide-y divide-gray-50 dark:divide-white/5">
        {notifications.map((n) => (
          <li
            key={n.id}
            className="flex items-start gap-3 px-5 py-3.5 hover:bg-gray-50 dark:hover:bg-white/5 cursor-pointer transition-colors"
          >
            {/* Avatar / Icon */}
            <div
              className="w-10 h-10 rounded-xl shrink-0 flex items-center justify-center overflow-hidden text-sm font-bold"
              style={{ backgroundColor: n.bg || "transparent" }}
            >
              {n.avatar ? (
                <img src={n.avatar} alt="" className="w-full h-full object-cover rounded-xl" />
              ) : n.initials ? (
                <span style={{ color: "var(--primary)" }}>{n.initials}</span>
              ) : n.icon ? (
                <n.icon className="w-5 h-5" style={{ color: n.iconColor || "var(--primary)" }} />
              ) : null}
            </div>

            {/* Text */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium leading-snug truncate" style={{ color: "var(--content-text, #111827)" }}>
                {n.title}
              </p>
              <p className="text-xs mt-0.5 text-gray-400">{n.time}</p>
            </div>
          </li>
        ))}
      </ul>

      {/* Footer */}
      <div className="px-5 py-3 border-t border-gray-100 dark:border-white/10 shrink-0 text-center">
        <button className="text-sm font-medium transition-colors hover:opacity-80" style={{ color: "var(--primary)" }}>
          See all notifications
        </button>
      </div>
    </div>
  );
}