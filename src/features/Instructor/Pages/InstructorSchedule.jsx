import React from 'react'
import TodaySchedule from '../../Dashboard/components/TodaySchedule'
import UpcomingSchedule from '../../Dashboard/components/UpcomingSchedule'
import UpcomingEvents from '../Components/UpcomingEvents'
import UpcomingTask from '../Components/UpcomingTask'
const InstructorSchedule = () => {
  return (
    <div className='flex gap-8 justify-between '>
        <div className='w-[60%]'>
        <TodaySchedule />
        </div>
<div className='w-[40%] space-y-7'>
<UpcomingSchedule />
<UpcomingTask/>
</div>
    </div>
  )
}

export default InstructorSchedule