import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import axios from 'axios'
import Swal from 'sweetalert2'

const baseUrl =
  import.meta.env?.VITE_BACKEND_URL ||
  "https://cms-backend-ashen.vercel.app";

export default function CreateLiveClass() {
  const navigate = useNavigate()
  const currentUser = useSelector((state) => state.auth.user)

  const [courses, setCourses] = useState([])
  const [instructorId, setInstructorId] = useState(null)
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [error, setError] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    course: '',
    streamUrl: '',
    scheduledAt: '',
  })

  // ─── Instructor + Courses fetch ───────────────────
  useEffect(() => {
    const fetchData = async () => {
      try {
        setFetching(true)
        setError(null)
        
        console.log('Current User:', currentUser)
        
        if (!currentUser?.id) {
          console.log('No user found')
          setFetching(false)
          return
        }

        // First, check if user has an instructor profile
        console.log('Fetching instructor for user:', currentUser.id)
        
        try {
          const instrResponse = await axios.get(
            `${baseUrl}/api/instructors/user/${currentUser.id}`
          )
          
          console.log('Instructor response:', instrResponse.data)
          
          if (!instrResponse.data.success || !instrResponse.data.instructor) {
            // If instructor not found, offer to create one
            const result = await Swal.fire({
              title: 'Instructor Profile Required',
              text: 'You need to be registered as an instructor to create live classes. Would you like to register now?',
              icon: 'warning',
              showCancelButton: true,
              confirmButtonText: 'Register as Instructor',
              cancelButtonText: 'Cancel',
              confirmButtonColor: 'var(--primary)',
            })
            
            if (result.isConfirmed) {
              // Navigate to instructor registration page
              navigate('/dashboard/become-instructor')
              return
            }
            setError('You are not registered as an instructor')
            setFetching(false)
            return
          }
          
          const instrId = instrResponse.data.instructor._id
          setInstructorId(instrId)
          console.log('Instructor ID:', instrId)

          // Then, fetch courses for this instructor
          console.log('Fetching courses for instructor:', instrId)
          const coursesResponse = await axios.get(
            `${baseUrl}/api/courses?instructor=${instrId}`
          )
          
          console.log('Courses response:', coursesResponse.data)
          
          if (coursesResponse.data.success) {
            setCourses(coursesResponse.data.courses || [])
            console.log('Courses loaded:', coursesResponse.data.courses?.length || 0)
          } else {
            setCourses([])
            if (coursesResponse.data.courses?.length === 0) {
              setError('No courses found. Please create a course first.')
            }
          }
          
        } catch (instrError) {
          console.error('Instructor fetch error:', instrError)
          
          if (instrError.response?.status === 404) {
            // Instructor not found - offer registration
            const result = await Swal.fire({
              title: 'Instructor Profile Required',
              text: 'You need to be registered as an instructor to create live classes. Would you like to register now?',
              icon: 'warning',
              showCancelButton: true,
              confirmButtonText: 'Register as Instructor',
              cancelButtonText: 'Cancel',
              confirmButtonColor: 'var(--primary)',
            })
            
            if (result.isConfirmed) {
              navigate('/dashboard/become-instructor')
            }
            setError('Instructor profile not found')
          } else {
            setError(instrError.response?.data?.message || 'Failed to load instructor data')
          }
        }
        
      } catch (error) {
        console.error('Error fetching data:', error)
        setError(error.response?.data?.message || error.message || 'Failed to load courses')
      } finally {
        setFetching(false)
      }
    }

    if (currentUser?.id) {
      fetchData()
    } else {
      setFetching(false)
    }
  }, [currentUser?.id, navigate])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  // ─── Submit ───────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.title || !formData.course || !formData.scheduledAt) {
      Swal.fire({
        title: 'Error!',
        text: 'Title, course and scheduled time are required',
        icon: 'error',
        confirmButtonColor: 'var(--primary)',
      })
      return
    }

    try {
      setLoading(true)

      const payload = {
        title: formData.title,
        instructor: instructorId,
        course: formData.course,
        streamUrl: formData.streamUrl || null,
        scheduledAt: formData.scheduledAt,
      }

      console.log('Submitting payload:', payload)

      const { data } = await axios.post(`${baseUrl}/api/live-classes`, payload)

      Swal.fire({
        title: 'Live Class Created!',
        text: 'Your live class has been scheduled successfully.',
        icon: 'success',
        confirmButtonColor: 'var(--primary)',
      }).then(() => {
        navigate(`/dashboard/instructor-live-class/${data.liveClass._id}`)
      })

    } catch (error) {
      console.error('Submit error:', error)
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

  if (fetching) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white dark:bg-[#292D4A] rounded-xl shadow-sm p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-content-text">Loading your courses...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white dark:bg-[#292D4A] rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">

        {/* Header */}
        <div className="py-6 px-8 border-b border-gray-100 dark:border-gray-700">
          <h3 className="text-primary font-bold text-xl">Create Live Class</h3>
          <p className="text-content-text text-sm mt-1">
            Schedule a new live class for your students
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-8 space-y-6">

          {/* Error Display */}
          {error && (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              {error.includes('instructor') && (
                <button
                  type="button"
                  onClick={() => navigate('/dashboard/become-instructor')}
                  className="mt-3 px-4 py-2 bg-primary text-white rounded-lg text-sm hover:bg-primary/90"
                >
                  Register as Instructor
                </button>
              )}
            </div>
          )}

          {/* Title */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-content-text">
              Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. Full-Stack Web Developer Live Session"
              required
              disabled={!!error}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 outline-none focus:border-primary dark:bg-transparent text-sm disabled:opacity-50"
            />
          </div>

          {/* Course */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-content-text">
              Course *
            </label>
            <select
              name="course"
              value={formData.course}
              onChange={handleChange}
              required
              disabled={courses.length === 0 || !!error}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 outline-none focus:border-primary dark:bg-bg-main text-sm disabled:opacity-50"
            >
              <option value="">{courses.length === 0 ? 'No courses available' : 'Select a course'}</option>
              {courses.map((course) => (
                <option key={course._id} value={course._id}>
                  {course.title}
                </option>
              ))}
            </select>
            
            {courses.length === 0 && !error && (
              <div className="mt-3 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
                <p className="text-sm text-amber-600 dark:text-amber-400">
                  You don't have any courses yet. 
                  <button
                    type="button"
                    onClick={() => navigate('/dashboard/create-course')}
                    className="ml-2 text-primary hover:underline"
                  >
                    Create a course first
                  </button>
                </p>
              </div>
            )}
          </div>

          {/* Stream URL */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-content-text">
              Stream URL
              <span className="text-xs text-gray-400 ml-2">(YouTube, Zoom, etc.)</span>
            </label>
            <input
              type="url"
              name="streamUrl"
              value={formData.streamUrl}
              onChange={handleChange}
              placeholder="https://youtube.com/live/... or https://zoom.us/j/..."
              disabled={!!error}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 outline-none focus:border-primary dark:bg-transparent text-sm disabled:opacity-50"
            />
          </div>

          {/* Scheduled At */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-content-text">
              Scheduled Date & Time *
            </label>
            <input
              type="datetime-local"
              name="scheduledAt"
              value={formData.scheduledAt}
              onChange={handleChange}
              required
              disabled={!!error}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 outline-none focus:border-primary dark:bg-transparent dark:text-white text-sm disabled:opacity-50"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex-1 py-3 border border-gray-200 dark:border-gray-700 text-content-text rounded-xl font-bold hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || courses.length === 0 || !!error}
              className="flex-1 py-3 bg-primary text-white rounded-xl font-bold hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating...' : 'Create Live Class'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}