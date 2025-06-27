import { useEffect, useState } from "react";
import axios from "axios";
import downloadAllExcel from "../../../utils/TransactionExcel";

interface Props {
  onAddAsset: () => void;
  userData: UserData | null;
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

export default function Accounts({ onAddAsset, userData }: Props) {
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
          Accounts
        </h1>
        <button
          onClick={onAddAsset}
          className="cursor-pointer font-semibold bg-[#D9D9D9] hover:bg-[#FCD34D] px-3 rounded-2xl transition-colors duration-200 flex items-center font-(family-name:--font-IBMPlexSans) ml-4"
        >
          Add
        </button>
      </div>

      <p className="font-medium text-[#3F3131] mb-3 font-(family-name:--font-IBMPlexSans)">
        Interest Payment on 12 Jul, 2025 for Account ...1202
      </p>

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
                <div className="grid grid-cols-2 gap-4 items-start mt-3 mb-0">
                  <div className="flex flex-col items-start space-y-0.5">
                    <div className="flex items-center space-x-1">
                      <img
                        src="/icons/overview/ant-design--stock-outlined.svg"
                        alt="Incoming"
                        className="w-4 h-4"
                      />
                      <p className="text-sm font-medium text-[#3F3131] font-(family-name:--font-IBMPlexSans)">
                        Incoming
                      </p>
                    </div>
                    <p className="text-sm font-bold text-[#3F3131] font-(family-name:--font-IBMPlexSans)">
                      USD {formatCurrency(account.incoming)}
                    </p>
                  </div>
                  <div className="flex flex-col items-start pb-2 space-y-0.5">
                    <div className="flex items-center space-x-1">
                      <img
                        src="/icons/overview/uil--money-withdraw.svg"
                        alt="Spending"
                        className="w-4 h-4"
                      />
                      <p className="text-sm font-medium text-[#3F3131] font-(family-name:--font-IBMPlexSans)">
                        Spending
                      </p>
                    </div>
                    <p className="text-sm font-bold text-[#3F3131] font-(family-name:--font-IBMPlexSans)">
                      USD {formatCurrency(account.spending)}
                    </p>
                  </div>
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
          Recent Deposits
        </h2>
        <button
          onClick={() => downloadAllExcel(userTransactions || [], userBankAccounts || [])}
          className="cursor-pointer bg-[#D9D9D9] hover:bg-[#FFD700] text-black font-semibold px-4 py-1 rounded-2xl text-sm transition"
        >
          Download Excel
        </button>
      </div>
    </div>
  );
}
