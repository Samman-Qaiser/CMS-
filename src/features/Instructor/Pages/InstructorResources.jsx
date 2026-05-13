// InstructorResources.jsx
import { useState } from 'react'
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaChevronRight, FaChevronLeft, FaChevronDown, FaChevronUp } from 'react-icons/fa'
import BlogCard from '../Components/BlogCard'

// ── Static Data ───────────────────────────────────────────────────────────────
const ALL_BLOGS = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&q=80',
    title: 'Here 10 Tips to become better in UI/UX Design.',
    excerpt: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    author: 'Admin',
    date: '2 January 2022',
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=600&q=80',
    title: 'Best 10 font pairing for web design with example.',
    excerpt: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    author: 'Admin',
    date: '2 January 2022',
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&q=80',
    title: 'Create A Real-Time E-Commerce App With React Native',
    excerpt: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    author: 'Admin',
    date: '2 January 2022',
  },
  {
    id: 4,
    image: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=600&q=80',
    title: 'How to build scalable backend with Node.js and MongoDB.',
    excerpt: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    author: 'Admin',
    date: '5 January 2022',
  },
  {
    id: 5,
    image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=600&q=80',
    title: 'Top 5 VS Code extensions every developer should use.',
    excerpt: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    author: 'Admin',
    date: '8 January 2022',
  },
  {
    id: 6,
    image: 'https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=600&q=80',
    title: 'Understanding React hooks — a beginner guide.',
    excerpt: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    author: 'Admin',
    date: '10 January 2022',
  },
]

const FAQS = [
  { id: 1, q: 'Is there a free trial?',             a: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.' },
  { id: 2, q: 'How do I get payment?',              a: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.' },
  { id: 3, q: 'Can I rewatch the live courses?',    a: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.' },
  { id: 4, q: 'What different Free account and Premium?', a: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.' },
]

const PAGE_SIZE  = 3
const TOTAL_DATA = 106

// ── FAQ Accordion Item ────────────────────────────────────────────────────────
function FaqItem({ q, a, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="border border-gray-100 dark:border-white/10 rounded-md overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors duration-200"
      >
        <span className={`text-sm font-semibold text-left ${open ? 'text-primary' : 'text-header-text'}`}>
          {q}
        </span>
        <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ml-3 ${open ? 'bg-primary' : 'bg-primary/15'}`}>
          {open
            ? <FaChevronUp className="w-2.5 h-2.5 text-white" />
            : <FaChevronDown className="w-2.5 h-2.5 text-primary" />
          }
        </div>
      </button>
      {open && (
        <div className="px-4 pb-4">
          <p className="text-xs text-content-text leading-relaxed">{a}</p>
        </div>
      )}
    </div>
  )
}

// ── Pagination ────────────────────────────────────────────────────────────────
function Pagination({ page, totalPages, onChange }) {
  const visiblePages = Array.from({ length: Math.min(totalPages, 3) }, (_, i) => i + 1)
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-content-text mr-2">
        Showing 1-{PAGE_SIZE} from {TOTAL_DATA} data
      </span>
      <button
        onClick={() => onChange(Math.max(1, page - 1))}
        disabled={page === 1}
        className="w-8 h-8 rounded-md bg-gray-100 dark:bg-white/5 flex items-center justify-center hover:bg-primary hover:text-white transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed text-content-text"
      >
        <FaChevronLeft className="w-3 h-3" />
      </button>
      {visiblePages.map((p) => (
        <button
          key={p}
          onClick={() => onChange(p)}
          className={`
            w-8 h-8 rounded-md text-xs font-bold transition-all duration-200
            ${page === p
              ? 'bg-primary text-white shadow-md'
              : 'bg-gray-100 dark:bg-white/5 text-content-text hover:bg-primary hover:text-white'
            }
          `}
        >
          {p}
        </button>
      ))}
      <button
        onClick={() => onChange(Math.min(totalPages, page + 1))}
        disabled={page === totalPages}
        className="w-8 h-8 rounded-md bg-gray-100 dark:bg-white/5 flex items-center justify-center hover:bg-primary hover:text-white transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed text-content-text"
      >
        <FaChevronRight className="w-3 h-3" />
      </button>
    </div>
  )
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function InstructorResources() {
  const [page, setPage] = useState(1)
  const totalPages = Math.ceil(ALL_BLOGS.length / PAGE_SIZE)
  const paginated  = ALL_BLOGS.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-[#1E2139] ">
      <div className="flex flex-col gap-5">

        <h2 className="text-xl font-bold text-header-text">Blogs</h2>

        <div className="flex gap-5 items-start">

          {/* ── LEFT: Blog list + Pagination ── */}
          <div className="flex-1 min-w-0 flex flex-col gap-5">
            <div className="bg-[#ffffff] dark:bg-[#292D4A] rounded-md p-5 flex flex-col gap-5">
              {paginated.map((blog) => (
                <BlogCard key={blog.id} {...blog} />
              ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-center">
              <Pagination page={page} totalPages={totalPages} onChange={setPage} />
            </div>
          </div>

          {/* ── RIGHT: Contact + FAQs ── */}
          <div className="w-72 shrink-0 flex flex-col gap-5">

            {/* Contact Card */}
            <div className="bg-primary rounded-md p-5 flex flex-col gap-4">
              <span className="text-base font-bold text-white">Contact</span>
              <div className="flex flex-col gap-3">
                <div className="flex items-start gap-3">
                  <FaMapMarkerAlt className="w-4 h-4 text-white/80 mt-0.5 shrink-0" />
                  <span className="text-sm text-white/90 leading-relaxed">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <FaPhone className="w-4 h-4 text-white/80 shrink-0" />
                  <span className="text-sm text-white/90">+1234567890</span>
                </div>
                <div className="flex items-center gap-3">
                  <FaEnvelope className="w-4 h-4 text-white/80 shrink-0" />
                  <span className="text-sm text-white/90">lovia@support.com</span>
                </div>
              </div>
            </div>

            {/* FAQs */}
            <div className="flex flex-col gap-3">
              <span className="text-base font-bold text-header-text">FAQS</span>
              <div className="flex flex-col gap-2">
                {FAQS.map((f, i) => (
                  <FaqItem key={f.id} q={f.q} a={f.a} defaultOpen={i === 0} />
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}
