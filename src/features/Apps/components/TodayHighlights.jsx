// TodayHighlights.jsx
export default function TodayHighlights({
  image   = 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&q=80',
  title   = 'Darwin Creative Agency Theme',
  excerpt = 'A small river named Duden flows by their place and supplies it with the necessary regelialia. It is a paradisematic country, in which roasted parts of sentences fly into your mouth.',
}) {
  return (
    <div className="bg-[#ffffff] dark:bg-[#292D4A] rounded-md p-5 flex flex-col gap-4">
      <span className="text-sm font-bold text-header-text">Today Highlights</span>
      <img
        src={image}
        alt={title}
        className="w-full h-40 object-cover rounded-md"
      />
      <div className="flex flex-col gap-2">
        <h3 className="text-sm font-bold text-header-text leading-snug">{title}</h3>
        <p className="text-xs text-content-text leading-relaxed">{excerpt}</p>
      </div>
    </div>
  )
}
