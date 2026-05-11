import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

const legend = [
  { label: "Design",     dot: "bg-green-400" },
  { label: "Soft Skill", dot: "bg-red-400" },
  { label: "Developer",  dot: "bg-yellow-400" },
  { label: "Science",    dot: "bg-orange-400" },
];

function buildWeeks(year, month) {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrev = new Date(year, month, 0).getDate();
  const cells = [];

  for (let i = firstDay - 1; i >= 0; i--)
    cells.push({ day: daysInPrev - i, current: false });
  for (let d = 1; d <= daysInMonth; d++)
    cells.push({ day: d, current: true });
  while (cells.length % 7 !== 0)
    cells.push({ day: cells.length - daysInMonth - firstDay + 1, current: false });

  const weeks = [];
  for (let i = 0; i < cells.length; i += 7)
    weeks.push(cells.slice(i, i + 7));
  return weeks;
}
function ProgressArc({ percent = 70 }) {
  const r = 100, cx = 130, cy = 120;
  const arc = Math.PI * r;
  const offset = arc - (percent / 100) * arc;
  const d = `M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`;
  return (
    <div className="relative flex justify-center">
      <svg width="260" height="130" viewBox="0 0 260 130">
        <defs>
          <linearGradient id="pg" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#facc15" />
            <stop offset="100%" stopColor="#a78bfa" />
          </linearGradient>
        </defs>
        <path d={d} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="14" strokeLinecap="round" />
        <path d={d} fill="none" stroke="url(#pg)" strokeWidth="14" strokeLinecap="round"
          strokeDasharray={arc} strokeDashoffset={offset} />
      </svg>
      <span className="absolute bottom-2 left-1/2 -translate-x-1/2 text-5xl font-black text-header-text tracking-tight whitespace-nowrap">
        {percent}%
      </span>
    </div>
  );
}

export default function CustomCalendar() {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());
  const [sel, setSel] = useState({ d: now.getDate(), m: now.getMonth(), y: now.getFullYear() });

  const weeks = buildWeeks(year, month);

  const prev = () => { if (month === 0) { setMonth(11); setYear(y => y - 1); } else setMonth(m => m - 1); };
  const next = () => { if (month === 11) { setMonth(0); setYear(y => y + 1); } else setMonth(m => m + 1); };

  const isToday = (day, cur) => cur && day === now.getDate() && month === now.getMonth() && year === now.getFullYear();
  const isSel   = (day, cur) => cur && day === sel.d && month === sel.m && year === sel.y;

  return (
    <>   <h3 className="text-xl text-header-text font-bold leading-2 ">Calender</h3>
       <div className="w-full bg-[#ffffff] dark:bg-[#292D4A] rounded-lg p-6 flex flex-col">

      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <button onClick={prev} className="text-content-text hover:text-primary bg-transparent border-0 p-1 rounded-md hover:bg-white/5 cursor-pointer transition-colors">
          <ChevronLeft size={16} strokeWidth={2.5} />
        </button>
        <span className="text-[18px] text-header-text tracking-wide">
          {MONTHS[month]} {year}
        </span>
        <button onClick={next} className="text-content-text hover:text-primary bg-transparent border-0 p-1 rounded-md hover:bg-white/5 cursor-pointer transition-colors">
          <ChevronRight size={16} strokeWidth={2.5} />
        </button>
      </div>

      {/* Day names */}
      <div className="grid grid-cols-7 mb-2">
        {DAYS.map(d => (
          <div key={d} className="text-center text-[16px] text-content-text tracking-wider">
            {d}
          </div>
        ))}
      </div>

      {/* Weeks */}
      <div className="flex flex-col gap-1">
        {weeks.map((week, wi) => (
          <div key={wi} className="grid grid-cols-7">
            {week.map((cell, di) => {
              const active = isToday(cell.day, cell.current) || isSel(cell.day, cell.current);
              return (
                <div key={di} className="flex justify-center">
                  <button
                    onClick={() => cell.current && setSel({ d: cell.day, m: month, y: year })}
                    className={[
                      "w-8 h-8 flex items-center justify-center rounded-md  border-0 transition-all",
                      !cell.current
                        ? "text-header-text bg-transparent cursor-default"
                        : active
                        ? "bg-[#5c5be5] text-white cursor-pointer"
                        : "text-header-text bg-transparent cursor-pointer hover:bg-white/10",
                    ].join(" ")}
                  >
                    {cell.day}
                  </button>
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Divider */}
      <div className="h-px bg-white/[0.07] my-4" />

      {/* Progress */}
      <p className="text-[12px]  text-content-text text-center tracking-wide mb-2">
        Your Progress this Month
      </p>
      <div className="flex justify-center">
        <ProgressArc percent={70} />
      </div>

      {/* Description */}
      <p className="text-[12px] text-content-text text-center leading-relaxed px-4 mt-2 mb-4">
        Lorem ipsum dolor sit amet, adipiscing elit, sed do eiusmod tempor
      </p>

      {/* Legend */}
      <div className="grid grid-cols-2 gap-x-2 gap-y-1.5 px-1">
        {legend.map(({ label, dot }) => (
          <div key={label} className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full shrink-0 ${dot}`} />
            <span className="  text-content-text">{label}</span>
          </div>
        ))}
      </div>
    </div></>
 
  );
}