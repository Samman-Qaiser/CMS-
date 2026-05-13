// InstructorLiveClass.jsx
import { useState, useRef, useEffect } from 'react'
import {
  FaMicrophone, FaVideo, FaStop, FaPaperclip,
  FaUserFriends, FaChevronUp, FaChevronDown, FaPlay
} from 'react-icons/fa'
import { BsThreeDots, BsSend } from 'react-icons/bs'

// ── Static Data ───────────────────────────────────────────────────────────────
const STUDENTS = [
  { id: 1, avatar: 'https://i.pravatar.cc/32?img=1' },
  { id: 2, avatar: 'https://i.pravatar.cc/32?img=2' },
  { id: 3, avatar: 'https://i.pravatar.cc/32?img=3' },
  { id: 4, avatar: 'https://i.pravatar.cc/32?img=4' },
  { id: 5, avatar: 'https://i.pravatar.cc/32?img=5' },
]

const CHAPTERS = [
  {
    id: 1,
    title: 'Chapter 1: Intro',
    defaultOpen: true,
    lessons: [
      { id: 1, title: 'Introduction',  duration: '1:00', unlocked: true },
      { id: 2, title: 'Tools & Plugins', duration: '1:00', unlocked: true },
    ],
  },
  {
    id: 2,
    title: 'Chapter 2: Basic HTML',
    defaultOpen: false,
    lessons: [
      { id: 3, title: 'HTML Structure', duration: '1:00', unlocked: false },
      { id: 4, title: 'HTML Tags',      duration: '1:00', unlocked: false },
    ],
  },
]

const INIT_MESSAGES = [
  { id: 1, sender: 'Samantha', text: 'Lorem ipsum dolor sit amet ut labore et',   time: '12:45 PM', isMe: false },
  { id: 2, sender: 'You',      text: 'Lorem ipsum dolor sit amet ut labore et',   time: '9:30 AM',  isMe: true  },
]

