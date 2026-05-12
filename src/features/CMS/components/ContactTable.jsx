import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { BsTrash, BsPencilSquare, BsEye, BsX } from "react-icons/bs";
import Swal from "sweetalert2";

const ContactTable = ({ contacts = [], onEdit }) => {
  const [selectedContact, setSelectedContact] = useState(null);
  const confirmDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      confirmButtonText: "Delete",
    }).then((result) => {
      if (result.isConfirmed) console.log("deleted id", id);
    });
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
              {contacts.map((contact) => (
                <tr
                  key={contact.id}
                  className="hover:bg-gray-50/50 dark:hover:bg-white/5 transition-colors"
                >
                  <td className="py-4 px-6 text-sm font-medium">
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
                        className="p-2 bg-blue-50 text-blue-500 rounded-lg hover:bg-blue-500 hover:text-white transition-all"
                      >
                        <BsEye size={16} />
                      </button>
                      <button
                        onClick={() => onEdit(contact)}
                        className="p-2 bg-primary/10 text-primary rounded-lg hover:bg-primary hover:text-white transition-all"
                      >
                        <BsPencilSquare size={16} />
                      </button>
                      <button
                        onClick={() => confirmDelete(contact.id)}
                        className="p-2 bg-red-50 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-all"
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
      </motion.div>
      <AnimatePresence>
        {selectedContact && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedContact(null)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            {/* Modal Content */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-lg bg-white dark:bg-[#292d4a] rounded-xl shadow-2xl overflow-hidden"
            >
              {/* Header */}
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
              {/* Body */}
              <div className="p-8 space-y-4">
                <p className="text-lg font-bold text-content-text">
                  {selectedContact.name}
                </p>
                <p className="text-md font-semibold text-content-text">
                  {selectedContact.email}
                </p>
                <p className="text-md font-semibold text-content-text">
                  {selectedContact.phone}
                </p>
                <p className="text-md font-medium text-content-text leading-relaxed pt-2">
                  {selectedContact.message}
                </p>
              </div>
              {/* Footer */}
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
