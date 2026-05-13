// UserReviewCard.jsx — reusable single review card
import { FaStar } from 'react-icons/fa'

function StarRow({ count = 5 }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <FaStar key={i} className={`w-3 h-3 ${i < count ? 'text-primary' : 'text-gray-300'}`} />
      ))}
    </div>
  )
}

export default function UserReviewCard({ avatar, name, rating, text }) {
  return (
    <div className="bg-[#ffffff] dark:bg-[#292D4A] rounded-md p-5 flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <img src={avatar} alt={name} className="w-10 h-10 rounded-md object-cover shrink-0" />
        <div className="flex flex-col gap-1">
          <span className="text-sm font-bold text-header-text">{name}</span>
          <StarRow count={rating} />
        </div>
      </div>
      <p className="text-xs text-content-text leading-relaxed">{text}</p>
    </div>
  )
}