// ── Chapter Accordion ─────────────────────────────────────────────────────────
function ChapterAccordion({ title, lessons, defaultOpen }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="flex flex-col">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between py-2.5 transition-colors duration-200"
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
            <div key={l.id} className="flex items-center gap-3 py-2 px-2 rounded-md hover:bg-white/5 transition-colors duration-150">
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
function LiveChat() {
  const [messages, setMessages] = useState(INIT_MESSAGES)
  const [input, setInput]       = useState('')
  const bottomRef               = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const send = () => {
    const text = input.trim()
    if (!text) return
    setMessages((prev) => [
      ...prev,
      {
        id:     Date.now(),
        sender: 'You',
        text,
        time:   new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isMe:   true,
      },
    ])
    setInput('')
  }

  return (
    <div className="flex flex-col gap-3">
      <span className="text-base font-bold text-header-text">Live Chat</span>

      {/* Messages */}
      <div className="flex flex-col gap-3 max-h-56 overflow-y-auto pr-1
        [&::-webkit-scrollbar]:w-1
        [&::-webkit-scrollbar-track]:transparent
        [&::-webkit-scrollbar-thumb]:rounded-full
        [&::-webkit-scrollbar-thumb]:bg-gray-200
        dark:[&::-webkit-scrollbar-thumb]:bg-white/10"
      >
        {messages.map((m) => (
          <div key={m.id} className={`flex flex-col gap-1 ${m.isMe ? 'items-end' : 'items-start'}`}>
            <span className="text-xs font-semibold text-header-text">{m.sender}</span>
            <div className={`
              px-4 py-2.5 rounded-xl text-xs leading-relaxed max-w-[85%]
              ${m.isMe
                ? 'bg-primary text-white rounded-tr-none'
                : 'bg-gray-100 dark:bg-white/10 text-header-text rounded-tl-none'
              }
            `}>
              {m.text}
            </div>
            <span className="text-[10px] text-content-text">{m.time}</span>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="flex items-center gap-2 bg-gray-100 dark:bg-white/5 rounded-md px-3 py-2.5 border border-gray-200 dark:border-white/10 focus-within:border-primary transition-colors duration-200">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && send()}
          placeholder="Hello Hanuman..."
          className="flex-1 bg-transparent outline-none text-sm text-header-text placeholder:text-content-text"
        />
        <button className="text-content-text hover:text-primary transition-colors duration-200">
          <FaPaperclip className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={send}
          className="w-8 h-8 rounded-md bg-primary flex items-center justify-center hover:bg-primary/90 transition-colors duration-200 shrink-0"
        >
          <BsSend className="w-3.5 h-3.5 text-white" />
        </button>
      </div>
    </div>
  )
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function InstructorLiveClass() {
  const [muted,   setMuted]   = useState(false)
  const [camOff,  setCamOff]  = useState(false)
  const [live,    setLive]    = useState(true)

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-[#1E2139]">
      <div className="flex gap-5 items-start">

        {/* ══════════ LEFT — Video + Controls ══════════ */}
        <div className="flex-1 w-[50%] bg-[#ffffff] dark:bg-[#292D4A] px-5 rounded-md flex flex-col gap-4">

          {/* Title row */}
          <div className="rounded-md p-4 flex items-start justify-between gap-3">
            <div className="flex flex-col gap-1">
              <h2 className="text-base font-bold text-header-text">Full-Stack Web Developer</h2>
              <div className="flex items-center gap-3">
                <span className="text-xs text-content-text">Angelina Crispy</span>
                <div className="flex items-center gap-1.5">
                  <FaUserFriends className="w-3 h-3 text-content-text" />
                  <span className="text-xs text-content-text">10k Students</span>
                </div>
              </div>
            </div>
            <button className="text-content-text hover:text-header-text transition-colors duration-200">
              <BsThreeDots className="w-4 h-4" />
            </button>
          </div>

          {/* Video */}
          <div className=" object-top rounded-md overflow-hidden relative">
            <img
              src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=700&q=80"
              alt="Live class"
              className="w-full h-80 object-top object-cover"
            />
            {/* Live badge */}
            {live && (
              <div className="absolute top-4 left-4 flex items-center gap-1.5 bg-black/50 backdrop-blur-sm rounded-md px-2.5 py-1">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                <span className="text-xs font-semibold text-white">Live</span>
              </div>
            )}
          </div>

          {/* Students row + Controls */}
          <div className=" rounded-md p-4 flex items-center justify-between gap-4">
            {/* Students avatars */}
            <div className="flex flex-col gap-1.5">
              <span className="text-xs text-content-text">Students</span>
              <div className="flex items-center">
                {STUDENTS.map((s, i) => (
                  <img
                    key={s.id}
                    src={s.avatar}
                    alt=""
                    className="w-8 h-8 rounded-full object-cover border-2 border-white dark:border-[#292D4A]"
                    style={{ marginLeft: i === 0 ? 0 : -8 }}
                  />
                ))}
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center border-2 border-white dark:border-[#292D4A]"
                  style={{ marginLeft: -8 }}>
                  <span className="text-[9px] font-bold text-white">9+</span>
                </div>
              </div>
            </div>

            {/* Control buttons */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMuted(!muted)}
                className={`w-10 h-10 rounded-md flex items-center justify-center transition-colors duration-200
                  ${muted ? 'bg-gray-200 dark:bg-white/10 text-content-text' : 'bg-primary/10 text-primary'}`}
              >
                <FaMicrophone className="w-4 h-4" />
              </button>
              <button className="w-10 h-10 rounded-md bg-primary/10 text-primary flex items-center justify-center hover:bg-primary/20 transition-colors duration-200">
                <FaVideo className="w-4 h-4" />
              </button>
              <button className="w-10 h-10 rounded-md bg-primary/10 text-primary flex items-center justify-center hover:bg-primary/20 transition-colors duration-200">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M4 5h16v10H4V5zm0 12h7v2H4v-2zm9 0h7v2h-7v-2z"/>
                </svg>
              </button>
              <button
                onClick={() => setLive(!live)}
                className="w-10 h-10 rounded-md bg-primary flex items-center justify-center hover:bg-primary/90 transition-colors duration-200"
              >
                <FaStop className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>
        </div>

        {/* ══════════ RIGHT — Courses Content + Live Chat ══════════ */}
        <div className="w-[40%]  flex flex-col gap-5">

          {/* Courses Content */}
          <div className=" bg-[#ffffff] dark:bg-[#292D4A] px-5 rounded-md  flex flex-col gap-2">
            <span className="font-bold text-header-text mt-4">Courses Content</span>
            <div className="flex flex-col divide-y divide-gray-100 dark:divide-white/10">
              {CHAPTERS.map((ch) => (
                <ChapterAccordion key={ch.id} {...ch} />
              ))}
            </div>
          </div>

          {/* Live Chat */}
          <div className="bg-[#ffffff] dark:bg-[#292D4A] rounded-md p-5">
            <LiveChat />
          </div>

        </div>
      </div>
    </div>
  )
}
