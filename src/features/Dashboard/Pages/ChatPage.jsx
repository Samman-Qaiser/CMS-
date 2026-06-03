// pages/Messages.jsx
import React from 'react'
import { useSelector } from 'react-redux' // ya jo bhi tumhara auth state hai
import ChatSidebar from '../components/ChatSidebar'
import ChatWindow from '../components/ChatWindow'
import { useChat } from '../../../hooks/useChat'

const Messages = () => {
  // Tumhara auth state — apne hisaab se adjust karo
  const currentUser = useSelector((state) => state.auth.user)

  const {
    users,
    conversations,
    activeConversation,
    messages,
    onlineUsers,
    typingUsers,
    loading,
    selectConversation,
    sendMessage,
    sendFile,
    emitTyping,
    getOtherParticipant,
  } = useChat(currentUser)

  return (
    <div className="p-8 bg-bg-main min-h-screen font-poppins flex flex-col xl:flex-row gap-8 h-screen max-h-screen overflow-hidden">
      <ChatSidebar
        currentUser={currentUser}
        users={users}
        conversations={conversations}
        onlineUsers={onlineUsers}
        activeConversation={activeConversation}
        onSelectConversation={(convo) => selectConversation(convo)}
        onSelectUser={(userId) => selectConversation(userId, true)}
        getOtherParticipant={getOtherParticipant}
      />

      <ChatWindow
        currentUser={currentUser}
        activeConversation={activeConversation}
        messages={messages}
        onlineUsers={onlineUsers}
        typingUsers={typingUsers}
        onSendMessage={sendMessage}
        onSendFile={sendFile}
        onTyping={emitTyping}
        getOtherParticipant={getOtherParticipant}
      />
    </div>
  )
}

export default Messages