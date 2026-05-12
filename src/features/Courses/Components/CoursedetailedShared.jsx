import { FaStar, FaHeart, FaRegHeart, FaPlay, FaLock } from 'react-icons/fa'
import { useState } from 'react'

// ─── StarRow ──────────────────────────────────────────────────────────────────
export function StarRow({ count = 5, size = 'w-3.5 h-3.5' }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <FaStar
          key={i}
          className={`${size} ${i < count ? 'text-yellow-400' : 'text-gray-400'}`}
        />
      ))}
    </div>
  )
}

export function VideoThumbnail({ src, alt = 'course preview', videoSrc = null }) {
  const [playing, setPlaying] = useState(false)

  if (playing && videoSrc) {
    return (
      <div className="relative rounded-md overflow-hidden">
        <video
          src={videoSrc}
          className="w-full h-72 object-cover"
          controls
          autoPlay
        />
      </div>
    )
  }

  return (
    <div className="relative rounded-md overflow-hidden cursor-pointer" onClick={() => videoSrc && setPlaying(true)}>
      <img
        src={src}
        alt={alt}
        className="w-full h-72 object-cover"
      />
      <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
        <div className="w-14 h-14 rounded-md bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center">
          <FaPlay className="w-5 h-5 text-white ml-1" />
        </div>
      </div>
    </div>
  )
}
// ─── CourseMeta ───────────────────────────────────────────────────────────────
// Title + rating + student count row
export function CourseMeta({ title, rating = 5, reviewCount = '1k', students = '10k' }) {
  return (
    <div className="flex flex-col gap-1">
      <h1 className="text-xl font-bold text-header-text leading-snug">{title}</h1>
      <div className="flex items-center gap-3 flex-wrap">
        <span className="text-sm font-bold text-primary">{rating}</span>
        <StarRow count={rating} />
        <span className="text-sm text-content-text">Review ({reviewCount})</span>
        <span className="text-sm text-content-text">{students} Students</span>
      </div>
    </div>
  )
}

// ─── ReviewCard ───────────────────────────────────────────────────────────────
export function ReviewCard({ avatar, name, rating, time, text }) {
  return (
    <div className="flex flex-col gap-2 pb-5 border-b border-gray-100 dark:border-white/10 last:border-none last:pb-0">
      <div className="flex items-center gap-3">
        <img src={avatar} alt={name} className="w-10 h-10 rounded-md object-cover" />
        <div className="flex flex-col gap-0.5">
          <span className="text-sm font-bold text-header-text">{name}</span>
          <div className="flex items-center gap-3">
            <StarRow count={rating} />
            <span className="text-xs text-content-text">{time}</span>
          </div>
        </div>
      </div>
      <p className="text-sm text-content-text leading-relaxed">{text}</p>
    </div>
  )
}

// ─── TabBar ───────────────────────────────────────────────────────────────────
export function TabBar({ tabs, active, onChange }) {
  return (
    <div className="flex border-b border-gray-200 dark:border-white/10">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => onChange(tab)}
          className={`
            py-3 px-2 mr-6 text-sm font-semibold capitalize border-b-2 transition-colors duration-200
            ${active === tab
              ? 'border-primary text-primary'
              : 'border-transparent text-content-text hover:text-header-text'
            }
          `}
        >
          {tab.charAt(0).toUpperCase() + tab.slice(1)}
        </button>
      ))}
    </div>
  )
}

// ─── LessonRow ────────────────────────────────────────────────────────────────
// Single lesson item inside accordion
export function LessonRow({ title, duration, unlocked = false }) {
  return (
    <div className="flex items-center gap-3 py-2.5 px-3 rounded-md hover:bg-gray-50 dark:hover:bg-white/5 transition-colors duration-150">
      <div className="w-7 h-7 rounded-md bg-primary/10 flex items-center justify-center shrink-0">
        {unlocked
          ? <FaPlay className="w-2.5 h-2.5 text-primary ml-0.5" />
          : <FaLock className="w-2.5 h-2.5 text-content-text" />
        }
      </div>
      <span className="flex-1  text-header-text">{title}</span>
      <span className="text-content-text">{duration}</span>
    </div>
  )
}

// ─── AccordionSection ─────────────────────────────────────────────────────────
export function AccordionSection({ label, progress, total, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <div className="bg-[#ffffff] dark:bg-[#292D4A] rounded-md overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 transition-colors duration-200 hover:bg-gray-50 dark:hover:bg-white/5"
      >
        <span className=" font-semibold text-primary">{label}</span>
        <div className="flex items-center gap-2">
          <span className="text-xs text-content-text">({progress}/{total})</span>
          <div className={`
            w-7 h-7 rounded-md bg-primary flex items-center justify-center transition-transform duration-300
            ${open ? 'rotate-180' : 'rotate-0'}
          `}>
            <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </button>

      {open && (
        <div className="px-3 pb-3 flex flex-col">
          {children}
        </div>
      )}
    </div>
  )
}

// ─── ProgressBar ─────────────────────────────────────────────────────────────
export function ProgressBar({ label, current, total }) {
  const pct = Math.round((current / total) * 100)
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className=" text-content-text">{label}</span>
        <span className="font-semibold text-header-text">{current}/{total}</span>
      </div>
      <div className="h-1.5 w-full bg-gray-200 dark:bg-white/10 rounded-full overflow-hidden">
        <div
          className="h-full bg-primary rounded-full transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}

// ─── WishlistButton ──────────────────────────────────────────────────────────
export function WishlistButton() {
  const [wishlisted, setWishlisted] = useState(false)
  return (
    <button
      onClick={() => setWishlisted(!wishlisted)}
      className="w-9 h-9 rounded-md flex items-center justify-center border border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors duration-200"
      aria-label="Wishlist"
    >
      {wishlisted
        ? <FaHeart className="w-4 h-4 text-primary" />
        : <FaRegHeart className="w-4 h-4 text-content-text" />
      }
    </button>
  )
}