import { useState, useMemo, useEffect } from "react";
import SubscriberFilter from "../components/SubscriberFilter";
import SubscriberForm from "../components/SubscriberForm";
import SubscriberTable from "../components/SubscriberTable";
import axios from "axios";

const SubscribersPage = () => {
  const [editData, setEditData] = useState(null);
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);
  const baseUrl = import.meta.env?.VITE_BACKEND_URL || "https://cms-backend-ashen.vercel.app";

  useEffect(() => {
    const fetchSubscribers = async () => {
      try {
        const res = await axios.get(`${baseUrl}/api/subscribers`);
        setSubscribers(res.data.subscribers || []);
      } catch (err) {
        console.error("Error fetching subscribers:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSubscribers();
  }, [baseUrl]);

  const [appliedFilters, setAppliedFilters] = useState({
    name: "",
    email: "",
    status: "Select Status",
  });

  const handleSave = async (formData) => {
    try {
      const payload = {
        ...formData,
        status: formData.status === "Active" ? "active" : "inactive"
      };

      if (editData) {
        await axios.put(`${baseUrl}/api/subscribers/${editData._id}`, payload);
        setSubscribers((prev) =>
          prev.map((s) => (s._id === editData._id ? { ...payload, _id: s._id } : s))
        );
        setEditData(null);
      } else {
        const response = await axios.post(`${baseUrl}/api/subscribers`, payload);
        const newSubscriber = response.data.subscriber || response.data;
        setSubscribers([newSubscriber, ...subscribers]);
      }
    } catch (error) {
      console.error("Failed to save:", error);
    }
  };

  const handleFilter = (filters) => setAppliedFilters(filters);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${baseUrl}/api/subscribers/${id}`);
      setSubscribers((prev) => prev.filter((s) => s._id !== id));
    } catch (error) {
      console.error("Failed to delete:", error);
    }
  };

  const filteredSubscribers = useMemo(() => {
    return subscribers.filter((sub) => {
      const nameMatch = (sub.name || "").toLowerCase().includes(appliedFilters.name.toLowerCase());
      const emailMatch = (sub.email || "").toLowerCase().includes(appliedFilters.email.toLowerCase());
      
      const statusMatch =
        appliedFilters.status === "Select Status" ||
        (sub.status && sub.status.toLowerCase() === appliedFilters.status.toLowerCase());

      return nameMatch && emailMatch && statusMatch;
    });
  }, [subscribers, appliedFilters]);

  return (
    <div className="p-6 space-y-6">
      <SubscriberFilter onFilter={handleFilter} />
      <SubscriberForm
        onSave={handleSave}
        editData={editData}
        onCancel={() => setEditData(null)}
      />
      {loading ? (
        <p>Loading subscribers...</p>
      ) : (
        <SubscriberTable
          subscribers={filteredSubscribers}
          onEdit={(sub) => {
            setEditData(sub);
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
};

export default SubscribersPage;