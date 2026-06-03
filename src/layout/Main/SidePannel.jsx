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

// Drawer panels mapping
const PANELS = {
  notification: NotificationPanel,
  message: MessagePanel,
  settings: SettingsPanel,
};

// ── Slide-in Drawer ──────────────────────────────────────────
function Drawer({ panelKey, onClose }) {
  const Component = PANELS[panelKey];
  if (!Component) return null;
  return (
    <>
      <div
        className="fixed rounded-l-lg right-[5vw] top-0 bottom-0 z-[200] w-[320px] flex flex-col bg-white dark:bg-gray-900 shadow-2xl border-l border-gray-100 dark:border-white/10"
        style={{ animation: "slideIn 0.25s cubic-bezier(0.4,0,0.2,1)" }}
      >
        <Component onClose={onClose} />
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
      className="relative w-10 h-10 cursor-pointer flex items-center justify-center rounded-2xl transition-all duration-200 bg-primary/40"
    >
      <Icon className="w-4.5 h-4.5 font-bold text-black dark:text-white" />
      {badge > 0 && (
        <span
          className="absolute -top-1 -right-1 text-[9px] font-bold w-4 h-4 flex items-center justify-center rounded-full text-white ring-2 ring-white dark:ring-gray-900"
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
  const [pendingCount, setPendingCount] = useState(0); // ✅ Real-time pending count state
  const profileRef = useRef(null);

  const user = useSelector((state) => state.auth.user);
  const baseUrl =
    import.meta.env?.VITE_BACKEND_URL || "https://cms-backend-ashen.vercel.app";

  // ✅ Function to fetch pending instructor applications count
  const fetchPendingCount = async () => {
    try {
      const token = localStorage.getItem("token"); // Assuming token is stored in localStorage
      const { data } = await axios.get(
        `${baseUrl}/api/users/instructor-applications`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setPendingCount(data.pendingCount || 0);
    } catch (error) {
      console.error("Error fetching pending count:", error);
      // Agar error aaye toh count 0 rakhdo
      setPendingCount(0);
    }
  };

  // ✅ Fetch count on component mount
  useEffect(() => {
    fetchPendingCount();
    
    // ✅ Optional: Auto-refresh every 30 seconds (real-time effect)
    const interval = setInterval(() => {
      fetchPendingCount();
    }, 30000); // 30 seconds mein refresh ho jayega
    
    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

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
const [totalUnread, setTotalUnread] = useState(0)

useEffect(() => {
  const fetchUnread = async () => {
    try {
      const token = localStorage.getItem('token')
      const res = await axios.get(
        `${baseUrl}/api/chat/conversations`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      const total = res.data.conversations?.reduce(
        (acc, c) => acc + (c.unreadCount || 0), 0
      )
      setTotalUnread(total || 0)
    } catch (err) {
      console.error(err)
    }
  }
  fetchUnread()
  const interval = setInterval(fetchUnread, 10000)
  return () => clearInterval(interval)
}, [])

  const handlePanelClick = (key) => {
    setActivePanel((prev) => (prev === key ? null : key));
    setProfileOpen(false);
    
    // ✅ Jab notification panel open ho, toh fresh count fetch karo
    if (key === 'notification') {
      fetchPendingCount();
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
          <div className="w-6 h-px bg-gray-200 dark:bg-white/10" />
          <PanelIconBtn
            icon={FaBell}
            myKey="notification"
            activeKey={activePanel}
            badge={pendingCount} // ✅ Real-time badge count
            onClick={handlePanelClick}
          />
         <PanelIconBtn
  icon={IoMdMail}
  myKey="message"
  activeKey={activePanel}
  badge={totalUnread}  // 3 ki jagah real count
  onClick={handlePanelClick}
/>
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
        <Drawer panelKey={activePanel} onClose={() => setActivePanel(null)} />
      )}
    </>
  );
}