const CategoryCard = ({ category }) => {
  return (
    <div className="bg-white dark:bg-[#292D4A] rounded-xl p-4 flex items-center gap-4 shadow-sm hover:shadow-md transition-all cursor-pointer">
      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-xl">
        {category.icon || '📚'}
      </div>
      <div>
        <h4 className="text-header-text font-bold">{category.name}</h4>
        <p className="text-content-text text-xs">
          {category.description || 'Lorem ipsum dolor'}
        </p>
      </div>
    </div>
  )
}

export default CategoryCard