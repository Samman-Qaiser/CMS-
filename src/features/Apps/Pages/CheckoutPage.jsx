import React from 'react';

const CheckoutPage = () => {
  return (
    <div className="min-h-screen  font-sans">
      {/* Breadcrumb */}
      <div className="bg-[#ffffff] dark:bg-[#292D4A] p-4 rounded-md mx-auto mb-6 text-sm text-header-text">
        <span className="font-bold">Shop</span> <span className="mx-2">/</span> Checkout
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Billing Address & Payment */}
        <div className="lg:col-span-2 bg-[#ffffff] dark:bg-[#292D4A] p-8 rounded-lg shadow-xl">
          <h2 className="text-xl font-bold text-header-text mb-6">Billing address</h2>
          
          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-header-text mb-2">First name</label>
                <input type="text" className="w-full bg-[#1a1c2e]/50 border border-slate-700 rounded p-2.5 text-white focus:ring-primary focus:border-primary outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-header-text mb-2">Last name</label>
                <input type="text" className="w-full bg-[#1a1c2e]/50 border border-slate-700 rounded p-2.5 text-white focus:ring-primary focus:border-primary outline-none" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-header-text mb-2">Username</label>
              <div className="flex">
                <span className="inline-flex items-center px-3 bg-slate-700 border border-r-0 border-slate-700 rounded-l text-slate-400 text-sm">@</span>
                <input type="text" placeholder="Username" className="w-full bg-[#1a1c2e]/50 border border-slate-700 rounded-r p-2.5 text-white focus:ring-primary focus:border-primary outline-none" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-header-text mb-2">Email <span className="text-slate-500">(Optional)</span></label>
              <input type="email" placeholder="you@example.com" className="w-full bg-[#1a1c2e]/50 border border-slate-700 rounded p-2.5 text-white focus:ring-primary focus:border-primary outline-none" />
            </div>

            <div>
              <label className="block text-sm font-medium text-header-text mb-2">Address</label>
              <input type="text" placeholder="1234 Main St" className="w-full bg-[#1a1c2e]/50 border border-slate-700 rounded p-2.5 text-white focus:ring-primary focus:border-primary outline-none" />
            </div>

            <div>
              <label className="block text-sm font-medium text-header-text mb-2">Address 2 <span className="text-slate-500">(Optional)</span></label>
              <input type="text" placeholder="Apartment or suite" className="w-full bg-[#1a1c2e]/50 border border-slate-700 rounded p-2.5 text-white focus:ring-primary focus:border-primary outline-none" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-b border-slate-700/50 pb-8">
              <div>
                <label className="block text-sm font-medium text-header-text mb-2">Country</label>
                <select className="w-full bg-[#1a1c2e]/50 border border-slate-700 rounded p-2.5 text-white outline-none">
                  <option>Choose...</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-header-text mb-2">State</label>
                <select className="w-full bg-[#1a1c2e]/50 border border-slate-700 rounded p-2.5 text-white outline-none">
                  <option>Choose...</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-header-text mb-2">Zip</label>
                <input type="text" className="w-full bg-[#1a1c2e]/50 border border-slate-700 rounded p-2.5 text-white outline-none" />
              </div>
            </div>

            {/* Checkboxes */}
            <div className="space-y-2">
              <label className="flex items-center text-sm text-header-text cursor-pointer">
                <input type="checkbox" className="mr-2 accent-primary" /> Shipping address is the same as my billing address
              </label>
              <label className="flex items-center text-sm text-header-text cursor-pointer">
                <input type="checkbox" className="mr-2 accent-primary" /> Save this information for next time
              </label>
            </div>

            {/* Payment Section */}
            <div className="pt-6 border-t border-slate-700/50">
              <h2 className="text-xl font-bold text-header-text mb-4">Payment</h2>
              <div className="space-y-2 mb-6">
                {['Credit card', 'Debit card', 'Paypal'].map((method, idx) => (
                  <label key={method} className="flex items-center text-sm text-header-text cursor-pointer">
                    <input type="radio" name="payment" defaultChecked={idx===0} className="mr-2 accent-primary" />
                    {method}
                  </label>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-header-text mb-2">Name on card</label>
                  <input type="text" className="w-full bg-[#1a1c2e]/50 border border-slate-700 rounded p-2.5 text-white outline-none" />
                  <p className="text-[10px] text-slate-500 mt-1">Full name as displayed on card</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-header-text mb-2">Credit card number</label>
                  <input type="text" className="w-full bg-[#1a1c2e]/50 border border-slate-700 rounded p-2.5 text-white outline-none" />
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pb-8">
                <div className="md:col-span-1">
                  <label className="block text-sm font-medium text-header-text mb-2">Expiration</label>
                  <input type="text" className="w-full bg-[#1a1c2e]/50 border border-slate-700 rounded p-2.5 text-white outline-none" />
                </div>
                <div className="md:col-span-1">
                  <label className="block text-sm font-medium text-header-text mb-2">CVV</label>
                  <input type="text" className="w-full bg-[#1a1c2e]/50 border border-slate-700 rounded p-2.5 text-white outline-none" />
                </div>
              </div>
            </div>

            <button type="button" className="w-full bg-primary hover:opacity-90 text-white font-bold py-4 rounded-lg transition-all uppercase tracking-wide">
              Continue to checkout
            </button>
          </form>
        </div>

        {/* Right Column: Your Cart */}
        <div className="lg:col-span-1">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-header-text opacity-70">Your cart</h2>
            <span className="bg-primary text-white text-xs font-bold px-2.5 py-1 rounded-full">3</span>
          </div>

          <div className="bg-[#ffffff] dark:bg-[#292D4A] rounded-lg shadow-xl overflow-hidden border border-slate-700/30">
            <ul className="divide-y divide-slate-700/50">
              <li className="p-4 flex text-header-text hover:bg-primary/20 hover:text-primary border-y hover:border-primary/30 justify-between">
                <div>
                  <h6 className=" font-bold text-sm">Product name</h6>
                  <p className="text-xs text-slate-500">Brief description</p>
                </div>
                <span className="text-sm">$12</span>
              </li>
              <li className="p-4 text-header-text hover:bg-primary/20 hover:text-primary border-y hover:border-primary/30 flex justify-between">
                <div>
                  <h6 className="font-bold text-sm">Second product</h6>
                  <p className="text-xs text-slate-500">Brief description</p>
                </div>
                <span className=" text-sm">$8</span>
              </li>
              <li className="p-4 flex text-header-text hover:bg-primary/20 hover:text-primary border-y hover:border-primary/30 justify-between">
                <div>
                  <h6 className=" font-bold text-sm">Third item</h6>
                  <p className="text-xs text-slate-500">Brief description</p>
                </div>
                <span className=" text-sm">$5</span>
              </li>
              <li className="p-4 flex justify-between text-header-text hover:bg-primary/20 hover:text-primary border-y hover:border-primary/30">
                <div>
                  <h6 className="font-bold text-sm">Promo code</h6>
                  <p className="text-xs uppercase">EXAMPLECODE</p>
                </div>
                <span className="font-bold text-sm">-$5</span>
              </li>
              <li className="p-4 flex justify-between items-center">
                <span className="text-header-text font-bold">Total (USD)</span>
                <span className="text-header-text font-black text-lg">$20</span>
              </li>
            </ul>
          </div>

          {/* Promo Code Input */}
          <div className="mt-4 flex bg-[#ffffff] dark:bg-[#292D4A] p-2 rounded-lg border border-slate-700/30">
            <input type="text" placeholder="Promo code" className="flex-1 bg-transparent border-none text-white text-sm p-2 outline-none" />
            <button className="bg-slate-700 hover:bg-slate-600 text-white text-xs font-bold px-4 py-2 rounded transition-colors">
              Redeem
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default CheckoutPage;