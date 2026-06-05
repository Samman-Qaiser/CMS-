import { useState, useMemo, useEffect } from 'react'
import axios from 'axios'
import { FaSort, FaSortUp, FaSortDown } from 'react-icons/fa'
import { BsSearch, BsChevronLeft, BsChevronRight } from 'react-icons/bs'
import { Loader } from 'lucide-react'

const baseUrl = import.meta.env?.VITE_BACKEND_URL || "https://cms-backend-ashen.vercel.app"
const PAGE_SIZE = 8

const COLS = [
  { key: 'name',    label: 'Name'            },
  { key: 'email',   label: 'Email'           },
  { key: 'phone',   label: 'Phone'           },
  { key: 'address', label: 'Billing Address' },
  { key: 'joined',  label: 'Joined'          },
  { key: 'orders',  label: 'Orders'          },
  { key: 'spent',   label: 'Total Spent'     },
]

// ── Sort Icon ──────────────────────────────────────────
function SortIcon({ col, sortKey, sortDir }) {
  if (sortKey !== col) return <FaSort className="w-2.5 h-2.5 opacity-30" />
  return sortDir === 'asc'
    ? <FaSortUp   className="w-2.5 h-2.5 text-primary" />
    : <FaSortDown className="w-2.5 h-2.5 text-primary" />
}

