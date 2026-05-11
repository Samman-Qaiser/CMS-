import React, { useState } from 'react';

const ChatSidebar = () => {
  const [activeTab, setActiveTab] = useState('private');

  const contacts = [
    { id: 1, name: "Tony Soap", time: "12:45 PM", lastMsg: "Lorem ipsum do...", count: 2, image: "https://i.pravatar.cc/150?u=tony" },
    { id: 2, name: "Jordan Nico", time: "11:30 AM", lastMsg: "See you later", count: 0, image: "https://i.pravatar.cc/150?u=jordan" },
    { id: 3, name: "Karen Hope", time: "12:45 PM", lastMsg: "Can you arrange...", count: 2, image: "https://i.pravatar.cc/150?u=karen", active: true },
  ];

  return (
    <div className="w-full lg:w-[35%] bg-white dark:bg-[#292D4A] rounded-lg shadow-sm overflow-hidden flex flex-col h-full">
      <div className="p-6">
        <h2 className="text-xl font-bold text-header-text mb-6">Chats</h2>
        {/* Tabs */}
        <div className="flex border-b border-sidebar-text/10">
          <button 
            onClick={() => setActiveTab('private')}
            className={`flex-1 pb-4 text-sm font-bold transition-all border-b-2 ${activeTab === 'private' ? 'text-secondary border-secondary' : 'text-sidebar-text opacity-50 border-transparent'}`}
          >
            Private
          </button>
          <button 
            onClick={() => setActiveTab('group')}
            className={`flex-1 pb-4 text-sm font-bold transition-all border-b-2 ${activeTab === 'group' ? 'text-secondary border-secondary' : 'text-sidebar-text opacity-50 border-transparent'}`}
          >
            Group
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-6 custom-scrollbar">
        {contacts.map((contact) => (
          <div 
            key={contact.id} 
            className={`flex items-center gap-4 p-4 rounded-lg cursor-pointer transition-all mb-2 ${contact.active ? 'bg-headerbg/30 dark:bg-white/5 shadow-sm' : 'hover:bg-headerbg/10 dark:hover:bg-white/5'}`}
          >
            <img src={contact.image} alt={contact.name} className="w-12 h-12 rounded-lg object-cover shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-center mb-1">
                <h4 className={`text-sm font-bold truncate ${contact.active ? 'text-secondary' : 'text-header-text'}`}>{contact.name}</h4>
                <span className="text-[10px] text-sidebar-text opacity-60">{contact.time}</span>
              </div>
              <p className="text-xs text-content-text truncate opacity-70">{contact.lastMsg}</p>
            </div>
            {contact.count > 0 && (
              <div className="w-5 h-5 bg-secondary text-white text-[10px] flex items-center justify-center rounded-md font-bold">
                {contact.count}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
export default ChatSidebar;