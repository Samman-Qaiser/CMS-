import { ChevronRight } from "lucide-react";

const CategoryCard = ({ category }) => {
  const isUrl = category.icon?.startsWith("http");

  return (
    <div className="bg-white dark:bg-[#292D4A] p-4 rounded-xl flex items-center justify-between group cursor-pointer hover:shadow-lg transition-all border border-transparent hover:border-primary/20">
      <div className="flex items-center gap-4">
        {/* Icon Container */}
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center overflow-hidden bg-gray-100 dark:bg-gray-700 shrink-0 text-3xl">
          {isUrl ? (
            <img
              src={category.icon}
              alt={category.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.style.display = "none"; 
                e.target.nextSibling.style.display = "block";  
              }}
            />
          ) : (
            <span>{category.icon || "📁"}</span>
          )}
        </div>

        {/* Content */}
        <div className="overflow-hidden">
          <h4 className="text-header-text font-bold text-lg leading-tight truncate">
            {category.name}
          </h4>
          <p className="text-content-text text-xs mt-1 line-clamp-2">
            {category.description || "No description provided"}
          </p>
        </div>
      </div>

      <ChevronRight
        className="text-primary opacity-40 group-hover:opacity-100 group-hover:translate-x-1 transition-all shrink-0"
        size={20}
      />
    </div>
  );
};

export default CategoryCard;
