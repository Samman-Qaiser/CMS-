import React, { useState, useEffect } from 'react';
import { Calendar, Clock, ChevronRight } from 'lucide-react';
import axios from 'axios';
import { format } from 'date-fns';
import { useSelector } from 'react-redux';

const baseUrl = import.meta.env?.VITE_BACKEND_URL || "https://cms-backend-ashen.vercel.app";

const UpcomingSchedule = () => {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [instructorsMap, setInstructorsMap] = useState({}); // Store instructor data by ID

  // Fetch instructor by ID
  const fetchInstructorById = async (instructorId) => {
    if (!instructorId) return null;
    
    // Check if already fetched
    if (instructorsMap[instructorId]) return instructorsMap[instructorId];
    
    try {
      const response = await axios.get(`${baseUrl}/api/instructors/${instructorId}`);
      if (response.data.success) {
        setInstructorsMap(prev => ({
          ...prev,
          [instructorId]: response.data.instructor
        }));
        return response.data.instructor;
      }
    } catch (error) {
      console.error(`Error fetching instructor ${instructorId}:`, error);
    }
    return null;
  };

  // Fetch schedules
  const fetchSchedules = async () => {
    try {
      setLoading(true);
      
      const response = await axios.get(`${baseUrl}/api/schedules`);
      
      if (response.data.success && response.data.schedules) {
        const now = new Date();
        // Filter out 'task' type events
        const nonTaskSchedules = response.data.schedules
          .filter(schedule => schedule.type !== 'task')
          .filter(schedule => new Date(schedule.endTime) >= now)
          .sort((a, b) => new Date(a.startTime) - new Date(b.startTime));
        
        // For each schedule, fetch its instructor data
        for (const schedule of nonTaskSchedules) {
          if (schedule.instructor) {
            await fetchInstructorById(schedule.instructor);
          }
        }
        
        setSchedules(nonTaskSchedules);
      }
    } catch (error) {
      console.error("Error fetching schedules:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchedules();
  }, []);

  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), "MMMM d, yyyy");
    } catch {
      return "Invalid date";
    }
  };

  const formatTime = (startTime, endTime) => {
    try {
      const start = format(new Date(startTime), "hh:mm a");
      const end = format(new Date(endTime), "hh:mm a");
      return `${start} - ${end}`;
    } catch {
      return "Invalid time";
    }
  };

  const getEventColor = (type) => {
    switch(type) {
      case 'event':
        return 'bg-[#FF4B7D]';
      case 'meeting':
        return 'bg-[#FF4B7D]';
      case 'reminder':
        return 'bg-[#FFB129]';
      case 'deadline':
        return 'bg-[#8E54E9]';
      default:
        return 'bg-[#10b981]';
    }
  };

  const getEventTypeBadge = (type) => {
    switch(type) {
      case 'event':
        return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400';
      case 'meeting':
        return 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400';
      case 'reminder':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'deadline':
        return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
      default:
        return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
    }
  };

  // Get instructor info from the map using instructor ID
  const getInstructorInfo = (instructorId) => {
    const instructor = instructorsMap[instructorId];
    
    if (!instructor || !instructorId) {
      return {
        name: "Unknown Instructor",
        avatar: `https://ui-avatars.com/api/?name=Unknown&background=FF6F61&color=fff&bold=true&size=150`
      };
    }
    
    const name = instructor.user?.firstName && instructor.user?.lastName
      ? `${instructor.user.firstName} ${instructor.user.lastName}`
      : instructor.user?.username || "Instructor";
    
    const avatar = instructor.user?.profileImage || 
                   instructor.profileImage || 
                   `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=FF6F61&color=fff&bold=true&size=150`;
    
    return { name, avatar };
  };

  if (loading) {
    return (
      <div className="flex w-[100%] flex-col gap-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-bold text-header-text">Upcoming Schedule</h3>
          <button className="text-white cursor-pointer bg-primary px-2 py-1 rounded-md text-[14px] hover:bg-primary/90 transition-all">
            View all
          </button>
        </div>
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (schedules.length === 0) {
    return (
      <div className="flex w-[100%] flex-col gap-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-bold text-header-text">Upcoming Schedule</h3>
          <button className="text-white cursor-pointer bg-primary px-2 py-1 rounded-md text-[14px] hover:bg-primary/90 transition-all">
            View all
          </button>
        </div>
        <div className="dark:bg-[#292D4A] bg-[#ffffff] rounded-2xl p-8 text-center">
          <Calendar size={48} className="mx-auto text-content/30 mb-3" />
          <p className="text-content-text">No upcoming events</p>
          <p className="text-xs text-content-text/60 mt-1">Check back later for events and meetings</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex w-[100%] flex-col gap-4">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-bold text-header-text">Upcoming Schedule</h3>
        <button className="text-white cursor-pointer bg-primary px-2 py-1 rounded-md text-[14px] hover:bg-primary/90 transition-all">
          View all
        </button>
      </div>

      <div className="flex flex-col gap-4">
        {schedules.map((item) => {
          const instructor = getInstructorInfo(item.instructor);
          return (
            <div 
              key={item._id} 
              className="dark:bg-[#292D4A] bg-[#ffffff] rounded-2xl overflow-hidden flex items-stretch group cursor-pointer transition-transform hover:scale-[1.01] shadow-sm"
            >
              <div className={`w-2 ${getEventColor(item.type)}`}></div>

              <div className="flex-1 p-5 flex items-center justify-between">
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="font-bold text-header-text text-lg hover:text-primary transition-colors">
                      {item.title}
                    </h4>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full capitalize ${getEventTypeBadge(item.type)}`}>
                      {item.type}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-4 text-content-text text-xs flex-wrap">
                    <div className="flex items-center gap-2">
                      <img 
                        src={instructor.avatar} 
                        alt={instructor.name} 
                        className="w-6 h-6 rounded-full border border-white/10 object-cover" 
                      />
                      <span>{instructor.name}</span>
                    </div>
                 
                    <div className="flex items-center gap-2">
                      <Clock size={14} />
                      <span>{formatTime(item.startTime, item.endTime)}</span>
                    </div>
                  </div>
                  
                  <div className="flex text-content-text text-xs items-center gap-2">
                    <Calendar size={14} />
                    <span>{formatDate(item.startTime)}</span>
                  </div>

                  {item.description && (
                    <p className="text-xs text-content-text/70 line-clamp-1">
                      {item.description}
                    </p>
                  )}
                </div>

                <button className="text-content/30 group-hover:text-primary transition-colors">
                  <ChevronRight size={24} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default UpcomingSchedule;