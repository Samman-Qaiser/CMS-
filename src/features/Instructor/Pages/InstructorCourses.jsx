// CoursesPage.jsx — main page
import { FaBookOpen, FaClipboardList, FaStar } from 'react-icons/fa'
import StatCard           from '../Components/StatCard'
import SellingActivityChart from '../Components/SellingActivityChart'
import PopularClass       from '../Components/PopularClass'
import TopCourses         from '../Components/TopCourses'
import UserReviewCard     from '../Components/UserReviewCard'

// ── Static data ───────────────────────────────────────────────────────────────
const STATS = [
  {
    icon: FaBookOpen,
    value: '23,940',
    label: 'Courses',
    bgClass: 'bg-primary',
    ringColor: '#ffffff',
  },
  {
    icon: FaClipboardList,
    value: '94,230',
    label: 'Content',
    bgClass: 'bg-yellow-400',
    ringColor: '#ffffff',
  },
  {
    icon: FaClipboardList,
    value: '32,567',
    label: 'Review',
    bgClass: 'bg-teal-500',
    ringColor: '#ffffff',
  },
]

const REVIEWS = [
  {
    id: 1,
    name: 'Karen Hope',
    rating: 5,
    avatar: 'https://i.pravatar.cc/40?img=1',
    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do.',
  },
  {
    id: 2,
    name: 'Karen Hope',
    rating: 5,
    avatar: 'https://i.pravatar.cc/40?img=3',
    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do.',
  },
]

// ── Page ─────────────────────────────────────────────────────────────────────
export default function InstructorCourses() {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-[#1E2139] p-6">
      <div className=" mx-auto flex flex-col gap-5">

        {/* ── Row 1: Stats (left 2/3) + Popular Class (right 1/3) ── */}
        <div className="flex gap-5">

          {/* Left — stats grid + selling chart */}
          <div className="flex w-[65%] flex-col gap-5 flex-1 min-w-0">

            {/* Stat cards: 2 on top row, 1 wide below */}
            <div className="flex gap-5">
              <div className="flex-1">
                <StatCard {...STATS[0]} />
              </div>
              <div className="flex-1">
                <StatCard {...STATS[1]} />
              </div>
            </div>
            <StatCard {...STATS[2]} />

            {/* Selling Activity chart */}
            <SellingActivityChart />
          </div>

          {/* Right — Popular Class + Top Courses */}
          <div className="flex flex-col gap-5 w-[35%] shrink-0">
            <PopularClass />
            <TopCourses />
          </div>
        </div>

        {/* ── Row 2: User Reviews ── */}
        <div className="flex  flex-col gap-3">
          <span className="text-sm font-bold text-header-text">User Reviews</span>
          <div className="flex  gap-5">
            {REVIEWS.map((r) => (
              <div key={r.id} className="flex-1">
                <UserReviewCard {...r} />
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}
