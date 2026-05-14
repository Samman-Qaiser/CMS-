// LatestNews.jsx
const NEWS = [
  {
    id: 1,
    image:   'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=100&q=80',
    title:   'Collection of textile samples',
    excerpt: 'I shared this on my fb wall a few months back, and I thought.',
  },
  {
    id: 2,
    image:   'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=100&q=80',
    title:   'Collection of textile samples',
    excerpt: 'I shared this on my fb wall a few months back, and I thought.',
  },
  {
    id: 3,
    image:   'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&q=80',
    title:   'Collection of textile samples',
    excerpt: 'I shared this on my fb wall a few months back, and I thought.',
  },
]

function NewsItem({ image, title, excerpt }) {
  return (
    <div className="flex items-start gap-3 py-3 border-b border-gray-100 dark:border-white/10 last:border-none last:pb-0 cursor-pointer group">
      <img
        src={image}
        alt={title}
        className="w-14 h-14 rounded-md object-cover shrink-0 group-hover:opacity-90 transition-opacity duration-200"
      />
      <div className="flex flex-col gap-1 min-w-0">
        <span className="text-xs font-bold text-header-text leading-snug group-hover:text-primary transition-colors duration-200">
          {title}
        </span>
        <p className="text-[11px] text-content-text leading-relaxed line-clamp-2">{excerpt}</p>
      </div>
    </div>
  )
}

export default function LatestNews() {
  return (
    <div className="bg-[#ffffff] dark:bg-[#292D4A] rounded-md p-5 flex flex-col gap-2">
      <span className="text-sm font-bold text-header-text mb-1">Our Latest News</span>
      {NEWS.map((n) => (
        <NewsItem key={n.id} {...n} />
      ))}
    </div>
  )
}
