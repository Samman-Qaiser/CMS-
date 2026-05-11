import React from 'react';
import { ChevronRight, MoreHorizontal } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// --- 1. Mini Stat Card (Top right cards) ---
export const StatCard = ({ icon, title, count, colorClass }) => (
  <div className="bg-white dark:bg-[#292D4A] p-8 rounded-lg flex items-center justify-between shadow-sm flex-1">
    <div className="flex items-center gap-4">
      <div className={`p-3 rounded-2xl bg-opacity-10 ${colorClass} bg-current`}>{icon}</div>
      <div>
        <h4 className="text-xl font-bold text-header-text">{count}</h4>
        <p className="text-xs text-sidebar-text">{title}</p>
      </div>
    </div>
    <ChevronRight size={18} className="text-sidebar-text opacity-40" />
  </div>
);

// --- 2. Course Progress Card ---
 export const CourseCard = ({ title, progress, total, current, color }) => (
  <div className="bg-white dark:bg-[#292D4A] p-6 rounded-lg shadow-sm flex-1">
    <div className="relative w-24 h-24 mx-auto mb-4 flex items-center justify-center">
        {/* Simple SVG Circular Progress */}
      <svg className="w-full h-full transform -rotate-90">
        <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-gray-100 dark:text-gray-800" />
        <circle cx="48" cy="48" r="40" stroke={color} strokeWidth="8" fill="transparent" strokeDasharray={251.2} strokeDashoffset={251.2 - (251.2 * progress) / 100} strokeLinecap="round" />
      </svg>
      <span className="absolute text-lg font-bold text-header-text">{progress}%</span>
    </div>
    <p className="text-[10px] text-sidebar-text uppercase font-bold text-center mb-1">Class</p>
    <h4 className="text-sm font-bold text-header-text text-center mb-4">{title}</h4>
    <div className="border-t border-sidebar-text/10 pt-4 text-center">
      <p className="text-[10px] text-sidebar-text uppercase">Total Courses</p>
      <p className="text-sm font-bold text-header-text">{current} / {total}</p>
    </div>
  </div>
);
