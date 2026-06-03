// components/ChatSidebar.jsx
import React, { useState } from 'react'
import { Search } from 'lucide-react'

const ChatSidebar = ({
  currentUser,
  users,
  conversations,
  onlineUsers,
  activeConversation,
  onSelectConversation,
  onSelectUser,
  getOtherParticipant,
}) => {
  const [activeTab, setActiveTab] = useState('private')
  const [search, setSearch] = useState('')

  const isOnline = (userId) => onlineUsers.includes(userId?.toString())

  const filteredConversations = conversations.filter((c) => {
    const other = getOtherParticipant(c)
    return `${other?.firstName} ${other?.lastName}`
      .toLowerCase()
      .includes(search.toLowerCase())
  })

  const filteredUsers = users.filter((u) =>
    `${u.firstName} ${u.lastName}`.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="w-full lg:w-[35%] bg-white dark:bg-[#292D4A] rounded-lg shadow-sm overflow-hidden flex flex-col h-full">

      {/* User Profile */}
      <div className="p-6 flex items-center gap-4 border-b border-sidebar-text/10">
        <img
          src={currentUser?.profileImage || `https://i.pravatar.cc/150?u=${currentUser?.id}`}
          alt={currentUser?.firstName}
          className="w-16 h-16 rounded-xl object-cover"
        />
        <div>
          <h3 className="font-bold text-header-text text-base">
            {currentUser?.firstName} {currentUser?.lastName}
          </h3>
          <p className="text-sm text-content-text capitalize opacity-70">
            {currentUser?.role}
          </p>
        </div>
      </div>

      {/* Contacts — horizontal scroll, sirf admin */}
      {currentUser?.role === 'admin' && users.length > 0 && (
        <div className="px-6 py-4 border-b border-sidebar-text/10">
          <div className="flex justify-between items-center mb-3">
            <h4 className="font-bold text-header-text text-sm">Contacts</h4>
            <button
              onClick={() => setActiveTab('users')}
              className="text-xs text-primary font-medium hover:underline"
            >
              View All
            </button>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-1 custom-scrollbar">
            {users.slice(0, 8).map((user) => (
              <button
                key={user._id}
                onClick={() => onSelectUser(user._id)}
                className="shrink-0 relative"
                title={`${user.firstName} ${user.lastName}`}
              >
                <img
                  src={user.profileImage || `https://i.pravatar.cc/150?u=${user._id}`}
                  alt={user.firstName}
                  className="w-8 h-8 rounded-md object-cover"
                />
                {isOnline(user._id) && (
                  <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-primary border-2 border-white dark:border-[#292D4A] rounded-full" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Search */}
      <div className="px-6 pt-4">
        <div className="flex items-center gap-2 bg-headerbg/20 dark:bg-white/5 rounded-lg px-3 py-2 mb-4">
          <Search size={16} className="text-content-text opacity-50 shrink-0" />
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent outline-none text-sm text-header-text placeholder:text-content-text flex-1"
          />
        </div>

        {/* Tabs */}
        <div className="flex border-b border-sidebar-text/10">
          <button
            onClick={() => setActiveTab('private')}
            className={`flex-1 pb-3 text-sm font-bold transition-all border-b-2 ${
              activeTab === 'private'
                ? 'text-primary border-primary'
                : 'text-sidebar-text opacity-50 border-transparent'
            }`}
          >
            Private
          </button>
          <button
            onClick={() => setActiveTab('group')}
            className={`flex-1 pb-3 text-sm font-bold transition-all border-b-2 ${
              activeTab === 'group'
                ? 'text-primary border-primary'
                : 'text-sidebar-text opacity-50 border-transparent'
            }`}
          >
            Group
          </button>
          {currentUser?.role === 'admin' && (
            <button
              onClick={() => setActiveTab('users')}
              className={`flex-1 pb-3 text-sm font-bold transition-all border-b-2 ${
                activeTab === 'users'
                  ? 'text-primary border-primary'
                  : 'text-sidebar-text opacity-50 border-transparent'
              }`}
            >
              All Users
            </button>
          )}
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto px-4 pb-6 pt-2 custom-scrollbar">

        {/* Private Tab — Conversations */}
        {activeTab === 'private' && (
          <>
            {filteredConversations.length === 0 ? (
              <p className="text-xs text-center text-content-text opacity-50 mt-8">
                No conversations yet
              </p>
            ) : (
              filteredConversations.map((convo) => {
                const other = getOtherParticipant(convo)
                const isActive = activeConversation?._id === convo._id
                const unreadCount = convo.unreadCount || 0

                return (
                  <div
                    key={convo._id}
                    onClick={() => onSelectConversation(convo)}
                    className={`flex items-center gap-4 p-4 rounded-lg cursor-pointer transition-all mb-1 ${
                      isActive
                        ? 'bg-headerbg/30 dark:bg-white/5'
                        : 'hover:bg-headerbg/10 dark:hover:bg-white/5'
                    }`}
                  >
                    <div className="relative shrink-0">
                      <img
                        src={other?.profileImage || `https://i.pravatar.cc/150?u=${other?._id}`}
                        alt={other?.firstName}
                        className="w-14 h-14 rounded-xl object-cover"
                      />
                      {isOnline(other?._id) && (
                        <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-primary border-2 border-white dark:border-[#292D4A] rounded-full" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center mb-1">
                        <h4 className={`text-sm font-bold truncate ${
                          isActive ? 'text-primary' : 'text-header-text'
                        }`}>
                          {other?.firstName} {other?.lastName}
                        </h4>
                        <span className="text-[11px] text-sidebar-text opacity-60 shrink-0 ml-2">
                          {convo.updatedAt
                            ? new Date(convo.updatedAt).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit',
                              })
                            : ''}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <p className="text-xs text-content-text truncate opacity-70">
                          {convo.lastMessage?.content ||
                            convo.lastMessage?.fileName ||
                            'No messages yet'}
                        </p>
                        {unreadCount > 0 && (
                          <span className="ml-2 shrink-0 min-w-[20px] h-5 bg-primary text-white text-[10px] flex items-center justify-center rounded-md font-bold px-1">
                            {unreadCount}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })
            )}
          </>
        )}

        {/* Group Tab */}
        {activeTab === 'group' && (
          <p className="text-xs text-center text-content-text opacity-50 mt-8">
            No group chats yet
          </p>
        )}

        {/* All Users Tab — sirf admin */}
        {activeTab === 'users' && currentUser?.role === 'admin' && (
          <>
            {filteredUsers.length === 0 ? (
              <p className="text-xs text-center text-content-text opacity-50 mt-8">
                No users found
              </p>
            ) : (
              filteredUsers.map((user) => (
                <div
                  key={user._id}
                  onClick={() => onSelectUser(user._id)}
                  className="flex items-center gap-4 p-4 rounded-lg cursor-pointer hover:bg-headerbg/10 dark:hover:bg-white/5 transition-all mb-1"
                >
                  <div className="relative shrink-0">
                    <img
                      src={user.profileImage || `https://i.pravatar.cc/150?u=${user._id}`}
                      alt={user.firstName}
                      className="w-14 h-14 rounded-xl object-cover"
                    />
                    {isOnline(user._id) && (
                      <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-primary border-2 border-white dark:border-[#292D4A] rounded-full" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold truncate text-header-text">
                      {user.firstName} {user.lastName}
                    </h4>
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-content-text opacity-70 capitalize">
                        {user.role}
                      </p>
                      {isOnline(user._id) && (
                        <span className="text-[10px] text-primary font-medium">
                          Online
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default ChatSidebar