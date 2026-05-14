import React from 'react';

const InvoicePage = () => {
  const invoiceData = [
    { id: 1, item: "Origin License", desc: "Extended License", cost: 999.00, qty: 1, total: 999.00 },
    { id: 2, item: "Custom Services", desc: "Installation and Customization (cost per hour)", cost: 150.00, qty: 20, total: 3000.00 },
    { id: 3, item: "Hosting", desc: "1 year subscription", cost: 499.00, qty: 1, total: 499.00 },
    { id: 4, item: "Platinum Support", desc: "1 year subscription 24/7", cost: 3999.00, qty: 1, total: 3999.00 },
  ];

  return (
    <div className="min-h-screen  text-slate-300 font-sans">
      {/* Breadcrumb */}
      <div className="mb-6 text-header-text bg-white dark:bg-[#252b48] rounded-md  p-3 text-sm">
        <span className=" font-bold">Shop</span> <span className="font-extrabold text-lg text-primary">/</span> Invoice
      </div>

      {/* Main Invoice Card */}
      <div className=" text-header-text mx-auto bg-white dark:bg-[#252b48] rounded-lg shadow-2xl overflow-hidden">
        
        {/* Header Info */}
        <div className="p-8 flex justify-between items-center border-b border-slate-700/50">
          <div className="text-xs uppercase tracking-widest opacity-60">Invoice</div>
          <div className="text-sm font-semibold tracking-wider">01/01/2018</div>
          <div className="text-xs opacity-60">Status: <span className="text-white">Pending</span></div>
        </div>

        <div className="p-8">
          {/* Addresses and Crypto Section */}
          <div className="grid text-header-text grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div>
              <h3 className="text-header-text font-bold mb-3">From:</h3>
              <p className="text-sm leading-relaxed">
                Webz Poland<br/>
                Madalinskiego 8<br/>
                71-101 Szczecin, Poland<br/>
                Email: info@webz.com.pl<br/>
                Phone: +48 444 666 3333
              </p>
            </div>

            <div>
              <h3 className="text-header-text font-bold mb-3">To:</h3>
              <p className="text-sm leading-relaxed">
                Bob Mart<br/>
                Attn: Daniel Marek<br/>
                43-190 Mikolow, Poland<br/>
                Email: marek@daniel.com<br/>
                Phone: +48 123 456 789
              </p>
            </div>

            <div className="flex text-content-text flex-col items-end">
              <div className=" p-2 rounded mb-3">
                 {/* QR Code Placeholder matching image_b015f3.png */}
                <img src="https://api.qrserver.com/v1/create-qr-code/?size=80x80&data=BTC_ADDRESS" alt="QR Code" className="w-20 h-20" />
              </div>
              <div className="text-right text-[10px] space-y-1">
                <p>Please send exact amount:</p>
                <p className="text-header-text font-bold text-xs">0.15050000 BTC</p>
                <p className="break-all opacity-70">1DonateWffyhwAjskOEwXt83pHzxhLTr8H</p>
                <p className="italic opacity-50">Current exchange rate 1 BTC = $6590 USD</p>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-slate-700">
                <tr className="text-header-text font-semibold">
                  <th className="py-4 px-2">#</th>
                  <th className="py-4 px-2">Item</th>
                  <th className="py-4 px-2">Description</th>
                  <th className="py-4 px-2">Unit Cost</th>
                  <th className="py-4 px-2 text-center">Qty</th>
                  <th className="py-4 px-2 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/30">
                {invoiceData.map((row) => (
                  <tr key={row.id} className="hover:bg-white/5 transition-colors">
                    <td className="py-4 px-2 opacity-60">{row.id}</td>
                    <td className="py-4 px-2 text-header-text font-medium">{row.item}</td>
                    <td className="py-4 px-2 opacity-80">{row.desc}</td>
                    <td className="py-4 px-2">${row.cost.toLocaleString()}</td>
                    <td className="py-4 px-2 text-center">{row.qty}</td>
                    <td className="py-4 px-2 text-right text-header-text font-bold">${row.total.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Calculations */}
          <div className="mt-8 flex justify-end">
            <div className="w-full max-w-xs space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="font-bold">Subtotal</span>
                <span className="text-header-text font-bold">$8,497,00</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="font-bold">Discount (20%)</span>
                <span className="text-header-text font-bold">$1,699,40</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="font-bold">VAT (10%)</span>
                <span className="text-header-text font-bold">$679,76</span>
              </div>
              <div className="pt-4 border-t border-slate-700 flex justify-between items-start">
                <span className="font-bold uppercase tracking-widest">Total</span>
                <div className="text-right">
                  <div className="text-xl text-header-text font-black">$7.477,36</div>
                  <div className="text-xs font-bold mt-1">0.15050000 BTC</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoicePage;