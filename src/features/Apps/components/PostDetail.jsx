// PostDetail.jsx
import { useState } from 'react'
import { FaUser, FaCalendarAlt, FaThumbsUp } from 'react-icons/fa'

const SKILLS = ['Admin', 'Dashboard', 'Photoshop', 'Bootstrap', 'Responsive', 'Crypto']

const POST = {
  title:   'Collection of textile samples lay spread',
  author:  'Admin',
  date:    '08 Nov 2022',
  likes:   20,
  image:   'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&q=80',
  content: [
    'A wonderful serenity has taken possession of my entire soul, like these sweet mornings of spring which I enjoy with my whole heart. A wonderful serenity has taken possession of my entire soul, like these sweet mornings of spring which I enjoy with my whole heart.',
    'A collection of textile samples lay spread out on the table – Samsa was a travelling salesman – and above it there hung a picture that he had recently cut out of an illustrated magazine and housed in a nice, gilded frame.',
    'Lorem ipsum is simply dummy text of the printing and typesetting industry. Lorem ipsum has been the industry\'s standard text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen brochure.',
    'A wonderful serenity has taken possession of my entire soul, like these sweet mornings of spring which I enjoy with my whole heart. I am alone, and feel the charm of existence was created for the bliss of souls like mine. I am so happy, my dear friend, so absorbed in the exquisite sense of mere tranquil existence, that I neglect my talents.',
  ],
}

export default function PostDetail() {
  const [form, setForm] = useState({ name: '', email: '', comment: '' })
  const [submitted, setSubmitted] = useState(false)

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  const handleSubmit = () => {
    if (!form.name.trim() || !form.comment.trim()) return
    setSubmitted(true)
    setForm({ name: '', email: '', comment: '' })
    setTimeout(() => setSubmitted(false), 3000)
  }

  return (
    <div className="bg-[#ffffff] dark:bg-[#292D4A] rounded-md p-6 flex flex-col gap-6">

      {/* ── Title + Meta ── */}
      <div className="flex flex-col gap-2">
        <h1 className="text-lg font-bold text-header-text leading-snug">
          {POST.title}
        </h1>
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-1.5">
            <FaUser className="w-3 h-3 text-primary" />
            <span className="text-xs text-content-text">By {POST.author}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <FaCalendarAlt className="w-3 h-3 text-primary" />
            <span className="text-xs text-content-text">{POST.date}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <FaThumbsUp className="w-3 h-3 text-primary" />
            <span className="text-xs text-content-text">{POST.likes}</span>
          </div>
        </div>
      </div>

      {/* ── Featured Image ── */}
      <img
        src={POST.image}
        alt={POST.title}
        className="w-full h-64 object-cover rounded-md"
      />

      {/* ── Content ── */}
      <div className="flex flex-col gap-3">
        {POST.content.map((para, i) => (
          <p key={i} className="text-xs text-content-text leading-relaxed">{para}</p>
        ))}
      </div>

      {/* Divider */}
      <div className="border-t border-gray-100 dark:border-white/10" />

      {/* ── Skills ── */}
      <div className="flex flex-col gap-3">
        <h3 className="text-sm font-bold text-header-text">Skills</h3>
        <div className="flex flex-wrap gap-2">
          {SKILLS.map((skill) => (
            <span
              key={skill}
              className="text-xs font-medium text-header-text bg-gray-100 dark:bg-white/10 px-3 py-1.5 rounded-md border border-gray-200 dark:border-white/10 hover:border-primary hover:text-primary transition-colors duration-200 cursor-default"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-100 dark:border-white/10" />

      {/* ── Leave a Reply ── */}
      <div className="flex flex-col gap-4">
        <h3 className="text-sm font-bold text-header-text">Leave a Reply</h3>

        {/* Name + Email */}
        <div className="flex gap-4">
          <div className="flex flex-col gap-1.5 flex-1 min-w-0">
            <label className="text-xs font-semibold text-header-text">
              Name <span className="text-primary">*</span>
            </label>
            <input
              type="text"
              placeholder="Author"
              value={form.name}
              onChange={set('name')}
              className="
                w-full bg-gray-50 dark:bg-white/5
                border border-gray-200 dark:border-white/10
                rounded-md px-3 py-2.5 text-sm text-header-text
                placeholder:text-content-text
                outline-none focus:border-primary focus:ring-1 focus:ring-primary/30
                transition-all duration-200
              "
            />
          </div>
          <div className="flex flex-col gap-1.5 flex-1 min-w-0">
            <label className="text-xs font-semibold text-header-text">
              Email <span className="text-primary">*</span>
            </label>
            <input
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={set('email')}
              className="
                w-full bg-gray-50 dark:bg-white/5
                border border-gray-200 dark:border-white/10
                rounded-md px-3 py-2.5 text-sm text-header-text
                placeholder:text-content-text
                outline-none focus:border-primary focus:ring-1 focus:ring-primary/30
                transition-all duration-200
              "
            />
          </div>
        </div>

        {/* Comment */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-header-text">Comment</label>
          <textarea
            placeholder="Comment"
            value={form.comment}
            onChange={set('comment')}
            rows={5}
            className="
              w-full bg-gray-50 dark:bg-white/5
              border border-gray-200 dark:border-white/10
              rounded-md px-3 py-2.5 text-sm text-header-text
              placeholder:text-content-text
              outline-none focus:border-primary focus:ring-1 focus:ring-primary/30
              resize-y transition-all duration-200
            "
          />
        </div>

        {/* Success message */}
        {submitted && (
          <div className="bg-teal-500/10 border border-teal-500/30 rounded-md px-4 py-2.5">
            <span className="text-xs font-semibold text-teal-500">Comment posted successfully!</span>
          </div>
        )}

        {/* Submit */}
        <div>
          <button
            onClick={handleSubmit}
            className="bg-primary text-white text-sm font-semibold px-6 py-2.5 rounded-md hover:bg-primary/90 transition-colors duration-200"
          >
            Post Comment
          </button>
        </div>
      </div>
    </div>
  )
}
