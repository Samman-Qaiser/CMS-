import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useState, useEffect } from 'react'
import { Star, ShoppingBag, Heart, X } from 'lucide-react'
import axios from 'axios'
import Swal from 'sweetalert2'

const baseUrl =
  import.meta.env?.VITE_BACKEND_URL ||
  "https://cms-backend-ashen.vercel.app";

const ProductCard = ({ product, categories = [], onAddToCart, onWishlistUpdate }) => {
  const navigate = useNavigate()
  const user = useSelector((state) => state.auth.user)
  const [addingToCart, setAddingToCart] = useState(false)
  const [addedToCart, setAddedToCart] = useState(false)
  const [isInWishlist, setIsInWishlist] = useState(false)
  const [wishlistLoading, setWishlistLoading] = useState(false)
  
  // Size selection modal state
  const [showSizeModal, setShowSizeModal] = useState(false)
  const [selectedSize, setSelectedSize] = useState(null)
  const [selectedQuantity, setSelectedQuantity] = useState(1)

  const productImage =
    product.images && product.images.length > 0
      ? product.images[0]
      : "https://via.placeholder.com/400x400?text=No+Image"

  const productTitle = product.title || product.name || "Untitled Product"
  const productPrice = product.price || 0
  const productRating = product.rating || 0
  const isInStock = product.availability === "in_stock"
  const stockStatus = product.stock > 0 ? product.stock : 0
  const hasSizes = product.sizes && product.sizes.length > 0

  // Check if product is in wishlist on component mount
  useEffect(() => {
    if (user?.id && product._id) {
      checkWishlistStatus()
    }
  }, [user?.id, product._id])

  const getCategoryName = () => {
    if (!product.category) return null
    if (typeof product.category === "object" && product.category.name) {
      return product.category.name
    }
    const categoryId =
      typeof product.category === "object"
        ? product.category._id
        : product.category
    const foundCategory = categories.find(
      (cat) => (cat._id || cat.id) === categoryId
    )
    return foundCategory ? foundCategory.name : null
  }

  const categoryName = getCategoryName()

  const discountPercentage =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round(
          ((product.originalPrice - product.price) / product.originalPrice) * 100
        )
      : 0

  // ─── Check Wishlist Status ──────────────────────────
  const checkWishlistStatus = async () => {
    if (!user?.id) return
    
    try {
      const response = await axios.get(`${baseUrl}/api/wishlist/${user.id}`)
      if (response.data && response.data.items) {
        const isProductInWishlist = response.data.items.some(
          item => item.productId === product._id || item.product?._id === product._id
        )
        setIsInWishlist(isProductInWishlist)
      }
    } catch (error) {
      console.error("Error checking wishlist status:", error)
    }
  }

  // ─── Add to Wishlist ─────────────────────────────────
  const handleAddToWishlist = async (e) => {
    e.stopPropagation()

    if (!user?.id) {
      Swal.fire({
        title: 'Login Required!',
        text: 'Please login to add items to wishlist',
        icon: 'warning',
        confirmButtonColor: 'var(--primary)',
        confirmButtonText: 'Login Now',
        showCancelButton: true,
      }).then((result) => {
        if (result.isConfirmed) {
          navigate('/login')
        }
      })
      return
    }

    if (wishlistLoading) return

    try {
      setWishlistLoading(true)

      if (isInWishlist) {
        // Remove from wishlist
        await axios.delete(`${baseUrl}/api/wishlist/remove`, {
          data: {
            userId: user.id,
            productId: product._id
          }
        })

        setIsInWishlist(false)
        
        Swal.fire({
          title: 'Removed!',
          text: 'Product removed from wishlist',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false,
          toast: true,
          position: 'top-end',
        })
      } else {
        // Add to wishlist
        await axios.post(`${baseUrl}/api/wishlist/add`, {
          userId: user.id,
          productId: product._id
        })

        setIsInWishlist(true)
        
        Swal.fire({
          title: 'Added!',
          text: 'Product added to wishlist',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false,
          toast: true,
          position: 'top-end',
        })
      }

      if (onWishlistUpdate) {
        onWishlistUpdate(product._id, !isInWishlist)
      }

    } catch (error) {
      console.error("Wishlist operation error:", error)
      Swal.fire({
        title: 'Error!',
        text: error.response?.data?.message || 'Something went wrong',
        icon: 'error',
        confirmButtonColor: 'var(--primary)',
      })
    } finally {
      setWishlistLoading(false)
    }
  }

  // ─── Open Size Selection Modal ──────────────────────
  const openSizeModal = (e) => {
    e.stopPropagation()
    
    if (!user?.id) {
      Swal.fire({
        title: 'Login Required!',
        text: 'Please login to add items to cart',
        icon: 'warning',
        confirmButtonColor: 'var(--primary)',
      })
      return
    }

    if (!isInStock) return

    // If product has sizes, show modal
    if (hasSizes) {
      setSelectedSize(product.sizes[0]) // Default select first size
      setSelectedQuantity(1)
      setShowSizeModal(true)
    } else {
      // If no sizes, add directly to cart
      addToCart(null, 1)
    }
  }

  // ─── Add to Cart with Selected Size ──────────────────
  const addToCart = async (size, quantity) => {
    try {
      setAddingToCart(true)

      await axios.post(`${baseUrl}/api/cart/add`, {
        userId: user.id,
        productId: product._id,
        quantity: quantity,
        size: size || null,
      })

      setAddedToCart(true)
      setTimeout(() => setAddedToCart(false), 2000)

      if (onAddToCart) onAddToCart(product)

      Swal.fire({
        title: 'Added to Cart!',
        text: `${productTitle} ${size ? `(${size})` : ''} added successfully`,
        icon: 'success',
        timer: 1500,
        showConfirmButton: false,
        toast: true,
        position: 'top-end',
      })
    } catch (error) {
      Swal.fire({
        title: 'Error!',
        text: error.response?.data?.message || 'Something went wrong',
        icon: 'error',
        confirmButtonColor: 'var(--primary)',
      })
    } finally {
      setAddingToCart(false)
      setShowSizeModal(false)
    }
  }

  // ─── Handle Confirm Add to Cart ──────────────────────
  const handleConfirmAddToCart = () => {
    if (hasSizes && !selectedSize) {
      Swal.fire({
        title: 'Select Size!',
        text: 'Please select a size before adding to cart',
        icon: 'warning',
        confirmButtonColor: 'var(--primary)',
      })
      return
    }
    addToCart(selectedSize, selectedQuantity)
  }

  // ─── Handle Quantity Change ──────────────────────────
  const handleQuantityChange = (increment) => {
    const maxStock = product.stock || 10
    const newQuantity = selectedQuantity + increment
    if (newQuantity >= 1 && newQuantity <= maxStock) {
      setSelectedQuantity(newQuantity)
    }
  }

  // ─── Navigate to Detail ───────────────────────────
  const handleCardClick = () => {
    navigate(`/dashboard/ecom-product-detail/${product._id}`)
  }

  return (
    <>
      <div
        onClick={handleCardClick}
        className="group relative flex flex-col justify-between overflow-hidden rounded-2xl bg-white border border-gray-100 dark:border-slate-700/50 dark:bg-[#1E2235] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_20px_40px_rgba(0,0,0,0.12)] dark:hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)] cursor-pointer"
      >
        {/* Image Container */}
        <div className="relative aspect-square w-full overflow-hidden bg-gray-50 dark:bg-slate-900/50">
          <img
            src={productImage}
            alt={productTitle}
            className="h-full w-full object-contain p-3 transition-transform duration-700 group-hover:scale-110"
            onError={(e) => {
              e.target.src = "https://via.placeholder.com/400x400?text=No+Image"
            }}
          />

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
            {!isInStock && (
              <span className="backdrop-blur-md bg-red-500/90 text-white text-[10px] font-bold tracking-wide uppercase px-2.5 py-1 rounded-full shadow-sm">
                Out of Stock
              </span>
            )}
            {isInStock && stockStatus < 10 && stockStatus > 0 && (
              <span className="backdrop-blur-md bg-amber-500/90 text-white text-[10px] font-bold tracking-wide uppercase px-2.5 py-1 rounded-full shadow-sm">
                Only {stockStatus} Left
              </span>
            )}
            {discountPercentage > 0 && (
              <span className="bg-emerald-500 text-white text-[10px] font-bold tracking-wide uppercase px-2.5 py-1 rounded-full shadow-sm">
                {discountPercentage}% OFF
              </span>
            )}
            {product.isFeatured && (
              <span className="bg-primary text-white text-[10px] font-bold tracking-wide uppercase px-2.5 py-1 rounded-full shadow-sm">
                Featured
              </span>
            )}
          </div>

          {/* Wishlist button */}
          <button
            onClick={handleAddToWishlist}
            disabled={wishlistLoading}
            className={`absolute top-3 right-3 w-8 h-8 rounded-full bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-sm z-10 ${
              isInWishlist 
                ? 'opacity-100 scale-100' 
                : 'opacity-0 group-hover:opacity-100'
            }`}
          >
            {wishlistLoading ? (
              <div className="w-3 h-3 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
            ) : (
              <Heart 
                size={14} 
                className={`transition-all duration-200 ${
                  isInWishlist 
                    ? 'fill-red-500 text-red-500' 
                    : 'text-gray-400 hover:text-red-500'
                }`}
              />
            )}
          </button>
        </div>

        {/* Content */}
        <div className="p-4 flex flex-col gap-3">

          {/* Brand & Category */}
          <div className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-wider text-gray-400 dark:text-slate-500">
            {product.brand && (
              <span className="bg-gray-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
                {product.brand}
              </span>
            )}
            {categoryName && (
              <span className="bg-primary/10 text-primary px-2 py-0.5 rounded-md">
                {categoryName}
              </span>
            )}
          </div>

          {/* Title */}
          <h3 className="line-clamp-2 text-sm font-semibold text-gray-800 dark:text-slate-100 group-hover:text-primary dark:group-hover:text-primary transition-colors duration-200 leading-snug">
            {productTitle}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-1.5">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={11}
                  fill={i < Math.floor(productRating) ? "currentColor" : "none"}
                  className={
                    i < Math.floor(productRating)
                      ? "text-amber-400"
                      : "text-gray-200 dark:text-slate-700"
                  }
                />
              ))}
            </div>
            {productRating > 0 ? (
              <span className="text-xs font-medium text-gray-500 dark:text-slate-400">
                {productRating.toFixed(1)}
              </span>
            ) : (
              <span className="text-xs text-gray-400 dark:text-slate-500">
                No reviews
              </span>
            )}
            {product.totalReviews > 0 && (
              <span className="text-xs text-gray-400 dark:text-slate-500">
                ({product.totalReviews})
              </span>
            )}
          </div>

          {/* Sizes */}
          {hasSizes && (
            <div className="flex flex-wrap gap-1">
              {product.sizes.slice(0, 4).map((size, idx) => (
                <span
                  key={idx}
                  className="text-[10px] font-bold bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-300 px-2 py-0.5 rounded-md border border-gray-200 dark:border-slate-700"
                >
                  {size}
                </span>
              ))}
              {product.sizes.length > 4 && (
                <span className="text-[10px] text-gray-400 self-center">
                  +{product.sizes.length - 4}
                </span>
              )}
            </div>
          )}

          {/* Tags */}
          {product.tags && product.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {product.tags.slice(0, 3).map((tag, idx) => (
                <span
                  key={idx}
                  className="text-[10px] font-medium bg-primary/5 text-primary/70 px-2 py-0.5 rounded-full border border-primary/10"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Price + Add to Cart */}
          <div className="flex items-center justify-between pt-2 border-t border-gray-50 dark:border-slate-800/50 mt-1">
            <div className="flex flex-col">
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-xs text-gray-400 line-through">
                  ${product.originalPrice.toFixed(2)}
                </span>
              )}
              <span className="text-lg font-bold text-gray-900 dark:text-white">
                ${productPrice.toFixed(2)}
              </span>
            </div>

            {/* Add To Cart Button */}
            <button
              onClick={openSizeModal}
              disabled={!isInStock || addingToCart}
              className={`flex items-center gap-2 px-3 h-9 rounded-xl font-bold text-xs transition-all duration-200 shadow-sm disabled:opacity-40 disabled:cursor-not-allowed ${
                addedToCart
                  ? 'bg-green-500 text-white scale-95'
                  : 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 hover:bg-primary hover:text-white dark:hover:bg-primary dark:hover:text-white hover:scale-105'
              }`}
              title="Add to Cart"
            >
              {addingToCart ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : addedToCart ? (
                <>
                  <span>✓</span>
                  <span>Added</span>
                </>
              ) : (
                <>
                  <ShoppingBag size={14} />
                  <span>Add</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Size Selection Modal */}
      {showSizeModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowSizeModal(false)
          }}
        >
          <div className="relative bg-white dark:bg-[#1E2235] rounded-2xl shadow-2xl max-w-md w-full transform animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-800">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100">
                  <img 
                    src={productImage} 
                    alt={productTitle}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Select Size
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {productTitle}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowSizeModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              {/* Size Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Choose Size
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`py-2 px-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                        selectedSize === size
                          ? 'bg-primary text-white shadow-md scale-105'
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Quantity
                </label>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => handleQuantityChange(-1)}
                    disabled={selectedQuantity <= 1}
                    className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    -
                  </button>
                  <span className="text-lg font-semibold text-gray-900 dark:text-white min-w-[40px] text-center">
                    {selectedQuantity}
                  </span>
                  <button
                    onClick={() => handleQuantityChange(1)}
                    disabled={selectedQuantity >= (product.stock || 10)}
                    className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    +
                  </button>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {product.stock} available
                  </span>
                </div>
              </div>

              {/* Price Summary */}
              <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600 dark:text-gray-400">Price</span>
                  <span className="text-gray-900 dark:text-white font-semibold">
                    ${productPrice.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Total</span>
                  <span className="text-xl font-bold text-primary">
                    ${(productPrice * selectedQuantity).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex gap-3 p-6 pt-0">
              <button
                onClick={() => setShowSizeModal(false)}
                className="flex-1 px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmAddToCart}
                className="flex-1 px-4 py-2 rounded-xl bg-primary text-white font-semibold hover:bg-primary-dark transition-colors shadow-md"
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default ProductCard