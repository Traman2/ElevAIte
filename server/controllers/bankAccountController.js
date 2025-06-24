import Account from "../models/bankAccountModel.js";
import User from "../models/userModel.js";

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
