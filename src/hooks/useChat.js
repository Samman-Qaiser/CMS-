// hooks/useChat.js
import { useState, useEffect, useRef, useCallback } from 'react'
import {
  fetchAllUsers,
  fetchMyConversations,
  getOrCreateConversation,
  fetchMessages,
  uploadChatFile,
    markConversationAsRead,
  sendMessageApi,  // yeh add karein
} from '../services/chatApi'

export const useChat = (currentUser) => {
  const [users, setUsers] = useState([])
  const [conversations, setConversations] = useState([])
  const [activeConversation, setActiveConversation] = useState(null)
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)

  const userId = currentUser?._id || currentUser?.id
  const pollingRef = useRef(null)

  // Users + Conversations load
  useEffect(() => {
    if (!currentUser) return
    const load = async () => {
      try {
        if (currentUser.role === 'admin') {
          const allUsers = await fetchAllUsers()
          setUsers(allUsers.filter((u) => u._id !== userId))
        }
        const convos = await fetchMyConversations()
        setConversations(convos)
      } catch (err) {
        console.error(err)
      }
    }
    load()
  }, [currentUser])

  // Polling — har 3 second mein messages fetch karo
  useEffect(() => {
    if (!activeConversation) return

    // Pehle clear karo purana interval
    if (pollingRef.current) clearInterval(pollingRef.current)

    pollingRef.current = setInterval(async () => {
      try {
        const msgs = await fetchMessages(activeConversation._id)
        setMessages(msgs)
      } catch (err) {
        console.error(err)
      }
    }, 3000)

    return () => clearInterval(pollingRef.current)
  }, [activeConversation])

  // Conversation select
 const selectConversation = useCallback(async (conversationOrUserId, isUserId = false) => {
  setLoading(true)
  try {
    let conversation = conversationOrUserId

    if (isUserId) {
      conversation = await getOrCreateConversation(conversationOrUserId)
      setConversations((prev) => {
        const exists = prev.find((c) => c._id === conversation._id)
        return exists ? prev : [conversation, ...prev]
      })
    }

    setActiveConversation(conversation)

    // Messages read mark karo
    await markConversationAsRead(conversation._id)

    // Sidebar mein unread count 0 karo
    setConversations((prev) =>
      prev.map((c) =>
        c._id === conversation._id ? { ...c, unreadCount: 0 } : c
      )
    )

    const msgs = await fetchMessages(conversation._id)
    setMessages(msgs)
  } catch (err) {
    console.error(err)
  } finally {
    setLoading(false)
  }
}, [])

  // Message send — REST se
  const sendMessage = useCallback(async (content) => {
    if (!content.trim() || !activeConversation) return
    try {
      const message = await sendMessageApi(activeConversation._id, content)
      setMessages((prev) => [...prev, message])
      // Sidebar mein last message update
      setConversations((prev) =>
        prev.map((c) =>
          c._id === activeConversation._id ? { ...c, lastMessage: message } : c
        )
      )
    } catch (err) {
      console.error('Send failed:', err)
    }
  }, [activeConversation])

  // File send
  const sendFile = useCallback(async (file) => {
    if (!activeConversation) return
    try {
      const message = await uploadChatFile(activeConversation._id, file)
      setMessages((prev) => [...prev, message])
    } catch (err) {
      console.error(err)
    }
  }, [activeConversation])

  // Typing — sirf local state (socket nahi)
  const emitTyping = useCallback(() => {}, [])

  const getOtherParticipant = useCallback((conversation) => {
    if (!conversation || !currentUser) return null
    return conversation.participants?.find(
      (p) => p._id !== userId
    )
  }, [currentUser])

  return {
    users,
    conversations,
    activeConversation,
    messages,
    onlineUsers: [],
    typingUsers: [],
    loading,
    selectConversation,
    sendMessage,
    sendFile,
    emitTyping,
    getOtherParticipant,
  }
}