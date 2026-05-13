// BlogCard.jsx — reusable blog card
export default function BlogCard({ image, title, excerpt, author, date }) {
  return (
    <div className="flex flex-col gap-3 pb-5 border-b border-gray-100 dark:border-white/10 last:border-none last:pb-0">
      <img
        src={image}
        alt={title}
        className="w-full h-44 object-cover rounded-md"
      />
      <div className="flex flex-col gap-1.5">
        <h3 className="text-sm font-bold text-header-text leading-snug hover:text-primary transition-colors duration-200 cursor-pointer">
          {title}
        </h3>
        <p className="text-xs text-content-text leading-relaxed">{excerpt}</p>
        <div className="flex items-center gap-1.5 text-xs">
          <span className="font-semibold text-primary">{author}</span>
          <span className="text-content-text">– {date}</span>
        </div>
      </div>
    </div>
  )
}
