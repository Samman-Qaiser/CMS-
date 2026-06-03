// services/chatApi.js
import axios from 'axios'

// services/chatApi.js
const BASE = `${import.meta.env.VITE_BACKEND_URL || 'https://cms-backend-ashen.vercel.app'}/api`

const getToken = () => localStorage.getItem('token')

const headers = () => ({
  Authorization: `Bearer ${getToken()}`,
})

// Saare users fetch karo (admin ke liye)
export const fetchAllUsers = async () => {
  const res = await axios.get(`${BASE}/users`, { headers: headers() })
  return res.data.users
}

// Conversation start karo ya existing lo
export const getOrCreateConversation = async (receiverId) => {
  const res = await axios.post(
    `${BASE}/chat/conversations`,
    { receiverId },
    { headers: headers() }
  )
  return res.data.conversation
}

// Apni saari conversations lo
export const fetchMyConversations = async () => {
  const res = await axios.get(`${BASE}/chat/conversations`, { headers: headers() })
  return res.data.conversations
}

// Messages fetch karo
export const fetchMessages = async (conversationId) => {
  const res = await axios.get(`${BASE}/chat/conversations/${conversationId}/messages`, {
    headers: headers(),
  })
  return res.data.messages
}

// File upload
export const uploadChatFile = async (conversationId, file) => {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('conversationId', conversationId)
  const res = await axios.post(`${BASE}/chat/messages/upload`, formData, {
    headers: { ...headers(), 'Content-Type': 'multipart/form-data' },
  })
  return res.data.message
}
// services/chatApi.js mein add karo
export const sendMessageApi = async (conversationId, content) => {
  const res = await axios.post(
    `${BASE}/chat/messages`,
    { conversationId, content },
    { headers: headers() }
  )

  console.log('sent message response:', res.data.message)
  return res.data.message
}

export const markConversationAsRead = async (conversationId) => {
  const res = await axios.put(
    `${BASE}/chat/conversations/${conversationId}/read`,
    {},
    { headers: headers() }
  )
  return res.data
}