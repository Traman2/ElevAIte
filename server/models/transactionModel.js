import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        accountNumber: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Account",
            required: true,
        },
        accountName: {
            type: String,
            required: true,
        },
        transactionName: {
            type: String,
            required: true,
        },
        category: {
            type: String,
            required: true,
            enum: ["Deposit", "Withdraw"],
        },
        amount: {
            type: Number,
            required: true,
        },
    },
    { timestamps: true }
);

export default mongoose.model("Transaction", transactionSchema);