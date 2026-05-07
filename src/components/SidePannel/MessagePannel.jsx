// src/components/RightPanel/MessagePanel.jsx
import { BsEnvelope, BsX, BsSearch, BsCircleFill } from "react-icons/bs";

const messages = [
  { id: 1, avatar: "https://i.pravatar.cc/40?img=11", name: "Sarah Johnson",   preview: "Hey, can you review the design?",        time: "2m",  unread: 3,  online: true },
  { id: 2, avatar: "https://i.pravatar.cc/40?img=12", name: "Mike Chen",       preview: "The report is ready for submission.",     time: "15m", unread: 1,  online: true },
  { id: 3, avatar: "https://i.pravatar.cc/40?img=13", name: "Dr. Smith",       preview: "Patient appointment at 3 PM confirmed.",  time: "1h",  unread: 0,  online: false },
  { id: 4, avatar: "https://i.pravatar.cc/40?img=14", name: "Emma Wilson",     preview: "Thanks for the update!",                 time: "2h",  unread: 0,  online: true },
  { id: 5, avatar: "https://i.pravatar.cc/40?img=15", name: "James Parker",    preview: "Let's schedule a meeting tomorrow.",     time: "3h",  unread: 2,  online: false },
  { id: 6, avatar: "https://i.pravatar.cc/40?img=16", name: "Lisa Ray",        preview: "Documents have been uploaded.",          time: "5h",  unread: 0,  online: false },
  { id: 7, avatar: "https://i.pravatar.cc/40?img=17", name: "Tom Bradley",     preview: "Please check the latest updates.",       time: "1d",  unread: 0,  online: true },
];

export default function MessagePanel({ onClose }) {
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-white/10 shrink-0">
        <div className="flex items-center gap-2">
          <BsEnvelope className="w-5 h-5" style={{ color: "var(--primary)" }} />
          <h3 className="font-semibold text-base" style={{ color: "var(--content-text, #111827)" }}>
            Messages
          </h3>
          <span className="text-xs font-bold px-2 py-0.5 rounded-full text-white" style={{ backgroundColor: "var(--primary)" }}>
            {messages.filter(m => m.unread > 0).length}
          </span>
        </div>
        <button
          onClick={onClose}
          className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
        >
          <BsX className="w-5 h-5 text-gray-400" />
        </button>
      </div>

      {/* Search */}
      <div className="px-4 py-3 shrink-0">
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-gray-100 dark:bg-white/5">
          <BsSearch className="w-4 h-4 text-gray-400 shrink-0" />
          <input
            type="text"
            placeholder="Search messages..."
            className="flex-1 text-sm bg-transparent outline-none placeholder-gray-400"
            style={{ color: "var(--content-text, #111827)" }}
          />
        </div>
      </div>

      {/* List */}
      <ul className="flex-1 overflow-y-auto divide-y divide-gray-50 dark:divide-white/5">
        {messages.map((m) => (
          <li
            key={m.id}
            className="flex items-start gap-3 px-5 py-3.5 hover:bg-gray-50 dark:hover:bg-white/5 cursor-pointer transition-colors"
          >
            {/* Avatar with online dot */}
            <div className="relative shrink-0">
              <img src={m.avatar} alt={m.name} className="w-10 h-10 rounded-xl object-cover" />
              {m.online && (
                <BsCircleFill
                  className="absolute -bottom-0.5 -right-0.5 w-3 h-3 text-emerald-400 ring-2 ring-white dark:ring-gray-900 rounded-full"
                />
              )}
            </div>

            {/* Text */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-1">
                <p className="text-sm font-semibold truncate" style={{ color: "var(--content-text, #111827)" }}>
                  {m.name}
                </p>
                <span className="text-[11px] text-gray-400 shrink-0">{m.time}</span>
              </div>
              <p className="text-xs mt-0.5 text-gray-400 truncate">{m.preview}</p>
            </div>

            {/* Unread badge */}
            {m.unread > 0 && (
              <span className="text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full text-white shrink-0 mt-0.5"
                style={{ backgroundColor: "var(--primary)" }}>
                {m.unread}
              </span>
            )}
          </li>
        ))}
      </ul>

      {/* Footer */}
      <div className="px-5 py-3 border-t border-gray-100 dark:border-white/10 shrink-0 text-center">
        <button className="text-sm font-medium transition-colors hover:opacity-80" style={{ color: "var(--primary)" }}>
          See all messages
        </button>
      </div>
    </div>
  );
}