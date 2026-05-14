// CustomersPage.jsx
import { useState, useMemo } from 'react'
import { FaSort, FaSortUp, FaSortDown } from 'react-icons/fa'
import { BsSearch, BsChevronLeft, BsChevronRight } from 'react-icons/bs'

const ALL_CUSTOMERS = [
  { id: 1,  name: 'Ricky Antony',     email: 'info@example.com', phone: '(201) 200-1851', address: '2392 Main Avenue, Penasauka',          joined: '30/03/2018', avatar: null, color: 'bg-teal-500',   initial: 'R' },
  { id: 2,  name: 'Emma Watson',      email: 'info@example.com', phone: '(212) 228-8403', address: '2289 5th Avenue, New York',             joined: '11/07/2017', avatar: 'https://i.pravatar.cc/36?img=5',  color: '',             initial: '' },
  { id: 3,  name: 'Rowen Atkinson',   email: 'info@example.com', phone: '(201) 200-1851', address: '112 Bostwick Avenue, Jersey City',      joined: '05/04/2016', avatar: null, color: 'bg-primary',    initial: 'R' },
  { id: 4,  name: 'Antony Hopkins',   email: 'info@example.com', phone: '(901) 324-327',  address: '3448 Ile De France St #242',            joined: '05/04/2018', avatar: 'https://i.pravatar.cc/36?img=8',  color: '',             initial: '' },
  { id: 5,  name: 'Jennifer Schramm', email: 'info@example.com', phone: '(828) 382-9631', address: '659 Hannah Street, Charlotte',          joined: '17/03/2016', avatar: 'https://i.pravatar.cc/36?img=9',  color: '',             initial: '' },
  { id: 6,  name: 'Raymond Mims',     email: 'info@example.com', phone: '(562) 468-5646', address: '2298 Locust Court, Artesia',            joined: '12/07/2014', avatar: null, color: 'bg-yellow-500', initial: 'R' },
  { id: 7,  name: 'Michael Jenkins',  email: 'info@example.com', phone: '(302) 613-8829', address: '4678 Maud Street, Philadelphia',        joined: '15/06/2014', avatar: 'https://i.pravatar.cc/36?img=12', color: '',             initial: '' },
  { id: 8,  name: 'Kristine Cadena',  email: 'info@example.com', phone: '(317) 273-7814', address: '3412 Crestview Manor, Indianapolis',    joined: '15/04/2015', avatar: 'https://i.pravatar.cc/36?img=16', color: '',             initial: '' },
  { id: 9,  name: 'Ricky Antony',     email: 'info@example.com', phone: '(201) 200-1851', address: '2392 Main Avenue, Penasauka',           joined: '30/03/2018', avatar: null, color: 'bg-teal-500',   initial: 'R' },
  { id: 10, name: 'Emma Watson',      email: 'info@example.com', phone: '(212) 228-8403', address: '2289 5th Avenue, New York',             joined: '11/07/2017', avatar: 'https://i.pravatar.cc/36?img=20', color: '',             initial: '' },
  { id: 11, name: 'Rowen Atkinson',   email: 'info@example.com', phone: '(201) 200-1851', address: '112 Bostwick Avenue, Jersey City',      joined: '05/04/2016', avatar: null, color: 'bg-primary',    initial: 'R' },
  { id: 12, name: 'Antony Hopkins',   email: 'info@example.com', phone: '(901) 324-327',  address: '3448 Ile De France St #242',            joined: '05/04/2018', avatar: 'https://i.pravatar.cc/36?img=25', color: '',             initial: '' },
  { id: 13, name: 'Jennifer Schramm', email: 'info@example.com', phone: '(828) 382-9631', address: '659 Hannah Street, Charlotte',          joined: '17/03/2016', avatar: 'https://i.pravatar.cc/36?img=30', color: '',             initial: '' },
  { id: 14, name: 'Raymond Mims',     email: 'info@example.com', phone: '(562) 468-5646', address: '2298 Locust Court, Artesia',            joined: '12/07/2014', avatar: null, color: 'bg-yellow-500', initial: 'R' },
  { id: 15, name: 'Michael Jenkins',  email: 'info@example.com', phone: '(302) 613-8829', address: '4678 Maud Street, Philadelphia',        joined: '15/06/2014', avatar: 'https://i.pravatar.cc/36?img=35', color: '',             initial: '' },
  { id: 16, name: 'Kristine Cadena',  email: 'info@example.com', phone: '(317) 273-7814', address: '3412 Crestview Manor, Indianapolis',    joined: '15/04/2015', avatar: 'https://i.pravatar.cc/36?img=40', color: '',             initial: '' },
]

