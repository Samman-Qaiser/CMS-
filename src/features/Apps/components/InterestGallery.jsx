// InterestGallery.jsx
const IMAGES = [
  'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=200&q=80',
  'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=200&q=80',
  'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=200&q=80',
  'https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=200&q=80',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&q=80',
  'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=200&q=80',
]

export default function InterestGallery() {
  return (
    <div className="bg-[#ffffff] dark:bg-[#292D4A] rounded-md p-5 flex flex-col gap-4">
      <span className="text-sm font-bold text-header-text">Interest</span>
      <div className="grid grid-cols-3 gap-2">
        {IMAGES.map((src, i) => (
          <img
            key={i}
            src={src}
            alt={`interest-${i}`}
            className="w-full h-20 object-cover rounded-md hover:opacity-90 transition-opacity duration-200 cursor-pointer"
          />
        ))}
      </div>
    </div>
  )
}
