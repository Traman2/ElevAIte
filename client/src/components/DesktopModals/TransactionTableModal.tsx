import { useEffect, useState } from "react";
import axios from "axios";

interface UserTransactions {
  _id: string;
  userId: string;
  accoundNumber: number;
  accountName: string;
  transactionName: string;
  category: string;
  amount: number;
  createdAt: string;
}

interface TransactionTableProps {
    onClose?: () => void;
    accountNumber: string;
}

export default function TransactionTableModal({ accountNumber, onClose } : TransactionTableProps) {
  const [userTransactions, setUserTransactions] = useState<
    UserTransactions[] | null
  >(null);

  useEffect(() => {
    if (!accountNumber) return;
    const fetchUserTransactions = () => {
      axios
        .get(`http://localhost:3000/transaction/account/${accountNumber}`)
        .then((response) => {
          setUserTransactions(response.data);
          console.log(response.data);
        })
        .catch((err) => {
          console.error("Error fetching user data:", err);
        });
    };

    fetchUserTransactions();
  }, [accountNumber]);

  const formatCurrency = (amount: number): string => {
    return amount.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
    });
  };

  return (
    <>
      <div className="bg-white rounded-lg p-8 shadow-lg w-[800px] min-h-[500px] flex flex-col">
        <h2 className="text-2xl font-bold text-[#3F3131] font-(family-name:--font-IBMPlexMono) mb-4">
          {Array.isArray(userTransactions) && userTransactions.length > 0
            ? userTransactions[0].accountName
            : "No Transactions"}
        </h2>
        <div className="relative overflow-x-auto overflow-y-auto rounded-lg border-3 border-gray-400 shadow-lg font-(family-name:--font-IBMPlexSans) flex-1 max-h-[350px]">
          <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-[#c2bcbc]">
              <tr>
                <th scope="col" className="px-6 py-3">
                  Account
                </th>
                <th scope="col" className="px-6 py-3">
                  Name
                </th>
                <th scope="col" className="px-6 py-3">
                  Category
                </th>
                <th scope="col" className="px-6 py-3">
                  Price
                </th>
              </tr>
            </thead>
            <tbody>
              {userTransactions && userTransactions.length > 0 ? (
                userTransactions
                  .sort(
                    (a, b) =>
                      new Date(b.createdAt).getTime() -
                      new Date(a.createdAt).getTime()
                  )
                  .slice(0, 5)
                  .map((transactions) => (
                    <tr className="bg-[#D9D4D4] border-b border-gray-400" key={transactions._id}>
                      <td className="px-6 pr-29 py-4 text-gray-700">
                        {transactions.accountName}
                      </td>
                      <th className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                        {transactions.transactionName}
                      </th>
                      <td className="px-6 py-4 text-gray-700">
                        {transactions.category}
                      </td>
                      <td className="px-6 py-4 text-gray-700">
                        {formatCurrency(transactions.amount)}
                      </td>
                    </tr>
                  ))
              ) : (
                <tr>
                  <td colSpan={4} className="text-center py-6 font-medium text-[#3F3131] font-(family-name:--font-IBMPlexSans)">
                    No transactions found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="mt-6">
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer text-sm bg-gray-300 font-(family-name:--font-IBMPlexSans) text-[#3F3131] font-semibold py-2 px-4 rounded-xl shadow-md hover:bg-gray-400 transition-colors duration-200"
          >
            Close
          </button>
        </div>
      </div>
    </>
  );
}
