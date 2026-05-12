import { useState } from 'react'
import { FaStar, FaHeart, FaRegHeart, FaPlay, FaCheckCircle, FaArrowLeft } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'

const reviews = [
  {
    id: 1,
    name: 'Karen Hope',
    rating: 5,
    time: '1 Month Ago',
    avatar: 'https://i.pravatar.cc/40?img=1',
    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  },
  {
    id: 2,
    name: 'Karen Hope',
    rating: 5,
    time: '1 Month Ago',
    avatar: 'https://i.pravatar.cc/40?img=2',
    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  },
  {
    id: 3,
    name: 'Karen Hope',
    rating: 5,
    time: '1 Month Ago',
    avatar: 'https://i.pravatar.cc/40?img=3',
    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  },
]

const learnings = [
  'Basic Programming',
  'Wireframe',
  'Create a Website',
  'User Interface Design',
  'Basic HTML & CSS',
  'Create Responsive Website',
]

function StarRow({ count = 5 }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <FaStar
          key={i}
          className={i < count ? 'text-yellow-400 w-3.5 h-3.5' : 'text-gray-400 w-3.5 h-3.5'}
        />
      ))}
    </div>
  )
}

export default function CourseDetail1() {
  const [activeTab, setActiveTab] = useState('reviews')
  const [wishlisted, setWishlisted] = useState(false)
  const navigate   = useNavigate()

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-[#1E2139] p-6">
      <div className="max-w-5xl mx-auto">

      <button
            onClick={() => navigate(-1)}
            className="flex items-center mb-4 gap-2 text-content-text hover:text-header-text transition-colors duration-200"
          >
            <FaArrowLeft className="w-3.5 h-3.5" />
            <span className="text-sm font-medium">Back</span>
          </button>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

          {/* LEFT — Course Info + Tabs */}
          <div className="lg:col-span-3 flex flex-col gap-5">

            {/* Course Info Card */}
            <div className="bg-[#ffffff] dark:bg-[#292D4A] rounded-md p-6">
              <h1 className="text-xl font-bold text-header-text leading-snug mb-3">
                Full-Stack Web Developer for Beginner
              </h1>
              <p className="text-sm text-content-text leading-relaxed mb-4">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
                tempor incididunt ut labore et dolore magna aliqua.
              </p>

              {/* Rating Row */}
              <div className="flex items-center gap-4 mb-4">
                <span className="text-sm font-bold text-header-text">5.0</span>
                <StarRow count={5} />
                <span className="text-sm text-content-text">Review (1k)</span>
                <span className="text-sm text-content-text">10k Students</span>
              </div>

              {/* Instructor */}
              <div className="flex items-center gap-3">
                <img
                  src="https://i.pravatar.cc/36?img=5"
                  alt="instructor"
                  className="w-9 h-9 rounded-md object-cover"
                />
                <span className="text-sm font-semibold text-header-text">Ms. Samantha William</span>
              </div>
            </div>

            {/* Tabs Card */}
            <div className="bg-[#ffffff] dark:bg-[#292D4A] rounded-md overflow-hidden">
              {/* Tab Bar */}
              <div className="flex border-b border-gray-200 dark:border-white/10 px-6">
                {['about', 'reviews'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`
                      py-4 px-2 mr-6 text-sm font-semibold capitalize border-b-2 transition-colors duration-200
                      ${activeTab === tab
                        ? 'border-primary text-primary'
                        : 'border-transparent text-content-text hover:text-header-text'
                      }
                    `}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <div className="p-6 flex flex-col gap-5">
                {activeTab === 'about' && (
                  <p className="text-sm text-content-text leading-relaxed">
                    This course covers everything from the basics of HTML & CSS to full-stack development
                    with React and Node.js. Designed for absolute beginners, you'll build real-world
                    projects and gain job-ready skills step by step.
                  </p>
                )}

                {activeTab === 'reviews' && reviews.map((r) => (
                  <div key={r.id} className="flex flex-col gap-2 pb-5 border-b border-gray-100 dark:border-white/10 last:border-none last:pb-0">
                    <div className="flex items-center gap-3">
                      <img
                        src={r.avatar}
                        alt={r.name}
                        className="w-10 h-10 rounded-md object-cover"
                      />
                      <div className="flex flex-col gap-0.5">
                        <span className="text-sm font-bold text-header-text">{r.name}</span>
                        <div className="flex items-center gap-3">
                          <StarRow count={r.rating} />
                          <span className="text-xs text-content-text">{r.time}</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-content-text leading-relaxed">{r.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT — Purchase Card */}
          <div className="lg:col-span-2 flex flex-col gap-5">

            {/* Video Thumbnail */}
            <div className="bg-[#ffffff] dark:bg-[#292D4A] rounded-md overflow-hidden">
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=500&q=80"
                  alt="course preview"
                  className="w-full h-48 object-cover"
                />
                <div className="absolute inset-0 bg-black/30 flex flex-col items-center justify-center gap-2">
                  <div className="w-14 h-14 rounded-md bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center">
                    <FaPlay className="w-5 h-5 text-white ml-1" />
                  </div>
                  <span className="text-white text-sm font-semibold tracking-wide">View Demo</span>
                </div>
              </div>
            </div>

            {/* Price + Actions */}
            <div className="bg-[#ffffff] dark:bg-[#292D4A] rounded-md p-5 flex flex-col gap-4">

              {/* Price Row */}
              <div className="flex items-center gap-3 flex-wrap">
                <span className="text-2xl font-bold text-header-text">$49.00</span>
                <span className="text-sm text-content-text line-through">$99.00</span>
                <span className="text-xs font-bold text-primary botrder-primary border rounded-md px-2 py-0.5">
                  Save 50%
                </span>
              </div>

              {/* Wishlist */}
              <button
                onClick={() => setWishlisted(!wishlisted)}
                className="flex items-center gap-2 text-sm text-content-text hover:text-header-text transition-colors duration-200 w-fit"
              >
                {wishlisted
                  ? <FaHeart className="w-4 h-4 text-primary" />
                  : <FaRegHeart className="w-4 h-4 text-primary" />
                }
                <span>Add to Wishlist</span>
              </button>

              {/* What you'll learn */}
              <div>
                <h3 className="text-sm font-bold text-header-text mb-3">What will you learn:</h3>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2.5">
                  {learnings.map((item) => (
                    <div key={item} className="flex items-start gap-2">
                      <FaCheckCircle className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                      <span className="text-xs text-content-text leading-snug">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex gap-3 pt-1">
                <button className="flex-1 py-2.5 rounded-md border border-gray-300 dark:border-white/20 text-sm font-semibold text-header-text hover:bg-gray-50 dark:hover:bg-white/5 transition-colors duration-200">
                  Add to Cart
                </button>
                <button className="flex-1 py-2.5 rounded-md bg-primary hover:bg-primary/70 text-sm font-semibold text-white transition-colors duration-200">
                  Buy Now
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}