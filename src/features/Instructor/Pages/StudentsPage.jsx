// StudentsPage.jsx
import NewUsersCard          from '../Components/NewUsersCard'
import TotalStudentsCard     from '../Components//TotalStudentsCard'
import StudentsTable         from '../Components//StudentsTable'
import StudentsActivityChart from '../Components//StudentsActivityChart'

export default function StudentsPage() {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-[#1E2139] p-2">
      <div className="mx-auto flex flex-col gap-5">

        {/* ── Row 1: Total Students | New Users | Activity Chart ── */}
        <div className="flex gap-5 items-stretch">
          {/* Total Students — fixed width */}
       <div className='w-[50%] flex gap-3'>
        <TotalStudentsCard />
         
            <NewUsersCard />
       </div>
            
          

          {/* Students Activity — takes remaining space */}
            <div className='w-[50%]'>     <StudentsActivityChart /></div>
     
        </div>

        {/* ── Row 2: Students Table ── */}
        <StudentsTable />

      </div>
    </div>
  )
}
