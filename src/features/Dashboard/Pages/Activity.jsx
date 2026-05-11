import React, { useState } from 'react';
import { FileText, MoreHorizontal, Pencil, Trash2 } from 'lucide-react';

const TimelineItem = ({ time, avatarColor, initials, name, action, highlight, type, files, isLast }) => {


  return (
    <div className="flex gap-4 group relative">
      <div className="flex flex-col items-center w-20 shrink-0">
        <span className="text-[14px] font-medium text-content-text">{time}</span>
        {!isLast && (
          <div className="w-[2px] grow bg-sidebar-text opacity-10 my-2"></div>
        )}
      </div>

      <div className="pb-8 flex gap-4 w-full relative">
        <div 
          className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold shrink-0"
          style={{ backgroundColor: avatarColor }}
        >
          {initials}
        </div>

        <div className="flex flex-col gap-3 w-full">
          <div className="flex justify-between items-start">
            <p className="text-[15px] text-content-text pr-8 leading-relaxed">
              <span className="font-bold text-header-text">{name}</span> {action} {' '}
              <span className="font-bold" style={{ color: highlight.color }}>{highlight.text}</span> {type}
            </p>
            
            {/* Action Menu */}
           
          </div>

          {files && (
            <div className="flex flex-wrap gap-4 mt-1">
              {files.map((file, idx) => (
                <div key={idx} className="flex items-center gap-3 bg-headerbg/30 dark:bg-white/5 p-3 rounded-xl border border-sidebar-text/10 min-w-[220px]">
                  <div className="p-2 bg-white dark:bg-sidebar-bg rounded-lg text-sidebar-text shadow-sm">
                    <FileText size={18} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-header-text">{file.name}</p>
                    <p className="text-[10px] text-sidebar-text opacity-70">{file.size}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const Activity = () => {
  const [activeTab, setActiveTab] = useState('following');
  const [showMenu, setShowMenu] = useState(false);
  // Today and Yesterday Data
  const activities = [
    {
      day: "Today",
      items: [
        {
          time: "10:10 AM", initials: "KH", avatarColor: "#4FB8E3", name: "Karen Hope",
          action: "attach 2 files to", highlight: { text: "Graphic Design", color: "#FFB800" },
          type: "Courses",
          files: [
            { name: "Module1_GraphicDesign.doc", size: "1.5 Mb" },
            { name: "Module2_GraphicDesign.doc", size: "1.5 Mb" }
          ]
        },
        {
          time: "10:10 AM", initials: "JN", avatarColor: "#FFB800", name: "Jordan Nico",
          action: "has invited you to", highlight: { text: "Graphic Design", color: "#FFB800" },
          type: "Group Chat"
        },
        {
          time: "10:10 AM", initials: "JA", avatarColor: "#4CBC9A", name: "Johnny Ahmad",
          action: "accepted your invitation to", highlight: { text: "Fullstack Developer", color: "#4CBC9A" },
          type: "Courses"
        }
      ]
    },
    {
      day: "Yesterday",
      items: [
        {
          time: "09:45 AM", initials: "KH", avatarColor: "#4FB8E3", name: "Karen Hope",
          action: "attach 1 file to", highlight: { text: "Graphic Design", color: "#FFB800" },
          type: "Courses"
        },
        {
          time: "08:20 AM", initials: "JN", avatarColor: "#4FB8E3", name: "Jordan Nico",
          action: "has invited you to", highlight: { text: "Graphic Design", color: "#FFB800" },
          type: "Group Chat"
        },
        {
          time: "07:15 AM", initials: "JA", avatarColor: "#4CBC9A", name: "Johnny Ahmad",
          action: "accepted your invitation to", highlight: { text: "Fullstack Developer", color: "#4CBC9A" },
          type: "Courses"
        }
      ]
    }
  ];

  return (
    <div className="bg-[#FFFFFF] dark:bg-[#292D4A] p-6 rounded-md shadow-sm font-poppins min-h-screen">
      {/* Tabs Header */}
      <div className="flex items-center justify-between mb-8 border-b border-sidebar-text/10">
        <div className="flex gap-8">
          <button 
            onClick={() => setActiveTab('following')}
            className={`pb-4   font-semibold text-[15.75px] transition-all relative ${activeTab === 'following' ? 'text-secondary border-b-2 border-secondary' : 'text-sidebar-text  opacity-50'}`}
          >
            Following
            <span className="absolute top-0 -right-2 w-2 h-2 bg-primary rounded-full"></span>
          </button>
          <button 
            onClick={() => setActiveTab('you')}
            className={`pb-4 text-sm font-semibold text-[15.75px] transition-all ${activeTab === 'you' ? 'text-secondary border-b-2 border-secondary' : ' opacity-50'}`}
          >
            You
          </button>
        </div>
     <div className="relative">
              <button 
                onClick={() => setShowMenu(!showMenu)}
                className="p-1 hover:bg-headerbg/50 rounded-md transition-colors text-sidebar-text opacity-60 hover:opacity-100"
              >
                <MoreHorizontal size={18}/>
              </button>

              {showMenu && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)}></div>
                  <div className="absolute right-0 mt-2 w-36 bg-sidebar-bg border border-sidebar-text/10 rounded-xl shadow-2xl z-20 overflow-hidden py-1 animate-in fade-in zoom-in duration-200">
                    <button className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-medium text-header-text hover:bg-headerbg/30 transition-colors">
                      <Pencil size={14} className="text-secondary" /> Edit Activity
                    </button>
                    <button className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors">
                      <Trash2 size={14} /> Delete
                    </button>
                  </div>
                </>
              )}
            </div>
      </div>

      {/* Timeline Rendering */}
      {activeTab === 'following' ? (
        activities.map((group, gIdx) => (
          <div key={gIdx} className="mb-6">
            <h3 className="text-lg font-bold text-header-text mb-8">{group.day}</h3>
            <div className="ml-2">
              {group.items.map((item, iIdx) => (
                <TimelineItem 
                  key={iIdx} 
                  {...item} 
                  isLast={iIdx === group.items.length - 1 && gIdx === activities.length - 1} 
                />
              ))}
            </div>
          </div>
        ))
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-sidebar-text animate-pulse">
          <p className="text-sm font-medium">No personal activity yet.</p>
        </div>
      )}
    </div>
  );
};

export default Activity;