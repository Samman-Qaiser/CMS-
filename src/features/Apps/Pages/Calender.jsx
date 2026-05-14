import React from 'react'
import Schedule from '../../Dashboard/Pages/Schedule'
import TodaySchedule from '../../Dashboard/components/TodaySchedule'
import CalendarSidebar from '../components/CalendarSidebar'
const AppCalender = () => {
  return (
     <div className="min-h-screen bg-bg-main space-y-5 p-2">   {/* Breadcrumb */}
          <div className="flex rounded-md p-3 items-center  bg-gray-100 dark:bg-[#292D4A]  gap-2 mb-6">
            <span className="font-bold text-header-text">App</span>
            <span className="text-content-text">/</span>
            <span className="text-content-text">Calender</span>
          </div>
          <div className="flex gap-5">
               <div className="w-[30%]">
                <CalendarSidebar />
               </div>
                 <div className='w-[70%]'>
                    <TodaySchedule/>
                 </div>
          </div>
    </div>
  )
}

export default AppCalender