// src/pages/CourseDetail2.jsx
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FaArrowLeft, FaShareAlt, FaBookmark, FaList, FaPlay, FaHeadphones, FaFileAlt, FaQuestionCircle, FaLock, FaUnlockAlt, FaCheckCircle, FaSpinner } from 'react-icons/fa';
import { BsThreeDots } from 'react-icons/bs';
import axios from 'axios';
import { useSelector } from 'react-redux';
import Swal from 'sweetalert2';

const baseUrl = import.meta.env?.VITE_BACKEND_URL || "https://cms-backend-ashen.vercel.app";

// ─── Components ─────────────────────────────────────────────────────────────

const CourseMeta = ({ title, rating, reviewCount, students }) => (
  <div>
    <h1 className="text-xl font-bold text-header-text leading-snug mb-2">{title}</h1>
    <div className="flex items-center gap-4 flex-wrap">
      <span className="text-sm font-bold text-header-text">{rating}</span>
      <div className="flex items-center gap-0.5">
        {[...Array(5)].map((_, i) => (
          <svg key={i} className={`w-3.5 h-3.5 ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
      <span className="text-sm text-content-text">Review ({reviewCount})</span>
      <span className="text-sm text-content-text">{students} Students</span>
    </div>
  </div>
);

const VideoThumbnail = ({ src, previewVideo }) => (
  <div className="relative rounded-lg overflow-hidden">
    <img src={src} alt="course preview" className="w-full h-48 object-cover" />
    {previewVideo && (
      <a
        href={previewVideo}
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
);

const TabBar = ({ tabs, active, onChange }) => (
  <div className="flex border-b border-gray-200 dark:border-white/10">
    {tabs.map((tab) => (
      <button
        key={tab}
        onClick={() => onChange(tab)}
        className={`
          py-3 px-2 mr-6 text-sm font-semibold capitalize border-b-2 transition-colors duration-200
          ${active === tab
            ? 'border-primary text-primary'
            : 'border-transparent text-content-text hover:text-header-text'}
        `}
      >
        {tab}
      </button>
    ))}
  </div>
);

const ReviewCard = ({ name, rating, time, avatar, text }) => (
  <div className="flex flex-col gap-2 pb-4 border-b border-gray-100 dark:border-white/10 last:border-none">
    <div className="flex items-center gap-3">
      <img src={avatar || "https://i.pravatar.cc/40"} alt={name} className="w-10 h-10 rounded-full object-cover" />
      <div>
        <span className="text-sm font-bold text-header-text">{name}</span>
        <div className="flex items-center gap-2 mt-1">
          <div className="flex items-center gap-0.5">
            {[...Array(5)].map((_, i) => (
              <svg key={i} className={`w-3 h-3 ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <span className="text-xs text-content-text">{time}</span>
        </div>
      </div>
    </div>
    <p className="text-sm text-content-text leading-relaxed">{text}</p>
  </div>
);

const LessonRow = ({ lesson, isCompleted, isUnlocked, onClick }) => {
  const getIcon = () => {
    if (isCompleted) return <FaCheckCircle className="w-3.5 h-3.5 text-green-500" />;
    switch(lesson?.type) {
      case 'video': return <FaPlay className="w-3.5 h-3.5" />;
      case 'audio': return <FaHeadphones className="w-3.5 h-3.5" />;
      case 'quiz': return <FaQuestionCircle className="w-3.5 h-3.5" />;
      default: return <FaFileAlt className="w-3.5 h-3.5" />;
    }
  };

  return (
    <button
      onClick={onClick}
      disabled={!isUnlocked}
      className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors ${
        isUnlocked 
          ? `hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer ${isCompleted ? 'bg-green-50 dark:bg-green-900/20' : ''}`
          : 'opacity-60 cursor-not-allowed'
      }`}
    >
      <div className="flex items-center gap-3">
        <div className={`${isCompleted ? 'text-green-500' : 'text-content-text'}`}>
          {getIcon()}
        </div>
        <span className={`text-sm text-left ${isCompleted ? 'text-green-700 dark:text-green-400 font-medium' : 'text-content-text'}`}>
          {lesson?.title}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-xs text-content-text">{lesson?.duration || '0:00'}</span>
        {!isUnlocked && <FaLock className="w-3 h-3 text-content-text/50" />}
        {isUnlocked && !isCompleted && <FaUnlockAlt className="w-3 h-3 text-green-500" />}
      </div>
    </button>
  );
};

const AccordionSection = ({ label, progress, total, children, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const percentage = total > 0 ? (progress / total) * 100 : 0;
  
  return (
    <div className="bg-white dark:bg-[#292D4A] rounded-md overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-5 py-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
      >
        <div className="flex-1 text-left">
          <span className="text-sm font-bold text-header-text">{label}</span>
          {total > 0 && (
            <div className="flex items-center gap-2 mt-1">
              <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                <div className="bg-primary rounded-full h-1.5 transition-all" style={{ width: `${percentage}%` }} />
              </div>
              <span className="text-xs text-content-text">{progress}/{total} completed</span>
            </div>
          )}
        </div>
        <svg className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {isOpen && <div className="px-3 pb-3">{children}</div>}
    </div>
  );
};

const ProgressBar = ({ label, current, total }) => {
  const percentage = total > 0 ? (current / total) * 100 : 0;
  
  return (
    <div>
      <div className="flex justify-between text-sm mb-2">
        <span className="text-content-text">{label}</span>
        <span className="text-content-text font-semibold text-primary">{Math.round(percentage)}%</span>
      </div>
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
        <div className="bg-primary rounded-full h-2 transition-all" style={{ width: `${percentage}%` }} />
      </div>
    </div>
  );
};

// ─── Main Component ─────────────────────────────────────────────────────────

export default function CourseDetail2() {
  const navigate = useNavigate();
  const { id } = useParams();
  const user = useSelector((state) => state.auth.user);
  
  const [activeTab, setActiveTab] = useState('about');
  const [course, setCourse] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState([]);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [enrollment, setEnrollment] = useState(null);
  const [completedLessons, setCompletedLessons] = useState([]);
  const [checkingEnrollment, setCheckingEnrollment] = useState(false);

  // Fetch course details
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await axios.get(`${baseUrl}/api/courses/${id}`);
        if (response.data.success) {
          setCourse(response.data.course);
        }
      } catch (error) {
        console.error('Error fetching course:', error);
        Swal.fire({
          title: 'Error!',
          text: 'Failed to load course details',
          icon: 'error',
          confirmButtonColor: '#FF6F61'
        });
      }
    };
    
    if (id) fetchCourse();
  }, [id]);

  // Fetch chapters and lessons
  useEffect(() => {
    const fetchChapters = async () => {
      try {
        const response = await axios.get(`${baseUrl}/api/chapters/course/${id}`);
        if (response.data.success && response.data.chapters) {
          // Fetch lessons for each chapter
          const chaptersWithLessons = await Promise.all(
            response.data.chapters.map(async (chapter) => {
              const lessonsRes = await axios.get(`${baseUrl}/api/lessons/chapter/${chapter._id}`);
              return {
                ...chapter,
                lessons: lessonsRes.data.success ? lessonsRes.data.lessons : []
              };
            })
          );
          setChapters(chaptersWithLessons);
        }
      } catch (error) {
        console.error('Error fetching chapters:', error);
      }
    };
    
    if (id) fetchChapters();
  }, [id]);

  // Fetch reviews
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get(`${baseUrl}/api/reviews`);
        if (response.data.success && response.data.reviews) {
          const courseReviews = response.data.reviews.filter(
            review => review.course?._id === id && review.status === 'approved'
          );
          setReviews(courseReviews);
        }
      } catch (error) {
        console.error('Error fetching reviews:', error);
      }
    };
    
    if (id) fetchReviews();
  }, [id]);

  // Check enrollment and fetch progress
  useEffect(() => {
    const checkEnrollmentAndProgress = async () => {
      if (!user?.id || !id) {
        setLoading(false);
        return;
      }
      
      try {
        setCheckingEnrollment(true);
        const response = await axios.get(`${baseUrl}/api/enrollments`, {
          params: { user: user.id, course: id }
        });
        
        if (response.data.success && response.data.enrollments?.length > 0) {
          const userEnrollment = response.data.enrollments[0];
          setIsEnrolled(true);
          setEnrollment(userEnrollment);
          setCompletedLessons(userEnrollment.completedLessons || []);
        } else {
          setIsEnrolled(false);
          setCompletedLessons([]);
        }
      } catch (error) {
        console.error('Error checking enrollment:', error);
      } finally {
        setCheckingEnrollment(false);
        setLoading(false);
      }
    };
    
    checkEnrollmentAndProgress();
  }, [user?.id, id]);

  // Handle lesson click
 // In CourseDetail2, update the handleLessonClick function:
const handleLessonClick = (lesson) => {
  if (!isEnrolled) {
    Swal.fire({
      title: 'Not Enrolled',
      text: 'Please enroll in this course to access lessons',
      icon: 'warning',
      confirmButtonColor: '#FF6F61',
      confirmButtonText: 'Enroll Now'
    }).then((result) => {
      if (result.isConfirmed) {
        navigate(`/dashboard/checkout/${course._id}`);
      }
    });
    return;
  }
  
  // Pass lesson data through state to avoid API call
  navigate(`/dashboard/lesson/${lesson._id}`, {
    state: { 
      lesson: lesson, 
      courseId: course._id,
      enrollmentId: enrollment?._id,
      courseTitle: course.title
    }
  });
};

  // Check if lesson is completed
  const isLessonCompleted = (lessonId) => {
    return completedLessons.includes(lessonId);
  };

  // Check if lesson is unlocked (all previous lessons in chapter completed)
  const isLessonUnlocked = (chapterLessons, currentIndex) => {
    if (!isEnrolled) return false;
    if (currentIndex === 0) return true;
    // Check if all previous lessons in this chapter are completed
    return chapterLessons.slice(0, currentIndex).every(lesson => 
      completedLessons.includes(lesson._id)
    );
  };

  // Calculate chapter progress
  const getChapterProgress = (chapter) => {
    if (!chapter.lessons?.length) return 0;
    const completed = chapter.lessons.filter(lesson => 
      completedLessons.includes(lesson._id)
    ).length;
    return completed;
  };

  // Calculate overall course progress
  const getOverallProgress = () => {
    const totalLessons = chapters.reduce((sum, ch) => sum + (ch.lessons?.length || 0), 0);
    if (totalLessons === 0) return 0;
    return Math.round((completedLessons.length / totalLessons) * 100);
  };

  if (loading || checkingEnrollment) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-[#1E2139] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-500">Loading course content...</p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-[#1E2139] flex items-center justify-center">
        <p className="text-gray-500">Course not found</p>
      </div>
    );
  }

  const overallProgress = getOverallProgress();

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-[#1E2139] p-6 pb-10">
      <div className="max-w-5xl mx-auto flex flex-col gap-5">

        {/* Top Bar */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-content-text hover:text-header-text transition-colors duration-200"
          >
            <FaArrowLeft className="w-3.5 h-3.5" />
            <span className="text-sm font-medium">Back</span>
          </button>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">

          {/* LEFT COLUMN */}
          <div className="lg:col-span-3 flex flex-col gap-5">

            {/* Course Header Card */}
            <div className="bg-white dark:bg-[#292D4A] rounded-md p-5 flex flex-col gap-4">

              {/* Title row with action icons */}
              <div className="flex items-start justify-between gap-3">
                <CourseMeta
                  title={course.title}
                  rating={course.rating || 0}
                  reviewCount={reviews.length}
                  students={course.totalStudents || 0}
                />
                <div className="flex items-center gap-2 shrink-0 mt-1">
                  <button className="w-8 h-8 rounded-md border border-gray-200 dark:border-white/10 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-white/5">
                    <FaList className="w-3.5 h-3.5 text-content-text" />
                  </button>
                  <button className="w-8 h-8 rounded-md border border-gray-200 dark:border-white/10 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-white/5">
                    <FaBookmark className="w-3.5 h-3.5 text-content-text" />
                  </button>
                  <button className="w-8 h-8 rounded-md border border-gray-200 dark:border-white/10 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-white/5">
                    <FaShareAlt className="w-3.5 h-3.5 text-content-text" />
                  </button>
                </div>
              </div>

              {/* Video */}
              <VideoThumbnail
                src={course.thumbnail || "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&q=80"}
                previewVideo={course.previewVideo}
              />

              {/* Tabs */}
              <TabBar
                tabs={['about', 'reviews']}
                active={activeTab}
                onChange={setActiveTab}
              />

              {/* Tab Content */}
              <div className="flex flex-col gap-4">
                {activeTab === 'about' && (
                  <div className="flex flex-col gap-4">
                    <div>
                      <h3 className="text-base font-bold text-header-text mb-2">About This Course</h3>
                      <p className="text-sm text-content-text leading-relaxed">
                        {course.description || 'No description available.'}
                      </p>
                    </div>
                    {course.whatYouLearn && course.whatYouLearn.length > 0 && (
                      <div>
                        <h3 className="text-base font-bold text-header-text mb-2">What You'll Learn</h3>
                        <ul className="list-disc list-inside text-sm text-content-text space-y-1">
                          {course.whatYouLearn.map((item, idx) => (
                            <li key={idx}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {course.requirements && course.requirements.length > 0 && (
                      <div>
                        <h3 className="text-base font-bold text-header-text mb-2">Requirements</h3>
                        <ul className="list-disc list-inside text-sm text-content-text space-y-1">
                          {course.requirements.map((req, idx) => (
                            <li key={idx}>{req}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'reviews' && (
                  <div className="flex flex-col gap-4">
                    {reviews.length > 0 ? (
                      reviews.map((review) => (
                        <ReviewCard
                          key={review._id}
                          name={`${review.user?.firstName || ''} ${review.user?.lastName || ''}`}
                          rating={review.rating}
                          time={new Date(review.createdAt).toLocaleDateString()}
                          avatar={review.user?.profileImage}
                          text={review.comment}
                        />
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-sm text-content-text">
                          No reviews yet.
                          {isEnrolled && ' Be the first to review this course!'}
                        </p>
                        {isEnrolled && (
                          <button
                            onClick={() => navigate(`/dashboard/course-details-1/${course._id}?tab=reviews`)}
                            className="mt-3 px-4 py-2 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary/90"
                          >
                            Write a Review
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <p className="text-center text-xs text-content-text">
              Copyright © 2024 Designed by DesignZone
            </p>
          </div>

          {/* RIGHT COLUMN - Curriculum */}
          <div className="lg:col-span-2 flex flex-col gap-4">

            {/* Enrollment Status */}
            {!isEnrolled && (
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-md p-4">
                <p className="text-sm text-yellow-800 dark:text-yellow-300">
                  Enroll in this course to access all lessons and track your progress.
                </p>
                <button
                  onClick={() => navigate(`/dashboard/checkout/${course._id}`)}
                  className="mt-3 w-full py-2 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors"
                >
                  Enroll Now - ${course.price}
                </button>
              </div>
            )}

            {/* Progress Card - Only show for enrolled users */}
            {isEnrolled && (
              <div className="bg-white dark:bg-[#292D4A] rounded-md p-5 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-header-text">Your Progress</span>
                  <button className="text-content-text hover:text-header-text">
                    <BsThreeDots className="w-4 h-4" />
                  </button>
                </div>
                <ProgressBar 
                  label="Course Completion" 
                  current={completedLessons.length} 
                  total={chapters.reduce((sum, ch) => sum + (ch.lessons?.length || 0), 0)} 
                />
                <div className="flex justify-between text-xs text-content-text">
                  <span>{completedLessons.length} lessons completed</span>
                  <span className="font-semibold text-primary">{overallProgress}% Complete</span>
                </div>
                {overallProgress === 100 && (
                  <div className="mt-2 p-2 bg-green-50 dark:bg-green-900/20 rounded-lg text-center">
                    <p className="text-xs text-green-700 dark:text-green-400 font-semibold">
                      🎉 Congratulations! You've completed this course! 🎉
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Curriculum Accordions */}
            <div className="flex flex-col gap-3">
              <h3 className="text-md font-bold text-header-text px-2">Course Curriculum</h3>
              
              {chapters.length === 0 ? (
                <div className="bg-white dark:bg-[#292D4A] rounded-md p-8 text-center">
                  <p className="text-content-text">No chapters available yet.</p>
                </div>
              ) : (
                chapters.map((chapter) => {
                  const chapterProgress = getChapterProgress(chapter);
                  const totalLessonsInChapter = chapter.lessons?.length || 0;
                  
                  return (
                    <AccordionSection 
                      key={chapter._id}
                      label={chapter.title}
                      progress={chapterProgress}
                      total={totalLessonsInChapter}
                      defaultOpen={true}
                    >
                      {chapter.lessons?.map((lesson, idx) => (
                        <LessonRow
                          key={lesson._id}
                          lesson={lesson}
                          isCompleted={isLessonCompleted(lesson._id)}
                          isUnlocked={isLessonUnlocked(chapter.lessons, idx)}
                          onClick={() => handleLessonClick(lesson)}
                        />
                      ))}
                    </AccordionSection>
                  );
                })
              )}
            </div>

            {/* Course Stats */}
            {isEnrolled && (
              <div className="bg-white dark:bg-[#292D4A] rounded-md p-4">
                <h4 className="text-xs font-semibold text-content-text uppercase mb-3">Course Statistics</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-content-text">Total Lessons</span>
                    <span className="font-semibold text-header-text">
                      {chapters.reduce((sum, ch) => sum + (ch.lessons?.length || 0), 0)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-content-text">Completed Lessons</span>
                    <span className="font-semibold text-green-600">{completedLessons.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-content-text">Total Chapters</span>
                    <span className="font-semibold text-header-text">{chapters.length}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}