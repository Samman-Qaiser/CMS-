// InstructorResources.jsx
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaChevronRight, FaChevronLeft, FaChevronDown, FaChevronUp } from 'react-icons/fa'
import BlogCard from '../Components/BlogCard'
import axios from 'axios'

const baseUrl = import.meta.env?.VITE_BACKEND_URL || "https://cms-backend-ashen.vercel.app";

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
        Showing 1-3 from {totalPages * 3} data
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

// ── Main Component ────────────────────────────────────────────────────────────
export default function InstructorResources() {
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [adminData, setAdminData] = useState(null);

  const PAGE_SIZE = 3;

  // Fetch blogs from backend
  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${baseUrl}/api/blogs`);
      
      if (response.data.success && response.data.blogs) {
        // Filter only published blogs and sort by date
        const publishedBlogs = response.data.blogs
          .filter(blog => blog.status === 'published')
          .sort((a, b) => new Date(b.publishedAt || b.createdAt) - new Date(a.publishedAt || a.createdAt));
        
        setBlogs(publishedBlogs);
      }
    } catch (error) {
      console.error("Error fetching blogs:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch admin contact info
  const fetchAdminInfo = async () => {
    try {
      const response = await axios.get(`${baseUrl}/api/users`, {
        params: { role: 'admin' }
      });
      
      if (response.data.success && response.data.users) {
        const admin = response.data.users[0];
        setAdminData(admin);
      }
    } catch (error) {
      console.error("Error fetching admin info:", error);
    }
  };

  useEffect(() => {
    fetchBlogs();
    fetchAdminInfo();
  }, []);

  const handleBlogClick = (blogId) => {
    navigate(`/dashboard/blog/${blogId}`);
  };

  const totalPages = Math.ceil(blogs.length / PAGE_SIZE);
  const paginatedBlogs = blogs.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-[#1E2139] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-500">Loading resources...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-[#1E2139]">
      <div className="flex flex-col gap-5">

        <h2 className="text-xl font-bold text-header-text">Blogs</h2>

        <div className="flex gap-5 items-start">

          {/* ── LEFT: Blog list + Pagination ── */}
          <div className="flex-1 min-w-0 flex flex-col gap-5">
            <div className="bg-[#ffffff] dark:bg-[#292D4A] rounded-md p-5 flex flex-col gap-5">
              {paginatedBlogs.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-content-text">No published blogs available.</p>
                </div>
              ) : (
                paginatedBlogs.map((blog) => (
                  <div key={blog._id} onClick={() => handleBlogClick(blog._id)} className="cursor-pointer">
                    <BlogCard 
                      image={blog.featuredImage}
                      title={blog.title}
                      excerpt={blog.excerpt}
                      author={blog.author?.firstName || 'Admin'}
                      date={blog.publishedAt ? new Date(blog.publishedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'Recent'}
                    />
                  </div>
                ))
              )}
            </div>

            {/* Pagination */}
            {blogs.length > PAGE_SIZE && (
              <div className="flex justify-center">
                <Pagination page={page} totalPages={totalPages} onChange={setPage} />
              </div>
            )}
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
                  <span className="text-sm text-white/90">{adminData?.phone || "+1234567890"}</span>
                </div>
                <div className="flex items-center gap-3">
                  <FaEnvelope className="w-4 h-4 text-white/80 shrink-0" />
                  <span className="text-sm text-white/90">{adminData?.email || "lovia@support.com"}</span>
                </div>
              </div>
            </div>

            {/* FAQs */}
            <div className="flex flex-col gap-3">
              <span className="text-base font-bold text-header-text">FAQS</span>
              <div className="flex flex-col gap-2">
                <FaqItem q="Is there a free trial?" a="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua." defaultOpen={true} />
                <FaqItem q="How do I get payment?" a="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt." />
                <FaqItem q="Can I rewatch the live courses?" a="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt." />
                <FaqItem q="What different Free account and Premium?" a="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt." />
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}