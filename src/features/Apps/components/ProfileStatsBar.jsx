// ProfileStatsBar.jsx
import { useState } from 'react'

const STATS = [
  { label: 'Follower',    value: '150' },
  { label: 'Place Stay',  value: '140' },
  { label: 'Reviews',     value: '45'  },
]

export default function ProfileStatsBar() {
  const [following, setFollowing] = useState(false)

  return (
    <div className="bg-[#ffffff] dark:bg-[#292D4A] rounded-md p-5 flex flex-col gap-5">
      {/* Stats row */}
      <div className="flex items-center justify-around">
        {STATS.map((s, i) => (
          <div key={i} className="flex flex-col items-center gap-0.5">
            <span className="text-2xl font-bold text-header-text">{s.value}</span>
            <span className="text-xs text-content-text">{s.label}</span>
          </div>
        ))}
      </div>

      {/* Buttons */}
      <div className="flex flex-col gap-2.5">
        <button
          onClick={() => setFollowing(!following)}
          className={`
            w-full py-2.5 rounded-md text-sm font-semibold transition-colors duration-200
            ${following
              ? 'bg-primary/20 text-primary border border-primary'
              : 'bg-primary text-white hover:bg-primary/90'
            }
          `}
        >
          {following ? 'Following' : 'Follow'}
        </button>
        <button className="w-full py-2.5 rounded-md text-sm font-semibold bg-primary text-white hover:bg-primary/90 transition-colors duration-200">
          Send Message
        </button>
      </div>
    </div>
  )
}
