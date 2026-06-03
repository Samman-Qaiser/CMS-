// components/ChatWindow.jsx
import React, { useState, useRef, useEffect } from 'react'
import { Send, Paperclip, MoreHorizontal, ChevronLeft, FileText } from 'lucide-react'
import ChatDetails from './ChatDetails'

const ChatWindow = ({
  currentUser,
  activeConversation,
  messages,
  onlineUsers,
  typingUsers,
  onSendMessage,
  onSendFile,
  onTyping,
  getOtherParticipant,
}) => {
  const [inputText, setInputText] = useState('')
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const messagesEndRef = useRef(null)
  const fileInputRef = useRef(null)

  const otherUser = getOtherParticipant(activeConversation)
  const isOnline = onlineUsers.includes(otherUser?._id?.toString())

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = () => {
    if (!inputText.trim()) return
    onSendMessage(inputText)
    setInputText('')
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) onSendFile(file)
  }

  const renderMessage = (msg) => {
// ChatWindow.jsx mein yeh line fix karo
const isMe = msg.sender?._id === currentUser?.id || 
             msg.sender?._id === currentUser?._id ||
             msg.sender === currentUser?.id ||
             msg.sender === currentUser?._id
    console.log('msg.sender:', msg.sender)
console.log('currentUser.id:', currentUser?.id)
    return (
      <div key={msg._id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} gap-2`}>
        <div className={`max-w-[75%] p-4 rounded-lg shadow-sm ${
          isMe
           ? 'bg-primary text-white rounded-tr-none'  // bg-secondary → bg-primary
    : 'bg-white dark:bg-[#292D4A] text-content-text rounded-tl-none'
        }`}>
          {/* Text message */}
          {msg.content && <p className="text-sm">{msg.content}</p>}

          {/* Image */}
          {msg.fileType === 'image' && (
            <img src={msg.fileUrl} alt={msg.fileName} className="max-w-full rounded-lg max-h-48 object-cover" />
          )}

          {/* Video */}
          {msg.fileType === 'video' && (
            <video src={msg.fileUrl} controls className="max-w-full rounded-lg max-h-48" />
          )}

          {/* Audio */}
          {msg.fileType === 'audio' && (
            <audio src={msg.fileUrl} controls className="w-full" />
          )}

          {/* Document */}
          {msg.fileType === 'document' && (
            <a href={msg.fileUrl} target="_blank" rel="noreferrer"
              className="flex items-center gap-2 text-sm underline">
              <FileText size={16} />
              {msg.fileName}
            </a>
          )}
        </div>
        <span className="text-[10px] text-sidebar-text opacity-60">
          {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>
    )
  }

  if (!activeConversation) {
    return (
      <div className="flex-1 flex items-center justify-center bg-headerbg/10 dark:bg-black/10 rounded-lg">
        <p className="text-content-text opacity-50 text-sm">Select a conversation to start chatting</p>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col bg-headerbg/10 dark:bg-black/10 rounded-lg overflow-hidden h-full relative">
      <ChatDetails isOpen={isDetailsOpen} onClose={() => setIsDetailsOpen(false)} otherUser={otherUser} messages={messages} />

      {!isDetailsOpen && (
        <button
          onClick={() => setIsDetailsOpen(true)}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-40 bg-primary text-white p-1 rounded-l-lg shadow-lg hover:pr-3 transition-all"
        >
          <ChevronLeft size={20} />
        </button>
      )}

      {/* Header */}
      <div className="p-4 px-6 bg-white dark:bg-[#292D4A] border-b border-sidebar-text/10 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="relative">
            <img
              src={otherUser?.profileImage || `https://i.pravatar.cc/150?u=${otherUser?._id}`}
              alt={otherUser?.firstName}
              className="w-12 h-12 rounded-lg object-cover"
            />
            {isOnline && (
              <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-primary border-2 border-white dark:border-[#292D4A] rounded-full" />
            )}
          </div>
          <div>
            <h4 className="text-sm font-bold text-header-text leading-none mb-1">
              {otherUser?.firstName} {otherUser?.lastName}
            </h4>
            <p className={`text-[14px] font-medium ${isOnline ? 'text-primary' : 'text-content-text opacity-50'}`}>
              {isOnline ? 'Online' : 'Offline'}
            </p>
          </div>
        </div>
        <button className="text-sidebar-text opacity-50 hover:opacity-100 p-2">
          <MoreHorizontal size={20} />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 p-6 overflow-y-auto flex flex-col gap-6 custom-scrollbar">
        {messages.map(renderMessage)}

        {/* Typing indicator */}
        {typingUsers.length > 0 && (
          <div className="flex items-start gap-2">
            <div className="bg-white dark:bg-[#292D4A] p-3 rounded-lg rounded-tl-none">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-content-text rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 bg-content-text rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 bg-content-text rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-6 bg-white dark:bg-[#292D4A] border-t border-sidebar-text/10">
        <div className="flex items-center gap-4 bg-headerbg/20 dark:bg-white/5 p-2 rounded-lg px-4 border border-transparent focus-within:border-primary/30 transition-all">
          <input
            type="text"
            value={inputText}
            onChange={(e) => { setInputText(e.target.value); onTyping() }}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type message..."
            className="flex-1 bg-transparent border-none outline-none text-sm text-header-text placeholder:text-content-text"
          />
          <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
          <button onClick={() => fileInputRef.current?.click()} className="text-content-text opacity-50 hover:opacity-100 transition-all">
            <Paperclip size={20} />
          </button>
          <button onClick={handleSend} className="bg-primary hover:bg-primary/90 text-white p-2 rounded-lg transition-all shadow-lg">
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  )
}

export default ChatWindow