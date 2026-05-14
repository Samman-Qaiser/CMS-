import React from 'react';
import ProductCard from '../components/ProductCard'; // Import the component above

const ProductGrid = () => {
  // Data Array based on image_a275f3.png
  const products = [
    { id: 1, name: "Bonorum et Malorum", price: 761.00, rating: 3, image: "https://images.pexels.com/photos/157675/fashion-men-s-individuality-black-and-white-157675.jpeg?auto=compress&cs=tinysrgb&w=400" },
    { id: 2, name: "Striped Dress", price: 159.00, rating: 5, image: "https://images.pexels.com/photos/1036622/pexels-photo-1036622.jpeg?auto=compress&cs=tinysrgb&w=400" },
    { id: 3, name: "BBow polka-dot", price: 357.00, rating: 5, image: "https://images.pexels.com/photos/1181519/pexels-photo-1181519.jpeg?auto=compress&cs=tinysrgb&w=400" },
    { id: 4, name: "Z Product 360", price: 654.00, rating: 3, image: "https://images.pexels.com/photos/458766/pexels-photo-458766.jpeg?auto=compress&cs=tinysrgb&w=400" },
    { id: 5, name: "Chair Grey", price: 369.00, rating: 5, image: "https://images.pexels.com/photos/1126993/pexels-photo-1126993.jpeg?auto=compress&cs=tinysrgb&w=400" },
    { id: 6, name: "fox sake withe", price: 245.00, rating: 4, image: "https://images.pexels.com/photos/934063/pexels-photo-934063.jpeg?auto=compress&cs=tinysrgb&w=400" },
    { id: 7, name: "Back Bag", price: 364.00, rating: 4, image: "https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&w=400" },
    { id: 8, name: "FLARE DRESS", price: 548.00, rating: 3, image: "https://images.pexels.com/photos/157675/fashion-men-s-individuality-black-and-white-157675.jpeg?auto=compress&cs=tinysrgb&w=400" },
  ];

  return (
    <div className="min-h-screen space-y-3 font-sans">
      {/* Breadcrumb */}
      <div className=" bg-white text-header-text dark:bg-[#252b48] rounded-lg p-3 mb-8 text-sm">
        <span className=" font-bold">Shop</span> 
        <span className="mx-2 opacity-50 text-slate-300">/</span> 
        <span className="">Product Grid</span>
      </div>

      {/* Grid Container */}
      <div className=" grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default ProductGrid;