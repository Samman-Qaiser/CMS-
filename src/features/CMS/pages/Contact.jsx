import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import Swal from "sweetalert2"; 
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
      console.log("Deleting contact ID:", id); 
      const res = await axios.delete(`${baseUrl}/api/contacts/${id}`);
      console.log("Delete successful:", res);
      fetchContacts();
      Swal.fire("Deleted!", "Contact has been removed.", "success");
    } catch (err) {
      console.error("Full Error Object:", err);
      Swal.fire(
        "Error",
        err.response?.data?.message || "Check console for error details",
        "error",
      );
    }
  };

  return (
    <div className="p-6 space-y-6">
      <ContactFilter onFilter={setAppliedFilters} />

      <ContactForm
        onSave={() =>
          Swal.fire(
            "Success",
            "Email notification sent successfully!",
            "success",
          )
        }
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
