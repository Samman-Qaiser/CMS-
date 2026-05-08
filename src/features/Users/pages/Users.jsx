import { useState } from "react";
import UserFilter from "../components/UserFilter";
import UserTable from "../components/UserTable";

const Users = () => {
  const [filters, setFilters] = useState({
    email: "",
    mobile: "",
    group: "Select Group",
  });

  const allUsers = [
    {
      id: 1,
      name: "Khesh Mehra",
      email: "manager@example.com",
      gender: "Male",
      group: "Manager",
      mobile: "9652588652",
      dob: "1996-08-24",
      status: "Active",
      img: "https://i.pravatar.cc/150?u=1",
    },
    {
      id: 2,
      name: "Ravi Sharma",
      email: "customer@example.com",
      gender: "Male",
      group: "Customer",
      mobile: "9654752251",
      dob: "10-Aug-1996",
      status: "Active",
      img: "https://i.pravatar.cc/150?u=2",
    },
    {
      id: 3,
      name: "Gaurav Nagar",
      email: "admin@example.com",
      gender: "Male",
      group: "Admin",
      mobile: "9785255135",
      dob: "1996-08-24",
      status: "Active",
      img: "https://i.pravatar.cc/150?u=3",
    },
  ];

  const filteredUsers = allUsers.filter((user) => {
    const matchEmail = user.email
      .toLowerCase()
      .includes(filters.email.toLowerCase());
    const matchMobile = user.mobile.includes(filters.mobile);
    const matchGroup =
      filters.group === "Select Group" || user.group === filters.group;
    return matchEmail && matchMobile && matchGroup;
  });

  return (
    <div>
      <div className="flex flex-col gap-6">
        <UserFilter onFilter={setFilters} />
        <UserTable users={filteredUsers} />
      </div>
    </div>
  );
};

export default Users;
