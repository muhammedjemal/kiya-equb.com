// pages/transactions.js
"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { convertToEthiopianDateMoreEnhanced } from "@/lib/convertToEthiopianDateMoreEnhanced";
import { SMSButton } from "@/components/SMSButton3";

const TransactionsPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [income, setIncome] = useState(0);
  const [payments, setPayments] = useState(0);
  const [outgoing, setOutgoing] = useState(0);
  const [profit, setProfit] = useState(0);
  const [newTransaction, setNewTransaction] = useState({
    incomeOrPayment: "in",
    reasonOfTransaction: "",
    amount: 0,
    phoneNumber: "",
  });

  // Fetch transactions
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await axios.get("/api/transactions");
        const fetchedTransactions = response.data.transactions;
        console.log(fetchedTransactions);

        // Calculate analytics for the fetched transactions
        calculateAnalytics(fetchedTransactions);

        const payres = await axios.get("/api/total-payments");
        const totalPayAmount = payres?.data?.total || 0;

        console.log(totalPayAmount);
        setPayments(totalPayAmount);

        // Add "Total payment received from all users" if it's not already in the state
        const totalPaymentTransaction = {
          incomeOrPayment: "in",
          reasonOfTransaction: "Total payment received from all users",
          amount: totalPayAmount,
        };

        setTransactions((prevTransactions) => {
          const alreadyExists = prevTransactions.some(
            (transaction) =>
              transaction.reasonOfTransaction ===
              "Total payment received from all users"
          );

          if (!alreadyExists) {
            return [...fetchedTransactions, totalPaymentTransaction];
          }
          return prevTransactions;
        });
      } catch (error) {
        console.error(error.message);
      }
    };

    fetchTransactions();
  }, []);

  console.log(income);
  console.log(payments);
  console.log(outgoing);
  console.log(profit);
  console.log(transactions);
  console.log(newTransaction);
  // Calculate income, outgoing, and profit/loss
  const calculateAnalytics = (transactions) => {
    let totalIncome = 0;
    let totalOutgoing = 0;
    transactions.forEach((transaction) => {
      if (transaction.incomeOrPayment === "in")
        totalIncome += transaction.amount;
      if (transaction.incomeOrPayment === "out")
        totalOutgoing += transaction.amount;
    });
    setIncome(totalIncome);
    setOutgoing(totalOutgoing);
    setProfit(totalIncome - totalOutgoing);
  };

  // Handle adding a new transaction
  const handleTransactionSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation(); // Prevent event bubbling

    try {
      const response = await axios.post("/api/transactions", newTransaction);
      setTransactions([response.data.transaction, ...transactions]);
      calculateAnalytics([response.data.transaction, ...transactions]);
      setNewTransaction({
        incomeOrPayment: "in",
        reasonOfTransaction: "",
        amount: 0,
        phoneNumber: "",
      });
    } catch (error) {
      console.error("Error creating transaction:", error);
    }
  };
  // Handle adding a new transaction
  const handleDeleteTransaction = async (e) => {
    e.preventDefault();

    // Retrieve the id from the hidden input
    const formData = new FormData(e.target); // Create a FormData object from the form
    const id = formData.get("id"); // Get the value of the "id" input

    try {
      // Send DELETE request with id as a query parameter
      const response = await axios.delete(`/api/transactions?id=${id}`);

      // Handle success (e.g., update the UI by removing the deleted transaction)
      console.log("Transaction deleted:", response.data);
    } catch (error) {
      console.error("Error deleting transaction:", error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold text-center mb-6">
        Transaction Analytics
      </h1>

      {/* Analytics Summary */}
      <div className="flex justify-between mb-6 text-black">
        <div className="bg-green-100 p-4 rounded-lg shadow-md w-1/4 text-center">
          <h2 className="text-lg font-semibold">Total Income</h2>
          <p className="text-2xl font-bold text-green-600">
            {income + payments}
          </p>
        </div>
        <div className="bg-red-100 p-4 rounded-lg shadow-md w-1/4 text-center">
          <h2 className="text-lg font-semibold">Total Outgoing</h2>
          <p className="text-2xl font-bold text-red-600">{outgoing}</p>
        </div>
        <div className="bg-blue-100 p-4 rounded-lg shadow-md w-1/4 text-center">
          <h2 className="text-lg font-semibold">Profit/Loss</h2>
          <p className="text-2xl font-bold text-blue-600">
            {profit + payments}
          </p>
        </div>
      </div>

      {/* Transaction Form */}
      <form onSubmit={handleTransactionSubmit} className="mb-6">
        <div className="flex space-x-4">
          <select
            className="w-1/4 p-2 border rounded bg-black"
            value={newTransaction.incomeOrPayment}
            onChange={(e) =>
              setNewTransaction({
                ...newTransaction,
                incomeOrPayment: e.target.value,
              })
            }
          >
            <option value="in">Income</option>
            <option value="out">Payment</option>
          </select>

          <input
            type="text"
            placeholder="Reason"
            className="w-1/4 p-2 border rounded text-black"
            value={newTransaction.reasonOfTransaction}
            onChange={(e) =>
              setNewTransaction({
                ...newTransaction,
                reasonOfTransaction: e.target.value,
              })
            }
          />

          <input
            type="number"
            placeholder="Amount"
            className="w-1/4 p-2 border rounded text-black"
            value={newTransaction.amount}
            onChange={(e) =>
              setNewTransaction({
                ...newTransaction,
                amount: parseFloat(e.target.value),
              })
            }
          />
          <input
            type="number"
            placeholder="Customer Phone Number"
            className="w-1/4 p-2 border rounded text-black"
            value={newTransaction.phoneNumber}
            onChange={(e) =>
              setNewTransaction({
                ...newTransaction,
                phoneNumber: e.target.value,
              })
            }
          />

          <button
            type="submit"
            className="bg-blue-500 text-white p-2 rounded w-1/4"
          >
            Add Transaction
          </button>
        </div>
      </form>

      {/* Transaction List */}
      <table className="min-w-full table-auto border-collapse">
        <thead>
          <tr className="bg-black text-white ">
            <th className="p-3 text-left">Reason</th>
            <th className="p-3 text-left">Amount</th>
            <th className="p-3 text-left">Type</th>
            <th className="p-3 text-left">Date</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction) => (
            <tr key={transaction._id} className="border-b">
              <td className="p-3">{transaction.reasonOfTransaction}</td>
              <td className="p-3">{transaction.amount}</td>
              <td className="p-3">
                <span
                  className={`text-${
                    transaction.incomeOrPayment === "in" ? "green" : "red"
                  }-500`}
                >
                  {transaction.incomeOrPayment === "in" ? "Income" : "Payment"}
                </span>
              </td>
              <td className="p-3">
                {transaction.createdAt
                  ? convertToEthiopianDateMoreEnhanced(
                      new Date(transaction.createdAt)
                    ).dayName +
                    " " +
                    convertToEthiopianDateMoreEnhanced(
                      new Date(transaction.createdAt)
                    ).day +
                    "-" +
                    convertToEthiopianDateMoreEnhanced(
                      new Date(transaction.createdAt)
                    ).month +
                    "-" +
                    convertToEthiopianDateMoreEnhanced(
                      new Date(transaction.createdAt)
                    ).year
                  : "N/A"}
              </td>
              <td className="p-3 text-danger cursor-pointer font-bold rounded">
                {transaction.createdAt && (
                  <form
                    onSubmit={handleDeleteTransaction}
                    className="hover:bg-red-900"
                  >
                    <input type="hidden" name="id" value={transaction._id} />
                    <button type="submit" className="text-red-600">
                      Delete
                    </button>
                  </form>
                )}
              </td>
              {transaction.phoneNumber && (
                <SMSButton
                  phoneNumber={transaction.phoneNumber}
                  transaction={transaction}
                />
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionsPage;

// pages/transactions.js
// "use client";

// import { useState, useEffect } from "react";
// import axios from "axios";
// import { convertToEthiopianDateMoreEnhanced } from "@/lib/convertToEthiopianDateMoreEnhanced";
// import { SMSButton } from "@/components/SMSButton3";

// const TransactionsPage = () => {
//   const [transactions, setTransactions] = useState([]);
//   const [income, setIncome] = useState(0);
//   const [payments, setPayments] = useState(0);
//   const [outgoing, setOutgoing] = useState(0);
//   const [profit, setProfit] = useState(0);
//   const [newTransaction, setNewTransaction] = useState({
//     incomeOrPayment: "in",
//     reasonOfTransaction: "",
//     amount: 0,
//     phoneNumber: "",
//   });

//   // Fetch transactions and calculate analytics
//   useEffect(() => {
//     const fetchTransactions = async () => {
//       try {
//         const response = await axios.get("/api/transactions");
//         const fetchedTransactions = response.data.transactions;

//         const payres = await axios.get("/api/total-payments");
//         const totalPayAmount = payres?.data?.total || 0;

//         const totalPaymentTransaction = {
//           incomeOrPayment: "in",
//           reasonOfTransaction: "Total payment received from all users",
//           amount: totalPayAmount,
//         };

//         const combinedTransactions = [
//           ...fetchedTransactions,
//           totalPaymentTransaction,
//         ];

//         setTransactions(combinedTransactions);
//         setPayments(totalPayAmount);
//         calculateAnalytics(combinedTransactions);
//       } catch (error) {
//         console.error("Error fetching transactions:", error);
//       }
//     };

//     fetchTransactions();
//   }, []);

//   const calculateAnalytics = (transactions) => {
//     let totalIncome = 0;
//     let totalOutgoing = 0;

//     transactions.forEach((transaction) => {
//       if (transaction.incomeOrPayment === "in") {
//         totalIncome += transaction.amount;
//       } else if (transaction.incomeOrPayment === "out") {
//         totalOutgoing += transaction.amount;
//       }
//     });

//     setIncome(totalIncome);
//     setOutgoing(totalOutgoing);
//     setProfit(totalIncome - totalOutgoing);
//   };

//   const handleTransactionSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       const response = await axios.post("/api/transactions", newTransaction);
//       const newTransactions = [response.data.transaction, ...transactions];
//       setTransactions(newTransactions);
//       calculateAnalytics(newTransactions);

//       setNewTransaction({
//         incomeOrPayment: "in",
//         reasonOfTransaction: "",
//         amount: 0,
//         phoneNumber: "",
//       });
//     } catch (error) {
//       console.error("Error creating transaction:", error);
//     }
//   };

//   const handleDeleteTransaction = async (id) => {
//     try {
//       await axios.delete(`/api/transactions?id=${id}`);
//       const updatedTransactions = transactions.filter((t) => t._id !== id);
//       setTransactions(updatedTransactions);
//       calculateAnalytics(updatedTransactions);
//     } catch (error) {
//       console.error("Error deleting transaction:", error);
//     }
//   };

//   return (
//     <div className="container mx-auto p-4">
//       <h1 className="text-4xl font-bold text-center mb-6">
//         Transaction Analytics
//       </h1>

//       {/* Analytics Summary */}
//       <div className="flex justify-between mb-6 text-black">
//         <div className="bg-green-100 p-4 rounded-lg shadow-md w-1/4 text-center">
//           <h2 className="text-lg font-semibold">Total Income</h2>
//           <p className="text-2xl font-bold text-green-600">{income}</p>
//         </div>
//         <div className="bg-red-100 p-4 rounded-lg shadow-md w-1/4 text-center">
//           <h2 className="text-lg font-semibold">Total Outgoing</h2>
//           <p className="text-2xl font-bold text-red-600">{outgoing}</p>
//         </div>
//         <div className="bg-blue-100 p-4 rounded-lg shadow-md w-1/4 text-center">
//           <h2 className="text-lg font-semibold">Profit/Loss</h2>
//           <p className="text-2xl font-bold text-blue-600">
//             {profit + payments}
//           </p>
//         </div>
//       </div>

//       {/* Transaction Form */}
//       <form onSubmit={handleTransactionSubmit} className="mb-6">
//         <div className="flex space-x-4">
//           <select
//             className="w-1/4 p-2 border rounded bg-black text-white"
//             value={newTransaction.incomeOrPayment}
//             onChange={(e) =>
//               setNewTransaction({
//                 ...newTransaction,
//                 incomeOrPayment: e.target.value,
//               })
//             }
//           >
//             <option value="in">Income</option>
//             <option value="out">Payment</option>
//           </select>

//           <input
//             type="text"
//             placeholder="Reason"
//             className="w-1/4 p-2 border rounded text-black"
//             value={newTransaction.reasonOfTransaction}
//             onChange={(e) =>
//               setNewTransaction({
//                 ...newTransaction,
//                 reasonOfTransaction: e.target.value,
//               })
//             }
//           />

//           <input
//             type="number"
//             placeholder="Amount"
//             className="w-1/4 p-2 border rounded text-black"
//             value={newTransaction.amount}
//             onChange={(e) =>
//               setNewTransaction({
//                 ...newTransaction,
//                 amount: parseFloat(e.target.value),
//               })
//             }
//           />

//           <input
//             type="number"
//             placeholder="Customer Phone Number"
//             className="w-1/4 p-2 border rounded text-black"
//             value={newTransaction.phoneNumber}
//             onChange={(e) =>
//               setNewTransaction({
//                 ...newTransaction,
//                 phoneNumber: e.target.value,
//               })
//             }
//           />

//           <button
//             type="submit"
//             className="bg-blue-500 text-white p-2 rounded w-1/4"
//           >
//             Add Transaction
//           </button>
//         </div>
//       </form>

//       {/* Transaction List */}
//       <table className="min-w-full table-auto border-collapse">
//         <thead>
//           <tr className="bg-black text-white">
//             <th className="p-3 text-left">Reason</th>
//             <th className="p-3 text-left">Amount</th>
//             <th className="p-3 text-left">Type</th>
//             <th className="p-3 text-left">Date</th>
//             <th className="p-3 text-left">Actions</th>
//           </tr>
//         </thead>
//         <tbody>
//           {transactions.map((transaction) => (
//             <tr key={transaction._id} className="border-b">
//               <td className="p-3">{transaction.reasonOfTransaction}</td>
//               <td className="p-3">{transaction.amount}</td>
//               <td className="p-3">
//                 <span
//                   className={`text-$
//                     {transaction.incomeOrPayment === "in" ? "green" : "red"}
//                     -500`}
//                 >
//                   {transaction.incomeOrPayment === "in" ? "Income" : "Payment"}
//                 </span>
//               </td>
//               <td className="p-3">
//                 {transaction.createdAt
//                   ? convertToEthiopianDateMoreEnhanced(
//                       new Date(transaction.createdAt)
//                     ).formattedDate
//                   : "N/A"}
//               </td>
//               <td className="p-3">
//                 <button
//                   onClick={() => handleDeleteTransaction(transaction._id)}
//                   className="text-red-600 hover:underline"
//                 >
//                   Delete
//                 </button>
//               </td>
//               <td>
//                 <SMSButton
//                   phoneNumber={transaction.phoneNumber}
//                   transaction={transaction}
//                 />
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default TransactionsPage;
