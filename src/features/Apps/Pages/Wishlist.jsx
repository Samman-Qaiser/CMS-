// src/pages/WishlistPage.jsx
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { 
  Heart, 
  ShoppingBag, 
  Trash2, 
  ArrowLeft, 
  ShoppingCart,
  X,
  Star,
  Truck,
  Clock
} from 'lucide-react';
import { 
  fetchWishlist, 
  removeFromWishlist, 
  clearWishlist, 
  moveToCart 
} from '../../../redux/Slice/wishlistSlice';

const WishlistPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { 
    items: wishlistItems, 
    totalItems, 
    loading 
  } = useSelector((state) => state.wishlist);
  
  const [movingProduct, setMovingProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState({});
  const [showSizeModal, setShowSizeModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Fetch wishlist on component mount
  useEffect(() => {
    if (!user?.id) {
      navigate('/login');
      return;
    }
    dispatch(fetchWishlist(user.id));
  }, [dispatch, user?.id, navigate]);

  // Remove single item from wishlist
  const handleRemoveItem = async (productId) => {
    const result = await Swal.fire({
      title: 'Remove Item?',
      text: 'Are you sure you want to remove this item from wishlist?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, remove it!',
      cancelButtonText: 'Cancel'
    });

    if (result.isConfirmed) {
      const res = await dispatch(removeFromWishlist({
        userId: user.id,
        productId: productId
      }));
      
      if (res.meta.requestStatus === 'fulfilled') {
        Swal.fire({
          title: 'Removed!',
          text: 'Item removed from wishlist',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false,
          toast: true,
          position: 'top-end',
        });
      }
    }
  };

  // Clear entire wishlist
  const handleClearWishlist = async () => {
    if (wishlistItems.length === 0) return;
    
    const result = await Swal.fire({
      title: 'Clear Wishlist?',
      text: `Are you sure you want to remove all ${wishlistItems.length} items from your wishlist?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, clear all!',
      cancelButtonText: 'Cancel'
    });

    if (result.isConfirmed) {
      await dispatch(clearWishlist(user.id));
      Swal.fire({
        title: 'Cleared!',
        text: 'Your wishlist has been cleared',
        icon: 'success',
        timer: 1500,
        showConfirmButton: false,
        toast: true,
        position: 'top-end',
      });
    }
  };

  // Open size selection modal for move to cart
  const openSizeModal = (product) => {
    if (product.sizes && product.sizes.length > 0) {
      setSelectedProduct(product);
      setSelectedSize({ [product._id]: product.sizes[0] });
      setShowSizeModal(true);
    } else {
      handleMoveToCart(product._id, null);
    }
  };

  // Move item to cart
  const handleMoveToCart = async (productId, size) => {
    try {
      setMovingProduct(productId);
      
      const result = await dispatch(moveToCart({
        userId: user.id,
        productId: productId,
        size: size
      }));
      
      if (result.meta.requestStatus === 'fulfilled') {
        Swal.fire({
          title: 'Moved to Cart!',
          text: 'Item moved to cart successfully',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false,
          toast: true,
          position: 'top-end',
        });
      }
    } catch (error) {
      Swal.fire({
        title: 'Error!',
        text: error || 'Failed to move item to cart',
        icon: 'error',
        confirmButtonColor: 'var(--primary)',
      });
    } finally {
      setMovingProduct(null);
      setShowSizeModal(false);
    }
  };

  // Move all items to cart
  const handleMoveAllToCart = async () => {
    if (wishlistItems.length === 0) return;
    
    const result = await Swal.fire({
      title: 'Move All to Cart?',
      text: `Are you sure you want to move all ${wishlistItems.length} items to your cart?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: 'var(--primary)',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, move all!',
      cancelButtonText: 'Cancel'
    });

    if (result.isConfirmed) {
      let successCount = 0;
      let errorCount = 0;
      
      for (const product of wishlistItems) {
        try {
          const size = product.sizes?.[0] || null;
          const res = await dispatch(moveToCart({
            userId: user.id,
            productId: product._id,
            size: size
          })).unwrap();
          
          if (res) successCount++;
        } catch (error) {
          errorCount++;
        }
      }
      
      if (successCount > 0) {
        Swal.fire({
          title: 'Items Moved!',
          html: `${successCount} items moved to cart${errorCount > 0 ? `, ${errorCount} failed` : ''}`,
          icon: successCount === wishlistItems.length ? 'success' : 'warning',
          timer: 2000,
          showConfirmButton: false,
        });
      }
    }
  };

  const discountPercentage = (originalPrice, price) => {
    if (originalPrice && originalPrice > price) {
      return Math.round(((originalPrice - price) / originalPrice) * 100);
    }
    return 0;
  };

  if (loading && wishlistItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading your wishlist...</p>
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
                <Heart className="text-red-500 fill-red-500" size={28} />
                My Wishlist
              </h1>
              <p className="text-gray-500 dark:text-gray-400 mt-1">
                {totalItems} {totalItems === 1 ? 'item' : 'items'} saved for later
              </p>
            </div>
          </div>
          
          <div className="flex gap-3">
            {wishlistItems.length > 0 && (
              <>
                <button
                  onClick={handleMoveAllToCart}
                  disabled={loading}
                  className="px-4 py-2 bg-primary text-white rounded-xl font-semibold hover:bg-primary-dark transition-colors flex items-center gap-2 shadow-md disabled:opacity-50"
                >
                  <ShoppingCart size={18} />
                  Move All to Cart
                </button>
                <button
                  onClick={handleClearWishlist}
                  className="px-4 py-2 bg-red-500 text-white rounded-xl font-semibold hover:bg-red-600 transition-colors flex items-center gap-2 shadow-md"
                >
                  <Trash2 size={18} />
                  Clear All
                </button>
              </>
            )}
          </div>
        </div>

        {/* Wishlist Items */}
        {wishlistItems.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-12 text-center">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-red-100 dark:bg-red-900/30 mb-6">
              <Heart size={48} className="text-red-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Your wishlist is empty
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              Save your favorite items here and shop them later
            </p>
            <button
              onClick={() => navigate('/dashboard/ecom-product-grid')}
              className="px-6 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary-dark transition-colors inline-flex items-center gap-2"
            >
              <ShoppingBag size={18} />
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlistItems.map((product) => {
              const discount = discountPercentage(product.originalPrice, product.price);
              const isInStock = product.availability === "in_stock";
              
              return (
                <div
                  key={product._id}
                  className="group bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
                >
                  {/* Product Image */}
                  <div className="relative aspect-square overflow-hidden bg-gray-100 dark:bg-gray-700">
                    <img
                      src={product.images?.[0] || "https://via.placeholder.com/400x400?text=No+Image"}
                      alt={product.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      onError={(e) => {
                        e.target.src = "https://via.placeholder.com/400x400?text=No+Image";
                      }}
                    />
                    
                    {/* Badges */}
                    <div className="absolute top-3 left-3 flex flex-col gap-1">
                      {discount > 0 && (
                        <span className="bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-bold px-2 py-1 rounded-lg shadow-lg">
                          {discount}% OFF
                        </span>
                      )}
                      {!isInStock && (
                        <span className="bg-gray-900/90 backdrop-blur-sm text-white text-xs font-bold px-2 py-1 rounded-lg">
                          Out of Stock
                        </span>
                      )}
                    </div>
                    
                    {/* Remove Button */}
                    <button
                      onClick={() => handleRemoveItem(product._id)}
                      disabled={loading}
                      className="absolute top-3 right-3 w-8 h-8 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-red-50 dark:hover:bg-red-900/30 transition-all duration-200 shadow-md"
                    >
                      <Trash2 size={14} className="text-gray-600 dark:text-gray-300 hover:text-red-500" />
                    </button>
                  </div>
                  
                  {/* Product Info */}
                  <div className="p-4 space-y-3">
                    {/* Brand */}
                    {product.brand && (
                      <div className="flex items-center gap-2 text-xs">
                        <span className="text-gray-500 dark:text-gray-400">
                          {product.brand}
                        </span>
                      </div>
                    )}
                    
                    {/* Title */}
                    <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-2 min-h-[48px] leading-tight">
                      {product.title}
                    </h3>
                    
                    {/* Rating */}
                    <div className="flex items-center gap-1">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={14}
                            fill={i < Math.floor(product.rating || 0) ? "currentColor" : "none"}
                            className={i < Math.floor(product.rating || 0) ? "text-amber-400" : "text-gray-300 dark:text-gray-600"}
                          />
                        ))}
                      </div>
                      {product.rating > 0 && (
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {product.rating.toFixed(1)}
                        </span>
                      )}
                    </div>
                    
                    {/* Sizes Preview */}
                    {product.sizes && product.sizes.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {product.sizes.slice(0, 4).map((size, idx) => (
                          <span
                            key={idx}
                            className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-0.5 rounded-md"
                          >
                            {size}
                          </span>
                        ))}
                        {product.sizes.length > 4 && (
                          <span className="text-xs text-gray-400">
                            +{product.sizes.length - 4}
                          </span>
                        )}
                      </div>
                    )}
                    
                    {/* Price */}
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-bold text-primary">
                        ${(product.price || 0).toFixed(2)}
                      </span>
                      {product.originalPrice && product.originalPrice > product.price && (
                        <span className="text-sm text-gray-400 line-through">
                          ${product.originalPrice.toFixed(2)}
                        </span>
                      )}
                    </div>
                    
                    {/* Stock Status */}
                    {isInStock && product.stock < 10 && product.stock > 0 && (
                      <div className="flex items-center gap-1 text-xs text-amber-600 dark:text-amber-400">
                        <Clock size={12} />
                        <span>Only {product.stock} left in stock</span>
                      </div>
                    )}
                    
                    {/* Action Buttons */}
                    <div className="flex gap-2 pt-2">
                      <button
                        onClick={() => openSizeModal(product)}
                        disabled={!isInStock || movingProduct === product._id}
                        className="flex-1 bg-primary text-white py-2 rounded-xl font-semibold hover:bg-primary-dark transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                      >
                        {movingProduct === product._id ? (
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <>
                            <ShoppingCart size={16} />
                            Move to Cart
                          </>
                        )}
                      </button>
                      
                      <button
                        onClick={() => handleRemoveItem(product._id)}
                        className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      >
                        <X size={16} />
                      </button>
                    </div>
                    
                    {/* Delivery Info */}
                    <div className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400 pt-1">
                      <Truck size={12} />
                      <span>Free delivery available</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      
      {/* Size Selection Modal */}
      {showSizeModal && selectedProduct && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowSizeModal(false);
          }}
        >
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full">
            <div className="p-6 border-b border-gray-100 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100">
                    <img 
                      src={selectedProduct.images?.[0]} 
                      alt={selectedProduct.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Select Size
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {selectedProduct.title}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowSizeModal(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <X size={20} />
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Choose Size
              </label>
              <div className="grid grid-cols-4 gap-2">
                {selectedProduct.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize({ [selectedProduct._id]: size })}
                    className={`py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                      selectedSize[selectedProduct._id] === size
                        ? 'bg-primary text-white shadow-md scale-105'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="flex gap-3 p-6 pt-0">
              <button
                onClick={() => setShowSizeModal(false)}
                className="flex-1 px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={() => handleMoveToCart(selectedProduct._id, selectedSize[selectedProduct._id])}
                className="flex-1 px-4 py-2 rounded-xl bg-primary text-white font-semibold"
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WishlistPage;