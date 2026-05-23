import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const baseUrl =
  import.meta.env?.VITE_BACKEND_URL ||
  "https://cms-backend-ashen.vercel.app";

const InstructorApplications = () => {
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  // ─── GET Applications ─────────────────────────────
  const fetchApplications = async () => {
    try {
      setLoading(true)
      const { data } = await axios.get(
        `${baseUrl}/api/users/instructor-applications`
      )
      setApplications(data.applications)
    } catch (error) {
      console.error('Error fetching applications:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchApplications()
  }, [])

  // ─── Approve / Reject ─────────────────────────────
  const handleStatusUpdate = async (userId, status, userName) => {
    Swal.fire({
      title: `${status === 'approved' ? 'Approve' : 'Reject'} Application?`,
      text: `Are you sure you want to ${status} ${userName}'s application?`,
      icon: status === 'approved' ? 'question' : 'warning',
      showCancelButton: true,
      confirmButtonColor: status === 'approved' ? '#10b981' : '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: status === 'approved' ? 'Yes, Approve!' : 'Yes, Reject!',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.put(
            `${baseUrl}/api/users/${userId}/instructor-status`,
            { status }
          )
          await fetchApplications()
          Swal.fire({
            title: 'Done!',
            text: `Application ${status} successfully!`,
            icon: 'success',
            confirmButtonColor: 'var(--primary)',
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
    })
  }

  // ─── Filter ───────────────────────────────────────
  const filteredApplications = applications.filter((app) => {
    if (filter === 'all') return true
    return app.instructorStatus === filter
  })

  // ─── Status Badge ─────────────────────────────────
  const StatusBadge = ({ status }) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-700',
      approved: 'bg-green-100 text-green-700',
      rejected: 'bg-red-100 text-red-700',
    }
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-bold capitalize ${styles[status]}`}>
        {status}
      </span>
    )
  }

  return (
    <div className="space-y-6">

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-[#292d4a] rounded-xl p-5 border border-gray-100 dark:border-gray-700">
          <p className="text-gray-400 text-xs mb-1">Total Applications</p>
          <p className="text-2xl font-bold text-gray-800 dark:text-white">
            {applications.length}
          </p>
        </div>
        <div className="bg-white dark:bg-[#292d4a] rounded-xl p-5 border border-gray-100 dark:border-gray-700">
          <p className="text-gray-400 text-xs mb-1">Pending</p>
          <p className="text-2xl font-bold text-yellow-500">
            {applications.filter((a) => a.instructorStatus === 'pending').length}
          </p>
        </div>
        <div className="bg-white dark:bg-[#292d4a] rounded-xl p-5 border border-gray-100 dark:border-gray-700">
          <p className="text-gray-400 text-xs mb-1">Approved</p>
          <p className="text-2xl font-bold text-green-500">
            {applications.filter((a) => a.instructorStatus === 'approved').length}
          </p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-[#292d4a] rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        {/* Header */}
        <div className="py-5 px-6 border-b border-gray-100 dark:border-gray-700 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h3 className="text-primary font-bold text-lg">
            Instructor Applications
          </h3>

          {/* Filter Tabs */}
          <div className="flex gap-2">
            {['all', 'pending', 'approved', 'rejected'].map((tab) => (
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
              </button>
            ))}
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          {loading ? (
            <div className="py-20 text-center text-gray-400">Loading...</div>
          ) : filteredApplications.length === 0 ? (
            <div className="py-20 text-center text-gray-400">
              No applications found
            </div>
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr className="text-gray-400 uppercase text-xs tracking-wider border-b border-gray-100 dark:border-gray-700">
                  <th className="px-6 py-3 font-bold">Applicant</th>
                  <th className="px-6 py-3 font-bold">Email</th>
                  <th className="px-6 py-3 font-bold">Username</th>
                  <th className="px-6 py-3 font-bold">Applied</th>
                  <th className="px-6 py-3 font-bold">Status</th>
                  <th className="px-6 py-3 font-bold text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {filteredApplications.map((app) => (
                  <tr
                    key={app._id}
                    className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                  >
                    {/* Applicant */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                          {app.firstName?.charAt(0)}{app.lastName?.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-800 dark:text-white">
                            {app.firstName} {app.lastName}
                          </p>
                          <p className="text-xs text-gray-400 capitalize">{app.role}</p>
                        </div>
                      </div>
                    </td>

                    {/* Email */}
                    <td className="px-6 py-4 text-xs text-gray-500">
                      {app.email}
                    </td>

                    {/* Username */}
                    <td className="px-6 py-4 text-xs text-gray-500">
                      @{app.username}
                    </td>

                    {/* Applied Date */}
                    <td className="px-6 py-4 text-xs text-gray-500">
                      {new Date(app.updatedAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4">
                      <StatusBadge status={app.instructorStatus} />
                    </td>

                    {/* Action */}
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        {app.instructorStatus === 'pending' && (
                          <>
                            <button
                              onClick={() => handleStatusUpdate(
                                app._id, 'approved',
                                `${app.firstName} ${app.lastName}`
                              )}
                              className="px-3 py-1.5 bg-green-100 text-green-700 text-xs font-bold rounded-lg hover:bg-green-200 transition-all"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleStatusUpdate(
                                app._id, 'rejected',
                                `${app.firstName} ${app.lastName}`
                              )}
                              className="px-3 py-1.5 bg-red-100 text-red-700 text-xs font-bold rounded-lg hover:bg-red-200 transition-all"
                            >
                              Reject
                            </button>
                          </>
                        )}
                        {app.instructorStatus === 'approved' && (
                          <span className="text-xs text-green-500 font-bold">
                            ✅ Approved
                          </span>
                        )}
                        {app.instructorStatus === 'rejected' && (
                          <button
                            onClick={() => handleStatusUpdate(
                              app._id, 'approved',
                              `${app.firstName} ${app.lastName}`
                            )}
                            className="px-3 py-1.5 bg-green-100 text-green-700 text-xs font-bold rounded-lg hover:bg-green-200 transition-all"
                          >
                            Approve Now
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}

export default InstructorApplications