import { useEffect, useState } from "react";
import axios from "axios";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

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
  accoundNumber: number;
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

  const downloadStyledExcel = async () => {
    if (!userTransactions || !userBankAccounts) return;

    const workbook = new ExcelJS.Workbook();

    for (const account of userBankAccounts) {
      const sheet = workbook.addWorksheet(account.accountName || "Account");

      const accountTransactions = userTransactions.filter(
        (txn) => txn.accountName === account.accountName
      );

      const formatDate = (dateStr: string) => {
        const dateObj = new Date(dateStr);
        return `${String(dateObj.getDate()).padStart(2, "0")}/${String(
          dateObj.getMonth() + 1
        ).padStart(2, "0")}/${dateObj.getFullYear()}`;
      };

      sheet.columns = [
        { header: "Date", key: "date", width: 15 },
        { header: "Transaction", key: "transactionName", width: 30 },
        { header: "Category", key: "category", width: 20 },
        { header: "Amount", key: "amount", width: 15 },
      ];

      accountTransactions.forEach((txn) => {
        const amount = txn.category.toLowerCase() === "withdraw" ? -Math.abs(txn.amount) : txn.amount;
        sheet.addRow({
          date: formatDate(txn.createdAt),
          transactionName: txn.transactionName,
          category: txn.category,
          amount,
        });
      });

      const rowCount = accountTransactions.length;

      const totalRow = sheet.addRow([
        "",
        "",
        "Total",
        { formula: `SUM(D2:D${rowCount + 1})`, result: 0 },
      ]);
      totalRow.font = { bold: true };
      totalRow.eachCell((cell) => {
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "B5B5B4" },
        };
      });

      sheet.getRow(1).eachCell((cell) => {
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FFD700" },
        };
        cell.font = { bold: true };
      });

      sheet.eachRow((row, rowNumber) => {
        if (rowNumber !== 1 && rowNumber !== rowCount + 2) {
          row.eachCell((cell) => {
            cell.fill = {
              type: "pattern",
              pattern: "solid",
              fgColor: { argb: "D9D9D9" },
            };
          });
        }
      });

      sheet.getColumn("amount").numFmt = '"$"#,##0.00;[Red]\-"$"#,##0.00';
    }
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    saveAs(blob, "transactions_by_account.xlsx");
  };

  const downloadSingleAccountExcel = async (accountName: string) => {
    if (!userTransactions) return;

    const accountTransactions = userTransactions.filter(
      (txn) => txn.accountName === accountName
    );

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet(accountName || "Account");

    const formatDate = (dateStr: string) => {
      const dateObj = new Date(dateStr);
      return `${String(dateObj.getDate()).padStart(2, "0")}/${String(
        dateObj.getMonth() + 1
      ).padStart(2, "0")}/${dateObj.getFullYear()}`;
    };

    sheet.columns = [
      { header: "Date", key: "date", width: 15 },
      { header: "Transaction", key: "transactionName", width: 30 },
      { header: "Category", key: "category", width: 20 },
      { header: "Amount", key: "amount", width: 15 },
    ];

    accountTransactions.forEach((txn) => {
      const amount = txn.category.toLowerCase() === "withdraw" ? -Math.abs(txn.amount) : txn.amount;
      sheet.addRow({
        date: formatDate(txn.createdAt),
        transactionName: txn.transactionName,
        category: txn.category,
        amount,
      });
    });

    const rowCount = accountTransactions.length;

    const totalRow = sheet.addRow([
      "",
      "",
      "Total",
      { formula: `SUM(D2:D${rowCount + 1})`, result: 0 },
    ]);
    totalRow.font = { bold: true };
    totalRow.eachCell((cell) => {
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "B5B5B4" },
      };
    });

    sheet.getRow(1).eachCell((cell) => {
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFD700" },
      };
      cell.font = { bold: true };
    });

    sheet.eachRow((row, rowNumber) => {
      if (rowNumber !== 1 && rowNumber !== rowCount + 2) {
        row.eachCell((cell) => {
          cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "D9D9D9" },
          };
        });
      }
    });
    sheet.getColumn("amount").numFmt = '"$"#,##0.00;[Red]\-"$"#,##0.00';
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    saveAs(blob, `${accountName}_transactions.xlsx`);
  };

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
                      downloadSingleAccountExcel(account.accountName)
                    }
                    className="w-auto cursor-pointer font-semibold bg-[#D9D9D9] hover:bg-[#FFD700] px-3 py-0.5 rounded-2xl transition-colors duration-200 flex items-center justify-center font-['IBM_Plex_Sans'] text-sm"
                  >
                    Excel
                  </button>
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
          Recent Purchases
        </h2>
        <button
          onClick={() => downloadStyledExcel()}
          className="cursor-pointer bg-[#D9D9D9] hover:bg-[#FFD700] text-black font-semibold px-4 py-1 rounded-2xl text-sm transition"
        >
          Download Excel
        </button>
      </div>

      <div className="relative overflow-x-auto rounded-lg border-3 border-gray-400 shadow-lg font-(family-name:--font-IBMPlexSans)">
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
            {userTransactions ? (
              userTransactions
                .sort(
                  (a, b) =>
                    new Date(b.createdAt).getTime() -
                    new Date(a.createdAt).getTime()
                )
                .slice(0, 5)
                .map((transactions) => (
                  <>
                    <tr className="bg-[#D9D4D4] border-b border-gray-400">
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
                  </>
                ))
            ) : (
              <p className="font-medium text-[#3F3131] mb-5 font-(family-name:--font-IBMPlexSans)">
                No transactions found
              </p>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
