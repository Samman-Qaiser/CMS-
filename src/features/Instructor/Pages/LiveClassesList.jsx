import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import axios from 'axios'
import Swal from 'sweetalert2'
import { BsTrash } from 'react-icons/bs'
import { FaPlay, FaClock, FaStop } from 'react-icons/fa'
import { format } from 'date-fns'

const baseUrl =
  import.meta.env?.VITE_BACKEND_URL ||
  "https://cms-backend-ashen.vercel.app";

const StatusBadge = ({ status }) => {
  const styles = {
    scheduled: 'bg-yellow-100 text-yellow-700',
    live: 'bg-red-100 text-red-600',
    ended: 'bg-gray-100 text-gray-600',
  }
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-bold capitalize flex items-center gap-1.5 w-fit ${styles[status]}`}>
      {status === 'live' && (
        <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
      )}
      {status}
    </span>
  )
}

export default function LiveClassesList() {
  const navigate = useNavigate()
  const currentUser = useSelector((state) => state.auth.user)
  const isInstructor = currentUser?.role === 'instructor'

  const [liveClasses, setLiveClasses] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  // ─── Fetch Live Classes ───────────────────────────
  const fetchLiveClasses = async () => {
    try {
      setLoading(true)

      let url = `${baseUrl}/api/live-classes`

      if (isInstructor) {
        const { data: instrData } = await axios.get(
          `${baseUrl}/api/instructors/user/${currentUser?.id}`
        )
        const instrId = instrData.instructor._id
        url = `${baseUrl}/api/live-classes?instructor=${instrId}`
      }

      const { data } = await axios.get(url)
      setLiveClasses(data.liveClasses)
    } catch (error) {
      console.error('Error fetching live classes:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (currentUser?.id) fetchLiveClasses()
  }, [currentUser?.id])

  // ─── Delete ───────────────────────────────────────
  const handleDelete = (liveClass) => {
    Swal.fire({
      title: 'Are you sure?',
      text: `Delete "${liveClass.title}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, delete!',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`${baseUrl}/api/live-classes/${liveClass._id}`)
          setLiveClasses((prev) => prev.filter((l) => l._id !== liveClass._id))
          Swal.fire({
            title: 'Deleted!',
            icon: 'success',
            timer: 2000,
            showConfirmButton: false,
            toast: true,
            position: 'top-end',
          })
        } catch (error) {
          Swal.fire({
            title: 'Error!',
            text: error.response?.data?.message || 'Something went wrong',
            icon: 'error',
          })
        }
      }
    })
  }

  // ─── Filter ───────────────────────────────────────
  const filtered = liveClasses.filter((l) => {
    if (filter === 'all') return true
    return l.status === filter
  })

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-header-text">Live Classes</h2>
          <p className="text-content-text text-sm">
            {isInstructor ? 'Manage your live classes' : 'All live classes'}
          </p>
        </div>
        {isInstructor && (
          <button
            onClick={() => navigate('/dashboard/create-live-class')}
            className="bg-primary text-white px-5 py-2 rounded-lg text-sm font-bold hover:opacity-90 transition-all active:scale-95"
          >
            + Create Live Class
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2">
        {['all', 'scheduled', 'live', 'ended'].map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold capitalize transition-all ${
              filter === tab
                ? 'bg-primary text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-300'
            }`}
          >
            {tab}
            {tab === 'live' && liveClasses.filter((l) => l.status === 'live').length > 0 && (
              <span className="ml-1 bg-red-500 text-white rounded-full px-1.5 text-xs">
                {liveClasses.filter((l) => l.status === 'live').length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Live Classes Grid */}
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          No live classes found
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((liveClass) => {
            const instructor = liveClass.instructor
            const instrName = instructor?.user
              ? `${instructor.user.firstName} ${instructor.user.lastName}`
              : 'Instructor'

            return (
              <div
                key={liveClass._id}
                className="bg-white dark:bg-[#292D4A] rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden hover:shadow-md transition-all"
              >
                {/* Thumbnail */}
                <div className="relative h-40 bg-gray-900">
                  {liveClass.course?.thumbnail ? (
                    <img
                      src={liveClass.course.thumbnail}
                      alt={liveClass.title}
                      className="w-full h-full object-cover opacity-80"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <FaPlay className="w-12 h-12 text-white opacity-20" />
                    </div>
                  )}

                  {/* Status badge */}
                  <div className="absolute top-3 left-3">
                    <StatusBadge status={liveClass.status} />
                  </div>

                  {/* Students count */}
                  <div className="absolute top-3 right-3 bg-black/50 rounded-md px-2 py-1 flex items-center gap-1">
                    <span className="text-xs text-white font-bold">
                      {liveClass.totalStudents || 0} students
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 flex flex-col gap-3">
                  <div>
                    <h4 className="font-bold text-header-text text-sm line-clamp-1">
                      {liveClass.title}
                    </h4>
                    <p className="text-xs text-content-text mt-0.5">
                      {liveClass.course?.title || 'No course'}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-content-text">
                    <FaClock className="w-3 h-3" />
                    <span>
                      {liveClass.scheduledAt
                        ? format(new Date(liveClass.scheduledAt), 'MMM d, yyyy hh:mm a')
                        : 'Not scheduled'
                      }
                    </span>
                  </div>

                  <p className="text-xs text-content-text">
                    By {instrName}
                  </p>

                  {/* Actions */}
                  <div className="flex gap-2 mt-1">
                    {isInstructor && (
                      <>
                        <button
                          onClick={() => navigate(`/dashboard/instructor-live-class/${liveClass._id}`)}
                          className="flex-1 py-2 bg-primary text-white text-xs font-bold rounded-lg hover:opacity-90 transition-all flex items-center justify-center gap-1"
                        >
                          {liveClass.status === 'scheduled' ? (
                            <><FaPlay className="w-3 h-3" /> Start</>
                          ) : liveClass.status === 'live' ? (
                            <><FaStop className="w-3 h-3" /> End</>
                          ) : (
                            'View'
                          )}
                        </button>
                        <button
                          onClick={() => handleDelete(liveClass)}
                          className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-all"
                        >
                          <BsTrash size={14} />
                        </button>
                      </>
                    )}

                    {!isInstructor && (
                      <button
                        onClick={() => navigate(`/dashboard/student-live-class/${liveClass._id}`)}
                        className="flex-1 py-2 bg-primary text-white text-xs font-bold rounded-lg hover:opacity-90 transition-all"
                      >
                        {liveClass.status === 'live' ? '🔴 Join Live' : 'View'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}