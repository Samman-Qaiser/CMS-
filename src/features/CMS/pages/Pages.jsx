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

  useEffect(() => {
    fetchPages();
  }, [baseUrl]);

  const filteredPages = pages.filter((page) => {
    // Title matching
    const matchTitle = (page.title || "")
      .toLowerCase()
      .includes(filters.title.toLowerCase());

    // Status matching  
    const matchStatus =
      filters.status === "Select Status" ||
      (page.status || "").toLowerCase() === filters.status.toLowerCase();

    // Date truncation string matching 
    let matchDate = true;
    if (filters.date) {
      const targetPublishDate = page.publishedAt
        ? page.publishedAt.split("T")[0]
        : "";
      matchDate = targetPublishDate === filters.date;
    }

    return matchTitle && matchStatus && matchDate;
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
          <PageTable pages={filteredPages} onRefresh={fetchPages} />
        )}
      </div>
    </div>
  );
};

export default Pages;
