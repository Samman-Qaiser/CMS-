import React from 'react'
import ProfileStatsBar from '../components/ProfileStatsBar'
import TodayHighlights from '../components/TodayHighlights'
import InterestGallery from '../components/InterestGallery'
import LatestNews      from '../components/LatestNews'
import ProfileCoverCard  from '../components/ProfileCoverCard'
import ProfileTabBar     from '../components/ProfileTabBar'
import PostDetail from '../components/PostDetail'
const Postdetails = () => {
  return (
      <div className="min-h-screen space-y-5 bg-gray-100 dark:bg-[#1E2139] p-2">
      
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 mb-6">
            <span className="font-bold text-header-text">App</span>
            <span className="text-content-text">/</span>
            <span className="text-content-text">Post</span>
          </div>
            <ProfileCoverCard />
        <div className="flex gap-5">
     <div className="w-[30%]  flex flex-col gap-5">
    <ProfileStatsBar />
    <TodayHighlights />
    <InterestGallery />
    <LatestNews />
  </div>
  <div className='w-[70%]'>
      <PostDetail/>
  </div>
     
  
        </div>
     
      </div>
  )
}

export default Postdetails