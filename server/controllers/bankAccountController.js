import Account from "../models/bankAccountModel.js";
import User from "../models/userModel.js";
import { embedUserStateToPineconeLocal } from "../controllers/ragAIController.js";
import Transaction from "../models/transactionModel.js";

// Create a new account
const createAccount = async (req, res) => {
  try {
    const { accountName, accountType, userId, balance } = req.body;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const newAccount = new Account({
      accountName,
      accountType,
      userId,
      balance,
    });

    if (balance > 0 && (accountType === "Savings" || accountType === "Debit")) {
      newAccount.incoming = balance;
    }

    else if (balance > 0 && accountType === "Credit") {
      newAccount.spending = balance;
    }

    const savedAccount = await newAccount.save();
    // Create initial balance transaction if balance > 0
    if (balance > 0) {
      const initialTransaction = new Transaction({
        userId: userId,
        accountNumber: savedAccount._id, // This is the ObjectId reference to Account
        accountName: savedAccount.accountName,
        transactionName: "Bank Account initial balance",
        category: "Deposit",
        amount: balance,
      });
      await initialTransaction.save();
    }

    embedUserStateToPineconeLocal(userId, false);
    res.status(201).send(savedAccount);
  } catch (error) {
    res.status(500).json({ message: "Error creating account", error });
  }
};

// Get account details by userId
const getAccountByUserId = async (req, res) => {
  try {
    const { userId } = req.params;

    const account = await Account.find({ userId });
    if (!account) {
      return res.status(404).send({ message: "Account not found" });
    }

    res.send(account);
  } catch (error) {
    res.status(500).send({ message: "Error retrieving account", error });
  }
};

export { createAccount, getAccountByUserId };
