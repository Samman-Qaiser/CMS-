import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import { useSelector } from 'react-redux';

const baseUrl = import.meta.env?.VITE_BACKEND_URL || "https://cms-backend-ashen.vercel.app";

function TaskRow({ avatar, name, task, date, daysLeft, description, color }) {
  return (
    <div className="flex items-center gap-4 py-4 border-b border-white/5 last:border-none group hover:bg-black/5 dark:hover:bg-white/5 transition-colors rounded-lg px-2 -mx-2">
      <img
        src={avatar}
        alt={name}
        className="w-12 h-12 rounded-md object-cover shrink-0"
      />
      <div className="flex flex-col gap-0.5 flex-1 min-w-0">
        <span className="text-xs text-content-text">{name}</span>
        <span className="text-sm font-bold text-header-text group-hover:text-primary transition-colors">
          {task}
        </span>
        {description && (
          <span className="text-xs text-content-text/70 line-clamp-1">
            {description}
          </span>
        )}
      </div>
      <div className="flex flex-col items-end gap-0.5 shrink-0">
        <span className="text-xs text-content-text">{date}</span>
        <span className="text-sm font-bold text-primary">{daysLeft}</span>
      </div>
    </div>
  )
}

export default function UpcomingTask() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = useSelector((state) => state.auth.user);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      
      const response = await axios.get(`${baseUrl}/api/schedules`);
      
      if (response.data.success && response.data.schedules) {
        const now = new Date();
        // Filter only 'task' type events
        const taskEvents = response.data.schedules
          .filter(schedule => schedule.type === 'task')
          .filter(schedule => new Date(schedule.endTime) >= now)
          .sort((a, b) => new Date(a.startTime) - new Date(b.startTime));
        
        setTasks(taskEvents);
      }
    } catch (error) {
      console.error("Error fetching tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const getDaysLeft = (endTime) => {
    const end = new Date(endTime);
    const now = new Date();
    const diffTime = end - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    if (diffDays < 0) return 'Overdue';
    return `${diffDays} Days`;
  };

  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), "dd/MM/yyyy");
    } catch {
      return "Invalid date";
    }
  };

const getInstructorInfo = (instructor) => {
  // ✅ Populated object check
  if (instructor && typeof instructor === 'object') {
    // ✅ Nested user object
    if (instructor.user && typeof instructor.user === 'object') {
      const userData = instructor.user
      const name = `${userData.firstName || ''} ${userData.lastName || ''}`.trim()
        || userData.username
        || "Instructor"

      const avatar = userData.profileImage ||
        `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=FF6F61&color=fff&bold=true&size=150`

      return { name, avatar }
    }

    // ✅ Direct instructor fields
    if (instructor.firstName || instructor.lastName) {
      const name = `${instructor.firstName || ''} ${instructor.lastName || ''}`.trim()
      const avatar = instructor.profileImage ||
        `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=FF6F61&color=fff&bold=true&size=150`
      return { name, avatar }
    }
  }

  // ✅ Default fallback
  return {
    name: "Instructor",
    avatar: `https://ui-avatars.com/api/?name=Instructor&background=FF6F61&color=fff&bold=true&size=150`
  }
}

  if (loading) {
    return (
      <div className="bg-[#ffffff] dark:bg-[#292D4A] rounded-md p-5 flex flex-col gap-2">
        <h3 className="text-base font-bold text-header-text mb-2">Upcoming Task</h3>
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="bg-[#ffffff] dark:bg-[#292D4A] rounded-md p-5 flex flex-col gap-2">
        <h3 className="text-base font-bold text-header-text mb-2">Upcoming Task</h3>
        <div className="text-center py-8">
          <div className="text-4xl mb-2">✅</div>
          <p className="text-content-text text-sm">No pending tasks</p>
          <p className="text-xs text-content-text/60 mt-1">All caught up!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#ffffff] dark:bg-[#292D4A] rounded-md p-5 flex flex-col gap-2">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-base font-bold text-header-text">Upcoming Task</h3>
        <span className="text-xs text-primary font-semibold">
          {tasks.length} Task{tasks.length !== 1 ? 's' : ''}
        </span>
      </div>
      
      <div className="max-h-[400px] overflow-y-auto pr-2">
        {tasks.map((task) => {
          const instructor = getInstructorInfo(task.instructor);
          return (
            <TaskRow
              key={task._id}
              avatar={instructor.avatar}
              name={instructor.name}
              task={task.title}
              color={task.color}
              date={formatDate(task.startTime)}
              daysLeft={getDaysLeft(task.endTime)}
              description={task.description}
            />
          );
        })}
      </div>
    </div>
  );
}