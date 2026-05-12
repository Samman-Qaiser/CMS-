import { useState, useMemo } from "react";
import { subscribersData } from "../components/blogsData";
import SubscriberFilter from "../components/SubscriberFilter";
import SubscriberForm from "../components/SubscriberForm";
import SubscriberTable from "../components/SubscriberTable";

const SubscribersPage = () => {
  const [subscribers, setSubscribers] = useState(subscribersData);
  const [editData, setEditData] = useState(null);

  // Filter state
  const [appliedFilters, setAppliedFilters] = useState({
    name: "",
    email: "",
    status: "Select Status",
  });

  // --- Handlers ---
  const handleSave = (formData) => {
    if (editData) {
      setSubscribers((prev) =>
        prev.map((s) => (s.id === editData.id ? { ...formData, id: s.id } : s)),
      );
      setEditData(null);
    } else {
      setSubscribers([{ ...formData, id: Date.now() }, ...subscribers]);
    }
  };

  const handleFilter = (filters) => {
    setAppliedFilters(filters);
  };
 
  const filteredSubscribers = useMemo(() => {
    return subscribers.filter((sub) => {
      const nameMatch = (sub.name || "")
        .toLowerCase()
        .includes(appliedFilters.name.toLowerCase());
      const emailMatch = (sub.email || "")
        .toLowerCase()
        .includes(appliedFilters.email.toLowerCase());

      const statusMatch =
        appliedFilters.status === "Select Status" ||
        (appliedFilters.status === "Active"
          ? sub.status === true
          : sub.status === false);

      return nameMatch && emailMatch && statusMatch;
    });
  }, [subscribers, appliedFilters]);

  return (
    <div className="p-6 space-y-6">
      {/* 1. Filter Component */}
      <SubscriberFilter onFilter={handleFilter} />

      {/* 2. Add/Edit Form Component */}
      <SubscriberForm
        onSave={handleSave}
        editData={editData}
        onCancel={() => setEditData(null)}
      />

      {/* 3. Table Component   */}
      <SubscriberTable
        subscribers={filteredSubscribers}
        onEdit={(sub) => {
          setEditData(sub);
          window.scrollTo({ top: 0, behavior: "smooth" });  
        }} 
      />
    </div>
  );
};

export default SubscribersPage;
