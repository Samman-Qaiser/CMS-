import React from 'react';
import { CheckCircle, Clock, PauseCircle, AlertCircle } from 'lucide-react';

const OrdersPage = () => {
  // Orders Data Array based on image_a2e63d.png
  const orders = [
    { id: "#181", name: "Ricky Antony", email: "ricky@example.com", date: "20/04/2020", shipTo: "Ricky Antony, 2392 Main Avenue, Penasauka, New Jersey 02149 Via Flat Rate", status: "Completed" },
    { id: "#182", name: "Kin Rossow", email: "kin@example.com", date: "20/04/2020", shipTo: "Kin Rossow, 1 Hollywood Blvd, Beverly Hills, California 90210 Via Free Shipping", status: "Processing" },
    { id: "#183", name: "Merry Diana", email: "merry@example.com", date: "30/04/2020", shipTo: "Merry Diana, 1 Infinite Loop, Cupertino, California 90210 Via Link Road", status: "On Hold" },
    { id: "#184", name: "Bucky Robert", email: "bucky@example.com", date: "30/04/2020", shipTo: "Bucky Robert, 1 Infinite Loop, Cupertino, California 90210 Via Free Shipping", status: "Pending" },
    { id: "#185", name: "Rocky Zampa", email: "rocky@example.com", date: "30/04/2020", shipTo: "Rocky Zampa, 1 Infinite Loop, Cupertino, California 90210 Via Free Road", status: "On Hold" },
    { id: "#186", name: "Ricky John", email: "ricky@example.com", date: "30/04/2020", shipTo: "Ricky John, 1 Infinite Loop, Cupertino, California 90210 Via Free Shipping", status: "Processing" },
    { id: "#187", name: "Cristofer Henric", email: "cristofer@example.com", date: "30/04/2020", shipTo: "Cristofer Henric, 1 Infinite Loop, Cupertino, California 90210 Via Flat Rate", status: "Completed" },
    { id: "#188", name: "Brate Lee", email: "lee@example.com", date: "29/04/2020", shipTo: "Brate Lee, 1 Infinite Loop, Cupertino, California 90210 Via Link Road", status: "On Hold" },
  ];

  // Helper function for status styles
  const getStatusStyle = (status) => {
    switch (status) {
      case 'Completed':
        return { bg: 'bg-green-500', icon: <CheckCircle size={12} className="ml-1" /> };
      case 'Processing':
        return { bg: 'bg-orange-500', icon: <Clock size={12} className="ml-1" /> };
      case 'On Hold':
        return { bg: 'bg-teal-500', icon: <PauseCircle size={12} className="ml-1" /> };
      case 'Pending':
        return { bg: 'bg-yellow-500', icon: <AlertCircle size={12} className="ml-1" /> };
      default:
        return { bg: 'bg-slate-500', icon: null };
    }
  };

  return (
    <div className="min-h-screen  font-sans text-header-text">
      {/* Breadcrumb */}
      <div className="p-4 bg-white dark:bg-[#252b48] rounded-lg mb-6 text-sm">
        <span className="text--header-text font-bold">Shop</span> 
        <span className="mx-2 opacity-50">/</span> 
        <span className="text-header-text">Product Order</span>
      </div>

      {/* Orders Table Card */}
      <div className="max-w-7xl mx-auto bg-white dark:bg-[#252b48] rounded-lg shadow-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-header-text border-b border-slate-700/50">
                <th className="p-5 w-12 text-center">
                  <input type="checkbox" className="accent-primary" />
                </th>
                <th className="p-5 font-bold text-sm uppercase tracking-wider">Order</th>
                <th className="p-5 font-bold text-sm uppercase tracking-wider">Date</th>
                <th className="p-5 font-bold text-sm uppercase tracking-wider">Ship To</th>
                <th className="p-5 font-bold text-sm uppercase tracking-wider text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/30">
              {orders.map((order, index) => {
                const statusInfo = getStatusStyle(order.status);
                return (
                  <tr key={index} className="hover:bg-white/5 transition-colors">
                    <td className="p-5 text-center">
                      <input type="checkbox" className="accent-primary" />
                    </td>
                    <td className="p-5">
                      <div className="text-header-text font-bold text-sm">
                        {order.id} <span className="font-normal  text-xs italic">by</span> {order.name}
                      </div>
                      <div className="text-xs ">{order.email}</div>
                    </td>
                    <td className="p-5 text-sm whitespace-nowrap opacity-80">
                      {order.date}
                    </td>
                    <td className="p-5 text-xs leading-relaxed max-w-xs opacity-80">
                      {order.shipTo}
                    </td>
                    <td className="p-5 text-right">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold text-white uppercase ${statusInfo.bg}`}>
                        {order.status}
                        {statusInfo.icon}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        
    
      </div>
    </div>
  );
};

export default OrdersPage;