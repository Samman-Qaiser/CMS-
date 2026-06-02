import { useState, useEffect } from 'react'
import axios from 'axios'
import Swal from 'sweetalert2'
import { BsTrash } from 'react-icons/bs'
import { FaStar } from 'react-icons/fa'

const baseUrl =
  import.meta.env?.VITE_BACKEND_URL ||
  "https://cms-backend-ashen.vercel.app";

const StatusBadge = ({ status }) => {
  const styles = {
    pending: 'bg-yellow-100 text-yellow-700',
    approved: 'bg-green-100 text-green-700',
    spam: 'bg-orange-100 text-orange-700',
    trash: 'bg-red-100 text-red-700',
  }
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-bold capitalize ${styles[status]}`}>
      {status}
    </span>
  )
}

const StarRow = ({ count = 5 }) => (
  <div className="flex items-center gap-0.5">
    {Array.from({ length: 5 }).map((_, i) => (
      <FaStar
        key={i}
        className={`w-3 h-3 ${i < count ? 'text-yellow-400' : 'text-gray-300'}`}
      />
    ))}
  </div>
)

const AdminReviews = () => {
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  // ─── GET Reviews ──────────────────────────────────
  const fetchReviews = async () => {
    try {
      setLoading(true)
      const url = filter === 'all'
        ? `${baseUrl}/api/reviews`
        : `${baseUrl}/api/reviews?status=${filter}`
      const { data } = await axios.get(url)
      setReviews(data.reviews)
    } catch (error) {
      console.error('Error fetching reviews:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchReviews()
  }, [filter])

  // ─── Update Status ────────────────────────────────
  const handleStatusUpdate = async (review, status) => {
    try {
      await axios.put(`${baseUrl}/api/reviews/${review._id}`, { status })
      await fetchReviews()
      Swal.fire({
        title: 'Done!',
        text: `Review ${status} successfully!`,
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
        confirmButtonColor: 'var(--primary)',
      })
    }
  }

  // ─── Delete ───────────────────────────────────────
  const handleDelete = (review) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This review will be deleted permanently!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, delete!',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`${baseUrl}/api/reviews/${review._id}`)
          setReviews((prev) => prev.filter((r) => r._id !== review._id))
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

  // ─── Stats ────────────────────────────────────────
  const pendingCount = reviews.filter((r) => r.status === 'pending').length
  const approvedCount = reviews.filter((r) => r.status === 'approved').length
  const spamCount = reviews.filter((r) => r.status === 'spam').length

  return (
    <div className="space-y-6">

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-[#292d4a] rounded-xl p-5 border border-gray-100 dark:border-gray-700">
          <p className="text-gray-400 text-xs mb-1">Total Reviews</p>
          <p className="text-2xl font-bold text-gray-800 dark:text-white">
            {reviews.length}
          </p>
        </div>
        <div className="bg-white dark:bg-[#292d4a] rounded-xl p-5 border border-gray-100 dark:border-gray-700">
          <p className="text-gray-400 text-xs mb-1">Pending</p>
          <p className="text-2xl font-bold text-yellow-500">{pendingCount}</p>
        </div>
        <div className="bg-white dark:bg-[#292d4a] rounded-xl p-5 border border-gray-100 dark:border-gray-700">
          <p className="text-gray-400 text-xs mb-1">Approved</p>
          <p className="text-2xl font-bold text-green-500">{approvedCount}</p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-[#292d4a] rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">

        {/* Header */}
        <div className="py-5 px-6 border-b border-gray-100 dark:border-gray-700 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h3 className="text-primary font-bold text-lg">Reviews</h3>

          {/* Filter Tabs */}
          <div className="flex gap-2 flex-wrap">
            {['all', 'pending', 'approved', 'spam', 'trash'].map((tab) => (
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
                {tab === 'pending' && pendingCount > 0 && (
                  <span className="ml-1 bg-yellow-400 text-white rounded-full px-1.5 py-0.5 text-xs">
                    {pendingCount}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="py-20 text-center">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          </div>
        ) : reviews.length === 0 ? (
          <div className="py-20 text-center text-gray-400">
            No reviews found
          </div>
        ) : (
          <div className="divide-y divide-gray-100 dark:divide-gray-700">
            {reviews.map((review) => (
              <div
                key={review._id}
                className="p-6 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
              >
                <div className="flex flex-col md:flex-row md:items-start gap-4">

                  {/* User Info */}
                  <div className="flex items-center gap-3 min-w-[200px]">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm shrink-0">
                      {review.user?.firstName?.charAt(0)}
                      {review.user?.lastName?.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-800 dark:text-white">
                        {review.user?.firstName} {review.user?.lastName}
                      </p>
                      <StarRow count={review.rating} />
                    </div>
                  </div>

                  {/* Course */}
                  <div className="flex-1">
                    <p className="text-xs text-primary font-bold mb-1">
                      {review.course?.title}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {review.comment}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(review.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </p>
                  </div>

                  {/* Status + Actions */}
                  <div className="flex flex-col gap-2 items-end">
                    <StatusBadge status={review.status} />

                    <div className="flex gap-2 mt-1">
                      {review.status !== 'approved' && (
                        <button
                          onClick={() => handleStatusUpdate(review, 'approved')}
                          className="px-3 py-1.5 bg-green-100 text-green-700 text-xs font-bold rounded-lg hover:bg-green-200 transition-all"
                        >
                          Approve
                        </button>
                      )}
                      {review.status !== 'spam' && (
                        <button
                          onClick={() => handleStatusUpdate(review, 'spam')}
                          className="px-3 py-1.5 bg-orange-100 text-orange-700 text-xs font-bold rounded-lg hover:bg-orange-200 transition-all"
                        >
                          Spam
                        </button>
                      )}
                      {review.status !== 'trash' && (
                        <button
                          onClick={() => handleStatusUpdate(review, 'trash')}
                          className="px-3 py-1.5 bg-red-100 text-red-700 text-xs font-bold rounded-lg hover:bg-red-200 transition-all"
                        >
                          Trash
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(review)}
                        className="p-1.5 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-all"
                      >
                        <BsTrash size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminReviews