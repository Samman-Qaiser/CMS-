// src/pages/LessonPlayer.jsx
import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import Swal from 'sweetalert2';
import { 
  FaArrowLeft, 
  FaPlay, 
  FaPause, 
  FaVolumeUp, 
  FaVolumeMute,
  FaExpand,
  FaCheckCircle,
  FaSpinner,
  FaLock,
  FaStepForward,
  FaStepBackward,
  FaFileAlt,
  FaHeadphones,
  FaQuestionCircle,
  FaMarkdown
} from 'react-icons/fa';

const baseUrl = import.meta.env?.VITE_BACKEND_URL || "https://cms-backend-ashen.vercel.app";

export default function LessonPlayer() {
  const navigate = useNavigate();
  const { lessonId } = useParams();
  const location = useLocation();
  const user = useSelector((state) => state.auth.user);
  
  const [lesson, setLesson] = useState(null);
  const [course, setCourse] = useState(null);
  const [enrollment, setEnrollment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [updatingProgress, setUpdatingProgress] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [nextLesson, setNextLesson] = useState(null);
  const [prevLesson, setPrevLesson] = useState(null);
  const [chapterLessons, setChapterLessons] = useState([]);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(null);
  
  const videoRef = useRef(null);
  const audioRef = useRef(null);
  const playerRef = useRef(null);

  // Fetch lesson details
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Check if lesson data is passed from navigation state
        if (location.state?.lesson) {
          const lessonData = location.state.lesson;
          setLesson(lessonData);
          
          // Fetch course details
          const courseId = location.state.courseId || lessonData.course;
          if (courseId) {
            const courseRes = await axios.get(`${baseUrl}/api/courses/${courseId}`);
            if (courseRes.data.success) {
              setCourse(courseRes.data.course);
            }
          }
          
          // Fetch enrollment
          if (user?.id && courseId) {
            await fetchEnrollment(courseId);
          }
          
          // Fetch chapter lessons for navigation
          if (lessonData.chapter) {
            await fetchChapterLessons(lessonData.chapter, lessonData._id);
          }
        } else {
          // Fetch from API
          const lessonRes = await axios.get(`${baseUrl}/api/lessons/${lessonId}`);
          if (lessonRes.data.success) {
            setLesson(lessonRes.data.lesson);
            
            const courseId = lessonRes.data.lesson.course;
            const courseRes = await axios.get(`${baseUrl}/api/courses/${courseId}`);
            if (courseRes.data.success) {
              setCourse(courseRes.data.course);
            }
            
            if (user?.id && courseId) {
              await fetchEnrollment(courseId);
            }
            
            if (lessonRes.data.lesson.chapter) {
              await fetchChapterLessons(lessonRes.data.lesson.chapter, lessonId);
            }
          }
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err.message || 'Failed to load lesson content');
      } finally {
        setLoading(false);
      }
    };
    
    if (lessonId) {
      fetchData();
    }
  }, [lessonId, user?.id]);

  // Fetch enrollment
  const fetchEnrollment = async (courseId) => {
    try {
      const response = await axios.get(`${baseUrl}/api/enrollments`, {
        params: { user: user.id, course: courseId }
      });
      
      if (response.data.success && response.data.enrollments?.length > 0) {
        const userEnrollment = response.data.enrollments[0];
        setEnrollment(userEnrollment);
        const completed = userEnrollment.completedLessons?.includes(lessonId);
        setIsCompleted(completed);
      }
    } catch (error) {
      console.error('Error fetching enrollment:', error);
    }
  };

  // Fetch chapter lessons
  const fetchChapterLessons = async (chapterId, currentLessonId) => {
    try {
      const response = await axios.get(`${baseUrl}/api/lessons/chapter/${chapterId}`);
      if (response.data.success) {
        const lessons = response.data.lessons;
        setChapterLessons(lessons);
        
        const currentIndex = lessons.findIndex(l => l._id === currentLessonId);
        
        if (currentIndex > 0) {
          setPrevLesson(lessons[currentIndex - 1]);
        }
        if (currentIndex < lessons.length - 1) {
          setNextLesson(lessons[currentIndex + 1]);
        }
      }
    } catch (error) {
      console.error('Error fetching chapter lessons:', error);
    }
  };

  // Update progress
  const updateProgress = async () => {
    if (!enrollment || isCompleted || updatingProgress) return;
    
    try {
      setUpdatingProgress(true);
      
      const response = await axios.put(
        `${baseUrl}/api/enrollments/${enrollment._id}/progress`,
        { lessonId: lesson._id }
      );
      
      if (response.data.success) {
        setIsCompleted(true);
        setEnrollment(response.data.enrollment);
        
        Swal.fire({
          title: 'Progress Updated!',
          text: 'Lesson completed! Keep going!',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false,
          position: 'top-end',
          toast: true
        });
        
        if (response.data.enrollment.progress === 100) {
          Swal.fire({
            title: '🎉 Congratulations! 🎉',
            text: 'You have completed the entire course!',
            icon: 'success',
            confirmButtonColor: '#FF6F61'
          });
        }
      }
    } catch (error) {
      console.error('Error updating progress:', error);
    } finally {
      setUpdatingProgress(false);
    }
  };

  // Handle quiz submission
  const handleQuizSubmit = () => {
    if (!lesson.questions || quizSubmitted) return;
    
    let correct = 0;
    lesson.questions.forEach((question, idx) => {
      if (quizAnswers[idx] === question.correctAnswer) {
        correct++;
      }
    });
    
    const score = (correct / lesson.questions.length) * 100;
    setQuizScore(score);
    setQuizSubmitted(true);
    
    if (score >= 70) {
      updateProgress();
      Swal.fire({
        title: 'Quiz Completed!',
        text: `You scored ${score}%. Great job!`,
        icon: 'success',
        confirmButtonColor: '#FF6F61'
      });
    } else {
      Swal.fire({
        title: 'Quiz Completed',
        text: `You scored ${score}%. Try again to pass (70% required).`,
        icon: 'warning',
        confirmButtonColor: '#FF6F61'
      });
    }
  };

  // Handle time update for video/audio
  const handleTimeUpdate = () => {
    const mediaRef = lesson?.type === 'audio' ? audioRef.current : videoRef.current;
    if (mediaRef) {
      const current = mediaRef.currentTime;
      const mediaDuration = mediaRef.duration;
      setCurrentTime(current);
      
      if (!isCompleted && !updatingProgress && mediaDuration > 0 && (current / mediaDuration) >= 0.9) {
        updateProgress();
      }
    }
  };

  // Format time
  const formatTime = (time) => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Render video lesson
  const renderVideoLesson = () => (
    <div ref={playerRef} className="bg-black rounded-lg overflow-hidden">
      <video
        ref={videoRef}
        src={lesson.contentUrl}
        className="w-full aspect-video"
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={(e) => setDuration(e.target.duration)}
        controls
      />
    </div>
  );

  // Render audio lesson
  const renderAudioLesson = () => (
    <div className="bg-white dark:bg-[#292D4A] rounded-lg p-8">
      <div className="text-center mb-6">
        <FaHeadphones className="w-20 h-20 text-header mx-auto mb-4" />
        <h3 className="text-header text-xl font-bold">{lesson.title}</h3>
      </div>
      <audio
        ref={audioRef}
        src={lesson.contentUrl}
        className="w-full"
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={(e) => setDuration(e.target.duration)}
        controls
      />
    </div>
  );

  // Render module lesson
  const renderModuleLesson = () => (
    <div className="bg-white dark:bg-[#292D4A] rounded-lg p-6">
      <div className="prose dark:prose-invert max-w-none">
        <div dangerouslySetInnerHTML={{ __html: lesson.content || 'No content available.' }} />
      </div>
      <button
        onClick={updateProgress}
        disabled={isCompleted}
        className="mt-6 px-6 py-2 bg-primary text-header rounded-lg hover:bg-primary/90 disabled:opacity-50"
      >
        {isCompleted ? 'Completed ✓' : 'Mark as Complete'}
      </button>
    </div>
  );

  // Render quiz lesson
  const renderQuizLesson = () => (
    <div className="bg-white dark:bg-[#292D4A] rounded-lg p-6">
      <h3 className="text-xl font-bold text-header-text mb-4">Quiz: {lesson.title}</h3>
      
      {quizSubmitted ? (
        <div className="text-center py-8">
          <div className={`text-4xl font-bold mb-4 ${quizScore >= 70 ? 'text-green-500' : 'text-red-500'}`}>
            {quizScore}%
          </div>
          <p className="text-content-text mb-4">
            {quizScore >= 70 
              ? 'Congratulations! You passed the quiz!' 
              : 'You need 70% to pass. Please try again.'}
          </p>
          {quizScore < 70 && (
            <button
              onClick={() => {
                setQuizSubmitted(false);
                setQuizAnswers({});
                setQuizScore(null);
              }}
              className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
            >
              Try Again
            </button>
          )}
        </div>
      ) : (
        <>
          <div className="space-y-6">
            {lesson.questions?.map((question, qIdx) => (
              <div key={qIdx} className="border-b border-gray-200 dark:border-gray-700 pb-4">
                <p className="font-semibold text-header-text mb-3">
                  {qIdx + 1}. {question.question}
                </p>
                <div className="space-y-2">
                  {question.options?.map((option, oIdx) => (
                    <label key={oIdx} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer">
                      <input
                        type="radio"
                        name={`question_${qIdx}`}
                        value={oIdx}
                        checked={quizAnswers[qIdx] === oIdx}
                        onChange={(e) => setQuizAnswers({ ...quizAnswers, [qIdx]: parseInt(e.target.value) })}
                        className="w-4 h-4 text-primary"
                      />
                      <span className="text-content-text">{option}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
          
          <button
            onClick={handleQuizSubmit}
            disabled={Object.keys(quizAnswers).length !== lesson.questions?.length}
            className="mt-6 w-full py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Submit Quiz
          </button>
        </>
      )}
    </div>
  );

  // Render lesson based on type
  const renderLessonContent = () => {
    switch (lesson?.type) {
      case 'video':
        return renderVideoLesson();
      case 'audio':
        return renderAudioLesson();
      case 'module':
        return renderModuleLesson();
      case 'quiz':
        return renderQuizLesson();
      default:
        return renderVideoLesson();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-[#1E2139] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-500">Loading lesson...</p>
        </div>
      </div>
    );
  }

  if (error && !lesson) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-[#1E2139] flex items-center justify-center p-6">
        <div className="text-center max-w-md">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-header-text mb-2">Unable to Load Lesson</h2>
          <p className="text-content-text mb-4">{error}</p>
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!lesson) return null;

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-[#1E2139]">
      {/* Header */}
      <div className="bg-white dark:bg-[#292D4A] border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate(`/dashboard/course-details-2/${course?._id}`)}
                className="flex items-center gap-2 text-content-text hover:text-header-text transition-colors"
              >
                <FaArrowLeft className="w-4 h-4" />
                <span className="text-sm font-medium">Back to Course</span>
              </button>
              <div>
                <h1 className="text-sm font-semibold text-header-text">{lesson.title}</h1>
                <p className="text-xs text-content-text">{course?.title}</p>
              </div>
            </div>
            
            {enrollment && (
              <div className="text-right">
                <div className="text-xs text-content-text">Course Progress</div>
                <div className="text-sm font-bold text-primary">{enrollment.progress || 0}%</div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Lesson Content */}
          <div className="lg:col-span-2">
            {renderLessonContent()}
            
            {/* Lesson Info */}
            <div className="mt-6 bg-white dark:bg-[#292D4A] rounded-lg p-6">
              <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
                <h2 className="text-xl font-bold text-header-text">{lesson.title}</h2>
                {isCompleted && (
                  <div className="flex items-center gap-2 text-green-500">
                    <FaCheckCircle className="w-5 h-5" />
                    <span className="text-sm font-semibold">Completed</span>
                  </div>
                )}
              </div>
              
              {/* Navigation Buttons */}
              <div className="flex justify-between gap-3 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => {
                    if (prevLesson) {
                      navigate(`/dashboard/lesson/${prevLesson._id}`, {
                        state: { lesson: prevLesson, courseId: course?._id }
                      });
                    }
                  }}
                  disabled={!prevLesson}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                    prevLesson
                      ? 'bg-gray-100 dark:bg-gray-800 text-header-text hover:bg-gray-200 dark:hover:bg-gray-700'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  <FaStepBackward className="w-4 h-4" />
                  Previous Lesson
                </button>
                
                <button
                  onClick={() => {
                    if (nextLesson) {
                      navigate(`/dashboard/lesson/${nextLesson._id}`, {
                        state: { lesson: nextLesson, courseId: course?._id }
                      });
                    }
                  }}
                  disabled={!nextLesson}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                    nextLesson
                      ? 'bg-primary text-white hover:bg-primary/90'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  Next Lesson
                  <FaStepForward className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
          
          {/* Sidebar - Course Content */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-[#292D4A] rounded-lg p-4 sticky top-20">
              <h3 className="font-bold text-header-text mb-4">Course Content</h3>
              
              {enrollment && (
                <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-header-text">Overall Progress</span>
                    <span className="font-semibold text-header-text">{enrollment.progress || 0}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-primary rounded-full h-2 transition-all" 
                      style={{ width: `${enrollment.progress || 0}%` }}
                    />
                  </div>
                </div>
              )}
              
              <div className="space-y-2 max-h-[500px] overflow-y-auto">
                {chapterLessons.map((item, idx) => (
                  <button
                    key={item._id}
                    onClick={() => {
                      if (item._id !== lesson._id) {
                        navigate(`/dashboard/lesson/${item._id}`, {
                          state: { lesson: item, courseId: course?._id }
                        });
                      }
                    }}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${
                      item._id === lesson._id
                        ? 'bg-primary/80 border border-primary/20'
                        : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {item.type === 'video' && <FaPlay className="w-3 h-3 text-header-text" />}
                      {item.type === 'audio' && <FaHeadphones className="w-3 h-3 text-header-text" />}
                      {item.type === 'quiz' && <FaQuestionCircle className="w-3 h-3 text-header-text" />}
                      {item.type === 'module' && <FaMarkdown className="w-3 h-3 text-header-text" />}
                      {enrollment?.completedLessons?.includes(item._id) && (
                        <FaCheckCircle className="w-3 h-3 text-green-500 shrink-0" />
                      )}
                      <span className={`text-sm truncate ${item._id === lesson._id ? 'font-semibold text-header-text' : 'text-header-text'}`}>
                        {idx + 1}. {item.title}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}