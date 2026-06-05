import { useState, useEffect } from "react";
import axios from "axios";
import ProductCard from "../components/ProductCard";

const ProductGrid = () => {
  const baseUrl =
    import.meta.env?.VITE_BACKEND_URL || "https://cms-backend-ashen.vercel.app";

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [categories, setCategories] = useState([]);

  // Fetch products on component mount
  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${baseUrl}/api/products`);
      console.log("Products API response:", response.data);

      // Handle different response structures
      let productsData = [];
      if (response.data) {
        if (Array.isArray(response.data)) {
          productsData = response.data;
        } else if (response.data.data && Array.isArray(response.data.data)) {
          productsData = response.data.data;
        } else if (
          response.data.products &&
          Array.isArray(response.data.products)
        ) {
          productsData = response.data.products;
        } else if (response.data.docs && Array.isArray(response.data.docs)) {
          productsData = response.data.docs;
        } else if (typeof response.data === "object") {
          for (const key in response.data) {
            if (Array.isArray(response.data[key])) {
              productsData = response.data[key];
              break;
            }
          }
        }
      }

      setProducts(productsData);
      console.log("Processed products:", productsData);

      if (productsData.length === 0) {
        console.warn("No products found in response");
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      setError(error.response?.data?.message || "Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${baseUrl}/api/product-categories`);
      console.log("Categories API response:", response.data);

      let categoriesData = [];
      if (response.data) {
        if (Array.isArray(response.data)) {
          categoriesData = response.data;
        } else if (response.data.data && Array.isArray(response.data.data)) {
          categoriesData = response.data.data;
        } else if (
          response.data.categories &&
          Array.isArray(response.data.categories)
        ) {
          categoriesData = response.data.categories;
        } else if (response.data.docs && Array.isArray(response.data.docs)) {
          categoriesData = response.data.docs;
        }
      }
      setCategories(categoriesData);
      console.log("Processed categories:", categoriesData);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  // Helper function to get category ID from product 
  const getProductCategoryId = (product) => {
    if (!product.category) return null;

    // If category is an object with _id property
    if (typeof product.category === "object" && product.category._id) {
      return product.category._id;
    }
    // If category is a string (ObjectId)
    if (typeof product.category === "string") {
      return product.category;
    }
    return null;
  };

  // Filter products based on search and category
  const filteredProducts = products.filter((product) => {
    // Search filter
    const matchesSearch =
      product.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.brand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.productCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchTerm.toLowerCase());

    // Category filter
    let matchesCategory = true;
    if (selectedCategory) {
      const productCategoryId = getProductCategoryId(product);
      matchesCategory = productCategoryId === selectedCategory;

      // Debug logging (remove in production)
      if (searchTerm || selectedCategory) {
        console.log(
          `Product: ${product.title}, Category ID: ${productCategoryId}, Selected: ${selectedCategory}, Matches: ${matchesCategory}`,
        );
      }
    }

    return matchesSearch && matchesCategory;
  });

  // Debug logging for filtered products count
  console.log(
    `Total products: ${products.length}, Filtered: ${filteredProducts.length}`,
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="mt-4 text-gray-600">Loading products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-xl mb-4">⚠️ {error}</div>
          <button
            onClick={fetchProducts}
            className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen space-y-3 font-sans p-6">
      {/* Breadcrumb */}
      <div className="bg-white dark:bg-[#252b48] text-header-text rounded-lg p-3 mb-8 text-sm">
        <span className="font-bold">Shop</span>
        <span className="mx-2 opacity-50 text-slate-300">/</span>
        <span>Product Grid</span>
      </div>

      {/* Filters Section */}
      <div className="bg-white dark:bg-[#292D4A] rounded-lg p-4 mb-6">
        <div className="flex flex-wrap gap-4 items-center justify-between">
          {/* Search Input */}
          <div className="flex-1 min-w-[200px]">
            <input
              type="text"
              placeholder="Search products by title, brand, or code..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-white dark:border-gray-600"
            />
          </div>

          {/* Category Filter */}
          <div className="min-w-[200px]">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-white dark:border-gray-600"
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option
                  key={category._id || category.id}
                  value={category._id || category.id}
                >
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* Results Count */}
          <div className="text-gray-600 dark:text-gray-300">
            {filteredProducts.length} product
            {filteredProducts.length !== 1 ? "s" : ""} found
          </div>

          {/* Clear Filters Button */}
          {(searchTerm || selectedCategory) && (
            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("");
              }}
              className="px-4 py-2 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors"
            >
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* Grid Container */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-[#292D4A] rounded-lg">
          <p className="text-gray-500 dark:text-gray-400 text-lg">
            No products found matching your criteria.
          </p>
          {(searchTerm || selectedCategory) && (
            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("");
              }}
              className="mt-4 text-primary hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
            >
              Clear all filters
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product._id || product.id}
              product={product}
              categories={categories} 
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductGrid;
