import React from 'react';
import { Calendar, Clock, ChevronRight } from 'lucide-react';

const UpcomingSchedule = () => {
  const schedules = [
    {
      id: 1,
      title: "UX Research",
      instructor: "Ms. Samantha William",
      date: "January 5, 2021",
      time: "07.00 - 08.00 AM",
      color: "bg-[#FF4B7D]", // Pinkish/Red
      avatar: "https://i.pravatar.cc/150?u=samantha"
    },
    {
      id: 2,
      title: "Back-End Developer",
      instructor: "Ms. Samantha William",
      date: "January 5, 2021",
      time: "07.00 - 08.00 AM",
      color: "bg-[#FFB129]", // Orange/Yellow
      avatar: "https://i.pravatar.cc/150?u=samantha"
    },
    {
      id: 3,
      title: "Icon Design",
      instructor: "Ms. Samantha William",
      date: "January 5, 2021",
      time: "07.00 - 08.00 AM",
      color: "bg-[#8E54E9]", // Purple
      avatar: "https://i.pravatar.cc/150?u=samantha"
    }
  ];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-xl font-bold text-header-text">Upcoming Schedule</h3>
        <button className="text-white  text-[[12px] cursor-pointer bg-primary px-2 py-1 rounded-md text-[14px] hover:bg-primary/90 transition-all">
          View all
        </button>
      </div>

      <div className="flex flex-col gap-4">
        {schedules.map((item) => (
          <div 
            key={item.id} 
            className="dark:bg-[#292D4A] bg-[#ffffff] rounded-2xl overflow-hidden flex items-stretch group cursor-pointer transition-transform hover:scale-[1.01]"
          >
            {/* Left Color Strip */}
            <div className={`w-2 ${item.color}`}></div>

            {/* Content Area */}
            <div className="flex-1 p-5 flex items-center justify-between">
              <div className="flex flex-col gap-3">
                <h4 className="font-bold text-header-text text-lg hover:text-primary">{item.title}</h4>
                
                <div className="flex items-center gap-4 text-content-text text-xs">
                  <div className="flex items-center gap-2">
                    <img src={item.avatar} alt="instructor" className="w-6 h-6 rounded-full border border-white/10" />
                    <span>{item.instructor}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar size={14} />
                    <span>{item.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock size={14} />
                    <span>{item.time}</span>
                  </div>
                </div>
              </div>

              <button className="text-white/20 group-hover:text-primary transition-colors">
                <ChevronRight size={24} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UpcomingSchedule;