import React from 'react';
import ProductListItem from '../components/ProductListItem';

const ProductListPage = () => {
  const products = [
    {
      id: 1,
      name: "Solid Women's V-neck Dark T-Shirt",
      price: 320.00,
      rating: 3,
      reviews: 54,
      code: "0405689",
      brand: "Lee",
      description: "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words.",
      image: "https://images.pexels.com/photos/1036622/pexels-photo-1036622.jpeg?auto=compress&cs=tinysrgb&w=600"
    },
    {
      id: 2,
      name: "Solid Women's V-neck Dark T-Shirt",
      price: 325.00,
      rating: 4,
      reviews: 34,
      code: "0405690",
      brand: "Lee",
      description: "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words.",
      image: "https://images.pexels.com/photos/1181519/pexels-photo-1181519.jpeg?auto=compress&cs=tinysrgb&w=600"
    }
  ];

  return (
    <div className="min-h-screen  font-sans">
      {/* Breadcrumb */}
      <div className="bg-white text-header-text dark:bg-[#252b48] rounded-lg p-3 mb-8 text-sm">
        <span className="text-header-text font-bold">Shop</span> 
        <span className="mx-2 opacity-50 text-content-text">/</span> 
        <span className="text-content-text">Product List</span>
      </div>

      {/* List Container */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {products.map((product) => (
          <ProductListItem key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default ProductListPage;