import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import {
  BsTrash,
  BsPencilSquare,
  BsEye,
  BsX,
  BsChevronLeft,
  BsChevronRight,
} from "react-icons/bs";
import Swal from "sweetalert2";

const ContactTable = ({ contacts = [], onEdit, onDelete }) => {
  const [selectedContact, setSelectedContact] = useState(null);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;  

  // Pagination Logic
  const totalPages = Math.ceil(contacts.length / itemsPerPage) || 1;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = contacts.slice(indexOfFirstItem, indexOfLastItem);

  const confirmDelete = (id) => {
    console.log("ID to delete:", id);
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed && onDelete) {
        onDelete(id);
      }
    });
  };

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  return (
    <div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white dark:bg-[#292d4a] rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden"
      >
        <div className="p-6 border-b border-gray-50 dark:border-gray-800">
          <h2 className="text-xl font-semibold text-primary">All Contacts</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-gray-400 text-sm font-semibold border-b border-gray-50 dark:border-gray-800">
                <th className="py-4 px-6">Name</th>
                <th className="py-4 px-2">Email</th>
                <th className="py-4 px-2">Phone</th>
                <th className="py-4 px-2">Message</th>
                <th className="py-4 px-2 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
              {currentItems.map((contact) => (
                <tr
                  key={contact._id}
                  className="hover:bg-gray-50/50 dark:hover:bg-white/5 transition-colors"
                >
                  <td className="py-4 px-6 text-sm font-medium text-gray-700 dark:text-gray-200">
                    {contact.name}
                  </td>
                  <td className="py-4 px-2 text-sm text-gray-500">
                    {contact.email}
                  </td>
                  <td className="py-4 px-2 text-sm text-gray-500">
                    {contact.phone}
                  </td>
                  <td className="py-4 px-2 text-sm text-gray-500 truncate max-w-[200px]">
                    {contact.message}
                  </td>
                  <td className="py-4 px-2">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => setSelectedContact(contact)}
                        className="p-2 bg-primary/10 text-primary rounded-lg hover:bg-primary hover:text-white transition-all shadow-sm"
                      >
                        <BsEye size={16} />
                      </button>
                      {/* <button
                        onClick={() => onEdit(contact)}
                        className="p-2 bg-primary/10 text-primary rounded-lg hover:bg-primary hover:text-white transition-all shadow-sm"
                      >
                        <BsPencilSquare size={16} />
                      </button> */}
                      <button
                        onClick={() => confirmDelete(contact._id)}
                        className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all shadow-sm"
                      >
                        <BsTrash size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* --- Pagination Footer  --- */}
        <div className="p-6 flex items-center justify-between border-t border-gray-50 dark:border-gray-800">
          <p className="text-sm text-gray-400">
            Page {currentPage} of {totalPages}.
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`p-2 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all disabled:opacity-30`}
            >
              <BsChevronLeft size={14} className="text-gray-400" />
            </button>
            <button className="w-10 h-10 flex items-center justify-center bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/30">
              {currentPage}
            </button>

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`p-2 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all disabled:opacity-30`}
            >
              <BsChevronRight size={14} className="text-gray-400" />
            </button>
          </div>
        </div>
      </motion.div>

      {/* Contact detail modal */}
      <AnimatePresence>
        {selectedContact && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedContact(null)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-lg bg-white dark:bg-[#292d4a] rounded-xl shadow-2xl overflow-hidden"
            >
              <div className="flex items-center justify-between p-5 border-b dark:border-gray-700">
                <h3 className="text-lg font-bold text-gray-700 dark:text-gray-200">
                  Contact Info
                </h3>
                <button
                  onClick={() => setSelectedContact(null)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors"
                >
                  <BsX size={24} />
                </button>
              </div>
              <div className="p-8 space-y-4">
                <p className="text-lg font-bold text-gray-800 dark:text-white">
                  {selectedContact.name}
                </p>
                <p className="text-md font-semibold text-gray-600 dark:text-gray-300">
                  {selectedContact.email}
                </p>
                <p className="text-md font-semibold text-gray-600 dark:text-gray-300">
                  {selectedContact.phone}
                </p>
                <p className="text-md font-medium text-gray-600 dark:text-gray-400 leading-relaxed pt-2">
                  {selectedContact.message}
                </p>
              </div>
              <div className="p-5 flex justify-end">
                <button
                  onClick={() => setSelectedContact(null)}
                  className="px-8 py-2.5 bg-red-200 hover:bg-red-300 text-red-600 font-bold rounded-lg transition-colors"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ContactTable;
