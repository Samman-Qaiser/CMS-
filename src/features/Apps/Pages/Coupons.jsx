import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { Pencil, Trash2, Plus, Copy, Check } from "lucide-react";
import CouponModal from "../components/CouponModal"; 

const Coupons = () => {
  const baseUrl =
    import.meta.env?.VITE_BACKEND_URL || "https://cms-backend-ashen.vercel.app";

  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [copiedCode, setCopiedCode] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    code: "",
    discountType: "percentage",
    discountValue: "",
    minOrderAmount: "",
    maxDiscount: "",
    usageLimit: "",
    expiresAt: "",
    isActive: true,
  });

  // Fetch all coupons
  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${baseUrl}/api/coupons`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Coupons API response:", response.data);

      let couponsData = [];
      if (response.data) {
        if (response.data.coupons && Array.isArray(response.data.coupons)) {
          couponsData = response.data.coupons;
        } else if (response.data.data && Array.isArray(response.data.data)) {
          couponsData = response.data.data;
        } else if (Array.isArray(response.data)) {
          couponsData = response.data;
        }
      }

      setCoupons(couponsData);
    } catch (error) {
      console.error("Error fetching coupons:", error);
      Swal.fire({
        title: "Error!",
        text: "Failed to load coupons",
        icon: "error",
        confirmButtonColor: "#d33",
      });
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    setEditingCoupon(null);
    setFormData({
      code: "",
      discountType: "percentage",
      discountValue: "",
      minOrderAmount: "",
      maxDiscount: "",
      usageLimit: "",
      expiresAt: "",
      isActive: true,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (coupon) => {
    setEditingCoupon(coupon);
    setFormData({
      code: coupon.code,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      minOrderAmount: coupon.minOrderAmount || "",
      maxDiscount: coupon.maxDiscount || "",
      usageLimit: coupon.usageLimit || "",
      expiresAt: coupon.expiresAt ? coupon.expiresAt.split("T")[0] : "",
      isActive: coupon.isActive,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    // Validation
    if (!formData.code) {
      Swal.fire({
        title: "Missing Code",
        text: "Please enter a coupon code",
        icon: "warning",
      });
      setSubmitting(false);
      return;
    }

    if (!formData.discountValue) {
      Swal.fire({
        title: "Missing Discount",
        text: "Please enter discount value",
        icon: "warning",
      });
      setSubmitting(false);
      return;
    }

    const submitData = {
      code: formData.code.toUpperCase(),
      discountType: formData.discountType,
      discountValue: parseFloat(formData.discountValue),
      minOrderAmount: formData.minOrderAmount
        ? parseFloat(formData.minOrderAmount)
        : 0,
      maxDiscount: formData.maxDiscount
        ? parseFloat(formData.maxDiscount)
        : null,
      usageLimit: formData.usageLimit ? parseInt(formData.usageLimit) : null,
      expiresAt: formData.expiresAt
        ? new Date(formData.expiresAt).toISOString()
        : null,
      isActive: formData.isActive,
    };

    try {
      const token = localStorage.getItem("token");
      let response;

      if (editingCoupon) {
        // Update coupon
        response = await axios.put(
          `${baseUrl}/api/coupons/${editingCoupon._id}`,
          submitData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          },
        );
      } else {
        // Create coupon
        response = await axios.post(`${baseUrl}/api/coupons`, submitData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
      }

      if (response.status === 200 || response.status === 201) {
        Swal.fire({
          title: "Success!",
          text: editingCoupon
            ? "Coupon updated successfully!"
            : "Coupon created successfully!",
          icon: "success",
          confirmButtonColor: "#3085d6",
          timer: 2000,
        });
        setIsModalOpen(false);
        fetchCoupons();
      }
    } catch (error) {
      console.error("Error saving coupon:", error);
      Swal.fire({
        title: "Error!",
        text: error.response?.data?.message || "Failed to save coupon",
        icon: "error",
        confirmButtonColor: "#d33",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (coupon) => {
    const result = await Swal.fire({
      title: "Delete Coupon?",
      text: `Are you sure you want to delete coupon "${coupon.code}"?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete!",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(`${baseUrl}/api/coupons/${coupon._id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        Swal.fire({
          title: "Deleted!",
          text: "Coupon has been deleted.",
          icon: "success",
          confirmButtonColor: "#3085d6",
          timer: 2000,
        });
        fetchCoupons();
      } catch (error) {
        console.error("Error deleting coupon:", error);
        Swal.fire({
          title: "Error!",
          text: error.response?.data?.message || "Failed to delete coupon",
          icon: "error",
          confirmButtonColor: "#d33",
        });
      }
    }
  };

  const copyToClipboard = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const toggleCouponStatus = async (coupon) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${baseUrl}/api/coupons/${coupon._id}`,
        { ...coupon, isActive: !coupon.isActive },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );
      fetchCoupons();
    } catch (error) {
      console.error("Error toggling coupon status:", error);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "No expiry";
    return new Date(dateString).toLocaleDateString();
  };

  const isExpired = (expiresAt) => {
    if (!expiresAt) return false;
    return new Date(expiresAt) < new Date();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="mt-4 text-gray-600">Loading coupons...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-header-text">Coupons</h1>
          <p className="text-content-text text-sm mt-1">
            Manage your discount coupons and promotional codes
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors flex items-center gap-2"
        >
          <Plus size={18} />
          Create Coupon
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white dark:bg-[#21233E] rounded-lg p-4 shadow">
          <p className="text-content-text text-sm">Total Coupons</p>
          <p className="text-2xl font-bold text-header-text">
            {coupons.length}
          </p>
        </div>
        <div className="bg-white dark:bg-[#21233E] rounded-lg p-4 shadow">
          <p className="text-content-text text-sm">Active Coupons</p>
          <p className="text-2xl font-bold text-green-500">
            {
              coupons.filter((c) => c.isActive && !isExpired(c.expiresAt))
                .length
            }
          </p>
        </div>
        <div className="bg-white dark:bg-[#21233E] rounded-lg p-4 shadow">
          <p className="text-content-text text-sm">Expired Coupons</p>
          <p className="text-2xl font-bold text-red-500">
            {
              coupons.filter((c) => !c.isActive || isExpired(c.expiresAt))
                .length
            }
          </p>
        </div>
        <div className="bg-white dark:bg-[#21233E] rounded-lg p-4 shadow">
          <p className="text-content-text text-sm">Total Uses</p>
          <p className="text-2xl font-bold text-header-text">
            {coupons.reduce((sum, c) => sum + (c.usedCount || 0), 0)}
          </p>
        </div>
      </div>

      {/* Coupons Table */}
      <div className="bg-white dark:bg-[#21233E] rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-[#1a1c2e]">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-content-text uppercase tracking-wider">
                  Code
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-content-text uppercase tracking-wider">
                  Discount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-content-text uppercase tracking-wider">
                  Min Order
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-content-text uppercase tracking-wider">
                  Usage
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-content-text uppercase tracking-wider">
                  Expiry
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-content-text uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-content-text uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {coupons.length === 0 ? (
                <tr>
                  <td
                    colSpan="7"
                    className="px-6 py-12 text-center text-content-text"
                  >
                    No coupons found. Click "Create Coupon" to add one.
                  </td>
                </tr>
              ) : (
                coupons.map((coupon) => (
                  <tr
                    key={coupon._id}
                    className="hover:bg-gray-50 dark:hover:bg-[#1a1c2e] transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-primary">
                          {coupon.code}
                        </span>
                        <button
                          onClick={() => copyToClipboard(coupon.code)}
                          className="text-content-text hover:text-primary transition-colors"
                          title="Copy code"
                        >
                          {copiedCode === coupon.code ? (
                            <Check size={16} className="text-green-500" />
                          ) : (
                            <Copy size={16} />
                          )}
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <span className="font-semibold text-header-text">
                          {coupon.discountType === "percentage"
                            ? `${coupon.discountValue}%`
                            : `$${coupon.discountValue}`}
                        </span>
                        {coupon.maxDiscount && (
                          <p className="text-xs text-content-text">
                            Max: ${coupon.maxDiscount}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {coupon.minOrderAmount > 0
                        ? `$${coupon.minOrderAmount}`
                        : "No minimum"}
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <span className="text-header-text">
                          {coupon.usedCount || 0}
                        </span>
                        {coupon.usageLimit && (
                          <span className="text-content-text text-sm">
                            /{coupon.usageLimit}
                          </span>
                        )}
                      </div>
                      {coupon.usageLimit && (
                        <div className="w-24 mt-1 bg-gray-200 rounded-full h-1.5">
                          <div
                            className="bg-primary rounded-full h-1.5"
                            style={{
                              width: `${((coupon.usedCount || 0) / coupon.usageLimit) * 100}%`,
                            }}
                          ></div>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`text-sm ${
                          isExpired(coupon.expiresAt)
                            ? "text-red-500"
                            : "text-header-text"
                        }`}
                      >
                        {formatDate(coupon.expiresAt)}
                      </span>
                      {isExpired(coupon.expiresAt) && (
                        <p className="text-xs text-red-500">Expired</p>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => toggleCouponStatus(coupon)}
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          coupon.isActive && !isExpired(coupon.expiresAt)
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                            : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                        }`}
                      >
                        {coupon.isActive && !isExpired(coupon.expiresAt)
                          ? "Active"
                          : "Inactive"}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => openEditModal(coupon)}
                          className="p-1 text-blue-600 hover:text-blue-800 transition-colors"
                          title="Edit coupon"
                        >
                          <Pencil size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(coupon)}
                          className="p-1 text-red-600 hover:text-red-800 transition-colors"
                          title="Delete coupon"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Coupon Modal Component */}
      <CouponModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        editingCoupon={editingCoupon}
        formData={formData}
        setFormData={setFormData}
        submitting={submitting}
      />
    </div>
  );
};

export default Coupons;
