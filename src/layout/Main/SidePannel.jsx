import { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { FaGear } from "react-icons/fa6";
import { IoMdMail } from "react-icons/io";
import ProfileDropdown from "../../components/SidePannel/Profiledropdown";
import NotificationPanel from "../../components/SidePannel/NotificationPannel";
import MessagePanel from "../../components/SidePannel/MessagePannel";
import SettingsPanel from "../../components/SidePannel/SettingPannel";
import LanguageSwitcher from "../../components/SidePannel/LanguageSwitcher";
import { FaBell } from "react-icons/fa";
import { BsCheck2All } from "react-icons/bs";
import Swal from "sweetalert2";

// Drawer panels mapping
const PANELS = {
  notification: NotificationPanel,
  message: MessagePanel,
  settings: SettingsPanel,
};

// ── Slide-in Drawer ──────────────────────────────────────────
function Drawer({ panelKey, onClose, onMarkAllRead, refreshNotifications }) {
  const Component = PANELS[panelKey];
  if (!Component) return null;
  return (
    <>
      <div
        className="fixed rounded-l-lg right-[5vw] top-0 bottom-0 z-[200] w-[320px] flex flex-col bg-white dark:bg-gray-900 shadow-2xl border-l border-gray-100 dark:border-white/10"
        style={{ animation: "slideIn 0.25s cubic-bezier(0.4,0,0.2,1)" }}
      >
        <Component 
          onClose={onClose} 
          onMarkAllRead={onMarkAllRead}
          refreshNotifications={refreshNotifications}
        />
      </div>
      <style>{`
        @keyframes slideIn { from { transform: translateX(100%); } to { transform: translateX(0); } }
      `}</style>
    </>
  );
}

// ── Icon Button ──────────────────────────────────────────────
function PanelIconBtn({ icon: Icon, activeKey, myKey, badge, onClick }) {
  return (
    <button
      onClick={() => onClick(myKey)}
      className="relative w-10 h-10 cursor-pointer flex items-center justify-center rounded-2xl transition-all duration-200 bg-primary/40 hover:bg-primary/60"
    >
      <Icon className="w-4.5 h-4.5 font-bold text-black dark:text-white" />
      {badge > 0 && (
        <span
          className="absolute -top-1 -right-1 text-[9px] font-bold w-4 h-4 flex items-center justify-center rounded-full text-white ring-2 ring-white dark:ring-gray-900 animate-pulse"
          style={{ backgroundColor: "var(--primary)" }}
        >
          {badge > 9 ? "9+" : badge}
        </span>
      )}
    </button>
  );
}

// ── Main RightPanel ──────────────────────────────────────────
export default function RightPanel() {
  const [activePanel, setActivePanel] = useState(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const [fetchedUser, setFetchedUser] = useState(null);
  const [totalNotificationsCount, setTotalNotificationsCount] = useState(0);
  const [totalUnread, setTotalUnread] = useState(0);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const profileRef = useRef(null);

  const user = useSelector((state) => state.auth.user);
  const isAdmin = user?.role === 'admin';
  const isInstructor = user?.role === 'instructor';
  const isCustomer = user?.role === 'customer';
  const baseUrl =
    import.meta.env?.VITE_BACKEND_URL || "https://cms-backend-ashen.vercel.app";

  // ✅ Fetch TOTAL notifications count (pending + approved + rejected)
  const fetchTotalNotificationsCount = async () => {
    try {
      const token = localStorage.getItem("token");
      let total = 0;
      
      if (isAdmin) {
        // Admin: Only pending applications + pending reviews
        const { data: appData } = await axios.get(
          `${baseUrl}/api/users/instructor-applications`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const pendingApplications = (appData.applications || []).filter(
          (app) => app.instructorStatus === 'pending'
        );
        
        const { data: reviewData } = await axios.get(
          `${baseUrl}/api/reviews?status=pending`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const pendingReviews = reviewData.reviews || [];
        
        total = pendingApplications.length + pendingReviews.length;
        
      } else if (isInstructor) {
        // Instructor: pending reviews for their courses + pending application
        const instructorRes = await axios.get(
          `${baseUrl}/api/instructors/user/${user?.id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const instructorId = instructorRes.data.instructor?._id;
        
        let pendingReviews = 0;
        if (instructorId) {
          const { data: reviewData } = await axios.get(
            `${baseUrl}/api/reviews?instructor=${instructorId}&status=pending`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          pendingReviews = reviewData.reviews?.length || 0;
        }
        
        // Check pending application
        const { data: userData } = await axios.get(
          `${baseUrl}/api/users/${user?.id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        
        let hasPendingApplication = 0;
        if (userData.user?.instructorStatus === 'pending') {
          hasPendingApplication = 1;
        }
        
        total = pendingReviews + hasPendingApplication;
        
      } else if (isCustomer) {
        // Customer: only pending application
        const { data: userData } = await axios.get(
          `${baseUrl}/api/users/${user?.id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        
        let hasPendingApplication = 0;
        if (userData.user?.instructorStatus === 'pending') {
          hasPendingApplication = 1;
        }
        
        total = hasPendingApplication;
      }
      
      setTotalNotificationsCount(total);
      
    } catch (error) {
      console.error("Error fetching notifications count:", error);
    }
  };

  // ✅ Mark all notifications as read (clear badge count)
  const markAllAsRead = async () => {
    try {
      // Reset counts to 0 after marking as read
      setTotalNotificationsCount(0);
      
      // Store in localStorage that user has marked all as read
      localStorage.setItem('notifications_last_read', Date.now().toString());
      
      Swal.fire({
        title: "All Caught Up!",
        text: "All notifications marked as read",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
        position: "top-end",
        toast: true
      });
      
    } catch (error) {
      console.error("Error marking all as read:", error);
    }
  };

  // ✅ Fetch unread messages count
  const fetchUnreadMessages = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(
        `${baseUrl}/api/chat/conversations`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const total = res.data.conversations?.reduce(
        (acc, c) => acc + (c.unreadCount || 0), 0
      );
      setTotalUnread(total || 0);
    } catch (err) {
      console.error("Error fetching unread messages:", err);
    }
  };

  // ✅ Mark all messages as read
  const markAllMessagesAsRead = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `${baseUrl}/api/chat/mark-all-read`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTotalUnread(0);
      
      Swal.fire({
        title: "Messages Read",
        text: "All messages marked as read",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
        position: "top-end",
        toast: true
      });
    } catch (error) {
      console.error("Error marking messages as read:", error);
    }
  };

  // Function to refresh notifications (called after actions)
  const refreshNotifications = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  // ✅ Fetch all counts on component mount and when refreshTrigger changes
  useEffect(() => {
    if (user?.id) {
      fetchTotalNotificationsCount();
      fetchUnreadMessages();
    }
    
    // ✅ Auto-refresh every 30 seconds
    const interval = setInterval(() => {
      if (user?.id) {
        fetchTotalNotificationsCount();
        fetchUnreadMessages();
      }
    }, 30000);
    
    return () => clearInterval(interval);
  }, [user?.id, refreshTrigger]);

  // Fetch full user data by ID to get the profileImage URL
  useEffect(() => {
    if (user?.id) {
      axios
        .get(`${baseUrl}/api/users/${user.id}`)
        .then((res) => {
          setFetchedUser(res.data.user);
        })
        .catch((err) => console.error("Failed to fetch user profile:", err));
    }
  }, [user?.id, baseUrl]);

  const userAvatar = fetchedUser?.profileImage
    ? fetchedUser.profileImage
    : user?.firstName
      ? `https://ui-avatars.com/api/?name=${user.firstName}+${user.lastName || ""}&background=FFF0EE&color=FF6F61&bold=true`
      : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRgs2DOOnn9pY67TodjACV0st9VwO1Q-ZdxOA&s";

  useEffect(() => {
    const handler = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target))
        setProfileOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handlePanelClick = (key) => {
    setActivePanel((prev) => (prev === key ? null : key));
    setProfileOpen(false);
    
    // Jab notification panel open ho, refresh counts
    if (key === 'notification') {
      fetchTotalNotificationsCount();
    }
    if (key === 'message') {
      fetchUnreadMessages();
    }
  };

  const handleProfileClick = () => {
    setProfileOpen((p) => !p);
    setActivePanel(null);
  };

  return (
    <>
      <div
        className="fixed right-0 top-5 rounded-l-[30px] bottom-4 z-[180] flex flex-col
         bg-white dark:bg-[#292d4a] items-center justify-between w-[6.5vw] h-[92vh] py-6"
        style={{
          borderLeft: "1px solid var(--border-color, rgba(0,0,0,0.06))",
        }}
      >
        <div ref={profileRef} className="relative mb-2">
          <button
            onClick={handleProfileClick}
            className="w-10 h-10 rounded-md cursor-pointer overflow-hidden border-4 border-double border-primary transition-all ring-text-primary duration-200"
          >
            <img
              src={userAvatar}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </button>
          {profileOpen && (
            <ProfileDropdown onClose={() => setProfileOpen(false)} />
          )}
        </div>

        <div className="space-y-4">
          <div className=" h-px  " />
          
          {/* Notification Bell - Shows total pending count */}
          <div className="relative group">
            <PanelIconBtn
              icon={FaBell}
              myKey="notification"
              activeKey={activePanel}
              badge={totalNotificationsCount}
              onClick={handlePanelClick}
            />
            {totalNotificationsCount > 0 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  markAllAsRead();
                }}
                className="absolute -bottom-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-800 text-white text-[10px] px-2 py-1 rounded-full whitespace-nowrap z-50"
                title="Mark all as read"
              >
                <BsCheck2All className="inline w-3 h-3 mr-1" />
                Mark all read
              </button>
            )}
          </div>
          
          {/* Message Icon */}
          <div className="relative group">
            <PanelIconBtn
              icon={IoMdMail}
              myKey="message"
              activeKey={activePanel}
              badge={totalUnread}
              onClick={handlePanelClick}
            />
            {totalUnread > 0 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  markAllMessagesAsRead();
                }}
                className="absolute -bottom-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-800 text-white text-[10px] px-2 py-1 rounded-full whitespace-nowrap z-50"
                title="Mark all messages as read"
              >
                <BsCheck2All className="inline w-3 h-3 mr-1" />
                Mark all read
              </button>
            )}
          </div>
          
          <PanelIconBtn
            icon={FaGear}
            myKey="settings"
            activeKey={activePanel}
            badge={0}
            onClick={handlePanelClick}
          />
        </div>
        <LanguageSwitcher />
      </div>

      {activePanel && (
        <Drawer 
          panelKey={activePanel} 
          onClose={() => setActivePanel(null)} 
          onMarkAllRead={activePanel === 'notification' ? markAllAsRead : markAllMessagesAsRead}
          refreshNotifications={refreshNotifications}
        />
      )}
    </>
  );
}