// LatestTransactionTable.jsx
import { BsDownload } from 'react-icons/bs'
import { FaSort } from 'react-icons/fa'

const TRANSACTIONS = [
  { id: 1, date: 'January 2, 2020', name: 'Samantha William', amount: '$60,00', status: 'Completed' },
  { id: 2, date: 'January 2, 2022', name: 'Jordan Nico',      amount: '$60,00', status: 'Pending'   },
  { id: 3, date: 'January 2, 2022', name: 'Nadila Adja',      amount: '$60,00', status: 'Cancelled' },
]

const STATUS_STYLES = {
  Completed:  'bg-teal-500/15 text-teal-500 border border-teal-500/30',
  Pending:    'bg-yellow-400/15 text-yellow-500 border border-yellow-400/30',
  Cancelled:  'bg-red-400/15 text-red-400 border border-red-400/30',
}

const COLS = ['Date', 'Name', 'Amount', 'Status', 'Invoice']

export default function LatestTransactionTable() {
  return (
    <div className="bg-[#ffffff] dark:bg-[#292D4A] rounded-md p-5 flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <span className="text-sm font-bold text-header-text">Latest Transaction</span>
        <button className="bg-primary text-white text-xs font-semibold px-4 py-2 rounded-md hover:bg-primary/90 transition-colors duration-200">
          View all
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 dark:border-white/10">
              {COLS.map((col) => (
                <th key={col} className="text-left py-3 px-2 whitespace-nowrap">
                  <div className="flex items-center gap-1 text-xs font-semibold text-content-text">
                    {col}
                    {col !== 'Invoice' && <FaSort className="w-2.5 h-2.5 opacity-40" />}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {TRANSACTIONS.map((t) => (
              <tr
                key={t.id}
                className="border-b border-gray-50 dark:border-white/5 last:border-none hover:bg-gray-50 dark:hover:bg-white/3 transition-colors duration-150"
              >
                <td className="py-3.5 px-2 text-content-text whitespace-nowrap">{t.date}</td>
                <td className="py-3.5 px-2 font-medium text-header-text whitespace-nowrap">{t.name}</td>
                <td className="py-3.5 px-2 text-header-text font-semibold whitespace-nowrap">{t.amount}</td>
                <td className="py-3.5 px-2">
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full ${STATUS_STYLES[t.status]}`}>
                    {t.status}
                  </span>
                </td>
                <td className="py-3.5 px-2">
                  <button className="flex items-center gap-2 text-xs font-semibold text-content-text hover:text-header-text transition-colors duration-200">
                    Download
                    <BsDownload className="w-3.5 h-3.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
