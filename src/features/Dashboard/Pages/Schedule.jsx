import React from 'react'
import OngoingClass from '../components/OngoingClass';
import TodaySchedule from '../components/TodaySchedule';
import CustomCalendar from '../components/CustomCalender';
import UpcomingSchedule from '../components/UpcomingSchedule';
const Schedule = () => {
  return (
    <div className="p-2 bg-bg-main min-h-screen text-header-text flex gap-4 font-poppins">
      {/* Left Column */}
      <div className="w-[50%] flex-col gap-3 ">
        <OngoingClass />
        <div className='pt-6'>
                <h3 className="text-xl font-bold pb-5">Today Schedule</h3>
  <TodaySchedule /> 

        </div>
     
      </div>

      {/* Right Column */}
      <div className="flex flex-col w-[50%] justify-center gap-8">
        <CustomCalendar />
        <UpcomingSchedule />
      </div>
    </div>
  );
}

export default Schedule