import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LuPencilLine } from "react-icons/lu";
import { FaRegTrashAlt } from "react-icons/fa";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";
import { allPermissions } from "../components/permissionsData";
import Swal from "sweetalert2";

const Permissions = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 7;

  const totalPages = Math.ceil(allPermissions.length / rowsPerPage);

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = allPermissions.slice(indexOfFirstRow, indexOfLastRow);

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handleDelete = (id, name) => {
    Swal.fire({
      title: "Are you sure?",
      text: `You are about to delete the permission: "${name}"`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      confirmButtonText: "Yes, delete it!",
      customClass: {
        popup: "rounded-2xl",
        confirmButton: "rounded-lg px-6 py-2",
        cancelButton: "rounded-lg px-6 py-2",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        console.log(`Deleting permission with ID: ${id}`);
        Swal.fire({
          title: "Deleted!",
          text: "The permission has been removed.",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
          customClass: {
            popup: "rounded-2xl",
          },
        });
      }
    });
  };
  return (
    <div className="bg-white dark:bg-[#292d4a] rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
      <div className="p-6 border-b border-gray-50 dark:border-gray-800">
        <h2 className="text-xl font-bold text-primary">Permissions</h2>
      </div>

      <div className="overflow-x-auto p-4">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="text-gray-400 text-sm font-medium border-b border-gray-50 dark:border-gray-800">
              <th className="py-4 px-4">Name</th>
              <th className="py-4 px-4 ">Code Name</th>
              <th className="py-4 px-4">Content Type</th>
              <th className="py-4 px-4 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 dark:text-gray-300 text-sm">
            {currentRows.map((item) => (
              <tr
                key={item.id}
                className="border-b border-gray-50 dark:border-gray-800 hover:bg-gray-50/50 dark:hover:bg-white/5 transition-colors"
              >
                <td className="py-4 px-4">{item.name}</td>
                <td className="py-4 px-4 ">
                  <span className="bg-primary text-white px-3 py-1 rounded-lg text-xs font-semibold shadow-sm">
                    {item.code}
                  </span>
                </td>
                <td className="py-4 px-4 text-gray-400">{item.type}</td>
                <td className="py-4 px-4">
                  <div className="flex justify-center items-center gap-2">
                    <button
                      onClick={() =>
                        navigate(`/dashboard/edit-permissions/${item.id}`)
                      }
                      className="p-2 bg-[#4CBC9A] text-white rounded-lg hover:bg-[#3a9b7e] transition-all"
                    >
                      <LuPencilLine size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id, item.name)}
                      className="p-2 bg-[#FF5C5C] text-white rounded-lg hover:bg-red-600 transition-all"
                    >
                      <FaRegTrashAlt size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Section */}
      <div className="p-6 flex items-center justify-between border-t border-gray-50 dark:border-gray-800">
        <span className="text-sm text-gray-400">
          Page {currentPage} of {totalPages}.
        </span>
        <div className="flex items-center gap-2">
          {/* Previous Button */}
          <button
            onClick={handlePrev}
            disabled={currentPage === 1}
            className={`p-2 border border-gray-200 rounded-lg transition-all ${currentPage === 1 ? "text-gray-200 cursor-not-allowed" : "text-gray-400 hover:bg-gray-50"}`}
          >
            <MdChevronLeft size={20} />
          </button>

          {/* Page Numbers */}
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
            <button
              key={num}
              onClick={() => setCurrentPage(num)}
              className={`w-10 h-10 rounded-lg font-medium transition-all ${
                currentPage === num
                  ? "bg-primary text-white shadow-md"
                  : "text-gray-400 border border-gray-100 hover:bg-gray-50"
              }`}
            >
              {num}
            </button>
          ))}

          {/* Next Button */}
          <button
            onClick={handleNext}
            disabled={currentPage === totalPages}
            className={`p-2 border border-gray-200 rounded-lg transition-all ${currentPage === totalPages ? "text-gray-200 cursor-not-allowed" : "text-gray-400 hover:bg-gray-50"}`}
          >
            <MdChevronRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Permissions;
