import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

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

export default async function downloadAllExcel(
  userTransactions: UserTransactions[],
  userBankAccounts: UserBankAccount[]
) {
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
      const amount =
        txn.category.toLowerCase() === "withdraw"
          ? -Math.abs(txn.amount)
          : txn.amount;
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

    sheet.getColumn("amount").numFmt = '"$"#,##0.00;[Red]-"$"#,##0.00';
  }
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });

  saveAs(blob, "transactions_by_account.xlsx");
}
