import Transaction from "../models/transactionModel.js";
import User from "../models/userModel.js";
import Account from "../models/bankAccountModel.js";

const createTransaction = async (req, res) => {
  try {
    const { userId, accountNumber, accountName, transactionName, category, amount } = req.body;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const acc = await Account.findById(accountNumber);
    if (!acc) {
      return res.status(404).json({ message: "Account not found" });
    }

    const amt = Number(amount);
    if (isNaN(amt) || amt <= 0) {
      return res.status(400).json({ message: "Amount must be a valid positive number" });
    }

    if (acc.accountType === "Credit") {
      if (category === "Deposit") {
        if (acc.balance < amt) {
          return res.status(400).json({ message: "Insufficient Pay off, debt too low" });
        }
        acc.balance -= amt;
        acc.incoming += amt;
        
      } else if (category === "Withdraw") {
        acc.balance += amt;
        acc.spending += amt;
      }
    } else {
      if (category === "Deposit") {
        acc.balance += amt;
        acc.incoming += amt;
      } else if (category === "Withdraw") {
        if (acc.balance < amt) {
          return res.status(400).json({ message: "Insufficient funds for withdrawal" });
        }
        acc.spending += amt;
        acc.balance -= amt;
      }
    }
    await acc.save();

    const newTransact = new Transaction({
      userId, 
      accountNumber, 
      accountName, 
      transactionName, 
      category, 
      amount
    });

    const savedTransact = await newTransact.save();
    res.status(201).send(savedTransact);
  } catch (error) {
    res.status(500).json({ message: "Error creating transaction", error });
  }
};

const getTransactionsByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    const transactions = await Transaction.find({ userId });
    res.status(200).send(transactions);
  } catch (error) {
    res.status(500).send({ message: "Error retrieving transactions", error });
  }
};

const getTransactionsByAccountNumber = async (req, res) => {
  try {
    const { accountId } = req.params;
    const transactions = await Transaction.find({
      accountNumber: accountId,
    });
    res.status(200).send(transactions);
  } catch (error) {
    res.status(500).send({ message: "Error retrieving transactions", error });
  }
};

export { createTransaction, getTransactionsByUserId, getTransactionsByAccountNumber };
