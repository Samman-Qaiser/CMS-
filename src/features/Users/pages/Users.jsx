import { useState, useEffect } from "react";
import UserFilter from "../components/UserFilter";
import UserTable from "../components/UserTable";
import axios from "axios";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    email: "",
    mobile: "",
    group: "Select Group",
  });

  // Fetch all users on component load
  const fetchUsers = async () => {
    setLoading(true);
    const baseUrl =
      import.meta.env?.VITE_BACKEND_URL ||
      "https://cms-backend-ashen.vercel.app";

    try {
      const response = await axios.get(`${baseUrl}/api/users`);

      // Access the array of users 
      const rawUsers = response.data?.users || response.data || [];

      const mappedUsers = rawUsers.map((user) => ({
        id: user._id || user.id, 
        name:
          `${user.firstName || ""} ${user.lastName || ""}`.trim() ||
          "Unnamed User",
        email: user.email || "",
        gender: user.gender
          ? user.gender.charAt(0).toUpperCase() + user.gender.slice(1)
          : "N/A",
        group: user.role
          ? user.role.charAt(0).toUpperCase() + user.role.slice(1)
          : "User", // converts to lowercase string and capitalizes first letter
        mobile: user.phoneNumber || "",
        dob: user.dateOfBirth ? user.dateOfBirth.split("T")[0] : "N/A",
        status: user.isActive ? "Active" : "Inactive",
        img: user.profileImage || "https://i.pravatar.cc/150?u=fallback",
      }));

      setUsers(mappedUsers);
    } catch (error) {
      console.error(
        "Error pulling live user records:",
        error.response?.data || error.message,
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = users.filter((user) => {
    const matchEmail = (user.email || "")
      .toLowerCase()
      .includes((filters.email || "").toLowerCase().trim());

    const matchMobile = (user.mobile || "")
      .replace(/\s+/g, "") // removing spacing strings
      .includes((filters.mobile || "").trim());

    const matchGroup =
      !filters.group ||
      filters.group === "Select Group" ||
      (user.group || "").toLowerCase() === filters.group.toLowerCase();

    return matchEmail && matchMobile && matchGroup;
  });

  return (
    <div>
      <div className="flex flex-col gap-6">
        <UserFilter onFilter={setFilters} />

        {loading ? (
          <div className="bg-white dark:bg-[#292d4a] mt-6 rounded-2xl p-12 text-center border border-gray-100 dark:border-gray-700">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto mb-4"></div>
            <p
              className="text-sm font-semibold"
              style={{ color: "var(--content-text)" }}
            >
              Loading users data...
            </p>
          </div>
        ) : (
          <UserTable users={filteredUsers} refreshUsers={fetchUsers} />
        )}
      </div>
    </div>
  );
};

export default Users;
