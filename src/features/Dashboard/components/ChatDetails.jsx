import React from 'react';
import { Phone, Video, MoreHorizontal, FileText, X } from 'lucide-react';

const ChatDetails = ({ isOpen, onClose }) => {
  const files = [
    { name: "File.doc", size: "1,5 Mb", date: "2 March 2021, 13:45 PM" },
    { name: "File.doc", size: "1,5 Mb", date: "2 March 2021, 13:45 PM" },
    { name: "File.doc", size: "1,5 Mb", date: "2 March 2021, 13:45 PM" },
    { name: "File.doc", size: "1,5 Mb", date: "2 March 2021, 13:45 PM" },
    { name: "File.doc", size: "1,5 Mb", date: "2 March 2021, 13:45 PM" },
  ];

  return (
    <div 
      className={`absolute top-0 right-0 h-full w-[350px] bg-[#292D4A] shadow-2xl z-50 transform transition-transform duration-300 ease-in-out border-l border-white/10 ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}
    >
      {/* Close Button & Header */}
      <div className="p-6 border-b border-white/10 flex justify-between items-center">
        <h3 className="text-white font-bold text-lg">Details</h3>
        <button onClick={onClose} className="text-white/50 hover:text-white transition-colors">
          <X size={24} />
        </button>
      </div>

      <div className="p-6 flex flex-col gap-8 overflow-y-auto h-[calc(100%-80px)] custom-scrollbar">
        {/* User Profile Info */}
        <div className="flex flex-col items-center text-center gap-4">
          <div className="relative">
            <img src="https://i.pravatar.cc/150?u=karen" alt="Karen" className="w-24 h-24 rounded-2xl object-cover" />
            <span className="absolute bottom-1 right-1 w-5 h-5 bg-primary border-4 border-[#292D4A] rounded-full"></span>
          </div>
          <div>
            <h4 className="text-xl font-bold text-white">Karen Hope</h4>
            <p className="text-sm text-primary font-medium">Online</p>
          </div>
          
          {/* Action Buttons */}
          <div className="flex gap-3 mt-2">
            <button className="p-3 bg-white/5 rounded-xl text-white/70 hover:bg-white/10 transition-all"><Phone size={20}/></button>
            <button className="p-3 bg-white/5 rounded-xl text-white/70 hover:bg-white/10 transition-all"><Video size={20}/></button>
            <button className="p-3 bg-white/5 rounded-xl text-white/70 hover:bg-white/10 transition-all"><MoreHorizontal size={20}/></button>
          </div>
        </div>

        {/* Shared Files Section */}
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <h4 className="font-bold text-white">Shared Files</h4>
            <button className="text-xs text-white/50 font-bold hover:text-secondary transition-all">View all</button>
          </div>
          
          <div className="flex flex-col gap-4">
            {files.map((file, i) => (
              <div key={i} className="flex items-center justify-between group cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-white/5 rounded-xl text-white/40 group-hover:text-secondary group-hover:bg-secondary/10 transition-all">
                    <FileText size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white mb-0.5">{file.name}</p>
                    <p className="text-[10px] text-white/40">{file.date}</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-white/60">{file.size}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatDetails;