// PostReplyModal.jsx
import { useState } from 'react'
import { FaTimes } from 'react-icons/fa'

export default function PostReplyModal({ onClose, onSubmit }) {
  const [message, setMessage] = useState('')

  const handleSubmit = () => {
    if (!message.trim()) return
    onSubmit?.(message)
    setMessage('')
    onClose?.()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-[#ffffff] dark:bg-[#292D4A] rounded-md w-full max-w-lg mx-4 shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-white/10">
          <span className="text-base font-bold text-header-text">Post Reply</span>
          <button
            onClick={onClose}
            className="text-content-text hover:text-header-text transition-colors duration-200"
          >
            <FaTimes className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Message"
            rows={6}
            className="
              w-full bg-gray-50 dark:bg-white/5
              border border-gray-200 dark:border-white/10
              rounded-md px-4 py-3 text-sm text-header-text
              placeholder:text-content-text
              outline-none focus:border-primary focus:ring-1 focus:ring-primary/30
              resize-y transition-all duration-200
            "
          />
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-5 py-4 border-t border-gray-100 dark:border-white/10">
          <button
            onClick={onClose}
            className="bg-primary text-white text-sm font-semibold px-5 py-2.5 rounded-md hover:bg-primary/90 transition-colors duration-200"
          >
            btn-close
          </button>
          <button
            onClick={handleSubmit}
            className="bg-primary text-white text-sm font-semibold px-5 py-2.5 rounded-md hover:bg-primary/90 transition-colors duration-200"
          >
            Reply
          </button>
        </div>
      </div>
    </div>
  )
}
