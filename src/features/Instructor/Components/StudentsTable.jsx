import { useState, useEffect, useMemo } from 'react'
import { BsSearch, BsThreeDots, BsChevronLeft, BsChevronRight } from 'react-icons/bs'
import { FaSort } from 'react-icons/fa'
import axios from 'axios'
import { useSelector } from 'react-redux'
import { format } from 'date-fns'

const baseUrl =
  import.meta.env?.VITE_BACKEND_URL ||
  "https://cms-backend-ashen.vercel.app";

const STATUS_STYLES = {
  'on_progress': 'bg-yellow-400/15 text-yellow-500 border border-yellow-400/30',
  'no_progress': 'bg-red-400/15 text-red-400 border border-red-400/30',
  'completed':   'bg-teal-500/15 text-teal-500 border border-teal-500/30',
}

const STATUS_LABELS = {
  'on_progress': 'On Progress',
  'no_progress': 'No Progress',
  'completed':   'Completed',
}

const PAGE_SIZE = 3

export default function StudentsTable() {
  const [enrollments, setEnrollments] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)

  const user = useSelector((state) => state.auth.user)
  const isAdmin = user?.role === 'admin'
  const isInstructor = user?.role === 'instructor'

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true)

        if (isAdmin) {
          // ─── Admin: Sab enrollments ───────────────
          const { data } = await axios.get(`${baseUrl}/api/enrollments`)
          setEnrollments(data.enrollments)

        } else if (isInstructor) {
          // ─── Instructor: Apne courses k students ──
          const { data: instructorData } = await axios.get(
            `${baseUrl}/api/instructors/user/${user?.id}`
          )
          const instructorId = instructorData.instructor._id

          // Instructor k courses lao
          const { data: coursesData } = await axios.get(
            `${baseUrl}/api/courses?instructor=${instructorId}`
          )

          // Har course k enrollments lao
          const allEnrollments = []
          for (const course of coursesData.courses) {
            const { data } = await axios.get(
              `${baseUrl}/api/enrollments?course=${course._id}`
            )
            allEnrollments.push(...data.enrollments)
          }

          setEnrollments(allEnrollments)
        }

      } catch (error) {
        console.error('Error fetching students:', error)
      } finally {
        setLoading(false)
      }
    }

    if (user?.id) fetchStudents()
  }, [user?.id])

  // ─── Search Filter ────────────────────────────────
  const filtered = useMemo(() =>
    enrollments.filter((e) => {
      const name = `${e.user?.firstName || ''} ${e.user?.lastName || ''}`.toLowerCase()
      const course = e.course?.title?.toLowerCase() || ''
      const id = e._id?.toLowerCase() || ''
      const q = search.toLowerCase()
      return name.includes(q) || course.includes(q) || id.includes(q)
    }), [enrollments, search]
  )

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const safePage = Math.min(page, totalPages)
  const paginated = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE)

  const handleSearch = (val) => {
    setSearch(val)
    setPage(1)
  }

  if (loading) {
    return (
      <div className="bg-[#ffffff] dark:bg-[#292D4A] rounded-md p-5 flex flex-col gap-4">
        <span className="text-sm font-bold text-header-text">Students List</span>
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      </div>
    )
  }

  return (
    <div className="bg-[#ffffff] dark:bg-[#292D4A] rounded-md p-5 flex flex-col gap-4">

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <span className="text-sm font-bold text-header-text">
          Students List
          <span className="ml-2 text-xs text-primary font-normal">
            ({enrollments.length} total)
          </span>
        </span>

        {/* Search */}
        <div className="flex items-center gap-2 border border-primary/40 rounded-md px-3 py-2 focus-within:ring-2 focus-within:ring-primary/30 transition-all bg-transparent">
          <BsSearch className="w-3.5 h-3.5 text-primary" />
          <input
            type="text"
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search students..."
            className="bg-transparent outline-none text-sm text-header-text placeholder:text-content-text w-40"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 dark:border-white/10">
              {['Name', 'Student ID', 'Course', 'Join Date', 'Status', ''].map((h, i) => (
                <th
                  key={i}
                  className="text-left py-3 px-2 text-xs font-semibold text-content-text whitespace-nowrap"
                >
                  <div className="flex items-center gap-1">
                    {h}
                    {h && h !== '' && <FaSort className="w-2.5 h-2.5 opacity-50" />}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginated.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-8 text-content-text text-sm">
                  No students found
                </td>
              </tr>
            ) : (
              paginated.map((enrollment) => {
                const student = enrollment.user
                const course = enrollment.course
                const fullName = `${student?.firstName || ''} ${student?.lastName || ''}`.trim()
                const avatar = student?.profileImage ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=FF6F61&color=fff&bold=true&size=36`

                return (
                  <tr
                    key={enrollment._id}
                    className="border-b border-gray-50 dark:border-white/5 last:border-none hover:bg-gray-50 dark:hover:bg-white/3 transition-colors"
                  >
                    {/* Name */}
                    <td className="py-3 px-2">
                      <div className="flex items-center gap-3">
                        <img
                          src={avatar}
                          alt={fullName}
                          className="w-9 h-9 rounded-md object-cover shrink-0"
                          onError={(e) => {
                            e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=FF6F61&color=fff`
                          }}
                        />
                        <span className="font-semibold text-header-text whitespace-nowrap">
                          {fullName || 'Unknown'}
                        </span>
                      </div>
                    </td>

                    {/* Student ID */}
                    <td className="py-3 px-2 text-content-text whitespace-nowrap text-xs">
                      {enrollment._id?.slice(-10).toUpperCase()}
                    </td>

                    {/* Course */}
                    <td className="py-3 px-2 text-content-text whitespace-nowrap text-xs">
                      {course?.title || 'N/A'}
                    </td>

                    {/* Join Date */}
                    <td className="py-3 px-2 text-content-text whitespace-nowrap text-xs">
                      {enrollment.enrolledAt
                        ? format(new Date(enrollment.enrolledAt), 'MMMM d, yyyy')
                        : 'N/A'
                      }
                    </td>

                    {/* Status */}
                    <td className="py-3 px-2">
                      <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
                        STATUS_STYLES[enrollment.status] || STATUS_STYLES['no_progress']
                      }`}>
                        {STATUS_LABELS[enrollment.status] || 'No Progress'}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-2">
                      <button className="text-content-text hover:text-header-text transition-colors">
                        <BsThreeDots className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between flex-wrap gap-3 pt-1">
        <span className="text-xs text-content-text">
          Showing {filtered.length === 0 ? 0 : (safePage - 1) * PAGE_SIZE + 1} to{' '}
          {Math.min(safePage * PAGE_SIZE, filtered.length)} of {filtered.length} entries
        </span>

        {/* Pagination */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={safePage === 1}
            className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center hover:bg-primary hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed text-primary"
          >
            <BsChevronLeft className="w-3 h-3" />
          </button>

          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={`w-8 h-8 rounded-md text-xs font-bold transition-all ${
                safePage === i + 1
                  ? 'bg-primary text-white shadow-md'
                  : 'bg-primary/10 text-primary hover:bg-primary hover:text-white'
              }`}
            >
              {i + 1}
            </button>
          ))}

          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={safePage === totalPages}
            className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center hover:bg-primary hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed text-primary"
          >
            <BsChevronRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  )
}