import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  BsBell, BsX, BsCheckCircle, BsXCircle,
  BsClock, BsEye, BsInfoCircle, BsStarFill, BsCheck2All
} from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const baseUrl =
  import.meta.env?.VITE_BACKEND_URL ||
  "https://cms-backend-ashen.vercel.app";

const DEFAULT_AVATAR = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRgs2DOOnn9pY67TodjACV0st9VwO1Q-ZdxOA&s";

// ─── LocalStorage helpers for "read" tracking ────────────────
const STORAGE_KEY = "notif_read_ids";

const getReadIds = () => {
  try {
    return new Set(JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]"));
  } catch {
    return new Set();
  }
};

const saveReadIds = (ids) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...ids]));
};

export const getUnreadCount = (notifications) => {
  const readIds = getReadIds();
  return notifications.filter((n) => !readIds.has(n._id)).length;
};

export const markAllRead = (notifications) => {
  const readIds = getReadIds();
  notifications.forEach((n) => readIds.add(n._id));
  saveReadIds(readIds);
};

// ─── Main Component ───────────────────────────────────────────
export default function NotificationPanel({ onClose, onBadgeUpdate }) {
  const [appNotifications, setAppNotifications] = useState([]);
  const [reviewNotifications, setReviewNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [readIds, setReadIds] = useState(getReadIds());
  const navigate = useNavigate();

  const currentUser = useSelector((state) => state.auth.user);
  const isAdmin = currentUser?.role === "admin";
  const isInstructor = currentUser?.role === "instructor";
  const isCustomer = currentUser?.role === "customer";

  // ─── Fetch Notifications ──────────────────────────────────
  const fetchNotifications = async () => {
    try {
      setLoading(true);

      if (isAdmin) {
        // Admin: only PENDING applications
        const { data: appData } = await axios.get(
          `${baseUrl}/api/users/instructor-applications`
        );
        const pendingApps = (appData.applications || []).filter(
          (app) => app.instructorStatus === "pending"
        );
        setAppNotifications(pendingApps);

        // Admin: only PENDING reviews
        const { data: reviewData } = await axios.get(
          `${baseUrl}/api/reviews?status=pending`
        );
        setReviewNotifications(reviewData.reviews || []);
      } else if (isInstructor) {
        // Instructor: own application — show only if approved or rejected
        const { data: userData } = await axios.get(
          `${baseUrl}/api/users/${currentUser?.id}`
        );
        const status = userData.user?.instructorStatus;
        if (status === "approved" || status === "rejected") {
          setAppNotifications([userData.user]);
        } else {
          setAppNotifications([]);
        }

        // Instructor: own courses' reviews — approved or rejected
        const instructorRes = await axios.get(
          `${baseUrl}/api/instructors/user/${currentUser?.id}`
        );
        const instructorId = instructorRes.data.instructor._id;
        const { data: reviewData } = await axios.get(
          `${baseUrl}/api/reviews?instructor=${instructorId}`
        );
        const resolvedReviews = (reviewData.reviews || []).filter(
          (r) => r.status === "approved" || r.status === "rejected"
        );
        setReviewNotifications(resolvedReviews);
      } else if (isCustomer) {
        // Customer: own application — show only if approved or rejected
        const { data: userData } = await axios.get(
          `${baseUrl}/api/users/${currentUser?.id}`
        );
        const status = userData.user?.instructorStatus;
        if (status === "approved" || status === "rejected") {
          setAppNotifications([userData.user]);
        } else {
          setAppNotifications([]);
        }

        // Customer: own submitted reviews — approved or rejected
        const { data: reviewData } = await axios.get(
          `${baseUrl}/api/reviews?user=${currentUser?.id}`
        );
        const resolvedReviews = (reviewData.reviews || []).filter(
          (r) => r.status === "approved" || r.status === "rejected"
        );
        setReviewNotifications(resolvedReviews);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser?.id) fetchNotifications();
  }, [currentUser?.id]);

  // ─── After fetch: notify parent of unread badge count ────
  useEffect(() => {
    const all = [
      ...appNotifications.map((a) => ({ ...a, _notifType: "application" })),
      ...reviewNotifications.map((r) => ({ ...r, _notifType: "review" })),
    ];
    const unread = all.filter((n) => !readIds.has(n._id)).length;
    onBadgeUpdate?.(unread);
  }, [appNotifications, reviewNotifications, readIds]);

  // ─── Mark all read ────────────────────────────────────────
  const handleMarkAllRead = () => {
    const all = [
      ...appNotifications.map((a) => ({ ...a, _notifType: "application" })),
      ...reviewNotifications.map((r) => ({ ...r, _notifType: "review" })),
    ];
    markAllRead(all);
    const newReadIds = getReadIds();
    setReadIds(new Set(newReadIds));
    onBadgeUpdate?.(0);
  };

  // ─── Mark single item read ────────────────────────────────
  const markOneRead = (id) => {
    const updated = new Set(readIds);
    updated.add(id);
    saveReadIds(updated);
    setReadIds(updated);
    const all = [
      ...appNotifications.map((a) => ({ ...a, _notifType: "application" })),
      ...reviewNotifications.map((r) => ({ ...r, _notifType: "review" })),
    ];
    const unread = all.filter((n) => !updated.has(n._id)).length;
    onBadgeUpdate?.(unread);
  };

  // ─── Helpers ──────────────────────────────────────────────
  const getUserAvatar = (user) => user?.profileImage || user?.avatar || DEFAULT_AVATAR;

  const formatTime = (dateString) => {
    if (!dateString) return "Recently";
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const getAppStatusInfo = (status, fullName) => {
    if (isAdmin) {
      return {
        message: `${fullName} applied to become an instructor`,
        subMessage: "Waiting for your approval",
        statusText: "Pending Review",
        badgeColor: "bg-yellow-100 text-yellow-700",
      };
    }
    switch (status) {
      case "approved":
        return {
          icon: BsCheckCircle,
          iconColor: "#10b981",
          bgColor: "#d1fae5",
          message: "Congratulations! You are now an instructor! 🎉",
          subMessage: "Your application has been approved",
          statusText: "Approved",
          badgeColor: "bg-green-100 text-green-700",
        };
      case "rejected":
        return {
          icon: BsXCircle,
          iconColor: "#ef4444",
          bgColor: "#fee2e2",
          message: "Your instructor application was rejected",
          subMessage: "Contact admin for more information",
          statusText: "Rejected",
          badgeColor: "bg-red-100 text-red-700",
        };
      default:
        return {
          icon: BsInfoCircle,
          iconColor: "#3b82f6",
          bgColor: "#dbeafe",
          message: "Application status updated",
          subMessage: `Status: ${status}`,
          statusText: status,
          badgeColor: "bg-blue-100 text-blue-700",
        };
    }
  };

  const getReviewStatusBadge = (status) => {
    switch (status) {
      case "approved":
        return { text: "Approved", color: "bg-green-100 text-green-700" };
      case "rejected":
        return { text: "Rejected", color: "bg-red-100 text-red-700" };
      default:
        return { text: "Pending", color: "bg-yellow-100 text-yellow-700" };
    }
  };

  // ─── Build unified list ───────────────────────────────────
  const allNotifications = [
    ...appNotifications.map((a) => ({ ...a, _notifType: "application" })),
    ...reviewNotifications.map((r) => ({ ...r, _notifType: "review" })),
  ];

  const filteredNotifications =
    activeTab === "all"
      ? allNotifications
      : activeTab === "applications"
      ? allNotifications.filter((n) => n._notifType === "application")
      : allNotifications.filter((n) => n._notifType === "review");

  const pendingApps = appNotifications.length;
  const pendingReviews = reviewNotifications.length;
  const totalBadge = allNotifications.filter((n) => !readIds.has(n._id)).length;

  return (
    <div className="flex flex-col my-auto h-[90%] bg-white dark:bg-[#292D4A] rounded-lg shadow-xl">

      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-white/10 shrink-0">
        <div className="flex items-center gap-2">
          <BsBell className="w-5 h-5" style={{ color: "var(--primary)" }} />
          <h3 className="font-semibold text-base" style={{ color: "var(--content-text)" }}>
            Notifications
          </h3>
          {totalBadge > 0 && (
            <span className="text-xs font-bold px-2 py-0.5 rounded-full text-white bg-primary">
              {totalBadge}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {totalBadge > 0 && (
            <button
              onClick={handleMarkAllRead}
              title="Mark all as read"
              className="flex items-center gap-1 text-xs text-primary hover:underline font-medium transition-colors"
            >
              <BsCheck2All className="w-4 h-4" />
              Mark all read
            </button>
          )}
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
          >
            <BsX className="w-5 h-5 text-gray-400" />
          </button>
        </div>
      </div>

      {/* Tabs */}
      {(isAdmin || isInstructor || isCustomer) && (
        <div className="flex border-b border-gray-100 dark:border-white/10 shrink-0">
          {["all", "applications", "reviews"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2.5 text-xs font-bold capitalize transition-all ${
                activeTab === tab
                  ? "text-primary border-b-2 border-primary"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              {tab}
              {tab === "applications" && pendingApps > 0 && (
                <span className="ml-1 bg-yellow-400 text-white rounded-full px-1.5 text-xs">
                  {pendingApps}
                </span>
              )}
              {tab === "reviews" && pendingReviews > 0 && (
                <span className="ml-1 bg-primary text-white rounded-full px-1.5 text-xs">
                  {pendingReviews}
                </span>
              )}
            </button>
          ))}
        </div>
      )}

      {/* List */}
      <ul className="flex-1 overflow-y-auto divide-y divide-gray-50 dark:divide-white/5">
        {loading ? (
          <li className="px-5 py-8 text-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto" />
            <p className="mt-2 text-gray-400 text-sm">Loading...</p>
          </li>
        ) : filteredNotifications.length === 0 ? (
          <li className="px-5 py-8 text-center">
            <BsBell className="w-10 h-10 text-gray-300 mx-auto mb-2" />
            <p className="text-gray-400 text-sm">No notifications</p>
          </li>
        ) : (
          filteredNotifications.map((item) => {
            const isUnread = !readIds.has(item._id);

            // ─── Review Notification ─────────────────────────────
            if (item._notifType === "review") {
              const badge = getReviewStatusBadge(item.status);

              // For non-admin: show what happened to their review
              const reviewMessage = isAdmin
                ? `New review from ${item.user?.firstName || ""} ${item.user?.lastName || ""}`
                : item.status === "approved"
                ? `Your review on "${item.course?.title}" was approved ✅`
                : `Your review on "${item.course?.title}" was rejected ❌`;

              return (
                <li
                  key={`review-${item._id}`}
                  onClick={() => {
                    markOneRead(item._id);
                    onClose();
                    navigate(isAdmin ? "/dashboard/reviews" : "/dashboard/my-reviews");
                  }}
                  className={`flex items-start gap-3 px-5 py-4 cursor-pointer transition-colors ${
                    isUnread
                      ? "bg-primary/5 hover:bg-primary/10"
                      : "hover:bg-gray-50 dark:hover:bg-white/5"
                  }`}
                >
                  {isUnread && (
                    <span className="absolute left-2 w-2 h-2 rounded-full bg-primary mt-4" />
                  )}
                  <div className="w-10 h-10 rounded-full shrink-0 flex items-center justify-center bg-primary/10">
                    <BsStarFill className="w-4 h-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm leading-snug ${isUnread ? "font-bold" : "font-medium"}`} style={{ color: "var(--content-text)" }}>
                      {reviewMessage}
                    </p>
                    {isAdmin && (
                      <p className="text-xs text-gray-400 mt-0.5 truncate">
                        {item.course?.title}
                      </p>
                    )}
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${badge.color}`}>
                        {badge.text}
                      </span>
                      <span className="text-xs text-gray-400">
                        {formatTime(item.createdAt)}
                      </span>
                      {isUnread && (
                        <span className="text-xs text-primary font-bold">● New</span>
                      )}
                    </div>
                  </div>
                  <BsEye className="w-4 h-4 text-gray-400 hover:text-primary transition-colors shrink-0" />
                </li>
              );
            }

            // ─── Application Notification ────────────────────────
            const fullName = `${item.firstName || ""} ${item.lastName || ""}`.trim();
            const statusInfo = getAppStatusInfo(item.instructorStatus, fullName);

            return (
              <li
                key={`app-${item._id}`}
                onClick={() => {
                  markOneRead(item._id);
                  onClose();
                  if (isAdmin) {
                    navigate("/dashboard/admin/instructor-applications");
                  } else {
                    navigate("/dashboard/profile-page");
                  }
                }}
                className={`flex items-start gap-3 px-5 py-4 cursor-pointer transition-colors ${
                  isUnread
                    ? "bg-primary/5 hover:bg-primary/10"
                    : "hover:bg-gray-50 dark:hover:bg-white/5"
                }`}
              >
                {isAdmin ? (
                  <div className="w-10 h-10 rounded-full shrink-0 overflow-hidden border-2 border-primary">
                    <img
                      src={getUserAvatar(item)}
                      alt={fullName}
                      className="w-full h-full object-cover"
                      onError={(e) => { e.target.src = DEFAULT_AVATAR; }}
                    />
                  </div>
                ) : (
                  <div
                    className="w-10 h-10 rounded-full shrink-0 flex items-center justify-center"
                    style={{ backgroundColor: statusInfo.bgColor }}
                  >
                    {(() => {
                      const Icon = statusInfo.icon;
                      return <Icon className="w-5 h-5" style={{ color: statusInfo.iconColor }} />;
                    })()}
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <p className={`text-sm leading-snug ${isUnread ? "font-bold" : "font-medium"}`} style={{ color: "var(--content-text)" }}>
                    {statusInfo.message}
                  </p>
                  <p className="text-xs mt-1 text-gray-400">{statusInfo.subMessage}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${statusInfo.badgeColor}`}>
                      {statusInfo.statusText}
                    </span>
                    <span className="text-xs text-gray-400">
                      {formatTime(item.updatedAt)}
                    </span>
                    {isUnread && (
                      <span className="text-xs text-primary font-bold">● New</span>
                    )}
                  </div>
                </div>

                <BsEye className="w-4 h-4 text-gray-400 hover:text-primary transition-colors shrink-0" />
              </li>
            );
          })
        )}
      </ul>

      {/* Footer */}
      <div className="px-5 py-3 border-t border-gray-100 dark:border-white/10 shrink-0">
        {isAdmin ? (
          <button
            onClick={() => { onClose(); navigate("/dashboard/reviews"); }}
            className="w-full text-sm font-medium py-2 rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-white/10 text-primary"
          >
            View All Reviews ({pendingReviews} pending)
          </button>
        ) : isInstructor ? (
          <button
            onClick={() => { onClose(); navigate("/dashboard/reviews"); }}
            className="w-full text-sm font-medium py-2 rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-white/10 text-primary"
          >
            View Course Reviews ({pendingReviews})
          </button>
        ) : (
          <button
            onClick={() => { onClose(); navigate("/dashboard/profile-page"); }}
            className="w-full text-sm font-medium py-2 rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-white/10 text-primary"
          >
            View Profile →
          </button>
        )}
      </div>
    </div>
  );
}