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
  FaStepBackward
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
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [updatingProgress, setUpdatingProgress] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [nextLesson, setNextLesson] = useState(null);
  const [prevLesson, setPrevLesson] = useState(null);
  
  const videoRef = useRef(null);
  const playerRef = useRef(null);

  // Fetch lesson details and enrollment
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch lesson details
        const lessonRes = await axios.get(`${baseUrl}/api/lessons/${lessonId}`);
        if (lessonRes.data.success) {
          setLesson(lessonRes.data.lesson);
          
          // Fetch course details
          const courseRes = await axios.get(`${baseUrl}/api/courses/${lessonRes.data.lesson.course}`);
          if (courseRes.data.success) {
            setCourse(courseRes.data.course);
          }
          
          // Fetch enrollment for progress tracking
          if (user?.id) {
            const enrollmentRes = await axios.get(`${baseUrl}/api/enrollments`, {
              params: {
                user: user.id,
                course: lessonRes.data.lesson.course
              }
            });
            
            if (enrollmentRes.data.success && enrollmentRes.data.enrollments?.length > 0) {
              const userEnrollment = enrollmentRes.data.enrollments[0];
              setEnrollment(userEnrollment);
              
              // Check if this lesson is already completed
              const completed = userEnrollment.completedLessons?.includes(lessonId);
              setIsCompleted(completed);
              
              // Fetch chapter to find next/prev lessons
              await fetchAdjacentLessons(lessonRes.data.lesson.chapter, lessonId);
            }
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        Swal.fire({
          title: 'Error!',
          text: 'Failed to load lesson content',
          icon: 'error',
          confirmButtonColor: '#FF6F61'
        });
      } finally {
        setLoading(false);
      }
    };
    
    if (lessonId) {
      fetchData();
    }
  }, [lessonId, user?.id]);

  // Fetch adjacent lessons for navigation
  const fetchAdjacentLessons = async (chapterId, currentLessonId) => {
    try {
      const lessonsRes = await axios.get(`${baseUrl}/api/lessons/chapter/${chapterId}`);
      if (lessonsRes.data.success) {
        const lessons = lessonsRes.data.lessons;
        const currentIndex = lessons.findIndex(l => l._id === currentLessonId);
        
        if (currentIndex > 0) {
          setPrevLesson(lessons[currentIndex - 1]);
        }
        if (currentIndex < lessons.length - 1) {
          setNextLesson(lessons[currentIndex + 1]);
        }
      }
    } catch (error) {
      console.error('Error fetching adjacent lessons:', error);
    }
  };

  // Update progress when video is completed
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
        
        // Check if course is completed
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
      Swal.fire({
        title: 'Error!',
        text: 'Failed to update progress',
        icon: 'error',
        confirmButtonColor: '#FF6F61'
      });
    } finally {
      setUpdatingProgress(false);
    }
  };

  // Handle video time update
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const current = videoRef.current.currentTime;
      const videoDuration = videoRef.current.duration;
      setCurrentTime(current);
      
      // Mark as completed when 90% of video is watched
      if (!isCompleted && !updatingProgress && videoDuration > 0 && (current / videoDuration) >= 0.9) {
        updateProgress();
      }
    }
  };

  // Handle video metadata load
  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  // Play/Pause
  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  // Toggle Mute
  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  // Handle volume change
  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
      videoRef.current.muted = false;
      setIsMuted(false);
    }
  };

  // Handle seek
  const handleSeek = (e) => {
    const newTime = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  // Format time (seconds to MM:SS)
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Fullscreen
  const toggleFullscreen = () => {
    if (playerRef.current) {
      if (!document.fullscreenElement) {
        playerRef.current.requestFullscreen();
      } else {
        document.exitFullscreen();
      }
    }
  };

  // Navigate to next lesson
  const goToNextLesson = () => {
    if (nextLesson) {
      navigate(`/dashboard/lesson/${nextLesson._id}`);
    }
  };

  // Navigate to previous lesson
  const goToPrevLesson = () => {
    if (prevLesson) {
      navigate(`/dashboard/lesson/${prevLesson._id}`);
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

  if (!lesson || !course) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-[#1E2139] flex items-center justify-center">
        <p className="text-gray-500">Lesson not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-[#1E2139]">
      {/* Header */}
      <div className="bg-white dark:bg-[#292D4A] border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate(`/dashboard/course-details-2/${course._id}`)}
                className="flex items-center gap-2 text-content-text hover:text-header-text transition-colors"
              >
                <FaArrowLeft className="w-4 h-4" />
                <span className="text-sm font-medium">Back to Course</span>
              </button>
              <div>
                <h1 className="text-sm font-semibold text-header-text">{lesson.title}</h1>
                <p className="text-xs text-content-text">{course.title}</p>
              </div>
            </div>
            
            {/* Progress Badge */}
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
          {/* Video Player */}
          <div className="lg:col-span-2">
            <div ref={playerRef} className="bg-black rounded-lg overflow-hidden">
              <video
                ref={videoRef}
                src={lesson.videoUrl || lesson.contentUrl}
                className="w-full aspect-video"
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onClick={togglePlay}
              />
              
              {/* Custom Controls */}
              <div className="bg-gradient-to-t from-black/80 to-transparent p-4">
                <div className="flex items-center gap-3">
                  {/* Play/Pause */}
                  <button
                    onClick={togglePlay}
                    className="text-white hover:text-primary transition-colors"
                  >
                    {isPlaying ? <FaPause className="w-4 h-4" /> : <FaPlay className="w-4 h-4" />}
                  </button>
                  
                  {/* Time and Seek */}
                  <div className="flex-1 flex items-center gap-2">
                    <span className="text-white text-xs">{formatTime(currentTime)}</span>
                    <input
                      type="range"
                      min="0"
                      max={duration}
                      value={currentTime}
                      onChange={handleSeek}
                      className="flex-1 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                    />
                    <span className="text-white text-xs">{formatTime(duration)}</span>
                  </div>
                  
                  {/* Volume */}
                  <div className="flex items-center gap-2">
                    <button onClick={toggleMute} className="text-white hover:text-primary">
                      {isMuted ? <FaVolumeMute className="w-4 h-4" /> : <FaVolumeUp className="w-4 h-4" />}
                    </button>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={volume}
                      onChange={handleVolumeChange}
                      className="w-20 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                  
                  {/* Fullscreen */}
                  <button onClick={toggleFullscreen} className="text-white hover:text-primary">
                    <FaExpand className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
            
            {/* Lesson Info */}
            <div className="mt-6 bg-white dark:bg-[#292D4A] rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-header-text">{lesson.title}</h2>
                {isCompleted && (
                  <div className="flex items-center gap-2 text-green-500">
                    <FaCheckCircle className="w-5 h-5" />
                    <span className="text-sm font-semibold">Completed</span>
                  </div>
                )}
              </div>
              
              <p className="text-content-text leading-relaxed">
                {lesson.description || 'No description available for this lesson.'}
              </p>
              
              {/* Navigation Buttons */}
              <div className="flex justify-between mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={goToPrevLesson}
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
                  onClick={goToNextLesson}
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
              
              {/* Course Progress Overview */}
              {enrollment && (
                <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-content-text">Overall Progress</span>
                    <span className="font-semibold text-primary">{enrollment.progress || 0}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-primary rounded-full h-2 transition-all" 
                      style={{ width: `${enrollment.progress || 0}%` }}
                    />
                  </div>
                </div>
              )}
              
              {/* Lessons List - This would be populated from your chapters/lessons */}
              <div className="space-y-2 max-h-[500px] overflow-y-auto">
                <p className="text-sm text-content-text text-center py-4">
                  Full course content available in the main course page
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}