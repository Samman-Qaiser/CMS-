import TotalStudentsChart  from '../Components/TotalStudentsChart'
import CoursesChart        from '../Components/CoursesChart'
import EarningsChart       from '../Components/EarningsChart'
import WorkingActivityChart from '../Components/WorkingActivityChart'
import MiniCalendar        from '../Components/MiniCalendar'
import UpcomingEvents      from '../Components/UpcomingEvents'

export default function InstructorDashboard() {
  return (
    <div className="min-h-screen space-y-3 bg-gray-100 dark:bg-[#1E2139] p-2">
   

        {/* ── Row 1: Stats + Calendar ───────────────────────────── */}
        <div className="flex w-full  gap-4">

          {/* Left: Total Students + Courses stacked */}
          <div className=" space-y-3 w-[57%]">
 
               <TotalStudentsChart />
            <CoursesChart />
    
         
            <EarningsChart />
         
          </div>

          {/* Center: Earnings */}
          <div className='w-[43%] space-y-3'>
             <MiniCalendar />
            <UpcomingEvents />
          </div>

        </div>

    
            <WorkingActivityChart />
     

   
    </div>
  )
}