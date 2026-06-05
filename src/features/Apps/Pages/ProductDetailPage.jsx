import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { ShoppingCart, Star, ArrowLeft } from "lucide-react";
import Swal from "sweetalert2";

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

  useEffect(() => {
    fetchProduct();
    fetchCategories();
  }, [id]);

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
            className=" font-bold cursor-pointer text-primary"
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

            {/* Thumbnail Images - Show ALL images */}
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

            {/* Show message if only one image */}
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
                      i < Math.floor(product.rating || 0)
                        ? "currentColor"
                        : "none"
                    }
                    className={
                      i < (product.rating || 0)
                        ? "text-yellow-500"
                        : "text-slate-600"
                    }
                  />
                ))}
              </div>
              <span className="text-xs text-content-text">
                ({product.totalReviews || 0} reviews) /
              </span>
              <button className="text-xs text-primary border-b border-primary/30 hover:text-primary-dark transition-colors">
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
                    ? "text-content-text cursor-not-allowed"
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
      </div>
    </div>
  );
};

export default ProductDetailPage;
