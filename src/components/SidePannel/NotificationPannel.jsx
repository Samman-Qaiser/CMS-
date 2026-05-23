// src/components/SidePannel/NotificationPannel.jsx
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { BsBell, BsX, BsCheckCircle, BsXCircle, BsClock, BsPerson, BsEye, BsInfoCircle } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const baseUrl =
  import.meta.env?.VITE_BACKEND_URL ||
  "https://cms-backend-ashen.vercel.app";

const DEFAULT_AVATAR = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRgs2DOOnn9pY67TodjACV0st9VwO1Q-ZdxOA&s";

export default function NotificationPanel({ onClose }) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  const currentUser = useSelector((state) => state.auth.user);
  const isAdmin = currentUser?.role === 'admin';
  const isInstructor = currentUser?.role === 'instructor';
  const isCustomer = currentUser?.role === 'customer';

  // ✅ Fetch notifications based on user role
  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      
      let endpoint = '';
      
      // ✅ Admin: Saari applications dekhega
      if (isAdmin) {
        endpoint = `${baseUrl}/api/users/instructor-applications`;
      } 
      // ✅ Instructor ya Customer: Sirf apni application ka status dekhega
      else if (isInstructor || isCustomer) {
        endpoint = `${baseUrl}/api/users/${currentUser?.id}/application-status`;
      }
      
      if (!endpoint) {
        setLoading(false);
        return;
      }
      
      const { data } = await axios.get(endpoint, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setNotifications(data.notifications || data.applications || []);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser?.id) {
      fetchNotifications();
    }
  }, [currentUser?.id, isAdmin]);

  const handleNotificationClick = (notification) => {
    onClose();
    // ✅ Admin ko applications page pe bhejo
    if (isAdmin) {
      navigate("/dashboard/admin/instructor-applications");
    } 
    // ✅ Instructor/Customer ko profile page pe bhejo
    else {
      navigate("/dashboard/profile-page");
    }
  };

  const getUserAvatar = (user) => {
    if (user?.avatar && user.avatar !== "") return user.avatar;
    if (user?.profileImage && user.profileImage !== "") return user.profileImage;
    if (user?.profilePicture && user.profilePicture !== "") return user.profilePicture;
    return DEFAULT_AVATAR;
  };

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
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  // ✅ Status ke according message, icon aur color
  const getStatusInfo = (status, fullName, role) => {
    // ✅ Admin ke liye
    if (isAdmin) {
      switch(status) {
        case 'pending':
          return {
            message: `${fullName} applied to become an instructor`,
            subMessage: "Waiting for your approval",
            statusText: "Pending Review",
            badgeColor: "bg-yellow-100 text-yellow-700"
          };
        case 'approved':
          return {
            message: `${fullName} is now an instructor!`,
            subMessage: "Application approved successfully",
            statusText: "Approved",
            badgeColor: "bg-green-100 text-green-700"
          };
        case 'rejected':
          return {
            message: `${fullName}'s application was rejected`,
            subMessage: "Application rejected",
            statusText: "Rejected",
            badgeColor: "bg-red-100 text-red-700"
          };
        default:
          return {
            message: `${fullName} application status updated`,
            subMessage: `Status: ${status}`,
            statusText: status,
            badgeColor: "bg-gray-100 text-gray-700"
          };
      }
    } 
    // ✅ Instructor ya Customer ke liye (apni application ka status)
    else {
      switch(status) {
        case 'pending':
          return {
            icon: BsClock,
            iconColor: "#f59e0b",
            bgColor: "#fef3c7",
            message: "Your instructor application is pending review",
            subMessage: "We'll notify you once it's reviewed",
            statusText: "Pending",
            badgeColor: "bg-yellow-100 text-yellow-700",
            buttonText: "Check Status"
          };
        case 'approved':
          return {
            icon: BsCheckCircle,
            iconColor: "#10b981",
            bgColor: "#d1fae5",
            message: "Congratulations! You are now an instructor! 🎉",
            subMessage: "Your application has been approved",
            statusText: "Approved",
            badgeColor: "bg-green-100 text-green-700",
            buttonText: "Go to Dashboard"
          };
        case 'rejected':
          return {
            icon: BsXCircle,
            iconColor: "#ef4444",
            bgColor: "#fee2e2",
            message: "Your instructor application was rejected",
            subMessage: "Contact admin for more information",
            statusText: "Rejected",
            badgeColor: "bg-red-100 text-red-700",
            buttonText: "Contact Support"
          };
        default:
          return {
            icon: BsInfoCircle,
            iconColor: "#3b82f6",
            bgColor: "#dbeafe",
            message: "You haven't applied to become an instructor yet",
            subMessage: "Apply now to start teaching",
            statusText: "Not Applied",
            badgeColor: "bg-blue-100 text-blue-700",
            buttonText: "Apply Now"
          };
      }
    }
  };

  // ✅ Prepare notifications based on role
  const prepareNotifications = () => {
    if (isAdmin) {
      // Admin: Saare applications jinhonne apply kiya hai
      return notifications.filter(app => app.instructorStatus !== 'none');
    } else if (isInstructor || isCustomer) {
      // Instructor/Customer: Sirf apni application ka status
      if (notifications.length === 0) {
        // Agar user ne apply nahi kiya
        return [{
          _id: currentUser?.id,
          firstName: currentUser?.firstName,
          lastName: currentUser?.lastName,
          instructorStatus: 'none',
          role: currentUser?.role,
          updatedAt: currentUser?.createdAt
        }];
      }
      return notifications;
    }
    return [];
  };

  const displayNotifications = prepareNotifications();
  
  // ✅ Badge count: Admin ke liye pending count, Users ke liye agar approved/rejected ho toh 1
  const getBadgeCount = () => {
    if (isAdmin) {
      return notifications.filter(app => app.instructorStatus === 'pending').length;
    } else if (isInstructor || isCustomer) {
      const status = notifications[0]?.instructorStatus;
      if (status === 'approved' || status === 'rejected') {
        return 1; // Naya status update dikhane ke liye
      }
      return 0;
    }
    return 0;
  };

  const badgeCount = getBadgeCount();

  if (displayNotifications.length === 0 && !loading) {
    return (
      <div className="flex flex-col my-auto h-[90%] bg-white dark:bg-[#292D4A] rounded-lg shadow-xl">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-white/10">
          <div className="flex items-center gap-2">
            <BsBell className="w-5 h-5" style={{ color: "var(--primary)" }} />
            <h3 className="font-semibold text-base">Notifications</h3>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100">
            <BsX className="w-5 h-5 text-gray-400" />
          </button>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center p-6">
            <BsBell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">No notifications</p>
            {!isAdmin && (
              <button
                onClick={() => {
                  onClose();
                  navigate("/apply-instructor");
                }}
                className="mt-4 text-sm text-primary font-medium hover:underline"
              >
                Apply to become an instructor →
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col my-auto h-[90%] bg-white dark:bg-[#292D4A] rounded-lg shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-white/10 shrink-0">
        <div className="flex items-center gap-2">
          <BsBell className="w-5 h-5" style={{ color: "var(--primary)" }} />
          <h3 className="font-semibold text-base" style={{ color: "var(--content-text, #111827)" }}>
            {isAdmin ? "Instructor Applications" : "Application Status"}
          </h3>
          {badgeCount > 0 && (
            <span className="text-xs font-bold px-2 py-0.5 rounded-full text-white" style={{ backgroundColor: "var(--primary)" }}>
              {badgeCount}
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

      {/* List */}
      <ul className="flex-1 overflow-y-auto divide-y divide-gray-50 dark:divide-white/5">
        {loading ? (
          <li className="px-5 py-8 text-center text-gray-400 text-sm">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2">Loading...</p>
          </li>
        ) : (
          displayNotifications.map((item) => {
            const fullName = `${item.firstName || ''} ${item.lastName || ''}`.trim();
            const userAvatar = getUserAvatar(item);
            const statusInfo = getStatusInfo(item.instructorStatus, fullName, item.role);
            
            return (
              <li
                key={item._id}
                onClick={() => handleNotificationClick(item)}
                className="flex items-start gap-3 px-5 py-4 hover:bg-gray-50 dark:hover:bg-white/5 cursor-pointer transition-colors"
              >
                {/* ✅ Admin ke liye User Profile Image, otherwise Status Icon */}
                {isAdmin ? (
                  // ✅ Admin: User ki profile image dikhao
                  <div className="w-10 h-10 rounded-full shrink-0 overflow-hidden border-2 border-primary">
                    <img 
                      src={userAvatar} 
                      alt={fullName}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = DEFAULT_AVATAR;
                      }}
                    />
                  </div>
                ) : (
                  // ✅ Non-Admin: Status icon dikhao
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

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium leading-snug" style={{ color: "var(--content-text, #111827)" }}>
                    {statusInfo.message}
                  </p>
                  <p className="text-xs mt-1 text-gray-400">
                    {statusInfo.subMessage}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${statusInfo.badgeColor}`}>
                      {statusInfo.statusText}
                    </span>
                    <span className="text-xs text-gray-400">
                      {formatTime(item.updatedAt)}
                    </span>
                  </div>
                </div>

                {/* View/Arrow Icon */}
                <div className="shrink-0">
                  <BsEye className="w-4 h-4 text-gray-400 hover:text-primary transition-colors" />
                </div>
              </li>
            );
          })
        )}
      </ul>

      {/* Footer */}
      <div className="px-5 py-3 border-t border-gray-100 dark:border-white/10 shrink-0">
        {isAdmin ? (
          <button
            onClick={() => {
              onClose();
              navigate("/dashboard/admin/instructor-applications");
            }}
            className="w-full text-sm font-medium py-2 rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-white/10"
            style={{ color: "var(--primary)" }}
          >
            View All Applications ({displayNotifications.length})
          </button>
        ) : (
          <button
            onClick={() => {
              onClose();
              if (notifications[0]?.instructorStatus === 'none') {
                navigate("/apply-instructor");
              } else {
                navigate("/dashboard/profile-page");
              }
            }}
            className="w-full text-sm font-medium py-2 rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-white/10"
            style={{ color: "var(--primary)" }}
          >
            {notifications[0]?.instructorStatus === 'approved' ? "Go to Dashboard →" :
             notifications[0]?.instructorStatus === 'rejected' ? "Contact Support →" :
             notifications[0]?.instructorStatus === 'pending' ? "Check Status →" :
             "Apply Now →"}
          </button>
        )}
      </div>
    </div>
  );
}