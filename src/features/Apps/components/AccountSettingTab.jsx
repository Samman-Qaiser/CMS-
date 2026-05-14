// AccountSettingTab.jsx
import { useState } from 'react'

function FormField({ label, type = 'text', placeholder, value, onChange, half = false }) {
  return (
    <div className={`flex flex-col gap-1.5 ${half ? 'flex-1 min-w-0' : 'w-full'}`}>
      {label && (
        <label className="text-xs font-semibold text-header-text">{label}</label>
      )}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="
          w-full bg-gray-50 dark:bg-white/5
          border border-gray-200 dark:border-white/10
          rounded-md px-3 py-2.5 text-sm text-header-text
          placeholder:text-content-text
          outline-none focus:border-primary focus:ring-1 focus:ring-primary/30
          transition-all duration-200
        "
      />
    </div>
  )
}

function SelectField({ label, options, value, onChange, half = false }) {
  return (
    <div className={`flex flex-col gap-1.5 ${half ? 'flex-1 min-w-0' : 'w-full'}`}>
      {label && (
        <label className="text-xs font-semibold text-header-text">{label}</label>
      )}
      <select
        value={value}
        onChange={onChange}
        className="
          w-full bg-gray-50 dark:bg-white/5
          border border-gray-200 dark:border-white/10
          rounded-md px-3 py-2.5 text-sm text-content-text
          outline-none focus:border-primary focus:ring-1 focus:ring-primary/30
          transition-all duration-200 cursor-pointer
        "
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </div>
  )
}

const STATE_OPTIONS = [
  { value: '',  label: 'Choose...' },
  { value: 'FL', label: 'Florida'  },
  { value: 'CA', label: 'California' },
  { value: 'NY', label: 'New York' },
  { value: 'TX', label: 'Texas'    },
]

export default function AccountSettingTab() {
  const [form, setForm] = useState({
    email:    '',
    password: '',
    address1: '',
    address2: '',
    city:     '',
    state:    '',
    zip:      '',
    remember: false,
  })

  const set = (key) => (e) =>
    setForm((f) => ({ ...f, [key]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }))

  const handleSubmit = () => {
    // handle save
    console.log('Form submitted:', form)
  }

  return (
    <div className="bg-[#ffffff] dark:bg-[#292D4A] rounded-md p-6 flex flex-col gap-5">
      <h3 className="text-sm font-bold text-header-text">Account Setting</h3>

      {/* Email + Password */}
      <div className="flex gap-4">
        <FormField
          label="Email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={set('email')}
          half
        />
        <FormField
          label="Password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={set('password')}
          half
        />
      </div>

      {/* Address 1 */}
      <FormField
        label="Address"
        placeholder="Add Main St."
        value={form.address1}
        onChange={set('address1')}
      />

      {/* Address 2 */}
      <FormField
        placeholder="Apartment, studio, or floor"
        value={form.address2}
        onChange={set('address2')}
      />

      {/* City + State + Zip */}
      <div className="flex gap-4">
        <FormField
          label="City"
          placeholder=""
          value={form.city}
          onChange={set('city')}
          half
        />
        <SelectField
          label="State"
          options={STATE_OPTIONS}
          value={form.state}
          onChange={set('state')}
          half
        />
        <FormField
          label="Zip"
          placeholder=""
          value={form.zip}
          onChange={set('zip')}
          half
        />
      </div>

      {/* Check me out */}
      <div className="flex items-center gap-2.5">
        <input
          type="checkbox"
          id="remember"
          checked={form.remember}
          onChange={set('remember')}
          className="w-4 h-4 accent-primary rounded cursor-pointer"
        />
        <label htmlFor="remember" className="text-xs text-content-text cursor-pointer select-none">
          Check me out
        </label>
      </div>

      {/* Submit */}
      <div>
        <button
          onClick={handleSubmit}
          className="bg-primary text-white text-sm font-semibold px-6 py-2.5 rounded-md hover:bg-primary/90 transition-colors duration-200"
        >
          Sign In
        </button>
      </div>
    </div>
  )
}