const COLS = [
  { key: 'name',    label: 'Name'            },
  { key: 'email',   label: 'Email'           },
  { key: 'phone',   label: 'Phone'           },
  { key: 'address', label: 'Billing Address' },
  { key: 'joined',  label: 'Joined'          },
]

const PAGE_SIZE = 8

// ── Sort Icon ──────────────────────────────────────────────────────────────────
function SortIcon({ col, sortKey, sortDir }) {
  if (sortKey !== col) return <FaSort className="w-2.5 h-2.5 opacity-30" />
  return sortDir === 'asc'
    ? <FaSortUp   className="w-2.5 h-2.5 text-primary" />
    : <FaSortDown className="w-2.5 h-2.5 text-primary" />
}

// ── Avatar Cell ────────────────────────────────────────────────────────────────
function AvatarCell({ customer }) {
  if (customer.avatar) {
    return (
      <img
        src={customer.avatar}
        alt={customer.name}
        className="w-8 h-8 rounded-full object-cover shrink-0"
      />
    )
  }
  return (
    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${customer.color}`}>
      <span className="text-xs font-bold text-white">{customer.initial}</span>
    </div>
  )
}

// ── Main Page ──────────────────────────────────────────────────────────────────
export default function CustomersPage() {
  const [search,    setSearch]    = useState('')
  const [selected,  setSelected]  = useState([])
  const [sortKey,   setSortKey]   = useState('name')
  const [sortDir,   setSortDir]   = useState('asc')
  const [page,      setPage]      = useState(1)

  // Filter
  const filtered = useMemo(() =>
    ALL_CUSTOMERS.filter((c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search) ||
      c.address.toLowerCase().includes(search.toLowerCase())
    ), [search]
  )

  // Sort
  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      const av = a[sortKey] || ''
      const bv = b[sortKey] || ''
      return sortDir === 'asc'
        ? av.localeCompare(bv)
        : bv.localeCompare(av)
    })
  }, [filtered, sortKey, sortDir])

  // Paginate
  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE))
  const safePage   = Math.min(page, totalPages)
  const paginated  = sorted.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE)

  // Handlers
  const handleSort = (key) => {
    if (sortKey === key) setSortDir((d) => d === 'asc' ? 'desc' : 'asc')
    else { setSortKey(key); setSortDir('asc') }
    setPage(1)
  }

  const handleSearch = (val) => { setSearch(val); setPage(1) }

  const toggleOne = (id) =>
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    )

  const allPageSelected = paginated.length > 0 && paginated.every((c) => selected.includes(c.id))

  const toggleAll = () => {
    if (allPageSelected) {
      setSelected((prev) => prev.filter((id) => !paginated.find((c) => c.id === id)))
    } else {
      setSelected((prev) => [...new Set([...prev, ...paginated.map((c) => c.id)])])
    }
  }

  // Visible page numbers
  const pageNums = Array.from({ length: totalPages }, (_, i) => i + 1).slice(
    Math.max(0, safePage - 2),
    Math.min(totalPages, safePage + 1)
  )

  return (
    <div className="min-h-screen bg-white dark:bg-[#1E2139] p-6">
      <div className="max-w-6xl mx-auto flex flex-col gap-5">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm">
          <span className="font-bold text-header-text">Shop</span>
          <span className="text-content-text">/</span>
          <span className="text-content-text">Customers</span>
        </div>

        {/* Table Card */}
        <div className="bg-[#ffffff] dark:bg-[#292D4A] rounded-md flex flex-col">

          {/* Top bar */}
          <div className="flex items-center justify-between gap-4 px-5 py-4 border-b border-gray-100 dark:border-white/10 flex-wrap">
            <div className="flex items-center gap-2">
              {selected.length > 0 && (
                <span className="text-xs font-semibold text-primary">
                  {selected.length} selected
                </span>
              )}
            </div>
            {/* Search */}
            <div className="flex items-center gap-2 border border-primary/30 rounded-md px-3 py-2 focus-within:ring-2 focus-within:ring-primary/20 bg-transparent transition-all duration-200">
              <BsSearch className="w-3.5 h-3.5 text-primary shrink-0" />
              <input
                type="text"
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Search customers..."
                className="bg-transparent outline-none text-sm text-header-text placeholder:text-content-text w-44"
              />
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 dark:border-white/10">
                  {/* Checkbox col */}
                  <th className="w-10 py-3 px-4">
                    <input
                      type="checkbox"
                      checked={allPageSelected}
                      onChange={toggleAll}
                      className="w-4 h-4 accent-primary rounded cursor-pointer"
                    />
                  </th>
                  {COLS.map((col) => (
                    <th key={col.key} className="text-left py-3 px-3 whitespace-nowrap">
                      <button
                        onClick={() => handleSort(col.key)}
                        className="flex items-center gap-1.5 text-xs font-semibold text-content-text hover:text-header-text transition-colors duration-200"
                      >
                        {col.label}
                        <SortIcon col={col.key} sortKey={sortKey} sortDir={sortDir} />
                      </button>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paginated.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-10 text-sm text-content-text">
                      No customers found
                    </td>
                  </tr>
                ) : (
                  paginated.map((c) => (
                    <tr
                      key={c.id}
                      className={`
                        border-b border-gray-50 dark:border-white/5 last:border-none
                        transition-colors duration-150 cursor-pointer
                        ${selected.includes(c.id)
                          ? 'bg-primary/5'
                          : 'hover:bg-gray-50 dark:hover:bg-white/3'
                        }
                      `}
                      onClick={() => toggleOne(c.id)}
                    >
                      {/* Checkbox */}
                      <td className="py-3.5 px-4" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={selected.includes(c.id)}
                          onChange={() => toggleOne(c.id)}
                          className="w-4 h-4 accent-primary rounded cursor-pointer"
                        />
                      </td>
                      {/* Name */}
                      <td className="py-3.5 px-3">
                        <div className="flex items-center gap-3">
                          <AvatarCell customer={c} />
                          <span className="font-semibold text-header-text whitespace-nowrap">{c.name}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-3 text-content-text whitespace-nowrap">{c.email}</td>
                      <td className="py-3.5 px-3 text-content-text whitespace-nowrap">{c.phone}</td>
                      <td className="py-3.5 px-3 text-content-text">{c.address}</td>
                      <td className="py-3.5 px-3 text-content-text whitespace-nowrap">{c.joined}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Footer: info + pagination */}
          <div className="flex items-center justify-between flex-wrap gap-3 px-5 py-4 border-t border-gray-100 dark:border-white/10">
            <span className="text-xs text-content-text">
              Showing {sorted.length === 0 ? 0 : (safePage - 1) * PAGE_SIZE + 1}–{Math.min(safePage * PAGE_SIZE, sorted.length)} of {sorted.length} customers
            </span>

            <div className="flex items-center gap-2">
              {/* Prev */}
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={safePage === 1}
                className="w-8 h-8 rounded-md bg-primary/10 text-primary flex items-center justify-center hover:bg-primary hover:text-white transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <BsChevronLeft className="w-3 h-3" />
              </button>

              {pageNums.map((n) => (
                <button
                  key={n}
                  onClick={() => setPage(n)}
                  className={`
                    w-8 h-8 rounded-md text-xs font-bold transition-all duration-200
                    ${safePage === n
                      ? 'bg-primary text-white shadow-md'
                      : 'bg-primary/10 text-primary hover:bg-primary hover:text-white'
                    }
                  `}
                >
                  {n}
                </button>
              ))}

              {/* Next */}
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={safePage === totalPages}
                className="w-8 h-8 rounded-md bg-primary/10 text-primary flex items-center justify-center hover:bg-primary hover:text-white transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <BsChevronRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
