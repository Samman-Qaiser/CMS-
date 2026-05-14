import { useState } from "react";
import { LuStar, LuChevronLeft, LuChevronRight } from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import { EmailLayout } from "../layout/EmailLayout";
import { emails } from "../components/Email";

const EmailInbox = () => {
  const navigate = useNavigate();
  const [activeDropdown, setActiveDropdown] = useState(null);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const emailsPerPage = 7;

  const toggleDropdown = (name) =>
    setActiveDropdown(activeDropdown === name ? null : name);

  // get current emails
  const indexOfLastEmail = currentPage * emailsPerPage;
  const indexOfFirstEmail = indexOfLastEmail - emailsPerPage;
  const currentEmails = emails.slice(indexOfFirstEmail, indexOfLastEmail);
  const totalPages = Math.ceil(emails.length / emailsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <EmailLayout
      activeDropdown={activeDropdown}
      toggleDropdown={toggleDropdown}
    >
      <div className="divide-y divide-gray-100 dark:divide-gray-700">
        {currentEmails.map((email) => (
          <div
            key={email.id}
            onClick={() => navigate(`/dashboard/email-read/${email.id}`)}
            className="flex items-center gap-4 px-2 py-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer transition-colors group"
          >
            <input
              type="checkbox"
              className="w-4 h-4 rounded border-gray-300 accent-primary"
              onClick={(e) => e.stopPropagation()}
            />
            <LuStar
              size={18}
              className={
                email.important
                  ? "text-yellow-400 fill-yellow-400"
                  : "text-gray-300"
              }
            />
            <div className="flex-1 grid grid-cols-12 gap-4 items-center">
              <span className="col-span-3 text-sm font-medium text-gray-700 dark:text-gray-200 truncate">
                {email.sender}
              </span>
              <span className="col-span-7 text-sm text-gray-500 dark:text-gray-400 truncate">
                {email.subject}
              </span>
              <span className="col-span-2 text-xs text-right text-gray-400">
                {email.time}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination UI */}
      <div className="flex flex-col sm:flex-row justify-between items-center pt-6 mt-4 border-t border-gray-100 dark:border-gray-700 gap-4">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Showing{" "}
          <span className="font-semibold text-gray-700 dark:text-white">
            {indexOfFirstEmail + 1}
          </span>{" "}
          to{" "}
          <span className="font-semibold text-gray-700 dark:text-white">
            {Math.min(indexOfLastEmail, emails.length)}
          </span>{" "}
          of{" "}
          <span className="font-semibold text-gray-700 dark:text-white">
            {emails.length}
          </span>{" "}
          entries
        </p>

        <div className="flex items-center gap-1">
          <button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
            className="p-2 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <LuChevronLeft size={20} />
          </button>

          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => paginate(i + 1)}
              className={`w-10 h-10 rounded-lg text-sm font-medium transition-all ${
                currentPage === i + 1
                  ? "bg-primary text-white shadow-md shadow-primary/20"
                  : "text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800 border border-transparent hover:border-gray-200"
              }`}
            >
              {i + 1}
            </button>
          ))}

          <button
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="p-2 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <LuChevronRight size={20} />
          </button>
        </div>
      </div>
    </EmailLayout>
  );
};

export default EmailInbox;
