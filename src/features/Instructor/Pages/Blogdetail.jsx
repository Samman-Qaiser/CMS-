// BlogDetail.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  FaArrowLeft,
  FaCalendar,
  FaUser,
  FaTag,
  FaShare,
  FaComment,
  FaSpinner,
} from "react-icons/fa";
import axios from "axios";

const baseUrl =
  import.meta.env?.VITE_BACKEND_URL || "https://cms-backend-ashen.vercel.app";

export default function BlogDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [comments, setComments] = useState([]);
  const [loadingComments, setLoadingComments] = useState(false);
  const [addingComment, setAddingComment] = useState(false);
  const [commentForm, setCommentForm] = useState({
    name: "",
    email: "",
    content: "",
  });
  const [commentError, setCommentError] = useState("");
  const [commentSuccess, setCommentSuccess] = useState("");

  // Fetch blog details
  useEffect(() => {
    const fetchBlog = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${baseUrl}/api/blogs/${id}`);

        if (response.data.success && response.data.blog) {
          setBlog(response.data.blog);
        } else {
          setError("Blog not found");
        }
      } catch (err) {
        console.error("Error fetching blog:", err);
        setError("Failed to load blog");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchBlog();
    }
  }, [id]);

  // Fetch comments for this blog
  const fetchComments = async () => {
    try {
      setLoadingComments(true);
      const response = await axios.get(`${baseUrl}/api/comments`, {
        params: { blog: id, status: "approved" },
      });

      if (response.data.success && response.data.comments) {
        setComments(response.data.comments);
      } else if (response.data) {
        // Handle case where response might be directly the array
        setComments(Array.isArray(response.data) ? response.data : []);
      }
    } catch (err) {
      console.error("Error fetching comments:", err);
      setComments([]);
    } finally {
      setLoadingComments(false);
    }
  };

  // Fetch comments when blog loads
  useEffect(() => {
    if (id) {
      fetchComments();
    }
  }, [id]);

  const formatDate = (dateString) => {
    if (!dateString) return "Recent";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatCommentDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();

    if (
      !commentForm.name.trim() ||
      !commentForm.email.trim() ||
      !commentForm.content.trim()
    ) {
      setCommentError("Please fill in all fields");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(commentForm.email)) {
      setCommentError("Please enter a valid email address");
      return;
    }

    setAddingComment(true);
    setCommentError("");

    try {
      const response = await axios.post(`${baseUrl}/api/comments`, {
        blog: id,
        name: commentForm.name.trim(),
        email: commentForm.email.trim().toLowerCase(),
        content: commentForm.content.trim(),
        status: "pending",
      });

      if (response.data) {
        setCommentSuccess(
          "Comment submitted successfully! It will appear after admin approval.",
        );
        setCommentForm({ name: "", email: "", content: "" });
        // Refresh comments to show newly added pending comment (optional)
        fetchComments();

        // Clear success message after 5 seconds
        setTimeout(() => setCommentSuccess(""), 5000);
      }
    } catch (err) {
      console.error("Error adding comment:", err);
      setCommentError(
        err.response?.data?.message ||
          "Failed to add comment. Please try again.",
      );
    } finally {
      setAddingComment(false);
    }
  };

  const handleInputChange = (e) => {
    setCommentForm({
      ...commentForm,
      [e.target.name]: e.target.value,
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-[#1E2139] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-500">Loading blog...</p>
        </div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-[#1E2139] flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500">{error || "Blog not found"}</p>
          <button
            onClick={() => navigate("/dashboard/instructor-resources")}
            className="mt-4 px-4 py-2 bg-primary text-white rounded-lg"
          >
            Back to Resources
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-[#1E2139] p-6">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate("/dashboard/instructor-resources")}
          className="flex items-center gap-2 text-content-text hover:text-primary transition-colors mb-6"
        >
          <FaArrowLeft className="w-4 h-4" />
          <span>Back to Resources</span>
        </button>

        {/* Blog Content */}
        <div className="bg-white dark:bg-[#292D4A] rounded-xl overflow-hidden shadow-sm mb-8">
          {/* Featured Image */}
          {blog.featuredImage && (
            <img
              src={blog.featuredImage}
              alt={blog.title}
              className="w-full h-64 md:h-96 object-cover"
            />
          )}

          {/* Blog Info */}
          <div className="p-6 md:p-8">
            {/* Title */}
            <h1 className="text-2xl md:text-3xl font-bold text-header-text mb-4">
              {blog.title}
            </h1>

            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-content-text mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2">
                <FaUser className="w-4 h-4" />
                <span>
                  {blog.author?.firstName || "Admin"}{" "}
                  {blog.author?.lastName || ""}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <FaCalendar className="w-4 h-4" />
                <span>{formatDate(blog.publishedAt || blog.createdAt)}</span>
              </div>
              {blog.categories && blog.categories.length > 0 && (
                <div className="flex items-center gap-2">
                  <FaTag className="w-4 h-4" />
                  <span>{blog.categories.map((c) => c.name).join(", ")}</span>
                </div>
              )}
            </div>

            {/* Content */}
            <div
              className="prose dark:prose-invert max-w-none"
              dangerouslySetInnerHTML={{
                __html: blog.content || "No content available.",
              }}
            />

            {/* Tags */}
            {blog.tags && blog.tags.length > 0 && (
              <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                <h3 className="text-sm font-semibold text-header-text mb-3">
                  Tags
                </h3>
                <div className="flex flex-wrap gap-2">
                  {blog.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-xs text-content-text rounded-full"
                    >
                      #{tag.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Share Button */}
            <div className="mt-6 pt-4">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  alert("Link copied to clipboard!");
                }}
                className="flex items-center gap-2 text-sm text-content-text hover:text-primary transition-colors"
              >
                <FaShare className="w-4 h-4" />
                Share this article
              </button>
            </div>
          </div>
        </div>

        {/* Comments Section */}
        <div className="bg-white dark:bg-[#292D4A] rounded-xl overflow-hidden shadow-sm">
          <div className="p-6 md:p-8">
            <div className="flex items-center gap-3 mb-6">
              <FaComment className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-bold text-header-text">
                Comments ({comments.length})
              </h2>
            </div>

            {/* Comment Form */}
            <div className="mb-8 p-4 bg-gray-50 dark:bg-[#1E2139] rounded-lg">
              <h3 className="text-md font-semibold text-header-text mb-4">
                Leave a Comment
              </h3>
              <form onSubmit={handleCommentSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-content-text mb-2">
                      Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={commentForm.name}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-[#292D4A] text-header-text focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-content-text mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={commentForm.email}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-[#292D4A] text-header-text focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Your email"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-content-text mb-2">
                    Comment *
                  </label>
                  <textarea
                    name="content"
                    value={commentForm.content}
                    onChange={handleInputChange}
                    rows="4"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-[#292D4A] text-header-text focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Write your comment here..."
                  />
                </div>
                {commentError && (
                  <div className="text-red-500 text-sm">{commentError}</div>
                )}
                {commentSuccess && (
                  <div className="text-green-500 text-sm">{commentSuccess}</div>
                )}
                <button
                  type="submit"
                  disabled={addingComment}
                  className="px-6 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {addingComment ? (
                    <>
                      <FaSpinner className="w-4 h-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    "Submit Comment"
                  )}
                </button>
              </form>
            </div>

            {/* Comments List */}
            {loadingComments ? (
              <div className="flex justify-center py-8">
                <FaSpinner className="w-6 h-6 text-primary animate-spin" />
              </div>
            ) : comments.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-content-text">
                  No comments yet. Be the first to comment!
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {comments.map((comment) => (
                  <div
                    key={comment._id}
                    className="border-b border-gray-200 dark:border-gray-700 last:border-0 pb-6 last:pb-0"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-semibold text-header-text">
                          {comment.name}
                        </h4>
                      </div>
                    </div>
                    <p className="text-content-text leading-relaxed mt-2">
                      {comment.content}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
