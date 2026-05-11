import { useState } from "react";
import PageFilter from "../components/PageFilter";
import PageTable from "../components/PageTable";
import { allPages } from "../components/pagesData";

const Pages = () => {
  const [filters, setFilters] = useState({
    title: "",
    status: "Select Status",
    date: "",
  });
 
  const filteredPages = allPages.filter((page) => {
    const matchTitle = page.title.toLowerCase().includes(filters.title.toLowerCase());
    const matchStatus = filters.status === "Select Status" || page.status === filters.status; 
    return matchTitle && matchStatus;
  });

  return (
    <div>
      <div className="flex flex-col gap-6">
        <PageFilter onFilter={setFilters} />
        <PageTable pages={filteredPages} />
      </div>
    </div>
  );
};


export default Pages;
