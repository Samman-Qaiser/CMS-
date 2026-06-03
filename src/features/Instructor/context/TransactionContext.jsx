import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const TransactionContext = createContext();

export const useTransactions = () => {
  const context = useContext(TransactionContext);
  if (!context) {
    throw new Error("useTransactions must be used within TransactionProvider");
  }
  return context;
};

export const TransactionProvider = ({ children }) => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const baseUrl =
    import.meta.env?.VITE_BACKEND_URL || "https://cms-backend-ashen.vercel.app";

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${baseUrl}/api/transactions`);
      setTransactions(res.data.transactions);
    } catch (err) {
      console.error("Error fetching transactions:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [refreshTrigger]);

  const updateTransactionStatus = async (id, newStatus) => {
    try {
      const response = await axios.put(`${baseUrl}/api/transactions/${id}`, {
        status: newStatus,
      });

      // Update local state
      setTransactions((prev) =>
        prev.map((t) => (t._id === id ? { ...t, status: newStatus } : t)),
      );

      // Trigger refresh for all components
      setRefreshTrigger((prev) => prev + 1);

      return { success: true, data: response.data };
    } catch (err) {
      console.error("Failed to update status:", err);
      throw err;
    }
  };

  const refreshTransactions = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <TransactionContext.Provider
      value={{
        transactions,
        loading,
        updateTransactionStatus,
        refreshTransactions,
        setTransactions,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};
