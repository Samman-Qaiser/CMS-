import { useState, useEffect } from 'react';
import { FaStar, FaHeart, FaRegHeart, FaPlay, FaCheckCircle, FaArrowLeft, FaUser, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { useDispatch, useSelector } from "react-redux";
import Swal from 'sweetalert2';

const baseUrl = import.meta.env?.VITE_BACKEND_URL || "https://cms-backend-ashen.vercel.app";

function StarRow({ count = 5 }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <FaStar
          key={i}
          className={i < count ? 'text-yellow-400 w-3.5 h-3.5' : 'text-gray-400 w-3.5 h-3.5'}
        />
      ))}
    </div>
  );
}

// Rating input component
function RatingInput({ rating, onRatingChange }) {
  const [hoverRating, setHoverRating] = useState(0);
  
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onRatingChange(star)}
          onMouseEnter={() => setHoverRating(star)}
          onMouseLeave={() => setHoverRating(0)}
          className="focus:outline-none"
        >
          {star <= (hoverRating || rating) ? (
            <FaStar className="w-6 h-6 text-yellow-400" />
          ) : (
            <FaRegStar className="w-6 h-6 text-gray-400" />
          )}
        </button>
      ))}
    </div>
  );
}

export default function CourseDetail1() {
  const [activeTab, setActiveTab] = useState('about');
  const [wishlisted, setWishlisted] = useState(false);
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [instructor, setInstructor] = useState(null);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [loadingInstructor, setLoadingInstructor] = useState(false);
  const [checkingEnrollment, setCheckingEnrollment] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [userHasReviewed, setUserHasReviewed] = useState(false);
  const [userReview, setUserReview] = useState(null);
  
  const navigate = useNavigate();
  const { id } = useParams();
  const user = useSelector((state) => state.auth.user);

  // Fetch course details
  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await axios.get(`${baseUrl}/api/courses/${id}`);
        
        if (response.data.success && response.data.course) {
          setCourse(response.data.course);
          
          // Fetch instructor data if instructor ID exists
          if (response.data.course.instructor?._id) {
            await fetchInstructorDetails(response.data.course.instructor._id);
          }
          
          // Fetch reviews for this course
          await fetchCourseReviews(id);
        } else {
          setError('Course not found');
        }
      } catch (err) {
        console.error('Error fetching course:', err);
        setError(err.response?.data?.message || 'Failed to load course details');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchCourseDetails();
    }
  }, [id]);

  // Fetch instructor details
  const fetchInstructorDetails = async (instructorId) => {
    try {
      setLoadingInstructor(true);
      const response = await axios.get(`${baseUrl}/api/instructors/${instructorId}`);
      
      if (response.data.success && response.data.instructor) {
        setInstructor(response.data.instructor);
      }
    } catch (err) {
      console.error('Error fetching instructor:', err);
    } finally {
      setLoadingInstructor(false);
    }
  };

  // Fetch course reviews
  const fetchCourseReviews = async (courseId) => {
    try {
      const response = await axios.get(`${baseUrl}/api/reviews`);
      
      if (response.data.success && response.data.reviews) {
        const courseReviews = response.data.reviews.filter(
          review => review.course?._id === courseId && review.status === 'approved'
        );
        setReviews(courseReviews);
        
        // Check if current user has already reviewed
        if (user?.id) {
          const userReviewExists = courseReviews.some(
            review => review.user?._id === user.id
          );
          setUserHasReviewed(userReviewExists);
          
          // Get user's review if exists
          const userReviewData = courseReviews.find(
            review => review.user?._id === user.id
          );
          setUserReview(userReviewData);
        }
      }
    } catch (err) {
      console.error('Error fetching reviews:', err);
      setReviews([]);
    }
  };

  // Check enrollment status - Check by user AND course
  const checkEnrollmentStatus = async () => {
    if (!user?.id || !course?._id) return;
    
    try {
      setCheckingEnrollment(true);
      const response = await axios.get(`${baseUrl}/api/enrollments`, {
        params: {
          user: user.id,
          course: course._id
        }
      });
      
      if (response.data.success) {
        const isUserEnrolled = response.data.enrollments && response.data.enrollments.length > 0;
        setIsEnrolled(isUserEnrolled);
      } else {
        setIsEnrolled(false);
      }
    } catch (error) {
      console.error('Error checking enrollment:', error);
      setIsEnrolled(false);
    } finally {
      setCheckingEnrollment(false);
    }
  };

  // Submit review
  const handleSubmitReview = async () => {
    if (!user?.id) {
      Swal.fire({
        title: 'Login Required',
        text: 'Please login to submit a review',
        icon: 'warning',
        confirmButtonColor: '#FF6F61'
      });
      navigate('/login');
      return;
    }

    if (!isEnrolled) {
      Swal.fire({
        title: 'Not Enrolled',
        text: 'You need to enroll in this course to write a review',
        icon: 'info',
        confirmButtonColor: '#FF6F61'
      });
      return;
    }

    if (userHasReviewed) {
      Swal.fire({
        title: 'Already Reviewed',
        text: 'You have already reviewed this course',
        icon: 'info',
        confirmButtonColor: '#FF6F61'
      });
      return;
    }

    if (!reviewComment.trim()) {
      Swal.fire({
        title: 'Error',
        text: 'Please write your review',
        icon: 'error',
        confirmButtonColor: '#FF6F61'
      });
      return;
    }

    try {
      setSubmittingReview(true);
      
      const reviewData = {
        user: user.id,
        course: course._id,
        instructor: course.instructor?._id,
        rating: reviewRating,
        comment: reviewComment.trim()
      };
      
      const response = await axios.post(`${baseUrl}/api/reviews`, reviewData);
      
      if (response.data.success) {
        Swal.fire({
          title: 'Success!',
          text: 'Your review has been submitted successfully',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false,
          position: 'top-end'
        });
        
        // Reset form
        setReviewRating(5);
        setReviewComment('');
        setShowReviewForm(false);
        setUserHasReviewed(true);
        
        // Refresh reviews
        await fetchCourseReviews(course._id);
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      Swal.fire({
        title: 'Error!',
        text: error.response?.data?.message || 'Failed to submit review',
        icon: 'error',
        confirmButtonColor: '#FF6F61'
      });
    } finally {
      setSubmittingReview(false);
    }
  };

  // Call enrollment check when course and user are available
  useEffect(() => {
    if (course && user?.id) {
      checkEnrollmentStatus();
    }
  }, [course, user?.id]);

  // Add to wishlist functionality
  const handleWishlist = async () => {
    try {
      setWishlisted(!wishlisted);
    } catch (err) {
      console.error('Error updating wishlist:', err);
    }
  };

  // Add to cart
  const handleAddToCart = () => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const exists = cart.some(item => item._id === course._id);
    
    if (!exists) {
      cart.push({
        _id: course._id,
        title: course.title,
        price: course.price,
        thumbnail: course.thumbnail,
        instructor: instructor?.user?.firstName + ' ' + instructor?.user?.lastName || 'Instructor'
      });
      localStorage.setItem('cart', JSON.stringify(cart));
      alert('Course added to cart!');
    } else {
      alert('Course already in cart!');
    }
  };

  // Buy now
  const handleBuyNow = () => {
    if (!user?.id) {
      alert('Please login to purchase this course');
      navigate('/login');
      return;
    }
    navigate(`/dashboard/checkout/${course._id}`);
  };

  // Continue learning
  const handleContinueLearning = () => {
    navigate(`/dashboard/course-details-2/${course._id}`);
  };

  // Format date for reviews
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    return `${Math.floor(diffDays / 365)} years ago`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-[#1E2139] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-[#1E2139] p-6">
        <div className="max-w-5xl mx-auto">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center mb-4 gap-2 text-content-text hover:text-header-text"
          >
            <FaArrowLeft className="w-3.5 h-3.5" />
            <span className="text-sm font-medium">Back</span>
          </button>
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-6 text-center">
            <p className="text-red-600 dark:text-red-400">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-primary text-white rounded-md text-sm"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!course) {
    return null;
  }

  // Get instructor name and image
  const instructorName = instructor?.user 
    ? `${instructor.user.firstName} ${instructor.user.lastName}`
    : course.instructor?.user?.name || 'Instructor';
  
  const instructorImage = instructor?.profileImage || 
                         instructor?.user?.profileImage || 
                         course.instructor?.profileImage ||
                         "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRgs2DOOnn9pY67TodjACV0st9VwO1Q-ZdxOA&s";
  
  const instructorRating = instructor?.rating || course.instructor?.rating || 0;
  const instructorTotalStudents = instructor?.totalStudents || course.instructor?.totalStudents || 0;
  const instructorTotalCourses = instructor?.totalCourses || 0;

  // Calculate discount percentage
  const discountPercent = course.originalPrice > course.price
    ? Math.round(((course.originalPrice - course.price) / course.originalPrice) * 100)
    : 0;

  // Get learning items
  const learningItems = course.whatYouLearn || [];

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-[#1E2139] p-6">
      <div className="max-w-5xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center mb-4 gap-2 text-content-text hover:text-header-text transition-colors duration-200"
        >
          <FaArrowLeft className="w-3.5 h-3.5" />
          <span className="text-sm font-medium">Back</span>
        </button>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* LEFT — Course Info + Tabs */}
          <div className="lg:col-span-3 flex flex-col gap-5">
            {/* Course Info Card */}
            <div className="bg-white dark:bg-[#292D4A] rounded-md p-6">
              <h1 className="text-xl font-bold text-header-text leading-snug mb-3">
                {course.title}
              </h1>
              <p className="text-sm text-content-text leading-relaxed mb-4">
                {course.description || course.excerpt}
              </p>

              {/* Rating Row */}
              <div className="flex items-center gap-4 mb-4 flex-wrap">
                <span className="text-sm font-bold text-header-text">{course.rating || 0}</span>
                <StarRow count={Math.floor(course.rating || 0)} />
                <span className="text-sm text-content-text">
                  Review ({course.totalReviews || reviews.length || 0})
                </span>
                <span className="text-sm text-content-text">
                  {course.totalStudents || 0} Students
                </span>
              </div>

              {/* Instructor - Enhanced with fetched data */}
              <div className="flex items-center gap-3">
                <img
                  src={instructorImage}
                  alt={instructorName}
                  className="w-9 h-9 rounded-md object-cover"
                />
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-header-text">
                    {instructorName}
                  </span>
                  {!loadingInstructor && instructor && (
                    <div className="flex items-center gap-3 text-xs text-content-text">
                      <span>⭐ {instructorRating} Rating</span>
                      <span>📚 {instructorTotalCourses} Courses</span>
                      <span>👥 {instructorTotalStudents} Students</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Tabs Card */}
            <div className="bg-white dark:bg-[#292D4A] rounded-md overflow-hidden">
              {/* Tab Bar */}
              <div className="flex border-b border-gray-200 dark:border-white/10 px-6">
                {['about', 'reviews'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`
                      py-4 px-2 mr-6 text-sm font-semibold capitalize border-b-2 transition-colors duration-200
                      ${activeTab === tab
                        ? 'border-primary text-primary'
                        : 'border-transparent text-content-text hover:text-header-text'
                      }
                    `}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    {tab === 'reviews' && reviews.length > 0 && (
                      <span className="ml-1 text-xs">({reviews.length})</span>
                    )}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <div className="p-6 flex flex-col gap-5">
                {activeTab === 'about' && (
                  <div className="flex flex-col gap-4">
                    <p className="text-sm text-content-text leading-relaxed">
                      {course.description || 'No description available.'}
                    </p>
                    
                    {/* Requirements */}
                    {course.requirements && course.requirements.length > 0 && (
                      <div>
                        <h3 className="text-md font-semibold text-header-text mb-2">Requirements:</h3>
                        <ul className="list-disc list-inside text-sm text-content-text">
                          {course.requirements.map((req, index) => (
                            <li key={index}>{req}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {/* Course Tags */}
                    {course.tags && course.tags.length > 0 && (
                      <div>
                        <h3 className="text-md font-semibold text-header-text mb-2">Tags:</h3>
                        <div className="flex flex-wrap gap-2">
                          {course.tags.map((tag, index) => (
                            <span key={index} className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-md text-xs">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'reviews' && (
                  <div className="flex flex-col gap-5">
                    {/* Write Review Button - Only show for enrolled users who haven't reviewed */}
                    {isEnrolled && !userHasReviewed && (
                      <div className="mb-4">
                        {!showReviewForm ? (
                          <button
                            onClick={() => setShowReviewForm(true)}
                            className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors"
                          >
                            Write a Review
                          </button>
                        ) : (
                          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                            <h4 className="text-md font-semibold text-header-text mb-3">Write Your Review</h4>
                            
                            {/* Rating Selector */}
                            <div className="mb-4">
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Your Rating
                              </label>
                              <RatingInput rating={reviewRating} onRatingChange={setReviewRating} />
                            </div>
                            
                            {/* Review Comment */}
                            <div className="mb-4">
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Your Review
                              </label>
                              <textarea
                                value={reviewComment}
                                onChange={(e) => setReviewComment(e.target.value)}
                                rows="4"
                                placeholder="Share your experience with this course..."
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-800 dark:text-white"
                              />
                            </div>
                            
                            {/* Action Buttons */}
                            <div className="flex gap-3">
                              <button
                                onClick={handleSubmitReview}
                                disabled={submittingReview}
                                className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50"
                              >
                                {submittingReview ? 'Submitting...' : 'Submit Review'}
                              </button>
                              <button
                                onClick={() => {
                                  setShowReviewForm(false);
                                  setReviewRating(5);
                                  setReviewComment('');
                                }}
                                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                    
                    {/* User's own review message */}
                    {userHasReviewed && (
                      <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3 mb-2">
                        <p className="text-sm text-green-700 dark:text-green-400">
                          ✅ You have already reviewed this course. Thank you for your feedback!
                        </p>
                      </div>
                    )}
                    
                    {/* All Reviews */}
                    {reviews.length > 0 ? (
                      reviews.map((review) => (
                        <div key={review._id} className="flex flex-col gap-2 pb-5 border-b border-gray-100 dark:border-white/10 last:border-none last:pb-0">
                          <div className="flex items-center gap-3">
                            <img
                              src={review.user?.profileImage || "https://i.pravatar.cc/40"}
                              alt={review.user?.firstName || 'User'}
                              className="w-10 h-10 rounded-md object-cover"
                            />
                            <div className="flex flex-col gap-0.5">
                              <span className="text-sm font-bold text-header-text">
                                {review.user?.firstName} {review.user?.lastName}
                                {review.user?._id === user?.id && (
                                  <span className="ml-2 text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                                    You
                                  </span>
                                )}
                              </span>
                              <div className="flex items-center gap-3">
                                <StarRow count={review.rating} />
                                <span className="text-xs text-content-text">
                                  {formatDate(review.createdAt)}
                                </span>
                              </div>
                            </div>
                          </div>
                          <p className="text-sm text-content-text leading-relaxed">{review.comment}</p>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-sm text-content-text mb-3">
                          No reviews yet.
                          {isEnrolled && !userHasReviewed && ' Be the first to review this course!'}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT — Purchase Card */}
          <div className="lg:col-span-2 flex flex-col gap-5">
            {/* Video Thumbnail */}
            <div className="bg-white dark:bg-[#292D4A] rounded-md overflow-hidden">
              <div className="relative">
                <img
                  src={course.thumbnail || "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=500&q=80"}
                  alt={course.title}
                  className="w-full h-48 object-cover"
                />
                {course.previewVideo && (
                  <a
                    href={course.previewVideo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute inset-0 bg-black/30 flex flex-col items-center justify-center gap-2 group cursor-pointer"
                  >
                    <div className="w-14 h-14 rounded-md bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center group-hover:bg-white/30 transition-all">
                      <FaPlay className="w-5 h-5 text-white ml-1" />
                    </div>
                    <span className="text-white text-sm font-semibold tracking-wide">View Demo</span>
                  </a>
                )}
              </div>
            </div>

            {/* Price + Actions */}
            <div className="bg-white dark:bg-[#292D4A] rounded-md p-5 flex flex-col gap-4">
              {/* Price Row */}
              <div className="flex items-center gap-3 flex-wrap">
                <span className="text-2xl font-bold text-header-text">${course.price}</span>
                {course.originalPrice > course.price && (
                  <>
                    <span className="text-sm text-content-text line-through">${course.originalPrice}</span>
                    <span className="text-xs font-bold text-primary border border-primary rounded-md px-2 py-0.5">
                      Save {discountPercent}%
                    </span>
                  </>
                )}
              </div>

              {/* Course Level & Language */}
              <div className="flex gap-4 text-xs text-content-text">
                <span>Level: <span className="font-semibold capitalize">{course.level || 'Beginner'}</span></span>
                <span>Language: <span className="font-semibold">{course.language || 'English'}</span></span>
              </div>

              {/* Wishlist */}
              <button
                onClick={handleWishlist}
                className="flex items-center gap-2 text-sm text-content-text hover:text-header-text transition-colors duration-200 w-fit"
              >
                {wishlisted
                  ? <FaHeart className="w-4 h-4 text-red-500" />
                  : <FaRegHeart className="w-4 h-4 text-primary" />
                }
                <span>Add to Wishlist</span>
              </button>

              {/* What you'll learn */}
              {learningItems.length > 0 && (
                <div>
                  <h3 className="text-sm font-bold text-header-text mb-3">What you'll learn:</h3>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2.5">
                    {learningItems.slice(0, 6).map((item, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <FaCheckCircle className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                        <span className="text-xs text-content-text leading-snug">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* CTA Buttons */}
              {checkingEnrollment ? (
                <div className="flex justify-center py-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                </div>
              ) : (
               <>
  {isEnrolled ? (
    <div className="mt-2">
      <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 mb-2">
        <div className="flex items-center gap-2">
          <FaCheckCircle className="w-5 h-5 text-green-500" />
          <p className="text-sm font-semibold text-green-700 dark:text-green-400">
            You are already enrolled in this course!
          </p>
        </div>
      </div>
      <button
        onClick={handleContinueLearning}
        className="w-full py-2.5 rounded-md bg-green-600 hover:bg-green-700 text-sm font-semibold text-white transition-colors duration-200"
      >
        Continue Learning
      </button>
    </div>
  ) : (
    // Check if user is admin or course instructor
    (user?.role === 'admin' || (user?.role === 'instructor' && course?.instructor?._id === user?.id)) ? (
      // For admin or course instructor - show management options
      <div className="mt-2">
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-2">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <p className="text-sm font-semibold text-blue-700 dark:text-blue-400">
              {user?.role === 'admin' ? 'Admin Access' : 'You are the instructor of this course'}
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => navigate(`/dashboard/course-details-2/${course._id}`)}
            className="flex-1 py-2.5 rounded-md bg-blue-600 hover:bg-blue-700 text-sm font-semibold text-white transition-colors duration-200"
          >
        View Course
          </button>
        
        </div>
      </div>
    ) : (
      // Normal user - show buy button
      <div className="flex gap-3 pt-1">
    
        <button
          onClick={handleBuyNow}
          className="flex-1 py-2.5 rounded-md bg-primary hover:bg-primary/70 text-sm font-semibold text-white transition-colors duration-200"
        >
          Buy Now
        </button>
      </div>
    )
  )}
</>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}