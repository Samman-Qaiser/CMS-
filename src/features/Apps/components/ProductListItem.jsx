import { useState, useRef } from "react";

// ── Reusable Star Rating ──────────────────────────────────────────────
function StarRating({ rating = 5, max = 5 }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: max }).map((_, i) => (
        <svg
          key={i}
          className={`w-4 h-4 ${i < Math.floor(rating) ? "text-yellow-400" : "text-slate-500"}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
      {rating > 0 && rating % 1 !== 0 && (
        <span className="text-xs text-gray-500 ml-1">({rating})</span>
      )}
    </div>
  );
}

// ── Main Reusable Component ───────────────────────────────────────────
export default function ProductListItem({ product }) {
  const [imgError, setImgError] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [glarePos, setGlarePos] = useState({ x: 50, y: 30 });
  const imgRef = useRef(null);

  // Extract product data from API response
  const productImage =
    product.images && product.images.length > 0
      ? product.images[0]
      : "https://via.placeholder.com/200x260/1e2240/ffffff?text=No+Image";

  const productName = product.title || product.name || "Untitled Product";
  const productRating = product.rating || 0;
  const reviewCount = product.totalReviews || 0;
  const productPrice = product.price || 0;
  const currency = "$";
  const isInStock = product.availability === "in_stock";
  const productCode = product.productCode || "N/A";
  const productBrand = product.brand || "Unknown";
  const productDescription = product.description || "No description available";

  const handleMouseMove = (e) => {
    const rect = imgRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setGlarePos({ x, y });
  };

  const handleWriteReview = () => {
    // You can implement review modal or redirect to review page
    console.log("Write review for product:", product._id);
  };

  return (
    <div
      className="bg-[#ffffff] dark:bg-[#292D4A] rounded-2xl p-5 flex gap-5 w-full shadow-lg max-w-xl"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onMouseMove={handleMouseMove}
    >
      {/* ── Product Image ── */}
      <div
        ref={imgRef}
        className="relative shrink-0 w-36 h-52 rounded-xl overflow-hidden bg-slate-100 dark:bg-[#1e2240]"
      >
        <img
          src={
            imgError
              ? "https://via.placeholder.com/144x208/1e2240/ffffff?text=No+Image"
              : productImage
          }
          alt={productName}
          className="w-full h-full object-cover object-top"
          onError={() => setImgError(true)}
        />
        {/* Glare overlay */}
        <div
          className="absolute inset-0 pointer-events-none rounded-xl transition-opacity duration-300"
          style={{
            opacity: hovered ? 1 : 0,
            background: `radial-gradient(ellipse 80px 60px at ${glarePos.x}% ${glarePos.y}%, rgba(255,255,255,0.45) 0%, rgba(255,255,255,0.08) 50%, transparent 80%)`,
          }}
        />
        {/* Subtle shine sweep on enter */}
        <div
          className="absolute inset-0 pointer-events-none rounded-xl transition-all duration-700"
          style={{
            opacity: hovered ? 1 : 0,
            background: `linear-gradient(115deg, transparent 30%, rgba(255,255,255,0.18) 50%, transparent 70%)`,
            transform: hovered ? "translateX(0%)" : "translateX(-100%)",
          }}
        />
      </div>

      {/* ── Product Details ── */}
      <div className="flex flex-col gap-2 flex-1 min-w-0">
        {/* Name */}
        <h2 className="text-header-text font-bold text-base leading-snug">
          {productName}
        </h2>

        {/* Stars + Review link */}
        <div className="flex items-center gap-2 flex-wrap">
          <StarRating rating={productRating} />
          <span className="text-content-text text-xs">
            ({reviewCount} reviews)
          </span>
          <span className="text-content-text text-xs">/</span>
          <button
            onClick={handleWriteReview}
            className="text-content-text text-xs underline underline-offset-2 hover:text-primary transition-colors"
          >
            Write a review?
          </button>
        </div>

        {/* Price */}
        <p className="text-primary font-bold text-2xl tracking-tight">
          {currency}
          {productPrice.toFixed(2)}
        </p>

        {/* Original Price if available */}
        {product.originalPrice && product.originalPrice > productPrice && (
          <p className="text-gray-400 text-sm line-through">
            {currency}
            {product.originalPrice.toFixed(2)}
          </p>
        )}

        {/* Availability */}
        <div className="flex items-center gap-1.5">
          <span className="text-content-text text-sm">Availability:</span>
          <span className="text-header-text text-sm font-semibold">
            {isInStock ? "In stock" : "Out of stock"}
          </span>
          {isInStock ? (
            <span className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center shrink-0">
              <svg
                className="w-2.5 h-2.5 text-white"
                fill="none"
                viewBox="0 0 12 12"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2 6l3 3 5-5"
                />
              </svg>
            </span>
          ) : (
            <span className="w-4 h-4 rounded-full bg-red-500 shrink-0" />
          )}
        </div>

        {/* Stock count if low */}
        {isInStock && product.stock > 0 && product.stock < 10 && (
          <p className="text-yellow-600 text-xs">
            Only {product.stock} left in stock
          </p>
        )}

        {/* Product Code */}
        <div className="flex items-center gap-1.5">
          <span className="text-content-text text-sm">Product code:</span>
          <span className="text-header-text text-sm font-bold">
            {productCode}
          </span>
        </div>

        {/* Brand */}
        <div className="flex items-center gap-1.5">
          <span className="text-content-text text-sm">Brand:</span>
          <span className="text-header-text text-sm font-bold">
            {productBrand}
          </span>
        </div>

        {/* Description */}
        <p className="text-content-text text-sm leading-relaxed mt-1 line-clamp-2">
          {productDescription}
        </p>
      </div>
    </div>
  );
}
