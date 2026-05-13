// TotalOrderCard.jsx
import { FaArrowUp } from 'react-icons/fa'

export default function TotalOrderCard() {
  return (
    <div className="bg-[#ffffff] dark:bg-[#292D4A] rounded-md p-5 flex flex-col gap-3">
      <span className="text-sm text-content-text">Total Order</span>
      <div className="flex items-center gap-3">
        <span className="text-3xl font-bold text-header-text">317,642</span>
        <div className="flex items-center gap-1 bg-teal-500/15 rounded-full px-2.5 py-1">
          <FaArrowUp className="w-2.5 h-2.5 text-teal-500" />
          <span className="text-xs font-semibold text-teal-500">+15%</span>
        </div>
      </div>
      <p className="text-xs text-content-text leading-relaxed">
        Lorem ipsum dolor sit amet, adipiscing elit, sed do eiusmod tempor incididunt
      </p>
    </div>
  )
}