// ── Avatar Cell ────────────────────────────────────────
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
  const colors = ['bg-teal-500', 'bg-primary', 'bg-yellow-500', 'bg-purple-500', 'bg-pink-500']
  const color = colors[customer.name.charCodeAt(0) % colors.length]
  return (
    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${color}`}>
      <span className="text-xs font-bold text-white">{customer.name?.charAt(0).toUpperCase()}</span>
    </div>
  )
}

// ── Main Page ──────────────────────────────────────────
export default function CustomersPage() {
  const [customers, setCustomers] = useState([])
  const [loading,   setLoading]   = useState(true)
  const [search,    setSearch]    = useState('')
  const [selected,  setSelected]  = useState([])
  const [sortKey,   setSortKey]   = useState('name')
  const [sortDir,   setSortDir]   = useState('asc')
  const [page,      setPage]      = useState(1)

  // ─── Fetch ──────────────────────────────────────────
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setLoading(true)
        const { data } = await axios.get(`${baseUrl}/api/orders/customers/all`)
        // API response ko flat format mein convert karo
        const mapped = (data.customers || []).map((c) => ({
          id:       c._id,
          name:     `${c.user?.firstName || ''} ${c.user?.lastName || ''}`.trim() || c.user?.username || 'N/A',
          email:    c.user?.email || 'N/A',
          phone:    c.billingAddress?.phone || c.user?.phoneNumber || 'N/A',
          address:  c.billingAddress ? `${c.billingAddress.address}, ${c.billingAddress.city}` : 'N/A',
          joined:   c.user?.createdAt ? new Date(c.user.createdAt).toLocaleDateString('en-GB') : 'N/A',
          avatar:   c.user?.profileImage || null,
          orders:   c.totalOrders || 0,
          spent:    c.totalSpent || 0,
          lastOrder: c.lastOrder,
        }))
        setCustomers(mapped)
      } catch (error) {
        console.error('Error fetching customers:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchCustomers()
  }, [])

  // ─── Filter ─────────────────────────────────────────
  const filtered = useMemo(() =>
    customers.filter((c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search) ||
      c.address.toLowerCase().includes(search.toLowerCase())
    ), [search, customers]
  )

  // ─── Sort ───────────────────────────────────────────
  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      const av = String(a[sortKey] || '')
      const bv = String(b[sortKey] || '')
      return sortDir === 'asc' ? av.localeCompare(bv) : bv.localeCompare(av)
    })
  }, [filtered, sortKey, sortDir])

  // ─── Paginate ────────────────────────────────────────
  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE))
  const safePage   = Math.min(page, totalPages)
  const paginated  = sorted.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE)

  // ─── Handlers ────────────────────────────────────────
  const handleSort = (key) => {
    if (sortKey === key) setSortDir((d) => d === 'asc' ? 'desc' : 'asc')
    else { setSortKey(key); setSortDir('asc') }
    setPage(1)
  }

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

  const pageNums = Array.from({ length: totalPages }, (_, i) => i + 1).slice(
    Math.max(0, safePage - 2),
    Math.min(totalPages, safePage + 1)
  )

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader className="animate-spin text-primary" size={32} />
      </div>
    )
  }

  return (
    <div className="min-h-screen font-sans">

      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm bg-white dark:bg-[#292D4A] p-4 rounded-lg mb-6">
        <span className="font-bold text-header-text">Shop</span>
        <span className="text-content-text">/</span>
        <span className="text-content-text">Customers</span>
        <span className="ml-2 bg-primary text-white text-xs font-bold px-2.5 py-1 rounded-full">
          {customers.length}
        </span>
      </div>

      {/* Table Card */}
      <div className="bg-white dark:bg-[#292D4A] rounded-lg shadow-sm overflow-hidden">

        {/* Top bar */}
        <div className="flex items-center justify-between gap-4 px-5 py-4 border-b border-gray-100 dark:border-white/10 flex-wrap">
          <div>
            {selected.length > 0 && (
              <span className="text-xs font-semibold text-primary">
                {selected.length} selected
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 border border-primary/30 rounded-md px-3 py-2 focus-within:ring-2 focus-within:ring-primary/20 bg-transparent">
            <BsSearch className="w-3.5 h-3.5 text-primary shrink-0" />
            <input
              type="text"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1) }}
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
                <th className="w-10 py-3 px-4">
                  <input type="checkbox" checked={allPageSelected} onChange={toggleAll} className="w-4 h-4 accent-primary rounded cursor-pointer" />
                </th>
                {COLS.map((col) => (
                  <th key={col.key} className="text-left py-3 px-3 whitespace-nowrap">
                    <button
                      onClick={() => handleSort(col.key)}
                      className="flex items-center gap-1.5 text-xs font-semibold text-content-text hover:text-header-text transition-colors"
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
                  <td colSpan={8} className="text-center py-10 text-sm text-content-text opacity-50">
                    No customers found
                  </td>
                </tr>
              ) : (
                paginated.map((c) => (
                  <tr
                    key={c.id}
                    onClick={() => toggleOne(c.id)}
                    className={`border-b border-gray-50 dark:border-white/5 last:border-none transition-colors cursor-pointer
                      ${selected.includes(c.id) ? 'bg-primary/5' : 'hover:bg-gray-50 dark:hover:bg-white/3'}`}
                  >
                    <td className="py-3.5 px-4" onClick={(e) => e.stopPropagation()}>
                      <input type="checkbox" checked={selected.includes(c.id)} onChange={() => toggleOne(c.id)} className="w-4 h-4 accent-primary rounded cursor-pointer" />
                    </td>
                    {/* Name + Avatar */}
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
                    {/* Orders count */}
                    <td className="py-3.5 px-3">
                      <span className="bg-primary/10 text-primary text-xs font-bold px-2.5 py-1 rounded-full">
                        {c.orders}
                      </span>
                    </td>
                    {/* Total Spent */}
                    <td className="py-3.5 px-3 font-bold text-header-text whitespace-nowrap">
                      ${c.spent.toLocaleString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between flex-wrap gap-3 px-5 py-4 border-t border-gray-100 dark:border-white/10">
          <span className="text-xs text-content-text">
            Showing {sorted.length === 0 ? 0 : (safePage - 1) * PAGE_SIZE + 1}–{Math.min(safePage * PAGE_SIZE, sorted.length)} of {sorted.length} customers
          </span>
          <div className="flex items-center gap-2">
            <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={safePage === 1}
              className="w-8 h-8 rounded-md bg-primary/10 text-primary flex items-center justify-center hover:bg-primary hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed">
              <BsChevronLeft className="w-3 h-3" />
            </button>
            {pageNums.map((n) => (
              <button key={n} onClick={() => setPage(n)}
                className={`w-8 h-8 rounded-md text-xs font-bold transition-all
                  ${safePage === n ? 'bg-primary text-white' : 'bg-primary/10 text-primary hover:bg-primary hover:text-white'}`}>
                {n}
              </button>
            ))}
            <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={safePage === totalPages}
              className="w-8 h-8 rounded-md bg-primary/10 text-primary flex items-center justify-center hover:bg-primary hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed">
              <BsChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}