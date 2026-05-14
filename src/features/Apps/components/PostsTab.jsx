// PostsTab.jsx
import { useState } from 'react'
import { FaThumbsUp, FaReply, FaPaperclip } from 'react-icons/fa'
import { BsEmojiSmile } from 'react-icons/bs'
import PostReplyModal from './PostReplyModal'

const POSTS = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=700&q=80',
    title: 'Collection of textile samples lay spread',
    body: 'A wonderful serenity has taken possession of my entire soul, like these sweet mornings of spring which I enjoy with my whole heart. A wonderful serenity has taken possession of my entire soul, like these sweet mornings of spring which I enjoy with my whole heart.',
    likes: 12,
    liked: false,
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1579621970795-87facc2f976d?w=700&q=80',
    title: 'Collection of textile samples lay spread',
    body: 'A wonderful serenity has taken possession of my entire soul, like these sweet mornings of spring which I enjoy with my whole heart. A wonderful serenity has taken possession of my entire soul, like these sweet mornings of spring which I enjoy with my whole heart.',
    likes: 8,
    liked: false,
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=700&q=80',
    title: 'Collection of textile samples lay spread',
    body: 'A wonderful serenity has taken possession of my entire soul, like these sweet mornings of spring which I enjoy with my whole heart. A wonderful serenity has taken possession of my entire soul, like these sweet mornings of spring which I enjoy with my whole heart.',
    likes: 20,
    liked: false,
  },
]

function PostCard({ post, onLike, onReply }) {
  return (
    <div className="flex flex-col rounded-md overflow-hidden border border-gray-100 dark:border-white/10">
      <img src={post.image} alt={post.title} className="w-full h-52 object-cover" />
      <div className="flex flex-col gap-2.5 p-4">
        <h3 className="text-sm font-bold text-header-text leading-snug">{post.title}</h3>
        <p className="text-xs text-content-text leading-relaxed">{post.body}</p>
        <div className="flex items-center gap-3 pt-1">
          <button
            onClick={() => onLike(post.id)}
            className={`
              flex items-center gap-1.5  font-semibold px-3 py-2.5 rounded-md transition-colors duration-200
              ${post.liked ? 'bg-primary/10 text-primary' : 'bg-primary text-white cursor-pointer hover:bg-primary/10 hover:text-primary'}
            `}
          >
            <FaThumbsUp className="w-3 h-3" />
            Like {post.likes > 0 && `(${post.likes})`}
          </button>
          <button
            onClick={() => onReply(post.id)}
            className="flex items-center gap-1.5  font-semibold px-3 py-2.5 rounded-md bg-secondary cursor-pointer text-white hover:bg-secondary/10 hover:text-secondary transition-colors duration-200"
          >
            <FaReply className="w-3 h-3" />
            Reply
          </button>
        </div>
      </div>
    </div>
  )
}

export default function PostsTab() {
  const [posts, setPosts]             = useState(POSTS)
  const [search, setSearch]           = useState('')
  const [replyPostId, setReplyPostId] = useState(null)

  const handleLike = (id) => {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 }
          : p
      )
    )
  }

  const handleReplySubmit = (message) => {
    console.log(`Reply on post ${replyPostId}:`, message)
  }

  const filtered = posts.filter((p) =>
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    p.body.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="bg-[#ffffff] dark:bg-[#292D4A] rounded-md p-5 flex flex-col gap-5">

      {/* Search + compose bar */}
      <div className="flex items-center gap-3">
        <div className="flex-1 flex items-center gap-2 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-md px-3 py-2.5 focus-within:border-primary transition-all duration-200">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Please type what you need..."
            className="flex-1 bg-transparent outline-none text-sm text-header-text placeholder:text-content-text"
          />
        </div>
        <button className="text-content-text hover:text-primary transition-colors duration-200">
          <FaPaperclip className="w-4 h-4" />
        </button>
        <button className="text-content-text hover:text-primary transition-colors duration-200">
          <BsEmojiSmile className="w-4 h-4" />
        </button>
        <button className="bg-primary text-white text-xs font-semibold px-4 py-2.5 rounded-md hover:bg-primary/90 transition-colors duration-200">
          Post
        </button>
      </div>

      {/* Post list */}
      <div className="flex flex-col gap-5">
        {filtered.length === 0 ? (
          <p className="text-sm text-content-text text-center py-8">No posts found.</p>
        ) : (
          filtered.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              onLike={handleLike}
              onReply={(id) => setReplyPostId(id)}
            />
          ))
        )}
      </div>

      {/* Reply Modal */}
      {replyPostId !== null && (
        <PostReplyModal
          onClose={() => setReplyPostId(null)}
          onSubmit={handleReplySubmit}
        />
      )}
    </div>
  )
}