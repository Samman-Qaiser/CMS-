
import { useState, useEffect, useRef } from "react";
import { FaGear } from "react-icons/fa6";
import { IoMdMail } from "react-icons/io";
import ProfileDropdown   from "../../components/SidePannel/Profiledropdown";
import NotificationPanel from "../../components/SidePannel/NotificationPannel";
import MessagePanel      from "../../components/SidePannel/MessagePannel";
import SettingsPanel     from "../../components/SidePannel/SettingPannel";
import LanguageSwitcher  from "../../components/SidePannel/LanguageSwitcher";
import { FaBell } from "react-icons/fa";
import { IoMail } from "react-icons/io5";

// Drawer panels mapping
const PANELS = {
  notification: NotificationPanel,
  message:      MessagePanel,
  settings:     SettingsPanel,
};

// ── Slide-in Drawer ──────────────────────────────────────────
function Drawer({ panelKey, onClose }) {
  const Component = PANELS[panelKey];
  if (!Component) return null;

  return (
    <>
    

      {/* Drawer */}
      <div
        className="fixed rounded-l-lg right-[5vw] top-0 bottom-0 z-[200] w-[320px] flex flex-col bg-white dark:bg-gray-900 shadow-2xl border-l border-gray-100 dark:border-white/10"
        style={{ animation: "slideIn 0.25s cubic-bezier(0.4,0,0.2,1)" }}
      >
        <Component onClose={onClose} />
      </div>

      <style>{`
        @keyframes fadeIn  { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideIn { from { transform: translateX(100%); } to { transform: translateX(0); } }
      `}</style>
    </>
  );
}
// ── Icon Button ──────────────────────────────────────────────
function PanelIconBtn({ icon: Icon, activeKey, myKey, badge, onClick }) {
  const isActive = activeKey === myKey;
  return (
    <button
      onClick={() => onClick(myKey)}
      className="relative w-10 h-10  cursor-pointer flex items-center justify-center rounded-2xl transition-all duration-200 bg-primary/40"
   
    >
      <Icon
        className="w-4.5 h-4.5 font-bold text-black dark:text-white"
   
      />
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
  const [activePanel,    setActivePanel]    = useState(null); // 'notification' | 'message' | 'settings'
  const [profileOpen,    setProfileOpen]    = useState(false);
  const profileRef = useRef(null);

  // Close profile dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handlePanelClick = (key) => {
    setActivePanel((prev) => (prev === key ? null : key));
    setProfileOpen(false);
  };

  const handleProfileClick = () => {
    setProfileOpen((p) => !p);
    setActivePanel(null);
  };

  return (
    <>
      {/* ── Fixed Icon Strip ─────────────────────────────── */}
      <div
        className="fixed right-0 top-5 rounded-l-[30px] bottom-4 z-[180] flex flex-col bg-white  dark:bg-[#292d4a] items-center justify-between  w-[6.5vw] h-[92vh] py-6 "
        style={{
        
        
          borderLeft: "1px solid var(--border-color, rgba(0,0,0,0.06))",
        }}
      >
        {/* Profile Photo */}
        <div ref={profileRef} className="relative mb-2">
          <button
            onClick={handleProfileClick}
            className="w-10 h-10 rounded-md cursor-pointer overflow-hidden border-4 border-double border-primary transition-all ring-text-primary duration-200"
         
          >
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRgs2DOOnn9pY67TodjACV0st9VwO1Q-ZdxOA&s"
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </button>

          {profileOpen && (
            <ProfileDropdown onClose={() => setProfileOpen(false)} />
          )}
        </div>

      
<div className="space-y-4" >
  {/* Divider */}
        <div className="w-6 h-px bg-gray-200 dark:bg-white/10" />
       {/* Notification */}
       <PanelIconBtn
          icon={FaBell}
          myKey="notification"
          activeKey={activePanel}
          badge={7}
          onClick={handlePanelClick}
        />

        {/* Message */}
        <PanelIconBtn
          icon={IoMdMail}
          myKey="message"
          activeKey={activePanel}
          badge={3}
          onClick={handlePanelClick}
/>
        {/* Settings */}
        <PanelIconBtn
          icon={FaGear }
          myKey="settings"
          activeKey={activePanel}
          badge={0}
          onClick={handlePanelClick}
        />
</div>
     

      

        {/* Language */}
        <LanguageSwitcher />
      </div>

      {/* ── Slide-in Drawer ──────────────────────────────── */}
      {activePanel && (
        <Drawer panelKey={activePanel} onClose={() => setActivePanel(null)} />
      )}
    </>
  );
}