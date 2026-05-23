// src/components/RightPanel/NotificationPanel.jsx
import { useState, useEffect } from "react";
import { BsBell, BsX, BsPerson } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const baseUrl =
  import.meta.env?.VITE_BACKEND_URL ||
  "https://cms-backend-ashen.vercel.app";

// Default avatar image
const DEFAULT_AVATAR = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRgs2DOOnn9pY67TodjACV0st9VwO1Q-ZdxOA&s";

export default function NotificationPanel({ onClose }) {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch instructor applications
  const fetchApplications = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `${baseUrl}/api/users/instructor-applications`
      );
      setApplications(data.applications);
    } catch (error) {
      console.error("Error fetching applications:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  // Handle click on notification
  const handleNotificationClick = (application) => {
    onClose(); // Close notification panel first
    navigate("/dashboard/admin/instructor-applications"); // Navigate to full page
  };

  // Get user avatar URL (priority: user's avatar > default)
  const getUserAvatar = (user) => {
    if (user.avatar && user.avatar !== "") {
      return user.avatar;
    }
    if (user.profileImage && user.profileImage !== "") {
      return user.profileImage;
    }
    if (user.profilePicture && user.profilePicture !== "") {
      return user.profilePicture;
    }
    return DEFAULT_AVATAR;
  };

  // Format time
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  // Filter: Sirf pending applications
  const instructorNotifications = applications.filter(
    (app) => app.instructorStatus === 'pending'
  );

  const pendingCount = applications.filter((app) => app.instructorStatus === 'pending').length;

  return (
    <div className="flex flex-col my-auto h-[90%] bg-white dark:bg-[#292D4A]">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-white/10 shrink-0">
        <div className="flex items-center gap-2">
          <BsBell className="w-5 h-5" style={{ color: "var(--primary)" }} />
          <h3 className="font-semibold text-base" style={{ color: "var(--content-text, #111827)" }}>
            Notifications
          </h3>
          <span className="text-xs font-bold px-2 py-0.5 rounded-full text-white" style={{ backgroundColor: "var(--primary)" }}>
            {pendingCount}
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
        {loading ? (
          <li className="px-5 py-8 text-center text-gray-400 text-sm">
            Loading...
          </li>
        ) : instructorNotifications.length === 0 ? (
          <li className="px-5 py-8 text-center text-gray-400 text-sm">
            No new instructor applications
          </li>
        ) : (
          instructorNotifications.map((app) => {
            const fullName = `${app.firstName || ''} ${app.lastName || ''}`.trim();
            const userAvatar = getUserAvatar(app);
            
            return (
              <li
                key={app._id}
                onClick={() => handleNotificationClick(app)}
                className="flex items-start gap-3 px-5 py-3.5 hover:bg-gray-50 dark:hover:bg-white/5 cursor-pointer transition-colors"
              >
                {/* User Avatar Image */}
                <div className="w-10 h-10 rounded-md border border-primary shrink-0 overflow-hidden">
                  <img 
                    src={userAvatar} 
                    alt={fullName || "User"}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      // Agar image load nahi hoti toh default image show karo
                      e.target.src = DEFAULT_AVATAR;
                    }}
                  />
                </div>

                {/* Text */}
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium leading-snug" style={{ color: "var(--content-text, #111827)" }}>
                    <span className="font-bold">{fullName || "Someone"}</span> applied to become an instructor
                  </p>
                  <p className="text-xs mt-0.5 text-gray-400">
                    Status:{" "}
                    <span
                      className={`capitalize font-medium ${
                        app.instructorStatus === "pending"
                          ? "text-yellow-500"
                          : app.instructorStatus === "approved"
                          ? "text-green-500"
                          : "text-red-500"
                      }`}
                    >
                      {app.instructorStatus}
                    </span>
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {formatTime(app.updatedAt)}
                  </p>
                </div>

                {/* Status Badge */}
                <div>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full ${
                      app.instructorStatus === "pending"
                        ? "bg-yellow-100 text-yellow-700"
                        : app.instructorStatus === "approved"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {app.instructorStatus}
                  </span>
                </div>
              </li>
            );
          })
        )}
      </ul>

      {/* Footer */}
      <div className="px-5 py-3 border-t border-gray-100 dark:border-white/10 shrink-0 text-center">
        <button
          onClick={() => {
            onClose();
            navigate("/dashboard/admin/instructor-applications");
          }}
          className="text-sm font-medium transition-colors hover:opacity-80"
          style={{ color: "var(--primary)" }}
        >
          View all instructor applications
        </button>
      </div>
    </div>
  );
}