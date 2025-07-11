import { pinecone } from "../services/pinecone.js";
import { generateUserDataDocument } from "../controllers/ragDocumentGenerator.js";

const embedUserStateToPinecone = async (req, res) => {
  try {
    const { userId } = req.params;
    const indexName = "vectordb";
    const namespace = userId.toString();
    const data = await generateUserDataDocument(userId);
    const index = pinecone.index(indexName).namespace(namespace);
    console.log(data); // DEBUG

    const createRecord = (id, text, type, name) => ({
      id,
      chunk_text: text,
      type,
      name,
    });

    const bankAccountChunks = data.bankAccounts.map((acc) =>
      createRecord(
        `bankaccount-${acc.accountId}-${userId}`,
        `ID: ${acc.accountId} | ${acc.accountName} (${
          acc.accountType
        }) - Balance: $${acc.balance.toFixed(2)}`,
        "bank_account",
        acc.accountName
      )
    );

    const transactionChunks = data.transactions.map((tx) => {
      const date = new Date(tx.createdAt).toLocaleDateString();
      return createRecord(
        `transaction-${tx.transactionId}-${userId}`,
        `ID: ${tx.transactionId} | Name: ${tx.transactionName}\nAccount: ${tx.accountName} | Category: ${tx.category} | Amount: $${tx.amount}\nDate: ${date}`,
        "transaction",
        tx.transactionName
      );
    });

    const today = new Date();

    const classAssignmentsSummary = data.classes.map((cls) => {
      const relatedTasks = data.tasks.filter(
        (task) =>
          task.relatedClass?.classId?.toString() === cls.classId.toString()
      );

      const pendingCount = relatedTasks.filter(
        (t) => t.status.toLowerCase() === "pending"
      ).length;
      const completedCount = relatedTasks.filter(
        (t) => t.status.toLowerCase() === "completed"
      ).length;
      const overdueCount = relatedTasks.filter((t) => {
        const due = new Date(t.dueDate);
        return t.status.toLowerCase() !== "completed" && due < today;
      }).length;

      return {
        classId: cls.classId,
        className: cls.className,
        pendingCount,
        completedCount,
        overdueCount,
      };
    });

    const classesText = classAssignmentsSummary
      .map(
        (cls) =>
          `ID: ${cls.classId} | Class: ${cls.className} | Assignments: Pending ${cls.pendingCount}, Completed ${cls.completedCount}, Overdue ${cls.overdueCount}`
      )
      .join("\n");

    const taskChunks = data.tasks.map((task) => {
      const due = new Date(task.dueDate).toLocaleDateString();
      const relatedClassName = task.relatedClass?.className || "Unknown Class";
      return createRecord(
        `task-${task.taskId}-${userId}`,
        `ID: ${task.taskId} | Task: ${task.taskName} [${relatedClassName}] - Due: ${due} - Status: ${task.status}`,
        "task",
        `task-${relatedClassName}`
      );
    });

    const internshipChunks = data.internships.map((intern) =>
      createRecord(
        `internship-${intern.internshipId}-${userId}`,
        `ID: ${intern.internshipId} | Name: ${intern.name} | Employer: ${intern.employer} | Category: ${intern.category}\n` +
          `Status: ${intern.status} | Date: ${intern.date}\n` +
          `Description: ${intern.description || "No description"}\n` +
          `Created At: ${new Date(
            intern.createdAt
          ).toLocaleString()} | Updated At: ${new Date(
            intern.updatedAt
          ).toLocaleString()}`,
        "internship",
        intern.name
      )
    );

    const summaryText =
      `Summary:\n` +
      `Total Bank Accounts: ${
        data.summary.totalBankAccounts
      } | Total Balance: $${data.summary.totalBalanceAcrossAllAccounts.toFixed(
        2
      )}\n` +
      `Total Tasks: ${data.summary.totalTasks} | Completed: ${data.summary.completedTasks} | Pending: ${data.summary.pendingTasks}\n` +
      `Total Classes: ${data.summary.totalClasses}\n` +
      `Total Internships: ${data.summary.totalInternships} | Accepted: ${data.summary.acceptedInternships} | Pending: ${data.summary.pendingInternships}`;

    const records = [
      ...bankAccountChunks,
      ...transactionChunks,
      createRecord(
        `classes-${userId}`,
        classesText,
        "class_summary",
        "classes_summary"
      ),
      ...taskChunks,
      ...internshipChunks,
      createRecord(`summary-${userId}`, summaryText, "summary", "summary"),
    ];

    await index.upsertRecords(records, { namespace });

    res
      .status(200)
      .json(`Embedded all user data chunks for user ${userId} successfully.`);
  } catch (error) {
    console.error(`Error embedding data for user ${req.params.userId}:`, error);
    res
      .status(400)
      .json(
        `Error embedding data for user ${req.params.userId}: ${error.message}`
      );
  }
};

export { embedUserStateToPinecone };
