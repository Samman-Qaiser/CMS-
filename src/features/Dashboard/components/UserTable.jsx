import { motion } from "framer-motion";
import {
  BsTrash,
  BsPencilSquare,
  BsShieldCheck,
  BsPlusLg,
} from "react-icons/bs";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";
import { Link } from "react-router-dom";

const UserTable = ({ users }) => {
 

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-[#292d4a] rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden"
    >
      {/* Table Header Action Bar */}
      <div className="p-6 flex justify-between items-center border-b border-gray-50 dark:border-gray-800">
        <h2 className="text-xl font-semibold text-primary">Users</h2>
        <div className="flex gap-3">
          <button className="px-6 py-2 rounded-lg border border-primary text-primary font-semibold hover:bg-red-50 transition-colors">
            Delete
          </button>
          <Link
            to="/dashboard/add-user"
            className="flex items-center rounded-lg overflow-hidden bg-primary shadow-lg shadow-primary/20"
          >
            <span className=" flex gap-2 items-center text-white px-4 py-2 font-semibold">
              ADD USER
              <BsPlusLg />
            </span>
          </Link>
        </div>
      </div>

      {/* Table Wrapper */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="text-content-text font-semibold text-sm">
              <th className="py-4 px-2 pl-8">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-gray-300"
                />
              </th>
              <th className="py-4 px-2 text-sm font-medium">Full Name</th>
              <th className="py-4 px-2 text-sm font-medium">Email</th>
              <th className="py-4 px-2 text-sm font-medium">Gender</th>
              <th className="py-4 px-2 text-sm font-medium">Groups</th>
              <th className="py-4 px-2 text-sm font-medium">Mobile</th>
              <th className="py-4 px-2 text-sm font-medium">Date Of Birth</th>
              <th className="py-4 px-2 text-sm font-medium">Status</th>
              <th className="py-4 px-2 text-sm font-medium">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
            {users.map((user) => (
              <tr
                key={user.id}
                className="hover:bg-gray-50/50 dark:hover:bg-white/5 transition-colors"
              >
                <td className="py-4 px-2 text-[12px] font-medium pl-8">
                  <input type="checkbox" className="w-4 h-4 rounded" />
                </td>
                <td className="py-4 px-2 text-[12px] font-medium">
                  <div className="flex items-center gap-3">
                    <img
                      src={user.img}
                      className="w-10 h-10 rounded-full border border-gray-100"
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
                    className={`px-3 py-1 rounded-full text-xs text-white font-medium`}
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
                  <div className="w-3 h-3 rounded-full bg-green-500 mx-auto"></div>
                </td>
                <td className="py-4 px-2 text-[12px]">
                  <div className="flex gap-2">
                    <button className="p-2 bg-emerald-100 text-emerald-600 rounded-lg hover:bg-emerald-200 transition-colors">
                      <BsShieldCheck size={16} />
                    </button>
                    <button className="p-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors">
                      <BsPencilSquare size={16} />
                    </button>
                    <button className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors">
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
        <span>Page 1 of 1.</span>
        <div className="flex items-center gap-2">
          <button className="p-2 hover:bg-primary cursor-pointer border rounded-lg hover:text-gray-50">
            <IoChevronBack />
          </button>
          <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-primary text-white font-semibold shadow-md shadow-primary/30">
            1
          </button>
          <button className="p-2 hover:bg-primary cursor-pointer border rounded-lg hover:text-gray-50">
            <IoChevronForward />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default UserTable;
