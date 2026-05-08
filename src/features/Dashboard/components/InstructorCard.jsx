import React from 'react';
import { MoreHorizontal, Star } from 'lucide-react'; // 'npm install lucide-react' if not installed

const InstructorCard = ({ 
  name = "Johnny Ahmad", 
  rating = "5.0", 
  reviews = "1k", 
  image = "https://via.placeholder.com/150", 
  tags = ["Design", "Tech", "Research"],
  achievements = [
    { label: "Achievement", value: "100", icon: "🏅" },
    { label: "Achievement", value: "100", icon: "🎰" }
  ]
}) => {
  return (
    <div className="w-full  bg-sidebar-bg rounded-md p-6 shadow-xl text-center relative font-poppins">
      {/* Top Menu Icon */}
      <div className="absolute top-6 right-6 text-header-text opacity-70 cursor-pointer">
        <MoreHorizontal size={24} />
      </div>

      {/* Profile Image */}
      <div className="flex justify-center mb-4">
        <div className="w-32 h-32 rounded-lg overflow-hidden shadow-lg border-4 border-transparent">
          <img 
            src={image} 
            alt={name} 
            className="w-full h-full object-cover object-top"
          />
        </div>
      </div>

      {/* Name & Rating */}
      <h2 className="text-[15.5px] font-bold text-header-text mb-1">{name}</h2>
      <div className="flex items-center justify-center gap-2 mb-6">
        <span className="text-sidebar-text text-[12px] font-medium">{rating}</span>
        <Star size={16} fill="#FFB800" color="#FFB800" />
        <div className="h-4 w-[1px] bg-sidebar-text opacity-30 mx-1"></div>
        <span className="text-sidebar-text text-[12px]">Review ({reviews})</span>
      </div>

      {/* Dynamic Tags */}
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        {tags.map((tag, index) => (
          <span 
            key={index} 
            className="px-5 py-2 bg-bg-main/30 text-black dark:text-white rounded-lg text-sm font-medium bg-opacity-20 backdrop-blur-sm transition-hover hover:bg-opacity-40 cursor-default"
           
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Achievement Stats */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        {achievements.map((item, index) => (
          <div key={index} className="bg-bg-main hover:bg-primary p-4 rounded-lg flex flex-col items-center">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xl">{item.icon}</span>
              <span className="text-[18px]  text-content-text">
                {item.label}
              </span>
            </div>
            <span className="text-2xl font-bold text-black dark:text-white ">
              {item.value}
            </span>
          </div>
        ))}
      </div>

      {/* Dynamic Button */}
      <button className="w-full py-2  bg-[#67C6A9] hover:bg-[#67C6A9]/50 cursor-pointer text-white font-bold rounded-md transition-all duration-300 shadow-lg shadow-secondary/20">
        View Class
      </button>
    </div>
  );
};

export default InstructorCard;