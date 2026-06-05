import { useState, useEffect } from "react";
import axios from "axios";
import ProductListItem from "../components/ProductListItem";

const ProductListPage = () => {
  const baseUrl =
    import.meta.env?.VITE_BACKEND_URL || "https://cms-backend-ashen.vercel.app";

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [sortBy, setSortBy] = useState("newest");

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

  // Build a map of parent to child categories
  const buildCategoryTree = (categoriesList) => {
    const categoryMap = {};

    // First, create a map of all categories
    categoriesList.forEach((category) => {
      const categoryId = category._id || category.id;
      categoryMap[categoryId] = {
        ...category,
        children: [],
      };
    });

    // Build the tree structure
    categoriesList.forEach((category) => {
      const categoryId = category._id || category.id;
      const parentId = category.parentCategory
        ? typeof category.parentCategory === "object"
          ? category.parentCategory._id
          : category.parentCategory
        : null;

      if (parentId && categoryMap[parentId]) {
        categoryMap[parentId].children.push(categoryMap[categoryId]);
      }
    });

    return categoryMap;
  };

  // Get all child category IDs recursively
  const getAllChildCategoryIds = (categoryId, categoryMap) => {
    const childIds = [categoryId];
    const category = categoryMap[categoryId];

    if (category && category.children) {
      category.children.forEach((child) => {
        const childId = child._id || child.id;
        childIds.push(...getAllChildCategoryIds(childId, categoryMap));
      });
    }

    return childIds;
  };

  // Get hierarchical categories for dropdown
  const getHierarchicalCategories = (categoriesList) => {
    const categoryMap = buildCategoryTree(categoriesList);
    const hierarchicalList = [];

    const addCategoryWithChildren = (category, level = 0) => {
      hierarchicalList.push({
        ...category,
        level: level,
      });

      const sortedChildren = [...category.children].sort((a, b) =>
        a.name.localeCompare(b.name),
      );

      sortedChildren.forEach((child) => {
        addCategoryWithChildren(child, level + 1);
      });
    };

    // Get root categories
    const rootCategories = Object.values(categoryMap).filter(
      (cat) =>
        !cat.parentCategory ||
        (typeof cat.parentCategory === "object" && !cat.parentCategory._id) ||
        (typeof cat.parentCategory === "string" && !cat.parentCategory),
    );

    rootCategories.sort((a, b) => a.name.localeCompare(b.name));
    rootCategories.forEach((category) => {
      addCategoryWithChildren(category, 0);
    });

    return hierarchicalList;
  };

  // Helper function to get category ID from product
  const getProductCategoryId = (product) => {
    if (!product.category) return null;

    if (typeof product.category === "object" && product.category._id) {
      return product.category._id;
    }
    if (typeof product.category === "string") {
      return product.category;
    }
    return null;
  };

  const categoryMap = buildCategoryTree(categories);
  const hierarchicalCategories = getHierarchicalCategories(categories);

  // Filter and sort products
  const filteredAndSortedProducts = products
    .filter((product) => {
      // Search filter
      const matchesSearch =
        product.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.brand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.productCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchTerm.toLowerCase());

      // Category filter (including child categories)
      let matchesCategory = true;
      if (selectedCategory) {
        const productCategoryId = getProductCategoryId(product);
        const validCategoryIds = getAllChildCategoryIds(
          selectedCategory,
          categoryMap,
        );
        matchesCategory = validCategoryIds.includes(productCategoryId);
      }

      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return (a.price || 0) - (b.price || 0);
        case "price-high":
          return (b.price || 0) - (a.price || 0);
        case "rating":
          return (b.rating || 0) - (a.rating || 0);
        case "newest":
          return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
        default:
          return 0;
      }
    });

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
    <div className="min-h-screen font-sans p-6">
      {/* Breadcrumb */}
      <div className="bg-white text-header-text dark:bg-[#252b48] rounded-lg p-3 mb-8 text-sm">
        <span className="text-header-text font-bold">Shop</span>
        <span className="mx-2 opacity-50 text-content-text">/</span>
        <span className="text-content-text">Product List</span>
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
          <div className="min-w-[250px]">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-white dark:border-gray-600 font-mono text-sm"
            >
              <option value="">📁 All Categories</option>
              {hierarchicalCategories.map((category) => (
                <option
                  key={category._id || category.id}
                  value={category._id || category.id}
                  style={{ paddingLeft: `${category.level * 20}px` }}
                >
                  {category.level === 0 ? "📁 " : "📄 "}
                  {category.level > 0
                    ? "  ".repeat(category.level) + "  "
                    : ""}
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* Sort By */}
          <div className="min-w-[180px]">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-white dark:border-gray-600"
            >
              <option value="newest">Newest First</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>

          {/* Results Count */}
          <div className="text-gray-600 dark:text-gray-300">
            {filteredAndSortedProducts.length} product
            {filteredAndSortedProducts.length !== 1 ? "s" : ""} found
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

      {/* List Container */}
      {filteredAndSortedProducts.length === 0 ? (
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredAndSortedProducts.map((product) => (
            <ProductListItem
              key={product._id || product.id}
              product={product}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductListPage;
