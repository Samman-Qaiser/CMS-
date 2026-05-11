import React, { useState } from 'react';
import { MoreHorizontal, ChevronDown, Pencil, Trash2 } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const ScoreActivity = () => {
  // States
  const [showThisMonth, setShowThisMonth] = useState(true);
  const [showLastMonth, setShowLastMonth] = useState(true);
  const [isFilterOpen, setIsFilterOpen] = useState(false); // For "This Month" dropdown
  const [isMenuOpen, setIsMenuOpen] = useState(false);     // For "Three Dots" dropdown
  const [filter, setFilter] = useState("This Month");

  const data = [
    { name: 'Mon', thisMonth: 70, lastMonth: 40 },
    { name: 'Tue', thisMonth: 20, lastMonth: 55 },
    { name: 'Wed', thisMonth: 60, lastMonth: 50 },
    { name: 'Thu', thisMonth: 30, lastMonth: 40 },
    { name: 'Fri', thisMonth: 20, lastMonth: 75 },
    { name: 'Sat', thisMonth: 70, lastMonth: 80 },
    { name: 'Sun', thisMonth: 60, lastMonth: 90 },
  ];

  return (
    <div className="bg-white dark:bg-[#292D4A] p-6 rounded-lg shadow-sm mt-6 font-poppins relative">
      <div className="flex flex-wrap justify-between items-center mb-8 gap-4">
        <h3 className="font-bold text-header-text text-lg">Score Activity</h3>
        
        <div className="flex items-center gap-6">
          {/* Legend Toggles */}
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setShowThisMonth(!showThisMonth)}
              className={`flex items-center gap-2 text-xs transition-all ${showThisMonth ? 'opacity-100' : 'opacity-30 grayscale'}`}
            >
              <span className="w-4 h-4 rounded-full border-2 border-orange-400 flex items-center justify-center">
                {showThisMonth && <span className="w-2 h-2 bg-orange-400 rounded-full"></span>}
              </span> 
              <span className="text-sidebar-text font-medium">This Month</span>
            </button>

            <button 
              onClick={() => setShowLastMonth(!showLastMonth)}
              className={`flex items-center gap-2 text-xs transition-all ${showLastMonth ? 'opacity-100' : 'opacity-30 grayscale'}`}
            >
              <span className="w-4 h-4 rounded-full border-2 border-blue-600 flex items-center justify-center">
                {showLastMonth && <span className="w-2 h-2 bg-blue-600 rounded-full"></span>}
              </span> 
              <span className="text-sidebar-text font-medium">Last Month</span>
            </button>
          </div>

          {/* Filter Dropdown (This Month/Week/Day) */}
          <div className="relative">
            <button 
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="flex items-center gap-2 bg-headerbg/20 dark:bg-white/5 px-4 py-2 rounded-xl text-xs font-semibold text-header-text border border-transparent"
            >
              {filter} <ChevronDown size={14} />
            </button>

            {isFilterOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setIsFilterOpen(false)}></div>
                <div className="absolute right-0 mt-2 w-36 bg-white dark:bg-[#292D4A] border border-sidebar-text/10 rounded-xl shadow-xl z-20 py-2">
                  {["This Month", "This Weekly", "This Day"].map((item) => (
                    <button
                      key={item}
                      onClick={() => { setFilter(item); setIsFilterOpen(false); }}
                      className="w-full text-left px-4 py-2 text-xs text-sidebar-text hover:bg-headerbg/30"
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
          
          {/* --- THREE DOTS MENU (EDIT/DELETE) --- */}
          <div className="relative">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-sidebar-text opacity-50 hover:opacity-100 p-1 rounded-lg hover:bg-headerbg/30 transition-all"
            >
              <MoreHorizontal size={20} />
            </button>

            {isMenuOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setIsMenuOpen(false)}></div>
                <div className="absolute right-0 mt-2 w-32 bg-white dark:bg-[#292D4A] border border-sidebar-text/10 rounded-xl shadow-2xl z-20 overflow-hidden py-1 animate-in fade-in zoom-in duration-150">
                  <button className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-medium text-header-text hover:bg-headerbg/30 transition-colors">
                    <Pencil size={14} className="text-secondary" /> Edit
                  </button>
                  <button className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors">
                    <Trash2 size={14} /> Delete
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="h-[280px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorThis" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f87171" stopOpacity={0.2}/>
                <stop offset="95%" stopColor="#f87171" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorLast" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#4cbc9a" stopOpacity={0.2}/>
                <stop offset="95%" stopColor="#4cbc9a" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.05} />
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#828690'}} dy={10} />
            <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#828690'}} dx={-10} />
            <Tooltip contentStyle={{ borderRadius: '15px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
            
            {showThisMonth && (
              <Area type="monotone" dataKey="thisMonth" stroke="#f87171" strokeWidth={4} fillOpacity={1} fill="url(#colorThis)" />
            )}
            
            {showLastMonth && (
              <Area type="monotone" dataKey="lastMonth" stroke="#4cbc9a" strokeWidth={4} fillOpacity={1} fill="url(#colorLast)" />
            )}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ScoreActivity;