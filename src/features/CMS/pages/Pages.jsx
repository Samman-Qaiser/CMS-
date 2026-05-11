import { useState } from "react";
import PageFilter from "../components/PageFilter";
import PageTable from "../components/PageTable";

const Pages = () => {
  const [filters, setFilters] = useState({
    title: "",
    status: "Select Status",
    date: "",
  });
 
  const allPages = [
    {
      id: 1,
      title: "About",
      status: "Published",
      visibility: "Public",
      publishOn: "Dec. 5, 2022",
      createdAt: "Dec. 6, 2022, 10:56 a.m.",
      updatedAt: "Jan. 23, 2023, 5:37 p.m.",
      url: "/about",
    },
    {
      id: 2,
      title: "Secret",
      status: "Published",
      visibility: "Password Protected",
      publishOn: "Dec. 7, 2022",
      createdAt: "Dec. 8, 2022, 11:53 a.m.",
      updatedAt: "Jan. 17, 2023, 6:01 p.m.",
      url: "/secret",
    },
    {
      id: 3,
      title: "Home",
      status: "Published",
      visibility: "Public",
      publishOn: "Dec. 3, 2022",
      createdAt: "Dec. 6, 2022, 10:45 a.m.",
      updatedAt: "Jan. 20, 2023, 3:03 p.m.",
      url: "/home",
    },
  ];

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
