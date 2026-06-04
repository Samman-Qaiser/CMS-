// InstructorResources.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaChevronRight,
  FaChevronLeft,
  FaChevronDown,
  FaChevronUp,
  FaComment,
} from "react-icons/fa";
import BlogCard from "../Components/BlogCard";
import axios from "axios";

const baseUrl =
  import.meta.env?.VITE_BACKEND_URL || "https://cms-backend-ashen.vercel.app";

// ── Comment Modal Component ─────────────────────────────────────────────────────
function CommentModal({ blog, isOpen, onClose, onCommentAdded }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim() || !email.trim() || !content.trim()) {
      setError("Please enter your name, email, and comment");
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const response = await axios.post(`${baseUrl}/api/comments`, {
        blog: blog._id, // This matches your schema (blog, not blogId)
        name: name.trim(),
        email: email.trim().toLowerCase(),
        content: content.trim(),
        status: "pending", // Default status as per your schema
      });

      if (response.data) {
        // Reset form
        setName("");
        setEmail("");
        setContent("");
        onCommentAdded(response.data);
        onClose();
      }
    } catch (error) {
      console.error("Error adding comment:", error);
      setError(
        error.response?.data?.message ||
          "Failed to add comment. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-[#292D4A] rounded-md max-w-md w-full p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-header-text">
            Add Comment to "{blog.title}"
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-content-text mb-2">
              Your Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-[#1E2139] text-header-text focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Enter your name"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-content-text mb-2">
              Your Email *
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-[#1E2139] text-header-text focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Enter your email"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-content-text mb-2">
              Your Comment *
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows="4"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-[#1E2139] text-header-text focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Write your comment here..."
              required
            />
          </div>

          {error && <div className="text-red-500 text-sm">{error}</div>}

          <div className="flex gap-3 justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10 rounded-md transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-primary/90 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Adding..." : "Add Comment"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Success Toast Component ────────────────────────────────────────────────────
function SuccessToast({ message, onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-green-500 text-white px-4 py-2 rounded-md shadow-lg animate-fade-in-up">
      {message}
    </div>
  );
}

// ── FAQ Accordion Item ────────────────────────────────────────────────────────
function FaqItem({ q, a, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border border-gray-100 dark:border-white/10 rounded-md overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors duration-200"
      >
        <span
          className={`text-sm font-semibold text-left ${open ? "text-primary" : "text-header-text"}`}
        >
          {q}
        </span>
        <div
          className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ml-3 ${open ? "bg-primary" : "bg-primary/15"}`}
        >
          {open ? (
            <FaChevronUp className="w-2.5 h-2.5 text-white" />
          ) : (
            <FaChevronDown className="w-2.5 h-2.5 text-primary" />
          )}
        </div>
      </button>
      {open && (
        <div className="px-4 pb-4">
          <p className="text-xs text-content-text leading-relaxed">{a}</p>
        </div>
      )}
    </div>
  );
}

// ── Pagination ────────────────────────────────────────────────────────────────
function Pagination({ page, totalPages, onChange }) {
  const visiblePages = Array.from(
    { length: Math.min(totalPages, 3) },
    (_, i) => i + 1,
  );
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
            ${
              page === p
                ? "bg-primary text-white shadow-md"
                : "bg-gray-100 dark:bg-white/5 text-content-text hover:bg-primary hover:text-white"
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
  );
}

// ── Updated BlogCard with Comment Button ──────────────────────────────────────
function BlogCardWithComment({ blog, onCommentClick }) {
  const navigate = useNavigate();

  const handleBlogClick = () => {
    navigate(`/dashboard/blog/${blog._id}`);
  };

  return (
    <div className="relative">
      <div onClick={handleBlogClick} className="cursor-pointer">
        <BlogCard
          image={blog.featuredImage}
          title={blog.title}
          excerpt={blog.excerpt}
          author={blog.author?.firstName || "Admin"}
          date={
            blog.publishedAt
              ? new Date(blog.publishedAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })
              : "Recent"
          }
        />
      </div>
      <div className="mt-2 flex justify-end">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onCommentClick(blog);
          }}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-primary bg-primary/10 hover:bg-primary/20 rounded-md transition-all duration-200"
        >
          <FaComment className="w-4 h-4" />
          Add Comment
        </button>
      </div>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function InstructorResources() {
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [adminData, setAdminData] = useState(null);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const PAGE_SIZE = 3;

  // Fetch blogs from backend
  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${baseUrl}/api/blogs`);

      if (response.data.success && response.data.blogs) {
        // Filter only published blogs and sort by date
        const publishedBlogs = response.data.blogs
          .filter((blog) => blog.status === "published")
          .sort(
            (a, b) =>
              new Date(b.publishedAt || b.createdAt) -
              new Date(a.publishedAt || a.createdAt),
          );

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
        params: { role: "admin" },
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

  const handleCommentClick = (blog) => {
    setSelectedBlog(blog);
    setIsModalOpen(true);
  };

  const handleCommentAdded = (newComment) => {
    setToastMessage(
      "Comment added successfully! It will appear after admin approval.",
    );
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
                  <p className="text-content-text">
                    No published blogs available.
                  </p>
                </div>
              ) : (
                paginatedBlogs.map((blog) => (
                  <BlogCardWithComment
                    key={blog._id}
                    blog={blog}
                    onCommentClick={handleCommentClick}
                  />
                ))
              )}
            </div>

            {/* Pagination */}
            {blogs.length > PAGE_SIZE && (
              <div className="flex justify-center">
                <Pagination
                  page={page}
                  totalPages={totalPages}
                  onChange={setPage}
                />
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
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                    do eiusmod tempor
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <FaPhone className="w-4 h-4 text-white/80 shrink-0" />
                  <span className="text-sm text-white/90">
                    {adminData?.phone || "+1234567890"}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <FaEnvelope className="w-4 h-4 text-white/80 shrink-0" />
                  <span className="text-sm text-white/90">
                    {adminData?.email || "lovia@support.com"}
                  </span>
                </div>
              </div>
            </div>

            {/* FAQs */}
            <div className="flex flex-col gap-3">
              <span className="text-base font-bold text-header-text">FAQS</span>
              <div className="flex flex-col gap-2">
                <FaqItem
                  q="Is there a free trial?"
                  a="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
                  defaultOpen={true}
                />
                <FaqItem
                  q="How do I get payment?"
                  a="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt."
                />
                <FaqItem
                  q="Can I rewatch the live courses?"
                  a="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt."
                />
                <FaqItem
                  q="What different Free account and Premium?"
                  a="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt."
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Comment Modal */}
      <CommentModal
        blog={selectedBlog}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedBlog(null);
        }}
        onCommentAdded={handleCommentAdded}
      />

      {/* Success Toast */}
      {toastMessage && (
        <SuccessToast
          message={toastMessage}
          onClose={() => setToastMessage("")}
        />
      )}
    </div>
  );
}
