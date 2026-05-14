// ProfileCoverCard.jsx
import { useState, useRef, useEffect } from 'react'
import { BsThreeDots } from 'react-icons/bs'
import {
  FaUserCircle, FaUserFriends, FaPlusCircle, FaBan
} from 'react-icons/fa'

const MENU_ITEMS = [
  { icon: FaUserCircle,  label: 'View profile'          },
  { icon: FaUserFriends, label: 'Add to close friends'  },
  { icon: FaPlusCircle,  label: 'Add to group'          },
  { icon: FaBan,         label: 'Block'                 },
]

export default function ProfileCoverCard({
  coverImage = 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1200&q=80',
  avatar     = 'https://i.pravatar.cc/100?img=47',
  name       = 'Mitchell C. Shay',
  role       = 'UX / UI Designer',
  email      = 'info@example.com',
}) {
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef(null)

  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <div className="bg-[#ffffff] dark:bg-[#292D4A] rounded-md overflow-hidden relative">
      {/* Cover */}
      <div className="relative h-52">
        <img src={coverImage} alt="cover" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/30" />
      </div>

      {/* Bottom info row */}
      <div className="flex items-end gap-5 px-6 pb-5 pt-0  relative">
        {/* Avatar */}
        <img
          src={avatar}
          alt={name}
          className="w-20 h-20 rounded-full -mt-10 border-4 border-white dark:border-[#292D4A] shrink-0 shadow-lg"
        />

        {/* Name + role */}
        <div className="flex flex-col gap-0.5 mt-3">
          <span className="text-base font-bold text-primary">{name}</span>
          <span className="text-xs text-content-text">{role}</span>
        </div>

        {/* Email */}
        <div className="flex flex-col gap-0.5 mt-3">
          <span className="text-sm font-bold text-header-text">{email}</span>
          <span className="text-xs text-content-text">Email</span>
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Three-dots menu */}
        <div className="relative pb-1" ref={menuRef}>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="w-10 h-10 rounded-md bg-primary flex items-center justify-center hover:bg-primary/90 transition-colors duration-200"
          >
            <BsThreeDots className="w-4 h-4 text-white" />
          </button>

          {menuOpen && (
            <div className="absolute right-0 bottom-14 z-50 bg-white dark:bg-[#1E2139] rounded-md shadow-2xl border border-white/10 py-2 min-w-[200px]">
              {MENU_ITEMS.map((item) => {
                const Icon = item.icon
                return (
                  <button
                    key={item.label}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-content-text hover:text-primary hover:bg-white/5 transition-colors duration-150"
                  >
                    <Icon className="w-4 h-4 text-primary shrink-0" />
                    {item.label}
                  </button>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
