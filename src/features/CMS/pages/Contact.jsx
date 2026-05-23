import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import ContactFilter from "../components/ContactFilter";
import ContactForm from "../components/ContactForm";
import ContactTable from "../components/ContactTable";

const Contact = () => {
  const [contacts, setContacts] = useState([]); 
  const [editData, setEditData] = useState(null);
  const [appliedFilters, setAppliedFilters] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const baseUrl =
    import.meta.env?.VITE_BACKEND_URL || "https://cms-backend-ashen.vercel.app";

  // Fetch contacts from API
  const fetchContacts = async () => {
    try {
      const res = await axios.get(`${baseUrl}/api/contacts`);
      setContacts(res.data.contacts || res.data || []);
    } catch (err) {
      console.error("Error fetching contacts:", err);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  // Filtered logic remains the same
  const filteredContacts = useMemo(() => {
    return contacts.filter((item) => {
      return (
        item.name?.toLowerCase().includes(appliedFilters.name.toLowerCase()) &&
        item.email
          ?.toLowerCase()
          .includes(appliedFilters.email.toLowerCase()) &&
        item.phone?.includes(appliedFilters.phone)
      );
    });
  }, [contacts, appliedFilters]);
 
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${baseUrl}/api/contacts/${id}`);
      fetchContacts();  
    } catch (err) {
      console.error("Delete error", err);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <ContactFilter onFilter={setAppliedFilters} />
      <ContactForm
        onSave={fetchContacts}
        editData={editData}
        onCancel={() => setEditData(null)}
      />
      <ContactTable
        contacts={filteredContacts}
        onEdit={(contact) => setEditData(contact)}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default Contact;
