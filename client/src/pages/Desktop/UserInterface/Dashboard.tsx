import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

interface UserData {
  _id: number;
  userName: string;
  firstName: string;
  lastName: string;
  email: string;
}

interface Props {
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

export default function Dashboard({ userData }: Props) {
  const navigate = useNavigate();
  const [userBankAccounts, setUserBankAccounts] = useState<
    UserBankAccount[] | null
  >(null);

  const handleTransactions = () => {
    navigate("/Transactions");
  };

  const handleAssets = () => {
    navigate("/Assets");
  };

  useEffect(() => {
    if (!userData) return;
    const fetchUserData = () => {
      axios
        .get(`http://localhost:3000/bankaccount/${userData._id}`)
        .then((response) => {
          setUserBankAccounts(response.data);
          console.log(response.data);
        })
        .catch((err) => {
          console.error("Error fetching user data:", err);
        });
    };

    fetchUserData();
  }, [userData]);

  const formatCurrency = (amount: number): string => {
    return amount.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
    });
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <h1 className="text-2xl font-bold text-[#3F3131] font-(family-name:--font-IBMPlexSans)">
        Overview
      </h1>

      <p className="font-medium text-[#3F3131] mb-3 font-(family-name:--font-IBMPlexSans)">
        Total of 3 Pending Tasks
      </p>

      <div className="grid grid-cols-4 grid-rows-2 gap-1 flex-1 min-h-0 overflow-hidden">
        <div className="bg-white rounded-lg shadow-sm px-3 pt-2 pb-1 flex flex-col min-h-0 overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-base font-bold text-[#3F3131] font-(family-name:--font-IBMPlexSans) flex-shrink-0">
              Asset Breakdown
            </h2>
            <button onClick={() => handleAssets()} className="cursor-pointer text-sm font-semibold text-[#3F3131] bg-[#F3F3F3] hover:bg-[#FCD34D] px-3 rounded-xl transition-colors duration-200 h-6 flex items-center">
              View More
            </button>
          </div>

          <div className="space-y-2 overflow-y-auto min-h-0 flex-1">
            {userBankAccounts
              ?.filter((account) => account.accountType === "Account")
              .slice(0, 2)
              .map((account) => (
                <div className="bg-[#57C785]/60 border border-[#4CAF75]/43 rounded-2xl py-3 px-4 min-h-16">
                  <div className="mb-1">
                    <h3 className="text-sm font-medium text-[#3F3131] font-(family-name:--font-IBMPlexSans)">
                      {account.accountName} ...1234
                    </h3>
                    <p className="text-lg font-bold text-[#3F3131] font-(family-name:--font-IBMPlexSans)">
                      USD {formatCurrency(account.balance)}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 items-start">
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

                    <div className="flex flex-col items-start space-y-0.5">
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
              ))}
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm col-span-2 px-3 pt-2 pb-1 flex flex-col">
          <h2 className="text-base font-bold text-[#3F3131] mb-2 font-(family-name:--font-IBMPlexSans) flex-shrink-0">
            Daily Spending to Earning Ratio
          </h2>

          <div className="flex items-center justify-center flex-1">
            <div className="border-dashed border-[#654545] py-10 px-15 rounded-4xl border-3">
              <p className="text-[#654545] text-2xl font-bold font-(family-name:--font-IBMPlexSans)">
                Graph Coming Soon
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm px-3 pt-2 pb-1 flex flex-col min-h-0 overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-base font-bold text-[#3F3131] font-(family-name:--font-IBMPlexSans) flex-shrink-0">
              Card Balance
            </h2>
            <button onClick={() => handleTransactions()} className="cursor-pointer text-sm font-semibold text-[#3F3131] bg-[#F3F3F3] hover:bg-[#FCD34D] px-3 rounded-xl transition-colors duration-200 h-6 flex items-center">
              View More
            </button>
          </div>
          <div className="space-y-2 overflow-y-auto min-h-0 flex-1">
            {userBankAccounts
              ?.filter(
                (account) =>
                  account.accountType === "Credit" ||
                  account.accountType === "Debit"
              )
              .slice(0, 2)
              .map((account) => (
                <div
                  className={`${
                    account.accountType === "Credit"
                      ? "bg-[#EE9898] border border-[#DA7C7C]"
                      : "bg-[#57C785]/60 border border-[#4CAF75]/43"
                  } rounded-2xl py-3 px-4 min-h-16`}
                >
                  <div className="mb-1">
                    <h3 className="text-sm font-medium text-[#3F3131] font-(family-name:--font-IBMPlexSans)">
                      {account.accountName} ...1314
                    </h3>
                    <p className="text-lg font-bold text-[#3F3131] font-(family-name:--font-IBMPlexSans)">
                      USD {formatCurrency(account.balance)}
                    </p>
                    <button
                      onClick={() => handleTransactions()}
                      className="font-bold font-(family-name:--font-IBMPlexSans) cursor-pointer bg-[#FFF] hover:bg-red-600 text-[#574545] px-2 py-1 mt-2 rounded-2xl text-xs transition-colors duration-200 "
                    >
                      See Transaction History
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm px-3 pt-2 pb-1 col-span-3">
          <h2 className="text-base font-bold text-[#3F3131] mb-2 font-(family-name:--font-IBMPlexSans) flex-shrink-0">
            Upcoming Assignments
          </h2>
        </div>
        <div className="bg-white rounded-lg shadow-sm px-3 pt-2 pb-1">
          <h2 className="text-base font-bold text-[#3F3131] mb-2 font-(family-name:--font-IBMPlexSans) flex-shrink-0">
            Tasks
          </h2>
        </div>
      </div>
    </div>
  );
}
