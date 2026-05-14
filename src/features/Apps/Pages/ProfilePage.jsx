// ProfilePage.jsx
import { useState } from 'react'
import ProfileCoverCard  from '../components/ProfileCoverCard'
import ProfileTabBar     from '../components/ProfileTabBar'
import PostsTab          from '../components/PostsTab'
import AboutMeTab        from '../components/AboutMeTab'
import AccountSettingTab from '../components/AccountSettingTab'
import ProfileStatsBar from '../components/ProfileStatsBar'
import TodayHighlights from '../components/TodayHighlights'
import InterestGallery from '../components/InterestGallery'
import LatestNews      from '../components/LatestNews'
const TABS = ['Posts', 'About Me', 'Setting']

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState('Posts')

  return (
    <div className="min-h-screen space-y-5 bg-gray-100 dark:bg-[#1E2139] p-2">
    
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-6">
          <span className="font-bold text-header-text">App</span>
          <span className="text-content-text">/</span>
          <span className="text-content-text">Profile</span>
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
       {/* Cover Card */}
      

        {/* Tab Bar */}
        <ProfileTabBar tabs={TABS} active={activeTab} onChange={setActiveTab} />

        {/* Tab Content */}
        {activeTab === 'Posts'   && <PostsTab />}
        {activeTab === 'About Me' && <AboutMeTab />}
        {activeTab === 'Setting' && <AccountSettingTab />}
</div>
   

      </div>
   
    </div>
  )
}
