import React from 'react';
import { ChevronRight } from 'lucide-react';

const CategoryCard = ({ category }) => {
  return (
    <div className="bg-white dark:bg-[#292D4A] p-2 rounded-md flex items-center justify-between group cursor-pointer hover:shadow-lg transition-all border border-transparent hover:border-primary/20">
      <div className="flex items-center gap-4">
        {/* Category Icon */}
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl">
          {category.icon}
        </div>
        
        <div>
          <h4 className="text-header-text font-bold text-lg leading-tight">{category.title}</h4>
          <p className="text-content-text text-xs mt-1">Lorem ipsum dolor</p>
        </div>
      </div>

      <ChevronRight className="text-primary opacity-40 group-hover:opacity-100 group-hover:translate-x-1 transition-all" size={20} />
    </div>
  );
};

export default CategoryCard;