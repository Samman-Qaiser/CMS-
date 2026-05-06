// src/components/layout/SidebarSelector.jsx
import { useAppDispatch } from '../../hooks/useAppDispatch'
import { useAppSelector } from '../../hooks/useAppSelector'
import { setSidebarType, SIDEBAR_TYPES } from '../../store/slices/uiSlice'

const OPTIONS = [
  { label: 'Full',       value: SIDEBAR_TYPES.FULL },
  { label: 'Mini',       value: SIDEBAR_TYPES.MINI },
  { label: 'Compact',    value: SIDEBAR_TYPES.COMPACT },
  { label: 'Overlay',    value: SIDEBAR_TYPES.OVERLAY },
  { label: 'Modern',     value: SIDEBAR_TYPES.MODERN },
  { label: 'Icon Hover', value: SIDEBAR_TYPES.ICON_HOVER },
]

function SidebarSelector() {
  const dispatch    = useAppDispatch()
  const sidebarType = useAppSelector((state) => state.ui.sidebarType)

  return (
    <div className="flex gap-2 flex-wrap">
      {OPTIONS.map((opt) => (
        <button
          key={opt.value}
          onClick={() => dispatch(setSidebarType(opt.value))}
          className={`px-3 py-1.5 rounded text-xs font-medium border transition-all
            ${sidebarType === opt.value
              ? 'bg-red-500 text-white border-red-500'
              : 'bg-white text-gray-600 border-gray-300 hover:border-red-400 hover:text-red-500'
            }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}

export default SidebarSelector