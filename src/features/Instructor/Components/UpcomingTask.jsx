// UpcomingTask.jsx
const TASKS = [
  { id: 1, name: 'Kevin', task: 'Web Design', date: '17/07/2022', daysLeft: '2 Days', avatar: 'https://i.pravatar.cc/48?img=1' },
  { id: 2, name: 'Kevin', task: 'Web Design', date: '17/07/2022', daysLeft: '2 Days', avatar: 'https://i.pravatar.cc/48?img=8' },
  { id: 3, name: 'Kevin', task: 'Web Design', date: '17/07/2022', daysLeft: '2 Days', avatar: 'https://i.pravatar.cc/48?img=12' },
  { id: 4, name: 'Kevin', task: 'Web Design', date: '17/07/2022', daysLeft: '2 Days', avatar: 'https://i.pravatar.cc/48?img=15' },
]

function TaskRow({ avatar, name, task, date, daysLeft }) {
  return (
    <div className="flex items-center gap-4 py-4 border-b border-white/5 last:border-none">
      <img
        src={avatar}
        alt={name}
        className="w-12 h-12 rounded-md object-cover shrink-0"
      />
      <div className="flex flex-col gap-0.5 flex-1 min-w-0">
        <span className="text-xs text-content-text">{name}</span>
        <span className="text-sm font-bold text-header-text">{task}</span>
      </div>
      <div className="flex flex-col items-end gap-0.5 shrink-0">
        <span className="text-xs text-content-text">{date}</span>
        <span className="text-sm font-bold text-primary">{daysLeft}</span>
      </div>
    </div>
  )
}

export default function UpcomingTask() {
  return (
    <div className="bg-[#ffffff] dark:bg-[#292D4A] rounded-md p-5 flex flex-col gap-2">
      <h3 className="text-base font-bold text-header-text mb-2">Upcoming Task</h3>
      {TASKS.map((t) => (
        <TaskRow key={t.id} {...t} />
      ))}
    </div>
  )
}
