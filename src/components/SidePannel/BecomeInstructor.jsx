import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const baseUrl =
  import.meta.env?.VITE_BACKEND_URL ||
  "https://cms-backend-ashen.vercel.app";

const BecomeInstructor = ({ userId }) => {
  const [status, setStatus] = useState('none')
  const [loading, setLoading] = useState(false)

  // ─── GET User Status ──────────────────────────────
  useEffect(() => {
    const fetchUserStatus = async () => {
      try {
        const { data } = await axios.get(`${baseUrl}/api/users/${userId}`)
        setStatus(data.user.instructorStatus || 'none')
      } catch (error) {
        console.error('Error fetching user:', error)
      }
    }

    if (userId) fetchUserStatus()
  }, [userId])

  // ─── Apply ────────────────────────────────────────
  const handleApply = async () => {
    Swal.fire({
      title: 'Become an Instructor?',
      text: 'Your application will be reviewed by admin. Are you sure?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: 'var(--primary)',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, Apply!',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          setLoading(true)
          await axios.post(`${baseUrl}/api/users/apply-instructor`, {
            userId,
          })
          setStatus('pending')
          Swal.fire({
            title: 'Application Submitted!',
            text: 'Your application is under review. We will notify you via email.',
            icon: 'success',
            confirmButtonColor: 'var(--primary)',
          })
        } catch (error) {
          Swal.fire({
            title: 'Error!',
            text: error.response?.data?.message || 'Something went wrong',
            icon: 'error',
            confirmButtonColor: 'var(--primary)',
          })
        } finally {
          setLoading(false)
        }
      }
    })
  }

  // ─── UI based on status ───────────────────────────
  const renderContent = () => {
    if (status === 'pending') {
      return (
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-yellow-400 animate-pulse" />
          <div>
            <p className="text-sm font-bold text-yellow-400">
              Application Pending
            </p>
            <p className="text-xs text-gray-400">
            Your application is under review. We will notify you via email
            </p>
          </div>
        </div>
      )
    }

    if (status === 'rejected') {
      return (
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <div>
              <p className="text-sm font-bold text-red-400">
                Application Rejected
              </p>
              <p className="text-xs text-gray-400">
            Your application was rejected — you can apply again.
              </p>
            </div>
          </div>
          <button
            onClick={handleApply}
            disabled={loading}
            className="px-6 py-2 bg-primary text-white text-sm font-bold rounded-xl hover:opacity-90 active:scale-95 transition-all disabled:opacity-50"
          >
            {loading ? 'Applying...' : 'Apply Again'}
          </button>
        </div>
      )
    }

    return (
      <button
        onClick={handleApply}
        disabled={loading}
        className="px-6 py-2 bg-primary text-white text-sm font-bold rounded-xl hover:opacity-90 active:scale-95 transition-all disabled:opacity-50"
      >
        {loading ? 'Applying...' : 'Apply Now'}
      </button>
    )
  }

  return (
    <div className="bg-white dark:bg-[#292d4a] rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
      <div className="flex items-center gap-4 mb-4">
        {/* Icon */}
        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6 text-primary"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
            />
          </svg>
        </div>
        <div>
          <h3 className="text-gray-800 dark:text-white font-bold text-lg">
            Become an Instructor
          </h3>
          <p className="text-gray-400 text-xs">
            Join our platform and start teaching thousands of students!
          </p>
        </div>
      </div>

      {/* Benefits */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="text-center p-3 bg-primary/5 rounded-xl">
          <p className="text-primary font-bold text-lg">10K+</p>
          <p className="text-gray-400 text-xs">Students</p>
        </div>
        <div className="text-center p-3 bg-primary/5 rounded-xl">
          <p className="text-primary font-bold text-lg">$500+</p>
          <p className="text-gray-400 text-xs">Avg Earnings</p>
        </div>
        <div className="text-center p-3 bg-primary/5 rounded-xl">
          <p className="text-primary font-bold text-lg">Free</p>
          <p className="text-gray-400 text-xs">To Join</p>
        </div>
      </div>

      {/* Action */}
      {renderContent()}
    </div>
  )
}

export default BecomeInstructor