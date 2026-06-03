// BlogDetail.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaCalendar, FaUser, FaTag, FaShare } from 'react-icons/fa';
import axios from 'axios';

const baseUrl = import.meta.env?.VITE_BACKEND_URL || "https://cms-backend-ashen.vercel.app";

export default function BlogDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${baseUrl}/api/blogs/${id}`);
        
        if (response.data.success && response.data.blog) {
          setBlog(response.data.blog);
        } else {
          setError('Blog not found');
        }
      } catch (err) {
        console.error('Error fetching blog:', err);
        setError('Failed to load blog');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchBlog();
    }
  }, [id]);

  const formatDate = (dateString) => {
    if (!dateString) return 'Recent';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
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
          <p className="text-red-500">{error || 'Blog not found'}</p>
          <button
            onClick={() => navigate('/dashboard/resources')}
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
          onClick={() => navigate('/dashboard/resources')}
          className="flex items-center gap-2 text-content-text hover:text-primary transition-colors mb-6"
        >
          <FaArrowLeft className="w-4 h-4" />
          <span>Back to Resources</span>
        </button>

        {/* Blog Content */}
        <div className="bg-white dark:bg-[#292D4A] rounded-xl overflow-hidden shadow-sm">
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
                <span>{blog.author?.firstName || 'Admin'} {blog.author?.lastName || ''}</span>
              </div>
              <div className="flex items-center gap-2">
                <FaCalendar className="w-4 h-4" />
                <span>{formatDate(blog.publishedAt || blog.createdAt)}</span>
              </div>
              {blog.categories && blog.categories.length > 0 && (
                <div className="flex items-center gap-2">
                  <FaTag className="w-4 h-4" />
                  <span>{blog.categories.map(c => c.name).join(', ')}</span>
                </div>
              )}
            </div>

            {/* Content */}
            <div 
              className="prose dark:prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: blog.content || 'No content available.' }}
            />

            {/* Tags */}
            {blog.tags && blog.tags.length > 0 && (
              <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                <h3 className="text-sm font-semibold text-header-text mb-3">Tags</h3>
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
                  alert('Link copied to clipboard!');
                }}
                className="flex items-center gap-2 text-sm text-content-text hover:text-primary transition-colors"
              >
                <FaShare className="w-4 h-4" />
                Share this article
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}