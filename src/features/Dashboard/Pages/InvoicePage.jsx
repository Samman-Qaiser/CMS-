import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import Swal from 'sweetalert2';

const baseUrl = import.meta.env?.VITE_BACKEND_URL || "https://cms-backend-ashen.vercel.app";

const InvoicePage = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');

  // Fetch all orders for the user
  useEffect(() => {
    if (!user?.id) {
      navigate('/login');
      return;
    }
    fetchOrders();
  }, [user?.id]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${baseUrl}/api/orders?user=${user.id}`);
      console.log("Orders response:", response.data);
      
      if (response.data.success && response.data.orders) {
        setOrders(response.data.orders);
        // Select the most recent order by default
        if (response.data.orders.length > 0) {
          setSelectedOrder(response.data.orders[0]);
        }
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      Swal.fire({
        title: 'Error!',
        text: 'Failed to load orders',
        icon: 'error',
        confirmButtonColor: 'var(--primary)',
      });
    } finally {
      setLoading(false);
    }
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Get status badge color
  const getStatusBadge = (status) => {
    const statusColors = {
      pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
      completed: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
      processing: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
      shipped: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
      delivered: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
      cancelled: 'bg-red-100 text-red-800 dark:bg-red-900/3₀ dark:text-red-4₀',
    };
    return statusColors[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
  };

  // Get payment status badge
  const getPaymentBadge = (status) => {
    return status === 'paid' 
      ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
      : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
  };

  // Filter orders by status
  const filteredOrders = filterStatus === 'all' 
    ? orders 
    : orders.filter(order => order.status === filterStatus);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading your orders...</p>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white dark:bg-[#252b48] rounded-lg shadow-xl p-12 text-center">
            <svg className="w-24 h-24 mx-auto text-gray-400 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              No Orders Found
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              You haven't placed any orders yet.
            </p>
            <button
              onClick={() => navigate('/dashboard/ecom-products')}
              className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
            >
              Start Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb */}
        <div className="mb-6 bg-white dark:bg-[#252b48] rounded-md p-3 text-sm">
          <span className="font-bold text-gray-700 dark:text-gray-300">Shop</span>
          <span className="font-extrabold text-lg text-primary mx-2">/</span>
          <span className="font-bold text-gray-700 dark:text-gray-300">My Orders</span>
          <span className="mx-2 text-gray-500">/</span>
          <span className="text-primary">Invoice</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Orders List Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-[#252b48] rounded-lg shadow-xl overflow-hidden sticky top-8">
              <div className="p-4 border-b border-gray-200 dark:border-slate-700/50">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">My Orders</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Total {orders.length} orders
                </p>
              </div>

              {/* Filter Buttons */}
              <div className="p-4 border-b border-gray-200 dark:border-slate-700/50 flex gap-2 flex-wrap">
                {['all', 'pending', 'processing', 'shipped', 'delivered', 'cancelled'].map((status) => (
                  <button
                    key={status}
                    onClick={() => setFilterStatus(status)}
                    className={`px-3 py-1 text-xs rounded-full capitalize transition-colors ${
                      filterStatus === status
                        ? 'bg-primary text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>

              {/* Orders List */}
              <div className="divide-y divide-gray-200 dark:divide-slate-700/50 max-h-[600px] overflow-y-auto">
                {filteredOrders.map((order) => (
                  <div
                    key={order._id}
                    onClick={() => setSelectedOrder(order)}
                    className={`p-4 cursor-pointer transition-all hover:bg-gray-50 dark:hover:bg-gray-800/50 ${
                      selectedOrder?._id === order._id
                        ? 'bg-primary/5 dark:bg-primary/10 border-l-4 border-primary'
                        : ''
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">
                          #{order.orderNumber}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {formatDate(order.createdAt)}
                        </p>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full capitalize ${getStatusBadge(order.status)}`}>
                        {order.status}
                      </span>
                    </div>
                    <div className="flex justify-between items-center mt-2">
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {order.items.length} item(s)
                      </p>
                      <p className="text-lg font-bold text-primary">
                        ${order.totalAmount.toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Invoice Details */}
          <div className="lg:col-span-2">
            {selectedOrder && (
              <div className="bg-white dark:bg-[#252b48] rounded-lg shadow-xl overflow-hidden">
                {/* Header */}
                <div className="p-6 border-b border-gray-200 dark:border-slate-700/50">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="text-xs uppercase tracking-widest text-gray-500 dark:text-gray-400">
                        Invoice
                      </div>
                      <div className="text-2xl font-bold text-primary mt-1">
                        #{selectedOrder.orderNumber}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {formatDate(selectedOrder.createdAt)}
                      </div>
                      <div className="mt-2 flex gap-2 justify-end">
                        <span className={`text-xs px-2 py-1 rounded-full capitalize ${getStatusBadge(selectedOrder.status)}`}>
                          {selectedOrder.status}
                        </span>
                        <span className={`text-xs px-2 py-1 rounded-full capitalize ${getPaymentBadge(selectedOrder.paymentStatus)}`}>
                          {selectedOrder.paymentStatus}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  {/* Addresses */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div>
                      <h3 className="text-gray-700 dark:text-gray-300 font-bold mb-3 flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                        Store Information
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                        <span className="font-semibold text-gray-800 dark:text-gray-200">Your E-Commerce Store</span><br/>
                        123 Business Street<br/>
                        New York, NY 10001<br/>
                        Email: support@yourecommerce.com
                      </p>
                    </div>

                    <div>
                      <h3 className="text-gray-700 dark:text-gray-300 font-bold mb-3 flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        Shipping Address
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                        <span className="font-semibold text-gray-800 dark:text-gray-200">
                          {selectedOrder.shippingAddress?.fullName}
                        </span><br/>
                        {selectedOrder.shippingAddress?.address}<br/>
                        {selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.state} {selectedOrder.shippingAddress?.zipCode}<br/>
                        {selectedOrder.shippingAddress?.country}<br/>
                        Phone: {selectedOrder.shippingAddress?.phone}
                      </p>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="overflow-x-auto mb-6">
                    <table className="w-full text-left text-sm">
                      <thead className="border-b border-gray-200 dark:border-slate-700">
                        <tr className="text-gray-700 dark:text-gray-300 font-semibold">
                          <th className="py-3 px-2">#</th>
                          <th className="py-3 px-2">Item</th>
                          <th className="py-3 px-2">Size</th>
                          <th className="py-3 px-2">Price</th>
                          <th className="py-3 px-2 text-center">Qty</th>
                          <th className="py-3 px-2 text-right">Total</th>
                         </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 dark:divide-slate-700/30">
                        {selectedOrder.items.map((item, index) => (
                          <tr key={item._id || index} className="hover:bg-gray-50 dark:hover:bg-white/5">
                            <td className="py-3 px-2 text-gray-500 dark:text-gray-400">{index + 1}</td>
                            <td className="py-3 px-2">
                              <div className="flex items-center gap-3">
                                {item.image && (
                                  <img 
                                    src={item.image} 
                                    alt={item.title}
                                    className="w-10 h-10 rounded object-cover"
                                  />
                                )}
                                <span className="font-medium text-gray-900 dark:text-white">
                                  {item.title}
                                </span>
                              </div>
                            </td>
                            <td className="py-3 px-2 text-gray-600 dark:text-gray-400">
                              {item.size || '-'}
                            </td>
                            <td className="py-3 px-2 text-gray-700 dark:text-gray-300">
                              ${item.price.toFixed(2)}
                            </td>
                            <td className="py-3 px-2 text-center text-gray-700 dark:text-gray-300">
                              {item.quantity}
                            </td>
                            <td className="py-3 px-2 text-right text-gray-900 dark:text-white font-bold">
                              ${(item.price * item.quantity).toFixed(2)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Payment & Shipping Method */}
                  <div className="grid grid-cols-2 gap-4 mb-6 p-4 bg-gray-50 dark:bg-gray-800/30 rounded-lg">
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Payment Method</p>
                      <p className="text-sm font-medium text-gray-900 dark:text-white capitalize">
                        {selectedOrder.paymentMethod?.replace(/_/g, ' ')}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Shipping Method</p>
                      <p className="text-sm font-medium text-gray-900 dark:text-white capitalize">
                        {selectedOrder.shippingMethod?.replace(/_/g, ' ')}
                      </p>
                    </div>
                  </div>

                  {/* Calculations */}
                  <div className="flex justify-end">
                    <div className="w-full max-w-sm space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                        <span className="text-gray-900 dark:text-white font-semibold">
                          ${selectedOrder.subtotal?.toFixed(2) || '0.00'}
                        </span>
                      </div>
                      
                      {selectedOrder.discount > 0 && (
                        <div className="flex justify-between text-sm">
                          <span className="text-green-600 dark:text-green-400">Discount</span>
                          <span className="text-green-600 dark:text-green-400 font-semibold">
                            -${selectedOrder.discount.toFixed(2)}
                          </span>
                        </div>
                      )}
                      
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Shipping</span>
                        <span className="text-gray-900 dark:text-white font-semibold">
                          {selectedOrder.shippingCost === 0 ? 'Free' : `$${selectedOrder.shippingCost?.toFixed(2)}`}
                        </span>
                      </div>
                      
                      <div className="pt-3 border-t border-gray-200 dark:border-slate-700">
                        <div className="flex justify-between items-center">
                          <span className="text-base font-bold text-gray-900 dark:text-white">
                            Total Amount
                          </span>
                          <span className="text-2xl font-bold text-primary">
                            ${selectedOrder.totalAmount?.toFixed(2) || '0.00'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-8 flex gap-4 justify-end">
                    <button
                      onClick={() => window.print()}
                      className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2 text-sm"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                      </svg>
                      Print
                    </button>
                    <button
                      onClick={() => navigate('/dashboard/ecom-products')}
                      className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors flex items-center gap-2 text-sm"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                      </svg>
                      Continue Shopping
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoicePage;