import React from "react";
import { Star } from "lucide-react";

const ProductCard = ({ product, categories = [] }) => {
  // Get the first image from the images array or use a placeholder
  const productImage =
    product.images && product.images.length > 0
      ? product.images[0]
      : "https://via.placeholder.com/400x400?text=No+Image";

  // Get product title (API uses 'title' field)
  const productTitle = product.title || product.name || "Untitled Product";

  // Get price (API uses 'price' field)
  const productPrice = product.price || 0;

  // Get rating (API uses 'rating' field)
  const productRating = product.rating || 0;

  // Check if product is in stock
  const isInStock = product.availability === "in_stock";
  const stockStatus = product.stock > 0 ? product.stock : 0;

  // Get category name
  const getCategoryName = () => {
    if (!product.category) return null;

    // If category is populated with name
    if (typeof product.category === "object" && product.category.name) {
      return product.category.name;
    }

    // If category is just an ID, find it in categories array
    const categoryId =
      typeof product.category === "object"
        ? product.category._id
        : product.category;
    const foundCategory = categories.find(
      (cat) => (cat._id || cat.id) === categoryId,
    );
    return foundCategory ? foundCategory.name : null;
  };

  const categoryName = getCategoryName();

  return (
    <div className="bg-white dark:bg-[#292D4A] rounded-lg p-6 flex flex-col items-center shadow-lg hover:shadow-2xl transition-shadow duration-300 relative">
      {/* Stock Badge */}
      {!isInStock && (
        <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded z-10">
          Out of Stock
        </div>
      )}
      {isInStock && stockStatus < 10 && stockStatus > 0 && (
        <div className="absolute top-2 right-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded z-10">
          Only {stockStatus} left
        </div>
      )}

      {/* Image Container */}
      <div className="w-full aspect-square rounded-xl overflow-hidden mb-4 bg-gray-100">
        <img
          src={productImage}
          alt={productTitle}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            e.target.src = "https://via.placeholder.com/400x400?text=No+Image";
          }}
        />
      </div>

      {/* Content */}
      <div className="text-center space-y-2 w-full">
        <h3 className="text-gray-800 dark:text-white font-bold text-sm min-h-[40px] flex items-center justify-center leading-tight">
          {productTitle}
        </h3>

        {/* Brand */}
        {product.brand && (
          <p className="text-gray-500 dark:text-gray-400 text-xs">
            {product.brand}
          </p>
        )}

        {/* Category */}
        {categoryName && (
          <p className="text-primary dark:text-primary-dark text-xs">
            {categoryName}
          </p>
        )}

        {/* Ratings */}
        <div className="flex justify-center text-yellow-500">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              size={14}
              fill={i < Math.floor(productRating) ? "currentColor" : "none"}
              className={
                i < productRating ? "text-yellow-500" : "text-slate-600"
              }
            />
          ))}
          {productRating > 0 && (
            <span className="text-xs text-gray-500 ml-1">
              ({productRating})
            </span>
          )}
        </div>

        {/* Price */}
        <div className="space-y-1">
          {product.originalPrice && product.originalPrice > product.price && (
            <div className="text-gray-400 text-sm line-through">
              ${product.originalPrice.toFixed(2)}
            </div>
          )}
          <div className="text-primary dark:text-primary-dark font-black text-xl">
            ${productPrice.toFixed(2)}
          </div>
        </div>

        {/* Sizes */}
        {product.sizes && product.sizes.length > 0 && (
          <div className="flex flex-wrap justify-center gap-1 mt-2">
            {product.sizes.slice(0, 3).map((size, idx) => (
              <span
                key={idx}
                className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded"
              >
                {size}
              </span>
            ))}
            {product.sizes.length > 3 && (
              <span className="text-xs text-gray-500">
                +{product.sizes.length - 3}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
