// StudentsTable.jsx
import { useState, useMemo } from 'react'
import { BsSearch, BsThreeDots, BsChevronLeft, BsChevronRight } from 'react-icons/bs'
import { FaSort } from 'react-icons/fa'

const ALL_STUDENTS = [
  { id: 1, name: 'Karen Hope', studentId: '1234567890', course: 'UI Design Courses',      joinDate: 'January 2, 2020',  status: 'On Progress', avatar: 'https://i.pravatar.cc/36?img=1' },
  { id: 2, name: 'Karen Hope', studentId: '1234567891', course: 'UI Design Courses',      joinDate: 'January 2, 2020',  status: 'No Progress', avatar: 'https://i.pravatar.cc/36?img=2' },
  { id: 3, name: 'Karen Hope', studentId: '1234567892', course: 'UI Design Courses',      joinDate: 'January 2, 2020',  status: 'Completed',   avatar: 'https://i.pravatar.cc/36?img=3' },
  { id: 4, name: 'John Smith', studentId: '1234567893', course: 'Web Development',        joinDate: 'February 5, 2020', status: 'On Progress', avatar: 'https://i.pravatar.cc/36?img=4' },
  { id: 5, name: 'Sara Lee',   studentId: '1234567894', course: 'Graphic Design',         joinDate: 'March 10, 2020',   status: 'Completed',   avatar: 'https://i.pravatar.cc/36?img=5' },
  { id: 6, name: 'Ali Khan',   studentId: '1234567895', course: 'Data Science',           joinDate: 'April 1, 2020',    status: 'No Progress', avatar: 'https://i.pravatar.cc/36?img=6' },
  { id: 7, name: 'Emma Brown', studentId: '1234567896', course: 'Mobile Development',     joinDate: 'May 15, 2020',     status: 'On Progress', avatar: 'https://i.pravatar.cc/36?img=7' },
  { id: 8, name: 'Raza Malik', studentId: '1234567897', course: 'UI Design Courses',      joinDate: 'June 20, 2020',    status: 'Completed',   avatar: 'https://i.pravatar.cc/36?img=8' },
]

const STATUS_STYLES = {
  'On Progress': 'bg-yellow-400/15 text-yellow-500 border border-yellow-400/30',
  'No Progress': 'bg-red-400/15 text-red-400 border border-red-400/30',
  'Completed':   'bg-teal-500/15 text-teal-500 border border-teal-500/30',
}

const PAGE_SIZE = 3

export default function StudentsTable() {
  const [search, setSearch]   = useState('')
  const [page, setPage]       = useState(1)

  const filtered = useMemo(() =>
    ALL_STUDENTS.filter((s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.studentId.includes(search) ||
      s.course.toLowerCase().includes(search.toLowerCase())
    ), [search]
  )

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const safePage   = Math.min(page, totalPages)
  const paginated  = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE)

  const handleSearch = (val) => {
    setSearch(val)
    setPage(1)
  }

  return (
    <div className="bg-[#ffffff] dark:bg-[#292D4A] rounded-md p-5 flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <span className="text-sm font-bold text-header-text">Students List</span>
        {/* Search */}
        <div className="flex items-center gap-2 border border-primary/40 rounded-md px-3 py-2 focus-within:ring-2 focus-within:ring-primary/30 transition-all duration-200 bg-transparent">
          <BsSearch className="w-3.5 h-3.5 text-primary" />
          <input
            type="text"
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search students..."
            className="bg-transparent outline-none text-sm text-header-text placeholder:text-content-text w-40"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 dark:border-white/10">
              {['Name', 'Student ID', 'Courses', 'Join Date', 'Status', ''].map((h, i) => (
                <th key={i} className="text-left py-3 px-2 text-xs font-semibold text-content-text whitespace-nowrap">
                  <div className="flex items-center gap-1">
                    {h}
                    {h && h !== '' && <FaSort className="w-2.5 h-2.5 opacity-50" />}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginated.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-8 text-content-text text-sm">
                  No students found
                </td>
              </tr>
            ) : (
              paginated.map((s) => (
                <tr
                  key={s.id}
                  className="border-b border-gray-50 dark:border-white/5 last:border-none hover:bg-gray-50 dark:hover:bg-white/3 transition-colors duration-150"
                >
                  {/* Name */}
                  <td className="py-3 px-2">
                    <div className="flex items-center gap-3">
                      <img src={s.avatar} alt={s.name} className="w-9 h-9 rounded-md object-cover shrink-0" />
                      <span className="font-semibold text-header-text whitespace-nowrap">{s.name}</span>
                    </div>
                  </td>
                  {/* Student ID */}
                  <td className="py-3 px-2 text-content-text whitespace-nowrap">{s.studentId}</td>
                  {/* Course */}
                  <td className="py-3 px-2 text-content-text whitespace-nowrap">{s.course}</td>
                  {/* Join Date */}
                  <td className="py-3 px-2 text-content-text whitespace-nowrap">{s.joinDate}</td>
                  {/* Status */}
                  <td className="py-3 px-2">
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full ${STATUS_STYLES[s.status]}`}>
                      {s.status}
                    </span>
                  </td>
                  {/* Actions */}
                  <td className="py-3 px-2">
                    <button className="text-content-text hover:text-header-text transition-colors duration-200">
                      <BsThreeDots className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Footer: entries info + pagination */}
      <div className="flex items-center justify-between flex-wrap gap-3 pt-1">
        <span className="text-xs text-content-text">
          Showing {filtered.length === 0 ? 0 : (safePage - 1) * PAGE_SIZE + 1} to{' '}
          {Math.min(safePage * PAGE_SIZE, filtered.length)} of {filtered.length} entries
        </span>

        {/* Pagination */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={safePage === 1}
            className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center hover:bg-primary hover:text-white transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed text-primary"
          >
            <BsChevronLeft className="w-3 h-3" />
          </button>

          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={`
                w-8 h-8 rounded-md text-xs font-bold transition-all duration-200
                ${safePage === i + 1
                  ? 'bg-primary text-white shadow-md'
                  : 'bg-primary/10 text-primary hover:bg-primary hover:text-white'
                }
              `}
            >
              {i + 1}
            </button>
          ))}

          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={safePage === totalPages}
            className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center hover:bg-primary hover:text-white transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed text-primary"
          >
            <BsChevronRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  )
}
