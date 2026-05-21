import axios from "axios";
import { motion } from "framer-motion";
import { useState } from "react";
import {
  BsTrash,
  BsPencilSquare,
  BsShieldCheck,
  BsPlusLg,
} from "react-icons/bs";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";

const UserTable = ({ users = [], refreshUsers }) => {
  const [selectedUsers, setSelectedUsers] = useState([]);

  // --- Pagination State ---
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const indexOfLastUser = currentPage * itemsPerPage;
  const indexOfFirstUser = indexOfLastUser - itemsPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(users.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
      setSelectedUsers([]);
    }
  };

  // Toggle individual checkbox
  const handleCheckboxChange = (userId) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId],
    );
  };

  // Toggle "Select All"
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedUsers(currentUsers.map((u) => u.id));
    } else {
      setSelectedUsers([]);
    }
  };

  // --- Dynamic Multi-Delete Logic ---
  const handleDeleteClick = () => {
    if (selectedUsers.length === 0) {
      Swal.fire({
        title: "Oops...",
        text: "Please Select Items To Delete",
        icon: "info",
        confirmButtonColor: "var(--primary)",
      });
    } else {
      Swal.fire({
        title: "Are you sure?",
        text: `Deleting ${selectedUsers.length} users permanently!`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#ef4444",
        cancelButtonColor: "#a0aec0",
        confirmButtonText: "Delete All",
        background: document.documentElement.classList.contains("dark")
          ? "#292d4a"
          : "#fff",
        color: document.documentElement.classList.contains("dark")
          ? "#fff"
          : "#000",
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            const baseUrl =
              import.meta.env?.VITE_BACKEND_URL ||
              "https://cms-backend-ashen.vercel.app";

            await Promise.all(
              selectedUsers.map((id) =>
                axios.delete(`${baseUrl}/api/users/${id}`),
              ),
            );

            Swal.fire(
              "Deleted!",
              `${selectedUsers.length} users removed successfully.`,
              "success",
            );
            setSelectedUsers([]);  

            if (refreshUsers) refreshUsers();  
          } catch (error) {
            console.error("Batch delete failure:", error);
            Swal.fire(
              "Error!",
              "An error occurred while removing the selected users.",
              "error",
            );
          }
        }
      });
    }
  };

  // --- Single Delete Logic ---
  const handleDelete = (userId, userName) => {
    Swal.fire({
      title: "Are you sure?",
      text: `Delete ${userName}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "var(--primary)",
      confirmButtonText: "Yes, delete it!",
      background: document.documentElement.classList.contains("dark")
        ? "#292d4a"
        : "#fff",
      color: document.documentElement.classList.contains("dark")
        ? "#fff"
        : "#000",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const baseUrl =
            import.meta.env?.VITE_BACKEND_URL ||
            "https://cms-backend-ashen.vercel.app";

          await axios.delete(`${baseUrl}/api/users/${userId}`);

          Swal.fire("Deleted!", "User removed successfully.", "success");
          if (refreshUsers) refreshUsers();
        } catch (error) {
          console.error("Delete call failure:", error);
          Swal.fire(
            "Error!",
            error.response?.data?.message || "Could not remove user.",
            "error",
          );
        }
      }
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white w-full dark:bg-[#292d4a] mt-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden"
    >
      {/* Header Action Bar */}
      <div className="p-6 max-w-full flex justify-between items-center border-b border-gray-50 dark:border-gray-800">
        <h2 className="text-xl font-semibold text-primary">Users</h2>
        <div className="flex gap-3">
          <button
            onClick={handleDeleteClick}
            className="px-6 py-2 rounded-lg border border-primary text-primary font-semibold hover:bg-primary hover:text-white transition-colors"
          >
            Delete Selected
          </button>
          <Link
            to="/dashboard/add-user"
            className="flex items-center rounded-lg bg-primary text-white px-4 py-2 font-semibold shadow-lg shadow-primary/20"
          >
            ADD USER <BsPlusLg className="ml-2" />
          </Link>
        </div>
      </div>

      {/* Table */}
 <div className="">
  <table className="text-left border-collapse">
          <thead>
            <tr className="text-content-text font-semibold text-sm">
              <th className="py-4 px-2 pl-8">
                <input
                  type="checkbox"
                  onChange={handleSelectAll}
                  checked={
                    selectedUsers.length === currentUsers.length &&
                    currentUsers.length > 0
                  }
                />
              </th>
              <th className="py-4 px-2  text-sm font-medium">Email</th>
              <th className="py-4 px-2  text-sm font-medium">Gender</th>
              <th className="py-4 px-2   text-sm font-medium">Full Name</th>
              <th className="py-4 px-2  text-sm font-medium">Groups</th>
              <th className="py-4 px-2  text-sm font-medium">Mobile</th>
              <th className="py-4 px-2  text-sm font-medium">Date Of Birth</th>
              <th className="py-4 px-2  text-sm font-medium text-center">
                Status
              </th>
              <th className="py-4 px-2 text-sm font-medium">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
            {currentUsers.map((user) => (
              <tr
                key={user.id}
                className="hover:bg-gray-50/50 dark:hover:bg-white/5 transition-colors"
              >
                <td className="py-4 px-2 pl-8">
                  <input
                    type="checkbox"
                    checked={selectedUsers.includes(user.id)}
                    onChange={() => handleCheckboxChange(user.id)}
                  />
                </td>
                <td className="py-4 px-2 text-[12px] font-medium">
                  <div className="flex items-center gap-3">
                    <img
                      src={user.img}
                      className="w-10 h-10 rounded-full border border-gray-100 object-cover"
                      alt=""
                    />
                    <span className="font-medium text-gray-600 dark:text-gray-300">
                      {user.name}
                    </span>
                  </div>
                </td>
                <td className="py-4 px-2 text-[12px] font-semibold text-gray-700 dark:text-gray-200">
                  {user.email}
                </td>
                <td className="py-4 px-2 text-[12px] text-gray-500">
                  {user.gender}
                </td>
                <td className="py-4 px-2 text-[12px]">
                  <span
                    className="px-3 py-1 rounded-full text-xs text-white font-medium"
                    style={{ backgroundColor: "var(--primary)" }}
                  >
                    {user.group}
                  </span>
                </td>
                <td className="py-4 px-2 text-[12px] text-gray-500">
                  {user.mobile}
                </td>
                <td className="py-4 px-2 text-[12px] text-gray-500">
                  {user.dob}
                </td>
                <td className="py-4 px-2 text-[12px] text-center">
                  <div
                    className={`w-3 h-3 rounded-full mx-auto ${user.status === "Active" ? "bg-green-500" : "bg-red-400"}`}
                  ></div>
                </td>
                <td className="py-4 px-2 text-[12px]">
                  <div className="flex gap-2">
                    <Link
                      to={`/dashboard/users/assign-permissions-to-user/${user.id}`}
                      className="p-2 bg-emerald-100 text-emerald-600 rounded-lg hover:bg-emerald-200 transition-colors"
                    >
                      <BsShieldCheck size={16} />
                    </Link>
                    <Link
                      to={`/dashboard/edit-user/${user.id}`}
                      className="p-2 cursor-pointer bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors"
                    >
                      <BsPencilSquare size={16} />
                    </Link>
                    <button
                      onClick={() => handleDelete(user.id, user.name)}
                      className="p-2 cursor-pointer bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
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

      {/* Pagination Footer */}
      <div className="p-6 flex justify-between items-center text-sm text-content-text font-medium">
        <span>
          Page {currentPage} of {totalPages || 1}.
        </span>
        <div className="flex items-center gap-2">
          <button
            disabled={currentPage === 1}
            onClick={() => handlePageChange(currentPage - 1)}
            className={`p-2 border rounded-lg transition-colors ${currentPage === 1 ? "opacity-50 cursor-not-allowed" : "hover:bg-primary hover:text-white cursor-pointer"}`}
          >
            <IoChevronBack />
          </button>

          {/* Page Numbers */}
          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index + 1}
              onClick={() => handlePageChange(index + 1)}
              className={`w-8 h-8 flex items-center justify-center rounded-lg font-semibold transition-all ${
                currentPage === index + 1
                  ? "bg-primary text-white shadow-md shadow-primary/30 scale-110"
                  : "border hover:bg-primary/10"
              }`}
            >
              {index + 1}
            </button>
          ))}

          <button
            disabled={currentPage === totalPages || totalPages === 0}
            onClick={() => handlePageChange(currentPage + 1)}
            className={`p-2 border rounded-lg transition-colors ${currentPage === totalPages || totalPages === 0 ? "opacity-50 cursor-not-allowed" : "hover:bg-primary hover:text-white cursor-pointer"}`}
          >
            <IoChevronForward />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default UserTable;
