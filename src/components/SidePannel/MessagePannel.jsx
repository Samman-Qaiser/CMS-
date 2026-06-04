// src/components/RightPanel/MessagePanel.jsx
import { BsEnvelope, BsX, BsSearch, BsCircleFill } from "react-icons/bs";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const BASE = `${import.meta.env.VITE_BACKEND_URL || "https://cms-backend-ashen.vercel.app"}/api`;
const getToken = () => localStorage.getItem("token");

export default function MessagePanel({ onClose }) {
  const [conversations, setConversations] = useState([]);
  const [search, setSearch] = useState("");
  const currentUser = useSelector((state) => state.auth.user);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchConvos = async () => {
      try {
        const res = await axios.get(`${BASE}/chat/conversations`, {
          headers: { Authorization: `Bearer ${getToken()}` },
        });
        setConversations(res.data.conversations || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchConvos();
  }, []);

  const userId = currentUser?._id || currentUser?.id;

  const getOtherUser = (convo) =>
    convo.participants?.find((p) => p._id !== userId);

  const totalUnread = conversations.reduce((acc, c) => acc + (c.unreadCount || 0), 0);

  const filtered = conversations.filter((c) => {
    const other = getOtherUser(c);
    return `${other?.firstName} ${other?.lastName}`
      .toLowerCase()
      .includes(search.toLowerCase());
  });

  const handleClick = (convo) => {
    onClose();
    // conversation ID pass karo navigate ke sath
    navigate("/dashboard/message", { state: { conversationId: convo._id } });
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:[#292D4A] shrink-0">
        <div className="flex items-center gap-2">
          <BsEnvelope className="w-5 h-5" style={{ color: "var(--primary)" }} />
          <h3 className="font-semibold text-base" style={{ color: "var(--content-text, #111827)" }}>
            Messages
          </h3>
          {totalUnread > 0 && (
            <span className="text-xs font-bold px-2 py-0.5 rounded-full text-white"
              style={{ backgroundColor: "var(--primary)" }}>
              {totalUnread}
            </span>
          )}
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
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 text-sm bg-transparent outline-none placeholder-gray-400"
            style={{ color: "var(--content-text, #111827)" }}
          />
        </div>
      </div>

      {/* List */}
      <ul className="flex-1 overflow-y-auto divide-y divide-gray-50 dark:divide-white/5">
        {filtered.length === 0 ? (
          <li className="px-5 py-8 text-center text-xs text-gray-400">
            No conversations yet
          </li>
        ) : (
          filtered.map((convo) => {
            const other = getOtherUser(convo)
            const unread = convo.unreadCount || 0
            return (
              <li
                key={convo._id}
                onClick={() => handleClick(convo)}
                className="flex items-start gap-3 px-5 py-3.5 hover:bg-gray-50 dark:hover:bg-white/5 cursor-pointer transition-colors"
              >
                {/* Avatar */}
                <div className="relative shrink-0">
                  <img
                    src={other?.profileImage || `https://i.pravatar.cc/40?u=${other?._id}`}
                    alt={other?.firstName}
                    className="w-10 h-10 rounded-xl object-cover"
                  />
                </div>

                {/* Text */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <p className="text-sm font-semibold truncate"
                      style={{ color: "var(--content-text, #111827)" }}>
                      {other?.firstName} {other?.lastName}
                    </p>
                    <span className="text-[11px] text-gray-400 shrink-0">
                      {convo.updatedAt
                        ? new Date(convo.updatedAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : ""}
                    </span>
                  </div>
                  <p className="text-xs mt-0.5 text-gray-400 truncate">
                    {convo.lastMessage?.content ||
                      convo.lastMessage?.fileName ||
                      "No messages yet"}
                  </p>
                </div>

                {/* Unread badge */}
                {unread > 0 && (
                  <span
                    className="text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full text-white shrink-0 mt-0.5"
                    style={{ backgroundColor: "var(--primary)" }}
                  >
                    {unread}
                  </span>
                )}
              </li>
            );
          })
        )}
      </ul>

      {/* Footer */}
      <div className="px-5 py-3 border-t border-gray-100 dark:border-white/10 shrink-0 text-center">
        <button
          onClick={() => { navigate("/dashboard/message"); onClose(); }}
          className="text-sm font-medium transition-colors hover:opacity-80"
          style={{ color: "var(--primary)" }}
        >
          See all messages
        </button>
      </div>
    </div>
  );
}