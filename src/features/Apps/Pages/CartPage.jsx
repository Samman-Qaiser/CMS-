// src/pages/CartPage.jsx
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import { 
  ShoppingCart, 
  Trash2, 
  ArrowLeft, 
  Plus, 
  Minus, 
  Gift,
  Truck,
  CreditCard,
  X
} from 'lucide-react';
import { 
  fetchCart, 
  updateCartItem, 
  removeFromCart, 
  clearCart,
  applyCoupon,
  removeCoupon
} from '../../../redux/Slice/cartSlice';

const baseUrl = import.meta.env?.VITE_BACKEND_URL || "https://cms-backend-ashen.vercel.app";

const CartPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { 
    items: cartItems, 
    totalPrice, 
    totalItems, 
    loading,
    couponApplied,
    savedAmount 
  } = useSelector((state) => state.cart);
  
  const [couponCode, setCouponCode] = useState('');
  const [applyingCoupon, setApplyingCoupon] = useState(false);

  // Fetch cart on component mount
  useEffect(() => {
    if (!user?.id) {
      navigate('/login');
      return;
    }
    dispatch(fetchCart(user.id));
  }, [dispatch, user?.id, navigate]);

  // Update cart item quantity
  const handleUpdateQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    
    const result = await dispatch(updateCartItem({
      userId: user.id,
      itemId: itemId,
      quantity: newQuantity
    }));
    
    if (result.meta.requestStatus === 'fulfilled' && couponApplied) {
      dispatch(removeCoupon());
      setCouponCode('');
    }
  };

  // Remove item from cart
  const handleRemoveItem = async (itemId) => {
    const result = await Swal.fire({
      title: 'Remove Item?',
      text: 'Are you sure you want to remove this item from cart?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, remove it!',
      cancelButtonText: 'Cancel'
    });

    if (result.isConfirmed) {
      const res = await dispatch(removeFromCart({
        userId: user.id,
        itemId: itemId
      }));
      
      if (res.meta.requestStatus === 'fulfilled') {
        if (couponApplied) {
          dispatch(removeCoupon());
          setCouponCode('');
        }
        
        Swal.fire({
          title: 'Removed!',
          text: 'Item removed from cart',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false,
          toast: true,
          position: 'top-end',
        });
      }
    }
  };

  // Clear entire cart
  const handleClearCart = async () => {
    if (cartItems.length === 0) return;
    
    const result = await Swal.fire({
      title: 'Clear Cart?',
      text: `Are you sure you want to remove all ${cartItems.length} items from your cart?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, clear all!',
      cancelButtonText: 'Cancel'
    });

    if (result.isConfirmed) {
      await dispatch(clearCart(user.id));
      dispatch(removeCoupon());
      setCouponCode('');
      
      Swal.fire({
        title: 'Cleared!',
        text: 'Your cart has been cleared',
        icon: 'success',
        timer: 1500,
        showConfirmButton: false,
        toast: true,
        position: 'top-end',
      });
    }
  };

  // Apply coupon
  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      Swal.fire({
        title: 'Enter Coupon Code',
        text: 'Please enter a coupon code',
        icon: 'warning',
        confirmButtonColor: 'var(--primary)',
      });
      return;
    }

    try {
      setApplyingCoupon(true);
      const response = await axios.post(`${baseUrl}/api/coupons/validate`, {
        code: couponCode.toUpperCase(),
        orderAmount: totalPrice
      });
      
      if (response.data.success && response.data.coupon) {
        const discount = response.data.coupon.discountType === 'percentage' 
          ? (totalPrice * response.data.coupon.discountValue) / 100
          : response.data.coupon.discountValue;
        
        const saved = Math.min(discount, totalPrice);
        
        dispatch(applyCoupon({
          coupon: response.data.coupon,
          savedAmount: saved
        }));
        
        Swal.fire({
          title: 'Coupon Applied!',
          text: `You saved $${saved.toFixed(2)}`,
          icon: 'success',
          timer: 2000,
          showConfirmButton: false,
          toast: true,
          position: 'top-end',
        });
      }
    } catch (error) {
      Swal.fire({
        title: 'Invalid Coupon!',
        text: error.response?.data?.message || 'Coupon code is invalid or expired',
        icon: 'error',
        confirmButtonColor: 'var(--primary)',
      });
    } finally {
      setApplyingCoupon(false);
    }
  };

  // Remove coupon
  const handleRemoveCoupon = () => {
    dispatch(removeCoupon());
    setCouponCode('');
    Swal.fire({
      title: 'Coupon Removed',
      text: 'Coupon has been removed from your order',
      icon: 'info',
      timer: 1500,
      showConfirmButton: false,
      toast: true,
      position: 'top-end',
    });
  };

  // Calculate final total
  const getFinalTotal = () => {
    const subtotal = totalPrice;
    const discount = savedAmount || 0;
    const shipping = subtotal > 0 && subtotal < 50 ? 5 : 0;
    const tax = (subtotal - discount) * 0.1;
    return {
      subtotal,
      discount,
      shipping,
      tax,
      total: (subtotal - discount) + shipping + tax
    };
  };

  const totals = getFinalTotal();

  if (loading && cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading your cart...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2 rounded-lg bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-shadow"
            >
              <ArrowLeft size={20} className="text-gray-600 dark:text-gray-300" />
            </button>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <ShoppingCart className="text-primary" size={28} />
                My Cart
              </h1>
              <p className="text-gray-500 dark:text-gray-400 mt-1">
                {totalItems} {totalItems === 1 ? 'item' : 'items'} in your cart
              </p>
            </div>
          </div>
          
          {cartItems.length > 0 && (
            <button
              onClick={handleClearCart}
              className="px-4 py-2 bg-red-500 text-white rounded-xl font-semibold hover:bg-red-600 transition-colors flex items-center gap-2 shadow-md"
            >
              <Trash2 size={18} />
              Clear Cart
            </button>
          )}
        </div>

        {cartItems.length === 0 ? (
          // Empty Cart State
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-12 text-center">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-primary/10 mb-6">
              <ShoppingCart size={48} className="text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Your cart is empty
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              Looks like you haven't added any items to your cart yet
            </p>
            <button
              onClick={() => navigate('/dashboard/ecom-product-grid')}
              className="px-6 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary-dark transition-colors inline-flex items-center gap-2"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Cart Items */}
            <div className="flex-1 space-y-4">
              {cartItems.map((item) => (
                <div
                  key={item._id}
                  className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                >
                  <div className="flex flex-col sm:flex-row gap-4 p-4">
                    {/* Product Image */}
                    <div className="w-full sm:w-32 h-32 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-700 flex-shrink-0">
                      <img
                        src={item.product?.images?.[0] || "https://via.placeholder.com/400x400?text=No+Image"}
                        alt={item.product?.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = "https://via.placeholder.com/400x400?text=No+Image";
                        }}
                      />
                    </div>
                    
                    {/* Product Details */}
                    <div className="flex-1 space-y-2">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                        <div>
                          <h3 className="font-semibold text-gray-900 dark:text-white text-lg">
                            {item.product?.title}
                          </h3>
                          {item.size && (
                            <span className="inline-block mt-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded-md">
                              Size: {item.size}
                            </span>
                          )}
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-primary">
                            ${((item.price || item.product?.price) * item.quantity).toFixed(2)}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            ${(item.price || item.product?.price).toFixed(2)} each
                          </div>
                        </div>
                      </div>
                      
                      {/* Quantity Controls and Actions */}
                      <div className="flex items-center justify-between pt-2">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 rounded-xl p-1">
                            <button
                              onClick={() => handleUpdateQuantity(item._id, item.quantity - 1)}
                              disabled={loading || item.quantity <= 1}
                              className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white dark:hover:bg-gray-600 transition-colors disabled:opacity-50"
                            >
                              <Minus size={16} />
                            </button>
                            <span className="w-12 text-center font-semibold">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => handleUpdateQuantity(item._id, item.quantity + 1)}
                              disabled={loading || item.quantity >= (item.product?.stock || 99)}
                              className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white dark:hover:bg-gray-600 transition-colors disabled:opacity-50"
                            >
                              <Plus size={16} />
                            </button>
                          </div>
                          
                          <button
                            onClick={() => handleRemoveItem(item._id)}
                            disabled={loading}
                            className="text-red-500 hover:text-red-600 transition-colors flex items-center gap-1 text-sm"
                          >
                            <Trash2 size={16} />
                            Remove
                          </button>
                        </div>
                        
                        {/* Stock Status */}
                        {item.product?.stock < 10 && item.product?.stock > 0 && (
                          <div className="flex items-center gap-1 text-xs text-amber-600 dark:text-amber-400">
                            <Truck size={12} />
                            <span>Only {item.product.stock} left</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Order Summary */}
            <div className="lg:w-96">
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 sticky top-8">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  Order Summary
                </h2>
                
                {/* Coupon Section */}
                <div className="mb-6">
                  {!couponApplied ? (
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Have a coupon code?
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={couponCode}
                          onChange={(e) => setCouponCode(e.target.value)}
                          placeholder="Enter coupon code"
                          className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-white"
                        />
                        <button
                          onClick={handleApplyCoupon}
                          disabled={applyingCoupon}
                          className="px-4 py-2 bg-primary text-white rounded-xl font-semibold hover:bg-primary-dark transition-colors disabled:opacity-50"
                        >
                          {applyingCoupon ? (
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          ) : (
                            'Apply'
                          )}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-3 border border-green-200 dark:border-green-800">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Gift size={18} className="text-green-600 dark:text-green-400" />
                          <span className="text-sm font-semibold text-green-700 dark:text-green-300">
                            {couponApplied.code} applied!
                          </span>
                        </div>
                        <button
                          onClick={handleRemoveCoupon}
                          className="text-green-600 dark:text-green-400 hover:text-green-700"
                        >
                          <X size={16} />
                        </button>
                      </div>
                      <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                        You saved ${savedAmount.toFixed(2)}
                      </p>
                    </div>
                  )}
                </div>
                
                {/* Price Breakdown */}
                <div className="space-y-3 border-t border-gray-200 dark:border-gray-700 pt-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                    <span className="text-gray-900 dark:text-white font-semibold">
                      ${totals.subtotal.toFixed(2)}
                    </span>
                  </div>
                  
                  {totals.discount > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-green-600 dark:text-green-400">Discount</span>
                      <span className="text-green-600 dark:text-green-400 font-semibold">
                        -${totals.discount.toFixed(2)}
                      </span>
                    </div>
                  )}
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Shipping</span>
                    {totals.shipping === 0 ? (
                      <span className="text-green-600 dark:text-green-400 font-semibold">Free</span>
                    ) : (
                      <span className="text-gray-900 dark:text-white">${totals.shipping.toFixed(2)}</span>
                    )}
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Estimated Tax (10%)</span>
                    <span className="text-gray-900 dark:text-white">${totals.tax.toFixed(2)}</span>
                  </div>
                  
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-3 mt-3">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-gray-900 dark:text-white">Total</span>
                      <span className="text-2xl font-bold text-primary">
                        ${totals.total.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Shipping Info */}
                {totals.subtotal < 50 && totals.subtotal > 0 && (
                  <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-xl flex items-start gap-2">
                    <Truck size={16} className="text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-amber-700 dark:text-amber-300">
                      Add ${(50 - totals.subtotal).toFixed(2)} more to get free shipping!
                    </p>
                  </div>
                )}
                
                {/* Checkout Button */}
                <button
                  onClick={() => navigate('/dashboard/ecom-checkout', { state: { couponApplied, savedAmount } })}
                  className="w-full mt-6 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary-dark transition-colors flex items-center justify-center gap-2 shadow-lg"
                >
                  <CreditCard size={18} />
                  Proceed to Checkout
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;