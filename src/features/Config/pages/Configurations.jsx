import { BiEditAlt } from "react-icons/bi";
import { BsTrash } from "react-icons/bs"; 
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { config } from "../components/config";

const Configurations = () => {
  const handleDelete = (itemName) => {
    Swal.fire({
      title: "Are you sure?",
      text: `You are about to delete "${itemName}". This action cannot be undone!`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "var(--primary)",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
      background: document.documentElement.classList.contains("dark")
        ? "#292d4a"
        : "#fff",
      color: document.documentElement.classList.contains("dark")
        ? "#fff"
        : "#545454",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "Deleted!",
          text: "Your configuration has been deleted (simulated).",
          icon: "success",
          background: document.documentElement.classList.contains("dark")
            ? "#292d4a"
            : "#fff",
          color: document.documentElement.classList.contains("dark")
            ? "#fff"
            : "#545454",
        });
      }
    });
  };
  return (
    <div className="bg-white dark:bg-[#292d4a] rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
      {/* Table Header Section */}
      <div className="py-6  px-8 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
        <h3 className="text-primary font-medium text-xl">Configurations</h3>
        <div className="flex gap-3">
          <button className="px-4 py-2 border border-primary text-primary font-semibold rounded-lg hover:bg-primary hover:text-white transition-all active:scale-95">
            Reset Config
          </button>
          <Link
            to="/dashboard/configurations/add-config"
            className="px-4 py-2 bg-primary text-white font-semibold rounded-lg hover:opacity-90 transition-all active:scale-95 shadow-md shadow-primary/20"
          >
            Add Config
          </Link>
        </div>
      </div>

      {/* Table Section */}
      <div className="overflow-x-auto px-8">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="text-gray-400 uppercase text-sm tracking-wider">
              <th className="px-5 py-3 font-bold">Name</th>
              <th className="px-5 py-3 font-bold">Value</th>
              <th className="px-5 py-3 font-bold text-right md:text-center">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700 text-xs ">
            {config.map((item, index) => (
              <tr
                key={index}
                className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group"
              >
                <td className="px-5 py-3 text-content-text font-medium">
                  {item.name}
                </td>
                <td className="px-5 py-3 text-content-text">{item.value}</td>
                <td className="px-5 py-3">
                  <div className="flex items-center justify-end md:justify-center gap-2">
                    <Link
                      to={`/dashboard/configurations/edit-config/${item.id}`}
                      state={{ editData: item }}
                      className="p-2 bg-primary/10 text-primary cursor-pointer rounded-lg shadow-sm hover:bg-primary/20 transition-all"
                    >
                      <BiEditAlt size={16} />
                    </Link>
                    <button
                      onClick={() => handleDelete(item.name)}
                      className="p-2 bg-red-100 text-red-600 cursor-pointer rounded-lg hover:bg-red-200 transition-all"
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
    </div>
  );
};

export default Configurations;
