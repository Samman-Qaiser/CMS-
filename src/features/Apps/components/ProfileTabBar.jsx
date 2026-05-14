// ProfileTabBar.jsx
export default function ProfileTabBar({ tabs, active, onChange }) {
  return (
    <div className="bg-[#ffffff] dark:bg-[#292D4A] rounded-md">
      <div className="flex border-b border-gray-100 dark:border-white/10 px-4">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => onChange(tab)}
            className={`
              py-3.5 px-4 text-sm font-semibold border-b-2 transition-colors duration-200
              ${active === tab
                ? 'border-primary text-primary'
                : 'border-transparent text-content-text hover:text-header-text'
              }
            `}
          >
            {tab}
          </button>
        ))}
      </div>
    </div>
  )
}
