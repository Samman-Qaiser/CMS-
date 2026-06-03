import { useRef } from "react";

const TransactionReceipt = ({ transaction, onClose }) => {
  const receiptRef = useRef();

  const handlePrint = () => {
    const printContent = receiptRef.current;

    // Create a new window for printing
    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <html>
        <head>
          <title>Receipt_${transaction.transactionId || transaction._id}</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              padding: 40px;
              margin: 0;
            }
            .receipt {
              max-width: 800px;
              margin: 0 auto;
            }
            .text-center { text-align: center; }
            .border-bottom { border-bottom: 1px solid #ddd; }
            .mb-4 { margin-bottom: 20px; }
            .mb-6 { margin-bottom: 30px; }
            .p-4 { padding: 20px; }
            .bg-gray-50 { background-color: #f9f9f9; }
            .rounded-lg { border-radius: 8px; }
            table { width: 100%; border-collapse: collapse; }
            th, td { padding: 12px; text-align: left; }
            th { background-color: #f3f4f6; }
            .border { border: 1px solid #ddd; }
            .font-bold { font-weight: bold; }
            .text-right { text-align: right; }
            .mt-4 { margin-top: 20px; }
            .pt-4 { padding-top: 20px; }
            .border-t { border-top: 1px solid #ddd; }
            .border-dashed { border-style: dashed; }
          </style>
        </head>
        <body>
          <div class="receipt">
            ${printContent.innerHTML}
          </div>
          <script>
            window.onload = () => {
              window.print();
              setTimeout(() => window.close(), 500);
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-[#292D4A] rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Receipt Content */}
        <div ref={receiptRef} className="p-8">
          {/* Same receipt content as above */}
          <div className="text-center border-b pb-4 mb-4">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
              PAYMENT RECEIPT
            </h1>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              Transaction ID: {transaction.transactionId || transaction._id}
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              Date: {formatDate(transaction.createdAt)}
            </p>
          </div>

          <div className="mb-6 text-center">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
              E-Learning Platform
            </h2>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              123 Education Street, Learning City
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              Email: support@elearning.com | Phone: +1 234 567 890
            </p>
          </div>

          <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <h3 className="text-sm font-semibold text-gray-800 dark:text-white mb-2">
              Customer Information
            </h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Name:
                </p>
                <p className="font-medium text-gray-800 dark:text-white">
                  {transaction.user?.firstName} {transaction.user?.lastName}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Email:
                </p>
                <p className="font-medium text-gray-800 dark:text-white">
                  {transaction.user?.email}
                </p>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-800 dark:text-white mb-3">
              Course Details
            </h3>
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-100 dark:bg-gray-700">
                  <tr>
                    <th className="text-left p-3 text-xs font-semibold">
                      Course
                    </th>
                    <th className="text-right p-3 text-xs font-semibold">
                      Amount
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t">
                    <td className="p-3 text-gray-800 dark:text-white">
                      {transaction.course?.title}
                    </td>
                    <td className="p-3 text-right font-semibold text-gray-800 dark:text-white">
                      ${transaction.amount}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <h3 className="text-sm font-semibold text-gray-800 dark:text-white mb-2">
              Payment Details
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">
                  Payment Method:
                </span>
                <span className="font-medium text-gray-800 dark:text-white capitalize">
                  {transaction.paymentMethod}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">
                  Status:
                </span>
                <span
                  className={`font-medium capitalize ${
                    transaction.status === "completed"
                      ? "text-green-600"
                      : transaction.status === "pending"
                        ? "text-yellow-600"
                        : "text-red-600"
                  }`}
                >
                  {transaction.status}
                </span>
              </div>
              <div className="flex justify-between text-sm pt-2 border-t">
                <span className="font-semibold text-gray-800 dark:text-white">
                  Total Amount:
                </span>
                <span className="font-bold text-lg text-gray-800 dark:text-white">
                  ${transaction.amount}
                </span>
              </div>
            </div>
          </div>

          <div className="text-center pt-4 border-t">
            <p className="text-xs text-gray-600 dark:text-gray-400">
              Thank you for your purchase!
            </p>
            <div className="mt-4">
              <div className="w-32 h-12 mx-auto border-t-2 border-dashed border-gray-300"></div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                Authorized Signature
              </p>
            </div>
          </div>
        </div>

        <div className="flex gap-3 p-4 border-t dark:border-gray-700">
          <button
            onClick={handlePrint}
            className="flex-1 bg-primary text-white py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
           Print / Download PDF
          </button>
          <button
            onClick={onClose}
            className="flex-1 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 py-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default TransactionReceipt;
