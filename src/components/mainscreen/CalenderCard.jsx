import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";

const CalendarCard = () => {
  const today = new Date();
  const [viewDate, setViewDate] = useState(new Date()); 
  const [selectedDate, setSelectedDate] = useState(new Date()); 

  const days = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

  const calendarData = useMemo(() => {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();

    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();

    const dates = [];

    for (let i = firstDayOfMonth - 1; i >= 0; i--) {
      dates.push({
        day: daysInPrevMonth - i,
        month: "prev",
        fullDate: new Date(year, month - 1, daysInPrevMonth - i),
      });
    }
    for (let i = 1; i <= daysInMonth; i++) {
      dates.push({
        day: i,
        month: "current",
        fullDate: new Date(year, month, i),
      });
    }

    const remainingCells = 42 - dates.length;
    for (let i = 1; i <= remainingCells; i++) {
      dates.push({
        day: i,
        month: "next",
        fullDate: new Date(year, month + 1, i),
      });
    }

    return dates;
  }, [viewDate]);

  const handlePrevMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));
  };

  const isSameDay = (d1, d2) => {
    return (
      d1.getDate() === d2.getDate() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getFullYear() === d2.getFullYear()
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      className="rounded-2xl p-6 text-white h-full min-h-[350px]"
      style={{ backgroundColor: "var(--primary)" }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <IoChevronBack
          className="cursor-pointer opacity-80 hover:opacity-100 p-1 bg-white/10 rounded-full"
          size={24}
          onClick={handlePrevMonth}
        />
        <span className="font-bold text-lg">
          {viewDate.toLocaleString("default", { month: "long" })}{" "}
          {viewDate.getFullYear()}
        </span>
        <IoChevronForward
          className="cursor-pointer opacity-80 hover:opacity-100 p-1 bg-white/10 rounded-full"
          size={24}
          onClick={handleNextMonth}
        />
      </div>

      {/* Grid */}
      <div className="grid grid-cols-7 gap-y-2 text-center">
        {days.map((day) => (
          <span key={day} className="text-sm font-bold opacity-90 mb-4">
            {day}
          </span>
        ))}

        {calendarData.map((item, idx) => {
          const isSelected = isSameDay(item.fullDate, selectedDate);
          const isToday = isSameDay(item.fullDate, today);
          const isCurrentMonth = item.month === "current";

          return (
            <div key={idx} className="flex justify-center items-center">
              <button
                onClick={() => {
                  setSelectedDate(item.fullDate);
                  if (item.month !== "current") setViewDate(item.fullDate);
                }}
                className={`
                  relative w-10 h-10 flex items-center justify-center rounded-xl text-sm font-medium transition-all duration-200 outline-none
                  ${isSelected ? "bg-white text-gray-800 shadow-lg scale-110" : "hover:bg-white/20 cursor-pointer"}
                  ${!isCurrentMonth ? "opacity-30" : "opacity-100"}
                  ${isToday && !isSelected ? "border-2 border-white/50" : ""}
                `}
              >
                {item.day}
                {isToday && !isSelected && (
                  <span className="absolute bottom-1 w-1 h-1 bg-white rounded-full"></span>
                )}
              </button>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default CalendarCard;
