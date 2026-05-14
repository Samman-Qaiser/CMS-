import React from 'react';
import { Star } from 'lucide-react';

const ProductCard = ({ product }) => {
  return (
    <div className="bg-white dark:bg-[#292D4A] rounded-lg p-6 flex flex-col items-center shadow-lg hover:shadow-2xl transition-shadow duration-300">
      {/* Image Container */}
      <div className="w-full aspect-square rounded-xl overflow-hidden mb-4 bg-white">
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-full object-cover"
        />
      </div>

      {/* Content */}
      <div className="text-center space-y-2">
        <h3 className="text-white font-bold text-sm min-h-[40px] flex items-center justify-center leading-tight">
          {product.name}
        </h3>
        
        {/* Ratings */}
        <div className="flex justify-center text-yellow-500">
          {[...Array(5)].map((_, i) => (
            <Star 
              key={i} 
              size={14} 
              fill={i < product.rating ? "currentColor" : "none"} 
              className={i < product.rating ? "text-yellow-500" : "text-slate-600"}
            />
          ))}
        </div>

        {/* Price */}
        <div className="text-primary font-black text-xl">
          ${product.price.toFixed(2)}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;