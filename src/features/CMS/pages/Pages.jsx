import { useState, useEffect } from "react";
import PageFilter from "../components/PageFilter";
import PageTable from "../components/PageTable";
import axios from "axios";
import Swal from "sweetalert2";

const Pages = () => {
  const [pages, setPages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({
    title: "",
    status: "Select Status",
    date: "",
  });

  const baseUrl =
    import.meta.env?.VITE_BACKEND_URL || "https://cms-backend-ashen.vercel.app";

  const fetchPages = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${baseUrl}/api/pages`);
      if (response.data && response.data.pages) {
        setPages(response.data.pages);
      }
    } catch (error) {
      console.error("Error fetching pages:", error);
      Swal.fire({
        icon: "error",
        title: "Failed to load pages",
        text:
          error.response?.data?.message ||
          "Could not retrieve collections from the database.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // --- Initial Mount Load ---
  useEffect(() => {
    fetchPages();
  }, [baseUrl]);

  // --- Filter Logic ---
  const filteredPages = pages.filter((page) => {
    const matchTitle = (page.title || "")
      .toLowerCase()
      .includes(filters.title.toLowerCase());
    const matchStatus =
      filters.status === "Select Status" || page.status === filters.status;
    return matchTitle && matchStatus;
  });

  return (
    <div>
      <div className="flex flex-col gap-6">
        <PageFilter onFilter={setFilters} />
        {isLoading ? (
          <div className="flex justify-center items-center h-48 bg-white dark:bg-[#292d4a] rounded-2xl border border-gray-100 dark:border-gray-700">
            <span className="text-primary font-semibold animate-pulse">
              Loading Pages...
            </span>
          </div>
        ) : (
          /* FIXED: Handed over the refresh callback invocation trigger directly to the table */
          <PageTable pages={filteredPages} onRefresh={fetchPages} />
        )}
      </div>
    </div>
  );
};

export default Pages;
