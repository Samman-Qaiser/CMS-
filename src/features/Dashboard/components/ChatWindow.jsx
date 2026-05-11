import React, { useState, useRef, useEffect } from 'react';
import { Send, Paperclip, MoreHorizontal, ChevronLeft } from 'lucide-react';
import ChatDetails from './ChatDetails';

const ChatWindow = () => {
  // 1. State for messages
  const [messages, setMessages] = useState([
    { id: 1, text: "Can you arrange schedule for next meeting?", sender: "them", time: "12:45 PM" }
  ]);
  
  // 2. State for input field & overlay
  const [inputText, setInputText] = useState("");
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  
  const messagesEndRef = useRef(null);

  // Auto scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // 3. Message Sending Logic
  const handleSendMessage = () => {
    if (inputText.trim() === "") return;

    const newMessage = {
      id: messages.length + 1,
      text: inputText,
      sender: "me",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages([...messages, newMessage]);
    setInputText(""); 
  };

  return (
    <div className="flex-1 flex flex-col bg-headerbg/10 dark:bg-black/10 rounded-lg overflow-hidden h-full relative">
      
      {/* --- CHAT DETAILS OVERLAY --- */}
      <ChatDetails isOpen={isDetailsOpen} onClose={() => setIsDetailsOpen(false)} />

      {/* --- SIDE TOGGLE ARROW --- */}
      {!isDetailsOpen && (
        <button 
          onClick={() => setIsDetailsOpen(true)}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-40 bg-primary text-white p-1 rounded-l-lg shadow-lg hover:pr-3 transition-all"
        >
          <ChevronLeft size={20} />
        </button>
      )}

      {/* --- TOP HEADER --- */}
      <div className="p-4 px-6 bg-white dark:bg-[#292D4A] border-b border-sidebar-text/10 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="relative">
            <img 
              src="https://i.pravatar.cc/150?u=karen" 
              alt="Karen" 
              className="w-12 h-12 rounded-lg object-cover" 
            />
            <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-primary border-2 border-white dark:border-[#292D4A] rounded-full"></span>
          </div>
          <div>
            <h4 className="text-sm font-bold text-header-text leading-none mb-1">Karen Hope</h4>
            <p className="text-[14px] text-primary font-medium">Online</p>
          </div>
        </div>
        <button className="text-sidebar-text opacity-50 hover:opacity-100 p-2">
          <MoreHorizontal size={20} />
        </button>
      </div>

      {/* --- MESSAGES AREA --- */}
      <div className="flex-1 p-6 overflow-y-auto flex flex-col gap-6 custom-scrollbar">
        <div className="text-center">
          <span className="text-[10px] text-sidebar-text font-medium opacity-60 uppercase tracking-widest">
            Sunday, October 24th, 2020 at 4:30 AM
          </span>
        </div>

        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`flex flex-col ${msg.sender === "me" ? "items-end" : "items-start"} gap-2`}
          >
            <div 
              className={`max-w-[75%] p-4 rounded-lg shadow-sm ${
                msg.sender === "me" 
                  ? "bg-secondary text-white rounded-tr-none" 
                  : "bg-white dark:bg-[#292D4A] text-content-text rounded-tl-none"
              }`}
            >
              <p className="text-sm">{msg.text}</p>
            </div>
            <span className="text-[10px] text-sidebar-text opacity-60">{msg.time}</span>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* --- INPUT FIELD & ATTACH ICON --- */}
      <div className="p-6 bg-white dark:bg-[#292D4A] border-t border-sidebar-text/10">
        <div className="flex items-center gap-4 bg-headerbg/20 dark:bg-white/5 p-2 rounded-lg px-4 border border-transparent focus-within:border-primary/30 transition-all">
          <input 
            type="text" 
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Type message..." 
            className="flex-1 bg-transparent border-none outline-none text-sm text-header-text placeholder:text-content-text"
          />
          
          {/* Attach Icon */}
          <button className="text-content-text opacity-50 hover:opacity-100 transition-all">
            <Paperclip size={20} />
          </button>

          {/* Send Button */}
          <button 
            onClick={handleSendMessage}
            className="bg-primary hover:bg-primary/90 text-white p-2 rounded-lg transition-all shadow-lg"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;