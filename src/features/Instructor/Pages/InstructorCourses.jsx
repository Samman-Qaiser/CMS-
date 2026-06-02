import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { FaBookOpen, FaClipboardList } from 'react-icons/fa'
import axios from 'axios'
import StatCard from '../Components/StatCard'
import SellingActivityChart from '../Components/SellingActivityChart'
import PopularClass from '../Components/PopularClass'
import TopCourses from '../Components/TopCourses'
import UserReviewCard from '../Components/UserReviewCard'

const baseUrl =
  import.meta.env?.VITE_BACKEND_URL ||
  "https://cms-backend-ashen.vercel.app";

export default function InstructorCourses() {
  const user = useSelector((state) => state.auth.user)
  const [instructor, setInstructor] = useState(null)
  const [stats, setStats] = useState(null)
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchInstructorData = async () => {
      try {
        setLoading(true)

        // ─── Step 1: User ID se Instructor lao ───────
        const { data: instructorData } = await axios.get(
          `${baseUrl}/api/instructors/user/${user?.id}`
        )
        setInstructor(instructorData.instructor)

        const instructorId = instructorData.instructor._id

        // ─── Step 2: Stats lao ────────────────────────
        const { data: statsData } = await axios.get(
          `${baseUrl}/api/instructors/${instructorId}/stats`
        )
        setStats(statsData)

        // ─── Step 3: Reviews lao ──────────────────────
        const { data: reviewsData } = await axios.get(
          `${baseUrl}/api/reviews?instructor=${instructorId}&status=approved`
        )
        setReviews(reviewsData.reviews.slice(0, 2))

      } catch (error) {
        console.error('Error fetching instructor data:', error)
      } finally {
        setLoading(false)
      }
    }

    if (user?.id) fetchInstructorData()
  }, [user])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  // ─── Dynamic Stats ────────────────────────────────
  const STATS = [
    {
      icon: FaBookOpen,
      value: stats?.stats?.totalCourses?.toLocaleString() || '0',
      label: 'Courses',
      bgClass: 'bg-primary',
      ringColor: '#ffffff',
    },
    {
      icon: FaClipboardList,
      value: stats?.stats?.totalStudents?.toLocaleString() || '0',
      label: 'Students',
      bgClass: 'bg-yellow-400',
      ringColor: '#ffffff',
    },
    {
      icon: FaClipboardList,
      value: stats?.stats?.totalReviews?.toLocaleString() || '0',
      label: 'Reviews',
      bgClass: 'bg-teal-500',
      ringColor: '#ffffff',
    },
  ]

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-[#1E2139] p-2 w-full">
      <div className="mx-auto flex flex-col gap-5">

        {/* ── Row 1: Stats + Charts ── */}
        <div className="flex gap-5">

          {/* Left */}
          <div className="flex w-[65%] flex-col gap-5 flex-1 min-w-0">
            <div className="flex gap-5">
              <div className="flex-1">
                <StatCard {...STATS[0]} />
              </div>
              <div className="flex-1">
                <StatCard {...STATS[1]} />
              </div>
            </div>
            <StatCard {...STATS[2]} />
            <SellingActivityChart
              monthlyEarnings={stats?.monthlyEarnings || []}
            />
          </div>

          {/* Right */}
          <div className="flex flex-col gap-5 w-[35%] shrink-0">
            <PopularClass
              popularCourses={stats?.popularCourses || []}
            />
            <TopCourses
              topCourses={stats?.popularCourses || []}
            />
          </div>
        </div>

        {/* ── Row 2: Reviews ── */}
        <div className="flex  flex-col gap-3">
          <span className="text-sm font-bold text-header-text">User Reviews</span>
          {reviews.length === 0 ? (
            <p className="text-content-text text-sm">No reviews yet</p>
          ) : (
            <div className="flex gap-5">
              {reviews.map((r) => (
                <div key={r._id} className="flex-1">
                  <UserReviewCard
                    avatar={r.user?.profileImage || `https://i.pravatar.cc/40?img=${r._id}`}
                    name={`${r.user?.firstName} ${r.user?.lastName}`}
                    rating={r.rating}
                    text={r.comment}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  )
}