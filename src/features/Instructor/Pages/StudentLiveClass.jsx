import { useState, useRef, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import axios from 'axios'
import {
  FaChevronUp, FaChevronDown, FaPlay, FaUserFriends
} from 'react-icons/fa'
import { BsSend, BsPaperclip } from 'react-icons/bs'

const baseUrl =
  import.meta.env?.VITE_BACKEND_URL ||
  "https://cms-backend-ashen.vercel.app";

// ── Chapter Accordion ─────────────────────────────────────────────────────────
function ChapterAccordion({ title, lessons, defaultOpen }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="flex flex-col">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between py-2.5"
      >
        <span className="text-sm font-bold text-primary">{title}</span>
        <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center shrink-0">
          {open
            ? <FaChevronUp className="w-3 h-3 text-white" />
            : <FaChevronDown className="w-3 h-3 text-white" />
          }
        </div>
      </button>
      {open && (
        <div className="flex flex-col gap-1 pl-1">
          {lessons.map((l) => (
            <div
              key={l._id}
              className="flex items-center gap-3 py-2 px-2 rounded-md hover:bg-white/5 transition-colors"
            >
              <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center shrink-0">
                <FaPlay className="w-2.5 h-2.5 text-white ml-0.5" />
              </div>
              <span className="flex-1 text-sm text-header-text">{l.title}</span>
              <span className="text-xs text-content-text">{l.duration}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ── Live Chat ─────────────────────────────────────────────────────────────────
function LiveChat({ messages, currentUser, onSend }) {
  const [input, setInput] = useState('')
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const send = () => {
    const text = input.trim()
    if (!text) return
    onSend(text)
    setInput('')
  }

  return (
    <div className="flex flex-col gap-3">
      <span className="text-base font-bold text-header-text">Live Chat</span>

      <div className="flex flex-col gap-3 max-h-56 overflow-y-auto pr-1
        [&::-webkit-scrollbar]:w-1
        [&::-webkit-scrollbar-thumb]:rounded-full
        [&::-webkit-scrollbar-thumb]:bg-gray-200
        dark:[&::-webkit-scrollbar-thumb]:bg-white/10"
      >
        {messages.length === 0 ? (
          <p className="text-xs text-center text-content-text opacity-50 py-4">
            No messages yet — say hello! 👋
          </p>
        ) : (
          messages.map((m, index) => {
            const isMe = m.user?._id === currentUser?.id ||
                         m.user === currentUser?.id
            const senderName = isMe ? 'You' :
              `${m.user?.firstName || ''} ${m.user?.lastName || ''}`.trim() || 'Student'

            return (
              <div
                key={m._id || index}
                className={`flex flex-col gap-1 ${isMe ? 'items-end' : 'items-start'}`}
              >
                <span className="text-xs font-semibold text-header-text">
                  {senderName}
                </span>
                <div className={`
                  px-4 py-2.5 rounded-xl text-xs leading-relaxed max-w-[85%]
                  ${isMe
                    ? 'bg-primary text-white rounded-tr-none'
                    : 'bg-gray-100 dark:bg-white/10 text-header-text rounded-tl-none'
                  }
                `}>
                  {m.message}
                </div>
                <span className="text-[10px] text-content-text">
                  {m.sentAt
                    ? new Date(m.sentAt).toLocaleTimeString([], {
                        hour: '2-digit', minute: '2-digit'
                      })
                    : ''
                  }
                </span>
              </div>
            )
          })
        )}
        <div ref={bottomRef} />
      </div>

      <div className="flex items-center gap-2 bg-gray-100 dark:bg-white/5 rounded-md px-3 py-2.5 border border-gray-200 dark:border-white/10 focus-within:border-primary transition-colors">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && send()}
          placeholder="Type a message..."
          className="flex-1 bg-transparent outline-none text-sm text-header-text placeholder:text-content-text"
        />
        <button className="text-content-text hover:text-primary transition-colors">
          <BsPaperclip className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={send}
          className="w-8 h-8 rounded-md bg-primary flex items-center justify-center hover:bg-primary/90 transition-colors shrink-0"
        >
          <BsSend className="w-3.5 h-3.5 text-white" />
        </button>
      </div>
    </div>
  )
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function StudentLiveClass() {
  const { id } = useParams()
  const currentUser = useSelector((state) => state.auth.user)

  const [liveClass, setLiveClass] = useState(null)
  const [chapters, setChapters] = useState([])
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [joined, setJoined] = useState(false)

  const pollingRef = useRef(null)

  // ─── Fetch Live Class ─────────────────────────────
  const fetchLiveClass = async () => {
    try {
      const { data } = await axios.get(`${baseUrl}/api/live-classes/${id}`)
      setLiveClass(data.liveClass)
      setMessages(data.liveClass.chatMessages || [])
    } catch (error) {
      console.error('Error:', error)
    }
  }

  useEffect(() => {
    const init = async () => {
      try {
        setLoading(true)
        await fetchLiveClass()

        // Join live class
        await axios.put(`${baseUrl}/api/live-classes/${id}/join`, {
          userId: currentUser?.id,
        })
        setJoined(true)

        // Chapters + Lessons
        const liveRes = await axios.get(`${baseUrl}/api/live-classes/${id}`)
        const courseId = liveRes.data.liveClass?.course?._id ||
                         liveRes.data.liveClass?.course

        if (courseId) {
          const chapRes = await axios.get(
            `${baseUrl}/api/chapters/course/${courseId}`
          )
          const chaptersWithLessons = await Promise.all(
            chapRes.data.chapters.map(async (ch) => {
              const lesRes = await axios.get(
                `${baseUrl}/api/lessons/chapter/${ch._id}`
              )
              return { ...ch, lessons: lesRes.data.lessons }
            })
          )
          setChapters(chaptersWithLessons)
        }
      } catch (error) {
        console.error('Error:', error)
      } finally {
        setLoading(false)
      }
    }

    if (id && currentUser?.id) init()
  }, [id, currentUser?.id])

  // ─── Polling ──────────────────────────────────────
  useEffect(() => {
    if (!id) return

    pollingRef.current = setInterval(async () => {
      try {
        const { data } = await axios.get(`${baseUrl}/api/live-classes/${id}`)
        setMessages(data.liveClass.chatMessages || [])
        setLiveClass(data.liveClass)
      } catch (err) {
        console.error(err)
      }
    }, 3000)

    return () => clearInterval(pollingRef.current)
  }, [id])

  // ─── Send Chat ────────────────────────────────────
  const handleSendMessage = async (text) => {
    try {
      await axios.post(`${baseUrl}/api/live-classes/${id}/chat`, {
        userId: currentUser?.id,
        message: text,
      })
      await fetchLiveClass()
    } catch (error) {
      console.error('Error sending message:', error)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const isLive = liveClass?.status === 'live'
  const isEnded = liveClass?.status === 'ended'
  const instructor = liveClass?.instructor
  const instrName = instructor?.user
    ? `${instructor.user.firstName} ${instructor.user.lastName}`
    : 'Instructor'

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-[#1E2139]">
      <div className="flex gap-5 items-start">

        {/* LEFT — Video */}
        <div className="flex-1 w-[55%] bg-[#ffffff] dark:bg-[#292D4A] px-5 rounded-md flex flex-col gap-4">

          {/* Title */}
          <div className="rounded-md p-4 flex items-start justify-between gap-3">
            <div className="flex flex-col gap-1">
              <h2 className="text-base font-bold text-header-text">
                {liveClass?.title || 'Live Class'}
              </h2>
              <div className="flex items-center gap-3">
                <span className="text-xs text-content-text">{instrName}</span>
                <div className="flex items-center gap-1.5">
                  <FaUserFriends className="w-3 h-3 text-content-text" />
                  <span className="text-xs text-content-text">
                    {liveClass?.totalStudents || 0} Students
                  </span>
                </div>
              </div>
            </div>

            {/* Status */}
            {isLive && (
              <div className="flex items-center gap-1.5 bg-red-100 rounded-md px-2.5 py-1">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                <span className="text-xs font-bold text-red-600">Live</span>
              </div>
            )}
            {isEnded && (
              <span className="text-xs font-bold text-gray-400 bg-gray-100 px-2.5 py-1 rounded-md">
                Ended
              </span>
            )}
            {liveClass?.status === 'scheduled' && (
              <span className="text-xs font-bold text-yellow-600 bg-yellow-100 px-2.5 py-1 rounded-md">
                Scheduled
              </span>
            )}
          </div>

          {/* Video Stream */}
          <div className="rounded-md overflow-hidden relative">
            {isEnded ? (
              <div className="w-full h-80 bg-gray-900 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-white text-lg font-bold opacity-50">
                    Live session has ended
                  </p>
                  <p className="text-white text-sm opacity-30 mt-1">
                    Thank you for joining!
                  </p>
                </div>
              </div>
            ) : liveClass?.streamUrl ? (
              <iframe
                src={liveClass.streamUrl}
                className="w-full h-80"
                allowFullScreen
                title="Live Stream"
              />
            ) : (
              <div className="w-full h-80 bg-gray-900 flex items-center justify-center">
                <p className="text-white text-sm opacity-50">
                  {isLive ? 'Stream loading...' : 'Waiting for stream to start...'}
                </p>
              </div>
            )}

            {/* Live badge */}
            {isLive && (
              <div className="absolute top-4 left-4 flex items-center gap-1.5 bg-black/50 backdrop-blur-sm rounded-md px-2.5 py-1">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                <span className="text-xs font-semibold text-white">Live</span>
              </div>
            )}
          </div>

          {/* Students row */}
          <div className="rounded-md p-4">
            <div className="flex flex-col gap-1.5">
              <span className="text-xs text-content-text">Students Joined</span>
              <div className="flex items-center">
                {(liveClass?.students || []).slice(0, 5).map((s, i) => (
                  <img
                    key={s._id || i}
                    src={s.profileImage || `https://i.pravatar.cc/32?img=${i + 1}`}
                    alt=""
                    className="w-8 h-8 rounded-full object-cover border-2 border-white dark:border-[#292D4A]"
                    style={{ marginLeft: i === 0 ? 0 : -8 }}
                  />
                ))}
                {liveClass?.totalStudents > 5 && (
                  <div
                    className="w-8 h-8 rounded-full bg-primary flex items-center justify-center border-2 border-white dark:border-[#292D4A]"
                    style={{ marginLeft: -8 }}
                  >
                    <span className="text-[9px] font-bold text-white">
                      {liveClass.totalStudents - 5}+
                    </span>
                  </div>
                )}
                {(!liveClass?.students || liveClass.students.length === 0) && (
                  <span className="text-xs text-content-text opacity-50">
                    No students yet
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT — Course Content + Chat */}
        <div className="w-[40%] flex flex-col gap-5">

          {/* Course Content */}
          <div className="bg-[#ffffff] dark:bg-[#292D4A] px-5 rounded-md flex flex-col gap-2">
            <span className="font-bold text-header-text mt-4">Courses Content</span>
            {chapters.length === 0 ? (
              <p className="text-xs text-content-text py-4">No content available</p>
            ) : (
              <div className="flex flex-col divide-y divide-gray-100 dark:divide-white/10">
                {chapters.map((ch, i) => (
                  <ChapterAccordion
                    key={ch._id}
                    title={ch.title}
                    lessons={ch.lessons || []}
                    defaultOpen={i === 0}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Live Chat */}
          <div className="bg-[#ffffff] dark:bg-[#292D4A] rounded-md p-5">
            <LiveChat
              messages={messages}
              currentUser={currentUser}
              onSend={handleSendMessage}
            />
          </div>
        </div>
      </div>
    </div>
  )
}