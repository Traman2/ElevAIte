import User from "../models/userModel.js";
import ClassModel from "../models/classModel.js";
import Internship from "../models/internshipModel.js";
import TaskModel from "../models/taskModel.js";
import Transaction from "../models/transactionModel.js";
import Account from "../models/bankAccountModel.js";

export const generateUserDataDocument = async (userId) => {
  try {

    if (!userId) {
      throw new Error("User ID is required");
    }

    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    const classes = await ClassModel.find({ userId });
    const internships = await Internship.find({ userId });
    const bankAccounts = await Account.find({ userId });
    const transactions = await Transaction.find({ userId });
    
    const classIds = classes.map(cls => cls._id);
    const tasks = await TaskModel.find({ classId: { $in: classIds } });

    // Create structured JSON document
    const userData = {
      userInformation: {
        userId: user._id,
        username: user.userName,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      },
      bankAccounts: bankAccounts.map(account => ({
        accountId: account._id,
        accountNumber: account.accountNumber,
        accountName: account.accountName,
        accountType: account.accountType,
        balance: account.balance,
        totalIncoming: account.incoming,
        totalSpending: account.spending,
        createdAt: account.createdAt,
        updatedAt: account.updatedAt
      })),
      transactions: transactions.map(transaction => ({
        transactionId: transaction._id,
        transactionName: transaction.transactionName,
        accountName: transaction.accountName,
        category: transaction.category,
        amount: transaction.amount,
        createdAt: transaction.createdAt
      })),
      classes: classes.map(cls => ({
        classId: cls._id,
        className: cls.className,
        createdAt: cls.createdAt,
        updatedAt: cls.updatedAt
      })),
      tasks: tasks.map(task => {
        const relatedClass = classes.find(cls => cls._id.toString() === task.classId.toString());
        return {
          taskId: task._id,
          taskName: task.name,
          status: task.isComplete ? 'Completed' : 'Pending',
          dueDate: task.dueDate,
          relatedClass: relatedClass ? {
            classId: relatedClass._id,
            className: relatedClass.className
          } : null,
          createdAt: task.createdAt,
          updatedAt: task.updatedAt
        };
      }),
      internships: internships.map(internship => ({
        internshipId: internship._id,
        name: internship.name,
        employer: internship.employer,
        category: internship.category,
        status: internship.status,
        date: internship.date,
        description: internship.description || 'No description provided',
        createdAt: internship.createdAt,
        updatedAt: internship.updatedAt
      })),
      summary: {
        totalBankAccounts: bankAccounts.length,
        totalTransactions: transactions.length,
        totalClasses: classes.length,
        totalTasks: tasks.length,
        totalInternships: internships.length,
        totalBalanceAcrossAllAccounts: bankAccounts.reduce((sum, account) => sum + account.balance, 0),
        totalIncoming: bankAccounts.reduce((sum, account) => sum + account.incoming, 0),
        totalSpending: bankAccounts.reduce((sum, account) => sum + account.spending, 0),
        completedTasks: tasks.filter(task => task.isComplete).length,
        pendingTasks: tasks.filter(task => !task.isComplete).length,
        acceptedInternships: internships.filter(internship => internship.status === 'Accepted').length,
        pendingInternships: internships.filter(internship => internship.status === 'Pending').length
      }
    };

    return userData;

  } catch (error) {
    console.error("Error generating user data document:", error);
    throw error;
  }
};