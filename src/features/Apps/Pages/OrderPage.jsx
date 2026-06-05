import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { CheckCircle, Clock, PauseCircle, AlertCircle, Loader } from 'lucide-react';

const baseUrl = import.meta.env?.VITE_BACKEND_URL || "https://cms-backend-ashen.vercel.app";

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);

  // ─── Fetch Orders ──────────────────────────────────
  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${baseUrl}/api/orders`);
      setOrders(data.orders || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  // ─── Update Status ─────────────────────────────────
  const handleStatusChange = async (orderId, status, paymentStatus) => {
    try {
      setUpdatingId(orderId);
      await axios.put(`${baseUrl}/api/orders/${orderId}/status`, {
        status,
        paymentStatus,
      });
      // Local state update — no refetch needed
      setOrders(prev =>
        prev.map(o =>
          o._id === orderId ? { ...o, status, paymentStatus } : o
        )
      );
    } catch (error) {
      console.error('Status update error:', error);
    } finally {
      setUpdatingId(null);
    }
  };

  // ─── Status Style ──────────────────────────────────
  const getStatusStyle = (status) => {
    switch (status) {
      case 'completed':  return { bg: 'bg-green-500',  icon: <CheckCircle  size={12} className="ml-1" /> };
      case 'processing': return { bg: 'bg-orange-500', icon: <Clock        size={12} className="ml-1" /> };
      case 'on_hold':    return { bg: 'bg-teal-500',   icon: <PauseCircle  size={12} className="ml-1" /> };
      case 'pending':    return { bg: 'bg-yellow-500', icon: <AlertCircle  size={12} className="ml-1" /> };
      case 'cancelled':  return { bg: 'bg-red-500',    icon: <AlertCircle  size={12} className="ml-1" /> };
      default:           return { bg: 'bg-slate-500',  icon: null };
    }
  };

  // ─── Checkbox Logic ────────────────────────────────
  const handleRowSelect = (orderId) => {
    setSelectedRows(prev => {
      const newSelected = prev.includes(orderId)
        ? prev.filter(id => id !== orderId)
        : [...prev, orderId];
      setSelectAll(newSelected.length === orders.length);
      return newSelected;
    });
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedRows([]);
      setSelectAll(false);
    } else {
      setSelectedRows(orders.map(o => o._id));
      setSelectAll(true);
    }
  };

  // ─── Format Date ───────────────────────────────────
  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-GB', {
      day: '2-digit', month: '2-digit', year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader className="animate-spin text-primary" size={32} />
      </div>
    );
  }

  return (
    <div className="min-h-screen font-sans">
      {/* Breadcrumb */}
      <div className="p-4 bg-white dark:bg-[#252b48] rounded-lg mb-6 text-sm">
        <span className="text-header-text font-bold">Shop</span>
        <span className="mx-2 opacity-50">/</span>
        <span className="text-header-text">Product Orders</span>
        <span className="ml-3 bg-primary text-white text-xs font-bold px-2.5 py-1 rounded-full">
          {orders.length}
        </span>
      </div>

      {/* Orders Table */}
      <div className="max-w-7xl mx-auto bg-white dark:bg-[#252b48] rounded-lg shadow-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-header-text border-b border-slate-700/50">
                <th className="p-5 w-12 text-center">
                  <input type="checkbox" className="accent-primary" checked={selectAll} onChange={handleSelectAll} />
                </th>
                <th className="p-5 font-bold text-sm uppercase tracking-wider">Order</th>
                <th className="p-5 font-bold text-sm uppercase tracking-wider">Date</th>
                <th className="p-5 font-bold text-sm uppercase tracking-wider">Ship To</th>
                <th className="p-5 font-bold text-sm uppercase tracking-wider">Payment</th>
                <th className="p-5 font-bold text-sm uppercase tracking-wider text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/30">
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-10 text-center text-content-text opacity-50">
                    No orders found
                  </td>
                </tr>
              ) : (
                orders.map((order) => {
                  const statusInfo = getStatusStyle(order.status);
                  const addr = order.shippingAddress;
                  return (
                    <tr key={order._id} className="hover:bg-white/5 transition-colors">
                      {/* Checkbox */}
                      <td className="p-5 text-center">
                        <input
                          type="checkbox"
                          className="accent-primary"
                          checked={selectedRows.includes(order._id)}
                          onChange={() => handleRowSelect(order._id)}
                        />
                      </td>

                      {/* Order Info */}
                      <td className="p-5">
                        <div className="text-header-text font-bold text-sm">
                          #{order.orderNumber}{' '}
                          <span className="font-normal text-xs italic">by</span>{' '}
                          {addr?.fullName || 'N/A'}
                        </div>
                        <div className="text-xs opacity-60 mt-0.5">
                          {order.items?.length} item(s) — ${order.totalAmount?.toFixed(2)}
                        </div>
                      </td>

                      {/* Date */}
                      <td className="p-5 text-sm whitespace-nowrap opacity-80">
                        {formatDate(order.createdAt)}
                      </td>

                      {/* Ship To */}
                      <td className="p-5 text-xs leading-relaxed max-w-xs opacity-80">
                        {addr ? `${addr.address}, ${addr.city}, ${addr.country} via ${order.shippingMethod?.replace('_', ' ')}` : 'N/A'}
                      </td>

                      {/* Payment Status */}
                      <td className="p-5">
                        <select
                          value={order.paymentStatus}
                          disabled={updatingId === order._id}
                          onChange={(e) => handleStatusChange(order._id, order.status, e.target.value)}
                          className="text-xs dark:bg-[#1f2937] bg-transparent border border-slate-600 rounded px-2 py-1 text-header-text cursor-pointer"
                        >
                          <option value="unpaid">Unpaid</option>
                          <option value="paid">Paid</option>
                          <option value="refunded">Refunded</option>
                        </select>
                      </td>

                      {/* Order Status */}
                      <td className="p-5 text-center">
                        {updatingId === order._id ? (
                          <Loader size={16} className="animate-spin mx-auto text-primary" />
                        ) : (
                          <select
                            value={order.status}
                            onChange={(e) => handleStatusChange(order._id, e.target.value, order.paymentStatus)}
                            className={`text-[10px] font-bold text-white uppercase px-3 py-1 rounded-full cursor-pointer border-0 outline-none ${statusInfo.bg}`}
                          >
                            <option value="pending">Pending</option>
                            <option value="processing">Processing</option>
                            <option value="on_hold">On Hold</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                            <option value="refunded">Refunded</option>
                          </select>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default OrdersPage;