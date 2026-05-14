import { useLocation } from "react-router-dom";

const EmailHeader = () => {
  const location = useLocation();
  const getPageName = (path) => {
    if (path.includes("email-inbox")) return "Inbox";
    if (path.includes("email-read")) return "Read";
    if (path.includes("email-compose")) return "Compose";
    return "Inbox";
  };

  const pageName = getPageName(location.pathname);

  return (
    <div className="bg-white dark:bg-[#292d4a] p-4 rounded-xl shadow-sm mb-6 border border-gray-100 dark:border-gray-700 animate-fadeIn">
      <h3 className="flex items-center gap-2 font-medium">
        <span className="text-primary font-bold">Email</span>
        <span className="text-gray-400 font-light">/</span>
        <span className="text-gray-500 dark:text-gray-300 font-normal">
          {pageName}
        </span>
      </h3>
    </div>
  );
};

export default EmailHeader;
