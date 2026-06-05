import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import axios from 'axios'
import Swal from 'sweetalert2'
import { clearCart, applyCoupon, removeCoupon } from '../../../redux/Slice/cartSlice'

const baseUrl = import.meta.env?.VITE_BACKEND_URL || "https://cms-backend-ashen.vercel.app";

const inputClass = "w-full bg-white/5 dark:bg-[#1a1c2e]/50 border border-gray-200 dark:border-slate-700 rounded-lg p-3 text-gray-800 dark:text-white focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-all text-sm"
const labelClass = "block text-sm font-medium text-header-text mb-1.5"

const CheckoutPage = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const user = useSelector((state) => state.auth.user)
  const { items, totalPrice, couponApplied, savedAmount } = useSelector((state) => state.cart)

  const [savedAddresses, setSavedAddresses] = useState([])
  const [selectedAddress, setSelectedAddress] = useState(null)
  const [saveAddress, setSaveAddress] = useState(false)
  const [loading, setLoading] = useState(false)
  const [couponCode, setCouponCode] = useState('')
  const [couponLoading, setCouponLoading] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState('card')
  const [shippingMethod, setShippingMethod] = useState('free_shipping')

  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    username: user?.username || '',
    email: user?.email || '',
    address: '',
    address2: '',
    country: '',
    state: '',
    zipCode: '',
    phone: '',
  })

  useEffect(() => {
    const fetchAddresses = async () => {
      if (!user?.id) return
      try {
        const { data } = await axios.get(`${baseUrl}/api/shipping-addresses/${user.id}`)
        setSavedAddresses(data.addresses || [])

        const defaultAddr = data.addresses?.find((a) => a.isDefault)
        if (defaultAddr) {
          setSelectedAddress(defaultAddr._id)
          setFormData((prev) => ({
            ...prev,
            address: defaultAddr.address,
            country: defaultAddr.country,
            state: defaultAddr.state || '',
            zipCode: defaultAddr.zipCode || '',
            phone: defaultAddr.phone,
          }))
        }
      } catch (error) {
        console.error('Error fetching addresses:', error)
      }
    }

    fetchAddresses()
  }, [user?.id])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSelectAddress = (addr) => {
    setSelectedAddress(addr._id)
    setFormData((prev) => ({
      ...prev,
      address: addr.address,
      country: addr.country,
      state: addr.state || '',
      zipCode: addr.zipCode || '',
      phone: addr.phone,
    }))
  }

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return
    try {
      setCouponLoading(true)
      const { data } = await axios.post(`${baseUrl}/api/coupons/validate`, {
        code: couponCode,
        orderAmount: totalPrice,
      })

      dispatch(applyCoupon({
        coupon: data.coupon,
        savedAmount: parseFloat(data.discountAmount),
      }))

      Swal.fire({
        title: 'Coupon Applied!',
        text: `You saved $${data.discountAmount}`,
        icon: 'success',
        timer: 2000,
        showConfirmButton: false,
        toast: true,
        position: 'top-end',
      })
    } catch (error) {
      Swal.fire({
        title: 'Invalid Coupon!',
        text: error.response?.data?.message || 'Coupon not valid',
        icon: 'error',
        confirmButtonColor: 'var(--primary)',
      })
    } finally {
      setCouponLoading(false)
    }
  }

  const handleRemoveCoupon = () => {
    dispatch(removeCoupon())
    setCouponCode('')
  }

  const shippingCost = shippingMethod === 'flat_rate' ? 10 : 0
  const discount = savedAmount || 0
  const finalTotal = totalPrice + shippingCost - discount

  // FIXED: Place Order handler
  const handleSubmit = async (e) => {
    e.preventDefault()

    if (items.length === 0) {
      Swal.fire({
        title: 'Cart is Empty!',
        text: 'Please add items to cart first',
        icon: 'warning',
        confirmButtonColor: 'var(--primary)',
      })
      return
    }

    if (!formData.address || !formData.country) {
      Swal.fire({
        title: 'Address Required!',
        text: 'Please fill in your shipping address',
        icon: 'warning',
        confirmButtonColor: 'var(--primary)',
      })
      return
    }

    try {
      setLoading(true)

      // Save Address if checked
      if (saveAddress && user?.id) {
        try {
          // handleSubmit mein, axios.post se PEHLE yeh add karo:
console.log("Order payload:", {
  user: user?.id,
  items: orderItems,
  shippingAddress: {
    fullName: `${formData.firstName} ${formData.lastName}`.trim(),
    phone: formData.phone || 'N/A',
    address: formData.address,
    city: formData.state || formData.country,
    state: formData.state,
    country: formData.country,
    zipCode: formData.zipCode,
  },
  shippingMethod,
  paymentMethod,
  couponCode: couponApplied?.code || null,
})
          await axios.post(`${baseUrl}/api/shipping-addresses`, {
            user: user.id,
            fullName: `${formData.firstName} ${formData.lastName}`.trim(),
            phone: formData.phone || 'N/A',
            address: formData.address,
            city: formData.state || formData.country,
            state: formData.state,
            country: formData.country,
            zipCode: formData.zipCode,
            isDefault: savedAddresses.length === 0,
          })
        } catch (addrError) {
          console.error('Address save error:', addrError)
        }
      }

      // Create Order
      const orderItems = items.map((item) => ({
        product: item.product?._id || item.product,
        quantity: item.quantity,
        size: item.size || null,
      }))

      const { data } = await axios.post(`${baseUrl}/api/orders`, {
        user: user?.id,
        items: orderItems,
        shippingAddress: {
          fullName: `${formData.firstName} ${formData.lastName}`.trim(),
          phone: formData.phone || 'N/A',
          address: formData.address,
          city: formData.state || formData.country,
          state: formData.state,
          country: formData.country,
          zipCode: formData.zipCode,
        },
        shippingMethod,
        paymentMethod,
        couponCode: couponApplied?.code || null,
        notes: '',
      })

      // FIXED: Clear Cart - proper way to dispatch async thunk
      try {
        const result = await dispatch(clearCart(user?.id))
        console.log("Clear cart result:", result)
      } catch (clearError) {
        console.error('Error clearing cart:', clearError)
      }

await Swal.fire({
  title: 'Order Placed! 🎉',
  text: `Order #${data.order.orderNumber} placed successfully!`,
  icon: 'success',
  confirmButtonColor: 'var(--primary)',
})

// Order data save karo
localStorage.setItem('lastOrder', JSON.stringify(data.order))
window.location.href = '/dashboard/ecom-invoice'

    } catch (error) {
      console.log("Full error:", error.response?.data)  // exact backend message
  console.log("Status:", error.response?.status)
  console.log("Error details:", error.response?.data?.message)
      Swal.fire({
        title: 'Error!',
        text: error.response?.data?.message || error.message || 'Something went wrong',
        icon: 'error',
        confirmButtonColor: 'var(--primary)',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen font-sans">
      <div className="bg-white dark:bg-[#292D4A] p-4 rounded-md mx-auto mb-6 text-sm text-header-text">
        <span className="font-bold">Shop</span>
        <span className="mx-2">/</span>
        Checkout
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Billing + Payment */}
        <div className="lg:col-span-2 bg-white dark:bg-[#292D4A] p-8 rounded-xl shadow-sm">
          <h2 className="text-xl font-bold text-header-text mb-6">Billing Address</h2>

          {savedAddresses.length > 0 && (
            <div className="mb-6">
              <p className="text-sm font-medium text-header-text mb-3">Saved Addresses</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {savedAddresses.map((addr) => (
                  <div
                    key={addr._id}
                    onClick={() => handleSelectAddress(addr)}
                    className={`p-3 rounded-xl border-2 cursor-pointer transition-all text-sm ${
                      selectedAddress === addr._id
                        ? 'border-primary bg-primary/5'
                        : 'border-gray-200 dark:border-slate-700 hover:border-primary/50'
                    }`}
                  >
                    <p className="font-bold text-header-text">{addr.fullName}</p>
                    <p className="text-content-text text-xs mt-0.5">{addr.address}, {addr.city}</p>
                    <p className="text-content-text text-xs">{addr.state}, {addr.country} {addr.zipCode}</p>
                    {addr.isDefault && (
                      <span className="text-xs text-primary font-bold mt-1 inline-block">✓ Default</span>
                    )}
                  </div>
                ))}
              </div>
              <p className="text-xs text-content-text mt-2 opacity-70">Or fill in a new address below</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>First name</label>
                <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} className={inputClass} required />
              </div>
              <div>
                <label className={labelClass}>Last name</label>
                <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} className={inputClass} required />
              </div>
            </div>

            <div>
              <label className={labelClass}>Phone</label>
              <input type="text" name="phone" value={formData.phone} onChange={handleChange} placeholder="+1 234 567 890" className={inputClass} />
            </div>

            <div>
              <label className={labelClass}>Email <span className="text-gray-400 text-xs">(Optional)</span></label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="you@example.com" className={inputClass} />
            </div>

            <div>
              <label className={labelClass}>Address</label>
              <input type="text" name="address" value={formData.address} onChange={handleChange} placeholder="1234 Main St" className={inputClass} required />
            </div>

            <div>
              <label className={labelClass}>Address 2 <span className="text-gray-400 text-xs">(Optional)</span></label>
              <input type="text" name="address2" value={formData.address2} onChange={handleChange} placeholder="Apartment or suite" className={inputClass} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pb-6 border-b border-gray-100 dark:border-slate-700/50">
              <div>
                <label className={labelClass}>Country</label>
                <input type="text" name="country" value={formData.country} onChange={handleChange} placeholder="USA" className={inputClass} required />
              </div>
              <div>
                <label className={labelClass}>State</label>
                <input type="text" name="state" value={formData.state} onChange={handleChange} placeholder="New York" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Zip</label>
                <input type="text" name="zipCode" value={formData.zipCode} onChange={handleChange} placeholder="10001" className={inputClass} />
              </div>
            </div>

            <div className="space-y-2">
              <label className={labelClass}>Shipping Method</label>
              {[
                { value: 'free_shipping', label: 'Free Shipping', cost: '$0' },
                { value: 'flat_rate', label: 'Flat Rate', cost: '$10' },
              ].map((method) => (
                <label key={method.value} className="flex items-center justify-between text-sm text-header-text cursor-pointer p-3 rounded-lg border border-gray-200 dark:border-slate-700 hover:border-primary/50 transition-all">
                  <div className="flex items-center gap-2">
                    <input type="radio" name="shipping" value={method.value} checked={shippingMethod === method.value} onChange={() => setShippingMethod(method.value)} className="accent-primary" />
                    {method.label}
                  </div>
                  <span className="font-bold text-primary">{method.cost}</span>
                </label>
              ))}
            </div>

            <div className="space-y-2">
              <label className="flex items-center text-sm text-header-text cursor-pointer gap-2">
                <input type="checkbox" checked={saveAddress} onChange={(e) => setSaveAddress(e.target.checked)} className="accent-primary w-4 h-4" />
                Save this address for next time
              </label>
            </div>

            <div className="pt-6 border-t border-gray-100 dark:border-slate-700/50">
              <h2 className="text-xl font-bold text-header-text mb-4">Payment</h2>
              <div className="space-y-2 mb-6">
                {[
                  { value: 'card', label: 'Credit / Debit Card' },
                  { value: 'paypal', label: 'PayPal' },
                  { value: 'cash_on_delivery', label: 'Cash on Delivery' },
                ].map((method) => (
                  <label key={method.value} className="flex items-center text-sm text-header-text cursor-pointer gap-2 p-3 rounded-lg border border-gray-200 dark:border-slate-700 hover:border-primary/50 transition-all">
                    <input type="radio" name="payment" value={method.value} checked={paymentMethod === method.value} onChange={() => setPaymentMethod(method.value)} className="accent-primary" />
                    {method.label}
                  </label>
                ))}
              </div>

              {paymentMethod === 'card' && (
                <div className="space-y-4 mb-6 p-4 bg-gray-50 dark:bg-slate-800/30 rounded-xl">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className={labelClass}>Name on card</label>
                      <input type="text" placeholder="John Doe" className={inputClass} />
                    </div>
                    <div>
                      <label className={labelClass}>Card number</label>
                      <input type="text" placeholder="**** **** **** ****" className={inputClass} />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={labelClass}>Expiration</label>
                      <input type="text" placeholder="MM/YY" className={inputClass} />
                    </div>
                    <div>
                      <label className={labelClass}>CVV</label>
                      <input type="text" placeholder="***" className={inputClass} />
                    </div>
                  </div>
                </div>
              )}
            </div>

            <button type="submit" disabled={loading || items.length === 0} className="w-full bg-primary hover:opacity-90 text-white font-bold py-4 rounded-xl transition-all uppercase tracking-wide disabled:opacity-50 disabled:cursor-not-allowed">
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Placing Order...
                </div>
              ) : (
                `Place Order — $${finalTotal.toFixed(2)}`
              )}
            </button>
          </form>
        </div>

        {/* Right: Cart Summary */}
        <div className="lg:col-span-1 space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-header-text opacity-70">Your Cart</h2>
            <span className="bg-primary text-white text-xs font-bold px-2.5 py-1 rounded-full">{items.length}</span>
          </div>

          <div className="bg-white dark:bg-[#292D4A] rounded-xl shadow-sm overflow-hidden border border-gray-100 dark:border-slate-700/30">
            <ul className="divide-y divide-gray-100 dark:divide-slate-700/50">
              {items.length === 0 ? (
                <li className="p-6 text-center text-content-text text-sm opacity-60">Cart is empty</li>
              ) : (
                items.map((item) => {
                  const product = item.product
                  const itemPrice = item.price || product?.price || 0
                  const image = product?.images?.[0] || null
                  return (
                    <li key={item._id} className="p-4 flex items-center gap-3 hover:bg-primary/5 transition-colors">
                      {image && <img src={image} alt={product?.title} className="w-12 h-12 rounded-lg object-cover shrink-0" />}
                      <div className="flex-1 min-w-0">
                        <h6 className="font-bold text-sm text-header-text truncate">{product?.title || 'Product'}</h6>
                        <p className="text-xs text-content-text opacity-60">{item.size && `Size: ${item.size} • `}Qty: {item.quantity}</p>
                      </div>
                      <span className="text-sm font-bold text-header-text shrink-0">${(itemPrice * item.quantity).toFixed(2)}</span>
                    </li>
                  )
                })
              )}

              {couponApplied && (
                <li className="p-4 flex justify-between items-center bg-green-50 dark:bg-green-900/10">
                  <div>
                    <h6 className="font-bold text-sm text-green-600">Coupon: {couponApplied.code}</h6>
                    <p className="text-xs text-green-500">Discount applied</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-green-600">-${savedAmount.toFixed(2)}</span>
                    <button onClick={handleRemoveCoupon} className="text-xs text-red-400 hover:text-red-600">✕</button>
                  </div>
                </li>
              )}

              <li className="p-4 flex justify-between items-center">
                <span className="text-sm text-content-text">Shipping</span>
                <span className="text-sm font-bold text-header-text">{shippingCost === 0 ? 'Free' : `$${shippingCost}`}</span>
              </li>

              <li className="p-4 flex justify-between items-center">
                <span className="text-sm text-content-text">Subtotal</span>
                <span className="text-sm font-bold text-header-text">${totalPrice.toFixed(2)}</span>
              </li>

              <li className="p-4 flex justify-between items-center bg-gray-50 dark:bg-slate-800/30">
                <span className="text-header-text font-bold">Total (USD)</span>
                <span className="text-header-text font-black text-xl">${finalTotal.toFixed(2)}</span>
              </li>
            </ul>
          </div>

          <div className="bg-white dark:bg-[#292D4A] p-3 rounded-xl border border-gray-100 dark:border-slate-700/30">
            <p className="text-xs font-medium text-content-text mb-2">Have a promo code?</p>
            <div className="flex gap-2">
              <input type="text" value={couponCode} onChange={(e) => setCouponCode(e.target.value.toUpperCase())} placeholder="Enter code" className="flex-1 bg-gray-50 dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700 text-header-text text-sm p-2.5 rounded-lg outline-none focus:border-primary transition-all" onKeyDown={(e) => e.key === 'Enter' && handleApplyCoupon()} />
              <button onClick={handleApplyCoupon} disabled={couponLoading || !couponCode} className="bg-primary hover:opacity-90 text-white text-xs font-bold px-4 py-2 rounded-lg transition-all disabled:opacity-50">
                {couponLoading ? '...' : 'Apply'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CheckoutPage