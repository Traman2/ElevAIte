import { useEffect, useState } from "react";
import axios from "axios";
import downloadSingleAccountExcel from "../../../utils/TransactionAccountExcel";
import downloadAllExcel from "../../../utils/TransactionExcel";

interface Props {
  onAddTransaction: () => void;
  userData: UserData | null;
  onShowTransactionTable: (accountNumber: string) => void;
}

interface UserBankAccount {
  _id: string;
  accountNumber: string;
  accountName: string;
  accountType: string;
  userId: string;
  balance: number;
  incoming: number;
  spending: number;
}

interface UserTransactions {
  _id: string;
  userId: string;
  accoundNumber: string;
  accountName: string;
  transactionName: string;
  category: string;
  amount: number;
  createdAt: string;
}

interface UserData {
  _id: string;
  userName: string;
  firstName: string;
  lastName: string;
  email: string;
}

export default function Transactions({ onAddTransaction, userData, onShowTransactionTable }: Props) {
  const [userBankAccounts, setUserBankAccounts] = useState<
    UserBankAccount[] | null
  >(null);

  const [userTransactions, setUserTransactions] = useState<
    UserTransactions[] | null
  >(null);

  useEffect(() => {
    if (!userData) return;
    const fetchUserData = () => {
      axios
        .get(`http://localhost:3000/bankaccount/${userData._id}`)
        .then((response) => {
          setUserBankAccounts(response.data);
        })
        .catch((err) => {
          console.error("Error fetching user data:", err);
        });
    };

    fetchUserData();
  }, [userData]);

  useEffect(() => {
    if (!userData) return;
    const fetchUserTransactions = () => {
      axios
        .get(`http://localhost:3000/transaction/user/${userData._id}`)
        .then((response) => {
          setUserTransactions(response.data);
        })
        .catch((err) => {
          console.error("Error fetching user data:", err);
        });
    };

    fetchUserTransactions();
  }, [userData]);

  const formatCurrency = (amount: number): string => {
    return amount.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
    });
  };

  return (
    <div>
      <div className="flex">
        <h1 className="text-2xl font-bold text-[#3F3131] font-(family-name:--font-IBMPlexSans)">
          Transactions
        </h1>
        <button
          onClick={onAddTransaction}
          className="cursor-pointer font-semibold bg-[#D9D9D9] hover:bg-[#FCD34D] px-3 rounded-2xl transition-colors duration-200 flex items-center font-(family-name:--font-IBMPlexSans) ml-4"
        >
          Add
        </button>
      </div>

      <p className="font-medium text-[#3F3131] mb-5 font-(family-name:--font-IBMPlexSans)">
        Credit Card Payment Due 1 Aug, 2025
      </p>

      <h2 className="text-xl font-semibold text-[#3F3131] font-(family-name:--font-IBMPlexSans) mb-2">
        Accounts
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-5">
        {userBankAccounts ? (
          userBankAccounts.map((account) => (
            <>
              <div className={`${
                      account.accountType === "Credit"
                        ? "bg-[#EE9898] border border-[#DA7C7C]"
                        : "bg-[#57C785]/60 border border-[#4CAF75]/43"
                    } rounded-2xl pt-3 pb-1 px-4 min-h-16`}>
                <div className="mb-1">
                  <h3 className="text-sm font-medium text-[#3F3131] font-(family-name:--font-IBMPlexSans)">
                    {account.accountName} ...1234
                  </h3>
                  <p className="text-lg font-bold text-[#3F3131] font-(family-name:--font-IBMPlexSans)">
                    USD {formatCurrency(account.balance)}
                  </p>
                </div>
                <div className="flex flex-row items-center justify-start gap-x-2 mt-2 mb-2">
                  <button
                    className="w-auto cursor-pointer font-semibold bg-[#D9D9D9] hover:bg-[#004687]/60 px-3 py-0.5 rounded-2xl transition-colors duration-200 flex items-center justify-center font-['IBM_Plex_Sans'] text-sm"
                    onClick={() => onShowTransactionTable(account._id)}
                  >
                    Transactions
                  </button>
                  <button className="w-auto cursor-pointer font-semibold bg-[#D9D9D9] hover:bg-[#1E90FF] px-3 py-0.5 rounded-2xl transition-colors duration-200 flex items-center justify-center font-['IBM_Plex_Sans'] text-sm">
                    Maps
                  </button>
                  <button
                    onClick={() =>
                      downloadSingleAccountExcel(account.accountName, userTransactions || [])
                    }
                    className="w-auto cursor-pointer font-semibold bg-[#D9D9D9] hover:bg-[#FFD700] px-3 py-0.5 rounded-2xl transition-colors duration-200 flex items-center justify-center font-['IBM_Plex_Sans'] text-sm"
                  >
                    Excel
                  </button>
                </div>
                
              </div>
            </>
          ))
        ) : (
          <p className="font-medium text-[#3F3131] mb-5 font-(family-name:--font-IBMPlexSans)">
            No accounts found
          </p>
        )}
      </div>
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-xl font-semibold text-[#3F3131] font-(family-name:--font-IBMPlexSans)">
          Recent Purchases
        </h2>
        <button
          onClick={() => downloadAllExcel(userTransactions || [], userBankAccounts || [])}
          className="cursor-pointer bg-[#D9D9D9] hover:bg-[#FFD700] text-black font-semibold px-4 py-1 rounded-2xl text-sm transition"
        >
          Download Excel
        </button>
      </div>

      <div className="relative rounded-lg overflow-x-auto">
        <table className="w-full bg-white shadow-lg">
          <thead className="sticky top-0 z-10 bg-[#EED2D2] text-[#3F3131] font-(family-name:--font-IBMPlexSans)">
            <tr>
              <th className="py-3 px-4 text-left font-semibold">Account</th>
              <th className="py-3 px-4 text-left font-semibold">Name</th>
              <th className="py-3 px-4 text-left font-semibold">Category</th>
              <th className="py-3 px-4 text-left font-semibold">Price</th>
            </tr>
          </thead>
          <tbody>
            {userTransactions ? (
              userTransactions
                .sort(
                  (a, b) =>
                    new Date(b.createdAt).getTime() -
                    new Date(a.createdAt).getTime()
                )
                .slice(0, 5)
                .map((transactions) => (
                  <tr className="border-b border-[#F4D5D5] last:border-b-0 transition-colors bg-white" key={transactions._id}>
                    <td className="py-3 px-4 font-medium text-[#3F3131] font-(family-name:--font-IBMPlexSans)">{transactions.accountName}</td>
                    <td className="py-3 px-4 font-medium text-[#3F3131] font-(family-name:--font-IBMPlexSans)">{transactions.transactionName}</td>
                    <td className="py-3 px-4 font-medium text-[#5C543C] font-(family-name:--font-IBMPlexSans)">{transactions.category}</td>
                    <td className="py-3 px-4 font-medium text-[#5C543C] font-(family-name:--font-IBMPlexSans)">{formatCurrency(transactions.amount)}</td>
                  </tr>
                ))
            ) : (
              <tr><td colSpan={4} className="py-3 px-4 text-center text-[#3F3131] font-(family-name:--font-IBMPlexSans)">No transactions found</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
