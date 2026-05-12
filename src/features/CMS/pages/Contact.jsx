import { useState, useMemo } from "react";
import { contactData } from "../components/blogsData";
import ContactFilter from "../components/ContactFilter";
import ContactForm from "../components/ContactForm";
import ContactTable from "../components/ContactTable";

const Contact = () => {
  const [contacts, setContacts] = useState(contactData);
  const [editData, setEditData] = useState(null);

  // Filter state
  const [appliedFilters, setAppliedFilters] = useState({
    name: "",
    email: "",
    phone: "",
  });

  // --- Handlers ---
  const handleSave = (formData) => {
    if (editData) {
      setContacts((prev) =>
        prev.map((c) => (c.id === editData.id ? { ...formData, id: c.id } : c)),
      );
      setEditData(null);
    } else {
      setContacts([{ ...formData, id: Date.now() }, ...contacts]);
    }
  };

  const handleFilter = (filters) => {
    setAppliedFilters(filters);
  };

  // --- Filtering Logic ---
  const filteredContacts = useMemo(() => {
    return contacts.filter((item) => {
      return (
        item.name.toLowerCase().includes(appliedFilters.name.toLowerCase()) &&
        item.email.toLowerCase().includes(appliedFilters.email.toLowerCase()) &&
        item.phone.includes(appliedFilters.phone)
      );
    });
  }, [contacts, appliedFilters]);

  return (
    <div className="p-6 space-y-6">
      <ContactFilter onFilter={handleFilter} />

      <ContactForm
        onSave={handleSave}
        editData={editData}
        onCancel={() => setEditData(null)}
      />

      <ContactTable
        contacts={filteredContacts}
        onEdit={(contact) => {
          setEditData(contact);
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
      />
    </div>
  );
};

export default Contact;
