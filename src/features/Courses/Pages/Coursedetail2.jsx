import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FaArrowLeft, FaShareAlt, FaBookmark, FaList } from 'react-icons/fa'
import { BsThreeDots } from 'react-icons/bs'

import {
  CourseMeta,
  VideoThumbnail,
  TabBar,
  ReviewCard,
  LessonRow,
  AccordionSection,
  ProgressBar,
} from '../Components/CoursedetailedShared'

// ─── Static Data ─────────────────────────────────────────────────────────────
const REVIEWS = [
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
]

const VIDEO_LESSONS = [
  { id: 1, title: 'Introduction',   duration: '1:00', unlocked: true  },
  { id: 2, title: 'Getting Started', duration: '1:00', unlocked: false },
  { id: 3, title: 'Tools',           duration: '1:00', unlocked: false },
  { id: 4, title: 'Install Tools',   duration: '1:00', unlocked: false },
  { id: 5, title: 'Plugins',         duration: '1:00', unlocked: false },
]

const AUDIO_LESSONS = [
  { id: 1, title: 'Tools',       duration: '1:00', unlocked: false },
  { id: 2, title: 'Install Tools', duration: '1:00', unlocked: false },
  { id: 3, title: 'Plugins',     duration: '1:00', unlocked: false },
]

const QUIZ_LESSONS = [
  { id: 1, title: 'Tools',       duration: '1:00', unlocked: false },
  { id: 2, title: 'Install Tools', duration: '1:00', unlocked: false },
  { id: 3, title: 'Plugins',     duration: '1:00', unlocked: false },
]

// ─── Component ───────────────────────────────────────────────────────────────
export default function CourseDetail2() {
  const navigate   = useNavigate()
  const [activeTab, setActiveTab] = useState('reviews')

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-[#1E2139] p-6 pb-10">
      <div className="max-w-5xl mx-auto flex flex-col gap-5">

        {/* ── Top Bar ─────────────────────────────────────── */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-content-text hover:text-header-text transition-colors duration-200"
          >
            <FaArrowLeft className="w-3.5 h-3.5" />
            <span className="text-sm font-medium">Back</span>
          </button>
        </div>

        {/* ── Main Grid ───────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">

          {/* ════════════════ LEFT COL ════════════════ */}
          <div className="lg:col-span-3 flex flex-col gap-5">

            {/* Course Header Card */}
            <div className="bg-[#ffffff] dark:bg-[#292D4A] rounded-md p-5 flex flex-col gap-4">

              {/* Title row with action icons */}
              <div className="flex items-start justify-between gap-3">
                <CourseMeta
                  title="Full-Stack Web Developer"
                  rating={5}
                  reviewCount="1k"
                  students="10k"
                />
                <div className="flex items-center gap-2 shrink-0 mt-1">
                  <button className="w-8 h-8 rounded-md border border-gray-200 dark:border-white/10 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-white/5 transition-colors duration-200">
                    <FaList className="w-3.5 h-3.5 text-content-text" />
                  </button>
                  <button className="w-8 h-8 rounded-md border border-gray-200 dark:border-white/10 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-white/5 transition-colors duration-200">
                    <FaBookmark className="w-3.5 h-3.5 text-content-text" />
                  </button>
                  <button className="w-8 h-8 rounded-md border border-gray-200 dark:border-white/10 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-white/5 transition-colors duration-200">
                    <FaShareAlt className="w-3.5 h-3.5 text-content-text" />
                  </button>
                </div>
              </div>

              {/* Video */}
              <VideoThumbnail
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&q=80"
              />

              {/* Tabs */}
              <TabBar
                tabs={['about', 'reviews', 'discussion']}
                active={activeTab}
                onChange={setActiveTab}
              />

              {/* Tab Content */}
              <div className="flex flex-col gap-4">
                {activeTab === 'about' && (
                  <div className="flex flex-col gap-4">
                    <div>
                      <h3 className="text-base font-bold text-header-text mb-2">About This Course</h3>
                      <p className="text-sm text-content-text leading-relaxed">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
                        tempor incididunt ut labore et dolore magna aliqua. Lorem ipsum dolor sit
                        amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
                        labore et dolore magna aliqua.
                      </p>
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-header-text mb-2">Course's Objectives</h3>
                      <p className="text-sm text-content-text leading-relaxed">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
                        tempor incididunt ut labore et dolore magna aliqua. Lorem ipsum dolor sit
                        amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
                        labore et dolore magna aliqua.
                      </p>
                    </div>
                  </div>
                )}

                {activeTab === 'reviews' && (
                  <div className="flex flex-col gap-4">
                    {REVIEWS.map((r) => (
                      <ReviewCard key={r.id} {...r} />
                    ))}
                  </div>
                )}

                {activeTab === 'discussion' && (
                  <div className="flex flex-col gap-4">
                    <div>
                      <h3 className="text-base font-bold text-header-text mb-2">About This Course</h3>
                      <p className="text-sm text-content-text leading-relaxed">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
                        tempor incididunt ut labore et dolore magna aliqua. Lorem ipsum dolor sit
                        amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
                        labore et dolore magna aliqua.
                      </p>
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-header-text mb-2">Course's Objectives</h3>
                      <p className="text-sm text-content-text leading-relaxed">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
                        tempor incididunt ut labore et dolore magna aliqua. Lorem ipsum dolor sit
                        amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
                        labore et dolore magna aliqua.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <p className="text-center text-xs text-content-text">
              Copyright © 2023 Designed by DesignZone
            </p>
          </div>

          {/* ════════════════ RIGHT COL ════════════════ */}
          <div className="lg:col-span-2 flex flex-col gap-4">

            {/* Progress Card */}
            <div className="bg-[#ffffff] dark:bg-[#292D4A] rounded-md p-5 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-header-text">Progress</span>
                <button className="text-content-text hover:text-header-text transition-colors duration-200">
                  <BsThreeDots className="w-4 h-4" />
                </button>
              </div>
              <ProgressBar label="Full-Stack Web Developer" current={10} total={110} />
            </div>

            {/* Curriculum Accordions */}
            <div className="flex flex-col gap-3">

              {/* Video Courses */}
              <AccordionSection label="Video Courses" progress={1} total={110} defaultOpen={true}>
                {VIDEO_LESSONS.map((l) => (
                  <LessonRow key={l.id} {...l} />
                ))}
              </AccordionSection>

              {/* Audio */}
              <AccordionSection label="Audio" progress={0} total={25}>
                {AUDIO_LESSONS.map((l) => (
                  <LessonRow key={l.id} {...l} />
                ))}
              </AccordionSection>

              {/* Module */}
              <AccordionSection label="Module" progress={0} total={25}>
                <LessonRow title="Introduction to Modules" duration="1:00" unlocked={false} />
                <LessonRow title="Advanced Modules" duration="1:00" unlocked={false} />
              </AccordionSection>

              {/* Quiz */}
              <AccordionSection label="Quiz" progress={0} total={25}>
                {QUIZ_LESSONS.map((l) => (
                  <LessonRow key={l.id} {...l} />
                ))}
              </AccordionSection>

            </div>
          </div>
        </div>
      </div>
    </div>
  )
}