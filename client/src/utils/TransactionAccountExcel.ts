import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

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

export default async function downloadSingleAccountExcel(
  accountName: string,
  userTransactions: UserTransactions[]
) {
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
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });

  saveAs(blob, `${accountName}_transactions.xlsx`);
};
