import React, { useState } from 'react';
import { ShoppingCart, Star } from 'lucide-react';

const ProductDetailPage = () => {
  // Product Data Object based on image_a3757a.png
  const product = {
    title: "Solid Women's V-neck Dark T-Shirt",
    price: 325.00,
    rating: 4,
    reviews: 34,
    availability: "In stock",
    productCode: "0405689",
    brand: "Lee",
    tags: ["bags", "clothes", "shoes", "dresses"],
    description: "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing.",
    sizes: ["XS", "SM", "MD", "LG", "XL"],
    images: [
      "https://images.pexels.com/photos/157675/fashion-men-s-individuality-black-and-white-157675.jpeg?auto=compress&cs=tinysrgb&w=600", // Main Placeholder
      "https://images.pexels.com/photos/1036622/pexels-photo-1036622.jpeg?auto=compress&cs=tinysrgb&w=150",
      "https://images.pexels.com/photos/1181519/pexels-photo-1181519.jpeg?auto=compress&cs=tinysrgb&w=150",
      "https://images.pexels.com/photos/458766/pexels-photo-458766.jpeg?auto=compress&cs=tinysrgb&w=150",
      "https://images.pexels.com/photos/762020/pexels-photo-762020.jpeg?auto=compress&cs=tinysrgb&w=150"
    ]
  };

  const [selectedSize, setSelectedSize] = useState('XS');
  const [quantity, setQuantity] = useState(1);
  const [mainImage, setMainImage] = useState(product.images[0]);

  return (
    <div className="min-h-screen  font-sans text-slate-300">
      {/* Breadcrumb */}
      <div className="bg-white dark:bg-[#252b48] rounded-lg p-4 mb-8 text-sm">
        <span className="text-white font-bold">Shop</span> <span className="mx-2 opacity-50">/</span> 
        <span className="text-header-text">Product Detail</span>
      </div>

      <div className=" mx-auto bg-white dark:bg-[#252b48] rounded-lg shadow-2xl p-6 md:p-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Left Side: Images */}
          <div className="space-y-4">
            <div className="rounded-lg overflow-hidden border border-slate-700">
              <img src={mainImage} alt="Product" className="w-full h-auto object-cover" />
            </div>
            <div className="grid grid-cols-4 gap-3">
              {product.images.slice(1).map((img, idx) => (
                <div 
                  key={idx} 
                  onClick={() => setMainImage(img)}
                  className="cursor-pointer rounded border border-slate-700 hover:border-primary transition-all overflow-hidden"
                >
                  <img src={img} alt={`Thumb ${idx}`} className="w-full h-20 object-cover" />
                </div>
              ))}
            </div>
          </div>

          {/* Right Side: Details */}
          <div className="flex flex-col">
            <h1 className="text-2xl font-bold text-white mb-2">{product.title}</h1>
            
            {/* Rating */}
            <div className="flex items-center space-x-2 mb-4">
              <div className="flex text-yellow-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} fill={i < product.rating ? "currentColor" : "none"} />
                ))}
              </div>
              <span className="text-xs opacity-60">({product.reviews} reviews) /</span>
              <button className="text-xs text-white border-b border-white/30 hover:text-primary transition-colors">Write a review?</button>
            </div>

            <div className="text-3xl font-black text-primary mb-6">${product.price.toFixed(2)}</div>

            {/* Meta Info */}
            <div className="space-y-2 text-sm mb-8">
              <p><span className="opacity-50">Availability:</span> <span className="text-white ml-2 font-medium">{product.availability}</span></p>
              <p><span className="opacity-50">Product code:</span> <span className="text-white ml-2 font-medium">{product.productCode}</span></p>
              <p><span className="opacity-50">Brand:</span> <span className="text-white ml-2 font-medium">{product.brand}</span></p>
              <div className="flex items-center gap-2">
                <span className="opacity-50">Product tags:</span>
                <div className="flex gap-1">
                  {product.tags.map(tag => (
                    <span key={tag} className="px-3 py-0.5 border border-green-500/50 text-green-400 text-[10px] rounded-full uppercase">{tag}</span>
                  ))}
                </div>
              </div>
            </div>

            <p className="text-sm leading-relaxed opacity-70 mb-8 max-w-lg">
              {product.description}
            </p>

            {/* Size Selector */}
            <div className="mb-8">
              <h3 className="text-white font-bold uppercase text-xs mb-3 italic">select size</h3>
              <div className="flex bg-[#1a1c2e] border border-slate-700 rounded w-fit overflow-hidden">
                {product.sizes.map(size => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-5 py-2 text-xs font-bold border-r border-slate-700 last:border-0 transition-all ${
                      selectedSize === size ? 'bg-primary text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-4">
              <input 
                type="number" 
                min="1" 
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="w-20 bg-[#1a1c2e] border border-slate-700 rounded p-3 text-center text-white focus:outline-none"
              />
              <button className="flex-1 bg-primary hover:opacity-90 text-white font-bold py-3.5 px-8 rounded-lg flex items-center justify-center gap-2 transition-all uppercase tracking-wide">
                <ShoppingCart size={18} />
                Add to cart
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;