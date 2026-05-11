import React from 'react'
import { CourseCard, StatCard } from '../components/StatCard';
import { MoreHorizontal } from 'lucide-react';
import ScoreActivity from '../components/ScoreActivity';
const Profile = () => {
  return (

    <div className="p-2 bg-bg-main min-h-screen font-poppins flex flex-col lg:flex-row gap-8">
      
      {/* LEFT SIDEBAR CARD */}
      <div className="w-full lg:w-[350px] bg-white dark:bg-[#292D4A] rounded-md p-4 shadow-sm h-fit">
        <div className="flex justify-end"><MoreHorizontal className="text-sidebar-text" /></div>
        <div className="flex flex-col items-center mb-8">
          <img src="https://i.pravatar.cc/150?u=nella" alt="profile" className="w-28 h-28 rounded-lg object-cover mb-4" />
          <h2 className="text-xl font-bold text-header-text">Nella Vita</h2>
          <p className="text-sm text-sidebar-text">Member Since 2020</p>
        </div>

        <div className="flex gap-4 mb-10">
          <div className="bg-bg-main dark:bg-black/20 p-4 rounded-lg flex-1 ">
            <p className="text-[14px] text-sidebar-textfont-bold">Points</p>
            <p className="text-lg font-bold text-header-text">2300</p>
          </div>
         <div className="bg-bg-main dark:bg-black/20 p-4 rounded-lg flex-1 ">
            <p className="text-[14px] text-sidebar-textfont-bold">Certificate</p>
            <p className="text-lg font-bold text-header-text">50</p>
          </div>
        </div>

        <h3 className="font-bold text-header-text mb-4">Achievements</h3>
        <div className="flex justify-between mb-10">
          {['🏆', '🧩', '🪐', '🧠', '👑'].map((emoji, i) => (
            <div key={i} className="w-14 h-14 bg-bg-main dark:bg-black/20 rounded-lg flex items-center justify-center text-2xl">{emoji}</div>
          ))}
        </div>
        <h3 className="font-bold text-header-text mb-4">Bio</h3>
<div className='bg-bg-main p-4 rounded-lg'>
       
        <p className="text-xs text-sidebar-text leading-loose opacity-80">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
         
Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua
        </p>
</div>
     
      </div>

      {/* RIGHT CONTENT AREA */}
      <div className="flex-1">
        {/* Top Mini Stats */}
        <div className="flex flex-col md:flex-row gap-6 mb-8">
        
          <StatCard icon="🎓" title="Completed" count="100" colorClass="text-orange-500" />
          <StatCard icon="⏰" title="Progress" count="100" colorClass="text-purple-500" />
        </div>

        {/* Current Courses Section */}
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-header-text">Current Courses</h3>
          <button className="px-6 py-2 bg-blue-600 text-white text-xs font-bold rounded-lg shadow-lg shadow-blue-600/30">View all</button>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          <CourseCard title="UI Design Beginner" progress={80} total={110} current={90} color="#4cbc9a" />
          <CourseCard title="UX Research" progress={62} total={80} current={50} color="#ffb800" />
        </div>

        {/* Score Activity Chart */}
        <ScoreActivity />
      </div>
    </div>
  );
};

export default Profile;

