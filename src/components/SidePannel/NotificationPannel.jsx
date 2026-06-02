import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  BsBell, BsX, BsCheckCircle, BsXCircle,
  BsClock, BsEye, BsInfoCircle, BsStarFill
} from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const baseUrl =
  import.meta.env?.VITE_BACKEND_URL ||
  "https://cms-backend-ashen.vercel.app";

const DEFAULT_AVATAR = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRgs2DOOnn9pY67TodjACV0st9VwO1Q-ZdxOA&s";

export default function NotificationPanel({ onClose }) {
  const [appNotifications, setAppNotifications] = useState([])
  const [reviewNotifications, setReviewNotifications] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('all')
  const navigate = useNavigate()

  const currentUser = useSelector((state) => state.auth.user)
  const isAdmin = currentUser?.role === 'admin'
  const isInstructor = currentUser?.role === 'instructor'
  const isCustomer = currentUser?.role === 'customer'

  // ─── Fetch All Notifications ──────────────────────
  const fetchNotifications = async () => {
    try {
      setLoading(true)

      // ─── Applications ─────────────────────────────
      if (isAdmin) {
        const { data } = await axios.get(
          `${baseUrl}/api/users/instructor-applications`
        )
        setAppNotifications(data.applications || [])
      } else if (isInstructor || isCustomer) {
        const { data } = await axios.get(
          `${baseUrl}/api/users/${currentUser?.id}`
        )
        setAppNotifications(data.user ? [data.user] : [])
      }

      // ─── Reviews — Admin ya Instructor ────────────
      if (isAdmin) {
        const { data } = await axios.get(
          `${baseUrl}/api/reviews?status=pending`
        )
        setReviewNotifications(data.reviews || [])
      } else if (isInstructor) {
        // Instructor ke apne courses ke pending reviews
        const instructorRes = await axios.get(
          `${baseUrl}/api/instructors/user/${currentUser?.id}`
        )
        const instructorId = instructorRes.data.instructor._id
        const { data } = await axios.get(
          `${baseUrl}/api/reviews?instructor=${instructorId}&status=pending`
        )
        setReviewNotifications(data.reviews || [])
      }

    } catch (error) {
      console.error("Error fetching notifications:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (currentUser?.id) fetchNotifications()
  }, [currentUser?.id])

  // ─── Helpers ──────────────────────────────────────
  const getUserAvatar = (user) => {
    return user?.profileImage || user?.avatar || DEFAULT_AVATAR
  }

  const formatTime = (dateString) => {
    if (!dateString) return "Recently"
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now - date
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return "Just now"
    if (diffMins < 60) return `${diffMins} min ago`
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  const getAppStatusInfo = (status, fullName) => {
    if (isAdmin) {
      switch (status) {
        case 'pending':
          return {
            message: `${fullName} applied to become an instructor`,
            subMessage: "Waiting for your approval",
            statusText: "Pending Review",
            badgeColor: "bg-yellow-100 text-yellow-700"
          }
        case 'approved':
          return {
            message: `${fullName} is now an instructor!`,
            subMessage: "Application approved successfully",
            statusText: "Approved",
            badgeColor: "bg-green-100 text-green-700"
          }
        case 'rejected':
          return {
            message: `${fullName}'s application was rejected`,
            subMessage: "Application rejected",
            statusText: "Rejected",
            badgeColor: "bg-red-100 text-red-700"
          }
        default:
          return {
            message: `${fullName} application updated`,
            subMessage: `Status: ${status}`,
            statusText: status,
            badgeColor: "bg-gray-100 text-gray-700"
          }
      }
    } else {
      switch (status) {
        case 'pending':
          return {
            icon: BsClock,
            iconColor: "#f59e0b",
            bgColor: "#fef3c7",
            message: "Your instructor application is pending",
            subMessage: "We'll notify you once reviewed",
            statusText: "Pending",
            badgeColor: "bg-yellow-100 text-yellow-700"
          }
        case 'approved':
          return {
            icon: BsCheckCircle,
            iconColor: "#10b981",
            bgColor: "#d1fae5",
            message: "Congratulations! You are now an instructor! 🎉",
            subMessage: "Your application has been approved",
            statusText: "Approved",
            badgeColor: "bg-green-100 text-green-700"
          }
        case 'rejected':
          return {
            icon: BsXCircle,
            iconColor: "#ef4444",
            bgColor: "#fee2e2",
            message: "Your instructor application was rejected",
            subMessage: "Contact admin for more information",
            statusText: "Rejected",
            badgeColor: "bg-red-100 text-red-700"
          }
        default:
          return {
            icon: BsInfoCircle,
            iconColor: "#3b82f6",
            bgColor: "#dbeafe",
            message: "You haven't applied to become an instructor",
            subMessage: "Apply now to start teaching",
            statusText: "Not Applied",
            badgeColor: "bg-blue-100 text-blue-700"
          }
      }
    }
  }

  // ─── Badge Count ──────────────────────────────────
  const pendingApps = appNotifications.filter(
    (a) => a.instructorStatus === 'pending'
  ).length
  const pendingReviews = reviewNotifications.length
  const totalBadge = pendingApps + pendingReviews

  // ─── Filter notifications ─────────────────────────
  const displayApps = isAdmin
    ? appNotifications.filter((a) => a.instructorStatus !== 'none')
    : appNotifications

  const allNotifications = [
    ...displayApps.map((a) => ({ ...a, _notifType: 'application' })),
    ...reviewNotifications.map((r) => ({ ...r, _notifType: 'review' })),
  ]

  const filteredNotifications =
    activeTab === 'all'
      ? allNotifications
      : activeTab === 'applications'
      ? allNotifications.filter((n) => n._notifType === 'application')
      : allNotifications.filter((n) => n._notifType === 'review')

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
        <button
          onClick={onClose}
          className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
        >
          <BsX className="w-5 h-5 text-gray-400" />
        </button>
      </div>

      {/* Tabs — sirf admin ya instructor ke liye */}
      {(isAdmin || isInstructor) && (
        <div className="flex border-b border-gray-100 dark:border-white/10 shrink-0">
          {['all', 'applications', 'reviews'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2.5 text-xs font-bold capitalize transition-all ${
                activeTab === tab
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              {tab}
              {tab === 'applications' && pendingApps > 0 && (
                <span className="ml-1 bg-yellow-400 text-white rounded-full px-1.5 text-xs">
                  {pendingApps}
                </span>
              )}
              {tab === 'reviews' && pendingReviews > 0 && (
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

            // ─── Review Notification ───────────────
            if (item._notifType === 'review') {
              return (
                <li
                  key={`review-${item._id}`}
                  onClick={() => {
                    onClose()
                    navigate('/dashboard/reviews')
                  }}
                  className="flex items-start gap-3 px-5 py-4 hover:bg-gray-50 dark:hover:bg-white/5 cursor-pointer transition-colors"
                >
                  {/* Review Icon */}
                  <div className="w-10 h-10 rounded-full shrink-0 flex items-center justify-center bg-primary/10">
                    <BsStarFill className="w-4 h-4 text-primary" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium" style={{ color: "var(--content-text)" }}>
                      New review from{' '}
                      <span className="font-bold">
                        {item.user?.firstName} {item.user?.lastName}
                      </span>
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5 truncate">
                      {item.course?.title}
                    </p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-700 font-bold">
                        Pending Review
                      </span>
                      <span className="text-xs text-gray-400">
                        {formatTime(item.createdAt)}
                      </span>
                    </div>
                  </div>

                  <BsEye className="w-4 h-4 text-gray-400 hover:text-primary transition-colors shrink-0" />
                </li>
              )
            }

            // ─── Application Notification ──────────
            const fullName = `${item.firstName || ''} ${item.lastName || ''}`.trim()
            const statusInfo = getAppStatusInfo(item.instructorStatus, fullName)

            return (
              <li
                key={`app-${item._id}`}
                onClick={() => {
                  onClose()
                  if (isAdmin) {
                    navigate('/dashboard/instructor-applications')
                  } else {
                    navigate('/dashboard/profile-page')
                  }
                }}
                className="flex items-start gap-3 px-5 py-4 hover:bg-gray-50 dark:hover:bg-white/5 cursor-pointer transition-colors"
              >
                {isAdmin ? (
                  <div className="w-10 h-10 rounded-full shrink-0 overflow-hidden border-2 border-primary">
                    <img
                      src={getUserAvatar(item)}
                      alt={fullName}
                      className="w-full h-full object-cover"
                      onError={(e) => { e.target.src = DEFAULT_AVATAR }}
                    />
                  </div>
                ) : (
                  <div
                    className="w-10 h-10 rounded-full shrink-0 flex items-center justify-center"
                    style={{ backgroundColor: statusInfo.bgColor }}
                  >
                    {(() => {
                      const Icon = statusInfo.icon
                      return <Icon className="w-5 h-5" style={{ color: statusInfo.iconColor }} />
                    })()}
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium leading-snug" style={{ color: "var(--content-text)" }}>
                    {statusInfo.message}
                  </p>
                  <p className="text-xs mt-1 text-gray-400">
                    {statusInfo.subMessage}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${statusInfo.badgeColor}`}>
                      {statusInfo.statusText}
                    </span>
                    <span className="text-xs text-gray-400">
                      {formatTime(item.updatedAt)}
                    </span>
                  </div>
                </div>

                <BsEye className="w-4 h-4 text-gray-400 hover:text-primary transition-colors shrink-0" />
              </li>
            )
          })
        )}
      </ul>

      {/* Footer */}
      <div className="px-5 py-3 border-t border-gray-100 dark:border-white/10 shrink-0">
        {isAdmin ? (
          <button
            onClick={() => {
              onClose()
              navigate('/dashboard/reviews')
            }}
            className="w-full text-sm font-medium py-2 rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-white/10 text-primary"
          >
            View All Reviews ({pendingReviews} pending)
          </button>
        ) : (
          <button
            onClick={() => {
              onClose()
              navigate('/dashboard/profile-page')
            }}
            className="w-full text-sm font-medium py-2 rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-white/10 text-primary"
          >
            View Profile →
          </button>
        )}
      </div>
    </div>
  )
}