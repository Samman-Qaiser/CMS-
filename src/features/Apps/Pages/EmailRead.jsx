import { useState } from "react";
import { useParams } from "react-router-dom";
import { LuReply, LuForward, LuTrash2, LuDownload } from "react-icons/lu";
import { EmailLayout } from "../layout/EmailLayout";
import { emails } from "../components/Email";

const EmailRead = () => {
  const { id } = useParams();
  const [activeDropdown, setActiveDropdown] = useState(null);

  // Finding specific email based on the ID from the URL
  const emailData = emails.find((e) => e.id === parseInt(id));

  const toggleDropdown = (name) =>
    setActiveDropdown(activeDropdown === name ? null : name);

  // Fallback if email is not found
  if (!emailData) {
    return (
      <EmailLayout
        activeDropdown={activeDropdown}
        toggleDropdown={toggleDropdown}
      >
        <div className="p-10 text-center text-gray-500">Email not found.</div>
      </EmailLayout>
    );
  }

  return (
    <EmailLayout
      activeDropdown={activeDropdown}
      toggleDropdown={toggleDropdown}
    >
      {/* Header Section */}
      <div className="flex justify-between items-start mb-8">
        <div className="flex gap-4">
          <img
            src={`https://i.pravatar.cc/150?u=${emailData.sender}`}
            alt="Avatar"
            className="w-16 h-16 rounded-full border-4 border-white dark:border-gray-700 shadow-sm"
          />
          <div>
            <h2 className="text-xl font-bold text-primary">
              {emailData.sender}
            </h2>
            <p className="text-sm text-gray-400">{emailData.date}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="p-2.5 rounded-lg bg-red-50 text-primary hover:bg-red-100 transition-colors">
            <LuReply size={20} />
          </button>
          <button className="p-2.5 rounded-lg bg-red-50 text-primary hover:bg-red-100 transition-colors">
            <LuForward size={20} />
          </button>
          <button className="p-2.5 rounded-lg bg-red-50 text-primary hover:bg-red-100 transition-colors">
            <LuTrash2 size={20} />
          </button>
        </div>
      </div>

      <div className="space-y-6 text-gray-600 dark:text-gray-300 leading-relaxed">
        <div className="border-t border-gray-100 dark:border-gray-700 pt-6">
          <p className="text-xs text-gray-400 mb-2">{emailData.time}</p>
          <h3 className="text-lg font-bold text-primary mb-1">
            {emailData.subject}
          </h3>
          <p className="text-sm text-gray-400 mb-6">
            To: {emailData.recipient}
          </p>

          <p className="font-bold mb-4">Hi,</p>
          <div className="whitespace-pre-line mb-4">{emailData.body}</div>
        </div>

        <div className="pt-4">
          <p className="font-bold">Kind Regards</p>
          <p className="text-sm">{emailData.sender.split(" ")[0]}</p>
        </div>

        {/* Attachments Section */}
        {emailData.attachments && emailData.attachments.length > 0 && (
          <div className="border-t border-gray-100 dark:border-gray-700 pt-6">
            <div className="flex items-center gap-2 font-bold text-gray-700 dark:text-gray-200 mb-4">
              <LuDownload size={18} /> Attachments (
              {emailData.attachments.length})
            </div>
            <div className="flex flex-wrap gap-6 text-sm text-gray-400">
              {emailData.attachments.map((file, index) => (
                <span
                  key={index}
                  className={
                    index !== 0
                      ? "border-l border-gray-300 dark:border-gray-600 pl-6"
                      : ""
                  }
                >
                  {file}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="pt-6">
          <textarea
            placeholder={`Reply to ${emailData.sender}...`}
            className="w-full p-6 rounded-2xl border border-gray-100 dark:border-gray-700 dark:bg-transparent outline-none focus:border-red-200 min-h-[150px] resize-none"
          />
          <div className="flex justify-end mt-4">
            <button className="px-10 py-2.5 bg-primary text-white font-bold rounded-lg shadow-lg hover:opacity-90 transition-all">
              Send
            </button>
          </div>
        </div>
      </div>
    </EmailLayout>
  );
};

export default EmailRead;
