import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { ShoppingCart, Star, ArrowLeft } from "lucide-react";
import Swal from "sweetalert2";
import ReviewModal from "../components/ReviewModal";

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const baseUrl =
    import.meta.env?.VITE_BACKEND_URL || "https://cms-backend-ashen.vercel.app";

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [mainImage, setMainImage] = useState("");
  const [categories, setCategories] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);

  // Review Modal States
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  const fetchProduct = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${baseUrl}/api/products/${id}`);
      console.log("Product API response:", response.data);

      let productData = null;
      if (response.data) {
        if (response.data.product) {
          productData = response.data.product;
        } else if (response.data.data) {
          productData = response.data.data;
        } else {
          productData = response.data;
        }
      }

      setProduct(productData);
      setMainImage(
        productData?.images?.[0] ||
          "https://via.placeholder.com/600x600?text=No+Image",
      );
      setSelectedSize(productData?.sizes?.[0] || "");
    } catch (error) {
      console.error("Error fetching product:", error);
      setError(error.response?.data?.message || "Failed to load product");
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${baseUrl}/api/product-categories`);
      let categoriesData = [];
      if (response.data) {
        if (
          response.data.categories &&
          Array.isArray(response.data.categories)
        ) {
          categoriesData = response.data.categories;
        } else if (response.data.data && Array.isArray(response.data.data)) {
          categoriesData = response.data.data;
        } else if (Array.isArray(response.data)) {
          categoriesData = response.data;
        }
      }
      setCategories(categoriesData);
      console.log("Categories loaded:", categoriesData);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchReviews = async () => {
    setReviewsLoading(true);
    try {
      // Only fetch from the working endpoint that returns all reviews
      const response = await axios.get(`${baseUrl}/api/products/reviews/all`);

      console.log("Current Product ID:", id);
      console.log("All Reviews API response:", response.data);

      let allReviews = [];

      // Parse the response - your API returns { success: true, total: 1, reviews: [...] }
      if (response.data) {
        if (response.data.reviews && Array.isArray(response.data.reviews)) {
          allReviews = response.data.reviews;
        } else if (response.data.data && Array.isArray(response.data.data)) {
          allReviews = response.data.data;
        } else if (Array.isArray(response.data)) {
          allReviews = response.data;
        }
      }

      console.log("Parsed all reviews array:", allReviews);

      // Filter reviews that belong to this product
      const productReviews = allReviews.filter((review) => {
        // Get product ID from review (handles both populated and unpopulated)
        let reviewProductId = null;
        if (review.product) {
          if (typeof review.product === "object" && review.product._id) {
            reviewProductId = review.product._id;
          } else if (typeof review.product === "string") {
            reviewProductId = review.product;
          }
        }

        console.log(
          `Review product ID: ${reviewProductId}, Current product ID: ${id}, Match: ${reviewProductId === id}`,
        );
        return reviewProductId === id;
      });

      // Sort reviews by date (newest first)
      const sortedReviews = productReviews.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
      );

      setReviews(sortedReviews);
      console.log("Filtered reviews for this product:", sortedReviews);
      console.log("Total reviews to display:", sortedReviews.length);
    } catch (error) {
      console.error("Error fetching reviews:", error);
      setReviews([]);
    } finally {
      setReviewsLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
    fetchCategories();
    fetchReviews();
    console.log("Current product ID from URL:", id);
  }, [id]);

  const getCategoryName = () => {
    if (!product?.category) return null;

    if (typeof product.category === "object" && product.category.name) {
      return product.category.name;
    }

    const categoryId =
      typeof product.category === "object"
        ? product.category._id
        : product.category;
    const foundCategory = categories.find(
      (cat) => (cat._id || cat.id) === categoryId,
    );
    return foundCategory ? foundCategory.name : null;
  };

  const handleAddToCart = () => {
    if (!selectedSize && product?.sizes?.length > 0) {
      Swal.fire({
        title: "Please select a size",
        icon: "warning",
        confirmButtonColor: "#3085d6",
      });
      return;
    }

    Swal.fire({
      title: "Added to Cart!",
      text: `${quantity} × ${product?.title} added to your cart`,
      icon: "success",
      confirmButtonColor: "#3085d6",
      timer: 2000,
      timerProgressBar: true,
    });
  };

  // Calculate average rating from reviews
  const averageRating =
    reviews.length > 0
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
      : product?.rating || 0;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="mt-4 text-gray-600">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-xl mb-4">
            ⚠️ {error || "Product not found"}
          </div>
          <button
            onClick={() => navigate("/dashboard/ecom-product-grid")}
            className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark"
          >
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen font-sans text-slate-300">
      {/* Breadcrumb */}
      <div className="bg-white dark:bg-[#252b48] rounded-lg p-4 mb-8 text-sm flex justify-between items-center">
        <div>
          <span
            onClick={() => navigate("/dashboard/ecom-product-grid")}
            className="font-bold cursor-pointer text-primary"
          >
            Shop
          </span>
          <span className="mx-2 text-content-text">/</span>
          <span className="text-header-text">Product Detail</span>
        </div>
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm hover:text-primary transition-colors"
        >
          <ArrowLeft size={16} />
          Go Back
        </button>
      </div>

      <div className="mx-auto bg-white dark:bg-[#252b48] rounded-lg shadow-2xl p-6 md:p-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Side: Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="rounded-lg overflow-hidden border border-slate-700 bg-gray-100 dark:bg-gray-800">
              <img
                src={mainImage}
                alt={product.title}
                className="w-full h-auto object-cover min-h-[400px]"
                onError={(e) => {
                  e.target.src =
                    "https://via.placeholder.com/600x600?text=No+Image";
                }}
              />
            </div>

            {/* Thumbnail Images */}
            {product.images && product.images.length > 0 && (
              <div className="grid grid-cols-4 gap-3">
                {product.images.map((img, idx) => (
                  <div
                    key={idx}
                    onClick={() => setMainImage(img)}
                    className={`cursor-pointer rounded border transition-all overflow-hidden ${
                      mainImage === img
                        ? "border-primary ring-2 ring-primary"
                        : "border-slate-700 hover:border-primary"
                    }`}
                  >
                    <img
                      src={img}
                      alt={`Thumbnail ${idx + 1}`}
                      className="w-full h-20 object-cover"
                      onError={(e) => {
                        e.target.src =
                          "https://via.placeholder.com/150x150?text=No+Image";
                      }}
                    />
                  </div>
                ))}
              </div>
            )}

            {product.images && product.images.length === 1 && (
              <p className="text-xs text-gray-500 text-center">
                Only one image available
              </p>
            )}
          </div>

          {/* Right Side: Details */}
          <div className="flex flex-col">
            <h1 className="text-2xl font-bold text-primary mb-2">
              {product.title}
            </h1>

            {/* Rating */}
            <div className="flex items-center space-x-2 mb-4">
              <div className="flex text-yellow-500">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    fill={
                      i < Math.floor(averageRating) ? "currentColor" : "none"
                    }
                    className={
                      i < averageRating ? "text-yellow-500" : "text-slate-600"
                    }
                  />
                ))}
              </div>
              <span className="text-xs text-content-text">
                ({reviews.length} reviews) /
              </span>
              <button
                onClick={() => setIsReviewModalOpen(true)}
                className="text-xs text-primary border-b border-primary/30 hover:text-primary-dark transition-colors"
              >
                Write a review?
              </button>
            </div>

            <div className="space-y-2">
              <div className="text-3xl font-black text-primary">
                ${(product.price || 0).toFixed(2)}
              </div>
              {product.originalPrice &&
                product.originalPrice > product.price && (
                  <div className="text-content-text text-sm line-through">
                    ${product.originalPrice.toFixed(2)}
                  </div>
                )}
            </div>

            {/* Meta Info */}
            <div className="space-y-2 text-sm mb-8 mt-4">
              <p>
                <span className="text-content-text">Availability:</span>
                <span
                  className={`ml-2 font-medium ${product.availability === "in_stock" ? "text-green-500" : "text-red-500"}`}
                >
                  {product.availability === "in_stock"
                    ? "In Stock"
                    : product.availability === "out_of_stock"
                      ? "Out of Stock"
                      : "Pre Order"}
                </span>
              </p>
              {product.stock > 0 && product.stock < 10 && (
                <p className="text-yellow-500 text-xs">
                  Only {product.stock} left in stock
                </p>
              )}
              <p>
                <span className="text-content-text">Product code:</span>{" "}
                <span className="text-content-text ml-2 font-medium">
                  {product.productCode || "N/A"}
                </span>
              </p>
              <p>
                <span className="text-content-text">Brand:</span>{" "}
                <span className="text-content-text ml-2 font-medium">
                  {product.brand || "N/A"}
                </span>
              </p>
              <p>
                <span className="text-content-text">Category:</span>{" "}
                <span className="text-content-text ml-2 font-medium">
                  {getCategoryName() || "Uncategorized"}
                </span>
              </p>
              {product.tags && product.tags.length > 0 && (
                <div className="flex items-center gap-2">
                  <span className="text-content-text">Product tags:</span>
                  <div className="flex gap-1 flex-wrap">
                    {product.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-0.5 border border-green-500/50 text-green-400 text-[10px] rounded-full uppercase"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <p className="text-sm leading-relaxed opacity-70 mb-8 max-w-lg">
              {product.description || "No description available"}
            </p>

            {/* Size Selector */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="mb-8">
                <h3 className="font-bold uppercase text-xs mb-3 italic">
                  select size
                </h3>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-5 py-2 text-xs font-bold border rounded-lg transition-all ${
                        selectedSize === size
                          ? "bg-primary text-white border-primary"
                          : "bg-[#1a1c2e] border-slate-700 text-slate-400 hover:text-white"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center gap-4">
              <input
                type="number"
                min="1"
                max={product.stock || 999}
                value={quantity}
                onChange={(e) =>
                  setQuantity(
                    Math.min(
                      parseInt(e.target.value) || 1,
                      product.stock || 999,
                    ),
                  )
                }
                className="w-20 bg-[#1a1c2e] border border-slate-700 rounded p-3 text-center text-white focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button
                onClick={handleAddToCart}
                disabled={product.availability !== "in_stock"}
                className={`flex-1 bg-primary hover:opacity-90 text-white font-bold py-3.5 px-8 rounded-lg flex items-center justify-center gap-2 transition-all uppercase tracking-wide ${
                  product.availability !== "in_stock"
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
              >
                <ShoppingCart size={18} />
                {product.availability === "in_stock"
                  ? "Add to cart"
                  : product.availability === "pre_order"
                    ? "Pre Order"
                    : "Out of Stock"}
              </button>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-12 pt-8 border-t border-slate-700">
          <h2 className="text-xl font-bold text-primary mb-6">
            Customer Reviews
          </h2>

          {reviewsLoading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <p className="mt-2 text-sm text-content-text">
                Loading reviews...
              </p>
            </div>
          ) : reviews.length === 0 ? (
            <div className="text-center py-8 bg-gray-50 dark:bg-[#1a1c2e] rounded-lg">
              <p className="text-content-text">
                No reviews yet. Be the first to review this product!
              </p>
              <button
                onClick={() => setIsReviewModalOpen(true)}
                className="mt-3 text-primary hover:text-primary-dark text-sm font-medium"
              >
                Write a review →
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {reviews.map((review, index) => (
                <div
                  key={review._id || index}
                  className="bg-gray-50 dark:bg-[#1a1c2e] rounded-lg p-4"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="flex text-yellow-500">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={14}
                            fill={i < review.rating ? "currentColor" : "none"}
                            className={
                              i < review.rating
                                ? "text-yellow-500"
                                : "text-slate-600"
                            }
                          />
                        ))}
                      </div>
                      <span className="text-xs text-content-text">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <span
                      className={`text-xs px-2 py-1 rounded ${
                        review.status === "approved"
                          ? "bg-green-500/20 text-green-400"
                          : review.status === "pending"
                            ? "bg-yellow-500/20 text-yellow-400"
                            : "bg-red-500/20 text-red-400"
                      }`}
                    >
                      {review.status || "approved"}
                    </span>
                  </div>

                  {/* User info if available */}
                  {review.user && (
                    <p className="text-xs text-content-text mb-2">
                      By:{" "}
                      {typeof review.user === "object"
                        ? review.user.name || review.user.email
                        : review.user}
                    </p>
                  )}

                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    {review.comment}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      <ReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        productId={id}
        onReviewSubmitted={() => {
          fetchReviews(); 
          fetchProduct(); 
        }}
      />
    </div>
  );
};

export default ProductDetailPage;
