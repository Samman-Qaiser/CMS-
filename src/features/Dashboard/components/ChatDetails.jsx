import React from 'react'
import { Phone, Video, MoreHorizontal, FileText, X } from 'lucide-react'

const ChatDetails = ({ isOpen, onClose, otherUser, messages }) => {
  const sharedFiles = messages?.filter((m) => m.fileUrl) || []

  return (
    <div
      className={`absolute top-0 right-0 h-full w-[350px] bg-[#292D4A] shadow-2xl z-50 transform transition-transform duration-300 ease-in-out border-l border-white/10 ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}
    >
      {/* Header */}
      <div className="p-6 border-b border-white/10 flex justify-between items-center">
        <h3 className="text-white font-bold text-lg">Details</h3>
        <button onClick={onClose} className="text-white/50 hover:text-white transition-colors">
          <X size={24} />
        </button>
      </div>

      <div className="p-6 flex flex-col gap-8 overflow-y-auto h-[calc(100%-80px)] custom-scrollbar">

        {/* User Profile */}
        <div className="flex flex-col items-center text-center gap-4">
          <div className="relative">
            <img
              src={otherUser?.profileImage || `https://i.pravatar.cc/150?u=${otherUser?._id}`}
              alt={otherUser?.firstName}
              className="w-24 h-24 rounded-2xl object-cover"
            />
            <span className="absolute bottom-1 right-1 w-5 h-5 bg-primary border-4 border-[#292D4A] rounded-full" />
          </div>
          <div>
            <h4 className="text-xl font-bold text-white">
              {otherUser?.firstName} {otherUser?.lastName}
            </h4>
            <p className="text-sm text-white/50 font-medium capitalize">{otherUser?.role}</p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 mt-2">
            <button className="p-3 bg-white/5 rounded-xl text-white/70 hover:bg-white/10 transition-all">
              <Phone size={20} />
            </button>
            <button className="p-3 bg-white/5 rounded-xl text-white/70 hover:bg-white/10 transition-all">
              <Video size={20} />
            </button>
            <button className="p-3 bg-white/5 rounded-xl text-white/70 hover:bg-white/10 transition-all">
              <MoreHorizontal size={20} />
            </button>
          </div>
        </div>

        {/* Shared Files */}
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <h4 className="font-bold text-white">Shared Files</h4>
            <span className="text-xs text-white/40">{sharedFiles.length} files</span>
          </div>

          {sharedFiles.length === 0 ? (
            <p className="text-xs text-white/30 text-center py-4">No files shared yet</p>
          ) : (
            <div className="flex flex-col gap-4">
              {sharedFiles.map((msg, i) => {
                const date = new Date(msg.createdAt).toLocaleDateString('en-US', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                })
                return (
                  <a
                    key={i}
                    href={msg.fileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-between group cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      {msg.fileType === 'image' ? (
                        <img
                          src={msg.fileUrl}
                          alt={msg.fileName}
                          className="w-10 h-10 rounded-xl object-cover"
                        />
                      ) : (
                        <div className="p-3 bg-white/5 rounded-xl text-white/40 group-hover:text-secondary group-hover:bg-secondary/10 transition-all">
                          <FileText size={20} />
                        </div>
                      )}
                      <div>
                        <p className="text-sm font-bold text-white mb-0.5 truncate max-w-[160px]">
                          {msg.fileName || 'File'}
                        </p>
                        <p className="text-[10px] text-white/40">{date}</p>
                      </div>
                    </div>
                  </a>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ChatDetails