import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { BsPencilSquare, BsTrash } from "react-icons/bs";
import { HiUsers } from "react-icons/hi";
import { HiLockClosed } from "react-icons/hi2";
import Swal from "sweetalert2";
import axios from "axios";

const Groups = () => {
  const [loading, setLoading] = useState(true);
  const [roleCounts, setRoleCounts] = useState({
    admin: 0,
    manager: 0,
    customer: 0,
  });

  // 1. Define base structural blueprints for groups
  const [groups, setGroups] = useState([
    { id: 1, name: "Admin", userCount: 0, permsCount: 80 },
    { id: 2, name: "Manager", userCount: 0, permsCount: 4 },
    { id: 3, name: "Customer", userCount: 0, permsCount: 0 },
  ]);

  const fetchGroupMetrics = async () => {
    setLoading(true);
    const baseUrl =
      import.meta.env?.VITE_BACKEND_URL ||
      "https://cms-backend-ashen.vercel.app";

    try {
      // 2. Fetch the current master list of users
      const response = await axios.get(`${baseUrl}/api/users`);
      const rawUsers = response.data?.users || response.data || [];

      // 3. Compute structural frequency counts matching role string permutations
      const counts = rawUsers.reduce(
        (acc, user) => {
          const role = (user.role || "").toLowerCase().trim();
          if (role === "admin") acc.admin += 1;
          if (role === "manager") acc.manager += 1;
          if (role === "customer") acc.customer += 1;
          return acc;
        },
        { admin: 0, manager: 0, customer: 0 },
      );

      // 4. Map calculated real-time figures into your component array layout
      setGroups((prevGroups) =>
        prevGroups.map((g) => {
          const lookupKey = g.name.toLowerCase();
          return {
            ...g,
            userCount: counts[lookupKey] ?? 0,
          };
        }),
      );
    } catch (error) {
      console.error(
        "Error aggregating real-time user-group metrics:",
        error.response?.data || error.message,
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGroupMetrics();
  }, []);

  const handleDelete = (name) => {
    Swal.fire({
      title: "Are you sure?",
      text: `Delete the ${name} group?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      confirmButtonText: "Yes, delete it!",
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-[#292d4a] rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden"
    >
      <div className="p-6 flex justify-between items-center border-b border-gray-50 dark:border-gray-800">
        <h2 className="text-xl font-bold text-primary">Manage Groups</h2>
        <Link
          to="/dashboard/add-group"
          className="flex items-center rounded-lg bg-primary text-white px-4 py-2 font-bold shadow-lg"
        >
          ADD GROUP +
        </Link>
      </div>

      {loading ? (
        <div className="p-12 text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-sm font-semibold text-gray-500">
            Calculating group metrics...
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto p-6">
          <table className="w-full text-left">
            <thead>
              <tr className="text-gray-500 text-sm border-b border-gray-100 dark:border-gray-800">
                <th className="pb-4 px-4 font-medium">Group Name</th>
                <th className="pb-4 px-4 font-medium text-center">
                  User Count
                </th>
                <th className="pb-4 px-4 font-medium text-center">
                  Perms Count
                </th>
                <th className="pb-4 px-4 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
              {groups.map((group) => (
                <tr
                  key={group.id}
                  className="hover:bg-gray-50/50 dark:hover:bg-white/5 transition-colors"
                >
                  <td className="py-3 border-b border-content-text/20 px-4 text-gray-600 dark:text-gray-300 text-xs">
                    {group.name}
                  </td>
                  <td className="py-3 border-b border-content-text/20 px-4 text-center">
                    <span className="inline-flex items-center gap-1.5 bg-primary text-white px-3 py-1 rounded-full text-xs font-bold">
                      <HiUsers /> {group.userCount}
                    </span>
                  </td>
                  <td className="py-3 border-b border-content-text/20 px-4 text-center">
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold text-white ${
                        group.permsCount > 0 ? "bg-[#4CBC9A]" : "bg-gray-500"
                      }`}
                    >
                      <HiLockClosed /> {group.permsCount}
                    </span>
                  </td>
                  <td className="py-3 border-b border-content-text/20 px-4">
                    <div className="flex justify-end gap-2">
                      <Link
                        to={`/dashboard/edit-group-permissions/${group.name}`}
                        className="p-2 bg-primary text-white rounded-lg transition-colors shadow-sm"
                      >
                        <BsPencilSquare size={15} />
                      </Link>
                      <button
                        onClick={() => handleDelete(group.name)}
                        className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors shadow-sm"
                      >
                        <BsTrash size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </motion.div>
  );
};

export default Groups;
